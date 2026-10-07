import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../../components/common/PagePrimitives'
import DisplayLanguageMenu from '../../components/common/DisplayLanguageMenu'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('installPage', {
  en: {
    title: 'Install Shadow',
    subtitleIOS: 'Get Shadow on your iPhone for faster access and a smoother reading experience.',
    subtitleAndroid: 'Get Shadow on your Android device for faster access and a smoother reading experience.',
    iphoneDetected: 'iPhone detected',
    androidDetected: 'Android detected',
    safariDetected: 'Safari detected',
    chromeDetected: 'Chrome detected',
    installedDetected: 'Shadow is installed',
    stepOne: 'Step 1 of 2',
    stepTwo: 'Step 2 of 2',
    openSafariTitle: 'Open in Safari first',
    openSafariBody: 'Shadow installs best on iPhone from Safari. Tap below and we will try to open Safari for you.',
    openSafari: 'Open in Safari',
    safariNext: 'We will guide you in Safari next.',
    copied: 'Link copied. Open Safari and paste it if Safari did not open.',
    help: 'NEED HELP?',
    safariHelp: 'Tap the browser menu, then choose Open in Safari.',
    addHomeTitle: 'Add Shadow to Home Screen',
    almostDone: 'You are almost done. Follow these 3 simple steps.',
    tapShare: 'Tap Share',
    tapShareBody: 'Tap the Share button in Safari.',
    chooseHome: 'Choose Add to Home Screen',
    chooseHomeBody: 'Scroll and tap Add to Home Screen.',
    tapAdd: 'Tap Add',
    tapAddBody: 'Finally, tap Add in the top right corner.',
    gotIt: 'Got it',
    openChromeTitle: 'Open in Chrome first',
    openChromeBody: 'Shadow installs best on Android from Chrome. Tap below to open this page in Chrome.',
    openChrome: 'Open in Chrome',
    chromeNext: 'Then tap Install Shadow.',
    chromeHelp: 'Tap the browser menu, then choose Open in Chrome.',
    installNowTitle: 'Install Shadow now',
    installNowBody: 'Install Shadow for faster access and a smoother reading experience.',
    install: 'Install Shadow',
    preparing: 'Preparing install...',
    promptNote: 'A Chrome install prompt will appear.',
    manualTitle: 'Install from Chrome menu',
    manualBody: 'Tap the Chrome menu, then choose Install app or Add to Home screen.',
    installing: 'Installing...',
    fasterAccess: 'Faster access',
    fasterAccessBody: 'Open Shadow instantly from your Home Screen.',
    smootherReading: 'Smoother reading',
    smootherReadingBody: 'Enjoy a cleaner app-like reading experience.',
    installedTitle: 'Shadow is ready',
    installedBody: 'Shadow is already installed on this device.',
    openShadow: 'Open Shadow',
    phoneOnlyTitle: 'Open this page on your phone',
    phoneOnlyBody: 'This install page is designed for iPhone and Android.',
    close: 'Go to Shadow',
    browserMenu: 'Browser menu',
  },
  km: {
    title: 'ដំឡើង Shadow',
    subtitleIOS: 'ដំឡើង Shadow លើ iPhone ដើម្បីចូលបានលឿន និងអានបានរលូនជាងមុន។',
    subtitleAndroid: 'ដំឡើង Shadow លើ Android ដើម្បីចូលបានលឿន និងអានបានរលូនជាងមុន។',
    iphoneDetected: 'បានស្គាល់ iPhone',
    androidDetected: 'បានស្គាល់ Android',
    safariDetected: 'បានស្គាល់ Safari',
    chromeDetected: 'បានស្គាល់ Chrome',
    installedDetected: 'Shadow បានដំឡើងរួច',
    stepOne: 'ជំហាន 1 នៃ 2',
    stepTwo: 'ជំហាន 2 នៃ 2',
    openSafariTitle: 'បើកក្នុង Safari ជាមុន',
    openSafariBody: 'លើ iPhone ការដំឡើង Shadow ងាយបំផុតតាម Safari។ ចុចខាងក្រោម ហើយយើងនឹងព្យាយាមបើក Safari ជូន។',
    openSafari: 'បើកក្នុង Safari',
    safariNext: 'ពេលដល់ Safari យើងនឹងណែនាំអ្នកបន្ត។',
    copied: 'បាន Copy Link រួច។ បើ Safari មិនបើក សូមបើក Safari ហើយ Paste Link នេះ។',
    help: 'ត្រូវការជំនួយ?',
    safariHelp: 'ចុច Menu របស់ Browser ហើយជ្រើស Open in Safari។',
    addHomeTitle: 'បន្ថែម Shadow ទៅ Home Screen',
    almostDone: 'ជិតរួចហើយ។ ធ្វើតាម 3 ជំហានខ្លីៗនេះ។',
    tapShare: 'ចុច Share',
    tapShareBody: 'ចុចប៊ូតុង Share នៅក្នុង Safari។',
    chooseHome: 'ជ្រើស Add to Home Screen',
    chooseHomeBody: 'អូសចុះ ហើយចុច Add to Home Screen។',
    tapAdd: 'ចុច Add',
    tapAddBody: 'ចុងក្រោយ ចុច Add នៅខាងស្តាំខាងលើ។',
    gotIt: 'យល់ហើយ',
    openChromeTitle: 'បើកក្នុង Chrome ជាមុន',
    openChromeBody: 'លើ Android ការដំឡើង Shadow ងាយបំផុតតាម Chrome។ ចុចខាងក្រោមដើម្បីបើកទំព័រនេះក្នុង Chrome។',
    openChrome: 'បើកក្នុង Chrome',
    chromeNext: 'បន្ទាប់មកចុច Install Shadow។',
    chromeHelp: 'ចុច Menu របស់ Browser ហើយជ្រើស Open in Chrome។',
    installNowTitle: 'ដំឡើង Shadow ឥឡូវនេះ',
    installNowBody: 'ដំឡើង Shadow ដើម្បីចូលបានលឿន និងអានបានរលូនជាងមុន។',
    install: 'ដំឡើង Shadow',
    preparing: 'កំពុងរៀបចំការដំឡើង...',
    promptNote: 'Chrome នឹងបង្ហាញផ្ទាំង Install។',
    manualTitle: 'ដំឡើងពី Chrome Menu',
    manualBody: 'ចុច Chrome Menu ហើយជ្រើស Install app ឬ Add to Home screen។',
    installing: 'កំពុងដំឡើង...',
    fasterAccess: 'ចូលបានលឿន',
    fasterAccessBody: 'បើក Shadow ភ្លាមៗពី Home Screen។',
    smootherReading: 'អានបានរលូន',
    smootherReadingBody: 'ទទួលបានបទពិសោធន៍អានដូច App។',
    installedTitle: 'Shadow រួចរាល់',
    installedBody: 'Shadow បានដំឡើងលើឧបករណ៍នេះរួចហើយ។',
    openShadow: 'បើក Shadow',
    phoneOnlyTitle: 'សូមបើកទំព័រនេះលើទូរសព្ទ',
    phoneOnlyBody: 'ទំព័រដំឡើងនេះសម្រាប់ iPhone និង Android។',
    close: 'ទៅ Shadow',
    browserMenu: 'Browser menu',
  },
  zh: {
    title: '安装 Shadow',
    subtitleIOS: '将 Shadow 安装到 iPhone，获得更快访问和更流畅的阅读体验。',
    subtitleAndroid: '将 Shadow 安装到 Android 设备，获得更快访问和更流畅的阅读体验。',
    iphoneDetected: '已检测到 iPhone',
    androidDetected: '已检测到 Android',
    safariDetected: '已检测到 Safari',
    chromeDetected: '已检测到 Chrome',
    installedDetected: 'Shadow 已安装',
    stepOne: '第 1 步，共 2 步',
    stepTwo: '第 2 步，共 2 步',
    openSafariTitle: '先在 Safari 中打开',
    openSafariBody: '在 iPhone 上，通过 Safari 安装 Shadow 最方便。点击下方，我们会尝试为你打开 Safari。',
    openSafari: '在 Safari 中打开',
    safariNext: '进入 Safari 后，我们会继续指导你。',
    copied: '链接已复制。如果 Safari 没有打开，请打开 Safari 并粘贴链接。',
    help: '需要帮助？',
    safariHelp: '打开浏览器菜单，然后选择“在 Safari 中打开”。',
    addHomeTitle: '将 Shadow 添加到主屏幕',
    almostDone: '快完成了。按照下面 3 个简单步骤操作。',
    tapShare: '点击分享',
    tapShareBody: '在 Safari 中点击分享按钮。',
    chooseHome: '选择“添加到主屏幕”',
    chooseHomeBody: '向下滚动并点击“添加到主屏幕”。',
    tapAdd: '点击“添加”',
    tapAddBody: '最后点击右上角的“添加”。',
    gotIt: '知道了',
    openChromeTitle: '先在 Chrome 中打开',
    openChromeBody: '在 Android 上，通过 Chrome 安装 Shadow 最方便。点击下方在 Chrome 中打开此页面。',
    openChrome: '在 Chrome 中打开',
    chromeNext: '然后点击“安装 Shadow”。',
    chromeHelp: '打开浏览器菜单，然后选择“在 Chrome 中打开”。',
    installNowTitle: '立即安装 Shadow',
    installNowBody: '安装 Shadow，获得更快访问和更流畅的阅读体验。',
    install: '安装 Shadow',
    preparing: '正在准备安装...',
    promptNote: 'Chrome 将显示安装提示。',
    manualTitle: '从 Chrome 菜单安装',
    manualBody: '打开 Chrome 菜单，然后选择“安装应用”或“添加到主屏幕”。',
    installing: '正在安装...',
    fasterAccess: '访问更快',
    fasterAccessBody: '从主屏幕立即打开 Shadow。',
    smootherReading: '阅读更流畅',
    smootherReadingBody: '享受更像 App 的阅读体验。',
    installedTitle: 'Shadow 已准备好',
    installedBody: 'Shadow 已安装在此设备上。',
    openShadow: '打开 Shadow',
    phoneOnlyTitle: '请在手机上打开此页面',
    phoneOnlyBody: '此安装页面适用于 iPhone 和 Android。',
    close: '前往 Shadow',
    browserMenu: '浏览器菜单',
  },
  ja: {
    title: 'Shadow をインストール',
    subtitleIOS: 'iPhone に Shadow を追加して、より速く快適に読書を楽しめます。',
    subtitleAndroid: 'Android に Shadow を追加して、より速く快適に読書を楽しめます。',
    iphoneDetected: 'iPhone を検出',
    androidDetected: 'Android を検出',
    safariDetected: 'Safari を検出',
    chromeDetected: 'Chrome を検出',
    installedDetected: 'Shadow はインストール済み',
    stepOne: '1 / 2 ステップ',
    stepTwo: '2 / 2 ステップ',
    openSafariTitle: 'まず Safari で開く',
    openSafariBody: 'iPhone では Safari からのインストールが最も簡単です。下のボタンから Safari を開きます。',
    openSafari: 'Safari で開く',
    safariNext: 'Safari で次の手順をご案内します。',
    copied: 'リンクをコピーしました。Safari が開かない場合は Safari に貼り付けてください。',
    help: 'ヘルプ',
    safariHelp: 'ブラウザメニューを開き、「Safari で開く」を選択してください。',
    addHomeTitle: 'Shadow をホーム画面に追加',
    almostDone: 'もう少しです。次の 3 ステップに従ってください。',
    tapShare: '共有をタップ',
    tapShareBody: 'Safari の共有ボタンをタップします。',
    chooseHome: 'ホーム画面に追加',
    chooseHomeBody: '下へスクロールして「ホーム画面に追加」をタップします。',
    tapAdd: '追加をタップ',
    tapAddBody: '最後に右上の「追加」をタップします。',
    gotIt: '了解',
    openChromeTitle: 'まず Chrome で開く',
    openChromeBody: 'Android では Chrome からのインストールが最も簡単です。下のボタンから Chrome で開いてください。',
    openChrome: 'Chrome で開く',
    chromeNext: '次に「Shadow をインストール」をタップします。',
    chromeHelp: 'ブラウザメニューを開き、「Chrome で開く」を選択してください。',
    installNowTitle: 'Shadow を今すぐインストール',
    installNowBody: 'Shadow をインストールして、より速く快適に読書を楽しめます。',
    install: 'Shadow をインストール',
    preparing: 'インストールを準備中...',
    promptNote: 'Chrome のインストール画面が表示されます。',
    manualTitle: 'Chrome メニューからインストール',
    manualBody: 'Chrome メニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。',
    installing: 'インストール中...',
    fasterAccess: 'すばやくアクセス',
    fasterAccessBody: 'ホーム画面からすぐに Shadow を開けます。',
    smootherReading: '快適な読書',
    smootherReadingBody: 'アプリのような読み心地を楽しめます。',
    installedTitle: 'Shadow の準備完了',
    installedBody: 'Shadow はこの端末にすでにインストールされています。',
    openShadow: 'Shadow を開く',
    phoneOnlyTitle: 'スマートフォンで開いてください',
    phoneOnlyBody: 'このインストールページは iPhone と Android 向けです。',
    close: 'Shadow へ',
    browserMenu: 'ブラウザメニュー',
  },
  ko: {
    title: 'Shadow 설치',
    subtitleIOS: 'iPhone에 Shadow를 설치해 더 빠르고 부드럽게 이용하세요.',
    subtitleAndroid: 'Android에 Shadow를 설치해 더 빠르고 부드럽게 이용하세요.',
    iphoneDetected: 'iPhone 감지됨',
    androidDetected: 'Android 감지됨',
    safariDetected: 'Safari 감지됨',
    chromeDetected: 'Chrome 감지됨',
    installedDetected: 'Shadow 설치됨',
    stepOne: '1 / 2 단계',
    stepTwo: '2 / 2 단계',
    openSafariTitle: '먼저 Safari에서 열기',
    openSafariBody: 'iPhone에서는 Safari에서 설치하는 것이 가장 쉽습니다. 아래 버튼을 눌러 Safari 열기를 시도합니다.',
    openSafari: 'Safari에서 열기',
    safariNext: 'Safari에서 다음 단계를 안내해 드립니다.',
    copied: '링크를 복사했습니다. Safari가 열리지 않으면 Safari에 붙여 넣어 주세요.',
    help: '도움이 필요하신가요?',
    safariHelp: '브라우저 메뉴를 열고 Safari에서 열기를 선택하세요.',
    addHomeTitle: 'Shadow를 홈 화면에 추가',
    almostDone: '거의 끝났습니다. 아래 3단계를 따라 주세요.',
    tapShare: '공유 누르기',
    tapShareBody: 'Safari에서 공유 버튼을 누르세요.',
    chooseHome: '홈 화면에 추가 선택',
    chooseHomeBody: '아래로 스크롤한 뒤 홈 화면에 추가를 누르세요.',
    tapAdd: '추가 누르기',
    tapAddBody: '마지막으로 오른쪽 위의 추가를 누르세요.',
    gotIt: '확인',
    openChromeTitle: '먼저 Chrome에서 열기',
    openChromeBody: 'Android에서는 Chrome에서 설치하는 것이 가장 쉽습니다. 아래 버튼으로 이 페이지를 Chrome에서 여세요.',
    openChrome: 'Chrome에서 열기',
    chromeNext: '그다음 Shadow 설치를 누르세요.',
    chromeHelp: '브라우저 메뉴를 열고 Chrome에서 열기를 선택하세요.',
    installNowTitle: '지금 Shadow 설치',
    installNowBody: 'Shadow를 설치해 더 빠르고 부드럽게 이용하세요.',
    install: 'Shadow 설치',
    preparing: '설치 준비 중...',
    promptNote: 'Chrome 설치 창이 표시됩니다.',
    manualTitle: 'Chrome 메뉴에서 설치',
    manualBody: 'Chrome 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요.',
    installing: '설치 중...',
    fasterAccess: '빠른 접속',
    fasterAccessBody: '홈 화면에서 Shadow를 바로 열 수 있습니다.',
    smootherReading: '부드러운 읽기',
    smootherReadingBody: '앱처럼 깔끔한 읽기 환경을 이용하세요.',
    installedTitle: 'Shadow 준비 완료',
    installedBody: 'Shadow가 이 기기에 이미 설치되어 있습니다.',
    openShadow: 'Shadow 열기',
    phoneOnlyTitle: '휴대폰에서 이 페이지를 열어 주세요',
    phoneOnlyBody: '이 설치 페이지는 iPhone과 Android용입니다.',
    close: 'Shadow로 이동',
    browserMenu: '브라우저 메뉴',
  },
})

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function getEnvironment() {
  const ua = window.navigator.userAgent || ''
  const ios =
    /iPad|iPhone|iPod/i.test(ua) ||
    (window.navigator.platform === 'MacIntel' &&
      window.navigator.maxTouchPoints > 1)
  const android = /Android/i.test(ua)
  const inAppBrowser =
    /FBAN|FBAV|FB_IAB|Instagram|Messenger|Telegram|Line\/|TikTok|BytedanceWebview|Twitter/i.test(ua)
  const safari =
    ios &&
    !inAppBrowser &&
    /Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua)
  const chrome =
    android &&
    !inAppBrowser &&
    /Chrome\/\d+/i.test(ua) &&
    !/;\s?wv\)|Version\/4\.0|SamsungBrowser|EdgA|OPR|DuckDuckGo/i.test(ua)

  if (isStandalone()) return 'installed'
  if (ios) return safari ? 'ios-safari' : 'ios-browser'
  if (android) return chrome ? 'android-chrome' : 'android-browser'
  return 'desktop'
}

