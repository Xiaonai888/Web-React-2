import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerCommentSettings', {
  en: {
    title: 'Comment settings',
    back: 'Back to settings',
    heading: 'Manage comments on your posts',
    description: 'Choose how readers can interact with your Reader posts.',
    audience: 'Who can comment on your posts?',
    audienceHelp: 'Choose who can leave comments when comments are enabled.',
    everyone: 'Everyone',
    followers: 'Followers only',
    following: 'People you follow',
    allow: 'Allow Comments',
    allowHelp: 'Let readers leave new comments on your posts. Existing comments are kept.',
    spam: 'Filter Spam',
    spamHelp: 'Filter suspicious links and spam comments.',
    approval: 'Comment Approval',
    approvalHelp: 'Review comments before they appear publicly.',
    manage: 'Manage Comments',
    manageHelp: 'Open your profile to review comments on each post.',
    deviceOnly: 'Settings are saved to your account. Comment restrictions will take effect after the comment system is connected.',
    saved: 'Saved to your account.',
    loading: 'Loading comment settings...',
    saving: 'Saving...',
    loadError: 'Could not load comment settings. Please try again.',
    saveError: 'Could not save comment settings. Please try again.',
    retry: 'Try again',
    accountError: 'Please sign in again to save your settings.',
  },
  km: {
    title: 'ការកំណត់មតិយោបល់',
    back: 'ត្រឡប់ទៅការកំណត់',
    heading: 'គ្រប់គ្រងមតិយោបល់លើ Posts របស់អ្នក',
    description: 'ជ្រើសរើសរបៀបដែលអ្នកអានអាច Comment លើ Reader posts របស់អ្នក។',
    audience: 'អ្នកណាអាច Comment លើ Posts របស់អ្នក?',
    audienceHelp: 'ជ្រើសរើសអ្នកដែលអាច Comment នៅពេលអ្នកបើកមតិយោបល់។',
    everyone: 'គ្រប់គ្នា',
    followers: 'អ្នកដែល Follow អ្នក',
    following: 'អ្នកដែលអ្នកបាន Follow',
    allow: 'អនុញ្ញាតឱ្យ Comment',
    allowHelp: 'អនុញ្ញាតឱ្យអ្នកអានសរសេរ Comment ថ្មី។ Comment ចាស់នៅរក្សាទុកដដែល។',
    spam: 'តម្រង Spam',
    spamHelp: 'ត្រង Link សង្ស័យ និង Comment Spam។',
    approval: 'អនុម័ត Comment',
    approvalHelp: 'ពិនិត្យ Comment មុនពេលបង្ហាញជាសាធារណៈ។',
    manage: 'គ្រប់គ្រង Comment',
    manageHelp: 'បើក Profile របស់អ្នកដើម្បីពិនិត្យ Comment លើ Post នីមួយៗ។',
    deviceOnly: 'ការកំណត់រក្សាទុកក្នុងគណនីរបស់អ្នក។ ការកំណត់សិទ្ធិ Comment នឹងមានប្រសិទ្ធភាពក្រោយពេលភ្ជាប់ប្រព័ន្ធ Comment។',
    saved: 'បានរក្សាទុកក្នុងគណនីរបស់អ្នក។',
    loading: 'កំពុងផ្ទុកការកំណត់ Comment...',
    saving: 'កំពុងរក្សាទុក...',
    loadError: 'មិនអាចផ្ទុកការកំណត់ Comment បានទេ។ សូមព្យាយាមម្ដងទៀត។',
    saveError: 'មិនអាចរក្សាទុកការកំណត់ Comment បានទេ។ សូមព្យាយាមម្ដងទៀត។',
    retry: 'ព្យាយាមម្ដងទៀត',
    accountError: 'សូមចូលគណនីឡើងវិញដើម្បីរក្សាទុកការកំណត់។',
  },
  zh: {
    title: '评论设置',
    back: '返回设置',
    heading: '管理帖子评论',
    description: '选择其他读者如何与你的帖子互动。',
    audience: '谁可以评论你的帖子？',
    audienceHelp: '开启评论后，选择可以评论的用户。',
    everyone: '所有人',
    followers: '仅关注你的人',
    following: '你关注的人',
    allow: '允许评论',
    allowHelp: '允许新评论，已有评论不会被删除。',
    spam: '过滤垃圾评论',
    spamHelp: '过滤可疑链接和垃圾评论。',
    approval: '评论审核',
    approvalHelp: '评论公开显示前需要你的审核。',
    manage: '管理评论',
    manageHelp: '打开个人主页，查看每篇帖子的评论。',
    deviceOnly: '设置已关联你的账号。评论系统完成连接后，评论限制才会生效。',
    saved: '已保存至你的账号。',
    loading: '正在加载评论设置...',
    saving: '正在保存...',
    loadError: '无法加载评论设置，请重试。',
    saveError: '无法保存评论设置，请重试。',
    retry: '重试',
    accountError: '请重新登录以保存设置。',
  },
  ja: {
    title: 'コメント設定',
    back: '設定に戻る',
    heading: '投稿へのコメントを管理',
    description: '読者があなたの投稿にコメントできる条件を設定します。',
    audience: '誰がコメントできますか？',
    audienceHelp: 'コメントを許可した場合の対象を選択します。',
    everyone: 'すべての人',
    followers: 'フォロワーのみ',
    following: '自分がフォロー中の人',
    allow: 'コメントを許可',
    allowHelp: '新しいコメントを許可します。既存のコメントは残ります。',
    spam: 'スパムをフィルター',
    spamHelp: '不審なリンクやスパムコメントを検出します。',
    approval: 'コメントの承認',
    approvalHelp: '公開前にコメントを確認します。',
    manage: 'コメントを管理',
    manageHelp: 'プロフィールから投稿ごとのコメントを確認します。',
    deviceOnly: '設定はアカウントに保存されます。コメント機能との連携後に制限が有効になります。',
    saved: 'アカウントに保存しました。',
    loading: 'コメント設定を読み込み中...',
    saving: '保存中...',
    loadError: 'コメント設定を読み込めませんでした。再試行してください。',
    saveError: 'コメント設定を保存できませんでした。再試行してください。',
    retry: '再試行',
    accountError: '再度ログインして設定を保存してください。',
  },
  ko: {
    title: '댓글 설정',
    back: '설정으로 돌아가기',
    heading: '내 게시물의 댓글 관리',
    description: '독자가 내 게시물에 댓글을 남기는 방식을 설정하세요.',
    audience: '누가 댓글을 달 수 있나요?',
    audienceHelp: '댓글을 허용했을 때 댓글을 남길 수 있는 사람을 선택하세요.',
    everyone: '모든 사람',
    followers: '내 팔로워만',
    following: '내가 팔로우하는 사람',
    allow: '댓글 허용',
    allowHelp: '새 댓글을 허용합니다. 기존 댓글은 유지됩니다.',
    spam: '스팸 필터',
    spamHelp: '의심스러운 링크와 스팸 댓글을 필터링합니다.',
    approval: '댓글 승인',
    approvalHelp: '댓글이 공개되기 전에 검토합니다.',
    manage: '댓글 관리',
    manageHelp: '프로필에서 각 게시물의 댓글을 확인하세요.',
    deviceOnly: '설정이 계정에 저장됩니다. 댓글 시스템 연결 후 댓글 제한이 적용됩니다.',
    saved: '계정에 저장되었습니다.',
    loading: '댓글 설정 불러오는 중...',
    saving: '저장 중...',
    loadError: '댓글 설정을 불러오지 못했습니다. 다시 시도해 주세요.',
    saveError: '댓글 설정을 저장하지 못했습니다. 다시 시도해 주세요.',
    retry: '다시 시도',
    accountError: '설정을 저장하려면 다시 로그인해 주세요.',
  },
})

