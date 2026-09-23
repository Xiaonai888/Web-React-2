const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin
const AUTH_REPORT_KEY = 'shadow_reader_auth_report_v1'
const AUTH_LOGIN_KEY = 'shadow_reader_login_diagnostic_v1'
const AUTH_CHANGE_KEY = 'shadow_reader_token_change_v1'
let lastLoginToken = ''
let lastShownReport = ''
const AUTH_POPUP_ENABLED = false

function tokenStatus(token) {
  if (!token) return 'MISSING'
  try {
    const encoded = token.split('.')[1]
    const payload = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.session_id || !payload.device_id || !payload.jwt_id) return 'SESSION_FIELDS_MISSING'
    if (payload.exp && payload.exp * 1000 <= Date.now()) return 'EXPIRED'
    return 'SESSION_FIELDS_PRESENT'
  } catch {
    return 'UNREADABLE'
  }
}

function readDiagnostic(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null') } catch { return null }
}

function writeDiagnostic(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function diagnosticCallsite() {
  return String(new Error().stack || '').split('\n').slice(3, 7).map((line) => {
    const fn = line.match(/\bat\s+([^\s(]+)\s*\(/)?.[1] || 'anonymous'
    const position = line.match(/([^/?()\s]+\.(?:js|jsx)):(\d+):(\d+)/)
    return position ? `${fn} ${position[1]}:${position[2]}:${position[3]}` : fn
  }).join(' | ').slice(0, 250)
}

function showAuthReport(report) {
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => showAuthReport(report), { once: true })
    return
  }
  let panel = document.getElementById('shadow-auth-diagnostic-panel')
  if (!panel) {
    panel = document.createElement('section')
    panel.id = 'shadow-auth-diagnostic-panel'
    panel.style.cssText = 'position:fixed;z-index:2147483647;top:12px;left:12px;right:12px;max-width:660px;max-height:85vh;overflow:auto;margin:auto;padding:16px;background:#fff;color:#171717;border:2px solid #b91c1c;border-radius:12px;box-shadow:0 8px 36px #0005;font:13px/1.5 monospace;white-space:pre-wrap;overflow-wrap:anywhere'
    const heading = document.createElement('div')
    heading.textContent = 'Shadow: Login / Task Center Diagnostic'
    heading.style.cssText = 'font-weight:bold;font-size:15px;margin-bottom:8px'
    const details = document.createElement('pre')
    details.id = 'shadow-auth-diagnostic-details'
    details.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 12px'
    const close = document.createElement('button')
    close.type = 'button'
    close.textContent = 'Close / បិទ'
    close.style.cssText = 'padding:8px 14px;border:0;border-radius:8px;background:#991b1b;color:white;cursor:pointer'
    close.addEventListener('click', () => {
      panel.remove()
      try { sessionStorage.removeItem(AUTH_REPORT_KEY) } catch {}
    })
    panel.append(heading, details, close)
    document.body.appendChild(panel)
  }
  panel.querySelector('#shadow-auth-diagnostic-details').textContent = JSON.stringify(report, null, 2)
}

function reportAuthFailure(reason, details) {
  const report = { time: new Date().toISOString(), reason, ...details }
  writeDiagnostic(AUTH_REPORT_KEY, report)
  const signature = `${reason}:${details.path || ''}:${details.code || ''}:${details.tokenChange?.time || ''}`
  if (signature !== lastShownReport) {
    lastShownReport = signature
    console.warn('SHADOW_AUTH_DIAGNOSTIC', report)
    if (AUTH_POPUP_ENABLED) showAuthReport(report)
  }
}

function installTokenChangeWatch() {
  if (window.__shadowReaderTokenChangeWatchInstalled) return
  window.__shadowReaderTokenChangeWatchInstalled = true
  for (const method of ['setItem', 'removeItem', 'clear']) {
    const original = Storage.prototype[method]
    Storage.prototype[method] = function (...args) {
      if (this !== localStorage && this !== sessionStorage) return original.apply(this, args)
      if (method !== 'clear' && args[0] !== 'shadow_reader_token') return original.apply(this, args)
      const before = this.getItem('shadow_reader_token') || ''
      if (method === 'setItem' && tokenStatus(String(args[1] || '')) !== 'SESSION_FIELDS_PRESENT' &&
        [sessionStorage, localStorage].some((storage) => tokenStatus(storage.getItem('shadow_reader_token') || '') === 'SESSION_FIELDS_PRESENT')) {
        const change = {
          time: new Date().toISOString(),
          method,
          storage: this === localStorage ? 'localStorage' : 'sessionStorage',
          before: tokenStatus(before),
          attempted: tokenStatus(String(args[1] || '')),
          blocked: true,
          callsite: diagnosticCallsite(),
        }
        writeDiagnostic(AUTH_CHANGE_KEY, change)
        reportAuthFailure('INVALID_TOKEN_OVERWRITE_BLOCKED', { tokenChange: change, lastLogin: readDiagnostic(AUTH_LOGIN_KEY) })
        return undefined
      }
      const result = original.apply(this, args)
      const after = this.getItem('shadow_reader_token') || ''
      if (before !== after) {
        const change = {
          time: new Date().toISOString(),
          method,
          storage: this === localStorage ? 'localStorage' : 'sessionStorage',
          before: tokenStatus(before),
          after: tokenStatus(after),
          callsite: diagnosticCallsite(),
        }
        writeDiagnostic(AUTH_CHANGE_KEY, change)
        if (before && !after && !localStorage.getItem('shadow_reader_token') && !sessionStorage.getItem('shadow_reader_token')) {
          reportAuthFailure('ALL_LOGIN_TOKENS_REMOVED', { tokenChange: change })
        }
      }
      return result
    }
  }
}

function discardSessionlessReaderTokens() {
  let discarded = false
  for (const storage of [sessionStorage, localStorage]) {
    const token = storage.getItem('shadow_reader_token')
    if (!token) continue
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload?.type !== 'reader' || (payload.session_id && payload.device_id && payload.jwt_id)) continue
      storage.removeItem('shadow_reader_token')
      storage.removeItem('shadow_reader_user')
      discarded = true
    } catch {}
  }
  return discarded
}

