import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyInfoSection', {
  en: {
    everyday: 'Everyday',
    daysPerWeek: '{{count}} days/week',
    noDescription: 'No description yet.',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  },
  km: {
    everyday: 'រៀងរាល់ថ្ងៃ',
    daysPerWeek: '{{count}} ថ្ងៃ/សប្តាហ៍',
    noDescription: 'មិនទាន់មានការពិពណ៌នា។',
    mon: 'ចន្ទ',
    tue: 'អង្គារ',
    wed: 'ពុធ',
    thu: 'ព្រហ',
    fri: 'សុក្រ',
    sat: 'សៅរ៍',
    sun: 'អាទិត្យ',
  },
  zh: {
    everyday: '每天',
    daysPerWeek: '每周 {{count}} 天',
    noDescription: '暂无简介。',
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
    sun: '周日',
  },
  ja: {
    everyday: '毎日',
    daysPerWeek: '週{{count}}日',
    noDescription: '説明はまだありません。',
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
    sun: '日',
  },
  ko: {
    everyday: '매일',
    daysPerWeek: '주 {{count}}일',
    noDescription: '아직 설명이 없습니다.',
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
    sun: '일',
  },
})

const DAY_KEYS = {
  mon: 'mon',
  monday: 'mon',
  tue: 'tue',
  tues: 'tue',
  tuesday: 'tue',
  wed: 'wed',
  wednesday: 'wed',
  thu: 'thu',
  thur: 'thu',
  thurs: 'thu',
  thursday: 'thu',
  fri: 'fri',
  friday: 'fri',
  sat: 'sat',
  saturday: 'sat',
  sun: 'sun',
  sunday: 'sun',
}

function getDisplayDay(day, t) {
  const raw = String(day || '').trim()
  const key = DAY_KEYS[raw.toLowerCase()]

  return key
    ? t(`storyInfoSection.${key}`)
    : raw.slice(0, 3)
}

function getUpdateDaysLabel(days, t) {
  if (!Array.isArray(days) || days.length === 0) return ''

  const selectedDays = days
    .map((day) => String(day || '').trim())
    .filter(Boolean)

  const count = selectedDays.length

  if (count <= 0) return ''
  if (count === 7) return t('storyInfoSection.everyday')
  if (count >= 3) {
    return t('storyInfoSection.daysPerWeek', { count })
  }

  return selectedDays
    .map((day) => getDisplayDay(day, t))
    .join(', ')
}

export default function StoryInfoSection({ story }) {
  const { t } = useDisplayTranslation()
  const [expanded, setExpanded] = useState(false)
  const tags = Array.isArray(story?.tags) ? story.tags.slice(0, 6) : []
  const updateLabel = getUpdateDaysLabel(story?.update_days, t)
  const description = story?.description || t('storyInfoSection.noDescription')

  return (
    <section className="mt-2 bg-[var(--shadow-bg-surface)] px-4 py-4 sm:mt-4 sm:rounded-[18px] sm:px-5 sm:py-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full text-left"
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          {updateLabel ? (
            <div className="min-w-0 truncate text-[12px] font-extrabold text-[var(--shadow-text-secondary)]">
              {updateLabel}
            </div>
          ) : (
            <div />
          )}

          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
            <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'} text-[12px]`} />
          </span>
        </div>

        <p className={`text-[13.5px] font-medium leading-7 text-[var(--shadow-text-secondary)] ${expanded ? '' : 'line-clamp-4'}`}>
          {description}
        </p>
      </button>

      {tags.length ? (
  <div className="mt-4">
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:whitespace-normal">
      {tags.map((tag) => (
        <span
  key={tag}
  className="shrink-0 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-medium text-[var(--shadow-text-primary)]"
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
