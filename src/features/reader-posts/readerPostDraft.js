const DRAFT_KEY =
  'shadow_reader_post_draft'

export const DEFAULT_READER_POST_DRAFT = {
  content: '',
  image_urls: [],
  visibility: 'public',
  comments_permission: 'everyone',
  story_sharing: false,
  publish_at: null,
}

function normalizeImageUrls(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return [
    ...new Set(
      value
        .filter(
          (url) =>
            typeof url === 'string'
        )
        .map((url) => url.trim())
        .filter(Boolean)
    ),
  ].slice(0, 5)
}

function normalizeDraft(value) {
  const source =
    value &&
    typeof value === 'object'
      ? value
      : {}

  return {
    ...DEFAULT_READER_POST_DRAFT,
    ...source,
    content:
      typeof source.content ===
      'string'
        ? source.content
        : '',
    image_urls:
      normalizeImageUrls(
        source.image_urls
      ),
  }
}

export function readReaderPostDraft() {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(
        DRAFT_KEY
      ) || 'null'
    )

    return normalizeDraft(saved)
  } catch {
    return {
      ...DEFAULT_READER_POST_DRAFT,
    }
  }
}

export function writeReaderPostDraft(
  draft
) {
  sessionStorage.setItem(
    DRAFT_KEY,
    JSON.stringify(
      normalizeDraft(draft)
    )
  )
}

export function clearReaderPostDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}
