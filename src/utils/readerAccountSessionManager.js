import {
  getActiveReaderToken,
  getReaderSessionIdentity,
  isActiveReaderSession,
} from './readerActiveAccount'
import { rememberReaderAccount } from './readerRememberedAccounts'
import { clearReaderAccountSwitchIntent } from './readerAccountSwitchIntent'

const TOKEN_KEY = 'shadow_reader_token'
const USER_KEY = 'shadow_reader_user'
const ACCOUNT_CHANGED_EVENT = 'shadow:reader-account-changed'

function restore(storage, key, previousValue) {
  try {
    if (previousValue === null) storage.removeItem(key)
    else storage.setItem(key, previousValue)
  } catch {}
}

export function activateReaderAccount({ token, user, remember = true }) {
  const identity = getReaderSessionIdentity(token)
  if (!identity || String(user?.id || '') !== identity.userId) {
    throw new Error('Reader login identity does not match the account')
  }

  const primary = remember ? localStorage : sessionStorage
  const secondary = remember ? sessionStorage : localStorage
  const records = [primary, secondary].flatMap((storage) => [
    { storage, key: TOKEN_KEY, previousValue: storage.getItem(TOKEN_KEY) },
    { storage, key: USER_KEY, previousValue: storage.getItem(USER_KEY) },
  ])

  try {
    primary.setItem(TOKEN_KEY, token)
    primary.setItem(USER_KEY, JSON.stringify(user))
    secondary.removeItem(TOKEN_KEY)
    secondary.removeItem(USER_KEY)
    if (getActiveReaderToken() !== token) throw new Error('Unable to activate the selected reader account')
  } catch (error) {
    for (const entry of records) restore(entry.storage, entry.key, entry.previousValue)
    throw error
  }

  if (remember) rememberReaderAccount(user)
  clearReaderAccountSwitchIntent()
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(ACCOUNT_CHANGED_EVENT))
  return identity.userId
}

export function isReaderAccountResponseCurrent(requestToken, userId = '') {
  if (!isActiveReaderSession(requestToken)) return false
  const identity = getReaderSessionIdentity(requestToken)
  return Boolean(identity && (!userId || identity.userId === String(userId)))
}

export function subscribeReaderAccountChanges(listener) {
  if (typeof window === 'undefined' || typeof listener !== 'function') return () => {}
  const onStorage = (event) => {
    if (event.key === TOKEN_KEY || event.key === USER_KEY || event.key === null) listener()
  }
  window.addEventListener(ACCOUNT_CHANGED_EVENT, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(ACCOUNT_CHANGED_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}
