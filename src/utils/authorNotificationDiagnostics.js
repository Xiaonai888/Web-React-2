const STORAGE_KEY = 'shadow_author_notification_diagnostics_v1'
const TARGET_PATH = '/author/page/notifications'
const LIST_PATH = '/api/authors/me/page-notifications'

function isNotificationsPage() {
  return window.location.pathname.replace(/\/+$/, '') === TARGET_PATH
}

function readDiagnostic() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

function writeDiagnostic(value) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {}
}

function safeDetail(value) {
  return String(value || '')
    .replace(/Bearer\s+\S+/gi, '[hidden]')
    .replace(/https?:\/\/\S+/gi, '[url]')
    .replace(/\b[A-Za-z0-9_-]{45,}\b/g, '[hidden]')
    .slice(0, 140)
}

export function installAuthorNotificationDiagnostics() {
  if (window.__shadowAuthorNotificationDiagnosticsInstalled) return
  window.__shadowAuthorNotificationDiagnosticsInstalled = true

  const previous = readDiagnostic()
  const navigationType = performance.getEntriesByType?.('navigation')?.[0]?.type
  const recoveryGap = Date.now() - Number(previous?.heartbeatAt || 0)
  const recoveryNeeded = isNotificationsPage() &&
    navigationType === 'reload' &&
    previous?.active === true &&
    Boolean(previous.lastError)

  let active = false
  let lastPulse = 0
  let warnedSlow = false

  function record(event, detail = '', changes = {}) {
    if (!isNotificationsPage()) return
    const before = readDiagnostic() || {}
    const now = Date.now()
    const safe = safeDetail(detail)
    writeDiagnostic({
      ...before,
      ...changes,
      active: true,
      heartbeatAt: now,
      event,
      detail: safe,
      recordedAt: new Date(now).toISOString(),
      history: [
        ...(Array.isArray(before.history) ? before.history : []),
        { event, detail: safe, at: new Date(now).toISOString() },
      ].slice(-8),
    })
  }

  function showReport(reason, snapshot = readDiagnostic()) {
    if (
  !isNotificationsPage() ||
  new URLSearchParams(window.location.search).get('notification_debug') !== '1' ||
  document.getElementById('shadow-author-notification-diagnostic')
) return

    const report = {
      reason,
      route: TARGET_PATH,
      recorded_at: new Date().toISOString(),
      online: navigator.onLine,
      last_event: snapshot?.event || '',
      detail: snapshot?.detail || '',
      pending_api: Boolean(snapshot?.pending),
      last_error: snapshot?.lastError || null,
      recent_events: snapshot?.history || [],
    }

    const panel = document.createElement('section')
    panel.id = 'shadow-author-notification-diagnostic'
    panel.setAttribute('role', 'alert')
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '94px',
      left: '12px',
      right: '12px',
      maxWidth: '520px',
      margin: '0 auto',
      zIndex: '2147483647',
      padding: '14px',
      background: '#fff',
      color: '#172033',
      border: '1px solid #e7a646',
      borderRadius: '14px',
      boxShadow: '0 8px 28px rgba(0,0,0,.22)',
      font: '13px/1.6 system-ui, sans-serif',
    })

    const heading = document.createElement('div')
    heading.style.fontWeight = '700'
    heading.textContent = 'Notifications មានបញ្ហា — Diagnostic'

    const summary = document.createElement('div')
    summary.style.marginTop = '4px'
    summary.textContent = `${reason} · ${report.last_event || 'UNKNOWN'}`

    const details = document.createElement('details')
    details.style.marginTop = '8px'
    const toggle = document.createElement('summary')
    toggle.textContent = 'មើលព័ត៌មានកំហុស'
    const pre = document.createElement('pre')
    pre.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;max-height:150px;overflow:auto;font-size:11px'
    pre.textContent = JSON.stringify(report, null, 2)
    details.append(toggle, pre)

    const buttons = document.createElement('div')
    buttons.style.cssText = 'display:flex;gap:8px;margin-top:10px'

    const copy = document.createElement('button')
    copy.type = 'button'
    copy.textContent = 'Copy Error'
    copy.style.cssText = 'background:#172033;color:#fff;border:0;border-radius:8px;padding:7px 12px'
    copy.onclick = () => {
      navigator.clipboard?.writeText(JSON.stringify(report, null, 2))
        .then(() => { copy.textContent = 'Copied' })
        .catch(() => { details.open = true })
    }

    const close = document.createElement('button')
    close.type = 'button'
    close.textContent = 'បិទ'
    close.style.cssText = 'background:#f0f1f3;color:#172033;border:0;border-radius:8px;padding:7px 12px'
    close.onclick = () => {
      panel.remove()
      const now = readDiagnostic()
      if (now) writeDiagnostic({ ...now, lastError: null })
    }

    buttons.append(copy, close)
    panel.append(heading, summary, details, buttons)
    document.body.appendChild(panel)
  }

  function syncRoute() {
    const onPage = isNotificationsPage() && document.visibilityState === 'visible'
    if (onPage && !active) {
      active = true
      lastPulse = Date.now()
      warnedSlow = false
      record('PAGE_ENTERED')
    } else if (!onPage && active) {
      active = false
      lastPulse = 0
      const snapshot = readDiagnostic()
      if (snapshot) writeDiagnostic({ ...snapshot, active: false, pending: false })
    }
  }

  window.addEventListener('shadow-reader-route-change', syncRoute)
  window.addEventListener('popstate', syncRoute)
  document.addEventListener('visibilitychange', syncRoute)
    syncRoute()
  window.addEventListener('shadow-author-notification-stage', ({ detail }) => {
    if (!isNotificationsPage()) return
    if (detail?.stage === 'DATA_READY' || detail?.stage === 'PAGE_RENDERED') record(detail.stage)
  })

  window.setInterval(() => {
    if (!isNotificationsPage() || document.visibilityState !== 'visible') return
    const now = Date.now()
    const gap = lastPulse ? now - lastPulse : 0
    lastPulse = now

    if (gap > 9000) {
      record('MAIN_THREAD_STALL', `${gap}ms event-loop delay`)
      showReport('Browser មិនឆ្លើយតបមួយរយៈ')
    }

    const snapshot = readDiagnostic() || {}
    if (snapshot.pending && now - Number(snapshot.pendingSince || now) > 12000 && !warnedSlow) {
      warnedSlow = true
      record('API_SLOW', 'Notifications list request exceeded 12s')
      showReport('Notifications API ឆ្លើយតបយឺត')
    }

    writeDiagnostic({ ...(readDiagnostic() || {}), heartbeatAt: now, active: true })
  }, 2000)

  window.addEventListener('error', (event) => {
    if (!isNotificationsPage()) return
    const message = safeDetail(`${event.error?.name || 'Error'}: ${event.message || event.error?.message || ''}`)
    record('JAVASCRIPT_ERROR', message, { lastError: message })
    showReport('JavaScript Error')
  })

  window.addEventListener('unhandledrejection', (event) => {
    if (!isNotificationsPage()) return
    const reason = event.reason
    const message = safeDetail(`${reason?.name || 'PromiseError'}: ${reason?.message || String(reason || '')}`)
    record('UNHANDLED_PROMISE', message, { lastError: message })
    showReport('Promise Error')
  })

  const originalFetch = window.fetch
  window.fetch = function (...args) {
    const input = args[0]
    const address = typeof input === 'string' ? input : input?.url || ''
    let isListRequest = false
    try {
      isListRequest = isNotificationsPage() &&
        new URL(address, window.location.href).pathname === LIST_PATH
    } catch {}

    if (!isListRequest) return originalFetch.apply(this, args)

    const startedAt = Date.now()
    warnedSlow = false
    record('API_LIST_STARTED', 'GET author page notifications', {
      pending: true,
      pendingSince: startedAt,
    })

    const finish = (event, detail, failed) => {
      record(event, detail, {
        pending: false,
        pendingSince: null,
        lastError: failed ? safeDetail(detail) : null,
      })
      if (failed) showReport(event)
    }

    try {
      return Promise.resolve(originalFetch.apply(this, args)).then(
        (response) => {
          finish(
            response.ok ? 'API_LIST_SUCCESS' : 'API_HTTP_ERROR',
            `HTTP ${response.status}, ${Date.now() - startedAt}ms`,
            !response.ok
          )
          return response
        },
        (error) => {
          finish('API_NETWORK_ERROR', `${error?.name || 'Error'}: ${error?.message || 'Network failure'}`, true)
          throw error
        }
      )
    } catch (error) {
      finish('API_NETWORK_ERROR', `${error?.name || 'Error'}: ${error?.message || 'Network failure'}`, true)
      throw error
    }
  }

  if (recoveryNeeded) {
    window.setTimeout(() => {
      const reason = previous.pending
        ? 'Refresh ខណៈ Notifications API មិនទាន់ឆ្លើយតប'
        : previous.lastError
          ? 'រកឃើញកំហុសមុន Refresh'
          : `សង្ស័យថាគាំងមុន Refresh (${Math.round(recoveryGap / 1000)}s)`
      showReport(reason, previous)
    }, 700)
  }
}
