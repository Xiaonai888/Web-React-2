import {
  Ban,
  Bell,
  Check,
  ChevronLeft,
  Clock3,
  EyeOff,
  FileImage,
  FileText,
  Flag,
  Link2,
  LoaderCircle,
  MoreHorizontal,
  Pin,
  Search,
  ShieldAlert,
  Trash2,
  UserRound,
  UsersRound,
  VolumeX,
  X,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  blockChatConversation,
  deleteChatConversation,
  getChatBlockStatus,
  getChatMessages,
  getChatNicknames,
  getPinnedChatMessages,
  hasReaderSession,
  reportChatMessage,
  unblockChatConversation,
  unpinChatMessage,
  updateChatNickname,
} from '../../services/chatApi'
import {
  getChatMuteStatus,
  muteChatConversation,
  unmuteChatConversation,
} from '../../services/chatMuteApi'
import {
  getChatAutoDeleteStatus,
  setChatAutoDelete,
} from '../../services/chatAutoDeleteApi'
import ChatGroupCreateSheet from '../../components/chat/ChatGroupCreateSheet'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatInfoPage', {
  en: {
    spam: "Spam",
    harassment: "Harassment or bullying",
    hate: "Hate or abusive content",
    sexualContent: "Sexual or inappropriate content",
    violence: "Violence or threats",
    scam: "Scam or suspicious links",
    impersonation: "Impersonation",
    privacyReason: "Privacy or personal information",
    other: "Something else",
    mute1Hour: "1 hour",
    mute8Hours: "8 hours",
    mute1Day: "1 day",
    mute7Days: "7 days",
    muteUntilOn: "Until I turn it back on",
    off: "Off",
    auto1Day: "1 day",
    auto7Days: "7 days",
    auto30Days: "30 days",
    close: "Close",
    conversation: "Conversation",
    failedLoadInfo: "Failed to load chat info",
    failedLoadSearch: "Failed to load messages for search",
    failedLoadNicknames: "Failed to load nicknames",
    nicknameUpdated: "Nickname updated",
    nicknameRemoved: "Nickname removed",
    failedUpdateNickname: "Failed to update nickname",
    failedLoadPinned: "Failed to load pinned messages",
    messageUnpinned: "Message unpinned",
    failedUnpinMessage: "Failed to unpin message",
    chatMuted: "Chat muted",
    failedMuteChat: "Failed to mute chat",
    chatUnmuted: "Chat unmuted",
    failedUnmuteChat: "Failed to unmute chat",
    notificationsOn: "Notifications turned on",
    notificationsOff: "Notifications turned off",
    failedUpdateNotifications: "Failed to update notifications",
    autoDeleteSet: "Auto-delete set to {{duration}}",
    autoDeleteOff: "Auto-delete turned off",
    failedUpdateAutoDelete: "Failed to update auto-delete",
    unblockConfirm: "Unblock this account?",
    blockConfirm: "Block this account and stop messages?",
    accountUnblocked: "Account unblocked",
    accountBlocked: "Account blocked",
    failedUpdateBlock: "Failed to update block",
    noReceivedReport: "No received message is available to report.",
    reportSubmitted: "Report submitted",
    failedSubmitReport: "Failed to submit report",
    deleteBothConfirm: "Delete this chat for both people?",
    deleteMeConfirm: "Delete this chat from your inbox?",
    failedDeleteChat: "Failed to delete chat",
    backToInfo: "Back to chat info",
    searchInChat: "Search in chat",
    clearSearch: "Clear search",
    searchThisChat: "Search this chat",
    searchHelp: "Enter one or more words. The words can appear anywhere in the message and do not need to be typed as one exact phrase.",
    resultOne: "1 result",
    resultMany: "{{count}} results",
    you: "You",
    noMessagesFound: "No messages found",
    tryAnotherSearch: "Try another word or a shorter part of the message.",
    backToChat: "Back to chat",
    peopleCount: "{{count}} people",
    profile: "Profile",
    search: "Search",
    mute: "Mute",
    options: "Options",
    closeOptions: "Close options",
    restrictComingSoon: "Restrict is coming soon.",
    restrict: "Restrict",
    unblock: "Unblock",
    block: "Block",
    report: "Report",
    disappearingMessages: "Disappearing messages",
    privacySafety: "Privacy & safety",
    nicknames: "Nicknames",
    createGroup: "Create a group chat",
    sharedMedia: "Shared media",
    seeAll: "See all",
    noSharedMedia: "No shared media yet",
    muteNotifications: "Mute notifications",
    muteDescription: "Choose how long you want to mute notifications from this chat.",
    sharedTitle: "Media, files & links",
    media: "Media",
    files: "Files",
    links: "Links",
    noMediaYet: "No media yet",
    noFilesYet: "No files yet",
    noLinksYet: "No links yet",
    pinnedMessages: "Pinned messages",
    pinnedMessage: "Pinned message",
    message: "Message",
    unpinMessage: "Unpin message",
    noPinnedMessages: "No pinned messages",
    pinHelp: "Pin a message from the chat and it will appear here.",
    editNickname: "Edit nickname",
    setSelfNickname: "Set a nickname for yourself in this chat.",
    setPersonNickname: "Set a nickname for {{name}} in this chat.",
    nickname: "Nickname",
    save: "Save",
    removeNickname: "Remove nickname",
    addNickname: "Add nickname",
    noParticipants: "No chat participants found",
    autoDeleteMessages: "Auto-delete messages",
    autoDeleteDescription: "This setting applies to new messages sent after it is enabled. Existing messages keep their current lifetime.",
    autoDeleteSafety: "Expired messages disappear from the chat automatically. Shadow’s safety retention remains separate from what users can see.",
    reportChat: "Report this chat",
    reportHelp: "Choose the reason that best describes the problem in this conversation.",
    addDetails: "Add details (optional)",
    submitReport: "Submit report",
    deleteChat: "Delete chat",
    deleteForMe: "Delete for me",
    deleteForBoth: "Delete for both",
  },
  km: {
    spam: "សារឥតបានការ",
    harassment: "ការរំខាន ឬការគំរាមកំហែង",
    hate: "ខ្លឹមសារស្អប់ខ្ពើម ឬប្រមាថ",
    sexualContent: "ខ្លឹមសារផ្លូវភេទ ឬមិនសមរម្យ",
    violence: "អំពើហិង្សា ឬការគំរាម",
    scam: "បោកប្រាស់ ឬតំណគួរឱ្យសង្ស័យ",
    impersonation: "ក្លែងបន្លំអត្តសញ្ញាណ",
    privacyReason: "ព័ត៌មានឯកជន ឬព័ត៌មានផ្ទាល់ខ្លួន",
    other: "មូលហេតុផ្សេង",
    mute1Hour: "1 ម៉ោង",
    mute8Hours: "8 ម៉ោង",
    mute1Day: "1 ថ្ងៃ",
    mute7Days: "7 ថ្ងៃ",
    muteUntilOn: "រហូតដល់ខ្ញុំបើកវិញ",
    off: "បិទ",
    auto1Day: "1 ថ្ងៃ",
    auto7Days: "7 ថ្ងៃ",
    auto30Days: "30 ថ្ងៃ",
    close: "បិទ",
    conversation: "ការសន្ទនា",
    failedLoadInfo: "មិនអាចផ្ទុកព័ត៌មាន chat បានទេ",
    failedLoadSearch: "មិនអាចផ្ទុកសារសម្រាប់ស្វែងរកបានទេ",
    failedLoadNicknames: "មិនអាចផ្ទុកឈ្មោះហៅក្រៅបានទេ",
    nicknameUpdated: "បានធ្វើបច្ចុប្បន្នភាពឈ្មោះហៅក្រៅ",
    nicknameRemoved: "បានដកឈ្មោះហៅក្រៅ",
    failedUpdateNickname: "មិនអាចធ្វើបច្ចុប្បន្នភាពឈ្មោះហៅក្រៅបានទេ",
    failedLoadPinned: "មិនអាចផ្ទុកសារដែលបាន pin បានទេ",
    messageUnpinned: "បានដក pin សារ",
    failedUnpinMessage: "មិនអាចដក pin សារបានទេ",
    chatMuted: "បានបិទសំឡេង chat",
    failedMuteChat: "មិនអាចបិទសំឡេង chat បានទេ",
    chatUnmuted: "បានបើកសំឡេង chat",
    failedUnmuteChat: "មិនអាចបើកសំឡេង chat បានទេ",
    notificationsOn: "បានបើកការជូនដំណឹង",
    notificationsOff: "បានបិទការជូនដំណឹង",
    failedUpdateNotifications: "មិនអាចធ្វើបច្ចុប្បន្នភាពការជូនដំណឹងបានទេ",
    autoDeleteSet: "បានកំណត់លុបស្វ័យប្រវត្តិជា {{duration}}",
    autoDeleteOff: "បានបិទការលុបស្វ័យប្រវត្តិ",
    failedUpdateAutoDelete: "មិនអាចធ្វើបច្ចុប្បន្នភាពការលុបស្វ័យប្រវត្តិបានទេ",
    unblockConfirm: "ដោះប្លុកគណនីនេះមែនទេ?",
    blockConfirm: "ប្លុកគណនីនេះ និងបញ្ឈប់ការផ្ញើសារមែនទេ?",
    accountUnblocked: "បានដោះប្លុកគណនី",
    accountBlocked: "បានប្លុកគណនី",
    failedUpdateBlock: "មិនអាចធ្វើបច្ចុប្បន្នភាពប្លុកបានទេ",
    noReceivedReport: "មិនមានសារដែលបានទទួលសម្រាប់រាយការណ៍ទេ។",
    reportSubmitted: "បានផ្ញើរបាយការណ៍",
    failedSubmitReport: "មិនអាចផ្ញើរបាយការណ៍បានទេ",
    deleteBothConfirm: "លុប chat នេះសម្រាប់មនុស្សទាំងពីរមែនទេ?",
    deleteMeConfirm: "លុប chat នេះចេញពីប្រអប់សាររបស់អ្នកមែនទេ?",
    failedDeleteChat: "មិនអាចលុប chat បានទេ",
    backToInfo: "ត្រឡប់ទៅព័ត៌មាន chat",
    searchInChat: "ស្វែងរកក្នុង chat",
    clearSearch: "សម្អាតការស្វែងរក",
    searchThisChat: "ស្វែងរកក្នុង chat នេះ",
    searchHelp: "បញ្ចូលពាក្យមួយ ឬច្រើន។ ពាក្យអាចស្ថិតនៅកន្លែងណាក៏បានក្នុងសារ ហើយមិនចាំបាច់ជាឃ្លាតែមួយទេ។",
    resultOne: "1 លទ្ធផល",
    resultMany: "{{count}} លទ្ធផល",
    you: "អ្នក",
    noMessagesFound: "រកមិនឃើញសារ",
    tryAnotherSearch: "សាកពាក្យផ្សេង ឬផ្នែកខ្លីជាងនេះនៃសារ។",
    backToChat: "ត្រឡប់ទៅ chat",
    peopleCount: "{{count}} នាក់",
    profile: "ប្រវត្តិរូប",
    search: "ស្វែងរក",
    mute: "បិទសំឡេង",
    options: "ជម្រើស",
    closeOptions: "បិទជម្រើស",
    restrictComingSoon: "មុខងារ Restrict នឹងមកដល់ឆាប់ៗនេះ។",
    restrict: "កំណត់កម្រិត",
    unblock: "ដោះប្លុក",
    block: "ប្លុក",
    report: "រាយការណ៍",
    disappearingMessages: "សារដែលបាត់ដោយស្វ័យប្រវត្តិ",
    privacySafety: "ឯកជនភាព និងសុវត្ថិភាព",
    nicknames: "ឈ្មោះហៅក្រៅ",
    createGroup: "បង្កើត chat ក្រុម",
    sharedMedia: "មេឌៀដែលបានចែករំលែក",
    seeAll: "មើលទាំងអស់",
    noSharedMedia: "មិនទាន់មានមេឌៀដែលបានចែករំលែកទេ",
    muteNotifications: "បិទសំឡេងជូនដំណឹង",
    muteDescription: "ជ្រើសរយៈពេលដែលអ្នកចង់បិទសំឡេងជូនដំណឹងពី chat នេះ។",
    sharedTitle: "មេឌៀ ឯកសារ និងតំណ",
    media: "មេឌៀ",
    files: "ឯកសារ",
    links: "តំណ",
    noMediaYet: "មិនទាន់មានមេឌៀទេ",
    noFilesYet: "មិនទាន់មានឯកសារទេ",
    noLinksYet: "មិនទាន់មានតំណទេ",
    pinnedMessages: "សារដែលបាន pin",
    pinnedMessage: "សារដែលបាន pin",
    message: "សារ",
    unpinMessage: "ដក pin សារ",
    noPinnedMessages: "មិនមានសារដែលបាន pin",
    pinHelp: "Pin សារពី chat ហើយវានឹងបង្ហាញនៅទីនេះ។",
    editNickname: "កែឈ្មោះហៅក្រៅ",
    setSelfNickname: "កំណត់ឈ្មោះហៅក្រៅសម្រាប់ខ្លួនអ្នកក្នុង chat នេះ។",
    setPersonNickname: "កំណត់ឈ្មោះហៅក្រៅសម្រាប់ {{name}} ក្នុង chat នេះ។",
    nickname: "ឈ្មោះហៅក្រៅ",
    save: "រក្សាទុក",
    removeNickname: "ដកឈ្មោះហៅក្រៅ",
    addNickname: "បន្ថែមឈ្មោះហៅក្រៅ",
    noParticipants: "រកមិនឃើញអ្នកចូលរួម chat",
    autoDeleteMessages: "លុបសារស្វ័យប្រវត្តិ",
    autoDeleteDescription: "ការកំណត់នេះអនុវត្តចំពោះសារថ្មីដែលផ្ញើបន្ទាប់ពីបើកវា។ សារចាស់រក្សារយៈពេលបច្ចុប្បន្នដដែល។",
    autoDeleteSafety: "សារដែលផុតកំណត់នឹងបាត់ពី chat ដោយស្វ័យប្រវត្តិ។ ការរក្សាទុកសម្រាប់សុវត្ថិភាពរបស់ Shadow ដាច់ដោយឡែកពីអ្វីដែលអ្នកប្រើអាចមើលឃើញ។",
    reportChat: "រាយការណ៍ chat នេះ",
    reportHelp: "ជ្រើសមូលហេតុដែលពិពណ៌នាបញ្ហាក្នុងការសន្ទនានេះបានល្អបំផុត។",
    addDetails: "បន្ថែមព័ត៌មានលម្អិត (មិនចាំបាច់)",
    submitReport: "ផ្ញើរបាយការណ៍",
    deleteChat: "លុប chat",
    deleteForMe: "លុបសម្រាប់ខ្ញុំ",
    deleteForBoth: "លុបសម្រាប់ទាំងពីរ",
  },
  zh: {
    spam: "垃圾信息",
    harassment: "骚扰或欺凌",
    hate: "仇恨或辱骂内容",
    sexualContent: "色情或不当内容",
    violence: "暴力或威胁",
    scam: "诈骗或可疑链接",
    impersonation: "冒充他人",
    privacyReason: "隐私或个人信息",
    other: "其他",
    mute1Hour: "1 小时",
    mute8Hours: "8 小时",
    mute1Day: "1 天",
    mute7Days: "7 天",
    muteUntilOn: "直到我重新开启",
    off: "关闭",
    auto1Day: "1 天",
    auto7Days: "7 天",
    auto30Days: "30 天",
    close: "关闭",
    conversation: "聊天",
    failedLoadInfo: "无法加载聊天信息",
    failedLoadSearch: "无法加载用于搜索的消息",
    failedLoadNicknames: "无法加载昵称",
    nicknameUpdated: "昵称已更新",
    nicknameRemoved: "昵称已移除",
    failedUpdateNickname: "无法更新昵称",
    failedLoadPinned: "无法加载置顶消息",
    messageUnpinned: "已取消置顶消息",
    failedUnpinMessage: "无法取消置顶消息",
    chatMuted: "聊天已静音",
    failedMuteChat: "无法静音聊天",
    chatUnmuted: "聊天已恢复声音",
    failedUnmuteChat: "无法恢复聊天声音",
    notificationsOn: "通知已开启",
    notificationsOff: "通知已关闭",
    failedUpdateNotifications: "无法更新通知",
    autoDeleteSet: "自动删除已设为 {{duration}}",
    autoDeleteOff: "自动删除已关闭",
    failedUpdateAutoDelete: "无法更新自动删除",
    unblockConfirm: "解除屏蔽此账号？",
    blockConfirm: "屏蔽此账号并停止消息？",
    accountUnblocked: "已解除屏蔽账号",
    accountBlocked: "已屏蔽账号",
    failedUpdateBlock: "无法更新屏蔽状态",
    noReceivedReport: "没有可举报的已接收消息。",
    reportSubmitted: "举报已提交",
    failedSubmitReport: "无法提交举报",
    deleteBothConfirm: "为双方删除此聊天？",
    deleteMeConfirm: "从收件箱中删除此聊天？",
    failedDeleteChat: "无法删除聊天",
    backToInfo: "返回聊天信息",
    searchInChat: "在聊天中搜索",
    clearSearch: "清除搜索",
    searchThisChat: "搜索此聊天",
    searchHelp: "输入一个或多个词。它们可以出现在消息中的任何位置，无需组成完整连续短语。",
    resultOne: "1 个结果",
    resultMany: "{{count}} 个结果",
    you: "你",
    noMessagesFound: "未找到消息",
    tryAnotherSearch: "试试其他词或消息中更短的一部分。",
    backToChat: "返回聊天",
    peopleCount: "{{count}} 人",
    profile: "资料",
    search: "搜索",
    mute: "静音",
    options: "选项",
    closeOptions: "关闭选项",
    restrictComingSoon: "限制功能即将推出。",
    restrict: "限制",
    unblock: "解除屏蔽",
    block: "屏蔽",
    report: "举报",
    disappearingMessages: "自动消失消息",
    privacySafety: "隐私与安全",
    nicknames: "昵称",
    createGroup: "创建群聊",
    sharedMedia: "共享媒体",
    seeAll: "查看全部",
    noSharedMedia: "暂无共享媒体",
    muteNotifications: "静音通知",
    muteDescription: "选择此聊天的通知静音时长。",
    sharedTitle: "媒体、文件和链接",
    media: "媒体",
    files: "文件",
    links: "链接",
    noMediaYet: "暂无媒体",
    noFilesYet: "暂无文件",
    noLinksYet: "暂无链接",
    pinnedMessages: "置顶消息",
    pinnedMessage: "置顶消息",
    message: "消息",
    unpinMessage: "取消置顶消息",
    noPinnedMessages: "暂无置顶消息",
    pinHelp: "在聊天中置顶消息后，它会显示在这里。",
    editNickname: "编辑昵称",
    setSelfNickname: "为自己在此聊天中设置昵称。",
    setPersonNickname: "为 {{name}} 在此聊天中设置昵称。",
    nickname: "昵称",
    save: "保存",
    removeNickname: "移除昵称",
    addNickname: "添加昵称",
    noParticipants: "未找到聊天参与者",
    autoDeleteMessages: "自动删除消息",
    autoDeleteDescription: "此设置仅适用于启用后发送的新消息。现有消息保持当前有效期。",
    autoDeleteSafety: "过期消息会自动从聊天中消失。Shadow 的安全保留机制与用户可见内容分开。",
    reportChat: "举报此聊天",
    reportHelp: "选择最符合此聊天中问题的原因。",
    addDetails: "添加详情（可选）",
    submitReport: "提交举报",
    deleteChat: "删除聊天",
    deleteForMe: "仅为我删除",
    deleteForBoth: "为双方删除",
  },
  ja: {
    spam: "スパム",
    harassment: "嫌がらせ・いじめ",
    hate: "ヘイト・虐待的な内容",
    sexualContent: "性的・不適切な内容",
    violence: "暴力・脅迫",
    scam: "詐欺・不審なリンク",
    impersonation: "なりすまし",
    privacyReason: "プライバシー・個人情報",
    other: "その他",
    mute1Hour: "1時間",
    mute8Hours: "8時間",
    mute1Day: "1日",
    mute7Days: "7日",
    muteUntilOn: "再びオンにするまで",
    off: "オフ",
    auto1Day: "1日",
    auto7Days: "7日",
    auto30Days: "30日",
    close: "閉じる",
    conversation: "会話",
    failedLoadInfo: "チャット情報を読み込めませんでした",
    failedLoadSearch: "検索用メッセージを読み込めませんでした",
    failedLoadNicknames: "ニックネームを読み込めませんでした",
    nicknameUpdated: "ニックネームを更新しました",
    nicknameRemoved: "ニックネームを削除しました",
    failedUpdateNickname: "ニックネームを更新できませんでした",
    failedLoadPinned: "固定メッセージを読み込めませんでした",
    messageUnpinned: "メッセージの固定を解除しました",
    failedUnpinMessage: "メッセージの固定を解除できませんでした",
    chatMuted: "チャットをミュートしました",
    failedMuteChat: "チャットをミュートできませんでした",
    chatUnmuted: "チャットのミュートを解除しました",
    failedUnmuteChat: "チャットのミュートを解除できませんでした",
    notificationsOn: "通知をオンにしました",
    notificationsOff: "通知をオフにしました",
    failedUpdateNotifications: "通知を更新できませんでした",
    autoDeleteSet: "自動削除を {{duration}} に設定しました",
    autoDeleteOff: "自動削除をオフにしました",
    failedUpdateAutoDelete: "自動削除を更新できませんでした",
    unblockConfirm: "このアカウントのブロックを解除しますか？",
    blockConfirm: "このアカウントをブロックしてメッセージを停止しますか？",
    accountUnblocked: "アカウントのブロックを解除しました",
    accountBlocked: "アカウントをブロックしました",
    failedUpdateBlock: "ブロック状態を更新できませんでした",
    noReceivedReport: "報告できる受信メッセージがありません。",
    reportSubmitted: "報告を送信しました",
    failedSubmitReport: "報告を送信できませんでした",
    deleteBothConfirm: "このチャットを双方から削除しますか？",
    deleteMeConfirm: "このチャットを受信トレイから削除しますか？",
    failedDeleteChat: "チャットを削除できませんでした",
    backToInfo: "チャット情報に戻る",
    searchInChat: "チャット内を検索",
    clearSearch: "検索をクリア",
    searchThisChat: "このチャットを検索",
    searchHelp: "1つ以上の単語を入力してください。単語はメッセージ内のどこにあってもよく、完全に連続したフレーズである必要はありません。",
    resultOne: "1件の結果",
    resultMany: "{{count}}件の結果",
    you: "あなた",
    noMessagesFound: "メッセージが見つかりません",
    tryAnotherSearch: "別の単語か、メッセージのより短い部分を試してください。",
    backToChat: "チャットに戻る",
    peopleCount: "{{count}}人",
    profile: "プロフィール",
    search: "検索",
    mute: "ミュート",
    options: "オプション",
    closeOptions: "オプションを閉じる",
    restrictComingSoon: "制限機能は近日公開予定です。",
    restrict: "制限",
    unblock: "ブロック解除",
    block: "ブロック",
    report: "報告",
    disappearingMessages: "消えるメッセージ",
    privacySafety: "プライバシーと安全",
    nicknames: "ニックネーム",
    createGroup: "グループチャットを作成",
    sharedMedia: "共有メディア",
    seeAll: "すべて見る",
    noSharedMedia: "共有メディアはまだありません",
    muteNotifications: "通知をミュート",
    muteDescription: "このチャットの通知をミュートする時間を選択してください。",
    sharedTitle: "メディア・ファイル・リンク",
    media: "メディア",
    files: "ファイル",
    links: "リンク",
    noMediaYet: "メディアはまだありません",
    noFilesYet: "ファイルはまだありません",
    noLinksYet: "リンクはまだありません",
    pinnedMessages: "固定メッセージ",
    pinnedMessage: "固定メッセージ",
    message: "メッセージ",
    unpinMessage: "固定を解除",
    noPinnedMessages: "固定メッセージはありません",
    pinHelp: "チャットでメッセージを固定すると、ここに表示されます。",
    editNickname: "ニックネームを編集",
    setSelfNickname: "このチャットで自分のニックネームを設定します。",
    setPersonNickname: "このチャットで {{name}} のニックネームを設定します。",
    nickname: "ニックネーム",
    save: "保存",
    removeNickname: "ニックネームを削除",
    addNickname: "ニックネームを追加",
    noParticipants: "チャット参加者が見つかりません",
    autoDeleteMessages: "メッセージの自動削除",
    autoDeleteDescription: "この設定は有効化後に送信された新しいメッセージに適用されます。既存メッセージの有効期間は変わりません。",
    autoDeleteSafety: "期限切れメッセージはチャットから自動的に消えます。Shadow の安全保持はユーザーに見える内容とは別です。",
    reportChat: "このチャットを報告",
    reportHelp: "この会話の問題に最も当てはまる理由を選択してください。",
    addDetails: "詳細を追加（任意）",
    submitReport: "報告を送信",
    deleteChat: "チャットを削除",
    deleteForMe: "自分だけ削除",
    deleteForBoth: "双方から削除",
  },
  ko: {
    spam: "스팸",
    harassment: "괴롭힘 또는 따돌림",
    hate: "혐오 또는 학대성 콘텐츠",
    sexualContent: "성적이거나 부적절한 콘텐츠",
    violence: "폭력 또는 위협",
    scam: "사기 또는 의심스러운 링크",
    impersonation: "사칭",
    privacyReason: "개인정보 또는 사생활 정보",
    other: "기타",
    mute1Hour: "1시간",
    mute8Hours: "8시간",
    mute1Day: "1일",
    mute7Days: "7일",
    muteUntilOn: "다시 켤 때까지",
    off: "끔",
    auto1Day: "1일",
    auto7Days: "7일",
    auto30Days: "30일",
    close: "닫기",
    conversation: "대화",
    failedLoadInfo: "채팅 정보를 불러오지 못했습니다",
    failedLoadSearch: "검색용 메시지를 불러오지 못했습니다",
    failedLoadNicknames: "별명을 불러오지 못했습니다",
    nicknameUpdated: "별명을 업데이트했습니다",
    nicknameRemoved: "별명을 삭제했습니다",
    failedUpdateNickname: "별명을 업데이트하지 못했습니다",
    failedLoadPinned: "고정된 메시지를 불러오지 못했습니다",
    messageUnpinned: "메시지 고정을 해제했습니다",
    failedUnpinMessage: "메시지 고정을 해제하지 못했습니다",
    chatMuted: "채팅을 음소거했습니다",
    failedMuteChat: "채팅을 음소거하지 못했습니다",
    chatUnmuted: "채팅 음소거를 해제했습니다",
    failedUnmuteChat: "채팅 음소거를 해제하지 못했습니다",
    notificationsOn: "알림을 켰습니다",
    notificationsOff: "알림을 껐습니다",
    failedUpdateNotifications: "알림을 업데이트하지 못했습니다",
    autoDeleteSet: "자동 삭제를 {{duration}}로 설정했습니다",
    autoDeleteOff: "자동 삭제를 껐습니다",
    failedUpdateAutoDelete: "자동 삭제를 업데이트하지 못했습니다",
    unblockConfirm: "이 계정의 차단을 해제할까요?",
    blockConfirm: "이 계정을 차단하고 메시지를 중지할까요?",
    accountUnblocked: "계정 차단을 해제했습니다",
    accountBlocked: "계정을 차단했습니다",
    failedUpdateBlock: "차단 상태를 업데이트하지 못했습니다",
    noReceivedReport: "신고할 수 있는 받은 메시지가 없습니다.",
    reportSubmitted: "신고를 제출했습니다",
    failedSubmitReport: "신고를 제출하지 못했습니다",
    deleteBothConfirm: "이 채팅을 양쪽 모두에서 삭제할까요?",
    deleteMeConfirm: "받은편지함에서 이 채팅을 삭제할까요?",
    failedDeleteChat: "채팅을 삭제하지 못했습니다",
    backToInfo: "채팅 정보로 돌아가기",
    searchInChat: "채팅에서 검색",
    clearSearch: "검색 지우기",
    searchThisChat: "이 채팅 검색",
    searchHelp: "하나 이상의 단어를 입력하세요. 단어는 메시지 어디에나 있을 수 있으며 정확히 이어진 문구일 필요는 없습니다.",
    resultOne: "결과 1개",
    resultMany: "결과 {{count}}개",
    you: "나",
    noMessagesFound: "메시지를 찾을 수 없습니다",
    tryAnotherSearch: "다른 단어나 메시지의 더 짧은 부분을 입력해 보세요.",
    backToChat: "채팅으로 돌아가기",
    peopleCount: "{{count}}명",
    profile: "프로필",
    search: "검색",
    mute: "음소거",
    options: "옵션",
    closeOptions: "옵션 닫기",
    restrictComingSoon: "제한 기능이 곧 제공됩니다.",
    restrict: "제한",
    unblock: "차단 해제",
    block: "차단",
    report: "신고",
    disappearingMessages: "사라지는 메시지",
    privacySafety: "개인정보 및 안전",
    nicknames: "별명",
    createGroup: "그룹 채팅 만들기",
    sharedMedia: "공유 미디어",
    seeAll: "모두 보기",
    noSharedMedia: "아직 공유 미디어가 없습니다",
    muteNotifications: "알림 음소거",
    muteDescription: "이 채팅의 알림을 음소거할 시간을 선택하세요.",
    sharedTitle: "미디어, 파일 및 링크",
    media: "미디어",
    files: "파일",
    links: "링크",
    noMediaYet: "아직 미디어가 없습니다",
    noFilesYet: "아직 파일이 없습니다",
    noLinksYet: "아직 링크가 없습니다",
    pinnedMessages: "고정된 메시지",
    pinnedMessage: "고정된 메시지",
    message: "메시지",
    unpinMessage: "메시지 고정 해제",
    noPinnedMessages: "고정된 메시지가 없습니다",
    pinHelp: "채팅에서 메시지를 고정하면 여기에 표시됩니다.",
    editNickname: "별명 편집",
    setSelfNickname: "이 채팅에서 내 별명을 설정합니다.",
    setPersonNickname: "이 채팅에서 {{name}}님의 별명을 설정합니다.",
    nickname: "별명",
    save: "저장",
    removeNickname: "별명 삭제",
    addNickname: "별명 추가",
    noParticipants: "채팅 참여자를 찾을 수 없습니다",
    autoDeleteMessages: "메시지 자동 삭제",
    autoDeleteDescription: "이 설정은 활성화된 후 전송되는 새 메시지에 적용됩니다. 기존 메시지는 현재 수명을 유지합니다.",
    autoDeleteSafety: "만료된 메시지는 채팅에서 자동으로 사라집니다. Shadow의 안전 보관은 사용자가 볼 수 있는 내용과 별개입니다.",
    reportChat: "이 채팅 신고",
    reportHelp: "이 대화의 문제를 가장 잘 설명하는 이유를 선택하세요.",
    addDetails: "세부 정보 추가(선택)",
    submitReport: "신고 제출",
    deleteChat: "채팅 삭제",
    deleteForMe: "나에게서 삭제",
    deleteForBoth: "양쪽 모두에서 삭제",
  },
})

