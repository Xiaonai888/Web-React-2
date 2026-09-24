import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, Download, FolderOpen } from 'lucide-react'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { getOfflineReaderAccountId } from '../utils/offlineReaderContent'
import { listOfflineEpisodes, loadOfflineEpisode } from '../utils/offlineReadingStorage'

registerTranslationNamespace('libraryCollection', {
  en: {
    back: 'Back to Library', purchased: 'Purchased', downloads: 'Downloads',
    purchasedSubtitle: 'Books and PDFs you have purchased', downloadsSubtitle: 'Stories saved on this device',
    all: 'All', download: 'Download', readOnline: 'Read Online', both: 'Both',
    novel: 'Novel', manga: 'Manga', chatStory: 'Chat Story',
    noPurchases: 'No purchased books yet', noDownloads: 'No downloaded stories yet',
    loading: 'Loading your library…', signIn: 'Sign in to view your library.',
    failed: 'Unable to load your library.', fileNotReady: 'This file is not available yet.',
    episodes: '{{count}} episodes', openDownloads: 'Open offline downloads',
    read: 'Read online', downloadFile: 'Download file',
  },
  km: {
    back: 'ត្រឡប់ទៅ Library', purchased: 'បានទិញ', downloads: 'បានទាញយក',
    purchasedSubtitle: 'សៀវភៅ និង PDF ដែលអ្នកបានទិញ', downloadsSubtitle: 'រឿងដែលបានរក្សាទុកលើឧបករណ៍នេះ',
    all: 'ទាំងអស់', download: 'ទាញយក', readOnline: 'អាន Online', both: 'ទាំងពីរ',
    novel: 'ប្រលោមលោក', manga: 'Manga', chatStory: 'Chat Story',
    noPurchases: 'មិនទាន់មានសៀវភៅដែលបានទិញ', noDownloads: 'មិនទាន់មានរឿងដែលបានទាញយក',
    loading: 'កំពុងផ្ទុក Library…', signIn: 'សូមចូលគណនីដើម្បីមើល Library។',
    failed: 'មិនអាចផ្ទុក Library បានទេ។', fileNotReady: 'ឯកសារនេះមិនទាន់អាចប្រើបានទេ។',
    episodes: '{{count}} ភាគ', openDownloads: 'បើកការទាញយក Offline',
    read: 'អាន Online', downloadFile: 'ទាញយកឯកសារ',
  },
  zh: {
    back: '返回书库', purchased: '已购买', downloads: '已下载',
    purchasedSubtitle: '您购买的图书和 PDF', downloadsSubtitle: '保存在此设备上的作品',
    all: '全部', download: '下载', readOnline: '在线阅读', both: '两者皆可',
    novel: '小说', manga: '漫画', chatStory: '聊天故事',
    noPurchases: '暂无已购图书', noDownloads: '暂无下载的作品',
    loading: '正在加载书库…', signIn: '请登录以查看书库。',
    failed: '无法加载书库。', fileNotReady: '文件尚未可用。',
    episodes: '{{count}} 章', openDownloads: '打开离线下载',
    read: '在线阅读', downloadFile: '下载文件',
  },
  ja: {
    back: 'ライブラリに戻る', purchased: '購入済み', downloads: 'ダウンロード',
    purchasedSubtitle: '購入した書籍と PDF', downloadsSubtitle: 'この端末に保存した作品',
    all: 'すべて', download: 'ダウンロード', readOnline: 'オンラインで読む', both: '両方',
    novel: '小説', manga: 'マンガ', chatStory: 'チャットストーリー',
    noPurchases: '購入した書籍はありません', noDownloads: 'ダウンロードした作品はありません',
    loading: 'ライブラリを読み込み中…', signIn: 'ログインしてライブラリを表示してください。',
    failed: 'ライブラリを読み込めません。', fileNotReady: 'ファイルはまだ利用できません。',
    episodes: '{{count}} 話', openDownloads: 'オフラインダウンロードを開く',
    read: 'オンラインで読む', downloadFile: 'ファイルをダウンロード',
  },
  ko: {
    back: '라이브러리로 돌아가기', purchased: '구매 내역', downloads: '다운로드',
    purchasedSubtitle: '구매한 책과 PDF', downloadsSubtitle: '이 기기에 저장한 작품',
    all: '전체', download: '다운로드', readOnline: '온라인 읽기', both: '둘 다',
    novel: '소설', manga: '만화', chatStory: '채팅 스토리',
    noPurchases: '구매한 책이 없습니다', noDownloads: '다운로드한 작품이 없습니다',
    loading: '라이브러리 불러오는 중…', signIn: '라이브러리를 보려면 로그인하세요.',
    failed: '라이브러리를 불러올 수 없습니다.', fileNotReady: '파일을 아직 사용할 수 없습니다.',
    episodes: '{{count}} 화', openDownloads: '오프라인 다운로드 열기',
    read: '온라인 읽기', downloadFile: '파일 다운로드',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')

const purchaseFilters = ['all', 'download', 'readOnline', 'both']
const downloadFilters = ['all', 'novel', 'manga', 'chatStory']

function accessType(value) {
  const text = String(value || '').toLowerCase().replace(/[_-]/g, ' ')
  if (/\b(?:no|not|without)\s+download\b|\bread\s+only\b|\bonline\s+only\b/.test(text)) return 'readOnline'
  if (text.includes('read') && text.includes('download')) return 'both'
  if (text.includes('read')) return 'readOnline'
  return 'download'
}

function storyCategory(value) {
  const type = String(value || '').toLowerCase().replace(/[- ]/g, '_')
  return type.includes('chat') ? 'chatStory' : type.includes('manga') || type.includes('comic') || type.includes('manhwa') ? 'manga' : 'novel'
}

function Cover({ title, cover, children }) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[var(--shadow-bg-soft)] shadow-sm">
      {cover ? <img src={cover} alt={title} loading="lazy" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /> :
        <div className="flex h-full items-center justify-center text-[var(--shadow-text-tertiary)]"><BookOpen size={28} /></div>}
      {children}
    </div>
  )
}

function PurchaseCard({ item, t, token }) {
  const rule = accessType(item.access_rule)
  const canRead = rule === 'readOnline' || rule === 'both'
  const canDownload = rule === 'download' || rule === 'both'
  const url = String(item.pdf_file_url || '')
  const id = String(item.product_id || '')
  const title = item.title || item.pdf_file_name || 'PDF'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const iconClass = 'absolute right-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm disabled:opacity-50'

  async function accessPrivatePdf(mode) {
    if (busy || !id || !token) return
    const reader = mode === 'read' ? window.open('', '_blank') : null
    if (reader) reader.opener = null
    if (mode === 'read' && !reader) {
      setError(t('libraryCollection.fileNotReady'))
      return
    }
    setBusy(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/author-store/downloads/${encodeURIComponent(id)}/pdf?mode=${mode}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.message || t('libraryCollection.fileNotReady'))
      }
      const pdf = await response.blob()
      if (pdf.type !== 'application/pdf' || !pdf.size) throw new Error(t('libraryCollection.fileNotReady'))
      const blobUrl = URL.createObjectURL(pdf)
      if (mode === 'read') {
        if (reader.closed) {
          URL.revokeObjectURL(blobUrl)
          return
        }
        reader.location.replace(blobUrl)
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 60 * 1000)
      } else {
        const anchor = document.createElement('a')
        anchor.href = blobUrl
        anchor.download = String(item.pdf_file_name || `${title}.pdf`).split(/[\\/]/).pop()
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000)
      }
    } catch (reason) {
      if (reader && !reader.closed) reader.close()
      setError(reason?.message || t('libraryCollection.fileNotReady'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="min-w-0">
      <Cover title={title} cover={item.cover_url}>
        {canRead && url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${t('libraryCollection.read')}: ${title}`} title={t('libraryCollection.read')} className={`${iconClass} top-1.5`}><BookOpen size={16} /></a> : null}
        {canRead && !url && id ? <button type="button" disabled={busy} onClick={() => accessPrivatePdf('read')} aria-label={`${t('libraryCollection.read')}: ${title}`} title={t('libraryCollection.read')} className={`${iconClass} top-1.5`}><BookOpen size={16} /></button> : null}
        {canDownload && url ? <a href={url} download={item.pdf_file_name || `${title}.pdf`} target="_blank" rel="noreferrer" aria-label={`${t('libraryCollection.downloadFile')}: ${title}`} title={t('libraryCollection.downloadFile')} className={`${iconClass} bottom-1.5`}><Download size={16} /></a> : null}
        {canDownload && !url && id ? <button type="button" disabled={busy} onClick={() => accessPrivatePdf('download')} aria-label={`${t('libraryCollection.downloadFile')}: ${title}`} title={t('libraryCollection.downloadFile')} className={`${iconClass} bottom-1.5`}><Download size={16} /></button> : null}
      </Cover>
      <h2 className="mt-2 line-clamp-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">{title}</h2>
      <p className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">{rule === 'readOnline' ? 'eBook' : 'PDF'}</p>
      {!url && !id ? <p className="mt-1 text-[10px] text-[var(--shadow-warning)]">{t('libraryCollection.fileNotReady')}</p> : null}
      {error ? <p role="alert" className="mt-1 break-words text-[10px] text-[var(--shadow-warning)]">{error}</p> : null}
    </article>
  )
}

function DownloadCard({ item, t, onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="min-w-0 text-left">
      <Cover title={item.title} cover={item.cover}>
        <span className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm"><BookOpen size={16} /></span>
      </Cover>
      <h2 className="mt-2 line-clamp-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">{item.title}</h2>
      <p className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">{t(`libraryCollection.${item.type}`)} · {t('libraryCollection.episodes', { count: item.episodes })}</p>
    </button>
  )
}

export default function LibraryCollectionPage() {
  const { section } = useParams()
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const purchased = section === 'purchased'
  const [filter, setFilter] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
  const accountId = getOfflineReaderAccountId()

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setFilter('all')
    setItems([])
    setLoading(true)
    setError('')

    async function load() {
      try {
        if (!token || (!purchased && !accountId)) {
          if (active) setError(t('libraryCollection.signIn'))
          return
        }
        if (purchased) {
          const response = await fetch(`${API_BASE_URL}/api/author-store/downloads/my`, {
            headers: { Authorization: `Bearer ${token}` }, signal: controller.signal,
          })
          const data = await response.json().catch(() => ({}))
          if (!response.ok || data.ok === false || !Array.isArray(data.downloads)) throw new Error(data.message || t('libraryCollection.failed'))
          if (active) setItems(data.downloads)
        } else {
          const metadata = await listOfflineEpisodes({ accountId })
          const map = new Map()
          for (const entry of metadata) {
            if (!map.has(entry.storyId)) map.set(entry.storyId, [])
            map.get(entry.storyId).push(entry)
          }
          const groups = await Promise.all([...map.entries()].map(async ([storyId, episodes]) => {
            const record = await loadOfflineEpisode({ accountId, storyId, episodeId: episodes[0].episodeId })
            const story = record?.payload?.story || {}
            return {
              id: storyId, title: story.title || storyId, cover: story.cover_url || story.image_url || '',
              type: storyCategory(record?.storyType || episodes[0].storyType), episodes: episodes.length,
              savedAt: episodes[0].savedAt,
            }
          }))
          if (active) setItems(groups.sort((a, b) => b.savedAt - a.savedAt))
        }
      } catch (reason) {
        if (active && reason.name !== 'AbortError') setError(reason.message || t('libraryCollection.failed'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false; controller.abort() }
  }, [section, purchased, token, accountId])

  const filtered = useMemo(() => filter === 'all' ? items : items.filter((item) => purchased ? accessType(item.access_rule) === filter : item.type === filter), [filter, items, purchased])
  const filters = purchased ? purchaseFilters : downloadFilters

  return (
    <div className="app-page min-h-screen pb-[88px]">
      <header className="app-nav sticky top-0 z-40 border-b border-[var(--shadow-border)]">
        <div className="flex h-14 items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(-1)} aria-label={t('libraryCollection.back')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]"><ChevronLeft size={20} /></button>
          <h1 className="min-w-0 text-[17px] font-extrabold text-[var(--shadow-text-primary)]">{t(`libraryCollection.${purchased ? 'purchased' : 'downloads'}`)}</h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[780px] px-4 pb-8 pt-5 sm:px-5">
        <p className="text-[12px] text-[var(--shadow-text-secondary)]">{t(`libraryCollection.${purchased ? 'purchasedSubtitle' : 'downloadsSubtitle'}`)}</p>
        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
          {filters.map((key) => <button key={key} type="button" onClick={() => setFilter(key)} aria-pressed={filter === key} className="shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold" style={{ background: filter === key ? 'var(--shadow-text-primary)' : 'var(--shadow-bg-soft)', color: filter === key ? 'var(--shadow-bg-page)' : 'var(--shadow-text-secondary)', borderColor: filter === key ? 'var(--shadow-text-primary)' : 'var(--shadow-border)' }}>{t(`libraryCollection.${key}`)}</button>)}
        </div>
        {loading ? <p role="status" className="mt-7 text-center text-sm text-[var(--shadow-text-secondary)]">{t('libraryCollection.loading')}</p> : error ? <p role="alert" className="mt-6 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]">{error}</p> : filtered.length ?
          <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {filtered.map((item) => purchased ? <PurchaseCard key={item.id} item={item} t={t} token={token} /> : <DownloadCard key={item.id} item={item} t={t} onOpen={() => navigate('/library/manage/offline-downloads')} />)}
          </div> : <div className="mt-5 flex flex-col items-center rounded-3xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-5 py-10 text-center text-[var(--shadow-text-secondary)]"><FolderOpen size={28} /><p className="mt-3 text-sm font-semibold">{t(`libraryCollection.${purchased ? 'noPurchases' : 'noDownloads'}`)}</p></div>}
      </main>
    </div>
  )
}
