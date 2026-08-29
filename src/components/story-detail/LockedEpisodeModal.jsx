import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('lockedEpisodeModal', {
  en: {
    autoUnlockHint: 'Auto-unlock with Diamonds only. Free methods like Coins, Vouchers, or Story Cards won’t apply.',
    singleEpisode: '1 Episode',
    next10Episodes: 'Next 10 Eps',
    next30Episodes: 'Next 30 Eps',
    next50Episodes: 'Next 50 Eps',
    allReleasedEpisodes: 'All Released Episodes',
    next10Unavailable: 'This story does not have 10 locked released episodes available from this point.',
    next30Unavailable: 'This story does not have 30 locked released episodes available from this point.',
    next50Unavailable: 'This story does not have 50 locked released episodes available from this point.',
    allReleasedUnavailable: 'All Released Episodes works when the story has more than 70 released locked episodes or the story is completed.',
    off: '{{count}}% Off',
    access: 'Access',
    unlocking: 'Unlocking...',
    loginToUnlock: 'Login to Unlock',
    packageUnavailable: 'Package unavailable',
    topUpDiamonds: 'Top Up Diamonds',
    purchase: 'Purchase',
    loginRequired: 'Please login to unlock this episode.',
    checkStatusFailed: 'Failed to check unlock status',
    cannotConnect: 'Cannot connect to backend.',
    packageNotAvailable: 'This package is not available.',
    notEnoughDiamonds: 'Not enough Diamonds. Need {{count}} more.',
    unlockFailed: 'Failed to unlock episodes',
    notEnoughCoins: 'Not enough Coins. Need {{count}} more.',
    unlockCoinsFailed: 'Failed to unlock with Coins',
    unlockGemsFailed: 'Failed to unlock with Gems',
    close: 'Close',
    unlockEpisode: 'Unlock Episode',
    instantAccess: 'Instant Access',
    freeAccess: 'Free Access',
    premiumDiscount: 'Enjoy 10% off every episode you unlock.',
    balanceChecking: 'Balance: Checking...',
    balanceDiamonds: 'Balance: {{count}} Diamonds',
    autoUnlockInfo: 'Auto unlock info',
    autoUnlock: 'Auto Unlock',
    needMoreDiamonds: 'Need {{count}} more Diamonds to unlock this package.',
    freeUnlock: 'Free Unlock',
    earnMore: 'Earn more from tasks & events',
    watchAdsComingSoon: 'Watch Ads — Coming soon',
    watchAdsHelp: 'Unlock for one read only. After you leave or finish reading, this episode will lock again.',
    watch: 'Watch',
    coinsRemaining: 'Coins — {{count}} remaining',
    accessDays: 'Access lasts {{count}} days.',
    notEnough: 'Not enough',
    vouchersComingSoon: 'Vouchers — Coming soon',
    vouchersHelp: 'Permanent unlock will be added later.',
    storyCardsComingSoon: 'Story Cards — Coming soon',
    storyCardsHelp: 'Permanent unlock for same story only.',
    useDiamondsInstead: 'Use Diamonds Instead',
  },
  km: {
    autoUnlockHint: 'Auto Unlock ប្រើតែ Diamond ប៉ុណ្ណោះ។ វិធីឥតគិតថ្លៃដូចជា Coin, Voucher ឬ Story Card នឹងមិនត្រូវបានប្រើទេ។',
    singleEpisode: '1 ភាគ',
    next10Episodes: '10 ភាគបន្ទាប់',
    next30Episodes: '30 ភាគបន្ទាប់',
    next50Episodes: '50 ភាគបន្ទាប់',
    allReleasedEpisodes: 'ភាគដែលបានចេញទាំងអស់',
    next10Unavailable: 'ចាប់ពីចំណុចនេះ រឿងនេះមិនមានភាគដែលបានចេញ និងជាប់សោចំនួន 10 ភាគទេ។',
    next30Unavailable: 'ចាប់ពីចំណុចនេះ រឿងនេះមិនមានភាគដែលបានចេញ និងជាប់សោចំនួន 30 ភាគទេ។',
    next50Unavailable: 'ចាប់ពីចំណុចនេះ រឿងនេះមិនមានភាគដែលបានចេញ និងជាប់សោចំនួន 50 ភាគទេ។',
    allReleasedUnavailable: 'ជម្រើសភាគដែលបានចេញទាំងអស់ អាចប្រើបាននៅពេលរឿងមានភាគដែលបានចេញ និងជាប់សោលើស 70 ភាគ ឬរឿងបានបញ្ចប់។',
    off: 'បញ្ចុះ {{count}}%',
    access: 'ចូលអាន',
    unlocking: 'កំពុងដោះសោ...',
    loginToUnlock: 'ចូលគណនីដើម្បីដោះសោ',
    packageUnavailable: 'Package មិនអាចប្រើបាន',
    topUpDiamonds: 'បញ្ចូល Diamond',
    purchase: 'ទិញ',
    loginRequired: 'សូមចូលគណនីដើម្បីដោះសោភាគនេះ។',
    checkStatusFailed: 'មិនអាចពិនិត្យស្ថានភាពដោះសោបាន',
    cannotConnect: 'មិនអាចភ្ជាប់ទៅ Backend បាន។',
    packageNotAvailable: 'Package នេះមិនអាចប្រើបានទេ។',
    notEnoughDiamonds: 'Diamond មិនគ្រប់។ ត្រូវការ {{count}} បន្ថែម។',
    unlockFailed: 'មិនអាចដោះសោភាគបាន',
    notEnoughCoins: 'Coin មិនគ្រប់។ ត្រូវការ {{count}} បន្ថែម។',
    unlockCoinsFailed: 'មិនអាចដោះសោដោយ Coin បាន',
    unlockGemsFailed: 'មិនអាចដោះសោដោយ Gem បាន',
    close: 'បិទ',
    unlockEpisode: 'ដោះសោភាគ',
    instantAccess: 'ដោះសោភ្លាមៗ',
    freeAccess: 'ដោះសោឥតគិតថ្លៃ',
    premiumDiscount: 'ទទួលបានការបញ្ចុះ 10% រាល់ភាគដែលអ្នកដោះសោ។',
    balanceChecking: 'សមតុល្យ៖ កំពុងពិនិត្យ...',
    balanceDiamonds: 'សមតុល្យ៖ {{count}} Diamond',
    autoUnlockInfo: 'ព័ត៌មាន Auto Unlock',
    autoUnlock: 'Auto Unlock',
    needMoreDiamonds: 'ត្រូវការ Diamond {{count}} បន្ថែម ដើម្បីដោះសោ Package នេះ។',
    freeUnlock: 'ដោះសោឥតគិតថ្លៃ',
    earnMore: 'រកបន្ថែមពី Task និង Event',
    watchAdsComingSoon: 'មើល Ads — មកដល់ឆាប់ៗ',
    watchAdsHelp: 'ដោះសោសម្រាប់អានម្តងប៉ុណ្ណោះ។ បន្ទាប់ពីចាកចេញ ឬអានចប់ ភាគនេះនឹងជាប់សោវិញ។',
    watch: 'មើល',
    coinsRemaining: 'Coin — នៅសល់ {{count}}',
    accessDays: 'អាចចូលអានបាន {{count}} ថ្ងៃ។',
    notEnough: 'មិនគ្រប់',
    vouchersComingSoon: 'Voucher — មកដល់ឆាប់ៗ',
    vouchersHelp: 'ការដោះសោជាអចិន្ត្រៃយ៍នឹងបន្ថែមនៅពេលក្រោយ។',
    storyCardsComingSoon: 'Story Card — មកដល់ឆាប់ៗ',
    storyCardsHelp: 'ដោះសោជាអចិន្ត្រៃយ៍សម្រាប់រឿងដូចគ្នាប៉ុណ្ណោះ។',
    useDiamondsInstead: 'ប្រើ Diamond ជំនួស',
  },
  zh: {
    autoUnlockHint: '自动解锁仅使用 Diamonds。Coins、Vouchers 或 Story Cards 等免费方式不会被使用。',
    singleEpisode: '1 章',
    next10Episodes: '接下来 10 章',
    next30Episodes: '接下来 30 章',
    next50Episodes: '接下来 50 章',
    allReleasedEpisodes: '全部已发布章节',
    next10Unavailable: '从当前位置开始，没有 10 个已发布且锁定的章节可供解锁。',
    next30Unavailable: '从当前位置开始，没有 30 个已发布且锁定的章节可供解锁。',
    next50Unavailable: '从当前位置开始，没有 50 个已发布且锁定的章节可供解锁。',
    allReleasedUnavailable: '当故事有超过 70 个已发布且锁定的章节，或故事已完结时，才可使用全部已发布章节。',
    off: '优惠 {{count}}%',
    access: '访问',
    unlocking: '正在解锁...',
    loginToUnlock: '登录后解锁',
    packageUnavailable: '套餐不可用',
    topUpDiamonds: '充值 Diamonds',
    purchase: '购买',
    loginRequired: '请登录后解锁此章节。',
    checkStatusFailed: '无法检查解锁状态',
    cannotConnect: '无法连接后端。',
    packageNotAvailable: '此套餐当前不可用。',
    notEnoughDiamonds: 'Diamonds 不足。还需要 {{count}}。',
    unlockFailed: '解锁章节失败',
    notEnoughCoins: 'Coins 不足。还需要 {{count}}。',
    unlockCoinsFailed: '无法使用 Coins 解锁',
    unlockGemsFailed: '无法使用 Gems 解锁',
    close: '关闭',
    unlockEpisode: '解锁章节',
    instantAccess: '立即解锁',
    freeAccess: '免费解锁',
    premiumDiscount: '每次解锁章节均可享受 10% 优惠。',
    balanceChecking: '余额：检查中...',
    balanceDiamonds: '余额：{{count}} Diamonds',
    autoUnlockInfo: '自动解锁信息',
    autoUnlock: '自动解锁',
    needMoreDiamonds: '还需要 {{count}} Diamonds 才能解锁此套餐。',
    freeUnlock: '免费解锁',
    earnMore: '通过任务和活动赚取更多',
    watchAdsComingSoon: '观看广告 — 即将推出',
    watchAdsHelp: '仅解锁一次阅读。离开或阅读完成后，此章节将再次锁定。',
    watch: '观看',
    coinsRemaining: 'Coins — 剩余 {{count}}',
    accessDays: '访问权限持续 {{count}} 天。',
    notEnough: '不足',
    vouchersComingSoon: 'Vouchers — 即将推出',
    vouchersHelp: '永久解锁功能稍后推出。',
    storyCardsComingSoon: 'Story Cards — 即将推出',
    storyCardsHelp: '仅可永久解锁同一故事。',
    useDiamondsInstead: '改用 Diamonds',
  },
  ja: {
    autoUnlockHint: '自動解除では Diamonds のみを使用します。Coins、Vouchers、Story Cards などの無料方法は適用されません。',
    singleEpisode: '1エピソード',
    next10Episodes: '次の10エピソード',
    next30Episodes: '次の30エピソード',
    next50Episodes: '次の50エピソード',
    allReleasedEpisodes: '公開済み全エピソード',
    next10Unavailable: 'この位置から利用できる公開済みのロックされたエピソードが10話ありません。',
    next30Unavailable: 'この位置から利用できる公開済みのロックされたエピソードが30話ありません。',
    next50Unavailable: 'この位置から利用できる公開済みのロックされたエピソードが50話ありません。',
    allReleasedUnavailable: '公開済み全エピソードは、公開済みのロックされたエピソードが70話を超える場合、またはストーリーが完結している場合に利用できます。',
    off: '{{count}}% オフ',
    access: 'アクセス',
    unlocking: '解除中...',
    loginToUnlock: 'ログインして解除',
    packageUnavailable: 'パッケージ利用不可',
    topUpDiamonds: 'Diamonds をチャージ',
    purchase: '購入',
    loginRequired: 'このエピソードを解除するにはログインしてください。',
    checkStatusFailed: '解除状態を確認できませんでした',
    cannotConnect: 'バックエンドに接続できません。',
    packageNotAvailable: 'このパッケージは利用できません。',
    notEnoughDiamonds: 'Diamonds が不足しています。あと {{count}} 必要です。',
    unlockFailed: 'エピソードの解除に失敗しました',
    notEnoughCoins: 'Coins が不足しています。あと {{count}} 必要です。',
    unlockCoinsFailed: 'Coins で解除できませんでした',
    unlockGemsFailed: 'Gems で解除できませんでした',
    close: '閉じる',
    unlockEpisode: 'エピソードを解除',
    instantAccess: '即時アクセス',
    freeAccess: '無料アクセス',
    premiumDiscount: '解除するすべてのエピソードが10%オフになります。',
    balanceChecking: '残高：確認中...',
    balanceDiamonds: '残高：{{count}} Diamonds',
    autoUnlockInfo: '自動解除の情報',
    autoUnlock: '自動解除',
    needMoreDiamonds: 'このパッケージの解除にはあと {{count}} Diamonds 必要です。',
    freeUnlock: '無料解除',
    earnMore: 'タスクとイベントでさらに獲得',
    watchAdsComingSoon: '広告を見る — 近日公開',
    watchAdsHelp: '1回の読書のみ解除されます。離れるか読み終えると、このエピソードは再びロックされます。',
    watch: '見る',
    coinsRemaining: 'Coins — 残り {{count}}',
    accessDays: '{{count}}日間アクセスできます。',
    notEnough: '不足',
    vouchersComingSoon: 'Vouchers — 近日公開',
    vouchersHelp: '永久解除は後日追加されます。',
    storyCardsComingSoon: 'Story Cards — 近日公開',
    storyCardsHelp: '同じストーリーのみ永久解除できます。',
    useDiamondsInstead: 'Diamonds を使用',
  },
  ko: {
    autoUnlockHint: '자동 잠금 해제는 Diamonds만 사용합니다. Coins, Vouchers, Story Cards 같은 무료 방식은 적용되지 않습니다.',
    singleEpisode: '에피소드 1개',
    next10Episodes: '다음 10개 에피소드',
    next30Episodes: '다음 30개 에피소드',
    next50Episodes: '다음 50개 에피소드',
    allReleasedEpisodes: '공개된 전체 에피소드',
    next10Unavailable: '현재 지점부터 이용 가능한 공개된 잠금 에피소드가 10개 없습니다.',
    next30Unavailable: '현재 지점부터 이용 가능한 공개된 잠금 에피소드가 30개 없습니다.',
    next50Unavailable: '현재 지점부터 이용 가능한 공개된 잠금 에피소드가 50개 없습니다.',
    allReleasedUnavailable: '공개된 잠금 에피소드가 70개를 초과하거나 스토리가 완결된 경우 전체 공개 에피소드를 이용할 수 있습니다.',
    off: '{{count}}% 할인',
    access: '이용',
    unlocking: '잠금 해제 중...',
    loginToUnlock: '로그인 후 잠금 해제',
    packageUnavailable: '패키지 이용 불가',
    topUpDiamonds: 'Diamonds 충전',
    purchase: '구매',
    loginRequired: '이 에피소드를 잠금 해제하려면 로그인하세요.',
    checkStatusFailed: '잠금 해제 상태를 확인하지 못했습니다',
    cannotConnect: '백엔드에 연결할 수 없습니다.',
    packageNotAvailable: '이 패키지는 이용할 수 없습니다.',
    notEnoughDiamonds: 'Diamonds가 부족합니다. {{count}}개 더 필요합니다.',
    unlockFailed: '에피소드 잠금 해제에 실패했습니다',
    notEnoughCoins: 'Coins가 부족합니다. {{count}}개 더 필요합니다.',
    unlockCoinsFailed: 'Coins로 잠금 해제하지 못했습니다',
    unlockGemsFailed: 'Gems로 잠금 해제하지 못했습니다',
    close: '닫기',
    unlockEpisode: '에피소드 잠금 해제',
    instantAccess: '즉시 이용',
    freeAccess: '무료 이용',
    premiumDiscount: '잠금 해제하는 모든 에피소드에 10% 할인이 적용됩니다.',
    balanceChecking: '잔액: 확인 중...',
    balanceDiamonds: '잔액: {{count}} Diamonds',
    autoUnlockInfo: '자동 잠금 해제 정보',
    autoUnlock: '자동 잠금 해제',
    needMoreDiamonds: '이 패키지를 잠금 해제하려면 Diamonds {{count}}개가 더 필요합니다.',
    freeUnlock: '무료 잠금 해제',
    earnMore: '작업과 이벤트에서 더 획득',
    watchAdsComingSoon: '광고 보기 — 출시 예정',
    watchAdsHelp: '한 번의 읽기만 잠금 해제됩니다. 나가거나 읽기를 마치면 이 에피소드는 다시 잠깁니다.',
    watch: '보기',
    coinsRemaining: 'Coins — {{count}}개 남음',
    accessDays: '{{count}}일 동안 이용할 수 있습니다.',
    notEnough: '부족',
    vouchersComingSoon: 'Vouchers — 출시 예정',
    vouchersHelp: '영구 잠금 해제는 나중에 추가됩니다.',
    storyCardsComingSoon: 'Story Cards — 출시 예정',
    storyCardsHelp: '같은 스토리에만 영구 잠금 해제됩니다.',
    useDiamondsInstead: 'Diamonds 사용',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const FALLBACK_DIAMOND_PRICE = 10
const FALLBACK_GEM_PRICE = 1000
const AUTO_UNLOCK_HINT =
  'Auto-unlock with Diamonds only. Free methods like Coins, Vouchers, or Story Cards won’t apply.'

const PACKAGE_LABEL_KEYS = {
  single: 'singleEpisode',
  next10: 'next10Episodes',
  next30: 'next30Episodes',
  next50: 'next50Episodes',
  all_released: 'allReleasedEpisodes',
}

const FALLBACK_REASON_KEYS = {
  'This story does not have 10 locked released episodes available from this point.': 'next10Unavailable',
  'This story does not have 30 locked released episodes available from this point.': 'next30Unavailable',
  'This story does not have 50 locked released episodes available from this point.': 'next50Unavailable',
  'All Released Episodes works when the story has more than 70 released locked episodes or the story is completed.': 'allReleasedUnavailable',
}

function getPackageLabel(option, t) {
  const key = PACKAGE_LABEL_KEYS[option?.key]
  return key ? t(`lockedEpisodeModal.${key}`) : option?.label
}

function getPackageReason(option, t) {
  const rawReason = option?.disabled_reason || ''
  const key = FALLBACK_REASON_KEYS[rawReason]
  return key ? t(`lockedEpisodeModal.${key}`) : rawReason
}

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function authHeaders() {
  const token = getReaderToken()

  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function buildFallbackPackageOptions(price = FALLBACK_DIAMOND_PRICE) {
  return [
    {
      key: 'single',
      label: '1 Episode',
      requested_count: 1,
      enabled: true,
      discount_percent: 0,
      original_price: price,
      price,
      disabled_reason: '',
    },
    {
      key: 'next10',
      label: 'Next 10 Eps',
      requested_count: 10,
      enabled: false,
      discount_percent: 10,
      original_price: 100,
      price: 90,
      disabled_reason: 'This story does not have 10 locked released episodes available from this point.',
    },
    {
      key: 'next30',
      label: 'Next 30 Eps',
      requested_count: 30,
      enabled: false,
      discount_percent: 20,
      original_price: 300,
      price: 240,
      disabled_reason: 'This story does not have 30 locked released episodes available from this point.',
    },
    {
      key: 'next50',
      label: 'Next 50 Eps',
      requested_count: 50,
      enabled: false,
      discount_percent: 25,
      original_price: 500,
      price: 375,
      disabled_reason: 'This story does not have 50 locked released episodes available from this point.',
    },
    {
      key: 'all_released',
      label: 'All Released Episodes',
      requested_count: 0,
      enabled: false,
      discount_percent: 40,
      original_price: 5000,
      price: 3000,
      disabled_reason: 'All Released Episodes works when the story has more than 70 released locked episodes or the story is completed.',
    },
  ]
}

function DiamondIcon({ size = 'h-7 w-7' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt="Diamond"
      className={`${size} shrink-0 object-contain`}
      loading="lazy"
      decoding="async"
    />
  )
}

function GemIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center ${size}`}>
      <img
        src="/assets/Icons/Shadow Coin.svg"
        alt="Coin"
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}

function VoucherIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#DBEAFE] bg-[#EFF6FF] dark:border-blue-400/20 dark:bg-blue-500/10 ${size}`}>
      <i className="fa-solid fa-ticket text-[20px] text-[#0B5CFF] dark:text-blue-300" />
    </span>
  )
}

function StoryCardIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] ${size}`}>
      <i className="fa-regular fa-address-card text-[21px] text-[var(--shadow-text-primary)]" />
    </span>
  )
}

function VideoIcon({ size = 'h-12 w-12' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[12px] border border-[#DBEAFE] bg-[#EFF6FF] dark:border-blue-400/20 dark:bg-blue-500/10 ${size}`}>
      <i className="fa-solid fa-play text-[18px] text-[#0B5CFF] dark:text-blue-300" />
    </span>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-12 flex-1 text-[15px] font-medium transition ${
        active ? 'text-[var(--shadow-text-primary)]' : 'text-[var(--shadow-text-tertiary)]'
      }`}
    >
      {children}
      {active ? (
        <span className="absolute bottom-0 left-1/2 h-[3px] w-[72%] -translate-x-1/2 rounded-full bg-[#C59B2D]" />
      ) : null}
    </button>
  )
}

function InstantOption({ option, active, onClick }) {
  const { t } = useDisplayTranslation()

  return (
    <button
      type="button"
      disabled={!option.enabled}
      onClick={onClick}
      className={`relative min-h-[88px] rounded-[18px] border bg-[var(--shadow-bg-surface)] px-4 py-3 text-left transition active:scale-[0.99] ${
        active ? 'border-[#C59B2D] shadow-[0_14px_30px_rgba(197,155,45,0.16)]' : 'border-[var(--shadow-border)]'
      } ${!option.enabled ? 'opacity-55' : ''}`}
      title={getPackageReason(option, t)}
    >
      {Number(option.discount_percent || 0) > 0 ? (
        <span className="mb-2 inline-flex rounded-full bg-[#F5C542] px-2.5 py-1 text-[11px] font-black text-[#111111]">
          {t('lockedEpisodeModal.off', { count: option.discount_percent })}
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-[14px] font-black leading-5 text-[var(--shadow-text-primary)]">
          {getPackageLabel(option, t)}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {Number(option.original_price || 0) > Number(option.price || 0) ? (
            <span className="text-[13px] font-medium text-[var(--shadow-text-tertiary)] line-through">
              {formatNumber(option.original_price)}
            </span>
          ) : null}
          <DiamondIcon selected={active} size="h-7 w-7" />
          <span className="text-[15px] font-black text-[var(--shadow-text-primary)]">{formatNumber(option.price)}</span>
        </div>
      </div>
    </button>
  )
}

function FreeAccessRow({ iconType, title, subtitle, disabled, buttonText, onClick }) {
  const { t } = useDisplayTranslation()
  const iconMap = {
    ads: <VideoIcon />,
    gems: <GemIcon />,
    voucher: <VoucherIcon />,
    story_card: <StoryCardIcon />,
  }

  return (
    <div className="flex min-h-[92px] items-center gap-4 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
      {iconMap[iconType] || <GemIcon />}

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-[var(--shadow-text-primary)]">{title}</div>
        <div className="mt-1 text-[12px] font-medium leading-4 text-[var(--shadow-text-secondary)]">{subtitle}</div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="h-8 shrink-0 rounded-full bg-[#111111] px-4 text-[12px] font-medium text-white disabled:bg-[#C9CBD1] disabled:opacity-75 dark:bg-white dark:text-[#111827] dark:disabled:bg-slate-600 dark:disabled:text-slate-300"
      >
        {buttonText || t('lockedEpisodeModal.access')}
      </button>
    </div>
  )
}

export default function LockedEpisodeModal({ episode, storyId, onClose, onUnlocked, onLogin, onTopUp }) {
  const { t, language } = useDisplayTranslation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('instant')
  const [selectedPackage, setSelectedPackage] = useState('single')
  const [loading, setLoading] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [message, setMessage] = useState('')
  const [wallet, setWallet] = useState(null)
  const [packageOptions, setPackageOptions] = useState(buildFallbackPackageOptions())
  const [gemAccess, setGemAccess] = useState({
    amount: FALLBACK_GEM_PRICE,
    access_days: 7,
  })
  const [autoUnlock, setAutoUnlock] = useState(false)
  const [showAutoHint, setShowAutoHint] = useState(false)

  const episodeStoryId = storyId || episode?.story_id
  const diamondBalance = Number(wallet?.diamond_balance || 0)
  const gemBalance = Number(wallet?.gem_balance || 0)
  const selectedOption = packageOptions.find((option) => option.key === selectedPackage) || packageOptions[0]
  const packagePrice = Number(selectedOption?.price || FALLBACK_DIAMOND_PRICE)
  const hasEnoughDiamonds = diamondBalance >= packagePrice
  const needDiamonds = Math.max(0, packagePrice - diamondBalance)
  const hasEnoughGems = gemBalance >= Number(gemAccess.amount || FALLBACK_GEM_PRICE)

  const purchaseText = useMemo(() => {
    if (unlocking) return t('lockedEpisodeModal.unlocking')
    if (!getReaderToken()) return t('lockedEpisodeModal.loginToUnlock')
    if (!selectedOption?.enabled) return t('lockedEpisodeModal.packageUnavailable')
    if (!hasEnoughDiamonds) return t('lockedEpisodeModal.topUpDiamonds')
    return t('lockedEpisodeModal.purchase')
  }, [hasEnoughDiamonds, language, selectedOption, t, unlocking])

  async function loadUnlockStatus() {
    if (!episode?.id || !episodeStoryId) return

    const token = getReaderToken()

    if (!token) {
      setWallet(null)
      setMessage(t('lockedEpisodeModal.loginRequired'))
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/status`, {
        headers: authHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || t('lockedEpisodeModal.checkStatusFailed'))
      }

      const options = Array.isArray(data.package_options) && data.package_options.length
        ? data.package_options
        : buildFallbackPackageOptions(Number(data.price?.amount || FALLBACK_DIAMOND_PRICE))

      setWallet(data.wallet || null)
      setAutoUnlock(Boolean(data.wallet?.auto_unlock))
      setPackageOptions(options)
      setGemAccess(data.gem_access || { amount: FALLBACK_GEM_PRICE, access_days: 7 })

      if (!options.some((option) => option.key === selectedPackage)) {
        setSelectedPackage(options[0]?.key || 'single')
      }

      if (data.unlocked) {
        onUnlocked?.(episode)
      }
    } catch (error) {
      setPackageOptions(buildFallbackPackageOptions())
      setMessage(error.message === 'Failed to fetch' ? t('lockedEpisodeModal.cannotConnect') : error.message || t('lockedEpisodeModal.checkStatusFailed'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnlockStatus()
  }, [episode?.id, episodeStoryId])

  if (!episode) return null

  const handlePurchase = async () => {
    const token = getReaderToken()

    if (!token) {
      onLogin?.()
      return
    }

    if (!selectedOption?.enabled) {
      setMessage(selectedOption?.disabled_reason || t('lockedEpisodeModal.packageNotAvailable'))
      return
    }

    if (!hasEnoughDiamonds) {
      onTopUp?.()
      return
    }

    try {
      setUnlocking(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/package`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          package_key: selectedPackage,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        if (data.code === 'INSUFFICIENT_DIAMONDS') {
          setWallet(data.wallet || wallet)
          setMessage(t('lockedEpisodeModal.notEnoughDiamonds', {
            count: data.need || needDiamonds,
          }))
          return
        }

        throw new Error(data.message || t('lockedEpisodeModal.unlockFailed'))
      }

      setWallet(data.wallet || wallet)
      onUnlocked?.(episode)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? t('lockedEpisodeModal.cannotConnect') : error.message || t('lockedEpisodeModal.unlockFailed'))
    } finally {
      setUnlocking(false)
    }
  }

  const handleGemAccess = async () => {
    const token = getReaderToken()

    if (!token) {
      onLogin?.()
      return
    }

    if (!hasEnoughGems) {
      setMessage(t('lockedEpisodeModal.notEnoughCoins', {
        count: Number(gemAccess.amount || FALLBACK_GEM_PRICE) - gemBalance,
      }))
      return
    }

    try {
      setUnlocking(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/unlocks/stories/${episodeStoryId}/episodes/${episode.id}/gem`, {
        method: 'POST',
        headers: authHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        if (data.code === 'INSUFFICIENT_GEMS') {
          setWallet(data.wallet || wallet)
          setMessage(error.message === 'Failed to fetch' ? t('lockedEpisodeModal.cannotConnect') : error.message || t('lockedEpisodeModal.unlockCoinsFailed'))
          return
        }

        throw new Error(data.message || t('lockedEpisodeModal.unlockGemsFailed'))
      }

      setWallet(data.wallet || wallet)
      onUnlocked?.(episode)
    } catch (error) {
      setMessage(error.message === 'Failed to fetch' ? t('lockedEpisodeModal.cannotConnect') : error.message || t('lockedEpisodeModal.unlockGemsFailed'))
    } finally {
      setUnlocking(false)
    }
  }

  const handleComingSoon = () => {
  onClose?.()
  navigate('/tasks')
}

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/55 px-0 pb-0 sm:items-center sm:px-6 sm:pb-0">
      <button type="button" onClick={onClose} className="absolute inset-0" aria-label={t('lockedEpisodeModal.close')} />

      <section className="relative w-screen max-w-none overflow-hidden rounded-t-[28px] rounded-b-none bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-2xl sm:w-full sm:max-w-[680px] sm:rounded-[30px]">
        <header className="relative px-5 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('lockedEpisodeModal.close')}
          >
            <i className="fa-solid fa-xmark text-[18px]" />
          </button>

          <h2 className="pr-12 text-center text-[21px] font-medium text-[var(--shadow-text-primary)]">
            {t('lockedEpisodeModal.unlockEpisode')}
          </h2>

          <div className="mt-4 flex border-b border-[var(--shadow-border)]">
            <TabButton active={activeTab === 'instant'} onClick={() => setActiveTab('instant')}>
              {t('lockedEpisodeModal.instantAccess')}
            </TabButton>
            <TabButton active={activeTab === 'free'} onClick={() => setActiveTab('free')}>
              {t('lockedEpisodeModal.freeAccess')}
            </TabButton>
          </div>
        </header>

        <div className="max-h-[82vh] overflow-y-auto px-5 pb-5 pt-5">
          {activeTab === 'instant' ? (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[18px] bg-[var(--shadow-bg-elevated)] text-left active:scale-[0.99]"
              >
                <span className="inline-flex items-center rounded-full bg-[#111111] px-3 py-2 text-[13px] font-black text-white">
                  <i className="fa-solid fa-crown mr-1.5 text-[#F5C542]" />
                  Premium
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[var(--shadow-text-secondary)]">
                  {t('lockedEpisodeModal.premiumDiscount')}
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[var(--shadow-text-secondary)]" />
              </button>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {packageOptions.filter((option) => option.key !== 'all_released').map((option) => (
                  <InstantOption
                    key={option.key}
                    option={option}
                    active={selectedPackage === option.key}
                    onClick={() => setSelectedPackage(option.key)}
                  />
                ))}
              </div>

              {packageOptions.filter((option) => option.key === 'all_released').map((option) => (
                <button
                  key={option.key}
                  type="button"
                  disabled={!option.enabled}
                  onClick={() => setSelectedPackage(option.key)}
                  className={`mt-3 flex min-h-[88px] w-full items-center justify-between rounded-[18px] border bg-[var(--shadow-bg-surface)] px-4 py-3 text-left ${
                    selectedPackage === option.key ? 'border-[#C59B2D]' : 'border-[var(--shadow-border)]'
                  } ${!option.enabled ? 'opacity-55' : ''}`}
                  title={getPackageReason(option, t)}
                >
                  <div>
                    <span className="mb-2 inline-flex rounded-full bg-[#F5C542] px-2.5 py-1 text-[11px] font-black text-[#111111]">
                      {t('lockedEpisodeModal.off', { count: option.discount_percent })}
                    </span>
                    <div className="text-[14px] font-black text-[var(--shadow-text-primary)]">{getPackageLabel(option, t)}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {Number(option.original_price || 0) > Number(option.price || 0) ? (
                      <span className="text-[13px] font-medium text-[var(--shadow-text-tertiary)] line-through">
                        {formatNumber(option.original_price)}
                      </span>
                    ) : null}
                    <DiamondIcon selected={selectedPackage === option.key} size="h-7 w-7" />
                    <span className="text-[15px] font-black text-[var(--shadow-text-primary)]">{formatNumber(option.price)}</span>
                  </div>
                </button>
              ))}

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="text-[14px] font-medium text-[var(--shadow-text-tertiary)]">
                  {loading
                    ? t('lockedEpisodeModal.balanceChecking')
                    : t('lockedEpisodeModal.balanceDiamonds', {
                        count: formatNumber(diamondBalance),
                      })}
                </div>

                <div className="relative flex items-center gap-2 text-[14px] font-medium text-[var(--shadow-text-tertiary)]">
                  <button
                    type="button"
                    onClick={() => setShowAutoHint((value) => !value)}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--shadow-border-strong)] text-[12px]"
                    aria-label={t('lockedEpisodeModal.autoUnlockInfo')}
                  >
                    ?
                  </button>

                  {showAutoHint ? (
                    <button
                      type="button"
                      onClick={() => setShowAutoHint(false)}
                      className="absolute bottom-9 right-0 z-20 w-[260px] rounded-[16px] bg-[#111111] px-4 py-3 text-left text-[11px] font-medium leading-5 text-white shadow-xl"
                    >
                      {t('lockedEpisodeModal.autoUnlockHint', {
                        defaultValue: AUTO_UNLOCK_HINT,
                      })}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setAutoUnlock((value) => !value)}
                    className="flex items-center gap-2"
                  >
                    {t('lockedEpisodeModal.autoUnlock')}
                    <span className={`relative h-8 w-14 rounded-full transition ${autoUnlock ? 'bg-[#111111] dark:bg-white' : 'bg-[#D0D5DD] dark:bg-slate-600'}`}>
                      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${autoUnlock ? 'left-7 dark:bg-[#111827]' : 'left-1'}`} />
                    </span>
                  </button>
                </div>
              </div>

              {message ? (
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="mt-4 w-full rounded-[16px] bg-[#FFF1F1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#E5484D] dark:bg-red-500/10 dark:text-red-300"
                >
                  {message}
                </button>
              ) : null}

              {!hasEnoughDiamonds && getReaderToken() ? (
                <div className="mt-3 text-center text-[12px] font-medium text-[var(--shadow-text-secondary)]">
                  {t('lockedEpisodeModal.needMoreDiamonds', {
                    count: needDiamonds,
                  })}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handlePurchase}
                disabled={loading || unlocking || !selectedOption?.enabled}
                className="mt-5 h-[56px] w-full rounded-full bg-[#111111] text-[16px] font-medium text-white shadow-[0_16px_32px_rgba(17,24,39,0.22)] active:scale-[0.99] disabled:bg-[#9CA3AF] dark:bg-white dark:text-[#111827] dark:disabled:bg-slate-600 dark:disabled:text-slate-300"
              >
                {purchaseText}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleComingSoon}
                className="flex w-full items-center gap-3 text-left active:scale-[0.99]"
              >
                <span className="rounded-[14px] bg-[#111111] px-4 py-3 text-[14px] font-medium text-white dark:bg-white dark:text-[#111827]">
                  {t('lockedEpisodeModal.freeUnlock')}
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium text-[var(--shadow-text-secondary)]">
                  {t('lockedEpisodeModal.earnMore')}
                </span>
                <i className="fa-solid fa-chevron-right text-[13px] text-[var(--shadow-text-secondary)]" />
              </button>

              <div className="mt-5 space-y-3">
                <FreeAccessRow
                  iconType="ads"
                  title={t('lockedEpisodeModal.watchAdsComingSoon')}
                  subtitle={t('lockedEpisodeModal.watchAdsHelp')}
                  buttonText={t('lockedEpisodeModal.watch')}
                  disabled
                />
                <FreeAccessRow
  iconType="gems"
  title={t('lockedEpisodeModal.coinsRemaining', {
    count: formatNumber(gemBalance),
  })}
  subtitle={t('lockedEpisodeModal.accessDays', {
    count: Number(gemAccess.access_days || 7),
  })}
  buttonText={hasEnoughGems ? t('lockedEpisodeModal.access') : t('lockedEpisodeModal.notEnough')}
  disabled={unlocking || !hasEnoughGems}
  onClick={handleGemAccess}
/>
                <FreeAccessRow
                  iconType="voucher"
                  title={t('lockedEpisodeModal.vouchersComingSoon')}
                  subtitle={t('lockedEpisodeModal.vouchersHelp')}
                  disabled
                />
                <FreeAccessRow
                  iconType="story_card"
                  title={t('lockedEpisodeModal.storyCardsComingSoon')}
                  subtitle={t('lockedEpisodeModal.storyCardsHelp')}
                  disabled
                />
              </div>

              {message ? (
                <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="mt-4 w-full rounded-[16px] bg-[#FFF1F1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#E5484D] dark:bg-red-500/10 dark:text-red-300"
                >
                  {message}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setActiveTab('instant')}
                className="mt-5 h-[52px] w-full rounded-full bg-[#111111] text-[15px] font-medium text-white active:scale-[0.99] dark:bg-white dark:text-[#111827]"
              >
                {t('lockedEpisodeModal.useDiamondsInstead')}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