const DEFAULT_SETTINGS = {
  audience: 'everyone',
  allowComments: true,
  filterSpam: true,
  commentApproval: false,
}

const AUDIENCES = ['everyone', 'followers', 'following']

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SETTINGS_URL = `${API_BASE_URL}/api/users/me/comment-settings`

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function normalizeSettings(saved) {
  return {
    audience: AUDIENCES.includes(saved?.audience) ? saved.audience : DEFAULT_SETTINGS.audience,
    allowComments: typeof saved?.allowComments === 'boolean' ? saved.allowComments : DEFAULT_SETTINGS.allowComments,
    filterSpam: typeof saved?.filterSpam === 'boolean' ? saved.filterSpam : DEFAULT_SETTINGS.filterSpam,
    commentApproval: typeof saved?.commentApproval === 'boolean' ? saved.commentApproval : DEFAULT_SETTINGS.commentApproval,
  }
}

function CommentSwitch({ checked, disabled, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className="shrink-0 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={`relative block h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${
        checked ? 'bg-[#111827]' : 'bg-[#D1D6DE]'
      }`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${
          checked ? 'left-[26px]' : 'left-1'
        }`} />
      </span>
    </button>
  )
}

function SettingSwitchRow({ title, description, checked, disabled, onChange }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-medium text-[var(--shadow-text-primary)]">{title}</h3>
        <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{description}</p>
      </div>
      <CommentSwitch checked={checked} disabled={disabled} label={title} onChange={onChange} />
    </div>
  )
}

