import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Film, RefreshCw } from 'lucide-react'
import { useDisplayTranslation } from '../../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../../i18n/registerTranslations'

registerTranslationNamespace('shadowStudioVideoTypes', {
  en: {
    title: 'Classify long videos and Shorts', description: 'Classify your existing videos so Shadow Studio can include eligible long videos in Dashboard and Ranking. Choose Long only for videos longer than 3 minutes.',
    show: 'Manage video types', hide: 'Close', long: 'Long video', short: 'Short', loading: 'Loading videos...',
    empty: 'All loaded videos have a type.', retry: 'Retry', more: 'Load more', saving: 'Saving...',
    published: 'Published', draft: 'Draft', shortsOnly: 'YouTube Shorts links cannot be marked as Long.',
    requestFailed: 'Unable to load or update video types.', login: 'Please sign in again.',
    success: 'Video type updated.',
  },
  km: {
    title: 'កំណត់ប្រភេទវីដេអូវែង និង Shorts', description: 'កំណត់ប្រភេទវីដេអូចាស់ ដើម្បីឱ្យ Dashboard និង Ranking អាចជ្រើសវីដេអូវែងបាន។ ជ្រើស Long សម្រាប់តែវីដេអូលើស ៣ នាទី។',
    show: 'គ្រប់គ្រងប្រភេទវីដេអូ', hide: 'បិទ', long: 'វីដេអូវែង', short: 'Short', loading: 'កំពុងទាញវីដេអូ...',
    empty: 'វីដេអូដែលបានទាញទាំងអស់មានប្រភេទរួចហើយ។', retry: 'សាកល្បងម្ដងទៀត', more: 'ទាញបន្ថែម', saving: 'កំពុងរក្សាទុក...',
    published: 'បានផ្សាយ', draft: 'ព្រាង', shortsOnly: 'Link YouTube Shorts មិនអាចកំណត់ជា Long បានទេ។',
    requestFailed: 'មិនអាចទាញ ឬកែប្រភេទវីដេអូបានទេ។', login: 'សូមចូលគណនីឡើងវិញ។',
    success: 'បានរក្សាទុកប្រភេទវីដេអូ។',
  },
  zh: {
    title: '分类长视频和 Shorts', description: '分类现有视频以用于控制面板和排名。仅对超过3分钟的视频选择长视频。',
    show: '管理视频类型', hide: '关闭', long: '长视频', short: 'Shorts', loading: '正在加载视频...', empty: '已加载视频都已分类。',
    retry: '重试', more: '加载更多', saving: '保存中...', published: '已发布', draft: '草稿',
    shortsOnly: 'YouTube Shorts 链接不能标记为长视频。', requestFailed: '无法读取或更新视频类型。', login: '请重新登录。', success: '视频类型已更新。',
  },
  ja: {
    title: '長編動画と Shorts の分類', description: '既存の動画を分類するとダッシュボードとランキングに長編動画を表示できます。3分を超える動画のみ長編を選択してください。',
    show: '動画タイプを管理', hide: '閉じる', long: '長編動画', short: 'Shorts', loading: '動画を読み込み中...', empty: '取得した動画はすべて分類済みです。',
    retry: '再試行', more: 'さらに読み込む', saving: '保存中...', published: '公開済み', draft: '下書き',
    shortsOnly: 'YouTube Shorts のリンクは長編に設定できません。', requestFailed: '動画タイプを読み込み・更新できません。', login: '再ログインしてください。', success: '動画タイプを保存しました。',
  },
  ko: {
    title: '긴 동영상 및 Shorts 분류', description: '기존 동영상을 분류하면 대시보드와 순위에 긴 동영상이 표시됩니다. 3분이 넘는 동영상만 긴 동영상으로 선택하세요.',
    show: '동영상 유형 관리', hide: '닫기', long: '긴 동영상', short: 'Shorts', loading: '동영상 로딩 중...', empty: '불러온 동영상은 모두 분류되었습니다.',
    retry: '다시 시도', more: '더 보기', saving: '저장 중...', published: '게시됨', draft: '초안',
    shortsOnly: 'YouTube Shorts 링크는 긴 동영상으로 설정할 수 없습니다.', requestFailed: '동영상 유형을 불러오거나 변경할 수 없습니다.', login: '다시 로그인하세요.', success: '동영상 유형이 저장되었습니다.',
  },
})

const API_BASE = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const LIMIT = 15

function token() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function request(path, options = {}) {
  const bearer = token()
  if (!bearer) throw new Error('LOGIN_REQUIRED')
  const response = await fetch(`${API_BASE}/api/shadow-studio/video-type${path}`, {
    method: options.method || 'GET',
    signal: options.signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${bearer}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.ok) throw new Error(data?.message || `HTTP ${response.status}`)
  return data
}

function shortsLink(value) {
  try {
    const url = new URL(value)
    return ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname.toLowerCase()) &&
      url.pathname.toLowerCase().startsWith('/shorts/')
  } catch {
    return false
  }
}

