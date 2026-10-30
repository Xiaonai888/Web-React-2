import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('authorAdsCampaignDetail', {
  en: {
    title: 'Campaign details', back: 'Back to My Campaigns', manage: 'Manage Campaign',
    draft: 'Draft', pending_review: 'Pending review', approved: 'Approved', scheduled: 'Scheduled',
    active: 'Active', paused: 'Paused', completed: 'Completed', rejected: 'Rejected',
    cancelled: 'Cancelled', unknownStatus: 'Unknown status', post: 'Boost Post',
    story: 'Boost Story', product: 'Store book / PDF', otherType: 'Content',
    budget: 'Total budget', spent: 'Amount spent', remaining: 'Remaining',
    unfunded: 'Not funded', funding: 'Funding', fundingDiamonds: 'Diamonds',
    fundingUsd: 'Legacy USD', fundingUnknown: 'Unverified',
    duration: 'Duration', days: '{{count}} days', objective: 'Goal',
    audience: 'Audience', automatic: 'Automatic', manual: 'Custom',
    preview: 'Promoted content', published: 'Published content',
    review: 'Review status', startDate: 'Started', endDate: 'Ends',
    created: 'Created', notAvailable: '—', reload: 'Refresh', loading: 'Loading campaign...',
    unavailable: 'Could not load this campaign. Try again.', invalid: 'Invalid campaign link.',
    missing: 'Campaign not found or unavailable.',
    submit: 'Submit for review', start: 'Start campaign', pause: 'Pause campaign',
    resume: 'Resume campaign', delete: 'Delete draft', edit: 'Edit draft', processing: 'Working...',
    confirmSubmit: 'Submit this draft for review? It will become locked for editing.',
    confirmStart: 'Start this campaign? Delivery will begin if the server allows it.',
    confirmDiamondStart: 'Start and reserve {{count}} Diamonds from your Reader wallet? This uses your actual Diamonds balance.',
    confirmPause: 'Pause delivery? The scheduled end date will not be extended.',
    confirmResume: 'Resume delivery? The original end date will not change.',
    confirmDelete: 'Permanently delete this unpaid draft?',
    submitted: 'Submitted for review.', started: 'Campaign started.',
    pausedNotice: 'Campaign paused.', resumed: 'Campaign resumed.',
    deleted: 'Draft deleted.', unchanged: 'Campaign status was not changed. Refresh to check it.',
    actionFailed: 'Could not complete the action. Refresh and try again.',
    paymentRequired: 'Verified funding is required to resume this campaign.',
    deliveryUnavailable: 'Campaign delivery is not enabled yet.',
    rateLimited: 'Too many requests. Please try again later.',
    blocked: 'Campaign status or payment has changed. Refresh before retrying.',
    authRequired: 'Sign in to manage this campaign.',
    legacyHint: 'Legacy USD funding is displayed separately from Diamonds.',
    draftHint: 'Drafts are not live. Submit the draft and wait for approval before starting it.',
    moneyHint: 'Spending and funding figures come from the saved campaign, not estimated reach.',
    reachedEnd: 'The campaign end date has passed.',
  },
  km: {
    title: 'ព័ត៌មាន Campaign', back: 'ត្រឡប់ទៅ My Campaigns', manage: 'គ្រប់គ្រង Campaign',
    draft: 'Draft', pending_review: 'រង់ចាំត្រួតពិនិត្យ', approved: 'បានអនុម័ត', scheduled: 'បានកំណត់ពេល',
    active: 'កំពុងផ្សាយ', paused: 'បានផ្អាក', completed: 'បានបញ្ចប់', rejected: 'បដិសេធ',
    cancelled: 'បានលុបចោល', unknownStatus: 'មិនស្គាល់ស្ថានភាព', post: 'Boost Post',
    story: 'Boost Story', product: 'សៀវភៅ / PDF', otherType: 'មាតិកា',
    budget: 'ថវិកាសរុប', spent: 'បានចំណាយ', remaining: 'នៅសល់',
    unfunded: 'មិនទាន់មានមូលនិធិ', funding: 'ប្រភពថវិកា', fundingDiamonds: 'ពេជ្រ',
    fundingUsd: 'USD ចាស់', fundingUnknown: 'មិនទាន់ផ្ទៀងផ្ទាត់',
    duration: 'រយៈពេល', days: '{{count}} ថ្ងៃ', objective: 'គោលដៅ',
    audience: 'ក្រុមគោលដៅ', automatic: 'ស្វ័យប្រវត្តិ', manual: 'ជ្រើសដោយខ្លួនឯង',
    preview: 'មាតិកាផ្សព្វផ្សាយ', published: 'មាតិកាបានបង្ហោះ',
    review: 'ស្ថានភាពពិនិត្យ', startDate: 'ចាប់ផ្តើម', endDate: 'បញ្ចប់',
    created: 'បង្កើតនៅ', notAvailable: '—', reload: 'ផ្ទុកឡើងវិញ', loading: 'កំពុងផ្ទុក Campaign...',
    unavailable: 'មិនអាចផ្ទុក Campaign បានទេ។ សូមសាកម្តងទៀត។', invalid: 'Link Campaign មិនត្រឹមត្រូវ។',
    missing: 'រកមិនឃើញ Campaign ឬមិនមានសិទ្ធិមើល។',
    submit: 'ដាក់ស្នើពិនិត្យ', start: 'ចាប់ផ្តើមផ្សាយ', pause: 'ផ្អាកផ្សាយ',
    resume: 'បន្តផ្សាយ', delete: 'លុប Draft', edit: 'កែ Draft', processing: 'កំពុងដំណើរការ...',
    confirmSubmit: 'ដាក់ស្នើ Draft នេះឱ្យពិនិត្យមែនទេ? បន្ទាប់មកមិនអាចកែបានទេ។',
    confirmStart: 'ចាប់ផ្តើម Campaign នេះមែនទេ? នឹងផ្សាយបើ Server អនុញ្ញាត។',
    confirmDiamondStart: 'ចាប់ផ្តើម និងកក់ {{count}} ពេជ្រពីគណនី Reader មែនទេ?',
    confirmPause: 'ផ្អាកការផ្សាយមែនទេ? ថ្ងៃបញ្ចប់នឹងមិនពន្យារទេ។',
    confirmResume: 'បន្តការផ្សាយមែនទេ? ថ្ងៃបញ្ចប់នៅដដែល។',
    confirmDelete: 'លុប Draft ដែលមិនទាន់បង់នេះជាអចិន្ត្រៃយ៍មែនទេ?',
    submitted: 'បានដាក់ស្នើពិនិត្យ។', started: 'បានចាប់ផ្តើម Campaign។',
    pausedNotice: 'បានផ្អាក Campaign។', resumed: 'បានបន្ត Campaign។',
    deleted: 'បានលុប Draft។', unchanged: 'ស្ថានភាពមិនបានផ្លាស់ប្តូរ។ សូម Refresh។',
    actionFailed: 'មិនអាចអនុវត្តបានទេ។ សូម Refresh ហើយសាកម្តងទៀត។',
    paymentRequired: 'ត្រូវមានមូលនិធិបានផ្ទៀងផ្ទាត់មុនបន្តផ្សាយ។',
    deliveryUnavailable: 'ប្រព័ន្ធផ្សាយ Campaign មិនទាន់បើកទេ។',
    rateLimited: 'សំណើច្រើនពេក។ សូមសាកនៅពេលក្រោយ។',
    blocked: 'ស្ថានភាព ឬថវិកាបានប្រែប្រួល។ សូម Refresh។',
    authRequired: 'ត្រូវចូលគណនីដើម្បីគ្រប់គ្រង Campaign។',
    legacyHint: 'ការបង់ជា USD ចាស់បង្ហាញដាច់ដោយឡែកពីពេជ្រ។',
    draftHint: 'Draft មិនទាន់ផ្សាយទេ។ ដាក់ស្នើ រង់ចាំការអនុម័ត រួចទើបចាប់ផ្តើម។',
    moneyHint: 'ទិន្នន័យចំណាយមកពី Campaign ពិត មិនមែន Reach ប៉ាន់ស្មាន។',
    reachedEnd: 'Campaign បានផុតថ្ងៃបញ្ចប់។',
  },
  zh: {
    title: '活动详情', back: '返回我的活动', manage: '管理活动', draft: '草稿',
    pending_review: '待审核', approved: '已批准', scheduled: '已安排', active: '投放中',
    paused: '已暂停', completed: '已完成', rejected: '已拒绝', cancelled: '已取消',
    unknownStatus: '未知状态', post: '推广帖子', story: '推广故事', product: '书籍 / PDF', otherType: '内容',
    budget: '总预算', spent: '已花费', remaining: '剩余', unfunded: '未充值', funding: '资金',
    fundingDiamonds: '钻石', fundingUsd: '旧版美元', fundingUnknown: '未核实',
    duration: '时长', days: '{{count}} 天', objective: '目标', audience: '受众',
    automatic: '自动', manual: '自定义', preview: '推广内容', published: '发布的内容',
    review: '审核状态', startDate: '开始', endDate: '结束', created: '创建时间',
    notAvailable: '—', reload: '刷新', loading: '正在加载活动...', unavailable: '无法加载活动，请重试。',
    invalid: '活动链接无效。', missing: '活动不存在或无法访问。',
    submit: '提交审核', start: '开始投放', pause: '暂停投放', resume: '恢复投放',
    delete: '删除草稿', edit: '编辑草稿', processing: '处理中...',
    confirmSubmit: '提交审核？提交后草稿将被锁定。', confirmStart: '开始投放此活动？',
    confirmDiamondStart: '开始并从读者钱包预留 {{count}} 钻石？',
    confirmPause: '暂停投放？结束日期不变。', confirmResume: '恢复投放？结束日期不变。',
    confirmDelete: '永久删除此未付款草稿？', submitted: '已提交审核。',
    started: '已开始。', pausedNotice: '已暂停。', resumed: '已恢复。',
    deleted: '草稿已删除。', unchanged: '活动未变更，请刷新。',
    actionFailed: '操作失败，请刷新重试。', paymentRequired: '恢复活动需要已验证资金。',
    deliveryUnavailable: '广告投放尚未开放。', rateLimited: '请求频繁，请稍后重试。',
    blocked: '状态或资金已变更，请刷新。', authRequired: '请先登录。',
    legacyHint: '旧版美元资金与钻石分开显示。', draftHint: '草稿尚未投放，需提交审核并获批。',
    moneyHint: '金额来自已保存的活动记录，不是预测覆盖。', reachedEnd: '活动已过结束日期。',
  },
  ja: {
    title: 'キャンペーン詳細', back: 'キャンペーンに戻る', manage: '管理', draft: '下書き',
    pending_review: '審査待ち', approved: '承認済み', scheduled: '予定', active: '配信中',
    paused: '一時停止', completed: '完了', rejected: '却下', cancelled: 'キャンセル',
    unknownStatus: '不明', post: '投稿を宣伝', story: 'ストーリーを宣伝', product: '書籍 / PDF', otherType: '内容',
    budget: '総予算', spent: '使用済み', remaining: '残額', unfunded: '未入金', funding: '資金',
    fundingDiamonds: 'ダイヤ', fundingUsd: '旧USD', fundingUnknown: '未検証',
    duration: '期間', days: '{{count}}日', objective: '目標', audience: '対象',
    automatic: '自動', manual: '手動', preview: '宣伝内容', published: '公開済み内容',
    review: '審査状態', startDate: '開始', endDate: '終了', created: '作成',
    notAvailable: '—', reload: '更新', loading: '読み込み中...', unavailable: '読み込めませんでした。',
    invalid: '無効なリンクです。', missing: 'キャンペーンがありません。',
    submit: '審査に提出', start: '配信開始', pause: '停止', resume: '再開',
    delete: '下書きを削除', edit: '下書きを編集', processing: '処理中...',
    confirmSubmit: '審査に提出しますか？編集できなくなります。', confirmStart: '配信を開始しますか？',
    confirmDiamondStart: '{{count}}ダイヤを確保して開始しますか？',
    confirmPause: '停止しますか？終了日は変わりません。', confirmResume: '再開しますか？終了日は変わりません。',
    confirmDelete: '未払いの下書きを完全に削除しますか？', submitted: '審査に提出しました。',
    started: '開始しました。', pausedNotice: '停止しました。', resumed: '再開しました。',
    deleted: '下書きを削除しました。', unchanged: '変更されませんでした。更新してください。',
    actionFailed: '操作に失敗しました。更新してください。', paymentRequired: '再開には資金が必要です。',
    deliveryUnavailable: '配信はまだ利用できません。', rateLimited: 'しばらくして再試行してください。',
    blocked: '状態が変わりました。更新してください。', authRequired: 'ログインしてください。',
    legacyHint: '旧USDの資金は別表示です。', draftHint: '下書きは配信されません。審査と承認が必要です。',
    moneyHint: '金額は記録済みデータであり、推定リーチではありません。', reachedEnd: '終了日を過ぎています。',
  },
  ko: {
    title: '캠페인 상세', back: '캠페인으로 돌아가기', manage: '관리', draft: '초안',
    pending_review: '검토 대기', approved: '승인', scheduled: '예약', active: '운영 중',
    paused: '일시정지', completed: '완료', rejected: '거부', cancelled: '취소',
    unknownStatus: '알 수 없음', post: '게시물 홍보', story: '스토리 홍보', product: '도서 / PDF', otherType: '콘텐츠',
    budget: '전체 예산', spent: '사용액', remaining: '잔액', unfunded: '미결제', funding: '자금',
    fundingDiamonds: '다이아', fundingUsd: '기존 USD', fundingUnknown: '미확인',
    duration: '기간', days: '{{count}}일', objective: '목표', audience: '대상',
    automatic: '자동', manual: '수동', preview: '홍보 콘텐츠', published: '게시된 콘텐츠',
    review: '검토 상태', startDate: '시작', endDate: '종료', created: '생성',
    notAvailable: '—', reload: '새로고침', loading: '캠페인 로드 중...', unavailable: '불러오지 못했습니다.',
    invalid: '잘못된 링크입니다.', missing: '캠페인이 없습니다.',
    submit: '검토 요청', start: '캠페인 시작', pause: '일시정지', resume: '재개',
    delete: '초안 삭제', edit: '초안 수정', processing: '처리 중...',
    confirmSubmit: '검토를 요청할까요? 이후 수정할 수 없습니다.', confirmStart: '캠페인을 시작할까요?',
    confirmDiamondStart: 'Reader 지갑에서 다이아 {{count}}개를 예약하고 시작할까요?',
    confirmPause: '중지할까요? 종료일은 연장되지 않습니다.', confirmResume: '재개할까요? 종료일은 변경되지 않습니다.',
    confirmDelete: '미결제 초안을 완전히 삭제할까요?', submitted: '검토 요청됨.',
    started: '시작됨.', pausedNotice: '중지됨.', resumed: '재개됨.',
    deleted: '초안 삭제됨.', unchanged: '상태가 변경되지 않았습니다. 새로고침하세요.',
    actionFailed: '실패했습니다. 새로고침 후 다시 시도하세요.', paymentRequired: '재개하려면 확인된 자금이 필요합니다.',
    deliveryUnavailable: '광고 게재가 아직 활성화되지 않았습니다.', rateLimited: '잠시 후 다시 시도하세요.',
    blocked: '상태 또는 자금이 변경되었습니다. 새로고침하세요.', authRequired: '로그인하세요.',
    legacyHint: '기존 USD 자금은 다이아와 별도로 표시됩니다.', draftHint: '초안은 아직 게재되지 않습니다. 승인 후 시작하세요.',
    moneyHint: '금액은 기록된 사용액이며 예상 도달이 아닙니다.', reachedEnd: '종료일이 지났습니다.',
  },
})

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isAuthorCampaignId = value => UUID_RE.test(String(value || ''))

