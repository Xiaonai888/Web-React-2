import { useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerEchoShareSheet', {
  en: {
    echoToFeed: 'Echo to Feed',
    echoToFeedDescription: 'Show this echo in your Shadow feed and profile.',
    addToShadow: 'Add to My Shadow',
    addToShadowDescription: 'Keep this echo on your own Shadow space.',
    sendToReader: 'Send to Reader',
    sendToReaderDescription: 'Share this story with selected readers.',
    echoToCircle: 'Echo to Circle',
    echoToCircleDescription: 'Share this echo with your reading circle.',
    public: 'Public',
    publicDescription: 'Anyone on Shadow can view this echo.',
    followers: 'Followers',
    followersDescription: 'Only people who follow you can view this echo.',
    closeReaders: 'Close readers',
    closeReadersDescription: 'Only your selected close readers can view it.',
    onlyMe: 'Only me',
    onlyMeDescription: 'Keep this echo private.',
    reader: 'Reader',
    author: 'Author',
    linkCopied: 'Link copied.',
    shadowStory: 'Shadow story',
    tagReaderSelected: 'Tag reader is selected for the next update.',
    episodeNotReady: 'Episode is not ready yet.',
    loginBeforeEchoing: 'Please log in before echoing.',
    failedEchoEpisode: 'Failed to echo episode.',
    untitledStory: 'Untitled Story',
    story: 'Story',
    saySomething: 'Say something...',
    echoing: 'Echoing...',
    echoNow: 'Echo now',
    readers: 'Readers',
    shareOutsideShadow: 'Share outside Shadow',
    copyLink: 'Copy link',
    echoDestination: 'Echo destination',
    echoDestinationDescription: 'Choose where this echo should appear on Shadow.',
    echoAudience: 'Who can view this echo?',
    echoAudienceDescription: 'Choose who can see your echo on Shadow.',
  },
  km: {
    echoToFeed: 'Echo ទៅ Feed',
    echoToFeedDescription: 'បង្ហាញ Echo នេះនៅក្នុង Feed និងប្រវត្តិរូប Shadow របស់អ្នក។',
    addToShadow: 'បន្ថែមទៅ My Shadow',
    addToShadowDescription: 'រក្សា Echo នេះនៅក្នុងកន្លែង Shadow ផ្ទាល់ខ្លួនរបស់អ្នក។',
    sendToReader: 'ផ្ញើទៅអ្នកអាន',
    sendToReaderDescription: 'ចែករំលែករឿងនេះទៅអ្នកអានដែលបានជ្រើសរើស។',
    echoToCircle: 'Echo ទៅ Circle',
    echoToCircleDescription: 'ចែករំលែក Echo នេះជាមួយរង្វង់អ្នកអានរបស់អ្នក។',
    public: 'សាធារណៈ',
    publicDescription: 'អ្នកគ្រប់គ្នានៅលើ Shadow អាចមើល Echo នេះបាន។',
    followers: 'អ្នកតាមដាន',
    followersDescription: 'មានតែអ្នកដែលតាមដានអ្នកប៉ុណ្ណោះអាចមើល Echo នេះបាន។',
    closeReaders: 'អ្នកអានជិតស្និទ្ធ',
    closeReadersDescription: 'មានតែអ្នកអានជិតស្និទ្ធដែលអ្នកបានជ្រើសរើសប៉ុណ្ណោះអាចមើលបាន។',
    onlyMe: 'ខ្ញុំតែប៉ុណ្ណោះ',
    onlyMeDescription: 'រក្សា Echo នេះជាឯកជន។',
    reader: 'អ្នកអាន',
    author: 'អ្នកនិពន្ធ',
    linkCopied: 'បានចម្លងតំណ។',
    shadowStory: 'រឿងនៅ Shadow',
    tagReaderSelected: 'បានជ្រើស Tag អ្នកអានសម្រាប់ការអាប់ដេតបន្ទាប់។',
    episodeNotReady: 'ភាគនេះមិនទាន់រួចរាល់ទេ។',
    loginBeforeEchoing: 'សូមចូលគណនីមុនពេល Echo។',
    failedEchoEpisode: 'មិនអាច Echo ភាគនេះបានទេ។',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    story: 'រឿង',
    saySomething: 'សរសេរអ្វីមួយ...',
    echoing: 'កំពុង Echo...',
    echoNow: 'Echo ឥឡូវនេះ',
    readers: 'អ្នកអាន',
    shareOutsideShadow: 'ចែករំលែកក្រៅ Shadow',
    copyLink: 'ចម្លងតំណ',
    echoDestination: 'ទីតាំង Echo',
    echoDestinationDescription: 'ជ្រើសកន្លែងដែល Echo នេះនឹងបង្ហាញនៅលើ Shadow។',
    echoAudience: 'អ្នកណាអាចមើល Echo នេះ?',
    echoAudienceDescription: 'ជ្រើសអ្នកដែលអាចមើល Echo របស់អ្នកនៅលើ Shadow។',
  },
  zh: {
    echoToFeed: 'Echo 到动态',
    echoToFeedDescription: '在你的 Shadow 动态和个人主页中显示此 Echo。',
    addToShadow: '添加到 My Shadow',
    addToShadowDescription: '将此 Echo 保存在你自己的 Shadow 空间中。',
    sendToReader: '发送给读者',
    sendToReaderDescription: '将此故事分享给选中的读者。',
    echoToCircle: 'Echo 到圈子',
    echoToCircleDescription: '将此 Echo 分享到你的阅读圈。',
    public: '公开',
    publicDescription: 'Shadow 上的任何人都可以查看此 Echo。',
    followers: '关注者',
    followersDescription: '只有关注你的人可以查看此 Echo。',
    closeReaders: '亲密读者',
    closeReadersDescription: '只有你选中的亲密读者可以查看。',
    onlyMe: '仅自己',
    onlyMeDescription: '将此 Echo 设为私密。',
    reader: '读者',
    author: '作者',
    linkCopied: '链接已复制。',
    shadowStory: 'Shadow 故事',
    tagReaderSelected: '已选择标记读者，将用于下一次更新。',
    episodeNotReady: '此章节尚未准备好。',
    loginBeforeEchoing: '请先登录再进行 Echo。',
    failedEchoEpisode: '无法 Echo 此章节。',
    untitledStory: '未命名故事',
    story: '故事',
    saySomething: '说点什么...',
    echoing: '正在 Echo...',
    echoNow: '立即 Echo',
    readers: '读者',
    shareOutsideShadow: '分享到 Shadow 之外',
    copyLink: '复制链接',
    echoDestination: 'Echo 位置',
    echoDestinationDescription: '选择此 Echo 在 Shadow 上显示的位置。',
    echoAudience: '谁可以查看此 Echo？',
    echoAudienceDescription: '选择谁可以在 Shadow 上看到你的 Echo。',
  },
  ja: {
    echoToFeed: 'フィードに Echo',
    echoToFeedDescription: 'Shadow のフィードとプロフィールにこの Echo を表示します。',
    addToShadow: 'My Shadow に追加',
    addToShadowDescription: 'この Echo を自分の Shadow スペースに保存します。',
    sendToReader: '読者に送信',
    sendToReaderDescription: '選択した読者にこのストーリーを共有します。',
    echoToCircle: 'サークルに Echo',
    echoToCircleDescription: '読書サークルにこの Echo を共有します。',
    public: '公開',
    publicDescription: 'Shadow 上の誰でもこの Echo を見ることができます。',
    followers: 'フォロワー',
    followersDescription: 'あなたをフォローしている人だけがこの Echo を見られます。',
    closeReaders: '親しい読者',
    closeReadersDescription: '選択した親しい読者だけが見ることができます。',
    onlyMe: '自分のみ',
    onlyMeDescription: 'この Echo を非公開にします。',
    reader: '読者',
    author: '作者',
    linkCopied: 'リンクをコピーしました。',
    shadowStory: 'Shadow ストーリー',
    tagReaderSelected: '次の更新用に読者タグを選択しました。',
    episodeNotReady: 'このエピソードはまだ準備できていません。',
    loginBeforeEchoing: 'Echo する前にログインしてください。',
    failedEchoEpisode: 'エピソードを Echo できませんでした。',
    untitledStory: '無題のストーリー',
    story: 'ストーリー',
    saySomething: '何か書いてください...',
    echoing: 'Echo 中...',
    echoNow: '今すぐ Echo',
    readers: '読者',
    shareOutsideShadow: 'Shadow の外に共有',
    copyLink: 'リンクをコピー',
    echoDestination: 'Echo の送信先',
    echoDestinationDescription: 'この Echo を Shadow のどこに表示するか選択します。',
    echoAudience: 'この Echo を見られる人は？',
    echoAudienceDescription: 'Shadow 上でこの Echo を見られる人を選択します。',
  },
  ko: {
    echoToFeed: '피드에 Echo',
    echoToFeedDescription: 'Shadow 피드와 프로필에 이 Echo를 표시합니다.',
    addToShadow: 'My Shadow에 추가',
    addToShadowDescription: '이 Echo를 내 Shadow 공간에 보관합니다.',
    sendToReader: '독자에게 보내기',
    sendToReaderDescription: '선택한 독자에게 이 스토리를 공유합니다.',
    echoToCircle: '서클에 Echo',
    echoToCircleDescription: '내 독서 서클에 이 Echo를 공유합니다.',
    public: '공개',
    publicDescription: 'Shadow의 누구나 이 Echo를 볼 수 있습니다.',
    followers: '팔로워',
    followersDescription: '나를 팔로우하는 사람만 이 Echo를 볼 수 있습니다.',
    closeReaders: '친한 독자',
    closeReadersDescription: '선택한 친한 독자만 볼 수 있습니다.',
    onlyMe: '나만 보기',
    onlyMeDescription: '이 Echo를 비공개로 유지합니다.',
    reader: '독자',
    author: '작가',
    linkCopied: '링크를 복사했습니다.',
    shadowStory: 'Shadow 스토리',
    tagReaderSelected: '다음 업데이트에 사용할 독자 태그를 선택했습니다.',
    episodeNotReady: '에피소드가 아직 준비되지 않았습니다.',
    loginBeforeEchoing: 'Echo하기 전에 로그인해 주세요.',
    failedEchoEpisode: '에피소드를 Echo하지 못했습니다.',
    untitledStory: '제목 없는 스토리',
    story: '스토리',
    saySomething: '내용을 입력하세요...',
    echoing: 'Echo 중...',
    echoNow: '지금 Echo',
    readers: '독자',
    shareOutsideShadow: 'Shadow 밖으로 공유',
    copyLink: '링크 복사',
    echoDestination: 'Echo 위치',
    echoDestinationDescription: '이 Echo가 Shadow 어디에 표시될지 선택하세요.',
    echoAudience: '이 Echo를 볼 수 있는 사람은?',
    echoAudienceDescription: 'Shadow에서 내 Echo를 볼 수 있는 사람을 선택하세요.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

const DESTINATIONS = [
  {
    key: 'feed',
    titleKey: 'echoToFeed',
    subtitleKey: 'echoToFeedDescription',
    icon: 'fa-solid fa-newspaper',
  },
  {
    key: 'shadow',
    titleKey: 'addToShadow',
    subtitleKey: 'addToShadowDescription',
    icon: 'fa-regular fa-circle-user',
  },
  {
    key: 'reader',
    titleKey: 'sendToReader',
    subtitleKey: 'sendToReaderDescription',
    icon: 'fa-solid fa-user-group',
  },
  {
    key: 'circle',
    titleKey: 'echoToCircle',
    subtitleKey: 'echoToCircleDescription',
    icon: 'fa-solid fa-users',
  },
]

const AUDIENCES = [
  {
    key: 'public',
    titleKey: 'public',
    subtitleKey: 'publicDescription',
    icon: 'fa-solid fa-earth-americas',
  },
  {
    key: 'followers',
    titleKey: 'followers',
    subtitleKey: 'followersDescription',
    icon: 'fa-solid fa-user-check',
  },
  {
    key: 'close-readers',
    titleKey: 'closeReaders',
    subtitleKey: 'closeReadersDescription',
    icon: 'fa-solid fa-star',
  },
  {
    key: 'only-me',
    titleKey: 'onlyMe',
    subtitleKey: 'onlyMeDescription',
    icon: 'fa-solid fa-lock',
  },
]

const QUICK_READERS = ['Pha Mey', 'Moon', 'Reader', 'Friend', 'Author']

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

function getAuthorName(story, fallback = 'Author') {
  return (
    story?.author_page?.page_name ||
    story?.authorPage?.page_name ||
    story?.author?.page_name ||
    story?.author_name ||
    fallback
  )
}

function getStoryLink(story) {
  if (!story?.id) return window.location.href
  return `${window.location.origin}/story/${story.id}`
}

function getId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function ShareCircle({ icon, label, bg = 'bg-[var(--shadow-bg-surface)]', color = 'text-[var(--shadow-text-primary)]', onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-[82px] shrink-0 text-center active:scale-95">
      <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-1 ring-[var(--shadow-border)] ${bg} ${color}`}>
        <i className={`${icon} text-[22px]`} />
      </div>
      <div className="mt-2 text-[12px] font-bold leading-4 text-[var(--shadow-text-primary)]">{label}</div>
    </button>
  )
}

function ReaderCircle({ name, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-[76px] shrink-0 text-center active:scale-95">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[17px] font-black ring-2 ${
          active
            ? 'bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] ring-[#f6a800]'
            : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] ring-transparent'
        }`}
      >
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div className={`mt-2 line-clamp-2 text-[11.5px] font-bold leading-4 ${active ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-secondary)]'}`}>
        {name}
      </div>
    </button>
  )
}

function ChoiceSheet({ title, subtitle, options, value, onChoose, onBack, t }) {
  return (
    <div className="fixed inset-0 z-[190] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-4 py-4">
        <button type="button" onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
          <i className="fa-solid fa-chevron-left text-[18px]" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-[22px] font-black leading-7">{title}</h2>
          {subtitle ? <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">{subtitle}</p> : null}
        </div>
      </div>

      <div className="px-4 py-3">
        {options.map((item) => {
          const active = item.key === value

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChoose(item.key)}
              className="flex w-full items-center gap-4 rounded-[20px] px-2 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className={`${item.icon} text-[18px]`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t(`readerEchoShareSheet.${item.titleKey}`)}</div>
                <div className="mt-0.5 text-[12.5px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">{t(`readerEchoShareSheet.${item.subtitleKey}`)}</div>
              </div>

              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                active ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-[var(--shadow-border-strong)]'
              }`}>
                {active ? <i className="fa-solid fa-check text-[10px] text-white" /> : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function EchoShareSheet({ open, story, episode, onClose, onEchoed }) {
  const [postText, setPostText] = useState('')
  const [message, setMessage] = useState('')
  const [destination, setDestination] = useState('feed')
  const [audience, setAudience] = useState('public')
  const [activePanel, setActivePanel] = useState('')
  const [selectedReaders, setSelectedReaders] = useState([])
  const [sending, setSending] = useState(false)
  const { t } = useDisplayTranslation()
  const user = useMemo(() => getStoredUser(), [])
  const storyLink = useMemo(() => getStoryLink(story), [story])
  const authorName = getAuthorName(story, t('readerEchoShareSheet.author'))

  if (!open) return null

  const displayName = user?.name || user?.username || t('readerEchoShareSheet.reader')
  const avatarLetter = displayName.slice(0, 1).toUpperCase()
  const destinationItem = DESTINATIONS.find((item) => item.key === destination) || DESTINATIONS[0]
  const audienceItem = AUDIENCES.find((item) => item.key === audience) || AUDIENCES[0]
  const destinationTitle = t(`readerEchoShareSheet.${destinationItem.titleKey}`)
  const audienceTitle = t(`readerEchoShareSheet.${audienceItem.titleKey}`)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storyLink)
      setMessage(t('readerEchoShareSheet.linkCopied'))
    } catch {
      setMessage(storyLink)
    }
  }

  const handleTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(storyLink)}&text=${encodeURIComponent(story?.title || t('readerEchoShareSheet.shadowStory'))}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyLink)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleReaderToggle = (name) => {
    setSelectedReaders((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    )
  }

  const handleTagClick = () => {
    setMessage(t('readerEchoShareSheet.tagReaderSelected'))
  }

  const handleEchoNow = async () => {
    if (!story?.id || !episode?.id) {
      setMessage(t('readerEchoShareSheet.episodeNotReady'))
      return
    }

    const token = getReaderToken()

    if (!token) {
      setMessage(t('readerEchoShareSheet.loginBeforeEchoing'))
      return
    }

    try {
      setSending(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/echoes/episode/${episode.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            echo_text: postText.trim(),
            destination,
            audience,
          }),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('readerEchoShareSheet.failedEchoEpisode'))
      }

      const post = {
        id: data.echo?.id || getId(),
        type: 'echo',
        story_id: story.id,
        episode_id: episode.id,
        story_title: story.title || t('readerEchoShareSheet.untitledStory'),
        episode_title: episode.title || '',
        story_cover_url: story.cover_url || '',
        story_author_name: authorName,
        story_genre: story.main_genre || t('readerEchoShareSheet.story'),
        echo_text: postText.trim(),
        destination,
        destination_label: destinationTitle,
        audience,
        audience_label: audienceTitle,
        selected_readers: selectedReaders,
        user_name: displayName,
        created_at: data.echo?.created_at || new Date().toISOString(),
      }

      saveEchoPost(post)
      setPostText('')
      setMessage('')
      setSelectedReaders([])
      onEchoed?.(data.echo || post)
      onClose()
    } catch (error) {
      setMessage(error.message || t('readerEchoShareSheet.failedEchoEpisode'))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/40">
      <button type="button" aria-label="Close echo share" onClick={onClose} className="absolute inset-0" />

      <section className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-[var(--shadow-bg-page)] px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 shadow-2xl md:mb-5 md:max-w-[520px] md:rounded-[30px]">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[var(--shadow-border-strong)]" />

        <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-text-primary)] text-[18px] font-black text-[var(--shadow-bg-surface)]">
              {user?.avatarUrl || user?.avatar_url ? (
                <img src={user.avatarUrl || user.avatar_url} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 text-[16px] font-black text-[var(--shadow-text-primary)]">{displayName}</div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActivePanel('destination')}
                  className="flex h-8 items-center gap-2 rounded-[12px] bg-[var(--shadow-bg-soft)] px-3 text-[12px] font-black text-[var(--shadow-text-primary)] active:scale-95"
                >
                  <span>{destinationTitle}</span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>

                <button
                  type="button"
                  onClick={() => setActivePanel('audience')}
                  className="flex h-8 items-center gap-2 rounded-[12px] bg-[var(--shadow-bg-soft)] px-3 text-[12px] font-black text-[var(--shadow-text-primary)] active:scale-95"
                >
                  <i className={`${audienceItem.icon} text-[12px]`} />
                  <span>{audienceTitle}</span>
                  <i className="fa-solid fa-caret-down text-[11px]" />
                </button>
              </div>
            </div>
          </div>

          <textarea
            value={postText}
            onChange={(event) => setPostText(event.target.value)}
            rows={3}
            maxLength={280}
            placeholder={t('readerEchoShareSheet.saySomething')}
            className="mt-4 w-full resize-none bg-transparent text-[18px] font-semibold leading-7 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
          />

          <div className="mt-2 flex items-center justify-between">
            <button type="button" onClick={handleTagClick} className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:scale-95 active:bg-[var(--shadow-bg-hover)]">
              <i className="fa-solid fa-user-tag text-[18px]" />
            </button>

            <button
              type="button"
              onClick={handleEchoNow}
              disabled={sending}
              className="h-11 rounded-[13px] bg-[var(--shadow-text-primary)] px-5 text-[15px] font-black text-[var(--shadow-bg-surface)] active:scale-95 disabled:opacity-60"
            >
              {sending ? t('readerEchoShareSheet.echoing') : t('readerEchoShareSheet.echoNow')}
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-3 rounded-[16px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-bold text-[var(--shadow-text-secondary)] ring-1 ring-[var(--shadow-border)]">
            {message}
          </div>
        ) : null}

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">{t('readerEchoShareSheet.readers')}</div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {QUICK_READERS.map((name) => (
              <ReaderCircle
                key={name}
                name={name}
                active={selectedReaders.includes(name)}
                onClick={() => handleReaderToggle(name)}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 text-[12px] font-black uppercase tracking-[0.08em] text-[var(--shadow-text-tertiary)]">{t('readerEchoShareSheet.shareOutsideShadow')}</div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <ShareCircle icon="fa-solid fa-link" label={t('readerEchoShareSheet.copyLink')} onClick={handleCopyLink} />
            <ShareCircle icon="fa-brands fa-telegram" label="Telegram" bg="bg-[#2aabee]" color="text-white" onClick={handleTelegram} />
            <ShareCircle icon="fa-brands fa-facebook-f" label="Facebook" bg="bg-[#1877f2]" color="text-white" onClick={handleFacebook} />
          </div>
        </div>
      </section>

      {activePanel === 'destination' ? (
        <ChoiceSheet
          title={t('readerEchoShareSheet.echoDestination')}
          subtitle={t('readerEchoShareSheet.echoDestinationDescription')}
          options={DESTINATIONS}
          value={destination}
          t={t}
          onBack={() => setActivePanel('')}
          onChoose={(value) => {
            setDestination(value)
            setActivePanel('')
          }}
        />
      ) : null}

      {activePanel === 'audience' ? (
        <ChoiceSheet
          title={t('readerEchoShareSheet.echoAudience')}
          subtitle={t('readerEchoShareSheet.echoAudienceDescription')}
          options={AUDIENCES}
          value={audience}
          t={t}
          onBack={() => setActivePanel('')}
          onChoose={(value) => {
            setAudience(value)
            setActivePanel('')
          }}
        />
      ) : null}
    </div>
  )
}
