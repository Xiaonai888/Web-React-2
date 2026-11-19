export function buildNovelPreviewDraft({
  episodeTitle = '',
  content = '',
  editorElement = null,
} = {}) {
  const liveContent =
    editorElement && typeof editorElement.innerHTML === 'string'
      ? editorElement.innerHTML
      : content

  return {
    storyType: 'novel',
    episodeTitle: String(episodeTitle ?? ''),
    content: String(liveContent ?? ''),
    pages: [],
    messages: [],
    characters: [],
  }
}
