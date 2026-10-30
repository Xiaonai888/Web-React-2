import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, BookOpen, Check, ChevronRight, Image as ImageIcon, Info, Megaphone, Plus, RefreshCw, Search, Target } from 'lucide-react'
import { useAuthorPageFooterVisibility } from '../../components/AuthorPageFooterShell'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { createAuthorAdDraft, deleteAuthorAdDraft, getAuthorAdCampaign, listAuthorAdCampaigns, submitAuthorAdForReview, transitionAuthorAdCampaign, updateAuthorAdDraft } from '../../services/authorAdsApi'

registerTranslationNamespace('authorAds', {
  en: {
    title: 'Shadow Ads', subtitle: 'Reach readers who may love your work.', create: 'Create Boost', campaigns: 'My Campaigns', insights: 'Insights', boostPost: 'Boost Post', boostBook: 'Boost Book', postHint: 'Promote a published photo post.', bookHint: 'Promote a published story or store book.', selectContent: 'Choose what to promote', search: 'Search your content...', story: 'Story', product: 'Store product', post: 'Photo post', noContent: 'No eligible published content found.', newPost: 'Create a new post', retry: 'Retry', loadMore: 'Load more posts', loading: 'Loading your content...', chooseGoal: 'Campaign goal', moreViews: 'More post views', moreVisits: 'More profile visits', moreReaders: 'More readers', moreFollowers: 'More followers', moreUnlocks: 'More episode unlocks', moreSales: 'More store sales', audience: 'Target audience', automatic: 'Automatic', manual: 'Manual', automaticHint: 'Shadow will match the content with interested readers when delivery is enabled.', genre: 'Genre / interest', anyGenre: 'Automatic genre', language: 'Reading language', allLanguages: 'All languages', country: 'Country', allCountries: 'All countries', cambodia: 'Cambodia', thailand: 'Thailand', vietnam: 'Vietnam', placement: 'Ad placement', discover: 'Discover', discoverHint: 'Discover placement will be connected after the author campaign system is ready.', budget: 'Planned Boost budget (Diamonds)', budgetHint: '100 Diamonds = $1 ≈ 100 readers reached. Reach is an estimate; no Diamonds are deducted yet.', duration: 'Duration', days: '{{count}} days', preview: 'Ad preview', sponsored: 'Sponsored', readNow: 'Read Now', viewPost: 'View Post', buyNow: 'Buy Now', saveDraft: 'Save draft', saving: 'Saving...', draftSaved: 'Draft saved on this device. It is not live or paid.', draftOnly: 'Campaign creation is in draft mode. Payments and ad delivery are not connected.', selectFirst: 'Select a post or book first.', invalidBudget: 'Enter a whole-Diamond budget from 100 to 1,000,000.', loadFailed: 'Some content could not be loaded. Try again.', loginRequired: 'Please log in to your author account.', authorRequired: 'Your Author Page was not found.', active: 'Active', draft: 'Draft', noCampaigns: 'No campaign drafts yet.', noCampaignsHint: 'Create a Boost to save your first draft.', editDraft: 'Edit draft', deleteDraft: 'Delete draft', confirmDelete: 'Delete this draft?', savedOnDevice: 'Saved on this device only', notLive: 'Not live', insightsSoon: 'Performance appears after campaigns and delivery are connected.', totalReach: 'Reach', postClicks: 'Clicks', totalSpend: 'Spent', results: 'Results', noInsights: 'No live campaign statistics yet.', bookType: 'Book', pdfType: 'PDF', nextStep: 'Review your campaign details before launch.', allTypes: 'All', novel: 'Novel', manga: 'Manga', chatStory: 'Chat Story', noImage: 'No image', contentUnavailable: 'The selected content is no longer available. Choose another item.', budgetCurrency: 'Diamonds', estimatedReach: 'Estimated reach: about {{count}} readers', selected: 'Selected', accountError: 'Unable to load your Author Page.', localSaveFailed: 'Could not save the draft on this device.', goalHint: 'Choose the single result you want most.', manageDrafts: 'Manage drafts', about: 'Paid promotion is separate from the 50% and 80% author revenue events.'
  },
  km: {
    title: 'Shadow Ads', subtitle: 'ផ្សព្វផ្សាយស្នាដៃទៅអ្នកអានដែលទំនងជាចូលចិត្ត។', create: 'បង្កើត Boost', campaigns: 'Campaign របស់ខ្ញុំ', insights: 'ស្ថិតិ', boostPost: 'Boost Post', boostBook: 'Boost Book', postHint: 'ផ្សព្វផ្សាយ Post រូបភាពដែលបានបង្ហោះ។', bookHint: 'ផ្សព្វផ្សាយរឿង ឬសៀវភៅដែលបាន Publish។', selectContent: 'ជ្រើសមាតិកាដែលចង់ Boost', search: 'ស្វែងរកស្នាដៃ...', story: 'រឿង', product: 'ផលិតផលហាង', post: 'Post រូបភាព', noContent: 'មិនទាន់មានមាតិកា Published ដែលអាច Boost បាន។', newPost: 'បង្កើត Post ថ្មី', retry: 'សាកម្តងទៀត', loadMore: 'ផ្ទុក Post បន្ថែម', loading: 'កំពុងផ្ទុកស្នាដៃ...', chooseGoal: 'គោលដៅ Campaign', moreViews: 'អ្នកមើល Post ច្រើន', moreVisits: 'អ្នកចូលទំព័រច្រើន', moreReaders: 'អ្នកអានច្រើន', moreFollowers: 'អ្នក Follow ច្រើន', moreUnlocks: 'អ្នក Unlock ភាគច្រើន', moreSales: 'លក់សៀវភៅច្រើន', audience: 'ក្រុមអ្នកអានគោលដៅ', automatic: 'ស្វ័យប្រវត្តិ', manual: 'កំណត់ដោយខ្លួនឯង', automaticHint: 'Shadow នឹងផ្គូផ្គងស្នាដៃទៅអ្នកអានដែលចាប់អារម្មណ៍ ពេលបើកការផ្សាយ។', genre: 'Genre / ចំណូលចិត្ត', anyGenre: 'Genre ស្វ័យប្រវត្តិ', language: 'ភាសាអាន', allLanguages: 'គ្រប់ភាសា', country: 'ប្រទេស', allCountries: 'គ្រប់ប្រទេស', cambodia: 'កម្ពុជា', thailand: 'ថៃ', vietnam: 'វៀតណាម', placement: 'កន្លែងបង្ហាញ Ads', discover: 'Discover', discoverHint: 'ការបង្ហាញក្នុង Discover នឹងភ្ជាប់ក្រោយរៀបចំប្រព័ន្ធ Campaign រួច។', budget: 'ថវិកា Boost គិតជាពេជ្រ (Diamonds)', budgetHint: '100 ពេជ្រ = $1 ≈ Reach 100 នាក់។ នេះជាការប៉ាន់ស្មាន ហើយមិនទាន់ដកពេជ្រទេ។', duration: 'រយៈពេល', days: '{{count}} ថ្ងៃ', preview: 'មើល Ads ជាមុន', sponsored: 'Sponsored', readNow: 'អានឥឡូវ', viewPost: 'មើល Post', buyNow: 'ទិញឥឡូវ', saveDraft: 'រក្សាទុកព្រាង', saving: 'កំពុងរក្សាទុក...', draftSaved: 'រក្សាទុកព្រាងលើឧបករណ៍នេះហើយ។ មិនទាន់ផ្សាយ ឬបង់ប្រាក់ទេ។', draftOnly: 'បច្ចុប្បន្នជាទម្រង់ Draft។ ការបង់ប្រាក់ និងការបង្ហាញ Ads មិនទាន់ភ្ជាប់។', selectFirst: 'សូមជ្រើស Post ឬសៀវភៅជាមុន។', invalidBudget: 'សូមបញ្ចូលចំនួនពេជ្រពី 100 ដល់ 1,000,000។', loadFailed: 'មិនអាចផ្ទុកមាតិកាខ្លះបាន។ សូមសាកម្តងទៀត។', loginRequired: 'សូម Login គណនីអ្នកនិពន្ធជាមុន។', authorRequired: 'រកមិនឃើញ Author Page របស់អ្នក។', active: 'កំពុងផ្សាយ', draft: 'ព្រាង', noCampaigns: 'មិនទាន់មាន Campaign Draft។', noCampaignsHint: 'បង្កើត Boost ដើម្បីរក្សាទុក Draft ដំបូង។', editDraft: 'កែ Draft', deleteDraft: 'លុប Draft', confirmDelete: 'តើលុប Draft នេះមែនទេ?', savedOnDevice: 'រក្សាទុកលើឧបករណ៍នេះប៉ុណ្ណោះ', notLive: 'មិនទាន់ផ្សាយ', insightsSoon: 'ស្ថិតិនឹងមានក្រោយភ្ជាប់ Campaign និងការបង្ហាញ Ads។', totalReach: 'Reach', postClicks: 'Clicks', totalSpend: 'ចំណាយ', results: 'លទ្ធផល', noInsights: 'មិនទាន់មានស្ថិតិ Campaign ពិត។', bookType: 'សៀវភៅ', pdfType: 'PDF', nextStep: 'ត្រូវពិនិត្យ Campaign មុនចាប់ផ្តើមផ្សាយ។', allTypes: 'ទាំងអស់', novel: 'ប្រលោមលោក', manga: 'Manga', chatStory: 'Chat Story', noImage: 'គ្មានរូបភាព', contentUnavailable: 'មាតិកាដែលជ្រើសមិនមានទៀតទេ។ សូមជ្រើសថ្មី។', budgetCurrency: 'Diamonds', estimatedReach: 'Reach ប៉ាន់ស្មាន៖ ប្រហែល {{count}} នាក់', selected: 'បានជ្រើស', accountError: 'មិនអាចផ្ទុក Author Page របស់អ្នក។', localSaveFailed: 'មិនអាចរក្សាទុក Draft លើឧបករណ៍នេះបាន។', goalHint: 'ជ្រើសគោលដៅសំខាន់បំផុតមួយ។', manageDrafts: 'គ្រប់គ្រង Draft', about: 'Paid Ads ដាច់ពី Event ចែកចំណូល 50% និង 80% របស់អ្នកនិពន្ធ។'
  },
  zh: {
    title: 'Shadow Ads', subtitle: '让可能喜爱你作品的读者发现它。', create: '创建推广', campaigns: '我的广告活动', insights: '数据分析', boostPost: '推广帖子', boostBook: '推广书籍', postHint: '推广已发布的图片帖子。', bookHint: '推广已发布的故事或商店书籍。', selectContent: '选择推广内容', search: '搜索作品...', story: '故事', product: '商店商品', post: '图片帖子', noContent: '暂无可推广的已发布内容。', newPost: '创建新帖子', retry: '重试', loadMore: '加载更多帖子', loading: '正在加载内容...', chooseGoal: '推广目标', moreViews: '更多帖子浏览', moreVisits: '更多主页访问', moreReaders: '更多读者', moreFollowers: '更多关注者', moreUnlocks: '更多章节解锁', moreSales: '更多商品销售', audience: '目标读者', automatic: '自动', manual: '手动', automaticHint: '启用投放后，Shadow 将寻找感兴趣的读者。', genre: '题材/兴趣', anyGenre: '自动选择题材', language: '阅读语言', allLanguages: '所有语言', country: '国家', allCountries: '所有国家', cambodia: '柬埔寨', thailand: '泰国', vietnam: '越南', placement: '广告位置', discover: '发现', discoverHint: '作者广告系统完成后再连接发现页投放。', budget: '推广预算（钻石）', budgetHint: '100 钻石 = 1 美元，预计覆盖约 100 人。覆盖人数仅为估计，目前不会扣除钻石。', duration: '投放时长', days: '{{count}} 天', preview: '广告预览', sponsored: '赞助内容', readNow: '立即阅读', viewPost: '查看帖子', buyNow: '立即购买', saveDraft: '保存草稿', saving: '保存中...', draftSaved: '草稿已保存在本设备；尚未投放或付款。', draftOnly: '目前仅支持草稿；付款和广告投放尚未连接。', selectFirst: '请先选择帖子或书籍。', invalidBudget: '请输入 100 至 1,000,000 的整数钻石预算。', loadFailed: '部分内容加载失败，请重试。', loginRequired: '请先登录作者账号。', authorRequired: '未找到作者主页。', active: '投放中', draft: '草稿', noCampaigns: '暂无广告草稿。', noCampaignsHint: '创建推广并保存草稿。', editDraft: '编辑草稿', deleteDraft: '删除草稿', confirmDelete: '删除此草稿？', savedOnDevice: '仅保存在此设备', notLive: '尚未投放', insightsSoon: '连接真实投放后显示数据。', totalReach: '覆盖人数', postClicks: '点击', totalSpend: '花费', results: '结果', noInsights: '暂无真实推广数据。', bookType: '书籍', pdfType: 'PDF', nextStep: '正式投放前需审核。', allTypes: '全部', novel: '小说', manga: '漫画', chatStory: '聊天故事', noImage: '无图片', contentUnavailable: '所选内容不可用，请重新选择。', budgetCurrency: 'Diamonds', estimatedReach: '预计覆盖约 {{count}} 人', selected: '已选择', accountError: '无法加载作者主页。', localSaveFailed: '无法在本设备保存草稿。', goalHint: '选择最重要的推广目标。', manageDrafts: '管理草稿', about: '付费广告与作者 50% 和 80% 收益活动相互独立。'
  },
  ja: {
    title: 'Shadow Ads', subtitle: 'あなたの作品を好みそうな読者に届けましょう。', create: '広告を作成', campaigns: 'マイキャンペーン', insights: '分析', boostPost: '投稿を宣伝', boostBook: '作品を宣伝', postHint: '公開済みの画像投稿を宣伝します。', bookHint: '公開済みの物語や書籍を宣伝します。', selectContent: '宣伝する内容を選択', search: '作品を検索...', story: '物語', product: 'ストア商品', post: '画像投稿', noContent: '宣伝可能な公開済みコンテンツがありません。', newPost: '新しい投稿を作成', retry: '再試行', loadMore: '投稿をさらに表示', loading: '読み込み中...', chooseGoal: 'キャンペーン目標', moreViews: '投稿の閲覧を増やす', moreVisits: 'プロフィール訪問を増やす', moreReaders: '読者を増やす', moreFollowers: 'フォロワーを増やす', moreUnlocks: 'エピソード解放を増やす', moreSales: '書籍販売を増やす', audience: 'ターゲット読者', automatic: '自動', manual: '手動', automaticHint: '配信開始後、Shadow が興味のある読者を探します。', genre: 'ジャンル/関心', anyGenre: 'ジャンル自動', language: '読書言語', allLanguages: 'すべての言語', country: '国', allCountries: 'すべての国', cambodia: 'カンボジア', thailand: 'タイ', vietnam: 'ベトナム', placement: '広告掲載先', discover: 'Discover', discoverHint: 'キャンペーン機能完成後に Discover への配信を接続します。', budget: '宣伝予算（ダイヤ）', budgetHint: '100 ダイヤ = 1 ドル、推定リーチ約 100 人。数値は目安で、まだダイヤは差し引かれません。', duration: '期間', days: '{{count}} 日', preview: '広告プレビュー', sponsored: '広告', readNow: '今すぐ読む', viewPost: '投稿を見る', buyNow: '購入する', saveDraft: '下書きを保存', saving: '保存中...', draftSaved: '下書きをこの端末に保存しました。配信や支払いはありません。', draftOnly: '現在は下書きのみ。支払いと配信は未接続です。', selectFirst: '投稿または作品を選択してください。', invalidBudget: '100～1,000,000 の整数ダイヤを入力してください。', loadFailed: '一部の内容を読み込めませんでした。', loginRequired: '作家アカウントにログインしてください。', authorRequired: '作家ページが見つかりません。', active: '配信中', draft: '下書き', noCampaigns: '下書きはありません。', noCampaignsHint: '広告を作成して保存してください。', editDraft: '編集', deleteDraft: '削除', confirmDelete: 'この下書きを削除しますか？', savedOnDevice: 'この端末のみ', notLive: '未配信', insightsSoon: '配信連携後にデータが表示されます。', totalReach: 'リーチ', postClicks: 'クリック', totalSpend: '使用額', results: '結果', noInsights: '実際の広告データはまだありません。', bookType: '書籍', pdfType: 'PDF', nextStep: '配信前に審査が必要です。', allTypes: 'すべて', novel: '小説', manga: 'マンガ', chatStory: 'チャットストーリー', noImage: '画像なし', contentUnavailable: '選択したコンテンツは利用できません。', budgetCurrency: 'Diamonds', estimatedReach: '推定リーチ：約 {{count}} 人', selected: '選択済み', accountError: '作家ページを読み込めません。', localSaveFailed: 'この端末に下書きを保存できません。', goalHint: '最も重要な目標を選んでください。', manageDrafts: '下書き管理', about: '有料広告は作家収益の 50%・80% イベントとは別です。'
  },
  ko: {
    title: 'Shadow Ads', subtitle: '작품을 좋아할 만한 독자에게 소개하세요.', create: '부스트 만들기', campaigns: '내 캠페인', insights: '인사이트', boostPost: '게시물 부스트', boostBook: '도서 부스트', postHint: '게시된 이미지 게시물을 홍보합니다.', bookHint: '게시된 스토리 또는 도서를 홍보합니다.', selectContent: '홍보할 콘텐츠 선택', search: '콘텐츠 검색...', story: '스토리', product: '스토어 상품', post: '이미지 게시물', noContent: '홍보 가능한 공개 콘텐츠가 없습니다.', newPost: '새 게시물 작성', retry: '다시 시도', loadMore: '게시물 더 보기', loading: '콘텐츠 불러오는 중...', chooseGoal: '캠페인 목표', moreViews: '게시물 조회 증가', moreVisits: '프로필 방문 증가', moreReaders: '독자 증가', moreFollowers: '팔로워 증가', moreUnlocks: '에피소드 잠금 해제 증가', moreSales: '도서 판매 증가', audience: '타겟 독자', automatic: '자동', manual: '수동', automaticHint: '게재가 활성화되면 Shadow가 관심 있는 독자를 찾습니다.', genre: '장르/관심사', anyGenre: '자동 장르', language: '읽기 언어', allLanguages: '모든 언어', country: '국가', allCountries: '모든 국가', cambodia: '캄보디아', thailand: '태국', vietnam: '베트남', placement: '광고 게재 위치', discover: 'Discover', discoverHint: '캠페인 기능 완성 후 Discover 게재를 연결합니다.', budget: '홍보 예산 (다이아)', budgetHint: '100 다이아 = $1, 예상 도달 약 100명. 추정치이며 아직 다이아를 차감하지 않습니다.', duration: '기간', days: '{{count}}일', preview: '광고 미리보기', sponsored: '광고', readNow: '지금 읽기', viewPost: '게시물 보기', buyNow: '구매하기', saveDraft: '초안 저장', saving: '저장 중...', draftSaved: '초안을 이 기기에 저장했습니다. 게재나 결제는 없습니다.', draftOnly: '현재 초안만 지원됩니다. 결제와 게재는 연결되지 않았습니다.', selectFirst: '게시물이나 도서를 먼저 선택하세요.', invalidBudget: '100~1,000,000 사이의 정수 다이아 예산을 입력하세요.', loadFailed: '일부 콘텐츠를 불러오지 못했습니다.', loginRequired: '작가 계정에 로그인하세요.', authorRequired: '작가 페이지를 찾을 수 없습니다.', active: '게재 중', draft: '초안', noCampaigns: '캠페인 초안이 없습니다.', noCampaignsHint: '부스트를 만들어 초안을 저장하세요.', editDraft: '초안 수정', deleteDraft: '초안 삭제', confirmDelete: '이 초안을 삭제할까요?', savedOnDevice: '이 기기에만 저장됨', notLive: '미게재', insightsSoon: '게재 연동 후 성과가 표시됩니다.', totalReach: '도달', postClicks: '클릭', totalSpend: '지출', results: '결과', noInsights: '실제 캠페인 통계가 없습니다.', bookType: '도서', pdfType: 'PDF', nextStep: '게재 전 검토가 필요합니다.', allTypes: '전체', novel: '소설', manga: '만화', chatStory: '채팅 스토리', noImage: '이미지 없음', contentUnavailable: '선택한 콘텐츠를 사용할 수 없습니다.', budgetCurrency: 'Diamonds', estimatedReach: '예상 도달: 약 {{count}}명', selected: '선택됨', accountError: '작가 페이지를 불러올 수 없습니다.', localSaveFailed: '이 기기에 초안을 저장하지 못했습니다.', goalHint: '가장 중요한 목표 하나를 선택하세요.', manageDrafts: '초안 관리', about: '유료 광고는 작가 50% 및 80% 수익 이벤트와 별개입니다.'
  }
})

