import { recordAuthorPostClick } from '../../services/authorPostInsightsApi'
import CommentSection from '../../components/comments/CommentSection'
import PublicPostDetailView from '../../components/social/posts/PublicPostDetailView'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import CommentsModal from '../../components/story-detail/CommentsModal'
import AuthorPostEchoAction from '../../components/author-posts/AuthorPostEchoAction'
import AuthorPageShareSheet from '../../components/AuthorPageShareSheet'
import ReactionAction from '../../components/social/reactions/ReactionAction'
import ReactionSummary from '../../components/social/reactions/ReactionSummary'
import { ProfessionalSinglePostImage } from '../../components/common/ProfessionalPostContent'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPostDetailPage', {
  en: {
    justNow: 'Just now', minutesAgo: '{{count}}m', hoursAgo: '{{count}}h', daysAgo: '{{count}}d', author: 'Author', authorPostAlt: '{{name}} post', loginRequired: 'Please login first', reactionFailed: 'Failed to update reaction', postNotFound: 'Post not found', loadPostFailed: 'Failed to load post', captionSaveFailed: 'Failed to save caption.', captionSaved: 'Caption saved.', captionRemoved: 'Caption removed.', altSaveFailed: 'Failed to save alt text.', altSaved: 'Alt text saved.', altRemoved: 'Alt text removed.', postNeedsContent: 'This post needs text or a photo. Delete the post instead.', photoDeleteFailed: 'Failed to delete photo.', photoDeleted: 'Photo deleted.', photoDownloadFailed: 'Could not download photo', photoSaved: 'Photo saved.', photoOpened: 'Photo opened for saving.', followFailed: 'Failed to follow author', like: 'Like', closeFullscreenPhoto: 'Close fullscreen photo', photoOptions: 'Photo options', photoPosition: '{{current}} of {{total}}', commentsCount: '{{count}} comments', sharesCount: '{{count}} shares', boostSoon: 'Boost Post is coming soon.', boostPost: 'Boost Post', comment: 'Comment', share: 'Share', editCaption: 'Edit caption', deletePhoto: 'Delete photo', saveToPhone: 'Save to phone', shareExternal: 'Share external', reportPhoto: 'Report photo', editAltText: 'Edit alt text', photoNumber: 'Photo {{count}}', captionPlaceholder: 'Write a caption for this photo...', cancel: 'Cancel', saving: 'Saving...', save: 'Save', altHelp: 'Describe what is shown in this photo for accessibility.', altPlaceholder: 'Describe this photo...', deletePhotoTitle: 'Delete photo?', deletePhotoDescription: 'This photo will be permanently removed from this post.', deleting: 'Deleting...', delete: 'Delete', sharePhoto: 'Share Photo', photoFromAuthor: '{{name}} photo', sharePhotoText: 'View this photo from {{name}} on Shadow.', photoLinkCopied: 'Photo link copied.', authorPostComments: 'Author post comments',
  },
  km: {
    justNow: 'មុននេះបន្តិច', minutesAgo: '{{count}} នាទី', hoursAgo: '{{count}} ម៉ោង', daysAgo: '{{count}} ថ្ងៃ', author: 'អ្នកនិពន្ធ', authorPostAlt: 'Post របស់ {{name}}', loginRequired: 'សូមចូលគណនីជាមុន', reactionFailed: 'មិនអាចកែ Reaction បានទេ', postNotFound: 'រកមិនឃើញ Post', loadPostFailed: 'មិនអាចផ្ទុក Post បានទេ', captionSaveFailed: 'មិនអាចរក្សាទុក Caption បានទេ។', captionSaved: 'បានរក្សាទុក Caption។', captionRemoved: 'បានលុប Caption។', altSaveFailed: 'មិនអាចរក្សាទុក Alt text បានទេ។', altSaved: 'បានរក្សាទុក Alt text។', altRemoved: 'បានលុប Alt text។', postNeedsContent: 'Post នេះត្រូវមានអត្ថបទ ឬរូបភាព។ សូមលុប Post ជំនួសវិញ។', photoDeleteFailed: 'មិនអាចលុបរូបភាពបានទេ។', photoDeleted: 'បានលុបរូបភាព។', photoDownloadFailed: 'មិនអាចទាញយករូបភាពបានទេ', photoSaved: 'បានរក្សាទុករូបភាព។', photoOpened: 'បានបើករូបភាពសម្រាប់រក្សាទុក។', followFailed: 'មិនអាច Follow អ្នកនិពន្ធបានទេ', like: 'ចូលចិត្ត', closeFullscreenPhoto: 'បិទរូបភាពពេញអេក្រង់', photoOptions: 'ជម្រើសរូបភាព', photoPosition: '{{current}} នៃ {{total}}', commentsCount: '{{count}} មតិយោបល់', sharesCount: '{{count}} Shares', boostSoon: 'Boost Post នឹងមកដល់ឆាប់ៗនេះ។', boostPost: 'Boost Post', comment: 'មតិយោបល់', share: 'ចែករំលែក', editCaption: 'កែ Caption', deletePhoto: 'លុបរូបភាព', saveToPhone: 'រក្សាទុកក្នុងទូរសព្ទ', shareExternal: 'ចែករំលែកខាងក្រៅ', reportPhoto: 'រាយការណ៍រូបភាព', editAltText: 'កែ Alt text', photoNumber: 'រូបភាព {{count}}', captionPlaceholder: 'សរសេរ Caption សម្រាប់រូបភាពនេះ...', cancel: 'បោះបង់', saving: 'កំពុងរក្សាទុក...', save: 'រក្សាទុក', altHelp: 'ពិពណ៌នាអ្វីដែលមានក្នុងរូបភាពនេះសម្រាប់ Accessibility។', altPlaceholder: 'ពិពណ៌នារូបភាពនេះ...', deletePhotoTitle: 'លុបរូបភាព?', deletePhotoDescription: 'រូបភាពនេះនឹងត្រូវលុបចេញពី Post នេះជាអចិន្ត្រៃយ៍។', deleting: 'កំពុងលុប...', delete: 'លុប', sharePhoto: 'ចែករំលែករូបភាព', photoFromAuthor: 'រូបភាពរបស់ {{name}}', sharePhotoText: 'មើលរូបភាពនេះពី {{name}} នៅលើ Shadow។', photoLinkCopied: 'បានចម្លងតំណរូបភាព។', authorPostComments: 'មតិយោបល់លើ Post អ្នកនិពន្ធ',
  },
  zh: {
    justNow: '刚刚', minutesAgo: '{{count}} 分钟', hoursAgo: '{{count}} 小时', daysAgo: '{{count}} 天', author: '作者', authorPostAlt: '{{name}} 的帖子', loginRequired: '请先登录', reactionFailed: '更新 Reaction 失败', postNotFound: '未找到帖子', loadPostFailed: '加载帖子失败', captionSaveFailed: '保存说明失败。', captionSaved: '说明已保存。', captionRemoved: '说明已移除。', altSaveFailed: '保存替代文字失败。', altSaved: '替代文字已保存。', altRemoved: '替代文字已移除。', postNeedsContent: '帖子需要文字或图片，请改为删除整个帖子。', photoDeleteFailed: '删除图片失败。', photoDeleted: '图片已删除。', photoDownloadFailed: '无法下载图片', photoSaved: '图片已保存。', photoOpened: '已打开图片以便保存。', followFailed: '关注作者失败', like: '赞', closeFullscreenPhoto: '关闭全屏图片', photoOptions: '图片选项', photoPosition: '{{current}} / {{total}}', commentsCount: '{{count}} 条评论', sharesCount: '{{count}} 次分享', boostSoon: 'Boost Post 即将推出。', boostPost: 'Boost Post', comment: '评论', share: '分享', editCaption: '编辑说明', deletePhoto: '删除图片', saveToPhone: '保存到手机', shareExternal: '外部分享', reportPhoto: '举报图片', editAltText: '编辑替代文字', photoNumber: '图片 {{count}}', captionPlaceholder: '为这张图片写说明...', cancel: '取消', saving: '保存中...', save: '保存', altHelp: '描述图片内容以提升无障碍体验。', altPlaceholder: '描述这张图片...', deletePhotoTitle: '删除图片？', deletePhotoDescription: '这张图片将从该帖子中永久删除。', deleting: '删除中...', delete: '删除', sharePhoto: '分享图片', photoFromAuthor: '{{name}} 的图片', sharePhotoText: '在 Shadow 查看 {{name}} 的这张图片。', photoLinkCopied: '图片链接已复制。', authorPostComments: '作者帖子评论',
  },
  ja: {
    justNow: 'たった今', minutesAgo: '{{count}}分', hoursAgo: '{{count}}時間', daysAgo: '{{count}}日', author: '作者', authorPostAlt: '{{name}} の投稿', loginRequired: '先にログインしてください', reactionFailed: 'リアクションを更新できませんでした', postNotFound: '投稿が見つかりません', loadPostFailed: '投稿を読み込めませんでした', captionSaveFailed: 'キャプションを保存できませんでした。', captionSaved: 'キャプションを保存しました。', captionRemoved: 'キャプションを削除しました。', altSaveFailed: '代替テキストを保存できませんでした。', altSaved: '代替テキストを保存しました。', altRemoved: '代替テキストを削除しました。', postNeedsContent: '投稿にはテキストまたは写真が必要です。代わりに投稿を削除してください。', photoDeleteFailed: '写真を削除できませんでした。', photoDeleted: '写真を削除しました。', photoDownloadFailed: '写真をダウンロードできませんでした', photoSaved: '写真を保存しました。', photoOpened: '保存用に写真を開きました。', followFailed: '作者をフォローできませんでした', like: 'いいね', closeFullscreenPhoto: '全画面写真を閉じる', photoOptions: '写真オプション', photoPosition: '{{current}} / {{total}}', commentsCount: '{{count}} コメント', sharesCount: '{{count}} シェア', boostSoon: 'Boost Post は近日公開予定です。', boostPost: 'Boost Post', comment: 'コメント', share: 'シェア', editCaption: 'キャプションを編集', deletePhoto: '写真を削除', saveToPhone: '端末に保存', shareExternal: '外部に共有', reportPhoto: '写真を報告', editAltText: '代替テキストを編集', photoNumber: '写真 {{count}}', captionPlaceholder: 'この写真のキャプションを書く...', cancel: 'キャンセル', saving: '保存中...', save: '保存', altHelp: 'アクセシビリティのため写真の内容を説明してください。', altPlaceholder: 'この写真を説明...', deletePhotoTitle: '写真を削除しますか？', deletePhotoDescription: 'この写真は投稿から完全に削除されます。', deleting: '削除中...', delete: '削除', sharePhoto: '写真を共有', photoFromAuthor: '{{name}} の写真', sharePhotoText: 'Shadow で {{name}} のこの写真を見る。', photoLinkCopied: '写真リンクをコピーしました。', authorPostComments: '作者投稿のコメント',
  },
  ko: {
    justNow: '방금', minutesAgo: '{{count}}분', hoursAgo: '{{count}}시간', daysAgo: '{{count}}일', author: '작가', authorPostAlt: '{{name}} 게시물', loginRequired: '먼저 로그인해 주세요', reactionFailed: 'Reaction을 업데이트하지 못했습니다', postNotFound: '게시물을 찾을 수 없습니다', loadPostFailed: '게시물을 불러오지 못했습니다', captionSaveFailed: '캡션을 저장하지 못했습니다.', captionSaved: '캡션을 저장했습니다.', captionRemoved: '캡션을 삭제했습니다.', altSaveFailed: '대체 텍스트를 저장하지 못했습니다.', altSaved: '대체 텍스트를 저장했습니다.', altRemoved: '대체 텍스트를 삭제했습니다.', postNeedsContent: '게시물에는 텍스트나 사진이 필요합니다. 대신 게시물을 삭제해 주세요.', photoDeleteFailed: '사진을 삭제하지 못했습니다.', photoDeleted: '사진을 삭제했습니다.', photoDownloadFailed: '사진을 다운로드하지 못했습니다', photoSaved: '사진을 저장했습니다.', photoOpened: '저장을 위해 사진을 열었습니다.', followFailed: '작가를 팔로우하지 못했습니다', like: '좋아요', closeFullscreenPhoto: '전체 화면 사진 닫기', photoOptions: '사진 옵션', photoPosition: '{{current}} / {{total}}', commentsCount: '{{count}}개 댓글', sharesCount: '{{count}}회 공유', boostSoon: 'Boost Post 기능이 곧 제공됩니다.', boostPost: 'Boost Post', comment: '댓글', share: '공유', editCaption: '캡션 편집', deletePhoto: '사진 삭제', saveToPhone: '휴대폰에 저장', shareExternal: '외부 공유', reportPhoto: '사진 신고', editAltText: '대체 텍스트 편집', photoNumber: '사진 {{count}}', captionPlaceholder: '이 사진의 캡션을 작성하세요...', cancel: '취소', saving: '저장 중...', save: '저장', altHelp: '접근성을 위해 사진에 보이는 내용을 설명하세요.', altPlaceholder: '이 사진을 설명하세요...', deletePhotoTitle: '사진을 삭제할까요?', deletePhotoDescription: '이 사진은 게시물에서 영구적으로 삭제됩니다.', deleting: '삭제 중...', delete: '삭제', sharePhoto: '사진 공유', photoFromAuthor: '{{name}} 사진', sharePhotoText: 'Shadow에서 {{name}}의 이 사진을 확인하세요.', photoLinkCopied: '사진 링크를 복사했습니다.', authorPostComments: '작가 게시물 댓글',
  },
})

