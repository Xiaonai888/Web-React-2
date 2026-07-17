const DRAFT_KEY =
  'shadow_reader_post_draft'

export const DEFAULT_READER_POST_DRAFT = {
  content: '',
  visibility: 'public',
  comments_permission: 'everyone',
  story_sharing: false,
  publish_at: null,
}

export function readReaderPostDraft() {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(
        DRAFT_KEY
      ) || 'null'
    )

    return {
      ...DEFAULT_READER_POST_DRAFT,
      ...(saved &&
      typeof saved === 'object'
        ? saved
        : {}),
    }
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
    JSON.stringify({
      ...DEFAULT_READER_POST_DRAFT,
      ...draft,
    })
  )
}

export function clearReaderPostDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}
