import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ExternalLink, Play, RefreshCw, Volume2, VolumeX, X, Plus, Pencil, Trash2, Eye, EyeOff, Link2, Clapperboard, ArrowLeft, Check } from 'lucide-react'
import ReelEditManager from './ReelEditManager'
import useStudioThumbnailTracking from './studio/channel/useStudioThumbnailTracking'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

import {
  getFastReaderToken,
  listMyFastNotInterested,
  setMyFastNotInterested,
} from '../../services/fastNotInterestedApi'


registerTranslationNamespace('authorReelGrid', {
  en: { tab: 'Reel', empty: 'No Reels yet', loadError: 'Could not load Reels.', retry: 'Try again', more: 'Load more', back: 'Close Reel', previous: 'Previous Reel', next: 'Next Reel', unmute: 'Turn sound on', mute: 'Mute sound', youtube: 'Open on YouTube', noVideo: 'This Reel is unavailable.' },
  km: { tab: 'Reel', empty: 'មិនទាន់មាន Reel', loadError: 'មិនអាចផ្ទុក Reel បានទេ។', retry: 'ព្យាយាមម្ដងទៀត', more: 'មើលបន្ថែម', back: 'បិទ Reel', previous: 'Reel មុន', next: 'Reel បន្ទាប់', unmute: 'បើកសំឡេង', mute: 'បិទសំឡេង', youtube: 'មើលលើ YouTube', noVideo: 'មិនអាចចាក់ Reel នេះបានទេ។' },
  zh: { tab: 'Reel', empty: '暂无 Reel', loadError: '无法加载 Reel。', retry: '重试', more: '加载更多', back: '关闭 Reel', previous: '上一条 Reel', next: '下一条 Reel', unmute: '打开声音', mute: '静音', youtube: '在 YouTube 打开', noVideo: '无法播放此 Reel。' },
  ja: { tab: 'Reel', empty: 'Reelはまだありません', loadError: 'Reelを読み込めません。', retry: '再試行', more: 'もっと見る', back: 'Reelを閉じる', previous: '前のReel', next: '次のReel', unmute: '音声をオン', mute: 'ミュート', youtube: 'YouTubeで開く', noVideo: 'このReelを再生できません。' },
  ko: { tab: 'Reel', empty: '아직 Reel이 없습니다', loadError: 'Reel을 불러올 수 없습니다.', retry: '다시 시도', more: '더 보기', back: 'Reel 닫기', previous: '이전 Reel', next: '다음 Reel', unmute: '소리 켜기', mute: '음소거', youtube: 'YouTube에서 열기', noVideo: '이 Reel을 재생할 수 없습니다.' },
})

const PAGE_SIZE = 12
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isLocalPreviewVideo(file) {
  if (!file || !Number.isFinite(file.size) || file.size <= 0) return false
  const mime = String(file.type || '').toLowerCase()
  if (mime) return mime.startsWith('video/')
  return /\.(mp4|mov|webm|m4v|mkv|avi)$/i.test(String(file.name || ''))
}

function getYouTubeId(input) {
  try {
    const url = new URL(String(input || ''))
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    const host = url.hostname.toLowerCase()
    const parts = url.pathname.split('/').filter(Boolean)
    let id = ''
    if (host === 'youtu.be' || host === 'www.youtu.be') id = parts[0] || ''
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (parts[0] === 'watch') id = url.searchParams.get('v') || ''
      if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || ''
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : ''
  } catch {
    return ''
  }
}


