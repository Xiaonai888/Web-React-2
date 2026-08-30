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
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPostDetailPage', {
  en: {
    postNotFound: 'Post not found',
    failedLoadPost: 'Failed to load post',
    back: 'Back',
    photo: 'Photo',
    post: 'Post',
    loading: 'Loading...',
    goBack: 'Go back',
  },
  km: {
    postNotFound: 'រកមិនឃើញ Post',
    failedLoadPost: 'មិនអាចផ្ទុក Post បានទេ',
    back: 'ត្រឡប់ក្រោយ',
    photo: 'រូបភាព',
    post: 'Post',
    loading: 'កំពុងផ្ទុក...',
    goBack: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    postNotFound: '未找到帖子',
    failedLoadPost: '无法加载帖子',
    back: '返回',
    photo: '图片',
    post: '帖子',
    loading: '加载中...',
    goBack: '返回',
  },
  ja: {
    postNotFound: '投稿が見つかりません',
    failedLoadPost: '投稿を読み込めませんでした',
    back: '戻る',
    photo: '写真',
    post: '投稿',
    loading: '読み込み中...',
    goBack: '戻る',
  },
  ko: {
    postNotFound: '게시물을 찾을 수 없습니다',
    failedLoadPost: '게시물을 불러오지 못했습니다',
    back: '뒤로 가기',
    photo: '사진',
    post: '게시물',
    loading: '불러오는 중...',
    goBack: '뒤로 가기',
  },
})

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
  const { t } = useDisplayTranslation()
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
              getDisplayText('readerPostDetailPage.postNotFound')
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
              getDisplayText('readerPostDetailPage.failedLoadPost')
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
    <div className="app-page min-h-screen">
      {(photoPostView || loading || error) ? (
        <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-[620px] items-center px-2">
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:opacity-60"
              aria-label={t('readerPostDetailPage.back')}
            >
              <i className="fa-solid fa-arrow-left text-[18px]" />
            </button>

            <div className="ml-1 text-[17px] font-semibold text-[var(--shadow-text-primary)]">
              {photoPostView
                ? t('readerPostDetailPage.photo')
                : t('readerPostDetailPage.post')}
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
          <div className="bg-[var(--shadow-bg-surface)] px-4 py-8 text-center text-[13px] text-[var(--shadow-text-secondary)] sm:rounded-[12px]">
            {t('readerPostDetailPage.loading')}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="bg-[var(--shadow-bg-surface)] px-4 py-8 text-center sm:rounded-[12px]">
            <div className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
              {error}
            </div>

            <button
              type="button"
              onClick={goBack}
              className="mt-4 text-[13px] font-semibold text-[#0866ff] dark:text-[#6ea8ff]"
            >
              {t('readerPostDetailPage.goBack')}
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
