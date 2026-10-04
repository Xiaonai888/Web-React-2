import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Download, FolderOpen, ChevronRight, WifiOff } from 'lucide-react'
import { getOfflineReaderAccountId } from '../../utils/offlineReaderContent'
import { listOfflineEpisodes, loadOfflineEpisode } from '../../utils/offlineReadingStorage'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('librarySections', {
  en: { purchased: 'Purchased', downloads: 'Downloads', purchasedInfo: 'Your purchased PDF and eBooks', downloadsInfo: 'Stories saved on this device', viewAll: 'View All', noPurchases: 'No purchased books yet', noDownloads: 'No downloaded stories yet', login: 'Sign in to view your purchases and downloads.', loading: 'Loading downloads…', failed: 'Unable to load downloaded stories', novel: 'Novel', manga: 'Manga', chat: 'Chat Story', episodes: '{{count}} episodes', read: 'Read online', download: 'Download file', open: 'Open offline downloads', offlineTitle: 'Offline mode', offlineInfo: 'Only content saved on this device can be opened without internet.', offlineTypes: 'Novel, Manga, Chat Story and saved PDF are available offline.', internetRequired: 'Purchased items that were not saved offline and other Shadow pages require internet.', pdfDownloadFailed: 'Unable to download this PDF', pdfUnavailable: 'PDF is unavailable' },
  km: { purchased: 'បានទិញ', downloads: 'បានទាញយក', purchasedInfo: 'PDF និង eBook ដែលអ្នកបានទិញ', downloadsInfo: 'រឿងដែលបានរក្សាទុកក្នុងឧបករណ៍នេះ', viewAll: 'មើលទាំងអស់', noPurchases: 'មិនទាន់មានសៀវភៅដែលបានទិញ', noDownloads: 'មិនទាន់មានរឿងដែលបានទាញយក', login: 'សូមចូលគណនីដើម្បីមើលការទិញ និងការទាញយក។', loading: 'កំពុងផ្ទុករឿងដែលបានទាញយក…', failed: 'មិនអាចផ្ទុករឿងដែលបានទាញយក', novel: 'ប្រលោមលោក', manga: 'Manga', chat: 'Chat Story', episodes: '{{count}} ភាគ', read: 'អាន Online', download: 'ទាញយកឯកសារ', open: 'បើករឿង Offline', offlineTitle: 'កំពុងប្រើ Offline', offlineInfo: 'ពេលគ្មានអ៊ីនធឺណិត អ្នកអាចបើកបានតែមាតិកាដែលបានរក្សាទុកក្នុងឧបករណ៍នេះ។', offlineTypes: 'អាចអាន Offline បាន៖ Novel, Manga, Chat Story និង PDF ដែលបានរក្សាទុក។', internetRequired: 'របស់ដែលបានទិញតែមិនទាន់រក្សាទុក Offline និងទំព័រផ្សេងៗរបស់ Shadow ត្រូវការអ៊ីនធឺណិត។', pdfDownloadFailed: 'មិនអាចទាញយក PDF នេះបានទេ', pdfUnavailable: 'PDF នេះមិនអាចប្រើបានទេ' },
  zh: { purchased: '已购买', downloads: '已下载', purchasedInfo: '您购买的 PDF 和电子书', downloadsInfo: '保存在此设备上的作品', viewAll: '查看全部', noPurchases: '暂无已购书籍', noDownloads: '暂无下载的作品', login: '请登录后查看购买和下载内容。', loading: '正在加载下载内容…', failed: '无法加载下载的作品', novel: '小说', manga: '漫画', chat: '聊天故事', episodes: '{{count}} 章', read: '在线阅读', download: '下载文件', open: '打开离线下载', offlineTitle: '离线模式', offlineInfo: '没有网络时，只能打开已保存在此设备上的内容。', offlineTypes: '离线可用：小说、漫画、Chat Story 和已保存的 PDF。', internetRequired: '未保存离线的已购内容和 Shadow 其他页面需要联网。', pdfDownloadFailed: '无法下载此 PDF', pdfUnavailable: 'PDF 不可用' },
  ja: { purchased: '購入済み', downloads: 'ダウンロード', purchasedInfo: '購入した PDF と電子書籍', downloadsInfo: 'この端末に保存した作品', viewAll: 'すべて見る', noPurchases: '購入した本はありません', noDownloads: 'ダウンロードした作品はありません', login: '購入とダウンロードを確認するにはログインしてください。', loading: 'ダウンロードを読み込み中…', failed: 'ダウンロードを読み込めません', novel: '小説', manga: 'マンガ', chat: 'チャットストーリー', episodes: '{{count}} 話', read: 'オンラインで読む', download: 'ファイルをダウンロード', open: 'オフラインダウンロードを開く', offlineTitle: 'オフラインモード', offlineInfo: 'インターネットがない場合、この端末に保存したコンテンツのみ開けます。', offlineTypes: 'オフライン対応：小説、マンガ、Chat Story、保存済み PDF。', internetRequired: 'オフライン保存していない購入済みコンテンツや Shadow のその他のページにはインターネットが必要です。', pdfDownloadFailed: 'この PDF をダウンロードできません', pdfUnavailable: 'PDF を利用できません' },
  ko: { purchased: '구매 내역', downloads: '다운로드', purchasedInfo: '구매한 PDF 및 전자책', downloadsInfo: '이 기기에 저장된 작품', viewAll: '모두 보기', noPurchases: '구매한 책이 없습니다', noDownloads: '다운로드한 작품이 없습니다', login: '구매 및 다운로드 내역을 보려면 로그인하세요.', loading: '다운로드 불러오는 중…', failed: '다운로드한 작품을 불러올 수 없습니다', novel: '소설', manga: '만화', chat: '채팅 스토리', episodes: '{{count}} 화', read: '온라인 읽기', download: '파일 다운로드', open: '오프라인 다운로드 열기', offlineTitle: '오프라인 모드', offlineInfo: '인터넷이 없을 때는 이 기기에 저장된 콘텐츠만 열 수 있습니다.', offlineTypes: '오프라인 사용 가능: 소설, 만화, Chat Story, 저장된 PDF.', internetRequired: '오프라인으로 저장하지 않은 구매 콘텐츠와 Shadow의 다른 페이지는 인터넷이 필요합니다.', pdfDownloadFailed: '이 PDF를 다운로드할 수 없습니다', pdfUnavailable: 'PDF를 사용할 수 없습니다' },
})

