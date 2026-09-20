import { useEffect, useState } from 'react'
import { Database, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { SurfaceCard } from '../common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { clearMangaImageCache, getMangaImageCacheStats } from '../../utils/mangaImageCacheControl'
import { clearReaderEpisodeCache } from '../../utils/readerEpisodeCache'

registerTranslationNamespace('libraryCacheSettings', {
  en: {
    applied: 'Manga image cache settings applied. Other temporary episode caches use their existing limits.', failed: 'Cache settings could not be applied. Try reopening the page.',
    current: 'Manga image cache', effective: 'Current storage limit', cacheOnly: 'This figure covers Manga images only. Other temporary episode caches have separate limits.',
    clear: 'Clear temporary cache', confirmTitle: 'Clear temporary cache?', confirmBody: 'This deletes cached Manga images and temporarily saved episode data. You may need the internet to load them again. It will not remove saved books from your Library or downloaded PDF files.',
    cancel: 'Cancel', deleteNow: 'Clear cache', clearing: 'Clearing…', cleared: 'Temporary cache cleared.', clearFailed: 'Could not clear the cache. Try again.', protectedNow: 'Offline story downloads are not available yet; when added, they will use separate protected storage and will not be affected by temporary cache cleanup.',
    automatic: 'Auto', manual: 'Manual', smart: 'Smart Cache', recommended: 'Default',
    autoDescription: 'Shadow will adjust temporary cache between 1–5 GB when device storage allows. It may reduce the limit to 1 GB or less if storage becomes scarce.',
    manualDescription: 'Choose the maximum temporary cache size yourself, in steps of 1 GB. Available browser storage may be lower.',
    limit: 'Maximum cache', protected: 'Offline Downloads are separate and will never be deleted by Shadow’s automatic cache cleanup.',
    pending: 'Applying cache settings…',
  },
  km: {
    applied: 'ការកំណត់ Manga Image Cache បានអនុវត្តហើយ។ Cache ភាគប្រភេទផ្សេងនៅប្រើកម្រិតចាស់ដដែល។', failed: 'មិនអាចអនុវត្តការកំណត់បានទេ។ សូមបើកទំព័រនេះម្តងទៀត។',
    current: 'ទំហំ Manga Image Cache', effective: 'កម្រិតផ្ទុកដែលអាចប្រើបាន', cacheOnly: 'ទំហំនេះរាប់តែរូប Manga។ Cache ភាគប្រភេទផ្សេងមានកម្រិតដាច់ដោយឡែក។',
    clear: 'លុប Cache បណ្តោះអាសន្ន', confirmTitle: 'លុប Cache បណ្តោះអាសន្ន?', confirmBody: 'រូប Manga ក្នុង Cache និងទិន្នន័យភាគដែលរក្សាទុកបណ្តោះអាសន្ននឹងត្រូវលុប។ អ្នកអាចត្រូវការ Internet ដើម្បីផ្ទុកវាម្តងទៀត។ រឿងដែល Save ក្នុង Library និង PDF ដែលបាន Download មិនត្រូវបានលុបទេ។',
    cancel: 'បោះបង់', deleteNow: 'លុប Cache', clearing: 'កំពុងលុប…', cleared: 'បានលុប Cache បណ្តោះអាសន្នរួចហើយ។', clearFailed: 'មិនអាចលុប Cache បានទេ។ សូមព្យាយាមម្តងទៀត។', protectedNow: 'Offline Story Downloads មិនទាន់បង្កើតរួចទេ។ ពេលមានមុខងារនេះ វានឹងរក្សាទុកដាច់ដោយឡែក និងមិនរងផលប៉ះពាល់ពីការលុប Cache បណ្តោះអាសន្នឡើយ។',
    automatic: 'Auto', manual: 'Manual', smart: 'Smart Cache', recommended: 'លំនាំដើម',
    autoDescription: 'Shadow នឹងកំណត់ Cache បណ្តោះអាសន្នពី 1–5GB តាមទំហំផ្ទុកដែលអាចប្រើបាន។ ពេលទំហំផ្ទុកខ្វះ វាអាចបន្ថយមក 1GB ឬតិចជាងនេះ។',
    manualDescription: 'កំណត់ទំហំ Cache បណ្តោះអាសន្នអតិបរមាដោយខ្លួនឯង កើនម្តង 1GB។ ទំហំដែល Browser អនុញ្ញាតអាចតិចជាងនេះ។',
    limit: 'ទំហំ Cache អតិបរមា', protected: 'Offline Downloads ដាច់ដោយឡែកពី Cache ហើយ Shadow មិនលុបដោយ Auto Cleanup ឡើយ។',
    pending: 'កំពុងអនុវត្តការកំណត់ Cache…',
  },
  zh: {
    applied: '漫画图片缓存设置已生效；其他临时章节缓存仍采用原有限额。', failed: '无法应用缓存设置，请重新打开此页面。',
    current: '漫画图片缓存', effective: '当前可用缓存上限', cacheOnly: '此数据仅包含漫画图片；其他章节缓存有各自的限制。',
    clear: '清除临时缓存', confirmTitle: '清除临时缓存？', confirmBody: '将删除缓存的漫画图片及临时保存的章节内容。再次查看可能需要网络连接。书库中的收藏及已下载的 PDF 不会被删除。',
    cancel: '取消', deleteNow: '清除缓存', clearing: '正在清除…', cleared: '临时缓存已清除。', clearFailed: '无法清除缓存，请重试。', protectedNow: '离线故事下载尚未推出；推出后将使用独立存储，不会被临时缓存清理影响。',
    automatic: '自动', manual: '手动', smart: '智能缓存', recommended: '默认',
    autoDescription: '设备存储允许时，Shadow 将在 1–5GB 之间调整临时缓存；空间不足时，可降至 1GB 或更低。',
    manualDescription: '以每次 1GB 的幅度设置临时缓存上限。浏览器实际可用空间可能更少。',
    limit: '最大缓存', protected: '离线下载与临时缓存分开，Shadow 的自动清理不会删除离线下载。',
    pending: '正在应用缓存设置…',
  },
  ja: {
    applied: 'マンガ画像のキャッシュ設定を適用しました。他の一時エピソードキャッシュは従来の制限を使用します。', failed: '設定を適用できませんでした。ページを再度開いてください。',
    current: 'マンガ画像キャッシュ', effective: '現在のキャッシュ上限', cacheOnly: 'この数値はマンガ画像のみを対象としています。他のエピソードキャッシュには別の上限があります。',
    clear: '一時キャッシュを消去', confirmTitle: '一時キャッシュを消去しますか？', confirmBody: 'マンガ画像と一時保存したエピソードデータを削除します。再表示にはネット接続が必要になる場合があります。ライブラリの保存作品とダウンロード済み PDF は削除されません。',
    cancel: 'キャンセル', deleteNow: 'キャッシュを消去', clearing: '消去中…', cleared: '一時キャッシュを消去しました。', clearFailed: 'キャッシュを消去できませんでした。もう一度お試しください。', protectedNow: 'オフライン作品のダウンロード機能は未実装です。追加後は一時キャッシュとは別に保存されます。',
    automatic: '自動', manual: '手動', smart: 'スマートキャッシュ', recommended: '初期設定',
    autoDescription: '空き容量に応じて一時キャッシュを 1～5GB に調整します。容量不足の場合は 1GB 以下に減らすことがあります。',
    manualDescription: '一時キャッシュの上限を 1GB 刻みで選べます。ブラウザーの空き容量によって制限されます。',
    limit: 'キャッシュ上限', protected: 'オフラインダウンロードは別管理で、自動キャッシュ削除の対象になりません。',
    pending: 'キャッシュ設定を適用しています…',
  },
  ko: {
    applied: '만화 이미지 캐시 설정을 적용했습니다. 다른 임시 에피소드 캐시는 기존 제한을 사용합니다.', failed: '설정을 적용하지 못했습니다. 페이지를 다시 여세요.',
    current: '만화 이미지 캐시', effective: '현재 캐시 한도', cacheOnly: '이 수치는 만화 이미지만 포함합니다. 다른 에피소드 캐시는 별도의 제한을 사용합니다.',
    clear: '임시 캐시 삭제', confirmTitle: '임시 캐시를 삭제할까요?', confirmBody: '캐시된 만화 이미지와 임시로 저장한 에피소드 데이터가 삭제됩니다. 다시 불러오려면 인터넷이 필요할 수 있습니다. 라이브러리에 저장한 작품과 다운로드한 PDF 파일은 삭제되지 않습니다.',
    cancel: '취소', deleteNow: '캐시 삭제', clearing: '삭제 중…', cleared: '임시 캐시를 삭제했습니다.', clearFailed: '캐시를 삭제하지 못했습니다. 다시 시도하세요.', protectedNow: '오프라인 작품 다운로드는 아직 제공되지 않습니다. 추가되면 임시 캐시와 별도로 보관됩니다.',
    automatic: '자동', manual: '수동', smart: '스마트 캐시', recommended: '기본값',
    autoDescription: '기기 저장 공간에 따라 임시 캐시를 1~5GB로 조정하며, 공간이 부족하면 1GB 이하로 줄일 수 있습니다.',
    manualDescription: '임시 캐시의 최대 크기를 1GB씩 설정합니다. 브라우저가 허용하는 용량은 더 적을 수 있습니다.',
    limit: '최대 캐시', protected: '오프라인 다운로드는 별도로 보관되며 Shadow의 자동 캐시 정리로 삭제되지 않습니다.',
    pending: '캐시 설정을 적용하는 중…',
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

const GB = 1024 * 1024 * 1024

function formatCacheSize(bytes) {
  const value = Math.max(0, Number(bytes) || 0)
  return value >= GB ? `${(value / GB).toFixed(2)} GB` : `${(value / (1024 * 1024)).toFixed(1)} MB`
}

async function sendCacheSettings(mode, limitGb) {
  if (!('serviceWorker' in navigator)) throw new Error('SERVICE_WORKER_UNAVAILABLE')
  const registration = await navigator.serviceWorker.ready
  const worker = navigator.serviceWorker.controller || registration.active
  if (!worker) throw new Error('SERVICE_WORKER_UNAVAILABLE')
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()
    const timer = window.setTimeout(() => {
      channel.port1.close()
      reject(new Error('CACHE_SETTINGS_TIMEOUT'))
    }, 8000)
    channel.port1.onmessage = ({ data }) => {
      window.clearTimeout(timer)
      channel.port1.close()
      if (data?.ok) resolve(data)
      else reject(new Error(data?.code || 'CACHE_SETTINGS_FAILED'))
    }
    worker.postMessage({ type: 'SHADOW_TEMP_CACHE_SETTINGS_SET', mode, limitGb }, [channel.port2])
  })
}

export default function LibraryCacheSettings() {
  const { t } = useDisplayTranslation()
  const [mode, setMode] = useState(() => readSetting(MODE_KEY, 'auto') === 'manual' ? 'manual' : 'auto')
  const [limit, setLimit] = useState(() => {
    const saved = Number(readSetting(LIMIT_KEY, '1'))
    return Number.isInteger(saved) ? Math.min(5, Math.max(1, saved)) : 1
  })
  const [syncStatus, setSyncStatus] = useState('pending')
  const [stats, setStats] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [clearStatus, setClearStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    setSyncStatus('pending')
    const timer = window.setTimeout(async () => {
      try {
        await sendCacheSettings(mode, limit)
        if (cancelled) return
        setSyncStatus('applied')
        const result = await getMangaImageCacheStats()
        if (!cancelled && result?.ok) setStats(result)
      } catch {
        if (!cancelled) setSyncStatus('failed')
      }
    }, 200)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [mode, limit])

  const changeMode = (nextMode) => {
    setMode(nextMode)
    saveSetting(MODE_KEY, nextMode)
  }

  const changeLimit = (event) => {
    const nextLimit = Number(event.target.value)
    setLimit(nextLimit)
    saveSetting(LIMIT_KEY, nextLimit)
  }

  const clearTemporaryCache = async () => {
    setClearing(true)
    setClearStatus('')
    try {
      const result = await clearMangaImageCache({ all: true })
      if (!result?.ok) throw new Error('MANGA_CACHE_CLEAR_FAILED')
      await clearReaderEpisodeCache()
      setConfirmOpen(false)
      setClearStatus('cleared')
      const nextStats = await getMangaImageCacheStats()
      if (nextStats?.ok) setStats(nextStats)
    } catch {
      setClearStatus('clearFailed')
    } finally {
      setClearing(false)
    }
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
        <p className="mt-3 px-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]" role="status">{t(`libraryCacheSettings.${syncStatus}`)}</p>
      </SurfaceCard>
      <SurfaceCard className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 text-[13px] text-[var(--shadow-text-primary)]">
          <span className="font-semibold">{t('libraryCacheSettings.current')}</span>
          <strong>{stats?.ok ? formatCacheSize(stats.cachedBytes) : '—'}</strong>
        </div>
        <div className="flex items-center justify-between gap-3 text-[12px] text-[var(--shadow-text-secondary)]">
          <span>{t('libraryCacheSettings.effective')}</span>
          <span>{stats?.ok ? formatCacheSize(stats.budgetBytes) : '—'}</span>
        </div>
        <p className="text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">{t('libraryCacheSettings.cacheOnly')}</p>
        <button type="button" onClick={() => { setConfirmOpen(true); setClearStatus('') }}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-300 px-4 text-[13px] font-bold text-red-600 dark:border-red-800 dark:text-red-400">
          <Trash2 size={16} aria-hidden="true" />{t('libraryCacheSettings.clear')}
        </button>
        {clearStatus && <p className="text-center text-[12px] text-[var(--shadow-text-secondary)]" role="status">{t(`libraryCacheSettings.${clearStatus}`)}</p>}
      </SurfaceCard>
      <SurfaceCard className="flex items-start gap-3 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
        <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.protectedNow')}</p>
      </SurfaceCard>
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="shadow-cache-clear-title">
          <div className="w-full max-w-[360px] rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 shadow-xl">
            <h3 id="shadow-cache-clear-title" className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.confirmTitle')}</h3>
            <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.confirmBody')}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" disabled={clearing} onClick={() => setConfirmOpen(false)} className="min-h-11 rounded-xl border border-[var(--shadow-border)] text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.cancel')}</button>
              <button type="button" disabled={clearing} onClick={clearTemporaryCache} className="min-h-11 rounded-xl bg-red-600 px-3 text-[13px] font-bold text-white disabled:opacity-60">{t(`libraryCacheSettings.${clearing ? 'clearing' : 'deleteNow'}`)}</button>
            </div>
            {clearStatus === 'clearFailed' && <p className="mt-3 text-[12px] text-red-500" role="alert">{t('libraryCacheSettings.clearFailed')}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
