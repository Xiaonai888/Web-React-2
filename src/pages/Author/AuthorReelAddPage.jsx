import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader, PageShell, SurfaceCard } from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ReelPlaylistSelector from '../../components/author/ReelPlaylistSelector'
import ReelTagsField from '../../components/author/ReelTagsField'
import ReelVideoPreview from '../../components/author/ReelVideoPreview'
import { getReelYouTubeUrls } from '../../utils/reelYouTube'
import {
  listMyReelPlaylists, createReelPlaylist, setReelPlaylistAssignments,
  createReelVideo, updateReelStatus,
} from '../../services/reelPlaylistsApi'

registerTranslationNamespace('authorReelAdd', {
  en: {
    heading: 'Add Reel', subtitle: 'Share a YouTube video on Shadow', back: 'Back to Reels',
    videoLink: 'YouTube video link', videoLinkPlaceholder: 'Paste a YouTube video or Shorts link',
    title: 'Video title', titlePlaceholder: 'Enter a video title', caption: 'Caption (optional)', captionPlaceholder: 'Tell readers about this Reel',
    youtubeOnly: 'YouTube videos only', preview: 'Video preview',
    playlists: 'Playlists', playlistsHelp: 'Organize your Reels into playlists so readers can explore related videos.',
    selectPlaylists: 'Select playlists', selectedCount: '{{count}} playlists', searchPlaylist: 'Search for a playlist',
    newPlaylist: 'New playlist', playlistName: 'Playlist name', create: 'Create', done: 'Done', noPlaylists: 'No playlists yet',
    playlistPreview: 'Playlists have not been saved yet.', morePlaylists: 'Load more playlists',
    playlistLoadFailed: 'Could not load playlists.', playlistCreateFailed: 'Could not create playlist.',
    savedWithoutPlaylists: 'Reel saved, but playlist assignment failed. Retry to finish without creating a duplicate Reel.',
    tags: 'Tags', tagsHelp: 'Add optional tags to help Shadow find interested readers. Reels without tags can still be discovered.',
    tagsPlaceholder: 'Enter a tag and press comma or Enter', tagLimit: 'Up to 10 tags, at most 24 characters each.',
    tagsMaximum: 'You can add up to 10 tags.', tagsLength: 'A tag must be 24 characters or fewer.',
    tagsChars: 'Tags can use up to 500 characters in total.', removeTag: 'Remove {{tag}}', copyTags: 'Copy tags', clearTags: 'Clear all tags',
    saveDraft: 'Save Draft', publish: 'Publish', saving: 'Saving...', invalidLink: 'Enter a valid YouTube or Shorts URL.',
    requiredTitle: 'Enter a video title.', login: 'Please sign in to create a Reel.', saveFailed: 'Unable to save your Reel.',
    saved: 'Reel saved.', noTags: 'Tags are optional.',
  },
  km: {
    heading: 'បន្ថែម Reel', subtitle: 'ចែករំលែកវីដេអូ YouTube លើ Shadow', back: 'ត្រឡប់ទៅ Reel',
    videoLink: 'YouTube Link', videoLinkPlaceholder: 'បិទភ្ជាប់ YouTube ឬ Shorts Link',
    title: 'ចំណងជើងវីដេអូ', titlePlaceholder: 'បញ្ចូលចំណងជើង', caption: 'ពិពណ៌នា (មិនបង្ខំ)', captionPlaceholder: 'ប្រាប់អ្នកអានអំពី Reel នេះ',
    youtubeOnly: 'វីដេអូ YouTube ប៉ុណ្ណោះ', preview: 'មើលវីដេអូជាមុន',
    playlists: 'Playlists', playlistsHelp: 'រៀបចំ Reel ជា Playlist ដើម្បីឱ្យអ្នកអានងាយរកវីដេអូដែលពាក់ព័ន្ធ។',
    selectPlaylists: 'ជ្រើស Playlist', selectedCount: '{{count}} Playlists', searchPlaylist: 'ស្វែងរក Playlist',
    newPlaylist: 'Playlist ថ្មី', playlistName: 'ឈ្មោះ Playlist', create: 'បង្កើត', done: 'រួចរាល់', noPlaylists: 'មិនទាន់មាន Playlist',
    playlistPreview: 'មិនទាន់រក្សាទុក Playlist ទេ។', morePlaylists: 'មើល Playlist បន្ថែម',
    playlistLoadFailed: 'មិនអាចទាញ Playlists បាន។', playlistCreateFailed: 'មិនអាចបង្កើត Playlist បាន។',
    savedWithoutPlaylists: 'Reel បានរក្សាទុកហើយ ប៉ុន្តែការភ្ជាប់ Playlist បរាជ័យ។ ចុចរក្សាទុកម្ដងទៀតដោយមិនបង្កើត Reel ស្ទួន។',
    tags: 'Tags', tagsHelp: 'Tags ជាជម្រើសសម្រាប់ជួយ Shadow រកអ្នកអានដែលមានចំណាប់អារម្មណ៍ស្រដៀងគ្នា។ គ្មាន Tags ក៏អាចបង្ហាញក្នុង Fast បាន។',
    tagsPlaceholder: 'បញ្ចូល Tag ហើយចុច Comma ឬ Enter', tagLimit: 'អាចដាក់បាន ១០ Tags និងមួយ Tag មិនលើស ២៤ តួអក្សរ។',
    tagsMaximum: 'អាចដាក់បានអតិបរមា 10 Tags។', tagsLength: 'Tag មួយមិនត្រូវលើស 24 តួអក្សរ។',
    tagsChars: 'Tags សរុបមិនត្រូវលើស 500 តួអក្សរ។', removeTag: 'លុប {{tag}}', copyTags: 'ចម្លង Tags', clearTags: 'លុប Tags ទាំងអស់',
    saveDraft: 'រក្សាទុក Draft', publish: 'ផ្សាយ', saving: 'កំពុងរក្សាទុក...', invalidLink: 'សូមបញ្ចូល YouTube ឬ Shorts Link ត្រឹមត្រូវ។',
    requiredTitle: 'សូមបញ្ចូលចំណងជើងវីដេអូ។', login: 'សូមចូលគណនីដើម្បីបង្កើត Reel។', saveFailed: 'មិនអាចរក្សាទុក Reel បានទេ។',
    saved: 'បានរក្សាទុក Reel។', noTags: 'Tags មិនបង្ខំទេ។',
  },
  zh: {
    heading: '添加 Reel', subtitle: '在 Shadow 分享 YouTube 视频', back: '返回 Reel', videoLink: 'YouTube 视频链接',
    videoLinkPlaceholder: '粘贴 YouTube 或 Shorts 链接', title: '视频标题', titlePlaceholder: '输入视频标题',
    caption: '简介（选填）', captionPlaceholder: '向读者介绍 Reel', youtubeOnly: '仅限 YouTube 视频', preview: '视频预览',
    playlists: '播放列表', playlistsHelp: '通过播放列表组织 Reel，让读者发现相关视频。', selectPlaylists: '选择播放列表',
    selectedCount: '{{count}} 个播放列表', searchPlaylist: '搜索播放列表', newPlaylist: '新建播放列表', playlistName: '播放列表名称',
    create: '创建', done: '完成', noPlaylists: '暂无播放列表', playlistPreview: '播放列表尚未保存。', morePlaylists: '加载更多播放列表',
    playlistLoadFailed: '无法加载播放列表。', playlistCreateFailed: '无法创建播放列表。', savedWithoutPlaylists: '视频已保存，播放列表分配失败。再次保存不会创建重复视频。',
    tags: '标签', tagsHelp: '可选标签帮助 Shadow 匹配相似兴趣的读者。', tagsPlaceholder: '输入标签，按逗号或回车添加',
    tagLimit: '最多 10 个标签，每个不超过 24 个字符。', tagsMaximum: '最多可添加 10 个标签。', tagsLength: '单个标签最多 24 字符。',
    tagsChars: '标签总计最多 500 字符。', removeTag: '删除 {{tag}}', copyTags: '复制标签', clearTags: '清空标签',
    saveDraft: '保存草稿', publish: '发布', saving: '正在保存...', invalidLink: '请输入有效的 YouTube 链接。',
    requiredTitle: '请输入视频标题。', login: '请先登录。', saveFailed: '无法保存 Reel。', saved: '已保存。', noTags: '标签可选。',
  },
  ja: {
    heading: 'Reelを追加', subtitle: 'YouTube動画をShadowで共有', back: 'Reelに戻る', videoLink: 'YouTube動画リンク',
    videoLinkPlaceholder: 'YouTubeまたはShortsのリンク', title: '動画タイトル', titlePlaceholder: 'タイトルを入力',
    caption: '説明（任意）', captionPlaceholder: 'Reelの説明を入力', youtubeOnly: 'YouTube動画のみ', preview: '動画プレビュー',
    playlists: 'プレイリスト', playlistsHelp: '関連するReelをプレイリストにまとめましょう。', selectPlaylists: 'プレイリストを選択',
    selectedCount: '{{count}}件のプレイリスト', searchPlaylist: 'プレイリストを検索', newPlaylist: '新しいプレイリスト',
    playlistName: 'プレイリスト名', create: '作成', done: '完了', noPlaylists: 'プレイリストはまだありません',
    playlistPreview: 'プレイリストはまだ保存されていません。', morePlaylists: 'プレイリストをもっと見る',
    playlistLoadFailed: 'プレイリストを取得できません。', playlistCreateFailed: 'プレイリストを作成できません。',
    savedWithoutPlaylists: 'Reelを保存しましたが、プレイリストの登録に失敗しました。再試行しても重複作成されません。',
    tags: 'タグ', tagsHelp: '任意のタグで似た興味を持つ読者に届けやすくなります。', tagsPlaceholder: 'タグを入力し、カンマかEnterを押す',
    tagLimit: '最大10件、各24文字まで。', tagsMaximum: '最大10件のタグを追加できます。', tagsLength: 'タグは24文字以内にしてください。',
    tagsChars: 'タグ全体は500文字以内です。', removeTag: '{{tag}} を削除', copyTags: 'タグをコピー', clearTags: 'すべて削除',
    saveDraft: '下書き保存', publish: '公開', saving: '保存中...', invalidLink: '有効なYouTubeリンクを入力してください。',
    requiredTitle: 'タイトルを入力してください。', login: 'ログインしてください。', saveFailed: '保存できませんでした。', saved: '保存しました。', noTags: 'タグは任意です。',
  },
  ko: {
    heading: 'Reel 추가', subtitle: 'YouTube 동영상을 Shadow에서 공유', back: 'Reel로 돌아가기', videoLink: 'YouTube 동영상 링크',
    videoLinkPlaceholder: 'YouTube 또는 Shorts 링크 붙여넣기', title: '동영상 제목', titlePlaceholder: '동영상 제목 입력',
    caption: '설명 (선택)', captionPlaceholder: 'Reel 소개', youtubeOnly: 'YouTube 동영상만', preview: '동영상 미리보기',
    playlists: '재생목록', playlistsHelp: '관련 Reel을 재생목록으로 정리하세요.', selectPlaylists: '재생목록 선택',
    selectedCount: '{{count}}개 재생목록', searchPlaylist: '재생목록 검색', newPlaylist: '새 재생목록',
    playlistName: '재생목록 이름', create: '만들기', done: '완료', noPlaylists: '재생목록이 없습니다',
    playlistPreview: '재생목록은 아직 저장되지 않았습니다.', morePlaylists: '재생목록 더 보기',
    playlistLoadFailed: '재생목록을 불러오지 못했습니다.', playlistCreateFailed: '재생목록을 만들지 못했습니다.',
    savedWithoutPlaylists: 'Reel 저장 완료, 재생목록 지정 실패. 다시 저장해도 중복 생성되지 않습니다.',
    tags: '태그', tagsHelp: '선택 태그로 비슷한 관심사의 독자에게 연결할 수 있습니다.', tagsPlaceholder: '태그를 입력하고 쉼표나 Enter',
    tagLimit: '태그 최대 10개, 각각 24자까지.', tagsMaximum: '태그는 최대 10개입니다.', tagsLength: '태그는 24자 이하여야 합니다.',
    tagsChars: '태그 총 길이는 500자 이하여야 합니다.', removeTag: '{{tag}} 삭제', copyTags: '태그 복사', clearTags: '모두 지우기',
    saveDraft: '임시저장', publish: '게시', saving: '저장 중...', invalidLink: '올바른 YouTube 링크를 입력하세요.',
    requiredTitle: '동영상 제목을 입력하세요.', login: '로그인해 주세요.', saveFailed: 'Reel을 저장할 수 없습니다.', saved: '저장되었습니다.', noTags: '태그는 선택사항입니다.',
  },
})

