import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'
import BlackSundayEventTab from '../components/events/BlackSundayEventTab'
import WriterWednesdayEventCard from '../components/events/WriterWednesdayEventCard'
import Author49DayEventCard from '../components/events/Author49DayEventCard'
import ManagedEventHeroCard from '../components/events/ManagedEventHeroCard'
import MonthlyVoteTab from './Event/MonthlyVoteTab'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'


registerTranslationNamespace('eventPage', {
  en: {
    write: 'Write',
    group: 'Group',
    ranking: 'Ranking',
    reward: 'Reward',
    guide: 'Guide',
    badgeNew: 'NEW',
    badgeHot: 'HOT',
    badgeTop: 'TOP',
    earnMore: 'Earn More',
    earnMoreText: 'Grow income from your stories.',
    growFans: 'Grow Fans',
    growFansText: 'Build your own reader base.',
    getFeatured: 'Get Featured',
    getFeaturedText: 'Join events and get promoted.',
    author: 'Author',
    noWorksYet: 'No works yet',
    oneWork: '1 work',
    works: '{{count}} works',
    view: 'View',
    following: 'Following',
    follow: 'Follow',
    top: 'Top',
    followers: '{{count}} followers',
    mostReadStory: 'Most Read Story',
    untitledStory: 'Untitled Story',
    mostReadThisWeek: 'Most Read This Week',
    loadingSlides: 'Loading slides...',
    noSlidesYet: 'No slides yet',
    eventSlide: 'Event slide',
    loadingBanners: 'Loading banners...',
    noAuthorCenterBanner: 'No Author Center banner yet',
    authorCenterBanner: 'Author Center banner',
    showingNow: 'Showing now',
    tapToView: 'Tap to view',
    viewEvent: 'View {{title}}',
    upcoming: 'Upcoming',
    nextEvent: 'Next Event',
    startsIn: 'Starts in {{days}}d {{hours}}h {{minutes}}m',
    noUpcomingEvents: 'No upcoming events',
    writerWednesday70: 'Writer Wednesday — 70% for Authors',
    blackSunday: 'Black Sunday',
    writerWednesday: 'Writer Wednesday',
    weeklyEvent: 'Weekly Event',
    author49Days: '80% for 49 Days',
    authorEvent: 'Author Event',
    goBack: 'Go back',
    event: 'Event',
    vote: 'Vote',
    becomeWriter: 'Become A Writer',
    becomeWriterText: 'Share your stories, build your readers, and grow with Shadow.',
    startYourWork: 'Start your work',
    needHelp: 'Need help?',
    helpCenter: 'Help Center',
    authorCenter: 'Author Center',
    topAuthorsThisWeek: 'Top Authors This Week',
    topAuthorsHelp: 'Discover popular authors readers are following now.',
    noTopAuthors: 'No top authors yet',
    topAuthorsEmpty: 'Authors will appear here when ranking data is available.',
    noEventRightNow: 'No event right now',
    authorCheckFailed: 'Failed to check author page',
    somethingWrong: 'Something went wrong',
  },
  km: {
    write: 'សរសេរ',
    group: 'ក្រុម',
    ranking: 'ចំណាត់ថ្នាក់',
    reward: 'រង្វាន់',
    guide: 'ការណែនាំ',
    badgeNew: 'ថ្មី',
    badgeHot: 'ពេញនិយម',
    badgeTop: 'កំពូល',
    earnMore: 'រកចំណូលបន្ថែម',
    earnMoreText: 'បង្កើនចំណូលពីរឿងរបស់អ្នក។',
    growFans: 'បង្កើនអ្នកគាំទ្រ',
    growFansText: 'កសាងមូលដ្ឋានអ្នកអានផ្ទាល់ខ្លួន។',
    getFeatured: 'ទទួលការផ្សព្វផ្សាយ',
    getFeaturedText: 'ចូលរួម Event និងទទួលការផ្សព្វផ្សាយ។',
    author: 'អ្នកនិពន្ធ',
    noWorksYet: 'មិនទាន់មានស្នាដៃ',
    oneWork: '1 ស្នាដៃ',
    works: '{{count}} ស្នាដៃ',
    view: 'មើល',
    following: 'កំពុង Follow',
    follow: 'Follow',
    top: 'កំពូល',
    followers: '{{count}} អ្នក Follow',
    mostReadStory: 'រឿងដែលមានអ្នកអានច្រើន',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    mostReadThisWeek: 'អានច្រើនបំផុតសប្តាហ៍នេះ',
    loadingSlides: 'កំពុងផ្ទុក Slides...',
    noSlidesYet: 'មិនទាន់មាន Slides',
    eventSlide: 'Slide ព្រឹត្តិការណ៍',
    loadingBanners: 'កំពុងផ្ទុក Banners...',
    noAuthorCenterBanner: 'មិនទាន់មាន Banner នៅ Author Center',
    authorCenterBanner: 'Banner របស់ Author Center',
    showingNow: 'កំពុងបង្ហាញ',
    tapToView: 'ចុចដើម្បីមើល',
    viewEvent: 'មើល {{title}}',
    upcoming: 'ព្រឹត្តិការណ៍បន្ទាប់',
    nextEvent: 'Event បន្ទាប់',
    startsIn: 'ចាប់ផ្តើមក្នុង {{days}}ថ្ងៃ {{hours}}ម៉ោង {{minutes}}នាទី',
    noUpcomingEvents: 'មិនមានព្រឹត្តិការណ៍បន្ទាប់',
    writerWednesday70: 'Writer Wednesday — 70% សម្រាប់អ្នកនិពន្ធ',
    blackSunday: 'Black Sunday',
    writerWednesday: 'Writer Wednesday',
    weeklyEvent: 'ព្រឹត្តិការណ៍ប្រចាំសប្តាហ៍',
    author49Days: '80% រយៈពេល 49 ថ្ងៃ',
    authorEvent: 'ព្រឹត្តិការណ៍អ្នកនិពន្ធ',
    goBack: 'ត្រឡប់ក្រោយ',
    event: 'ព្រឹត្តិការណ៍',
    vote: 'បោះឆ្នោត',
    becomeWriter: 'ក្លាយជាអ្នកនិពន្ធ',
    becomeWriterText: 'ចែករំលែករឿង កសាងអ្នកអាន និងរីកចម្រើនជាមួយ Shadow។',
    startYourWork: 'ចាប់ផ្តើមស្នាដៃរបស់អ្នក',
    needHelp: 'ត្រូវការជំនួយ?',
    helpCenter: 'មជ្ឈមណ្ឌលជំនួយ',
    authorCenter: 'មជ្ឈមណ្ឌលអ្នកនិពន្ធ',
    topAuthorsThisWeek: 'អ្នកនិពន្ធកំពូលសប្តាហ៍នេះ',
    topAuthorsHelp: 'ស្វែងរកអ្នកនិពន្ធពេញនិយមដែលអ្នកអានកំពុង Follow។',
    noTopAuthors: 'មិនទាន់មានអ្នកនិពន្ធកំពូល',
    topAuthorsEmpty: 'អ្នកនិពន្ធនឹងបង្ហាញនៅទីនេះ ពេលមានទិន្នន័យចំណាត់ថ្នាក់។',
    noEventRightNow: 'ឥឡូវនេះមិនមានព្រឹត្តិការណ៍ទេ',
    authorCheckFailed: 'មិនអាចពិនិត្យទំព័រអ្នកនិពន្ធបានទេ',
    somethingWrong: 'មានបញ្ហាអ្វីមួយ',
  },
  zh: {
    write: '写作',
    group: '群组',
    ranking: '排行榜',
    reward: '奖励',
    guide: '指南',
    badgeNew: '新',
    badgeHot: '热门',
    badgeTop: '榜首',
    earnMore: '赚取更多',
    earnMoreText: '通过你的故事增加收入。',
    growFans: '增加粉丝',
    growFansText: '建立属于你的读者群。',
    getFeatured: '获得推荐',
    getFeaturedText: '参加活动并获得推广。',
    author: '作者',
    noWorksYet: '暂无作品',
    oneWork: '1 部作品',
    works: '{{count}} 部作品',
    view: '查看',
    following: '已关注',
    follow: '关注',
    top: '榜首',
    followers: '{{count}} 位关注者',
    mostReadStory: '热门阅读故事',
    untitledStory: '无标题故事',
    mostReadThisWeek: '本周阅读最多',
    loadingSlides: '正在加载轮播...',
    noSlidesYet: '暂无轮播',
    eventSlide: '活动轮播',
    loadingBanners: '正在加载横幅...',
    noAuthorCenterBanner: '作者中心暂无横幅',
    authorCenterBanner: '作者中心横幅',
    showingNow: '正在显示',
    tapToView: '点击查看',
    viewEvent: '查看 {{title}}',
    upcoming: '即将开始',
    nextEvent: '下一个活动',
    startsIn: '{{days}}天 {{hours}}小时 {{minutes}}分钟后开始',
    noUpcomingEvents: '暂无即将开始的活动',
    writerWednesday70: 'Writer Wednesday — 作者获得 70%',
    blackSunday: 'Black Sunday',
    writerWednesday: 'Writer Wednesday',
    weeklyEvent: '每周活动',
    author49Days: '49 天 80%',
    authorEvent: '作者活动',
    goBack: '返回',
    event: '活动',
    vote: '投票',
    becomeWriter: '成为作者',
    becomeWriterText: '分享你的故事，积累读者，与 Shadow 一起成长。',
    startYourWork: '开始创作',
    needHelp: '需要帮助？',
    helpCenter: '帮助中心',
    authorCenter: '作者中心',
    topAuthorsThisWeek: '本周热门作者',
    topAuthorsHelp: '发现读者正在关注的热门作者。',
    noTopAuthors: '暂无热门作者',
    topAuthorsEmpty: '有排行榜数据后，作者会显示在这里。',
    noEventRightNow: '当前暂无活动',
    authorCheckFailed: '无法检查作者页面',
    somethingWrong: '出现了一些问题',
  },
  ja: {
    write: '執筆',
    group: 'グループ',
    ranking: 'ランキング',
    reward: '報酬',
    guide: 'ガイド',
    badgeNew: '新着',
    badgeHot: '人気',
    badgeTop: 'トップ',
    earnMore: '収益アップ',
    earnMoreText: '作品からの収益を伸ばしましょう。',
    growFans: 'ファンを増やす',
    growFansText: '自分の読者コミュニティを築きましょう。',
    getFeatured: 'おすすめ掲載',
    getFeaturedText: 'イベントに参加してプロモーションを受けましょう。',
    author: '作者',
    noWorksYet: '作品はまだありません',
    oneWork: '1作品',
    works: '{{count}}作品',
    view: '見る',
    following: 'フォロー中',
    follow: 'フォロー',
    top: 'トップ',
    followers: '{{count}} フォロワー',
    mostReadStory: '人気作品',
    untitledStory: '無題の作品',
    mostReadThisWeek: '今週最も読まれた作品',
    loadingSlides: 'スライドを読み込み中...',
    noSlidesYet: 'スライドはまだありません',
    eventSlide: 'イベントスライド',
    loadingBanners: 'バナーを読み込み中...',
    noAuthorCenterBanner: 'Author Center のバナーはまだありません',
    authorCenterBanner: 'Author Center バナー',
    showingNow: '表示中',
    tapToView: 'タップして表示',
    viewEvent: '{{title}} を見る',
    upcoming: '近日開催',
    nextEvent: '次のイベント',
    startsIn: '開始まで {{days}}日 {{hours}}時間 {{minutes}}分',
    noUpcomingEvents: '今後のイベントはありません',
    writerWednesday70: 'Writer Wednesday — 作者に70%',
    blackSunday: 'Black Sunday',
    writerWednesday: 'Writer Wednesday',
    weeklyEvent: '週間イベント',
    author49Days: '49日間 80%',
    authorEvent: '作者イベント',
    goBack: '戻る',
    event: 'イベント',
    vote: '投票',
    becomeWriter: '作者になる',
    becomeWriterText: '作品を共有し、読者を増やし、Shadow と一緒に成長しましょう。',
    startYourWork: '作品を始める',
    needHelp: 'ヘルプが必要ですか？',
    helpCenter: 'ヘルプセンター',
    authorCenter: '作者センター',
    topAuthorsThisWeek: '今週のトップ作者',
    topAuthorsHelp: '読者が今フォローしている人気作者を見つけましょう。',
    noTopAuthors: 'トップ作者はまだいません',
    topAuthorsEmpty: 'ランキングデータが利用可能になると作者がここに表示されます。',
    noEventRightNow: '現在イベントはありません',
    authorCheckFailed: '作者ページを確認できませんでした',
    somethingWrong: '問題が発生しました',
  },
  ko: {
    write: '글쓰기',
    group: '그룹',
    ranking: '랭킹',
    reward: '보상',
    guide: '가이드',
    badgeNew: '신규',
    badgeHot: '인기',
    badgeTop: 'TOP',
    earnMore: '수익 늘리기',
    earnMoreText: '작품으로 더 많은 수익을 올리세요.',
    growFans: '팬 늘리기',
    growFansText: '나만의 독자층을 만들어 보세요.',
    getFeatured: '추천 받기',
    getFeaturedText: '이벤트에 참여하고 홍보 기회를 받으세요.',
    author: '작가',
    noWorksYet: '아직 작품이 없습니다',
    oneWork: '작품 1개',
    works: '작품 {{count}}개',
    view: '보기',
    following: '팔로잉',
    follow: '팔로우',
    top: 'TOP',
    followers: '팔로워 {{count}}명',
    mostReadStory: '인기 작품',
    untitledStory: '제목 없는 작품',
    mostReadThisWeek: '이번 주 최다 조회',
    loadingSlides: '슬라이드 불러오는 중...',
    noSlidesYet: '아직 슬라이드가 없습니다',
    eventSlide: '이벤트 슬라이드',
    loadingBanners: '배너 불러오는 중...',
    noAuthorCenterBanner: 'Author Center 배너가 아직 없습니다',
    authorCenterBanner: 'Author Center 배너',
    showingNow: '현재 표시 중',
    tapToView: '눌러서 보기',
    viewEvent: '{{title}} 보기',
    upcoming: '예정된 이벤트',
    nextEvent: '다음 이벤트',
    startsIn: '{{days}}일 {{hours}}시간 {{minutes}}분 후 시작',
    noUpcomingEvents: '예정된 이벤트가 없습니다',
    writerWednesday70: 'Writer Wednesday — 작가 70%',
    blackSunday: 'Black Sunday',
    writerWednesday: 'Writer Wednesday',
    weeklyEvent: '주간 이벤트',
    author49Days: '49일간 80%',
    authorEvent: '작가 이벤트',
    goBack: '뒤로',
    event: '이벤트',
    vote: '투표',
    becomeWriter: '작가가 되어보세요',
    becomeWriterText: '작품을 공유하고 독자를 늘리며 Shadow와 함께 성장하세요.',
    startYourWork: '작품 시작하기',
    needHelp: '도움이 필요하신가요?',
    helpCenter: '도움말 센터',
    authorCenter: '작가 센터',
    topAuthorsThisWeek: '이번 주 인기 작가',
    topAuthorsHelp: '독자들이 지금 팔로우하는 인기 작가를 만나보세요.',
    noTopAuthors: '아직 인기 작가가 없습니다',
    topAuthorsEmpty: '랭킹 데이터가 준비되면 작가가 여기에 표시됩니다.',
    noEventRightNow: '현재 진행 중인 이벤트가 없습니다',
    authorCheckFailed: '작가 페이지를 확인하지 못했습니다',
    somethingWrong: '문제가 발생했습니다',
  },
})

