import { useEffect, useMemo, useRef, useState } from 'react'
import ReportModal from '../ReportModal'
import ReactionAction from '../social/reactions/ReactionAction'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('commentSection', {
  "en": {
    "hotComments": "Hot comments",
    "hotCommentsDesc": "Show comments with the most likes and replies first.",
    "newest": "Newest",
    "newestDesc": "Show the newest comments first.",
    "allComments": "All comments",
    "allCommentsDesc": "Show all comments.",
    "justNow": "Just now",
    "minutesAgo": "{{count}}m",
    "hoursAgo": "{{count}}h",
    "reader": "Reader",
    "author": "Author",
    "commentDeleted": "Comment deleted",
    "noCommentsYet": "No comments yet",
    "noCommentsDesc": "Start the conversation. Share what you feel, ask a question, or cheer for this story.",
    "writeCommentAction": "Write a comment",
    "reply": "Reply",
    "copy": "Copy",
    "delete": "Delete",
    "edit": "Edit",
    "reportComment": "Report Comment",
    "hideThisComment": "Hide this comment",
    "unhide": "Unhide",
    "hideComment": "Hide comment",
    "unpinComment": "Unpin comment",
    "pinComment": "Pin comment",
    "banUser": "Ban user",
    "removeSpoilerMark": "Remove spoiler mark",
    "spoilerMark": "Spoiler mark",
    "hide": "Hide",
    "like": "Like",
    "hideReplies": "Hide replies",
    "viewReplies": "View {{count}} replies",
    "viewReply": "View {{count}} reply",
    "loading": "Loading...",
    "viewMoreReplies": "View more replies",
    "pinned": "Pinned",
    "hidden": "Hidden",
    "spoilerReveal": "This comment may contain spoilers. Tap to reveal.",
    "replyingTo": "Replying to {{name}}",
    "cancel": "Cancel",
    "cannotComment": "You cannot comment on this story.",
    "writeReply": "Write a reply...",
    "writeComment": "Write a comment...",
    "sendReply": "Send reply",
    "sendComment": "Send comment",
    "editComment": "Edit comment",
    "saving": "Saving...",
    "saveComment": "Save comment",
    "episodeNumber": "Episode {{number}}",
    "comment": "comment",
    "comments": "comments",
    "loadMoreComments": "Load more comments",
    "commentingRestricted": "Commenting Restricted",
    "commentHidden": "Comment Hidden",
    "commentCouldNotPost": "Your comment could not be posted.",
    "restrictedWords": "Restricted words found",
    "until": "Until: {{date}}",
    "understand": "I Understand",
    "failedLoadComments": "Failed to load comments",
    "failedLoadCommentsPeriod": "Failed to load comments.",
    "pleaseLoginReply": "Please login to reply.",
    "pleaseLoginComment": "Please login to comment.",
    "failedCreateComment": "Failed to create comment",
    "failedCreateCommentPeriod": "Failed to create comment.",
    "pleaseLoginReact": "Please login to react.",
    "failedUpdateReaction": "Failed to update reaction",
    "failedUpdateReactionPeriod": "Failed to update reaction.",
    "failedLoadReplies": "Failed to load replies",
    "failedLoadRepliesPeriod": "Failed to load replies.",
    "failedCreateReply": "Failed to create reply",
    "failedCreateReplyPeriod": "Failed to create reply.",
    "pleaseLoginAgain": "Please login again.",
    "failedUpdateComment": "Failed to update comment",
    "failedUpdateCommentPeriod": "Failed to update comment.",
    "commentUpdated": "Comment updated.",
    "commentCopied": "Comment copied.",
    "copyFailed": "Copy failed.",
    "trashConfirm": "Move this comment to Trash? It can be recovered for 30 days.",
    "failedDeleteComment": "Failed to delete comment",
    "failedDeleteCommentPeriod": "Failed to delete comment.",
    "commentMovedTrash": "Comment moved to Trash.",
    "failedVisibility": "Failed to update comment visibility",
    "failedVisibilityPeriod": "Failed to update comment visibility.",
    "commentHiddenPage": "Comment hidden by this Page.",
    "commentUnhiddenPage": "Comment unhidden by this Page.",
    "actionFailed": "Action failed",
    "actionFailedPeriod": "Action failed.",
    "userBanned": "User banned from commenting.",
    "updated": "Updated.",
    "commentHiddenDevice": "Comment hidden on your device."
  },
  "km": {
    "hotComments": "មតិយោបល់ពេញនិយម",
    "hotCommentsDesc": "បង្ហាញមតិយោបល់ដែលមានការចូលចិត្ត និងការឆ្លើយតបច្រើនជាងគេមុន។",
    "newest": "ថ្មីបំផុត",
    "newestDesc": "បង្ហាញមតិយោបល់ថ្មីបំផុតមុន។",
    "allComments": "មតិយោបល់ទាំងអស់",
    "allCommentsDesc": "បង្ហាញមតិយោបល់ទាំងអស់។",
    "justNow": "ឥឡូវនេះ",
    "minutesAgo": "{{count}} នាទី",
    "hoursAgo": "{{count}} ម៉ោង",
    "reader": "អ្នកអាន",
    "author": "អ្នកនិពន្ធ",
    "commentDeleted": "មតិយោបល់ត្រូវបានលុប",
    "noCommentsYet": "មិនទាន់មានមតិយោបល់",
    "noCommentsDesc": "ចាប់ផ្តើមការសន្ទនា។ ចែករំលែកអារម្មណ៍ សួរសំណួរ ឬលើកទឹកចិត្តរឿងនេះ។",
    "writeCommentAction": "សរសេរមតិយោបល់",
    "reply": "ឆ្លើយតប",
    "copy": "ចម្លង",
    "delete": "លុប",
    "edit": "កែ",
    "reportComment": "រាយការណ៍មតិយោបល់",
    "hideThisComment": "លាក់មតិយោបល់នេះ",
    "unhide": "បង្ហាញវិញ",
    "hideComment": "លាក់មតិយោបល់",
    "unpinComment": "ដោះខ្ទាស់មតិយោបល់",
    "pinComment": "ខ្ទាស់មតិយោបល់",
    "banUser": "ហាមអ្នកប្រើប្រាស់",
    "removeSpoilerMark": "ដកសញ្ញា Spoiler",
    "spoilerMark": "សម្គាល់ Spoiler",
    "hide": "លាក់",
    "like": "ចូលចិត្ត",
    "hideReplies": "លាក់ការឆ្លើយតប",
    "viewReplies": "មើលការឆ្លើយតប {{count}}",
    "viewReply": "មើលការឆ្លើយតប {{count}}",
    "loading": "កំពុងផ្ទុក...",
    "viewMoreReplies": "មើលការឆ្លើយតបបន្ថែម",
    "pinned": "បានខ្ទាស់",
    "hidden": "បានលាក់",
    "spoilerReveal": "មតិយោបល់នេះអាចមាន Spoiler។ ចុចដើម្បីបង្ហាញ។",
    "replyingTo": "កំពុងឆ្លើយតបទៅ {{name}}",
    "cancel": "បោះបង់",
    "cannotComment": "អ្នកមិនអាចសរសេរមតិយោបល់លើរឿងនេះបានទេ។",
    "writeReply": "សរសេរការឆ្លើយតប...",
    "writeComment": "សរសេរមតិយោបល់...",
    "sendReply": "ផ្ញើការឆ្លើយតប",
    "sendComment": "ផ្ញើមតិយោបល់",
    "editComment": "កែមតិយោបល់",
    "saving": "កំពុងរក្សាទុក...",
    "saveComment": "រក្សាទុកមតិយោបល់",
    "episodeNumber": "ភាគ {{number}}",
    "comment": "មតិយោបល់",
    "comments": "មតិយោបល់",
    "loadMoreComments": "ផ្ទុកមតិយោបល់បន្ថែម",
    "commentingRestricted": "ការសរសេរមតិយោបល់ត្រូវបានកំណត់",
    "commentHidden": "មតិយោបល់ត្រូវបានលាក់",
    "commentCouldNotPost": "មតិយោបល់របស់អ្នកមិនអាចផ្ញើបានទេ។",
    "restrictedWords": "រកឃើញពាក្យដែលត្រូវបានកំណត់",
    "until": "រហូតដល់៖ {{date}}",
    "understand": "ខ្ញុំយល់",
    "failedLoadComments": "មិនអាចផ្ទុកមតិយោបល់បានទេ",
    "failedLoadCommentsPeriod": "មិនអាចផ្ទុកមតិយោបល់បានទេ។",
    "pleaseLoginReply": "សូមចូលគណនីដើម្បីឆ្លើយតប។",
    "pleaseLoginComment": "សូមចូលគណនីដើម្បីសរសេរមតិយោបល់។",
    "failedCreateComment": "មិនអាចបង្កើតមតិយោបល់បានទេ",
    "failedCreateCommentPeriod": "មិនអាចបង្កើតមតិយោបល់បានទេ។",
    "pleaseLoginReact": "សូមចូលគណនីដើម្បីប្រតិកម្ម។",
    "failedUpdateReaction": "មិនអាចកែប្រតិកម្មបានទេ",
    "failedUpdateReactionPeriod": "មិនអាចកែប្រតិកម្មបានទេ។",
    "failedLoadReplies": "មិនអាចផ្ទុកការឆ្លើយតបបានទេ",
    "failedLoadRepliesPeriod": "មិនអាចផ្ទុកការឆ្លើយតបបានទេ។",
    "failedCreateReply": "មិនអាចបង្កើតការឆ្លើយតបបានទេ",
    "failedCreateReplyPeriod": "មិនអាចបង្កើតការឆ្លើយតបបានទេ។",
    "pleaseLoginAgain": "សូមចូលគណនីឡើងវិញ។",
    "failedUpdateComment": "មិនអាចកែមតិយោបល់បានទេ",
    "failedUpdateCommentPeriod": "មិនអាចកែមតិយោបល់បានទេ។",
    "commentUpdated": "បានកែមតិយោបល់។",
    "commentCopied": "បានចម្លងមតិយោបល់។",
    "copyFailed": "ចម្លងមិនបានទេ។",
    "trashConfirm": "ផ្លាស់ទីមតិយោបល់នេះទៅ Trash? អាចស្ដារវាវិញបានក្នុងរយៈពេល 30 ថ្ងៃ។",
    "failedDeleteComment": "មិនអាចលុបមតិយោបល់បានទេ",
    "failedDeleteCommentPeriod": "មិនអាចលុបមតិយោបល់បានទេ។",
    "commentMovedTrash": "បានផ្លាស់ទីមតិយោបល់ទៅ Trash។",
    "failedVisibility": "មិនអាចកែការបង្ហាញមតិយោបល់បានទេ",
    "failedVisibilityPeriod": "មិនអាចកែការបង្ហាញមតិយោបល់បានទេ។",
    "commentHiddenPage": "បានលាក់មតិយោបល់ដោយ Page នេះ។",
    "commentUnhiddenPage": "បានបង្ហាញមតិយោបល់វិញដោយ Page នេះ។",
    "actionFailed": "សកម្មភាពបរាជ័យ",
    "actionFailedPeriod": "សកម្មភាពបរាជ័យ។",
    "userBanned": "បានហាមអ្នកប្រើប្រាស់មិនឱ្យសរសេរមតិយោបល់។",
    "updated": "បានអាប់ដេត។",
    "commentHiddenDevice": "បានលាក់មតិយោបល់លើឧបករណ៍របស់អ្នក។"
  },
  "zh": {
    "hotComments": "热门评论",
    "hotCommentsDesc": "优先显示点赞和回复最多的评论。",
    "newest": "最新",
    "newestDesc": "优先显示最新评论。",
    "allComments": "全部评论",
    "allCommentsDesc": "显示所有评论。",
    "justNow": "刚刚",
    "minutesAgo": "操作失败。",
    "hoursAgo": "操作失败。",
    "reader": "读者",
    "author": "作者",
    "commentDeleted": "评论已删除",
    "noCommentsYet": "暂无评论",
    "noCommentsDesc": "开始对话，分享感受、提出问题或为这个故事加油。",
    "writeCommentAction": "写评论",
    "reply": "回复",
    "copy": "复制",
    "delete": "删除",
    "edit": "编辑",
    "reportComment": "举报评论",
    "hideThisComment": "隐藏此评论",
    "unhide": "取消隐藏",
    "hideComment": "隐藏评论",
    "unpinComment": "取消置顶",
    "pinComment": "置顶评论",
    "banUser": "禁言用户",
    "removeSpoilerMark": "移除剧透标记",
    "spoilerMark": "标记剧透",
    "hide": "隐藏",
    "like": "赞",
    "hideReplies": "隐藏回复",
    "viewReplies": "查看 {{count}} 条回复",
    "viewReply": "查看 {{count}} 条回复",
    "loading": "加载中...",
    "viewMoreReplies": "查看更多回复",
    "pinned": "已置顶",
    "hidden": "已隐藏",
    "spoilerReveal": "此评论可能包含剧透。点击查看。",
    "replyingTo": "回复 {{name}}",
    "cancel": "取消",
    "cannotComment": "你无法在这个故事下评论。",
    "writeReply": "写回复...",
    "writeComment": "写评论...",
    "sendReply": "发送回复",
    "sendComment": "发送评论",
    "editComment": "编辑评论",
    "saving": "保存中...",
    "saveComment": "保存评论",
    "episodeNumber": "第 {{number}} 集",
    "comment": "条评论",
    "comments": "条评论",
    "loadMoreComments": "加载更多评论",
    "commentingRestricted": "评论受限",
    "commentHidden": "评论已隐藏",
    "commentCouldNotPost": "你的评论无法发布。",
    "restrictedWords": "发现受限词语",
    "until": "截至：{{date}}",
    "understand": "我知道了",
    "failedLoadComments": "操作失败。",
    "failedLoadCommentsPeriod": "操作失败。",
    "pleaseLoginReply": "请重新登录。",
    "pleaseLoginComment": "请重新登录。",
    "failedCreateComment": "操作失败。",
    "failedCreateCommentPeriod": "操作失败。",
    "pleaseLoginReact": "请重新登录。",
    "failedUpdateReaction": "操作失败。",
    "failedUpdateReactionPeriod": "操作失败。",
    "failedLoadReplies": "操作失败。",
    "failedLoadRepliesPeriod": "操作失败。",
    "failedCreateReply": "操作失败。",
    "failedCreateReplyPeriod": "操作失败。",
    "pleaseLoginAgain": "请重新登录。",
    "failedUpdateComment": "操作失败。",
    "failedUpdateCommentPeriod": "操作失败。",
    "commentUpdated": "评论已更新。",
    "commentCopied": "评论已复制。",
    "copyFailed": "复制失败。",
    "trashConfirm": "将此评论移到回收站？30天内可恢复。",
    "failedDeleteComment": "操作失败。",
    "failedDeleteCommentPeriod": "操作失败。",
    "commentMovedTrash": "评论已移至回收站。",
    "failedVisibility": "操作失败。",
    "failedVisibilityPeriod": "操作失败。",
    "commentHiddenPage": "此评论已被该页面隐藏。",
    "commentUnhiddenPage": "此评论已被该页面取消隐藏。",
    "actionFailed": "操作失败。",
    "actionFailedPeriod": "操作失败。",
    "userBanned": "该用户已被禁止评论。",
    "updated": "已更新。",
    "commentHiddenDevice": "此评论已在你的设备上隐藏。"
  },
  "ja": {
    "hotComments": "人気のコメント",
    "hotCommentsDesc": "いいねと返信が多いコメントを先に表示します。",
    "newest": "新しい順",
    "newestDesc": "新しいコメントを先に表示します。",
    "allComments": "すべてのコメント",
    "allCommentsDesc": "すべてのコメントを表示します。",
    "justNow": "たった今",
    "minutesAgo": "操作に失敗しました。",
    "hoursAgo": "操作に失敗しました。",
    "reader": "読者",
    "author": "作者",
    "commentDeleted": "コメントは削除されました",
    "noCommentsYet": "まだコメントはありません",
    "noCommentsDesc": "会話を始めて、感想や質問、この作品への応援を共有しましょう。",
    "writeCommentAction": "コメントを書く",
    "reply": "返信",
    "copy": "コピー",
    "delete": "削除",
    "edit": "編集",
    "reportComment": "コメントを報告",
    "hideThisComment": "このコメントを非表示",
    "unhide": "再表示",
    "hideComment": "コメントを非表示",
    "unpinComment": "固定を解除",
    "pinComment": "コメントを固定",
    "banUser": "ユーザーを禁止",
    "removeSpoilerMark": "ネタバレ表示を解除",
    "spoilerMark": "ネタバレにする",
    "hide": "非表示",
    "like": "いいね",
    "hideReplies": "返信を隠す",
    "viewReplies": "返信 {{count}}件を表示",
    "viewReply": "返信 {{count}}件を表示",
    "loading": "読み込み中...",
    "viewMoreReplies": "さらに返信を表示",
    "pinned": "固定済み",
    "hidden": "非表示",
    "spoilerReveal": "このコメントにはネタバレが含まれる可能性があります。タップして表示。",
    "replyingTo": "{{name}}に返信中",
    "cancel": "キャンセル",
    "cannotComment": "この作品にはコメントできません。",
    "writeReply": "返信を書く...",
    "writeComment": "コメントを書く...",
    "sendReply": "返信を送信",
    "sendComment": "コメントを送信",
    "editComment": "コメントを編集",
    "saving": "保存中...",
    "saveComment": "コメントを保存",
    "episodeNumber": "エピソード {{number}}",
    "comment": "コメント",
    "comments": "コメント",
    "loadMoreComments": "さらにコメントを読み込む",
    "commentingRestricted": "コメントが制限されています",
    "commentHidden": "コメントは非表示です",
    "commentCouldNotPost": "コメントを投稿できませんでした。",
    "restrictedWords": "制限された語句が見つかりました",
    "until": "期限：{{date}}",
    "understand": "了解",
    "failedLoadComments": "操作に失敗しました。",
    "failedLoadCommentsPeriod": "操作に失敗しました。",
    "pleaseLoginReply": "もう一度ログインしてください。",
    "pleaseLoginComment": "もう一度ログインしてください。",
    "failedCreateComment": "操作に失敗しました。",
    "failedCreateCommentPeriod": "操作に失敗しました。",
    "pleaseLoginReact": "もう一度ログインしてください。",
    "failedUpdateReaction": "操作に失敗しました。",
    "failedUpdateReactionPeriod": "操作に失敗しました。",
    "failedLoadReplies": "操作に失敗しました。",
    "failedLoadRepliesPeriod": "操作に失敗しました。",
    "failedCreateReply": "操作に失敗しました。",
    "failedCreateReplyPeriod": "操作に失敗しました。",
    "pleaseLoginAgain": "もう一度ログインしてください。",
    "failedUpdateComment": "操作に失敗しました。",
    "failedUpdateCommentPeriod": "操作に失敗しました。",
    "commentUpdated": "コメントを更新しました。",
    "commentCopied": "コメントをコピーしました。",
    "copyFailed": "コピーできませんでした。",
    "trashConfirm": "このコメントをゴミ箱に移動しますか？30日間復元できます。",
    "failedDeleteComment": "操作に失敗しました。",
    "failedDeleteCommentPeriod": "操作に失敗しました。",
    "commentMovedTrash": "コメントをゴミ箱に移動しました。",
    "failedVisibility": "操作に失敗しました。",
    "failedVisibilityPeriod": "操作に失敗しました。",
    "commentHiddenPage": "このページでコメントを非表示にしました。",
    "commentUnhiddenPage": "このページでコメントを再表示しました。",
    "actionFailed": "操作に失敗しました。",
    "actionFailedPeriod": "操作に失敗しました。",
    "userBanned": "ユーザーのコメントを禁止しました。",
    "updated": "更新しました。",
    "commentHiddenDevice": "この端末でコメントを非表示にしました。"
  },
  "ko": {
    "hotComments": "인기 댓글",
    "hotCommentsDesc": "좋아요와 답글이 많은 댓글부터 표시합니다.",
    "newest": "최신순",
    "newestDesc": "최신 댓글부터 표시합니다.",
    "allComments": "모든 댓글",
    "allCommentsDesc": "모든 댓글을 표시합니다.",
    "justNow": "방금",
    "minutesAgo": "작업에 실패했습니다.",
    "hoursAgo": "작업에 실패했습니다.",
    "reader": "독자",
    "author": "작가",
    "commentDeleted": "댓글이 삭제되었습니다",
    "noCommentsYet": "아직 댓글이 없습니다",
    "noCommentsDesc": "대화를 시작하고 느낌, 질문 또는 이 이야기에 대한 응원을 공유해 보세요.",
    "writeCommentAction": "댓글 작성",
    "reply": "답글",
    "copy": "복사",
    "delete": "삭제",
    "edit": "수정",
    "reportComment": "댓글 신고",
    "hideThisComment": "이 댓글 숨기기",
    "unhide": "숨김 해제",
    "hideComment": "댓글 숨기기",
    "unpinComment": "고정 해제",
    "pinComment": "댓글 고정",
    "banUser": "사용자 차단",
    "removeSpoilerMark": "스포일러 표시 해제",
    "spoilerMark": "스포일러 표시",
    "hide": "숨기기",
    "like": "좋아요",
    "hideReplies": "답글 숨기기",
    "viewReplies": "답글 {{count}}개 보기",
    "viewReply": "답글 {{count}}개 보기",
    "loading": "불러오는 중...",
    "viewMoreReplies": "답글 더 보기",
    "pinned": "고정됨",
    "hidden": "숨김",
    "spoilerReveal": "이 댓글에는 스포일러가 포함될 수 있습니다. 탭하여 보기.",
    "replyingTo": "{{name}}에게 답글 작성 중",
    "cancel": "취소",
    "cannotComment": "이 이야기에는 댓글을 작성할 수 없습니다.",
    "writeReply": "답글 작성...",
    "writeComment": "댓글 작성...",
    "sendReply": "답글 보내기",
    "sendComment": "댓글 보내기",
    "editComment": "댓글 수정",
    "saving": "저장 중...",
    "saveComment": "댓글 저장",
    "episodeNumber": "에피소드 {{number}}",
    "comment": "댓글",
    "comments": "댓글",
    "loadMoreComments": "댓글 더 불러오기",
    "commentingRestricted": "댓글 작성 제한",
    "commentHidden": "댓글 숨김",
    "commentCouldNotPost": "댓글을 게시할 수 없습니다.",
    "restrictedWords": "제한된 단어가 발견되었습니다",
    "until": "기한: {{date}}",
    "understand": "확인",
    "failedLoadComments": "작업에 실패했습니다.",
    "failedLoadCommentsPeriod": "작업에 실패했습니다.",
    "pleaseLoginReply": "다시 로그인하세요.",
    "pleaseLoginComment": "다시 로그인하세요.",
    "failedCreateComment": "작업에 실패했습니다.",
    "failedCreateCommentPeriod": "작업에 실패했습니다.",
    "pleaseLoginReact": "다시 로그인하세요.",
    "failedUpdateReaction": "작업에 실패했습니다.",
    "failedUpdateReactionPeriod": "작업에 실패했습니다.",
    "failedLoadReplies": "작업에 실패했습니다.",
    "failedLoadRepliesPeriod": "작업에 실패했습니다.",
    "failedCreateReply": "작업에 실패했습니다.",
    "failedCreateReplyPeriod": "작업에 실패했습니다.",
    "pleaseLoginAgain": "다시 로그인하세요.",
    "failedUpdateComment": "작업에 실패했습니다.",
    "failedUpdateCommentPeriod": "작업에 실패했습니다.",
    "commentUpdated": "댓글을 수정했습니다.",
    "commentCopied": "댓글을 복사했습니다.",
    "copyFailed": "복사하지 못했습니다.",
    "trashConfirm": "이 댓글을 휴지통으로 이동할까요? 30일 동안 복구할 수 있습니다.",
    "failedDeleteComment": "작업에 실패했습니다.",
    "failedDeleteCommentPeriod": "작업에 실패했습니다.",
    "commentMovedTrash": "댓글을 휴지통으로 이동했습니다.",
    "failedVisibility": "작업에 실패했습니다.",
    "failedVisibilityPeriod": "작업에 실패했습니다.",
    "commentHiddenPage": "이 페이지에서 댓글을 숨겼습니다.",
    "commentUnhiddenPage": "이 페이지에서 댓글 숨김을 해제했습니다.",
    "actionFailed": "작업에 실패했습니다.",
    "actionFailedPeriod": "작업에 실패했습니다.",
    "userBanned": "사용자의 댓글 작성을 차단했습니다.",
    "updated": "업데이트했습니다.",
    "commentHiddenDevice": "이 기기에서 댓글을 숨겼습니다."
  }
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const COMMENT_PAGE_SIZE = 10
const REPLY_PAGE_SIZE = 10
const COMMENT_LIMIT = 1000

const COMMENT_SORT_OPTIONS = [
  { value: 'top', labelKey: 'hotComments', descriptionKey: 'hotCommentsDesc' },
  { value: 'newest', labelKey: 'newest', descriptionKey: 'newestDesc' },
  { value: 'all', labelKey: 'allComments', descriptionKey: 'allCommentsDesc' },
]

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    const raw =
      localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') ||
      ''

    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getCurrentUser() {
  const user = getStoredUser()

  if (!user) {
    return {
      id: null,
      name: getDisplayText('commentSection.reader'),
      avatar_url: '',
      role: 'reader',
      is_admin: false,
    }
  }

  const emailName = user.email
    ? String(user.email).split('@')[0]
    : ''
  const role = user.role || 'reader'

  return {
    id: user.id || user.user_id || null,
    name:
      user.name ||
      user.username ||
      user.display_name ||
      emailName ||
      getDisplayText('commentSection.reader'),
    avatar_url:
      user.avatar_url ||
      user.profile_image ||
      user.photo_url ||
      '',
    role,
    is_admin:
      role === 'admin' ||
      role === 'super_admin',
  }
}

function getStoryOwnerId(story) {
  return (
    story?.user_id ||
    story?.author_user_id ||
    story?.author_id ||
    story?.owner_id ||
    story?.created_by ||
    story?.author?.user_id ||
    story?.author_page?.user_id ||
    null
  )
}

function isStoryAuthor(currentUser, story) {
  const ownerId = getStoryOwnerId(story)

  return Boolean(
    currentUser?.id &&
      ownerId &&
      String(currentUser.id) === String(ownerId)
  )
}

function buildCommentListUrl(
  targetType,
  targetId,
  page,
  sort
) {
  const sortValue =
    sort === 'all' ? 'newest' : sort

  if (targetType === 'episode') {
    return `${API_BASE_URL}/api/comments/episode/${encodeURIComponent(
      targetId
    )}?page=${page}&limit=${COMMENT_PAGE_SIZE}&sort=${sortValue}`
  }

  if (targetType === 'author_post') {
    return `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
      targetId
    )}/comments?page=${page}&limit=${COMMENT_PAGE_SIZE}&reply_limit=${REPLY_PAGE_SIZE}`
  }

  return `${API_BASE_URL}/api/comments/story/${encodeURIComponent(
    targetId
  )}?page=${page}&limit=${COMMENT_PAGE_SIZE}&sort=${sortValue}`
}

function buildReplyListUrl(
  targetType,
  targetId,
  commentId,
  page
) {
  if (targetType !== 'author_post') return ''

  return `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
    targetId
  )}/comments/${encodeURIComponent(
    commentId
  )}/replies?page=${page}&limit=${REPLY_PAGE_SIZE}`
}

function buildCommentCreateUrl(
  targetType,
  targetId
) {
  if (targetType === 'episode') {
    return `${API_BASE_URL}/api/comments/episode/${encodeURIComponent(
      targetId
    )}`
  }

  if (targetType === 'author_post') {
    return `${API_BASE_URL}/api/authors/me/posts/${encodeURIComponent(
      targetId
    )}/comments`
  }

  return `${API_BASE_URL}/api/comments/story/${encodeURIComponent(
    targetId
  )}`
}

function buildCommentEditUrl(
  targetType,
  commentId
) {
  if (targetType === 'author_post') {
    return `${API_BASE_URL}/api/authors/me/post-comments/${encodeURIComponent(
      commentId
    )}`
  }

  return `${API_BASE_URL}/api/comments/${encodeURIComponent(
    commentId
  )}`
}

function buildCommentDeleteUrl(commentId) {
  return `${API_BASE_URL}/api/authors/me/post-comments/${encodeURIComponent(
    commentId
  )}`
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(getDisplayLanguageId() || 'en')
}

function formatTime(value) {
  const justNow = getDisplayText('commentSection.justNow')
  if (!value) return justNow
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return justNow
  const difference = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = minute * 60
  const day = hour * 24
  if (difference < minute) return justNow
  if (difference < hour) return getDisplayText('commentSection.minutesAgo', { count: Math.floor(difference / minute) })
  if (difference < day) return getDisplayText('commentSection.hoursAgo', { count: Math.floor(difference / hour) })
  return date.toLocaleDateString(getDisplayLanguageId() || 'en')
}

function normalizeApiComment(comment) {
  const user = comment?.user || {}

  return {
    id: comment?.id,
    story_id: comment?.story_id,
    episode_id:
      comment?.episode_id || null,
    post_id: comment?.post_id || null,
    user_id:
      comment?.user_id || user.id,
    parent_id:
      comment?.parent_id || null,
    text: comment?.text || '',
    is_deleted: Boolean(
      comment?.is_deleted
    ),
    type: comment?.type || 'text',
       likes: Number(comment?.likes || 0),
    liked: Boolean(comment?.liked),
    reaction_type:
      comment?.reaction_type || null,
    is_pinned: Boolean(
      comment?.is_pinned
    ),
    is_hidden: Boolean(
      comment?.is_hidden
    ),
    is_spoiler: Boolean(
      comment?.is_spoiler
    ),
    created_at: comment?.created_at,
    updated_at: comment?.updated_at,
    name:
      user.name ||
      comment?.name ||
      user.username ||
      getDisplayText('commentSection.reader'),
    avatar_url:
      user.avatar_url ||
      comment?.avatar_url ||
      '',
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
    replies: Array.isArray(
      comment?.replies
    )
      ? comment.replies.map(
          normalizeApiComment
        )
      : [],
  }
}

function mergeFocusedAuthorPostComment(
  comments,
  focusComment,
  focusParentComment
) {
  if (!focusComment?.id) {
    return comments
  }

  const target =
    normalizeApiComment(focusComment)

  const parent = focusParentComment?.id
    ? normalizeApiComment(
        focusParentComment
      )
    : null

  const rootById = new Map()
  const rootOrder = []

  for (const item of comments) {
    if (!item?.id) continue

    const key = String(item.id)

    if (!rootById.has(key)) {
      rootOrder.push(key)
      rootById.set(key, item)
      continue
    }

    const previous = rootById.get(key)
    const replyById = new Map()

    for (const reply of [
      ...(previous.replies || []),
      ...(item.replies || []),
    ]) {
      if (!reply?.id) continue
      replyById.set(
        String(reply.id),
        reply
      )
    }

    const replies = [
      ...replyById.values(),
    ].sort(
      (first, second) =>
        new Date(
          first.created_at || 0
        ).getTime() -
        new Date(
          second.created_at || 0
        ).getTime()
    )

    rootById.set(key, {
      ...previous,
      ...item,
      replies,
      reply_total: Math.max(
        Number(
          previous.reply_total || 0
        ),
        Number(item.reply_total || 0),
        replies.length
      ),
      reply_page: Math.max(
        Number(previous.reply_page || 1),
        Number(item.reply_page || 1)
      ),
    })
  }

  let merged = rootOrder.map(
    (key) => rootById.get(key)
  )

  if (parent && target.parent_id) {
    const parentId = String(parent.id)
    const parentIndex =
      merged.findIndex(
        (item) =>
          String(item.id) === parentId
      )

    if (parentIndex >= 0) {
      const current =
        merged[parentIndex]
      const replyById = new Map(
        (current.replies || []).map(
          (reply) => [
            String(reply.id),
            reply,
          ]
        )
      )

      replyById.set(
        String(target.id),
        target
      )

      const replies = [
        ...replyById.values(),
      ].sort(
        (first, second) =>
          new Date(
            first.created_at || 0
          ).getTime() -
          new Date(
            second.created_at || 0
          ).getTime()
      )

      merged[parentIndex] = {
        ...current,
        replies,
        reply_total: Math.max(
          Number(
            current.reply_total || 0
          ),
          replies.length
        ),
      }

      return merged
    }

   return [
  {
    ...parent,
    replies: [target],
    reply_total: Math.max(
      Number(parent.reply_total || 0),
      1
    ),
  },
  ...merged,
]
}

const targetIndex =
  merged.findIndex(
      (item) =>
        String(item.id) ===
        String(target.id)
    )

  if (targetIndex >= 0) {
    return merged
  }

  return [target, ...merged]
}

function countCommentTree(comments = []) {
  return comments.reduce(
    (total, comment) =>
      total +
      1 +
      countCommentTree(
        comment.replies || []
      ),
    0
  )
}

function updateCommentTree(
  comments,
  commentId,
  changes
) {
  return comments.map((comment) => {
    if (
      String(comment.id) ===
      String(commentId)
    ) {
      return {
        ...comment,
        ...changes,
      }
    }

    return {
      ...comment,
      replies: updateCommentTree(
        comment.replies || [],
        commentId,
        changes
      ),
    }
  })
}

function removeCommentTree(
  comments,
  commentId
) {
  return comments
    .filter(
      (comment) =>
        String(comment.id) !==
        String(commentId)
    )
    .map((comment) => ({
      ...comment,
      replies: removeCommentTree(
        comment.replies || [],
        commentId
      ),
    }))
}

function applyDeletedCommentTree(
  comments,
  commentId
) {
  return comments.flatMap((comment) => {
    const replies = Array.isArray(
      comment.replies
    )
      ? comment.replies
      : []

    if (
      String(comment.id) ===
      String(commentId)
    ) {
      if (!replies.length) {
        return []
      }

      return [
        {
          ...comment,
          user_id: null,
          text: getDisplayText('commentSection.commentDeleted'),
          is_deleted: true,
          is_pinned: false,
          is_hidden: false,
          is_spoiler: false,
          likes: 0,
          liked: false,
          reaction_type: null,
          name: getDisplayText('commentSection.reader'),
          avatar_url: '',
          replies,
        },
      ]
    }

    return [
      {
        ...comment,
        replies: applyDeletedCommentTree(
          replies,
          commentId
        ),
      },
    ]
  })
}

function Avatar({
  user,
  size = 'h-10 w-10',
  textSize = 'text-[13px]',
}) {
  const avatar = user?.avatar_url || ''
  const name = user?.name || getDisplayText('commentSection.reader')

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] ${textSize} font-semibold text-[var(--shadow-text-primary)]`}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}

function EmptyComments({ onFocus }) {
  const { t } = useDisplayTranslation()
  return (
    <div className="px-5 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
        <i className="fa-regular fa-comments text-[22px]" />
      </div>

      <h3 className="mt-4 text-[17px] font-semibold text-[var(--shadow-text-primary)]">
        {t('commentSection.noCommentsYet')}
      </h3>

      <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
        {t('commentSection.noCommentsDesc')}
      </p>

      <button
        type="button"
        onClick={onFocus}
        className="mt-5 h-11 rounded-full bg-[var(--shadow-text-primary)] px-5 text-[13px] font-normal text-[var(--shadow-bg-surface)] active:scale-95"
      >
        {t('commentSection.writeCommentAction')}
      </button>
    </div>
  )
}

function MenuButton({
  icon,
  label,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 w-full items-center gap-3 rounded-[14px] px-4 py-3 text-left transition-colors active:bg-[var(--shadow-bg-soft)] ${
        danger
          ? 'text-[#dc2626]'
          : 'text-[var(--shadow-text-primary)]'
      }`}
    >
      <i
        className={`${icon} w-5 shrink-0 text-center text-[17px] ${
          danger
            ? 'text-[#dc2626]'
            : 'text-[var(--shadow-text-secondary)]'
        }`}
      />
      <span className="text-[15px] font-normal">
        {label}
      </span>
    </button>
  )
}

