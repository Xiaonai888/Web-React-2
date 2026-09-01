import SharedReactionSummary from '../reactions/ReactionSummary'
import {
  Globe2,
  LoaderCircle,
  MessageCircle,
  Search,
  X,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'

import { getDisplayLanguageId, useDisplayTranslation } from '../../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../../i18n/registerTranslations'

registerTranslationNamespace('publicPostDetailView', {
  "en": {
    "post": "Post",
    "postUnavailable": "Post unavailable",
    "goBack": "Go back",
    "pinned": "Pinned",
    "edited": "Edited",
    "like": "Like",
    "comment": "Comment",
    "echo": "Echo",
    "commentsCount": "{{count}} comments",
    "echoesCount": "{{count}} echoes"
  },
  "km": {
    "post": "ប្រកាស",
    "postUnavailable": "មិនអាចមើលប្រកាសបាន",
    "goBack": "ត្រឡប់ក្រោយ",
    "pinned": "បានខ្ទាស់",
    "edited": "បានកែសម្រួល",
    "like": "ចូលចិត្ត",
    "comment": "មតិយោបល់",
    "echo": "Echo",
    "commentsCount": "{{count}} មតិយោបល់",
    "echoesCount": "{{count}} Echo"
  },
  "zh": {
    "post": "帖子",
    "postUnavailable": "帖子不可用",
    "goBack": "返回",
    "pinned": "已置顶",
    "edited": "已编辑",
    "like": "赞",
    "comment": "评论",
    "echo": "Echo",
    "commentsCount": "{{count}} 条评论",
    "echoesCount": "{{count}} 次 Echo"
  },
  "ja": {
    "post": "投稿",
    "postUnavailable": "投稿を利用できません",
    "goBack": "戻る",
    "pinned": "固定済み",
    "edited": "編集済み",
    "like": "いいね",
    "comment": "コメント",
    "echo": "Echo",
    "commentsCount": "コメント {{count}}件",
    "echoesCount": "Echo {{count}}件"
  },
  "ko": {
    "post": "게시물",
    "postUnavailable": "게시물을 사용할 수 없습니다",
    "goBack": "돌아가기",
    "pinned": "고정됨",
    "edited": "수정됨",
    "like": "좋아요",
    "comment": "댓글",
    "echo": "Echo",
    "commentsCount": "댓글 {{count}}개",
    "echoesCount": "Echo {{count}}개"
  }
})


function formatCompactNumber(value) {
  const number = Math.max(
    0,
    Number(value || 0)
  )

  if (!Number.isFinite(number)) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(
    getDisplayLanguageId() || 'en',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  ).format(date)
}

function Avatar({
  src,
  name,
  size = 'h-10 w-10',
  textSize = 'text-[14px]',
}) {
  const [failed, setFailed] =
    useState(false)
  const letter =
    String(name || 'S')
      .trim()
      .charAt(0)
      .toUpperCase() || 'S'

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ${textSize} font-bold text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() =>
            setFailed(true)
          }
        />
      ) : (
        letter
      )}
    </span>
  )
}

function VisibilityIcon({
  visibility,
}) {
  const value = String(
    visibility || 'public'
  )
    .trim()
    .toLowerCase()

  if (
    value === 'only_me' ||
    value === 'private'
  ) {
    return (
      <i className="fa-solid fa-lock text-[10px]" />
    )
  }

  if (value === 'friends') {
    return (
      <i className="fa-solid fa-user-group text-[10px]" />
    )
  }

  if (value === 'followers') {
    return (
      <i className="fa-solid fa-users text-[10px]" />
    )
  }

  return <Globe2 size={13} />
}

function StatControl({
  onClick,
  children,
  ariaLabel,
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="active:opacity-60"
        aria-label={ariaLabel}
      >
        {children}
      </button>
    )
  }

  return <span>{children}</span>
}

