const STORAGE_KEY = 'shadow_reader_account_switch_intent_v1'
const INTENT_DURATION_MS = 15 * 60 * 1000

function safeValue(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

export function clearReaderAccountSwitchIntent() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function beginReaderAccountSwitch(account, returnTo = '/me') {
  const userId = safeValue(account?.id, 100)
  if (!userId) return false
  const path = safeValue(returnTo, 200)
  const intent = {
    userId,
    username: safeValue(account?.username, 60),
    returnTo: path.startsWith('/') && !path.startsWith('//') ? path : '/me',
    expiresAt: Date.now() + INTENT_DURATION_MS,
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent))
    return true
  } catch {
    return false
  }
}

export function getReaderAccountSwitchIntent() {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
    if (!value || !value.userId || !Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now()) {
      clearReaderAccountSwitchIntent()
      return null
    }
    return {
      userId: safeValue(value.userId, 100),
      username: safeValue(value.username, 60),
      returnTo: typeof value.returnTo === 'string' && value.returnTo.startsWith('/') && !value.returnTo.startsWith('//') ? value.returnTo : '/me',
    }
  } catch {
    clearReaderAccountSwitchIntent()
    return null
  }
}
