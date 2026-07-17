import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearReaderPostDraft,
  readReaderPostDraft,
  writeReaderPostDraft,
} from '../../features/reader-posts/readerPostDraft'

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function Avatar({ user }) {
  const name = user?.name || 'Reader'

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eef0f4] ring-1 ring-black/5">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-[16px] font-semibold text-[#111827]">
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
    </span>
  )
}

function LeavePostSheet({
  open,
  onSave,
  onDiscard,
  onContinue,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[280]">
      <button
        type="button"
        aria-label="Close leave options"
        onClick={onContinue}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[26px] bg-white px-4 pb-7 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#d1d5db]" />

        <h3 className="mb-3 text-[15px] font-semibold text-[#111827]">
          Leave this post?
        </h3>

        <div className="space-y-1">
          <button
            type="button"
            onClick={onSave}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]">
              <i className="fa-regular fa-bookmark text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[#111827]">
              Save for later
            </span>
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]">
              <i className="fa-regular fa-trash-can text-[15px]" />
            </span>
            <span className="text-[15px] font-normal text-[#111827]">
              Discard
            </span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6]">
              <i className="fa-solid fa-pen text-[14px]" />
            </span>
            <span className="text-[15px] font-normal text-[#111827]">
              Continue writing
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ReaderPostCreatePage() {
  const navigate = useNavigate()
  const user = useMemo(
    () => getStoredUser(),
    []
  )
  const initialDraft = useMemo(
    () => readReaderPostDraft(),
    []
  )

  const [content, setContent] =
    useState(initialDraft.content || '')
  const [
    leaveSheetOpen,
    setLeaveSheetOpen,
  ] = useState(false)
  const [
    comingSoonVisible,
    setComingSoonVisible,
  ] = useState(false)

  useEffect(() => {
    writeReaderPostDraft({
      ...readReaderPostDraft(),
      content,
    })
  }, [content])

  useEffect(() => {
    if (!comingSoonVisible) {
      return undefined
    }

    const timer = window.setTimeout(
      () => {
        setComingSoonVisible(false)
      },
      2200
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [comingSoonVisible])

  function requestClose() {
    if (content.trim()) {
      setLeaveSheetOpen(true)
      return
    }

    navigate(-1)
  }

  function discardPost() {
    clearReaderPostDraft()
    setLeaveSheetOpen(false)
    navigate('/discover', {
      replace: true,
    })
  }

  function continueToReview() {
    if (!content.trim()) return

    writeReaderPostDraft({
      ...readReaderPostDraft(),
      content: content.trim(),
    })

    navigate('/reader/post/review')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-[#eef0f4] bg-white">
        <div className="mx-auto flex h-14 max-w-[620px] items-center justify-between px-4">
          <button
            type="button"
            onClick={requestClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Close composer"
          >
            <i className="fa-solid fa-xmark text-[22px]" />
          </button>

          <div className="line-clamp-1 px-2 text-center text-[16px] font-semibold text-[#111827]">
            New Reader Post
          </div>

          <button
            type="button"
            disabled={!content.trim()}
            onClick={continueToReview}
            className="h-9 rounded-full bg-[#111827] px-4 text-[13px] font-semibold text-white disabled:bg-[#e5e7eb] disabled:text-[#9ca3af]"
          >
            Next
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[620px] flex-col bg-white">
        <div className="flex-1 px-4 pt-5">
          <div className="mb-5 flex items-center gap-3">
            <Avatar user={user} />

            <div className="min-w-0">
              <div className="line-clamp-1 text-[15px] font-semibold text-[#111827]">
                {user?.name || 'Reader'}
              </div>

              <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#eef0f4] px-2.5 py-1 text-[11px] font-normal text-[#374151]">
                <i className="fa-solid fa-earth-americas text-[10px]" />
                Public
              </div>
            </div>
          </div>

          <textarea
            autoFocus
            value={content}
            onChange={(event) =>
              setContent(
                event.target.value.slice(
                  0,
                  1000
                )
              )
            }
            placeholder="Share your thoughts..."
            maxLength={1000}
            className="min-h-[260px] w-full resize-none border-0 bg-white p-0 text-[16px] font-normal leading-6 text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />

          <div className="mt-2 text-right text-[11px] font-normal text-[#9ca3af]">
            {content.length}/1000
          </div>
        </div>

        <div className="relative border-t border-[#eef0f4] bg-white px-4 py-4">
          <button
            type="button"
            onClick={() =>
              setComingSoonVisible(true)
            }
            className="flex h-[82px] w-[112px] flex-col items-center justify-center gap-2 rounded-[18px] border border-[#e5e7eb] bg-white text-[#111827] shadow-[0_4px_14px_rgba(17,24,39,0.14)] active:scale-[0.98]"
          >
            <svg
              className="h-[27px] w-[27px]"
              viewBox="0 0 22 26"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="16"
                height="20"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="7.5"
                cy="8.8"
                r="1.45"
                fill="currentColor"
              />
              <path
                d="M5 18.8l4-4.3 3 3.2 2.2-2.4 3 3.5H5z"
                fill="currentColor"
              />
            </svg>
            <span className="text-[14px] font-normal">
              Gallery
            </span>
          </button>

          {comingSoonVisible ? (
            <div
              role="status"
              className="absolute bottom-[106px] left-4 rounded-[12px] bg-[#111827] px-3 py-2 text-[11px] font-normal text-white shadow-lg"
            >
              Image posting is coming soon.
            </div>
          ) : null}
        </div>
      </main>

      <LeavePostSheet
        open={leaveSheetOpen}
        onSave={() => {
          setLeaveSheetOpen(false)
          navigate('/discover', {
            replace: true,
          })
        }}
        onDiscard={discardPost}
        onContinue={() =>
          setLeaveSheetOpen(false)
        }
      />
    </div>
  )
}
