import { useEffect, useState } from 'react'
import { BookOpen, Clock3, Database, Image, MessagesSquare, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { SurfaceCard } from '../common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  applyTemporaryCachePreferences,
  clearTemporaryCacheType,
  getTemporaryCachePreferences,
  getTemporaryCacheStats,
} from '../../utils/temporaryCacheManager'

registerTranslationNamespace('libraryCacheSettings', {
  en: {
    smart: 'Smart Cache', automatic: 'Auto', manual: 'Manual', recommended: 'Default',
    autoDescription: 'Shadow targets 1–5 GB of temporary cache for Novel, Chat Story and Manga, depending on browser storage. Shown sizes and the combined limit are estimates.',
    manualDescription: 'Choose a target for the total temporary cache. Actual storage may vary with browser limits and the separate Manga image cache policy.',
    limit: 'Maximum cache', autoDelete: 'Auto-delete', autoDeleteDescription: 'Clear unused cached chapters while using Shadow. Manga images still follow their separate expiry and storage policy.',
    never: 'No extra age cleanup', days: 'After {{count}} days',
    content: 'Content Cache', contentDescription: 'Estimated temporary reading data stored on this device. Clear each type separately or clear them all.',
    novel: 'Novel cache', chat_story: 'Chat Story cache', manga: 'Manga cache',
    novelDescription: 'Cached novel chapters', chat_storyDescription: 'Cached chat episodes', mangaDescription: 'Cached manga chapters and images',
    total: 'Total temporary cache', effective: 'Current storage limit',
    clear: 'Clear', clearAll: 'Clear all temporary cache',
    clearNote: 'Only temporary episode data and Manga images are cleared. Saved Library stories and purchased PDF files remain.',
    confirmTitle: 'Clear temporary cache?', confirmBody: 'Clear {{type}} from this device? This may require the internet to load again. This does not delete your saved Library stories or purchased PDFs.',
    cancel: 'Cancel', deleteNow: 'Clear cache', clearing: 'Clearing…', cleared: 'Temporary cache cleared.',
    clearFailed: 'Could not clear the selected cache. Try again.', pending: 'Applying cache settings…',
    applied: 'Cache settings applied.', failed: 'Cache settings could not be applied. Try reopening the page.',
    protectedNow: 'Offline story downloads are not available yet. When added, they will be stored separately and excluded from Shadow’s temporary-cache cleanup.',
    partial: 'Manga image cache is unavailable; its size cannot currently be measured.',
  },
  km: {
    smart: 'Smart Cache', automatic: 'Auto', manual: 'Manual', recommended: 'លំនាំដើម',
    autoDescription: 'Shadow គ្រប់គ្រងគោលដៅទំហំ Cache សរុប Novel, Chat Story និង Manga ប្រហែល 1–5GB តាមទំហំដែល Browser អនុញ្ញាត។ ទំហំបង្ហាញជាការប៉ាន់ស្មាន ហើយអាចថយចុះពេលទំហំផ្ទុកខ្វះ។',
    manualDescription: 'ជ្រើសរើសគោលដៅទំហំ Cache បណ្តោះអាសន្នសរុប។ ទំហំអាចប្រែប្រួលតាម Browser និងការគ្រប់គ្រងរូប Manga ដាច់ដោយឡែក។',
    limit: 'ទំហំ Cache អតិបរមា', autoDelete: 'លុបស្វ័យប្រវត្តិ', autoDeleteDescription: 'លុប Cache ភាគដែលមិនបានប្រើតាមរយៈពេលដែលបានជ្រើសរើស ពេលប្រើ Shadow។ រូប Manga នៅប្រើរយៈពេល និងកម្រិតទំហំផ្ទុកដាច់ដោយឡែក។',
    never: 'មិនលុបបន្ថែមតាមរយៈពេល', days: 'ក្រោយ {{count}} ថ្ងៃ',
    content: 'Content Cache', contentDescription: 'ទំហំប៉ាន់ស្មាននៃទិន្នន័យអានបណ្តោះអាសន្នលើឧបករណ៍នេះ។ អាចលុបតាមប្រភេទ ឬលុបទាំងអស់។',
    novel: 'Novel Cache', chat_story: 'Chat Story Cache', manga: 'Manga Cache',
    novelDescription: 'ទិន្នន័យភាគប្រលោមលោកក្នុង Cache', chat_storyDescription: 'ទិន្នន័យភាគ Chat Story ក្នុង Cache', mangaDescription: 'ទិន្នន័យភាគ និងរូប Manga ក្នុង Cache',
    total: 'Cache បណ្តោះអាសន្នសរុប', effective: 'កម្រិតទំហំផ្ទុកបច្ចុប្បន្ន',
    clear: 'លុប', clearAll: 'លុប Cache បណ្តោះអាសន្នទាំងអស់',
    clearNote: 'លុបតែទិន្នន័យភាគបណ្តោះអាសន្ន និងរូប Manga ក្នុង Cache ប៉ុណ្ណោះ។ រឿងដែល Save ក្នុង Library និង PDF ដែលបានទិញនៅដដែល។',
    confirmTitle: 'បញ្ជាក់ការលុប Cache?', confirmBody: 'លុប {{type}} ចេញពីឧបករណ៍នេះមែនទេ? អាចត្រូវការអ៊ីនធឺណិតដើម្បីផ្ទុកម្តងទៀត។ រឿងដែល Save ក្នុង Library និង PDF ដែលបានទិញមិនត្រូវលុបទេ។',
    cancel: 'បោះបង់', deleteNow: 'លុប Cache', clearing: 'កំពុងលុប…', cleared: 'បានលុប Cache បណ្តោះអាសន្នរួចហើយ។',
    clearFailed: 'មិនអាចលុប Cache ដែលបានជ្រើសរើសទេ។ សូមព្យាយាមម្តងទៀត។', pending: 'កំពុងអនុវត្តការកំណត់ Cache…',
    applied: 'បានអនុវត្តការកំណត់ Cache រួចហើយ។', failed: 'មិនអាចអនុវត្តការកំណត់ Cache បានទេ។ សូមបើកទំព័រនេះម្តងទៀត។',
    protectedNow: 'មុខងារ Download រឿងសម្រាប់អាន Offline មិនទាន់បង្កើតរួចទេ។ ពេលបង្កើត វានឹងរក្សាទុកដាច់ដោយឡែកពី Cache បណ្តោះអាសន្ន។',
    partial: 'មិនអាចអានទំហំរូប Manga ក្នុង Cache បាននៅពេលនេះទេ។',
  },
  zh: {
    smart: '智能缓存', automatic: '自动', manual: '手动', recommended: '默认',
    autoDescription: '根据浏览器可用空间，自动管理小说、聊天故事和漫画共计 1–5 GB 的临时缓存；空间不足时上限可能降低。',
    manualDescription: '设置所有阅读内容临时缓存的总上限。浏览器实际可用空间可能更低。',
    limit: '缓存总上限', autoDelete: '自动清理', autoDeleteDescription: '使用 Shadow 时按闲置时间清理临时章节；漫画图片仍遵循单独的到期与存储规则。',
    never: '不额外按时间清理', days: '{{count}} 天后',
    content: '内容缓存', contentDescription: '存储在本设备上的临时阅读数据，可分别清理或全部清理。',
    novel: '小说缓存', chat_story: '聊天故事缓存', manga: '漫画缓存',
    novelDescription: '缓存的小说章节', chat_storyDescription: '缓存的聊天章节', mangaDescription: '缓存的漫画章节和图片',
    total: '临时缓存总量', effective: '当前存储上限', clear: '清理', clearAll: '清理全部临时缓存',
    clearNote: '仅删除临时章节数据和漫画图片；书库收藏及已购买的 PDF 不受影响。',
    confirmTitle: '确认清理缓存？', confirmBody: '清理本设备上的{{type}}？重新阅读可能需要联网。书库收藏及已购买的 PDF 不会删除。',
    cancel: '取消', deleteNow: '清理缓存', clearing: '正在清理…', cleared: '临时缓存已清理。', clearFailed: '清理失败，请重试。',
    pending: '正在应用缓存设置…', applied: '缓存设置已生效。', failed: '缓存设置未生效，请重新打开此页面。',
    protectedNow: '离线故事下载尚未推出。推出后将单独存储，不纳入 Shadow 临时缓存清理。', partial: '目前无法获取漫画图片缓存大小。',
  },
  ja: {
    smart: 'スマートキャッシュ', automatic: '自動', manual: '手動', recommended: '初期設定',
    autoDescription: 'ブラウザーの空き容量に応じ、小説・チャットストーリー・マンガの一時キャッシュ合計を 1～5 GB 以内で管理します。空き容量が少ない場合は上限が下がります。',
    manualDescription: 'すべての一時読み取りデータの上限を設定します。ブラウザーの空き容量によって制限されます。',
    limit: '合計キャッシュ上限', autoDelete: '自動削除', autoDeleteDescription: 'Shadow の利用時に未使用の一時的な話を削除します。マンガ画像の期限と容量制限は別に管理されます。',
    never: '追加の期間指定なし', days: '{{count}} 日後',
    content: 'コンテンツキャッシュ', contentDescription: 'この端末の一時読み取りデータを種類別または一括で消去できます。',
    novel: '小説キャッシュ', chat_story: 'チャットストーリーキャッシュ', manga: 'マンガキャッシュ',
    novelDescription: '一時保存された小説の章', chat_storyDescription: '一時保存されたチャットの話', mangaDescription: '一時保存されたマンガの話と画像',
    total: '一時キャッシュ合計', effective: '現在の保存上限', clear: '消去', clearAll: 'すべての一時キャッシュを消去',
    clearNote: '一時的な話のデータとマンガ画像のみ消去します。ライブラリの保存作品と購入済み PDF は残ります。',
    confirmTitle: 'キャッシュを消去しますか？', confirmBody: 'この端末の{{type}}を消去しますか？再表示にネット接続が必要な場合があります。保存作品と購入済み PDF は消去しません。',
    cancel: 'キャンセル', deleteNow: '消去', clearing: '消去中…', cleared: '一時キャッシュを消去しました。', clearFailed: '消去できませんでした。もう一度お試しください。',
    pending: 'キャッシュ設定を適用しています…', applied: 'キャッシュ設定を適用しました。', failed: '設定を適用できませんでした。ページを開き直してください。',
    protectedNow: '作品のオフラインダウンロード機能は未実装です。追加後は一時キャッシュと別に保管されます。', partial: '現在マンガ画像のキャッシュ容量を確認できません。',
  },
  ko: {
    smart: '스마트 캐시', automatic: '자동', manual: '수동', recommended: '기본값',
    autoDescription: '브라우저의 가용 공간에 따라 소설·채팅 스토리·만화의 임시 캐시 합계를 최대 1~5GB까지 관리합니다. 공간이 부족하면 한도가 낮아질 수 있습니다.',
    manualDescription: '모든 임시 읽기 데이터의 전체 용량 한도를 선택합니다. 브라우저가 허용하는 용량은 더 작을 수 있습니다.',
    limit: '전체 캐시 한도', autoDelete: '자동 삭제', autoDeleteDescription: 'Shadow 사용 중 오래 사용하지 않은 임시 회차를 삭제합니다. 만화 이미지는 별도의 만료 및 저장 공간 규칙을 따릅니다.',
    never: '추가 기간별 삭제 없음', days: '{{count}}일 후',
    content: '콘텐츠 캐시', contentDescription: '이 기기의 임시 읽기 데이터를 종류별 또는 전체 삭제할 수 있습니다.',
    novel: '소설 캐시', chat_story: '채팅 스토리 캐시', manga: '만화 캐시',
    novelDescription: '임시 저장된 소설 회차', chat_storyDescription: '임시 저장된 채팅 회차', mangaDescription: '임시 저장된 만화 회차와 이미지',
    total: '전체 임시 캐시', effective: '현재 저장 공간 한도', clear: '삭제', clearAll: '모든 임시 캐시 삭제',
    clearNote: '임시 회차 데이터와 만화 이미지만 삭제합니다. 라이브러리 저장 작품과 구매한 PDF는 유지됩니다.',
    confirmTitle: '캐시를 삭제할까요?', confirmBody: '이 기기의 {{type}}를 삭제할까요? 다시 불러오려면 인터넷이 필요할 수 있습니다. 저장 작품과 구매한 PDF는 삭제하지 않습니다.',
    cancel: '취소', deleteNow: '삭제', clearing: '삭제 중…', cleared: '임시 캐시가 삭제되었습니다.', clearFailed: '캐시를 삭제하지 못했습니다. 다시 시도하세요.',
    pending: '캐시 설정을 적용하는 중…', applied: '캐시 설정을 적용했습니다.', failed: '설정을 적용하지 못했습니다. 페이지를 다시 여세요.',
    protectedNow: '작품 오프라인 다운로드 기능은 아직 제공되지 않습니다. 추가되면 임시 캐시와 별도로 보관됩니다.', partial: '현재 만화 이미지 캐시 용량을 확인할 수 없습니다.',
  },
})