const SHORTCUT_LABEL_KEYS = { Write: 'write', Group: 'group', Ranking: 'ranking', Reward: 'reward', Guide: 'guide' }
const BENEFIT_LABEL_KEYS = { 'Earn More': ['earnMore', 'earnMoreText'], 'Grow Fans': ['growFans', 'growFansText'], 'Get Featured': ['getFeatured', 'getFeaturedText'] }
const EVENT_BADGE_LABEL_KEYS = { NEW: 'badgeNew', HOT: 'badgeHot', TOP: 'badgeTop' }

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'
const EVENT_SLIDE_SECTION_KEY = 'event_top_slider'
const AUTHOR_CENTER_SECTION_KEY = 'author_center'

const shortcutItems = [
  { label: 'Write', icon: 'fa-pen-nib', type: 'primary' },
  { label: 'Group', icon: 'fa-users' },
  { label: 'Ranking', icon: 'fa-trophy' },
  { label: 'Reward', icon: 'fa-gift' },
  { label: 'Guide', icon: 'fa-book-open' },
]

const benefitItems = [
  { icon: 'fa-sack-dollar', title: 'Earn More', text: 'Grow income from your stories.' },
  { icon: 'fa-users', title: 'Grow Fans', text: 'Build your own reader base.' },
  { icon: 'fa-star', title: 'Get Featured', text: 'Join events and get promoted.' },
]

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function parseBannerTitle(value = '') {
  const match = String(value).match(/^\[(NEW|HOT|TOP)\]\s*(.*)$/i)

  if (!match) {
    return {
      badge: '',
      title: value || '',
    }
  }

  return {
    badge: match[1].toUpperCase(),
    title: match[2] || '',
  }
}

