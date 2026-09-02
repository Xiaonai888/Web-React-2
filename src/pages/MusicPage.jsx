import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MusicYoutubePlayer from '../components/MusicYoutubePlayer'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'

registerTranslationNamespace('musicPage', {
  en: {
    music: 'Music',
    artists: 'Artists',
    artist: 'Artist',
    following: 'Following',
    follow: 'Follow',
    popular: 'Popular',
    popularHint: 'Most played on Shadow',
    albums: 'Albums',
    singles: 'Singles',
    seeAll: 'See all',
    showLess: 'Show less',
    album: 'Album',
    single: 'Single',
    nowPlaying: 'Now playing',
    search: 'Search music',
    back: 'Back',
    tracks: 'Tracks',
    play: 'Play',
    totalListeners: 'Listener',
    noArtists: 'No artists yet',
    noPopular: 'No popular songs yet.',
    noAlbums: 'No albums yet.',
    noSingles: 'No singles yet.',
    noTracks: 'No songs in this release yet.',
    loadFailed: 'Unable to load music right now.',
    retry: 'Retry',
    loading: 'Loading music...',
    close: 'Close',
    views: 'Views',
    listener: 'Listener',
    listeners: 'Listeners',
    library: 'Your Library',
    latest: 'Latest',
    allSingles: 'All Singles',
    allAlbums: 'All Albums',
    home: 'Home',
    previous: 'Previous',
    next: 'Next',
    expandVideo: 'Expand video',
    compactVideo: 'Compact video',
    closePlayer: 'Stop',
  },
  km: {
    music: 'តន្ត្រី',
    artists: 'អ្នកចម្រៀង',
    artist: 'អ្នកចម្រៀង',
    following: 'កំពុងតាមដាន',
    follow: 'តាមដាន',
    popular: 'ពេញនិយម',
    popularHint: 'បទដែលមានអ្នកស្តាប់ច្រើននៅ Shadow',
    albums: 'Album',
    singles: 'Single',
    seeAll: 'មើលទាំងអស់',
    showLess: 'បង្ហាញតិច',
    album: 'Album',
    single: 'Single',
    nowPlaying: 'កំពុងចាក់',
    search: 'ស្វែងរកតន្ត្រី',
    back: 'ត្រឡប់ក្រោយ',
    tracks: 'បទចម្រៀង',
    play: 'ចាក់',
    totalListeners: 'អ្នកស្តាប់សរុប',
    noArtists: 'មិនទាន់មានអ្នកចម្រៀង',
    noPopular: 'មិនទាន់មានបទពេញនិយមនៅឡើយទេ។',
    noAlbums: 'មិនទាន់មាន Album',
    noSingles: 'មិនទាន់មាន Single',
    noTracks: 'មិនទាន់មានបទក្នុង Release នេះ',
    loadFailed: 'មិនអាចផ្ទុកតន្ត្រីបានទេ។',
    retry: 'សាកម្តងទៀត',
    loading: 'កំពុងផ្ទុកតន្ត្រី...',
    close: 'បិទ',
    views: 'Views',
    listener: 'អ្នកស្តាប់',
    listeners: 'អ្នកស្តាប់',
    library: 'បណ្ណាល័យ',
    latest: 'ថ្មីៗ',
    allSingles: 'Single ទាំងអស់',
    allAlbums: 'Album ទាំងអស់',
    home: 'ទំព័រដើម',
    previous: 'បទមុន',
    next: 'បទបន្ទាប់',
    expandVideo: 'ពង្រីកវីដេអូ',
    compactVideo: 'បង្រួមវីដេអូ',
    closePlayer: 'បញ្ឈប់',
  },
  zh: {
    music: '音乐',
    artists: '歌手',
    artist: '歌手',
    following: '已关注',
    follow: '关注',
    popular: '热门',
    popularHint: 'Shadow 上播放最多的歌曲',
    albums: '专辑',
    singles: '单曲',
    seeAll: '查看全部',
    showLess: '收起',
    album: '专辑',
    single: '单曲',
    nowPlaying: '正在播放',
    search: '搜索音乐',
    back: '返回',
    tracks: '歌曲',
    play: '播放',
    totalListeners: '总听众',
    noArtists: '暂无歌手',
    noPopular: '暂无热门歌曲。',
    noAlbums: '暂无专辑。',
    noSingles: '暂无单曲。',
    noTracks: '此发行暂无歌曲。',
    loadFailed: '暂时无法加载音乐。',
    retry: '重试',
    loading: '正在加载音乐...',
    close: '关闭',
    views: '播放',
    listener: '听众',
    listeners: '听众',
    library: '音乐库',
    latest: '最新',
    allSingles: '全部单曲',
    allAlbums: '全部专辑',
    home: '主页',
    previous: '上一首',
    next: '下一首',
    expandVideo: '展开视频',
    compactVideo: '缩小视频',
    closePlayer: '停止',
  },
  ja: {
    music: '音楽',
    artists: 'アーティスト',
    artist: 'アーティスト',
    following: 'フォロー中',
    follow: 'フォロー',
    popular: '人気',
    popularHint: 'Shadowでよく聴かれている曲',
    albums: 'アルバム',
    singles: 'シングル',
    seeAll: 'すべて見る',
    showLess: '閉じる',
    album: 'アルバム',
    single: 'シングル',
    nowPlaying: '再生中',
    search: '音楽を検索',
    back: '戻る',
    tracks: '曲',
    play: '再生',
    totalListeners: '総リスナー',
    noArtists: 'アーティストはまだいません',
    noPopular: '人気曲はまだありません。',
    noAlbums: 'アルバムはまだありません。',
    noSingles: 'シングルはまだありません。',
    noTracks: 'このリリースにはまだ曲がありません。',
    loadFailed: '音楽を読み込めません。',
    retry: '再試行',
    loading: '音楽を読み込み中...',
    close: '閉じる',
    views: '再生',
    listener: 'リスナー',
    listeners: 'リスナー',
    library: 'ライブラリ',
    latest: '最新',
    allSingles: 'すべてのシングル',
    allAlbums: 'すべてのアルバム',
    home: 'ホーム',
    previous: '前へ',
    next: '次へ',
    expandVideo: '動画を拡大',
    compactVideo: '動画を縮小',
    closePlayer: '停止',
  },
  ko: {
    music: '음악',
    artists: '아티스트',
    artist: '아티스트',
    following: '팔로잉',
    follow: '팔로우',
    popular: '인기곡',
    popularHint: 'Shadow에서 가장 많이 재생된 곡',
    albums: '앨범',
    singles: '싱글',
    seeAll: '모두 보기',
    showLess: '접기',
    album: '앨범',
    single: '싱글',
    nowPlaying: '재생 중',
    search: '음악 검색',
    back: '뒤로',
    tracks: '트랙',
    play: '재생',
    totalListeners: '총 청취자',
    noArtists: '아직 아티스트가 없습니다',
    noPopular: '아직 인기곡이 없습니다.',
    noAlbums: '아직 앨범이 없습니다.',
    noSingles: '아직 싱글이 없습니다.',
    noTracks: '이 릴리스에는 아직 곡이 없습니다.',
    loadFailed: '음악을 불러올 수 없습니다.',
    retry: '다시 시도',
    loading: '음악을 불러오는 중...',
    close: '닫기',
    views: '조회',
    listener: '청취자',
    listeners: '청취자',
    library: '라이브러리',
    latest: '최신',
    allSingles: '모든 싱글',
    allAlbums: '모든 앨범',
    home: '홈',
    previous: '이전',
    next: '다음',
    expandVideo: '비디오 확대',
    compactVideo: '비디오 축소',
    closePlayer: '정지',
  },
})

