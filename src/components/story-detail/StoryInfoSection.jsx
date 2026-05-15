import { useState } from 'react'

function getUpdateHintLabel(days) {
  if (!Array.isArray(days) || days.length === 0) return 'Irregular'
  if (days.length === 7) return 'Everyday'
  if (days.length === 1) return `Every ${days[0]}`
  if (days.length === 2) return days.join(', ')
  return `${days.length} days/week`
}

export default function StoryInfoSection({ story }) {
  const [expanded, setExpanded] = useState(false)
  const tags = Array.isArray(story?.tags) ? story.tags.slice(0, 6) : []
  const updateLabel = getUpdateHintLabel(story?.update_days)
  const description = story?.description || 'No description yet.'

  return (
    <section className="mt-4 rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
      <div className="flex items-center justify-between gap-3 rounded-[20px] bg-[#f8fafc] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] text-white">
            <i className="fa-regular fa-calendar-check text-[15px]" />
          </div>
          <div>
            <div className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#98a2b3]">Updates</div>
            <div className="mt-0.5 text-[14px] font-black text-[#111827]">{updateLabel}</div>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-[10.5px] font-extrabold text-[#667085] shadow-sm ring-1 ring-black/5">
          Update Hint
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-4 w-full text-left"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-black text-[#111827]">Description</h3>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
            <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'} text-[12px]`} />
          </span>
        </div>

        <p className={`mt-3 text-[13.5px] font-medium leading-7 text-[#555b66] ${expanded ? '' : 'line-clamp-4'}`}>
          {description}
        </p>
      </button>

      {expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-3 w-full rounded-[16px] bg-[#f5f3fa] px-4 py-3 text-center text-[12px] font-extrabold text-[#667085]"
        >
          Tap to collapse
        </button>
      ) : null}

      {tags.length ? (
        <div className="mt-4">
          <h3 className="mb-3 text-[14px] font-black text-[#111827]">Tags</h3>
          <div className="flex max-h-[78px] flex-wrap gap-2 overflow-hidden sm:max-h-none">
            {tags.map((tag) => (
              <span
                key={tag}
                className="max-w-[46%] truncate rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-extrabold text-white sm:max-w-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
