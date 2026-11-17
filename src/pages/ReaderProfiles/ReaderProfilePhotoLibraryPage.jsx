import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { getActiveReaderUser } from '../../utils/readerActiveAccount'
import {
  deleteProfilePhotoFromLibrary,
  fetchProfilePhotoLibraryPage,
} from '../../services/profilePhotoLibrary.service'

registerTranslationNamespace('readerProfilePhotoLibrary', {
  en: {
    title: 'Choose profile picture',
    back: 'Back',
    empty: 'No saved profile pictures yet.',
    limit: 'Saved pictures',
    loading: 'Loading pictures...',
    more: 'Load more',
    failed: 'Could not load your pictures.',
    retry: 'Retry',
    delete: 'Delete picture',
    deleteConfirm: 'Remove this picture from your library? Existing posts will keep their pictures.',
    deleting: 'Removing picture...',
    current: 'Current picture',
    cannotDelete: 'Change your current profile picture before removing it.',
    choose: 'Choose this picture',
  },
  km: {
    title: 'ជ្រើសរូបប្រវត្តិរូប',
    back: 'ត្រឡប់ក្រោយ',
    empty: 'មិនទាន់មានរូបប្រវត្តិរូបដែលបានរក្សាទុកទេ។',
    limit: 'រូបដែលបានរក្សាទុក',
    loading: 'កំពុងផ្ទុករូបភាព...',
    more: 'ផ្ទុកបន្ថែម',
    failed: 'មិនអាចផ្ទុករូបភាពបានទេ។',
    retry: 'ព្យាយាមម្ដងទៀត',
    delete: 'លុបរូប',
    deleteConfirm: 'លុបរូបនេះចេញពី Library មែនទេ? រូបនៅក្នុង Post ចាស់នឹងនៅដដែល។',
    deleting: 'កំពុងលុបរូប...',
    current: 'រូបបច្ចុប្បន្ន',
    cannotDelete: 'សូមប្ដូររូប Profile បច្ចុប្បន្នសិន ទើបអាចលុបបាន។',
    choose: 'ជ្រើសរូបនេះ',
  },
  zh: {
    title: '选择头像',
    back: '返回',
    empty: '尚无保存的头像。',
    limit: '已保存照片',
    loading: '正在加载照片...',
    more: '加载更多',
    failed: '无法加载照片。',
    retry: '重试',
    delete: '删除照片',
    deleteConfirm: '从图库移除这张照片？以前的帖子仍会保留照片。',
    deleting: '正在移除照片...',
    current: '当前头像',
    cannotDelete: '请先更换当前头像。',
    choose: '选择这张照片',
  },
  ja: {
    title: 'プロフィール写真を選ぶ',
    back: '戻る',
    empty: '保存済みのプロフィール写真はありません。',
    limit: '保存した写真',
    loading: '写真を読み込み中...',
    more: 'さらに読み込む',
    failed: '写真を読み込めませんでした。',
    retry: '再試行',
    delete: '写真を削除',
    deleteConfirm: 'この写真をライブラリから削除しますか？以前の投稿には写真が残ります。',
    deleting: '写真を削除中...',
    current: '現在の写真',
    cannotDelete: '現在のプロフィール写真を変更してから削除してください。',
    choose: 'この写真を選択',
  },
  ko: {
    title: '프로필 사진 선택',
    back: '뒤로',
    empty: '저장된 프로필 사진이 없습니다.',
    limit: '저장된 사진',
    loading: '사진 불러오는 중...',
    more: '더 불러오기',
    failed: '사진을 불러오지 못했습니다.',
    retry: '다시 시도',
    delete: '사진 삭제',
    deleteConfirm: '이 사진을 라이브러리에서 삭제할까요? 기존 게시물 사진은 유지됩니다.',
    deleting: '사진 삭제 중...',
    current: '현재 사진',
    cannotDelete: '현재 프로필 사진을 변경한 후 삭제하세요.',
    choose: '이 사진 선택',
  },
})

const PAGE_SIZE = 9
const AUTO_BATCHES = 3

export default function ReaderProfilePhotoLibraryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [photos, setPhotos] = useState([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState('')
  const [error, setError] = useState('')
  const loadedRef = useRef(0)
  const autoBatchesRef = useRef(0)
  const loadingRef = useRef(false)
  const moreRef = useRef(null)
  const mountedRef = useRef(false)
  const avatarUrl = String(getActiveReaderUser()?.avatar_url || '')
  const returnTo = typeof location.state?.returnTo === 'string' &&
    location.state.returnTo.startsWith('/') && !location.state.returnTo.startsWith('//')
    ? location.state.returnTo : '/profile'

  const loadNext = useCallback(async (reset = false) => {
    if (loadingRef.current) return
    if (!reset && loadedRef.current >= 100) return
    loadingRef.current = true
    if (mountedRef.current) {
      setLoading(true)
      setError('')
    }
    const offset = reset ? 0 : loadedRef.current
    try {
      const result = await fetchProfilePhotoLibraryPage({ offset, limit: PAGE_SIZE, force: reset })
      if (!mountedRef.current) return
      const nextPhotos = Array.isArray(result.photos) ? result.photos : []
      loadedRef.current = offset + nextPhotos.length
      setPhotos((previous) => reset ? nextPhotos : [...previous, ...nextPhotos])
      setTotal(Number(result.total || 0))
      setHasMore(Boolean(result.has_more) && nextPhotos.length > 0)
    } catch (loadError) {
      if (mountedRef.current) setError(loadError.message || getDisplayText('readerProfilePhotoLibrary.failed'))
    } finally {
      loadingRef.current = false
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    autoBatchesRef.current = 1
    loadNext(true)
    return () => {
      mountedRef.current = false
    }
  }, [loadNext])

  useEffect(() => {
    if (!hasMore || loading || error || autoBatchesRef.current >= AUTO_BATCHES || !moreRef.current) return undefined
    if (typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !loadingRef.current && autoBatchesRef.current < AUTO_BATCHES) {
        autoBatchesRef.current += 1
        loadNext()
      }
    }, { rootMargin: '100px' })
    observer.observe(moreRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, error, photos.length, loadNext])

  function goBack() {
    if (window.history.length > 1 && location.key !== 'default') navigate(-1)
    else navigate(returnTo, { replace: true })
  }

  function choosePhoto(photo) {
    navigate(returnTo, {
      replace: true,
      state: {
        profilePhotoLibraryChoice: { id: photo.id, image_url: photo.image_url },
      },
    })
  }

  async function deletePhoto(photo) {
    if (photo.image_url === avatarUrl) {
      window.alert(t('readerProfilePhotoLibrary.cannotDelete'))
      return
    }
    if (!window.confirm(t('readerProfilePhotoLibrary.deleteConfirm'))) return
    setRemoving(photo.id)
    setError('')
    try {
      await deleteProfilePhotoFromLibrary(photo.id)
      loadedRef.current = 0
      autoBatchesRef.current = 1
      setHasMore(true)
      setPhotos([])
      await loadNext(true)
    } catch (removeError) {
      setError(removeError.message || t('readerProfilePhotoLibrary.failed'))
    } finally {
      setRemoving('')
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] pb-[calc(24px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[650px] items-center gap-3 px-3">
          <button type="button" onClick={goBack} aria-label={t('readerProfilePhotoLibrary.back')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <i className="fa-solid fa-arrow-left text-[18px]" aria-hidden="true" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-[17px] font-bold">{t('readerProfilePhotoLibrary.title')}</h1>
          <span className="text-[12px] text-[var(--shadow-text-secondary)]">{total}/100</span>
        </div>
      </header>

      <section className="mx-auto max-w-[650px] px-3 pt-4">
        <p className="mb-4 text-[12px] text-[var(--shadow-text-secondary)]">{t('readerProfilePhotoLibrary.limit')}: {total}/100</p>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square min-w-0 overflow-hidden rounded-xl bg-[var(--shadow-bg-elevated)]">
              <button type="button" onClick={() => choosePhoto(photo)} aria-label={t('readerProfilePhotoLibrary.choose')} className="h-full w-full">
                <img src={photo.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
              {photo.image_url === avatarUrl ? (
                <span className="pointer-events-none absolute bottom-1 left-1 rounded-md bg-black/65 px-1.5 py-1 text-[9px] font-semibold text-white">{t('readerProfilePhotoLibrary.current')}</span>
              ) : (
                <button type="button" disabled={Boolean(removing)} aria-label={t('readerProfilePhotoLibrary.delete')} onClick={() => deletePhoto(photo)} className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white disabled:opacity-50">
                  <i className="fa-solid fa-trash-can text-[12px]" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>

        {!loading && !error && photos.length === 0 ? <p className="py-16 text-center text-[14px] text-[var(--shadow-text-secondary)]">{t('readerProfilePhotoLibrary.empty')}</p> : null}
        <div ref={moreRef} className="h-2" />
        {loading || removing ? <p className="py-5 text-center text-[13px] text-[var(--shadow-text-secondary)]">{t(removing ? 'readerProfilePhotoLibrary.deleting' : 'readerProfilePhotoLibrary.loading')}</p> : null}
        {error ? (
          <div className="py-5 text-center">
            <p role="alert" className="mb-3 text-[13px] text-red-600 dark:text-red-300">{error}</p>
            <button type="button" onClick={() => loadNext(photos.length === 0)} className="rounded-xl border border-[var(--shadow-border)] px-5 py-2 text-[13px] font-semibold">{t('readerProfilePhotoLibrary.retry')}</button>
          </div>
        ) : null}
        {hasMore && !loading && !error && autoBatchesRef.current >= AUTO_BATCHES ? (
          <button type="button" onClick={() => loadNext()} className="mt-4 w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] py-3 text-[13px] font-semibold active:bg-[var(--shadow-bg-hover)]">{t('readerProfilePhotoLibrary.more')}</button>
        ) : null}
      </section>
    </main>
  )
}
