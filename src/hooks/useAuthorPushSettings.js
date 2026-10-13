import { useCallback, useEffect, useRef, useState } from 'react'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorPushSettings', {
  en: {
    settings: 'Settings',
    notification: 'Notification',
    notificationHelp: 'Diamond Unlock, Gift and Comment',
    receive: 'Receive Notifications',
    receiveHelp: 'Turn off to stop all author push notifications.',
    types: 'Notification Types',
    unlock: 'Diamond Unlock',
    unlockHelp: 'When readers unlock your stories with diamonds.',
    gift: 'Diamond Gift',
    giftHelp: 'When readers send you diamond gifts.',
    comment: 'Comment',
    commentHelp: 'When readers comment on your stories.',
    allow: 'Allow browser notifications',
    blocked: 'Notifications are blocked in browser settings.',
    unavailable: 'Push notifications are unavailable on this device.',
    permission: 'Browser permission is required for push notifications.',
    signIn: 'Please sign in again.',
    notConfigured: 'Push notifications are not configured.',
    loadFailed: 'Could not load your notification settings.',
    saveFailed: 'Could not save this setting. Please try again.',
    back: 'Back',
  },
  km: {
    settings: 'ការកំណត់',
    notification: 'ការជូនដំណឹង',
    notificationHelp: 'ដោះសោពេជ្រ កាដូពេជ្រ និងមតិយោបល់',
    receive: 'ទទួលការជូនដំណឹង',
    receiveHelp: 'បិទដើម្បីឈប់ទទួល Push សម្រាប់អ្នកនិពន្ធទាំងអស់។',
    types: 'ប្រភេទការជូនដំណឹង',
    unlock: 'ការដោះសោដោយពេជ្រ',
    unlockHelp: 'ពេលអ្នកអានដោះសោរឿងរបស់អ្នកដោយពេជ្រ។',
    gift: 'កាដូពេជ្រ',
    giftHelp: 'ពេលអ្នកអានផ្ញើកាដូពេជ្រមកអ្នក។',
    comment: 'មតិយោបល់',
    commentHelp: 'ពេលអ្នកអានបញ្ចេញមតិលើរឿងរបស់អ្នក។',
    allow: 'អនុញ្ញាតការជូនដំណឹងពី Browser',
    blocked: 'Browser បានបិទការអនុញ្ញាត Notification។',
    unavailable: 'ឧបករណ៍នេះមិនគាំទ្រ Push Notification ទេ។',
    permission: 'ត្រូវអនុញ្ញាត Notification ក្នុង Browser ជាមុន។',
    signIn: 'សូមចូលគណនីឡើងវិញ។',
    notConfigured: 'មិនទាន់បានកំណត់ Push Notification ទេ។',
    loadFailed: 'មិនអាចផ្ទុកការកំណត់ Notification បានទេ។',
    saveFailed: 'មិនអាចរក្សាទុកបានទេ។ សូមសាកល្បងម្ដងទៀត។',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    settings: '设置', notification: '通知', notificationHelp: '钻石解锁、钻石礼物和评论',
    receive: '接收通知', receiveHelp: '关闭全部作者推送通知。', types: '通知类型',
    unlock: '钻石解锁', unlockHelp: '读者使用钻石解锁故事时。',
    gift: '钻石礼物', giftHelp: '读者赠送钻石礼物时。',
    comment: '评论', commentHelp: '读者评论您的故事时。',
    allow: '允许浏览器通知', blocked: '浏览器已阻止通知。',
    unavailable: '此设备不支持推送通知。', permission: '需要浏览器通知权限。',
    signIn: '请重新登录。', notConfigured: '推送通知未配置。',
    loadFailed: '无法加载通知设置。', saveFailed: '保存失败，请重试。', back: '返回',
  },
  ja: {
    settings: '設定', notification: '通知', notificationHelp: 'ダイヤ解放、ギフト、コメント',
    receive: '通知を受け取る', receiveHelp: '作者向けの通知をすべて停止します。', types: '通知の種類',
    unlock: 'ダイヤ解放', unlockHelp: '読者がダイヤで作品を解放したとき。',
    gift: 'ダイヤギフト', giftHelp: '読者からダイヤギフトが届いたとき。',
    comment: 'コメント', commentHelp: '作品にコメントが届いたとき。',
    allow: 'ブラウザー通知を許可', blocked: 'ブラウザーで通知がブロックされています。',
    unavailable: 'この端末はプッシュ通知に対応していません。', permission: 'ブラウザーの通知許可が必要です。',
    signIn: 'もう一度ログインしてください。', notConfigured: '通知が設定されていません。',
    loadFailed: '通知設定を読み込めませんでした。', saveFailed: '保存できませんでした。もう一度お試しください。', back: '戻る',
  },
  ko: {
    settings: '설정', notification: '알림', notificationHelp: '다이아 잠금 해제, 선물, 댓글',
    receive: '알림 받기', receiveHelp: '모든 작가 푸시 알림을 중지합니다.', types: '알림 유형',
    unlock: '다이아 잠금 해제', unlockHelp: '독자가 다이아로 작품을 잠금 해제할 때.',
    gift: '다이아 선물', giftHelp: '독자가 다이아 선물을 보낼 때.',
    comment: '댓글', commentHelp: '독자가 작품에 댓글을 남길 때.',
    allow: '브라우저 알림 허용', blocked: '브라우저에서 알림을 차단했습니다.',
    unavailable: '이 기기는 푸시 알림을 지원하지 않습니다.', permission: '브라우저 알림 권한이 필요합니다.',
    signIn: '다시 로그인해 주세요.', notConfigured: '푸시 알림 설정이 없습니다.',
    loadFailed: '알림 설정을 불러올 수 없습니다.', saveFailed: '저장하지 못했습니다. 다시 시도해 주세요.', back: '뒤로',
  },
})

