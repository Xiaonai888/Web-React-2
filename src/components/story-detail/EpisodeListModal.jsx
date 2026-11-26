import { useEffect, useMemo, useRef, useState } from 'react'
import usePopupUiDiagnostics from '../../hooks/usePopupUiDiagnostics'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useNavigate } from 'react-router-dom'

registerTranslationNamespace('episodeListModal', {
  en: {
    completed: 'Completed',
    new: 'New',
    ongoing: 'Ongoing',
    allEpisodes: 'All Episodes',
    updatesEveryday: 'Updates Everyday',
    updatesDaysPerWeek: 'Updates {{count}} days/week',
    updatesDays: 'Updates {{days}}',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
    episodeCover: 'Episode cover',
    cover: 'Cover',
    untitledEpisode: 'Untitled Episode',
    episodes: 'Episodes',
    close: 'Close',
    earlyAccess: 'Early Access',
    premium: 'Premium',
    reverseEpisodes: 'Reverse episodes',
    noEpisodesYet: 'No episodes yet',
    publishedAppearHere: 'Published episodes will appear here.',
    upcoming: 'Upcoming',
    scheduledEpisode: 'Scheduled episode',
    remainingDaysHours: '{{days}}d {{hours}}h left',
    remainingHoursMinutes: '{{hours}}h {{minutes}}m left',
    remainingMinutes: '{{minutes}}m left',
    remainingSoon: 'Less than 1 minute left',
  },
  km: {
    completed: 'បានបញ្ចប់',
    new: 'ថ្មី',
    ongoing: 'កំពុងបន្ត',
    allEpisodes: 'ភាគទាំងអស់',
    updatesEveryday: 'Update រៀងរាល់ថ្ងៃ',
    updatesDaysPerWeek: 'Update {{count}} ថ្ងៃ/សប្តាហ៍',
    updatesDays: 'Update {{days}}',
    mon: 'ចន្ទ',
    tue: 'អង្គារ',
    wed: 'ពុធ',
    thu: 'ព្រហ',
    fri: 'សុក្រ',
    sat: 'សៅរ៍',
    sun: 'អាទិត្យ',
    episodeCover: 'គម្របភាគ',
    cover: 'គម្រប',
    untitledEpisode: 'ភាគគ្មានចំណងជើង',
    episodes: 'ភាគ',
    close: 'បិទ',
    earlyAccess: 'ចូលអានមុន',
    premium: 'ពិសេស',
    reverseEpisodes: 'បញ្ច្រាសលំដាប់ភាគ',
    noEpisodesYet: 'មិនទាន់មានភាគ',
    publishedAppearHere: 'ភាគដែលបានបោះពុម្ពនឹងបង្ហាញនៅទីនេះ។',
    upcoming: 'Upcoming',
    scheduledEpisode: 'ភាគដែលបានកំណត់ពេលចេញផ្សាយ',
    remainingDaysHours: 'នៅសល់ {{days}} ថ្ងៃ {{hours}} ម៉ោង',
    remainingHoursMinutes: 'នៅសល់ {{hours}} ម៉ោង {{minutes}} នាទី',
    remainingMinutes: 'នៅសល់ {{minutes}} នាទី',
    remainingSoon: 'នៅសល់តិចជាង ១ នាទី',
  },
  zh: {
    completed: '已完结',
    new: '新作',
    ongoing: '连载中',
    allEpisodes: '全部章节',
    updatesEveryday: '每天更新',
    updatesDaysPerWeek: '每周更新 {{count}} 天',
    updatesDays: '{{days}} 更新',
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
    sun: '周日',
    episodeCover: '章节封面',
    cover: '封面',
    untitledEpisode: '无标题章节',
    episodes: '章节',
    close: '关闭',
    earlyAccess: '抢先阅读',
    premium: '高级',
    reverseEpisodes: '反转章节顺序',
    noEpisodesYet: '暂无章节',
    publishedAppearHere: '已发布的章节会显示在这里。',
    upcoming: 'Upcoming',
    scheduledEpisode: '即将发布的章节',
    remainingDaysHours: '还剩 {{days}} 天 {{hours}} 小时',
    remainingHoursMinutes: '还剩 {{hours}} 小时 {{minutes}} 分钟',
    remainingMinutes: '还剩 {{minutes}} 分钟',
    remainingSoon: '不到 1 分钟',
  },
  ja: {
    completed: '完結',
    new: '新着',
    ongoing: '連載中',
    allEpisodes: 'すべてのエピソード',
    updatesEveryday: '毎日更新',
    updatesDaysPerWeek: '週{{count}}日更新',
    updatesDays: '{{days}} 更新',
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
    sun: '日',
    episodeCover: 'エピソード表紙',
    cover: '表紙',
    untitledEpisode: '無題のエピソード',
    episodes: 'エピソード',
    close: '閉じる',
    earlyAccess: '先行アクセス',
    premium: 'プレミアム',
    reverseEpisodes: 'エピソード順を反転',
    noEpisodesYet: 'エピソードはまだありません',
    publishedAppearHere: '公開されたエピソードがここに表示されます。',
    upcoming: 'Upcoming',
    scheduledEpisode: '公開予定のエピソード',
    remainingDaysHours: 'あと{{days}}日{{hours}}時間',
    remainingHoursMinutes: 'あと{{hours}}時間{{minutes}}分',
    remainingMinutes: 'あと{{minutes}}分',
    remainingSoon: '残り1分未満',
  },
  ko: {
    completed: '완결',
    new: '신규',
    ongoing: '연재 중',
    allEpisodes: '전체 에피소드',
    updatesEveryday: '매일 업데이트',
    updatesDaysPerWeek: '주 {{count}}일 업데이트',
    updatesDays: '{{days}} 업데이트',
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
    sun: '일',
    episodeCover: '에피소드 표지',
    cover: '표지',
    untitledEpisode: '제목 없는 에피소드',
    episodes: '에피소드',
    close: '닫기',
    earlyAccess: '얼리 액세스',
    premium: '프리미엄',
    reverseEpisodes: '에피소드 순서 뒤집기',
    noEpisodesYet: '아직 에피소드가 없습니다',
    publishedAppearHere: '게시된 에피소드가 여기에 표시됩니다.',
    upcoming: 'Upcoming',
    scheduledEpisode: '게시 예정 에피소드',
    remainingDaysHours: '{{days}}일 {{hours}}시간 남음',
    remainingHoursMinutes: '{{hours}}시간 {{minutes}}분 남음',
    remainingMinutes: '{{minutes}}분 남음',
    remainingSoon: '1분 미만 남음',
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

function formatShortNumber(value) {
  const number = Number(value || 0)
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return number.toLocaleString()
}

function formatDate(value, locale) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale || 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function isNewEpisode(episode) {
  if (!episode?.published_at) return false
  const time = new Date(episode.published_at).getTime()
  if (!Number.isFinite(time)) return false
  const age = Date.now() - time
  return age >= 0 && age < 7 * 24 * 60 * 60 * 1000
}

function formatStatus(value, t) {
  const status = String(value || 'ongoing').toLowerCase()

  if (status === 'completed') return t('episodeListModal.completed')
  if (status === 'new') return t('episodeListModal.new')
  return t('episodeListModal.ongoing')
}

function getDisplayDay(day, t) {
  const raw = String(day || '').trim()
  const key = DAY_KEYS[raw.toLowerCase()]

  return key
    ? t(`episodeListModal.${key}`)
    : raw.slice(0, 3)
}

function formatUpdateDays(days, t) {
  if (!Array.isArray(days) || !days.length) {
    return t('episodeListModal.allEpisodes')
  }

  const selectedDays = days
    .map((day) => String(day || '').trim())
    .filter(Boolean)

  const count = selectedDays.length

  if (count <= 0) return t('episodeListModal.allEpisodes')
  if (count === 7) return t('episodeListModal.updatesEveryday')
  if (count >= 3) {
    return t('episodeListModal.updatesDaysPerWeek', { count })
  }

  return t('episodeListModal.updatesDays', {
    days: selectedDays
      .map((day) => getDisplayDay(day, t))
      .join(' & '),
  })
}

function ReverseIcon() {
  return (
    <span className="relative block h-6 w-6 text-current">
      <span className="absolute left-[6px] top-[4px] h-[15px] w-[3px] rounded-full bg-current" />
      <span className="absolute left-[3px] top-[3px] h-[8px] w-[3px] rotate-45 rounded-full bg-current" />
      <span className="absolute left-[8px] top-[3px] h-[8px] w-[3px] -rotate-45 rounded-full bg-current" />
      <span className="absolute right-[6px] bottom-[4px] h-[15px] w-[3px] rounded-full bg-current" />
      <span className="absolute right-[3px] bottom-[3px] h-[8px] w-[3px] -rotate-45 rounded-full bg-current" />
      <span className="absolute right-[8px] bottom-[3px] h-[8px] w-[3px] rotate-45 rounded-full bg-current" />
    </span>
  )
}

function EpisodeListItem({ episode, story, onOpenEpisode }) {
  const { t } = useDisplayTranslation()
  const displayLanguage = getDisplayLanguageId() || 'en'
  const cover = episode.cover_url || story?.cover_url || ''
  const locked =
  Number(episode.episode_number || 0) > 5 &&
  Boolean(episode.is_locked)
  const date = formatDate(episode.published_at || episode.created_at || episode.updated_at, displayLanguage)
  const comments = formatShortNumber(episode.total_comments || episode.comments_count || episode.comments || 0)
  const newEpisode = isNewEpisode(episode)

  const lastReadKey = `shadow_last_read_episode_${story?.id || 'story'}`

const [hasRead, setHasRead] = useState(() => {
  return String(localStorage.getItem(lastReadKey) || '') === String(episode.id)
})

const handleClick = () => {
  try {
    localStorage.setItem(lastReadKey, String(episode.id))
    setHasRead(true)
  } catch {
  }

  onOpenEpisode(episode, 'modal')
}

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full gap-3 border-b border-[var(--shadow-border)] px-4 py-3.5 text-left transition active:scale-[0.995] sm:gap-4 sm:px-5 ${
        hasRead ? 'bg-[var(--shadow-bg-soft)]' : 'bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <div className="relative h-[76px] w-[108px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-soft)] sm:h-[86px] sm:w-[128px]">
        {cover ? (
          <img
            src={cover}
            alt={episode.title || t('episodeListModal.episodeCover')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-[var(--shadow-text-secondary)]">
            {t('episodeListModal.cover')}
          </div>
        )}

        {newEpisode ? (
  <span
    className="absolute right-1.5 top-0 z-10 flex h-[28px] min-w-[32px] items-center justify-center bg-[#FF3B30] px-1.5 pb-[3px] text-[9px] font-bold text-white shadow-[0_3px_7px_rgba(0,0,0,0.14)]"
    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' }}
  >
    {t('episodeListModal.new')}
  </span>
) : null}

{episode.is_adult ? (
  <span className="absolute bottom-2 left-2 z-10 rounded-full bg-[#FE526E] px-2 py-1 text-[10px] font-bold leading-none text-white shadow-sm">
    18+
  </span>
) : null}

        {locked ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/32 text-white">
            <i className="fa-solid fa-lock text-[18px]" />
          </div>
        ) : null}
      </div>

      <div className="min-w-0 flex-1 py-1">
        <h3
          className={`line-clamp-2 text-[14px] font-bold leading-5 ${
            hasRead ? 'text-[var(--shadow-text-tertiary)]' : 'text-[var(--shadow-text-primary)]'
          }`}
        >
          {episode.title || t('episodeListModal.untitledEpisode')}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
          {date ? <span>{date}</span> : null}

          <span className="inline-flex items-center gap-1.5">
            <i className="fa-solid fa-comment-dots text-[12px]" />
            {comments}
          </span>
        </div>
      </div>
    </button>
  )
}

function UpcomingEpisodeRow({ episode, story, now }) {
  const { t } = useDisplayTranslation()
  const publishTime = Date.parse(episode?.scheduled_at || '')

  if (!Number.isFinite(publishTime) || publishTime <= now) return null
  if (episode?.status && String(episode.status).toLowerCase() !== 'scheduled') return null
  if (episode?.deleted_at || episode?.published_at) return null

  const displayLanguage = getDisplayLanguageId() || 'en'
  const date = formatDate(episode.scheduled_at, displayLanguage)
  const cover = episode.cover_url || story?.cover_url || ''
  const remainingMs = publishTime - now
  const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000))
  const days = Math.floor(remainingMinutes / 1440)
  const hours = Math.floor((remainingMinutes % 1440) / 60)
  const minutes = remainingMinutes % 60
  const remaining = remainingMs < 60000
    ? t('episodeListModal.remainingSoon')
    : days > 0
      ? t('episodeListModal.remainingDaysHours', { days, hours })
      : hours > 0
        ? t('episodeListModal.remainingHoursMinutes', { hours, minutes })
        : t('episodeListModal.remainingMinutes', { minutes })

  return (
    <div aria-label={t('episodeListModal.scheduledEpisode')}>
      <div className="flex items-center gap-2 px-4 pb-1 pt-4 text-[13px] font-medium text-[var(--shadow-text-primary)] sm:px-5">
        <i className="fa-regular fa-clock text-[13px] text-[var(--shadow-text-secondary)]" aria-hidden="true" />
        <span>{t('episodeListModal.upcoming')}</span>
      </div>
      <div className="flex w-full gap-3 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3.5 text-left sm:gap-4 sm:px-5">
        <div className="relative h-[76px] w-[108px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-soft)] sm:h-[86px] sm:w-[128px]">
          {cover ? (
            <img
              src={cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[11px] font-medium text-[var(--shadow-text-secondary)]">
              {t('episodeListModal.cover')}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-1">
          <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-[var(--shadow-text-primary)]">
            {episode.title || t('episodeListModal.untitledEpisode')}
          </h3>
          <div className="mt-1.5 flex flex-col gap-1 text-[11.5px] font-medium text-[var(--shadow-text-secondary)]">
            {date ? <time dateTime={episode.scheduled_at}>{date}</time> : null}
            <span className="inline-flex items-center gap-1.5">
              <i className="fa-regular fa-clock text-[11px]" aria-hidden="true" />
              {remaining}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EpisodeListModal({ open, story, episodes = [], upcomingEpisode = null, onClose, onOpenEpisode }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [newestFirst, setNewestFirst] = useState(true)
  const [now, setNow] = useState(() => Date.now())
  const panelRef = useRef(null)
usePopupUiDiagnostics(open, panelRef, 'episode-list')

  useEffect(() => {
    if (!open || !upcomingEpisode?.scheduled_at) return undefined

    const updateTime = () => setNow(Date.now())
    updateTime()

    const timer = window.setInterval(() => {
      if (!document.hidden) updateTime()
    }, 60000)

    document.addEventListener('visibilitychange', updateTime)
    window.addEventListener('focus', updateTime)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', updateTime)
      window.removeEventListener('focus', updateTime)
    }
  }, [open, upcomingEpisode?.scheduled_at])

  const visibleEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => {
      const first = Number(a.episode_number || 0)
      const second = Number(b.episode_number || 0)
      return newestFirst ? second - first : first - second
    })
  }, [episodes, newestFirst])

  if (!open) return null

  const status = formatStatus(story?.story_status || story?.status, t)
  const updateText = formatUpdateDays(story?.update_days, t)

  return (
    <div className="fixed inset-0 z-[140] bg-black/45 sm:flex sm:items-center sm:justify-center sm:px-6">
      <section ref={panelRef} className="absolute bottom-0 left-0 right-0 top-[64px] flex flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-2xl sm:relative sm:left-auto sm:right-auto sm:top-auto sm:h-[82vh] sm:w-full sm:max-w-[720px] sm:rounded-[30px]">
        <header className="sticky top-0 z-20 shrink-0 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="h-10 w-10" />

            <h2 className="line-clamp-1 text-center text-[18px] font-bold text-[var(--shadow-text-primary)]">
              {t('episodeListModal.episodes')}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:scale-95"
              aria-label={t('episodeListModal.close')}
            >
              <span className="text-[26px] leading-none text-[var(--shadow-text-primary)]" style={{ fontWeight: 300 }}>
                ×
              </span>
            </button>
          </div>

          <button
  type="button"
  onClick={() => navigate('/premium')}
  className="mt-4 flex min-h-[34px] w-full items-center gap-3 text-left active:scale-[0.995]"
>
  <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-tl-[11px] rounded-br-[11px] bg-[#111827] px-2.5 text-[11px] font-black italic text-white shadow-sm">
    <img
      src="/assets/Icons/Crown.svg"
      alt=""
      className="h-3.5 w-3.5 object-contain"
      loading="lazy"
      decoding="async"
    />
    {t('episodeListModal.premium')}
  </span>

  <span className="min-w-0 text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
    {t('episodeListModal.earlyAccess')}
  </span>

  <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
</button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto pb-8">
          <UpcomingEpisodeRow episode={upcomingEpisode} story={story} now={now} />

        <div className="flex items-center justify-between gap-4 border-b border-[var(--shadow-border)] px-4 py-4 sm:px-5">
          <div className="font-['Roboto'] text-[14px] font-medium text-[var(--shadow-text-primary)]">
  {status}, {updateText}
</div>

          <button
            type="button"
            onClick={() => setNewestFirst((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('episodeListModal.reverseEpisodes')}
          >
           <img
  src="/assets/Icons/Revers.svg"
  alt={t('episodeListModal.reverseEpisodes')}
  className="h-3.5 w-3.5 object-contain opacity-75 dark:invert"
/>
          </button>
        </div>

          {visibleEpisodes.length ? (
            visibleEpisodes.map((episode) => (
              <EpisodeListItem
                key={episode.id}
                episode={episode}
                story={story}
                onOpenEpisode={onOpenEpisode}
              />
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <i className="fa-regular fa-file-lines text-[34px] text-[var(--shadow-text-secondary)]" />
              <div className="mt-4 text-[16px] font-black text-[var(--shadow-text-primary)]">
                {t('episodeListModal.noEpisodesYet')}
              </div>
              <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('episodeListModal.publishedAppearHere')}
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  )
}
