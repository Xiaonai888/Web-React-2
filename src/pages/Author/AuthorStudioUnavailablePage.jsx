import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Clock3, EyeOff, Link2, RefreshCw, Trash2, X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { studioVideoThumbnail } from '../../components/author/studio/content/ShadowStudioContentData'
import { moveStudioArchivedVideoToTrash } from '../../services/shadowStudioRecycleApi'
import { listStudioUnavailableVideos, recheckStudioUnavailableVideo, replaceStudioUnavailableLink } from '../../services/shadowStudioUnavailableApi'

registerTranslationNamespace('studioUnavailableVideos', {
  en: { title: 'Unavailable Videos', subtitle: 'YouTube videos that cannot be played are hidden from readers. After 30 days they move to Trash for another 30 days.', empty: 'No unavailable videos.', loading: 'Loading videos...', retry: 'Retry', more: 'Load more', check: 'Check again', edit: 'Change link', save: 'Save link', cancel: 'Cancel', trash: 'Move to Trash', confirm: 'Move this video to Trash? It will be deleted from Shadow after 30 days.', moved: 'Video moved to Trash.', fixed: 'YouTube link restored. Video is available again.', still: 'YouTube video is still unavailable.', days: '{{count}} days until Trash', soon: 'Moving to Trash soon', link: 'YouTube link', failed: 'Could not update this video.' },
  km: { title: 'Unavailable Videos', subtitle: 'វីដេអូ YouTube ដែលចាក់មិនបានត្រូវលាក់ពីអ្នកអាន។ ក្រោយ ៣០ ថ្ងៃ ផ្លាស់ទៅធុងសម្រាម ៣០ ថ្ងៃទៀត។', empty: 'មិនមានវីដេអូដែលចាក់មិនបានទេ', loading: 'កំពុងទាញវីដេអូ...', retry: 'សាកល្បងម្ដងទៀត', more: 'ទាញបន្ថែម', check: 'ពិនិត្យម្តងទៀត', edit: 'កែ Link', save: 'រក្សាទុក Link', cancel: 'បោះបង់', trash: 'ផ្លាស់ទៅធុងសម្រាម', confirm: 'ផ្លាស់វីដេអូនេះទៅធុងសម្រាមមែនទេ? នឹងលុបពី Shadow ក្រោយ ៣០ ថ្ងៃ។', moved: 'បានផ្លាស់ទៅធុងសម្រាម', fixed: 'YouTube Link អាចចាក់បានវិញហើយ', still: 'YouTube នៅតែមិនអាចចាក់បាន', days: 'នៅសល់ {{count}} ថ្ងៃមុនចូល Trash', soon: 'ជិតផ្លាស់ទៅ Trash', link: 'YouTube Link', failed: 'មិនអាចកែវីដេអូបាន' },
  zh: { title: '无法播放的视频', subtitle: '无法播放的 YouTube 视频会对读者隐藏。30 天后移至回收站，再保留 30 天。', empty: '没有无法播放的视频', loading: '正在加载...', retry: '重试', more: '加载更多', check: '重新检查', edit: '更换链接', save: '保存链接', cancel: '取消', trash: '移至回收站', confirm: '移至回收站？30 天后将永久删除。', moved: '已移至回收站', fixed: '链接已恢复', still: '视频仍无法播放', days: '{{count}} 天后移至回收站', soon: '即将移至回收站', link: 'YouTube 链接', failed: '更新失败' },
  ja: { title: '再生できない動画', subtitle: 'YouTube で再生できない動画は非公開となり、30 日後にゴミ箱へ移動します。', empty: '該当動画はありません', loading: '読み込み中...', retry: '再試行', more: 'もっと見る', check: '再確認', edit: 'リンクを変更', save: '保存', cancel: 'キャンセル', trash: 'ゴミ箱へ移動', confirm: 'ゴミ箱に移動しますか？30 日後に完全削除されます。', moved: '移動しました', fixed: '動画を復旧しました', still: 'まだ再生できません', days: 'ゴミ箱まで残り {{count}} 日', soon: '近日ゴミ箱へ移動', link: 'YouTube リンク', failed: '更新できません' },
  ko: { title: '재생 불가 영상', subtitle: '재생할 수 없는 YouTube 영상은 숨겨지고 30일 후 휴지통으로 이동합니다.', empty: '재생 불가 영상이 없습니다', loading: '불러오는 중...', retry: '다시 시도', more: '더 보기', check: '다시 확인', edit: '링크 변경', save: '링크 저장', cancel: '취소', trash: '휴지통으로 이동', confirm: '휴지통으로 옮길까요? 30일 후 영구 삭제됩니다.', moved: '휴지통으로 이동했습니다', fixed: '영상을 복구했습니다', still: '영상이 아직 재생되지 않습니다', days: '휴지통까지 {{count}}일', soon: '곧 휴지통으로 이동', link: 'YouTube 링크', failed: '영상을 변경할 수 없습니다' },
})

function daysRemaining(value) {
  const since = Date.parse(String(value || ''))
  if (!Number.isFinite(since)) return null
  return Math.max(0, Math.ceil((since + 30 * 86400000 - Date.now()) / 86400000))
}

export default function AuthorStudioUnavailablePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = key => t(`studioUnavailableVideos.${key}`)
  const [items, setItems] = useState([])
  const [offset, setOffset] = useState(0)
  const [more, setMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [editId, setEditId] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const locked = useRef(false)

  const load = useCallback(async (start, append, signal) => {
    setLoading(true)
    setError('')
    try {
      const page = await listStudioUnavailableVideos({ offset: start, signal })
      if (signal?.aborted) return
      setItems(current => {
        if (!append) return page.items
        const known = new Set(current.map(video => String(video.id)))
        return [...current, ...page.items.filter(video => !known.has(String(video.id)))]
      })
      setOffset(page.nextOffset)
      setMore(page.hasMore)
    } catch (cause) {
      if (!signal?.aborted) setError(cause?.message || tr('failed'))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [t])

  useEffect(() => {
    const controller = new AbortController()
    void load(0, false, controller.signal)
    return () => controller.abort()
  }, [load, refresh])

  async function action(video, type) {
    if (!video?.id || locked.current) return
    if (type === 'trash' && !window.confirm(tr('confirm'))) return
    locked.current = true
    setBusy(String(video.id))
    setError('')
    setMessage('')
    try {
      if (type === 'trash') {
        await moveStudioArchivedVideoToTrash(video.id)
        setMessage(tr('moved'))
      } else if (type === 'recheck') {
        const result = await recheckStudioUnavailableVideo(video.id)
        setMessage(tr(result.available ? 'fixed' : 'still'))
      } else if (type === 'repair') {
        await replaceStudioUnavailableLink(video.id, editUrl)
        setEditId('')
        setEditUrl('')
        setMessage(tr('fixed'))
      }
      setRefresh(value => value + 1)
    } catch (cause) {
      setError(cause?.message || tr('failed'))
    } finally {
      locked.current = false
      setBusy('')
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-3 sm:px-6">
        <div className="mb-5 flex items-center gap-3">
          <button type="button" onClick={() => navigate('/author/reel/studio/me')} aria-label="Back" className="flex h-10 w-7 shrink-0 items-center justify-start text-[var(--shadow-text-primary)]">
            <ChevronLeft size={24} strokeWidth={1.8} />
          </button>
          <h1 className="text-lg font-semibold">{tr('title')}</h1>
        </div>
        <p className="mb-5 text-sm leading-6 text-[var(--shadow-text-secondary)]">{tr('subtitle')}</p>
        {message ? <p role="status" className="mb-3 rounded-lg bg-[var(--shadow-bg-soft)] px-3 py-2 text-sm">{message}</p> : null}
        {error ? <p role="alert" className="mb-3 rounded-lg bg-[var(--shadow-bg-soft)] px-3 py-2 text-sm text-[var(--shadow-danger)]">{error}</p> : null}
        <section className="overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          {items.map(video => {
            const days = daysRemaining(video.youtube_unavailable_since)
            const thumbnail = studioVideoThumbnail(video)
            return <article key={video.id} className="flex gap-3 border-b border-[var(--shadow-border)] px-3 py-4 last:border-b-0 sm:px-4">
              <div className="aspect-video w-[35%] max-w-[165px] shrink-0 overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)]">
                {thumbnail ? <img src={thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><EyeOff size={22}/></div>}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 text-sm font-medium">{video.title || 'Reel'}</h2>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--shadow-text-secondary)]"><Clock3 size={13}/>{days === null || days === 0 ? tr('soon') : t('studioUnavailableVideos.days', { count: days })}</p>
                {editId === video.id ? <div className="mt-2 space-y-2">
                  <label className="block text-xs" htmlFor={`url-${video.id}`}>{tr('link')}</label>
                  <input id={`url-${video.id}`} value={editUrl} onChange={event => setEditUrl(event.target.value)} className="w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-bg-page)] px-2 py-2 text-xs outline-none" />
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={Boolean(busy)} onClick={() => void action(video, 'repair')} className="inline-flex items-center gap-1 rounded-md bg-[var(--shadow-accent)] px-3 py-2 text-xs font-medium text-[var(--shadow-accent-text)]"><Check size={14}/>{tr('save')}</button>
                    <button type="button" disabled={Boolean(busy)} onClick={() => setEditId('')} className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs"><X size={14}/>{tr('cancel')}</button>
                  </div>
                </div> : <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={Boolean(busy)} onClick={() => void action(video, 'recheck')} className="inline-flex items-center gap-1 rounded-md border border-[var(--shadow-border)] px-2.5 py-2 text-xs disabled:opacity-50"><RefreshCw size={14}/>{tr('check')}</button>
                  <button type="button" disabled={Boolean(busy)} onClick={() => { setEditId(video.id); setEditUrl(video.video_url || '') }} className="inline-flex items-center gap-1 rounded-md border border-[var(--shadow-border)] px-2.5 py-2 text-xs disabled:opacity-50"><Link2 size={14}/>{tr('edit')}</button>
                  <button type="button" disabled={Boolean(busy)} onClick={() => void action(video, 'trash')} className="inline-flex items-center gap-1 rounded-md border border-[var(--shadow-border)] px-2.5 py-2 text-xs text-[var(--shadow-danger)] disabled:opacity-50"><Trash2 size={14}/>{tr('trash')}</button>
                </div>}
              </div>
            </article>
          })}
          {!items.length && !loading && !error ? <p className="px-4 py-14 text-center text-sm text-[var(--shadow-text-secondary)]">{tr('empty')}</p> : null}
          {loading && !items.length ? <p className="px-4 py-12 text-center text-sm">{tr('loading')}</p> : null}
        </section>
        {more && !loading ? <button type="button" onClick={() => void load(offset, true)} className="mx-auto mt-5 block rounded-lg border border-[var(--shadow-border)] px-5 py-2 text-sm">{tr('more')}</button> : null}
        {error ? <button type="button" onClick={() => setRefresh(value => value + 1)} className="mx-auto mt-4 flex items-center gap-2 text-sm"><RefreshCw size={16}/>{tr('retry')}</button> : null}
      </div>
    </main>
  )
}
