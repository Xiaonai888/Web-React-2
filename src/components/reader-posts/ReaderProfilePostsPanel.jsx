import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderPostCard from './ReaderPostCard'

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

function ReaderProfileSetupSection({ user, onEditAvatar }) {
  const navigate = useNavigate()

  const items = [
    {
      key: 'name',
      complete: Boolean(String(user?.name || '').trim()),
      icon: 'fa-regular fa-user',
      title: 'Add your reader name',
      description: 'Choose how readers will know you.',
      pendingLabel: 'Add name',
      completeLabel: 'Edit name',
      action: () => navigate('/profile/edit'),
    },
    {
      key: 'avatar',
      complete: Boolean(user?.avatar_url),
      icon: 'fa-regular fa-circle-user',
      title: 'Add a profile photo',
      description: 'Help people recognize your profile.',
      pendingLabel: 'Add photo',
      completeLabel: 'Change photo',
      action: () => {
        if (onEditAvatar) {
          onEditAvatar()
          return
        }

        navigate('/profile/edit')
      },
    },
    {
      key: 'bio',
      complete: Boolean(String(user?.bio || '').trim()),
      icon: 'fa-regular fa-comment',
      title: 'Write your bio',
      description: 'Tell readers a little about yourself.',
      pendingLabel: 'Add bio',
      completeLabel: 'Edit bio',
      action: () => navigate('/profile/edit'),
    },
    {
      key: 'following',
      complete: Number(user?.following_count || 0) > 0,
      icon: 'fa-solid fa-user-group',
      title: 'Find your reading circle',
      description: 'Follow readers and authors you enjoy.',
      pendingLabel: 'Explore people',
      completeLabel: 'Find more',
      action: () => navigate('/profile/discover-people'),
    },
  ]

  const completedCount = items.filter((item) => item.complete).length

  if (completedCount === items.length) return null

  return (
    <section className="mt-3 bg-white px-4 pb-7 pt-5 md:rounded-[24px]">
      <div className="mb-4">
        <h2 className="text-[17px] font-semibold text-[#111827]">Build your reader space</h2>
        <div className="mt-1 text-[12px] font-normal text-[#8d94a1]">
          <span className="font-semibold text-[#111827]">{completedCount} of 4</span> completed
        </div>
      </div>

      <div className="share-profile-scroll flex snap-x gap-3 overflow-x-auto pb-3 pr-4">
        {items.map((item) => (
          <article
            key={item.key}
            className="flex min-h-[250px] w-[218px] shrink-0 snap-start flex-col items-center rounded-[22px] border border-[#eeeaf5] bg-white px-4 pb-4 pt-5 text-center shadow-[0_12px_30px_rgba(76,29,149,0.09)]"
          >
            <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[#7c3aed] text-[#7c3aed]">
              <i className={`${item.icon} text-[25px]`} />

              {item.complete ? (
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#16a36a] text-white shadow-sm">
                  <i className="fa-solid fa-check text-[12px]" />
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-[15px] font-semibold leading-5 text-[#111827]">
              {item.title}
            </h3>

            <p className="mt-1 min-h-[40px] text-[12px] font-normal leading-5 text-[#8d94a1]">
              {item.description}
            </p>

            <button
              type="button"
              onClick={item.action}
              className={`mt-auto min-h-10 rounded-[12px] px-5 text-[13px] font-semibold transition active:scale-[0.98] ${
                item.complete
                  ? 'bg-[#f1f2f4] text-[#111827]'
                  : 'bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white shadow-[0_8px_18px_rgba(124,58,237,0.24)]'
              }`}
            >
              {item.complete ? item.completeLabel : item.pendingLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function ReaderProfilePostsPanel({
  username = '',
  isOwnProfile = true,
  profileUser = null,
  onEditAvatar,
  onCountChange,
}) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let alive = true

    async function loadPosts() {
      const token = getAuthToken()
      const safeUsername = String(username || '').trim().replace(/^@+/, '')

      if (!token) {
        navigate('/login')
        return
      }

      if (!isOwnProfile && !safeUsername) {
        setPosts([])
        onCountChange?.(0)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setMessage('')

        const endpoint = isOwnProfile
          ? `${API_BASE_URL}/api/reader-posts/me?limit=30`
          : `${API_BASE_URL}/api/reader-posts/user/${encodeURIComponent(safeUsername)}?limit=30`

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load posts')
        }

        if (!alive) return

        const nextPosts = Array.isArray(data.posts) ? data.posts : []

        setPosts(nextPosts)
        onCountChange?.(nextPosts.length)
      } catch (error) {
        if (!alive) return

        setPosts([])
        onCountChange?.(0)
        setMessage(error.message || 'Failed to load posts')
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadPosts()

    return () => {
      alive = false
    }
  }, [isOwnProfile, navigate, onCountChange, username])

  function updatePost(nextPost) {
    if (!nextPost?.id) return

    setPosts((current) =>
      current.map((post) => (post.id === nextPost.id ? nextPost : post))
    )
  }

  function removePost(postId) {
    setPosts((current) => {
      const nextPosts = current.filter((post) => post.id !== postId)
      onCountChange?.(nextPosts.length)
      return nextPosts
    })
  }

  if (loading) {
    return (
      <section className="mt-2 space-y-2 md:mt-3 md:space-y-3">
        <div className="h-[140px] animate-pulse bg-white md:rounded-[24px]" />
        <div className="h-[140px] animate-pulse bg-white md:rounded-[24px]" />
      </section>
    )
  }

  if (message) {
    return (
      <section className="mt-2 bg-white px-5 py-8 text-center md:mt-3 md:rounded-[24px]">
        <div className="text-[13px] font-normal text-[#e5484d]">{message}</div>
      </section>
    )
  }

  if (!posts.length) {
    return (
      <>
        <section className="mt-2 bg-white px-5 py-10 text-center md:mt-3 md:rounded-[24px]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f2f4] text-[#111827]">
            <i className="fa-regular fa-pen-to-square text-[18px]" />
          </div>

          <h2 className="mt-3 text-[15px] font-semibold text-[#111827]">No posts yet</h2>

          <p className="mx-auto mt-1 max-w-[280px] text-[12px] font-normal leading-5 text-[#8d94a1]">
            {isOwnProfile
              ? 'Share your first thought and it will appear here.'
              : 'This reader has not shared any posts yet.'}
          </p>

          {isOwnProfile ? (
            <button
              type="button"
              onClick={() => navigate('/reader/post/create')}
              className="mt-5 h-10 rounded-[12px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(124,58,237,0.24)]"
            >
              Create a post
            </button>
          ) : null}
        </section>

        {isOwnProfile ? (
          <ReaderProfileSetupSection user={profileUser} onEditAvatar={onEditAvatar} />
        ) : null}
      </>
    )
  }

  return (
    <>
      <section className="mt-2 space-y-2 md:mt-3 md:space-y-3">
        {posts.map((post) => (
          <ReaderPostCard
            key={post.id}
            post={post}
            onUpdated={updatePost}
            onDeleted={removePost}
          />
        ))}
      </section>

      {isOwnProfile ? (
        <ReaderProfileSetupSection user={profileUser} onEditAvatar={onEditAvatar} />
      ) : null}
    </>
  )
}
