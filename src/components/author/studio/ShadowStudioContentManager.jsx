import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Eye, EyeOff, Pencil, Play, Plus, RectangleHorizontal, RectangleVertical, RefreshCw, Trash2, X } from 'lucide-react'
import { registerTranslationNamespace } from '../../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../../utils/displayLanguage'
import { getReelYouTubeId } from '../../../utils/reelYouTube'
import ReelEditManager from '../ReelEditManager'

registerTranslationNamespace('shadowStudioContent', {
  en: {
    long: 'Long', short: 'Short', add: 'Add Reel', loading: 'Loading videos...',
    noVideos: 'No videos in this tab.', more: 'Load more', retry: 'Retry',
    edit: 'Edit', publish: 'Publish', unpublish: 'Unpublish', remove: 'Delete',
    deleteConfirm: 'Delete this video permanently?', failed: 'Unable to update videos.',
    draft: 'Draft', published: 'Published', premium: 'Paid',
    toLong: 'Move to Long', toShort: 'Move to Short', moved: 'Video moved to the selected tab.',
    saved: 'Video saved.', removed: 'Video deleted.', statusChanged: 'Status updated.',
    manage: 'Long and Short are folders inside Shadow Studio, not reader-facing video categories.',
    preview: 'Video preview', close: 'Close preview', noDuration: 'Duration unavailable',
  },
  km: {
    long: 'Long', short: 'Short', add: 'បន្ថែម Reel', loading: 'កំពុងទាញវីដេអូ...',
    noVideos: 'គ្មានវីដេអូនៅក្នុង Tab នេះទេ។', more: 'ទាញបន្ថែម', retry: 'សាកល្បងម្ដងទៀត',
    edit: 'កែ', publish: 'ផ្សាយ', unpublish: 'បិទការផ្សាយ', remove: 'លុប',
    deleteConfirm: 'តើលុបវីដេអូនេះជាអចិន្ត្រៃយ៍មែនទេ?', failed: 'មិនអាចកែវីដេអូបាន។',
    draft: 'Draft', published: 'បានផ្សាយ', premium: 'បង់ប្រាក់',
    toLong: 'ប្ដូរទៅ Long', toShort: 'ប្ដូរទៅ Short', moved: 'បានផ្លាស់វីដេអូទៅ Tab ដែលបានជ្រើស។',
    saved: 'បានរក្សាទុកវីដេអូ។', removed: 'បានលុបវីដេអូ។', statusChanged: 'បានកែស្ថានភាព។',
    manage: 'Long និង Short គឺជា Folder ក្នុង Shadow Studio មិនមែនប្រភេទសម្រាប់អ្នកអានទេ។',
    preview: 'មើលវីដេអូជាមុន', close: 'បិទការមើល', noDuration: 'មិនមានរយៈពេល',
  },
  zh: {
    long: '长视频', short: '短视频', add: '添加 Reel', loading: '加载视频中...',
    noVideos: '此分类没有视频。', more: '加载更多', retry: '重试', edit: '编辑', publish: '发布',
    unpublish: '取消发布', remove: '删除', deleteConfirm: '永久删除此视频？', failed: '无法更新视频。',
    draft: '草稿', published: '已发布', premium: '付费', toLong: '移至长视频', toShort: '移至短视频',
    moved: '视频已移动至所选分类。', saved: '已保存。', removed: '已删除。', statusChanged: '状态已更新。',
    manage: '长视频和短视频仅用于 Studio 内部整理，不影响读者端。', preview: '视频预览',
    close: '关闭预览', noDuration: '时长不可用',
  },
  ja: {
    long: '長編', short: 'ショート', add: 'Reelを追加', loading: '動画を読み込み中...',
    noVideos: 'このタブに動画はありません。', more: 'もっと見る', retry: '再試行', edit: '編集', publish: '公開',
    unpublish: '非公開', remove: '削除', deleteConfirm: 'この動画を完全に削除しますか？', failed: '動画を変更できません。',
    draft: '下書き', published: '公開済み', premium: '有料', toLong: '長編へ移動', toShort: 'ショートへ移動',
    moved: '動画を別のタブに移動しました。', saved: '保存しました。', removed: '削除しました。', statusChanged: '状態を更新しました。',
    manage: '長編とショートはStudio内の整理用フォルダーです。読者表示には影響しません。', preview: 'プレビュー',
    close: 'プレビューを閉じる', noDuration: '再生時間は不明',
  },
  ko: {
    long: '롱폼', short: '쇼츠', add: 'Reel 추가', loading: '동영상 로딩 중...',
    noVideos: '이 탭에 동영상이 없습니다.', more: '더 보기', retry: '다시 시도', edit: '수정', publish: '게시',
    unpublish: '게시 취소', remove: '삭제', deleteConfirm: '이 동영상을 영구 삭제할까요?', failed: '동영상을 수정하지 못했습니다.',
    draft: '초안', published: '게시됨', premium: '유료', toLong: '롱폼으로 이동', toShort: '쇼츠로 이동',
    moved: '동영상이 선택한 탭으로 이동했습니다.', saved: '저장했습니다.', removed: '삭제했습니다.', statusChanged: '상태를 변경했습니다.',
    manage: '롱폼과 쇼츠는 Studio 내부 정리용 폴더이며 독자 화면에는 영향을 주지 않습니다.', preview: '미리보기',
    close: '미리보기 닫기', noDuration: '길이 정보 없음',
  },
})

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const PAGE_SIZE = 24

