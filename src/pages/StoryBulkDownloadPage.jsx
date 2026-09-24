import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { getOfflineReaderAccountId } from '../utils/offlineReaderContent'
import { downloadOfflineEpisode } from '../utils/offlineEpisodeDownload'

const API_BASE_URL = 'https://shadow-backend-kucw.onrender.com'

registerTranslationNamespace('storyBulkDownload', {
  en: { title: 'Select episodes', total: 'Total {{count}} episodes', reverse: 'Reverse', selectAll: 'Select All', clear: 'Clear selection', selected: '{{count}} episodes selected', download: 'Download', downloading: 'Downloading {{done}}/{{total}}', saved: 'Downloaded {{count}} episodes', failed: '{{count}} episodes could not be downloaded', loading: 'Loading episodes…', empty: 'No episodes available', retry: 'Try again', loadFailed: 'Unable to load episodes', login: 'Please sign in to download.', offline: 'Connect to the internet to download.', nothing: 'Select at least one episode.', restricted: 'This episode is unavailable for download.', note: 'Downloads do not unlock episodes. Reading access is checked separately.', locked: 'Locked: unlock permanently before downloading.', checking: 'Checking your download access…', back: 'Back' },
  km: { title: 'ជ្រើសរើសភាគ', total: 'សរុប {{count}} ភាគ', reverse: 'ប្ដូរលំដាប់', selectAll: 'ជ្រើសទាំងអស់', clear: 'លុបការជ្រើសរើស', selected: 'បានជ្រើស {{count}} ភាគ', download: 'ទាញយក', downloading: 'កំពុងទាញយក {{done}}/{{total}}', saved: 'បានទាញយក {{count}} ភាគ', failed: 'មិនអាចទាញយក {{count}} ភាគ', loading: 'កំពុងផ្ទុកភាគ…', empty: 'មិនទាន់មានភាគ', retry: 'ព្យាយាមម្ដងទៀត', loadFailed: 'មិនអាចផ្ទុកបញ្ជីភាគ', login: 'សូមចូលគណនីដើម្បីទាញយក។', offline: 'សូមភ្ជាប់អ៊ីនធឺណិតដើម្បីទាញយក។', nothing: 'សូមជ្រើសរើសភាគយ៉ាងតិចមួយ។', restricted: 'ភាគនេះមិនអាចទាញយកបានទេ។', note: 'ការទាញយកមិនមែនជាការដោះសោទេ។ សិទ្ធិអានត្រូវផ្ទៀងផ្ទាត់ដោយឡែក។', locked: 'ភាគជាប់សោ៖ ត្រូវដោះសោអចិន្ត្រៃយ៍សិន ទើបអាចទាញយកបាន។', checking: 'កំពុងផ្ទៀងផ្ទាត់សិទ្ធិទាញយក…', back: 'ត្រឡប់ក្រោយ' },
  zh: { title: '选择章节', total: '共 {{count}} 章', reverse: '倒序', selectAll: '全选', clear: '取消选择', selected: '已选 {{count}} 章', download: '下载', downloading: '下载中 {{done}}/{{total}}', saved: '已下载 {{count}} 章', failed: '{{count}} 章下载失败', loading: '正在加载章节…', empty: '暂无章节', retry: '重试', loadFailed: '无法加载章节', login: '请登录后下载。', offline: '请联网下载。', nothing: '请至少选择一章。', restricted: '此章节无法下载。', note: '下载不等于解锁。阅读权限将另行验证。', locked: '章节已锁定：永久解锁后才能下载。', checking: '正在验证下载权限…', back: '返回' },
  ja: { title: 'エピソードを選択', total: '全 {{count}} 話', reverse: '順序を反転', selectAll: 'すべて選択', clear: '選択を解除', selected: '{{count}} 話を選択', download: 'ダウンロード', downloading: 'ダウンロード中 {{done}}/{{total}}', saved: '{{count}} 話を保存しました', failed: '{{count}} 話の保存に失敗', loading: '読み込み中…', empty: 'エピソードがありません', retry: '再試行', loadFailed: '読み込みに失敗しました', login: 'ログインしてください。', offline: 'ネットワークに接続してください。', nothing: 'エピソードを選択してください。', restricted: 'この話はダウンロードできません。', note: 'ダウンロードはロック解除ではありません。閲覧権限は別途確認されます。', locked: 'ロック中：永久解放後にダウンロードできます。', checking: 'ダウンロード権限を確認中…', back: '戻る' },
  ko: { title: '에피소드 선택', total: '총 {{count}}화', reverse: '순서 뒤집기', selectAll: '전체 선택', clear: '선택 해제', selected: '{{count}}화 선택', download: '다운로드', downloading: '다운로드 중 {{done}}/{{total}}', saved: '{{count}}화 다운로드 완료', failed: '{{count}}화 다운로드 실패', loading: '에피소드 불러오는 중…', empty: '에피소드가 없습니다', retry: '다시 시도', loadFailed: '에피소드를 불러오지 못했습니다', login: '로그인 후 다운로드하세요.', offline: '인터넷에 연결해 주세요.', nothing: '에피소드를 선택해 주세요.', restricted: '다운로드할 수 없는 에피소드입니다.', note: '다운로드는 잠금 해제가 아닙니다. 열람 권한은 별도로 확인합니다.', locked: '잠긴 에피소드: 영구 잠금 해제 후 다운로드할 수 있습니다.', checking: '다운로드 권한 확인 중…', back: '뒤로' },
})

