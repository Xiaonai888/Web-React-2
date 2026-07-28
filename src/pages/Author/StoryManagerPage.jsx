import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProfessionalEpisodeActionSheet from '../../components/author/ProfessionalEpisodeActionSheet'

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

function normalizeStoryType(value) {
  const type = String(value || '').toLowerCase()
  if (type === 'manga' || type === 'chat_story') return type
  return 'novel'
}

function formatCompactNumber(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace('.0', '')}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace('.0', '')}K`
  }
  return number.toLocaleString('en-US')
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB')
}

function getStatusText(value) {
  const status = String(value || 'draft').toLowerCase()
  if (status === 'published') return 'Published'
  if (status === 'scheduled') return 'Scheduled'
  if (status === 'ready') return 'Ready'
  return 'Draft'
}

function getDateLabel(episode) {
  const status = String(episode?.status || 'draft').toLowerCase()
  const value =
    status === 'published'
      ? episode?.published_at || episode?.updated_at || episode?.created_at
      : status === 'scheduled'
        ? episode?.scheduled_at || episode?.updated_at || episode?.created_at
        : episode?.updated_at || episode?.created_at
  const date = formatDate(value)
  if (status === 'published') return `Published ${date || 'recently'}`
  if (status === 'scheduled') return `Scheduled ${date || 'not set'}`
  return `Updated ${date || 'recently'}`
}

function getStoryUpdatedLabel(story, episodes) {
  const values = [
    story?.updated_at,
    story?.created_at,
    ...episodes.flatMap((episode) => [
      episode.updated_at,
      episode.published_at,
      episode.created_at,
    ]),
  ]
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((first, second) => second.getTime() - first.getTime())

  return values.length
    ? `Updated ${values[0].toLocaleDateString('en-GB')}`
    : 'Updated recently'
}

function ConfirmDeleteModal({ episode, busy, onClose, onConfirm }) {
  if (!episode) return null

  return (
    <div className="fixed inset-0 z-[170] flex items-end justify-center bg-black/45 px-3 pb-3 sm:items-center sm:pb-0">
      <button
        type="button"
        aria-label="Close delete modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-[420px] rounded-[20px] bg-white p-5 text-center shadow-2xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-regular fa-trash-can text-[18px]" />
        </span>

        <h2 className="mt-4 text-[18px] font-semibold text-[#111827]">
          Delete this episode?
        </h2>

        <p className="mt-2 text-[12px] leading-5 text-[#667085]">
          This episode will move to Trash and stay hidden from readers.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-11 rounded-[12px] border border-[#e4e7ec] bg-white text-[13px] text-[#111827] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-11 rounded-[12px] bg-[#e5484d] text-[13px] text-white disabled:opacity-60"
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
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/45 px-3 pb-3 sm:items-center sm:pb-0">
      <button
        type="button"
        aria-label="Close story trash modal"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-[420px] rounded-[20px] bg-white p-5 text-center shadow-2xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-regular fa-trash-can text-[18px]" />
        </span>

        <h2 className="mt-4 text-[18px] font-semibold text-[#111827]">
          Move story to Trash?
        </h2>

        <p className="mt-2 text-[12px] leading-5 text-[#667085]">
          The story and its episodes will be hidden. You can restore them from Trash within 30 days.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-11 rounded-[12px] border border-[#e4e7ec] bg-white text-[13px] text-[#111827] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="h-11 rounded-[12px] bg-[#e5484d] text-[13px] text-white disabled:opacity-60"
          >
            {busy ? 'Moving...' : 'Move to Trash'}
          </button>
        </div>
      </section>
    </div>
  )
}

function StatusBadge({ status }) {
  const normalized = String(status || 'draft').toLowerCase()
  const styles = {
    published: 'bg-[#ecfdf3] text-[#16803c]',
    scheduled: 'bg-[#eff6ff] text-[#0b5cff]',
    ready: 'bg-[#fff7df] text-[#a56a00]',
    draft: 'bg-[#f2f4f7] text-[#667085]',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[normalized] || styles.draft
      }`}
    >
      {getStatusText(normalized)}
    </span>
  )
}

function EpisodeMetric({ icon, value }) {
  return (
    <span className="inline-flex min-w-[58px] items-center justify-center gap-1.5 text-[11px] text-[#667085]">
      <i className={`${icon} text-[11px] text-[#111827]`} />
      {formatCompactNumber(value)}
    </span>
  )
}