const REPORT_REASONS = [
  ['spam', 'spam'],
  ['harassment', 'harassment'],
  ['hate', 'hate'],
  ['sexual_content', 'sexualContent'],
  ['violence', 'violence'],
  ['scam', 'scam'],
  ['impersonation', 'impersonation'],
  ['privacy', 'privacyReason'],
  ['other', 'other'],
]

const MAX_SEARCH_MESSAGES = 1000

const MUTE_OPTIONS = [
  ['1h', 'mute1Hour'],
  ['8h', 'mute8Hours'],
  ['1d', 'mute1Day'],
  ['7d', 'mute7Days'],
  ['forever', 'muteUntilOn'],
]

const AUTO_DELETE_OPTIONS = [
  [0, 'off'],
  [86400, 'auto1Day'],
  [604800, 'auto7Days'],
  [2592000, 'auto30Days'],
]

function formatAutoDeleteDuration(value) {
  const seconds = Number(value || 0)

  if (seconds === 86400) return getDisplayText('chatInfoPage.auto1Day')
  if (seconds === 604800) return getDisplayText('chatInfoPage.auto7Days')
  if (seconds === 2592000) return getDisplayText('chatInfoPage.auto30Days')

  return getDisplayText('chatInfoPage.off')
}

function normalizeMessageSearchValue(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^\p{L}\p{N}@._-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatSearchMessageDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(getDisplayLanguageId(), {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function extractSharedUrls(value) {
  return (
    String(value || '').match(
      /https?:\/\/[^\s<>"']+/gi
    ) || []
  ).map((url) =>
    url.replace(/[),.;!?]+$/g, '')
  )
}

function isImageUrl(value) {
  try {
    return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(
      new URL(value).pathname
    )
  } catch {
    return false
  }
}

function classifySharedUrl(value) {
  try {
    const path = new URL(value).pathname

    if (
      /\.(jpg|jpeg|png|webp|gif|avif|mp4|webm|mov)$/i.test(
        path
      )
    ) {
      return 'media'
    }

    if (
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt|epub)$/i.test(
        path
      )
    ) {
      return 'files'
    }
  } catch {
    return 'links'
  }

  return 'links'
}

function getSharedUrlLabel(value) {
  try {
    return new URL(value).hostname.replace(
      /^www\./,
      ''
    )
  } catch {
    return value
  }
}

function Avatar({ person }) {
  const [failed, setFailed] = useState(false)
  const name = String(
    person?.name ||
      person?.page_name ||
      person?.username ||
      'Shadow'
  ).trim()
  const avatar =
    person?.avatar_url ||
    person?.profile_image_url ||
    ''

  useEffect(() => {
    setFailed(false)
  }, [avatar])

  return (
    <span className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full bg-[#111827] text-[30px] font-bold text-white">
      {avatar && !failed ? (
        <img
          src={avatar}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        name.charAt(0).toUpperCase() || 'S'
      )}
    </span>
  )
}

function Shortcut({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-0 flex-1 flex-col items-center gap-2 text-[#111827] active:opacity-60"
    >
      <span className="flex h-10 w-10 items-center justify-center">
        <Icon size={27} strokeWidth={1.9} />
      </span>
      <span className="text-[12px] font-normal">
        {label}
      </span>
    </button>
  )
}

function Row({
  icon: Icon,
  title,
  subtitle = '',
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[58px] w-full items-center gap-4 px-1 text-left active:bg-[#f7f7f9] ${
        danger ? 'text-[#d13a42]' : 'text-[#111827]'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon size={22} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-normal">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-[11px] font-normal text-[#8a8a95]">
            {subtitle}
          </span>
        ) : null}
      </span>
    </button>
  )
}

function Sheet({ title, children, onClose }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/35 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t('chatInfoPage.close')}
        onClick={onClose}
        className="absolute inset-0"
      />
      <section className="relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-4 sm:max-w-[460px] sm:rounded-[24px]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111827]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-full px-3 text-[12px] font-semibold text-[#6b7280]"
          >
            {t('chatInfoPage.close')}
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}


function ChatInfoThemeBridge() {
  return (
    <style>{`
      html.dark .chat-info-page {
        background: var(--shadow-bg-page);
        color: var(--shadow-text-primary);
      }

      html.dark .chat-info-page [class~="bg-white"],
      html.dark .chat-info-page [class~="bg-white/95"] {
        background-color: var(--shadow-bg-surface) !important;
      }

      html.dark .chat-info-page [class~="text-[#111827]"],
      html.dark .chat-info-page [class~="text-[#22222b]"],
      html.dark .chat-info-page [class~="text-[#2f2f37]"],
      html.dark .chat-info-page [class~="text-[#4b4b54]"] {
        color: var(--shadow-text-primary) !important;
      }

      html.dark .chat-info-page [class~="text-[#55515e]"],
      html.dark .chat-info-page [class~="text-[#6b7280]"],
      html.dark .chat-info-page [class~="text-[#777480]"],
      html.dark .chat-info-page [class~="text-[#777781]"],
      html.dark .chat-info-page [class~="text-[#7b7b85]"],
      html.dark .chat-info-page [class~="text-[#85858f]"],
      html.dark .chat-info-page [class~="text-[#868690]"],
      html.dark .chat-info-page [class~="text-[#888892]"],
      html.dark .chat-info-page [class~="text-[#8a8792]"],
      html.dark .chat-info-page [class~="text-[#8a8a95]"],
      html.dark .chat-info-page [class~="text-[#8b8b95]"],
      html.dark .chat-info-page [class~="text-[#92929b]"],
      html.dark .chat-info-page [class~="text-[#94919b]"],
      html.dark .chat-info-page [class~="text-[#9999a2]"] {
        color: var(--shadow-text-secondary) !important;
      }

      html.dark .chat-info-page [class~="placeholder:text-[#92929b]"]::placeholder,
      html.dark .chat-info-page [class~="placeholder:text-[#94919b]"]::placeholder {
        color: var(--shadow-placeholder) !important;
      }

      html.dark .chat-info-page [class~="bg-[#ececf0]"],
      html.dark .chat-info-page [class~="bg-[#f1f1f4]"],
      html.dark .chat-info-page [class~="bg-[#f2f2f5]"],
      html.dark .chat-info-page [class~="bg-[#f2f3f5]"],
      html.dark .chat-info-page [class~="bg-[#f3f2f6]"],
      html.dark .chat-info-page [class~="bg-[#f3f3f6]"],
      html.dark .chat-info-page [class~="bg-[#f4f4f6]"],
      html.dark .chat-info-page [class~="bg-[#f4f4f7]"],
      html.dark .chat-info-page [class~="bg-[#f5f5f7]"],
      html.dark .chat-info-page [class~="bg-[#f6f6f8]"],
      html.dark .chat-info-page [class~="bg-[#f7f7f9]"] {
        background-color: var(--shadow-bg-soft) !important;
      }

      html.dark .chat-info-page [class~="bg-[#f2edff]"] {
        background-color: rgb(124 58 237 / 0.14) !important;
      }

      html.dark .chat-info-page [class~="bg-[#fff0f1]"] {
        background-color: rgb(229 72 77 / 0.13) !important;
      }

      html.dark .chat-info-page [class~="text-[#d13a42]"],
      html.dark .chat-info-page [class~="text-[#c7353d]"] {
        color: #fca5a5 !important;
      }

      html.dark .chat-info-page [class~="border-[#ececf0]"],
      html.dark .chat-info-page [class~="border-[#dedee4]"],
      html.dark .chat-info-page [class~="border-[#e8e8ec]"],
      html.dark .chat-info-page [class~="border-[#efeff2]"],
      html.dark .chat-info-page [class~="border-[#f0f0f3]"],
      html.dark .chat-info-page [class~="border-[#f4f4f6]"],
      html.dark .chat-info-page [class~="border-[#d8d6df]"] {
        border-color: var(--shadow-border) !important;
      }

      html.dark .chat-info-page [class~="divide-[#efeff2]"] > :not([hidden]) ~ :not([hidden]) {
        border-color: var(--shadow-border) !important;
      }

      html.dark .chat-info-page [class~="border-white"] {
        border-color: var(--shadow-border) !important;
      }

      html.dark .chat-info-page [class~="bg-[#d6d4dc]"] {
        background-color: var(--shadow-border-strong) !important;
      }

      html.dark .chat-info-page [class~="active:bg-[#f3f4f6]"]:active,
      html.dark .chat-info-page [class~="active:bg-[#dedee4]"]:active,
      html.dark .chat-info-page [class~="active:bg-[#f7f7f9]"]:active,
      html.dark .chat-info-page [class~="active:bg-[#f4f4f6]"]:active,
      html.dark .chat-info-page [class~="active:bg-[#ececf0]"]:active {
        background-color: var(--shadow-bg-hover) !important;
      }

      html.dark .chat-info-page [class~="active:bg-[#ece7f8]"]:active {
        background-color: rgb(124 58 237 / 0.18) !important;
      }

      html.dark .chat-info-page [class~="active:bg-[#fff1f2]"]:active {
        background-color: rgb(229 72 77 / 0.16) !important;
      }

      html.dark .chat-info-page [class~="focus:bg-[#eeeeF2]"]:focus {
        background-color: var(--shadow-input-bg) !important;
      }

      html.dark .chat-info-page input,
      html.dark .chat-info-page textarea,
      html.dark .chat-info-page select {
        background-color: var(--shadow-input-bg);
        border-color: var(--shadow-border);
        color: var(--shadow-text-primary);
        caret-color: var(--shadow-text-primary);
      }

      html.dark .chat-info-page option {
        background: var(--shadow-bg-elevated);
        color: var(--shadow-text-primary);
      }
    `}</style>
  )
}

export default function ChatInfoPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { conversationId } = useParams()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [blockStatus, setBlockStatus] = useState({
    is_blocked: false,
    viewer_has_blocked: false,
    viewer_is_blocked: false,
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('spam')
  const [reportDetails, setReportDetails] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMessages, setSearchMessages] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchLoaded, setSearchLoaded] = useState(false)
  const [muteOpen, setMuteOpen] = useState(false)
  const [muteStatus, setMuteStatus] = useState({
    is_muted: false,
    muted_until: null,
  })
  const [autoDeleteOpen, setAutoDeleteOpen] = useState(false)
  const [autoDeleteStatus, setAutoDeleteStatus] = useState({
    auto_delete_enabled: false,
    auto_delete_seconds: 0,
  })
  const [pinnedOpen, setPinnedOpen] = useState(false)
  const [pinnedItems, setPinnedItems] = useState([])
  const [pinnedLoading, setPinnedLoading] = useState(false)
  const [pinnedError, setPinnedError] = useState('')
  const [pinnedBusyId, setPinnedBusyId] = useState('')
  const [sharedOpen, setSharedOpen] = useState(false)
  const [sharedTab, setSharedTab] = useState('media')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [nicknamesOpen, setNicknamesOpen] = useState(false)
  const [nicknameLoading, setNicknameLoading] = useState(false)
  const [nicknameParticipants, setNicknameParticipants] = useState([])
  const [nicknameEditor, setNicknameEditor] = useState(null)
  const [nicknameDraft, setNicknameDraft] = useState('')
  const [nicknameBusy, setNicknameBusy] = useState(false)
  const [groupCreateOpen, setGroupCreateOpen] = useState(false)

  const person = conversation?.counterpart || {}
  const name =
    person.name ||
    person.page_name ||
    person.username ||
    t('chatInfoPage.conversation')
  const username =
    person.username ||
    person.page_username ||
    ''
  const isGroup =
  conversation?.is_group === true

const canDeleteForBoth =
  !isGroup &&
  (conversation?.conversation_type === 'reader_reader' ||
    conversation?.delete_permissions?.can_delete_for_both === true)

  const reportMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find(
          (message) =>
            !message.is_mine &&
            !message.is_deleted &&
            message.id
        ) || null,
    [messages]
  )

  const normalizedSearchQuery = useMemo(
    () => normalizeMessageSearchValue(searchQuery),
    [searchQuery]
  )

  const searchResults = useMemo(() => {
    if (!normalizedSearchQuery) return []

    const terms = normalizedSearchQuery
      .split(' ')
      .filter(Boolean)

    return searchMessages
      .filter(
        (message) =>
          !message.is_deleted &&
          String(message.body || '').trim()
      )
      .filter((message) => {
        const body = normalizeMessageSearchValue(
          message.body
        )

        return terms.every((term) =>
          body.includes(term)
        )
      })
      .sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime()
      )
  }, [normalizedSearchQuery, searchMessages])

  const sharedContent = useMemo(() => {
    const source = searchLoaded
      ? searchMessages
      : messages
    const items = []
    const seen = new Set()

    source.forEach((message) => {
      if (message.is_deleted) return

      const addItem = ({
        url,
        kind,
        image = false,
        name = '',
      }) => {
        if (!url || seen.has(url)) return

        seen.add(url)
        items.push({
          id: `${message.id}:${url}`,
          url,
          kind,
          image,
          name:
            name ||
            getSharedUrlLabel(url),
          created_at: message.created_at,
        })
      }

      if (message.attachment_url) {
        const attachmentKind =
          message.attachment_kind === 'file'
            ? 'files'
            : ['image', 'video'].includes(
                  message.attachment_kind
                )
              ? 'media'
              : classifySharedUrl(
                  message.attachment_url
                )

        addItem({
          url: message.attachment_url,
          kind: attachmentKind,
          image:
            message.attachment_kind === 'image' ||
            isImageUrl(
              message.attachment_url
            ),
          name:
            message.attachment_name || '',
        })
      }

      extractSharedUrls(message.body).forEach(
        (url) => {
          addItem({
            url,
            kind: classifySharedUrl(url),
            image: isImageUrl(url),
          })
        }
      )
    })

    return {
      media: items.filter(
        (item) => item.kind === 'media'
      ),
      files: items.filter(
        (item) => item.kind === 'files'
      ),
      links: items.filter(
        (item) => item.kind === 'links'
      ),
    }
  }, [
    messages,
    searchLoaded,
    searchMessages,
  ])

  const activeSharedItems =
    sharedContent[sharedTab] || []

  const notifyUpdated = () => {
    window.dispatchEvent(new CustomEvent('shadow-chat-updated'))
  }

  const showNotice = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const loadInfo = async () => {
    if (!conversationId) return

    if (!hasReaderSession()) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setLoading(true)

const roomData = await getChatMessages(
  conversationId,
  { limit: 50 }
)

const roomConversation =
  roomData.conversation || null

const roomIsGroup =
  roomConversation?.is_group === true

const [
  blockData,
  muteData,
  autoDeleteData,
] = await Promise.all([
  roomIsGroup
    ? Promise.resolve({
        block_status: {
          is_blocked: false,
          viewer_has_blocked: false,
          viewer_is_blocked: false,
        },
      })
    : getChatBlockStatus(conversationId),
  getChatMuteStatus(conversationId),
  getChatAutoDeleteStatus(conversationId),
])

setConversation(roomConversation)

setMessages(
  Array.isArray(roomData.messages)
    ? roomData.messages
    : []
)

setBlockStatus({
  is_blocked: Boolean(
    blockData.block_status?.is_blocked
  ),
  viewer_has_blocked: Boolean(
    blockData.block_status?.viewer_has_blocked
  ),
  viewer_is_blocked: Boolean(
    blockData.block_status?.viewer_is_blocked
  ),
})

setMuteStatus({
  is_muted: Boolean(muteData.is_muted),
  muted_until: muteData.muted_until || null,
})

setAutoDeleteStatus({
  auto_delete_enabled: Boolean(
    autoDeleteData.auto_delete_enabled
  ),
  auto_delete_seconds: Number(
    autoDeleteData.auto_delete_seconds || 0
  ),
})
    } catch (error) {
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 404
      ) {
        navigate('/chat', { replace: true })
        return
      }

      showNotice(error.message || t('chatInfoPage.failedLoadInfo'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInfo()
  }, [conversationId])

  const loadSearchHistory = async () => {
    if (
      searchLoading ||
      searchLoaded ||
      !conversationId
    ) {
      return
    }

    setSearchLoading(true)

    try {
      let before = ''
      let collected = []
      let pageCount = 0

      do {
        const data = await getChatMessages(
          conversationId,
          {
            before,
            limit: 100,
          }
        )

        const pageMessages = Array.isArray(
          data.messages
        )
          ? data.messages
          : []

        const messageMap = new Map(
          collected.map((message) => [
            String(message.id),
            message,
          ])
        )

        pageMessages.forEach((message) => {
          if (message?.id) {
            messageMap.set(
              String(message.id),
              message
            )
          }
        })

        collected = [...messageMap.values()]
        before = data.next_before || ''
        pageCount += 1
      } while (
        before &&
        collected.length < MAX_SEARCH_MESSAGES &&
        pageCount < 10
      )

      setSearchMessages(
        collected.slice(-MAX_SEARCH_MESSAGES)
      )
      setSearchLoaded(true)
    } catch (error) {
      showNotice(
        error.message ||
          t('chatInfoPage.failedLoadSearch')
      )
    } finally {
      setSearchLoading(false)
    }
  }

  const openSearch = () => {
    setSearchOpen(true)
    setSearchQuery('')

    if (!searchLoaded) {
      loadSearchHistory()
    }
  }

  const openSharedContent = () => {
    setSharedTab('media')
    setSharedOpen(true)

    if (!searchLoaded) {
      loadSearchHistory()
    }
  }

  const openNicknames = async () => {
    if (!conversationId || nicknameLoading) return

    setNicknamesOpen(true)
    setNicknameEditor(null)
    setNicknameDraft('')
    setNicknameLoading(true)

    try {
      const data = await getChatNicknames(
        conversationId
      )

      setNicknameParticipants(
        Array.isArray(data.participants)
          ? data.participants
          : []
      )
    } catch (error) {
      setNicknameParticipants([])
      showNotice(
        error.message ||
          t('chatInfoPage.failedLoadNicknames')
      )
    } finally {
      setNicknameLoading(false)
    }
  }

  const openNicknameEditor = (participant) => {
    if (!participant?.user_id) return

    setNicknameEditor(participant)
    setNicknameDraft(
      String(participant.nickname || '')
    )
  }

  const saveNickname = async (
    nickname = nicknameDraft
  ) => {
    if (
      !conversationId ||
      !nicknameEditor?.user_id ||
      nicknameBusy
    ) {
      return
    }

    setNicknameBusy(true)

    try {
      const data = await updateChatNickname(
        conversationId,
        nicknameEditor.user_id,
        String(nickname || '').trim()
      )
      const updated = data.participant

      setNicknameParticipants((current) =>
        current.map((participant) =>
          String(participant.user_id) ===
          String(updated?.user_id)
            ? {
                ...participant,
                nickname:
                  updated?.nickname || null,
              }
            : participant
        )
      )

      setNicknameEditor(null)
      setNicknameDraft('')
      notifyUpdated()
      showNotice(
        updated?.nickname
          ? t('chatInfoPage.nicknameUpdated')
          : t('chatInfoPage.nicknameRemoved')
      )
    } catch (error) {
      showNotice(
        error.message ||
          t('chatInfoPage.failedUpdateNickname')
      )
    } finally {
      setNicknameBusy(false)
    }
  }

  const openProfile = () => {
    if (!username) return

    if (person.type === 'author') {
      navigate(`/author/page/${encodeURIComponent(username)}`)
      return
    }

    navigate(`/profile?username=${encodeURIComponent(username)}`)
  }

  const openPinnedMessages = async () => {
    if (!conversationId) return

    setPinnedOpen(true)
    setPinnedLoading(true)
    setPinnedError('')

    try {
      const data = await getPinnedChatMessages(
        conversationId
      )

      setPinnedItems(
        Array.isArray(data.pins)
          ? data.pins
          : []
      )
    } catch (error) {
      setPinnedError(
        error.message ||
          t('chatInfoPage.failedLoadPinned')
      )
    } finally {
      setPinnedLoading(false)
    }
  }

  const handleUnpinPinnedMessage = async (
    messageId
  ) => {
    if (pinnedBusyId) return

    setPinnedBusyId(String(messageId))
    setPinnedError('')

    try {
      await unpinChatMessage(
        conversationId,
        messageId
      )

      setPinnedItems((current) =>
        current.filter(
          (pin) =>
            String(pin.message_id) !==
              String(messageId) &&
            String(pin.message?.id) !==
              String(messageId)
        )
      )
      notifyUpdated()
      showNotice(t('chatInfoPage.messageUnpinned'))
    } catch (error) {
      setPinnedError(
        error.message ||
          t('chatInfoPage.failedUnpinMessage')
      )
    } finally {
      setPinnedBusyId('')
    }
  }

  const handleMute = async (duration) => {
    if (busy) return

    setBusy('mute')

    try {
      const data = await muteChatConversation(
        conversationId,
        duration
      )

      setMuteStatus({
        is_muted: true,
        muted_until: data.muted_until || null,
      })
      setMuteOpen(false)
      notifyUpdated()
      showNotice(t('chatInfoPage.chatMuted'))
    } catch (error) {
      showNotice(
        error.message || t('chatInfoPage.failedMuteChat')
      )
    } finally {
      setBusy('')
    }
  }

  const handleUnmute = async () => {
    if (busy) return

    setBusy('unmute')

    try {
      await unmuteChatConversation(
        conversationId
      )
      setMuteStatus({
        is_muted: false,
        muted_until: null,
      })
      notifyUpdated()
      showNotice(t('chatInfoPage.chatUnmuted'))
    } catch (error) {
      showNotice(
        error.message || t('chatInfoPage.failedUnmuteChat')
      )
    } finally {
      setBusy('')
    }
  }

  const handleToggleNotifications = async () => {
    if (busy) return

    const turningOn = muteStatus.is_muted
    setBusy('notifications')

    try {
      if (turningOn) {
        await unmuteChatConversation(conversationId)
        setMuteStatus({
          is_muted: false,
          muted_until: null,
        })
      } else {
        await muteChatConversation(
          conversationId,
          'forever'
        )
        setMuteStatus({
          is_muted: true,
          muted_until: null,
        })
      }

      notifyUpdated()
      showNotice(
        turningOn
          ? t('chatInfoPage.notificationsOn')
          : t('chatInfoPage.notificationsOff')
      )
    } catch (error) {
      showNotice(
        error.message ||
          t('chatInfoPage.failedUpdateNotifications')
      )
    } finally {
      setBusy('')
    }
  }

  const handleAutoDelete = async (seconds) => {
    if (busy) return

    setBusy('auto-delete')

    try {
      const data = await setChatAutoDelete(
        conversationId,
        seconds
      )

      setAutoDeleteStatus({
        auto_delete_enabled: Boolean(
          data.auto_delete_enabled
        ),
        auto_delete_seconds: Number(
          data.auto_delete_seconds || 0
        ),
      })
      setAutoDeleteOpen(false)
      notifyUpdated()
      showNotice(
        Number(data.auto_delete_seconds || 0) > 0
          ? t('chatInfoPage.autoDeleteSet', { duration: formatAutoDeleteDuration(data.auto_delete_seconds) })
          : t('chatInfoPage.autoDeleteOff')
      )
    } catch (error) {
      showNotice(
        error.message ||
          t('chatInfoPage.failedUpdateAutoDelete')
      )
    } finally {
      setBusy('')
    }
  }

  const handleBlock = async () => {
    if (busy) return

    const unblocking = blockStatus.viewer_has_blocked
    if (
      !window.confirm(
        unblocking
          ? t('chatInfoPage.unblockConfirm')
          : t('chatInfoPage.blockConfirm')
      )
    ) {
      return
    }

    setBusy(unblocking ? 'unblock' : 'block')

    try {
      if (unblocking) {
        await unblockChatConversation(conversationId)
      } else {
        await blockChatConversation(conversationId)
      }

      await loadInfo()
      notifyUpdated()
      showNotice(unblocking ? t('chatInfoPage.accountUnblocked') : t('chatInfoPage.accountBlocked'))
    } catch (error) {
      showNotice(error.message || t('chatInfoPage.failedUpdateBlock'))
    } finally {
      setBusy('')
    }
  }

  const handleReport = async () => {
    if (!reportMessage) {
      showNotice(t('chatInfoPage.noReceivedReport'))
      return
    }

    if (busy === 'report') return
    setBusy('report')

    try {
      await reportChatMessage(conversationId, reportMessage.id, {
        reason: reportReason,
        details: reportDetails.trim(),
      })
      setReportOpen(false)
      setReportDetails('')
      showNotice(t('chatInfoPage.reportSubmitted'))
    } catch (error) {
      showNotice(error.message || t('chatInfoPage.failedSubmitReport'))
    } finally {
      setBusy('')
    }
  }

  const handleDelete = async (scope) => {
    if (busy) return

    if (
      !window.confirm(
        scope === 'for_both'
          ? t('chatInfoPage.deleteBothConfirm')
          : t('chatInfoPage.deleteMeConfirm')
      )
    ) {
      return
    }

    setBusy(scope)

    try {
      await deleteChatConversation(conversationId, scope)
      notifyUpdated()
      navigate('/chat', { replace: true })
    } catch (error) {
      showNotice(error.message || t('chatInfoPage.failedDeleteChat'))
    } finally {
      setBusy('')
    }
  }

  if (searchOpen) {
    return (
      <div className="app-page chat-info-page min-h-screen">
        <ChatInfoThemeBridge />
        <header className="sticky top-0 z-40 border-b border-[#ececf0] bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-[58px] max-w-[560px] items-center gap-2 px-3">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery('')
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f3f4f6]"
              aria-label={t('chatInfoPage.backToInfo')}
            >
              <ChevronLeft size={27} strokeWidth={2} />
            </button>

            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#85858f]"
              />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value.slice(0, 120)
                  )
                }
                placeholder={t('chatInfoPage.searchInChat')}
                className="h-10 w-full rounded-full bg-[#f2f3f5] pl-10 pr-10 text-[13px] font-normal text-[#111827] outline-none placeholder:text-[#92929b] focus:bg-[#eeeeF2]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t('chatInfoPage.clearSearch')}
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#777781] active:bg-[#dedee4]"
                >
                  <X size={17} />
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[560px] px-4 pb-10">
          {notice ? (
            <div className="fixed left-1/2 top-[70px] z-[170] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-medium text-white">
              {notice}
            </div>
          ) : null}

          {searchLoading ? (
            <div className="flex min-h-[260px] items-center justify-center text-[#7c3aed]">
              <LoaderCircle
                size={27}
                className="animate-spin"
              />
            </div>
          ) : !normalizedSearchQuery ? (
            <div className="px-5 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f3f5] text-[#777781]">
                <Search size={25} />
              </div>
              <h2 className="mt-4 text-[16px] font-semibold">
                {t('chatInfoPage.searchThisChat')}
              </h2>
              <p className="mx-auto mt-2 max-w-[300px] text-[12px] font-normal leading-5 text-[#868690]">
                {t('chatInfoPage.searchHelp')}
              </p>
            </div>
          ) : searchResults.length ? (
            <section className="py-3">
              <div className="px-2 pb-2 text-[11px] font-normal text-[#888892]">
                {searchResults.length === 1
                  ? t('chatInfoPage.resultOne')
                  : t('chatInfoPage.resultMany', { count: searchResults.length.toLocaleString(getDisplayLanguageId()) })}
              </div>

              <div className="divide-y divide-[#efeff2]">
                {searchResults.map((message) => (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() =>
  navigate(`/chat/${conversationId}`, {
    state: {
      jumpToMessageId: message.id,
    },
  })
}
                    className="block w-full px-2 py-4 text-left active:bg-[#f7f7f9]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[12px] font-semibold text-[#111827]">
                        {message.is_mine
                          ? t('chatInfoPage.you')
                          : name}
                      </span>
                      <span className="shrink-0 text-[10px] font-normal text-[#9999a2]">
                        {formatSearchMessageDate(
                          message.created_at
                        )}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-[13px] font-normal leading-5 text-[#4b4b54]">
                      {message.body}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className="px-5 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f3f5] text-[#777781]">
                <Search size={25} />
              </div>
              <h2 className="mt-4 text-[16px] font-semibold">
                {t('chatInfoPage.noMessagesFound')}
              </h2>
              <p className="mt-2 text-[12px] font-normal text-[#888892]">
                {t('chatInfoPage.tryAnotherSearch')}
              </p>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app-page chat-info-page flex min-h-screen items-center justify-center text-[#7c3aed]">
        <ChatInfoThemeBridge />
        <LoaderCircle size={28} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="app-page chat-info-page min-h-screen">
      <ChatInfoThemeBridge />
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[560px] items-center justify-between px-3">
          <button
            type="button"
            onClick={() => navigate(`/chat/${conversationId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label={t('chatInfoPage.backToChat')}
          >
            <ChevronLeft size={27} strokeWidth={2} />
          </button>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[560px] px-5 pb-12">
        {notice ? (
          <div className="fixed left-1/2 top-[70px] z-[170] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[11px] font-medium text-white">
            {notice}
          </div>
        ) : null}

        <section className="flex flex-col items-center pt-6 text-center">
          <Avatar person={person} />
          <h1 className="mt-4 max-w-full truncate text-[22px] font-semibold">
            {name}
          </h1>
          {isGroup ? (
  <p className="mt-1 text-[12px] font-normal text-[#7b7b85]">
    {t('chatInfoPage.peopleCount', { count: Number(conversation?.member_count || 0).toLocaleString(getDisplayLanguageId()) })}
  </p>
) : username ? (
  <p className="mt-1 text-[12px] font-normal text-[#7b7b85]">
    @{username}
  </p>
) : null}

          <div className="relative mt-7 w-full">
  <div className="mx-auto flex max-w-[360px] items-start justify-between">
    {!isGroup ? (
  <Shortcut
    icon={UserRound}
    label={t('chatInfoPage.profile')}
    onClick={openProfile}
  />
) : null}

    <Shortcut
      icon={Search}
      label={t('chatInfoPage.search')}
      onClick={openSearch}
    />

    <Shortcut
      icon={Bell}
      label={t('chatInfoPage.mute')}
      onClick={() => {
        if (muteStatus.is_muted) {
          handleUnmute()
          return
        }

        setMuteOpen(true)
      }}
    />

    {!isGroup ? (
  <Shortcut
    icon={MoreHorizontal}
    label={t('chatInfoPage.options')}
    onClick={() =>
      setOptionsOpen((current) => !current)
    }
  />
) : null}
  </div>

  {optionsOpen && !isGroup ? (
    <>
      <button
        type="button"
        aria-label={t('chatInfoPage.closeOptions')}
        onClick={() => setOptionsOpen(false)}
        className="fixed inset-0 z-[55]"
      />

      <div className="absolute right-0 top-[68px] z-[60] w-[220px] overflow-hidden rounded-[20px] border border-[#e8e8ec] bg-white p-1.5 shadow-[0_18px_45px_rgba(17,24,39,0.18)]">
        <button
          type="button"
          onClick={() => {
            setOptionsOpen(false)
            showNotice(t('chatInfoPage.restrictComingSoon'))
          }}
          className="flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-[14px] text-[#111827] active:bg-[#f4f4f6]"
        >
          <EyeOff size={21} />
          {t('chatInfoPage.restrict')}
        </button>

        <button
          type="button"
          onClick={() => {
            setOptionsOpen(false)
            handleBlock()
          }}
          disabled={Boolean(busy)}
          className="flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-[14px] text-[#111827] active:bg-[#f4f4f6] disabled:opacity-50"
        >
          <Ban size={21} />
          {blockStatus.viewer_has_blocked
            ? t('chatInfoPage.unblock')
            : t('chatInfoPage.block')}
        </button>

        <button
          type="button"
          onClick={() => {
            setOptionsOpen(false)

            if (!reportMessage) {
              showNotice(
                t('chatInfoPage.noReceivedReport')
              )
              return
            }

            setReportOpen(true)
          }}
          className="flex h-12 w-full items-center gap-3 rounded-[14px] px-4 text-left text-[14px] text-[#d13a42] active:bg-[#fff1f2]"
        >
          <Flag size={21} />
          {t('chatInfoPage.report')}
        </button>
      </div>
    </>
  ) : null}
</div>
        </section>

        <section className="mt-8 border-t border-[#ececf0] pt-2">
          <Row
            icon={Clock3}
            title={t('chatInfoPage.disappearingMessages')}
            subtitle={formatAutoDeleteDuration(
              autoDeleteStatus.auto_delete_seconds
            )}
            onClick={() =>
              setAutoDeleteOpen(true)
            }
          />

          {!isGroup ? (
  <Row
    icon={ShieldAlert}
    title={t('chatInfoPage.privacySafety')}
    onClick={() =>
      setOptionsOpen(true)
    }
  />
) : null}

          <Row
            icon={UserRound}
            title={t('chatInfoPage.nicknames')}
            onClick={openNicknames}
          />
          {!isGroup ? (
  <Row
    icon={UsersRound}
    title={t('chatInfoPage.createGroup')}
    onClick={() =>
      setGroupCreateOpen(true)
    }
  />
) : null}
        </section>

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#111827]">
              {t('chatInfoPage.sharedMedia')}
            </h2>

            <button
              type="button"
              onClick={openSharedContent}
              className="text-[12px] font-normal text-[#6b7280] active:opacity-60"
            >
              {t('chatInfoPage.seeAll')}
            </button>
          </div>

          {sharedContent.media.length ? (
            <div className="grid grid-cols-3 gap-[2px] overflow-hidden rounded-[8px]">
              {sharedContent.media
                .slice(0, 9)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={openSharedContent}
                    className="flex aspect-square overflow-hidden bg-[#f1f1f4]"
                  >
                    {item.image ? (
                      <img
                        src={item.url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[#777781]">
                        <FileImage size={24} />
                      </span>
                    )}
                  </button>
                ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={openSharedContent}
              className="flex w-full items-center gap-3 rounded-[12px] bg-[#f7f7f9] px-4 py-4 text-left"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#777781]">
                <FileImage size={21} />
              </span>

              <span className="text-[13px] font-normal text-[#777781]">
                {t('chatInfoPage.noSharedMedia')}
              </span>
            </button>
          )}
        </section>
      </main>
<ChatGroupCreateSheet
  open={groupCreateOpen}
  onClose={() =>
    setGroupCreateOpen(false)
  }
  onCreated={() => {
    notifyUpdated()
  }}
/>


      {muteOpen ? (
        <Sheet
          title={t('chatInfoPage.muteNotifications')}
          onClose={() => setMuteOpen(false)}
        >
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            {t('chatInfoPage.muteDescription')}
          </p>

          <div className="overflow-hidden rounded-[14px] bg-[#f5f5f7]">
            {MUTE_OPTIONS.map(([value, labelKey]) => (
              <button
                key={value}
                type="button"
                onClick={() => handleMute(value)}
                disabled={busy === 'mute'}
                className="flex h-12 w-full items-center gap-3 border-b border-white px-4 text-left text-[13px] font-normal text-[#111827] last:border-b-0 active:bg-[#ececf0] disabled:opacity-50"
              >
                {busy === 'mute' ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <VolumeX size={18} />
                )}
                {t(`chatInfoPage.${labelKey}`)}
              </button>
            ))}
          </div>
        </Sheet>
      ) : null}

      {sharedOpen ? (
  <Sheet
    title={t('chatInfoPage.sharedTitle')}
    onClose={() => setSharedOpen(false)}
  >
    <div className="mb-4 grid grid-cols-3 rounded-[14px] bg-[#f3f3f6] p-1">
      {[
        ['media', 'media'],
        ['files', 'files'],
        ['links', 'links'],
      ].map(([key, labelKey]) => (
        <button
          key={key}
          type="button"
          onClick={() => setSharedTab(key)}
          className={`h-9 rounded-[11px] text-[12px] font-semibold ${
            sharedTab === key
              ? 'bg-white text-[#7c3aed] shadow-sm'
              : 'text-[#777781]'
          }`}
        >
          {t(`chatInfoPage.${labelKey}`)} ({sharedContent[key].length.toLocaleString(getDisplayLanguageId())})
        </button>
      ))}
    </div>

    {searchLoading && !searchLoaded ? (
      <div className="flex min-h-[180px] items-center justify-center text-[#7c3aed]">
        <LoaderCircle
          size={25}
          className="animate-spin"
        />
      </div>
    ) : activeSharedItems.length ? (
      sharedTab === 'media' ? (
        <div className="grid grid-cols-3 gap-2">
          {activeSharedItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex aspect-square overflow-hidden rounded-[12px] bg-[#f2f2f5]"
            >
              {item.image ? (
                <img
                  src={item.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[#7c3aed]">
                  <FileImage size={25} />
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] bg-[#f6f6f8]">
          {activeSharedItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border-b border-white px-3 py-3 last:border-b-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#7c3aed]">
                {sharedTab === 'files' ? (
                  <FileText size={19} />
                ) : (
                  <Link2 size={19} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-[#22222b]">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[10px] text-[#92929b]">
                  {formatSearchMessageDate(
                    item.created_at
                  )}
                </span>
              </span>
            </a>
          ))}
        </div>
      )
    ) : (
      <div className="px-4 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
          {sharedTab === 'files' ? (
            <FileText size={24} />
          ) : sharedTab === 'links' ? (
            <Link2 size={24} />
          ) : (
            <FileImage size={24} />
          )}
        </div>

        <h3 className="mt-4 text-[15px] font-semibold">
          {sharedTab === 'files'
            ? t('chatInfoPage.noFilesYet')
            : sharedTab === 'links'
              ? t('chatInfoPage.noLinksYet')
              : t('chatInfoPage.noMediaYet')}
        </h3>
      </div>
    )}
  </Sheet>
) : null}

      {pinnedOpen ? (
        <Sheet
          title={t('chatInfoPage.pinnedMessages')}
          onClose={() => setPinnedOpen(false)}
        >
          {pinnedError ? (
            <p className="mb-3 rounded-[12px] bg-[#fff0f1] px-3 py-2.5 text-[11px] font-medium text-[#c7353d]">
              {pinnedError}
            </p>
          ) : null}

          {pinnedLoading ? (
            <div className="flex min-h-[180px] items-center justify-center text-[#7c3aed]">
              <LoaderCircle
                size={25}
                className="animate-spin"
              />
            </div>
          ) : pinnedItems.length ? (
            <div className="overflow-hidden rounded-[14px] bg-[#f6f6f8]">
              {pinnedItems.map((pin) => {
                const message = pin.message || {}
                const messageId =
                  message.id || pin.message_id
                const busy =
                  String(pinnedBusyId) ===
                  String(messageId)

                return (
                  <div
                    key={pin.id || messageId}
                    className="flex items-start gap-3 border-b border-white px-3 py-3 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() =>
  navigate(`/chat/${conversationId}`, {
    state: {
      jumpToMessageId: messageId,
    },
  })
}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#7c3aed]">
                        <Pin size={12} />
                        {t('chatInfoPage.pinnedMessage')}
                      </div>

                      <p className="mt-1 whitespace-pre-wrap break-words text-[13px] font-normal leading-5 text-[#2f2f37]">
                        {message.body ||
                          t('chatInfoPage.message')}
                      </p>

                      <p className="mt-1 text-[10px] font-normal text-[#92929b]">
                        {formatSearchMessageDate(
                          message.created_at ||
                            pin.created_at
                        )}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleUnpinPinnedMessage(
                          messageId
                        )
                      }
                      disabled={busy}
                      aria-label={t('chatInfoPage.unpinMessage')}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7c3aed] active:bg-[#ece7f8] disabled:opacity-50"
                    >
                      {busy ? (
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={17} />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2edff] text-[#7c3aed]">
                <Pin size={24} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-[#111827]">
                {t('chatInfoPage.noPinnedMessages')}
              </h3>
              <p className="mx-auto mt-2 max-w-[280px] text-[11px] font-normal leading-5 text-[#8b8b95]">
                {t('chatInfoPage.pinHelp')}
              </p>
            </div>
          )}
        </Sheet>
      ) : null}

      {nicknamesOpen ? (
        <Sheet
          title={
            nicknameEditor
              ? t('chatInfoPage.editNickname')
              : t('chatInfoPage.nicknames')
          }
          onClose={() => {
            if (nicknameEditor) {
              setNicknameEditor(null)
              setNicknameDraft('')
              return
            }

            setNicknamesOpen(false)
          }}
        >
          {nicknameEditor ? (
            <div>
              <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
                {nicknameEditor.is_self
                  ? t('chatInfoPage.setSelfNickname')
                  : t('chatInfoPage.setPersonNickname', { name })}
              </p>

              <input
                autoFocus
                value={nicknameDraft}
                onChange={(event) =>
                  setNicknameDraft(
                    event.target.value.slice(0, 32)
                  )
                }
                placeholder={t('chatInfoPage.nickname')}
                className="h-11 w-full rounded-[12px] border border-[#dedee4] bg-white px-3 text-[13px] font-normal text-[#111827] outline-none focus:border-[#7c3aed]"
              />

              <button
                type="button"
                onClick={() => saveNickname()}
                disabled={nicknameBusy}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#111827] text-[13px] font-medium text-white disabled:opacity-50"
              >
                {nicknameBusy ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : null}
                {t('chatInfoPage.save')}
              </button>

              {nicknameEditor.nickname ? (
                <button
                  type="button"
                  onClick={() => saveNickname('')}
                  disabled={nicknameBusy}
                  className="mt-2 h-11 w-full rounded-[12px] bg-[#f5f5f7] text-[13px] font-normal text-[#d13a42] disabled:opacity-50"
                >
                  {t('chatInfoPage.removeNickname')}
                </button>
              ) : null}
            </div>
          ) : nicknameLoading ? (
            <div className="flex min-h-[180px] items-center justify-center text-[#7c3aed]">
              <LoaderCircle
                size={25}
                className="animate-spin"
              />
            </div>
          ) : nicknameParticipants.length ? (
            <div className="overflow-hidden rounded-[14px] bg-[#f6f6f8]">
              {nicknameParticipants.map(
                (participant) => (
                  <button
                    key={participant.user_id}
                    type="button"
                    onClick={() =>
                      openNicknameEditor(
                        participant
                      )
                    }
                    className="flex min-h-[58px] w-full items-center gap-3 border-b border-white px-4 text-left last:border-b-0 active:bg-[#ececf0]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#111827]">
                      <UserRound size={19} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-normal text-[#111827]">
                        {participant.is_self
                          ? t('chatInfoPage.you')
                          : name}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-normal text-[#8a8a95]">
                        {participant.nickname ||
                          t('chatInfoPage.addNickname')}
                      </span>
                    </span>
                  </button>
                )
              )}
            </div>
          ) : (
            <p className="py-10 text-center text-[12px] font-normal text-[#8a8a95]">
              {t('chatInfoPage.noParticipants')}
            </p>
          )}
        </Sheet>
      ) : null}

      {autoDeleteOpen ? (
        <Sheet
          title={t('chatInfoPage.autoDeleteMessages')}
          onClose={() => setAutoDeleteOpen(false)}
        >
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            {t('chatInfoPage.autoDeleteDescription')}
          </p>

          <div className="overflow-hidden rounded-[14px] bg-[#f5f5f7]">
            {AUTO_DELETE_OPTIONS.map(
              ([seconds, labelKey]) => {
                const selected =
                  Number(
                    autoDeleteStatus.auto_delete_seconds || 0
                  ) === Number(seconds)

                return (
                  <button
                    key={seconds}
                    type="button"
                    onClick={() =>
                      handleAutoDelete(seconds)
                    }
                    disabled={busy === 'auto-delete'}
                    className="flex h-12 w-full items-center gap-3 border-b border-white px-4 text-left text-[13px] font-normal text-[#111827] last:border-b-0 active:bg-[#ececf0] disabled:opacity-50"
                  >
                    {busy === 'auto-delete' ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <Clock3 size={18} />
                    )}

                    <span className="flex-1">
                      {t(`chatInfoPage.${labelKey}`)}
                    </span>

                    {selected ? (
                      <Check
                        size={18}
                        strokeWidth={2.4}
                        className="text-[#7c3aed]"
                      />
                    ) : null}
                  </button>
                )
              }
            )}
          </div>

          <p className="mt-3 text-[10px] font-normal leading-4 text-[#92929b]">
            {t('chatInfoPage.autoDeleteSafety')}
          </p>
        </Sheet>
      ) : null}

      {reportOpen ? (
        <Sheet title={t('chatInfoPage.reportChat')} onClose={() => setReportOpen(false)}>
          <p className="mb-3 text-[11px] font-normal leading-5 text-[#777781]">
            {t('chatInfoPage.reportHelp')}
          </p>

          <select
            value={reportReason}
            onChange={(event) => setReportReason(event.target.value)}
            className="h-11 w-full rounded-[12px] border border-[#dedee4] bg-white px-3 text-[13px] font-normal outline-none focus:border-[#7c3aed]"
          >
            {REPORT_REASONS.map(([value, labelKey]) => (
              <option key={value} value={value}>
                {t(`chatInfoPage.${labelKey}`)}
              </option>
            ))}
          </select>

          <textarea
            value={reportDetails}
            onChange={(event) =>
              setReportDetails(event.target.value.slice(0, 1000))
            }
            rows={4}
            placeholder={t('chatInfoPage.addDetails')}
            className="mt-3 w-full resize-none rounded-[12px] border border-[#dedee4] px-3 py-3 text-[13px] font-normal outline-none focus:border-[#7c3aed]"
          />

          <button
            type="button"
            onClick={handleReport}
            disabled={busy === 'report'}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#d13a42] text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {busy === 'report' ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Flag size={17} />
            )}
            {t('chatInfoPage.submitReport')}
          </button>
        </Sheet>
      ) : null}

      {deleteOpen ? (
        <Sheet title={t('chatInfoPage.deleteChat')} onClose={() => setDeleteOpen(false)}>
          <button
            type="button"
            onClick={() => handleDelete('for_me')}
            disabled={Boolean(busy)}
            className="flex min-h-[54px] w-full items-center gap-3 rounded-[14px] bg-[#f5f5f7] px-4 text-left text-[13px] font-medium text-[#111827] disabled:opacity-50"
          >
            <Trash2 size={19} />
            {t('chatInfoPage.deleteForMe')}
          </button>

          {canDeleteForBoth ? (
            <button
              type="button"
              onClick={() => handleDelete('for_both')}
              disabled={Boolean(busy)}
              className="mt-2 flex min-h-[54px] w-full items-center gap-3 rounded-[14px] bg-[#fff0f1] px-4 text-left text-[13px] font-medium text-[#d13a42] disabled:opacity-50"
            >
              <Trash2 size={19} />
              {t('chatInfoPage.deleteForBoth')}
            </button>
          ) : null}
        </Sheet>
      ) : null}
    </div>
  )
}
