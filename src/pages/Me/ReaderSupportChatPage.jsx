import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, ChevronDown, ChevronLeft, CornerUpLeft, LoaderCircle, Pencil, Pin, PinOff, X } from 'lucide-react'
import { PageEmptyState, PageErrorState, PageLoadingState } from '../../components/common/PagePrimitives'
import SharedChatMessageBubble from '../../components/chat/SharedChatMessageBubble'
import SharedChatComposer from '../../components/chat/SharedChatComposer'
import SharedMessageActionMenu from '../../components/chat/SharedMessageActionMenu'
import SupportChatPrivateImage from '../../components/chat/SupportChatPrivateImage'
import SupportChatForwardDialog, { supportForwardText } from '../../components/chat/SupportChatForwardDialog'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  createMySupportImageUpload,
  deleteMySupportMessage,
  editMySupportMessage,
  getMySupportBlock,
  getMySupportConversation,
  getMySupportMessages,
  getMySupportPins,
  setMySupportPin,
  markMySupportRead,
  markMySupportSeen,
  replyMySupportMessage,
  sendMySupportMessage,
} from '../../services/readerSupportChatApi'

registerTranslationNamespace('readerSupportChatPage', {
  en: {
    forward: "Forward text", forwardRecipient: "Choose a recipient", forwardNote: "Only the text below will be sent as a new message from your account. Private images and attachments are not shared. Check the recipient and cancel if the text contains sensitive information.", forwardEmpty: "No available direct chats.", forwardLoadError: "Could not load recipients.", forwardSendError: "Delivery could not be confirmed. Check the recipient chat before trying again.", forwardSuccess: "Text sent.", forwardLimit: "Choose text messages totaling at most 2,000 characters.",
    title: 'Chat with Shadow Admin', subtitle: 'Private support messages', back: 'Back',
    verified: 'Verified Shadow Admin', waiting: 'Shadow Support', onlineNote: 'Messages are answered when our team is available.',
    loading: 'Loading your support chat...', loadError: 'Unable to load support chat', retry: 'Retry',
    empty: 'Start a conversation', emptyText: 'Send a message to Shadow Admin and your conversation will appear here.',
    placeholder: 'Write your message...', send: 'Send', sending: 'Sending...', sendError: 'Could not send your message.',
    loadOlder: 'Load earlier messages', loadingOlder: 'Loading earlier messages...', noMessages: 'No messages yet.',
    refresh: 'Refresh', archived: 'This conversation is archived. Contact Shadow Support through the Help Center.',
    signIn: 'Please sign in to contact Shadow Support.', private: 'This conversation is private.', goLogin: 'Sign in',
    reply: 'Reply', edit: 'Edit', delete: 'Delete', copy: 'Copy text', copied: 'Copied',
    edited: 'Edited', deleted: 'Message deleted', editing: 'Editing message', replying: 'Replying to',
    save: 'Save', cancel: 'Cancel', confirmDelete: 'Delete message?', deleteNote: 'This message will be removed from the chat.',
    message: 'Message', actionError: 'Could not update the message.', menu: 'Message options', closeMenu: 'Close message options',
    camera: 'Camera', image: 'Image', emoji: 'Emoji', search: 'Search messages', comingSoon: 'Coming soon', sent: 'Sent', read: 'Read',
    blocked: 'Shadow Support has restricted messaging.', imageError: 'Could not send the image.', imageMode: 'Finish or cancel editing or replying before sending an image.',
    compress: 'Compressing image...', prepare: 'Preparing upload...', upload: 'Uploading image...', finalize: 'Sending image...', done: 'Image sent',
    originalUnavailable: 'Original message unavailable', info: 'Message info', close: 'Close', imageExpired: 'Upload session expired. Select the image again.',
    pin: 'Pin', unpin: 'Unpin', pinned: 'Pinned messages', pinError: 'Pinned messages unavailable. Retry.', pinLimit: 'You can pin up to 50 messages.', select: 'Select', selected: 'Selected', copySelected: 'Copy selected', selectionLimit: 'Select up to 50 messages.',
  },
  km: {
    forward: "បញ្ជូនអត្ថបទបន្ត", forwardRecipient: "ជ្រើសអ្នកទទួល", forwardNote: "អត្ថបទខាងក្រោមនឹងផ្ញើជាសារថ្មីពីគណនីរបស់អ្នក។ រូបភាពឯកជន និងឯកសារភ្ជាប់មិនត្រូវបានបញ្ជូនទេ។ សូមពិនិត្យអ្នកទទួល និងព័ត៌មានរសើបមុនផ្ញើ។", forwardEmpty: "មិនមាន Chat ផ្ទាល់ដែលអាចផ្ញើបានទេ។", forwardLoadError: "មិនអាចផ្ទុកអ្នកទទួលបានទេ។", forwardSendError: "មិនអាចបញ្ជាក់ការផ្ញើបានទេ។ សូមពិនិត្យ Chat អ្នកទទួលមុនសាកម្ដងទៀត។", forwardSuccess: "បានផ្ញើអត្ថបទ។", forwardLimit: "ជ្រើសសារអត្ថបទសរុបមិនលើស 2,000 តួអក្សរ។",
    title: 'ឆាតជាមួយ Shadow Admin', subtitle: 'សារជំនួយឯកជន', back: 'ត្រឡប់ក្រោយ',
    verified: 'Shadow Admin បានផ្ទៀងផ្ទាត់', waiting: 'ក្រុមជំនួយ Shadow', onlineNote: 'ក្រុមការងារនឹងឆ្លើយតបនៅពេលអាចធ្វើបាន។',
    loading: 'កំពុងផ្ទុកឆាតជំនួយ...', loadError: 'មិនអាចផ្ទុកឆាតជំនួយបានទេ', retry: 'ព្យាយាមម្ដងទៀត',
    empty: 'ចាប់ផ្តើមការសន្ទនា', emptyText: 'ផ្ញើសារទៅ Shadow Admin ហើយការសន្ទនានឹងបង្ហាញនៅទីនេះ។',
    placeholder: 'សរសេរសាររបស់អ្នក...', send: 'ផ្ញើ', sending: 'កំពុងផ្ញើ...', sendError: 'មិនអាចផ្ញើសារបានទេ។',
    loadOlder: 'ផ្ទុកសារចាស់ជាងនេះ', loadingOlder: 'កំពុងផ្ទុកសារចាស់...', noMessages: 'មិនទាន់មានសារទេ។',
    refresh: 'ផ្ទុកថ្មី', archived: 'ការសន្ទនានេះត្រូវបានរក្សាទុកក្នុង Archive។ សូមទាក់ទងតាម Help Center។',
    signIn: 'សូមចូលគណនី ដើម្បីទាក់ទង Shadow Support។', private: 'ការសន្ទនានេះជាឯកជន។', goLogin: 'ចូលគណនី',
    reply: 'ឆ្លើយតប', edit: 'កែសារ', delete: 'លុបសារ', copy: 'ចម្លងអត្ថបទ', copied: 'បានចម្លង',
    edited: 'បានកែ', deleted: 'សារត្រូវបានលុប', editing: 'កំពុងកែសារ', replying: 'ឆ្លើយតបទៅ',
    save: 'រក្សាទុក', cancel: 'បោះបង់', confirmDelete: 'លុបសារនេះ?', deleteNote: 'សារនេះនឹងត្រូវលុបចេញពីការសន្ទនា។',
    message: 'សារ', actionError: 'មិនអាចកែប្រែសារបានទេ។', menu: 'ជម្រើសសារ', closeMenu: 'បិទជម្រើសសារ',
    camera: 'កាមេរ៉ា', image: 'រូបភាព', emoji: 'Emoji', search: 'ស្វែងរកសារ', comingSoon: 'នឹងមកដល់ឆាប់ៗ', sent: 'បានផ្ញើ', read: 'បានអាន',
    blocked: 'Shadow Support បានកំណត់ការផ្ញើសារ។', imageError: 'មិនអាចផ្ញើរូបភាពបានទេ។', imageMode: 'សូមបញ្ចប់ ឬបោះបង់ការកែ ឬឆ្លើយតប មុនផ្ញើរូបភាព។',
    compress: 'កំពុងបង្រួមរូបភាព...', prepare: 'កំពុងរៀបចំ...', upload: 'កំពុង Upload រូបភាព...', finalize: 'កំពុងផ្ញើរូបភាព...', done: 'បានផ្ញើរូបភាព',
    originalUnavailable: 'សារដើមមិនអាចមើលបាន', info: 'ព័ត៌មានសារ', close: 'បិទ', imageExpired: 'ការផ្ញើរូបភាពផុតកំណត់។ សូមជ្រើសរូបម្តងទៀត។',
    pin: 'Pin', unpin: 'ដក Pin', pinned: 'សារដែលបាន Pin', pinError: 'មិនអាចផ្ទុកសារ Pin។ សូមព្យាយាមម្តងទៀត។', pinLimit: 'អាច Pin បានអតិបរមា 50 សារ។', select: 'ជ្រើស', selected: 'បានជ្រើស', copySelected: 'ចម្លងសារដែលបានជ្រើស', selectionLimit: 'អាចជ្រើសបានអតិបរមា 50 សារ។',
  },
  zh: {
    forward: "转发文本", forwardRecipient: "选择接收者", forwardNote: "以下文本将以你的账号作为新消息发送。不会共享私密图片或附件。发送前请确认接收者并检查敏感信息。", forwardEmpty: "没有可用的私聊。", forwardLoadError: "无法加载接收者。", forwardSendError: "无法确认是否送达。请先检查接收者聊天再重试。", forwardSuccess: "文本已发送。", forwardLimit: "请选择总计不超过2000字符的文本消息。",
    title: '联系 Shadow Admin', subtitle: '私人客服消息', back: '返回',
    verified: '已认证 Shadow Admin', waiting: 'Shadow 客服', onlineNote: '我们的团队将在有空时回复。',
    loading: '正在加载客服聊天...', loadError: '无法加载客服聊天', retry: '重试',
    empty: '开始对话', emptyText: '向 Shadow Admin 发送消息后，对话将显示在这里。',
    placeholder: '输入消息...', send: '发送', sending: '发送中...', sendError: '消息发送失败。',
    loadOlder: '加载更早的消息', loadingOlder: '正在加载旧消息...', noMessages: '暂无消息。',
    refresh: '刷新', archived: '此对话已归档。请通过帮助中心联系 Shadow 客服。',
    signIn: '请先登录，再联系 Shadow 客服。', private: '这是私人对话。', goLogin: '登录',
    reply: '回复', edit: '编辑', delete: '删除', copy: '复制文本', copied: '已复制',
    edited: '已编辑', deleted: '消息已删除', editing: '正在编辑消息', replying: '回复',
    save: '保存', cancel: '取消', confirmDelete: '删除消息？', deleteNote: '此消息将从对话中删除。',
    message: '消息', actionError: '无法更新消息。', menu: '消息选项', closeMenu: '关闭消息选项',
    camera: '相机', image: '图片', emoji: '表情', search: '搜索消息', comingSoon: '即将推出', sent: '已发送', read: '已读',
    blocked: 'Shadow 客服已限制发送消息。', imageError: '无法发送图片。', imageMode: '请先完成或取消编辑或回复，再发送图片。',
    compress: '正在压缩图片...', prepare: '正在准备上传...', upload: '正在上传图片...', finalize: '正在发送图片...', done: '图片已发送',
    originalUnavailable: '原消息不可用', info: '消息信息', close: '关闭', imageExpired: '上传会话已过期，请重新选择图片。',
    pin: '置顶', unpin: '取消置顶', pinned: '置顶消息', pinError: '无法加载置顶消息，请重试。', pinLimit: '最多置顶50条消息。', select: '选择', selected: '已选择', copySelected: '复制所选', selectionLimit: '最多选择50条消息。',
  },
  ja: {
    forward: "テキストを転送", forwardRecipient: "送信先を選択", forwardNote: "以下のテキストをあなたのアカウントから新しいメッセージとして送信します。非公開の画像や添付ファイルは共有されません。送信前に送信先と機密情報をご確認ください。", forwardEmpty: "利用可能な個別チャットがありません。", forwardLoadError: "送信先を読み込めませんでした。", forwardSendError: "配信を確認できませんでした。再試行する前に送信先のチャットをご確認ください。", forwardSuccess: "テキストを送信しました。", forwardLimit: "合計2000文字以内のテキストメッセージを選択してください。",
    title: 'Shadow Admin にチャット', subtitle: '非公開サポートメッセージ', back: '戻る',
    verified: '認証済み Shadow Admin', waiting: 'Shadow サポート', onlineNote: '担当者が対応可能になり次第返信します。',
    loading: 'サポートチャットを読み込み中...', loadError: 'サポートチャットを読み込めません', retry: '再試行',
    empty: '会話を始める', emptyText: 'Shadow Admin にメッセージを送ると、会話がここに表示されます。',
    placeholder: 'メッセージを入力...', send: '送信', sending: '送信中...', sendError: 'メッセージを送信できませんでした。',
    loadOlder: '過去のメッセージを表示', loadingOlder: '過去のメッセージを読み込み中...', noMessages: 'まだメッセージがありません。',
    refresh: '更新', archived: 'この会話はアーカイブされています。ヘルプセンターからお問い合わせください。',
    signIn: 'Shadow サポートに連絡するにはログインしてください。', private: 'この会話は非公開です。', goLogin: 'ログイン',
    reply: '返信', edit: '編集', delete: '削除', copy: 'テキストをコピー', copied: 'コピーしました',
    edited: '編集済み', deleted: 'メッセージは削除されました', editing: 'メッセージを編集中', replying: '返信先',
    save: '保存', cancel: 'キャンセル', confirmDelete: 'メッセージを削除しますか？', deleteNote: 'このメッセージを会話から削除します。',
    message: 'メッセージ', actionError: 'メッセージを更新できませんでした。', menu: 'メッセージ操作', closeMenu: '操作を閉じる',
    camera: 'カメラ', image: '画像', emoji: '絵文字', search: 'メッセージを検索', comingSoon: '近日公開', sent: '送信済み', read: '既読',
    blocked: 'Shadow サポートはメッセージの送信を制限しています。', imageError: '画像を送信できませんでした。', imageMode: '編集や返信を完了またはキャンセルしてから画像を送信してください。',
    compress: '画像を圧縮中...', prepare: 'アップロードを準備中...', upload: '画像をアップロード中...', finalize: '画像を送信中...', done: '画像を送信しました',
    originalUnavailable: '元のメッセージは利用できません', info: 'メッセージ情報', close: '閉じる', imageExpired: 'アップロードの期限切れです。画像を再選択してください。',
    pin: 'ピン留め', unpin: 'ピン解除', pinned: 'ピン留め済みメッセージ', pinError: 'ピン留めの読み込みに失敗しました。再試行してください。', pinLimit: '最大50件までピン留めできます。', select: '選択', selected: '選択済み', copySelected: '選択したメッセージをコピー', selectionLimit: '最大50件まで選択できます。',
  },
  ko: {
    forward: "텍스트 전달", forwardRecipient: "받는 사람 선택", forwardNote: "아래 텍스트를 내 계정의 새 메시지로 보냅니다. 비공개 이미지와 첨부 파일은 공유되지 않습니다. 보내기 전에 받는 사람과 민감한 정보를 확인하세요.", forwardEmpty: "사용 가능한 개인 채팅이 없습니다.", forwardLoadError: "받는 사람을 불러오지 못했습니다.", forwardSendError: "전송 여부를 확인할 수 없습니다. 다시 시도하기 전에 받는 사람의 채팅을 확인하세요.", forwardSuccess: "텍스트를 보냈습니다.", forwardLimit: "총 2,000자 이하의 텍스트 메시지를 선택하세요.",
    title: 'Shadow Admin과 채팅', subtitle: '비공개 지원 메시지', back: '뒤로',
    verified: '인증된 Shadow Admin', waiting: 'Shadow 지원팀', onlineNote: '담당자가 가능한 시간에 답변드립니다.',
    loading: '지원 채팅을 불러오는 중...', loadError: '지원 채팅을 불러올 수 없습니다', retry: '다시 시도',
    empty: '대화 시작', emptyText: 'Shadow Admin에게 메시지를 보내면 대화가 여기에 표시됩니다.',
    placeholder: '메시지를 입력하세요...', send: '보내기', sending: '보내는 중...', sendError: '메시지를 보낼 수 없었습니다.',
    loadOlder: '이전 메시지 불러오기', loadingOlder: '이전 메시지를 불러오는 중...', noMessages: '아직 메시지가 없습니다.',
    refresh: '새로고침', archived: '이 대화는 보관되었습니다. 도움말 센터를 통해 문의해 주세요.',
    signIn: 'Shadow 지원팀에 문의하려면 로그인하세요.', private: '이 대화는 비공개입니다.', goLogin: '로그인',
    reply: '답장', edit: '수정', delete: '삭제', copy: '텍스트 복사', copied: '복사됨',
    edited: '수정됨', deleted: '삭제된 메시지', editing: '메시지 수정 중', replying: '답장 대상',
    save: '저장', cancel: '취소', confirmDelete: '메시지를 삭제할까요?', deleteNote: '이 메시지가 대화에서 삭제됩니다.',
    message: '메시지', actionError: '메시지를 변경할 수 없습니다.', menu: '메시지 옵션', closeMenu: '메시지 옵션 닫기',
    camera: '카메라', image: '이미지', emoji: '이모지', search: '메시지 검색', comingSoon: '곧 제공 예정', sent: '보냄', read: '읽음',
    blocked: 'Shadow 지원팀이 메시지 전송을 제한했습니다.', imageError: '이미지를 보내지 못했습니다.', imageMode: '수정이나 답장을 완료하거나 취소한 뒤 이미지를 보내세요.',
    compress: '이미지 압축 중...', prepare: '업로드 준비 중...', upload: '이미지 업로드 중...', finalize: '이미지 전송 중...', done: '이미지를 보냈습니다',
    originalUnavailable: '원본 메시지를 사용할 수 없음', info: '메시지 정보', close: '닫기', imageExpired: '업로드 시간이 만료되었습니다. 이미지를 다시 선택하세요.',
    pin: '고정', unpin: '고정 해제', pinned: '고정된 메시지', pinError: '고정 메시지를 불러오지 못했습니다. 다시 시도하세요.', pinLimit: '최대 50개까지 고정할 수 있습니다.', select: '선택', selected: '선택됨', copySelected: '선택한 메시지 복사', selectionLimit: '최대 50개까지 선택할 수 있습니다.',
  },
})

