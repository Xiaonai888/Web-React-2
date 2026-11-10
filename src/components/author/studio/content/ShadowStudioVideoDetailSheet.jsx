import { useEffect, useState } from 'react'
import { BarChart3, MessageSquare, Pencil, ThumbsUp, X } from 'lucide-react'
import { getReelYouTubeId } from '../../../../utils/reelYouTube'
import { useDisplayTranslation } from '../../../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../../../i18n/registerTranslations'
import { fetchStudioVideoAnalytics } from './ShadowStudioContentApi'
import { studioDateLabel, studioFormatCount, studioFormatDuration } from './ShadowStudioContentData'

registerTranslationNamespace('shadowStudioContentDetail', {
  en: { title: 'Video details', analytics: 'View analytics', edit: 'Edit video', close: 'Close',
    noMetrics: 'Analytics are not available for draft videos.', error: 'Video analytics are unavailable.',
    published: 'Published', draft: 'Draft', views: 'Views', likes: 'Likes', comments: 'Comments',
    duration: 'Duration', publishedAt: 'Published on', loading: 'Loading analytics...',
  },
  km: { title: 'ព័ត៌មានវីដេអូ', analytics: 'មើល Analytics', edit: 'កែវីដេអូ', close: 'បិទ',
    noMetrics: 'មិនមាន Analytics សម្រាប់វីដេអូ Draft ទេ។', error: 'មិនអាចទាញ Analytics បាន។',
    published: 'បានផ្សាយ', draft: 'ព្រាង', views: 'ចំនួនមើល', likes: 'ចូលចិត្ត', comments: 'មតិ',
    duration: 'រយៈពេល', publishedAt: 'ថ្ងៃផ្សាយ', loading: 'កំពុងទាញ Analytics...',
  },
  zh: { title: '视频详情', analytics: '查看数据', edit: '编辑视频', close: '关闭', noMetrics: '草稿没有分析数据。',
    error: '无法加载视频分析。', published: '已发布', draft: '草稿', views: '观看量', likes: '喜欢',
    comments: '评论', duration: '时长', publishedAt: '发布日期', loading: '正在加载数据...',
  },
  ja: { title: '動画の詳細', analytics: '分析を見る', edit: '動画を編集', close: '閉じる',
    noMetrics: '下書き動画の分析データはありません。', error: '分析データを取得できません。',
    published: '公開済み', draft: '下書き', views: '再生数', likes: 'いいね', comments: 'コメント',
    duration: '再生時間', publishedAt: '公開日', loading: '分析を読み込み中...',
  },
  ko: { title: '영상 정보', analytics: '분석 보기', edit: '영상 수정', close: '닫기',
    noMetrics: '초안 영상의 분석은 제공되지 않습니다.', error: '영상 분석을 불러올 수 없습니다.',
    published: '게시됨', draft: '초안', views: '조회수', likes: '좋아요', comments: '댓글',
    duration: '영상 길이', publishedAt: '게시일', loading: '분석 로딩 중...',
  },
})

export default function ShadowStudioVideoDetailSheet({ video, onClose, onEdit, onAnalytics }) {
  const { t } = useDisplayTranslation()
  const id = video?.id || null
  const status = video?.status || 'draft'
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || status !== 'published') {
      setDetail(null)
      setError('')
      setLoading(false)
      return undefined
    }
    const controller = new AbortController()
    setDetail(null)
    setError('')
    setLoading(true)
    fetchStudioVideoAnalytics(id, { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) setDetail(result.video || null) })
      .catch(cause => { if (!controller.signal.aborted) setError(cause?.message || t('shadowStudioContentDetail.error')) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id, status, t])

  useEffect(() => {
    if (!id) return undefined
    const handler = event => { if (event.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [id, onClose])

  if (!id) return null
  const youtube = getReelYouTubeId(video.video_url)
  const metrics = [
    { key: 'views', Icon: BarChart3, value: detail?.view_count ?? video?.view_count },
    { key: 'likes', Icon: ThumbsUp, value: detail?.likes },
    { key: 'comments', Icon: MessageSquare, value: detail?.comments },
  ]

  return <div className="fixed inset-0 z-[100600] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={t('shadowStudioContentDetail.title')}>
    <button type="button" className="absolute inset-0 bg-black/75" onClick={onClose} aria-label={t('shadowStudioContentDetail.close')} />
    <section className="relative flex max-h-[93dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated,var(--shadow-bg-surface))] text-[var(--shadow-text-primary)] sm:rounded-2xl">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-4 py-3">
        <h2 className="min-w-0 truncate text-lg font-bold">{t('shadowStudioContentDetail.title')}</h2>
        <button type="button" onClick={onClose} aria-label={t('shadowStudioContentDetail.close')} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--shadow-bg-soft)]"><X size={22}/></button>
      </header>
      <div className="space-y-4 overflow-y-auto p-4">
        {youtube ? <div className="aspect-video overflow-hidden rounded-xl bg-black">
          <iframe title={video.title || t('shadowStudioContentDetail.title')} className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=0&playsinline=1&controls=1&rel=0`}
            referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div> : null}
        <div className="space-y-2">
          <h3 className="break-words text-base font-semibold">{video.title || '—'}</h3>
          <p className="text-xs text-[var(--shadow-text-secondary)]">{t(status === 'published' ? 'shadowStudioContentDetail.published' : 'shadowStudioContentDetail.draft')}
            {studioDateLabel(video.published_at) ? ` · ${studioDateLabel(video.published_at)}` : ''}
            {studioFormatDuration(video.duration_seconds) ? ` · ${studioFormatDuration(video.duration_seconds)}` : ''}
          </p>
          {video.description ? <p className="whitespace-pre-wrap break-words text-sm leading-6">{video.description}</p> : null}
        </div>
        {status === 'published' ? <>
          <div className="grid grid-cols-3 gap-2">
            {metrics.map(({ key, Icon, value }) => <div key={key} className="min-w-0 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] p-3">
              <p className="flex items-center gap-1 text-[11px] text-[var(--shadow-text-secondary)]"><Icon size={13}/>{t(`shadowStudioContentDetail.${key}`)}</p>
              <p className="mt-1 text-lg font-bold tabular-nums">{studioFormatCount(value) ?? '—'}</p>
            </div>)}
          </div>
          {loading ? <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioContentDetail.loading')}</p> : null}
          {error ? <p role="alert" className="text-xs text-[var(--shadow-danger)]">{error}</p> : null}
        </> : <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioContentDetail.noMetrics')}</p>}
      </div>
      <footer className="flex shrink-0 gap-2 border-t border-[var(--shadow-border)] p-4">
        {typeof onEdit === 'function' ? <button type="button" onClick={() => onEdit(video)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--shadow-border)] px-3 text-sm font-semibold"><Pencil size={16}/>{t('shadowStudioContentDetail.edit')}</button> : null}
        {status === 'published' && typeof onAnalytics === 'function' ? <button type="button" onClick={() => onAnalytics(video)} className="min-h-11 flex-1 rounded-xl bg-[var(--shadow-text-primary)] px-3 text-sm font-semibold text-[var(--shadow-bg-surface)]">{t('shadowStudioContentDetail.analytics')}</button> : null}
      </footer>
    </section>
  </div>
}