function inspectLoginResponse(response) {
  if (!response.ok) return
  response.clone().json().then((data) => {
    if (!data?.token) return
    lastLoginToken = data.token
    const login = { time: new Date().toISOString(), http: response.status, token: tokenStatus(data.token) }
    writeDiagnostic(AUTH_LOGIN_KEY, login)
    setTimeout(() => {
      const local = localStorage.getItem('shadow_reader_token') || ''
      const session = sessionStorage.getItem('shadow_reader_token') || ''
      writeDiagnostic(AUTH_LOGIN_KEY, {
        ...login,
        localToken: tokenStatus(local),
        sessionToken: tokenStatus(session),
        localMatchesLogin: !!local && local === data.token,
        sessionMatchesLogin: !!session && session === data.token,
      })
    }, 600)
  }).catch(() => {})
}

function inspectAuthResponse(response, requestToken, path) {
  if (response.status !== 401 && response.status !== 403) return
  response.clone().json().then((data) => {
    const code = String(data?.code || '')
    if (!['TOKEN_REQUIRED', 'TOKEN_INVALID', 'TOKEN_EXPIRED', 'WRONG_TOKEN_TYPE', 'READER_SESSION_REQUIRED', 'READER_SESSION_REVOKED', 'READER_SESSION_EXPIRED'].includes(code)) return
    const local = localStorage.getItem('shadow_reader_token') || ''
    const session = sessionStorage.getItem('shadow_reader_token') || ''
    reportAuthFailure('API_AUTH_REJECTED', {
      path,
      http: response.status,
      code,
      requestToken: tokenStatus(requestToken),
      requestMatchesLocal: !!requestToken && requestToken === local,
      requestMatchesSession: !!requestToken && requestToken === session,
      requestMatchesLatestLogin: !!requestToken && requestToken === lastLoginToken,
      localToken: tokenStatus(local),
      sessionToken: tokenStatus(session),
      lastLogin: readDiagnostic(AUTH_LOGIN_KEY),
      tokenChange: readDiagnostic(AUTH_CHANGE_KEY),
    })
  }).catch(() => {})
}

function handleReaderSessionResponse(fetchPromise, requestToken, path) {
  return fetchPromise.then((response) => {
    if (path === '/api/users/login' || path === '/api/users/login/verify') inspectLoginResponse(response)
    inspectAuthResponse(response, requestToken, path)
    const renewedToken = response.headers.get('X-Reader-Token')
    if (renewedToken && tokenStatus(requestToken) === 'SESSION_FIELDS_PRESENT' && tokenStatus(renewedToken) !== 'SESSION_FIELDS_PRESENT') {
      reportAuthFailure('INVALID_RENEWAL_TOKEN_RECEIVED', { path, http: response.status, requestToken: tokenStatus(requestToken), renewalToken: tokenStatus(renewedToken) })
      return response
    }
    const currentToken = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
    if (renewedToken && requestToken && currentToken === requestToken) {
      if (sessionStorage.getItem('shadow_reader_token') === requestToken) {
        sessionStorage.setItem('shadow_reader_token', renewedToken)
      }
      if (localStorage.getItem('shadow_reader_token') === requestToken) {
        localStorage.setItem('shadow_reader_token', renewedToken)
      }
    }
    return response
  })
}

export function installApiAuthFetch() {
  if (window.__shadowApiAuthFetchInstalled) return
  window.__shadowApiAuthFetchInstalled = true
  installTokenChangeWatch()
  const previousReport = readDiagnostic(AUTH_REPORT_KEY)
  if (AUTH_POPUP_ENABLED && previousReport && Date.now() - Date.parse(previousReport.time || '') < 10 * 60 * 1000) showAuthReport(previousReport)
  const discarded = discardSessionlessReaderTokens()
  if (discarded && !sessionStorage.getItem('shadow_reader_token') && !localStorage.getItem('shadow_reader_token') && !['/login', '/register'].includes(window.location.pathname)) {
    window.location.replace('/login')
    return
  }
  const nativeFetch = window.fetch.bind(window)
  window.fetch = (input, init = {}) => {
    const requestUrl = input instanceof Request ? input.url : String(input)
    const url = new URL(requestUrl, window.location.origin)
    const method = String(init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
    if (
      url.origin !== API_ORIGIN ||
      (method === 'GET' && ['/health/maintenance', '/api/advertisements/public', '/api/public/content-versions', '/api/events'].includes(url.pathname))
    ) return nativeFetch(input, init)
    const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
    if (!token) {
      const originalHeaders = new Headers(input instanceof Request ? input.headers : undefined)
      new Headers(init.headers || {}).forEach((value, key) => originalHeaders.set(key, value))
      const authorization = originalHeaders.get('Authorization') || ''
      const explicitToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
      return handleReaderSessionResponse(nativeFetch(input, init), explicitToken, url.pathname)
    }
    const headers = new Headers(input instanceof Request ? input.headers : undefined)
    new Headers(init.headers || {}).forEach((value, key) => headers.set(key, value))
    if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
    const authorization = headers.get('Authorization') || ''
    const requestToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
    if (input instanceof Request) {
      return handleReaderSessionResponse(nativeFetch(new Request(input, { ...init, headers })), requestToken, url.pathname)
    }
    return handleReaderSessionResponse(nativeFetch(input, { ...init, headers }), requestToken, url.pathname)
  }
}