const LOGO = '/assets/Icons/Logo%20Shadow%203.png'

function displayTime(value) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function imageSource(attachment) {
  const value = typeof attachment === 'string'
    ? attachment
    : attachment?.url || attachment?.public_url || attachment?.image_url || attachment?.file_url || ''
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return ''
  const type = typeof attachment === 'object'
    ? String(attachment?.mime_type || attachment?.content_type || attachment?.type || '').toLowerCase()
    : ''
  if (type && !type.startsWith('image') && !['photo', 'picture'].includes(type)) return ''
  return value
}

function privateImage(item) {
  return Array.isArray(item.attachments) && item.attachments.some(a => a?.type === 'image' && typeof a.storage_key === 'string')
}

function toBubble(item, repliedTo) {
  return {
    ...item,
    is_mine: item.sender_kind === 'reader',
    is_deleted: Boolean(item.deleted_at),
    body: item.message_text || '',
    reply_to_message_id: item.deleted_at ? null : item.reply_to_message_id,
    reply_to: repliedTo ? { body: repliedTo.message_text, is_deleted: Boolean(repliedTo.deleted_at) } : null,
    edited_at: item.deleted_at ? null : item.edited_at,
  }
}

function messageKey(item) {
  return item ? `${item.id}:${item.last_message_at || ''}:${item.status || ''}:${item.updated_at || ''}` : ''
}

