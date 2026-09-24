import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Download, FolderOpen, ChevronRight } from 'lucide-react'
import { getOfflineReaderAccountId } from '../../utils/offlineReaderContent'
import { listOfflineEpisodes, loadOfflineEpisode } from '../../utils/offlineReadingStorage'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('librarySections', {
  en: { purchased: 'Purchased', downloads: 'Downloads', purchasedInfo: 'Your purchased PDF and eBooks', downloadsInfo: 'Stories saved on this device', viewAll: 'View All', noPurchases: 'No purchased books yet', noDownloads: 'No downloaded stories yet', login: 'Sign in to view your purchases and downloads.', loading: 'Loading downloads…', failed: 'Unable to load downloaded stories', novel: 'Novel', manga: 'Manga', chat: 'Chat Story', episodes: '{{count}} episodes', read: 'Read online', download: 'Download file', open: 'Open offline downloads' },
  km: { purchased: 'បានទិញ', downloads: 'បានទាញយក', purchasedInfo: 'PDF និង eBook ដែលអ្នកបានទិញ', downloadsInfo: 'រឿងដែលបានរក្សាទុកក្នុងឧបករណ៍នេះ', viewAll: 'មើលទាំងអស់', noPurchases: 'មិនទាន់មានសៀវភៅដែលបានទិញ', noDownloads: 'មិនទាន់មានរឿងដែលបានទាញយក', login: 'សូមចូលគណនីដើម្បីមើលការទិញ និងការទាញយក។', loading: 'កំពុងផ្ទុករឿងដែលបានទាញយក…', failed: 'មិនអាចផ្ទុករឿងដែលបានទាញយក', novel: 'ប្រលោមលោក', manga: 'Manga', chat: 'Chat Story', episodes: '{{count}} ភាគ', read: 'អាន Online', download: 'ទាញយកឯកសារ', open: 'បើករឿង Offline' },
  zh: { purchased: '已购买', downloads: '已下载', purchasedInfo: '您购买的 PDF 和电子书', downloadsInfo: '保存在此设备上的作品', viewAll: '查看全部', noPurchases: '暂无已购书籍', noDownloads: '暂无已下载作品', login: '请登录后查看购买和下载内容。', loading: '正在加载下载内容…', failed: '无法加载下载的作品', novel: '小说', manga: '漫画', chat: '聊天故事', episodes: '{{count}} 章', read: '在线阅读', download: '下载文件', open: '打开离线下载' },
  ja: { purchased: '購入済み', downloads: 'ダウンロード', purchasedInfo: '購入した PDF と電子書籍', downloadsInfo: 'この端末に保存した作品', viewAll: 'すべて見る', noPurchases: '購入した本はありません', noDownloads: 'ダウンロードした作品はありません', login: '購入とダウンロードを確認するにはログインしてください。', loading: 'ダウンロードを読み込み中…', failed: 'ダウンロードを読み込めません', novel: '小説', manga: 'マンガ', chat: 'チャットストーリー', episodes: '{{count}} 話', read: 'オンラインで読む', download: 'ファイルをダウンロード', open: 'オフラインダウンロードを開く' },
  ko: { purchased: '구매 내역', downloads: '다운로드', purchasedInfo: '구매한 PDF 및 전자책', downloadsInfo: '이 기기에 저장한 작품', viewAll: '모두 보기', noPurchases: '구매한 책이 없습니다', noDownloads: '다운로드한 작품이 없습니다', login: '구매 및 다운로드 내역을 보려면 로그인하세요.', loading: '다운로드 불러오는 중…', failed: '다운로드한 작품을 불러올 수 없습니다', novel: '소설', manga: '만화', chat: '채팅 스토리', episodes: '{{count}} 화', read: '온라인 읽기', download: '파일 다운로드', open: '오프라인 다운로드 열기' },
})

function accessRights(value) {
  const rule = String(value || '').toLowerCase().replace(/[_-]/g, ' ')
  const readOnly = /\b(?:no|not|without)\s+download\b|\bread\s+only\b|\bonline\s+only\b/.test(rule)
  return { read: readOnly || rule.includes('read'), download: !readOnly && (!rule.includes('read') || rule.includes('download')) }
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

function PurchasedBook({ item, t }) {
  const story = item.story || item
  const rights = accessRights(story.access_rule)
  const title = story.title || story.pdf_file_name || 'PDF'
  const url = String(story.pdf_file_url || '')
  const iconClass = 'absolute right-1.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-sm'
  return (
    <article className="min-w-0">
      <BookCover title={title} url={story.cover_url}>
        {rights.read && url ? <a href={url} target="_blank" rel="noreferrer" aria-label={`${t('librarySections.read')}: ${title}`} className={`${iconClass} top-1.5`}><BookOpen size={16} /></a> : null}
        {rights.download && url ? <a href={url} target="_blank" rel="noreferrer" download={story.pdf_file_name || `${title}.pdf`} aria-label={`${t('librarySections.download')}: ${title}`} className={`${iconClass} bottom-1.5`}><Download size={16} /></a> : null}
      </BookCover>
      <h3 className="mt-2 line-clamp-2 text-[12px] font-bold text-[var(--shadow-text-primary)]">{title}</h3>
      <p className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">{rights.read && !rights.download ? 'eBook' : 'PDF'}</p>
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
        <div className="min-w-0"><h2 className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{title}</h2><p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">{subtitle}</p></div>
        <Link to={url} className="flex shrink-0 items-center gap-1 pt-1 text-[11px] font-bold text-[var(--shadow-text-primary)]">{t('librarySections.viewAll')}<ChevronRight size={14} /></Link>
      </div>
      {children}
    </section>
  )
}

export default function LibraryDownloadsSections({ purchases = [], loading = false, isLoggedIn = false }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const accountId = getOfflineReaderAccountId()
  const [savedStories, setSavedStories] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [savedError, setSavedError] = useState('')

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

  return (
    <>
      <Section title={t('librarySections.purchased')} subtitle={t('librarySections.purchasedInfo')} url="/library/collection/purchased" t={t}>
        {loading ? <p className="py-6 text-center text-sm text-[var(--shadow-text-secondary)]">{t('librarySections.loading')}</p> : purchases.length ? <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">{purchases.slice(0, 6).map((item) => <PurchasedBook key={item.id || item.story_id} item={item} t={t} />)}</div> : <div className="flex items-center gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]"><FolderOpen size={18}/>{t('librarySections.noPurchases')}</div>}
      </Section>
      <Section title={t('librarySections.downloads')} subtitle={t('librarySections.downloadsInfo')} url="/library/collection/downloads" t={t}>
        {loadingSaved ? <p className="py-6 text-center text-sm text-[var(--shadow-text-secondary)]">{t('librarySections.loading')}</p> : savedError ? <p role="alert" className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]">{savedError}</p> : savedStories.length ? <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">{savedStories.map((item) => <DownloadedStory key={item.id} item={item} t={t} onOpen={() => navigate('/library/manage/offline-downloads')} />)}</div> : <div className="flex items-center gap-2 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-5 text-sm text-[var(--shadow-text-secondary)]"><FolderOpen size={18}/>{t('librarySections.noDownloads')}</div>}
      </Section>
    </>
  )
}