function accessRights(value) {
  const rule = String(value || '').toLowerCase().replace(/[_-]/g, ' ')
  const noDownload = /\b(?:no|not|without)\s+download\b|\bread\s+only\b|\bonline\s+only\b/.test(rule)
  const download = !noDownload && /\bdownload\b/.test(rule)
  return { read: true, download }
}

function typeOfStory(value) {
  const valueText = String(value || '').toLowerCase().replace(/[- ]/g, '_')
  return valueText.includes('chat') ? 'chat' : /manga|comic|manhwa/.test(valueText) ? 'manga' : 'novel'
}

function BookCover({ title, url, children }) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[var(--shadow-bg-soft)] shadow-sm">
      {url ? <img src={url} alt={title} loading="lazy" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /> : <div className="flex h-full items-center justify-center text-[var(--shadow-text-tertiary)]"><BookOpen size={26} /></div>}
      {children}
    </div>
  )
}

function PurchasedBook({ item, t, onRead }) {
  const story = item.story || item
  const rights = accessRights(story.access_rule)
  const title = story.title || story.pdf_file_name || 'PDF'
  const rawUrl = String(story.pdf_file_url || '').trim()
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : ''
  const productId = String(story.id || story.product_id || item.product_id || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const iconClass = 'absolute right-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm disabled:opacity-50'

  async function downloadPrivatePdf() {
    if (!productId || busy || !rights.download) return
    const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
    if (!token) {
      setError(t('librarySections.pdfDownloadFailed'))
      return
    }
    setBusy(true)
    setError('')
    try {
      const api = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
      const response = await fetch(`${api}/api/author-store/downloads/${encodeURIComponent(productId)}/pdf?mode=download`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || t('librarySections.pdfDownloadFailed'))
      }
      const pdf = await response.blob()
      if (!pdf.size || !pdf.type.toLowerCase().startsWith('application/pdf')) throw new Error(t('librarySections.pdfUnavailable'))
      const blobUrl = URL.createObjectURL(pdf)
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = String(story.pdf_file_name || `${title}.pdf`).split(/[\\/]/).pop()
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000)
    } catch (reason) {
      setError(reason?.message || t('librarySections.pdfDownloadFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="min-w-0">
      <BookCover title={title} url={story.cover_url}>
        {productId ? <button type="button" onClick={() => onRead(productId)} aria-label={`${t('librarySections.read')}: ${title}`} className={`${iconClass} top-1.5`}><BookOpen size={16} /></button> : null}
        {rights.download && url ? <a href={url} target="_blank" rel="noreferrer" download={story.pdf_file_name || `${title}.pdf`} aria-label={`${t('librarySections.download')}: ${title}`} className={`${iconClass} bottom-1.5`}><Download size={16} /></a> : null}
        {rights.download && !url && productId ? <button type="button" disabled={busy} onClick={downloadPrivatePdf} aria-label={`${t('librarySections.download')}: ${title}`} className={`${iconClass} bottom-1.5`}><Download size={16} /></button> : null}
      </BookCover>
      <h3 className="mt-2 line-clamp-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">{title}</h3>
      <p className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">{rights.download ? 'PDF' : 'eBook'}</p>
      {error ? <p role="alert" className="mt-1 break-words text-[10px] text-[var(--shadow-warning)]">{error}</p> : null}
    </article>
  )
}

function DownloadedStory({ item, t, onOpen }) {
  return (
    <button type="button" onClick={onOpen} aria-label={`${t('librarySections.open')}: ${item.title}`} className="group min-w-0 text-left">
      <BookCover title={item.title} url={item.cover}>
        <span className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm"><BookOpen size={15} /></span>
      </BookCover>
      <h3 className="mt-2 line-clamp-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">{item.title}</h3>
      <p className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">{t(`librarySections.${item.type}`)} · {t('librarySections.episodes', { count: item.count })}</p>
    </button>
  )
}

function Section({ title, subtitle, url, children, t }) {
  return (
    <section className="pt-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0"><h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">{title}</h2><p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">{subtitle}</p></div>
        <Link to={url} className="flex shrink-0 items-center gap-1 pt-1 text-[11px] font-bold text-[var(--shadow-text-primary)]">{t('librarySections.viewAll')}<ChevronRight size={14} /></Link>
      </div>
      {children}
    </section>
  )
}

export default function LibraryDownloadsSections({ purchases = [], loading = false, isLoggedIn = false, offlineMode = false }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const source = new URLSearchParams(location.search).get('source') === 'me' ? 'source=me&' : ''
  const accountId = getOfflineReaderAccountId()
  const [savedStories, setSavedStories] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [savedError, setSavedError] = useState('')
  const [browserOffline, setBrowserOffline] = useState(() => !navigator.onLine)
  const offline = offlineMode || browserOffline

  useEffect(() => {
    const updateConnectionState = () => setBrowserOffline(!navigator.onLine)
    window.addEventListener('online', updateConnectionState)
    window.addEventListener('offline', updateConnectionState)
    return () => {
      window.removeEventListener('online', updateConnectionState)
      window.removeEventListener('offline', updateConnectionState)
    }
  }, [])

  useEffect(() => {
    let active = true
    setSavedStories([])
    setSavedError('')
    setLoadingSaved(true)
    async function load() {
      try {
        if (!accountId) return
        const metadata = await listOfflineEpisodes({ accountId })
        const grouped = new Map()
        for (const item of metadata) {
          if (!grouped.has(item.storyId)) grouped.set(item.storyId, [])
          grouped.get(item.storyId).push(item)
        }
        const stories = await Promise.all([...grouped.entries()].map(async ([storyId, episodes]) => {
          const record = await loadOfflineEpisode({ accountId, storyId, episodeId: episodes[0].episodeId })
          return { id: storyId, title: record?.payload?.story?.title || storyId, cover: record?.payload?.story?.cover_url || record?.payload?.story?.image_url || '', type: typeOfStory(record?.storyType || episodes[0].storyType), count: episodes.length, savedAt: episodes[0].savedAt }
        }))
        if (active) setSavedStories(stories.sort((a, b) => b.savedAt - a.savedAt).slice(0, 6))
      } catch (error) {
        if (active) setSavedError(error.message || t('librarySections.failed'))
      } finally {
        if (active) setLoadingSaved(false)
      }
    }
    load()
    return () => { active = false }
  }, [accountId])

  if (!isLoggedIn) return <div className="mt-5 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-6 text-center text-sm text-[var(--shadow-text-secondary)]">{t('librarySections.login')}</div>

  const offlineDownloadsUrl = `/library/manage/offline-downloads${source ? '?source=me' : ''}`
  const downloadsUrl = offline ? offlineDownloadsUrl : `/library/collection/downloads${source ? `?${source.slice(0, -1)}` : ''}`

  return (
    <>
      {offline ? (
        <section className="mt-5 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)]">
              <WifiOff size={17} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('librarySections.offlineTitle')}</h2>
              <p className="mt-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{t('librarySections.offlineInfo')}</p>
              <p className="mt-2 text-[11px] font-semibold leading-5 text-[var(--shadow-text-primary)]">{t('librarySections.offlineTypes')}</p>
              <p className="mt-1 text-[10px] leading-4 text-[var(--shadow-text-tertiary)]">{t('librarySections.internetRequired')}</p>
              <Link to={offlineDownloadsUrl} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-3 py-2 text-[11px] font-bold text-[var(--shadow-text-primary)]">
                {t('librarySections.open')}
                <ChevronRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {!offline ? (
        <Section title={t('librarySections.purchased')} subtitle={t('librarySections.purchasedInfo')} url={`/library/collection/purchased${source ? `?${source.slice(0, -1)}` : ''}`} t={t}>
          {loading ? <p className="py-6 text-center text-sm text-[var(--shadow-text-secondary)]">{t('librarySections.loading')}</p> : purchases.length ? <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">{purchases.slice(0, 6).map((item) => <PurchasedBook key={item.id || item.story_id} item={item} t={t} onRead={(id) => navigate(`/library/collection/purchased?${source}read=${encodeURIComponent(id)}`)} />)}</div> : <div className="flex items-center gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]"><FolderOpen size={18}/>{t('librarySections.noPurchases')}</div>}
        </Section>
      ) : null}

      <Section title={t('librarySections.downloads')} subtitle={t('librarySections.downloadsInfo')} url={downloadsUrl} t={t}>
        {loadingSaved ? <p className="py-6 text-center text-sm text-[var(--shadow-text-secondary)]">{t('librarySections.loading')}</p> : savedError ? <p role="alert" className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]">{savedError}</p> : savedStories.length ? <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">{savedStories.map((item) => <DownloadedStory key={item.id} item={item} t={t} onOpen={() => navigate(`/library/manage/offline-downloads?storyId=${encodeURIComponent(item.id)}${source ? '&source=me' : ''}`)} />)}</div> : <div className="flex items-center gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]"><FolderOpen size={18}/>{t('librarySections.noDownloads')}</div>}
      </Section>
    </>
  )
}
