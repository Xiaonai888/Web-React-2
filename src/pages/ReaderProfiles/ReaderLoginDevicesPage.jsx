import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerLoginDevicesPage', {
  en: {
    title: 'Login devices',
    subtitle: 'Manage up to 5 active sessions',
    back: 'Back to account security',
    loading: 'Loading devices...',
    loadFailed: 'Unable to load login devices.',
    empty: 'No active login devices.',
    activeSessions: '{{count}} of {{max}} active sessions',
    current: 'This device',
    lastSeen: 'Last seen',
    loggedIn: 'Logged in',
    expires: 'Expires',
    logout: 'Log out',
    loggingOut: 'Logging out...',
    confirm: 'Log out this device?',
    logoutFailed: 'Unable to log out this device.',
    managedRequired: 'Please sign in again to manage login devices.',
    unknown: 'Unknown device',
  },
  km: {
    title: 'ឧបករណ៍ដែលបានចូលគណនី',
    subtitle: 'គ្រប់គ្រងបានអតិបរមា 5 Session',
    back: 'ត្រឡប់ទៅគណនី និងសុវត្ថិភាព',
    loading: 'កំពុងផ្ទុកឧបករណ៍...',
    loadFailed: 'មិនអាចផ្ទុកឧបករណ៍ចូលគណនីបានទេ។',
    empty: 'មិនមាន Session កំពុងដំណើរការ។',
    activeSessions: '{{count}} ក្នុងចំណោម {{max}} Session កំពុងដំណើរការ',
    current: 'ឧបករណ៍នេះ',
    lastSeen: 'បានប្រើចុងក្រោយ',
    loggedIn: 'បានចូលគណនី',
    expires: 'ផុតកំណត់',
    logout: 'ចាកចេញ',
    loggingOut: 'កំពុងចាកចេញ...',
    confirm: 'ចាកចេញពីឧបករណ៍នេះមែនទេ?',
    logoutFailed: 'មិនអាចចាកចេញពីឧបករណ៍នេះបានទេ។',
    managedRequired: 'សូមចូលគណនីឡើងវិញ ដើម្បីគ្រប់គ្រងឧបករណ៍។',
    unknown: 'ឧបករណ៍មិនស្គាល់',
  },
  zh: {
    title: '登录设备',
    subtitle: '最多管理 5 个活跃会话',
    back: '返回账户与安全',
    loading: '正在加载设备...',
    loadFailed: '无法加载登录设备。',
    empty: '没有活跃登录设备。',
    activeSessions: '{{count}} / {{max}} 个活跃会话',
    current: '此设备',
    lastSeen: '最近使用',
    loggedIn: '登录时间',
    expires: '到期时间',
    logout: '退出登录',
    loggingOut: '正在退出...',
    confirm: '要退出此设备吗？',
    logoutFailed: '无法退出此设备。',
    managedRequired: '请重新登录以管理登录设备。',
    unknown: '未知设备',
  },
  ja: {
    title: 'ログイン端末',
    subtitle: '最大5件のアクティブセッションを管理',
    back: 'アカウントとセキュリティに戻る',
    loading: '端末を読み込み中...',
    loadFailed: 'ログイン端末を読み込めませんでした。',
    empty: 'アクティブなログイン端末はありません。',
    activeSessions: '{{count}} / {{max}} セッション',
    current: 'この端末',
    lastSeen: '最終利用',
    loggedIn: 'ログイン',
    expires: '有効期限',
    logout: 'ログアウト',
    loggingOut: 'ログアウト中...',
    confirm: 'この端末からログアウトしますか？',
    logoutFailed: 'この端末からログアウトできませんでした。',
    managedRequired: 'ログイン端末を管理するには再度ログインしてください。',
    unknown: '不明な端末',
  },
  ko: {
    title: '로그인 기기',
    subtitle: '최대 5개의 활성 세션 관리',
    back: '계정 및 보안으로 돌아가기',
    loading: '기기를 불러오는 중...',
    loadFailed: '로그인 기기를 불러오지 못했습니다.',
    empty: '활성 로그인 기기가 없습니다.',
    activeSessions: '{{count}} / {{max}} 활성 세션',
    current: '현재 기기',
    lastSeen: '마지막 사용',
    loggedIn: '로그인',
    expires: '만료',
    logout: '로그아웃',
    loggingOut: '로그아웃 중...',
    confirm: '이 기기에서 로그아웃할까요?',
    logoutFailed: '이 기기에서 로그아웃하지 못했습니다.',
    managedRequired: '로그인 기기를 관리하려면 다시 로그인해 주세요.',
    unknown: '알 수 없는 기기',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function clearSession() {
  localStorage.removeItem('shadow_reader_token')
  localStorage.removeItem('shadow_reader_user')
  sessionStorage.removeItem('shadow_reader_token')
  sessionStorage.removeItem('shadow_reader_user')
}

function formatTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

export default function ReaderLoginDevicesPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [sessions, setSessions] = useState([])
  const [maxSessions, setMaxSessions] = useState(5)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [message, setMessage] = useState('')

  const loadDevices = useCallback(async () => {
    const token = getToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setLoading(true)
      setMessage('')
      const response = await fetch(`${API_BASE_URL}/api/users/devices`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        if (data.code === 'READER_MANAGED_SESSION_REQUIRED') {
          throw new Error(t('readerLoginDevicesPage.managedRequired'))
        }
        throw new Error(data.message || t('readerLoginDevicesPage.loadFailed'))
      }
      setSessions(Array.isArray(data.sessions) ? data.sessions : [])
      setMaxSessions(Number(data.max_sessions) || 5)
    } catch (error) {
      setMessage(error.message || t('readerLoginDevicesPage.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [navigate, t])

  useEffect(() => {
    loadDevices()
  }, [loadDevices])

  async function handleLogout(device) {
    if (!window.confirm(t('readerLoginDevicesPage.confirm'))) return

    const token = getToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setBusyId(device.device_id)
      setMessage('')
      const response = await fetch(`${API_BASE_URL}/api/users/devices/${device.device_id}/revoke`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('readerLoginDevicesPage.logoutFailed'))
      }

      if (data.current_session_revoked) {
        clearSession()
        navigate('/login', { replace: true })
        return
      }

      await loadDevices()
    } catch (error) {
      setMessage(error.message || t('readerLoginDevicesPage.logoutFailed'))
    } finally {
      setBusyId('')
    }
  }

  return (
    <main className="app-page min-h-screen pb-10 text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate('/profile/settings/account-security')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:bg-[var(--shadow-bg-hover)]"
            aria-label={t('readerLoginDevicesPage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>
          <div>
            <h1 className="text-[18px] font-extrabold">{t('readerLoginDevicesPage.title')}</h1>
            <p className="text-[11px] text-[var(--shadow-text-secondary)]">
              {t('readerLoginDevicesPage.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 py-5">
        <div className="mb-4 rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
          <p className="text-[13px] font-bold">
            {t('readerLoginDevicesPage.activeSessions', {
              count: sessions.length,
              max: maxSessions,
            })}
          </p>
        </div>

        {message ? (
          <div className="mb-4 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-6 text-[13px] text-[var(--shadow-text-secondary)]">
            {t('readerLoginDevicesPage.loading')}
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-6 text-[13px] text-[var(--shadow-text-secondary)]">
            {t('readerLoginDevicesPage.empty')}
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((device) => (
              <section
                key={device.id}
                className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#7c3aed] dark:text-[#a78bfa]">
                    <i className="fa-solid fa-laptop text-[17px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-[14px] font-bold">
                        {device.device_label || t('readerLoginDevicesPage.unknown')}
                      </h2>
                      {device.is_current ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                          {t('readerLoginDevicesPage.current')}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--shadow-text-secondary)]">
                      {[device.browser_name, device.os_name].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-[11px] text-[var(--shadow-text-secondary)]">
                  <p>{t('readerLoginDevicesPage.lastSeen')}: {formatTime(device.last_seen_at)}</p>
                  <p>{t('readerLoginDevicesPage.loggedIn')}: {formatTime(device.created_at)}</p>
                  <p>{t('readerLoginDevicesPage.expires')}: {formatTime(device.expires_at)}</p>
                </div>

                <button
                  type="button"
                  disabled={busyId === device.device_id}
                  onClick={() => handleLogout(device)}
                  className="mt-4 h-11 w-full rounded-[12px] border border-red-200 bg-red-50 text-[12px] font-bold text-red-700 transition active:opacity-80 disabled:opacity-50 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300"
                >
                  {busyId === device.device_id
                    ? t('readerLoginDevicesPage.loggingOut')
                    : t('readerLoginDevicesPage.logout')}
                </button>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
