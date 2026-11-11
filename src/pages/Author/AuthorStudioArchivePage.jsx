import { useRef, useState } from 'react'
import { Archive, ArrowLeft, Clock3, RefreshCw, RotateCcw, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import useStudioRecycleList from '../../hooks/useStudioRecycleList'
import { moveStudioArchivedVideoToTrash, restoreStudioArchivedVideo } from '../../services/shadowStudioRecycleApi'
import { studioDateLabel, studioFormatDuration, studioVideoThumbnail } from '../../components/author/studio/content/ShadowStudioContentData'

registerTranslationNamespace('shadowStudioArchivePage', {
  en: { title: 'Archive', info: 'Archived videos are hidden from readers but kept safely in Shadow.', empty: 'No archived videos.', loading: 'Loading archived videos...', retry: 'Retry', more: 'Load more', archived: 'Archived', restore: 'Unarchive', delete: 'Move to Trash', confirm: 'Move this video to Trash? You can restore it within 30 days.', restored: 'Video removed from Archive.', deleted: 'Video moved to Trash.', error: 'Could not update this video.' },
  km: { title: 'Archive', info: 'វីដេអូក្នុង Archive ត្រូវលាក់ពីអ្នកមើល ប៉ុន្តែនៅរក្សាទុកក្នុង Shadow។', empty: 'មិនទាន់មានវីដេអូក្នុង Archive', loading: 'កំពុងទាញវីដេអូ...', retry: 'សាកល្បងម្ដងទៀត', more: 'ទាញបន្ថែម', archived: 'បានរក្សាទុក', restore: 'ដកចេញពី Archive', delete: 'ផ្លាស់ទៅធុងសម្រាម', confirm: 'ផ្លាស់វីដេអូនេះទៅធុងសម្រាមមែនទេ? អ្នកអាចស្ដារវិញក្នុង ៣០ ថ្ងៃ។', restored: 'បានដកវីដេអូចេញពី Archive', deleted: 'បានផ្លាស់វីដេអូទៅធុងសម្រាម', error: 'មិនអាចកែប្រែវីដេអូនេះបាន' },
  zh: { title: '归档', info: '归档视频对观众隐藏，但仍保存在 Shadow。', empty: '暂无归档视频', loading: '正在加载归档视频...', retry: '重试', more: '加载更多', archived: '归档于', restore: '取消归档', delete: '移至回收站', confirm: '移至回收站？30 天内可以恢复。', restored: '已取消归档', deleted: '已移至回收站', error: '无法更新视频' },
  ja: { title: 'アーカイブ', info: 'アーカイブした動画は視聴者に表示されず、Shadow に保存されます。', empty: 'アーカイブは空です', loading: '読み込み中...', retry: '再試行', more: 'さらに読み込む', archived: 'アーカイブ日', restore: 'アーカイブ解除', delete: 'ゴミ箱へ移動', confirm: 'ゴミ箱へ移動しますか？30 日以内に復元できます。', restored: 'アーカイブを解除しました', deleted: 'ゴミ箱へ移動しました', error: '動画を更新できません' },
  ko: { title: '보관함', info: '보관한 영상은 시청자에게 표시되지 않으며 Shadow에 유지됩니다.', empty: '보관한 영상이 없습니다', loading: '불러오는 중...', retry: '다시 시도', more: '더 보기', archived: '보관일', restore: '보관 해제', delete: '휴지통으로 이동', confirm: '휴지통으로 이동할까요? 30일 이내 복원할 수 있습니다.', restored: '보관 해제 완료', deleted: '휴지통으로 이동 완료', error: '영상을 변경할 수 없습니다' },
})

export default function AuthorStudioArchivePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const list = useStudioRecycleList('archive')
  const [busyId, setBusyId] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const locked = useRef(false)
  const tr = key => t(`shadowStudioArchivePage.${key}`)

  async function act(video, action) {
    if (locked.current || !video?.id) return
    if (action === 'delete' && !window.confirm(tr('confirm'))) return
    locked.current = true
    setBusyId(video.id)
    setError('')
    setFeedback('')
    try {
      if (action === 'delete') await moveStudioArchivedVideoToTrash(video.id)
      else await restoreStudioArchivedVideo(video.id)
      setFeedback(tr(action === 'delete' ? 'deleted' : 'restored'))
      await list.refresh()
    } catch (cause) {
      setError(cause?.message || tr('error'))
    } finally {
      locked.current = false
      setBusyId('')
    }
  }

  return <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] pb-20 text-[var(--shadow-text-primary)]">
    <div className="mx-auto max-w-4xl px-4 pt-5 sm:px-6">
      <header className="mb-5 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/author/reel/studio/me')} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]"><ArrowLeft size={21} /></button>
        <h1 className="text-xl font-extrabold">{tr('title')}</h1>
      </header>
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-accent)] text-[var(--shadow-accent-text)]"><Archive size={20} /></span>
        <p className="pt-1 text-sm leading-6 text-[var(--shadow-text-secondary)]">{tr('info')}</p>
      </div>
      {error || feedback ? <p role={error ? 'alert' : 'status'} className={`mb-3 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs ${error ? 'text-[var(--shadow-danger)]' : 'text-[var(--shadow-text-primary)]'}`}>{error || feedback}</p> : null}
      <section className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 sm:px-4">
        {list.items.map(video => <article key={video.id} className="flex gap-3 border-b border-[var(--shadow-border)] py-4 last:border-b-0">
          <div className="relative aspect-video h-fit w-[35%] max-w-[170px] shrink-0 overflow-hidden rounded-xl bg-[var(--shadow-bg-soft)]">
            {studioVideoThumbnail(video) ? <img src={studioVideoThumbnail(video)} alt="" loading="lazy" className="aspect-video w-full object-cover" /> : <span className="flex aspect-video items-center justify-center"><Archive size={23} /></span>}
            {studioFormatDuration(video.duration_seconds) ? <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">{studioFormatDuration(video.duration_seconds)}</span> : null}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 break-words text-sm font-semibold">{video.title || '—'}</h2>
            {video.archived_at ? <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--shadow-text-secondary)]"><Clock3 size={13} />{tr('archived')}: {studioDateLabel(video.archived_at)}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={Boolean(busyId)} onClick={() => void act(video, 'restore')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--shadow-accent)] px-3 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50"><RotateCcw size={14}/>{tr('restore')}</button>
              <button type="button" disabled={Boolean(busyId)} onClick={() => void act(video, 'delete')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--shadow-border)] px-3 text-xs font-semibold text-[var(--shadow-danger)] disabled:opacity-50"><Trash2 size={14}/>{tr('delete')}</button>
            </div>
          </div>
        </article>)}
        {!list.items.length && !list.loading && !list.error ? <p className="py-12 text-center text-sm text-[var(--shadow-text-secondary)]">{tr('empty')}</p> : null}
        {list.loading ? <p className="py-5 text-center text-xs text-[var(--shadow-text-secondary)]">{tr('loading')}</p> : null}
        {list.error ? <div className="flex flex-col items-center gap-3 py-5"><p role="alert" className="text-center text-xs text-[var(--shadow-danger)]">{list.error}</p><button type="button" onClick={() => void list.refresh()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-sm"><RefreshCw size={16}/>{tr('retry')}</button></div> : null}
      </section>
      {list.hasMore && !list.loading && !list.error ? <button type="button" onClick={() => void list.loadMore()} className="mx-auto mt-5 block min-h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 text-sm font-semibold">{tr('more')}</button> : null}
    </div>
  </main>
}
