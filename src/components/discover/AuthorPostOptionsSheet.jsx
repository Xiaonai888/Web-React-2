import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const STORAGE_KEYS = {
  interested: 'shadow_interested_author_posts',
  hiddenPosts: 'shadow_hidden_author_posts',
  savedPosts: 'shadow_saved_author_posts',
  favoriteAuthors: 'shadow_favorite_author_pages',
  snoozedAuthors: 'shadow_snoozed_author_pages',
  unfollowedAuthors: 'shadow_unfollowed_author_pages',
}

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function readObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value)
      ? value
      : {}
  } catch {
    return {}
  }
}

function writeObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function hasId(items, id) {
  return items.some((item) =>
    String(typeof item === 'object' ? item?.id : item) === String(id)
  )
}

function addId(items, id) {
  return hasId(items, id) ? items : [...items, id]
}

function removeId(items, id) {
  return items.filter((item) => String(item) !== String(id))
}

function getSavedPostSnapshot(post) {
  return {
    id: post.id,
    content: post.content || '',
    image_urls: Array.isArray(post.image_urls) ? post.image_urls : [],
    created_at: post.created_at || null,
    saved_at: new Date().toISOString(),
    author_page: {
      id: post.author_page?.id || null,
      page_name: post.author_page?.page_name || '',
      page_username: post.author_page?.page_username || '',
      avatar_url: post.author_page?.avatar_url || '',
    },
  }
}

export function filterAuthorPostsByLocalPreferences(posts = []) {
  const hiddenPosts = new Set(
    readArray(STORAGE_KEYS.hiddenPosts).map(String)
  )
  const snoozedAuthors = readObject(STORAGE_KEYS.snoozedAuthors)
  const now = Date.now()

  return posts.filter((post) => {
    if (!post?.id || hiddenPosts.has(String(post.id))) {
      return false
    }

    const authorId = String(post.author_page?.id || '')
    const snoozedUntil = Number(snoozedAuthors[authorId] || 0)

    return !authorId || !snoozedUntil || snoozedUntil <= now
  })
}

function MenuIcon({ type }) {
  const icons = {
    interested: 'fa-solid fa-circle-plus',
    notInterested: 'fa-solid fa-circle-minus',
    save: 'fa-regular fa-bookmark',
    saved: 'fa-solid fa-bookmark',
    report: 'fa-regular fa-flag',
    controls: 'fa-solid fa-sliders',
    favorite: 'fa-regular fa-star',
    favoriteActive: 'fa-solid fa-star',
    snooze: 'fa-regular fa-clock',
    unfollow: 'fa-solid fa-user-minus',
    reconnect: 'fa-solid fa-user-plus',
  }

  return (
    <i
      className={`${icons[type] || 'fa-regular fa-circle'} text-[22px]`}
      aria-hidden="true"
    />
  )
}

