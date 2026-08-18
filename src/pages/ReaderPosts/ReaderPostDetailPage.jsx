import {
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import ReaderPostCard from '../../components/reader-posts/ReaderPostCard'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

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

export default function ReaderPostDetailPage() {
  const navigate = useNavigate()
  const { postId } = useParams()
  const [searchParams] = useSearchParams()
  const rawPhotoIndex =
    searchParams.get('photo')
  const photoPostView =
    rawPhotoIndex !== null
  const selectedPhotoIndex =
    Math.max(
      0,
      Number.isFinite(
        Number(rawPhotoIndex)
      )
        ? Math.floor(
            Number(rawPhotoIndex)
          )
        : 0
    )
  const [post, setPost] = useState(null)
  const [loading, setLoading] =
    useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    const controller =
      new AbortController()
    let ignore = false

    if (!token) {
      navigate('/login', {
        replace: true,
      })
      return () => {
        controller.abort()
      }
    }

    async function loadPost() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(
            postId || ''
          )}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false ||
          !data.post
        ) {
          throw new Error(
            data.message ||
              'Post not found'
          )
        }

        if (!ignore) {
          setPost(data.post)
        }
      } catch (loadError) {
        if (
          !ignore &&
          loadError?.name !==
            'AbortError'
        ) {
          setError(
            loadError.message ||
              'Failed to load post'
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadPost()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [navigate, postId])

  function goBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/discover', {
      replace: true,
    })
  }

  function handleDeleted() {
    navigate('/discover', {
      replace: true,
    })
  }

  function handleFollowChanged(
    userId,
    isFollowing
  ) {
    setPost((current) => {
      if (
        !current ||
        String(current.user_id || '') !==
          String(userId || '')
      ) {
        return current
      }

      return {
        ...current,
        user: {
          ...(current.user || {}),
          is_following:
            Boolean(isFollowing),
        },
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa]">
      {(photoPostView || loading || error) ? (
        <header className="sticky top-0 z-50 border-b border-[#eef0f4] bg-white">
          <div className="mx-auto flex h-14 w-full max-w-[620px] items-center px-2">
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center text-[#111827] active:opacity-60"
              aria-label="Back"
            >
              <i className="fa-solid fa-arrow-left text-[18px]" />
            </button>

            <div className="ml-1 text-[17px] font-semibold text-[#111827]">
              {photoPostView
                ? 'Photo'
                : 'Post'}
            </div>
          </div>
        </header>
      ) : null}

      <main
        className={
          photoPostView || loading || error
            ? 'mx-auto w-full max-w-[620px] py-1 sm:px-3 sm:py-3'
            : 'w-full'
        }
      >
        {loading ? (
          <div className="bg-white px-4 py-8 text-center text-[13px] text-[#8b93a1] sm:rounded-[12px]">
            Loading...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="bg-white px-4 py-8 text-center sm:rounded-[12px]">
            <div className="text-[14px] font-semibold text-[#111827]">
              {error}
            </div>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 text-[13px] font-semibold text-[#0866ff]"
            >
              Go back
            </button>
          </div>
        ) : null}

        {!loading && !error && post ? (
          <ReaderPostCard
            post={post}
            fullPostView={
              !photoPostView
            }
            photoPostView={
              photoPostView
            }
            selectedPhotoIndex={
              selectedPhotoIndex
            }
            onUpdated={setPost}
            onDeleted={handleDeleted}
            onHidden={handleDeleted}
            onFollowChanged={
              handleFollowChanged
            }
            onFullPostClose={goBack}
          />
        ) : null}
      </main>
    </div>
  )
}