function CommentMenu({
  isOpen,
  allowReply = true,
  targetType,
  permissions,
  comment,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onUnhide,
  onPin,
  onUnpin,
  onSpoiler,
  onUnspoiler,
  onBan,
  onReport,
  onClose,
}) {
  const { t } = useDisplayTranslation()
  if (!isOpen) return null

  const isAuthorPost =
    targetType === 'author_post'
  const ownsComment = Boolean(
    permissions.ownsComment
  )

  const runAction = (action) => {
    onClose()
    action?.()
  }

  return (
    <div className="fixed inset-0 z-[260] flex items-end justify-center">
      <button
        type="button"
        aria-label="Close comment options"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <section className="relative w-full max-w-3xl rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-2 pb-[max(18px,env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:mb-4 sm:rounded-[28px]">
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-[#d1d5db]" />

        {allowReply ? (
          <MenuButton
            icon="fa-regular fa-comment"
            label={t('commentSection.reply')}
            onClick={() =>
              runAction(onReply)
            }
          />
        ) : null}

        <MenuButton
          icon="fa-regular fa-copy"
          label={t('commentSection.copy')}
          onClick={() =>
            runAction(onCopy)
          }
        />

        {ownsComment ? (
          <>
            <MenuButton
              icon="fa-regular fa-trash-can"
              label={t('commentSection.delete')}
              danger
              onClick={() =>
                runAction(onDelete)
              }
            />

            <MenuButton
              icon="fa-regular fa-pen-to-square"
              label={t('commentSection.edit')}
              onClick={() =>
                runAction(onEdit)
              }
            />
          </>
        ) : null}

        {!ownsComment &&
        permissions.isOtherReader ? (
          <>
            <MenuButton
              icon="fa-regular fa-flag"
              label={t('commentSection.reportComment')}
              onClick={() =>
                runAction(onReport)
              }
            />

            <MenuButton
              icon="fa-regular fa-eye-slash"
              label={t('commentSection.hideThisComment')}
              onClick={() =>
                runAction(onHide)
              }
            />
          </>
        ) : null}

       {!ownsComment &&
permissions.isAuthor ? (
  <>
    <MenuButton
      icon="fa-regular fa-trash-can"
      label={t('commentSection.delete')}
      danger
      onClick={() =>
        runAction(onDelete)
      }
    />

    {isAuthorPost ? (
      <MenuButton
        icon={
          comment.is_hidden
            ? 'fa-regular fa-eye'
            : 'fa-regular fa-eye-slash'
        }
        label={
          comment.is_hidden
            ? t('commentSection.unhide')
            : t('commentSection.hideComment')
        }
        onClick={() =>
          runAction(
            comment.is_hidden
              ? onUnhide
              : onHide
          )
        }
      />
    ) : (
      <>
        <MenuButton
          icon="fa-solid fa-thumbtack"
          label={
            comment.is_pinned
              ? t('commentSection.unpinComment')
              : t('commentSection.pinComment')
          }
          onClick={() =>
            runAction(
              comment.is_pinned
                ? onUnpin
                : onPin
            )
          }
        />

        <MenuButton
          icon="fa-regular fa-eye-slash"
          label={t('commentSection.hideComment')}
          onClick={() =>
            runAction(onHide)
          }
        />

        <MenuButton
          icon="fa-solid fa-ban"
          label={t('commentSection.banUser')}
          danger
          onClick={() =>
            runAction(onBan)
          }
        />

        <MenuButton
          icon={
            comment.is_spoiler
              ? 'fa-regular fa-eye'
              : 'fa-solid fa-triangle-exclamation'
          }
          label={
            comment.is_spoiler
              ? t('commentSection.removeSpoilerMark')
              : t('commentSection.spoilerMark')
          }
          onClick={() =>
            runAction(
              comment.is_spoiler
                ? onUnspoiler
                : onSpoiler
            )
          }
        />
      </>
    )}
  </>
) : null}

        {!ownsComment &&
        !isAuthorPost &&
        permissions.isAdmin ? (
          <>
            <MenuButton
              icon="fa-regular fa-trash-can"
              label={t('commentSection.delete')}
              danger
              onClick={() =>
                runAction(onDelete)
              }
            />

            <MenuButton
              icon={
                comment.is_hidden
                  ? 'fa-regular fa-eye'
                  : 'fa-regular fa-eye-slash'
              }
              label={
                comment.is_hidden
                  ? t('commentSection.unhide')
                  : t('commentSection.hide')
              }
              onClick={() =>
                runAction(
                  comment.is_hidden
                    ? onUnhide
                    : onHide
                )
              }
            />

            <MenuButton
              icon="fa-solid fa-ban"
              label={t('commentSection.banUser')}
              danger
              onClick={() =>
                runAction(onBan)
              }
            />
          </>
        ) : null}
      </section>
    </div>
  )
}


function getCommentDisplayUser(comment, story) {
  const pageOwnerId = getStoryOwnerId(story)
  const isPageOwner = Boolean(
    pageOwnerId &&
      comment?.user_id &&
      String(pageOwnerId) ===
        String(comment.user_id)
  )

  if (isPageOwner) {
    return {
      name:
        story?.author_page?.page_name ||
        comment?.name ||
        getDisplayText('commentSection.author'),
      avatar_url:
        story?.author_page?.avatar_url ||
        comment?.avatar_url ||
        '',
    }
  }

  return {
    name: comment?.name || getDisplayText('commentSection.reader'),
    avatar_url:
      comment?.avatar_url || '',
  }
}

function getReplyComposerUser(story) {
  const currentUser = getCurrentUser()
  const pageOwnerId = getStoryOwnerId(story)
  const isPageOwner = Boolean(
    currentUser?.id &&
      pageOwnerId &&
      String(currentUser.id) ===
        String(pageOwnerId)
  )

  if (!isPageOwner) {
    return currentUser
  }

  return {
    ...currentUser,
    name:
      story?.author_page?.page_name ||
      currentUser.name ||
      getDisplayText('commentSection.author'),
    avatar_url:
      story?.author_page?.avatar_url ||
      currentUser.avatar_url ||
      '',
  }
}

function renderReplyTextWithMention(
  text,
  mentionCandidates = []
) {
  const value = String(text || '')
  const names = [
    ...new Set(
      mentionCandidates
        .map((name) =>
          String(name || '').trim()
        )
        .filter(Boolean)
    ),
  ].sort(
    (first, second) =>
      second.length - first.length
  )

  for (const name of names) {
    const prefix = `@${name}`

    if (
      value === prefix ||
      value.startsWith(`${prefix} `)
    ) {
      const rest = value
        .slice(prefix.length)
        .trimStart()

      return (
        <>
          <span className="font-semibold text-[#1877f2]">
            {name}
          </span>
          {rest ? <> {rest}</> : null}
        </>
      )
    }
  }

  return value
}


function ReplyItem({
  reply,
  story,
  targetType,
  mentionCandidates,
  onLike,
  onStartReply,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onUnhide,
  onPin,
  onUnpin,
  onSpoiler,
  onUnspoiler,
  onBan,
  onReport,
}) {
  const { t } = useDisplayTranslation()
  const [menuOpen, setMenuOpen] =
    useState(false)
  const currentUser = getCurrentUser()
  const displayUser =
    getCommentDisplayUser(reply, story)
  const ownsReply = Boolean(
    reply.user_id &&
      currentUser.id &&
      String(reply.user_id) ===
        String(currentUser.id)
  )
  const author = isStoryAuthor(
    currentUser,
    story
  )
  const admin = currentUser.is_admin
  const permissions = {
    ownsComment: ownsReply,
    isOwner: ownsReply && !admin,
    isOtherReader:
      !ownsReply && !author && !admin,
    isAuthor: author && !admin,
    isAdmin: admin,
  }

  const startReply = () => {
    onStartReply?.(displayUser.name)
  }

  return (
  <div
    id={`comment-${reply.id}`}
    className="flex gap-2"
  >
      <Avatar
        user={displayUser}
        size="h-8 w-8"
        textSize="text-[11px]"
      />

      <div className="relative min-w-0 flex-1 pr-8">
        <button
          type="button"
          onClick={() =>
            setMenuOpen(true)
          }
          className="inline-block max-w-full rounded-[16px] bg-[var(--shadow-bg-soft)] px-3 py-2 text-left active:bg-[var(--shadow-bg-hover)]"
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">
              {displayUser.name}
            </span>

            <span className="text-[10px] font-normal text-[var(--shadow-text-tertiary)]">
              {formatTime(
                reply.created_at
              )}
            </span>
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
            {renderReplyTextWithMention(
              reply.text,
              mentionCandidates
            )}
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            setMenuOpen(true)
          }
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-[var(--shadow-text-tertiary)] active:scale-95"
          aria-label="Reply options"
        >
          <i className="fa-solid fa-ellipsis text-[13px]" />
        </button>

        <div className="mt-1 flex items-center gap-4 pl-3 text-[11.5px] font-normal text-[var(--shadow-text-tertiary)]">
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
            onReact={(reactionType) =>
              onLike(
                reply.id,
                reactionType
              )
            }
            idleLabel={t('commentSection.like')}
            buttonClassName="text-[11.5px] font-normal"
            countClassName="text-[11.5px] font-normal"
            pickerAlign="left"
          />

          <button
            type="button"
            onClick={startReply}
          >
            {t('commentSection.reply')}
          </button>
        </div>

        <CommentMenu
          isOpen={menuOpen}
          allowReply
          targetType={targetType}
          permissions={permissions}
          comment={reply}
          onReply={startReply}
          onCopy={() => onCopy(reply)}
          onEdit={() => onEdit(reply)}
          onDelete={() =>
            onDelete(reply)
          }
          onHide={() => onHide(reply)}
          onUnhide={() =>
            onUnhide(reply)
          }
          onPin={() => onPin(reply)}
          onUnpin={() =>
            onUnpin(reply)
          }
          onSpoiler={() =>
            onSpoiler(reply)
          }
          onUnspoiler={() =>
            onUnspoiler(reply)
          }
          onBan={() => onBan(reply)}
          onReport={() =>
            onReport(reply)
          }
          onClose={() =>
            setMenuOpen(false)
          }
        />
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  story,
  targetType,
  focusCommentId = '',
  onLike,
  onStartReply,
  onLoadMoreReplies,
  loadingReplies,
  onCopy,
  onEdit,
  onDelete,
  onHide,
  onUnhide,
  onPin,
  onUnpin,
  onSpoiler,
  onUnspoiler,
  onBan,
  onReport,
}) {
  const { t } = useDisplayTranslation()
  const [menuOpen, setMenuOpen] =
    useState(false)
  const focusedReplyPresent =
  Array.isArray(comment?.replies) &&
  comment.replies.some(
    (reply) =>
      String(reply.id) ===
      String(focusCommentId)
  )

const [repliesShown, setRepliesShown] =
  useState(focusedReplyPresent)
  useEffect(() => {
  if (focusedReplyPresent) {
    setRepliesShown(true)
  }
}, [focusedReplyPresent])
  const [spoilerOpen, setSpoilerOpen] =
    useState(false)
  const menuPressTimerRef = useRef(null)
  const ignoreNextTapRef = useRef(false)

  const replies = Array.isArray(
    comment.replies
  )
    ? comment.replies
    : []
  const replyTotal = Math.max(
    replies.length,
    Number(comment.reply_total || 0)
  )
  const currentUser = getCurrentUser()
  const displayUser =
    getCommentDisplayUser(
      comment,
      story
    )
  const displayName = displayUser.name
  const displayAvatar =
    displayUser.avatar_url
  const mentionCandidates = [
    displayName,
    ...replies.map(
      (reply) =>
        getCommentDisplayUser(
          reply,
          story
        ).name
    ),
  ]

  const isOwner =
    comment.user_id &&
    currentUser.id &&
    String(comment.user_id) ===
      String(currentUser.id)

  const author = isStoryAuthor(
    currentUser,
    story
  )
  const admin = currentUser.is_admin

  const permissions = {
    ownsComment: Boolean(isOwner),
    isOwner: isOwner && !admin,
    isOtherReader:
      !isOwner && !author && !admin,
    isAuthor: author && !admin,
    isAdmin: admin,
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(
        menuPressTimerRef.current
      )
    }
  }, [])

  const clearMenuPress = () => {
    window.clearTimeout(
      menuPressTimerRef.current
    )
    menuPressTimerRef.current = null
  }

  const handleMenuPressStart = (
    event
  ) => {
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    clearMenuPress()

    menuPressTimerRef.current =
      window.setTimeout(() => {
        ignoreNextTapRef.current = true
        setMenuOpen(true)
      }, 420)
  }

  const handleCommentTap = () => {
    clearMenuPress()

    if (ignoreNextTapRef.current) {
      ignoreNextTapRef.current = false
      return
    }

    setMenuOpen(true)
  }

  const openReplyComposer = (
    name
  ) => {
    setRepliesShown(true)
    onStartReply?.(
      comment.id,
      String(name || displayName).trim()
    )
  }

  if (comment.is_deleted) {
    return (
      <article
        className="px-4 py-4"
        id={`comment-${comment.id}`}
      >
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
            <i className="fa-regular fa-comment-dots text-[15px]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex min-h-12 items-center rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3">
              <span className="text-[13px] italic text-[var(--shadow-text-tertiary)]">
                {t('commentSection.commentDeleted')}
              </span>
            </div>

            {replies.length ? (
              <button
                type="button"
                onClick={() =>
                  setRepliesShown(
                    (value) => !value
                  )
                }
                className="mt-2 block pl-3 text-[12px] text-[var(--shadow-text-secondary)]"
              >
                {repliesShown ? t('commentSection.hideReplies') : (replyTotal  > 1 ? t('commentSection.viewReplies', { count: replyTotal }) : t('commentSection.viewReply', { count: replyTotal }))}
              </button>
            ) : null}

            {repliesShown &&
            replies.length ? (
              <div className="mt-3 space-y-3 border-l-2 border-[var(--shadow-border)] pl-3">
                {replies.map((reply) => (
                  <ReplyItem
                    key={reply.id}
                    reply={reply}
                    story={story}
                    targetType={
                      targetType
                    }
                    mentionCandidates={
                      mentionCandidates
                    }
                    onLike={onLike}
                    onStartReply={
                      openReplyComposer
                    }
                    onCopy={onCopy}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onHide={onHide}
                    onUnhide={
                      onUnhide
                    }
                    onPin={onPin}
                    onUnpin={onUnpin}
                    onSpoiler={
                      onSpoiler
                    }
                    onUnspoiler={
                      onUnspoiler
                    }
                    onBan={onBan}
                    onReport={onReport}
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
                    className="ml-1 text-[12px] font-medium text-[var(--shadow-text-secondary)] disabled:text-[var(--shadow-text-tertiary)]"
                  >
                    {loadingReplies
                      ? t('commentSection.loading')
                      : t('commentSection.viewMoreReplies')}
                  </button>
                ) : null}
              </div>
            ) : null}

            
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`px-4 py-4 ${
        comment.is_hidden
          ? 'opacity-60'
          : ''
      }`}
      id={`comment-${comment.id}`}
    >
      <div className="flex gap-3">
        <Avatar
          user={{
            name: displayName,
            avatar_url: displayAvatar,
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="relative pr-8">
            <div
              role="button"
              tabIndex={0}
              onPointerDown={
                handleMenuPressStart
              }
              onPointerUp={clearMenuPress}
              onPointerCancel={
                clearMenuPress
              }
              onPointerLeave={
                clearMenuPress
              }
              onClick={handleCommentTap}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault()
                  setMenuOpen(true)
                }
              }}
              onContextMenu={(event) => {
                event.preventDefault()
                clearMenuPress()
                setMenuOpen(true)
              }}
              className="inline-block max-w-full cursor-pointer select-none rounded-[18px] bg-[var(--shadow-bg-soft)] px-4 py-3 outline-none active:bg-[var(--shadow-bg-hover)]"
              style={{
                touchAction:
                  'manipulation',
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">
                  {displayName}
                </span>

                <span className="text-[11px] font-normal text-[var(--shadow-text-tertiary)]">
                  {formatTime(
                    comment.created_at
                  )}
                </span>

                {comment.is_pinned ? (
                  <span className="rounded-full bg-[#fff7d6] dark:bg-[#b7791f]/15 px-2 py-0.5 text-[10px] font-normal text-[#b7791f]">
                    {t('commentSection.pinned')}
                  </span>
                ) : null}

                {comment.is_hidden ? (
                  <span className="rounded-full bg-[#eef2ff] dark:bg-[#4f46e5]/15 px-2 py-0.5 text-[10px] font-normal text-[#4f46e5]">
                    {t('commentSection.hidden')}
                  </span>
                ) : null}
              </div>

              {comment.is_spoiler &&
              !spoilerOpen ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setSpoilerOpen(true)
                  }}
                  className="mt-2 rounded-[14px] bg-[var(--shadow-bg-surface)] px-3 py-2 text-left text-[12px] font-normal text-[var(--shadow-text-secondary)]"
                >
                  {t('commentSection.spoilerReveal')}
                </button>
              ) : comment.type ===
                'sticker' ? (
                <div className="mt-2 inline-flex h-20 w-20 items-center justify-center rounded-[18px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-tertiary)]">
                  <i className="fa-regular fa-face-smile text-[30px]" />
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap break-words text-[13.5px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
                  {comment.text}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setMenuOpen(true)
              }
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-[var(--shadow-text-tertiary)] active:scale-95"
              aria-label="Comment options"
            >
              <i className="fa-solid fa-ellipsis text-[14px]" />
            </button>

            <CommentMenu
              isOpen={menuOpen}
              targetType={targetType}
              permissions={permissions}
              comment={comment}
              onReply={() =>
                openReplyComposer(
                  displayName
                )
              }
              onCopy={() =>
                onCopy(comment)
              }
              onEdit={() =>
                onEdit(comment)
              }
              onDelete={() =>
                onDelete(comment)
              }
              onHide={() =>
                onHide(comment)
              }
              onUnhide={() =>
                onUnhide(comment)
              }
              onPin={() =>
                onPin(comment)
              }
              onUnpin={() =>
                onUnpin(comment)
              }
              onSpoiler={() =>
                onSpoiler(comment)
              }
              onUnspoiler={() =>
                onUnspoiler(comment)
              }
              onBan={() =>
                onBan(comment)
              }
              onReport={() =>
                onReport(comment)
              }
              onClose={() =>
                setMenuOpen(false)
              }
            />
          </div>

          <div className="mt-1 flex items-center gap-4 pl-3 text-[12px] font-normal text-[var(--shadow-text-tertiary)]">
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
              onReact={(reactionType) =>
                onLike(
                  comment.id,
                  reactionType
                )
              }
              idleLabel={t('commentSection.like')}
              buttonClassName="text-[12px] font-normal"
              countClassName="text-[12px] font-normal"
              pickerAlign="left"
            />

            <button
              type="button"
              onClick={() =>
                openReplyComposer(
                  displayName
                )
              }
            >
              {t('commentSection.reply')}
            </button>

            {replies.length ? (
              <button
                type="button"
                onClick={() =>
                  setRepliesShown(
                    (value) => !value
                  )
                }
              >
                {repliesShown ? t('commentSection.hideReplies') : (replyTotal  > 1 ? t('commentSection.viewReplies', { count: 
                      replyTotal
                     }) : t('commentSection.viewReply', { count: 
                      replyTotal
                     }))}
              </button>
            ) : null}
          </div>

          {repliesShown &&
          replies.length ? (
            <div className="mt-3 space-y-3 border-l-2 border-[var(--shadow-border)] pl-3">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  story={story}
                  targetType={
                    targetType
                  }
                  mentionCandidates={
                    mentionCandidates
                  }
                  onLike={onLike}
                  onStartReply={
                    openReplyComposer
                  }
                  onCopy={onCopy}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onHide={onHide}
                  onUnhide={onUnhide}
                  onPin={onPin}
                  onUnpin={onUnpin}
                  onSpoiler={onSpoiler}
                  onUnspoiler={
                    onUnspoiler
                  }
                  onBan={onBan}
                  onReport={onReport}
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
                  className="ml-1 text-[12px] font-medium text-[var(--shadow-text-secondary)] disabled:text-[var(--shadow-text-tertiary)]"
                >
                  {loadingReplies
                    ? t('commentSection.loading')
                    : t('commentSection.viewMoreReplies')}
                </button>
              ) : null}
            </div>
          ) : null}

          
        </div>
      </div>
    </article>
  )
}