function allowedActions(message, archived, blocked, pinReady = false) {
  if (!message || message.deleted_at) return []
  const actions = []
  if (!archived && !blocked) actions.push('reply')
  if (message.sender_kind === 'reader' && !archived && message.message_text && !blocked) actions.push('edit')
  if (!archived && !blocked && pinReady) actions.push('pin', 'unpin')
  if (message.message_text) actions.push('copy')
  if (!archived && !blocked && supportForwardText([message])) actions.push('forward')
  actions.push('select')
  if (message.sender_kind === 'reader') {
    if (!archived) actions.push('delete')
    actions.push('info')
  }
  return actions
}

export default function ReaderSupportChatPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const tr = key => t(`readerSupportChatPage.${key}`)
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [pins, setPins] = useState([])
  const [pinReadyFor, setPinReadyFor] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinRefresh, setPinRefresh] = useState(0)
  const [pinListOpen, setPinListOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [forwardText, setForwardText] = useState('')
  const pinWriteRef = useRef(false)
  const pinEpochRef = useRef(0)
  const pinAbortRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loginRequired, setLoginRequired] = useState(false)
  const [sending, setSending] = useState(false)
  const [draft, setDraft] = useState('')
  const [olderLoading, setOlderLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [before, setBefore] = useState('')
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [viewport, setViewport] = useState(null)
  const [menu, setMenu] = useState(null)
  const [replyTarget, setReplyTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [infoTarget, setInfoTarget] = useState(null)
  const [busyAction, setBusyAction] = useState('')
  const [copied, setCopied] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [imageStage, setImageStage] = useState('')
  const [imageRetry, setImageRetry] = useState(false)
  const [highlighted, setHighlighted] = useState('')
  const scrollBoxRef = useRef(null)
  const composerRef = useRef(null)
  const restoreScrollRef = useRef(null)
  const nearBottomRef = useRef(true)
  const pendingSendRef = useRef(null)
  const lastMessageKeyRef = useRef('')
  const copyTimerRef = useRef(null)
  const highlightTimerRef = useRef(null)
  const messageRefs = useRef(new Map())
  const cameraRef = useRef(null)
  const galleryRef = useRef(null)
  const imageJobRef = useRef(null)
  const imageAbortRef = useRef(null)
  const sendingRef = useRef(false)
  const seenRef = useRef('')
  const seenAttemptRef = useRef({ id: '', time: 0 })
  const latestIncomingRef = useRef(null)

  useEffect(() => () => {
    window.clearTimeout(copyTimerRef.current)
    window.clearTimeout(highlightTimerRef.current)
    imageAbortRef.current?.abort()
    pinAbortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (!menu) return undefined
    const onKeyDown = event => { if (event.key === 'Escape') setMenu(null) }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menu])

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const visual = window.visualViewport
    const updateViewport = () => {
      if (!visual) return
      const next = { top: visual.offsetTop, height: visual.height, keyboard: window.innerHeight - visual.height > 120 }
      setViewport(current => current && Math.abs(current.top - next.top) < 1 && Math.abs(current.height - next.height) < 1 && current.keyboard === next.keyboard ? current : next)
    }
    updateViewport()
    visual?.addEventListener('resize', updateViewport)
    visual?.addEventListener('scroll', updateViewport)
    window.addEventListener('resize', updateViewport)
    return () => {
      document.body.style.overflow = previousOverflow
      visual?.removeEventListener('resize', updateViewport)
      visual?.removeEventListener('scroll', updateViewport)
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useLayoutEffect(() => {
    const element = composerRef.current
    if (!element) return
    element.style.height = '46px'
    element.style.height = `${Math.min(element.scrollHeight, 124)}px`
    element.style.overflowY = element.scrollHeight > 124 ? 'auto' : 'hidden'
  }, [draft, loading, loginRequired])

  const updateBlock = useCallback(async signal => {
    try {
      const result = await getMySupportBlock({ signal })
      if (!signal?.aborted) setBlocked(result.blocked === true)
    } catch (err) {
      if (!signal?.aborted && (err.status === 401 || err.code === 'LOGIN_REQUIRED')) setLoginRequired(true)
    }
  }, [])

  const markVisibleRead = useCallback(async () => {
    const target = latestIncomingRef.current
    if (!target || document.hidden || !nearBottomRef.current || seenRef.current === target.id) return
    const node = messageRefs.current.get(target.id)
    const box = scrollBoxRef.current
    if (!node || !box) return
    const rect = node.getBoundingClientRect()
    const bounds = box.getBoundingClientRect()
    if (rect.bottom <= bounds.top || rect.top >= bounds.bottom) return
    if (seenAttemptRef.current.id === target.id && Date.now() - seenAttemptRef.current.time < 12000) return
    seenAttemptRef.current = { id: target.id, time: Date.now() }
    seenRef.current = target.id
    try {
      await markMySupportSeen(target.id)
    } catch (err) {
      try {
        if (err.status === 404 && err.code !== 'SUPPORT_SEEN_NOT_FOUND') await markMySupportRead()
        else if (seenRef.current === target.id) seenRef.current = ''
      } catch { if (seenRef.current === target.id) seenRef.current = '' }
    }
  }, [])

  const reload = useCallback(async signal => {
    const data = await getMySupportConversation({ signal })
    if (signal?.aborted) return
    const item = data.conversation || null
    if (!item) {
      lastMessageKeyRef.current = ''
      latestIncomingRef.current = null
      seenRef.current = ''
      setConversation(null)
      setMessages([])
      setBefore('')
      setHasMore(false)
      setBlocked(false)
      return
    }
    const history = await getMySupportMessages({ signal })
    if (signal?.aborted) return
    const incoming = history.messages || []
    lastMessageKeyRef.current = messageKey(item)
    latestIncomingRef.current = [...incoming].reverse().find(message => message.sender_kind !== 'reader' && !message.deleted_at && !message.seen_at) || null
    setConversation(item)
    setMessages(incoming)
    setBefore(history.next_before || '')
    setHasMore(Boolean(history.has_more))
    await updateBlock(signal)
  }, [updateBlock])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setLoginRequired(false)
    reload(controller.signal)
      .catch(err => {
        if (controller.signal.aborted || err.name === 'AbortError') return
        if (err.status === 401 || err.code === 'LOGIN_REQUIRED') setLoginRequired(true)
        else setError(err.message || t('readerSupportChatPage.loadError'))
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [reload, refreshIndex, t])

  useEffect(() => {
    if (loading || loginRequired || sending) return undefined
    const controller = new AbortController()
    let checking = false
    let lastChecked = Date.now()
    const checkIncoming = async () => {
      if (controller.signal.aborted || checking || document.hidden || Date.now() - lastChecked < 12000) return
      lastChecked = Date.now()
      checking = true
      try {
        const data = await getMySupportConversation({ signal: controller.signal })
        if (controller.signal.aborted) return
        const item = data.conversation || null
        const key = messageKey(item)
        if (key !== lastMessageKeyRef.current) {
          const sameConversation = Boolean(item && lastMessageKeyRef.current.startsWith(`${item.id}:`))
          const history = item ? await getMySupportMessages({ signal: controller.signal }) : null
          if (controller.signal.aborted) return
          const incoming = Array.isArray(history?.messages) ? history.messages : []
          latestIncomingRef.current = [...incoming].reverse().find(message => message.sender_kind !== 'reader' && !message.deleted_at && !message.seen_at) || null
          if (sameConversation) {
            setMessages(previous => {
              const latest = new Map(incoming.map(message => [message.id, message]))
              const seen = new Set(previous.map(message => message.id))
              const additions = incoming.filter(message => !seen.has(message.id))
              return [...previous.map(message => latest.get(message.id) || message), ...additions]
            })
          } else {
            seenRef.current = ''
            setMessages(incoming)
            setBefore(history?.next_before || '')
            setHasMore(Boolean(history?.has_more))
          }
          lastMessageKeyRef.current = key
          setConversation(item)
          if (item) await updateBlock(controller.signal)
          else setBlocked(false)
        }
        void markVisibleRead()
      } catch (err) {
        if (!controller.signal.aborted && (err.status === 401 || err.code === 'LOGIN_REQUIRED')) setLoginRequired(true)
      } finally { checking = false }
    }
    const onVisibility = () => { if (!document.hidden) { void markVisibleRead(); void checkIncoming() } }
    const onFocus = () => { void markVisibleRead(); void checkIncoming() }
    const interval = window.setInterval(() => { void checkIncoming() }, 60000)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)
    return () => {
      controller.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
    }
  }, [loading, loginRequired, sending, updateBlock, markVisibleRead])

  useLayoutEffect(() => {
    const element = scrollBoxRef.current
    if (!element) return
    const position = restoreScrollRef.current
    if (position) {
      element.scrollTop = position.top + element.scrollHeight - position.height
      restoreScrollRef.current = null
    } else if (nearBottomRef.current) {
      element.scrollTop = element.scrollHeight
    }
    if (!loading && !loginRequired) void markVisibleRead()
  }, [messages, loading, loginRequired, markVisibleRead])

  async function loadOlder() {
    if (!hasMore || !before || olderLoading) return
    setOlderLoading(true)
    setError('')
    try {
      const data = await getMySupportMessages({ before })
      const element = scrollBoxRef.current
      if (element) restoreScrollRef.current = { top: element.scrollTop, height: element.scrollHeight }
      setMessages(current => {
        const existing = new Set(current.map(message => message.id))
        return [...(data.messages || []).filter(message => !existing.has(message.id)), ...current]
      })
      setHasMore(Boolean(data.has_more))
      setBefore(data.next_before || '')
    } catch (err) {
      restoreScrollRef.current = null
      setError(err.message || tr('loadError'))
    } finally { setOlderLoading(false) }
  }

  const conversationId = conversation?.id || ''
  useEffect(() => {
    setSelectedIds([])
    setForwardText('')
    setPinListOpen(false)
    setPins([])
    setPinReadyFor('')
    setPinError(false)
    if (!conversationId || loginRequired) return undefined
    const controller = new AbortController()
    const epoch = ++pinEpochRef.current
    getMySupportPins({ signal: controller.signal }).then(data => {
      if (controller.signal.aborted || epoch !== pinEpochRef.current) return
      if (data.conversation_id !== conversationId) throw new Error('Support conversation changed')
      setPins(data.pins)
      setPinReadyFor(conversationId)
    }).catch(err => {
      if (!controller.signal.aborted && epoch === pinEpochRef.current) {
        if (err.status === 401 || err.code === 'LOGIN_REQUIRED') setLoginRequired(true)
        else setPinError(true)
      }
    })
    return () => { controller.abort(); pinAbortRef.current?.abort() }
  }, [conversationId, loginRequired, refreshIndex, pinRefresh])

  useEffect(() => {
    setSelectedIds(current => current.filter(id => messages.some(message => message.id === id && !message.deleted_at)))
  }, [messages])

  const pinReady = Boolean(conversationId && !loginRequired && pinReadyFor === conversationId)
  const activePins = pinReady ? pins.filter(pin => !messages.some(message => message.id === pin.message_id && message.deleted_at)) : []
  const pinnedIds = new Set(activePins.map(pin => pin.message_id))
  const selectionMode = selectedIds.length > 0
  const selectedText = messages.filter(message => selectedIds.includes(message.id) && !message.deleted_at && message.message_text).map(message => message.message_text).join('\n\n')
  const selectedForwardText = supportForwardText(messages.filter(message => selectedIds.includes(message.id)))
  const archived = conversation?.status === 'archived'
  useEffect(() => { if (loginRequired || archived || blocked) setForwardText('') }, [loginRequired, archived, blocked])
  const composeDisabled = Boolean(forwardText) || selectionMode || loading || loginRequired || archived || blocked || sending || Boolean(busyAction) || imageRetry
  const bubbleLabels = {
    message: tr('message'), messageOptions: tr('menu'), originalUnavailable: tr('originalUnavailable'),
    originalMessage: tr('message'), messageDeleted: tr('deleted'), edited: tr('edited'), read: tr('read'), sentStatus: tr('sent'),
  }
  const menuLabels = { reply: tr('reply'), edit: tr('edit'), copy: tr('copy'), delete: tr('delete'), info: tr('info'), close: tr('closeMenu'), pin: tr('pin'), unpin: tr('unpin'), select: tr('select'), forward: tr('forward') }
  const composerLabels = { camera: tr('camera'), image: tr('image'), searchMessages: tr('search'), emoji: tr('emoji'), saveEdit: tr('save'), sendMessage: tr('send') }
  const mediaLabels = { image: tr('image'), retry: tr('retry'), close: tr('close') }

  function openMenu(message, x, y) {
    if (!message || message.deleted_at || busyAction || sending || imageRetry || selectionMode) return
    const count = allowedActions(message, archived, blocked, pinReady).filter(action => action !== (pinnedIds.has(message.id) ? 'pin' : 'unpin')).length
    if (!count) return
    setMenu({ message, x: Math.max(8, Math.min(x, window.innerWidth - 228 - 8)), y: Math.max(8, Math.min(y, window.innerHeight - count * 40 - 24)) })
  }

  function clearCompose() {
    setReplyTarget(null)
    setEditTarget(null)
    setDraft('')
    pendingSendRef.current = null
  }

  function jumpToReply(id) {
    const node = messageRefs.current.get(id)
    if (!node) { setError(tr('originalUnavailable')); return }
    node.scrollIntoView({ block: 'center', behavior: 'smooth' })
    setHighlighted(id)
    window.clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = window.setTimeout(() => setHighlighted(''), 1800)
  }

  function toggleSelection(id) {
    if (selectedIds.includes(id)) setSelectedIds(current => current.filter(value => value !== id))
    else if (selectedIds.length >= 50) setError(tr('selectionLimit'))
    else if (messages.some(message => message.id === id && !message.deleted_at)) setSelectedIds(current => current.includes(id) || current.length >= 50 ? current : [...current, id])
  }

  async function copySelection() {
    if (!selectedText) return
    try {
      await navigator.clipboard.writeText(selectedText)
      setSelectedIds([])
      setCopied(true)
      window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch { setError(tr('actionError')) }
  }

  async function changePin(id, pinned) {
    if (!pinReady || archived || blocked || busyAction || sending || imageRetry || pinWriteRef.current) return
    pinWriteRef.current = true
    const controller = new AbortController()
    pinAbortRef.current = controller
    const epoch = ++pinEpochRef.current
    setBusyAction(pinned ? 'pin' : 'unpin')
    setError('')
    try {
      const data = await setMySupportPin(id, pinned, { signal: controller.signal })
      if (!controller.signal.aborted && epoch === pinEpochRef.current) {
        if (data.conversation_id !== conversationId) throw new Error('Support conversation changed')
        setPins(data.pins)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        if (err.code === 'SUPPORT_PIN_LIMIT') setError(tr('pinLimit'))
        else handleFailure(err, 'actionError')
      }
    } finally {
      if (pinAbortRef.current === controller) pinAbortRef.current = null
      pinWriteRef.current = false
      setBusyAction('')
    }
  }

  async function chooseAction(action, message) {
    setMenu(null)
    if (!allowedActions(message, archived, blocked, pinReady).includes(action)) return
    if (action === 'select') { toggleSelection(message.id); return }
    if (action === 'forward') {
      const text = supportForwardText([message])
      if (text) setForwardText(text)
      else setError(tr('forwardLimit'))
      return
    }
    if (action === 'pin' || action === 'unpin') { await changePin(message.id, action === 'pin'); return }
    if (action === 'info') { setInfoTarget(message); return }
    if (action === 'copy') {
      if (!message.message_text) return
      try {
        await navigator.clipboard.writeText(message.message_text)
        setCopied(true)
        window.clearTimeout(copyTimerRef.current)
        copyTimerRef.current = window.setTimeout(() => setCopied(false), 1800)
      } catch { setError(tr('actionError')) }
      return
    }
    if (archived || message.deleted_at || busyAction || sending || imageRetry) return
    if (action === 'reply') {
      clearCompose()
      setReplyTarget(message)
      composerRef.current?.focus()
      return
    }
    if (message.sender_kind !== 'reader') return
    if (action === 'edit' && message.message_text) {
      clearCompose()
      setEditTarget(message)
      setDraft(message.message_text)
      composerRef.current?.focus()
    } else if (action === 'delete') setDeleteTarget(message)
  }

  function handleFailure(err, fallback) {
    if (err.status === 401 || err.code === 'LOGIN_REQUIRED') setLoginRequired(true)
    if (err.code === 'SUPPORT_CHAT_BLOCKED') setBlocked(true)
    setError(err.code === 'SUPPORT_CHAT_BLOCKED' ? tr('blocked') : err.message || tr(fallback))
  }

  async function removeMessage() {
    if (!deleteTarget || busyAction || archived) return
    const id = deleteTarget.id
    setBusyAction('delete')
    setError('')
    try {
      const result = await deleteMySupportMessage(id)
      setMessages(current => current.map(message => message.id === id
        ? { ...message, ...result.message, message_text: null, attachments: [], deleted_at: result.message?.deleted_at || new Date().toISOString() }
        : message))
      setPins(current => current.filter(pin => pin.message_id !== id))
      if (editTarget?.id === id || replyTarget?.id === id) clearCompose()
      setDeleteTarget(null)
    } catch (err) { handleFailure(err, 'actionError') }
    finally { setBusyAction('') }
  }

  async function submit(event) {
    event?.preventDefault()
    const content = draft.trim()
    if (!content || content.length > 2000 || composeDisabled || sendingRef.current) return
    const editing = editTarget
    const replying = replyTarget
    sendingRef.current = true
    setSending(true)
    setError('')
    const requestKey = `${replying ? `reply:${replying.id}` : 'send'}:${content}`
    const requestId = pendingSendRef.current?.key === requestKey ? pendingSendRef.current.requestId : globalThis.crypto?.randomUUID?.()
    if (!editing) pendingSendRef.current = { key: requestKey, requestId }
    try {
      if (editing) {
        const result = await editMySupportMessage(editing.id, content)
        setMessages(current => current.map(message => message.id === editing.id ? { ...message, ...result.message } : message))
      } else if (replying) {
        await replyMySupportMessage(replying.id, content, requestId)
        nearBottomRef.current = true
      } else {
        await sendMySupportMessage(content, requestId)
        nearBottomRef.current = true
      }
      clearCompose()
      if (!editing) {
        try { await reload() }
        catch (err) { setError(err.message || tr('loadError')) }
      }
    } catch (err) { handleFailure(err, 'sendError') }
    finally { sendingRef.current = false; setSending(false) }
  }

  function chooseImage(ref) {
    if (composeDisabled || sendingRef.current) return
    if (editTarget || replyTarget) { setError(tr('imageMode')); return }
    ref.current?.click()
  }

  async function runImage() {
    if (!imageJobRef.current || sendingRef.current || loading || loginRequired || archived || blocked) return
    const controller = new AbortController()
    imageAbortRef.current = controller
    sendingRef.current = true
    setSending(true)
    setImageRetry(false)
    setError('')
    try {
      const result = await imageJobRef.current.run({ signal: controller.signal, onStage: setImageStage })
      if (controller.signal.aborted) return
      imageJobRef.current = null
      setImageStage('')
      nearBottomRef.current = true
      clearCompose()
      if (result.message) setMessages(current => [...current.filter(item => item.id !== result.message.id), result.message])
      try { await reload() }
      catch (err) { handleFailure(err, 'loadError') }
    } catch (err) {
      if (controller.signal.aborted) return
      const expired = ['SUPPORT_IMAGE_UPLOAD_EXPIRED', 'SUPPORT_IMAGE_FINALIZE_EXPIRED'].includes(err.code)
      const permanent = expired || [400, 401, 403, 413].includes(err.status)
      if (permanent) imageJobRef.current = null
      setImageRetry(!permanent)
      setImageStage('')
      handleFailure(err, 'imageError')
      if (expired) setError(tr('imageExpired'))
    } finally {
      if (imageAbortRef.current === controller) imageAbortRef.current = null
      sendingRef.current = false
      if (!controller.signal.aborted) setSending(false)
    }
  }

  function selectedImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || composeDisabled || sendingRef.current || editTarget || replyTarget) return
    try {
      imageJobRef.current = createMySupportImageUpload(file)
      void runImage()
    } catch (err) { handleFailure(err, 'imageError') }
  }

  function cancelImage() {
    if (sendingRef.current) return
    imageJobRef.current = null
    setImageRetry(false)
    setImageStage('')
    setError('')
  }

  function onMediaLayout() {
    const node = scrollBoxRef.current
    if (node && nearBottomRef.current) node.scrollTop = node.scrollHeight
    void markVisibleRead()
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]" style={viewport ? { top: `${viewport.top}px`, height: `${viewport.height}px` } : undefined}>
      <header className="z-10 shrink-0 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-[64px] w-full max-w-[720px] items-center gap-2 px-2 sm:px-4">
          <button type="button" onClick={() => navigate(-1)} aria-label={tr('back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"><ChevronLeft size={26} /></button>
          <img src={LOGO} alt="Shadow Admin" className="h-11 w-11 shrink-0 rounded-full border border-[var(--shadow-border)] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5"><span className="truncate text-[15px] font-bold">Shadow Admin</span><BadgeCheck size={17} className="shrink-0 text-blue-500" aria-label={tr('verified')} /></div>
            <p className="truncate text-[11px] text-[var(--shadow-text-secondary)]">{tr('subtitle')}</p>
          </div>
        </div>
      </header>
      {!loading && !loginRequired && pinError && <button type="button" onClick={() => setPinRefresh(value => value + 1)} className="shrink-0 px-3 py-2 text-center text-[11px] text-amber-700">{tr('pinError')}</button>}
      {!loading && !loginRequired && activePins.length > 0 && (
        <div className="z-10 shrink-0 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          <div className="mx-auto flex max-w-[720px] items-center gap-2 px-4 py-2">
            <button type="button" onClick={() => jumpToReply(activePins[0].message_id)} className="min-w-0 flex-1 border-l-[3px] border-amber-500 pl-3 text-left"><span className="flex items-center gap-1 text-[10px] font-bold text-amber-600"><Pin size={12} />{tr('pinned')} · {activePins.length}</span><span className="block truncate text-[12px]">{activePins[0].message_text || tr(activePins[0].has_attachment ? 'image' : 'message')}</span></button>
            <button type="button" onClick={() => setPinListOpen(value => !value)} aria-label={tr('pinned')} aria-expanded={pinListOpen} className="flex h-8 w-8 items-center justify-center rounded-full"><ChevronDown size={18} /></button>
            {!archived && !blocked && <button type="button" disabled={Boolean(busyAction) || sending || imageRetry} onClick={() => void changePin(activePins[0].message_id, false)} aria-label={tr('unpin')} className="flex h-8 w-8 items-center justify-center rounded-full text-amber-600 disabled:opacity-40"><PinOff size={16} /></button>}
          </div>
          {pinListOpen && <div className="mx-auto max-h-[30vh] max-w-[720px] overflow-y-auto px-4 pb-2">{activePins.map(pin => <div key={pin.message_id} className="flex items-center gap-2 border-t border-[var(--shadow-border)] py-2"><button type="button" className="min-w-0 flex-1 truncate text-left text-[12px]" onClick={() => { setPinListOpen(false); jumpToReply(pin.message_id) }}>{pin.message_text || tr(pin.has_attachment ? 'image' : 'message')}</button>{!archived && !blocked && <button type="button" disabled={Boolean(busyAction) || sending || imageRetry} onClick={() => void changePin(pin.message_id, false)} aria-label={tr('unpin')} className="rounded-full p-2 text-amber-600 disabled:opacity-40"><PinOff size={15} /></button>}</div>)}</div>}
        </div>
      )}
      <main ref={scrollBoxRef} onScroll={event => {
        const node = event.currentTarget
        nearBottomRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 120
        if (menu) setMenu(null)
        void markVisibleRead()
      }} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--shadow-bg-page)]">
        <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col px-3 py-4 sm:px-4">
          <p className="mb-5 text-center text-[11px] text-[var(--shadow-text-tertiary)]">{tr('private')}</p>
          {loading && <PageLoadingState label={tr('loading')} rows={3} />}
          {!loading && loginRequired && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
              <PageEmptyState title={tr('signIn')} body={tr('private')} />
              <button type="button" onClick={() => navigate('/login')} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white">{tr('goLogin')}</button>
            </div>
          )}
          {!loading && !loginRequired && error && messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-12"><PageErrorState title={tr('loadError')} body={error} actionLabel={tr('retry')} onAction={() => setRefreshIndex(count => count + 1)} /></div>
          )}
          {!loading && !loginRequired && !error && messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-12"><PageEmptyState title={tr('empty')} body={tr('emptyText')} /></div>
          )}
          {!loading && !loginRequired && messages.length > 0 && (
            <div className="space-y-2">
              {hasMore && <div className="pb-2 text-center"><button type="button" disabled={olderLoading} onClick={loadOlder} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-[12px] font-semibold disabled:opacity-60">{olderLoading ? <LoaderCircle size={15} className="animate-spin" /> : <ChevronDown size={15} />}{tr(olderLoading ? 'loadingOlder' : 'loadOlder')}</button></div>}
              {messages.map(item => {
                const repliedTo = item.reply_to_message_id ? messages.find(message => message.id === item.reply_to_message_id) : null
                const bubble = toBubble(item, repliedTo)
                const images = Array.isArray(item.attachments) ? item.attachments.map(imageSource).filter(Boolean) : []
                const media = !item.deleted_at && (privateImage(item) ? <SupportChatPrivateImage key={item.id} messageId={item.id} labels={mediaLabels} onLayout={onMediaLayout} /> : images.length > 0 ? (
                  <div className="mt-2 grid max-w-[250px] grid-cols-2 gap-1.5">
                    {images.map((src, index) => <a key={`${src}-${index}`} href={src} target="_blank" rel="noopener noreferrer" className={images.length === 1 ? 'col-span-2' : ''}><img src={src} alt={tr('image')} loading="lazy" onLoad={onMediaLayout} className="max-h-[240px] w-full rounded-xl object-cover" /></a>)}
                  </div>
                ) : null)
                return <SharedChatMessageBubble key={item.id} message={bubble} variant="support" labels={bubbleLabels} media={media} isPinned={pinnedIds.has(item.id)} selected={selectedIds.includes(item.id)} selectionMode={selectionMode} onToggleSelection={toggleSelection} isRead={Boolean(item.seen_at)} highlighted={highlighted === item.id} setMessageRef={(id, node) => { if (node) messageRefs.current.set(id, node); else messageRefs.current.delete(id) }} onOpenMenu={openMenu} onJumpToReply={jumpToReply} />
              })}
            </div>
          )}
        </div>
      </main>
      <div className="z-10 shrink-0 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]" style={{ paddingBottom: viewport?.keyboard ? '8px' : 'max(10px, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto w-full max-w-[720px]">
          {archived && <p className="mx-3 mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900">{tr('archived')}</p>}
          {blocked && <p className="mx-3 mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900">{tr('blocked')}</p>}
          {!loginRequired && error && messages.length > 0 && <p role="alert" className="mx-3 mt-2 text-[12px] text-red-600">{error}</p>}
          {imageStage && <div role="status" className="mx-3 mt-2 flex items-center gap-2 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px]"><LoaderCircle size={16} className="animate-spin text-amber-600" />{tr(imageStage)}</div>}
          {imageRetry && <div className="mx-3 mt-2 flex items-center justify-end gap-2"><button type="button" onClick={cancelImage} className="rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-[12px]">{tr('cancel')}</button><button type="button" disabled={blocked || archived || loginRequired} onClick={() => void runImage()} className="rounded-xl bg-amber-500 px-3 py-2 text-[12px] font-bold text-white disabled:opacity-50">{tr('retry')}</button></div>}
          {(editTarget || replyTarget) && (
            <div className="mx-3 mt-2 flex items-center gap-2 rounded-xl border-l-[3px] border-amber-500 bg-[var(--shadow-bg-soft)] px-3 py-2">
              {editTarget ? <Pencil size={15} className="shrink-0 text-amber-600" /> : <CornerUpLeft size={15} className="shrink-0 text-amber-600" />}
              <div className="min-w-0 flex-1"><p className="text-[12px] font-bold">{tr(editTarget ? 'editing' : 'replying')}</p><p className="truncate text-[11px] text-[var(--shadow-text-secondary)]">{(editTarget || replyTarget)?.message_text || tr('message')}</p></div>
              <button type="button" onClick={clearCompose} aria-label={tr('cancel')} className="flex h-8 w-8 items-center justify-center rounded-full"><X size={17} /></button>
            </div>
          )}
          <input ref={cameraRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif" capture="environment" onChange={selectedImage} className="hidden" />
          <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif" onChange={selectedImage} className="hidden" />
          {selectionMode ? <div className="flex items-center gap-2 px-3 pt-2"><button type="button" onClick={() => setSelectedIds([])} aria-label={tr('cancel')} className="flex h-9 w-9 items-center justify-center rounded-full"><X size={19} /></button><span className="min-w-0 flex-1 text-[12px] font-semibold">{tr('selected')}: {selectedIds.length}</span><button type="button" disabled={!selectedText} onClick={() => void copySelection()} className="rounded-xl bg-amber-500 px-3 py-2 text-[12px] font-bold text-white disabled:opacity-40">{tr('copySelected')}</button>{!archived && !blocked && <button type="button" disabled={sending || Boolean(busyAction) || imageRetry} onClick={() => selectedForwardText ? setForwardText(selectedForwardText) : setError(tr('forwardLimit'))} className="rounded-xl border border-amber-500 px-3 py-2 text-[12px] font-bold text-amber-600 disabled:opacity-40">{tr('forward')}</button>}</div> : <div className="px-3 pt-2">
            <SharedChatComposer variant="support" labels={composerLabels} textareaRef={composerRef} text={draft} onChange={setDraft} canSend={!composeDisabled} sending={sending} editing={Boolean(editTarget)} placeholder={tr(blocked ? 'blocked' : archived ? 'archived' : 'placeholder')} onSend={submit} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) void submit(event) }} onCamera={() => chooseImage(cameraRef)} onGallery={() => chooseImage(galleryRef)} onComingSoon={() => setError(tr('comingSoon'))} />
          </div>}
        </div>
      </div>
      <SharedMessageActionMenu state={menu} variant="support" labels={menuLabels} isPinned={pinnedIds.has(menu?.message?.id)} allowedActions={allowedActions(menu?.message, archived, blocked, pinReady)} busy={busyAction || (sending ? 'sending' : '')} onClose={() => setMenu(null)} onAction={chooseAction} />
      {forwardText && !loginRequired && !archived && !blocked && <SupportChatForwardDialog text={forwardText} labels={{ title: tr('forward'), recipient: tr('forwardRecipient'), note: tr('forwardNote'), empty: tr('forwardEmpty'), loadError: tr('forwardLoadError'), sendError: tr('forwardSendError'), success: tr('forwardSuccess'), close: tr('close'), send: tr('send') }} onClose={() => setForwardText('')} onDone={() => setSelectedIds([])} />}
      {deleteTarget && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 px-5">
          <div role="alertdialog" aria-modal="true" aria-labelledby="support-delete-title" className="w-full max-w-[340px] rounded-2xl bg-[var(--shadow-bg-surface)] p-5 text-[var(--shadow-text-primary)] shadow-2xl">
            <h2 id="support-delete-title" className="text-[16px] font-bold">{tr('confirmDelete')}</h2>
            <p className="mt-2 text-[13px] text-[var(--shadow-text-secondary)]">{tr('deleteNote')}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" disabled={Boolean(busyAction)} onClick={() => setDeleteTarget(null)} className="rounded-xl bg-[var(--shadow-bg-soft)] px-4 py-2.5 text-[13px] font-semibold">{tr('cancel')}</button>
              <button type="button" disabled={Boolean(busyAction)} onClick={() => void removeMessage()} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60">{busyAction && <LoaderCircle size={15} className="animate-spin" />}{tr('delete')}</button>
            </div>
          </div>
        </div>
      )}
      {infoTarget && <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 px-5" onClick={() => setInfoTarget(null)}><div role="dialog" aria-modal="true" aria-label={tr('info')} onClick={event => event.stopPropagation()} className="w-full max-w-[340px] rounded-2xl bg-[var(--shadow-bg-surface)] p-5 shadow-xl"><div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-bold">{tr('info')}</h2><button type="button" onClick={() => setInfoTarget(null)} aria-label={tr('close')}><X size={20} /></button></div><div className="space-y-2 text-[13px]"><p>{tr('sent')}: {displayTime(infoTarget.created_at)}</p>{infoTarget.edited_at && <p>{tr('edited')}: {displayTime(infoTarget.edited_at)}</p>}{infoTarget.seen_at && <p>{tr('read')}: {displayTime(infoTarget.seen_at)}</p>}</div></div></div>}
      {copied && <div role="status" className="fixed bottom-24 left-1/2 z-[170] -translate-x-1/2 rounded-full bg-[#282832] px-4 py-2 text-[12px] font-semibold text-white shadow-lg">{tr('copied')}</div>}
    </div>
  )
}
