import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, AtSign, Tag, ShieldCheck } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerTagsMentions', {
  en: {
    title: 'Tags and mentions', back: 'Back to Settings',
    intro: 'Choose who can tag or mention you on Shadow.',
    tagTitle: 'Who can tag you?', tagHelp: 'Choose who can tag you in posts.',
    mentionTitle: 'Who can mention you?', mentionHelp: 'Choose who can mention your @username.',
    everyone: 'Everyone', following: 'People you follow', nobody: 'No one',
    reviewTitle: 'Review tags manually', reviewHelp: 'Approve tags before they appear on your profile when tagged posts are supported.',
    blocked: 'Blocked readers cannot tag or mention you once these controls are connected to the account system.',
    draft: 'Saved on this device only. Tag and mention restrictions are not active until backend support is connected.',
    saveError: 'Could not save the preference on this device.',
    signIn: 'Sign in to manage these settings.',
    missingAccount: 'Your reader account could not be identified. Sign in again.',
  },
  km: {
    title: 'Tags និង Mentions', back: 'ត្រឡប់ទៅការកំណត់',
    intro: 'ជ្រើសរើសអ្នកដែលអាច Tag ឬ Mention អ្នកនៅលើ Shadow។',
    tagTitle: 'តើអ្នកណាអាច Tag អ្នក?', tagHelp: 'ជ្រើសរើសអ្នកដែលអាច Tag អ្នកក្នុង Post។',
    mentionTitle: 'តើអ្នកណាអាច Mention អ្នក?', mentionHelp: 'ជ្រើសរើសអ្នកដែលអាច Mention @username របស់អ្នក។',
    everyone: 'មនុស្សគ្រប់គ្នា', following: 'អ្នកដែលអ្នកបាន Follow', nobody: 'គ្មាននរណាម្នាក់',
    reviewTitle: 'ពិនិត្យ Tag មុនបង្ហាញ', reviewHelp: 'អនុញ្ញាត Tag មុនបង្ហាញលើ Profile ពេលមុខងារ Tagged Posts ត្រូវបានភ្ជាប់។',
    blocked: 'អ្នកដែលអ្នកបាន Block នឹងមិនអាច Tag ឬ Mention អ្នកបានទេ បន្ទាប់ពីភ្ជាប់ការកំណត់នេះទៅប្រព័ន្ធគណនី។',
    draft: 'រក្សាទុកតែលើឧបករណ៍នេះ។ ការទប់ Tag និង Mention មិនទាន់ដំណើរការទេ រហូតដល់ភ្ជាប់ Backend។',
    saveError: 'មិនអាចរក្សាទុកការកំណត់លើឧបករណ៍នេះបានទេ។',
    signIn: 'សូមចូលគណនីដើម្បីគ្រប់គ្រងការកំណត់នេះ។',
    missingAccount: 'មិនអាចសម្គាល់គណនីអ្នកអានបានទេ។ សូមចូលគណនីឡើងវិញ។',
  },
  zh: {
    title: '标签与提及', back: '返回设置',
    intro: '选择谁可以在 Shadow 上标记或提及你。',
    tagTitle: '谁可以标记你？', tagHelp: '选择谁能在帖子中标记你。',
    mentionTitle: '谁可以提及你？', mentionHelp: '选择谁可以提及你的 @用户名。',
    everyone: '所有人', following: '你关注的人', nobody: '没有人',
    reviewTitle: '手动审核标签', reviewHelp: '支持标签帖子后，在标签显示于个人主页前先进行批准。',
    blocked: '接入账户权限系统后，被你屏蔽的人将无法标记或提及你。',
    draft: '仅保存在此设备上。连接后端前，标签与提及限制不会生效。',
    saveError: '无法在此设备上保存设置。',
    signIn: '请先登录以管理这些设置。',
    missingAccount: '无法识别读者账户，请重新登录。',
  },
  ja: {
    title: 'タグとメンション', back: '設定に戻る',
    intro: 'Shadow であなたをタグ付け・メンションできる人を選びます。',
    tagTitle: 'タグ付けできる人', tagHelp: '投稿であなたをタグ付けできる人を選びます。',
    mentionTitle: 'メンションできる人', mentionHelp: '@ユーザー名をメンションできる人を選びます。',
    everyone: 'すべての人', following: 'フォローしている人', nobody: '誰も許可しない',
    reviewTitle: 'タグを手動で承認', reviewHelp: 'タグ付き投稿が対応した際、プロフィール表示前に承認します。',
    blocked: 'アカウント側の制御が接続されると、ブロックした相手はタグ付けやメンションができなくなります。',
    draft: '設定はこの端末にのみ保存されます。バックエンド接続までは制限は有効になりません。',
    saveError: 'この端末に設定を保存できませんでした。',
    signIn: '設定を管理するにはログインしてください。',
    missingAccount: '読者アカウントを確認できません。再度ログインしてください。',
  },
  ko: {
    title: '태그 및 멘션', back: '설정으로 돌아가기',
    intro: 'Shadow에서 나를 태그하거나 멘션할 수 있는 사람을 선택하세요.',
    tagTitle: '나를 태그할 수 있는 사람', tagHelp: '게시물에서 나를 태그할 수 있는 사람을 선택하세요.',
    mentionTitle: '나를 멘션할 수 있는 사람', mentionHelp: '내 @사용자 이름을 멘션할 수 있는 사람을 선택하세요.',
    everyone: '모든 사람', following: '내가 팔로우하는 사람', nobody: '아무도 없음',
    reviewTitle: '태그 직접 검토', reviewHelp: '태그된 게시물이 지원되면 프로필에 표시하기 전에 승인합니다.',
    blocked: '계정 제한 기능을 연결하면 차단된 사용자는 나를 태그하거나 멘션할 수 없습니다.',
    draft: '이 기기에만 저장됩니다. 백엔드 연결 전에는 태그 및 멘션 제한이 적용되지 않습니다.',
    saveError: '이 기기에 설정을 저장할 수 없습니다.',
    signIn: '설정을 관리하려면 로그인하세요.',
    missingAccount: '독자 계정을 확인할 수 없습니다. 다시 로그인하세요.',
  },
})

