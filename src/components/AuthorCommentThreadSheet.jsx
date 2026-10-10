import { useEffect, useRef, useState } from 'react'
import CommentSection from './comments/CommentSection'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorCommentThread', {
  en: {
    thread: 'Comment Thread', source: 'Comment on', story: 'Story Comment',
    episode: 'Episode {{number}}', unknownEpisode: 'Episode', change: 'Change episode',
    original: 'Original comment', loading: 'Loading episodes...',
    empty: 'No other episodes available', failed: 'Unable to load episode list',
    replies: '{{count}} comments',
  },
  km: {
    thread: 'មតិយោបល់', source: 'មតិយោបល់មកពី', story: 'មតិយោបល់លើរឿង',
    episode: 'ភាគទី {{number}}', unknownEpisode: 'ភាគ', change: 'ប្តូរភាគ',
    original: 'មតិយោបល់ដើម', loading: 'កំពុងទាញភាគ...',
    empty: 'មិនមានភាគផ្សេងទៀត', failed: 'មិនអាចទាញបញ្ជីភាគបាន',
    replies: 'មតិយោបល់ {{count}}',
  },
  zh: {
    thread: '评论对话', source: '评论来自', story: '作品评论',
    episode: '第 {{number}} 话', unknownEpisode: '章节', change: '切换章节',
    original: '原始评论', loading: '正在加载章节...',
    empty: '没有其他章节', failed: '无法加载章节列表',
    replies: '{{count}} 条评论',
  },
  ja: {
    thread: 'コメントスレッド', source: 'コメントの投稿先', story: '作品へのコメント',
    episode: '第 {{number}} 話', unknownEpisode: 'エピソード', change: '話を切り替える',
    original: '元のコメント', loading: 'エピソードを読み込み中...',
    empty: '他のエピソードはありません', failed: '一覧を読み込めませんでした',
    replies: '{{count}} 件のコメント',
  },
  ko: {
    thread: '댓글 스레드', source: '댓글이 달린 곳', story: '작품 댓글',
    episode: '{{number}}화', unknownEpisode: '에피소드', change: '회차 변경',
    original: '원래 댓글', loading: '회차 불러오는 중...',
    empty: '다른 회차가 없습니다', failed: '회차 목록을 불러올 수 없습니다',
    replies: '댓글 {{count}}개',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const EPISODE_CACHE = new Map()
const EPISODE_CACHE_MS = 5 * 60 * 1000

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function CommentCard({ comment, reply = false }) {
  if (!comment) return null

  return (
    <div
      className={`rounded-2xl border border-slate-200 p-4 dark:border-slate-800 ${
        reply ? 'ml-6' : ''
      }`}
    >
      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-800 dark:text-slate-200">
        {comment.text || ''}
      </p>
    </div>
  )
}

export default function AuthorCommentThreadSheet({ item, onClose, onRead }) {
  const { t } = useDisplayTranslation()
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false)
  const [error, setError] = useState('')
  const [episodeMenuOpen, setEpisodeMenuOpen] = useState(false)
  const [episodeLoading, setEpisodeLoading] = useState(false)
  const [episodeError, setEpisodeError] = useState('')
  const [episodeOptions, setEpisodeOptions] = useState([])
  const [selectedEpisodeId, setSelectedEpisodeId] = useState('')
  const episodeRequestRef = useRef(0)

  useEffect(() => {
    episodeRequestRef.current += 1
    setSelectedEpisodeId('')
    setEpisodeOptions([])
    setEpisodeMenuOpen(false)
    setEpisodeError('')
    setEpisodeLoading(false)

    if (!item?.id) {
      setThread(null)
      setError('')
      return
    }

    let ignore = false

    async function loadThread() {
      try {
        setLoading(true)
        setError('')
        setThread(null)

        const response = await fetch(
          `${API_BASE_URL}/api/comments/${encodeURIComponent(item.id)}/thread`,
          {
            headers: {
              Authorization: `Bearer ${getReaderToken()}`,
            },
            cache: 'no-store',
          }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load comment thread')
        }

        if (!ignore) {
          setThread(data)

          if (!item.is_read) {
            try {
              const readResponse = await fetch(
                `${API_BASE_URL}/api/comments/${encodeURIComponent(item.id)}/author-read`,
                {
                  method: 'PATCH',
                  headers: {
                    Authorization: `Bearer ${getReaderToken()}`,
                  },
                }
              )

              const readData = await readResponse.json().catch(() => ({}))

              if (
                readResponse.ok &&
                readData.ok !== false
              ) {
                onRead?.(item.id)
              }
            } catch {}
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load comment thread')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadThread()

    return () => {
      ignore = true
    }
  }, [item?.id])

  async function loadMoreReplies() {
    const rootComment = thread?.root_comment

    if (
      !rootComment?.id ||
      loadingMoreReplies ||
      !rootComment.reply_has_more
    ) {
      return
    }

    const nextPage =
      Math.max(
        1,
        Number(rootComment.reply_page || 1)
      ) + 1

    try {
      setLoadingMoreReplies(true)

      const response = await fetch(
        `${API_BASE_URL}/api/comments/${rootComment.id}/replies?page=${nextPage}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${getReaderToken()}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load more replies')
      }

      setThread((current) => {
        const currentRoot =
          current?.root_comment

        if (!currentRoot) {
          return current
        }

        const currentReplies =
          Array.isArray(currentRoot.replies)
            ? currentRoot.replies
            : []
        const existingIds =
          new Set(
            currentReplies.map((reply) =>
              String(reply.id)
            )
          )
        const nextReplies =
          Array.isArray(data.replies)
            ? data.replies.filter(
                (reply) =>
                  !existingIds.has(
                    String(reply.id)
                  )
              )
            : []

        return {
          ...current,
          root_comment: {
            ...currentRoot,
            replies: [
              ...currentReplies,
              ...nextReplies,
            ],
            reply_page:
              Number(data.page || nextPage),
            reply_total:
              Number(
                data.total ||
                currentRoot.reply_total ||
                0
              ),
            reply_has_more:
              Boolean(data.has_more),
          },
        }
      })
    } catch (err) {
      setError(
        err.message ||
          'Failed to load more replies'
      )
    } finally {
      setLoadingMoreReplies(false)
    }
  }

  if (!item) return null

  const rootComment = thread?.root_comment || null
  const replies = Array.isArray(rootComment?.replies) ? rootComment.replies : []
  const storyTitle =
    thread?.story?.title || item.story?.title || item.story_title || 'Story Comment'
  const originalEpisodeId =
    rootComment?.episode_id || thread?.episode_id || item?.episode_id || ''
  const storyId =
    rootComment?.story_id || thread?.story?.id || item?.story_id || ''
  const isOriginal = !selectedEpisodeId
  const activeEpisodeId = selectedEpisodeId || originalEpisodeId
  const targetType = activeEpisodeId ? 'episode' : 'story'
  const targetId = activeEpisodeId || storyId
  const originalEpisode = thread?.episode || null
  const activeEpisode = isOriginal
    ? originalEpisode
    : episodeOptions.find((option) => String(option.id) === String(selectedEpisodeId)) || null
  const episodeNumber = Number(activeEpisode?.episode_number)
  const episodeLabel = activeEpisodeId
    ? Number.isInteger(episodeNumber) && episodeNumber > 0
      ? t('authorCommentThread.episode', { number: episodeNumber })
      : t('authorCommentThread.unknownEpisode')
    : t('authorCommentThread.story')
  const episodeTitle = String(activeEpisode?.title || '').trim()
  const story = thread?.story
    ? { ...thread.story, id: storyId || thread.story.id }
    : { id: storyId, title: storyTitle }

  async function toggleEpisodeMenu() {
    if (episodeMenuOpen) {
      setEpisodeMenuOpen(false)
      return
    }

    setEpisodeMenuOpen(true)
    if (!storyId || episodeLoading) return

    const cached = EPISODE_CACHE.get(String(storyId))
    if (cached && cached.expiresAt > Date.now()) {
      setEpisodeOptions(cached.episodes)
      setEpisodeError('')
      return
    }

    const requestId = ++episodeRequestRef.current

    try {
      setEpisodeLoading(true)
      setEpisodeError('')
      const token = getReaderToken()
      const response = await fetch(
        `${API_BASE_URL}/api/comments/story/${encodeURIComponent(storyId)}/episode-options`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false || !Array.isArray(data.episodes)) {
        throw new Error(data.message || t('authorCommentThread.failed'))
      }

      if (requestId !== episodeRequestRef.current) return

      const episodes = data.episodes
        .filter((episode) => episode?.id && String(episode.story_id || storyId) === String(storyId))
        .map((episode) => ({
          id: episode.id,
          title: episode.title || '',
          episode_number: Number(episode.episode_number || 0),
        }))
        .sort((a, b) => a.episode_number - b.episode_number)

      EPISODE_CACHE.set(String(storyId), {
        episodes,
        expiresAt: Date.now() + EPISODE_CACHE_MS,
      })
      if (EPISODE_CACHE.size > 20) {
        EPISODE_CACHE.delete(EPISODE_CACHE.keys().next().value)
      }
      setEpisodeOptions(episodes)
    } catch (err) {
      if (requestId === episodeRequestRef.current) {
        setEpisodeError(err.message || t('authorCommentThread.failed'))
      }
    } finally {
      if (requestId === episodeRequestRef.current) setEpisodeLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-950 dark:text-white">
              {t('authorCommentThread.thread')}
            </h2>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {storyTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl leading-none text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            ×
          </button>
        </header>

        {!loading && !error && rootComment && storyId ? (
          <div className="relative z-20 shrink-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('authorCommentThread.source')}
                </p>
                <div className="mt-1 flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <i className="fa-solid fa-book-open shrink-0 text-[13px] text-slate-500 dark:text-slate-400" />
                  <span className="min-w-0 truncate" title={`${episodeLabel}${episodeTitle ? ` · ${episodeTitle}` : ''}`}>
                    {episodeLabel}{episodeTitle ? ` · ${episodeTitle}` : ''}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleEpisodeMenu}
                aria-expanded={episodeMenuOpen}
                className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {t('authorCommentThread.change')}
                <i className={`fa-solid fa-chevron-${episodeMenuOpen ? 'up' : 'down'} text-[10px]`} />
              </button>
            </div>

            {episodeMenuOpen ? (
              <div className="absolute right-4 top-full z-30 mt-1 w-[min(330px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="max-h-[300px] overflow-y-auto py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEpisodeId('')
                      setEpisodeMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm ${isOriginal ? 'bg-slate-100 font-semibold dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'} text-slate-900 dark:text-white`}
                  >
                    <span className="min-w-0 truncate">
                      {t('authorCommentThread.original')}
                      {originalEpisodeId && Number(originalEpisode?.episode_number) > 0
                        ? ` · ${t('authorCommentThread.episode', { number: originalEpisode.episode_number })}`
                        : ''}
                    </span>
                    {isOriginal ? <i className="fa-solid fa-check text-xs" /> : null}
                  </button>
                  {episodeLoading ? (
                    <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {t('authorCommentThread.loading')}
                    </p>
                  ) : episodeError ? (
                    <p className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                      {t('authorCommentThread.failed')}
                    </p>
                  ) : episodeOptions.length ? (
                    episodeOptions.map((episode) => {
                      const selected = !isOriginal && String(selectedEpisodeId) === String(episode.id)
                      const original = String(originalEpisodeId) === String(episode.id)
                      if (original) return null
                      const number = Number(episode.episode_number)
                      const name = number > 0
                        ? t('authorCommentThread.episode', { number })
                        : t('authorCommentThread.unknownEpisode')
                      return (
                        <button
                          type="button"
                          key={episode.id}
                          onClick={() => {
                            setSelectedEpisodeId(String(episode.id))
                            setEpisodeMenuOpen(false)
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm ${selected ? 'bg-slate-100 font-semibold dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'} text-slate-900 dark:text-white`}
                        >
                          <span className="min-w-0 truncate">
                            {name}{episode.title ? ` · ${episode.title}` : ''}
                          </span>
                          {selected ? <i className="fa-solid fa-check shrink-0 text-xs" /> : null}
                        </button>
                      )
                    })
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      {t('authorCommentThread.empty')}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <main
          className={`min-h-0 flex-1 ${
            rootComment && targetId && !loading && !error
              ? 'overflow-hidden'
              : 'overflow-y-auto p-4'
          }`}
        >
          {loading ? (
            <div className="space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
              <div className="ml-6 h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          ) : rootComment && targetId ? (
            <CommentSection
              key={`${targetType}:${targetId}:${isOriginal ? 'original' : 'all'}`}
              targetType={targetType}
              targetId={targetId}
              story={story}
              variant="modal"
              focusCommentId={isOriginal ? thread?.target_comment_id || item.id : ''}
              threadComment={isOriginal ? rootComment : null}
            />
          ) : rootComment ? (
            <div className="space-y-3">
              <CommentCard comment={rootComment} />
              {replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} reply />
              ))}

              {rootComment.reply_has_more ? (
                <button
                  type="button"
                  onClick={loadMoreReplies}
                  disabled={loadingMoreReplies}
                  className="ml-6 w-[calc(100%-1.5rem)] rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-60 dark:border-slate-800 dark:text-slate-200"
                >
                  {loadingMoreReplies ? 'Loading...' : 'Load more replies'}
                </button>
              ) : null}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
