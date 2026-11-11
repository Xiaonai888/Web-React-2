import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Plus, RefreshCw, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import ReelPlaylistCreateForm from '../../components/author/ReelPlaylistCreateForm'
import ShadowStudioPlaylistCard from '../../components/author/studio/content/ShadowStudioPlaylistCard'
import ShadowStudioPlaylistDetail from '../../components/author/studio/content/ShadowStudioPlaylistDetail'
import ShadowStudioVideoDetailSheet from '../../components/author/studio/content/ShadowStudioVideoDetailSheet'
import useShadowStudioContentActions from '../../components/author/studio/content/useShadowStudioContentActions'
import { listStudioContentSection } from '../../components/author/studio/content/ShadowStudioContentApi'
import {
  invalidateStudioContentCache,
  invalidateStudioPlaylistCache,
  readStudioSectionCache,
  studioContentSession,
  writeStudioSectionCache,
} from '../../components/author/studio/content/ShadowStudioContentCache'
import { createReelPlaylist, listMyReelPlaylists } from '../../services/reelPlaylistsApi'

registerTranslationNamespace('shadowStudioPlaylistsPage', {
  en: { title: 'Playlists', search: 'Search playlists', add: 'New playlist', name: 'Playlist name', create: 'Create', cancel: 'Close', empty: 'No playlists found.', loading: 'Loading playlists...', more: 'Load more', retry: 'Retry', error: 'Could not load playlists.' },
  km: { title: 'Playlists', search: 'ស្វែងរក Playlist', add: 'បង្កើត Playlist', name: 'ឈ្មោះ Playlist', create: 'បង្កើត', cancel: 'បិទ', empty: 'មិនទាន់មាន Playlist', loading: 'កំពុងទាញ Playlists...', more: 'ទាញបន្ថែម', retry: 'សាកល្បងម្ដងទៀត', error: 'មិនអាចទាញ Playlists បានទេ។' },
  zh: { title: '播放列表', search: '搜索播放列表', add: '新建播放列表', name: '播放列表名称', create: '创建', cancel: '关闭', empty: '没有播放列表', loading: '正在加载播放列表...', more: '加载更多', retry: '重试', error: '无法加载播放列表。' },
  ja: { title: 'プレイリスト', search: 'プレイリストを検索', add: '新しいプレイリスト', name: 'プレイリスト名', create: '作成', cancel: '閉じる', empty: 'プレイリストがありません', loading: '読み込み中...', more: 'もっと見る', retry: '再試行', error: 'プレイリストを読み込めません。' },
  ko: { title: '재생목록', search: '재생목록 검색', add: '재생목록 만들기', name: '재생목록 이름', create: '만들기', cancel: '닫기', empty: '재생목록이 없습니다', loading: '재생목록을 불러오는 중...', more: '더 보기', retry: '다시 시도', error: '재생목록을 불러오지 못했습니다.' },
})

const PAGE_SIZE = 12

export default function AuthorStudioPlaylistsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [playlists, setPlaylists] = useState([])
  const [selected, setSelected] = useState(null)
  const [video, setVideo] = useState(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [reload, setReload] = useState(0)
  const controllerRef = useRef(null)
  const requestRef = useRef(0)
  const pageRef = useRef({ items: [], nextOffset: 0, hasMore: false })

  useEffect(() => {
    const id = setTimeout(() => setSearch(input.trim().slice(0, 80)), 300)
    return () => clearTimeout(id)
  }, [input])

  const load = useCallback(async (append = false) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const requestId = ++requestRef.current
    const session = studioContentSession()
    const offset = append ? pageRef.current.nextOffset : 0
    setLoading(true)
    setError('')
    try {
      const response = search
        ? await listMyReelPlaylists({ search, limit: PAGE_SIZE, offset, signal: controller.signal })
        : await listStudioContentSection('playlists', { limit: PAGE_SIZE, offset, signal: controller.signal })
      if (controller.signal.aborted || requestRef.current !== requestId || studioContentSession() !== session) return
      const rows = search ? response.playlists || [] : response.items || []
      const pagination = response.pagination || {}
      const next = search ? Number(pagination.next_offset) : Number(response.nextOffset)
      const nextOffset = Number.isSafeInteger(next) && next > offset ? next : offset + rows.length
      const hasNext = (search ? pagination.has_more : response.hasMore) === true && nextOffset > offset && nextOffset <= 5000
      const previous = append ? pageRef.current.items : []
      const ids = new Set(previous.map(item => item.id))
      const items = [...previous, ...rows.filter(item => item?.id && !ids.has(item.id))]
      pageRef.current = { items, nextOffset, hasMore: hasNext }
      setPlaylists(items)
      setHasMore(hasNext)
      if (!search) writeStudioSectionCache('playlists', { items, nextOffset, hasMore: hasNext, initialized: true })
    } catch (cause) {
      if (!controller.signal.aborted && requestRef.current === requestId) setError(cause?.message || 'Could not load playlists.')
    } finally {
      if (!controller.signal.aborted && requestRef.current === requestId) setLoading(false)
      if (controllerRef.current === controller) controllerRef.current = null
    }
  }, [search])

  useEffect(() => {
    pageRef.current = { items: [], nextOffset: 0, hasMore: false }
    const cached = !search && readStudioSectionCache('playlists')
    if (cached?.initialized && Array.isArray(cached.items)) {
      pageRef.current = { items: cached.items, nextOffset: cached.nextOffset, hasMore: Boolean(cached.hasMore) }
      setPlaylists(cached.items)
      setHasMore(Boolean(cached.hasMore))
      setError('')
      setLoading(false)
    } else {
      setPlaylists([])
      setHasMore(false)
      void load()
    }
    return () => {
      controllerRef.current?.abort()
      controllerRef.current = null
      requestRef.current += 1
    }
  }, [search, reload, load])

  const refresh = useCallback(() => {
    invalidateStudioContentCache(['playlists'])
    invalidateStudioPlaylistCache()
    setReload(value => value + 1)
  }, [])

  const onChanged = useCallback(async change => {
    if (change?.action === 'delete') setSelected(current => current?.id === change.id ? null : current)
    refresh()
  }, [refresh])

  const actions = useShadowStudioContentActions({ onChanged })

  const createPlaylist = async name => {
    await createReelPlaylist(name)
    setCreating(false)
    refresh()
  }

  const translateForm = key => {
    if (key === 'authorReelAdd.playlistName') return t('shadowStudioPlaylistsPage.name')
    if (key === 'authorReelAdd.done') return t('shadowStudioPlaylistsPage.cancel')
    if (key === 'authorReelAdd.create') return t('shadowStudioPlaylistsPage.create')
    return key
  }

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] pb-20 text-[var(--shadow-text-primary)]">
    <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
      {selected ? <ShadowStudioPlaylistDetail
        playlist={selected}
        busyId={actions.busyId}
        onBack={() => setSelected(null)}
        onOpenVideo={setVideo}
        onPlaylistAction={actions.playlistAction}
      /> : <>
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => navigate('/author/reel/studio/me')} aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]"><ArrowLeft size={21} /></button>
            <h1 className="text-xl font-bold">{t('shadowStudioPlaylistsPage.title')}</h1>
          </div>
          <button type="button" onClick={() => setCreating(value => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--shadow-accent)] px-4 text-xs font-semibold text-[var(--shadow-accent-text)]"><Plus size={17} />{t('shadowStudioPlaylistsPage.add')}</button>
        </header>
        {creating ? <div className="mb-4 overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          <ReelPlaylistCreateForm existingNames={playlists.map(item => item.name)} onCreate={createPlaylist} onCancel={() => setCreating(false)} t={translateForm} />
        </div> : null}
        <label className="mb-4 flex h-11 items-center gap-2 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 focus-within:border-[var(--shadow-accent)]">
          <Search size={18} className="text-[var(--shadow-text-secondary)]" aria-hidden="true" />
          <input type="search" value={input} onChange={event => setInput(event.target.value)} maxLength={80} placeholder={t('shadowStudioPlaylistsPage.search')} className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--shadow-text-tertiary)]" />
        </label>
        {actions.error || actions.notice ? <p role={actions.error ? 'alert' : 'status'} className={`mb-4 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs ${actions.error ? 'text-[var(--shadow-danger)]' : ''}`}>{actions.error || actions.notice}</p> : null}
        <section className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 sm:px-4">
          {playlists.length ? <div className="divide-y divide-[var(--shadow-border)]">{playlists.map(item => <ShadowStudioPlaylistCard key={item.id} playlist={item} onOpen={setSelected} onAction={actions.playlistAction} disabled={Boolean(actions.busyId)} />)}</div> : null}
          {!playlists.length && !loading && !error ? <p className="py-12 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioPlaylistsPage.empty')}</p> : null}
          {loading ? <p className="py-5 text-center text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioPlaylistsPage.loading')}</p> : null}
          {error ? <div className="flex flex-col items-center gap-3 py-6 text-center"><p role="alert" className="text-sm text-[var(--shadow-danger)]">{error}</p><button type="button" onClick={refresh} className="inline-flex items-center gap-2 rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-xs font-semibold"><RefreshCw size={15} />{t('shadowStudioPlaylistsPage.retry')}</button></div> : null}
        </section>
        {hasMore && !loading && !error ? <button type="button" onClick={() => void load(true)} className="mx-auto mt-5 block min-h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 text-sm font-semibold">{t('shadowStudioPlaylistsPage.more')}</button> : null}
      </>}
      {video ? <ShadowStudioVideoDetailSheet video={video} onClose={() => setVideo(null)} onAnalytics={item => navigate(`/author/reel/studio/videos/${encodeURIComponent(item.id)}/analytics?section=overview`)} /> : null}
    </div>
  </main>
}
