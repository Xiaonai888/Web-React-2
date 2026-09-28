function startSmartRefreshCycle() {
  return
}

  async function getOneSignal() {
    const appId = String(import.meta.env.VITE_ONESIGNAL_APP_ID || '').trim()
    if (!appId) throw new Error(t('taskCenterPage.updateReminderFailed'))

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
              appId,
              serviceWorkerPath: 'assets/onesignal/OneSignalSDKWorker.js',
              serviceWorkerParam: { scope: '/assets/onesignal/' },
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
    const userId = String(storedUser?.id || '').trim()

    if (userId && String(OneSignal.User.externalId || '') !== userId) {
      await OneSignal.login(userId)
    }

    return OneSignal
  }

  async function loadReminderSetting() {
    if (!isLoggedIn) {
      setReminderEnabled(false)
      return
    }

    try {
      const OneSignal = await getOneSignal()
      const tags = OneSignal.User.getTags()
      setReminderEnabled(String(tags?.daily_checkin_reminder || '') === 'true')
    } catch {
      setReminderEnabled(false)
    }
  }

  async function toggleReminder() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (reminderLoading) return

    try {
      setReminderLoading(true)
      setMessage('')

      const OneSignal = await getOneSignal()
      const nextEnabled = !reminderEnabled

      if (nextEnabled) {
        if (!OneSignal.Notifications.isPushSupported()) {
          throw new Error(t('taskCenterPage.updateReminderFailed'))
        }

        await OneSignal.User.PushSubscription.optIn()

        if (!OneSignal.Notifications.permission || !OneSignal.User.PushSubscription.optedIn) {
          throw new Error(t('taskCenterPage.updateReminderFailed'))
        }

        await OneSignal.User.addTag('daily_checkin_reminder', 'true')
      } else {
        await OneSignal.User.removeTag('daily_checkin_reminder')
      }

      setReminderEnabled(nextEnabled)
      setToast(nextEnabled ? t('taskCenterPage.reminderOn') : t('taskCenterPage.reminderOff'))
    } catch (error) {
      setToast(error.message || t('taskCenterPage.updateReminderFailed'))
    } finally {
      setReminderLoading(false)
    }
  }
