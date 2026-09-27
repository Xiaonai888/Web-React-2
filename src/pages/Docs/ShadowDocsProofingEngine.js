function plainTextFromHTML(html) {
  const source = String(html || '').slice(0, 500_000)
  if (typeof DOMParser === 'undefined') return source.replace(/<[^>]*>/g, ' ')
  return new DOMParser().parseFromString(source, 'text/html').body.textContent || ''
}

function words(value) {
  return String(value || '').match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*/gu) || []
}

export function getShadowDocsProofingStats(html) {
  const text = plainTextFromHTML(html)
  const wordList = words(text)
  const paragraphs = text.split(/\n+/).map(value => value.trim()).filter(Boolean)
  const sentences = text.split(/[.!?។៕]+/u).map(value => value.trim()).filter(Boolean)
  return {
    words: wordList.length,
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, '')].length,
    paragraphs: paragraphs.length,
    sentences: sentences.length,
    estimatedMinutes: Math.max(1, Math.ceil(wordList.length / 220)),
  }
}

export function inspectShadowDocsProofing(html, options = {}) {
  const text = plainTextFromHTML(html)
  const issues = []
  const maxParagraphWords = Math.max(40, Math.min(1000, Number(options.maxParagraphWords) || 220))
  const paragraphs = text.split(/\n+/).map(value => value.trim()).filter(Boolean)

  paragraphs.forEach((paragraph, index) => {
    const count = words(paragraph).length
    if (count > maxParagraphWords) {
      issues.push({ type: 'long-paragraph', paragraph: index + 1, words: count, message: `Paragraph ${index + 1} has ${count} words.` })
    }
  })

  const tokens = words(text)
  for (let index = 1; index < tokens.length; index += 1) {
    if (tokens[index].localeCompare(tokens[index - 1], undefined, { sensitivity: 'base' }) === 0) {
      issues.push({ type: 'repeated-word', word: tokens[index], index, message: `Repeated word: ${tokens[index]}` })
      if (issues.length >= 200) break
    }
  }
  return issues
}

export function getShadowDocsBookProofingStats(book) {
  const chapters = Array.isArray(book?.chapters) ? book.chapters : []
  return chapters.reduce((total, chapter) => {
    const stats = getShadowDocsProofingStats(chapter?.html)
    total.words += stats.words
    total.characters += stats.characters
    total.paragraphs += stats.paragraphs
    total.sentences += stats.sentences
    return total
  }, { words: 0, characters: 0, paragraphs: 0, sentences: 0 })
}
