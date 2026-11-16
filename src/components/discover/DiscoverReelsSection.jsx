import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Clapperboard, Eye, MoreHorizontal, X, XSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('discoverReels', {
  en: { title: 'Reels', hide: 'Hide', hideHint: 'See fewer posts like this.', hidden: 'Post hidden', hiddenHint: "You won't see this post again.", undo: 'Undo', seeMore: 'See more', retry: 'Retry', close: 'Close', unavailable: 'Unable to load Reels' },
  km: { title: 'Reels', hide: 'Hide', hideHint: 'See fewer posts like this.', hidden: 'Post hidden', hiddenHint: "You won't see this post again.", undo: 'Undo', seeMore: 'See more', retry: 'សាកម្ដងទៀត', close: 'បិទ', unavailable: 'មិនអាចផ្ទុក Reels បានទេ' },
  zh: { title: 'Reels', hide: '隐藏', hideHint: '减少此类内容', hidden: '内容已隐藏', hiddenHint: '你不会再看到此内容', undo: '撤销', seeMore: '查看更多', retry: '重试', close: '关闭', unavailable: '无法加载 Reels' },
  ja: { title: 'Reels', hide: '非表示', hideHint: 'このような投稿の表示を減らす', hidden: '投稿を非表示にしました', hiddenHint: 'この投稿は表示されなくなります', undo: '元に戻す', seeMore: 'もっと見る', retry: '再試行', close: '閉じる', unavailable: 'Reelsを読み込めませんでした' },
  ko: { title: 'Reels', hide: '숨기기', hideHint: '이런 게시물을 적게 표시', hidden: '게시물 숨김', hiddenHint: '이 게시물은 다시 표시되지 않습니다', undo: '실행 취소', seeMore: '더 보기', retry: '다시 시도', close: '닫기', unavailable: 'Reels를 불러오지 못했습니다' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const HIDDEN_KEY = 'shadow_discover_reels_section_hidden_v1'
const RETURN_KEY = 'shadow_discover_reels_return_v1'
const CACHE_MS = 2 * 60 * 1000
let cachedVideos = null
let cachedAt = 0
let pendingRequest = null

function getYoutubeId(value) {
  try {
    const url = new URL(String(value || '').trim())
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    const host = url.hostname.toLowerCase()
    const path = url.pathname.split('/').filter(Boolean)
    let id = ''
    if (['youtu.be', 'www.youtu.be'].includes(host) && path.length === 1) id = path[0]
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (path[0] === 'watch') id = url.searchParams.get('v') || ''
      if (['shorts', 'embed', 'live'].includes(path[0])) id = path[1] || ''
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : ''
  } catch {
    return ''
  }
}

function getThumbnail(video) {
  const direct = String(video.thumbnail_url || '').trim()
  if (/^https:\/\/[^\s]+$/i.test(direct)) return direct
  const videoId = getYoutubeId(video.video_url)
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''
}

async function fetchReels(force = false) {
  if (!force && cachedVideos && Date.now() - cachedAt < CACHE_MS) return cachedVideos
  if (pendingRequest) return pendingRequest
  pendingRequest = (async () => {
    const response = await fetch(`${API_BASE_URL}/api/fast/videos?limit=18&offset=0`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.ok !== true || !Array.isArray(payload.videos)) {
      throw new Error(payload.message || 'Unable to load Reels')
    }
    const seen = new Set()
    const selected = []
    for (const video of payload.videos) {
      const id = String(video?.id || '')
      if (!id || seen.has(id) || !getYoutubeId(video.video_url)) continue
      seen.add(id)
      selected.push(video)
      if (selected.length === 6) break
    }
    cachedVideos = selected
    cachedAt = Date.now()
    return selected
  })()
  try {
    return await pendingRequest
  } finally {
    pendingRequest = null
  }
}

function isHidden() {
  try {
    return localStorage.getItem(HIDDEN_KEY) === '1'
  } catch {
    return false
  }
}

function formatViews(value) {
  const count = Number(value)
  if (!Number.isFinite(count) || count < 0) return ''
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count)
}

function ReelCard({ video, onOpen }) {
  const [failed, setFailed] = useState(false)
  const image = getThumbnail(video)
  const views = formatViews(video.view_count ?? video.views)
  return (
    <button
      type="button"
      onClick={() => onOpen(video.id)}
      className="relative aspect-[9/16] shrink-0 snap-start overflow-hidden rounded-[18px] bg-[#111] text-white active:scale-[0.99]"
      style={{ flexBasis: 'calc((100% - 20px) / 2.5)' }}
      aria-label={video.title || 'Open Reel'}
    >
      {image && !failed ? (
        <img src={image} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#35313e] to-[#111]">
          <Clapperboard size={38} />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent" />
      {views ? (
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold">
          <Eye size={12} /> {views}
        </span>
      ) : null}
      <span className="absolute bottom-3 left-2 right-2 line-clamp-2 text-left text-[11px] font-semibold leading-snug drop-shadow-md">
        {video.title || video.creator?.page_name || 'Reel'}
      </span>
    </button>
  )
}

export default function DiscoverReelsSection() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const carouselRef = useRef(null)
  const touchStartY = useRef(null)
  const [videos, setVideos] = useState(() => cachedVideos || [])
  const [loading, setLoading] = useState(!cachedVideos)
  const [error, setError] = useState('')
  const [hidden, setHidden] = useState(isHidden)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (hidden) return undefined
    let mounted = true
    fetchReels(retryCount > 0).then(rows => {
      if (mounted) {
        setVideos(rows)
        setError('')
      }
    }).catch(err => {
      if (mounted) setError(err?.message || 'Unable to load Reels')
    }).finally(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [hidden, retryCount])

  useEffect(() => {
    if (!sheetOpen) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEscape = event => {
      if (event.key === 'Escape') setSheetOpen(false)
    }
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [sheetOpen])

  useEffect(() => {
    if (hidden || loading || !carouselRef.current) return undefined
    let snapshot
    try {
      snapshot = JSON.parse(sessionStorage.getItem(RETURN_KEY) || 'null')
    } catch {
      snapshot = null
    }
    if (!snapshot || Date.now() - snapshot.time > 180000) return undefined
    const frame = window.requestAnimationFrame(() => {
      if (carouselRef.current) carouselRef.current.scrollLeft = Number(snapshot.left) || 0
      window.scrollTo({ top: Number(snapshot.y) || 0, behavior: 'instant' })
      try { sessionStorage.removeItem(RETURN_KEY) } catch {}
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hidden, loading])

  const hideSection = () => {
    setSheetOpen(false)
    setHidden(true)
    try { localStorage.setItem(HIDDEN_KEY, '1') } catch {}
  }

  const undoHide = () => {
    setHidden(false)
    try { localStorage.removeItem(HIDDEN_KEY) } catch {}
  }

  const openReel = id => {
    try {
      sessionStorage.setItem(RETURN_KEY, JSON.stringify({
        y: window.scrollY,
        left: carouselRef.current?.scrollLeft || 0,
        time: Date.now(),
      }))
    } catch {}
    navigate(id ? `/fast?reel=${encodeURIComponent(String(id))}` : '/fast', {
      state: { fromMainFooter: true, fromDiscoverReels: true },
    })
  }

  if (hidden) {
    return (
      <div className="flex items-center gap-3 border-y border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[var(--shadow-text-primary)]">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1877f2] text-white"><X size={18} strokeWidth={3} /></span>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold">{t('discoverReels.hidden')}</div>
          <div className="text-[12px] text-[var(--shadow-text-secondary)]">{t('discoverReels.hiddenHint')}</div>
        </div>
        <button type="button" onClick={undoHide} className="shrink-0 rounded-xl bg-[#e5e7eb] px-4 py-2 text-[13px] font-medium text-[#111827]">{t('discoverReels.undo')}</button>
      </div>
    )
  }

  if (!loading && !error && videos.length === 0) return null

  return (
    <section className="border-y border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] py-3 text-[var(--shadow-text-primary)]" aria-label={t('discoverReels.title')}>
      <div className="mb-3 flex items-center gap-2 px-4">
        <Clapperboard size={23} strokeWidth={2.1} aria-hidden="true" />
        <span className="flex-1 text-[17px] font-semibold">{t('discoverReels.title')}</span>
        <button type="button" onClick={() => setSheetOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-hover)]" aria-label="Reels options">
          <MoreHorizontal size={24} />
        </button>
        <button type="button" onClick={hideSection} className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-hover)]" aria-label="Hide Reels">
          <X size={24} />
        </button>
      </div>
      {error ? (
        <div className="flex items-center justify-between px-4 py-6 text-sm">
          <span>{t('discoverReels.unavailable')}</span>
          <button type="button" className="rounded-lg border border-[var(--shadow-border)] px-3 py-2" onClick={() => { setLoading(true); setRetryCount(count => count + 1) }}>{t('discoverReels.retry')}</button>
        </div>
      ) : loading ? (
        <div className="flex gap-2 overflow-hidden px-4" aria-hidden="true">
          {[0, 1, 2].map(i => <div key={i} style={{ flex: '0 0 calc((100% - 20px) / 2.5)' }} className="aspect-[9/16] animate-pulse rounded-[18px] bg-[var(--shadow-bg-hover)]" />)}
        </div>
      ) : (
        <div ref={carouselRef} className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
          {videos.map(video => <ReelCard key={video.id} video={video} onOpen={openReel} />)}
          <button type="button" onClick={() => openReel(null)} className="flex aspect-[9/16] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-[18px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]" style={{ flexBasis: 'calc((100% - 20px) / 2.5)' }}>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e5e7eb] text-black"><ArrowRight size={32} /></span>
            <span className="text-[13px] font-medium">{t('discoverReels.seeMore')}</span>
          </button>
        </div>
      )}
      {sheetOpen ? (
        <div className="fixed inset-0 z-[200001] flex items-end justify-center bg-black/45" role="presentation" onClick={() => setSheetOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Reels options" className="w-full max-w-[620px] rounded-t-[24px] bg-[var(--shadow-bg-surface)] px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2 text-[var(--shadow-text-primary)]" onClick={event => event.stopPropagation()} onTouchStart={event => { touchStartY.current = event.touches[0]?.clientY ?? null }} onTouchEnd={event => { if (touchStartY.current !== null && event.changedTouches[0].clientY - touchStartY.current > 65) setSheetOpen(false); touchStartY.current = null }}>
            <div className="mx-auto mb-6 h-[5px] w-11 rounded-full bg-[#a3a3a3]" />
            <button type="button" onClick={hideSection} className="flex w-full items-center gap-4 rounded-[16px] bg-[var(--shadow-bg-hover)] px-4 py-4 text-left">
              <XSquare size={27} className="shrink-0" />
              <span className="flex flex-col gap-1">
                <span className="text-[16px] font-medium">{t('discoverReels.hide')}</span>
                <span className="text-[13px] text-[var(--shadow-text-secondary)]">{t('discoverReels.hideHint')}</span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