const eventSlideBadgeColors = {
  NEW: 'bg-[#ff2f55] text-white',
  HOT: 'bg-[#ff7a00] text-white',
  TOP: 'bg-[#f6b800] text-[#111827]',
}

function getEventSlideBadge(slide) {
  const directBadge = String(slide.badge || slide.badge_label || slide.tag || '').trim().toUpperCase()
  const titleBadge = String(slide.title || '').match(/^\s*\[(HOT|NEW|TOP)\]\s*/i)?.[1]?.toUpperCase() || ''
  const badge = directBadge || titleBadge

  return ['HOT', 'NEW', 'TOP'].includes(badge) ? badge : ''
}

function getEventSlideTitle(slide) {
  return String(slide.title || '').replace(/^\s*\[(HOT|NEW|TOP)\]\s*/i, '').trim()
}

function getEventSlideSubtitle(slide) {
  return String(slide.subtitle || slide.sub_title || slide.description || '').trim()
}

function getEventSlideBadgeClass(badge) {
  return eventSlideBadgeColors[badge] || 'bg-[#ff2f55] text-white'
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function TopAuthorCard({ rank, author, onOpen, onFollow, loading }) {
  const { t } = useDisplayTranslation()
  const name = author?.page_name || t('eventPage.author')
  const username = author?.page_username || 'author'
  const avatarUrl = author?.avatar_url || ''
  const followers = formatCompactNumber(author?.total_followers)
  const worksCount = Number(author?.total_stories || 0)
  const worksLabel =
    worksCount === 0
      ? t('eventPage.noWorksYet')
      : worksCount === 1
        ? t('eventPage.oneWork')
        : t('eventPage.works', { count: formatCompactNumber(worksCount) })
  const buttonLabel = author?.is_owner
    ? t('eventPage.view')
    : author?.is_following
      ? t('eventPage.following')
      : t('eventPage.follow')
  const rankBadgeClasses = {
    1: 'bg-[#FF3B30] text-white shadow-[0_8px_18px_rgba(255,59,48,0.28)]',
    2: 'bg-[#FF8C00] text-white shadow-[0_8px_18px_rgba(255,140,0,0.25)]',
    3: 'bg-[#FFD400] text-[#111827] shadow-[0_8px_18px_rgba(255,212,0,0.25)]',
    4: 'bg-[#8A2BE2] text-white shadow-[0_8px_18px_rgba(138,43,226,0.24)]',
    5: 'bg-[#A0A7B4] text-white shadow-[0_8px_18px_rgba(160,167,180,0.22)]',
    6: 'bg-[#A0A7B4] text-white shadow-[0_8px_18px_rgba(160,167,180,0.22)]',
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(author)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpen(author)
      }}
      className="relative min-w-[132px] overflow-hidden rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 pb-4 pt-5 text-center shadow-sm active:scale-[0.98]"
    >
      <div
        className={`absolute left-0 top-0 z-10 flex h-[48px] w-[30px] flex-col items-center justify-start pt-2 ${rankBadgeClasses[rank] || 'bg-[#A0A7B4] text-white'}`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' }}
      >
        <span className="text-[8px] font-black uppercase leading-none tracking-wide">{t('eventPage.top')}</span>
        <span className="mt-1 text-[15px] font-bold leading-none">{rank}</span>
      </div>

      <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[18px] font-black text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            String(name || 'A').slice(0, 1).toUpperCase()
          )}
        </div>
      </div>

      <div className="line-clamp-1 text-[12px] font-black text-[var(--shadow-text-primary)]">{name}</div>
      <div className="mt-1 line-clamp-1 text-[10px] font-bold text-[var(--shadow-text-secondary)]">@{username}</div>
      <div className="mt-2 text-[10px] font-extrabold text-[var(--shadow-text-primary)]">{t('eventPage.followers', { count: followers })}</div>
      <div className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">{worksLabel}</div>

      <button
        type="button"
        disabled={loading}
        onClick={(event) => {
          event.stopPropagation()

          if (author?.is_owner || author?.is_following) {
            onOpen(author)
            return
          }

          onFollow(author)
        }}
        className={`mt-3 w-full rounded-full py-2 text-[10px] font-black active:scale-95 disabled:opacity-60 ${
          author?.is_following ? 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]' : 'bg-black text-white dark:bg-white dark:text-[#111827]'
        }`}
      >
        {loading ? '...' : buttonLabel}
      </button>
    </div>
  )
}

