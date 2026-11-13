import { useEffect, useState } from 'react'
import { getDisplayText } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyMentionPicker', {
  en: { title: 'Tag someone', search: 'Search people', suggested: 'People you may know', results: 'Search results', empty: 'No people found', loading: 'Loading...', failed: 'Could not load people', done: 'Done', cancel: 'Cancel', remove: 'Remove tag', following: 'You follow each other' },
  km: { title: 'Tag មនុស្សម្នាក់', search: 'ស្វែងរកឈ្មោះ', suggested: 'មនុស្សដែលអ្នកអាចស្គាល់', results: 'លទ្ធផលស្វែងរក', empty: 'រកមិនឃើញអ្នកប្រើ', loading: 'កំពុងទាញទិន្នន័យ...', failed: 'មិនអាចទាញអ្នកប្រើបាន', done: 'រួចរាល់', cancel: 'បោះបង់', remove: 'ដក Tag ចេញ', following: 'កំពុងតាមដានគ្នា' },
  zh: { title: '标记好友', search: '搜索用户', suggested: '你可能认识的人', results: '搜索结果', empty: '未找到用户', loading: '正在加载...', failed: '无法加载用户', done: '完成', cancel: '取消', remove: '移除标记', following: '互相关注' },
  ja: { title: '友達をタグ付け', search: 'ユーザーを検索', suggested: '知り合いかもしれない人', results: '検索結果', empty: 'ユーザーが見つかりません', loading: '読み込み中...', failed: 'ユーザーを読み込めません', done: '完了', cancel: 'キャンセル', remove: 'タグを外す', following: '相互フォロー' },
  ko: { title: '사람 태그하기', search: '사람 검색', suggested: '알 수도 있는 사람', results: '검색 결과', empty: '사용자를 찾을 수 없습니다', loading: '불러오는 중...', failed: '사용자를 불러올 수 없습니다', done: '완료', cancel: '취소', remove: '태그 제거', following: '맞팔로우' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const SUGGESTIONS_TTL_MS = 6 * 60 * 60 * 1000
const SUGGESTIONS_LIMIT = 10

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getStoredUsername() {
  try {
    const user = JSON.parse(localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null')
    return String(user?.username || '').trim()
  } catch {
    return ''
  }
}

function getCacheKey(mode, token) {
  let hash = 2166136261
  for (let index = 0; index < token.length; index += 1) {
    hash = Math.imul(hash ^ token.charCodeAt(index), 16777619)
  }
  return `shadow:story-mention:v2:${mode}:${(hash >>> 0).toString(36)}`
}

function readCachedSuggestions(cacheKey) {
  try {
    const stored = JSON.parse(localStorage.getItem(cacheKey) || 'null')
    if (!stored || !Array.isArray(stored.people) || !Number.isFinite(stored.expiresAt)) return null
    if (stored.expiresAt <= Date.now()) {
      localStorage.removeItem(cacheKey)
      return null
    }
    return stored.people.slice(0, SUGGESTIONS_LIMIT).filter(asPerson)
  } catch {
    return null
  }
}

function writeCachedSuggestions(cacheKey, people) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      expiresAt: Date.now() + SUGGESTIONS_TTL_MS,
      people: people.slice(0, SUGGESTIONS_LIMIT),
    }))
  } catch {
    return
  }
}

async function readJson(path, token, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) throw new Error(data.message || getDisplayText('storyMentionPicker.failed'))
  return data
}

function asPerson(value) {
  const type = value?.result_type === 'author' || value?.type === 'author' ? 'author' : 'reader'
  const username = String(value?.username || value?.page_username || '').trim().replace(/^@+/, '')
  const id = String(type === 'author' ? value?.author_page_id || value?.id || '' : value?.user_id || value?.id || '')
  if (!username || !/^[\p{L}\p{N}._-]{1,80}$/u.test(username)) return null
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) return null
  return {
    id,
    username,
    name: String(value?.name || value?.page_name || username),
    avatar: String(value?.avatar || value?.avatar_url || ''),
    type,
    mutual: Boolean(value?.mutual || value?.is_following && (value?.is_followed_by || value?.followed_at)),
  }
}

function normalizeSelection(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      username: String(value.username || value.mention_username || '').trim().replace(/^@+/, ''),
      type: ['reader', 'author'].includes(value.type) ? value.type : '',
      id: String(value.id || ''),
    }
  }
  return { username: String(value || '').trim().replace(/^@+/, ''), type: '', id: '' }
}

function rotateSuggestions(people) {
  if (people.length <= SUGGESTIONS_LIMIT) return people
  const windowIndex = Math.floor(Date.now() / SUGGESTIONS_TTL_MS)
  const start = (windowIndex * SUGGESTIONS_LIMIT) % people.length
  return [...people.slice(start), ...people.slice(0, start)].slice(0, SUGGESTIONS_LIMIT)
}

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] text-[18px] font-bold text-[var(--shadow-text-primary)]">
      {person.avatar && !failed ? <img src={person.avatar} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" /> : person.name.slice(0, 1).toUpperCase()}
    </span>
  )
}

