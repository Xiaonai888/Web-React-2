import { useEffect, useMemo, useState } from 'react'
import { Pencil, Trash2, X } from 'lucide-react'
import ReelPlaylistSelector from './ReelPlaylistSelector'
import ReelTagsField from './ReelTagsField'
import ReelVideoPreview from './ReelVideoPreview'
import { getReelYouTubeUrls } from '../../utils/reelYouTube'
import {
  createReelPlaylist, deleteReelPlaylist, getReelPlaylistAssignments,
  listMyReelPlaylists, renameReelPlaylist, setReelPlaylistAssignments,
} from '../../services/reelPlaylistsApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { markStudioContentCacheStale, invalidateStudioPlaylistCache } from './studio/content/ShadowStudioContentCache'
import { invalidateStudioAnalyticsCache } from '../../services/shadowStudioAnalyticsApi'

registerTranslationNamespace('reelEditManager', {
  en: {
    heading: 'Edit Reel', title: 'Video title', link: 'YouTube link', caption: 'Caption', save: 'Save changes', cancel: 'Cancel', saving: 'Saving...', loading: 'Loading Playlists...',
    playlistManagement: 'Manage playlists', rename: 'Rename', delete: 'Delete', deleteConfirm: 'Delete this Playlist? Reels will not be deleted.', renamePrompt: 'Playlist name',
    invalidLink: 'Enter a valid YouTube URL.', requiredTitle: 'Enter a title.', failed: 'Could not save changes.', listFailed: 'Could not load playlists.', assignFailed: 'Reel changes were saved, but Playlist changes failed. Retry Save to finish.',
    playlists: 'Playlists', playlistsHelp: 'Choose the Playlists for this Reel.', selectPlaylists: 'Choose Playlists', selectedCount: '{{count}} Playlists', searchPlaylist: 'Search Playlists',
    newPlaylist: 'New Playlist', playlistName: 'Playlist name', create: 'Create', done: 'Done', noPlaylists: 'No Playlists yet', morePlaylists: 'Load more',
    tags: 'Tags', tagsHelp: 'Optional; use Tags to describe this Reel.', tagsPlaceholder: 'Type a tag and press Enter or comma', tagLimit: 'Up to 10 Tags, each 24 characters.', tagsMaximum: 'Up to 10 Tags.', tagsLength: 'Tags must be 24 characters or fewer.', tagsChars: 'Up to 500 total characters.', removeTag: 'Remove {{tag}}', copyTags: 'Copy Tags', clearTags: 'Clear Tags',
    preview: 'Preview', youtubeOnly: 'YouTube only',
  },
  km: {
    heading: 'កែ Reel', title: 'ចំណងជើងវីដេអូ', link: 'YouTube Link', caption: 'ពិពណ៌នា', save: 'រក្សាទុកការកែ', cancel: 'បោះបង់', saving: 'កំពុងរក្សាទុក...', loading: 'កំពុងទាញ Playlists...',
    playlistManagement: 'គ្រប់គ្រង Playlists', rename: 'ប្តូរឈ្មោះ', delete: 'លុប', deleteConfirm: 'តើចង់លុប Playlist នេះមែនទេ? Reel មិនត្រូវបានលុបទេ។', renamePrompt: 'ឈ្មោះ Playlist',
    invalidLink: 'YouTube Link មិនត្រឹមត្រូវ។', requiredTitle: 'សូមបញ្ចូលចំណងជើង។', failed: 'មិនអាចរក្សាទុកបាន។', listFailed: 'មិនអាចទាញ Playlists បាន។', assignFailed: 'បានរក្សាទុកការកែ Reel ប៉ុន្តែភ្ជាប់ Playlist បរាជ័យ។ ចុច Save ម្តងទៀត ដើម្បីសាកឡើងវិញ។',
    playlists: 'Playlists', playlistsHelp: 'ជ្រើស Playlists សម្រាប់ Reel នេះ។', selectPlaylists: 'ជ្រើស Playlists', selectedCount: '{{count}} Playlists', searchPlaylist: 'ស្វែងរក Playlist',
    newPlaylist: 'Playlist ថ្មី', playlistName: 'ឈ្មោះ Playlist', create: 'បង្កើត', done: 'រួចរាល់', noPlaylists: 'មិនទាន់មាន Playlist', morePlaylists: 'មើលបន្ថែម',
    tags: 'Tags', tagsHelp: 'មិនបង្ខំទេ។ Tags ជួយពិពណ៌នាវីដេអូនេះ។', tagsPlaceholder: 'បញ្ចូល Tag ហើយចុច Enter ឬ Comma', tagLimit: 'អតិបរមា 10 Tags ក្នុងមួយ Tag មិនលើស 24 តួ។', tagsMaximum: 'អតិបរមា 10 Tags។', tagsLength: 'Tag មួយមិនលើស 24 តួអក្សរ។', tagsChars: 'សរុបមិនលើស 500 តួ។', removeTag: 'លុប {{tag}}', copyTags: 'ចម្លង Tags', clearTags: 'លុប Tags',
    preview: 'មើលជាមុន', youtubeOnly: 'YouTube ប៉ុណ្ណោះ',
  },
  zh: {
    heading: '编辑 Reel', title: '视频标题', link: 'YouTube 链接', caption: '简介', save: '保存更改', cancel: '取消', saving: '保存中...', loading: '正在加载播放列表...',
    playlistManagement: '管理播放列表', rename: '重命名', delete: '删除', deleteConfirm: '删除此播放列表？视频不会删除。', renamePrompt: '播放列表名称',
    invalidLink: '请输入有效的 YouTube 链接。', requiredTitle: '请输入标题。', failed: '无法保存。', listFailed: '无法加载播放列表。', assignFailed: '视频已保存，但播放列表关联失败。请重试保存。',
    playlists: '播放列表', playlistsHelp: '为此视频选择播放列表。', selectPlaylists: '选择播放列表', selectedCount: '{{count}} 个播放列表', searchPlaylist: '搜索播放列表', newPlaylist: '新建播放列表', playlistName: '播放列表名称', create: '创建', done: '完成', noPlaylists: '暂无播放列表', morePlaylists: '加载更多',
    tags: '标签', tagsHelp: '标签可选。', tagsPlaceholder: '输入标签，按逗号或回车', tagLimit: '最多10个标签，每个24字符。', tagsMaximum: '最多10个标签。', tagsLength: '每个标签最多24字符。', tagsChars: '最多500字符。', removeTag: '删除 {{tag}}', copyTags: '复制标签', clearTags: '清空标签', preview: '预览', youtubeOnly: '仅限 YouTube',
  },
  ja: {
    heading: 'Reelを編集', title: '動画タイトル', link: 'YouTubeリンク', caption: '説明', save: '変更を保存', cancel: 'キャンセル', saving: '保存中...', loading: 'プレイリスト読み込み中...',
    playlistManagement: 'プレイリスト管理', rename: '名前変更', delete: '削除', deleteConfirm: 'プレイリストを削除しますか？動画は削除されません。', renamePrompt: 'プレイリスト名',
    invalidLink: '有効なYouTubeリンクを入力してください。', requiredTitle: 'タイトルを入力してください。', failed: '保存できません。', listFailed: 'プレイリストを読み込めません。', assignFailed: 'Reelは保存しましたがプレイリスト設定が失敗しました。再保存してください。',
    playlists: 'プレイリスト', playlistsHelp: 'Reelのプレイリストを選びます。', selectPlaylists: '選択', selectedCount: '{{count}}件のプレイリスト', searchPlaylist: 'プレイリスト検索', newPlaylist: '新規プレイリスト', playlistName: 'プレイリスト名', create: '作成', done: '完了', noPlaylists: 'プレイリストはありません', morePlaylists: 'もっと見る',
    tags: 'タグ', tagsHelp: 'タグは任意です。', tagsPlaceholder: 'タグを入力、カンマかEnter', tagLimit: '最大10件、1件24文字。', tagsMaximum: '最大10件。', tagsLength: '24文字以内。', tagsChars: '合計500文字以内。', removeTag: '{{tag}}を削除', copyTags: 'タグをコピー', clearTags: 'すべて削除', preview: 'プレビュー', youtubeOnly: 'YouTubeのみ',
  },
  ko: {
    heading: 'Reel 수정', title: '영상 제목', link: 'YouTube 링크', caption: '설명', save: '변경 저장', cancel: '취소', saving: '저장 중...', loading: '재생목록 불러오는 중...',
    playlistManagement: '재생목록 관리', rename: '이름 변경', delete: '삭제', deleteConfirm: '재생목록을 삭제할까요? 영상은 삭제되지 않습니다.', renamePrompt: '재생목록 이름',
    invalidLink: '올바른 YouTube 링크를 입력하세요.', requiredTitle: '제목을 입력하세요.', failed: '저장하지 못했습니다.', listFailed: '재생목록을 불러오지 못했습니다.', assignFailed: '영상은 저장되었지만 재생목록 설정이 실패했습니다. 다시 저장하세요.',
    playlists: '재생목록', playlistsHelp: 'Reel의 재생목록을 선택하세요.', selectPlaylists: '선택', selectedCount: '{{count}}개 재생목록', searchPlaylist: '재생목록 검색', newPlaylist: '새 재생목록', playlistName: '재생목록 이름', create: '만들기', done: '완료', noPlaylists: '재생목록이 없습니다', morePlaylists: '더 보기',
    tags: '태그', tagsHelp: '태그는 선택입니다.', tagsPlaceholder: '태그를 입력하고 쉼표 또는 Enter', tagLimit: '최대 10개, 각 24자.', tagsMaximum: '최대 10개.', tagsLength: '각 24자 이내.', tagsChars: '총 500자 이내.', removeTag: '{{tag}} 삭제', copyTags: '태그 복사', clearTags: '태그 지우기', preview: '미리보기', youtubeOnly: 'YouTube만',
  },
})

