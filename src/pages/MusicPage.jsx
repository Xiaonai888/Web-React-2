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

export default function MusicPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const playerRef = useRef(null)

  const [artists, setArtists] = useState([])
  const [selectedArtistId, setSelectedArtistId] = useState('')
  const [artistData, setArtistData] = useState(null)
  const [loadingArtists, setLoadingArtists] = useState(true)
  const [loadingArtist, setLoadingArtist] = useState(false)
  const [error, setError] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [followingByArtist, setFollowingByArtist] = useState({})
  const [showAllSingles, setShowAllSingles] = useState(false)
  const [showAllAlbums, setShowAllAlbums] = useState(false)
  const [selectedReleaseId, setSelectedReleaseId] = useState('')
  const [currentSong, setCurrentSong] = useState(null)
  const [playerNonce, setPlayerNonce] = useState(0)

  const loadArtists = async () => {
    setLoadingArtists(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/music/artists`, {
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('musicPage.loadFailed'))
      }

      const rows = Array.isArray(data.artists) ? data.artists : []
      setArtists(rows)
      setSelectedArtistId((current) => {
        if (current && rows.some((artist) => artist.id === current)) return current
        return rows[0]?.id || ''
      })
    } catch (requestError) {
      setError(requestError.message || t('musicPage.loadFailed'))
      setArtists([])
      setSelectedArtistId('')
      setArtistData(null)
    } finally {
      setLoadingArtists(false)
    }
  }

  useEffect(() => {
    loadArtists()
  }, [])

  useEffect(() => {
    if (!selectedArtistId) {
      setArtistData(null)
      setSelectedReleaseId('')
      setCurrentSong(null)
      return undefined
    }

    const controller = new AbortController()

    async function loadArtist() {
      setLoadingArtist(true)
      setError('')
      setShowAllSingles(false)
      setShowAllAlbums(false)
      setSelectedReleaseId('')
      setCurrentSong(null)

      try {
        const response = await fetch(
          `${API_URL}/api/music/artists/${encodeURIComponent(selectedArtistId)}`,
          {
            cache: 'no-store',
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || t('musicPage.loadFailed'))
        }

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

    return artists.filter((artist) =>
      String(artist.name || '').toLowerCase().includes(keyword)
    )
  }, [artists, query])

  const artist =
    artistData?.artist ||
    artists.find((item) => item.id === selectedArtistId) ||
    null

  const releases = Array.isArray(artistData?.releases)
    ? artistData.releases
    : []

  const singles = useMemo(
    () => releases.filter((release) => release.release_type === 'single'),
    [releases]
  )

  const albums = useMemo(
    () => releases.filter((release) => release.release_type === 'album'),
    [releases]
  )

  const allSongs = useMemo(
    () => releases.flatMap((release) => release.songs || []),
    [releases]
  )

  const releaseById = useMemo(
    () => new Map(releases.map((release) => [release.id, release])),
    [releases]
  )

  const popularSongs = useMemo(
    () =>
      [...allSongs]
        .sort(
          (a, b) =>
            Number(b.view_count || 0) -
            Number(a.view_count || 0)
        )
        .slice(0, 10),
    [allSongs]
  )

  const visibleSingles = showAllSingles ? singles : singles.slice(0, 6)
  const visibleAlbums = showAllAlbums ? albums : albums.slice(0, 6)

  const selectedRelease =
    releases.find((release) => release.id === selectedReleaseId) ||
    null

  const isFollowing = Boolean(
    artist?.id && followingByArtist[artist.id]
  )

  const currentVideoId = getYoutubeVideoId(currentSong)
  const currentSongRelease = currentSong
    ? releaseById.get(currentSong.release_id) || null
    : null

  function requireLogin() {
    setCurrentSong(null)
    navigate('/login', {
      state: {
        returnTo: '/music',
      },
    })
  }

  function selectArtist(artistId) {
    setSelectedArtistId(artistId)
    setSearchOpen(false)
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleFollow() {
    if (!artist?.id) return

    setFollowingByArtist((current) => ({
      ...current,
      [artist.id]: !current[artist.id],
    }))
  }

  function playSong(song) {
    if (!getYoutubeVideoId(song)) return

    if (!getReaderToken()) {
      requireLogin()
      return
    }

    setCurrentSong(song)
    setPlayerNonce((value) => value + 1)

    window.setTimeout(() => {
      playerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 60)
  }

  function playArtist() {
    const first = popularSongs[0] || allSongs[0] || null
    if (first) playSong(first)
  }

  function openRelease(release) {
    setSelectedReleaseId((current) =>
      current === release.id ? '' : release.id
    )
  }

  function handleListenRecorded({ songId, viewCount }) {
    setArtistData((current) => {
      if (!current) return current

      return {
        ...current,
        releases: (current.releases || []).map((release) => ({
          ...release,
          songs: (release.songs || []).map((song) =>
            song.id === songId
              ? {
                  ...song,
                  view_count: viewCount,
                }
              : song
          ),
        })),
      }
    })

    setCurrentSong((current) =>
      current?.id === songId
        ? {
            ...current,
            view_count: viewCount,
          }
        : current
    )
  }

  function renderReleaseGrid(items, visibleItems, showAll, setShowAll, titleKey, emptyKey, toneOffset = 0) {
    return (
      <section className="px-4 pt-6 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[20px] font-black tracking-[-0.02em]">
            {t(`musicPage.${titleKey}`)}
          </h2>

          {items.length > 6 ? (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="shrink-0 text-[10px] font-bold text-white/55 transition hover:text-white"
            >
              {showAll
                ? t('musicPage.showLess')
                : t('musicPage.seeAll')}
            </button>
          ) : null}
        </div>

        {visibleItems.length ? (
          <div className="mt-3 grid grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 sm:gap-x-3">
            {visibleItems.map((release, index) => {
              const firstSong = release.songs?.[0] || null
              const tone = COVER_TONES[(index + toneOffset) % COVER_TONES.length]

              return (
                <article
                  key={release.id}
                  className="shadow-music-release min-w-0 rounded-xl"
                >
                  <div
                    className={`shadow-music-cover relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br ${tone}`}
                  >
                    <button
                      type="button"
                      onClick={() => openRelease(release)}
                      className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
                      aria-label={`${release.title} ${t('musicPage.tracks')}`}
                    >
                      {release.cover_url ? (
                        <img
                          src={release.cover_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MusicIcon size={42} />
                      )}
                    </button>

                    {firstSong ? (
                      <button
                        type="button"
                        onClick={() => playSong(firstSong)}
                        className="shadow-music-play absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#3b82f6] text-black shadow-[0_8px_18px_rgba(0,0,0,0.42)]"
                        aria-label={`${t('musicPage.play')} ${release.title}`}
                      >
                        <PlayIcon size={17} />
                      </button>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => openRelease(release)}
                    className="mt-2 block w-full min-w-0 text-left"
                  >
                    <span className="block truncate text-[12px] font-extrabold leading-5">
                      {release.title}
                    </span>
                    <span className="block text-[10px] text-white/50">
                      {release.release_year || ''}
                      {release.release_year ? ' • ' : ''}
                      {t(
                        `musicPage.${
                          release.release_type === 'album'
                            ? 'album'
                            : 'single'
                        }`
                      )}
                    </span>
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-6 text-center text-[10px] font-semibold text-white/40">
            {t(`musicPage.${emptyKey}`)}
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090a] pb-28 text-white">
      <style>{`
        .shadow-music-release {
          transition: transform .24s ease;
        }
        .shadow-music-cover {
          transition: transform .26s ease, filter .26s ease, box-shadow .26s ease;
        }
        .shadow-music-play {
          opacity: 0;
          transform: translateY(9px) scale(.9);
          transition: opacity .22s ease, transform .22s ease, background-color .22s ease;
          pointer-events: none;
        }
        .shadow-music-artist-card {
          transition: transform .2s ease, background-color .2s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .shadow-music-release:hover {
            transform: translateY(-3px);
          }
          .shadow-music-release:hover .shadow-music-cover {
            filter: brightness(.75);
            box-shadow: 0 12px 28px rgba(0,0,0,.34);
          }
          .shadow-music-release:hover .shadow-music-play {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          .shadow-music-release:hover .shadow-music-play:hover {
            transform: translateY(0) scale(1.08);
            background: #60a5fa;
          }
          .shadow-music-artist-card:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,.06);
          }
        }
        .shadow-music-release:focus-within .shadow-music-play {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        @media (hover: none), (pointer: coarse) {
          .shadow-music-play {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .shadow-music-release,
          .shadow-music-cover,
          .shadow-music-play,
          .shadow-music-artist-card {
            transition: none !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090a]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] w-full max-w-[620px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition active:scale-95"
            aria-label={t('musicPage.back')}
          >
            <BackIcon />
          </button>

          <div className="text-[15px] font-extrabold tracking-tight">
            {t('musicPage.music')}
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition active:scale-95"
            aria-label={t('musicPage.search')}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>

        {searchOpen ? (
          <div className="mx-auto w-full max-w-[620px] px-4 pb-3">
            <div className="flex h-10 items-center gap-2 rounded-xl bg-white/[0.08] px-3">
              <SearchIcon />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('musicPage.search')}
                className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-white/35"
              />
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-[620px] overflow-hidden">
        {loadingArtists ? (
          <div className="px-4 py-14 text-center text-[12px] font-semibold text-white/50">
            {t('musicPage.loading')}
          </div>
        ) : error && !artist ? (
          <div className="px-4 py-14 text-center">
            <div className="text-[12px] font-semibold text-white/55">
              {error}
            </div>
            <button
              type="button"
              onClick={loadArtists}
              className="mt-4 rounded-full bg-white px-4 py-2 text-[11px] font-extrabold text-black"
            >
              {t('musicPage.retry')}
            </button>
          </div>
        ) : !artists.length ? (
          <div className="px-4 py-14 text-center text-[12px] font-semibold text-white/50">
            {t('musicPage.noArtists')}
          </div>
        ) : (
          <>
            <section className="px-4 pb-4 pt-4 sm:px-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-black tracking-[-0.02em]">
                  {t('musicPage.artists')}
                </h2>
                <span className="text-[10px] font-semibold text-white/40">
                  {filteredArtists.length}
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filteredArtists.map((item) => {
                  const active = item.id === selectedArtistId

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => selectArtist(item.id)}
                      className={`shadow-music-artist-card w-[82px] shrink-0 rounded-xl p-2 text-center outline-none ${
                        active
                          ? 'bg-white/[0.09] ring-1 ring-white/15'
                          : 'bg-transparent'
                      }`}
                    >
                      <span className="mx-auto flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#565c61] to-[#17191a] text-white shadow-lg">
                        {item.avatar_url ? (
                          <img
                            src={item.avatar_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MusicIcon size={24} />
                        )}
                      </span>
                      <span className="mt-2 block truncate text-[10px] font-extrabold">
                        {item.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {loadingArtist ? (
              <div className="px-4 py-12 text-center text-[12px] font-semibold text-white/50">
                {t('musicPage.loading')}
              </div>
            ) : artist ? (
              <>
                <section
                  className="relative overflow-hidden px-4 pb-6 pt-5 sm:px-5 sm:pt-7"
                  style={
                    artist.banner_url
                      ? {
                          backgroundImage: `linear-gradient(to bottom, rgba(12,12,13,.18), rgba(9,9,10,.92)), url(${artist.banner_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {
                          background:
                            'linear-gradient(to bottom, #41221f, #211412 62%, #09090a)',
                        }
                  }
                >
                  <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/[0.045]" />

                  <div className="relative flex items-end gap-4">
                    <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-gradient-to-br from-[#55585a] to-[#17191a] text-white shadow-[0_12px_30px_rgba(0,0,0,0.34)] sm:h-[108px] sm:w-[108px]">
                      {artist.avatar_url ? (
                        <img
                          src={artist.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MusicIcon size={38} />
                      )}
                    </div>

                    <div className="min-w-0 pb-1">
                      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                        {t('musicPage.artist')}
                      </div>
                      <h1 className="mt-1 truncate text-[31px] font-black leading-none tracking-[-0.04em] sm:text-[42px]">
                        {artist.name}
                      </h1>
                      <div className="mt-2 flex items-baseline gap-1.5 text-white/70">
                        <span className="text-[12px] font-extrabold text-white/90">
                          {formatListeners(artist.total_listeners)}
                        </span>
                        <span className="text-[10px] font-medium">
                          {t('musicPage.totalListeners')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={toggleFollow}
                      className="min-h-9 rounded-full border border-white/45 px-4 text-[12px] font-extrabold transition hover:border-white active:scale-95"
                    >
                      {isFollowing
                        ? t('musicPage.following')
                        : t('musicPage.follow')}
                    </button>

                    <button
                      type="button"
                      onClick={playArtist}
                      disabled={!allSongs.length}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] text-black shadow-lg transition hover:scale-[1.06] hover:bg-[#60a5fa] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`${t('musicPage.play')} ${artist.name}`}
                    >
                      <PlayIcon size={20} />
                    </button>
                  </div>
                </section>

                {currentSong && currentVideoId ? (
                  <section ref={playerRef} className="px-4 pt-4 sm:px-5">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111113] shadow-2xl">
                      <div className="relative aspect-video w-full bg-black">
                        <MusicYoutubePlayer
                          key={`${currentSong.id}-${playerNonce}`}
                          songId={currentSong.id}
                          videoId={currentVideoId}
                          title={
                            currentSong.title ||
                            t('musicPage.nowPlaying')
                          }
                          playNonce={playerNonce}
                          onListenRecorded={handleListenRecorded}
                          onAuthRequired={requireLogin}
                        />
                      </div>

                      <div className="flex items-center gap-3 px-3 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.08]">
                          {currentSongRelease?.cover_url ? (
                            <img
                              src={currentSongRelease.cover_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MusicIcon size={17} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/40">
                            {t('musicPage.nowPlaying')}
                          </div>
                          <div className="mt-0.5 truncate text-[12px] font-extrabold">
                            {currentSong.title}
                          </div>
                          <div className="mt-0.5 text-[9px] font-medium text-white/40">
                            {formatViews(currentSong.view_count)}{' '}
                            {t('musicPage.views')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentSong(null)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                          aria-label={t('musicPage.close')}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="px-4 pt-5 sm:px-5">
                  <div className="mb-2">
                    <h2 className="text-[20px] font-black tracking-[-0.02em]">
                      {t('musicPage.popular')}
                    </h2>
                    <p className="mt-1 text-[10px] font-medium text-white/50">
                      {t('musicPage.popularHint')}
                    </p>
                  </div>

                  <div className="mt-2">
                    {popularSongs.length ? (
                      popularSongs.map((song, index) => {
                        const songRelease =
                          releaseById.get(song.release_id) || null

                        return (
                          <button
                            type="button"
                            key={song.id}
                            onClick={() => playSong(song)}
                            className="group flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left transition hover:bg-white/[0.055] active:bg-white/[0.08]"
                          >
                            <span className="w-4 shrink-0 text-center text-[11px] font-medium text-white/55">
                              {index + 1}
                            </span>

                            <span
                              className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br ${
                                COVER_TONES[index % COVER_TONES.length]
                              } text-white`}
                            >
                              {songRelease?.cover_url ? (
                                <img
                                  src={songRelease.cover_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <MusicIcon size={16} />
                              )}
                              <span className="absolute inset-0 hidden items-center justify-center bg-black/45 group-hover:flex">
                                <PlayIcon size={14} />
                              </span>
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12px] font-extrabold leading-5">
                                {song.title}
                              </span>
                              <span className="block truncate text-[10px] text-white/50">
                                {artist.name}
                              </span>
                            </span>

                            <span className="flex shrink-0 items-center gap-2 text-[10px] font-medium text-white/50">
                              <span>
                                {formatViews(song.view_count)}
                              </span>
                              {durationText(song.duration_seconds) ? (
                                <span className="hidden sm:inline">
                                  {durationText(song.duration_seconds)}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        )
                      })
                    ) : (
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-5 text-center text-[10px] font-semibold text-white/40">
                        {t('musicPage.noPopular')}
                      </div>
                    )}
                  </div>
                </section>

                {renderReleaseGrid(
                  singles,
                  visibleSingles,
                  showAllSingles,
                  setShowAllSingles,
                  'singles',
                  'noSingles',
                  0
                )}

                {renderReleaseGrid(
                  albums,
                  visibleAlbums,
                  showAllAlbums,
                  setShowAllAlbums,
                  'albums',
                  'noAlbums',
                  2
                )}

                {selectedRelease ? (
                  <section className="px-4 pb-7 pt-5 sm:px-5">
                    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">
                      <div className="flex items-center gap-3 border-b border-white/[0.07] p-3">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${
                            COVER_TONES[
                              Math.max(
                                0,
                                releases.findIndex(
                                  (release) =>
                                    release.id === selectedRelease.id
                                )
                              ) % COVER_TONES.length
                            ]
                          }`}
                        >
                          {selectedRelease.cover_url ? (
                            <img
                              src={selectedRelease.cover_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MusicIcon size={22} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-black">
                            {selectedRelease.title}
                          </div>
                          <div className="mt-1 text-[10px] text-white/45">
                            {selectedRelease.release_type === 'album'
                              ? t('musicPage.album')
                              : t('musicPage.single')}{' '}
                            • {selectedRelease.songs?.length || 0}{' '}
                            {t('musicPage.tracks')}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedReleaseId('')}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
                          aria-label={t('musicPage.close')}
                        >
                          <CloseIcon />
                        </button>
                      </div>

                      <div className="p-1.5">
                        {selectedRelease.songs?.length ? (
                          selectedRelease.songs.map((song, index) => (
                            <button
                              type="button"
                              key={song.id}
                              onClick={() => playSong(song)}
                              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/[0.055] active:bg-white/[0.08]"
                            >
                              <span className="w-5 text-center text-[10px] text-white/40">
                                {song.track_number || index + 1}
                              </span>

                              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.07]">
                                {selectedRelease.cover_url ? (
                                  <img
                                    src={selectedRelease.cover_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <PlayIcon size={13} />
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[11px] font-extrabold">
                                  {song.title}
                                </span>
                                <span className="mt-0.5 block text-[9px] text-white/40">
                                  {formatViews(song.view_count)}{' '}
                                  {t('musicPage.views')}
                                </span>
                              </span>

                              {durationText(song.duration_seconds) ? (
                                <span className="text-[9px] text-white/40">
                                  {durationText(song.duration_seconds)}
                                </span>
                              ) : null}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-6 text-center text-[10px] font-semibold text-white/40">
                            {t('musicPage.noTracks')}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="pb-7" />
                )}
              </>
            ) : null}
          </>
        )}
      </main>

      {currentSong && currentVideoId ? (
        <div className="fixed bottom-3 left-1/2 z-40 flex w-[calc(100%-24px)] max-w-[596px] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#202023]/95 px-3 py-2.5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() =>
              playerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#46464d] to-[#151518]"
          >
            {currentSongRelease?.cover_url ? (
              <img
                src={currentSongRelease.cover_url}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <PauseIcon size={16} />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              playerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              })
            }
            className="min-w-0 flex-1 text-left"
          >
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
              {t('musicPage.nowPlaying')}
            </div>
            <div className="truncate text-[12px] font-extrabold">
              {currentSong.title}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentSong(null)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-label={t('musicPage.close')}
          >
            <CloseIcon />
          </button>
        </div>
      ) : null}
    </div>
  )
}