export default function StoryMentionPicker({ mode = 'reader', value = '', onSave, onSaveTarget, onClose }) {
  const t = (key) => getDisplayText(`storyMentionPicker.${key}`)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(() => normalizeSelection(value))
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const token = getToken()
    const cacheKey = getCacheKey(mode, token)
    const cached = token ? readCachedSuggestions(cacheKey) : null

    if (cached) {
      setSuggestions(cached)
      setLoading(false)
      return () => controller.abort()
    }

    async function loadFollowers() {
      if (!token) throw new Error(t('failed'))
      let followers = []
      if (mode === 'author') {
        const profile = await readJson('/api/authors/me?include_works=0', token, controller.signal)
        const pageUsername = profile.author_page?.page_username
        if (pageUsername) {
          const data = await readJson(`/api/authors/page/${encodeURIComponent(pageUsername)}/followers?section=all&limit=10&offset=0`, token, controller.signal)
          followers = data.followers || []
        }
      } else {
        let username = getStoredUsername()
        if (!username) {
          const profile = await readJson('/api/users/me', token, controller.signal)
          username = String(profile.user?.username || '')
        }
        if (username) {
          const data = await readJson(`/api/users/${encodeURIComponent(username)}/followers?page=1&limit=10`, token, controller.signal)
          followers = data.users || []
        }
      }
      const seen = new Set()
      const people = followers.map(asPerson).filter((person) => {
        if (!person || seen.has(`${person.type}:${person.id}`)) return false
        seen.add(`${person.type}:${person.id}`)
        return true
      })
      people.sort((a, b) => Number(b.mutual) - Number(a.mutual))
      const nextSuggestions = rotateSuggestions(people)
      if (!controller.signal.aborted) {
        setSuggestions(nextSuggestions)
        writeCachedSuggestions(cacheKey, nextSuggestions)
      }
    }
    loadFollowers().catch((err) => {
      if (!controller.signal.aborted) setError(err.message || t('failed'))
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [mode])

  useEffect(() => {
    const term = query.trim().replace(/^@+/, '')
    if (term.length < 2) {
      setResults([])
      setSearching(false)
      return undefined
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSearching(true)
      setError('')
      try {
        const data = await readJson(`/api/chat/users/search?q=${encodeURIComponent(term)}&limit=20`, getToken(), controller.signal)
        const seen = new Set()
        const people = (data.users || []).map(asPerson).filter((person) => {
          if (!person || seen.has(`${person.type}:${person.id}`)) return false
          seen.add(`${person.type}:${person.id}`)
          return true
        })
        if (!controller.signal.aborted) setResults(people)
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message || t('failed'))
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 350)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const term = query.trim().replace(/^@+/, '').toLowerCase()
  const people = term.length >= 2 ? results : term ? suggestions.filter((person) => `${person.name} ${person.username}`.toLowerCase().includes(term)) : suggestions
  const finish = (choice) => {
    const next = normalizeSelection(choice)
    if (typeof onSaveTarget === 'function') {
      onSaveTarget({ username: next.username, type: next.type || null, id: next.id || null })
    } else {
      onSave?.(next.username)
    }
  }
  const isSelected = (person) => selected.id && selected.type
    ? selected.id === person.id && selected.type === person.type
    : selected.username.toLowerCase() === person.username.toLowerCase()

  return (
    <div className="fixed inset-0 z-[190] flex flex-col bg-white text-[var(--shadow-text-primary)] dark:bg-black" role="dialog" aria-modal="true" aria-label={t('title')}>
      <header className="mx-auto flex w-full max-w-[680px] items-center gap-3 px-4 pb-4 pt-[max(14px,env(safe-area-inset-top))]">
        <button type="button" onClick={onClose} aria-label={t('cancel')} className="flex h-10 w-7 shrink-0 items-center justify-start text-[var(--shadow-text-primary)]"><i className="fa-solid fa-chevron-left text-[19px]" /></button>
        <h2 className="flex-1 text-[17px] font-semibold">{t('title')}</h2>
        <button type="button" onClick={() => finish(selected)} className="rounded-xl bg-black px-5 py-2.5 text-[14px] font-bold text-white dark:bg-white dark:text-black">{t('done')}</button>
      </header>
      <div className="mx-auto w-full max-w-[680px] px-4">
        <label className="flex h-12 items-center gap-3 rounded-xl bg-[var(--shadow-bg-soft)] px-4">
          <i className="fa-solid fa-magnifying-glass text-[var(--shadow-text-secondary)]" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value.slice(0, 80))} placeholder={t('search')} maxLength={80} className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]" />
        </label>
      </div>
      <section className="mx-auto mt-5 w-full max-w-[680px] flex-1 overflow-y-auto px-4 pb-6">
        <div className="mb-3 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{term.length >= 2 ? t('results') : t('suggested')}</div>
        {(loading && !term) || searching ? <p className="py-5 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t('loading')}</p> : null}
        {people.map((person) => (
          <button key={`${person.type}:${person.id}`} type="button" onClick={() => setSelected(person)} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-[var(--shadow-bg-hover)]">
            <Avatar person={person} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold">{person.name}</span>
              <span className="block truncate text-[12px] text-[var(--shadow-text-secondary)]">@{person.username}{person.mutual ? ` · ${t('following')}` : ''}</span>
            </span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${isSelected(person) ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-[var(--shadow-border-strong)]'}`}>
              {isSelected(person) ? <i className="fa-solid fa-check text-[12px]" /> : null}
            </span>
          </button>
        ))}
        {!loading && !searching && !people.length && !error ? <p className="py-8 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t('empty')}</p> : null}
        {error ? <p role="alert" className="py-4 text-center text-[12px] text-red-600 dark:text-red-300">{error}</p> : null}
        {selected.username ? <button type="button" onClick={() => finish('')} className="mt-4 w-full rounded-xl bg-[var(--shadow-bg-soft)] px-4 py-3 text-[13px] font-semibold">{t('remove')}</button> : null}
      </section>
    </div>
  )
}
