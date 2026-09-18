import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorDaily50CoverCard', {
  en: {
    title: 'Daily Author Boost',
    subtitle: '50% Author Share',
    details: 'View Event Details',
  },
  km: {
    title: 'Daily Author Boost',
    subtitle: 'ចំណែកអ្នកនិពន្ធ 50%',
    details: 'មើលព័ត៌មាន Event',
  },
  zh: {
    title: '每日作者加成',
    subtitle: '作者分成 50%',
    details: '查看活动详情',
  },
  ja: {
    title: 'デイリー作者ブースト',
    subtitle: '作者分配 50%',
    details: 'イベント詳細を見る',
  },
  ko: {
    title: '데일리 작가 부스트',
    subtitle: '작가 수익 배분 50%',
    details: '이벤트 자세히 보기',
  },
})

export default function AuthorDaily50CoverCard() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      onClick={() => navigate('/event/daily-author-boost')}
      className="mt-4 block aspect-square w-full overflow-hidden rounded-[24px] border border-emerald-300 bg-white text-left shadow-[0_16px_38px_rgba(16,185,129,0.15)] transition active:scale-[0.99] dark:border-emerald-700 dark:bg-[#101713]"
    >
      <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#ECFDF5_0%,#D1FAE5_48%,#A7F3D0_100%)] dark:bg-[linear-gradient(145deg,#07120C_0%,#10251A_48%,#163824_100%)]">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[30px] border-emerald-400/30" />
        <div className="absolute right-8 top-8 h-28 w-28 rotate-12 rounded-[30px] bg-white/45 shadow-sm dark:bg-white/10" />
        <div className="absolute right-28 top-32 h-9 w-9 rounded-full bg-emerald-500/45" />
        <div className="absolute left-[43%] top-16 h-14 w-14 rotate-45 rounded-[14px] border-[6px] border-white/60 dark:border-white/15" />

        <div className="absolute inset-x-0 top-0 z-10 p-5">
          <div className="inline-flex rounded-full bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-white dark:bg-white dark:text-black">
            {t('authorDaily50CoverCard.title')}
          </div>

          <div className="mt-5 text-[68px] font-black leading-none tracking-[-0.08em] text-emerald-950 dark:text-emerald-100">
            50%
          </div>

          <div className="mt-2 text-[18px] font-black text-emerald-900 dark:text-emerald-200">
            {t('authorDaily50CoverCard.subtitle')}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-emerald-950/40 via-emerald-900/5 to-transparent p-5 pt-24">
          <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border-2 border-black bg-emerald-400 text-[13px] font-black text-black shadow-[0_5px_0_#111111]">
            <i className="fa-solid fa-circle-info text-[11px]" />
            {t('authorDaily50CoverCard.details')}
          </div>
        </div>
      </div>
    </button>
  )
}
