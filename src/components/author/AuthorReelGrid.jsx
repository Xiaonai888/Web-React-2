import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, Play, RefreshCw, Volume2, VolumeX, X } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorReelGrid', {
  en: { tab: 'Reel', empty: 'No Reels yet', loadError: 'Could not load Reels.', retry: 'Try again', more: 'Load more', back: 'Close Reel', previous: 'Previous Reel', next: 'Next Reel', unmute: 'Turn sound on', mute: 'Mute sound', youtube: 'Open on YouTube', noVideo: 'This Reel is unavailable.' },
  km: { tab: 'Reel', empty: 'មិនទាន់មាន Reel', loadError: 'មិនអាចផ្ទុក Reel បានទេ។', retry: 'ព្យាយាមម្ដងទៀត', more: 'មើលបន្ថែម', back: 'បិទ Reel', previous: 'Reel មុន', next: 'Reel បន្ទាប់', unmute: 'បើកសំឡេង', mute: 'បិទសំឡេង', youtube: 'មើលលើ YouTube', noVideo: 'មិនអាចចាក់ Reel នេះបានទេ។' },
  zh: { tab: 'Reel', empty: '暂无 Reel', loadError: '无法加载 Reel。', retry: '重试', more: '加载更多', back: '关闭 Reel', previous: '上一条 Reel', next: '下一条 Reel', unmute: '打开声音', mute: '静音', youtube: '在 YouTube 打开', noVideo: '无法播放此 Reel。' },
  ja: { tab: 'Reel', empty: 'Reelはまだありません', loadError: 'Reelを読み込めません。', retry: '再試行', more: 'もっと見る', back: 'Reelを閉じる', previous: '前のReel', next: '次のReel', unmute: '音声をオン', mute: 'ミュート', youtube: 'YouTubeで開く', noVideo: 'このReelを再生できません。' },
  ko: { tab: 'Reel', empty: '아직 Reel이 없습니다', loadError: 'Reel을 불러올 수 없습니다.', retry: '다시 시도', more: '더 보기', back: 'Reel 닫기', previous: '이전 Reel', next: '다음 Reel', unmute: '소리 켜기', mute: '음소거', youtube: 'YouTube에서 열기', noVideo: '이 Reel을 재생할 수 없습니다.' },
})

const PAGE_SIZE = 12
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function getYouTubeId(input) {
  try {
    const url = new URL(String(input || ''))
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    const host = url.hostname.toLowerCase()
    const parts = url.pathname.split('/').filter(Boolean)
    let id = ''
    if (host === 'youtu.be' || host === 'www.youtu.be') id = parts[0] || ''
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (parts[0] === 'watch') id = url.searchParams.get('v') || ''
      if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || ''
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
  } catch {
    return ''
  }
}

