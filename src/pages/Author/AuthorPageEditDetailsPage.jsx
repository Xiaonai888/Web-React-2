import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const DETAILS_STORAGE_KEY = 'shadow_author_page_profile_details'

const DEFAULT_DETAILS = {
  pinned_details: 'Book · $$',
  pinned_detail_keys: ['book', 'price'],
  price_range: '$$',
  reviews_enabled: true,
  website_label: 'Shadow website',
  website_url: 'https://www.shadowerabook.site/',
  facebook_page_name: '',
  facebook_page_url: '',
  facebook_page_image_url: '',
  social_media: '',
  email: '',
  phone: '',
  messenger: '',
  telegram: '',
  address: '',
  hours: '',
  hours_type: 'always_open',
  hours_schedule: null,
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function readStoredDetails() {
  try {
    return {
      ...DEFAULT_DETAILS,
      ...(JSON.parse(localStorage.getItem(DETAILS_STORAGE_KEY) || '{}') || {}),
    }
  } catch {
    return DEFAULT_DETAILS
  }
}

function writeStoredDetails(nextDetails) {
  localStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(nextDetails))
}

function normalizeUsername(value) {
  return String(value || '')
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
}

function getSearchSection(search) {
  const value = new URLSearchParams(search).get('section')
  return value || 'top'
}

function getPinnedDetailOptions(details) {
  return [
    {
      key: 'book',
      icon: 'fa-solid fa-book',
      title: 'Book',
      text: 'Public',
      display: 'Book',
    },
    {
      key: 'reviews',
      icon: 'fa-regular fa-star',
      title: details.reviews_enabled ? 'Reviews: On' : 'Reviews: Off',
      text: 'Public',
      display: details.reviews_enabled ? 'Reviews: On' : '',
    },
    {
      key: 'price',
      icon: 'fa-solid fa-dollar-sign',
      title: details.price_range || 'Price hidden',
      text: 'Public',
      display: details.price_range || '',
    },
    {
      key: 'phone',
      icon: 'fa-solid fa-phone',
      title: details.phone || 'Phone number',
      text: 'Public',
      display: details.phone || '',
    },
    {
      key: 'social',
      icon: 'fa-solid fa-at',
      title: details.social_media || 'Social media',
      text: 'Public',
      display: details.social_media || '',
    },
    {
      key: 'address',
      icon: 'fa-solid fa-location-dot',
      title: details.address || 'Address',
      text: 'Public',
      display: details.address || '',
    },
    {
      key: 'hours',
      icon: 'fa-regular fa-clock',
      title: details.hours || 'Hours',
      text: 'Public',
      display: details.hours || '',
    },
    {
      key: 'telegram',
      icon: 'fa-brands fa-telegram',
      title: details.telegram || 'Telegram',
      text: 'Public',
      display: details.telegram || '',
    },
  ]
}

function makePinnedDetailsText(details, keys) {
  const options = getPinnedDetailOptions(details)
  return keys
    .map((key) => options.find((option) => option.key === key)?.display)
    .filter(Boolean)
    .join(' · ')
}

const HOUR_TYPES = [
  {
    value: 'daily_hours',
    title: 'Daily hours',
    text: 'Set specific opening hours for your page.',
  },
  {
    value: 'temporarily_closed',
    title: 'Temporarily closed',
    text: 'Use this if your page is not available for a short time.',
  },
  {
    value: 'permanently_closed',
    title: 'Permanently closed',
    text: 'Use this if this page is no longer active.',
  },
  {
    value: 'always_open',
    title: 'Always open',
    text: 'Use this if readers can contact or view your page anytime.',
  },
  {
    value: 'not_applicable',
    title: 'Not applicable',
    text: 'Use this if opening hours do not apply to your page.',
  },
]

const WEEK_DAYS = [
  { key: 'monday', short: 'M', label: 'Monday' },
  { key: 'tuesday', short: 'Tu', label: 'Tuesday' },
  { key: 'wednesday', short: 'W', label: 'Wednesday' },
  { key: 'thursday', short: 'Th', label: 'Thursday' },
  { key: 'friday', short: 'F', label: 'Friday' },
  { key: 'saturday', short: 'Sa', label: 'Saturday' },
  { key: 'sunday', short: 'Su', label: 'Sunday' },
]

function makeDefaultHoursSchedule() {
  return WEEK_DAYS.reduce((result, day) => {
    result[day.key] = {
      closed: true,
      open_24_hours: false,
      ranges: [{ open: '', close: '' }],
    }
    return result
  }, {})
}

function getHoursTypeLabel(type) {
  return HOUR_TYPES.find((item) => item.value === type)?.title || 'Always open'
}

function normalizeHoursType(value) {
  return HOUR_TYPES.some((item) => item.value === value) ? value : 'always_open'
}

function normalizeHoursSchedule(value) {
  const base = makeDefaultHoursSchedule()
  const source = value && typeof value === 'object' ? value : {}

  WEEK_DAYS.forEach((day) => {
    const current = source[day.key] || {}
    const ranges = Array.isArray(current.ranges) && current.ranges.length
      ? current.ranges.map((range) => ({
          open: String(range.open || ''),
          close: String(range.close || ''),
        }))
      : [{ open: '', close: '' }]

    base[day.key] = {
      closed: current.closed !== false,
      open_24_hours: Boolean(current.open_24_hours),
      ranges,
    }
  })

  return base
}

function summarizeDayHours(dayData) {
  if (!dayData) return 'Closed'
  if (dayData.open_24_hours) return 'Open 24 hours'
  if (dayData.closed) return 'Closed'

  const ranges = Array.isArray(dayData.ranges) ? dayData.ranges : []
  const validRanges = ranges.filter((range) => range.open && range.close)

  if (!validRanges.length) return 'Closed'

  return validRanges.map((range) => `${range.open} – ${range.close}`).join(', ')
}