registerTranslationNamespace('authorReelShape', {
  en: { shape: 'Shape', long: 'Long', short: 'Short', autoEditable: 'Auto by link · tap to change',
    previewOptional: 'Video preview', previewEmpty: 'Paste a YouTube link below to preview',
    durationUnknown: 'Exact duration is unavailable until YouTube metadata is available.',
    internalOnly: 'Only organizes videos inside Shadow Studio.', openYouTube: 'Preview on YouTube' },
  km: { shape: 'ទម្រង់', long: 'Long', short: 'Short', autoEditable: 'Auto តាម Link · ចុចប្ដូរបាន',
    previewOptional: 'Video Preview', previewEmpty: 'បិទភ្ជាប់ YouTube Link ខាងក្រោម ដើម្បីមើល Preview',
    durationUnknown: 'មិនទាន់ទាញបានរយៈពេលពិតពី YouTube ទេ។',
    internalOnly: 'គ្រាន់តែរៀបចំវីដេអូខាងក្នុង Shadow Studio ប៉ុណ្ណោះ។', openYouTube: 'មើលលើ YouTube' },
  zh: { shape: '类型', long: 'Long', short: 'Short', autoEditable: '按链接自动识别 · 可随时修改',
    previewOptional: '视频预览', previewEmpty: '在下方粘贴 YouTube 链接以预览', durationUnknown: '暂无 YouTube 真实时长数据。',
    internalOnly: '仅用于 Shadow Studio 内部分类。', openYouTube: '在 YouTube 中预览' },
  ja: { shape: '形式', long: 'Long', short: 'Short', autoEditable: 'リンクで自動判定・変更可能',
    previewOptional: '動画プレビュー', previewEmpty: '下に YouTube リンクを貼り付けてください', durationUnknown: '正確な再生時間を取得できません。',
    internalOnly: 'Shadow Studio 内の整理にのみ使用します。', openYouTube: 'YouTubeでプレビュー' },
  ko: { shape: '형식', long: 'Long', short: 'Short', autoEditable: '링크 자동 판별 · 변경 가능',
    previewOptional: '동영상 미리보기', previewEmpty: '아래에 YouTube 링크를 붙여넣으세요', durationUnknown: '실제 재생 시간을 가져올 수 없습니다.',
    internalOnly: 'Shadow Studio 내부 정리에만 사용됩니다.', openYouTube: 'YouTube에서 미리보기' },
})

