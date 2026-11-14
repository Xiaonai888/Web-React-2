const TOKEN_KEY = 'shadow_reader_token'
const USER_KEY = 'shadow_reader_user'

function read(storage, key) {
  try {
    return storage.getItem(key) || ''
  } catch {
    return ''
  }
}

export function getActiveReaderToken() {
  return read(sessionStorage, TOKEN_KEY) || read(localStorage, TOKEN_KEY)
}

export function getReaderSessionIdentity(token) {
  try {
    if (!token || typeof token !== 'string') return null
    const encoded = token.split('.')[1]
    if (!encoded) return null
    const payload = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.type !== 'reader' || !payload.user_id || !payload.session_id || !payload.device_id || !payload.jwt_id) return null
    return {
      userId: String(payload.user_id),
      sessionId: String(payload.session_id),
      deviceId: String(payload.device_id),
      jwtId: String(payload.jwt_id),
    }
  } catch {
    return null
  }
}

export function isSameReaderSession(firstToken, secondToken) {
  const first = getReaderSessionIdentity(firstToken)
  const second = getReaderSessionIdentity(secondToken)
  return Boolean(
    first && second &&
    first.userId === second.userId &&
    first.sessionId === second.sessionId &&
    first.deviceId === second.deviceId &&
    first.jwtId === second.jwtId
  )
}

export function isActiveReaderSession(requestToken) {
  return isSameReaderSession(requestToken, getActiveReaderToken())
}

export function getActiveReaderUser() {
  const token = getActiveReaderToken()
  const identity = getReaderSessionIdentity(token)
  if (!identity) return null

  const stores = read(sessionStorage, TOKEN_KEY) === token
    ? [sessionStorage, localStorage]
    : [localStorage, sessionStorage]

  for (const storage of stores) {
    try {
      const user = JSON.parse(read(storage, USER_KEY) || 'null')
      if (user && String(user.id || '') === identity.userId) return user
    } catch {}
  }
  return null
}

export function saveActiveReaderUser(user, requestToken = getActiveReaderToken()) {
  const identity = getReaderSessionIdentity(requestToken)
  if (!identity || !user || String(user.id || '') !== identity.userId || !isActiveReaderSession(requestToken)) return false

  const value = JSON.stringify(user)
  const activeToken = getActiveReaderToken()
  let saved = false

  for (const storage of [sessionStorage, localStorage]) {
    if (read(storage, TOKEN_KEY) !== activeToken) continue
    try {
      storage.setItem(USER_KEY, value)
      saved = true
    } catch {}
  }
  return saved
}
