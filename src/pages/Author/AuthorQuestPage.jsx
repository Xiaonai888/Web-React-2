import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorQuest', {
  en: {
    notActive: 'Not active',
    back: 'Back',
    title: 'Quest',
    subtitle: 'Stage and creator rewards',
    tryAgain: 'Try Again',
    currentShare: 'Current Share',
    youAreOn: 'You are on',
    stageNumber: 'Stage {{number}}',
    boostActiveUntil: '100-Day Creator Boost active until {{date}}.',
    keepGrowing: 'Keep growing to unlock higher share levels.',
    nextMilestone: 'Next Milestone: Stage {{number}}',
    maxStage: 'Maximum normal stage reached',
    unlockShare: 'Unlock {{share}} Share',
    greatWork: 'Great work',
    keepGoing: 'Keep going',
    percentComplete: '{{percent}}% complete',
    toReachStage: 'To Reach Stage {{number}}',
    completeMilestonesShare: 'Complete these milestones to grow your share to {{share}}.',
    normalStagesCompleted: 'Normal Stages Completed',
    highestNormalStage: 'You have reached the highest normal Quest share stage.',
    focusBoostMilestones: 'You can now focus on the 100-Day Creator Boost milestones.',
    stageRoadmap: 'Stage Roadmap',
    roadmapSubtitle: 'Your author share grows as you complete each stage.',
    authorShare: 'Author share',
    completed: 'Completed',
    current: 'Current',
    locked: 'Locked',
    stage: 'Stage',
    episodes: 'Episodes',
    words: 'Words',
    likes: 'Likes',
    followers: 'Followers',
    paidFans: 'Paid Fans',
    earnings: 'Earnings',
    policy: 'Policy',
    views: 'Views',
    readHours: 'Read Hours',
    ratings: 'Ratings',
    done: 'Done',
    questRules: 'Quest Rules',
    rule1: 'Quest progress is calculated from published stories and verified reader activity.',
    rule2: 'Paid income comes from Diamond unlocks only.',
    rule3: '100-Day Creator Boost requires all required milestones plus any 3 growth milestones.',
    rule4: 'The 100-Day Creator Boost can be used only once per author account.',
    writeCreateGrow: 'Write · Create · Grow',
    loadFailed: 'Failed to load author quest',
    activateConfirm: 'Activate the 100-Day Creator Boost now? It starts immediately, cannot be paused, and can be used only once.',
    activateFailed: 'Failed to activate 100-Day Creator Boost',
    refreshFailed: 'Boost activated, but the page could not refresh',
    activateSuccess: '100-Day Creator Boost activated successfully',
    lifetimeReward: 'Lifetime Reward',
    boostTitle: '100-Day Creator Boost',
    boostDescription: 'Earn 100% revenue share for 100 days. One time only per author account.',
    creatorTreasure: 'Creator Treasure',
    creatorTreasureBody: 'Complete your milestones and unlock the one-time 100-day reward.',
    boostReady: 'Your 100-Day Creator Boost is ready.',
    boostReadyBody: 'It starts immediately, cannot be paused, and can be activated only once.',
    activating: 'Activating...',
    activateBoost: 'Activate 100-Day Boost',
    boostEnded: 'This one-time 100-Day Creator Boost has ended.',
    requiredMilestones: 'Required Milestones',
    requiredMilestonesBody: 'Complete all required milestones.',
    growthMilestones: 'Growth Milestones',
    growthMilestonesBody: 'Complete any 3 of 5.',
    statusLocked: 'Locked',
    statusEligible: 'Eligible',
    statusActive: 'Active',
    statusExpired: 'Expired',
    statusUsed: 'Used',
  },
  km: {
    notActive: 'មិនទាន់សកម្ម',
    back: 'ត្រឡប់ក្រោយ',
    title: 'Quest',
    subtitle: 'កម្រិត និងរង្វាន់អ្នកបង្កើត',
    tryAgain: 'សាកម្តងទៀត',
    currentShare: 'ចំណែកបច្ចុប្បន្ន',
    youAreOn: 'អ្នកនៅ',
    stageNumber: 'កម្រិត {{number}}',
    boostActiveUntil: 'Boost អ្នកបង្កើត 100 ថ្ងៃ សកម្មរហូតដល់ {{date}}។',
    keepGrowing: 'បន្តរីកចម្រើន ដើម្បីដោះសោចំណែកកម្រិតខ្ពស់ជាង។',
    nextMilestone: 'Milestone បន្ទាប់៖ កម្រិត {{number}}',
    maxStage: 'បានដល់កម្រិតធម្មតាខ្ពស់បំផុត',
    unlockShare: 'ដោះសោចំណែក {{share}}',
    greatWork: 'ធ្វើបានល្អ',
    keepGoing: 'បន្តទៅមុខ',
    percentComplete: 'រួចរាល់ {{percent}}%',
    toReachStage: 'ដើម្បីដល់កម្រិត {{number}}',
    completeMilestonesShare: 'បំពេញ Milestones ទាំងនេះ ដើម្បីបង្កើនចំណែកទៅ {{share}}។',
    normalStagesCompleted: 'កម្រិតធម្មតាបានបញ្ចប់',
    highestNormalStage: 'អ្នកបានដល់កម្រិតចំណែក Quest ធម្មតាខ្ពស់បំផុត។',
    focusBoostMilestones: 'ឥឡូវអ្នកអាចផ្តោតលើ Milestones សម្រាប់ Boost 100 ថ្ងៃ។',
    stageRoadmap: 'ផែនទីកម្រិត',
    roadmapSubtitle: 'ចំណែកអ្នកនិពន្ធរបស់អ្នកនឹងកើនឡើង ពេលបំពេញកម្រិតនីមួយៗ។',
    authorShare: 'ចំណែកអ្នកនិពន្ធ',
    completed: 'បានបញ្ចប់',
    current: 'បច្ចុប្បន្ន',
    locked: 'បានចាក់សោ',
    stage: 'កម្រិត',
    episodes: 'ភាគ',
    words: 'ពាក្យ',
    likes: 'ចូលចិត្ត',
    followers: 'អ្នក Follow',
    paidFans: 'អ្នកគាំទ្របង់ប្រាក់',
    earnings: 'ចំណូល',
    policy: 'គោលការណ៍',
    views: 'ទស្សនា',
    readHours: 'ម៉ោងអាន',
    ratings: 'ការវាយតម្លៃ',
    done: 'រួចរាល់',
    questRules: 'ច្បាប់ Quest',
    rule1: 'វឌ្ឍនភាព Quest គណនាពីរឿងដែលបានបោះពុម្ព និងសកម្មភាពអ្នកអានដែលបានផ្ទៀងផ្ទាត់។',
    rule2: 'ចំណូលបង់ប្រាក់មកពីការដោះសោដោយ Diamond ប៉ុណ្ណោះ។',
    rule3: 'Boost 100 ថ្ងៃ ត្រូវការបំពេញ Milestones ចាំបាច់ទាំងអស់ និង Growth Milestones ណាមួយ 3។',
    rule4: 'Boost 100 ថ្ងៃ អាចប្រើបានតែម្តងប៉ុណ្ណោះសម្រាប់គណនីអ្នកនិពន្ធមួយ។',
    writeCreateGrow: 'សរសេរ · បង្កើត · រីកចម្រើន',
    loadFailed: 'មិនអាចផ្ទុក Quest អ្នកនិពន្ធបានទេ',
    activateConfirm: 'បើក Boost អ្នកបង្កើត 100 ថ្ងៃឥឡូវនេះ? វាចាប់ផ្តើមភ្លាមៗ មិនអាចផ្អាក និងអាចប្រើបានតែម្តងប៉ុណ្ណោះ។',
    activateFailed: 'មិនអាចបើក Boost 100 ថ្ងៃបានទេ',
    refreshFailed: 'Boost បានបើក ប៉ុន្តែមិនអាច Refresh ទំព័របានទេ',
    activateSuccess: 'បានបើក Boost អ្នកបង្កើត 100 ថ្ងៃដោយជោគជ័យ',
    lifetimeReward: 'រង្វាន់មួយជីវិត',
    boostTitle: 'Boost អ្នកបង្កើត 100 ថ្ងៃ',
    boostDescription: 'ទទួលចំណែកចំណូល 100% រយៈពេល 100 ថ្ងៃ។ ម្តងប៉ុណ្ណោះក្នុងគណនីអ្នកនិពន្ធ។',
    creatorTreasure: 'កំណប់អ្នកបង្កើត',
    creatorTreasureBody: 'បំពេញ Milestones ហើយដោះសោរង្វាន់ 100 ថ្ងៃម្តងគត់។',
    boostReady: 'Boost អ្នកបង្កើត 100 ថ្ងៃរបស់អ្នករួចរាល់ហើយ។',
    boostReadyBody: 'វាចាប់ផ្តើមភ្លាមៗ មិនអាចផ្អាក និងអាចបើកបានតែម្តងប៉ុណ្ណោះ។',
    activating: 'កំពុងបើក...',
    activateBoost: 'បើក Boost 100 ថ្ងៃ',
    boostEnded: 'Boost 100 ថ្ងៃម្តងគត់នេះបានបញ្ចប់ហើយ។',
    requiredMilestones: 'Milestones ចាំបាច់',
    requiredMilestonesBody: 'បំពេញ Milestones ចាំបាច់ទាំងអស់។',
    growthMilestones: 'Growth Milestones',
    growthMilestonesBody: 'បំពេញណាមួយ 3 ក្នុងចំណោម 5។',
    statusLocked: 'បានចាក់សោ',
    statusEligible: 'អាចបើកបាន',
    statusActive: 'កំពុងសកម្ម',
    statusExpired: 'ផុតកំណត់',
    statusUsed: 'បានប្រើ',
  },
  zh: {
    notActive: '未激活',
    back: '返回',
    title: '任务',
    subtitle: '等级与创作者奖励',
    tryAgain: '重试',
    currentShare: '当前分成',
    youAreOn: '你当前位于',
    stageNumber: '第 {{number}} 阶段',
    boostActiveUntil: '100天创作者加成有效至 {{date}}。',
    keepGrowing: '继续成长以解锁更高分成。',
    nextMilestone: '下一个里程碑：第 {{number}} 阶段',
    maxStage: '已达到最高普通阶段',
    unlockShare: '解锁 {{share}} 分成',
    greatWork: '做得很好',
    keepGoing: '继续加油',
    percentComplete: '已完成 {{percent}}%',
    toReachStage: '达到第 {{number}} 阶段',
    completeMilestonesShare: '完成这些里程碑，将分成提升至 {{share}}。',
    normalStagesCompleted: '普通阶段已完成',
    highestNormalStage: '你已达到最高普通 Quest 分成阶段。',
    focusBoostMilestones: '现在可以专注于100天创作者加成里程碑。',
    stageRoadmap: '阶段路线图',
    roadmapSubtitle: '完成每个阶段后，你的作者分成会提高。',
    authorShare: '作者分成',
    completed: '已完成',
    current: '当前',
    locked: '已锁定',
    stage: '阶段',
    episodes: '章节',
    words: '字数',
    likes: '点赞',
    followers: '关注者',
    paidFans: '付费粉丝',
    earnings: '收益',
    policy: '账户状态',
    views: '有效浏览',
    readHours: '阅读小时',
    ratings: '评分',
    done: '完成',
    questRules: 'Quest 规则',
    rule1: 'Quest 进度根据已发布故事和已验证的读者活动计算。',
    rule2: '付费收入仅来自 Diamond 解锁。',
    rule3: '100天创作者加成需要完成所有必需里程碑，并完成任意3个成长里程碑。',
    rule4: '每个作者账户只能使用一次100天创作者加成。',
    writeCreateGrow: '写作 · 创作 · 成长',
    loadFailed: '无法加载作者 Quest',
    activateConfirm: '现在激活100天创作者加成？激活后立即开始，无法暂停，并且只能使用一次。',
    activateFailed: '无法激活100天创作者加成',
    refreshFailed: '加成已激活，但页面无法刷新',
    activateSuccess: '100天创作者加成已成功激活',
    lifetimeReward: '终身奖励',
    boostTitle: '100天创作者加成',
    boostDescription: '连续100天获得100%收入分成。每个作者账户仅一次。',
    creatorTreasure: '创作者宝藏',
    creatorTreasureBody: '完成里程碑并解锁一次性的100天奖励。',
    boostReady: '你的100天创作者加成已准备好。',
    boostReadyBody: '激活后立即开始，无法暂停，并且只能激活一次。',
    activating: '正在激活...',
    activateBoost: '激活100天加成',
    boostEnded: '这次一次性的100天创作者加成已结束。',
    requiredMilestones: '必需里程碑',
    requiredMilestonesBody: '完成所有必需里程碑。',
    growthMilestones: '成长里程碑',
    growthMilestonesBody: '完成5项中的任意3项。',
    statusLocked: '已锁定',
    statusEligible: '可激活',
    statusActive: '进行中',
    statusExpired: '已过期',
    statusUsed: '已使用',
  },
  ja: {
    notActive: '未開始',
    back: '戻る',
    title: 'クエスト',
    subtitle: 'ステージとクリエイター報酬',
    tryAgain: '再試行',
    currentShare: '現在の分配率',
    youAreOn: '現在のステージ',
    stageNumber: 'ステージ {{number}}',
    boostActiveUntil: '100日クリエイターブーストは {{date}} まで有効です。',
    keepGrowing: 'さらに高い分配率を解放するため成長を続けましょう。',
    nextMilestone: '次のマイルストーン：ステージ {{number}}',
    maxStage: '通常ステージの最大に到達しました',
    unlockShare: '{{share}} の分配率を解放',
    greatWork: 'よくできました',
    keepGoing: 'そのまま続けましょう',
    percentComplete: '{{percent}}% 完了',
    toReachStage: 'ステージ {{number}} に到達するには',
    completeMilestonesShare: 'これらのマイルストーンを完了して分配率を {{share}} に上げましょう。',
    normalStagesCompleted: '通常ステージ完了',
    highestNormalStage: '通常Questの最高分配ステージに到達しました。',
    focusBoostMilestones: '100日クリエイターブーストのマイルストーンに集中できます。',
    stageRoadmap: 'ステージロードマップ',
    roadmapSubtitle: '各ステージを完了すると作者分配率が上がります。',
    authorShare: '作者分配率',
    completed: '完了',
    current: '現在',
    locked: 'ロック中',
    stage: 'ステージ',
    episodes: 'エピソード',
    words: '文字数',
    likes: 'いいね',
    followers: 'フォロワー',
    paidFans: '有料ファン',
    earnings: '収益',
    policy: 'ポリシー',
    views: '有効閲覧',
    readHours: '読書時間',
    ratings: '評価',
    done: '完了',
    questRules: 'Quest ルール',
    rule1: 'Questの進捗は公開済みストーリーと確認済み読者アクティビティから計算されます。',
    rule2: '有料収益はDiamond解放のみから発生します。',
    rule3: '100日クリエイターブーストには必須マイルストーンすべてと成長マイルストーン3つが必要です。',
    rule4: '100日クリエイターブーストは作者アカウントごとに1回だけ使用できます。',
    writeCreateGrow: '書く · 作る · 成長する',
    loadFailed: '作者Questを読み込めませんでした',
    activateConfirm: '100日クリエイターブーストを今有効化しますか？すぐに開始し、一時停止できず、1回だけ使用できます。',
    activateFailed: '100日クリエイターブーストを有効化できませんでした',
    refreshFailed: 'ブーストは有効化されましたがページを更新できませんでした',
    activateSuccess: '100日クリエイターブーストを有効化しました',
    lifetimeReward: '生涯報酬',
    boostTitle: '100日クリエイターブースト',
    boostDescription: '100日間、収益分配100%。作者アカウントにつき1回のみ。',
    creatorTreasure: 'クリエイター宝物',
    creatorTreasureBody: 'マイルストーンを達成して1回限りの100日報酬を解放しましょう。',
    boostReady: '100日クリエイターブーストの準備ができました。',
    boostReadyBody: 'すぐに開始し、一時停止できず、1回だけ有効化できます。',
    activating: '有効化中...',
    activateBoost: '100日ブーストを有効化',
    boostEnded: '1回限りの100日クリエイターブーストは終了しました。',
    requiredMilestones: '必須マイルストーン',
    requiredMilestonesBody: '必須マイルストーンをすべて完了してください。',
    growthMilestones: '成長マイルストーン',
    growthMilestonesBody: '5つのうち3つを完了してください。',
    statusLocked: 'ロック中',
    statusEligible: '有効化可能',
    statusActive: '有効',
    statusExpired: '期限切れ',
    statusUsed: '使用済み',
  },
  ko: {
    notActive: '비활성',
    back: '뒤로',
    title: '퀘스트',
    subtitle: '단계 및 크리에이터 보상',
    tryAgain: '다시 시도',
    currentShare: '현재 수익 배분',
    youAreOn: '현재 단계',
    stageNumber: '단계 {{number}}',
    boostActiveUntil: '100일 크리에이터 부스트가 {{date}}까지 활성화됩니다.',
    keepGrowing: '더 높은 수익 배분을 해제하려면 계속 성장하세요.',
    nextMilestone: '다음 마일스톤: 단계 {{number}}',
    maxStage: '일반 최고 단계에 도달했습니다',
    unlockShare: '{{share}} 수익 배분 해제',
    greatWork: '잘했습니다',
    keepGoing: '계속 진행하세요',
    percentComplete: '{{percent}}% 완료',
    toReachStage: '단계 {{number}} 달성 조건',
    completeMilestonesShare: '이 마일스톤을 완료해 수익 배분을 {{share}}로 높이세요.',
    normalStagesCompleted: '일반 단계 완료',
    highestNormalStage: '일반 Quest 최고 수익 배분 단계에 도달했습니다.',
    focusBoostMilestones: '이제 100일 크리에이터 부스트 마일스톤에 집중할 수 있습니다.',
    stageRoadmap: '단계 로드맵',
    roadmapSubtitle: '각 단계를 완료할수록 작가 수익 배분이 높아집니다.',
    authorShare: '작가 수익 배분',
    completed: '완료',
    current: '현재',
    locked: '잠김',
    stage: '단계',
    episodes: '에피소드',
    words: '단어',
    likes: '좋아요',
    followers: '팔로워',
    paidFans: '유료 팬',
    earnings: '수익',
    policy: '정책',
    views: '유효 조회',
    readHours: '읽기 시간',
    ratings: '평점',
    done: '완료',
    questRules: 'Quest 규칙',
    rule1: 'Quest 진행도는 게시된 스토리와 확인된 독자 활동을 기준으로 계산됩니다.',
    rule2: '유료 수익은 Diamond 잠금 해제에서만 발생합니다.',
    rule3: '100일 크리에이터 부스트는 필수 마일스톤 전체와 성장 마일스톤 3개를 완료해야 합니다.',
    rule4: '100일 크리에이터 부스트는 작가 계정당 한 번만 사용할 수 있습니다.',
    writeCreateGrow: '쓰기 · 만들기 · 성장',
    loadFailed: '작가 Quest를 불러오지 못했습니다',
    activateConfirm: '지금 100일 크리에이터 부스트를 활성화할까요? 즉시 시작되며 일시정지할 수 없고 한 번만 사용할 수 있습니다.',
    activateFailed: '100일 크리에이터 부스트를 활성화하지 못했습니다',
    refreshFailed: '부스트가 활성화되었지만 페이지를 새로고칠 수 없습니다',
    activateSuccess: '100일 크리에이터 부스트를 활성화했습니다',
    lifetimeReward: '평생 보상',
    boostTitle: '100일 크리에이터 부스트',
    boostDescription: '100일 동안 수익 배분 100%. 작가 계정당 한 번만 사용할 수 있습니다.',
    creatorTreasure: '크리에이터 보물',
    creatorTreasureBody: '마일스톤을 완료하고 한 번뿐인 100일 보상을 해제하세요.',
    boostReady: '100일 크리에이터 부스트를 사용할 준비가 되었습니다.',
    boostReadyBody: '즉시 시작되며 일시정지할 수 없고 한 번만 활성화할 수 있습니다.',
    activating: '활성화 중...',
    activateBoost: '100일 부스트 활성화',
    boostEnded: '한 번뿐인 100일 크리에이터 부스트가 종료되었습니다.',
    requiredMilestones: '필수 마일스톤',
    requiredMilestonesBody: '필수 마일스톤을 모두 완료하세요.',
    growthMilestones: '성장 마일스톤',
    growthMilestonesBody: '5개 중 3개를 완료하세요.',
    statusLocked: '잠김',
    statusEligible: '활성화 가능',
    statusActive: '활성',
    statusExpired: '만료됨',
    statusUsed: '사용됨',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const QUEST_MASCOT_URL = '/assets/Author/quest-manga-girl.webp'

const BOOST_REQUIRED_MILESTONES = [
  {
    key: 'episodes',
    label: 'Published Episodes',
    shortLabelKey: 'episodes',
    icon: 'fa-solid fa-book-open',
    required: 100,
    text: '100 published episodes',
  },
  {
    key: 'words',
    label: 'Published Words',
    shortLabelKey: 'words',
    icon: 'fa-solid fa-pen-nib',
    required: 100000,
    text: '100,000 total published words',
  },
  {
    key: 'paid_fans',
    label: 'Paid Fans',
    shortLabelKey: 'paidFans',
    icon: 'fa-solid fa-users',
    required: 1000,
    text: 'Readers who unlocked 10+ paid episodes with Diamonds',
  },
  {
    key: 'paid_earnings',
    label: 'Paid Earnings',
    shortLabelKey: 'earnings',
    icon: 'fa-solid fa-gem',
    required: 100,
    text: '$100 net paid author earnings from Diamond unlocks',
    prefix: '$',
  },
  {
    key: 'policy',
    label: 'Account Status',
    shortLabelKey: 'policy',
    icon: 'fa-solid fa-shield-heart',
    required: 1,
    text: 'No serious policy violations',
  },
]

const BOOST_GROWTH_MILESTONES = [
  {
    key: 'views',
    label: 'Qualified Views',
    shortLabelKey: 'views',
    icon: 'fa-solid fa-eye',
    required: 1000000,
    text: '1,000,000 qualified views',
  },
  {
    key: 'read_hours',
    label: 'Read Hours',
    shortLabelKey: 'readHours',
    icon: 'fa-solid fa-clock',
    required: 1000,
    text: '1,000 qualified read hours',
  },
  {
    key: 'likes',
    label: 'Unique Likes',
    shortLabelKey: 'likes',
    icon: 'fa-solid fa-heart',
    required: 1000000,
    text: '1,000,000 unique likes',
  },
  {
    key: 'ratings',
    label: 'Unique Ratings',
    shortLabelKey: 'ratings',
    icon: 'fa-solid fa-star',
    required: 1000,
    text: '1,000 unique ratings',
  },
  {
    key: 'followers',
    label: 'Followers',
    shortLabelKey: 'followers',
    icon: 'fa-solid fa-user-plus',
    required: 1000,
    text: '1,000 followers',
  },
]

const MILESTONE_STYLES = {
  Episodes: {
    iconBg: 'bg-[#fff0c9]',
    iconText: 'text-[#d89b18]',
    bar: 'from-[#f4b62f] to-[#ffd460]',
  },
  Words: {
    iconBg: 'bg-[#eee6ff]',
    iconText: 'text-[#7b55c7]',
    bar: 'from-[#9b72ec] to-[#c89cf4]',
  },
  Likes: {
    iconBg: 'bg-[#ffe3ef]',
    iconText: 'text-[#ea6e9f]',
    bar: 'from-[#f27da9] to-[#f7a9c8]',
  },
  Followers: {
    iconBg: 'bg-[#e8f0ff]',
    iconText: 'text-[#5f82d9]',
    bar: 'from-[#6f7eea] to-[#9c87ed]',
  },
}

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function numberValue(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return 0
  return number
}

function compactNumber(value, prefix = '') {
  const number = numberValue(value)

  if (prefix) {
    return `${prefix}${number.toLocaleString(getDisplayLanguageId(), {
      maximumFractionDigits: 2,
    })}`
  }

  return new Intl.NumberFormat(getDisplayLanguageId(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

function percentText(value) {
  const number = numberValue(value)
  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`
}

function progressPercent(current, required) {
  const target = numberValue(required)
  if (target <= 0) return 100
  return Math.max(0, Math.min(100, Math.round((numberValue(current) / target) * 100)))
}

function dateText(value) {
  if (!value) return getDisplayText('authorQuest.notActive')

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return getDisplayText('authorQuest.notActive')

  return date.toLocaleDateString(getDisplayLanguageId(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-[0_5px_18px_rgba(70,49,99,0.08)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding({ dark = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-[32px] border-r ${
        dark
          ? 'border-white/10 bg-white/[0.04]'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)]'
      }`}
    >
      {[32, 78, 124, 170, 216, 262, 308, 354].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span
            className={`block h-[13px] w-[13px] rounded-full border-2 ${
              dark
                ? 'border-[#caa8ff] bg-[#2f2345]'
                : 'border-[#9a70d2] bg-[var(--shadow-bg-surface)]'
            }`}
          />
          <span
            className={`absolute left-[7px] top-[5px] h-[3px] w-[13px] rounded-full ${
              dark ? 'bg-[#d8bdff]' : 'bg-[#8d63c9]'
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
      className={`pointer-events-none absolute h-6 w-[72px] rotate-[-8deg] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#a9c9ff]/75' : 'bg-[#f8bdd6]/75'
      } ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.38)_0_5px,transparent_5px_10px)]" />
    </div>
  )
}

