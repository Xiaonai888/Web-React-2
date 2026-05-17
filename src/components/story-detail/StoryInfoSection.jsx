import { useState } from 'react'

function getUpdateDaysLabel(days) {
  if (!Array.isArray(days) || days.length === 0) return ''
  return days.join(', ')
}

export default function StoryInfoSection({ story }) {
  const [expanded, setExpanded] = useState(false)
  const tags = Array.isArray(story?.tags) ? story.tags.slice(0, 6) : []
  const updateLabel = getUpdateDaysLabel(story?.update_days)
  const description = story?.description || 'No description yet.'

  return (
    <section className="mt-2 bg-white px-4 py-4 sm:mt-4 sm:rounded-[18px] sm:px-5 sm:py-5 sm:shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full text-left"
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          {updateLabel ? (
            <div className="min-w-0 truncate text-[12px] font-extrabold text-[#98a2b3]">
              {updateLabel}
            </div>
          ) : (
            <div />
          )}

          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#111827]">
            <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'} text-[12px]`} />
          </span>
        </div>

        <p className={`text-[13.5px] font-medium leading-7 text-[#555b66] ${expanded ? '' : 'line-clamp-4'}`}>
          {description}
        </p>
      </button>

      {tags.length ? (
        <div className="mt-4">
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
