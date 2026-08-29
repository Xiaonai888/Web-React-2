import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import PaymentProfileModal from '../components/Wallet/PaymentProfileModal'

registerTranslationNamespace('walletPage', {
  en: {
    diamond: 'Diamond',
    coin: 'Coin',
    paymentProfile: 'Payment Profile',
    paymentProfileHelp: 'Use the same name as your payment account.',
    example: 'Example: KEO DARIYA / DARIYA KEO',
    paymentAccountName: 'Payment account name',
    saving: 'Saving...',
    save: 'Save',
    cancel: 'Cancel',
    loadFailed: 'Failed to load wallet.',
    saveProfileFailed: 'Failed to save payment profile.',
    profileSaved: 'Payment profile saved.',
    goBack: 'Go back',
    wallet: 'Wallet',
    diamonds: 'Diamonds',
    coins: 'Coins',
    earn: 'Earn',
    topUp: 'Top-Up',
    readingBenefits: 'Reading Benefits',
    readingVouchers: 'Reading Vouchers',
    voucherHelp: 'Unlock 1 episode permanently',
    freeBookPass: 'Free Book Pass',
    bookPassHelp: 'Unlock 1 completed story permanently',
    bookPassNextStep: 'Free Book Pass selection will be connected in the next step.',
    useNow: 'Use Now',
    orderHistory: 'Order History',
  },
  km: {
    diamond: 'Diamond',
    coin: 'Coin',
    paymentProfile: 'ព័ត៌មានការទូទាត់',
    paymentProfileHelp: 'ប្រើឈ្មោះដូចគ្នានឹងគណនីទទួលការទូទាត់របស់អ្នក។',
    example: 'ឧទាហរណ៍៖ KEO DARIYA / DARIYA KEO',
    paymentAccountName: 'ឈ្មោះគណនីទទួលការទូទាត់',
    saving: 'កំពុងរក្សាទុក...',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    loadFailed: 'មិនអាចផ្ទុក Wallet បានទេ។',
    saveProfileFailed: 'មិនអាចរក្សាទុកព័ត៌មានការទូទាត់បានទេ។',
    profileSaved: 'បានរក្សាទុកព័ត៌មានការទូទាត់។',
    goBack: 'ត្រឡប់ក្រោយ',
    wallet: 'Wallet',
    diamonds: 'Diamonds',
    coins: 'Coins',
    earn: 'រក Coin',
    topUp: 'បញ្ចូលបន្ថែម',
    readingBenefits: 'អត្ថប្រយោជន៍សម្រាប់ការអាន',
    readingVouchers: 'Voucher សម្រាប់អាន',
    voucherHelp: 'ដោះសោ 1 ភាគជាអចិន្ត្រៃយ៍',
    freeBookPass: 'Free Book Pass',
    bookPassHelp: 'ដោះសោរឿងដែលបានបញ្ចប់ 1 រឿងជាអចិន្ត្រៃយ៍',
    bookPassNextStep: 'ការជ្រើសរើស Free Book Pass នឹងត្រូវភ្ជាប់នៅដំណាក់កាលបន្ទាប់។',
    useNow: 'ប្រើឥឡូវនេះ',
    orderHistory: 'ប្រវត្តិការបញ្ជាទិញ',
  },
  zh: {
    diamond: 'Diamond',
    coin: 'Coin',
    paymentProfile: '付款资料',
    paymentProfileHelp: '请使用与你的收款账户相同的姓名。',
    example: '示例：KEO DARIYA / DARIYA KEO',
    paymentAccountName: '收款账户姓名',
    saving: '保存中...',
    save: '保存',
    cancel: '取消',
    loadFailed: '无法加载 Wallet。',
    saveProfileFailed: '无法保存付款资料。',
    profileSaved: '付款资料已保存。',
    goBack: '返回',
    wallet: 'Wallet',
    diamonds: 'Diamonds',
    coins: 'Coins',
    earn: '赚取',
    topUp: '充值',
    readingBenefits: '阅读权益',
    readingVouchers: '阅读 Voucher',
    voucherHelp: '永久解锁 1 集',
    freeBookPass: 'Free Book Pass',
    bookPassHelp: '永久解锁 1 个已完结故事',
    bookPassNextStep: 'Free Book Pass 的选择功能将在下一步连接。',
    useNow: '立即使用',
    orderHistory: '订单历史',
  },
  ja: {
    diamond: 'Diamond',
    coin: 'Coin',
    paymentProfile: '支払いプロフィール',
    paymentProfileHelp: '受取口座と同じ名前を使用してください。',
    example: '例：KEO DARIYA / DARIYA KEO',
    paymentAccountName: '受取口座名',
    saving: '保存中...',
    save: '保存',
    cancel: 'キャンセル',
    loadFailed: 'Walletを読み込めませんでした。',
    saveProfileFailed: '支払いプロフィールを保存できませんでした。',
    profileSaved: '支払いプロフィールを保存しました。',
    goBack: '戻る',
    wallet: 'Wallet',
    diamonds: 'Diamonds',
    coins: 'Coins',
    earn: '獲得',
    topUp: 'チャージ',
    readingBenefits: '読書特典',
    readingVouchers: '読書 Voucher',
    voucherHelp: '1エピソードを永久にアンロック',
    freeBookPass: 'Free Book Pass',
    bookPassHelp: '完結ストーリー1作品を永久にアンロック',
    bookPassNextStep: 'Free Book Pass の選択機能は次のステップで接続されます。',
    useNow: '今すぐ使う',
    orderHistory: '注文履歴',
  },
  ko: {
    diamond: 'Diamond',
    coin: 'Coin',
    paymentProfile: '결제 프로필',
    paymentProfileHelp: '지급 계정과 동일한 이름을 사용하세요.',
    example: '예: KEO DARIYA / DARIYA KEO',
    paymentAccountName: '지급 계정 이름',
    saving: '저장 중...',
    save: '저장',
    cancel: '취소',
    loadFailed: 'Wallet을 불러오지 못했습니다.',
    saveProfileFailed: '결제 프로필을 저장하지 못했습니다.',
    profileSaved: '결제 프로필을 저장했습니다.',
    goBack: '뒤로 가기',
    wallet: 'Wallet',
    diamonds: 'Diamonds',
    coins: 'Coins',
    earn: '적립',
    topUp: '충전',
    readingBenefits: '읽기 혜택',
    readingVouchers: '읽기 Voucher',
    voucherHelp: '에피소드 1개 영구 잠금 해제',
    freeBookPass: 'Free Book Pass',
    bookPassHelp: '완결 스토리 1개 영구 잠금 해제',
    bookPassNextStep: 'Free Book Pass 선택 기능은 다음 단계에서 연결됩니다.',
    useNow: '지금 사용',
    orderHistory: '주문 내역',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function DiamondIcon() {
  const { t } = useDisplayTranslation()

  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt={t('walletPage.diamond')}
      className="h-8 w-8 object-contain"
    />
  )
}

function CoinIcon() {
  const { t } = useDisplayTranslation()

  return (
    <img
      src="/assets/Icons/Shadow Coin.svg"
      alt={t('walletPage.coin')}
      className="h-8 w-8 object-contain"
    />
  )
}

function VoucherIcon() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0E8FF] text-[#6D28D9] dark:bg-violet-500/15 dark:text-violet-300">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden="true">
        <path d="M4 6.5h16v4a2.5 2.5 0 0 0 0 5v4H4v-4a2.5 2.5 0 0 0 0-5v-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="1.5 2.5" />
      </svg>
    </span>
  )
}

