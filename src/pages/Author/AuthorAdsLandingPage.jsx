import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronLeft, ChevronRight, ImagePlus, Sparkles, TrendingUp } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorAdsLanding', {
  en: {
    boostContent: 'Boost Content',
    boostContentHint: 'Promote your Story, PDF, Physical Book, or Post.',
    createNewAd: 'Create New Ad',
    createNewAdHint: 'Create an ad with a square image and text.',
    smartBoost: 'Smart Boost',
    smartBoostHint: 'Set a budget and let Shadow optimize delivery for you.',
    comingSoon: 'Coming Soon',
    back: 'Back',
  },
  km: {
    boostContent: 'Boost Content',
    boostContentHint: 'ផ្សព្វផ្សាយ Story, PDF, សៀវភៅក្រដាស ឬ Post។',
    createNewAd: 'Create New Ad',
    createNewAdHint: 'បង្កើត Ad ដោយប្រើរូបភាពការ៉េ និងអត្ថបទ។',
    smartBoost: 'Smart Boost',
    smartBoostHint: 'កំណត់ថវិកា ហើយឱ្យ Shadow ជួយបង្កើនប្រសិទ្ធភាពការផ្សាយ។',
    comingSoon: 'ឆាប់ៗនេះ',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    boostContent: '推广内容',
    boostContentHint: '推广故事、PDF、纸质书或帖子。',
    createNewAd: '创建新广告',
    createNewAdHint: '使用方形图片和文字创建广告。',
    smartBoost: '智能推广',
    smartBoostHint: '设置预算，让 Shadow 优化广告投放。',
    comingSoon: '即将推出',
    back: '返回',
  },
  ja: {
    boostContent: 'コンテンツを宣伝',
    boostContentHint: 'ストーリー、PDF、紙の本、投稿を宣伝します。',
    createNewAd: '新しい広告を作成',
    createNewAdHint: '正方形の画像とテキストで広告を作成します。',
    smartBoost: 'スマートブースト',
    smartBoostHint: '予算を設定し、Shadow が配信を最適化します。',
    comingSoon: '近日公開',
    back: '戻る',
  },
  ko: {
    boostContent: '콘텐츠 홍보',
    boostContentHint: '스토리, PDF, 종이책 또는 게시물을 홍보하세요.',
    createNewAd: '새 광고 만들기',
    createNewAdHint: '정사각형 이미지와 텍스트로 광고를 만드세요.',
    smartBoost: '스마트 부스트',
    smartBoostHint: '예산을 정하고 Shadow가 광고 노출을 최적화하게 하세요.',
    comingSoon: '출시 예정',
    back: '뒤로',
  },
})

const ACCENT = '#6335d7'

function LandingCard({ icon: Icon, title, description, onClick, disabled = false, badge, variant }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-4 rounded-[22px] border border-[#f0edf5] bg-white px-3.5 py-5 text-left shadow-[0_5px_18px_rgba(30,20,50,0.04)] transition-transform active:scale-[0.99] disabled:cursor-default disabled:active:scale-100 sm:gap-5 sm:px-5"
    >
      <span className="relative flex h-[65px] w-[65px] shrink-0 items-center justify-center rounded-full bg-[#f2ecff] sm:h-[76px] sm:w-[76px]">
        <Icon size={34} strokeWidth={1.9} color={ACCENT} aria-hidden="true" />
        <Sparkles aria-hidden="true" size={15} fill="#ffd43f" color="#ffbe20" className={`absolute ${variant === 'bottom' ? '-bottom-1 right-1' : '-top-1 right-0'}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-bold leading-5 text-[#171321] sm:text-[15px]">{title}</span>
          {badge && <span className="rounded-full bg-[#ffe8a0] px-2 py-0.5 text-[10px] font-semibold text-[#423000]">{badge}</span>}
        </span>
        <span className="mt-1.5 block text-[11px] leading-[17px] text-[#88839b] sm:text-[12px]">{description}</span>
      </span>
      <ChevronRight size={19} strokeWidth={2} className="shrink-0 text-[#9b94ad]" aria-hidden="true" />
    </button>
  )
}

export default function AuthorAdsLandingPage() {
  useAuthorPageFooterVisibility(true)
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = key => t(`authorAdsLanding.${key}`)

  return (
    <main className="min-h-[100dvh] bg-white pb-[calc(88px+env(safe-area-inset-bottom))] text-[#171321]">
      <div className="mx-auto max-w-2xl px-3.5 pt-2 sm:px-6">
        <header className="mb-5 flex min-h-12 items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            aria-label={tr('back')}
            className="flex h-10 w-9 shrink-0 items-center justify-center rounded-full text-[#171321] active:bg-[#f5f4f7]"
          >
            <ChevronLeft size={23} strokeWidth={2.1} />
          </button>
          <h1 className="text-[18px] font-bold leading-6 tracking-normal text-[#171321]">Shadow Ads</h1>
        </header>

        <section className="space-y-3" aria-label="Shadow Ads">
          <LandingCard
            icon={BookOpen}
            title={tr('boostContent')}
            description={tr('boostContentHint')}
            onClick={() => navigate('/author/page/ads/boost-content')}
          />
          <LandingCard
            icon={ImagePlus}
            title={tr('createNewAd')}
            description={tr('createNewAdHint')}
            onClick={() => navigate('/author/page/ads/boost-post?mode=create')}
            variant="bottom"
          />
          <LandingCard
            icon={TrendingUp}
            title={tr('smartBoost')}
            description={tr('smartBoostHint')}
            badge={tr('comingSoon')}
            disabled
          />
        </section>
      </div>
    </main>
  )
}
