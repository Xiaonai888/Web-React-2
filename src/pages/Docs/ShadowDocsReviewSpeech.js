let activeRequest = 0

function chunksOf(text, size = 170) {
  const words = String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, 16000).split(' ')
  const chunks = []
  let chunk = ''
  for (const word of words) {
    if (!word) continue
    if (chunk && chunk.length + word.length + 1 > size) {
      chunks.push(chunk)
      chunk = ''
    }
    if (word.length > size) {
      if (chunk) chunks.push(chunk)
      chunk = ''
      for (let i = 0; i < word.length; i += size) chunks.push(word.slice(i, i + size))
    } else {
      chunk = chunk ? `${chunk} ${word}` : word
    }
  }
  if (chunk) chunks.push(chunk)
  return chunks
}

export function canShadowDocsReadAloud() {
  return Boolean(globalThis.speechSynthesis && globalThis.SpeechSynthesisUtterance)
}

export function stopShadowDocsReadAloud() {
  activeRequest += 1
  globalThis.speechSynthesis?.cancel()
}

export function startShadowDocsReadAloud(text, { language = 'en-US', onStateChange } = {}) {
  if (!canShadowDocsReadAloud()) return false
  const parts = chunksOf(text)
  if (!parts.length) return false
  stopShadowDocsReadAloud()
  const request = activeRequest
  let index = 0
  const synth = globalThis.speechSynthesis
  const speakNext = () => {
    if (request !== activeRequest) return
    if (index >= parts.length) {
      onStateChange?.(false)
      return
    }
    const utterance = new globalThis.SpeechSynthesisUtterance(parts[index++])
    utterance.lang = language
    utterance.rate = 1
    utterance.onend = speakNext
    utterance.onerror = () => {
      if (request === activeRequest) onStateChange?.(false)
    }
    synth.speak(utterance)
  }
  onStateChange?.(true)
  speakNext()
  return true
}
