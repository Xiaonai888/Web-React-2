import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SUPPORTED_LANGUAGES = new Set(['en', 'zh', 'ja', 'ko'])
const translationCache = new Map()
const MAX_CACHE_ENTRIES = 40

function contentFingerprint(content) {
  const source = String(content || '')
  return `${source.length}:${source.slice(0, 80)}:${source.slice(-80)}`
}

function buildCacheKey(episodeId, content, language) {
  return [
    String(episodeId || ''),
    language,
    contentFingerprint(content),
  ].join(':')
}

function saveCache(key, value) {
  translationCache.set(key, value)

  while (translationCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = translationCache.keys().next().value
    if (!oldestKey) break
    translationCache.delete(oldestKey)
  }
}

export default function useEpisodeTranslation({
  episodeId,
  content,
}) {
  const sourceContent = String(content || '')
  const [activeLanguage, setActiveLanguage] =
    useState('original')
  const [translatedContent, setTranslatedContent] =
    useState(null)
  const [loading, setLoading] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  const requestRef = useRef(null)
  const requestIdRef = useRef(0)

  const reset = useCallback(() => {
    requestIdRef.current += 1
    requestRef.current?.abort()
    requestRef.current = null
    setActiveLanguage('original')
    setTranslatedContent(null)
    setLoading(false)
    setErrorCode('')
  }, [])

  useEffect(() => {
    reset()

    return () => {
      requestIdRef.current += 1
      requestRef.current?.abort()
      requestRef.current = null
    }
  }, [episodeId, sourceContent, reset])

  const translateTo = useCallback(
    async (language) => {
      const targetLanguage = String(language || '')
        .trim()
        .toLowerCase()

      if (targetLanguage === 'original') {
        reset()
        return true
      }

      if (
        !SUPPORTED_LANGUAGES.has(targetLanguage) ||
        !sourceContent.trim()
      ) {
        setErrorCode(
          !sourceContent.trim()
            ? 'CONTENT_REQUIRED'
            : 'UNSUPPORTED_LANGUAGE'
        )
        return false
      }

      const cacheKey = buildCacheKey(
        episodeId,
        sourceContent,
        targetLanguage
      )
      const cachedContent = translationCache.get(cacheKey)

      if (typeof cachedContent === 'string') {
        setActiveLanguage(targetLanguage)
        setTranslatedContent(cachedContent)
        setErrorCode('')
        return true
      }

      requestIdRef.current += 1
      const currentRequestId = requestIdRef.current

      requestRef.current?.abort()
      const controller = new AbortController()
      requestRef.current = controller

      try {
        setLoading(true)
        setErrorCode('')

        const response = await fetch(
          `${API_BASE_URL}/api/story-translation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: sourceContent,
              target_language: targetLanguage,
            }),
            signal: controller.signal,
          }
        )

        const data = await response.json().catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false ||
          typeof data.translated_content !== 'string'
        ) {
          if (currentRequestId === requestIdRef.current) {
            setErrorCode(
              String(
                data.code ||
                `HTTP_${response.status}` ||
                'TRANSLATION_FAILED'
              )
            )
          }
          return false
        }

        if (currentRequestId !== requestIdRef.current) {
          return false
        }

        saveCache(cacheKey, data.translated_content)
        setActiveLanguage(targetLanguage)
        setTranslatedContent(data.translated_content)
        setErrorCode('')
        return true
      } catch (error) {
        if (
          error?.name !== 'AbortError' &&
          currentRequestId === requestIdRef.current
        ) {
          setErrorCode('TRANSLATION_NETWORK_ERROR')
        }
        return false
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false)
          requestRef.current = null
        }
      }
    },
    [episodeId, reset, sourceContent]
  )

  const displayContent = useMemo(
    () =>
      activeLanguage === 'original' ||
      translatedContent === null
        ? sourceContent
        : translatedContent,
    [activeLanguage, sourceContent, translatedContent]
  )

  return {
    activeLanguage,
    displayContent,
    loading,
    errorCode,
    translateTo,
    reset,
  }
}
