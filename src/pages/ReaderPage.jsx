import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CommentsModal from '../components/story-detail/CommentsModal'
import EchoShareSheet from '../components/reader/EchoShareSheet'
import AdvertisementPopup from '../components/AdvertisementPopup'
import GiftPopup from '../components/reader/GiftPopup'
import useReadingProgressSync from '../hooks/useReadingProgressSync'
import useContinuousEpisodeReader from '../hooks/useContinuousEpisodeReader'


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function readerAuthHeaders() {
  const token = getReaderToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const READING_ACTIVITY_GRACE_MS = 12000
const READING_PROGRESS_STEP_SECONDS = 5

function normalizeReadingMission(mission = null) {
  if (!mission?.id) return null

  const targetMinutes = Math.max(1, Number(mission.target_minutes || 1))
  const targetSeconds = Math.max(
    60,
    Number(mission.target_seconds || targetMinutes * 60)
  )
  const activeSeconds = Math.min(
    targetSeconds,
    Math.max(0, Number(mission.active_seconds || 0))
  )
  const completed =
    Boolean(mission.completed || mission.completed_at) ||
    activeSeconds >= targetSeconds
  const claimed = Boolean(mission.claimed || mission.claimed_at)

  return {
    ...mission,
    is_active: mission.is_active !== false,
    target_minutes: targetMinutes,
    target_seconds: targetSeconds,
    active_seconds: activeSeconds,
    completed,
    claimed,
    claimable: Boolean(mission.claimable) || (completed && !claimed),
    reward_coins: Number(mission.reward_coins || 0),
  }
}

function readingMissionMatchesStory(mission, storyId) {
  const link = String(mission?.story_link || '').trim()
  const cleanStoryId = String(storyId || '').trim()

  if (!cleanStoryId) return false
  if (!link) return true

  return link.includes(cleanStoryId)
}

function pickReadingMission(missions, storyId) {
  const list = Array.isArray(missions)
    ? missions.map(normalizeReadingMission).filter(Boolean)
    : []

  const available = list.filter(
    (mission) => mission.is_active && !mission.claimed
  )

  const specificMission = available.find((mission) => {
    const link = String(mission.story_link || '').trim()

    return link && readingMissionMatchesStory(mission, storyId)
  })

  if (specificMission) {
    return {
      ...specificMission,
      reward_type: 'mission',
      mission_scope: 'specific',
    }
  }

  const anyStoryMission = available.find(
    (mission) => !String(mission.story_link || '').trim()
  )

  if (anyStoryMission) {
    return {
      ...anyStoryMission,
      reward_type: 'mission',
      mission_scope: 'global',
    }
  }

  return null
}

function buildDailyReadingTarget(readingReward = null) {
  if (!readingReward) return null

  const milestones = Array.isArray(readingReward.milestones)
    ? readingReward.milestones
    : []

  const nextIndex = milestones.findIndex(
    (milestone) => !milestone.claimed
  )

  if (nextIndex < 0) return null

  const nextMilestone = milestones[nextIndex]
  const previousMilestoneSeconds =
    nextIndex > 0
      ? Number(milestones[nextIndex - 1]?.seconds || 0)
      : 0

  const milestoneSeconds = Number(nextMilestone.seconds || 0)
  const targetSeconds = Math.max(
    1,
    milestoneSeconds - previousMilestoneSeconds
  )

  const activeSeconds = Math.min(
    targetSeconds,
    Math.max(
      0,
      Number(readingReward.active_seconds || 0) -
        previousMilestoneSeconds
    )
  )

  return {
    id: `daily-${readingReward.reward_date}-${milestoneSeconds}`,
    reward_type: 'daily',
    title: `Read ${nextMilestone.minutes} minutes`,
    reward_coins: Number(nextMilestone.coins || 0),
    target_seconds: targetSeconds,
    active_seconds: activeSeconds,
    completed: Boolean(nextMilestone.completed),
    claimable: Boolean(nextMilestone.claimable),
    claimed: Boolean(nextMilestone.claimed),
    milestone_seconds: milestoneSeconds,
  }
}

function resolveReadingTarget({
  missions,
  readingReward,
  storyId,
}) {
  return (
    pickReadingMission(missions, storyId) ||
    buildDailyReadingTarget(readingReward) ||
    null
  )
}

function isUsableRouteId(value) {
  const text = String(value ?? '').trim()
  return Boolean(text && text !== 'undefined' && text !== 'null')
}

const REVIEW_READ_PROGRESS_PERCENT = 85
const PAGING_LINES_PER_PAGE = 20

const PAGING_CHARACTERS_PER_LINE = {
  compact: 42,
  normal: 39,
  comfort: 36,
}

const READER_THEMES = {
  white: {
    name: 'White',
    page: 'bg-[#FFFFFF]',
    card: 'bg-[#FFFFFF]',
    text: 'text-[#24201b]',
    muted: 'text-[#8a8175]',
    soft: 'bg-[#f3f4f6]',
    border: 'border-[#e5e7eb]',
    button: 'bg-[#111827] text-white',
    ghost: 'bg-white/85 text-[#111827] ring-1 ring-black/5',
    swatch: 'bg-white',
  },
  paper: {
    name: 'Paper',
    page: 'bg-[#efe7d8]',
    card: 'bg-[#fbf3e3]',
    text: 'text-[#2c241d]',
    muted: 'text-[#8a7460]',
    soft: 'bg-[#eadcc8]',
    border: 'border-[#e5d3bb]',
    button: 'bg-[#3b2f25] text-white',
    ghost: 'bg-[#fff8ed] text-[#3b2f25] ring-1 ring-[#dec8ae]',
    swatch: 'bg-[#fbf3e3]',
  },
  sepia: {
    name: 'Sepia',
    page: 'bg-[#e6d7b8]',
    card: 'bg-[#f1e2bf]',
    text: 'text-[#332719]',
    muted: 'text-[#7c6544]',
    soft: 'bg-[#dfcda7]',
    border: 'border-[#d1bc91]',
    button: 'bg-[#3b2f25] text-white',
    ghost: 'bg-[#f8edcf] text-[#3b2f25] ring-1 ring-[#c8b180]',
    swatch: 'bg-[#e5d6ad]',
  },
  dark: {
    name: 'Dark',
    page: 'bg-[#0f172a]',
    card: 'bg-[#111827]',
    text: 'text-[#e5e7eb]',
    muted: 'text-[#9ca3af]',
    soft: 'bg-[#1f2937]',
    border: 'border-[#263244]',
    button: 'bg-white text-[#111827]',
    ghost: 'bg-[#1f2937] text-white ring-1 ring-white/10',
    swatch: 'bg-[#050505]',
  },
}

const FONT_SIZE_LEVELS = [15, 17, 19, 21, 23]
const DEFAULT_FONT_SIZE_INDEX = 1

const FONT_OPTIONS = [
  {
    key: 'noto-sans-khmer',
    label: 'Noto Sans Khmer',
    group: 'Khmer Fonts',
    family: '"Noto Sans Khmer", "Khmer OS Content", system-ui, sans-serif',
  },
  {
    key: 'khmer-os-content',
    label: 'Khmer OS Content',
    group: 'Khmer Fonts',
    family: '"Khmer OS Content", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'khmer-os-battambang',
    label: 'Khmer OS Battambang',
    group: 'Khmer Fonts',
    family: '"Khmer OS Battambang", "Battambang", "Noto Sans Khmer", serif',
  },
  {
    key: 'battambang',
    label: 'Battambang',
    group: 'Khmer Fonts',
    family: '"Battambang", "Khmer OS Battambang", "Noto Sans Khmer", serif',
  },
  {
    key: 'kantumruy-pro',
    label: 'Kantumruy Pro',
    group: 'Khmer Fonts',
    family: '"Kantumruy Pro", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'siemreap',
    label: 'Siemreap',
    group: 'Khmer Fonts',
    family: '"Siemreap", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'hanuman',
    label: 'Hanuman',
    group: 'Khmer Fonts',
    family: '"Hanuman", "Noto Sans Khmer", serif',
  },
  {
    key: 'preahvihear',
    label: 'Preahvihear',
    group: 'Khmer Fonts',
    family: '"Preahvihear", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'content',
    label: 'Content',
    group: 'Khmer Fonts',
    family: '"Content", "Khmer OS Content", "Noto Sans Khmer", serif',
  },
  {
    key: 'metal',
    label: 'Metal',
    group: 'Khmer Fonts',
    family: '"Metal", "Noto Sans Khmer", serif',
  },
  {
    key: 'moulpali',
    label: 'Moulpali',
    group: 'Khmer Fonts',
    family: '"Moulpali", "Noto Sans Khmer", serif',
  },
  {
    key: 'dangrek',
    label: 'Dangrek',
    group: 'Khmer Fonts',
    family: '"Dangrek", "Noto Sans Khmer", system-ui, sans-serif',
  },
  {
    key: 'system',
    label: 'System',
    group: 'Other Fonts',
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    key: 'sans-serif',
    label: 'Sans Serif',
    group: 'Other Fonts',
    family: 'Arial, Helvetica, system-ui, sans-serif',
  },
  {
    key: 'serif',
    label: 'Serif',
    group: 'Other Fonts',
    family: 'Georgia, "Times New Roman", serif',
  },
  {
    key: 'inter',
    label: 'Inter',
    group: 'Other Fonts',
    family: '"Inter", system-ui, sans-serif',
  },
  {
    key: 'roboto',
    label: 'Roboto',
    group: 'Other Fonts',
    family: '"Roboto", Arial, sans-serif',
  },
  {
    key: 'merriweather',
    label: 'Merriweather',
    group: 'Other Fonts',
    family: '"Merriweather", Georgia, serif',
  },
  {
    key: 'lora',
    label: 'Lora',
    group: 'Other Fonts',
    family: '"Lora", Georgia, serif',
  },
  {
    key: 'georgia',
    label: 'Georgia',
    group: 'Other Fonts',
    family: 'Georgia, serif',
  },
]

const LINE_SPACING_OPTIONS = {
  compact: {
    label: 'Compact',
    className: 'leading-[1.85]',
  },
  normal: {
    label: 'Normal',
    className: 'leading-[2.05]',
  },
  comfort: {
    label: 'Comfort',
    className: 'leading-[2.25]',
  },
}

const AUTO_SCROLL_SPEEDS = [
  {
    label: 'Very slow',
    value: 0.35,
  },
  {
    label: 'Slow',
    value: 0.55,
  },
  {
    label: 'Normal',
    value: 0.8,
  },
  {
    label: 'Fast',
    value: 1.1,
  },
  {
    label: 'Very fast',
    value: 1.45,
  },
]

function formatDate(value) {


  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB')
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number) || number <= 0) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(/\.0$/, '')}m`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`

  return String(number)
}

function formatUnlockDateTime(value) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatWaitSeconds(value) {
  const total = Math.max(0, Number(value || 0))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)

  if (days > 0) return `${days} days ${hours} hours`
  if (hours > 0) return `${hours} hours ${minutes} minutes`
  return `${minutes} minutes`
}

function splitParagraphs(content) {
  const text = String(content || '').trim()

  if (!text) return []

  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((item) => item.trim())
    .filter(Boolean)

  return paragraphs.length ? paragraphs : [text]
}

function getPagingKey(storyId, episodeId) {
  return `shadow_reader_page_${storyId}_${episodeId}`
}

function getTextSegments(text) {
  const value = String(text || '')

  if (!value) return []

  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segmenter = new Intl.Segmenter('km', { granularity: 'word' })
      return Array.from(segmenter.segment(value), (item) => item.segment).filter(Boolean)
    } catch {
    }
  }

  return value.match(/\s+|[^\s]+/gu) || []
}

function getSegmentLength(value) {
  return Array.from(String(value || '')).length
}

function createPagingPages(content, lineSpacing, fontSizePx) {
  const paragraphs = splitParagraphs(content)
  const baseCharactersPerLine = PAGING_CHARACTERS_PER_LINE[lineSpacing] || PAGING_CHARACTERS_PER_LINE.comfort
  const charactersPerLine = Math.max(18, Math.floor((baseCharactersPerLine * 17) / Math.max(15, Number(fontSizePx || 17))))
  const pages = []
  let currentPage = []
  let currentLine = ''

  const pushPage = () => {
    if (!currentPage.length) return
    pages.push(currentPage)
    currentPage = []
  }

  const pushLine = () => {
    currentPage.push(currentLine.trimEnd())
    currentLine = ''

    if (currentPage.length >= PAGING_LINES_PER_PAGE) {
      pushPage()
    }
  }

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const segments = getTextSegments(paragraph)

    segments.forEach((segment) => {
      const isSpace = /^\s+$/u.test(segment)
      const nextSegment = isSpace ? ' ' : segment
      const nextLine = currentLine ? `${currentLine}${nextSegment}` : nextSegment.trimStart()

      if (!currentLine) {
        currentLine = nextLine
        return
      }

      if (getSegmentLength(nextLine) > charactersPerLine) {
        pushLine()
        currentLine = nextSegment.trimStart()
        return
      }

      currentLine = nextLine
    })

    if (currentLine) pushLine()

    if (paragraphIndex < paragraphs.length - 1) {
      currentPage.push('')
      if (currentPage.length >= PAGING_LINES_PER_PAGE) pushPage()
    }
  })

  if (currentLine) pushLine()
  if (currentPage.length) pushPage()

  return pages.length ? pages : [[]]
}

function getReviewReadKey(storyId) {
  return `shadow_review_read_episodes_${storyId}`
}

