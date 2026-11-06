import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bookmark, Check, Heart, MessageCircle, Play, Plus,
  RefreshCw, Search, Share2, Volume2, VolumeX,
} from 'lucide-react'
import { PageEmptyState, PageErrorState, PageLoadingState } from '../components/common/PagePrimitives'
import ReaderProfileFooter from '../components/reader-profile/ReaderProfileFooter'
import FastReelSettingsSheet from '../components/fast/FastReelSettingsSheet'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

// REPLACE: src/pages/FastReelsPage.jsx
// No database changes. Existing /api/fast/videos and /api/authors/following APIs are reused.
registerTranslationNamespace('fastReels', {
  en: {
    following: 'Following', forYou: 'For You', search: 'Search', loading: 'Loading videos...', empty: 'No videos yet',
    emptyBody: 'Published YouTube Reels will appear here.', error: 'Unable to load videos', retry: 'Try again',
    soundOn: 'Enable sound', soundOff: 'Mute', autoplaySound: 'Auto sound', mutedAutoplay: 'Muted autoplay',
    speed: 'Playback speed', settings: 'Video settings', close: 'Close settings',
    creatorProfile: 'Author profile', follow: 'Follow author', liked: 'Like', save: 'Save', saved: 'Saved',
    share: 'Share', comments: 'Comments on YouTube', copied: 'Link copied', shareFailed: 'Unable to share link',
    login: 'Sign in to use Following.', followEmpty: 'No Reels from followed authors yet.',
    followHelp: 'Follow authors to see their Reels here.', followingError: 'Could not load followed authors.',
    play: 'Play video', pause: 'Pause video', source: 'YouTube', loadMore: 'Load more',
  },
  km: {
    following: 'Following', forYou: 'For You', search: 'ស្វែងរក', loading: 'កំពុងផ្ទុកវីដេអូ...', empty: 'មិនទាន់មានវីដេអូ',
    emptyBody: 'Reel YouTube ដែលបានផ្សាយនឹងបង្ហាញនៅទីនេះ។', error: 'មិនអាចទាញវីដេអូបាន', retry: 'សាកម្ដងទៀត',
    soundOn: 'បើកសំឡេង', soundOff: 'បិទសំឡេង', autoplaySound: 'បើកសំឡេងស្វ័យប្រវត្តិ', mutedAutoplay: 'ចាប់ផ្ដើមដោយគ្មានសំឡេង',
    speed: 'ល្បឿនចាក់', settings: 'ការកំណត់វីដេអូ', close: 'បិទការកំណត់',
    creatorProfile: 'ទំព័រអ្នកនិពន្ធ', follow: 'Follow អ្នកនិពន្ធ', liked: 'ចូលចិត្ត', save: 'រក្សាទុក', saved: 'បានរក្សាទុក',
    share: 'ចែករំលែក', comments: 'មតិនៅ YouTube', copied: 'បានចម្លង Link', shareFailed: 'មិនអាចចែករំលែកបាន',
    login: 'សូម Login ដើម្បីមើល Following។', followEmpty: 'មិនទាន់មាន Reel ពីអ្នកនិពន្ធដែលបាន Follow។',
    followHelp: 'Follow អ្នកនិពន្ធ ដើម្បីឃើញ Reel របស់ពួកគេ។', followingError: 'មិនអាចទាញបញ្ជី Following បាន។',
    play: 'ចាក់វីដេអូ', pause: 'ផ្អាកវីដេអូ', source: 'YouTube', loadMore: 'បង្ហាញបន្ថែម',
  },
  zh: { following: '关注', forYou: '为你推荐', search: '搜索', loading: '正在加载视频...', empty: '暂无视频', emptyBody: '已发布的 Reel 显示在这里。', error: '无法加载视频', retry: '重试', soundOn: '打开声音', soundOff: '静音', autoplaySound: '自动播放声音', mutedAutoplay: '静音自动播放', speed: '播放速度', settings: '视频设置', close: '关闭设置', creatorProfile: '作者主页', follow: '关注作者', liked: '喜欢', save: '收藏', saved: '已收藏', share: '分享', comments: 'YouTube 评论', copied: '已复制链接', shareFailed: '无法分享链接', login: '请登录以查看关注内容。', followEmpty: '暂无关注作者的 Reel。', followHelp: '关注作者以观看他们的 Reel。', followingError: '无法加载关注列表。', play: '播放', pause: '暂停', source: 'YouTube', loadMore: '加载更多' },
  ja: { following: 'フォロー中', forYou: 'おすすめ', search: '検索', loading: '動画を読み込み中...', empty: '動画がありません', emptyBody: '公開された Reel がここに表示されます。', error: '動画を読み込めません', retry: '再試行', soundOn: '音声をオン', soundOff: 'ミュート', autoplaySound: '自動再生音声', mutedAutoplay: 'ミュートで自動再生', speed: '再生速度', settings: '動画の設定', close: '閉じる', creatorProfile: '作者のページ', follow: '作者をフォロー', liked: 'いいね', save: '保存', saved: '保存済み', share: '共有', comments: 'YouTube コメント', copied: 'リンクをコピーしました', shareFailed: '共有できません', login: 'フォローを見るにはログインしてください。', followEmpty: 'フォロー中の作者の Reel はまだありません。', followHelp: '作者をフォローすると Reel が表示されます。', followingError: 'フォロー一覧を読み込めません。', play: '再生', pause: '一時停止', source: 'YouTube', loadMore: 'もっと見る' },
  ko: { following: '팔로잉', forYou: '추천', search: '검색', loading: '동영상 불러오는 중...', empty: '동영상 없음', emptyBody: '게시된 Reel이 여기에 표시됩니다.', error: '동영상 로드 실패', retry: '다시 시도', soundOn: '소리 켜기', soundOff: '음소거', autoplaySound: '자동 재생 소리', mutedAutoplay: '음소거 자동 재생', speed: '재생 속도', settings: '동영상 설정', close: '닫기', creatorProfile: '작가 프로필', follow: '작가 팔로우', liked: '좋아요', save: '저장', saved: '저장됨', share: '공유', comments: 'YouTube 댓글', copied: '링크 복사됨', shareFailed: '공유 실패', login: '팔로잉을 보려면 로그인하세요.', followEmpty: '팔로우한 작가의 Reel이 없습니다.', followHelp: '작가를 팔로우하면 Reel을 볼 수 있습니다.', followingError: '팔로잉 목록을 불러올 수 없습니다.', play: '재생', pause: '일시정지', source: 'YouTube', loadMore: '더 보기' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const PAGE_SIZE = 8
const FEED_CACHE_MS = 60 * 1000
const LONG_PRESS_MS = 520
const SAVED_KEY = 'shadow_fast_saved_reels_v1'
const LIKED_KEY = 'shadow_fast_liked_reels_v1'
const HIDDEN_KEY = 'shadow_fast_hidden_reels_v1'
const AUTO_SCROLL_KEY = 'shadow_fast_auto_scroll_v1'
let cachedFeed = null

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}
function getStoredIds(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data.filter(x => typeof x === 'string').slice(0, 3000) : []
  } catch { return [] }
}
function youtubeId(value) {
  try {
    const url = new URL(String(value || '').trim())
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return ''
    const host = url.hostname.toLowerCase()
    const parts = url.pathname.split('/').filter(Boolean)
    let id = ''
    if (['youtu.be', 'www.youtu.be'].includes(host) && parts.length === 1) id = parts[0]
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (parts.length === 1 && parts[0] === 'watch') id = url.searchParams.get('v') || ''
      else if (parts.length === 2 && ['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1]
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : ''
  } catch { return '' }
}

function VideoSlide({ video, active, soundEnabled, onSoundToggle, playbackSpeed,
  onOpenSettings, onAuthorOpen, onFollow, isFollowing, onNavigate, onSave, isSaved, onLike,
  isLiked, onShare, onComment, clearDisplay, onRestoreDisplay, onEnded, t }) {
  const id = useMemo(() => youtubeId(video.video_url), [video.video_url])
  const frameRef = useRef(null)
  const gestureRef = useRef(null)
  const longPressTimerRef = useRef(null)
  const longPressedRef = useRef(false)
  const endedRef = useRef(false)
  const lastSwipeAtRef = useRef(0)

  useEffect(() => {
    endedRef.current = false
  }, [id, active])
  const [playing, setPlaying] = useState(false)
  const iframeUrl = id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&controls=0&enablejsapi=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`
    : ''

  const sendCommand = useCallback((name, args = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: name, args }),
      'https://www.youtube-nocookie.com'
    )
  }, [])

  useEffect(() => {
    if (!active || !id) { setPlaying(false); return undefined }
    const onMessage = event => {
      if (event.source !== frameRef.current?.contentWindow) return
      if (!['https://www.youtube-nocookie.com', 'https://www.youtube.com'].includes(event.origin)) return
      let data = event.data
      try { if (typeof data === 'string') data = JSON.parse(data) } catch { return }
      if (!data || typeof data !== 'object') return
      if (data.event === 'onReady') {
        sendCommand(soundEnabled ? 'unMute' : 'mute')
        sendCommand('playVideo')
        if (playbackSpeed !== 1) sendCommand('setPlaybackRate', [playbackSpeed])
      }
      const state = data.event === 'onStateChange' ? data.info : data.event === 'infoDelivery' ? data.info?.playerState : null
      if (state === 1) {
        setPlaying(true)
        endedRef.current = false
      }
      if ([0, 2, 5].includes(state)) setPlaying(false)
      if (state === 0 && !endedRef.current) {
        endedRef.current = true
        onEnded?.()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [active, id, soundEnabled, playbackSpeed, sendCommand, onEnded])

  useEffect(() => {
    if (!active) return undefined
    sendCommand(soundEnabled ? 'unMute' : 'mute')
    return undefined
  }, [active, soundEnabled, sendCommand])

  useEffect(() => {
    if (!active) return undefined
    sendCommand('setPlaybackRate', [playbackSpeed])
    return undefined
  }, [active, playbackSpeed, sendCommand])

  useEffect(() => () => window.clearTimeout(longPressTimerRef.current), [])

  const handlePlayerLoad = () => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id }), 'https://www.youtube-nocookie.com'
    )
    sendCommand(soundEnabled ? 'unMute' : 'mute')
    sendCommand('playVideo')
    if (playbackSpeed !== 1) sendCommand('setPlaybackRate', [playbackSpeed])
  }
  const togglePlayback = () => {
    if (!active || !id) return
    sendCommand(playing ? 'pauseVideo' : 'playVideo')
    setPlaying(current => !current)
  }

  const clearLongPress = () => window.clearTimeout(longPressTimerRef.current)
  const handleDown = event => {
    if (event.button !== undefined && event.button !== 0) return
    clearLongPress()
    longPressedRef.current = false
    gestureRef.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId }
    if (!clearDisplay) {
      longPressTimerRef.current = window.setTimeout(() => {
        longPressedRef.current = true
        gestureRef.current = null
        onOpenSettings()
      }, LONG_PRESS_MS)
    }
    try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* safe fallback */ }
  }
  const handleMove = event => {
    const start = gestureRef.current
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) clearLongPress()
  }
  const handleUp = event => {
    clearLongPress()
    const start = gestureRef.current
    gestureRef.current = null
    if (longPressedRef.current || !start || start.pointerId !== event.pointerId) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dy) >= 48 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      lastSwipeAtRef.current = Date.now()
      onNavigate(dy < 0 ? 1 : -1)
    }
  }
  const handleSoundDown = event => {
    if (event.button !== undefined && event.button !== 0) return
    event.stopPropagation()
    clearLongPress()
    longPressedRef.current = false
    longPressTimerRef.current = window.setTimeout(() => {
      longPressedRef.current = true
      onOpenSettings()
    }, LONG_PRESS_MS)
  }
  const handleSoundClick = () => {
    clearLongPress()
    if (longPressedRef.current) { longPressedRef.current = false; return }
    onSoundToggle(!soundEnabled)
  }

  const creator = video.creator
  return (
    <article data-fast-slide className="relative h-full w-full shrink-0 snap-start overflow-hidden bg-black text-white" aria-label={video.title}>
      {active && id ? (
        <iframe ref={frameRef} title={video.title || 'YouTube'} src={iframeUrl} onLoad={handlePlayerLoad}
          className="pointer-events-none absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {(video.thumbnail_url || id) ? (
            <img src={video.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`}
              alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain opacity-80" />
          ) : null}
        </div>
      )}

      {active && id ? (
        <>
          <button type="button" aria-label={t(playing ? 'fastReels.pause' : 'fastReels.play')}
            className="absolute inset-0 z-10 h-full w-full touch-none"
            onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp}
            onPointerCancel={() => { clearLongPress(); gestureRef.current = null }}
            onContextMenu={event => { event.preventDefault(); clearLongPress(); onOpenSettings() }}
            onClick={() => {
              if (longPressedRef.current || Date.now() - lastSwipeAtRef.current < 400) return
              if (clearDisplay) { onRestoreDisplay?.(); return }
              togglePlayback()
            }}
          />
          {!playing ? (
            <div className="pointer-events-none absolute inset-0 z-[11] flex items-center justify-center">
              <span className="rounded-full bg-black/45 p-3"><Play size={24} fill="currentColor" /></span>
            </div>
          ) : null}
        </>
      ) : null}

      <div className={clearDisplay ? 'hidden' : ''}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-56 bg-gradient-to-t from-black/85 to-transparent" />
      <div className="pointer-events-none absolute bottom-6 left-3 right-16 z-20">
        {creator?.page_username ? (
          <button type="button" onClick={() => onAuthorOpen(creator.page_username)}
            className="pointer-events-auto mb-2 flex max-w-full items-center gap-2 text-left">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt="" loading="lazy" className="h-8 w-8 rounded-full object-cover ring-1 ring-white/80" />
            ) : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">{String(creator.page_name || 'A')[0]}</span>}
            <span className="max-w-[230px] truncate text-[13px] font-bold drop-shadow-md">{creator.page_name || creator.page_username}</span>
          </button>
        ) : null}
        <h2 className="line-clamp-2 text-[13px] font-semibold leading-5 drop-shadow-md">{video.title}</h2>
        {video.description ? <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/90">{video.description}</p> : null}
      </div>

      {active ? (
        <div className="absolute bottom-7 right-2 z-30 flex w-12 flex-col items-center gap-3 text-white">
          {creator?.page_username ? (
            <div className="relative mb-1">
              <button type="button" onClick={() => onAuthorOpen(creator.page_username)} aria-label={t('fastReels.creatorProfile')}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-700">
                {creator.avatar_url ? <img src={creator.avatar_url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs font-bold">{String(creator.page_name || 'A')[0]}</span>}
              </button>
              {!isFollowing ? <button type="button" aria-label={t('fastReels.follow')} onClick={() => onFollow(video)}
                className="absolute -bottom-1.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-pink-600 text-white">
                <Plus size={15}/>
              </button> : <span className="absolute -bottom-1 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-green-600"><Check size={11}/></span>}
            </div>
          ) : null}
          <button type="button" aria-label={t('fastReels.liked')} aria-pressed={isLiked} onClick={() => onLike(video.id)}
            className="flex h-9 w-9 items-center justify-center drop-shadow-lg">
            <Heart size={25} strokeWidth={2} fill={isLiked ? '#ff4c78' : 'none'} color={isLiked ? '#ff4c78' : 'white'} />
          </button>
          <button type="button" aria-label={t('fastReels.comments')} onClick={() => onComment(video)}
            className="flex h-9 w-9 items-center justify-center drop-shadow-lg"><MessageCircle size={25}/></button>
          <button type="button" aria-label={t(isSaved ? 'fastReels.saved' : 'fastReels.save')} aria-pressed={isSaved} onClick={() => onSave(video.id)}
            className="flex h-9 w-9 items-center justify-center drop-shadow-lg"><Bookmark size={25} fill={isSaved ? 'white' : 'none'} /></button>
          <button type="button" aria-label={t('fastReels.share')} onClick={() => onShare(video)}
            className="flex h-9 w-9 items-center justify-center drop-shadow-lg"><Share2 size={24}/></button>
          {(!soundEnabled || !playing) ? (
            <button type="button" aria-label={t(soundEnabled ? 'fastReels.soundOff' : 'fastReels.soundOn')}
              onPointerDown={handleSoundDown} onPointerUp={clearLongPress} onPointerCancel={clearLongPress}
              onPointerLeave={clearLongPress}
              onContextMenu={event => {
                event.preventDefault()
                clearLongPress()
                longPressedRef.current = true
                onOpenSettings()
              }}
              onClick={handleSoundClick}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 drop-shadow-lg">
              {soundEnabled ? <Volume2 size={21}/> : <VolumeX size={21}/>}
            </button>
          ) : null}
        </div>
           ) : null}
      </div>
    </article>
  )
}

export default function FastReelsPage({ embedded = false }) {
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
  const [feedTab, setFeedTab] = useState('forYou')
  const [activeIndex, setActiveIndex] = useState(initialCache?.index || 0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [clearDisplay, setClearDisplay] = useState(false)

const [autoScroll, setAutoScroll] = useState(() => {
  try {
    return localStorage.getItem(AUTO_SCROLL_KEY) === '1'
  } catch {
    return false
  }
})

const [hiddenIds, setHiddenIds] = useState(
  () => new Set(getStoredIds(HIDDEN_KEY))
)

useEffect(() => {
  try {
    localStorage.setItem(
      AUTO_SCROLL_KEY,
      autoScroll ? '1' : '0'
    )
  } catch {
    // Storage unavailable
  }
}, [autoScroll])

useEffect(() => {
  const frame = window.requestAnimationFrame(() => {
    const root = viewportRef.current
    if (!root) return

    root.scrollTo({
      top: activeIndexRef.current * root.clientHeight,
      behavior: 'instant',
    })
  })

  return () => window.cancelAnimationFrame(frame)
}, [clearDisplay])
  const [loading, setLoading] = useState(!initialCache?.videos?.length)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(initialCache?.hasMore ?? true)
  const [followedIds, setFollowedIds] = useState(new Set())
  const [followingReady, setFollowingReady] = useState(false)
  const [followingError, setFollowingError] = useState('')
  const [savedIds, setSavedIds] = useState(() => new Set(getStoredIds(SAVED_KEY)))
  const [likedIds, setLikedIds] = useState(() => new Set(getStoredIds(LIKED_KEY)))
  const [notice, setNotice] = useState('')
  const toastTimerRef = useRef(null)
  const followedLoaderRef = useRef(false)

  const showNotice = useCallback(message => {
    setNotice(message)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setNotice(''), 2600)
  }, [])
  useEffect(() => () => window.clearTimeout(toastTimerRef.current), [])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/fast/videos?limit=${PAGE_SIZE}&offset=${nextOffset.current}`)
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload.ok !== true || !Array.isArray(payload.videos)) throw new Error(payload.message || 'Unable to load videos')
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
    } catch (err) { setError(err.message || 'Unable to load videos') }
    finally { loadingRef.current = false; setLoading(false) }
  }, [])

  const loadFollowing = useCallback(async () => {
    const token = getToken()
    if (!token) { setFollowingError(t('fastReels.login')); setFollowingReady(true); return }
    if (followedLoaderRef.current) return
    followedLoaderRef.current = true
    setFollowingError('')
    try {
      const all = new Set()
      let page = 1
      let hasNext = true
      // Paginate only the existing follow list, not a request per creator.
      while (hasNext && page <= 10) {
        const response = await fetch(`${API_BASE_URL}/api/authors/following?limit=50&page=${page}`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false || !Array.isArray(data.author_pages)) throw new Error(data.message || t('fastReels.followingError'))
        data.author_pages.forEach(author => { if (author.user_id) all.add(String(author.user_id)) })
        hasNext = Boolean(data.has_next)
        page += 1
      }
      setFollowedIds(all)
    } catch (err) { setFollowingError(err.message || t('fastReels.followingError')) }
    finally { setFollowingReady(true); followedLoaderRef.current = false }
  }, [t])

  useEffect(() => { if (!initialCacheRef.current?.videos?.length) loadMore() }, [loadMore])
  useEffect(() => { if (feedTab === 'following' && !followingReady) loadFollowing() }, [feedTab, followingReady, loadFollowing])
  useEffect(() => {
    if (videos.length && feedTab === 'forYou') cachedFeed = { videos, offset: nextOffset.current, hasMore, index: activeIndex, savedAt: Date.now() }
  }, [videos, hasMore, activeIndex, feedTab])

  const visibleVideos = useMemo(() => {
  const available = videos.filter(
    video => !hiddenIds.has(String(video.id))
  )

  return feedTab === 'following'
    ? available.filter(
        video => followedIds.has(String(video.user_id))
      )
    : available
}, [feedTab, followedIds, videos, hiddenIds])

  const navigateSlide = useCallback(direction => {
    const root = viewportRef.current
    if (!root || !visibleVideos.length || Date.now() < navigationLockUntilRef.current) return
    const next = Math.max(0, Math.min(visibleVideos.length - 1, activeIndexRef.current + direction))
    if (next === activeIndexRef.current) return
    navigationLockUntilRef.current = Date.now() + 420
    activeIndexRef.current = next
    setActiveIndex(next)
    root.scrollTo({ top: next * root.clientHeight, behavior: 'smooth' })
  }, [visibleVideos.length])

  const handleVideoEnded = useCallback(() => {
    if (!autoScroll || settingsOpen) return
    if (activeIndexRef.current < visibleVideos.length - 1) navigateSlide(1)
  }, [autoScroll, settingsOpen, visibleVideos.length, navigateSlide])

  const hideCurrentReel = useCallback(() => {
    const index = Math.min(activeIndexRef.current, Math.max(0, visibleVideos.length - 1))
    const reel = visibleVideos[index]
    if (!reel?.id) return
    setHiddenIds(previous => {
      const next = new Set(previous)
      next.add(String(reel.id))
      try { localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next])) } catch { /* storage blocked */ }
      return next
    })
    const nextIndex = Math.min(index, Math.max(0, visibleVideos.length - 2))
    activeIndexRef.current = nextIndex
    setActiveIndex(nextIndex)
    window.requestAnimationFrame(() => {
      viewportRef.current?.scrollTo({ top: nextIndex * (viewportRef.current?.clientHeight || 0), behavior: 'instant' })
    })
    setSettingsOpen(false)
  }, [visibleVideos])

  const changeTab = tab => {
    if (feedTab === tab) return
    setFeedTab(tab)
    activeIndexRef.current = 0
    setActiveIndex(0)
    navigationLockUntilRef.current = Date.now() + 200
    viewportRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => {
    const root = viewportRef.current
    if (!root || !visibleVideos.length) return undefined
    if (initialCacheRef.current?.videos?.length && feedTab === 'forYou') {
      root.scrollTo({ top: activeIndexRef.current * root.clientHeight, behavior: 'instant' })
      initialCacheRef.current = null
    }
    const slides = Array.from(root.querySelectorAll('[data-fast-slide]'))
    const observer = new IntersectionObserver(entries => {
      if (Date.now() < navigationLockUntilRef.current) return
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const index = slides.indexOf(entry.target)
          if (index >= 0) { activeIndexRef.current = index; setActiveIndex(index) }
        }
      }
    }, { root, threshold: [0.6, 0.8] })
    slides.forEach(slide => observer.observe(slide))
    return () => observer.disconnect()
  }, [visibleVideos.length, feedTab])

  useEffect(() => {
    const root = viewportRef.current
    if (!root || !visibleVideos.length || settingsOpen) return undefined
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
  }, [visibleVideos.length, settingsOpen, navigateSlide])

  useEffect(() => {
    if (settingsOpen) return undefined
    const onKey = event => {
      if (event.target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return
      if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); navigateSlide(1) }
      else if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); navigateSlide(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [settingsOpen, navigateSlide])

  useEffect(() => {
    if (feedTab === 'forYou' && !loading && hasMore && visibleVideos.length > 0 && activeIndex >= Math.max(0, visibleVideos.length - 3)) loadMore()
  }, [activeIndex, feedTab, hasMore, visibleVideos.length, loading, loadMore])

  const openAuthorProfile = useCallback(username => {
    if (username) navigate(`/author/page/${encodeURIComponent(username)}`)
  }, [navigate])
  const followAuthor = async video => {
    const username = video.creator?.page_username
    if (!username) return
    const token = getToken()
    if (!token) { navigate('/login'); return }
    if (followedIds.has(String(video.user_id))) return
    try {
      const response = await fetch(`${API_BASE_URL}/api/authors/page/${encodeURIComponent(username)}/follow`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}',
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || t('fastReels.followingError'))
      setFollowedIds(current => new Set([...current, String(video.user_id)]))
    } catch (err) { showNotice(err.message || t('fastReels.followingError')) }
  }

  const toggleLocal = (id, setState, key) => {
    setState(previous => {
      const next = new Set(previous)
      if (next.has(String(id))) next.delete(String(id))
      else next.add(String(id))
      try { localStorage.setItem(key, JSON.stringify([...next])) } catch { /* local storage not available */ }
      return next
    })
  }
  const shareReel = async video => {
    const url = video.video_url || `${window.location.origin}/fast`
    try {
      if (navigator.share) await navigator.share({ title: video.title, url })
      else { await navigator.clipboard.writeText(url); showNotice(t('fastReels.copied')) }
    } catch (err) { if (err?.name !== 'AbortError') showNotice(t('fastReels.shareFailed')) }
  }
  const openComments = video => {
    // The current backend has no Fast comments endpoints; open the REAL YouTube comments, not a fake form.
    window.open(video.video_url, '_blank', 'noopener,noreferrer')
  }

  const activeVideoIndex = Math.min(activeIndex, Math.max(0, visibleVideos.length - 1))
  return (
    <div className={`${clearDisplay ? 'fixed inset-0 z-[9990]' : embedded ? 'relative w-full' : 'fixed inset-0'} flex flex-col overflow-hidden bg-black text-white`}
      style={embedded && !clearDisplay ? { height: 'calc(100dvh - 114px - env(safe-area-inset-bottom))' } : undefined}>
      {/* The header is a sibling of the YouTube iframe, never an overlay hiding YouTube attribution. */}
      {!clearDisplay ? <header className="relative z-40 flex h-14 shrink-0 items-center justify-center bg-black px-3 text-white">
        <nav className="flex items-center gap-6" aria-label="Fast feeds">
          {[['following', t('fastReels.following')], ['forYou', t('fastReels.forYou')]].map(([key, label]) => (
            <button type="button" key={key} onClick={() => changeTab(key)} aria-current={feedTab === key ? 'page' : undefined}
              className={`relative py-3 text-sm ${feedTab === key ? 'font-bold text-white' : 'font-medium text-white/65'}`}>
              {label}
              {feedTab === key ? <span className="absolute bottom-1 left-1/4 right-1/4 h-0.5 rounded-full bg-white" /> : null}
            </button>
          ))}
        </nav>
        <button type="button" onClick={() => navigate('/discover/search')} aria-label={t('fastReels.search')}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full active:bg-white/10">
          <Search size={22}/>
        </button>
      </header> : null}
      <main className="relative min-h-0 flex-1 bg-black">
        {visibleVideos.length ? (
          <div ref={viewportRef} key={feedTab} className="mx-auto h-full w-full max-w-[520px] snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
            style={{ scrollbarWidth: 'none' }}>
            {visibleVideos.map((video, index) => (
              <div key={video.id} className="h-full snap-start">
                <VideoSlide video={video} active={index === activeVideoIndex} soundEnabled={soundEnabled}
                  onSoundToggle={setSoundEnabled} playbackSpeed={playbackSpeed}
                  onOpenSettings={() => setSettingsOpen(true)}
                  onAuthorOpen={openAuthorProfile} onFollow={followAuthor}
                  isFollowing={followedIds.has(String(video.user_id))} onNavigate={navigateSlide}
                  onSave={id => toggleLocal(id, setSavedIds, SAVED_KEY)} isSaved={savedIds.has(String(video.id))}
                  onLike={id => toggleLocal(id, setLikedIds, LIKED_KEY)} isLiked={likedIds.has(String(video.id))}
                  onShare={shareReel} onComment={openComments}
                  clearDisplay={clearDisplay}
                  onRestoreDisplay={() => setClearDisplay(false)}
                  onEnded={handleVideoEnded}
                  t={t} />
              </div>
            ))}
            {feedTab === 'following' && hasMore ? (
              <button type="button" onClick={loadMore} disabled={loading}
                className="pointer-events-auto sticky bottom-3 left-3 z-40 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-black disabled:opacity-60">
                {t('fastReels.loadMore')}
              </button>
            ) : null}
          </div>
        ) : loading || (feedTab === 'following' && !followingReady) ? (
          <div className="mx-auto max-w-md px-5 pt-20 text-white"><PageLoadingState label={t('fastReels.loading')}/></div>
        ) : feedTab === 'following' ? (
          <div className="mx-auto max-w-md px-5 pt-20 text-center text-sm">
            <p className="font-semibold">{followingError || t('fastReels.followEmpty')}</p>
            <p className="mt-2 text-white/60">{t('fastReels.followHelp')}</p>
            {hasMore ? <button type="button" className="mt-6 rounded-full border border-white/50 px-5 py-2" onClick={loadMore}>{t('fastReels.loadMore')}</button> : null}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md px-5 pt-20"><PageErrorState title={t('fastReels.error')} actionLabel={t('fastReels.retry')} onAction={loadMore} /></div>
        ) : (
          <div className="mx-auto max-w-md px-5 pt-20"><PageEmptyState title={t('fastReels.empty')} body={t('fastReels.emptyBody')}/></div>
        )}
        {error && visibleVideos.length ? <button type="button" onClick={loadMore}
          className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-4 py-2 text-xs text-black"><RefreshCw size={13}/>{t('fastReels.retry')}</button> : null}
        {notice ? <div role="status" className="pointer-events-none absolute bottom-20 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-xl bg-black/85 px-4 py-2 text-center text-xs text-white">{notice}</div> : null}
      </main>
      {!embedded && !clearDisplay ? <div className="h-[calc(64px+env(safe-area-inset-bottom))] shrink-0"><ReaderProfileFooter /></div> : null}
      <FastReelSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} t={t}
        soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}
        speed={playbackSpeed} setSpeed={setPlaybackSpeed}
        onNotInterested={hideCurrentReel}
        clearDisplay={clearDisplay}
        onClearDisplay={() => {
          setClearDisplay(true)
          showNotice('Tap once to restore controls')
        }}
        autoScroll={autoScroll}
        onAutoScrollChange={setAutoScroll} />
    </div>
  )
}
