import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChatStoryReader from '../chat-story/ChatStoryReader'
import OfflinePdfReader from './OfflinePdfReader'
import { listOfflinePdfs, deleteOfflinePdf } from '../../utils/offlinePdfStorage'
import { openOfflineReaderEpisode, getOfflineReaderAccountId } from '../../utils/offlineReaderContent'
import { deleteOfflineEpisode, deleteOfflineStory, listOfflineEpisodes, loadOfflineEpisode } from '../../utils/offlineReadingStorage'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('offlineDownloadsPanel', {
  en: { login: 'Sign in to the account that saved these episodes.', empty: 'No offline episodes yet. Download an episode from the Reader menu.', open: 'Read offline', remove: 'Delete episode', removeStory: 'Delete entire story', removeConfirm: 'Delete this downloaded episode from this device?', removeStoryConfirm: 'Delete all downloaded episodes of this story from this device?', loading: 'Loading downloads…', error: 'Unable to open this offline episode.', expired: 'Offline reading access has expired.', back: 'Back to downloads', count: '{{count}} episodes', storage: 'Stored on this device', refresh: 'Refresh', notFound: 'The downloaded episode is no longer available.', episode: 'Episode {{number}}', savedPdfs: 'Saved PDFs', removePdf: 'Delete PDF', removePdfConfirm: 'Delete this saved PDF from this device?', },
  km: { login: 'សូមចូលគណនីដែលបានទាញយកភាគរឿងទាំងនេះ។', empty: 'មិនទាន់មានរឿង Offline ទេ។ សូមទាញយកភាគពី Menu ក្នុង Reader។', open: 'អាន Offline', remove: 'លុបភាគនេះ', removeStory: 'លុបរឿងទាំងមូល', removeConfirm: 'លុបភាគដែលបានទាញយកនេះចេញពីឧបករណ៍?', removeStoryConfirm: 'លុបភាគទាំងអស់នៃរឿងនេះចេញពីឧបករណ៍?', loading: 'កំពុងបង្ហាញរឿងដែលបានទាញយក…', error: 'មិនអាចបើកភាគ Offline នេះបានទេ។', expired: 'សិទ្ធិអាន Offline បានផុតកំណត់។', back: 'ត្រឡប់ទៅបញ្ជីទាញយក', count: '{{count}} ភាគ', storage: 'រក្សាទុកក្នុងឧបករណ៍នេះ', refresh: 'ផ្ទុកឡើងវិញ', notFound: 'រកមិនឃើញភាគដែលបានទាញយកទុកទៀតទេ។', episode: 'ភាគទី {{number}}', savedPdfs: 'PDF ដែលបានរក្សាទុក', removePdf: 'លុប PDF', removePdfConfirm: 'លុប PDF នេះចេញពីឧបករណ៍?', },
  zh: { login: '请登录保存这些章节的账号。', empty: '暂无离线章节。请从阅读器菜单下载章节。', open: '离线阅读', remove: '删除章节', removeStory: '删除整本书', removeConfirm: '从此设备删除该离线章节？', removeStoryConfirm: '从此设备删除这本书的所有离线章节？', loading: '正在加载下载内容…', error: '无法打开离线章节。', expired: '离线阅读权限已过期。', back: '返回下载列表', count: '{{count}} 章', storage: '已保存在此设备', refresh: '刷新', notFound: '找不到下载的章节。', episode: '第 {{number}} 章', savedPdfs: '已保存的 PDF', removePdf: '删除 PDF', removePdfConfirm: '从设备中删除此 PDF？', },
  ja: { login: 'ダウンロードしたアカウントにログインしてください。', empty: 'オフラインの話はありません。リーダーのメニューからダウンロードしてください。', open: 'オフラインで読む', remove: '話を削除', removeStory: '作品全体を削除', removeConfirm: 'この端末からこの話を削除しますか？', removeStoryConfirm: 'この端末から作品のすべての話を削除しますか？', loading: 'ダウンロードを読み込み中…', error: 'オフラインの話を開けません。', expired: 'オフライン閲覧権限が期限切れです。', back: 'ダウンロード一覧へ', count: '{{count}} 話', storage: 'この端末に保存済み', refresh: '更新', notFound: 'ダウンロードした話が見つかりません。', episode: '第 {{number}} 話', savedPdfs: '保存済み PDF', removePdf: 'PDF を削除', removePdfConfirm: 'この端末からこの PDF を削除しますか？', },
  ko: { login: '다운로드한 계정으로 로그인해 주세요.', empty: '오프라인 회차가 없습니다. 리더 메뉴에서 회차를 다운로드하세요.', open: '오프라인 읽기', remove: '회차 삭제', removeStory: '전체 작품 삭제', removeConfirm: '이 기기에서 이 회차를 삭제할까요?', removeStoryConfirm: '이 기기에서 이 작품의 모든 회차를 삭제할까요?', loading: '다운로드 불러오는 중…', error: '오프라인 회차를 열 수 없습니다.', expired: '오프라인 열람 기간이 만료되었습니다.', back: '다운로드 목록으로', count: '{{count}} 회차', storage: '이 기기에 저장됨', refresh: '새로 고침', notFound: '다운로드한 회차를 찾을 수 없습니다.', episode: '{{number}}화', savedPdfs: '저장된 PDF', removePdf: 'PDF 삭제', removePdfConfirm: '이 기기에서 이 PDF를 삭제하시겠습니까?', },
})

