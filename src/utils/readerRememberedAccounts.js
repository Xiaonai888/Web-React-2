const STORAGE_KEY = 'shadow_reader_remembered_accounts_v1'
const MAX_ACCOUNTS = 10

function safeText(value, limit) {
  return String(value || '').trim().slice(0, limit)
}

function safeAvatar(value) {
  const url = safeText(value, 2048)
  return /^https:\/\/[^\s]+$/i.test(url) || /^\/(?!\/)[^\s]*$/.test(url) ? url : ''
}

function normalizeAccount(value) {
  const id = safeText(value?.id, 100)
  if (!id) return null
  return {
    id,
    username: safeText(value?.username, 60),
    name: safeText(value?.name, 120),
    avatarUrl: safeAvatar(value?.avatarUrl || value?.avatar_url),
    lastUsedAt: Number.isFinite(Number(value?.lastUsedAt)) ? Number(value.lastUsedAt) : 0,
  }
}

function readAccounts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    const byId = new Map()
    for (const raw of parsed.slice(0, 100)) {
      const account = normalizeAccount(raw)
      if (account && !byId.has(account.id)) byId.set(account.id, account)
    }
    return [...byId.values()]
      .sort((a, b) => b.lastUsedAt - a.lastUsedAt)
      .slice(0, MAX_ACCOUNTS)
  } catch {
    return []
  }
}

function writeAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.slice(0, MAX_ACCOUNTS)))
    return true
  } catch {
    return false
  }
}

export function listRememberedReaderAccounts() {
  return readAccounts()
}

export function rememberReaderAccount(user) {
  const next = normalizeAccount(user)
  if (!next) return false
  const previous = readAccounts().find((account) => account.id === next.id)
  next.lastUsedAt = Date.now()
  next.name ||= previous?.name || ''
  next.username ||= previous?.username || ''
  next.avatarUrl ||= previous?.avatarUrl || ''
  return writeAccounts([next, ...readAccounts().filter((account) => account.id !== next.id)])
}

export function forgetRememberedReaderAccount(userId) {
  const id = safeText(userId, 100)
  if (!id) return false
  return writeAccounts(readAccounts().filter((account) => account.id !== id))
}
