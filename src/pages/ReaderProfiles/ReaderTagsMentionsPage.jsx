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
    draft: 'Preferences are stored in your Shadow account. Tag, mention, and tag-review restrictions are not enforced in posts yet.',
    saveError: 'Could not save your settings. Please try again.',
    loading: 'Loading settings...', saving: 'Saving...', saved: 'Saved to your account.',
    loadError: 'Could not load settings.', retry: 'Try again',
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
    draft: 'ការកំណត់ត្រូវបានរក្សាទុកក្នុងគណនី Shadow។ ការទប់ Tag, Mention និងការអនុម័ត Tag ក្នុង Post មិនទាន់ដំណើរការពិតប្រាកដទេ។',
    saveError: 'មិនអាចរក្សាទុកការកំណត់បានទេ។ សូមព្យាយាមម្ដងទៀត។',
    loading: 'កំពុងផ្ទុកការកំណត់...', saving: 'កំពុងរក្សាទុក...', saved: 'បានរក្សាទុកក្នុងគណនីរបស់អ្នក។',
    loadError: 'មិនអាចផ្ទុកការកំណត់បានទេ។', retry: 'ព្យាយាមម្ដងទៀត',
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
    draft: '设置已保存到你的 Shadow 账号。帖子中的标签、提及及标签审核限制尚未生效。',
    saveError: '无法保存设置，请重试。',
    loading: '正在加载设置...', saving: '正在保存...', saved: '已保存到你的账号。',
    loadError: '无法加载设置。', retry: '重试',
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
    draft: '設定は Shadow アカウントに保存されます。投稿内のタグ・メンション制限とタグ承認はまだ適用されません。',
    saveError: '設定を保存できませんでした。再試行してください。',
    loading: '設定を読み込み中...', saving: '保存中...', saved: 'アカウントに保存しました。',
    loadError: '設定を読み込めませんでした。', retry: '再試行',
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
    draft: '설정은 Shadow 계정에 저장됩니다. 게시물의 태그·멘션 제한 및 태그 승인은 아직 적용되지 않습니다.',
    saveError: '설정을 저장하지 못했습니다. 다시 시도하세요.',
    loading: '설정을 불러오는 중...', saving: '저장 중...', saved: '계정에 저장했습니다.',
    loadError: '설정을 불러오지 못했습니다.', retry: '다시 시도',
    signIn: '설정을 관리하려면 로그인하세요.',
    missingAccount: '독자 계정을 확인할 수 없습니다. 다시 로그인하세요.',
  },
})

registerTranslationNamespace('readerTagReviewButton', {
  en: { label: 'Review pending tags' },
  km: { label: 'ពិនិត្យ Tags ដែលរង់ចាំ' },
  zh: { label: '审核待处理标签' },
  ja: { label: '承認待ちのタグを確認' },
  ko: { label: '대기 중인 태그 검토' },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const API_URL = `${API_BASE_URL}/api/users/me/tags-mentions`

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

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function isValidSettings(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    CHOICES.some((choice) => choice.value === value.tags) &&
    CHOICES.some((choice) => choice.value === value.mentions) &&
    typeof value.reviewTags === 'boolean'
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
      className="shrink-0 rounded-full shadow-none disabled:cursor-not-allowed"
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
  const token = getReaderToken()
  const [preferences, setPreferences] = useState(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!token) navigate('/login', { replace: true })
  }, [token, navigate])

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    async function loadSettings() {
      setLoading(true)
      setReady(false)
      setError('')
      setMessage('')
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.status === 401) {
          if (!controller.signal.aborted) navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !isValidSettings(data.settings)) {
          throw new Error('LOAD_FAILED')
        }
        if (!controller.signal.aborted) {
          setPreferences(data.settings)
          setReady(true)
        }
      } catch {
        if (!controller.signal.aborted) setError(t('readerTagsMentions.loadError'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadSettings()
    return () => controller.abort()
  }, [token, reloadKey, navigate, t])

  async function updatePreference(field, value) {
    if (!token || !ready || loading || saving || preferences[field] === value) return
    const previous = preferences
    const next = { ...previous, [field]: value }
    setPreferences(next)
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(next),
      })
      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !isValidSettings(data.settings)) {
        throw new Error('SAVE_FAILED')
      }
      setPreferences(data.settings)
      setMessage(tr('saved'))
    } catch {
      setPreferences(previous)
      setError(tr('saveError'))
    } finally {
      setSaving(false)
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
        <PreferenceGroup title={tr('tagTitle')} description={tr('tagHelp')} name="tags" value={preferences.tags} onChange={updatePreference} disabled={!ready || loading || saving} tr={tr} Icon={Tag} />
        <PreferenceGroup title={tr('mentionTitle')} description={tr('mentionHelp')} name="mentions" value={preferences.mentions} onChange={updatePreference} disabled={!ready || loading || saving} tr={tr} Icon={AtSign} />
        <section className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
              <ShieldCheck size={19} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[14px] font-semibold">{tr('reviewTitle')}</h2>
            </div>
            <ReviewSwitch checked={preferences.reviewTags} onChange={() => updatePreference('reviewTags', !preferences.reviewTags)} disabled={!ready || loading || saving} label={tr('reviewTitle')} />
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('reviewHelp')}</p>
               </section>
        <button
          type="button"
          onClick={() => navigate(`/profile/settings/tags-mentions/pending${fromMeSettings ? '?from=me-settings' : ''}`)}
          className="flex min-h-[52px] w-full items-center justify-between rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-left text-[14px] font-medium active:bg-[var(--shadow-bg-hover)]"
        >
          <span>{t('readerTagReviewButton.label')}</span>
          <span aria-hidden="true">›</span>
        </button>
        <p className="px-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('blocked')}</p>
        <p role="status" className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('draft')}</p>
        {loading && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('loading')}</p>}
        {saving && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('saving')}</p>}
        {message && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{message}</p>}
        {!token && <p role="alert" className="px-1 text-[12px]">{tr('signIn')}</p>}
        {error && (
          <div role="alert" className="rounded-xl border border-[var(--shadow-border)] px-4 py-3 text-[12px]">
            <p>{error}</p>
            {!ready && !loading && (
              <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-2 font-semibold underline">{tr('retry')}</button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
