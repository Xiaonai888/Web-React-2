import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayText, useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const CACHE_TTL_MS = 15 * 60 * 1000
const CACHE_PREFIX = 'shadow:reader-story-settings:v1:'
const PICK_KEY = 'shadow:genres-story-setting-pick:v1'

const LANGUAGE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Khmer', value: 'Khmer' },
  { label: 'English', value: 'English' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'Korean', value: 'Korean' },
]

const PRESET_SETTINGS = new Set([
  'khmer',
  'chinese',
  'korean',
  'japanese',
  'western',
  'other',
])

registerTranslationNamespace('readerStorySettingPage', {
  en: {
    title: 'Story Setting',
    save: 'Save',
    search: 'Search Story Setting',
    help: 'Choose a story setting you want to explore.',
    noSettings: 'No Story Setting found.',
    tryAnother: 'Try another search or language.',
    loading: 'Loading Story Settings...',
    failed: 'Could not load Story Settings.',
    back: 'Back',
  },
  km: {
    title: 'បរិបទសាច់រឿង',
    save: 'រក្សាទុក',
    search: 'ស្វែងរកបរិបទសាច់រឿង',
    help: 'ជ្រើសបរិបទសាច់រឿងដែលអ្នកចង់ស្វែងរក និងអាន។',
    noSettings: 'រកមិនឃើញបរិបទសាច់រឿង។',
    tryAnother: 'សាកស្វែងរក ឬជ្រើសភាសាផ្សេងទៀត។',
    loading: 'កំពុងផ្ទុកបរិបទសាច់រឿង...',
    failed: 'មិនអាចផ្ទុកបរិបទសាច់រឿងបានទេ។',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    title: '故事背景',
    save: '保存',
    search: '搜索故事背景',
    help: '选择你想探索和阅读的故事背景。',
    noSettings: '未找到故事背景。',
    tryAnother: '尝试其他搜索词或语言。',
    loading: '正在加载故事背景...',
    failed: '无法加载故事背景。',
    back: '返回',
  },
  ja: {
    title: 'ストーリー設定',
    save: '保存',
    search: 'ストーリー設定を検索',
    help: '読みたいストーリー設定を選んでください。',
    noSettings: 'ストーリー設定が見つかりません。',
    tryAnother: '別の検索語または言語をお試しください。',
    loading: 'ストーリー設定を読み込み中...',
    failed: 'ストーリー設定を読み込めませんでした。',
    back: '戻る',
  },
  ko: {
    title: '스토리 설정',
    save: '저장',
    search: '스토리 설정 검색',
    help: '찾아보고 싶은 스토리 설정을 선택하세요.',
    noSettings: '스토리 설정을 찾을 수 없습니다.',
    tryAnother: '다른 검색어나 언어를 사용해 보세요.',
    loading: '스토리 설정을 불러오는 중...',
    failed: '스토리 설정을 불러오지 못했습니다.',
    back: '뒤로',
  },
})

