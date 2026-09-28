const DEVICE_KEY_STORAGE = 'shadow_reader_device_key'
const DEVICE_KEY_COOKIE = 'shadow_reader_device_key'
const DEVICE_KEY_RE = /^[a-f0-9]{64}$/

function readCookie() {
  const prefix = `${DEVICE_KEY_COOKIE}=`
  const item = document.cookie.split(';').map((value) => value.trim()).find((value) => value.startsWith(prefix))
  return item ? decodeURIComponent(item.slice(prefix.length)) : ''
}

function saveEverywhere(key) {
  if (!DEVICE_KEY_RE.test(String(key || ''))) return ''
  try { localStorage.setItem(DEVICE_KEY_STORAGE, key) } catch {}
  try { sessionStorage.setItem(DEVICE_KEY_STORAGE, key) } catch {}
  try { document.cookie = `${DEVICE_KEY_COOKIE}=${encodeURIComponent(key)}; Max-Age=315360000; Path=/; SameSite=Lax; Secure` } catch {}
  return key
}

function getExistingKey() {
  for (const read of [
    () => localStorage.getItem(DEVICE_KEY_STORAGE) || '',
    () => sessionStorage.getItem(DEVICE_KEY_STORAGE) || '',
    () => readCookie(),
  ]) {
    try {
      const key = String(read() || '').toLowerCase()
      if (DEVICE_KEY_RE.test(key)) return saveEverywhere(key)
    } catch {}
  }
  return ''
}

function getDeviceModel() {
  const ua = String(navigator.userAgent || '')
  const android = ua.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build\/[^;)]+)?[;)]/i)
  if (android?.[1]) return android[1].replace(/\s+/g, ' ').trim().toLowerCase()
  if (/iPhone/i.test(ua)) return 'iphone'
  if (/iPad/i.test(ua)) return 'ipad'
  return String(navigator.platform || 'unknown').toLowerCase()
}

function getFingerprintSource() {
  const screenWidth = Number(window.screen?.width || 0)
  const screenHeight = Number(window.screen?.height || 0)
  const size = [screenWidth, screenHeight].sort((a, b) => a - b).join('x')
  return [
    getDeviceModel(),
    String(navigator.platform || '').toLowerCase(),
    String(navigator.maxTouchPoints || 0),
    String(navigator.hardwareConcurrency || 0),
    String(navigator.deviceMemory || 0),
    size,
    String(window.screen?.colorDepth || 0),
  ].join('|')
}

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function getReaderDeviceKey() {
  const existing = getExistingKey()
  if (existing) return existing
  const source = new TextEncoder().encode(getFingerprintSource())
  const digest = await crypto.subtle.digest('SHA-256', source)
  return saveEverywhere(bytesToHex(digest))
}

export function persistReaderDeviceKey(key) {
  return saveEverywhere(String(key || '').toLowerCase())
}