const DISPLAY_LOCALES = { km: 'km-KH', en: 'en-US', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

function getDisplayLocale() {
  return DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
}

function formatDisplayNumber(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(getDisplayLocale()).format(Number.isFinite(number) ? number : 0)
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')



const POST_TOKEN_PATTERN =
  /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN =
  /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN =
  /^#[\p{L}\p{N}\p{M}_]+$/u
const MAX_PHOTO_CAPTION_LENGTH = 2000
const MAX_PHOTO_ALT_TEXT_LENGTH = 500

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

function formatPostTime(value) {
  const timestamp = new Date(value || 0).getTime()
  if (!timestamp) return getDisplayText('authorPostDetailPage.justNow')

  const difference = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return getDisplayText('authorPostDetailPage.justNow')
  if (minutes < 60) return getDisplayText('authorPostDetailPage.minutesAgo', { count: formatDisplayNumber(minutes) })
  if (hours < 24) return getDisplayText('authorPostDetailPage.hoursAgo', { count: formatDisplayNumber(hours) })
  if (days < 7) return getDisplayText('authorPostDetailPage.daysAgo', { count: formatDisplayNumber(days) })

  return new Intl.DateTimeFormat(getDisplayLocale(), {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}


function formatPhotoViewerDateTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(getDisplayLocale(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function renderPostTextWithLinks(text, postId) {
  return String(text || '')
    .split(POST_TOKEN_PATTERN)
    .map((part, index) => {
      if (
        POST_URL_ONLY_PATTERN.test(part)
      ) {
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"

className="break-all text-[#1877f2]"
          >
            {part}
          </a>
        )
      }

      if (
        POST_HASHTAG_ONLY_PATTERN.test(
          part
        )
      ) {
        return (
          <Link
            key={`${part}-${index}`}
            to={`/discover/search?q=${encodeURIComponent(
              part
            )}&type=posts`}
            className="text-[#1877f2]"
          >
            {part}
          </Link>
        )
      }

      return part
    })
}

function countAuthorPostComments(
  comments = []
) {
  return comments.reduce(
    (total, comment) =>
      total +
      1 +
      countAuthorPostComments(
        Array.isArray(comment?.replies)
          ? comment.replies
          : []
      ),
    0
  )
}

function AuthorPostImages({
  images,
  authorName,
  onImageClick,
  photoPostView = false,
  selectedPhotoIndex = 0,
}) {
  const urls = Array.isArray(images)
    ? images
        .filter(Boolean)
        .slice(0, 5)
    : []

  if (!urls.length) return null

  const alt =
    getDisplayText('authorPostDetailPage.authorPostAlt', { name: authorName || getDisplayText('authorPostDetailPage.author') })

  const safeSelectedIndex =
    Math.min(
      urls.length - 1,
      Math.max(
        0,
        Number.isFinite(
          Number(selectedPhotoIndex)
        )
          ? Math.floor(
              Number(
                selectedPhotoIndex
              )
            )
          : 0
      )
    )

  if (photoPostView) {
    return (
      <ProfessionalSinglePostImage
        src={
          urls[
            safeSelectedIndex
          ]
        }
        alt={alt}
        onClick={() =>
          onImageClick?.(
            safeSelectedIndex
          )
        }
      />
    )
  }

  if (urls.length === 1) {
    return (
      <ProfessionalSinglePostImage
        src={urls[0]}
        alt={alt}
        onClick={() =>
          onImageClick?.(0)
        }
      />
    )
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-[2px] bg-[var(--shadow-bg-soft)]">
        {urls.map(
          (url, index) => (
            <button
              key={url}
              type="button"
              onClick={() =>
                onImageClick?.(
                  index
                )
              }
              className="block w-full"
            >
              <img
                src={url}
                alt={alt}
                loading="eager"
                decoding="async"
                className="h-[280px] w-full object-cover sm:h-[330px]"
              />
            </button>
          )
        )}
      </div>
    )
  }

  if (urls.length === 3) {
    return (
      <div className="grid h-[360px] grid-cols-2 gap-[2px] bg-[var(--shadow-bg-soft)] sm:h-[420px]">
        <button
          type="button"
          onClick={() =>
            onImageClick?.(0)
          }
          className="h-full w-full"
        >
          <img
            src={urls[0]}
            alt={alt}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </button>

        <div className="grid min-h-0 grid-rows-2 gap-[2px]">
          {urls
            .slice(1)
            .map(
              (
                url,
                index
              ) => (
                <button
                  key={url}
                  type="button"
                  onClick={() =>
                    onImageClick?.(
                      index + 1
                    )
                  }
                  className="h-full min-h-0 w-full"
                >
                  <img
                    src={url}
                    alt={alt}
                    loading="eager"
                    decoding="async"
                    className="h-full min-h-0 w-full object-cover"
                  />
                </button>
              )
            )}
        </div>
      </div>
    )
  }

  const visibleUrls =
    urls.slice(0, 4)

  const hiddenCount =
    Math.max(
      0,
      urls.length - 4
    )

  return (
    <div className="grid grid-cols-2 gap-[2px] bg-[var(--shadow-bg-soft)]">
      {visibleUrls.map(
        (url, index) => (
          <button
            key={url}
            type="button"
            onClick={() =>
              onImageClick?.(
                index
              )
            }
            className="relative block w-full"
          >
            <img
              src={url}
              alt={alt}
              loading="eager"
              decoding="async"
              className="h-[220px] w-full object-cover sm:h-[270px]"
            />

            {index === 3 &&
            hiddenCount > 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[28px] font-black text-white">
                +{hiddenCount}
              </div>
            ) : null}
          </button>
        )
      )}
    </div>
  )
}
async function setAuthorPostReaction(
  token,
  postId,
  reactionType
) {
  if (!token) {
    throw new Error(
      getDisplayText('authorPostDetailPage.loginRequired')
    )
  }

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
      postId
    )}/react`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify({
        reaction_type:
          reactionType,
      }),
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
        getDisplayText('authorPostDetailPage.reactionFailed')
    )
  }

  return data
}

export default function AuthorPostDetailPage() {
const navigate = useNavigate()
const { t } = useDisplayTranslation()
const location = useLocation()
const { postId } = useParams()
const [searchParams] = useSearchParams()
const postSource =
  searchParams.get('source') || 'direct'

const rawPhotoIndex =
  searchParams.get('photo')

const photoPostView =
  rawPhotoIndex !== null

const selectedPhotoIndex = Math.max(
  0,
  Number.isFinite(
    Number(rawPhotoIndex)
  )
    ? Math.floor(
        Number(rawPhotoIndex)
      )
    : 0
)
  const [post, setPost] =
    useState(null)
  const [loading, setLoading] =
    useState(true)
  const [error, setError] =
    useState('')
  
  const [
    reactionBusy,
    setReactionBusy,
  ] = useState(false)
  const [
    actionError,
    setActionError,
  ] = useState('')
  const [
    followBusy,
    setFollowBusy,
  ] = useState(false)
  const [
    commentsOpen,
    setCommentsOpen,
  ] = useState(false)

  const [
  fullscreenPhotoOpen,
  setFullscreenPhotoOpen,
] = useState(false)

  const [
  fullscreenControlsVisible,
  setFullscreenControlsVisible,
] = useState(true)

  const [
  fullscreenPhotoMenuOpen,
  setFullscreenPhotoMenuOpen,
] = useState(false)

const [
  photoActionMessage,
  setPhotoActionMessage,
] = useState('')

  const [photoShareOpen, setPhotoShareOpen] =
  useState(false)

  const [
  photoDeleteConfirmOpen,
  setPhotoDeleteConfirmOpen,
] = useState(false)

const [
  photoDeleteBusy,
  setPhotoDeleteBusy,
] = useState(false)

const [photoCaptionEditorOpen, setPhotoCaptionEditorOpen] = useState(false)
const [photoCaption, setPhotoCaption] = useState('')
const [photoCaptionSaving, setPhotoCaptionSaving] = useState(false)

const [photoAltEditorOpen, setPhotoAltEditorOpen] = useState(false)
const [photoAltText, setPhotoAltText] = useState('')
const [photoAltSaving, setPhotoAltSaving] = useState(false)
  
  const commentCountBaseRef =
    useRef({
      loadedCount: null,
      serverCount: 0,
    })

  useEffect(() => {
  if (!post?.id) return
  commentCountBaseRef.current = {
    loadedCount: null,
    serverCount: Number(post.comment_count || 0),
  }
}, [post?.id])

  useEffect(() => {
    const controller =
      new AbortController()
    let ignore = false

    async function loadPost() {
      try {
        setLoading(true)
        setError('')

        const token =
          getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
  postId || ''
)}?source=${encodeURIComponent(postSource)}`,
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
            cache: 'no-store',
            signal:
              controller.signal,
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
              t('authorPostDetailPage.postNotFound')
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
              t('authorPostDetailPage.loadPostFailed')
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
  }, [postId, postSource])
  useEffect(() => {
  if (!fullscreenPhotoOpen) {
    return undefined
  }

  const previousOverflow =
    document.body.style.overflow

  document.body.style.overflow =
    'hidden'

  function handleKeyDown(event) {
  if (event.key !== 'Escape') {
    return
  }

    if (photoDeleteConfirmOpen) {
  if (!photoDeleteBusy) {
    setPhotoDeleteConfirmOpen(false)
  }
  return
}

  if (fullscreenPhotoMenuOpen) {
    setFullscreenPhotoMenuOpen(false)
    return
  }

  setFullscreenPhotoOpen(false)
  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoActionMessage('')
}

  window.addEventListener(
    'keydown',
    handleKeyDown
  )

  return () => {
    document.body.style.overflow =
      previousOverflow

    window.removeEventListener(
      'keydown',
      handleKeyDown
    )
  }
}, [
  fullscreenPhotoOpen,
  fullscreenPhotoMenuOpen,
  photoDeleteConfirmOpen,
  photoDeleteBusy,
])
  useEffect(() => {
  if (!photoActionMessage) {
    return undefined
  }

  const timer = window.setTimeout(
    () => setPhotoActionMessage(''),
    1800
  )

  return () =>
    window.clearTimeout(timer)
}, [photoActionMessage])

  function goBack() {
    if (
      window.history.length > 1
    ) {
      navigate(-1)
      return
    }

    navigate('/discover', {
      replace: true,
    })
  }

  function openPhotoPost(index) {
  if (!post?.id) return

  navigate(
    `/author/post/${encodeURIComponent(
      post.id
    )}?photo=${index}&source=${encodeURIComponent(postSource)}`
  )
}

