import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('musicPage', {
  en: {
    music: 'Music',
    artist: 'Artist',
    following: 'Following',
    follow: 'Follow',
    popular: 'Popular',
    popularHint: 'Only songs with 1K+ views',
    albumsSingles: 'Albums & Singles',
    seeAll: 'See all',
    album: 'Album',
    single: 'Single',
    nowPlaying: 'Now playing',
    search: 'Search music',
    back: 'Back',
  },
  km: {
    music: 'តន្ត្រី',
    artist: 'អ្នកចម្រៀង',
    following: 'កំពុងតាមដាន',
    follow: 'តាមដាន',
    popular: 'ពេញនិយម',
    popularHint: 'បង្ហាញតែបទដែលមាន View 1K ឡើង',
    albumsSingles: 'Album & Single',
    seeAll: 'មើលទាំងអស់',
    album: 'Album',
    single: 'Single',
    nowPlaying: 'កំពុងចាក់',
    search: 'ស្វែងរកតន្ត្រី',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    music: '音乐',
    artist: '歌手',
    following: '已关注',
    follow: '关注',
    popular: '热门',
    popularHint: '仅显示 1K+ 播放的歌曲',
    albumsSingles: '专辑与单曲',
    seeAll: '查看全部',
    album: '专辑',
    single: '单曲',
    nowPlaying: '正在播放',
    search: '搜索音乐',
    back: '返回',
  },
  ja: {
    music: '音楽',
    artist: 'アーティスト',
    following: 'フォロー中',
    follow: 'フォロー',
    popular: '人気',
    popularHint: '1K+ 再生の曲のみ表示',
    albumsSingles: 'アルバム & シングル',
    seeAll: 'すべて見る',
    album: 'アルバム',
    single: 'シングル',
    nowPlaying: '再生中',
    search: '音楽を検索',
    back: '戻る',
  },
  ko: {
    music: '음악',
    artist: '아티스트',
    following: '팔로잉',
    follow: '팔로우',
    popular: '인기곡',
    popularHint: '1K+ 조회수 곡만 표시',
    albumsSingles: '앨범 & 싱글',
    seeAll: '모두 보기',
    album: '앨범',
    single: '싱글',
    nowPlaying: '재생 중',
    search: '음악 검색',
    back: '뒤로',
  },
})

const ARTIST = {
  name: 'Skye Hart',
  subtitle: 'Shadow Music Artist',
  popular: [
    { id: 'last-light', title: 'The Last Light', views: 4200, duration: '4:22', tone: 'from-[#6f2d1d] to-[#190d0a]' },
    { id: 'miss-minute', title: 'I Miss You Every Minute', views: 2800, duration: '4:12', tone: 'from-[#243351] to-[#090c14]' },
    { id: 'fire-burns', title: 'Fire Burns', views: 1400, duration: '3:41', tone: 'from-[#9a3c0b] to-[#260b02]' },
    { id: 'quiet-song', title: 'Quiet Song Demo', views: 870, duration: '3:58', tone: 'from-[#34343a] to-[#111113]' },
  ],
  releases: [
    { id: 'be-strong', title: 'Be Strong', year: '2026', type: 'album', symbol: '♫', tone: 'from-[#345876] via-[#1d3347] to-[#090d12]' },
    { id: 'fire-burns', title: 'Fire Burns', year: '2026', type: 'single', symbol: '♨', tone: 'from-[#9e4313] via-[#642407] to-[#160704]' },
    { id: 'first-night-alone', title: 'The First Night Alone', year: '2026', type: 'single', symbol: '◐', tone: 'from-[#353a6b] via-[#1d2045] to-[#080912]' },
    { id: 'valentines-day', title: "Valentine's Day", year: '2026', type: 'single', symbol: '♡', tone: 'from-[#455563] via-[#25323d] to-[#0b0f12]' },
  ],
}

function PlayIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 5.2v13.6c0 .92 1.02 1.48 1.8.98l10.1-6.8a1.16 1.16 0 0 0 0-1.96L9.8 4.22C9.02 3.72 8 4.28 8 5.2Z" />
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

function formatViews(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  return String(value)
}