const COVER_TONES = [
  'from-[#3d5872] via-[#1e3145] to-[#090d12]',
  'from-[#8b421b] via-[#4d1c0a] to-[#110604]',
  'from-[#464276] via-[#242044] to-[#090811]',
  'from-[#425867] via-[#24323c] to-[#0a0f12]',
  'from-[#5b3d61] via-[#302235] to-[#0e090f]',
  'from-[#32645f] via-[#193834] to-[#07100f]',
]

function PlayIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 5.2v13.6c0 .92 1.02 1.48 1.8.98l10.1-6.8a1.16 1.16 0 0 0 0-1.96L9.8 4.22C9.02 3.72 8 4.28 8 5.2Z" />
    </svg>
  )
}

function PauseIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <rect x="7" y="5" width="3.8" height="14" rx="1" />
      <rect x="13.2" y="5" width="3.8" height="14" rx="1" />
    </svg>
  )
}

function MusicIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function formatViews(value) {
  const count = Number(value || 0)
  if (count >= 1000000) return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  return String(count)
}

function formatListeners(value) {
  return Number(value || 0).toLocaleString()
}

function getYoutubeVideoId(song) {
  const direct = String(song?.youtube_video_id || '').trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(direct)) return direct

  const raw = String(song?.youtube_url || '').trim()
  if (!raw) return ''

  try {
    const url = new URL(raw)
    const host = url.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '')
    let id = ''

    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] || ''
    } else if (
      host === 'youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (url.pathname === '/watch') {
        id = url.searchParams.get('v') || ''
      } else {
        const parts = url.pathname.split('/').filter(Boolean)
        if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || ''
      }
    }

    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : ''
  } catch {
    return ''
  }
}

function durationText(seconds) {
  const total = Number(seconds || 0)
  if (!total) return ''
  const minutes = Math.floor(total / 60)
  const rest = String(total % 60).padStart(2, '0')
  return `${minutes}:${rest}`
}

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}


function LibraryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h4v14H4zM11 5h3v14h-3zM17 6l3-1 3 12-3 1z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function PreviousIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 5h2v14H6zM18 6.3v11.4c0 .8-.9 1.27-1.55.82l-7.5-5.7a1 1 0 0 1 0-1.64l7.5-5.7A1 1 0 0 1 18 6.3Z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 5h2v14h-2zM6 6.3v11.4c0 .8.9 1.27 1.55.82l7.5-5.7a1 1 0 0 0 0-1.64l-7.5-5.7A1 1 0 0 0 6 6.3Z" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="m17 10 4-2v8l-4-2z" />
    </svg>
  )
}

function latestFirst(items) {
  return [...items].sort((a, b) => {
    const aTime =
      Date.parse(a.release_date || a.created_at || '') ||
      Number(a.release_year || 0)
    const bTime =
      Date.parse(b.release_date || b.created_at || '') ||
      Number(b.release_year || 0)

    return bTime - aTime
  })
}