function handlePostImageClick(index) {
if (photoPostView) {
  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoDeleteConfirmOpen(false)
  setPhotoActionMessage('')
  setFullscreenPhotoOpen(true)
  return
}

  openPhotoPost(index)
}

  function openPhotoCaptionEditor(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl) return

  setPhotoCaption(selectedPhotoCaption)
  setFullscreenPhotoMenuOpen(false)
  setPhotoCaptionEditorOpen(true)
}

async function savePhotoCaption(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl || photoCaptionSaving) return

  const token = getAuthToken()
  if (!token) {
    navigate('/login')
    return
  }

  const nextCaption = photoCaption
    .slice(0, MAX_PHOTO_CAPTION_LENGTH)
    .trim()

  const metadataByUrl = new Map(
    photoMetadata
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String(item.url || ''), item])
  )

  const nextPhotoMetadata = photoUrls.map((url, index) => {
    const existing =
      metadataByUrl.get(String(url)) ||
      photoMetadata[index] ||
      {}

    return {
      url,
      caption:
        index === safeSelectedPhotoIndex
          ? nextCaption
          : String(existing.caption || ''),
      alt_text: String(
        existing.alt_text ??
          existing.alt ??
          ''
      ),
    }
  })

  try {
    setPhotoCaptionSaving(true)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(post.id)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo_metadata: nextPhotoMetadata,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.error ||
          data.message ||
          t('authorPostDetailPage.captionSaveFailed')
      )
    }

    setPost((current) =>
      current
        ? {
            ...current,
            ...(data.post || {}),
            photo_metadata:
              data.post?.photo_metadata ||
              nextPhotoMetadata,
            author_page: current.author_page,
            is_owner: current.is_owner,
            is_following: current.is_following,
            my_reaction: current.my_reaction,
          }
        : current
    )

    setPhotoCaptionEditorOpen(false)
    setPhotoActionMessage(
      nextCaption
        ? t('authorPostDetailPage.captionSaved')
        : t('authorPostDetailPage.captionRemoved')
    )
  } catch (error) {
    setPhotoActionMessage(
      error.message || t('authorPostDetailPage.captionSaveFailed')
    )
  } finally {
    setPhotoCaptionSaving(false)
  }
}

