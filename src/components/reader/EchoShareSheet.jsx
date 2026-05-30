import { useMemo, useState } from 'react'

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
  localStorage.setItem('shadow_profile_echo_posts', JSON.stringify([post, ...getEchoPosts()]))
}

function getAuthorName(story) {
  return (
    story?.author_page?.page_name ||
    story?.authorPage?.page_name ||
    story?.author?.page_name ||
    story?.author_name ||
    'Author'
  )
}

function getStoryLink(story) {
  if (!story?.id) return window.location.href
  return `${window.location.origin}/story/${story.id}`
}

function ShareCircle({ icon, label, bg = 'bg-white', color = 'text-[#111827]', onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-[82px] shrink-0 text-center active:scale-95">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 ${bg} ${color}`}>
        <i className={`${icon} text-[22px]`} />
      </div>
      <div className="mt-2 text-[12px] font-bold leading-4 text-[#111827]">{label}</div>
    </button>
  )
}

function FriendCircle({ name }) {
  return (
    <button type="button" className="w-[76px] shrink-0 text-center active:scale-95">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e5e7eb] text-[17px] font-black text-white">
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div className="mt-2 line-clamp-2 text-[11.5px] font-bold leading-4 text-[#111827]">{name}</div>
    </button>
  )
}

export default function EchoShareSheet({ open, story, onClose, onEchoed }) {
  const [postText, setPostText] = useState('')
  const [destination, setDestination] = useState('Feed')
  const [audience, setAudience] = useState('Public')
  const [message, setMessage] = useState('')
  const user = useMemo(() => getStoredUser(), [])
  const storyLink = useMemo(() => getStoryLink(story), [story])
  const authorName = getAuthorName(story)

  if (!open) return null

  const displayName = user?.name || user?.username || 'Reader'
  const avatarLetter = displayName.slice(0, 1).toUpperCase()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storyLink)
      setMessage('Link copied.')
    } catch {
      setMessage(storyLink)
    }
  }

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(storyLink)}&text=${encodeURIComponent(story?.title || 'Shadow story')}`, '_blank', 'noopener,noreferrer')
  }

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyLink)}`, '_blank', 'noopener,noreferrer')
  }

  const handleEchoNow = () => {
    if (!story?.id) {
      setMessage('Story is not ready yet.')
      return
    }

    const post = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: 'echo',
      story_id: story.id,
      story_title: story.title || 'Untitled Story',
      story_cover_url: story.cover_url || '',
      story_author_name: authorName,
      story_genre: story.main_genre || 'Story',
      echo_text: postText.trim(),
      destination,
      audience,
      user_name: displayName,
      created_at: new Date().toISOString(),
    }

    saveEchoPost(post)
    setPostText('')
    setMessage('')
    onEchoed?.(post)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/40">
      <button type="button" aria-label="Close echo share" onClick={onClose} className="absolute inset-0" />

      <section className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-[#f5f3fa] px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 shadow-2xl md:mb-5 md:max-w-[520px] md:rounded-[30px]">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#9ca3af]" />

        <div className="rounded-[18px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[18px] font-black text-white">
              {user?.avatarUrl || user?.avatar_url ? (
                <img src={user.avatarUrl || user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[17px] font-black text-[#111827]">{displayName}</div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDestination((value) => (value === 'Feed' ? 'Timeline' : 'Feed'))}
                  className="flex h-9 items-center gap-2 rounded-[13px] bg-[#e5e7eb] px-3 text-[13px] font-black text-[#111827] active:scale-95"
                >
                  <span>{destination}</span>
                  <i className="fa-solid fa-caret-down text-[12px]" />
                </button>

                <button
                  type="button"
                  onClick={() => setAudience((value) => (value === 'Public' ? 'Only me' : 'Public'))}
                  className="flex h-9 items-center gap-2 rounded-[13px] bg-[#e5e7eb] px-3 text-[13px] font-black text-[#111827] active:scale-95"
                >
                  <i className={audience === 'Public' ? 'fa-solid fa-earth-americas text-[13px]' : 'fa-solid fa-lock text-[13px]'} />
                  <span>{audience}</span>
                  <i className="fa-solid fa-caret-down text-[12px]" />
                </button>
              </div>
            </div>

            <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95">
              <i className="fa-solid fa-xmark text-[14px]" />
            </button>
          </div>

          <textarea
            value={postText}
            onChange={(event) => setPostText(event.target.value)}
            rows={4}
            maxLength={280}
            placeholder="Say something..."
            className="mt-4 w-full resize-none bg-transparent text-[24px] font-medium leading-8 text-[#111827] outline-none placeholder:text-[#7b7f87]"
          />

          <div className="mt-2 flex items-center justify-between">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-[#65676b] active:scale-95 active:bg-[#f2f3f5]">
              <i className="fa-solid fa-user-tag text-[19px]" />
            </button>

            <button
              type="button"
              onClick={handleEchoNow}
              className="h-11 rounded-[13px] bg-[#111827] px-5 text-[17px] font-black text-white active:scale-95"
            >
              Echo now
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="flex gap-3">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[15px] bg-[#eef1f5]">
              {story?.cover_url ? (
                <img src={story.cover_url} alt={story.title || 'Story cover'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#98a2b3]">
                  <i className="fa-regular fa-bookmark text-[22px]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 py-1">
              <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#f6a800]">Story</div>
              <h3 className="mt-1 line-clamp-2 text-[15px] font-black leading-5 text-[#111827]">
                {story?.title || 'Untitled Story'}
              </h3>
              <div className="mt-1 line-clamp-1 text-[12px] font-bold text-[#667085]">{authorName}</div>
              <div className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-[#98a2b3]">{story?.main_genre || 'Story'}</div>
            </div>
          </div>
        </div>

        {message ? (
          <div className="mt-3 rounded-[16px] bg-white px-4 py-3 text-[12px] font-bold text-[#667085] ring-1 ring-black/5">
            {message}
          </div>
        ) : null}

        <div className="mt-5 flex gap-4 overflow-x-auto pb-1">
          <FriendCircle name="Pha Mey" />
          <FriendCircle name="Moon" />
          <FriendCircle name="Reader" />
          <FriendCircle name="Friend" />
          <FriendCircle name="Author" />
        </div>

        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          <ShareCircle icon="fa-solid fa-link" label="Copy link" onClick={handleCopyLink} />
          <ShareCircle icon="fa-brands fa-telegram" label="Telegram" bg="bg-[#2aabee]" color="text-white" onClick={handleTelegram} />
          <ShareCircle icon="fa-brands fa-facebook-f" label="Facebook" bg="bg-[#1877f2]" color="text-white" onClick={handleFacebook} />
        </div>
      </section>
    </div>
  )
}
