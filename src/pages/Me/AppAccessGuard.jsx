import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const CACHE_KEY = 'shadow-public-app-settings-v1'
const CACHE_MS = 30_000

function readStatus(appKey, freshOnly = false) {
  try {
    const value = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (!Number.isFinite(value?.savedAt) || value.savedAt > Date.now() || !Array.isArray(value.apps)) return null
    if (freshOnly && Date.now() - value.savedAt >= CACHE_MS) return null
    const app = value.apps.find(item => item?.appKey === appKey)
    return typeof app?.disabled === 'boolean' ? app.disabled : null
  } catch {
    return null
  }
}

export default function AppAccessGuard({ appKey, children }) {
  const navigate = useNavigate()
  const [result, setResult] = useState(() => ({ disabled: readStatus(appKey, true), offline: false }))
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const cached = readStatus(appKey, true)
    if (cached !== null && retry === 0) {
      setResult({ disabled: cached, offline: false })
      return
    }

    let active = true
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12_000)
    setResult({ disabled: null, offline: false })
    fetch(`${API_BASE_URL}/api/public/apps`, { signal: controller.signal, cache: 'no-cache' })
      .then(async response => {
        if (!response.ok) throw new Error('App settings unavailable')
        const data = await response.json()
        if (data.ok !== true || !Array.isArray(data.apps)) throw new Error('Invalid app settings')
        const app = data.apps.find(item => item?.appKey === appKey)
        if (typeof app?.disabled !== 'boolean') throw new Error('Unknown app status')
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), apps: data.apps })) } catch {}
        if (active) setResult({ disabled: app.disabled, offline: false })
      })
      .catch(() => {
        if (active) setResult({ disabled: readStatus(appKey), offline: true })
      })
      .finally(() => clearTimeout(timer))

    return () => { active = false; clearTimeout(timer); controller.abort() }
  }, [appKey, retry])

  if (result.disabled === false) return <>{result.offline && <div role="status" className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">Offline: using the last known app status. Admin changes will apply after reconnecting.</div>}{children}</>

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf9fc] px-5 text-center text-[#252139] dark:bg-[#11121c] dark:text-white">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#efe8ff] text-3xl text-[#6d4bb9] dark:bg-[#302640]">{result.disabled === null ? '…' : '×'}</div>
      <h1 className="text-xl font-bold">{result.disabled === true ? 'App unavailable' : result.offline ? 'Cannot check app access' : 'Checking app access…'}</h1>
      <p className="max-w-sm text-sm leading-6 text-[#777189] dark:text-white/65">{result.disabled === true ? 'This app has been disabled by the administrator. Your locally saved projects have not been deleted.' : result.offline ? 'Connect to the internet to check the latest app settings. Your locally saved projects remain on this device.' : 'Please wait a moment.'}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {result.offline && <button type="button" onClick={() => setRetry(value => value + 1)} className="rounded-xl bg-[#7150ba] px-5 py-3 text-sm font-semibold text-white">Retry</button>}
        <button type="button" onClick={() => navigate('/app')} className="rounded-xl border border-[#ded8e9] px-5 py-3 text-sm font-semibold dark:border-white/20">Back to Apps</button>
      </div>
    </div>
  )
}