function openPhotoAltEditor(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl) return

  setPhotoAltText(selectedPhotoAltText)
  setFullscreenPhotoMenuOpen(false)
  setPhotoAltEditorOpen(true)
}

async function savePhotoAltText(event) {
  event?.stopPropagation()

  if (!isOwner || !selectedPhotoUrl || photoAltSaving) return

  const token = getAuthToken()
  if (!token) {
    navigate('/login')
    return
  }

  const nextAltText = photoAltText
    .slice(0, MAX_PHOTO_ALT_TEXT_LENGTH)
    .trim()

  const metadataByUrl = new Map(
    photoMetadata
      .filter((item) => item && typeof item === 'object')
      .map((item) => [String(item.url || ''), item])
  )

  const nextPhotoMetadata = photoUrls.map((url, index) => {
    const existing =
      metadataByUrl.get(String(url)) ||
      photoMetadata[index] ||
      {}

    return {
      url,
      caption: String(existing.caption || ''),
      alt_text:
        index === safeSelectedPhotoIndex
          ? nextAltText
          : String(
              existing.alt_text ??
                existing.alt ??
                ''
            ),
    }
  })

  try {
    setPhotoAltSaving(true)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(post.id)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo_metadata: nextPhotoMetadata,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.error ||
          data.message ||
          t('authorPostDetailPage.altSaveFailed')
      )
    }

    setPost((current) =>
      current
        ? {
            ...current,
            ...(data.post || {}),
            photo_metadata:
              data.post?.photo_metadata ||
              nextPhotoMetadata,
            author_page: current.author_page,
            is_owner: current.is_owner,
            is_following: current.is_following,
            my_reaction: current.my_reaction,
          }
        : current
    )

    setPhotoAltEditorOpen(false)
    setPhotoActionMessage(
      nextAltText
        ? t('authorPostDetailPage.altSaved')
        : t('authorPostDetailPage.altRemoved')
    )
  } catch (error) {
    setPhotoActionMessage(
      error.message ||
        t('authorPostDetailPage.altSaveFailed')
    )
  } finally {
    setPhotoAltSaving(false)
  }
}

  async function deleteSelectedPhoto(event) {
  event?.stopPropagation()

  if (
    !isOwner ||
    !selectedPhotoUrl ||
    photoDeleteBusy
  ) {
    return
  }

  const remainingPhotoUrls =
    photoUrls.filter(
      (_, index) =>
        index !==
        safeSelectedPhotoIndex
    )

  const currentContent = String(
    post?.content || ''
  ).trim()

  if (
    !remainingPhotoUrls.length &&
    !currentContent
  ) {
    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)
    setPhotoActionMessage(
      t('authorPostDetailPage.postNeedsContent')
    )
    return
  }

  const token = getAuthToken()

  if (!token) {
    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)
    setFullscreenPhotoOpen(false)
    navigate('/login')
    return
  }

  try {
    setPhotoDeleteBusy(true)

    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
        post.id
      )}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_urls:
            remainingPhotoUrls,
        }),
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
          t('authorPostDetailPage.photoDeleteFailed')
      )
    }

    const updatedPost =
      data.post || {
        ...post,
        image_urls:
          remainingPhotoUrls,
      }

    setPost((current) =>
      current
        ? {
            ...current,
            ...updatedPost,
            author_page:
              current.author_page,
            is_owner:
              current.is_owner,
            is_following:
              current.is_following,
            my_reaction:
              current.my_reaction,
          }
        : current
    )

    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)

    if (!remainingPhotoUrls.length) {
      setFullscreenPhotoOpen(false)
      setFullscreenControlsVisible(true)
      setPhotoActionMessage('')

      navigate(
        `/author/post/${encodeURIComponent(
          post.id
        )}?source=${encodeURIComponent(postSource)}`,
        {
          replace: true,
        }
      )
      return
    }

    const nextPhotoIndex =
      Math.min(
        safeSelectedPhotoIndex,
        remainingPhotoUrls.length - 1
      )

    setPhotoActionMessage(
      t('authorPostDetailPage.photoDeleted')
    )

    navigate(
      `/author/post/${encodeURIComponent(
        post.id
      )}?photo=${nextPhotoIndex}&source=${encodeURIComponent(postSource)}`,
      {
        replace: true,
      }
    )
  } catch (error) {
    setPhotoDeleteConfirmOpen(false)
    setFullscreenPhotoMenuOpen(false)

    setPhotoActionMessage(
      error.message ||
        t('authorPostDetailPage.photoDeleteFailed')
    )
  } finally {
    setPhotoDeleteBusy(false)
  }
}

  async function saveSelectedPhoto(event) {
  event?.stopPropagation()

  if (!selectedPhotoUrl) {
    return
  }

  try {
    const response = await fetch(
      selectedPhotoUrl,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(
        t('authorPostDetailPage.photoDownloadFailed')
      )
    }

    const blob = await response.blob()
    const objectUrl =
      URL.createObjectURL(blob)

    const extension =
      String(blob.type || '')
        .split('/')[1]
        ?.split(';')[0]
        ?.replace('jpeg', 'jpg') ||
      'jpg'

    const link =
      document.createElement('a')

    link.href = objectUrl
    link.download =
      `shadow-author-photo-${post.id}-${safeSelectedPhotoIndex + 1}.${extension}`

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(
      () =>
        URL.revokeObjectURL(
          objectUrl
        ),
      1000
    )

    setFullscreenPhotoMenuOpen(false)
    setPhotoActionMessage(
      t('authorPostDetailPage.photoSaved')
    )
  } catch {
    const link =
      document.createElement('a')

    link.href = selectedPhotoUrl
    link.target = '_blank'
    link.rel =
      'noopener noreferrer'
    link.download =
      `shadow-author-photo-${post.id}-${safeSelectedPhotoIndex + 1}`

    document.body.appendChild(link)
    link.click()
    link.remove()

    setFullscreenPhotoMenuOpen(false)
    setPhotoActionMessage(
      t('authorPostDetailPage.photoOpened')
    )
  }
}

