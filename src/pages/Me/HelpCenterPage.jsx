import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LoaderCircle,
  MessageCircle,
  PenLine,
  RefreshCw,
  Search,
  ShoppingBag,
  UserRound,
  WalletCards,
  Wrench,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const categoryIcons = {
  'account-and-profile': UserRound,
  'reading-and-library': BookOpen,
  'wallet-and-payments': WalletCards,
  'authors-and-publishing': PenLine,
  'shadow-mall-and-orders': ShoppingBag,
  'technical-problems': Wrench,
}

const categoryTones = {
  'account-and-profile': { background: '#EAF2FF', foreground: '#4F7DDC' },
  'reading-and-library': { background: '#F0EAFE', foreground: '#7658CE' },
  'wallet-and-payments': { background: '#FFF2D9', foreground: '#D58B1D' },
  'authors-and-publishing': { background: '#FDEBF2', foreground: '#D65C88' },
  'shadow-mall-and-orders': { background: '#E8F7EF', foreground: '#379468' },
  'technical-problems': { background: '#FCEAE8', foreground: '#D35C51' },
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function CategoryIcon({ category, size = 20 }) {
  const Icon = categoryIcons[category?.slug] || CircleHelp
  return <Icon size={size} strokeWidth={1.9} />
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-[17px] font-black tracking-[-0.025em] text-[#17172e] dark:text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-[12px] leading-5 text-[#8a8fa0] dark:text-white/50">{subtitle}</p>
      ) : null}
    </div>
  )
}

