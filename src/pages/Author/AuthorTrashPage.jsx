import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorTrash', {
  en: {
    unknown: 'Unknown',
    story: 'Story',
    untitledStory: 'Untitled Story',
    novel: 'Novel',
    hidden: 'Hidden',
    deletedDate: 'Deleted {{date}}',
    restoreBefore: 'Restore before {{date}}',
    daysLeft: '{{count}} days left',
    restoring: 'Restoring...',
    restore: 'Restore',
    photoPost: 'Photo post',
    authorPost: 'Author Post',
    episode: 'Episode',
    authorPagePost: 'Author Page post',
    reader: 'Reader',
    reply: 'Reply',
    emptyComment: 'Empty comment',
    byUser: 'By {{name}}',
    recovering: 'Recovering...',
    recover: 'Recover',
    unavailable: 'Unavailable',
    loadStoryTrashFailed: 'Failed to load story trash',
    loadPostTrashFailed: 'Failed to load post trash',
    loadCommentTrashFailed: 'Failed to load comment trash',
    cannotConnect: 'Cannot connect to backend.',
    restoreStoryFailed: 'Failed to restore story',
    storyRestored: 'Story restored successfully.',
    restorePostFailed: 'Failed to restore post',
    postRestored: 'Post restored successfully.',
    recoverCommentFailed: 'Failed to recover comment',
    commentRecovered: 'Comment recovered successfully.',
    back: 'Go back',
    title: 'Trash',
    trashInfo: 'Trash information',
    hint: 'Deleted items are shown here for 30 days. After 30 days, they disappear from your Trash and cannot be restored.',
    stories: 'Stories',
    cancel: 'Cancel',
    episodes: 'Episodes',
    loadEpisodesFailed: 'Failed to load deleted episodes',
    episodeRestored: 'Episode restored to Draft.',
    episodeRestoreFailed: 'Failed to restore episode',
    episodeRestoreQuestion: 'Restore this episode?',
    episodeRestoreHelp: 'This episode will return to Draft. It will NOT be published automatically.',
    episodeEmpty: 'Episode trash is empty',
    episodeEmptyBody: 'Deleted episodes that can still be restored will appear here.',
    episodeGroupCount: '{{count}} deleted episodes',
    goToStories: 'Go to Stories',
    restoreStoryFirst: 'Restore the story first to recover its episodes.',
    loadMoreEpisodes: 'Load more episodes',
    retryEpisodes: 'Try again',
    expandEpisodes: 'Show deleted episodes',
    collapseEpisodes: 'Hide deleted episodes',
    posts: 'Posts',
    comments: 'Comments',
    tabCount: '{{label}} · {{count}}',
    search: 'Search',
    showOldestFirst: 'Show oldest first',
    showNewestFirst: 'Show newest first',
    newestFirst: 'Newest first',
    oldestFirst: 'Oldest first',
    loading: 'Loading trash...',
    canRestore: 'Can Restore',
    storyEmpty: 'Story trash is empty',
    storyEmptyBody: 'Deleted stories that can still be restored will appear here.',
    deletedPosts: 'Deleted Posts',
    postEmpty: 'Post trash is empty',
    postEmptyBody: 'Deleted Author Posts that can still be restored will appear here.',
    deletedComments: 'Deleted Comments',
    commentEmpty: 'Comment trash is empty',
    commentEmptyBody: 'Deleted comments that can still be recovered will appear here.',
  },
  km: {
    unknown: 'មិនស្គាល់',
    story: 'រឿង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    novel: 'ប្រលោមលោក',
    hidden: 'បានលាក់',
    deletedDate: 'បានលុប {{date}}',
    restoreBefore: 'ស្តារមុន {{date}}',
    daysLeft: 'នៅសល់ {{count}} ថ្ងៃ',
    restoring: 'កំពុងស្តារ...',
    restore: 'ស្តារ',
    photoPost: 'Post រូបភាព',
    authorPost: 'Post អ្នកនិពន្ធ',
    episode: 'ភាគ',
    authorPagePost: 'Post ទំព័រអ្នកនិពន្ធ',
    reader: 'អ្នកអាន',
    reply: 'Reply',
    emptyComment: 'មតិយោបល់ទទេ',
    byUser: 'ដោយ {{name}}',
    recovering: 'កំពុងយកមកវិញ...',
    recover: 'យកមកវិញ',
    unavailable: 'មិនអាចប្រើបាន',
    loadStoryTrashFailed: 'មិនអាចផ្ទុកធុងសំរាមរឿងបានទេ',
    loadPostTrashFailed: 'មិនអាចផ្ទុកធុងសំរាម Post បានទេ',
    loadCommentTrashFailed: 'មិនអាចផ្ទុកធុងសំរាមមតិយោបល់បានទេ',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បានទេ។',
    restoreStoryFailed: 'មិនអាចស្តាររឿងបានទេ',
    storyRestored: 'បានស្តាររឿងដោយជោគជ័យ។',
    restorePostFailed: 'មិនអាចស្តារ Post បានទេ',
    postRestored: 'បានស្តារ Post ដោយជោគជ័យ។',
    recoverCommentFailed: 'មិនអាចយកមតិយោបល់មកវិញបានទេ',
    commentRecovered: 'បានយកមតិយោបល់មកវិញដោយជោគជ័យ។',
    back: 'ត្រឡប់ក្រោយ',
    title: 'ធុងសំរាម',
    trashInfo: 'ព័ត៌មានធុងសំរាម',
    hint: 'ធាតុដែលបានលុបនឹងបង្ហាញនៅទីនេះរយៈពេល 30 ថ្ងៃ។ បន្ទាប់ពី 30 ថ្ងៃ វានឹងបាត់ពីធុងសំរាម ហើយមិនអាចស្តារវិញបានទេ។',
    stories: 'រឿង',
    cancel: 'បោះបង់',
    episodes: 'ភាគ',
    loadEpisodesFailed: 'មិនអាចផ្ទុកភាគដែលបានលុបបានទេ',
    episodeRestored: 'បានស្តារភាគទៅ Draft ដោយជោគជ័យ។',
    episodeRestoreFailed: 'មិនអាចស្តារភាគបានទេ',
    episodeRestoreQuestion: 'ស្តារភាគនេះវិញ?',
    episodeRestoreHelp: 'ភាគនេះនឹងត្រឡប់ទៅ Draft ហើយមិនបោះផ្សាយដោយស្វ័យប្រវត្តិទេ។',
    episodeEmpty: 'ធុងសំរាមភាគទទេ',
    episodeEmptyBody: 'ភាគដែលបានលុប និងនៅអាចស្តារវិញបាន នឹងបង្ហាញនៅទីនេះ។',
    episodeGroupCount: 'ភាគបានលុប {{count}}',
    goToStories: 'ទៅកាន់ Stories',
    restoreStoryFirst: 'ត្រូវស្តាររឿងជាមុន ទើបអាចស្តារភាគរបស់វាបាន។',
    loadMoreEpisodes: 'ផ្ទុកភាគបន្ថែម',
    retryEpisodes: 'ព្យាយាមម្តងទៀត',
    expandEpisodes: 'បង្ហាញភាគដែលបានលុប',
    collapseEpisodes: 'លាក់ភាគដែលបានលុប',
    posts: 'Posts',
    comments: 'មតិយោបល់',
    tabCount: '{{label}} · {{count}}',
    search: 'ស្វែងរក',
    showOldestFirst: 'បង្ហាញចាស់បំផុតមុន',
    showNewestFirst: 'បង្ហាញថ្មីបំផុតមុន',
    newestFirst: 'ថ្មីបំផុតមុន',
    oldestFirst: 'ចាស់បំផុតមុន',
    loading: 'កំពុងផ្ទុកធុងសំរាម...',
    canRestore: 'អាចស្តារបាន',
    storyEmpty: 'ធុងសំរាមរឿងទទេ',
    storyEmptyBody: 'រឿងដែលបានលុប ហើយនៅអាចស្តារបាន នឹងបង្ហាញនៅទីនេះ។',
    deletedPosts: 'Posts ដែលបានលុប',
    postEmpty: 'ធុងសំរាម Post ទទេ',
    postEmptyBody: 'Author Posts ដែលបានលុប ហើយនៅអាចស្តារបាន នឹងបង្ហាញនៅទីនេះ។',
    deletedComments: 'មតិយោបល់ដែលបានលុប',
    commentEmpty: 'ធុងសំរាមមតិយោបល់ទទេ',
    commentEmptyBody: 'មតិយោបល់ដែលបានលុប ហើយនៅអាចយកមកវិញបាន នឹងបង្ហាញនៅទីនេះ។',
  },
  zh: {
    unknown: '未知',
    story: '故事',
    untitledStory: '未命名故事',
    novel: '小说',
    hidden: '已隐藏',
    deletedDate: '已删除 {{date}}',
    restoreBefore: '请在 {{date}} 前恢复',
    daysLeft: '剩余 {{count}} 天',
    restoring: '正在恢复...',
    restore: '恢复',
    photoPost: '图片帖子',
    authorPost: '作者帖子',
    episode: '章节',
    authorPagePost: '作者主页帖子',
    reader: '读者',
    reply: '回复',
    emptyComment: '空评论',
    byUser: '来自 {{name}}',
    recovering: '正在恢复...',
    recover: '恢复',
    unavailable: '不可用',
    loadStoryTrashFailed: '无法加载故事回收站',
    loadPostTrashFailed: '无法加载帖子回收站',
    loadCommentTrashFailed: '无法加载评论回收站',
    cannotConnect: '无法连接后端。',
    restoreStoryFailed: '无法恢复故事',
    storyRestored: '故事恢复成功。',
    restorePostFailed: '无法恢复帖子',
    postRestored: '帖子恢复成功。',
    recoverCommentFailed: '无法恢复评论',
    commentRecovered: '评论恢复成功。',
    back: '返回',
    title: '回收站',
    trashInfo: '回收站信息',
    hint: '已删除的内容会在这里保留 30 天。30 天后将从回收站消失，且无法恢复。',
    stories: '故事',
    cancel: '取消',
    episodes: '章节',
    loadEpisodesFailed: '无法加载已删除章节',
    episodeRestored: '章节已恢复为草稿。',
    episodeRestoreFailed: '章节恢复失败',
    episodeRestoreQuestion: '恢复此章节？',
    episodeRestoreHelp: '章节将恢复为草稿，不会自动发布。',
    episodeEmpty: '章节回收站为空',
    episodeEmptyBody: '仍可恢复的已删除章节会显示在这里。',
    episodeGroupCount: '已删除 {{count}} 章',
    goToStories: '前往故事',
    restoreStoryFirst: '请先恢复故事，才能恢复章节。',
    loadMoreEpisodes: '加载更多章节',
    retryEpisodes: '重试',
    expandEpisodes: '显示已删除章节',
    collapseEpisodes: '收起已删除章节',
    posts: '帖子',
    comments: '评论',
    tabCount: '{{label}} · {{count}}',
    search: '搜索',
    showOldestFirst: '先显示最旧',
    showNewestFirst: '先显示最新',
    newestFirst: '最新优先',
    oldestFirst: '最旧优先',
    loading: '正在加载回收站...',
    canRestore: '可恢复',
    storyEmpty: '故事回收站为空',
    storyEmptyBody: '仍可恢复的已删除故事会显示在这里。',
    deletedPosts: '已删除帖子',
    postEmpty: '帖子回收站为空',
    postEmptyBody: '仍可恢复的作者帖子会显示在这里。',
    deletedComments: '已删除评论',
    commentEmpty: '评论回收站为空',
    commentEmptyBody: '仍可恢复的已删除评论会显示在这里。',
  },
  ja: {
    unknown: '不明',
    story: 'ストーリー',
    untitledStory: '無題のストーリー',
    novel: '小説',
    hidden: '非表示',
    deletedDate: '{{date}} に削除',
    restoreBefore: '{{date}} までに復元',
    daysLeft: '残り {{count}} 日',
    restoring: '復元中...',
    restore: '復元',
    photoPost: '写真投稿',
    authorPost: '作者投稿',
    episode: 'エピソード',
    authorPagePost: '作者ページの投稿',
    reader: '読者',
    reply: '返信',
    emptyComment: '空のコメント',
    byUser: '{{name}} より',
    recovering: '復元中...',
    recover: '復元',
    unavailable: '利用不可',
    loadStoryTrashFailed: 'ストーリーのゴミ箱を読み込めませんでした',
    loadPostTrashFailed: '投稿のゴミ箱を読み込めませんでした',
    loadCommentTrashFailed: 'コメントのゴミ箱を読み込めませんでした',
    cannotConnect: 'バックエンドに接続できません。',
    restoreStoryFailed: 'ストーリーを復元できませんでした',
    storyRestored: 'ストーリーを復元しました。',
    restorePostFailed: '投稿を復元できませんでした',
    postRestored: '投稿を復元しました。',
    recoverCommentFailed: 'コメントを復元できませんでした',
    commentRecovered: 'コメントを復元しました。',
    back: '戻る',
    title: 'ゴミ箱',
    trashInfo: 'ゴミ箱情報',
    hint: '削除した項目は30日間ここに表示されます。30日後はゴミ箱から消え、復元できなくなります。',
    stories: 'ストーリー',
    cancel: 'キャンセル',
    episodes: 'エピソード',
    loadEpisodesFailed: '削除されたエピソードを読み込めません',
    episodeRestored: 'エピソードを下書きに復元しました。',
    episodeRestoreFailed: 'エピソードを復元できません',
    episodeRestoreQuestion: 'このエピソードを復元しますか？',
    episodeRestoreHelp: 'エピソードは下書きに戻り、自動公開されません。',
    episodeEmpty: 'エピソードのゴミ箱は空です',
    episodeEmptyBody: '復元可能な削除済みエピソードがここに表示されます。',
    episodeGroupCount: '削除済み {{count}} 件',
    goToStories: 'ストーリーへ',
    restoreStoryFirst: '先にストーリーを復元してください。',
    loadMoreEpisodes: 'さらに読み込む',
    retryEpisodes: '再試行',
    expandEpisodes: '削除済みエピソードを表示',
    collapseEpisodes: '削除済みエピソードを隠す',
    posts: '投稿',
    comments: 'コメント',
    tabCount: '{{label}} · {{count}}',
    search: '検索',
    showOldestFirst: '古い順に表示',
    showNewestFirst: '新しい順に表示',
    newestFirst: '新しい順',
    oldestFirst: '古い順',
    loading: 'ゴミ箱を読み込み中...',
    canRestore: '復元可能',
    storyEmpty: 'ストーリーのゴミ箱は空です',
    storyEmptyBody: 'まだ復元できる削除済みストーリーがここに表示されます。',
    deletedPosts: '削除済み投稿',
    postEmpty: '投稿のゴミ箱は空です',
    postEmptyBody: 'まだ復元できる削除済み作者投稿がここに表示されます。',
    deletedComments: '削除済みコメント',
    commentEmpty: 'コメントのゴミ箱は空です',
    commentEmptyBody: 'まだ復元できる削除済みコメントがここに表示されます。',
  },
  ko: {
    unknown: '알 수 없음',
    story: '스토리',
    untitledStory: '제목 없는 스토리',
    novel: '소설',
    hidden: '숨김',
    deletedDate: '{{date}} 삭제',
    restoreBefore: '{{date}} 전 복원',
    daysLeft: '{{count}}일 남음',
    restoring: '복원 중...',
    restore: '복원',
    photoPost: '사진 게시물',
    authorPost: '작가 게시물',
    episode: '에피소드',
    authorPagePost: '작가 페이지 게시물',
    reader: '독자',
    reply: '답글',
    emptyComment: '빈 댓글',
    byUser: '{{name}} 작성',
    recovering: '복구 중...',
    recover: '복구',
    unavailable: '사용 불가',
    loadStoryTrashFailed: '스토리 휴지통을 불러오지 못했습니다',
    loadPostTrashFailed: '게시물 휴지통을 불러오지 못했습니다',
    loadCommentTrashFailed: '댓글 휴지통을 불러오지 못했습니다',
    cannotConnect: '백엔드에 연결할 수 없습니다.',
    restoreStoryFailed: '스토리를 복원하지 못했습니다',
    storyRestored: '스토리를 복원했습니다.',
    restorePostFailed: '게시물을 복원하지 못했습니다',
    postRestored: '게시물을 복원했습니다.',
    recoverCommentFailed: '댓글을 복구하지 못했습니다',
    commentRecovered: '댓글을 복구했습니다.',
    back: '뒤로',
    title: '휴지통',
    trashInfo: '휴지통 정보',
    hint: '삭제한 항목은 30일 동안 여기에 표시됩니다. 30일 후에는 휴지통에서 사라지고 복원할 수 없습니다.',
    stories: '스토리',
    cancel: '취소',
    episodes: '에피소드',
    loadEpisodesFailed: '삭제된 에피소드를 불러올 수 없습니다',
    episodeRestored: '에피소드를 초안으로 복원했습니다.',
    episodeRestoreFailed: '에피소드를 복원하지 못했습니다',
    episodeRestoreQuestion: '이 에피소드를 복원할까요?',
    episodeRestoreHelp: '에피소드는 초안으로 복원되며 자동 게시되지 않습니다.',
    episodeEmpty: '에피소드 휴지통이 비어 있습니다',
    episodeEmptyBody: '복원 가능한 삭제된 에피소드가 여기에 표시됩니다.',
    episodeGroupCount: '삭제된 에피소드 {{count}}개',
    goToStories: '스토리로 이동',
    restoreStoryFirst: '먼저 스토리를 복원해야 에피소드를 복원할 수 있습니다.',
    loadMoreEpisodes: '에피소드 더 보기',
    retryEpisodes: '다시 시도',
    expandEpisodes: '삭제된 에피소드 보기',
    collapseEpisodes: '삭제된 에피소드 숨기기',
    posts: '게시물',
    comments: '댓글',
    tabCount: '{{label}} · {{count}}',
    search: '검색',
    showOldestFirst: '오래된 항목부터 보기',
    showNewestFirst: '최신 항목부터 보기',
    newestFirst: '최신순',
    oldestFirst: '오래된순',
    loading: '휴지통 불러오는 중...',
    canRestore: '복원 가능',
    storyEmpty: '스토리 휴지통이 비어 있습니다',
    storyEmptyBody: '아직 복원할 수 있는 삭제된 스토리가 여기에 표시됩니다.',
    deletedPosts: '삭제된 게시물',
    postEmpty: '게시물 휴지통이 비어 있습니다',
    postEmptyBody: '아직 복원할 수 있는 삭제된 작가 게시물이 여기에 표시됩니다.',
    deletedComments: '삭제된 댓글',
    commentEmpty: '댓글 휴지통이 비어 있습니다',
    commentEmptyBody: '아직 복구할 수 있는 삭제된 댓글이 여기에 표시됩니다.',
  },
})


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatDate(value) {
  if (!value) return getDisplayText('authorTrash.unknown')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return getDisplayText('authorTrash.unknown')
  }

  return date.toLocaleDateString(getDisplayLanguageId())
}

