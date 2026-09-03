import { useEffect, useState } from 'react'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('latestCommentSection', {
  en: {
    justNow: 'Just now',
    minutesAgo: '{{count}}m',
    hoursAgo: '{{count}}h',
    reader: 'Reader',
    comments: 'Comments',
    latestReaderComment: 'Latest reader comment',
    firstConversation: 'Be the first to start the conversation',
    viewAll: 'View All',
    stickerComment: 'Sticker comment',
    noCommentsYet: 'No comments yet',
    shareThoughts: 'Share your thoughts, ask a question, or cheer for this story.',
  },
  km: {
    justNow: 'មុននេះបន្តិច',
    minutesAgo: '{{count}} នាទី',
    hoursAgo: '{{count}} ម៉ោង',
    reader: 'អ្នកអាន',
    comments: 'មតិយោបល់',
    latestReaderComment: 'មតិយោបល់ថ្មីបំផុតពីអ្នកអាន',
    firstConversation: 'ក្លាយជាអ្នកដំបូងដែលចាប់ផ្តើមការសន្ទនា',
    viewAll: 'មើលទាំងអស់',
    stickerComment: 'មតិយោបល់ជា Sticker',
    noCommentsYet: 'មិនទាន់មានមតិយោបល់',
    shareThoughts: 'ចែករំលែកមតិ សួរសំណួរ ឬលើកទឹកចិត្តរឿងនេះ។',
  },
  zh: {
    justNow: '刚刚',
    minutesAgo: '{{count}} 分钟',
    hoursAgo: '{{count}} 小时',
    reader: '读者',
    comments: '评论',
    latestReaderComment: '最新读者评论',
    firstConversation: '成为第一个开始讨论的人',
    viewAll: '查看全部',
    stickerComment: '贴纸评论',
    noCommentsYet: '暂无评论',
    shareThoughts: '分享你的想法、提出问题，或为这个故事加油。',
  },
  ja: {
    justNow: 'たった今',
    minutesAgo: '{{count}}分',
    hoursAgo: '{{count}}時間',
    reader: '読者',
    comments: 'コメント',
    latestReaderComment: '最新の読者コメント',
    firstConversation: '最初に会話を始めましょう',
    viewAll: 'すべて見る',
    stickerComment: 'ステッカーコメント',
    noCommentsYet: 'コメントはまだありません',
    shareThoughts: '感想を共有したり、質問したり、このストーリーを応援しましょう。',
  },
  ko: {
    justNow: '방금',
    minutesAgo: '{{count}}분',
    hoursAgo: '{{count}}시간',
    reader: '독자',
    comments: '댓글',
    latestReaderComment: '최신 독자 댓글',
    firstConversation: '첫 대화를 시작해 보세요',
    viewAll: '전체 보기',
    stickerComment: '스티커 댓글',
    noCommentsYet: '아직 댓글이 없습니다',
    shareThoughts: '생각을 나누고, 질문하거나, 이 스토리를 응원해 보세요.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function formatTime(value, t, locale) {
  if (!value) return t('latestCommentSection.justNow')

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('latestCommentSection.justNow')

  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return t('latestCommentSection.justNow')
  if (diff < hour) {
    return t('latestCommentSection.minutesAgo', {
      count: Math.floor(diff / minute),
    })
  }
  if (diff < day) {
    return t('latestCommentSection.hoursAgo', {
      count: Math.floor(diff / hour),
    })
  }

  return new Intl.DateTimeFormat(locale || 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getCommentUser(comment, fallbackName) {
  return comment?.user || {
    name: comment?.name || fallbackName,
    avatar_url: comment?.avatar_url || '',
  }
}

function Avatar({ comment }) {
  const { t } = useDisplayTranslation()
  const readerLabel = t('latestCommentSection.reader')
  const user = getCommentUser(comment, readerLabel)
  const avatar = user?.avatar_url || ''
  const letter = (user?.name || readerLabel).slice(0, 1).toUpperCase()

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={user?.name || readerLabel}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[12px] font-black text-white dark:bg-white dark:text-[#111827]">
      {letter}
    </div>
  )
}

export default function LatestCommentSection({ story, refreshKey = 0, onOpenComments }) {
  const { t } = useDisplayTranslation()
  const displayLanguage = getDisplayLanguageId() || 'en'
  const [latestComment, setLatestComment] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadLatestComment() {
      if (!story?.id) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/story/${story.id}/latest`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) return

        if (!ignore) {
          setLatestComment(data.comment || null)
        }
      } catch {
        if (!ignore) setLatestComment(null)
      }
    }

    loadLatestComment()

    return () => {
      ignore = true
    }
  }, [story?.id, refreshKey])

  const hasComment = Boolean(latestComment)
  const readerLabel = t('latestCommentSection.reader')
  const user = getCommentUser(latestComment, readerLabel)

  return (
    <section className="mt-2 bg-[var(--shadow-bg-surface)] p-4 shadow-sm sm:mt-4 sm:rounded-[28px] sm:ring-1 sm:ring-[var(--shadow-border)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
            {t('latestCommentSection.comments')}
          </h2>
          <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
            {hasComment
              ? t('latestCommentSection.latestReaderComment')
              : t('latestCommentSection.firstConversation')}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenComments}
          className="self-start pt-[2px] text-[12px] font-semibold text-[var(--shadow-text-secondary)] active:scale-95"
        >
          {t('latestCommentSection.viewAll')}
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenComments}
        className="flex w-full gap-3 rounded-[13px] bg-[var(--shadow-bg-soft)] p-4 text-left active:scale-[0.995]"
      >
        <div className="min-w-0 flex-1">
          {hasComment ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar comment={latestComment} />

                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold text-[var(--shadow-text-primary)]">
                    {user.name || readerLabel}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                    {formatTime(latestComment.created_at, t, displayLanguage)}
                  </div>
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                {latestComment.text || t('latestCommentSection.stickerComment')}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-secondary)]">
                  <i className="fa-regular fa-comments text-[14px]" />
                </div>

                <div className="text-[13px] font-bold text-[var(--shadow-text-primary)]">
                  {t('latestCommentSection.noCommentsYet')}
                </div>
              </div>

              <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                {t('latestCommentSection.shareThoughts')}
              </p>
            </>
          )}
        </div>
      </button>
    </section>
  )
}