function shareSelectedPhoto(event) {
  event?.stopPropagation()

  if (!selectedPhotoUrl) return

  setFullscreenPhotoMenuOpen(false)
  setPhotoShareOpen(true)
}
  
  async function followAuthor() {
    const token = getAuthToken()
    const author =
      post?.author_page || {}
    const pageUsername =
      author.page_username || ''
    const isFollowing = Boolean(
      post?.is_following ??
        author.is_following
    )
    const isOwner = Boolean(
      post?.is_owner ??
        author.is_owner
    )

    if (!token) {
      navigate('/login')
      return
    }

    if (
      followBusy ||
      isFollowing ||
      isOwner ||
      !pageUsername
    ) {
      return
    }

    try {
      setFollowBusy(true)
      setActionError('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(
          pageUsername
        )}/follow`,
        {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      `Bearer ${token}`,
  },
  body: JSON.stringify({
    source_post_id: post.id,
  }),
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
            t('authorPostDetailPage.followFailed')
        )
      }

      setPost((current) => {
        if (!current) return current

        const currentAuthor =
          current.author_page || {}

        return {
          ...current,
          is_following: true,
          author_page: {
            ...currentAuthor,
            is_following: true,
            total_followers:
              Number(
                currentAuthor
                  .total_followers ||
                  0
              ) + 1,
          },
        }
      })
    } catch (followError) {
      setActionError(
        followError.message ||
          t('authorPostDetailPage.followFailed')
      )
    } finally {
      setFollowBusy(false)
    }
  }

  async function chooseReaction(
    reactionType
  ) {
    if (
      reactionBusy ||
      !post?.id
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setReactionBusy(true)
      setActionError('')

      const data =
        await setAuthorPostReaction(
          token,
          post.id,
          reactionType
        )

      setPost((current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          ...(data.post || {}),
          author_page:
            current.author_page,
          is_following:
            current.is_following,
          is_owner:
            current.is_owner,
          my_reaction:
            data.reaction_type ||
            null,
          like_count: Number(
            data.like_count ??
              data.post?.like_count ??
              current.like_count ??
              0
          ),
          reaction_summary:
            Array.isArray(
              data.reaction_summary
            )
              ? data.reaction_summary
              : current.reaction_summary,
        }
      })
    } catch (reactionError) {
      setActionError(
        reactionError.message ||
          t('authorPostDetailPage.reactionFailed')
      )
    } finally {
      setReactionBusy(false)
    }
  }

  function openComments() {
    if (!post?.id) return

    commentCountBaseRef.current = {
      loadedCount: null,
      serverCount: Number(
        post.comment_count || 0
      ),
    }
    setCommentsOpen(true)
  }

  function handleCommentsChanged(
    nextComments = []
  ) {
    const loadedCount =
      countAuthorPostComments(
        nextComments
      )
    const base =
      commentCountBaseRef.current

    if (
      base.loadedCount === null
    ) {
      commentCountBaseRef.current = {
        ...base,
        loadedCount,
      }
      return
    }

    const nextCount = Math.max(
      0,
      base.serverCount +
        loadedCount -
        base.loadedCount
    )

    commentCountBaseRef.current = {
      loadedCount,
      serverCount: nextCount,
    }

    setPost((current) =>
      current
        ? {
            ...current,
            comment_count:
              nextCount,
          }
        : current
    )
  }

  const handleEchoCountChange = useCallback(
    (_postId, total) => {
      setPost((current) =>
        current
          ? {
              ...current,
              echo_count: Number(total || 0),
            }
          : current
      )
    },
    []
  )

  const author =
    post?.author_page || {}
  const authorName =
    author.page_name || t('authorPostDetailPage.author')
  const pageUsername =
    author.page_username || ''
  const pageUrl = pageUsername
    ? `/author/page/${encodeURIComponent(
        pageUsername
      )}`
    : '#'
  const firstLetter =
    authorName
      .trim()
      .slice(0, 1)
      .toUpperCase() || 'A'
  const isFollowing = Boolean(
    post?.is_following ??
      author.is_following
  )
  const isOwner = Boolean(
    post?.is_owner ??
      author.is_owner
  )
  const photoUrls = Array.isArray(
  post?.image_urls
)
  ? post.image_urls
      .filter(Boolean)
      .slice(0, 5)
  : []

const safeSelectedPhotoIndex =
  photoUrls.length
    ? Math.min(
        photoUrls.length - 1,
        Math.max(
          0,
          selectedPhotoIndex
        )
      )
    : 0

const selectedPhotoUrl =
  photoUrls[
    safeSelectedPhotoIndex
  ] || ''

  const photoMetadata = Array.isArray(
  post?.photo_metadata
)
  ? post.photo_metadata
  : []

const selectedPhotoMetadata =
  photoMetadata.find(
    (item) =>
      String(item?.url || '') ===
      String(selectedPhotoUrl || '')
  ) ||
  photoMetadata[safeSelectedPhotoIndex] ||
  {}

const selectedPhotoCaption = String(
  selectedPhotoMetadata?.caption || ''
)

const selectedPhotoAltText = String(
  selectedPhotoMetadata?.alt_text ??
    selectedPhotoMetadata?.alt ??
    ''
)

  useEffect(() => {
  if (!photoPostView || !selectedPhotoUrl) return

  setFullscreenControlsVisible(true)
  setFullscreenPhotoMenuOpen(false)
  setPhotoDeleteConfirmOpen(false)
  setPhotoActionMessage('')
  setFullscreenPhotoOpen(true)
}, [photoPostView, selectedPhotoUrl])

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)]">
      <PublicPostDetailView
  pageName={authorName}
  pageAvatarUrl={
    author.avatar_url ||
    author.profile_image_url ||
    author.profile_picture_url ||
    ''
  }
  authorName={authorName}
  authorAvatarUrl={
    author.avatar_url ||
    author.profile_image_url ||
    author.profile_picture_url ||
    ''
  }
  createdAt={post?.created_at}
  visibility="public"
  isPinned={Boolean(post?.is_pinned)}
  isEdited={Boolean(post?.is_edited)}
  loading={loading}
  error={error}
  content={
    post?.content ? (
      <span>
        {renderPostTextWithLinks(
  post.content,
  post.id
)}
      </span>
    ) : null
  }
  media={
    post ? (
      <AuthorPostImages
        images={post.image_urls}
        authorName={authorName}
        photoPostView={photoPostView}
        selectedPhotoIndex={
          selectedPhotoIndex
        }
        onImageClick={
          handlePostImageClick
        }
      />
    ) : null
  }
  reactionControl={
    post ? (
      <div className="inline-flex items-center gap-2">
        <ReactionAction
          reactionType={
            post.my_reaction
          }
          count={post.like_count}
          busy={reactionBusy}
          showBusySpinner
          showCount={false}
          onReact={chooseReaction}
          idleLabel={t('authorPostDetailPage.like')}
          buttonClassName="text-[var(--shadow-text-secondary)]"
        />
        <button
          type="button"
          onClick={() =>
            chooseReaction(
              post.my_reaction ||
                'love'
            )
          }
          disabled={reactionBusy}
          className="text-[14px] font-normal text-[var(--shadow-text-secondary)] disabled:opacity-60"
        >
          {t('authorPostDetailPage.like')}
        </button>
      </div>
    ) : null
  }
  echoControl={
    post ? (
      <AuthorPostEchoAction
        post={post}
        author={author}
        className="[&>span]:hidden after:content-['Echo'] after:text-[14px] after:font-normal after:text-[var(--shadow-text-secondary)]"
        onCountChange={handleEchoCountChange}
      />
    ) : null
  }
  reactionSummary={
  Array.isArray(
    post?.reaction_summary
  )
    ? post.reaction_summary
    : []
}
myReaction={post?.my_reaction || null}
likeCount={
  Number(post?.like_count || 0)
}
  commentCount={
    Number(
      post?.comment_count || 0
    )
  }
  echoCount={
    Number(post?.echo_count || 0)
  }
  comments={
    post ? (
      <CommentSection
        targetType="author_post"
        targetId={post.id}
        variant="page"
        story={{
          ...post,
          author_page: {
            ...(post.author_page ||
              {}),
            user_id:
              post.author_page
                ?.user_id ||
              post.user_id ||
              null,
          },
        }}
        onCommentsChange={
          handleCommentsChanged
        }
      />
    ) : null
  }
  onClose={goBack}
  onErrorBack={goBack}
  onSearch={() =>
    navigate(
      pageUsername
        ? `/author/page/${encodeURIComponent(
            pageUsername
          )}/search`
        : '/author/page'
    )
  }
  onOpenProfile={() =>
    navigate(
      pageUsername
        ? `/author/page/${encodeURIComponent(
            pageUsername
          )}`
        : '/author/page'
    )
  }
  onComment={() => {
    document
      .getElementById(
        'shadow-comment-input'
      )
      ?.focus()
  }}
  onOpenReactions={() =>
    post?.id
      ? navigate(
          `/interactions/author_post/${encodeURIComponent(
            post.id
          )}/likes`,
          {
            state: {
              sourceName:
                authorName,
            },
          }
        )
      : null
  }
  onOpenComments={() => {
    document
      .getElementById(
        'shadow-comment-input'
      )
      ?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
  }}
  onOpenEchoes={() =>
    post?.id
      ? navigate(
          `/interactions/author_post/${encodeURIComponent(
            post.id
          )}/echoes`,
          {
            state: {
              sourceName:
                authorName,
            },
          }
        )
      : null
  }
/>

{actionError ? (
  <div className="fixed left-1/2 top-20 z-[300] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white shadow-2xl">
    {actionError}
  </div>
) : null}

      {fullscreenPhotoOpen && selectedPhotoUrl ? (
  <div
    className="fixed inset-0 z-[150000] bg-black"
    onClick={() => {
      if (
        photoCaptionEditorOpen ||
        photoAltEditorOpen
      ) {
        return
      }

      if (photoDeleteConfirmOpen) {
        if (!photoDeleteBusy) {
          setPhotoDeleteConfirmOpen(false)
        }
        return
      }

      if (fullscreenPhotoMenuOpen) {
        setFullscreenPhotoMenuOpen(false)
        return
      }

      setFullscreenControlsVisible(
        (current) => !current
      )
    }}
  >
    {fullscreenControlsVisible ? (
  <div
    className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/90 via-black/65 to-transparent pb-10 pt-[max(8px,env(safe-area-inset-top))]"
    onClick={(event) => event.stopPropagation()}
  >
    <div className="relative flex h-12 items-center justify-between px-3">
      <button
        type="button"
        onClick={() => {
          if (
  location.state?.backgroundLocation?.pathname === '/discover' ||
  location.state?.fromAuthorPage
) {
  navigate(-1)
  return
}

          setFullscreenPhotoOpen(false)
          setFullscreenControlsVisible(true)
          setFullscreenPhotoMenuOpen(false)
          setPhotoDeleteConfirmOpen(false)
          setPhotoCaptionEditorOpen(false)
          setPhotoAltEditorOpen(false)
          setPhotoActionMessage('')
        }}
        className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
        aria-label={t('authorPostDetailPage.closeFullscreenPhoto')}
      >
        <i className="fa-solid fa-xmark text-[22px]" />
      </button>

      {photoUrls.length > 1 ? (
        <div className="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-white">
          {t('authorPostDetailPage.photoPosition', { current: formatDisplayNumber(safeSelectedPhotoIndex + 1), total: formatDisplayNumber(photoUrls.length) })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() =>
          setFullscreenPhotoMenuOpen(true)
        }
        className="flex h-10 w-10 items-center justify-center text-white active:opacity-60"
        aria-label={t('authorPostDetailPage.photoOptions')}
      >
        <i className="fa-solid fa-ellipsis text-[19px]" />
      </button>
    </div>
  </div>
) : null}

    <div className="flex h-[100dvh] w-full items-center justify-center overflow-hidden">
      <img
        src={selectedPhotoUrl}
        alt={selectedPhotoAltText}
        loading="eager"
        decoding="async"
        draggable="false"
        className="max-h-[100dvh] max-w-full select-none object-contain"
      />
    </div>

    {fullscreenControlsVisible &&
!fullscreenPhotoMenuOpen &&
!photoCaptionEditorOpen &&
!photoAltEditorOpen &&
!photoDeleteConfirmOpen ? (
  <div
    className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/85 to-transparent pt-14"
    onClick={(event) => event.stopPropagation()}
  >
    <div className="mx-auto max-w-[620px]">
      <button
        type="button"
        onClick={() =>
          navigate(
            pageUsername
              ? `/author/page/${encodeURIComponent(
                  pageUsername
                )}`
              : '/author/page'
          )
        }
        className="flex w-full items-center gap-3 px-4 pb-3 text-left active:opacity-70"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-[15px] font-semibold text-white ring-1 ring-white/20">
          {author.avatar_url ||
          author.profile_image_url ||
          author.profile_picture_url ? (
            <img
              src={
                author.avatar_url ||
                author.profile_image_url ||
                author.profile_picture_url
              }
              alt={authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </span>

        <div className="min-w-0">
          <div className="truncate text-[14px] font-semibold text-white">
            {authorName}
          </div>

          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
            <span>
              {formatPhotoViewerDateTime(
                post?.created_at
              )}
            </span>

            <span>·</span>

            <i className="fa-solid fa-earth-americas text-[10px]" />
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between border-b border-white/15 px-4 pb-2 text-[11px] text-white/75">
        <ReactionSummary
  summary={post?.reaction_summary}
  likeCount={post?.like_count}
  myReaction={post?.my_reaction}
/>
        <div className="flex items-center gap-4">
          <span>
            {t('authorPostDetailPage.commentsCount', { count: formatDisplayNumber(post?.comment_count) })}
          </span>

          <span>
            {t('authorPostDetailPage.sharesCount', { count: formatDisplayNumber(post?.echo_count) })}
          </span>
        </div>
      </div>

      {isOwner ? (
  <div className="px-4 pt-3">
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        setPhotoActionMessage(t('authorPostDetailPage.boostSoon'))
      }}
      className="h-10 w-full rounded-[10px] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(139,92,246,0.28)] active:scale-[0.99]"
    >
      {t('authorPostDetailPage.boostPost')}
    </button>
  </div>
) : null}

      <div className="flex items-center px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1">
        <div className="relative flex-1">
          <ReactionAction
            reactionType={post?.my_reaction}
            count={post?.like_count}
            busy={reactionBusy}
            onReact={chooseReaction}
            showCount={false}
            idleLabel={t('authorPostDetailPage.like')}
            className="w-full justify-center"
            buttonClassName="h-12 w-full justify-center gap-2 pr-12 text-white [&>i]:!text-[20px] [&>img]:!h-5 [&>img]:!w-5"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center pl-8 text-[14px] font-medium text-white">
            {t('authorPostDetailPage.like')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setFullscreenPhotoOpen(false)
            setFullscreenControlsVisible(true)
            openComments()
          }}
          className="flex h-12 flex-1 items-center justify-center gap-2 text-[14px] font-medium text-white active:bg-white/10"
        >
          <i className="fa-regular fa-comment text-[20px]" />
          <span>{t('authorPostDetailPage.comment')}</span>
        </button>

        <div className="relative flex-1">
          <AuthorPostEchoAction
            post={post}
            author={author}
            onCountChange={handleEchoCountChange}
            className="h-12 w-full justify-center gap-2 pr-12 text-white [&>img]:!h-5 [&>img]:!w-5 [&>img]:brightness-0 [&>img]:invert [&>span]:hidden"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center pl-8 text-[14px] font-medium text-white">
            {t('authorPostDetailPage.share')}
          </span>
        </div>
      </div>
    </div>
  </div>
) : null}

    {fullscreenControlsVisible &&
    selectedPhotoCaption &&
    !fullscreenPhotoMenuOpen &&
    !photoCaptionEditorOpen &&
    !photoAltEditorOpen &&
    !photoDeleteConfirmOpen ? (
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+92px)] left-0 right-0 z-20 px-5 text-center">
        <p className="mx-auto max-w-[720px] whitespace-pre-wrap break-words text-[13px] leading-5 text-white">
          {selectedPhotoCaption}
        </p>
      </div>
    ) : null}

    {photoActionMessage ? (
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+94px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-[12px] font-medium text-[#111827] shadow-xl">
        {photoActionMessage}
      </div>
    ) : null}

    {fullscreenPhotoMenuOpen ? (
      <div
        className="absolute inset-0 z-40 flex items-end bg-black/35"
        onClick={(event) => {
          event.stopPropagation()
          setFullscreenPhotoMenuOpen(false)
        }}
      >
        <div
          className="w-full bg-[var(--shadow-bg-surface)] px-2 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
        

          {isOwner ? (
            <button
              type="button"
              onClick={openPhotoCaptionEditor}
              className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                <i className="fa-solid fa-pencil text-[19px]" />
              </span>
              <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                {t('authorPostDetailPage.editCaption')}
              </span>
            </button>
          ) : null}

          {isOwner ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setFullscreenPhotoMenuOpen(false)
                setPhotoDeleteConfirmOpen(true)
              }}
              className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
                <i className="fa-regular fa-trash-can text-[20px]" />
              </span>
              <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                {t('authorPostDetailPage.deletePhoto')}
              </span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={saveSelectedPhoto}
            className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 3v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  <path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
</svg>
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
              {t('authorPostDetailPage.saveToPhone')}
            </span>
          </button>

          <button
            type="button"
            onClick={shareSelectedPhoto}
            className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
              <i
  className="fa-solid fa-share text-[19px] text-transparent"
  style={{ WebkitTextStroke: '1.1px #4b5563' }}
/>
            </span>
            <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
              {t('authorPostDetailPage.shareExternal')}
            </span>
          </button>

          {!isOwner ? (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation()
      setFullscreenPhotoMenuOpen(false)

      navigate(
        `/report/author_post/${encodeURIComponent(post.id)}`,
        {
          state: {
            reportContext: 'photo',
            targetTitle: `${authorName} photo`,
            sourceUrl: selectedPhotoUrl,
            returnTo: `/author/post/${encodeURIComponent(
  post.id
)}?photo=${safeSelectedPhotoIndex}&source=${encodeURIComponent(
  postSource
)}`,
          },
        }
      )
    }}
    className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
  >
    <span className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)]">
      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-current">
  <i className="fa-solid fa-question text-[10px]" />
</span>
    </span>

    <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
      {t('authorPostDetailPage.reportPhoto')}
    </span>
  </button>
) : null}

          {isOwner ? (
            <button
              type="button"
              onClick={openPhotoAltEditor}
              className="flex w-full items-center gap-3 px-3 py-3.5 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <span className="flex h-9 w-9 items-center justify-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-[5px] border-2 border-[var(--shadow-border-strong)] text-[14px] font-semibold text-[var(--shadow-text-secondary)]">
                  A
                </span>
              </span>
              <span className="text-[15px] font-normal text-[var(--shadow-text-primary)]">
                {t('authorPostDetailPage.editAltText')}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    ) : null}

    {photoCaptionEditorOpen ? (
      <div
        className="absolute inset-0 z-50 flex items-end bg-black/45"
        onClick={(event) => {
          event.stopPropagation()
          if (!photoCaptionSaving) {
            setPhotoCaptionEditorOpen(false)
          }
        }}
      >
        <div
          className="w-full rounded-t-[22px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                {t('authorPostDetailPage.editCaption')}
              </div>
              <div className="mt-1 text-[12px] text-[var(--shadow-text-tertiary)]">
                {t('authorPostDetailPage.photoNumber', { count: formatDisplayNumber(safeSelectedPhotoIndex + 1) })}
              </div>
            </div>

            <span className="text-[11px] text-[var(--shadow-text-tertiary)]">
              {formatDisplayNumber(photoCaption.length)} / {formatDisplayNumber(MAX_PHOTO_CAPTION_LENGTH)}
            </span>
          </div>

          <textarea
            autoFocus
            value={photoCaption}
            maxLength={MAX_PHOTO_CAPTION_LENGTH}
            onChange={(event) =>
              setPhotoCaption(
                event.target.value.slice(
                  0,
                  MAX_PHOTO_CAPTION_LENGTH
                )
              )
            }
            placeholder={t('authorPostDetailPage.captionPlaceholder')}
            className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3.5 py-3 text-[14px] leading-5 text-[var(--shadow-text-primary)] outline-none"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={photoCaptionSaving}
              onClick={() =>
                setPhotoCaptionEditorOpen(false)
              }
              className="h-11 flex-1 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {t('authorPostDetailPage.cancel')}
            </button>

            <button
              type="button"
              disabled={photoCaptionSaving}
              onClick={savePhotoCaption}
              className="h-11 flex-1 rounded-full bg-[#111827] text-[14px] font-semibold text-white"
            >
              {photoCaptionSaving
                ? t('authorPostDetailPage.saving')
                : t('authorPostDetailPage.save')}
            </button>
          </div>
        </div>
      </div>
    ) : null}

    {photoAltEditorOpen ? (
      <div
        className="absolute inset-0 z-50 flex items-end bg-black/45"
        onClick={(event) => {
          event.stopPropagation()
          if (!photoAltSaving) {
            setPhotoAltEditorOpen(false)
          }
        }}
      >
        <div
          className="w-full rounded-t-[22px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                {t('authorPostDetailPage.editAltText')}
              </div>
              <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorPostDetailPage.altHelp')}
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-[var(--shadow-text-tertiary)]">
              {formatDisplayNumber(photoAltText.length)} / {formatDisplayNumber(MAX_PHOTO_ALT_TEXT_LENGTH)}
            </span>
          </div>

          <textarea
            autoFocus
            value={photoAltText}
            maxLength={MAX_PHOTO_ALT_TEXT_LENGTH}
            onChange={(event) =>
              setPhotoAltText(
                event.target.value.slice(
                  0,
                  MAX_PHOTO_ALT_TEXT_LENGTH
                )
              )
            }
            placeholder={t('authorPostDetailPage.altPlaceholder')}
            className="mt-4 min-h-[130px] w-full resize-none rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3.5 py-3 text-[14px] leading-5 text-[var(--shadow-text-primary)] outline-none"
          />

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={photoAltSaving}
              onClick={() =>
                setPhotoAltEditorOpen(false)
              }
              className="h-11 flex-1 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {t('authorPostDetailPage.cancel')}
            </button>

            <button
              type="button"
              disabled={photoAltSaving}
              onClick={savePhotoAltText}
              className="h-11 flex-1 rounded-full bg-[#111827] text-[14px] font-semibold text-white"
            >
              {photoAltSaving
                ? t('authorPostDetailPage.saving')
                : t('authorPostDetailPage.save')}
            </button>
          </div>
        </div>
      </div>
    ) : null}

    {photoDeleteConfirmOpen ? (
      <div
        className="absolute inset-0 z-50 flex items-end bg-black/45"
        onClick={(event) => {
          event.stopPropagation()
          if (!photoDeleteBusy) {
            setPhotoDeleteConfirmOpen(false)
          }
        }}
      >
        <div
          className="w-full rounded-t-[22px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 shadow-2xl"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--shadow-border-strong)]" />

          <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
            {t('authorPostDetailPage.deletePhotoTitle')}
          </div>

          <p className="mt-1 text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
            {t('authorPostDetailPage.deletePhotoDescription')}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              disabled={photoDeleteBusy}
              onClick={() =>
                setPhotoDeleteConfirmOpen(false)
              }
              className="h-11 flex-1 rounded-full bg-[var(--shadow-bg-soft)] text-[14px] font-semibold text-[var(--shadow-text-primary)]"
            >
              {t('authorPostDetailPage.cancel')}
            </button>

            <button
              type="button"
              disabled={photoDeleteBusy}
              onClick={deleteSelectedPhoto}
              className="h-11 flex-1 rounded-full bg-[#e5484d] text-[14px] font-semibold text-white"
            >
              {photoDeleteBusy
                ? t('authorPostDetailPage.deleting')
                : t('authorPostDetailPage.delete')}
            </button>
          </div>
        </div>
      </div>
    ) : null}
  </div>
) : null}

<AuthorPageShareSheet
  open={photoShareOpen}
  pageName={t('authorPostDetailPage.photoFromAuthor', { name: authorName })}
  pageLink={
  post?.id
    ? `${window.location.origin}/author/post/${encodeURIComponent(
        post.id
      )}?photo=${safeSelectedPhotoIndex}&source=share`
    : selectedPhotoUrl
}
  sheetTitle={t('authorPostDetailPage.sharePhoto')}
  shareText={t('authorPostDetailPage.sharePhotoText', { name: authorName })}
  zClassName="z-[200000]"
  onClose={() => setPhotoShareOpen(false)}
  onCopied={() =>
    setPhotoActionMessage(t('authorPostDetailPage.photoLinkCopied'))
  }
/>

<CommentsModal
        open={
          commentsOpen &&
          Boolean(post?.id)
        }
        targetType="author_post"
        targetId={post?.id}
        title={t('authorPostDetailPage.authorPostComments')}
        story={
          post
            ? {
                ...post,
                author_page: {
                  ...(post.author_page ||
                    {}),
                  user_id:
                    post.author_page
                      ?.user_id ||
                    post.user_id ||
                    null,
                },
              }
            : null
        }
        onClose={() =>
          setCommentsOpen(false)
        }
        onCommentChanged={
          handleCommentsChanged
        }
      />
    </div>
  )
}


