import { useNavigate, useSearchParams } from 'react-router-dom'

import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorBenefits', {
  en: {
    back: 'Back',
    authorBenefits: 'Author Benefits',
    creatorProgramsRules: 'Creator programs and rules',
    diamondIncome: 'Diamond Income',
    diamondIncomeText: 'Earn from paid unlocks',
    questShare: 'Quest Share',
    questShareText: 'Grow your share level',
    autoPayout: 'Auto Payout',
    autoPayoutText: 'Monthly admin payout',
    boost100: '100-Day Boost',
    boost100Text: 'One lifetime reward',
    stage1: 'Stage 1',
    stage2: 'Stage 2',
    stage3: 'Stage 3',
    stage4: 'Stage 4',
    stage5: 'Stage 5',
    writingEvents: 'Writing Events',
    writingEventsText: 'Future creator events can reward authors who join challenges, contests, or seasonal programs.',
    bonusRewards: 'Bonus Rewards',
    bonusRewardsText: 'High-performing authors may receive extra rewards based on platform programs.',
    publishingOpportunities: 'Publishing Opportunities',
    publishingOpportunitiesText: 'Selected works may get special promotion or official publishing opportunities.',
    readerSupport: 'Reader Support',
    readerSupportText: 'Build a loyal audience through comments, follows, unlocks, and future fan support tools.',
    later: 'Later',
    growing: 'Growing',
    yes: 'YES',
    no: 'NO',
    heroLine1: 'Write your stories.',
    heroLine2: 'Delight your readers.',
    heroLine3: 'Earn more with every milestone!',
    heroBody: 'Earn from Diamond unlocks, grow through Quest, and receive automatic monthly payouts.',
    viewQuest: 'View Quest',
    howYouEarn: 'How You Earn',
    howYouEarnSubtitle: 'Simple earning flow for authors.',
    chapter1: 'Chapter 1',
    chapter1Title: 'Readers unlock paid episodes',
    chapter1Text: 'When a reader unlocks your locked episode with Diamonds, the system records paid support for your story.',
    chapter2: 'Chapter 2',
    chapter2Title: 'Your Quest stage decides your share',
    chapter2Text: 'Your author share starts at 10% and can grow through Quest milestones. Higher stages mean higher income share.',
    chapter3: 'Chapter 3',
    chapter3Title: 'Payout is automatic',
    chapter3Text: 'You do not need to request withdrawal. Admin reviews and processes author payouts every month.',
    paidIncome: 'What Counts as Paid Income',
    paidIncomeSubtitle: 'Only paid Diamond unlocks count for author income in this stage.',
    paidIncomeQuestion: 'What Counts as Paid Income?',
    diamondUnlocks: 'Diamond unlocks',
    diamondUnlocksText: 'Paid episode unlocks with Diamonds are counted as author income.',
    freeFirst5: 'Free first 5 episodes',
    freeFirst5Text: 'Episodes 1–5 help readers discover your story, but they do not count as paid income.',
    freeMethods: 'Gems, Vouchers, Story Cards, and Free Access',
    freeMethodsText: 'These methods are free or reward-based access for readers and do not count as paid income yet.',
    engagement: 'Views, comments, and likes',
    engagementText: 'These help your Quest progress and ranking, but they are not direct paid income yet.',
    growShare: 'Grow Your Share',
    growShareSubtitle: 'Your share can grow as your author account reaches stronger milestones.',
    creatorBoost: '100-Day Creator Boost',
    creatorBoostText: 'Top milestone authors can unlock 100% revenue share for 100 days, one time only per author account.',
    automaticMonthlyPayout: 'Automatic Monthly Payout',
    automaticMonthlyPayoutSubtitle: 'No withdrawal request is needed.',
    monthEnds: 'Month Ends',
    monthEndsText: 'We calculate your total earnings.',
    autoProcessing: 'Auto Processing',
    autoProcessingText: 'Earnings are reviewed and processed.',
    payoutToYou: 'Payout to You',
    payoutToYouText: 'Funds are sent to your registered account.',
    notified: 'You Get Notified',
    notifiedText: 'Check your email for payout details.',
    viewIncome: 'View My Income',
    viewIncomeText: 'Review your earnings and payout history.',
    paymentReady: 'Keep payment info ready',
    paymentReadyText: 'Update Bank QR, PayPal, or phone payout details.',
    specialPrograms: 'Special Programs',
    specialProgramsSubtitle: 'More creator rewards can be added as the platform grows.',
    supportJourney: 'We are here to support your journey.',
    keepCreating: 'Keep creating, keep growing, keep shining.',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    authorBenefits: 'អត្ថប្រយោជន៍អ្នកនិពន្ធ',
    creatorProgramsRules: 'កម្មវិធី និងច្បាប់សម្រាប់អ្នកបង្កើត',
    diamondIncome: 'ចំណូល Diamond',
    diamondIncomeText: 'រកចំណូលពីការដោះសោបង់ប្រាក់',
    questShare: 'ចំណែក Quest',
    questShareText: 'បង្កើនកម្រិតចំណែករបស់អ្នក',
    autoPayout: 'បង់ប្រាក់ស្វ័យប្រវត្តិ',
    autoPayoutText: 'Admin បង់ប្រចាំខែ',
    boost100: 'Boost 100 ថ្ងៃ',
    boost100Text: 'រង្វាន់ម្តងក្នុងគណនី',
    stage1: 'កម្រិត 1',
    stage2: 'កម្រិត 2',
    stage3: 'កម្រិត 3',
    stage4: 'កម្រិត 4',
    stage5: 'កម្រិត 5',
    writingEvents: 'ព្រឹត្តិការណ៍សរសេរ',
    writingEventsText: 'ព្រឹត្តិការណ៍អ្នកបង្កើតនាពេលអនាគតអាចផ្តល់រង្វាន់ដល់អ្នកនិពន្ធដែលចូលរួមបេសកកម្ម ការប្រកួត ឬកម្មវិធីតាមរដូវ។',
    bonusRewards: 'រង្វាន់បន្ថែម',
    bonusRewardsText: 'អ្នកនិពន្ធដែលមានលទ្ធផលល្អអាចទទួលរង្វាន់បន្ថែមតាមកម្មវិធីរបស់ Platform។',
    publishingOpportunities: 'ឱកាសបោះពុម្ព',
    publishingOpportunitiesText: 'ស្នាដៃដែលត្រូវបានជ្រើសរើសអាចទទួលការផ្សព្វផ្សាយពិសេស ឬឱកាសបោះពុម្ពផ្លូវការ។',
    readerSupport: 'ការគាំទ្រពីអ្នកអាន',
    readerSupportText: 'បង្កើតអ្នកគាំទ្រដោយមតិយោបល់ Follow ការដោះសោ និងឧបករណ៍គាំទ្រផ្សេងៗ។',
    later: 'ពេលក្រោយ',
    growing: 'កំពុងអភិវឌ្ឍ',
    yes: 'បាទ',
    no: 'ទេ',
    heroLine1: 'សរសេររឿងរបស់អ្នក។',
    heroLine2: 'ធ្វើឱ្យអ្នកអានរីករាយ។',
    heroLine3: 'រកចំណូលកាន់តែច្រើនតាម milestone!',
    heroBody: 'រកចំណូលពីការដោះសោ Diamond បង្កើនតាម Quest និងទទួលការបង់ប្រាក់ប្រចាំខែដោយស្វ័យប្រវត្តិ។',
    viewQuest: 'មើល Quest',
    howYouEarn: 'របៀបរកចំណូល',
    howYouEarnSubtitle: 'លំហូររកចំណូលសាមញ្ញសម្រាប់អ្នកនិពន្ធ។',
    chapter1: 'ជំពូក 1',
    chapter1Title: 'អ្នកអានដោះសោភាគបង់ប្រាក់',
    chapter1Text: 'ពេលអ្នកអានដោះសោភាគដែលចាក់សោដោយ Diamonds ប្រព័ន្ធនឹងកត់ត្រាការគាំទ្របង់ប្រាក់សម្រាប់រឿងរបស់អ្នក។',
    chapter2: 'ជំពូក 2',
    chapter2Title: 'កម្រិត Quest កំណត់ចំណែករបស់អ្នក',
    chapter2Text: 'ចំណែកអ្នកនិពន្ធចាប់ផ្តើមពី 10% ហើយអាចកើនតាម milestone របស់ Quest។ កម្រិតខ្ពស់មានចំណែកចំណូលខ្ពស់ជាង។',
    chapter3: 'ជំពូក 3',
    chapter3Title: 'ការបង់ប្រាក់ស្វ័យប្រវត្តិ',
    chapter3Text: 'អ្នកមិនចាំបាច់ស្នើដកប្រាក់ទេ។ Admin ពិនិត្យ និងដំណើរការការបង់ប្រាក់អ្នកនិពន្ធរៀងរាល់ខែ។',
    paidIncome: 'អ្វីខ្លះរាប់ជាចំណូលបង់ប្រាក់',
    paidIncomeSubtitle: 'ក្នុងដំណាក់កាលនេះ មានតែការដោះសោ Diamond បង់ប្រាក់ប៉ុណ្ណោះដែលរាប់ជាចំណូលអ្នកនិពន្ធ។',
    paidIncomeQuestion: 'អ្វីខ្លះរាប់ជាចំណូលបង់ប្រាក់?',
    diamondUnlocks: 'ការដោះសោ Diamond',
    diamondUnlocksText: 'ការដោះសោភាគបង់ប្រាក់ដោយ Diamonds ត្រូវបានរាប់ជាចំណូលអ្នកនិពន្ធ។',
    freeFirst5: 'ភាគ 1–5 ឥតគិតថ្លៃ',
    freeFirst5Text: 'ភាគ 1–5 ជួយឱ្យអ្នកអានស្គាល់រឿង ប៉ុន្តែមិនរាប់ជាចំណូលបង់ប្រាក់ទេ។',
    freeMethods: 'Gems, Vouchers, Story Cards និង Free Access',
    freeMethodsText: 'វិធីទាំងនេះជាការចូលអានឥតគិតថ្លៃ ឬរង្វាន់ ហើយមិនទាន់រាប់ជាចំណូលបង់ប្រាក់ទេ។',
    engagement: 'Views, មតិយោបល់ និង Likes',
    engagementText: 'វាជួយ Quest និង Ranking ប៉ុន្តែមិនមែនជាចំណូលបង់ប្រាក់ដោយផ្ទាល់ទេ។',
    growShare: 'បង្កើនចំណែករបស់អ្នក',
    growShareSubtitle: 'ចំណែករបស់អ្នកអាចកើនឡើង ពេលគណនីអ្នកនិពន្ធឈានដល់ milestone ខ្ពស់ជាង។',
    creatorBoost: 'Creator Boost 100 ថ្ងៃ',
    creatorBoostText: 'អ្នកនិពន្ធដែលឈានដល់ milestone ខ្ពស់អាចបើកចំណែកចំណូល 100% រយៈពេល 100 ថ្ងៃ ម្តងគត់ក្នុងមួយគណនី។',
    automaticMonthlyPayout: 'ការបង់ប្រាក់ប្រចាំខែដោយស្វ័យប្រវត្តិ',
    automaticMonthlyPayoutSubtitle: 'មិនចាំបាច់ស្នើដកប្រាក់។',
    monthEnds: 'ចប់ខែ',
    monthEndsText: 'យើងគណនាចំណូលសរុបរបស់អ្នក។',
    autoProcessing: 'ដំណើរការស្វ័យប្រវត្តិ',
    autoProcessingText: 'ចំណូលត្រូវបានពិនិត្យ និងដំណើរការ។',
    payoutToYou: 'បង់ប្រាក់ទៅអ្នក',
    payoutToYouText: 'ប្រាក់ត្រូវបានផ្ញើទៅគណនីដែលអ្នកបានចុះឈ្មោះ។',
    notified: 'អ្នកនឹងទទួលដំណឹង',
    notifiedText: 'ពិនិត្យអ៊ីមែលសម្រាប់ព័ត៌មានបង់ប្រាក់។',
    viewIncome: 'មើលចំណូលរបស់ខ្ញុំ',
    viewIncomeText: 'ពិនិត្យចំណូល និងប្រវត្តិបង់ប្រាក់។',
    paymentReady: 'ត្រៀមព័ត៌មានទទួលប្រាក់',
    paymentReadyText: 'កែ Bank QR, PayPal ឬព័ត៌មានទទួលប្រាក់តាមទូរស័ព្ទ។',
    specialPrograms: 'កម្មវិធីពិសេស',
    specialProgramsSubtitle: 'រង្វាន់អ្នកបង្កើតបន្ថែមអាចត្រូវបានបន្ថែម ពេល Platform រីកចម្រើន។',
    supportJourney: 'យើងនៅទីនេះដើម្បីគាំទ្រដំណើររបស់អ្នក។',
    keepCreating: 'បន្តបង្កើត បន្តរីកចម្រើន និងបន្តភ្លឺចែងចាំង។',
  },
  zh: {
    back: '返回',
    authorBenefits: '作者福利',
    creatorProgramsRules: '创作者计划与规则',
    diamondIncome: 'Diamond 收入',
    diamondIncomeText: '从付费解锁中获得收入',
    questShare: 'Quest 分成',
    questShareText: '提升你的分成等级',
    autoPayout: '自动付款',
    autoPayoutText: '管理员每月付款',
    boost100: '100天加成',
    boost100Text: '每个账户一次的奖励',
    stage1: '阶段 1', stage2: '阶段 2', stage3: '阶段 3', stage4: '阶段 4', stage5: '阶段 5',
    writingEvents: '写作活动',
    writingEventsText: '未来的创作者活动可奖励参加挑战、竞赛或季节计划的作者。',
    bonusRewards: '额外奖励',
    bonusRewardsText: '表现优秀的作者可能根据平台计划获得额外奖励。',
    publishingOpportunities: '出版机会',
    publishingOpportunitiesText: '入选作品可能获得特别推广或官方出版机会。',
    readerSupport: '读者支持',
    readerSupportText: '通过评论、关注、解锁以及未来的粉丝支持工具建立忠实读者群。',
    later: '稍后',
    growing: '发展中',
    yes: '是', no: '否',
    heroLine1: '写下你的故事。',
    heroLine2: '打动你的读者。',
    heroLine3: '每达成一个里程碑，收入更进一步！',
    heroBody: '从 Diamond 解锁获得收入，通过 Quest 成长，并获得每月自动付款。',
    viewQuest: '查看 Quest',
    howYouEarn: '如何获得收入',
    howYouEarnSubtitle: '作者的简单收入流程。',
    chapter1: '第 1 章',
    chapter1Title: '读者解锁付费章节',
    chapter1Text: '读者使用 Diamonds 解锁付费章节时，系统会记录对你作品的付费支持。',
    chapter2: '第 2 章',
    chapter2Title: 'Quest 阶段决定你的分成',
    chapter2Text: '作者分成从 10% 开始，可通过 Quest 里程碑提升。阶段越高，收入分成越高。',
    chapter3: '第 3 章',
    chapter3Title: '自动付款',
    chapter3Text: '无需申请提现，管理员每月审核并处理作者付款。',
    paidIncome: '哪些计入付费收入',
    paidIncomeSubtitle: '现阶段只有付费 Diamond 解锁计入作者收入。',
    paidIncomeQuestion: '哪些计入付费收入？',
    diamondUnlocks: 'Diamond 解锁',
    diamondUnlocksText: '使用 Diamonds 的付费章节解锁计入作者收入。',
    freeFirst5: '前5章免费',
    freeFirst5Text: '第 1–5 章帮助读者发现你的作品，但不计入付费收入。',
    freeMethods: 'Gems、Vouchers、Story Cards 和免费访问',
    freeMethodsText: '这些是免费或奖励型访问方式，目前不计入付费收入。',
    engagement: '浏览、评论和点赞',
    engagementText: '这些有助于 Quest 进度和排名，但目前不是直接付费收入。',
    growShare: '提升分成',
    growShareSubtitle: '作者账户达到更高里程碑后，分成比例可以提高。',
    creatorBoost: '100天创作者加成',
    creatorBoostText: '达到最高里程碑的作者可获得100%收入分成100天，每个作者账户仅一次。',
    automaticMonthlyPayout: '每月自动付款',
    automaticMonthlyPayoutSubtitle: '无需申请提现。',
    monthEnds: '月末',
    monthEndsText: '我们计算你的总收入。',
    autoProcessing: '自动处理',
    autoProcessingText: '收入会被审核并处理。',
    payoutToYou: '付款给你',
    payoutToYouText: '款项发送到你登记的账户。',
    notified: '收到通知',
    notifiedText: '查看邮箱获取付款详情。',
    viewIncome: '查看我的收入',
    viewIncomeText: '查看收入和付款记录。',
    paymentReady: '准备好收款信息',
    paymentReadyText: '更新银行二维码、PayPal 或手机号收款信息。',
    specialPrograms: '特别计划',
    specialProgramsSubtitle: '随着平台发展，将可增加更多创作者奖励。',
    supportJourney: '我们会支持你的创作旅程。',
    keepCreating: '继续创作、继续成长、继续闪耀。',
  },
  ja: {
    back: '戻る',
    authorBenefits: '作者特典',
    creatorProgramsRules: 'クリエイタープログラムとルール',
    diamondIncome: 'Diamond 収益',
    diamondIncomeText: '有料解放から収益を得る',
    questShare: 'Quest 分配率',
    questShareText: '分配率のレベルを上げる',
    autoPayout: '自動支払い',
    autoPayoutText: '管理者による月次支払い',
    boost100: '100日ブースト',
    boost100Text: 'アカウントにつき一度の特典',
    stage1: 'ステージ 1', stage2: 'ステージ 2', stage3: 'ステージ 3', stage4: 'ステージ 4', stage5: 'ステージ 5',
    writingEvents: '執筆イベント',
    writingEventsText: '将来のクリエイターイベントでは、チャレンジやコンテスト、季節企画に参加する作者へ報酬を提供できます。',
    bonusRewards: 'ボーナス報酬',
    bonusRewardsText: '成果の高い作者はプラットフォーム企画に応じて追加報酬を受け取れる場合があります。',
    publishingOpportunities: '出版の機会',
    publishingOpportunitiesText: '選ばれた作品は特別プロモーションや公式出版の機会を得られる場合があります。',
    readerSupport: '読者サポート',
    readerSupportText: 'コメント、フォロー、解放、今後のファンサポート機能で忠実な読者を育てましょう。',
    later: '今後',
    growing: '拡大中',
    yes: 'はい', no: 'いいえ',
    heroLine1: '物語を書こう。',
    heroLine2: '読者を楽しませよう。',
    heroLine3: '節目を重ねるほど収益アップ！',
    heroBody: 'Diamond 解放から収益を得て、Quest で成長し、毎月の自動支払いを受け取れます。',
    viewQuest: 'Questを見る',
    howYouEarn: '収益の仕組み',
    howYouEarnSubtitle: '作者向けのシンプルな収益フロー。',
    chapter1: 'チャプター 1',
    chapter1Title: '読者が有料エピソードを解放',
    chapter1Text: '読者が Diamonds でロックされたエピソードを解放すると、作品への有料支援として記録されます。',
    chapter2: 'チャプター 2',
    chapter2Title: 'Quest ステージが分配率を決定',
    chapter2Text: '作者分配率は10%から始まり、Quest のマイルストーンで上昇します。ステージが高いほど収益分配率も高くなります。',
    chapter3: 'チャプター 3',
    chapter3Title: '支払いは自動',
    chapter3Text: '出金申請は不要です。管理者が毎月作者の支払いを確認・処理します。',
    paidIncome: '有料収益に含まれるもの',
    paidIncomeSubtitle: '現段階では有料 Diamond 解放のみが作者収益に含まれます。',
    paidIncomeQuestion: '有料収益に含まれるものは？',
    diamondUnlocks: 'Diamond 解放',
    diamondUnlocksText: 'Diamonds による有料エピソード解放は作者収益として計上されます。',
    freeFirst5: '最初の5話は無料',
    freeFirst5Text: 'エピソード1〜5は作品を知ってもらうためのもので、有料収益には含まれません。',
    freeMethods: 'Gems、Vouchers、Story Cards、無料アクセス',
    freeMethodsText: 'これらは無料または報酬ベースのアクセスで、現時点では有料収益に含まれません。',
    engagement: '閲覧、コメント、いいね',
    engagementText: 'Quest の進捗やランキングに役立ちますが、現時点では直接の有料収益ではありません。',
    growShare: '分配率を上げる',
    growShareSubtitle: '作者アカウントが高いマイルストーンに到達すると分配率を上げられます。',
    creatorBoost: '100日クリエイターブースト',
    creatorBoostText: '最高マイルストーンの作者は100%収益分配を100日間、一アカウントにつき一度だけ利用できます。',
    automaticMonthlyPayout: '毎月の自動支払い',
    automaticMonthlyPayoutSubtitle: '出金申請は不要です。',
    monthEnds: '月末',
    monthEndsText: '総収益を計算します。',
    autoProcessing: '自動処理',
    autoProcessingText: '収益を確認して処理します。',
    payoutToYou: 'あなたへ支払い',
    payoutToYouText: '登録済み口座へ送金します。',
    notified: '通知を受け取る',
    notifiedText: '支払い詳細はメールで確認できます。',
    viewIncome: '収益を見る',
    viewIncomeText: '収益と支払い履歴を確認します。',
    paymentReady: '受取情報を準備',
    paymentReadyText: '銀行QR、PayPal、電話番号の受取情報を更新します。',
    specialPrograms: '特別プログラム',
    specialProgramsSubtitle: 'プラットフォームの成長に合わせ、さらに多くのクリエイター報酬を追加できます。',
    supportJourney: 'あなたの創作活動を応援します。',
    keepCreating: '作り続け、成長し続け、輝き続けよう。',
  },
  ko: {
    back: '뒤로',
    authorBenefits: '작가 혜택',
    creatorProgramsRules: '크리에이터 프로그램 및 규칙',
    diamondIncome: 'Diamond 수입',
    diamondIncomeText: '유료 잠금 해제로 수입 얻기',
    questShare: 'Quest 지분',
    questShareText: '수익 지분 단계 높이기',
    autoPayout: '자동 지급',
    autoPayoutText: '관리자 월 지급',
    boost100: '100일 부스트',
    boost100Text: '계정당 1회 보상',
    stage1: '단계 1', stage2: '단계 2', stage3: '단계 3', stage4: '단계 4', stage5: '단계 5',
    writingEvents: '글쓰기 이벤트',
    writingEventsText: '향후 크리에이터 이벤트에서는 챌린지, 콘테스트, 시즌 프로그램 참여 작가에게 보상을 제공할 수 있습니다.',
    bonusRewards: '보너스 보상',
    bonusRewardsText: '성과가 높은 작가는 플랫폼 프로그램에 따라 추가 보상을 받을 수 있습니다.',
    publishingOpportunities: '출판 기회',
    publishingOpportunitiesText: '선정된 작품은 특별 홍보 또는 공식 출판 기회를 받을 수 있습니다.',
    readerSupport: '독자 지원',
    readerSupportText: '댓글, 팔로우, 잠금 해제 및 향후 팬 지원 기능으로 충성 독자를 만들어 보세요.',
    later: '추후',
    growing: '성장 중',
    yes: '예', no: '아니요',
    heroLine1: '이야기를 쓰세요.',
    heroLine2: '독자를 즐겁게 하세요.',
    heroLine3: '마일스톤마다 더 많은 수입을!',
    heroBody: 'Diamond 잠금 해제로 수입을 얻고 Quest로 성장하며 매월 자동 지급을 받으세요.',
    viewQuest: 'Quest 보기',
    howYouEarn: '수입 방식',
    howYouEarnSubtitle: '작가를 위한 간단한 수입 흐름.',
    chapter1: '챕터 1',
    chapter1Title: '독자가 유료 에피소드 잠금 해제',
    chapter1Text: '독자가 Diamonds로 잠긴 에피소드를 해제하면 시스템이 작품에 대한 유료 지원으로 기록합니다.',
    chapter2: '챕터 2',
    chapter2Title: 'Quest 단계가 수익 지분 결정',
    chapter2Text: '작가 지분은 10%에서 시작하며 Quest 마일스톤에 따라 증가합니다. 단계가 높을수록 수익 지분도 높아집니다.',
    chapter3: '챕터 3',
    chapter3Title: '지급은 자동',
    chapter3Text: '출금 요청이 필요하지 않습니다. 관리자가 매월 작가 지급을 검토하고 처리합니다.',
    paidIncome: '유료 수입에 포함되는 항목',
    paidIncomeSubtitle: '현재 단계에서는 유료 Diamond 잠금 해제만 작가 수입에 포함됩니다.',
    paidIncomeQuestion: '유료 수입에 포함되는 항목은?',
    diamondUnlocks: 'Diamond 잠금 해제',
    diamondUnlocksText: 'Diamonds를 사용한 유료 에피소드 잠금 해제는 작가 수입으로 계산됩니다.',
    freeFirst5: '첫 5개 에피소드 무료',
    freeFirst5Text: '에피소드 1~5는 독자가 작품을 발견하는 데 도움을 주지만 유료 수입에는 포함되지 않습니다.',
    freeMethods: 'Gems, Vouchers, Story Cards 및 무료 이용',
    freeMethodsText: '이 방식은 무료 또는 보상 기반 이용이며 현재 유료 수입에는 포함되지 않습니다.',
    engagement: '조회수, 댓글, 좋아요',
    engagementText: 'Quest 진행과 랭킹에는 도움이 되지만 현재 직접 유료 수입은 아닙니다.',
    growShare: '수익 지분 높이기',
    growShareSubtitle: '작가 계정이 더 높은 마일스톤에 도달하면 수익 지분을 높일 수 있습니다.',
    creatorBoost: '100일 크리에이터 부스트',
    creatorBoostText: '최상위 마일스톤 작가는 계정당 한 번, 100일 동안 100% 수익 지분을 받을 수 있습니다.',
    automaticMonthlyPayout: '월 자동 지급',
    automaticMonthlyPayoutSubtitle: '출금 요청이 필요하지 않습니다.',
    monthEnds: '월말',
    monthEndsText: '총 수입을 계산합니다.',
    autoProcessing: '자동 처리',
    autoProcessingText: '수입을 검토하고 처리합니다.',
    payoutToYou: '지급',
    payoutToYouText: '등록된 계정으로 자금을 보냅니다.',
    notified: '알림 수신',
    notifiedText: '지급 상세 내용은 이메일에서 확인하세요.',
    viewIncome: '내 수입 보기',
    viewIncomeText: '수입과 지급 내역을 확인합니다.',
    paymentReady: '지급 정보 준비',
    paymentReadyText: '은행 QR, PayPal 또는 전화번호 지급 정보를 업데이트하세요.',
    specialPrograms: '특별 프로그램',
    specialProgramsSubtitle: '플랫폼 성장에 따라 더 많은 크리에이터 보상을 추가할 수 있습니다.',
    supportJourney: '여러분의 여정을 함께 응원합니다.',
    keepCreating: '계속 만들고, 성장하고, 빛나세요.',
  },
})


