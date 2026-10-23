import { Fragment, useEffect, useRef, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CACHE_TTL_MS = 10 * 60 * 1000
const CACHE_LIMIT = 50
const worksCache = new Map()
const firstPageRequests = new Map()

const labelsByLanguage = {
  km: { more: 'ផ្ទុក ១០ រឿងទៀត', loading: 'កំពុងផ្ទុក...', error: 'មិនអាចផ្ទុករឿងបានទេ', retry: 'ព្យាយាមម្តងទៀត' },
  en: { more: 'Load 10 more', loading: 'Loading...', error: 'Unable to load works', retry: 'Try again' },
  zh: { more: '再加载 10 部作品', loading: '加载中...', error: '无法加载作品', retry: '重试' },
  ja: { more: 'さらに10作品を読み込む', loading: '読み込み中...', error: '作品を読み込めません', retry: '再試行' },
  ko: { more: '작품 10개 더 보기', loading: '불러오는 중...', error: '작품을 불러올 수 없습니다', retry: '다시 시도' },
}

function getAuthToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getViewerScope() {
  const token = getAuthToken()
  if (!token) return 'guest'
  let hash = 2166136261
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `viewer_${(hash >>> 0).toString(36)}`
}

function getCacheKey(username) {
  return `${getViewerScope()}:${String(username || '').trim().toLowerCase()}`
}

function readCache(key) {
  const value = worksCache.get(key)
  if (value) {
    worksCache.delete(key)
    worksCache.set(key, value)
  }
  return value || null
}

function writeCache(key, value) {
  worksCache.delete(key)
  worksCache.set(key, { ...value, key, cachedAt: Date.now() })
  while (worksCache.size > CACHE_LIMIT) {
    worksCache.delete(worksCache.keys().next().value)
  }
}

async function fetchWorksPage(username, beforeId = '', includeTotal = false) {
  const params = new URLSearchParams({ limit: '10' })
  if (beforeId) params.set('before_id', beforeId)
  if (includeTotal) params.set('include_total', '1')
  const token = getAuthToken()
  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/works?${params.toString()}`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  )
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Unable to load works')
  }
  return {
    works: Array.isArray(data.works) ? data.works : [],
    hasMore: Boolean(data.has_more),
    cursor: data.next_before_id || null,
    totalCount: Number.isFinite(Number(data.total_count)) && data.total_count != null
      ? Number(data.total_count)
      : null,
  }
}

function getFirstPage(username, key) {
  const existing = firstPageRequests.get(key)
  if (existing) return existing
  const request = fetchWorksPage(username, '', true).then((page) => {
    writeCache(key, page)
    return page
  })
  firstPageRequests.set(key, request)
  request.then(
    () => {
      if (firstPageRequests.get(key) === request) firstPageRequests.delete(key)
    },
    () => {
      if (firstPageRequests.get(key) === request) firstPageRequests.delete(key)
    }
  )
  return request
}

export default function AuthorWorksTab({ author, renderWork, renderEmpty, onTotalCountChange }) {
  const { t } = useDisplayTranslation()
  const username = String(author?.page_username || '').trim()
  const cacheKey = getCacheKey(username)
  const [snapshot, setSnapshot] = useState(() => readCache(cacheKey))
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)
  const loadingMoreRef = useRef(false)
  const currentKeyRef = useRef(cacheKey)
  currentKeyRef.current = cacheKey
  const labels = labelsByLanguage[getDisplayLanguageId()] || labelsByLanguage.en
  const visible = snapshot?.key === cacheKey ? snapshot : worksCache.get(cacheKey) || null

  useEffect(() => {
    let active = true
    loadingMoreRef.current = false
    setLoadingMore(false)
    setError('')

    if (!username) {
      setSnapshot(null)
      setLoading(false)
      return () => { active = false }
    }

    const cached = readCache(cacheKey)
    if (cached) {
      setSnapshot(cached)
      onTotalCountChange?.(cached.totalCount)
      if (Date.now() - cached.cachedAt < CACHE_TTL_MS) {
        setLoading(false)
        return () => { active = false }
      }
    } else {
      setSnapshot(null)
    }

    setLoading(!cached)
    getFirstPage(username, cacheKey)
      .then((page) => {
        if (!active || currentKeyRef.current !== cacheKey) return
        const next = { ...page, key: cacheKey, cachedAt: Date.now() }
        writeCache(cacheKey, next)
        setSnapshot(next)
        onTotalCountChange?.(page.totalCount)
      })
      .catch(() => {
        if (active && currentKeyRef.current === cacheKey && !cached) setError(labels.error)
      })
      .finally(() => {
        if (active && currentKeyRef.current === cacheKey) setLoading(false)
      })

    return () => { active = false }
  }, [username, cacheKey, retryKey])

  async function loadMore() {
    if (!visible?.hasMore || !visible.cursor || loadingMoreRef.current || loading) return
    loadingMoreRef.current = true
    setLoadingMore(true)
    setError('')
    const requestedKey = cacheKey
    try {
      const page = await fetchWorksPage(username, visible.cursor)
      if (currentKeyRef.current !== requestedKey) return
      setSnapshot((current) => {
        if (!current || current.key !== requestedKey) return current
        const seen = new Set(current.works.map((item) => String(item.id)))
        const unique = page.works.filter((item) => !seen.has(String(item.id)))
        const next = {
          ...current,
          works: [...current.works, ...unique],
          hasMore: page.hasMore,
          cursor: page.cursor,
          cachedAt: Date.now(),
        }
        writeCache(requestedKey, next)
        return next
      })
    } catch (loadError) {
      if (currentKeyRef.current === requestedKey) setError(loadError.message || labels.error)
    } finally {
      loadingMoreRef.current = false
      if (currentKeyRef.current === requestedKey) setLoadingMore(false)
    }
  }

  if (!username) return null

  return (
    <div>
      {visible?.works?.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.works.map((work) => (
            <Fragment key={work.id}>{renderWork(work)}</Fragment>
          ))}
        </div>
      ) : loading ? (
        <div className="py-8 text-center text-sm text-[var(--shadow-text-secondary)]">
          {t('authorPublicPage.loading')}
        </div>
      ) : !error ? (
        renderEmpty?.() || null
      ) : null}

      {error ? (
        <div className="mt-4 text-center">
          <p className="mb-2 text-sm text-[var(--shadow-text-secondary)]">{error}</p>
          <button
            type="button"
            onClick={() => visible?.works?.length ? loadMore() : setRetryKey((value) => value + 1)}
            className="rounded-lg border border-[var(--shadow-border)] px-5 py-2.5 text-sm text-[var(--shadow-text-primary)]"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {visible?.hasMore && visible.cursor && !error ? (
        <div className="py-5 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-6 py-3 text-sm font-medium text-[var(--shadow-text-primary)] disabled:opacity-50"
          >
            {loadingMore ? labels.loading : labels.more}
          </button>
        </div>
      ) : null}
    </div>
  )
}
