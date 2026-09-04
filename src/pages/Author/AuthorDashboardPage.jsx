import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthorStudioBottomNav from '../../components/AuthorStudioBottomNav'
import Author49DayDashboardCard from '../../components/events/Author49DayDashboardCard'
import AuthorManagedEventsSection from '../../components/events/AuthorManagedEventsSection'
import { fetchMyAuthorPageCached } from '../../services/myAuthorPageClientCache.js'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDashboard', {
  en: {
    recently: 'Recently',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    untitledStory: 'Untitled Story',
    novel: 'Novel',
    manga: 'Manga',
    chatStory: 'Chat Story',
    episodeNumber: 'Episode {{number}}',
    storyInfo: 'Story Info',
    closeMenu: 'Close menu',
    authorTools: 'Author Tools',
    closeAuthorTools: 'Close author tools',
    myIncome: 'My Income',
    incomeSubtitle: 'Earnings and payout details',
    quest: 'Quest',
    questSubtitle: 'Tasks and creator rewards',
    authorBenefits: 'Author Benefits',
    benefitsSubtitle: 'Creator programs and support',
    commentProtection: 'Comment Protection',
    commentProtectionSubtitle: 'Blocked words and hidden comments',
    trash: 'Trash',
    trashSubtitle: 'Restore deleted stories within 30 days',
    selectStory: 'Select {{title}}',
    published: 'Published',
    reviewing: 'Reviewing',
    draft: 'Draft',
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    episodes: 'Episodes',
    addEpisode: 'Add Episode',
    manage: 'Manage',
    inbox: 'Inbox',
    authorPageName: 'Author Page Name',
    loadStoriesFailed: 'Failed to load stories',
    cannotConnect: 'Cannot connect to backend. Please check backend deployment.',
    authorPageMissing: 'Author page data is missing. Please refresh and try again.',
    comingSoon: '{{type}} is coming soon. Novel publishing is available now.',
    back: 'Go back',
    title: 'Author Dashboard',
    notifications: 'Notifications',
    addToStory: 'Add to story',
    keepWriting: 'Keep writing. Your story is waiting.',
    drafts: 'Drafts',
    continueWriting: 'Continue Writing',
    view: 'View',
    continueWritingStory: 'Continue writing {{title}}',
    latestDraft: 'Latest draft',
    updatedDate: 'Updated {{date}}',
    continue: 'Continue',
    stories: 'Stories',
    loading: 'Loading...',
    storyCount: '{{count}} stories',
    noStories: 'No stories yet',
    noStoriesBody: 'Create your first story to see it here.',
    createStory: 'Create Story',
  },
  km: {
    recently: 'ថ្មីៗនេះ',
    goodMorning: 'អរុណសួស្តី',
    goodAfternoon: 'សួស្តីពេលរសៀល',
    goodEvening: 'សួស្តីពេលល្ងាច',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    novel: 'ប្រលោមលោក',
    manga: 'Manga',
    chatStory: 'Chat Story',
    episodeNumber: 'ភាគ {{number}}',
    storyInfo: 'ព័ត៌មានរឿង',
    closeMenu: 'បិទម៉ឺនុយ',
    authorTools: 'ឧបករណ៍អ្នកនិពន្ធ',
    closeAuthorTools: 'បិទឧបករណ៍អ្នកនិពន្ធ',
    myIncome: 'ចំណូលរបស់ខ្ញុំ',
    incomeSubtitle: 'ចំណូល និងព័ត៌មានបង់ប្រាក់',
    quest: 'Quest',
    questSubtitle: 'បេសកកម្ម និងរង្វាន់អ្នកបង្កើត',
    authorBenefits: 'អត្ថប្រយោជន៍អ្នកនិពន្ធ',
    benefitsSubtitle: 'កម្មវិធី និងការគាំទ្រអ្នកបង្កើត',
    commentProtection: 'ការការពារមតិយោបល់',
    commentProtectionSubtitle: 'ពាក្យហាម និងមតិយោបល់ដែលបានលាក់',
    trash: 'ធុងសំរាម',
    trashSubtitle: 'ស្តាររឿងដែលបានលុបក្នុង 30 ថ្ងៃ',
    selectStory: 'ជ្រើស {{title}}',
    published: 'បានបោះពុម្ព',
    reviewing: 'កំពុងពិនិត្យ',
    draft: 'ព្រាង',
    views: 'ទស្សនា',
    likes: 'ចូលចិត្ត',
    comments: 'មតិយោបល់',
    episodes: 'ភាគ',
    addEpisode: 'បន្ថែមភាគ',
    manage: 'គ្រប់គ្រង',
    inbox: 'ប្រអប់សារ',
    authorPageName: 'ឈ្មោះទំព័រអ្នកនិពន្ធ',
    loadStoriesFailed: 'មិនអាចផ្ទុករឿងបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។ សូមពិនិត្យការដាក់ Server។',
    authorPageMissing: 'មិនមានព័ត៌មានទំព័រអ្នកនិពន្ធ។ សូម Refresh ហើយសាកម្តងទៀត។',
    comingSoon: '{{type}} នឹងមកដល់ឆាប់ៗ។ ឥឡូវនេះអាចបោះពុម្ព Novel បាន។',
    back: 'ត្រឡប់ក្រោយ',
    title: 'Dashboard អ្នកនិពន្ធ',
    notifications: 'ការជូនដំណឹង',
    addToStory: 'បន្ថែមទៅ Story',
    keepWriting: 'បន្តសរសេរ។ រឿងរបស់អ្នកកំពុងរង់ចាំ។',
    drafts: 'រឿងព្រាង',
    continueWriting: 'បន្តសរសេរ',
    view: 'មើល',
    continueWritingStory: 'បន្តសរសេរ {{title}}',
    latestDraft: 'ព្រាងថ្មីបំផុត',
    updatedDate: 'បានកែ {{date}}',
    continue: 'បន្ត',
    stories: 'រឿង',
    loading: 'កំពុងផ្ទុក...',
    storyCount: '{{count}} រឿង',
    noStories: 'មិនទាន់មានរឿង',
    noStoriesBody: 'បង្កើតរឿងដំបូងរបស់អ្នក ដើម្បីឱ្យវាបង្ហាញនៅទីនេះ។',
    createStory: 'បង្កើតរឿង',
  },
  zh: {
    recently: '最近',
    goodMorning: '早上好',
    goodAfternoon: '下午好',
    goodEvening: '晚上好',
    untitledStory: '未命名故事',
    novel: '小说',
    manga: '漫画',
    chatStory: '聊天故事',
    episodeNumber: '第 {{number}} 章',
    storyInfo: '故事信息',
    closeMenu: '关闭菜单',
    authorTools: '作者工具',
    closeAuthorTools: '关闭作者工具',
    myIncome: '我的收入',
    incomeSubtitle: '收入和付款详情',
    quest: '任务',
    questSubtitle: '任务和创作者奖励',
    authorBenefits: '作者权益',
    benefitsSubtitle: '创作者计划和支持',
    commentProtection: '评论保护',
    commentProtectionSubtitle: '屏蔽词和隐藏评论',
    trash: '回收站',
    trashSubtitle: '30天内恢复已删除故事',
    selectStory: '选择 {{title}}',
    published: '已发布',
    reviewing: '审核中',
    draft: '草稿',
    views: '浏览',
    likes: '点赞',
    comments: '评论',
    episodes: '章节',
    addEpisode: '添加章节',
    manage: '管理',
    inbox: '收件箱',
    authorPageName: '作者主页名称',
    loadStoriesFailed: '无法加载故事',
    cannotConnect: '无法连接后端，请检查部署。',
    authorPageMissing: '缺少作者主页数据，请刷新后重试。',
    comingSoon: '{{type}} 即将推出。目前可发布小说。',
    back: '返回',
    title: '作者控制台',
    notifications: '通知',
    addToStory: '添加到 Story',
    keepWriting: '继续创作，你的故事正在等待。',
    drafts: '草稿',
    continueWriting: '继续写作',
    view: '查看',
    continueWritingStory: '继续写 {{title}}',
    latestDraft: '最新草稿',
    updatedDate: '更新于 {{date}}',
    continue: '继续',
    stories: '故事',
    loading: '加载中...',
    storyCount: '{{count}} 个故事',
    noStories: '暂无故事',
    noStoriesBody: '创建你的第一个故事后会显示在这里。',
    createStory: '创建故事',
  },
  ja: {
    recently: '最近',
    goodMorning: 'おはようございます',
    goodAfternoon: 'こんにちは',
    goodEvening: 'こんばんは',
    untitledStory: '無題のストーリー',
    novel: '小説',
    manga: 'マンガ',
    chatStory: 'チャットストーリー',
    episodeNumber: 'エピソード {{number}}',
    storyInfo: 'ストーリー情報',
    closeMenu: 'メニューを閉じる',
    authorTools: '作者ツール',
    closeAuthorTools: '作者ツールを閉じる',
    myIncome: '収益',
    incomeSubtitle: '収益と支払いの詳細',
    quest: 'クエスト',
    questSubtitle: 'タスクとクリエイター報酬',
    authorBenefits: '作者特典',
    benefitsSubtitle: 'クリエイタープログラムとサポート',
    commentProtection: 'コメント保護',
    commentProtectionSubtitle: 'ブロック語句と非表示コメント',
    trash: 'ゴミ箱',
    trashSubtitle: '30日以内の削除済みストーリーを復元',
    selectStory: '{{title}} を選択',
    published: '公開済み',
    reviewing: '審査中',
    draft: '下書き',
    views: '閲覧',
    likes: 'いいね',
    comments: 'コメント',
    episodes: 'エピソード',
    addEpisode: 'エピソード追加',
    manage: '管理',
    inbox: '受信箱',
    authorPageName: '作者ページ名',
    loadStoriesFailed: 'ストーリーを読み込めませんでした',
    cannotConnect: 'バックエンドに接続できません。デプロイを確認してください。',
    authorPageMissing: '作者ページのデータがありません。更新して再試行してください。',
    comingSoon: '{{type}} は近日公開予定です。現在は小説を公開できます。',
    back: '戻る',
    title: '作者ダッシュボード',
    notifications: '通知',
    addToStory: 'Story に追加',
    keepWriting: '書き続けましょう。ストーリーが待っています。',
    drafts: '下書き',
    continueWriting: '執筆を続ける',
    view: '表示',
    continueWritingStory: '{{title}} の執筆を続ける',
    latestDraft: '最新の下書き',
    updatedDate: '{{date}} 更新',
    continue: '続ける',
    stories: 'ストーリー',
    loading: '読み込み中...',
    storyCount: '{{count}} ストーリー',
    noStories: 'ストーリーはまだありません',
    noStoriesBody: '最初のストーリーを作成するとここに表示されます。',
    createStory: 'ストーリーを作成',
  },
  ko: {
    recently: '최근',
    goodMorning: '좋은 아침입니다',
    goodAfternoon: '안녕하세요',
    goodEvening: '좋은 저녁입니다',
    untitledStory: '제목 없는 스토리',
    novel: '소설',
    manga: '만화',
    chatStory: '채팅 스토리',
    episodeNumber: '에피소드 {{number}}',
    storyInfo: '스토리 정보',
    closeMenu: '메뉴 닫기',
    authorTools: '작가 도구',
    closeAuthorTools: '작가 도구 닫기',
    myIncome: '내 수입',
    incomeSubtitle: '수입 및 지급 정보',
    quest: '퀘스트',
    questSubtitle: '작업과 크리에이터 보상',
    authorBenefits: '작가 혜택',
    benefitsSubtitle: '크리에이터 프로그램과 지원',
    commentProtection: '댓글 보호',
    commentProtectionSubtitle: '차단 단어 및 숨긴 댓글',
    trash: '휴지통',
    trashSubtitle: '30일 이내 삭제된 스토리 복원',
    selectStory: '{{title}} 선택',
    published: '게시됨',
    reviewing: '검토 중',
    draft: '초안',
    views: '조회',
    likes: '좋아요',
    comments: '댓글',
    episodes: '에피소드',
    addEpisode: '에피소드 추가',
    manage: '관리',
    inbox: '받은 편지함',
    authorPageName: '작가 페이지 이름',
    loadStoriesFailed: '스토리를 불러오지 못했습니다',
    cannotConnect: '백엔드에 연결할 수 없습니다. 배포를 확인하세요.',
    authorPageMissing: '작가 페이지 데이터가 없습니다. 새로고침 후 다시 시도하세요.',
    comingSoon: '{{type}} 기능은 곧 제공됩니다. 현재는 소설을 게시할 수 있습니다.',
    back: '뒤로',
    title: '작가 대시보드',
    notifications: '알림',
    addToStory: 'Story에 추가',
    keepWriting: '계속 써보세요. 스토리가 기다리고 있습니다.',
    drafts: '초안',
    continueWriting: '계속 쓰기',
    view: '보기',
    continueWritingStory: '{{title}} 계속 쓰기',
    latestDraft: '최신 초안',
    updatedDate: '{{date}} 업데이트',
    continue: '계속',
    stories: '스토리',
    loading: '불러오는 중...',
    storyCount: '스토리 {{count}}개',
    noStories: '아직 스토리가 없습니다',
    noStoriesBody: '첫 스토리를 만들면 여기에 표시됩니다.',
    createStory: '스토리 만들기',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const AUTHOR_PREVIEW_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_AUTHOR_PREVIEW === 'true'

const MOCK_AUTHOR_PAGE = {
  page_name: 'Dara',
  page_username: 'dara-preview',
  avatar_url: '/assets/Icons/shadow-icon-192.png',
}

const MOCK_STORIES = [
  {
    id: 'preview-story-1',
    title: 'Falling Petals',
    story_type: 'Novel',
    status: 'published',
    total_views: 8,
    total_likes: 2,
    total_comments: 1,
    total_episodes: 12,
    cover_url: '/assets/New Arrival/New Arrival 1.jpg',
    main_genre: 'Romance',
    story_language: 'Khmer',
    created_at: '2026-07-01T08:00:00.000Z',
    updated_at: '2026-07-14T08:00:00.000Z',
  },
  {
    id: 'preview-story-2',
    title: 'Moonlit Promise',
    story_type: 'Novel',
    status: 'draft',
    total_views: 7,
    total_likes: 1,
    total_comments: 0,
    total_episodes: 1,
    cover_url: '/assets/New Arrival/New Arrival 2.jpg',
    main_genre: 'Fantasy',
    story_language: 'Khmer',
    created_at: '2026-07-05T08:00:00.000Z',
    updated_at: '2026-07-16T08:00:00.000Z',
  },
  {
    id: 'preview-story-3',
    title: 'Dear Soul, My Light',
    story_type: 'Novel',
    status: 'published',
    total_views: 8,
    total_likes: 3,
    total_comments: 2,
    total_episodes: 6,
    cover_url: '/assets/New Arrival/New Arrival 3.jpg',
    main_genre: 'Drama',
    story_language: 'Khmer',
    created_at: '2026-06-20T08:00:00.000Z',
    updated_at: '2026-07-12T08:00:00.000Z',
  },
]

const createStoryCards = [
  {
    key: 'novel',
    title: 'Novel',
    subtitle: 'Text episodes',
    icon: 'fa-solid fa-book-open',
    iconWrap: 'bg-[#F3E8FF] text-[#7C3AED]',
    titleColor: 'text-[#7C3AED]',
    soon: false,
  },
  {
    key: 'manga',
    title: 'Manga',
    subtitle: 'Image chapters',
    icon: 'fa-regular fa-image',
    iconWrap: 'bg-[#FEE2E2] text-[#EF4444]',
    titleColor: 'text-[#EF4444]',
    soon: false,
  },
  {
    key: 'chat_story',
    title: 'Chat Story',
    subtitle: 'Message style',
    icon: 'fa-regular fa-comments',
    iconWrap: 'bg-[#FFEDD5] text-[#F97316]',
    titleColor: 'text-[#F97316]',
    soon: false,
  },
]

function getAuthToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

function formatDate(value) {
  if (!value) return getDisplayText('authorDashboard.recently')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return getDisplayText('authorDashboard.recently')

  return date.toLocaleDateString(getDisplayLanguageId())
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return getDisplayText('authorDashboard.goodMorning')
  if (hour < 18) return getDisplayText('authorDashboard.goodAfternoon')
  return getDisplayText('authorDashboard.goodEvening')
}

function normalizeStory(story) {
  const status = story.status === 'published'
    ? 'Published'
    : story.status === 'reviewing'
      ? 'Reviewing'
      : 'Draft'

  return {
    id: story.id,
    title: story.title || getDisplayText('authorDashboard.untitledStory'),
    type: story.story_type === 'manga'
  ? 'Manga'
  : story.story_type === 'chat_story'
    ? 'Chat Story'
    : 'Novel',
    rawType:
      story.story_type === 'manga' || story.story_type === 'chat_story'
        ? story.story_type
        : 'novel',
    status,
    rawStatus: story.status || 'draft',
    updated: formatDate(story.updated_at || story.created_at),
    views: formatCompactNumber(story.total_views),
    likes: formatCompactNumber(story.total_likes),
    rawLikes: Number(story.total_likes || 0),
    comments: formatCompactNumber(story.total_comments),
    episodes: Number(story.total_episodes || 0),
    cover: story.cover_url || '',
    genre: story.main_genre || getDisplayText('authorDashboard.novel'),
    language: story.story_language || 'Khmer',
    lastEdited: Number(story.total_episodes || 0) > 0
      ? getDisplayText('authorDashboard.episodeNumber', { number: Number(story.total_episodes || 0) })
      : getDisplayText('authorDashboard.storyInfo'),
    createdAt: story.created_at,
    updatedAt: story.updated_at || story.created_at,
  }
}

function StatItem({ icon, value, label, iconClass }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center px-1 text-center">
      <i className={`${icon} ${iconClass} text-[17px]`} />
      <div className="mt-1.5 text-[17px] font-black text-[var(--shadow-text-primary)]">{value}</div>
      <div className="mt-0.5 max-w-full truncate text-[9px] font-bold uppercase tracking-[0.04em] text-[var(--shadow-text-tertiary)]">{label}</div>
    </div>
  )
}

function ToolRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[14px] px-2 py-2.5 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[13px]`} />
      </div>

      <div className="min-w-0">
        <div className="line-clamp-1 text-[13px] font-semibold text-[var(--shadow-text-primary)]">{title}</div>
        <div className="mt-0.5 line-clamp-1 text-[11px] font-normal text-[var(--shadow-text-tertiary)]">{subtitle}</div>
      </div>
    </button>
  )
}
function PageMenu({ open, onClose, onSelect }) {
  const { t } = useDisplayTranslation()
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label={t('authorDashboard.closeMenu')}
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-[var(--shadow-bg-elevated)] px-4 pb-6 pt-4 shadow-2xl ring-1 ring-[var(--shadow-border)] md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[330px] md:rounded-[24px] md:pb-4">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[var(--shadow-border-strong)] md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <div className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorDashboard.authorTools')}</div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorDashboard.closeAuthorTools')}
          >
            <i className="fa-solid fa-times text-[13px] text-[var(--shadow-text-secondary)]" />
          </button>
        </div>

        <div className="space-y-1">

          <ToolRow icon="fa-solid fa-chart-line" title={t('authorDashboard.myIncome')} subtitle={t('authorDashboard.incomeSubtitle')} onClick={() => onSelect('/author/income')} />
          <ToolRow icon="fa-solid fa-gift" title={t('authorDashboard.quest')} subtitle={t('authorDashboard.questSubtitle')} onClick={() => onSelect('/author/quest')} />
          <ToolRow icon="fa-solid fa-crown" title={t('authorDashboard.authorBenefits')} subtitle={t('authorDashboard.benefitsSubtitle')} onClick={() => onSelect('/author/benefits')} />
          <ToolRow icon="fa-solid fa-shield-halved" title={t('authorDashboard.commentProtection')} subtitle={t('authorDashboard.commentProtectionSubtitle')} onClick={() => onSelect('/author/comment-protection')} />
          <ToolRow icon="fa-regular fa-trash-can" title={t('authorDashboard.trash')} subtitle={t('authorDashboard.trashSubtitle')} onClick={() => onSelect('/author/trash')} />
        </div>
      </div>
    </div>
  )
}

function StoriesLoadingState() {
  return (
    <div className="mt-3">
      <div className="flex gap-3 overflow-hidden pb-4">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="shrink-0"
            style={{ width: 'clamp(82px, calc((100vw - 56px) / 3), 126px)' }}
          >
            <div className="aspect-[3/4] animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
            <div className="mx-auto mt-2 h-1.5 w-1.5 rounded-full bg-[#d6c7f4]" />
          </div>
        ))}
      </div>

      <div className="animate-pulse rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
        <div className="h-5 w-1/2 rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="mt-3 h-4 w-2/3 rounded-full bg-[var(--shadow-bg-soft)]" />
        <div className="mt-5 h-12 rounded-[14px] bg-[var(--shadow-bg-soft)]" />
        <div className="mt-4 h-11 rounded-[14px] bg-[var(--shadow-bg-soft)]" />
      </div>
    </div>
  )
}

function EmptyCover({ title }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#111827] to-[#374151] px-2 text-center">
      <span className="line-clamp-3 text-[10px] font-extrabold leading-4 text-white/80">{title}</span>
    </div>
  )
}

function StoryCoverButton({ story, active, onSelect }) {
  const { t } = useDisplayTranslation()
  return (
    <button
      type="button"
      onClick={onSelect}
      className="shrink-0 text-left"
      style={{ width: 'clamp(82px, calc((100vw - 56px) / 3), 126px)' }}
      aria-pressed={active}
      aria-label={t('authorDashboard.selectStory', { title: story.title })}
    >
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-[10px] bg-[#2b174f] transition active:scale-[0.98] ${
          active
            ? 'ring-2 ring-[#8050e8] ring-offset-2 ring-offset-[var(--shadow-bg-page)] shadow-[0_10px_24px_rgba(109,66,219,0.35)]'
            : 'shadow-[0_8px_20px_rgba(50,27,91,0.14)]'
        }`}
      >
        {story.cover ? (
          <img
  src={story.cover}
  alt={story.title}
  draggable="false"
  className="pointer-events-none h-full w-full select-none object-cover"
/>
        ) : (
          <EmptyCover title={story.title} />
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f103d]/95 to-transparent px-2 pb-2 pt-7 text-center">
          <span className="line-clamp-1 text-[9.5px] font-bold text-white/90">
            {story.episodes > 0 ? t('authorDashboard.episodeNumber', { number: story.episodes }) : t('authorDashboard.storyInfo')}
          </span>
        </div>
      </div>

      <div
        className={`mx-auto mt-2 h-1.5 rounded-full transition-all ${
          active ? 'w-5 bg-[#7c4dea]' : 'w-1.5 bg-[#d7cbed]'
        }`}
      />
    </button>
  )
}

