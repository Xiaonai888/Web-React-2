import { recordAuthorPostClick } from '../services/authorPostInsightsApi'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getDisplayLanguageId,
  getDisplayText,
  useDisplayTranslation,
} from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import AuthorPostComposerSheet from './AuthorPostComposerSheet'
import CommentsModal from './story-detail/CommentsModal'
import AuthorPostEchoAction from './author-posts/AuthorPostEchoAction'
import ReactionAction from './social/reactions/ReactionAction'
import ReactionSummary from './social/reactions/ReactionSummary'
import { recordAuthorHashtagInterest } from '../services/authorHashtagsApi'

import ReportModal from './ReportModal'
import AuthorPostFilterSheet from './author-posts/AuthorPostFilterSheet'
import AuthorDiscoverPostText from './author-posts/AuthorDiscoverPostText'
import {
  ProfessionalSinglePostImage,
} from './common/ProfessionalPostContent'
import {
  deleteSavedPostBySource,
  fetchSavedPostStatus,
  saveSavedPost,
} from '../services/savedPostsApi'

registerTranslationNamespace('authorPostsSection', {
  en: {
    justNow: 'Just now',
    failedLoadPosts: 'Failed to load posts',
    loginFirst: 'Please login first',
    failedCreatePost: 'Failed to create post',
    failedUpdatePost: 'Failed to update post',
    failedMoveTrash: 'Failed to move post to trash',
    failedUpdatePinned: 'Failed to update pinned post',
    failedUpdateReaction: 'Failed to update reaction',
    failedLoadNotification: 'Failed to load notification preference',
    failedUpdateNotification: 'Failed to update notification preference',
    author: 'Author',
    authorPosts: 'Author Posts',
    filter: 'Filter',
    shareUpdate: 'Share an update...',
    managePosts: 'Manage posts',
    pinned: 'Pinned',
    postOptions: 'Post options',
    seeInsightsAndAds: 'See insights\nand ads',
    boostComingSoon: 'Boost post coming soon.',
    boostPost: 'Boost post',
    commentsCount: '{{count}} comments',
    echoesCount: '{{count}} echoes',
    like: 'Like',
    comment: 'Comment',
    echo: 'Echo',
    authorPost: 'Author Post',
    postLinkCopied: 'Post link copied.',
    closePostOptions: 'Close post options',
    unpinPost: 'Unpin post',
    pinToTop: 'Pin to top',
    removeFromTop: 'Remove this post from the top of your page',
    showFirst: 'Show this post first on your page',
    removeFromSaved: 'Remove from saved',
    savePost: 'Save post',
    removeSavedBody: 'Remove this post from your saved items.',
    savePostBody: 'Add this post to your saved items.',
    editPost: 'Edit post',
    movingToTrash: 'Moving to trash...',
    moveToTrash: 'Move to trash',
    restoreWithin30Days: 'You can restore this post within 30 days.',
    turnOffNotifications: 'Turn off notifications for this post',
    turnOnNotifications: 'Turn on notifications for this post',
    copyLink: 'Copy link',
    hidePost: 'Hide post',
    fewerPosts: 'See fewer posts like this.',
    postHidden: 'Post hidden',
    reportAuthorPost: 'Report Author Post',
    reportBody: 'Tell us if this post violates platform rules.',
    blockAuthor: 'Block author',
    blockBody: 'Stop seeing this author in your experience.',
    blockComingSoon: 'Block author is coming soon.',
    loadingPosts: 'Loading posts...',
    loadingPostsBody: 'Please wait while author posts load.',
    noPosts: 'No posts yet',
    noPostsBody: 'Updates, notes, and announcements will appear here.',
    postUpdated: 'Post updated.',
    removedFromSaved: 'Removed from saved.',
    postSaved: 'Post saved.',
    failedSavePost: 'Failed to save post',
    notificationsOn: 'Post notifications turned on.',
    notificationsOff: 'Post notifications turned off.',
    postMovedTrash: 'Post moved to trash.',
    postPinnedTop: 'Post pinned to top.',
    postRemovedTop: 'Post removed from top.',
    authorPostFallback: 'Author post',
    authorPostComments: 'Author post comments',
  },
  km: {
    justNow: 'ឥឡូវនេះ',
    failedLoadPosts: 'មិនអាចផ្ទុកប្រកាសបានទេ',
    loginFirst: 'សូមចូលគណនីជាមុន',
    failedCreatePost: 'មិនអាចបង្កើតប្រកាសបានទេ',
    failedUpdatePost: 'មិនអាចកែប្រែប្រកាសបានទេ',
    failedMoveTrash: 'មិនអាចផ្លាស់ទីប្រកាសទៅធុងសំរាមបានទេ',
    failedUpdatePinned: 'មិនអាចកែស្ថានភាពខ្ទាស់ប្រកាសបានទេ',
    failedUpdateReaction: 'មិនអាចកែប្រតិកម្មបានទេ',
    failedLoadNotification: 'មិនអាចផ្ទុកការកំណត់ការជូនដំណឹងបានទេ',
    failedUpdateNotification: 'មិនអាចកែការកំណត់ការជូនដំណឹងបានទេ',
    author: 'អ្នកនិពន្ធ',
    authorPosts: 'ប្រកាសអ្នកនិពន្ធ',
    filter: 'តម្រង',
    shareUpdate: 'ចែករំលែកអ្វីថ្មី...',
    managePosts: 'គ្រប់គ្រងប្រកាស',
    pinned: 'បានខ្ទាស់',
    postOptions: 'ជម្រើសប្រកាស',
    seeInsightsAndAds: 'មើលស្ថិតិ\nនិងការផ្សាយពាណិជ្ជកម្ម',
    boostComingSoon: 'មុខងារ Boost post នឹងមកដល់ឆាប់ៗ។',
    boostPost: 'Boost post',
    commentsCount: '{{count}} មតិ',
    echoesCount: '{{count}} Echo',
    like: 'ចូលចិត្ត',
    comment: 'មតិ',
    echo: 'Echo',
    authorPost: 'ប្រកាសអ្នកនិពន្ធ',
    postLinkCopied: 'បានចម្លងតំណប្រកាស។',
    closePostOptions: 'បិទជម្រើសប្រកាស',
    unpinPost: 'ដកខ្ទាស់ប្រកាស',
    pinToTop: 'ខ្ទាស់ទៅលើ',
    removeFromTop: 'ដកប្រកាសនេះចេញពីផ្នែកខាងលើនៃទំព័រ',
    showFirst: 'បង្ហាញប្រកាសនេះមុនគេនៅលើទំព័រ',
    removeFromSaved: 'ដកចេញពីបានរក្សាទុក',
    savePost: 'រក្សាទុកប្រកាស',
    removeSavedBody: 'ដកប្រកាសនេះចេញពីបញ្ជីដែលបានរក្សាទុក។',
    savePostBody: 'បន្ថែមប្រកាសនេះទៅបញ្ជីដែលបានរក្សាទុក។',
    editPost: 'កែប្រកាស',
    movingToTrash: 'កំពុងផ្លាស់ទីទៅធុងសំរាម...',
    moveToTrash: 'ផ្លាស់ទីទៅធុងសំរាម',
    restoreWithin30Days: 'អ្នកអាចស្តារប្រកាសនេះវិញក្នុងរយៈពេល 30 ថ្ងៃ។',
    turnOffNotifications: 'បិទការជូនដំណឹងសម្រាប់ប្រកាសនេះ',
    turnOnNotifications: 'បើកការជូនដំណឹងសម្រាប់ប្រកាសនេះ',
    copyLink: 'ចម្លងតំណ',
    hidePost: 'លាក់ប្រកាស',
    fewerPosts: 'បង្ហាញប្រកាសប្រភេទនេះតិចជាងមុន។',
    postHidden: 'បានលាក់ប្រកាស',
    reportAuthorPost: 'រាយការណ៍ប្រកាសអ្នកនិពន្ធ',
    reportBody: 'ប្រាប់យើង ប្រសិនបើប្រកាសនេះបំពានច្បាប់វេទិកា។',
    blockAuthor: 'ប្លុកអ្នកនិពន្ធ',
    blockBody: 'ឈប់ឃើញអ្នកនិពន្ធនេះក្នុងបទពិសោធន៍របស់អ្នក។',
    blockComingSoon: 'មុខងារប្លុកអ្នកនិពន្ធនឹងមកដល់ឆាប់ៗ។',
    loadingPosts: 'កំពុងផ្ទុកប្រកាស...',
    loadingPostsBody: 'សូមរង់ចាំខណៈពេលកំពុងផ្ទុកប្រកាសអ្នកនិពន្ធ។',
    noPosts: 'មិនទាន់មានប្រកាសទេ',
    noPostsBody: 'បច្ចុប្បន្នភាព កំណត់ចំណាំ និងសេចក្តីជូនដំណឹងនឹងបង្ហាញនៅទីនេះ។',
    postUpdated: 'បានកែប្រែប្រកាស។',
    removedFromSaved: 'បានដកចេញពីបញ្ជីរក្សាទុក។',
    postSaved: 'បានរក្សាទុកប្រកាស។',
    failedSavePost: 'មិនអាចរក្សាទុកប្រកាសបានទេ',
    notificationsOn: 'បានបើកការជូនដំណឹងប្រកាស។',
    notificationsOff: 'បានបិទការជូនដំណឹងប្រកាស។',
    postMovedTrash: 'បានផ្លាស់ទីប្រកាសទៅធុងសំរាម។',
    postPinnedTop: 'បានខ្ទាស់ប្រកាសទៅលើ។',
    postRemovedTop: 'បានដកប្រកាសចេញពីផ្នែកខាងលើ។',
    authorPostFallback: 'ប្រកាសអ្នកនិពន្ធ',
    authorPostComments: 'មតិលើប្រកាសអ្នកនិពន្ធ',
  },
  zh: {
    justNow: '刚刚',
    failedLoadPosts: '无法加载帖子',
    loginFirst: '请先登录',
    failedCreatePost: '无法创建帖子',
    failedUpdatePost: '无法更新帖子',
    failedMoveTrash: '无法将帖子移到回收站',
    failedUpdatePinned: '无法更新置顶状态',
    failedUpdateReaction: '无法更新回应',
    failedLoadNotification: '无法加载通知设置',
    failedUpdateNotification: '无法更新通知设置',
    author: '作者',
    authorPosts: '作者帖子',
    filter: '筛选',
    shareUpdate: '分享最新动态...',
    managePosts: '管理帖子',
    pinned: '已置顶',
    postOptions: '帖子选项',
    seeInsightsAndAds: '查看洞察\n和广告',
    boostComingSoon: '推广帖子功能即将推出。',
    boostPost: '推广帖子',
    commentsCount: '{{count}} 条评论',
    echoesCount: '{{count}} 次 Echo',
    like: '赞',
    comment: '评论',
    echo: 'Echo',
    authorPost: '作者帖子',
    postLinkCopied: '帖子链接已复制。',
    closePostOptions: '关闭帖子选项',
    unpinPost: '取消置顶',
    pinToTop: '置顶帖子',
    removeFromTop: '将此帖子从主页顶部移除',
    showFirst: '在主页最先显示此帖子',
    removeFromSaved: '从收藏中移除',
    savePost: '收藏帖子',
    removeSavedBody: '从你的收藏中移除此帖子。',
    savePostBody: '将此帖子添加到你的收藏。',
    editPost: '编辑帖子',
    movingToTrash: '正在移到回收站...',
    moveToTrash: '移到回收站',
    restoreWithin30Days: '你可以在 30 天内恢复此帖子。',
    turnOffNotifications: '关闭此帖子的通知',
    turnOnNotifications: '开启此帖子的通知',
    copyLink: '复制链接',
    hidePost: '隐藏帖子',
    fewerPosts: '减少显示类似帖子。',
    postHidden: '帖子已隐藏',
    reportAuthorPost: '举报作者帖子',
    reportBody: '如果此帖子违反平台规则，请告诉我们。',
    blockAuthor: '屏蔽作者',
    blockBody: '停止在你的体验中看到这位作者。',
    blockComingSoon: '屏蔽作者功能即将推出。',
    loadingPosts: '正在加载帖子...',
    loadingPostsBody: '正在加载作者帖子，请稍候。',
    noPosts: '暂无帖子',
    noPostsBody: '动态、笔记和公告会显示在这里。',
    postUpdated: '帖子已更新。',
    removedFromSaved: '已从收藏中移除。',
    postSaved: '帖子已收藏。',
    failedSavePost: '无法收藏帖子',
    notificationsOn: '已开启帖子通知。',
    notificationsOff: '已关闭帖子通知。',
    postMovedTrash: '帖子已移到回收站。',
    postPinnedTop: '帖子已置顶。',
    postRemovedTop: '帖子已取消置顶。',
    authorPostFallback: '作者帖子',
    authorPostComments: '作者帖子评论',
  },
  ja: {
    justNow: 'たった今',
    failedLoadPosts: '投稿を読み込めませんでした',
    loginFirst: '先にログインしてください',
    failedCreatePost: '投稿を作成できませんでした',
    failedUpdatePost: '投稿を更新できませんでした',
    failedMoveTrash: '投稿をゴミ箱へ移動できませんでした',
    failedUpdatePinned: '固定状態を更新できませんでした',
    failedUpdateReaction: 'リアクションを更新できませんでした',
    failedLoadNotification: '通知設定を読み込めませんでした',
    failedUpdateNotification: '通知設定を更新できませんでした',
    author: '作者',
    authorPosts: '作者の投稿',
    filter: 'フィルター',
    shareUpdate: '近況をシェア...',
    managePosts: '投稿を管理',
    pinned: '固定済み',
    postOptions: '投稿オプション',
    seeInsightsAndAds: 'インサイトを見る\n広告',
    boostComingSoon: '投稿のブースト機能は近日公開です。',
    boostPost: '投稿をブースト',
    commentsCount: '{{count}} 件のコメント',
    echoesCount: '{{count}} Echo',
    like: 'いいね',
    comment: 'コメント',
    echo: 'Echo',
    authorPost: '作者の投稿',
    postLinkCopied: '投稿リンクをコピーしました。',
    closePostOptions: '投稿オプションを閉じる',
    unpinPost: '固定を解除',
    pinToTop: '上部に固定',
    removeFromTop: 'この投稿をページ上部から外します',
    showFirst: 'この投稿をページの最初に表示します',
    removeFromSaved: '保存済みから削除',
    savePost: '投稿を保存',
    removeSavedBody: '保存済みアイテムからこの投稿を削除します。',
    savePostBody: 'この投稿を保存済みアイテムに追加します。',
    editPost: '投稿を編集',
    movingToTrash: 'ゴミ箱へ移動中...',
    moveToTrash: 'ゴミ箱へ移動',
    restoreWithin30Days: 'この投稿は30日以内に復元できます。',
    turnOffNotifications: 'この投稿の通知をオフ',
    turnOnNotifications: 'この投稿の通知をオン',
    copyLink: 'リンクをコピー',
    hidePost: '投稿を非表示',
    fewerPosts: 'このような投稿の表示を減らします。',
    postHidden: '投稿を非表示にしました',
    reportAuthorPost: '作者の投稿を報告',
    reportBody: 'この投稿がプラットフォーム規約に違反している場合はお知らせください。',
    blockAuthor: '作者をブロック',
    blockBody: 'この作者を表示しないようにします。',
    blockComingSoon: '作者ブロック機能は近日公開です。',
    loadingPosts: '投稿を読み込み中...',
    loadingPostsBody: '作者の投稿を読み込んでいます。',
    noPosts: '投稿はまだありません',
    noPostsBody: '更新、メモ、お知らせがここに表示されます。',
    postUpdated: '投稿を更新しました。',
    removedFromSaved: '保存済みから削除しました。',
    postSaved: '投稿を保存しました。',
    failedSavePost: '投稿を保存できませんでした',
    notificationsOn: '投稿通知をオンにしました。',
    notificationsOff: '投稿通知をオフにしました。',
    postMovedTrash: '投稿をゴミ箱へ移動しました。',
    postPinnedTop: '投稿を上部に固定しました。',
    postRemovedTop: '投稿の固定を解除しました。',
    authorPostFallback: '作者の投稿',
    authorPostComments: '作者投稿のコメント',
  },
  ko: {
    justNow: '방금 전',
    failedLoadPosts: '게시물을 불러오지 못했습니다',
    loginFirst: '먼저 로그인해 주세요',
    failedCreatePost: '게시물을 만들지 못했습니다',
    failedUpdatePost: '게시물을 업데이트하지 못했습니다',
    failedMoveTrash: '게시물을 휴지통으로 옮기지 못했습니다',
    failedUpdatePinned: '고정 상태를 업데이트하지 못했습니다',
    failedUpdateReaction: '반응을 업데이트하지 못했습니다',
    failedLoadNotification: '알림 설정을 불러오지 못했습니다',
    failedUpdateNotification: '알림 설정을 업데이트하지 못했습니다',
    author: '작가',
    authorPosts: '작가 게시물',
    filter: '필터',
    shareUpdate: '새 소식을 공유하세요...',
    managePosts: '게시물 관리',
    pinned: '고정됨',
    postOptions: '게시물 옵션',
    seeInsightsAndAds: '인사이트 보기\n및 광고',
    boostComingSoon: '게시물 홍보 기능이 곧 제공됩니다.',
    boostPost: '게시물 홍보',
    commentsCount: '댓글 {{count}}개',
    echoesCount: 'Echo {{count}}개',
    like: '좋아요',
    comment: '댓글',
    echo: 'Echo',
    authorPost: '작가 게시물',
    postLinkCopied: '게시물 링크를 복사했습니다.',
    closePostOptions: '게시물 옵션 닫기',
    unpinPost: '게시물 고정 해제',
    pinToTop: '상단에 고정',
    removeFromTop: '페이지 상단에서 이 게시물을 제거합니다',
    showFirst: '페이지에서 이 게시물을 먼저 표시합니다',
    removeFromSaved: '저장 목록에서 제거',
    savePost: '게시물 저장',
    removeSavedBody: '저장한 항목에서 이 게시물을 제거합니다.',
    savePostBody: '이 게시물을 저장한 항목에 추가합니다.',
    editPost: '게시물 편집',
    movingToTrash: '휴지통으로 이동 중...',
    moveToTrash: '휴지통으로 이동',
    restoreWithin30Days: '30일 이내에 이 게시물을 복원할 수 있습니다.',
    turnOffNotifications: '이 게시물 알림 끄기',
    turnOnNotifications: '이 게시물 알림 켜기',
    copyLink: '링크 복사',
    hidePost: '게시물 숨기기',
    fewerPosts: '이와 비슷한 게시물을 덜 표시합니다.',
    postHidden: '게시물을 숨겼습니다',
    reportAuthorPost: '작가 게시물 신고',
    reportBody: '이 게시물이 플랫폼 규칙을 위반했다면 알려주세요.',
    blockAuthor: '작가 차단',
    blockBody: '이 작가의 게시물이 더 이상 표시되지 않게 합니다.',
    blockComingSoon: '작가 차단 기능이 곧 제공됩니다.',
    loadingPosts: '게시물을 불러오는 중...',
    loadingPostsBody: '작가 게시물을 불러오는 동안 기다려 주세요.',
    noPosts: '아직 게시물이 없습니다',
    noPostsBody: '업데이트, 메모, 공지가 여기에 표시됩니다.',
    postUpdated: '게시물을 업데이트했습니다.',
    removedFromSaved: '저장 목록에서 제거했습니다.',
    postSaved: '게시물을 저장했습니다.',
    failedSavePost: '게시물을 저장하지 못했습니다',
    notificationsOn: '게시물 알림을 켰습니다.',
    notificationsOff: '게시물 알림을 껐습니다.',
    postMovedTrash: '게시물을 휴지통으로 옮겼습니다.',
    postPinnedTop: '게시물을 상단에 고정했습니다.',
    postRemovedTop: '게시물 고정을 해제했습니다.',
    authorPostFallback: '작가 게시물',
    authorPostComments: '작가 게시물 댓글',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'


function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}
const POST_TOKEN_PATTERN = /(https?:\/\/[^\s]+|#[\p{L}\p{N}\p{M}_]+)/giu
const POST_URL_ONLY_PATTERN = /^https?:\/\/[^\s]+$/i
const POST_HASHTAG_ONLY_PATTERN = /^#[\p{L}\p{N}\p{M}_]+$/u

function renderPostTextWithLinks(text, postId) {
  return String(text || '').split(POST_TOKEN_PATTERN).map((part, index) => {
    if (POST_URL_ONLY_PATTERN.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
  event.stopPropagation()
  void recordAuthorPostClick(postId, part)
}}
          className="break-all text-[#1877f2]"
        >
          {part}
        </a>
      )
    }

    if (POST_HASHTAG_ONLY_PATTERN.test(part)) {
      const tagUrl = `/discover/search?q=${encodeURIComponent(part)}&type=posts`

      return (
        <a
          key={`${part}-${index}`}
          href={tagUrl}
          onClick={(event) => {
            event.stopPropagation()
            void recordAuthorHashtagInterest(
              part,
              'hashtag_click'
            )
          }}
          className="text-[#1877f2]"
        >
          {part}
        </a>
      )
    }

    return part
  })
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`

  return String(number)
}

function formatPostDate(value) {
  if (!value) return getDisplayText('authorPostsSection.justNow')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return getDisplayText('authorPostsSection.justNow')

  const localeMap = {
    km: 'km-KH',
    en: 'en-GB',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
  }

  return date.toLocaleDateString(
    localeMap[getDisplayLanguageId()] || 'en-GB',
    {
    day: '2-digit',
    month: 'short',
      year: 'numeric',
    }
  )
}

function sortAuthorPosts(posts) {
  return [...posts].sort((a, b) => {
    const aPinned = Boolean(a.is_pinned || a.pinned)
    const bPinned = Boolean(b.is_pinned || b.pinned)
    if (aPinned !== bPinned) return Number(bPinned) - Number(aPinned)

    if (aPinned && bPinned) {
      return new Date(b.pinned_at || 0).getTime() - new Date(a.pinned_at || 0).getTime()
    }

    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })
}

async function fetchAuthorPosts(pageUsername, before = '') {
  if (!pageUsername) return []

  const token = getAuthToken()
  const params = new URLSearchParams({ limit: '30' })

  if (before) {
    params.set('before', before)
  }

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/posts?${params.toString()}`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedLoadPosts'))
  }

  return Array.isArray(data.posts) ? data.posts : []
}

