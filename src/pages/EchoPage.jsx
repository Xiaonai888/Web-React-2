import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function getEchoPosts() {
  try {
    const parsed = JSON.parse(localStorage.getItem('shadow_profile_echo_posts') || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveEchoPost(post) {
  const current = getEchoPosts()
  localStorage.setItem('shadow_profile_echo_posts', JSON.stringify([post, ...current]))
}

function buildStoryLink(storyId) {
  return `${window.location.origin}/story/${storyId}`
}

function buildAuthorPostLink(postId, post) {
  const username = post?.author_page?.page_username || ''
  const path = username ? `/author/page/${username}?post=${postId}` : `/author/post/${postId}`
  return `${window.location.origin}${path}`
}

function ActionButton({ active, icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-[22px] border px-4 py-4 text-left active:scale-[0.99] ${
        active ? 'border-[#111827] bg-[#111827] text-white' : 'border-[#eceaf2] bg-white text-[#111827]'
      }`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
        active ? 'bg-white/12 text-white' : 'bg-[#f5f3fa] text-[#111827]'
      }`}>
        <i className={`${icon} text-[17px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-black">{title}</span>
        <span className={`mt-1 block text-[11.5px] font-semibold leading-5 ${active ? 'text-white/70' : 'text-[#8d94a1]'}`}>
          {text}
        </span>
      </span>
    </button>
  )
}

export default function EchoPage() {
  const navigate = useNavigate()
  const { storyId, postId } = useParams()
const isAuthorPostEcho = Boolean(postId)
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState('write')
  const [postText, setPostText] = useState('')
  const [saving, setSaving] = useState(false)
  const user = useMemo(() => getStoredUser(), [])
  const storyLink = useMemo(() => {
  if (isAuthorPostEcho) return buildAuthorPostLink(postId, story)
  return buildStoryLink(storyId)
}, [isAuthorPostEcho, postId, story, storyId])

  useEffect(() => {
  let ignore = false

  async function loadEchoTarget() {
    setLoading(true)
    setMessage('')

    try {
      const url = isAuthorPostEcho
        ? `${API_BASE_URL}/api/authors/page/posts/${postId}`
        : `${API_BASE_URL}/api/public/stories/${storyId}`

      const response = await fetch(url)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load echo target')
      }

      if (ignore) return

      if (isAuthorPostEcho) {
        const post = data.post || {}
        setStory({
          id: post.id,
          title: post.content || 'Author post',
          cover_url: post.image_urls?.[0] || '',
          main_genre: 'Author Post',
          author_page: post.author_page || null,
          author_name: post.author_page?.page_name || 'Author',
          echo_target_type: 'author_post',
        })
        return
      }

      setStory(data.story || null)
    } catch (error) {
      if (!ignore) setMessage(error.message || 'Failed to load echo target')
    } finally {
      if (!ignore) setLoading(false)
    }
  }

  loadEchoTarget()

  return () => {
    ignore = true
  }
}, [isAuthorPostEcho, postId, storyId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storyLink)
      setMessage('Link copied.')
    } catch {
      setMessage(storyLink)
    }
  }

  const handleEcho = () => {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    if (!story?.id) {
      setMessage('Story is not ready yet.')
      return
    }

    setSaving(true)

    const echoPost = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: 'echo',
      story_id: story.id,
      story_title: story.title || 'Untitled Story',
      story_cover_url: story.cover_url || '',
      story_author_name:
        story.author_page?.page_name ||
        story.authorPage?.page_name ||
        story.author?.page_name ||
        story.author_name ||
        'Author',
      story_genre: story.main_genre || 'Story',
      echo_text: mode === 'write' ? postText.trim() : '',
      user_name: user?.name || user?.username || 'Reader',
      created_at: new Date().toISOString(),
    }

    saveEchoPost(echoPost)
    setSaving(false)
    navigate('/profile')
  }

  return (
    <main className="min-h-screen bg-[#f5f3fa] pb-8 text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eceaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-center text-[17px] font-black">Echo</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pt-4">
        {message ? (
          <div className="mb-4 rounded-[18px] bg-white px-4 py-3 text-[12px] font-bold text-[#667085] shadow-sm ring-1 ring-black/5">
            {message}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="p-4">
            <div className="flex gap-3">
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-[#eef1f5]">
                {story?.cover_url ? (
                  <img src={story.cover_url} alt={story.title || 'Story cover'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
                    <i className="fa-regular fa-bookmark text-[22px]" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {isAuthorPostEcho ? 'Author Post' : 'Story'}
                <h2 className="mt-1 line-clamp-2 text-[18px] font-black leading-6 text-[#111827]">
                  {loading ? 'Loading story...' : story?.title || 'Untitled Story'}
                </h2>
                <p className="mt-2 line-clamp-1 text-[12px] font-bold text-[#8d94a1]">
                  {story?.author_page?.page_name || story?.authorPage?.page_name || story?.author?.page_name || story?.author_name || 'Author'}
                </p>
                <p className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#98a2b3]">
                  {story?.main_genre || 'Story'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <ActionButton
            active={mode === 'share-now'}
            icon="fa-solid fa-bolt"
            title="Share Now"
            text="Echo this story to your timeline without writing a post."
            onClick={() => setMode('share-now')}
          />

          <ActionButton
            active={mode === 'write'}
            icon="fa-regular fa-pen-to-square"
            title="Write Post"
            text="Add your own words before echoing this story."
            onClick={() => setMode('write')}
          />

          <ActionButton
            active={false}
            icon="fa-regular fa-copy"
            title="Copy Link"
            text="Copy this story link so you can share it anywhere."
            onClick={handleCopyLink}
          />
        </div>

        {mode === 'write' ? (
          <section className="mt-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <label className="text-[13px] font-black text-[#111827]">Write something</label>
            <textarea
              value={postText}
              onChange={(event) => setPostText(event.target.value)}
              maxLength={280}
              rows={6}
              placeholder={isAuthorPostEcho ? 'Say something about this post...' : 'Say something about this story...'}
              className="mt-3 w-full resize-none rounded-[22px] bg-[#f5f3fa] px-4 py-4 text-[14px] font-semibold leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] focus:ring-2 focus:ring-[#111827]/10"
            />
            <div className="mt-2 text-right text-[11px] font-bold text-[#98a2b3]">{postText.length}/280</div>
          </section>
        ) : null}

        <button
          type="button"
          onClick={handleEcho}
          disabled={loading || saving || !story}
          className="mt-5 flex h-13 w-full items-center justify-center rounded-full bg-[#111827] px-5 text-[14px] font-black text-white shadow-[0_14px_30px_rgba(17,24,39,0.18)] active:scale-95 disabled:bg-[#9ca3af]"
        >
          <i className="fa-solid fa-retweet mr-2 text-[14px]" />
          {saving ? 'Echoing...' : mode === 'write' ? 'Echo Post' : 'Share Now'}
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[#e4e7ec] bg-white px-5 text-[13px] font-black text-[#111827] active:scale-95"
        >
          <i className="fa-regular fa-copy mr-2 text-[14px]" />
          Copy Link
        </button>
      </section>
    </main>
  )
}
