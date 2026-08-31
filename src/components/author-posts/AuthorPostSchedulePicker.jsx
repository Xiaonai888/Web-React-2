import { useEffect, useMemo, useState } from 'react'

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
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  return value.getTime() < today.getTime()
}

function isSameDate(first, second) {
  return Boolean(
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

export default function AuthorPostSchedulePicker({
  open,
  date,
  time,
  onClose,
  onSave,
}) {
  const defaults = useMemo(() => getDefaultSchedule(), [])
  const [draftDate, setDraftDate] = useState(date || defaults.date)
  const [draftTime, setDraftTime] = useState(time || defaults.time)
  const [cursor, setCursor] = useState(
    parseDateValue(date || defaults.date) || new Date()
  )
  const [invalid, setInvalid] = useState(false)

  const selectedDate = parseDateValue(draftDate)
  const calendarDays = useMemo(() => buildCalendarDays(cursor), [cursor])

  useEffect(() => {
    if (!open) return

    const nextDate = date || defaults.date
    const nextTime = time || defaults.time
    const nextCursor = parseDateValue(nextDate) || new Date()

    setDraftDate(nextDate)
    setDraftTime(nextTime)
    setCursor(nextCursor)
    setInvalid(false)
  }, [date, defaults.date, defaults.time, open, time])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  function moveMonth(amount) {
    setCursor(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1
        )
    )
  }

  function chooseDate(value) {
    if (isBeforeToday(value)) return

    setDraftDate(toDateValue(value))
    setCursor(
      new Date(
        value.getFullYear(),
        value.getMonth(),
        1
      )
    )
    setInvalid(false)
  }

  function confirm() {
    const scheduledDate = new Date(
      `${draftDate}T${draftTime}:00`
    )

    if (
      Number.isNaN(scheduledDate.getTime()) ||
      scheduledDate.getTime() <= Date.now()
    ) {
      setInvalid(true)
      return
    }

    onSave?.(draftDate, draftTime)
  }

  return (
    <div className="fixed inset-0 z-[320] flex items-end justify-center bg-black/40 sm:items-center sm:px-4">
      <button
        type="button"
        aria-label="Close schedule"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 w-full max-w-[390px] rounded-t-[26px] bg-white pb-[calc(env(safe-area-inset-bottom)+18px)] shadow-2xl sm:rounded-[22px] sm:pb-5">
        <div className="mx-auto mt-3 h-1 w-11 rounded-full bg-[#9ca3af]" />

        <header className="flex h-14 items-center justify-between border-b border-[#eef0f4] px-4">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-medium text-[#6b7280]"
          >
            Cancel
          </button>

          <h2 className="text-[16px] font-bold text-[#111827]">
            Schedule Post
          </h2>

          <button
            type="button"
            onClick={confirm}
            className="text-[13px] font-semibold text-[#111827]"
          >
            Save
          </button>
        </header>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[20px] text-[#4b5563] active:bg-[#f3f4f6]"
            >
              ‹
            </button>

            <div className="text-[16px] font-semibold text-[#111827]">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </div>

            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[20px] text-[#4b5563] active:bg-[#f3f4f6]"
            >
              ›
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[11px] font-medium text-[#9ca3af]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((day) => {
              const outsideMonth =
                day.getMonth() !== cursor.getMonth()
              const disabled = isBeforeToday(day)
              const selected = isSameDate(
                day,
                selectedDate
              )
              const today = isSameDate(
                day,
                new Date()
              )

              return (
                <button
                  type="button"
                  key={toDateValue(day)}
                  disabled={disabled}
                  onClick={() => chooseDate(day)}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] ${
                    selected
                      ? 'bg-[#111827] font-semibold text-white'
                      : outsideMonth
                        ? 'text-[#c4c8ce]'
                        : today
                          ? 'font-semibold text-[#111827] ring-1 ring-[#111827]'
                          : 'text-[#111827]'
                  } disabled:cursor-not-allowed disabled:text-[#d1d5db]`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-5 rounded-[16px] bg-[#f5f6f8] p-4">
            <label className="block text-[12px] font-semibold text-[#6b7280]">
              Publish time
            </label>

            <input
              type="time"
              value={draftTime}
              onChange={(event) => {
                setDraftTime(event.target.value)
                setInvalid(false)
              }}
              className="mt-2 h-11 w-full rounded-[12px] border border-[#d9dde4] bg-white px-3 text-[15px] font-medium text-[#111827] outline-none focus:border-[#111827]"
            />
          </div>

          {invalid ? (
            <p className="mt-3 text-center text-[12px] font-medium text-[#dc2626]">
              Choose a future date and time.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