async function request(path, { method = 'GET', body, signal } = {}) {
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
  if (!token) throw new Error('Sign in to manage Reels.')
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok !== true) throw new Error(data?.message || `Request failed (${response.status}).`)
  return data
}

function durationLabel(value) {
  const seconds = Number(value)
  if (!Number.isSafeInteger(seconds) || seconds < 1) return null
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor(seconds / 60) % 60
  const secs = seconds % 60
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${minutes}:${String(secs).padStart(2, '0')}`
}

function PreviewDialog({ video, onClose, t }) {
  const id = getReelYouTubeId(video?.video_url)
  if (!id) return null
  return <div className="fixed inset-0 z-[100500] flex items-center justify-center bg-black/85 p-3" role="dialog" aria-modal="true" aria-label={t('shadowStudioContent.preview')}>
    <div className="w-full max-w-[780px] space-y-3">
      <div className="flex items-center justify-between gap-3 text-white">
        <p className="min-w-0 truncate text-sm font-semibold">{video.title}</p>
        <button type="button" className="rounded-full bg-white/15 p-2" onClick={onClose} aria-label={t('shadowStudioContent.close')}><X size={21}/></button>
      </div>
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        <iframe title={video.title} className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=0&playsinline=1&controls=1&rel=0`} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      </div>
    </div>
  </div>
}

