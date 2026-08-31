import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getDisplayLanguageId,
  useDisplayTranslation,
} from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPostFilterSheet', {
  en: {
    su: 'Su',
    mo: 'Mo',
    tu: 'Tu',
    we: 'We',
    th: 'Th',
    fr: 'Fr',
    sa: 'Sa',
    selectDate: 'Select date',
    today: 'Today',
    cancel: 'Cancel',
    ok: 'OK',
    postFilters: 'Post filters',
    goTo: 'Go to:',
    clear: 'Clear',
    done: 'Done',
  },
  km: {
    su: 'អា',
    mo: 'ច',
    tu: 'អ',
    we: 'ព',
    th: 'ព្រ',
    fr: 'សុ',
    sa: 'ស',
    selectDate: 'ជ្រើសកាលបរិច្ឆេទ',
    today: 'ថ្ងៃនេះ',
    cancel: 'បោះបង់',
    ok: 'យល់ព្រម',
    postFilters: 'តម្រងប្រកាស',
    goTo: 'ទៅកាន់៖',
    clear: 'សម្អាត',
    done: 'រួចរាល់',
  },
  zh: {
    su: '日',
    mo: '一',
    tu: '二',
    we: '三',
    th: '四',
    fr: '五',
    sa: '六',
    selectDate: '选择日期',
    today: '今天',
    cancel: '取消',
    ok: '确定',
    postFilters: '帖子筛选',
    goTo: '前往：',
    clear: '清除',
    done: '完成',
  },
  ja: {
    su: '日',
    mo: '月',
    tu: '火',
    we: '水',
    th: '木',
    fr: '金',
    sa: '土',
    selectDate: '日付を選択',
    today: '今日',
    cancel: 'キャンセル',
    ok: 'OK',
    postFilters: '投稿フィルター',
    goTo: '移動：',
    clear: 'クリア',
    done: '完了',
  },
  ko: {
    su: '일',
    mo: '월',
    tu: '화',
    we: '수',
    th: '목',
    fr: '금',
    sa: '토',
    selectDate: '날짜 선택',
    today: '오늘',
    cancel: '취소',
    ok: '확인',
    postFilters: '게시물 필터',
    goTo: '이동:',
    clear: '지우기',
    done: '완료',
  },
})

const LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

const WEEKDAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']

function getTodayValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateValue(value) {
  const [year, month, day] = String(value || '')
    .split('-')
    .map(Number)

  if (!year || !month || !day) return null

  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function toDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDate(value, t) {
  return value
    ? value.replaceAll('-', '/')
    : t('authorPostFilterSheet.selectDate')
}

function isSameDay(first, second) {
  return (
    first?.getFullYear() === second?.getFullYear() &&
    first?.getMonth() === second?.getMonth() &&
    first?.getDate() === second?.getDate()
  )
}

function isSameMonth(first, second) {
  return (
    first?.getFullYear() === second?.getFullYear() &&
    first?.getMonth() === second?.getMonth()
  )
}

function buildCalendarDays(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return date
  })
}