registerTranslationNamespace('authorAds', {
  en: {
    cloudSaved: 'Draft saved to your Shadow account. It is not live or paid.',
    cloudCampaigns: 'Saved to Shadow', localCampaigns: 'Saved on this device', loadMoreBooks: 'Load more books',
    loadingCampaigns: 'Loading campaigns...', loadMoreCampaigns: 'Load more campaigns',
    campaignLoadFailed: 'Unable to load campaigns. Please retry.',
    submitForReview: 'Submit for review', submittedForReview: 'Campaign submitted for review. It is not live or paid.',
    confirmSubmit: 'Submit this campaign for admin review?',
    pendingReview: 'Pending review', approved: 'Approved', scheduled: 'Scheduled',
    paused: 'Paused', completed: 'Completed', rejected: 'Rejected', cancelled: 'Cancelled',
    serverOffline: 'Campaign server is not ready. Your existing device drafts are still available.',
    saveFailed: 'Unable to save this campaign. Please retry.', back: 'Back',
  },
  km: {
    cloudSaved: 'បានរក្សាទុក Draft លើគណនី Shadow។ មិនទាន់ផ្សាយ ឬបង់ប្រាក់ទេ។',
    cloudCampaigns: 'រក្សាទុកលើ Shadow', localCampaigns: 'រក្សាទុកលើឧបករណ៍នេះ', loadMoreBooks: 'ផ្ទុកសៀវភៅបន្ថែម',
    loadingCampaigns: 'កំពុងផ្ទុក Campaign...', loadMoreCampaigns: 'ផ្ទុក Campaign បន្ថែម',
    campaignLoadFailed: 'មិនអាចផ្ទុក Campaign បាន។ សូមសាកម្តងទៀត។',
    submitForReview: 'ផ្ញើឱ្យ Admin ពិនិត្យ', submittedForReview: 'បានផ្ញើ Campaign ឱ្យពិនិត្យ។ មិនទាន់ផ្សាយ ឬបង់ប្រាក់ទេ។',
    confirmSubmit: 'ផ្ញើ Campaign នេះទៅ Admin ដើម្បីពិនិត្យមែនទេ?',
    pendingReview: 'កំពុងរង់ចាំពិនិត្យ', approved: 'បានអនុម័ត', scheduled: 'បានកំណត់ពេល',
    paused: 'បានផ្អាក', completed: 'បានបញ្ចប់', rejected: 'មិនបានអនុម័ត', cancelled: 'បានបោះបង់',
    serverOffline: 'Server Campaign មិនទាន់រួចរាល់។ Draft ចាស់លើឧបករណ៍នៅតែមាន។',
    saveFailed: 'មិនអាចរក្សាទុក Campaign បាន។ សូមសាកម្តងទៀត។', back: 'ត្រឡប់',
  },
  zh: {
    cloudSaved: '草稿已保存到 Shadow 账户，尚未投放或付款。',
    cloudCampaigns: '保存在 Shadow', localCampaigns: '保存在此设备', loadMoreBooks: '加载更多书籍',
    loadingCampaigns: '正在加载活动...', loadMoreCampaigns: '加载更多活动',
    campaignLoadFailed: '无法加载活动，请重试。',
    submitForReview: '提交审核', submittedForReview: '已提交审核，尚未投放或付款。',
    confirmSubmit: '将此活动提交管理员审核？',
    pendingReview: '等待审核', approved: '已批准', scheduled: '已排期',
    paused: '已暂停', completed: '已完成', rejected: '已拒绝', cancelled: '已取消',
    serverOffline: '活动服务器尚未就绪，本设备草稿仍然保留。',
    saveFailed: '无法保存活动，请重试。', back: '返回',
  },
  ja: {
    cloudSaved: 'Shadow アカウントに下書きを保存しました。配信・決済はまだです。',
    cloudCampaigns: 'Shadow に保存', localCampaigns: 'この端末に保存', loadMoreBooks: '作品をさらに表示',
    loadingCampaigns: 'キャンペーンを読み込み中...', loadMoreCampaigns: 'さらに読み込む',
    campaignLoadFailed: 'キャンペーンを読み込めません。再試行してください。',
    submitForReview: '審査に提出', submittedForReview: '審査に提出しました。配信・決済はまだです。',
    confirmSubmit: 'このキャンペーンを管理者の審査に提出しますか？',
    pendingReview: '審査待ち', approved: '承認済み', scheduled: '予約済み',
    paused: '一時停止', completed: '完了', rejected: '却下', cancelled: 'キャンセル済み',
    serverOffline: 'キャンペーンサーバーは準備中です。端末の下書きは保持されます。',
    saveFailed: '保存できません。再試行してください。', back: '戻る',
  },
  ko: {
    cloudSaved: 'Shadow 계정에 초안을 저장했습니다. 아직 게재되거나 결제되지 않았습니다.',
    cloudCampaigns: 'Shadow에 저장', localCampaigns: '이 기기에 저장', loadMoreBooks: '도서 더 보기',
    loadingCampaigns: '캠페인 불러오는 중...', loadMoreCampaigns: '캠페인 더 보기',
    campaignLoadFailed: '캠페인을 불러올 수 없습니다. 다시 시도하세요.',
    submitForReview: '검토 요청', submittedForReview: '검토를 요청했습니다. 아직 게재되거나 결제되지 않았습니다.',
    confirmSubmit: '이 캠페인을 관리자 검토로 제출할까요?',
    pendingReview: '검토 대기', approved: '승인됨', scheduled: '예약됨',
    paused: '일시정지', completed: '완료됨', rejected: '거절됨', cancelled: '취소됨',
    serverOffline: '캠페인 서버가 아직 준비되지 않았습니다. 기기 초안은 유지됩니다.',
    saveFailed: '캠페인을 저장할 수 없습니다. 다시 시도하세요.', back: '뒤로',
  },
})

