import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import AuthorDashboardContentTab from '../../components/Author/AuthorDashboardContentTab'
import AuthorDashboardCommunityTab from '../../components/Author/AuthorDashboardCommunityTab'
import AuthorDashboardPageToolsTab from '../../components/Author/AuthorDashboardPageToolsTab'

registerTranslationNamespace('authorPageDashboard', {
  "en": {
    "overview": "Overview",
    "content": "Content",
    "community": "Community",
    "pageTools": "Page Tools",
    "justNow": "Just now",
    "minutesAgo": "{{count}}m",
    "hoursAgo": "{{count}}h",
    "daysAgo": "{{count}}d",
    "failedLoadDashboard": "Failed to load author dashboard",
    "goal": "Goal {{value}}",
    "contentPerformance": "Content performance",
    "start": "Start",
    "mid": "Mid",
    "now": "Now",
    "noPostYet": "No post yet",
    "noPostHelp": "Your newest author post will appear here after you publish it.",
    "latestPost": "Latest Post",
    "photoUpdate": "Photo update",
    "reader": "Reader",
    "newComment": "New comment",
    "page": "Page",
    "dashboard": "Dashboard",
    "store": "Store",
    "notifications": "Notifications",
    "pageDashboard": "Page Dashboard",
    "loadingDashboard": "Loading dashboard...",
    "authorPageNotFound": "Author page not found",
    "failedPageDashboard": "Failed to load Page Dashboard",
    "backToPage": "Back to page",
    "pageSettings": "Page settings",
    "authorPage": "Author Page",
    "setUpPage": "Set up your page",
    "defaultBio": "Share stories that inspire and connect readers.",
    "profileSetup": "{{value}}% profile setup",
    "viewPublicPage": "View Public Page",
    "updatesCount": "You have {{count}} updates",
    "allCaughtUp": "You are all caught up",
    "updatesHelp": "New comments, story activity, and followers will appear here.",
    "posts": "Posts",
    "stories": "Stories",
    "followers": "Followers",
    "comments": "Comments",
    "analytics": "Analytics",
    "period28": "28 Days",
    "period7": "7 Days",
    "today": "Today",
    "views": "Views",
    "pageVisits": "Page visits in this period",
    "interactions": "Interactions",
    "readerActions": "Reader actions in this period",
    "newFollowers": "New followers in this period",
    "storyReads": "Story Reads",
    "qualifiedReads": "Qualified reads in this period",
    "viewAll": "View all",
    "recentComments": "Recent Comments",
    "noRecentComments": "No recent comments",
    "recentCommentsHelp": "Reader comments on your author posts will appear here.",
    "contentOverview": "Content Overview",
    "publishedStories": "Published stories",
    "totalEpisodes": "Total episodes",
    "storyLikes": "Story likes",
    "storyComments": "Story comments",
    "quickActions": "Quick Actions",
    "createPost": "Create Post",
    "createPostHelp": "Share a new update with readers.",
    "addStory": "Add Story",
    "addStoryHelp": "Create and publish a new story.",
    "openStore": "Open Store",
    "openStoreHelp": "Manage books, PDFs, and orders.",
    "editPage": "Edit Page",
    "editPageHelp": "Update page details and profile.",
    "otherTools": "Other Tools",
    "updatePageDetails": "Update your page details",
    "storyManager": "Story Manager",
    "manageStories": "Manage your stories and drafts",
    "settings": "Settings",
    "settingsHelp": "Page settings and preferences",
    "readerSupport": "Reader Support",
    "readerSupportHelp": "Help and support for readers",
    "readerSupportLater": "Reader Support will be added later."
  },
  "km": {
    "overview": "ទិដ្ឋភាពទូទៅ",
    "content": "មាតិកា",
    "community": "សហគមន៍",
    "pageTools": "ឧបករណ៍ទំព័រ",
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}}នាទី",
    "hoursAgo": "{{count}}ម៉ោង",
    "daysAgo": "{{count}}ថ្ងៃ",
    "failedLoadDashboard": "មិនអាចផ្ទុក Dashboard អ្នកនិពន្ធបានទេ",
    "goal": "គោលដៅ {{value}}",
    "contentPerformance": "Performance មាតិកា",
    "start": "ចាប់ផ្តើម",
    "mid": "កណ្ដាល",
    "now": "ឥឡូវ",
    "noPostYet": "មិនទាន់មាន Post",
    "noPostHelp": "Post ថ្មីបំផុតរបស់អ្នកនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីអ្នកបោះពុម្ព។",
    "latestPost": "Post ចុងក្រោយ",
    "photoUpdate": "ការអាប់ដេតរូបភាព",
    "reader": "អ្នកអាន",
    "newComment": "មតិយោបល់ថ្មី",
    "page": "ទំព័រ",
    "dashboard": "Dashboard",
    "store": "ហាង",
    "notifications": "ការជូនដំណឹង",
    "pageDashboard": "Dashboard ទំព័រ",
    "loadingDashboard": "កំពុងផ្ទុក Dashboard...",
    "authorPageNotFound": "រកមិនឃើញទំព័រអ្នកនិពន្ធ",
    "failedPageDashboard": "មិនអាចផ្ទុក Page Dashboard បានទេ",
    "backToPage": "ត្រឡប់ទៅទំព័រ",
    "pageSettings": "ការកំណត់ទំព័រ",
    "authorPage": "ទំព័រអ្នកនិពន្ធ",
    "setUpPage": "រៀបចំទំព័ររបស់អ្នក",
    "defaultBio": "ចែករំលែករឿងដែលបំផុសគំនិត និងភ្ជាប់អ្នកអាន។",
    "profileSetup": "រៀបចំ Profile បាន {{value}}%",
    "viewPublicPage": "មើលទំព័រសាធារណៈ",
    "updatesCount": "អ្នកមាន {{count}} updates",
    "allCaughtUp": "អ្នកបានមើលអស់ហើយ",
    "updatesHelp": "មតិយោបល់ថ្មី សកម្មភាពរឿង និងអ្នក Follow នឹងបង្ហាញនៅទីនេះ។",
    "posts": "Posts",
    "stories": "រឿង",
    "followers": "អ្នក Follow",
    "comments": "មតិយោបល់",
    "analytics": "វិភាគ",
    "period28": "28 ថ្ងៃ",
    "period7": "7 ថ្ងៃ",
    "today": "ថ្ងៃនេះ",
    "views": "Views",
    "pageVisits": "ការចូលមើលទំព័រក្នុងរយៈពេលនេះ",
    "interactions": "អន្តរកម្ម",
    "readerActions": "សកម្មភាពអ្នកអានក្នុងរយៈពេលនេះ",
    "newFollowers": "អ្នក Follow ថ្មីក្នុងរយៈពេលនេះ",
    "storyReads": "ការអានរឿង",
    "qualifiedReads": "ការអានដែលមានសុពលភាពក្នុងរយៈពេលនេះ",
    "viewAll": "មើលទាំងអស់",
    "recentComments": "មតិយោបល់ថ្មីៗ",
    "noRecentComments": "មិនមានមតិយោបល់ថ្មីៗ",
    "recentCommentsHelp": "មតិយោបល់អ្នកអានលើ Post អ្នកនិពន្ធរបស់អ្នកនឹងបង្ហាញនៅទីនេះ។",
    "contentOverview": "ទិដ្ឋភាពមាតិកា",
    "publishedStories": "រឿងដែលបានបោះពុម្ព",
    "totalEpisodes": "ភាគសរុប",
    "storyLikes": "Like រឿង",
    "storyComments": "មតិយោបល់រឿង",
    "quickActions": "សកម្មភាពរហ័ស",
    "createPost": "បង្កើត Post",
    "createPostHelp": "ចែករំលែក update ថ្មីជាមួយអ្នកអាន។",
    "addStory": "បន្ថែមរឿង",
    "addStoryHelp": "បង្កើត និងបោះពុម្ពរឿងថ្មី។",
    "openStore": "បើកហាង",
    "openStoreHelp": "គ្រប់គ្រងសៀវភៅ PDF និងការបញ្ជាទិញ។",
    "editPage": "កែទំព័រ",
    "editPageHelp": "កែព័ត៌មានទំព័រ និង Profile។",
    "otherTools": "ឧបករណ៍ផ្សេង",
    "updatePageDetails": "កែព័ត៌មានទំព័ររបស់អ្នក",
    "storyManager": "គ្រប់គ្រងរឿង",
    "manageStories": "គ្រប់គ្រងរឿង និង Draft",
    "settings": "ការកំណត់",
    "settingsHelp": "ការកំណត់ និងចំណូលចិត្តទំព័រ",
    "readerSupport": "ជំនួយអ្នកអាន",
    "readerSupportHelp": "ជំនួយ និងការគាំទ្រសម្រាប់អ្នកអាន",
    "readerSupportLater": "Reader Support នឹងបន្ថែមនៅពេលក្រោយ។"
  },
  "zh": {
    "overview": "概览",
    "content": "内容",
    "community": "社区",
    "pageTools": "页面工具",
    "justNow": "刚刚",
    "minutesAgo": "{{count}}分钟",
    "hoursAgo": "{{count}}小时",
    "daysAgo": "{{count}}天",
    "failedLoadDashboard": "无法加载作者控制台",
    "goal": "目标 {{value}}",
    "contentPerformance": "内容表现",
    "start": "开始",
    "mid": "中间",
    "now": "现在",
    "noPostYet": "暂无帖子",
    "noPostHelp": "发布后，最新的作者帖子会显示在这里。",
    "latestPost": "最新帖子",
    "photoUpdate": "图片动态",
    "reader": "读者",
    "newComment": "新评论",
    "page": "页面",
    "dashboard": "控制台",
    "store": "商店",
    "notifications": "通知",
    "pageDashboard": "页面控制台",
    "loadingDashboard": "正在加载控制台...",
    "authorPageNotFound": "找不到作者页面",
    "failedPageDashboard": "无法加载页面控制台",
    "backToPage": "返回页面",
    "pageSettings": "页面设置",
    "authorPage": "作者页面",
    "setUpPage": "设置你的页面",
    "defaultBio": "分享能启发并连接读者的故事。",
    "profileSetup": "个人资料已完成 {{value}}%",
    "viewPublicPage": "查看公开页面",
    "updatesCount": "你有 {{count}} 条更新",
    "allCaughtUp": "你已查看全部更新",
    "updatesHelp": "新评论、故事活动和关注者会显示在这里。",
    "posts": "帖子",
    "stories": "故事",
    "followers": "关注者",
    "comments": "评论",
    "analytics": "数据分析",
    "period28": "28天",
    "period7": "7天",
    "today": "今天",
    "views": "浏览量",
    "pageVisits": "此期间的页面访问量",
    "interactions": "互动",
    "readerActions": "此期间的读者互动",
    "newFollowers": "此期间的新关注者",
    "storyReads": "故事阅读",
    "qualifiedReads": "此期间的有效阅读",
    "viewAll": "查看全部",
    "recentComments": "最新评论",
    "noRecentComments": "暂无最新评论",
    "recentCommentsHelp": "读者在作者帖子下的评论会显示在这里。",
    "contentOverview": "内容概览",
    "publishedStories": "已发布故事",
    "totalEpisodes": "章节总数",
    "storyLikes": "故事点赞",
    "storyComments": "故事评论",
    "quickActions": "快捷操作",
    "createPost": "创建帖子",
    "createPostHelp": "与读者分享新的动态。",
    "addStory": "添加故事",
    "addStoryHelp": "创建并发布新故事。",
    "openStore": "打开商店",
    "openStoreHelp": "管理书籍、PDF 和订单。",
    "editPage": "编辑页面",
    "editPageHelp": "更新页面信息和资料。",
    "otherTools": "其他工具",
    "updatePageDetails": "更新你的页面信息",
    "storyManager": "故事管理",
    "manageStories": "管理故事和草稿",
    "settings": "设置",
    "settingsHelp": "页面设置和偏好",
    "readerSupport": "读者支持",
    "readerSupportHelp": "为读者提供帮助与支持",
    "readerSupportLater": "读者支持功能稍后提供。"
  },
  "ja": {
    "overview": "概要",
    "content": "コンテンツ",
    "community": "コミュニティ",
    "pageTools": "ページツール",
    "justNow": "たった今",
    "minutesAgo": "{{count}}分",
    "hoursAgo": "{{count}}時間",
    "daysAgo": "{{count}}日",
    "failedLoadDashboard": "作者ダッシュボードを読み込めませんでした",
    "goal": "目標 {{value}}",
    "contentPerformance": "コンテンツパフォーマンス",
    "start": "開始",
    "mid": "中間",
    "now": "現在",
    "noPostYet": "投稿はまだありません",
    "noPostHelp": "公開後、最新の作者投稿がここに表示されます。",
    "latestPost": "最新の投稿",
    "photoUpdate": "写真の更新",
    "reader": "読者",
    "newComment": "新しいコメント",
    "page": "ページ",
    "dashboard": "ダッシュボード",
    "store": "ストア",
    "notifications": "通知",
    "pageDashboard": "ページダッシュボード",
    "loadingDashboard": "ダッシュボードを読み込み中...",
    "authorPageNotFound": "作者ページが見つかりません",
    "failedPageDashboard": "ページダッシュボードを読み込めませんでした",
    "backToPage": "ページに戻る",
    "pageSettings": "ページ設定",
    "authorPage": "作者ページ",
    "setUpPage": "ページを設定",
    "defaultBio": "読者をつなぎ、心を動かす物語を共有しましょう。",
    "profileSetup": "プロフィール設定 {{value}}%",
    "viewPublicPage": "公開ページを見る",
    "updatesCount": "{{count}}件の更新があります",
    "allCaughtUp": "すべて確認済みです",
    "updatesHelp": "新しいコメント、ストーリー活動、フォロワーがここに表示されます。",
    "posts": "投稿",
    "stories": "ストーリー",
    "followers": "フォロワー",
    "comments": "コメント",
    "analytics": "分析",
    "period28": "28日",
    "period7": "7日",
    "today": "今日",
    "views": "閲覧数",
    "pageVisits": "この期間のページ訪問",
    "interactions": "インタラクション",
    "readerActions": "この期間の読者アクション",
    "newFollowers": "この期間の新規フォロワー",
    "storyReads": "ストーリー閲覧",
    "qualifiedReads": "この期間の有効な閲覧",
    "viewAll": "すべて見る",
    "recentComments": "最近のコメント",
    "noRecentComments": "最近のコメントはありません",
    "recentCommentsHelp": "作者投稿への読者コメントがここに表示されます。",
    "contentOverview": "コンテンツ概要",
    "publishedStories": "公開済みストーリー",
    "totalEpisodes": "総エピソード",
    "storyLikes": "ストーリーのいいね",
    "storyComments": "ストーリーコメント",
    "quickActions": "クイック操作",
    "createPost": "投稿を作成",
    "createPostHelp": "読者に新しい更新を共有します。",
    "addStory": "ストーリーを追加",
    "addStoryHelp": "新しいストーリーを作成して公開します。",
    "openStore": "ストアを開く",
    "openStoreHelp": "本、PDF、注文を管理します。",
    "editPage": "ページを編集",
    "editPageHelp": "ページ情報とプロフィールを更新します。",
    "otherTools": "その他のツール",
    "updatePageDetails": "ページ情報を更新",
    "storyManager": "ストーリー管理",
    "manageStories": "ストーリーと下書きを管理",
    "settings": "設定",
    "settingsHelp": "ページ設定と環境設定",
    "readerSupport": "読者サポート",
    "readerSupportHelp": "読者向けのヘルプとサポート",
    "readerSupportLater": "読者サポートは後で追加されます。"
  },
  "ko": {
    "overview": "개요",
    "content": "콘텐츠",
    "community": "커뮤니티",
    "pageTools": "페이지 도구",
    "justNow": "방금",
    "minutesAgo": "{{count}}분",
    "hoursAgo": "{{count}}시간",
    "daysAgo": "{{count}}일",
    "failedLoadDashboard": "작가 대시보드를 불러오지 못했습니다",
    "goal": "목표 {{value}}",
    "contentPerformance": "콘텐츠 성과",
    "start": "시작",
    "mid": "중간",
    "now": "현재",
    "noPostYet": "아직 게시물이 없습니다",
    "noPostHelp": "게시 후 최신 작가 게시물이 여기에 표시됩니다.",
    "latestPost": "최신 게시물",
    "photoUpdate": "사진 업데이트",
    "reader": "독자",
    "newComment": "새 댓글",
    "page": "페이지",
    "dashboard": "대시보드",
    "store": "스토어",
    "notifications": "알림",
    "pageDashboard": "페이지 대시보드",
    "loadingDashboard": "대시보드 불러오는 중...",
    "authorPageNotFound": "작가 페이지를 찾을 수 없습니다",
    "failedPageDashboard": "페이지 대시보드를 불러오지 못했습니다",
    "backToPage": "페이지로 돌아가기",
    "pageSettings": "페이지 설정",
    "authorPage": "작가 페이지",
    "setUpPage": "페이지 설정하기",
    "defaultBio": "독자에게 영감을 주고 연결되는 이야기를 공유하세요.",
    "profileSetup": "프로필 설정 {{value}}%",
    "viewPublicPage": "공개 페이지 보기",
    "updatesCount": "{{count}}개의 업데이트가 있습니다",
    "allCaughtUp": "모든 업데이트를 확인했습니다",
    "updatesHelp": "새 댓글, 스토리 활동, 팔로워가 여기에 표시됩니다.",
    "posts": "게시물",
    "stories": "스토리",
    "followers": "팔로워",
    "comments": "댓글",
    "analytics": "분석",
    "period28": "28일",
    "period7": "7일",
    "today": "오늘",
    "views": "조회수",
    "pageVisits": "이 기간의 페이지 방문",
    "interactions": "상호작용",
    "readerActions": "이 기간의 독자 활동",
    "newFollowers": "이 기간의 새 팔로워",
    "storyReads": "스토리 읽기",
    "qualifiedReads": "이 기간의 유효 읽기",
    "viewAll": "모두 보기",
    "recentComments": "최근 댓글",
    "noRecentComments": "최근 댓글이 없습니다",
    "recentCommentsHelp": "작가 게시물에 달린 독자 댓글이 여기에 표시됩니다.",
    "contentOverview": "콘텐츠 개요",
    "publishedStories": "게시된 스토리",
    "totalEpisodes": "전체 에피소드",
    "storyLikes": "스토리 좋아요",
    "storyComments": "스토리 댓글",
    "quickActions": "빠른 작업",
    "createPost": "게시물 만들기",
    "createPostHelp": "독자에게 새 업데이트를 공유하세요.",
    "addStory": "스토리 추가",
    "addStoryHelp": "새 스토리를 만들고 게시하세요.",
    "openStore": "스토어 열기",
    "openStoreHelp": "책, PDF, 주문을 관리하세요.",
    "editPage": "페이지 편집",
    "editPageHelp": "페이지 정보와 프로필을 업데이트하세요.",
    "otherTools": "기타 도구",
    "updatePageDetails": "페이지 정보를 업데이트하세요",
    "storyManager": "스토리 관리",
    "manageStories": "스토리와 초안을 관리하세요",
    "settings": "설정",
    "settingsHelp": "페이지 설정 및 환경설정",
    "readerSupport": "독자 지원",
    "readerSupportHelp": "독자를 위한 도움말과 지원",
    "readerSupportLater": "독자 지원 기능은 나중에 추가됩니다."
  }
})

