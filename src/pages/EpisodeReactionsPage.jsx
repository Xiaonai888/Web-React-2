import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('episodeReactions', {
  en: {
    love: 'Love',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry',
    support: 'Support',
    touched: 'Touched',
    reader: 'Reader',
    loadFailed: 'Failed to load reactions',
    all: 'All',
    goBack: 'Go back',
    title: 'People who reacted',
    noReactions: 'No reactions yet',
  },
  km: {
    love: 'ស្រឡាញ់',
    haha: 'សើច',
    wow: 'ភ្ញាក់ផ្អើល',
    sad: 'សោកសៅ',
    angry: 'ខឹង',
    support: 'គាំទ្រ',
    touched: 'រំភើបចិត្ត',
    reader: 'អ្នកអាន',
    loadFailed: 'មិនអាចផ្ទុកប្រតិកម្មបានទេ',
    all: 'ទាំងអស់',
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'អ្នកដែលបានបញ្ចេញប្រតិកម្ម',
    noReactions: 'មិនទាន់មានប្រតិកម្មទេ',
  },
  zh: {
    love: '爱心',
    haha: '哈哈',
    wow: '哇',
    sad: '难过',
    angry: '生气',
    support: '支持',
    touched: '感动',
    reader: '读者',
    loadFailed: '无法加载反应',
    all: '全部',
    goBack: '返回',
    title: '作出反应的人',
    noReactions: '还没有反应',
  },
  ja: {
    love: '大好き',
    haha: '笑',
    wow: 'すごい',
    sad: '悲しい',
    angry: '怒り',
    support: '応援',
    touched: '感動',
    reader: '読者',
    loadFailed: 'リアクションを読み込めませんでした',
    all: 'すべて',
    goBack: '戻る',
    title: 'リアクションした人',
    noReactions: 'まだリアクションはありません',
  },
  ko: {
    love: '사랑해요',
    haha: '웃겨요',
    wow: '놀라워요',
    sad: '슬퍼요',
    angry: '화나요',
    support: '응원해요',
    touched: '감동이에요',
    reader: '독자',
    loadFailed: '반응을 불러오지 못했습니다',
    all: '전체',
    goBack: '뒤로 가기',
    title: '반응한 사람',
    noReactions: '아직 반응이 없습니다',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REACTION_META = {
  love: {
    labelKey: 'love',
    src: '/assets/React/Love.svg',
  },
  haha: {
    labelKey: 'haha',
    src: '/assets/React/Haha.svg',
  },
  wow: {
    labelKey: 'wow',
    src: '/assets/React/Wow.svg',
  },
  sad: {
    labelKey: 'sad',
    src: '/assets/React/Sad.svg',
  },
  angry: {
    labelKey: 'angry',
    src: '/assets/React/Angry.svg',
  },
  support: {
    labelKey: 'support',
    src: '/assets/React/Support.svg',
  },
  touched: {
    labelKey: 'touched',
    src: '/assets/React/Touched.svg',
  },
}

const LANGUAGE_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function Avatar({
  user,
  fallbackName,
}) {
  const avatar = user?.avatar_url || ''
  const name = user?.name || fallbackName

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="h-12 w-12 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111827] text-[15px] font-bold text-white">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

export default function EpisodeReactionsPage() {
  const navigate = useNavigate()
  const { episodeId } = useParams()
  const { language, t } = useDisplayTranslation()
  const [activeType, setActiveType] = useState('all')
  const [reactions, setReactions] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadReactions() {
      setLoading(true)
      setMessage('')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reactions/episode/${episodeId}?page=1&limit=200`
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message ||
              t('episodeReactions.loadFailed')
          )
        }

        if (!ignore) {
          setReactions(
            Array.isArray(data.reactions)
              ? data.reactions
              : []
          )
          setCounts(
            data.counts &&
              typeof data.counts === 'object'
              ? data.counts
              : {}
          )
        }
      } catch (error) {
        if (!ignore) {
          setReactions([])
          setCounts({})
          setMessage(
            error.message ||
              t('episodeReactions.loadFailed')
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    if (episodeId) loadReactions()

    return () => {
      ignore = true
    }
  }, [episodeId, t])

  const tabs = useMemo(() => {
    const available = Object.entries(
      REACTION_META
    )
      .filter(
        ([type]) =>
          Number(counts[type] || 0) > 0
      )
      .map(([type, meta]) => ({
        type,
        label: t(
          `episodeReactions.${meta.labelKey}`
        ),
        count: Number(counts[type] || 0),
        src: meta.src,
      }))

    return [
      {
        type: 'all',
        label: t('episodeReactions.all'),
        count: reactions.length,
        src: '',
      },
      ...available,
    ]
  }, [counts, reactions.length, t])

  const visibleReactions = useMemo(() => {
    if (activeType === 'all') {
      return reactions
    }

    return reactions.filter(
      (item) =>
        String(
          item.reaction_type || 'love'
        ).toLowerCase() === activeType
    )
  }, [activeType, reactions])

  const locale =
    LANGUAGE_LOCALES[language] ||
    LANGUAGE_LOCALES.en

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center active:scale-95"
            aria-label={t(
              'episodeReactions.goBack'
            )}
          >
            <i className="fa-solid fa-chevron-left text-[21px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-2 text-[19px] font-semibold">
            {t('episodeReactions.title')}
          </h1>

          <div className="h-10 w-10 shrink-0" />
        </div>

        <div className="overflow-x-auto">
          <div className="mx-auto flex min-w-max max-w-3xl px-4">
            {tabs.map((tab) => {
              const active =
                activeType === tab.type

              return (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() =>
                    setActiveType(tab.type)
                  }
                  className={`relative flex h-14 items-center gap-2 px-4 text-[15px] font-medium ${
                    active
                      ? 'text-[#1976d2]'
                      : 'text-[#667085]'
                  }`}
                >
                  {tab.src ? (
                    <img
                      src={tab.src}
                      alt=""
                      className="h-6 w-6 object-contain"
                    />
                  ) : null}

                  <span>{tab.label}</span>
                  <span>
                    {tab.count.toLocaleString(
                      locale
                    )}
                  </span>

                  {active ? (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1976d2]" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-4 py-2"
              >
                <div className="h-12 w-12 rounded-full bg-[#eef1f5]" />
                <div className="h-4 w-40 rounded-full bg-[#eef1f5]" />
              </div>
            ))}
          </div>
        ) : message ? (
          <div className="py-12 text-center text-[14px] font-medium text-[#667085]">
            {message}
          </div>
        ) : visibleReactions.length ? (
          <div>
            {visibleReactions.map(
              (reaction) => {
                const type = String(
                  reaction.reaction_type ||
                    'love'
                ).toLowerCase()
                const meta =
                  REACTION_META[type] ||
                  REACTION_META.love
                const reactionLabel = t(
                  `episodeReactions.${meta.labelKey}`
                )

                return (
                  <Link
                    key={reaction.id}
                    to={`/profile?username=${encodeURIComponent(
                      reaction.user
                        ?.username || ''
                    )}`}
                    className="flex w-full cursor-pointer items-center gap-4 rounded-xl py-3 text-left transition hover:bg-[#f8fafc] active:opacity-70"
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        user={reaction.user}
                        fallbackName={t(
                          'episodeReactions.reader'
                        )}
                      />
                      <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                        <img
                          src={meta.src}
                          alt={reactionLabel}
                          className="h-5 w-5 object-contain"
                        />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[16px] font-semibold">
                        {reaction.user?.name ||
                          t(
                            'episodeReactions.reader'
                          )}
                      </div>
                    </div>
                  </Link>
                )
              }
            )}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#98a2b3]">
              <i className="fa-regular fa-heart text-[22px]" />
            </div>
            <div className="mt-4 text-[16px] font-semibold">
              {t(
                'episodeReactions.noReactions'
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
