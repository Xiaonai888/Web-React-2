import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getDisplayLanguageId,
  getDisplayText,
  useDisplayTranslation,
} from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorIncomeOld', {
  en: {
    notScheduled: 'Not scheduled yet',
    missing: 'Missing',
    bankQr: 'Bank QR',
    paypal: 'PayPal',
    phoneNumber: 'Phone Number',
    paymentMethod: 'Payment Method',
    episodeUnlock: 'Episode unlock',
    diamondUnlock: 'Diamond unlock',
    readerSupporter: 'Reader Supporter {{count}}',
    shareSuffix: '{{share}} share',
    diamondUnlockSupporter: 'Diamond unlock supporter',
    paidDate: 'Paid {{date}}',
    scheduledDate: 'Scheduled {{date}}',
    automaticMonthlyPayout: 'Automatic monthly payout',
    monthlyPayout: 'Monthly payout',
    netPayout: 'Net payout',
    statusPaid: 'paid',
    statusFailed: 'failed',
    statusMissingPaymentMethod: 'missing payment method',
    statusScheduled: 'scheduled',
    statusAvailable: 'available',
    back: 'Back',
    info: 'Info',
    myIncome: 'My Income',
    netAuthorEarnings: 'Net author earnings',
    closeIncomeTip: 'Close income tip',
    howIncomeWorks: 'How income works',
    quickGuide: 'Quick guide for author earnings',
    tip1: 'Your income is shown as money, but the system records earnings from Diamond unlocks.',
    tip2: 'Your share depends on your Quest stage.',
    tip3: 'Payouts are processed automatically every 15th. You don’t need to request withdrawal.',
    tip4: 'Free unlocks, Gems, Vouchers, Story Cards, and Episodes 1–5 do not count as paid income.',
    viewBenefits: 'View Author Benefits',
    loadFailed: 'Failed to load income',
    tryAgain: 'Try Again',
    thisMonth: 'This Month',
    incomeHeroBody: 'Your income is shown as money. Shadow still records earnings from Diamond unlocks behind the scenes.',
    share: 'Share',
    today: 'Today',
    week: 'Week',
    total: 'Total',
    nextPayout: 'Next Payout',
    payoutAutomaticBody: 'Payout is handled automatically. You do not need to request withdrawal.',
    paymentReadyBody: 'Tap to review or update your payout details.',
    paymentMissingBody: 'Tap to add Bank QR, PayPal, or phone payout details.',
    recentEarnings: 'Recent Earnings',
    recentEarningsBody: 'Net earnings from paid Diamond unlocks.',
    latest: 'Latest',
    noEarnings: 'No earnings yet',
    noEarningsBody: 'Paid Diamond unlocks will appear here after readers unlock your locked episodes.',
    topSupporters: 'Top Supporters',
    topSupportersBody: 'Readers who supported your stories through paid unlocks.',
    noSupporters: 'No supporters yet',
    noSupportersBody: 'When readers unlock paid episodes, your strongest supporters will appear here.',
    payoutHistory: 'Payout History',
    payoutHistoryBody: 'Automatic monthly payout records.',
    noPayout: 'No payout yet',
    noPayoutBody: 'Your monthly payout history will appear here after admin processes payments.',
    incomeRules: 'Income Rules',
    incomeRulesBody: 'Income is calculated from net Diamond unlock revenue after package discounts. Your current share comes from Quest progress. Free unlocks, Gems, Vouchers, Story Cards, and Episodes 1–5 do not count as paid income.',
  },
  km: {
    notScheduled: 'មិនទាន់កំណត់កាលវិភាគ',
    missing: 'មិនទាន់មាន',
    bankQr: 'Bank QR',
    paypal: 'PayPal',
    phoneNumber: 'លេខទូរស័ព្ទ',
    paymentMethod: 'វិធីទទួលប្រាក់',
    episodeUnlock: 'ការដោះសោភាគ',
    diamondUnlock: 'ការដោះសោដោយ Diamond',
    readerSupporter: 'អ្នកគាំទ្រទី {{count}}',
    shareSuffix: 'ចំណែក {{share}}',
    diamondUnlockSupporter: 'អ្នកគាំទ្រតាមការដោះសោ Diamond',
    paidDate: 'បានបង់ {{date}}',
    scheduledDate: 'កំណត់បង់ {{date}}',
    automaticMonthlyPayout: 'ការបង់ប្រាក់ប្រចាំខែដោយស្វ័យប្រវត្តិ',
    monthlyPayout: 'ការបង់ប្រាក់ប្រចាំខែ',
    netPayout: 'ប្រាក់ទទួលសុទ្ធ',
    statusPaid: 'បានបង់',
    statusFailed: 'បរាជ័យ',
    statusMissingPaymentMethod: 'ខ្វះវិធីទទួលប្រាក់',
    statusScheduled: 'បានកំណត់',
    statusAvailable: 'អាចប្រើបាន',
    back: 'ត្រឡប់ក្រោយ',
    info: 'ព័ត៌មាន',
    myIncome: 'ចំណូលរបស់ខ្ញុំ',
    netAuthorEarnings: 'ចំណូលសុទ្ធរបស់អ្នកនិពន្ធ',
    closeIncomeTip: 'បិទការណែនាំចំណូល',
    howIncomeWorks: 'របៀបដំណើរការចំណូល',
    quickGuide: 'ការណែនាំខ្លីសម្រាប់ចំណូលអ្នកនិពន្ធ',
    tip1: 'ចំណូលរបស់អ្នកបង្ហាញជាប្រាក់ ប៉ុន្តែប្រព័ន្ធកត់ត្រាចំណូលពីការដោះសោដោយ Diamond។',
    tip2: 'ភាគរយចំណែករបស់អ្នកអាស្រ័យលើកម្រិត Quest។',
    tip3: 'ការបង់ប្រាក់ត្រូវបានដំណើរការដោយស្វ័យប្រវត្តិរៀងរាល់ថ្ងៃទី 15។ អ្នកមិនចាំបាច់ស្នើដកប្រាក់ទេ។',
    tip4: 'ការដោះសោឥតគិតថ្លៃ Gems, Vouchers, Story Cards និងភាគ 1–5 មិនរាប់ជាចំណូលបង់ប្រាក់ទេ។',
    viewBenefits: 'មើលអត្ថប្រយោជន៍អ្នកនិពន្ធ',
    loadFailed: 'មិនអាចផ្ទុកចំណូលបានទេ',
    tryAgain: 'សាកម្តងទៀត',
    thisMonth: 'ខែនេះ',
    incomeHeroBody: 'ចំណូលរបស់អ្នកបង្ហាញជាប្រាក់។ Shadow នៅតែកត់ត្រាចំណូលពីការដោះសោ Diamond នៅក្នុងប្រព័ន្ធ។',
    share: 'ចំណែក',
    today: 'ថ្ងៃនេះ',
    week: 'សប្តាហ៍',
    total: 'សរុប',
    nextPayout: 'ការបង់ប្រាក់បន្ទាប់',
    payoutAutomaticBody: 'ការបង់ប្រាក់ដំណើរការដោយស្វ័យប្រវត្តិ។ អ្នកមិនចាំបាច់ស្នើដកប្រាក់ទេ។',
    paymentReadyBody: 'ចុចដើម្បីពិនិត្យ ឬកែព័ត៌មានទទួលប្រាក់របស់អ្នក។',
    paymentMissingBody: 'ចុចដើម្បីបន្ថែម Bank QR, PayPal ឬព័ត៌មានទទួលប្រាក់តាមទូរស័ព្ទ។',
    recentEarnings: 'ចំណូលថ្មីៗ',
    recentEarningsBody: 'ចំណូលសុទ្ធពីការដោះសោ Diamond ដែលបានបង់ប្រាក់។',
    latest: 'ថ្មីបំផុត',
    noEarnings: 'មិនទាន់មានចំណូល',
    noEarningsBody: 'ចំណូលពីការដោះសោ Diamond នឹងបង្ហាញនៅទីនេះ ពេលអ្នកអានដោះសោភាគដែលបានចាក់សោ។',
    topSupporters: 'អ្នកគាំទ្រកំពូល',
    topSupportersBody: 'អ្នកអានដែលបានគាំទ្ររឿងរបស់អ្នកតាមការដោះសោបង់ប្រាក់។',
    noSupporters: 'មិនទាន់មានអ្នកគាំទ្រ',
    noSupportersBody: 'ពេលអ្នកអានដោះសោភាគបង់ប្រាក់ អ្នកគាំទ្រខ្លាំងបំផុតនឹងបង្ហាញនៅទីនេះ។',
    payoutHistory: 'ប្រវត្តិបង់ប្រាក់',
    payoutHistoryBody: 'កំណត់ត្រាការបង់ប្រាក់ប្រចាំខែដោយស្វ័យប្រវត្តិ។',
    noPayout: 'មិនទាន់មានការបង់ប្រាក់',
    noPayoutBody: 'ប្រវត្តិបង់ប្រាក់ប្រចាំខែរបស់អ្នកនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពី Admin ដំណើរការការបង់ប្រាក់។',
    incomeRules: 'ច្បាប់ចំណូល',
    incomeRulesBody: 'ចំណូលគណនាពីចំណូលសុទ្ធនៃការដោះសោ Diamond បន្ទាប់ពីបញ្ចុះតម្លៃកញ្ចប់។ ចំណែកបច្ចុប្បន្នអាស្រ័យលើវឌ្ឍនភាព Quest។ ការដោះសោឥតគិតថ្លៃ Gems, Vouchers, Story Cards និងភាគ 1–5 មិនរាប់ជាចំណូលបង់ប្រាក់ទេ។',
  },
  zh: {
    notScheduled: '尚未安排',
    missing: '未设置',
    bankQr: '银行二维码',
    paypal: 'PayPal',
    phoneNumber: '手机号',
    paymentMethod: '收款方式',
    episodeUnlock: '章节解锁',
    diamondUnlock: 'Diamond 解锁',
    readerSupporter: '读者支持者 {{count}}',
    shareSuffix: '{{share}} 分成',
    diamondUnlockSupporter: 'Diamond 解锁支持者',
    paidDate: '已于 {{date}} 支付',
    scheduledDate: '计划于 {{date}} 支付',
    automaticMonthlyPayout: '每月自动付款',
    monthlyPayout: '每月付款',
    netPayout: '净付款',
    statusPaid: '已支付',
    statusFailed: '失败',
    statusMissingPaymentMethod: '缺少收款方式',
    statusScheduled: '已安排',
    statusAvailable: '可用',
    back: '返回',
    info: '信息',
    myIncome: '我的收入',
    netAuthorEarnings: '作者净收入',
    closeIncomeTip: '关闭收入说明',
    howIncomeWorks: '收入如何计算',
    quickGuide: '作者收入快速指南',
    tip1: '你的收入以金额显示，但系统实际记录的是 Diamond 解锁产生的收入。',
    tip2: '你的分成比例取决于 Quest 阶段。',
    tip3: '每月 15 日自动处理付款，无需手动申请提现。',
    tip4: '免费解锁、Gems、Vouchers、Story Cards 以及第 1–5 章不计入付费收入。',
    viewBenefits: '查看作者福利',
    loadFailed: '无法加载收入',
    tryAgain: '重试',
    thisMonth: '本月',
    incomeHeroBody: '你的收入以金额显示，Shadow 会在后台持续记录 Diamond 解锁产生的收入。',
    share: '分成',
    today: '今天',
    week: '本周',
    total: '总计',
    nextPayout: '下次付款',
    payoutAutomaticBody: '付款会自动处理，无需申请提现。',
    paymentReadyBody: '点击查看或更新你的收款信息。',
    paymentMissingBody: '点击添加银行二维码、PayPal 或手机号收款信息。',
    recentEarnings: '最近收入',
    recentEarningsBody: '来自付费 Diamond 解锁的净收入。',
    latest: '最新',
    noEarnings: '暂无收入',
    noEarningsBody: '读者解锁你的付费章节后，Diamond 解锁收入会显示在这里。',
    topSupporters: '主要支持者',
    topSupportersBody: '通过付费解锁支持你作品的读者。',
    noSupporters: '暂无支持者',
    noSupportersBody: '读者解锁付费章节后，主要支持者会显示在这里。',
    payoutHistory: '付款记录',
    payoutHistoryBody: '每月自动付款记录。',
    noPayout: '暂无付款',
    noPayoutBody: '管理员处理付款后，你的每月付款记录会显示在这里。',
    incomeRules: '收入规则',
    incomeRulesBody: '收入按套餐折扣后的 Diamond 解锁净收入计算。当前分成来自 Quest 进度。免费解锁、Gems、Vouchers、Story Cards 以及第 1–5 章不计入付费收入。',
  },
  ja: {
    notScheduled: 'まだ予定されていません',
    missing: '未設定',
    bankQr: '銀行QR',
    paypal: 'PayPal',
    phoneNumber: '電話番号',
    paymentMethod: '受取方法',
    episodeUnlock: 'エピソード解放',
    diamondUnlock: 'Diamond 解放',
    readerSupporter: '読者サポーター {{count}}',
    shareSuffix: '分配率 {{share}}',
    diamondUnlockSupporter: 'Diamond 解放サポーター',
    paidDate: '{{date}} に支払い済み',
    scheduledDate: '{{date}} に支払い予定',
    automaticMonthlyPayout: '毎月の自動支払い',
    monthlyPayout: '月次支払い',
    netPayout: '受取純額',
    statusPaid: '支払い済み',
    statusFailed: '失敗',
    statusMissingPaymentMethod: '受取方法が未設定',
    statusScheduled: '予定済み',
    statusAvailable: '利用可能',
    back: '戻る',
    info: '情報',
    myIncome: '収益',
    netAuthorEarnings: '作者の純収益',
    closeIncomeTip: '収益ガイドを閉じる',
    howIncomeWorks: '収益の仕組み',
    quickGuide: '作者収益のクイックガイド',
    tip1: '収益は金額で表示されますが、システムでは Diamond 解放からの収益を記録しています。',
    tip2: '分配率は Quest のステージによって決まります。',
    tip3: '支払いは毎月15日に自動処理されるため、出金申請は不要です。',
    tip4: '無料解放、Gems、Vouchers、Story Cards、エピソード1〜5は有料収益に含まれません。',
    viewBenefits: '作者特典を見る',
    loadFailed: '収益を読み込めませんでした',
    tryAgain: '再試行',
    thisMonth: '今月',
    incomeHeroBody: '収益は金額で表示され、Shadow はバックグラウンドで Diamond 解放による収益を記録します。',
    share: '分配率',
    today: '今日',
    week: '今週',
    total: '合計',
    nextPayout: '次回支払い',
    payoutAutomaticBody: '支払いは自動処理されるため、出金申請は不要です。',
    paymentReadyBody: 'タップして受取情報を確認または更新します。',
    paymentMissingBody: 'タップして銀行QR、PayPal、または電話番号の受取情報を追加します。',
    recentEarnings: '最近の収益',
    recentEarningsBody: '有料 Diamond 解放からの純収益。',
    latest: '最新',
    noEarnings: 'まだ収益はありません',
    noEarningsBody: '読者がロックされたエピソードを解放すると、Diamond 解放収益がここに表示されます。',
    topSupporters: 'トップサポーター',
    topSupportersBody: '有料解放で作品を支援した読者。',
    noSupporters: 'まだサポーターはいません',
    noSupportersBody: '有料エピソードが解放されると、強力なサポーターがここに表示されます。',
    payoutHistory: '支払い履歴',
    payoutHistoryBody: '毎月の自動支払い記録。',
    noPayout: 'まだ支払いはありません',
    noPayoutBody: '管理者が支払いを処理すると、月次支払い履歴がここに表示されます。',
    incomeRules: '収益ルール',
    incomeRulesBody: '収益はパッケージ割引後の Diamond 解放純収入から計算されます。現在の分配率は Quest の進捗で決まります。無料解放、Gems、Vouchers、Story Cards、エピソード1〜5は有料収益に含まれません。',
  },
  ko: {
    notScheduled: '아직 예정되지 않음',
    missing: '미설정',
    bankQr: '은행 QR',
    paypal: 'PayPal',
    phoneNumber: '전화번호',
    paymentMethod: '지급 방법',
    episodeUnlock: '에피소드 잠금 해제',
    diamondUnlock: 'Diamond 잠금 해제',
    readerSupporter: '독자 후원자 {{count}}',
    shareSuffix: '지분 {{share}}',
    diamondUnlockSupporter: 'Diamond 잠금 해제 후원자',
    paidDate: '{{date}} 지급 완료',
    scheduledDate: '{{date}} 지급 예정',
    automaticMonthlyPayout: '월 자동 지급',
    monthlyPayout: '월 지급',
    netPayout: '순 지급액',
    statusPaid: '지급 완료',
    statusFailed: '실패',
    statusMissingPaymentMethod: '지급 방법 없음',
    statusScheduled: '예정됨',
    statusAvailable: '사용 가능',
    back: '뒤로',
    info: '정보',
    myIncome: '내 수입',
    netAuthorEarnings: '작가 순수입',
    closeIncomeTip: '수입 안내 닫기',
    howIncomeWorks: '수입 계산 방식',
    quickGuide: '작가 수입 빠른 안내',
    tip1: '수입은 금액으로 표시되지만 시스템은 Diamond 잠금 해제에서 발생한 수입을 기록합니다.',
    tip2: '수익 지분은 Quest 단계에 따라 달라집니다.',
    tip3: '지급은 매월 15일 자동 처리되며 출금 요청이 필요하지 않습니다.',
    tip4: '무료 잠금 해제, Gems, Vouchers, Story Cards 및 에피소드 1~5는 유료 수입에 포함되지 않습니다.',
    viewBenefits: '작가 혜택 보기',
    loadFailed: '수입을 불러오지 못했습니다',
    tryAgain: '다시 시도',
    thisMonth: '이번 달',
    incomeHeroBody: '수입은 금액으로 표시되며 Shadow는 Diamond 잠금 해제 수입을 백그라운드에서 기록합니다.',
    share: '지분',
    today: '오늘',
    week: '이번 주',
    total: '전체',
    nextPayout: '다음 지급',
    payoutAutomaticBody: '지급은 자동 처리되므로 출금을 요청할 필요가 없습니다.',
    paymentReadyBody: '탭하여 지급 정보를 확인하거나 수정하세요.',
    paymentMissingBody: '탭하여 은행 QR, PayPal 또는 전화번호 지급 정보를 추가하세요.',
    recentEarnings: '최근 수입',
    recentEarningsBody: '유료 Diamond 잠금 해제의 순수입.',
    latest: '최신',
    noEarnings: '아직 수입이 없습니다',
    noEarningsBody: '독자가 잠긴 에피소드를 유료로 해제하면 Diamond 수입이 여기에 표시됩니다.',
    topSupporters: '상위 후원자',
    topSupportersBody: '유료 잠금 해제로 작품을 후원한 독자.',
    noSupporters: '아직 후원자가 없습니다',
    noSupportersBody: '독자가 유료 에피소드를 해제하면 주요 후원자가 여기에 표시됩니다.',
    payoutHistory: '지급 내역',
    payoutHistoryBody: '월 자동 지급 기록.',
    noPayout: '아직 지급 내역이 없습니다',
    noPayoutBody: '관리자가 지급을 처리하면 월 지급 내역이 여기에 표시됩니다.',
    incomeRules: '수입 규칙',
    incomeRulesBody: '수입은 패키지 할인 후 Diamond 잠금 해제 순수익을 기준으로 계산됩니다. 현재 지분은 Quest 진행도에 따라 결정됩니다. 무료 잠금 해제, Gems, Vouchers, Story Cards 및 에피소드 1~5는 유료 수입에 포함되지 않습니다.',
  },
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const INCOME_MANGA_IMAGES = [
  '/assets/Author Income/author-income-manga-girl.webp',
  '/assets/Author Benefits/author-benefits-manga-girl.webp',
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function money(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '$0.00'

  return number.toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function numberText(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0'

  return number.toLocaleString(getDisplayLanguageId(), {
    maximumFractionDigits: 2,
  })
}

function percent(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return '0%'

  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`
}

function dateText(value) {
  if (!value) return getDisplayText('authorIncomeOld.notScheduled')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return getDisplayText('authorIncomeOld.notScheduled')

  return date.toLocaleDateString(getDisplayLanguageId(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function dateTimeText(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(getDisplayLanguageId(), {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function methodLabel(method) {
  if (!method) return getDisplayText('authorIncomeOld.missing')
  if (method.method_type === 'bank_qr') return getDisplayText('authorIncomeOld.bankQr')
  if (method.method_type === 'paypal') return getDisplayText('authorIncomeOld.paypal')
  if (method.method_type === 'phone') return getDisplayText('authorIncomeOld.phoneNumber')
  return getDisplayText('authorIncomeOld.paymentMethod')
}

function statusStyle(status) {
  if (status === 'paid') return 'border-[#bfe5c8] bg-[#effbf2] text-[#3f8d56]'
  if (status === 'failed' || status === 'missing_payment_method') {
    return 'border-[#f2c8d6] bg-[#fff2f6] text-[#c8567c]'
  }
  if (status === 'scheduled') {
    return 'border-[#ead59b] bg-[#fff8e6] text-[#aa7512]'
  }
  return 'border-[#ddd1ec] bg-[#f6f1fb] text-[#785b99]'
}

function normalizeEarning(item, t) {
  const metadata = item.metadata || {}

  return {
    id: item.id,
    title: metadata.story_title || metadata.episode_title || t('authorIncomeOld.episodeUnlock'),
    subtitle: metadata.package_label || metadata.episode_title || t('authorIncomeOld.diamondUnlock'),
    amount: Number(item.author_net_payout_usd || 0),
    diamonds: Number(item.author_earned_diamonds || 0),
    share: Number(item.author_share_percent || 0),
    status: item.earning_status || 'available',
    createdAt: item.created_at,
  }
}

function getInitial(value) {
  return String(value || 'R').trim().slice(0, 1).toUpperCase() || 'R'
}

function supporterName(item, index, t) {
  return (
    item.reader_name ||
    item.display_name ||
    item.username ||
    item.reader_username ||
    t('authorIncomeOld.readerSupporter', { count: index + 1 })
  )
}

function supporterAvatar(item) {
  return (
    item.reader_avatar_url ||
    item.avatar_url ||
    item.profile_image_url ||
    ''
  )
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d6ef] bg-[var(--shadow-bg-surface)] text-[#60447f] shadow-[0_5px_16px_rgba(86,61,118,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding({ dark = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-[31px] border-r ${
        dark
          ? 'border-white/10 bg-[var(--shadow-bg-surface)]/[0.05]'
          : 'border-[#dfd0ef] bg-[linear-gradient(180deg,#eee4ff_0%,#fbf7ff_100%)]'
      }`}
    >
      {[28, 72, 116, 160, 204, 248, 292, 336, 380].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span
            className={`block h-[12px] w-[12px] rounded-full border-2 ${
              dark
                ? 'border-[#d6bbff] bg-[#5d4385]'
                : 'border-[#9d73d4] bg-[var(--shadow-bg-surface)]'
            }`}
          />
          <span
            className={`absolute left-[7px] top-[4px] h-[3px] w-[12px] rounded-full ${
              dark ? 'bg-[#e2ccff]' : 'bg-[#8f64c8]'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

function Tape({ className = '', blue = false }) {
  return (
    <div
      className={`pointer-events-none absolute h-6 w-[70px] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#b9d1ff]/75' : 'bg-[#f7bdd6]/75'
      } ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.4)_0_5px,transparent_5px_10px)]" />
    </div>
  )
}