export default function MusicPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [following, setFollowing] = useState(true)
  const [playingTitle, setPlayingTitle] = useState('')
  const popularSongs = useMemo(() => ARTIST.popular.filter((song) => song.views >= 1000), [])

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24 text-white">
      <style>{`
        .shadow-music-release {
          transition: transform .24s ease, background-color .24s ease;
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
        @media (hover: hover) and (pointer: fine) {
          .shadow-music-release:hover {
            transform: translateY(-3px);
          }
          .shadow-music-release:hover .shadow-music-cover {
            filter: brightness(.78);
            box-shadow: 0 12px 28px rgba(0,0,0,.32);
          }
          .shadow-music-release:hover .shadow-music-play {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          .shadow-music-release:hover .shadow-music-play:hover {
            transform: translateY(0) scale(1.08);
          }
        }
        .shadow-music-release:focus-visible .shadow-music-play {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .shadow-music-release,
          .shadow-music-cover,
          .shadow-music-play {
            transition: none !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0b]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[58px] w-full max-w-[620px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition active:scale-95"
            aria-label={t('musicPage.back')}
          >
            <BackIcon />
          </button>

          <div className="text-[15px] font-extrabold tracking-tight">{t('musicPage.music')}</div>

          <button
            type="button"
            onClick={() => navigate('/discover/search')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition active:scale-95"
            aria-label={t('musicPage.search')}
          >
            <SearchIcon />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[620px] overflow-hidden">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#41221f] via-[#211412] to-[#0a0a0b] px-4 pb-6 pt-5 sm:px-5 sm:pt-7">
          <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/[0.045]" />
          <div className="absolute right-10 top-20 h-20 w-20 rounded-full bg-black/10" />

          <div className="relative flex items-end gap-4">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border border-white/25 bg-gradient-to-br from-[#55585a] to-[#17191a] text-white shadow-[0_12px_30px_rgba(0,0,0,0.34)] sm:h-[108px] sm:w-[108px]">
              <MusicIcon size={38} />
            </div>

            <div className="min-w-0 pb-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{t('musicPage.artist')}</div>
              <h1 className="mt-1 truncate text-[31px] font-black leading-none tracking-[-0.04em] sm:text-[42px]">{ARTIST.name}</h1>
              <div className="mt-2 text-[11px] font-medium text-white/55">{ARTIST.subtitle}</div>
            </div>
          </div>

          <div className="relative mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFollowing((value) => !value)}
              className="min-h-9 rounded-full border border-white/45 px-4 text-[12px] font-extrabold transition hover:border-white active:scale-95"
            >
              {following ? t('musicPage.following') : t('musicPage.follow')}
            </button>

            <button
              type="button"
              onClick={() => setPlayingTitle(popularSongs[0]?.title || '')}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] text-black shadow-lg transition hover:scale-[1.06] hover:bg-[#60a5fa] active:scale-95"
              aria-label={`${t('musicPage.nowPlaying')} ${ARTIST.name}`}
            >
              <PlayIcon size={20} />
            </button>
          </div>
        </section>

        <section className="px-4 pt-1 sm:px-5">
          <div className="mb-2 mt-3">
            <h2 className="text-[20px] font-black tracking-[-0.02em]">{t('musicPage.popular')}</h2>
            <p className="mt-1 text-[10px] font-medium text-white/50">{t('musicPage.popularHint')}</p>
          </div>

          <div className="mt-2">
            {popularSongs.map((song, index) => (
              <button
                type="button"
                key={song.id}
                onClick={() => setPlayingTitle(song.title)}
                className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-left transition hover:bg-white/[0.055] active:bg-white/[0.08]"
              >
                <span className="w-4 shrink-0 text-center text-[11px] font-medium text-white/55">{index + 1}</span>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${song.tone} text-white`}>
                  <MusicIcon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold leading-5">{song.title}</span>
                  <span className="block truncate text-[10px] text-white/50">{ARTIST.name}</span>
                </span>
                <span className="text-[10px] font-medium text-white/50">{formatViews(song.views)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 pb-7 pt-5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[20px] font-black tracking-[-0.02em]">{t('musicPage.albumsSingles')}</h2>
            <button type="button" className="shrink-0 text-[10px] font-bold text-white/55 transition hover:text-white">
              {t('musicPage.seeAll')}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-2.5 gap-y-4 sm:grid-cols-3 sm:gap-x-3">
            {ARTIST.releases.map((release) => (
              <button
                type="button"
                key={release.id}
                onClick={() => setPlayingTitle(release.title)}
                className="shadow-music-release min-w-0 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
              >
                <span className={`shadow-music-cover relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${release.tone}`}>
                  <span className="text-[47px] font-black text-white/90 drop-shadow-lg">{release.symbol}</span>
                  <span className="shadow-music-play absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#3b82f6] text-black shadow-[0_8px_18px_rgba(0,0,0,0.4)]">
                    <PlayIcon size={17} />
                  </span>
                </span>
                <span className="mt-2 block truncate text-[12px] font-extrabold leading-5">{release.title}</span>
                <span className="block text-[10px] text-white/50">
                  {release.year} • {t(`musicPage.${release.type}`)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {playingTitle ? (
          <div className="sticky bottom-3 z-30 mx-3 mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#202023]/95 px-3 py-2.5 shadow-2xl backdrop-blur-xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#47474f] to-[#151518]">
              <MusicIcon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">{t('musicPage.nowPlaying')}</div>
              <div className="truncate text-[12px] font-extrabold">{playingTitle}</div>
            </div>
            <button
              type="button"
              onClick={() => setPlayingTitle('')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"
              aria-label={t('musicPage.nowPlaying')}
            >
              <PlayIcon size={15} />
            </button>
          </div>
        ) : null}
      </main>
    </div>
  )
}