const APP_ID = String(import.meta.env.VITE_ONESIGNAL_APP_ID || '').trim()
const TAGS = {
  master: 'author_story_push',
  unlock: 'author_story_push_unlock',
  gift: 'author_story_push_gift',
  comment: 'author_story_push_comment',
}
const DEFAULT_PREFERENCES = { master: true, unlock: true, gift: true, comment: true }

function getSignedInUserId() {
  const token = sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token')
  if (!token) throw new Error('signIn')

  try {
    const raw = sessionStorage.getItem('shadow_reader_user') || localStorage.getItem('shadow_reader_user') || 'null'
    const user = JSON.parse(raw)
    const userId = String(user?.id || user?.user_id || '').trim()
    if (userId) return userId
  } catch {}

  throw new Error('signIn')
}

async function getOneSignal() {
  if (!APP_ID) throw new Error('notConfigured')
  if (typeof window === 'undefined' || !window.isSecureContext || !('serviceWorker' in navigator) || !('Notification' in window)) {
    throw new Error('unavailable')
  }

  const userId = getSignedInUserId()
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
      window.OneSignalDeferred.push(async (sdk) => {
        try {
          await sdk.init({
            appId: APP_ID,
            serviceWorkerPath: 'onesignal/OneSignalSDKWorker.js',
            serviceWorkerParam: { scope: '/onesignal/' },
            notifyButton: { enable: false },
            welcomeNotification: { disable: true },
            autoResubscribe: true,
          })
          resolve(sdk)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const sdk = await window.__shadowOneSignalReadyPromise
  if (String(sdk.User.externalId || '') !== userId) await sdk.login(userId)
  return sdk
}

function readTag(tags, key) {
  return String(tags?.[key] || '').toLowerCase() !== 'false'
}

function getBrowserStatus(sdk) {
  const permitted = Notification.permission === 'granted'
  return permitted && Boolean(sdk.User.PushSubscription.optedIn)
}

async function readPreferences() {
  const sdk = await getOneSignal()
  const tags = await Promise.resolve(sdk.User.getTags())
  const preferences = {
    master: readTag(tags, TAGS.master),
    unlock: readTag(tags, TAGS.unlock),
    gift: readTag(tags, TAGS.gift),
    comment: readTag(tags, TAGS.comment),
  }
  const browserEnabled = getBrowserStatus(sdk)

  if (preferences.master && browserEnabled && String(tags?.[TAGS.master] || '') !== 'true') {
    await Promise.resolve(sdk.User.addTag(TAGS.master, 'true'))
  }

  return { preferences, browserEnabled }
}

export function useAuthorPushSettings() {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [browserEnabled, setBrowserEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const busyRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    readPreferences().then((result) => {
      if (cancelled) return
      setPreferences(result.preferences)
      setBrowserEnabled(result.browserEnabled)
      setError('')
    }).catch((reason) => {
      if (cancelled) return
      const code = String(reason?.message || '')
      setError(['signIn', 'notConfigured', 'unavailable'].includes(code) ? code : 'loadFailed')
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const updatePreference = useCallback(async (key, value) => {
    if (!TAGS[key] || busyRef.current || loading) return false
    busyRef.current = true
    setBusy(key)
    setError('')

    try {
      const sdk = await getOneSignal()
      if (key === 'master' && value) {
        if (Notification.permission === 'denied') throw new Error('blocked')
        if (!sdk.Notifications.isPushSupported()) throw new Error('unavailable')
        await sdk.User.PushSubscription.optIn()
        if (!getBrowserStatus(sdk)) throw new Error('permission')
      }

      await Promise.resolve(sdk.User.addTag(TAGS[key], value ? 'true' : 'false'))
      setPreferences((current) => ({ ...current, [key]: value }))
      setBrowserEnabled(getBrowserStatus(sdk))
      return true
    } catch (reason) {
      const code = String(reason?.message || '')
      setError(['signIn', 'notConfigured', 'unavailable', 'blocked', 'permission'].includes(code) ? code : 'saveFailed')
      return false
    } finally {
      busyRef.current = false
      setBusy('')
    }
  }, [loading])

  const allowBrowser = useCallback(async () => {
    if (busyRef.current || loading) return false
    busyRef.current = true
    setBusy('permission')
    setError('')

    try {
      const sdk = await getOneSignal()
      if (Notification.permission === 'denied') throw new Error('blocked')
      if (!sdk.Notifications.isPushSupported()) throw new Error('unavailable')
      await sdk.User.PushSubscription.optIn()
      if (!getBrowserStatus(sdk)) throw new Error('permission')
      if (preferences.master) await Promise.resolve(sdk.User.addTag(TAGS.master, 'true'))
      setBrowserEnabled(true)
      return true
    } catch (reason) {
      const code = String(reason?.message || '')
      setError(['blocked', 'unavailable', 'permission'].includes(code) ? code : 'saveFailed')
      return false
    } finally {
      busyRef.current = false
      setBusy('')
    }
  }, [loading, preferences.master])

  return { preferences, browserEnabled, loading, busy, error, updatePreference, allowBrowser }
}
