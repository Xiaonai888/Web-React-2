import {
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearReaderPostDraft,
  readReaderPostDraft,
  writeReaderPostDraft,
} from '../../features/reader-posts/readerPostDraft'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

const AUDIENCES = [
  {
    value: 'public',
    label: 'Public',
    description:
      'Anyone on Shadow can see this post.',
    icon: 'fa-solid fa-earth-americas',
  },
  {
    value: 'friends',
    label: 'Friends',
    description:
      'Only readers who follow each other.',
    icon: 'fa-solid fa-user-group',
  },
  {
    value: 'followers',
    label: 'Followers',
    description:
      'Readers who follow your profile.',
    icon: 'fa-solid fa-users',
  },
  {
    value: 'friends_and_followers',
    label: 'Friends and followers',
    description:
      'People connected to your profile.',
    icon: 'fa-solid fa-people-group',
  },
  {
    value: 'only_me',
    label: 'Only me',
    description:
      'Only you can see this post.',
    icon: 'fa-solid fa-lock',
  },
]

const FUTURE_AUDIENCES = [
  'Close friends',
  'Specific people',
  'Friends except...',
]

const COMMENT_OPTIONS = [
  {
    value: 'everyone',
    label: 'Everyone',
  },
  {
    value: 'friends',
    label: 'Friends',
  },
  {
    value: 'followers',
    label: 'Followers',
  },
  {
    value: 'no_one',
    label: 'No one',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getAudienceLabel(value) {
  return (
    AUDIENCES.find(
      (item) => item.value === value
    )?.label || 'Public'
  )
}

function getCommentLabel(value) {
  return (
    COMMENT_OPTIONS.find(
      (item) => item.value === value
    )?.label || 'Everyone'
  )
}

function ReviewOption({
  icon,
  imageSrc,
  title,
  value,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt=""
            className="h-5 w-5 object-contain"
          />
        ) : (
          <i
            className={`${icon} text-[15px]`}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[#111827]">
          {title}
        </span>
        <span className="mt-0.5 block text-[12px] font-normal text-[#8b93a1]">
          {value}
        </span>
      </span>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#9ca3af]" />
    </button>
  )
}

function SelectionRow({
  icon,
  label,
  description,
  selected,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-[#f3f4f6] disabled:opacity-55"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]">
        <i
          className={`${icon || 'fa-regular fa-clock'} text-[16px]`}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[#111827]">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-[11px] font-normal leading-4 text-[#8b93a1]">
            {description}
          </span>
        ) : null}
      </span>

      {disabled ? (
        <span className="rounded-full bg-[#eef0f4] px-2 py-1 text-[10px] font-normal text-[#6b7280]">
          Coming soon
        </span>
      ) : selected ? (
        <i className="fa-solid fa-check text-[15px] text-[#2563eb]" />
      ) : null}
    </button>
  )
}

export default function ReaderPostReviewPage() {
  const navigate = useNavigate()
  const initialDraft = useMemo(
    () => readReaderPostDraft(),
    []
  )
  const [draft, setDraft] =
    useState(initialDraft)
  const [screen, setScreen] =
    useState('review')
  const [saving, setSaving] =
    useState(false)
  const [message, setMessage] =
    useState('')

  function updateDraft(patch) {
    const next = {
      ...draft,
      ...patch,
    }

    setDraft(next)
    writeReaderPostDraft(next)
  }

  async function publishPost() {
    if (!draft.content?.trim()) {
      navigate('/reader/post/create', {
        replace: true,
      })
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/me`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            content:
              draft.content.trim(),
            visibility:
              draft.visibility,
            comments_permission:
              draft.comments_permission,
            story_sharing: false,
            publish_at:
              new Date().toISOString(),
          }),
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to publish post'
        )
      }

      clearReaderPostDraft()
      navigate('/discover', {
        replace: true,
      })
    } catch (error) {
      setMessage(
        error.message ||
          'Failed to publish post'
      )
    } finally {
      setSaving(false)
    }
  }

  if (screen === 'audience') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-20 border-b border-[#eef0f4] bg-white">
          <div className="mx-auto flex h-14 max-w-[620px] items-center px-2">
            <button
              type="button"
              onClick={() =>
                setScreen('review')
              }
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            >
              <i className="fa-solid fa-chevron-left text-[18px]" />
            </button>

            <div className="ml-2 text-[16px] font-semibold text-[#111827]">
              Who can see this
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[620px] py-2">
          {AUDIENCES.map((item) => (
            <SelectionRow
              key={item.value}
              icon={item.icon}
              label={item.label}
              description={
                item.description
              }
              selected={
                draft.visibility ===
                item.value
              }
              onClick={() => {
                updateDraft({
                  visibility:
                    item.value,
                })
                setScreen('review')
              }}
            />
          ))}

          <div className="my-2 h-2 bg-[#f5f3fa]" />

          {FUTURE_AUDIENCES.map(
            (label) => (
              <SelectionRow
                key={label}
                icon="fa-regular fa-clock"
                label={label}
                description="This audience option will be available in a future update."
                disabled
              />
            )
          )}
        </main>
      </div>
    )
  }

  if (screen === 'comments') {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-20 border-b border-[#eef0f4] bg-white">
          <div className="mx-auto flex h-14 max-w-[620px] items-center px-2">
            <button
              type="button"
              onClick={() =>
                setScreen('review')
              }
              className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            >
              <i className="fa-solid fa-chevron-left text-[18px]" />
            </button>

            <div className="ml-2 text-[16px] font-semibold text-[#111827]">
              Reader comments
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[620px] py-2">
          {COMMENT_OPTIONS.map(
            (item) => (
              <SelectionRow
                key={item.value}
                icon="fa-regular fa-comment"
                label={item.label}
                selected={
                  draft.comments_permission ===
                  item.value
                }
                onClick={() => {
                  updateDraft({
                    comments_permission:
                      item.value,
                  })
                  setScreen('review')
                }}
              />
            )
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-[#eef0f4] bg-white">
        <div className="mx-auto flex h-14 max-w-[620px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/reader/post/create'
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div className="text-[16px] font-semibold text-[#111827]">
            Review Post
          </div>

          <button
            type="button"
            onClick={publishPost}
            disabled={
              saving ||
              !draft.content?.trim()
            }
            className="h-9 rounded-full bg-[#111827] px-4 text-[13px] font-semibold text-white disabled:bg-[#e5e7eb] disabled:text-[#9ca3af]"
          >
            {saving
              ? 'Publishing'
              : 'Publish'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[620px] px-4 py-4">
        {message ? (
          <div className="mb-4 rounded-[14px] bg-red-50 px-3 py-2 text-[12px] font-normal leading-5 text-red-600">
            {message}
          </div>
        ) : null}

        <div className="space-y-1">
          <ReviewOption
            icon="fa-solid fa-earth-americas"
            title="Who can see this"
            value={getAudienceLabel(
              draft.visibility
            )}
            onClick={() =>
              setScreen('audience')
            }
          />

          <ReviewOption
            icon="fa-regular fa-comment"
            title="Reader comments"
            value={getCommentLabel(
              draft.comments_permission
            )}
            onClick={() =>
              setScreen('comments')
            }
          />

          <ReviewOption
            icon="fa-regular fa-clock"
            title="Publish time"
            value="Now"
            onClick={() =>
              setMessage(
                'Scheduled publishing is coming soon.'
              )
            }
          />

          <ReviewOption
            imageSrc="/assets/Icons/Add Story.svg"
            title="Story sharing"
            value="Off"
            onClick={() =>
              setMessage(
                'Story sharing is coming soon.'
              )
            }
          />
        </div>
      </main>
    </div>
  )
}
