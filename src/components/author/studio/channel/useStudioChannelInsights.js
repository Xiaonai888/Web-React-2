import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getStudioChannelAudience,
  getStudioChannelTrends,
  isStudioInsightsPeriod,
  removeStudioChannelTopic,
  saveStudioChannelTopic,
} from '../../../../services/shadowStudioChannelInsightsApi'

const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_CACHE_ENTRIES = 6

function cacheKey(section, days) {
  if (!isStudioInsightsPeriod(days)) return null
  if (section !== 'audience' && section !== 'trends') return null
  return `${section}:${days}`
}

export default function useStudioChannelInsights(section, days = 30) {
  const key = cacheKey(section, days)
  const cache = useRef(new Map())
  const mutationBusy = useRef(false)
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState({ key: null, data: null, error: '', loading: false })
  const [busyTopic, setBusyTopic] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (!key) return undefined
    const controller = new AbortController()
    const cached = cache.current.get(key)
    if (cached && cached.expiresAt > Date.now()) {
      cache.current.delete(key)
      cache.current.set(key, cached)
      setState({ key, data: cached.data, error: '', loading: false })
      return () => controller.abort()
    }
    cache.current.delete(key)
    setState({ key, data: null, error: '', loading: true })
    const loader = section === 'audience' ? getStudioChannelAudience : getStudioChannelTrends
    loader(days, { signal: controller.signal }).then(data => {
      if (controller.signal.aborted) return
      cache.current.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
      while (cache.current.size > MAX_CACHE_ENTRIES) {
        cache.current.delete(cache.current.keys().next().value)
      }
      setState({ key, data, error: '', loading: false })
    }).catch(error => {
      if (controller.signal.aborted) return
      setState({ key, data: null, error: error?.message || 'Analytics unavailable.', loading: false })
    })
    return () => controller.abort()
  }, [key, section, days, revision])

  const retry = useCallback(() => {
    if (!key) return
    cache.current.delete(key)
    setActionError('')
    setRevision(value => value + 1)
  }, [key])

  const changeTopic = useCallback(async (topic, shouldSave) => {
    if (section !== 'trends' || mutationBusy.current) return false
    mutationBusy.current = true
    setBusyTopic(topic)
    setActionError('')
    try {
      const result = shouldSave
        ? await saveStudioChannelTopic(topic)
        : await removeStudioChannelTopic(topic)
      if (result?.ok !== true) throw new Error('Topic update failed.')
      for (const entryKey of cache.current.keys()) {
        if (entryKey.startsWith('trends:')) cache.current.delete(entryKey)
      }
      setRevision(value => value + 1)
      return true
    } catch (error) {
      setActionError(error?.message || 'Could not update saved topics.')
      return false
    } finally {
      mutationBusy.current = false
      setBusyTopic('')
    }
  }, [section])

  const saveTopic = useCallback(topic => changeTopic(topic, true), [changeTopic])
  const removeTopic = useCallback(topic => changeTopic(topic, false), [changeTopic])

  return {
    data: key && state.key === key ? state.data : null,
    loading: Boolean(key && (state.key !== key || state.loading)),
    error: key && state.key === key ? state.error : '',
    supported: Boolean(key),
    retry,
    saveTopic,
    removeTopic,
    busyTopic,
    actionError,
  }
}
