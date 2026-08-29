import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('gamePage', {
  en: {
    back: 'Back',
    game: 'Game',
    spin: 'Spin',
    test: 'Test',
    comingSoon: 'Coming soon',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    game: 'ហ្គេម',
    spin: 'បង្វិល',
    test: 'សាកល្បង',
    comingSoon: 'មកដល់ឆាប់ៗ',
  },
  zh: {
    back: '返回',
    game: '游戏',
    spin: '转盘',
    test: '测试',
    comingSoon: '即将推出',
  },
  ja: {
    back: '戻る',
    game: 'ゲーム',
    spin: 'スピン',
    test: 'テスト',
    comingSoon: '近日公開',
  },
  ko: {
    back: '뒤로 가기',
    game: '게임',
    spin: '스핀',
    test: '테스트',
    comingSoon: '출시 예정',
  },
})

const games = [
  {
    id: 'spin',
    nameKey: 'spin',
    icon: 'fa-solid fa-dharmachakra',
  },
  {
    id: 'test',
    nameKey: 'test',
    icon: 'fa-solid fa-flask',
  },
]

export default function GamePage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()

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
        <div className="grid grid-cols-2 gap-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="aspect-square rounded-[14px] bg-white p-4 ring-1 ring-black/[0.04] dark:bg-[#171923] dark:ring-white/10"
            >
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-[#f5f5f7] text-[#111827] dark:bg-white/10 dark:text-white">
                  <i className={`${game.icon} text-[20px]`} />
                </div>

                <div className="mt-3 text-[14px] font-semibold text-[#111827] dark:text-white">
                  {t(`gamePage.${game.nameKey}`)}
                </div>

                <div className="mt-1 text-[11px] font-normal text-[#9aa1ad] dark:text-white/45">
                  {t('gamePage.comingSoon')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