const HERO_IMAGE = '/assets/Author Benefits/Author Benefits 1.png'
const MANGA_IMAGE = '/assets/Author Benefits/author-benefits-manga-girl.webp'

const BENEFITS = [
  {
    icon: 'fa-solid fa-gem',
    titleKey: 'diamondIncome',
    textKey: 'diamondIncomeText',
    tone: 'purple',
  },
  {
    icon: 'fa-solid fa-chart-line',
    titleKey: 'questShare',
    textKey: 'questShareText',
    tone: 'pink',
  },
  {
    icon: 'fa-solid fa-wallet',
    titleKey: 'autoPayout',
    textKey: 'autoPayoutText',
    tone: 'gold',
  },
  {
    icon: 'fa-solid fa-crown',
    titleKey: 'boost100',
    textKey: 'boost100Text',
    tone: 'blue',
  },
]

const SHARE_STAGES = [
  ['10%', 'stage1'],
  ['20%', 'stage2'],
  ['30%', 'stage3'],
  ['40%', 'stage4'],
  ['50%', 'stage5'],
]

const PROGRAMS = [
  {
    icon: 'fa-solid fa-feather-pointed',
    titleKey: 'writingEvents',
    textKey: 'writingEventsText',
    badgeKey: 'later',
  },
  {
    icon: 'fa-solid fa-gift',
    titleKey: 'bonusRewards',
    textKey: 'bonusRewardsText',
    badgeKey: 'later',
  },
  {
    icon: 'fa-solid fa-book-open',
    titleKey: 'publishingOpportunities',
    textKey: 'publishingOpportunitiesText',
    badgeKey: 'later',
  },
  {
    icon: 'fa-solid fa-heart',
    titleKey: 'readerSupport',
    textKey: 'readerSupportText',
    badgeKey: 'growing',
  },
]

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadff4] bg-[var(--shadow-bg-surface)] text-[#6e4a95] shadow-[0_5px_16px_rgba(88,62,119,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding({ dark = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-[30px] border-r ${
        dark
          ? 'border-white/10 bg-[var(--shadow-bg-surface)]/[0.04]'
          : 'border-[#dfd0ef] bg-[linear-gradient(180deg,#eee5ff_0%,#fbf7ff_100%)]'
      }`}
    >
      {[28, 72, 116, 160, 204, 248, 292, 336].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span
            className={`block h-[12px] w-[12px] rounded-full border-2 ${
              dark
                ? 'border-[#d5b8ff] bg-[#34234d]'
                : 'border-[#9b72d5] bg-[var(--shadow-bg-surface)]'
            }`}
          />
          <span
            className={`absolute left-[7px] top-[4px] h-[3px] w-[12px] rounded-full ${
              dark ? 'bg-[#d9c2ff]' : 'bg-[#8c63c5]'
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
        blue ? 'bg-[#b8d1ff]/75' : 'bg-[#f8bed8]/75'
      } ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.38)_0_5px,transparent_5px_10px)]" />
    </div>
  )
}

