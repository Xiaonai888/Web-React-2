import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { getCountryFeature, loadCountrySettings } from '../../utils/countrySettings'

registerTranslationNamespace('countryGameAccess', {
  km: {
    checking: 'កំពុងពិនិត្យសិទ្ធិចូល Game…',
    blocked: 'Game មិនអាចប្រើបានក្នុងប្រទេសរបស់អ្នកទេ។',
    unavailable: 'មិនអាចពិនិត្យសិទ្ធិចូល Game បានទេ។',
    retry: 'ព្យាយាមម្ដងទៀត',
    back: 'ត្រឡប់ទៅ Mine',
  },
  en: {
    checking: 'Checking game access…',
    blocked: 'Game is not available in your country.',
    unavailable: 'Unable to check game access.',
    retry: 'Retry',
    back: 'Back to Mine',
  },
  zh: {
    checking: '正在检查游戏访问权限…',
    blocked: '您所在的国家无法使用游戏。',
    unavailable: '无法检查游戏访问权限。',
    retry: '重试',
    back: '返回我的页面',
  },
  ja: {
    checking: 'ゲームへのアクセスを確認中…',
    blocked: 'お住まいの国ではゲームを利用できません。',
    unavailable: 'ゲームへのアクセスを確認できません。',
    retry: '再試行',
    back: 'マイページへ戻る',
  },
  ko: {
    checking: '게임 이용 권한을 확인하는 중…',
    blocked: '거주 국가에서는 게임을 이용할 수 없습니다.',
    unavailable: '게임 이용 권한을 확인할 수 없습니다.',
    retry: '다시 시도',
    back: '내 페이지로 돌아가기',
  },
})

export default function CountryGameAccessGuard({ children }) {
  const { t } = useDisplayTranslation()
  const [status, setStatus] = useState('checking')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setStatus('checking')

    loadCountrySettings({ force: retry > 0 })
      .then(settings => {
        if (!active) return
        if (!settings) {
          setStatus('unavailable')
          return
        }
        if (settings.countryVerified !== true) {
          // Do not invent a restriction without a saved, verified country.
          setStatus('allowed')
          return
        }
        const allowed = getCountryFeature(settings, 'game', null)
        setStatus(allowed === true ? 'allowed' : allowed === false ? 'blocked' : 'unavailable')
      })
      .catch(() => {
        if (active) setStatus('unavailable')
      })

    return () => { active = false }
  }, [retry])

  if (status === 'allowed') return children

  return (
    <main className="app-page flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <p role="status" className="app-title max-w-sm text-sm">
        {t(`countryGameAccess.${status}`)}
      </p>
      {status === 'unavailable' && (
        <button
          type="button"
          onClick={() => setRetry(value => value + 1)}
          className="rounded-xl bg-[#4f46e5] px-5 py-3 text-sm font-semibold text-white"
        >
          {t('countryGameAccess.retry')}
        </button>
      )}
      <Link
        to="/me"
        replace
        className="app-border rounded-xl border px-5 py-3 text-sm font-semibold"
      >
        {t('countryGameAccess.back')}
      </Link>
    </main>
  )
}