const DEFAULT_SETTINGS = {
  tags: 'everyone',
  mentions: 'everyone',
  reviewTags: true,
}

const CHOICES = [
  { value: 'everyone', label: 'everyone' },
  { value: 'following', label: 'following' },
  { value: 'nobody', label: 'nobody' },
]

function getReaderId() {
  try {
    const value = localStorage.getItem('shadow_reader_user') || sessionStorage.getItem('shadow_reader_user') || 'null'
    const user = JSON.parse(value)
    return String(user?.id || user?.user_id || user?.reader?.id || '').trim()
  } catch {
    return ''
  }
}

function readPreferences(key) {
  if (!key) return { ...DEFAULT_SETTINGS }
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ...DEFAULT_SETTINGS }
    return {
      tags: CHOICES.some((item) => item.value === parsed.tags) ? parsed.tags : DEFAULT_SETTINGS.tags,
      mentions: CHOICES.some((item) => item.value === parsed.mentions) ? parsed.mentions : DEFAULT_SETTINGS.mentions,
      reviewTags: typeof parsed.reviewTags === 'boolean' ? parsed.reviewTags : DEFAULT_SETTINGS.reviewTags,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

function PreferenceGroup({ title, description, name, value, onChange, disabled, tr, Icon }) {
  return (
    <section className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
          <Icon size={19} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-semibold">{title}</h2>
          <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{description}</p>
        </div>
      </div>
      <div role="radiogroup" aria-label={title} className="space-y-1">
        {CHOICES.map((choice) => (
          <label key={choice.value} className="flex min-h-[46px] cursor-pointer items-center justify-between gap-3 rounded-xl px-3 hover:bg-[var(--shadow-bg-hover)]">
            <span className="text-[13px]">{tr(choice.label)}</span>
            <input
              type="radio"
              name={name}
              value={choice.value}
              checked={value === choice.value}
              onChange={() => onChange(name, choice.value)}
              disabled={disabled}
              className="h-[18px] w-[18px] shrink-0 accent-[#374151] disabled:opacity-50"
            />
          </label>
        ))}
      </div>
    </section>
  )
}

function ReviewSwitch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="shrink-0 rounded-full shadow-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={`relative block h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${checked ? 'bg-[#111827]' : 'bg-[#D1D6DE]'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${checked ? 'left-[26px]' : 'left-1'}`} />
      </span>
    </button>
  )
}

export default function ReaderTagsMentionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`readerTagsMentions.${key}`)
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const backPath = fromMeSettings ? '/profile/settings?from=me-settings' : '/profile/settings'
  const token = localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')
  const accountId = getReaderId()
  const storageKey = accountId ? `shadow_reader_tags_mentions_draft_v1:${accountId}` : ''
  const [preferences, setPreferences] = useState(() => readPreferences(storageKey))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    setPreferences(readPreferences(storageKey))
    setError('')
    const onStorage = (event) => {
      if (event.key === storageKey || event.key === null) setPreferences(readPreferences(storageKey))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  function updatePreference(field, value) {
    if (!storageKey) return
    const next = { ...preferences, [field]: value }
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      setPreferences(next)
      setError('')
    } catch {
      setError(tr('saveError'))
    }
  }

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(28px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate(backPath)} aria-label={tr('back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
          <h1 className="text-[18px] font-semibold">{tr('title')}</h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] space-y-4 px-4 pt-5">
        <p className="px-1 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{tr('intro')}</p>
        <PreferenceGroup title={tr('tagTitle')} description={tr('tagHelp')} name="tags" value={preferences.tags} onChange={updatePreference} disabled={!storageKey} tr={tr} Icon={Tag} />
        <PreferenceGroup title={tr('mentionTitle')} description={tr('mentionHelp')} name="mentions" value={preferences.mentions} onChange={updatePreference} disabled={!storageKey} tr={tr} Icon={AtSign} />
        <section className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <ShieldCheck size={19} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[14px] font-semibold">{tr('reviewTitle')}</h2>
            </div>
            <ReviewSwitch checked={preferences.reviewTags} onChange={() => updatePreference('reviewTags', !preferences.reviewTags)} disabled={!storageKey} label={tr('reviewTitle')} />
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('reviewHelp')}</p>
        </section>
        <p className="px-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('blocked')}</p>
        <p role="status" className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('draft')}</p>
        {!token && <p role="alert" className="px-1 text-[12px]">{tr('signIn')}</p>}
        {token && !accountId && <p role="alert" className="px-1 text-[12px]">{tr('missingAccount')}</p>}
        {error && <p role="alert" className="px-1 text-[12px]">{error}</p>}
      </div>
    </main>
  )
}
