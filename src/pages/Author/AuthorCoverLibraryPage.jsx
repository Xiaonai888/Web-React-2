import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Image, LoaderCircle, RefreshCw, Trash2, X } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import useOverlayScrollLock from '../../hooks/useOverlayScrollLock'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { deleteAuthorCover, listAuthorCovers, selectAuthorCover } from '../../services/authorCoverLibraryApi'

registerTranslationNamespace('authorCoverLibrary', {
  en: {
    title: 'Choose Cover', used: 'Current cover', select: 'Use this cover', remove: 'Delete cover',
    empty: 'No uploaded covers yet.', emptyHelp: 'Upload a cover from your Author Page to see it here.',
    loading: 'Loading covers...', loadMore: 'Load 9 more', retry: 'Retry', refresh: 'Refresh',
    max: 'Maximum {{count}} covers', count: '{{count}} of {{max}} covers',
    confirmDelete: 'Delete this cover permanently from Cloudflare? This cannot be undone.',
    deleted: 'Cover deleted.', selected: 'Cover updated.', cancel: 'Cancel',
    failedLoad: 'Could not load cover photos.', failedSave: 'Could not update your cover.', failedDelete: 'Could not delete cover.',
    close: 'Close preview', back: 'Back', full: 'Your library is full. Delete an old cover before uploading another.',
  },
  km: {
    title: 'ជ្រើស Cover', used: 'Cover កំពុងប្រើ', select: 'ប្រើ Cover នេះ', remove: 'លុប Cover',
    empty: 'មិនទាន់មាន Cover ដែលបានបង្ហោះទេ', emptyHelp: 'បង្ហោះ Cover ពី Author Page ដើម្បីឃើញនៅទីនេះ',
    loading: 'កំពុងទាញ Cover...', loadMore: 'ទាញ ៩ រូបបន្ថែម', retry: 'សាកម្ដងទៀត', refresh: 'ទាញថ្មី',
    max: 'អតិបរមា {{count}} រូប', count: '{{count}} / {{max}} Cover',
    confirmDelete: 'លុប Cover នេះចេញពី Cloudflare ជាអចិន្ត្រៃយ៍មែនទេ? មិនអាចស្ដារវិញបានទេ។',
    deleted: 'បានលុប Cover', selected: 'បានប្តូរ Cover', cancel: 'បោះបង់',
    failedLoad: 'មិនអាចទាញ Cover បាន', failedSave: 'មិនអាចប្តូរ Cover បាន', failedDelete: 'មិនអាចលុប Cover បាន',
    close: 'បិទការមើល', back: 'ត្រឡប់', full: 'Cover ពេញហើយ។ ត្រូវលុបរូបចាស់ មុនបង្ហោះរូបថ្មី។',
  },
  zh: {
    title: '选择封面', used: '当前封面', select: '使用此封面', remove: '删除封面',
    empty: '暂无已上传封面', emptyHelp: '在作者主页上传封面后可在这里选择',
    loading: '加载封面中...', loadMore: '再加载9张', retry: '重试', refresh: '刷新',
    max: '最多{{count}}张封面', count: '{{count}} / {{max}} 张',
    confirmDelete: '确定从Cloudflare永久删除此封面吗？此操作无法撤销。',
    deleted: '已删除封面', selected: '封面已更新', cancel: '取消',
    failedLoad: '无法加载封面', failedSave: '无法更新封面', failedDelete: '无法删除封面',
    close: '关闭预览', back: '返回', full: '封面库已满，请先删除旧封面。',
  },
  ja: {
    title: 'カバーを選択', used: '現在のカバー', select: 'このカバーを使う', remove: 'カバーを削除',
    empty: 'アップロードしたカバーはありません', emptyHelp: '作家ページからカバーをアップロードしてください',
    loading: 'カバーを読み込み中...', loadMore: 'さらに9枚表示', retry: '再試行', refresh: '更新',
    max: '最大{{count}}枚', count: '{{count}} / {{max}}枚',
    confirmDelete: 'Cloudflareからこのカバーを完全に削除しますか？元に戻せません。',
    deleted: 'カバーを削除しました', selected: 'カバーを更新しました', cancel: 'キャンセル',
    failedLoad: '読み込みに失敗しました', failedSave: '更新に失敗しました', failedDelete: '削除に失敗しました',
    close: 'プレビューを閉じる', back: '戻る', full: '上限に達しました。古いカバーを削除してください。',
  },
  ko: {
    title: '커버 선택', used: '현재 커버', select: '이 커버 사용', remove: '커버 삭제',
    empty: '업로드한 커버가 없습니다', emptyHelp: '작가 페이지에서 커버를 업로드하면 여기에 표시됩니다',
    loading: '커버 불러오는 중...', loadMore: '9개 더 보기', retry: '다시 시도', refresh: '새로고침',
    max: '최대 {{count}}개', count: '{{count}} / {{max}}개',
    confirmDelete: 'Cloudflare에서 이 커버를 영구 삭제할까요? 되돌릴 수 없습니다.',
    deleted: '커버가 삭제되었습니다', selected: '커버가 변경되었습니다', cancel: '취소',
    failedLoad: '커버를 불러올 수 없습니다', failedSave: '커버를 변경할 수 없습니다', failedDelete: '커버를 삭제할 수 없습니다',
    close: '미리보기 닫기', back: '뒤로', full: '커버가 가득 찼습니다. 기존 커버를 삭제하세요.',
  },
})