function EpisodeRow({ episode, storyType, last, onOpen, onMore }) {
  const views = episode.total_views || 0
  const likes = episode.total_likes || 0
  const comments = episode.total_comments || 0
  const contentCount =
    storyType === 'manga'
      ? Number(episode.page_count || 0)
      : storyType === 'novel'
        ? Number(episode.word_count || episode.character_count || 0)
        : Number(episode.character_count || 0)
  const contentLabel =
    storyType === 'manga'
      ? `${contentCount.toLocaleString('en-US')} pages`
      : storyType === 'novel'
        ? `${contentCount.toLocaleString('en-US')} words`
        : `${contentCount.toLocaleString('en-US')} characters`

  return (
    <div className="relative flex min-h-[96px] items-center gap-3 bg-white px-4 py-4">
      <button
        type="button"
        onClick={() => onOpen(episode)}
        className="min-w-0 flex-1 text-left active:opacity-70"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#8d94a1]">
            EP {episode.episode_number || 1}
          </span>

          <StatusBadge status={episode.status} />

          {episode.is_adult ? (
            <span className="rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-semibold text-[#e5484d]">
              18+
            </span>
          ) : null}
        </div>

        <div className="mt-2 line-clamp-1 text-[14px] font-semibold text-[#111827]">
          {episode.title || 'Untitled Episode'}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-[#8d94a1]">
          <span>{getDateLabel(episode)}</span>
          <span>•</span>
          <span>{contentLabel}</span>
        </div>
      </button>

      <div className="hidden shrink-0 items-center gap-2 md:flex">
        <EpisodeMetric icon="fa-regular fa-eye" value={views} />
        <EpisodeMetric icon="fa-regular fa-heart" value={likes} />
        <EpisodeMetric icon="fa-regular fa-comment" value={comments} />
      </div>

      <button
        type="button"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          onMore({
            ...episode,
            __menuAnchor: {
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
            },
          })
        }}
        className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:bg-[#f3f4f6]"
        aria-label={`Actions for ${episode.title || 'episode'}`}
      >
        <i className="fa-solid fa-ellipsis text-[14px]" />
      </button>

      {!last ? (
        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[#eceef2]" />
      ) : null}
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
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [deleteEpisode, setDeleteEpisode] = useState(null)
  const [trashStoryOpen, setTrashStoryOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const storyType = normalizeStoryType(story?.story_type)
  const isChatStory = storyType === 'chat_story'
  const isManga = storyType === 'manga'
  const accentButton = isChatStory
    ? 'bg-gradient-to-r from-[#9362ef] to-[#6d42db]'
    : isManga
      ? 'bg-[#FE526E]'
      : 'bg-[#111827]'

  useEffect(() => {
    let ignore = false

    async function loadStoryManager() {
      setLoading(true)
      setMessage('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const [storyResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/stories/${storyId}/manager-episodes`, {
            headers: { Authorization: `Bearer ${token}` },
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

        const nextStory = storyData.story || null
        const resolvedType = normalizeStoryType(
          nextStory?.story_type || episodesData.story_type
        )

        setStory(nextStory ? { ...nextStory, story_type: resolvedType } : null)
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

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, pageSize])

  const publishedEpisodes = useMemo(
    () =>
      episodes.filter(
        (episode) => String(episode.status || '').toLowerCase() === 'published'
      ),
    [episodes]
  )

  const draftEpisodes = useMemo(
    () =>
      episodes.filter(
        (episode) => String(episode.status || '').toLowerCase() !== 'published'
      ),
    [episodes]
  )

  const visibleEpisodes =
    activeTab === 'published' ? publishedEpisodes : draftEpisodes
  const totalPages = Math.max(1, Math.ceil(visibleEpisodes.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * pageSize
  const pageEnd = Math.min(pageStart + pageSize, visibleEpisodes.length)
  const paginatedEpisodes = visibleEpisodes.slice(pageStart, pageEnd)

  const totalContent = useMemo(() => {
    return episodes.reduce((sum, episode) => {
      if (storyType === 'manga') return sum + Number(episode.page_count || 0)
      if (storyType === 'novel') {
        return sum + Number(episode.word_count || episode.character_count || 0)
      }
      return sum + Number(episode.character_count || 0)
    }, 0)
  }, [episodes, storyType])

  const storyContentText =
    storyType === 'manga'
      ? `${totalContent.toLocaleString('en-US')} pages`
      : storyType === 'novel'
        ? `${totalContent.toLocaleString('en-US')} words`
        : `${totalContent.toLocaleString('en-US')} characters`

  const storyProgressText = episodes.length
    ? `${String(story?.status || 'ongoing').toLowerCase() === 'completed' ? 'Completed' : 'Ongoing'} • ${episodes.length} Episode${episodes.length === 1 ? '' : 's'}`
    : 'Awaiting first episode'

  const storyUpdatedLabel = useMemo(
    () => getStoryUpdatedLabel(story, episodes),
    [story, episodes]
  )

  function closeEpisodeMenu() {
    setSelectedEpisode(null)
  }

  function handleBack() {
    navigate('/author/stories', { replace: true })
  }

  function handleEditStory() {
    navigate(
      `/author/create-story?editStoryId=${encodeURIComponent(storyId)}&type=${encodeURIComponent(storyType)}`
    )
  }

  function handleAddEpisode() {
    if (isChatStory) {
      navigate(`/author/story/${storyId}/chat/editor?new=1&first=0`)
      return
    }

    navigate(
      `/author/story/${storyId}/episode/create?first=0&type=${encodeURIComponent(storyType)}`
    )
  }

  function handleEditEpisode(episode) {
    closeEpisodeMenu()

    if (isChatStory) {
      navigate(
        `/author/story/${storyId}/chat/editor?episodeId=${encodeURIComponent(episode.id)}&first=0`
      )
      return
    }

    navigate(
      `/author/story/${storyId}/episode/create?editEpisodeId=${encodeURIComponent(episode.id)}&startStep=2&first=0&type=${encodeURIComponent(storyType)}`
    )
  }

  function handlePreviewEpisode(episode) {
    closeEpisodeMenu()

    if (isChatStory) {
      navigate(
        `/author/story/${storyId}/chat/editor?episodeId=${encodeURIComponent(episode.id)}&first=0`
      )
      return
    }

    navigate(
      `/author/story/${storyId}/episode/preview?episodeId=${encodeURIComponent(episode.id)}&type=${encodeURIComponent(storyType)}`
    )
  }

  function handlePublishEpisode(episode) {
    closeEpisodeMenu()

    navigate(
      `/author/story/${storyId}/episode/publish?episodeId=${encodeURIComponent(episode.id)}&first=${Number(episode.episode_number || 0) === 1 ? '1' : '0'}&type=${encodeURIComponent(storyType)}`
    )
  }

  async function handleMoveToDraft(episode) {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/episodes/${episode.id}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'draft' }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to move episode to draft')
      }

      setEpisodes((current) =>
        current.map((item) =>
          String(item.id) === String(episode.id)
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

      closeEpisodeMenu()
      setActiveTab('drafts')
    } catch (error) {
      closeEpisodeMenu()
      setMessage(error.message || 'Failed to move episode to draft')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  function handleDeleteEpisode(episode) {
    closeEpisodeMenu()
    setDeleteEpisode(episode)
  }

  async function handleConfirmDeleteEpisode() {
    if (!deleteEpisode) return

    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setBusy(true)

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/episodes/${deleteEpisode.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to delete episode')
      }

      setEpisodes((current) =>
        current.filter(
          (episode) => String(episode.id) !== String(deleteEpisode.id)
        )
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

  async function handleMoveStoryToTrash() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setBusy(true)

      const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to move story to Trash')
      }

      setTrashStoryOpen(false)
      navigate('/author/stories', { replace: true })
    } catch (error) {
      setTrashStoryOpen(false)
      setMessage(error.message || 'Failed to move story to Trash')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f9] pb-[92px] text-[#111827]">
      <ProfessionalEpisodeActionSheet
        episode={selectedEpisode}
        open={Boolean(selectedEpisode)}
        onClose={closeEpisodeMenu}
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

      <header className="sticky top-0 z-50 border-b border-[#eceef2] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto grid h-[58px] max-w-5xl grid-cols-[44px_1fr_auto] items-center px-2 sm:px-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:opacity-60"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[15px] font-semibold">
            Story Manager
          </h1>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTrashStoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center text-[#e5484d] active:opacity-60"
              aria-label="Move story to Trash"
            >
              <i className="fa-regular fa-trash-can text-[13px]" />
            </button>

            <button
              type="button"
              onClick={handleEditStory}
              className={`h-9 rounded-full px-4 text-[12px] text-white active:scale-95 ${accentButton}`}
            >
              Edit Story
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-4 sm:px-5">
        {loading ? (
          <section className="rounded-[14px] bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[12px] text-[#667085]">
              Loading story manager...
            </div>
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[12px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

        {!loading && story ? (
          <>
            <section className="bg-white px-3 py-4 sm:px-4">
              <div className="flex items-start gap-4">
                <div className="aspect-[2/3] w-[88px] shrink-0 overflow-hidden rounded-[10px] bg-[#eef0f3] sm:w-[104px]">
                  {story.cover_url ? (
                    <img
                      src={story.cover_url}
                      alt={story.title || ''}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#8d94a1]">
                      <i className="fa-regular fa-image text-[22px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <h2 className="line-clamp-2 text-[19px] font-semibold leading-6 sm:text-[22px]">
                    {story.title || 'Untitled Story'}
                  </h2>

                  <div
                    className={`mt-2 text-[12px] ${
                      episodes.length ? 'text-[#667085]' : 'text-[#a56a00]'
                    }`}
                  >
                    {storyProgressText}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-[#8d94a1]">
                    <span>{storyContentText}</span>
                    <span>•</span>
                    <span>{storyUpdatedLabel}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-3 bg-white">
              <div className="flex gap-1 border-b border-[#eceef2] px-3 pb-3 pt-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('published')}
                  className={`rounded-full px-5 py-2.5 text-[12px] transition active:scale-[0.98] ${
                    activeTab === 'published'
                      ? 'bg-[#eef0f3] text-[#111827]'
                      : 'bg-transparent text-[#8d94a1]'
                  }`}
                >
                  Published {publishedEpisodes.length}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('drafts')}
                  className={`rounded-full px-5 py-2.5 text-[12px] transition active:scale-[0.98] ${
                    activeTab === 'drafts'
                      ? 'bg-[#eef0f3] text-[#111827]'
                      : 'bg-transparent text-[#8d94a1]'
                  }`}
                >
                  Drafts {draftEpisodes.length}
                </button>
              </div>

              {visibleEpisodes.length ? (
                <>
                  <div>
                    {paginatedEpisodes.map((episode, index) => (
                      <EpisodeRow
                        key={episode.id}
                        episode={episode}
                        storyType={storyType}
                        last={index === paginatedEpisodes.length - 1}
                        onOpen={handleEditEpisode}
                        onMore={setSelectedEpisode}
                      />
                    ))}
                  </div>

                  {visibleEpisodes.length > pageSize ? (
                    <div className="flex items-center justify-between border-t border-[#eceef2] px-4 py-3 text-[11px] text-[#667085]">
                      <select
                        value={pageSize}
                        onChange={(event) =>
                          setPageSize(Number(event.target.value))
                        }
                        className="h-8 rounded-[8px] border border-[#d8dde5] bg-white px-2 text-[11px] text-[#111827] outline-none"
                      >
                        <option value={20}>20 per page</option>
                        <option value={30}>30 per page</option>
                        <option value={50}>50 per page</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <span>
                          {pageStart + 1}–{pageEnd} of {visibleEpisodes.length}
                        </span>

                        <button
                          type="button"
                          disabled={safePage === 1}
                          onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                          }
                          className="flex h-8 w-8 items-center justify-center disabled:opacity-25"
                        >
                          <i className="fa-solid fa-chevron-left text-[10px]" />
                        </button>

                        <button
                          type="button"
                          disabled={safePage === totalPages}
                          onClick={() =>
                            setCurrentPage((page) =>
                              Math.min(totalPages, page + 1)
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center disabled:opacity-25"
                        >
                          <i className="fa-solid fa-chevron-right text-[10px]" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="text-[14px] text-[#111827]">
                    {episodes.length
                      ? `No ${
                          activeTab === 'published' ? 'published' : 'draft'
                        } episodes yet.`
                      : 'Create your first episode to start your story.'}
                  </div>

                  <div className="mx-auto mt-2 max-w-[300px] text-[11px] leading-5 text-[#8d94a1]">
                    {episodes.length
                      ? 'Episodes will appear here when their status changes.'
                      : 'Use the Add Episode button below when you are ready to begin.'}
                  </div>
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>

      {!loading && story ? (
        <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e8eaee] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <button
              type="button"
              onClick={handleAddEpisode}
              className={`flex h-12 w-full items-center justify-center rounded-full text-[14px] text-white active:scale-[0.99] ${accentButton}`}
            >
              <i className="fa-solid fa-plus mr-2 text-[12px]" />
              Add Episode
            </button>
          </div>
        </footer>
      ) : null}
    </div>
  )
}
