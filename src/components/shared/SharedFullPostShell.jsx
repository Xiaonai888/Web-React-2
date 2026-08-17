import { useState } from 'react'

function SharedAvatar({ src, name }) {
  const [failed, setFailed] = useState(false)
  const letter = String(name || 'S').trim().charAt(0).toUpperCase() || 'S'

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eceef1] font-bold text-[#111827] ring-1 ring-black/5">
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

export default function SharedFullPostShell({
  avatarUrl,
  displayName,
  meta,
  onProfileClick,
  onOptions,
  content,
  media,
  reactionAction,
  onComment,
  onEcho,
  reactionSummary,
  reactionCount = 0,
  commentCount = 0,
  echoCount = 0,
  comments,
}) {
  const summary = Array.isArray(reactionSummary)
    ? reactionSummary.filter(Boolean).slice(0, 3)
    : []

  return (
    <article className="bg-white pt-4">
      <div className="flex items-start gap-3 px-4">
        <button type="button" onClick={onProfileClick}>
          <SharedAvatar src={avatarUrl} name={displayName} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button
                type="button"
                onClick={onProfileClick}
                className="block max-w-full truncate text-left text-[15px] font-bold"
              >
                {displayName}
              </button>

              <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#65676b]">
                {meta}
              </div>
            </div>

            <button
              type="button"
              onClick={onOptions}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[#65676b] active:bg-[#f2f2f2]"
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

      {media ? <div className="mt-3">{media}</div> : null}

      <div className="px-4 pb-1 pt-3">
        <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[#65676b]">
          <div className="flex items-center justify-center py-2">
            {reactionAction}
          </div>

          <button
            type="button"
            onClick={onComment}
            className="flex items-center justify-center gap-2 py-2 active:bg-[#f2f2f2]"
          >
            <i className="fa-regular fa-comment text-[18px]" />
            <span>Comment</span>
          </button>

          <button
            type="button"
            onClick={onEcho}
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
            {Number(reactionCount || 0) > 0 ? (
              <>
                {summary.length ? (
                  <span className="flex items-center -space-x-1">
                    {summary.map((reaction, index) => (
                      <img
                        key={`${reaction.type || 'reaction'}-${index}`}
                        src={reaction.iconUrl}
                        alt=""
                        className="h-[17px] w-[17px] rounded-full bg-white ring-1 ring-white"
                      />
                    ))}
                  </span>
                ) : null}
                <span className={summary.length ? 'ml-1.5' : ''}>
                  {Number(reactionCount || 0)}
                </span>
              </>
            ) : (
              <span>0</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span>{Number(commentCount || 0)} comments</span>
            <span>{Number(echoCount || 0)} echoes</span>
          </div>
        </div>
      </div>

      {comments}
    </article>
  )
}
