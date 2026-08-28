import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addStoryLanguageParam } from '../utils/storyLanguage'
import { getStoryBadge } from '../utils/storyBadge'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('updateTodayPage', {
  en: {
    mon: 'MON',
    tue: 'TUE',
    wed: 'WED',
    thu: 'THU',
    fri: 'FRI',
    sat: 'SAT',
    sun: 'SUN',
    new: 'NEW',
    up: 'UP',
    end: 'END',
    untitledStory: 'Untitled Story',
    shadowAuthor: 'Shadow Author',
    loadFailed: 'Failed to load update today stories',
    cannotLoad: 'Cannot load updates. Please try again.',
    goBack: 'Go back',
    title: 'Update Today',
    search: 'Search',
    tryAgain: 'Try Again',
    noUpdates: 'No updates for this day',
    selectAnotherDay: 'Select another day to see recent updates.',
  },
  km: {
    mon: 'ចន្ទ',
    tue: 'អង្គារ',
    wed: 'ពុធ',
    thu: 'ព្រហ',
    fri: 'សុក្រ',
    sat: 'សៅរ៍',
    sun: 'អាទិត្យ',
    new: 'ថ្មី',
    up: 'អាប់ដេត',
    end: 'ចប់',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    shadowAuthor: 'អ្នកនិពន្ធ Shadow',
    loadFailed: 'មិនអាចផ្ទុករឿងដែលអាប់ដេតថ្ងៃនេះបានទេ',
    cannotLoad: 'មិនអាចផ្ទុកការអាប់ដេតបានទេ។ សូមព្យាយាមម្តងទៀត។',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'អាប់ដេតថ្ងៃនេះ',
    search: 'ស្វែងរក',
    tryAgain: 'ព្យាយាមម្តងទៀត',
    noUpdates: 'មិនមានការអាប់ដេតសម្រាប់ថ្ងៃនេះទេ',
    selectAnotherDay: 'ជ្រើសរើសថ្ងៃផ្សេង ដើម្បីមើលការអាប់ដេតថ្មីៗ។',
  },
  zh: {
    mon: '周一',
    tue: '周二',
    wed: '周三',
    thu: '周四',
    fri: '周五',
    sat: '周六',
    sun: '周日',
    new: '新',
    up: '更新',
    end: '完结',
    untitledStory: '无标题故事',
    shadowAuthor: 'Shadow 作者',
    loadFailed: '无法加载今日更新故事',
    cannotLoad: '无法加载更新，请重试。',
    goBack: '返回',
    title: '今日更新',
    search: '搜索',
    tryAgain: '重试',
    noUpdates: '这一天没有更新',
    selectAnotherDay: '请选择其他日期查看最近更新。',
  },
  ja: {
    mon: '月',
    tue: '火',
    wed: '水',
    thu: '木',
    fri: '金',
    sat: '土',
    sun: '日',
    new: '新着',
    up: '更新',
    end: '完結',
    untitledStory: '無題のストーリー',
    shadowAuthor: 'Shadow 作者',
    loadFailed: '今日更新されたストーリーを読み込めませんでした',
    cannotLoad: '更新を読み込めませんでした。もう一度お試しください。',
    goBack: '戻る',
    title: '今日の更新',
    search: '検索',
    tryAgain: '再試行',
    noUpdates: 'この日の更新はありません',
    selectAnotherDay: '別の日を選択して最近の更新を確認してください。',
  },
  ko: {
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
    sun: '일',
    new: '신규',
    up: '업데이트',
    end: '완결',
    untitledStory: '제목 없는 스토리',
    shadowAuthor: 'Shadow 작가',
    loadFailed: '오늘 업데이트된 스토리를 불러오지 못했습니다',
    cannotLoad: '업데이트를 불러오지 못했습니다. 다시 시도해 주세요.',
    goBack: '뒤로 가기',
    title: '오늘 업데이트',
    search: '검색',
    tryAgain: '다시 시도',
    noUpdates: '이 날짜에는 업데이트가 없습니다',
    selectAnotherDay: '다른 날짜를 선택해 최근 업데이트를 확인하세요.',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const dayTabs = [
  { key: 1, label: 'MON' },
  { key: 2, label: 'TUE' },
  { key: 3, label: 'WED' },
  { key: 4, label: 'THU' },
  { key: 5, label: 'FRI' },
  { key: 6, label: 'SAT' },
  { key: 0, label: 'SUN' },
]

const DAY_LABEL_KEYS = {
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
  SUN: 'sun',
}

const badgeConfig = {
  new: 'bg-[#FF4D6D] text-white',
  up: 'bg-[#F6B800] text-[#111827]',
  end: 'bg-[#16A34A] text-white',
}

function getDayKeyFromDateKey(value) {
  const match = String(value || '')
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  return new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay()
}

function normalizeStory(story, index = 0) {
  return {
    id: story.id,
    title: story.title || 'Untitled Story',
    author:
      story.author_name ||
      'Shadow Author',
    cover:
      story.cover_url ||
      `/assets/Update Today/Update Today ${Math.min(index + 1, 7)}.jpg`,
    updateCount: Math.max(
      0,
      Number(story.daily_update_count || 0)
    ),
    badge: getStoryBadge(story),
    updateDateKey: String(
      story.update_date || ''
    ).trim(),
    lastEpisodePublishedAt:
      story.last_episode_published_at || null,
    dayKey: getDayKeyFromDateKey(
      story.update_date
    ),
  }
}

function getBestAvailableDay(stories, preferredDay) {
  const availableDays = new Set(
    stories
      .map((story) => story.dayKey)
      .filter((day) => day !== null)
  )

  if (availableDays.has(preferredDay)) {
    return preferredDay
  }

  const startDay =
    Number.isInteger(preferredDay)
      ? preferredDay
      : 0

  for (let offset = 0; offset < 7; offset += 1) {
    const day =
      (startDay - offset + 7) % 7

    if (availableDays.has(day)) {
      return day
    }
  }

  return preferredDay
}

const updateMarkerUI = {
  width: 42,
  right: 5,
  bottom: -5,
  rotate: 7,
  numberX: 0,
  numberY: 0,
  numberRotate: 0,
  numberSize: 12,
}

function BookCard({ book }) {
  const { t } = useDisplayTranslation()

  const badgeText =
    book.badge === 'end'
      ? t('updateTodayPage.end')
      : book.badge === 'up'
        ? t('updateTodayPage.up')
        : t('updateTodayPage.new')

  const updateCount = Math.max(
    0,
    Number(book.updateCount || 0)
  )

  const updateCountText =
    updateCount >= 10
      ? '9+'
      : `+${updateCount}`

  const title =
    !book.title ||
    book.title === 'Untitled Story'
      ? t('updateTodayPage.untitledStory')
      : book.title

  const author =
    !book.author ||
    book.author === 'Shadow Author'
      ? t('updateTodayPage.shadowAuthor')
      : book.author

  return (
    <Link
      to={`/story/${book.id}`}
      className="group block min-w-0"
    >
      <div className="relative aspect-[2/3]">
        <div className="relative h-full overflow-hidden rounded-[8px] bg-[#202124] shadow-sm">
          <img
            src={book.cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src =
                '/assets/Update Today/Update Today 1.jpg'
            }}
          />

          {book.badge ? (
            <div
              className={`absolute left-0 top-0 rounded-br-[7px] px-2 py-1 text-[10px] font-extrabold leading-none ${badgeConfig[book.badge]}`}
            >
              {badgeText}
            </div>
          ) : null}

          {updateCount >= 2 ? (
            <div
              className="pointer-events-none absolute z-20"
              style={{
                width: `${updateMarkerUI.width}px`,
                right: `${updateMarkerUI.right}px`,
                bottom: `${updateMarkerUI.bottom}px`,
                transform: `rotate(${updateMarkerUI.rotate}deg)`,
              }}
            >
              <img
                src="/assets/Icons/Arrow.webp"
                alt=""
                className="block h-auto w-full"
              />

              <span
                className="absolute whitespace-nowrap font-black leading-none text-[#ff3b30]"
                style={{
                  left: '68%',
                  top: '43%',
                  fontSize: `${updateMarkerUI.numberSize}px`,
                  transform: `translate(-50%, -50%) translate(${updateMarkerUI.numberX}px, ${updateMarkerUI.numberY}px) rotate(${updateMarkerUI.numberRotate}deg)`,
                }}
              >
                {updateCountText}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-2.5 min-w-0">
        <h3 className="block w-full max-w-full overflow-hidden whitespace-nowrap text-ellipsis text-[14px] font-[640] leading-[20px] text-neutral-900">
          {title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11.5px] font-medium text-gray-500">
          {author}
        </p>
      </div>
    </Link>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-6 md:gap-x-5 md:gap-y-9">
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div key={index}>
            <div className="aspect-[2/3] animate-pulse rounded-[8px] bg-[#f3f4f6]" />
            <div className="mt-3 h-4 animate-pulse rounded-full bg-[#f3f4f6]" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-[#f3f4f6]" />
          </div>
        )
      )}
    </div>
  )
}

export default function UpdateTodayPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeDay, setActiveDay] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let ignore = false

    function applyStories(
      sourceStories,
      todayDateKey
    ) {
      if (
        ignore ||
        controller.signal.aborted
      ) {
        return
      }

      const normalizedStories = (
        Array.isArray(sourceStories)
          ? sourceStories
          : []
      ).map(normalizeStory)

      const serverTodayDay =
        getDayKeyFromDateKey(
          todayDateKey
        )

      setStories(normalizedStories)

      setActiveDay((currentDay) =>
        getBestAvailableDay(
          normalizedStories,
          serverTodayDay ??
            currentDay ??
            0
        )
      )
    }

    async function fetchStories() {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(
          addStoryLanguageParam(
            `${API_BASE_URL}/api/public/story-updates?days=7&limit_per_day=100`
          ),
          {
            signal: controller.signal,
            cache: 'no-store',
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          !response.ok ||
          data.ok === false
        ) {
          throw new Error(
            data.message ||
              t('updateTodayPage.loadFailed')
          )
        }

        if (
          ignore ||
          controller.signal.aborted
        ) {
          return
        }

        applyStories(
          data.stories,
          data.today
        )
      } catch (error) {
        if (
          error?.name === 'AbortError'
        ) {
          return
        }

        if (!ignore) {
          setStories([])
          setErrorMessage(
            error?.message ||
              t('updateTodayPage.cannotLoad')
          )
        }
      } finally {
        if (
          !ignore &&
          !controller.signal.aborted
        ) {
          setLoading(false)
        }
      }
    }

    fetchStories()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [requestVersion])

  const filteredStories = useMemo(() => {
    return stories
      .filter(
        (story) =>
          story.dayKey === activeDay
      )
      .sort((a, b) => {
        const aTime = new Date(
          a.lastEpisodePublishedAt || 0
        ).getTime()

        const bTime = new Date(
          b.lastEpisodePublishedAt || 0
        ).getTime()

        return bTime - aTime
      })
  }, [activeDay, stories])

  return (
    <div className="min-h-screen bg-white pb-16">
      <header className="sticky top-0 z-40 border-b border-[#eceef2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center px-4 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#f4f5f7]"
            aria-label={t('updateTodayPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-center text-[18px] font-extrabold tracking-tight text-neutral-900 lg:text-[19px]">
            {t('updateTodayPage.title')}
          </h1>

          <Link
            to="/search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#f4f5f7]"
            aria-label={t('updateTodayPage.search')}
          >
            <i className="fas fa-search text-[18px]" />
          </Link>
        </div>
      </header>

      <div className="sticky top-14 z-30 border-b border-[#f0f1f3] bg-white">
        <div className="mx-auto grid h-[58px] max-w-[1180px] grid-cols-7 px-2 sm:px-4 lg:px-6">
          {dayTabs.map((day) => {
            const active =
              activeDay === day.key

            return (
              <button
                key={day.key}
                type="button"
                onClick={() =>
                  setActiveDay(day.key)
                }
                className={`relative flex items-center justify-center text-[12px] transition-colors sm:text-[13px] ${
                  active
                    ? 'font-extrabold text-[#111827]'
                    : 'font-medium text-[#6b7280] hover:text-[#111827]'
                }`}
              >
                {t(
                  `updateTodayPage.${DAY_LABEL_KEYS[day.label]}`
                )}

                <span
                  className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-[10px] transition-all ${
                    active
                      ? 'w-7 bg-[#F6B800]'
                      : 'w-0 bg-transparent'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      <main className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-5 lg:px-6">
        {errorMessage ? (
          <div className="rounded-[20px] bg-[#fff1f2] px-5 py-10 text-center">
            <p className="text-[13px] font-medium text-[#be123c]">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() =>
                setRequestVersion(
                  (value) => value + 1
                )
              }
              className="mt-4 rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-bold text-white"
            >
              {t('updateTodayPage.tryAgain')}
            </button>
          </div>
        ) : loading ? (
          <LoadingGrid />
        ) : filteredStories.length ? (
          <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-6 md:gap-x-5 md:gap-y-9">
            {filteredStories.map(
              (book) => (
                <BookCard
                  key={book.id}
                  book={book}
                />
              )
            )}
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f6f8] text-[#9ca3af]">
              <i className="fa-regular fa-calendar text-[22px]" />
            </div>

            <h2 className="mt-4 text-[16px] font-bold text-[#111827]">
              {t('updateTodayPage.noUpdates')}
            </h2>

            <p className="mt-1 text-[12px] text-[#8b93a1]">
              {t('updateTodayPage.selectAnotherDay')}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