export default function PublicPostDetailView({
  pageName = '',
  pageAvatarUrl = '',
  authorName = '',
  authorAvatarUrl = '',
  createdAt = '',
  visibility = 'public',
  isPinned = false,
  isEdited = false,
  content = null,
  media = null,
  sourcePreview = null,
  reactionControl = null,
  echoControl = null,
  reactionSummary = [],
  myReaction = null,
  likeCount = 0,
  commentCount = 0,
  echoCount = 0,
  comments = null,
  loading = false,
  error = '',
  onClose,
  onSearch,
  onOpenProfile,
  onOptions,
  onComment,
  onOpenReactions,
  onOpenComments,
  onOpenEchoes,
  onErrorBack,
}) {
  const { t } = useDisplayTranslation()
  const displayPageName = pageName || t('publicPostDetailView.post')
  const displayAuthorName =
    authorName ||
    displayPageName
  const displayAuthorAvatar =
    authorAvatarUrl ||
    pageAvatarUrl ||
    ''

  return (
    <div className="min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[56px] max-w-[680px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={onClose}
            disabled={!onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)] disabled:pointer-events-none disabled:opacity-0"
            aria-label="Close"
          >
            <X
              size={27}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            disabled={
              !onOpenProfile
            }
            className="min-w-0 flex-1 truncate text-center text-[17px] font-bold disabled:pointer-events-none"
          >
            {displayPageName}
          </button>

          <button
            type="button"
            onClick={onSearch}
            disabled={!onSearch}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)] disabled:pointer-events-none disabled:opacity-0"
            aria-label="Search"
          >
            <Search
              size={25}
              strokeWidth={2.1}
            />
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            disabled={
              !onOpenProfile
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:pointer-events-none"
            aria-label="Open profile"
          >
            <Avatar
              src={pageAvatarUrl}
              name={displayPageName}
              size="h-8 w-8"
              textSize="text-[12px]"
            />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[680px]">
        {loading ? (
          <div className="flex min-h-[60dvh] items-center justify-center bg-[var(--shadow-bg-surface)] text-[#7c3aed]">
            <LoaderCircle
              size={30}
              className="animate-spin"
            />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="bg-[var(--shadow-bg-surface)] px-5 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e8ff] text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
              <MessageCircle
                size={26}
              />
            </div>

            <h1 className="mt-4 text-[16px] font-bold">
              {t('publicPostDetailView.postUnavailable')}
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
              {error}
            </p>

            {onErrorBack ? (
              <button
                type="button"
                onClick={onErrorBack}
                className="mt-5 rounded-full bg-[var(--shadow-text-primary)] px-5 py-2.5 text-[13px] font-semibold text-[var(--shadow-bg-surface)] active:scale-95"
              >
                {t('publicPostDetailView.goBack')}
              </button>
            ) : null}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <article className="bg-[var(--shadow-bg-surface)] pt-4">
              <div className="flex items-start gap-3 px-4">
                <button
                  type="button"
                  onClick={
                    onOpenProfile
                  }
                  disabled={
                    !onOpenProfile
                  }
                  className="shrink-0 rounded-full disabled:pointer-events-none"
                  aria-label="Open profile"
                >
                  <Avatar
                    src={
                      displayAuthorAvatar
                    }
                    name={
                      displayAuthorName
                    }
                    size="h-11 w-11"
                    textSize="text-[14px]"
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={
                          onOpenProfile
                        }
                        disabled={
                          !onOpenProfile
                        }
                        className="block max-w-full truncate text-left text-[15px] font-bold disabled:pointer-events-none"
                      >
                        {
                          displayAuthorName
                        }
                      </button>

                      <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[12px] text-[var(--shadow-text-secondary)]">
                        {isPinned ? (
                          <>
                            <i className="fa-solid fa-thumbtack text-[10px]" />
                            <span>
                              {t('publicPostDetailView.pinned')}
                            </span>
                            <span>·</span>
                          </>
                        ) : null}

                        <span>
                          {formatDate(
                            createdAt
                          )}
                        </span>

                        {isEdited ? (
                          <>
                            <span>·</span>
                            <span>
                              {t('publicPostDetailView.edited')}
                            </span>
                          </>
                        ) : null}

                        <span>·</span>

                        <VisibilityIcon
                          visibility={
                            visibility
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onOptions}
                      disabled={
                        !onOptions
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-hover)] disabled:pointer-events-none disabled:opacity-0"
                      aria-label="Post options"
                    >
                      <i className="fa-solid fa-ellipsis text-[15px]" />
                    </button>
                  </div>
                </div>
              </div>

              {content ? (
                <div className="whitespace-pre-wrap break-words px-4 pt-3 text-[16px] leading-7">
                  {content}
                </div>
              ) : null}

              {sourcePreview}

              {media}

              <div className="mt-3 px-4 pb-1">
                <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[var(--shadow-text-secondary)]">
                  {reactionControl ? (
                    <div className="flex items-center justify-center py-2">
                      {
                        reactionControl
                      }
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 py-2"
                    >
                      <i className="fa-regular fa-heart text-[18px]" />
                      <span>
                        {t('publicPostDetailView.like')}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onComment}
                    disabled={!onComment}
                    className="flex items-center justify-center gap-2 py-2 active:bg-[var(--shadow-bg-hover)] disabled:pointer-events-none"
                  >
                    <i className="fa-regular fa-comment text-[18px]" />
                    <span>
                      {t('publicPostDetailView.comment')}
                    </span>
                  </button>

                  {echoControl ? (
                    <div className="flex items-center justify-center py-2">
                      {echoControl}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center gap-2 py-2"
                    >
                      <img
                        src="/assets/Icons/echo.svg"
                        alt=""
                        aria-hidden="true"
                        className="h-[18px] w-[18px] object-contain opacity-70"
                      />
                      <span>
                        {t('publicPostDetailView.echo')}
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pb-2 text-[12px] text-[var(--shadow-text-secondary)]">
                  <StatControl
                    onClick={
                      onOpenReactions
                    }
                    ariaLabel="View reactions"
                  >
                    <SharedReactionSummary
  summary={reactionSummary}
  likeCount={likeCount}
  myReaction={myReaction}
/>
                  </StatControl>

                  <div className="flex items-center gap-4">
                    <StatControl
                      onClick={
                        onOpenComments
                      }
                      ariaLabel="View comments"
                    >
                      {t('publicPostDetailView.commentsCount', {
                        count: formatCompactNumber(commentCount),
                      })}
                    </StatControl>

                    <StatControl
                      onClick={
                        onOpenEchoes
                      }
                      ariaLabel="View echoes"
                    >
                      {t('publicPostDetailView.echoesCount', {
                        count: formatCompactNumber(echoCount),
                      })}
                    </StatControl>
                  </div>
                </div>
              </div>
            </article>

            {comments ? (
  <section className="bg-[var(--shadow-bg-surface)]">
    {comments}
  </section>
) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
