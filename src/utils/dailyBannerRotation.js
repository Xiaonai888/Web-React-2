export function getDailyBannerStartIndex(sectionKey, length) {
  if (!length) return 0
  const now = new Date(), day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`, key = `shadow_daily_banner_${sectionKey}`
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}'), nextIndex = saved.day === day && Number.isInteger(Number(saved.nextIndex)) ? Number(saved.nextIndex) % length : 0
    localStorage.setItem(key, JSON.stringify({ day, nextIndex: (nextIndex + 1) % length }))
    return nextIndex
  } catch { return 0 }
}