function BookPassIcon() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0EA] dark:bg-rose-500/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#FF765F] to-[#FF3F7D] text-white">
        <i className="fas fa-book-open text-[18px]" />
      </span>
    </span>
  )
}

function OrderHistoryIcon() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#F0E8FF] text-[#6D28D9] dark:bg-violet-500/15 dark:text-violet-300">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none" aria-hidden="true">
        <path d="M9 5.5h6M9.5 4h5a1 1 0 0 1 1 1v1H8.5V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 6h10a2 2 0 0 1 2 2v11H5V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.5 11h7M8.5 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function EarnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none" aria-hidden="true">
      <path d="M12 3.5l1.65 3.35 3.7.54-2.68 2.61.63 3.69L12 11.95 8.7 13.69l.63-3.69-2.68-2.61 3.7-.54L12 3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 16.5h14M7 20h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function TopUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-none" aria-hidden="true">
      <path d="M14 5h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14V3m0 0L8.5 6.5M12 3l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


export default function WalletPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [wallet, setWallet] = useState(null)
  const [paymentName, setPaymentName] = useState('')
  const [showPaymentProfileModal, setShowPaymentProfileModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadWallet() {
    if (!getReaderToken()) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')
      const [walletResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase/wallet`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/api/users/me`, { headers: getHeaders() }),
      ])
      const walletData = await walletResponse.json().catch(() => ({}))
      const userData = await userResponse.json().catch(() => ({}))
      if (walletData.ok) setWallet(walletData.wallet)
      if (userData.ok && userData.user) {
  const nextName = userData.user.payment_account_name || ''
  setPaymentName(nextName)
}
    } catch {
      setMessage(t('walletPage.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  function openPaymentProfileModal() {
  setShowPaymentProfileModal(true)
}



  useEffect(() => {
    loadWallet()
  }, [])

  const voucherBalance = Number(wallet?.voucher_balance || 0)
  const bookPassBalance = Number(wallet?.story_card_balance || 0)

  return (
    <div className="app-page min-h-screen pb-8">
      <header className="app-nav sticky top-0 z-40 border-b shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate('/me', { replace: true })}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--shadow-bg-soft)]"
            aria-label={t('walletPage.goBack')}
          >
            <i className="fas fa-chevron-left text-[18px] text-[var(--shadow-text-primary)]" />
          </button>
          <h1 className="app-title flex-1 text-[18px] font-bold tracking-tight">
            {t('walletPage.wallet')}
          </h1>
          <button
            type="button"
            onClick={openPaymentProfileModal}
            className="app-card app-muted relative flex h-9 w-9 items-center justify-center rounded-full border active:scale-95"
            aria-label={t('walletPage.paymentProfile')}
          >
            <i className="fas fa-user text-[14px]" />
            {!paymentName ? (
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-[var(--shadow-bg-surface)] bg-[#F59E0B]" />
            ) : null}
          </button>
        </div>
      </header>

      <main className="space-y-5 px-3 pt-4 sm:px-4">
        <section className="rounded-[20px] bg-[#F3EEFF] p-3 dark:bg-violet-500/10">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 px-1 py-2">
              <span className="app-card flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <DiamondIcon />
              </span>
              <div className="min-w-0">
                <p className="app-title text-[12px] font-bold">
                  {t('walletPage.diamonds')}
                </p>
                <p className="app-title mt-1 text-[24px] font-bold leading-none">
                  {loading ? '...' : formatNumber(wallet?.diamond_balance)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1 py-2">
              <span className="app-card flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <CoinIcon />
              </span>
              <div className="min-w-0">
                <p className="app-title text-[12px] font-bold">
                  {t('walletPage.coins')}
                </p>
                <p className="app-title mt-1 text-[24px] font-bold leading-none">
                  {loading
                    ? '...'
                    : formatNumber(
                        wallet?.coin_balance ?? wallet?.gem_balance
                      )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="app-card flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold active:scale-[0.98]"
            >
              <EarnIcon />
              <span>{t('walletPage.earn')}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                navigate('/shop/mall/purchase', {
                  state: { returnTo: '/wallet' },
                })
              }
              className="app-card flex h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold active:scale-[0.98]"
            >
              <TopUpIcon />
              <span>{t('walletPage.topUp')}</span>
            </button>
          </div>
        </section>

        <section>
          <h2 className="app-title mb-3 text-[17px] font-bold">
            {t('walletPage.readingBenefits')}
          </h2>

          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="app-soft flex w-full items-center gap-3 rounded-[18px] p-4 text-left active:scale-[0.99]"
          >
            <VoucherIcon />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <p className="app-title text-[14px] font-normal">
                  {t('walletPage.readingVouchers')}
                </p>
                <span className="text-[15px] font-bold text-[#6D28D9] dark:text-violet-300">
                  {loading ? '...' : formatNumber(voucherBalance)}
                </span>
              </div>
              <p className="app-muted mt-1 text-[11px] font-medium">
                {t('walletPage.voucherHelp')}
              </p>
            </div>
            <i className="fas fa-chevron-right text-[12px] text-[var(--shadow-text-tertiary)]" />
          </button>

          <div className="relative mt-4 overflow-hidden rounded-[20px] bg-gradient-to-br from-[#FFF9F7] via-[#FFF0EA] to-[#FFE8E4] p-4 dark:from-rose-500/10 dark:via-orange-500/10 dark:to-pink-500/10">
            <img
              src="/assets/Icons/Openbook.webp"
              alt=""
              className="pointer-events-none absolute -bottom-5 -right-2 w-[125px] select-none object-contain opacity-35"
            />
            <div className="absolute right-10 top-5 text-[12px] text-[#8B5CF6]">
              ✦
            </div>
            <div className="absolute right-5 top-4 text-[13px] text-[#FF5B5B]">
              ✦
            </div>
            <div className="relative flex items-start gap-3">
              <BookPassIcon />
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-baseline gap-1.5">
                  <p className="app-title text-[18px] font-bold">
                    {t('walletPage.freeBookPass')}
                  </p>
                  <span className="text-[16px] font-bold text-[#FF4D5F] dark:text-rose-300">
                    {loading ? '...' : formatNumber(bookPassBalance)}
                  </span>
                </div>
                <p className="app-muted mt-1 text-[11px] font-medium leading-5">
                  {t('walletPage.bookPassHelp')}
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={bookPassBalance < 1}
              onClick={() =>
                setMessage(t('walletPage.bookPassNextStep'))
              }
              className="relative mt-4 h-11 w-full rounded-full bg-gradient-to-r from-[#FF6B57] to-[#FF3F7D] text-[14px] font-bold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t('walletPage.useNow')}
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/wallet/orders')}
          className="app-soft flex h-[62px] w-full items-center gap-3 rounded-[18px] px-4 text-left active:scale-[0.99]"
        >
          <OrderHistoryIcon />
          <span className="app-title flex-1 text-[14px] font-normal">
            {t('walletPage.orderHistory')}
          </span>
          <i className="fas fa-chevron-right text-[13px] text-[#6D28D9] dark:text-violet-300" />
        </button>

        {message ? (
          <p className="app-title text-center text-[12px] font-bold">
            {message}
          </p>
        ) : null}
      </main>

      {showPaymentProfileModal ? (
  <PaymentProfileModal
    initialValue={paymentName}
    onClose={() => setShowPaymentProfileModal(false)}
    onSaved={(savedUser) => {
      const nextName = String(savedUser?.payment_account_name || '').trim()
      setPaymentName(nextName)
      setShowPaymentProfileModal(false)
      setMessage(t('walletPage.profileSaved'))
    }}
  />
) : null}
    </div>
  )
}
