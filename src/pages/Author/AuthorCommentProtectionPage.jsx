import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const WORD_FILTERS_PATH =
  '/api/authors/me/comment-protection/blocked-words'

const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest first',
  },
  {
    value: 'oldest',
    label: 'Oldest first',
  },
  {
    value: 'az',
    label: 'A–Z',
  },
  {
    value: 'za',
    label: 'Z–A',
  },
]

const FILTER_COPY = {
  auto_hide: {
    tabLabel: 'Auto-hide Words',
    heroTitle: 'Auto-hide Words',
    heroDescription:
      'Comments containing these words will be hidden and sent to review.',
    addTitle: 'Add an auto-hide word',
    addDescription:
      'Capital letters are treated as the same word.',
    limitPlaceholder:
      'Auto-hide word limit reached',
    searchPlaceholder:
      'Search auto-hide words',
    listTitle: 'Your auto-hide words',
    listDescription:
      'Comments matching these words go to Hidden Comments.',
    emptyTitle: 'No auto-hide words yet',
    emptyDescription:
      'Add your first word above to start hiding matching comments for review.',
    icon: 'fa-regular fa-eye-slash',
  },
  block: {
    tabLabel: 'Blocked Words',
    heroTitle: 'Blocked Words',
    heroDescription:
      'Readers cannot post comments containing these words or phrases.',
    addTitle: 'Add a blocked word',
    addDescription:
      'Capital letters are treated as the same word.',
    limitPlaceholder:
      'Blocked word limit reached',
    searchPlaceholder:
      'Search blocked words',
    listTitle: 'Your blocked words',
    listDescription:
      'Readers must remove these words before posting.',
    emptyTitle: 'No blocked words yet',
    emptyDescription:
      'Add your first word above to stop matching comments before they are posted.',
    icon: 'fa-solid fa-ban',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function normalizeWord(value) {
  return String(value || '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function formatAddedDate(value) {
  const date = new Date(value || '')

  if (Number.isNaN(date.getTime())) {
    return 'Added recently'
  }

  return `Added ${date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )} · ${date.toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: '2-digit',
    }
  )}`
}

function SettingCard({
  icon,
  title,
  subtitle,
  status = 'Coming soon',
  available = false,
  onClick,
}) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#f5f3fa] text-[#111827]">
        <i
          className={`${icon} text-[15px]`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14.5px] font-extrabold text-[#111827]">
            {title}
          </h3>

          {status ? (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.04em] ${
                available
                  ? 'bg-[#ecfdf3] text-[#16803c]'
                  : 'bg-[#fff7ed] text-[#f97316]'
              }`}
            >
              {status}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 text-[12.5px] font-medium leading-5 text-[#8d94a1]">
          {subtitle}
        </p>
      </div>

      {onClick ? (
        <i className="fa-solid fa-chevron-right mt-4 shrink-0 text-[11px] text-[#c6c9d1]" />
      ) : null}
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-[22px] border border-[#eceaf2] bg-white p-4 text-left shadow-sm transition active:scale-[0.99]"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="rounded-[22px] border border-[#eceaf2] bg-white p-4 shadow-sm">
      {content}
    </div>
  )
}

function LoadingWords() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#eeeaf7] bg-white">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 border-b border-[#f1eef7] px-4 py-4 last:border-b-0"
        >
          <div className="h-11 w-11 animate-pulse rounded-[15px] bg-[#f3f0fb]" />

          <div className="min-w-0 flex-1">
            <div className="h-4 w-28 animate-pulse rounded-full bg-[#f3f0fb]" />
            <div className="mt-2 h-3 w-40 animate-pulse rounded-full bg-[#f7f5fb]" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-[14px] bg-[#fff1f3]" />
        </div>
      ))}
    </div>
  )
}

function ProtectionIcon({
  filterType,
}) {
  const icon =
    FILTER_COPY[filterType].icon

  return (
    <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#f4efff] to-[#ebe5ff] shadow-[0_12px_28px_rgba(109,74,255,0.16)] ring-1 ring-[#ded5ff]">
      <i
        className={`${icon} text-[31px] text-[#7555f6]`}
      />

      <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#7555f6] shadow-md">
        <i className="fa-solid fa-comment-dots text-[10px]" />
      </div>
    </div>
  )
}

function WordFilterTabs({
  value,
  onChange,
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-1 rounded-[18px] border border-[#e7e1f1] bg-[#f4f1f9] p-1.5">
      {[
        'auto_hide',
        'block',
      ].map((type) => {
        const active =
          value === type

        return (
          <button
            key={type}
            type="button"
            onClick={() =>
              onChange(type)
            }
            className={`min-h-11 rounded-[14px] px-3 text-[12px] font-extrabold transition active:scale-[0.98] ${
              active
                ? 'bg-white text-[#7047f5] shadow-[0_5px_16px_rgba(61,45,115,0.10)] ring-1 ring-[#e5dcff]'
                : 'text-[#777d91]'
            }`}
          >
            {FILTER_COPY[type].tabLabel}
          </button>
        )
      })}
    </div>
  )
}

export default function AuthorCommentProtectionPage() {
  const navigate = useNavigate()
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams()
  const toastTimerRef =
    useRef(null)
  const isWordFilters =
    searchParams.get('view') ===
    'word-filters'
  const filterType =
    searchParams.get('type') ===
    'block'
      ? 'block'
      : 'auto_hide'
  const copy =
    FILTER_COPY[filterType]

  const [words, setWords] =
    useState([])
  const [limit, setLimit] =
    useState(200)
  const [
    wordInput,
    setWordInput,
  ] = useState('')
  const [search, setSearch] =
    useState('')
  const [sort, setSort] =
    useState('newest')
  const [loading, setLoading] =
    useState(false)
  const [saving, setSaving] =
    useState(false)
  const [
    deletingId,
    setDeletingId,
  ] = useState('')
  const [
    inputError,
    setInputError,
  ] = useState('')
  const [toast, setToast] =
    useState(null)

  const request = useCallback(
    async (
      path,
      options = {}
    ) => {
      const token =
        getAuthToken()

      if (!token) {
        navigate('/login', {
          replace: true,
        })
        throw new Error(
          'Please login again.'
        )
      }

      const response =
        await fetch(
          `${API_BASE_URL}${path}`,
          {
            ...options,
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`,
              ...(options.headers ||
                {}),
            },
          }
        )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (
        response.status === 401
      ) {
        navigate('/login', {
          replace: true,
        })
      }

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Request failed'
        )
      }

      return data
    },
    [navigate]
  )

  const showToast = useCallback(
    (
      message,
      type = 'success'
    ) => {
      setToast({
        message,
        type,
      })

      window.clearTimeout(
        toastTimerRef.current
      )

      toastTimerRef.current =
        window.setTimeout(() => {
          setToast(null)
        }, 2200)
    },
    []
  )

  useEffect(() => {
    return () => {
      window.clearTimeout(
        toastTimerRef.current
      )
    }
  }, [])

  const loadWords =
    useCallback(async () => {
      try {
        setLoading(true)

        const params =
          new URLSearchParams({
            filter_type:
              filterType,
          })
        const data =
          await request(
            `${WORD_FILTERS_PATH}?${params.toString()}`
          )

        setWords(
          Array.isArray(data.words)
            ? data.words
            : []
        )
        setLimit(
          Math.max(
            1,
            Number(
              data.limit || 200
            )
          )
        )
      } catch (error) {
        showToast(
          error.message ||
            'Failed to load word filters.',
          'error'
        )
      } finally {
        setLoading(false)
      }
    }, [
      filterType,
      request,
      showToast,
    ])

  useEffect(() => {
    if (isWordFilters) {
      loadWords()
    }
  }, [
    isWordFilters,
    loadWords,
  ])

  const remaining = Math.max(
    0,
    limit - words.length
  )
  const normalizedInput =
    normalizeWord(wordInput)
  const duplicateWord =
    useMemo(
      () =>
        words.find(
          (item) =>
            normalizeWord(
              item.word
            ) ===
            normalizedInput
        ) || null,
      [
        normalizedInput,
        words,
      ]
    )
  const isDuplicate =
    Boolean(
      normalizedInput &&
      duplicateWord
    )
  const canAdd =
    Boolean(normalizedInput) &&
    !isDuplicate &&
    !saving &&
    words.length < limit

  const filteredWords =
    useMemo(() => {
      const keyword =
        normalizeWord(search)
      const filtered =
        keyword
          ? words.filter(
              (item) =>
                normalizeWord(
                  item.word
                ).includes(
                  keyword
                )
            )
          : [...words]

      return filtered.sort(
        (first, second) => {
          if (sort === 'az') {
            return String(
              first.word || ''
            ).localeCompare(
              String(
                second.word || ''
              ),
              undefined,
              {
                sensitivity:
                  'base',
              }
            )
          }

          if (sort === 'za') {
            return String(
              second.word || ''
            ).localeCompare(
              String(
                first.word || ''
              ),
              undefined,
              {
                sensitivity:
                  'base',
              }
            )
          }

          const firstTime =
            new Date(
              first.created_at || 0
            ).getTime() || 0
          const secondTime =
            new Date(
              second.created_at || 0
            ).getTime() || 0

          return sort === 'oldest'
            ? firstTime -
                secondTime
            : secondTime -
                firstTime
        }
      )
    }, [
      search,
      sort,
      words,
    ])

  const openWordFilters = (
    type = 'auto_hide'
  ) => {
    setSearchParams({
      view: 'word-filters',
      type,
    })
  }

  const handleBack = () => {
    if (isWordFilters) {
      setSearchParams({})
      setWords([])
      setWordInput('')
      setSearch('')
      setInputError('')
      setToast(null)
      return
    }

    navigate('/author/profile', {
      replace: true,
    })
  }

  const handleFilterTypeChange = (
    nextType
  ) => {
    if (
      nextType === filterType
    ) {
      return
    }

    setWords([])
    setWordInput('')
    setSearch('')
    setInputError('')
    setDeletingId('')
    setSearchParams({
      view: 'word-filters',
      type: nextType,
    })
  }

  const handleInputChange = (
    event
  ) => {
    setWordInput(
      event.target.value
    )
    setInputError('')
  }

  const handleAddWord = async (
    event
  ) => {
    event.preventDefault()

    if (isDuplicate) {
      setInputError(
        `This word is already in ${copy.tabLabel}.`
      )
      return
    }

    if (!canAdd) return

    try {
      setSaving(true)
      setInputError('')

      const cleanInput =
        wordInput
          .normalize('NFC')
          .trim()
          .replace(/\s+/g, ' ')
      const data =
        await request(
          WORD_FILTERS_PATH,
          {
            method: 'POST',
            body:
              JSON.stringify({
                word: cleanInput,
                filter_type:
                  filterType,
              }),
          }
        )

      setWords((current) => [
        data.word,
        ...current,
      ])
      setWordInput('')
      showToast(
        data.message ||
          `“${
            data.word?.word ||
            cleanInput
          }” was added.`
      )
    } catch (error) {
      const errorMessage =
        error.message ||
        'Failed to add word filter.'

      if (
        errorMessage
          .toLowerCase()
          .includes(
            'already exists'
          )
      ) {
        setInputError(
          errorMessage
        )
      } else {
        setInputError(
          errorMessage
        )
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteWord =
    async (item) => {
      const approved =
        window.confirm(
          `Remove “${item.word}” from ${copy.tabLabel}?`
        )

      if (!approved) return

      try {
        setDeletingId(
          String(item.id)
        )

        const data =
          await request(
            `${WORD_FILTERS_PATH}/${encodeURIComponent(
              item.id
            )}`,
            {
              method: 'DELETE',
            }
          )

        setWords((current) =>
          current.filter(
            (word) =>
              String(word.id) !==
              String(item.id)
          )
        )
        showToast(
          data.message ||
            'Word filter removed.'
        )
      } catch (error) {
        showToast(
          error.message ||
            'Failed to remove word filter.',
          'error'
        )
      } finally {
        setDeletingId('')
      }
    }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#faf9ff_45%,#f4f0ff_100%)] pb-[110px]">
      <header className="sticky top-0 z-50 border-b border-[#eeeaf6] bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-start text-[#111827] transition active:scale-95 active:opacity-60"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#12162f]">
            {isWordFilters
              ? 'Word Filters'
              : 'Comment Protection'}
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {!isWordFilters ? (
        <main className="mx-auto max-w-4xl px-4 pt-4">
          <section className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#111827] text-white">
              <i className="fa-solid fa-shield-halved text-[20px]" />
            </div>

            <h2 className="mt-4 text-[22px] font-black text-[#111827]">
              Author Comment Protection
            </h2>

            <p className="mt-2 text-[13.5px] font-semibold leading-6 text-[#667085]">
              Protect your story comments with word filters, hidden comment review, reader restrictions, and automatic cleanup.
            </p>

            <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-4">
              <div className="text-[12px] font-black uppercase tracking-[0.04em] text-[#475467]">
                Responsibility
              </div>

              <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
                Your rules apply only to comments on your stories. Admin Block Words remain platform-wide for public areas.
              </p>
            </div>
          </section>

          <section className="mt-4 grid gap-3">
            <SettingCard
              icon="fa-solid fa-filter"
              title="Word Filters"
              subtitle="Choose words to auto-hide for review or block before posting."
              status={null}
              onClick={() =>
                openWordFilters(
                  'auto_hide'
                )
              }
            />

            <SettingCard
              icon="fa-regular fa-eye-slash"
              title="Hidden Comments"
              subtitle="Review comments hidden by your auto-hide words and rules."
              status={null}
              onClick={() =>
                navigate(
                  '/author/comment-protection/hidden-comments'
                )
              }
            />

                        <SettingCard
              icon="fa-solid fa-user-slash"
              title="Blocked Readers"
              subtitle="Block readers from commenting on your own story or author page."
            />

            <SettingCard
              icon="fa-solid fa-clock-rotate-left"
              title="Moderation History"
              subtitle="Review author comment moderation actions and system cleanup records."
            />
          </section>
        </main>
      ) : (
        <main className="mx-auto max-w-4xl px-3.5 pt-4 sm:px-4">
          <section className="overflow-hidden rounded-[28px] border border-[#e8e2f7] bg-white shadow-[0_14px_38px_rgba(61,45,115,0.08)]">
            <div className="relative bg-[radial-gradient(circle_at_top_right,rgba(184,157,255,0.28),transparent_42%),linear-gradient(135deg,#ffffff_0%,#fbf9ff_58%,#f4efff_100%)] p-5">
              <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#d9ccff]/20 blur-2xl" />

              <div className="relative flex items-center gap-4">
                <ProtectionIcon
                  filterType={
                    filterType
                  }
                />

                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-black uppercase tracking-[0.09em] text-[#7050ed]">
                    Comment protection
                  </div>

                  <h2 className="mt-1 text-[22px] font-black tracking-[-0.02em] text-[#12162f]">
                    {copy.heroTitle}
                  </h2>

                  <p className="mt-2 max-w-[440px] text-[12.5px] font-medium leading-5 text-[#6d728b]">
                    {copy.heroDescription}
                  </p>
                </div>

                <div className="shrink-0 rounded-[20px] bg-white/75 px-3.5 py-3 text-center shadow-[0_8px_24px_rgba(85,62,160,0.08)] ring-1 ring-white">
                  <div className="whitespace-nowrap text-[19px] font-black text-[#7050ed]">
                    {words.length}
                    <span className="ml-1 text-[13px] font-bold text-[#6d728b]">
                      / {limit}
                    </span>
                  </div>

                  <div className="mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#8d94a8]">
                    Used
                  </div>
                </div>
              </div>
            </div>
          </section>

          <WordFilterTabs
            value={filterType}
            onChange={
              handleFilterTypeChange
            }
          />

          <form
            onSubmit={handleAddWord}
            className="mt-3.5 rounded-[28px] border border-[#e8e4f0] bg-white p-4 shadow-[0_12px_34px_rgba(61,45,115,0.07)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <label
                  htmlFor={`author-word-filter-${filterType}`}
                  className="text-[16px] font-black text-[#12162f]"
                >
                  {copy.addTitle}
                </label>

                <p className="mt-1 text-[11.5px] font-medium leading-5 text-[#777d93]">
                  {copy.addDescription}
                </p>
              </div>

              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f2fc] text-[#72778c]"
                title="Words and phrases are matched without case sensitivity."
              >
                <i className="fa-solid fa-circle-info text-[13px]" />
              </div>
            </div>

            <div className="mt-3 flex gap-2.5">
              <div className="relative min-w-0 flex-1">
                <input
                  id={`author-word-filter-${filterType}`}
                  value={wordInput}
                  onChange={
                    handleInputChange
                  }
                  maxLength={120}
                  disabled={
                    saving ||
                    words.length >=
                      limit
                  }
                  placeholder={
                    words.length >=
                    limit
                      ? copy.limitPlaceholder
                      : 'Type a word or phrase'
                  }
                  className={`h-12 w-full rounded-[17px] border bg-[#fbfaff] px-4 pr-10 text-[14px] font-semibold text-[#12162f] outline-none transition placeholder:font-medium placeholder:text-[#a3a7b7] focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isDuplicate ||
                    inputError
                      ? 'border-[#ef626f] focus:border-[#ef626f] focus:ring-[#ef626f]/10'
                      : 'border-[#ddd7ec] focus:border-[#7555f6] focus:ring-[#7555f6]/10'
                  }`}
                />

                {wordInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWordInput('')
                      setInputError('')
                    }}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#a3a7b7] active:bg-[#f1eef7]"
                    aria-label="Clear word"
                  >
                    <i className="fa-solid fa-circle-xmark text-[14px]" />
                  </button>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={!canAdd}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[17px] bg-gradient-to-r from-[#7047f5] to-[#8459ff] px-5 text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(112,71,245,0.24)] transition active:scale-95 disabled:cursor-not-allowed disabled:from-[#d0d1da] disabled:to-[#c9cad4] disabled:shadow-none"
              >
                {saving ? (
                  <i className="fa-solid fa-spinner animate-spin text-[12px]" />
                ) : null}

                {saving
                  ? 'Adding...'
                  : 'Add'}
              </button>
            </div>

            {isDuplicate ||
            inputError ? (
              <div className="mt-2.5 flex items-start gap-2 rounded-[14px] bg-[#fff3f4] px-3 py-2.5 text-[#d83f50]">
                <i className="fa-solid fa-triangle-exclamation mt-0.5 text-[12px]" />

                <span className="text-[11.5px] font-bold leading-5">
                  {isDuplicate
                    ? `This word is already in ${copy.tabLabel}.`
                    : inputError}
                </span>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2.5 rounded-[16px] bg-[#f7f4ff] px-3 py-2.5">
                <i className="fa-solid fa-wand-magic-sparkles text-[13px] text-[#7555f6]" />

                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-[#252942]">
                    Duplicate protection
                  </div>

                  <div className="mt-0.5 text-[10.5px] font-medium text-[#777d93]">
                    We’ll warn you before adding the same word again.
                  </div>
                </div>

                <div className="ml-auto shrink-0 text-[10.5px] font-bold text-[#7555f6]">
                  {remaining} left
                </div>
              </div>
            )}
          </form>

          <section className="mt-3.5 flex gap-2.5">
            <div className="relative min-w-0 flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[#8f95a8]" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={
                  copy.searchPlaceholder
                }
                className="h-12 w-full rounded-[18px] border border-[#e5e1ee] bg-white pl-10 pr-10 text-[13px] font-semibold text-[#12162f] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition placeholder:font-medium placeholder:text-[#9da1b1] focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
              />

              {search ? (
                <button
                  type="button"
                  onClick={() =>
                    setSearch('')
                  }
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#9da1b1] active:bg-[#f4f1f9]"
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark text-[13px]" />
                </button>
              ) : null}
            </div>

            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="h-12 appearance-none rounded-[18px] border border-[#e5e1ee] bg-white pl-4 pr-9 text-[12.5px] font-bold text-[#252942] shadow-[0_8px_24px_rgba(61,45,115,0.05)] outline-none transition focus:border-[#7555f6] focus:ring-4 focus:ring-[#7555f6]/10"
                aria-label={`Sort ${copy.tabLabel}`}
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#74798c]" />
            </div>
          </section>

          <section className="mt-4">
            <div className="flex items-end justify-between gap-3 px-0.5">
              <div>
                <h3 className="text-[17px] font-black tracking-[-0.01em] text-[#12162f]">
                  {copy.listTitle}
                </h3>

                <p className="mt-1 text-[11.5px] font-medium text-[#777d93]">
                  {copy.listDescription}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#f2ecff] px-3 py-1.5 text-[10.5px] font-extrabold text-[#7050ed]">
                {filteredWords.length}{' '}
                {filteredWords.length ===
                1
                  ? 'word'
                  : 'words'}
              </span>
            </div>

            <div className="mt-3">
              {loading ? (
                <LoadingWords />
              ) : filteredWords.length ? (
                <div className="overflow-hidden rounded-[24px] border border-[#e9e4f1] bg-white shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
                  {filteredWords.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-[#f0edf5] px-3.5 py-3.5 last:border-b-0"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#f4efff] text-[#7555f6] ring-1 ring-[#e4dbff]">
                          <i
                            className={`${copy.icon} text-[14px]`}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="break-words text-[14px] font-extrabold text-[#171a31]">
                            {item.word}
                          </div>

                          <div className="mt-1 text-[10.5px] font-medium text-[#858a9d]">
                            {formatAddedDate(
                              item.created_at
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteWord(
                              item
                            )
                          }
                          disabled={
                            deletingId ===
                            String(item.id)
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#fff1f3] text-[#ef4455] ring-1 ring-[#ffd9de] transition active:scale-95 disabled:opacity-50"
                          aria-label={`Remove ${item.word}`}
                        >
                          <i
                            className={`${
                              deletingId ===
                              String(
                                item.id
                              )
                                ? 'fa-solid fa-spinner animate-spin'
                                : 'fa-regular fa-trash-can'
                            } text-[13px]`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[#e9e4f1] bg-white px-5 py-10 text-center shadow-[0_12px_34px_rgba(61,45,115,0.06)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[19px] bg-[#f4efff] text-[#7555f6] ring-1 ring-[#e4dbff]">
                    <i
                      className={`${copy.icon} text-[20px]`}
                    />
                  </div>

                  <h3 className="mt-3 text-[14px] font-extrabold text-[#171a31]">
                    {search
                      ? 'No matching words found'
                      : copy.emptyTitle}
                  </h3>

                  <p className="mx-auto mt-1.5 max-w-[290px] text-[11.5px] font-medium leading-5 text-[#858a9d]">
                    {search
                      ? 'Try another search term or clear your search.'
                      : copy.emptyDescription}
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="pointer-events-none mx-auto mt-12 flex h-28 max-w-[240px] items-center justify-center opacity-35">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#e5dcff] to-[#c9b8ff] text-white shadow-[0_18px_50px_rgba(112,71,245,0.28)]">
              <i className="fa-solid fa-shield-halved text-[29px]" />
              <i className="fa-solid fa-check absolute text-[12px]" />
            </div>
          </div>
        </main>
      )}

      {toast ? (
        <div className="fixed bottom-[calc(18px+env(safe-area-inset-bottom))] left-1/2 z-[120] w-[calc(100%-28px)] max-w-md -translate-x-1/2">
          <div
            className={`flex items-center gap-3 rounded-[20px] border px-4 py-3 shadow-[0_18px_50px_rgba(32,28,51,0.18)] ${
              toast.type === 'error'
                ? 'border-[#ffd6dc] bg-[#fff5f6] text-[#c93649]'
                : 'border-[#ccefd8] bg-[#f0fff5] text-[#16803c]'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                toast.type === 'error'
                  ? 'bg-[#ffe1e5]'
                  : 'bg-[#d9f8e4]'
              }`}
            >
              <i
                className={`fa-solid ${
                  toast.type === 'error'
                    ? 'fa-triangle-exclamation'
                    : 'fa-check'
                } text-[13px]`}
              />
            </div>

            <span className="min-w-0 flex-1 text-[12px] font-bold leading-5">
              {toast.message}
            </span>

            <button
              type="button"
              onClick={() =>
                setToast(null)
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full active:bg-black/5"
              aria-label="Close message"
            >
              <i className="fa-solid fa-xmark text-[13px]" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