registerTranslationNamespace('authorAds', {
  en: {
    boostBudget: 'Budget', boostFunded: 'Funded', boostSpent: 'Actual spent',
    boostAvailable: 'Available funds', boostRefunded: 'Refunded',
    budgetProgress: 'Budget used', boostGoal: 'Goal', boostAudience: 'Audience',
  },
  km: {
    boostBudget: 'ថវិកាសរុប', boostFunded: 'បានបង់', boostSpent: 'ចំណាយពិត',
    boostAvailable: 'ថវិកានៅសល់', boostRefunded: 'បានសងវិញ',
    budgetProgress: 'បានប្រើថវិកា', boostGoal: 'គោលដៅ', boostAudience: 'អ្នកអានគោលដៅ',
  },
  zh: {
    boostBudget: '预算', boostFunded: '已充值', boostSpent: '实际花费',
    boostAvailable: '可用资金', boostRefunded: '已退款',
    budgetProgress: '预算使用率', boostGoal: '目标', boostAudience: '受众',
  },
  ja: {
    boostBudget: '予算', boostFunded: '入金済み', boostSpent: '実際の支出',
    boostAvailable: '利用可能額', boostRefunded: '返金済み',
    budgetProgress: '予算使用率', boostGoal: '目標', boostAudience: '対象ユーザー',
  },
  ko: {
    boostBudget: '예산', boostFunded: '충전됨', boostSpent: '실제 지출',
    boostAvailable: '사용 가능 금액', boostRefunded: '환불됨',
    budgetProgress: '예산 사용률', boostGoal: '목표', boostAudience: '대상 독자',
  },
})

