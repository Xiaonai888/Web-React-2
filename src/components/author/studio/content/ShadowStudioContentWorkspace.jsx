import { useCallback } from 'react'
import ReelEditManager from '../../ReelEditManager'
import ShadowStudioContentHeader from './ShadowStudioContentHeader'
import ShadowStudioContentFeedback from './ShadowStudioContentFeedback'
import ShadowStudioContentSections from './ShadowStudioContentSections'
import ShadowStudioPlaylistDetail from './ShadowStudioPlaylistDetail'
import ShadowStudioVideoDetailSheet from './ShadowStudioVideoDetailSheet'
import useShadowStudioContentActions from './useShadowStudioContentActions'
import useShadowStudioContentCollections from './useShadowStudioContentCollections'
import useShadowStudioContentSelection from './useShadowStudioContentSelection'

export default function ShadowStudioContentWorkspace({ onExitStudio, onAddVideo, onViewAnalytics }) {
  const collections = useShadowStudioContentCollections({ pageSize: 12 })
  const selection = useShadowStudioContentSelection()
  const refresh = collections.refresh
  const afterMutation = selection.afterMutation

  const handleChanged = useCallback(async (change) => {
    afterMutation(change)
    if (change.kind === 'playlists') {
      await refresh('playlists')
      return
    }
    await Promise.all([refresh('videos'), refresh('shorts')])
  }, [afterMutation, refresh])

  const actions = useShadowStudioContentActions({
    onEdit: selection.editVideo,
    onChanged: handleChanged,
  })

  const handleSaved = useCallback(() => {
    selection.closeEditor()
    actions.clearFeedback()
    Promise.all([refresh('videos'), refresh('shorts')]).catch(() => {})
  }, [actions.clearFeedback, refresh, selection.closeEditor])

  return <section className="mx-auto w-full max-w-[980px] space-y-5 text-[var(--shadow-text-primary)]">
    <ShadowStudioContentHeader
      onExitStudio={onExitStudio}
      onAddVideo={onAddVideo}
      busy={Boolean(actions.busyId)}
    />
    <ShadowStudioContentFeedback
      error={actions.error}
      notice={actions.notice}
      onDismiss={actions.clearFeedback}
    />
    <div className={selection.playlist ? 'hidden' : ''}>
      <ShadowStudioContentSections
        videos={collections.videos}
        shorts={collections.shorts}
        playlists={collections.playlists}
        loading={collections.loading}
        errors={collections.errors}
        pagination={collections.pagination}
        onLoadMore={collections.loadMore}
        onRetry={collections.retry}
        onOpenVideo={selection.openVideo}
        onOpenPlaylist={selection.openPlaylist}
        onVideoAction={actions.videoAction}
        onPlaylistAction={actions.playlistAction}
      />
    </div>
    {selection.playlist ? <ShadowStudioPlaylistDetail
      key={selection.playlist.id}
      playlist={selection.playlist}
      busyId={actions.busyId}
      onBack={selection.video || selection.editing ? undefined : selection.closePlaylist}
      onOpenVideo={selection.openVideo}
      onVideoAction={actions.videoAction}
      onPlaylistAction={actions.playlistAction}
    /> : null}
    {selection.video ? <ShadowStudioVideoDetailSheet
      key={selection.video.id}
      video={selection.video}
      onClose={selection.closeVideo}
      onEdit={selection.editVideo}
      onAnalytics={typeof onViewAnalytics === 'function' ? onViewAnalytics : undefined}
    /> : null}
    {selection.editing ? <ReelEditManager
      key={selection.editing.id}
      video={selection.editing}
      onClose={selection.closeEditor}
      onSaved={handleSaved}
    /> : null}
  </section>
}
