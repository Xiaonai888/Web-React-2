import React from 'react'
import MaintenancePage from '../pages/MaintenancePage.jsx'
import { PageShell, PageErrorState } from './common/PagePrimitives.jsx'
import { useDisplayTranslation } from '../utils/displayLanguage.js'
import { registerTranslationNamespace } from '../i18n/registerTranslations.js'

registerTranslationNamespace('appCrash', {
  km: {
    title: 'ទំព័រនេះមានបញ្ហាបច្ចេកទេស',
    description: 'កម្មវិធីមិនអាចបង្ហាញទំព័រនេះបានទេ។ សូមសាកល្បងម្តងទៀត។',
    offline: 'ការតភ្ជាប់អ៊ីនធឺណិតមិនមាននៅពេលនេះ។ សូមពិនិត្យការតភ្ជាប់ រួចសាកល្បងម្តងទៀត។',
    asset: 'មានបញ្ហាក្នុងការផ្ទុកឯកសារកម្មវិធី។ សូមផ្ទុកទំព័រឡើងវិញ។',
    retry: 'សាកល្បងម្តងទៀត',
    reload: 'ផ្ទុកទំព័រឡើងវិញ',
    code: 'លេខកូដកំហុស',
    location: 'ទីតាំងទំព័រ',
    help: 'បើបញ្ហានៅតែមាន សូមផ្ញើលេខកូដកំហុសនេះទៅក្រុមជំនួយ។',
  },
  en: {
    title: 'This page ran into a technical error',
    description: 'The app could not display this page. Please try again.',
    offline: 'You appear to be offline. Check your connection and try again.',
    asset: 'An app file could not be loaded. Please reload the page.',
    retry: 'Try again',
    reload: 'Reload page',
    code: 'Error code',
    location: 'Page',
    help: 'If the problem continues, share this error code with support.',
  },
  zh: {
    title: '此页面出现技术错误',
    description: '应用无法显示此页面，请重试。',
    offline: '当前似乎没有网络连接，请检查网络后重试。',
    asset: '应用文件加载失败，请重新加载页面。',
    retry: '重试',
    reload: '重新加载页面',
    code: '错误代码',
    location: '页面',
    help: '如果问题持续，请将错误代码发送给客服。',
  },
  ja: {
    title: 'ページで技術的なエラーが発生しました',
    description: 'このページを表示できませんでした。もう一度お試しください。',
    offline: 'インターネットに接続されていないようです。接続を確認して再試行してください。',
    asset: 'アプリのファイルを読み込めませんでした。ページを再読み込みしてください。',
    retry: '再試行',
    reload: '再読み込み',
    code: 'エラーコード',
    location: 'ページ',
    help: '問題が続く場合は、このエラーコードをサポートにお伝えください。',
  },
  ko: {
    title: '페이지에 기술적 오류가 발생했습니다',
    description: '이 페이지를 표시할 수 없습니다. 다시 시도해 주세요.',
    offline: '인터넷 연결이 없는 것 같습니다. 연결을 확인한 후 다시 시도해 주세요.',
    asset: '앱 파일을 불러오지 못했습니다. 페이지를 새로고침해 주세요.',
    retry: '다시 시도',
    reload: '새로고침',
    code: '오류 코드',
    location: '페이지',
    help: '문제가 계속되면 이 오류 코드를 고객 지원팀에 알려주세요.',
  },
})

function createIncident(error, errorInfo) {
  const message = String(error?.message || '')
  const name = String(error?.name || 'Error')
  const componentStack = String(errorInfo?.componentStack || '')
  const signature = `${name}|${message}|${componentStack.slice(0, 800)}`
  let hash = 2166136261
  for (let index = 0; index < signature.length; index += 1) {
    hash ^= signature.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  const assetError = /ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module|Importing a module script failed|Unable to preload CSS/i.test(`${name} ${message}`)
  return {
    code: `UI-${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`,
    kind: assetError ? 'asset' : 'render',
    path: window.location.pathname || '/',
  }
}

function AppCrashFallback({ incident, onRetry }) {
  const { t } = useDisplayTranslation()
  const offline = navigator.onLine === false
  const description = offline
    ? t('appCrash.offline')
    : incident?.kind === 'asset'
      ? t('appCrash.asset')
      : t('appCrash.description')

  return (
    <PageShell className="flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px]">
        <div className="app-title mb-4 text-center text-[20px] font-bold">Shadow</div>
        <PageErrorState
          title={t('appCrash.title')}
          body={description}
          actionLabel={t('appCrash.retry')}
          onAction={onRetry}
        />
        <div className="app-card mt-3 rounded-[18px] border p-4">
          <div className="app-muted text-[12px]">{t('appCrash.code')}</div>
          <div className="app-title mt-1 select-text break-all font-mono text-[14px]">{incident?.code || 'UI-UNKNOWN'}</div>
          <div className="app-muted mt-3 text-[12px]">{t('appCrash.location')}</div>
          <div className="app-title mt-1 select-text break-all text-[12px]">{incident?.path || '/'}</div>
          <p className="app-muted mt-3 text-[12px] leading-5">{t('appCrash.help')}</p>
          <button
            type="button"
            className="app-soft app-title mt-4 w-full rounded-full border px-5 py-2.5 text-[12px] font-semibold"
            onClick={() => window.location.reload()}
          >
            {t('appCrash.reload')}
          </button>
        </div>
      </div>
    </PageShell>
  )
}

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, incident: null }
    this.handleRetry = this.handleRetry.bind(this)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const incident = createIncident(error, errorInfo)
    console.error('SHADOW_UI_RENDER_FAILURE', {
      code: incident.code,
      kind: incident.kind,
      path: incident.path,
      name: String(error?.name || 'Error').slice(0, 100),
      message: String(error?.message || '').slice(0, 600),
      component_stack: String(errorInfo?.componentStack || '').slice(0, 2000),
    })
    this.setState({ incident })
  }

  handleRetry() {
    this.setState({ hasError: false, incident: null })
  }

  render() {
    const isMaintenanceTest = new URLSearchParams(window.location.search).get('maintenance-test') === '1'
    if (isMaintenanceTest) return <MaintenancePage />
    if (this.state.hasError) {
      return <AppCrashFallback incident={this.state.incident} onRetry={this.handleRetry} />
    }
    return this.props.children
  }
}
