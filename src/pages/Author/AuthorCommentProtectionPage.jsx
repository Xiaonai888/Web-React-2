import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const BLOCKED_WORDS_PATH = '/api/authors/me/comment-protection/blocked-words'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function SettingCard({ icon, title, subtitle, status = 'Coming soon', available = false, onClick }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#f5f3fa] text-[#111827]">
        <i className={`${icon} text-[15px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14.5px] font-extrabold text-[#111827]">{title}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.04em] ${
              available
                ? 'bg-[#ecfdf3] text-[#16803c]'
                : 'bg-[#fff7ed] text-[#f97316]'
            }`}
          >
            {status}
          </span>
        </div>

        <p className="mt-1.5 text-[12.5px] font-medium leading-5 text-[#8d94a1]">{subtitle}</p>
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

  return <div className="rounded-[22px] border border-[#eceaf2] bg-white p-4 shadow-sm">{content}</div>
}

function LoadingWords() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-[62px] animate-pulse rounded-[18px] bg-[#f5f3fa]" />
      ))}
    </div>
  )
}

export default function AuthorCommentProtectionPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('home')
  const [words, setWords] = useState([])
  const [limit, setLimit] = useState(200)
  const [wordInput, setWordInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  const request = useCallback(
    async (path, options = {}) => {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        throw new Error('Please login again.')
      }

      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      })
      const data = await response.json().catch(() => ({}))

      if (response.status === 401) {
        navigate('/login', { replace: true })
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Request failed')
      }

      return data
    },
    [navigate]
  )

  const showMessage = useCallback((text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
  }, [])

  const loadWords = useCallback(async () => {
    try {
      setLoading(true)
      setMessage('')
      const data = await request(BLOCKED_WORDS_PATH)
      setWords(Array.isArray(data.words) ? data.words : [])
      setLimit(Math.max(1, Number(data.limit || 200)))
    } catch (error) {
      showMessage(error.message || 'Failed to load blocked words.', 'error')
    } finally {
      setLoading(false)
    }
  }, [request, showMessage])

  useEffect(() => {
    if (view === 'blocked-words') {
      loadWords()
    }
  }, [loadWords, view])

  const remaining = Math.max(0, limit - words.length)
  const canAdd = useMemo(
    () => Boolean(wordInput.trim() && !saving && words.length < limit),
    [limit, saving, wordInput, words.length]
  )

  const handleBack = () => {
    if (view === 'blocked-words') {
      setView('home')
      setMessage('')
      setWordInput('')
      return
    }

    navigate('/author/profile', { replace: true })
  }

  const handleAddWord = async (event) => {
    event.preventDefault()

    if (!canAdd) return

    try {
      setSaving(true)
      setMessage('')
      const data = await request(BLOCKED_WORDS_PATH, {
        method: 'POST',
        body: JSON.stringify({ word: wordInput.trim() }),
      })

      setWords((current) => [data.word, ...current])
      setWordInput('')
      showMessage(data.message || 'Blocked word added.')
    } catch (error) {
      showMessage(error.message || 'Failed to add blocked word.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteWord = async (item) => {
    const approved = window.confirm(`Remove “${item.word}” from blocked words?`)

    if (!approved) return

    try {
      setDeletingId(String(item.id))
      setMessage('')
      const data = await request(`${BLOCKED_WORDS_PATH}/${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      })

      setWords((current) => current.filter((word) => String(word.id) !== String(item.id)))
      showMessage(data.message || 'Blocked word removed.')
    } catch (error) {
      showMessage(error.message || 'Failed to remove blocked word.', 'error')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-[100px]">
      <header className="sticky top-0 z-50 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-[17px] font-extrabold text-[#111827]">
            {view === 'blocked-words' ? 'Blocked Words' : 'Comment Protection'}
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      {view === 'home' ? (
        <main className="mx-auto max-w-4xl px-4 pt-4">
          <section className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex h-13 w-13 items-center justify-center rounded-[20px] bg-[#111827] text-white">
              <i className="fa-solid fa-shield-halved text-[20px]" />
            </div>

            <h2 className="mt-4 text-[22px] font-black text-[#111827]">Author Comment Protection</h2>

            <p className="mt-2 text-[13.5px] font-semibold leading-6 text-[#667085]">
              Protect your story comments with your own blocked words, hidden comment review, reader restrictions, and automatic cleanup.
            </p>

            <div className="mt-4 rounded-[20px] bg-[#f8fafc] p-4">
              <div className="text-[12px] font-black uppercase tracking-[0.04em] text-[#475467]">Responsibility</div>
              <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
                Your rules apply only to comments on your stories. Admin Block Words remain platform-wide for public areas.
              </p>
            </div>
          </section>

          <section className="mt-4 grid gap-3">
            <SettingCard
              icon="fa-solid fa-ban"
              title="Author Blocked Words"
              subtitle="Add words that readers cannot use in comments on your stories."
              status="Available"
              available
              onClick={() => setView('blocked-words')}
            />

            <SettingCard
              icon="fa-regular fa-eye-slash"
              title="Hidden Comments"
              subtitle="Comments hidden by author rules will wait here for review."
            />

            <SettingCard
              icon="fa-solid fa-user-slash"
              title="Blocked Readers"
              subtitle="Block readers from commenting on your own story or author page."
            />

            <SettingCard
              icon="fa-solid fa-broom"
              title="Auto Cleanup"
              subtitle="Hidden comments can be cleaned automatically after a safe review period."
            />

            <SettingCard
              icon="fa-solid fa-clock-rotate-left"
              title="Comment Records"
              subtitle="Author comment moderation actions will be recorded for safety."
            />
          </section>
        </main>
      ) : (
        <main className="mx-auto max-w-4xl px-4 pt-4">
          <section className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[12px] font-black uppercase tracking-[0.06em] text-[#6d4aff]">Story comments</div>
                <h2 className="mt-1 text-[21px] font-black text-[#111827]">Blocked Words</h2>
                <p className="mt-2 text-[13px] font-medium leading-6 text-[#667085]">
                  Add a word or phrase to protect comments across all stories owned by this Author Page.
                </p>
              </div>

              <div className="shrink-0 rounded-[18px] bg-[#f5f3fa] px-3 py-2 text-center">
                <div className="text-[16px] font-black text-[#111827]">{words.length}</div>
                <div className="text-[9.5px] font-bold uppercase tracking-[0.05em] text-[#8d94a1]">of {limit}</div>
              </div>
            </div>
          </section>

          <form onSubmit={handleAddWord} className="mt-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <label htmlFor="author-blocked-word" className="text-[13px] font-extrabold text-[#111827]">
              Add blocked word
            </label>
            <p className="mt-1 text-[11.5px] font-medium leading-5 text-[#8d94a1]">
              Capital letters are treated as the same word. {remaining} slots remaining.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                id="author-blocked-word"
                value={wordInput}
                onChange={(event) => setWordInput(event.target.value)}
                maxLength={120}
                disabled={saving || words.length >= limit}
                placeholder="Type a word or phrase"
                className="h-12 min-w-0 flex-1 rounded-[16px] border border-[#e4e0ee] bg-[#faf9fd] px-4 text-[14px] font-medium text-[#111827] outline-none transition focus:border-[#6d4aff] focus:bg-white focus:ring-4 focus:ring-[#6d4aff]/10 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!canAdd}
                className="h-12 shrink-0 rounded-[16px] bg-[#111827] px-5 text-[13px] font-extrabold text-white active:scale-95 disabled:cursor-not-allowed disabled:bg-[#c9cdd6]"
              >
                {saving ? 'Adding...' : 'Block'}
              </button>
            </div>
          </form>

          {message ? (
            <div
              className={`mt-3 rounded-[18px] px-4 py-3 text-[12.5px] font-bold leading-5 ${
                messageType === 'error'
                  ? 'bg-[#fff1f2] text-[#c81e3a]'
                  : 'bg-[#ecfdf3] text-[#16803c]'
              }`}
            >
              {message}
            </div>
          ) : null}

          <section className="mt-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#111827]">Your blocked words</h3>
                <p className="mt-1 text-[11.5px] font-medium text-[#8d94a1]">Remove a word anytime to allow it again.</p>
              </div>
              <button
                type="button"
                onClick={loadWords}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 disabled:opacity-50"
                aria-label="Refresh blocked words"
              >
                <i className={`fa-solid fa-rotate-right text-[12px] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="mt-4">
              {loading ? (
                <LoadingWords />
              ) : words.length ? (
                <div className="space-y-2.5">
                  {words.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-[18px] bg-[#faf9fd] px-3 py-3 ring-1 ring-black/5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                        <i className="fa-solid fa-ban text-[13px]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="break-words text-[13.5px] font-extrabold text-[#111827]">{item.word}</div>
                        <div className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-[#16803c]">Blocked</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteWord(item)}
                        disabled={deletingId === String(item.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#dc2626] shadow-sm ring-1 ring-black/5 active:scale-95 disabled:opacity-50"
                        aria-label={`Remove ${item.word}`}
                      >
                        <i className={`${deletingId === String(item.id) ? 'fa-solid fa-spinner animate-spin' : 'fa-regular fa-trash-can'} text-[13px]`} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] bg-[#faf9fd] px-5 py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#8d94a1] shadow-sm ring-1 ring-black/5">
                    <i className="fa-solid fa-shield text-[17px]" />
                  </div>
                  <h3 className="mt-3 text-[14px] font-extrabold text-[#111827]">No blocked words yet</h3>
                  <p className="mx-auto mt-1 max-w-[280px] text-[12px] font-medium leading-5 text-[#8d94a1]">
                    Add your first word above to begin protecting your story comments.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  )
}
