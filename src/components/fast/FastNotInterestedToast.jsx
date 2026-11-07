import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('fastNotInterested', {
  en: { hidden: 'Reel hidden from your feed', undo: 'Undo' },
  km: { hidden: 'បានលាក់ Reel ពី Feed របស់អ្នក', undo: 'មិនធ្វើវិញ' },
  zh: { hidden: '已从你的动态中隐藏此视频', undo: '撤销' },
  ja: { hidden: 'リールをフィードから非表示にしました', undo: '元に戻す' },
  ko: { hidden: '피드에서 릴스를 숨겼습니다', undo: '실행 취소' },
})

export default function FastNotInterestedToast({ item, onUndo }) {
  const { t } = useDisplayTranslation()
  if (!item) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto fixed bottom-[calc(78px+env(safe-area-inset-bottom))] left-1/2 z-[200010] flex w-[min(92vw,440px)] -translate-x-1/2 items-center gap-3 rounded-xl bg-[#202024] px-4 py-3 text-white shadow-xl"
    >
      <span className="min-w-0 flex-1 text-[13px] font-medium">
        {t('fastNotInterested.hidden')}
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-bold text-[#c4b5fd] hover:bg-white/10"
      >
        {t('fastNotInterested.undo')}
      </button>
    </div>
  )
}