const API = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const PAGE_SIZE = 30
const MAX_TAGS = 10
const MAX_TAG_LENGTH = 24

function getToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

export default function ReelEditManager({ video, onClose, onSaved }) {
  const { t } = useDisplayTranslation()
  const translate = (key, args) => t(`reelEditManager.${key.replace(/^authorReelAdd\./, '')}`, args)
  const [link, setLink] = useState(video.video_url || '')
  const [title, setTitle] = useState(video.title || '')
  const [caption, setCaption] = useState(video.description || '')
  const [tags, setTags] = useState(Array.isArray(video.tags) ? video.tags : [])
  const [tagDraft, setTagDraft] = useState('')
  const [playlists, setPlaylists] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assignmentsLoading, setAssignmentsLoading] = useState(true)
  const [assignmentsReady, setAssignmentsReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const youtube = useMemo(() => getReelYouTubeUrls(link), [link])

  useEffect(() => {
    const abort = new AbortController()
    getReelPlaylistAssignments(video.id).then(result => {
      if (!abort.signal.aborted) {
        setSelectedIds(Array.isArray(result.playlist_ids) ? result.playlist_ids : [])
        setAssignmentsReady(true)
      }
    }).catch(err => { if (!abort.signal.aborted) setError(err.message || translate('listFailed')) })
      .finally(() => { if (!abort.signal.aborted) setAssignmentsLoading(false) })
    return () => abort.abort()
  }, [video.id])

  useEffect(() => {
    const abort = new AbortController()
    setLoading(true)
    listMyReelPlaylists({ limit: PAGE_SIZE, offset: page * PAGE_SIZE, search, signal: abort.signal })
      .then(data => {
        if (abort.signal.aborted) return
        const rows = Array.isArray(data.playlists) ? data.playlists : []
        setPlaylists(old => page === 0 ? rows : [...old, ...rows.filter(item => !old.some(p => p.id === item.id))])
        setHasMore(Boolean(data.pagination?.has_more))
      }).catch(err => { if (!abort.signal.aborted) setError(err.message || translate('listFailed')) })
      .finally(() => { if (!abort.signal.aborted) setLoading(false) })
    return () => abort.abort()
  }, [page, search])

  const create = async name => {
    const data = await createReelPlaylist(name)
    const playlist = data.playlist
    if (!playlist?.id) throw new Error(translate('failed'))
    setPlaylists(old => [playlist, ...old.filter(item => item.id !== playlist.id)])
    setSelectedIds(old => old.includes(playlist.id) ? old : [...old, playlist.id])
    markStudioContentCacheStale(['playlists'])
  }
  const rename = async playlist => {
    const name = window.prompt(translate('renamePrompt'), playlist.name)
    if (name === null || !name.trim() || name.trim() === playlist.name) return
    setBusy(true)
    try {
      const response = await renameReelPlaylist(playlist.id, name.trim())
      setPlaylists(old => old.map(item => item.id === playlist.id ? response.playlist : item))
      markStudioContentCacheStale(['playlists'])
      invalidateStudioPlaylistCache(playlist.id)
      setError('')
    } catch (err) { setError(err.message || translate('failed')) }
    finally { setBusy(false) }
  }
  const remove = async playlist => {
    if (!window.confirm(translate('deleteConfirm'))) return
    setBusy(true)
    try {
      await deleteReelPlaylist(playlist.id)
      setPlaylists(old => old.filter(item => item.id !== playlist.id))
      setSelectedIds(old => old.filter(id => id !== playlist.id))
      markStudioContentCacheStale()
      invalidateStudioPlaylistCache(playlist.id)
      setError('')
    } catch (err) { setError(err.message || translate('failed')) }
    finally { setBusy(false) }
  }
  const save = async () => {
    if (!youtube) { setError(translate('invalidLink')); return }
    if (!title.trim()) { setError(translate('requiredTitle')); return }
    const pending = tagDraft.trim()
    if (pending.includes(',') || pending.length > MAX_TAG_LENGTH) { setError(translate('tagsLength')); return }
    const normalized = pending && !tags.some(tag => tag.toLowerCase() === pending.toLowerCase())
      ? [...tags, pending] : tags
    if (normalized.length > MAX_TAGS) { setError(translate('tagsMaximum')); return }
    if (normalized.join(', ').length > 500) { setError(translate('tagsChars')); return }
    if (assignmentsLoading || !assignmentsReady || loading) return
    setBusy(true)
    setError('')
    let videoSaved = false
    try {
      const token = getToken()
      if (!token) throw new Error(translate('failed'))
      const response = await fetch(`${API}/api/fast/videos/${encodeURIComponent(video.id)}`, {
        method: 'PATCH', cache: 'no-store',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), description: caption.trim(), video_url: youtube.videoUrl, tags: normalized }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.ok !== true || !result.video) throw new Error(result.message || translate('failed'))
      videoSaved = true
markStudioContentCacheStale()
invalidateStudioAnalyticsCache()
await setReelPlaylistAssignments(video.id, selectedIds)
markStudioContentCacheStale()
invalidateStudioPlaylistCache()
onSaved?.(result.video)
    } catch (err) {
      setError(videoSaved ? `${translate('assignFailed')} ${err.message || ''}` : (err.message || translate('failed')))
    } finally { setBusy(false) }
  }

  const inputClass = 'mt-1.5 w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-sm text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]'
  return (
    <div className="fixed inset-0 z-[210] overflow-y-auto bg-[var(--shadow-bg-primary)] text-[var(--shadow-text-primary)]" role="dialog" aria-modal="true" aria-label={translate('heading')}>
      <div className="mx-auto w-full max-w-[760px] space-y-4 px-3 py-5 pb-24 sm:px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{translate('heading')}</h2>
          <button type="button" onClick={onClose} disabled={busy} className="rounded-full p-2 hover:bg-[var(--shadow-bg-hover)]" aria-label={translate('cancel')}><X size={20} /></button>
        </div>
        <div className="space-y-3 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <label className="block text-xs font-semibold">{translate('link')}
            <input type="url" value={link} onChange={e => setLink(e.target.value)} maxLength={1000} className={inputClass} disabled={busy}/>
          </label>
          <label className="block text-xs font-semibold">{translate('title')}
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} className={inputClass} disabled={busy}/>
          </label>
          <label className="block text-xs font-semibold">{translate('caption')}
            <textarea rows={3} value={caption} onChange={e => setCaption(e.target.value)} maxLength={500} className={inputClass} disabled={busy}/>
          </label>
          <ReelVideoPreview videoUrl={link} title={title} t={key => translate(key)} />
        </div>
        <div className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <ReelPlaylistSelector playlists={playlists} selectedIds={selectedIds} onSelectionChange={setSelectedIds}
            onCreatePlaylist={create} disabled={busy || assignmentsLoading} loading={loading} hasMore={hasMore}
            onLoadMore={() => setPage(p => p + 1)} loadMoreLabel={translate('morePlaylists')}
            onSearchChange={term => { setSearch(term); setPage(0) }} previewOnly={false} t={translate}/>
          <h3 className="mt-4 mb-2 text-xs font-semibold">{translate('playlistManagement')}</h3>
          {playlists.slice(0, 30).map(item => (
            <div key={item.id} className="flex items-center gap-2 border-t border-[var(--shadow-border)] py-2 text-xs">
              <span className="min-w-0 flex-1 break-words">{item.name}</span>
              <button type="button" disabled={busy} onClick={() => rename(item)} title={translate('rename')} className="rounded p-2 hover:bg-[var(--shadow-bg-hover)]"><Pencil size={15}/></button>
              <button type="button" disabled={busy} onClick={() => remove(item)} title={translate('delete')} className="rounded p-2 text-[var(--shadow-danger)] hover:bg-[var(--shadow-bg-hover)]"><Trash2 size={15}/></button>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <ReelTagsField tags={tags} draft={tagDraft} onTagsChange={setTags} onDraftChange={setTagDraft} disabled={busy} t={translate}/>
        </div>
        {error ? <p role="alert" className="rounded-lg border border-[var(--shadow-border)] p-3 text-xs text-[var(--shadow-danger)]">{error}</p> : null}
        <div className="flex gap-2">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-[var(--shadow-border)] px-4 py-2 text-xs">{translate('cancel')}</button>
          <button type="button" onClick={save} disabled={busy || loading || assignmentsLoading || !assignmentsReady} className="rounded-lg bg-[var(--shadow-accent)] px-4 py-2 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50">{busy ? translate('saving') : translate('save')}</button>
        </div>
      </div>
    </div>
  )
}