function StoryDetailPanel({ story, onEdit, onAddEpisode }) {
  const { t } = useDisplayTranslation()
  const statusClass =
    story.status === 'Published'
      ? 'bg-[#eafaf0] text-[#16803c]'
      : story.status === 'Reviewing'
        ? 'bg-[#fff7df] text-[#a56a00]'
        : 'bg-[#f0eaff] text-[#7040d8]'

  return (
    <div className="rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_12px_30px_rgba(67,35,120,0.1)]">
      <h3 className="line-clamp-1 text-[19px] font-black tracking-[-0.02em] text-[var(--shadow-text-primary)]">{story.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-[#f0eaff] px-2.5 py-1 text-[9.5px] font-extrabold text-[#7040d8]">{t(`authorDashboard.${story.rawType === 'chat_story' ? 'chatStory' : story.rawType}`)}</span>
        <span className="rounded-full bg-[#f5f1ff] px-2.5 py-1 text-[9.5px] font-extrabold text-[#8a5ce6]">{story.genre}</span>
        <span className={`rounded-full px-2.5 py-1 text-[9.5px] font-extrabold ${statusClass}`}>
          {t(`authorDashboard.${story.rawStatus === 'published' ? 'published' : story.rawStatus === 'reviewing' ? 'reviewing' : 'draft'}`)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 divide-x divide-[var(--shadow-border)]">
        <div className="flex flex-col items-center gap-1 text-[var(--shadow-text-secondary)]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
            <i className="fa-regular fa-eye text-[10px] text-[#8a5ce6]" />
            {story.views}
          </span>
          <span className="text-[9px] font-semibold">{t('authorDashboard.views')}</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[var(--shadow-text-secondary)]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
            <i className="fa-solid fa-heart text-[10px] text-[#a86cf2]" />
            {story.likes}
          </span>
          <span className="text-[9px] font-semibold">{t('authorDashboard.likes')}</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[var(--shadow-text-secondary)]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
            <i className="fa-regular fa-comment text-[10px] text-[#8a5ce6]" />
            {story.comments}
          </span>
          <span className="text-[9px] font-semibold">{t('authorDashboard.comments')}</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-[var(--shadow-text-secondary)]">
          <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">
            <i className="fa-solid fa-list text-[9px] text-[#8a5ce6]" />
            {story.episodes}
          </span>
          <span className="text-[9px] font-semibold">{t('authorDashboard.episodes')}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onAddEpisode(story)}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-3 py-3 text-[11.5px] font-normal text-white shadow-[0_8px_18px_rgba(109,66,219,0.28)] active:scale-[0.98]"
        >
          <i className="fa-solid fa-plus text-[11px]" />
          {t('authorDashboard.addEpisode')}
        </button>

        <button
          type="button"
          onClick={() => onEdit(story)}
          className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3 text-[11.5px] font-normal text-[#7c4dea] active:scale-[0.98]"
        >
          <i className="fa-solid fa-gear text-[11px]" />
          {t('authorDashboard.manage')}
        </button>
      </div>
    </div>
  )
}

function AuthorInboxButton({
  navigate,
  unreadCount = 0,
}) {
  const { t } = useDisplayTranslation()
  return (
    <button
      type="button"
      onClick={() => navigate('/inbox')}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-sm active:scale-95"
      aria-label={t('authorDashboard.inbox')}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[22px] w-[22px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect
          x="3.5"
          y="5.5"
          width="17"
          height="13"
          rx="1.5"
        />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </svg>

      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-[#8251e9]">
          {unreadCount > 99
            ? '99+'
            : unreadCount}
        </span>
      ) : null}
    </button>
  )
}


export default function AuthorDashboardPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const location = useLocation()
  const returnTo = location.state?.returnTo || '/me'
  const [menuOpen, setMenuOpen] = useState(false)
  const [stories, setStories] = useState([])
  const [selectedStoryId, setSelectedStoryId] = useState(null)
  const [loading, setLoading] = useState(!AUTHOR_PREVIEW_ENABLED)
  const [message, setMessage] = useState('')
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [unreadMails, setUnreadMails] = useState(0)
  const badgeRequestInFlightRef = useRef(false)
  const lastBadgeRequestAtRef = useRef(0)
  const storiesScrollRef = useRef(null)
  const storiesDragRef = useRef({
  active: false,
  startX: 0,
  scrollLeft: 0,
})

  const startStoriesDrag = (event) => {
  if (event.button !== 0 || !storiesScrollRef.current) return

  storiesDragRef.current = {
    active: true,
    startX: event.clientX,
    scrollLeft: storiesScrollRef.current.scrollLeft,
  }

  storiesScrollRef.current.style.cursor = 'grabbing'
}

const moveStoriesDrag = (event) => {
  if (!storiesDragRef.current.active || !storiesScrollRef.current) return

  event.preventDefault()

  const distance = event.clientX - storiesDragRef.current.startX

  storiesScrollRef.current.scrollLeft =
    storiesDragRef.current.scrollLeft - distance
}

const stopStoriesDrag = () => {
  storiesDragRef.current.active = false

  if (storiesScrollRef.current) {
    storiesScrollRef.current.style.cursor = 'grab'
  }
}

  const storedUser = JSON.parse(localStorage.getItem('shadow_reader_user') || 'null')
  const storedAuthorPage = JSON.parse(localStorage.getItem('shadow_author_page') || 'null')

  const [authorPage, setAuthorPage] = useState(
    AUTHOR_PREVIEW_ENABLED ? MOCK_AUTHOR_PAGE : storedAuthorPage
  )

  const author = {
  name: authorPage?.page_name || storedUser?.name || storedUser?.username || t('authorDashboard.authorPageName'),
  username: authorPage?.page_username || '',
  avatarUrl: authorPage?.avatar_url || '',
  avatarLetter: (authorPage?.page_name || storedUser?.name || storedUser?.username || 'A').charAt(0).toUpperCase(),
}

  const authorPagePath = author.username
    ? `/author/page/${encodeURIComponent(author.username)}`
    : '/author/page'

  async function fetchMyAuthorPage({ signal } = {}) {
    if (AUTHOR_PREVIEW_ENABLED) {
      setAuthorPage(MOCK_AUTHOR_PAGE)
      return MOCK_AUTHOR_PAGE
    }

    const token = getAuthToken()

    if (!token) {
      return null
    }

    try {
      const data = await fetchMyAuthorPageCached({
        apiBaseUrl: API_BASE_URL,
        token,
        signal,
      })

      if (!data.author_page) {
        return null
      }

      setAuthorPage(data.author_page)

      return data.author_page
    } catch (error) {
      if (error?.name === 'AbortError') return null
      return null
    }
  }

  async function fetchDashboardBadges({
    force = false,
    signal,
  } = {}) {
    if (AUTHOR_PREVIEW_ENABLED) return

    const token = getAuthToken()
    if (!token) return
    if (!force && document.visibilityState !== 'visible') return

    const now = Date.now()

    if (badgeRequestInFlightRef.current) {
      return
    }

    if (
      !force &&
      now - lastBadgeRequestAtRef.current < 30000
    ) {
      return
    }

    badgeRequestInFlightRef.current = true
    lastBadgeRequestAtRef.current = now

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/dashboard-badges`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
          signal,
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (!response.ok || data.ok === false) {
        return
      }

      setUnreadNotifications(
        Number(data.story_unread_count || 0)
      )

      setUnreadMails(
        Number(data.mail_unread_count || 0)
      )
    } catch (error) {
      if (error?.name !== 'AbortError') {
        return
      }
    } finally {
      badgeRequestInFlightRef.current = false
    }
  }

  async function fetchMyStories({ signal } = {}) {
    if (AUTHOR_PREVIEW_ENABLED) {
      setMessage('')
      setStories(MOCK_STORIES.map(normalizeStory))
      setLoading(false)
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
          signal,
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('authorDashboard.loadStoriesFailed')
        )
      }

      setStories(
        (data.stories || []).map(normalizeStory)
      )
    } catch (error) {
      if (error?.name === 'AbortError') return

      setStories([])
      setMessage(
        error.message === 'Failed to fetch'
          ? t('authorDashboard.cannotConnect')
          : error.message || t('authorDashboard.loadStoriesFailed')
      )
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const refreshBadges = () => {
      fetchDashboardBadges({ signal })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshBadges()
      }
    }

    fetchMyAuthorPage({ signal })
    fetchMyStories({ signal })
    fetchDashboardBadges({
      force: true,
      signal,
    })

    window.addEventListener(
      'focus',
      refreshBadges
    )
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      controller.abort()
      window.removeEventListener(
        'focus',
        refreshBadges
      )
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const published = stories.filter((story) => story.rawStatus === 'published').length
    const drafts = stories.filter((story) => story.rawStatus !== 'published').length
    const views = stories.reduce((sum, story) => sum + Number(String(story.views).replace(/[^\d.]/g, '') || 0), 0)
const likes = stories.reduce((sum, story) => sum + story.rawLikes, 0)

return {
  published: String(published).padStart(2, '0'),
  drafts: String(drafts).padStart(2, '0'),
  views: formatCompactNumber(views),
  likes: formatCompactNumber(likes),
}
  }, [stories])

  const latestStory = useMemo(() => {
    return [...stories].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0] || null
  }, [stories])

  const selectedStory = useMemo(() => {
    if (stories.length === 0) return null

    return stories.find((story) => String(story.id) === String(selectedStoryId)) || stories[0]
  }, [selectedStoryId, stories])

  const handleMenuSelect = async (path) => {
    setMenuOpen(false)

    if (path === '/author/page') {
      const latestAuthorPage = await fetchMyAuthorPage()

      if (!latestAuthorPage?.page_username) {
        setMessage(t('authorDashboard.authorPageMissing'))
        return
      }

      navigate(`/author/page/${encodeURIComponent(latestAuthorPage.page_username)}`)
      return
    }

    navigate(path)
  }

  const handleCreateStory = (type) => {
    navigate(`/author/create-story?type=${encodeURIComponent(type)}`)
  }
  const handleComingSoon = (type) => {
    setMessage(t('authorDashboard.comingSoon', { type }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditStory = (story) => {
  navigate(`/author/story/${story.id}/manage`)
}

  const handleAddEpisode = (story) => {
  const path = story.rawType === 'chat_story'
  ? `/author/story/${story.id}/chat/characters?new=1&returnTo=${encodeURIComponent('/author/dashboard')}`
  : `/author/story/${story.id}/episode/create?first=0&returnTo=${encodeURIComponent('/author/dashboard')}`
  navigate(path)
}

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[120px]">
      <PageMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={handleMenuSelect} />



      <main className="mx-auto max-w-5xl px-4">
        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d]"
          >
            {message}
          </button>
        ) : null}

     <section className="relative -mx-4 min-h-[245px] overflow-hidden px-4 pb-[54px] pt-[calc(12px+env(safe-area-inset-top))] shadow-[0_14px_35px_rgba(96,55,177,0.22)]">
  <img src="/assets/Icons/Picture/Wing 1.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
  <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(returnTo)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-sm active:scale-95"
            aria-label={t('authorDashboard.back')}
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <h1 className="text-[15px] font-normal text-white">
            {t('authorDashboard.title')}
          </h1>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/author/notifications')}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-sm active:scale-95"
              aria-label={t('authorDashboard.notifications')}
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 21h4" strokeLinecap="round" /></svg>

              {unreadNotifications > 0 ? (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#8251e9] bg-[#f43f5e] px-1 text-[8px] font-black leading-none text-white">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </span>
              ) : null}
            </button>

            <AuthorInboxButton
  navigate={navigate}
  unreadCount={unreadMails}
/>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex items-center gap-4">
          <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-transparent p-[2px] shadow-lg ring-[1px] ring-white">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#2b174f] text-[24px] font-extrabold text-white">
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                author.avatarLetter
              )}
            </div>

            <button
  type="button"
  onClick={() => navigate('/author/page/story/create')}
  className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#7444df] shadow-md ring-2 ring-[#8352e9] active:scale-95"
  aria-label={t('authorDashboard.addToStory')}
>
  <i className="fa-solid fa-plus text-[10px]" />
</button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-white/75">
              {getGreeting()},
            </div>

            <div className="mt-0.5 line-clamp-1 text-[20px] font-bold tracking-[-0.01em] text-white">
              {author.name}
            </div>

            <div className="mt-1 text-[11.5px] font-medium text-white/75">
              {t('authorDashboard.keepWriting')}
            </div>
          </div>
        </div>

      </section>

      <div className="relative z-20 -mx-4 -mt-[28px] min-h-[calc(100vh-120px)] rounded-t-[20px] bg-[var(--shadow-bg-page)] px-4 pb-[170px] pt-[34px]">
  <div className="-translate-y-[50px]">
    <div className="grid grid-cols-4 divide-x divide-[var(--shadow-border)] rounded-[12px] bg-[var(--shadow-bg-surface)] px-1 py-3.5">
          <StatItem
            icon="fa-solid fa-book-open"
            iconClass="text-[#7c4dea]"
            value={stats.published}
            label={t('authorDashboard.published')}
          />

          <StatItem
            icon="fa-solid fa-file-lines"
            iconClass="text-[#a368f4]"
            value={stats.drafts}
            label={t('authorDashboard.drafts')}
          />

          <StatItem
            icon="fa-regular fa-eye"
            iconClass="text-[#8b74ea]"
            value={stats.views}
            label={t('authorDashboard.views')}
          />

          <StatItem
  icon="fa-solid fa-heart"
  iconClass="text-[#a368f4]"
  value={stats.likes}
  label={t('authorDashboard.likes')}
/>
                </div>

        <Author49DayDashboardCard
          onStartWriting={() =>
            latestStory
              ? handleAddEpisode(latestStory)
              : handleCreateStory('novel')
          }
        />

        <AuthorManagedEventsSection />

        {latestStory ? (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eee7ff] text-[#7c4dea]">
                  <i className="fa-solid fa-sparkles text-[11px]" />
                </span>
                <h2 className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{t('authorDashboard.continueWriting')}</h2>
              </div>

              <button
                type="button"
                onClick={() => handleEditStory(latestStory)}
                className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#7c4dea] active:scale-95"
              >
                {t('authorDashboard.view')}
                <i className="fa-solid fa-chevron-right text-[9px]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleEditStory(latestStory)}
              className="group relative mt-3 h-[220px] w-full overflow-hidden rounded-[12px] bg-gradient-to-br from-[#4d278f] via-[#7544d1] to-[#aa7bf5] text-left shadow-[0_16px_34px_rgba(86,46,155,0.24)] active:scale-[0.995] sm:h-[260px] md:h-[310px]"
              aria-label={t('authorDashboard.continueWritingStory', { title: latestStory.title })}
            >
              {latestStory.cover ? (
                <img
                  src={latestStory.cover}
                  alt={latestStory.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#4d278f] via-[#7544d1] to-[#b184f7]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#1f103d] via-[#3a1d66]/55 to-[#6d42db]/10" />
              <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/20 blur-3xl" />

              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-[#6d42db] shadow-sm backdrop-blur">
                <i className="fa-solid fa-pen-nib text-[9px]" />
                {t('authorDashboard.latestDraft')}
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1 text-white">
                  <div className="line-clamp-1 text-[19px] font-black tracking-[-0.02em] sm:text-[22px]">{latestStory.title}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-semibold text-white/75">
                    <span>{latestStory.lastEdited}</span>
                    <span className="h-1 w-1 rounded-full bg-[#d8c7ff]" />
                    <span>{t('authorDashboard.updatedDate', { date: latestStory.updated })}</span>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#9a6af5] to-[#6d42db] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-[0_8px_18px_rgba(36,15,77,0.3)] ring-1 ring-white/25">
                  {t('authorDashboard.continue')}
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </span>
              </div>
            </button>
          </section>
        ) : null}

       <div className="hidden mt-4 grid grid-cols-3 gap-3">
  {createStoryCards.map((item) => (
    <button
      key={item.key}
      type="button"
      onClick={() => (item.soon ? handleComingSoon(item.title) : handleCreateStory(item.key))}
      disabled={item.soon}
      className="relative flex min-h-[170px] flex-col items-center justify-center rounded-[14px] bg-white px-3 py-5 text-center shadow-[0_4px_18px_rgba(15,23,42,0.06)] transition active:scale-[0.98] disabled:cursor-default"
    >
      {item.soon ? (
        <span className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold leading-none text-[#F97316] shadow-sm">
          SOON
        </span>
      ) : null}

      <div
        className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full text-[30px] font-normal ${item.iconWrap}`}
      >
        <i className={item.icon} />
      </div>

      <div className={`text-[15px] font-semibold ${item.titleColor}`}>
        {item.title}
      </div>

      <div className="mt-1 text-[12px] font-medium leading-4 text-[#8A86A3]">
        {item.subtitle}
      </div>
    </button>
  ))}
