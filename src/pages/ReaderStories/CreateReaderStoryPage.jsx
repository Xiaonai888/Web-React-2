import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import StoryComposer from '../../components/stories/StoryComposer'
import { clearHomeCacheSection } from '../../utils/homeDataCache'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function RepostStoryComposer({ source }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [showDiscard, setShowDiscard] = useState(false)
  const expiresAt = source?.expires_at ? new Date(source.expires_at).getTime() : 0
  const isExpired = Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt <= Date.now()
  const creatorName = String(source.creator_name || 'Shadow creator')
  const sourceText = String(source.text_overlay || '')

  useEffect(() => {
    if (!error) return undefined
    const timer = window.setTimeout(() => setError(''), 5000)
    return () => window.clearTimeout(timer)
  }, [error])

  async function shareRepost() {
    if (busy) return
    const token = getAuthToken()
    if (!token) {
      navigate('/login')
      return
    }
    if (isExpired) {
      setError('This story has expired.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/reader-stories/me/repost`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: source.source_type, story_id: source.id, text_overlay: text.trim() }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false || !data.story?.id) {
        throw new Error(data.message || 'Could not repost story')
      }
      await clearHomeCacheSection('discover-story-feed')
      navigate('/discover', { replace: true, state: { storyShared: true, storyMode: 'reader' } })
    } catch (shareError) {
      setError(shareError.message || 'Could not repost story')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        {source.media_type === 'video' ? (
          <video src={source.media_url} autoPlay loop muted playsInline controls className="h-full w-full object-contain" />
        ) : (
          <img src={source.media_url} alt="Story to repost" className="h-full w-full object-contain" />
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[680px] items-center justify-between gap-3 px-4 pt-[max(12px,env(safe-area-inset-top))]">
          <button type="button" onClick={() => setShowDiscard(true)} disabled={busy} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/50" aria-label={t('storyComposer.back')}>
            <i className="fa-solid fa-chevron-left" />
          </button>
          <div className="min-w-0 flex-1 rounded-full bg-black/50 px-4 py-2 text-center text-[13px]">
            <div className="font-semibold">Repost Story</div>
            <div className="truncate text-[11px] text-white/75">From {creatorName}</div>
          </div>
          <span className="h-11 w-11 shrink-0" />
        </div>
      </header>
      {(text || sourceText) ? (
        <button type="button" onClick={() => setEditing(true)} disabled={busy} className="absolute inset-x-6 top-[40%] z-20 text-center">
          <span className="inline-block max-w-full break-words rounded-[12px] bg-black/40 px-4 py-2 text-[25px] font-bold leading-tight text-white shadow-lg backdrop-blur-sm">{text || sourceText}</span>
        </button>
      ) : null}
      <div className="absolute inset-x-0 bottom-[82px] z-30 flex justify-center">
        <button type="button" onClick={() => setEditing(true)} disabled={busy} className="flex flex-col items-center gap-1 text-[11px] font-semibold">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60"><i className="fa-solid fa-font text-[19px]" /></span>
          {t('storyComposer.text')}
        </button>
      </div>
      <footer className="absolute inset-x-0 bottom-0 z-30 bg-black">
        <div className="mx-auto flex h-[82px] max-w-[680px] items-center justify-between gap-3 px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
          <span className="rounded-full bg-[#252527] px-4 py-2.5 text-[13px] font-semibold"><i className="fa-solid fa-earth-americas mr-2" />{t('storyComposer.public')}</span>
          <button type="button" onClick={shareRepost} disabled={busy || isExpired} className="min-w-[126px] rounded-[12px] bg-[#1877f2] px-6 py-3 text-[15px] font-bold text-white disabled:opacity-50">
            {busy ? t('storyComposer.sharing', { count: 0 }) : t('storyComposer.share')}
          </button>
        </div>
      </footer>
      {editing ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60">
          <section className="w-full max-w-[680px] rounded-t-[20px] bg-[#222227] p-4 pb-[max(20px,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between gap-4">
              <strong className="text-[16px]">{t('storyComposer.text')}</strong>
              <button type="button" onClick={() => setEditing(false)} className="rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-black">{t('storyComposer.save')}</button>
            </div>
            <textarea autoFocus value={text} onChange={(event) => setText(event.target.value)} maxLength={200} rows={4} className="mt-4 w-full rounded-[12px] bg-[#393940] p-3 text-[15px] text-white outline-none" />
            <div className="mt-1 text-right text-[11px] text-white/60">{text.length}/200</div>
          </section>
        </div>
      ) : null}
      {showDiscard ? (
        <div className="fixed inset-0 z-[210] flex items-end justify-center bg-black/60">
          <section className="w-full max-w-[680px] rounded-t-[20px] bg-[#222227] p-4 pb-[max(20px,env(safe-area-inset-bottom))]">
            <p className="text-[15px] font-semibold">Discard repost?</p>
            <button type="button" onClick={() => setShowDiscard(false)} className="mt-4 w-full rounded-[12px] bg-white/15 px-4 py-3 text-left">{t('storyComposer.keepEditing')}</button>
            <button type="button" onClick={() => navigate('/discover', { replace: true })} className="mt-2 w-full rounded-[12px] bg-white/15 px-4 py-3 text-left">{t('storyComposer.discardStory')}</button>
          </section>
        </div>
      ) : null}
      {error ? <div role="alert" className="fixed inset-x-4 bottom-[170px] z-[220] mx-auto max-w-[520px] rounded-[12px] bg-white px-4 py-3 text-center text-[13px] font-medium text-black">{error}</div> : null}
    </div>
  )
}

export default function CreateReaderStoryPage() {
  const { state } = useLocation()
  const source = state?.repostStory
  const isRepost = source && ['author', 'reader'].includes(source.source_type) && typeof source.id === 'string' && source.id && ['image', 'video'].includes(source.media_type) && typeof source.media_url === 'string' && /^https:\/\//i.test(source.media_url)
  return isRepost ? <RepostStoryComposer source={source} /> : <StoryComposer mode="reader" />
}
