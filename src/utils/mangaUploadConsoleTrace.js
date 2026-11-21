const MAX_RECORDS = 150
const records = []
const lastLogged = new Map()

const SAFE_FIELDS = [
  'page', 'stage', 'state', 'status', 'code', 'message', 'percent',
  'httpStatus', 'elapsedMs', 'waitSeconds', 'bytes', 'loaded',
  'attempts', 'maxAttempts', 'jobStatus', 'diagnosticPresent',
  'workerState', 'admissionReason', 'memoryUsedMb', 'memoryLimitMb',
  'apiOrigin', 'route', 'jobTag', 'retryCount', 'errorName',
]

function scrub(value) {
  return String(value ?? '')
    .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(/https?:\/\/\S+/gi, '[URL REDACTED]')
    .replace(/(token|secret|signature|password|authorization)\s*[=:]\s*\S+/gi, '$1=[REDACTED]')
    .slice(0, 300)
}

function sanitize(detail) {
  const output = {}
  for (const key of SAFE_FIELDS) {
    const value = detail?.[key]
    if (value === null || value === undefined || value === '') continue
    if (typeof value === 'number' && Number.isFinite(value)) {
      output[key] = Math.round(value * 100) / 100
    } else if (typeof value === 'boolean') {
      output[key] = value
    } else if (typeof value === 'string') {
      output[key] = key === 'apiOrigin' ? String(value).slice(0, 150) : scrub(value)
    }
  }
  return output
}

export function mangaApiOrigin(url) {
  try {
    return new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://invalid.example').origin
  } catch {
    return 'unknown'
  }
}

export function traceMangaUpload(stage, detail = {}, severity = 'info') {
  const safeStage = scrub(stage).slice(0, 60)
  const data = sanitize(detail)
  const now = Date.now()
  const key = `${safeStage}|${data.page || ''}|${data.state || ''}|${data.jobStatus || ''}|${data.code || ''}|${data.httpStatus ?? ''}`
  const last = lastLogged.get(key)
  const bucket = Number.isFinite(data.percent) ? Math.floor(data.percent / 10) : null
  const minIntervalMs = severity === 'warn' ? 60000 : severity === 'error' ? 10000 : 30000
  const suppress = last && now - last.at < minIntervalMs && last.bucket === bucket
  if (suppress) return

  lastLogged.set(key, { at: now, bucket })
  if (lastLogged.size > 150) lastLogged.clear()
  const row = { at: new Date(now).toISOString(), stage: safeStage, ...data }
  records.push(row)
  if (records.length > MAX_RECORDS) records.shift()

  if (typeof console !== 'undefined') {
    const level = severity === 'error' ? 'error' : severity === 'warn' ? 'warn' : 'info'
    try { console[level](`[MANGA UPLOAD] ${safeStage}`, row) } catch {}
  }
}

export function getMangaUploadConsoleTrace() {
  return records.map((row) => ({ ...row }))
}