const MAX_TAGS = 10
const MAX_TAG_LENGTH = 24
const MAX_TOTAL_CHARS = 500
const PLAYLIST_PAGE_SIZE = 30

function detectReelTypeFromUrl(link) {
  try {
    const url = new URL(link.trim())
    const youtubeHost = ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname.toLowerCase())
    return youtubeHost && url.pathname.toLowerCase().startsWith('/shorts/') ? 'short' : 'long'
  } catch { return 'long' }
}

export default function AuthorReelAddPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const requestedReturnTo = location.state?.returnTo
  const returnTo = typeof requestedReturnTo === 'string' &&
  (/^\/author\/reel\/studio(?:\/|[?#]|$)/.test(requestedReturnTo) || /^\/author\/page(?:\/|[?#]|$)/.test(requestedReturnTo))
  ? requestedReturnTo : '/author/page'
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState([])
  const [tagDraft, setTagDraft] = useState('')
  const [playlists, setPlaylists] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [playlistPage, setPlaylistPage] = useState(0)
  const [playlistHasMore, setPlaylistHasMore] = useState(false)
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [playlistError, setPlaylistError] = useState('')
  const [pendingVideo, setPendingVideo] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [manualType, setManualType] = useState(null)
  const [durationSeconds, setDurationSeconds] = useState(null)

  const youtube = useMemo(() => getReelYouTubeUrls(link), [link])
  const videoType = youtube ? (manualType || detectReelTypeFromUrl(link)) : null
  const onDurationChange = useCallback(value => setDurationSeconds(value), [])
  const onLinkChange = value => {
    setLink(value)
    setManualType(null)
    setDurationSeconds(null)
  }

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
    return () => clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setPlaylistLoading(true)
    setPlaylistError('')
    if (playlistPage === 0) setPlaylists([])
    listMyReelPlaylists({
      offset: playlistPage * PLAYLIST_PAGE_SIZE, limit: PLAYLIST_PAGE_SIZE,
      search: debouncedSearch, signal: controller.signal,
    }).then(result => {
      if (!active) return
      const rows = result.playlists || []
      setPlaylists(previous => playlistPage === 0 ? rows : [...previous, ...rows.filter(row => !previous.some(item => item.id === row.id))])
      setPlaylistHasMore(Boolean(result.pagination?.has_more))
    }).catch(cause => {
      if (!active || controller.signal.aborted) return
      setPlaylistError(cause.message || t('authorReelAdd.playlistLoadFailed'))
    }).finally(() => { if (active) setPlaylistLoading(false) })
    return () => { active = false; controller.abort() }
  }, [playlistPage, debouncedSearch, t])

  const onPlaylistSearch = value => { setSearchTerm(value); setPlaylistPage(0) }
  const createPlaylist = async name => {
    const result = await createReelPlaylist(name)
    if (!result?.playlist?.id) throw new Error(t('authorReelAdd.playlistCreateFailed'))
    const playlist = result.playlist
    setPlaylists(previous => [playlist, ...previous.filter(item => item.id !== playlist.id)])
    setSelectedIds(previous => previous.includes(playlist.id) ? previous : [...previous, playlist.id])
    return playlist
  }

  const save = async status => {
    if (!youtube) { setError(t('authorReelAdd.invalidLink')); return }
    if (!title.trim()) { setError(t('authorReelAdd.requiredTitle')); return }
    const finalTag = tagDraft.trim()
    const duplicate = tags.some(tag => tag.toLocaleLowerCase() === finalTag.toLocaleLowerCase())
    if (finalTag.includes(',') || finalTag.length > MAX_TAG_LENGTH) { setError(t('authorReelAdd.tagsLength')); return }
    const committedTags = finalTag && !duplicate ? [...tags, finalTag] : tags
    if (committedTags.length > MAX_TAGS) { setError(t('authorReelAdd.tagsMaximum')); return }
    if (committedTags.join(', ').length > MAX_TOTAL_CHARS) { setError(t('authorReelAdd.tagsChars')); return }
    setBusy(true)
    setError('')
    let savedId = pendingVideo?.id || null
    let savedStatus = pendingVideo?.status || null
    try {
      if (!savedId) {
        const response = await createReelVideo({
          video_url: youtube.videoUrl,
          thumbnail_url: youtube.thumbnailUrl,
          title: title.trim(), description: caption.trim(), tags: committedTags,
          access_type: 'free', unlock_price_diamonds: 0, status,
          video_type: videoType,
          ...(Number.isSafeInteger(durationSeconds) && durationSeconds > 0 ? { duration_seconds: durationSeconds } : {}),
        })
        savedId = response.video?.id
        savedStatus = status
        if (!savedId) throw new Error(t('authorReelAdd.saveFailed'))
        setPendingVideo({ id: savedId, status: savedStatus, videoType })
      } else {
        if (pendingVideo.videoType !== videoType) {
          const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
          const base = import.meta.env.VITE_API_URL || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
          const response = await fetch(`${base}/api/shadow-studio/video-type/videos/${encodeURIComponent(savedId)}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ video_type: videoType }),
          })
          const result = await response.json().catch(() => null)
          if (!response.ok || result?.ok !== true) throw new Error(result?.message || t('authorReelAdd.saveFailed'))
        }
        if (savedStatus !== status) {
          await updateReelStatus(savedId, status)
          savedStatus = status
        }
        setPendingVideo({ id: savedId, status: savedStatus, videoType })
      }
      if (selectedIds.length) await setReelPlaylistAssignments(savedId, selectedIds)
      navigate(returnTo, { replace: true, state: { reelSaved: true, activeTab: 'Reel' } })
    } catch (cause) {
      setError(savedId ? `${t('authorReelAdd.savedWithoutPlaylists')} ${cause.message || ''}` : cause.message || t('authorReelAdd.saveFailed'))
    } finally { setBusy(false) }
  }

  const fieldClass = 'app-input mt-1.5 w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-[13px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]'

  return <PageShell className="pb-24 text-[var(--shadow-text-primary)]">
    <PageHeader title={t('authorReelAdd.heading')} subtitle={t('authorReelAdd.subtitle')}
      onBack={() => navigate(returnTo, { replace: true, state: { activeTab: 'Reel' } })} backLabel={t('authorReelAdd.back')} />
    <main className="mx-auto w-full max-w-[760px] space-y-5 px-3 py-5 sm:px-5">
      <ReelVideoPreview
        videoUrl={link} title={title} videoType={videoType} onVideoTypeChange={setManualType}
        onDurationChange={onDurationChange} t={t}
      />
      <SurfaceCard className="space-y-4 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
        <label className="block text-xs font-semibold">{t('authorReelAdd.videoLink')}
          <input type="url" value={link} onChange={event => onLinkChange(event.target.value)} maxLength={1000}
            placeholder={t('authorReelAdd.videoLinkPlaceholder')} className={fieldClass} />
        </label>
        <label className="block text-xs font-semibold">{t('authorReelAdd.title')}
          <input value={title} onChange={event => setTitle(event.target.value)} maxLength={100}
            placeholder={t('authorReelAdd.titlePlaceholder')} className={fieldClass} />
        </label>
        <label className="block text-xs font-semibold">{t('authorReelAdd.caption')}
          <textarea rows={4} value={caption} maxLength={500} onChange={event => setCaption(event.target.value)}
            placeholder={t('authorReelAdd.captionPlaceholder')} className={`${fieldClass} resize-y`} />
        </label>
      </SurfaceCard>
      <SurfaceCard className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
        <ReelPlaylistSelector
          playlists={playlists} selectedIds={selectedIds} onSelectionChange={setSelectedIds}
          onCreatePlaylist={createPlaylist} onSearchChange={onPlaylistSearch} loading={playlistLoading}
          hasMore={playlistHasMore} onLoadMore={() => setPlaylistPage(page => page + 1)}
          loadMoreLabel={t('authorReelAdd.morePlaylists')} disabled={busy} previewOnly={false} t={t}
        />
        {playlistError ? <p role="alert" className="mt-2 text-xs text-[var(--shadow-danger)]">{playlistError}</p> : null}
      </SurfaceCard>
      <SurfaceCard className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
        <ReelTagsField tags={tags} draft={tagDraft} onTagsChange={setTags} onDraftChange={setTagDraft} disabled={busy} t={t} />
      </SurfaceCard>
      {error ? <p role="alert" className="rounded-lg border border-[var(--shadow-border)] p-3 text-xs text-[var(--shadow-danger)]">{error}</p> : null}
      <div className="flex flex-wrap gap-2 pb-4">
        <button type="button" onClick={() => save('draft')} disabled={busy}
          className="min-h-10 rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-5 text-xs font-semibold disabled:opacity-50">
          {busy ? t('authorReelAdd.saving') : t('authorReelAdd.saveDraft')}
        </button>
        <button type="button" onClick={() => save('published')} disabled={busy}
          className="min-h-10 rounded-lg bg-[var(--shadow-accent)] px-5 text-xs font-semibold text-[var(--shadow-accent-text)] disabled:opacity-50">
          {busy ? t('authorReelAdd.saving') : t('authorReelAdd.publish')}
        </button>
      </div>
    </main>
  </PageShell>
}
