function previewSource(page) {
  if (typeof page === 'string') return page
  if (!page || typeof page !== 'object') return ''
  return (
    page.previewUrl ||
    page.imageUrl ||
    page.image_url ||
    page.url ||
    ''
  )
}

export function buildMangaPreviewDraft({
  episodeTitle = '',
  mangaPages = [],
} = {}) {
  const pages = Array.isArray(mangaPages)
    ? mangaPages
        .map((page) => String(previewSource(page) ?? '').trim())
        .filter(Boolean)
        .map((previewUrl) => ({ previewUrl }))
    : []

  return {
    storyType: 'manga',
    episodeTitle: String(episodeTitle ?? ''),
    content: '',
    pages,
    messages: [],
    characters: [],
  }
}