const fallbackMostReadStories = Array.from({ length: 6 }, (_, index) => ({
  id: `most-read-${index + 1}`,
  title: 'Most Read Story',
  image: `/assets/New Arrival/New Arrival ${index + 1}.jpg`,
  likes: [18000, 4299, 3494, 2800, 2200, 1900][index],
}))

function normalizeMostReadStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    image:
      story.cover_url ||
      story.landscape_thumbnail_url ||
      `/assets/New Arrival/New Arrival ${Math.min(index + 1, 18)}.jpg`,
    likes: Number(story.total_likes || story.likes || 0),
  }
}

function FireSolidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 22c4.4 0 8-3.1 8-8 0-2.3-.9-4.3-2.4-5.9-.2 2.2-1.5 3.7-3.1 4.4.8-4.5-1.8-8.1-5.5-10.5.2 3.6-1.7 5.2-3.1 6.8C4.6 10.3 4 12 4 14c0 4.9 3.6 8 8 8Z" />
      <path d="M9.2 17.6c0 1.7 1.2 2.9 2.8 2.9s2.8-1.2 2.8-2.9c0-1.1-.5-2-1.4-2.8-.1 1-.7 1.7-1.5 2 .2-1.7-.7-3.1-2.1-4.1.1 1.8-.6 2.7-.6 4.9Z" />
    </svg>
  )
}

