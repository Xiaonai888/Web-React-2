import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import ReaderAccountPrivacyConfirmModal from '../../components/reader-profile/ReaderAccountPrivacyConfirmModal'

registerTranslationNamespace('readerAccountPrivacy', {
  en: {
    title: 'Account Privacy',
    back: 'Back to Settings',
    heading: 'Choose who can see your posts',
    description: "Keep your Reader Posts visible to everyone or limit them to readers who follow you.",
    privateAccount: 'Private account',
    privateHelp: "When this is on, only you and readers who follow you can see your Reader Posts. People who don't follow you cannot view them, even with a shared link.",
    note: 'Your name and profile photo remain visible. When this is off, each post follows its own visibility setting.',
    loading: 'Loading privacy settings...',
    saving: 'Saving...',
    saved: 'Privacy setting updated.',
    loadError: 'Could not load your privacy settings.',
    saveError: 'Could not save your privacy setting.',
    retry: 'Try again',
  },
  km: {
    title: 'ឯកជនភាពគណនី',
    back: 'ត្រឡប់ទៅការកំណត់',
    heading: 'ជ្រើសរើសអ្នកដែលអាចមើល Post របស់អ្នក',
    description: 'កំណត់ថា Reader Posts របស់អ្នកអាចមើលឃើញជាសាធារណៈ ឬសម្រាប់តែអ្នកដែលបាន Follow អ្នក។',
    privateAccount: 'គណនីឯកជន',
    privateHelp: 'ពេលបើក មានតែអ្នកផ្ទាល់ និងអ្នកអានដែលបាន Follow អ្នកប៉ុណ្ណោះអាចមើល Reader Posts របស់អ្នកបាន។ អ្នកដែលមិនបាន Follow មិនអាចមើលបានទេ ទោះមាន Link ចែករំលែកក៏ដោយ។',
    note: 'ឈ្មោះ និងរូបប្រវត្តិរូបរបស់អ្នកនៅតែអាចមើលឃើញ។ ពេលបិទ ការមើល Post នីមួយៗនឹងអនុវត្តតាមការកំណត់ Visibility ដើមរបស់វា។',
    loading: 'កំពុងផ្ទុកការកំណត់ឯកជនភាព...',
    saving: 'កំពុងរក្សាទុក...',
    saved: 'បានរក្សាទុកការកំណត់ឯកជនភាព។',
    loadError: 'មិនអាចផ្ទុកការកំណត់ឯកជនភាពបានទេ។',
    saveError: 'មិនអាចរក្សាទុកការកំណត់ឯកជនភាពបានទេ។',
    retry: 'ព្យាយាមម្តងទៀត',
  },
  zh: {
    title: '账户隐私',
    back: '返回设置',
    heading: '选择谁可以查看你的帖子',
    description: '让所有人查看你的读者帖子，或仅允许关注你的读者查看。',
    privateAccount: '私人账户',
    privateHelp: '开启后，只有你自己和关注你的读者可以查看你的读者帖子。未关注你的人即使有分享链接也无法查看。',
    note: '你的姓名和头像仍然可见。关闭后，每篇帖子将恢复使用其各自的可见性设置。',
    loading: '正在加载隐私设置...',
    saving: '正在保存...',
    saved: '隐私设置已更新。',
    loadError: '无法加载隐私设置。',
    saveError: '无法保存隐私设置。',
    retry: '重试',
  },
  ja: {
    title: 'アカウントのプライバシー',
    back: '設定に戻る',
    heading: '投稿を閲覧できる人を選択',
    description: 'リーダー投稿を全員に公開するか、フォロワーのみに公開するかを設定します。',
    privateAccount: '非公開アカウント',
    privateHelp: 'オンにすると、あなたとフォロワーだけがリーダー投稿を閲覧できます。フォローしていない人は、共有リンクがあっても閲覧できません。',
    note: '名前とプロフィール写真は引き続き公開されます。オフにすると、各投稿の公開範囲設定が適用されます。',
    loading: 'プライバシー設定を読み込み中...',
    saving: '保存中...',
    saved: 'プライバシー設定を更新しました。',
    loadError: 'プライバシー設定を読み込めませんでした。',
    saveError: 'プライバシー設定を保存できませんでした。',
    retry: '再試行',
  },
  ko: {
    title: '계정 공개 범위',
    back: '설정으로 돌아가기',
    heading: '게시물을 볼 수 있는 사람 선택',
    description: '독자 게시물을 모두에게 공개하거나 팔로워에게만 공개할 수 있습니다.',
    privateAccount: '비공개 계정',
    privateHelp: '켜면 본인과 팔로워만 독자 게시물을 볼 수 있습니다. 팔로우하지 않는 사람은 공유 링크가 있어도 볼 수 없습니다.',
    note: '이름과 프로필 사진은 계속 공개됩니다. 끄면 각 게시물의 공개 범위 설정이 적용됩니다.',
    loading: '공개 범위 설정을 불러오는 중...',
    saving: '저장 중...',
    saved: '공개 범위 설정이 업데이트되었습니다.',
    loadError: '공개 범위 설정을 불러오지 못했습니다.',
    saveError: '공개 범위 설정을 저장하지 못했습니다.',
    retry: '다시 시도',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') || ''
}

function PrivacySwitch({ checked, disabled, label, onChange }) {
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
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-none transition-all duration-300 ${checked ? 'left-[26px]' : 'left-1'}`} />
      </span>
    </button>
  )
}

export default function ReaderAccountPrivacyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const fromMeSettings = new URLSearchParams(location.search).get('from') === 'me-settings'
  const settingsPath = fromMeSettings ? '/profile/settings?from=me-settings' : '/profile/settings'
  const [privateAccount, setPrivateAccount] = useState(false)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      const token = getReaderToken()
      if (!token) {
        navigate('/login', { replace: true })
        return
      }
      setLoading(true)
      setReady(false)
      setError('')
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me/privacy`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok !== true || typeof data.private !== 'boolean') {
          throw new Error(t('readerAccountPrivacy.loadError'))
        }
        if (!controller.signal.aborted) {
          setPrivateAccount(data.private)
          setReady(true)
        }
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason.message || t('readerAccountPrivacy.loadError'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [reloadKey, navigate, t])

  function openPrivateAccountConfirm() {
    if (!ready || loading || saving) return
    setError('')
    setMessage('')
    setConfirmOpen(true)
  }

  function cancelPrivateAccountConfirm() {
    if (saving) return
    setConfirmOpen(false)
    setError('')
  }

  async function updatePrivateAccount() {
    if (!confirmOpen || !ready || loading || saving) return
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me/privacy`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ private: !privateAccount }),
      })
      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || typeof data.private !== 'boolean') {
        throw new Error(t('readerAccountPrivacy.saveError'))
      }
      setPrivateAccount(data.private)
      setConfirmOpen(false)
      setMessage(t('readerAccountPrivacy.saved'))
    } catch (reason) {
      setError(reason.message || t('readerAccountPrivacy.saveError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-10 text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 w-full max-w-[560px] items-center justify-between px-4">
          <button type="button" onClick={() => navigate(settingsPath)} aria-label={t('readerAccountPrivacy.back')} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <i className="fa-solid fa-chevron-left text-[16px]" aria-hidden="true" />
          </button>
          <h1 className="text-[16px] font-semibold">{t('readerAccountPrivacy.title')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] space-y-4 px-4 pt-5">
        <section className="space-y-2 px-1">
          <h2 className="text-[17px] font-semibold">{t('readerAccountPrivacy.heading')}</h2>
          <p className="text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{t('readerAccountPrivacy.description')}</p>
        </section>

        <section className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-none">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f0eaff] text-[#7040d8] shadow-none">
              <i className="fa-solid fa-lock text-[17px]" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[14px] font-semibold">{t('readerAccountPrivacy.privateAccount')}</h3>
            </div>
            <PrivacySwitch
              checked={privateAccount}
              disabled={!ready || loading || saving}
              onChange={openPrivateAccountConfirm}
              label={t('readerAccountPrivacy.privateAccount')}
            />
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerAccountPrivacy.privateHelp')}</p>
        </section>

        <p className="px-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">{t('readerAccountPrivacy.note')}</p>

        {loading && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{t('readerAccountPrivacy.loading')}</p>}
        {saving && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{t('readerAccountPrivacy.saving')}</p>}
        {message && <p role="status" className="px-1 text-[12px] text-[var(--shadow-text-secondary)]">{message}</p>}
        {error && !confirmOpen && (
          <div role="alert" className="rounded-xl border border-[var(--shadow-border)] px-3 py-3 text-[12px]">
            <p>{error}</p>
            {!ready && !loading && (
              <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-2 font-semibold underline">
                {t('readerAccountPrivacy.retry')}
              </button>
            )}
          </div>
        )}
      </div>

      <ReaderAccountPrivacyConfirmModal
        open={confirmOpen}
        enablePrivate={!privateAccount}
        onConfirm={updatePrivateAccount}
        onCancel={cancelPrivateAccountConfirm}
        busy={saving}
        error={error}
        t={t}
      />
    </main>
  )
}