function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <i className="fa-solid fa-star text-[12px] text-[#efb83c]" />
      <i className="fa-solid fa-heart ml-3 text-[10px] text-[#ef8fb7]" />
      <i className="fa-solid fa-star ml-3 text-[8px] text-[#9d79d4]" />
    </div>
  )
}

function RibbonTitle({ children, tone = 'purple' }) {
  const tones = {
    purple: 'border-[#c7ace9] bg-[#ede3ff] text-[#644391]',
    pink: 'border-[#f0bfd3] bg-[#ffe5ef] text-[#c45683]',
    blue: 'border-[#bfd0ef] bg-[#e7efff] text-[#536db4]',
    gold: 'border-[#ecd38c] bg-[#fff3c9] text-[#a06b08]',
  }

  return (
    <div className="flex justify-center">
      <div
        className={`relative inline-flex min-h-9 items-center justify-center rounded-[12px] border px-5 py-2 text-center text-[14px] font-black tracking-[-0.02em] shadow-sm ${
          tones[tone] || tones.purple
        }`}
      >
        <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-current/20 bg-inherit" />
        <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-current/20 bg-inherit" />
        {children}
      </div>
    </div>
  )
}

function PaperSection({ title, subtitle, icon, children, tone = 'purple' }) {
  const styles = {
    purple: {
      border: 'border-[#ddd0ed]',
      icon: 'bg-[#eee5ff] text-[#7651b0]',
    },
    pink: {
      border: 'border-[#efcddd]',
      icon: 'bg-[#ffe5ef] text-[#d96896]',
    },
    blue: {
      border: 'border-[#cad9f3]',
      icon: 'bg-[#e8efff] text-[#5a75c3]',
    },
    gold: {
      border: 'border-[#ead8a4]',
      icon: 'bg-[#fff3d0] text-[#c69018]',
    },
  }

  const style = styles[tone] || styles.purple

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${style.border} bg-[var(--shadow-bg-surface)] p-4 shadow-[0_12px_30px_rgba(86,61,118,0.07)]`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(115,89,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(115,89,145,0.035) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[7deg]" blue={tone === 'blue'} />

      <div className="mb-4 flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
          <i className={`${icon} text-[14px]`} />
        </span>

        <div className="min-w-0">
          <h2 className="text-[17px] font-black tracking-[-0.03em] text-[var(--shadow-text-primary)]">
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

function BenefitCard({ icon, titleKey, textKey, tone }) {
  const { t } = useDisplayTranslation()
  const tones = {
    purple: {
      outer: 'border-[#d8c7f0] bg-[var(--shadow-bg-surface)]',
      icon: 'bg-[#eee5ff] text-[#7b56b6]',
    },
    pink: {
      outer: 'border-[#f0cbdc] bg-[var(--shadow-bg-surface)]',
      icon: 'bg-[#ffe2ed] text-[#df6797]',
    },
    gold: {
      outer: 'border-[#ead7a6] bg-[var(--shadow-bg-surface)]',
      icon: 'bg-[#fff0c2] text-[#c48a12]',
    },
    blue: {
      outer: 'border-[#cbd8f2] bg-[var(--shadow-bg-surface)]',
      icon: 'bg-[#e8efff] text-[#5572bf]',
    },
  }

  const style = tones[tone] || tones.purple

  return (
    <div className={`relative rounded-[22px] border p-3.5 text-center shadow-[0_5px_16px_rgba(78,57,104,0.05)] ${style.outer}`}>
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-[18px] ${style.icon}`}>
        <i className={`${icon} text-[18px]`} />
      </div>
      <div className="mt-2.5 text-[12.5px] font-black text-[var(--shadow-text-primary)]">{t(`authorBenefits.${titleKey}`)}</div>
      <p className="mt-1 text-[10px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">{t(`authorBenefits.${textKey}`)}</p>
    </div>
  )
}

