import { Globe2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const REACTION_ICON_BY_TYPE = {
  love: '/assets/React/Love.svg',
  haha: '/assets/React/Haha.svg',
  wow: '/assets/React/Wow.svg',
  sad: '/assets/React/Sad.svg',
  angry: '/assets/React/Angry.svg',
  support: '/assets/React/Support.svg',
  touched: '/assets/React/Touched.svg',
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function Avatar({ src, name, size = 'h-10 w-10' }) {
  const [failed, setFailed] = useState(false)
  const letter =
    String(name || 'S').trim().charAt(0).toUpperCase() || 'S'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eceef1] font-bold text-[#111827] ring-1 ring-black/5`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

function PostImages({ images }) {
  const safeImages = Array.isArray(images)
    ? images.filter(Boolean).slice(0, 5)
    : []

  if (!safeImages.length) return null

  if (safeImages.length === 1) {
    return (
      <img
        src={safeImages[0]}
        alt=""
        className="mt-3 max-h-[560px] w-full bg-[#f3f4f6] object-contain"
      />
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-1">
      {safeImages.slice(0, 4).map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          className="relative aspect-square overflow-hidden bg-[#f3f4f6]"
        >
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          {index === 3 && safeImages.length > 4 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[22px] font-bold text-white">
              +{safeImages.length - 4}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default function AuthorPostDetail({
  post,
  commentId,
}) {
  const navigate = useNavigate()
  const page = post?.author_page || {}
  const pageName =
    page.page_name ||
    page.page_username ||
    'Author Page'
  const pageUsername = page.page_username || ''

  const profilePath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(pageUsername)}`
        : '/author/page',
    [pageUsername]
  )

  const reactionSummary = Array.isArray(post?.reaction_summary)
    ? post.reaction_summary.slice(0, 3)
    : []

  if (!post) return null

  return (
    <article className="bg-white pt-4">
      <div className="flex items-start gap-3 px-4">
        <button
          type="button"
          onClick={() => navigate(profilePath)}
        >
          <Avatar
            src={page.avatar_url}
            name={pageName}
            size="h-11 w-11"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => navigate(profilePath)}
                className="block max-w-full truncate text-left text-[15px] font-bold"
              >
                {pageName}
              </button>

              <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#65676b]">
                {post.is_pinned ? (
                  <>
                    <i className="fa-solid fa-thumbtack text-[10px]" />
                    <span>Pinned</span>
                    <span>·</span>
                  </>
                ) : null}
                <span>{formatDate(post.created_at)}</span>
                <span>·</span>
                <Globe2 size={13} />
              </div>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[#65676b] active:bg-[#f2f2f2]"
              aria-label="Post options"
            >
              <i className="fa-solid fa-ellipsis text-[15px]" />
            </button>
          </div>
        </div>
      </div>

      {post.content ? (
        <div className="whitespace-pre-wrap break-words px-4 pt-3 text-[16px] leading-7">
          {post.content}
        </div>
      ) : null}

      <PostImages images={post.image_urls} />

      <div className="mt-3 flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => window.alert('Insights and Ads coming soon.')}
          className="text-left text-[14px] font-medium text-[#1877f2] active:opacity-70"
        >
          See insights and ads
        </button>

        <button
          type="button"
          onClick={() => window.alert('Boost Post coming soon.')}
          className="h-10 rounded-[8px] bg-[#111827] px-4 text-[14px] font-semibold text-white active:opacity-90"
        >
          Boost post
        </button>
      </div>

      <div className="px-4 pb-1">
        <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[#65676b]">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2]"
          >
            <i className="fa-regular fa-heart text-[18px]" />
            <span>Like</span>
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById(`comment-${commentId}`)
                ?.scrollIntoView({
                  block: 'center',
                  behavior: 'smooth',
                })
            }
            className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2]"
          >
            <i className="fa-regular fa-comment text-[18px]" />
            <span>Comment</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2]"
          >
            <img
              src="/assets/Icons/echo.svg"
              alt=""
              aria-hidden="true"
              className="h-[18px] w-[18px] object-contain opacity-70"
            />
            <span>Echo</span>
          </button>
        </div>

        <div className="flex items-center justify-between pb-1 text-[12px] text-[#65676b]">
          <div className="flex min-w-0 items-center">
            {Number(post.like_count || 0) > 0 ? (
              <>
                <span className="flex items-center -space-x-1">
                  {(reactionSummary.length
                    ? reactionSummary
                    : [{ type: 'love' }]
                  ).map((reaction, index) => (
                    <img
                      key={`${reaction.type || 'love'}-${index}`}
                      src={
                        REACTION_ICON_BY_TYPE[reaction.type] ||
                        REACTION_ICON_BY_TYPE.love
                      }
                      alt=""
                      className="h-[17px] w-[17px] rounded-full bg-white ring-1 ring-white"
                    />
                  ))}
                </span>
                <span className="ml-1.5">
                  {Number(post.like_count || 0)}
                </span>
              </>
            ) : (
              <span>0</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span>{Number(post.comment_count || 0)} comments</span>
            <span>{Number(post.echo_count || 0)} echoes</span>
          </div>
        </div>
      </div>
    </article>
  )
}