function summarizeHours(type, schedule) {
  if (type === 'always_open') return 'Always open'
  if (type === 'temporarily_closed') return 'Temporarily closed'
  if (type === 'permanently_closed') return 'Permanently closed'
  if (type === 'not_applicable') return ''
  if (type !== 'daily_hours') return 'Always open'

  const dayShortLabels = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  }

  const openDays = WEEK_DAYS.map((day, index) => {
    const text = summarizeDayHours(schedule?.[day.key])

    return {
      ...day,
      index,
      text,
      isOpen: text !== 'Closed',
    }
  }).filter((day) => day.isOpen)

  if (!openDays.length) return 'Closed'

  const firstHours = openDays[0].text
  const allSevenDaysOpen = openDays.length === 7
  const allSameHours = openDays.every((day) => day.text === firstHours)

  if (allSevenDaysOpen && allSameHours) {
    return `Everyday: ${firstHours}`
  }

  const groups = []

  openDays.forEach((day) => {
    const lastGroup = groups[groups.length - 1]

    if (
      lastGroup &&
      lastGroup.text === day.text &&
      lastGroup.endIndex + 1 === day.index
    ) {
      lastGroup.endIndex = day.index
      return
    }

    groups.push({
      startIndex: day.index,
      endIndex: day.index,
      text: day.text,
    })
  })

  function getDayRangeLabel(startIndex, endIndex) {
    const startDay = WEEK_DAYS[startIndex]
    const endDay = WEEK_DAYS[endIndex]

    if (startIndex === 0 && endIndex === 6) return 'Everyday'
    if (startIndex === 0 && endIndex === 4) return 'Mon–Fri'
    if (startIndex === 5 && endIndex === 6) return 'Sat–Sun'

    if (startIndex === endIndex) {
      return startDay.label
    }

    return `${dayShortLabels[startDay.key]}–${dayShortLabels[endDay.key]}`
  }

  return groups
    .map((group) => {
      const label = getDayRangeLabel(group.startIndex, group.endIndex)

      if (label === 'Everyday') {
        return `Everyday: ${group.text}`
      }

      return `Open ${label}: ${group.text}`
    })
    .join('\n')
}


function makeTimeOptions() {
  const hours = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

  return { hours, minutes, periods: ['AM', 'PM'] }
}

