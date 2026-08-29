import { Link } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('settingsPage', {
  en: {
    backToMe: 'Back to Me',
    settings: 'Settings',
    comingSoon: 'Coming Soon',
    description: 'This page is connected and ready. You can continue building it later without breaking the Me page flow.',
  },
  km: {
    backToMe: 'ត្រឡប់ទៅ Me',
    settings: 'ការកំណត់',
    comingSoon: 'មកដល់ឆាប់ៗ',
    description: 'ទំព័រនេះបានភ្ជាប់ និងត្រៀមរួចហើយ។ អ្នកអាចបន្តបង្កើតវានៅពេលក្រោយ ដោយមិនប៉ះពាល់ដល់ដំណើរការ Me page។',
  },
  zh: {
    backToMe: '返回 Me',
    settings: '设置',
    comingSoon: '即将推出',
    description: '此页面已连接并准备就绪。你可以稍后继续完善，而不会影响 Me 页面流程。',
  },
  ja: {
    backToMe: 'Me に戻る',
    settings: '設定',
    comingSoon: '近日公開',
    description: 'このページは接続済みで準備できています。Me ページの動作を壊さず、後から引き続き作成できます。',
  },
  ko: {
    backToMe: 'Me로 돌아가기',
    settings: '설정',
    comingSoon: '출시 예정',
    description: '이 페이지는 연결되어 준비가 완료되었습니다. Me 페이지 흐름에 영향을 주지 않고 나중에 계속 만들 수 있습니다.',
  },
})

export default function SettingsPage() {
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <header className="sticky top-0 z-[60] border-b border-[#f2f2f4] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/me"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#111] transition hover:bg-black/5"
              aria-label={t('settingsPage.backToMe')}
            >
              <i className="fas fa-chevron-left text-[14px]" />
            </Link>
            <h1 className="text-[20px] font-black tracking-tight text-[#111]">
              {t('settingsPage.settings')}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-5 lg:px-6">
        <div className="mx-auto max-w-xl rounded-[32px] border border-[#efefef] bg-white px-6 py-12 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f7f8] text-[34px]">⚙️</div>
          <h2 className="mt-5 text-[28px] font-black tracking-tight text-[#111]">
            {t('settingsPage.comingSoon')}
          </h2>
          <p className="mt-3 text-[14px] leading-7 text-[#8b8b95]">
            {t('settingsPage.description')}
          </p>
          <div className="mt-6">
            <Link
              to="/me"
              className="inline-flex items-center gap-2 rounded-full bg-[#111] px-5 py-3 text-[13px] font-bold text-white transition hover:bg-[#222]"
            >
              {t('settingsPage.backToMe')}
              <i className="fas fa-arrow-right text-[11px]" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
