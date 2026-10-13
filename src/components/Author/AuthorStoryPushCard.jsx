import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorStoryPush', {
  en: {
    title: 'Author push notifications',
    description: 'Diamond unlocks, diamond gifts, and comments only',
    on: 'Enabled',
    off: 'Disabled',
    enable: 'Enable',
    disable: 'Disable',
    saving: 'Saving...',
    unsupported: 'Push notifications are not supported on this device.',
    blocked: 'Allow notifications for this website in your browser settings.',
    signIn: 'Sign in again to enable notifications.',
    notConfigured: 'OneSignal is not configured.',
    failed: 'Could not update push notifications.',
  },
  km: {
    title: 'ការជូនដំណឹងអ្នកនិពន្ធ',
    description: 'តែការដោះសោដោយពេជ្រ កាដូពេជ្រ និង Comment',
    on: 'បានបើក',
    off: 'បានបិទ',
    enable: 'បើក',
    disable: 'បិទ',
    saving: 'កំពុងរក្សាទុក...',
    unsupported: 'ឧបករណ៍នេះមិនគាំទ្រ Push Notification ទេ។',
    blocked: 'សូមអនុញ្ញាត Notification សម្រាប់វេបសាយនេះក្នុង Browser Settings។',
    signIn: 'សូម Login ម្តងទៀត ដើម្បីបើក Notification។',
    notConfigured: 'OneSignal មិនទាន់ត្រូវបានកំណត់ទេ។',
    failed: 'មិនអាចកែការកំណត់ Push Notification បានទេ។',
  },
  zh: {
    title: '作者推送通知',
    description: '仅限钻石解锁、钻石礼物和评论',
    on: '已开启',
    off: '已关闭',
    enable: '开启',
    disable: '关闭',
    saving: '保存中...',
    unsupported: '此设备不支持推送通知。',
    blocked: '请在浏览器设置中允许此网站的通知。',
    signIn: '请重新登录以开启通知。',
    notConfigured: 'OneSignal 尚未配置。',
    failed: '无法更新推送通知设置。',
  },
  ja: {
    title: '作者プッシュ通知',
    description: 'ダイヤ解放、ダイヤギフト、コメントのみ',
    on: 'オン',
    off: 'オフ',
    enable: '有効にする',
    disable: '無効にする',
    saving: '保存中...',
    unsupported: 'この端末ではプッシュ通知を利用できません。',
    blocked: 'ブラウザーの設定でこのサイトの通知を許可してください。',
    signIn: '通知を有効にするには再ログインしてください。',
    notConfigured: 'OneSignal が設定されていません。',
    failed: 'プッシュ通知の設定を更新できませんでした。',
  },
  ko: {
    title: '작가 푸시 알림',
    description: '다이아몬드 잠금 해제, 다이아몬드 선물, 댓글만',
    on: '켜짐',
    off: '꺼짐',
    enable: '켜기',
    disable: '끄기',
    saving: '저장 중...',
    unsupported: '이 기기는 푸시 알림을 지원하지 않습니다.',
    blocked: '브라우저 설정에서 이 사이트의 알림을 허용하세요.',
    signIn: '알림을 켜려면 다시 로그인하세요.',
    notConfigured: 'OneSignal이 설정되지 않았습니다.',
    failed: '푸시 알림 설정을 변경하지 못했습니다.',
  },
})

const APP_ID = String(import.meta.env.VITE_ONESIGNAL_APP_ID || '').trim()
const AUTHOR_PUSH_TAG = 'author_story_push'

function getSignedInUserId() {
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token')
  if (!token) return ''
  try {
    const user = JSON.parse(sessionStorage.getItem('shadow_reader_user') || localStorage.getItem('shadow_reader_user') || 'null')
    return String(user?.id || user?.user_id || '').trim()
  } catch {
    return ''
  }
}

