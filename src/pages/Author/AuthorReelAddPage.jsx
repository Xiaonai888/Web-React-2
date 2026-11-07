import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader, PageShell, SurfaceCard } from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ReelPlaylistSelector from '../../components/author/ReelPlaylistSelector'
import ReelTagsField from '../../components/author/ReelTagsField'
import ReelVideoPreview from '../../components/author/ReelVideoPreview'
import { getReelYouTubeUrls } from '../../utils/reelYouTube'

// This is the Author Page Add Reel experience, NOT Fast Studio's separate Create Video page.
// Playlist selection is intentionally UI preview-only until a dedicated owned playlist API exists.
registerTranslationNamespace('authorReelAdd', {
  en: {
    heading: 'Add Reel', subtitle: 'Share a YouTube video on Shadow', back: 'Back to Reels',
    videoLink: 'YouTube video link', videoLinkPlaceholder: 'Paste a YouTube video or Shorts link',
    title: 'Video title', titlePlaceholder: 'Enter a video title',
    caption: 'Caption (optional)', captionPlaceholder: 'Tell readers about this Reel',
    youtubeOnly: 'YouTube videos only', preview: 'Video preview',
    playlists: 'Playlists', playlistsHelp: 'Organize your Reels into playlists so readers can explore related videos.',
    selectPlaylists: 'Select playlists', selectedCount: '{{count}} playlists',
    searchPlaylist: 'Search for a playlist', newPlaylist: 'New playlist',
    playlistName: 'Playlist name', create: 'Create', done: 'Done',
    noPlaylists: 'No playlists yet', playlistPreview: 'Playlist organization is a UI preview. It is not saved to Shadow yet.',
    playlistConfirm: 'Playlists are not connected to Shadow yet. Publish or save this Reel without playlist assignments?',
    tags: 'Tags', tagsHelp: 'Add optional tags to help Shadow find readers who enjoy similar videos. Reels without tags can still be discovered.',
    tagsPlaceholder: 'Enter a tag and press comma or Enter', tagLimit: 'The current Shadow API supports up to 10 tags, each 24 characters or fewer.',
    tagsMaximum: 'You can add up to 10 tags.', tagsLength: 'A tag must be 24 characters or fewer.',
    tagsChars: 'Tags can use up to 500 characters in total.',
    removeTag: 'Remove {{tag}}', copyTags: 'Copy tags', clearTags: 'Clear all tags',
    saveDraft: 'Save Draft', publish: 'Publish', saving: 'Saving...',
    invalidLink: 'Enter a valid YouTube or YouTube Shorts URL.',
    requiredTitle: 'Enter a video title.', login: 'Please sign in to create a Reel.',
    saveFailed: 'Unable to save your Reel.', saved: 'Reel saved.',
    noTags: 'Tags are optional. You can publish without them.',
  },
  km: {
    heading: 'បន្ថែម Reel', subtitle: 'ចែករំលែកវីដេអូ YouTube លើ Shadow', back: 'ត្រឡប់ទៅ Reel',
    videoLink: 'YouTube Link', videoLinkPlaceholder: 'បិទភ្ជាប់ YouTube ឬ Shorts Link',
    title: 'ចំណងជើងវីដេអូ', titlePlaceholder: 'បញ្ចូលចំណងជើង',
    caption: 'ពិពណ៌នា (មិនបង្ខំ)', captionPlaceholder: 'ប្រាប់អ្នកអានអំពី Reel នេះ',
    youtubeOnly: 'វីដេអូ YouTube ប៉ុណ្ណោះ', preview: 'មើលវីដេអូជាមុន',
    playlists: 'Playlists', playlistsHelp: 'រៀបចំ Reel ជា Playlist ដើម្បីឱ្យអ្នកអានងាយរកវីដេអូដែលពាក់ព័ន្ធ។',
    selectPlaylists: 'ជ្រើស Playlist', selectedCount: '{{count}} Playlists',
    searchPlaylist: 'ស្វែងរក Playlist', newPlaylist: 'Playlist ថ្មី',
    playlistName: 'ឈ្មោះ Playlist', create: 'បង្កើត', done: 'រួចរាល់',
    noPlaylists: 'មិនទាន់មាន Playlist', playlistPreview: 'Playlist គឺជា UI សាកល្បងប៉ុណ្ណោះ។ មិនទាន់រក្សាទុកក្នុង Shadow ទេ។',
    playlistConfirm: 'Playlist មិនទាន់ភ្ជាប់ជាមួយ Shadow ទេ។ តើរក្សាទុក Reel ដោយគ្មាន Playlist មែនទេ?',
    tags: 'Tags', tagsHelp: 'Tags ជាជម្រើសសម្រាប់ជួយ Shadow រកអ្នកអានដែលមានចំណាប់អារម្មណ៍ស្រដៀងគ្នា។ គ្មាន Tags ក៏អាចបង្ហាញក្នុង Fast បាន។',
    tagsPlaceholder: 'បញ្ចូល Tag ហើយចុច Comma ឬ Enter', tagLimit: 'API បច្ចុប្បន្នអនុញ្ញាត 10 Tags និងមួយ Tag មិនលើស 24 តួអក្សរ។',
    tagsMaximum: 'អាចដាក់បានអតិបរមា 10 Tags។', tagsLength: 'Tag មួយមិនត្រូវលើស 24 តួអក្សរ។',
    tagsChars: 'Tags សរុបមិនត្រូវលើស 500 តួអក្សរ។',
    removeTag: 'លុប {{tag}}', copyTags: 'ចម្លង Tags', clearTags: 'លុប Tags ទាំងអស់',
    saveDraft: 'រក្សាទុក Draft', publish: 'ផ្សាយ', saving: 'កំពុងរក្សាទុក...',
    invalidLink: 'សូមបញ្ចូល YouTube ឬ Shorts Link ត្រឹមត្រូវ។',
    requiredTitle: 'សូមបញ្ចូលចំណងជើងវីដេអូ។', login: 'សូមចូលគណនីដើម្បីបង្កើត Reel។',
    saveFailed: 'មិនអាចរក្សាទុក Reel បានទេ។', saved: 'បានរក្សាទុក Reel។',
    noTags: 'Tags មិនបង្ខំទេ។ អ្នកអាចផ្សាយដោយគ្មាន Tags បាន។',
  },
  zh: {
    heading: '添加 Reel', subtitle: '在 Shadow 分享 YouTube 视频', back: '返回 Reel',
    videoLink: 'YouTube 视频链接', videoLinkPlaceholder: '粘贴 YouTube 或 Shorts 链接',
    title: '视频标题', titlePlaceholder: '输入视频标题', caption: '简介（选填）', captionPlaceholder: '向读者介绍 Reel',
    youtubeOnly: '仅限 YouTube 视频', preview: '视频预览',
    playlists: '播放列表', playlistsHelp: '通过播放列表组织 Reel，让读者发现相关视频。',
    selectPlaylists: '选择播放列表', selectedCount: '{{count}} 个播放列表', searchPlaylist: '搜索播放列表',
    newPlaylist: '新建播放列表', playlistName: '播放列表名称', create: '创建', done: '完成', noPlaylists: '暂无播放列表',
    playlistPreview: '播放列表目前只是界面预览，尚未保存到 Shadow。',
    playlistConfirm: '播放列表尚未连接。是否不保存播放列表归属而继续保存 Reel？',
    tags: '标签', tagsHelp: '可选标签帮助 Shadow 匹配相似兴趣的读者。无标签的 Reel 仍可被发现。',
    tagsPlaceholder: '输入标签，按逗号或回车添加', tagLimit: '当前 API 最多支持 10 个标签，每个不超过 24 个字符。',
    tagsMaximum: '最多可添加 10 个标签。', tagsLength: '单个标签最多 24 个字符。', tagsChars: '标签总计最多 500 个字符。',
    removeTag: '删除 {{tag}}', copyTags: '复制标签', clearTags: '清空标签',
    saveDraft: '保存草稿', publish: '发布', saving: '正在保存...', invalidLink: '请输入有效的 YouTube 或 Shorts 链接。',
    requiredTitle: '请输入视频标题。', login: '请先登录。', saveFailed: '无法保存 Reel。', saved: 'Reel 已保存。',
    noTags: '标签是可选项，您可以直接发布。',
  },
  ja: {
    heading: 'Reelを追加', subtitle: 'YouTube動画をShadowで共有', back: 'Reelに戻る',
    videoLink: 'YouTube動画リンク', videoLinkPlaceholder: 'YouTubeまたはShortsのリンク',
    title: '動画タイトル', titlePlaceholder: 'タイトルを入力', caption: '説明（任意）', captionPlaceholder: 'Reelの説明を入力',
    youtubeOnly: 'YouTube動画のみ', preview: '動画プレビュー',
    playlists: 'プレイリスト', playlistsHelp: '関連するReelをプレイリストにまとめましょう。',
    selectPlaylists: 'プレイリストを選択', selectedCount: '{{count}}件のプレイリスト', searchPlaylist: 'プレイリストを検索',
    newPlaylist: '新しいプレイリスト', playlistName: 'プレイリスト名', create: '作成', done: '完了', noPlaylists: 'プレイリストはまだありません',
    playlistPreview: 'プレイリストはUIプレビューのみで、Shadowには保存されません。',
    playlistConfirm: 'プレイリストは未接続です。割り当てを保存せずReelを保存しますか？',
    tags: 'タグ', tagsHelp: '任意のタグで似た興味を持つ読者に届けやすくなります。タグなしでも発見されます。',
    tagsPlaceholder: 'タグを入力し、カンマかEnterで追加', tagLimit: '現在のAPIは最大10件、1件24文字までです。',
    tagsMaximum: '最大10件のタグを追加できます。', tagsLength: 'タグは24文字以内にしてください。', tagsChars: 'タグ全体は500文字以内です。',
    removeTag: '{{tag}} を削除', copyTags: 'タグをコピー', clearTags: 'すべて削除',
    saveDraft: '下書き保存', publish: '公開', saving: '保存中...', invalidLink: '有効なYouTubeリンクを入力してください。',
    requiredTitle: 'タイトルを入力してください。', login: 'ログインしてください。', saveFailed: '保存できませんでした。', saved: '保存しました。',
    noTags: 'タグなしでも公開できます。',
  },
  ko: {
    heading: 'Reel 추가', subtitle: 'YouTube 동영상을 Shadow에서 공유', back: 'Reel로 돌아가기',
    videoLink: 'YouTube 동영상 링크', videoLinkPlaceholder: 'YouTube 또는 Shorts 링크 붙여넣기',
    title: '동영상 제목', titlePlaceholder: '동영상 제목 입력', caption: '설명 (선택)', captionPlaceholder: 'Reel 소개',
    youtubeOnly: 'YouTube 동영상만', preview: '동영상 미리보기',
    playlists: '재생목록', playlistsHelp: '관련 Reel을 재생목록으로 정리하세요.',
    selectPlaylists: '재생목록 선택', selectedCount: '{{count}}개 재생목록', searchPlaylist: '재생목록 검색',
    newPlaylist: '새 재생목록', playlistName: '재생목록 이름', create: '만들기', done: '완료', noPlaylists: '재생목록이 없습니다',
    playlistPreview: '재생목록은 UI 미리보기이며 아직 Shadow에 저장되지 않습니다.',
    playlistConfirm: '재생목록이 아직 연결되지 않았습니다. 지정 없이 Reel을 저장할까요?',
    tags: '태그', tagsHelp: '선택 태그로 비슷한 관심사의 독자에게 연결할 수 있습니다. 태그가 없어도 발견될 수 있습니다.',
    tagsPlaceholder: '태그를 입력하고 쉼표 또는 Enter', tagLimit: '현재 API는 태그 최대 10개, 태그당 24자까지 지원합니다.',
    tagsMaximum: '태그는 최대 10개입니다.', tagsLength: '태그는 24자 이하여야 합니다.', tagsChars: '태그 총 길이는 500자 이하여야 합니다.',
    removeTag: '{{tag}} 삭제', copyTags: '태그 복사', clearTags: '모두 지우기',
    saveDraft: '임시저장', publish: '게시', saving: '저장 중...', invalidLink: '올바른 YouTube 링크를 입력하세요.',
    requiredTitle: '동영상 제목을 입력하세요.', login: '로그인해 주세요.', saveFailed: 'Reel을 저장할 수 없습니다.', saved: '저장되었습니다.',
    noTags: '태그 없이도 게시할 수 있습니다.',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com')
const MAX_TAGS = 10
const MAX_TAG_LENGTH = 24
const MAX_TOTAL_CHARS = 500

const getToken = () => localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''

export default function AuthorReelAddPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = typeof location.state?.returnTo === 'string' && /^\/author\/page(?:\/|$)/.test(location.state.returnTo)
    ? location.state.returnTo : '/author/page'
  const [link, setLink] = useState('')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState([])
  const [tagDraft, setTagDraft] = useState('')
  const [playlists, setPlaylists] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const youtube = useMemo(() => getReelYouTubeUrls(link), [link])
  const videoId = youtube?.id || ''

  // Preview only: DO NOT persist playlist names or imply that they are stored.
  const createPreviewPlaylist = (name) => {
    const normalized = String(name || '').trim()
    if (!normalized) return
    if (playlists.some(item => item.name.toLocaleLowerCase() === normalized.toLocaleLowerCase())) return
    const id = `preview-${Date.now()}-${playlists.length}`
    setPlaylists(items => [...items, { id, name: normalized }])
    setSelectedIds(ids => [...ids, id])
  }

  const save = async (status) => {
    if (!videoId) { setError(t('authorReelAdd.invalidLink')); return }
    if (!title.trim()) { setError(t('authorReelAdd.requiredTitle')); return }
    const token = getToken()
    if (!token) { setError(t('authorReelAdd.login')); return }
    const finalTag = tagDraft.trim()
    const alreadyAdded = tags.some(tag =>
      tag.toLocaleLowerCase() === finalTag.toLocaleLowerCase()
    )
    if (finalTag.includes(',') || (finalTag && finalTag.length > MAX_TAG_LENGTH)) {
      setError(t('authorReelAdd.tagsLength'))
      return
    }
    const committedTags = finalTag && !alreadyAdded ? [...tags, finalTag] : tags
    if (committedTags.length > MAX_TAGS) {
      setError(t('authorReelAdd.tagsMaximum'))
      return
    }
    if (committedTags.join(', ').length > MAX_TOTAL_CHARS) {
      setError(t('authorReelAdd.tagsChars'))
      return
    }
    if (selectedIds.length && !window.confirm(t('authorReelAdd.playlistConfirm'))) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/fast/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: youtube.videoUrl,
          thumbnail_url: youtube.thumbnailUrl,
          title: title.trim(), description: caption.trim(), tags: committedTags,
          access_type: 'free', unlock_price_diamonds: 0, status,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || result.ok === false || !result.video) {
        throw new Error(result.message || t('authorReelAdd.saveFailed'))
      }
      navigate(returnTo, { replace: true, state: { reelSaved: true, activeTab: 'Reel' } })
    } catch (cause) {
      setError(cause.message || t('authorReelAdd.saveFailed'))
    } finally { setBusy(false) }
  }

  const fieldClass = 'app-input mt-1.5 w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-[13px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]'

  return (
    <PageShell className="pb-24 text-[var(--shadow-text-primary)]">
      <PageHeader title={t('authorReelAdd.heading')} subtitle={t('authorReelAdd.subtitle')}
        onBack={() => navigate(returnTo, { state: { activeTab: 'Reel' } })} backLabel={t('authorReelAdd.back')} />
      <main className="mx-auto w-full max-w-[760px] space-y-5 px-3 py-5 sm:px-5">
        <SurfaceCard className="space-y-4 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
          <label className="block text-xs font-semibold">{t('authorReelAdd.videoLink')}
            <input type="url" value={link} onChange={event => setLink(event.target.value)} maxLength={1000}
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
          <ReelVideoPreview videoUrl={link} title={title} t={t} />
        </SurfaceCard>

        <SurfaceCard className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
          <ReelPlaylistSelector
            playlists={playlists}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onCreatePlaylist={createPreviewPlaylist}
            disabled={busy}
            previewOnly
            t={t}
          />
        </SurfaceCard>

        <SurfaceCard className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 sm:p-5">
          <ReelTagsField
            tags={tags}
            draft={tagDraft}
            onTagsChange={setTags}
            onDraftChange={setTagDraft}
            disabled={busy}
            t={t}
          />
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
  )
}
