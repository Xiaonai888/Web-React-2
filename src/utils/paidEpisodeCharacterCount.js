export const PAID_NOVEL_MINIMUMS = Object.freeze({
  Khmer: 7000,
  English: 5000,
  Chinese: 3000,
  Japanese: 3000,
  Korean: 4000,
})

export const FREE_PUBLISHED_EPISODE_LIMIT = 5

export function countPaidNovelCharacters(value) {
  let text = String(value || '')
  let previous

  do {
    previous = text
    text = text
      .replace(/<img\b[^>]*>/gi, ' ')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/<\/(?:p|div)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  } while (text !== previous)

  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return Array.from(text.replace(/\s/gu, '')).length
}
