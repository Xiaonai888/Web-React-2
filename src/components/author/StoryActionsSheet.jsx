import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export default function StoryActionsSheet({ story, onClose, onDeleted }) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!story) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const oldBodyOverflow = body.style.overflow
    const oldBodyPosition = body.style.position
    const oldBodyTop = body.style.top
    const oldBodyWidth = body.style.width
    const oldHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = oldBodyOverflow
      body.style.position = oldBodyPosition
      body.style.top = oldBodyTop
      body.style.width = oldBodyWidth
      html.style.overflow = oldHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [story])

  if (!story) return null

  const openPage = (path) => {
    onClose()
    navigate(path)
  }

  const deleteStory = async () => {
    if (deleting || !window.confirm('Move this story to Trash?')) return

    const token = getAuthToken()

    if (!token) {
      onClose()
      navigate('/login')
      return
    }

    try {
      setDeleting(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/api/stories/${story.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to delete story')
      }

      onDeleted(story.id)
      onClose()
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete story')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/35 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Story actions"
    >
      <div
        className="w-full max-w-md rounded-[18px] bg-white p-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#eeeaf3] px-1 pb-3">
          <div className="flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f1edff] text-[#744af2]">
            {story.cover ? (
              <img src={story.cover} alt={story.title} className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-book-open text-[16px]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 text-[14px] font-black text-[#1a1620]">{story.title}</div>
            <div className="mt-1 text-[11px] font-semibold capitalize text-[#81798f]">{story.status}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[#39323f] active:opacity-60"
            aria-label="Close story actions"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {error ? (
          <div className="mt-3 rounded-[10px] bg-[#fff1f2] px-3 py-2 text-[11px] text-[#e5484d]">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 pt-3">
          <button
            type="button"
            onClick={() => openPage(`/author/story/${story.id}/manage`)}
            className="flex items-center gap-3 rounded-[12px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
          >
            <i className="fa-solid fa-sliders text-[#744af2]" />
            Manage Story
          </button>

          <button
            type="button"
            onClick={() =>
  openPage(
    story.type === 'chat_story'
      ? `/author/story/${story.id}/chat/characters?new=1&returnTo=${encodeURIComponent('/author/stories')}`
      : `/author/story/${story.id}/episode/create?first=0`
  )
}
            className="flex items-center gap-3 rounded-[12px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
          >
            <i className="fa-solid fa-plus text-[#744af2]" />
            Add Episode
          </button>

          <button
            type="button"
            onClick={() => openPage(`/author/create-story?editStoryId=${story.id}`)}
            className="flex items-center gap-3 rounded-[12px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430]"
          >
            <i className="fa-regular fa-pen-to-square text-[#744af2]" />
            Edit Details
          </button>

          <button
            type="button"
            onClick={deleteStory}
            disabled={deleting}
            className="flex items-center gap-3 rounded-[12px] bg-[#f8f6fb] px-3 py-3 text-left text-[12px] font-extrabold text-[#2a2430] disabled:opacity-60"
          >
            <i className="fa-regular fa-trash-can text-[#744af2]" />
            {deleting ? 'Deleting...' : 'Delete Story'}
          </button>
        </div>
      </div>
    </div>
  )
}