function getReviewReadEpisodes(storyId) {
  if (!storyId) return []

  try {
    const parsed = JSON.parse(localStorage.getItem(getReviewReadKey(storyId)) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function normalizePagingParagraphs(lines) {
  const paragraphs = []
  let current = ''

  ;(lines || []).forEach((line) => {
    const value = String(line || '').trim()

    if (!value) {
      if (current.trim()) {
        paragraphs.push(current.trim())
        current = ''
      }
      return
    }

    current = current ? `${current} ${value}` : value
  })

  if (current.trim()) paragraphs.push(current.trim())

  return paragraphs
}

function saveReviewReadEpisode(storyId, episodeId) {
  if (!storyId || !episodeId) return

  const current = getReviewReadEpisodes(storyId)
  const exists = current.some((id) => String(id) === String(episodeId))

  if (exists) return

  localStorage.setItem(getReviewReadKey(storyId), JSON.stringify([...current, episodeId]))
}

function getInitialFontSizeIndex() {
  const savedIndex = Number(localStorage.getItem('reader_font_size_index'))

  if (Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < FONT_SIZE_LEVELS.length) {
    return savedIndex
  }

  const oldValue = localStorage.getItem('reader_font_size')

  if (oldValue === 'small') return 0
  if (oldValue === 'large') return 2

  return DEFAULT_FONT_SIZE_INDEX
}

function ReadingText({ content, fontSizePx, fontFamily, lineSpacing, theme }) {
  const paragraphs = useMemo(() => splitParagraphs(content), [content])
  const lineHeightClass = LINE_SPACING_OPTIONS[lineSpacing]?.className || LINE_SPACING_OPTIONS.comfort.className

  if (!paragraphs.length) {
    return (
      <p className={`text-[15px] font-semibold leading-8 ${theme.muted}`}>
        No episode content found.
      </p>
    )
  }

  return (
    <div className={lineSpacing === 'compact' ? 'space-y-5' : lineSpacing === 'normal' ? 'space-y-6' : 'space-y-7'}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph.slice(0, 20)}-${index}`}
          className={`${theme.text} ${lineHeightClass} whitespace-pre-line tracking-[0.003em] [overflow-wrap:normal] [word-break:normal]`}
          style={{
            fontFamily,
            fontSize: `${fontSizePx}px`,
          }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function PagingReadingText({ pages, pageIndex, setPageIndex, fontSizePx, fontFamily, lineSpacing, theme, onReadingActivity }) {
  const [flashDirection, setFlashDirection] = useState('')
  const flashTimerRef = useRef(null)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const lineHeightClass = LINE_SPACING_OPTIONS[lineSpacing]?.className || LINE_SPACING_OPTIONS.comfort.className
  const totalPages = Math.max(1, pages.length)
  const safePageIndex = Math.min(Math.max(0, pageIndex), totalPages - 1)
  const currentPage = pages[safePageIndex] || []
  const currentParagraphs = normalizePagingParagraphs(currentPage)
  const canGoPrevious = safePageIndex > 0
  const canGoNext = safePageIndex < totalPages - 1
  const pointerStartXRef = useRef(0)
  const pointerEndXRef = useRef(0)

  const showFlash = (direction) => {
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current)
    setFlashDirection(direction)
    flashTimerRef.current = window.setTimeout(() => setFlashDirection(''), 260)
  }

  const goPrevious = () => {
    if (!canGoPrevious) return
    onReadingActivity?.()
    showFlash('left')
    setPageIndex((current) => Math.max(0, current - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePointerStart = (event) => {
  pointerStartXRef.current = event.clientX || event.touches?.[0]?.clientX || 0
  pointerEndXRef.current = pointerStartXRef.current
}

const handlePointerMove = (event) => {
  pointerEndXRef.current = event.clientX || event.touches?.[0]?.clientX || pointerEndXRef.current
}

const handlePointerEnd = () => {
  const distance = pointerEndXRef.current - pointerStartXRef.current

  if (Math.abs(distance) > 55) {
    if (distance < 0) {
      goNext()
    } else {
      goPrevious()
    }
  }

  pointerStartXRef.current = 0
  pointerEndXRef.current = 0
}

  const goNext = () => {
    if (!canGoNext) return
    onReadingActivity?.()
    showFlash('right')
    setPageIndex((current) => Math.min(totalPages - 1, current + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTap = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left

    if (x < rect.width * 0.42) {
      goPrevious()
      return
    }

    if (x > rect.width * 0.58) {
      goNext()
    }
  }

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches?.[0]?.clientX || 0
    touchStartYRef.current = event.touches?.[0]?.clientY || 0
  }

  const handleTouchEnd = (event) => {
    const endX = event.changedTouches?.[0]?.clientX || 0
    const endY = event.changedTouches?.[0]?.clientY || 0
    const diffX = endX - touchStartXRef.current
    const diffY = endY - touchStartYRef.current

    if (Math.abs(diffX) < 45 || Math.abs(diffX) < Math.abs(diffY) * 1.25) return

    if (diffX < 0) goNext()
    if (diffX > 0) goPrevious()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <span className={`${theme.soft} ${theme.muted} rounded-full px-4 py-2 text-[12px] font-black`}>
          Page {safePageIndex + 1} / {totalPages}
        </span>
      </div>

      <div
  className="relative min-h-[68vh] select-none"
  onMouseDown={handlePointerStart}
  onMouseMove={handlePointerMove}
  onMouseUp={handlePointerEnd}
  onTouchStart={handlePointerStart}
  onTouchMove={handlePointerMove}
  onTouchEnd={handlePointerEnd}
>
        {flashDirection ? (
          <div
            className={`pointer-events-none absolute bottom-0 top-0 z-20 flex w-[34%] items-center justify-center bg-white/45 backdrop-blur-[1px] transition-opacity duration-300 ${
              flashDirection === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <i className={`fa-solid ${flashDirection === 'left' ? 'fa-chevron-left' : 'fa-chevron-right'} text-[28px] ${theme.muted}`} />
          </div>
        ) : null}

        <div className="relative z-0">
         {currentParagraphs.map((paragraph, index) => (
  <p
    key={`${safePageIndex}-${index}-${paragraph.slice(0, 16)}`}
    className={`${theme.text} ${lineHeightClass} whitespace-pre-wrap tracking-[0.003em] [overflow-wrap:normal] [word-break:normal]`}
    style={{
      fontFamily,
      fontSize: `${fontSizePx}px`,
      lineBreak: 'auto',
    }}
  >
    {paragraph}
  </p>
))}
        </div>
      </div>
    </div>
  )
}

function HeartLineIcon({ className = '', filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden="true"
    >
      <path
        d="M12 20.2C8.2 16.9 5.4 14.4 4.3 12.2 3.2 10 3.8 7.3 6.1 6.2 8 5.3 10.1 5.9 12 8c1.9-2.1 4-2.7 5.9-1.8 2.3 1.1 2.9 3.8 1.8 6-1.1 2.2-3.9 4.7-7.7 8Z"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GiftLineIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4.8 10h14.4v10H4.8V10Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M3.8 7.2h16.4V10H3.8V7.2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 7.2V20" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M12 7.2H9.3c-1.8 0-2.9-.7-2.9-1.9 0-1 .8-1.8 1.9-1.8 1.5 0 2.6 1.2 3.7 3.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.2h2.7c1.8 0 2.9-.7 2.9-1.9 0-1-.8-1.8-1.9-1.8-1.5 0-2.6 1.2-3.7 3.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReaderEndPanel({ story, episode, onOpenComments, onOpenGift }) {
  const navigate = useNavigate()
  const episodeId = episode?.id || episode?.episode_id || ''

  const initialLikeCount = Number(
    episode?.total_likes ||
    episode?.like_count ||
    episode?.likes_count ||
    0
  )

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [likeBusy, setLikeBusy] = useState(false)
  const [hotComment, setHotComment] = useState(null)
  const [hotCommentTotal, setHotCommentTotal] = useState(0)

  const giftCount = Number(
    story?.total_gifts ||
    story?.gift_count ||
    story?.gifts_count ||
    episode?.total_gifts ||
    episode?.gift_count ||
    episode?.gifts_count ||
    0
  )

  const fallbackCommentCount = Number(
    episode?.total_comments ||
    episode?.comment_count ||
    episode?.comments_count ||
    0
  )

  useEffect(() => {
  let ignore = false

  setLiked(false)
  setLikeCount(initialLikeCount)

  async function loadLikeStatus() {
    if (!episodeId) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reactions/episode/${episodeId}/status`,
        {
          headers: readerAuthHeaders(),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false || ignore) return

      setLiked(Boolean(data.liked))
      setLikeCount(Math.max(0, Number(data.total_likes || 0)))
    } catch {
    }
  }

  loadLikeStatus()

  return () => {
    ignore = true
  }
}, [episodeId, initialLikeCount])

async function handleToggleLike() {
  if (!episodeId || likeBusy) return

  if (!getReaderToken()) {
    navigate('/login', {
      state: {
        returnTo: window.location.pathname,
      },
    })
    return
  }

  const previousLiked = liked
  const previousCount = likeCount
  const nextLiked = !previousLiked

  setLikeBusy(true)
  setLiked(nextLiked)
  setLikeCount(
    Math.max(0, previousCount + (nextLiked ? 1 : -1))
  )

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reactions/episode/${episodeId}/toggle`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reaction_type: 'love',
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to update like')
    }

    setLiked(Boolean(data.liked))
    setLikeCount(Math.max(0, Number(data.total_likes || 0)))
  } catch {
    setLiked(previousLiked)
    setLikeCount(previousCount)
  } finally {
    setLikeBusy(false)
  }
}

  useEffect(() => {
    let ignore = false

    async function loadHotComment() {
      if (!episodeId) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/comments/episode/${episodeId}?page=1&limit=20&sort=top`, {
          headers: readerAuthHeaders(),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false || ignore) return

        const comments = Array.isArray(data.comments) ? data.comments : []
        const sorted = [...comments].sort((first, second) => {
          const firstReplies = Array.isArray(first.replies) ? first.replies.length : 0
          const secondReplies = Array.isArray(second.replies) ? second.replies.length : 0
          const firstLikes = Number(first.likes || first.like_count || 0)
          const secondLikes = Number(second.likes || second.like_count || 0)

          return secondReplies - firstReplies || secondLikes - firstLikes
        })

        setHotComment(sorted[0] || null)
        setHotCommentTotal(Number(data.total || comments.length || 0))
      } catch {
        if (!ignore) {
          setHotComment(null)
          setHotCommentTotal(fallbackCommentCount)
        }
      }
    }

    loadHotComment()

    return () => {
      ignore = true
    }
  }, [episodeId, fallbackCommentCount])

  const commentCount = hotCommentTotal || fallbackCommentCount
  const replies = Array.isArray(hotComment?.replies) ? hotComment.replies : []
  const replyCount = replies.length
  const hotLikes = Number(hotComment?.likes || hotComment?.like_count || 0)
  const hotUser = hotComment?.user || {}
  const hotName = hotUser.name || hotComment?.name || 'Reader'
  const hotAvatar = hotUser.avatar_url || hotComment?.avatar_url || ''

  return (
    <section className="mt-8 bg-white px-4 pb-8 pt-2">
      <div className="grid grid-cols-2 border-b border-[#eef1f5] pb-5">
       <button
  type="button"
  onClick={handleToggleLike}
  disabled={likeBusy || !episodeId}
  aria-pressed={liked}
  className="flex flex-col items-center justify-center gap-1 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
>
  <HeartLineIcon
    filled={liked}
    className={`h-[26px] w-[26px] transition-all duration-200 ${
      liked
        ? 'scale-110 text-[#E5484D]'
        : 'text-[#111827]'
    }`}
  />

  <span
    className={`text-[13px] font-normal transition-colors duration-200 ${
      liked ? 'text-[#E5484D]' : 'text-[#111827]'
    }`}
  >
    Like
  </span>

  <span
    className={`text-[11px] font-normal transition-colors duration-200 ${
      liked ? 'text-[#E5484D]' : 'text-[#98a2b3]'
    }`}
  >
    {formatCompactNumber(likeCount)}
  </span>
</button>

        <button
          type="button"
          onClick={onOpenGift}
          className="flex flex-col items-center justify-center gap-1 active:scale-95"
        >
       <img src="/assets/Icons/Gift%203.svg" alt="" className="h-[26px] w-[26px] object-contain" />
          <span className="text-[13px] font-normal text-[#111827]">Gift</span>
          <span className="text-[11px] font-normal text-[#98a2b3]">
            {formatCompactNumber(giftCount)}
          </span>
        </button>
      </div>

      <div className="pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#111827]">Hot comments</h3>

          <button
            type="button"
            onClick={onOpenComments}
            className="flex items-center gap-1 text-[13px] font-normal text-[#98a2b3] active:scale-95"
          >
            <span>
              {`View ${formatCompactNumber(commentCount)} ${commentCount === 1 ? 'comment' : 'comments'}`}
            </span>
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </button>
        </div>

        {hotComment ? (
          <button
            type="button"
            onClick={onOpenComments}
            className="mb-4 flex w-full gap-3 text-left active:scale-[0.995]"
          >
            {hotAvatar ? (
              <img
                src={hotAvatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[13px] font-bold text-white">
                {hotName.slice(0, 1).toUpperCase()}
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-[#98a2b3]">
                {hotName}
              </span>

              <span className="mt-1 line-clamp-3 block whitespace-pre-wrap break-words text-[14px] font-normal leading-6 text-[#111827]">
                {hotComment.text}
              </span>

              <span className="mt-2 flex items-center gap-5 text-[12px] font-normal text-[#98a2b3]">
                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-comment text-[13px]" />
                  {formatCompactNumber(replyCount)}
                </span>

                <span className="flex items-center gap-1">
                  <i className="fa-regular fa-thumbs-up text-[13px]" />
                  {formatCompactNumber(hotLikes)}
                </span>
              </span>
            </span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={onOpenComments}
          className="flex w-full items-center gap-3 rounded-full border border-[#eef1f5] bg-white px-4 py-3 text-left active:scale-[0.995]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
            <i className="fa-regular fa-comment text-[15px]" />
          </span>

          <span className="min-w-0 flex-1 text-[13px] font-normal text-[#98a2b3]">
            Write a comment
          </span>
        </button>
      </div>
    </section>
  )
}

function LockedEpisodeCard({
  story,
  episode,
  wallet,
  coinAccess,
  voucherAccess,
  packageOptions,
  autoUnlock,
  setAutoUnlock,
  unlocking,
  onPurchase,
  onUnlock,
  onCoinUnlock,
  onVoucherUnlock,
  inline = false,
}) {
  const diamondBalance = Number(wallet?.diamond_balance || 0)
  const [showAutoHint, setShowAutoHint] = useState(false)
  const [activeTab, setActiveTab] = useState('instant')
  const [freeAccessView, setFreeAccessView] = useState('wallet')
  const backgroundImage = episode?.cover_url || story?.cover_url || ''
  const coinBalance = Number(wallet?.coin_balance ?? wallet?.gem_balance ?? 0)
  const voucherBalance = Number(wallet?.voucher_balance || 0)
  const coinRequired = Number(coinAccess?.amount || 0)
  const voucherRequired = Number(voucherAccess?.amount || 0)
  const coinCanAccess = Boolean(coinAccess?.available) && (coinRequired <= 0 || coinBalance >= coinRequired)
  const voucherCanAccess = Boolean(voucherAccess?.available) && (voucherRequired <= 0 || voucherBalance >= voucherRequired)

  const singleOption =
    packageOptions.find((option) => option.key === 'single') || {
      key: 'single',
      label: '1 Episode',
      price: 10,
      requested_count: 1,
      enabled: true,
    }

  const multiPackagePriority = ['all_released', 'next50', 'next30', 'next10']
  const bestMultiOption = multiPackagePriority
    .map((key) => packageOptions.find((option) => option.key === key && option.enabled))
    .find(Boolean)

  const displayMultiOption =
    bestMultiOption || {
      key: 'next10',
      label: 'Next 10 Eps',
      price: 90,
      original_price: 100,
      discount_percent: 10,
      requested_count: 10,
      enabled: true,
    }

  const goPurchase = () => {
    onPurchase?.()
  }

  const handlePackageClick = (option) => {
    if (!option || unlocking || !option.enabled) return

    const price = Number(option.price || 0)
    const requestedCount = Number(option.requested_count || 0)
    const isMultiPackage =
      requestedCount >= 10 ||
      ['next10', 'next30', 'next50', 'all_released'].includes(option.key)

    if (isMultiPackage && diamondBalance < price) {
      goPurchase()
      return
    }

    onUnlock(option.key)
  }

  const AccessTab = ({ active, children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-11 flex-1 text-[13px] font-semibold transition ${
        active ? 'text-[#111827]' : 'text-[#A7ADBA]'
      }`}
    >
      {children}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-[2px] w-[76%] -translate-x-1/2 rounded-full bg-[#D6A300]" />
      ) : null}
    </button>
  )

  const PremiumRow = () => (
    <button
      type="button"
      onClick={goPurchase}
      className="flex min-h-[54px] w-full items-center gap-3 border-b border-[#E5E7EB] bg-white px-4 text-left active:scale-[0.995]"
    >
      <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-tl-[11px] rounded-br-[11px] bg-[#111827] px-2.5 text-[11px] font-black italic text-white shadow-sm">
        <img
          src="/assets/Icons/Crown.svg"
          alt=""
          className="h-3.5 w-3.5 object-contain"
          loading="lazy"
          decoding="async"
        />
        Premium
      </span>

      <span className="min-w-0 flex-1 text-[12px] font-semibold leading-4 text-[#8D94A1]">
        Enjoy 10% off every episode you unlock.
      </span>

      <i className="fa-solid fa-chevron-right text-[12px] text-[#9CA3AF]" />
    </button>
  )

  const FreeAccessOption = ({ icon, title, subtitle, buttonText, disabled, onClick }) => (
    <div className="flex min-h-[72px] items-center gap-3 rounded-[16px] border border-[#E5E7EB] bg-white px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">
  {icon}
</span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-[#111827]">{title}</span>
        <span className="mt-0.5 block text-[11px] font-semibold leading-4 text-[#667085]">{subtitle}</span>
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[11px] font-black text-white disabled:bg-[#D1D5DB] disabled:text-white"
      >
        {buttonText}
      </button>
    </div>
  )

  const PackageButton = ({ option, primary = false }) => {
    if (!option) return null

    const price = Number(option.price || 0)
    const originalPrice = Number(option.original_price || 0)
    const discount = Number(option.discount_percent || 0)
    const requestedCount = Number(option.requested_count || 0)
    const isMultiPackage =
      requestedCount >= 10 ||
      ['next10', 'next30', 'next50', 'all_released'].includes(option.key)
    const needsTopUp = isMultiPackage && diamondBalance < price

    if (primary) {
      return (
        <button
          type="button"
          onClick={goPurchase}
          disabled={unlocking || !option.enabled}
          className="flex min-h-[78px] w-full items-center justify-center bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
        >
          <span className="flex items-center justify-center gap-2 text-[16px] font-medium text-[#4B5563]">
            <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
            <span className="font-semibold text-[#111827]">{formatNumber(price)}</span>
            <span>to unlock this Ep.</span>
          </span>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => handlePackageClick(option)}
        disabled={unlocking || !option.enabled}
        className="relative flex min-h-[86px] w-full items-center justify-center overflow-hidden border-t border-[#E5E7EB] bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
      >
        {discount > 0 ? (
          <span className="absolute right-[42px] top-[12px] rounded-tl-[14px] rounded-br-[14px] bg-[#FF4D6D] px-4 py-1.5 text-[11px] font-black leading-none text-white">
            {discount}% OFF
          </span>
        ) : null}

        <span className="flex items-center justify-center gap-1.5 text-[16px] font-medium text-[#4B5563]">
          <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
          <span className="text-[#111827]">{formatNumber(price)}</span>
          {originalPrice > price ? (
            <span className="ml-1 text-[12px] text-[#A0A6B0] line-through">
              {formatNumber(originalPrice)}
            </span>
          ) : null}
          <span>to unlock {requestedCount || 'all'} Eps.</span>
        </span>
      </button>
    )
  }

  return (
    <div
      className={
        inline
          ? 'relative min-h-[680px] overflow-hidden bg-[#111827]'
          : 'fixed inset-x-0 bottom-0 top-[64px] z-[40] overflow-hidden px-0 pb-0'
      }
    >
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[1px]"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />

      <div
        className={
          inline
            ? 'relative z-10 flex min-h-[680px] items-end justify-center'
            : 'relative z-10 flex h-full items-end justify-center md:items-center'
        }
      >
        <div className="w-full pb-[env(safe-area-inset-bottom)] md:max-w-[520px] md:pb-0">
          <button
            type="button"
            onClick={goPurchase}
            className="relative mx-auto mb-5 flex h-[56px] w-[calc(100%-24px)] items-center overflow-visible rounded-[16px] bg-gradient-to-r from-[#343842]/70 via-[#565C68]/70 to-[#343842]/70 pl-20 pr-[104px] text-left shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-[1px] active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-black italic leading-5 text-[#FFE36E]">
                FIRST TOP-UP BONUS!
              </div>

              <div className="mt-0.5 truncate text-[11.5px] font-bold leading-4 text-white/90">
                1 Free Book + 3 reading vouchers
              </div>
            </div>

            <img
              src="/assets/Icons/Manga%20girl.png"
              alt=""
              className="pointer-events-none absolute -right-0 -top-[36px] h-[107px] w-[137px] object-contain"
              loading="eager"
              decoding="async"
            />
          </button>

          <section
            className={
              inline
                ? 'min-h-[340px] w-full rounded-t-[26px] bg-white pb-5 pt-0 shadow-[0_-18px_50px_rgba(0,0,0,0.18)]'
                : 'max-h-[58vh] min-h-[340px] w-full overflow-y-auto rounded-t-[26px] bg-white pb-5 pt-0 shadow-[0_-18px_50px_rgba(0,0,0,0.18)] md:rounded-[26px]'
            }
          >
            <div className="border-b border-[#E5E7EB] px-4 pt-2">
              <div className="flex">
                <AccessTab active={activeTab === 'instant'} onClick={() => setActiveTab('instant')}>
                  Instant Access
                </AccessTab>

                <AccessTab active={activeTab === 'free'} onClick={() => setActiveTab('free')}>
                  Free Access
                </AccessTab>
              </div>
            </div>

            {activeTab === 'instant' ? (
              <>
                <PremiumRow />

                <div className="overflow-hidden border-b border-[#E5E7EB]">
                  <PackageButton option={singleOption} primary />
                  <PackageButton option={displayMultiOption} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 px-5">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF]">
                    <span>My Diamonds:</span>
                    <span className="font-black text-[#667085]">{formatNumber(diamondBalance)}</span>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAutoHint((value) => !value)}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D6DAE2] bg-white text-[11px] font-black text-[#A0A6B0] shadow-sm active:scale-95"
                      aria-label="Auto unlock info"
                    >
                      ?
                    </button>

                    {showAutoHint ? (
                      <button
                        type="button"
                        onClick={() => setShowAutoHint(false)}
                        className="absolute bottom-10 right-0 z-20 w-[260px] rounded-[16px] bg-[#111827] px-4 py-3 text-left text-[11px] font-bold leading-5 text-white shadow-xl"
                      >
                        Auto-unlock with Diamonds only. Free methods like Coins, Vouchers, or Story Cards won’t apply.
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setAutoUnlock((value) => !value)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[12px] font-bold text-[#9CA3AF]">
                        Auto unlock
                      </span>

                      <span className={`relative h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
                        autoUnlock
                          ? 'bg-[#111827] shadow-[0_6px_16px_rgba(17,24,39,0.28)]'
                          : 'bg-[#D1D6DE] shadow-inner'
                      }`}>
                        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${
                          autoUnlock ? 'left-[26px]' : 'left-1'
                        }`} />
                      </span>
                    </button>
                  </div>
                </div>

                {unlocking ? (
                  <div className="mt-5 text-center text-[12px] font-black text-[#8D94A1]">
                    Unlocking...
                  </div>
                ) : null}
              </>
            ) : (
       <div className="space-y-2.5 px-3 py-4">
  {freeAccessView === 'wallet' ? (
    <>
      <FreeAccessOption
        icon={
  <img
    src="/assets/Icons/Shadow Coin.svg"
    alt=""
    className="mx-auto h-7 w-7 object-contain"
    loading="lazy"
    decoding="async"
  />
}
        title={`Coins — ${formatNumber(coinBalance)} remaining`}
        subtitle={`Access lasts ${Number(coinAccess?.access_days || 7)} days.`}
        buttonText={coinCanAccess ? 'Access' : 'Not enough'}
        disabled={unlocking || !coinCanAccess}
        onClick={onCoinUnlock}
      />

      <FreeAccessOption
        icon={
  <img
    src="/assets/Icons/Voucher.svg"
    alt=""
    className="h-7 w-7 object-contain"
    loading="lazy"
    decoding="async"
  />
}
        title={`Vouchers — ${formatNumber(voucherBalance)} remaining`}
        subtitle="Permanent unlock for this episode."
        buttonText={voucherCanAccess ? 'Access' : 'Not enough'}
        disabled={unlocking || !voucherCanAccess}
        onClick={onVoucherUnlock}
      />

      <button
        type="button"
        onClick={() => setFreeAccessView('more')}
        className="mx-auto flex items-center gap-1 px-2 pt-1 text-[12px] font-normal text-[#8D94A1] active:text-[#111827]"
      >
        <span>More free methods</span>
        <i className="fa-solid fa-chevron-right text-[10px]" />
      </button>
    </>
  ) : (
    <>
      <FreeAccessOption
        icon={<i className="fa-solid fa-play text-[15px] text-[#0B5CFF]" />}
        title="Watch Video — Coming soon"
        subtitle="Unlock for one read only."
        buttonText="Watch"
        disabled
      />

      <FreeAccessOption
        icon={<i className="fa-regular fa-address-card text-[17px] text-[#111827]" />}
        title="Story Card — Coming soon"
        subtitle="Permanent unlock for same story only."
        buttonText="Access"
        disabled
      />

      <button
        type="button"
        onClick={() => setFreeAccessView('wallet')}
        className="mx-auto flex items-center gap-1 px-2 pt-1 text-[12px] font-normal text-[#8D94A1] active:text-[#111827]"
      >
        <span>Coins & Vouchers</span>
        <i className="fa-solid fa-chevron-right text-[10px]" />
      </button>
    </>
  )}
</div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function ContinuousLockedEpisodeCard({
  story,
  episode,
  wallet,
  packageOptions,
  autoUnlock,
  setAutoUnlock,
  unlocking,
  onPurchase,
  onUnlock,
}) {
  const diamondBalance = Number(wallet?.diamond_balance || 0)
const [diamondBoxIndex, setDiamondBoxIndex] = useState(0)
const [showAutoHint, setShowAutoHint] = useState(false)
  const backgroundImage = episode?.cover_url || story?.cover_url || ''

  const diamondBoxSources = [
  '/assets/Icons/Diamond box 2.png',
  '/assets/Icons/Diamond%20box%202.png',
  '/assets/Icons/Diamond box.png',
  '/assets/Icons/Diamond.svg',
]

  const singleOption =
    packageOptions.find((option) => option.key === 'single') || {
      key: 'single',
      label: '1 Episode',
      price: 10,
      requested_count: 1,
      enabled: true,
    }

  const multiPackagePriority = ['all_released', 'next50', 'next30', 'next10']
  const bestMultiOption = multiPackagePriority
    .map((key) => packageOptions.find((option) => option.key === key && option.enabled))
    .find(Boolean)

  const displayMultiOption =
    bestMultiOption || {
      key: 'next10',
      label: 'Next 10 Eps',
      price: 90,
      original_price: 100,
      discount_percent: 10,
      requested_count: 10,
      enabled: true,
    }

  const goPurchase = () => {
  onPurchase?.()
}

  const handlePackageClick = (option) => {
    if (!option || unlocking || !option.enabled) return

    const price = Number(option.price || 0)
    const requestedCount = Number(option.requested_count || 0)
    const isMultiPackage =
      requestedCount >= 10 ||
      ['next10', 'next30', 'next50', 'all_released'].includes(option.key)

    if (isMultiPackage && diamondBalance < price) {
      goPurchase()
      return
    }

    onUnlock(option.key)
  }

  const PackageButton = ({ option, primary = false }) => {
    if (!option) return null

    const price = Number(option.price || 0)
    const originalPrice = Number(option.original_price || 0)
    const discount = Number(option.discount_percent || 0)
    const requestedCount = Number(option.requested_count || 0)
    const isMultiPackage =
      requestedCount >= 10 ||
      ['next10', 'next30', 'next50', 'all_released'].includes(option.key)
    const needsTopUp = isMultiPackage && diamondBalance < price

    if (primary) {
      return (
        <button
          type="button"
          onClick={goPurchase}
          disabled={unlocking || !option.enabled}
          className="flex min-h-[78px] w-full items-center justify-center bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
        >
          <span className="flex items-center justify-center gap-2 text-[16px] font-medium text-[#4B5563]">
  <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
  <span className="font-semibold text-[#111827]">{formatNumber(price)}</span>
  <span>to unlock this Ep.</span>
</span>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => handlePackageClick(option)}
        disabled={unlocking || !option.enabled}
        className="relative flex min-h-[86px] w-full items-center justify-center overflow-hidden border-t border-[#E5E7EB] bg-white px-4 py-4 text-center active:scale-[0.99] disabled:opacity-55"
      >
        {discount > 0 ? (
      <span className="absolute right-[42px] top-[12px] rounded-tl-[14px] rounded-br-[14px] bg-[#FF4D6D] px-4 py-1.5 text-[11px] font-black leading-none text-white">
  {discount}% OFF
</span>
        ) : null}

        <span className="flex items-center justify-center gap-1.5 text-[16px] font-medium text-[#4B5563]">
  <img src="/assets/Icons/Diamond.svg" alt="" className="h-5 w-5 object-contain" />
  <span className="text-[#111827]">{formatNumber(price)}</span>
          {originalPrice > price ? (
            <span className="ml-1 text-[12px] text-[#A0A6B0] line-through">
              {formatNumber(originalPrice)}
            </span>
          ) : null}
          <span>to unlock {requestedCount || 'all'} Eps.</span>
        </span>

        
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-[64px] z-[40] overflow-hidden px-0 pb-0">
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45 blur-[1px]"
        />
      ) : null}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full items-end justify-center md:items-center">
        <div className="w-full pb-[env(safe-area-inset-bottom)] md:max-w-[520px] md:pb-0">
        <button
          type="button"
          onClick={goPurchase}
          className="mx-auto mb-5 flex h-[56px] w-[calc(100%-24px)] items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#343842]/70 via-[#565C68]/70 to-[#343842]/70 px-3 py-1 text-left shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-[1px]"
        >
          <span className="-mb-0 -mt-3 -ml-1 flex h-[78px] w-[78px] shrink-0 items-end justify-center overflow-visible">
            <img
             src="/assets/Icons/Diamond%20box.png?v=box-new-1"
              alt=""
              className="h-full w-full object-contain"
              loading="eager"
              decoding="async"
              onError={() => {
                setDiamondBoxIndex((current) => Math.min(current + 1, diamondBoxSources.length - 1))
              }}
            />
          </span>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-black italic leading-5 text-white">
              Don’t Miss Out
            </div>

            <div className="mt-0.5 flex items-baseline gap-1 leading-4">
              <span className="text-[15px] font-black italic text-[#FFE36E]">330</span>
              <span className="text-[11px] font-medium italic text-white/90">Diamonds Await!</span>
            </div>
          </div>

          <i className="fa-solid fa-chevron-right shrink-0 text-[18px] text-white/70" />
        </button>

        <section className="max-h-[58vh] w-full overflow-y-auto rounded-t-[26px] bg-white pb-5 pt-4 shadow-[0_-18px_50px_rgba(0,0,0,0.18)] md:rounded-[26px]">
          <div className="px-5 text-center">
            <h2 className="text-[16px] font-semibold text-[#4B5563]">
  Continue reading?
</h2>
          </div>

          <div className="mt-5 overflow-hidden border-y border-[#E5E7EB]">
            <PackageButton option={singleOption} primary />
            <PackageButton option={displayMultiOption} />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 px-5">
  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9CA3AF]">
    <span>My Diamonds:</span>
    <span className="font-black text-[#667085]">{formatNumber(diamondBalance)}</span>
  </div>

  <div className="relative flex items-center gap-2">
    <button
      type="button"
      onClick={() => setShowAutoHint((value) => !value)}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D6DAE2] bg-white text-[11px] font-black text-[#A0A6B0] shadow-sm active:scale-95"
      aria-label="Auto unlock info"
    >
      ?
    </button>

    {showAutoHint ? (
      <button
        type="button"
        onClick={() => setShowAutoHint(false)}
        className="absolute bottom-10 right-0 z-20 w-[260px] rounded-[16px] bg-[#111827] px-4 py-3 text-left text-[11px] font-bold leading-5 text-white shadow-xl"
      >
        Auto-unlock with Diamonds only. Free methods like Coins, Vouchers, or Story Cards won’t apply.
      </button>
    ) : null}

    <button
      type="button"
      onClick={() => setAutoUnlock((value) => !value)}
      className="flex items-center gap-2"
    >
      <span className="text-[12px] font-bold text-[#9CA3AF]">
  Auto unlock
</span>

      <span className={`relative h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
        autoUnlock
          ? 'bg-[#111827] shadow-[0_6px_16px_rgba(17,24,39,0.28)]'
          : 'bg-[#D1D6DE] shadow-inner'
      }`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${
          autoUnlock ? 'left-[26px]' : 'left-1'
        }`} />
      </span>
    </button>
  </div>
</div>

          {unlocking ? (
            <div className="mt-5 text-center text-[12px] font-black text-[#8D94A1]">
              Unlocking...
            </div>
          ) : null}
        </section>
        </div>
      </div>
    </div>
  )
}

function ReaderIconButton({ icon, label, onClick, className = '', disabled = false }) {

  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 text-current shadow-none ring-0 outline-none transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      aria-label={label}
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SettingsLineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden="true">
      <path
        d="M8.5 4.5h7L20 12l-4.5 7h-7L4 12l4.5-7Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  )
}

function ProgressLineIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[20px] w-[20px]" fill="none" aria-hidden="true">
      <path d="M4 7h9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M17 7h3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="15" cy="7" r="2.2" stroke="currentColor" strokeWidth="2.1" />

      <path d="M4 17h3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M11 17h9" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="9" cy="17" r="2.2" stroke="currentColor" strokeWidth="2.1" />
    </svg>
  )
}

function ScrollSubscribePopup({ visible, storyId, readingProgress, subscribed, onSubscribe, onClose }) {
  const [expandedByUser, setExpandedByUser] = useState(false)
  const [actionState, setActionState] = useState('idle')
  const dismissTimerRef = useRef(null)
  const shouldCollapse = Number(readingProgress || 0) >= 85
  const collapsed =
    shouldCollapse &&
    !expandedByUser &&
    actionState === 'idle'

  useEffect(() => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }

    if (!visible) {
      setExpandedByUser(false)
      setActionState('idle')
      return
    }

    if (Number(readingProgress || 0) < 85) {
      setExpandedByUser(false)
    }
  }, [visible, readingProgress])

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        window.clearTimeout(dismissTimerRef.current)
      }
    }
  }, [])

  const dismissAfterAnimation = (state, delay) => {
    if (dismissTimerRef.current) {
      window.clearTimeout(dismissTimerRef.current)
    }

    setActionState(state)

    dismissTimerRef.current = window.setTimeout(() => {
      onClose?.()
      setActionState('idle')
      dismissTimerRef.current = null
    }, delay)
  }

  const handleClose = () => {
    if (actionState !== 'idle') return
    dismissAfterAnimation('closing', 280)
  }

  const handleSubscribe = async () => {
    if (actionState !== 'idle') return

    const success = await onSubscribe?.()

    if (!success) return

    setExpandedByUser(true)
    dismissAfterAnimation('success', 1200)
  }

  if (!visible || !storyId || (subscribed && actionState === 'idle')) return null

  const bannerMotionClass =
    actionState === 'success'
      ? 'shadowSubscribeSuccess'
      : actionState === 'closing'
        ? 'shadowSubscribeClose'
        : ''

  if (collapsed) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-[calc(50vh+310px)] z-[96] -translate-y-1/2 px-3">
        <div className="pointer-events-auto ml-auto flex h-[62px] w-[calc(100vw-24px)] max-w-[430px] translate-x-[calc(100%-30px)] items-center gap-2 rounded-full bg-white px-3 shadow-[0_12px_34px_rgba(17,24,39,0.20)] transition-transform duration-300 ease-out">
          <button
            type="button"
            onClick={handleSubscribe}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#98a2b3] active:scale-95"
            aria-label="Show subscribe popup"
          >
            <i className="fa-regular fa-heart text-[13px] text-[#98a2b3]" />
          </button>

          <img
            src="/assets/Icons/Logo%20Shadow%203.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-[10px] object-contain"
            loading="lazy"
            decoding="async"
          />

          <div className="min-w-0 flex-1 text-[13px] font-bold leading-4 text-[#111827]">
            Subscribe to follow new episodes
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#ff3b5f] px-4 text-[12px] font-bold text-white active:scale-95"
          >
            <i className="fa-regular fa-heart text-[14px]" />
            <span>Subscribe</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes shadowSubscribeSuccess {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          18% {
            transform: translateY(-2px) scale(1.015);
            box-shadow: 0 14px 38px rgba(255, 59, 95, 0.22);
          }

          68% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
        }

        @keyframes shadowSubscribeClose {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateX(16px) scale(0.98);
          }
        }

        @keyframes shadowSubscribeButtonPop {
          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(0.92);
          }

          58% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes shadowSubscribeHeartFly {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.35) rotate(0deg);
          }

          20% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--heart-x)),
                calc(-50% + var(--heart-y))
              )
              scale(0.92)
              rotate(var(--heart-r));
          }
        }

        .shadowSubscribeSuccess {
          animation:
            shadowSubscribeSuccess
            1.2s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadowSubscribeClose {
          animation:
            shadowSubscribeClose
            .28s
            ease-out
            both;
        }

        .shadowSubscribeButtonPop {
          animation:
            shadowSubscribeButtonPop
            .52s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadowSubscribeHeart {
          animation:
            shadowSubscribeHeartFly
            .86s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-x-0 top-[calc(50vh+310px)] z-[96] -translate-y-1/2 px-3">
        <div
          className={`pointer-events-auto mx-auto flex h-[62px] max-w-[430px] items-center gap-2 rounded-full bg-white px-3 shadow-[0_12px_34px_rgba(17,24,39,0.20)] ${bannerMotionClass}`}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={actionState !== 'idle'}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#98a2b3] active:scale-95 disabled:pointer-events-none"
            aria-label="Close subscribe popup"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>

          <img
            src="/assets/Icons/Logo%20Shadow%203.png"
            alt=""
            className="h-10 w-10 shrink-0 rounded-[10px] object-contain"
            loading="lazy"
            decoding="async"
          />

          <div className="min-w-0 flex-1 text-[13px] font-bold leading-4 text-[#111827]">
            {actionState === 'success'
              ? 'You will see new episodes first'
              : 'Subscribe to follow new episodes'}
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={actionState !== 'idle'}
            className={`relative flex h-10 shrink-0 items-center gap-1.5 overflow-visible rounded-full bg-[#ff3b5f] px-4 text-[12px] font-bold text-white active:scale-95 disabled:pointer-events-none ${
              actionState === 'success'
                ? 'shadowSubscribeButtonPop'
                : ''
            }`}
          >
            {actionState === 'success' ? (
              <>
                <i className="fa-solid fa-check text-[13px]" />
                <span>Subscribed</span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[10px] text-[#ff3b5f]"
                  style={{
                    '--heart-x': '-34px',
                    '--heart-y': '-34px',
                    '--heart-r': '-18deg',
                    animationDelay: '20ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[8px] text-[#ff7891]"
                  style={{
                    '--heart-x': '-13px',
                    '--heart-y': '-44px',
                    '--heart-r': '14deg',
                    animationDelay: '90ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[9px] text-[#ff3b5f]"
                  style={{
                    '--heart-x': '18px',
                    '--heart-y': '-41px',
                    '--heart-r': '-10deg',
                    animationDelay: '150ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>

                <span
                  className="shadowSubscribeHeart absolute left-1/2 top-1/2 text-[7px] text-[#ff9aab]"
                  style={{
                    '--heart-x': '36px',
                    '--heart-y': '-27px',
                    '--heart-r': '20deg',
                    animationDelay: '220ms',
                  }}
                >
                  <i className="fa-solid fa-heart" />
                </span>
              </>
            ) : (
              <>
                <i className="fa-regular fa-heart text-[14px]" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}


function ReaderBottomActionBar({
  visible,
  theme,
  subscribed,
  onSubscribe,
  story,
  episode,
  commentRefreshKey,
  readingProgress,
  previousEpisode,
  nextEpisode,
  onPrevious,
  onNext,
  showSubscribeOnDoubleTap,
  onOpenChapters,
  onOpenComments,
  onOpenSettings,
}) {
  const [progressOpen, setProgressOpen] = useState(false)
  const [sideSubscribeState, setSideSubscribeState] = useState('idle')
  const sideSubscribeTimerRef = useRef(null)
  const safeProgress = Math.max(0, Math.min(100, Math.round(Number(readingProgress || 0))))
  const storyId = story?.id || story?.story_id || episode?.story_id || ''
  const episodeId = episode?.id || episode?.episode_id || ''

  const fallbackCommentTotal = Number(
  episode?.total_comments ||
  episode?.comment_count ||
  episode?.comments_count ||
  0
)

  const [commentTotal, setCommentTotal] = useState(fallbackCommentTotal)

  useEffect(() => {
    if (sideSubscribeTimerRef.current) {
      window.clearTimeout(sideSubscribeTimerRef.current)
      sideSubscribeTimerRef.current = null
    }

    setSideSubscribeState('idle')

  }, [storyId])

  const handleSubscribeClick = async () => {
    if (sideSubscribeState !== 'idle') return

    const success = await onSubscribe?.()

    if (!success) return

    setSideSubscribeState('success')
  }

  useEffect(() => {
    return () => {
      if (sideSubscribeTimerRef.current) {
        window.clearTimeout(sideSubscribeTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setCommentTotal(fallbackCommentTotal)
  }, [fallbackCommentTotal])

  useEffect(() => {
    let ignore = false

    async function loadCommentTotal() {
      if (!episodeId) return

      try {
        const token = getReaderToken()
        const response = await fetch(`${API_BASE_URL}/api/comments/episode/${episodeId}?page=1&limit=1&sort=newest`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false || ignore) return

        const nextTotal = Number(
          data.total ??
          data.total_comments ??
          data.count ??
          (Array.isArray(data.comments) ? data.comments.length : 0)
        )

        setCommentTotal(Number.isFinite(nextTotal) ? nextTotal : 0)
      } catch {
        if (!ignore) {
          setCommentTotal(fallbackCommentTotal)
        }
      }
    }

    loadCommentTotal()

    return () => {
      ignore = true
    }
  }, [episodeId, commentRefreshKey, fallbackCommentTotal])

  useEffect(() => {
    setProgressOpen(false)
  }, [episode?.id, episode?.episode_id])

  const commentBadge = commentTotal > 0 ? formatCompactNumber(commentTotal) : ''

  const FooterTab = ({ icon, iconNode, label, badge, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[54px] flex-1 flex-col items-center justify-center gap-1 active:scale-95"
    >
      <span className="relative flex h-5 items-center justify-center text-[#111827]">
        {iconNode || <i className={`${icon} text-[16px]`} />}

        {badge ? (
          <span className="absolute left-[20px] top-[-5px] text-[9px] font-normal text-[#9ca3af]">
            {badge}
          </span>
        ) : null}
      </span>

      <span className="text-[11px] font-normal leading-none text-[#8d94a1]">
        {label}
      </span>
    </button>
  )

  return (
    <div
      className={`pointer-events-none fixed bottom-0 left-0 right-0 z-[95] px-0 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out md:bottom-4 md:px-4 ${
        visible ? 'translate-y-0' : 'translate-y-[calc(100%+16px)]'
      }`}
    >
      <style>{`
  @keyframes shadowSideSubscribePop {
    0% { transform: scale(1); }
    28% { transform: scale(.91); }
    60% { transform: scale(1.07); }
    100% { transform: scale(1); }
  }

  @keyframes shadowSideSubscribeHide {
    0% { opacity: 1; transform: translateX(0) scale(1); }
    100% { opacity: 0; transform: translateX(22px) scale(.82); }
  }

  @keyframes shadowSideHeartFly {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(.3) rotate(0deg);
    }

    22% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform:
        translate(
          calc(-50% + var(--side-heart-x)),
          calc(-50% + var(--side-heart-y))
        )
        scale(.9)
        rotate(var(--side-heart-r));
    }
  }

  .shadowSideSubscribePop {
    animation:
      shadowSideSubscribePop
      .5s
      cubic-bezier(.22, 1, .36, 1)
      both;
  }

  .shadowSideSubscribeHide {
    animation:
      shadowSideSubscribeHide
      .28s
      ease-out
      both;
  }

  .shadowSideHeart {
    animation:
      shadowSideHeartFly
      .72s
      cubic-bezier(.22, 1, .36, 1)
      both;
  }
`}</style>

      {visible && showSubscribeOnDoubleTap && storyId && !subscribed ? (
        <button
  type="button"
  onClick={handleSubscribeClick}
  disabled={sideSubscribeState !== 'idle'}
  aria-label="Subscribe to this story"
  className={`pointer-events-auto absolute right-[-7px] z-[2] flex h-[58px] min-w-[84px] flex-col items-center justify-center overflow-visible rounded-l-[28px] rounded-r-none px-4 text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-colors duration-200 active:scale-95 disabled:pointer-events-none md:right-[-2px] ${
    sideSubscribeState === 'idle'
      ? 'bg-black/60'
      : 'bg-[#ff3b5f]'
  } ${
    sideSubscribeState === 'success'
      ? 'shadowSideSubscribePop'
      : sideSubscribeState === 'hiding'
        ? 'shadowSideSubscribeHide'
        : ''
  } ${progressOpen ? 'bottom-[132px]' : 'bottom-[84px]'}`}
>
  {sideSubscribeState === 'idle' ? (
    <>
      <i className="fa-regular fa-heart text-[20px]" />
      <span className="mt-1 text-[11px] font-normal leading-none">
        Subscribe
      </span>
    </>
  ) : (
    <>
      <i className="fa-solid fa-heart text-[20px]" />
      <span className="mt-1 text-[10px] font-semibold leading-none">
        Subscribed
      </span>

      <span
        className="shadowSideHeart pointer-events-none absolute left-1/2 top-1/2 text-[9px] text-[#ff3b5f]"
        style={{
          '--side-heart-x': '-24px',
          '--side-heart-y': '-36px',
          '--side-heart-r': '-16deg',
          animationDelay: '20ms',
        }}
      >
        <i className="fa-solid fa-heart" />
      </span>

      <span
        className="shadowSideHeart pointer-events-none absolute left-1/2 top-1/2 text-[7px] text-[#ff7891]"
        style={{
          '--side-heart-x': '0px',
          '--side-heart-y': '-43px',
          '--side-heart-r': '10deg',
          animationDelay: '90ms',
        }}
      >
        <i className="fa-solid fa-heart" />
      </span>

      <span
        className="shadowSideHeart pointer-events-none absolute left-1/2 top-1/2 text-[8px] text-[#ff9aab]"
        style={{
          '--side-heart-x': '23px',
          '--side-heart-y': '-33px',
          '--side-heart-r': '18deg',
          animationDelay: '150ms',
        }}
      >
        <i className="fa-solid fa-heart" />
      </span>
    </>
  )}
</button>

      ) : null}

      <div className="pointer-events-auto mx-auto max-w-3xl bg-[#FFFFFF] md:rounded-[18px] md:border md:border-[#E5E7EB]">
        {progressOpen ? (
          <div className="grid h-[48px] grid-cols-[58px_1fr_58px] items-center gap-3 border-b border-[#eef1f5] px-4">
            {previousEpisode ? (
              <button
                type="button"
                onClick={onPrevious}
                className="flex flex-col items-center justify-center gap-0.5 text-[#8d94a1] active:scale-95"
              >
                <i className="fa-solid fa-chevron-left text-[17px] text-[#111827]" />
                <span className="text-[10px] font-normal leading-none">Prev</span>
              </button>
            ) : (
              <div className="h-10 w-[58px]" />
            )}

            <div />

            {nextEpisode ? (
              <button
                type="button"
                onClick={onNext}
                className="flex flex-col items-center justify-center gap-0.5 text-[#8d94a1] active:scale-95"
              >
                <i className="fa-solid fa-chevron-right text-[17px] text-[#111827]" />
                <span className="text-[10px] font-normal leading-none">Next</span>
              </button>
            ) : (
              <div className="h-10 w-[58px]" />
            )}
          </div>
        ) : null}

        <div className="grid grid-cols-4 px-1 py-1">
          <FooterTab
            icon="fa-solid fa-list-ul"
            label="Episode"
            onClick={onOpenChapters}
          />

          <FooterTab
            icon="fa-regular fa-comment"
            label="Comments"
            badge={commentBadge}
            onClick={onOpenComments}
          />

          <FooterTab
            iconNode={<SettingsLineIcon />}
            label="Settings"
            onClick={onOpenSettings}
          />

          <FooterTab
            iconNode={
              progressOpen ? (
                <i className="fa-solid fa-chevron-down text-[17px]" />
              ) : (
                <ProgressLineIcon />
              )
            }
            label="Progress"
            badge={`${safeProgress}%`}
            onClick={() => setProgressOpen((value) => !value)}
          />
        </div>
      </div>
    </div>
  )
}

function LoadingCard() {
  return (
    <section className="px-1 pb-10 pt-2">
      <div className="animate-pulse">
        <div className="mb-7 border-b border-[#eef0f4] pb-6">
          <div className="h-5 w-28 rounded-full bg-[#eef1f5]" />
          <div className="mt-3 h-3 w-36 rounded-full bg-[#f3f4f6]" />
        </div>

        <div className="space-y-4">
          <div className="h-4 w-full rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[92%] rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[96%] rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[78%] rounded-full bg-[#eef1f5]" />

          <div className="h-3" />

          <div className="h-4 w-full rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[88%] rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[94%] rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[70%] rounded-full bg-[#eef1f5]" />

          <div className="h-3" />

          <div className="h-4 w-[98%] rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[84%] rounded-full bg-[#eef1f5]" />
          <div className="h-4 w-[91%] rounded-full bg-[#eef1f5]" />
        </div>
      </div>
    </section>
  )
}


function AdultWarningModal({ open, onCancel, onContinue }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-[420px] rounded-[26px] bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-solid fa-triangle-exclamation text-[26px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-extrabold text-[#111827]">18+ Episode Warning</h2>

        <p className="mt-3 text-[13px] leading-6 text-[#667085]">
          This episode may include mature content. Please continue only if you are allowed to view adult content.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-95"
          >
            Go Back
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function EpisodeListDrawer({ open, onClose, story, episodes, currentEpisodeId, storyId, navigate, theme }) {
  const [newestFirst, setNewestFirst] = useState(false)

  if (!open) return null

  const sortedEpisodes = [...episodes].sort((a, b) => {
    const first = Number(a.episode_number || 0)
    const second = Number(b.episode_number || 0)
    return newestFirst ? second - first : first - second
  })

  const readEpisodeIds = getReviewReadEpisodes(storyId).map((id) => String(id))
  const cover = story?.cover_url || story?.thumbnail_url || story?.image_url || ''
  const title = story?.title || story?.name || 'Untitled Story'
  const authorName =
  story?.author_page?.page_name ||
  story?.authorPage?.page_name ||
  story?.author_name ||
  story?.author?.name ||
  story?.page_name ||
  ''

  const rawStatus = String(story?.status || story?.publication_status || '').toLowerCase()
  const statusText =
    rawStatus.includes('complete') || rawStatus.includes('completed')
      ? 'Completed'
      : rawStatus.includes('new')
        ? 'New'
        : 'Ongoing'

  return (
    <div className="fixed inset-0 z-[140]">
      <button
        type="button"
        aria-label="Close episode list"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section
          className={`absolute bottom-0 left-0 top-0 flex w-[77vw] max-w-[360px] flex-col overflow-hidden ${theme.card} shadow-2xl transition-transform duration-300 ease-out`}

      >
        <div className={`shrink-0 border-b ${theme.border} ${theme.card}`}>
          <div className="flex items-center gap-3 px-4 py-5">
            {cover ? (
              <img
  src={cover}
  alt=""
  className="h-[66px] w-[50px] shrink-0 rounded-[7px] object-cover"
  loading="lazy"
  decoding="async"
/>
            ) : (
              <div className="h-[66px] w-[50px] shrink-0 rounded-[7px] bg-[#eef0f4]" />
            )}

            <div className="min-w-0 flex-1">
  <h3 className={`line-clamp-3 break-words text-[18px] font-bold leading-[1.65] ${theme.text}`}>
    {title}
  </h3>

  {authorName ? (
    <p className={`mt-1 line-clamp-1 text-[11.5px] font-normal leading-5 ${theme.muted}`}>
      by {authorName}
    </p>
  ) : null}
</div>
          </div>

          <div className={`flex h-14 items-center justify-between border-t ${theme.border} px-4`}>
            <div className={`text-[15px] font-semibold ${theme.text}`}>
              {episodes.length} Episodes, {statusText}
            </div>

            <button
              type="button"
              onClick={() => setNewestFirst((current) => !current)}
              className="flex h-9 w-9 items-center justify-center active:scale-95"
              aria-label="Reverse episode order"
            >
              <img src="/assets/Icons/Revers.svg" alt="Reverse" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-5">
          {sortedEpisodes.map((item) => {
            const active = String(item.id) === String(currentEpisodeId)
            const read = readEpisodeIds.includes(String(item.id))
            const locked =
  Number(item.episode_number || 0) > 5 &&
  Boolean(
    item.is_locked ||
    item.locked ||
    item.access_locked ||
    item.requires_unlock ||
    item.is_premium ||
    item.lock_type
  )

const titleColor = active ? 'text-[#111827]' : 'text-[#b6bcc6]'

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose()
                  navigate(`/story/${storyId}/episode/${item.id}`, {
                    state: {
                      storyPreview: story,
                      episodePreview: item,
                      returnSource: location.state?.returnSource || 'readerEpisodeList',
                    },
                  })
                }}
                className={`relative flex min-h-[64px] w-full items-center gap-3 px-5 text-left transition active:scale-[0.995] ${
  active ? 'bg-[#f3f4f6]' : 'bg-transparent'
}`}
              >
                <span className={`line-clamp-1 min-w-0 flex-1 text-[16px] font-semibold ${titleColor}`}>
  {item.title || `Episode ${item.episode_number || ''}`}
</span>

{locked ? (
  <i className="fa-solid fa-lock shrink-0 text-[12px] text-[#b6bcc6]" />
) : null}

               
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SettingSection({ title, children }) {
  return (
    <section className="border-t border-[#f0eef6] px-2 py-3 first:border-t-0">
      <h3 className="mb-3 text-[14px] font-bold text-[#111827]">{title}</h3>
      {children}
    </section>
  )
}

function ChoiceButton({ active, children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[16px] px-3 py-3 text-[12px] font-extrabold transition active:scale-[0.98] ${
        active ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function FontSelectDrawer({ open, onClose, selectedFontKey, onSelect }) {
  if (!open) return null

  const groups = FONT_OPTIONS.reduce((result, font) => {
    if (!result[font.group]) result[font.group] = []
    result[font.group].push(font)
    return result
  }, {})

  return (
    <div className="fixed inset-0 z-[170]">
      <button
        type="button"
        aria-label="Close font list"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-hidden rounded-t-[30px] bg-white shadow-2xl md:left-auto md:right-5 md:top-20 md:h-auto md:w-[420px] md:rounded-[26px]">
  

        <div className="max-h-[66vh] overflow-y-auto p-4">
          {Object.entries(groups).map(([group, fonts]) => (
            <section key={group} className="mb-5 last:mb-0">
              <h3 className="mb-2 text-[12px] font-black uppercase tracking-[0.08em] text-[#8d94a1]">
                {group}
              </h3>

              <div className="space-y-2">
                {fonts.map((font) => {
                  const active = font.key === selectedFontKey

                  return (
                    <button
                      key={font.key}
                      type="button"
                      onClick={() => {
                        onSelect(font.key)
                        onClose()
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-[18px] px-4 py-3 text-left active:scale-[0.995] ${
                        active ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
                      }`}
                    >
                      <span
  className="line-clamp-1 text-[14px] font-bold"
  style={{
    fontFamily: font.family,
    fontWeight: 700,
  }}
>
  {font.label}
</span>

                      {active ? (
                        <i className="fa-solid fa-check text-[13px]" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}

function ResetSettingsModal({ open, onCancel, onConfirm }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button type="button" aria-label="Cancel reset" onClick={onCancel} className="absolute inset-0" />

      <section className="relative w-full max-w-[430px] rounded-[30px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d]">
          <i className="fa-solid fa-rotate-left text-[24px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">Reset reading settings?</h2>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
          This will restore font size, font style, page color, brightness, line spacing, and auto scroll to default.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-full bg-[#e5484d] text-[13px] font-extrabold text-white"
          >
            Reset
          </button>
        </div>
      </section>
    </div>
  )
}

function ReaderSettingsDrawer({
  open,
  onClose,
  themeName,
  setThemeName,
  fontSizeIndex,
  setFontSizeIndex,
  fontKey,
  setFontKey,
  selectedFont,
  brightness,
  setBrightness,
  lineSpacing,
  setLineSpacing,
  readingMode,
  setReadingMode,
  autoScrollEnabled,
  setAutoScrollEnabled,
  autoScrollSpeed,
  setAutoScrollSpeed,
  onOpenFontList,
  onOpenReset,
}) {
  if (!open) return null

  const fontSizePx = FONT_SIZE_LEVELS[fontSizeIndex] || FONT_SIZE_LEVELS[DEFAULT_FONT_SIZE_INDEX]
  const lineSpacingOrder = ['compact', 'normal', 'comfort']
  const lineSpacingValues = {
    compact: '1.3',
    normal: '1.5',
    comfort: '1.8',
  }
  const lineSpacingIndex = Math.max(0, lineSpacingOrder.indexOf(lineSpacing))
  const lineSpacingValue = lineSpacingValues[lineSpacing] || lineSpacingValues.comfort
  const [moreSettingsOpen, setMoreSettingsOpen] = useState(false)

  const decreaseFont = () => {
    setFontSizeIndex((current) => Math.max(0, current - 1))
  }

  const increaseFont = () => {
    setFontSizeIndex((current) => Math.min(FONT_SIZE_LEVELS.length - 1, current + 1))
  }

  const decreaseLineSpacing = () => {
    setLineSpacing(lineSpacingOrder[Math.max(0, lineSpacingIndex - 1)] || 'compact')
  }

  const increaseLineSpacing = () => {
    setLineSpacing(lineSpacingOrder[Math.min(lineSpacingOrder.length - 1, lineSpacingIndex + 1)] || 'comfort')
  }

  const dragStartYRef = useRef(0)
const dragCurrentYRef = useRef(0)

const handleDragStart = (event) => {
  dragStartYRef.current = event.touches?.[0]?.clientY || event.clientY || 0
  dragCurrentYRef.current = dragStartYRef.current
}

const handleDragMove = (event) => {
  dragCurrentYRef.current = event.touches?.[0]?.clientY || event.clientY || dragCurrentYRef.current
}

const handleDragEnd = () => {
  if (dragCurrentYRef.current - dragStartYRef.current > 70) {
    onClose()
  }

  dragStartYRef.current = 0
  dragCurrentYRef.current = 0
}

  const handleAutoScrollToggle = () => {
    setAutoScrollEnabled((current) => {
      const next = !current
      if (next) onClose()
      return next
    })
  }


  if (moreSettingsOpen) {
    return (
      <div className="fixed inset-0 z-[146] bg-white">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#f0eef6] bg-white px-4">
          <button
  type="button"
  onClick={() => setMoreSettingsOpen(false)}
  className="flex h-10 w-10 items-center justify-center bg-transparent text-[#111827] active:scale-95"
  aria-label="Back to reader settings"
>
  <i className="fa-solid fa-chevron-left text-[14px]" />
</button>

          <h2 className="text-[15px] font-bold text-[#111827]">More Setting</h2>

          <button
  type="button"
  onClick={onClose}
  className="flex h-10 w-10 items-center justify-center bg-transparent text-[#111827] active:scale-95"
  aria-label="Close reader settings"
>
  <i className="fa-solid fa-xmark text-[15px]" />
</button>
        </div>

        <div className="mx-auto max-w-[520px] px-4 py-5">
          <SettingSection title="Reading Preferences">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setReadingMode('paging')
                  setAutoScrollEnabled(false)
                }}
                className={`h-12 rounded-[16px] text-[13px] font-normal active:scale-[0.98] ${
  readingMode === 'paging' ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
}`}
              >
                Paging
              </button>

              <button
                type="button"
                onClick={() => setReadingMode('scroll')}
                className={`h-12 rounded-[16px] text-[13px] font-normal active:scale-[0.98] ${
  readingMode === 'scroll' ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
}`}
              >
                Scrolling
              </button>
            </div>

            {readingMode === 'scroll' ? (
              <div className="mt-5 rounded-[22px] bg-[#fafafe] p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#111827]">Auto Scroll</h4>
                    <p className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">
                      Available only in Scrolling mode
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoScrollToggle}
                    className={`h-9 rounded-full px-4 text-[11px] font-normal active:scale-[0.995] ${
  autoScrollEnabled ? 'bg-[#e5484d] text-white' : 'bg-[#111827] text-white'
}`}
                  >
                    {autoScrollEnabled ? 'Turn Off' : 'Turn On'}
                  </button>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-center text-[12px] font-black text-[#667085]">
                    {AUTO_SCROLL_SPEEDS[autoScrollSpeed]?.label || 'Slow'}
                  </div>

                  <div className="flex items-center gap-3">
                    <img src="/assets/Icons/Turtle.svg" alt="Slow" className="h-6 w-6 shrink-0" />

                    <input
                      type="range"
                      min="0"
                      max={AUTO_SCROLL_SPEEDS.length - 1}
                      step="1"
                      value={autoScrollSpeed}
                      onChange={(event) => setAutoScrollSpeed(Number(event.target.value))}
                      className="w-full accent-[#111827]"
                    />

                    <img src="/assets/Icons/Rabbit.svg" alt="Fast" className="h-6 w-6 shrink-0" />
                  </div>
                </div>
              </div>
            ) : null}
          </SettingSection>

          <section className="px-2 pt-1">
            <button
  type="button"
  onClick={onOpenReset}
  className="h-12 w-full rounded-full border border-[#f0b8b8] bg-[#fff1f1] text-[13px] font-normal text-[#e5484d] active:scale-[0.99]"
>
  Reset Settings
</button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[145]">
      <button
        type="button"
        aria-label="Close reader settings"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

     <section
  className="absolute bottom-0 left-0 right-0 rounded-t-[30px] bg-white shadow-2xl md:left-auto md:right-5 md:top-20 md:h-auto md:w-[420px] md:rounded-[26px]"
  onTouchStart={handleDragStart}
  onTouchMove={handleDragMove}
  onTouchEnd={handleDragEnd}
  onMouseDown={handleDragStart}
  onMouseMove={handleDragMove}
  onMouseUp={handleDragEnd}
>

        <div className="px-3 pt-2 pb-6">
          <SettingSection title="Brightness">
            <div className="flex items-center gap-3">
              <i className="fa-regular fa-sun text-[18px] text-[#111827]" />
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={brightness}
                onChange={(event) => setBrightness(Number(event.target.value))}
                className="w-full accent-[#111827]"
              />
              <span className="w-10 text-right text-[12px] font-extrabold text-[#667085]">{brightness}%</span>
            </div>
          </SettingSection>

          <SettingSection title="Font & Spacing">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[20px] bg-[#fafafe] p-2.5">
                <div className="mb-2 text-[11px] font-black text-[#8d94a1]">Font Size</div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseFont}
                    disabled={fontSizeIndex <= 0}
                    className="flex h-10 items-center justify-center rounded-[15px] bg-[#f0eef6] text-[13px] font-bold text-[#111827] active:scale-[0.98] disabled:opacity-40"
                    aria-label="Decrease font size"
                  >
                    A<sup className="-mt-2 text-[10px]">−</sup>
                  </button>

                  <div className="min-w-[34px] text-center text-[12px] font-bold text-[#8d94a1]">
  {fontSizePx}
</div>

                  <button
                    type="button"
                    onClick={increaseFont}
                    disabled={fontSizeIndex >= FONT_SIZE_LEVELS.length - 1}
                    className="flex h-10 items-center justify-center rounded-[15px] bg-[#f0eef6] text-[14px] font-black text-[#111827] active:scale-[0.98] disabled:opacity-40"
                    aria-label="Increase font size"
                  >
                    A<sup className="-mt-2 text-[10px]">+</sup>
                  </button>
                </div>
              </div>

              <div className="rounded-[20px] bg-[#fafafe] p-2.5">
                <div className="mb-2 text-[11px] font-black text-[#8d94a1]">Line Spacing</div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseLineSpacing}
                    disabled={lineSpacingIndex <= 0}
                    className="flex h-10 items-center justify-center rounded-[15px] bg-[#f0eef6] text-[#111827] active:scale-[0.98] disabled:opacity-40"
                    aria-label="Decrease line spacing"
                  >
                    <i className="fa-solid fa-text-height text-[12px]" />
                   <i className="fa-solid fa-plus ml-1 text-[9px]" />
                  </button>

                  <div className="min-w-[34px] text-center text-[12px] font-bold text-[#8d94a1]">
  {lineSpacingValue}
</div>

                  <button
                    type="button"
                    onClick={increaseLineSpacing}
                    disabled={lineSpacingIndex >= lineSpacingOrder.length - 1}
                    className="flex h-10 items-center justify-center rounded-[15px] bg-[#f0eef6] text-[#111827] active:scale-[0.98] disabled:opacity-40"
                    aria-label="Increase line spacing"
                  >
                    <i className="fa-solid fa-text-height text-[13px]" />
                    <i className="fa-solid fa-plus ml-1 text-[9px]" />
                  </button>
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection title="Page Color">
<div className="grid grid-cols-4 gap-2">
  {Object.entries(READER_THEMES).map(([key, item]) => (
    <button
      key={key}
      type="button"
      onClick={() => setThemeName(key)}
      className="flex items-center justify-center rounded-[12px] bg-transparent p-0 active:scale-[0.98]"
      aria-label={item.name}
    >
      <span
        className={`block h-9 w-full rounded-[12px] ${item.swatch} ${
          themeName === key
            ? 'ring-2 ring-[#f6c343]'
            : 'ring-0'
        }`}
      />
    </button>
  ))}
</div>
          </SettingSection>

          <SettingSection title="Font Style">
            <button
              type="button"
              onClick={onOpenFontList}
              className="flex h-14 w-full items-center justify-between rounded-[18px] bg-[#f5f3fa] px-4 text-left active:scale-[0.995]"
            >
              <span
  className="line-clamp-1 text-[14px] font-bold text-[#111827]"
  style={{
    fontFamily: selectedFont.family,
    fontWeight: 700,
  }}
>
  {selectedFont.label}
</span>
              <i className="fa-solid fa-chevron-right text-[12px] text-[#8d94a1]" />
            </button>
          </SettingSection>

         <section className="px-2 py-3 text-center">
  <button
  type="button"
  onClick={() => setMoreSettingsOpen(true)}
  className="text-[13px] font-normal text-[#8d94a1] active:scale-[0.98]"
>
  More Setting
</button>
</section>

          {moreSettingsOpen ? (
            <>
              <SettingSection title="Reading Preferences">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setReadingMode('paging')
                  setAutoScrollEnabled(false)
                }}
                className={`h-12 rounded-[16px] text-[13px] font-black active:scale-[0.98] ${
                  readingMode === 'paging' ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
                }`}
              >
                Paging
              </button>

              <button
                type="button"
                onClick={() => setReadingMode('scroll')}
                className={`h-12 rounded-[16px] text-[13px] font-black active:scale-[0.98] ${
                  readingMode === 'scroll' ? 'bg-[#111827] text-white' : 'bg-[#f5f3fa] text-[#111827]'
                }`}
              >
                Scrolling
              </button>
            </div>

            {readingMode === 'scroll' ? (
              <div className="mt-5 rounded-[22px] bg-[#fafafe] p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[13px] font-black text-[#111827]">Auto Scroll</h4>
                    <p className="mt-0.5 text-[11px] font-bold text-[#8d94a1]">
                      Available only in Scrolling mode
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoScrollToggle}
                    className={`h-9 rounded-full px-4 text-[11px] font-black active:scale-[0.995] ${
                      autoScrollEnabled ? 'bg-[#e5484d] text-white' : 'bg-[#111827] text-white'
                    }`}
                  >
                    {autoScrollEnabled ? 'Turn Off' : 'Turn On'}
                  </button>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-center text-[12px] font-black text-[#667085]">
  {AUTO_SCROLL_SPEEDS[autoScrollSpeed]?.label || 'Slow'}
</div>

<div className="flex items-center gap-3">
  <img src="/assets/Icons/Turtle.svg" alt="Slow" className="h-6 w-6 shrink-0" />

  <input
    type="range"
    min="0"
    max={AUTO_SCROLL_SPEEDS.length - 1}
    step="1"
    value={autoScrollSpeed}
    onChange={(event) => setAutoScrollSpeed(Number(event.target.value))}
    className="w-full accent-[#111827]"
  />

  <img src="/assets/Icons/Rabbit.svg" alt="Fast" className="h-6 w-6 shrink-0" />
</div>
                </div>
              </div>
            ) : null}
          </SettingSection>

              <section className="px-2 pt-1">
            <button
              type="button"
              onClick={onOpenReset}
              className="h-12 w-full rounded-full border border-[#f0b8b8] bg-[#fff1f1] text-[13px] font-black text-[#e5484d] active:scale-[0.99]"
            >
              Reset Settings
            </button>
          </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}

function WebcomicReadingMissionCoin({
  visible,
  target,
  rewardAnimation,
  onClick,
}) {
  if (!target && !rewardAnimation) return null

  const targetSeconds = Math.max(
    1,
    Number(target?.target_seconds || 1)
  )

  const activeSeconds = Math.min(
    targetSeconds,
    Math.max(0, Number(target?.active_seconds || 0))
  )

  const progress =
    targetSeconds > 0
      ? activeSeconds / targetSeconds
      : 0

  const showingReward = Boolean(rewardAnimation)

  const ringRadius = 24
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference * (1 - progress)

  return (
    <>
      <style>{`
        @keyframes shadowReadingCoinExit {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }

          20% {
            transform: translateY(-6px) rotate(-9deg) scale(1.06);
          }

          42% {
            transform: translateY(1px) rotate(8deg) scale(.98);
          }

          62% {
            transform: translateY(-3px) rotate(-5deg) scale(1.03);
          }

          78% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(.96);
          }

          100% {
            opacity: 0;
            transform: translateY(2px) rotate(0deg) scale(.68);
          }
        }

        @keyframes shadowReadingRewardEnter {
          0% {
            opacity: 0;
            transform: scale(.55) rotate(-7deg);
          }

          58% {
            opacity: 1;
            transform: scale(1.13) rotate(3deg);
          }

          78% {
            transform: scale(.97) rotate(-1deg);
          }

          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes shadowReadingNumberDrop {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(.7);
          }

          58% {
            opacity: 1;
            transform: translateY(3px) scale(1.1);
          }

          78% {
            transform: translateY(-2px) scale(.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shadowReadingWhiteFlash {
          0% {
            opacity: 0;
            transform: scale(.82);
          }

          34% {
            opacity: .95;
            transform: scale(1.05);
          }

          100% {
            opacity: 0;
            transform: scale(1.28);
          }
        }

        @keyframes shadowReadingSparkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }

          40% {
            opacity: 1;
            transform: scale(1.25);
          }

          100% {
            opacity: 0;
            transform: scale(.25);
          }
        }

        .shadowReadingCoinExit {
          animation:
            shadowReadingCoinExit
            .52s
            cubic-bezier(.22, 1, .36, 1)
            both;
        }

        .shadowReadingRewardEnter {
          animation:
            shadowReadingRewardEnter
            .5s
            cubic-bezier(.22, 1, .36, 1)
            .34s
            both;
        }

        .shadowReadingNumberDrop {
          animation:
            shadowReadingNumberDrop
            .5s
            cubic-bezier(.22, 1, .36, 1)
            .52s
            both;
        }

        .shadowReadingWhiteFlash {
          animation:
            shadowReadingWhiteFlash
            .82s
            ease-out
            .38s
            both;
        }

        .shadowReadingSparkle {
          animation:
            shadowReadingSparkle
            .72s
            ease-out
            both;
        }
      `}</style>

      <button
        type="button"
        onClick={onClick}
        aria-label="Open Task Center"
        className={`fixed right-3 top-[74px] z-[92] flex h-[56px] w-[56px] items-center justify-center transition-all duration-300 active:scale-95 ${
          visible || showingReward
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-5 opacity-0'
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-[#8D939A] shadow-[0_8px_20px_rgba(17,24,39,0.22)]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >

          <circle
            cx="28"
            cy="28"
            r={ringRadius}
            fill="none"
            stroke="#D95A5A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={showingReward ? 0 : ringOffset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>

        {showingReward ? (
          <span
            key={rewardAnimation.key}
            className="absolute inset-0"
          >
            <span className="absolute inset-0 flex items-center justify-center">
              <img
                src="/assets/Icons/Shadow%20Coin.svg"
                alt=""
                className="shadowReadingCoinExit h-[38px] w-[38px] object-contain"
              />
            </span>

            <span className="shadowReadingWhiteFlash absolute -inset-1 rounded-full border-[3px] border-white shadow-[0_0_16px_rgba(255,255,255,0.92)]" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="shadowReadingRewardEnter relative flex h-[40px] w-[40px] items-center justify-center">
                <img
                  src="/assets/Icons/Shadow%20Coin%202.svg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />

                <span className="shadowReadingNumberDrop relative z-10 text-[17px] font-bold leading-none tracking-[-0.02em] text-white drop-shadow-[0_2px_2px_rgba(120,48,0,0.38)] [font-variant-numeric:tabular-nums]">
                  {rewardAnimation.coins}
                </span>
              </span>
            </span>

            <span
              className="shadowReadingSparkle absolute -left-0.5 top-1 h-2 w-2 rounded-full bg-white"
              style={{ animationDelay: '.45s' }}
            />

            <span
              className="shadowReadingSparkle absolute right-0 top-2 h-2.5 w-2.5 rounded-full bg-[#FFD66B]"
              style={{ animationDelay: '.52s' }}
            />

            <span
              className="shadowReadingSparkle absolute bottom-1 left-2 h-1.5 w-1.5 rounded-full bg-[#FFE9A6]"
              style={{ animationDelay: '.59s' }}
            />

            <span
              className="shadowReadingSparkle absolute bottom-0 right-2 h-2 w-2 rounded-full bg-white"
              style={{ animationDelay: '.65s' }}
            />
          </span>
        ) : (
          <span className="relative z-10 flex h-[38px] w-[38px] items-center justify-center">
            <img
              src="/assets/Icons/Shadow%20Coin.svg"
              alt="Shadow Coin"
              className="h-[38px] w-[38px] object-contain"
            />
          </span>
        )}
      </button>
    </>
  )
}

function ContinuousEpisodeBlock({
  entry,
  index,
  active,
  theme,
  story,
  fontSizePx,
  fontFamily,
  lineSpacing,
  onRegister,
  onOpenComments,
  onOpenGift,
  onReachLocked,
  adultAccepted,
}) {
  const episode = entry?.episode || {}
  const lockedSectionRef = useRef(null)
  const lockedOpenedRef = useRef(false)
  const adultBlocked = Boolean(
    episode?.is_adult && !adultAccepted
  )
  const adBlocked = Boolean(
    entry?.gate?.ad_policy?.show_read_ad &&
      entry?.gate?.advertisement?.image_url &&
      !entry?.adFinished
  )

  useEffect(() => {
    lockedOpenedRef.current = false
  }, [entry?.id])

  useEffect(() => {
    if (!entry?.locked || !lockedSectionRef.current) return undefined

    const node = lockedSectionRef.current
    const observer = new IntersectionObserver(
      ([result]) => {
        if (!result?.isIntersecting || lockedOpenedRef.current) return

        lockedOpenedRef.current = true
        onReachLocked?.(entry)
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [entry, onReachLocked])

  return (
    <section
      ref={(node) => {
        lockedSectionRef.current = node
        onRegister(entry.id, node)
      }}
      data-episode-id={entry.id}
      className={index > 0 && !entry.locked ? `border-t ${theme.border}` : ''}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: entry.locked ? '1px' : '900px',
      }}
    >
      {adultBlocked ? (
        <div className={`${theme.card} flex min-h-[58vh] items-center justify-center px-4 py-10`}>
          <div className="text-center">
            <i className={`fa-solid fa-triangle-exclamation text-[26px] ${theme.muted}`} />
            <p className={`mt-3 text-[13px] font-semibold ${theme.muted}`}>
              Confirm the adult-content warning to continue.
            </p>
          </div>
        </div>
      ) : entry.locked ? (
        <div className="h-px w-full" aria-hidden="true" />
      ) : adBlocked ? (
        <div className={`${theme.card} flex min-h-[58vh] items-center justify-center px-4 py-10`}>
          <div className="text-center">
            <i className={`fa-solid fa-play-circle text-[26px] ${theme.muted}`} />
            <p className={`mt-3 text-[13px] font-semibold ${theme.muted}`}>
              Advertisement required before this episode.
            </p>
          </div>
        </div>
      ) : (
        <>
          <section className={`overflow-hidden rounded-none ${theme.card} shadow-none ring-0 sm:rounded-[28px] sm:shadow-sm sm:ring-1 sm:ring-black/5`}>
            <div className="px-4 py-5 sm:p-8">
              <div className="mb-7">
                <h1
                  className={`text-[30px] font-bold leading-[1.35] tracking-[-0.01em] ${theme.text} sm:text-[34px]`}
                  style={{ fontFamily }}
                >
                  {episode.title || 'Untitled Episode'}
                </h1>
              </div>

              <article>
                <ReadingText
                  content={episode.content}
                  fontSizePx={fontSizePx}
                  fontFamily={fontFamily}
                  lineSpacing={lineSpacing}
                  theme={theme}
                />
              </article>
            </div>
          </section>

          <ReaderEndPanel
            story={story}
            episode={episode}
            onOpenComments={() => onOpenComments(episode)}
            onOpenGift={onOpenGift}
          />
        </>
      )}

      <div
        className={`h-px w-full ${active ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
    </section>
  )
}

export default function ReaderPage() {
  const SHOW_READER_COVER = false
  const SHOW_READER_INFO = false
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId, episodeId: routeEpisodeId } = useParams()
  const [activeEpisodeId, setActiveEpisodeId] = useState(routeEpisodeId)
  const episodeId = activeEpisodeId || routeEpisodeId
  const expectedLocked = Boolean(location.state?.expectedLocked)
  const expectedStory = location.state?.storyPreview || null
  const expectedEpisode = location.state?.episodePreview || null
  const hasExpectedLockedPreview =
  expectedLocked &&
  Boolean(expectedEpisode) &&
  Number(expectedEpisode.episode_number || 0) > 5
  const autoScrollFrameRef = useRef(null)
  const qualifiedViewSentRef = useRef(false)
  const readingProgressRef = useRef(0)
  const lastReadingActivityRef = useRef(0)
  const readingActivityReadyAtRef = useRef(0)
  const previousReadingPageRef = useRef(null)
  const readingHeartbeatBusyRef = useRef(false)
  const activeReadingTargetRef = useRef(null)
  const rewardAnimationTimerRef = useRef(null)

  const [story, setStory] = useState(expectedStory)
  const [episode, setEpisode] = useState(expectedEpisode)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(!hasExpectedLockedPreview)
  const [message, setMessage] = useState('')
  const [lockedEpisode, setLockedEpisode] = useState(hasExpectedLockedPreview)
  const [continuousLockedEntry, setContinuousLockedEntry] = useState(null)
  const [unlockWallet, setUnlockWallet] = useState(null)
  const [unlockCoinAccess, setUnlockCoinAccess] = useState(null)
  const [unlockVoucherAccess, setUnlockVoucherAccess] = useState(null)
  const [unlockPackageOptions, setUnlockPackageOptions] = useState([])

  const [unlockAutoUnlock, setUnlockAutoUnlock] = useState(false)
  const [unlockAutoHintOpen, setUnlockAutoHintOpen] = useState(false)
  const [unlockingEpisode, setUnlockingEpisode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(getInitialFontSizeIndex)
  const [fontKey, setFontKey] = useState(() => localStorage.getItem('reader_font_key') || 'noto-sans-khmer')
  const [themeName, setThemeName] = useState(() => {
  localStorage.setItem('reader_theme', 'white')
  return 'white'
})
const [brightness, setBrightness] = useState(() => {
  localStorage.setItem('reader_brightness', '100')
  return 100
})
  const [lineSpacing, setLineSpacing] = useState(() => localStorage.getItem('reader_line_spacing') || 'comfort')
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('reader_reading_mode') || 'scroll')
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false)
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(() => Number(localStorage.getItem('reader_auto_scroll_speed') || 1))
  const [adultWarningOpen, setAdultWarningOpen] = useState(false)
  const [adultAccepted, setAdultAccepted] = useState(false)
  const [adultConsentGranted, setAdultConsentGranted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [readerMoreOpen, setReaderMoreOpen] = useState(false)
  const [fontSelectOpen, setFontSelectOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [episodeListOpen, setEpisodeListOpen] = useState(false)
  const [echoShareOpen, setEchoShareOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeReadingTarget, setActiveReadingTarget] = useState(null)
  const [readingRewardAnimation, setReadingRewardAnimation] = useState(null)
  const [readingRewardReloadKey, setReadingRewardReloadKey] = useState(0)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [reviewProgressSaved, setReviewProgressSaved] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentEpisode, setCommentEpisode] = useState(null)
  const [giftPopupOpen, setGiftPopupOpen] = useState(false)

useEffect(() => {
  const reopenKey = sessionStorage.getItem(
    'shadow_reopen_episode_comments'
  )

  if (reopenKey !== `${storyId}:${episodeId}`) return

  sessionStorage.removeItem('shadow_reopen_episode_comments')
  setCommentsOpen(true)
}, [storyId, episodeId])

useEffect(() => {
  if (sessionStorage.getItem('shadow_reopen_gift_popup') !== '1') return

  sessionStorage.removeItem('shadow_reopen_gift_popup')
  setGiftPopupOpen(true)
}, [])
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)
  const [bottomActionsVisible, setBottomActionsVisible] = useState(false)
  const [readerHeaderVisible, setReaderHeaderVisible] = useState(false)
  const [readerDoubleTapVisible, setReaderDoubleTapVisible] = useState(false)
  const [scrollSubscribePopupVisible, setScrollSubscribePopupVisible] = useState(false)
  const [scrollSubscribeDismissed, setScrollSubscribeDismissed] = useState(false)
const [subscribed, setSubscribed] = useState(false)
const [savingSubscribe, setSavingSubscribe] = useState(false)
  const [readerAdPolicy, setReaderAdPolicy] = useState(null)
  const [readerAdvertisement, setReaderAdvertisement] = useState(null)
  const [readerAdFinished, setReaderAdFinished] = useState(false)
  const [readerGateReady, setReaderGateReady] = useState(false)
  const lastScrollYRef = useRef(0)
  const lastReaderTapRef = useRef(0)

  useEffect(() => {
    activeReadingTargetRef.current = activeReadingTarget
  }, [activeReadingTarget])

  useEffect(() => {
    setAdultConsentGranted(false)
  }, [storyId])

  const theme = READER_THEMES[themeName] || READER_THEMES.white
  const activeFont = FONT_OPTIONS.find((font) => font.key === fontKey) || FONT_OPTIONS[0]
  const fontSizePx = FONT_SIZE_LEVELS[fontSizeIndex] || FONT_SIZE_LEVELS[DEFAULT_FONT_SIZE_INDEX]
  const brightnessOpacity = Math.max(0, Math.min(0.35, (100 - brightness) / 125))
  const pagingPages = useMemo(() => {
    return createPagingPages(episode?.content || '', lineSpacing, fontSizePx)
  }, [episode?.content, fontSizePx, lineSpacing])

  useReadingProgressSync({
    storyId,
    episodeId,
    readingPercent: readingProgress,
    enabled: Boolean(episode) && !loading && !lockedEpisode && adultAccepted,
  })


useEffect(() => {
  let ignore = false

  async function loadSubscriptionStatus() {
    const token = getReaderToken()

    if (!token || !storyId) {
      setSubscribed(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reader/status/${storyId}`, {
  headers: readerAuthHeaders(),
  cache: 'no-store',
})
const data = await response.json().catch(() => ({}))

if (!response.ok || data.ok === false) throw new Error()
const isSubscribed = data.subscribed === true || data.subscribed === 1 || data.subscribed === 'true'
if (!ignore) setSubscribed(isSubscribed)
    } catch {
      if (!ignore) setSubscribed(false)
    }
  }

  loadSubscriptionStatus()

  return () => {
    ignore = true
  }
}, [storyId])

const handleSubscribe = async () => {
  const token = getReaderToken()

  if (!token) {
    navigate('/login')
    return false
  }

  if (subscribed) return true
  if (savingSubscribe) return false

  setSavingSubscribe(true)

  try {
    const response = await fetch(`${API_BASE_URL}/api/reader/subscriptions/${storyId}`, {
      method: 'POST',
      headers: readerAuthHeaders(),
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) throw new Error()

    setSubscribed(true)
    setScrollSubscribePopupVisible(false)
    setScrollSubscribeDismissed(true)
    return true
  } catch {
    return false
  } finally {
    setSavingSubscribe(false)
  }
}

  useEffect(() => {
    localStorage.setItem('reader_font_size_index', String(fontSizeIndex))
    localStorage.setItem('reader_font_size', fontSizeIndex <= 0 ? 'small' : fontSizeIndex >= 2 ? 'large' : 'normal')
  }, [fontSizeIndex])

useEffect(() => {
  setScrollSubscribePopupVisible(false)
  setScrollSubscribeDismissed(false)
}, [storyId, episodeId])

  useEffect(() => {
    localStorage.setItem('reader_font_key', fontKey)
  }, [fontKey])

  useEffect(() => {
    localStorage.setItem('reader_theme', themeName)
  }, [themeName])

  useEffect(() => {
    localStorage.setItem('reader_brightness', String(brightness))
  }, [brightness])

  useEffect(() => {
    localStorage.setItem('reader_line_spacing', lineSpacing)
  }, [lineSpacing])

  useEffect(() => {
    localStorage.setItem('reader_reading_mode', readingMode)
  }, [readingMode])

  useEffect(() => {
    localStorage.setItem('reader_auto_scroll_speed', String(autoScrollSpeed))
  }, [autoScrollSpeed])

  const handleReaderDoubleTap = (event) => {
    const target = event.target

    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[data-ignore-reader-tap="true"]')
    ) {
      return
    }

    const now = Date.now()
    const difference = now - lastReaderTapRef.current

    if (difference > 0 && difference < 320) {
      const nextVisible = !bottomActionsVisible

      setReaderHeaderVisible(nextVisible)
      setBottomActionsVisible(nextVisible)
      setReaderDoubleTapVisible(nextVisible)
     setScrollSubscribePopupVisible(false)

      lastReaderTapRef.current = 0
      return
    }

    lastReaderTapRef.current = now
  }

  useEffect(() => {
    if (readingMode !== 'paging') return
    const savedPage = Number(localStorage.getItem(getPagingKey(storyId, episodeId)) || 0)
    setCurrentPageIndex(Number.isFinite(savedPage) && savedPage >= 0 ? savedPage : 0)
  }, [episodeId, readingMode, storyId])

  useEffect(() => {
    if (readingMode !== 'paging') return

    const maxPageIndex = Math.max(0, pagingPages.length - 1)
    setCurrentPageIndex((current) => Math.min(Math.max(0, current), maxPageIndex))
  }, [pagingPages.length, readingMode])

  useEffect(() => {
    if (readingMode !== 'paging') return

    localStorage.setItem(getPagingKey(storyId, episodeId), String(currentPageIndex))

    const totalPages = Math.max(1, pagingPages.length)
    const progress = Math.min(100, Math.max(0, ((currentPageIndex + 1) / totalPages) * 100))

    setReadingProgress(progress)
    readingProgressRef.current = progress
  }, [currentPageIndex, episodeId, pagingPages.length, readingMode, storyId])

async function loadReaderAdStatus(targetEpisodeId = episodeId) {
  if (!isUsableRouteId(storyId) || !isUsableRouteId(targetEpisodeId)) {
    return { ad_policy: null, advertisement: null }
  }

  const response = await fetch(
    `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/status`,
    {
      headers: readerAuthHeaders(),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    return {
      ad_policy: null,
      advertisement: null,
    }
  }

  return {
    ad_policy: data.ad_policy || null,
    advertisement: data.advertisement || null,
  }
}

async function loadContinuousEpisode(targetEpisode) {
  const targetId = String(
    targetEpisode?.id || targetEpisode?.episode_id || ''
  ).trim()

  if (!targetId) return null

  const response = await fetch(
    `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${targetId}`,
    {
      headers: readerAuthHeaders(),
      cache: 'no-store',
    }
  )

  const data = await response.json().catch(() => ({}))

  if (
    response.status === 423 ||
    data.code === 'EPISODE_LOCKED'
  ) {
    const unlockResponse = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetId}/status`,
      {
        headers: readerAuthHeaders(),
        cache: 'no-store',
      }
    )
    const unlockData = await unlockResponse
      .json()
      .catch(() => ({}))
    const unlockStatus =
      unlockResponse.ok && unlockData.ok !== false
        ? unlockData
        : {}

    return {
      id: targetId,
      episode: data.episode || targetEpisode,
      locked: true,
      unlockStatus,
      gate: null,
      adFinished: true,
    }
  }

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load episode')
  }

  const gate = await loadReaderAdStatus(targetId).catch(() => ({
    ad_policy: null,
    advertisement: null,
  }))
  const requiresAd = Boolean(
    gate?.ad_policy?.show_read_ad &&
      gate?.advertisement?.image_url
  )

  return {
    id: targetId,
    episode: data.episode || targetEpisode,
    locked: false,
    gate,
    adFinished: !requiresAd,
  }
}

const continuousReader = useContinuousEpisodeReader({
  enabled: readingMode === 'scroll',
  storyId,
  activeEpisodeId: episodeId,
  episodes,
  loadEpisode: loadContinuousEpisode,
  onActiveEntry: (entry) => {
    if (!entry?.episode) return

    setActiveEpisodeId(String(entry.id))
    setEpisode(entry.episode)
    setLockedEpisode(Boolean(entry.locked))
    setReadingProgress(0)
    readingProgressRef.current = 0
    qualifiedViewSentRef.current = false
    setReviewProgressSaved(false)
    setReaderAdPolicy(entry.gate?.ad_policy || null)
    setReaderAdvertisement(entry.gate?.advertisement || null)
    setReaderAdFinished(Boolean(entry.adFinished))
    setReaderGateReady(true)
    setReaderMoreOpen(false)
    setCommentEpisode(null)

    if (
      entry.locked &&
      Object.prototype.hasOwnProperty.call(entry, 'unlockStatus')
    ) {
      setContinuousLockedEntry(entry)
    } else if (!entry.locked) {
      setContinuousLockedEntry(null)
    }

    if (entry.locked) {
      const unlock = entry.unlockStatus || {}

      setUnlockWallet(unlock.wallet || null)
      setUnlockCoinAccess(
        unlock.coin_access || unlock.gem_access || null
      )
      setUnlockVoucherAccess(unlock.voucher_access || null)
      setUnlockPackageOptions(
        Array.isArray(unlock.package_options)
          ? unlock.package_options
          : []
      )
      setUnlockAutoUnlock(
        Boolean(unlock.wallet?.auto_unlock)
      )

      if (!unlock.wallet) {
        loadLockedUnlockStatus(entry.id).catch(() => {})
      }
    }

    if (entry.episode.is_adult && !adultConsentGranted) {
      setAdultAccepted(false)
      setAdultWarningOpen(true)
    } else {
      setAdultAccepted(true)
      setAdultWarningOpen(false)
    }
  },
})

useEffect(() => {
    let ignore = false

    async function loadReader() {
      setContinuousLockedEntry(null)
      setActiveEpisodeId(routeEpisodeId)
      setLoading(!hasExpectedLockedPreview)
      setMessage('')
      setAutoScrollEnabled(false)
      setReaderAdvertisement(null)
      setReaderAdFinished(false)
      setReaderGateReady(hasExpectedLockedPreview)
      setLockedEpisode(hasExpectedLockedPreview)

      if (hasExpectedLockedPreview) {
        setStory(expectedStory)
        setEpisode(expectedEpisode)
      }

      if (!isUsableRouteId(storyId) || !isUsableRouteId(routeEpisodeId)) {
        setLoading(false)
        setReaderGateReady(true)
        setMessage('Invalid reading link. Please open the episode from its story page.')
        return
      }

      if (!getReaderToken()) {
        navigate('/login', {
          state: {
            returnTo: `/story/${storyId}/episode/${routeEpisodeId}`,
          },
        })
        return
      }

      try {
        const [episodeResponse, episodesResponse] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/public/stories/${storyId}/episodes/${routeEpisodeId}`,
            {
              headers: readerAuthHeaders(),
              cache: 'no-store',
            }
          ),
          fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes`, {
            cache: 'no-store',
          }),
        ])

        const episodeData = await episodeResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Episode list not found')
        }

        const nextEpisodes = episodesData.episodes || []

        if (
          episodeResponse.status === 423 ||
          episodeData.code === 'EPISODE_LOCKED'
        ) {
          if (ignore) return

          setStory(episodeData.story || null)
          setEpisode(episodeData.episode || null)
          setEpisodes(nextEpisodes)
          setLockedEpisode(true)
          setReaderAdPolicy(null)
          setReaderAdvertisement(null)
          setReaderAdFinished(true)
          setReadingProgress(0)
          setReaderGateReady(true)

          try {
            await loadLockedUnlockStatus(routeEpisodeId)
          } catch {
            setUnlockWallet(null)
            setUnlockCoinAccess(null)
            setUnlockVoucherAccess(null)
            setUnlockPackageOptions([])
          }

          continuousReader.setInitialEntry({
            id: routeEpisodeId,
            episode: episodeData.episode,
            locked: true,
            gate: null,
            adFinished: true,
          })

          window.scrollTo({ top: 0, behavior: 'auto' })
          return
        }

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || 'Episode not found')
        }

        const nextReaderAdStatus = await loadReaderAdStatus(
          routeEpisodeId
        ).catch(() => ({
          ad_policy: null,
          advertisement: null,
        }))

        if (ignore) return

        const requiresAd = Boolean(
          nextReaderAdStatus.ad_policy?.show_read_ad &&
            nextReaderAdStatus.advertisement?.image_url
        )

        setStory(episodeData.story || null)
        setEpisode(episodeData.episode || null)
        setEpisodes(nextEpisodes)
        setLockedEpisode(false)
        setReaderAdPolicy(nextReaderAdStatus.ad_policy)
        setReaderAdvertisement(nextReaderAdStatus.advertisement)
        setReaderAdFinished(!requiresAd)
        setReadingProgress(0)
        setReaderGateReady(true)

        continuousReader.setInitialEntry({
          id: routeEpisodeId,
          episode: episodeData.episode,
          locked: false,
          gate: nextReaderAdStatus,
          adFinished: !requiresAd,
        })

        if (episodeData.episode?.is_adult && !adultConsentGranted) {
          setAdultAccepted(false)
          setAdultWarningOpen(true)
        } else {
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }

        window.scrollTo({ top: 0, behavior: 'auto' })
      } catch (error) {
        if (ignore) return

        setMessage(
          error.message === 'Failed to fetch'
            ? 'Cannot connect to server. Please try again later.'
            : error.message || 'Failed to load episode'
        )
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadReader()

    return () => {
      ignore = true
    }
  }, [
    continuousReader.setInitialEntry,
    expectedEpisode,
    expectedStory,
    hasExpectedLockedPreview,
    navigate,
    routeEpisodeId,
    storyId,
  ])

  useEffect(() => {
    if (readingMode === 'paging') return undefined

    const updateProgress = () => {
      const section = continuousReader.getSectionNode(episodeId)

      if (section) {
        const rect = section.getBoundingClientRect()
        const sectionTop = window.scrollY + rect.top
        const sectionHeight = Math.max(1, section.offsetHeight)
        const visibleOffset =
          window.scrollY + window.innerHeight * 0.35 - sectionTop
        const progress = Math.min(
          100,
          Math.max(0, (visibleOffset / sectionHeight) * 100)
        )

        setReadingProgress(progress)
        readingProgressRef.current = progress
        return
      }

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        scrollHeight > 0
          ? Math.min(
              100,
              Math.max(0, (scrollTop / scrollHeight) * 100)
            )
          : 100

      setReadingProgress(progress)
      readingProgressRef.current = progress
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, {
      passive: true,
    })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [
    continuousReader.entries.length,
    continuousReader.getSectionNode,
    episodeId,
    readingMode,
  ])

  useEffect(() => {
    if (!storyId || !episodeId || !episode || loading || !adultAccepted || qualifiedViewSentRef.current) {
      return undefined
    }

    const characterCount = Number(episode.character_count || episode.content?.length || 0)
    const isShortEpisode = characterCount > 0 && characterCount < 3000
    const requiredSeconds = isShortEpisode ? 10 : 20
    const progressRuleEnabled = false
    const requiredProgress = isShortEpisode ? 60 : 20
    let activeSeconds = 0

    async function sendQualifiedView() {
      if (qualifiedViewSentRef.current) return

      qualifiedViewSentRef.current = true

      await fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes/${episodeId}/view`, {
        method: 'POST',
        headers: readerAuthHeaders(),
      }).catch(() => {})
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      activeSeconds += 1

      const progressPassed = !progressRuleEnabled || readingProgressRef.current >= requiredProgress

      if (activeSeconds >= requiredSeconds && progressPassed) {
        window.clearInterval(timer)
        sendQualifiedView()
      }
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [adultAccepted, episode, episodeId, loading, storyId])

  useEffect(() => {
    let cancelled = false

    async function loadReadingTarget() {
      if (!storyId || !episodeId || loading || lockedEpisode || !adultAccepted) {
        return
      }

      try {
        const [missionsResponse, dailyResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tasks/reading-missions`, {
            headers: readerAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/tasks/reading-reward`, {
            headers: readerAuthHeaders(),
          }),
        ])

        const missionsData = await missionsResponse.json().catch(() => ({}))
        const dailyData = await dailyResponse.json().catch(() => ({}))

        if (cancelled) return

        const missions =
          missionsResponse.ok && missionsData.ok !== false
            ? missionsData.missions || []
            : []

        const readingReward =
          dailyResponse.ok && dailyData.ok !== false
            ? dailyData.reading_reward || null
            : null

        const nextTarget = resolveReadingTarget({
          missions,
          readingReward,
          storyId,
        })

        setActiveReadingTarget(nextTarget)
      } catch {
        if (!cancelled) setActiveReadingTarget(null)
      }
    }

    loadReadingTarget()

    return () => {
      cancelled = true
    }
  }, [
    adultAccepted,
    episodeId,
    loading,
    lockedEpisode,
    readingRewardReloadKey,
    storyId,
  ])


  useEffect(() => {
    if (!storyId || !episodeId || loading || lockedEpisode || !adultAccepted) {
      return undefined
    }

    readingActivityReadyAtRef.current = Date.now() + 1000

    const markReadingActivity = () => {
      if (Date.now() < readingActivityReadyAtRef.current) return
      lastReadingActivityRef.current = Date.now()
    }

    const handleKeyDown = (event) => {
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'ArrowLeft',
          'ArrowRight',
          'PageDown',
          'PageUp',
          ' ',
        ].includes(event.key)
      ) {
        markReadingActivity()
      }
    }

    window.addEventListener('scroll', markReadingActivity, { passive: true })
    window.addEventListener('wheel', markReadingActivity, { passive: true })
    window.addEventListener('touchmove', markReadingActivity, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', markReadingActivity)
      window.removeEventListener('wheel', markReadingActivity)
      window.removeEventListener('touchmove', markReadingActivity)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [adultAccepted, episodeId, loading, lockedEpisode, storyId])

  useEffect(() => {
    lastReadingActivityRef.current = 0
    readingActivityReadyAtRef.current = Date.now() + 1000
    previousReadingPageRef.current = null
    readingHeartbeatBusyRef.current = false
    setActiveReadingTarget(null)
    setReadingRewardAnimation(null)
  }, [episodeId, storyId])

  useEffect(() => {
    if (previousReadingPageRef.current === null) {
      previousReadingPageRef.current = currentPageIndex
      return
    }

    if (previousReadingPageRef.current !== currentPageIndex) {
      lastReadingActivityRef.current = Date.now()
    }

    previousReadingPageRef.current = currentPageIndex
  }, [currentPageIndex])

  useEffect(() => {
    return () => {
      if (rewardAnimationTimerRef.current) {
        window.clearTimeout(rewardAnimationTimerRef.current)
      }
    }
  }, [])

  
  useEffect(() => {
  if (!storyId || !episodeId || !episode || loading || lockedEpisode || !adultAccepted) {
    return undefined
  }

  const timer = window.setInterval(async () => {
    if (readingHeartbeatBusyRef.current || document.visibilityState !== 'visible') return

    const recentlyActive =
      Date.now() - lastReadingActivityRef.current <= READING_ACTIVITY_GRACE_MS

    if (!recentlyActive && !autoScrollEnabled) return
    if (!activeReadingTargetRef.current?.id) return

    readingHeartbeatBusyRef.current = true

    try {
      const progressResponse = await fetch(
        `${API_BASE_URL}/api/tasks/reading-session/progress`,
        {
          method: 'POST',
          headers: {
            ...readerAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            story_id: storyId,
            episode_id: episodeId,
            seconds: READING_PROGRESS_STEP_SECONDS,
          }),
        }
      )

      const progressData = await progressResponse.json().catch(() => ({}))

      if (!progressResponse.ok || progressData.ok === false) return

      const missionIds = Array.isArray(progressData.claimable?.mission_ids)
        ? progressData.claimable.mission_ids.filter(Boolean)
        : []

      const dailyCoins = Math.max(
        0,
        Number(progressData.claimable?.daily_coins || 0)
      )

      let totalClaimedCoins = 0
      let needsReload = false

      if (dailyCoins > 0) {
        const dailyClaimResponse = await fetch(
          `${API_BASE_URL}/api/tasks/reading-reward/claim`,
          {
            method: 'POST',
            headers: {
              ...readerAuthHeaders(),
              'Content-Type': 'application/json',
            },
          }
        )

        const dailyClaimData = await dailyClaimResponse.json().catch(() => ({}))

        if (dailyClaimResponse.ok && dailyClaimData.ok !== false) {
          totalClaimedCoins += Math.max(
            0,
            Number(
              dailyClaimData.reward?.coins ||
                dailyClaimData.reward?.gems ||
                dailyCoins
            )
          )
        } else {
          needsReload = true
        }
      }

      for (const missionId of missionIds) {
        const missionClaimResponse = await fetch(
          `${API_BASE_URL}/api/tasks/reading-missions/${missionId}/claim`,
          {
            method: 'POST',
            headers: {
              ...readerAuthHeaders(),
              'Content-Type': 'application/json',
            },
          }
        )

        const missionClaimData = await missionClaimResponse.json().catch(() => ({}))

        if (missionClaimResponse.ok && missionClaimData.ok !== false) {
          totalClaimedCoins += Math.max(
            0,
            Number(
              missionClaimData.reward?.coins ||
                missionClaimData.reward?.gems ||
                0
            )
          )
        } else {
          needsReload = true
        }
      }

      if (totalClaimedCoins > 0) {
        activeReadingTargetRef.current = null
        setActiveReadingTarget(null)
        showReadingRewardAnimation(totalClaimedCoins)
        return
      }

      const nextTarget = resolveReadingTarget({
        missions: progressData.missions || [],
        readingReward: progressData.reading_reward || null,
        storyId,
      })

      activeReadingTargetRef.current = nextTarget
      setActiveReadingTarget(nextTarget)

      if (needsReload) {
        setReadingRewardReloadKey((value) => value + 1)
      }
    } finally {
      readingHeartbeatBusyRef.current = false
    }
  }, READING_PROGRESS_STEP_SECONDS * 1000)

  return () => {
    window.clearInterval(timer)
  }
}, [
  adultAccepted,
  autoScrollEnabled,
  episode,
  episodeId,
  loading,
  lockedEpisode,
  storyId,
])
      


useEffect(() => {
  setReaderHeaderVisible(Boolean(lockedEpisode))
  setBottomActionsVisible(false)
  lastScrollYRef.current = window.scrollY || document.documentElement.scrollTop

  const handleActionBarVisibility = () => {
    if (lockedEpisode) {
  setReaderHeaderVisible(true)
  return
}
  const currentScrollY = window.scrollY || document.documentElement.scrollTop
  const previousScrollY = lastScrollYRef.current
  const difference = currentScrollY - previousScrollY
  const scrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const scrolledPercent = Math.min(100, Math.max(0, (currentScrollY / scrollHeight) * 100))

  if (Math.abs(difference) < 8) return

  setReaderHeaderVisible(false)
  setBottomActionsVisible(false)
  setReaderDoubleTapVisible(false)

  const shouldShowSubscribe =
    !subscribed &&
    !scrollSubscribeDismissed &&
    currentScrollY > 30 &&
    (difference < 0 || (difference > 0 && scrolledPercent >= 70))

  if (shouldShowSubscribe) {
    setScrollSubscribePopupVisible(true)
  }

  lastScrollYRef.current = Math.max(0, currentScrollY)
}

  window.addEventListener('scroll', handleActionBarVisibility, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleActionBarVisibility)
  }
}, [episodeId, lockedEpisode, scrollSubscribeDismissed, subscribed])

  useEffect(() => {
    if (!storyId || !episodeId || reviewProgressSaved) return

    if (readingProgress >= REVIEW_READ_PROGRESS_PERCENT) {
      saveReviewReadEpisode(storyId, episodeId)
      setReviewProgressSaved(true)
    }
  }, [episodeId, readingProgress, reviewProgressSaved, storyId])

  useEffect(() => {
    if (autoScrollFrameRef.current) {
      cancelAnimationFrame(autoScrollFrameRef.current)
      autoScrollFrameRef.current = null
    }

    if (readingMode !== 'scroll' || !autoScrollEnabled || loading || settingsOpen || fontSelectOpen || resetOpen || episodeListOpen || !adultAccepted) {
      return undefined
    }

    const scrollStep = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

      if (scrollHeight <= 0 || window.scrollY >= scrollHeight - 4) {
        setAutoScrollEnabled(false)
        return
      }

      window.scrollBy({
        top: AUTO_SCROLL_SPEEDS[autoScrollSpeed]?.value || AUTO_SCROLL_SPEEDS[1].value,
        behavior: 'auto',
      })

      autoScrollFrameRef.current = requestAnimationFrame(scrollStep)
    }

    autoScrollFrameRef.current = requestAnimationFrame(scrollStep)

    return () => {
      if (autoScrollFrameRef.current) {
        cancelAnimationFrame(autoScrollFrameRef.current)
        autoScrollFrameRef.current = null
      }
    }
  }, [adultAccepted, autoScrollEnabled, autoScrollSpeed, episodeListOpen, fontSelectOpen, loading, readingMode, resetOpen, settingsOpen])

  const sortedReaderEpisodes = useMemo(() => {
    return [...episodes].sort(
      (a, b) =>
        Number(a.episode_number || 0) -
        Number(b.episode_number || 0)
    )
  }, [episodes])

  const currentReaderEpisodeIndex = sortedReaderEpisodes.findIndex(
    (item) => String(item.id) === String(episodeId)
  )

  const previousEpisode =
    currentReaderEpisodeIndex > 0
      ? sortedReaderEpisodes[currentReaderEpisodeIndex - 1]
      : null

  const nextEpisode =
    currentReaderEpisodeIndex >= 0 &&
    currentReaderEpisodeIndex < sortedReaderEpisodes.length - 1
      ? sortedReaderEpisodes[currentReaderEpisodeIndex + 1]
      : null

  const openReaderEpisode = async (targetEpisode) => {
    if (!targetEpisode) return

    if (readingMode === 'scroll') {
      await continuousReader.scrollToEpisode(targetEpisode)
      return
    }

    navigate(`/story/${storyId}/episode/${targetEpisode.id}`, {
      replace: true,
      state: {
        storyPreview: story,
        episodePreview: targetEpisode,
        returnSource: location.state?.returnSource,
      },
    })
  }

  const cover = episode?.cover_url || story?.cover_url || ''
  const publishedDate = formatDate(episode?.published_at)
  const characterCount = Number(
    episode?.character_count || episode?.content?.length || 0
  )
  const isLastReadingPage =
    readingMode !== 'paging' ||
    currentPageIndex >= Math.max(0, pagingPages.length - 1)

const handleReaderCopyLink = async () => {
  const link = window.location.href

  try {
    await navigator.clipboard.writeText(link)
  } catch {
    window.prompt('Copy this link:', link)
  }

  setReaderMoreOpen(false)
}

const handleReaderReport = () => {
  setReaderMoreOpen(false)
  window.alert('Report is coming soon.')
}

const handleReaderEcho = () => {
  setReaderMoreOpen(false)
  setEchoShareOpen(true)
}

  const handlePrevious = () => {
    openReaderEpisode(previousEpisode)
  }

  const handleNext = () => {
    openReaderEpisode(nextEpisode)
  }

const handleOpenPurchasePage = (
  targetEpisodeId = episodeId
) => {
  navigate('/shop', {
    state: {
      activeTab: 'Purchase',
      from: `/story/${storyId}/episode/${targetEpisodeId}`,
    },
  })
}

async function loadLockedUnlockStatus(
  targetEpisodeId = episodeId
) {
  if (!storyId || !targetEpisodeId) return null

  const response = await fetch(
    `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/status`,
    {
      headers: readerAuthHeaders(),
      cache: 'no-store',
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || 'Failed to check unlock status'
    )
  }

  setUnlockWallet(data.wallet || null)
  setUnlockCoinAccess(
    data.coin_access || data.gem_access || null
  )
  setUnlockVoucherAccess(data.voucher_access || null)
  setUnlockAutoUnlock(
    Boolean(data.wallet?.auto_unlock)
  )
  setUnlockPackageOptions(
    Array.isArray(data.package_options)
      ? data.package_options
      : []
  )

  return data
}

async function handleLockedCoinUnlock(
  targetEpisodeId = episodeId,
  targetWallet = unlockWallet,
  targetCoinAccess = unlockCoinAccess
) {
  if (!targetCoinAccess?.available) return

  const coinBalance = Number(
    targetWallet?.coin_balance ??
      targetWallet?.gem_balance ??
      0
  )
  const price = Number(targetCoinAccess?.amount || 0)

  if (coinBalance < price) {
    setMessage('Not enough Coins.')
    return
  }

  try {
    setUnlockingEpisode(true)

    const response = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/gem`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message ||
          'Failed to unlock episode with Coins'
      )
    }

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend.'
        : error.message ||
            'Failed to unlock episode with Coins'
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

async function handleLockedVoucherUnlock(
  targetEpisodeId = episodeId,
  targetWallet = unlockWallet,
  targetVoucherAccess = unlockVoucherAccess
) {
  if (!targetVoucherAccess?.available) return

  const voucherBalance = Number(
    targetWallet?.voucher_balance || 0
  )
  const price = Number(targetVoucherAccess?.amount || 0)

  if (voucherBalance < price) {
    setMessage('Not enough Vouchers.')
    return
  }

  try {
    setUnlockingEpisode(true)

    const response = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/voucher`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message ||
          'Failed to unlock episode with Voucher'
      )
    }

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend.'
        : error.message ||
            'Failed to unlock episode with Voucher'
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

async function handleLockedDiamondUnlock(
  packageKey,
  targetEpisodeId = episodeId,
  targetPackageOptions = unlockPackageOptions,
  targetWallet = unlockWallet
) {
  const options = Array.isArray(targetPackageOptions)
    ? targetPackageOptions
    : []
  const option = options.find(
    (item) => item.key === packageKey
  )
  const diamondBalance = Number(
    targetWallet?.diamond_balance || 0
  )
  const price = Number(option?.price || 0)

  if (!option?.enabled) return

  if (diamondBalance < price) {
    handleOpenPurchasePage(targetEpisodeId)
    return
  }

  try {
    setUnlockingEpisode(true)

    const response = await fetch(
      `${API_BASE_URL}/api/unlocks/stories/${storyId}/episodes/${targetEpisodeId}/package`,
      {
        method: 'POST',
        headers: {
          ...readerAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_key: packageKey,
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      if (data.code === 'INSUFFICIENT_DIAMONDS') {
        navigate('/shop/mall/purchase', {
          state: {
            returnTo: `/story/${storyId}/episode/${targetEpisodeId}`,
          },
        })
        return
      }

      throw new Error(
        data.message || 'Failed to unlock episode'
      )
    }

    window.history.replaceState(
      window.history.state,
      '',
      `/story/${storyId}/episode/${targetEpisodeId}`
    )
    window.location.reload()
  } catch (error) {
    setMessage(
      error.message === 'Failed to fetch'
        ? 'Cannot connect to backend.'
        : error.message ||
            'Failed to unlock episode'
    )
  } finally {
    setUnlockingEpisode(false)
  }
}

  const handleResetSettings = () => {
    setFontSizeIndex(DEFAULT_FONT_SIZE_INDEX)
    setFontKey('noto-sans-khmer')
    setThemeName('white')
    setBrightness(100)
    setLineSpacing('comfort')
    setReadingMode('scroll')
    setAutoScrollEnabled(false)
    setAutoScrollSpeed(1)
    setResetOpen(false)
  }


  const handleCommentChanged = () => {
    setCommentRefreshKey((value) => value + 1)
  }

function showReadingRewardAnimation(coins) {
  const rewardCoins = Math.max(0, Number(coins || 0))

  if (rewardCoins <= 0) return

  setReaderHeaderVisible(true)
  setBottomActionsVisible(true)
  setReaderDoubleTapVisible(true)
  setScrollSubscribePopupVisible(false)

  setReadingRewardAnimation({
    key: Date.now(),
    coins: rewardCoins,
  })

  if (rewardAnimationTimerRef.current) {
    window.clearTimeout(rewardAnimationTimerRef.current)
  }

  rewardAnimationTimerRef.current = window.setTimeout(() => {
    setReadingRewardAnimation(null)
    setReadingRewardReloadKey((value) => value + 1)
  }, 1700)
}

const shouldShowReaderAd = readerGateReady && episode && adultAccepted && !lockedEpisode && readerAdPolicy?.show_read_ad && readerAdvertisement?.image_url
const shouldBlockReaderContent = shouldShowReaderAd && !readerAdFinished

const openContinuousLockedEpisode = (lockedEntry) => {
  const targetId = String(
    lockedEntry?.id || lockedEntry?.episode?.id || ''
  ).trim()

  if (!targetId || !lockedEntry?.episode) return

  setContinuousLockedEntry(lockedEntry)

  const unlock = lockedEntry.unlockStatus || {}
  const nextPath = `/story/${storyId}/episode/${targetId}`

  setActiveEpisodeId(targetId)
  setEpisode(lockedEntry.episode)
  setLockedEpisode(true)
  setReadingProgress(0)
  readingProgressRef.current = 0
  setReaderAdPolicy(null)
  setReaderAdvertisement(null)
  setReaderAdFinished(true)
  setReaderGateReady(true)
  setReaderMoreOpen(false)
  setBottomActionsVisible(false)
  setReaderDoubleTapVisible(false)
  setScrollSubscribePopupVisible(false)
  setCommentEpisode(null)
  setUnlockWallet(unlock.wallet || null)
  setUnlockCoinAccess(
    unlock.coin_access || unlock.gem_access || null
  )
  setUnlockVoucherAccess(unlock.voucher_access || null)
  setUnlockPackageOptions(
    Array.isArray(unlock.package_options)
      ? unlock.package_options
      : []
  )
  setUnlockAutoUnlock(Boolean(unlock.wallet?.auto_unlock))

  if (window.location.pathname !== nextPath) {
    window.history.replaceState(
      window.history.state,
      '',
      nextPath
    )
  }

  if (!unlock.wallet) {
    loadLockedUnlockStatus(targetId).catch(() => {})
  }
}

const showFullLockedEpisode = Boolean(
  lockedEpisode && episode && !continuousLockedEntry
)
const showContinuousLockedEpisode = Boolean(
  continuousLockedEntry?.episode
)
const lockedHeaderActive =
  showFullLockedEpisode || showContinuousLockedEpisode
const activeCommentsEpisode = commentEpisode || episode

const readerControlsVisible =
  readerHeaderVisible &&
  bottomActionsVisible &&
  !lockedEpisode &&
  !loading &&
  adultAccepted &&
  Boolean(episode) &&
  !shouldBlockReaderContent &&
  !echoShareOpen &&
  !settingsOpen &&
  !fontSelectOpen &&
  !resetOpen &&
  !episodeListOpen &&
  !commentsOpen

  const showReadingRewardCoin =
  Boolean(readingRewardAnimation) ||
  Boolean(
    activeReadingTarget?.id &&
    !lockedEpisode &&
    !loading &&
    adultAccepted &&
    episode &&
    !shouldBlockReaderContent &&
    !echoShareOpen &&
    !settingsOpen &&
    !fontSelectOpen &&
    !resetOpen &&
    !episodeListOpen &&
    !commentsOpen
  )


return (
    <div className="min-h-screen bg-[#FFFFFF] pb-[110px]">
      

      {readingMode === 'scroll' && autoScrollEnabled ? (
        <button
          type="button"
          onClick={() => setAutoScrollEnabled(false)}
          className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-[12px] font-black text-white shadow-2xl active:scale-95"
        >
          <i className="fa-solid fa-pause text-[11px]" />
          Pause Auto Scroll
        </button>
      ) : null}

      {!lockedHeaderActive ? (
  <div className="fixed left-0 right-0 top-0 z-[70] h-1 bg-black/5">
    <div
      className="h-full bg-[#0b5cff] transition-all duration-150"
      style={{ width: `${readingProgress}%` }}
    />
  </div>
) : null}

      <AdultWarningModal
        open={adultWarningOpen}
        onCancel={() => navigate(`/story/${storyId}`, { replace: true })}
        onContinue={() => {
          setAdultConsentGranted(true)
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }}
      />

      <ResetSettingsModal
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={handleResetSettings}
      />

      <FontSelectDrawer
        open={fontSelectOpen}
        onClose={() => setFontSelectOpen(false)}
        selectedFontKey={fontKey}
        onSelect={setFontKey}
      />

      <ReaderSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        themeName={themeName}
        setThemeName={setThemeName}
        fontSizeIndex={fontSizeIndex}
        setFontSizeIndex={setFontSizeIndex}
        fontKey={fontKey}
        setFontKey={setFontKey}
        selectedFont={activeFont}
        brightness={brightness}
        setBrightness={setBrightness}
        lineSpacing={lineSpacing}
        setLineSpacing={setLineSpacing}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        autoScrollEnabled={autoScrollEnabled}
        setAutoScrollEnabled={setAutoScrollEnabled}
        autoScrollSpeed={autoScrollSpeed}
        setAutoScrollSpeed={setAutoScrollSpeed}
        onOpenFontList={() => setFontSelectOpen(true)}
        onOpenReset={() => setResetOpen(true)}
      />

      <EpisodeListDrawer
  open={episodeListOpen}
  onClose={() => setEpisodeListOpen(false)}
  story={story}
  episodes={episodes}
  currentEpisodeId={episodeId}
  storyId={storyId}
  navigate={(to, options = {}) =>
    navigate(to, {
      ...options,
      replace: true,
    })
  }
  theme={theme}
/>

      <EchoShareSheet
  open={echoShareOpen}
  story={story}
  episode={episode}
  onClose={() => setEchoShareOpen(false)}
/>
      <CommentsModal
  open={commentsOpen}
  story={story}
  targetType="episode"
  targetId={activeCommentsEpisode?.id || episodeId}
  episodes={episodes}
  title={
    activeCommentsEpisode?.title ||
    story?.title ||
    'Comments'
  }
  onClose={() => {
    setCommentsOpen(false)
    setCommentEpisode(null)
  }}
  onCommentChanged={handleCommentChanged}
  key={`${storyId}-${activeCommentsEpisode?.id || episodeId}`}
/>

      <GiftPopup
  open={giftPopupOpen}
  storyId={storyId}
  onClose={() => setGiftPopupOpen(false)}
  onOpenGuide={() => {
    sessionStorage.setItem('shadow_reopen_gift_popup', '1')
    navigate('/gift-guide')
  }}
  onOpenTopFans={() => {
    setGiftPopupOpen(false)
    navigate(`/story/${storyId}/top-fans`, {
      state: {
        storyPreview: story,
        from: `/story/${storyId}/episode/${episodeId}`,
      },
    })
  }}
/>
      {shouldShowReaderAd && !readerAdFinished ? (
  <AdvertisementPopup
  placement="freeUnlock"
  blocking
  advertisementOverride={readerAdvertisement}
  key={`freeUnlock-${storyId}-${episodeId}`}
  onFinish={() => {
    setReaderAdFinished(true)
    continuousReader.markAdFinished(episodeId)
  }}
/>
) : null}

     {shouldBlockReaderContent ? (
  <div className="fixed inset-0 z-[2147483646] bg-black" />
) : null}

<ScrollSubscribePopup
  visible={scrollSubscribePopupVisible}
  storyId={storyId}
  readingProgress={readingProgress}
  subscribed={subscribed}
  onSubscribe={handleSubscribe}
  onClose={() => {
    setScrollSubscribePopupVisible(false)
    setScrollSubscribeDismissed(true)
  }}
/>
      
     <ReaderBottomActionBar
  visible={bottomActionsVisible && !lockedEpisode && !echoShareOpen && !settingsOpen && !fontSelectOpen && !resetOpen && !episodeListOpen && !commentsOpen && adultAccepted && !loading && Boolean(episode) && !shouldBlockReaderContent}
  theme={theme}
  subscribed={subscribed}
  onSubscribe={handleSubscribe}
  story={story}
  episode={episode}
  commentRefreshKey={commentRefreshKey}
  readingProgress={readingProgress}
  previousEpisode={previousEpisode}
  nextEpisode={nextEpisode}
  onPrevious={() => openReaderEpisode(previousEpisode)}
  onNext={() => openReaderEpisode(nextEpisode)}
  showSubscribeOnDoubleTap={readerDoubleTapVisible}
  onOpenChapters={() => setEpisodeListOpen(true)}
  onOpenComments={() => {
    setCommentEpisode(episode)
    setCommentsOpen(true)
  }}
  onOpenSettings={() => setSettingsOpen(true)}
/>

<WebcomicReadingMissionCoin
  visible={showReadingRewardCoin}
  target={activeReadingTarget}
  rewardAnimation={readingRewardAnimation}
  onClick={() => navigate('/tasks')}
/>

      <header
  className={`${readerHeaderVisible ? 'translate-y-0' : '-translate-y-full'} fixed left-0 right-0 top-0 z-50 border-b px-4 py-3 transition-transform duration-300 ease-out ${
    lockedHeaderActive
      ? 'border-[#111111] bg-[#111111]'
      : 'border-[#F2F2F2] bg-[#FFFFFF]'
  }`}
>
  <div className="mx-auto flex max-w-3xl items-center justify-between">
    <ReaderIconButton
      icon="fa-solid fa-chevron-left"
      label="Back to story"
      onClick={() => {
        const returnSource = location.state?.returnSource

        navigate(`/story/${storyId}`, {
          replace: true,
          state: {
            reopenEpisodeList: returnSource === 'modal',
          },
        })
      }}
      className={lockedHeaderActive ? '!text-white' : theme.text}
    />

    <div className="min-w-0 flex-1 px-3 text-center">
  {lockedHeaderActive ? (
    <h1 className="line-clamp-1 text-[14.5px] font-extrabold text-white">
      {continuousLockedEntry?.episode?.title ||
        episode?.title ||
        'Untitled Episode'}
    </h1>
  ) : (
    <h1 className={`line-clamp-1 text-[14.5px] font-extrabold ${theme.text}`}>
      {story?.title || 'Reader'}
    </h1>
  )}
</div>

    <div className="relative">
  {!lockedHeaderActive ? (
    <>
      <ReaderIconButton
        icon="fa-solid fa-ellipsis-vertical"
        label="More options"
        onClick={() => setReaderMoreOpen((value) => !value)}
        className={theme.text}
      />

      {readerMoreOpen ? (
        <div className="absolute right-0 top-10 z-[80] w-[158px] overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white shadow-[0_12px_30px_rgba(17,24,39,0.16)]">
          <button
            type="button"
            onClick={handleReaderReport}
            className="flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-semibold text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-regular fa-flag w-4 text-center text-[14px] text-[#667085]" />
            <span>Report</span>
          </button>

          <button
            type="button"
            onClick={handleReaderCopyLink}
            className="flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-semibold text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-link w-4 text-center text-[14px] text-[#667085]" />
            <span>Copy link</span>
          </button>

          <button
            type="button"
            onClick={handleReaderEcho}
            className="flex h-11 w-full items-center gap-3 px-3 text-left text-[13px] font-semibold text-[#111827] active:bg-[#f3f4f6]"
          >
            <i className="fa-solid fa-rotate w-4 text-center text-[14px] text-[#667085]" />
            <span>Echo</span>
          </button>
        </div>
      ) : null}
    </>
  ) : (
    <span className="block h-10 w-10" aria-hidden="true" />
  )}
</div>
  </div>
</header>

      <main
  onClick={handleReaderDoubleTap}
        className="mx-auto max-w-3xl bg-[#FFFFFF] px-0 pb-[92px] pt-[50px] sm:px-4"
      >
        {loading ? <LoadingCard /> : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && showFullLockedEpisode ? (
  <LockedEpisodeCard
  theme={theme}
  story={story}
  episode={episode}
  wallet={unlockWallet}
  coinAccess={unlockCoinAccess}
  voucherAccess={unlockVoucherAccess}
  packageOptions={unlockPackageOptions}
  autoUnlock={unlockAutoUnlock}
  setAutoUnlock={setUnlockAutoUnlock}
  showAutoHint={unlockAutoHintOpen}
  setShowAutoHint={setUnlockAutoHintOpen}
  unlocking={unlockingEpisode}
onPurchase={handleOpenPurchasePage}
onUnlock={handleLockedDiamondUnlock}
  onCoinUnlock={handleLockedCoinUnlock}
  onVoucherUnlock={handleLockedVoucherUnlock}
/>
) : null}

        {!loading && showContinuousLockedEpisode ? (
          <ContinuousLockedEpisodeCard
            story={story}
            episode={continuousLockedEntry.episode}
            wallet={
              continuousLockedEntry.unlockStatus?.wallet ||
              unlockWallet
            }
            packageOptions={
              Array.isArray(
                continuousLockedEntry.unlockStatus?.package_options
              )
                ? continuousLockedEntry.unlockStatus.package_options
                : unlockPackageOptions
            }
            autoUnlock={unlockAutoUnlock}
            setAutoUnlock={setUnlockAutoUnlock}
            unlocking={unlockingEpisode}
            onPurchase={() =>
              handleOpenPurchasePage(continuousLockedEntry.id)
            }
            onUnlock={(packageKey) =>
              handleLockedDiamondUnlock(
                packageKey,
                continuousLockedEntry.id,
                Array.isArray(
                  continuousLockedEntry.unlockStatus?.package_options
                )
                  ? continuousLockedEntry.unlockStatus.package_options
                  : unlockPackageOptions,
                continuousLockedEntry.unlockStatus?.wallet ||
                  unlockWallet
              )
            }
          />
        ) : null}

        {!loading &&
        !showFullLockedEpisode &&
        !showContinuousLockedEpisode &&
        readingMode === 'scroll' ? (
          <div>
            {continuousReader.entries.map((entry, index) => (
              <ContinuousEpisodeBlock
                key={entry.id}
                entry={entry}
                index={index}
                active={String(entry.id) === String(episodeId)}
                theme={theme}
                story={story}
                fontSizePx={fontSizePx}
                fontFamily={activeFont.family}
                lineSpacing={lineSpacing}
                onRegister={continuousReader.registerSection}
                onOpenComments={(targetEpisode) => {
                  setCommentEpisode(targetEpisode)
                  setCommentsOpen(true)
                }}
                onOpenGift={() => setGiftPopupOpen(true)}
                adultAccepted={adultConsentGranted}
                onReachLocked={openContinuousLockedEpisode}
              />
            ))}
          </div>
        ) : null}

        {!loading && readingMode === 'paging' && episode && adultAccepted && !lockedEpisode && !shouldBlockReaderContent ? (
          <>
            <section className={`overflow-hidden rounded-none ${theme.card} shadow-none ring-0 sm:rounded-[28px] sm:shadow-sm sm:ring-1 sm:ring-black/5`}>
              {SHOW_READER_COVER && cover ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111827]">
                  <img src={cover} alt={episode.title} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-[24px] font-extrabold leading-8 text-white sm:text-[30px] sm:leading-10">
                      {episode.title || 'Untitled Episode'}
                    </h2>

                    {story?.title ? (
                      <div className="mt-1 text-[12px] font-bold text-white/75">
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="px-4 py-5 sm:p-8">
                {SHOW_READER_COVER && !cover ? (
                  <div className={`mb-7 border-b ${theme.border} pb-6`}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`${theme.soft} ${theme.muted} rounded-full px-3 py-1.5 text-[11px] font-extrabold`}>
                        EP {episode.episode_number || 1}
                      </span>

                      {episode.is_adult ? (
                        <span className="rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                          18+
                        </span>
                      ) : null}
                    </div>

                    <h2 className={`text-[26px] font-extrabold leading-10 ${theme.text}`}>
                      {episode.title || 'Untitled Episode'}
                    </h2>

                    {story?.title ? (
                      <div className={`mt-1 text-[12px] font-bold ${theme.muted}`}>
                        {story.title}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {SHOW_READER_INFO ? (
                  <div className={`mb-7 grid grid-cols-2 gap-2 rounded-[22px] ${theme.soft} p-3 sm:grid-cols-4`}>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Episode</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>EP {episode.episode_number || 1}</div>
                    </div>

                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Length</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{characterCount.toLocaleString()} chars</div>
                    </div>

                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Mode</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{READER_THEMES[themeName]?.name || themeName}</div>
                    </div>

                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-[0.08em] ${theme.muted}`}>Published</div>
                      <div className={`mt-1 text-[13px] font-extrabold ${theme.text}`}>{publishedDate || 'New'}</div>
                    </div>
                  </div>
                ) : null}

<div className="mb-7">
  <h1
       className={`text-[30px] font-bold leading-[1.35] tracking-[-0.01em] ${theme.text} sm:text-[34px]`}
    style={{ fontFamily: activeFont.family }}
  >
    {episode.title || 'Untitled Episode'}
  </h1>
</div>

                <article>
                  {readingMode === 'paging' ? (
  <PagingReadingText
    pages={pagingPages}
    pageIndex={currentPageIndex}
    setPageIndex={setCurrentPageIndex}
    fontSizePx={fontSizePx}
    fontFamily={activeFont.family}
    lineSpacing={lineSpacing}
    theme={theme}
    onReadingActivity={() => {
      lastReadingActivityRef.current = Date.now()
    }}
  />
) : (
  <ReadingText
    content={episode.content}
    fontSizePx={fontSizePx}
    fontFamily={activeFont.family}
    lineSpacing={lineSpacing}
    theme={theme}
  />
)}
                </article>
              </div>
            </section>

            {isLastReadingPage ? (
  <>
    <ReaderEndPanel
      story={story}
      episode={episode}
      onOpenComments={() => {
    setCommentEpisode(episode)
    setCommentsOpen(true)
  }}
      onOpenGift={() => setGiftPopupOpen(true)}
    />
  </>
) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