export default function HelpCenterPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [popularArticles, setPopularArticles] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [openArticle, setOpenArticle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadHelpCenter() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/api/help-center`)
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Unable to load Help Center')
        }

        if (ignore) return

        setCategories(Array.isArray(data.categories) ? data.categories : [])
        setArticles(Array.isArray(data.articles) ? data.articles : [])
        setPopularArticles(Array.isArray(data.popular_articles) ? data.popular_articles : [])
      } catch (err) {
        if (!ignore) setError(err.message || 'Unable to load Help Center')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadHelpCenter()

    return () => {
      ignore = true
    }
  }, [reloadKey])

  const filteredArticles = useMemo(() => {
    const search = normalize(query)

    return articles.filter((article) => {
      const matchesCategory = !selectedCategory || article.category_id === selectedCategory
      const searchable = normalize(
        `${article.question} ${article.answer} ${article.search_keywords} ${article.category?.name}`,
      )
      return matchesCategory && (!search || searchable.includes(search))
    })
  }, [articles, query, selectedCategory])

  const visiblePopular = useMemo(() => {
    const search = normalize(query)
    return popularArticles.filter((article) => {
      if (!search) return true
      return normalize(`${article.question} ${article.search_keywords} ${article.category?.name}`).includes(search)
    })
  }, [popularArticles, query])

  function chooseCategory(categoryId) {
    setSelectedCategory((current) => (current === categoryId ? '' : categoryId))
    setOpenArticle('')
    requestAnimationFrame(() => {
      document.getElementById('help-faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12 text-[#17172e] dark:bg-[#0d0f16] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-[#eceaf3] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#171923]/95">
        <div className="relative mx-auto flex h-12 max-w-[760px] items-center justify-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-4 flex h-10 w-10 items-center justify-start text-[#111827] active:scale-95 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.9} />
          </button>
          <h1 className="text-[16px] font-bold tracking-[-0.02em] text-[#111827] dark:text-white">
            Help Center
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pt-4 sm:pt-6">
        <section className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#7458e8] via-[#8068e9] to-[#9a83ee] px-5 py-6 text-white shadow-[0_14px_38px_rgba(116,88,232,0.2)] sm:px-7 sm:py-8">
          <span className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-16 left-[18%] h-32 w-32 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-[23px] font-black tracking-[-0.04em] sm:text-[28px]">How can we help?</h2>
            <p className="mt-1.5 text-[12px] leading-5 text-white/75 sm:text-[13px]">
              Find answers, guides, and support for Shadow.
            </p>

            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8c82ac]" strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setOpenArticle('')
                }}
                type="search"
                placeholder="Search for help..."
                className="h-12 w-full rounded-[14px] border-0 bg-white pl-11 pr-11 text-[13px] font-medium text-[#22223b] outline-none ring-1 ring-white/30 placeholder:text-[#aaa5b8] focus:ring-4 focus:ring-white/25"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#9992ac] active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </section>

        {error ? (
          <section className="mt-4 rounded-[16px] border border-[#f3d5d8] bg-[#fff5f5] px-5 py-6 text-center dark:border-red-400/20 dark:bg-red-400/10">
            <p className="text-[13px] font-bold text-[#c9424a] dark:text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mx-auto mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7458e8] px-4 text-[12px] font-extrabold text-white active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </section>
        ) : null}

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <LoaderCircle className="h-7 w-7 animate-spin text-[#7458e8]" />
          </div>
        ) : !error ? (
          <>
            {visiblePopular.length ? (
              <section className="mt-7">
                <SectionTitle title="Popular Help" subtitle="Quick answers to common questions." />
                <div className="mt-3 overflow-hidden rounded-[16px] border border-[#eceaf3] bg-white shadow-[0_5px_18px_rgba(25,20,55,0.04)] dark:border-white/10 dark:bg-[#171923]">
                  {visiblePopular.slice(0, 5).map((article, index) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory('')
                        setOpenArticle(article.id)
                        requestAnimationFrame(() => document.getElementById('help-faq')?.scrollIntoView({ behavior: 'smooth' }))
                      }}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:bg-[#f8f6ff] dark:active:bg-white/5 ${
                        index ? 'border-t border-[#f0eef5] dark:border-white/10' : ''
                      }`}
                    >
                      <span className="line-clamp-2 text-[13px] font-bold leading-5 text-[#29283e] dark:text-white">
                        {article.question}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#b2adbd]" strokeWidth={1.8} />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-7">
              <SectionTitle title="Browse by Category" subtitle="Choose a topic to find the right guide." />
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((category) => {
                  const selected = selectedCategory === category.id
                  const tone = categoryTones[category.slug] || {
                    background: category.color || '#EEE9FF',
                    foreground: '#7458E8',
                  }

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => chooseCategory(category.id)}
                      className={`min-h-[122px] rounded-[16px] border bg-white p-3.5 text-left shadow-[0_4px_16px_rgba(25,20,55,0.035)] transition active:scale-[0.98] dark:bg-[#171923] ${
                        selected
                          ? 'border-[#7458e8] ring-2 ring-[#7458e8]/10 dark:border-[#9c88ef]'
                          : 'border-[#eceaf3] dark:border-white/10'
                      }`}
                    >
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-[13px]"
                        style={{ backgroundColor: tone.background, color: tone.foreground }}
                      >
                        <CategoryIcon category={category} />
                      </span>
                      <span className="mt-3 block text-[12.5px] font-black leading-[18px] text-[#2a293e] dark:text-white">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-[10.5px] font-medium text-[#9a96a5] dark:text-white/40">
                        {category.article_count} {Number(category.article_count) === 1 ? 'article' : 'articles'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section id="help-faq" className="scroll-mt-16 pt-7">
              <div className="flex items-end justify-between gap-4">
                <SectionTitle
                  title="Frequently Asked Questions"
                  subtitle={selectedCategory ? 'Showing questions from the selected category.' : 'Tap a question to view its answer.'}
                />
                {selectedCategory ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('')
                      setOpenArticle('')
                    }}
                    className="shrink-0 text-[11px] font-extrabold text-[#7458e8]"
                  >
                    View all
                  </button>
                ) : null}
              </div>

              {filteredArticles.length ? (
                <div className="mt-3 space-y-2.5">
                  {filteredArticles.map((article) => {
                    const open = openArticle === article.id

                    return (
                      <article
                        key={article.id}
                        className={`overflow-hidden rounded-[16px] border bg-white transition dark:bg-[#171923] ${
                          open
                            ? 'border-[#cfc4f8] shadow-[0_8px_24px_rgba(116,88,232,0.08)] dark:border-[#7458e8]/60'
                            : 'border-[#eceaf3] dark:border-white/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenArticle(open ? '' : article.id)}
                          aria-expanded={open}
                          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                        >
                          <span className="text-[13px] font-black leading-5 text-[#29283e] dark:text-white">
                            {article.question}
                          </span>
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${open ? 'rotate-180 bg-[#eee9ff] text-[#7458e8] dark:bg-[#7458e8]/20' : 'bg-[#f6f5f8] text-[#9995a4] dark:bg-white/10'}`}>
                            <ChevronDown className="h-4 w-4" strokeWidth={2} />
                          </span>
                        </button>
                        {open ? (
                          <div className="border-t border-[#f0eef5] px-4 py-4 text-[12.5px] leading-6 text-[#5f5b70] dark:border-white/10 dark:text-white/65">
                            <p className="whitespace-pre-line">{article.answer}</p>
                            {article.category?.name ? (
                              <div className="mt-3 text-[10.5px] font-bold text-[#8c79dc]">
                                {article.category.name}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-3 rounded-[16px] border border-[#eceaf3] bg-white px-5 py-9 text-center dark:border-white/10 dark:bg-[#171923]">
                  <Search className="mx-auto h-6 w-6 text-[#aaa5b6]" />
                  <h3 className="mt-3 text-[14px] font-black text-[#29283e] dark:text-white">No answers found</h3>
                  <p className="mt-1 text-[12px] text-[#92909d] dark:text-white/45">Try another search or category.</p>
                </div>
              )}
            </section>

            <section className="mt-7 rounded-[18px] border border-[#e6e0fb] bg-[#f5f1ff] px-5 py-6 text-center dark:border-[#7458e8]/25 dark:bg-[#7458e8]/10">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-[#7458e8] shadow-sm dark:bg-white/10 dark:text-[#b7a8f5]">
                <MessageCircle className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <h2 className="mt-3 text-[17px] font-black text-[#28263e] dark:text-white">Still need help?</h2>
              <p className="mx-auto mt-1 max-w-[360px] text-[12px] leading-5 text-[#777287] dark:text-white/55">
                Send us your question or report a problem and our team will review it.
              </p>
              <button
                type="button"
                onClick={() => navigate('/feedback')}
                className="mt-4 h-11 rounded-[13px] bg-[#7458e8] px-6 text-[12.5px] font-black text-white shadow-[0_8px_20px_rgba(116,88,232,0.22)] active:scale-[0.98]"
              >
                Contact Support
              </button>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