registerTranslationNamespace('authorAds', {
  en: {
    startCampaign: "Start campaign",
    pauseCampaign: "Pause campaign",
    resumeCampaign: "Resume campaign",
    confirmStart: "Start this campaign now? Its delivery countdown begins immediately.",
    confirmPause: "Pause this campaign? Its end date will not change.",
    paymentRequired: "Verified payment must cover the full budget before this campaign can start.",
    deliveryNotReady: "Ad delivery is not available yet. The campaign was not started.",
    lifecycleBlocked: "Status change was refused. Check approval, funding, content and dates.",
    lifecycleError: "Unable to change campaign status. Please retry.",
    lifecycleRateLimited: "Too many requests. Please try again shortly.",
    lifecycleStarted: "Campaign started.",
    lifecyclePaused: "Campaign paused. Its end date is unchanged.",
    lifecycleResumed: "Campaign resumed.",
    pauseClockWarning: "Pausing stops delivery but does not extend the campaign end date.",
    deliveryExpired: "The campaign delivery period has ended.",
  },
  km: {
    startCampaign: "ចាប់ផ្តើមផ្សាយ",
    pauseCampaign: "ផ្អាកផ្សាយ",
    resumeCampaign: "បន្តផ្សាយ",
    confirmStart: "ចាប់ផ្តើម Campaign នេះឥឡូវមែនទេ? ពេលវេលាផ្សាយនឹងចាប់រាប់ភ្លាមៗ។",
    confirmPause: "ផ្អាក Campaign នេះមែនទេ? ថ្ងៃបញ្ចប់នឹងមិនផ្លាស់ប្តូរទេ។",
    paymentRequired: "ត្រូវបង់ប្រាក់ដែលបានផ្ទៀងផ្ទាត់ឱ្យគ្រប់ថវិកា មុនចាប់ផ្តើមផ្សាយ។",
    deliveryNotReady: "ប្រព័ន្ធផ្សាយ Ads មិនទាន់បើកទេ។ Campaign មិនទាន់ចាប់ផ្តើមឡើយ។",
    lifecycleBlocked: "មិនអាចប្ដូរស្ថានភាពបាន។ សូមពិនិត្យការអនុម័ត ថវិកា មាតិកា និងកាលបរិច្ឆេទ។",
    lifecycleError: "មិនអាចប្ដូរស្ថានភាព Campaign បាន។ សូមសាកម្ដងទៀត។",
    lifecycleRateLimited: "ស្នើសុំច្រើនពេក។ សូមរង់ចាំបន្តិច។",
    lifecycleStarted: "បានចាប់ផ្តើម Campaign។",
    lifecyclePaused: "បានផ្អាក Campaign។ ថ្ងៃបញ្ចប់នៅដដែល។",
    lifecycleResumed: "បានបន្ត Campaign។",
    pauseClockWarning: "ការផ្អាកឈប់បង្ហាញ Ads ប៉ុន្តែមិនពន្យារថ្ងៃបញ្ចប់ Campaign ទេ។",
    deliveryExpired: "រយៈពេលផ្សាយ Campaign នេះបានផុតកំណត់។",
  },
  zh: {
    startCampaign: "开始投放",
    pauseCampaign: "暂停投放",
    resumeCampaign: "恢复投放",
    confirmStart: "立即开始此活动吗？投放倒计时将立即开始。",
    confirmPause: "暂停此活动吗？结束日期不会改变。",
    paymentRequired: "必须完成覆盖全部预算的已验证付款，才能开始投放。",
    deliveryNotReady: "广告投放尚未启用，活动尚未开始。",
    lifecycleBlocked: "无法更改状态，请检查审核、资金、内容和日期。",
    lifecycleError: "无法更新活动状态，请重试。",
    lifecycleRateLimited: "请求过多，请稍后再试。",
    lifecycleStarted: "活动已开始。",
    lifecyclePaused: "活动已暂停，结束日期不变。",
    lifecycleResumed: "活动已恢复。",
    pauseClockWarning: "暂停会停止投放，但不会延长活动结束日期。",
    deliveryExpired: "活动投放时间已结束。",
  },
  ja: {
    startCampaign: "配信開始",
    pauseCampaign: "一時停止",
    resumeCampaign: "配信再開",
    confirmStart: "今すぐ開始しますか？配信期間のカウントがすぐに始まります。",
    confirmPause: "一時停止しますか？終了日は変わりません。",
    paymentRequired: "配信開始には予算全額の確認済み入金が必要です。",
    deliveryNotReady: "広告配信はまだ利用できません。キャンペーンは開始されていません。",
    lifecycleBlocked: "状態を変更できません。承認・入金・コンテンツ・日付を確認してください。",
    lifecycleError: "状態を更新できません。再試行してください。",
    lifecycleRateLimited: "リクエストが多すぎます。しばらくしてからお試しください。",
    lifecycleStarted: "配信を開始しました。",
    lifecyclePaused: "一時停止しました。終了日は変わりません。",
    lifecycleResumed: "配信を再開しました。",
    pauseClockWarning: "一時停止してもキャンペーン終了日は延長されません。",
    deliveryExpired: "キャンペーンの配信期間が終了しました。",
  },
  ko: {
    startCampaign: "게재 시작",
    pauseCampaign: "게재 일시정지",
    resumeCampaign: "게재 재개",
    confirmStart: "지금 시작할까요? 게재 기간이 즉시 시작됩니다.",
    confirmPause: "일시정지할까요? 종료일은 변경되지 않습니다.",
    paymentRequired: "게재를 시작하려면 전체 예산에 대한 확인된 결제가 필요합니다.",
    deliveryNotReady: "광고 게재가 아직 활성화되지 않았습니다. 캠페인은 시작되지 않았습니다.",
    lifecycleBlocked: "상태를 변경할 수 없습니다. 승인, 결제, 콘텐츠 및 날짜를 확인하세요.",
    lifecycleError: "캠페인 상태를 변경하지 못했습니다. 다시 시도하세요.",
    lifecycleRateLimited: "요청이 너무 많습니다. 잠시 후 다시 시도하세요.",
    lifecycleStarted: "캠페인이 시작되었습니다.",
    lifecyclePaused: "캠페인이 일시정지되었습니다. 종료일은 변경되지 않습니다.",
    lifecycleResumed: "캠페인이 재개되었습니다.",
    pauseClockWarning: "일시정지는 게재만 중단하며 캠페인 종료일은 연장되지 않습니다.",
    deliveryExpired: "캠페인 게재 기간이 종료되었습니다.",
  },
})

registerTranslationNamespace('authorAds', {
  en: {
    diamondReserveHint: 'No Diamonds are deducted while drafting. Starting an approved campaign reserves the full budget from your Reader wallet.',
    confirmDiamondStart: 'Reserve {{count}} Diamonds from your Reader wallet and start this campaign now?',
    diamondStartDenied: 'Could not start. Check your Reader Diamonds balance, campaign approval, and content.',
    fundingUnverified: 'Funding information is unavailable. Reload the campaign before starting.',
    boostBudgetHint: '100 Diamonds = $1. Estimated reach is not guaranteed. Diamonds are reserved only when Start succeeds.',
    boostDraftHint: 'Drafts are not live. After approval, Start will reserve Diamonds from your Reader wallet when delivery is enabled.'
  },
  km: {
    diamondReserveHint: 'រក្សាទុក Draft មិនដកពេជ្រទេ។ ពេលចុច Start លើ Campaign ដែលអនុម័ត ប្រព័ន្ធនឹងកក់ពេជ្រពេញថវិកាពីគណនីអ្នកអាន។',
    confirmDiamondStart: 'យល់ព្រមកក់ {{count}} ពេជ្រ ពីគណនីអ្នកអាន ហើយចាប់ផ្ដើម Campaign ឥឡូវ?',
    diamondStartDenied: 'មិនអាចចាប់ផ្ដើមបាន។ សូមពិនិត្យពេជ្រក្នុងគណនីអ្នកអាន ការអនុម័ត និងមាតិកា។',
    fundingUnverified: 'មិនអាចផ្ទៀងផ្ទាត់ថវិកាបាន។ សូមទាញ Campaign សាថ្មីមុនចាប់ផ្ដើម។',
    boostBudgetHint: '100 ពេជ្រ = $1។ Reach ជាការប៉ាន់ស្មាន មិនធានាលទ្ធផលទេ។ ពេជ្រត្រូវបានកក់តែពេល Start ជោគជ័យ។',
    boostDraftHint: 'Draft មិនទាន់ផ្សាយទេ។ ក្រោយអនុម័ត ពេលបើកការផ្សាយ ចុច Start ទើបកក់ពេជ្រពីគណនីអ្នកអាន។'
  },
  zh: {
    diamondReserveHint: '保存草稿不会扣钻石。获批后点击开始，将从读者钱包预留全部预算。',
    confirmDiamondStart: '从读者钱包预留 {{count}} 钻石并立即开始投放？',
    diamondStartDenied: '无法开始。请检查读者钱包的钻石余额、审核状态及推广内容。',
    fundingUnverified: '无法核实资金状态，请刷新活动后再开始。',
    boostBudgetHint: '100 钻石 = 1 美元，预计覆盖人数不保证。仅在成功开始时预留钻石。',
    boostDraftHint: '草稿不会投放。审核通过后，启用投放并点击开始才会预留钻石。'
  },
  ja: {
    diamondReserveHint: '下書き保存ではダイヤを消費しません。承認後に開始すると、読者ウォレットから予算全額を確保します。',
    confirmDiamondStart: '読者ウォレットから {{count}} ダイヤを確保して配信を開始しますか？',
    diamondStartDenied: '開始できませんでした。ダイヤ残高、承認状況、コンテンツを確認してください。',
    fundingUnverified: '資金状態を確認できません。キャンペーンを再読み込みしてください。',
    boostBudgetHint: '100 ダイヤ = 1 USD。推定リーチは保証されません。開始成功時にのみダイヤを確保します。',
    boostDraftHint: '下書きは配信されません。承認後、配信有効時に開始するとダイヤを確保します。'
  },
  ko: {
    diamondReserveHint: '초안을 저장해도 다이아는 차감되지 않습니다. 승인 후 시작하면 독자 지갑에서 전체 예산을 예약합니다.',
    confirmDiamondStart: '독자 지갑에서 다이아 {{count}}개를 예약하고 캠페인을 시작할까요?',
    diamondStartDenied: '시작할 수 없습니다. 다이아 잔액, 승인 상태, 콘텐츠를 확인하세요.',
    fundingUnverified: '자금 상태를 확인할 수 없습니다. 캠페인을 새로고침하세요.',
    boostBudgetHint: '다이아 100개 = $1. 예상 도달은 보장되지 않습니다. 시작 성공 시에만 다이아를 예약합니다.',
    boostDraftHint: '초안은 게시되지 않습니다. 승인 후 게재를 활성화하고 시작해야 다이아를 예약합니다.'
  }
})

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://shadow-backend-kucw.onrender.com'

const LANGUAGES = ['km', 'en', 'zh', 'ko', 'ja']
const GENRES = ['Romance', 'Fantasy', 'Action', 'Adventure', 'Horror', 'Mystery', 'Drama', 'Comedy', 'Historical', 'Sci-Fi', 'LGBTQ+']
const DURATION_OPTIONS = [1, 3, 7, 14]
const CAMPAIGNS_PER_PAGE = 10
const INPUT_CLASS = 'w-full rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-3 py-3 text-sm text-[var(--shadow-text-primary)] outline-none focus:border-[#9b83e9]'
const STATUS_LABELS = {
  draft: 'draft', pending_review: 'pendingReview', approved: 'approved',
  scheduled: 'scheduled', active: 'active', paused: 'paused',
  completed: 'completed', rejected: 'rejected', cancelled: 'cancelled',
}
const GOAL_LABELS = {
  views: 'moreViews', visits: 'moreVisits', readers: 'moreReaders',
  followers: 'moreFollowers', unlocks: 'moreUnlocks', sales: 'moreSales',
}

function safeImageSrc(value) {
  const url = String(value || '').trim()
  if (!url) return ''
  if (/^https:\/\//i.test(url) || /^\/(?!\/)/.test(url)) return url
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
      /^http:\/\/localhost(?::\d+)?\//i.test(url)) return url
  return ''
}

function getToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function requestJson(url, token, signal) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
    cache: 'no-store'
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.ok === false) throw new Error(body.message || 'Request failed')
  return body
}

function normalizeStory(item) {
  return {
    key: `story:${item.id}`,
    id: String(item.id),
    sourceType: 'story',
    type: item.story_type === 'manga' || item.story_type === 'chat_story' ? item.story_type : 'story',
    title: String(item.title || ''),
    image: item.cover_url || '',
    genre: String(item.main_genre || item.genre || ''),
    status: item.status
  }
}

function normalizeProduct(item) {
  return {
    key: `product:${item.id}`,
    id: String(item.id),
    sourceType: 'product',
    type: item.product_type === 'pdf' ? 'pdf' : 'book',
    title: String(item.title || ''),
    image: item.cover_url || '',
    genre: String(item.category || ''),
    status: item.status
  }
}

