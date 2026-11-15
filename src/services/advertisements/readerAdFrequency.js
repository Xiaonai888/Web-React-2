const STORAGE_PREFIX = 'shadow_reader_episode_ad_v1:'
const ENTRY_PASS_PREFIX = 'shadow_reader_ad_entry_pass_v1:'
const MAX_EPISODES = 8192
const ENTRY_PASS_MS = 15 * 60 * 1000
const memoryStates = new Map()
const memoryPasses = new Map()

function hash(value) {
  let result = 2166136261
  for (const char of String(value)) {
    result ^= char.charCodeAt(0)
    result = Math.imul(result, 16777619)
  }
  return (result >>> 0).toString(36)
}

function getReaderToken() {
  try {
    return sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') || ''
  } catch {
    return ''
  }
}

export function getReaderAdAccountKey() {
  const token = getReaderToken()
  if (!token) return ''
  try {
    const part = token.split('.')[1]
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(normalized))
    const identity = String(payload.user_id || payload.sub || payload.id || '').trim()
    if (identity) return `reader-${hash(identity)}`
  } catch {}
  return `token-${hash(token)}`
}

function episodeKey(storyId, episodeId) {
  const story = String(storyId || '').trim().toLowerCase()
  const episode = String(episodeId || '').trim().toLowerCase()
  return story && episode ? `${story}:${episode}` : ''
}

function storage(type) {
  try {
    return type === 'session' ? sessionStorage : localStorage
  } catch {
    return null
  }
}

function emptyState() {
  return { count: 0, order: [], episodes: {} }
}

function readState(account) {
  const key = `${STORAGE_PREFIX}${account}`
  try {
    const raw = storage('local')?.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Number.isSafeInteger(parsed.count) && parsed.count >= 0 &&
          Array.isArray(parsed.order) && parsed.episodes &&
          typeof parsed.episodes === 'object' && !Array.isArray(parsed.episodes)) {
        return parsed
      }
    }
  } catch {}
  return memoryStates.get(key) || emptyState()
}

function saveState(account, state) {
  const key = `${STORAGE_PREFIX}${account}`
  memoryStates.set(key, state)
  try { storage('local')?.setItem(key, JSON.stringify(state)) } catch {}
}

function readPass(account) {
  const key = `${ENTRY_PASS_PREFIX}${account}`
  try {
    const raw = storage('session')?.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return memoryPasses.get(key) || null
}

function clearPass(account) {
  const key = `${ENTRY_PASS_PREFIX}${account}`
  memoryPasses.delete(key)
  try { storage('session')?.removeItem(key) } catch {}
}

function consumeMatchingPass(account, key) {
  const pass = readPass(account)
  if (!pass) return false
  if (Number(pass.expiresAt) <= Date.now()) {
    clearPass(account)
    return false
  }
  if (pass.episode !== key) return false
  clearPass(account)
  return true
}

function hasMatchingPass(account, key) {
  const pass = readPass(account)
  return Boolean(pass && pass.episode === key && Number(pass.expiresAt) > Date.now())
}

export function grantReaderAdEntryPass({ storyId, episodeId } = {}) {
  const account = getReaderAdAccountKey()
  const episode = episodeKey(storyId, episodeId)
  if (!account || !episode) return false
  const pass = { episode, expiresAt: Date.now() + ENTRY_PASS_MS }
  const key = `${ENTRY_PASS_PREFIX}${account}`
  memoryPasses.set(key, pass)
  try { storage('session')?.setItem(key, JSON.stringify(pass)) } catch {}
  return true
}

export function peekReaderEpisodeAd({ storyId, episodeId, eligible = false } = {}) {
  const account = getReaderAdAccountKey()
  const key = episodeKey(storyId, episodeId)
  if (!account || !key || !eligible) return false
  const state = readState(account)
  const existing = state.episodes[key]
  if (hasMatchingPass(account, key)) return false
  if (existing) return existing.ad === true && existing.finished !== true
  return (state.count + 1) % 2 === 0
}

export function registerReaderEpisode({ storyId, episodeId, eligible = false } = {}) {
  const account = getReaderAdAccountKey()
  const key = episodeKey(storyId, episodeId)
  if (!account || !key || !eligible) {
    return { showAd: false, newEpisode: false, count: 0 }
  }

  const state = readState(account)
  const existing = state.episodes[key]
  const hasPass = consumeMatchingPass(account, key)

  if (existing) {
    if (hasPass && existing.finished !== true) {
      existing.finished = true
      saveState(account, state)
    }
    return {
      showAd: existing.ad === true && existing.finished !== true,
      newEpisode: false,
      count: state.count,
    }
  }

  state.count += 1
  const ad = state.count % 2 === 0 && !hasPass
  state.episodes[key] = { ad, finished: !ad }
  state.order.push(key)

  while (state.order.length > MAX_EPISODES) {
    const oldest = state.order.shift()
    if (oldest) delete state.episodes[oldest]
  }

  saveState(account, state)
  return { showAd: ad, newEpisode: true, count: state.count }
}

export function finishReaderEpisodeAd({ storyId, episodeId } = {}) {
  const account = getReaderAdAccountKey()
  const key = episodeKey(storyId, episodeId)
  if (!account || !key) return false
  const state = readState(account)
  const entry = state.episodes[key]
  if (!entry) return false
  if (entry.finished !== true) {
    entry.finished = true
    saveState(account, state)
  }
  return true
}
