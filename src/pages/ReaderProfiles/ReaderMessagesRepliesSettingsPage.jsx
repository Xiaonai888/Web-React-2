import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, MessageCircle } from 'lucide-react'
import { getReaderToken } from '../../services/chatApi'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerMessagesRepliesSettings', {
  en: {
    title: 'Messages and replies',
    back: 'Back to settings',
    messages: 'Messages',
    replies: 'Replies',
    messageAudience: 'Who can message you?',
    messageAudienceHelp: 'Choose who can start a direct conversation with you.',
    messageRequests: 'Message requests',
    messageRequestsHelp: 'Allow new conversations to arrive as requests for your approval.',
    replyAudience: 'Who can reply to your posts?',
    replyAudienceHelp: 'Choose who can reply to comments on your Reader Posts. Other comment settings still apply.',
    messageNotifications: 'Message notifications',
    messageNotificationsHelp: 'Play incoming message notification sounds. Unread badges remain visible.',
    everyone: 'Everyone',
    following: 'People you follow',
    followers: 'Your followers',
    nobody: 'No one',
    loading: 'Loading your settings...',
    saving: 'Saving...',
    saved: 'Saved to your account.',
    loadError: 'Could not load your settings. Please try again.',
    saveError: 'Could not save your settings. Please try again.',
    retry: 'Try again',
  },
  km: {
    title: 'សារ និងការឆ្លើយតប',
    back: 'ត្រឡប់ទៅការកំណត់',
    messages: 'សារ',
    replies: 'ការឆ្លើយតប',
    messageAudience: 'អ្នកណាអាចផ្ញើសារមកអ្នក?',
    messageAudienceHelp: 'ជ្រើសរើសអ្នកដែលអាចចាប់ផ្ដើមការសន្ទនាផ្ទាល់ជាមួយអ្នក។',
    messageRequests: 'សំណើសារ',
    messageRequestsHelp: 'អនុញ្ញាតឱ្យការសន្ទនាថ្មីចូលជាសំណើសម្រាប់អ្នកយល់ព្រម។',
    replyAudience: 'អ្នកណាអាច Reply លើ Posts របស់អ្នក?',
    replyAudienceHelp: 'ជ្រើសរើសអ្នកដែលអាចឆ្លើយតបទៅ Comment លើ Reader Posts របស់អ្នក។ ការកំណត់ Comment ផ្សេងទៀតនៅមានប្រសិទ្ធភាពដដែល។',
    messageNotifications: 'ការជូនដំណឹងសារ',
    messageNotificationsHelp: 'ចាក់សំឡេងពេលមានសារថ្មី។ ចំនួនសារមិនទាន់អាននៅតែបង្ហាញ។',
    everyone: 'គ្រប់គ្នា',
    following: 'អ្នកដែលអ្នក Follow',
    followers: 'អ្នកដែល Follow អ្នក',
    nobody: 'គ្មាននរណា',
    loading: 'កំពុងផ្ទុកការកំណត់...',
    saving: 'កំពុងរក្សាទុក...',
    saved: 'បានរក្សាទុកក្នុងគណនីរបស់អ្នក។',
    loadError: 'មិនអាចផ្ទុកការកំណត់បានទេ។ សូមព្យាយាមម្ដងទៀត។',
    saveError: 'មិនអាចរក្សាទុកការកំណត់បានទេ។ សូមព្យាយាមម្ដងទៀត។',
    retry: 'ព្យាយាមម្ដងទៀត',
  },
  zh: {
    title: '消息与回复', back: '返回设置', messages: '消息', replies: '回复',
    messageAudience: '谁可以给你发消息？', messageAudienceHelp: '选择谁可以与你发起私聊。',
    messageRequests: '消息请求', messageRequestsHelp: '将新聊天作为待审批请求接收。',
    replyAudience: '谁可以回复你的帖子？', replyAudienceHelp: '选择谁可以回复你读者帖子上的评论；其他评论设置仍然有效。',
    messageNotifications: '消息通知', messageNotificationsHelp: '开启新消息提示音；未读标记仍会显示。',
    everyone: '所有人', following: '我关注的人', followers: '关注我的人', nobody: '任何人都不行',
    loading: '正在加载设置...', saving: '正在保存...', saved: '已保存到你的账户。',
    loadError: '无法加载设置，请重试。', saveError: '无法保存设置，请重试。', retry: '重试',
  },
  ja: {
    title: 'メッセージと返信', back: '設定に戻る', messages: 'メッセージ', replies: '返信',
    messageAudience: '誰がメッセージを送れますか？', messageAudienceHelp: 'あなたにチャットを開始できる人を選択します。',
    messageRequests: 'メッセージリクエスト', messageRequestsHelp: '新しい会話を承認待ちとして受信します。',
    replyAudience: '誰が投稿に返信できますか？', replyAudienceHelp: 'あなたの投稿のコメントに返信できる人を選びます。他のコメント設定も適用されます。',
    messageNotifications: 'メッセージ通知', messageNotificationsHelp: '新着メッセージの音を有効にします。未読表示は残ります。',
    everyone: '全員', following: 'フォロー中の人', followers: 'フォロワー', nobody: '誰も許可しない',
    loading: '設定を読み込み中...', saving: '保存中...', saved: 'アカウントに保存しました。',
    loadError: '設定を読み込めませんでした。', saveError: '保存できませんでした。', retry: '再試行',
  },
  ko: {
    title: '메시지 및 답글', back: '설정으로 돌아가기', messages: '메시지', replies: '답글',
    messageAudience: '누가 메시지를 보낼 수 있나요?', messageAudienceHelp: '대화를 시작할 수 있는 사람을 선택하세요.',
    messageRequests: '메시지 요청', messageRequestsHelp: '새 대화를 승인 요청으로 받습니다.',
    replyAudience: '누가 게시물에 답글을 달 수 있나요?', replyAudienceHelp: '게시물 댓글에 답글을 달 수 있는 사람을 선택합니다. 다른 댓글 설정도 적용됩니다.',
    messageNotifications: '메시지 알림', messageNotificationsHelp: '새 메시지 알림 소리를 재생합니다. 읽지 않음 배지는 유지됩니다.',
    everyone: '모두', following: '내가 팔로우하는 사람', followers: '내 팔로워', nobody: '아무도 안 됨',
    loading: '설정을 불러오는 중...', saving: '저장 중...', saved: '계정에 저장되었습니다.',
    loadError: '설정을 불러올 수 없습니다.', saveError: '설정을 저장할 수 없습니다.', retry: '다시 시도',
  },
})