const TYPES = [
  { id: 'novel', icon: BookOpen, size: 'novelBytes' },
  { id: 'chat_story', icon: MessagesSquare, size: 'chatStoryBytes' },
  { id: 'manga', icon: Image, size: 'mangaBytes' },
]
const GB = 1024 ** 3
const formatBytes = (bytes) => bytes == null ? '—' : bytes >= GB
  ? `${(bytes / GB).toFixed(2)} GB` : `${(bytes / (1024 ** 2)).toFixed(1)} MB`

export default function LibraryCacheSettings() {
  const { t } = useDisplayTranslation()
  const [preferences, setPreferences] = useState(getTemporaryCachePreferences)
  const [stats, setStats] = useState(null)
  const [syncStatus, setSyncStatus] = useState('pending')
  const [confirmType, setConfirmType] = useState('')
  const [clearing, setClearing] = useState(false)
  const [clearStatus, setClearStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    const timeout = window.setTimeout(async () => {
      try {
        setSyncStatus('pending')
        await applyTemporaryCachePreferences(preferences)
        if (cancelled) return
        setSyncStatus('applied')
        const result = await getTemporaryCacheStats()
        if (!cancelled) setStats(result)
      } catch {
        if (!cancelled) {
          setSyncStatus('failed')
          try {
            const result = await getTemporaryCacheStats()
            if (!cancelled) setStats(result)
          } catch { return }
        }
      }
    }, 250)
    return () => { cancelled = true; window.clearTimeout(timeout) }
  }, [preferences])

  const updatePreferences = (values) => {
    setPreferences((current) => ({ ...current, ...values }))
    setClearStatus('')
  }

  const handleClear = async () => {
    if (!confirmType || clearing) return
    setClearing(true)
    setClearStatus('')
    try {
      const result = await clearTemporaryCacheType(confirmType)
      setStats(result)
      setConfirmType('')
      setClearStatus('cleared')
    } catch { setClearStatus('clearFailed') }
    finally { setClearing(false) }
  }

  const confirmLabel = confirmType === 'all'
    ? t('libraryCacheSettings.clearAll')
    : t(`libraryCacheSettings.${confirmType}`)

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Database size={21} className="text-[#8B5CF6]" aria-hidden="true" />
          <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.smart')}</h2>
          {preferences.mode === 'auto' && (
            <span className="ml-auto rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[11px] text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.recommended')}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[var(--shadow-bg-soft)] p-1">
          {['auto', 'manual'].map((value) => (
            <button key={value} type="button" aria-pressed={preferences.mode === value}
              onClick={() => updatePreferences({ mode: value })}
              className={`min-h-11 rounded-lg text-[13px] font-semibold ${preferences.mode === value ? 'bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm' : 'text-[var(--shadow-text-secondary)]'}`}>
              {t(`libraryCacheSettings.${value === 'auto' ? 'automatic' : 'manual'}`)}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--shadow-border)] p-3">
          {preferences.mode === 'auto' ? (
            <>
              <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
                <Sparkles size={16} className="text-[#8B5CF6]" aria-hidden="true" />{t('libraryCacheSettings.smart')} · 1–5 GB
              </div>
              <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.autoDescription')}</p>
            </>
          ) : (
            <>
              <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.manualDescription')}</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-[var(--shadow-text-primary)]">
                <label htmlFor="shadow-cache-limit" className="text-[13px] font-semibold">{t('libraryCacheSettings.limit')}</label>
                <strong className="text-[19px]">{preferences.limitGb} GB</strong>
              </div>
              <input id="shadow-cache-limit" type="range" min="1" max="5" step="1"
                value={preferences.limitGb} onChange={(event) => updatePreferences({ limitGb: Number(event.target.value) })}
                className="mt-3 w-full accent-[#8B5CF6]" />
              <div className="flex justify-between text-[11px] text-[var(--shadow-text-secondary)]">
                {[1, 2, 3, 4, 5].map((value) => <span key={value}>{value}</span>)}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--shadow-border)] p-3">
          <Clock3 size={20} className="shrink-0 text-[#8B5CF6]" aria-hidden="true" />
          <div className="min-w-[135px] flex-1">
            <label htmlFor="shadow-cache-age" className="block text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.autoDelete')}</label>
            <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.autoDeleteDescription')}</p>
          </div>
          <select id="shadow-cache-age" value={preferences.ageDays}
            onChange={(event) => updatePreferences({ ageDays: Number(event.target.value) })}
            className="min-h-11 max-w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 text-[12px] text-[var(--shadow-text-primary)]">
            {[3, 7, 30, 90, 0].map((days) => (
              <option key={days} value={days}>{days ? t('libraryCacheSettings.days', { count: days }) : t('libraryCacheSettings.never')}</option>
            ))}
          </select>
        </div>
        <p className="text-[11px] leading-5 text-[var(--shadow-text-tertiary)]" role="status">{t(`libraryCacheSettings.${syncStatus}`)}</p>
      </SurfaceCard>

      <SurfaceCard className="space-y-3 p-4 sm:p-5">
        <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.content')}</h2>
        <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.contentDescription')}</p>
        <div className="flex items-center justify-between gap-2 text-[12px] text-[var(--shadow-text-primary)]">
          <span>{t('libraryCacheSettings.total')}</span><strong>{formatBytes(stats?.totalBytes)}</strong>
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--shadow-text-secondary)]">
          <span>{t('libraryCacheSettings.effective')}</span><span>{formatBytes(stats?.limitBytes)}</span>
        </div>
        {TYPES.map(({ id, icon: Icon, size }) => (
          <div key={id} className="flex flex-wrap items-center gap-3 border-t border-[var(--shadow-border)] py-3">
            <Icon size={21} className="shrink-0 text-[#8B5CF6]" aria-hidden="true" />
            <div className="min-w-[115px] flex-1">
              <div className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t(`libraryCacheSettings.${id}`)}</div>
              <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{t(`libraryCacheSettings.${id}Description`)}</p>
            </div>
            <span className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">{formatBytes(stats?.[size])}</span>
            <button type="button" disabled={clearing || (id === 'manga' && stats?.[size] == null)}
              onClick={() => { setConfirmType(id); setClearStatus('') }}
              className="flex min-h-10 items-center gap-1 rounded-xl border border-red-300 px-3 text-[12px] font-semibold text-red-600 disabled:opacity-50 dark:border-red-800 dark:text-red-400">
              <Trash2 size={15} aria-hidden="true" />{t('libraryCacheSettings.clear')}
            </button>
          </div>
        ))}
        <button type="button" disabled={clearing || stats?.totalBytes == null}
          onClick={() => { setConfirmType('all'); setClearStatus('') }}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-300 bg-red-50/50 px-3 text-[13px] font-semibold text-red-600 disabled:opacity-50 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          <Trash2 size={16} aria-hidden="true" />{t('libraryCacheSettings.clearAll')}
        </button>
        <p className="text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.clearNote')}</p>
        {stats && !stats.imageCacheAvailable && <p className="text-[11px] text-amber-600" role="status">{t('libraryCacheSettings.partial')}</p>}
        {clearStatus && <p className="text-[12px] text-[var(--shadow-text-secondary)]" role="status">{t(`libraryCacheSettings.${clearStatus}`)}</p>}
      </SurfaceCard>

      <SurfaceCard className="flex items-start gap-3 p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
        <p className="text-[12px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.protectedNow')}</p>
      </SurfaceCard>

      {confirmType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="shadow-cache-clear-title">
          <div className="w-full max-w-[360px] rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 shadow-xl">
            <h3 id="shadow-cache-clear-title" className="text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.confirmTitle')}</h3>
            <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{t('libraryCacheSettings.confirmBody', { type: confirmLabel })}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" disabled={clearing} onClick={() => setConfirmType('')}
                className="min-h-11 rounded-xl border border-[var(--shadow-border)] text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t('libraryCacheSettings.cancel')}</button>
              <button type="button" disabled={clearing} onClick={handleClear}
                className="min-h-11 rounded-xl bg-red-600 px-3 text-[13px] font-bold text-white disabled:opacity-60">{t(`libraryCacheSettings.${clearing ? 'clearing' : 'deleteNow'}`)}</button>
            </div>
            {clearStatus === 'clearFailed' && <p className="mt-3 text-[12px] text-red-500" role="alert">{t('libraryCacheSettings.clearFailed')}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