function StoryStep({ number, title, text, icon, tone = 'purple' }) {
  const tones = {
    purple: 'bg-[#eee5ff] text-[#7652ae]',
    pink: 'bg-[#ffe5ef] text-[#d26491]',
    gold: 'bg-[#fff0c8] text-[#c88c15]',
  }

  return (
    <div className="relative rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${tones[tone]}`}>
          <i className={`${icon} text-[15px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#f6f0fb] px-2 py-0.5 text-[8.5px] font-black text-[#81689b]">
              {number}
            </span>
            <h3 className="text-[12.5px] font-black leading-5 text-[var(--shadow-text-primary)]">{title}</h3>
          </div>
          <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">{text}</p>
        </div>
      </div>
    </div>
  )
}

function IncomeRule({ positive = true, title, text, icon }) {
  const { t } = useDisplayTranslation()

  return (
    <div
      className={`rounded-[20px] border p-3 ${
        positive
          ? 'border-[#cfe6d2] bg-[#f6fff8]'
          : 'border-[#f0ccd8] bg-[#fff7fa]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
            positive
              ? 'bg-[#e7f8ea] text-[#47a35f]'
              : 'bg-[#ffe6ee] text-[#de638c]'
          }`}
        >
          <i className={`${icon || (positive ? 'fa-solid fa-check' : 'fa-solid fa-xmark')} text-[12px]`} />
        </span>

        <div className="min-w-0">
          <div className={`text-[12px] font-black ${positive ? 'text-[#3e7f50]' : 'text-[#bd5277]'}`}>
            {positive ? `${t('authorBenefits.yes')} · ` : `${t('authorBenefits.no')} · `}
            <span className="text-[var(--shadow-text-primary)]">{title}</span>
          </div>
          <p className="mt-1 text-[10px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">{text}</p>
        </div>
      </div>
    </div>
  )
}

function ShareBadge({ share, stage, index }) {
  const colors = [
    'border-[#cab5ec] bg-[#f1e8ff] text-[#7046a6]',
    'border-[#efbed0] bg-[#ffe5ef] text-[#c64f7d]',
    'border-[#efd08b] bg-[#fff0c4] text-[#b6770a]',
    'border-[#c8d5f0] bg-[#eaf0ff] text-[#506db6]',
    'border-[#efb7c8] bg-[#ffe0e9] text-[#c84d75]',
  ]

  return (
    <div className={`rounded-[20px] border px-2 py-3 text-center ${colors[index]}`}>
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-[var(--shadow-bg-surface)] text-[14px] font-black">
        {share}
      </div>
      <div className="mt-2 text-[8.5px] font-black">{stage}</div>
    </div>
  )
}

function PayoutStep({ icon, title, text, tone = 'purple' }) {
  const tones = {
    purple: 'bg-[#eee5ff] text-[#7350ac]',
    pink: 'bg-[#ffe5ef] text-[#d26390]',
    gold: 'bg-[#fff0c8] text-[#c58912]',
    blue: 'bg-[#e8efff] text-[#5773c0]',
  }

  return (
    <div className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-center">
      <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <i className={`${icon} text-[14px]`} />
      </span>
      <div className="mt-2 text-[11px] font-black text-[var(--shadow-text-primary)]">{title}</div>
      <p className="mt-1 text-[9px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">{text}</p>
    </div>
  )
}

function ProgramCard({ icon, titleKey, textKey, badgeKey }) {
  const { t } = useDisplayTranslation()
  const growing = badgeKey === 'growing'

  return (
    <div className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0e8fb] text-[#7651ad]">
          <i className={`${icon} text-[14px]`} />
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.04em] ${
            growing
              ? 'bg-[#eaf8ed] text-[#4d985f]'
              : 'bg-[#fff0df] text-[#c26e2d]'
          }`}
        >
          {t(`authorBenefits.${badgeKey}`)}
        </span>
      </div>

      <div className="mt-3 text-[12.5px] font-black text-[var(--shadow-text-primary)]">{t(`authorBenefits.${titleKey}`)}</div>
      <p className="mt-1 text-[10px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">{t(`authorBenefits.${textKey}`)}</p>
    </div>
  )
}

