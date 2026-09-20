import { useState } from 'react'
import { Database, ShieldCheck, Sparkles } from 'lucide-react'
import { SurfaceCard } from '../common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('libraryCacheSettings', {
  en: {
    automatic: 'Auto', manual: 'Manual', smart: 'Smart Cache', recommended: 'Default',
    autoDescription: 'Shadow will adjust temporary cache between 1–5 GB when device storage allows. It may reduce the limit to 1 GB or less if storage becomes scarce.',
    manualDescription: 'Choose the maximum temporary cache size yourself, in steps of 1 GB. Available browser storage may be lower.',
    limit: 'Maximum cache', protected: 'Offline Downloads are separate and will never be deleted by Shadow’s automatic cache cleanup.',
    pending: 'Your preference is saved. Automatic cleanup and the selected limit will take effect after the cache engine is connected.',
  },
  km: {
    automatic: 'Auto', manual: 'Manual', smart: 'Smart Cache', recommended: 'លំនាំដើម',
    autoDescription: 'Shadow នឹងកំណត់ Cache បណ្តោះអាសន្នពី 1–5GB តាមទំហំផ្ទុកដែលអាចប្រើបាន។ ពេលទំហំផ្ទុកខ្វះ វាអាចបន្ថយមក 1GB ឬតិចជាងនេះ។',
    manualDescription: 'កំណត់ទំហំ Cache បណ្តោះអាសន្នអតិបរមាដោយខ្លួនឯង កើនម្តង 1GB។ ទំហំដែល Browser អនុញ្ញាតអាចតិចជាងនេះ។',
    limit: 'ទំហំ Cache អតិបរមា', protected: 'Offline Downloads ដាច់ដោយឡែកពី Cache ហើយ Shadow មិនលុបដោយ Auto Cleanup ឡើយ។',
    pending: 'ជម្រើសរបស់អ្នកបានរក្សាទុកហើយ។ ការលុបស្វ័យប្រវត្តិ និងកម្រិតទំហំនេះនឹងដំណើរការ បន្ទាប់ពីភ្ជាប់ប្រព័ន្ធ Cache។',
  },
  zh: {
    automatic: '自动', manual: '手动', smart: '智能缓存', recommended: '默认',
    autoDescription: '设备存储允许时，Shadow 将在 1–5GB 之间调整临时缓存；空间不足时，可降至 1GB 或更低。',
    manualDescription: '以每次 1GB 的幅度设置临时缓存上限。浏览器实际可用空间可能更少。',
    limit: '最大缓存', protected: '离线下载与临时缓存分开，Shadow 的自动清理不会删除离线下载。',
    pending: '偏好已保存。连接缓存管理功能后，自动清理和所选上限才会生效。',
  },
  ja: {
    automatic: '自動', manual: '手動', smart: 'スマートキャッシュ', recommended: '初期設定',
    autoDescription: '空き容量に応じて一時キャッシュを 1～5GB に調整します。容量不足の場合は 1GB 以下に減らすことがあります。',
    manualDescription: '一時キャッシュの上限を 1GB 刻みで選べます。ブラウザーの空き容量によって制限されます。',
    limit: 'キャッシュ上限', protected: 'オフラインダウンロードは別管理で、自動キャッシュ削除の対象になりません。',
    pending: '設定を保存しました。キャッシュ管理機能を接続した後に、自動削除と上限が適用されます。',
  },
  ko: {
    automatic: '자동', manual: '수동', smart: '스마트 캐시', recommended: '기본값',
    autoDescription: '기기 저장 공간에 따라 임시 캐시를 1~5GB로 조정하며, 공간이 부족하면 1GB 이하로 줄일 수 있습니다.',
    manualDescription: '임시 캐시의 최대 크기를 1GB씩 설정합니다. 브라우저가 허용하는 용량은 더 적을 수 있습니다.',
    limit: '최대 캐시', protected: '오프라인 다운로드는 별도로 보관되며 Shadow의 자동 캐시 정리로 삭제되지 않습니다.',
    pending: '설정이 저장되었습니다. 캐시 관리 기능을 연결한 후 자동 정리와 용량 제한이 적용됩니다.',
  },
})

const MODE_KEY = 'shadow_temporary_cache_mode_v1'
const LIMIT_KEY = 'shadow_temporary_cache_limit_gb_v1'

function readSetting(key, fallback) {
  try { return localStorage.getItem(key) || fallback } catch { return fallback }
}

function saveSetting(key, value) {
  try { localStorage.setItem(key, String(value)) } catch { return }
}

export default function LibraryCacheSettings() {
  const { t } = useDisplayTranslation()
  const [mode, setMode] = useState(() => readSetting(MODE_KEY, 'auto') === 'manual' ? 'manual' : 'auto')
  const [limit, setLimit] = useState(() => {
    const saved = Number(readSetting(LIMIT_KEY, '1'))
    return Number.isInteger(saved) ? Math.min(5, Math.max(1, saved)) : 1
  })

  const changeMode = (nextMode) => {
    setMode(nextMode)
    saveSetting(MODE_KEY, nextMode)
  }
  const changeLimit = (event) => {
    const nextLimit = Number(event.target.value)
    setLimit(nextLimit)
    saveSetting(LIMIT_KEY, nextLimit)
  }

  return (
    <div className="space-y-4">
      <SurfaceCard className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[var(--shadow-text-primary)]">
          <Database size={20} className="text-[#8B5CF6]" aria-hidden="true" />
          <h2 className="text-[16px] font-bold">{t('libraryCacheSettings.smart')}</h2>
          {mode === 'auto' && <span className="ml-auto rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[11px] text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.recommended')}</span>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[var(--shadow-bg-soft)] p-1">
          {['auto', 'manual'].map((option) => (
            <button key={option} type="button" onClick={() => changeMode(option)} aria-pressed={mode === option}
              className={`min-h-11 rounded-lg px-3 text-[13px] font-semibold transition ${mode === option ? 'bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm' : 'text-[var(--shadow-text-secondary)]'}`}>
              {t(`libraryCacheSettings.${option === 'auto' ? 'automatic' : 'manual'}`)}
            </button>
          ))}
        </div>
        {mode === 'auto' ? (
          <div className="mt-4 rounded-xl border border-[var(--shadow-border)] p-3">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--shadow-text-primary)]"><Sparkles size={17} className="text-[#8B5CF6]" />{t('libraryCacheSettings.smart')} · 1–5 GB</div>
            <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.autoDescription')}</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 rounded-xl border border-[var(--shadow-border)] p-3">
            <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.manualDescription')}</p>
            <div className="flex items-center justify-between gap-2 text-[var(--shadow-text-primary)]"><label htmlFor="shadow-cache-limit" className="text-[13px] font-semibold">{t('libraryCacheSettings.limit')}</label><strong className="text-[19px]">{limit} GB</strong></div>
            <input id="shadow-cache-limit" type="range" min="1" max="5" step="1" value={limit} onChange={changeLimit} className="w-full accent-[#8B5CF6]" />
            <div className="flex justify-between text-[11px] text-[var(--shadow-text-secondary)]">{[1, 2, 3, 4, 5].map((number) => <span key={number}>{number}</span>)}</div>
          </div>
        )}
      </SurfaceCard>
      <SurfaceCard className="flex items-start gap-3 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
        <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.protected')}</p>
      </SurfaceCard>
      <p className="px-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">{t('libraryCacheSettings.pending')}</p>
    </div>
  )
}