async function createAuthorPost(
  content,
  imageUrls = [],
  publishOptions = {}
) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(`${API_BASE_URL}/api/authors/me/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      post_type: 'article',
      content,
      image_urls: Array.isArray(imageUrls) ? imageUrls : [],
      status: publishOptions.status || 'active',
scheduled_at: publishOptions.scheduled_at || null,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedCreatePost'))
  }

  return data.post || null
}

async function updateAuthorPost(postId, content, imageUrls = []) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        image_urls: Array.isArray(imageUrls) ? imageUrls : [],
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedUpdatePost'))
  }

  return data.post || null
}

async function moveAuthorPostToTrash(postId) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(
    `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/trash`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedMoveTrash'))
  }

  return data.post || null
}

async function setAuthorPostPinned(postId, isPinned) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(`${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/pin`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      is_pinned: Boolean(isPinned),
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedUpdatePinned'))
  }

  return data.post || null
}

async function setAuthorPostReaction(postId, reactionType = 'love') {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(`${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(postId)}/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      reaction_type: reactionType,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedUpdateReaction'))
  }

  return data
}

async function fetchAuthorPostNotificationPreference(postId, signal) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/notification-preference`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedLoadNotification'))
  }

  return data.notifications_enabled !== false
}

async function updateAuthorPostNotificationPreference(postId, enabled) {
  const token = getAuthToken()

  if (!token) throw new Error(getDisplayText('authorPostsSection.loginFirst'))

  const response = await fetch(
    `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/notification-preference`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notifications_enabled: Boolean(enabled),
      }),
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || getDisplayText('authorPostsSection.failedUpdateNotification'))
  }

  return data.preference?.notifications_enabled !== false
}

function AuthorPostComposer({ author, onOpenComposer, onOpenFilter, onManagePosts }) {
  const { t } = useDisplayTranslation()
  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || t('authorPostsSection.author')

  return (
    <div className="border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPostsSection.authorPosts')}</h3>

        <button
  type="button"
  onClick={onOpenFilter}
  className="text-[14px] font-medium text-[var(--shadow-text-secondary)] active:opacity-70"
>
  {t('authorPostsSection.filter')}
</button>
      </div>

      <button
        type="button"
        onClick={onOpenComposer}
        className="flex w-full items-center gap-3 py-2 text-left active:bg-[var(--shadow-bg-hover)]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[14px] text-[var(--shadow-text-tertiary)]" />
          )}
        </span>

        <span className="min-w-0 flex-1 truncate text-[15px] font-normal text-[var(--shadow-text-primary)]">
          {t('authorPostsSection.shareUpdate')}
        </span>

       <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#31a84f]" aria-hidden="true">
  <svg
    className="h-[25px] w-[21px]"
    viewBox="0 0 22 26"
    fill="none"
  >
    <rect
      x="2.8"
      y="3.2"
      width="16.4"
      height="19.6"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="7.4" cy="8.7" r="1.55" fill="currentColor" />
    <path
      d="M4.9 18.9l4.2-4.5 3.1 3.3 2.1-2.4 3.2 3.6H4.9z"
      fill="currentColor"
    />
  </svg>
</span>
      </button>

      <button
        type="button"
        onClick={onManagePosts}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--shadow-bg-soft)] text-[14px] font-medium text-[var(--shadow-text-primary)] active:scale-[0.99]"
      >
        <i className="fa-regular fa-rectangle-list text-[15px]" />
        {t('authorPostsSection.managePosts')}
      </button>
    </div>
  )
}

function PostImageGrid({ images, onView }) {
  if (!images.length) return null

    if (images.length === 1) {
    return (
      <ProfessionalSinglePostImage
        src={images[0]}
        alt=""
        onClick={() => onView(images[0])}
        className="mt-3"
      />
    )
  }

  return (
    <div className="mt-3 grid w-full grid-cols-2 gap-1 bg-[var(--shadow-bg-surface)]">
      {images.slice(0, 4).map((imageUrl, index) => (
        <button
          key={`${imageUrl}-${index}`}
          type="button"
          onClick={() => onView(imageUrl)}
          className="relative aspect-square bg-[var(--shadow-bg-soft)]"
        >
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          {index === 3 && images.length > 4 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[22px] font-semibold text-white">
              +{images.length - 4}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  )
}

function AuthorPostCard({ post, author, isOwner, reactionBusyId, onOpenMenu, onReact, onComment, onViewImage, onMessage }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const avatarUrl = author?.avatar_url || ''
  const pageName = author?.page_name || t('authorPostsSection.author')
  const isPinned = Boolean(post.is_pinned || post.pinned)
  const postImages = Array.isArray(post.image_urls) ? post.image_urls : []
  const reactionBusy = reactionBusyId === post.id
  const [echoCount, setEchoCount] = useState(Number(post.echo_count || 0))
  

useEffect(() => {
  setEchoCount(Number(post.echo_count || 0))
}, [post.echo_count, post.id])
  const postText = String(
    post?.content || ''
  )
  

  
  

    const viewRef = useRef(null)

  useEffect(() => {
    const node = viewRef.current
    const postId = post?.id

    if (!node || !postId || isOwner) return undefined

    let viewTimer = null
    let recorded = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (recorded) return

        if (entry?.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (viewTimer) return

          viewTimer = window.setTimeout(() => {
            recorded = true
            viewTimer = null
            observer.disconnect()

            const token = getAuthToken()

            fetch(
              `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(postId)}/views?source=author_page`,
              {
                method: 'POST',
                headers: token
                  ? { Authorization: `Bearer ${token}` }
                  : {},
                keepalive: true,
              }
            ).catch(() => {})
          }, 1000)

          return
        }

        if (viewTimer) {
          window.clearTimeout(viewTimer)
          viewTimer = null
        }
      },
      { threshold: [0, 0.5, 1] }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (viewTimer) window.clearTimeout(viewTimer)
    }
  }, [isOwner, post?.id])

  return (
    <article
      ref={viewRef}
      className="bg-[var(--shadow-bg-surface)] py-3"
    >

      <div className="flex items-start gap-3 px-4">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pageName} className="h-full w-full object-cover" />
          ) : (
            <i className="fa-solid fa-user text-[14px] text-[var(--shadow-text-tertiary)]" />
          )}

          {isPinned ? (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--shadow-bg-surface)] bg-[#22c55e]" />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="line-clamp-1 text-[14px] font-semibold text-[var(--shadow-text-primary)]">
                {pageName}
              </div>

              <div className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
                {isPinned ? (
                  <>
                    <i className="fa-solid fa-thumbtack text-[10px]" />
                    <span>{t('authorPostsSection.pinned')}</span>
                    <span>·</span>
                  </>
                ) : null}

                <span>{formatPostDate(post.created_at)}</span>
                <span>·</span>
                <i className="fa-solid fa-earth-asia text-[10px]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenMenu(post)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] active:bg-[var(--shadow-bg-hover)]"
              aria-label={t('authorPostsSection.postOptions')}
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {post.content ? (
        <div className="mt-2 px-4 pb-3">
          <AuthorDiscoverPostText
  text={postText}
  renderText={(value) =>
  renderPostTextWithLinks(value, post.id)
}
  className="text-[16px] font-normal leading-7 text-[var(--shadow-text-primary)]"
/>
        </div>
      ) : null}


      <PostImageGrid images={postImages} onView={onViewImage} />

{isOwner ? (
  <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-4 py-2">
    <button type="button" onClick={() => navigate(`/author/page/posts/${encodeURIComponent(post.id)}/insights`)} className="shrink-0 text-left active:opacity-60">
      <span className="whitespace-pre-line text-[13px] font-medium leading-5 text-[var(--shadow-text-secondary)]">{t('authorPostsSection.seeInsightsAndAds')}</span>
    </button>
    <button type="button" onClick={() => onMessage?.(t('authorPostsSection.boostComingSoon'))} className="ml-auto flex h-10 flex-1 items-center justify-center rounded-[8px] bg-[var(--shadow-text-primary)] px-4 text-[14px] font-semibold text-[var(--shadow-bg-page)] active:opacity-80">
      {t('authorPostsSection.boostPost')}
    </button>
  </div>
) : null}

<div className="mt-2 px-4 pb-1">
  <div className="flex items-center justify-between pb-2 text-[12px] text-[var(--shadow-text-secondary)]">
    <button
  type="button"
  onClick={() =>
    navigate(`/interactions/author_post/${post.id}/likes`, {
      state: { sourceName: t('authorPostsSection.authorPost') },
    })
  }
  className="flex min-w-0 items-center active:opacity-60"
>
  <ReactionSummary
    summary={post.reaction_summary}
    likeCount={post.like_count}
    myReaction={post.my_reaction}
  />
</button>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onComment(post)}
        className="active:opacity-60"
      >
        {t('authorPostsSection.commentsCount', { count: formatCompactNumber(post.comment_count) })}
      </button>

      <span>
        {t('authorPostsSection.echoesCount', { count: formatCompactNumber(echoCount) })}
      </span>
    </div>
  </div>

  <div className="grid grid-cols-3 items-center py-1.5 text-[14px] font-normal text-[var(--shadow-text-secondary)]">
    <div className="relative flex items-center justify-center py-2">
      <ReactionAction
        reactionType={post.my_reaction}
        count={post.like_count}
        busy={reactionBusy}
        onReact={(reactionType) =>
          onReact(post, reactionType)
        }
        showCount={false}
        idleLabel={t('authorPostsSection.like')}
        className="w-full justify-center"
        buttonClassName="w-full justify-center gap-2 pr-[42px] [&>i]:!text-[20px] [&>img]:!h-[20px] [&>img]:!w-[20px]"
      />
      <span className="pointer-events-none absolute left-1/2 ml-2.5 text-[14px]">
        {t('authorPostsSection.like')}
      </span>
    </div>

    <button
      type="button"
      onClick={() => onComment(post)}
      className="flex w-full items-center justify-center gap-2 py-2 active:bg-[var(--shadow-bg-hover)]"
    >
      <i className="fa-regular fa-comment text-[20px]" />
      <span>{t('authorPostsSection.comment')}</span>
    </button>

    <div className="relative flex items-center justify-center py-2">
      <AuthorPostEchoAction
        post={post}
        author={author}
        onCountChange={(_, total) =>
          setEchoCount(Number(total || 0))
        }
        className="w-full justify-center gap-2 pr-[42px] [&>span]:hidden [&>img]:!h-[20px] [&>img]:!w-[20px]"
      />
      <span className="pointer-events-none absolute left-1/2 ml-2.5 text-[14px]">
        {t('authorPostsSection.echo')}
      </span>
    </div>
  </div>
</div>

    </article>
  )
}

function SheetOption({
  icon,
  title,
  subtext,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[12px] px-2 py-2.5 text-left active:bg-[var(--shadow-bg-hover)] disabled:opacity-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        <i className={`${icon} text-[16px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal text-[var(--shadow-text-primary)]">
          {title}
        </span>

        {subtext ? (
          <span className="mt-0.5 block text-[10px] font-normal leading-4 text-[var(--shadow-text-tertiary)]">
            {subtext}
          </span>
        ) : null}
      </span>
    </button>
  )
}