function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <i className="fa-solid fa-star text-[13px] text-[#f2bd45]" />
      <i className="fa-solid fa-heart ml-3 text-[10px] text-[#f295bb]" />
      <i className="fa-solid fa-star ml-3 text-[8px] text-[#9e7bd5]" />
    </div>
  )
}

function QuestMascot({ small = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[radial-gradient(circle_at_35%_28%,#fff_0%,#fce5f2_40%,#dac5ff_100%)] shadow-[0_12px_28px_rgba(85,55,125,0.18)] ${
          small ? 'h-[86px] w-[86px]' : 'h-[155px] w-[155px]'
        }`}
      >
        <i
          className={`fa-solid fa-face-smile-beam text-[#8d67c5] ${
            small ? 'text-[34px]' : 'text-[52px]'
          }`}
        />
        <span className="absolute bottom-3 rounded-full bg-white/80 px-2 py-0.5 text-[8px] font-black text-[#7955ad]">
          SHADOW
        </span>
      </div>
    )
  }

  return (
    <img
      src={QUEST_MASCOT_URL}
      alt=""
      onError={() => setFailed(true)}
      className={
        small
          ? 'h-[92px] w-[92px] object-contain drop-shadow-[0_10px_18px_rgba(79,52,117,0.18)]'
          : 'h-[178px] w-[178px] object-contain drop-shadow-[0_14px_26px_rgba(79,52,117,0.2)]'
      }
    />
  )
}

function ProgressBar({
  current,
  required,
  done = false,
  dark = false,
  gradientClass = 'from-[#f1b532] via-[#f6ca4f] to-[#a477e3]',
}) {
  const percent = progressPercent(current, required)

  return (
    <div className={`h-2.5 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-[var(--shadow-bg-soft)]'}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
          done ? 'from-[#e8a823] to-[#ffd15a]' : gradientClass
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function PaperSection({ title, subtitle, icon, children, accent = 'purple', className = '' }) {
  const accents = {
    purple: {
      title: 'text-[var(--shadow-text-primary)]',
      icon: 'bg-[#eee5ff] text-[#7752b6]',
      border: 'border-[var(--shadow-border)]',
      bg: 'bg-[var(--shadow-bg-surface)]',
    },
    pink: {
      title: 'text-[var(--shadow-text-primary)]',
      icon: 'bg-[#ffe4ef] text-[#de6b9a]',
      border: 'border-[var(--shadow-border)]',
      bg: 'bg-[var(--shadow-bg-surface)]',
    },
    blue: {
      title: 'text-[var(--shadow-text-primary)]',
      icon: 'bg-[#e8efff] text-[#5a75c4]',
      border: 'border-[var(--shadow-border)]',
      bg: 'bg-[var(--shadow-bg-surface)]',
    },
  }

  const style = accents[accent] || accents.purple

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${style.border} ${style.bg} p-4 shadow-[0_12px_30px_rgba(86,61,118,0.07)] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(117,93,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(117,93,145,0.035) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3" blue={accent === 'blue'} />

      <div className="mb-4 flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
          <i className={`${icon} text-[14px]`} />
        </span>

        <div className="min-w-0">
          <h2 className={`text-[18px] font-black tracking-[-0.035em] ${style.title}`}>
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[11.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  )
}

function MilestoneCard({ icon, label, styleKey, current, required }) {
  const { t } = useDisplayTranslation()
  const done = numberValue(current) >= numberValue(required)
  const style = MILESTONE_STYLES[styleKey] || MILESTONE_STYLES.Episodes

  return (
    <div
      className={`rounded-[22px] border p-3.5 shadow-[0_6px_18px_rgba(80,58,110,0.055)] ${
        done ? 'border-[#edc65c] bg-[#fffaf0] dark:bg-[#edc65c]/15' : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${style.iconBg} ${style.iconText}`}>
          <i className={`${done ? 'fa-solid fa-check' : icon} text-[15px]`} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{label}</div>
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
                done ? 'bg-[#f5bf3f] text-[#533c08]' : 'bg-[#f0eaf7] text-[#72569a]'
              }`}
            >
              {done ? t('authorQuest.done') : `${progressPercent(current, required)}%`}
            </span>
          </div>

          <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-secondary)]">
            {compactNumber(current)} / {compactNumber(required)}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar
          current={current}
          required={required}
          done={done}
          gradientClass={style.bar}
        />
      </div>
    </div>
  )
}

function StageRoadmapItem({ stage, currentStageNumber, index, total }) {
  const { t } = useDisplayTranslation()
  const stageNumber = numberValue(stage.stage_number)
  const current = stageNumber === numberValue(currentStageNumber)
  const completed = stageNumber < numberValue(currentStageNumber)
  const locked = stageNumber > numberValue(currentStageNumber)

  return (
    <div className="relative pl-[46px]">
      {index < total - 1 ? (
        <div className="absolute bottom-[-11px] left-[18px] top-[31px] w-[2px] rounded-full bg-[#dcccee]" />
      ) : null}

      <div
        className={`absolute left-0 top-2 flex h-[38px] w-[38px] items-center justify-center rounded-full border-[3px] shadow-sm ${
          current
            ? 'border-[#f1bf46] bg-[#fff0b9] text-[#b47a00]'
            : completed
              ? 'border-[#b699db] bg-[#eee5ff] text-[#704da5]'
              : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-disabled)]'
        }`}
      >
        {current ? (
          <i className="fa-solid fa-crown text-[13px]" />
        ) : completed ? (
          <i className="fa-solid fa-check text-[11px]" />
        ) : (
          <i className="fa-solid fa-lock text-[9px]" />
        )}
      </div>

      <div
        className={`rounded-[20px] border p-3.5 ${
          current
            ? 'border-[#e9bd4e] bg-[linear-gradient(90deg,#fff8df_0%,#fffdf8_100%)] shadow-[0_7px_20px_rgba(205,158,37,0.1)]'
            : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.04em] text-[var(--shadow-text-secondary)]">
              {t('authorQuest.stageNumber', { number: stage.stage_number })}
            </div>
            <div className="mt-1 text-[27px] font-black leading-none tracking-[-0.05em] text-[var(--shadow-text-primary)]">
              {percentText(stage.share_percent)}
            </div>
            <div className="mt-1 text-[8.5px] font-black uppercase tracking-[0.1em] text-[var(--shadow-text-tertiary)]">
              {t('authorQuest.authorShare')}
            </div>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[8.5px] font-black uppercase ${
              current
                ? 'bg-[#f0b632] text-white'
                : completed
                  ? 'bg-[#eee4ff] text-[#7654a8]'
                  : 'bg-[#f0edf3] text-[#9a91a3]'
            }`}
          >
            {completed ? t('authorQuest.completed') : current ? t('authorQuest.current') : locked ? t('authorQuest.locked') : t('authorQuest.stage')}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
          <div>
            {t('authorQuest.episodes')}:{' '}
            <span className="font-black text-[var(--shadow-text-primary)]">
              {compactNumber(stage.requirements?.episodes?.required)}
            </span>
          </div>
          <div>
            {t('authorQuest.words')}:{' '}
            <span className="font-black text-[var(--shadow-text-primary)]">
              {compactNumber(stage.requirements?.words?.required)}
            </span>
          </div>
          <div>
            {t('authorQuest.likes')}:{' '}
            <span className="font-black text-[var(--shadow-text-primary)]">
              {compactNumber(stage.requirements?.likes?.required)}
            </span>
          </div>
          <div>
            {t('authorQuest.followers')}:{' '}
            <span className="font-black text-[var(--shadow-text-primary)]">
              {compactNumber(stage.requirements?.followers?.required)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BoostRequirement({ item }) {
  const { t } = useDisplayTranslation()
  const done = numberValue(item.current) >= numberValue(item.required)

  return (
    <div
      className={`rounded-[18px] border px-3 py-3 ${
        done
          ? 'border-[#ebc14e] bg-[#fff8e6]'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] ${
            done ? 'bg-[#ffeab2] text-[#b97b00]' : 'bg-[#efe7fa] text-[#7654a8]'
          }`}
        >
          <i className={`${done ? 'fa-solid fa-check' : item.icon} text-[11px]`} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 text-[10.5px] font-black text-[var(--shadow-text-primary)]">
              {t(`authorQuest.${item.shortLabelKey}`)}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                done ? 'bg-[#f0b72f] text-[#4c3606]' : 'bg-[#f0ebf5] text-[#806a92]'
              }`}
            >
              {done ? t('authorQuest.done') : `${progressPercent(item.current, item.required)}%`}
            </span>
          </div>

          <div className="mt-0.5 text-[9.5px] font-semibold text-[var(--shadow-text-tertiary)]">
            {compactNumber(item.current, item.prefix)} / {compactNumber(item.required, item.prefix)}
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <ProgressBar
          current={item.current}
          required={item.required}
          done={done}
          gradientClass="from-[#8d65d2] to-[#d18be4]"
        />
      </div>
    </div>
  )
}

