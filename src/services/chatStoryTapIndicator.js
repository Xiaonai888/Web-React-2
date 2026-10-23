import { useMemo, useSyncExternalStore } from 'react'
import { chatThemeAccount, CHAT_THEME_EVENT } from './chatStoryThemes'
import {
  DEFAULT_TAP_INDICATOR,
  normalizeTapIndicatorSettings,
} from '../components/chat-story/ChatStoryTapIndicator'

export const TAP_INDICATOR_EVENT = 'shadow:chat-tap-indicator-changed'
export const TAP_INDICATOR_STORAGE_PREFIX = 'shadow_chat_tap_indicator_v1:'
export const TAP_INDICATOR_IMAGE_LIMIT = 1
export const TAP_INDICATOR_IMAGE_RATIO = 1

function settingsError(code) {
  const error = new Error(code)
  error.code = code
  return error
}

function storageKey(account) {
  if (typeof account !== 'string' || !/^[a-zA-Z0-9_-]{1,160}$/.test(account)) {
    throw settingsError('accountChanged')
  }
  return `${TAP_INDICATOR_STORAGE_PREFIX}${account}`
}

function parseSettings(value) {
  try {
    return normalizeTapIndicatorSettings(JSON.parse(value || 'null'))
  } catch {
    return normalizeTapIndicatorSettings(DEFAULT_TAP_INDICATOR)
  }
}

function snapshot() {
  const account = chatThemeAccount()
  try {
    return `${account}\n${localStorage.getItem(storageKey(account)) || ''}`
  } catch {
    return `${account}\n`
  }
}

function subscribe(listener) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', listener)
  window.addEventListener('focus', listener)
  window.addEventListener(TAP_INDICATOR_EVENT, listener)
  window.addEventListener(CHAT_THEME_EVENT, listener)
  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener('focus', listener)
    window.removeEventListener(TAP_INDICATOR_EVENT, listener)
    window.removeEventListener(CHAT_THEME_EVENT, listener)
  }
}

export function readChatTapIndicator(account = chatThemeAccount()) {
  try {
    return parseSettings(localStorage.getItem(storageKey(account)))
  } catch {
    return normalizeTapIndicatorSettings(DEFAULT_TAP_INDICATOR)
  }
}

export function saveChatTapIndicator(settings, expectedAccount = chatThemeAccount()) {
  if (chatThemeAccount() !== expectedAccount) throw settingsError('accountChanged')
  const normalized = normalizeTapIndicatorSettings(settings)
  try {
    localStorage.setItem(storageKey(expectedAccount), JSON.stringify(normalized))
  } catch {
    throw settingsError('saveFailed')
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(TAP_INDICATOR_EVENT))
  }
  return normalized
}

export function useChatTapIndicator() {
  const state = useSyncExternalStore(subscribe, snapshot, () => 'guest\n')
  return useMemo(() => {
    const separator = state.indexOf('\n')
    return {
      account: state.slice(0, separator),
      settings: parseSettings(state.slice(separator + 1)),
    }
  }, [state])
}