export function authorCampaignContentKey(campaign) {
  if (campaign?.kind === 'post' || campaign?.contentType === 'post') return 'post'
  if (campaign?.contentType === 'story') return 'story'
  if (campaign?.contentType === 'product') return 'product'
  return 'otherType'
}

export function authorCampaignStatusKey(campaign) {
  const status = String(campaign?.status || '').toLowerCase()
  return ['draft', 'pending_review', 'approved', 'scheduled', 'active', 'paused', 'completed', 'rejected', 'cancelled'].includes(status)
    ? status : 'unknownStatus'
}

export function safeAuthorCampaignImage(url) {
  const value = String(url || '').trim()
  return /^https:\/\/[^/]+/i.test(value) || /^\/(?!\/)/.test(value) ? value : ''
}

export function authorCampaignMoney(campaign) {
  const numeric = value => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0
  const type = campaign?.fundingType
  const legacy = type === 'usd'
  const valid = ['usd', 'diamonds', 'unfunded'].includes(type)
  const budget = legacy ? numeric(campaign?.budgetUsd) : numeric(campaign?.budgetDiamonds ?? numeric(campaign?.budgetUsd) * 100)
  const spent = legacy ? numeric(campaign?.spentUsd) : numeric(campaign?.spentDiamonds)
  const remaining = legacy
    ? Math.max(0, numeric(campaign?.fundedUsd) - numeric(campaign?.spentUsd) - numeric(campaign?.refundedUsd))
    : type === 'diamonds' ? numeric(campaign?.remainingDiamonds) : 0
  return { legacy, valid, budget, spent, remaining, unit: legacy ? 'USD' : 'diamonds' }
}