function PostOptionsSheet({
  post,
  busy,
  saveBusy,
  notificationBusy,
  trashBusy,
  isSaved,
  notificationsEnabled,
  isOwner,
  author,
  onClose,
  onPinChange,
  onSaveToggle,
  onNotificationToggle,
  onMoveToTrash,
  onEdit,
  onReport,
  onMessage,
}) {
  const { t } = useDisplayTranslation()
  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const [sheetOffset, setSheetOffset] =
    useState(0)

  const [dragging, setDragging] =
    useState(false)

  useEffect(() => {
    if (!post) return undefined

    const bodyOverflow =
      document.body.style.overflow

    const htmlOverflow =
      document.documentElement.style
        .overflow

    document.body.style.overflow =
      'hidden'

    document.documentElement.style.overflow =
      'hidden'

    return () => {
      document.body.style.overflow =
        bodyOverflow

      document.documentElement.style.overflow =
        htmlOverflow
    }
  }, [post])

  if (!post) return null

  const isPinned = Boolean(
    post.is_pinned || post.pinned
  )

  function handleTouchStart(event) {
    const point = event.touches?.[0]

    const startY =
      point?.clientY || 0

    startYRef.current = startY
    currentYRef.current = startY

    setDragging(true)
  }

  function handleTouchMove(event) {
    const point = event.touches?.[0]

    const currentY =
      point?.clientY ||
      startYRef.current

    const offset = Math.max(
      0,
      currentY - startYRef.current
    )

    currentYRef.current = currentY

    setSheetOffset(
      Math.min(offset, 240)
    )
  }

  function handleTouchEnd() {
    const distance =
      currentYRef.current -
      startYRef.current

    setDragging(false)

    if (distance > 70) {
      setSheetOffset(0)
      onClose?.()
      return
    }

    setSheetOffset(0)
  }

  async function copyPostLink() {
    const username =
      author?.page_username || ''

    const path = username
      ? `/author/page/${username}?post=${post.id}`
      : `/author/page?post=${post.id}`

    const link =
      `${window.location.origin}${path}`

    try {
      if (
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(
          link
        )

        onMessage?.(
          t('authorPostsSection.postLinkCopied')
        )

        return
      }
    } catch {
      onMessage?.(link)
      return
    }

    onMessage?.(link)
  }

  function handleComingSoon(message) {
    onMessage?.(message)
  }

  return (
    <div className="fixed inset-0 z-[230]">
      <button
        type="button"
        aria-label={t('authorPostsSection.closePostOptions')}
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <section
        className={`absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[560px] rounded-t-[24px] bg-[var(--shadow-bg-elevated)] px-3 pb-[max(18px,env(safe-area-inset-bottom))] pt-2 shadow-2xl ${
          dragging
            ? ''
            : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transform:
            `translateY(${sheetOffset}px)`,
          touchAction: 'none',
        }}
        onTouchStart={
          handleTouchStart
        }
        onTouchMove={
          handleTouchMove
        }
        onTouchEnd={handleTouchEnd}
        onTouchCancel={
          handleTouchEnd
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[var(--shadow-border)]" />

        <div className="space-y-0.5">
          {isOwner ? (
            <>
              <SheetOption
                icon="fa-solid fa-thumbtack"
                title={
                  isPinned
                    ? t('authorPostsSection.unpinPost')
                    : t('authorPostsSection.pinToTop')
                }
                subtext={
                  isPinned
                    ? t('authorPostsSection.removeFromTop')
                    : t('authorPostsSection.showFirst')
                }
                disabled={busy}
                onClick={() =>
                  onPinChange(
                    post,
                    !isPinned
                  )
                }
              />

              <SheetOption
  icon={
    isSaved
      ? 'fa-solid fa-bookmark'
      : 'fa-regular fa-bookmark'
  }
  title={
    isSaved
      ? t('authorPostsSection.removeFromSaved')
      : t('authorPostsSection.savePost')
  }
  subtext={
    isSaved
      ? t('authorPostsSection.removeSavedBody')
      : t('authorPostsSection.savePostBody')
  }
  disabled={saveBusy}
  onClick={() =>
    onSaveToggle?.(post)
  }
/>

              <SheetOption
                icon="fa-solid fa-pen"
                title={t('authorPostsSection.editPost')}
                onClick={() => onEdit?.(post)}
              />

              <SheetOption
                icon="fa-solid fa-trash-can"
                title={
                  trashBusy
                    ? t('authorPostsSection.movingToTrash')
                    : t('authorPostsSection.moveToTrash')
                }
                subtext={t('authorPostsSection.restoreWithin30Days')}
                disabled={trashBusy}
                onClick={() =>
                  onMoveToTrash?.(post)
                }
              />

              <SheetOption
                icon={
                  notificationsEnabled
                    ? 'fa-regular fa-bell-slash'
                    : 'fa-regular fa-bell'
                }
                title={
                  notificationsEnabled
                    ? t('authorPostsSection.turnOffNotifications')
                    : t('authorPostsSection.turnOnNotifications')
                }
                disabled={notificationBusy}
                onClick={() =>
                  onNotificationToggle?.(post)
                }
              />

              <SheetOption
                icon="fa-regular fa-copy"
                title={t('authorPostsSection.copyLink')}
                onClick={copyPostLink}
              />
            </>
          ) : (
            <>
              <SheetOption
  icon={
    isSaved
      ? 'fa-solid fa-bookmark'
      : 'fa-regular fa-bookmark'
  }
  title={
    isSaved
      ? t('authorPostsSection.removeFromSaved')
      : t('authorPostsSection.savePost')
  }
  subtext={
    isSaved
      ? t('authorPostsSection.removeSavedBody')
      : t('authorPostsSection.savePostBody')
  }
  disabled={saveBusy}
  onClick={() =>
    onSaveToggle?.(post)
  }
/>

              <SheetOption
                icon="fa-regular fa-eye-slash"
                title={t('authorPostsSection.hidePost')}
                subtext={t('authorPostsSection.fewerPosts')}
                onClick={() =>
                  handleComingSoon(
                    t('authorPostsSection.postHidden')
                  )
                }
              />

              <SheetOption
                icon="fa-regular fa-flag"
                title={t('authorPostsSection.reportAuthorPost')}
                subtext={t('authorPostsSection.reportBody')}
                onClick={() =>
                  onReport?.(post)
                }
              />

              <SheetOption
                icon="fa-solid fa-user-slash"
                title={t('authorPostsSection.blockAuthor')}
                subtext={t('authorPostsSection.blockBody')}
                onClick={() =>
                  handleComingSoon(
                    t('authorPostsSection.blockComingSoon')
                  )
                }
              />

              <SheetOption
                icon={
                  notificationsEnabled
                    ? 'fa-regular fa-bell-slash'
                    : 'fa-regular fa-bell'
                }
                title={
                  notificationsEnabled
                    ? t('authorPostsSection.turnOffNotifications')
                    : t('authorPostsSection.turnOnNotifications')
                }
                disabled={notificationBusy}
                onClick={() =>
                  onNotificationToggle?.(post)
                }
              />

              <SheetOption
                icon="fa-regular fa-copy"
                title={t('authorPostsSection.copyLink')}
                onClick={copyPostLink}
              />
            </>
          )}
        </div>
      </section>

    </div>
  )
}




      
function PostsEmpty({ title, text }) {
  return (
    <div className="bg-[var(--shadow-bg-surface)] px-5 py-8 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className="fa-regular fa-file-lines text-[16px]" />
      </div>

      <h3 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">{title}</h3>

      <p className="mx-auto mt-1.5 max-w-[300px] text-[12px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
        {text}
      </p>
    </div>
  )
}

export default function AuthorPostsSection({ author, onCountChange, onMessage }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  function openAuthorPhoto(post, imageUrl) {
  if (!post?.id) return

  const images = Array.isArray(post.image_urls)
    ? post.image_urls.filter(Boolean).slice(0, 5)
    : []

  const photoIndex = Math.max(0, images.indexOf(imageUrl))

  navigate(
    `/author/post/${encodeURIComponent(post.id)}?photo=${photoIndex}&source=author_page`,
    { state: { fromAuthorPage: true } }
  )
}
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [localError, setLocalError] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [postFilterDate, setPostFilterDate] = useState('')
  const [editingPost, setEditingPost] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [reportPost, setReportPost] = useState(null)
  const [commentPost, setCommentPost] = useState(null)
  const [pinBusy, setPinBusy] = useState(false)
  const [saveBusy, setSaveBusy] = useState(false)
  const [notificationBusy, setNotificationBusy] = useState(false)
  const [trashBusy, setTrashBusy] = useState(false)
  const [
    selectedPostSaved,
    setSelectedPostSaved,
  ] = useState(false)
  const [
    selectedPostNotificationsEnabled,
    setSelectedPostNotificationsEnabled,
  ] = useState(true)
  const [reactionBusyId, setReactionBusyId] = useState('')

  useEffect(() => {
    if (!localError) return undefined

    const timer = window.setTimeout(() => {
      setLocalError('')
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [localError])

  useEffect(() => {
    if (!selectedPost?.id) {
      setSelectedPostSaved(false)
      return undefined
    }

    const controller =
      new AbortController()

    setSelectedPostSaved(false)

    fetchSavedPostStatus(
      'author_post',
      String(selectedPost.id),
      controller.signal
    )
      .then((data) => {
        setSelectedPostSaved(
          Boolean(data.saved)
        )
      })
      .catch((error) => {
        if (
          error?.name !==
          'AbortError'
        ) {
          setSelectedPostSaved(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [selectedPost?.id])

  useEffect(() => {
    if (!selectedPost?.id) {
      setSelectedPostNotificationsEnabled(true)
      return undefined
    }

    const controller = new AbortController()

    setSelectedPostNotificationsEnabled(true)

    fetchAuthorPostNotificationPreference(
      String(selectedPost.id),
      controller.signal
    )
      .then((enabled) => {
        setSelectedPostNotificationsEnabled(
          Boolean(enabled)
        )
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          setSelectedPostNotificationsEnabled(true)
        }
      })

    return () => {
      controller.abort()
    }
  }, [selectedPost?.id])

  useEffect(() => {
    let ignore = false

    async function loadPosts() {
      if (!author?.page_username) {
        setPosts([])
        onCountChange?.(0)
        return
      }

      try {
        setLoading(true)
        setLocalError('')

        const nextPosts = await fetchAuthorPosts(author.page_username, postFilterDate)

        if (!ignore) {
          const sortedPosts = sortAuthorPosts(nextPosts)
          setPosts(sortedPosts)
          onCountChange?.(sortedPosts.length)
        }
      } catch (error) {
        if (!ignore) {
          setPosts([])
          onCountChange?.(0)
          setLocalError(error.message || t('authorPostsSection.failedLoadPosts'))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPosts()

    return () => {
      ignore = true
    }
  }, [author?.page_username, onCountChange, postFilterDate])

  async function handleCreatePost(
  content,
  imageUrls = [],
  publishOptions = {}
) {
    const nextContent = String(content || '').trim()
    const nextImageUrls = Array.isArray(imageUrls) ? imageUrls : []

    if ((!nextContent && !nextImageUrls.length) || saving) return false

    try {
      setSaving(true)
      setLocalError('')

      const post = await createAuthorPost(
  nextContent,
  nextImageUrls,
  publishOptions
)
      if (post) {
        if (post.status === 'active') {
  setPosts((current) => {
    const nextPosts = sortAuthorPosts([post, ...current])
    onCountChange?.(nextPosts.length)
    return nextPosts
  })
}
        return true
      }

      return false
    } catch (error) {
      const message = error.message || t('authorPostsSection.failedCreatePost')
      setLocalError(message)
      onMessage?.(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdatePost(postId, content, imageUrls = []) {
    const nextContent = String(content || '').trim()
    const nextImageUrls = Array.isArray(imageUrls) ? imageUrls : []

    if (!postId || (!nextContent && !nextImageUrls.length) || saving) {
      return false
    }

    try {
      setSaving(true)
      setLocalError('')

      const updatedPost = await updateAuthorPost(
        postId,
        nextContent,
        nextImageUrls
      )

      if (!updatedPost) return false

      setPosts((current) =>
        sortAuthorPosts(
          current.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  ...updatedPost,
                  my_reaction: item.my_reaction,
                  reaction_summary:
                    Array.isArray(updatedPost.reaction_summary) &&
                    updatedPost.reaction_summary.length
                      ? updatedPost.reaction_summary
                      : item.reaction_summary,
                }
              : item
          )
        )
      )

      onMessage?.(t('authorPostsSection.postUpdated'))
      return true
    } catch (error) {
      const message = error.message || t('authorPostsSection.failedUpdatePost')
      setLocalError(message)
      onMessage?.(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePost(post) {
  if (!post?.id || saveBusy) return

  try {
    setSaveBusy(true)
    setLocalError('')

    if (selectedPostSaved) {
      await deleteSavedPostBySource(
        'author_post',
        String(post.id)
      )

      setSelectedPostSaved(false)
      onMessage?.(
        t('authorPostsSection.removedFromSaved')
      )
      return
    }

    const username =
      author?.page_username || ''

    const sourceUrl = username
      ? `/author/page/${username}?post=${post.id}`
      : `/author/page?post=${post.id}`

    await saveSavedPost({
      source_type: 'author_post',
      source_id: String(post.id),
      source_url: sourceUrl,
      snapshot_data: {
        content: post.content || '',
        page_name:
          author?.page_name ||
          'Author',
        page_username: username,
        avatar_url:
          author?.avatar_url || '',
        image_urls: Array.isArray(
          post.image_urls
        )
          ? post.image_urls
          : [],
      },
      original_created_at:
        post.created_at || null,
    })

    setSelectedPostSaved(true)
    onMessage?.(t('authorPostsSection.postSaved'))
  } catch (error) {
    const message =
      error.message ||
      t('authorPostsSection.failedSavePost')

    setLocalError(message)
    onMessage?.(message)
  } finally {
    setSaveBusy(false)
  }
}

  async function handlePostNotificationToggle(post) {
    if (!post?.id || notificationBusy) return

    const nextEnabled =
      !selectedPostNotificationsEnabled

    try {
      setNotificationBusy(true)
      setLocalError('')

      const enabled =
        await updateAuthorPostNotificationPreference(
          post.id,
          nextEnabled
        )

      setSelectedPostNotificationsEnabled(
        Boolean(enabled)
      )

      onMessage?.(
        enabled
          ? t('authorPostsSection.notificationsOn')
          : t('authorPostsSection.notificationsOff')
      )
    } catch (error) {
      const message =
        error.message ||
        t('authorPostsSection.failedUpdateNotification')

      setLocalError(message)
      onMessage?.(message)
    } finally {
      setNotificationBusy(false)
    }
  }

  async function handleMovePostToTrash(post) {
    if (!post?.id || trashBusy) return

    try {
      setTrashBusy(true)
      setLocalError('')

      await moveAuthorPostToTrash(post.id)

      setPosts((current) => {
        const nextPosts = current.filter(
          (item) => item.id !== post.id
        )

        onCountChange?.(nextPosts.length)
        return nextPosts
      })

      setSelectedPost(null)
      onMessage?.(t('authorPostsSection.postMovedTrash'))
    } catch (error) {
      const message =
        error.message ||
        t('authorPostsSection.failedMoveTrash')

      setLocalError(message)
      onMessage?.(message)
    } finally {
      setTrashBusy(false)
    }
  }

  async function handlePinChange(post, isPinned) {
    if (!post?.id || pinBusy) return

    try {
      setPinBusy(true)
      setLocalError('')

      await setAuthorPostPinned(post.id, isPinned)

      const nextPosts = await fetchAuthorPosts(
        author?.page_username || '',
        postFilterDate
      )
      const sortedPosts = sortAuthorPosts(nextPosts)

      setPosts(sortedPosts)
      onCountChange?.(sortedPosts.length)
      setSelectedPost(null)
      onMessage?.(isPinned ? t('authorPostsSection.postPinnedTop') : t('authorPostsSection.postRemovedTop'))
    } catch (error) {
      const message = error.message || t('authorPostsSection.failedUpdatePinned')
      setLocalError(message)
      onMessage?.(message)
    } finally {
      setPinBusy(false)
    }
  }

 async function handlePostReaction(post, reactionType = 'love') {
  if (!post?.id || reactionBusyId) return

  try {
    setReactionBusyId(post.id)

    const data = await setAuthorPostReaction(post.id, reactionType)

    setPosts((current) => current.map((item) => {
      if (item.id !== post.id) return item

      return {
  ...item,
  like_count: Number(data.like_count || 0),
  my_reaction: data.reacted ? data.reaction_type || reactionType : null,
  reaction_summary: Array.isArray(data.reaction_summary)
    ? data.reaction_summary
    : [],
}
    }))
  } catch (error) {
    const message = error.message || t('authorPostsSection.failedUpdateReaction')
    setLocalError(message)
    onMessage?.(message)
  } finally {
    setReactionBusyId('')
  }
}

function handleAuthorPostCommentChanged(nextComments = []) {
  if (!commentPost?.id) return

  setPosts((current) => current.map((post) => {
    if (post.id !== commentPost.id) return post

    return {
      ...post,
      comment_count: Array.isArray(nextComments) ? nextComments.length : Number(post.comment_count || 0),
    }
  }))
}
  
  async function copyAuthorPostLink(post) {
  const username = author?.page_username || ''
  const path = username ? `/author/page/${username}?post=${post.id}` : `/author/page?post=${post.id}`
  const link = `${window.location.origin}${path}`

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(link)
    onMessage?.(t('authorPostsSection.postLinkCopied'))
    return
  }

  onMessage?.(link)
}



  return (
    <div className="mx-[-16px] overflow-hidden bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)] sm:mx-0">
      {author?.is_owner ? (
        <AuthorPostComposer
          author={author}
          onOpenComposer={() => {
            setEditingPost(null)
            setComposerOpen(true)
          }}
          onOpenFilter={() => setFilterOpen(true)}
          onManagePosts={() => navigate('/author/page/posts')}
        />
      ) : null}

      {localError ? (
        <button
          type="button"
          onClick={() => setLocalError('')}
          className="m-4 w-[calc(100%-2rem)] rounded-[14px] bg-[var(--shadow-bg-elevated)] px-3 py-2 text-left text-[12px] font-medium leading-5 text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]"
        >
          {localError}
        </button>
      ) : null}


      

      {loading ? (
        <PostsEmpty title={t('authorPostsSection.loadingPosts')} text={t('authorPostsSection.loadingPostsBody')} />
      ) : posts.length ? (
        <div className="space-y-2 bg-[var(--shadow-bg-soft)]">
          {posts.map((post) => (
            <AuthorPostCard
              key={post.id}
              post={post}
              author={author}
              isOwner={Boolean(author?.is_owner)}
              reactionBusyId={reactionBusyId}
              onOpenMenu={setSelectedPost}
              onReact={handlePostReaction}     
              onViewImage={(imageUrl) =>
  openAuthorPhoto(post, imageUrl)
}
              onMessage={onMessage}
              onComment={setCommentPost}
            />
          ))}
        </div>
      ) : (
        <PostsEmpty
          title={t('authorPostsSection.noPosts')}
          text={t('authorPostsSection.noPostsBody')}
        />
      )}

      <AuthorPostFilterSheet
  open={filterOpen}
  value={postFilterDate}
  onClose={() => setFilterOpen(false)}
  onApply={setPostFilterDate}
  onClear={() => setPostFilterDate('')}
/>

      <AuthorPostComposerSheet
        open={composerOpen}
        author={author}
        saving={saving}
        editingPost={editingPost}
        onClose={() => {
          setComposerOpen(false)
          setEditingPost(null)
        }}
        onPublishText={handleCreatePost}
        onUpdatePost={handleUpdatePost}
        onMessage={onMessage}
      />


      <PostOptionsSheet
  post={selectedPost}
  busy={pinBusy}
  saveBusy={saveBusy}
  notificationBusy={notificationBusy}
  trashBusy={trashBusy}
  isSaved={selectedPostSaved}
  notificationsEnabled={selectedPostNotificationsEnabled}
  isOwner={Boolean(author?.is_owner)}
        author={author}
        onClose={() => setSelectedPost(null)}
        onPinChange={handlePinChange}
        onSaveToggle={handleSavePost}
        onNotificationToggle={handlePostNotificationToggle}
        onMoveToTrash={handleMovePostToTrash}
        onEdit={(post) => {
          setSelectedPost(null)
          setEditingPost(post)
          setComposerOpen(true)
        }}
        onReport={(post) => {
          setSelectedPost(null)
          setReportPost(post)
        }}
        onMessage={onMessage}
      />

      <ReportModal
        open={Boolean(reportPost)}
        reportType="author_post"
        targetId={reportPost?.id}
        targetTitle={
          reportPost
            ? `${author?.page_name || t('authorPostsSection.author')}: ${String(reportPost.content || t('authorPostsSection.authorPostFallback')).slice(0, 80)}`
            : ''
        }
        onClose={() => setReportPost(null)}
      />

      <CommentsModal
  open={Boolean(commentPost)}
  targetType="author_post"
  targetId={commentPost?.id}
  title={t('authorPostsSection.authorPostComments')}
  story={{
    id: commentPost?.id,
    title: t('authorPostsSection.authorPostComments'),
    user_id: author?.user_id || author?.owner_id || author?.created_by || author?.id,
    author_user_id: author?.user_id || author?.owner_id || author?.created_by || author?.id,
    author_page: {
      user_id: author?.user_id || author?.owner_id || author?.created_by || author?.id,
      page_name: author?.page_name || t('authorPostsSection.author'),
      avatar_url: author?.avatar_url || '',
    },
  }}
  onClose={() => setCommentPost(null)}
  onCommentChanged={handleAuthorPostCommentChanged}
/>
      
    </div>
  )
}
