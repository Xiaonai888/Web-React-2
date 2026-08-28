const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const VISITOR_ID_KEY = 'shadow_anonymous_visitor_id'
const CONTEXT_KEY = 'shadow_story_section_rank_context'
const CONTEXT_MAX_AGE_MS = 24 * 60 * 60 * 1000

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

async function sendEvent(sectionKey, storyId, action) {
  if (!VALID_SECTIONS.has(sectionKey) || !storyId) return false

  try {
    const visitorId = getVisitorId()

    const response = await fetch(
      `${API_URL}/api/visitors/story-section-rank`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shadow-Visitor-Id': visitorId,
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
    return data.ok !== false
  } catch {
    return false
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
