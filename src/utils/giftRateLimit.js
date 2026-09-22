const STORAGE_KEY = 'shadow_gift_send_times_v1'
const MIN_GAP_MS = 3000
const MAX_SENDS_PER_MINUTE = 10
let fallbackTimes = []

function getTimes() {
  try {
    const times = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(times) ? times.filter((time) => Number.isFinite(time)) : []
  } catch {
    return fallbackTimes
  }
}

function saveTimes(times) {
  fallbackTimes = times
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(times))
  } catch {
    return
  }
}

export function getGiftWaitSeconds() {
  const now = Date.now()
  const times = getTimes().filter((time) => time > now - 60000 && time <= now)
  const gapWait = times.length ? MIN_GAP_MS - (now - times[times.length - 1]) : 0
  const minuteWait = times.length >= MAX_SENDS_PER_MINUTE ? 60000 - (now - times[0]) : 0
  return Math.max(0, Math.ceil(Math.max(gapWait, minuteWait) / 1000))
}

export function recordGiftSuccess() {
  const now = Date.now()
  saveTimes([...getTimes().filter((time) => time > now - 60000 && time <= now), now])
}

export function showGiftWaitToast(seconds, language = 'en') {
  const messages = {
    en: `Please wait ${seconds} seconds before sending another gift.`,
    km: `សូមរង់ចាំ ${seconds} វិនាទី មុនផ្ញើអំណោយម្តងទៀត។`,
    zh: `请等待 ${seconds} 秒后再发送礼物。`,
    ja: `次のギフトを送るまで ${seconds} 秒お待ちください。`,
    ko: `다음 선물을 보내려면 ${seconds}초 기다려 주세요.`,
  }
  document.getElementById('shadow-gift-wait-toast')?.remove()
  const toast = document.createElement('div')
  toast.id = 'shadow-gift-wait-toast'
  toast.setAttribute('role', 'status')
  toast.textContent = messages[language] || messages.en
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '99999',
    maxWidth: 'calc(100vw - 32px)',
    padding: '9px 14px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    color: '#111111',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1.5',
    textAlign: 'center',
    boxShadow: '0 4px 18px rgba(0,0,0,0.14)',
    pointerEvents: 'none',
    opacity: '1',
    transition: 'opacity 300ms ease, transform 300ms ease',
  })
  document.body.appendChild(toast)
  window.setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translate(-50%, -8px)'
  }, 1300)
  window.setTimeout(() => toast.remove(), 1600)
}
