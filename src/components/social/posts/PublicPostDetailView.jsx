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

const REACTION_ICON_BY_TYPE = {
  love: '/assets/React/Love.svg',
  haha: '/assets/React/Haha.svg',
  wow: '/assets/React/Wow.svg',
  sad: '/assets/React/Sad.svg',
  angry: '/assets/React/Angry.svg',
  support: '/assets/React/Support.svg',
  touched: '/assets/React/Touched.svg',
}

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
    undefined,
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
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eceef1] ${textSize} font-bold text-[#111827] ring-1 ring-black/5`}
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

function ReactionSummary({
  reactions,
  count,
}) {
  const safeCount = Math.max(
    0,
    Number(count || 0)
  )
  const summary = Array.isArray(
    reactions
  )
    ? reactions.slice(0, 3)
    : []

  if (!safeCount) {
    return <span>0</span>
  }

  const visibleSummary =
    summary.length
      ? summary
      : [{ type: 'love' }]

  return (
    <span className="flex min-w-0 items-center">
      <span className="flex items-center -space-x-1">
        {visibleSummary.map(
          (reaction, index) => {
            const type =
              typeof reaction ===
              'string'
                ? reaction
                : reaction?.type ||
                  'love'
            const src =
              REACTION_ICON_BY_TYPE[
                type
              ] ||
              REACTION_ICON_BY_TYPE
                .love

            return (
              <img
                key={`${type}-${index}`}
                src={src}
                alt=""
                aria-hidden="true"
                className="h-[17px] w-[17px] rounded-full bg-white ring-1 ring-white"
              />
            )
          }
        )}
      </span>

      <span className="ml-1.5">
        {formatCompactNumber(
          safeCount
        )}
      </span>
    </span>
  )
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
  pageName = 'Post',
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
  const displayAuthorName =
    authorName ||
    pageName ||
    'Post'
  const displayAuthorAvatar =
    authorAvatarUrl ||
    pageAvatarUrl ||
    ''

  return (
    <div className="min-h-[100dvh] bg-[#f0f2f5] text-[#111827]">
      <header className="sticky top-0 z-50 bg-white">
        <div className="mx-auto flex h-[56px] max-w-[680px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={onClose}
            disabled={!onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f2f2f3] disabled:pointer-events-none disabled:opacity-0"
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
            {pageName}
          </button>

          <button
            type="button"
            onClick={onSearch}
            disabled={!onSearch}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f2f2f3] disabled:pointer-events-none disabled:opacity-0"
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
              name={pageName}
              size="h-8 w-8"
              textSize="text-[12px]"
            />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[680px]">
        {loading ? (
          <div className="flex min-h-[60dvh] items-center justify-center bg-white text-[#7c3aed]">
            <LoaderCircle
              size={30}
              className="animate-spin"
            />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="bg-white px-5 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e8ff] text-[#7c3aed]">
              <MessageCircle
                size={26}
              />
            </div>

            <h1 className="mt-4 text-[16px] font-bold">
              Post unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-5 text-[#73767c]">
              {error}
            </p>

            {onErrorBack ? (
              <button
                type="button"
                onClick={onErrorBack}
                className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-semibold text-white active:scale-95"
              >
                Go back
              </button>
            ) : null}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <article className="bg-white pt-4">
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

                      <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[12px] text-[#65676b]">
                        {isPinned ? (
                          <>
                            <i className="fa-solid fa-thumbtack text-[10px]" />
                            <span>
                              Pinned
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
                              Edited
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
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#65676b] active:bg-[#f2f2f2] disabled:pointer-events-none disabled:opacity-0"
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
                <div className="grid grid-cols-3 items-center border-t border-[#eef0f4] py-1.5 text-[14px] font-normal text-[#65676b]">
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
                        Like
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onComment}
                    disabled={!onComment}
                    className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2] disabled:pointer-events-none"
                  >
                    <i className="fa-regular fa-comment text-[18px]" />
                    <span>
                      Comment
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
                        Echo
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pb-2 text-[12px] text-[#65676b]">
                  <StatControl
                    onClick={
                      onOpenReactions
                    }
                    ariaLabel="View reactions"
                  >
                    <ReactionSummary
                      reactions={
                        reactionSummary
                      }
                      count={
                        likeCount
                      }
                    />
                  </StatControl>

                  <div className="flex items-center gap-4">
                    <StatControl
                      onClick={
                        onOpenComments
                      }
                      ariaLabel="View comments"
                    >
                      {formatCompactNumber(
                        commentCount
                      )}{' '}
                      comments
                    </StatControl>

                    <StatControl
                      onClick={
                        onOpenEchoes
                      }
                      ariaLabel="View echoes"
                    >
                      {formatCompactNumber(
                        echoCount
                      )}{' '}
                      echoes
                    </StatControl>
                  </div>
                </div>
              </div>
            </article>

            {comments ? (
  <section className="bg-white">
    {comments}
  </section>
) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
