import { createPortal } from 'react-dom'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import ReportModal from '../ReportModal'
import ReactionAction from '../social/reactions/ReactionAction'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerPostCommentsModal', {
  "en": {
    "hotComments": "Hot comments",
    "hotCommentsDesc": "Show comments with the most likes first.",
    "newest": "Newest",
    "newestDesc": "Show the newest comments first.",
    "allComments": "All comments",
    "allCommentsDesc": "Show all comments.",
    "justNow": "Just now",
    "minutesAgo": "{{count}}m",
    "hoursAgo": "{{count}}h",
    "daysAgo": "{{count}}d",
    "reader": "Reader",
    "reply": "Reply",
    "copy": "Copy",
    "edit": "Edit",
    "delete": "Delete",
    "reportComment": "Report comment",
    "hideComment": "Hide this comment",
    "like": "Like",
    "hideReplies": "Hide replies",
    "viewReplies": "View {{count}} replies",
    "viewReply": "View {{count}} reply",
    "editComment": "Edit comment",
    "saving": "Saving...",
    "saveComment": "Save comment",
    "failedLoadComments": "Failed to load comments",
    "failedLoadCommentsPeriod": "Failed to load comments.",
    "pleaseLoginComment": "Please login to comment.",
    "failedCreateComment": "Failed to create comment",
    "failedCreateCommentPeriod": "Failed to create comment.",
    "pleaseLoginReply": "Please login to reply.",
    "failedCreateReply": "Failed to create reply",
    "failedCreateReplyPeriod": "Failed to create reply.",
    "pleaseLoginReact": "Please login to react.",
    "failedUpdateReaction": "Failed to update reaction",
    "failedUpdateReactionPeriod": "Failed to update reaction.",
    "commentCopied": "Comment copied.",
    "copyFailed": "Copy failed.",
    "pleaseLoginAgain": "Please login again.",
    "failedUpdateComment": "Failed to update comment",
    "commentUpdated": "Comment updated.",
    "failedUpdateCommentPeriod": "Failed to update comment.",
    "failedDeleteComment": "Failed to delete comment",
    "commentDeleted": "Comment deleted.",
    "failedDeleteCommentPeriod": "Failed to delete comment.",
    "commentHiddenDevice": "Comment hidden on your device.",
    "commentsCount": "{{count}} comments",
    "loading": "Loading...",
    "loadMoreComments": "Load more comments",
    "noCommentsYet": "No comments yet",
    "noCommentsDesc": "Start the conversation and share what you think about this post.",
    "writeCommentAction": "Write a comment",
    "replyingTo": "Replying to {{name}}",
    "cancel": "Cancel",
    "commentsOff": "Comments are turned off for this post.",
    "writeReply": "Write a reply...",
    "writeComment": "Write a comment...",
    "sendReply": "Send reply",
    "sendComment": "Send comment",
    "viewMoreReplies": "View more replies",
    "loadingReplies": "Loading replies...",
    "failedLoadRepliesPeriod": "Failed to load replies."
  },
  "km": {
    "hotComments": "មតិយោបល់ពេញនិយម",
    "hotCommentsDesc": "បង្ហាញមតិយោបល់ដែលមានការចូលចិត្តច្រើនជាងគេមុន។",
    "newest": "ថ្មីបំផុត",
    "newestDesc": "បង្ហាញមតិយោបល់ថ្មីបំផុតមុន។",
    "allComments": "មតិយោបល់ទាំងអស់",
    "allCommentsDesc": "បង្ហាញមតិយោបល់ទាំងអស់។",
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}} នាទី",
    "hoursAgo": "{{count}} ម៉ោង",
    "daysAgo": "{{count}} ថ្ងៃ",
    "reader": "អ្នកអាន",
    "reply": "ឆ្លើយតប",
    "copy": "ចម្លង",
    "edit": "កែ",
    "delete": "លុប",
    "reportComment": "រាយការណ៍មតិយោបល់",
    "hideComment": "លាក់មតិយោបល់នេះ",
    "like": "ចូលចិត្ត",
    "hideReplies": "លាក់ការឆ្លើយតប",
    "viewReplies": "មើលការឆ្លើយតប {{count}}",
    "viewReply": "មើលការឆ្លើយតប {{count}}",
    "editComment": "កែមតិយោបល់",
    "saving": "កំពុងរក្សាទុក...",
    "saveComment": "រក្សាទុកមតិយោបល់",
    "failedLoadComments": "មិនអាចផ្ទុកមតិយោបល់បានទេ",
    "failedLoadCommentsPeriod": "មិនអាចផ្ទុកមតិយោបល់បានទេ។",
    "pleaseLoginComment": "សូមចូលគណនីដើម្បីសរសេរមតិយោបល់។",
    "failedCreateComment": "មិនអាចបង្កើតមតិយោបល់បានទេ",
    "failedCreateCommentPeriod": "មិនអាចបង្កើតមតិយោបល់បានទេ។",
    "pleaseLoginReply": "សូមចូលគណនីដើម្បីឆ្លើយតប។",
    "failedCreateReply": "មិនអាចបង្កើតការឆ្លើយតបបានទេ",
    "failedCreateReplyPeriod": "មិនអាចបង្កើតការឆ្លើយតបបានទេ។",
    "pleaseLoginReact": "សូមចូលគណនីដើម្បីប្រតិកម្ម។",
    "failedUpdateReaction": "មិនអាចកែប្រតិកម្មបានទេ",
    "failedUpdateReactionPeriod": "មិនអាចកែប្រតិកម្មបានទេ។",
    "commentCopied": "បានចម្លងមតិយោបល់។",
    "copyFailed": "ចម្លងមិនបានទេ។",
    "pleaseLoginAgain": "សូមចូលគណនីឡើងវិញ។",
    "failedUpdateComment": "មិនអាចកែមតិយោបល់បានទេ",
    "commentUpdated": "បានកែមតិយោបល់។",
    "failedUpdateCommentPeriod": "មិនអាចកែមតិយោបល់បានទេ។",
    "failedDeleteComment": "មិនអាចលុបមតិយោបល់បានទេ",
    "commentDeleted": "បានលុបមតិយោបល់។",
    "failedDeleteCommentPeriod": "មិនអាចលុបមតិយោបល់បានទេ។",
    "commentHiddenDevice": "បានលាក់មតិយោបល់លើឧបករណ៍របស់អ្នក។",
    "commentsCount": "{{count}} មតិយោបល់",
    "loading": "កំពុងផ្ទុក...",
    "loadMoreComments": "ផ្ទុកមតិយោបល់បន្ថែម",
    "noCommentsYet": "មិនទាន់មានមតិយោបល់",
    "noCommentsDesc": "ចាប់ផ្តើមការសន្ទនា និងចែករំលែកអ្វីដែលអ្នកគិតអំពីប្រកាសនេះ។",
    "writeCommentAction": "សរសេរមតិយោបល់",
    "replyingTo": "កំពុងឆ្លើយតបទៅ {{name}}",
    "cancel": "បោះបង់",
    "commentsOff": "មតិយោបល់ត្រូវបានបិទសម្រាប់ប្រកាសនេះ។",
    "writeReply": "សរសេរការឆ្លើយតប...",
    "writeComment": "សរសេរមតិយោបល់...",
    "sendReply": "ផ្ញើការឆ្លើយតប",
    "sendComment": "ផ្ញើមតិយោបល់",
    "viewMoreReplies": "មើលការឆ្លើយតបបន្ថែម",
    "loadingReplies": "កំពុងផ្ទុកការឆ្លើយតប...",
    "failedLoadRepliesPeriod": "មិនអាចផ្ទុកការឆ្លើយតបបានទេ។"
  },
  "zh": {
    "hotComments": "热门评论",
    "hotCommentsDesc": "优先显示点赞最多的评论。",
    "newest": "最新",
    "newestDesc": "优先显示最新评论。",
    "allComments": "全部评论",
    "allCommentsDesc": "显示所有评论。",
    "justNow": "刚刚",
    "minutesAgo": "{{count}}分钟",
    "hoursAgo": "{{count}}小时",
    "daysAgo": "{{count}}天",
    "reader": "读者",
    "reply": "回复",
    "copy": "复制",
    "edit": "编辑",
    "delete": "删除",
    "reportComment": "举报评论",
    "hideComment": "隐藏此评论",
    "like": "赞",
    "hideReplies": "隐藏回复",
    "viewReplies": "查看 {{count}} 条回复",
    "viewReply": "查看 {{count}} 条回复",
    "editComment": "编辑评论",
    "saving": "保存中...",
    "saveComment": "保存评论",
    "failedLoadComments": "无法加载评论",
    "failedLoadCommentsPeriod": "无法加载评论。",
    "pleaseLoginComment": "请先登录再评论。",
    "failedCreateComment": "无法创建评论",
    "failedCreateCommentPeriod": "无法创建评论。",
    "pleaseLoginReply": "请先登录再回复。",
    "failedCreateReply": "无法创建回复",
    "failedCreateReplyPeriod": "无法创建回复。",
    "pleaseLoginReact": "请先登录再进行互动。",
    "failedUpdateReaction": "无法更新互动",
    "failedUpdateReactionPeriod": "无法更新互动。",
    "commentCopied": "评论已复制。",
    "copyFailed": "复制失败。",
    "pleaseLoginAgain": "请重新登录。",
    "failedUpdateComment": "无法更新评论",
    "commentUpdated": "评论已更新。",
    "failedUpdateCommentPeriod": "无法更新评论。",
    "failedDeleteComment": "无法删除评论",
    "commentDeleted": "评论已删除。",
    "failedDeleteCommentPeriod": "无法删除评论。",
    "commentHiddenDevice": "此评论已在你的设备上隐藏。",
    "commentsCount": "{{count}} 条评论",
    "loading": "加载中...",
    "loadMoreComments": "加载更多评论",
    "noCommentsYet": "暂无评论",
    "noCommentsDesc": "开始对话，分享你对这条帖子的看法。",
    "writeCommentAction": "写评论",
    "replyingTo": "回复 {{name}}",
    "cancel": "取消",
    "commentsOff": "此帖已关闭评论。",
    "writeReply": "写回复...",
    "writeComment": "写评论...",
    "sendReply": "发送回复",
    "sendComment": "发送评论",
    "viewMoreReplies": "查看更多回复",
    "loadingReplies": "正在加载回复...",
    "failedLoadRepliesPeriod": "无法加载回复。"
  },
  "ja": {
    "hotComments": "人気のコメント",
    "hotCommentsDesc": "いいねが多いコメントを先に表示します。",
    "newest": "新しい順",
    "newestDesc": "新しいコメントを先に表示します。",
    "allComments": "すべてのコメント",
    "allCommentsDesc": "すべてのコメントを表示します。",
    "justNow": "たった今",
    "minutesAgo": "{{count}}分",
    "hoursAgo": "{{count}}時間",
    "daysAgo": "{{count}}日",
    "reader": "読者",
    "reply": "返信",
    "copy": "コピー",
    "edit": "編集",
    "delete": "削除",
    "reportComment": "コメントを報告",
    "hideComment": "このコメントを非表示",
    "like": "いいね",
    "hideReplies": "返信を隠す",
    "viewReplies": "返信 {{count}}件を表示",
    "viewReply": "返信 {{count}}件を表示",
    "editComment": "コメントを編集",
    "saving": "保存中...",
    "saveComment": "コメントを保存",
    "failedLoadComments": "コメントを読み込めませんでした",
    "failedLoadCommentsPeriod": "コメントを読み込めませんでした。",
    "pleaseLoginComment": "コメントするにはログインしてください。",
    "failedCreateComment": "コメントを作成できませんでした",
    "failedCreateCommentPeriod": "コメントを作成できませんでした。",
    "pleaseLoginReply": "返信するにはログインしてください。",
    "failedCreateReply": "返信を作成できませんでした",
    "failedCreateReplyPeriod": "返信を作成できませんでした。",
    "pleaseLoginReact": "リアクションするにはログインしてください。",
    "failedUpdateReaction": "リアクションを更新できませんでした",
    "failedUpdateReactionPeriod": "リアクションを更新できませんでした。",
    "commentCopied": "コメントをコピーしました。",
    "copyFailed": "コピーできませんでした。",
    "pleaseLoginAgain": "もう一度ログインしてください。",
    "failedUpdateComment": "コメントを更新できませんでした",
    "commentUpdated": "コメントを更新しました。",
    "failedUpdateCommentPeriod": "コメントを更新できませんでした。",
    "failedDeleteComment": "コメントを削除できませんでした",
    "commentDeleted": "コメントを削除しました。",
    "failedDeleteCommentPeriod": "コメントを削除できませんでした。",
    "commentHiddenDevice": "この端末でコメントを非表示にしました。",
    "commentsCount": "コメント {{count}}件",
    "loading": "読み込み中...",
    "loadMoreComments": "さらにコメントを読み込む",
    "noCommentsYet": "まだコメントはありません",
    "noCommentsDesc": "会話を始めて、この投稿への感想を共有しましょう。",
    "writeCommentAction": "コメントを書く",
    "replyingTo": "{{name}}に返信中",
    "cancel": "キャンセル",
    "commentsOff": "この投稿ではコメントがオフになっています。",
    "writeReply": "返信を書く...",
    "writeComment": "コメントを書く...",
    "sendReply": "返信を送信",
    "sendComment": "コメントを送信",
    "viewMoreReplies": "返信をさらに表示",
    "loadingReplies": "返信を読み込み中...",
    "failedLoadRepliesPeriod": "返信を読み込めませんでした。"
  },
  "ko": {
    "hotComments": "인기 댓글",
    "hotCommentsDesc": "좋아요가 많은 댓글부터 표시합니다.",
    "newest": "최신순",
    "newestDesc": "최신 댓글부터 표시합니다.",
    "allComments": "모든 댓글",
    "allCommentsDesc": "모든 댓글을 표시합니다.",
    "justNow": "방금",
    "minutesAgo": "{{count}}분",
    "hoursAgo": "{{count}}시간",
    "daysAgo": "{{count}}일",
    "reader": "독자",
    "reply": "답글",
    "copy": "복사",
    "edit": "수정",
    "delete": "삭제",
    "reportComment": "댓글 신고",
    "hideComment": "이 댓글 숨기기",
    "like": "좋아요",
    "hideReplies": "답글 숨기기",
    "viewReplies": "답글 {{count}}개 보기",
    "viewReply": "답글 {{count}}개 보기",
    "editComment": "댓글 수정",
    "saving": "저장 중...",
    "saveComment": "댓글 저장",
    "failedLoadComments": "댓글을 불러오지 못했습니다",
    "failedLoadCommentsPeriod": "댓글을 불러오지 못했습니다.",
    "pleaseLoginComment": "댓글을 작성하려면 로그인하세요.",
    "failedCreateComment": "댓글을 작성하지 못했습니다",
    "failedCreateCommentPeriod": "댓글을 작성하지 못했습니다.",
    "pleaseLoginReply": "답글을 작성하려면 로그인하세요.",
    "failedCreateReply": "답글을 작성하지 못했습니다",
    "failedCreateReplyPeriod": "답글을 작성하지 못했습니다.",
    "pleaseLoginReact": "반응하려면 로그인하세요.",
    "failedUpdateReaction": "반응을 업데이트하지 못했습니다",
    "failedUpdateReactionPeriod": "반응을 업데이트하지 못했습니다.",
    "commentCopied": "댓글을 복사했습니다.",
    "copyFailed": "복사하지 못했습니다.",
    "pleaseLoginAgain": "다시 로그인하세요.",
    "failedUpdateComment": "댓글을 수정하지 못했습니다",
    "commentUpdated": "댓글을 수정했습니다.",
    "failedUpdateCommentPeriod": "댓글을 수정하지 못했습니다.",
    "failedDeleteComment": "댓글을 삭제하지 못했습니다",
    "commentDeleted": "댓글을 삭제했습니다.",
    "failedDeleteCommentPeriod": "댓글을 삭제하지 못했습니다.",
    "commentHiddenDevice": "이 기기에서 댓글을 숨겼습니다.",
    "commentsCount": "댓글 {{count}}개",
    "loading": "불러오는 중...",
    "loadMoreComments": "댓글 더 불러오기",
    "noCommentsYet": "아직 댓글이 없습니다",
    "noCommentsDesc": "대화를 시작하고 이 게시물에 대한 생각을 공유해 보세요.",
    "writeCommentAction": "댓글 작성",
    "replyingTo": "{{name}}에게 답글 작성 중",
    "cancel": "취소",
    "commentsOff": "이 게시물의 댓글이 꺼져 있습니다.",
    "writeReply": "답글 작성...",
    "writeComment": "댓글 작성...",
    "sendReply": "답글 보내기",
    "sendComment": "댓글 보내기",
    "viewMoreReplies": "답글 더 보기",
    "loadingReplies": "답글 불러오는 중...",
    "failedLoadRepliesPeriod": "답글을 불러오지 못했습니다."
  }
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const COMMENT_PAGE_SIZE = 20
const REPLY_PAGE_SIZE = 5
const COMMENT_LIMIT = 1000