function copyText(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value).catch(() => fallbackCopy(value))
  }

  return Promise.resolve(fallbackCopy(value))
}

function fallbackCopy(value) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    document.execCommand('copy')
  } catch {}

  document.body.removeChild(textarea)
}

function DeviceBadge({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-2 text-[12px] font-extrabold text-violet-700 dark:text-violet-300">
      <i className={`${icon} text-[14px]`} />
      <span>{label}</span>
    </div>
  )
}

function StepRow({ number, icon, title, body }) {
  return (
    <div className="app-soft flex items-center gap-3 rounded-[18px] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[14px] font-extrabold text-violet-700 dark:text-violet-300">
        {number}
      </div>

      <div className="min-w-0 flex-1">
        <div className="app-title text-[13px] font-extrabold">
          {title}
        </div>
        <p className="app-muted mt-1 text-[11px] leading-[17px]">
          {body}
        </p>
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--shadow-bg-surface)] text-[18px] text-violet-600 shadow-sm ring-1 ring-[var(--shadow-border)] dark:text-violet-300">
        <i className={icon} />
      </div>
    </div>
  )
}

function Benefit({ icon, title, body }) {
  return (
    <div className="flex min-w-0 flex-1 gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[var(--shadow-bg-surface)] text-[17px] text-violet-600 shadow-sm ring-1 ring-[var(--shadow-border)] dark:text-violet-300">
        <i className={icon} />
      </div>
      <div className="min-w-0">
        <div className="app-title text-[12px] font-extrabold">{title}</div>
        <p className="app-muted mt-1 text-[10.5px] leading-[16px]">{body}</p>
      </div>
    </div>
  )
}