const ALLOWED_TAGS = new Set(['p', 'div', 'span', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li', 'pre', 'code', 'small', 'hr'])
const IGNORED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'svg', 'form', 'input', 'button', 'audio', 'video'])

function renderOfflineNode(node, key) {
  if (node.nodeType === 3) return node.textContent
  if (node.nodeType !== 1) return null
  const tag = node.tagName.toLowerCase()
  if (IGNORED_TAGS.has(tag)) return null
  if (tag === 'img') {
    const src = String(node.getAttribute('src') || '')
    return src.startsWith('blob:') ? <img key={key} src={src} alt={node.getAttribute('alt') || ''} className="my-3 h-auto w-full rounded-lg object-contain" loading="lazy" /> : null
  }
  const children = Array.from(node.childNodes).map((child, index) => renderOfflineNode(child, `${key}-${index}`))
  if (!ALLOWED_TAGS.has(tag)) return <React.Fragment key={key}>{children}</React.Fragment>
  const className = tag === 'p' || tag === 'div' ? 'mb-5 whitespace-pre-wrap leading-[2.1]' : undefined
  return React.createElement(tag, { key, className }, ...children)
}

function OfflineNovel({ content }) {
  const nodes = useMemo(() => {
    const source = String(content || '')
    if (!/<(?:p|div|br|strong|b|em|i|img|h[1-6]|ul|ol|li)\b/i.test(source)) {
      return source.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="mb-5 whitespace-pre-wrap leading-[2.1]">{paragraph}</p>)
    }
    const doc = new DOMParser().parseFromString(source, 'text/html')
    return Array.from(doc.body.childNodes).map((node, index) => renderOfflineNode(node, `n-${index}`))
  }, [content])
  return <article className="min-w-0 break-words px-4 pb-12 text-[16px] leading-[2.1] text-[var(--shadow-text-primary)]">{nodes}</article>
}

function OfflineManga({ pages = [] }) {
  return <div className="bg-white leading-none">{[...pages].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).flatMap((page) => {
    const parts = Array.isArray(page.parts) && page.parts.length ? [...page.parts].sort((a, b) => Number(a.part_index || 0) - Number(b.part_index || 0)) : [page]
    return parts.map((part, index) => <img key={`${page.id || page.sort_order}-${part.id || index}`} src={part.image_url} alt="Manga page" className="block h-auto w-full" loading="lazy" />)
  })}</div>
}

