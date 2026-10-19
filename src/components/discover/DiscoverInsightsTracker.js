import { useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const VISITOR_ID_KEY = 'shadow_anonymous_visitor_id'
const DAILY_KEY = 'shadow_discover_insights_daily_v1'
const ENTRY_KEY = 'shadow_discover_insights_last_entry_v1'
const AD_SELECTOR = 'article[id^="shadow-mall-promotion-"]'

function cambodiaDay() {
  return new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10)
}

function createVisitorId() {
  try {
    const current = localStorage.getItem(VISITOR_ID_KEY)
    if (/^[a-zA-Z0-9_-]{16,128}$/.test(current || '')) return current
    const id = `visitor-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}`
    localStorage.setItem(VISITOR_ID_KEY, id)
    return id
  } catch {
    return `visitor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  }
}

function readState(day) {
  try {
    const saved = JSON.parse(localStorage.getItem(DAILY_KEY) || 'null')
    if (saved?.day === day && typeof saved.promotions === 'object' && saved.promotions !== null) {
      return {
        day,
        visits: Math.max(0, Math.min(100, Number(saved.visits) || 0)),
        quality: saved.quality === true,
        promotions: saved.promotions,
      }
    }
  } catch {
    return { day, visits: 0, quality: false, promotions: {} }
  }
  return { day, visits: 0, quality: false, promotions: {} }
}

function saveState(state) {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(state))
  } catch {
    return
  }
}

function readToken() {
  try {
    return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

export default function DiscoverInsightsTracker() {
  useEffect(() => {
    if (window.location.pathname !== '/discover') return undefined
    const main = document.querySelector('.discover-page main')
    if (!main) return undefined

    const visitorId = createVisitorId()
    let state = readState(cambodiaDay())
    let dirty = true
    let active = true
    let sendTimer = 0
    let scanFrame = 0
    const observed = new Set()
    const visible = new Set()
    const viewTimers = new Map()

    function ensureDay() {
      const day = cambodiaDay()
      if (state.day === day) return
      state = { day, visits: 1, quality: false, promotions: {} }
      dirty = true
      saveState(state)
    }

    function send() {
      window.clearTimeout(sendTimer)
      sendTimer = 0
      if (!dirty) return
      ensureDay()
      dirty = false

      const entries = Object.entries(state.promotions)
        .filter(([id, flags]) => /^[1-9]\d*$/.test(id) && (flags?.viewed || flags?.clicked))
        .map(([id, flags]) => ({
          promotion_id: Number(id),
          viewed: flags.viewed === true || flags.clicked === true,
          clicked: flags.clicked === true,
        }))
      const batches = []
      for (let i = 0; i < entries.length; i += 12) batches.push(entries.slice(i, i + 12))
      if (!batches.length) batches.push([])

      const token = readToken()
      const common = {
        visitor_id: visitorId,
        visit_count: Math.max(1, Math.min(100, state.visits)),
        quality_view: state.quality,
      }

      Promise.all(batches.map(async (promotions) => {
        const response = await fetch(`${API_URL}/api/discover-insights/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...common, promotions }),
          keepalive: true,
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('Discover insights request failed')
      })).catch(() => {
        dirty = true
      })
    }

    function scheduleSend(delay = 5000) {
      if (!active || sendTimer) return
      sendTimer = window.setTimeout(send, delay)
    }

    function markQuality() {
      ensureDay()
      if (state.quality) return
      state.quality = true
      dirty = true
      saveState(state)
      scheduleSend()
    }

    function markPromotion(id, clicked = false) {
      ensureDay()
      if (!/^[1-9]\d*$/.test(id)) return
      const previous = state.promotions[id] || { viewed: false, clicked: false }
      if (previous.viewed && (!clicked || previous.clicked)) return
      state.promotions[id] = { viewed: true, clicked: previous.clicked || clicked }
      dirty = true
      saveState(state)
      scheduleSend()
    }

    function startViewTimer(element) {
      if (document.visibilityState !== 'visible' || viewTimers.has(element)) return
      const timer = window.setTimeout(() => {
        viewTimers.delete(element)
        if (!active || !element.isConnected || !visible.has(element) || document.visibilityState !== 'visible') return
        const id = element.id.slice('shadow-mall-promotion-'.length)
        markPromotion(id)
      }, 2000)
      viewTimers.set(element, timer)
    }

    function clearViewTimer(element) {
      window.clearTimeout(viewTimers.get(element))
      viewTimers.delete(element)
    }

    const impressionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          visible.add(entry.target)
          startViewTimer(entry.target)
        } else {
          visible.delete(entry.target)
          clearViewTimer(entry.target)
        }
      }
    }, { threshold: [0, 0.5, 1] })

    function scanPromotions() {
      scanFrame = 0
      for (const element of main.querySelectorAll(AD_SELECTOR)) {
        if (observed.has(element)) continue
        observed.add(element)
        impressionObserver.observe(element)
      }
    }

    function scheduleScan() {
      if (!scanFrame) scanFrame = window.requestAnimationFrame(scanPromotions)
    }

    const mutations = new MutationObserver(scheduleScan)
    mutations.observe(main, { childList: true, subtree: true })
    scanPromotions()

    function handleClick(event) {
      if (!(event.target instanceof Element)) return
      if (!event.target.closest('a, button, input, select, textarea, summary, [role="button"], [role="link"]')) return
      markQuality()
      const action = event.target.closest('[data-discover-promotion-action], a')
      if (!action || !main.contains(action)) return
      const article = action.closest(AD_SELECTOR)
      if (!article) return
      markPromotion(article.id.slice('shadow-mall-promotion-'.length), true)
      send()
    }

    function handleKeyDown(event) {
      if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (window.location.pathname === '/discover') markQuality()
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        for (const element of visible) startViewTimer(element)
      } else {
        for (const element of visible) clearViewTimer(element)
        send()
      }
    }

    try {
      const last = Number(sessionStorage.getItem(ENTRY_KEY) || 0)
      const now = Date.now()
      if (now - last > 1200 || now < last) {
        state.visits = Math.min(100, state.visits + 1)
        sessionStorage.setItem(ENTRY_KEY, String(now))
      }
    } catch {
      state.visits = Math.min(100, state.visits + 1)
    }
    saveState(state)
    scheduleSend()

    main.addEventListener('click', handleClick, true)
    main.addEventListener('wheel', markQuality, { passive: true })
    main.addEventListener('touchmove', markQuality, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pagehide', send)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      active = false
      window.clearTimeout(sendTimer)
      window.cancelAnimationFrame(scanFrame)
      for (const timer of viewTimers.values()) window.clearTimeout(timer)
      mutations.disconnect()
      impressionObserver.disconnect()
      main.removeEventListener('click', handleClick, true)
      main.removeEventListener('wheel', markQuality)
      main.removeEventListener('touchmove', markQuality)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pagehide', send)
      document.removeEventListener('visibilitychange', handleVisibility)
      send()
    }
  }, [])

  return null
}
