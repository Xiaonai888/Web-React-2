import { getReaderAdAccountKey } from './readerAdFrequency.js'

const STORAGE_PREFIX = 'shadow_promo_ad_sequence_v1:'
const RECENT_OPENING_MS = 2 * 60 * 1000
const memoryStates = new Map()

function defaultState() {
  return {
    path: '',
    lastPlacement: '',
    lastShownAt: 0,
    deferMe: false,
    leftMe: false,
  }
}

function readState(account) {
  const key = `${STORAGE_PREFIX}${account}`
  try {
    const raw = sessionStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return { ...defaultState(), ...parsed }
      }
    }
  } catch {}
  return memoryStates.get(key) || defaultState()
}

function saveState(account, state) {
  const key = `${STORAGE_PREFIX}${account}`
  memoryStates.set(key, state)
  try { sessionStorage.setItem(key, JSON.stringify(state)) } catch {}
}

function normalizePath(path) {
  const value = String(path || '/').split('?')[0].split('#')[0]
  return value.length > 1 ? value.replace(/\/+$/, '') : value
}

export function observePromoRoute(path) {
  const account = getReaderAdAccountKey()
  if (!account) return false
  const nextPath = normalizePath(path)
  const state = readState(account)
  const enteringMe = nextPath === '/me' && state.path !== '/me'
  const leavingMe = nextPath !== '/me' && state.path === '/me'
  let justReleased = false

  if (leavingMe && state.deferMe) state.leftMe = true
  if (enteringMe && state.deferMe && state.leftMe) {
    state.deferMe = false
    state.leftMe = false
    justReleased = true
  }

  if (enteringMe && !justReleased && state.lastPlacement === 'opening' &&
      Date.now() - state.lastShownAt < RECENT_OPENING_MS) {
    state.deferMe = true
    state.leftMe = false
  }

  if (state.path !== nextPath || enteringMe || leavingMe) {
    state.path = nextPath
    saveState(account, state)
  }
  return nextPath === '/me' && !state.deferMe
}

export function markPromoAdDisplayed(placement, path = '') {
  if (placement !== 'opening' && placement !== 'me') return false
  const account = getReaderAdAccountKey()
  if (!account) return false
  const state = readState(account)
  const actualPath = normalizePath(path || (typeof window !== 'undefined' ? window.location.pathname : '/'))
  state.path = actualPath
  state.lastPlacement = placement
  state.lastShownAt = Date.now()
  if (placement === 'opening' && actualPath === '/me') {
    state.deferMe = true
    state.leftMe = false
  }
  saveState(account, state)
  return true
}

export function canShowMeAd(path = '/me') {
  const account = getReaderAdAccountKey()
  if (!account || normalizePath(path) !== '/me') return false
  return !readState(account).deferMe
}
