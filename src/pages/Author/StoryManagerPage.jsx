import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB')
}

function getStatusText(status) {
  const normalized = String(status || 'draft').toLowerCase()

  if (normalized === 'published') return 'Published'
  if (normalized === 'scheduled') return 'Scheduled'
  if (normalized === 'ready') return 'Ready'
  return 'Draft'
}

function getDateLabel(episode) {
  const status = String(episode?.status || 'draft').toLowerCase()
  const publishedAt = episode?.published_at
  const scheduledAt = episode?.scheduled_at
  const updatedAt = episode?.updated_at
  const createdAt = episode?.created_at

  if (status === 'scheduled') {
    return `Scheduled: ${formatDate(scheduledAt || updatedAt || createdAt) || 'Not set'}`
  }

  if (status === 'published') {
    const publishedDate = publishedAt ? new Date(publishedAt) : null
    const updatedDate = updatedAt ? new Date(updatedAt) : null

    if (
      publishedDate &&
      updatedDate &&
      !Number.isNaN(publishedDate.getTime()) &&
      !Number.isNaN(updatedDate.getTime()) &&
      updatedDate.getTime() > publishedDate.getTime() + 60 * 1000
    ) {
      return `Updated: ${formatDate(updatedAt)}`
    }

    return `Published: ${formatDate(publishedAt || updatedAt || createdAt) || 'Recently'}`
  }

  return `Last edited: ${formatDate(updatedAt || createdAt) || 'Recently'}`
}

function getStoryUpdatedLabel(story, episodes) {
  const latestEpisodeDate = episodes
    .map((episode) => episode.updated_at || episode.published_at || episode.created_at)
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0]

  const storyDate = story?.updated_at || story?.created_at
  const finalDate = latestEpisodeDate || (storyDate ? new Date(storyDate) : null)

  if (!finalDate || Number.isNaN(finalDate.getTime())) return 'Updated recently'

  return `Updated ${finalDate.toLocaleDateString('en-GB')}`
}

function getTotalCharacters(episodes) {
  return episodes.reduce((sum, episode) => sum + Number(episode.character_count || 0), 0)
}