function BoostGroup({ title, subtitle, count, children, pink = false }) {
  return (
    <div
      className={`rounded-[24px] border p-3.5 ${
        pink
          ? 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
          : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-[14px] font-black ${pink ? 'text-[#bd5c83]' : 'text-[#5a3e7d]'}`}>
            {title}
          </h3>
          <p className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">{subtitle}</p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-black ${
            pink ? 'bg-[#ffe5f0] text-[#c35e87]' : 'bg-[#eee5ff] text-[#7652ad]'
          }`}
        >
          {count}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function RulesNote({ onLearnMore }) {
  const { t } = useDisplayTranslation()
  return (
    <button
      type="button"
      onClick={onLearnMore}
      className="relative w-full overflow-hidden rounded-[28px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 text-left shadow-[0_10px_26px_rgba(89,63,119,0.07)] transition active:scale-[0.99]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(224,122,159,0.04) 1px, transparent 1px)',
        backgroundSize: '100% 23px',
      }}
    >
      <Tape className="-right-5 top-5 rotate-[7deg]" />

      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ffe5ef] text-[#dc6b98]">
          <i className="fa-solid fa-book-open text-[14px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorQuest.questRules')}</div>
          <div className="mt-3 space-y-2 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>{t('authorQuest.rule1')}</span>
            </p>
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>{t('authorQuest.rule2')}</span>
            </p>
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>{t('authorQuest.rule3')}</span>
            </p>
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>{t('authorQuest.rule4')}</span>
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1e8fb] text-[#8b65bd]">
          <i className="fa-solid fa-chevron-right text-[10px]" />
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-14 rotate-[-4deg] rounded-[8px] border border-[#eed2dc] bg-[#fff9de] px-3 py-2 text-center text-[9px] font-black leading-4 text-[#70537f] shadow-sm">
        {t('authorQuest.writeCreateGrow')}
      </div>
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[265px] animate-pulse rounded-[30px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[300px] animate-pulse rounded-[28px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[410px] animate-pulse rounded-[28px] bg-[var(--shadow-bg-surface)]" />
    </div>
  )
}

function getStageProgress(nextStage) {
  if (!nextStage) return 100

  const requirements = [
    nextStage.requirements?.episodes,
    nextStage.requirements?.words,
    nextStage.requirements?.likes,
    nextStage.requirements?.followers,
  ]

  return Math.min(
    ...requirements.map((item) => progressPercent(item?.current, item?.required))
  )
}

export default function AuthorQuestPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [searchParams] = useSearchParams()
  const fromPage = searchParams.get('from')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [activatingBoost, setActivatingBoost] = useState(false)
  const [boostNotice, setBoostNotice] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadQuest() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/authors/me/quest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || t('authorQuest.loadFailed'))
        }

        if (!ignore) {
          setData(result)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('authorQuest.loadFailed'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadQuest()

    return () => {
      ignore = true
    }
  }, [navigate, t])

  const currentStage = data?.current_stage || {}
  const activeShare = data?.active_share || {}
  const nextStage = data?.next_stage || null
  const lifetimeBoost = data?.lifetime_boost || null
  const boostStatusKey = {
    locked: 'statusLocked',
    eligible: 'statusEligible',
    active: 'statusActive',
    expired: 'statusExpired',
    used: 'statusUsed',
  }[String(lifetimeBoost?.status || 'locked')] || 'statusLocked'
  const totals = data?.totals || {}
  const stageProgress = getStageProgress(nextStage)

  const nextRequirements = useMemo(() => {
    if (!nextStage?.requirements) return []

    return [
      ['episodes', nextStage.requirements.episodes, 'fa-solid fa-book-open', 'Episodes'],
      ['words', nextStage.requirements.words, 'fa-solid fa-pen-nib', 'Words'],
      ['likes', nextStage.requirements.likes, 'fa-solid fa-heart', 'Likes'],
      ['followers', nextStage.requirements.followers, 'fa-solid fa-user-plus', 'Followers'],
    ]
  }, [nextStage])

  const requiredMilestones = useMemo(() => {
    return BOOST_REQUIRED_MILESTONES.map((item) => {
      let current = 0

      if (item.key === 'episodes') current = totals.total_published_episodes
      if (item.key === 'words') current = totals.total_words
      if (item.key === 'paid_fans') current = totals.total_paid_fans ?? 0
      if (item.key === 'paid_earnings') current = totals.total_net_paid_earnings_usd || 0
      if (item.key === 'policy') current = totals.has_serious_policy_violation ? 0 : 1

      return {
        ...item,
        current,
      }
    })
  }, [totals])

  const growthMilestones = useMemo(() => {
    return BOOST_GROWTH_MILESTONES.map((item) => {
      let current = 0

      if (item.key === 'views') current = totals.total_qualified_views || totals.total_views || 0
      if (item.key === 'read_hours') current = Math.floor(numberValue(totals.total_read_seconds) / 3600)
      if (item.key === 'likes') current = totals.total_unique_likes || totals.total_likes || 0
      if (item.key === 'ratings') current = totals.total_unique_ratings || totals.total_ratings || 0
      if (item.key === 'followers') current = totals.total_followers || 0

      return {
        ...item,
        current,
      }
    })
  }, [totals])

  const requiredDoneCount = requiredMilestones.filter(
    (item) => numberValue(item.current) >= numberValue(item.required)
  ).length

  const growthDoneCount = growthMilestones.filter(
    (item) => numberValue(item.current) >= numberValue(item.required)
  ).length

  async function activateBoost() {
    if (activatingBoost || lifetimeBoost?.status !== 'eligible') {
      return
    }

    const confirmed = window.confirm(
      t('authorQuest.activateConfirm')
    )

    if (!confirmed) return

    try {
      setActivatingBoost(true)
      setBoostNotice(null)

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/quest/boost/activate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || t('authorQuest.activateFailed'))
      }

      const refreshResponse = await fetch(
        `${API_BASE_URL}/api/authors/me/quest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const refreshResult = await refreshResponse.json().catch(() => ({}))

      if (!refreshResponse.ok || refreshResult.ok === false) {
        throw new Error(
          refreshResult.message || t('authorQuest.refreshFailed')
        )
      }

      setData(refreshResult)
      setBoostNotice({
        type: 'success',
        text: result.message || t('authorQuest.activateSuccess'),
      })
    } catch (err) {
      setBoostNotice({
        type: 'error',
        text: err.message || t('authorQuest.activateFailed'),
      })
    } finally {
      setActivatingBoost(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10 text-[var(--shadow-text-primary)]">
      <div className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label={t('authorQuest.back')}
            onClick={() =>
              navigate(fromPage === 'income' ? '/author/income' : '/author/profile', {
                replace: true,
              })
            }
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-crown text-[12px] text-[#edb233]" />
              <h1 className="text-[21px] font-black tracking-[-0.04em] text-[var(--shadow-text-primary)]">
                {t('authorQuest.title')}
              </h1>
              <i className="fa-solid fa-star text-[10px] text-[#f4c24d]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.11em] text-[var(--shadow-text-tertiary)]">
              {t('authorQuest.subtitle')}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff6cf] text-[#dca623]">
            <i className="fa-solid fa-star text-[13px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[26px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5 text-center shadow-[0_12px_28px_rgba(93,64,136,0.08)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f5] text-[#e45f8d]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[var(--shadow-text-primary)]">{error}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#7452ae] px-6 text-[13px] font-black text-white transition active:scale-95"
            >
              {t('authorQuest.tryAgain')}
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section
              className="relative overflow-hidden rounded-[30px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_16px_36px_rgba(94,58,142,0.14)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(115,83,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(115,83,150,0.04) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <SpiralBinding />
              <Sparkles className="absolute right-5 top-4" />
              <Tape className="right-3 top-[88px] rotate-[8deg]" />

              <div className="relative min-h-[245px] pl-[46px] pr-3 pt-5">
                <div className="absolute right-[-12px] top-[58px] z-0 sm:right-5 sm:top-5">
                  <QuestMascot />
                </div>

                <div className="relative z-10 max-w-[67%] sm:max-w-[58%]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ef82af] px-3 py-1.5 text-[9.5px] font-black uppercase tracking-[0.08em] text-white shadow-sm">
                    <i className="fa-solid fa-crown text-[8px]" />
                    {t('authorQuest.currentShare')}
                  </div>

                  <div className="mt-2.5 bg-[linear-gradient(180deg,#ff75a7_0%,#d76ce7_100%)] bg-clip-text text-[58px] font-black leading-none tracking-[-0.08em] text-transparent drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
                    {percentText(activeShare.share_percent || currentStage.share_percent)}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[13px] font-black text-[var(--shadow-text-primary)]">{t('authorQuest.youAreOn')}</span>
                    <span className="rounded-full bg-[#f7a5c7] px-3 py-1 text-[10px] font-black text-white">
                      {t('authorQuest.stageNumber', { number: currentStage.stage_number || 1 })}
                    </span>
                  </div>

                  <p className="mt-2 max-w-[245px] text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                    {activeShare.source === 'lifetime_boost'
                      ? t('authorQuest.boostActiveUntil', { date: dateText(activeShare.boost_ends_at) })
                      : t('authorQuest.keepGrowing')}
                  </p>
                </div>

                <div className="absolute right-4 top-4 z-20 rounded-2xl border border-[#e8bb46] bg-[#fff7d8] px-3 py-2 shadow-[0_6px_16px_rgba(201,152,24,0.16)]">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-crown text-[9px] text-[#d99e18]" />
                    <span className="text-[9.5px] font-black uppercase tracking-[0.04em] text-[#5a426d]">
                      {t('authorQuest.stageNumber', { number: currentStage.stage_number || 1 })}
                    </span>
                  </div>
                </div>

                <div className="relative z-20 mb-4 mt-5 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] p-3.5 shadow-[0_8px_18px_rgba(85,58,119,0.08)] backdrop-blur">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-black text-[var(--shadow-text-primary)]">
                      {nextStage
                        ? t('authorQuest.nextMilestone', { number: nextStage.stage_number })
                        : t('authorQuest.maxStage')}
                    </div>
                    <div className="text-[9.5px] font-bold text-[var(--shadow-text-secondary)]">
                      {nextStage
                        ? t('authorQuest.unlockShare', { share: percentText(nextStage.share_percent) })
                        : t('authorQuest.greatWork')}
                    </div>
                  </div>

                  <ProgressBar current={stageProgress} required={100} />

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[8.5px] font-bold text-[#b295c6]">
                      <i className="fa-solid fa-star mr-1 text-[7px] text-[#f0b640]" />
                      {t('authorQuest.keepGoing')}
                    </span>
                    <span className="text-[9.5px] font-black text-[var(--shadow-text-primary)]">
                      {t('authorQuest.percentComplete', { percent: stageProgress })}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {nextStage ? (
              <PaperSection
                title={t('authorQuest.toReachStage', { number: nextStage.stage_number })}
                subtitle={t('authorQuest.completeMilestonesShare', { share: percentText(nextStage.share_percent) })}
                icon="fa-solid fa-bullseye"
                accent="pink"
              >
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {nextRequirements.map(([labelKey, item, icon, styleKey]) => (
                    <MilestoneCard
                      key={labelKey}
                      icon={icon}
                      label={t(`authorQuest.${labelKey}`)}
                      styleKey={styleKey}
                      current={item?.current}
                      required={item?.required}
                    />
                  ))}
                </div>
              </PaperSection>
            ) : (
              <PaperSection
                title={t('authorQuest.normalStagesCompleted')}
                subtitle={t('authorQuest.highestNormalStage')}
                icon="fa-solid fa-trophy"
                accent="pink"
              >
                <div className="rounded-[20px] border border-[#cae8d2] bg-[#f2fff6] p-4 text-[12px] font-bold leading-6 text-[#3f8453]">
                  {t('authorQuest.focusBoostMilestones')}
                </div>
              </PaperSection>
            )}

            <PaperSection
              title={t('authorQuest.stageRoadmap')}
              subtitle={t('authorQuest.roadmapSubtitle')}
              icon="fa-solid fa-map"
              accent="blue"
            >
              <div className="space-y-2.5">
                {(data.stage_rules || []).map((stage, index, array) => (
                  <StageRoadmapItem
                    key={stage.stage_number}
                    stage={stage}
                    currentStageNumber={currentStage.stage_number}
                    index={index}
                    total={array.length}
                  />
                ))}
              </div>
            </PaperSection>

            <section className="relative overflow-hidden rounded-[30px] border border-[#6c4c95] bg-[linear-gradient(145deg,#2d2044_0%,#40265b_52%,#2b2243_100%)] p-4 shadow-[0_18px_40px_rgba(52,34,76,0.2)] sm:p-5">
              <SpiralBinding dark />
              <Sparkles className="absolute right-5 top-4" />

              <div className="relative pl-[34px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#f6c94f]">
                      {t('authorQuest.lifetimeReward')}
                    </div>
                    <h2 className="mt-1.5 text-[23px] font-black leading-tight tracking-[-0.045em] text-white">
                      {t('authorQuest.boostTitle')}
                    </h2>
                    <p className="mt-1.5 max-w-[430px] text-[10.5px] font-semibold leading-5 text-white/60">
                      {t('authorQuest.boostDescription')}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[8.5px] font-black uppercase text-[#f7ca4d]">
                    {t(`authorQuest.${boostStatusKey}`)}
                  </span>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.07] p-3.5">
                  <div className="absolute -right-2 -top-1 opacity-90">
                    <QuestMascot small />
                  </div>

                  <div className="relative z-10 max-w-[68%]">
                    <div className="text-[12px] font-black text-[#ffdc73]">{t('authorQuest.creatorTreasure')}</div>
                    <p className="mt-1 text-[9.5px] font-semibold leading-4 text-white/55">
                      {t('authorQuest.creatorTreasureBody')}
                    </p>
                  </div>
                </div>

                {lifetimeBoost?.status === 'active' ? (
                  <div className="mt-4 rounded-[20px] border border-[#a8dfb5] bg-[#effff3] p-4 text-[12px] font-black text-[#34814b]">
                    {t('authorQuest.boostActiveUntil', { date: dateText(lifetimeBoost.ended_at) })}
                  </div>
                ) : null}

                {lifetimeBoost?.status === 'eligible' ? (
                  <div className="mt-4 rounded-[22px] border border-[#e7be55] bg-[#fff8e6] p-4 text-[#4d3c1d]">
                    <div className="text-[13px] font-black">
                      {t('authorQuest.boostReady')}
                    </div>
                    <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[#8a6a25]">
                      {t('authorQuest.boostReadyBody')}
                    </p>
                    <button
                      type="button"
                      onClick={activateBoost}
                      disabled={activatingBoost}
                      className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#4c3268] px-5 text-[12px] font-black text-[#ffdc6c] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <i
                        className={
                          activatingBoost
                            ? 'fa-solid fa-spinner fa-spin'
                            : 'fa-solid fa-bolt'
                        }
                      />
                      {activatingBoost ? t('authorQuest.activating') : t('authorQuest.activateBoost')}
                    </button>
                  </div>
                ) : null}

                {lifetimeBoost?.status === 'expired' ? (
                  <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.07] p-4 text-[11px] font-bold leading-5 text-white/60">
                    {t('authorQuest.boostEnded')}
                  </div>
                ) : null}

                {boostNotice ? (
                  <div
                    className={`mt-4 rounded-[20px] p-4 text-[11px] font-bold leading-5 ${
                      boostNotice.type === 'success'
                        ? 'bg-[#effff3] text-[#34814b]'
                        : 'bg-[#fff1f4] text-[#bf426b]'
                    }`}
                  >
                    {boostNotice.text}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <BoostGroup
                    title={t('authorQuest.requiredMilestones')}
                    subtitle={t('authorQuest.requiredMilestonesBody')}
                    count={`${requiredDoneCount}/${requiredMilestones.length}`}
                  >
                    {requiredMilestones.map((item) => (
                      <BoostRequirement key={item.key} item={item} />
                    ))}
                  </BoostGroup>

                  <BoostGroup
                    title={t('authorQuest.growthMilestones')}
                    subtitle={t('authorQuest.growthMilestonesBody')}
                    count={`${Math.min(growthDoneCount, 3)}/3`}
                    pink
                  >
                    {growthMilestones.map((item) => (
                      <BoostRequirement key={item.key} item={item} />
                    ))}
                  </BoostGroup>
                </div>
              </div>
            </section>

            <RulesNote onLearnMore={() => navigate('/author/benefits?from=quest')} />
          </>
        ) : null}
      </main>
    </div>
  )
}