function getDaysLeft(item) {
  if (Number.isFinite(Number(item?.days_left))) {
    return Math.max(0, Number(item.days_left))
  }

  const expiresAt = item?.delete_expires_at

  if (!expiresAt) return 0

  const date = new Date(expiresAt)

  if (Number.isNaN(date.getTime())) {
    return 0
  }

  return Math.max(
    0,
    Math.ceil(
      (date.getTime() - Date.now()) /
        86400000
    )
  )
}

// GET_AUTHOR_DELETED_EPISODES_UI_V1
// The backend supplies only still-restorable rows. Re-check exact expiry client-side
// and never extend the original 30-day window.
function getEpisodeDaysLeft(episode) {
  const deleted = Date.parse(episode?.deleted_at || '')
  const expires = Date.parse(episode?.delete_expires_at || '')
  if (!Number.isFinite(deleted) || !Number.isFinite(expires)) return 0
  const effectiveExpiry = Math.min(expires, deleted + 30 * 86400000)
  return Math.max(0, Math.ceil((effectiveExpiry - Date.now()) / 86400000))
}

function EmptyCover({ title }) {
  const { t } = useDisplayTranslation()
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--shadow-bg-soft)] px-2 text-center">
      <span className="line-clamp-3 text-[10px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">
        {title || t('authorTrash.story')}
      </span>
    </div>
  )
}