export function formatAuthorCampaignAmount(value, unit = 'diamonds') {
  const amount = Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0
  return unit === 'USD'
    ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `${Math.round(amount).toLocaleString('en-US')} 💎`
}

export function isAuthorCampaignExpired(campaign) {
  if (!campaign?.endAt) return false
  const endsAt = Date.parse(campaign.endAt)
  return Number.isFinite(endsAt) && endsAt <= Date.now()
}

export function availableAuthorCampaignActions(campaign) {
  if (!campaign || typeof campaign !== 'object') return []
  const { status, reviewStatus, fundingType, paymentRequired } = campaign
  const money = authorCampaignMoney(campaign)
  const actions = []
  const draft = status === 'draft' && reviewStatus === 'not_submitted'
  if (draft && ['unfunded', 'usd'].includes(fundingType) && money.spent === 0 &&
    (fundingType !== 'usd' || (Number(campaign?.fundedUsd) || 0) === 0)) {
    actions.push('edit', 'submit', 'delete')
  }
  if (status === 'approved' && (
    (fundingType === 'unfunded' && money.budget >= 100) ||
    ((fundingType === 'diamonds' || fundingType === 'usd') && paymentRequired === false && money.remaining > 0)
  )) actions.push('start')
  if (status === 'active' && !isAuthorCampaignExpired(campaign)) actions.push('pause')
  if (status === 'paused' && !isAuthorCampaignExpired(campaign) && paymentRequired === false &&
    ['diamonds', 'usd'].includes(fundingType) && money.remaining > 0) actions.push('resume')
  return actions
}

export function describeAuthorCampaignAudience(campaign, t) {
  const audience = campaign?.audience || {}
  const name = audience.mode === 'manual' ? t('authorAdsCampaignDetail.manual') : t('authorAdsCampaignDetail.automatic')
  if (audience.mode !== 'manual') return name
  const details = [audience.genre, audience.language?.toUpperCase(), audience.country].filter(Boolean)
  return details.length ? `${name} · ${details.join(' · ')}` : name
}
