import { useEffect } from 'react'
import { ArrowLeft, Globe2, ListVideo, LockKeyhole, RefreshCw } from 'lucide-react'
import { registerTranslationNamespace } from '../../../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { studioFormatCount, studioVideoThumbnail } from './ShadowStudioContentData'
import ShadowStudioVideoCard from './ShadowStudioVideoCard'
import useShadowStudioPlaylistDetail from './useShadowStudioPlaylistDetail'

registerTranslationNamespace('shadowStudioPlaylistDetail', {
  en: {
    videos: 'Videos', private: 'Private', public: 'Public', back: 'Back to Playlists',
    loading: 'Loading Playlist...', empty: 'No videos in this Playlist.', more: 'Load more',
    retry: 'Retry', error: 'Unable to load Playlist.', count: '{{count}} videos',
  },
  km: {
    videos: 'វីដេអូ', private: 'ឯកជន', public: 'សាធារណៈ', back: 'ត្រឡប់ទៅ Playlists',
    loading: 'កំពុងទាញ Playlist...', empty: 'គ្មានវីដេអូក្នុង Playlist នេះទេ។', more: 'ទាញបន្ថែម',
    retry: 'សាកល្បងម្ដងទៀត', error: 'មិនអាចទាញ Playlist បានទេ។', count: '{{count}} វីដេអូ',
  },
  zh: {
    videos: '视频', private: '私密', public: '公开', back: '返回播放列表',
    loading: '正在加载播放列表...', empty: '播放列表中没有视频。', more: '加载更多',
    retry: '重试', error: '无法加载播放列表。', count: '{{count}} 个视频',
  },
  ja: {
    videos: '動画', private: '非公開', public: '公開', back: '再生リストに戻る',
    loading: '読み込み中...', empty: '動画はありません。', more: 'もっと見る',
    retry: '再試行', error: '再生リストを読み込めません。', count: '動画 {{count}} 本',
  },
  ko: {
    videos: '영상', private: '비공개', public: '공개', back: '재생목록으로 돌아가기',
    loading: '재생목록 불러오는 중...', empty: '재생목록에 영상이 없습니다.', more: '더 보기',
    retry: '다시 시도', error: '재생목록을 불러오지 못했습니다.', count: '영상 {{count}}개',
  },
})

export default function ShadowStudioPlaylistDetail({
  playlist,
  onBack,
  onOpenVideo,
  onVideoAction,
  onPlaylistAction,
  busyId = '',
}) {
  const { t } = useDisplayTranslation()
  const id = playlist?.id || null
  const { playlist: remote, videos, total, hasMore, ready, loading, error, refresh, loadMore } = useShadowStudioPlaylistDetail(id)
  const current = remote || playlist
  const cover = videos.length ? studioVideoThumbnail(videos[0]) : null
  const count = total ?? current?.video_count ?? null

  useEffect(() => {
    if (!id) return undefined
    const handler = event => {
      if (event.key === 'Escape') onBack?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [id, onBack])

  if (!id) return null

  async function videoAction(video, action) {
    const changed = await onVideoAction?.(video, action)
    if (changed && action !== 'edit') refresh()
  }

  async function playlistAction(action) {
    const changed = await onPlaylistAction?.(current, action)
    if (changed && action === 'delete') onBack?.()
    else if (changed) refresh()
  }

  return <section className="mx-auto w-full max-w-[980px] space-y-5 text-[var(--shadow-text-primary)]">
    <header className="flex min-w-0 items-center gap-3">
      <button type="button" onClick={onBack} disabled={typeof onBack !== 'function'} aria-label={t('shadowStudioPlaylistDetail.back')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)] disabled:opacity-50">
        <ArrowLeft size={22}/>
      </button>
      <h1 className="min-w-0 flex-1 truncate text-xl font-bold">{current?.name || 'Playlist'}</h1>
    </header>

    <div className="flex items-start gap-3 rounded-xl border border-[var(--shadow-border)] p-3 sm:gap-4">
      <div className="relative aspect-video w-[42%] shrink-0 overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)] sm:w-[200px]">
        {cover ? <img src={cover} loading="lazy" alt="" className="h-full w-full object-cover"/>
          : <div className="flex h-full items-center justify-center text-[var(--shadow-text-secondary)]"><ListVideo size={32}/></div>}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <h2 className="break-words text-sm font-semibold sm:text-base">{current?.name || 'Playlist'}</h2>
        <p className="flex items-center gap-1.5 text-xs text-[var(--shadow-text-secondary)]">
          {current?.is_public ? <Globe2 size={15}/> : <LockKeyhole size={15}/>}
          {t(current?.is_public ? 'shadowStudioPlaylistDetail.public' : 'shadowStudioPlaylistDetail.private')}
        </p>
        {count !== null ? <p className="text-xs text-[var(--shadow-text-secondary)]">
          {t('shadowStudioPlaylistDetail.count', { count: studioFormatCount(count) ?? count })}
        </p> : null}
        {typeof onPlaylistAction === 'function' ? <button type="button" disabled={Boolean(busyId)} onClick={() => playlistAction('rename')}
          className="rounded-full border border-[var(--shadow-border)] px-3 py-1.5 text-xs font-semibold disabled:opacity-50">{t('shadowStudioNext.rename')}</button> : null}
      </div>
    </div>

    <div className="space-y-3">
      <h2 className="text-base font-bold">{t('shadowStudioPlaylistDetail.videos')}</h2>
      {loading && !ready ? <p className="py-5 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioPlaylistDetail.loading')}</p> : null}
      {error ? <div role="alert" className="space-y-2 py-3 text-sm text-[var(--shadow-danger)]">
        <p>{error}</p><button type="button" onClick={ready ? loadMore : refresh} className="inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-4 py-2 text-xs"><RefreshCw size={15}/>{t('shadowStudioPlaylistDetail.retry')}</button>
      </div> : null}
      {ready && !loading && videos.length === 0 && !error ? <p className="py-5 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioPlaylistDetail.empty')}</p> : null}
      {videos.length ? <div className="divide-y divide-[var(--shadow-border)]">
        {videos.map(video => <ShadowStudioVideoCard key={video.id} video={video} display="list"
          disabled={Boolean(busyId)} onOpen={onOpenVideo} onAction={onVideoAction ? videoAction : undefined}/>) }
      </div> : null}
      {hasMore && !error ? <div className="pt-4 text-center"><button type="button" disabled={loading} onClick={loadMore}
        className="min-h-10 rounded-full border border-[var(--shadow-border)] px-5 text-xs font-semibold disabled:opacity-50">
        {loading ? t('shadowStudioPlaylistDetail.loading') : t('shadowStudioPlaylistDetail.more')}
      </button></div> : null}
    </div>
  </section>
}