export default function AuthorBenefitsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [searchParams] = useSearchParams()
  const fromPage = searchParams.get('from')

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-8">
      <div className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label={t('authorBenefits.back')}
            onClick={() =>
              navigate(fromPage === 'quest' ? '/author/quest' : '/author/profile', {
                replace: true,
              })
            }
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-[9px] text-[#eeb63d]" />
              <h1 className="text-[19px] font-black tracking-[-0.04em] text-[var(--shadow-text-primary)]">
                {t('authorBenefits.authorBenefits')}
              </h1>
              <i className="fa-solid fa-heart text-[9px] text-[#ed8fb5]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--shadow-text-tertiary)]">
              {t('authorBenefits.creatorProgramsRules')}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff2c9] text-[#d69d1a]">
            <i className="fa-solid fa-book-open text-[12px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        <section
          className="relative overflow-hidden rounded-[30px] border border-[#cdb9ed] bg-[var(--shadow-bg-surface)] shadow-[0_16px_36px_rgba(94,58,142,0.13)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(113,84,148,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(113,84,148,0.04) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <SpiralBinding />
          <Sparkles className="absolute right-5 top-4" />
          <Tape className="right-4 top-[74px] rotate-[8deg]" />

          <div className="relative min-h-[300px] pl-[46px] pr-4 pt-5">
            <div className="absolute right-[-14px] top-[52px] h-[218px] w-[218px] sm:right-3 sm:top-[30px] sm:h-[255px] sm:w-[255px]">
              <img
                src={MANGA_IMAGE}
                alt={t('authorBenefits.authorBenefits')}
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = HERO_IMAGE
                }}
                className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_26px_rgba(76,49,110,0.18)]"
              />
            </div>

            <div className="relative z-10 max-w-[62%] sm:max-w-[56%]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6b0cc] px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white">
                <i className="fa-solid fa-heart text-[7px]" />
                {t('authorBenefits.creatorProgramsRules')}
              </div>

              <h2 className="mt-3 bg-[linear-gradient(180deg,#7b54a8_0%,#d45f91_100%)] bg-clip-text text-[34px] font-black leading-[0.95] tracking-[-0.05em] text-transparent sm:text-[44px]">
                {t('authorBenefits.authorBenefits')}
              </h2>

              <p className="mt-3 text-[12px] font-black leading-5 text-[var(--shadow-text-primary)]">
                {t('authorBenefits.heroLine1')}
                <br />
                {t('authorBenefits.heroLine2')}
                <br />
                <span className="text-[#d35c89]">{t('authorBenefits.heroLine3')}</span>
              </p>

              <p className="mt-2 max-w-[255px] text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorBenefits.heroBody')}
              </p>

              <button
                type="button"
                onClick={() => navigate('/author/quest')}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8b63c8_0%,#b16ddd_100%)] px-6 text-[12px] font-black text-white shadow-[0_8px_18px_rgba(117,78,171,0.24)] transition active:scale-95"
              >
                {t('authorBenefits.viewQuest')}
                <i className="fa-solid fa-star text-[9px] text-[#ffdf79]" />
              </button>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-[28px] border border-[#ddd0ed] bg-[var(--shadow-bg-surface)] p-3.5 shadow-[0_10px_28px_rgba(86,61,118,0.07)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(115,89,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(115,89,145,0.035) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {BENEFITS.map((item) => (
              <BenefitCard key={item.titleKey} {...item} />
            ))}
          </div>
        </section>

        <PaperSection
          title={t('authorBenefits.howYouEarn')}
          subtitle={t('authorBenefits.howYouEarnSubtitle')}
          icon="fa-solid fa-wand-magic-sparkles"
          tone="purple"
        >
          <RibbonTitle tone="purple">{t('authorBenefits.howYouEarn')}</RibbonTitle>

          <div className="mt-4 grid gap-2.5">
            <StoryStep
              number={t('authorBenefits.chapter1')}
              title={t('authorBenefits.chapter1Title')}
              text={t('authorBenefits.chapter1Text')}
              icon="fa-solid fa-book-open"
              tone="purple"
            />
            <StoryStep
              number={t('authorBenefits.chapter2')}
              title={t('authorBenefits.chapter2Title')}
              text={t('authorBenefits.chapter2Text')}
              icon="fa-solid fa-ranking-star"
              tone="pink"
            />
            <StoryStep
              number={t('authorBenefits.chapter3')}
              title={t('authorBenefits.chapter3Title')}
              text={t('authorBenefits.chapter3Text')}
              icon="fa-solid fa-piggy-bank"
              tone="gold"
            />
          </div>
        </PaperSection>

        <PaperSection
          title={t('authorBenefits.paidIncome')}
          subtitle={t('authorBenefits.paidIncomeSubtitle')}
          icon="fa-solid fa-gem"
          tone="pink"
        >
          <RibbonTitle tone="pink">{t('authorBenefits.paidIncomeQuestion')}</RibbonTitle>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <IncomeRule
              positive
              icon="fa-solid fa-gem"
              title={t('authorBenefits.diamondUnlocks')}
              text={t('authorBenefits.diamondUnlocksText')}
            />
            <IncomeRule
              positive={false}
              icon="fa-solid fa-gift"
              title={t('authorBenefits.freeFirst5')}
              text={t('authorBenefits.freeFirst5Text')}
            />
            <IncomeRule
              positive={false}
              icon="fa-solid fa-ticket"
              title={t('authorBenefits.freeMethods')}
              text={t('authorBenefits.freeMethodsText')}
            />
            <IncomeRule
              positive={false}
              icon="fa-solid fa-comments"
              title={t('authorBenefits.engagement')}
              text={t('authorBenefits.engagementText')}
            />
          </div>
        </PaperSection>

        <PaperSection
          title={t('authorBenefits.growShare')}
          subtitle={t('authorBenefits.growShareSubtitle')}
          icon="fa-solid fa-ranking-star"
          tone="blue"
        >
          <RibbonTitle tone="blue">{t('authorBenefits.growShare')}</RibbonTitle>

          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {SHARE_STAGES.map(([share, stageKey], index) => (
              <ShareBadge key={stageKey} share={share} stage={t(`authorBenefits.${stageKey}`)} index={index} />
            ))}
          </div>

          <div className="relative mt-3 overflow-hidden rounded-[22px] border border-[#e8cde0] bg-[linear-gradient(90deg,#fff0f6_0%,#f8efff_100%)] p-4">
            <div className="absolute -right-6 -top-7 h-24 w-24 rounded-full bg-[#d8c2ff]/30 blur-xl" />

            <div className="relative flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-[#ffe9aa] text-[#c5890a] shadow-sm">
                <i className="fa-solid fa-crown text-[16px]" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{t('authorBenefits.creatorBoost')}</div>
                <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                  {t('authorBenefits.creatorBoostText')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/author/quest')}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#7650ad] text-[11px] font-black text-white transition active:scale-[0.99]"
            >
              {t('authorBenefits.viewQuest')}
              <i className="fa-solid fa-star text-[8px] text-[#ffdf74]" />
            </button>
          </div>
        </PaperSection>

        <PaperSection
          title={t('authorBenefits.automaticMonthlyPayout')}
          subtitle={t('authorBenefits.automaticMonthlyPayoutSubtitle')}
          icon="fa-solid fa-calendar-check"
          tone="gold"
        >
          <RibbonTitle tone="gold">{t('authorBenefits.automaticMonthlyPayout')}</RibbonTitle>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <PayoutStep
              icon="fa-solid fa-calendar-days"
              title={t('authorBenefits.monthEnds')}
              text={t('authorBenefits.monthEndsText')}
              tone="pink"
            />
            <PayoutStep
              icon="fa-solid fa-clipboard-check"
              title={t('authorBenefits.autoProcessing')}
              text={t('authorBenefits.autoProcessingText')}
              tone="purple"
            />
            <PayoutStep
              icon="fa-solid fa-wallet"
              title={t('authorBenefits.payoutToYou')}
              text={t('authorBenefits.payoutToYouText')}
              tone="blue"
            />
            <PayoutStep
              icon="fa-solid fa-envelope"
              title={t('authorBenefits.notified')}
              text={t('authorBenefits.notifiedText')}
              tone="gold"
            />
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate('/author/income')}
              className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eee5ff] text-[#7650ad]">
                  <i className="fa-solid fa-chart-pie text-[14px]" />
                </span>
                <div>
                  <div className="text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorBenefits.viewIncome')}</div>
                  <div className="mt-0.5 text-[9.5px] font-semibold text-[var(--shadow-text-secondary)]">
                    {t('authorBenefits.viewIncomeText')}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/author/payment-method')}
              className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffe6ef] text-[#d36491]">
                  <i className="fa-solid fa-qrcode text-[14px]" />
                </span>
                <div>
                  <div className="text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorBenefits.paymentReady')}</div>
                  <div className="mt-0.5 text-[9.5px] font-semibold text-[var(--shadow-text-secondary)]">
                    {t('authorBenefits.paymentReadyText')}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </PaperSection>

        <PaperSection
          title={t('authorBenefits.specialPrograms')}
          subtitle={t('authorBenefits.specialProgramsSubtitle')}
          icon="fa-solid fa-gift"
          tone="purple"
        >
          <RibbonTitle tone="purple">{t('authorBenefits.specialPrograms')}</RibbonTitle>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {PROGRAMS.map((program) => (
              <ProgramCard key={program.titleKey} {...program} />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7ef] text-[#d56591]">
                <i className="fa-solid fa-heart text-[13px]" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[var(--shadow-text-primary)]">
                  {t('authorBenefits.supportJourney')}
                </div>
                <div className="mt-0.5 text-[9.5px] font-semibold text-[var(--shadow-text-secondary)]">
                  {t('authorBenefits.keepCreating')}
                </div>
              </div>
            </div>

            <i className="fa-solid fa-star shrink-0 text-[15px] text-[#efb63e]" />
          </div>
        </PaperSection>
      </main>
    </div>
  )
}
