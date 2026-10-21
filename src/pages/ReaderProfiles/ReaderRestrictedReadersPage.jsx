import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircleOff, MessageSquare, AtSign, EyeOff, ShieldCheck } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  DEFAULT_READER_RESTRICTION_SETTINGS,
  getReaderRestrictionSettings,
  updateReaderRestrictionSetting,
} from '../../services/readerRestrictionSettingsApi'

registerTranslationNamespace('readerRestrictedReaders', {
  en: {
    title: 'Restricted readers', back: 'Back to Settings',
    heading: 'Choose what to limit',
    description: 'You decide how readers you restrict can interact with you. All options are off by default.',
    hide_comments: 'Hide comments',
    hide_comments_help: 'Show their comments to you only until you approve them for everyone.',
    filter_messages: 'Filter messages',
    filter_messages_help: 'Move their messages to Message Requests without new-message alerts.',
    hide_activity_status: 'Hide activity status',
    hide_activity_status_help: 'Do not show your online status or read receipts to them.',
    mute_mentions: 'Mute mentions',
    mute_mentions_help: 'Do not alert you when they mention your account.',
    note: 'These choices apply only to readers you explicitly restrict. Other readers keep their normal messaging and notification behavior.',
    pending: 'The restricted-reader list and interaction enforcement will be connected in later steps.',
    loading: 'Loading your settings...', saving: 'Saving...', saved: 'Setting saved.',
    loadError: 'Could not load your settings.', saveError: 'Could not save this setting.',
    retry: 'Try again',
  },
  km: {
    title: 'អ្នកអានដែលបាន Restrict', back: 'ត្រឡប់ទៅការកំណត់',
    heading: 'ជ្រើសរើសអ្វីដែលចង់កំណត់',
    description: 'អ្នកជាអ្នកសម្រេចថាត្រូវកំណត់ការទាក់ទងរបស់អ្នកអានដែលអ្នកបាន Restrict បែបណា។ មុខងារទាំងអស់បិទតាមលំនាំដើម។',
    hide_comments: 'លាក់ Comment',
    hide_comments_help: 'Comment របស់គេឱ្យឃើញតែអ្នក រហូតដល់អ្នកអនុម័តឱ្យបង្ហាញជាសាធារណៈ។',
    filter_messages: 'ចម្រោះ Message',
    filter_messages_help: 'ផ្លាស់ទីសាររបស់គេទៅ Message Requests ដោយមិនជូនដំណឹងសារថ្មី។',
    hide_activity_status: 'លាក់ស្ថានភាពសកម្មភាព',
    hide_activity_status_help: 'មិនបង្ហាញ Online និង Seen របស់អ្នកដល់ពួកគេ។',
    mute_mentions: 'បិទសំឡេងជូនដំណឹង Mention',
    mute_mentions_help: 'មិនជូនដំណឹងនៅពេលគេ Mention គណនីរបស់អ្នក។',
    note: 'ការកំណត់ទាំងនេះអនុវត្តតែលើអ្នកអានដែលអ្នកជ្រើស Restrict ប៉ុណ្ណោះ។ អ្នកអានផ្សេងទៀតនៅតែទទួល និងផ្ញើ Message/Notification ធម្មតា។',
    pending: 'បញ្ជីអ្នកដែល Restrict និងការអនុវត្តលើ Comment/Message នឹងភ្ជាប់នៅដំណាក់កាលបន្ទាប់។',
    loading: 'កំពុងផ្ទុកការកំណត់...', saving: 'កំពុងរក្សាទុក...', saved: 'បានរក្សាទុកការកំណត់។',
    loadError: 'មិនអាចផ្ទុកការកំណត់បានទេ។', saveError: 'មិនអាចរក្សាទុកការកំណត់នេះបានទេ។',
    retry: 'ព្យាយាមម្តងទៀត',
  },
  zh: {
    title: '受限读者', back: '返回设置', heading: '选择限制的互动',
    description: '你可决定如何限制指定读者与你互动。所有选项默认关闭。',
    hide_comments: '隐藏评论', hide_comments_help: '他们的评论仅对你可见，直到你批准公开。',
    filter_messages: '过滤消息', filter_messages_help: '将他们的消息移至消息请求，不发送新消息通知。',
    hide_activity_status: '隐藏活动状态', hide_activity_status_help: '不向他们显示在线状态或已读回执。',
    mute_mentions: '静音提及', mute_mentions_help: '当他们提及你时不发送通知。',
    note: '仅对你明确限制的读者生效，其他人的消息和通知不受影响。',
    pending: '受限读者名单及互动限制将在后续步骤接入。',
    loading: '正在加载设置...', saving: '正在保存...', saved: '设置已保存。',
    loadError: '无法加载设置。', saveError: '无法保存设置。', retry: '重试',
  },
  ja: {
    title: '制限した読者', back: '設定に戻る', heading: '制限する内容を選択',
    description: '制限した読者とのやり取りを自分で選べます。すべて初期設定はオフです。',
    hide_comments: 'コメントを非表示', hide_comments_help: '承認するまで、その人のコメントは自分だけに表示されます。',
    filter_messages: 'メッセージを振り分け', filter_messages_help: '通知せずにメッセージリクエストへ移動します。',
    hide_activity_status: 'アクティビティを非表示', hide_activity_status_help: 'オンライン状態と既読を相手に表示しません。',
    mute_mentions: 'メンションをミュート', mute_mentions_help: '相手からのメンション通知を停止します。',
    note: '明示的に制限した読者にのみ適用されます。他の読者のメッセージと通知は通常通りです。',
    pending: '制限読者リストと実際の制限処理は次の段階で接続します。',
    loading: '読み込み中...', saving: '保存中...', saved: '保存しました。',
    loadError: '設定を読み込めませんでした。', saveError: '設定を保存できませんでした。', retry: '再試行',
  },
  ko: {
    title: '제한된 독자', back: '설정으로 돌아가기', heading: '제한할 항목 선택',
    description: '제한한 독자가 나와 소통하는 방식을 선택하세요. 모든 항목은 기본적으로 꺼져 있습니다.',
    hide_comments: '댓글 숨기기', hide_comments_help: '승인하기 전까지 댓글은 나에게만 보입니다.',
    filter_messages: '메시지 필터링', filter_messages_help: '알림 없이 메시지 요청으로 이동합니다.',
    hide_activity_status: '활동 상태 숨기기', hide_activity_status_help: '온라인 상태와 읽음 표시를 숨깁니다.',
    mute_mentions: '멘션 알림 끄기', mute_mentions_help: '제한한 독자의 멘션 알림을 받지 않습니다.',
    note: '직접 제한한 독자에게만 적용되며 다른 독자의 메시지와 알림은 그대로 유지됩니다.',
    pending: '제한 독자 목록과 실제 제한 처리는 다음 단계에서 연결됩니다.',
    loading: '설정을 불러오는 중...', saving: '저장 중...', saved: '설정이 저장되었습니다.',
    loadError: '설정을 불러올 수 없습니다.', saveError: '설정을 저장할 수 없습니다.', retry: '다시 시도',
  },
})