export default function ShadowStudioContentManager({ onExitStudio }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('long')
  const [page, setPage] = useState(0)
  const [reload, setReload] = useState(0)
  const [videos, setVideos] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    if (page === 0) {
      setVideos([])
      setHasMore(false)
    }
    const params = new URLSearchParams({
      mode: 'manager', sort: 'latest', video_type: tab,
      limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE),
    })
    request(`/api/fast/videos/mine?${params.toString()}`, { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted) return
        const items = Array.isArray(result.videos) ? result.videos : []
        setVideos(previous => {
          if (page === 0) return items
          const ids = new Set(previous.map(item => item.id))
          return [...previous, ...items.filter(item => !ids.has(item.id))]
        })
        setHasMore(Boolean(result.pagination?.has_more))
      })
      .catch(cause => {
        if (!controller.signal.aborted) setError(cause.message || t('shadowStudioContent.failed'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [tab, page, reload, t])

  const refresh = () => {
    setPage(0)
    setReload(value => value + 1)
  }
  const changeTab = value => {
    if (value === tab) return
    setTab(value)
    setPage(0)
    setNotice('')
    setEditing(null)
  }
  const runAction = async (video, action) => {
    if (working) return
    setWorking(video.id)
    setError('')
    setNotice('')
    try {
      let message = ''
      if (action === 'move') {
        const next = tab === 'long' ? 'short' : 'long'
        await request(`/api/shadow-studio/video-type/videos/${encodeURIComponent(video.id)}`, {
          method: 'PATCH', body: { video_type: next },
        })
        message = t('shadowStudioContent.moved')
      } else if (action === 'status') {
        await request(`/api/fast/videos/${encodeURIComponent(video.id)}`, {
          method: 'PATCH', body: { status: video.status === 'published' ? 'draft' : 'published' },
        })
        message = t('shadowStudioContent.statusChanged')
      } else if (action === 'delete') {
        if (!window.confirm(t('shadowStudioContent.deleteConfirm'))) return
        await request(`/api/fast/videos/${encodeURIComponent(video.id)}`, { method: 'DELETE' })
        message = t('shadowStudioContent.removed')
      }
      setNotice(message)
      refresh()
    } catch (cause) {
      setError(cause.message || t('shadowStudioContent.failed'))
    } finally {
      setWorking('')
    }
  }
  const openVideo = video => {
    if (!getReelYouTubeId(video.video_url)) return
    if (video.status === 'published' && video.access_type === 'free') {
      navigate(`/fast?reel=${encodeURIComponent(video.id)}`, {
        state: { fromAuthorReel: true, returnTo: '/author/reel/studio' },
      })
    } else {
      setPreview(video)
    }
  }

  return <section className="mx-auto w-full max-w-[980px] space-y-4 text-[var(--shadow-text-primary)]">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" onClick={onExitStudio} className="text-base font-semibold">Shadow Studio</button>
      <button type="button" onClick={() => navigate('/author/reel/add', { state: { returnTo: '/author/reel/studio' } })}
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--shadow-accent)] px-4 text-xs font-semibold text-[var(--shadow-accent-text)]">
        <Plus size={16}/>{t('shadowStudioContent.add')}
      </button>
    </div>
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--shadow-bg-soft)] p-1" role="tablist" aria-label="Video folders">
      {[['long', RectangleHorizontal], ['short', RectangleVertical]].map(([key, Icon]) => (
        <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => changeTab(key)}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold ${tab === key ? 'bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm' : 'text-[var(--shadow-text-secondary)]'}`}>
          <Icon size={20}/>{t(`shadowStudioContent.${key}`)}
        </button>
      ))}
    </div>
    <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioContent.manage')}</p>
    {notice ? <p role="status" className="text-xs text-[var(--shadow-success)]">{notice}</p> : null}
    {error ? <div role="alert" className="flex items-center justify-between gap-2 text-xs text-[var(--shadow-danger)]">
      <span>{error}</span><button type="button" onClick={refresh} className="inline-flex items-center gap-1 rounded-lg border border-[var(--shadow-border)] px-3 py-2"><RefreshCw size={14}/>{t('shadowStudioContent.retry')}</button>
    </div> : null}
    {loading && page === 0 ? <div className="py-10 text-center text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioContent.loading')}</div> : null}
    {!loading && !error && videos.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--shadow-border)] px-5 py-12 text-center text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioContent.noVideos')}</div> : null}
    {videos.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {videos.map(video => {
        const id = getReelYouTubeId(video.video_url)
        const busy = Boolean(working || loading)
        return <article key={video.id} className="min-w-0 overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          <button type="button" onClick={() => openVideo(video)} disabled={!id || busy}
            className={`relative flex w-full items-center justify-center overflow-hidden bg-black text-white ${tab === 'short' ? 'aspect-[9/16]' : 'aspect-video'} disabled:opacity-60`}>
            {id ? <img src={video.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : null}
            <Play size={22} fill="currentColor" className="relative drop-shadow-lg" aria-hidden="true" />
            <span className="absolute bottom-1 left-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px]">{t(`shadowStudioContent.${video.status === 'published' ? 'published' : 'draft'}`)}</span>
            {durationLabel(video.duration_seconds) ? <span className="absolute bottom-1 right-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px]">{durationLabel(video.duration_seconds)}</span> : null}
          </button>
          <div className="space-y-2 p-2">
            <p className="line-clamp-2 min-h-[32px] text-xs font-semibold">{video.title || '—'}</p>
            {video.access_type === 'paid' ? <p className="text-[10px] text-[var(--shadow-text-secondary)]">{t('shadowStudioContent.premium')}</p> : null}
            <button type="button" disabled={busy} onClick={() => runAction(video, 'move')}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-2 py-2 text-[11px] font-semibold disabled:opacity-50">
              <ArrowLeftRight size={13}/>{t(`shadowStudioContent.${tab === 'long' ? 'toShort' : 'toLong'}`)}
            </button>
            <div className="flex flex-wrap gap-1">
              <button type="button" disabled={busy} onClick={() => setEditing(video)} className="inline-flex items-center gap-1 rounded border border-[var(--shadow-border)] px-2 py-1.5 text-[11px] disabled:opacity-50"><Pencil size={12}/>{t('shadowStudioContent.edit')}</button>
              <button type="button" disabled={busy} onClick={() => runAction(video, 'status')} className="inline-flex items-center gap-1 rounded border border-[var(--shadow-border)] px-2 py-1.5 text-[11px] disabled:opacity-50">
                {video.status === 'published' ? <EyeOff size={12}/> : <Eye size={12}/>}{t(`shadowStudioContent.${video.status === 'published' ? 'unpublish' : 'publish'}`)}
              </button>
              <button type="button" disabled={busy} onClick={() => runAction(video, 'delete')} className="inline-flex items-center gap-1 rounded border border-[var(--shadow-border)] px-2 py-1.5 text-[11px] text-[var(--shadow-danger)] disabled:opacity-50"><Trash2 size={12}/>{t('shadowStudioContent.remove')}</button>
            </div>
          </div>
        </article>
      })}
    </div> : null}
    {hasMore && !error ? <div className="py-3 text-center"><button type="button" disabled={loading || Boolean(working)} onClick={() => setPage(value => value + 1)} className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-xs disabled:opacity-50">
      {loading ? t('shadowStudioContent.loading') : t('shadowStudioContent.more')}
    </button></div> : null}
    {editing ? <ReelEditManager key={editing.id} video={editing} onClose={() => setEditing(null)} onSaved={() => {setEditing(null);setNotice(t('shadowStudioContent.saved'));refresh()}} /> : null}
    {preview ? <PreviewDialog video={preview} t={t} onClose={() => setPreview(null)}/> : null}
  </section>
}