function normalizePost(item) {
  const content = String(item.content || '').trim()
  return {
    key: `post:${item.id}`,
    id: String(item.id),
    sourceType: 'post',
    type: 'post',
    title: content.split(/\r?\n/).find(Boolean) || 'Photo post',
    image: Array.isArray(item.image_urls) ? item.image_urls[0] || '' : '',
    genre: '',
    status: item.status
  }
}

function readDrafts(username) {
  if (!username) return []
  try {
    const data = JSON.parse(localStorage.getItem(`shadow_author_ads_drafts_v1_${username}`) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function writeDrafts(username, drafts) {
  localStorage.setItem(`shadow_author_ads_drafts_v1_${username}`, JSON.stringify(drafts))
}

function Section({ title, children, aside }) {
  return (
    <section className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-[var(--shadow-text-primary)]">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

function ContentCard({ item, selected, onClick, t }) {
  const type = item.sourceType === 'post' ? t('authorAds.post') : item.sourceType === 'product'
    ? (item.type === 'pdf' ? t('authorAds.pdfType') : t('authorAds.bookType'))
    : (item.type === 'manga' ? t('authorAds.manga') : item.type === 'chat_story' ? t('authorAds.chatStory') : item.type === 'story' ? t('authorAds.story') : t('authorAds.novel'))
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${selected ? 'border-[#8061df] bg-[#f5f0ff] dark:bg-[#30224b]' : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]'}`}>
      <div className="flex h-[70px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)]">
        {safeImageSrc(item.image) ? <img src={safeImageSrc(item.image)} alt="" className="h-full w-full object-cover" loading="lazy" /> : <BookOpen size={23} className="text-[var(--shadow-text-tertiary)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium text-[var(--shadow-text-primary)]">{item.title}</p>
        <p className="mt-1 truncate text-xs text-[var(--shadow-text-secondary)]">{type}</p>
      </div>
      <span className={`mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#8061df] bg-[#8061df] text-white' : 'border-[var(--shadow-border)]'}`}>{selected ? <Check size={15} /> : null}</span>
    </button>
  )
}

export default function AuthorAdsPage() {
  useAuthorPageFooterVisibility(true)
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [section, setSection] = useState(
  () => new URLSearchParams(window.location.search).get('tab') === 'campaigns' ? 'campaigns' : 'create'
)
  const [kind, setKind] = useState('post')
  const [username, setUsername] = useState('')
  const [posts, setPosts] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [selectedKey, setSelectedKey] = useState('')
  const [goal, setGoal] = useState('views')
  const [audienceMode, setAudienceMode] = useState('automatic')
  const [targetGenre, setTargetGenre] = useState('')
  const [language, setLanguage] = useState('')
  const [country, setCountry] = useState('')
  const [budget, setBudget] = useState('100')
  const [duration, setDuration] = useState(3)
  const [drafts, setDrafts] = useState([])
  const [editingId, setEditingId] = useState('')
  const [campaigns, setCampaigns] = useState([])
  const [campaignsLoaded, setCampaignsLoaded] = useState(false)
  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [campaignsLoadingMore, setCampaignsLoadingMore] = useState(false)
  const [campaignsHasMore, setCampaignsHasMore] = useState(false)
  const [campaignsPage, setCampaignsPage] = useState(0)
  const [campaignsError, setCampaignsError] = useState('')
  const [backendAvailable, setBackendAvailable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [processingId, setProcessingId] = useState('')
  const [postCursor, setPostCursor] = useState('')
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [storyCursor, setStoryCursor] = useState('')
  const [hasMoreStories, setHasMoreStories] = useState(false)
  const [productPage, setProductPage] = useState(1)
  const [hasMoreProducts, setHasMoreProducts] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)

  const loadContent = useCallback(async (signal) => {
    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(true)
    setError('')
    try {
      const account = await requestJson('/api/authors/me?include_works=0', token, signal)
      const pageUsername = String(account.author_page?.page_username || '').trim()
      if (!pageUsername) throw new Error(t('authorAds.authorRequired'))
      const result = await Promise.allSettled([
        requestJson(`/api/authors/page/${encodeURIComponent(pageUsername)}/works?limit=10`, token, signal),
        requestJson(`/api/authors/page/${encodeURIComponent(pageUsername)}/posts?limit=20&content_library=1&status=active`, token, signal),
        requestJson(`/api/author-store/page/${encodeURIComponent(pageUsername)}/products?page=1&limit=10`, token, signal)
      ])
      if (signal?.aborted) return
      const [storyResult, postResult, productResult] = result
      const storyData = storyResult.status === 'fulfilled' ? storyResult.value : {}
      const postData = postResult.status === 'fulfilled' ? postResult.value : {}
      const productData = productResult.status === 'fulfilled' ? productResult.value : {}
      const stories = storyData.works || []
      const products = productData.products || []
      setBooks([
        ...stories.filter(item => item.status === 'published').map(normalizeStory),
        ...products.filter(item => item.status === 'active').map(normalizeProduct)
      ])
      setPosts((postData.posts || []).filter(item => Array.isArray(item.image_urls) && item.image_urls.length).map(normalizePost))
      setHasMorePosts(Boolean(postData.has_more))
      setPostCursor(postData.next_before || '')
      setHasMoreStories(Boolean(storyData.has_more))
      setStoryCursor(storyData.next_before_id || '')
      setHasMoreProducts(Boolean(productData.pagination?.has_next))
      setProductPage(1)
      setUsername(pageUsername)
      setDrafts(readDrafts(pageUsername))
      setCampaignsLoaded(false)
      if (result.some(item => item.status === 'rejected')) setError(t('authorAds.loadFailed'))
    } catch (cause) {
      if (signal?.aborted) return
      setError(cause.message || t('authorAds.accountError'))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [navigate, t])

  useEffect(() => {
    const controller = new AbortController()
    loadContent(controller.signal)
    return () => controller.abort()
  }, [loadContent])

  useEffect(() => {
    if (section !== 'campaigns' || !username || campaignsLoaded) return
    let active = true
    const controller = new AbortController()
    setCampaignsLoading(true)
    setCampaignsError('')
    listAuthorAdCampaigns({ page: 1, limit: CAMPAIGNS_PER_PAGE, signal: controller.signal, refresh: true })
      .then(result => {
        if (!active) return
        setCampaigns(result.campaigns)
        setCampaignsPage(1)
        setCampaignsHasMore(result.has_more)
        setBackendAvailable(true)
        setCampaignsLoaded(true)
      })
      .catch(cause => {
        if (!active || controller.signal.aborted) return
        setCampaigns([])
        setCampaignsPage(0)
        setCampaignsHasMore(false)
        setBackendAvailable(false)
        setCampaignsLoaded(true)
        if (cause?.code !== 'AUTHOR_ADS_NOT_CONFIGURED') {
          setCampaignsError(t('authorAds.campaignLoadFailed'))
        }
      })
      .finally(() => {
        if (active) setCampaignsLoading(false)
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [campaignsLoaded, section, t, username])

  const loadMoreCampaigns = async () => {
    if (!backendAvailable || !campaignsHasMore || campaignsLoadingMore || campaignsLoading) return
    setCampaignsLoadingMore(true)
    setCampaignsError('')
    try {
      const result = await listAuthorAdCampaigns({ page: campaignsPage + 1, limit: CAMPAIGNS_PER_PAGE })
      setCampaigns(current => {
        const next = new Map(current.map(item => [item.id, item]))
        result.campaigns.forEach(item => next.set(item.id, item))
        return [...next.values()]
      })
      setCampaignsPage(result.page)
      setCampaignsHasMore(result.has_more)
    } catch {
      setCampaignsError(t('authorAds.campaignLoadFailed'))
    } finally {
      setCampaignsLoadingMore(false)
    }
  }

  const loadMorePosts = async () => {
    if (!username || !postCursor || !hasMorePosts || moreLoading) return
    setMoreLoading(true)
    try {
      const token = getToken()
      const data = await requestJson(`/api/authors/page/${encodeURIComponent(username)}/posts?limit=20&content_library=1&status=active&before=${encodeURIComponent(postCursor)}`, token)
      setPosts(current => {
        const all = new Map(current.map(item => [item.key, item]))
        ;(data.posts || []).filter(item => Array.isArray(item.image_urls) && item.image_urls.length).map(normalizePost).forEach(item => all.set(item.key, item))
        return [...all.values()]
      })
      setHasMorePosts(Boolean(data.has_more))
      setPostCursor(data.next_before || '')
    } catch {
      setMessage(t('authorAds.loadFailed'))
    } finally {
      setMoreLoading(false)
    }
  }

  const loadMoreBooks = async () => {
    if (!username || moreLoading || (!hasMoreStories && !hasMoreProducts)) return
    setMoreLoading(true)
    const token = getToken()
    const pageUsername = encodeURIComponent(username)
    const requests = []
    if (hasMoreStories && storyCursor) {
      requests.push({
        type: 'story',
        promise: requestJson(`/api/authors/page/${pageUsername}/works?limit=10&before_id=${encodeURIComponent(storyCursor)}`, token),
      })
    }
    if (hasMoreProducts) {
      requests.push({
        type: 'product',
        promise: requestJson(`/api/author-store/page/${pageUsername}/products?page=${productPage + 1}&limit=10`, token),
      })
    }
    if (!requests.length) {
      setMoreLoading(false)
      return
    }
    try {
      const results = await Promise.allSettled(requests.map(item => item.promise))
      const items = []
      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') {
          setMessage(t('authorAds.loadFailed'))
          return
        }
        const data = result.value
        if (requests[index].type === 'story') {
          items.push(...(data.works || []).filter(item => item.status === 'published').map(normalizeStory))
          setHasMoreStories(Boolean(data.has_more))
          setStoryCursor(data.next_before_id || '')
        } else {
          items.push(...(data.products || []).filter(item => item.status === 'active').map(normalizeProduct))
          setHasMoreProducts(Boolean(data.pagination?.has_next))
          setProductPage(data.pagination?.page || productPage + 1)
        }
      })
      if (items.length) {
        setBooks(current => {
          const next = new Map(current.map(item => [item.key, item]))
          items.forEach(item => next.set(item.key, item))
          return [...next.values()]
        })
      }
    } finally {
      setMoreLoading(false)
    }
  }

  const contents = kind === 'post' ? posts : books
  const editingCampaign = campaigns.find(item => item.id === editingId) || drafts.find(item => item.id === editingId)
  const savedSelection = useMemo(() => {
    if (!editingCampaign || editingCampaign.contentKey !== selectedKey || !selectedKey) return null
    return {
      key: selectedKey,
      id: editingCampaign.contentId,
      sourceType: editingCampaign.contentType,
      type: editingCampaign.contentType === 'product' ? 'book' : editingCampaign.contentType === 'story' ? 'story' : 'post',
      title: editingCampaign.contentTitle || '',
      image: editingCampaign.contentImage || '',
    }
  }, [editingCampaign, selectedKey])
  const selectedItem = contents.find(item => item.key === selectedKey) || savedSelection || null
  const visibleItems = useMemo(() => {
    const items = savedSelection && !contents.some(item => item.key === savedSelection.key)
      ? [savedSelection, ...contents]
      : contents
    return items.filter(item => item.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
  }, [contents, savedSelection, search])
  const goals = kind === 'post' ? [
    ['views', 'moreViews'], ['visits', 'moreVisits'], ['followers', 'moreFollowers']
  ] : selectedItem?.sourceType === 'product' ? [
    ['sales', 'moreSales'], ['followers', 'moreFollowers']
  ] : [
    ['readers', 'moreReaders'], ['followers', 'moreFollowers'], ['unlocks', 'moreUnlocks']
  ]
  const effectiveGoal = goals.some(item => item[0] === goal) ? goal : goals[0][0]

  const resetSelection = nextKind => {
    setKind(nextKind)
    setSelectedKey('')
    setSearch('')
    setGoal(nextKind === 'post' ? 'views' : 'readers')
    setMessage('')
    setEditingId('')
  }

  const saveLocalDraft = draft => {
    const nextDrafts = [draft, ...drafts.filter(item => item.id !== draft.id)]
    try {
      writeDrafts(username, nextDrafts)
      setDrafts(nextDrafts)
      setEditingId(draft.id)
      setMessage(t('authorAds.draftSaved'))
    } catch {
      setMessage(t('authorAds.localSaveFailed'))
    }
  }

  const saveDraft = async () => {
    if (saving) return
    if (!username) return setMessage(t('authorAds.authorRequired'))
    if (!selectedItem) return setMessage(t('authorAds.selectFirst'))
    const numericBudget = Number(budget)
    if (!Number.isSafeInteger(numericBudget) || numericBudget < 100 || numericBudget > 1000000) {
      return setMessage(t('authorAds.invalidBudget'))
    }
    const now = new Date().toISOString()
    const localEditing = drafts.some(item => item.id === editingId)
    const draft = {
      id: localEditing ? editingId : (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`),
      status: 'draft',
      kind,
      contentKey: selectedItem.key,
      contentId: selectedItem.id,
      contentType: selectedItem.sourceType,
      contentTitle: selectedItem.title,
      contentImage: selectedItem.image,
      goal: effectiveGoal,
      audience: { mode: audienceMode, genre: audienceMode === 'manual' ? targetGenre : '', language: audienceMode === 'manual' ? language : '', country: audienceMode === 'manual' ? country : '' },
      placements: ['discover'],
      budgetUsd: numericBudget / 100,
      durationDays: duration,
      updatedAt: now,
      createdAt: drafts.find(item => item.id === editingId)?.createdAt || now,
    }
    if (localEditing) return saveLocalDraft(draft)
    setSaving(true)
    setMessage('')
    try {
      const result = editingId
        ? await updateAuthorAdDraft(editingId, draft)
        : await createAuthorAdDraft(draft)
      setEditingId(result.id)
      setBackendAvailable(true)
      setCampaignsLoaded(false)
      setMessage(t('authorAds.cloudSaved'))
    } catch (cause) {
      if (!editingId && cause?.code === 'AUTHOR_ADS_NOT_CONFIGURED') {
        saveLocalDraft(draft)
        setBackendAvailable(false)
      } else {
        setMessage(cause?.code === 'CONTENT_UNAVAILABLE' ? t('authorAds.contentUnavailable') : t('authorAds.saveFailed'))
      }
    } finally {
      setSaving(false)
    }
  }

  const editDraft = useCallback(draft => {
    setKind(draft.kind)
    setSelectedKey(draft.contentKey)
    setGoal(draft.goal)
    setAudienceMode(draft.audience?.mode || 'automatic')
    setTargetGenre(draft.audience?.genre || '')
    setLanguage(draft.audience?.language || '')
    setCountry(draft.audience?.country || '')
    setBudget(String(Math.round(Number(draft.budgetUsd || 1) * 100)))
    setDuration(draft.durationDays || 3)
    setSearch('')
    setEditingId(draft.id)
    setSection('create')
    setMessage('')
  }, [])

  useEffect(() => {
  const id = new URLSearchParams(window.location.search).get('edit')
  if (!id || section !== 'campaigns' || !campaignsLoaded) return undefined

  const controller = new AbortController()
  const selected = campaigns.find(item => item.id === id)
  const request = selected
    ? Promise.resolve(selected)
    : getAuthorAdCampaign(id, { signal: controller.signal })

  request.then(draft => {
    if (controller.signal.aborted) return
    if (draft.status !== 'draft' || draft.reviewStatus !== 'not_submitted') {
      setCampaignsError(t('authorAds.lifecycleBlocked'))
      return
    }

    setCampaigns(items =>
      items.some(item => item.id === id) ? items : [draft, ...items]
    )
    editDraft(draft)
    navigate('/author/page/ads/boost-editor', { replace: true })
  }).catch(() => {
    if (!controller.signal.aborted) {
      setCampaignsError(t('authorAds.campaignLoadFailed'))
    }
  })

  return () => controller.abort()
}, [campaigns, campaignsLoaded, editDraft, navigate, section, t])

  const deleteCampaign = async id => {
    if (processingId || !window.confirm(t('authorAds.confirmDelete'))) return
    setProcessingId(id)
    setCampaignsError('')
    try {
      await deleteAuthorAdDraft(id)
      setCampaigns(current => current.filter(item => item.id !== id))
      setCampaignsLoaded(false)
      if (editingId === id) setEditingId('')
    } catch {
      setCampaignsError(t('authorAds.saveFailed'))
    } finally {
      setProcessingId('')
    }
  }

  const submitCampaign = async id => {
    if (processingId || !window.confirm(t('authorAds.confirmSubmit'))) return
    setProcessingId(id)
    setCampaignsError('')
    try {
      const updated = await submitAuthorAdForReview(id)
      setCampaigns(current => current.map(item => item.id === id ? updated : item))
      setCampaignsLoaded(false)
      setMessage(t('authorAds.submittedForReview'))
    } catch {
      setCampaignsError(t('authorAds.saveFailed'))
    } finally {
      setProcessingId('')
    }
  }

  const changeCampaignStatus = async (campaign, action) => {
    if (processingId || !['start', 'pause', 'resume'].includes(action)) return
    if (action === 'start' && !window.confirm(campaign.fundingType === 'unfunded'
      ? t('authorAds.confirmDiamondStart', { count: Number(campaign.budgetDiamonds || 0).toLocaleString() })
      : t('authorAds.confirmStart'))) return
    if (action === 'pause' && !window.confirm(t('authorAds.confirmPause'))) return
    setProcessingId(campaign.id)
    setCampaignsError('')
    setMessage('')
    try {
      const result = await transitionAuthorAdCampaign(campaign.id, action)
      setCampaigns(current => current.map(item => item.id === campaign.id ? result.campaign : item))
      setMessage(t('authorAds.' + ({
        start: 'lifecycleStarted',
        pause: 'lifecyclePaused',
        resume: 'lifecycleResumed',
      }[action])))
    } catch (cause) {
      const code = cause?.code
      const key = ['AUTHOR_ADS_DELIVERY_NOT_READY', 'AUTHOR_ADS_BOOK_DELIVERY_NOT_READY',
        'AUTHOR_AD_LIFECYCLE_SQL_REQUIRED', 'AUTHOR_AD_DIAMOND_START_SQL_REQUIRED'].includes(code)
        ? 'deliveryNotReady'
        : code === 'AUTHOR_AD_DIAMOND_START_DENIED'
          ? 'diamondStartDenied'
          : code === 'AUTHOR_AD_TRANSITION_DENIED'
            ? 'lifecycleBlocked'
            : ['AUTHOR_ADS_LIFECYCLE_IP_RATE_LIMITED', 'AUTHOR_ADS_LIFECYCLE_ACCOUNT_RATE_LIMITED', 'AUTHOR_ADS_RATE_LIMITED', 'AUTHOR_ADS_IP_RATE_LIMITED'].includes(code)
              ? 'lifecycleRateLimited'
              : 'lifecycleError'
      setCampaignsError(t('authorAds.' + key))
    } finally {
      setProcessingId('')
    }
  }

  const previewAction = kind === 'post' ? t('authorAds.viewPost') : selectedItem?.type === 'pdf' || selectedItem?.type === 'book' ? t('authorAds.buyNow') : t('authorAds.readNow')

  return (
    <main className="min-h-screen bg-[var(--shadow-bg-page)] pb-28 text-[var(--shadow-text-primary)]">
      <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6">
        <header className="mb-5 flex items-center gap-3">
          <button type="button" aria-label={t('authorAds.back')} onClick={() => navigate(section === 'campaigns' ? '/author/page/ads/boost-content' : '/author/page')} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)]"><ArrowLeft size={20} /></button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold">{t('authorAds.title')}</h1>
            <p className="text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.subtitle')}</p>
          </div>
          <Megaphone className="text-[#8061df]" size={24} />
        </header>

        <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl bg-[var(--shadow-bg-surface)] p-1">
          {[
            ['create', 'create', Plus],
            ['campaigns', 'campaigns', Megaphone],
            ['insights', 'insights', BarChart3]
          ].map(([value, key, Icon]) => (
            <button key={value} type="button" onClick={() => { setSection(value); setMessage('') }} className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[12px] font-medium ${section === value ? 'bg-[#efe8ff] text-[#5f3ec4] dark:bg-[#372852] dark:text-[#d0bbff]' : 'text-[var(--shadow-text-secondary)]'}`}>
              <Icon size={15} /><span>{t(`authorAds.${key}`)}</span>
            </button>
          ))}
        </div>

        {section === 'create' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 pt-2">
              <div className="grid grid-cols-2 gap-5">
                {[['post', 'boostPost'], ['book', 'boostBook']].map(([value, key]) => (
                  <button key={value} type="button" onClick={() => resetSelection(value)} className={`border-b-2 pb-3 pt-2 text-center text-[15px] font-medium transition ${kind === value ? 'border-black text-[var(--shadow-text-primary)] dark:border-white' : 'border-transparent text-[var(--shadow-text-secondary)]'}`}>{t(`authorAds.${key}`)}</button>
                ))}
              </div>
              <p className="py-3 text-center text-xs text-[var(--shadow-text-secondary)]">{t(kind === 'post' ? 'authorAds.postHint' : 'authorAds.bookHint')}</p>
            </div>

            <Section title={t('authorAds.selectContent')} aside={kind === 'post' ? <button type="button" onClick={() => navigate('/author/page')} className="flex items-center gap-1 text-xs font-medium text-[#7650d8]"><Plus size={14} />{t('authorAds.newPost')}</button> : null}>
              <div className="relative mb-3">
                <Search size={17} className="absolute left-3 top-3.5 text-[var(--shadow-text-tertiary)]" />
                <input className={`${INPUT_CLASS} pl-10`} value={search} onChange={event => setSearch(event.target.value)} placeholder={t('authorAds.search')} />
              </div>
              {error && <p role="alert" className="mb-3 rounded-xl bg-[#fff4ef] p-3 text-xs text-[#b44822] dark:bg-[#4c2b22] dark:text-[#ffb49a]">{error}</p>}
              {loading ? <p className="py-8 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorAds.loading')}</p> : visibleItems.length ? (
                <div className="max-h-[310px] space-y-2 overflow-y-auto pr-1">
                  {visibleItems.map(item => <ContentCard key={item.key} item={item} t={t} selected={selectedKey === item.key} onClick={() => { setSelectedKey(item.key); setMessage('') }} />)}
                </div>
              ) : <p className="py-8 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorAds.noContent')}</p>}
              {kind === 'post' && hasMorePosts && <button type="button" disabled={moreLoading} onClick={loadMorePosts} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--shadow-border)] py-2.5 text-xs font-medium"><RefreshCw size={14} className={moreLoading ? 'animate-spin' : ''} />{t('authorAds.loadMore')}</button>}
              {kind === 'book' && (hasMoreStories || hasMoreProducts) && <button type="button" disabled={moreLoading} onClick={loadMoreBooks} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--shadow-border)] py-2.5 text-xs font-medium"><RefreshCw size={14} className={moreLoading ? 'animate-spin' : ''} />{t('authorAds.loadMoreBooks')}</button>}
              {error && <button type="button" onClick={() => { const controller = new AbortController(); loadContent(controller.signal) }} className="mt-3 text-xs text-[#7650d8]">{t('authorAds.retry')}</button>}
            </Section>

            <Section title={t('authorAds.chooseGoal')}>
              <p className="mb-3 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.goalHint')}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {goals.map(([value, label]) => (
                  <button key={value} type="button" onClick={() => setGoal(value)} className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm ${effectiveGoal === value ? 'border-[#8061df] bg-[#f5f0ff] text-[#6042ba] dark:bg-[#30224b] dark:text-[#cbb6ff]' : 'border-[var(--shadow-border)]'}`}>
                    <Target size={17} /><span className="flex-1">{t(`authorAds.${label}`)}</span>{effectiveGoal === value && <Check size={16} />}
                  </button>
                ))}
              </div>
            </Section>

            <Section title={t('authorAds.audience')}>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {[['automatic', 'automatic'], ['manual', 'manual']].map(([value, key]) => <button key={value} type="button" onClick={() => setAudienceMode(value)} className={`rounded-xl border px-3 py-2.5 text-sm ${audienceMode === value ? 'border-[#8061df] bg-[#f5f0ff] text-[#6042ba] dark:bg-[#30224b] dark:text-[#cbb6ff]' : 'border-[var(--shadow-border)]'}`}>{t(`authorAds.${key}`)}</button>)}
              </div>
              {audienceMode === 'automatic' ? <p className="text-xs leading-5 text-[var(--shadow-text-secondary)]">{t('authorAds.automaticHint')}</p> : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-xs"><span>{t('authorAds.genre')}</span><select className={INPUT_CLASS} value={targetGenre} onChange={event => setTargetGenre(event.target.value)}><option value="">{t('authorAds.anyGenre')}</option>{GENRES.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
                  <label className="space-y-1 text-xs"><span>{t('authorAds.language')}</span><select className={INPUT_CLASS} value={language} onChange={event => setLanguage(event.target.value)}><option value="">{t('authorAds.allLanguages')}</option>{LANGUAGES.map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}</select></label>
                  <label className="space-y-1 text-xs sm:col-span-2"><span>{t('authorAds.country')}</span><select className={INPUT_CLASS} value={country} onChange={event => setCountry(event.target.value)}><option value="">{t('authorAds.allCountries')}</option><option value="KH">{t('authorAds.cambodia')}</option><option value="TH">{t('authorAds.thailand')}</option><option value="VN">{t('authorAds.vietnam')}</option></select></label>
                </div>
              )}
            </Section>

            <Section title={t('authorAds.placement')}>
              <div className="flex items-center justify-between rounded-xl border border-[#8061df] bg-[#f5f0ff] p-3 text-sm text-[#6042ba] dark:bg-[#30224b] dark:text-[#cbb6ff]"><span>{t('authorAds.discover')}</span><Check size={17} /></div>
              <p className="mt-2 text-xs leading-5 text-[var(--shadow-text-secondary)]">{t('authorAds.discoverHint')}</p>
            </Section>

            <Section title={t('authorAds.budget')}>
              <div className="flex items-center gap-2"><span className="text-sm font-medium">💎</span><input type="number" min="100" max="1000000" step="1" inputMode="numeric" value={budget} onChange={event => setBudget(event.target.value)} className={INPUT_CLASS} /><span className="text-sm text-[var(--shadow-text-secondary)]">Diamonds</span></div>
              <p className="mt-2 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.boostBudgetHint')}</p>
               <p className="mt-1 text-xs font-medium text-[#7851cc] dark:text-[#ceb5ff]">{t('authorAds.estimatedReach', { count: Math.max(0, Math.round(Number(budget) || 0)).toLocaleString() })}</p>
              <h3 className="mb-2 mt-4 text-sm font-medium">{t('authorAds.duration')}</h3>
              <div className="grid grid-cols-4 gap-2">{DURATION_OPTIONS.map(value => <button key={value} type="button" onClick={() => setDuration(value)} className={`rounded-lg border px-1 py-2.5 text-xs ${duration === value ? 'border-[#8061df] bg-[#f5f0ff] text-[#6042ba] dark:bg-[#30224b] dark:text-[#cbb6ff]' : 'border-[var(--shadow-border)]'}`}>{t('authorAds.days', { count: value })}</button>)}</div>
            </Section>

            <Section title={t('authorAds.preview')}>
              <div className="mx-auto max-w-sm overflow-hidden rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
                <div className="flex items-center gap-2 p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eee8ff] text-[#6847c7]"><Megaphone size={17} /></span><div><p className="text-xs font-medium">Shadow</p><p className="text-[11px] text-[var(--shadow-text-secondary)]">{t('authorAds.sponsored')}</p></div></div>
                <div className="flex aspect-[16/10] items-center justify-center bg-[var(--shadow-bg-soft)]">{safeImageSrc(selectedItem?.image) ? <img className="h-full w-full object-contain" src={safeImageSrc(selectedItem.image)} alt="" /> : kind === 'post' ? <ImageIcon size={37} className="text-[var(--shadow-text-tertiary)]" /> : <BookOpen size={37} className="text-[var(--shadow-text-tertiary)]" />}</div>
                <div className="flex items-center justify-between gap-3 p-3"><p className="line-clamp-2 min-w-0 text-sm font-medium">{selectedItem?.title || t('authorAds.selectContent')}</p><span className="shrink-0 rounded-lg bg-[#f2cb55] px-3 py-2 text-xs font-medium text-black">{previewAction}</span></div>
              </div>
            </Section>

            {message && <p role="status" className="rounded-xl bg-[#f3edff] p-3 text-sm text-[#6246b7] dark:bg-[#30224b] dark:text-[#dbcaff]">{message}</p>}
            <div className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs leading-5 text-[var(--shadow-text-secondary)]"><Info size={16} className="mr-2 inline" />{t('authorAds.boostDraftHint')}</div>
            <button type="button" disabled={!username || loading || saving} onClick={saveDraft} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 py-3.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"><Check size={17} />{t(saving ? 'authorAds.saving' : 'authorAds.saveDraft')}</button>
          </div>
        )}

        {section === 'campaigns' && (
          <div className="space-y-3">
            {message && <p role="status" className="rounded-xl bg-[#f3edff] p-3 text-sm text-[#6246b7] dark:bg-[#30224b] dark:text-[#dbcaff]">{message}</p>}
            {campaignsError && <p role="alert" className="rounded-xl bg-[#fff4ef] p-3 text-xs text-[#b44822] dark:bg-[#4c2b22] dark:text-[#ffb49a]">{campaignsError}</p>}
            {campaignsLoading && <p className="py-6 text-center text-sm text-[var(--shadow-text-secondary)]">{t('authorAds.loadingCampaigns')}</p>}
            {!campaignsLoading && !backendAvailable && (
              <p className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.serverOffline')}</p>
            )}
            {!campaignsLoading && (!backendAvailable || campaignsError) && (
              <button type="button" onClick={() => { setCampaignsError(''); setCampaignsLoaded(false) }} className="flex items-center gap-2 text-xs font-medium text-[#7650d8]"><RefreshCw size={14} />{t('authorAds.retry')}</button>
            )}
            {backendAvailable && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold">{t('authorAds.cloudCampaigns')}</h2>
                {campaigns.map(campaign => {
                  const editable = campaign.status === 'draft' && campaign.reviewStatus === 'not_submitted'
                   const fundingType = ['diamonds', 'usd', 'unfunded'].includes(campaign.fundingType) ? campaign.fundingType : 'unverified'
                   const legacyUsd = fundingType === 'usd'
                   const asAmount = value => Math.max(0, Number(value) || 0)
                   const formatAmount = value => legacyUsd
                     ? '$' + asAmount(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                     : Math.round(asAmount(value)).toLocaleString() + ' 💎'
                   const budget = legacyUsd ? asAmount(campaign.budgetUsd) : asAmount(campaign.budgetDiamonds ?? Number(campaign.budgetUsd || 0) * 100)
                   const funded = legacyUsd ? asAmount(campaign.fundedUsd) : asAmount(campaign.fundedDiamonds)
                   const spent = legacyUsd ? asAmount(campaign.spentUsd) : asAmount(campaign.spentDiamonds)
                   const refunded = legacyUsd ? asAmount(campaign.refundedUsd) : asAmount(campaign.refundedDiamonds)
                   const available = legacyUsd ? Math.max(0, funded - spent - refunded) : asAmount(campaign.remainingDiamonds)
                   const usedPercent = budget > 0 ? Math.min(100, Math.round(spent / budget * 10000) / 100) : 0
                   const paymentRequired = campaign.paymentRequired !== false
                   const hasFunds = !paymentRequired && available > 0
                   const deliveryEndsAt = campaign.endAt ? Date.parse(campaign.endAt) : NaN
                   const hasActiveWindow = Number.isFinite(deliveryEndsAt) && Date.now() < deliveryEndsAt
                   const deliveryExpired = ['active', 'paused'].includes(campaign.status) && Number.isFinite(deliveryEndsAt) && !hasActiveWindow
                   const canStart = campaign.status === 'approved' && (fundingType === 'unfunded' || (fundingType !== 'unverified' && hasFunds))
                   const canPause = campaign.status === 'active' && hasActiveWindow
                   const canResume = campaign.status === 'paused' && hasFunds && hasActiveWindow
                   const audience = campaign.audience || {}
                   const selectedAudience = audience.mode === 'manual'
                     ? [audience.genre, audience.language?.toUpperCase(), audience.country].filter(Boolean).join(' · ')
                     : ''
                  return (
                    <div key={campaign.id} className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
                      <div className="flex gap-3">
                        <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)]">
                          {safeImageSrc(campaign.contentImage) ? <img src={safeImageSrc(campaign.contentImage)} className="h-full w-full object-cover" alt="" /> : <BookOpen size={21} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="rounded-full bg-[#f0eaff] px-2 py-1 text-[10px] font-medium text-[#6c45d0] dark:bg-[#30224b] dark:text-[#d4c1ff]">{t('authorAds.' + (STATUS_LABELS[campaign.status] || 'draft'))}</span>
                          <h3 className="mt-2 line-clamp-2 text-sm font-medium">{campaign.contentTitle}</h3>
                          <p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{formatAmount(budget)} · {t('authorAds.days', { count: campaign.durationDays })}</p>
                        </div>
                      </div>
                       <div className="mt-3 space-y-1 text-xs text-[var(--shadow-text-secondary)]">
                         <p><span className="font-medium text-[var(--shadow-text-primary)]">{t('authorAds.' + (campaign.kind === 'post' ? 'boostPost' : 'boostBook'))}</span> · {t('authorAds.boostGoal')}: {t('authorAds.' + (GOAL_LABELS[campaign.goal] || 'chooseGoal'))}</p>
                         <p>{t('authorAds.boostAudience')}: {t('authorAds.' + (audience.mode === 'manual' ? 'manual' : 'automatic'))}{selectedAudience ? ' · ' + selectedAudience : ''}</p>
                       </div>
                       <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                         {[
                           ['boostBudget', budget],
                           ['boostFunded', funded],
                           ['boostSpent', spent],
                           ['boostAvailable', available],
                         ].map(([key, value]) => (
                           <div key={key} className="min-w-0 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2">
                             <p className="text-[11px] text-[var(--shadow-text-secondary)]">{t('authorAds.' + key)}</p>
                             <p className="mt-1 text-sm font-semibold tabular-nums text-[var(--shadow-text-primary)]">{formatAmount(value)}</p>
                           </div>
                         ))}
                       </div>
                       {refunded > 0 && <p className="mt-2 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.boostRefunded')}: {formatAmount(refunded)}</p>}
                       <div className="mt-3">
                         <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                           <span className="text-[var(--shadow-text-secondary)]">{t('authorAds.budgetProgress')}</span>
                           <span className="font-semibold tabular-nums">{usedPercent.toFixed(2)}%</span>
                         </div>
                         <div className="h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-soft)]" role="progressbar" aria-label={t('authorAds.budgetProgress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={usedPercent}>
                           <div className="h-full rounded-full bg-[#9b83e9]" style={{ width: `${usedPercent}%` }} />
                         </div>
                       </div>
                      {campaign.reviewReason && <p className="mt-3 rounded-lg bg-[var(--shadow-bg-soft)] p-2 text-xs text-[var(--shadow-text-secondary)]">{campaign.reviewReason}</p>}
                      {editable && <div className="mt-3 flex flex-wrap justify-end gap-3">
                        <button type="button" disabled={Boolean(processingId)} onClick={() => deleteCampaign(campaign.id)} className="text-xs text-[#cf4a52] disabled:opacity-50">{t('authorAds.deleteDraft')}</button>
                        <button type="button" disabled={Boolean(processingId)} onClick={() => editDraft(campaign)} className="flex items-center gap-1 text-xs font-medium text-[#8061df] disabled:opacity-50">{t('authorAds.editDraft')}<ChevronRight size={14} /></button>
                        <button type="button" disabled={Boolean(processingId)} onClick={() => submitCampaign(campaign.id)} className="rounded-lg bg-[#171717] px-3 py-2 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">{t('authorAds.submitForReview')}</button>
                      </div>}
                      {campaign.status === 'approved' && fundingType === 'unfunded' && (
                        <p className="mt-3 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.diamondReserveHint')}</p>
                      )}
                      {['approved', 'paused'].includes(campaign.status) && fundingType === 'unverified' && (
                        <p className="mt-3 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.fundingUnverified')}</p>
                      )}
                      {['approved', 'paused'].includes(campaign.status) && fundingType === 'usd' && paymentRequired && (
                        <p className="mt-3 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.paymentRequired')}</p>
                      )}
                      {['active', 'paused'].includes(campaign.status) && !deliveryExpired && (
                        <p className="mt-3 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.pauseClockWarning')}</p>
                      )}
                      {deliveryExpired && (
                        <p className="mt-3 text-xs text-[#b44822] dark:text-[#ffb49a]">{t('authorAds.deliveryExpired')}</p>
                      )}
                      {(canStart || canPause || canResume) && (
                        <div className="mt-3 flex flex-wrap justify-end gap-2">
                          {canStart && <button type="button" disabled={Boolean(processingId)} onClick={() => changeCampaignStatus(campaign, 'start')} className="rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">{t('authorAds.startCampaign')}</button>}
                          {canPause && <button type="button" disabled={Boolean(processingId)} onClick={() => changeCampaignStatus(campaign, 'pause')} className="rounded-lg border border-[var(--shadow-border)] px-4 py-2 text-xs font-medium disabled:opacity-50">{t('authorAds.pauseCampaign')}</button>}
                          {canResume && <button type="button" disabled={Boolean(processingId)} onClick={() => changeCampaignStatus(campaign, 'resume')} className="rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">{t('authorAds.resumeCampaign')}</button>}
                        </div>
                      )}
                    </div>
                  )
                })}
                {campaignsHasMore && <button type="button" disabled={campaignsLoadingMore} onClick={loadMoreCampaigns} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--shadow-border)] py-3 text-xs font-medium disabled:opacity-50"><RefreshCw size={14} className={campaignsLoadingMore ? 'animate-spin' : ''} />{t('authorAds.loadMoreCampaigns')}</button>}
              </div>
            )}
            {drafts.length > 0 && <div className="space-y-3">
              <h2 className="text-sm font-semibold">{t('authorAds.localCampaigns')}</h2>
              {drafts.map(draft => (
                <div key={draft.id} className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--shadow-bg-soft)]">{safeImageSrc(draft.contentImage) ? <img src={safeImageSrc(draft.contentImage)} className="h-full w-full object-cover" alt="" /> : <BookOpen size={21} />}</div>
                    <div className="min-w-0 flex-1">
                      <span className="rounded-full bg-[#f0eaff] px-2 py-1 text-[10px] font-medium text-[#6c45d0] dark:bg-[#30224b] dark:text-[#d4c1ff]">{t('authorAds.draft')} · {t('authorAds.notLive')}</span>
                      <h3 className="mt-2 line-clamp-2 text-sm font-medium">{draft.contentTitle}</h3>
                      <p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{Math.round(Number(draft.budgetUsd || 0) * 100).toLocaleString() + ' 💎'} · {t('authorAds.days', { count: draft.durationDays })}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-3">
                    <button type="button" onClick={() => deleteDraft(draft.id)} className="text-xs text-[#cf4a52]">{t('authorAds.deleteDraft')}</button>
                    <button type="button" onClick={() => editDraft(draft)} className="flex items-center gap-1 text-xs font-medium text-[#8061df]">{t('authorAds.editDraft')}<ChevronRight size={14} /></button>
                  </div>
                </div>
              ))}
            </div>}
            {!campaignsLoading && !campaigns.length && !drafts.length && (
              <div className="rounded-2xl bg-[var(--shadow-bg-surface)] p-12 text-center">
                <Megaphone className="mx-auto mb-3 text-[var(--shadow-text-tertiary)]" size={34} />
                <h2 className="text-base font-medium">{t('authorAds.noCampaigns')}</h2>
                <p className="mt-2 text-xs text-[var(--shadow-text-secondary)]">{t('authorAds.noCampaignsHint')}</p>
                <button type="button" onClick={() => setSection('create')} className="mt-5 rounded-lg bg-[#171717] px-5 py-2 text-sm text-white dark:bg-white dark:text-black">{t('authorAds.create')}</button>
              </div>
            )}
          </div>
        )}

        {section === 'insights' && <div className="rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-5"><div className="grid grid-cols-2 gap-3">{['totalReach', 'postClicks', 'totalSpend', 'results'].map(key => <div key={key} className="rounded-xl bg-[var(--shadow-bg-soft)] p-4"><p className="text-2xl font-medium">—</p><p className="mt-1 text-xs text-[var(--shadow-text-secondary)]">{t(`authorAds.${key}`)}</p></div>)}</div><div className="mt-5 flex flex-col items-center py-8 text-center"><BarChart3 size={34} className="text-[var(--shadow-text-tertiary)]" /><h2 className="mt-3 text-sm font-medium">{t('authorAds.noInsights')}</h2><p className="mt-2 max-w-sm text-xs leading-5 text-[var(--shadow-text-secondary)]">{t('authorAds.insightsSoon')}</p></div></div>}

        <p className="mt-5 text-center text-[11px] leading-5 text-[var(--shadow-text-tertiary)]">{t('authorAds.about')}</p>
      </div>
    </main>
  )
}
