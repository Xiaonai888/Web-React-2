export const AUTHOR_NOTE_MAX_CHARACTERS = 500

const segmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('und', { granularity: 'grapheme' })
    : null

export function normalizeAuthorNote(value) {
  return String(value ?? '').normalize('NFC').replace(/\r\n?/g, '\n')
}

export function getAuthorNoteCharacterCount(value) {
  const note = normalizeAuthorNote(value)
  if (!segmenter) return Array.from(note).length
  let count = 0
  for (const entry of segmenter.segment(note)) {
    if (entry.segment) count += 1
  }
  return count
}

export function limitAuthorNote(value, maximum = AUTHOR_NOTE_MAX_CHARACTERS) {
  const note = normalizeAuthorNote(value)
  const limit = Math.max(0, Math.floor(Number(maximum) || 0))
  if (!segmenter) return Array.from(note).slice(0, limit).join('')
  let output = ''
  let count = 0
  for (const entry of segmenter.segment(note)) {
    if (count >= limit) break
    output += entry.segment
    count += 1
  }
  return output
}
