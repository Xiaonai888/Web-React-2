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
    filteredEmpty: 'No creations match this filter.',
    download: 'Download PNG',
    share: 'Share',
    shareUnavailable: 'Sharing is not supported on this device.',
    delete: 'Delete',
    deleteConfirm: 'Delete this creation?',
    clear: 'Clear All',
    clearConfirm: 'Delete all saved creations from this device?',
    close: 'Close',
    localOnly: 'Saved locally on this device',
    all: 'All',
    newest: 'Newest',
    oldest: 'Oldest',
    sort: 'Sort',
    total: 'Total',
    details: 'Details',
    created: 'Created',
    size: 'Size',
    strength: 'Strength',
    detail: 'Detail',
    contrast: 'Contrast',
    lineArt: 'Line Art',
    createMore: 'Create More',
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
    filteredEmpty: 'មិនមាន Creation ត្រូវនឹង Filter នេះទេ។',
    download: 'ទាញយក PNG',
    share: 'Share',
    shareUnavailable: 'ឧបករណ៍នេះមិនគាំទ្រ Share រូបនេះទេ។',
    delete: 'លុប',
    deleteConfirm: 'លុប Creation នេះមែនទេ?',
    clear: 'លុបទាំងអស់',
    clearConfirm: 'លុប Creations ទាំងអស់ដែលរក្សាទុកលើឧបករណ៍នេះមែនទេ?',
    close: 'បិទ',
    localOnly: 'រក្សាទុក Local លើឧបករណ៍នេះ',
    all: 'ទាំងអស់',
    newest: 'ថ្មីបំផុត',
    oldest: 'ចាស់បំផុត',
    sort: 'តម្រៀប',
    total: 'សរុប',
    details: 'ព័ត៌មាន',
    created: 'បង្កើតនៅ',
    size: 'ទំហំ',
    strength: 'Strength',
    detail: 'Detail',
    contrast: 'Contrast',
    lineArt: 'Line Art',
    createMore: 'បង្កើតបន្ថែម',
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
    filteredEmpty: '没有符合此筛选条件的作品。',
    download: '下载 PNG',
    share: '分享',
    shareUnavailable: '此设备不支持分享此图片。',
    delete: '删除',
    deleteConfirm: '删除这个作品吗？',
    clear: '全部清除',
    clearConfirm: '删除此设备上保存的所有作品吗？',
    close: '关闭',
    localOnly: '仅保存在此设备',
    all: '全部',
    newest: '最新',
    oldest: '最早',
    sort: '排序',
    total: '总数',
    details: '详情',
    created: '创建时间',
    size: '尺寸',
    strength: '强度',
    detail: '细节',
    contrast: '对比度',
    lineArt: '线稿',
    createMore: '继续创作',
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
    filteredEmpty: 'このフィルターに一致する作品はありません。',
    download: 'PNGをダウンロード',
    share: '共有',
    shareUnavailable: 'この端末では画像共有に対応していません。',
    delete: '削除',
    deleteConfirm: 'この作品を削除しますか？',
    clear: 'すべて削除',
    clearConfirm: 'この端末に保存された作品をすべて削除しますか？',
    close: '閉じる',
    localOnly: 'この端末にローカル保存',
    all: 'すべて',
    newest: '新しい順',
    oldest: '古い順',
    sort: '並び替え',
    total: '合計',
    details: '詳細',
    created: '作成日時',
    size: 'サイズ',
    strength: '強度',
    detail: 'ディテール',
    contrast: 'コントラスト',
    lineArt: '線画',
    createMore: 'さらに作成',
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
    filteredEmpty: '이 필터에 맞는 작품이 없습니다.',
    download: 'PNG 다운로드',
    share: '공유',
    shareUnavailable: '이 기기는 이미지 공유를 지원하지 않습니다.',
    delete: '삭제',
    deleteConfirm: '이 작품을 삭제할까요?',
    clear: '전체 삭제',
    clearConfirm: '이 기기에 저장된 모든 작품을 삭제할까요?',
    close: '닫기',
    localOnly: '이 기기에 로컬 저장',
    all: '전체',
    newest: '최신순',
    oldest: '오래된순',
    sort: '정렬',
    total: '전체',
    details: '세부 정보',
    created: '생성',
    size: '크기',
    strength: '강도',
    detail: '디테일',
    contrast: '대비',
    lineArt: '라인 아트',
    createMore: '더 만들기',
    manga: '만화',
    anime: '애니메이션',
    sketch: '스케치',
    comic: '코믹',
    watercolor: '수채화',
    bwManga: '흑백 만화',
  },
})

