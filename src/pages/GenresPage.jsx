import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addStoryLanguageParam, getStoryLanguageId } from '../utils/storyLanguage'
import { getHomeCacheKey, loadHomeCache, saveHomeCache } from '../utils/homeDataCache'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('genresPage', {
  en: {
    all: 'All',
    romance: 'Romance',
    fantasy: 'Fantasy',
    action: 'Action',
    adventure: 'Adventure',
    comedy: 'Comedy',
    drama: 'Drama',
    schoolLife: 'School Life',
    historical: 'Historical',
    mystery: 'Mystery',
    horror: 'Horror',
    thriller: 'Thriller',
    sciFi: 'Sci-Fi',
    system: 'System',
    isekai: 'Isekai',
    supernatural: 'Supernatural',
    martialArts: 'Martial Arts',
    revenge: 'Revenge',
    ceo: 'CEO',
    slowBurn: 'Slow Burn',
    enemiesToLovers: 'Enemies to Lovers',
    timeTravel: 'Time Travel',
    strongFemaleLead: 'Strong Female Lead',
    hiddenIdentity: 'Hidden Identity',
    royalty: 'Royalty',
    magic: 'Magic',
    secondChance: 'Second Chance',
    coldMaleLead: 'Cold Male Lead',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
    waitFree: 'Wait Free',
    freeEp: 'Free Ep',
    completed: 'Completed',
    paid: 'Paid',
    premiumEarlyAccess: 'Premium Early Access',
    original: 'Original',
    translated: 'Translated',
    fanContribution: 'Fan Contribution',
    ongoing: 'Ongoing',
    closeFilters: 'Close filters',
    refineStories: 'Refine Stories',
    storyAccess: 'Story Access',
    storyType: 'Story Type',
    progress: 'Progress',
    clear: 'Clear',
    applyFilters: 'Apply Filters',
    untitledStory: 'Untitled Story',
    loadFailed: 'Failed to load stories',
    cannotConnect: 'Cannot connect to server.',
    back: 'Back',
    searchGenres: 'Search genres',
    genres: 'Genres',
    noGenreFound: 'No genre found',
    tryAnotherKeyword: 'Try another keyword.',
    showFewerGenres: 'Show fewer genres',
    showMoreGenres: 'Show more genres',
    filters: 'Filters',
    noStoriesFound: 'No stories found',
    tryAnotherGenreFilter: 'Try another genre or filter.',
  },
  km: {
    all: 'ទាំងអស់',
    romance: 'មនោសញ្ចេតនា',
    fantasy: 'Fantasy',
    action: 'សកម្មភាព',
    adventure: 'ផ្សងព្រេង',
    comedy: 'កំប្លែង',
    drama: 'Drama',
    schoolLife: 'ជីវិតសាលារៀន',
    historical: 'ប្រវត្តិសាស្ត្រ',
    mystery: 'អាថ៌កំបាំង',
    horror: 'រន្ធត់',
    thriller: 'Thriller',
    sciFi: 'វិទ្យាសាស្ត្រប្រឌិត',
    system: 'System',
    isekai: 'Isekai',
    supernatural: 'អរូបី',
    martialArts: 'ក្បាច់គុន',
    revenge: 'សងសឹក',
    ceo: 'CEO',
    slowBurn: 'ស្នេហាយឺតៗ',
    enemiesToLovers: 'ពីសត្រូវទៅជាគូស្នេហ៍',
    timeTravel: 'ឆ្លងពេលវេលា',
    strongFemaleLead: 'តួស្រីខ្លាំង',
    hiddenIdentity: 'អត្តសញ្ញាណលាក់បាំង',
    royalty: 'រាជវង្ស',
    magic: 'វេទមន្ត',
    secondChance: 'ឱកាសទីពីរ',
    coldMaleLead: 'តួប្រុសត្រជាក់',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
    waitFree: 'រង់ចាំអាន Free',
    freeEp: 'ភាគ Free',
    completed: 'បានបញ្ចប់',
    paid: 'បង់ប្រាក់',
    premiumEarlyAccess: 'Premium Early Access',
    original: 'ស្នាដៃដើម',
    translated: 'បកប្រែ',
    fanContribution: 'ស្នាដៃពី Fan',
    ongoing: 'កំពុងបន្ត',
    closeFilters: 'បិទ Filter',
    refineStories: 'កំណត់រឿងឱ្យច្បាស់',
    storyAccess: 'ការចូលអានរឿង',
    storyType: 'ប្រភេទស្នាដៃ',
    progress: 'ស្ថានភាពរឿង',
    clear: 'សម្អាត',
    applyFilters: 'អនុវត្ត Filter',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    loadFailed: 'មិនអាចផ្ទុករឿងបានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។',
    back: 'ត្រឡប់ក្រោយ',
    searchGenres: 'ស្វែងរកប្រភេទរឿង',
    genres: 'ប្រភេទរឿង',
    noGenreFound: 'រកមិនឃើញប្រភេទរឿង',
    tryAnotherKeyword: 'សាកពាក្យស្វែងរកផ្សេងទៀត។',
    showFewerGenres: 'បង្ហាញប្រភេទរឿងតិចជាងនេះ',
    showMoreGenres: 'បង្ហាញប្រភេទរឿងច្រើនទៀត',
    filters: 'Filter',
    noStoriesFound: 'រកមិនឃើញរឿង',
    tryAnotherGenreFilter: 'សាកប្រភេទរឿង ឬ Filter ផ្សេងទៀត។',
  },
  zh: {
    all: '全部',
    romance: '爱情',
    fantasy: '奇幻',
    action: '动作',
    adventure: '冒险',
    comedy: '喜剧',
    drama: '剧情',
    schoolLife: '校园生活',
    historical: '历史',
    mystery: '悬疑',
    horror: '恐怖',
    thriller: '惊悚',
    sciFi: '科幻',
    system: '系统',
    isekai: '异世界',
    supernatural: '超自然',
    martialArts: '武侠',
    revenge: '复仇',
    ceo: 'CEO',
    slowBurn: '慢热',
    enemiesToLovers: '欢喜冤家',
    timeTravel: '时间旅行',
    strongFemaleLead: '强势女主',
    hiddenIdentity: '隐藏身份',
    royalty: '王室',
    magic: '魔法',
    secondChance: '第二次机会',
    coldMaleLead: '高冷男主',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
    waitFree: '等待免费',
    freeEp: '免费章节',
    completed: '已完结',
    paid: '付费',
    premiumEarlyAccess: 'Premium 抢先阅读',
    original: '原创',
    translated: '翻译',
    fanContribution: '粉丝投稿',
    ongoing: '连载中',
    closeFilters: '关闭筛选',
    refineStories: '筛选故事',
    storyAccess: '阅读方式',
    storyType: '故事类型',
    progress: '进度',
    clear: '清除',
    applyFilters: '应用筛选',
    untitledStory: '无标题故事',
    loadFailed: '无法加载故事',
    cannotConnect: '无法连接服务器。',
    back: '返回',
    searchGenres: '搜索类型',
    genres: '类型',
    noGenreFound: '未找到类型',
    tryAnotherKeyword: '请尝试其他关键词。',
    showFewerGenres: '显示更少类型',
    showMoreGenres: '显示更多类型',
    filters: '筛选',
    noStoriesFound: '未找到故事',
    tryAnotherGenreFilter: '请尝试其他类型或筛选条件。',
  },
  ja: {
    all: 'すべて',
    romance: 'ロマンス',
    fantasy: 'ファンタジー',
    action: 'アクション',
    adventure: '冒険',
    comedy: 'コメディ',
    drama: 'ドラマ',
    schoolLife: '学園生活',
    historical: '歴史',
    mystery: 'ミステリー',
    horror: 'ホラー',
    thriller: 'スリラー',
    sciFi: 'SF',
    system: 'システム',
    isekai: '異世界',
    supernatural: '超自然',
    martialArts: '武術',
    revenge: '復讐',
    ceo: 'CEO',
    slowBurn: 'スローバーン',
    enemiesToLovers: '敵から恋人へ',
    timeTravel: 'タイムトラベル',
    strongFemaleLead: '強い女性主人公',
    hiddenIdentity: '隠された正体',
    royalty: '王族',
    magic: '魔法',
    secondChance: 'セカンドチャンス',
    coldMaleLead: 'クールな男性主人公',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
    waitFree: '待てば無料',
    freeEp: '無料エピソード',
    completed: '完結',
    paid: '有料',
    premiumEarlyAccess: 'Premium 先行アクセス',
    original: 'オリジナル',
    translated: '翻訳',
    fanContribution: 'ファン投稿',
    ongoing: '連載中',
    closeFilters: 'フィルターを閉じる',
    refineStories: 'ストーリーを絞り込む',
    storyAccess: '閲覧方法',
    storyType: 'ストーリータイプ',
    progress: '進行状況',
    clear: 'クリア',
    applyFilters: 'フィルターを適用',
    untitledStory: '無題のストーリー',
    loadFailed: 'ストーリーを読み込めませんでした',
    cannotConnect: 'サーバーに接続できません。',
    back: '戻る',
    searchGenres: 'ジャンルを検索',
    genres: 'ジャンル',
    noGenreFound: 'ジャンルが見つかりません',
    tryAnotherKeyword: '別のキーワードをお試しください。',
    showFewerGenres: '表示するジャンルを減らす',
    showMoreGenres: 'ジャンルをもっと表示',
    filters: 'フィルター',
    noStoriesFound: 'ストーリーが見つかりません',
    tryAnotherGenreFilter: '別のジャンルまたはフィルターをお試しください。',
  },
  ko: {
    all: '전체',
    romance: '로맨스',
    fantasy: '판타지',
    action: '액션',
    adventure: '모험',
    comedy: '코미디',
    drama: '드라마',
    schoolLife: '학교생활',
    historical: '역사',
    mystery: '미스터리',
    horror: '호러',
    thriller: '스릴러',
    sciFi: 'SF',
    system: '시스템',
    isekai: '이세계',
    supernatural: '초자연',
    martialArts: '무협',
    revenge: '복수',
    ceo: 'CEO',
    slowBurn: '슬로우 번',
    enemiesToLovers: '적에서 연인으로',
    timeTravel: '시간 여행',
    strongFemaleLead: '강한 여주인공',
    hiddenIdentity: '숨겨진 정체',
    royalty: '왕족',
    magic: '마법',
    secondChance: '두 번째 기회',
    coldMaleLead: '차가운 남주인공',
    bl: 'BL',
    gl: 'GL',
    lgbtq: 'LGBTQ+',
    waitFree: '기다리면 무료',
    freeEp: '무료 에피소드',
    completed: '완결',
    paid: '유료',
    premiumEarlyAccess: 'Premium 선공개',
    original: '오리지널',
    translated: '번역',
    fanContribution: '팬 기여',
    ongoing: '연재 중',
    closeFilters: '필터 닫기',
    refineStories: '스토리 상세 필터',
    storyAccess: '읽기 방식',
    storyType: '스토리 유형',
    progress: '진행 상태',
    clear: '지우기',
    applyFilters: '필터 적용',
    untitledStory: '제목 없는 스토리',
    loadFailed: '스토리를 불러오지 못했습니다',
    cannotConnect: '서버에 연결할 수 없습니다.',
    back: '뒤로 가기',
    searchGenres: '장르 검색',
    genres: '장르',
    noGenreFound: '장르를 찾을 수 없습니다',
    tryAnotherKeyword: '다른 키워드를 사용해 보세요.',
    showFewerGenres: '장르 적게 보기',
    showMoreGenres: '장르 더 보기',
    filters: '필터',
    noStoriesFound: '스토리를 찾을 수 없습니다',
    tryAnotherGenreFilter: '다른 장르나 필터를 사용해 보세요.',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
const GENRES_PAGE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000

const genres = [
  { label: 'All', slug: '' },
  { label: 'Romance', slug: 'romance' },
  { label: 'Fantasy', slug: 'fantasy' },
  { label: 'Action', slug: 'action' },
  { label: 'Adventure', slug: 'adventure' },
  { label: 'Comedy', slug: 'comedy' },
  { label: 'Drama', slug: 'drama' },
  { label: 'School Life', slug: 'school-life' },
  { label: 'Historical', slug: 'historical' },
  { label: 'Mystery', slug: 'mystery' },
  { label: 'Horror', slug: 'horror' },
  { label: 'Thriller', slug: 'thriller' },
  { label: 'Sci-Fi', slug: 'sci-fi' },
  { label: 'System', slug: 'system' },
  { label: 'Isekai', slug: 'isekai' },
  { label: 'Supernatural', slug: 'supernatural' },
  { label: 'Martial Arts', slug: 'martial-arts' },
  { label: 'Revenge', slug: 'revenge' },
  { label: 'CEO', slug: 'ceo' },
  { label: 'Slow Burn', slug: 'slow-burn' },
  { label: 'Enemies to Lovers', slug: 'enemies-to-lovers' },
  { label: 'Time Travel', slug: 'time-travel' },
  { label: 'Strong Female Lead', slug: 'strong-female-lead' },
  { label: 'Hidden Identity', slug: 'hidden-identity' },
  { label: 'Royalty', slug: 'royalty' },
  { label: 'Magic', slug: 'magic' },
  { label: 'Second Chance', slug: 'second-chance' },
  { label: 'Cold Male Lead', slug: 'cold-male-lead' },
  { label: 'BL', slug: 'bl' },
  { label: 'GL', slug: 'gl' },
  { label: 'LGBTQ+', slug: 'lgbtq' },
]

const GENRE_LABEL_KEYS = {
  'All': 'all',
  'Romance': 'romance',
  'Fantasy': 'fantasy',
  'Action': 'action',
  'Adventure': 'adventure',
  'Comedy': 'comedy',
  'Drama': 'drama',
  'School Life': 'schoolLife',
  'Historical': 'historical',
  'Mystery': 'mystery',
  'Horror': 'horror',
  'Thriller': 'thriller',
  'Sci-Fi': 'sciFi',
  'System': 'system',
  'Isekai': 'isekai',
  'Supernatural': 'supernatural',
  'Martial Arts': 'martialArts',
  'Revenge': 'revenge',
  'CEO': 'ceo',
  'Slow Burn': 'slowBurn',
  'Enemies to Lovers': 'enemiesToLovers',
  'Time Travel': 'timeTravel',
  'Strong Female Lead': 'strongFemaleLead',
  'Hidden Identity': 'hiddenIdentity',
  'Royalty': 'royalty',
  'Magic': 'magic',
  'Second Chance': 'secondChance',
  'Cold Male Lead': 'coldMaleLead',
  'BL': 'bl',
  'GL': 'gl',
  'LGBTQ+': 'lgbtq',
}

const quickFilters = [
  { label: 'Wait Free', value: 'wait_free' },
  { label: 'Free Ep', value: 'free' },
  { label: 'Completed', value: 'completed' },
]

const accessFilters = [
  { label: 'All', value: 'all' },
  { label: 'Wait Free', value: 'wait_free' },
  { label: 'Free Ep', value: 'free' },
  { label: 'Paid', value: 'paid' },
  { label: 'Premium Early Access', value: 'premium' },
]

const typeFilters = [
  { label: 'All', value: 'all' },
  { label: 'Original', value: 'original' },
  { label: 'Translated', value: 'translated' },
  { label: 'Fan Contribution', value: 'fan' },
]

const progressFilters = [
  { label: 'All', value: 'all' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
]

const FILTER_LABEL_KEYS = {
  all: 'all',
  wait_free: 'waitFree',
  free: 'freeEp',
  completed: 'completed',
  paid: 'paid',
  premium: 'premiumEarlyAccess',
  original: 'original',
  translated: 'translated',
  fan: 'fanContribution',
  ongoing: 'ongoing',
}

function getFirstDifferentTag(mainGenre, tags = []) {
  const genre = String(mainGenre || '').trim().toLowerCase()
  const normalizedTags = Array.isArray(tags) ? tags : String(tags || '').split(',')

  return (
    normalizedTags
      .map((tag) => String(tag || '').trim())
      .find((tag) => tag && tag.toLowerCase() !== genre) || ''
  )
}

function normalizeBook(story, index = 0) {
  const genre = String(story.main_genre || story.genre || story.category || '').trim()

  return {
    id: story.id || story.story_id,
    title: story.title || 'Untitled Story',
    cover: story.cover_url || story.coverUrl || story.image_url || `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    genre,
    firstTag: getFirstDifferentTag(genre, story.tags),
    status: story.status || story.story_status || '',
    hasFreeEpisode: Boolean(story.has_free_episode),
    hasWaitFreeEpisode: Boolean(story.has_wait_free_episode),
    isCompleted: Boolean(story.is_completed),
    isPremium: Boolean(story.is_subscription || story.subscription_only || story.requires_subscription || story.premium_early_access),
    type: story.story_type || story.type || story.work_type || '',
  }
}

function isCompletedBook(book) {
  return Boolean(book.isCompleted)
}

function isSameGenre(bookGenre, selectedGenre) {
  if (!selectedGenre || selectedGenre === 'All') return true

  return String(bookGenre || '').toLowerCase().replace(/\s+/g, '-') === selectedGenre.toLowerCase().replace(/\s+/g, '-')
}

function isBookMatchedQuickFilter(book, activeQuickFilter) {
  if (!activeQuickFilter) return true
  if (activeQuickFilter === 'completed') return book.isCompleted
  if (activeQuickFilter === 'free') return book.hasFreeEpisode
  if (activeQuickFilter === 'wait_free') return book.hasWaitFreeEpisode

  return true
}

function isBookMatchedAdvancedFilters(book, access, type, progress) {
  if (access === 'wait_free' && !book.hasWaitFreeEpisode) return false
  if (access === 'free' && !book.hasFreeEpisode) return false
  if (access === 'premium' && !book.isPremium) return false
  if (access === 'paid' && (book.hasFreeEpisode || book.hasWaitFreeEpisode)) return false

  if (type !== 'all') {
    const bookType = String(book.type || '').toLowerCase()

    if (type === 'original' && !bookType.includes('original')) return false
    if (type === 'translated' && !bookType.includes('translated')) return false
    if (type === 'fan' && !bookType.includes('fan')) return false
  }

  if (progress === 'completed' && !book.isCompleted) return false
  if (progress === 'ongoing' && book.isCompleted) return false

  return true
}

function getGenreLabel(label, t) {
  const key = GENRE_LABEL_KEYS[label]
  return key ? t(`genresPage.${key}`) : label
}

function getFilterLabel(value, fallbackLabel, t) {
  const key = FILTER_LABEL_KEYS[value]
  return key ? t(`genresPage.${key}`) : fallbackLabel
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2.5 text-[12px] font-medium active:scale-[0.98] ${
  active ? 'bg-[#111827] text-white' : 'bg-white text-[#111827] ring-1 ring-[#e4e7ec]'
}`}
    >
      {children}
    </button>
  )
}

function FilterSheet({
  open,
  onClose,
  access,
  setAccess,
  type,
  setType,
  progress,
  setProgress,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000000]">
      <button
        type="button"
        aria-label={t('genresPage.closeFilters')}
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section className="absolute bottom-0 left-0 right-0 max-h-[calc(100vh-72px)] overflow-hidden rounded-t-[30px] bg-white shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[520px] sm:-translate-x-1/2 sm:rounded-[30px]">
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-5 pb-5 pt-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-black text-[#111827]">
              {t('genresPage.refineStories')}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
              aria-label={t('genresPage.closeFilters')}
            >
              <i className="fa-solid fa-xmark text-[15px]" />
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-[14px] font-bold text-[#8d94a1]">
                {t('genresPage.storyAccess')}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {accessFilters.map((item) => (
                  <FilterChip key={item.value} active={access === item.value} onClick={() => setAccess(item.value)}>
                    {getFilterLabel(item.value, item.label, t)}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-[14px] font-bold text-[#8d94a1]">
                {t('genresPage.storyType')}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {typeFilters.map((item) => (
                  <FilterChip key={item.value} active={type === item.value} onClick={() => setType(item.value)}>
                    {getFilterLabel(item.value, item.label, t)}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-[14px] font-bold text-[#8d94a1]">
                {t('genresPage.progress')}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {progressFilters.map((item) => (
                  <FilterChip key={item.value} active={progress === item.value} onClick={() => setProgress(item.value)}>
                    {getFilterLabel(item.value, item.label, t)}
                  </FilterChip>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-7 grid grid-cols-[0.8fr_1.2fr] gap-3">
            <button
              type="button"
              onClick={() => {
                setAccess('all')
                setType('all')
                setProgress('all')
              }}
              className="h-12 rounded-full bg-[#f5f3fa] text-[13px] font-semibold text-[#111827] active:scale-[0.99]"
            >
              {t('genresPage.clear')}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-full bg-[#111827] text-[13px] font-semibold text-white active:scale-[0.99]"
            >
              {t('genresPage.applyFilters')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function BookCard({ book, onOpen }) {
  const { t } = useDisplayTranslation()
  const title =
    book.title === 'Untitled Story'
      ? t('genresPage.untitledStory')
      : book.title

  return (
    <button
      type="button"
      onClick={() => onOpen(book)}
      className="group block min-w-0 text-left active:scale-[0.99]"
    >
      <div className="overflow-hidden rounded-[8px] bg-[#1e1e22] shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[8px]">
          <img
            src={book.cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.src = '/assets/Update Today/Update Today 1.jpg'
            }}
          />
        </div>
      </div>

      <div className="pt-2.5 sm:pt-3">
        <h3 className="block w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-[640] leading-[20px] text-neutral-900">
          {title}
        </h3>

        <p className="mt-1 min-h-[17px] truncate text-[11.5px] font-normal text-gray-400">
          {[book.genre, book.firstTag].filter(Boolean).join(' / ')}
        </p>
      </div>
    </button>
  )
}

export default function GenresPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [genresExpanded, setGenresExpanded] = useState(false)
  const [activeGenre, setActiveGenre] = useState('All')
  const [activeQuickFilter, setActiveQuickFilter] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [access, setAccess] = useState('all')
  const [type, setType] = useState('all')
  const [progress, setProgress] = useState('all')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (filtersOpen) {
      document.body.classList.add('genres-filter-open')
    } else {
      document.body.classList.remove('genres-filter-open')
    }

    return () => {
      document.body.classList.remove('genres-filter-open')
    }
  }, [filtersOpen])

  useEffect(() => {
  const controller = new AbortController()
  let ignore = false

  async function loadBooks() {
    const cacheKey = getHomeCacheKey({
      section: 'stories',
      language: getStoryLanguageId(),
      params: {
        page: 'genres',
        sort: 'updated',
        limit: 120,
        schema: 1,
      },
    })

    const cached = await loadHomeCache(cacheKey, {
      maxAgeMs: GENRES_PAGE_CACHE_MAX_AGE_MS,
      allowExpired: true,
    })

    if (ignore || controller.signal.aborted) return

    const hasCachedBooks = Array.isArray(cached?.data)

    if (hasCachedBooks) {
      setBooks(cached.data)
      setLoading(false)
    }

    if (cached?.isFresh && hasCachedBooks) {
      return
    }

    try {
      if (!hasCachedBooks) {
        setLoading(true)
      }

      setMessage('')

      const response = await fetch(
        addStoryLanguageParam(
          `${API_BASE_URL}/api/public/stories?limit=120&sort=updated`
        ),
        { signal: controller.signal }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || t('genresPage.loadFailed')
        )
      }

      const nextBooks = (
        Array.isArray(data.stories) ? data.stories : []
      )
        .map(normalizeBook)
        .filter((book) => book.id)

      if (ignore || controller.signal.aborted) return

      setBooks(nextBooks)

      await saveHomeCache(cacheKey, nextBooks, {
        maxAgeMs: GENRES_PAGE_CACHE_MAX_AGE_MS,
      })
    } catch (error) {
      if (error?.name === 'AbortError') return

      if (!ignore && !hasCachedBooks) {
        setBooks([])
        setMessage(
          error.message === 'Failed to fetch'
            ? t('genresPage.cannotConnect')
            : error.message || t('genresPage.loadFailed')
        )
      }
    } finally {
      if (!ignore && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  loadBooks()

  return () => {
    ignore = true
    controller.abort()
  }
}, [])

  const filteredGenres = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return genres

    return genres.filter((genre) => {
      const displayLabel = getGenreLabel(genre.label, t).toLowerCase()

      return (
        genre.label.toLowerCase().includes(keyword) ||
        displayLabel.includes(keyword)
      )
    })
  }, [query])

  const selectedGenreSlug = useMemo(() => {
    return genres.find((genre) => genre.label === activeGenre)?.slug || ''
  }, [activeGenre])

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => isSameGenre(book.genre, selectedGenreSlug))
      .filter((book) => isBookMatchedQuickFilter(book, activeQuickFilter))
      .filter((book) => isBookMatchedAdvancedFilters(book, access, type, progress))
  }, [access, activeQuickFilter, books, progress, selectedGenreSlug, type])

  const openGenre = (genre) => {
    setActiveGenre(genre.label)
  }

  const openBook = (book) => {
    if (book.id) navigate(`/story/${book.id}`)
  }

  return (
    <div className="min-h-screen bg-white pb-[110px]">
      <style>{`
        body.genres-filter-open footer {
          display: none !important;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label={t('genresPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          {searchOpen ? (
            <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f5f3fa] px-4">
              <i className="fa-solid fa-magnifying-glass text-[13px] text-[#8d94a1]" />
              <input
                autoFocus
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setGenresExpanded(true)
                }}
                placeholder={t('genresPage.searchGenres')}
                className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-bold text-[#111827] outline-none placeholder:text-[#8d94a1]"
              />
            </div>
          ) : (
            <h1 className="text-[22px] font-black tracking-tight text-[#111827]">
              {t('genresPage.genres')}
            </h1>
          )}

          <button
            type="button"
            onClick={() => {
              if (searchOpen) {
                setQuery('')
                setGenresExpanded(false)
              }

              setSearchOpen((current) => !current)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label={t('genresPage.searchGenres')}
          >
            <i className={`fa-solid ${searchOpen ? 'fa-xmark' : 'fa-magnifying-glass'} text-[14px]`} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        <section>
          <div className={`relative ${genresExpanded || query ? '' : 'max-h-[128px] overflow-hidden'}`}>
           <div className="flex flex-wrap gap-x-2 gap-y-2">
  {filteredGenres.map((genre) => (
    <button
      key={genre.label}
      type="button"
      onClick={() => openGenre(genre)}
      className={`rounded-full px-3 py-1 text-[12.5px] leading-[18px] active:scale-[0.98] ${
        activeGenre === genre.label
          ? 'bg-[#facc15] font-semibold text-[#111827]'
          : 'bg-white font-medium text-[#111827] ring-1 ring-[#e4e7ec]'
      }`}
    >
      {getGenreLabel(genre.label, t)}
    </button>
  ))}
</div>

            {!genresExpanded && !query ? (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>

          {!filteredGenres.length ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1]">
                <i className="fa-solid fa-layer-group text-[22px]" />
              </div>
              <h3 className="mt-4 text-[16px] font-black text-[#111827]">
                {t('genresPage.noGenreFound')}
              </h3>
              <p className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                {t('genresPage.tryAnotherKeyword')}
              </p>
            </div>
          ) : null}

          {filteredGenres.length && !query ? (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setGenresExpanded((current) => !current)}
                className="flex h-8 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
                aria-label={
                  genresExpanded
                    ? t('genresPage.showFewerGenres')
                    : t('genresPage.showMoreGenres')
                }
              >
                <i className={`fa-solid ${genresExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[12px]`} />
              </button>
            </div>
          ) : null}
        </section>

        <section className="sticky top-[65px] z-30 mt-3 border-y border-[#eef0f4] bg-white/95 py-3 backdrop-blur">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickFilters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveQuickFilter((current) => (current === item.value ? '' : item.value))}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] leading-[18px] active:scale-[0.98] ${
  activeQuickFilter === item.value
    ? 'bg-[#111827] font-semibold text-white'
    : 'bg-[#f5f3fa] font-medium text-[#8d94a1]'
}`}
              >
                {getFilterLabel(item.value, item.label, t)}
              </button>
            ))}

            <span className="mx-1 h-7 w-px shrink-0 bg-[#e4e7ec]" />

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="shrink-0 px-2 py-1 text-[12.5px] font-semibold leading-[18px] text-[#111827] active:scale-[0.98]"
            >
              {t('genresPage.filters')}
              <i className="fa-solid fa-chevron-down ml-2 text-[10px]" />
            </button>
          </div>
        </section>

        <section className="pt-4">
          {loading ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-6 md:gap-x-4 md:gap-y-8">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index}>
                  <div className="aspect-[2/3] animate-pulse rounded-[16px] bg-[#eef0f4]" />
                  <div className="mt-2 h-4 animate-pulse rounded-full bg-[#eef0f4]" />
                  <div className="mt-1 h-4 w-2/3 animate-pulse rounded-full bg-[#eef0f4]" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && message ? (
            <div className="rounded-[20px] bg-[#fff1f1] px-4 py-4 text-center text-[13px] font-black text-[#e5484d]">
              {message}
            </div>
          ) : null}

          {!loading && !message && filteredBooks.length ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-6 md:grid-cols-6 md:gap-x-4 md:gap-y-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onOpen={openBook} />
              ))}
            </div>
          ) : null}

          {!loading && !message && !filteredBooks.length ? (
            <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#8d94a1]">
                <i className="fa-solid fa-book-open text-[22px]" />
              </div>
              <h3 className="mt-4 text-[16px] font-black text-[#111827]">
                {t('genresPage.noStoriesFound')}
              </h3>
              <p className="mt-1 text-[12px] font-semibold text-[#8d94a1]">
                {t('genresPage.tryAnotherGenreFilter')}
              </p>
            </div>
          ) : null}
        </section>
      </main>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        access={access}
        setAccess={setAccess}
        type={type}
        setType={setType}
        progress={progress}
        setProgress={setProgress}
      />
    </div>
  )
}