</div>

        <section id="author-stories" className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-black tracking-[-0.02em] text-[var(--shadow-text-primary)]">{t('authorDashboard.stories')}</h2>
            <div className="text-[11px] font-bold text-[var(--shadow-text-tertiary)]">
              {loading ? t('authorDashboard.loading') : t('authorDashboard.storyCount', { count: stories.length })}
            </div>
          </div>

          {loading ? (
            <StoriesLoadingState />
          ) : stories.length > 0 && selectedStory ? (
            <>
              <div
  ref={storiesScrollRef}
  onMouseDown={startStoriesDrag}
  onMouseMove={moveStoriesDrag}
  onMouseUp={stopStoriesDrag}
  onMouseLeave={stopStoriesDrag}
  className="-mx-4 mt-3 flex cursor-grab select-none gap-3 overflow-x-auto px-4 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
>
                {stories.map((story) => (
                  <StoryCoverButton
                    key={story.id}
                    story={story}
                    active={String(story.id) === String(selectedStory.id)}
                    onSelect={() => setSelectedStoryId(story.id)}
                  />
                ))}
              </div>

              <StoryDetailPanel
                story={selectedStory}
                onEdit={handleEditStory}
                onAddEpisode={handleAddEpisode}
              />
            </>
          ) : (
            <div className="mt-3 rounded-[14px] border border-dashed border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f0eaff] text-[#7040d8]">
                <i className="fa-solid fa-pen-nib text-[17px]" />
              </div>

              <div className="mt-3 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('authorDashboard.noStories')}</div>
              <div className="mt-1 text-[12px] text-[var(--shadow-text-tertiary)]">{t('authorDashboard.noStoriesBody')}</div>

              <button
                type="button"
                onClick={() => handleCreateStory('novel')}
                className="mt-4 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-5 py-2.5 text-[12px] font-extrabold text-white active:scale-95"
              >
                {t('authorDashboard.createStory')}
              </button>
            </div>
          )}
        </section>
      </div>
      </div>
      </main>
      <AuthorStudioBottomNav />
    </div>
  )
}