function dashText(key, options) {
  return getDisplayText(`authorPageDashboard.${key}`, options)
}

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DASHBOARD_TABS = [
  { id: 'Overview', labelKey: 'overview', icon: 'fa-regular fa-window-maximize' },
  { id: 'Content', labelKey: 'content', icon: 'fa-regular fa-pen-to-square' },
  { id: 'Community', labelKey: 'community', icon: 'fa-regular fa-comment-dots' },
  { id: 'Page Tools', labelKey: 'pageTools', icon: 'fa-regular fa-square-check' },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`

  return String(number)
}

function formatTimeAgo(value) {
  if (!value) return dashText('justNow')

  const date = new Date(value)
  const time = date.getTime()

  if (Number.isNaN(time)) return dashText('justNow')

  const seconds = Math.max(1, Math.floor((Date.now() - time) / 1000))

  if (seconds < 60) return dashText('justNow')
  if (seconds < 3600) return dashText('minutesAgo', { count: Math.floor(seconds / 60) })
  if (seconds < 86400) return dashText('hoursAgo', { count: Math.floor(seconds / 3600) })
  if (seconds < 604800) return dashText('daysAgo', { count: Math.floor(seconds / 86400) })

  return date.toLocaleDateString(getDisplayLanguageId(), {
    day: 'numeric',
    month: 'short',
  })
}

function sumBy(items, key) {
  return (Array.isArray(items) ? items : []).reduce(
    (total, item) => total + Number(item?.[key] || 0),
    0
  )
}

function getNextGoal(value, step, minimum) {
  const number = Math.max(0, Number(value || 0))
  return Math.max(minimum, Math.ceil(Math.max(number, 1) / step) * step)
}

function getProfileCompletion(page) {
  const details = page?.profile_details || {}
  const fields = [
    page?.page_name,
    page?.page_username,
    page?.bio,
    page?.avatar_url,
    page?.cover_url,
    details?.email || details?.phone || details?.website,
  ]
  const completed = fields.filter((value) => String(value || '').trim()).length

  return Math.round((completed / fields.length) * 100)
}

const PERIOD_QUERY = {
  '28 Days': '28d',
  '7 Days': '7d',
  Today: 'today',
}

async function fetchMyAuthorDashboard(periodLabel = '28 Days') {
  const token = getAuthToken()

  if (!token) return null

  const period = PERIOD_QUERY[periodLabel] || '28d'
  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/dashboard?period=${encodeURIComponent(period)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || dashText('failedLoadDashboard'))
  }

  return data
}

function DashboardTab({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-[12px] font-semibold transition active:scale-[0.98] sm:h-11 sm:px-6 ${
        active
          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_8px_22px_rgba(139,92,246,0.24)]'
          : 'bg-transparent text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-hover)] hover:text-[#7c3aed]'
      }`}
    >
      <i className={`${icon} text-[12px]`} />
      <span>{label}</span>
    </button>
  )
}