function StatusBadge({ status }) {
  const normalized = String(status || 'draft').toLowerCase()

  const classes = {
    published: 'bg-[#ecfdf3] text-[#16803c]',
    scheduled: 'bg-[#eff6ff] text-[#0b5cff]',
    draft: 'bg-[#f2f4f7] text-[#667085]',
    ready: 'bg-[#fff7df] text-[#a56a00]',
  }

  return (
    <span className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ${classes[normalized] || classes.draft}`}>
      {getStatusText(normalized)}
    </span>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#f5f3fa] text-[#111827]">
          <i className={`${icon} text-[15px]`} />
        </div>

        <div className="min-w-0">
          <div className="text-[18px] font-extrabold text-[#111827]">{value}</div>
          <div className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">{label}</div>
        </div>
      </div>
    </div>
  )
}

function EpisodeActionSheet({
  episode,
  open,
  onClose,
  onEdit,
  onPreview,
  onPublish,
  onMoveToDraft,
  onDelete,
  busy,
}) {
  if (!open || !episode) return null

  const isPublished = episode.status === 'published'

  return (
    <div className="fixed inset-0 z-[150]">
      <button
        type="button"
        aria-label="Close episode actions"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section className="absolute bottom-0 left-0 right-0 rounded-t-[30px] bg-white px-4 pb-6 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-20 md:w-[360px] md:rounded-[26px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden" />

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-1 text-[17px] font-extrabold text-[#111827]">
              {episode.title || 'Untitled Episode'}
            </div>
            <div className="mt-0.5 text-[12px] font-semibold text-[#8d94a1]">
              EP {episode.episode_number || 1} • {getStatusText(episode.status)}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f5f7] text-[#111827]"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-[#eceaf2] bg-white">
          <button
            type="button"
            onClick={() => onEdit(episode)}
            className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
          >
            <i className="fa-solid fa-pen w-5 text-center text-[14px] text-[#111827]" />
            <span className="text-[14px] font-extrabold text-[#111827]">Edit Episode</span>
          </button>

          <button
            type="button"
            onClick={() => onPreview(episode)}
            className="flex w-full items-center gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:bg-[#f8fafc]"
          >
            <i className="fa-regular fa-eye w-5 text-center text-[14px] text-[#111827]" />
            <span className="text-[14px] font-extrabold text-[#111827]">Preview Episode</span>
          </button>

          {isPublished ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onMoveToDraft(episode)}
              className="flex w-full items-center gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:bg-[#f8fafc] disabled:opacity-60"
            >
              <i className="fa-regular fa-file-lines w-5 text-center text-[14px] text-[#111827]" />
              <span className="text-[14px] font-extrabold text-[#111827]">Move to Draft</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => onPublish(episode)}
              className="flex w-full items-center gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:bg-[#f8fafc] disabled:opacity-60"
            >
              <i className="fa-solid fa-upload w-5 text-center text-[14px] text-[#111827]" />
              <span className="text-[14px] font-extrabold text-[#111827]">Publish Episode</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(episode)}
            className="flex w-full items-center gap-3 border-t border-[#f0eef6] px-4 py-4 text-left active:bg-[#fff1f1]"
          >
            <i className="fa-regular fa-trash-can w-5 text-center text-[14px] text-[#e5484d]" />
            <span className="text-[14px] font-extrabold text-[#e5484d]">Delete Episode</span>
          </button>
        </div>
      </section>
    </div>
  )
}

function ConfirmDeleteModal({ episode, busy, onClose, onConfirm }) {
  if (!episode) return null

  return (
    <div className="fixed inset-0 z-[170] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button
        type="button"
        aria-label="Close delete modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-[430px] rounded-[30px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-regular fa-trash-can text-[25px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">
          Delete this episode?
        </h2>

        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
          This episode will be moved to Trash and hidden from readers.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-12 rounded-full bg-[#e5484d] text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {busy ? 'Deleting...' : 'Delete Episode'}
          </button>
        </div>
      </section>
    </div>
  )
}


function ConfirmTrashStoryModal({ story, open, busy, onClose, onConfirm }) {
  if (!open || !story) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button type="button" aria-label="Close story trash modal" onClick={onClose} className="absolute inset-0" />

      <section className="relative w-full max-w-[430px] rounded-[30px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-regular fa-trash-can text-[25px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">Move story to Trash?</h2>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
          This will hide the story, episodes, likes, comments, and stats. You can restore it within 30 days.
        </p>

        <div className="mt-4 rounded-[18px] bg-[#f8fafc] px-4 py-3 text-left">
          <div className="line-clamp-1 text-[13px] font-extrabold text-[#111827]">{story.title || 'Untitled Story'}</div>
          <div className="mt-1 text-[11.5px] font-semibold text-[#8d94a1]">No permanent delete is allowed from author account.</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-12 rounded-full bg-[#e5484d] text-[13px] font-extrabold text-white disabled:opacity-60"
          >
            {busy ? 'Moving...' : 'Move to Trash'}
          </button>
        </div>
      </section>
    </div>
  )
}

function EpisodeRow({ episode, onOpen, onMore }) {
  const views = formatCompactNumber(episode.total_views || episode.views || 0)
  const likes = formatCompactNumber(episode.total_likes || episode.likes || 0)
  const comments = formatCompactNumber(episode.total_comments || episode.comments || 0)

  return (
    <div className="flex w-full items-center gap-3 rounded-[20px] bg-white p-3 text-left shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={() => onOpen(episode)}
        className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-[#111827] text-white active:scale-[0.98]"
        aria-label={`Edit ${episode.title || 'episode'}`}
      >
        {episode.cover_url ? (
          <img src={episode.cover_url} alt={episode.title} className="h-full w-full object-cover" />
        ) : (
          <i className="fa-regular fa-image text-[18px] opacity-70" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onOpen(episode)}
        className="min-w-0 flex-1 text-left active:scale-[0.995]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="shrink-0 rounded-full bg-[#f5f3fa] px-2 py-1 text-[10px] font-extrabold text-[#667085]">
            EP {episode.episode_number || 1}
          </div>

          <StatusBadge status={episode.status} />

          {episode.is_adult ? (
            <span className="rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-extrabold text-[#e5484d]">
              18+
            </span>
          ) : null}
        </div>

        <div className="mt-2 line-clamp-1 text-[14px] font-extrabold text-[#111827]">
          {episode.title || 'Untitled Episode'}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[#8d94a1]">
          <span>{getDateLabel(episode)}</span>
          <span>•</span>
          <span>{Number(episode.character_count || 0).toLocaleString()} characters</span>
        </div>

        <div className="mt-2 flex items-center gap-4 text-[11px] font-bold text-[#555b66]">
          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-eye text-[11px] text-[#111827]" />
            {views}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-heart text-[10px] text-[#e5484d]" />
            {likes}
          </span>

          <span className="inline-flex items-center gap-1">
            <i className="fa-regular fa-comment text-[11px] text-[#111827]" />
            {comments}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onMore(episode)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
        aria-label="Episode actions"
      >
        <i className="fa-solid fa-ellipsis text-[15px]" />
      </button>
    </div>
  )
}

export default function StoryManagerPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()

  const [story, setStory] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('published')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [deleteEpisode, setDeleteEpisode] = useState(null)
  const [trashStoryOpen, setTrashStoryOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const publishedEpisodes = useMemo(
    () => episodes.filter((episode) => episode.status === 'published'),
    [episodes]
  )

  const draftEpisodes = useMemo(
    () => episodes.filter((episode) => episode.status !== 'published'),
    [episodes]
  )

  const visibleEpisodes = activeTab === 'published' ? publishedEpisodes : draftEpisodes
const totalPages = Math.max(1, Math.ceil(visibleEpisodes.length / pageSize))
const pageStart = (currentPage - 1) * pageSize
const pageEnd = Math.min(pageStart + pageSize, visibleEpisodes.length)

const paginatedEpisodes = useMemo(
  () => visibleEpisodes.slice(pageStart, pageEnd),
  [visibleEpisodes, pageStart, pageEnd]
)

const totalCharacters = useMemo(() => getTotalCharacters(episodes), [episodes])
  const storyUpdatedLabel = useMemo(() => getStoryUpdatedLabel(story, episodes), [story, episodes])
  const libraryAdds = formatCompactNumber(story?.library_count || story?.total_library || story?.total_subscribers || 0)
  useEffect(() => {
  setCurrentPage(1)
}, [activeTab, pageSize])

useEffect(() => {
  if (currentPage > totalPages) setCurrentPage(totalPages)
}, [currentPage, totalPages])

  useEffect(() => {
    let ignore = false

    async function loadStoryManager() {
      setLoading(true)
      setMessage('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const [storyResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const storyData = await storyResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Failed to load story')
        }

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Failed to load episodes')
        }

        if (ignore) return

        setStory(storyData.story || null)
        setEpisodes(episodesData.episodes || [])
      } catch (error) {
        if (ignore) return
        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to backend. Please check deployment.'
            : error.message || 'Failed to load story manager'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStoryManager()

    return () => {
      ignore = true
    }
  }, [navigate, storyId])

  const handleEditStory = () => {
    navigate(`/author/create-story?editStoryId=${storyId}`)
  }

  const handleAddEpisode = () => {
    navigate(`/author/story/${storyId}/episode/create?first=0`)
  }

  const handleEditEpisode = (episode) => {
    navigate(`/author/story/${storyId}/episode/create?editEpisodeId=${episode.id}&startStep=2&first=0`)
  }

  const handlePreviewEpisode = (episode) => {
    setSelectedEpisode(null)
    navigate(`/author/story/${storyId}/episode/preview?episodeId=${episode.id}`)
  }

  const handlePublishEpisode = (episode) => {
    setSelectedEpisode(null)
    navigate(`/author/story/${storyId}/episode/publish?episodeId=${episode.id}&first=${episode.episode_number === 1 ? '1' : '0'}`)
  }

  const handleMoveToDraft = async (episode) => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setBusy(true)

      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}/episodes/${episode.id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'draft' }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to move episode to draft')
      }

      setEpisodes((current) =>
        current.map((item) =>
          item.id === episode.id
            ? {
                ...item,
                status: 'draft',
                published_at: null,
                scheduled_at: null,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      )

      setSelectedEpisode(null)
      setActiveTab('drafts')
    } catch (error) {
      setMessage(error.message || 'Failed to move episode to draft')
      setSelectedEpisode(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteEpisode = (episode) => {
    setSelectedEpisode(null)
    setDeleteEpisode(episode)
  }

  const handleConfirmDeleteEpisode = async () => {
  if (!deleteEpisode) return

  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  try {
    setBusy(true)

    const response = await fetch(
      `${API_BASE_URL}/api/stories/${storyId}/episodes/${deleteEpisode.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to delete episode')
    }

    setEpisodes((current) =>
      current.filter((episode) => episode.id !== deleteEpisode.id)
    )
    setDeleteEpisode(null)
  } catch (error) {
    setDeleteEpisode(null)
    setMessage(error.message || 'Failed to delete episode')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    setBusy(false)
  }
}


  const handleMoveStoryToTrash = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setBusy(true)

      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to move story to Trash')
      }

      setTrashStoryOpen(false)
      navigate('/author/dashboard', { replace: true })
    } catch (error) {
      setTrashStoryOpen(false)
      setMessage(error.message || 'Failed to move story to Trash')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[110px]">
      <EpisodeActionSheet
        episode={selectedEpisode}
        open={Boolean(selectedEpisode)}
        onClose={() => setSelectedEpisode(null)}
        onEdit={handleEditEpisode}
        onPreview={handlePreviewEpisode}
        onPublish={handlePublishEpisode}
        onMoveToDraft={handleMoveToDraft}
        onDelete={handleDeleteEpisode}
        busy={busy}
      />

      <ConfirmDeleteModal
  episode={deleteEpisode}
  busy={busy}
  onClose={() => setDeleteEpisode(null)}
  onConfirm={handleConfirmDeleteEpisode}
/>

      <ConfirmTrashStoryModal
        story={story}
        open={trashStoryOpen}
        busy={busy}
        onClose={() => setTrashStoryOpen(false)}
        onConfirm={handleMoveStoryToTrash}
      />

      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">Story Manager</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTrashStoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95"
              aria-label="Move story to Trash"
            >
              <i className="fa-regular fa-trash-can text-[13px]" />
            </button>

            <button
              type="button"
              onClick={handleEditStory}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white active:scale-95"
            >
              Edit Story
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {loading ? (
          <section className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-bold text-[#667085]">Loading story manager...</div>
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[18px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {!loading && story ? (
          <>
            <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative min-h-[180px] bg-[#111827]">
                {story.slides?.length ? (
                  <img
                    src={story.slides[0].image_url}
                    alt={story.title}
                    className="h-[180px] w-full object-cover opacity-80"
                  />
                ) : (
                  <div className="flex h-[180px] items-center justify-center text-white/50">
                    <i className="fa-regular fa-image text-[32px]" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                  <div className="aspect-[2/3] w-[96px] overflow-hidden rounded-[18px] bg-white/10 shadow-xl ring-2 ring-white/30">
                    {story.cover_url ? (
                      <img src={story.cover_url} alt={story.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/50">
                        <i className="fa-regular fa-image text-[20px]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={story.status} />
                      {story.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className="line-clamp-2 text-[22px] font-extrabold leading-7 text-white">
                      {story.title || 'Untitled Story'}
                    </h2>

                    <div className="mt-1 text-[12px] font-bold text-white/75">
                      {story.story_language || 'Khmer'} • {story.main_genre || 'Novel'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="text-[12.5px] font-bold text-[#667085]">
                  {totalCharacters.toLocaleString()} characters • {storyUpdatedLabel}
                </div>
              </div>
            </section>

            <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon="fa-solid fa-book-open" label="Episodes" value={episodes.length} />
              <StatCard icon="fa-solid fa-circle-check" label="Published" value={publishedEpisodes.length} />
              <StatCard icon="fa-regular fa-file-lines" label="Drafts" value={draftEpisodes.length} />
              <StatCard icon="fa-regular fa-bookmark" label="Library" value={libraryAdds} />
            </section>

            <section className="mt-5">
              <div className="mb-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-[17px] font-extrabold text-[#111827]">Episodes</h2>
                    <p className="mt-0.5 text-[12px] font-semibold text-[#8d94a1]">
                      Manage all episodes for this story.
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
                    {visibleEpisodes.length} shown
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-[18px] bg-white p-1.5 shadow-sm ring-1 ring-black/5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('published')}
                    className={`h-11 rounded-[14px] text-[13px] font-extrabold transition active:scale-[0.99] ${
                      activeTab === 'published'
                        ? 'bg-[#111827] text-white'
                        : 'bg-transparent text-[#667085]'
                    }`}
                  >
                    Published {publishedEpisodes.length}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('drafts')}
                    className={`h-11 rounded-[14px] text-[13px] font-extrabold transition active:scale-[0.99] ${
                      activeTab === 'drafts'
                        ? 'bg-[#111827] text-white'
                        : 'bg-transparent text-[#667085]'
                    }`}
                  >
                    Drafts {draftEpisodes.length}
                  </button>
                </div>
              </div>

              {visibleEpisodes.length ? (
  <>
    <div className="space-y-3">
      {paginatedEpisodes.map((episode) => (
        <EpisodeRow
          key={episode.id}
          episode={episode}
          onOpen={handleEditEpisode}
          onMore={setSelectedEpisode}
        />
      ))}
    </div>

    {visibleEpisodes.length >= 10 ? (
      <div className="mt-3 flex items-center justify-end gap-2 rounded-[12px] bg-[#eef0f3] px-3 py-2 text-[11px] font-semibold text-[#667085]">
        <span>EP/Page:</span>

        <select
          value={pageSize}
          onChange={(event) => setPageSize(Number(event.target.value))}
          className="h-7 rounded-md border border-[#d8dde5] bg-white px-2 text-[11px] font-semibold text-[#111827] outline-none"
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>

        <span className="min-w-[78px] text-center">
          {pageStart + 1}–{pageEnd} of {visibleEpisodes.length}
        </span>

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full active:bg-white disabled:opacity-25"
        >
          <i className="fa-solid fa-chevron-left text-[10px]" />
        </button>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full active:bg-white disabled:opacity-25"
        >
          <i className="fa-solid fa-chevron-right text-[10px]" />
        </button>
      </div>
    ) : null}
  </>
) : (
                <div className="rounded-[24px] bg-white px-5 py-8 text-center shadow-sm ring-1 ring-black/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
                    <i className="fa-regular fa-file-lines text-[22px]" />
                  </div>

                  <h3 className="mt-4 text-[16px] font-extrabold text-[#111827]">
                    No {activeTab === 'published' ? 'published' : 'draft'} episodes yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[#8d94a1]">
                    {activeTab === 'published'
                      ? 'Published episodes will appear here after you publish them.'
                      : 'Draft, ready, and scheduled episodes will appear here.'}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddEpisode}
                className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-[#111827] text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99]"
              >
                <i className="fa-solid fa-plus mr-2 text-[13px]" />
                Add Episode
              </button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
