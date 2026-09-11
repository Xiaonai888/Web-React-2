import { useEffect, useMemo, useRef, useState } from 'react'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('scheduleReleasePicker', {
  en: {
    selectDate: "Select date",
    at: "at",
    cancel: "Cancel",
    scheduleRelease: "Schedule Release",
    ok: "OK",
    futureDateTime: "Choose a future date and time.",
    selectTime: "Select Time",
    hour: "Hour",
    minute: "Minute",
    timeHint: "Scroll, swipe, tap, or type the time directly.",
    show: "Show",
    close: "Close",
  },
  km: {
    selectDate: "ជ្រើសកាលបរិច្ឆេទ",
    at: "ម៉ោង",
    cancel: "បោះបង់",
    scheduleRelease: "កំណត់ពេលបោះផ្សាយ",
    ok: "យល់ព្រម",
    futureDateTime: "សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោងនាពេលអនាគត។",
    selectTime: "ជ្រើសម៉ោង",
    hour: "ម៉ោង",
    minute: "នាទី",
    timeHint: "អូស ប៉ះ ឬវាយម៉ោងដោយផ្ទាល់។",
    show: "បង្ហាញ",
    close: "បិទ",
  },
  zh: {
    selectDate: "选择日期",
    at: "时间",
    cancel: "取消",
    scheduleRelease: "定时发布",
    ok: "确定",
    futureDateTime: "请选择未来的日期和时间。",
    selectTime: "选择时间",
    hour: "小时",
    minute: "分钟",
    timeHint: "可滚动、滑动、点击或直接输入时间。",
    show: "显示",
    close: "关闭",
  },
  ja: {
    selectDate: "日付を選択",
    at: "時刻",
    cancel: "キャンセル",
    scheduleRelease: "公開予約",
    ok: "OK",
    futureDateTime: "未来の日付と時刻を選択してください。",
    selectTime: "時刻を選択",
    hour: "時",
    minute: "分",
    timeHint: "スクロール、スワイプ、タップ、または直接入力できます。",
    show: "表示",
    close: "閉じる",
  },
  ko: {
    selectDate: "날짜 선택",
    at: "시간",
    cancel: "취소",
    scheduleRelease: "게시 예약",
    ok: "확인",
    futureDateTime: "미래 날짜와 시간을 선택해 주세요.",
    selectTime: "시간 선택",
    hour: "시",
    minute: "분",
    timeHint: "스크롤, 스와이프, 탭 또는 직접 입력할 수 있습니다.",
    show: "표시",
    close: "닫기",
  },
})

const MONTH_INDEXES = Array.from({ length: 12 }, (_, index) => index)
const WEEK_DAY_INDEXES = Array.from({ length: 7 }, (_, index) => index)

function formatMonthName(month, year = 2024) {
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    month: 'long',
  }).format(new Date(year, month, 1))
}

function formatMonthYear(date) {
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatMonthDay(date) {
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatWeekDay(index) {
  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    weekday: 'short',
  }).format(new Date(2024, 0, 7 + index))
}


function pad(value) {
  return String(value).padStart(2, '0')
}

function wrap(value, max) {
  return (value + max + 1) % (max + 1)
}

function toDateValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function toTimeValue(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function parseDateValue(value) {
  const [year, month, day] = String(value || '').split('-').map(Number)

  if (!year || !month || !day) return null

  const date = new Date(year, month - 1, day)

  return Number.isNaN(date.getTime()) ? null : date
}

function parseTimeValue(value) {
  const [hour, minute] = String(value || '').split(':').map(Number)

  return {
    hour: Number.isFinite(hour) ? wrap(hour, 23) : 0,
    minute: Number.isFinite(minute) ? wrap(minute, 59) : 0,
  }
}

function getDefaultSchedule() {
  const date = new Date()
  date.setMinutes(date.getMinutes() + 15)
  date.setSeconds(0, 0)

  return {
    date: toDateValue(date),
    time: toTimeValue(date),
  }
}

function isBeforeToday(date) {
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const today = new Date()
  const todayValue = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

  return value < todayValue
}

function isSameDate(first, second) {
  return (
    first &&
    second &&
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function buildCalendarDays(cursor) {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1)
  const start = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

function LoopingTimeColumn({ value, max, label, onChange }) {
  const [text, setText] = useState(pad(value))
  const touchStartRef = useRef(null)

  useEffect(() => {
    setText(pad(value))
  }, [value])

  const move = (amount) => {
    onChange(wrap(value + amount, max))
  }

  const commitText = () => {
    if (!text.trim()) {
      setText(pad(value))
      return
    }

    const parsed = Number(text)
    const nextValue = Number.isFinite(parsed)
      ? Math.min(max, Math.max(0, parsed))
      : value

    onChange(nextValue)
    setText(pad(nextValue))
  }

  return (
    <div
      className="w-[108px] select-none text-center"
      onWheel={(event) => {
        event.preventDefault()
        move(event.deltaY > 0 ? 1 : -1)
      }}
      onTouchStart={(event) => {
        touchStartRef.current = event.touches[0]?.clientY ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStartRef.current
        const end = event.changedTouches[0]?.clientY

        touchStartRef.current = null

        if (start == null || end == null || Math.abs(start - end) < 16) return

        move(start > end ? 1 : -1)
      }}
    >
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--shadow-text-tertiary)]">
        {label}
      </div>

      <button
        type="button"
        onClick={() => move(-1)}
        className="h-10 w-full text-[15px] text-[var(--shadow-text-tertiary)]"
      >
        {pad(wrap(value - 1, max))}
      </button>

      <div className="border-y-2 border-[#2d9cdb] py-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={text}
          aria-label={label}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '').slice(0, 2)
            setText(digits)

            if (digits.length === 2) {
              const parsed = Number(digits)

              if (parsed >= 0 && parsed <= max) onChange(parsed)
            }
          }}
          onBlur={commitText}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              move(-1)
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault()
              move(1)
            }

            if (event.key === 'Enter') event.currentTarget.blur()
          }}
          className="h-10 w-full bg-transparent text-center text-[22px] font-semibold text-[var(--shadow-text-primary)] outline-none"
        />
      </div>

      <button
        type="button"
        onClick={() => move(1)}
        className="h-10 w-full text-[15px] text-[var(--shadow-text-tertiary)]"
      >
        {pad(wrap(value + 1, max))}
      </button>
    </div>
  )
}

