import {
  Archive,
  Ban,
  Check,
  ChevronLeft,
  ChevronUp,
  Copy,
  CornerUpLeft,
  EllipsisVertical,
  Flag,
  Camera,
  Forward,
  Info,
  Image,
  LoaderCircle,
  Pencil,
  Pin,
  PinOff,
  Search,
  Send,
  Smile,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  MAX_CHAT_MESSAGE_SELECTION,
  archiveChatConversation,
  blockChatConversation,
  decideChatRequest,
  deleteChatConversation,
  deleteChatMessages,
  editChatMessage,
  forwardChatMessages,
  getChatBlockStatus,
  getChatConversations,
  getChatMessages,
  getPinnedChatMessages,
  hasReaderSession,
  markChatRead,
  pinChatMessage,
  replyChatMessage,
  reportChatMessage,
  sendChatMessage,
  unblockChatConversation,
  unpinChatMessage,
} from '../../services/chatApi'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatRoomPage', {
  en: {
    close: "Close",
    unknown: "Unknown",
    reasonSpam: "Spam",
    reasonHarassment: "Harassment",
    reasonHate: "Hate",
    reasonSexual: "Sexual content",
    reasonViolence: "Violence",
    reasonScam: "Scam",
    reasonImpersonation: "Impersonation",
    reasonPrivacy: "Privacy",
    reasonOther: "Other",
    messageRequest: "Message request",
    acceptRequestText: "Accept this request before continuing the conversation.",
    accept: "Accept",
    decline: "Decline",
    block: "Block",
    waitingRequest: "Waiting for the recipient to accept your message request.",
    requestDeclined: "This message request was declined.",
    blockedByYou: "You blocked this account. Open the 3 dots menu to unblock it.",
    blockedByOther: "This account blocked messaging with you.",
    messagingBlocked: "Messaging is blocked for this conversation.",
    closeConversationMenu: "Close conversation menu",
    viewProfile: "View profile",
    archiveChat: "Archive chat",
    deleteChat: "Delete chat",
    unblockAccount: "Unblock account",
    blockAccount: "Block account",
    blockedMessaging: "This account blocked messaging",
    reply: "Reply",
    edit: "Edit",
    unpin: "Unpin",
    pin: "Pin",
    copyText: "Copy text",
    forward: "Forward",
    delete: "Delete",
    select: "Select",
    messageInfo: "Message info",
    report: "Report",
    closeMessageMenu: "Close message menu",
    pinnedMessage: "Pinned message",
    message: "Message",
    unpinMessage: "Unpin message",
    failedLoadConversations: "Failed to load conversations",
    failedForwardMessages: "Failed to forward messages",
    forwardOne: "Forward 1 message",
    forwardMany: "Forward {{count}} messages",
    conversation: "Conversation",
    messages: "Messages",
    noAcceptedConversation: "No other accepted conversation is available.",
    failedSubmitReport: "Failed to submit report",
    reportMessage: "Report message",
    reason: "Reason",
    details: "Details",
    reportPlaceholder: "Add useful details for the admin review...",
    submitReport: "Submit report",
    reportEvidence: "The conversation evidence will be preserved for admin review.",
    messageId: "Message ID",
    sent: "Sent",
    edited: "Edited",
    no: "No",
    yes: "Yes",
    forwarded: "Forwarded",
    replyTo: "Reply to",
    type: "Type",
    textType: "text",
    messageDeleted: "Message deleted",
    deleteConversation: "Delete conversation",
    deleteEvidence: "Deleted chat evidence is kept securely for 90 days and can only be reviewed by authorized admins when needed.",
    deleteForMe: "Delete for me",
    removeInbox: "Removes this chat only from your inbox.",
    deleteForBoth: "Delete for both",
    removeBoth: "Removes the old chat from both inboxes.",
    groupDeleteOnly: "Group chats can only be deleted from your own inbox.",
    authorDeleteOnly: "Author Page conversations can only be deleted from your own side.",
    messageOptions: "Message options",
    originalUnavailable: "Original message unavailable",
    originalMessage: "Original message",
    read: "Read",
    sentStatus: "Sent",
    fromPerson: "from {{name}}",
    failedLoadConversation: "Failed to load conversation",
    failedLoadThisMessage: "Failed to load this message",
    oldMessageUnavailable: "This message is older than the loaded history or is no longer available",
    failedLoadEarlier: "Failed to load earlier messages",
    messageEdited: "Message edited",
    failedSend: "Failed to send message",
    blockConfirm: "Block this account and stop all messages?",
    failedUpdateRequest: "Failed to update request",
    unblockConfirm: "Unblock this account and restore messaging?",
    failedUnblock: "Failed to unblock account",
    failedArchive: "Failed to archive conversation",
    failedDeleteConversation: "Failed to delete conversation",
    selectLimit: "You can select up to {{count}} messages",
    noTextToCopy: "No message text to copy",
    copied: "Copied",
    failedCopy: "Failed to copy text",
    messageUnpinned: "Message unpinned",
    messagePinned: "Message pinned",
    failedUpdatePin: "Failed to update pin",
    deleteOneConfirm: "Delete 1 message for everyone? Admin evidence is retained for 90 days.",
    deleteManyConfirm: "Delete {{count}} messages for everyone? Admin evidence is retained for 90 days.",
    messageDeletedNotice: "Message deleted",
    failedDeleteMessage: "Failed to delete message",
    exitSelection: "Exit selection",
    selectedCount: "{{selected}} / {{max}} selected",
    copySelected: "Copy selected",
    forwardSelected: "Forward selected",
    pinSelected: "Pin selected",
    deleteSelected: "Delete selected",
    backMessages: "Back to messages",
    openChatInfo: "Open chat info",
    people: "{{count}} people",
    conversationOptions: "Conversation options",
    loadEarlier: "Load earlier messages",
    noMessages: "No messages yet.",
    editingMessage: "Editing message",
    replyingTo: "Replying to {{name}}",
    yourself: "yourself",
    replyMessage: "message",
    editPlaceholder: "Edit message...",
    replyPlaceholder: "Write a reply...",
    messagePlaceholder: "Write a message...",
    waitingApproval: "Waiting for request approval",
    messagesUnavailable: "Messages are unavailable",
    comingSoon: "Coming soon",
    searchMessages: "Search messages",
    camera: "Camera",
    image: "Image",
    saveEdit: "Save edit",
    sendMessage: "Send message",
    emoji: "Emoji",
    messageForwarded: "Message forwarded",
    reportSubmitted: "Report submitted",
  },
  km: {
    close: "បិទ",
    unknown: "មិនស្គាល់",
    reasonSpam: "សាររំខាន",
    reasonHarassment: "ការរំខាន",
    reasonHate: "ស្អប់ខ្ពើម",
    reasonSexual: "មាតិកាផ្លូវភេទ",
    reasonViolence: "អំពើហិង្សា",
    reasonScam: "បោកប្រាស់",
    reasonImpersonation: "ក្លែងបន្លំអត្តសញ្ញាណ",
    reasonPrivacy: "ឯកជនភាព",
    reasonOther: "ផ្សេងទៀត",
    messageRequest: "សំណើសារ",
    acceptRequestText: "ទទួលយកសំណើនេះមុនពេលបន្តការសន្ទនា។",
    accept: "ទទួលយក",
    decline: "បដិសេធ",
    block: "Block",
    waitingRequest: "កំពុងរង់ចាំអ្នកទទួលយកសំណើសាររបស់អ្នក។",
    requestDeclined: "សំណើសារនេះត្រូវបានបដិសេធ។",
    blockedByYou: "អ្នកបាន Block គណនីនេះ។ បើកម៉ឺនុយ 3 ចំណុចដើម្បី Unblock។",
    blockedByOther: "គណនីនេះបាន Block ការផ្ញើសារជាមួយអ្នក។",
    messagingBlocked: "ការផ្ញើសារត្រូវបាន Block សម្រាប់ការសន្ទនានេះ។",
    closeConversationMenu: "បិទម៉ឺនុយការសន្ទនា",
    viewProfile: "មើល Profile",
    archiveChat: "រក្សាទុក Chat",
    deleteChat: "លុប Chat",
    unblockAccount: "Unblock គណនី",
    blockAccount: "Block គណនី",
    blockedMessaging: "គណនីនេះបាន Block ការផ្ញើសារ",
    reply: "ឆ្លើយតប",
    edit: "កែ",
    unpin: "ដក Pin",
    pin: "Pin",
    copyText: "ចម្លងអត្ថបទ",
    forward: "បញ្ជូនបន្ត",
    delete: "លុប",
    select: "ជ្រើស",
    messageInfo: "ព័ត៌មានសារ",
    report: "រាយការណ៍",
    closeMessageMenu: "បិទម៉ឺនុយសារ",
    pinnedMessage: "សារដែលបាន Pin",
    message: "សារ",
    unpinMessage: "ដក Pin សារ",
    failedLoadConversations: "មិនអាចផ្ទុកការសន្ទនាបានទេ",
    failedForwardMessages: "មិនអាចបញ្ជូនសារបន្តបានទេ",
    forwardOne: "បញ្ជូនបន្ត 1 សារ",
    forwardMany: "បញ្ជូនបន្ត {{count}} សារ",
    conversation: "ការសន្ទនា",
    messages: "សារ",
    noAcceptedConversation: "មិនមានការសន្ទនាដែលបានទទួលយកផ្សេងទៀតទេ។",
    failedSubmitReport: "មិនអាចផ្ញើរបាយការណ៍បានទេ",
    reportMessage: "រាយការណ៍សារ",
    reason: "មូលហេតុ",
    details: "ព័ត៌មានលម្អិត",
    reportPlaceholder: "បន្ថែមព័ត៌មានដែលមានប្រយោជន៍សម្រាប់ Admin ពិនិត្យ...",
    submitReport: "ផ្ញើរបាយការណ៍",
    reportEvidence: "ភស្តុតាងការសន្ទនានឹងត្រូវបានរក្សាទុកសម្រាប់ Admin ពិនិត្យ។",
    messageId: "លេខសម្គាល់សារ",
    sent: "បានផ្ញើ",
    edited: "បានកែ",
    no: "ទេ",
    yes: "បាទ/ចាស",
    forwarded: "បានបញ្ជូនបន្ត",
    replyTo: "ឆ្លើយតបទៅ",
    type: "ប្រភេទ",
    textType: "អត្ថបទ",
    messageDeleted: "សារត្រូវបានលុប",
    deleteConversation: "លុបការសន្ទនា",
    deleteEvidence: "ភស្តុតាង Chat ដែលបានលុបត្រូវបានរក្សាសុវត្ថិភាព 90 ថ្ងៃ ហើយមានតែ Admin ដែលមានសិទ្ធិប៉ុណ្ណោះអាចពិនិត្យពេលចាំបាច់។",
    deleteForMe: "លុបសម្រាប់ខ្ញុំ",
    removeInbox: "ដក Chat នេះចេញតែពី Inbox របស់អ្នក។",
    deleteForBoth: "លុបសម្រាប់ទាំងពីរ",
    removeBoth: "ដក Chat ចាស់ចេញពី Inbox ទាំងពីរ។",
    groupDeleteOnly: "Group Chat អាចលុបបានតែពី Inbox របស់អ្នកប៉ុណ្ណោះ។",
    authorDeleteOnly: "ការសន្ទនា Author Page អាចលុបបានតែពីខាងអ្នកប៉ុណ្ណោះ។",
    messageOptions: "ជម្រើសសារ",
    originalUnavailable: "សារដើមមិនអាចមើលបាន",
    originalMessage: "សារដើម",
    read: "បានអាន",
    sentStatus: "បានផ្ញើ",
    fromPerson: "ពី {{name}}",
    failedLoadConversation: "មិនអាចផ្ទុកការសន្ទនាបានទេ",
    failedLoadThisMessage: "មិនអាចផ្ទុកសារនេះបានទេ",
    oldMessageUnavailable: "សារនេះចាស់ជាងប្រវត្តិដែលបានផ្ទុក ឬលែងមានទៀតហើយ",
    failedLoadEarlier: "មិនអាចផ្ទុកសារចាស់ៗបានទេ",
    messageEdited: "បានកែសារ",
    failedSend: "មិនអាចផ្ញើសារបានទេ",
    blockConfirm: "Block គណនីនេះ និងបញ្ឈប់សារទាំងអស់?",
    failedUpdateRequest: "មិនអាច Update សំណើបានទេ",
    unblockConfirm: "Unblock គណនីនេះ និងបើកការផ្ញើសារវិញ?",
    failedUnblock: "មិនអាច Unblock គណនីបានទេ",
    failedArchive: "មិនអាច Archive ការសន្ទនាបានទេ",
    failedDeleteConversation: "មិនអាចលុបការសន្ទនាបានទេ",
    selectLimit: "អ្នកអាចជ្រើសបានអតិបរមា {{count}} សារ",
    noTextToCopy: "គ្មានអត្ថបទសារសម្រាប់ចម្លង",
    copied: "បានចម្លង",
    failedCopy: "មិនអាចចម្លងអត្ថបទបានទេ",
    messageUnpinned: "បានដក Pin សារ",
    messagePinned: "បាន Pin សារ",
    failedUpdatePin: "មិនអាច Update Pin បានទេ",
    deleteOneConfirm: "លុប 1 សារសម្រាប់គ្រប់គ្នា? ភស្តុតាង Admin នឹងត្រូវរក្សាទុក 90 ថ្ងៃ។",
    deleteManyConfirm: "លុប {{count}} សារសម្រាប់គ្រប់គ្នា? ភស្តុតាង Admin នឹងត្រូវរក្សាទុក 90 ថ្ងៃ។",
    messageDeletedNotice: "បានលុបសារ",
    failedDeleteMessage: "មិនអាចលុបសារបានទេ",
    exitSelection: "ចាកចេញពីការជ្រើស",
    selectedCount: "បានជ្រើស {{selected}} / {{max}}",
    copySelected: "ចម្លងសារដែលបានជ្រើស",
    forwardSelected: "បញ្ជូនសារដែលបានជ្រើស",
    pinSelected: "Pin សារដែលបានជ្រើស",
    deleteSelected: "លុបសារដែលបានជ្រើស",
    backMessages: "ត្រឡប់ទៅសារ",
    openChatInfo: "បើកព័ត៌មាន Chat",
    people: "{{count}} នាក់",
    conversationOptions: "ជម្រើសការសន្ទនា",
    loadEarlier: "ផ្ទុកសារចាស់ៗ",
    noMessages: "មិនទាន់មានសារ។",
    editingMessage: "កំពុងកែសារ",
    replyingTo: "កំពុងឆ្លើយតបទៅ {{name}}",
    yourself: "ខ្លួនឯង",
    replyMessage: "សារ",
    editPlaceholder: "កែសារ...",
    replyPlaceholder: "សរសេរការឆ្លើយតប...",
    messagePlaceholder: "សរសេរសារ...",
    waitingApproval: "កំពុងរង់ចាំការយល់ព្រមសំណើ",
    messagesUnavailable: "មិនអាចផ្ញើសារបានទេ",
    comingSoon: "នឹងមកដល់ឆាប់ៗ",
    searchMessages: "ស្វែងរកសារ",
    camera: "កាមេរ៉ា",
    image: "រូបភាព",
    saveEdit: "រក្សាទុកការកែ",
    sendMessage: "ផ្ញើសារ",
    emoji: "Emoji",
    messageForwarded: "បានបញ្ជូនសារបន្ត",
    reportSubmitted: "បានផ្ញើរបាយការណ៍",
  },
  zh: {
    close: "关闭",
    unknown: "未知",
    reasonSpam: "垃圾信息",
    reasonHarassment: "骚扰",
    reasonHate: "仇恨",
    reasonSexual: "色情内容",
    reasonViolence: "暴力",
    reasonScam: "诈骗",
    reasonImpersonation: "冒充他人",
    reasonPrivacy: "隐私",
    reasonOther: "其他",
    messageRequest: "消息请求",
    acceptRequestText: "请先接受此请求，再继续对话。",
    accept: "接受",
    decline: "拒绝",
    block: "屏蔽",
    waitingRequest: "正在等待对方接受你的消息请求。",
    requestDeclined: "此消息请求已被拒绝。",
    blockedByYou: "你已屏蔽此账号。打开三点菜单可解除屏蔽。",
    blockedByOther: "此账号已屏蔽与你的消息。",
    messagingBlocked: "此对话的消息功能已被屏蔽。",
    closeConversationMenu: "关闭对话菜单",
    viewProfile: "查看资料",
    archiveChat: "归档聊天",
    deleteChat: "删除聊天",
    unblockAccount: "解除屏蔽",
    blockAccount: "屏蔽账号",
    blockedMessaging: "此账号已屏蔽消息",
    reply: "回复",
    edit: "编辑",
    unpin: "取消置顶",
    pin: "置顶",
    copyText: "复制文本",
    forward: "转发",
    delete: "删除",
    select: "选择",
    messageInfo: "消息信息",
    report: "举报",
    closeMessageMenu: "关闭消息菜单",
    pinnedMessage: "已置顶消息",
    message: "消息",
    unpinMessage: "取消置顶消息",
    failedLoadConversations: "无法加载对话",
    failedForwardMessages: "无法转发消息",
    forwardOne: "转发 1 条消息",
    forwardMany: "转发 {{count}} 条消息",
    conversation: "对话",
    messages: "消息",
    noAcceptedConversation: "没有其他已接受的对话。",
    failedSubmitReport: "无法提交举报",
    reportMessage: "举报消息",
    reason: "原因",
    details: "详情",
    reportPlaceholder: "添加有助于管理员审核的详细信息...",
    submitReport: "提交举报",
    reportEvidence: "对话证据将被保留供管理员审核。",
    messageId: "消息 ID",
    sent: "发送时间",
    edited: "已编辑",
    no: "否",
    yes: "是",
    forwarded: "已转发",
    replyTo: "回复至",
    type: "类型",
    textType: "文本",
    messageDeleted: "消息已删除",
    deleteConversation: "删除对话",
    deleteEvidence: "已删除聊天的证据会安全保留 90 天，仅授权管理员可在需要时查看。",
    deleteForMe: "仅为我删除",
    removeInbox: "仅从你的收件箱中移除此聊天。",
    deleteForBoth: "为双方删除",
    removeBoth: "从双方收件箱中移除此旧聊天。",
    groupDeleteOnly: "群聊只能从你自己的收件箱中删除。",
    authorDeleteOnly: "Author Page 对话只能从你这一侧删除。",
    messageOptions: "消息选项",
    originalUnavailable: "原消息不可用",
    originalMessage: "原消息",
    read: "已读",
    sentStatus: "已发送",
    fromPerson: "来自 {{name}}",
    failedLoadConversation: "无法加载对话",
    failedLoadThisMessage: "无法加载此消息",
    oldMessageUnavailable: "此消息早于已加载的历史记录或已不可用",
    failedLoadEarlier: "无法加载更早的消息",
    messageEdited: "消息已编辑",
    failedSend: "消息发送失败",
    blockConfirm: "屏蔽此账号并停止所有消息？",
    failedUpdateRequest: "无法更新请求",
    unblockConfirm: "解除屏蔽并恢复消息功能？",
    failedUnblock: "无法解除屏蔽",
    failedArchive: "无法归档对话",
    failedDeleteConversation: "无法删除对话",
    selectLimit: "最多可选择 {{count}} 条消息",
    noTextToCopy: "没有可复制的消息文本",
    copied: "已复制",
    failedCopy: "无法复制文本",
    messageUnpinned: "已取消置顶消息",
    messagePinned: "消息已置顶",
    failedUpdatePin: "无法更新置顶状态",
    deleteOneConfirm: "为所有人删除 1 条消息？管理员证据将保留 90 天。",
    deleteManyConfirm: "为所有人删除 {{count}} 条消息？管理员证据将保留 90 天。",
    messageDeletedNotice: "消息已删除",
    failedDeleteMessage: "无法删除消息",
    exitSelection: "退出选择",
    selectedCount: "已选择 {{selected}} / {{max}}",
    copySelected: "复制所选消息",
    forwardSelected: "转发所选消息",
    pinSelected: "置顶所选消息",
    deleteSelected: "删除所选消息",
    backMessages: "返回消息",
    openChatInfo: "打开聊天信息",
    people: "{{count}} 人",
    conversationOptions: "对话选项",
    loadEarlier: "加载更早的消息",
    noMessages: "暂无消息。",
    editingMessage: "正在编辑消息",
    replyingTo: "正在回复 {{name}}",
    yourself: "自己",
    replyMessage: "消息",
    editPlaceholder: "编辑消息...",
    replyPlaceholder: "写回复...",
    messagePlaceholder: "写消息...",
    waitingApproval: "等待请求批准",
    messagesUnavailable: "消息不可用",
    comingSoon: "即将推出",
    searchMessages: "搜索消息",
    camera: "相机",
    image: "图片",
    saveEdit: "保存编辑",
    sendMessage: "发送消息",
    emoji: "表情",
    messageForwarded: "消息已转发",
    reportSubmitted: "举报已提交",
  },
  ja: {
    close: "閉じる",
    unknown: "不明",
    reasonSpam: "スパム",
    reasonHarassment: "嫌がらせ",
    reasonHate: "ヘイト",
    reasonSexual: "性的コンテンツ",
    reasonViolence: "暴力",
    reasonScam: "詐欺",
    reasonImpersonation: "なりすまし",
    reasonPrivacy: "プライバシー",
    reasonOther: "その他",
    messageRequest: "メッセージリクエスト",
    acceptRequestText: "会話を続ける前にこのリクエストを承認してください。",
    accept: "承認",
    decline: "拒否",
    block: "ブロック",
    waitingRequest: "相手がメッセージリクエストを承認するのを待っています。",
    requestDeclined: "このメッセージリクエストは拒否されました。",
    blockedByYou: "このアカウントをブロックしました。3点メニューから解除できます。",
    blockedByOther: "このアカウントはあなたとのメッセージをブロックしています。",
    messagingBlocked: "この会話ではメッセージがブロックされています。",
    closeConversationMenu: "会話メニューを閉じる",
    viewProfile: "プロフィールを見る",
    archiveChat: "チャットをアーカイブ",
    deleteChat: "チャットを削除",
    unblockAccount: "ブロック解除",
    blockAccount: "アカウントをブロック",
    blockedMessaging: "このアカウントはメッセージをブロックしています",
    reply: "返信",
    edit: "編集",
    unpin: "ピン解除",
    pin: "ピン留め",
    copyText: "テキストをコピー",
    forward: "転送",
    delete: "削除",
    select: "選択",
    messageInfo: "メッセージ情報",
    report: "報告",
    closeMessageMenu: "メッセージメニューを閉じる",
    pinnedMessage: "ピン留めされたメッセージ",
    message: "メッセージ",
    unpinMessage: "メッセージのピンを解除",
    failedLoadConversations: "会話を読み込めませんでした",
    failedForwardMessages: "メッセージを転送できませんでした",
    forwardOne: "1件のメッセージを転送",
    forwardMany: "{{count}}件のメッセージを転送",
    conversation: "会話",
    messages: "メッセージ",
    noAcceptedConversation: "他に承認済みの会話はありません。",
    failedSubmitReport: "報告を送信できませんでした",
    reportMessage: "メッセージを報告",
    reason: "理由",
    details: "詳細",
    reportPlaceholder: "管理者の確認に役立つ詳細を追加...",
    submitReport: "報告を送信",
    reportEvidence: "会話の証拠は管理者の確認用に保存されます。",
    messageId: "メッセージ ID",
    sent: "送信日時",
    edited: "編集済み",
    no: "いいえ",
    yes: "はい",
    forwarded: "転送済み",
    replyTo: "返信先",
    type: "種類",
    textType: "テキスト",
    messageDeleted: "メッセージは削除されました",
    deleteConversation: "会話を削除",
    deleteEvidence: "削除されたチャットの証拠は90日間安全に保管され、必要な場合のみ権限のある管理者が確認できます。",
    deleteForMe: "自分だけ削除",
    removeInbox: "自分の受信箱からのみこのチャットを削除します。",
    deleteForBoth: "両方から削除",
    removeBoth: "双方の受信箱から古いチャットを削除します。",
    groupDeleteOnly: "グループチャットは自分の受信箱からのみ削除できます。",
    authorDeleteOnly: "Author Page の会話は自分側からのみ削除できます。",
    messageOptions: "メッセージオプション",
    originalUnavailable: "元のメッセージは利用できません",
    originalMessage: "元のメッセージ",
    read: "既読",
    sentStatus: "送信済み",
    fromPerson: "{{name}} から",
    failedLoadConversation: "会話を読み込めませんでした",
    failedLoadThisMessage: "このメッセージを読み込めませんでした",
    oldMessageUnavailable: "このメッセージは読み込み済み履歴より古いか、利用できなくなっています",
    failedLoadEarlier: "以前のメッセージを読み込めませんでした",
    messageEdited: "メッセージを編集しました",
    failedSend: "メッセージを送信できませんでした",
    blockConfirm: "このアカウントをブロックしてすべてのメッセージを停止しますか？",
    failedUpdateRequest: "リクエストを更新できませんでした",
    unblockConfirm: "ブロックを解除してメッセージを再開しますか？",
    failedUnblock: "ブロックを解除できませんでした",
    failedArchive: "会話をアーカイブできませんでした",
    failedDeleteConversation: "会話を削除できませんでした",
    selectLimit: "最大 {{count}} 件のメッセージを選択できます",
    noTextToCopy: "コピーできるメッセージ本文がありません",
    copied: "コピーしました",
    failedCopy: "テキストをコピーできませんでした",
    messageUnpinned: "メッセージのピンを解除しました",
    messagePinned: "メッセージをピン留めしました",
    failedUpdatePin: "ピン状態を更新できませんでした",
    deleteOneConfirm: "1件のメッセージを全員から削除しますか？管理用証拠は90日間保存されます。",
    deleteManyConfirm: "{{count}}件のメッセージを全員から削除しますか？管理用証拠は90日間保存されます。",
    messageDeletedNotice: "メッセージを削除しました",
    failedDeleteMessage: "メッセージを削除できませんでした",
    exitSelection: "選択を終了",
    selectedCount: "{{selected}} / {{max}} 件選択",
    copySelected: "選択したメッセージをコピー",
    forwardSelected: "選択したメッセージを転送",
    pinSelected: "選択したメッセージをピン留め",
    deleteSelected: "選択したメッセージを削除",
    backMessages: "メッセージに戻る",
    openChatInfo: "チャット情報を開く",
    people: "{{count}} 人",
    conversationOptions: "会話オプション",
    loadEarlier: "以前のメッセージを読み込む",
    noMessages: "まだメッセージはありません。",
    editingMessage: "メッセージを編集中",
    replyingTo: "{{name}} に返信中",
    yourself: "自分",
    replyMessage: "メッセージ",
    editPlaceholder: "メッセージを編集...",
    replyPlaceholder: "返信を書く...",
    messagePlaceholder: "メッセージを書く...",
    waitingApproval: "リクエストの承認待ち",
    messagesUnavailable: "メッセージは利用できません",
    comingSoon: "近日公開",
    searchMessages: "メッセージを検索",
    camera: "カメラ",
    image: "画像",
    saveEdit: "編集を保存",
    sendMessage: "メッセージを送信",
    emoji: "絵文字",
    messageForwarded: "メッセージを転送しました",
    reportSubmitted: "報告を送信しました",
  },
  ko: {
    close: "닫기",
    unknown: "알 수 없음",
    reasonSpam: "스팸",
    reasonHarassment: "괴롭힘",
    reasonHate: "혐오",
    reasonSexual: "성적 콘텐츠",
    reasonViolence: "폭력",
    reasonScam: "사기",
    reasonImpersonation: "사칭",
    reasonPrivacy: "개인정보",
    reasonOther: "기타",
    messageRequest: "메시지 요청",
    acceptRequestText: "대화를 계속하기 전에 이 요청을 수락하세요.",
    accept: "수락",
    decline: "거절",
    block: "차단",
    waitingRequest: "상대방이 메시지 요청을 수락하기를 기다리는 중입니다.",
    requestDeclined: "이 메시지 요청은 거절되었습니다.",
    blockedByYou: "이 계정을 차단했습니다. 점 3개 메뉴에서 차단을 해제할 수 있습니다.",
    blockedByOther: "이 계정이 나와의 메시지를 차단했습니다.",
    messagingBlocked: "이 대화에서는 메시지가 차단되어 있습니다.",
    closeConversationMenu: "대화 메뉴 닫기",
    viewProfile: "프로필 보기",
    archiveChat: "채팅 보관",
    deleteChat: "채팅 삭제",
    unblockAccount: "차단 해제",
    blockAccount: "계정 차단",
    blockedMessaging: "이 계정이 메시지를 차단했습니다",
    reply: "답장",
    edit: "수정",
    unpin: "고정 해제",
    pin: "고정",
    copyText: "텍스트 복사",
    forward: "전달",
    delete: "삭제",
    select: "선택",
    messageInfo: "메시지 정보",
    report: "신고",
    closeMessageMenu: "메시지 메뉴 닫기",
    pinnedMessage: "고정된 메시지",
    message: "메시지",
    unpinMessage: "메시지 고정 해제",
    failedLoadConversations: "대화를 불러오지 못했습니다",
    failedForwardMessages: "메시지를 전달하지 못했습니다",
    forwardOne: "메시지 1개 전달",
    forwardMany: "메시지 {{count}}개 전달",
    conversation: "대화",
    messages: "메시지",
    noAcceptedConversation: "다른 수락된 대화가 없습니다.",
    failedSubmitReport: "신고를 제출하지 못했습니다",
    reportMessage: "메시지 신고",
    reason: "이유",
    details: "세부정보",
    reportPlaceholder: "관리자 검토에 도움이 되는 세부정보를 추가하세요...",
    submitReport: "신고 제출",
    reportEvidence: "대화 증거는 관리자 검토를 위해 보관됩니다.",
    messageId: "메시지 ID",
    sent: "보낸 시간",
    edited: "수정됨",
    no: "아니요",
    yes: "예",
    forwarded: "전달됨",
    replyTo: "답장 대상",
    type: "유형",
    textType: "텍스트",
    messageDeleted: "메시지가 삭제됨",
    deleteConversation: "대화 삭제",
    deleteEvidence: "삭제된 채팅 증거는 90일 동안 안전하게 보관되며 필요한 경우 권한이 있는 관리자만 검토할 수 있습니다.",
    deleteForMe: "나에게서 삭제",
    removeInbox: "내 받은편지함에서만 이 채팅을 제거합니다.",
    deleteForBoth: "양쪽에서 삭제",
    removeBoth: "양쪽 받은편지함에서 이전 채팅을 제거합니다.",
    groupDeleteOnly: "그룹 채팅은 내 받은편지함에서만 삭제할 수 있습니다.",
    authorDeleteOnly: "Author Page 대화는 내 쪽에서만 삭제할 수 있습니다.",
    messageOptions: "메시지 옵션",
    originalUnavailable: "원본 메시지를 사용할 수 없음",
    originalMessage: "원본 메시지",
    read: "읽음",
    sentStatus: "보냄",
    fromPerson: "{{name}}에서",
    failedLoadConversation: "대화를 불러오지 못했습니다",
    failedLoadThisMessage: "이 메시지를 불러오지 못했습니다",
    oldMessageUnavailable: "이 메시지는 불러온 기록보다 오래되었거나 더 이상 사용할 수 없습니다",
    failedLoadEarlier: "이전 메시지를 불러오지 못했습니다",
    messageEdited: "메시지를 수정했습니다",
    failedSend: "메시지를 보내지 못했습니다",
    blockConfirm: "이 계정을 차단하고 모든 메시지를 중지할까요?",
    failedUpdateRequest: "요청을 업데이트하지 못했습니다",
    unblockConfirm: "이 계정의 차단을 해제하고 메시지를 복원할까요?",
    failedUnblock: "차단을 해제하지 못했습니다",
    failedArchive: "대화를 보관하지 못했습니다",
    failedDeleteConversation: "대화를 삭제하지 못했습니다",
    selectLimit: "최대 {{count}}개의 메시지를 선택할 수 있습니다",
    noTextToCopy: "복사할 메시지 텍스트가 없습니다",
    copied: "복사됨",
    failedCopy: "텍스트를 복사하지 못했습니다",
    messageUnpinned: "메시지 고정을 해제했습니다",
    messagePinned: "메시지를 고정했습니다",
    failedUpdatePin: "고정 상태를 업데이트하지 못했습니다",
    deleteOneConfirm: "모두에게서 메시지 1개를 삭제할까요? 관리자 증거는 90일간 보관됩니다.",
    deleteManyConfirm: "모두에게서 메시지 {{count}}개를 삭제할까요? 관리자 증거는 90일간 보관됩니다.",
    messageDeletedNotice: "메시지가 삭제되었습니다",
    failedDeleteMessage: "메시지를 삭제하지 못했습니다",
    exitSelection: "선택 종료",
    selectedCount: "{{selected}} / {{max}} 선택됨",
    copySelected: "선택한 메시지 복사",
    forwardSelected: "선택한 메시지 전달",
    pinSelected: "선택한 메시지 고정",
    deleteSelected: "선택한 메시지 삭제",
    backMessages: "메시지로 돌아가기",
    openChatInfo: "채팅 정보 열기",
    people: "{{count}}명",
    conversationOptions: "대화 옵션",
    loadEarlier: "이전 메시지 불러오기",
    noMessages: "아직 메시지가 없습니다.",
    editingMessage: "메시지 수정 중",
    replyingTo: "{{name}}에게 답장 중",
    yourself: "나 자신",
    replyMessage: "메시지",
    editPlaceholder: "메시지 수정...",
    replyPlaceholder: "답장 작성...",
    messagePlaceholder: "메시지 작성...",
    waitingApproval: "요청 승인 대기 중",
    messagesUnavailable: "메시지를 사용할 수 없습니다",
    comingSoon: "곧 제공 예정",
    searchMessages: "메시지 검색",
    camera: "카메라",
    image: "이미지",
    saveEdit: "수정 저장",
    sendMessage: "메시지 보내기",
    emoji: "이모지",
    messageForwarded: "메시지를 전달했습니다",
    reportSubmitted: "신고를 제출했습니다",
  },
})

