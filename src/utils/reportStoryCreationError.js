import { getStoryCreationUserError } from './storyCreationUserError'

const API_BASE = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const REPORT_URL = `${API_BASE.replace(/\/+$/, '')}/api/diagnostics/story-creation`
const STAGES = new Set([
  'CROP', 'LOCAL_DRAFT', 'UPLOAD_QUEUE', 'IMAGE_PROCESS',
  'ONLINE_UPLOAD', 'CREATE_STORY', 'RESTORE_DRAFT', 'UPDATE_STORY',
])
const STORY_TYPES = new Set(['novel', 'manga', 'chat_story'])
const MAX_REPORTS_PER_DAY = 5
const DEDUP_MS = 30 * 60 * 1000
const FAILURE_COOLDOWN_MS = 10 * 60 * 1000
const MEMORY_BUDGETS = new Map()
let pausedUntil = 0

function getToken() {
  try {
    return localStorage.getItem('shadow_reader_token') ||
      sessionStorage.getItem('shadow_reader_token') || ''
  } catch {
    try { return sessionStorage.getItem('shadow_reader_token') || '' } catch { return '' }
  }
}

function getUserId(token) {
  try {
    const encoded = String(token || '').split('.')[1]
    if (!encoded) return ''
    const decoded = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')
      .padEnd(Math.ceil(encoded.length / 4) * 4, '=')))
    const id = String(decoded.user_id || '').trim()
    return /^[0-9a-f-]{36}$/i.test(id) ? id : ''
  } catch {
    return ''
  }
}

function deviceDetails() {
  const agent = navigator.userAgent || ''
  const browser = /Edg\//i.test(agent) ? 'EDGE'
    : /SamsungBrowser\//i.test(agent) ? 'SAMSUNG'
      : /(?:Chrome|CriOS)\//i.test(agent) ? 'CHROME'
        : /(?:Firefox|FxiOS)\//i.test(agent) ? 'FIREFOX'
          : /Safari\//i.test(agent) ? 'SAFARI' : 'OTHER'
  const os = /Android/i.test(agent) ? 'ANDROID'
    : /iPhone|iPad|iPod/i.test(agent) ? 'IOS'
      : /Windows/i.test(agent) ? 'WINDOWS'
        : /Macintosh|Mac OS X/i.test(agent) ? 'MACOS'
          : /Linux/i.test(agent) ? 'LINUX' : 'OTHER'
  const device = /iPad|Tablet|PlayBook|Silk/i.test(agent) ||
    (os === 'ANDROID' && !/Mobile/i.test(agent)) ? 'TABLET'
    : /Mobile|iPhone|Android/i.test(agent) ? 'MOBILE' : 'DESKTOP'
  return { browser, os, device }
}

function readBudget(userId, day) {
  const key = `shadow_story_creation_error_budget_v1:${userId}`
  let value = MEMORY_BUDGETS.get(key)
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null')
    if (saved?.day === day && Number.isInteger(saved.count)) {
      if (!value || saved.count >= value.count) value = saved
    }
  } catch {}
  if (value?.day !== day) value = { day, count: 0, signatures: {} }
  return { key, value }
}

function saveBudget(key, value) {
  MEMORY_BUDGETS.set(key, value)
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function getErrorCode(error, stage) {
  const context = stage === 'CROP' ? 'crop'
    : stage === 'UPLOAD_QUEUE' ? 'queue'
      : stage === 'IMAGE_PROCESS' || stage === 'ONLINE_UPLOAD' ? 'upload'
        : stage === 'CREATE_STORY' || stage === 'UPDATE_STORY' ? 'create' : 'local'
  try {
    const code = String(getStoryCreationUserError(error, context).code || 'UNKNOWN')
    return /^[A-Z0-9_]{2,64}$/.test(code) ? code : `${stage}_FAILED`
  } catch {
    return `${stage}_FAILED`
  }
}

export function reportStoryCreationError(error, { stage, storyType } = {}) {
  if (typeof window === 'undefined' || !STAGES.has(stage) || !STORY_TYPES.has(storyType)) {
    return Promise.resolve(false)
  }
  if (navigator.onLine === false || Date.now() < pausedUntil) return Promise.resolve(false)

  const token = getToken()
  const userId = getUserId(token)
  if (!userId) return Promise.resolve(false)

  const now = Date.now()
  const day = new Date(now).toISOString().slice(0, 10)
  const { key, value } = readBudget(userId, day)
  if (value.count >= MAX_REPORTS_PER_DAY) return Promise.resolve(false)

  const platform = deviceDetails()
  const rawName = String(error?.name || 'Error').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80)
  const payload = {
    story_type: storyType,
    stage,
    error_code: getErrorCode(error, stage),
    error_name: rawName || 'Error',
    ...platform,
  }
  const signature = [payload.story_type, payload.stage, payload.error_code,
    payload.error_name, payload.browser, payload.os, payload.device].join(':')
  if (now - Number(value.signatures?.[signature] || 0) < DEDUP_MS) return Promise.resolve(false)

  const signatures = Object.fromEntries(Object.entries(value.signatures || {})
    .filter(([, time]) => now - Number(time) < DEDUP_MS))
  signatures[signature] = now
  saveBudget(key, { day, count: value.count + 1, signatures })

  return Promise.resolve().then(() => fetch(REPORT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    keepalive: true,
  })).then((response) => {
    if (response.status === 429 || response.status >= 500) {
      pausedUntil = Date.now() + FAILURE_COOLDOWN_MS
    }
    return response.status === 204
  }).catch(() => {
    pausedUntil = Date.now() + FAILURE_COOLDOWN_MS
    return false
  })
}