function ProgressStat({ label, value, goal, icon, color, softColor, helper }) {
  const safeValue = Math.max(0, Number(value || 0))
  const safeGoal = Math.max(1, Number(goal || 1))
  const percent = Math.min(100, Math.round((safeValue / safeGoal) * 100))

  return (
    <div className="rounded-[20px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
      <div className="flex items-center gap-3">
        <div
          className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${color} ${percent}%, var(--shadow-border) ${percent}% 100%)`,
          }}
        >
          <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[var(--shadow-bg-surface)]">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: softColor || '#f5f0ff', color }}
            >
              <i className={`${icon} text-[14px]`} />
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[24px] font-black leading-none text-[var(--shadow-text-primary)]">
            {formatCompactNumber(safeValue)}
          </div>
          <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{label}</div>
          <div className="mt-1 text-[10px] font-medium text-[var(--shadow-text-tertiary)]">{helper || dashText('goal', { value: formatCompactNumber(safeGoal) })}</div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, note, tone = 'purple' }) {
  const toneClass = {
    purple: 'bg-[#f1eafe] text-[#8b5cf6]',
    pink: 'bg-[#fff0f7] text-[#ec4899]',
    blue: 'bg-[#eef5ff] text-[#3b82f6]',
    green: 'bg-[#ecfdf5] text-[#10b981]',
  }[tone]

  return (
    <div className="rounded-[16px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">{label}</div>
          <div className="mt-1 text-[18px] font-black text-[var(--shadow-text-primary)]">{formatCompactNumber(value)}</div>
        </div>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
          <i className={`${icon} text-[12px]`} />
        </span>
      </div>
      <div className="mt-2 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">{note}</div>
    </div>
  )
}

function AnalyticsChart({ series = [], total = 0, periodLabel = '28 Days' }) {
  const values = (Array.isArray(series) ? series : []).map(
    (item) =>
      Number(item?.page_views || 0) +
      Number(item?.story_reads || 0) +
      Number(item?.interactions || 0)
  )
  const chartValues = values.length ? values : [0]
  const max = Math.max(...chartValues, 1)
  const points = chartValues
    .map((value, index) => {
      const x = (index / Math.max(chartValues.length - 1, 1)) * 100
      const y = 48 - (value / max) * 40
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="mt-4 rounded-[18px] bg-gradient-to-b from-[var(--shadow-bg-surface)] to-[var(--shadow-bg-soft)] px-3 pb-3 pt-4 ring-1 ring-[var(--shadow-border)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{dashText('contentPerformance')}</div>
          <div className="mt-0.5 text-[20px] font-black text-[var(--shadow-text-primary)]">
            {formatCompactNumber(total)}
          </div>
        </div>
        <div className="rounded-full bg-[#f1eafe] px-3 py-1.5 text-[10px] font-semibold text-[#7c3aed]">
          {periodLabel === '28 Days' ? dashText('period28') : periodLabel === '7 Days' ? dashText('period7') : dashText('today')}
        </div>
      </div>

      <div className="relative h-[180px] overflow-hidden rounded-[14px] bg-[var(--shadow-bg-surface)]">
        <div className="absolute inset-0 grid grid-rows-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="border-b border-[var(--shadow-border)]" />
          ))}
        </div>

        <svg
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          className="absolute bottom-7 left-3 right-3 top-4 h-[135px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,50 ${points} 100,50`} fill="url(#dashboardArea)" />
          <polyline
            points={points}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[9px] font-medium text-[var(--shadow-text-tertiary)]">
          <span>{dashText('start')}</span>
          <span>{dashText('mid')}</span>
          <span>{dashText('now')}</span>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center px-5 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
        <i className={`${icon} text-[18px]`} />
      </span>
      <div className="mt-3 text-[13px] font-bold text-[var(--shadow-text-primary)]">{title}</div>
      <div className="mt-1 max-w-[260px] text-[11px] font-medium leading-5 text-[var(--shadow-text-tertiary)]">{text}</div>
    </div>
  )
}