function readCache(language) {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${language || 'all'}`)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed?.settings)) return null
    if (Date.now() - Number(parsed.savedAt || 0) > CACHE_TTL_MS) return null

    return parsed.settings
  } catch {
    return null
  }
}

function saveCache(language, settings) {
  try {
    sessionStorage.setItem(
      `${CACHE_PREFIX}${language || 'all'}`,
      JSON.stringify({
        settings,
        savedAt: Date.now(),
      })
    )
  } catch {}
}

async function fetchStorySettings(language, signal) {
  const unique = new Map()
  let cursor = ''
  let hasMore = true
  let pageCount = 0

  while (hasMore && pageCount < 50) {
    const params = new URLSearchParams({
      limit: '100',
      sort: 'updated',
      genre_pagination: '1',
    })

    if (language) {
      params.set('language', language)
    }

    if (cursor) {
      params.set('cursor', cursor)
    }

    const response = await fetch(
      `${API_BASE_URL}/api/public/stories?${params.toString()}`,
      {
        cache: 'no-store',
        signal,
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message || getDisplayText('readerStorySettingPage.failed')
      )
    }

    const stories = Array.isArray(data.stories) ? data.stories : []

    for (const story of stories) {
      const settings = Array.isArray(story.story_settings)
        ? story.story_settings
        : []

      for (const value of settings) {
        const setting = String(value || '').trim()
        if (!setting) continue
        if (PRESET_SETTINGS.has(setting.toLowerCase())) continue

        const key = setting.toLowerCase()

        if (!unique.has(key)) {
          unique.set(key, setting)
        }
      }
    }

    const pagination = data.pagination || {}
    hasMore = Boolean(pagination.has_more)
    cursor = String(pagination.next_cursor || '')
    pageCount += 1

    if (!cursor) {
      hasMore = false
    }
  }

  return [...unique.values()].sort((first, second) =>
    first.localeCompare(second, undefined, { sensitivity: 'base' })
  )
}

export default function ReaderStorySettingPage() {
  useDisplayTranslation()
  const navigate = useNavigate()
  const [activeLanguage, setActiveLanguage] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem('shadow:genres-page:v1') || '{}'
      )

      const current = String(saved.storySetting || '').trim()

      if (
        current &&
        ![
          'all',
          'Khmer',
          'Chinese',
          'Korean',
          'Japanese',
          'Western',
          'Other',
        ].includes(current)
      ) {
        setSelected(current)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadSettings() {
      const cached = readCache(activeLanguage)

      if (cached) {
        setSettings(cached)
        setLoading(false)
      } else {
        setLoading(true)
      }

      setMessage('')

      try {
        const nextSettings = await fetchStorySettings(
          activeLanguage,
          controller.signal
        )

        if (controller.signal.aborted) return

        setSettings(nextSettings)
        saveCache(activeLanguage, nextSettings)
      } catch (error) {
        if (error?.name === 'AbortError') return

        if (!cached) {
          setSettings([])
        }

        setMessage(
          error?.message ||
            getDisplayText('readerStorySettingPage.failed')
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => controller.abort()
  }, [activeLanguage])

  const visibleSettings = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) return settings

    return settings.filter((setting) =>
      setting.toLowerCase().includes(keyword)
    )
  }, [query, settings])

  const handleSave = () => {
    if (!selected) return

    try {
      sessionStorage.setItem(PICK_KEY, selected)
    } catch {}

    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-20 bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center active:scale-95"
            aria-label={getDisplayText('readerStorySettingPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-bold">
            {getDisplayText('readerStorySettingPage.title')}
          </h1>

          <button
            type="button"
            onClick={handleSave}
            disabled={!selected}
            className={`text-[14px] font-bold ${
              selected
                ? 'text-[#0b5cff]'
                : 'text-[var(--shadow-text-disabled)]'
            }`}
          >
            {getDisplayText('readerStorySettingPage.save')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="flex h-12 items-center rounded-full bg-[var(--shadow-bg-surface)] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[var(--shadow-text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={getDisplayText('readerStorySettingPage.search')}
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <p className="mt-4 text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
          {getDisplayText('readerStorySettingPage.help')}
        </p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {LANGUAGE_FILTERS.map((item) => {
            const active = activeLanguage === item.value

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveLanguage(item.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium active:scale-[0.98] ${
                  active
                    ? 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
                    : 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] ring-1 ring-[var(--shadow-border)]'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="py-12 text-center text-[13px] text-[var(--shadow-text-tertiary)]">
            {getDisplayText('readerStorySettingPage.loading')}
          </div>
        ) : null}

        {!loading && message ? (
          <div className="py-12 text-center text-[13px] text-[#e5484d]">
            {message}
          </div>
        ) : null}

        {!loading && !message && visibleSettings.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {visibleSettings.map((setting) => {
              const active = selected === setting

              return (
                <button
                  key={setting}
                  type="button"
                  onClick={() => setSelected(setting)}
                  className={`flex min-h-[76px] items-center justify-center rounded-[12px] bg-[var(--shadow-bg-surface)] px-3 text-center text-[14px] font-bold transition active:scale-[0.98] ${
                    active
                      ? 'border-2 border-[#FE526E] text-[#FE526E]'
                      : 'border border-transparent text-[var(--shadow-text-primary)]'
                  }`}
                >
                  {setting}
                </button>
              )
            })}
          </div>
        ) : null}

        {!loading && !message && !visibleSettings.length ? (
          <div className="py-12 text-center">
            <div className="text-[14px] font-bold text-[var(--shadow-text-primary)]">
              {getDisplayText('readerStorySettingPage.noSettings')}
            </div>
            <div className="mt-2 text-[12px] text-[var(--shadow-text-secondary)]">
              {getDisplayText('readerStorySettingPage.tryAnother')}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