const SORT_OPTIONS = [
  { value: 'top', labelKey: 'hotComments', descriptionKey: 'hotCommentsDesc' },
  { value: 'newest', labelKey: 'newest', descriptionKey: 'newestDesc' },
  { value: 'all', labelKey: 'allComments', descriptionKey: 'allCommentsDesc' },
]

function getAuthToken() {
  return (
    localStorage.getItem(
      'shadow_reader_token'
    ) ||
    sessionStorage.getItem(
      'shadow_reader_token'
    ) ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        'shadow_reader_user'
      ) ||
        sessionStorage.getItem(
          'shadow_reader_user'
        ) ||
        'null'
    )
  } catch {
    return null
  }
}

function formatCompactNumber(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}

function formatTime(value) {
  const timestamp = new Date(value || 0).getTime()
  const justNow = getDisplayText('readerPostCommentsModal.justNow')
  if (!timestamp) return justNow
  const difference = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(difference / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 1) return justNow
  if (minutes < 60) return getDisplayText('readerPostCommentsModal.minutesAgo', { count: minutes })
  if (hours < 24) return getDisplayText('readerPostCommentsModal.hoursAgo', { count: hours })
  if (days < 7) return getDisplayText('readerPostCommentsModal.daysAgo', { count: days })
  return new Date(timestamp).toLocaleDateString(getDisplayLanguageId() || 'en')
}