function SectionHeader({ title, icon, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2ecff] text-[#8b5cf6]">
            <i className={`${icon} text-[11px]`} />
          </span>
        ) : null}
        <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)] sm:text-[18px]">{title}</h2>
      </div>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="text-[11px] font-semibold text-[#8b5cf6] active:opacity-70"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

function LatestPostCard({ post, onOpen }) {
  if (!post) {
    return (
      <EmptyState
        icon="fa-regular fa-pen-to-square"
        title={dashText('noPostYet')}
        text={dashText('noPostHelp')}
      />
    )
  }

  const imageUrl = Array.isArray(post.image_urls) ? post.image_urls[0] : ''

  return (
    <button type="button" onClick={onOpen} className="mt-4 block w-full text-left active:opacity-90">
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-[#f2ecff] sm:aspect-square">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#8b5cf6]">
              <i className="fa-regular fa-image text-[28px]" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-[#8b5cf6]">{dashText('latestPost')}</div>
          <div className="mt-1 line-clamp-3 text-[13px] font-bold leading-5 text-[var(--shadow-text-primary)]">
            {post.content || dashText('photoUpdate')}
          </div>
          <div className="mt-1.5 text-[10px] font-medium text-[var(--shadow-text-tertiary)]">
            {formatTimeAgo(post.created_at)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--shadow-border)] pt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
              <i className="fa-regular fa-heart text-[#8b5cf6]" />
              {formatCompactNumber(post.like_count)}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
              <i className="fa-regular fa-comment text-[#8b5cf6]" />
              {formatCompactNumber(post.comment_count)}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
              <i className="fa-solid fa-retweet text-[#8b5cf6]" />
              {formatCompactNumber(post.echo_count)}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

function RecentCommentRow({ item, onOpen }) {
  const comment = item?.comment || {}
  const post = item?.post || {}
  const user = comment.user || {}
  const avatarUrl = user.avatar_url || ''
  const imageUrl = Array.isArray(post.image_urls) ? post.image_urls[0] : ''
  const name = user.name || user.username || dashText('reader')

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 border-b border-[var(--shadow-border)] py-3 text-left last:border-b-0 active:bg-[var(--shadow-bg-soft)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f2ecff] text-[#8b5cf6]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-user text-[12px]" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--shadow-text-primary)]">
          <span className="truncate">{name}</span>
          <span className="font-medium text-[var(--shadow-text-tertiary)]">· {formatTimeAgo(comment.created_at)}</span>
        </span>
        <span className="mt-1 line-clamp-2 block text-[10.5px] font-medium leading-4 text-[var(--shadow-text-secondary)]">
          {comment.text || dashText('newComment')}
        </span>
      </span>

      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f2ecff] text-[#8b5cf6]">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <i className="fa-regular fa-file-lines text-[12px]" />
        )}
      </span>
    </button>
  )
}

function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] bg-[var(--shadow-bg-soft)] p-3 ring-1 ring-[var(--shadow-border)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-surface)] text-[#8b5cf6] shadow-sm">
        <i className={`${icon} text-[14px]`} />
      </span>
      <span className="min-w-0">
        <span className="block text-[18px] font-black text-[var(--shadow-text-primary)]">{formatCompactNumber(value)}</span>
        <span className="mt-0.5 block text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">{label}</span>
      </span>
    </div>
  )
}