function TrashStoryCard({
  story,
  busy,
  onRestore,
}) {
  const { t } = useDisplayTranslation()
  const daysLeft = getDaysLeft(story)

  return (
    <article className="bg-[var(--shadow-bg-surface)] px-4 py-4">
      <div className="flex gap-3.5">
        <div className="h-[122px] w-[84px] shrink-0 overflow-hidden rounded-[15px] bg-[var(--shadow-bg-soft)]">
          {story.cover_url ? (
            <img
              src={story.cover_url}
              alt={story.title || ''}
              className="h-full w-full object-cover"
            />
          ) : (
            <EmptyCover title={story.title} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[15px] font-semibold text-[var(--shadow-text-primary)]">
                {story.title || t('authorTrash.untitledStory')}
              </h2>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
                  {story.main_genre || t('authorTrash.novel')}
                </span>

                <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
                  {t('authorTrash.hidden')}
                </span>
              </div>
            </div>

          </div>

          <div className="mt-3 space-y-1.5 text-[11.5px] font-normal text-[var(--shadow-text-primary)]">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[12px] text-[var(--shadow-text-primary)]" />
              <span>
                {t('authorTrash.deletedDate', { date: formatDate(story.deleted_at) })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-regular fa-clock text-[12px] text-[var(--shadow-text-primary)]" />
              <span>
                {t('authorTrash.restoreBefore', { date: formatDate(story.delete_expires_at) })}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-[#e11d48]">
              {t('authorTrash.daysLeft', { count: daysLeft })}
            </span>

            <button
              type="button"
              disabled={busy}
              onClick={() => onRestore(story)}
              className="min-w-[88px] rounded-full bg-[var(--shadow-text-primary)] px-5 py-2 text-[12px] font-semibold text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
            >
              {busy ? t('authorTrash.restoring') : t('authorTrash.restore')}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function TrashPostCard({
  post,
  busy,
  onRestore,
}) {
  const { t } = useDisplayTranslation()
  const daysLeft = getDaysLeft(post)
  const images = Array.isArray(
    post.image_urls
  )
    ? post.image_urls
    : []
  const excerpt = String(
    post.content || t('authorTrash.photoPost')
  ).trim()

  return (
    <article className="bg-[var(--shadow-bg-surface)] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
          {images[0] ? (
            <img
              src={images[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <i className="fa-regular fa-note-sticky text-[22px]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[10px] font-medium capitalize text-[var(--shadow-text-secondary)]">
                {post.post_type || 'article'}
              </span>

              <p className="mt-2 line-clamp-2 break-words text-[13px] font-medium leading-5 text-[var(--shadow-text-primary)]">
                {excerpt || t('authorTrash.photoPost')}
              </p>
            </div>

          </div>

          <div className="mt-3 space-y-1.5 text-[11.5px] font-normal text-[var(--shadow-text-primary)]">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[12px] text-[var(--shadow-text-primary)]" />
              <span>
                {t('authorTrash.deletedDate', { date: formatDate(post.deleted_at) })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-regular fa-clock text-[12px] text-[var(--shadow-text-primary)]" />
              <span>
                {t('authorTrash.restoreBefore', { date: formatDate(post.delete_expires_at) })}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-[#e11d48]">
              {t('authorTrash.daysLeft', { count: daysLeft })}
            </span>

            <button
              type="button"
              disabled={busy}
              onClick={() => onRestore(post)}
              className="min-w-[88px] rounded-full bg-[var(--shadow-text-primary)] px-5 py-2 text-[12px] font-semibold text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
            >
              {busy ? t('authorTrash.restoring') : t('authorTrash.restore')}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function getCommentType(item) {
  if (item.content_type === 'author_post') {
    return getDisplayText('authorTrash.authorPost')
  }

  if (item.content_type === 'episode') {
    return getDisplayText('authorTrash.episode')
  }

  return getDisplayText('authorTrash.story')
}

function getCommentTitle(item) {
  if (item.content_type === 'author_post') {
    return (
      item.context?.post_excerpt ||
      getDisplayText('authorTrash.authorPagePost')
    )
  }

  return (
    item.context?.title ||
    getDisplayText('authorTrash.untitledStory')
  )
}

function TrashCommentCard({
  item,
  busy,
  onRestore,
}) {
  const { t } = useDisplayTranslation()
  const daysLeft = getDaysLeft(item)
  const canRestore =
    Boolean(item.can_recover) &&
    daysLeft > 0

  const userName =
    item.user?.name ||
    item.user?.username ||
    t('authorTrash.reader')

  return (
    <article className="bg-[var(--shadow-bg-surface)] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[var(--shadow-text-secondary)]">
          <i className="fa-regular fa-comment-dots text-[17px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
              {getCommentType(item)}
            </span>

            {item.parent_id ? (
              <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--shadow-text-secondary)]">
                {t('authorTrash.reply')}
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 line-clamp-1 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
            {getCommentTitle(item)}
          </h2>

          <p className="mt-2 whitespace-pre-wrap break-words rounded-[15px] bg-[var(--shadow-bg-soft)] px-3 py-2.5 text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            {item.text || t('authorTrash.emptyComment')}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-normal text-[var(--shadow-text-primary)]">
            <span>{t('authorTrash.byUser', { name: userName })}</span>
            <span>
              {t('authorTrash.deletedDate', { date: formatDate(item.deleted_at) })}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold text-[#e11d48]">
              {t('authorTrash.daysLeft', { count: daysLeft })}
            </span>

            <button
              type="button"
              disabled={!canRestore || busy}
              onClick={() => onRestore(item)}
              className="min-w-[88px] rounded-full bg-[var(--shadow-text-primary)] px-5 py-2 text-[12px] font-semibold text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
            >
              {busy
                ? t('authorTrash.recovering')
                : canRestore
                  ? t('authorTrash.recover')
                  : t('authorTrash.unavailable')}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <section className="bg-[var(--shadow-bg-surface)] px-5 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center text-[var(--shadow-text-tertiary)]">
        <i className={`${icon} text-[21px]`} />
      </div>

      <h2 className="mt-3 text-[15px] font-semibold text-[var(--shadow-text-primary)]">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-[320px] text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
        {text}
      </p>
    </section>
  )
}

export default function AuthorTrashPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  const [activeTab, setActiveTab] =
    useState('stories')
  const [stories, setStories] =
    useState([])
  const [episodes, setEpisodes] = useState([])
  const [episodesLoaded, setEpisodesLoaded] = useState(false)
  const episodeLoadingRef = useRef(false)
  const [episodeLoadError, setEpisodeLoadError] = useState(false)
  const [failedEpisodePage, setFailedEpisodePage] = useState(1)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [episodePage, setEpisodePage] = useState(1)
  const [episodeHasMore, setEpisodeHasMore] = useState(false)
  const [expandedStoryId, setExpandedStoryId] = useState('')
  const [restoreEpisode, setRestoreEpisode] = useState(null)
  const [posts, setPosts] =
    useState([])
  const [comments, setComments] =
    useState([])
  const [loadingStories, setLoadingStories] =
    useState(true)
  const [loadingPosts, setLoadingPosts] =
    useState(true)
  const [loadingComments, setLoadingComments] =
    useState(true)
  const [busyId, setBusyId] =
    useState('')
  const [message, setMessage] =
    useState('')
  const [showHint, setShowHint] =
    useState(false)
  const [query, setQuery] =
    useState('')
  const [sortOrder, setSortOrder] =
    useState('newest')

  const visibleStories = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const filtered = stories.filter((story) => {
      if (getDaysLeft(story) <= 0) {
        return false
      }

      if (!keyword) return true

      return String(
        `${story.title || ''} ${story.main_genre || ''}`
      )
        .toLowerCase()
        .includes(keyword)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(
        a.deleted_at || 0
      ).getTime()
      const bTime = new Date(
        b.deleted_at || 0
      ).getTime()

      return sortOrder === 'oldest'
        ? aTime - bTime
        : bTime - aTime
    })
  }, [stories, query, sortOrder])

  const visibleEpisodes = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return episodes
      .filter((episode) => getEpisodeDaysLeft(episode) > 0)
      .filter((episode) => !keyword ||
        `${episode.story_title || ''} ${episode.title || ''} ${episode.episode_number ?? ''}`
          .toLowerCase().includes(keyword))
      .sort((a,b) => {
        const left = Date.parse(a.deleted_at || '') || 0
        const right = Date.parse(b.deleted_at || '') || 0
        return sortOrder === 'oldest' ? left - right : right - left
      })
  }, [episodes, query, sortOrder])

  const episodeGroups = useMemo(() => {
    const grouped = new Map()
    for (const episode of visibleEpisodes) {
      const storyId = String(episode.story_id)
      if (!grouped.has(storyId)) {
        grouped.set(storyId, {
          id: storyId,
          title: episode.story_title || '',
          cover: episode.story_cover_url || '',
          storyDeleted: Boolean(episode.story_deleted),
          episodes: [],
        })
      }
      grouped.get(storyId).episodes.push(episode)
    }
    return Array.from(grouped.values())
  }, [visibleEpisodes])

  const visiblePosts = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const filtered = posts.filter((post) => {
      if (getDaysLeft(post) <= 0) {
        return false
      }

      if (!keyword) return true

      return String(
        `${post.content || ''} ${post.post_type || ''}`
      )
        .toLowerCase()
        .includes(keyword)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(
        a.deleted_at || 0
      ).getTime()
      const bTime = new Date(
        b.deleted_at || 0
      ).getTime()

      return sortOrder === 'oldest'
        ? aTime - bTime
        : bTime - aTime
    })
  }, [posts, query, sortOrder])

  const visibleComments = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    const filtered = comments.filter((item) => {
      if (getDaysLeft(item) <= 0) {
        return false
      }

      if (!keyword) return true

      return String(
        `${item.text || ''} ${getCommentTitle(item)}`
      )
        .toLowerCase()
        .includes(keyword)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(
        a.deleted_at || 0
      ).getTime()
      const bTime = new Date(
        b.deleted_at || 0
      ).getTime()

      return sortOrder === 'oldest'
        ? aTime - bTime
        : bTime - aTime
    })
  }, [comments, query, sortOrder])

  function requireToken() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return ''
    }

    return token
  }

  async function loadStories() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingStories(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/trash`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorTrash.loadStoryTrashFailed')
        )
      }

      setStories(
        Array.isArray(data.stories)
          ? data.stories
          : []
      )
    } catch (error) {
      setStories([])
      setMessage(
        error.message === 'Failed to fetch'
          ? t('authorTrash.cannotConnect')
          : error.message ||
              t('authorTrash.loadStoryTrashFailed')
      )
    } finally {
      setLoadingStories(false)
    }
  }

  async function loadEpisodes(page = 1) {
    if (episodeLoadingRef.current) return
    const token = requireToken()
    if (!token) return
    episodeLoadingRef.current = true
    try {
      setEpisodeLoadError(false)
      setLoadingEpisodes(true)
      const response = await fetch(
        `${API_BASE_URL}/api/stories/trash/episodes?page=${page}&limit=100`,
        { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('authorTrash.loadEpisodesFailed'))
      }
      const batch = Array.isArray(data.episodes) ? data.episodes : []
      setEpisodes((current) => {
        if (page === 1) return batch
        const ids = new Set(current.map((episode) => String(episode.id)))
        return [...current, ...batch.filter((episode) => !ids.has(String(episode.id)))]
      })
      setEpisodePage(page)
      setEpisodeHasMore(data.has_more === true)
      setEpisodesLoaded(true)
    } catch (error) {
      setEpisodeLoadError(true)
      setFailedEpisodePage(page)
      setMessage(error.message === 'Failed to fetch'
        ? t('authorTrash.cannotConnect')
        : error.message || t('authorTrash.loadEpisodesFailed'))
    } finally {
      episodeLoadingRef.current = false
      setLoadingEpisodes(false)
    }
  }

  async function loadPosts() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingPosts(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/posts/trash`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorTrash.loadPostTrashFailed')
        )
      }

      setPosts(
        Array.isArray(data.posts)
          ? data.posts
          : []
      )
    } catch (error) {
      setPosts([])
      setMessage(
        error.message === 'Failed to fetch'
          ? t('authorTrash.cannotConnect')
          : error.message ||
              t('authorTrash.loadPostTrashFailed')
      )
    } finally {
      setLoadingPosts(false)
    }
  }

  async function loadComments() {
    const token = requireToken()

    if (!token) return

    try {
      setLoadingComments(true)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/comment-trash/author?page=1&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorTrash.loadCommentTrashFailed')
        )
      }

      setComments(
        Array.isArray(data.items)
          ? data.items
          : []
      )
    } catch (error) {
      setComments([])
      setMessage(
        error.message === 'Failed to fetch'
          ? t('authorTrash.cannotConnect')
          : error.message ||
              t('authorTrash.loadCommentTrashFailed')
      )
    } finally {
      setLoadingComments(false)
    }
  }

  async function handleRestoreStory(story) {
    const token = requireToken()

    if (!token) return

    try {
      setBusyId(`story:${story.id}`)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${story.id}/restore`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorTrash.restoreStoryFailed')
        )
      }

      setStories((current) =>
        current.filter(
          (item) =>
            item.id !== story.id
        )
      )

      setMessage(
        t('authorTrash.storyRestored')
      )
      if (episodesLoaded) loadEpisodes(1)
    } catch (error) {
      setMessage(
        error.message ||
          t('authorTrash.restoreStoryFailed')
      )
    } finally {
      setBusyId('')
    }
  }

  async function handleRestoreEpisode() {
    if (!restoreEpisode || busyId) return
    const episode = restoreEpisode
    const token = requireToken()
    if (!token) return
    if (episode.story_deleted || !getEpisodeDaysLeft(episode)) {
      setRestoreEpisode(null)
      setMessage(t(episode.story_deleted ? 'authorTrash.restoreStoryFirst' : 'authorTrash.episodeRestoreFailed'))
      return
    }
    try {
      setBusyId(`episode:${episode.id}`)
      setMessage('')
      const response = await fetch(
        `${API_BASE_URL}/api/stories/${encodeURIComponent(episode.story_id)}/episodes/${encodeURIComponent(episode.id)}/restore`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('authorTrash.episodeRestoreFailed'))
      }
      setEpisodes((current) => current.filter((item) => String(item.id) !== String(episode.id)))
      setRestoreEpisode(null)
      setMessage(t('authorTrash.episodeRestored'))
    } catch (error) {
      setRestoreEpisode(null)
      setMessage(error.message || t('authorTrash.episodeRestoreFailed'))
    } finally {
      setBusyId('')
    }
  }

  async function handleRestorePost(post) {
    const token = requireToken()

    if (!token) return

    try {
      setBusyId(`post:${post.id}`)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
          post.id
        )}/restore`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorTrash.restorePostFailed')
        )
      }

      setPosts((current) =>
        current.filter(
          (item) => item.id !== post.id
        )
      )

      setMessage(
        t('authorTrash.postRestored')
      )
    } catch (error) {
      setMessage(
        error.message ||
          t('authorTrash.restorePostFailed')
      )
    } finally {
      setBusyId('')
    }
  }

  async function handleRecoverComment(item) {
    const token = requireToken()

    if (!token) return

    const key =
      `${item.source}:${item.comment_id}`

    try {
      setBusyId(key)
      setMessage('')

      const response = await fetch(
        `${API_BASE_URL}/api/comment-trash/author/${encodeURIComponent(
          item.source
        )}/${encodeURIComponent(
          item.comment_id
        )}/recover`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('authorTrash.recoverCommentFailed')
        )
      }

      setComments((current) =>
        current.filter(
          (comment) =>
            !(
              comment.source ===
                item.source &&
              String(
                comment.comment_id
              ) ===
                String(
                  item.comment_id
                )
            )
        )
      )

      setMessage(
        t('authorTrash.commentRecovered')
      )
    } catch (error) {
      setMessage(
        error.message ||
          t('authorTrash.recoverCommentFailed')
      )
    } finally {
      setBusyId('')
    }
  }

  useEffect(() => {
    loadStories()
    loadPosts()
    loadComments()
  }, [])

  useEffect(() => {
    setQuery('')
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'episodes' && !episodesLoaded && !loadingEpisodes) {
      loadEpisodes(1)
    }
  }, [activeTab, episodesLoaded])

  const loading =
    activeTab === 'stories'
      ? loadingStories
      : activeTab === 'episodes'
        ? loadingEpisodes || (!episodesLoaded && !episodeLoadError)
        : activeTab === 'posts'
          ? loadingPosts
          : loadingComments

  const activeCount =
    activeTab === 'stories'
      ? visibleStories.length
      : activeTab === 'episodes'
        ? visibleEpisodes.length
        : activeTab === 'posts'
          ? visiblePosts.length
          : visibleComments.length

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[110px] text-[var(--shadow-text-primary)]">
      {restoreEpisode ? (
        <div className="fixed inset-0 z-[180] flex items-end justify-center bg-black/45 px-3 pb-3 sm:items-center sm:pb-0">
          <button type="button" disabled={Boolean(busyId)} aria-label={t('authorTrash.cancel')}
            onClick={() => setRestoreEpisode(null)} className="absolute inset-0" />
          <section role="dialog" aria-modal="true" aria-labelledby="restore-episode-title"
            className="relative w-full max-w-[420px] rounded-[18px] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
              <i className="fa-solid fa-rotate-left text-[20px] text-[var(--shadow-text-primary)]" />
            </div>
            <h2 id="restore-episode-title" className="mt-4 text-[17px] font-semibold text-[var(--shadow-text-primary)]">
              {t('authorTrash.episodeRestoreQuestion')}
            </h2>
            <p className="mt-2 text-[12px] font-semibold text-[var(--shadow-text-primary)]">
              EP {restoreEpisode.episode_number}: {restoreEpisode.title || t('authorTrash.episode')}
            </p>
            <p className="mt-2 text-[12px] text-[var(--shadow-text-secondary)]">
              {t('authorTrash.episodeRestoreHelp')}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" disabled={Boolean(busyId)} onClick={() => setRestoreEpisode(null)}
                className="h-11 rounded-[12px] border border-[var(--shadow-border)] text-[12px] text-[var(--shadow-text-primary)] disabled:opacity-60">
                {t('authorTrash.cancel')}
              </button>
              <button type="button" disabled={Boolean(busyId)} onClick={handleRestoreEpisode}
                className="h-11 rounded-[12px] bg-[var(--shadow-text-primary)] text-[12px] text-[var(--shadow-bg-surface)] disabled:opacity-60">
                {busyId ? t('authorTrash.restoring') : t('authorTrash.restore')}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      <header className="border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 pb-3 pt-4">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate('/author/profile')
            }
            className="flex h-10 w-10 items-center justify-start text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('authorTrash.back')}
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">
            {t('authorTrash.title')}
          </h1>

          <button
            type="button"
            onClick={() =>
              setShowHint(
                (current) => !current
              )
            }
            className="flex h-10 w-10 items-center justify-end text-[var(--shadow-text-secondary)] active:scale-95"
            aria-label={t('authorTrash.trashInfo')}
            aria-expanded={showHint}
          >
            <i className="fa-regular fa-circle-question text-[18px]" />
          </button>

          {showHint ? (
            <div className="absolute right-0 top-12 z-20 w-[270px] rounded-[12px] bg-[var(--shadow-bg-elevated)] p-4 text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)] shadow-xl ring-1 ring-[var(--shadow-border)]">
              {t('authorTrash.hint')}
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 pt-4">
        <section className="overflow-hidden rounded-[10px] bg-[var(--shadow-bg-surface)]">
          <div className="grid grid-cols-4 gap-1 px-2 py-3 sm:gap-2 sm:px-3">
            {[
              ['stories', t('authorTrash.stories'), visibleStories.length],
              ['episodes', t('authorTrash.episodes'), visibleEpisodes.length],
              ['posts', t('authorTrash.posts'), visiblePosts.length],
              ['comments', t('authorTrash.comments'), visibleComments.length],
            ].map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setActiveTab(value)
                }
                className={`h-10 min-w-0 rounded-full px-1.5 text-[11px] font-medium transition sm:px-3 sm:text-[12px] ${
                  activeTab === value
                    ? 'bg-[#fff0f2] text-[var(--shadow-text-primary)] dark:bg-[#e11d48]/15'
                    : 'bg-transparent text-[var(--shadow-text-primary)]'
                }`}
              >
                {t('authorTrash.tabCount', { label, count })}
              </button>
            ))}
          </div>

          <div className="h-px bg-[var(--shadow-border)]" />

          <div className="grid grid-cols-[minmax(0,1fr)_52px]">
            <label className="flex h-12 min-w-0 items-center gap-2 px-4">
              <i className="fa-solid fa-magnifying-glass text-[12px] text-[var(--shadow-text-tertiary)]" />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder={t('authorTrash.search')}
                className="min-w-0 flex-1 bg-transparent text-[12px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
              />
            </label>

            <button
              type="button"
              onClick={() =>
                setSortOrder((current) =>
                  current === 'newest'
                    ? 'oldest'
                    : 'newest'
                )
              }
              className="flex h-12 items-center justify-center border-l border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] active:bg-[var(--shadow-bg-hover)]"
              aria-label={
                sortOrder === 'newest'
                  ? t('authorTrash.showOldestFirst')
                  : t('authorTrash.showNewestFirst')
              }
              title={
                sortOrder === 'newest'
                  ? t('authorTrash.newestFirst')
                  : t('authorTrash.oldestFirst')
              }
            >
              <img
                src="/assets/Icons/Revers.svg"
                alt=""
                className={`h-[18px] w-[18px] transition-transform ${
                  sortOrder === 'oldest'
                    ? 'rotate-180'
                    : ''
                }`}
              />
            </button>
          </div>

          {message ? (
            <>
              <div className="h-px bg-[var(--shadow-border)]" />

              <button
                type="button"
                onClick={() =>
                  setMessage('')
                }
                className="w-full bg-[var(--shadow-bg-surface)] px-4 py-3 text-left text-[12px] font-normal leading-5 text-[var(--shadow-text-secondary)]"
              >
                {message}
              </button>
            </>
          ) : null}

          {loading ? (
            <>
              <div className="h-px bg-[var(--shadow-border)]" />

              <section className="bg-[var(--shadow-bg-surface)] p-7 text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--shadow-border)] border-t-[var(--shadow-text-primary)]" />
                <div className="text-[13px] font-medium text-[var(--shadow-text-secondary)]">
                  {t('authorTrash.loading')}
                </div>
              </section>
            </>
          ) : null}

          {!loading &&
          activeTab === 'stories' ? (
            visibleStories.length ? (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />

                <section>
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                      {t('authorTrash.canRestore')}
                    </h2>

                    <span className="text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                      {activeCount}
                    </span>
                  </div>

                  <div className="h-px bg-[var(--shadow-border)]" />

                  <div className="divide-y divide-[var(--shadow-border)]">
                    {visibleStories.map(
                      (story) => (
                        <TrashStoryCard
                          key={story.id}
                          story={story}
                          busy={
                            busyId ===
                            `story:${story.id}`
                          }
                          onRestore={
                            handleRestoreStory
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              </>
            ) : (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />

                <EmptyState
                  icon="fa-regular fa-folder-open"
                  title={t('authorTrash.storyEmpty')}
                  text={t('authorTrash.storyEmptyBody')}
                />
              </>
            )
          ) : null}

          {!loading && activeTab === 'episodes' ? (
            episodeGroups.length ? (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />
                <section>
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                      {t('authorTrash.episodes')}
                    </h2>
                    <span className="text-[11px] text-[var(--shadow-text-secondary)]">{activeCount}</span>
                  </div>
                  <div className="divide-y divide-[var(--shadow-border)]">
                    {episodeGroups.map((group) => (
                      <article key={group.id} className="bg-[var(--shadow-bg-surface)]">
                        <button type="button"
                          aria-expanded={expandedStoryId === group.id}
                          aria-label={expandedStoryId === group.id ? t('authorTrash.collapseEpisodes') : t('authorTrash.expandEpisodes')}
                          onClick={() => setExpandedStoryId((current) => current === group.id ? '' : group.id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left">
                          <div className="h-[77px] w-[55px] shrink-0 overflow-hidden rounded-[9px] bg-[var(--shadow-bg-soft)]">
                            {group.cover ? <img src={group.cover} alt="" className="h-full w-full object-cover" />
                              : <EmptyCover title={group.title} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-[13px] font-semibold text-[var(--shadow-text-primary)]">
                              {group.title || t('authorTrash.untitledStory')}
                            </div>
                            <div className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">
                              {t('authorTrash.episodeGroupCount', { count: group.episodes.length })}
                            </div>
                            {group.storyDeleted ? <div className="mt-1 text-[10px] text-[#e5484d]">{t('authorTrash.restoreStoryFirst')}</div> : null}
                          </div>
                          <i className={`fa-solid fa-chevron-down text-[12px] text-[var(--shadow-text-secondary)] transition-transform ${expandedStoryId === group.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedStoryId === group.id ? (
                          <div className="divide-y divide-[var(--shadow-border)] border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-page)]">
                            {group.episodes.map((episode) => (
                              <div key={episode.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-[12px] font-semibold text-[var(--shadow-text-primary)]">
                                    EP {episode.episode_number}: {episode.title || t('authorTrash.episode')}
                                  </p>
                                  <p className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">
                                    {t('authorTrash.deletedDate', { date: formatDate(episode.deleted_at) })}
                                  </p>
                                  <p className="mt-1 text-[10px] text-[#e5484d]">
                                    {t('authorTrash.daysLeft', { count: getEpisodeDaysLeft(episode) })}
                                  </p>
                                </div>
                                {episode.story_deleted ? (
                                  <button type="button" onClick={() => setActiveTab('stories')}
                                    className="shrink-0 rounded-full border border-[var(--shadow-border)] px-3 py-2 text-[11px] text-[var(--shadow-text-primary)]">
                                    {t('authorTrash.goToStories')}
                                  </button>
                                ) : (
                                  <button type="button" disabled={Boolean(busyId)} onClick={() => setRestoreEpisode(episode)}
                                    className="shrink-0 rounded-full bg-[var(--shadow-text-primary)] px-3 py-2 text-[11px] text-[var(--shadow-bg-surface)] disabled:opacity-50">
                                    {t('authorTrash.restore')}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                  {episodeLoadError ? (
                    <div className="px-4 py-4 text-center">
                      <button type="button" onClick={() => loadEpisodes(failedEpisodePage)}
                        className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-[12px] text-[var(--shadow-text-primary)]">
                        {t('authorTrash.retryEpisodes')}
                      </button>
                    </div>
                  ) : null}
                  {episodeHasMore && !episodeLoadError ? (
                    <div className="px-4 py-4 text-center">
                      <button type="button" disabled={loadingEpisodes} onClick={() => loadEpisodes(episodePage + 1)}
                        className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-[12px] text-[var(--shadow-text-primary)] disabled:opacity-50">
                        {t('authorTrash.loadMoreEpisodes')}
                      </button>
                    </div>
                  ) : null}
                </section>
              </>
            ) : (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />
                {episodeLoadError ? (
                  <div className="bg-[var(--shadow-bg-surface)] px-4 py-8 text-center">
                    <p className="mb-3 text-[12px] text-[var(--shadow-text-secondary)]">{t('authorTrash.loadEpisodesFailed')}</p>
                    <button type="button" onClick={() => loadEpisodes(failedEpisodePage)}
                      className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-[12px] text-[var(--shadow-text-primary)]">
                      {t('authorTrash.retryEpisodes')}
                    </button>
                  </div>
                ) : (
                  <EmptyState icon="fa-regular fa-folder-open"
                    title={t('authorTrash.episodeEmpty')}
                    text={t('authorTrash.episodeEmptyBody')} />
                )}
                {episodeHasMore && !episodeLoadError ? (
                  <div className="px-4 pb-4 text-center">
                    <button type="button" disabled={loadingEpisodes} onClick={() => loadEpisodes(episodePage + 1)}
                      className="rounded-full border border-[var(--shadow-border)] px-5 py-2 text-[12px]">
                      {t('authorTrash.loadMoreEpisodes')}
                    </button>
                  </div>
                ) : null}
              </>
            )
          ) : null}

          {!loading &&
          activeTab === 'posts' ? (
            visiblePosts.length ? (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />

                <section>
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                      {t('authorTrash.deletedPosts')}
                    </h2>

                    <span className="text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                      {activeCount}
                    </span>
                  </div>

                  <div className="h-px bg-[var(--shadow-border)]" />

                  <div className="divide-y divide-[var(--shadow-border)]">
                    {visiblePosts.map(
                      (post) => (
                        <TrashPostCard
                          key={post.id}
                          post={post}
                          busy={
                            busyId ===
                            `post:${post.id}`
                          }
                          onRestore={
                            handleRestorePost
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              </>
            ) : (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />

                <EmptyState
                  icon="fa-regular fa-note-sticky"
                  title={t('authorTrash.postEmpty')}
                  text={t('authorTrash.postEmptyBody')}
                />
              </>
            )
          ) : null}

          {!loading &&
          activeTab === 'comments' ? (
            visibleComments.length ? (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />

                <section>
                  <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                      {t('authorTrash.deletedComments')}
                    </h2>

                    <span className="text-[11px] font-normal text-[var(--shadow-text-secondary)]">
                      {activeCount}
                    </span>
                  </div>

                  <div className="h-px bg-[var(--shadow-border)]" />

                  <div className="divide-y divide-[var(--shadow-border)]">
                    {visibleComments.map(
                      (item) => (
                        <TrashCommentCard
                          key={`${item.source}:${item.comment_id}`}
                          item={item}
                          busy={
                            busyId ===
                            `${item.source}:${item.comment_id}`
                          }
                          onRestore={
                            handleRecoverComment
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              </>
            ) : (
              <>
                <div className="h-px bg-[var(--shadow-border)]" />

                <EmptyState
                  icon="fa-regular fa-comments"
                  title={t('authorTrash.commentEmpty')}
                  text={t('authorTrash.commentEmptyBody')}
                />
              </>
            )
          ) : null}
        </section>
      </main>
    </div>
  )
}