export default function OfflineDownloadsPanel() {
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])
  const [pdfItems, setPdfItems] = useState([])
  const [selectedPdf, setSelectedPdf] = useState('')
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const activeRef = useRef(null)
  const requestRef = useRef(0)
  const mountedRef = useRef(true)
  const accountId = getOfflineReaderAccountId()

  function closeReader() {
    requestRef.current += 1
    activeRef.current?.release()
    activeRef.current = null
    setSelected(null)
    setSelectedPdf('')
  }

  async function refresh() {
    setBusy(true)
    setError('')
    if (!accountId) {
      setItems([])
      setPdfItems([])
      setBusy(false)
      return
    }
    try {
      const [metadata, pdfs] = await Promise.all([listOfflineEpisodes({ accountId }), listOfflinePdfs()])
      const records = await Promise.all(metadata.map(async (item) => {
        const full = await loadOfflineEpisode({ accountId, storyId: item.storyId, episodeId: item.episodeId })
        if (!full) return null
        return { ...item, storyTitle: full.payload?.story?.title || item.storyId, episodeTitle: full.payload?.episode?.title || t('offlineDownloadsPanel.episode', { number: full.payload?.episode?.episode_number || '?' }), episodeNumber: Number(full.payload?.episode?.episode_number || 0) }
      }))
      if (mountedRef.current) {
        setItems(records.filter(Boolean))
        setPdfItems(pdfs)
      }
    } catch (reason) {
      if (mountedRef.current) setError(reason.message || t('offlineDownloadsPanel.error'))
    } finally {
      if (mountedRef.current) setBusy(false)
    }
  }

  useEffect(() => {
    mountedRef.current = true
    refresh()
    return () => {
      mountedRef.current = false
      requestRef.current += 1
      activeRef.current?.release()
      activeRef.current = null
    }
  }, [accountId])

  useEffect(() => {
    if (selected?.expiresAt == null) return undefined
    const timer = setInterval(() => {
      if (Date.now() >= selected.expiresAt) {
        closeReader()
        setError(t('offlineDownloadsPanel.expired'))
        refresh()
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [selected?.expiresAt])

  async function openEpisode(item) {
    const requestId = ++requestRef.current
    activeRef.current?.release()
    activeRef.current = null
    setSelected(null)
    setSelectedPdf('')
    setError('')
    setBusy(true)
    try {
      const result = await openOfflineReaderEpisode({ storyId: item.storyId, episodeId: item.episodeId })
      if (!result) throw new Error(t('offlineDownloadsPanel.notFound'))
      if (!mountedRef.current || requestId !== requestRef.current) {
        result.release()
        return
      }
      activeRef.current = result
      setSelected({ ...result, storyId: item.storyId, episodeId: item.episodeId })
    } catch (reason) {
      if (mountedRef.current && requestId === requestRef.current) setError(reason.message || t('offlineDownloadsPanel.error'))
    } finally {
      if (mountedRef.current && requestId === requestRef.current) setBusy(false)
    }
  }

  async function removeEpisode(item) {
    if (!window.confirm(t('offlineDownloadsPanel.removeConfirm'))) return
    if (selected?.storyId === item.storyId && selected?.episodeId === item.episodeId) closeReader()
    try {
      await deleteOfflineEpisode({ accountId, storyId: item.storyId, episodeId: item.episodeId })
      await refresh()
    } catch (reason) {
      setError(reason.message || t('offlineDownloadsPanel.error'))
    }
  }

  async function removePdf(item) {
    if (!window.confirm(t('offlineDownloadsPanel.removePdfConfirm'))) return
    if (selectedPdf === item.pdfId) setSelectedPdf('')
    try {
      await deleteOfflinePdf(item.pdfId)
      await refresh()
    } catch (reason) {
      setError(reason.message || t('offlineDownloadsPanel.error'))
    }
  }

  async function removeStory(storyId) {
    if (!window.confirm(t('offlineDownloadsPanel.removeStoryConfirm'))) return
    if (selected?.storyId === storyId) closeReader()
    try {
      await deleteOfflineStory({ accountId, storyId })
      await refresh()
    } catch (reason) {
      setError(reason.message || t('offlineDownloadsPanel.error'))
    }
  }

  const groups = useMemo(() => {
    const map = new Map()
    for (const item of items) {
      if (!map.has(item.storyId)) map.set(item.storyId, { storyId: item.storyId, title: item.storyTitle, episodes: [] })
      map.get(item.storyId).episodes.push(item)
    }
    for (const group of map.values()) group.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber)
    return [...map.values()]
  }, [items])

  if (!accountId) return <p className="rounded-xl border border-[var(--shadow-border)] p-5 text-sm text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.login')}</p>

  return <section className="space-y-4">
    {selectedPdf ? <OfflinePdfReader pdfId={selectedPdf} onBack={() => { setSelectedPdf(''); setError('') }} /> : selected ? <>
      <button type="button" onClick={() => { closeReader(); setError('') }} className="rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-sm font-semibold text-[var(--shadow-text-primary)]">← {t('offlineDownloadsPanel.back')}</button>
      <div className="overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-page)]">
        <div className="border-b border-[var(--shadow-border)] p-4 text-[var(--shadow-text-primary)]"><h2 className="font-extrabold">{selected.payload.story?.title}</h2><p className="mt-1 text-sm">{selected.payload.episode?.title}</p></div>
        {selected.storyType === 'manga' ? <OfflineManga pages={selected.payload.episode?.pages} /> : selected.storyType === 'chat_story' ? <ChatStoryReader key={selected.episodeId} content={selected.payload.episode?.content} readMode="manual" /> : <OfflineNovel content={selected.payload.episode?.content} />}
      </div>
    </> : <>
      <div className="flex items-center justify-between gap-3"><p className="text-xs text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.storage')}</p><button type="button" onClick={refresh} className="rounded-xl border border-[var(--shadow-border)] px-3 py-2 text-xs font-semibold text-[var(--shadow-text-primary)]">{t('offlineDownloadsPanel.refresh')}</button></div>
      {pdfItems.length > 0 ? <div className="overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)]">
        <h2 className="border-b border-[var(--shadow-border)] p-4 font-bold text-[var(--shadow-text-primary)]">{t('offlineDownloadsPanel.savedPdfs')}</h2>
        {pdfItems.map((item) => <div key={item.key} className="flex items-center gap-2 border-b border-[var(--shadow-border)] px-3 py-3 last:border-0"><button type="button" onClick={() => { closeReader(); setError(''); setSelectedPdf(item.pdfId) }} className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-[var(--shadow-text-primary)]">{item.title}</button><button type="button" onClick={() => removePdf(item)} className="shrink-0 rounded-lg border border-[var(--shadow-border)] px-2 py-2 text-xs text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.removePdf')}</button></div>)}
      </div> : null}
      {groups.map((group) => <div key={group.storyId} className="overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)]">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--shadow-border)] p-4"><div className="min-w-0"><h2 className="font-bold text-[var(--shadow-text-primary)]">{group.title}</h2><p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.count', { count: group.episodes.length })}</p></div><button type="button" onClick={() => removeStory(group.storyId)} className="shrink-0 rounded-lg border border-[var(--shadow-border)] px-2 py-2 text-xs text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.removeStory')}</button></div>
        {group.episodes.map((item) => <div key={item.key} className="flex items-center gap-2 border-b border-[var(--shadow-border)] px-3 py-3 last:border-0"><button type="button" onClick={() => openEpisode(item)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold text-[var(--shadow-text-primary)]">{item.episodeTitle}</span><span className="mt-1 block text-xs text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.open')}</span></button><button type="button" onClick={() => removeEpisode(item)} className="shrink-0 rounded-lg border border-[var(--shadow-border)] px-2 py-2 text-xs text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.remove')}</button></div>)}
      </div>)}
      {!busy && !groups.length && !pdfItems.length ? <p className="rounded-xl border border-[var(--shadow-border)] p-5 text-sm text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.empty')}</p> : null}
    </>}
    {busy ? <p role="status" className="text-sm text-[var(--shadow-text-secondary)]">{t('offlineDownloadsPanel.loading')}</p> : null}
    {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
  </section>
}
