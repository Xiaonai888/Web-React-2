import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageEmptyState,
  PageErrorState,
  PageHeader,
  PageLoadingState,
  PageShell,
  SurfaceCard,
} from '../../components/common/PagePrimitives'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  clearPicToArtCreations,
  deletePicToArtCreation,
  listPicToArtCreations,
} from './picToArtStore'

registerTranslationNamespace('picToArtCreations', {
  en: {
    title: 'Creations',
    back: 'Back',
    loading: 'Loading creations...',
    error: 'Could not load creations.',
    retry: 'Retry',
    empty: 'No creations yet',
    emptyBody: 'Generate artwork in Pic to Art and it will appear here automatically.',
    download: 'Download PNG',
    delete: 'Delete',
    deleteConfirm: 'Delete this creation?',
    clear: 'Clear All',
    clearConfirm: 'Delete all saved creations from this device?',
    close: 'Close',
    localOnly: 'Saved locally on this device',
    manga: 'Manga',
    anime: 'Anime',
    sketch: 'Sketch',
    comic: 'Comic',
    watercolor: 'Watercolor',
    bwManga: 'B&W Manga',
  },
  km: {
    title: 'Creations',
    back: 'ត្រឡប់ក្រោយ',
    loading: 'កំពុងផ្ទុក Creations...',
    error: 'មិនអាចផ្ទុក Creations បានទេ។',
    retry: 'ព្យាយាមម្ដងទៀត',
    empty: 'មិនទាន់មាន Creation',
    emptyBody: 'បង្កើត Artwork ក្នុង Pic to Art ហើយវានឹងរក្សាទុកនៅទីនេះដោយស្វ័យប្រវត្តិ។',
    download: 'ទាញយក PNG',
    delete: 'លុប',
    deleteConfirm: 'លុប Creation នេះមែនទេ?',
    clear: 'លុបទាំងអស់',
    clearConfirm: 'លុប Creations ទាំងអស់ដែលរក្សាទុកលើឧបករណ៍នេះមែនទេ?',
    close: 'បិទ',
    localOnly: 'រក្សាទុក Local លើឧបករណ៍នេះ',
    manga: 'Manga',
    anime: 'Anime',
    sketch: 'Sketch',
    comic: 'Comic',
    watercolor: 'Watercolor',
    bwManga: 'B&W Manga',
  },
  zh: {
    title: '作品',
    back: '返回',
    loading: '正在加载作品...',
    error: '无法加载作品。',
    retry: '重试',
    empty: '还没有作品',
    emptyBody: '在 Pic to Art 中生成作品后，会自动保存在这里。',
    download: '下载 PNG',
    delete: '删除',
    deleteConfirm: '删除这个作品吗？',
    clear: '全部清除',
    clearConfirm: '删除此设备上保存的所有作品吗？',
    close: '关闭',
    localOnly: '仅保存在此设备',
    manga: '漫画',
    anime: '动漫',
    sketch: '素描',
    comic: '美漫',
    watercolor: '水彩',
    bwManga: '黑白漫画',
  },
  ja: {
    title: '作品',
    back: '戻る',
    loading: '作品を読み込み中...',
    error: '作品を読み込めませんでした。',
    retry: '再試行',
    empty: '作品はまだありません',
    emptyBody: 'Pic to Art で生成した作品はここに自動保存されます。',
    download: 'PNGをダウンロード',
    delete: '削除',
    deleteConfirm: 'この作品を削除しますか？',
    clear: 'すべて削除',
    clearConfirm: 'この端末に保存された作品をすべて削除しますか？',
    close: '閉じる',
    localOnly: 'この端末にローカル保存',
    manga: 'マンガ',
    anime: 'アニメ',
    sketch: 'スケッチ',
    comic: 'コミック',
    watercolor: '水彩',
    bwManga: '白黒マンガ',
  },
  ko: {
    title: '작품',
    back: '뒤로',
    loading: '작품 불러오는 중...',
    error: '작품을 불러올 수 없습니다.',
    retry: '다시 시도',
    empty: '아직 작품이 없습니다',
    emptyBody: 'Pic to Art에서 생성한 작품이 여기에 자동 저장됩니다.',
    download: 'PNG 다운로드',
    delete: '삭제',
    deleteConfirm: '이 작품을 삭제할까요?',
    clear: '전체 삭제',
    clearConfirm: '이 기기에 저장된 모든 작품을 삭제할까요?',
    close: '닫기',
    localOnly: '이 기기에 로컬 저장',
    manga: '만화',
    anime: '애니메이션',
    sketch: '스케치',
    comic: '코믹',
    watercolor: '수채화',
    bwManga: '흑백 만화',
  },
})

