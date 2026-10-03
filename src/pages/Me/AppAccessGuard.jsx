import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('appAccessGuard', {
  en: {
    unavailable: 'App unavailable',
    unavailableBody: 'This app has been disabled by the administrator. Your locally saved projects have not been deleted.',
    offline: 'Cannot check app access',
    offlineBody: 'Connect to the internet to check the latest app settings. Your locally saved projects remain on this device.',
    checking: 'Checking app access…',
    checkingBody: 'Please wait a moment.',
    offlineStatus: 'Offline: using the last known app status. Admin changes will apply after reconnecting.',
    retry: 'Retry',
    back: 'Back to Apps',
  },
  km: {
    unavailable: 'កម្មវិធីមិនអាចប្រើបាន',
    unavailableBody: 'កម្មវិធីនេះត្រូវបាន Admin បិទ។ ការងារដែលបានរក្សាទុក Local របស់អ្នកមិនត្រូវបានលុបទេ។',
    offline: 'មិនអាចពិនិត្យសិទ្ធិចូល App បាន',
    offlineBody: 'សូមភ្ជាប់អ៊ីនធឺណិត ដើម្បីពិនិត្យការកំណត់ App ចុងក្រោយ។ ការងារ Local របស់អ្នកនៅតែរក្សាទុកលើឧបករណ៍នេះ។',
    checking: 'កំពុងពិនិត្យ App…',
    checkingBody: 'សូមរង់ចាំបន្តិច។',
    offlineStatus: 'Offline: កំពុងប្រើស្ថានភាព App ចុងក្រោយដែលបានរក្សាទុក។ ការកែពី Admin នឹងអនុវត្តក្រោយភ្ជាប់អ៊ីនធឺណិតវិញ។',
    retry: 'ព្យាយាមម្ដងទៀត',
    back: 'ត្រឡប់ទៅ Apps',
  },
  zh: {
    unavailable: '应用不可用',
    unavailableBody: '此应用已被管理员停用。您保存在本机的项目不会被删除。',
    offline: '无法检查应用访问权限',
    offlineBody: '请连接网络以检查最新应用设置。您的本地项目仍保存在此设备上。',
    checking: '正在检查应用访问权限…',
    checkingBody: '请稍候。',
    offlineStatus: '离线：正在使用上次保存的应用状态。重新联网后会应用管理员的最新设置。',
    retry: '重试',
    back: '返回应用',
  },
  ja: {
    unavailable: 'アプリは利用できません',
    unavailableBody: 'このアプリは管理者によって無効化されています。端末に保存されたプロジェクトは削除されません。',
    offline: 'アプリのアクセス状態を確認できません',
    offlineBody: '最新のアプリ設定を確認するにはインターネットに接続してください。ローカルのプロジェクトはこの端末に残ります。',
    checking: 'アプリのアクセス状態を確認中…',
    checkingBody: 'しばらくお待ちください。',
    offlineStatus: 'オフライン：最後に保存されたアプリ状態を使用しています。管理者の変更は再接続後に反映されます。',
    retry: '再試行',
    back: 'アプリ一覧へ戻る',
  },
  ko: {
    unavailable: '앱을 사용할 수 없습니다',
    unavailableBody: '관리자가 이 앱을 비활성화했습니다. 기기에 저장된 로컬 프로젝트는 삭제되지 않습니다.',
    offline: '앱 접근 상태를 확인할 수 없습니다',
    offlineBody: '최신 앱 설정을 확인하려면 인터넷에 연결하세요. 로컬 프로젝트는 이 기기에 그대로 유지됩니다.',
    checking: '앱 접근 상태 확인 중…',
    checkingBody: '잠시만 기다려 주세요.',
    offlineStatus: '오프라인: 마지막으로 저장된 앱 상태를 사용 중입니다. 관리자 변경 사항은 다시 연결한 후 적용됩니다.',
    retry: '다시 시도',
    back: '앱으로 돌아가기',
  },
})

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'
)
const CACHE_KEY = 'shadow-public-app-settings-v2'
const CACHE_MS = 30_000

function readStatus(appKey, freshOnly = false) {
  try {
    const value = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (!Number.isFinite(value?.savedAt) || value.savedAt > Date.now() || !Array.isArray(value.apps)) return null
    if (freshOnly && Date.now() - value.savedAt >= CACHE_MS) return null
    const app = value.apps.find(item => item?.appKey === appKey)
    return typeof app?.disabled === 'boolean' ? app.disabled : null
  } catch {
    return null
  }
}

export default function AppAccessGuard({ appKey, children }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [result, setResult] = useState(() => ({
    disabled: readStatus(appKey, true),
    offline: false,
  }))
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const cached = readStatus(appKey, true)

    if (cached !== null && retry === 0) {
      setResult({ disabled: cached, offline: false })
      return
    }

    let active = true
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12_000)

    setResult({ disabled: null, offline: false })

    fetch(`${API_BASE_URL}/api/public/apps`, {
      signal: controller.signal,
      cache: 'no-cache',
    })
      .then(async response => {
        if (!response.ok) throw new Error('App settings unavailable')

        const data = await response.json()

        if (data.ok !== true || !Array.isArray(data.apps)) {
          throw new Error('Invalid app settings')
        }

        const app = data.apps.find(item => item?.appKey === appKey)

        if (typeof app?.disabled !== 'boolean') {
          throw new Error('Unknown app status')
        }

        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              savedAt: Date.now(),
              apps: data.apps,
            }),
          )
        } catch {}

        if (active) {
          setResult({
            disabled: app.disabled,
            offline: false,
          })
        }
      })
      .catch(() => {
        if (active) {
          setResult({
            disabled: readStatus(appKey),
            offline: true,
          })
        }
      })
      .finally(() => clearTimeout(timer))

    return () => {
      active = false
      clearTimeout(timer)
      controller.abort()
    }
  }, [appKey, retry])

  if (result.disabled === false) {
    return (
      <>
        {result.offline ? (
          <div
            role="status"
            className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"
          >
            {t('appAccessGuard.offlineStatus')}
          </div>
        ) : null}
        {children}
      </>
    )
  }

  const unavailable = result.disabled === true
  const offline = !unavailable && result.offline

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf9fc] px-5 text-center text-[#252139] dark:bg-[#11121c] dark:text-white">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#efe8ff] text-3xl text-[#6d4bb9] dark:bg-[#302640]">
        {result.disabled === null ? '…' : '×'}
      </div>

      <h1 className="text-xl font-bold">
        {unavailable
          ? t('appAccessGuard.unavailable')
          : offline
            ? t('appAccessGuard.offline')
            : t('appAccessGuard.checking')}
      </h1>

      <p className="max-w-sm text-sm leading-6 text-[#777189] dark:text-white/65">
        {unavailable
          ? t('appAccessGuard.unavailableBody')
          : offline
            ? t('appAccessGuard.offlineBody')
            : t('appAccessGuard.checkingBody')}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {offline ? (
          <button
            type="button"
            onClick={() => setRetry(value => value + 1)}
            className="rounded-xl bg-[#7150ba] px-5 py-3 text-sm font-semibold text-white"
          >
            {t('appAccessGuard.retry')}
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => navigate('/app')}
          className="rounded-xl border border-[#ded8e9] px-5 py-3 text-sm font-semibold dark:border-white/20"
        >
          {t('appAccessGuard.back')}
        </button>
      </div>
    </div>
  )
}