async function getAuthorOneSignal() {
  if (!APP_ID) throw new Error('notConfigured')
  const userId = getSignedInUserId()
  if (!userId) throw new Error('signIn')

  window.OneSignalDeferred = window.OneSignalDeferred || []
  if (!window.__shadowOneSignalSdkPromise) {
    window.__shadowOneSignalSdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-shadow-onesignal="true"]')
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          resolve()
          return
        }
        existing.addEventListener('load', resolve, { once: true })
        existing.addEventListener('error', reject, { once: true })
        return
      }
      const script = document.createElement('script')
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
      script.defer = true
      script.dataset.shadowOnesignal = 'true'
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true'
        resolve()
      }, { once: true })
      script.addEventListener('error', reject, { once: true })
      document.head.appendChild(script)
    })
  }

  await window.__shadowOneSignalSdkPromise
  if (!window.__shadowOneSignalReadyPromise) {
    window.__shadowOneSignalReadyPromise = new Promise((resolve, reject) => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId: APP_ID,
            serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
            serviceWorkerParam: { scope: '/onesignal/' },
            notifyButton: { enable: false },
            welcomeNotification: { disable: true },
            autoResubscribe: true,
          })
          resolve(OneSignal)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const OneSignal = await window.__shadowOneSignalReadyPromise
  if (String(OneSignal.User.externalId || '') !== userId) {
    await OneSignal.login(userId)
  }
  return OneSignal
}

export default function AuthorStoryPushCard() {
  const { t } = useDisplayTranslation()
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)
  const [errorKey, setErrorKey] = useState('')

  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    let cancelled = false
    getAuthorOneSignal().then((OneSignal) => {
      if (cancelled) return
      const tags = OneSignal.User.getTags()
      setEnabled(String(tags?.[AUTHOR_PUSH_TAG] || '') === 'true' && Boolean(OneSignal.User.PushSubscription.optedIn))
    }).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function toggleAuthorPush() {
    if (busy) return
    setErrorKey('')
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !window.isSecureContext) {
      setErrorKey('unsupported')
      return
    }
    if (!enabled && Notification.permission === 'denied') {
      setErrorKey('blocked')
      return
    }

    setBusy(true)
    try {
      const OneSignal = await getAuthorOneSignal()
      if (!OneSignal.Notifications.isPushSupported()) throw new Error('unsupported')
      if (enabled) {
        await OneSignal.User.removeTag(AUTHOR_PUSH_TAG)
        setEnabled(false)
      } else {
        await OneSignal.User.PushSubscription.optIn()
        if (!OneSignal.Notifications.permission || !OneSignal.User.PushSubscription.optedIn) {
          throw new Error('blocked')
        }
        await OneSignal.User.addTag(AUTHOR_PUSH_TAG, 'true')
        setEnabled(true)
      }
    } catch (error) {
      const key = String(error?.message || '')
      setErrorKey(['unsupported', 'blocked', 'signIn', 'notConfigured'].includes(key) ? key : 'failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] text-[#8b64d8]">
        <i className="fa-regular fa-bell text-[17px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-bold text-[var(--shadow-text-primary)]">{t('authorStoryPush.title')}</div>
        <div className="mt-0.5 text-[10px] leading-4 text-[var(--shadow-text-secondary)]">{t('authorStoryPush.description')}</div>
        <div className="mt-1 text-[10px] text-[var(--shadow-text-tertiary)]">{t(enabled ? 'authorStoryPush.on' : 'authorStoryPush.off')}</div>
        {errorKey ? <div role="alert" className="mt-1 text-[10px] leading-4 text-red-500">{t(`authorStoryPush.${errorKey}`)}</div> : null}
      </div>
      <button
        type="button"
        onClick={toggleAuthorPush}
        disabled={busy}
        aria-pressed={enabled}
        className="shrink-0 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-2 text-[11px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-60"
      >
        {t(busy ? 'authorStoryPush.saving' : enabled ? 'authorStoryPush.disable' : 'authorStoryPush.enable')}
      </button>
    </section>
  )
}