function MostReadBookCard({ book, rank, onOpen }) {
  const { t } = useDisplayTranslation()
  const displayTitle =
    book.title === 'Most Read Story'
      ? t('eventPage.mostReadStory')
      : book.title === 'Untitled Story'
        ? t('eventPage.untitledStory')
        : book.title

  const rankBadgeClasses = {
    1: 'bg-[#FF3B30] text-white',
    2: 'bg-[#FF8C00] text-white',
    3: 'bg-[#FFD400] text-[#111827]',
    4: 'bg-[#8A2BE2] text-white',
    5: 'bg-[#A0A7B4] text-white',
    6: 'bg-[#A0A7B4] text-white',
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-[calc((100%_-_24px)/2.5)] shrink-0 bg-transparent p-0 text-left active:scale-[0.98] sm:w-[130px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px] bg-[#202124] shadow-sm">
        <img
  src={book.image}
  alt={displayTitle}
  className="pointer-events-none h-full w-full select-none object-cover"
  loading="lazy"
  decoding="async"
  draggable="false"
  onDragStart={(event) => event.preventDefault()}
  onError={(event) => {
    event.currentTarget.src = '/assets/New Arrival/New Arrival 1.jpg'
  }}
/>

        <div
          className={`absolute right-2 top-0 flex h-[34px] w-[28px] items-center justify-center text-[14px] font-bold shadow-[0_6px_12px_rgba(0,0,0,0.16)] ${rankBadgeClasses[rank] || rankBadgeClasses[6]}`}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' }}
        >
          {rank}
        </div>
      </div>

      <h3 className="mt-2 block w-full overflow-hidden whitespace-nowrap text-ellipsis text-[13px] font-extrabold leading-[19px] text-[var(--shadow-text-primary)]">
        {displayTitle}
      </h3>

      <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-[var(--shadow-text-primary)]">
        <span className="text-[#EF4444]">
          <FireSolidIcon />
        </span>
        <span>{formatCompactNumber(book.likes)}</span>
      </div>
    </button>
  )
}

function MostReadThisWeekSection() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const scrollRef = useRef(null)
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchMostReadStories() {
      try {
        setLoading(true)

        const response = await fetch(
          addStoryLanguageParam(`${API_BASE_URL}/api/public/stories?limit=6&sort=popular`)
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load most read stories')
        }

        if (!ignore) {
          setBooks((data.stories || []).map(normalizeMostReadStory).slice(0, 6))
        }
      } catch {
        if (!ignore) setBooks([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchMostReadStories()

    return () => {
      ignore = true
    }
  }, [])

  const handleMouseDown = (event) => {
    const container = scrollRef.current
    if (!container || window.innerWidth < 768) return

    isDraggingRef.current = true
    dragMovedRef.current = false
    startXRef.current = event.pageX - container.offsetLeft
    scrollLeftRef.current = container.scrollLeft
  }

  const handleMouseMove = (event) => {
    const container = scrollRef.current
    if (!container || !isDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - startXRef.current

    if (Math.abs(walk) > 4) {
      dragMovedRef.current = true
    }

    container.scrollLeft = scrollLeftRef.current - walk * 1.4
  }

  const stopMouseDrag = () => {
    isDraggingRef.current = false
  }

  const handleBookOpen = (bookId) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }

    navigate(`/story/${bookId}`)
  }

  const visibleBooks = books.length ? books : fallbackMostReadStories

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[19px] font-extrabold text-[var(--shadow-text-primary)]">{t('eventPage.mostReadThisWeek')}</h3>

        <button
          type="button"
          onClick={() => navigate('/most-read-this-week')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] active:scale-95"
        >
          <i className="fas fa-chevron-right text-[15px]" />
        </button>
      </div>

      {loading ? (
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[116px] shrink-0 sm:w-[130px]">
              <div className="aspect-[2/3] animate-pulse rounded-[10px] bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-4 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopMouseDrag}
          onMouseLeave={stopMouseDrag}
          className="no-scrollbar mt-4 flex cursor-grab gap-3 overflow-x-auto pb-2 select-none active:cursor-grabbing"
        >
          {visibleBooks.slice(0, 6).map((book, index) => (
            <MostReadBookCard
              key={book.id}
              book={book}
              rank={index + 1}
              onOpen={() => handleBookOpen(book.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}


function SectionHeader({ title, onMore }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <h3 className="text-[19px] font-extrabold text-[var(--shadow-text-primary)]">{title}</h3>
      <button type="button" onClick={onMore} className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] active:scale-95">
        <i className="fas fa-chevron-right text-[15px]" />
      </button>
    </div>
  )
}

function EventSlideBanner() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const swiperRef = useRef(null)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchSlides() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/slides?section_key=${EVENT_SLIDE_SECTION_KEY}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch Event slides')
        }

        if (!ignore) setSlides(data.slides || [])
      } catch {
        if (!ignore) setSlides([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchSlides()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!window.Swiper || slides.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.eventSwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: false,
      slidesPerView: 1,
      spaceBetween: 0,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 2,
        slideShadows: false,
      },
      breakpoints: {
        768: {
          centeredSlides: true,
          slidesPerView: 'auto',
          spaceBetween: 0,
        },
      },
      loop: slides.length > 1,
      speed: 650,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.event-swiper-pagination',
        clickable: true,
      },
    })

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [slides])

  if (loading) {
    return (
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-[var(--shadow-bg-soft)] text-[14px] font-bold text-[var(--shadow-text-secondary)] md:rounded-[20px]">
          {t('eventPage.loadingSlides')}
        </div>
      </div>
    )
  }

  if (!slides.length) {
    return (
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-black text-[20px] font-extrabold text-white/80 md:rounded-[20px]">
          {t('eventPage.noSlidesYet')}
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
      <div className="swiper eventSwiper">
        <div className="swiper-wrapper">
          {slides.map((slide) => {
            const slideBadge = getEventSlideBadge(slide)
            const slideTitle = getEventSlideTitle(slide)
            const slideSubtitle = getEventSlideSubtitle(slide)

            return (
              <div
                key={slide.id}
                className="swiper-slide relative aspect-[16/9] cursor-pointer"
                onClick={() => {
                  if (slide.link_url) navigate(slide.link_url)
                }}
              >
                <img
                  src={slide.image_url}
                  alt={slideTitle || t('eventPage.eventSlide')}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                {(slideBadge || slideTitle || slideSubtitle) ? (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-12">
                    <div className="flex min-w-0 items-center gap-2">
                      {slideBadge ? (
                        <span className={`shrink-0 rounded-[5px] px-2 py-1 text-[8px] font-black uppercase leading-none ${getEventSlideBadgeClass(slideBadge)}`}>
                          {t(`eventPage.${EVENT_BADGE_LABEL_KEYS[slideBadge]}`)}
                        </span>
                      ) : null}

                      {slideTitle ? (
                        <h2 className="min-w-0 truncate text-[16px] font-black leading-tight text-white drop-shadow sm:text-[24px]">
                          {slideTitle}
                        </h2>
                      ) : null}
                    </div>

                    {slideSubtitle ? (
                      <p className="mt-1 truncate text-[10px] font-semibold leading-4 text-white/90 sm:text-[12px]">
                        {slideSubtitle}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
        <div className="event-swiper-pagination swiper-pagination" />
      </div>
    </div>
  )
}

function AuthorCenterBannerSlider() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const swiperRef = useRef(null)
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function fetchBanners() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/slides?section_key=${AUTHOR_CENTER_SECTION_KEY}`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to fetch Author Center banners')
        }

        if (!ignore) setBanners(data.slides || [])
      } catch {
        if (!ignore) setBanners([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchBanners()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!window.Swiper || banners.length === 0) return

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true)
      swiperRef.current = null
    }

    swiperRef.current = new window.Swiper('.authorCenterSwiper', {
  slidesPerView: 1.08,
  spaceBetween: 12,
  centeredSlides: false,
  speed: 650,
  loop: banners.length > 1,
  pagination: {
    el: '.author-center-pagination',
    clickable: true,
  },
})

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true)
        swiperRef.current = null
      }
    }
  }, [banners])

  if (loading) {
    return (
      <div className="mt-4 flex aspect-[3/1] w-full items-center justify-center rounded-[16px] bg-[var(--shadow-bg-soft)] text-[13px] font-bold text-[var(--shadow-text-secondary)]">
        {t('eventPage.loadingBanners')}
      </div>
    )
  }

  if (!banners.length) {
    return (
      <div className="mt-4 flex aspect-[3/1] w-full items-center justify-center rounded-[16px] bg-black text-[14px] font-extrabold text-white/70">
        {t('eventPage.noAuthorCenterBanner')}
      </div>
    )
  }

  return (
    <div className="mt-4 w-full overflow-hidden">
  <div className="swiper authorCenterSwiper !pr-10">
    <div className="swiper-wrapper">
      {banners.map((banner) => {
        const parsedTitle = parseBannerTitle(banner.title)

        return (
          <div
            key={banner.id}
            className="swiper-slide relative aspect-[3/1] cursor-pointer overflow-hidden rounded-[12px] border border-[var(--shadow-border)] bg-black text-white shadow-sm"
                onClick={() => {
                  if (banner.link_url) navigate(banner.link_url)
                }}
              >
                <img
                  src={banner.image_url}
                  alt={parsedTitle.title || t('eventPage.authorCenterBanner')}
                  className="h-full w-full object-cover"
                />

                {(parsedTitle.title || banner.subtitle) ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
                    {parsedTitle.title ? (
                      <div className="flex items-center gap-2">
                        {parsedTitle.badge ? (
                          <span className="rounded-full bg-[#ff3b6b] px-2 py-0.5 text-[8px] font-black uppercase text-white">
                            {t(`eventPage.${EVENT_BADGE_LABEL_KEYS[parsedTitle.badge]}`)}
                          </span>
                        ) : null}

                        <span className="line-clamp-1 text-[12px] font-extrabold">
                          {parsedTitle.title}
                        </span>
                      </div>
                    ) : null}

                    {banner.subtitle ? (
                      <p className="mt-1 line-clamp-1 text-[10px] font-medium text-white/70">
                        {banner.subtitle}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
        <div className="author-center-pagination mt-3 text-center" />
      </div>
    </div>
  )
}

function isBlackSundayLive(value = new Date()) {
  const cambodiaTime = new Date(
    value.getTime() + 7 * 60 * 60 * 1000
  )

  return cambodiaTime.getUTCDay() === 0
}

function ActiveEventPicker({
  events,
  selectedId,
  onSelect,
}) {
  const { t } = useDisplayTranslation()

  if (events.length <= 1) return null

  const activeIndex = Math.max(
    0,
    events.findIndex(
      (event) => event.id === selectedId
    )
  )

  return (
    <div className="mt-4">
      <div className="no-scrollbar -mr-4 flex snap-x gap-3 overflow-x-auto pb-2 pr-4">
        {events.map((event) => {
          const selected =
            event.id === selectedId

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event.id)}
              className={`w-[68%] shrink-0 snap-start overflow-hidden rounded-[18px] border bg-[var(--shadow-bg-surface)] p-3 text-left shadow-sm transition active:scale-[0.98] ${
                selected
                  ? 'border-[#F6B800] ring-2 ring-[#F6B800]/20'
                  : 'border-[var(--shadow-border)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] ${event.iconBg}`}
                >
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <i
                      className={`fa-solid ${event.icon} text-[25px] ${event.iconColor}`}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[9px] font-black uppercase tracking-[0.12em] ${event.labelColor}`}
                  >
                    {event.label}
                  </div>

                  <div className="mt-1 line-clamp-2 text-[15px] font-black leading-5 text-[var(--shadow-text-primary)]">
                    {event.title}
                  </div>

                  <div className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
                    {selected
                      ? t('eventPage.showingNow')
                      : t('eventPage.tapToView')}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {events.length <= 4 ? (
        <div className="mt-2 flex justify-center gap-1.5">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event.id)}
              aria-label={t('eventPage.viewEvent', { title: event.title })}
              className={`h-1.5 rounded-full transition-all ${
                event.id === selectedId
                  ? 'w-5 bg-[#111827] dark:bg-white'
                  : 'w-1.5 bg-[var(--shadow-border-strong)]'
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="mt-2 text-center text-[11px] font-bold text-[var(--shadow-text-secondary)]">
          {activeIndex + 1} / {events.length}
        </div>
      )}
    </div>
  )
}

function getNextWeeklyStart(value, weekday) {
  const offset = 7 * 60 * 60 * 1000
  const now = new Date(value)
  const cambodia = new Date(now.getTime() + offset)
  const days = (weekday - cambodia.getUTCDay() + 7) % 7

  let start = new Date(
    Date.UTC(
      cambodia.getUTCFullYear(),
      cambodia.getUTCMonth(),
      cambodia.getUTCDate() + days
    ) - offset
  )

  if (start.getTime() <= now.getTime()) {
    start = new Date(start.getTime() + 7 * 86400000)
  }

  return start
}

function getUpcomingCountdown(target, now) {
  const totalMinutes = Math.max(
    0,
    Math.floor((target.getTime() - now.getTime()) / 60000)
  )

  return {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  }
}

function formatUpcomingDate(date, language) {
  const locales = {
    km: 'km-KH',
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
  }

  return new Intl.DateTimeFormat(locales[language] || 'en-US', {
    timeZone: 'Asia/Phnom_Penh',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function UpcomingEventsSection({ events, now }) {
  const { t, language } = useDisplayTranslation()

  return (
    <section className="pb-8 pt-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#F1EAFE] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300">
          <i className="fa-regular fa-calendar-days text-[14px]" />
        </span>

        <h2 className="text-[21px] font-black text-[var(--shadow-text-primary)]">
          {t('eventPage.upcoming')}
        </h2>

        <span className="text-[14px] text-[#F6B800]">
          ✦
        </span>
      </div>

      {events.length ? (
        <div className="mt-4 space-y-4">
          {events.map((event) => {
            const countdown = getUpcomingCountdown(
              event.startsAt,
              now
            )

            return (
              <section
                key={event.id}
                className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_26px_rgba(31,24,55,0.08)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[22px] ${event.iconBg}`}
                  >
                    <i
                      className={`fa-solid ${event.icon} text-[30px] ${event.iconColor}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${event.badgeClass}`}
                    >
                      {t('eventPage.nextEvent')}
                    </div>

                    <h3 className="mt-2 text-[18px] font-black text-[var(--shadow-text-primary)]">
                      {event.title}
                    </h3>

                    <div className="mt-2 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                      {formatUpcomingDate(event.startsAt, language)}
                    </div>

                    <div
                      className={`mt-2 text-[12px] font-black ${event.accentClass}`}
                    >
                      {t('eventPage.startsIn', {
                        days: countdown.days,
                        hours: countdown.hours,
                        minutes: countdown.minutes,
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-8 text-center text-[13px] font-bold text-[var(--shadow-text-secondary)]">
          {t('eventPage.noUpcomingEvents')}
        </div>
      )}
    </section>
  )
}

export default function EventPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [activeTab, setActiveTab] = useState('author')
  const [loading, setLoading] = useState(false)
  const [topAuthorsLoading, setTopAuthorsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [topAuthors, setTopAuthors] = useState([])
  const [followLoadingId, setFollowLoadingId] = useState('')
  const [author49Available, setAuthor49Available] =
    useState(() => !getReaderToken())
  const [writerWednesdayLive, setWriterWednesdayLive] =
    useState(false)
  const [eventNow, setEventNow] =
    useState(() => new Date())
  const [selectedActiveEvent, setSelectedActiveEvent] =
    useState('')
  const [managedEvents, setManagedEvents] = useState([])
  const [managedEventsLoading, setManagedEventsLoading] = useState(true)
  const managedEventsFetchedAtRef = useRef(0)
  const topAuthorsScrollRef = useRef(null)
  const topAuthorsDraggingRef = useRef(false)
  const topAuthorsDragMovedRef = useRef(false)
  const topAuthorsStartXRef = useRef(0)
  const topAuthorsScrollLeftRef = useRef(0)

  useEffect(() => {
    let ignore = false

    async function fetchTopAuthors() {
      try {
        setTopAuthorsLoading(true)

        const token = getReaderToken()

const response = await fetch(`${API_BASE_URL}/api/authors/top?limit=6`, {
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
})
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load top authors')
        }

        if (!ignore) {
          setTopAuthors(Array.isArray(data.author_pages) ? data.author_pages : [])
        }
      } catch {
        if (!ignore) setTopAuthors([])
      } finally {
        if (!ignore) setTopAuthorsLoading(false)
      }
    }

    fetchTopAuthors()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'event') return undefined

    if (
      managedEventsFetchedAtRef.current &&
      Date.now() - managedEventsFetchedAtRef.current < 120000
    ) {
      setManagedEventsLoading(false)
      return undefined
    }

    let ignore = false
    const controller = new AbortController()

    async function loadManagedEvents() {
      setManagedEventsLoading(true)

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/events`,
          { signal: controller.signal }
        )

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error('Failed to load events')
        }

        if (!ignore) {
          setManagedEvents(
            Array.isArray(data.events) ? data.events : []
          )
          managedEventsFetchedAtRef.current = Date.now()
        }
      } catch (error) {
        if (error?.name !== 'AbortError' && !ignore) {
          setManagedEvents([])
        }
      } finally {
        if (!ignore) setManagedEventsLoading(false)
      }
    }

    loadManagedEvents()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [activeTab])

  useEffect(() => {
    let ignore = false

    async function loadActiveEventStatus() {
      const token = getReaderToken()

      try {
        const writerResponse = await fetch(
          `${API_BASE_URL}/api/unlocks/events/writer-wednesday`
        )

        const writerData = await writerResponse
          .json()
          .catch(() => ({}))

        if (!ignore) {
          setWriterWednesdayLive(
            Boolean(
              writerResponse.ok &&
              writerData.ok !== false &&
              writerData.event?.active
            )
          )
        }
      } catch {
        if (!ignore) {
          setWriterWednesdayLive(false)
        }
      }

      if (!token) {
        if (!ignore) {
          setAuthor49Available(true)
        }
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/49-day-event`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        const event = data.event

        if (!ignore) {
          setAuthor49Available(
            Boolean(
              response.ok &&
              data.ok !== false &&
              event?.visible &&
              event.status !== 'finished'
            )
          )
        }
      } catch {
        if (!ignore) {
          setAuthor49Available(false)
        }
      }
    }

    loadActiveEventStatus()

    const timer = window.setInterval(() => {
      setEventNow(new Date())
      loadActiveEventStatus()
    }, 60000)

    return () => {
      ignore = true
      window.clearInterval(timer)
    }
  }, [])

  const blackSundayLive =
  isBlackSundayLive(eventNow)

const upcomingEvents = [
  !writerWednesdayLive
    ? {
        id: 'writer-wednesday',
        title: t('eventPage.writerWednesday70'),
        startsAt: getNextWeeklyStart(eventNow, 3),
        icon: 'fa-gem',
        iconBg: 'bg-[#F3EDFF] dark:bg-violet-500/15',
        iconColor: 'text-[#7C3AED]',
        badgeClass: 'bg-[#F1EAFE] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300',
        accentClass: 'text-[#7C3AED]',
      }
    : null,

  !blackSundayLive
    ? {
        id: 'black-sunday',
        title: t('eventPage.blackSunday'),
        startsAt: getNextWeeklyStart(eventNow, 0),
        icon: 'fa-star',
        iconBg: 'bg-[#F5EFFF] dark:bg-violet-500/15',
        iconColor: 'text-[#8B5CF6]',
        badgeClass: 'bg-[#F1EAFE] text-[#7C3AED] dark:bg-violet-500/15 dark:text-violet-300',
        accentClass: 'text-[#7C3AED]',
      }
    : null,
]
  .filter(Boolean)
  .sort(
    (a, b) =>
      a.startsAt.getTime() -
      b.startsAt.getTime()
  )

  const managedActiveEvents = managedEvents.map((item) => ({
  id: `managed:${item.id}`,
  title: item.title || t('eventPage.event'),
  label: item.badge_text || t('eventPage.event'),
  image: item.image_url || '',
  icon: 'fa-calendar-days',
  iconBg: 'bg-[var(--shadow-bg-soft)]',
  iconColor: 'text-[#7C3AED]',
  labelColor: 'text-[#7C3AED]',
}))

const activeEvents = [
    ...managedActiveEvents,
    writerWednesdayLive
      ? {
          id: 'writer-wednesday',
          title: t('eventPage.writerWednesday'),
          label: t('eventPage.weeklyEvent'),
          icon: 'fa-gem',
          iconBg: 'bg-[#F3EDFF] dark:bg-violet-500/15',
          iconColor: 'text-[#7C3AED]',
          labelColor: 'text-[#7C3AED]',
        }
      : null,

    blackSundayLive
      ? {
          id: 'black-sunday',
          title: t('eventPage.blackSunday'),
          label: t('eventPage.weeklyEvent'),
          icon: 'fa-bolt',
          iconBg: 'bg-[#1A1730]',
          iconColor: 'text-[#C084FC]',
          labelColor: 'text-[#7C3AED]',
        }
      : null,

    author49Available
      ? {
          id: 'author-49-day',
          title: t('eventPage.author49Days'),
          label: t('eventPage.authorEvent'),
          image: '/assets/Icons/Event/Event 2.webp',
          iconBg: 'bg-[#FFF5D8] dark:bg-amber-500/15',
          iconColor: 'text-[#E3AB00]',
          labelColor: 'text-[#C99300]',
        }
      : null,
  ].filter(Boolean)

  const selectedManagedEvent =
  managedEvents.find(
    (item) =>
      `managed:${item.id}` === selectedActiveEvent
  ) || null

  const activeEventIds = activeEvents
    .map((event) => event.id)
    .join('|')

  useEffect(() => {
    if (managedEventsLoading) return

    const eventIds = activeEventIds
      ? activeEventIds.split('|')
      : []

    if (!eventIds.length) {
      if (selectedActiveEvent) {
        setSelectedActiveEvent('')
      }
      return
    }

    if (!eventIds.includes(selectedActiveEvent)) {
      setSelectedActiveEvent(eventIds[0])
    }
  }, [
    activeEventIds,
    managedEventsLoading,
    selectedActiveEvent,
  ])

  useEffect(() => {
    if (
      activeTab !== 'event' ||
      managedEventsLoading ||
      !selectedActiveEvent
    ) {
      return undefined
    }

    const eventIds = activeEventIds
      ? activeEventIds.split('|')
      : []

    if (eventIds.length <= 1) return undefined

    const timer = window.setTimeout(() => {
      const index = eventIds.indexOf(selectedActiveEvent)
      const nextIndex =
        index < 0 ? 0 : (index + 1) % eventIds.length

      setSelectedActiveEvent(eventIds[nextIndex])
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [
    activeTab,
    activeEventIds,
    managedEventsLoading,
    selectedActiveEvent,
  ])

  const handleStartYourWork = async () => {
    if (loading) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('eventPage.authorCheckFailed'))
      }

      if (data.has_author_page) {
        navigate('/author/dashboard')
        return
      }

      navigate('/author/create')
    } catch (error) {
      setMessage(error.message || t('eventPage.somethingWrong'))
    } finally {
      setLoading(false)
    }
  }

  const handleShortcut = (label) => {
    if (label === 'Write') {
      handleStartYourWork()
    }
  }

  const handleOpenAuthor = (author) => {
    if (!author?.page_username) return
    navigate(`/author/page/${author.page_username}`)
  }

  const handleTopAuthorsMouseDown = (event) => {
    const container = topAuthorsScrollRef.current
    if (!container || window.innerWidth < 768) return

    topAuthorsDraggingRef.current = true
    topAuthorsDragMovedRef.current = false
    topAuthorsStartXRef.current = event.pageX - container.offsetLeft
    topAuthorsScrollLeftRef.current = container.scrollLeft
  }

  const handleTopAuthorsMouseMove = (event) => {
    const container = topAuthorsScrollRef.current
    if (!container || !topAuthorsDraggingRef.current) return

    event.preventDefault()

    const x = event.pageX - container.offsetLeft
    const walk = x - topAuthorsStartXRef.current

    if (Math.abs(walk) > 4) {
      topAuthorsDragMovedRef.current = true
    }

    container.scrollLeft = topAuthorsScrollLeftRef.current - walk * 1.4
  }

  const stopTopAuthorsMouseDrag = () => {
    topAuthorsDraggingRef.current = false
  }

  const handleOpenTopAuthor = (author) => {
    if (topAuthorsDragMovedRef.current) {
      topAuthorsDragMovedRef.current = false
      return
    }

    handleOpenAuthor(author)
  }

  const handleFollowTopAuthor = async (author) => {
  const token = getReaderToken()

  if (!token) {
    navigate('/login')
    return
  }

  if (!author?.page_username || author?.is_owner || author?.is_following || followLoadingId) return

  try {
    setFollowLoadingId(author.id)

    const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(author.page_username)}/follow`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) return

    setTopAuthors((current) =>
      current.map((item) =>
        item.id === author.id
          ? {
              ...item,
              is_following: true,
              total_followers: Number(data.total_followers ?? item.total_followers ?? 0),
            }
          : item
      )
    )
  } catch {
  } finally {
    setFollowLoadingId('')
  }
}
  
  return (
    <div className="app-page min-h-screen pb-[92px]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .eventSwiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding-top: 0;
          padding-bottom: 0;
        }

        .eventSwiper .swiper-slide {
          width: 100%;
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          transition: all 0.3s ease;
        }

        .eventSwiper .swiper-slide-next,
        .eventSwiper .swiper-slide-prev {
          opacity: 1;
          transform: none;
        }

        .event-swiper-pagination {
          left: auto !important;
          right: 10px !important;
          bottom: 8px !important;
          width: auto !important;
          text-align: right;
        }

        .event-swiper-pagination .swiper-pagination-bullet {
          width: 5px;
          height: 5px;
          margin: 0 2px !important;
          background: rgba(255, 255, 255, 0.65);
          opacity: 1;
        }

        .event-swiper-pagination .swiper-pagination-bullet-active {
          width: 5px;
          background: #ffffff;
          border-radius: 50%;
        }

        @media (min-width: 768px) {
          .eventSwiper {
            padding-top: 10px;
            padding-bottom: 30px;
          }

          .eventSwiper .swiper-slide {
            width: 58%;
            border-radius: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }

          .eventSwiper .swiper-slide-next,
          .eventSwiper .swiper-slide-prev {
            opacity: 0.4;
            transform: scale(0.9);
          }

          .event-swiper-pagination {
            left: 0 !important;
            right: 0 !important;
            bottom: 10px !important;
            width: 100% !important;
            text-align: center;
          }

          .event-swiper-pagination .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            margin: 0 4px !important;
            background: var(--shadow-text-primary);
            opacity: 0.2;
          }

          .event-swiper-pagination .swiper-pagination-bullet-active {
            width: 20px;
            background: var(--shadow-text-primary);
            border-radius: 5px;
            opacity: 1;
          }
        }

        .authorCenterSwiper {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          padding-top: 4px;
          padding-bottom: 26px;
        }

        .author-center-pagination .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          opacity: 1;
          background: var(--shadow-border-strong);
        }

        .author-center-pagination .swiper-pagination-bullet-active {
          background: var(--shadow-text-primary);
          width: 22px;
          border-radius: 999px;
        }

        html.dark .eventSwiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.45);
        }

        html.dark .eventSwiper .swiper-pagination-bullet-active {
          background: #ffffff;
        }

        html.dark .author-center-pagination .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.28);
        }

        html.dark .author-center-pagination .swiper-pagination-bullet-active {
          background: #ffffff;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 text-[var(--shadow-text-primary)]">
        <div className="mx-auto flex max-w-[760px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('eventPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[16px]" />
          </button>
          <h1 className="text-[18px] font-extrabold">{t('eventPage.event')}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-5">
        <section className="flex gap-7 border-b border-[var(--shadow-border)]">
          <button
            type="button"
            onClick={() => setActiveTab('author')}
            className={`relative pb-3 text-[13px] font-extrabold ${
              activeTab === 'author' ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
            }`}
          >
            {t('eventPage.author')}
            {activeTab === 'author' ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#F6B800]" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`relative pb-3 text-[13px] font-extrabold ${
              activeTab === 'event' ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
            }`}
          >
            {t('eventPage.event')}
            {activeTab === 'event' ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#F6B800]" />
            ) : null}
          </button>
          <button
  type="button"
  onClick={() => setActiveTab('vote')}
  className={`relative pb-3 text-[13px] font-extrabold ${
    activeTab === 'vote' ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
  }`}
>
  {t('eventPage.vote')}
  {activeTab === 'vote' ? (
    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#ff3f70]" />
  ) : null}
</button>
        </section>

        {activeTab === 'author' ? (
          <>
            <section className="mt-6">
              <EventSlideBanner />

              <div className="no-scrollbar mt-4 md:mt-2 flex gap-2 overflow-x-auto pb-1">
                {shortcutItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleShortcut(item.label)}
                    disabled={item.label !== 'Write'}
                    className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-extrabold active:scale-95 ${
                      item.type === 'primary'
                        ? 'bg-black text-white dark:bg-white dark:text-[#111827]'
                        : 'border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-tertiary)]'
                    } ${item.label !== 'Write' ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <i className={`fas ${item.icon} text-[10px]`} />
                    {t(`eventPage.${SHORTCUT_LABEL_KEYS[item.label]}`)}
                  </button>
                ))}
              </div>
            </section>

            <section className="py-8 text-center">
              <h2 className="text-[28px] font-extrabold text-[var(--shadow-text-primary)]">{t('eventPage.becomeWriter')}</h2>

              <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-7 text-[var(--shadow-text-secondary)]">
                {t('eventPage.becomeWriterText')}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 text-left">
                {benefitItems.map((item) => {
                  const [titleKey, textKey] = BENEFIT_LABEL_KEYS[item.title]

                  return (
                    <div key={item.title} className="rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                        <i className={`fas ${item.icon} text-[12px]`} />
                      </div>
                      <div className="mt-3 text-[12px] font-extrabold text-[var(--shadow-text-primary)]">{t(`eventPage.${titleKey}`)}</div>
                      <div className="mt-1 text-[10px] leading-4 text-[var(--shadow-text-secondary)]">{t(`eventPage.${textKey}`)}</div>
                    </div>
                  )
                })}
              </div>

              {message ? (
                <div className="mx-auto mt-6 max-w-[520px] rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[13px] font-bold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
                  {message}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleStartYourWork}
                aria-busy={loading}
                className="mx-auto mt-7 flex h-11 w-[78%] max-w-[360px] items-center justify-center rounded-full bg-black text-[16px] font-bold text-white shadow-[0_12px_26px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:bg-[#1b1b1b] active:scale-[0.99] dark:bg-white dark:text-[#111827] dark:hover:bg-white/90"
              >
                {t('eventPage.startYourWork')}
              </button>

              <div className="mt-4 text-[14px] text-[var(--shadow-text-primary)]">
                {t('eventPage.needHelp')}
                <button type="button" onClick={() => navigate('/help')} className="ml-1 text-[#0b5cff]">
                  {t('eventPage.helpCenter')}
                </button>
              </div>
            </section>

            <section className="pb-8">
              <h2 className="text-[19px] font-extrabold text-[var(--shadow-text-primary)]">{t('eventPage.authorCenter')}</h2>

              <AuthorCenterBannerSlider />

              <SectionHeader title={t('eventPage.topAuthorsThisWeek')} onMore={() => navigate('/authors/top')} />

              <p className="mt-2 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('eventPage.topAuthorsHelp')}
              </p>

              {topAuthorsLoading ? (
                <div className="mt-5 flex gap-3 overflow-hidden pb-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="min-w-[132px] rounded-[18px] border border-[#f3df9a] bg-[#fffdf7] px-3 py-4 text-center dark:border-amber-400/20 dark:bg-amber-500/5"
                    >
                      <div className="mx-auto mb-3 h-16 w-16 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                      <div className="mx-auto h-3 w-20 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                      <div className="mx-auto mt-2 h-3 w-16 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                      <div className="mt-3 h-8 animate-pulse rounded-full bg-[var(--shadow-bg-soft)]" />
                    </div>
                  ))}
                </div>
              ) : topAuthors.length ? (
                <div
  ref={topAuthorsScrollRef}
  onMouseDown={handleTopAuthorsMouseDown}
  onMouseMove={handleTopAuthorsMouseMove}
  onMouseUp={stopTopAuthorsMouseDrag}
  onMouseLeave={stopTopAuthorsMouseDrag}
  className="no-scrollbar mt-5 flex cursor-grab gap-3 overflow-x-auto pb-2 select-none active:cursor-grabbing"
>
                  {topAuthors.slice(0, 6).map((author, index) => (
                    <TopAuthorCard
  key={author.id}
  rank={index + 1}
  author={author}
  onOpen={handleOpenTopAuthor}
  onFollow={handleFollowTopAuthor}
  loading={followLoadingId === author.id}
/>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[18px] border border-[#f3df9a] bg-[#fffdf7] px-4 py-6 text-center dark:border-amber-400/20 dark:bg-amber-500/5">
                  <div className="text-[14px] font-black text-[var(--shadow-text-primary)]">{t('eventPage.noTopAuthors')}</div>
                  <p className="mt-2 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                    {t('eventPage.topAuthorsEmpty')}
                  </p>
                </div>
              )}

             
              <MostReadThisWeekSection />
            </section>
          </>
        ) : activeTab === 'vote' ? (
          <MonthlyVoteTab />
        ) : (
  <>
  {selectedManagedEvent ? (
  <ManagedEventHeroCard event={selectedManagedEvent} />
) : null}

{selectedActiveEvent === 'writer-wednesday' ? (
  <WriterWednesdayEventCard />
) : null}

    

  {selectedActiveEvent === 'black-sunday' ? (
  <BlackSundayEventTab mode="active-only" />
) : null}

{selectedActiveEvent === 'author-49-day' ? (
  <Author49DayEventCard
    onStartWriting={handleStartYourWork}
    startWritingLoading={loading}
  />
) : null}

{!managedEventsLoading && activeEvents.length === 0 ? (
  <div className="mt-4 flex aspect-square w-full items-center justify-center rounded-[24px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] text-[14px] font-bold text-[var(--shadow-text-secondary)]">
    {t('eventPage.noEventRightNow')}
  </div>
) : null}

<ActiveEventPicker
  events={activeEvents}
  selectedId={selectedActiveEvent}
  onSelect={setSelectedActiveEvent}
/>

<UpcomingEventsSection
  events={upcomingEvents}
  now={eventNow}
/>
</>
)}
      </main>
    </div>
  )
}