export default function ScheduleReleasePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  open: controlledOpen,
  onClose,
  onSave,
  hideTrigger = false,
}) {
  useDisplayTranslation()
  const defaultSchedule = useMemo(() => getDefaultSchedule(), [])
  const initialDate = date || defaultSchedule.date
  const initialTime = time || defaultSchedule.time
  const initialCursor = parseDateValue(initialDate) || new Date()
  const isControlled = typeof controlledOpen === 'boolean'

  const [internalOpen, setInternalOpen] = useState(false)
  const open = isControlled ? controlledOpen : internalOpen
  const [view, setView] = useState('main')
  const [draftDate, setDraftDate] = useState(initialDate)
  const [draftTime, setDraftTime] = useState(initialTime)
  const [timeBeforeEdit, setTimeBeforeEdit] = useState(initialTime)
  const [cursor, setCursor] = useState(initialCursor)
  const [pickerMonth, setPickerMonth] = useState(initialCursor.getMonth())
  const [pickerYear, setPickerYear] = useState(initialCursor.getFullYear())
  const [invalid, setInvalid] = useState(false)
  const monthListRef = useRef(null)
  const yearListRef = useRef(null)

  const selectedDate = parseDateValue(date || defaultSchedule.date)
  const draftSelectedDate = parseDateValue(draftDate)
  const draftTimeParts = parseTimeValue(draftTime)
  const calendarDays = useMemo(() => buildCalendarDays(cursor), [cursor])
  const currentYear = new Date().getFullYear()
  const years = useMemo(
    () => Array.from({ length: 101 }, (_, index) => currentYear - 50 + index),
    [currentYear]
  )

  useEffect(() => {
    if (isControlled && !open) return
    if (!date) onDateChange?.(defaultSchedule.date)
    if (!time) onTimeChange?.(defaultSchedule.time)
  }, [
    date,
    defaultSchedule.date,
    defaultSchedule.time,
    isControlled,
    onDateChange,
    onTimeChange,
    open,
    time,
  ])

  useEffect(() => {
    if (!open) return

    const nextDate = date || defaultSchedule.date
    const nextTime = time || defaultSchedule.time
    const nextCursor = parseDateValue(nextDate) || new Date()

    setDraftDate(nextDate)
    setDraftTime(nextTime)
    setTimeBeforeEdit(nextTime)
    setCursor(nextCursor)
    setPickerMonth(nextCursor.getMonth())
    setPickerYear(nextCursor.getFullYear())
    setView('main')
    setInvalid(false)
  }, [date, defaultSchedule.date, defaultSchedule.time, open, time])

  useEffect(() => {
    if (!open) return undefined

    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = oldOverflow
    }
  }, [open])

  useEffect(() => {
    if (view !== 'monthYear') return

    window.requestAnimationFrame(() => {
      monthListRef.current
        ?.querySelector(`[data-month="${pickerMonth}"]`)
        ?.scrollIntoView({ block: 'center' })

      yearListRef.current
        ?.querySelector(`[data-year="${pickerYear}"]`)
        ?.scrollIntoView({ block: 'center' })
    })
  }, [pickerMonth, pickerYear, view])

  const displayDate = selectedDate
    ? formatMonthDay(selectedDate)
    : getDisplayText('scheduleReleasePicker.selectDate')

  const updateDraftTime = (hour, minute) => {
    setDraftTime(`${pad(hour)}:${pad(minute)}`)
    setInvalid(false)
  }

  const openPicker = () => {
    if (!isControlled) setInternalOpen(true)
  }

  const closePicker = () => {
    setInvalid(false)

    if (isControlled) {
      onClose?.()
      return
    }

    setInternalOpen(false)
  }

  const confirmPicker = () => {
    const scheduledDate = new Date(`${draftDate}T${draftTime}:00`)

    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
      setInvalid(true)
      return
    }

    if (onSave) {
      onSave(draftDate, draftTime)
    } else {
      onDateChange?.(draftDate)
      onTimeChange?.(draftTime)
    }

    setInvalid(false)

    if (isControlled) {
      onClose?.()
      return
    }

    setInternalOpen(false)
  }

  const moveMonth = (amount) => {
    setCursor((value) => new Date(value.getFullYear(), value.getMonth() + amount, 1))
  }

  const openMonthYear = () => {
    setPickerMonth(cursor.getMonth())
    setPickerYear(cursor.getFullYear())
    setView('monthYear')
  }

  const openTimePicker = () => {
    setTimeBeforeEdit(draftTime)
    setView('time')
  }

  const cancelTimePicker = () => {
    setDraftTime(timeBeforeEdit)
    setInvalid(false)
    setView('main')
  }

  const showSelectedMonth = () => {
    setCursor(new Date(pickerYear, pickerMonth, 1))
    setView('calendar')
  }

  const chooseDate = (value) => {
    if (isBeforeToday(value)) return

    setDraftDate(toDateValue(value))
    setCursor(new Date(value.getFullYear(), value.getMonth(), 1))
    setInvalid(false)
    setView('main')
  }

  return (
    <>
      {!hideTrigger ? (
        <button
          type="button"
          onClick={openPicker}
          className="mx-auto flex w-full max-w-[330px] items-end justify-center gap-7 rounded-[18px] bg-[var(--shadow-bg-surface)] px-4 py-5 text-[var(--shadow-text-primary)] active:scale-[0.99]"
        >
          <span className="min-w-[112px] border-b border-[var(--shadow-border)] pb-2 text-center text-[14px] font-semibold">
            {displayDate}
          </span>

          <span className="pb-2 text-[13px] font-medium">{getDisplayText('scheduleReleasePicker.at')}</span>

          <span className="min-w-[82px] border-b-2 border-[#2d9cdb] pb-2 text-center text-[14px] font-semibold">
            {time || defaultSchedule.time}
          </span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-[365px] overflow-hidden rounded-[18px] bg-[var(--shadow-bg-surface)] shadow-2xl">
            {view === 'main' ? (
              <>
                <div className="flex h-14 items-center justify-between border-b border-[var(--shadow-border)] px-4">
                  <button
                    type="button"
                    onClick={closePicker}
                    className="text-[12px] font-medium text-[var(--shadow-text-secondary)]"
                  >
                    {getDisplayText('scheduleReleasePicker.cancel')}
                  </button>

                  <div className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
                    {getDisplayText('scheduleReleasePicker.scheduleRelease')}
                  </div>

                  <button
                    type="button"
                    onClick={confirmPicker}
                    className="text-[12px] font-semibold text-[#2d9cdb]"
                  >
                    {getDisplayText('scheduleReleasePicker.ok')}
                  </button>
                </div>

                <div className="px-5 py-10">
                  <div className="flex items-end justify-center gap-7">
                    <button
                      type="button"
                      onClick={() => setView('calendar')}
                      className="min-w-[128px] border-b border-[var(--shadow-border)] pb-2 text-center text-[15px] font-medium text-[var(--shadow-text-primary)]"
                    >
                      {draftSelectedDate
                        ? formatMonthDay(draftSelectedDate)
                        : getDisplayText('scheduleReleasePicker.selectDate')}
                    </button>

                    <span className="pb-2 text-[13px] text-[var(--shadow-text-primary)]">{getDisplayText('scheduleReleasePicker.at')}</span>

                    <button
                      type="button"
                      onClick={openTimePicker}
                      className="w-[92px] border-b-2 border-[#2d9cdb] bg-transparent pb-2 text-center text-[15px] font-medium text-[var(--shadow-text-primary)]"
                    >
                      {draftTime}
                    </button>
                  </div>

                  {invalid ? (
                    <div className="mt-5 text-center text-[11px] font-semibold text-[#e5484d]">
                      {getDisplayText('scheduleReleasePicker.futureDateTime')}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {view === 'time' ? (
              <>
                <div className="px-5 pb-2 pt-5">
                  <div className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">
                    {getDisplayText('scheduleReleasePicker.selectTime')}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 px-5 py-5">
                  <LoopingTimeColumn
                    value={draftTimeParts.hour}
                    max={23}
                    label={getDisplayText('scheduleReleasePicker.hour')}
                    onChange={(hour) => updateDraftTime(hour, draftTimeParts.minute)}
                  />

                  <div className="pt-5 text-[24px] font-semibold text-[var(--shadow-text-primary)]">:</div>

                  <LoopingTimeColumn
                    value={draftTimeParts.minute}
                    max={59}
                    label={getDisplayText('scheduleReleasePicker.minute')}
                    onChange={(minute) => updateDraftTime(draftTimeParts.hour, minute)}
                  />
                </div>

                <div className="px-6 text-center text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">
                  {getDisplayText('scheduleReleasePicker.timeHint')}
                </div>

                <div className="flex justify-end gap-8 px-6 pb-5 pt-5">
                  <button
                    type="button"
                    onClick={cancelTimePicker}
                    className="text-[14px] font-medium text-[#168fd0]"
                  >
                    {getDisplayText('scheduleReleasePicker.cancel')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('main')}
                    className="text-[14px] font-medium text-[#168fd0]"
                  >
                    {getDisplayText('scheduleReleasePicker.show')}
                  </button>
                </div>
              </>
            ) : null}

            {view === 'calendar' ? (
              <>
                <div className="flex items-center justify-between px-5 pb-2 pt-5">
                  <button
                    type="button"
                    onClick={openMonthYear}
                    className="flex items-center gap-2 text-[17px] font-semibold text-[var(--shadow-text-primary)]"
                  >
                    <span className="text-[10px] text-[var(--shadow-text-tertiary)]">›</span>
                    <span>
                      {formatMonthYear(cursor)}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveMonth(-1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-soft)]"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      onClick={() => moveMonth(1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-soft)]"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 px-4 pb-2">
                  {WEEK_DAY_INDEXES.map((dayIndex) => (
                    <div
                      key={dayIndex}
                      className="py-2 text-center text-[12px] font-medium text-[var(--shadow-text-tertiary)]"
                    >
                      {formatWeekDay(dayIndex)}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 px-4">
                  {calendarDays.map((day) => {
                    const outsideMonth = day.getMonth() !== cursor.getMonth()
                    const disabled = isBeforeToday(day)
                    const selected = isSameDate(day, draftSelectedDate)
                    const today = isSameDate(day, new Date())

                    return (
                      <button
                        type="button"
                        key={toDateValue(day)}
                        disabled={disabled}
                        onClick={() => chooseDate(day)}
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] ${
                          selected
                            ? 'bg-[#3fa4dc] font-semibold text-white'
                            : outsideMonth
                              ? 'text-[var(--shadow-text-disabled)]'
                              : today
                                ? 'font-semibold text-[#168fd0] ring-1 ring-[#7cc8ef]'
                                : 'text-[var(--shadow-text-primary)]'
                        } disabled:cursor-not-allowed disabled:text-[var(--shadow-text-disabled)]`}
                      >
                        {day.getDate()}
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-end px-5 pb-5 pt-4">
                  <button
                    type="button"
                    onClick={() => setView('main')}
                    className="text-[14px] font-medium text-[#168fd0]"
                  >
                    {getDisplayText('scheduleReleasePicker.close')}
                  </button>
                </div>
              </>
            ) : null}

            {view === 'monthYear' ? (
              <>
                <div className="px-5 pb-2 pt-5">
                  <div className="flex items-center gap-2 text-[17px] font-semibold text-[var(--shadow-text-primary)]">
                    <span className="text-[10px] text-[var(--shadow-text-tertiary)]">›</span>
                    <span>
                      {formatMonthYear(new Date(pickerYear, pickerMonth, 1))}
                    </span>
                  </div>
                </div>

                <div className="mx-5 mt-4 grid grid-cols-2 gap-5">
                  <div
                    ref={monthListRef}
                    className="h-[190px] overflow-y-auto border-y border-[#2d9cdb] py-[70px]"
                  >
                    {MONTH_INDEXES.map((index) => (
                      <button
                        type="button"
                        data-month={index}
                        key={index}
                        onClick={() => setPickerMonth(index)}
                        className={`flex h-10 w-full items-center justify-center text-[14px] ${
                          pickerMonth === index
                            ? 'font-medium text-[var(--shadow-text-primary)]'
                            : 'text-[var(--shadow-text-tertiary)]'
                        }`}
                      >
                        {formatMonthName(index, pickerYear)}
                      </button>
                    ))}
                  </div>

                  <div
                    ref={yearListRef}
                    className="h-[190px] overflow-y-auto border-y border-[#2d9cdb] py-[70px]"
                  >
                    {years.map((year) => (
                      <button
                        type="button"
                        data-year={year}
                        key={year}
                        onClick={() => setPickerYear(year)}
                        className={`flex h-10 w-full items-center justify-center text-[14px] ${
                          pickerYear === year
                            ? 'font-medium text-[var(--shadow-text-primary)]'
                            : 'text-[var(--shadow-text-tertiary)]'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-8 px-6 pb-5 pt-5">
                  <button
                    type="button"
                    onClick={() => setView('calendar')}
                    className="text-[14px] font-medium text-[#168fd0]"
                  >
                    {getDisplayText('scheduleReleasePicker.cancel')}
                  </button>

                  <button
                    type="button"
                    onClick={showSelectedMonth}
                    className="text-[14px] font-medium text-[#168fd0]"
                  >
                    {getDisplayText('scheduleReleasePicker.show')}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