export default function StoryBulkDownloadPage() {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [reversed, setReversed] = useState(false)
  const [selected, setSelected] = useState([])
  const [verifiedPermanent, setVerifiedPermanent] = useState({})
  const [checkingId, setCheckingId] = useState('')
  const [working, setWorking] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const controllerRef = useRef(null)
  const verifyControllerRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setLoadError(false)
    setEpisodes([])
    setSelected([])
    setVerifiedPermanent({})
    setCheckingId('')
    verifyControllerRef.current?.abort()
    verifyControllerRef.current = null
    const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
    fetch(`${API_BASE_URL}/api/public/stories/${encodeURIComponent(storyId || '')}/episodes`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok || data.ok === false || !Array.isArray(data.episodes)) throw new Error('Episodes unavailable')
        return data.episodes
      })
      .then((items) => setEpisodes(items.filter((item) => item?.id)))
      .catch(() => { if (!controller.signal.aborted) setLoadError(true) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [storyId, retry])

  useEffect(() => () => { controllerRef.current?.abort(); verifyControllerRef.current?.abort() }, [])

  const visible = useMemo(() => [...episodes].sort((a, b) => {
    const difference = Number(a.episode_number || 0) - Number(b.episode_number || 0)
    return reversed ? -difference : difference
  }), [episodes, reversed])
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
  const selectable = episodes.filter((item) => !item.is_adult && (!item.is_locked || verifiedPermanent[String(item.id)] === token && Boolean(token)))
  const selectedIds = new Set(selected)
  const allSelected = selectable.length > 0 && selectable.every((item) => selectedIds.has(String(item.id)))

  async function toggleEpisode(item) {
    if (working || checkingId || verifyControllerRef.current) return
    if (item.is_adult) { setMessage(t('storyBulkDownload.restricted')); return }
    const id = String(item.id)
    if (selectedIds.has(id)) {
      setSelected((current) => current.filter((value) => value !== id))
      setMessage('')
      return
    }
    if (item.is_locked && verifiedPermanent[id] !== token) {
      if (!token || !getOfflineReaderAccountId()) { setMessage(t('storyBulkDownload.login')); return }
      if (!navigator.onLine) { setMessage(t('storyBulkDownload.offline')); return }
      const controller = new AbortController()
      verifyControllerRef.current = controller
      setCheckingId(id)
      setMessage(t('storyBulkDownload.checking'))
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${encodeURIComponent(storyId || '')}/episodes/${encodeURIComponent(id)}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        const data = await response.json().catch(() => ({}))
        const grant = data.cache_access
        if (!response.ok || data.ok !== true || data.locked !== false ||
          String(data.story?.id || '') !== String(storyId) || String(data.episode?.id || '') !== id ||
          grant?.private_access !== true || grant?.access_type !== 'permanent' || grant?.expires_at != null) {
          throw new Error('Download access is not permanent')
        }
        if (controller.signal.aborted || (localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')) !== token) return
        setVerifiedPermanent((current) => ({ ...current, [id]: token }))
      } catch {
        if (!controller.signal.aborted) setMessage(t('storyBulkDownload.locked'))
        return
      } finally {
        if (verifyControllerRef.current === controller) verifyControllerRef.current = null
        if (!controller.signal.aborted) setCheckingId('')
      }
    }
    setSelected((current) => current.includes(id) ? current : [...current, id])
    setMessage('')
  }

  async function handleDownload() {
    if (working) return
    if (!selected.length) { setMessage(t('storyBulkDownload.nothing')); return }
    const accountId = getOfflineReaderAccountId()
    if (!accountId) { setMessage(t('storyBulkDownload.login')); return }
    if (!navigator.onLine) { setMessage(t('storyBulkDownload.offline')); return }
    const controller = new AbortController()
    controllerRef.current = controller
    setWorking(true)
    setProgress(0)
    setMessage('')
    let completed = 0
    let failed = 0
    try {
      for (const episodeId of selected) {
        if (controller.signal.aborted) break
        try {
          await downloadOfflineEpisode({ accountId, storyId, episodeId, signal: controller.signal, allowedAccess: ['free', 'permanent'] })
          completed += 1
        } catch {
          if (controller.signal.aborted) break
          failed += 1
        }
        if (!controller.signal.aborted) setProgress(completed + failed)
      }
      if (!controller.signal.aborted) {
        setMessage([completed ? t('storyBulkDownload.saved', { count: completed }) : '', failed ? t('storyBulkDownload.failed', { count: failed }) : ''].filter(Boolean).join(' · '))
        if (failed === 0) setSelected([])
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null
      if (!controller.signal.aborted) setWorking(false)
    }
  }

  return (
    <div className="app-page min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col bg-[var(--shadow-bg-surface)]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4">
          <button type="button" onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center rounded-full" aria-label={t('storyBulkDownload.back')}><i className="fa-solid fa-chevron-left text-[17px]" /></button>
          <h1 className="text-[17px] font-bold">{t('storyBulkDownload.title')}</h1>
          <span className="w-11" />
        </header>
        <div className="flex items-center justify-between gap-3 px-4 py-4 text-[13px] sm:px-6">
          <span>{t('storyBulkDownload.total', { count: episodes.length })}</span>
          <button type="button" disabled={working} onClick={() => setReversed((value) => !value)} className="flex min-h-9 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-3 disabled:opacity-50"><i className="fa-solid fa-arrow-down-up text-[12px]" />{t('storyBulkDownload.reverse')}</button>
        </div>
        <main className="flex-1 px-4 pb-56 sm:px-6">
          {loading ? <p className="py-12 text-center text-[var(--shadow-text-secondary)]">{t('storyBulkDownload.loading')}</p> : loadError ? <div className="flex flex-col items-center gap-4 py-12"><p>{t('storyBulkDownload.loadFailed')}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="rounded-full border border-[var(--shadow-border)] px-5 py-2">{t('storyBulkDownload.retry')}</button></div> : !visible.length ? <p className="py-12 text-center text-[var(--shadow-text-secondary)]">{t('storyBulkDownload.empty')}</p> : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {visible.map((episode) => {
                const active = selectedIds.has(String(episode.id))
                const locked = Boolean(episode.is_locked && verifiedPermanent[String(episode.id)] !== token)
                return <button key={episode.id} type="button" disabled={working || Boolean(checkingId) || episode.is_adult} onClick={() => void toggleEpisode(episode)} aria-pressed={active} aria-label={`${episode.episode_number}${locked ? `, ${t('storyBulkDownload.locked')}` : ''}`} className={`relative flex h-[54px] items-center justify-center rounded-lg border text-[15px] font-medium transition-colors disabled:opacity-50 ${active ? 'border-[#ed315b] bg-[#ffedf1] text-[#d51b46] dark:bg-[#6b1c36] dark:text-[#ffd8e1]' : 'border-transparent bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'}`}>
                  {checkingId === String(episode.id) && <i className="fa-solid fa-spinner fa-spin absolute right-2 top-2 text-[10px]" aria-hidden="true" />}
                  {locked && <i className="fa-solid fa-lock absolute left-2 top-2 text-[10px] text-[var(--shadow-text-tertiary)]" aria-hidden="true" />}
                  {episode.episode_number}
                </button>
              })}
            </div>
          )}
        </main>
        <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-3xl border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 sm:px-6">
          <div className="mb-3 text-center text-[14px] font-semibold">{t('storyBulkDownload.selected', { count: selected.length })}</div>
          {message && <p role="status" className="mb-3 text-center text-[12px] text-[var(--shadow-text-secondary)]">{message}</p>}
          <p className="mb-3 text-center text-[11px] text-[var(--shadow-text-secondary)]">{t('storyBulkDownload.note')}</p>
          <div className="flex items-center gap-3">
            <button type="button" disabled={working || Boolean(checkingId) || loading || loadError || !selectable.length} onClick={() => { setSelected(allSelected ? [] : selectable.map((item) => String(item.id))); setMessage('') }} className="min-h-12 shrink-0 rounded-full border border-[var(--shadow-border)] px-4 text-[12px] font-semibold disabled:opacity-50">{allSelected ? t('storyBulkDownload.clear') : t('storyBulkDownload.selectAll')}</button>
            <button type="button" disabled={working || Boolean(checkingId) || !selected.length} onClick={handleDownload} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#eb315b] px-4 text-[14px] font-bold text-white disabled:opacity-50"><i className="fa-solid fa-download" />{working ? t('storyBulkDownload.downloading', { done: progress, total: selected.length }) : `${t('storyBulkDownload.download')} (${selected.length})`}</button>
          </div>
        </footer>
      </div>
    </div>
  )
}