const REPORT_REASONS = [
  ['spam', 'reasonSpam'],
  ['harassment', 'reasonHarassment'],
  ['hate', 'reasonHate'],
  ['sexual_content', 'reasonSexual'],
  ['violence', 'reasonViolence'],
  ['scam', 'reasonScam'],
  ['impersonation', 'reasonImpersonation'],
  ['privacy', 'reasonPrivacy'],
  ['other', 'reasonOther'],
]

function formatMessageTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatFullDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return getDisplayText('chatRoomPage.unknown')
  }

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function mergeMessages(current, incoming) {
  const messageMap = new Map()

  for (const message of [
    ...(current || []),
    ...(incoming || []),
  ]) {
    if (message?.id) {
      messageMap.set(String(message.id), message)
    }
  }

  return [...messageMap.values()].sort(
    (first, second) =>
      new Date(first.created_at).getTime() -
      new Date(second.created_at).getTime()
  )
}

function getLatestMessageCursor(
  messages,
  fallback = ''
) {
  let latestTime = Number.NEGATIVE_INFINITY
  let latestValue = ''

  for (const message of messages || []) {
    const value = String(
      message?.created_at || ''
    ).trim()
    const time = new Date(value).getTime()

    if (
      value &&
      Number.isFinite(time) &&
      time > latestTime
    ) {
      latestTime = time
      latestValue = value
    }
  }

  return latestValue || String(fallback || '')
}