function ReelViewer({ videos, index, onIndexChange, onClose, hasMore, onLoadMore, loading, t }) {
  const [soundEnabled, setSoundEnabled] = useState(false)
  const frameRef = useRef(null)
  const touchStart = useRef(null)
  const lastWheel = useRef(0)
  const video = videos[index]
  const youtubeId = getYouTubeId(video?.video_url)

  const change = useCallback((step) => {
    onIndexChange(current => Math.max(0, Math.min(videos.length - 1, current + step)))
  }, [onIndexChange, videos.length])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const keyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowDown') { event.preventDefault(); change(1) }
      if (event.key === 'ArrowUp') { event.preventDefault(); change(-1) }
    }
    window.addEventListener('keydown', keyDown)
    return () => {
      window.removeEventListener('keydown', keyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [change, onClose])

  const command = (name) => frameRef.current?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: name, args: [] }),
    'https://www.youtube-nocookie.com'
  )

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    command(next ? 'unMute' : 'mute')
    if (next) command('playVideo')
  }

  const onWheel = (event) => {
    if (Math.abs(event.deltaY) < 14 || Date.now() - lastWheel.current < 650) return
    lastWheel.current = Date.now()
    change(event.deltaY > 0 ? 1 : -1)
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={t('authorReelGrid.tab')} className="fixed inset-0 z-[100500] flex flex-col bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--shadow-border)] px-4">
        <span className="text-[17px] font-semibold">{t('authorReelGrid.tab')}</span>
        <button type="button" onClick={onClose} aria-label={t('authorReelGrid.back')} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"><X size={22} /></button>
      </div>
      <div className="relative mx-auto flex min-h-0 w-full max-w-[540px] flex-1 items-center justify-center bg-black text-white" onWheel={onWheel}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientY ?? null }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const delta = touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current)
          touchStart.current = null
          if (Math.abs(delta) > 45) change(delta > 0 ? 1 : -1)
        }}>
        {youtubeId ? (
          <iframe key={video.id} ref={frameRef} title={video.title || t('authorReelGrid.tab')}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1&controls=1&enablejsapi=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`}
            onLoad={() => { if (soundEnabled) command('unMute') }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
            className="absolute inset-0 h-full w-full" />
        ) : <span className="px-6 text-center text-sm">{t('authorReelGrid.noVideo')}</span>}
        <div className="absolute bottom-14 left-0 top-14 z-10 w-12 touch-none" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="pointer-events-none absolute bottom-6 left-4 right-16 z-10 line-clamp-2 text-sm font-semibold drop-shadow">{video.title}</div>
        <div className="absolute bottom-5 right-3 z-20 flex flex-col gap-3">
          <button type="button" onClick={toggleSound} aria-label={t(soundEnabled ? 'authorReelGrid.mute' : 'authorReelGrid.unmute')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
          <a href={video.video_url} target="_blank" rel="noopener noreferrer" aria-label={t('authorReelGrid.youtube')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"><ExternalLink size={19} /></a>
        </div>
        {index > 0 ? <button type="button" onClick={() => change(-1)} aria-label={t('authorReelGrid.previous')} className="absolute left-3 top-4 z-20 rounded-full bg-black/60 p-3 text-white"><ArrowUp size={20} /></button> : null}
        {index < videos.length - 1 ? <button type="button" onClick={() => change(1)} aria-label={t('authorReelGrid.next')} className="absolute right-3 top-4 z-20 rounded-full bg-black/60 p-3 text-white"><ArrowDown size={20} /></button> : null}
        {index === videos.length - 1 && hasMore ? <button type="button" disabled={loading} onClick={onLoadMore} className="absolute top-4 right-3 z-20 rounded-full bg-black/60 px-4 py-2 text-xs text-white">{t('authorReelGrid.more')}</button> : null}
      </div>
    </div>
  )
}

export default function AuthorReelGrid({ userId }) {
  const { t } = useDisplayTranslation()
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const validUser = UUID.test(String(userId || ''))

  useEffect(() => {
    if (!validUser) return undefined
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/fast/videos?user_id=${encodeURIComponent(userId)}&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`, { signal: controller.signal })
      .then(async response => {
        const result = await response.json().catch(() => ({}))
        if (!response.ok || result.ok !== true || !Array.isArray(result.videos)) throw new Error(result.message || 'Unable to load Reels')
        return result
      })
      .then(result => {
        const rows = result.videos.filter(item => String(item.user_id) === String(userId) && getYouTubeId(item.video_url))
        setVideos(previous => {
          if (page === 0) return rows
          const known = new Set(previous.map(item => item.id))
          return [...previous, ...rows.filter(item => !known.has(item.id))]
        })
        setHasMore(Boolean(result.pagination?.has_more))
      })
      .catch(err => { if (!controller.signal.aborted) setError(err.message || 'Unable to load Reels') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [userId, validUser, page, retryCount])

  const closeViewer = useCallback(() => setSelectedIndex(null), [])
  const loadMore = () => { if (!loading && hasMore) setPage(value => value + 1) }

  if (!validUser) return <p className="py-14 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorReelGrid.empty')}</p>

  return (
    <section className="mx-auto max-w-[980px]">
      <div className="mb-3 text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorReelGrid.tab')}</div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
          {videos.map((video, index) => {
            const id = getYouTubeId(video.video_url)
            return (
              <button key={video.id} type="button" onClick={() => setSelectedIndex(index)} aria-label={video.title}
                className="group relative aspect-[9/16] overflow-hidden rounded-md bg-[#171717] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--shadow-accent)]">
                <img src={video.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy"
                  onError={event => { const fallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback }}
                  className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <Play className="absolute right-2 top-2 drop-shadow" size={17} fill="currentColor" aria-hidden="true" />
                <div className="absolute bottom-2 left-2 right-2 line-clamp-2 text-left text-[11px] font-medium drop-shadow sm:text-xs">{video.title}</div>
              </button>
            )
          })}
        </div>
      ) : !loading && !error ? (
        <p className="py-14 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorReelGrid.empty')}</p>
      ) : null}
      {loading && videos.length === 0 ? <div className="grid grid-cols-3 gap-2">{Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[9/16] animate-pulse rounded-md bg-[var(--shadow-bg-soft)]" />)}</div> : null}
      {error ? <div className="mt-4 text-center"><p role="alert" className="text-xs text-red-500">{t('authorReelGrid.loadError')}</p><button type="button" onClick={() => setRetryCount(v => v + 1)} className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-4 py-2 text-xs"><RefreshCw size={14}/>{t('authorReelGrid.retry')}</button></div> : null}
      {hasMore && videos.length > 0 && !error ? <div className="py-5 text-center"><button type="button" disabled={loading} onClick={loadMore} className="rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-2.5 text-xs text-[var(--shadow-text-primary)] disabled:opacity-60">{t('authorReelGrid.more')}</button></div> : null}
      {selectedIndex !== null && videos[selectedIndex] ? (
        <ReelViewer videos={videos} index={selectedIndex} onIndexChange={setSelectedIndex} onClose={closeViewer} hasMore={hasMore} onLoadMore={loadMore} loading={loading} t={t} />
      ) : null}
    </section>
  )
}
