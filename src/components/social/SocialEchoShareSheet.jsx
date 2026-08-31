import { createPortal } from 'react-dom'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('socialEchoShare', {
  en: {
    reader: 'Reader',
    post: 'post',
    destinationFeedTitle: 'Echo to Feed',
    destinationFeedSubtitle: 'Show this echo in your Shadow feed and profile.',
    destinationShadowTitle: 'Add to My Shadow',
    destinationShadowSubtitle: 'Keep this echo on your own Shadow space.',
    destinationReaderTitle: 'Send to Reader',
    destinationReaderSubtitle: 'Share this post with selected readers.',
    destinationCircleTitle: 'Echo to Circle',
    destinationCircleSubtitle: 'Share this echo with your reading circle.',
    audiencePublicTitle: 'Public',
    audiencePublicSubtitle: 'Anyone on Shadow can view this echo.',
    audienceFollowersTitle: 'Followers',
    audienceFollowersSubtitle: 'Only people who follow you can view this echo.',
    audienceCloseReadersTitle: 'Close readers',
    audienceCloseReadersSubtitle: 'Only your selected close readers can view it.',
    audienceOnlyMeTitle: 'Only me',
    audienceOnlyMeSubtitle: 'Keep this echo private.',
    followersLoadFailed: 'Failed to load followers',
    linkCopied: 'Link copied.',
    contentNotReady: 'This content is not ready yet.',
    selectReader: 'Select at least one reader.',
    loginBeforeEcho: 'Please log in before echoing.',
    echoNotConnected: 'Echo V2 is not connected yet.',
    echoFailed: 'Failed to echo content',
    closeShare: 'Close echo share',
    saySomething: 'Say something...',
    tagReaderSelected: 'Tag reader is selected for the next update.',
    tagReader: 'Tag reader',
    echoing: 'Echoing...',
    echoNow: 'Echo now',
    readers: 'Readers',
    noFollowers: 'No followers yet.',
    shareOutside: 'Share outside Shadow',
    copyLink: 'Copy link',
    destinationTitle: 'Echo destination',
    destinationSubtitle: 'Choose where this echo should appear on Shadow.',
    audienceTitle: 'Who can view this echo?',
    audienceSubtitle: 'Choose who can see your echo on Shadow.',
    back: 'Back',
  },
  km: {
    reader: 'អ្នកអាន',
    post: 'ប្រកាស',
    destinationFeedTitle: 'Echo ទៅ Feed',
    destinationFeedSubtitle: 'បង្ហាញ Echo នេះក្នុង Shadow feed និងប្រវត្តិរូបរបស់អ្នក។',
    destinationShadowTitle: 'បន្ថែមទៅ My Shadow',
    destinationShadowSubtitle: 'រក្សា Echo នេះនៅក្នុងកន្លែង Shadow ផ្ទាល់ខ្លួនរបស់អ្នក។',
    destinationReaderTitle: 'ផ្ញើទៅអ្នកអាន',
    destinationReaderSubtitle: 'ចែករំលែកប្រកាសនេះជាមួយអ្នកអានដែលបានជ្រើស។',
    destinationCircleTitle: 'Echo ទៅ Circle',
    destinationCircleSubtitle: 'ចែករំលែក Echo នេះជាមួយក្រុមអ្នកអានរបស់អ្នក។',
    audiencePublicTitle: 'សាធារណៈ',
    audiencePublicSubtitle: 'អ្នកគ្រប់គ្នានៅ Shadow អាចមើល Echo នេះបាន។',
    audienceFollowersTitle: 'អ្នកតាមដាន',
    audienceFollowersSubtitle: 'មានតែអ្នកដែលតាមដានអ្នកប៉ុណ្ណោះអាចមើល Echo នេះបាន។',
    audienceCloseReadersTitle: 'អ្នកអានជិតស្និទ្ធ',
    audienceCloseReadersSubtitle: 'មានតែអ្នកអានជិតស្និទ្ធដែលអ្នកបានជ្រើសប៉ុណ្ណោះអាចមើលបាន។',
    audienceOnlyMeTitle: 'ខ្ញុំតែម្នាក់',
    audienceOnlyMeSubtitle: 'រក្សា Echo នេះជាឯកជន។',
    followersLoadFailed: 'មិនអាចផ្ទុកអ្នកតាមដានបានទេ',
    linkCopied: 'បានចម្លងតំណ។',
    contentNotReady: 'មាតិកានេះមិនទាន់រួចរាល់ទេ។',
    selectReader: 'សូមជ្រើសអ្នកអានយ៉ាងហោចណាស់ម្នាក់។',
    loginBeforeEcho: 'សូមចូលគណនីមុនពេល Echo។',
    echoNotConnected: 'Echo V2 មិនទាន់ត្រូវបានភ្ជាប់ទេ។',
    echoFailed: 'មិនអាច Echo មាតិកាបានទេ',
    closeShare: 'បិទការចែករំលែក Echo',
    saySomething: 'សរសេរអ្វីមួយ...',
    tagReaderSelected: 'ការដាក់ Tag អ្នកអាននឹងមាននៅការអាប់ដេតបន្ទាប់។',
    tagReader: 'ដាក់ Tag អ្នកអាន',
    echoing: 'កំពុង Echo...',
    echoNow: 'Echo ឥឡូវនេះ',
    readers: 'អ្នកអាន',
    noFollowers: 'មិនទាន់មានអ្នកតាមដានទេ។',
    shareOutside: 'ចែករំលែកក្រៅ Shadow',
    copyLink: 'ចម្លងតំណ',
    destinationTitle: 'ទីតាំង Echo',
    destinationSubtitle: 'ជ្រើសកន្លែងដែល Echo នេះត្រូវបង្ហាញនៅលើ Shadow។',
    audienceTitle: 'អ្នកណាអាចមើល Echo នេះ?',
    audienceSubtitle: 'ជ្រើសអ្នកដែលអាចមើល Echo របស់អ្នកនៅលើ Shadow។',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    reader: '读者',
    post: '帖子',
    destinationFeedTitle: 'Echo 到动态',
    destinationFeedSubtitle: '在你的 Shadow 动态和个人资料中显示此 Echo。',
    destinationShadowTitle: '添加到我的 Shadow',
    destinationShadowSubtitle: '将此 Echo 保留在你自己的 Shadow 空间。',
    destinationReaderTitle: '发送给读者',
    destinationReaderSubtitle: '将此帖子分享给选中的读者。',
    destinationCircleTitle: 'Echo 到圈子',
    destinationCircleSubtitle: '将此 Echo 分享给你的阅读圈。',
    audiencePublicTitle: '公开',
    audiencePublicSubtitle: 'Shadow 上的任何人都可以查看此 Echo。',
    audienceFollowersTitle: '关注者',
    audienceFollowersSubtitle: '只有关注你的人可以查看此 Echo。',
    audienceCloseReadersTitle: '亲近读者',
    audienceCloseReadersSubtitle: '只有你选择的亲近读者可以查看。',
    audienceOnlyMeTitle: '仅自己',
    audienceOnlyMeSubtitle: '将此 Echo 设为私密。',
    followersLoadFailed: '无法加载关注者',
    linkCopied: '链接已复制。',
    contentNotReady: '此内容尚未准备好。',
    selectReader: '请至少选择一位读者。',
    loginBeforeEcho: '请先登录再 Echo。',
    echoNotConnected: 'Echo V2 尚未连接。',
    echoFailed: '无法 Echo 内容',
    closeShare: '关闭 Echo 分享',
    saySomething: '说点什么...',
    tagReaderSelected: '标记读者功能将在下次更新中提供。',
    tagReader: '标记读者',
    echoing: 'Echo 中...',
    echoNow: '立即 Echo',
    readers: '读者',
    noFollowers: '还没有关注者。',
    shareOutside: '分享到 Shadow 之外',
    copyLink: '复制链接',
    destinationTitle: 'Echo 位置',
    destinationSubtitle: '选择此 Echo 在 Shadow 上显示的位置。',
    audienceTitle: '谁可以查看此 Echo？',
    audienceSubtitle: '选择谁可以在 Shadow 上查看你的 Echo。',
    back: '返回',
  },
  ja: {
    reader: '読者',
    post: '投稿',
    destinationFeedTitle: 'フィードに Echo',
    destinationFeedSubtitle: 'この Echo を Shadow のフィードとプロフィールに表示します。',
    destinationShadowTitle: 'My Shadow に追加',
    destinationShadowSubtitle: 'この Echo を自分の Shadow スペースに保存します。',
    destinationReaderTitle: '読者に送信',
    destinationReaderSubtitle: 'この投稿を選択した読者と共有します。',
    destinationCircleTitle: 'サークルに Echo',
    destinationCircleSubtitle: 'この Echo を読書サークルと共有します。',
    audiencePublicTitle: '公開',
    audiencePublicSubtitle: 'Shadow の誰でもこの Echo を見ることができます。',
    audienceFollowersTitle: 'フォロワー',
    audienceFollowersSubtitle: 'あなたをフォローしている人だけがこの Echo を見られます。',
    audienceCloseReadersTitle: '親しい読者',
    audienceCloseReadersSubtitle: '選択した親しい読者だけが見ることができます。',
    audienceOnlyMeTitle: '自分のみ',
    audienceOnlyMeSubtitle: 'この Echo を非公開にします。',
    followersLoadFailed: 'フォロワーを読み込めませんでした',
    linkCopied: 'リンクをコピーしました。',
    contentNotReady: 'このコンテンツはまだ準備できていません。',
    selectReader: '少なくとも1人の読者を選択してください。',
    loginBeforeEcho: 'Echo する前にログインしてください。',
    echoNotConnected: 'Echo V2 はまだ接続されていません。',
    echoFailed: 'コンテンツを Echo できませんでした',
    closeShare: 'Echo 共有を閉じる',
    saySomething: '何か書く...',
    tagReaderSelected: '読者タグ機能は次回のアップデートで利用できます。',
    tagReader: '読者をタグ付け',
    echoing: 'Echo 中...',
    echoNow: '今すぐ Echo',
    readers: '読者',
    noFollowers: 'まだフォロワーはいません。',
    shareOutside: 'Shadow の外へ共有',
    copyLink: 'リンクをコピー',
    destinationTitle: 'Echo の表示先',
    destinationSubtitle: 'この Echo を Shadow のどこに表示するか選択します。',
    audienceTitle: 'この Echo を見られる人は？',
    audienceSubtitle: 'Shadow であなたの Echo を見られる人を選択します。',
    back: '戻る',
  },
  ko: {
    reader: '독자',
    post: '게시물',
    destinationFeedTitle: '피드에 Echo',
    destinationFeedSubtitle: '이 Echo를 Shadow 피드와 프로필에 표시합니다.',
    destinationShadowTitle: 'My Shadow에 추가',
    destinationShadowSubtitle: '이 Echo를 내 Shadow 공간에 보관합니다.',
    destinationReaderTitle: '독자에게 보내기',
    destinationReaderSubtitle: '이 게시물을 선택한 독자와 공유합니다.',
    destinationCircleTitle: '서클에 Echo',
    destinationCircleSubtitle: '이 Echo를 독서 서클과 공유합니다.',
    audiencePublicTitle: '전체 공개',
    audiencePublicSubtitle: 'Shadow의 누구나 이 Echo를 볼 수 있습니다.',
    audienceFollowersTitle: '팔로워',
    audienceFollowersSubtitle: '나를 팔로우하는 사람만 이 Echo를 볼 수 있습니다.',
    audienceCloseReadersTitle: '친한 독자',
    audienceCloseReadersSubtitle: '선택한 친한 독자만 볼 수 있습니다.',
    audienceOnlyMeTitle: '나만 보기',
    audienceOnlyMeSubtitle: '이 Echo를 비공개로 유지합니다.',
    followersLoadFailed: '팔로워를 불러오지 못했습니다',
    linkCopied: '링크를 복사했습니다.',
    contentNotReady: '이 콘텐츠는 아직 준비되지 않았습니다.',
    selectReader: '독자를 한 명 이상 선택하세요.',
    loginBeforeEcho: 'Echo하기 전에 로그인해 주세요.',
    echoNotConnected: 'Echo V2가 아직 연결되지 않았습니다.',
    echoFailed: '콘텐츠를 Echo하지 못했습니다',
    closeShare: 'Echo 공유 닫기',
    saySomething: '내용을 입력하세요...',
    tagReaderSelected: '독자 태그 기능은 다음 업데이트에서 제공됩니다.',
    tagReader: '독자 태그',
    echoing: 'Echo 중...',
    echoNow: '지금 Echo',
    readers: '독자',
    noFollowers: '아직 팔로워가 없습니다.',
    shareOutside: 'Shadow 외부로 공유',
    copyLink: '링크 복사',
    destinationTitle: 'Echo 위치',
    destinationSubtitle: '이 Echo를 Shadow의 어디에 표시할지 선택하세요.',
    audienceTitle: '이 Echo를 볼 수 있는 사람은?',
    audienceSubtitle: 'Shadow에서 내 Echo를 볼 수 있는 사람을 선택하세요.',
    back: '뒤로',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const DESTINATIONS = [
  {
    key: 'feed',
    titleKey: 'destinationFeedTitle',
    subtitleKey: 'destinationFeedSubtitle',
    icon: 'fa-solid fa-newspaper',
  },
  {
    key: 'shadow',
    titleKey: 'destinationShadowTitle',
    subtitleKey: 'destinationShadowSubtitle',
    icon: 'fa-regular fa-circle-user',
  },
  {
    key: 'reader',
    titleKey: 'destinationReaderTitle',
    subtitleKey: 'destinationReaderSubtitle',
    icon: 'fa-solid fa-user-group',
  },
  {
    key: 'circle',
    titleKey: 'destinationCircleTitle',
    subtitleKey: 'destinationCircleSubtitle',
    icon: 'fa-solid fa-users',
  },
]

const AUDIENCES = [
  {
    key: 'public',
    titleKey: 'audiencePublicTitle',
    subtitleKey: 'audiencePublicSubtitle',
    icon: 'fa-solid fa-earth-americas',
  },
  {
    key: 'followers',
    titleKey: 'audienceFollowersTitle',
    subtitleKey: 'audienceFollowersSubtitle',
    icon: 'fa-solid fa-user-check',
  },
  {
    key: 'close-readers',
    titleKey: 'audienceCloseReadersTitle',
    subtitleKey: 'audienceCloseReadersSubtitle',
    icon: 'fa-solid fa-star',
  },
  {
    key: 'only-me',
    titleKey: 'audienceOnlyMeTitle',
    subtitleKey: 'audienceOnlyMeSubtitle',
    icon: 'fa-solid fa-lock',
  },
]

function getReaderToken() {
  return (
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function ShareCircle({
  icon,
  iconNode,
  label,
  bg = 'bg-[var(--shadow-bg-elevated)]',
  color = 'text-[var(--shadow-text-primary)]',
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[82px] shrink-0 text-center active:scale-95"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 ${bg} ${color}`}
      >
        {iconNode || (
          <i
            className={`${icon} text-[22px]`}
          />
        )}
      </div>

      <div className="mt-2 text-[12px] font-normal leading-4 text-[var(--shadow-text-primary)]">
        {label}
      </div>
    </button>
  )
}

function ReaderCircle({
  reader,
  active,
  onClick,
  fallbackName,
}) {
  const name =
    reader?.name ||
    reader?.username ||
    fallbackName

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[76px] shrink-0 text-center active:scale-95"
    >
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[17px] font-semibold text-[var(--shadow-text-primary)] ring-2 ${
          active
            ? 'ring-[#8b5cf6]'
            : 'ring-transparent'
        }`}
      >
        {reader?.avatar_url ? (
          <img
            src={reader.avatar_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          name.slice(0, 1).toUpperCase()
        )}
      </div>

      <div
        className={`mt-2 line-clamp-2 text-[11.5px] font-semibold leading-4 ${
          active
            ? 'text-[#6d28d9]'
            : 'text-[var(--shadow-text-secondary)]'
        }`}
      >
        {name}
      </div>
    </button>
  )
}

function ChoiceSheet({
  title,
  subtitle,
  options,
  value,
  onChoose,
  onBack,
  backLabel,
}) {
  return (
    <div className="fixed inset-0 z-[200010] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          aria-label={backLabel}
        >
          <i className="fa-solid fa-chevron-left text-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-[20px] font-normal leading-7">
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-1 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-3">
        {options.map((item) => {
          const active = item.key === value

          return (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                onChoose(item.key)
              }
              className="flex w-full items-center gap-4 rounded-[20px] px-2 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i
                  className={`${item.icon} text-[18px]`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-normal text-[var(--shadow-text-primary)]">
                  {item.title}
                </div>

                <div className="mt-0.5 text-[12.5px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                  {item.subtitle}
                </div>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active
                    ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-text-primary)]'
                    : 'border-[var(--shadow-border-strong)]'
                }`}
              >
                {active ? (
                  <i className="fa-solid fa-check text-[10px] text-[var(--shadow-bg-page)]" />
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function SocialEchoShareSheet({
  open,
  sourceType = 'post',
  sourceId,
  sourceName = 'Shadow',
  sourceAvatarUrl = '',
  sourceContent = '',
  sourceImageUrl = '',
  sourceLabel = '',
  shareUrl,
  onClose,
  onEchoed,
}) {
  const { t } = useDisplayTranslation()
  const sheetRef = useRef(null)
  const dragStartYRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const draggingRef = useRef(false)
  const [postText, setPostText] =
    useState('')
  const [message, setMessage] =
    useState('')
  const [destination, setDestination] =
    useState('feed')
  const [audience, setAudience] =
    useState('public')
  const [activePanel, setActivePanel] =
    useState('')
  const [selectedReaders, setSelectedReaders] =
    useState([])
  const [sending, setSending] =
    useState(false)
  const [followers, setFollowers] =
    useState([])
  const [followersLoading, setFollowersLoading] =
    useState(false)
  const [followersError, setFollowersError] =
    useState('')
  const [dragOffset, setDragOffset] =
    useState(0)
  const user = useMemo(
    () => getStoredUser(),
    []
  )

  const resolvedShareUrl = useMemo(
    () =>
      String(
        shareUrl || window.location.href
      ),
    [shareUrl]
  )

  const destinationOptions = DESTINATIONS.map((item) => ({
    ...item,
    title: t(`socialEchoShare.${item.titleKey}`),
    subtitle: t(`socialEchoShare.${item.subtitleKey}`),
  }))
  const audienceOptions = AUDIENCES.map((item) => ({
    ...item,
    title: t(`socialEchoShare.${item.titleKey}`),
    subtitle: t(`socialEchoShare.${item.subtitleKey}`),
  }))
  const resolvedSourceLabel =
    String(sourceLabel || '').trim() ||
    t('socialEchoShare.post')

  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    }
    const previousHtmlOverflow =
      html.style.overflow

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    dragOffsetRef.current = 0
    setDragOffset(0)
    setMessage('')

    return () => {
      html.style.overflow =
        previousHtmlOverflow
      body.style.overflow =
        previousBody.overflow
      body.style.position =
        previousBody.position
      body.style.top = previousBody.top
      body.style.left = previousBody.left
      body.style.right =
        previousBody.right
      body.style.width =
        previousBody.width
      window.scrollTo(0, scrollY)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const token = getReaderToken()
    const username = String(
      user?.username || ''
    ).trim()

    if (!token || !username) {
      setFollowers([])
      setFollowersError('')
      return undefined
    }

    let ignore = false

    async function loadFollowers() {
      try {
        setFollowersLoading(true)
        setFollowersError('')

        const response = await fetch(
          `${API_BASE_URL}/api/users/${encodeURIComponent(
            username
          )}/followers?page=1&limit=50`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
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
              t('socialEchoShare.followersLoadFailed')
          )
        }

        if (!ignore) {
          setFollowers(
            Array.isArray(data.users)
              ? data.users
              : []
          )
        }
      } catch (error) {
        if (!ignore) {
          setFollowers([])
          setFollowersError(
            error.message ||
              t('socialEchoShare.followersLoadFailed')
          )
        }
      } finally {
        if (!ignore) {
          setFollowersLoading(false)
        }
      }
    }

    loadFollowers()

    return () => {
      ignore = true
    }
  }, [open, t, user?.username])

  if (!open) return null

  const displayName =
    user?.name ||
    user?.username ||
    t('socialEchoShare.reader')
  const avatarLetter = displayName
    .slice(0, 1)
    .toUpperCase()
  const sourceLetter = String(
    sourceName || 'S'
  )
    .slice(0, 1)
    .toUpperCase()
  const destinationItem =
    destinationOptions.find(
      (item) => item.key === destination
    ) || destinationOptions[0]
  const audienceItem =
    audienceOptions.find(
      (item) => item.key === audience
    ) || audienceOptions[0]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        resolvedShareUrl
      )
      setMessage(t('socialEchoShare.linkCopied'))
    } catch {
      setMessage(resolvedShareUrl)
    }
  }

  const handleTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        resolvedShareUrl
      )}&text=${encodeURIComponent(
        `${sourceName} ${resolvedSourceLabel}`
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        resolvedShareUrl
      )}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleReaderToggle = (
    readerId
  ) => {
    const value = String(readerId || '')

    if (!value) return

    setSelectedReaders((current) =>
      current.includes(value)
        ? current.filter(
            (item) => item !== value
          )
        : [...current, value]
    )
  }

  const startDrag = (event) => {
    if (!event.isPrimary) return

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    draggingRef.current = true
    dragStartYRef.current = event.clientY
    dragOffsetRef.current = 0
    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    const nextOffset = Math.max(
      0,
      event.clientY -
        dragStartYRef.current
    )

    dragOffsetRef.current = nextOffset
    setDragOffset(nextOffset)
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    draggingRef.current = false

    if (dragOffsetRef.current > 80) {
      onClose?.()
      return
    }

    dragOffsetRef.current = 0
    setDragOffset(0)
  }

  const handleEchoNow = async () => {
    const normalizedSourceType = String(
      sourceType || ''
    )
      .trim()
      .toLowerCase()
    const normalizedSourceId = String(
      sourceId || ''
    ).trim()

    if (
      !normalizedSourceType ||
      !normalizedSourceId
    ) {
      setMessage(
        t('socialEchoShare.contentNotReady')
      )
      return
    }

    if (
      (destination === 'reader' ||
        destination === 'circle' ||
        audience === 'close-readers') &&
      !selectedReaders.length
    ) {
      setMessage(
        t('socialEchoShare.selectReader')
      )
      return
    }

    const token = getReaderToken()

    if (!token) {
      setMessage(
        t('socialEchoShare.loginBeforeEcho')
      )
      return
    }

    try {
      setSending(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/echoes`,
        {
          method: 'POST',
          headers: {
            Authorization:
              `Bearer ${token}`,
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            source_type:
              normalizedSourceType,
            source_id:
              normalizedSourceId,
            echo_text: postText.trim(),
            destination,
            audience,
            selected_reader_ids:
              selectedReaders,
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
            t('socialEchoShare.echoFailed')
        )
      }

      setPostText('')
      setMessage('')
      setSelectedReaders([])
      onEchoed?.(
        data.echo || null,
        Number(data.echo_count || 0)
      )
      onClose?.()
    } catch (error) {
      setMessage(
        error.message ||
          t('socialEchoShare.echoFailed')
      )
    } finally {
      setSending(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-end justify-center">
      <button
        type="button"
        aria-label={t('socialEchoShare.closeShare')}
        onClick={() => onClose?.()}
        className="absolute inset-0 bg-black/60"
      />

      <section
        ref={sheetRef}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[30px] bg-[var(--shadow-bg-page)] px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 shadow-2xl md:mb-5 md:max-w-[520px] md:rounded-[30px]"
        style={{
          transform:
            `translateY(${dragOffset}px)`,
          transition: draggingRef.current
            ? 'none'
            : 'transform 220ms ease',
        }}
      >
        <div
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          className="sticky top-0 z-20 mx-auto mb-4 flex h-5 w-20 cursor-grab items-start justify-center bg-[var(--shadow-bg-page)]"
          style={{ touchAction: 'none' }}
        >
          <div className="h-1.5 w-14 rounded-full bg-[var(--shadow-text-tertiary)]" />
        </div>

        <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-text-primary)] text-[18px] font-semibold text-[var(--shadow-bg-page)]">
              {user?.avatarUrl ||
              user?.avatar_url ? (
                <img
                  src={
                    user.avatarUrl ||
                    user.avatar_url
                  }
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-semibold text-[var(--shadow-text-primary)]">
                {displayName}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      'destination'
                    )
                  }
                  className="flex h-8 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-3 text-[12px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
                >
                  <span>
                    {destinationItem.title}
                  </span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActivePanel(
                      'audience'
                    )
                  }
                  className="flex h-8 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-3 text-[12px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
                >
                  <i
                    className={`${audienceItem.icon} text-[12px]`}
                  />
                  <span>
                    {audienceItem.title}
                  </span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>
              </div>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(event) =>
              setPostText(
                event.target.value
              )
            }
            rows={2}
            maxLength={280}
            placeholder={t('socialEchoShare.saySomething')}
            className="mt-3 w-full resize-none bg-transparent text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none placeholder:font-normal placeholder:text-[var(--shadow-placeholder)]"
          />

          <div className="mt-3 rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-3 ring-1 ring-[var(--shadow-border)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-semibold text-[var(--shadow-bg-page)]">
                {sourceAvatarUrl ? (
                  <img
                    src={sourceAvatarUrl}
                    alt={sourceName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  sourceLetter
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
                  {sourceName}
                </div>

                <p className="mt-1 line-clamp-3 whitespace-pre-wrap break-words text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                  {sourceContent ||
                    resolvedSourceLabel}
                </p>
              </div>

              {sourceImageUrl ? (
                <img
                  src={sourceImageUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-[10px] object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setMessage(
                  t('socialEchoShare.tagReaderSelected')
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:scale-95 active:bg-[var(--shadow-bg-hover)]"
              aria-label={t('socialEchoShare.tagReader')}
            >
              <i className="fa-solid fa-user-tag text-[18px]" />
            </button>

            <button
              type="button"
              onClick={handleEchoNow}
              disabled={sending}
              className="h-9 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] px-5 text-[13px] font-normal text-white shadow-[0_6px_16px_rgba(139,92,246,0.24)] active:scale-95 disabled:opacity-60"
            >
              {sending
                ? t('socialEchoShare.echoing')
                : t('socialEchoShare.echoNow')}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-3 rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-normal text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]">
            {message}
          </div>
        ) : null}

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-normal uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">
            {t('socialEchoShare.readers')}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1">
            {followersLoading ? (
              Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="w-[76px] shrink-0"
                  >
                    <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                    <div className="mx-auto mt-2 h-3 w-12 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                  </div>
                )
              )
            ) : followers.length ? (
              followers.map((reader) => (
                <ReaderCircle
                  key={reader.id}
                  reader={reader}
                  active={selectedReaders.includes(
                    String(reader.id)
                  )}
                  onClick={() =>
                    handleReaderToggle(
                      reader.id
                    )
                  }
                  fallbackName={t('socialEchoShare.reader')}
                />
              ))
            ) : (
              <div className="py-3 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
                {followersError ||
                  t('socialEchoShare.noFollowers')}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-normal uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">
            {t('socialEchoShare.shareOutside')}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            <ShareCircle
              label={t('socialEchoShare.copyLink')}
              iconNode={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[23px] w-[23px]"
                >
                  <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
                  <path d="M14 11a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 20.07l1.15-1.15" />
                </svg>
              }
              onClick={handleCopyLink}
            />

            <ShareCircle
              icon="fa-brands fa-telegram"
              label="Telegram"
              bg="bg-[#2aabee]"
              color="text-white"
              onClick={handleTelegram}
            />

            <ShareCircle
              icon="fa-brands fa-facebook-f"
              label="Facebook"
              bg="bg-[#1877f2]"
              color="text-white"
              onClick={handleFacebook}
            />
          </div>
        </div>
      </section>

      {activePanel === 'destination' ? (
        <ChoiceSheet
          title={t('socialEchoShare.destinationTitle')}
          subtitle={t('socialEchoShare.destinationSubtitle')}
          options={destinationOptions}
          value={destination}
          onBack={() =>
            setActivePanel('')
          }
          backLabel={t('socialEchoShare.back')}
          onChoose={(value) => {
            setDestination(value)
            setActivePanel('')
          }}
        />
      ) : null}

      {activePanel === 'audience' ? (
        <ChoiceSheet
          title={t('socialEchoShare.audienceTitle')}
          subtitle={t('socialEchoShare.audienceSubtitle')}
          options={audienceOptions}
          value={audience}
          onBack={() =>
            setActivePanel('')
          }
          backLabel={t('socialEchoShare.back')}
          onChoose={(value) => {
            setAudience(value)
            setActivePanel('')
          }}
        />
      ) : null}
    </div>,
    document.body
  )
}
