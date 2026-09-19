const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const VISITOR_ID_KEY = 'shadow_anonymous_visitor_id'
const CONTEXT_KEY = 'shadow_story_section_rank_context'
const EVENT_CACHE_KEY = 'shadow_story_section_rank_confirmed_v1'
const CONTEXT_MAX_AGE_MS = 24 * 60 * 60 * 1000
const MAX_CONFIRMED_EVENTS = 500
const confirmedEvents = new Set()
const pendingEvents = new Map()
let cachedDay = ''

const VALID_SECTIONS = new Set([
  'daily_picks',
  'trending_now',
  'update_today',
  'weekly_update',
  'new_arrivals',
  'ranking',
  'you_might_like',
])

function createTrackingId() {
  const randomValue =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

  return `visitor-${randomValue}`
}

function getVisitorId() {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY) || ''

    if (!visitorId) {
      visitorId = createTrackingId()
      localStorage.setItem(VISITOR_ID_KEY, visitorId)
    }

    return visitorId
  } catch {
    return createTrackingId()
  }
}

function readContexts() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CONTEXT_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeContexts(contexts) {
  try {
    sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(contexts))
  } catch {
    return
  }
}

function saveContext(storyId, sectionKey) {
  const contexts = readContexts()
  const now = Date.now()

  for (const [key, value] of Object.entries(contexts)) {
    if (
      !value ||
      now - Number(value.createdAt || 0) > CONTEXT_MAX_AGE_MS
    ) {
      delete contexts[key]
    }
  }

  contexts[String(storyId)] = {
    sectionKey,
    createdAt: now,
  }

  writeContexts(contexts)
}

function getContext(storyId) {
  const contexts = readContexts()
  const key = String(storyId)
  const context = contexts[key]

  if (
    !context ||
    !VALID_SECTIONS.has(context.sectionKey) ||
    Date.now() - Number(context.createdAt || 0) > CONTEXT_MAX_AGE_MS
  ) {
    if (context) {
      delete contexts[key]
      writeContexts(contexts)
    }

    return null
  }

  return context
}

function cambodiaDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function readConfirmedEvents(day) {
  try {
    const saved = JSON.parse(localStorage.getItem(EVENT_CACHE_KEY) || 'null')
    return saved?.day === day && Array.isArray(saved.keys)
      ? saved.keys.filter((key) => typeof key === 'string').slice(-MAX_CONFIRMED_EVENTS)
      : []
  } catch {
    return []
  }
}

function isConfirmedEvent(day, key) {
  if (cachedDay !== day) {
    cachedDay = day
    confirmedEvents.clear()
  }

  if (confirmedEvents.has(key)) return true
  if (!readConfirmedEvents(day).includes(key)) return false

  confirmedEvents.add(key)
  while (confirmedEvents.size > MAX_CONFIRMED_EVENTS) {
    confirmedEvents.delete(confirmedEvents.values().next().value)
  }
  return true
}

function rememberConfirmedEvent(day, key) {
  if (cachedDay !== day) {
    cachedDay = day
    confirmedEvents.clear()
  }

  confirmedEvents.add(key)
  while (confirmedEvents.size > MAX_CONFIRMED_EVENTS) {
    confirmedEvents.delete(confirmedEvents.values().next().value)
  }

  try {
    const saved = new Set([...readConfirmedEvents(day), ...confirmedEvents])
    while (saved.size > MAX_CONFIRMED_EVENTS) {
      saved.delete(saved.values().next().value)
    }
    localStorage.setItem(EVENT_CACHE_KEY, JSON.stringify({ day, keys: [...saved] }))
  } catch {
    return
  }
}

async function sendEvent(sectionKey, storyId, action) {
  if (!VALID_SECTIONS.has(sectionKey) || !storyId) return false

  const visitorId = getVisitorId()
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  const day = cambodiaDate()
  const eventKey = JSON.stringify([visitorId, day, sectionKey, storyId, action])

  if (isConfirmedEvent(day, eventKey)) return true
  if (pendingEvents.has(eventKey)) return pendingEvents.get(eventKey)

  const pending = (async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/visitors/story-section-rank`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shadow-Visitor-Id': visitorId,
...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            visitor_id: visitorId,
            section_key: sectionKey,
            story_id: storyId,
            action,
          }),
          keepalive: true,
        }
      )

      if (!response.ok) return false

      const data = await response.json().catch(() => ({}))
      if (data.ok === false) return false

      rememberConfirmedEvent(day, eventKey)
      return true
    } catch {
      return false
    }
  })()

  pendingEvents.set(eventKey, pending)
  try {
    return await pending
  } finally {
    if (pendingEvents.get(eventKey) === pending) pendingEvents.delete(eventKey)
  }
}

export function trackSectionQualifiedView(sectionKey, storyId) {
  const normalizedSection = String(sectionKey || '').trim().toLowerCase()
  const normalizedStoryId = String(storyId || '').trim()

  if (
    !VALID_SECTIONS.has(normalizedSection) ||
    !normalizedStoryId
  ) {
    return Promise.resolve(false)
  }

  saveContext(normalizedStoryId, normalizedSection)

  return sendEvent(
    normalizedSection,
    normalizedStoryId,
    'view'
  )
}

export function trackSectionQualifiedRead(storyId) {
  const normalizedStoryId = String(storyId || '').trim()
  if (!normalizedStoryId) return Promise.resolve(false)

  const context = getContext(normalizedStoryId)
  if (!context) return Promise.resolve(false)

  return sendEvent(
    context.sectionKey,
    normalizedStoryId,
    'read'
  )
}