function ReelViewer({
  videos,
  index,
  onIndexChange,
  onClose,
  hasMore,
  onLoadMore,
  loading,
  onConfirmedPlay,
  t,
}) {

  const [soundEnabled, setSoundEnabled] = useState(false)
  const frameRef = useRef(null)
  const touchStart = useRef(null)
  const lastWheel = useRef(0)
  const video = videos[index]
  const youtubeId = getYouTubeId(video?.video_url)

  // Report only an actual YouTube PLAYING state; merely opening is not playback.
  const confirmedPlayIdsRef = useRef(new Set())
  useEffect(() => {
    if (!youtubeId || !UUID.test(String(video?.id || '')) || typeof onConfirmedPlay !== 'function') return undefined
    const handleMessage = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return
      if (!['https://www.youtube-nocookie.com', 'https://www.youtube.com'].includes(event.origin)) return
      let data = event.data
      if (typeof data === 'string') { try { data = JSON.parse(data) } catch { return } }
      if (!data || typeof data !== 'object') return
      const playerState = data.event === 'onStateChange' ? data.info :
        data.event === 'infoDelivery' ? data.info?.playerState : null
      if (playerState !== 1) return
      const reelId = String(video.id)
      if (confirmedPlayIdsRef.current.has(reelId)) return
      confirmedPlayIdsRef.current.add(reelId)
      try { void onConfirmedPlay(reelId) } catch (error) {
        confirmedPlayIdsRef.current.delete(reelId)
        console.warn('[FAST_AUTHOR_REEL_PLAY_CALLBACK_ERROR]', error)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [video?.id, youtubeId, onConfirmedPlay])

  const change = useCallback((step) => {
    onIndexChange(current => Math.max(0, Math.min(videos.length - 1, current + step)))
  }, [onIndexChange, videos.length])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const keyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowDown') { event.preventDefault(); change(1) }
      if (event.key === 'ArrowUp') { event.preventDefault(); change(-1) }
    }
    window.addEventListener('keydown', keyDown)
    return () => {
      window.removeEventListener('keydown', keyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [change, onClose])

  const command = (name) => frameRef.current?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: name, args: [] }),
    'https://www.youtube-nocookie.com'
  )

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    command(next ? 'unMute' : 'mute')
  }

  const onWheel = (event) => {
    if (Math.abs(event.deltaY) < 14 || Date.now() - lastWheel.current < 650) return
    lastWheel.current = Date.now()
    change(event.deltaY > 0 ? 1 : -1)
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={t('authorReelGrid.tab')} className="fixed inset-0 z-[100500] flex flex-col bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--shadow-border)] px-4">
        <span className="text-[17px] font-semibold">{t('authorReelGrid.tab')}</span>
        <button type="button" onClick={onClose} aria-label={t('authorReelGrid.back')} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"><X size={22} /></button>
      </div>
      <div className="relative mx-auto flex min-h-0 w-full max-w-[540px] flex-1 items-center justify-center bg-black text-white" onWheel={onWheel}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientY ?? null }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return
          const delta = touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current)
          touchStart.current = null
          if (Math.abs(delta) > 45) change(delta > 0 ? 1 : -1)
        }}>
        {youtubeId ? (
          <iframe key={video.id} ref={frameRef} title={video.title || t('authorReelGrid.tab')}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&mute=1&playsinline=1&controls=1&enablejsapi=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`}
            onLoad={() => {
              frameRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'listening', id: youtubeId }),
                'https://www.youtube-nocookie.com'
              )
              if (soundEnabled) command('unMute')
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
            className="absolute inset-0 h-full w-full" />
        ) : <span className="px-6 text-center text-sm">{t('authorReelGrid.noVideo')}</span>}
        <div className="absolute bottom-14 left-0 top-14 z-10 w-12 touch-none" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="pointer-events-none absolute bottom-6 left-4 right-16 z-10 line-clamp-2 text-sm font-semibold drop-shadow">{video.title}</div>
        <div className="absolute bottom-5 right-3 z-20 flex flex-col gap-3">
          <button type="button" onClick={toggleSound} aria-label={t(soundEnabled ? 'authorReelGrid.mute' : 'authorReelGrid.unmute')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
          <a href={video.video_url} target="_blank" rel="noopener noreferrer" aria-label={t('authorReelGrid.youtube')} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"><ExternalLink size={19} /></a>
        </div>
        {index > 0 ? <button type="button" onClick={() => change(-1)} aria-label={t('authorReelGrid.previous')} className="absolute left-3 top-4 z-20 rounded-full bg-black/60 p-3 text-white"><ArrowUp size={20} /></button> : null}
        {index < videos.length - 1 ? <button type="button" onClick={() => change(1)} aria-label={t('authorReelGrid.next')} className="absolute right-3 top-4 z-20 rounded-full bg-black/60 p-3 text-white"><ArrowDown size={20} /></button> : null}
        {index === videos.length - 1 && hasMore ? <button type="button" disabled={loading} onClick={onLoadMore} className="absolute top-4 right-3 z-20 rounded-full bg-black/60 px-4 py-2 text-xs text-white">{t('authorReelGrid.more')}</button> : null}
      </div>
    </div>
  )
}


function TrackedPublicReelCard({ video, onOpen }) {
  const id = getYouTubeId(video.video_url)
  const { setThumbnailRef, onClick: reportClick } = useStudioThumbnailTracking({
    videoId: video.id,
    surface: 'author',
    enabled: Boolean(id),
  })

  return (
    <button ref={setThumbnailRef} type="button" onClick={() => { reportClick(); onOpen() }}
      aria-label={video.title}
      className="group relative aspect-[9/16] overflow-hidden rounded-md bg-[#171717] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--shadow-accent)]">
      <img src={video.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy"
        onError={event => { const fallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback }}
        className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <Play className="absolute right-2 top-2 drop-shadow" size={17} fill="currentColor" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-left text-xs font-medium text-white drop-shadow sm:text-sm">
        <Eye size={14} aria-hidden="true" />{formatReelViews(video)}
      </div>
    </button>
  )
}


function PublicReelGrid({ userId }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const validUser = UUID.test(String(userId || ''))

  // Only unhide a reel after YouTube confirms playback (same rule as Fast).
  const hiddenLookupRef = useRef({ token: '', promise: null })
  const restoringIdsRef = useRef(new Set())
  const handleConfirmedPlay = useCallback(async (videoId) => {
    const id = String(videoId || '')
    if (!UUID.test(id) || restoringIdsRef.current.has(id)) return
    restoringIdsRef.current.add(id)
    try {
      const token = getFastReaderToken()
      if (!token) {
        const key = 'shadow_fast_hidden_reels_v1'
        const saved = JSON.parse(localStorage.getItem(key) || '[]')
        if (Array.isArray(saved) && saved.some(value => String(value) === id)) {
          localStorage.setItem(key, JSON.stringify(saved.filter(value => String(value) !== id)))
        }
        return
      }
      if (hiddenLookupRef.current.token !== token) hiddenLookupRef.current = { token, promise: null }
      const cache = hiddenLookupRef.current
      if (!cache.promise) {
        cache.promise = (async () => {
          const hidden = new Set()
          let offset = 0
          for (let page = 0; page < 50; page += 1) {
            const result = await listMyFastNotInterested({ token, offset })
            for (const reelId of result.video_ids || []) hidden.add(String(reelId))
            if (!result.pagination?.has_more) break
            const nextOffset = Number(result.pagination.next_offset)
            if (!Number.isSafeInteger(nextOffset) || nextOffset <= offset) break
            offset = nextOffset
          }
          return hidden
        })().catch(error => { cache.promise = null; throw error })
      }
      const hidden = await cache.promise
      if (!hidden.has(id)) return
      await setMyFastNotInterested(id, false, { token })
      hidden.delete(id)
    } catch (error) {
      console.warn('[FAST_AUTHOR_REEL_UNHIDE_FAILED]', error)
    } finally {
      restoringIdsRef.current.delete(id)
    }
  }, [])


  useEffect(() => {
    if (!validUser) return undefined
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetch(`${API_BASE_URL}/api/fast/videos?user_id=${encodeURIComponent(userId)}&limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`, { signal: controller.signal })
      .then(async response => {
        const result = await response.json().catch(() => ({}))
        if (!response.ok || result.ok !== true || !Array.isArray(result.videos)) throw new Error(result.message || 'Unable to load Reels')
        return result
      })
      .then(result => {
        const rows = result.videos.filter(item => String(item.user_id) === String(userId) && getYouTubeId(item.video_url))
        setVideos(previous => {
          if (page === 0) return rows
          const known = new Set(previous.map(item => item.id))
          return [...previous, ...rows.filter(item => !known.has(item.id))]
        })
        setHasMore(Boolean(result.pagination?.has_more))
      })
      .catch(err => { if (!controller.signal.aborted) setError(err.message || 'Unable to load Reels') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [userId, validUser, page, retryCount])

  const closeViewer = useCallback(() => setSelectedIndex(null), [])
  const loadMore = () => { if (!loading && hasMore) setPage(value => value + 1) }

  if (!validUser) return <p className="py-14 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorReelGrid.empty')}</p>

  return (
    <section className="mx-auto max-w-[980px]">
      <div className="mb-3 text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorReelGrid.tab')}</div>
      {videos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
          
{videos.map(video => (
  <TrackedPublicReelCard
    key={video.id}
    video={video}
    onOpen={() => navigate(`/fast?reel=${encodeURIComponent(String(video.id))}`, {
      state: { fromAuthorReel: true, returnTo: `${window.location.pathname}${window.location.search}` },
    })}
  />
))}

        </div>
      ) : !loading && !error ? (
        <p className="py-14 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorReelGrid.empty')}</p>
      ) : null}
      {loading && videos.length === 0 ? <div className="grid grid-cols-3 gap-2">{Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[9/16] animate-pulse rounded-md bg-[var(--shadow-bg-soft)]" />)}</div> : null}
      {error ? <div className="mt-4 text-center"><p role="alert" className="text-xs text-red-500">{t('authorReelGrid.loadError')}</p><button type="button" onClick={() => setRetryCount(v => v + 1)} className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--shadow-border)] px-4 py-2 text-xs"><RefreshCw size={14}/>{t('authorReelGrid.retry')}</button></div> : null}
      {hasMore && videos.length > 0 && !error ? <div className="py-5 text-center"><button type="button" disabled={loading} onClick={loadMore} className="rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-2.5 text-xs text-[var(--shadow-text-primary)] disabled:opacity-60">{t('authorReelGrid.more')}</button></div> : null}
      {selectedIndex !== null && videos[selectedIndex] ? (
        <ReelViewer videos={videos} index={selectedIndex} onIndexChange={setSelectedIndex} onClose={closeViewer} hasMore={hasMore} onLoadMore={loadMore} loading={loading} onConfirmedPlay={handleConfirmedPlay} t={t} />
      ) : null}
    </section>
  )
}

registerTranslationNamespace('authorReelManager', {
  en: {
    myReels: 'My Reels', add: 'Add Reel', edit: 'Edit', remove: 'Delete', deleteConfirm: 'Delete this Reel permanently?', published: 'Published', draft: 'Draft', pause: 'Unpublish', publish: 'Publish', saveDraft: 'Save Draft', saveChanges: 'Save Changes', cancel: 'Cancel', title: 'Video title', link: 'YouTube video link', description: 'Caption (optional)', loading: 'Loading your Reels...', empty: 'No Reels yet. Add your first YouTube video.', error: 'Could not load your Reels.', retry: 'Try again', more: 'Load more', invalidLink: 'Enter a valid YouTube or YouTube Shorts link.', titleRequired: 'Enter a video title.', login: 'Sign in to manage Reels.', saved: 'Reel saved.', deleted: 'Reel deleted.', failed: 'Could not save changes.', deleteFailed: 'Could not delete Reel.', videoType: 'YouTube videos only', preview: 'Preview', premium: 'Paid Reel', access: 'Only published free YouTube Reels appear in Fast.',
  },
  km: {
    myReels: 'Reel របស់ខ្ញុំ', add: 'បន្ថែម Reel', edit: 'កែ', remove: 'លុប', deleteConfirm: 'តើចង់លុប Reel នេះជាអចិន្ត្រៃយ៍មែនទេ?', published: 'បានផ្សាយ', draft: 'Draft', pause: 'បិទការផ្សាយ', publish: 'ផ្សាយ', saveDraft: 'រក្សាទុក Draft', saveChanges: 'រក្សាទុកការកែ', cancel: 'បោះបង់', title: 'ចំណងជើងវីដេអូ', link: 'YouTube Link', description: 'ពិពណ៌នា (មិនបង្ខំ)', loading: 'កំពុងផ្ទុក Reel...', empty: 'មិនទាន់មាន Reel ទេ។ បន្ថែមវីដេអូ YouTube ដំបូង។', error: 'មិនអាចទាញ Reel បានទេ។', retry: 'ព្យាយាមម្ដងទៀត', more: 'មើលបន្ថែម', invalidLink: 'សូមបញ្ចូល YouTube ឬ Shorts Link ត្រឹមត្រូវ។', titleRequired: 'សូមបញ្ចូលចំណងជើង។', login: 'សូមចូលគណនីដើម្បីគ្រប់គ្រង Reel។', saved: 'បានរក្សាទុក Reel។', deleted: 'បានលុប Reel។', failed: 'មិនអាចរក្សាទុកបានទេ។', deleteFailed: 'មិនអាចលុប Reel បានទេ។', videoType: 'ប្រើតែវីដេអូ YouTube', preview: 'មើលជាមុន', premium: 'Reel បង់ប្រាក់', access: 'មានតែ Reel YouTube ឥតគិតថ្លៃដែលបានផ្សាយ ទើបបង្ហាញក្នុង Fast។',
  },
  zh: {
    myReels: '我的 Reel', add: '添加 Reel', edit: '编辑', remove: '删除', deleteConfirm: '永久删除这条 Reel？', published: '已发布', draft: '草稿', pause: '取消发布', publish: '发布', saveDraft: '保存草稿', saveChanges: '保存修改', cancel: '取消', title: '视频标题', link: 'YouTube 视频链接', description: '描述（可选）', loading: '加载 Reel 中...', empty: '暂无 Reel，添加第一个 YouTube 视频。', error: '无法加载 Reel。', retry: '重试', more: '加载更多', invalidLink: '请输入有效的 YouTube 或 Shorts 链接。', titleRequired: '请输入标题。', login: '请登录以管理 Reel。', saved: 'Reel 已保存。', deleted: 'Reel 已删除。', failed: '保存失败。', deleteFailed: '删除 Reel 失败。', videoType: '仅限 YouTube 视频', preview: '预览', premium: '付费 Reel', access: '只有已发布的免费 YouTube Reel 会显示在 Fast。',
  },
  ja: {
    myReels: 'マイ Reel', add: 'Reelを追加', edit: '編集', remove: '削除', deleteConfirm: 'この Reel を完全に削除しますか？', published: '公開中', draft: '下書き', pause: '公開停止', publish: '公開', saveDraft: '下書き保存', saveChanges: '変更を保存', cancel: 'キャンセル', title: '動画タイトル', link: 'YouTube 動画リンク', description: '説明（任意）', loading: 'Reelを読み込み中...', empty: 'Reel はまだありません。YouTube 動画を追加してください。', error: 'Reel を読み込めません。', retry: '再試行', more: 'もっと見る', invalidLink: '有効な YouTube または Shorts リンクを入力してください。', titleRequired: 'タイトルを入力してください。', login: 'Reel の管理にはログインが必要です。', saved: 'Reel を保存しました。', deleted: 'Reel を削除しました。', failed: '保存できませんでした。', deleteFailed: 'Reel を削除できませんでした。', videoType: 'YouTube 動画のみ', preview: 'プレビュー', premium: '有料 Reel', access: '公開中の無料 YouTube Reel のみ Fast に表示されます。',
  },
  ko: {
    myReels: '내 Reel', add: 'Reel 추가', edit: '수정', remove: '삭제', deleteConfirm: '이 Reel을 영구 삭제할까요?', published: '게시됨', draft: '임시저장', pause: '게시 취소', publish: '게시', saveDraft: '임시저장', saveChanges: '변경 저장', cancel: '취소', title: '동영상 제목', link: 'YouTube 동영상 링크', description: '설명 (선택)', loading: 'Reel 불러오는 중...', empty: 'Reel이 없습니다. 첫 YouTube 동영상을 추가하세요.', error: 'Reel을 불러올 수 없습니다.', retry: '다시 시도', more: '더 보기', invalidLink: '올바른 YouTube 또는 Shorts 링크를 입력하세요.', titleRequired: '제목을 입력하세요.', login: 'Reel을 관리하려면 로그인하세요.', saved: 'Reel 저장됨.', deleted: 'Reel 삭제됨.', failed: '저장할 수 없습니다.', deleteFailed: 'Reel을 삭제할 수 없습니다.', videoType: 'YouTube 동영상만', preview: '미리보기', premium: '유료 Reel', access: '게시된 무료 YouTube Reel만 Fast에 표시됩니다.',
  },
})

function authToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function reelViewsValue(video) {
  const value = video?.view_count ?? video?.views_count ?? video?.play_count ?? video?.views
  const number = Number(value)
  return value !== undefined && value !== null && Number.isFinite(number) && number >= 0
    ? number : null
}

function formatReelViews(video) {
  const count = reelViewsValue(video)
  if (count === null) return '—'
  return Intl.NumberFormat('en', { notation: count >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(count)
}

function sortReels(rows, sort) {
  return [...rows].sort((a, b) => {
    if (sort === 'popular') {
      const av = reelViewsValue(a)
      const bv = reelViewsValue(b)
      // Missing view statistics do not get converted into fabricated zeroes.
      if (av !== null && bv !== null && av !== bv) return bv - av
      if (av === null && bv !== null) return 1
      if (bv === null && av !== null) return -1
    }
    const ad = new Date(a.published_at || 0).getTime() || 0
    const bd = new Date(b.published_at || 0).getTime() || 0
    return (sort === 'oldest' ? ad - bd : bd - ad) || String(b.id).localeCompare(String(a.id))
  })
}

function OwnerReelManager({ studioMode = false, onExitStudio }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [videos, setVideos] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editor, setEditor] = useState(null)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [managingVideo, setManagingVideo] = useState(null)
  const [sort, setSort] = useState('latest')
  const [sortOpen, setSortOpen] = useState(false)
  const sortMenuRef = useRef(null)
  const loadVersionRef = useRef(0)
  const pickerRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const localPreviewRef = useRef(null)
  const [pickerError, setPickerError] = useState('')

  const createRoute = useCallback(() => navigate('/author/reel/add', {
    state: { returnTo: `${window.location.pathname}${window.location.search}` },
  }), [navigate])

  const chooseVideo = useCallback(() => pickerRef.current?.click(), [])
  useEffect(() => {
    if (!isLocalPreviewVideo(selectedFile) || !localPreviewRef.current) return undefined
    const videoElement = localPreviewRef.current
    const objectUrl = URL.createObjectURL(selectedFile)
    videoElement.src = encodeURI(objectUrl)
    return () => {
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedFile])
  useEffect(() => {
    if (!sortOpen) return undefined
    const onDocumentDown = (event) => {
      if (!sortMenuRef.current?.contains(event.target)) setSortOpen(false)
    }
    document.addEventListener('pointerdown', onDocumentDown)
    return () => document.removeEventListener('pointerdown', onDocumentDown)
  }, [sortOpen])

  const published = useMemo(() => videos.filter(video =>
    video.status === 'published' && video.access_type !== 'paid' && getYouTubeId(video.video_url)
  ), [videos])
  const galleryVideos = useMemo(() => sortReels(published, sort), [published, sort])
  const hasViewStatistics = galleryVideos.some(video => reelViewsValue(video) !== null)

  const load = useCallback(async (nextOffset = 0, signal) => {
  const version = loadVersionRef.current
    const token = authToken()
    if (!token) { setError(t('authorReelManager.login')); setLoading(false); return }
    setLoading(true)
    setError('')
    try {
      const mode = studioMode ? 'manager' : 'gallery'
const response = await fetch(
  `${API_BASE_URL}/api/fast/videos/mine?limit=${PAGE_SIZE}&offset=${nextOffset}&mode=${mode}&sort=${sort}`,
  {
        headers: { Authorization: `Bearer ${token}` }, signal, cache: 'no-store',
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.ok || !Array.isArray(result.videos)) throw new Error(result.message || t('authorReelManager.error'))
      if (signal?.aborted || version !== loadVersionRef.current) return
      setVideos(current => nextOffset === 0 ? result.videos : [...current, ...result.videos.filter(v => !current.some(old => old.id === v.id))])
      setOffset(Number(result.pagination?.next_offset ?? nextOffset + result.videos.length))
      setHasMore(Boolean(result.pagination?.has_more))
    } catch (err) {
  if (!signal?.aborted && version === loadVersionRef.current)
    setError(err.message || t('authorReelManager.error'))
} finally {
  if (!signal?.aborted && version === loadVersionRef.current)
    setLoading(false)
}
}, [t, studioMode, sort])

  useEffect(() => {
  loadVersionRef.current += 1
  setVideos([])
  setOffset(0)
  setHasMore(false)

  const controller = new AbortController()
  load(0, controller.signal)

  return () => controller.abort()
}, [load])
  const openEditor = (video = null) => {
    setEditor(video || 'new')
    setTitle(video?.title || '')
    setLink(video?.video_url || '')
    setDescription(video?.description || '')
    setError('')
    setNotice('')
  }

  const closeEditor = () => setEditor(null)
  const request = async (method, path, payload) => {
    const token = authToken()
    if (!token) throw new Error(t('authorReelManager.login'))
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(payload ? { 'Content-Type': 'application/json' } : {}) },
      body: payload ? JSON.stringify(payload) : undefined,
      cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) throw new Error(data.message || t('authorReelManager.failed'))
    return data
  }

  const save = async status => {
    const videoId = getYouTubeId(link)
    if (!videoId) { setError(t('authorReelManager.invalidLink')); return }
    if (!title.trim()) { setError(t('authorReelManager.titleRequired')); return }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const fields = { title: title.trim(), description: description.trim(), video_url: `https://www.youtube.com/watch?v=${videoId}`, status }
      const data = editor === 'new'
        ? await request('POST', '/api/fast/videos', {
          ...fields, thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          access_type: 'free', unlock_price_diamonds: 0, tags: [],
        })
        : await request('PATCH', `/api/fast/videos/${encodeURIComponent(editor.id)}`, fields)
      setVideos(list => [data.video, ...list.filter(v => v.id !== data.video.id)])
      if (editor === 'new') setOffset(n => n + 1)
      setNotice(t('authorReelManager.saved'))
      closeEditor()
    } catch (err) {
      setError(err.message || t('authorReelManager.failed'))
    } finally { setBusy(false) }
  }

  const changeStatus = async video => {
    if (busy) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const data = await request('PATCH', `/api/fast/videos/${encodeURIComponent(video.id)}`, { status: video.status === 'published' ? 'draft' : 'published' })
      setVideos(list => list.map(v => v.id === data.video.id ? data.video : v))
      setNotice(t('authorReelManager.saved'))
    } catch (err) { setError(err.message || t('authorReelManager.failed')) }
    finally { setBusy(false) }
  }

  const remove = async video => {
    if (busy || !window.confirm(t('authorReelManager.deleteConfirm'))) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await request('DELETE', `/api/fast/videos/${encodeURIComponent(video.id)}`)
      setVideos(list => list.filter(v => v.id !== video.id))
      setOffset(n => Math.max(0, n - 1))
      setSelectedIndex(null)
      setNotice(t('authorReelManager.deleted'))
    } catch (err) { setError(err.message || t('authorReelManager.deleteFailed')) }
    finally { setBusy(false) }
  }

  const activeVideoId = getYouTubeId(link)

  if (!studioMode) return (
    <section className="relative mx-auto max-w-[980px] pb-24 text-[var(--shadow-text-primary)]">
      <input
        ref={pickerRef}
        type="file"
        accept="video/*"
        className="hidden"
        aria-label="Choose a video from device"
        onChange={event => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          if (!isLocalPreviewVideo(file)) {
            setPickerError('Please choose a video file.')
            return
          }
          setPickerError('')
          setSelectedFile(file)
        }}
      />

      <div className="mb-3 flex items-center justify-between gap-2">
        <div ref={sortMenuRef} className="relative min-w-0">
          <button
            type="button"
            onClick={() => setSortOpen(open => !open)}
            aria-label="Sort My Reels"
            aria-expanded={sortOpen}
            aria-haspopup="menu"
            className="inline-flex min-h-10 items-center gap-2 text-left text-base font-semibold"
          >
            <span>My Reels</span>
            <span aria-hidden="true" className="inline-block text-[11px] leading-none text-[var(--shadow-text-primary)]">
              {sortOpen ? '▼' : '▲'}
            </span>
          </button>
          {sortOpen && (
            <div role="menu" aria-label="Sort reels" className="absolute left-0 top-full z-40 mt-1 w-[168px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-black shadow-lg">
              {[
                ['latest', 'Latest'],
                ['popular', 'Popular'],
                ['oldest', 'Oldest'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  role="menuitemradio"
                  aria-checked={sort === value}
                  type="button"
                  onClick={() => { setSort(value); setSortOpen(false) }}
                  className="flex min-h-11 w-full items-center justify-between px-4 text-left text-sm hover:bg-gray-100"
                >
                  {label}
                  {sort === value ? <Check size={16} className="text-violet-600" /> : null}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate('/author/reel/studio', {
            state: { returnTo: `${window.location.pathname}${window.location.search}` },
          })}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ffbf00] px-3 py-2 text-[11px] font-semibold text-black sm:text-xs"
        >
          <Clapperboard size={15} /> Shadow Studio
        </button>
      </div>
      <p className="mb-3 text-[11px] text-[var(--shadow-text-secondary)]">{t('authorReelManager.access')}</p>
      {sort === 'popular' && !hasViewStatistics && galleryVideos.length > 0 ? (
        <p className="mb-2 text-[11px] text-amber-700" role="status">View statistics are not available from the Reel API yet. Showing newest first.</p>
      ) : null}

      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        <button
          type="button"
          onClick={chooseVideo}
          aria-label="Create Reel from device"
          className="relative flex aspect-[9/16] min-w-0 flex-col items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-[#ffd500] via-[#ffbd14] to-[#ff8a00] px-1 text-center text-white shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <span className="mb-2 inline-flex items-center justify-center rounded-full bg-white/20 p-2.5 sm:p-4"><Clapperboard size={26} strokeWidth={2.2} className="sm:h-9 sm:w-9" /></span>
          <span className="text-xs font-semibold drop-shadow-sm sm:text-lg">Create Reel</span>
        </button>
        {galleryVideos.map((video, index) => {
          const id = getYouTubeId(video.video_url)
          const fallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          return (
            <button
              type="button"
              key={video.id}
              onClick={() => navigate(`/fast?reel=${encodeURIComponent(String(video.id))}`, {
                state: { fromAuthorReel: true, returnTo: `${window.location.pathname}${window.location.search}` },
              })}
              aria-label={`Play ${video.title}`}
              className="group relative aspect-[9/16] min-w-0 overflow-hidden rounded-md bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shadow-accent)]"
            >
              <img
                src={video.thumbnail_url || fallback}
                alt=""
                loading="lazy"
                onError={event => { if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <Play size={15} fill="currentColor" aria-hidden="true" className="absolute right-2 top-2 drop-shadow" />
              <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs font-medium text-white drop-shadow-sm sm:text-sm">
                <Eye size={15} aria-hidden="true" /> {formatReelViews(video)}
              </span>
            </button>
          )
        })}
        {loading && !videos.length ? Array.from({ length: 5 }, (_, index) => (
          <div key={`skeleton-${index}`} className="aspect-[9/16] animate-pulse rounded-md bg-[var(--shadow-bg-soft)]" />
        )) : null}
      </div>
      {error ? <div className="mt-3 flex items-center gap-3 text-xs text-red-600" role="alert"><span>{error}</span><button type="button" onClick={() => load(0)} className="rounded-full border border-[var(--shadow-border)] px-3 py-1.5 text-[var(--shadow-text-primary)]">Retry</button></div> : null}
      {hasMore && !error ? (
        <div className="py-5 text-center">
          <button type="button" disabled={loading} onClick={() => load(offset)} className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-sm disabled:opacity-50">
            {loading ? t('authorReelManager.loading') : t('authorReelManager.more')}
          </button>
        </div>
      ) : null}

      {/* Fixed above the author page bottom navigation; not inside the scrolling grid. */}
      <button
        type="button"
        onClick={chooseVideo}
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-40 inline-flex min-h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_2px_16px_rgba(0,0,0,0.15)] sm:text-base"
      >
        <Clapperboard size={20} strokeWidth={1.8} /> Create reel
      </button>

      {selectedIndex !== null && galleryVideos[selectedIndex] ? (
        <ReelViewer
          videos={galleryVideos}
          index={selectedIndex}
          onIndexChange={setSelectedIndex}
          onClose={() => setSelectedIndex(null)}
          hasMore={hasMore}
          onLoadMore={() => load(offset)}
          loading={loading}
          t={t}
        />
      ) : null}

      {/* Local-file selection is only a preview; Shadow never stores the video binary. */}
      {selectedFile && (
        <div role="dialog" aria-modal="true" aria-label="Selected video" className="fixed inset-0 z-[100600] flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 text-black shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-base font-bold">Selected video</h3>
              <button type="button" onClick={() => setSelectedFile(null)} aria-label="Close selected video"><X size={22} /></button>
            </div>
            <p className="mb-3 truncate text-xs text-gray-600" title={selectedFile.name}>{selectedFile.name}</p>
            <video ref={localPreviewRef} controls playsInline className="mx-auto max-h-[45vh] w-full rounded-lg bg-black" />
            <p className="mt-3 text-xs text-gray-600">Shadow currently publishes YouTube links only. Upload this video to YouTube, then add its link to Shadow.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="https://www.youtube.com/upload" target="_blank" rel="noopener noreferrer" className="rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold">Upload to YouTube</a>
              <button type="button" onClick={() => { setSelectedFile(null); createRoute() }} className="rounded-full bg-[#ffbf00] px-3 py-2 text-xs font-semibold">Continue with YouTube link</button>
            </div>
          </div>
        </div>
      )}
      {pickerError ? <p role="alert" className="fixed bottom-32 left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 rounded-xl bg-red-600 px-4 py-2 text-xs text-white">{pickerError}</p> : null}
    </section>
  )

  return (
    <section className="mx-auto max-w-[980px] text-[var(--shadow-text-primary)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button type="button" onClick={() => {
          if (typeof onExitStudio === 'function') onExitStudio()
          else navigate('/author/page', { state: { activeTab: 'Reel' } })
        }} className="inline-flex items-center gap-1.5 text-base font-semibold" aria-label="Back to My Reels"><ArrowLeft size={18}/> Shadow Studio</button>
        <button type="button" onClick={createRoute} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--shadow-accent)] px-3.5 py-2 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50"><Plus size={15}/>{t('authorReelManager.add')}</button>
      </div>
      <p className="mb-4 text-xs text-[var(--shadow-text-secondary)]">{t('authorReelManager.access')}</p>
      {editor ? (
        <div className="mb-5 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <div className="mb-4 flex items-center justify-between gap-2"><h3 className="font-semibold text-sm">{editor === 'new' ? t('authorReelManager.add') : t('authorReelManager.edit')}</h3><button type="button" disabled={busy} onClick={closeEditor} aria-label={t('authorReelManager.cancel')}><X size={20}/></button></div>
          <div className="space-y-3">
            <label className="block text-xs font-medium">{t('authorReelManager.link')}
              <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." maxLength={1000} className="mt-1.5 w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-sm text-[var(--shadow-text-primary)] outline-none" />
            </label>
            <label className="block text-xs font-medium">{t('authorReelManager.title')}
              <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} className="mt-1.5 w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="block text-xs font-medium">{t('authorReelManager.description')}
              <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={500} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-sm outline-none" />
            </label>
            {activeVideoId ? <img src={`https://img.youtube.com/vi/${activeVideoId}/hqdefault.jpg`} alt={t('authorReelManager.preview')} className="h-28 max-w-full rounded-lg object-contain bg-black" loading="lazy" /> : <p className="text-xs text-[var(--shadow-text-secondary)]"><Link2 size={13} className="mr-1 inline"/>{t('authorReelManager.videoType')}</p>}
            <div className="flex flex-wrap gap-2">
              {editor === 'new' ? <button type="button" disabled={busy} onClick={() => save('draft')} className="rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-4 py-2.5 text-xs font-semibold disabled:opacity-50">{t('authorReelManager.saveDraft')}</button> : null}
              <button type="button" disabled={busy} onClick={() => save(editor === 'new' ? 'published' : editor.status)} className="rounded-lg bg-[var(--shadow-accent)] px-4 py-2.5 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50">{editor === 'new' ? t('authorReelManager.publish') : t('authorReelManager.saveChanges')}</button>
            </div>
          </div>
        </div>
      ) : null}
      {notice ? <p role="status" className="mb-3 text-xs text-[var(--shadow-success)]">{notice}</p> : null}
      {error ? <div role="alert" className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--shadow-danger)]"><span>{error}</span><button type="button" onClick={() => load(0)} className="rounded-full border border-[var(--shadow-border)] px-3 py-1.5 text-[var(--shadow-text-primary)]">{t('authorReelManager.retry')}</button></div> : null}
      {loading && !videos.length ? <div className="py-8 text-center text-xs text-[var(--shadow-text-secondary)]">{t('authorReelManager.loading')}</div> : null}
      {!loading && !videos.length && !error ? <div className="rounded-xl border border-dashed border-[var(--shadow-border)] px-5 py-12 text-center text-xs text-[var(--shadow-text-secondary)]">{t('authorReelManager.empty')}</div> : null}
      {videos.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((video,index) => {
          const ytId = getYouTubeId(video.video_url)
          return <div key={video.id} className="overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
            <button type="button" onClick={() => {
              if (video.status === 'published' && video.access_type === 'free') {
                navigate(`/fast?reel=${encodeURIComponent(String(video.id))}`, {
                  state: { fromAuthorReel: true, returnTo: `${window.location.pathname}${window.location.search}` },
                })
              } else {
                setSelectedIndex(index) // Unpublished/draft preview stays private to Shadow Studio.
              }
            }} disabled={!ytId} className="relative block aspect-[9/16] w-full overflow-hidden bg-black text-white disabled:opacity-50">
              {ytId ? <img src={video.thumbnail_url || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="" loading="lazy" onError={event => { const fallback = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback }} className="h-full w-full object-cover" /> : null}
              <Play size={23} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow" fill="currentColor" />
              <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] text-white">{t(video.status === 'published' ? 'authorReelManager.published' : 'authorReelManager.draft')}</span>
            </button>
            <div className="space-y-2 p-2">
              <p className="line-clamp-2 min-h-[32px] text-xs font-semibold">{video.title}</p>
              {video.access_type === 'paid' ? <p className="text-[10px] text-[var(--shadow-text-secondary)]">{t('authorReelManager.premium')}</p> : null}
              <div className="flex flex-wrap gap-1.5">
                <button type="button" disabled={busy} onClick={() => setManagingVideo(video)} className="inline-flex items-center gap-1 rounded-md border border-[var(--shadow-border)] px-2 py-1.5 text-[11px] disabled:opacity-50"><Pencil size={12}/>{t('authorReelManager.edit')}</button>
                <button type="button" disabled={busy} onClick={() => changeStatus(video)} className="inline-flex items-center gap-1 rounded-md border border-[var(--shadow-border)] px-2 py-1.5 text-[11px] disabled:opacity-50">{video.status === 'published' ? <EyeOff size={12}/> : <Eye size={12}/>}{t(video.status === 'published' ? 'authorReelManager.pause' : 'authorReelManager.publish')}</button>
                <button type="button" disabled={busy} onClick={() => remove(video)} className="inline-flex items-center gap-1 rounded-md border border-[var(--shadow-border)] px-2 py-1.5 text-[11px] text-[var(--shadow-danger)] disabled:opacity-50"><Trash2 size={12}/>{t('authorReelManager.remove')}</button>
              </div>
            </div>
          </div>
        })}
      </div> : null}
      {hasMore && videos.length > 0 ? <div className="py-5 text-center"><button type="button" disabled={loading || busy} onClick={() => load(offset)} className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-xs disabled:opacity-50">{t('authorReelManager.more')}</button></div> : null}
      {selectedIndex !== null && videos[selectedIndex] ? <ReelViewer videos={videos} index={selectedIndex} onIndexChange={setSelectedIndex} onClose={() => setSelectedIndex(null)} hasMore={hasMore} onLoadMore={() => load(offset)} loading={loading} t={t} /> : null}
      {managingVideo ? (
        <ReelEditManager
          key={managingVideo.id}
          video={managingVideo}
          onClose={() => setManagingVideo(null)}
          onSaved={(updated) => {
            setVideos(items => items.map(item => item.id === updated.id ? updated : item))
            setManagingVideo(null)
            setNotice(t('authorReelManager.saved'))
          }}
        />
      ) : null}
    </section>
  )
}

export default function AuthorReelGrid({ userId, isOwner = false, studioMode = false, onExitStudio }) {
  return isOwner
    ? <OwnerReelManager studioMode={studioMode} onExitStudio={onExitStudio} />
    : <PublicReelGrid userId={userId} />
}
