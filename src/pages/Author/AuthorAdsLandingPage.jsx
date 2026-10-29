import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, ChevronRight, ImagePlus, Sparkles, TrendingUp, X } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorAdsLanding', {
  en: {
    boostContent: 'Boost Content',
    boostContentHint: 'Promote your Story, PDF, Physical Book, or Post.',
    createNewAd: 'Create New Ad',
    createNewAdHint: 'Create an ad from scratch using an image and text.',
    smartBoost: 'Smart Boost',
    smartBoostHint: 'Set a budget and let Shadow optimize delivery for you.',
    comingSoon: 'Coming Soon',
    editorPending: 'The new ad editor will be available in a later update. You can boost published content now.',
    close: 'Close',
    back: 'Back',
  },
  km: {
    boostContent: 'Boost Content',
    boostContentHint: 'ផ្សព្វផ្សាយ Story, PDF, សៀវភៅក្រដាស ឬ Post។',
    createNewAd: 'Create New Ad',
    createNewAdHint: 'បង្កើតពាណិជ្ជកម្មថ្មីពីរូបភាព និងអត្ថបទ។',
    smartBoost: 'Smart Boost',
    smartBoostHint: 'កំណត់ថវិកា ហើយឱ្យ Shadow ជួយបង្កើនប្រសិទ្ធភាពការផ្សាយ។',
    comingSoon: 'ឆាប់ៗនេះ',
    editorPending: 'មុខងារបង្កើត Ad ថ្មីនឹងភ្ជាប់នៅពេលក្រោយ។ ឥឡូវនេះអ្នកអាច Boost មាតិកាដែលបានបង្ហោះរួច។',
    close: 'បិទ',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    boostContent: '推广内容',
    boostContentHint: '推广故事、PDF、纸质书或帖子。',
    createNewAd: '创建新广告',
    createNewAdHint: '使用图片和文字从零创建广告。',
    smartBoost: '智能推广',
    smartBoostHint: '设置预算，让 Shadow 优化广告投放。',
    comingSoon: '即将推出',
    editorPending: '新广告编辑器将在后续更新中提供。目前您可以推广已发布的内容。',
    close: '关闭',
    back: '返回',
  },
  ja: {
    boostContent: 'コンテンツを宣伝',
    boostContentHint: 'ストーリー、PDF、紙の本、投稿を宣伝します。',
    createNewAd: '新しい広告を作成',
    createNewAdHint: '画像とテキストから広告を新規作成します。',
    smartBoost: 'スマートブースト',
    smartBoostHint: '予算を設定し、Shadow が配信を最適化します。',
    comingSoon: '近日公開',
    editorPending: '新しい広告エディターは今後の更新で利用可能になります。現在は公開済みのコンテンツを宣伝できます。',
    close: '閉じる',
    back: '戻る',
  },
  ko: {
    boostContent: '콘텐츠 홍보',
    boostContentHint: '스토리, PDF, 종이책 또는 게시물을 홍보하세요.',
    createNewAd: '새 광고 만들기',
    createNewAdHint: '이미지와 텍스트로 광고를 새로 만드세요.',
    smartBoost: '스마트 부스트',
    smartBoostHint: '예산을 정하고 Shadow가 광고 노출을 최적화하게 하세요.',
    comingSoon: '출시 예정',
    editorPending: '새 광고 편집기는 추후 업데이트에서 제공됩니다. 지금은 게시된 콘텐츠를 홍보할 수 있습니다.',
    close: '닫기',
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
      className="group flex w-full items-center gap-4 rounded-[24px] border border-[#eceaf5] bg-white px-4 py-6 text-left shadow-[0_8px_26px_rgba(61,34,116,0.06)] transition-transform active:scale-[0.99] disabled:cursor-default dark:border-white/10 dark:bg-[#1c1929] sm:gap-6 sm:px-6 sm:py-7"
    >
      <span className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#f2ecff] dark:bg-[#302345] sm:h-[88px] sm:w-[88px]">
        <Icon size={38} strokeWidth={1.9} color={ACCENT} aria-hidden="true" />
        <Sparkles aria-hidden="true" size={19} fill="#ffd43f" color="#ffbe20" className={`absolute ${variant === 'bottom' ? '-bottom-1 right-1' : '-top-1 right-0'}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[17px] font-bold leading-6 text-[#151020] dark:text-white sm:text-[20px]">{title}</span>
          {badge && <span className="rounded-full bg-[#ffe8a0] px-2 py-1 text-[10px] font-semibold text-[#423000] dark:bg-[#695114] dark:text-[#fff1b4]">{badge}</span>}
        </span>
        <span className="mt-2 block text-[13px] leading-5 text-[#818398] dark:text-[#b5b2c4] sm:text-sm">{description}</span>
      </span>
      <ChevronRight size={23} strokeWidth={2} className="shrink-0 text-[#89869c] dark:text-[#bcb5d1]" aria-hidden="true" />
    </button>
  )
}

export default function AuthorAdsLandingPage() {
  useAuthorPageFooterVisibility(false)
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [showEditorNotice, setShowEditorNotice] = useState(false)
  const tr = key => t(`authorAdsLanding.${key}`)

  return (
    <main className="min-h-[100dvh] bg-[#f7f5ff] text-[#161125] dark:bg-[#12101c] dark:text-white">
      <div className="mx-auto max-w-2xl px-4 pb-10 pt-5 sm:px-6">
        <header className="mb-9 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/author/page')}
            aria-label={tr('back')}
            className="flex h-10 w-8 shrink-0 items-center justify-start text-[#171321] dark:text-white"
          >
            <ArrowLeft size={25} strokeWidth={2.2} />
          </button>
          <h1 className="text-[25px] font-bold tracking-tight text-[#171321] dark:text-white">Shadow Ads</h1>
        </header>

        <section className="space-y-4" aria-label="Shadow Ads">
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
            onClick={() => setShowEditorNotice(true)}
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

      {showEditorNotice && (
        <div
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5"
          onClick={() => setShowEditorNotice(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="author-ads-new-editor-title"
            onClick={event => event.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-xl dark:bg-[#251f32]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 id="author-ads-new-editor-title" className="text-lg font-bold">{tr('createNewAd')}</h2>
              <button type="button" aria-label={tr('close')} onClick={() => setShowEditorNotice(false)} className="rounded-full p-2 text-[#7e8092] dark:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm leading-6 text-[#74768a] dark:text-[#c1bccc]">{tr('editorPending')}</p>
            <button
              type="button"
              onClick={() => { setShowEditorNotice(false); navigate('/author/page/ads/boost-content') }}
              className="mt-5 w-full rounded-xl bg-[#ffd43f] py-3 text-sm font-bold text-[#211700]"
            >
              {tr('boostContent')}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
