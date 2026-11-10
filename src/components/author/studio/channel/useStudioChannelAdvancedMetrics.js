import { useCallback, useEffect, useRef, useState } from 'react'
import { getStudioAdvancedSummary } from '../../../../services/shadowStudioAdvancedMetricsApi'

const CACHE_MS = 10 * 60 * 1000
const MAX_ENTRIES = 9
const SUPPORTED = new Set(['overview', 'content'])
const FORMATS = new Set(['all', 'videos', 'shorts'])
const PERIODS = new Set([7, 28, 30])

export default function useStudioChannelAdvancedMetrics(section, format = 'all', days = 30) {
  const allowed = SUPPORTED.has(section) && FORMATS.has(format) && PERIODS.has(days)
  const effectiveFormat = section === 'overview' ? 'all' : format
  const key = allowed ? `${days}:${effectiveFormat}` : null
  const cache = useRef(new Map())
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState({ key: null, data: null, loading: false, error: '' })

  useEffect(() => {
    if (!key) return undefined
    const controller = new AbortController()
    const cached = cache.current.get(key)
    if (cached && cached.expiresAt > Date.now()) {
      cache.current.delete(key)
      cache.current.set(key, cached)
      setState({ key, data: cached.data, loading: false, error: '' })
      return () => controller.abort()
    }
    cache.current.delete(key)
    setState({ key, data: null, loading: true, error: '' })
    getStudioAdvancedSummary(days, effectiveFormat, { signal: controller.signal }).then(data => {
      if (controller.signal.aborted) return
      cache.current.set(key, { data, expiresAt: Date.now() + CACHE_MS })
      while (cache.current.size > MAX_ENTRIES) cache.current.delete(cache.current.keys().next().value)
      setState({ key, data, loading: false, error: '' })
    }).catch(error => {
      if (!controller.signal.aborted) {
        setState({ key, data: null, loading: false, error: error?.message || 'Advanced analytics unavailable.' })
      }
    })
    return () => controller.abort()
  }, [key, days, effectiveFormat, revision])

  const retry = useCallback(() => {
    if (!key) return
    cache.current.delete(key)
    setRevision(current => current + 1)
  }, [key])

  return {
    data: key === state.key ? state.data : null,
    loading: Boolean(key && (state.key !== key || state.loading)),
    error: key === state.key ? state.error : '',
    supported: Boolean(key),
    retry,
  }
}
