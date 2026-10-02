import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PremiumHelpSheet from '../../components/Me/PremiumHelpSheet'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import PremiumPaymentFlow from '../../components/Me/PremiumPaymentFlow'

registerTranslationNamespace('premiumPage', {
  en: {
    shadowReader: 'Shadow Reader',
    back: 'Back',
    getPremium: 'Get Premium',
    premiumHelp: 'Premium help',
    premiumPrivileges: 'Go Premium to enjoy 6 privileges.',
    privileges: 'Privileges',
    more: 'More',
    bonus: 'BONUS',
    checkInReward: 'Check-in Reward',
    sevenDiamondsWeek: '1 Diamond/Day • 7 Diamonds/Week',
    earlyAccess: 'Early access to 300+ stories',
    freeEpisodeAccess: 'Free access to 500+ episodes',
    oneMonth: '1 Month',
    threeMonths: '3 Months',
    twelveMonths: '12 Months',
    flexible: 'FLEXIBLE',
    popular: 'POPULAR',
    annual: 'ANNUAL',
    subscribe: 'Subscribe',
    extraDiamonds: 'Extra Diamonds are included with each Premium plan.',
    autoRenewal: 'Premium stays active until the selected plan ends.',
    premiumDetails: 'Details about Premium',
    giftPackTitle: '1. Premium Gift Pack',
    giftPackText: 'After payment is confirmed, the plan Diamonds are added and Premium is activated.',
    subscriptionTitle: '2. Subscription',
    subscriptionText: 'Premium stays active for the selected 1, 3, or 12 month period.',
    benefitsTitle: '3. Benefits',
    benefitsText: 'Premium privileges remain active until the subscription period ends.',
  },
  km: {
    shadowReader: 'អ្នកអាន Shadow',
    back: 'ត្រឡប់ក្រោយ',
    getPremium: 'ទទួល Premium',
    premiumHelp: 'ជំនួយ Premium',
    premiumPrivileges: 'ប្រើ Premium ដើម្បីទទួលបានអត្ថប្រយោជន៍ 6 យ៉ាង។',
    privileges: 'អត្ថប្រយោជន៍',
    more: 'បន្ថែម',
    bonus: 'BONUS',
    checkInReward: 'រង្វាន់ Check-in',
    sevenDiamondsWeek: '1 Diamond/ថ្ងៃ • 7 Diamonds/សប្តាហ៍',
    earlyAccess: 'ចូលអានមុនលើរឿង 300+',
    freeEpisodeAccess: 'ចូលអានឥតគិតថ្លៃ 500+ ភាគ',
    oneMonth: '1 ខែ',
    threeMonths: '3 ខែ',
    twelveMonths: '12 ខែ',
    flexible: 'បត់បែន',
    popular: 'ពេញនិយម',
    annual: 'ប្រចាំឆ្នាំ',
    subscribe: 'ជាវ',
    extraDiamonds: 'Diamond បន្ថែមមានរួមជាមួយគម្រោង Premium នីមួយៗ។',
    autoRenewal: 'Premium នឹងសកម្មរហូតដល់គម្រោងដែលបានជ្រើសបញ្ចប់។',
    premiumDetails: 'ព័ត៌មានលម្អិតអំពី Premium',
    giftPackTitle: '1. កញ្ចប់រង្វាន់ Premium',
    giftPackText: 'បន្ទាប់ពីការទូទាត់ត្រូវបានបញ្ជាក់ Diamonds នឹងត្រូវបញ្ចូល ហើយ Premium នឹងត្រូវ Activate។',
    subscriptionTitle: '2. ការជាវ',
    subscriptionText: 'Premium នឹងសកម្មតាមរយៈពេល 1 ខែ 3 ខែ ឬ 12 ខែដែលអ្នកបានជ្រើស។',
    benefitsTitle: '3. អត្ថប្រយោជន៍',
    benefitsText: 'អត្ថប្រយោជន៍ Premium នៅតែសកម្មរហូតដល់រយៈពេលជាវបញ្ចប់។',
  },
  zh: {
    shadowReader: 'Shadow 读者',
    back: '返回',
    getPremium: '开通 Premium',
    premiumHelp: 'Premium 帮助',
    premiumPrivileges: '开通 Premium，享受 6 项权益。',
    privileges: '权益',
    more: '更多',
    bonus: '奖励',
    checkInReward: '签到奖励',
    sevenDiamondsWeek: '每天 1 Diamond • 每周 7 Diamonds',
    earlyAccess: '抢先阅读 300+ 个故事',
    freeEpisodeAccess: '免费阅读 500+ 个章节',
    oneMonth: '1 个月',
    threeMonths: '3 个月',
    twelveMonths: '12 个月',
    flexible: '灵活',
    popular: '热门',
    annual: '年度',
    subscribe: '订阅',
    extraDiamonds: '每个 Premium 方案都包含额外 Diamonds。',
    autoRenewal: 'Premium 在所选方案结束前保持有效。',
    premiumDetails: 'Premium 详情',
    giftPackTitle: '1. Premium 礼包',
    giftPackText: '付款确认后，将添加方案 Diamonds 并激活 Premium。',
    subscriptionTitle: '2. 订阅',
    subscriptionText: 'Premium 将按所选的 1、3 或 12 个月期限保持有效。',
    benefitsTitle: '3. 权益',
    benefitsText: 'Premium 权益会持续有效至订阅期结束。',
  },
  ja: {
    shadowReader: 'Shadow リーダー',
    back: '戻る',
    getPremium: 'Premium に登録',
    premiumHelp: 'Premium ヘルプ',
    premiumPrivileges: 'Premium に登録して6つの特典を利用できます。',
    privileges: '特典',
    more: 'もっと見る',
    bonus: 'ボーナス',
    checkInReward: 'チェックイン報酬',
    sevenDiamondsWeek: '1日 1 Diamond • 週 7 Diamonds',
    earlyAccess: '300以上のストーリーを先行閲覧',
    freeEpisodeAccess: '500以上のエピソードを無料で閲覧',
    oneMonth: '1か月',
    threeMonths: '3か月',
    twelveMonths: '12か月',
    flexible: '柔軟',
    popular: '人気',
    annual: '年間',
    subscribe: '登録',
    extraDiamonds: '各 Premium プランには追加 Diamonds が含まれます。',
    autoRenewal: 'Premium は選択したプランの終了まで有効です。',
    premiumDetails: 'Premium の詳細',
    giftPackTitle: '1. Premium ギフトパック',
    giftPackText: '支払い確認後、プランの Diamonds が追加され Premium が有効になります。',
    subscriptionTitle: '2. 購読',
    subscriptionText: 'Premium は選択した 1、3、12 か月の期間中有効です。',
    benefitsTitle: '3. 特典',
    benefitsText: 'Premium 特典は購読期間が終了するまで有効です。',
  },
  ko: {
    shadowReader: 'Shadow 독자',
    back: '뒤로 가기',
    getPremium: 'Premium 가입',
    premiumHelp: 'Premium 도움말',
    premiumPrivileges: 'Premium으로 6가지 혜택을 이용하세요.',
    privileges: '혜택',
    more: '더 보기',
    bonus: '보너스',
    checkInReward: '체크인 보상',
    sevenDiamondsWeek: '하루 1 Diamond • 주 7 Diamonds',
    earlyAccess: '300개 이상의 스토리 선공개 이용',
    freeEpisodeAccess: '500개 이상의 에피소드 무료 이용',
    oneMonth: '1개월',
    threeMonths: '3개월',
    twelveMonths: '12개월',
    flexible: '유연',
    popular: '인기',
    annual: '연간',
    subscribe: '구독',
    extraDiamonds: '각 Premium 플랜에는 추가 Diamonds가 포함됩니다.',
    autoRenewal: 'Premium은 선택한 플랜이 끝날 때까지 활성 상태로 유지됩니다.',
    premiumDetails: 'Premium 상세 정보',
    giftPackTitle: '1. Premium 기프트 팩',
    giftPackText: '결제가 확인되면 플랜 Diamonds가 추가되고 Premium이 활성화됩니다.',
    subscriptionTitle: '2. 구독',
    subscriptionText: 'Premium은 선택한 1개월, 3개월 또는 12개월 기간 동안 유지됩니다.',
    benefitsTitle: '3. 혜택',
    benefitsText: 'Premium 혜택은 구독 기간이 끝날 때까지 유지됩니다.',
  },
})

