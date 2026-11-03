import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ExternalLink, Pause, Play, RefreshCw, Volume2, VolumeX } from 'lucide-react'
import { PageShell, PageHeader, PageEmptyState, PageErrorState, PageLoadingState } from '../components/common/PagePrimitives'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('fastReels', {
  en: { title: 'Fast', loading: 'Loading videos...', empty: 'No videos yet', emptyBody: 'Published YouTube videos will appear here.', error: 'Unable to load videos.', retry: 'Try again', soundOn: 'Turn sound on', soundOff: 'Mute sound', youtube: 'Watch on YouTube', next: 'Swipe up for next video', back: 'Go back', loadMore: 'Load more', source: 'YouTube', creatorProfile: 'Open author profile', play: 'Play video', pause: 'Pause video', previous: 'Previous video', following: 'Next video' },
  km: { title: 'Fast', loading: 'កំពុងផ្ទុកវីដេអូ...', empty: 'មិនទាន់មានវីដេអូ', emptyBody: 'វីដេអូ YouTube ដែលបានផ្សាយនឹងបង្ហាញនៅទីនេះ។', error: 'មិនអាចទាញវីដេអូបានទេ។', retry: 'ព្យាយាមម្ដងទៀត', soundOn: 'បើកសំឡេង', soundOff: 'បិទសំឡេង', youtube: 'មើលលើ YouTube', next: 'អូសឡើងដើម្បីមើលវីដេអូបន្ទាប់', back: 'ត្រឡប់ក្រោយ', loadMore: 'មើលបន្ថែម', source: 'YouTube', creatorProfile: 'បើក Profile អ្នកនិពន្ធ', play: 'ចាក់វីដេអូ', pause: 'ផ្អាកវីដេអូ', previous: 'វីដេអូមុន', following: 'វីដេអូបន្ទាប់' },
  zh: { title: 'Fast', loading: '正在加载视频...', empty: '暂无视频', emptyBody: '发布的 YouTube 视频将在这里显示。', error: '无法加载视频。', retry: '重试', soundOn: '打开声音', soundOff: '静音', youtube: '在 YouTube 观看', next: '向上滑动看下一个视频', back: '返回', loadMore: '加载更多', source: 'YouTube', creatorProfile: '查看作者主页', play: '播放', pause: '暂停', previous: '上一个视频', following: '下一个视频' },
  ja: { title: 'Fast', loading: '動画を読み込み中...', empty: '動画はまだありません', emptyBody: '公開された YouTube 動画がここに表示されます。', error: '動画を読み込めません。', retry: '再試行', soundOn: '音声をオン', soundOff: 'ミュート', youtube: 'YouTubeで見る', next: '上にスワイプして次の動画へ', back: '戻る', loadMore: 'もっと見る', source: 'YouTube', creatorProfile: '作者のプロフィールを開く', play: '再生', pause: '一時停止', previous: '前の動画', following: '次の動画' },
  ko: { title: 'Fast', loading: '동영상을 불러오는 중...', empty: '아직 동영상이 없습니다', emptyBody: '공개된 YouTube 동영상이 여기에 표시됩니다.', error: '동영상을 불러올 수 없습니다.', retry: '다시 시도', soundOn: '소리 켜기', soundOff: '음소거', youtube: 'YouTube에서 보기', next: '위로 밀어 다음 동영상 보기', back: '돌아가기', loadMore: '더 보기', source: 'YouTube', creatorProfile: '작가 프로필 열기', play: '재생', pause: '일시정지', previous: '이전 영상', following: '다음 영상' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')

const PAGE_SIZE = 8
const FEED_CACHE_MS = 60 * 1000
let cachedFeed = null

function youtubeId(value) {
  try {
    const url = new URL(String(value || '').trim())
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return ''
    const host = url.hostname.toLowerCase()
    const parts = url.pathname.split('/').filter(Boolean)
    let id = ''
    if (host === 'youtu.be' || host === 'www.youtu.be') id = parts[0] || ''
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (parts[0] === 'watch') id = url.searchParams.get('v') || ''
      else if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || ''
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : ''
  } catch {
    return ''
  }
}

function VideoSlide({ video, active, soundEnabled, onSoundToggle, onAuthorOpen, onNavigate, canPrevious, canNext, t }) {
  const id = useMemo(() => youtubeId(video.video_url), [video.video_url])
  const frameRef = useRef(null)
  const gestureRef = useRef(null)
  const lastSwipeAtRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const iframeUrl = id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&controls=0&enablejsapi=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`
    : ''

  const sendCommand = useCallback(name => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: name, args: [] }),
      'https://www.youtube-nocookie.com'
    )
  }, [])

  useEffect(() => {
    if (!active || !id) {
      gestureRef.current = null
      setPlaying(false)
      return undefined
    }
    const handlePlayerMessage = event => {
      if (event.source !== frameRef.current?.contentWindow) return
      if (!['https://www.youtube-nocookie.com', 'https://www.youtube.com'].includes(event.origin)) return
      let data = event.data
      try { if (typeof data === 'string') data = JSON.parse(data) } catch { return }
      if (!data || typeof data !== 'object') return
      if (data.event === 'onReady') {
        sendCommand(soundEnabled ? 'unMute' : 'mute')
        sendCommand('playVideo')
      }
      const state = data.event === 'onStateChange' ? data.info : data.event === 'infoDelivery' ? data.info?.playerState : null
      if (state === 1) setPlaying(true)
      if (state === 0 || state === 2 || state === 5) setPlaying(false)
    }
    window.addEventListener('message', handlePlayerMessage)
    return () => window.removeEventListener('message', handlePlayerMessage)
  }, [active, id, sendCommand, soundEnabled])

  const handlePlayerLoad = () => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id }), 'https://www.youtube-nocookie.com'
    )
    // The onReady event will retry these commands if the player is not ready yet.
    sendCommand(soundEnabled ? 'unMute' : 'mute')
    sendCommand('playVideo')
  }

  const togglePlayback = () => {
    if (!active || !id) return
    sendCommand(playing ? 'pauseVideo' : 'playVideo')
    setPlaying(current => !current)
  }

  const handleSound = () => {
    const next = !soundEnabled
    onSoundToggle(next)
    sendCommand(next ? 'unMute' : 'mute')
  }

  const handlePointerDown = event => {
    if (event.button !== undefined && event.button !== 0) return
    gestureRef.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId }
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* Already captured */ }
  }

  const handlePointerUp = event => {
    const start = gestureRef.current
    gestureRef.current = null
    if (!start || start.pointerId !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dy) >= 48 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      lastSwipeAtRef.current = Date.now()
      onNavigate(dy < 0 ? 1 : -1)
    }
  }

  const creator = video.creator
  return (
    <article data-fast-slide className="relative h-full w-full shrink-0 snap-start overflow-hidden bg-black text-white" aria-label={video.title}>
      {active && id ? (
        <iframe
          ref={frameRef}
          title={video.title || 'YouTube'}
          src={iframeUrl}
          onLoad={handlePlayerLoad}
          className="pointer-events-none absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {(video.thumbnail_url || id) ? (
            <img
              src={video.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain opacity-80"
            />
          ) : null}
          <Play aria-hidden="true" size={38} className="relative text-white/90" />
        </div>
      )}

      {active && id ? (
        <>
          <button
            type="button"
            aria-label={t(playing ? 'fastReels.pause' : 'fastReels.play')}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer touch-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { gestureRef.current = null }}
            onClick={() => {
              if (Date.now() - lastSwipeAtRef.current < 400) return
              togglePlayback()
            }}
          />
          {!playing ? (
            <div className="pointer-events-none absolute inset-0 z-[11] flex items-center justify-center">
              <span className="rounded-full bg-black/50 p-4 text-white"><Play size={28} fill="currentColor" /></span>
            </div>
          ) : null}
          <div className="absolute right-3 top-[28%] z-30 flex flex-col gap-3">
            {canPrevious ? (
              <button type="button" onClick={() => onNavigate(-1)} aria-label={t('fastReels.previous')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
                <ArrowUp size={20} />
              </button>
            ) : null}
            {canNext ? (
              <button type="button" onClick={() => onNavigate(1)} aria-label={t('fastReels.following')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
                <ArrowDown size={20} />
              </button>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-48 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="pointer-events-none absolute bottom-6 left-4 right-16 z-20">
        {creator?.page_username ? (
          <button
            type="button"
            onClick={() => onAuthorOpen(creator.page_username)}
            aria-label={`${t('fastReels.creatorProfile')}: ${creator.page_name || creator.page_username}`}
            className="pointer-events-auto mb-3 flex max-w-full items-center gap-2 rounded-full bg-black/45 py-1.5 pl-1.5 pr-3 text-left backdrop-blur-sm active:opacity-80"
          >
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt="" loading="lazy" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">{String(creator.page_name || 'A').trim().charAt(0).toUpperCase() || 'A'}</span>
            )}
            <span className="max-w-[180px] truncate text-xs font-semibold text-white">{creator.page_name || creator.page_username}</span>
          </button>
        ) : null}
        <h2 className="line-clamp-2 text-base font-bold drop-shadow">{video.title}</h2>
        {video.description ? <p className="mt-1 line-clamp-2 text-xs text-white/85">{video.description}</p> : null}
        <span className="mt-2 inline-block rounded-full bg-white/20 px-2 py-1 text-[10px]">{t('fastReels.source')}</span>
      </div>

      {active ? (
        <div className="absolute bottom-7 right-3 z-30 flex flex-col gap-3">
          <button type="button" onClick={handleSound} aria-label={t(soundEnabled ? 'fastReels.soundOff' : 'fastReels.soundOn')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <a href={video.video_url} target="_blank" rel="noopener noreferrer" aria-label={t('fastReels.youtube')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
            <ExternalLink size={19} />
          </a>
        </div>
      ) : null}
    </article>
  )
}

export default function FastReelsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const initialCacheRef = useRef(cachedFeed && Date.now() - cachedFeed.savedAt < FEED_CACHE_MS ? cachedFeed : null)
  const initialCache = initialCacheRef.current
  const viewportRef = useRef(null)
  const loadingRef = useRef(false)
  const nextOffset = useRef(initialCache?.offset || 0)
  const hasMoreRef = useRef(initialCache?.hasMore ?? true)
  const activeIndexRef = useRef(initialCache?.index || 0)
  const navigationLockUntilRef = useRef(0)
  const [videos, setVideos] = useState(initialCache?.videos || [])
  const [activeIndex, setActiveIndex] = useState(initialCache?.index || 0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [loading, setLoading] = useState(!initialCache?.videos?.length)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(initialCache?.hasMore ?? true)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/fast/videos?limit=${PAGE_SIZE}&offset=${nextOffset.current}`)
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload.ok !== true || !Array.isArray(payload.videos)) {
        throw new Error(payload.message || 'Unable to load videos')
      }
      const rows = payload.videos.filter(row => youtubeId(row.video_url))
      const newOffset = Number(payload.pagination?.next_offset)
      nextOffset.current = Number.isSafeInteger(newOffset) && newOffset >= nextOffset.current
        ? newOffset : nextOffset.current + payload.videos.length
      hasMoreRef.current = Boolean(payload.pagination?.has_more) && payload.videos.length > 0
      setHasMore(hasMoreRef.current)
      setVideos(current => {
        const seen = new Set(current.map(row => row.id))
        return [...current, ...rows.filter(row => !seen.has(row.id))]
      })
    } catch (err) {
      setError(err.message || 'Unable to load videos')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialCacheRef.current?.videos?.length) loadMore()
  }, [loadMore])

  useEffect(() => {
    if (!videos.length) return undefined
    cachedFeed = { videos, offset: nextOffset.current, hasMore, index: activeIndex, savedAt: Date.now() }
    return undefined
  }, [videos, hasMore, activeIndex])

  const navigateSlide = useCallback(direction => {
    const root = viewportRef.current
    if (!root || !videos.length || Date.now() < navigationLockUntilRef.current) return
    const next = Math.max(0, Math.min(videos.length - 1, activeIndexRef.current + direction))
    if (next === activeIndexRef.current) return
    navigationLockUntilRef.current = Date.now() + 420
    activeIndexRef.current = next
    setActiveIndex(next)
    root.scrollTo({ top: next * root.clientHeight, behavior: 'smooth' })
  }, [videos.length])

  useEffect(() => {
    const root = viewportRef.current
    if (!root || !videos.length) return undefined
    if (initialCacheRef.current?.videos?.length) {
      root.scrollTo({ top: activeIndexRef.current * root.clientHeight, behavior: 'instant' })
      initialCacheRef.current = null
    }
    const slides = Array.from(root.querySelectorAll('[data-fast-slide]'))
    const observer = new IntersectionObserver(entries => {
      if (Date.now() < navigationLockUntilRef.current) return
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const index = slides.indexOf(entry.target)
          if (index >= 0) {
            activeIndexRef.current = index
            setActiveIndex(index)
          }
        }
      }
    }, { root, threshold: [0.6, 0.8] })
    slides.forEach(slide => observer.observe(slide))
    return () => observer.disconnect()
  }, [videos.length])

  useEffect(() => {
    const root = viewportRef.current
    if (!root || !videos.length) return undefined
    let lastWheelAt = 0
    const onWheel = event => {
      if (Math.abs(event.deltaY) < 18) return
      event.preventDefault()
      const now = Date.now()
      if (now - lastWheelAt < 360) return
      lastWheelAt = now
      navigateSlide(event.deltaY > 0 ? 1 : -1)
    }
    root.addEventListener('wheel', onWheel, { passive: false })
    return () => root.removeEventListener('wheel', onWheel)
  }, [videos.length, navigateSlide])

  useEffect(() => {
    const onKey = event => {
      const target = event.target
      if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) return
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        navigateSlide(1)
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        navigateSlide(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigateSlide])

  useEffect(() => {
    if (!loading && hasMore && videos.length > 0 && activeIndex >= videos.length - 3) loadMore()
  }, [activeIndex, hasMore, videos.length, loading, loadMore])

  const openAuthorProfile = useCallback(username => {
    if (username) navigate(`/author/page/${encodeURIComponent(username)}`)
  }, [navigate])

  return (
    <PageShell className="bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
      <PageHeader title={t('fastReels.title')} backLabel={t('fastReels.back')} onBack={() => navigate(-1)} />
      {videos.length ? (
        <div ref={viewportRef} className="mx-auto h-[calc(100dvh-56px)] w-full max-w-[520px] snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-black" style={{ scrollbarWidth: 'none' }}>
          {videos.map((video, index) => (
            <div key={video.id} className="h-full snap-start">
              <VideoSlide
                video={video}
                active={index === activeIndex}
                soundEnabled={soundEnabled}
                onSoundToggle={setSoundEnabled}
                onAuthorOpen={openAuthorProfile}
                onNavigate={navigateSlide}
                canPrevious={index > 0}
                canNext={index < videos.length - 1}
                t={t}
              />
            </div>
          ))}
        </div>
      ) : loading ? (
        <PageLoadingState label={t('fastReels.loading')} />
      ) : error ? (
        <PageErrorState title={t('fastReels.error')} actionLabel={t('fastReels.retry')} onAction={loadMore} />
      ) : (
        <PageEmptyState title={t('fastReels.empty')} body={t('fastReels.emptyBody')} />
      )}
      {error && videos.length ? (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-3 shadow-lg">
          <button type="button" onClick={loadMore} className="flex items-center gap-2 text-xs text-[var(--shadow-text-primary)]"><RefreshCw size={14}/>{t('fastReels.retry')}</button>
        </div>
      ) : null}
      {loading && videos.length ? (
        <div role="status" aria-label={t('fastReels.loading')} className="pointer-events-none fixed bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs text-white">{t('fastReels.loading')}</div>
      ) : null}
    </PageShell>
  )
}