export default function InstallPage() {
  const { t } = useDisplayTranslation()
  const environment = useMemo(() => getEnvironment(), [])
  const [promptReady, setPromptReady] = useState(
    Boolean(window.__shadowInstallPrompt)
  )
  const [promptWaitDone, setPromptWaitDone] = useState(false)
  const [manualChromeHelp, setManualChromeHelp] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [installed, setInstalled] = useState(environment === 'installed')
  const [safariFallback, setSafariFallback] = useState(false)

  useEffect(() => {
    const ready = () => setPromptReady(Boolean(window.__shadowInstallPrompt))
    const done = () => {
      setPromptReady(false)
      setInstalling(false)
      setInstalled(true)
    }

    window.addEventListener('shadow-install-ready', ready)
    window.addEventListener('shadow-app-installed', done)

    const timer = window.setTimeout(() => setPromptWaitDone(true), 1800)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('shadow-install-ready', ready)
      window.removeEventListener('shadow-app-installed', done)
    }
  }, [])

  const openSafari = async () => {
    const target = new URL(window.location.href)
    target.searchParams.set('browser', 'safari')
    target.hash = ''

    await copyText(target.href)

    const safariUrl = target.href.replace(/^https?:\/\//i, 'x-safari-https://')

    window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setSafariFallback(true)
      }
    }, 900)

    try {
      window.location.assign(safariUrl)
    } catch {
      setSafariFallback(true)
    }
  }

  const openChrome = () => {
    const target = new URL(window.location.href)
    target.searchParams.set('browser', 'chrome')
    target.hash = ''

    const intentTarget = target.href.replace(/^https?:\/\//i, '')
    const fallbackUrl = encodeURIComponent(target.href)

    window.location.href =
      `intent://${intentTarget}#Intent;scheme=https;package=com.android.chrome;` +
      `S.browser_fallback_url=${fallbackUrl};end`
  }

  const installShadow = async () => {
    const promptEvent = window.__shadowInstallPrompt

    if (!promptEvent) {
      setManualChromeHelp(true)
      return
    }

    window.__shadowInstallPrompt = null
    setPromptReady(false)
    setInstalling(true)

    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice

      if (choice?.outcome !== 'accepted') {
        setInstalling(false)
        setManualChromeHelp(true)
      }
    } catch {
      setInstalling(false)
      setManualChromeHelp(true)
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  const isIOS = environment === 'ios-browser' || environment === 'ios-safari'
  const subtitle = isIOS
    ? t('installPage.subtitleIOS')
    : t('installPage.subtitleAndroid')

  if (installed) {
    return (
      <PageShell className="px-4 py-6">
        <main className="mx-auto max-w-[430px]">
          <div className="mb-4 flex justify-end">
            <DisplayLanguageMenu />
          </div>
          <div className="flex min-h-[calc(100vh-116px)] items-center">
          <section className="app-card w-full rounded-[28px] border p-6 text-center shadow-[var(--shadow-shadow)]">
            <img
              src="/assets/Icons/Shadow%20Logo.svg"
              alt="Shadow"
              className="mx-auto h-20 w-20 object-contain"
            />
            <div className="mt-5">
              <DeviceBadge
                icon="fa-solid fa-circle-check"
                label={t('installPage.installedDetected')}
              />
            </div>
            <h1 className="app-title mt-5 text-[26px] font-extrabold tracking-tight">
              {t('installPage.installedTitle')}
            </h1>
            <p className="app-muted mx-auto mt-2 max-w-[300px] text-[13px] leading-6">
              {t('installPage.installedBody')}
            </p>
            <button
              type="button"
              onClick={goHome}
              className="mt-6 h-12 w-full rounded-[16px] bg-[var(--shadow-text-primary)] text-[14px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
            >
              {t('installPage.openShadow')}
            </button>
          </section>
          </div>
        </main>
      </PageShell>
    )
  }

  if (environment === 'desktop') {
    return (
      <PageShell className="px-4 py-6">
        <main className="mx-auto max-w-[430px]">
          <div className="mb-4 flex justify-end">
            <DisplayLanguageMenu />
          </div>
          <div className="flex min-h-[calc(100vh-116px)] items-center">
          <section className="app-card w-full rounded-[28px] border p-6 text-center shadow-[var(--shadow-shadow)]">
            <img
              src="/assets/Icons/Shadow%20Logo.svg"
              alt="Shadow"
              className="mx-auto h-20 w-20 object-contain"
            />
            <h1 className="app-title mt-5 text-[24px] font-extrabold">
              {t('installPage.phoneOnlyTitle')}
            </h1>
            <p className="app-muted mt-2 text-[13px] leading-6">
              {t('installPage.phoneOnlyBody')}
            </p>
            <button
              type="button"
              onClick={goHome}
              className="mt-6 h-12 w-full rounded-[16px] bg-[var(--shadow-text-primary)] text-[14px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
            >
              {t('installPage.close')}
            </button>
          </section>
          </div>
        </main>
      </PageShell>
    )
  }

  return (
    <PageShell className="overflow-hidden px-4 pb-8 pt-6">
      <main className="mx-auto max-w-[430px]">
        <div className="mb-3 flex justify-end">
          <DisplayLanguageMenu />
        </div>

        <header className="text-center">
          <img
            src="/assets/Icons/Shadow%20Logo.svg"
            alt="Shadow"
            className="mx-auto h-20 w-20 object-contain"
          />

          <h1 className="app-title mt-4 text-[30px] font-extrabold tracking-tight">
            {t('installPage.title')}
          </h1>

          <p className="app-muted mx-auto mt-2 max-w-[360px] text-[13px] leading-6">
            {subtitle}
          </p>
        </header>

        {environment === 'ios-browser' ? (
          <>
            <section className="app-card mt-6 rounded-[28px] border p-5 shadow-[var(--shadow-shadow)]">
              <div className="flex items-center justify-between gap-3">
                <DeviceBadge
                  icon="fa-solid fa-mobile-screen-button"
                  label={t('installPage.iphoneDetected')}
                />
                <span className="app-muted text-[11px] font-semibold">
                  {t('installPage.stepOne')}
                </span>
              </div>

              <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-violet-500/10 text-[44px] text-[#0a84ff] shadow-sm">
                <i className="fa-brands fa-safari" />
              </div>

              <h2 className="app-title mt-5 text-center text-[24px] font-extrabold">
                {t('installPage.openSafariTitle')}
              </h2>

              <p className="app-muted mx-auto mt-2 max-w-[330px] text-center text-[12px] leading-5">
                {t('installPage.openSafariBody')}
              </p>

              <button
                type="button"
                onClick={openSafari}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[var(--shadow-text-primary)] px-4 text-[14px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[13px]" />
                <span>{t('installPage.openSafari')}</span>
              </button>

              <p className="app-muted mt-3 text-center text-[11px]">
                {safariFallback
                  ? t('installPage.copied')
                  : t('installPage.safariNext')}
              </p>
            </section>

            <section className="mt-4 flex items-center gap-3 rounded-[22px] bg-violet-500/10 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--shadow-bg-surface)] text-[16px] text-[var(--shadow-text-primary)] shadow-sm">
                <i className="fa-solid fa-ellipsis" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300">
                  {t('installPage.help')}
                </div>
                <p className="app-title mt-1 text-[11.5px] font-semibold leading-5">
                  {t('installPage.safariHelp')}
                </p>
              </div>
            </section>
          </>
        ) : null}

        {environment === 'ios-safari' ? (
          <section className="app-card mt-6 rounded-[28px] border p-5 shadow-[var(--shadow-shadow)]">
            <div className="flex items-center justify-between gap-3">
              <DeviceBadge
                icon="fa-brands fa-safari"
                label={t('installPage.safariDetected')}
              />
              <span className="app-muted text-[11px] font-semibold">
                {t('installPage.stepTwo')}
              </span>
            </div>

            <h2 className="app-title mt-5 text-center text-[23px] font-extrabold">
              {t('installPage.addHomeTitle')}
            </h2>

            <p className="app-muted mt-2 text-center text-[12px] leading-5">
              {t('installPage.almostDone')}
            </p>

            <div className="mt-5 space-y-3">
              <StepRow
                number="1"
                icon="fa-solid fa-arrow-up-from-bracket"
                title={t('installPage.tapShare')}
                body={t('installPage.tapShareBody')}
              />
              <StepRow
                number="2"
                icon="fa-regular fa-square-plus"
                title={t('installPage.chooseHome')}
                body={t('installPage.chooseHomeBody')}
              />
              <StepRow
                number="3"
                icon="fa-solid fa-plus"
                title={t('installPage.tapAdd')}
                body={t('installPage.tapAddBody')}
              />
            </div>

            <button
              type="button"
              onClick={goHome}
              className="mt-5 h-12 w-full rounded-[16px] bg-[var(--shadow-text-primary)] text-[14px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
            >
              {t('installPage.gotIt')}
            </button>
          </section>
        ) : null}

        {environment === 'android-browser' ? (
          <>
            <section className="app-card mt-6 rounded-[28px] border p-5 shadow-[var(--shadow-shadow)]">
              <div className="flex items-center justify-between gap-3">
                <DeviceBadge
                  icon="fa-brands fa-android"
                  label={t('installPage.androidDetected')}
                />
                <span className="app-muted text-[11px] font-semibold">
                  {t('installPage.stepOne')}
                </span>
              </div>

              <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-violet-500/10 text-[44px] shadow-sm">
                <i className="fa-brands fa-chrome" />
              </div>

              <h2 className="app-title mt-5 text-center text-[24px] font-extrabold">
                {t('installPage.openChromeTitle')}
              </h2>

              <p className="app-muted mx-auto mt-2 max-w-[330px] text-center text-[12px] leading-5">
                {t('installPage.openChromeBody')}
              </p>

              <button
                type="button"
                onClick={openChrome}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[var(--shadow-text-primary)] px-4 text-[14px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99]"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[13px]" />
                <span>{t('installPage.openChrome')}</span>
              </button>

              <p className="app-muted mt-3 text-center text-[11px]">
                {t('installPage.chromeNext')}
              </p>
            </section>

            <section className="mt-4 flex items-center gap-3 rounded-[22px] bg-violet-500/10 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--shadow-bg-surface)] text-[16px] text-[var(--shadow-text-primary)] shadow-sm">
                <i className="fa-solid fa-ellipsis-vertical" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300">
                  {t('installPage.help')}
                </div>
                <p className="app-title mt-1 text-[11.5px] font-semibold leading-5">
                  {t('installPage.chromeHelp')}
                </p>
              </div>
            </section>
          </>
        ) : null}

        {environment === 'android-chrome' ? (
          <>
            <section className="app-card mt-6 rounded-[28px] border p-5 shadow-[var(--shadow-shadow)]">
              <div className="flex items-center justify-between gap-3">
                <DeviceBadge
                  icon="fa-brands fa-chrome"
                  label={t('installPage.chromeDetected')}
                />
                <span className="app-muted text-[11px] font-semibold">
                  {t('installPage.stepTwo')}
                </span>
              </div>

              <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
                <img
                  src="/assets/Icons/shadow-icon-192.png"
                  alt="Shadow"
                  className="h-full w-full rounded-[22px] object-cover"
                />
              </div>

              <h2 className="app-title mt-5 text-center text-[24px] font-extrabold">
                {manualChromeHelp
                  ? t('installPage.manualTitle')
                  : t('installPage.installNowTitle')}
              </h2>

              <p className="app-muted mx-auto mt-2 max-w-[330px] text-center text-[12px] leading-5">
                {manualChromeHelp
                  ? t('installPage.manualBody')
                  : t('installPage.installNowBody')}
              </p>

              <button
                type="button"
                onClick={installShadow}
                disabled={installing || (!promptReady && !promptWaitDone)}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[var(--shadow-text-primary)] px-4 text-[14px] font-extrabold text-[var(--shadow-bg-page)] active:scale-[0.99] disabled:opacity-60"
              >
                <i className="fa-solid fa-download text-[13px]" />
                <span>
                  {installing
                    ? t('installPage.installing')
                    : !promptReady && !promptWaitDone
                      ? t('installPage.preparing')
                      : t('installPage.install')}
                </span>
              </button>

              <p className="app-muted mt-3 text-center text-[11px]">
                {manualChromeHelp
                  ? t('installPage.manualBody')
                  : t('installPage.promptNote')}
              </p>
            </section>

            <section className="mt-4 flex gap-4 rounded-[22px] bg-violet-500/10 p-4">
              <Benefit
                icon="fa-solid fa-bolt"
                title={t('installPage.fasterAccess')}
                body={t('installPage.fasterAccessBody')}
              />
              <div className="w-px shrink-0 bg-[var(--shadow-border)]" />
              <Benefit
                icon="fa-solid fa-book-open"
                title={t('installPage.smootherReading')}
                body={t('installPage.smootherReadingBody')}
              />
            </section>
          </>
        ) : null}
      </main>
    </PageShell>
  )
}