function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <i className="fa-solid fa-star text-[12px] text-[#efb83d]" />
      <i className="fa-solid fa-heart ml-3 text-[10px] text-[#ef8fb7]" />
      <i className="fa-solid fa-star ml-3 text-[8px] text-[#a17bd7]" />
    </div>
  )
}

function IncomeMascot() {
  const [imageIndex, setImageIndex] = useState(0)

  if (imageIndex >= INCOME_MANGA_IMAGES.length) {
    return (
      <div className="relative flex h-[178px] w-[178px] items-center justify-center">
        <div className="absolute h-[142px] w-[142px] rounded-full bg-[#eadcff]/60" />
        <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[34px] border-4 border-white bg-[linear-gradient(145deg,#f7e4ff_0%,#f8bfd9_100%)] text-[#7651ad] shadow-[0_12px_26px_rgba(77,51,112,0.16)]">
          <i className="fa-solid fa-piggy-bank text-[42px]" />
          <i className="fa-solid fa-star absolute -right-2 top-3 text-[18px] text-[#efb63d]" />
          <i className="fa-solid fa-heart absolute -left-2 bottom-4 text-[15px] text-[#ed8fb5]" />
        </div>
      </div>
    )
  }

  return (
    <img
      src={INCOME_MANGA_IMAGES[imageIndex]}
      alt=""
      onError={() => setImageIndex((current) => current + 1)}
      className="h-[190px] w-[190px] object-contain object-bottom drop-shadow-[0_15px_27px_rgba(79,52,117,0.2)] sm:h-[225px] sm:w-[225px]"
    />
  )
}

function SmallStat({ label, value, icon, tone }) {
  const tones = {
    pink: 'border-[#efc5d7] bg-[#fff6fa] text-[#c65b83]',
    purple: 'border-[#d4c2ec] bg-[#f8f3ff] text-[#7652ad]',
    gold: 'border-[#ead398] bg-[#fff9e9] text-[#ac7610]',
  }

  return (
    <div
      className={`rounded-[18px] border px-2.5 py-3 text-center shadow-[0_4px_12px_rgba(72,51,96,0.04)] ${
        tones[tone] || tones.purple
      }`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <i className={`${icon} text-[9px] opacity-70`} />
        <div className="text-[16px] font-black tracking-[-0.03em]">{value}</div>
      </div>
      <div className="mt-1 text-[8.5px] font-black uppercase tracking-[0.07em] opacity-70">
        {label}
      </div>
    </div>
  )
}

function PaperCard({
  title,
  eyebrow,
  icon,
  children,
  onClick,
  tone = 'purple',
}) {
  const tones = {
    purple: {
      border: 'border-[#d8c8e9]',
      icon: 'bg-[#ede4ff] text-[#7552ad]',
      eyebrow: 'text-[#8b65b2]',
    },
    pink: {
      border: 'border-[#efccd9]',
      icon: 'bg-[#ffe5ef] text-[#d36691]',
      eyebrow: 'text-[#c55d84]',
    },
    gold: {
      border: 'border-[#e8d6a4]',
      icon: 'bg-[#fff0c9] text-[#c18a16]',
      eyebrow: 'text-[#a97818]',
    },
    blue: {
      border: 'border-[#cdd9f0]',
      icon: 'bg-[#e8efff] text-[#5974bd]',
      eyebrow: 'text-[#5f75b1]',
    },
  }

  const style = tones[tone] || tones.purple
  const Element = onClick ? 'button' : 'section'

  return (
    <Element
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-[27px] border ${style.border} bg-[var(--shadow-bg-surface)] p-4 text-left shadow-[0_10px_26px_rgba(85,59,117,0.07)] transition ${
        onClick ? 'active:scale-[0.99]' : ''
      }`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(112,86,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(112,86,142,0.03) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[7deg]" blue={tone === 'blue'} />

      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${style.icon}`}
        >
          <i className={`${icon} text-[15px]`} />
        </span>

        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div
              className={`text-[9px] font-black uppercase tracking-[0.11em] ${style.eyebrow}`}
            >
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-1 text-[18px] font-black tracking-[-0.035em] text-[var(--shadow-text-primary)]">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </Element>
  )
}

function LongSectionCard({
  title,
  subtitle,
  icon,
  tone = 'purple',
  action,
  children,
}) {
  const tones = {
    purple: {
      border: 'border-[#d8c8e9]',
      icon: 'bg-[#ede4ff] text-[#7652ad]',
    },
    pink: {
      border: 'border-[#efcbd9]',
      icon: 'bg-[#ffe4ef] text-[#d56894]',
    },
    gold: {
      border: 'border-[#ead6a2]',
      icon: 'bg-[#fff1cb] text-[#bd8614]',
    },
  }

  const style = tones[tone] || tones.purple

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${style.border} bg-[var(--shadow-bg-surface)] p-4 shadow-[0_11px_28px_rgba(85,59,117,0.07)]`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(112,86,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(112,86,142,0.03) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[7deg]" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] ${style.icon}`}
          >
            <i className={`${icon} text-[14px]`} />
          </span>

          <div className="min-w-0">
            <h2 className="text-[17px] font-black tracking-[-0.03em] text-[var(--shadow-text-primary)]">
              {title}
            </h2>
            <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              {subtitle}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  )
}

