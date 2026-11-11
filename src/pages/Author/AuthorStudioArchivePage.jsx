import { useRef, useState } from 'react'
import { ArrowLeft, Clock3, RefreshCw, RotateCcw, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import useStudioRecycleList from '../../hooks/useStudioRecycleList'
import { permanentlyDeleteStudioTrashedVideo, restoreStudioTrashedVideo } from '../../services/shadowStudioRecycleApi'
import { studioFormatDuration, studioVideoThumbnail } from '../../components/author/studio/content/ShadowStudioContentData'

registerTranslationNamespace('shadowStudioTrashPage', {
  en: { title: 'Trash', info: 'Deleted videos stay in Trash for 30 days, then are permanently removed from Shadow.', youtube: 'Videos hosted on YouTube are not deleted from YouTube.', empty: 'Trash is empty.', loading: 'Loading deleted videos...', retry: 'Retry', more: 'Load more', left: '{{count}} days left', expired: 'Deletion due', restore: 'Restore', delete: 'Delete now', confirm: 'Permanently delete this video from Shadow? This cannot be undone.', restored: 'Video restored.', deleted: 'Video permanently deleted from Shadow.', error: 'Could not update this video.' },
  km: { title: 'ធុងសម្រាម', info: 'វីដេអូដែលលុបត្រូវរក្សា ៣០ ថ្ងៃ រួចលុបចេញពី Shadow ជាអចិន្ត្រៃយ៍។', youtube: 'វីដេអូនៅលើ YouTube មិនត្រូវបានលុបចេញពី YouTube ទេ។', empty: 'ធុងសម្រាមទទេ', loading: 'កំពុងទាញវីដេអូដែលបានលុប...', retry: 'សាកល្បងម្ដងទៀត', more: 'ទាញបន្ថែម', left: 'នៅសល់ {{count}} ថ្ងៃ', expired: 'ដល់ពេលលុប', restore: 'ស្ដារវិញ', delete: 'លុបឥឡូវ', confirm: 'ចង់លុបវីដេអូនេះចេញពី Shadow ជាអចិន្ត្រៃយ៍មែនទេ? មិនអាចស្ដារវិញបានទេ។', restored: 'បានស្ដារវីដេអូវិញ', deleted: 'បានលុបវីដេអូចេញពី Shadow ជាអចិន្ត្រៃយ៍', error: 'មិនអាចកែប្រែវីដេអូនេះបាន' },
  zh: { title: '回收站', info: '删除的视频在回收站保留 30 天，随后从 Shadow 永久删除。', youtube: 'YouTube 上的视频不会从 YouTube 删除。', empty: '回收站为空', loading: '正在加载已删除视频...', retry: '重试', more: '加载更多', left: '剩余 {{count}} 天', expired: '即将删除', restore: '恢复', delete: '立即删除', confirm: '永久从 Shadow 删除此视频？此操作不可撤销。', restored: '视频已恢复', deleted: '已从 Shadow 永久删除', error: '无法更新视频' },
  ja: { title: 'ゴミ箱', info: '削除した動画は 30 日間保存され、その後 Shadow から完全に削除されます。', youtube: 'YouTube 上の元動画は削除されません。', empty: 'ゴミ箱は空です', loading: '読み込み中...', retry: '再試行', more: 'さらに読み込む', left: '残り {{count}} 日', expired: '削除予定', restore: '復元', delete: '今すぐ削除', confirm: 'Shadow から完全に削除しますか？元に戻せません。', restored: '復元しました', deleted: '完全に削除しました', error: '動画を変更できません' },
  ko: { title: '휴지통', info: '삭제한 영상은 30일간 보관한 후 Shadow에서 영구 삭제됩니다.', youtube: 'YouTube에 있는 원본 영상은 삭제되지 않습니다.', empty: '휴지통이 비었습니다', loading: '삭제된 영상 불러오는 중...', retry: '다시 시도', more: '더 보기', left: '{{count}}일 남음', expired: '삭제 예정', restore: '복원', delete: '지금 삭제', confirm: 'Shadow에서 영구 삭제할까요? 복원할 수 없습니다.', restored: '복원 완료', deleted: '영구 삭제 완료', error: '영상을 변경할 수 없습니다' },
})

function daysRemaining(video) {
  const deleted = Date.parse(String(video.deleted_at || ''))
  const scheduled = Date.parse(String(video.purge_at || ''))
  const expiresAt = Number.isFinite(scheduled) ? scheduled : Number.isFinite(deleted) ? deleted + 30 * 86400000 : NaN
  return Number.isFinite(expiresAt) ? Math.max(0, Math.ceil((expiresAt - Date.now()) / 86400000)) : null
}

export default function AuthorStudioTrashPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const list = useStudioRecycleList('trash')
  const [busyId, setBusyId] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const locked = useRef(false)
  const tr = key => t(`shadowStudioTrashPage.${key}`)

  async function act(video, action) {
    if (locked.current || !video?.id) return
    if (action === 'delete' && !window.confirm(tr('confirm'))) return
    locked.current = true
    setBusyId(video.id)
    setError('')
    setFeedback('')
    try {
      if (action === 'delete') await permanentlyDeleteStudioTrashedVideo(video.id)
      else await restoreStudioTrashedVideo(video.id)
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
      <div className="mb-5 rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-accent)] text-[var(--shadow-accent-text)]"><Trash2 size={20}/></span>
          <p className="pt-1 text-sm font-medium leading-6">{tr('info')}</p>
        </div>
        <p className="mt-2 text-xs text-[var(--shadow-text-secondary)]">{tr('youtube')}</p>
      </div>
      {error || feedback ? <p role={error ? 'alert' : 'status'} className={`mb-3 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs ${error ? 'text-[var(--shadow-danger)]' : 'text-[var(--shadow-text-primary)]'}`}>{error || feedback}</p> : null}
      <section className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 sm:px-4">
        {list.items.map(video => {
          const days = daysRemaining(video)
          return <article key={video.id} className="flex gap-3 border-b border-[var(--shadow-border)] py-4 last:border-b-0">
            <div className="relative aspect-video h-fit w-[35%] max-w-[170px] shrink-0 overflow-hidden rounded-xl bg-[var(--shadow-bg-soft)]">
              {studioVideoThumbnail(video) ? <img src={studioVideoThumbnail(video)} alt="" loading="lazy" className="aspect-video w-full object-cover" /> : <span className="flex aspect-video items-center justify-center"><Trash2 size={23}/></span>}
              {studioFormatDuration(video.duration_seconds) ? <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white">{studioFormatDuration(video.duration_seconds)}</span> : null}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 break-words text-sm font-semibold">{video.title || '—'}</h2>
              {days !== null ? <p className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${days <= 3 ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]'}`}><Clock3 size={13}/>{days === 0 ? tr('expired') : t('shadowStudioTrashPage.left', { count: days })}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={Boolean(busyId)} onClick={() => void act(video, 'restore')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[var(--shadow-accent)] px-3 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50"><RotateCcw size={14}/>{tr('restore')}</button>
                <button type="button" disabled={Boolean(busyId)} onClick={() => void act(video, 'delete')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[var(--shadow-border)] px-3 text-xs font-semibold text-[var(--shadow-danger)] disabled:opacity-50"><Trash2 size={14}/>{tr('delete')}</button>
              </div>
            </div>
          </article>
        })}
        {!list.items.length && !list.loading && !list.error ? <p className="py-12 text-center text-sm text-[var(--shadow-text-secondary)]">{tr('empty')}</p> : null}
        {list.loading ? <p className="py-5 text-center text-xs text-[var(--shadow-text-secondary)]">{tr('loading')}</p> : null}
        {list.error ? <div className="flex flex-col items-center gap-3 py-5"><p role="alert" className="text-center text-xs text-[var(--shadow-danger)]">{list.error}</p><button type="button" onClick={() => void list.refresh()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-sm"><RefreshCw size={16}/>{tr('retry')}</button></div> : null}
      </section>
      {list.hasMore && !list.loading && !list.error ? <button type="button" onClick={() => void list.loadMore()} className="mx-auto mt-5 block min-h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 text-sm font-semibold">{tr('more')}</button> : null}
    </div>
  </main>
}
