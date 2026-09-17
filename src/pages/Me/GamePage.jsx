import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('gamePage', {
  en: {
    back: 'Back',
    game: 'Game',
    spin: 'Spin',
    test: 'Test',
    open: 'Open',
    disabled: 'Disabled',
    comingSoon: 'Coming soon',
    loading: 'Loading games...',
    noGames: 'No games available.',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    game: 'ហ្គេម',
    spin: 'បង្វិល',
    test: 'សាកល្បង',
    open: 'បើក',
    disabled: 'បានបិទ',
    comingSoon: 'មកដល់ឆាប់ៗ',
    loading: 'កំពុងផ្ទុកហ្គេម...',
    noGames: 'មិនមានហ្គេមសម្រាប់បង្ហាញទេ។',
  },
  zh: {
    back: '返回',
    game: '游戏',
    spin: '转盘',
    test: '测试',
    open: '打开',
    disabled: '已停用',
    comingSoon: '即将推出',
    loading: '正在加载游戏...',
    noGames: '暂无可用游戏。',
  },
  ja: {
    back: '戻る',
    game: 'ゲーム',
    spin: 'スピン',
    test: 'テスト',
    open: '開く',
    disabled: '無効',
    comingSoon: '近日公開',
    loading: 'ゲームを読み込み中...',
    noGames: '利用できるゲームはありません。',
  },
  ko: {
    back: '뒤로 가기',
    game: '게임',
    spin: '스핀',
    test: '테스트',
    open: '열기',
    disabled: '비활성화됨',
    comingSoon: '출시 예정',
    loading: '게임 불러오는 중...',
    noGames: '사용 가능한 게임이 없습니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const gameMeta = {
  spin: {
    defaultName: 'Spin',
    nameKey: 'spin',
    icon: 'fa-solid fa-dharmachakra',
    path: '/game/spin',
  },
  test: {
    defaultName: 'Test',
    nameKey: 'test',
    icon: 'fa-solid fa-flask',
    path: '',
  },
}

function mergeGame(game) {
  const meta = gameMeta[game.gameKey] || {}

  return {
    gameKey: game.gameKey,
    name: String(
      game.name ||
      meta.defaultName ||
      game.gameKey ||
      ''
    ).trim(),
    profile: game.profile || null,
    hidden: Boolean(game.hidden),
    disabled: Boolean(game.disabled),
    defaultName: meta.defaultName || '',
    nameKey: meta.nameKey || '',
    icon: meta.icon || 'fa-solid fa-gamepad',
    path: meta.path || '',
  }
}

export default function GamePage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadGames() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/games`,
          {
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load games')
        }

        const data = await response.json()

        if (!Array.isArray(data?.games)) {
          throw new Error('Invalid game response')
        }

        setGames(
          data.games
            .filter((game) => !game.hidden)
            .map(mergeGame)
        )
      } catch (error) {
        if (error.name === 'AbortError') return

        console.error('LOAD GAMES ERROR:', error)
        setGames([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadGames()

    return () => controller.abort()
  }, [])

  function getDisplayName(game) {
    if (
      game.nameKey &&
      (!game.name || game.name === game.defaultName)
    ) {
      return t(`gamePage.${game.nameKey}`)
    }

    return game.name || game.gameKey
  }

  function getStatusKey(game) {
    if (!game.path) return 'gamePage.comingSoon'
    if (game.disabled) return 'gamePage.disabled'
    return 'gamePage.open'
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-20 border-b border-[#eeeeee] bg-white dark:border-white/10 dark:bg-[#171923]">
        <div className="mx-auto grid h-14 max-w-5xl grid-cols-[40px_1fr_40px] items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95 dark:text-white"
            aria-label={t('gamePage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-center text-[16px] font-semibold text-[#111827] dark:text-white">
            {t('gamePage.game')}
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        {loading ? (
          <div className="py-10 text-center text-[13px] text-[#9aa1ad] dark:text-white/45">
            {t('gamePage.loading')}
          </div>
        ) : games.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[#9aa1ad] dark:text-white/45">
            {t('gamePage.noGames')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
            {games.map((game) => {
              const displayName = getDisplayName(game)
              const cannotOpen = game.disabled || !game.path
              const status = t(getStatusKey(game))

              return (
                <button
                  type="button"
                  key={game.gameKey}
                  onClick={() => {
                    if (!cannotOpen) {
                      navigate(game.path)
                    }
                  }}
                  disabled={cannotOpen}
                  className="group relative aspect-square overflow-hidden rounded-[18px] bg-[#f1f2f5] text-left shadow-sm ring-1 ring-black/[0.06] transition active:scale-[0.98] disabled:cursor-default disabled:active:scale-100 dark:bg-[#171923] dark:ring-white/10"
                  aria-label={`${displayName} - ${status}`}
                >
                  {game.profile ? (
                    <img
                      src={game.profile}
                      alt={displayName}
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 h-full w-full object-cover transition duration-300 ${
                        cannotOpen
                          ? 'scale-100 opacity-85'
                          : 'group-hover:scale-[1.02]'
                      }`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#374151] dark:text-white/85">
                      <i
                        className={`${game.icon} text-[42px] sm:text-[48px]`}
                      />
                    </div>
                  )}

                  {game.profile ? (
                    <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                  ) : (
                    <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/10 to-transparent dark:from-black/35" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                    <div
                      className={`truncate text-[14px] font-semibold sm:text-[15px] ${
                        game.profile
                          ? 'text-white'
                          : 'text-[#111827] dark:text-white'
                      }`}
                    >
                      {displayName}
                    </div>

                    <div
                      className={`mt-1 text-[10px] font-medium sm:text-[11px] ${
                        game.profile
                          ? 'text-white/75'
                          : 'text-[#8b93a1] dark:text-white/50'
                      }`}
                    >
                      {status}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
