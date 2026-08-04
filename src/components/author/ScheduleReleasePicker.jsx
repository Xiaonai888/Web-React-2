import { useEffect, useMemo, useRef, useState } from 'react'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(value) {
  return String(value).padStart(2, '0')
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

export default function ScheduleReleasePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}) {
  const defaultSchedule = useMemo(() => getDefaultSchedule(), [])
  const initialDate = date || defaultSchedule.date
  const initialTime = time || defaultSchedule.time
  const initialCursor = parseDateValue(initialDate) || new Date()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState('main')
  const [draftDate, setDraftDate] = useState(initialDate)
  const [draftTime, setDraftTime] = useState(initialTime)
  const [cursor, setCursor] = useState(initialCursor)
  const [pickerMonth, setPickerMonth] = useState(initialCursor.getMonth())
  const [pickerYear, setPickerYear] = useState(initialCursor.getFullYear())
  const [invalid, setInvalid] = useState(false)
  const monthListRef = useRef(null)
  const yearListRef = useRef(null)

  const selectedDate = parseDateValue(date || defaultSchedule.date)
  const draftSelectedDate = parseDateValue(draftDate)
  const calendarDays = useMemo(() => buildCalendarDays(cursor), [cursor])
  const currentYear = new Date().getFullYear()
  const years = useMemo(
    () => Array.from({ length: 101 }, (_, index) => currentYear - 50 + index),
    [currentYear]
  )

  useEffect(() => {
    if (!date) onDateChange(defaultSchedule.date)
    if (!time) onTimeChange(defaultSchedule.time)
  }, [date, defaultSchedule.date, defaultSchedule.time, onDateChange, onTimeChange, time])

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
    ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`
    : 'Select date'

  const openPicker = () => {
    const nextDate = date || defaultSchedule.date
    const nextTime = time || defaultSchedule.time
    const nextCursor = parseDateValue(nextDate) || new Date()

    setDraftDate(nextDate)
    setDraftTime(nextTime)
    setCursor(nextCursor)
    setPickerMonth(nextCursor.getMonth())
    setPickerYear(nextCursor.getFullYear())
    setView('main')
    setInvalid(false)
    setOpen(true)
  }

  const closePicker = () => {
    setInvalid(false)
    setOpen(false)
  }

  const confirmPicker = () => {
    const scheduledDate = new Date(`${draftDate}T${draftTime}:00`)

    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
      setInvalid(true)
      return
    }

    onDateChange(draftDate)
    onTimeChange(draftTime)
    setInvalid(false)
    setOpen(false)
  }

  const moveMonth = (amount) => {
    setCursor((value) => new Date(value.getFullYear(), value.getMonth() + amount, 1))
  }

  const openMonthYear = () => {
    setPickerMonth(cursor.getMonth())
    setPickerYear(cursor.getFullYear())
    setView('monthYear')
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
      <button
        type="button"
        onClick={openPicker}
        className="mx-auto flex w-full max-w-[330px] items-end justify-center gap-7 rounded-[18px] bg-white px-4 py-5 text-[#111827] active:scale-[0.99]"
      >
        <span className="min-w-[112px] border-b border-[#d7dce3] pb-2 text-center text-[14px] font-semibold">
          {displayDate}
        </span>

        <span className="pb-2 text-[13px] font-medium">at</span>

        <span className="min-w-[82px] border-b-2 border-[#2d9cdb] pb-2 text-center text-[14px] font-semibold">
          {time || defaultSchedule.time}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-[365px] overflow-hidden rounded-[18px] bg-white shadow-2xl">
            {view === 'main' ? (
              <>
                <div className="flex h-14 items-center justify-between border-b border-[#f1f2f4] px-4">
                  <button
                    type="button"
                    onClick={closePicker}
                    className="text-[12px] font-medium text-[#667085]"
                  >
                    Cancel
                  </button>

                  <div className="text-[14px] font-bold text-[#111827]">
                    Schedule Release
                  </div>

                  <button
                    type="button"
                    onClick={confirmPicker}
                    className="text-[12px] font-semibold text-[#ff4d67]"
                  >
                    OK
                  </button>
                </div>

                <div className="px-5 py-10">
                  <div className="flex items-end justify-center gap-7">
                    <button
                      type="button"
                      onClick={() => setView('calendar')}
                      className="min-w-[128px] border-b border-[#d7dce3] pb-2 text-center text-[15px] font-medium text-[#111827]"
                    >
                      {draftSelectedDate
                        ? `${MONTHS[draftSelectedDate.getMonth()]} ${draftSelectedDate.getDate()}`
                        : 'Select date'}
                    </button>

                    <span className="pb-2 text-[13px] text-[#111827]">at</span>

                    <input
                      type="time"
                      step="60"
                      value={draftTime}
                      onChange={(event) => {
                        setDraftTime(event.target.value)
                        setInvalid(false)
                      }}
                      className="w-[92px] border-b-2 border-[#2d9cdb] bg-transparent pb-2 text-center text-[15px] font-medium text-[#111827] outline-none"
                    />
                  </div>

                  {invalid ? (
                    <div className="mt-5 text-center text-[11px] font-semibold text-[#e5484d]">
                      Choose a future date and time.
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {view === 'calendar' ? (
              <>
                <div className="flex items-center justify-between px-5 pb-2 pt-5">
                  <button
                    type="button"
                    onClick={openMonthYear}
                    className="flex items-center gap-2 text-[17px] font-semibold text-[#252b36]"
                  >
                    <span className="text-[10px] text-[#8d94a1]">›</span>
                    <span>
                      {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveMonth(-1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[#667085] active:bg-[#f2f4f7]"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      onClick={() => moveMonth(1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[22px] text-[#667085] active:bg-[#f2f4f7]"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 px-4 pb-2">
                  {WEEK_DAYS.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-[12px] font-medium text-[#8d94a1]"
                    >
                      {day}
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
                              ? 'text-[#b2b8c2]'
                              : today
                                ? 'font-semibold text-[#168fd0] ring-1 ring-[#7cc8ef]'
                                : 'text-[#111827]'
                        } disabled:cursor-not-allowed disabled:text-[#d0d5dd]`}
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
                    Close
                  </button>
                </div>
              </>
            ) : null}

            {view === 'monthYear' ? (
              <>
                <div className="px-5 pb-2 pt-5">
                  <div className="flex items-center gap-2 text-[17px] font-semibold text-[#252b36]">
                    <span className="text-[10px] text-[#8d94a1]">›</span>
                    <span>
                      {MONTHS[pickerMonth]} {pickerYear}
                    </span>
                  </div>
                </div>

                <div className="mx-5 mt-4 grid grid-cols-2 gap-5">
                  <div
                    ref={monthListRef}
                    className="h-[190px] overflow-y-auto border-y border-[#2d9cdb] py-[70px]"
                  >
                    {MONTHS.map((month, index) => (
                      <button
                        type="button"
                        data-month={index}
                        key={month}
                        onClick={() => setPickerMonth(index)}
                        className={`flex h-10 w-full items-center justify-center text-[14px] ${
                          pickerMonth === index
                            ? 'font-medium text-[#111827]'
                            : 'text-[#8d94a1]'
                        }`}
                      >
                        {month}
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
                            ? 'font-medium text-[#111827]'
                            : 'text-[#8d94a1]'
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
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={showSelectedMonth}
                    className="text-[14px] font-medium text-[#168fd0]"
                  >
                    Show
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
