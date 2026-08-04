import { useEffect, useRef } from 'react'

function EditPostIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 6.5 17.5 10.5" />
      <path d="M5 19h4l9.5-9.5a1.4 1.4 0 0 0 0-2l-2-2a1.4 1.4 0 0 0-2 0L5 15v4Z" />
      <path d="M12.5 7.5 16.5 11.5" />
    </svg>
  )
}

function DeletePostIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M9 4h6" />
      <path d="M6.5 7 7.2 20h9.6l.7-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

function SheetItem({
  icon,
  iconNode,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left active:bg-black/[0.04]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
        {iconNode || (
          <i className={`${icon} text-[17px] font-normal`} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[#111827]">
          {title}
        </span>

        {description ? (
          <span className="mt-0.5 block text-[10px] font-normal leading-4 text-[#98a2b3]">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function ReaderPostOptionsSheet({
  open,
  post,
  isOwner,
  onClose,
  onEdit,
  onDelete,
  onHide,
  onViewProfile,
  onMessage,
  isSaved,
  onSave,
}) {
  const startYRef = useRef(0)
  const currentYRef = useRef(0)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])

  if (!open || !post) return null

  function handleTouchStart(event) {
    const point = event.touches?.[0]
    startYRef.current = point?.clientY || 0
    currentYRef.current = startYRef.current
  }

  function handleTouchMove(event) {
    const point = event.touches?.[0]
    currentYRef.current =
      point?.clientY || startYRef.current
  }

  function handleTouchEnd() {
    if (
      currentYRef.current -
        startYRef.current >
      70
    ) {
      onClose?.()
    }
  }

  function reportPost() {
    onMessage?.(
      'Reader Post reporting is coming soon.'
    )
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-[210000]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
        aria-label="Close post options"
      />

      <section
        className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[560px] rounded-t-[24px] bg-white px-2 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#9ca3af]" />

        <div className="rounded-[16px] bg-[#f5f6f8] px-1 py-1">
          {isOwner ? (
            <>
              <SheetItem
                iconNode={<EditPostIcon />}
                title="Edit post"
                description="Update the text in this post."
                onClick={onEdit}
              />

              <SheetItem
                iconNode={<DeletePostIcon />}
                title="Delete post"
                description="Remove this post from Discover and your profile."
                onClick={onDelete}
              />
            </>
          ) : (
            <>
              <SheetItem
                icon={
                  isSaved
                    ? 'fa-solid fa-bookmark'
                    : 'fa-regular fa-bookmark'
                }
                title={
                  isSaved
                    ? 'Remove from saved'
                    : 'Save post'
                }
                description={
                  isSaved
                    ? 'Remove this post from your saved items.'
                    : 'Add this post to your saved items.'
                }
                onClick={onSave}
              />

              <SheetItem
                icon="fa-regular fa-eye-slash"
                title="Hide post"
                description="Do not show this post again on this device."
                onClick={onHide}
              />

              <SheetItem
                icon="fa-regular fa-user"
                title="View reader profile"
                description="Open this reader's profile."
                onClick={onViewProfile}
              />

              <SheetItem
                icon="fa-regular fa-flag"
                title="Report post"
                description="Tell Shadow about a problem with this post."
                onClick={reportPost}
              />
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export function ReaderPostDeleteConfirmSheet({
  open,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[210010]">
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0 bg-black/45"
        aria-label="Cancel delete"
      />

      <section className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[560px] rounded-t-[24px] bg-white px-4 pb-[max(22px,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#9ca3af]" />

        <h2 className="text-[16px] font-semibold text-[#111827]">
          Delete this post?
        </h2>

        <p className="mt-2 text-[12px] font-normal leading-5 text-[#667085]">
          This post will be removed from Discover and your profile.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="h-11 rounded-full border border-[#d0d5dd] bg-white text-[13px] font-normal text-[#111827] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="h-11 rounded-full bg-[#e5484d] text-[13px] font-normal text-white disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}
