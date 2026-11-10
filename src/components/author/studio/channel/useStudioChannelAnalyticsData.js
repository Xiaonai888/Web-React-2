import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getStudioChannelContent,
  getStudioChannelOverview,
  isStudioChannelFormat,
} from '../../../../services/shadowStudioChannelAnalyticsApi'

const CLIENT_TTL_MS = 10 * 60 * 1000
const CLIENT_MAX_ENTRIES = 4

function activeKey(section, format) {
  if (section === 'overview') return 'overview'
  if (section === 'content' && isStudioChannelFormat(format)) return `content:${format}`
  return null
}

export default function useStudioChannelAnalyticsData(section, format) {
  const key = activeKey(section, format)
  const cache = useRef(new Map())
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState({ key: null, value: null, error: '', loading: false })

  useEffect(() => {
    if (!key) return undefined
    const controller = new AbortController()
    const cached = cache.current.get(key)
    if (cached && cached.expiresAt > Date.now()) {
      setResult({ key, value: cached.value, error: '', loading: false })
      return () => controller.abort()
    }
    if (cached) cache.current.delete(key)
    setResult({ key, value: null, error: '', loading: true })
    const read = section === 'overview'
      ? getStudioChannelOverview({ signal: controller.signal })
      : getStudioChannelContent(format, { signal: controller.signal })

    read.then(value => {
      if (controller.signal.aborted) return
      cache.current.delete(key)
      cache.current.set(key, { value, expiresAt: Date.now() + CLIENT_TTL_MS })
      while (cache.current.size > CLIENT_MAX_ENTRIES) {
        cache.current.delete(cache.current.keys().next().value)
      }
      setResult({ key, value, error: '', loading: false })
    }).catch(error => {
      if (controller.signal.aborted) return
      setResult({ key, value: null, error: error?.message || 'Analytics unavailable.', loading: false })
    })
    return () => controller.abort()
  }, [key, section, format, revision])

  const retry = useCallback(() => {
    if (!key) return
    cache.current.delete(key)
    setRevision(value => value + 1)
  }, [key])

  return {
    data: key && result.key === key ? result.value : null,
    loading: Boolean(key && (result.key !== key || result.loading)),
    error: key && result.key === key ? result.error : '',
    supported: Boolean(key),
    retry,
  }
}