const PLANS = [
  { id: '1', label: '1 Month', price: '$5', diamonds: 180, bonus: 90, badge: 'FLEXIBLE' },
  { id: '3', label: '3 Months', price: '$18', diamonds: 540, bonus: 270, badge: 'POPULAR' },
  { id: '12', label: '12 Months', price: '$70', diamonds: 2200, bonus: 1080, badge: 'ANNUAL' },
]

const PLAN_LABEL_KEYS = {
  '1 Month': 'oneMonth',
  '3 Months': 'threeMonths',
  '12 Months': 'twelveMonths',
}

const PLAN_BADGE_KEYS = {
  FLEXIBLE: 'flexible',
  POPULAR: 'popular',
  ANNUAL: 'annual',
}

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function getDisplayLocale() {
  return DISPLAY_LOCALES[getDisplayLanguageId()] || 'en-US'
}

function formatPlanMoney(value) {
  const number = Number(String(value || '').replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(number)) return value || ''

  return new Intl.NumberFormat(getDisplayLocale(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

function formatPlanDiamonds(value) {
  const number = Number(String(value || '').replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(number)) return value || ''

  return `${new Intl.NumberFormat(getDisplayLocale()).format(number)} Diamonds`
}

function getStoredReader() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function DiamondMark({ className = '' }) {
  return (
    <img
      src="/assets/Icons/Diamond.svg"
      alt=""
      className={`shrink-0 object-contain ${className}`}
    />
  )
}

export default function PremiumPage() {
  const { t } = useDisplayTranslation()
  const reader = useMemo(getStoredReader, [])
  const [selectedPlan, setSelectedPlan] = useState('3')
  const [helpOpen, setHelpOpen] = useState(false)

  const selectedPlanDetails =
    PLANS.find((plan) => plan.id === selectedPlan) || PLANS[0]

  const displayName =
    reader?.name ||
    reader?.display_name ||
    reader?.username ||
    reader?.email?.split('@')[0] ||
    t('premiumPage.shadowReader')

  const avatar =
    reader?.avatar_url ||
    reader?.profile_image ||
    reader?.photo_url ||
    ''

  return (
    <main className="min-h-screen bg-[#ededed] text-[#202124] dark:bg-[var(--shadow-bg-page)] dark:text-[var(--shadow-text-primary)]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#ededed] shadow-[0_0_30px_rgba(17,24,39,0.08)] dark:bg-[var(--shadow-bg-page)] dark:shadow-[0_0_30px_rgba(0,0,0,0.24)]">
        <header className="sticky top-0 z-50 bg-white dark:bg-[var(--shadow-nav-bg)]">
          <div className="grid h-16 grid-cols-[44px_1fr_44px] items-center px-4">
            <Link
              to="/me"
              aria-label={t('premiumPage.back')}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#202124] active:bg-black/5 dark:text-[var(--shadow-text-primary)] dark:active:bg-white/5"
            >
              <i className="fa-solid fa-arrow-left text-[20px]" />
            </Link>

            <h1 className="text-center text-[22px] font-medium tracking-[0.01em]">
              {t('premiumPage.getPremium')}
            </h1>

            <button
              type="button"
              aria-label={t('premiumPage.premiumHelp')}
              onClick={() => setHelpOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#202124] active:bg-black/5 dark:text-[var(--shadow-text-primary)] dark:active:bg-white/5"
            >
              <i className="fa-regular fa-circle-question text-[19px]" />
            </button>
          </div>
        </header>

        <section className="bg-white px-6 pb-5 pt-2 dark:bg-[var(--shadow-bg-surface)]">
          <div className="flex items-center gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ef5b16] to-[#bd2f00] text-[26px] font-medium text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-[19px] font-semibold">{displayName}</div>
              <div className="mt-1 text-[13px] text-[#70757a] dark:text-[var(--shadow-text-secondary)]">
                {t('premiumPage.premiumPrivileges')}
              </div>
            </div>
          </div>
        </section>

        <div className="relative h-[82px] overflow-hidden bg-white text-white dark:bg-[var(--shadow-bg-surface)]">
          <div
            className="absolute left-1/2 top-0 h-full w-[124%] -translate-x-1/2 overflow-hidden bg-gradient-to-r from-[#454851] via-[#24262c] to-[#101115]"
            style={{
              borderBottomLeftRadius: '50% 26px',
              borderBottomRightRadius: '50% 26px',
            }}
          >
            <div className="absolute inset-0 opacity-20 [background:linear-gradient(135deg,transparent_0%,transparent_28%,white_28.5%,transparent_29%,transparent_58%,white_58.5%,transparent_59%)]" />

            <div className="relative mx-auto flex h-full w-[80.5%] items-start justify-between px-5 pt-5">
              <div className="flex items-center gap-2">
                <span className="text-[25px] font-black italic tracking-wide">Premium</span>
                <i className="fa-solid fa-crown text-[12px] text-[#ffd100]" />
              </div>

              <span className="pt-1 text-[14px] font-black tracking-tight text-white/15">
                SHADOW
              </span>
            </div>
          </div>
        </div>

        <section className="rounded-b-[26px] bg-white px-5 pb-6 pt-1 dark:bg-[var(--shadow-bg-surface)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[21px] font-bold">{t('premiumPage.privileges')}</h2>
            <a
              href="#premium-details"
              className="flex items-center gap-1 text-[14px] text-[#a5a5a5] dark:text-[var(--shadow-text-tertiary)]"
            >
              {t('premiumPage.more')}
              <i className="fa-solid fa-chevron-right text-[10px]" />
            </a>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-4">
            <div className="min-h-[92px] rounded-[12px] bg-gradient-to-r from-[#f4f9ff] to-[#f9fbff] px-4 py-3 dark:from-[var(--shadow-bg-elevated)] dark:to-[var(--shadow-bg-soft)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[17px] font-bold">
                    {formatPlanDiamonds(selectedPlanDetails.diamonds)}
                  </div>
                  <div className="mt-1 text-[13px] text-[#9aa0a6] dark:text-[var(--shadow-text-secondary)]">
                    +{formatPlanDiamonds(selectedPlanDetails.bonus)}
                  </div>
                </div>
                <DiamondMark className="h-11 w-11 text-[18px]" />
              </div>

              <span className="absolute left-[39%] top-[-7px] rounded-b-[8px] rounded-t-[4px] bg-[#ff9212] px-2 py-1 text-[10px] font-bold text-white">
                {t('premiumPage.bonus')}
              </span>
            </div>

            <div className="min-h-[92px] rounded-[12px] bg-gradient-to-r from-[#f4f9ff] to-[#f9fbff] px-4 py-3 dark:from-[var(--shadow-bg-elevated)] dark:to-[var(--shadow-bg-soft)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[17px] font-bold">{t('premiumPage.checkInReward')}</div>
                  <div className="mt-1 text-[13px] text-[#9aa0a6] dark:text-[var(--shadow-text-secondary)]">
                    {t('premiumPage.sevenDiamondsWeek')}
                  </div>
                </div>
                <DiamondMark className="h-11 w-11 text-[18px]" />
              </div>
            </div>

            <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[22px] font-bold text-[#c5c8cc] dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-tertiary)]">
              +
            </span>
          </div>

          <div className="mt-5 divide-y divide-[#ececec] dark:divide-[var(--shadow-border)]">
            <div className="flex min-h-[58px] items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff8e2] text-[#f5a400] dark:bg-amber-500/10 dark:text-amber-300">
                <i className="fa-solid fa-clock text-[16px]" />
              </span>
              <span className="text-[16px]">{t('premiumPage.earlyAccess')}</span>
            </div>

            <div className="flex min-h-[58px] items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[#f5a400] dark:bg-[var(--shadow-bg-elevated)] dark:text-amber-300">
                <i className="fa-solid fa-lock-open text-[15px]" />
              </span>
              <span className="text-[16px]">{t('premiumPage.freeEpisodeAccess')}</span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-t-[26px] bg-white px-5 pb-7 pt-7 dark:bg-[var(--shadow-bg-surface)]">
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map((plan) => {
              const selected = selectedPlan === plan.id

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative min-h-[192px] rounded-[12px] px-2 py-6 text-center transition active:scale-[0.98] ${
                    selected
                      ? 'bg-white ring-2 ring-[#202124] dark:bg-[var(--shadow-bg-surface)] dark:ring-[var(--shadow-text-primary)]'
                      : 'bg-[#f7f7f7] ring-1 ring-transparent dark:bg-[var(--shadow-bg-elevated)]'
                  }`}
                >
                  {plan.badge ? (
                    <span className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-t-[7px] px-2.5 py-1 text-[9px] font-black ${
                      plan.id === '3'
                        ? 'bg-[#202124] text-[#ffd100]'
                        : plan.id === '12'
                          ? 'bg-[#ffb000] text-[#202124]'
                          : 'bg-[#ececec] text-[#616161] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]'
                    }`}>
                      {t(`premiumPage.${PLAN_BADGE_KEYS[plan.badge]}`)}
                    </span>
                  ) : null}

                  <div className="text-[18px] font-medium">
                    {t(`premiumPage.${PLAN_LABEL_KEYS[plan.label]}`)}
                  </div>
                  <div className="mt-5 text-[27px] font-semibold">{formatPlanMoney(plan.price)}</div>

                  <div className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[#777] dark:text-[var(--shadow-text-secondary)]">
                    <DiamondMark className="h-5 w-5 text-[9px]" />
                    <span>{formatPlanDiamonds(plan.diamonds)}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <PremiumPaymentFlow
            plan={selectedPlanDetails}
            label={t('premiumPage.subscribe')}
          />

          <p className="mt-4 text-center text-[12px] leading-5 text-[#a0a0a0] dark:text-[var(--shadow-text-secondary)]">
            {t('premiumPage.extraDiamonds')}
            <br />
            {t('premiumPage.autoRenewal')}
          </p>

          <div id="premium-details" className="mt-5 border-t border-[#e5e5e5] pt-5 dark:border-[var(--shadow-border)]">
            <h3 className="text-[14px] font-semibold text-[#9a9a9a] dark:text-[var(--shadow-text-secondary)]">
              {t('premiumPage.premiumDetails')}
            </h3>

            <div className="mt-4 space-y-4 text-[12px] leading-5 text-[#8f8f8f] dark:text-[var(--shadow-text-secondary)]">
              <div>
                <div className="font-semibold text-[#777] dark:text-[var(--shadow-text-primary)]">{t('premiumPage.giftPackTitle')}</div>
                <p className="mt-1">
                  {t('premiumPage.giftPackText')}
                </p>
              </div>

              <div>
                <div className="font-semibold text-[#777] dark:text-[var(--shadow-text-primary)]">{t('premiumPage.subscriptionTitle')}</div>
                <p className="mt-1">
                  {t('premiumPage.subscriptionText')}
                </p>
              </div>

              <div>
                <div className="font-semibold text-[#777] dark:text-[var(--shadow-text-primary)]">{t('premiumPage.benefitsTitle')}</div>
                <p className="mt-1">
                  {t('premiumPage.benefitsText')}
                </p>
              </div>
            </div>
          </div>
        </section>
        <PremiumHelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
      </div>
    </main>
  )
}
