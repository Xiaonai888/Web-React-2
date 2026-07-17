import {
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ReaderPostCard from './ReaderPostCard'

const API_BASE_URL =
  'https://shadow-backend-kucw.onrender.com'

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

export default function ReaderProfilePostsPanel({
  onCountChange,
}) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] =
    useState(true)
  const [message, setMessage] =
    useState('')

  useEffect(() => {
    let alive = true

    async function loadPosts() {
      try {
        setLoading(true)
        setMessage('')

        const response = await fetch(
          `${API_BASE_URL}/api/reader-posts/me?limit=30`,
          {
            headers: {
              Authorization:
                `Bearer ${getAuthToken()}`,
            },
            cache: 'no-store',
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
              'Failed to load posts'
          )
        }

        if (!alive) return

        const nextPosts = Array.isArray(
          data.posts
        )
          ? data.posts
          : []

        setPosts(nextPosts)
        onCountChange?.(
          nextPosts.length
        )
      } catch (error) {
        if (!alive) return

        setPosts([])
        onCountChange?.(0)
        setMessage(
          error.message ||
            'Failed to load posts'
        )
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      alive = false
    }
  }, [onCountChange])

  function updatePost(nextPost) {
    if (!nextPost?.id) return

    setPosts((current) =>
      current.map((post) =>
        post.id === nextPost.id
          ? nextPost
          : post
      )
    )
  }

  function removePost(postId) {
    setPosts((current) => {
      const nextPosts = current.filter(
        (post) => post.id !== postId
      )

      onCountChange?.(
        nextPosts.length
      )

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
        <div className="text-[13px] font-normal text-[#e5484d]">
          {message}
        </div>
      </section>
    )
  }

  if (!posts.length) {
    return (
      <section className="mt-2 bg-white px-5 py-10 text-center md:mt-3 md:rounded-[24px]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f2f4] text-[#111827]">
          <i className="fa-regular fa-pen-to-square text-[18px]" />
        </div>

        <h2 className="mt-3 text-[15px] font-semibold text-[#111827]">
          No posts yet
        </h2>

        <p className="mx-auto mt-1 max-w-[280px] text-[12px] font-normal leading-5 text-[#8d94a1]">
          Share your first thought and it will appear here.
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/reader/post/create')
          }
          className="mt-5 h-10 rounded-full bg-[#111827] px-5 text-[13px] font-normal text-white"
        >
          Create a post
        </button>
      </section>
    )
  }

  return (
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
  )
}