function FieldRow({ icon, title, value, placeholder, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-2.5 py-2 text-left active:bg-[#f8fafc]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#111827]">
        <i className={`${icon} text-[15px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-normal leading-5 text-[#111827]">{title}</span>
        <span className={`mt-0.5 block whitespace-pre-wrap break-words text-[11px] font-normal leading-4 ${value ? 'text-[#4b5563]' : 'text-[#9ca3af]'}`}>
          {value || placeholder}
        </span>
      </span>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#6b7280]">
        <i className="fa-solid fa-pen text-[12px]" />
      </span>
    </button>
  )
}

function SectionBlock({ id, title, children, sectionRef }) {
  return (
    <section ref={sectionRef} id={id} className="scroll-mt-20">
      <div className="mb-1">
        <h2 className="text-[14px] font-semibold text-[#111827]">{title}</h2>
      </div>
      <div className="space-y-0">{children}</div>
    </section>
  )
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[260] bg-white">
      <header className="sticky top-0 z-10 border-b border-[#eef0f4] bg-white">
        <div className="mx-auto flex h-12 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[18px] text-[#111827]" />
          </button>

          <h2 className="text-[16px] font-semibold text-[#111827]">{title}</h2>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-24 pt-5">{children}</main>
    </div>
  )
}

function TextEditModal({ open, title, label, value, multiline, placeholder, maxLength, onClose, onSave }) {
  const [draft, setDraft] = useState(value || '')

  useEffect(() => {
    if (open) setDraft(value || '')
  }, [open, value])

  if (!open) return null

  const canSave = draft.trim() !== String(value || '').trim()

  return (
    <ModalShell title={title} onClose={onClose}>
      <label className="mb-1.5 block text-[12px] font-normal text-[#6b7280]">{label}</label>
      {multiline ? (
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="min-h-[128px] w-full rounded-[16px] border border-[#e5e7eb] bg-white px-3 py-3 text-[14px] font-normal leading-6 text-[#111827] outline-none focus:border-[#111827]"
        />
      ) : (
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-11 w-full rounded-[14px] border border-[#e5e7eb] bg-white px-3 text-[14px] font-normal text-[#111827] outline-none focus:border-[#111827]"
        />
      )}

      {maxLength ? (
        <div className="mt-2 text-right text-[12px] font-normal text-[#9ca3af]">
          {draft.length}/{maxLength}
        </div>
      ) : null}

     <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
  <button
    type="button"
    disabled={!canSave}
    onClick={() => onSave(draft.trim())}
    className="h-10 w-full rounded-[12px] bg-[#111827] text-[13px] font-semibold text-white disabled:bg-[#e5e7eb] disabled:text-[#b4bbc6]"
  >
    Save
  </button>
</div>
    </ModalShell>
  )
}

function PriceModal({ open, value, onClose, onSave }) {
  const [draft, setDraft] = useState(typeof value === 'string' ? value : '$$')

  useEffect(() => {
    if (open) setDraft(typeof value === 'string' ? value : '$$')
  }, [open, value])

  if (!open) return null

  const options = [
    { value: '$', title: '$', text: 'Basic' },
    { value: '$$', title: '$$', text: 'Standard' },
    { value: '$$$', title: '$$$', text: 'Premium' },
    { value: '$$$$', title: '$$$$', text: 'Exclusive' },
    { value: '', title: 'Do not show price', text: 'Hide price range from your public page' },
  ]

  return (
    <ModalShell title="Edit price" onClose={onClose}>
      <div className="mx-auto w-full max-w-[520px] pt-2">
        <div className="space-y-1">
          {options.map((option) => {
            const active = draft === option.value

            return (
              <button
                key={option.title}
                type="button"
                onClick={() => setDraft(option.value)}
                className="flex w-full items-center justify-between gap-4 rounded-[14px] px-1 py-3 text-left active:bg-[#f3f4f6]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-normal text-[#111827]">{option.title}</span>
                  <span className="mt-0.5 block text-[13px] font-normal text-[#6b7280]">{option.text}</span>
                </span>

                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#1877f2]' : 'border-[#6b7280]'}`}>
                  {active ? <span className="h-4 w-4 rounded-full bg-[#1877f2]" /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#eef0f4] bg-white px-4 py-3">
        <div className="mx-auto w-full max-w-[520px]">
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white active:scale-[0.99]"
          >
            Save
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function ReviewsModal({ open, value, onClose, onSave }) {
  const [draft, setDraft] = useState(Boolean(value))

  useEffect(() => {
    if (open) setDraft(Boolean(value))
  }, [open, value])

  if (!open) return null

  return (
    <ModalShell title="Reviews" onClose={onClose}>
      <div className="mx-auto w-full max-w-[520px] pt-3">
        <h3 className="text-[20px] font-semibold leading-7 text-[#111827] sm:text-[21px]">
          Let readers leave reviews on your Author Page?
        </h3>

        <p className="mt-3 text-[14px] font-normal leading-6 text-[#6b7280] sm:text-[15px]">
          Reviews help readers decide whether to follow your page and read your works. You can turn this off anytime.
        </p>

        <button
          type="button"
          onClick={() => setDraft((current) => !current)}
          className="mt-7 flex w-full items-center justify-between gap-4 rounded-[14px] py-3 text-left active:bg-[#f3f4f6]"
        >
          <span className="text-[15px] font-normal text-[#111827] sm:text-[16px]">Allow reviews</span>
          <span className={`flex h-6 w-6 items-center justify-center rounded-[7px] ${draft ? 'bg-[#1877f2]' : 'border border-[#6b7280]'}`}>
            {draft ? <i className="fa-solid fa-check text-[12px] text-white" /> : null}
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#eef0f4] bg-white px-4 py-3">
        <div className="mx-auto w-full max-w-[520px]">
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white active:scale-[0.99]"
          >
            Save
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

function HoursModal({ open, details, onClose, onSave }) {
  
  const currentType = normalizeHoursType(details?.hours_type)
  const currentSchedule = normalizeHoursSchedule(details?.hours_schedule)

  const [draftType, setDraftType] = useState(currentType)
  const [draftSchedule, setDraftSchedule] = useState(currentSchedule)
  const [selectOpen, setSelectOpen] = useState(false)
  const [editDayOpen, setEditDayOpen] = useState(false)
  const [activeDay, setActiveDay] = useState('monday')
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const [timePicker, setTimePicker] = useState(null)
  const [timeDraft, setTimeDraft] = useState({ hour: '12', minute: '00', period: 'AM' })

  const timeOptions = useMemo(() => makeTimeOptions(), [])

  useEffect(() => {
    if (!open) return
    setDraftType(currentType)
    setDraftSchedule(currentSchedule)
    setSelectOpen(false)
    setEditDayOpen(false)
    setActiveDay('monday')
    setExitConfirmOpen(false)
    setTimePicker(null)
  }, [open, currentType, JSON.stringify(currentSchedule)])

  if (!open) return null

  const currentSummary = summarizeHours(currentType, currentSchedule)
  const draftSummary = summarizeHours(draftType, draftSchedule)
  const canSave =
    draftType !== currentType ||
    JSON.stringify(draftSchedule) !== JSON.stringify(currentSchedule) ||
    draftSummary !== currentSummary

  function handleRequestClose() {
    if (canSave) {
      setExitConfirmOpen(true)
      return
    }

    onClose()
  }

  

  function updateDay(dayKey, patch) {
    setDraftSchedule((current) => ({
      ...current,
      [dayKey]: {
        ...current[dayKey],
        ...patch,
      },
    }))
  }

  function updateRange(dayKey, index, patch) {
    setDraftSchedule((current) => {
      const dayData = current[dayKey] || { closed: true, open_24_hours: false, ranges: [{ open: '', close: '' }] }
      const ranges = Array.isArray(dayData.ranges) && dayData.ranges.length ? [...dayData.ranges] : [{ open: '', close: '' }]
      ranges[index] = {
        ...ranges[index],
        ...patch,
      }

      return {
        ...current,
        [dayKey]: {
          ...dayData,
          closed: false,
          open_24_hours: false,
          ranges,
        },
      }
    })
  }

  function removeRange(dayKey, index) {
    setDraftSchedule((current) => {
      const dayData = current[dayKey] || {
        closed: true,
        open_24_hours: false,
        ranges: [{ open: '', close: '' }],
      }

      const ranges = Array.isArray(dayData.ranges) ? dayData.ranges : []
      const nextRanges = ranges.filter((_, rangeIndex) => rangeIndex !== index)

      return {
        ...current,
        [dayKey]: {
          ...dayData,
          ranges: nextRanges.length ? nextRanges : [{ open: '', close: '' }],
        },
      }
    })
  }

  function openTimePicker(field, rangeIndex = 0) {
    const value = draftSchedule?.[activeDay]?.ranges?.[rangeIndex]?.[field] || '12:00 AM'
    const match = String(value).match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)

    setTimeDraft({
      hour: match ? match[1].padStart(2, '0') : '12',
      minute: match ? match[2] : '00',
      period: match ? match[3].toUpperCase() : 'AM',
    })

    setTimePicker({ field, rangeIndex })
  }

  function saveTimePicker() {
    if (!timePicker) return

    updateRange(activeDay, timePicker.rangeIndex, {
      [timePicker.field]: `${timeDraft.hour}:${timeDraft.minute} ${timeDraft.period}`,
    })

    setTimePicker(null)
  }

  function handleTypeSelect(type) {
    setDraftType(type)
    setSelectOpen(false)

    if (type !== 'daily_hours') {
      setEditDayOpen(false)
    }
  }

  function handleSave() {
    setExitConfirmOpen(false)
    onSave({
      hours_type: draftType,
      hours_schedule: draftType === 'daily_hours' ? draftSchedule : null,
      hours: draftSummary,
    })
  }

  if (editDayOpen) {
    const dayData = draftSchedule[activeDay] || { closed: true, open_24_hours: false, ranges: [{ open: '', close: '' }] }
    const ranges = Array.isArray(dayData.ranges) && dayData.ranges.length ? dayData.ranges : [{ open: '', close: '' }]

    return (
      <ModalShell title="Edit hours" onClose={() => setEditDayOpen(false)}>
        <div className="mx-auto w-full max-w-[520px]">
          <div className="mb-5 grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((day) => {
              const active = activeDay === day.key

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setActiveDay(day.key)}
                  className={`h-14 rounded-[12px] border text-[16px] font-medium ${
                    active
                      ? 'border-[#f5c542] bg-[#fff7d6] text-[#111827]'
                      : 'border-[#e5e7eb] bg-white text-[#111827]'
                  }`}
                >
                  {day.short}
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
  {ranges.map((range, index) => (
    <div key={index} className="space-y-3">
      <button
        type="button"
        disabled={dayData.closed || dayData.open_24_hours}
        onClick={() => openTimePicker('open', index)}
        className="flex h-[56px] w-full items-center rounded-[13px] border border-[#d1d5db] px-4 text-left text-[15px] font-normal text-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af]"
      >
        {range.open || 'Open'}
      </button>

      <button
        type="button"
        disabled={dayData.closed || dayData.open_24_hours}
        onClick={() => openTimePicker('close', index)}
        className="flex h-[56px] w-full items-center rounded-[13px] border border-[#d1d5db] px-4 text-left text-[15px] font-normal text-[#111827] disabled:bg-[#f3f4f6] disabled:text-[#9ca3af]"
      >
        {range.close || 'Close'}
      </button>

      {ranges.length > 1 ? (
        <button
          type="button"
          onClick={() => removeRange(activeDay, index)}
          className="flex h-10 w-full items-center justify-center rounded-[11px] bg-[#e5e7eb] text-[14px] font-medium text-[#111827] active:bg-[#d8dde5]"
        >
          Remove hours
        </button>
      ) : null}
    </div>
  ))}
</div>

          <div className="mt-6 space-y-5">
            <button
              type="button"
              onClick={() => updateDay(activeDay, { closed: !dayData.closed, open_24_hours: false, ranges: dayData.ranges || [{ open: '', close: '' }] })}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[18px] font-normal text-[#111827]">Closed</span>
              <span className={`relative flex h-8 w-14 items-center rounded-full p-1 shadow-inner transition ${dayData.closed ? 'bg-[#111827]' : 'bg-[#cfd5df]'}`}>
  <span className={`h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(15,23,42,0.25)] ring-1 ring-black/5 transition-transform duration-200 ${dayData.closed ? 'translate-x-6' : 'translate-x-0'}`} />
</span>
            </button>

            <button
              type="button"
              onClick={() => updateDay(activeDay, { open_24_hours: !dayData.open_24_hours, closed: false, ranges: [{ open: '', close: '' }] })}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[18px] font-normal text-[#111827]">Open 24 hours</span>
              <span className={`relative flex h-8 w-14 items-center rounded-full p-1 shadow-inner transition ${dayData.open_24_hours ? 'bg-[#111827]' : 'bg-[#cfd5df]'}`}>
  <span className={`h-6 w-6 rounded-full bg-white shadow-[0_3px_8px_rgba(15,23,42,0.25)] ring-1 ring-black/5 transition-transform duration-200 ${dayData.open_24_hours ? 'translate-x-6' : 'translate-x-0'}`} />
</span>
            </button>
          </div>

         {ranges.length < 2 ? (
  <button
    type="button"
    disabled={dayData.closed || dayData.open_24_hours}
    onClick={() => updateDay(activeDay, { ranges: [...ranges, { open: '', close: '' }] })}
    className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-[11px] bg-[#e5e7eb] text-[14px] font-medium text-[#111827] active:bg-[#d8dde5] disabled:opacity-50"
  >
    <i className="fa-solid fa-plus text-[13px]" />
    Add more
  </button>
) : null}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-[#eef0f4] bg-white px-4 py-3">
          <div className="mx-auto w-full max-w-[520px]">
            <button
              type="button"
              onClick={() => setEditDayOpen(false)}
              className="h-11 w-full rounded-full bg-[#111827] text-[14px] font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>

        {timePicker ? (
          <div className="fixed inset-0 z-[320] flex items-center justify-center bg-black/55 px-8">
            <div className="w-full max-w-[370px] rounded-[4px] bg-white px-6 pb-5 pt-6 shadow-2xl">
              <h3 className="text-[22px] font-normal text-[#111827]">Set time</h3>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <select
                  value={timeDraft.hour}
                  onChange={(event) => setTimeDraft((current) => ({ ...current, hour: event.target.value }))}
                  className="h-12 border-b border-[#6b7280] bg-white text-center text-[18px] outline-none"
                >
                  {timeOptions.hours.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={timeDraft.minute}
                  onChange={(event) => setTimeDraft((current) => ({ ...current, minute: event.target.value }))}
                  className="h-12 border-b border-[#6b7280] bg-white text-center text-[18px] outline-none"
                >
                  {timeOptions.minutes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select
                  value={timeDraft.period}
                  onChange={(event) => setTimeDraft((current) => ({ ...current, period: event.target.value }))}
                  className="h-12 border-b border-[#6b7280] bg-white text-center text-[18px] outline-none"
                >
                  {timeOptions.periods.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="mt-10 flex justify-end gap-8">
                <button
                  type="button"
                  onClick={() => setTimePicker(null)}
                  className="text-[14px] font-semibold uppercase text-[#111827]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveTimePicker}
                  className="text-[14px] font-semibold uppercase text-[#111827]"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </ModalShell>
    )
  }

  return (
    <ModalShell title="Hours" onClose={handleRequestClose}>
      <div className="mx-auto w-full max-w-[520px]">
        <button
  type="button"
  onClick={() => setSelectOpen(true)}
  className="flex h-[68px] w-full items-center justify-between rounded-[15px] border border-[#d1d5db] px-4 text-left"
>
  <span>
    <span className="block text-[12px] font-normal text-[#6b7280]">Select hours</span>
    <span className="mt-0.5 block text-[16px] font-normal text-[#111827]">
      {getHoursTypeLabel(draftType)}
    </span>
  </span>

  <i className="fa-solid fa-caret-down text-[14px] text-[#6b7280]" />
</button>

        {draftType === 'daily_hours' ? (
          <div className="mt-5 space-y-5">
            {WEEK_DAYS.map((day) => (
  <button
    key={day.key}
    type="button"
    onClick={() => {
      setActiveDay(day.key)
      setEditDayOpen(true)
    }}
    className="flex w-full items-center justify-between text-left"
  >
    <span>
      <span className="block text-[16px] font-normal text-[#111827]">{day.label}</span>
      <span className="mt-0.5 block text-[13px] font-normal text-[#6b7280]">
        {summarizeDayHours(draftSchedule[day.key])}
      </span>
    </span>

    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#6b7280]">
  <i className="fa-solid fa-pen text-[12px]" />
</span>
  </button>
))}
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[#eef0f4] bg-white px-4 py-3">
        <div className="mx-auto w-full max-w-[520px]">
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="h-11 w-full rounded-[12px] bg-[#111827] text-[14px] font-semibold text-white disabled:bg-[#e5e7eb] disabled:text-[#b4bbc6]"
          >
            Save
          </button>
        </div>
      </div>

      {selectOpen ? (
        <div className="fixed inset-0 z-[300] bg-black/45" onClick={() => setSelectOpen(false)}>
          <div
  className="absolute bottom-0 left-1/2 w-full max-w-[560px] -translate-x-1/2 rounded-t-[26px] bg-[#f5f6fb] px-5 pb-7 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.18)]"
  onClick={(event) => event.stopPropagation()}
>
            <div className="mx-auto mb-8 h-1.5 w-14 rounded-full bg-[#9ca3af]" />

            <h3 className="mb-4 text-center text-[17px] font-normal text-[#111827]">Select hours</h3>

            <div className="rounded-[12px] bg-white py-2">
              {HOUR_TYPES.map((option) => (
                <button
  key={option.value}
  type="button"
  onClick={() => handleTypeSelect(option.value)}
  className="w-full px-4 py-[9px] text-left active:bg-[#f3f4f6]"
>
  <span className="block text-[16px] font-normal text-[#111827]">{option.title}</span>
  <span className="mt-0.5 block text-[13px] font-normal leading-[18px] text-[#6b7280]">{option.text}</span>
</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

{exitConfirmOpen ? (
  <div className="fixed inset-0 z-[340] flex items-center justify-center bg-black/55 px-8">
    <div className="w-full max-w-[420px] rounded-[4px] bg-white px-6 py-5 shadow-2xl">
      <h3 className="text-[20px] font-normal text-[#111827]">
        Leave without saving hours?
      </h3>

      <p className="mt-4 text-[16px] font-normal leading-6 text-[#374151]">
        Your hours changes are not saved yet. If you leave now, they will not be shown on your Author Page.
      </p>

      <div className="mt-8 flex justify-end gap-7">
        <button
          type="button"
          onClick={() => {
            setExitConfirmOpen(false)
            onClose()
          }}
          className="text-[14px] font-medium text-[#e5484d]"
        >
          Leave
        </button>

        <button
          type="button"
          onClick={() => setExitConfirmOpen(false)}
          className="text-[14px] font-medium text-[#2563eb]"
        >
          Keep editing
        </button>
      </div>
    </div>
  </div>
) : null}
      
    </ModalShell>
  )
}

function FacebookPageModal({ open, name, url, imageUrl, fallbackImage, onClose, onSave, onUploadImage }) {
  const [draftName, setDraftName] = useState(name || '')
  const [draftUrl, setDraftUrl] = useState(url || '')

  useEffect(() => {
    if (open) {
      setDraftName(name || '')
      setDraftUrl(url || '')
    }
  }, [open, name, url])

  if (!open) return null

  const canSave =
    draftName.trim() !== String(name || '').trim() ||
    draftUrl.trim() !== String(url || '').trim()

  const displayImage = imageUrl || fallbackImage

  return (
    <ModalShell title="Edit Facebook Page" onClose={onClose}>
      <div className="mb-5 flex items-center gap-3">
        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6] ring-1 ring-black/10">
          {displayImage ? (
            <img src={displayImage} alt={draftName || 'Facebook Page'} className="h-full w-full object-cover" />
          ) : null}
        </span>

        <button
          type="button"
          onClick={onUploadImage}
          className="rounded-full bg-[#f4f5f7] px-3 py-2 text-[12px] font-medium text-[#111827] active:scale-95"
        >
          Change image
        </button>
      </div>

      <label className="mb-1.5 block text-[12px] font-normal text-[#6b7280]">Page name</label>
      <input
        value={draftName}
        onChange={(event) => setDraftName(event.target.value)}
        maxLength={80}
        placeholder="Example: Alpha Centauri"
        className="h-11 w-full rounded-[14px] border border-[#e5e7eb] bg-white px-3 text-[14px] font-normal text-[#111827] outline-none focus:border-[#111827]"
      />

      <label className="mb-1.5 mt-4 block text-[12px] font-normal text-[#6b7280]">Page link</label>
      <input
        value={draftUrl}
        onChange={(event) => setDraftUrl(event.target.value)}
        maxLength={180}
        placeholder="https://facebook.com/yourpage"
        className="h-11 w-full rounded-[14px] border border-[#e5e7eb] bg-white px-3 text-[14px] font-normal text-[#111827] outline-none focus:border-[#111827]"
      />

      <p className="mt-2 text-[12px] font-normal leading-5 text-[#8b93a1]">
        The image is optional. If you do not add one, your author logo will be shown.
      </p>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave({ name: draftName.trim(), url: draftUrl.trim() })}
          className="h-10 w-full rounded-[12px] bg-[#111827] text-[13px] font-semibold text-white disabled:bg-[#e5e7eb] disabled:text-[#b4bbc6]"
        >
          Save
        </button>
      </div>
    </ModalShell>
  )
}

function PinnedDetailsModal({ open, details, onClose, onSave }) {
  const options = getPinnedDetailOptions(details)
  const savedKeys = Array.isArray(details.pinned_detail_keys) ? details.pinned_detail_keys : ['book', 'price']
  const [selectedKeys, setSelectedKeys] = useState(savedKeys)

  useEffect(() => {
    if (open) setSelectedKeys(savedKeys)
  }, [open, details.pinned_detail_keys])

  if (!open) return null

  function toggleKey(key) {
    setSelectedKeys((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key)
      if (current.length >= 5) return current
      return [...current, key]
    })
  }

  return (
    <ModalShell title="Intro" onClose={onClose}>
      <div className="mb-5">
        <h3 className="text-[18px] font-semibold text-[#111827]">Pinned details</h3>
        <p className="mt-1 text-[13px] font-normal leading-5 text-[#6b7280]">
          Choose up to 5 details to feature near the top of your page.
        </p>
      </div>

      <div className="space-y-1">
        {options.map((option) => {
          const active = selectedKeys.includes(option.key)

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => toggleKey(option.key)}
              className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#111827]">
                <i className={`${option.icon} text-[22px]`} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-normal text-[#111827]">{option.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-[#6b7280]">
                  <i className="fa-solid fa-earth-asia text-[10px]" />
                  {option.text}
                </span>
              </span>

              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 ${active ? 'border-[#1877f2] bg-[#1877f2]' : 'border-[#9ca3af]'}`}>
                {active ? <i className="fa-solid fa-check text-[12px] text-white" /> : null}
              </span>
            </button>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
        <button
          type="button"
          onClick={() => onSave(selectedKeys)}
          className="h-10 w-full rounded-[12px] bg-[#111827] text-[13px] font-semibold text-white"
        >
          Save
        </button>
      </div>
    </ModalShell>
  )
}

function CoverOptionsSheet({ open, onClose, onSeeCover, onUploadCover, onChooseCover }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[250]">
      <button type="button" aria-label="Close cover options" onClick={onClose} className="absolute inset-0 bg-black/35" />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#9ca3af]" />
        <div className="space-y-1">
          <button type="button" onClick={onSeeCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
              <i className="fa-regular fa-image text-[18px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">See cover</span>
          </button>

          <button type="button" onClick={onUploadCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">Upload cover</span>
          </button>

          <button type="button" onClick={onChooseCover} className="flex w-full items-center gap-4 rounded-[16px] px-1 py-3 text-left active:bg-[#f3f4f6]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[#111827]">
              <i className="fa-solid fa-images text-[17px]" />
            </span>
            <span className="text-[17px] font-normal text-[#111827]">Choose cover</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorPageEditDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const sectionFromUrl = useMemo(() => getSearchSection(location.search), [location.search])
  const fileInputRef = useRef(null)
  const coverRef = useRef(null)
  const introRef = useRef(null)
  const detailsRef = useRef(null)
  const linksRef = useRef(null)
  const facebookRef = useRef(null)
  const contactRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [pageName, setPageName] = useState('')
  const [pageUsername, setPageUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [details, setDetails] = useState(readStoredDetails)
  const [activeModal, setActiveModal] = useState('')
  const [imageMode, setImageMode] = useState('')
  const [coverOptionsOpen, setCoverOptionsOpen] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadAuthorPage() {
      const token = getAuthToken()

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

        if (!response.ok || data.ok === false || !data.has_author_page || !data.author_page) {
          throw new Error(data.message || 'Author page not found')
        }

        if (ignore) return

        setPageName(data.author_page.page_name || '')
        setPageUsername(data.author_page.page_username || '')
        setBio(data.author_page.bio || '')
        setAvatarUrl(data.author_page.avatar_url || '')
        setCoverUrl(data.author_page.cover_url || '')
        const databaseDetails = data.author_page.profile_details || {}
const storedDetails = readStoredDetails()
const nextDetails = Object.keys(databaseDetails).length
  ? { ...DEFAULT_DETAILS, ...databaseDetails }
  : { ...DEFAULT_DETAILS, ...storedDetails }

setDetails(nextDetails)
writeStoredDetails(nextDetails)

        localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load author page')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadAuthorPage()

    return () => {
      ignore = true
    }
  }, [navigate])

  useEffect(() => {
    const refs = {
      cover: coverRef,
      intro: introRef,
      details: detailsRef,
      links: linksRef,
      facebook: facebookRef,
      contact: contactRef,
    }

    const targetRef = refs[sectionFromUrl]

    if (!targetRef?.current) return

    window.setTimeout(() => {
      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 260)
  }, [sectionFromUrl, loading])

 
async function updateDetails(patch) {
  const nextDetails = { ...details, ...patch }

  setDetails(nextDetails)
  writeStoredDetails(nextDetails)
  window.dispatchEvent(new Event('shadow_author_page_profile_details_updated'))

  const token = getAuthToken()
  if (!token) {
    setMessage('Please login again before saving contact info.')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        page_name: pageName.trim(),
        page_username: normalizeUsername(pageUsername),
        bio: bio.trim(),
        profile_details: nextDetails,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.message || 'Failed to save contact info')
    }

    if (data.author_page) {
      localStorage.setItem('shadow_author_page', JSON.stringify(data.author_page))
    }

    setMessage('Saved.')
  } catch (error) {
    setMessage(error.message || 'Failed to save contact info')
  }
}


  function openImagePicker(mode) {
    setImageMode(mode)
    fileInputRef.current?.click()
  }

  function handleImageFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()

    reader.onload = () => {
      const imageUrl = String(reader.result || '')

      if (imageMode === 'cover') {
        setCoverUrl(imageUrl)
        const currentPage = JSON.parse(localStorage.getItem('shadow_author_page') || '{}')
        localStorage.setItem('shadow_author_page', JSON.stringify({ ...currentPage, cover_url: imageUrl }))
        setMessage('Cover updated for preview. Backend image save can be connected later.')
      }

      if (imageMode === 'avatar') {
        setAvatarUrl(imageUrl)
        const currentPage = JSON.parse(localStorage.getItem('shadow_author_page') || '{}')
        localStorage.setItem('shadow_author_page', JSON.stringify({ ...currentPage, avatar_url: imageUrl }))
        setMessage('Logo updated for preview. Backend image save can be connected later.')
      }

      if (imageMode === 'facebook') {
        updateDetails({ facebook_page_image_url: imageUrl })
        setMessage('Facebook Page image updated.')
      }

      setImageMode('')
    }

    reader.readAsDataURL(file)
  }

  async function handleSaveMainPage() {
    const token = getAuthToken()
    const nextPageName = pageName.trim()
    const nextPageUsername = normalizeUsername(pageUsername)
    const nextBio = bio.trim()

    if (!token) {
      navigate('/login')
      return
    }

    if (nextPageName.length < 2) {
      setMessage('Page name must be at least 2 characters.')
      return
    }

    if (nextPageUsername.length < 3) {
      setMessage('Page username must be at least 3 characters.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/authors/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_name: nextPageName,
          page_username: nextPageUsername,
          bio: nextBio,
profile_details: details,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update author page')
      }

      if (data.author_page) {
        localStorage.setItem('shadow_author_page', JSON.stringify({
          ...data.author_page,
          avatar_url: avatarUrl || data.author_page.avatar_url,
          cover_url: coverUrl || data.author_page.cover_url,
        }))
      }

      writeStoredDetails(details)
      setMessage('Edit Page saved.')
    } catch (error) {
      setMessage(error.message || 'Failed to save Edit Page')
    } finally {
      setSaving(false)
    }
  }

  const displayCover = coverUrl
  const displayAvatar = avatarUrl
  const displayFacebookImage = details.facebook_page_image_url || displayAvatar
  const displayFacebookName = details.facebook_page_name || pageName || 'Facebook Page'

  return (
    <div className="min-h-screen bg-white pb-10">
      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto flex h-12 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

         <h1 className="text-[16px] font-semibold text-[#111827]">Edit Page</h1>
<div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-10">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mb-4 w-full rounded-[16px] bg-[#f3f4f6] px-4 py-3 text-left text-[13px] font-normal text-[#111827]"
          >
            {message}
          </button>
        ) : null}

        <section ref={coverRef} id="cover" className="scroll-mt-20">
          <div className="relative h-[165px] overflow-hidden rounded-t-[18px] bg-[#111827] sm:h-[190px]">
            {displayCover ? (
              <img src={displayCover} alt={pageName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
            )}

            <div className="absolute inset-0 bg-black/10" />

            <button
              type="button"
              onClick={() => setCoverOptionsOpen(true)}
              className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] active:scale-95"
            >
              <i className="fa-solid fa-camera text-[16px]" />
            </button>
          </div>

          <div className="relative min-h-[72px] bg-white">
            <div className="absolute -top-11 left-5 h-[84px] w-[84px] rounded-full border-[3px] border-white bg-[#f3f4f6] shadow-sm">
              {displayAvatar ? (
                <img src={displayAvatar} alt={pageName} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full text-[28px] font-bold text-[#9ca3af]">
                  {(pageName || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={() => openImagePicker('avatar')}
                className="absolute -bottom-0.5 right-0 flex h-7 w-7 items-center justify-center rounded-full border-[2px] border-white bg-[#111827] text-white active:scale-95"
                aria-label="Upload logo"
              >
                <i className="fa-solid fa-camera text-[10px]" />
              </button>
            </div>
          </div>
        </section>

        <div className="mt-2 space-y-6">
          <SectionBlock id="intro" title="Intro" sectionRef={introRef}>
            <FieldRow
              icon="fa-regular fa-hand"
              title="Bio"
              value={bio}
              placeholder="Add a short intro for readers"
              onClick={() => setActiveModal('bio')}
            />
            <FieldRow
              icon="fa-regular fa-star"
              title="Pinned details"
              value={details.pinned_details}
              placeholder="Add one short public detail"
              onClick={() => setActiveModal('pinned')}
            />
          </SectionBlock>

          <SectionBlock id="details" title="Details" sectionRef={detailsRef}>
  <FieldRow
    icon="fa-regular fa-star"
    title={`Reviews: ${details.reviews_enabled ? 'On' : 'Off'}`}
    value={details.reviews_enabled ? 'Readers can leave reviews on your page' : 'Reviews are hidden from your page'}
    placeholder=""
    onClick={() => setActiveModal('reviews')}
  />
  <FieldRow
    icon="fa-solid fa-dollar-sign"
    title={details.price_range || 'Price hidden'}
    value={details.price_range ? 'Price range shown on your public page' : 'Price range will not be shown'}
    placeholder=""
    onClick={() => setActiveModal('price')}
  />
  <FieldRow
  icon="fa-solid fa-location-dot"
  title="Address"
  value={details.address}
  placeholder="Add address"
  onClick={() => setActiveModal('address')}
/>
  <FieldRow
  icon="fa-regular fa-clock"
  title="Hours"
  value={details.hours}
  placeholder="Add opening hours"
  onClick={() => setActiveModal('hours')}
/>
</SectionBlock>

          <SectionBlock id="links" title="Links" sectionRef={linksRef}>
            <FieldRow
              icon="fa-solid fa-link"
              title={details.website_label || 'Website'}
              value={details.website_url}
              placeholder="Add website link"
              onClick={() => setActiveModal('website')}
            />
          </SectionBlock>
<SectionBlock id="facebook" title="Facebook Page" sectionRef={facebookRef}>
  <button
    type="button"
    onClick={() => setActiveModal('facebook')}
    className="flex w-full items-center gap-3 py-2.5 text-left active:bg-[#f8fafc]"
  >
    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6] ring-1 ring-black/10">
      {displayFacebookImage ? (
        <img src={displayFacebookImage} alt={displayFacebookName} className="h-full w-full object-cover" />
      ) : null}
    </span>

    <span className="min-w-0 flex-1">
      <span className="line-clamp-1 block text-[13px] font-normal text-[#111827]">{displayFacebookName}</span>
      <span className="mt-0.5 line-clamp-2 block text-[11px] font-normal text-[#6b7280]">
        {details.facebook_page_url || 'Add Facebook Page link'}
      </span>
    </span>

    <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[#6b7280]">
      <i className="fa-solid fa-pen text-[12px]" />
    </span>
  </button>
</SectionBlock>

          <SectionBlock id="contact" title="Contact info" sectionRef={contactRef}>
            <FieldRow
              icon="fa-solid fa-at"
              title="Social media"
              value={details.social_media}
              placeholder="Add social media or public handle"
              onClick={() => setActiveModal('social')}
            />
            <FieldRow
              icon="fa-regular fa-envelope"
              title={details.email || 'Email address'}
              value={details.email ? 'Shown on your public page' : ''}
              placeholder="Add email address"
              onClick={() => setActiveModal('email')}
            />
            <FieldRow
              icon="fa-solid fa-phone"
              title={details.phone || 'Phone number'}
              value={details.phone ? 'Shown on your public page' : ''}
              placeholder="Add phone number"
              onClick={() => setActiveModal('phone')}
            />
            <FieldRow
              icon="fa-brands fa-facebook-messenger"
              title={details.messenger || 'Messenger'}
              value={details.messenger ? 'Shown on your public page' : ''}
              placeholder="Add Messenger name or link"
              onClick={() => setActiveModal('messenger')}
            />

            <FieldRow
  icon="fa-brands fa-telegram"
  title={details.telegram || 'Telegram'}
  value={details.telegram ? 'Shown on your public page' : ''}
  placeholder="Add Telegram link"
  onClick={() => setActiveModal('telegram')}
/>
          </SectionBlock>
        </div>
      </main>

      <CoverOptionsSheet
        open={coverOptionsOpen}
        onClose={() => setCoverOptionsOpen(false)}
        onSeeCover={() => {
          setCoverOptionsOpen(false)
          if (displayCover) window.open(displayCover, '_blank', 'noopener,noreferrer')
          else setMessage('No cover photo yet.')
        }}
        onUploadCover={() => {
          setCoverOptionsOpen(false)
          openImagePicker('cover')
        }}
        onChooseCover={() => {
          setCoverOptionsOpen(false)
          setMessage('Choose cover is coming soon.')
        }}
      />

      <TextEditModal
        open={activeModal === 'bio'}
        title="Edit bio"
        label="Bio"
        value={bio}
        multiline
        maxLength={240}
        placeholder="Tell readers about your page."
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          setBio(value)
          setActiveModal('')
          setMessage('Bio updated. Press Save to keep it on backend.')
        }}
      />

      <PinnedDetailsModal
  open={activeModal === 'pinned'}
  details={details}
  onClose={() => setActiveModal('')}
  onSave={(keys) => {
    updateDetails({
      pinned_detail_keys: keys,
      pinned_details: makePinnedDetailsText(details, keys),
    })
    setActiveModal('')
  }}
/>

      <PriceModal
        open={activeModal === 'price'}
        value={details.price_range}
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          const nextDetails = { ...details, price_range: value }
updateDetails({
  price_range: value,
  pinned_details: makePinnedDetailsText(nextDetails, nextDetails.pinned_detail_keys || ['book', 'price']),
})
          setActiveModal('')
        }}
      />

<TextEditModal
  open={activeModal === 'address'}
  title="Edit address"
  label="Address"
  value={details.address}
  maxLength={180}
  placeholder="Add your public address"
  onClose={() => setActiveModal('')}
  onSave={(value) => {
    updateDetails({ address: value })
    setActiveModal('')
  }}
/>

<HoursModal
  open={activeModal === 'hours'}
  details={details}
  onClose={() => setActiveModal('')}
  onSave={(value) => {
    updateDetails(value)
    setActiveModal('')
  }}
/>

    
      
      <ReviewsModal
        open={activeModal === 'reviews'}
        value={details.reviews_enabled}
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ reviews_enabled: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'website'}
        title="Edit website"
        label="Website URL"
        value={details.website_url}
        maxLength={180}
        placeholder="https://example.com"
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ website_url: value, website_label: value ? 'Website' : 'Shadow website' })
          setActiveModal('')
        }}
      />
      
<FacebookPageModal
  open={activeModal === 'facebook'}
  name={details.facebook_page_name}
  url={details.facebook_page_url}
  imageUrl={details.facebook_page_image_url}
  fallbackImage={displayAvatar}
  onClose={() => setActiveModal('')}
  onUploadImage={() => openImagePicker('facebook')}
  onSave={({ name, url }) => {
    updateDetails({
      facebook_page_name: name,
      facebook_page_url: url,
    })
    setActiveModal('')
  }}
/>
      
      <TextEditModal
        open={activeModal === 'social'}
        title="Edit social media"
        label="Social media"
        value={details.social_media}
        multiline
        maxLength={220}
        placeholder="Add public handles or social links"
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ social_media: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'email'}
        title="Edit email"
        label="Email address"
        value={details.email}
        maxLength={120}
        placeholder="name@example.com"
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ email: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'phone'}
        title="Edit phone"
        label="Phone number"
        value={details.phone}
        maxLength={60}
        placeholder="+855 ..."
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ phone: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
        open={activeModal === 'messenger'}
        title="Edit Messenger"
        label="Messenger"
        value={details.messenger}
        maxLength={140}
        placeholder="Messenger name or link"
        onClose={() => setActiveModal('')}
        onSave={(value) => {
          updateDetails({ messenger: value })
          setActiveModal('')
        }}
      />

      <TextEditModal
  open={activeModal === 'telegram'}
  title="Edit Telegram"
  label="Telegram"
  value={details.telegram}
  maxLength={140}
  placeholder="https://t.me/yourname"
  onClose={() => setActiveModal('')}
  onSave={(value) => {
    updateDetails({ telegram: value })
    setActiveModal('')
  }}
/>
    </div>
  )
}