function MenuButton({
  icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  trailing = null,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-4 px-4 py-3.5 text-left active:bg-black/[0.04] disabled:opacity-55 ${
        danger ? 'text-red-600' : 'text-[#111827]'
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <MenuIcon type={icon} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-5">
          {title}
        </span>

        {subtitle ? (
          <span className="mt-0.5 block text-[11px] font-normal leading-4 text-gray-400">
            {subtitle}
          </span>
        ) : null}
      </span>

      {trailing}
    </button>
  )
}

export default function AuthorPostOptionsSheet({
  open,
  post,
  onClose,
  onHidePost,
  onHideAuthorPosts,
  onFollowChanged,
}) {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('quick')
  const [saved, setSaved] = useState(false)
  const [interested, setInterested] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [unfollowed, setUnfollowed] = useState(false)
  const [busyAction, setBusyAction] = useState('')
  const [message, setMessage] = useState('')

  const author = post?.author_page || {}
  const postId = post?.id || ''
  const authorId = author.id || ''
  const pageUsername = author.page_username || ''
  const authorName = author.page_name || 'Author'

  const initial = useMemo(
    () => authorName.trim().slice(0, 1).toUpperCase() || 'A',
    [authorName]
  )

  useEffect(() => {
    if (!open || !postId) return

    setScreen('quick')
    setMessage('')
    setBusyAction('')
    setInterested(hasId(readArray(STORAGE_KEYS.interested), postId))
    setSaved(hasId(readArray(STORAGE_KEYS.savedPosts), postId))
    setFavorite(
      hasId(readArray(STORAGE_KEYS.favoriteAuthors), authorId)
    )
    setUnfollowed(
      hasId(readArray(STORAGE_KEYS.unfollowedAuthors), pageUsername)
    )
  }, [authorId, open, pageUsername, postId])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (screen === 'preferences') {
          setScreen('quick')
        } else {
          onClose?.()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open, screen])

  if (!open || !post) return null

  function chooseInterest(nextInterested) {
    const interestedItems = readArray(STORAGE_KEYS.interested)
    const hiddenItems = readArray(STORAGE_KEYS.hiddenPosts)

    if (nextInterested) {
      writeArray(
        STORAGE_KEYS.interested,
        addId(interestedItems, postId)
      )
      writeArray(
        STORAGE_KEYS.hiddenPosts,
        removeId(hiddenItems, postId)
      )
      setInterested(true)
      setMessage('We will show you more posts like this.')
      return
    }

    writeArray(
      STORAGE_KEYS.interested,
      removeId(interestedItems, postId)
    )
    writeArray(
      STORAGE_KEYS.hiddenPosts,
      addId(hiddenItems, postId)
    )
    setInterested(false)
    onHidePost?.(postId)
    onClose?.()
  }

  function toggleSaved() {
    const items = readArray(STORAGE_KEYS.savedPosts)
    const nextSaved = !hasId(items, postId)

    if (nextSaved) {
      writeArray(
        STORAGE_KEYS.savedPosts,
        [...items, getSavedPostSnapshot(post)]
      )
    } else {
      writeArray(
        STORAGE_KEYS.savedPosts,
        items.filter((item) => String(item?.id) !== String(postId))
      )
    }

    setSaved(nextSaved)
    setMessage(nextSaved ? 'Post saved.' : 'Post removed from saved.')
  }

  function openReport() {
    onClose?.()
    navigate(`/report/author_post/${encodeURIComponent(postId)}`)
  }

  function toggleFavorite() {
    const items = readArray(STORAGE_KEYS.favoriteAuthors)
    const nextFavorite = !hasId(items, authorId)

    writeArray(
      STORAGE_KEYS.favoriteAuthors,
      nextFavorite ? addId(items, authorId) : removeId(items, authorId)
    )

    setFavorite(nextFavorite)
    setMessage(
      nextFavorite
        ? `${authorName} added to Favorites.`
        : `${authorName} removed from Favorites.`
    )
  }

  function snoozeAuthor() {
    const items = readObject(STORAGE_KEYS.snoozedAuthors)
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000

    writeObject(STORAGE_KEYS.snoozedAuthors, {
      ...items,
      [String(authorId)]: expiresAt,
    })

    onHideAuthorPosts?.(authorId)
    onClose?.()
  }

  async function changeFollowState(nextFollowing) {
    const token = getReaderToken()

    if (!token) {
      onClose?.()
      navigate('/login')
      return
    }

    if (!pageUsername || busyAction) return

    try {
      setBusyAction(nextFollowing ? 'reconnect' : 'unfollow')
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
          pageUsername
        )}/follow`,
        {
          method: nextFollowing ? 'POST' : 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
            (nextFollowing
              ? 'Failed to reconnect author'
              : 'Failed to unfollow author')
        )
      }

      const items = readArray(STORAGE_KEYS.unfollowedAuthors)

      writeArray(
        STORAGE_KEYS.unfollowedAuthors,
        nextFollowing
          ? removeId(items, pageUsername)
          : addId(items, pageUsername)
      )

      setUnfollowed(!nextFollowing)
      onFollowChanged?.(authorId, nextFollowing)
      setMessage(
        nextFollowing
          ? `You reconnected with ${authorName}.`
          : `You unfollowed ${authorName}.`
      )
    } catch (error) {
      setMessage(
        error.message ||
          (nextFollowing
            ? 'Failed to reconnect author'
            : 'Failed to unfollow author')
      )
    } finally {
      setBusyAction('')
    }
  }

  return (
    <div className="fixed inset-0 z-[200000] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close post options"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section className="relative max-h-[88dvh] w-full max-w-[620px] overflow-y-auto rounded-t-[24px] bg-white px-3 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-gray-400" />

        {screen === 'quick' ? (
          <>
            <div className="mb-3 rounded-[16px] bg-[#f3f4f7]">
              <MenuButton
                icon="interested"
                title="Interested"
                subtitle="Show more posts like this"
                onClick={() => chooseInterest(true)}
                trailing={
                  interested ? (
                    <i className="fa-solid fa-check text-[14px] text-[#1677ff]" />
                  ) : null
                }
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <MenuButton
                icon="notInterested"
                title="Not interested"
                subtitle="Hide this post and show fewer like it"
                onClick={() => chooseInterest(false)}
              />
            </div>

            <div className="mb-3 rounded-[16px] bg-[#f3f4f7]">
              <MenuButton
                icon={saved ? 'saved' : 'save'}
                title={saved ? 'Remove from saved' : 'Save post'}
                subtitle="Keep this post for later"
                onClick={toggleSaved}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <MenuButton
                icon="report"
                title="Report post"
                subtitle="Tell Shadow about a problem"
                onClick={openReport}
              />
            </div>

            <div className="rounded-[16px] bg-[#f3f4f7]">
              <MenuButton
                icon="controls"
                title="Manage your feed"
                subtitle="Favorites, snooze, unfollow, and reconnect"
                onClick={() => {
                  setMessage('')
                  setScreen('preferences')
                }}
                trailing={
                  <i className="fa-solid fa-chevron-right text-[15px] text-gray-500" />
                }
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3 px-1">
              <button
                type="button"
                onClick={() => {
                  setMessage('')
                  setScreen('quick')
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-gray-100"
                aria-label="Back"
              >
                <i className="fa-solid fa-chevron-left text-[16px]" />
              </button>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[13px] font-semibold text-white">
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={authorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initial
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate text-[17px] font-semibold text-[#111827]">
                  Content preferences
                </div>
                <div className="mt-0.5 truncate text-[11px] font-normal text-gray-400">
                  Manage posts from {authorName}
                </div>
              </div>
            </div>

            <div className="mb-2 px-2 text-[13px] font-semibold text-[#111827]">
              What you see
            </div>

            <div className="mb-5 rounded-[16px] bg-[#f3f4f7]">
              <MenuButton
                icon="interested"
                title="Show more like this"
                subtitle="Use this post to improve your Discover feed"
                onClick={() => chooseInterest(true)}
                trailing={
                  interested ? (
                    <i className="fa-solid fa-check text-[14px] text-[#1677ff]" />
                  ) : null
                }
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <MenuButton
                icon="notInterested"
                title="Show less like this"
                subtitle="Hide this post from Discover"
                onClick={() => chooseInterest(false)}
              />
            </div>

            <div className="mb-2 px-2 text-[13px] font-semibold text-[#111827]">
              Who you see
            </div>

            <div className="rounded-[16px] bg-[#f3f4f7]">
              <MenuButton
                icon={favorite ? 'favoriteActive' : 'favorite'}
                title={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                subtitle="Prioritize this author in Discover"
                onClick={toggleFavorite}
                trailing={
                  favorite ? (
                    <i className="fa-solid fa-check text-[14px] text-[#1677ff]" />
                  ) : null
                }
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <MenuButton
                icon="snooze"
                title="Snooze for 30 days"
                subtitle="Temporarily hide posts from this author"
                onClick={snoozeAuthor}
              />

              <div className="mx-4 h-px bg-black/[0.06]" />

              <MenuButton
                icon={unfollowed ? 'reconnect' : 'unfollow'}
                title={unfollowed ? 'Reconnect' : 'Unfollow'}
                subtitle={
                  unfollowed
                    ? `Follow ${authorName} again`
                    : `Stop seeing new posts from ${authorName}`
                }
                onClick={() => changeFollowState(unfollowed)}
                disabled={Boolean(busyAction)}
                danger={!unfollowed}
              />
            </div>
          </>
        )}

        {message ? (
          <div className="mt-3 rounded-[12px] bg-[#eef2ff] px-3 py-2.5 text-center text-[11px] font-semibold leading-4 text-[#3730a3]">
            {message}
          </div>
        ) : null}
      </section>
    </div>
  )
}