const PREFERENCES = [
  { key: 'hide_comments', Icon: MessageCircleOff },
  { key: 'filter_messages', Icon: MessageSquare },
  { key: 'hide_activity_status', Icon: EyeOff },
  { key: 'mute_mentions', Icon: AtSign },
]

function RestrictionSwitch({ checked, disabled, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={`relative block h-8 w-[54px] rounded-full p-1 transition-colors duration-200 ${checked ? 'bg-[#111827]' : 'bg-[#D1D6DE]'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-[left] duration-200 ${checked ? 'left-[26px]' : 'left-1'}`} />
      </span>
    </button>
  )
}

export default function ReaderRestrictedReadersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const backPath = fromMeSettings ? '/profile/settings?from=me-settings' : '/profile/settings'
  const tr = (key) => t(`readerRestrictedReaders.${key}`)
  const [settings, setSettings] = useState(DEFAULT_READER_RESTRICTION_SETTINGS)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setReady(false)
      setError('')
      setMessage('')
      try {
        const result = await getReaderRestrictionSettings({ signal: controller.signal })
        if (!controller.signal.aborted) {
          setSettings(result)
          setReady(true)
        }
      } catch (reason) {
        if (controller.signal.aborted) return
        if (reason.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError(tr('loadError'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [reloadKey, navigate])

  async function updatePreference(key) {
    if (!ready || loading || saving) return
    setSaving(key)
    setError('')
    setMessage('')
    try {
      const next = await updateReaderRestrictionSetting(key, !settings[key])
      setSettings(next)
      setMessage(tr('saved'))
    } catch (reason) {
      if (reason.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setError(tr('saveError'))
    } finally {
      setSaving('')
    }
  }

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(32px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(backPath)} aria-label={tr('back')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={21} strokeWidth={1.8} />
          </button>
          <h1 className="text-[18px] font-semibold">{tr('title')}</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] space-y-4 px-4 pt-5">
        <section className="px-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={19} strokeWidth={1.7} aria-hidden="true" />
            <h2 className="text-[17px] font-semibold">{tr('heading')}</h2>
          </div>
          <p className="mt-2 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('description')}</p>
        </section>

        <section className="overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
          {PREFERENCES.map(({ key, Icon }, index) => (
            <div key={key} className={`flex items-center gap-3 px-4 py-4 ${index !== 0 ? 'border-t border-[var(--shadow-border)]' : ''}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)]">
                <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-semibold">{tr(key)}</h3>
                <p className="mt-1 text-[11px] leading-[18px] text-[var(--shadow-text-secondary)]">{tr(`${key}_help`)}</p>
              </div>
              <RestrictionSwitch
                checked={settings[key]}
                disabled={!ready || loading || Boolean(saving)}
                onChange={() => updatePreference(key)}
                label={tr(key)}
              />
            </div>
          ))}
        </section>

        <p className="px-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('note')}</p>
        <p className="px-1 text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">{tr('pending')}</p>
        {loading && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('loading')}</p>}
        {saving && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('saving')}</p>}
        {message && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{message}</p>}
        {error && (
          <div role="alert" className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3 text-[12px]">
            <p>{error}</p>
            {!ready && !loading && (
              <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-2 font-semibold underline">
                {tr('retry')}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