function EmptyState({ icon, title, text, tone = 'purple' }) {
  const tones = {
    purple: 'border-[#dfd2ec] bg-[#faf7ff] text-[#7652ad]',
    pink: 'border-[#efd0dc] bg-[#fff8fb] text-[#d06390]',
    gold: 'border-[#ead9aa] bg-[#fffaf0] text-[#b98216]',
  }

  return (
    <div
      className={`flex min-h-[150px] w-full items-center gap-4 rounded-[22px] border border-dashed px-4 py-5 ${
        tones[tone] || tones.purple
      }`}
    >
      <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[22px] border border-current/15 bg-[var(--shadow-bg-surface)] shadow-sm">
        <i className={`${icon} text-[23px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-black text-[var(--shadow-text-primary)]">{title}</div>
        <div className="mt-1 max-w-[390px] text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
          {text}
        </div>
      </div>

      <i className="fa-solid fa-star hidden shrink-0 text-[15px] text-[#efb63d]/70 sm:block" />
    </div>
  )
}

function EarningRow({ item }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="flex min-h-[82px] items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#eee5ff] text-[#7451ac]">
        <i className="fa-solid fa-gem text-[16px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
          {item.title}
        </div>
        <div className="mt-1 line-clamp-1 text-[10.5px] font-semibold text-[var(--shadow-text-secondary)]">
          {item.subtitle} · {t('authorIncomeOld.shareSuffix', { share: percent(item.share) })}
        </div>
        {item.createdAt ? (
          <div className="mt-1 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
            {dateTimeText(item.createdAt)}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[14px] font-black text-[#bc507c]">
          +{money(item.amount)}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[#8e7f98]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{numberText(item.diamonds)}</span>
        </div>
      </div>
    </div>
  )
}

function SupporterRow({ item, index }) {
  const { t } = useDisplayTranslation()
  const name = supporterName(item, index, t)
  const avatar = supporterAvatar(item)

  return (
    <div className="flex min-h-[86px] items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5">
      <div className="relative h-12 w-12 shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#f8d8e7_0%,#e0d0ff_100%)] text-[15px] font-black text-[#7452a5] shadow-sm">
            {getInitial(name)}
          </div>
        )}

        <span
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[8px] font-black ${
            index === 0
              ? 'bg-[#f4c348] text-[#6f4b00]'
              : 'bg-[#eee4ff] text-[#7551a9]'
          }`}
        >
          {index === 0 ? (
            <i className="fa-solid fa-crown text-[8px]" />
          ) : (
            index + 1
          )}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
          {name}
        </div>
        <div className="mt-1 text-[10.5px] font-semibold text-[var(--shadow-text-secondary)]">
          {t('authorIncomeOld.diamondUnlockSupporter')}
        </div>
        {item.reader_username ? (
          <div className="mt-1 line-clamp-1 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
            @{item.reader_username}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[13px] font-black text-[#b9517b]">
          {money(item.total_usd)}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-bold text-[#8e7f98]">
          <img
            src="/assets/Icons/Diamond.svg"
            alt=""
            className="h-3.5 w-3.5 object-contain"
          />
          <span>{numberText(item.total_diamonds)}</span>
        </div>
      </div>
    </div>
  )
}

function PayoutRow({ item }) {
  const { t } = useDisplayTranslation()
  const statusKey = String(item.status || 'scheduled')
  const status = {
    paid: t('authorIncomeOld.statusPaid'),
    failed: t('authorIncomeOld.statusFailed'),
    missing_payment_method: t('authorIncomeOld.statusMissingPaymentMethod'),
    scheduled: t('authorIncomeOld.statusScheduled'),
    available: t('authorIncomeOld.statusAvailable'),
  }[statusKey] || statusKey.replaceAll('_', ' ')
  const detail = item.paid_at
    ? t('authorIncomeOld.paidDate', { date: dateText(item.paid_at) })
    : item.scheduled_at
      ? t('authorIncomeOld.scheduledDate', { date: dateText(item.scheduled_at) })
      : t('authorIncomeOld.automaticMonthlyPayout')

  return (
    <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#b98215]">
          <i className="fa-solid fa-receipt text-[16px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
            {item.payout_month || t('authorIncomeOld.monthlyPayout')}
          </div>
          <div className="mt-1 text-[10.5px] font-semibold text-[var(--shadow-text-secondary)]">
            {detail}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[8.5px] font-black capitalize ${statusStyle(
                item.status
              )}`}
            >
              {status}
            </span>

            {item.payment_method_type ? (
              <span className="inline-flex rounded-full border border-[#ddd0eb] bg-[#f7f3fb] px-2.5 py-1 text-[8.5px] font-black text-[#765d8d]">
                {methodLabel({ method_type: item.payment_method_type })}
              </span>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[14px] font-black text-[#7651ad]">
            {money(item.net_payout_usd)}
          </div>
          <div className="mt-1 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
            {t('authorIncomeOld.netPayout')}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[300px] animate-pulse rounded-[30px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[138px] animate-pulse rounded-[27px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[138px] animate-pulse rounded-[27px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[235px] animate-pulse rounded-[28px] bg-[var(--shadow-bg-surface)]" />
    </div>
  )
}

export default function AuthorIncomePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadIncome() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/authors/me/income`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || t('authorIncomeOld.loadFailed'))
        }

        if (!ignore) {
          setData(result)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('authorIncomeOld.loadFailed'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadIncome()

    return () => {
      ignore = true
    }
  }, [navigate, t])

  const recentEarnings = useMemo(() => {
    return (data?.recent_earnings || []).map((item) => normalizeEarning(item, t))
  }, [data, t])

  const paymentMethod = data?.payment_method?.primary || null
  const paymentComplete = Boolean(data?.payment_method?.complete)

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <div className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label={t('authorIncomeOld.back')}
            onClick={() => navigate('/author/profile', { replace: true })}
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-[9px] text-[#efb73e]" />
              <h1 className="text-[19px] font-black tracking-[-0.04em] text-[var(--shadow-text-primary)]">
                {t('authorIncomeOld.myIncome')}
              </h1>
              <i className="fa-solid fa-heart text-[9px] text-[#ed8fb5]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--shadow-text-tertiary)]">
              {t('authorIncomeOld.netAuthorEarnings')}
            </p>
          </div>

          <HeaderButton
            icon="fa-solid fa-circle-info"
            label={t('authorIncomeOld.info')}
            onClick={() => setShowTip(true)}
          />
        </div>
      </div>

      {showTip ? (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 px-4 pb-4 sm:items-center sm:pb-0">
          <button
            type="button"
            aria-label={t('authorIncomeOld.closeIncomeTip')}
            onClick={() => setShowTip(false)}
            className="absolute inset-0"
          />

          <div
            className="relative w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 shadow-2xl"
            style={{
              backgroundImage:
                'linear-gradient(rgba(112,86,142,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(112,86,142,0.035) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <Tape className="-right-3 top-4 rotate-[8deg]" />

            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-[18px] font-black text-[var(--shadow-text-primary)]">
                  {t('authorIncomeOld.howIncomeWorks')}
                </div>
                <div className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                  {t('authorIncomeOld.quickGuide')}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTip(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1e9f8] text-[#7959a0]"
              >
                <i className="fa-solid fa-xmark text-[12px]" />
              </button>
            </div>

            <div className="space-y-2.5 text-[11.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              <p className="rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
                {t('authorIncomeOld.tip1')}
              </p>
              <p className="rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
                {t('authorIncomeOld.tip2')}
              </p>
              <p className="rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
                {t('authorIncomeOld.tip3')}
              </p>
              <p className="rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3">
                {t('authorIncomeOld.tip4')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowTip(false)
                navigate('/author/benefits')
              }}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#7b55b2_0%,#a66bd0_100%)] text-[13px] font-black text-white shadow-[0_8px_18px_rgba(110,75,156,0.2)] active:scale-[0.99]"
            >
              {t('authorIncomeOld.viewBenefits')}
              <i className="fa-solid fa-star text-[8px] text-[#ffdf79]" />
            </button>
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[26px] border border-[#efccd8] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-[0_10px_26px_rgba(87,61,116,0.08)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe8ef] text-[#d7618d]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[var(--shadow-text-primary)]">
              {error}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#7651ad] px-6 text-[12px] font-black text-white active:scale-95"
            >
              {t('authorIncomeOld.tryAgain')}
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section
              className="relative overflow-hidden rounded-[30px] border border-[#c9b4eb] bg-[linear-gradient(145deg,#7759ad_0%,#8d68bd_48%,#7453a7_100%)] text-white shadow-[0_17px_38px_rgba(85,56,125,0.2)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <SpiralBinding dark />
              <Sparkles className="absolute right-5 top-4" />
              <Tape className="left-12 top-3 rotate-[-8deg]" blue />

              <div className="relative min-h-[306px] pl-[45px] pr-3 pt-5">
                <div className="absolute right-[-24px] top-[53px] z-0 sm:right-3 sm:top-[30px]">
                  <IncomeMascot />
                </div>

                <div className="relative z-10 max-w-[61%] sm:max-w-[55%]">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[var(--shadow-bg-surface)]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#ffe9a0]">
                    <i className="fa-solid fa-star text-[7px]" />
                    {t('authorIncomeOld.thisMonth')}
                  </div>

                  <div className="mt-3 text-[44px] font-black leading-none tracking-[-0.065em] text-[#fff8ed] drop-shadow-[0_2px_0_rgba(67,43,100,0.3)] sm:text-[52px]">
                    {money(data.income?.this_month_usd)}
                  </div>

                  <p className="mt-3 max-w-[260px] text-[10.5px] font-semibold leading-5 text-white/75">
                    {t('authorIncomeOld.incomeHeroBody')}
                  </p>
                </div>

                <div className="absolute right-4 top-4 z-20 rotate-[2deg] rounded-[16px] border border-[#efd39b] bg-[#fff7e6] px-3 py-2.5 text-center shadow-[0_7px_18px_rgba(61,43,88,0.18)]">
                  <div className="text-[8px] font-black uppercase tracking-[0.08em] text-[#9c799f]">
                    {t('authorIncomeOld.share')}
                  </div>
                  <div className="mt-1 text-[20px] font-black text-[#c15480]">
                    {percent(data.current_share_percent)}
                  </div>
                </div>

                <div className="relative z-20 mb-4 mt-6 grid grid-cols-3 gap-2 rounded-[22px] border border-white/15 bg-[var(--shadow-bg-surface)] p-2.5 shadow-[0_10px_24px_rgba(54,37,81,0.15)]">
                  <SmallStat
                    label={t('authorIncomeOld.today')}
                    value={money(data.income?.today_usd)}
                    icon="fa-regular fa-calendar"
                    tone="pink"
                  />
                  <SmallStat
                    label={t('authorIncomeOld.week')}
                    value={money(data.income?.this_week_usd)}
                    icon="fa-regular fa-calendar-days"
                    tone="purple"
                  />
                  <SmallStat
                    label={t('authorIncomeOld.total')}
                    value={money(data.income?.total_usd)}
                    icon="fa-solid fa-medal"
                    tone="gold"
                  />
                </div>
              </div>
            </section>

            <PaperCard
              title={dateText(data.next_payout_date)}
              eyebrow={t('authorIncomeOld.nextPayout')}
              icon="fa-solid fa-calendar-check"
              tone="pink"
            >
              <p className="mt-2 max-w-[470px] text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorIncomeOld.payoutAutomaticBody')}
              </p>
            </PaperCard>

            <PaperCard
              title={paymentComplete ? methodLabel(paymentMethod) : t('authorIncomeOld.missing')}
              eyebrow={t('authorIncomeOld.paymentMethod')}
              icon={paymentComplete ? 'fa-solid fa-qrcode' : 'fa-solid fa-circle-exclamation'}
              tone="purple"
              onClick={() => navigate('/author/payment-method')}
            >
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="max-w-[470px] text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                  {paymentComplete
                    ? t('authorIncomeOld.paymentReadyBody')
                    : t('authorIncomeOld.paymentMissingBody')}
                </p>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0e8fa] text-[#7d5aa7]">
                  <i className="fa-solid fa-chevron-right text-[9px]" />
                </span>
              </div>
            </PaperCard>

            <LongSectionCard
              title={t('authorIncomeOld.recentEarnings')}
              subtitle={t('authorIncomeOld.recentEarningsBody')}
              icon="fa-solid fa-gem"
              tone="purple"
              action={
                <span className="rounded-full border border-[#e0d4eb] bg-[#f5effa] px-3 py-1.5 text-[9px] font-black text-[#775a95]">
                  {t('authorIncomeOld.latest')}
                </span>
              }
            >
              {recentEarnings.length ? (
                <div className="space-y-2.5">
                  {recentEarnings.map((item) => (
                    <EarningRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-gem"
                  title={t('authorIncomeOld.noEarnings')}
                  text={t('authorIncomeOld.noEarningsBody')}
                  tone="purple"
                />
              )}
            </LongSectionCard>

            <LongSectionCard
              title={t('authorIncomeOld.topSupporters')}
              subtitle={t('authorIncomeOld.topSupportersBody')}
              icon="fa-solid fa-heart"
              tone="pink"
            >
              {data.top_supporters?.length ? (
                <div className="space-y-2.5">
                  {data.top_supporters.map((item, index) => (
                    <SupporterRow
                      key={item.reader_id || index}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-users"
                  title={t('authorIncomeOld.noSupporters')}
                  text={t('authorIncomeOld.noSupportersBody')}
                  tone="pink"
                />
              )}
            </LongSectionCard>

            <LongSectionCard
              title={t('authorIncomeOld.payoutHistory')}
              subtitle={t('authorIncomeOld.payoutHistoryBody')}
              icon="fa-solid fa-receipt"
              tone="gold"
            >
              {data.payout_history?.length ? (
                <div className="space-y-2.5">
                  {data.payout_history.map((item) => (
                    <PayoutRow key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="fa-solid fa-receipt"
                  title={t('authorIncomeOld.noPayout')}
                  text={t('authorIncomeOld.noPayoutBody')}
                  tone="gold"
                />
              )}
            </LongSectionCard>

            <button
              type="button"
              onClick={() => navigate('/author/quest?from=income')}
              className="relative w-full overflow-hidden rounded-[28px] border border-[#dfcee9] bg-[var(--shadow-bg-surface)] p-4 text-left shadow-[0_10px_26px_rgba(85,59,117,0.07)] transition active:scale-[0.99]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(112,86,142,0.03) 1px, transparent 1px)',
                backgroundSize: '100% 22px',
              }}
            >
              <Tape className="-right-4 top-3 rotate-[8deg]" />

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#b98215]">
                  <i className="fa-solid fa-scale-balanced text-[16px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[15px] font-black text-[var(--shadow-text-primary)]">
                      {t('authorIncomeOld.incomeRules')}
                    </div>
                    <i className="fa-solid fa-star text-[8px] text-[#efb63d]" />
                  </div>

                  <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {t('authorIncomeOld.incomeRulesBody')}
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eee5f7] text-[#7957a1]">
                  <i className="fa-solid fa-chevron-right text-[10px]" />
                </div>
              </div>
            </button>
          </>
        ) : null}
      </main>
    </div>
  )
}
