import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, RefreshCw, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { listStudioMeVideos } from '../../services/shadowStudioMeApi'
import ShadowStudioVideoCard from '../../components/author/studio/content/ShadowStudioVideoCard'
import ShadowStudioVideoDetailSheet from '../../components/author/studio/content/ShadowStudioVideoDetailSheet'

registerTranslationNamespace('shadowStudioLibrary', {
  en: { title: 'Library', search: 'Search all your videos', all: 'All', long: 'Long', short: 'Short', empty: 'No videos found.', loading: 'Loading videos...', more: 'Load more', retry: 'Retry', unavailable: 'Could not load the library.' },
  km: { title: 'បណ្ណាល័យ', search: 'ស្វែងរកវីដេអូរបស់អ្នក', all: 'ទាំងអស់', long: 'វែង', short: 'ខ្លី', empty: 'រកមិនឃើញវីដេអូ', loading: 'កំពុងទាញវីដេអូ...', more: 'ទាញបន្ថែម', retry: 'សាកល្បងម្ដងទៀត', unavailable: 'មិនអាចទាញបណ្ណាល័យបាន' },
  zh: { title: '视频库', search: '搜索全部视频', all: '全部', long: '长视频', short: '短视频', empty: '没有找到视频', loading: '正在加载视频...', more: '加载更多', retry: '重试', unavailable: '无法加载视频库' },
  ja: { title: 'ライブラリ', search: '動画を検索', all: 'すべて', long: '長編', short: 'ショート', empty: '動画が見つかりません', loading: '動画を読み込み中...', more: 'さらに読み込む', retry: '再試行', unavailable: 'ライブラリを読み込めません' },
  ko: { title: '라이브러리', search: '모든 동영상 검색', all: '전체', long: '긴 동영상', short: '쇼츠', empty: '동영상을 찾을 수 없습니다', loading: '동영상 불러오는 중...', more: '더 보기', retry: '다시 시도', unavailable: '라이브러리를 불러올 수 없습니다' },
})

const PAGE_SIZE = 12
const KINDS = ['all', 'long', 'short']

export default function AuthorStudioLibraryPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [kind, setKind] = useState('all')
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [nextOffset, setNextOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [retry, setRetry] = useState(0)
  const requestId = useRef(0)
  const pageRef = useRef({ items: [], offset: 0, more: true })

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(input.trim()), 300)
    return () => clearTimeout(timeout)
  }, [input])

  const load = useCallback(async ({ append = false, force = false, signal } = {}) => {
    const current = ++requestId.current
    const offset = append ? pageRef.current.offset : 0
    setLoading(true)
    setError('')
    try {
      const data = await listStudioMeVideos({ kind, search, offset, limit: PAGE_SIZE, force, signal })
      if (signal?.aborted || requestId.current !== current) return
      const previous = append ? pageRef.current.items : []
      const ids = new Set(previous.map(item => item.id))
      const additions = data.items.filter(item => item?.id && !ids.has(item.id))
      const nextItems = [...previous, ...additions]
      pageRef.current = { items: nextItems, offset: data.nextOffset, more: data.hasMore }
      setItems(nextItems)
      setNextOffset(data.nextOffset)
      setHasMore(data.hasMore)
    } catch (cause) {
      if (!signal?.aborted && requestId.current === current) setError(cause?.message || t('shadowStudioLibrary.unavailable'))
    } finally {
      if (!signal?.aborted && requestId.current === current) setLoading(false)
    }
  }, [kind, search, t])

  useEffect(() => {
    const controller = new AbortController()
    pageRef.current = { items: [], offset: 0, more: true }
    setItems([])
    setNextOffset(0)
    setHasMore(false)
    void load({ signal: controller.signal, force: retry > 0 })
    return () => { controller.abort(); requestId.current += 1 }
  }, [load, retry])

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] pb-20 text-[var(--shadow-text-primary)]">
    <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/author/reel/studio/me')} aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]"><ArrowLeft size={21}/></button>
        <h1 className="text-xl font-bold">{t('shadowStudioLibrary.title')}</h1>
      </header>
      <label className="flex h-11 items-center gap-2 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 focus-within:border-[var(--shadow-accent)]">
        <Search size={18} className="text-[var(--shadow-text-secondary)]" aria-hidden="true" />
        <input type="search" value={input} onChange={event => setInput(event.target.value)} maxLength={100} placeholder={t('shadowStudioLibrary.search')} className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--shadow-text-tertiary)]" />
      </label>
      <div className="my-4 flex flex-wrap gap-2" role="group" aria-label={t('shadowStudioLibrary.title')}>
        {KINDS.map(value => <button type="button" key={value} onClick={() => setKind(value)} aria-pressed={kind === value} className={`min-h-9 rounded-full px-4 text-xs font-semibold transition-colors ${kind === value ? 'bg-[var(--shadow-accent)] text-[var(--shadow-accent-text)]' : 'border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]'}`}>{t(`shadowStudioLibrary.${value}`)}</button>)}
      </div>
      <section className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 sm:px-4">
        {items.length ? <div className="divide-y divide-[var(--shadow-border)]">{items.map(video => <ShadowStudioVideoCard key={video.id} video={video} display="list" onOpen={setSelected} />)}</div> : null}
        {!items.length && !loading && !error ? <p className="py-12 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioLibrary.empty')}</p> : null}
        {loading ? <p className="py-5 text-center text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioLibrary.loading')}</p> : null}
        {error ? <div className="flex flex-col items-center gap-3 py-6 text-center"><p role="alert" className="text-sm text-[var(--shadow-danger)]">{error}</p><button type="button" onClick={() => setRetry(n => n + 1)} className="flex items-center gap-2 rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-xs font-semibold"><RefreshCw size={15}/>{t('shadowStudioLibrary.retry')}</button></div> : null}
      </section>
      {hasMore && !loading && !error ? <button type="button" onClick={() => void load({ append: true })} className="mx-auto mt-5 block min-h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 text-sm font-semibold">{t('shadowStudioLibrary.more')}</button> : null}
      {selected ? <ShadowStudioVideoDetailSheet video={selected} onClose={() => setSelected(null)} onAnalytics={video => navigate(`/author/reel/studio/videos/${encodeURIComponent(video.id)}/analytics?section=overview`)} /> : null}
    </div>
  </main>
}