export default function MusicPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const playerControlRef = useRef(null)
  const centerRef = useRef(null)

  const [artists, setArtists] = useState([])
  const [selectedArtistId, setSelectedArtistId] = useState('')
  const [artistData, setArtistData] = useState(null)
  const [loadingArtists, setLoadingArtists] = useState(true)
  const [loadingArtist, setLoadingArtist] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState('home')
  const [selectedAlbumId, setSelectedAlbumId] = useState('')
  const [followingByArtist, setFollowingByArtist] = useState({})
  const [followLoading, setFollowLoading] = useState(false)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [currentEntry, setCurrentEntry] = useState(null)
  const [playerNonce, setPlayerNonce] = useState(0)
  const [playerState, setPlayerState] = useState('idle')
  const [videoExpanded, setVideoExpanded] = useState(false)

  async function publicRequest(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, { cache: 'no-store', ...options })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) throw new Error(data.message || t('musicPage.loadFailed'))
    return data
  }

  async function readerRequest(path, options = {}) {
    const token = getReaderToken()
    if (!token) throw new Error('AUTH_REQUIRED')
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })
    const data = await response.json().catch(() => ({}))
    if (response.status === 401 || response.status === 403) throw new Error('AUTH_REQUIRED')
    if (!response.ok || data.ok === false) throw new Error(data.message || t('musicPage.loadFailed'))
    return data
  }

  const loadArtists = async () => {
    setLoadingArtists(true)
    setError('')
    try {
      const data = await publicRequest('/api/music/artists')
      const rows = Array.isArray(data.artists) ? data.artists : []
      setArtists(rows)
      setSelectedArtistId((current) => current && rows.some((item) => item.id === current) ? current : rows[0]?.id || '')
    } catch (requestError) {
      setError(requestError.message || t('musicPage.loadFailed'))
      setArtists([])
      setSelectedArtistId('')
      setArtistData(null)
    } finally {
      setLoadingArtists(false)
    }
  }

  async function loadFollows() {
    if (!getReaderToken()) {
      setFollowingByArtist({})
      return
    }
    try {
      const data = await readerRequest('/api/music/follows')
      const next = {}
      for (const artistId of data.artist_ids || []) next[artistId] = true
      setFollowingByArtist(next)
    } catch (requestError) {
      if (requestError.message !== 'AUTH_REQUIRED') setError(requestError.message)
    }
  }

  useEffect(() => {
    loadArtists()
    loadFollows()
  }, [])

  useEffect(() => {
    if (!selectedArtistId) {
      setArtistData(null)
      return undefined
    }
    const controller = new AbortController()
    async function loadArtist() {
      setLoadingArtist(true)
      setError('')
      try {
        const data = await publicRequest(`/api/music/artists/${encodeURIComponent(selectedArtistId)}`, { signal: controller.signal })
        setArtistData(data)
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || t('musicPage.loadFailed'))
          setArtistData(null)
        }
      } finally {
        if (!controller.signal.aborted) setLoadingArtist(false)
      }
    }
    loadArtist()
    return () => controller.abort()
  }, [selectedArtistId])

  const filteredArtists = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return artists

    return artists.filter((item) =>
      String(item.name || '').toLowerCase().includes(keyword)
    )
  }, [artists, query])

  const artist = artistData?.artist || artists.find((item) => item.id === selectedArtistId) || null
  const releases = Array.isArray(artistData?.releases) ? artistData.releases : []
  const singles = useMemo(() => latestFirst(releases.filter((release) => release.release_type === 'single')), [releases])
  const albums = useMemo(
    () =>
      latestFirst(
        releases.filter((release) => release.release_type === 'album')
      ),
    [releases]
  )

  const filteredAlbums = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return albums

    return albums.filter((release) =>
      String(release.title || '').toLowerCase().includes(keyword)
    )
  }, [albums, query])
  const allSongs = useMemo(() => releases.flatMap((release) => release.songs || []), [releases])
  const releaseById = useMemo(() => new Map(releases.map((release) => [release.id, release])), [releases])
  const popularSongs = useMemo(() => [...allSongs].sort((a, b) => Number(b.view_count || 0) - Number(a.view_count || 0)).slice(0, 10), [allSongs])
  const selectedAlbum = albums.find((release) => release.id === selectedAlbumId) || null
  const isFollowing = Boolean(artist?.id && followingByArtist[artist.id])
  const currentVideoId = getYoutubeVideoId(currentEntry?.song)
  const currentSong = currentEntry?.song || null
  const currentRelease = currentEntry?.release || null
  const currentArtist = currentEntry?.artist || null

  function requireLogin() {
    navigate('/login', { state: { returnTo: '/music' } })
  }

  function scrollCenterTop() {
    window.requestAnimationFrame(() => centerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function selectArtist(artistId) {
    if (!artistId) return
    setSelectedArtistId(artistId)
    setViewMode('home')
    setSelectedAlbumId('')
    setQuery('')
    if (window.innerWidth < 900) setSidebarOpen(false)
    scrollCenterTop()
  }

  async function toggleFollow() {
    if (!artist?.id || followLoading) return
    if (!getReaderToken()) {
      requireLogin()
      return
    }
    const nextFollowing = !isFollowing
    setFollowLoading(true)
    setError('')
    try {
      const data = await readerRequest(`/api/music/artists/${encodeURIComponent(artist.id)}/follow`, {
        method: nextFollowing ? 'POST' : 'DELETE',
      })
      setFollowingByArtist((current) => ({ ...current, [artist.id]: Boolean(data.following) }))
    } catch (requestError) {
      if (requestError.message === 'AUTH_REQUIRED') requireLogin()
      else setError(requestError.message)
    } finally {
      setFollowLoading(false)
    }
  }

  function makeEntry(song, release, artistValue = artist) {
    return { song, release, artist: artistValue }
  }

  function entriesForRelease(release) {
    return (release?.songs || []).filter((song) => getYoutubeVideoId(song)).map((song) => makeEntry(song, release))
  }

  function entriesForSingles() {
    return singles.flatMap((release) => entriesForRelease(release))
  }

  function entriesForPopular() {
    return popularSongs.map((song) => makeEntry(song, releaseById.get(song.release_id) || null)).filter((entry) => getYoutubeVideoId(entry.song))
  }

  function startQueue(entries, songId = '') {
    if (!getReaderToken()) {
      requireLogin()
      return
    }
    const playable = entries.filter((entry) => entry?.song && getYoutubeVideoId(entry.song))
    if (!playable.length) return
    const index = Math.max(0, playable.findIndex((entry) => entry.song.id === songId))
    setQueue(playable)
    setQueueIndex(index)
    setCurrentEntry(playable[index])
    setPlayerState('buffering')
    setPlayerNonce((value) => value + 1)
  }

  function playSingle(release) {
    const firstSong = release?.songs?.[0]
    if (!firstSong) return
    startQueue(entriesForSingles(), firstSong.id)
  }

  function playPopular(song) {
    startQueue(entriesForPopular(), song.id)
  }

  function playAlbum(release, songId = '') {
    const entries = entriesForRelease(release)
    startQueue(entries, songId || entries[0]?.song?.id || '')
  }

  function playArtist() {
    const entries = releases.flatMap((release) => entriesForRelease(release))
    const preferred = popularSongs[0]?.id || entries[0]?.song?.id || ''
    startQueue(entries, preferred)
  }

  function playQueueIndex(index) {
    if (index < 0 || index >= queue.length) return false
    setQueueIndex(index)
    setCurrentEntry(queue[index])
    setPlayerState('buffering')
    setPlayerNonce((value) => value + 1)
    return true
  }

  function playNext() {
    return playQueueIndex(queueIndex + 1)
  }

  function playPrevious() {
    if (queueIndex > 0) return playQueueIndex(queueIndex - 1)
    playerControlRef.current?.seekTo?.(0)
    playerControlRef.current?.play?.()
    return false
  }

  function togglePlayback() {
    if (!currentEntry) return
    if (playerState === 'ended') {
      playerControlRef.current?.seekTo?.(0)
      playerControlRef.current?.play?.()
      return
    }
    playerControlRef.current?.toggle?.()
  }

  function stopPlayer() {
    setCurrentEntry(null)
    setQueue([])
    setQueueIndex(-1)
    setPlayerState('idle')
    setVideoExpanded(false)
  }

  function openAlbum(release) {
    setSelectedAlbumId(release.id)
    setViewMode('album')
    scrollCenterTop()
  }

  function openView(mode) {
    setViewMode(mode)
    setSelectedAlbumId('')
    scrollCenterTop()
  }

  function handleListenRecorded({ songId, viewCount }) {
    setArtistData((current) => {
      if (!current) return current
      return {
        ...current,
        releases: (current.releases || []).map((release) => ({
          ...release,
          songs: (release.songs || []).map((song) => song.id === songId ? { ...song, view_count: viewCount } : song),
        })),
      }
    })
    setQueue((current) => current.map((entry) => entry.song.id === songId ? { ...entry, song: { ...entry.song, view_count: viewCount } } : entry))
    setCurrentEntry((current) => current?.song?.id === songId ? { ...current, song: { ...current.song, view_count: viewCount } } : current)
  }

  function renderReleaseCard(release, index) {
    const isSingle = release.release_type === 'single'
    const firstSong = release.songs?.[0] || null
    const active = currentRelease?.id === release.id
    return (
      <article key={release.id} className={`smusic-release-card${active ? ' active' : ''}`}>
        <div className={`smusic-release-cover bg-gradient-to-br ${COVER_TONES[index % COVER_TONES.length]}`}>
          <button type="button" className="smusic-cover-main" onClick={() => isSingle ? playSingle(release) : openAlbum(release)}>
            {release.cover_url ? <img src={release.cover_url} alt="" /> : <MusicIcon size={42} />}
          </button>
          {firstSong ? (
            <button type="button" className="smusic-card-play" onClick={(event) => { event.stopPropagation(); isSingle ? playSingle(release) : playAlbum(release) }} aria-label={`${t('musicPage.play')} ${release.title}`}>
              <PlayIcon size={17} />
            </button>
          ) : null}
        </div>
        <button type="button" className="smusic-release-text" onClick={() => isSingle ? playSingle(release) : openAlbum(release)}>
          <span className="smusic-release-name">{release.title}</span>
          <span className="smusic-release-meta">{release.release_year || ''}{release.release_year ? ' • ' : ''}{t(`musicPage.${isSingle ? 'single' : 'album'}`)}</span>
        </button>
      </article>
    )
  }

  function renderReleaseSection(titleKey, items, mode) {
    const visible = items.slice(0, 3)
    return (
      <section className="smusic-section">
        <div className="smusic-section-head">
          <div>
            <h2>{t(`musicPage.${titleKey}`)}</h2>
            <p>{t('musicPage.latest')}</p>
          </div>
          {items.length > 3 ? (
            <button
              type="button"
              className="smusic-see-all"
              onClick={() => openView(mode)}
            >
              {t('musicPage.seeAll')}
            </button>
          ) : null}
        </div>
        {visible.length ? <div className="smusic-release-grid">{visible.map((release, index) => renderReleaseCard(release, index))}</div> : <div className="smusic-empty">{t(`musicPage.${titleKey === 'singles' ? 'noSingles' : 'noAlbums'}`)}</div>}
      </section>
    )
  }

  function renderHome() {
    if (!artist) return null
    return (
      <>
        <section className="smusic-artist-hero" style={artist.banner_url ? { backgroundImage: `linear-gradient(180deg,rgba(8,8,9,.16),rgba(9,9,10,.93)),url(${artist.banner_url})` } : undefined}>
          <div className="smusic-hero-avatar">{artist.avatar_url ? <img src={artist.avatar_url} alt="" /> : <MusicIcon size={40} />}</div>
          <div className="smusic-hero-copy">
            <div className="smusic-eyebrow">{t('musicPage.artist')}</div>
            <h1>{artist.name}</h1>
            <div className="smusic-listeners">{formatListeners(artist.total_listeners)} {Number(artist.total_listeners || 0) === 1 ? t('musicPage.listener') : t('musicPage.listeners')}</div>
            <div className="smusic-hero-actions">
              <button type="button" className={`smusic-follow${isFollowing ? ' active' : ''}`} disabled={followLoading} onClick={toggleFollow}>{isFollowing ? t('musicPage.following') : t('musicPage.follow')}</button>
              <button type="button" className="smusic-hero-play" disabled={!allSongs.length} onClick={playArtist}><PlayIcon size={20} /></button>
            </div>
          </div>
        </section>

        <section className="smusic-section">
          <div className="smusic-section-head">
            <div><h2>{t('musicPage.popular')}</h2><p>{t('musicPage.popularHint')}</p></div>
          </div>
          {popularSongs.length ? (
            <div className="smusic-track-list">
              {popularSongs.map((song, index) => {
                const release = releaseById.get(song.release_id) || null
                const active = currentSong?.id === song.id
                return (
                  <button type="button" className={`smusic-track-row${active ? ' active' : ''}`} key={song.id} onClick={() => playPopular(song)}>
                    <span className="smusic-track-index">{active && playerState === 'playing' ? <PauseIcon size={13} /> : index + 1}</span>
                    <span className="smusic-track-cover">{release?.cover_url ? <img src={release.cover_url} alt="" /> : <MusicIcon size={16} />}</span>
                    <span className="smusic-track-main"><strong>{song.title}</strong><small>{artist.name}</small></span>
                    <span className="smusic-track-views">{formatViews(song.view_count)} {t('musicPage.views')}</span>
                    <span className="smusic-track-duration">{durationText(song.duration_seconds)}</span>
                  </button>
                )
              })}
            </div>
          ) : <div className="smusic-empty">{t('musicPage.noPopular')}</div>}
        </section>

        {renderReleaseSection('singles', singles, 'singles')}
        {renderReleaseSection('albums', albums, 'albums')}
      </>
    )
  }

  function renderAllReleases(type) {
    const items = type === 'singles' ? singles : albums
    return (
      <section className="smusic-page-view">
        <div className="smusic-page-title-row">
          <button type="button" className="smusic-round-btn" onClick={() => openView('home')}><BackIcon /></button>
          <div><div className="smusic-eyebrow">{artist?.name}</div><h1>{t(`musicPage.${type === 'singles' ? 'allSingles' : 'allAlbums'}`)}</h1></div>
        </div>
        {items.length ? <div className="smusic-release-grid smusic-all-grid">{items.map((release, index) => renderReleaseCard(release, index))}</div> : <div className="smusic-empty">{t(`musicPage.${type === 'singles' ? 'noSingles' : 'noAlbums'}`)}</div>}
      </section>
    )
  }

  function renderAlbum() {
    if (!selectedAlbum) return renderAllReleases('albums')
    const songs = selectedAlbum.songs || []
    return (
      <section className="smusic-album-view">
        <div className="smusic-page-title-row"><button type="button" className="smusic-round-btn" onClick={() => openView('home')}><BackIcon /></button></div>
        <div className="smusic-album-hero">
          <div className="smusic-album-cover">{selectedAlbum.cover_url ? <img src={selectedAlbum.cover_url} alt="" /> : <MusicIcon size={54} />}</div>
          <div className="smusic-album-copy"><div className="smusic-eyebrow">{t('musicPage.album')}</div><h1>{selectedAlbum.title}</h1><div className="smusic-album-meta">{artist?.name} • {selectedAlbum.release_year || ''} • {songs.length} {t('musicPage.tracks')}</div></div>
        </div>
        <div className="smusic-album-actions"><button type="button" className="smusic-hero-play" disabled={!songs.length} onClick={() => playAlbum(selectedAlbum)}><PlayIcon size={21} /></button></div>
        {songs.length ? (
          <div className="smusic-album-table">
            <div className="smusic-album-table-head"><span>#</span><span>Title</span><span>{t('musicPage.views')}</span><span>Time</span></div>
            {songs.map((song, index) => {
              const active = currentSong?.id === song.id
              return (
                <button type="button" key={song.id} className={`smusic-album-track${active ? ' active' : ''}`} onClick={() => playAlbum(selectedAlbum, song.id)}>
                  <span>{active && playerState === 'playing' ? <PauseIcon size={13} /> : song.track_number || index + 1}</span>
                  <span className="smusic-album-track-title"><strong>{song.title}</strong><small>{artist?.name}</small></span>
                  <span>{formatViews(song.view_count)}</span><span>{durationText(song.duration_seconds)}</span>
                </button>
              )
            })}
          </div>
        ) : <div className="smusic-empty">{t('musicPage.noTracks')}</div>}
      </section>
    )
  }

  return (
    <div className="smusic-shell">
      <style>{`
    .smusic-shell {
      --blue:#3b82f6;
      min-height:100vh;
      background:#09090a;
      color:#fff;
      padding-bottom:92px
    }
    .smusic-top {
      position:sticky;
      top:0;
      z-index:50;
      height:60px;
      border-bottom:1px solid rgba(255,255,255,.07);
      background:rgba(9,9,10,.96);
      backdrop-filter:blur(18px);
      display:flex;
      align-items:center;
      gap:10px;
      padding:0 14px
    }
    .smusic-round-btn {
      width:38px;
      height:38px;
      border:0;
      border-radius:999px;
      background:#1b1b1d;
      color:#fff;
      display:grid;
      place-items:center;
      cursor:pointer
    }
    .smusic-brand {
      font-size:16px;
      font-weight:900;
      letter-spacing:-.02em
    }
    .smusic-search {
      margin-left:auto;
      display:flex;
      align-items:center;
      gap:8px;
      width:min(330px,40vw);
      height:40px;
      padding:0 12px;
      border-radius:999px;
      background:#202024;
      color:#bbb
    }
    .smusic-search input {
      min-width:0;
      flex:1;
      border:0;
      outline:0;
      background:transparent;
      color:#fff;
      font:inherit;
      font-size:12px
    }
    .smusic-layout {
      display:flex;
      min-height:calc(100vh - 60px)
    }
    .smusic-sidebar {
      width:260px;
      flex:0 0 260px;
      border-right:1px solid rgba(255,255,255,.07);
      background:#101011;
      padding:12px 8px 110px;
      overflow:auto;
      transition:width .2s ease,flex-basis .2s ease
    }
    .smusic-sidebar.closed {
      width:72px;
      flex-basis:72px
    }
    .smusic-library-head {
      display:flex;
      align-items:center;
      gap:9px;
      padding:8px 9px 12px;
      font-size:13px;
      font-weight:850
    }
    .smusic-sidebar.closed .smusic-library-label,.smusic-sidebar.closed .smusic-side-text,.smusic-sidebar.closed .smusic-side-section-title {
      display:none
    }
    .smusic-side-section-title {
      padding:12px 9px 6px;
      color:#8c8c92;
      font-size:9px;
      font-weight:800;
      text-transform:uppercase;
      letter-spacing:.08em
    }
    .smusic-side-item {
      width:100%;
      border:0;
      background:transparent;
      color:#fff;
      display:flex;
      align-items:center;
      gap:10px;
      padding:7px 8px;
      border-radius:9px;
      text-align:left;
      cursor:pointer
    }
    .smusic-side-item:hover,.smusic-side-item.active {
      background:#202024
    }
    .smusic-side-art {
      width:44px;
      height:44px;
      flex:0 0 44px;
      display:grid;
      place-items:center;
      overflow:hidden;
      border-radius:8px;
      background:linear-gradient(145deg,#475569,#111827)
    }
    .smusic-side-art.artist {
      border-radius:999px
    }
    .smusic-side-art img {
      width:100%;
      height:100%;
      object-fit:cover
    }
    .smusic-side-text {
      min-width:0
    }
    .smusic-side-text strong,.smusic-side-text small {
      display:block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .smusic-side-text strong {
      font-size:11px
    }
    .smusic-side-text small {
      margin-top:2px;
      color:#929298;
      font-size:9px
    }
    .smusic-center {
      min-width:0;
      flex:1;
      max-width:1180px;
      margin:0 auto;
      padding:0 20px 40px
    }
    .smusic-artist-hero {
      min-height:275px;
      margin:0 -20px;
      padding:52px 28px 26px;
      display:flex;
      align-items:flex-end;
      gap:22px;
      background:linear-gradient(180deg,#45221e,#241313 58%,#09090a);
      background-size:cover;
      background-position:center
    }
    .smusic-hero-avatar {
      width:142px;
      height:142px;
      flex:0 0 142px;
      border-radius:999px;
      overflow:hidden;
      display:grid;
      place-items:center;
      background:linear-gradient(145deg,#555,#111);
      box-shadow:0 16px 34px rgba(0,0,0,.42)
    }
    .smusic-hero-avatar img {
      width:100%;
      height:100%;
      object-fit:cover
    }
    .smusic-hero-copy {
      min-width:0
    }
    .smusic-eyebrow {
      font-size:10px;
      font-weight:800;
      text-transform:uppercase;
      letter-spacing:.12em;
      color:rgba(255,255,255,.65)
    }
    .smusic-hero-copy h1,.smusic-page-view h1,.smusic-album-copy h1 {
      margin:5px 0 0;
      font-size:clamp(30px,5vw,58px);
      line-height:.98;
      font-weight:950;
      letter-spacing:-.045em
    }
    .smusic-listeners {
      margin-top:10px;
      color:#d2d2d4;
      font-size:11px
    }
    .smusic-hero-actions {
      display:flex;
      align-items:center;
      gap:12px;
      margin-top:18px
    }
    .smusic-follow {
      min-height:36px;
      padding:0 15px;
      border:1px solid rgba(255,255,255,.45);
      border-radius:999px;
      background:transparent;
      color:#fff;
      font:inherit;
      font-size:11px;
      font-weight:800;
      cursor:pointer
    }
    .smusic-follow.active {
      background:#fff;
      color:#09090a;
      border-color:#fff
    }
    .smusic-hero-play {
      width:50px;
      height:50px;
      border:0;
      border-radius:999px;
      background:var(--blue);
      color:#07101d;
      display:grid;
      place-items:center;
      cursor:pointer;
      box-shadow:0 10px 24px rgba(0,0,0,.3)
    }
    .smusic-hero-play:disabled {
      opacity:.4;
      cursor:not-allowed
    }
    .smusic-section {
      padding:26px 4px 0
    }
    .smusic-section-head {
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap:14px;
      margin-bottom:12px
    }
    .smusic-section-head h2 {
      margin:0;
      font-size:22px;
      font-weight:900;
      letter-spacing:-.025em
    }
    .smusic-section-head p {
      margin:3px 0 0;
      color:#88888f;
      font-size:9px
    }
    .smusic-see-all {
      border:0;
      background:transparent;
      color:#a9a9ae;
      font:inherit;
      font-size:10px;
      font-weight:400;
      cursor:pointer
    }
    .smusic-see-all:hover {
      color:#fff;
      text-decoration:underline
    }
    .smusic-release-grid {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px
    }
    .smusic-all-grid {
      grid-template-columns:repeat(auto-fill,minmax(150px,1fr));
      margin-top:20px
    }
    .smusic-release-card {
      min-width:0;
      padding:8px;
      border-radius:12px;
      transition:background .18s ease
    }
    .smusic-release-card:hover,.smusic-release-card.active {
      background:#171719
    }
    .smusic-release-cover {
      position:relative;
      aspect-ratio:1/1;
      border-radius:10px;
      overflow:hidden
    }
    .smusic-cover-main {
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      border:0;
      background:transparent;
      color:#fff;
      display:grid;
      place-items:center;
      cursor:pointer
    }
    .smusic-cover-main img {
      width:100%;
      height:100%;
      object-fit:cover
    }
    .smusic-card-play {
      position:absolute;
      right:10px;
      bottom:10px;
      width:45px;
      height:45px;
      border:0;
      border-radius:999px;
      background:var(--blue);
      display:grid;
      place-items:center;
      color:#08111e;
      cursor:pointer;
      opacity:0;
      transform:translateY(8px);
      transition:.18s ease
    }
    .smusic-release-card:hover .smusic-card-play {
      opacity:1;
      transform:none
    }
    .smusic-release-text {
      display:block;
      width:100%;
      padding:9px 0 0;
      border:0;
      background:transparent;
      color:#fff;
      text-align:left;
      cursor:pointer
    }
    .smusic-release-name,.smusic-release-meta {
      display:block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .smusic-release-name {
      font-size:12px;
      font-weight:850
    }
    .smusic-release-meta {
      margin-top:4px;
      color:#909096;
      font-size:9px
    }
    .smusic-track-list {
      display:grid;
      gap:2px
    }
    .smusic-track-row {
      width:100%;
      display:grid;
      grid-template-columns:24px 44px minmax(0,1fr) auto 46px;
      align-items:center;
      gap:10px;
      padding:7px;
      border:0;
      border-radius:8px;
      background:transparent;
      color:#fff;
      text-align:left;
      cursor:pointer
    }
    .smusic-track-row:hover,.smusic-track-row.active {
      background:#1b1b1e
    }
    .smusic-track-index {
      color:#9c9ca2;
      text-align:center;
      font-size:10px
    }
    .smusic-track-cover {
      width:44px;
      height:44px;
      border-radius:6px;
      overflow:hidden;
      display:grid;
      place-items:center;
      background:#222
    }
    .smusic-track-cover img {
      width:100%;
      height:100%;
      object-fit:cover
    }
    .smusic-track-main {
      min-width:0
    }
    .smusic-track-main strong,.smusic-track-main small {
      display:block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .smusic-track-main strong {
      font-size:11px
    }
    .smusic-track-main small {
      margin-top:3px;
      color:#99999f;
      font-size:9px
    }
    .smusic-track-views,.smusic-track-duration {
      color:#99999f;
      font-size:9px
    }
    .smusic-empty {
      padding:24px;
      border:1px dashed rgba(255,255,255,.12);
      border-radius:12px;
      color:#777;
      text-align:center;
      font-size:10px
    }
    .smusic-page-view,.smusic-album-view {
      padding:26px 4px
    }
    .smusic-page-title-row {
      display:flex;
      align-items:center;
      gap:13px;
      margin-bottom:18px
    }
    .smusic-page-view h1 {
      font-size:36px
    }
    .smusic-album-hero {
      min-height:260px;
      margin:0 -20px;
      padding:30px 28px;
      display:flex;
      align-items:flex-end;
      gap:22px;
      background:linear-gradient(180deg,#344154,#171b22)
    }
    .smusic-album-cover {
      width:190px;
      height:190px;
      flex:0 0 190px;
      border-radius:8px;
      overflow:hidden;
      display:grid;
      place-items:center;
      background:#1c1c1f;
      box-shadow:0 18px 40px rgba(0,0,0,.4)
    }
    .smusic-album-cover img {
      width:100%;
      height:100%;
      object-fit:cover
    }
    .smusic-album-copy {
      min-width:0
    }
    .smusic-album-copy h1 {
      font-size:clamp(30px,5vw,54px)
    }
    .smusic-album-meta {
      margin-top:12px;
      color:#d4d4d7;
      font-size:10px
    }
    .smusic-album-actions {
      padding:18px 2px
    }
    .smusic-album-table {
      border-top:1px solid rgba(255,255,255,.1)
    }
    .smusic-album-table-head,.smusic-album-track {
      display:grid;
      grid-template-columns:40px minmax(0,1fr) 90px 60px;
      align-items:center;
      gap:10px
    }
    .smusic-album-table-head {
      padding:9px 10px;
      color:#8f8f95;
      font-size:9px
    }
    .smusic-album-track {
      width:100%;
      padding:9px 10px;
      border:0;
      border-radius:7px;
      background:transparent;
      color:#aaa;
      text-align:left;
      cursor:pointer
    }
    .smusic-album-track:hover,.smusic-album-track.active {
      background:#1b1b1d
    }
    .smusic-album-track-title {
      min-width:0
    }
    .smusic-album-track-title strong,.smusic-album-track-title small {
      display:block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .smusic-album-track-title strong {
      color:#fff;
      font-size:11px
    }
    .smusic-album-track-title small {
      margin-top:3px;
      color:#8f8f95;
      font-size:9px
    }
    .smusic-video-deck {
      position:fixed;
      z-index:70;
      right:16px;
      bottom:92px;
      width:240px;
      border:1px solid rgba(255,255,255,.14);
      border-radius:12px;
      overflow:hidden;
      background:#111;
      box-shadow:0 18px 45px rgba(0,0,0,.5);
      transition:width .2s ease
    }
    .smusic-video-deck.expanded {
      width:min(760px,calc(100vw - 32px))
    }
    .smusic-video-head {
      height:36px;
      display:flex;
      align-items:center;
      gap:8px;
      padding:0 9px;
      background:#18181b
    }
    .smusic-video-head strong {
      min-width:0;
      flex:1;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      font-size:9px
    }
    .smusic-video-btn {
      width:28px;
      height:28px;
      border:0;
      border-radius:7px;
      background:transparent;
      color:#bbb;
      display:grid;
      place-items:center;
      cursor:pointer
    }
    .smusic-video-btn:hover {
      background:#29292d;
      color:#fff
    }
    .smusic-video-stage {
      position:relative;
      width:100%;
      height:200px;
      background:#000
    }
    .smusic-video-deck.expanded .smusic-video-stage {
      height:auto;
      aspect-ratio:16/9
    }
    .smusic-player-bar {
      position:fixed;
      z-index:80;
      left:0;
      right:0;
      bottom:0;
      height:82px;
      border-top:1px solid rgba(255,255,255,.12);
      background:rgba(19,19,21,.98);
      backdrop-filter:blur(18px);
      display:grid;
      grid-template-columns:minmax(170px,1fr) auto minmax(170px,1fr);
      align-items:center;
      gap:14px;
      padding:8px 16px
    }
    .smusic-player-song {
      min-width:0;
      display:flex;
      align-items:center;
      gap:10px
    }
    .smusic-player-cover {
      width:54px;
      height:54px;
      flex:0 0 54px;
      border-radius:7px;
      overflow:hidden;
      display:grid;
      place-items:center;
      background:#2a2a2e
    }
    .smusic-player-cover img {
      width:100%;
      height:100%;
      object-fit:cover
    }
    .smusic-player-text {
      min-width:0
    }
    .smusic-player-text strong,.smusic-player-text small {
      display:block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .smusic-player-text strong {
      font-size:11px
    }
    .smusic-player-text small {
      margin-top:3px;
      color:#909096;
      font-size:9px
    }
    .smusic-player-controls {
      display:flex;
      align-items:center;
      justify-content:center;
      gap:12px
    }
    .smusic-control-btn {
      width:34px;
      height:34px;
      border:0;
      border-radius:999px;
      background:transparent;
      color:#b6b6bb;
      display:grid;
      place-items:center;
      cursor:pointer
    }
    .smusic-control-btn:hover {
      color:#fff
    }
    .smusic-control-btn.main {
      width:42px;
      height:42px;
      background:#fff;
      color:#09090a
    }
    .smusic-control-btn:disabled {
      opacity:.3;
      cursor:not-allowed
    }
    .smusic-player-extra {
      display:flex;
      justify-content:flex-end;
      gap:6px
    }
    .smusic-status {
      position:fixed;
      z-index:90;
      top:68px;
      right:14px;
      max-width:330px;
      border-radius:10px;
      background:#7f1d1d;
      padding:9px 11px;
      font-size:9px;
      color:#fff
    }
    .smusic-mobile-backdrop {
      display:none
    }
    @media(max-width:900px) {
      .smusic-sidebar {
        position:fixed;
        z-index:65;
        left:0;
        top:60px;
        bottom:82px;
        width:280px;
        transform:translateX(0);
        box-shadow:18px 0 40px rgba(0,0,0,.45)
      }
      .smusic-sidebar.closed {
        width:280px;
        transform:translateX(-105%)
      }
      .smusic-sidebar.closed .smusic-library-label,.smusic-sidebar.closed .smusic-side-text,.smusic-sidebar.closed .smusic-side-section-title {
        display:block
      }
      .smusic-mobile-backdrop {
        display:block;
        position:fixed;
        z-index:64;
        inset:60px 0 82px;
        background:rgba(0,0,0,.45);
        border:0
      }
      .smusic-center {
        padding:0 14px 34px
      }
      .smusic-artist-hero,.smusic-album-hero {
        margin:0 -14px
      }
      .smusic-search {
        width:min(280px,55vw)
      }
    }
    @media(max-width:640px) {
      .smusic-top {
        padding:0 8px
      }
      .smusic-brand {
        display:none
      }
      .smusic-search {
        width:auto;
        flex:1
      }
      .smusic-artist-hero {
        min-height:230px;
        padding:35px 16px 22px;
        gap:14px
      }
      .smusic-hero-avatar {
        width:92px;
        height:92px;
        flex-basis:92px
      }
      .smusic-hero-copy h1 {
        font-size:34px
      }
      .smusic-release-grid {
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:5px
      }
      .smusic-release-card {
        padding:4px
      }
      .smusic-release-name {
        font-size:9px
      }
      .smusic-release-meta {
        font-size:8px
      }
      .smusic-card-play {
        display:none
      }
      .smusic-section {
        padding-top:22px
      }
      .smusic-track-row {
        grid-template-columns:18px 38px minmax(0,1fr) auto
      }
      .smusic-track-cover {
        width:38px;
        height:38px
      }
      .smusic-track-duration {
        display:none
      }
      .smusic-track-views {
        font-size:8px
      }
      .smusic-album-hero {
        min-height:220px;
        padding:22px 14px;
        gap:14px
      }
      .smusic-album-cover {
        width:112px;
        height:112px;
        flex-basis:112px
      }
      .smusic-album-copy h1 {
        font-size:30px
      }
      .smusic-album-table-head,.smusic-album-track {
        grid-template-columns:30px minmax(0,1fr) 46px
      }
      .smusic-album-table-head span:nth-child(3),.smusic-album-track>span:nth-child(3) {
        display:none
      }
      .smusic-video-deck {
        right:8px;
        bottom:78px;
        width:208px
      }
      .smusic-video-stage {
        height:200px
      }
      .smusic-video-deck.expanded {
        right:8px;
        width:calc(100vw - 16px)
      }
      .smusic-video-deck.expanded .smusic-video-stage {
        height:auto
      }
      .smusic-player-bar {
        height:70px;
        grid-template-columns:minmax(0,1fr) auto;
        padding:7px 9px
      }
      .smusic-player-cover {
        width:46px;
        height:46px;
        flex-basis:46px
      }
      .smusic-player-controls {
        gap:4px
      }
      .smusic-player-controls .smusic-control-btn:first-child,.smusic-player-controls .smusic-control-btn:last-child {
        width:28px
      }
      .smusic-player-extra {
        display:none
      }
      .smusic-shell {
        padding-bottom:78px
      }
      .smusic-sidebar {
        bottom:70px
      }
      .smusic-mobile-backdrop {
        bottom:70px
      }
    }
      `}</style>

      <header className="smusic-top">
        <button type="button" className="smusic-round-btn" onClick={() => setSidebarOpen((value) => !value)}><MenuIcon /></button>
        <button type="button" className="smusic-round-btn" onClick={() => navigate(-1)}><BackIcon /></button>
        <div className="smusic-brand">Shadow Music</div>
        <div className="smusic-search"><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('musicPage.search')} /></div>
      </header>

      {sidebarOpen ? (
        <button
          type="button"
          className="smusic-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close library"
        />
      ) : null}

      <div className="smusic-layout">
        <aside className={`smusic-sidebar${sidebarOpen ? '' : ' closed'}`}>
          <div className="smusic-library-head"><LibraryIcon /><span className="smusic-library-label">{t('musicPage.library')}</span></div>
          <div className="smusic-side-section-title">{t('musicPage.artists')}</div>
          {filteredArtists.map((item) => (
            <button type="button" className={`smusic-side-item${item.id === selectedArtistId ? ' active' : ''}`} key={item.id} onClick={() => selectArtist(item.id)}>
              <span className="smusic-side-art artist">{item.avatar_url ? <img src={item.avatar_url} alt="" /> : <MusicIcon size={18} />}</span>
              <span className="smusic-side-text"><strong>{item.name}</strong><small>{t('musicPage.artist')}</small></span>
            </button>
          ))}
          {albums.length ? <div className="smusic-side-section-title">{t('musicPage.albums')}</div> : null}
          {filteredAlbums.map((release) => (
            <button type="button" className={`smusic-side-item${selectedAlbumId === release.id && viewMode === 'album' ? ' active' : ''}`} key={release.id} onClick={() => { openAlbum(release); if (window.innerWidth < 900) setSidebarOpen(false) }}>
              <span className="smusic-side-art">{release.cover_url ? <img src={release.cover_url} alt="" /> : <MusicIcon size={18} />}</span>
              <span className="smusic-side-text"><strong>{release.title}</strong><small>{t('musicPage.album')} • {artist?.name || ''}</small></span>
            </button>
          ))}
        </aside>

        <main ref={centerRef} className="smusic-center">
          {loadingArtists || loadingArtist ? <div className="smusic-empty" style={{ marginTop: 30 }}>{t('musicPage.loading')}</div> : !artists.length ? <div className="smusic-empty" style={{ marginTop: 30 }}>{t('musicPage.noArtists')}</div> : viewMode === 'home' ? renderHome() : viewMode === 'singles' ? renderAllReleases('singles') : viewMode === 'albums' ? renderAllReleases('albums') : renderAlbum()}
        </main>
      </div>

      {error ? <div className="smusic-status">{error}</div> : null}

      {currentEntry && currentVideoId ? (
        <div className={`smusic-video-deck${videoExpanded ? ' expanded' : ''}`}>
          <div className="smusic-video-head">
            <strong>{currentSong?.title}</strong>
            <button type="button" className="smusic-video-btn" onClick={() => setVideoExpanded((value) => !value)} title={videoExpanded ? t('musicPage.compactVideo') : t('musicPage.expandVideo')}><VideoIcon /></button>
            <button type="button" className="smusic-video-btn" onClick={stopPlayer} title={t('musicPage.closePlayer')}><CloseIcon /></button>
          </div>
          <div className="smusic-video-stage">
            <MusicYoutubePlayer
              ref={playerControlRef}
              key={`${currentSong.id}-${playerNonce}`}
              songId={currentSong.id}
              videoId={currentVideoId}
              title={currentSong.title}
              playNonce={playerNonce}
              onListenRecorded={handleListenRecorded}
              onAuthRequired={requireLogin}
              onEnded={() => { if (!playNext()) setPlayerState('ended') }}
              onPlaybackStateChange={setPlayerState}
            />
          </div>
        </div>
      ) : null}

      {currentEntry ? (
        <div className="smusic-player-bar">
          <div className="smusic-player-song">
            <div className="smusic-player-cover">{currentRelease?.cover_url ? <img src={currentRelease.cover_url} alt="" /> : <MusicIcon size={18} />}</div>
            <div className="smusic-player-text"><strong>{currentSong?.title}</strong><small>{currentArtist?.name || artist?.name || ''}</small></div>
          </div>
          <div className="smusic-player-controls">
            <button type="button" className="smusic-control-btn" onClick={playPrevious} title={t('musicPage.previous')}><PreviousIcon /></button>
            <button type="button" className="smusic-control-btn main" onClick={togglePlayback}>{playerState === 'playing' ? <PauseIcon size={18} /> : <PlayIcon size={18} />}</button>
            <button type="button" className="smusic-control-btn" disabled={queueIndex >= queue.length - 1} onClick={playNext} title={t('musicPage.next')}><NextIcon /></button>
          </div>
          <div className="smusic-player-extra"><button type="button" className="smusic-control-btn" onClick={() => setVideoExpanded((value) => !value)} title={videoExpanded ? t('musicPage.compactVideo') : t('musicPage.expandVideo')}><VideoIcon /></button></div>
        </div>
      ) : null}
    </div>
  )
}