export default function ReaderCommentSettingsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const tr = (key) => t(`readerCommentSettings.${key}`)
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const backPath = fromMeSettings ? '/profile/settings?from=me-settings' : '/profile/settings'
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS }))
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [ready, setReady] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const controller = new AbortController()
    setReady(false)
    setLoading(true)
    setError('')
    setFeedback('')

    const load = async () => {
      try {
        const response = await fetch(SETTINGS_URL, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: 'no-store',
        })
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || !data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) {
          throw new Error('loadError')
        }
        if (!controller.signal.aborted) {
          setSettings(normalizeSettings(data.settings))
          setReady(true)
        }
      } catch {
        if (!controller.signal.aborted) setError('loadError')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [navigate, reloadKey])

  async function updateSettings(key, value) {
    if (!ready || loading || saving) return
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    const next = { ...settings, [key]: value }
    setSaving(true)
    setFeedback('')
    setError('')

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
      if (!response.ok || data.ok !== true || !data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) {
        throw new Error('saveError')
      }
      setSettings(normalizeSettings(data.settings))
      setFeedback(tr('saved'))
    } catch {
      setError('saveError')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(32px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            aria-label={tr('back')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
          <h1 className="text-[18px] font-semibold">{tr('title')}</h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] space-y-4 px-4 pt-5">
        <section className="px-1">
          <h2 className="text-[17px] font-semibold">{tr('heading')}</h2>
          <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{tr('description')}</p>
        </section>

        <section className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 shadow-none">
          <div className="py-5">
            <h3 className="text-[14px] font-medium">{tr('audience')}</h3>
            <p className="mt-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('audienceHelp')}</p>
            <div role="radiogroup" aria-label={tr('audience')} className="mt-4 space-y-4">
              {AUDIENCES.map((choice) => (
                <label key={choice} className={`flex items-center gap-3 text-[13px] ${!settings.allowComments ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <input
                    type="radio"
                    name="reader-comment-audience"
                    value={choice}
                    checked={settings.audience === choice}
                    disabled={!settings.allowComments || !ready || loading || saving}
                    onChange={() => updateSettings('audience', choice)}
                    className="h-[18px] w-[18px] shrink-0 accent-[#111827]"
                  />
                  <span>{tr(choice)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--shadow-border)]">
            <SettingSwitchRow
              title={tr('allow')}
              description={tr('allowHelp')}
              checked={settings.allowComments}
              disabled={!ready || loading || saving}
              onChange={() => updateSettings('allowComments', !settings.allowComments)}
            />
          </div>
          <div className="border-t border-[var(--shadow-border)]">
            <SettingSwitchRow
              title={tr('spam')}
              description={tr('spamHelp')}
              checked={settings.filterSpam}
              disabled={!ready || loading || saving}
              onChange={() => updateSettings('filterSpam', !settings.filterSpam)}
            />
          </div>
          <div className="border-t border-[var(--shadow-border)]">
            <SettingSwitchRow
              title={tr('approval')}
              description={tr('approvalHelp')}
              checked={settings.commentApproval}
              disabled={!ready || loading || saving}
              onChange={() => updateSettings('commentApproval', !settings.commentApproval)}
            />
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)]">
            <MessageCircle size={20} strokeWidth={1.7} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-medium">{tr('manage')}</span>
            <span className="mt-1 block text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('manageHelp')}</span>
          </span>
          <ChevronRight size={17} strokeWidth={1.8} className="shrink-0 text-[var(--shadow-text-secondary)]" />
        </button>

        <p className="px-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{tr('deviceOnly')}</p>
        {loading ? <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('loading')}</p> : null}
        {saving ? <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{tr('saving')}</p> : null}
        {feedback ? <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{feedback}</p> : null}
        {error ? (
          <div role="alert" className="px-1 text-[12px] text-red-500">
            <p>{tr(error)}</p>
            {error === 'loadError' && !loading ? (
              <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-2 font-semibold underline">{tr('retry')}</button>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  )
}