function CalendarDialog({ open, value, onClose, onConfirm, t, languageId }) {
  const todayValue = getTodayValue()
  const today = parseDateValue(todayValue)
  const initialDate = parseDateValue(value) || today
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  )

  useEffect(() => {
    if (!open) return

    const nextDate = parseDateValue(value) || today
    setSelectedDate(nextDate)
    setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
  }, [open, value])

  const days = useMemo(() => buildCalendarDays(viewDate), [viewDate])
  const locale = LOCALES[languageId] || LOCALES.en
  const monthLabel = viewDate.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  })

  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const nextMonthDisabled =
    viewDate.getFullYear() === currentMonth.getFullYear() &&
    viewDate.getMonth() === currentMonth.getMonth()

  if (!open) return null

  function moveMonth(direction) {
    setViewDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + direction,
          1
        )
    )
  }

  function chooseToday() {
    setSelectedDate(today)
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  function confirmDate() {
    if (!selectedDate) return
    onConfirm?.(toDateValue(selectedDate))
  }

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/40 px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close calendar"
      />

      <section
        className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-[20px] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Choose date"
      >
        <div className="border-b border-[var(--shadow-border)] px-5 py-4">
          <div className="text-[11px] font-medium text-[var(--shadow-text-secondary)]">
            {selectedDate?.getFullYear()}
          </div>

          <div className="mt-1 truncate text-[20px] font-medium text-[var(--shadow-text-primary)]">
            {selectedDate?.toLocaleDateString(locale, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="px-4 pb-3 pt-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-soft)]"
              aria-label="Previous month"
            >
              <i className="fa-solid fa-chevron-left text-[13px]" />
            </button>

            <div className="min-w-0 px-2 text-center text-[15px] font-medium text-[var(--shadow-text-primary)]">
              {monthLabel}
            </div>

            <button
              type="button"
              disabled={nextMonthDisabled}
              onClick={() => moveMonth(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
              aria-label="Next month"
            >
              <i className="fa-solid fa-chevron-right text-[13px]" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-[12px] font-medium text-[var(--shadow-text-secondary)]"
              >
                {t(`authorPostFilterSheet.${day}`)}
              </div>
            ))}

            {days.map((date) => {
              const disabled = date.getTime() > today.getTime()
              const selected = isSameDay(date, selectedDate)
              const inCurrentMonth = isSameMonth(date, viewDate)

              return (
                <button
                  key={toDateValue(date)}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedDate(date)}
                  className="flex h-10 items-center justify-center disabled:cursor-not-allowed"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-normal transition-colors ${
                      selected
                        ? 'bg-[#8b5cf6] text-white shadow-[0_3px_10px_rgba(139,92,246,0.28)]'
                        : inCurrentMonth
                          ? 'text-[var(--shadow-text-primary)] hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-soft)]'
                          : 'text-[var(--shadow-text-tertiary)] hover:bg-[var(--shadow-bg-hover)]'
                    } ${disabled ? 'text-[var(--shadow-text-disabled)] hover:bg-transparent' : ''}`}
                  >
                    {date.getDate()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-[var(--shadow-border)] px-3 py-2">
          <button
            type="button"
            onClick={chooseToday}
            className="rounded-[10px] px-3 py-2 text-[13px] font-medium text-[#6d28d9] hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-soft)]"
          >
            {t('authorPostFilterSheet.today')}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] px-3 py-2 text-[13px] font-medium text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-hover)] active:bg-[var(--shadow-bg-soft)]"
          >
            {t('authorPostFilterSheet.cancel')}
          </button>

          <button
            type="button"
            onClick={confirmDate}
            className="rounded-[10px] bg-[var(--shadow-text-primary)] px-4 py-2 text-[13px] font-medium text-[var(--shadow-bg-page)] active:scale-[0.98]"
          >
            {t('authorPostFilterSheet.ok')}
          </button>
        </div>
      </section>
    </div>
  )
}

export default function AuthorPostFilterSheet({
  open,
  value,
  onClose,
  onApply,
  onClear,
}) {
  const { t } = useDisplayTranslation()
  const languageId = getDisplayLanguageId()
  const dragStartYRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const draggingRef = useRef(false)
  const [draft, setDraft] = useState(value || '')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  useEffect(() => {
    if (!open) return
    setDraft(value || getTodayValue())
    setCalendarOpen(false)
    dragOffsetRef.current = 0
    setDragOffset(0)
  }, [open, value])

  useEffect(() => {
    if (!open) return undefined

    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    function handleEscape(event) {
      if (event.key !== 'Escape') return

      if (calendarOpen) {
        setCalendarOpen(false)
        return
      }

      onClose?.()
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, calendarOpen, onClose])

  if (!open) return null

  function startDrag(event) {
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

  function moveDrag(event) {
    if (!draggingRef.current) return

    const nextOffset = Math.max(
      0,
      event.clientY - dragStartYRef.current
    )

    dragOffsetRef.current = Math.min(nextOffset, 260)
    setDragOffset(dragOffsetRef.current)
  }

  function endDrag() {
    if (!draggingRef.current) return

    draggingRef.current = false

    if (dragOffsetRef.current > 80) {
      onClose?.()
      return
    }

    dragOffsetRef.current = 0
    setDragOffset(0)
  }

  function handleDone() {
    if (!draft) return
    onApply?.(draft)
    onClose?.()
  }

  function handleClear() {
    setDraft('')
    onClear?.()
    onClose?.()
  }

  return (
    <>
      <div className="fixed inset-0 z-[320]">
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
          aria-label="Close post filters"
        />

        <section
          className={`absolute bottom-0 left-0 right-0 mx-auto w-full rounded-t-[24px] bg-[var(--shadow-bg-elevated)] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:bottom-6 sm:max-w-[500px] sm:rounded-[24px] ${
            draggingRef.current
              ? ''
              : 'transition-transform duration-200 ease-out'
          }`}
          style={{
            transform: `translateY(${dragOffset}px)`,
          }}
          role="dialog"
          aria-modal="true"
          aria-label={t('authorPostFilterSheet.postFilters')}
        >
          <div
            className="mx-auto flex h-7 w-full cursor-grab items-start justify-center active:cursor-grabbing"
            style={{ touchAction: 'none' }}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <span className="mt-0.5 h-1 w-12 rounded-full bg-[var(--shadow-text-tertiary)]" />
          </div>

          <h2 className="pb-5 text-center text-[19px] font-medium text-[var(--shadow-text-primary)]">
            {t('authorPostFilterSheet.postFilters')}
          </h2>

          <div className="border-t border-[var(--shadow-border)] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5 text-[var(--shadow-text-primary)]">
                <i className="fa-regular fa-calendar-days shrink-0 text-[21px] text-[#8b5cf6]" />
                <span className="truncate text-[16px] font-normal">
                  {t('authorPostFilterSheet.goTo')}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCalendarOpen(true)}
                className="flex h-12 min-w-0 max-w-[190px] shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[var(--shadow-bg-soft)] px-3 text-[var(--shadow-text-primary)] active:scale-[0.99] sm:min-w-[160px]"
              >
                <span className="truncate text-[14px] font-normal">
                  {formatDate(draft, t)}
                </span>
                <i className="fa-solid fa-caret-down shrink-0 text-[12px]" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="h-12 rounded-[14px] bg-[var(--shadow-bg-soft)] text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-[0.99]"
              >
                {t('authorPostFilterSheet.clear')}
              </button>

              <button
                type="button"
                onClick={handleDone}
                disabled={!draft}
                className="h-12 rounded-[14px] bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] text-[14px] font-medium text-white shadow-[0_6px_16px_rgba(139,92,246,0.24)] active:scale-[0.99] disabled:opacity-60"
              >
                {t('authorPostFilterSheet.done')}
              </button>
            </div>
          </div>
        </section>
      </div>

      <CalendarDialog
        open={calendarOpen}
        value={draft}
        onClose={() => setCalendarOpen(false)}
        onConfirm={(nextValue) => {
          setDraft(nextValue)
          setCalendarOpen(false)
        }}
        t={t}
        languageId={languageId}
      />
    </>
  )
}
