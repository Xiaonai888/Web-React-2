function plainTextFromHTML(html) {
  const source = String(html || '').slice(0, 500_000)
  if (typeof DOMParser === 'undefined') {
    return source
      .replace(/<br\b[^>]*\/?\s*>/gi, '\u2028')
      .replace(/<\/(?:p|div|li|h[1-6]|blockquote|pre|tr|section|article|ul|ol|table)\s*>/gi, '\n')
      .replace(/<[^>]*>/g, ' ')
  }
  const document = new DOMParser().parseFromString(source, 'text/html')
  document.body.querySelectorAll('script,style,template').forEach(node => node.remove())
  document.body.querySelectorAll('br').forEach(node => node.replaceWith(document.createTextNode('\u2028')))
  document.body.querySelectorAll('p,div,li,h1,h2,h3,h4,h5,h6,blockquote,pre,tr,section,article,ul,ol,table').forEach(node => {
    node.appendChild(document.createTextNode('\n'))
  })
  return document.body.textContent || ''
}

function words(value) {
  return String(value || '').match(/[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*/gu) || []
}

function paragraphsFromText(text) {
  return String(text || '').split(/\n+/).map(value => value.trim()).filter(Boolean)
}

export function getShadowDocsProofingStats(html) {
  const text = plainTextFromHTML(html)
  const content = text.replace(/[\n\u2028]/g, '')
  const wordList = words(text)
  const paragraphs = paragraphsFromText(text)
  const sentences = paragraphs.flatMap(paragraph => paragraph.split(/[.!?។៕]+/u).map(value => value.trim()).filter(Boolean))
  return {
    words: wordList.length,
    characters: [...content].length,
    charactersNoSpaces: [...content.replace(/\s/g, '')].length,
    paragraphs: paragraphs.length,
    sentences: sentences.length,
    estimatedMinutes: Math.max(1, Math.ceil(wordList.length / 220)),
  }
}

export function inspectShadowDocsProofing(html, options = {}) {
  const text = plainTextFromHTML(html)
  const issues = []
  const maxParagraphWords = Math.max(40, Math.min(1000, Number(options.maxParagraphWords) || 220))
  const paragraphs = paragraphsFromText(text)
  let tokenOffset = 0

  for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex += 1) {
    const tokens = words(paragraphs[paragraphIndex])
    if (tokens.length > maxParagraphWords) {
      issues.push({ type: 'long-paragraph', paragraph: paragraphIndex + 1, words: tokens.length, message: `Paragraph ${paragraphIndex + 1} has ${tokens.length} words.` })
    }
    if (issues.length >= 200) break

    for (let index = 1; index < tokens.length; index += 1) {
      if (tokens[index].localeCompare(tokens[index - 1], undefined, { sensitivity: 'base' }) === 0) {
        issues.push({ type: 'repeated-word', word: tokens[index], index: tokenOffset + index, message: `Repeated word: ${tokens[index]}` })
        if (issues.length >= 200) break
      }
    }
    if (issues.length >= 200) break
    tokenOffset += tokens.length
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