function normalizeComment(comment) {
  const user = comment?.user || {}

  return {
    id: comment?.id,
    post_id: comment?.post_id,
    user_id: comment?.user_id || user.id,
    parent_id: comment?.parent_id || null,
    text: comment?.text || '',
    likes: Number(comment?.likes || 0),
    liked: Boolean(comment?.liked),
    reaction_type:
      comment?.reaction_type || null,
    created_at: comment?.created_at,
    updated_at: comment?.updated_at,
    user: {
      id: user.id || comment?.user_id,
      name:
        user.name ||
        user.username ||
        getDisplayText('readerPostCommentsModal.reader'),
      username: user.username || '',
      avatar_url: user.avatar_url || '',
    },
    reply_total: Number(
      comment?.reply_total ??
        comment?.replies?.length ??
        0
    ),
    reply_page:
      Number(comment?.reply_page) === 0
        ? 0
        : Math.max(
            1,
            Number(
              comment?.reply_page || 1
            )
          ),
    reply_has_more: Boolean(
      comment?.reply_has_more
    ),
    replies: Array.isArray(comment?.replies)
      ? comment.replies.map(normalizeComment)
      : [],
  }
}

function Avatar({ user, small = false }) {
  const name = user?.name || getDisplayText('readerPostCommentsModal.reader')
  const size = small
    ? 'h-8 w-8 text-[11px]'
    : 'h-10 w-10 text-[13px]'

  return user?.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={name}
      className={`${size} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] font-semibold text-[var(--shadow-text-primary)]`}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function MenuRow({
  icon,
  label,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[16px] px-2 py-3.5 text-left active:bg-[var(--shadow-bg-soft)] ${
        danger
          ? 'text-[#dc2626]'
          : 'text-[var(--shadow-text-primary)]'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          danger
            ? 'bg-[#fff1f2] text-[#dc2626] dark:bg-[#dc2626]/10'
            : 'bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]'
        }`}
      >
        <i className={`${icon} text-[17px]`} />
      </span>
      <span className="text-[16px] font-normal">
        {label}
      </span>
    </button>
  )
}

function CommentOptionsSheet({
  comment,
  currentUserId,
  onClose,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onReport,
}) {
  const { t } = useDisplayTranslation()
  if (!comment) return null

  const ownsComment =
    currentUserId &&
    String(comment.user_id || '') ===
      String(currentUserId)

  const runAction = (action) => {
    onClose()
    action?.()
  }

  return (
    <div className="fixed inset-0 z-[290] flex items-end justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comment options"
        className="absolute inset-0 bg-black/40"
      />

      <section className="relative w-full max-w-3xl rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:mb-4 sm:rounded-[28px]">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        <MenuRow
          icon="fa-regular fa-comment"
          label={t('readerPostCommentsModal.reply')}
          onClick={() => runAction(onReply)}
        />
        <MenuRow
          icon="fa-regular fa-copy"
          label={t('readerPostCommentsModal.copy')}
          onClick={() => runAction(onCopy)}
        />

        {ownsComment ? (
          <>
            <MenuRow
              icon="fa-regular fa-pen-to-square"
              label={t('readerPostCommentsModal.edit')}
              onClick={() => runAction(onEdit)}
            />
            <MenuRow
              icon="fa-regular fa-trash-can"
              label={t('readerPostCommentsModal.delete')}
              danger
              onClick={() => runAction(onDelete)}
            />
          </>
        ) : (
          <>
            <MenuRow
              icon="fa-regular fa-flag"
              label={t('readerPostCommentsModal.reportComment')}
              onClick={() => runAction(onReport)}
            />
            <MenuRow
              icon="fa-regular fa-eye-slash"
              label={t('readerPostCommentsModal.hideComment')}
              onClick={() => runAction(onHide)}
            />
          </>
        )}
      </section>
    </div>
  )
}

function ReplyItem({ reply, onLike }) {
  const { t } = useDisplayTranslation()
  return (
    <div className="flex gap-2">
      <Avatar user={reply.user} small />

      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">
              {reply.user?.name || getDisplayText('readerPostCommentsModal.reader')}
            </span>
            <span className="text-[10px] font-normal text-[var(--shadow-text-tertiary)]">
              {formatTime(reply.created_at)}
            </span>
          </div>
          <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            {reply.text}
          </p>
        </div>

                <ReactionAction
          reactionType={
            reply.reaction_type ||
            (reply.liked
              ? 'love'
              : '')
          }
          count={reply.likes}
          showCount={
            Number(reply.likes || 0) > 0
          }
          formatCount={formatCompactNumber}
          onReact={(reactionType) =>
            onLike(
              reply.id,
              reactionType
            )
          }
          idleLabel={t('readerPostCommentsModal.like')}
          className="ml-3 mt-1"
          buttonClassName="text-[11px] font-semibold"
          countClassName="text-[11px] font-semibold"
          pickerAlign="left"
        />
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onStartReply,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onReport,
  onLoadMoreReplies,
  loadingRepliesId,
}) {
  const { t } = useDisplayTranslation()
  const [menuOpen, setMenuOpen] =
    useState(false)
  
  const [repliesShown, setRepliesShown] =
    useState(false)

  const replies = Array.isArray(
    comment.replies
  )
    ? comment.replies
    : []
  const replyTotal = Math.max(
    replies.length,
    Number(comment.reply_total || 0)
  )
  const loadingReplies =
    String(loadingRepliesId || '') ===
    String(comment.id || '')

  const openReplyComposer = () => {
    setRepliesShown(true)

    if (
      replyTotal > 0 &&
      replies.length === 0
    ) {
      onLoadMoreReplies?.(
        comment.id
      )
    }
    onStartReply?.(
      comment.id,
      comment.user?.name || getDisplayText('readerPostCommentsModal.reader')
    )
  }

  return (
    <article className="px-4 py-4">
      <div className="flex gap-3">
        <Avatar user={comment.user} />

        <div className="min-w-0 flex-1">
          <div className="relative pr-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-block max-w-full rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">
                  {comment.user?.name ||
                    getDisplayText('readerPostCommentsModal.reader')}
                </span>
                <span className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                  {formatTime(
                    comment.created_at
                  )}
                </span>
              </div>

              <p className="mt-1 whitespace-pre-wrap break-words text-[13.5px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
                {comment.text}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-[var(--shadow-text-tertiary)] active:scale-95"
              aria-label="Comment options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>
          </div>

          <div className="mt-1 flex items-center gap-4 pl-3 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">
                        <ReactionAction
              reactionType={
                comment.reaction_type ||
                (comment.liked
                  ? 'love'
                  : '')
              }
              count={comment.likes}
              showCount={
                Number(
                  comment.likes || 0
                ) > 0
              }
              formatCount={
                formatCompactNumber
              }
              onReact={(reactionType) =>
                onLike(
                  comment.id,
                  reactionType
                )
              }
              idleLabel={t('readerPostCommentsModal.like')}
              buttonClassName="text-[12px] font-semibold"
              countClassName="text-[12px] font-semibold"
              pickerAlign="left"
            />
            <button
              type="button"
              onClick={openReplyComposer}
            >
              {t('readerPostCommentsModal.reply')}
            </button>

            {replyTotal > 0 ? (
              <button
                type="button"
                onClick={() => {
                  if (
                    !repliesShown &&
                    replies.length === 0
                  ) {
                    onLoadMoreReplies?.(
                      comment.id
                    )
                  }

                  setRepliesShown(
                    (value) => !value
                  )
                }}
              >
                {repliesShown
                  ? t('readerPostCommentsModal.hideReplies')
                  : replyTotal > 1
                    ? t('readerPostCommentsModal.viewReplies', { count: replyTotal })
                    : t('readerPostCommentsModal.viewReply', { count: replyTotal })}
              </button>
            ) : null}
          </div>

          {repliesShown &&
          (replies.length ||
            loadingReplies) ? (
            <div className="mt-3 space-y-3 border-l-2 border-[var(--shadow-border)] pl-3">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onLike={onLike}
                />
              ))}

              {comment.reply_has_more ? (
                <button
                  type="button"
                  onClick={() =>
                    onLoadMoreReplies?.(
                      comment.id
                    )
                  }
                  disabled={loadingReplies}
                  className="text-[12px] font-semibold text-[var(--shadow-text-tertiary)] disabled:opacity-60"
                >
                  {loadingReplies
                    ? t('readerPostCommentsModal.loadingReplies')
                    : t('readerPostCommentsModal.viewMoreReplies')}
                </button>
              ) : null}
            </div>
          ) : null}

          
        </div>
      </div>

      <CommentOptionsSheet
        comment={menuOpen ? comment : null}
        currentUserId={currentUserId}
        onClose={() => setMenuOpen(false)}
        onReply={openReplyComposer}
        onCopy={() => onCopy(comment)}
        onEdit={() => onEdit(comment)}
        onDelete={() => onDelete(comment)}
        onHide={() => onHide(comment)}
        onReport={() => onReport(comment)}
      />
    </article>
  )
}

function EditCommentSheet({
  comment,
  value,
  onChange,
  onClose,
  onSave,
  saving,
}) {
  const { t } = useDisplayTranslation()
  if (!comment) return null

  return (
    <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/35 px-4">
      <section className="w-full max-w-xl rounded-t-[26px] bg-[var(--shadow-bg-surface)] px-5 pb-6 pt-4 shadow-2xl sm:mb-6 sm:rounded-[26px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)]" />

        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-[var(--shadow-text-primary)]">
            {t('readerPostCommentsModal.editComment')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]"
            aria-label="Close edit comment"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <textarea
          value={value}
          maxLength={COMMENT_LIMIT}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={5}
          className="mt-4 w-full resize-none rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3 text-[14px] font-normal leading-6 outline-none focus:ring-2 focus:ring-[#111827]/10"
        />

        <button
          type="button"
          onClick={onSave}
          disabled={!value.trim() || saving}
          className="mt-4 h-11 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-semibold text-[var(--shadow-bg-surface)] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
        >
          {saving
            ? t('readerPostCommentsModal.saving')
            : t('readerPostCommentsModal.saveComment')}
        </button>
      </section>
    </div>
  )
}

export default function ReaderPostCommentsModal({
  open,
  postId,
  postName = 'Reader Post',
  echoSourceType = 'reader_post',
  echoSourceId,
  echoSourceName = 'Reader Post',
  postOwnerId,
  commentsPermission = 'everyone',
  reactionCount = 0,
  commentCount = 0,
  echoCount = 0,
  onClose,
  onTotalChange,
}) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const sheetRef = useRef(null)
  const composerRef = useRef(null)
  const dragStartYRef = useRef(0)
  const dragCurrentYRef = useRef(0)
  const draggingRef = useRef(false)

  const currentUser = useMemo(
    () => getStoredUser(),
    []
  )
  const currentUserId =
    currentUser?.id ||
    currentUser?.user_id ||
    ''

  const [comments, setComments] =
    useState([])
  const [sort, setSort] =
    useState('top')
  const [sortOpen, setSortOpen] =
    useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] =
    useState(false)
  const [total, setTotal] = useState(
    Number(commentCount || 0)
  )
  const [loading, setLoading] =
    useState(false)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [
    loadingRepliesId,
    setLoadingRepliesId,
  ] = useState(null)
  const [text, setText] = useState('')
  const [replyText, setReplyText] =
    useState('')
  const [replyTarget, setReplyTarget] =
    useState(null)
  const [sending, setSending] =
    useState(false)
  const [sendingReply, setSendingReply] =
    useState(false)
  const [toast, setToast] = useState('')
  const [editComment, setEditComment] =
    useState(null)
  const [editText, setEditText] =
    useState('')
  const [savingEdit, setSavingEdit] =
    useState(false)
  const [reportComment, setReportComment] =
    useState(null)
  const [hiddenIds, setHiddenIds] =
    useState(() => new Set())
  const [dragging, setDragging] =
    useState(false)
  const [dragOffset, setDragOffset] =
    useState(0)

  const selectedSort =
    SORT_OPTIONS.find(
      (option) => option.value === sort
    ) || SORT_OPTIONS[0]

  const visibleComments = useMemo(
    () =>
      comments.filter(
        (comment) =>
          !hiddenIds.has(
            String(comment.id)
          )
      ),
    [comments, hiddenIds]
  )

  const commentingDisabled =
    commentsPermission === 'no_one' &&
    String(currentUserId) !==
      String(postOwnerId || '')

  const composerText = replyTarget
    ? replyText
    : text

  const composerSending = replyTarget
    ? sendingReply
    : sending

  useEffect(() => {
    setTotal(Number(commentCount || 0))
  }, [commentCount])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow =
      document.body.style.overflow

    setDragOffset(0)
    setDragging(false)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])
  
  const showToast = (value) => {
    setToast(value)
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(
      () => setToast(''),
      1700
    )
  }

  const applyTotal = (value) => {
    const nextTotal = Math.max(
      0,
      Number(value || 0)
    )
    setTotal(nextTotal)
    onTotalChange?.(nextTotal)
  }

  const buildListUrl = (nextPage) => {
    const sortValue =
      sort === 'all' ? 'newest' : sort

    return `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(postId)}/comments?page=${nextPage}&limit=${COMMENT_PAGE_SIZE}&sort=${sortValue}&reply_limit=${REPLY_PAGE_SIZE}`
  }

  async function fetchComments(
    nextPage = 1,
    append = false
  ) {
    if (!postId) return

    const token = getAuthToken()

    try {
      append
        ? setLoadingMore(true)
        : setLoading(true)

      const response = await fetch(
        buildListUrl(nextPage),
        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {},
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
            t('readerPostCommentsModal.failedLoadComments')
        )
      }

      const normalized = Array.isArray(
        data.comments
      )
        ? data.comments.map(
            normalizeComment
          )
        : []

      setComments((current) =>
        append
          ? [...current, ...normalized]
          : normalized
      )
      setPage(Number(data.page || nextPage))
      setHasMore(Boolean(data.has_more))
      applyTotal(
        data.total ?? normalized.length
      )
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedLoadCommentsPeriod')
      )
    } finally {
      append
        ? setLoadingMore(false)
        : setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !postId) return

    setComments([])
    setPage(1)
    setHasMore(false)
    setHiddenIds(new Set())
    setReplyTarget(null)
    setReplyText('')
    fetchComments(1, false)
  }, [open, postId, sort])

  const updateCommentLocal = (
    commentId,
    changes
  ) => {
    setComments((current) =>
      current.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            ...changes,
          }
        }

        return {
          ...comment,
          replies: (comment.replies || []).map(
            (reply) =>
              reply.id === commentId
                ? {
                    ...reply,
                    ...changes,
                  }
                : reply
          ),
        }
      })
    )
  }

  async function loadMoreReplies(
    commentId
  ) {
    const parent = comments.find(
      (comment) =>
        String(comment.id) ===
        String(commentId)
    )

    if (
      !parent ||
      String(loadingRepliesId || '') ===
        String(commentId)
    ) {
      return
    }

    const nextPage = Math.max(
      1,
      Number(parent.reply_page || 0) + 1
    )
    const token = getAuthToken()

    try {
      setLoadingRepliesId(commentId)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(
          commentId
        )}/replies?page=${nextPage}&limit=${REPLY_PAGE_SIZE}`,
        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {},
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
            t('readerPostCommentsModal.failedLoadRepliesPeriod')
        )
      }

      const incoming = Array.isArray(
        data.replies
      )
        ? data.replies.map(
            normalizeComment
          )
        : []

      setComments((current) =>
        current.map((comment) => {
          if (
            String(comment.id) !==
            String(commentId)
          ) {
            return comment
          }

          const mergedById = new Map(
            [
              ...(comment.replies || []),
              ...incoming,
            ].map((reply) => [
              String(reply.id),
              reply,
            ])
          )

          const mergedReplies = [
            ...mergedById.values(),
          ].sort(
            (first, second) =>
              new Date(
                first.created_at || 0
              ).getTime() -
              new Date(
                second.created_at || 0
              ).getTime()
          )

          return {
            ...comment,
            replies: mergedReplies,
            reply_total: Number(
              data.total ??
                comment.reply_total ??
                mergedReplies.length
            ),
            reply_page: Number(
              data.page || nextPage
            ),
            reply_has_more: Boolean(
              data.has_more
            ),
          }
        })
      )
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedLoadRepliesPeriod')
      )
    } finally {
      setLoadingRepliesId(null)
    }
  }

  const handleStartReply = (
    parentId,
    name
  ) => {
    setReplyText('')
    setReplyTarget({
      parentId,
      name: String(name || getDisplayText('readerPostCommentsModal.reader')).trim(),
    })

    requestAnimationFrame(() => {
      composerRef.current?.focus()
    })
  }

  async function sendComment() {
    if (
      !composerText.trim() ||
      composerSending ||
      commentingDisabled
    ) {
      return
    }

    if (replyTarget) {
      const created = await sendReply(
        replyTarget.parentId,
        replyText.trim()
      )

      if (created) {
        setReplyText('')
        setReplyTarget(null)
      }

      return
    }

    const token = getAuthToken()

    if (!token) {
      showToast(t('readerPostCommentsModal.pleaseLoginComment'))
      return
    }

    try {
      setSending(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(postId)}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: text.trim(),
          }),
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
            t('readerPostCommentsModal.failedCreateComment')
        )
      }

      setComments((current) => [
        normalizeComment(data.comment),
        ...current,
      ])
      setText('')
      applyTotal(
        data.comment_count ?? total + 1
      )
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedCreateCommentPeriod')
      )
    } finally {
      setSending(false)
    }
  }

  async function sendReply(
    parentId,
    replyText
  ) {
    const token = getAuthToken()

    if (!token) {
      showToast(t('readerPostCommentsModal.pleaseLoginReply'))
      return false
    }

    try {
      setSendingReply(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/${encodeURIComponent(postId)}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: replyText,
            parent_id: parentId,
          }),
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
            t('readerPostCommentsModal.failedCreateReply')
        )
      }

      const createdReply = normalizeComment(
        data.comment
      )

      setComments((current) =>
        current.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  createdReply,
                ],
                reply_total:
                  Number(
                    comment.reply_total ??
                      comment.replies?.length ??
                      0
                  ) + 1,
                reply_page: Math.max(
                  1,
                  Number(
                    comment.reply_page || 0
                  )
                ),
              }
            : comment
        )
      )
      applyTotal(
        data.comment_count ?? total + 1
      )
      return true
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedCreateReplyPeriod')
      )
      return false
    } finally {
      setSendingReply(false)
    }
  }

  async function toggleLike(
    commentId,
    reactionType = 'love'
  ) {
    const token = getAuthToken()

    if (!token) {
      showToast(
        t('readerPostCommentsModal.pleaseLoginReact')
      )
      return
    }

    const nextReactionType = String(
      reactionType || 'love'
    )
      .trim()
      .toLowerCase()

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(commentId)}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            reaction_type:
              nextReactionType,
          }),
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
            t('readerPostCommentsModal.failedUpdateReaction')
        )
      }

      updateCommentLocal(commentId, {
        liked: Boolean(data.liked),
        reaction_type:
          data.reaction_type || null,
        likes: Number(data.likes || 0),
      })
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedUpdateReactionPeriod')
      )
    }
  }

  async function copyComment(comment) {
    const value = String(
      comment?.text || ''
    ).trim()

    if (!value) return

    try {
      await navigator.clipboard.writeText(
        value
      )
      showToast(t('readerPostCommentsModal.commentCopied'))
    } catch {
      showToast(t('readerPostCommentsModal.copyFailed'))
    }
  }

  async function saveEdit() {
    if (
      !editComment ||
      !editText.trim() ||
      savingEdit
    ) {
      return
    }

    const token = getAuthToken()

    if (!token) {
      showToast(t('readerPostCommentsModal.pleaseLoginAgain'))
      return
    }

    try {
      setSavingEdit(true)

      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(editComment.id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: editText.trim(),
          }),
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
            t('readerPostCommentsModal.failedUpdateComment')
        )
      }

      const updated = normalizeComment(
        data.comment
      )
      updateCommentLocal(
        editComment.id,
        updated
      )
      setEditComment(null)
      setEditText('')
      showToast(t('readerPostCommentsModal.commentUpdated'))
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedUpdateCommentPeriod')
      )
    } finally {
      setSavingEdit(false)
    }
  }

  async function deleteComment(comment) {
    const token = getAuthToken()

    if (!token) {
      showToast(t('readerPostCommentsModal.pleaseLoginAgain'))
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reader-posts/comments/${encodeURIComponent(comment.id)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${token}`,
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
            t('readerPostCommentsModal.failedDeleteComment')
        )
      }

      setComments((current) =>
        current
          .filter(
            (item) =>
              item.id !== comment.id
          )
          .map((item) => {
            const replies =
              item.replies || []
            const hadReply =
              replies.some(
                (reply) =>
                  reply.id === comment.id
              )
            const nextReplies =
              replies.filter(
                (reply) =>
                  reply.id !== comment.id
              )

            if (!hadReply) {
              return item
            }

            const replyTotal = Math.max(
              nextReplies.length,
              Number(
                item.reply_total ??
                  replies.length
              ) - 1
            )

            return {
              ...item,
              replies: nextReplies,
              reply_total: replyTotal,
              reply_has_more:
                Boolean(
                  item.reply_has_more
                ) &&
                nextReplies.length <
                  replyTotal,
            }
          })
      )
      applyTotal(
        data.comment_count ??
          Math.max(0, total - 1)
      )
      showToast(t('readerPostCommentsModal.commentDeleted'))
    } catch (error) {
      showToast(
        error.message ||
          t('readerPostCommentsModal.failedDeleteCommentPeriod')
      )
    }
  }

  const hideComment = (comment) => {
    setHiddenIds((current) => {
      const next = new Set(current)
      next.add(String(comment.id))
      return next
    })
    showToast(t('readerPostCommentsModal.commentHiddenDevice'))
  }

  const startDrag = (event) => {
    if (!event.isPrimary) return

    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    draggingRef.current = true
    setDragging(true)

    dragStartYRef.current = event.clientY
    dragCurrentYRef.current = event.clientY

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) return

    dragCurrentYRef.current = event.clientY

    setDragOffset(
      Math.max(
        0,
        event.clientY -
          dragStartYRef.current
      )
    )
  }

  const endDrag = () => {
    if (!draggingRef.current) return

    const distance = Math.max(
      0,
      dragCurrentYRef.current -
        dragStartYRef.current
    )

    draggingRef.current = false
    setDragging(false)

    if (distance > 70) {
      onClose()
      return
    }

    setDragOffset(0)
  }

  const openReactionList = () => {
    if (!postId) return

    onClose?.()

    navigate(
      `/interactions/reader_post/${encodeURIComponent(
        postId
      )}/likes`,
      {
        state: {
          sourceName: postName,
        },
      }
    )
  }

  const openEchoList = () => {
    const type = String(
      echoSourceType ||
        'reader_post'
    )
      .trim()
      .toLowerCase()

    const id = String(
      echoSourceId ||
        postId ||
        ''
    ).trim()

    if (!type || !id) return

    onClose?.()

    navigate(
      `/interactions/${encodeURIComponent(
        type
      )}/${encodeURIComponent(
        id
      )}/echoes`,
      {
        state: {
          sourceName:
            echoSourceName ||
            postName,
        },
      }
    )
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200000] flex items-end justify-center sm:items-center sm:px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        aria-label="Close comments"
      />

      <section
        ref={sheetRef}
        className="relative flex h-[calc(100dvh-12px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] shadow-2xl sm:h-[calc(100dvh-24px)] sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
       
        <header
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          className="shrink-0 cursor-grab touch-none border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 pb-3 pt-2.5 active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <div className="grid grid-cols-3 items-center gap-2 text-center">
            <button
              type="button"
              onPointerDown={(event) =>
                event.stopPropagation()
              }
              onClick={openReactionList}
              className="flex items-center justify-center gap-1 text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
              aria-label="View people who reacted"
            >
              <i className="fa-solid fa-heart text-[14px] text-[#ff3b5f]" />
              <span>
                {formatCompactNumber(
                  reactionCount
                )}
              </span>
            </button>

            <div className="rounded-full bg-[var(--shadow-bg-soft)] px-3 py-2 text-[14px] font-normal text-[var(--shadow-text-primary)]">
              {t('readerPostCommentsModal.commentsCount', { count: formatCompactNumber(total) })}
            </div>

            <button
              type="button"
              onPointerDown={(event) =>
                event.stopPropagation()
              }
              onClick={openEchoList}
              className="flex items-center justify-center gap-1 text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
              aria-label="View people who echoed"
            >
              <img
                src="/assets/Icons/echo.svg"
                alt=""
                aria-hidden="true"
                className="h-[14px] w-[14px] object-contain opacity-75"
              />
              <span>
                {formatCompactNumber(
                  echoCount
                )}
              </span>
            </button>
          </div>
        </header>

        <div className="relative z-10 shrink-0 bg-[var(--shadow-bg-surface)] px-4 py-2">
          <button
            type="button"
            onClick={() => setSortOpen(true)}
            className="flex items-center gap-1 text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
          >
            <span>{t(`readerPostCommentsModal.${selectedSort.labelKey}`)}</span>
            <i className="fa-solid fa-chevron-down text-[10px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading && !visibleComments.length ? (
            <div className="space-y-3 px-4 py-4">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]"
                  />
                )
              )}
            </div>
          ) : visibleComments.length ? (
            <>
              {visibleComments.map(
                (comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={
                      currentUserId
                    }
                    onLike={toggleLike}
                    onStartReply={
                      handleStartReply
                    }
                    onCopy={copyComment}
                    onEdit={(selected) => {
                      setEditComment(selected)
                      setEditText(
                        selected.text || ''
                      )
                    }}
                    onDelete={deleteComment}
                    onHide={hideComment}
                    onReport={setReportComment}
                    onLoadMoreReplies={
                      loadMoreReplies
                    }
                    loadingRepliesId={
                      loadingRepliesId
                    }
                  />
                )
              )}

              {hasMore ? (
                <div className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      fetchComments(
                        page + 1,
                        true
                      )
                    }
                    disabled={loadingMore}
                    className="h-11 w-full rounded-full bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] disabled:text-[var(--shadow-text-tertiary)]"
                  >
                    {loadingMore
                      ? t('readerPostCommentsModal.loading')
                      : t('readerPostCommentsModal.loadMoreComments')}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className="fa-regular fa-comments text-[22px]" />
              </div>
              <h3 className="mt-4 text-[17px] font-semibold text-[var(--shadow-text-primary)]">
                {t('readerPostCommentsModal.noCommentsYet')}
              </h3>
              <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
                {t('readerPostCommentsModal.noCommentsDesc')}
              </p>
              {!commentingDisabled ? (
                <button
                  type="button"
                  onClick={() =>
                    composerRef.current?.focus()
                  }
                  className="mt-5 h-11 rounded-full bg-[var(--shadow-text-primary)] px-5 text-[13px] font-normal text-[var(--shadow-bg-surface)] active:scale-95"
                >
                  {t('readerPostCommentsModal.writeCommentAction')}
                </button>
              ) : null}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3">
          {replyTarget ? (
            <div className="mx-auto mb-2 flex max-w-3xl items-center gap-1 px-1 text-[12px] text-[var(--shadow-text-secondary)]">
              <span>{t('readerPostCommentsModal.replyingTo', { name: replyTarget.name || getDisplayText('readerPostCommentsModal.reader') })}</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setReplyTarget(null)
                  setReplyText('')
                }}
                className="font-medium text-[#1877f2]"
              >
                {t('readerPostCommentsModal.cancel')}
              </button>
            </div>
          ) : null}

          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-2">
              <textarea
                ref={composerRef}
                value={composerText}
                maxLength={COMMENT_LIMIT}
                disabled={
                  commentingDisabled ||
                  composerSending
                }
                onChange={(event) => {
                  const textarea = event.currentTarget

                  if (replyTarget) {
                    setReplyText(textarea.value)
                  } else {
                    setText(textarea.value)
                  }

                  textarea.style.height = 'auto'
                  textarea.style.height = `${Math.min(
                    textarea.scrollHeight,
                    118
                  )}px`
                }}
                rows={1}
                placeholder={
                  commentingDisabled
                    ? t('readerPostCommentsModal.commentsOff')
                    : replyTarget
                      ? t('readerPostCommentsModal.writeReply')
                      : t('readerPostCommentsModal.writeComment')
                }
                className="max-h-[118px] min-h-[24px] w-full resize-none overflow-y-auto bg-transparent text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)] disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              onClick={sendComment}
              disabled={
                !composerText.trim() ||
                composerSending ||
                commentingDisabled
              }
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
              aria-label={
                replyTarget
                  ? t('readerPostCommentsModal.sendReply')
                  : t('readerPostCommentsModal.sendComment')
              }
            >
              <i
                className={`fa-solid ${
                  composerSending
                    ? 'fa-spinner animate-spin'
                    : 'fa-paper-plane'
                } text-[13px]`}
              />
            </button>
          </div>
        </div>

        {toast ? (
          <div className="absolute bottom-[88px] left-1/2 z-[120] -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--shadow-text-primary)] px-4 py-2 text-[12px] font-normal text-[var(--shadow-bg-surface)] shadow-lg">
            {toast}
          </div>
        ) : null}

        {sortOpen ? (
          <div className="absolute inset-0 z-[110] flex items-end justify-center bg-black/35">
            <button
              type="button"
              onClick={() =>
                setSortOpen(false)
              }
              className="absolute inset-0"
              aria-label="Close comment filter"
            />

            <section className="relative w-full max-w-3xl rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-5 pt-4 shadow-2xl sm:mb-4 sm:rounded-[28px]">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)]" />

              {SORT_OPTIONS.map((option) => {
                const active =
                  sort === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value)
                      setSortOpen(false)
                    }}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">
                        {t(`readerPostCommentsModal.${option.labelKey}`)}
                      </span>
                      <span className="mt-0.5 block text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                        {t(`readerPostCommentsModal.${option.descriptionKey}`)}
                      </span>
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? 'border-[var(--shadow-text-primary)] bg-[var(--shadow-text-primary)]'
                          : 'border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)]'
                      }`}
                    >
                      {active ? (
                        <i className="fa-solid fa-check text-[10px] text-[var(--shadow-bg-surface)]" />
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </section>
          </div>
        ) : null}

        <EditCommentSheet
          comment={editComment}
          value={editText}
          onChange={setEditText}
          onClose={() => {
            setEditComment(null)
            setEditText('')
          }}
          onSave={saveEdit}
          saving={savingEdit}
        />

        <ReportModal
          open={Boolean(reportComment)}
          reportType="comment"
          targetId={reportComment?.id}
          targetTitle={
            reportComment
              ? `${
                  reportComment.user?.name ||
                  getDisplayText('readerPostCommentsModal.reader')
                }: ${String(
                  reportComment.text || ''
                ).slice(0, 80)}`
              : ''
          }
          onClose={() =>
            setReportComment(null)
          }
        />
      </section>
    </div>,
    document.body
  )
}