function dateLabel(value) {
  const date = new Date(Number(value || 0))
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PicToArtCreationsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])
  const [urls, setUrls] = useState({})
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await listPicToArtCreations())
    } catch {
      setError(t('picToArtCreations.error'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const next = {}
    const created = []

    items.forEach(item => {
      if (item.blob instanceof Blob) {
        const url = URL.createObjectURL(item.blob)
        next[item.id] = url
        created.push(url)
      }
    })

    setUrls(next)
    return () => created.forEach(url => URL.revokeObjectURL(url))
  }, [items])

  const selected = useMemo(
    () => items.find(item => item.id === selectedId) || null,
    [items, selectedId],
  )

  const remove = async item => {
    if (!window.confirm(t('picToArtCreations.deleteConfirm'))) return
    try {
      await deletePicToArtCreation(item.id)
      setSelectedId('')
      setItems(current => current.filter(entry => entry.id !== item.id))
    } catch {
      setError(t('picToArtCreations.error'))
    }
  }

  const clearAll = async () => {
    if (!window.confirm(t('picToArtCreations.clearConfirm'))) return
    try {
      await clearPicToArtCreations()
      setSelectedId('')
      setItems([])
    } catch {
      setError(t('picToArtCreations.error'))
    }
  }

  const download = item => {
    const url = urls[item.id]
    if (!url) return
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `pic-to-art-${item.style || 'art'}-${item.createdAt || Date.now()}.png`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  return (
    <PageShell className="pb-20">
      <PageHeader
        title={t('picToArtCreations.title')}
        onBack={() => navigate('/apps/pic-to-art')}
        backLabel={t('picToArtCreations.back')}
        right={
          items.length ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full px-3 py-2 text-[10px] font-bold text-red-500 dark:text-red-300"
            >
              {t('picToArtCreations.clear')}
            </button>
          ) : null
        }
      />

      <main className="mx-auto w-full max-w-[960px] px-4 py-5">
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#f3edff] px-4 py-3 text-[11px] font-semibold text-[#6840b7] dark:bg-[#261c35] dark:text-[#d6c0ff]">
          <i className="fa-solid fa-mobile-screen-button" />
          <span>{t('picToArtCreations.localOnly')}</span>
        </div>

        {loading ? (
          <PageLoadingState label={t('picToArtCreations.loading')} rows={4} />
        ) : null}

        {!loading && error ? (
          <PageErrorState
            title={error}
            actionLabel={t('picToArtCreations.retry')}
            onAction={load}
          />
        ) : null}

        {!loading && !error && !items.length ? (
          <PageEmptyState
            title={t('picToArtCreations.empty')}
            body={t('picToArtCreations.emptyBody')}
            icon={<i className="fa-regular fa-images text-[22px] text-[#7c3aed]" />}
          />
        ) : null}

        {!loading && !error && items.length ? (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map(item => (
              <SurfaceCard key={item.id} as="article" className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className="block w-full text-left"
                >
                  <div className="aspect-square overflow-hidden bg-[var(--shadow-bg-soft)]">
                    {urls[item.id] ? (
                      <img
                        src={urls[item.id]}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <div className="app-title truncate text-[12px] font-extrabold">
                      {t(`picToArtCreations.${item.style || 'manga'}`)}
                    </div>
                    <div className="app-muted mt-1 text-[9px]">
                      {Number(item.width || 0)} × {Number(item.height || 0)}
                    </div>
                    <div className="app-muted mt-1 text-[9px]">
                      {dateLabel(item.createdAt)}
                    </div>
                  </div>
                </button>
              </SurfaceCard>
            ))}
          </section>
        ) : null}
      </main>

      {selected ? (
        <div
          className="app-overlay fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={t('picToArtCreations.title')}
          onClick={() => setSelectedId('')}
        >
          <div
            className="app-card max-h-[92dvh] w-full max-w-[620px] overflow-auto rounded-t-[26px] border p-4 sm:rounded-[26px]"
            onClick={event => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="app-title text-[15px] font-extrabold">
                  {t(`picToArtCreations.${selected.style || 'manga'}`)}
                </div>
                <div className="app-muted mt-0.5 text-[10px]">
                  {Number(selected.width || 0)} × {Number(selected.height || 0)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId('')}
                className="app-icon-box flex h-9 w-9 items-center justify-center rounded-full"
                aria-label={t('picToArtCreations.close')}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="overflow-hidden rounded-[20px] bg-[var(--shadow-bg-soft)]">
              {urls[selected.id] ? (
                <img
                  src={urls[selected.id]}
                  alt=""
                  className="max-h-[68dvh] w-full object-contain"
                />
              ) : null}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => download(selected)}
                className="rounded-[15px] bg-[#7c3aed] px-4 py-3 text-[11px] font-extrabold text-white"
              >
                <i className="fa-solid fa-download mr-2" />
                {t('picToArtCreations.download')}
              </button>
              <button
                type="button"
                onClick={() => remove(selected)}
                className="rounded-[15px] border border-red-200 px-4 py-3 text-[11px] font-extrabold text-red-500 dark:border-red-500/30 dark:text-red-300"
              >
                <i className="fa-solid fa-trash mr-2" />
                {t('picToArtCreations.delete')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  )
}