const AUTO_LOAD_PAGES = 3

export default function AuthorCoverLibraryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  useAuthorPageFooterVisibility(false)
  const [covers, setCovers] = useState([])
  const [total, setTotal] = useState(0)
  const [maxUploads, setMaxUploads] = useState(100)
  const [activeCoverUrl, setActiveCoverUrl] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [autoPages, setAutoPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [preview, setPreview] = useState(null)
  const [action, setAction] = useState('')
  const listRef = useRef([])
  const pagingRef = useRef({ offset: 0, hasMore: true })
  const busyRef = useRef(false)
  const autoPagesRef = useRef(0)
  const sentinelRef = useRef(null)
  useOverlayScrollLock(Boolean(preview))

  const back = useCallback(() => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/author/page')
  }, [navigate])

  const loadPage = useCallback(async ({ reset = false, manual = false, signal } = {}) => {
    if (busyRef.current || (!reset && !pagingRef.current.hasMore)) return
    busyRef.current = true
    const offset = reset ? 0 : pagingRef.current.offset
    setLoading(true)
    setError('')
    if (reset) {
      autoPagesRef.current = 0
      listRef.current = []
      pagingRef.current = { offset: 0, hasMore: true }
      setCovers([])
      setAutoPages(0)
    }
    try {
      const data = await listAuthorCovers({ offset, force: reset, signal })
      if (signal?.aborted) return
      const already = new Set(listRef.current.map(item => item.id))
      const fresh = data.items.filter(item => !already.has(item.id))
      const all = [...listRef.current, ...fresh]
      listRef.current = all
      pagingRef.current = { offset: data.nextOffset, hasMore: data.hasMore }
      setCovers(all)
      setTotal(data.total)
      setMaxUploads(data.maxUploads)
      setActiveCoverUrl(data.activeCoverUrl)
      setHasMore(data.hasMore)
      if (!manual) {
        autoPagesRef.current += 1
        setAutoPages(autoPagesRef.current)
      }
    } catch (cause) {
      if (!signal?.aborted) {
        setError(cause.message || getDisplayText('authorCoverLibrary.failedLoad'))
        autoPagesRef.current = AUTO_LOAD_PAGES
        setAutoPages(AUTO_LOAD_PAGES)
      }
    } finally {
      busyRef.current = false
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadPage({ reset: true, signal: controller.signal })
    return () => controller.abort()
  }, [loadPage])

  useEffect(() => {
    if (!hasMore || loading || error || autoPages >= AUTO_LOAD_PAGES || !sentinelRef.current) return undefined
    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && !busyRef.current && autoPagesRef.current < AUTO_LOAD_PAGES) {
        void loadPage()
      }
    }, { rootMargin: '240px 0px' })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, error, autoPages, loadPage])

  useEffect(() => {
    if (!preview) return undefined
    const onKeyDown = event => {
      if (event.key === 'Escape' && !action) setPreview(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [preview, action])

  async function useCover() {
    if (!preview || action) return
    setAction('select')
    setError('')
    try {
      const coverUrl = await selectAuthorCover(preview.id)
      setPreview(null)
      const from = String(location.state?.returnTo || '')
      const returnTo = /^\/author\/page(?:\/[^?#]*)?(?:[?#].*)?$/.test(from) ? from : '/author/page'
      navigate(returnTo, { replace: true, state: { coverUpdated: true, coverUrl } })
    } catch (cause) {
      setError(cause.message || t('authorCoverLibrary.failedSave'))
    } finally {
      setAction('')
    }
  }

  async function removeCover() {
    if (!preview || action || preview.public_url === activeCoverUrl) return
    if (!window.confirm(t('authorCoverLibrary.confirmDelete'))) return
    setAction('delete')
    setError('')
    try {
      await deleteAuthorCover(preview.id)
      setPreview(null)
      setNotice(t('authorCoverLibrary.deleted'))
      await loadPage({ reset: true })
    } catch (cause) {
      setError(cause.message || t('authorCoverLibrary.failedDelete'))
    } finally {
      setAction('')
    }
  }

  const isActive = preview?.public_url === activeCoverUrl

  return (
    <div className="min-h-[100dvh] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-20 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button type="button" onClick={back} aria-label={t('authorCoverLibrary.back')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-soft)]"><ArrowLeft size={20} /></button>
          <h1 className="text-[16px] font-semibold">{t('authorCoverLibrary.title')}</h1>
          <button type="button" onClick={() => void loadPage({ reset: true })} disabled={loading} aria-label={t('authorCoverLibrary.refresh')} className="flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40 active:bg-[var(--shadow-bg-soft)]"><RefreshCw size={19} /></button>
        </div>
      </header>
      <main className="mx-auto max-w-[720px] px-3 pb-16 pt-4">
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <span className="text-[13px] text-[var(--shadow-text-secondary)]">{t('authorCoverLibrary.count', { count: total, max: maxUploads })}</span>
          <span className="text-[12px] text-[var(--shadow-text-secondary)]">{covers.length} / {Math.min(total, maxUploads)}</span>
        </div>
        {total >= maxUploads ? <p className="mb-4 rounded-xl bg-[var(--shadow-bg-soft)] p-3 text-[13px]">{t('authorCoverLibrary.full')}</p> : null}
        {notice ? <button type="button" onClick={() => setNotice('')} className="mb-4 block w-full rounded-xl bg-[var(--shadow-bg-soft)] p-3 text-left text-[13px]">{notice}</button> : null}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {covers.map(item => {
            const active = item.public_url === activeCoverUrl
            return (
              <button key={item.id} type="button" onClick={() => { setError(''); setPreview(item) }} className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-[var(--shadow-bg-soft)] active:scale-[0.98] ${active ? 'border-[#7c3aed]' : 'border-transparent'}`}>
                <img src={item.public_url} loading="lazy" alt={item.file_name || 'Cover'} className="h-full w-full object-cover" />
                {active ? <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#7c3aed] text-white"><Check size={15} /></span> : null}
              </button>
            )
          })}
        </div>
        {!loading && covers.length === 0 && !error ? (
          <div className="flex flex-col items-center px-5 py-24 text-center"><Image size={36} className="mb-4 text-[var(--shadow-text-secondary)]" /><p className="text-[15px] font-semibold">{t('authorCoverLibrary.empty')}</p><p className="mt-2 text-[12px] text-[var(--shadow-text-secondary)]">{t('authorCoverLibrary.emptyHelp')}</p></div>
        ) : null}
        <div ref={sentinelRef} className="h-4" />
        {loading ? <div className="flex items-center justify-center gap-2 py-6 text-[13px] text-[var(--shadow-text-secondary)]"><LoaderCircle size={19} className="animate-spin" />{t('authorCoverLibrary.loading')}</div> : null}
        {error && !preview ? <div className="py-5 text-center"><p className="mb-3 text-[13px] text-red-500">{error}</p><button type="button" onClick={() => void loadPage({ reset: covers.length === 0 })} className="rounded-full bg-[var(--shadow-bg-soft)] px-5 py-2 text-[13px] font-semibold">{t('authorCoverLibrary.retry')}</button></div> : null}
        {hasMore && !loading && !error && autoPages >= AUTO_LOAD_PAGES ? <button type="button" onClick={() => void loadPage({ manual: true })} className="mx-auto mt-6 block rounded-full border border-[var(--shadow-border)] px-6 py-3 text-[13px] font-semibold">{t('authorCoverLibrary.loadMore')}</button> : null}
      </main>
      {preview ? (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true" aria-label={t('authorCoverLibrary.title')}>
          <button type="button" onClick={() => !action && setPreview(null)} aria-label={t('authorCoverLibrary.close')} className="absolute inset-0" />
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-[var(--shadow-bg-surface)] p-3 shadow-2xl">
            <div className="mb-3 flex items-center justify-between"><span className="text-[14px] font-semibold">{isActive ? t('authorCoverLibrary.used') : t('authorCoverLibrary.title')}</span><button type="button" disabled={Boolean(action)} onClick={() => setPreview(null)} aria-label={t('authorCoverLibrary.close')} className="rounded-full bg-[var(--shadow-bg-soft)] p-2"><X size={17} /></button></div>
            <img src={preview.public_url} alt={preview.file_name || 'Cover'} className="aspect-[16/7] w-full rounded-xl bg-[#111827] object-contain" />
            {error ? <p className="mt-3 text-center text-[12px] text-red-500">{error}</p> : null}
            <div className="mt-4 flex gap-2">
              <button type="button" disabled={Boolean(action) || isActive} onClick={() => void removeCover()} className="flex h-11 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--shadow-border)] disabled:opacity-35" aria-label={t('authorCoverLibrary.remove')}><Trash2 size={19} /></button>
              <button type="button" disabled={Boolean(action) || isActive} onClick={() => void useCover()} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#111827] px-4 text-[13px] font-semibold text-white disabled:opacity-50">{action === 'select' ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={17} />}{isActive ? t('authorCoverLibrary.used') : t('authorCoverLibrary.select')}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