function isNearPageBottom() {
  const pageHeight =
    document.documentElement.scrollHeight

  return (
    window.scrollY + window.innerHeight >=
    pageHeight - 180
  )
}

function clampMenuPosition(x, y) {
  const width = 228
  const height = 390
  const margin = 12

  return {
    x: Math.max(
      margin,
      Math.min(x, window.innerWidth - width - margin)
    ),
    y: Math.max(
      margin,
      Math.min(y, window.innerHeight - height - margin)
    ),
  }
}

async function copyToClipboard(value) {
  const text = String(value || '')

  if (!text) return

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

function RoomAvatar({ person, size = 'normal' }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name || 'Shadow'
  ).trim()
  const letter =
    name.charAt(0).toUpperCase() || 'S'
  const sizeClass =
    size === 'small'
      ? 'h-9 w-9 text-[12px]'
      : 'h-10 w-10 text-[13px]'

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] font-extrabold text-white ${sizeClass}`}
    >
      {person?.avatar_url && !failed ? (
        <img
          src={person.avatar_url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        letter
      )}
    </span>
  )
}

function ModalShell({
  title,
  children,
  onClose,
  width = 'max-w-[430px]',
}) {
  const { t } = useDisplayTranslation()

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t('chatRoomPage.close')}
        onClick={onClose}
        className="absolute inset-0"
      />

      <section
        className={`relative z-10 max-h-[88vh] w-full overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:rounded-[24px] ${width}`}
      >
        <header className="flex h-[58px] items-center justify-between border-b border-[#ececf0] px-4">
          <h2 className="text-[14px] font-extrabold text-[#111827]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#555560] transition hover:bg-[#f4f4f6] active:scale-90"
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

function RequestPanel({
  conversation,
  blockStatus,
  busyAction,
  onDecision,
}) {
  const { t } = useDisplayTranslation()

  if (!conversation) return null

  if (conversation.request_status === 'pending') {
    if (conversation.can_decide) {
      return (
        <section className="mx-4 mt-4 rounded-[20px] border border-[#ded4fa] bg-[#f7f3ff] p-4">
          <h2 className="text-[13px] font-extrabold text-[#111827]">
            {t('chatRoomPage.messageRequest')}
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-[#746b85]">
            {t('chatRoomPage.acceptRequestText')}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onDecision('accept')}
              disabled={Boolean(busyAction)}
              className="flex h-10 items-center justify-center gap-1 rounded-[12px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-[10px] font-extrabold text-white disabled:opacity-50"
            >
              {busyAction === 'accept' ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Check size={15} />
              )}
              {t('chatRoomPage.accept')}
            </button>

            <button
              type="button"
              onClick={() => onDecision('decline')}
              disabled={Boolean(busyAction)}
              className="flex h-10 items-center justify-center gap-1 rounded-[12px] border border-[#d7d7dc] bg-white text-[10px] font-extrabold text-[#5c5c65] disabled:opacity-50"
            >
              {busyAction === 'decline' ? (
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <X size={15} />
              )}
              {t('chatRoomPage.decline')}
            </button>

            <button
              type="button"
              onClick={() => onDecision('block')}
              disabled={Boolean(busyAction)}
              className="flex h-10 items-center justify-center gap-1 rounded-[12px] border border-[#f0c8ca] bg-white text-[10px] font-extrabold text-[#c1353b] disabled:opacity-50"
            >
              {busyAction === 'block' ? (
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <Ban size={14} />
              )}
              {t('chatRoomPage.block')}
            </button>
          </div>
        </section>
      )
    }

    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#f4efff] px-4 py-3 text-center">
        <p className="text-[11px] font-bold leading-5 text-[#705b9d]">
          {t('chatRoomPage.waitingRequest')}
        </p>
      </section>
    )
  }

  if (conversation.request_status === 'declined') {
    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#f4f4f6] px-4 py-3 text-center">
        <p className="text-[11px] font-bold text-[#777781]">
          {t('chatRoomPage.requestDeclined')}
        </p>
      </section>
    )
  }

  if (conversation.request_status === 'blocked') {
    const blockedMessage =
      blockStatus.viewer_has_blocked
        ? t('chatRoomPage.blockedByYou')
        : blockStatus.viewer_is_blocked
          ? t('chatRoomPage.blockedByOther')
          : t('chatRoomPage.messagingBlocked')

    return (
      <section className="mx-4 mt-4 rounded-[18px] bg-[#fff0f1] px-4 py-3 text-center">
        <p className="text-[11px] font-bold leading-5 text-[#bd3038]">
          {blockedMessage}
        </p>
      </section>
    )
  }

  return null
}

function ConversationMenu({
  open,
  isGroup,
  canOpenProfile,
  canBlock,
  canUnblock,
  blockedByOther,
  busyAction,
  onClose,
  onOpenProfile,
  onArchive,
  onDelete,
  onBlock,
  onUnblock,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label={t('chatRoomPage.closeConversationMenu')}
        onClick={onClose}
        className="fixed inset-0 z-[84]"
      />

      <div className="absolute right-3 top-[56px] z-[85] w-[220px] overflow-hidden rounded-[18px] border border-[#eceaf2] bg-white p-1.5 shadow-[0_18px_45px_rgba(17,24,39,0.17)]">
        {!isGroup ? (
          <button
            type="button"
            onClick={onOpenProfile}
            disabled={!canOpenProfile || Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#111827] transition hover:bg-[#f7f5fb] active:bg-[#f1edf8] disabled:opacity-45"
          >
            <UserRound size={17} />
            {t('chatRoomPage.viewProfile')}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onArchive}
          disabled={Boolean(busyAction)}
          className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#111827] transition hover:bg-[#f5f5f7] active:bg-[#ededf0] disabled:opacity-45"
        >
          {busyAction === 'archive' ? (
            <LoaderCircle
              size={17}
              className="animate-spin"
            />
          ) : (
            <Archive size={17} />
          )}
          {t('chatRoomPage.archiveChat')}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={Boolean(busyAction)}
          className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#c7353d] transition hover:bg-[#fff1f1] active:bg-[#ffe8e9] disabled:opacity-45"
        >
          <Trash2 size={17} />
          {t('chatRoomPage.deleteChat')}
        </button>

        {!isGroup ? (
          <div className="my-1 h-px bg-[#efedf3]" />
        ) : null}

        {!isGroup && canUnblock ? (
          <button
            type="button"
            onClick={onUnblock}
            disabled={Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#111827] transition hover:bg-[#f5f5f7] active:bg-[#ededf0] disabled:opacity-45"
          >
            {busyAction === 'unblock' ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Check size={17} />
            )}
            {t('chatRoomPage.unblockAccount')}
          </button>
        ) : !isGroup && canBlock ? (
          <button
            type="button"
            onClick={onBlock}
            disabled={Boolean(busyAction)}
            className="flex h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-[12px] font-normal text-[#c7353d] transition hover:bg-[#fff1f1] active:bg-[#ffe8e9] disabled:opacity-45"
          >
            {busyAction === 'block' ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <Ban size={17} />
            )}
            {t('chatRoomPage.blockAccount')}
          </button>
        ) : !isGroup && blockedByOther ? (
          <div className="flex min-h-11 w-full items-center gap-3 rounded-[13px] px-3 py-2 text-left text-[11px] font-normal leading-5 text-[#a64a50]">
            <Ban size={17} className="shrink-0" />
            {t('chatRoomPage.blockedMessaging')}
          </div>
        ) : null}
      </div>
    </>
  )
}

function MessageActionMenu({
  state,
  isPinned,
  busy,
  onClose,
  onAction,
}) {
  const { t } = useDisplayTranslation()

  if (!state?.message) return null

  const message = state.message
  const actions = message.is_mine
    ? [
        ['reply', CornerUpLeft, t('chatRoomPage.reply')],
        ['edit', Pencil, t('chatRoomPage.edit')],
        [
          isPinned ? 'unpin' : 'pin',
          isPinned ? PinOff : Pin,
          isPinned ? t('chatRoomPage.unpin') : t('chatRoomPage.pin'),
        ],
        ['copy', Copy, t('chatRoomPage.copyText')],
        ['forward', Forward, t('chatRoomPage.forward')],
        ['delete', Trash2, t('chatRoomPage.delete')],
        ['select', Check, t('chatRoomPage.select')],
        ['info', Info, t('chatRoomPage.messageInfo')],
      ]
    : [
        ['reply', CornerUpLeft, t('chatRoomPage.reply')],
        [
          isPinned ? 'unpin' : 'pin',
          isPinned ? PinOff : Pin,
          isPinned ? t('chatRoomPage.unpin') : t('chatRoomPage.pin'),
        ],
        ['copy', Copy, t('chatRoomPage.copyText')],
        ['forward', Forward, t('chatRoomPage.forward')],
        ['select', Check, t('chatRoomPage.select')],
        ['report', Flag, t('chatRoomPage.report')],
      ]

  return (
    <>
      <button
        type="button"
        aria-label={t('chatRoomPage.closeMessageMenu')}
        onClick={onClose}
        className="fixed inset-0 z-[102]"
      />

      <div
        className="fixed z-[103] w-[228px] overflow-hidden rounded-[18px] border border-[#e9e7ef] bg-white p-1.5 shadow-[0_20px_50px_rgba(17,24,39,0.22)]"
        style={{
          left: state.x,
          top: state.y,
        }}
      >
        {actions.map(([key, Icon, label]) => {
          const destructive =
            key === 'delete' || key === 'report'

          return (
            <button
              key={key}
              type="button"
              onClick={() => onAction(key, message)}
              disabled={Boolean(busy)}
              className={`flex h-10 w-full items-center gap-3 rounded-[12px] px-3 text-left text-[12px] font-extrabold transition disabled:opacity-45 ${
                destructive
                  ? 'text-[#c7353d] hover:bg-[#fff1f1]'
                  : 'text-[#282832] hover:bg-[#f6f4f9]'
              }`}
            >
              {busy === key ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Icon size={16} />
              )}
              {label}
            </button>
          )
        })}
      </div>
    </>
  )
}

function PinnedBanner({
  pin,
  busy,
  onJump,
  onUnpin,
}) {
  const { t } = useDisplayTranslation()

  if (!pin?.message) return null

  const message = pin.message

  return (
    <div className="sticky top-[64px] z-[72] border-b border-[#e9e4f7] bg-[#faf8ff]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[620px] items-center gap-3 px-4 py-2.5">
        <button
          type="button"
          onClick={() => onJump(message.id)}
          className="min-w-0 flex-1 border-l-[3px] border-[#7c3aed] pl-3 text-left"
        >
          <p className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-[#7552c6]">
            <Pin size={12} />
            {t('chatRoomPage.pinnedMessage')}
          </p>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-[#4a4655]">
            {message.body || t('chatRoomPage.message')}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onUnpin(message.id)}
          disabled={Boolean(busy)}
          aria-label={t('chatRoomPage.unpinMessage')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7552c6] transition hover:bg-[#eee8ff] active:scale-90 disabled:opacity-45"
        >
          {busy ? (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          ) : (
            <PinOff size={16} />
          )}
        </button>
      </div>
    </div>
  )
}

function ForwardModal({
  open,
  currentConversationId,
  messageIds,
  onClose,
  onForwarded,
}) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const { t } = useDisplayTranslation()

  useEffect(() => {
    if (!open) return undefined

    let active = true
    setLoading(true)
    setError('')

    getChatConversations('accepted')
      .then((data) => {
        if (!active) return

        setConversations(
          (data.conversations || []).filter(
            (item) =>
              String(item.id) !==
                String(currentConversationId) &&
              item.can_send !== false
          )
        )
      })
      .catch((loadError) => {
        if (!active) return
        setError(
          loadError.message ||
            getDisplayText('chatRoomPage.failedLoadConversations')
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [open, currentConversationId])

  if (!open) return null

  const handleForward = async (targetId) => {
    if (busyId) return

    setBusyId(targetId)
    setError('')

    try {
      await forwardChatMessages({
        sourceConversationId:
          currentConversationId,
        targetConversationId: targetId,
        messageIds,
      })
      onForwarded()
    } catch (forwardError) {
      setError(
        forwardError.message ||
          getDisplayText('chatRoomPage.failedForwardMessages')
      )
    } finally {
      setBusyId('')
    }
  }

  return (
    <ModalShell
      title={messageIds.length === 1
        ? t('chatRoomPage.forwardOne')
        : t('chatRoomPage.forwardMany', { count: messageIds.length.toLocaleString(getDisplayLanguageId()) })}
      onClose={onClose}
    >
      <div className="max-h-[65vh] overflow-y-auto p-3">
        {error ? (
          <p className="mb-3 rounded-[14px] bg-[#fff0f1] px-3 py-2.5 text-[11px] font-bold text-[#c7353d]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-14 text-[#8c8c96]">
            <LoaderCircle
              size={25}
              className="animate-spin"
            />
          </div>
        ) : conversations.length ? (
          <div className="space-y-1">
            {conversations.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleForward(item.id)}
                disabled={Boolean(busyId)}
                className="flex w-full items-center gap-3 rounded-[16px] p-3 text-left transition hover:bg-[#f6f3fb] active:bg-[#eee8f8] disabled:opacity-50"
              >
                <RoomAvatar
                  person={item.counterpart}
                  size="small"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold text-[#22222b]">
                    {item.counterpart?.name ||
                      t('chatRoomPage.conversation')}
                  </span>
                  <span className="block truncate text-[10px] font-semibold text-[#9696a0]">
                    {item.counterpart?.username
                      ? `@${item.counterpart.username}`
                      : t('chatRoomPage.messages')}
                  </span>
                </span>
                {busyId === item.id ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin text-[#7c3aed]"
                  />
                ) : (
                  <Forward
                    size={18}
                    className="text-[#7c3aed]"
                  />
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-14 text-center text-[12px] font-semibold text-[#92929c]">
            {t('chatRoomPage.noAcceptedConversation')}
          </p>
        )}
      </div>
    </ModalShell>
  )
}

function ReportModal({
  message,
  conversationId,
  onClose,
  onSubmitted,
}) {
  const [reason, setReason] = useState('spam')
  const [details, setDetails] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { t } = useDisplayTranslation()

  if (!message) return null

  const handleSubmit = async () => {
    if (busy) return

    setBusy(true)
    setError('')

    try {
      await reportChatMessage(
        conversationId,
        message.id,
        {
          reason,
          details,
        }
      )
      onSubmitted()
    } catch (reportError) {
      setError(
        reportError.message ||
          getDisplayText('chatRoomPage.failedSubmitReport')
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <ModalShell
      title={t('chatRoomPage.reportMessage')}
      onClose={onClose}
    >
      <div className="max-h-[70vh] overflow-y-auto p-4">
        <div className="rounded-[16px] bg-[#f5f5f7] p-3">
          <p className="line-clamp-4 whitespace-pre-wrap break-words text-[11px] leading-5 text-[#4f4f59]">
            {message.body}
          </p>
        </div>

        <label className="mt-4 block text-[11px] font-extrabold text-[#3a3a43]">
          {t('chatRoomPage.reason')}
        </label>
        <select
          value={reason}
          onChange={(event) =>
            setReason(event.target.value)
          }
          className="mt-2 h-11 w-full rounded-[14px] border border-[#dedee4] bg-white px-3 text-[12px] font-semibold text-[#22222b] outline-none focus:border-[#9b7be8]"
        >
          {REPORT_REASONS.map(([value, labelKey]) => (
            <option key={value} value={value}>
              {t(`chatRoomPage.${labelKey}`)}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-[11px] font-extrabold text-[#3a3a43]">
          {t('chatRoomPage.details')}
        </label>
        <textarea
          value={details}
          onChange={(event) =>
            setDetails(
              event.target.value.slice(0, 1000)
            )
          }
          rows={4}
          placeholder={t('chatRoomPage.reportPlaceholder')}
          className="mt-2 w-full resize-none rounded-[14px] border border-[#dedee4] bg-white px-3 py-3 text-[12px] leading-5 text-[#22222b] outline-none focus:border-[#9b7be8]"
        />

        {error ? (
          <p className="mt-3 rounded-[14px] bg-[#fff0f1] px-3 py-2.5 text-[11px] font-bold text-[#c7353d]">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-[#c7353d] text-[12px] font-extrabold text-white transition active:scale-[0.99] disabled:opacity-50"
        >
          {busy ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Flag size={17} />
          )}
          {t('chatRoomPage.submitReport')}
        </button>

        <p className="mt-3 text-center text-[10px] leading-4 text-[#8e8e98]">
          {t('chatRoomPage.reportEvidence')}
        </p>
      </div>
    </ModalShell>
  )
}

function MessageInfoModal({ message, onClose }) {
  const { t } = useDisplayTranslation()

  if (!message) return null

  const rows = [
    [t('chatRoomPage.messageId'), message.id],
    [t('chatRoomPage.sent'), formatFullDate(message.created_at)],
    [
      t('chatRoomPage.edited'),
      message.edited_at
        ? formatFullDate(message.edited_at)
        : t('chatRoomPage.no'),
    ],
    [
      t('chatRoomPage.forwarded'),
      message.is_forwarded ? t('chatRoomPage.yes') : t('chatRoomPage.no'),
    ],
    [
      t('chatRoomPage.replyTo'),
      message.reply_to_message_id || t('chatRoomPage.no'),
    ],
    [t('chatRoomPage.type'), message.message_type || t('chatRoomPage.textType')],
  ]

  return (
    <ModalShell
      title={t('chatRoomPage.messageInfo')}
      onClose={onClose}
    >
      <div className="p-4">
        <div className="rounded-[16px] bg-[#f7f7f9] p-3">
          <p className="max-h-32 overflow-y-auto whitespace-pre-wrap break-words text-[12px] leading-5 text-[#33333c]">
            {message.body || t('chatRoomPage.messageDeleted')}
          </p>
        </div>

        <div className="mt-4 divide-y divide-[#ededf1] rounded-[16px] border border-[#ededf1]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 px-3 py-3"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#92929c]">
                {label}
              </span>
              <span className="break-all text-[11px] font-semibold text-[#34343d]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  )
}

function DeleteConversationModal({
  conversation,
  busy,
  onClose,
  onDelete,
}) {
  const { t } = useDisplayTranslation()
  const isGroup =
    conversation?.is_group === true

  const canDeleteForBoth =
    !isGroup &&
    (conversation?.conversation_type ===
      'reader_reader' ||
      conversation?.delete_permissions
        ?.can_delete_for_both === true)

  return (
    <ModalShell
      title={t('chatRoomPage.deleteConversation')}
      onClose={onClose}
    >
      <div className="p-4">
        <p className="text-[12px] leading-5 text-[#5d5d67]">
          {t('chatRoomPage.deleteEvidence')}
        </p>

        <button
          type="button"
          onClick={() => onDelete('for_me')}
          disabled={Boolean(busy)}
          className="mt-4 flex min-h-[58px] w-full items-center gap-3 rounded-[16px] border border-[#ececf0] px-4 text-left transition hover:bg-[#f7f7f9] disabled:opacity-50"
        >
          {busy === 'for_me' ? (
            <LoaderCircle
              size={20}
              className="animate-spin text-[#7c3aed]"
            />
          ) : (
            <Trash2
              size={20}
              className="text-[#7c3aed]"
            />
          )}
          <span>
            <span className="block text-[12px] font-extrabold text-[#2a2a33]">
              {t('chatRoomPage.deleteForMe')}
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold text-[#91919b]">
              {t('chatRoomPage.removeInbox')}
            </span>
          </span>
        </button>

        {canDeleteForBoth ? (
          <button
            type="button"
            onClick={() => onDelete('for_both')}
            disabled={Boolean(busy)}
            className="mt-2 flex min-h-[58px] w-full items-center gap-3 rounded-[16px] border border-[#f1d5d7] px-4 text-left transition hover:bg-[#fff3f4] disabled:opacity-50"
          >
            {busy === 'for_both' ? (
              <LoaderCircle
                size={20}
                className="animate-spin text-[#c7353d]"
              />
            ) : (
              <Trash2
                size={20}
                className="text-[#c7353d]"
              />
            )}
            <span>
              <span className="block text-[12px] font-extrabold text-[#c7353d]">
                {t('chatRoomPage.deleteForBoth')}
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold text-[#a8787c]">
                {t('chatRoomPage.removeBoth')}
              </span>
            </span>
          </button>
        ) : (
          <p className="mt-3 rounded-[14px] bg-[#f7f3ff] px-3 py-2.5 text-[10px] font-bold leading-4 text-[#705b9d]">
            {isGroup
              ? t('chatRoomPage.groupDeleteOnly')
              : t('chatRoomPage.authorDeleteOnly')}
          </p>
        )}
      </div>
    </ModalShell>
  )
}

function MessageBubble({
  message,
  selected,
  selectionMode,
  highlighted,
  isPinned,
  isRead,
  setMessageRef,
  onOpenMenu,
  onToggleSelection,
  onJumpToReply,
}) {
  const { t } = useDisplayTranslation()
  const longPressTimerRef = useRef(null)
  const pointerStartRef = useRef(null)

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(
        longPressTimerRef.current
      )
      longPressTimerRef.current = null
    }
  }

  const handlePointerDown = (event) => {
    if (
      message.is_deleted ||
      event.pointerType !== 'touch'
    ) {
      return
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    longPressTimerRef.current =
      window.setTimeout(() => {
        onOpenMenu(
          message,
          event.clientX,
          event.clientY
        )
        longPressTimerRef.current = null
      }, 550)
  }

  const handlePointerMove = (event) => {
    const start = pointerStartRef.current

    if (!start) return

    if (
      Math.abs(event.clientX - start.x) > 12 ||
      Math.abs(event.clientY - start.y) > 12
    ) {
      clearLongPress()
    }
  }

  const handleContextMenu = (event) => {
    if (message.is_deleted) return

    event.preventDefault()
    onOpenMenu(
      message,
      event.clientX,
      event.clientY
    )
  }

  const handleClick = () => {
    if (
      selectionMode &&
      !message.is_deleted
    ) {
      onToggleSelection(message.id)
    }
  }

  const senderName =
    message.reply_to?.sender?.name ||
    t('chatRoomPage.message')

  return (
    <div
      ref={(node) => setMessageRef(message.id, node)}
      data-message-id={message.id}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onClick={handleClick}
      className={`group flex scroll-mt-[150px] rounded-[16px] px-1 py-0.5 transition ${
        message.is_mine
          ? 'justify-end'
          : 'justify-start'
      } ${
        selectionMode && !message.is_deleted
          ? 'cursor-pointer'
          : ''
      } ${
        selected
          ? 'bg-[#e9e0ff]'
          : highlighted
            ? 'bg-[#fff0a8]'
            : ''
      }`}
    >
      <div
        className={`flex max-w-[88%] items-center gap-1.5 ${
          message.is_mine
            ? 'flex-row-reverse'
            : 'flex-row'
        }`}
      >
        {!message.is_deleted ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              const rect =
                event.currentTarget.getBoundingClientRect()
              onOpenMenu(
                message,
                message.is_mine
                  ? rect.left - 220
                  : rect.right + 4,
                rect.top
              )
            }}
            aria-label={t('chatRoomPage.messageOptions')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8c8c96] opacity-0 transition hover:bg-white active:scale-90 group-hover:opacity-100 focus:opacity-100"
          >
            <EllipsisVertical size={17} />
          </button>
        ) : null}

        <div
          className={`min-w-0 max-w-full rounded-[20px] px-4 py-2.5 shadow-sm ${
            message.is_mine
              ? 'rounded-br-[6px] bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white'
              : 'rounded-bl-[6px] bg-white text-[#24242c]'
          } ${
            message.is_deleted
              ? 'border border-[#e4e4e8] bg-[#f2f2f4] text-[#8e8e97] shadow-none'
              : ''
          }`}
        >
          {message.is_forwarded ? (
            <p
              className={`mb-1 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide ${
                message.is_mine
                  ? 'text-white/70'
                  : 'text-[#7b5bc5]'
              }`}
            >
              <Forward size={11} />
              {t('chatRoomPage.forwarded')}
              {message.forwarded_from?.name
                ? ` ${t('chatRoomPage.fromPerson', { name: message.forwarded_from.name })}`
                : ''}
            </p>
          ) : null}

          {message.reply_to_message_id ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onJumpToReply(
                  message.reply_to_message_id
                )
              }}
              className={`mb-2 block w-full rounded-[10px] border-l-[3px] px-2.5 py-2 text-left ${
                message.is_mine
                  ? 'border-white/70 bg-white/15'
                  : 'border-[#7c3aed] bg-[#f5f1ff]'
              }`}
            >
              <span
                className={`block truncate text-[9px] font-extrabold ${
                  message.is_mine
                    ? 'text-white/85'
                    : 'text-[#7552c6]'
                }`}
              >
                {senderName}
              </span>
              <span
                className={`mt-0.5 block truncate text-[10px] font-semibold ${
                  message.is_mine
                    ? 'text-white/70'
                    : 'text-[#6f6b78]'
                }`}
              >
                {message.reply_to?.is_deleted
                  ? t('chatRoomPage.originalUnavailable')
                  : message.reply_to?.body ||
                    t('chatRoomPage.originalMessage')}
              </span>
            </button>
          ) : null}

          <p
            className={`whitespace-pre-wrap break-words text-[13px] leading-5 ${
              message.is_deleted
                ? 'italic'
                : ''
            }`}
          >
            {message.is_deleted
              ? t('chatRoomPage.messageDeleted')
              : message.body}
          </p>

          <div
            className={`mt-1 flex items-center justify-end gap-1.5 text-[9px] font-semibold ${
              message.is_mine &&
              !message.is_deleted
                ? 'text-white/75'
                : 'text-[#9b9ba4]'
            }`}
          >
            {isPinned ? (
              <Pin size={10} />
            ) : null}
            {message.edited_at ? (
              <span>{t('chatRoomPage.edited')}</span>
            ) : null}
            <span>
              {formatMessageTime(
                message.created_at
              )}
            </span>
            {message.is_mine &&
            !message.is_deleted ? (
              <span
                aria-label={
                  isRead
                    ? t('chatRoomPage.read')
                    : t('chatRoomPage.sentStatus')
                }
              >
                {isRead ? '✓✓' : '✓'}
              </span>
            ) : null}
          </div>
        </div>

        {selectionMode &&
        !message.is_deleted ? (
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              selected
                ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                : 'border-[#bbb9c2] bg-white text-transparent'
            }`}
          >
            <Check size={13} />
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default function ChatRoomPage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { conversationId } = useParams()
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const shouldScrollBottomRef = useRef(true)
  const scrollRestoreRef = useRef(null)
  const messageRefs = useRef(new Map())
  const jumpHandledRef = useRef('')
  const pollCursorRef = useRef('')
  const incrementalLoadingRef = useRef(false)
  const [conversation, setConversation] = useState(null)
  const [blockStatus, setBlockStatus] = useState({
    is_blocked: false,
    viewer_has_blocked: false,
    viewer_is_blocked: false,
  })
  const [messages, setMessages] = useState([])
  const [pins, setPins] = useState([])
  const [nextBefore, setNextBefore] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [sending, setSending] = useState(false)
  const [busyAction, setBusyAction] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [messageMenu, setMessageMenu] = useState(null)
  const [selectedIds, setSelectedIds] = useState(
    () => new Set()
  )
  const [replyTarget, setReplyTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [forwardIds, setForwardIds] = useState([])
  const [reportTarget, setReportTarget] = useState(null)
  const [infoTarget, setInfoTarget] = useState(null)
  const [deleteChatOpen, setDeleteChatOpen] = useState(false)
  const [highlightedId, setHighlightedId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const notifyChatUpdated = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('shadow-chat-updated')
    )
  }, [])

  const loadRoom = useCallback(
    async ({
      silent = false,
      includeMeta = true,
      signal,
    } = {}) => {
      if (!conversationId) return

      if (!silent) setLoading(true)

      try {
        const data = await getChatMessages(
          conversationId,
          {
            limit: silent ? 20 : 50,
            signal,
          }
        )

        const roomConversation =
          data.conversation || null
        const incomingMessages =
          Array.isArray(data.messages)
            ? data.messages
            : []

        pollCursorRef.current =
          getLatestMessageCursor(
            incomingMessages,
            roomConversation?.last_message_at ||
              roomConversation?.created_at ||
              pollCursorRef.current
          )

        if (includeMeta) {
          const [blockData, pinData] =
            await Promise.all([
              roomConversation?.is_group === true
                ? Promise.resolve({
                    block_status: {
                      is_blocked: false,
                      viewer_has_blocked: false,
                      viewer_is_blocked: false,
                    },
                  })
                : getChatBlockStatus(
                    conversationId,
                    { signal }
                  ),
              getPinnedChatMessages(
                conversationId,
                { signal }
              ),
            ])

          setBlockStatus({
            is_blocked: Boolean(
              blockData.block_status?.is_blocked
            ),
            viewer_has_blocked: Boolean(
              blockData.block_status
                ?.viewer_has_blocked
            ),
            viewer_is_blocked: Boolean(
              blockData.block_status
                ?.viewer_is_blocked
            ),
          })

          setPins(
            Array.isArray(pinData.pins)
              ? pinData.pins
              : []
          )
        }

        setConversation(roomConversation)

        if (silent) {
          shouldScrollBottomRef.current =
            isNearPageBottom()

          setMessages((current) =>
            mergeMessages(
              current,
              incomingMessages
            )
          )
        } else {
          shouldScrollBottomRef.current = true
          setMessages(incomingMessages)
          setNextBefore(
            data.next_before || null
          )
        }

        setError('')

        if (
          document.visibilityState === 'visible' &&
          Number(
            data.conversation?.unread_count || 0
          ) > 0
        ) {
          await markChatRead(
            conversationId,
            { signal }
          )
          notifyChatUpdated()
        }
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

        if (loadError.status === 401) {
          navigate('/login', {
            replace: true,
          })
          return
        }

        if (
          loadError.status === 403 ||
          loadError.status === 404
        ) {
          if (silent) {
            navigate('/chat', {
              replace: true,
            })
          } else {
            setError(loadError.message)
          }
          return
        }

        if (!silent) {
          setError(
            loadError.message ||
              getDisplayText('chatRoomPage.failedLoadConversation')
          )
        }
      } finally {
        if (!silent && !signal?.aborted) {
          setLoading(false)
        }
      }
    },
    [
      conversationId,
      navigate,
      notifyChatUpdated,
    ]
  )

  const loadIncrementalMessages = useCallback(
    async ({ signal } = {}) => {
      if (
        !conversationId ||
        incrementalLoadingRef.current
      ) {
        return
      }

      const after = pollCursorRef.current

      if (!after) {
        await loadRoom({
          silent: true,
          includeMeta: false,
        })
        return
      }

      incrementalLoadingRef.current = true

      try {
        const data = await getChatMessages(
          conversationId,
          {
            after,
            limit: 20,
            signal,
          }
        )

        const incomingMessages =
          Array.isArray(data.messages)
            ? data.messages
            : []

        if (!incomingMessages.length) {
          return
        }

        shouldScrollBottomRef.current =
          isNearPageBottom()

        setMessages((current) =>
          mergeMessages(
            current,
            incomingMessages
          )
        )

        pollCursorRef.current =
          getLatestMessageCursor(
            incomingMessages,
            after
          )

        const hasNewIncoming =
          incomingMessages.some(
            (message) => !message.is_mine
          )

        if (
          hasNewIncoming &&
          document.visibilityState === 'visible'
        ) {
          await markChatRead(
            conversationId,
            { signal }
          )
          notifyChatUpdated()
        }
      } catch (loadError) {
        if (loadError?.name === 'AbortError') {
          return
        }

        if (loadError.status === 401) {
          navigate('/login', {
            replace: true,
          })
          return
        }

        if (
          loadError.status === 403 ||
          loadError.status === 404
        ) {
          navigate('/chat', {
            replace: true,
          })
        }
      } finally {
        incrementalLoadingRef.current = false
      }
    },
    [
      conversationId,
      loadRoom,
      navigate,
      notifyChatUpdated,
    ]
  )

  useEffect(() => {
    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()

    pollCursorRef.current = ''
    incrementalLoadingRef.current = false
    loadRoom({
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [loadRoom, navigate])

  useEffect(() => {
    if (!hasReaderSession()) {
      return undefined
    }

    const status =
      conversation?.request_status

    if (
      status !== 'accepted' &&
      status !== 'pending'
    ) {
      return undefined
    }

    const controller = new AbortController()

    const refreshMessages = () => {
      if (
        document.visibilityState !== 'visible' ||
        controller.signal.aborted
      ) {
        return
      }

      if (status === 'accepted') {
        loadIncrementalMessages({
          signal: controller.signal,
        })
        return
      }

      loadRoom({
        silent: true,
        includeMeta: false,
        signal: controller.signal,
      })
    }

    const intervalId = window.setInterval(
      refreshMessages,
      status === 'accepted' ? 15000 : 30000
    )

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        loadRoom({
          silent: true,
          includeMeta: true,
          signal: controller.signal,
        })
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      controller.abort()
      window.clearInterval(intervalId)
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [
    conversation?.request_status,
    loadIncrementalMessages,
    loadRoom,
  ])

  
  useEffect(() => {
    if (scrollRestoreRef.current) {
      const { previousHeight, previousY } =
        scrollRestoreRef.current

      scrollRestoreRef.current = null

      const nextHeight =
        document.documentElement.scrollHeight

      window.scrollTo({
        top:
          previousY +
          (nextHeight - previousHeight),
        behavior: 'auto',
      })
      return
    }

    if (shouldScrollBottomRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [messages.length])

  useEffect(() => {
    setMenuOpen(false)
    setMessageMenu(null)
    setSelectedIds(new Set())
    setReplyTarget(null)
    setEditTarget(null)
    setForwardIds([])
    setReportTarget(null)
    setInfoTarget(null)
    setDeleteChatOpen(false)
    setText('')
  }, [conversationId])

  useEffect(() => {
    if (!notice) return undefined

    const timeoutId = window.setTimeout(() => {
      setNotice('')
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notice])

  const pinIds = useMemo(
    () =>
      new Set(
        pins.map((item) =>
          String(item.message_id)
        )
      ),
    [pins]
  )

  const selectedMessages = useMemo(
    () =>
      messages.filter((message) =>
        selectedIds.has(String(message.id))
      ),
    [messages, selectedIds]
  )

  const selectionMode = selectedIds.size > 0
  const selectedAllMine =
    selectedMessages.length > 0 &&
    selectedMessages.every(
      (message) => message.is_mine
    )

  const setMessageRef = useCallback(
    (id, node) => {
      const key = String(id)

      if (node) {
        messageRefs.current.set(key, node)
      } else {
        messageRefs.current.delete(key)
      }
    },
    []
  )

  const scrollToMessage = async (messageId) => {
  const key = String(messageId || '')
  let node = messageRefs.current.get(key)
  let cursor = nextBefore
  let pages = 0

  if (!node && cursor && !loadingOlder) {
    shouldScrollBottomRef.current = false
    setLoadingOlder(true)

    try {
      while (!node && cursor && pages < 20) {
        const data = await getChatMessages(conversationId, {
          before: cursor,
          limit: 50,
        })

        const older = Array.isArray(data.messages)
          ? data.messages
          : []

        setMessages((current) =>
          mergeMessages(older, current)
        )

        cursor = data.next_before || null
        setNextBefore(cursor)
        pages += 1

        await new Promise((resolve) =>
          window.requestAnimationFrame(() =>
            window.requestAnimationFrame(resolve)
          )
        )

        node = messageRefs.current.get(key)
      }
    } catch (jumpError) {
      setError(
        jumpError.message ||
          getDisplayText('chatRoomPage.failedLoadThisMessage')
      )
      return
    } finally {
      setLoadingOlder(false)
    }
  }

  node = node || messageRefs.current.get(key)

  if (!node) {
    setError(
      getDisplayText('chatRoomPage.oldMessageUnavailable')
    )
    return
  }

  node.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  setHighlightedId(key)

  window.setTimeout(() => {
    setHighlightedId((current) =>
      current === key ? '' : current
    )
  }, 1600)
}

  useEffect(() => {
  const messageId = String(
    location.state?.jumpToMessageId || ''
  )
  const jumpKey = `${conversationId}:${messageId}`

  if (
    !messageId ||
    loading ||
    jumpHandledRef.current === jumpKey
  ) {
    return
  }

  jumpHandledRef.current = jumpKey
  scrollToMessage(messageId)

  navigate(location.pathname, {
    replace: true,
    state: null,
  })
}, [
  conversationId,
  loading,
  location.pathname,
  location.state,
  navigate,
])

  const refreshPins = async () => {
    const data = await getPinnedChatMessages(
      conversationId
    )
    setPins(
      Array.isArray(data.pins)
        ? data.pins
        : []
    )
  }

  const handleLoadOlder = async () => {
    if (
      !conversationId ||
      !nextBefore ||
      loadingOlder
    ) {
      return
    }

    scrollRestoreRef.current = {
      previousHeight:
        document.documentElement.scrollHeight,
      previousY: window.scrollY,
    }
    shouldScrollBottomRef.current = false
    setLoadingOlder(true)

    try {
      const data = await getChatMessages(
        conversationId,
        {
          before: nextBefore,
          limit: 50,
        }
      )

      const olderMessages =
        Array.isArray(data.messages)
          ? data.messages
          : []

      setMessages((current) =>
        mergeMessages(olderMessages, current)
      )
      setNextBefore(data.next_before || null)
      setError('')
    } catch (historyError) {
      scrollRestoreRef.current = null
      setError(
        historyError.message ||
          getDisplayText('chatRoomPage.failedLoadEarlier')
      )
    } finally {
      setLoadingOlder(false)
    }
  }

  const clearComposerMode = () => {
    setReplyTarget(null)
    setEditTarget(null)
    setText('')
  }

  const handleSend = async () => {
    const message = text.trim()

    if (
      !message ||
      !conversation?.can_send ||
      sending
    ) {
      return
    }

    shouldScrollBottomRef.current = true
    setSending(true)

    try {
      if (editTarget) {
        await editChatMessage(
          conversationId,
          editTarget.id,
          message
        )
        setNotice(getDisplayText('chatRoomPage.messageEdited'))
      } else if (replyTarget) {
        await replyChatMessage(
          conversationId,
          replyTarget.id,
          message
        )
      } else {
        const data = await sendChatMessage(
          conversationId,
          message
        )

        if (data.message) {
          setMessages((current) =>
            mergeMessages(current, [data.message])
          )
        }
      }

      clearComposerMode()
      setError('')
      notifyChatUpdated()
      await loadRoom({ silent: true })
    } catch (sendError) {
      setError(
        sendError.message ||
          getDisplayText('chatRoomPage.failedSend')
      )
    } finally {
      setSending(false)
    }
  }

  const handleDecision = async (action) => {
    if (busyAction) return

    if (
      action === 'block' &&
      !window.confirm(
        getDisplayText('chatRoomPage.blockConfirm')
      )
    ) {
      return
    }

    setBusyAction(action)

    try {
      if (action === 'block') {
        await blockChatConversation(conversationId)
        await loadRoom({ silent: true })
      } else {
        const data = await decideChatRequest(
          conversationId,
          action
        )
        setConversation(data.conversation || null)
      }

      setMenuOpen(false)
      setError('')
      notifyChatUpdated()
    } catch (decisionError) {
      setError(
        decisionError.message ||
          getDisplayText('chatRoomPage.failedUpdateRequest')
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleUnblock = async () => {
    if (
      busyAction ||
      !blockStatus.viewer_has_blocked
    ) {
      return
    }

    if (
      !window.confirm(
        getDisplayText('chatRoomPage.unblockConfirm')
      )
    ) {
      return
    }

    setBusyAction('unblock')

    try {
      await unblockChatConversation(conversationId)
      await loadRoom({ silent: true })
      setMenuOpen(false)
      setError('')
      notifyChatUpdated()
    } catch (unblockError) {
      setError(
        unblockError.message ||
          getDisplayText('chatRoomPage.failedUnblock')
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleArchive = async () => {
    if (busyAction || !conversationId) return

    setBusyAction('archive')

    try {
      await archiveChatConversation(conversationId)
      notifyChatUpdated()
      navigate('/chat', { replace: true })
    } catch (archiveError) {
      setError(
        archiveError.message ||
          getDisplayText('chatRoomPage.failedArchive')
      )
      setMenuOpen(false)
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteConversation = async (scope) => {
    if (busyAction || !conversationId) return

    setBusyAction(scope)

    try {
      await deleteChatConversation(
        conversationId,
        scope
      )
      notifyChatUpdated()
      navigate('/chat', { replace: true })
    } catch (deleteError) {
      setError(
        deleteError.message ||
          getDisplayText('chatRoomPage.failedDeleteConversation')
      )
      setDeleteChatOpen(false)
    } finally {
      setBusyAction('')
    }
  }

  const openMessageMenu = (
    message,
    clientX,
    clientY
  ) => {
    if (message.is_deleted) return

    const position = clampMenuPosition(
      clientX,
      clientY
    )
    setMessageMenu({
      message,
      ...position,
    })
  }

  const toggleSelection = (messageId) => {
    const key = String(messageId)

    setSelectedIds((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
        return next
      }

      if (
        next.size >=
        MAX_CHAT_MESSAGE_SELECTION
      ) {
        setError(
          getDisplayText('chatRoomPage.selectLimit', { count: MAX_CHAT_MESSAGE_SELECTION.toLocaleString(getDisplayLanguageId()) })
        )
        return current
      }

      next.add(key)
      return next
    })
  }

  const handleCopyMessages = async (items) => {
    const body = items
      .filter(
        (message) =>
          !message.is_deleted &&
          String(message.body || '').trim()
      )
      .map((message) => message.body)
      .join('\n\n')

    if (!body) {
      setError(getDisplayText('chatRoomPage.noTextToCopy'))
      return
    }

    try {
      await copyToClipboard(body)
      setNotice(getDisplayText('chatRoomPage.copied'))
    } catch {
      setError(getDisplayText('chatRoomPage.failedCopy'))
    }
  }

  const handlePinToggle = async (
    messageId,
    forceUnpin = false
  ) => {
    if (busyAction) return

    const key = String(messageId)
    const shouldUnpin =
      forceUnpin || pinIds.has(key)
    setBusyAction(
      shouldUnpin ? 'unpin' : 'pin'
    )

    try {
      if (shouldUnpin) {
        await unpinChatMessage(
          conversationId,
          messageId
        )
        setNotice(getDisplayText('chatRoomPage.messageUnpinned'))
      } else {
        await pinChatMessage(
          conversationId,
          messageId
        )
        setNotice(getDisplayText('chatRoomPage.messagePinned'))
      }

      await refreshPins()
      setMessageMenu(null)
    } catch (pinError) {
      setError(
        pinError.message ||
          getDisplayText('chatRoomPage.failedUpdatePin')
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteMessageIds = async (ids) => {
    if (!ids.length || busyAction) return

    if (
      !window.confirm(
        ids.length === 1
          ? getDisplayText('chatRoomPage.deleteOneConfirm')
          : getDisplayText('chatRoomPage.deleteManyConfirm', { count: ids.length.toLocaleString(getDisplayLanguageId()) })
      )
    ) {
      return
    }

    setBusyAction('delete')

    try {
      const data = await deleteChatMessages(
        conversationId,
        ids
      )
      const deletedIds = new Set(
        (data.deleted_message_ids || ids).map(String)
      )

      setMessages((current) =>
        current.map((message) =>
          deletedIds.has(String(message.id))
            ? {
                ...message,
                body: '',
                is_deleted: true,
                deleted_at:
                  data.deleted_at ||
                  new Date().toISOString(),
              }
            : message
        )
      )
      setPins((current) =>
        current.filter(
          (pin) =>
            !deletedIds.has(
              String(pin.message_id)
            )
        )
      )
      setSelectedIds(new Set())
      setMessageMenu(null)
      setNotice(getDisplayText('chatRoomPage.messageDeletedNotice'))
      notifyChatUpdated()
    } catch (deleteError) {
      setError(
        deleteError.message ||
          getDisplayText('chatRoomPage.failedDeleteMessage')
      )
    } finally {
      setBusyAction('')
    }
  }

  const handleMessageAction = async (
    action,
    message
  ) => {
    setMessageMenu(null)

    if (action === 'reply') {
      setEditTarget(null)
      setReplyTarget(message)
      setText('')
      window.setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
      return
    }

    if (action === 'edit') {
      setReplyTarget(null)
      setEditTarget(message)
      setText(message.body || '')
      window.setTimeout(() => {
        textareaRef.current?.focus()
        textareaRef.current?.setSelectionRange(
          message.body?.length || 0,
          message.body?.length || 0
        )
      }, 0)
      return
    }

    if (action === 'pin') {
      await handlePinToggle(message.id)
      return
    }

    if (action === 'unpin') {
      await handlePinToggle(message.id, true)
      return
    }

    if (action === 'copy') {
      await handleCopyMessages([message])
      return
    }

    if (action === 'forward') {
      setForwardIds([message.id])
      return
    }

    if (action === 'delete') {
      await handleDeleteMessageIds([message.id])
      return
    }

    if (action === 'select') {
      toggleSelection(message.id)
      return
    }

    if (action === 'info') {
      setInfoTarget(message)
      return
    }

    if (action === 'report') {
      setReportTarget(message)
    }
  }

  const handleSelectionCopy = async () => {
    await handleCopyMessages(selectedMessages)
  }

  const handleSelectionForward = () => {
    setForwardIds(
      selectedMessages
        .filter(
          (message) =>
            !message.is_deleted &&
            message.body
        )
        .map((message) => message.id)
    )
  }

  const handleSelectionDelete = async () => {
    if (!selectedAllMine) return

    await handleDeleteMessageIds(
      selectedMessages.map(
        (message) => message.id
      )
    )
  }

  const handleSelectionPin = async () => {
    if (selectedMessages.length !== 1) return

    await handlePinToggle(
      selectedMessages[0].id
    )
    setSelectedIds(new Set())
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    const textarea =
      textareaRef.current

    if (!textarea) return

    const minHeight = 46
    const maxHeight = 124

    textarea.style.height =
      `${minHeight}px`
    textarea.style.overflowY =
      'hidden'

    const contentHeight =
      textarea.scrollHeight

    textarea.style.height =
      `${Math.min(
        Math.max(
          contentHeight,
          minHeight
        ),
        maxHeight
      )}px`

    textarea.style.overflowY =
      contentHeight > maxHeight
        ? 'auto'
        : 'hidden'
  }, [text])

  const person =
    conversation?.counterpart || {}

  const isGroup =
    conversation?.is_group === true

  const canSend =
    Boolean(conversation?.can_send)

  const canOpenProfile =
    !isGroup &&
    Boolean(person.username)

  const canBlock =
    !isGroup &&
    Boolean(
      conversation &&
        !blockStatus.is_blocked
    )

  const canUnblock =
    !isGroup &&
    Boolean(
      conversation &&
        blockStatus.viewer_has_blocked
    )

  const blockedByOther =
    !isGroup &&
    Boolean(
      conversation &&
        blockStatus.viewer_is_blocked &&
        !blockStatus.viewer_has_blocked
    )

  const readTimeValue =
    !isGroup &&
    conversation?.counterpart_last_read_at
      ? new Date(
          conversation.counterpart_last_read_at
        ).getTime()
      : 0

  const counterpartReadAt =
    Number.isFinite(readTimeValue)
      ? readTimeValue
      : 0

  const handleOpenChatInfo = () => {
    setMenuOpen(false)
    navigate(
      `/chat/${conversationId}/info`
    )
  }
  const handleOpenProfile = () => {
    if (!person.username) return

    setMenuOpen(false)

    if (person.type === 'author') {
      navigate(
        `/author/page/${encodeURIComponent(
          person.username
        )}`
      )
      return
    }

    navigate(
      `/profile?username=${encodeURIComponent(
        person.username
      )}`
    )
  }

  return (
    <div className="app-page chat-room-page min-h-screen">

      <style>{`
        html.dark .chat-room-page {
          background: var(--shadow-bg-page);
          color: var(--shadow-text-primary);
        }

        html.dark .chat-room-page [class~="bg-white"],
        html.dark .chat-room-page [class~="bg-white/95"] {
          background-color: var(--shadow-bg-surface) !important;
        }

        html.dark .chat-room-page [class~="text-[#111827]"],
        html.dark .chat-room-page [class~="text-[#22222b]"],
        html.dark .chat-room-page [class~="text-[#24242c]"],
        html.dark .chat-room-page [class~="text-[#282832]"],
        html.dark .chat-room-page [class~="text-[#2a2a33]"],
        html.dark .chat-room-page [class~="text-[#33333c]"],
        html.dark .chat-room-page [class~="text-[#34343d]"],
        html.dark .chat-room-page [class~="text-[#3a3a43]"],
        html.dark .chat-room-page [class~="text-[#4a4655]"],
        html.dark .chat-room-page [class~="text-[#4f4f59]"] {
          color: var(--shadow-text-primary) !important;
        }

        html.dark .chat-room-page [class~="text-[#555560]"],
        html.dark .chat-room-page [class~="text-[#5c5c65]"],
        html.dark .chat-room-page [class~="text-[#5d5d67]"],
        html.dark .chat-room-page [class~="text-[#6c6875]"],
        html.dark .chat-room-page [class~="text-[#6f6b78]"],
        html.dark .chat-room-page [class~="text-[#746b85]"],
        html.dark .chat-room-page [class~="text-[#777781]"],
        html.dark .chat-room-page [class~="text-[#8c8c96]"],
        html.dark .chat-room-page [class~="text-[#8e8e98]"],
        html.dark .chat-room-page [class~="text-[#8e8e97]"],
        html.dark .chat-room-page [class~="text-[#91919b]"],
        html.dark .chat-room-page [class~="text-[#92929c]"],
        html.dark .chat-room-page [class~="text-[#9696a0]"],
        html.dark .chat-room-page [class~="text-[#9898a2]"],
        html.dark .chat-room-page [class~="text-[#9b9ba4]"] {
          color: var(--shadow-text-secondary) !important;
        }

        html.dark .chat-room-page [class~="bg-[#f4f4f6]"],
        html.dark .chat-room-page [class~="bg-[#f5f5f7]"],
        html.dark .chat-room-page [class~="bg-[#f7f7f9]"],
        html.dark .chat-room-page [class~="bg-[#f2f2f4]"] {
          background-color: var(--shadow-bg-soft) !important;
        }

        html.dark .chat-room-page [class~="bg-[#f7f3ff]"],
        html.dark .chat-room-page [class~="bg-[#f4efff]"],
        html.dark .chat-room-page [class~="bg-[#f5f1ff]"],
        html.dark .chat-room-page [class~="bg-[#f8f5ff]"],
        html.dark .chat-room-page [class~="bg-[#e9e0ff]"],
        html.dark .chat-room-page [class~="bg-[#faf8ff]/95"] {
          background-color: rgb(124 58 237 / 0.14) !important;
        }

        html.dark .chat-room-page [class~="bg-[#fff0a8]"] {
          background-color: rgb(245 158 11 / 0.18) !important;
        }

        html.dark .chat-room-page [class~="bg-[#fff0f1]"],
        html.dark .chat-room-page [class~="bg-[#fff1f1]"] {
          background-color: rgb(229 72 77 / 0.13) !important;
        }

        html.dark .chat-room-page [class~="text-[#c7353d]"],
        html.dark .chat-room-page [class~="text-[#c1353b]"],
        html.dark .chat-room-page [class~="text-[#bd3038]"],
        html.dark .chat-room-page [class~="text-[#a64a50]"],
        html.dark .chat-room-page [class~="text-[#a8787c]"] {
          color: #fca5a5 !important;
        }

        html.dark .chat-room-page [class~="border-[#ececf0]"],
        html.dark .chat-room-page [class~="border-[#eceaf2]"],
        html.dark .chat-room-page [class~="border-[#e9e7ef]"],
        html.dark .chat-room-page [class~="border-[#e9e9ed]"],
        html.dark .chat-room-page [class~="border-[#ededf1]"],
        html.dark .chat-room-page [class~="border-[#e4e4e8]"],
        html.dark .chat-room-page [class~="border-[#dedee4]"],
        html.dark .chat-room-page [class~="border-[#d7d7dc]"],
        html.dark .chat-room-page [class~="border-[#ded9ea]"],
        html.dark .chat-room-page [class~="border-[#e6e6ea]"],
        html.dark .chat-room-page [class~="border-[#e6e0f5]"],
        html.dark .chat-room-page [class~="border-[#bbb9c2]"] {
          border-color: var(--shadow-border) !important;
        }

        html.dark .chat-room-page [class~="border-[#ded4fa]"],
        html.dark .chat-room-page [class~="border-[#e9e4f7]"] {
          border-color: rgb(124 58 237 / 0.28) !important;
        }

        html.dark .chat-room-page [class~="border-[#f0c8ca]"],
        html.dark .chat-room-page [class~="border-[#f1d5d7]"] {
          border-color: rgb(248 113 113 / 0.28) !important;
        }

        html.dark .chat-room-page [class~="hover:bg-[#f4f4f6]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f7f5fb]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f5f5f7]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f6f4f9]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f6f3fb]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f7f7f9]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f3effc]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#f4f2f7]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-white"]:hover {
          background-color: var(--shadow-bg-hover) !important;
        }

        html.dark .chat-room-page [class~="active:bg-[#ededf0]"]:active,
        html.dark .chat-room-page [class~="active:bg-[#f1edf8]"]:active,
        html.dark .chat-room-page [class~="active:bg-[#eee8f8]"]:active {
          background-color: var(--shadow-bg-hover) !important;
        }

        html.dark .chat-room-page [class~="hover:bg-[#fff1f1]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#fff3f4]"]:hover,
        html.dark .chat-room-page [class~="active:bg-[#ffe8e9]"]:active {
          background-color: rgb(229 72 77 / 0.16) !important;
        }

        html.dark .chat-room-page [class~="hover:bg-[#eee8ff]"]:hover,
        html.dark .chat-room-page [class~="hover:bg-[#ece6fa]"]:hover {
          background-color: rgb(124 58 237 / 0.18) !important;
        }

        html.dark .chat-room-page input,
        html.dark .chat-room-page textarea,
        html.dark .chat-room-page select {
          color: var(--shadow-text-primary);
          caret-color: var(--shadow-text-primary);
        }

        html.dark .chat-room-page textarea[class~="bg-[#f7f7f9]"],
        html.dark .chat-room-page select[class~="bg-white"],
        html.dark .chat-room-page textarea[class~="bg-white"] {
          background-color: var(--shadow-input-bg) !important;
          border-color: var(--shadow-border) !important;
        }

        html.dark .chat-room-page [class~="focus:bg-white"]:focus {
          background-color: var(--shadow-input-bg) !important;
        }

        html.dark .chat-room-page [class~="text-[#7b5bc5]"],
        html.dark .chat-room-page [class~="text-[#7552c6]"],
        html.dark .chat-room-page [class~="text-[#705b9d]"],
        html.dark .chat-room-page [class~="text-[#6f52b5]"],
        html.dark .chat-room-page [class~="text-[#5f4a96]"] {
          color: #b8a2ff !important;
        }

        html.dark .chat-room-page [class~="bg-[#f1edf8]"],
        html.dark .chat-room-page [class~="bg-[#eee8f8]"],
        html.dark .chat-room-page [class~="bg-[#ece6fa]"] {
          background-color: var(--shadow-bg-hover) !important;
        }

        html.dark .chat-room-page option {
          background: var(--shadow-bg-elevated);
          color: var(--shadow-text-primary);
        }
      `}</style>
      <header className="sticky top-0 z-[80] border-b border-[#e9e9ed] bg-white/95 backdrop-blur-xl">
        <div className="relative mx-auto flex h-[64px] max-w-[620px] items-center gap-3 px-3">
          {selectionMode ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setSelectedIds(new Set())
                }
                aria-label={t('chatRoomPage.exitSelection')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition active:scale-90"
              >
                <X size={24} />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-[14px] font-extrabold text-[#111827]">
                  {t('chatRoomPage.selectedCount', {
                    selected: selectedIds.size.toLocaleString(getDisplayLanguageId()),
                    max: MAX_CHAT_MESSAGE_SELECTION.toLocaleString(getDisplayLanguageId()),
                  })}
                </h1>
              </div>

              <button
                type="button"
                onClick={handleSelectionCopy}
                disabled={Boolean(busyAction)}
                aria-label={t('chatRoomPage.copySelected')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f4a96] transition hover:bg-[#f3effc] active:scale-90 disabled:opacity-40"
              >
                <Copy size={18} />
              </button>

              <button
                type="button"
                onClick={handleSelectionForward}
                disabled={Boolean(busyAction)}
                aria-label={t('chatRoomPage.forwardSelected')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f4a96] transition hover:bg-[#f3effc] active:scale-90 disabled:opacity-40"
              >
                <Forward size={18} />
              </button>

              <button
                type="button"
                onClick={handleSelectionPin}
                disabled={
                  selectedMessages.length !== 1 ||
                  Boolean(busyAction)
                }
                aria-label={t('chatRoomPage.pinSelected')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5f4a96] transition hover:bg-[#f3effc] active:scale-90 disabled:opacity-30"
              >
                <Pin size={18} />
              </button>

              <button
                type="button"
                onClick={handleSelectionDelete}
                disabled={
                  !selectedAllMine ||
                  Boolean(busyAction)
                }
                aria-label={t('chatRoomPage.deleteSelected')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#c7353d] transition hover:bg-[#fff0f1] active:scale-90 disabled:opacity-30"
              >
                {busyAction === 'delete' ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/chat')}
                aria-label={t('chatRoomPage.backMessages')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition active:scale-90"
              >
                <ChevronLeft
                  size={27}
                  strokeWidth={2}
                />
              </button>

              <button
                type="button"
                onClick={handleOpenChatInfo}
                aria-label={t('chatRoomPage.openChatInfo')}
                className="shrink-0 rounded-full disabled:cursor-default"
              >
                <RoomAvatar person={person} />
              </button>

              <button
                type="button"
                onClick={handleOpenChatInfo}
                className="min-w-0 flex-1 text-left"
              >
                <h1 className="truncate text-[14px] font-extrabold text-[#111827]">
                  {person.name || t('chatRoomPage.conversation')}
                </h1>
                <p className="truncate text-[10px] font-semibold text-[#92929c]">
                  {isGroup
                    ? t('chatRoomPage.people', { count: Number(conversation?.member_count || 0).toLocaleString(getDisplayLanguageId()) })
                    : person.username
                      ? `@${person.username}`
                      : conversation
                            ?.request_status ===
                          'accepted'
                        ? t('chatRoomPage.messages')
                        : t('chatRoomPage.messageRequest')}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (current) => !current
                  )
                }
                aria-label={t('chatRoomPage.conversationOptions')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition hover:bg-[#f4f2f7] active:scale-90"
              >
                <EllipsisVertical size={21} />
              </button>

              <ConversationMenu
                isGroup={isGroup}
                open={menuOpen}
                canOpenProfile={canOpenProfile}
                canBlock={canBlock}
                canUnblock={canUnblock}
                blockedByOther={blockedByOther}
                busyAction={busyAction}
                onClose={() => setMenuOpen(false)}
                onOpenProfile={handleOpenProfile}
                onArchive={handleArchive}
                onDelete={() => {
                  setMenuOpen(false)
                  setDeleteChatOpen(true)
                }}
                onBlock={() =>
                  handleDecision('block')
                }
                onUnblock={handleUnblock}
              />
            </>
          )}
        </div>
      </header>

      <PinnedBanner
        pin={pins[0]}
        busy={busyAction === 'unpin'}
        onJump={scrollToMessage}
        onUnpin={(messageId) =>
          handlePinToggle(messageId, true)
        }
      />

      <main className="mx-auto max-w-[620px] pb-[136px]">
        {notice ? (
          <div className="fixed left-1/2 top-[82px] z-[115] -translate-x-1/2 rounded-full bg-[#22222a] px-4 py-2 text-[11px] font-bold text-white shadow-xl">
            {notice}
          </div>
        ) : null}

        {error ? (
          <button
            type="button"
            onClick={() => setError('')}
            className="mx-4 mt-4 block w-[calc(100%_-_2rem)] rounded-[16px] bg-[#fff0f1] px-4 py-3 text-left text-[11px] font-bold text-[#c7353d]"
          >
            {error}
          </button>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-28 text-[#8c8c96]">
            <LoaderCircle
              size={28}
              className="animate-spin"
            />
          </div>
        ) : conversation ? (
          <>
            <RequestPanel
              conversation={conversation}
              blockStatus={blockStatus}
              busyAction={busyAction}
              onDecision={handleDecision}
            />

            <div className="space-y-2.5 px-3 py-5 sm:px-4">
              {nextBefore ? (
                <div className="flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={handleLoadOlder}
                    disabled={loadingOlder}
                    className="flex h-10 items-center justify-center gap-2 rounded-full border border-[#ded9ea] bg-white px-4 text-[11px] font-extrabold text-[#6f52b5] shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingOlder ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <ChevronUp size={16} />
                    )}
                    {t('chatRoomPage.loadEarlier')}
                  </button>
                </div>
              ) : null}

              {messages.length ? (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    selected={selectedIds.has(
                      String(message.id)
                    )}
                    selectionMode={selectionMode}
                    highlighted={
                      highlightedId ===
                      String(message.id)
                    }
                    isPinned={pinIds.has(
                      String(message.id)
                    )}
                    isRead={
                      !isGroup &&
                      message.is_mine &&
                      counterpartReadAt > 0 &&
                      new Date(
                        message.created_at
                      ).getTime() <=
                        counterpartReadAt
                    }
                    setMessageRef={setMessageRef}
                    onOpenMenu={openMessageMenu}
                    onToggleSelection={toggleSelection}
                    onJumpToReply={scrollToMessage}
                  />
                ))
              ) : (
                <p className="py-20 text-center text-[12px] font-semibold text-[#9898a2]">
                  {t('chatRoomPage.noMessages')}
                </p>
              )}

              <div ref={bottomRef} />
            </div>
          </>
        ) : null}
      </main>

      {!selectionMode ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-[90] border-t border-[#e6e6ea] bg-white/95 backdrop-blur-xl"
          style={{
            paddingBottom:
              'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <div className="mx-auto max-w-[620px] px-3 py-2.5">
            {replyTarget || editTarget ? (
              <div className="mb-2 flex items-center gap-3 rounded-[14px] border border-[#e6e0f5] bg-[#f8f5ff] px-3 py-2">
                <span className="min-w-0 flex-1 border-l-[3px] border-[#7c3aed] pl-2.5">
                  <span className="block text-[9px] font-extrabold uppercase tracking-wide text-[#7552c6]">
                    {editTarget
                      ? t('chatRoomPage.editingMessage')
                      : t('chatRoomPage.replyingTo', {
                          name: replyTarget?.sender?.name ||
                            (replyTarget?.is_mine
                              ? t('chatRoomPage.yourself')
                              : t('chatRoomPage.replyMessage')),
                        })}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-semibold text-[#6c6875]">
                    {(editTarget || replyTarget)?.body}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={clearComposerMode}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#7552c6] transition hover:bg-[#ece6fa] active:scale-90"
                                >
                  <X size={17} />
                </button>
              </div>
            ) : null}

            <div className="relative">
              <textarea
  ref={textareaRef}
  value={text}
  onChange={(event) =>
    setText(
      event.target.value.slice(0, 2000)
    )
  }
  onKeyDown={handleKeyDown}
  disabled={!canSend || sending}
  rows={1}
  placeholder={
    canSend
      ? editTarget
        ? t('chatRoomPage.editPlaceholder')
        : replyTarget
          ? t('chatRoomPage.replyPlaceholder')
          : t('chatRoomPage.messagePlaceholder')
      : conversation?.request_status === 'pending'
        ? t('chatRoomPage.waitingApproval')
        : t('chatRoomPage.messagesUnavailable')
  }
  style={{ fontFamily: "'Kantumruy Pro', 'Noto Sans Khmer', sans-serif" }}
  className="block max-h-[124px] min-h-[46px] w-full resize-none overflow-y-hidden rounded-[24px] border border-[#dedee4] bg-[#f7f7f9] py-[12px] pl-[52px] pr-[52px] text-[13px] leading-5 text-[#111827] outline-none transition focus:border-[#9b7be8] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
/>

              <button
                type="button"
                onClick={() => setNotice(getDisplayText('chatRoomPage.comingSoon'))}
                disabled={!canSend || sending}
                aria-label={
                  text.trim()
                    ? t('chatRoomPage.searchMessages')
                    : t('chatRoomPage.camera')
                }
                className="absolute inset-y-0 left-[7px] my-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#7c3aed] to-[#9b6df2] text-white transition active:scale-90 disabled:opacity-45"
              >
                {text.trim() ? (
                  <Search size={19} />
                ) : (
                  <Camera size={20} />
                )}
              </button>

              {!text.trim() ? (
  <button
    type="button"
    onClick={() => setNotice(getDisplayText('chatRoomPage.comingSoon'))}
    disabled={!canSend || sending}
    aria-label={t('chatRoomPage.image')}
    className="absolute inset-y-0 right-[39px] my-auto flex h-8 w-8 items-center justify-center bg-transparent text-[#111827] transition active:scale-90 disabled:opacity-45"
  >
    <Image size={20} />
  </button>
) : null}

              <button
                type="button"
                onClick={
                  text.trim()
                    ? handleSend
                    : () =>
                        setNotice(getDisplayText('chatRoomPage.comingSoon'))
                }
                disabled={!canSend || sending}
                aria-label={
                  text.trim()
                    ? editTarget
                      ? t('chatRoomPage.saveEdit')
                      : t('chatRoomPage.sendMessage')
                    : t('chatRoomPage.emoji')
                }
                className={`absolute inset-y-0 right-[7px] my-auto flex h-8 w-8 items-center justify-center transition active:scale-90 disabled:opacity-45 ${
  text.trim()
    ? 'rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white'
    : 'bg-transparent text-[#111827]'
}`}
              >
                {sending ? (
                  <LoaderCircle
                    size={19}
                    className="animate-spin"
                  />
                ) : text.trim() ? (
                  editTarget ? (
                    <Check size={20} />
                  ) : (
                    <Send
                      size={19}
                      strokeWidth={2.2}
                    />
                  )
                ) : (
                  <Smile size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MessageActionMenu
        state={messageMenu}
        isPinned={
          messageMenu?.message
            ? pinIds.has(
                String(messageMenu.message.id)
              )
            : false
        }
        busy={busyAction}
        onClose={() => setMessageMenu(null)}
        onAction={handleMessageAction}
      />

      <ForwardModal
        open={forwardIds.length > 0}
        currentConversationId={conversationId}
        messageIds={forwardIds}
        onClose={() => setForwardIds([])}
        onForwarded={() => {
          setForwardIds([])
          setSelectedIds(new Set())
          setNotice(getDisplayText('chatRoomPage.messageForwarded'))
          notifyChatUpdated()
        }}
      />

      <ReportModal
        message={reportTarget}
        conversationId={conversationId}
        onClose={() => setReportTarget(null)}
        onSubmitted={() => {
          setReportTarget(null)
          setNotice(getDisplayText('chatRoomPage.reportSubmitted'))
        }}
      />

      <MessageInfoModal
        message={infoTarget}
        onClose={() => setInfoTarget(null)}
      />

      {deleteChatOpen ? (
        <DeleteConversationModal
          conversation={conversation}
          busy={
            busyAction === 'for_me' ||
            busyAction === 'for_both'
              ? busyAction
              : ''
          }
          onClose={() => {
            if (!busyAction) {
              setDeleteChatOpen(false)
            }
          }}
          onDelete={handleDeleteConversation}
        />
      ) : null}
    </div>
  )
}