export default function ShadowStudioVideoTypePanel() {
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const [reload, setReload] = useState(0)
  const [videos, setVideos] = useState([])
  const [nextOffset, setNextOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [workingId, setWorkingId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const moreController = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const controller = new AbortController()
    setVideos([])
    setError('')
    setLoading(true)
    request(`/unclassified?limit=${LIMIT}&offset=0`, { signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted) return
        setVideos(Array.isArray(data.videos) ? data.videos : [])
        setNextOffset(Number(data.pagination?.next_offset) || 0)
        setHasMore(Boolean(data.pagination?.has_more))
      })
      .catch(cause => {
        if (!controller.signal.aborted) setError(cause.message === 'LOGIN_REQUIRED' ? t('shadowStudioVideoTypes.login') : cause.message || t('shadowStudioVideoTypes.requestFailed'))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => {
      controller.abort()
      moreController.current?.abort()
    }
  }, [open, reload, t])

  async function loadMore() {
    if (loading || loadingMore || workingId || !hasMore) return
    const controller = new AbortController()
    moreController.current?.abort()
    moreController.current = controller
    setLoadingMore(true)
    setError('')
    try {
      const data = await request(`/unclassified?limit=${LIMIT}&offset=${nextOffset}`, { signal: controller.signal })
      if (controller.signal.aborted) return
      setVideos(current => {
        const ids = new Set(current.map(video => video.id))
        return [...current, ...(data.videos || []).filter(video => !ids.has(video.id))]
      })
      setNextOffset(Number(data.pagination?.next_offset) || nextOffset)
      setHasMore(Boolean(data.pagination?.has_more))
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause.message || t('shadowStudioVideoTypes.requestFailed'))
    } finally {
      if (!controller.signal.aborted) setLoadingMore(false)
    }
  }

  async function classify(videoId, videoType) {
    if (workingId) return
    moreController.current?.abort()
    setLoadingMore(false)
    setWorkingId(videoId)
    setError('')
    setNotice('')
    try {
      await request(`/videos/${encodeURIComponent(videoId)}`, { method: 'PATCH', body: { video_type: videoType } })
      setNotice(t('shadowStudioVideoTypes.success'))
      setReload(current => current + 1)
    } catch (cause) {
      setError(cause.message || t('shadowStudioVideoTypes.requestFailed'))
    } finally {
      setWorkingId('')
    }
  }

  return (
    <section className="mx-auto mb-5 w-full max-w-[980px] overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
      <button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-[var(--shadow-bg-soft)]">
        <Film size={20} aria-hidden="true" />
        <span className="min-w-0 flex-1 text-sm font-semibold">{t('shadowStudioVideoTypes.show')}</span>
        {open ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
      </button>
      {open ? <div className="space-y-3 border-t border-[var(--shadow-border)] p-4">
        <h2 className="text-sm font-bold">{t('shadowStudioVideoTypes.title')}</h2>
        <p className="text-xs leading-relaxed text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoTypes.description')}</p>
        {loading ? <p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoTypes.loading')}</p> : null}
        {error ? <div role="alert" className="space-y-2 text-sm"><p>{error}</p>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-3 py-1.5" onClick={() => setReload(value => value + 1)}>
            <RefreshCw size={14} />{t('shadowStudioVideoTypes.retry')}
          </button>
        </div> : null}
        {notice && !error ? <p role="status" className="text-xs text-[var(--shadow-text-secondary)]">{notice}</p> : null}
        {!loading && !error && videos.length === 0 ? <p className="text-sm text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoTypes.empty')}</p> : null}
        <div className="space-y-2">
          {videos.map(video => {
            const isShortsLink = shortsLink(video.video_url)
            const disabled = Boolean(workingId || loading || loadingMore)
            return <div key={video.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--shadow-border)] p-3">
              <div className="h-[56px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)]">
                {video.thumbnail_url ? <img src={video.thumbnail_url} alt="" loading="lazy" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-[120px] flex-1 space-y-1">
                <p className="line-clamp-2 text-sm font-medium">{video.title || '—'}</p>
                <p className="text-xs text-[var(--shadow-text-secondary)]">{t(`shadowStudioVideoTypes.${video.status === 'published' ? 'published' : 'draft'}`)}</p>
                {isShortsLink ? <p className="text-xs text-[var(--shadow-text-secondary)]">{t('shadowStudioVideoTypes.shortsOnly')}</p> : null}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button type="button" disabled={disabled || isShortsLink} onClick={() => classify(video.id, 'long')}
                  className="rounded-lg border border-[var(--shadow-border)] px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">
                  {t('shadowStudioVideoTypes.long')}
                </button>
                <button type="button" disabled={disabled} onClick={() => classify(video.id, 'short')}
                  className="rounded-lg border border-[var(--shadow-border)] px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">
                  {t('shadowStudioVideoTypes.short')}
                </button>
              </div>
            </div>
          })}
        </div>
        {hasMore && !loading ? <button type="button" disabled={loadingMore || Boolean(workingId)} onClick={loadMore}
          className="w-full rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-sm font-medium disabled:opacity-40">
          {loadingMore ? t('shadowStudioVideoTypes.loading') : t('shadowStudioVideoTypes.more')}
        </button> : null}
      </div> : null}
    </section>
  )
}