function CommentComposer({
  value,
  onChange,
  onSend,
  onCancelReply,
  replyTarget,
  isModal,
  isBanned,
  sending,
}) {
  const { t } = useDisplayTranslation()
  const [focused, setFocused] =
    useState(false)
  const textareaRef = useRef(null)
  const showSend =
    focused || Boolean(value.trim())
  const replyTargetName = String(
  replyTarget?.name || ''
).trim()

  const composerMaxLength = replyTarget
  ? Math.max(
      1,
      COMMENT_LIMIT -
        (replyTargetName
          ? replyTargetName.length + 2
          : 0)
    )
  : COMMENT_LIMIT

  useEffect(() => {
    const textarea =
      textareaRef.current

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      118
    )}px`
    textarea.scrollTop =
      textarea.scrollHeight
  }, [value])

  return (
    <div
      className={`${
        isModal
          ? 'shrink-0'
          : 'fixed bottom-0 left-0 right-0'
      } z-50 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3`}
    >

      {replyTarget ? (
  <div className="mx-auto mb-2 flex max-w-3xl items-center gap-1 px-1 text-[12px] text-[var(--shadow-text-secondary)]">
    <span>{t('commentSection.replyingTo', { name: replyTargetName || getDisplayText('commentSection.reader') })}</span>
    <span>·</span>
    <button
      type="button"
      onClick={onCancelReply}
      className="font-medium text-[#1877f2]"
    >
      {t('commentSection.cancel')}
    </button>
  </div>
) : null}
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-[22px] bg-[var(--shadow-bg-soft)] px-4 py-2">
          <textarea
            ref={textareaRef}
            id="shadow-comment-input"
            value={value}
            maxLength={composerMaxLength}
            onChange={(event) =>
              onChange(event.target.value)
            }
            onInput={(event) => {
              const textarea = event.currentTarget
              textarea.style.height = 'auto'
              textarea.style.height = `${Math.min(
                textarea.scrollHeight,
                118
              )}px`
            }}
            onFocus={() =>
              setFocused(true)
            }
            onBlur={() =>
              setFocused(false)
            }
            disabled={
              isBanned || sending
            }
            rows={1}
            placeholder={
              isBanned
                ? t('commentSection.cannotComment')
                : replyTarget
  ? t('commentSection.writeReply')
   : t('commentSection.writeComment')
            }
            className="max-h-[118px] min-h-[24px] w-full resize-none overflow-y-auto bg-transparent text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-text-tertiary)] disabled:cursor-not-allowed"
          />
        </div>

        {showSend ? (
          <button
            type="button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={onSend}
            disabled={
              !value.trim() ||
              isBanned ||
              sending
            }
            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] active:scale-95 disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
            aria-label={
  replyTarget
    ? t('commentSection.sendReply')
    : t('commentSection.sendComment')
}
          >
            <i
              className={`fa-solid ${
                sending
                  ? 'fa-spinner animate-spin'
                  : 'fa-paper-plane'
              } text-[13px]`}
            />
          </button>
        ) : null}
      </div>
    </div>
  )
}

function EditCommentSheet({
  comment,
  value,
  onChange,
  onCancel,
  onSave,
  saving,
}) {
  const { t } = useDisplayTranslation()
  if (!comment) return null

  return (
    <div className="fixed inset-0 z-[290] flex items-end justify-center bg-black/40">
      <button
        type="button"
        onClick={onCancel}
        className="absolute inset-0"
        aria-label="Close edit comment"
      />

      <section className="relative w-full max-w-3xl rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:mb-4 sm:rounded-[28px]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)]" />

        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-normal text-[var(--shadow-text-primary)]">
            {t('commentSection.editComment')}
          </h3>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-secondary)] transition-colors active:bg-[var(--shadow-bg-soft)]"
            aria-label="Close edit comment"
          >
            <i className="fa-solid fa-xmark text-[16px]" />
          </button>
        </div>

        <textarea
          value={value}
          maxLength={composerMaxLength}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={5}
          autoFocus
          className="mt-4 min-h-[150px] w-full resize-none rounded-[18px] bg-[var(--shadow-input-bg)] px-4 py-3 text-[14px] font-normal leading-6 text-[var(--shadow-text-primary)] outline-none ring-1 ring-transparent transition focus:bg-[var(--shadow-bg-surface)] focus:ring-[var(--shadow-border-strong)]"
        />

        <button
          type="button"
          onClick={onSave}
          disabled={
            !value.trim() || saving
          }
          className="mt-4 h-11 w-full rounded-full bg-[var(--shadow-text-primary)] text-[14px] font-normal text-[var(--shadow-bg-surface)] transition active:scale-[0.99] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
        >
          {saving
            ? t('commentSection.saving')
            : t('commentSection.saveComment')}
        </button>
      </section>
    </div>
  )
}

function SortSheet({
  open,
  value,
  onChoose,
  onClose,
}) {
  const { t } = useDisplayTranslation()
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    lastY: 0,
    startTime: 0,
  })
  const [dragOffset, setDragOffset] =
    useState(0)
  const [dragging, setDragging] =
    useState(false)

  if (!open) return null

  const resetDrag = () => {
    dragRef.current = {
      active: false,
      pointerId: null,
      startY: 0,
      lastY: 0,
      startTime: 0,
    }
    setDragging(false)
    setDragOffset(0)
  }

  const startDrag = (event) => {
    if (!event.isPrimary) return
    if (
      event.pointerType === 'mouse' &&
      event.button !== 0
    ) {
      return
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startTime: performance.now(),
    }
    setDragging(true)
    event.currentTarget.setPointerCapture?.(
      event.pointerId
    )
  }

  const moveDrag = (event) => {
    const drag = dragRef.current

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    drag.lastY = event.clientY
    setDragOffset(
      Math.min(
        Math.max(
          0,
          event.clientY - drag.startY
        ),
        window.innerHeight * 0.45
      )
    )
  }

  const endDrag = (event) => {
    const drag = dragRef.current

    if (
      !drag.active ||
      drag.pointerId !== event.pointerId
    ) {
      return
    }

    const distance = Math.max(
      0,
      event.clientY - drag.startY
    )
    const elapsed = Math.max(
      1,
      performance.now() -
        drag.startTime
    )
    const velocity =
      distance / elapsed

    resetDrag()

    if (
      distance >= 60 ||
      (distance >= 24 &&
        velocity >= 0.55)
    ) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[240] flex items-end justify-center bg-black/35">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close comment filter"
      />

      <section
        className="relative w-full max-w-3xl rounded-t-[28px] bg-[var(--shadow-bg-surface)] px-5 pb-5 pt-4 shadow-2xl sm:mb-4 sm:rounded-[28px]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <div
          role="presentation"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={resetDrag}
          onLostPointerCapture={
            resetDrag
          }
          className="-mx-5 -mt-4 flex h-14 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-[var(--shadow-bg-soft)]" />
        </div>

        <div className="space-y-1">
          {COMMENT_SORT_OPTIONS.map(
            (option) => {
              const active =
                value === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onChoose(
                      option.value
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left active:bg-[var(--shadow-bg-hover)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-normal text-[var(--shadow-text-primary)]">
                      {t(`commentSection.${option.labelKey}`)}
                    </span>

                    <span className="mt-0.5 block text-[13px] font-normal leading-5 text-[var(--shadow-text-secondary)]">
                      {
                        t(`commentSection.${option.descriptionKey}`)
                      }
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
            }
          )}
        </div>
      </section>
    </div>
  )
}

export default function CommentSection({
  targetType = 'story',
  targetId,
  story,
  variant = 'page',
  onCommentsChange,
  focusComment = null,
  focusParentComment = null,
  focusCommentId = '',
  episodeOptions = [],
  selectedEpisodeId,
  onEpisodeChange,
  onCommentTotalChange,
}) {
  const { t } = useDisplayTranslation()
  const [sortMenuOpen, setSortMenuOpen] =
    useState(false)
  const [episodeMenuOpen, setEpisodeMenuOpen] =
    useState(false)
  const [comments, setComments] =
    useState([])
  const [sort, setSort] = useState('top')
  const [text, setText] = useState('')
const [replyText, setReplyText] =
  useState('')
const [replyTarget, setReplyTarget] =
  useState(null)
const [toast, setToast] = useState('')
  const [warningDialog, setWarningDialog] =
    useState(null)
  const [editComment, setEditComment] =
    useState(null)
  const [reportComment, setReportComment] =
    useState(null)
  const [editText, setEditText] =
    useState('')
  const [loading, setLoading] =
    useState(false)
  const [loadingMore, setLoadingMore] =
    useState(false)
  const [loadingRepliesId, setLoadingRepliesId] =
    useState(null)
  const [sending, setSending] =
    useState(false)
  const [saving, setSaving] =
    useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] =
    useState(false)
  const [totalComments, setTotalComments] =
    useState(0)

  const toastTimerRef = useRef(null)
  const isModal = variant === 'modal'
  const currentUser = useMemo(
    () => getCurrentUser(),
    []
  )
  const token = useMemo(
    () => getReaderToken(),
    []
  )

  const selectedSort =
    COMMENT_SORT_OPTIONS.find(
      (option) =>
        option.value === sort
    ) || COMMENT_SORT_OPTIONS[0]

  const selectedEpisode =
    episodeOptions.find(
      (item) =>
        String(
          item.id ||
            item.episode_id
        ) ===
        String(
          selectedEpisodeId ||
            targetId
        )
    )

  const canSwitchEpisode =
    targetType === 'episode' &&
    episodeOptions.length > 0

  const updateComments = (
    nextComments
  ) => {
    setComments(nextComments)
    onCommentsChange?.(nextComments)
  }

  const updateTotal = (value) => {
    const nextTotal = Math.max(
      0,
      Number(value || 0)
    )
    setTotalComments(nextTotal)
    onCommentTotalChange?.(
      nextTotal
    )
  }

  const showToast = (message) => {
    setToast(message)
    window.clearTimeout(
      toastTimerRef.current
    )
    toastTimerRef.current =
      window.setTimeout(
        () => setToast(''),
        1700
      )
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(
        toastTimerRef.current
      )
    }
  }, [])

  useEffect(() => {
  setReplyTarget(null)
  setReplyText('')
}, [targetType, targetId])

async function fetchComments(
  nextPage = 1,
  append = false
) {
    if (!targetId) return

    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const response = await fetch(
        buildCommentListUrl(
          targetType,
          targetId,
          nextPage,
          sort
        ),
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
            t('commentSection.failedLoadComments')
        )
      }

      const normalized =
        Array.isArray(data.comments)
          ? data.comments.map(
              normalizeApiComment
            )
          : []

      const baseComments = append
  ? [...comments, ...normalized]
  : normalized

const nextComments =
  targetType === 'author_post'
    ? mergeFocusedAuthorPostComment(
        baseComments,
        focusComment,
        focusParentComment
      )
    : baseComments

      setComments(nextComments)
      setPage(
        Number(data.page || nextPage)
      )
      setHasMore(
        Boolean(data.has_more)
      )
      const nextTotal = Number(
        data.total ??
          countCommentTree(
            nextComments
          )
      )
      updateTotal(nextTotal)
      onCommentsChange?.(
        nextComments
      )
    } catch (error) {
      showToast(
        error.message ||
          t('commentSection.failedLoadCommentsPeriod')
      )
    } finally {
      if (append) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
  setComments([])
  setPage(1)
  setHasMore(false)
  setTotalComments(0)
  fetchComments(1, false)
}, [
  targetId,
  sort,
  focusComment?.id,
  focusParentComment?.id,
])

  const isBanned = false

  const visibleComments = useMemo(() => {
  const author = isStoryAuthor(currentUser, story)
  const admin = currentUser.is_admin
  return comments.filter((comment) => {
    if (targetType === 'episode' && comment.is_deleted) return false
    if (!comment.is_hidden) return true
    const owner = comment.user_id && currentUser.id && String(comment.user_id) === String(currentUser.id)
    return owner || author || admin
  })
}, [comments, currentUser, story, targetType])

  const sortedComments = useMemo(
    () => [...visibleComments],
    [visibleComments]
  )

  const openCommentWarning = (
    data
  ) => {
    const matchedWords = Array.isArray(
      data.matched_words
    )
      ? data.matched_words
          .map((item) =>
            typeof item === 'string'
              ? item
              : item?.word
          )
          .filter(Boolean)
      : []

    setWarningDialog({
      title:
        data.code ===
        'READER_COMMENT_BLOCKED'
          ? t('commentSection.commentingRestricted')
          : t('commentSection.commentHidden'),
      message:
        data.message ||
        t('commentSection.commentCouldNotPost'),
      matchedWords,
      until:
        data.comment_block
          ?.expires_at || '',
    })
  }

  const isCommentWarning = (data) =>
    data?.code ===
      'AUTHOR_COMMENT_AUTO_HIDDEN' ||
    data?.code ===
      'COMMENT_AUTO_HIDDEN' ||
    data?.code ===
      'READER_COMMENT_BLOCKED'

  const handleStartReply = (
  commentId,
  name
) => {
  setReplyText('')
setReplyTarget({
  parentId: commentId,
  name: String(name || getDisplayText('commentSection.reader')).trim(),
})

  requestAnimationFrame(() => {
    document
      .getElementById('shadow-comment-input')
      ?.focus()
  })
}

  const handleSend = async () => {
   const activeText = replyTarget
  ? replyText
  : text

if (!activeText.trim() || sending) {
  return
}

if (!token) {
  showToast(
    replyTarget
      ? t('commentSection.pleaseLoginReply')
      : t('commentSection.pleaseLoginComment')
  )
  return
}

if (replyTarget) {
  try {
    setSending(true)

    const success = await handleReply(
      replyTarget.parentId,
      replyText.trim(),
      replyTarget.name
    )

    if (success) {
      setReplyText('')
      setReplyTarget(null)
    }
  } finally {
    setSending(false)
  }

  return
}

    try {
      setSending(true)

      const response = await fetch(
        buildCommentCreateUrl(
          targetType,
          targetId
        ),
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

      if (isCommentWarning(data)) {
        openCommentWarning(data)

        if (
          data.code !==
          'READER_COMMENT_BLOCKED'
        ) {
          setText('')
        }

        return
      }

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('commentSection.failedCreateComment')
        )
      }

      const newComment =
        normalizeApiComment(
          data.comment
        )
      const nextComments = [
        newComment,
        ...comments,
      ]

      updateComments(nextComments)
      updateTotal(
        data.comment_count ??
          totalComments + 1
      )
      setText('')
    } catch (error) {
      showToast(
        error.message ||
          t('commentSection.failedCreateCommentPeriod')
      )
    } finally {
      setSending(false)
    }
  }

  const handleLike = async (
    commentId,
    reactionType = 'love'
  ) => {
    if (!token) {
      showToast(
        t('commentSection.pleaseLoginReact')
      )
      return
    }

    const flattened = comments.flatMap(
      (comment) => [
        comment,
        ...(comment.replies || []),
      ]
    )

    const targetComment =
      flattened.find(
        (comment) =>
          String(comment.id) ===
          String(commentId)
      )

    if (!targetComment) return

    const nextReactionType = String(
      reactionType || 'love'
    )
      .trim()
      .toLowerCase()

    const currentReactionType =
      targetComment.reaction_type ||
      (targetComment.liked
        ? 'love'
        : null)

    const removing =
      currentReactionType ===
      nextReactionType

    const optimisticReactionType =
      removing
        ? null
        : nextReactionType

    const currentLikes = Number(
      targetComment.likes || 0
    )

    const optimisticLikes =
      !currentReactionType
        ? currentLikes + 1
        : removing
          ? Math.max(
              0,
              currentLikes - 1
            )
          : currentLikes

    const previous = {
      liked: targetComment.liked,
      likes: targetComment.likes,
      reaction_type:
        targetComment.reaction_type ||
        null,
    }

    updateComments(
      updateCommentTree(
        comments,
        commentId,
        {
          liked: Boolean(
            optimisticReactionType
          ),
          reaction_type:
            optimisticReactionType,
          likes: optimisticLikes,
        }
      )
    )

    try {
      const likeUrl =
        targetType === 'author_post'
          ? `${API_BASE_URL}/api/authors/me/post-comments/${encodeURIComponent(
              commentId
            )}/like`
          : `${API_BASE_URL}/api/comments/${encodeURIComponent(
              commentId
            )}/like`

      const response = await fetch(
        likeUrl,
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
            t('commentSection.failedUpdateReaction')
        )
      }

      updateComments(
        updateCommentTree(
          comments,
          commentId,
          {
            liked: Boolean(
              data.liked
            ),
            reaction_type:
              data.reaction_type ||
              null,
            likes: Number(
              data.likes || 0
            ),
          }
        )
      )
    } catch (error) {
      updateComments(
        updateCommentTree(
          comments,
          commentId,
          previous
        )
      )

      showToast(
        error.message ||
          t('commentSection.failedUpdateReactionPeriod')
      )
    }
  }

  const handleLoadMoreReplies = async (commentId) => {
    if (
      targetType !== 'author_post' ||
      !commentId ||
      loadingRepliesId
    ) {
      return
    }

    const parent = comments.find(
      (comment) =>
        String(comment.id) ===
        String(commentId)
    )

    if (!parent) return

    const currentReplyPage =
  Number(parent.reply_page ?? 1)

const nextPage =
  currentReplyPage <= 0
    ? 1
    : currentReplyPage + 1

    try {
      setLoadingRepliesId(commentId)

      const response = await fetch(
        buildReplyListUrl(
          targetType,
          targetId,
          commentId,
          nextPage
        ),
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
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
            t('commentSection.failedLoadReplies')
        )
      }

      const incoming = Array.isArray(data.replies)
        ? data.replies.map(normalizeApiComment)
        : []

      const nextComments = comments.map((comment) => {
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
            new Date(first.created_at || 0).getTime() -
            new Date(second.created_at || 0).getTime()
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

      updateComments(nextComments)
    } catch (error) {
      showToast(
        error.message ||
          t('commentSection.failedLoadRepliesPeriod')
      )
    } finally {
      setLoadingRepliesId(null)
    }
  }

  useEffect(() => {
  if (
    targetType !== 'author_post' ||
    !focusCommentId ||
    !focusParentComment?.id ||
    loadingRepliesId
  ) {
    return
  }

  const focusedParent =
    comments.find(
      (comment) =>
        String(comment.id) ===
        String(
          focusParentComment.id
        )
    )

  if (
    !focusedParent ||
    Number(
      focusedParent.reply_page ?? 1
    ) !== 0 ||
    !focusedParent.reply_has_more
  ) {
    return
  }

  handleLoadMoreReplies(
    focusedParent.id
  )
}, [
  comments,
  focusCommentId,
  focusParentComment?.id,
  targetType,
  loadingRepliesId,
])

const handleReply = async (
  commentId,
    replyText,
    mentionName = ''
  ) => {
    if (!token) {
      showToast(
        t('commentSection.pleaseLoginReply')
      )
      return false
    }

    const cleanReplyText = String(
      replyText || ''
    ).trim()
    const cleanMentionName = String(
      mentionName || ''
    ).trim()
    const finalReplyText =
      cleanMentionName
        ? `@${cleanMentionName} ${cleanReplyText}`
        : cleanReplyText

    if (!finalReplyText) {
      return false
    }

    try {
      const response = await fetch(
        buildCommentCreateUrl(
          targetType,
          targetId
        ),
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: finalReplyText,
            parent_id: commentId,
          }),
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (isCommentWarning(data)) {
        openCommentWarning(data)

        return (
          data.code !==
          'READER_COMMENT_BLOCKED'
        )
      }

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('commentSection.failedCreateReply')
        )
      }

      const newReply =
        normalizeApiComment(
          data.comment
        )
      const nextComments =
        comments.map((comment) => {
          if (
            String(comment.id) !==
            String(commentId)
          ) {
            return comment
          }

          const currentReplies =
            comment.replies || []
          const currentReplyTotal = Math.max(
            currentReplies.length,
            Number(comment.reply_total || 0)
          )

          return {
            ...comment,
            replies: [
              ...currentReplies,
              newReply,
            ],
            reply_total:
              currentReplyTotal + 1,
          }
        })

      updateComments(nextComments)
      updateTotal(
        data.comment_count ??
          totalComments + 1
      )
      return true
    } catch (error) {
      showToast(
        error.message ||
          t('commentSection.failedCreateReplyPeriod')
      )
      return false
    }
  }

  const handleEdit = (comment) => {
    setEditComment(comment)
    setEditText(comment.text || '')
  }

  const handleSaveEdit = async () => {
    if (
      !editComment ||
      !editText.trim() ||
      saving
    ) {
      return
    }

    if (!token) {
      showToast(
        t('commentSection.pleaseLoginAgain')
      )
      return
    }

    try {
      setSaving(true)

      const response = await fetch(
        buildCommentEditUrl(
          targetType,
          editComment.id
        ),
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

      if (isCommentWarning(data)) {
        openCommentWarning(data)

        if (
          data.code !==
          'READER_COMMENT_BLOCKED'
        ) {
          updateComments(
            removeCommentTree(
              comments,
              editComment.id
            )
          )
          updateTotal(
            data.comment_count ??
              totalComments - 1
          )
          setEditComment(null)
          setEditText('')
        }

        return
      }

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            t('commentSection.failedUpdateComment')
        )
      }

      const updatedComment =
  normalizeApiComment(
    data.comment
  )

const preservedComment =
  targetType === 'author_post'
    ? {
        ...updatedComment,
        replies:
          editComment.replies || [],
        reply_total: Number(
          editComment.reply_total ??
            editComment.replies?.length ??
            0
        ),
        reply_page: Math.max(
          1,
          Number(
            editComment.reply_page || 1
          )
        ),
        reply_has_more: Boolean(
          editComment.reply_has_more
        ),
      }
    : updatedComment

updateComments(
  updateCommentTree(
    comments,
    editComment.id,
    preservedComment
  )
)
      setEditComment(null)
      setEditText('')
      showToast(
        t('commentSection.commentUpdated')
      )
    } catch (error) {
      showToast(
        error.message ||
          t('commentSection.failedUpdateCommentPeriod')
      )
    } finally {
      setSaving(false)
    }
  }

  const handleCopyComment = async (
    comment
  ) => {
    const value = String(
      comment?.text || ''
    ).trim()

    if (!value) return

    try {
      if (
        navigator.clipboard
          ?.writeText
      ) {
        await navigator.clipboard.writeText(
          value
        )
      } else {
        const textarea =
          document.createElement(
            'textarea'
          )
        textarea.value = value
        textarea.style.position =
          'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(
          textarea
        )
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
      }

      showToast(t('commentSection.commentCopied'))
    } catch {
      showToast(t('commentSection.copyFailed'))
    }
  }

  const handleDeleteComment =
    async (comment) => {
      if (!token) {
        showToast(
          t('commentSection.pleaseLoginAgain')
        )
        return
      }

      const confirmed = window.confirm(
        t('commentSection.trashConfirm')
      )

      if (!confirmed) return

      if (
        targetType !==
        'author_post'
      ) {
        await handleModerate(
          comment,
          'delete'
        )
        return
      }

      try {
        const response = await fetch(
          buildCommentDeleteUrl(
            comment.id
          ),
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
              t('commentSection.failedDeleteComment')
          )
        }

       const nextComments =
  applyDeletedCommentTree(
    comments,
    comment.id
  )
        updateComments(nextComments)
        updateTotal(
          totalComments - 1
        )
        showToast(
          t('commentSection.commentMovedTrash')
        )
      } catch (error) {
        showToast(
          error.message ||
            t('commentSection.failedDeleteCommentPeriod')
        )
      }
    }

  const handleAuthorPostVisibility = async (
  comment,
  isHidden
) => {
  if (!token) {
    showToast(t('commentSection.pleaseLoginAgain'))
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/me/post-comments/${encodeURIComponent(
        comment.id
      )}/visibility`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_hidden: Boolean(isHidden),
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
          t('commentSection.failedVisibility')
      )
    }

    const updatedComment =
      normalizeApiComment(
        data.comment
      )

    const preservedComment = {
      ...updatedComment,
      replies:
        comment.replies || [],
      reply_total: Number(
        comment.reply_total ??
          comment.replies?.length ??
          0
      ),
      reply_page: Math.max(
        1,
        Number(
          comment.reply_page || 1
        )
      ),
      reply_has_more: Boolean(
        comment.reply_has_more
      ),
    }

    updateComments(
      updateCommentTree(
        comments,
        comment.id,
        preservedComment
      )
    )

    updateTotal(
      data.comment_count ??
        totalComments
    )

    showToast(
      isHidden
        ? t('commentSection.commentHiddenPage')
        : t('commentSection.commentUnhiddenPage')
    )
  } catch (error) {
    showToast(
      error.message ||
        t('commentSection.failedVisibilityPeriod')
    )
  }
}

  const handleModerate = async (
    comment,
    action
  ) => {
    if (!token) {
      showToast(
        t('commentSection.pleaseLoginAgain')
      )
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${encodeURIComponent(
          comment.id
        )}/moderate`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
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
        if (
          data.code ===
            'AUTHOR_COMMENT_AUTO_HIDDEN' ||
          data.code ===
            'COMMENT_AUTO_HIDDEN' ||
          data.code ===
            'READER_COMMENT_BLOCKED'
        ) {
          openCommentWarning(data)
          return
        }

        throw new Error(
          data.message ||
            t('commentSection.actionFailed')
        )
      }

     if (action === 'delete') {
  const nextComments = targetType === 'episode'
    ? removeCommentTree(comments, comment.id)
    : applyDeletedCommentTree(comments, comment.id)

  updateComments(nextComments)
  updateTotal(totalComments - 1)
  showToast(t('commentSection.commentMovedTrash'))
  return
}

      if (action === 'ban') {
        showToast(
          t('commentSection.userBanned')
        )
        return
      }

      const updatedComment =
        normalizeApiComment(
          data.comment
        )
      updateComments(
        updateCommentTree(
          comments,
          comment.id,
          updatedComment
        )
      )
      showToast(t('commentSection.updated'))
    } catch (error) {
      showToast(
        error.message ||
          t('commentSection.actionFailedPeriod')
      )
    }
  }

  const handleHideForReader = (
    comment
  ) => {
    updateComments(
      removeCommentTree(
        comments,
        comment.id
      )
    )
    showToast(
      t('commentSection.commentHiddenDevice')
    )
  }

  const handleLoadMore = () => {
    if (
      loadingMore ||
      !hasMore
    ) {
      return
    }

    fetchComments(page + 1, true)
  }

  return (
    <section
      className={
        isModal
          ? 'relative flex h-full flex-col bg-[var(--shadow-bg-surface)]'
          : 'min-h-screen bg-[var(--shadow-bg-surface)] pb-[84px]'
      }
    >
      <div className="relative z-10 shrink-0 bg-[var(--shadow-bg-surface)] px-4 pb-1 pt-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() =>
              setSortMenuOpen(true)
            }
            className="flex items-center gap-1 text-[14px] font-normal text-[var(--shadow-text-primary)] active:scale-95"
          >
            <span>
              {t(`commentSection.${selectedSort.labelKey}`)}
            </span>
            <i className="fa-solid fa-chevron-down text-[11px]" />
          </button>

          {canSwitchEpisode ? (
            <button
              type="button"
              onClick={() =>
                setEpisodeMenuOpen(
                  (value) => !value
                )
              }
              className="flex items-center gap-1 text-[14px] font-normal text-[var(--shadow-text-secondary)] active:scale-95"
            >
              <span>
                {t('commentSection.episodeNumber', { number: selectedEpisode
                  ?.episode_number ||
                  '' })}
              </span>
              <i
                className={`fa-solid fa-chevron-${
                  episodeMenuOpen
                    ? 'up'
                    : 'down'
                } text-[10px]`}
              />
            </button>
          ) : null}
        </div>

        {episodeMenuOpen ? (
          <div className="absolute right-4 top-8 z-[30] w-[220px] overflow-hidden rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] py-1 shadow-[0_12px_30px_rgba(17,24,39,0.16)]">
            <div className="max-h-[260px] overflow-y-auto">
              {episodeOptions.map(
                (item) => {
                  const itemId =
                    item.id ||
                    item.episode_id
                  const active =
                    String(itemId) ===
                    String(
                      selectedEpisodeId ||
                        targetId
                    )
                  const total =
                    Math.max(
                      0,
                      Number(
                        item.total_comments ||
                          0
                      )
                    )

                  return (
                    <button
                      key={itemId}
                      type="button"
                      onClick={() => {
                        onEpisodeChange?.(
                          String(itemId)
                        )
                        setEpisodeMenuOpen(
                          false
                        )
                      }}
                      className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left active:bg-[var(--shadow-bg-hover)] ${
                        active
                          ? 'bg-[#fff1f4] text-[#ff3b5f] dark:bg-[#ff3b5f]/10'
                          : 'text-[var(--shadow-text-primary)]'
                      }`}
                    >
                      <span className="text-[14px] font-normal">
                        {t('commentSection.episodeNumber', { number: item.episode_number || '' })}
                      </span>

                      <span className="text-[12px] font-normal">
                        {total}{' '}
                        {total === 1
                          ? t('commentSection.comment')
                          : t('commentSection.comments')}
                      </span>
                    </button>
                  )
                }
              )}
            </div>
          </div>
        ) : null}
      </div>

      <SortSheet
        open={sortMenuOpen}
        value={sort}
        onChoose={(value) => {
          setSort(value)
          setSortMenuOpen(false)
        }}
        onClose={() =>
          setSortMenuOpen(false)
        }
      />

      <div
        className={
          isModal
            ? 'min-h-0 flex-1 overflow-y-auto'
            : 'mx-auto max-w-3xl'
        }
      >
        <div className="mx-auto max-w-3xl">
          {loading &&
          !sortedComments.length ? (
            <div className="px-4 py-4">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="mb-3 h-20 animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]"
                />
              ))}
            </div>
          ) : sortedComments.length ? (
            <>
              {sortedComments.map(
                (comment) => (
                  <CommentItem
  key={comment.id}
  comment={comment}
  story={story}
  targetType={
    targetType
  }
  focusCommentId={focusCommentId}
  onLike={handleLike}
                    onStartReply={
  handleStartReply
}
                    onLoadMoreReplies={
                      handleLoadMoreReplies
                    }
                    loadingReplies={
                      String(loadingRepliesId) ===
                      String(comment.id)
                    }
                    onCopy={
                      handleCopyComment
                    }
                    onEdit={handleEdit}
                    onDelete={
                      handleDeleteComment
                    }
                    onHide={(
  selectedComment
) => {
  if (
    targetType ===
    'author_post'
  ) {
    if (
      isStoryAuthor(
        currentUser,
        story
      )
    ) {
      handleAuthorPostVisibility(
        selectedComment,
        true
      )
    } else {
      handleHideForReader(
        selectedComment
      )
    }

    return
  }

  const canModerate =
    isStoryAuthor(
      currentUser,
      story
    ) ||
    currentUser.is_admin

  if (canModerate) {
    handleModerate(
      selectedComment,
      'hide'
    )
    return
  }

  handleHideForReader(
    selectedComment
  )
}}
onUnhide={(
  selectedComment
) => {
  if (
    targetType ===
    'author_post'
  ) {
    handleAuthorPostVisibility(
      selectedComment,
      false
    )
    return
  }

  handleModerate(
    selectedComment,
    'unhide'
  )
}}
onPin={(
  selectedComment
) =>
  handleModerate(
    selectedComment,
    'pin'
  )
}
onUnpin={(
  selectedComment
) =>
  handleModerate(
    selectedComment,
    'unpin'
  )
}
onSpoiler={(
  selectedComment
) =>
                      handleModerate(
                        selectedComment,
                        'spoiler'
                      )
                    }
                    onUnspoiler={(
                      selectedComment
                    ) =>
                      handleModerate(
                        selectedComment,
                        'unspoiler'
                      )
                    }
                    onBan={(
                      selectedComment
                    ) =>
                      handleModerate(
                        selectedComment,
                        'ban'
                      )
                    }
                    onReport={
                      setReportComment
                    }
                  />
                )
              )}

              {hasMore ? (
                <div className="px-4 py-4">
                  <button
                    type="button"
                    onClick={
                      handleLoadMore
                    }
                    disabled={
                      loadingMore
                    }
                    className="h-11 w-full rounded-full bg-[var(--shadow-bg-soft)] text-[13px] font-normal text-[var(--shadow-text-primary)] disabled:text-[var(--shadow-text-tertiary)]"
                  >
                    {loadingMore
                      ? t('commentSection.loading')
                      : t('commentSection.loadMoreComments')}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyComments
              onFocus={() =>
                document
                  .getElementById(
                    'shadow-comment-input'
                  )
                  ?.focus()
              }
            />
          )}
        </div>
      </div>

      {toast ? (
  <div
    className={`${
      isModal
        ? 'absolute'
        : 'fixed'
    } bottom-[88px] left-1/2 z-[310] -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--shadow-text-primary)] px-4 py-2 text-[12px] font-normal text-[var(--shadow-bg-surface)] shadow-lg`}
  >
    {toast}
  </div>
) : null}

      {warningDialog ? (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/35 px-4"
        >
          <div className="w-full max-w-[420px] rounded-[24px] bg-[var(--shadow-bg-surface)] p-5 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fee2e2] text-[#b91c1c] dark:bg-[#b91c1c]/15 dark:text-[#fca5a5]">
              <i className="fa-solid fa-triangle-exclamation text-[18px]" />
            </div>

            <h3 className="mt-4 text-[20px] font-semibold text-[var(--shadow-text-primary)]">
              {warningDialog.title}
            </h3>

            <p className="mt-2 text-[13.5px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
              {warningDialog.message}
            </p>

            {warningDialog
              .matchedWords.length ? (
              <div className="mt-4 rounded-[18px] bg-[#fff7f7] dark:bg-[#b91c1c]/10 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.4px] text-[#b91c1c]">
                  {t('commentSection.restrictedWords')}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {warningDialog.matchedWords.map(
                    (word) => (
                      <span
                        key={word}
                        className="rounded-full bg-[#fee2e2] px-3 py-1 dark:bg-[#b91c1c]/15 text-[11.5px] font-normal text-[#b91c1c]"
                      >
                        {word}
                      </span>
                    )
                  )}
                </div>
              </div>
            ) : null}

            {warningDialog.until ? (
              <div className="mt-3 rounded-[16px] bg-[var(--shadow-bg-hover)] px-3 py-2 text-[12px] font-normal text-[var(--shadow-text-secondary)]">
{t('commentSection.until', { date: formatDate(warningDialog.until) })}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() =>
                setWarningDialog(null)
              }
              className="mt-5 h-11 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-normal text-[var(--shadow-bg-surface)] active:scale-95"
            >
              {t('commentSection.understand')}
            </button>
          </div>
        </div>
      ) : null}

      <ReportModal
        open={Boolean(reportComment)}
        reportType="comment"
        targetId={reportComment?.id}
        targetTitle={
          reportComment
            ? `${
                reportComment.name ||
                getDisplayText('commentSection.reader')
              }: ${String(
                reportComment.text ||
                  ''
              ).slice(0, 80)}`
            : ''
        }
        onClose={() =>
          setReportComment(null)
        }
      />

      <CommentComposer
  value={replyTarget ? replyText : text}
onChange={
  replyTarget ? setReplyText : setText
}
  onSend={handleSend}
  replyTarget={replyTarget}
  onCancelReply={() => {
  setReplyTarget(null)
  setReplyText('')
}}
        isModal={isModal}
        isBanned={isBanned}
        sending={sending}
      />

      <EditCommentSheet
        comment={editComment}
        value={editText}
        onChange={setEditText}
        onCancel={() => {
          setEditComment(null)
          setEditText('')
        }}
        onSave={handleSaveEdit}
        saving={saving}
      />
    </section>
  )
}
