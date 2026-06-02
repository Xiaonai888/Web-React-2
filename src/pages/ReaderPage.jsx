import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommentsModal from '../components/story-detail/CommentsModal'
import ReaderBottomActionBar from '../components/reader/ReaderBottomActionBar'
import EchoShareSheet from '../components/reader/EchoShareSheet'

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

const REVIEW_READ_PROGRESS_PERCENT = 85
const PAGING_LINES_PER_PAGE = 20

const PAGING_CHARACTERS_PER_LINE = {
  compact: 42,
  normal: 39,
  comfort: 36,
}

const READER_THEMES = {
  light: {
    name: 'White',
    page: 'bg-white',
    card: 'bg-white',
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

function PagingReadingText({ pages, pageIndex, setPageIndex, fontSizePx, fontFamily, lineSpacing, theme }) {
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

  const showFlash = (direction) => {
    if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current)
    setFlashDirection(direction)
    flashTimerRef.current = window.setTimeout(() => setFlashDirection(''), 260)
  }

  const goPrevious = () => {
    if (!canGoPrevious) return
    showFlash('left')
    setPageIndex((current) => Math.max(0, current - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goNext = () => {
    if (!canGoNext) return
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
        role="button"
        tabIndex={0}
        className="relative min-h-[68vh]"
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') goPrevious()
          if (event.key === 'ArrowRight') goNext()
        }}
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

function ReaderIconButton({ icon, label, onClick, className = '', disabled = false }) {

  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      aria-label={label}
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function LoadingCard() {
  return (
    <section className="rounded-[24px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
      <div className="text-[13px] font-bold text-[#667085]">Loading episode...</div>
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

function EpisodeListDrawer({ open, onClose, episodes, currentEpisodeId, storyId, navigate, theme }) {
  const [newestFirst, setNewestFirst] = useState(false)

  if (!open) return null

  const sortedEpisodes = [...episodes].sort((a, b) => {
    const first = Number(a.episode_number || 0)
    const second = Number(b.episode_number || 0)
    return newestFirst ? second - first : first - second
  })

  return (
    <div className="fixed inset-0 z-[140]">
      <button
        type="button"
        aria-label="Close episode list"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />

      <section className={`absolute bottom-0 left-0 right-0 max-h-[78vh] overflow-hidden rounded-t-[30px] ${theme.card} shadow-2xl md:left-auto md:right-5 md:top-20 md:h-auto md:w-[380px] md:rounded-[26px]`}>
        <div className={`sticky top-0 z-10 border-b ${theme.border} ${theme.card} px-4 py-4`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className={`text-[17px] font-extrabold ${theme.text}`}>Episode List</h3>
              <p className={`mt-0.5 text-[11.5px] font-semibold ${theme.muted}`}>
                {episodes.length} published episodes
              </p>
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

        <div className="max-h-[62vh] space-y-2 overflow-y-auto p-4">
          {sortedEpisodes.map((item) => {
            const active = item.id === currentEpisodeId

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose()
                  navigate(`/story/${storyId}/episode/${item.id}`)
                }}
                className="flex w-full items-center gap-3 px-1 py-3 text-left transition active:scale-[0.995]"
              >
                <span className={`line-clamp-1 flex-1 text-[14px] font-extrabold ${
  active ? 'text-[#f6a800]' : theme.text
}`}>
  {item.title || 'Untitled Episode'}
</span>

                {item.is_adult ? (
                  <span className="rounded-full bg-[#fff1f1] px-2 py-1 text-[10px] font-extrabold text-[#e5484d]">
                    18+
                  </span>
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
      <h3 className="mb-3 text-[14px] font-black text-[#111827]">{title}</h3>
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
                      <span className="line-clamp-1 text-[14px] font-extrabold" style={{ fontFamily: font.family }}>
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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Back to reader settings"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="text-[15px] font-black text-[#111827]">More Setting</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
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
                    className="flex h-10 items-center justify-center rounded-[15px] bg-[#f0eef6] text-[14px] font-black text-[#111827] active:scale-[0.98] disabled:opacity-40"
                    aria-label="Decrease font size"
                  >
                    A<sup className="-mt-2 text-[10px]">−</sup>
                  </button>

                  <div className="min-w-[34px] text-center text-[13px] font-black text-[#8d94a1]">
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
                    <i className="fa-solid fa-text-height text-[13px]" />
                    <i className="fa-solid fa-minus ml-1 text-[9px]" />
                  </button>

                  <div className="min-w-[34px] text-center text-[13px] font-black text-[#8d94a1]">
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
                  className={`relative rounded-[16px] border p-2 text-center active:scale-[0.98] ${
                    themeName === key ? 'border-[#111827] bg-[#f5f3fa]' : 'border-[#e4e7ec] bg-white'
                  }`}
                >
                  <span className={`mx-auto block h-9 rounded-[12px] border border-black/10 ${item.swatch}`} />
                  <span className="mt-2 block text-[10.5px] font-extrabold text-[#111827]">{item.name}</span>
                  {themeName === key ? (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#111827] text-white">
                      <i className="fa-solid fa-check text-[9px]" />
                    </span>
                  ) : null}
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
              <span className="line-clamp-1 text-[14px] font-black text-[#111827]" style={{ fontFamily: selectedFont.family }}>
                {selectedFont.label}
              </span>
              <i className="fa-solid fa-chevron-right text-[12px] text-[#8d94a1]" />
            </button>
          </SettingSection>

         <section className="px-2 py-3 text-center">
  <button
    type="button"
    onClick={() => setMoreSettingsOpen(true)}
    className="text-[13px] font-black text-[#8d94a1] active:scale-[0.98]"
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

export default function ReaderPage() {
  const navigate = useNavigate()
  const { storyId, episodeId } = useParams()
  const autoScrollFrameRef = useRef(null)
  const qualifiedViewSentRef = useRef(false)
  const readingProgressRef = useRef(0)

  const [story, setStory] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [fontSizeIndex, setFontSizeIndex] = useState(getInitialFontSizeIndex)
  const [fontKey, setFontKey] = useState(() => localStorage.getItem('reader_font_key') || 'noto-sans-khmer')
  const [themeName, setThemeName] = useState(() => localStorage.getItem('reader_theme') || 'paper')
  const [brightness, setBrightness] = useState(() => Number(localStorage.getItem('reader_brightness') || 100))
  const [lineSpacing, setLineSpacing] = useState(() => localStorage.getItem('reader_line_spacing') || 'comfort')
  const [readingMode, setReadingMode] = useState(() => localStorage.getItem('reader_reading_mode') || 'scroll')
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false)
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(() => Number(localStorage.getItem('reader_auto_scroll_speed') || 1))
  const [adultWarningOpen, setAdultWarningOpen] = useState(false)
  const [adultAccepted, setAdultAccepted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [fontSelectOpen, setFontSelectOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [episodeListOpen, setEpisodeListOpen] = useState(false)
  const [echoShareOpen, setEchoShareOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [reviewProgressSaved, setReviewProgressSaved] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)
  const [bottomActionsVisible, setBottomActionsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  const theme = READER_THEMES[themeName] || READER_THEMES.paper
  const activeFont = FONT_OPTIONS.find((font) => font.key === fontKey) || FONT_OPTIONS[0]
  const fontSizePx = FONT_SIZE_LEVELS[fontSizeIndex] || FONT_SIZE_LEVELS[DEFAULT_FONT_SIZE_INDEX]
  const brightnessOpacity = Math.max(0, Math.min(0.35, (100 - brightness) / 125))
  const pagingPages = useMemo(() => {
    return createPagingPages(episode?.content || '', lineSpacing, fontSizePx)
  }, [episode?.content, fontSizePx, lineSpacing])

  useEffect(() => {
    localStorage.setItem('reader_font_size_index', String(fontSizeIndex))
    localStorage.setItem('reader_font_size', fontSizeIndex <= 0 ? 'small' : fontSizeIndex >= 2 ? 'large' : 'normal')
  }, [fontSizeIndex])

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

  useEffect(() => {
    let ignore = false

    async function loadReader() {
      setLoading(true)
      setMessage('')
      setAutoScrollEnabled(false)

      if (!getReaderToken()) {
        navigate('/login')
        return
      }

      try {
        const [episodeResponse, episodesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes/${episodeId}`, {
            headers: readerAuthHeaders(),
          }),
          fetch(`${API_BASE_URL}/api/public/stories/${storyId}/episodes`),
        ])

        const episodeData = await episodeResponse.json().catch(() => ({}))
        const episodesData = await episodesResponse.json().catch(() => ({}))

        if (!episodesResponse.ok || episodesData.ok === false) {
          throw new Error(episodesData.message || 'Episode list not found')
        }

        if (episodeResponse.status === 423 || episodeData.code === 'EPISODE_LOCKED') {
          if (ignore) return

          setStory(episodeData.story || null)
          setEpisode(episodeData.episode || null)
          setEpisodes(episodesData.episodes || [])
          setReadingProgress(0)
          setReviewProgressSaved(false)
          qualifiedViewSentRef.current = false
          setAdultAccepted(true)
          setAdultWarningOpen(false)
          setMessage('This episode is locked. Please unlock it from the story page.')
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || 'Episode not found')
        }

        if (ignore) return

        setStory(episodeData.story || null)
        setEpisode(episodeData.episode || null)
        setEpisodes(episodesData.episodes || [])
        setReadingProgress(0)
        setReviewProgressSaved(false)
        qualifiedViewSentRef.current = false
        window.scrollTo({ top: 0, behavior: 'smooth' })

        if (episodeData.episode?.is_adult) {
          setAdultAccepted(false)
          setAdultWarningOpen(true)
        } else {
          setAdultAccepted(true)
          setAdultWarningOpen(false)
        }
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
  }, [episodeId, navigate, storyId])

  useEffect(() => {
    if (readingMode === 'paging') return undefined

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 100

      setReadingProgress(progress)
      readingProgressRef.current = progress
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [episodeId, readingMode])

  useEffect(() => {
    if (!storyId || !episodeId || !episode || loading || !adultAccepted || qualifiedViewSentRef.current) {
      return undefined
    }

    const characterCount = Number(episode.character_count || episode.content?.length || 0)
    const isShortEpisode = characterCount > 0 && characterCount < 3000
    const requiredSeconds = isShortEpisode ? 30 : 60
    const requiredProgress = isShortEpisode ? 60 : 20
    let activeSeconds = 0

    async function sendQualifiedView() {
        console.log('QUALIFIED VIEW TRIGGERED')

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

      if (activeSeconds >= requiredSeconds && readingProgressRef.current >= requiredProgress) {
        window.clearInterval(timer)
        sendQualifiedView()
      }
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [adultAccepted, episode, episodeId, loading, storyId])

  useEffect(() => {
    const handleActionBarVisibility = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop
      const previousScrollY = lastScrollYRef.current
      const difference = currentScrollY - previousScrollY

      if (Math.abs(difference) < 8) return

      if (currentScrollY < 80 || difference < 0) {
        setBottomActionsVisible(true)
      } else {
        setBottomActionsVisible(false)
      }

      lastScrollYRef.current = Math.max(0, currentScrollY)
    }

    lastScrollYRef.current = window.scrollY || document.documentElement.scrollTop
    window.addEventListener('scroll', handleActionBarVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleActionBarVisibility)
    }
  }, [episodeId])


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

  const currentIndex = episodes.findIndex((item) => item.id === episodeId)
  const previousEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null
  const nextEpisode = currentIndex >= 0 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null

  const cover = episode?.cover_url || story?.cover_url || ''
  const publishedDate = formatDate(episode?.published_at)
  const characterCount = Number(episode?.character_count || episode?.content?.length || 0)
  const isLastReadingPage = readingMode !== 'paging' || currentPageIndex >= Math.max(0, pagingPages.length - 1)

  const handlePrevious = () => {
    if (!previousEpisode) return
    navigate(`/story/${storyId}/episode/${previousEpisode.id}`)
  }

  const handleNext = () => {
    if (!nextEpisode) return
    navigate(`/story/${storyId}/episode/${nextEpisode.id}`)
  }

  const handleResetSettings = () => {
    setFontSizeIndex(DEFAULT_FONT_SIZE_INDEX)
    setFontKey('noto-sans-khmer')
    setThemeName('light')
    setBrightness(100)
    setLineSpacing('comfort')
    setReadingMode('scroll')
    setAutoScrollEnabled(false)
    setAutoScrollSpeed(1)
    setResetOpen(false)
  }


  const handleCommentChanged = () => {}

  return (
    <div className={`min-h-screen ${theme.page} pb-[110px] transition-colors`}>
      {brightnessOpacity > 0 ? (
        <div
          className="pointer-events-none fixed inset-0 z-[65] bg-black"
          style={{ opacity: brightnessOpacity }}
        />
      ) : null}

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

      <div className="fixed left-0 right-0 top-0 z-[70] h-1 bg-black/5">
        <div
          className="h-full bg-[#0b5cff] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <AdultWarningModal
        open={adultWarningOpen}
        onCancel={() => navigate(`/story/${storyId}`)}
        onContinue={() => {
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
        episodes={episodes}
        currentEpisodeId={episodeId}
        storyId={storyId}
        navigate={navigate}
        theme={theme}
      />

      <EchoShareSheet
  open={echoShareOpen}
  story={story}
  onClose={() => setEchoShareOpen(false)}
/>

      <CommentsModal
  open={commentsOpen}
  story={story}
  onClose={() => setCommentsOpen(false)}
  onCommentChanged={handleCommentChanged}
  key={storyId}
/>
      
      <ReaderBottomActionBar
  visible={bottomActionsVisible && !echoShareOpen && !settingsOpen && !fontSelectOpen && !resetOpen && !episodeListOpen && !commentsOpen && adultAccepted && !loading && Boolean(episode)}
  story={story}
  episode={episode}
  onOpenComments={() => setCommentsOpen(true)}
  onOpenEcho={() => setEchoShareOpen(true)}

/>

      <header className={`${bottomActionsVisible ? 'translate-y-0' : '-translate-y-full'} fixed left-0 right-0 top-0 z-50 border-b ${theme.border} ${theme.card}/95 px-4 py-3 shadow-sm backdrop-blur transition-transform duration-300 ease-out`}>
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <ReaderIconButton
            icon="fa-solid fa-chevron-left"
            label="Back to story"
            onClick={() => navigate(`/story/${storyId}`)}
            className={`${theme.ghost}`}
          />

          <div className="min-w-0 px-3 text-center">
            <h1 className={`line-clamp-1 text-[14.5px] font-extrabold ${theme.text}`}>
              {episode?.title || 'Reader'}
            </h1>

           
          </div>

          <div className="flex items-center gap-2">
            <ReaderIconButton
              icon="fa-solid fa-sliders"
              label="Reader settings"
              onClick={() => setSettingsOpen(true)}
              className={`${settingsOpen ? theme.button : theme.ghost}`}
            />

            <ReaderIconButton
              icon="fa-solid fa-list-ul"
              label="Episode list"
              onClick={() => setEpisodeListOpen(true)}
              className={`${theme.ghost}`}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-[76px]">
        {loading ? <LoadingCard /> : null}

        {message ? (
          <section className="rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#e5484d]">
            {message}
          </section>
        ) : null}

        {!loading && episode && adultAccepted ? (
          <>
            <section className={`overflow-hidden rounded-[28px] ${theme.card} shadow-sm ring-1 ring-black/5`}>
              {cover ? (
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

              <div className="p-5 sm:p-8">
                {!cover ? (
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
                <section className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!previousEpisode}
                    className={`flex h-14 items-center justify-center rounded-full text-[14px] font-extrabold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 ${theme.ghost}`}
                  >
                    <i className="fa-solid fa-chevron-left mr-2 text-[12px]" />
{previousEpisode ? `Previous: EP ${previousEpisode.episode_number || ''}` : 'Previous'}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!nextEpisode}
                    className={`flex h-14 items-center justify-center rounded-full text-[14px] font-extrabold shadow-[0_14px_30px_rgba(17,24,39,0.18)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 ${theme.button}`}
                  >
                    {nextEpisode ? `Next: EP ${nextEpisode.episode_number || ''}` : 'Next'}
<i className="fa-solid fa-chevron-right ml-2 text-[12px]" />
                  </button>
                </section>

                {!nextEpisode ? (
                  <section className={`mt-4 rounded-[24px] ${theme.card} px-5 py-7 text-center shadow-sm ring-1 ring-black/5`}>
                    <h3 className={`text-[19px] font-black tracking-wide ${theme.text}`}>
                      TO BE CONTINUED
                    </h3>

                    <p className={`mt-3 text-[13px] font-semibold leading-6 ${theme.muted}`}>
                      The story ends here… but the adventure is just beginning.
                    </p>

                    <div className="mx-auto mt-5 flex max-w-[220px] items-center justify-center gap-2">
                      <span className="h-px flex-1 bg-[#111827]/45" />
                      <span className="text-[15px] leading-none text-[#e5484d]">♥</span>
                      <span className="h-px flex-1 bg-[#111827]/45" />
                    </div>
                  </section>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