const STYLE_FILTERS = ['all', 'manga', 'anime', 'sketch', 'comic', 'watercolor', 'bwManga']

function dateLabel(value) {
  const date = new Date(Number(value || 0))
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fileName(item) {
  return `pic-to-art-${item.style || 'art'}-${item.createdAt || Date.now()}.png`
}

export default function PicToArtCreationsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])
  const [urls, setUrls] = useState({})
  const [selectedId, setSelectedId] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

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

  useEffect(() => {
    if (!selectedId) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [selectedId])

  const visibleItems = useMemo(() => {
    const filtered = filter === 'all'
      ? items
      : items.filter(item => item.style === filter)

    return [...filtered].sort((a, b) => {
      const aTime = Number(a.createdAt || 0)
      const bTime = Number(b.createdAt || 0)
      return sort === 'oldest' ? aTime - bTime : bTime - aTime
    })
  }, [filter, items, sort])

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
      setNotice('')
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
      setFilter('all')
      setNotice('')
    } catch {
      setError(t('picToArtCreations.error'))
    }
  }

  const download = item => {
    const url = urls[item.id]
    if (!url) return

    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName(item)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  const share = async item => {
    if (!(item?.blob instanceof Blob)) return

    const file = new File(
      [item.blob],
      fileName(item),
      { type: item.blob.type || 'image/png' },
    )

    if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
      setNotice(t('picToArtCreations.shareUnavailable'))
      return
    }

    try {
      await navigator.share({
        title: `Pic to Art · ${t(`picToArtCreations.${item.style || 'manga'}`)}`,
        files: [file],
      })
      setNotice('')
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') {
        setNotice(t('picToArtCreations.shareUnavailable'))
      }
    }
  }

  return (
    <PageShell className="pb-24">
      <PageHeader
        title={t('picToArtCreations.title')}
        subtitle={`${t('picToArtCreations.total')}: ${items.length}`}
        onBack={() => navigate('/apps/pic-to-art')}
        backLabel={t('picToArtCreations.back')}
        right={
          items.length ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full px-3 py-2 text-[10px] font-bold text-red-500 active:scale-95 dark:text-red-300"
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

        {notice ? (
          <div className="mb-4 rounded-2xl border border-[#ddcffb] bg-[#f8f4ff] px-4 py-3 text-[11px] font-semibold text-[#6840b7] dark:border-[#4f3c68] dark:bg-[#21192c] dark:text-[#d8c1ff]">
            {notice}
          </div>
        ) : null}

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
            actionLabel={t('picToArtCreations.createMore')}
            onAction={() => navigate('/apps/pic-to-art')}
          />
        ) : null}

        {!loading && !error && items.length ? (
          <>
            <section className="mb-4">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {STYLE_FILTERS.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFilter(style)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold transition active:scale-95 ${
                      filter === style
                        ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                        : 'app-card'
                    }`}
                  >
                    {t(`picToArtCreations.${style}`)}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="app-muted text-[10px] font-semibold">
                  {visibleItems.length} / {items.length}
                </div>

                <label className="flex items-center gap-2">
                  <span className="app-muted text-[10px] font-semibold">
                    {t('picToArtCreations.sort')}
                  </span>
                  <select
                    value={sort}
                    onChange={event => setSort(event.target.value)}
                    className="app-input h-9 rounded-xl border px-3 text-[10px] font-bold outline-none"
                  >
                    <option value="newest">{t('picToArtCreations.newest')}</option>
                    <option value="oldest">{t('picToArtCreations.oldest')}</option>
                  </select>
                </label>
              </div>
            </section>

            {visibleItems.length ? (
              <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleItems.map(item => (
                  <SurfaceCard key={item.id} as="article" className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setNotice('')
                        setSelectedId(item.id)
                      }}
                      className="block w-full text-left active:scale-[0.995]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[var(--shadow-bg-soft)]">
                        {urls[item.id] ? (
                          <img
                            src={urls[item.id]}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : null}
                        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">
                          {t(`picToArtCreations.${item.style || 'manga'}`)}
                        </span>
                      </div>

                      <div className="p-3">
                        <div className="app-title truncate text-[12px] font-extrabold">
                          {t(`picToArtCreations.${item.style || 'manga'}`)}
                        </div>
                        <div className="app-muted mt-1 text-[9px]">
                          {Number(item.width || 0)} × {Number(item.height || 0)}
                        </div>
                        <div className="app-muted mt-1 truncate text-[9px]">
                          {dateLabel(item.createdAt)}
                        </div>
                      </div>
                    </button>
                  </SurfaceCard>
                ))}
              </section>
            ) : (
              <PageEmptyState
                title={t('picToArtCreations.filteredEmpty')}
                actionLabel={t('picToArtCreations.all')}
                onAction={() => setFilter('all')}
              />
            )}
          </>
        ) : null}
      </main>

      {selected ? (
        <div
          className="app-overlay fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={t('picToArtCreations.title')}
          onClick={() => setSelectedId('')}
        >
          <div
            className="app-card max-h-[94dvh] w-full max-w-[680px] overflow-auto rounded-t-[28px] border p-4 sm:rounded-[28px]"
            onClick={event => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="app-title truncate text-[16px] font-extrabold">
                  {t(`picToArtCreations.${selected.style || 'manga'}`)}
                </div>
                <div className="app-muted mt-0.5 text-[10px]">
                  {dateLabel(selected.createdAt)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedId('')}
                className="app-icon-box flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                aria-label={t('picToArtCreations.close')}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="overflow-hidden rounded-[22px] bg-[var(--shadow-bg-soft)]">
              {urls[selected.id] ? (
                <img
                  src={urls[selected.id]}
                  alt=""
                  className="max-h-[66dvh] w-full object-contain"
                />
              ) : null}
            </div>

            <SurfaceCard className="mt-3 p-4">
              <div className="app-title text-[12px] font-extrabold">
                {t('picToArtCreations.details')}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] sm:grid-cols-3">
                <div className="app-soft rounded-xl p-3">
                  <div className="app-muted">{t('picToArtCreations.size')}</div>
                  <div className="app-title mt-1 font-bold">
                    {Number(selected.width || 0)} × {Number(selected.height || 0)}
                  </div>
                </div>

                <div className="app-soft rounded-xl p-3">
                  <div className="app-muted">{t('picToArtCreations.created')}</div>
                  <div className="app-title mt-1 font-bold">
                    {dateLabel(selected.createdAt)}
                  </div>
                </div>

                <div className="app-soft rounded-xl p-3">
                  <div className="app-muted">{t('picToArtCreations.strength')}</div>
                  <div className="app-title mt-1 font-bold">
                    {Number(selected.controls?.strength ?? 0)}
                  </div>
                </div>

                <div className="app-soft rounded-xl p-3">
                  <div className="app-muted">{t('picToArtCreations.detail')}</div>
                  <div className="app-title mt-1 font-bold">
                    {Number(selected.controls?.detail ?? 0)}
                  </div>
                </div>

                <div className="app-soft rounded-xl p-3">
                  <div className="app-muted">{t('picToArtCreations.contrast')}</div>
                  <div className="app-title mt-1 font-bold">
                    {Number(selected.controls?.contrast ?? 0)}
                  </div>
                </div>

                <div className="app-soft rounded-xl p-3">
                  <div className="app-muted">{t('picToArtCreations.lineArt')}</div>
                  <div className="app-title mt-1 font-bold">
                    {Number(selected.controls?.lineArt ?? 0)}
                  </div>
                </div>
              </div>
            </SurfaceCard>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => download(selected)}
                className="rounded-[15px] bg-[#7c3aed] px-3 py-3 text-[10px] font-extrabold text-white active:scale-95"
              >
                <i className="fa-solid fa-download mr-1.5" />
                {t('picToArtCreations.download')}
              </button>

              <button
                type="button"
                onClick={() => share(selected)}
                className="rounded-[15px] border border-[#bba3ee] px-3 py-3 text-[10px] font-extrabold text-[#7040d8] active:scale-95 dark:border-[#5c4776] dark:text-[#cfb6ff]"
              >
                <i className="fa-solid fa-share-nodes mr-1.5" />
                {t('picToArtCreations.share')}
              </button>

              <button
                type="button"
                onClick={() => remove(selected)}
                className="rounded-[15px] border border-red-200 px-3 py-3 text-[10px] font-extrabold text-red-500 active:scale-95 dark:border-red-500/30 dark:text-red-300"
              >
                <i className="fa-solid fa-trash mr-1.5" />
                {t('picToArtCreations.delete')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  )
}
