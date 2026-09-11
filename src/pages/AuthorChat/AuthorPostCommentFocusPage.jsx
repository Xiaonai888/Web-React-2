import {
  LoaderCircle,
  MessageCircle,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAuthorChatToken } from '../../services/authorChatApi'
import CommentSection from '../../components/comments/CommentSection'
import AuthorPostDetail from '../../components/author-posts/AuthorPostDetail'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPostCommentFocus', {
  "en": {
    "missingPostComment": "Post or comment is missing.",
    "failedLoadPost": "Failed to load post",
    "failedLoadComment": "Failed to load comment",
    "failedOpenComment": "Failed to open this comment",
    "authorPage": "Author Page",
    "close": "Close",
    "searchPage": "Search page",
    "profilePage": "Profile page",
    "commentUnavailable": "Comment unavailable"
  },
  "km": {
    "missingPostComment": "បាត់ Post ឬមតិយោបល់។",
    "failedLoadPost": "មិនអាចផ្ទុក Post បានទេ",
    "failedLoadComment": "មិនអាចផ្ទុកមតិយោបល់បានទេ",
    "failedOpenComment": "មិនអាចបើកមតិយោបល់នេះបានទេ",
    "authorPage": "Author Page",
    "close": "បិទ",
    "searchPage": "ស្វែងរកក្នុង Page",
    "profilePage": "ទំព័រ Profile",
    "commentUnavailable": "មិនអាចមើលមតិយោបល់បាន"
  },
  "zh": {
    "missingPostComment": "帖子或评论缺失。",
    "failedLoadPost": "无法加载帖子",
    "failedLoadComment": "无法加载评论",
    "failedOpenComment": "无法打开此评论",
    "authorPage": "Author Page",
    "close": "关闭",
    "searchPage": "搜索 Page",
    "profilePage": "个人主页",
    "commentUnavailable": "评论不可用"
  },
  "ja": {
    "missingPostComment": "投稿またはコメントが見つかりません。",
    "failedLoadPost": "投稿を読み込めませんでした",
    "failedLoadComment": "コメントを読み込めませんでした",
    "failedOpenComment": "このコメントを開けませんでした",
    "authorPage": "Author Page",
    "close": "閉じる",
    "searchPage": "Page を検索",
    "profilePage": "プロフィールページ",
    "commentUnavailable": "コメントを表示できません"
  },
  "ko": {
    "missingPostComment": "게시물 또는 댓글이 없습니다.",
    "failedLoadPost": "게시물을 불러오지 못했습니다",
    "failedLoadComment": "댓글을 불러오지 못했습니다",
    "failedOpenComment": "이 댓글을 열지 못했습니다",
    "authorPage": "Author Page",
    "close": "닫기",
    "searchPage": "Page 검색",
    "profilePage": "프로필 페이지",
    "commentUnavailable": "댓글을 사용할 수 없습니다"
  }
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
function Avatar({ src, name, size = 'h-10 w-10' }) {
  const [failed, setFailed] = useState(false)
  const letter =
    String(name || 'S').trim().charAt(0).toUpperCase() || 'S'

  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] font-bold text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

export default function AuthorPostCommentFocusPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const { postId, commentId } = useParams()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      if (!postId || !commentId) {
        setError(getDisplayText('authorPostCommentFocus.missingPostComment'))
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const token = getAuthorChatToken()
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {}

        const [postResponse, commentResponse] =
          await Promise.all([
            fetch(
              `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}`,
              { headers }
            ),
            fetch(
              `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`,
              { headers }
            ),
          ])

        const [postData, commentData] =
          await Promise.all([
            postResponse.json().catch(() => ({})),
            commentResponse.json().catch(() => ({})),
          ])

        if (!postResponse.ok || postData.ok === false) {
          throw new Error(
            postData.message || getDisplayText('authorPostCommentFocus.failedLoadPost')
          )
        }

        if (
          !commentResponse.ok ||
          commentData.ok === false
        ) {
          throw new Error(
            commentData.message || getDisplayText('authorPostCommentFocus.failedLoadComment')
          )
        }

        if (ignore) return

        setPost(postData.post || null)
        setComment(commentData.comment || null)

        
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError.message ||
              getDisplayText('authorPostCommentFocus.failedOpenComment')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [commentId, postId])

  useEffect(() => {
    if (!comment?.id) return

    document
      .getElementById(`comment-${comment.id}`)
      ?.scrollIntoView({ block: 'center', behavior: 'auto' })
  }, [comment?.id])

  const page = post?.author_page || {}
  const pageName =
    page.page_name ||
    page.page_username ||
    getDisplayText('authorPostCommentFocus.authorPage')
  const pageUsername = page.page_username || ''

  const profilePath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(pageUsername)}`
        : '/author/page',
    [pageUsername]
  )

  const searchPath = useMemo(
    () =>
      pageUsername
        ? `/author/page/${encodeURIComponent(pageUsername)}/search`
        : '/author/page',
    [pageUsername]
  )

  return (
    <div className="min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-50 bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-[56px] max-w-[680px] items-center gap-2 px-3 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={getDisplayText('authorPostCommentFocus.close')}
          >
            <X size={27} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => navigate(profilePath)}
            className="min-w-0 flex-1 truncate text-center text-[17px] font-bold"
          >
            {pageName}
          </button>

          <button
            type="button"
            onClick={() => navigate(searchPath)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
            aria-label={getDisplayText('authorPostCommentFocus.searchPage')}
          >
            <Search size={25} strokeWidth={2.1} />
          </button>

          <button
            type="button"
            onClick={() => navigate(profilePath)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            aria-label={getDisplayText('authorPostCommentFocus.profilePage')}
          >
            <Avatar
              src={page.avatar_url}
              name={pageName}
              size="h-8 w-8"
            />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[680px]">
        {loading ? (
          <div className="flex min-h-[60dvh] items-center justify-center bg-[var(--shadow-bg-surface)] text-[#7c3aed]">
            <LoaderCircle
              size={30}
              className="animate-spin"
            />
          </div>
        ) : error ? (
          <div className="bg-[var(--shadow-bg-surface)] px-5 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed]">
              <MessageCircle size={26} />
            </div>
            <h1 className="mt-4 text-[16px] font-bold">
              {getDisplayText('authorPostCommentFocus.commentUnavailable')}
            </h1>
            <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
              {error}
            </p>
          </div>
        ) : post && comment ? (
          <>
            <AuthorPostDetail
              post={post}
              commentId={comment.id}
            />

            <section className="bg-[var(--shadow-bg-surface)] pt-3">
              <CommentSection
                targetType="author_post"
                targetId={post.id}
                variant="page"
                story={{ ...post, author_page: page }}
                onCommentsChange={() => {
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById(`comment-${comment.id}`)
                      ?.scrollIntoView({
                        block: 'center',
                        behavior: 'auto',
                      })
                  })
                }}
              />
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