function QuickAction({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[16px] bg-[var(--shadow-bg-soft)] p-3 text-left ring-1 ring-[var(--shadow-border)] transition active:scale-[0.99]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] text-white shadow-sm">
        <i className={`${icon} text-[14px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold text-[var(--shadow-text-primary)]">{title}</span>
        <span className="mt-0.5 block text-[9.5px] font-medium leading-4 text-[var(--shadow-text-tertiary)]">{text}</span>
      </span>
      <i className="fa-solid fa-chevron-right text-[9px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function ToolCard({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[16px] bg-[var(--shadow-bg-surface)] p-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] transition active:scale-[0.99]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] text-white">
        <i className={`${icon} text-[14px]`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold text-[var(--shadow-text-primary)]">{title}</span>
        <span className="mt-0.5 block text-[9.5px] font-medium leading-4 text-[var(--shadow-text-tertiary)]">{text}</span>
      </span>
      <i className="fa-solid fa-chevron-right text-[9px] text-[var(--shadow-text-tertiary)]" />
    </button>
  )
}

function DashboardFooter({ navigate }) {
  const items = [
    { id: 'Page', labelKey: 'page', icon: 'fa-regular fa-flag', path: '/author/page' },
    { id: 'Dashboard', labelKey: 'dashboard', icon: 'fa-solid fa-chart-simple', path: '/author/page/dashboard' },
    { id: 'Store', labelKey: 'store', icon: 'fa-solid fa-bag-shopping', path: '/author/page/store' },
    { id: 'Notifications', labelKey: 'notifications', icon: 'fa-regular fa-bell', path: '/author/page/notifications' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_-10px_30px_rgba(91,72,140,0.08)] backdrop-blur">
      <div className="mx-auto grid h-[68px] max-w-[980px] grid-cols-4">
        {items.map((item) => {
          const active = item.id === 'Dashboard'

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition active:scale-95 ${
                active ? 'text-[#8b5cf6]' : 'text-[var(--shadow-text-tertiary)]'
              }`}
            >
              <i className={`${item.icon} text-[18px]`} />
              <span>{dashText(item.labelKey)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function LoadingDashboard({ navigate }) {
  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <div className="text-[16px] font-black text-[var(--shadow-text-primary)]">{dashText('pageDashboard')}</div>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-5">
        <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-8 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[#8b5cf6]" />
          <div className="mt-4 text-[13px] font-bold text-[var(--shadow-text-primary)]">{dashText('loadingDashboard')}</div>
        </div>
      </main>

      <DashboardFooter navigate={navigate} />
    </div>
  )
}

export default function AuthorPageDashboardPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState('Overview')
  const [dashboardData, setDashboardData] = useState(null)
  const [authorPage, setAuthorPage] = useState(null)
  const [posts, setPosts] = useState([])
  const [recentComments, setRecentComments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [analyticsPeriod, setAnalyticsPeriod] = useState('28 Days')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      if (!silent) setLoading(true)
      setMessage('')

      const data = await fetchMyAuthorDashboard(analyticsPeriod)

      if (!data?.author_page) {
        throw new Error(t('authorPageDashboard.authorPageNotFound'))
      }

      setDashboardData(data)
      setAuthorPage(data.author_page)
      setPosts(data.latest_post ? [data.latest_post] : [])
      setRecentComments(Array.isArray(data.recent_comments) ? data.recent_comments : [])
      setNotifications(Array.isArray(data.notifications) ? data.notifications : [])
      setUnreadCount(Number(data.unread_updates || 0))
    } catch (error) {
      setMessage(error.message || t('authorPageDashboard.failedPageDashboard'))
    } finally {
      setLoading(false)
    }
  }, [analyticsPeriod, navigate, t])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    function refreshDashboard() {
      if (document.visibilityState === 'visible') {
        loadDashboard({ silent: true })
      }
    }

    window.addEventListener('focus', refreshDashboard)
    document.addEventListener('visibilitychange', refreshDashboard)

    return () => {
      window.removeEventListener('focus', refreshDashboard)
      document.removeEventListener('visibilitychange', refreshDashboard)
    }
  }, [loadDashboard])

  const overview = useMemo(() => {
    const data = dashboardData?.overview || {}

    return {
      posts: Number(data.posts || 0),
      stories: Number(data.stories || 0),
      followers: Number(data.followers || 0),
      comments: Number(data.comments || 0),
      episodes: Number(data.episodes || 0),
      postLikes: Number(data.post_likes || 0),
      postComments: Number(data.post_comments || 0),
      postEchoes: Number(data.post_echoes || 0),
      storyViews: Number(data.story_views || 0),
      storyLikes: Number(data.story_likes || 0),
      storyComments: Number(data.story_comments || 0),
      interactions: Number(data.lifetime_interactions || 0),
    }
  }, [dashboardData])

  const periodMetrics = useMemo(() => {
    const totals = dashboardData?.period_totals || {}

    return {
      views: Number(totals.page_views || 0),
      interactions: Number(totals.interactions || 0),
      followers: Number(totals.new_followers || 0),
      storyReads: Number(totals.story_reads || 0),
      comments: Number(totals.comments || 0),
    }
  }, [dashboardData])

  const analyticsSeries = useMemo(
    () => (Array.isArray(dashboardData?.analytics) ? dashboardData.analytics : []),
    [dashboardData]
  )

  const performanceTotal =
    periodMetrics.views + periodMetrics.storyReads + periodMetrics.interactions

  const profileCompletion = useMemo(() => getProfileCompletion(authorPage), [authorPage])
  const pageName = authorPage?.page_name || t('authorPageDashboard.authorPage')
  const avatarUrl = authorPage?.avatar_url || ''
  const authorInitial = pageName.trim().charAt(0).toUpperCase() || 'A'
  const latestPost = dashboardData?.latest_post || posts[0] || null
  const updateSummary = notifications
    .filter((item) => !item.is_read)
    .slice(0, 3)
    .map((item) => item.title || item.message)
    .filter(Boolean)
    .join(' • ')

  if (loading && !authorPage) {
    return <LoadingDashboard navigate={navigate} />
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px]">
      {message ? (
        <button
          type="button"
          onClick={() => setMessage('')}
          className="fixed left-1/2 top-[74px] z-[120] w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[16px] bg-[#302a43] px-4 py-3 text-left text-[11px] font-semibold text-white shadow-2xl"
        >
          {message}
        </button>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('authorPageDashboard.backToPage')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-black text-[var(--shadow-text-primary)]">{dashText('pageDashboard')}</div>

          <button
            type="button"
            onClick={() => navigate('/author/page-settings')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('authorPageDashboard.pageSettings')}
          >
            <i className="fa-solid fa-sliders text-[15px]" />
          </button>
        </div>

        <div className="mx-auto max-w-[1180px] overflow-x-auto px-4 pb-3">
          <div className="flex min-w-max gap-2">
            {DASHBOARD_TABS.map((tab) => (
              <DashboardTab
                key={tab.id}
                label={t(`authorPageDashboard.${tab.labelKey}`)}
                icon={tab.icon}
                active={tab.id === activeTab}
onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </header>

      <main
  className={`mx-auto max-w-[1180px] space-y-4 px-4 py-4 sm:space-y-5 sm:py-5 ${
    activeTab === 'Overview' ? '' : 'hidden'
  }`}
>
        <section className="relative overflow-hidden rounded-[24px] bg-[#ddd6fe] p-4 shadow-[0_14px_38px_rgba(106,76,180,0.14)] sm:p-5">
  <img
    src="/assets/Author%20Page/Dashboard%20Banner.png"
    alt=""
    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
  />

          <div className="relative z-10 flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-4 border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[24px] font-black text-[#8b5cf6] shadow-lg sm:h-[82px] sm:w-[82px]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
                ) : (
                  authorInitial
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--shadow-border)] bg-[#8b5cf6] text-white">
                <i className="fa-solid fa-check text-[10px]" />
              </span>
            </div>

            <div className="min-w-0 flex-1 sm:max-w-[620px]">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[20px] font-black text-[var(--shadow-text-primary)] sm:text-[24px]">{pageName}</h1>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b5cf6] text-white">
                  <i className="fa-solid fa-check text-[8px]" />
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                <span>{t('authorPageDashboard.authorPage')}</span>
                <button
                  type="button"
                 onClick={() =>
  navigate('/author/edit-page', {
    state: { returnTo: '/author/page/dashboard' },
  })
}
                  className="rounded-full bg-[var(--shadow-bg-surface)] px-3 py-1 text-[#7c3aed] active:scale-95"
                >
                  {t('authorPageDashboard.setUpPage')}
                </button>
              </div>

              <p className="mt-2 line-clamp-2 max-w-[540px] text-[10.5px] font-medium leading-5 text-[var(--shadow-text-secondary)]">
                {authorPage?.bio || t('authorPageDashboard.defaultBio')}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="text-[11px] font-bold text-[#7c3aed]">{t('authorPageDashboard.profileSetup', { value: profileCompletion })}</div>
                <button
                  type="button"
                  onClick={() => navigate('/author/page')}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--shadow-bg-surface)] px-4 text-[10px] font-semibold text-[#7c3aed] shadow-sm active:scale-95 sm:absolute sm:right-4 sm:top-4"
                >
                  {t('authorPageDashboard.viewPublicPage')}
                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/page/notifications')}
          className="flex w-full items-center gap-3 rounded-[20px] bg-[var(--shadow-bg-surface)] p-4 text-left shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)] active:scale-[0.995]"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eafe] text-[#8b5cf6]">
            <i className="fa-solid fa-bell text-[15px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-bold text-[var(--shadow-text-primary)]">
              {unreadCount > 0 ? t('authorPageDashboard.updatesCount', { count: unreadCount }) : t('authorPageDashboard.allCaughtUp')}
            </span>
            <span className="mt-1 line-clamp-1 block text-[10px] font-medium text-[var(--shadow-text-tertiary)]">
              {updateSummary || t('authorPageDashboard.updatesHelp')}
            </span>
          </span>
          <i className="fa-solid fa-chevron-right text-[11px] text-[var(--shadow-text-tertiary)]" />
        </button>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ProgressStat
            label={t('authorPageDashboard.posts')}
            value={overview.posts}
            goal={getNextGoal(overview.posts, 10, 20)}
            icon="fa-regular fa-file-lines"
            color="#9b7cf8"
            softColor="#f3efff"
          />
          <ProgressStat
            label={t('authorPageDashboard.stories')}
            value={overview.stories}
            goal={getNextGoal(overview.stories, 5, 10)}
            icon="fa-solid fa-book-open"
            color="#f4b74a"
            softColor="#fff6e6"
          />
          <ProgressStat
            label={t('authorPageDashboard.followers')}
            value={periodMetrics.followers}
            goal={getNextGoal(overview.followers, 100, 100)}
            icon="fa-solid fa-user-group"
            color="#58c995"
            softColor="#ecfbf4"
          />
          <ProgressStat
            label={t('authorPageDashboard.comments')}
            value={overview.comments}
            goal={getNextGoal(overview.comments, 100, 100)}
            icon="fa-solid fa-comment-dots"
            color="#ee7d90"
            softColor="#fff0f3"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)] sm:p-5">
            <SectionHeader title={t('authorPageDashboard.analytics')} icon="fa-solid fa-chart-line" />

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {['28 Days', '7 Days', 'Today'].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setAnalyticsPeriod(period)}
                  className={`h-8 shrink-0 rounded-full px-4 text-[10px] font-semibold transition active:scale-95 ${
                    analyticsPeriod === period
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white shadow-sm'
                      : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'
                  }`}
                >
                  {period === '28 Days' ? t('authorPageDashboard.period28') : period === '7 Days' ? t('authorPageDashboard.period7') : t('authorPageDashboard.today')}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MetricCard
                label={t('authorPageDashboard.views')}
                value={periodMetrics.views}
                icon="fa-regular fa-eye"
                note={t('authorPageDashboard.pageVisits')}
                tone="purple"
              />
              <MetricCard
                label={t('authorPageDashboard.interactions')}
                value={periodMetrics.interactions}
                icon="fa-regular fa-heart"
                note={t('authorPageDashboard.readerActions')}
                tone="pink"
              />
              <MetricCard
                label={t('authorPageDashboard.followers')}
                value={overview.followers}
                icon="fa-solid fa-user-plus"
                note={t('authorPageDashboard.newFollowers')}
                tone="blue"
              />
              <MetricCard
                label={t('authorPageDashboard.storyReads')}
                value={periodMetrics.storyReads}
                icon="fa-solid fa-book-open-reader"
                note={t('authorPageDashboard.qualifiedReads')}
                tone="green"
              />
            </div>

            <AnalyticsChart
              series={analyticsSeries}
              total={performanceTotal}
              periodLabel={analyticsPeriod}
            />
          </div>

          <div className="space-y-4">
            <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
              <SectionHeader
                title={t('authorPageDashboard.latestPost')}
                icon="fa-regular fa-pen-to-square"
                actionLabel={t('authorPageDashboard.viewAll')}
                onAction={() => navigate('/author/page')}
              />
              <LatestPostCard
                post={latestPost}
                onOpen={() =>
                  navigate(latestPost?.id ? `/author/page?post=${latestPost.id}` : '/author/page')
                }
              />
            </section>

            <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)]">
              <SectionHeader
                title={t('authorPageDashboard.recentComments')}
                icon="fa-regular fa-comments"
                actionLabel={t('authorPageDashboard.viewAll')}
                onAction={() => navigate('/author/page/notifications')}
              />

              <div className="mt-2">
                {recentComments.length ? (
                  recentComments.map((item) => (
                    <RecentCommentRow
                      key={item.comment?.id}
                      item={item}
                      onOpen={() =>
                        navigate(
                          item.post?.id ? `/author/page?post=${item.post.id}` : '/author/page'
                        )
                      }
                    />
                  ))
                ) : (
                  <EmptyState
                    icon="fa-regular fa-comment-dots"
                    title={t('authorPageDashboard.noRecentComments')}
                    text={t('authorPageDashboard.recentCommentsHelp')}
                  />
                )}
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)] sm:p-5">
            <SectionHeader
              title={t('authorPageDashboard.contentOverview')}
              icon="fa-solid fa-book"
              actionLabel={t('authorPageDashboard.viewAll')}
              onAction={() => navigate('/author/page')}
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <OverviewItem icon="fa-solid fa-book-open" label={t('authorPageDashboard.publishedStories')} value={overview.stories} />
              <OverviewItem icon="fa-solid fa-list-ol" label={t('authorPageDashboard.totalEpisodes')} value={overview.episodes} />
              <OverviewItem icon="fa-regular fa-heart" label={t('authorPageDashboard.storyLikes')} value={overview.storyLikes} />
              <OverviewItem icon="fa-regular fa-comment" label={t('authorPageDashboard.storyComments')} value={overview.storyComments} />
            </div>
          </div>

          <div className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)] sm:p-5">
            <SectionHeader title={t('authorPageDashboard.quickActions')} icon="fa-solid fa-bolt" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <QuickAction
                icon="fa-regular fa-pen-to-square"
                title={t('authorPageDashboard.createPost')}
                text={t('authorPageDashboard.createPostHelp')}
                onClick={() => navigate('/author/page')}
              />
              <QuickAction
                icon="fa-solid fa-plus"
                title={t('authorPageDashboard.addStory')}
                text={t('authorPageDashboard.addStoryHelp')}
                onClick={() => navigate('/author/create-story')}
              />
              <QuickAction
                icon="fa-solid fa-bag-shopping"
                title={t('authorPageDashboard.openStore')}
                text={t('authorPageDashboard.openStoreHelp')}
                onClick={() => navigate('/author/page/store')}
              />
              <QuickAction
                icon="fa-solid fa-user-pen"
                title={t('authorPageDashboard.editPage')}
                text={t('authorPageDashboard.editPageHelp')}
                onClick={() => navigate('/author/edit-page')}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_30px_rgba(105,82,160,0.08)] ring-1 ring-[var(--shadow-border)] sm:p-5">
          <SectionHeader title={t('authorPageDashboard.otherTools')} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              icon="fa-solid fa-pen-to-square"
              title={t('authorPageDashboard.editPage')}
              text={t('authorPageDashboard.updatePageDetails')}
              onClick={() =>
  navigate('/author/edit-page', {
    state: { returnTo: '/author/page/dashboard' },
  })
}
            />
            <ToolCard
              icon="fa-solid fa-book-open"
              title={t('authorPageDashboard.storyManager')}
              text={t('authorPageDashboard.manageStories')}
              onClick={() =>
  navigate('/author/dashboard', {
    state: { returnTo: '/author/page/dashboard' },
  })
}
            />
            <ToolCard
              icon="fa-solid fa-gear"
              title={t('authorPageDashboard.settings')}
              text={t('authorPageDashboard.settingsHelp')}
              onClick={() => navigate('/author/page-settings')}
            />
            <ToolCard
              icon="fa-solid fa-headset"
              title={t('authorPageDashboard.readerSupport')}
              text={t('authorPageDashboard.readerSupportHelp')}
              onClick={() => setMessage(t('authorPageDashboard.readerSupportLater'))}
            />
          </div>
        </section>
      </main>

      {activeTab !== 'Overview' ? (
  <main className="mx-auto max-w-[1180px] px-4 py-4 sm:py-5">
    {activeTab === 'Content' ? (
      <AuthorDashboardContentTab
        overview={overview}
        periodMetrics={periodMetrics}
        topStories={dashboardData?.top_stories || []}
        latestPost={latestPost}
        analyticsPeriod={analyticsPeriod}
        onPeriodChange={setAnalyticsPeriod}
        onOpenStory={(story) => navigate(`/story/${story.id}`)}
        onOpenPost={(post) => navigate(`/author/page?post=${post.id}`)}
        onViewAll={() => navigate('/author/dashboard')}
        onCreateContent={() => navigate('/author/create-story')}
      />
    ) : null}

    {activeTab === 'Community' ? (
      <AuthorDashboardCommunityTab
        pageUsername={authorPage?.page_username || ''}
        overview={overview}
        periodMetrics={periodMetrics}
        recentComments={recentComments}
        analyticsPeriod={analyticsPeriod}
        onPeriodChange={setAnalyticsPeriod}
        onOpenReview={() => navigate('/author/page')}
        onOpenDiscussion={(item) =>
          navigate(item?.post?.id ? `/author/page?post=${item.post.id}` : '/author/page')
        }
        onViewAllReviews={() => navigate('/author/page')}
        onViewAllDiscussions={() => navigate('/author/page/notifications')}
      />
    ) : null}

    {activeTab === 'Page Tools' ? (
      <AuthorDashboardPageToolsTab
        authorPage={authorPage}
        profileCompletion={profileCompletion}
        notifications={notifications}
        onEditInfo={() =>
          navigate('/author/edit-page', {
            state: { returnTo: '/author/page/dashboard' },
          })
        }
        onTheme={() => navigate('/author/page/edit?section=cover')}
        onLinks={() => navigate('/author/page/edit?section=links')}
        onPinnedPosts={() => navigate('/author/page')}
        onManageTools={() => navigate('/author/page-settings')}
      />
    ) : null}
  </main>
) : null}


      <DashboardFooter navigate={navigate} />
    </div>
  )
}