const DEFAULT_SETTINGS = {
  messageAudience: 'everyone',
  messageRequests: true,
  replyAudience: 'everyone',
  messageNotifications: true,
}

const MESSAGE_AUDIENCES = ['everyone', 'following', 'nobody']
const REPLY_AUDIENCES = ['everyone', 'followers', 'nobody']
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')
const SETTINGS_URL = `${API_BASE_URL}/api/users/me/messages-replies`

function normalizeSettings(value) {
  return {
    messageAudience: MESSAGE_AUDIENCES.includes(value?.messageAudience)
      ? value.messageAudience : DEFAULT_SETTINGS.messageAudience,
    messageRequests: typeof value?.messageRequests === 'boolean'
      ? value.messageRequests : DEFAULT_SETTINGS.messageRequests,
    replyAudience: REPLY_AUDIENCES.includes(value?.replyAudience)
      ? value.replyAudience : DEFAULT_SETTINGS.replyAudience,
    messageNotifications: typeof value?.messageNotifications === 'boolean'
      ? value.messageNotifications : DEFAULT_SETTINGS.messageNotifications,
  }
}

function SettingSwitch({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className="shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={`relative block h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${checked ? 'bg-[#111827]' : 'bg-[#D1D6DE]'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${checked ? 'left-[26px]' : 'left-1'}`} />
      </span>
    </button>
  )
}

