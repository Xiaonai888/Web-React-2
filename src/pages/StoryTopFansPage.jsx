import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GiftPopup from '../components/reader/GiftPopup'
import { getDisplayLanguageId, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('storyTopFans', {
  en: {
    topFans: 'TOP FANS',
    howTopFansWorks: 'How Top Fans works',
    becomeSignatureFan: 'Become a Signature Fan',
    signatureFanDescription: 'Send gifts to support the story and appear on the fan board.',
    weeklyRanking: 'Weekly Ranking',
    overallRanking: 'Overall Ranking',
    points: '{{count}} points',
    noWeeklyRanking: 'No weekly ranking yet',
    noOverallRanking: 'No overall ranking yet',
    firstTopFan: 'Send a gift to become this story’s first Top Fan.',
    joinFanBoard: 'Send a gift and join this story’s fan board.',
    gift: 'Gift',
    reader: 'Reader',
    shadowReader: 'Shadow Reader',
  },
  km: {
    topFans: 'អ្នកគាំទ្រកំពូល',
    howTopFansWorks: 'របៀបដំណើរការអ្នកគាំទ្រកំពូល',
    becomeSignatureFan: 'ក្លាយជាអ្នកគាំទ្រពិសេស',
    signatureFanDescription: 'ផ្ញើអំណោយដើម្បីគាំទ្ររឿង និងបង្ហាញនៅលើតារាងអ្នកគាំទ្រ។',
    weeklyRanking: 'ចំណាត់ថ្នាក់ប្រចាំសប្តាហ៍',
    overallRanking: 'ចំណាត់ថ្នាក់សរុប',
    points: '{{count}} ពិន្ទុ',
    noWeeklyRanking: 'មិនទាន់មានចំណាត់ថ្នាក់ប្រចាំសប្តាហ៍ទេ',
    noOverallRanking: 'មិនទាន់មានចំណាត់ថ្នាក់សរុបទេ',
    firstTopFan: 'ផ្ញើអំណោយដើម្បីក្លាយជាអ្នកគាំទ្រកំពូលដំបូងរបស់រឿងនេះ។',
    joinFanBoard: 'ផ្ញើអំណោយ ហើយចូលរួមក្នុងតារាងអ្នកគាំទ្ររបស់រឿងនេះ។',
    gift: 'អំណោយ',
    reader: 'អ្នកអាន',
    shadowReader: 'អ្នកអាន Shadow',
  },
  zh: {
    topFans: '顶级粉丝',
    howTopFansWorks: '顶级粉丝机制说明',
    becomeSignatureFan: '成为特别粉丝',
    signatureFanDescription: '发送礼物支持故事，并出现在粉丝榜上。',
    weeklyRanking: '周榜',
    overallRanking: '总榜',
    points: '{{count}} 积分',
    noWeeklyRanking: '本周暂无排名',
    noOverallRanking: '暂无总排名',
    firstTopFan: '发送礼物，成为这个故事的第一位顶级粉丝。',
    joinFanBoard: '发送礼物并加入这个故事的粉丝榜。',
    gift: '礼物',
    reader: '读者',
    shadowReader: 'Shadow 读者',
  },
  ja: {
    topFans: 'トップファン',
    howTopFansWorks: 'トップファンの仕組み',
    becomeSignatureFan: '特別なファンになる',
    signatureFanDescription: 'ギフトを送って作品を応援し、ファンボードに表示されましょう。',
    weeklyRanking: '週間ランキング',
    overallRanking: '総合ランキング',
    points: '{{count}} ポイント',
    noWeeklyRanking: '週間ランキングはまだありません',
    noOverallRanking: '総合ランキングはまだありません',
    firstTopFan: 'ギフトを送って、この作品の最初のトップファンになりましょう。',
    joinFanBoard: 'ギフトを送って、この作品のファンボードに参加しましょう。',
    gift: 'ギフト',
    reader: '読者',
    shadowReader: 'Shadow 読者',
  },
  ko: {
    topFans: 'TOP 팬',
    howTopFansWorks: 'TOP 팬 작동 방식',
    becomeSignatureFan: '특별 팬 되기',
    signatureFanDescription: '선물을 보내 작품을 응원하고 팬 보드에 이름을 올려보세요.',
    weeklyRanking: '주간 랭킹',
    overallRanking: '전체 랭킹',
    points: '{{count}} 포인트',
    noWeeklyRanking: '아직 주간 랭킹이 없습니다',
    noOverallRanking: '아직 전체 랭킹이 없습니다',
    firstTopFan: '선물을 보내 이 작품의 첫 TOP 팬이 되어보세요.',
    joinFanBoard: '선물을 보내 이 작품의 팬 보드에 참여하세요.',
    gift: '선물',
    reader: '독자',
    shadowReader: 'Shadow 독자',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const NUMBER_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getCurrentReader() {
  try {
    const raw =
      localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') ||
      ''

    if (!raw) {
      return { name: '', avatar_url: '' }
    }

    const user = JSON.parse(raw)

    return {
      name:
        user.name ||
        user.username ||
        user.display_name ||
        user.email?.split('@')[0] ||
        '',
      avatar_url:
        user.avatar_url ||
        user.profile_image ||
        user.photo_url ||
        '',
    }
  } catch {
    return { name: '', avatar_url: '' }
  }
}

function readerAuthHeaders() {
  const token = getReaderToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function formatNumber(value) {
  const languageId = getDisplayLanguageId()
  const locale = NUMBER_LOCALES[languageId] || NUMBER_LOCALES.en
  return Number(value || 0).toLocaleString(locale)
}

function isUsableRouteId(value) {
  const text = String(value ?? '').trim()
  return Boolean(text && text !== 'undefined' && text !== 'null')
}

function formatDateYMD(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getWeeklyDateRange() {
  const today = new Date()
  const daysFromMonday = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(today.getDate() - daysFromMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return `${formatDateYMD(monday)} ~ ${formatDateYMD(sunday)}`
}

function normalizeFan(item, index) {
  const user = item.user || item.reader || item.profile || {}

  return {
    id: item.id || item.user_id || user.id || `fan-${index}`,
    name: user.name || user.username || item.name || item.username || '',
    avatar: user.avatar_url || user.profile_image || item.avatar_url || item.profile_image || '',
    support: Number(item.support || item.points || item.gift_value || item.total || item.score || 0),
  }
}

function getInitial(name) {
  return String(name || 'S').slice(0, 1).toUpperCase()
}

function FanAvatar({ fan, fallbackName, className = 'h-12 w-12', textClassName = 'text-[15px]' }) {
  if (fan.avatar) {
    return <img src={fan.avatar} alt="" className={`${className} rounded-full object-cover`} />
  }

  return (
    <span
      className={`flex ${className} items-center justify-center rounded-full font-bold text-white ${textClassName}`}
      style={{ backgroundColor: fan.color || '#111827' }}
    >
      {getInitial(fan.name || fallbackName)}
    </span>
  )
}

const TOP_FAN_LAYOUT = {
  1: {
    frame: '/assets/Top%20Fan/Top%20Fan%201.png',
    frameWidth: 'clamp(104px, 25vw, 114px)',
    avatarSize: 'clamp(106px, 17vw, 106px)',
    avatarTop: '53%',
    avatarLeft: '50%',
    cardTop: '0px',
  },
  2: {
    frame: '/assets/Top%20Fan/Top%20Fan%202.png',
    frameWidth: 'clamp(88px, 20vw, 98px)',
    avatarSize: 'clamp(84px, 18vw, 90px)',
    avatarTop: '54.5%',
    avatarLeft: '50%',
    cardTop: '18px',
  },
  3: {
    frame: '/assets/Top%20Fan/Top%20Fan%203.png',
    frameWidth: 'clamp(88px, 20vw, 98px)',
    avatarSize: 'clamp(84px, 18vw, 90px)',
    avatarTop: '54.5%',
    avatarLeft: '50%',
    cardTop: '18px',
  },
}

function RankedFanAvatar({ fan, rank, fallbackName }) {
  const layout = TOP_FAN_LAYOUT[rank]
  if (!layout) return null

  return (
    <div
      className="relative mx-auto shrink-0"
      style={{ width: layout.frameWidth, aspectRatio: '907 / 972' }}
    >
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#111827]"
        style={{
          width: layout.avatarSize,
          height: layout.avatarSize,
          top: layout.avatarTop,
          left: layout.avatarLeft,
        }}
      >
        <FanAvatar
          fan={fan}
          fallbackName={fallbackName}
          className="h-full w-full"
          textClassName={rank === 1 ? 'text-[23px]' : 'text-[20px]'}
        />
      </div>

      <img
        src={layout.frame}
        alt=""
        draggable="false"
        className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-contain"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

function TopThree({ fans }) {
  const { t } = useDisplayTranslation()
  const rankedTop = fans.slice(0, 3).map((fan, index) => ({ ...fan, rank: index + 1 }))
  const displayOrder = [rankedTop[1], rankedTop[0], rankedTop[2]]

  return (
    <div className="grid min-h-[170px] grid-cols-3 items-start gap-2 px-2 sm:gap-5 sm:px-8">
      {displayOrder.map((fan, slotIndex) => {
        if (!fan) return <div key={`empty-${slotIndex}`} />

        return (
          <div
            key={fan.id}
            className="min-w-0 text-center"
            style={{ marginTop: TOP_FAN_LAYOUT[fan.rank]?.cardTop || '0px' }}
          >
            <RankedFanAvatar fan={fan} rank={fan.rank} fallbackName={t('storyTopFans.shadowReader')} />
            <div className="mt-0.5 truncate text-[12px] font-bold text-[var(--shadow-text-primary)] sm:text-[13px]">
              {fan.name || t('storyTopFans.shadowReader')}
            </div>
            <div className="mt-0.5 text-[10px] font-normal text-[var(--shadow-text-tertiary)] sm:text-[11px]">
              {t('storyTopFans.points', { count: formatNumber(fan.support) })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FanRow({ fan, index }) {
  const { t } = useDisplayTranslation()
  const rank = index + 1

  return (
    <div className="flex items-center gap-3 px-2 py-3 sm:px-4">
      <div className="w-8 shrink-0 text-center text-[14px] font-normal text-[var(--shadow-text-tertiary)]">
        {rank < 10 ? `0${rank}` : rank}
      </div>

      <FanAvatar
        fan={fan}
        fallbackName={t('storyTopFans.shadowReader')}
        className="h-11 w-11 shrink-0"
        textClassName="text-[14px]"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-normal text-[var(--shadow-text-primary)] sm:text-[15px]">
          {fan.name || t('storyTopFans.shadowReader')}
        </div>
      </div>

      <div className="shrink-0 text-[14px] font-normal text-[var(--shadow-text-secondary)]">
        {formatNumber(fan.support)}
      </div>
    </div>
  )
}

export default function StoryTopFansPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)
  const [rankingRefreshKey, setRankingRefreshKey] = useState(0)
  const currentReader = useMemo(() => getCurrentReader(), [])
  const [story, setStory] = useState(location.state?.storyPreview || null)
  const [activeTab, setActiveTab] = useState('weekly')
  const [weeklyFans, setWeeklyFans] = useState([])
  const [allTimeFans, setAllTimeFans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('shadow_reopen_top_fans_gift_popup') !== '1') return
    sessionStorage.removeItem('shadow_reopen_top_fans_gift_popup')
    setGiftPopupOpen(true)
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      if (!isUsableRouteId(storyId)) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${storyId}`)
        const data = await response.json().catch(() => ({}))
        if (!ignore && data.story) setStory(data.story)
      } catch {
      }
    }

    loadStory()
    return () => {
      ignore = true
    }
  }, [storyId])

  useEffect(() => {
    let ignore = false

    async function loadFans() {
      if (!isUsableRouteId(storyId)) {
        setWeeklyFans([])
        setAllTimeFans([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const [weeklyResponse, allTimeResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/gifts/stories/${storyId}/top-fans?period=weekly`, {
            headers: readerAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/gifts/stories/${storyId}/top-fans?period=all_time`, {
            headers: readerAuthHeaders(),
          }),
        ])

        const weeklyData = await weeklyResponse.json().catch(() => ({}))
        const allTimeData = await allTimeResponse.json().catch(() => ({}))
        if (ignore) return

        const nextWeekly = Array.isArray(weeklyData.fans)
          ? weeklyData.fans
          : Array.isArray(weeklyData.top_fans)
            ? weeklyData.top_fans
            : []

        const nextAllTime = Array.isArray(allTimeData.fans)
          ? allTimeData.fans
          : Array.isArray(allTimeData.top_fans)
            ? allTimeData.top_fans
            : []

        setWeeklyFans(nextWeekly.map(normalizeFan))
        setAllTimeFans(nextAllTime.map(normalizeFan))
      } catch {
        if (!ignore) {
          setWeeklyFans([])
          setAllTimeFans([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadFans()
    return () => {
      ignore = true
    }
  }, [storyId, rankingRefreshKey])

  const fans = useMemo(() => {
    const source = activeTab === 'weekly' ? weeklyFans : allTimeFans
    return source
      .filter(
        (fan) =>
          !String(fan?.id || '').startsWith('demo-') &&
          Number(fan?.support || 0) > 0
      )
      .sort((a, b) => Number(b.support || 0) - Number(a.support || 0))
  }, [activeTab, weeklyFans, allTimeFans])

  const cover = story?.cover_url || story?.thumbnail_url || ''
  const title = story?.title || t('storyTopFans.topFans')
  const weeklyDateRange = useMemo(() => getWeeklyDateRange(), [])
  const readerName = currentReader.name || t('storyTopFans.reader')

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[92px] text-[var(--shadow-text-primary)]">
      <div className="mx-auto min-h-screen w-full max-w-3xl overflow-hidden bg-[var(--shadow-bg-surface)]">
        <div className="relative h-[220px] overflow-hidden bg-[#111827] text-white">
          <div
            className="absolute left-1/2 top-0 h-full w-[124%] -translate-x-1/2 overflow-hidden bg-[#111827]"
            style={{
              borderBottomLeftRadius: '50% 50px',
              borderBottomRightRadius: '50% 50px',
            }}
          >
            {cover ? (
              <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover blur-[1px]" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/50" />
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col px-3 pt-4 sm:px-4 sm:pt-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-8 w-8 items-center justify-center text-white active:scale-95 sm:h-9 sm:w-9"
              >
                <i className="fa-solid fa-chevron-left text-[17px] sm:text-[18px]" />
              </button>

              <h1 className="text-[18px] font-bold tracking-[0.03em] sm:text-[20px]">
                {t('storyTopFans.topFans')}
              </h1>

              <button
                type="button"
                onClick={() =>
                  navigate(`/story/${storyId}/top-fans-guide`, {
                    state: { storyPreview: story },
                  })
                }
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white text-white active:scale-95 sm:h-8 sm:w-8"
                aria-label={t('storyTopFans.howTopFansWorks')}
              >
                <i className="fa-solid fa-question text-[9px] sm:text-[10px]" />
              </button>
            </div>

            <div className="mt-9 px-6 text-center">
              <h2 className="line-clamp-2 text-[20px] font-bold leading-7 text-white sm:text-[22px]">
                {title}
              </h2>

              {activeTab === 'weekly' ? (
                <p className="mt-2 text-[14px] font-normal text-white/85 sm:text-[15px]">
                  {weeklyDateRange}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <section className="bg-[var(--shadow-bg-surface)] px-4 pt-8">
          <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[#ff3b5f] shadow-sm">
                <i className="fa-solid fa-gem text-[22px]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">
                  {t('storyTopFans.becomeSignatureFan')}
                </h3>
                <p className="mt-1 text-[12px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
                  {t('storyTopFans.signatureFanDescription')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 text-center">
            <button
              type="button"
              onClick={() => setActiveTab('weekly')}
              className={`relative pb-4 text-[16px] font-normal active:scale-95 ${
                activeTab === 'weekly'
                  ? 'text-[var(--shadow-text-primary)]'
                  : 'text-[var(--shadow-text-tertiary)]'
              }`}
            >
              {t('storyTopFans.weeklyRanking')}
              {activeTab === 'weekly' ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-[#ff3b5f]" />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all_time')}
              className={`relative pb-4 text-[16px] font-normal active:scale-95 ${
                activeTab === 'all_time'
                  ? 'text-[var(--shadow-text-primary)]'
                  : 'text-[var(--shadow-text-tertiary)]'
              }`}
            >
              {t('storyTopFans.overallRanking')}
              {activeTab === 'all_time' ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-[#ff3b5f]" />
              ) : null}
            </button>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="space-y-3 px-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]"
                  />
                ))}
              </div>
            ) : fans.length > 0 ? (
              <>
                <TopThree fans={fans} />
                {fans.length > 3 ? (
                  <div className="mt-7 rounded-[24px] bg-[var(--shadow-bg-surface)]">
                    {fans.slice(3).map((fan, index) => (
                      <FanRow key={fan.id} fan={fan} index={index + 3} />
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="px-4 py-16 text-center">
                <div className="text-[15px] font-semibold text-[var(--shadow-text-primary)]">
                  {activeTab === 'weekly'
                    ? t('storyTopFans.noWeeklyRanking')
                    : t('storyTopFans.noOverallRanking')}
                </div>
                <div className="mt-2 text-[12px] text-[var(--shadow-text-tertiary)]">
                  {t('storyTopFans.firstTopFan')}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 bg-[var(--shadow-bg-elevated)] px-4 pt-2 shadow-[0_-10px_30px_rgba(17,24,39,0.08)]">
          {currentReader.avatar_url ? (
            <img src={currentReader.avatar_url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[13px] font-bold text-white">
              {readerName.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-[var(--shadow-text-primary)]">
              {readerName}
            </div>
            <div className="mt-0.5 truncate text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
              {t('storyTopFans.joinFanBoard')}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGiftPopupOpen(true)}
            className="h-9 shrink-0 rounded-full bg-[#ff3b5f] px-6 text-[13px] font-bold text-white active:scale-95"
          >
            {t('storyTopFans.gift')}
          </button>
        </div>
      </div>

      <GiftPopup
        open={giftPopupOpen}
        storyId={storyId}
        onClose={() => setGiftPopupOpen(false)}
        onOpenGuide={() => {
          sessionStorage.setItem('shadow_reopen_top_fans_gift_popup', '1')
          setGiftPopupOpen(false)
          navigate('/gift-guide')
        }}
        onOpenTopFans={() => setGiftPopupOpen(false)}
        onGiftSent={() => {
          setGiftPopupOpen(false)
          setRankingRefreshKey((value) => value + 1)
        }}
      />
    </main>
  )
}