function AudienceRow({ title, description, value, options, disabled, onChange, t }) {
  return (
    <div className="px-4 py-4">
      <h3 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">{title}</h3>
      <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{description}</p>
      <div className="mt-3 space-y-1" role="radiogroup" aria-label={title}>
        {options.map((option) => (
          <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 text-[13px] text-[var(--shadow-text-primary)]">
            <input
              type="radio"
              name={title}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              disabled={disabled}
              className="h-4 w-4 accent-[#7c3aed] disabled:opacity-40"
            />
            {t(`readerMessagesRepliesSettings.${option}`)}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function ReaderMessagesRepliesSettingsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const backPath = fromMeSettings ? '/profile/settings?from=me-settings' : '/profile/settings'
  const tr = (key) => t(`readerMessagesRepliesSettings.${key}`)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return undefined
    }

    const controller = new AbortController()
    setReady(false)
    setStatus('')

    const load = async () => {
      try {
        const response = await fetch(SETTINGS_URL, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !data.settings) throw new Error('LOAD_FAILED')
        if (!controller.signal.aborted) {
          setSettings(normalizeSettings(data.settings))
          setReady(true)
        }
      } catch {
        if (!controller.signal.aborted) setStatus('loadError')
      }
    }

    void load()
    return () => controller.abort()
  }, [navigate, retryKey])

  async function updateSetting(key, value) {
    if (!ready || saving) return
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    const next = { ...settings, [key]: value }
    setSaving(true)
    setStatus('')
    try {
      const response = await fetch(SETTINGS_URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(next),
        cache: 'no-store',
      })
      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !data.settings) throw new Error('SAVE_FAILED')
      setSettings(normalizeSettings(data.settings))
      setStatus('saved')
      window.dispatchEvent(new CustomEvent('shadow-message-preferences-updated'))
    } catch {
      setStatus('saveError')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-12">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(backPath)} aria-label={tr('back')} className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={21} strokeWidth={1.9} />
          </button>
          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{tr('title')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pt-5">
        {!ready && status !== 'loadError' ? (
          <p className="py-8 text-center text-[13px] text-[var(--shadow-text-secondary)]" role="status">{tr('loading')}</p>
        ) : null}
        {!ready && status === 'loadError' ? (
          <div className="space-y-4 py-10 text-center">
            <p role="alert" className="text-[13px] text-red-500">{tr('loadError')}</p>
            <button type="button" onClick={() => setRetryKey((n) => n + 1)} className="rounded-full bg-[#111827] px-5 py-2.5 text-[13px] text-white">{tr('retry')}</button>
          </div>
        ) : null}

        {ready ? (
          <>
            <h2 className="mb-3 px-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{tr('messages')}</h2>
            <section className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
              <AudienceRow
                title={tr('messageAudience')}
                description={tr('messageAudienceHelp')}
                value={settings.messageAudience}
                options={MESSAGE_AUDIENCES}
                disabled={saving}
                onChange={(value) => updateSetting('messageAudience', value)}
                t={t}
              />
              <div className="mx-4 border-t border-[var(--shadow-border)]" />
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1eaff] text-[#7040d8]"><MessageCircle size={20} strokeWidth={1.8} /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">{tr('messageRequests')}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{tr('messageRequestsHelp')}</p>
                </div>
                <SettingSwitch checked={settings.messageRequests} disabled={saving} label={tr('messageRequests')} onChange={() => updateSetting('messageRequests', !settings.messageRequests)} />
              </div>
            </section>

            <h2 className="mb-3 mt-7 px-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">{tr('replies')}</h2>
            <section className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
              <AudienceRow
                title={tr('replyAudience')}
                description={tr('replyAudienceHelp')}
                value={settings.replyAudience}
                options={REPLY_AUDIENCES}
                disabled={saving}
                onChange={(value) => updateSetting('replyAudience', value)}
                t={t}
              />
              <div className="mx-4 border-t border-[var(--shadow-border)]" />
              <div className="flex items-center gap-3 px-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e7f0ff] text-[#2885e9]"><Bell size={20} strokeWidth={1.8} /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold text-[var(--shadow-text-primary)]">{tr('messageNotifications')}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{tr('messageNotificationsHelp')}</p>
                </div>
                <SettingSwitch checked={settings.messageNotifications} disabled={saving} label={tr('messageNotifications')} onChange={() => updateSetting('messageNotifications', !settings.messageNotifications)} />
              </div>
            </section>
            {saving ? <p role="status" className="mt-4 text-[12px] text-[var(--shadow-text-secondary)]">{tr('saving')}</p> : null}
            {status === 'saved' ? <p role="status" className="mt-4 text-[12px] text-emerald-600">{tr('saved')}</p> : null}
            {status === 'saveError' ? <p role="alert" className="mt-4 text-[12px] text-red-500">{tr('saveError')}</p> : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
