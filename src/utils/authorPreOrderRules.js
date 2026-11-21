export const AUTHOR_PRE_ORDER_MAX_BOOKS = 10
export const AUTHOR_PRE_ORDER_FREE_ORDER_QUOTA = 10000
export const AUTHOR_PRE_ORDER_FEE_PER_ORDER_USD = 0.125
export const AUTHOR_PRE_ORDER_CAMBODIA_TIME_ZONE = 'Asia/Phnom_Penh'

const TEXT = {
  en: {
    pageTitle: 'Pre-order', createTitle: 'Create Pre-order', editTitle: 'Edit Pre-order', search: 'Search pre-orders', create: 'Create Pre-order', saveDraft: 'Save Draft', publish: 'Publish Pre-order', saving: 'Saving...', loading: 'Loading...', retry: 'Try again', back: 'Back', all: 'All', active: 'Active', scheduled: 'Scheduled', closed: 'Closed', completed: 'Completed', draft: 'Draft', cancelled: 'Cancelled', noCampaigns: 'No pre-orders yet', noCampaignsHint: 'Create a pre-order to get started.', noResults: 'No matching pre-orders', loadMore: 'Load more', orders: 'Orders', book: 'Book', books: 'Books', standard: 'Standard Edition', limited: 'Limited Edition', quota: 'Quota', open: 'Open', close: 'Close', shipping: 'Expected shipping', view: 'View', edit: 'Edit', accessDenied: 'Pre-order is available to verified Cambodian author accounts only.', verifyFailed: 'Could not verify access. Please retry.', loginRequired: 'Please sign in to continue.', error: 'Unable to load pre-orders.', information: 'Basic Information', uploadCover: 'Upload promotion image', uploadBookCover: 'Upload book cover', changeImage: 'Change image', removeImage: 'Remove image', uploadHint: 'Any image ratio is supported. Images are not cropped.', bookTitle: 'Book title', campaignTitle: 'Promotion title', shortDescription: 'Short description', genre: 'Genre', authorNote: 'Author note', optional: 'Optional', schedule: 'Pre-order Schedule', openDate: 'Open date and time', closeDate: 'Close date and time', releaseDate: 'Expected shipping date', editions: 'Editions & Pricing', price: 'Price (USD)', signature: 'Signature Option', signedCopies: 'Offer signed copies', signatureFee: 'Signature fee (USD)', signatureNote: 'Signature note', delivery: 'Delivery / Buyer Requirements', deliveryCompany: 'Delivery companies', deliveryNote: 'Delivery note', buyerNote: 'Buyer note instructions', preview: 'Live Preview', addBook: 'Add another book', removeBook: 'Remove book', yes: 'Yes', no: 'No', enabled: 'Enabled', saveFailed: 'Could not save. No changes have been published.', publishFailed: 'Could not publish. Your draft has been saved.', draftSaved: 'Draft saved.', published: 'Pre-order published.', fillRequired: 'Please complete the required fields.', datesInvalid: 'Open, close and shipping dates must be in order.', validEdition: 'Each book needs at least one edition with a valid price and quota.', uploadFailed: 'Image upload failed. Please try again.', noBackend: 'Pre-order service is not available yet.', chooseFile: 'Choose image', editBook: 'Book', remove: 'Remove', validation: 'Please review the highlighted information.', campaignTitleHint: 'e.g. Moonlight Promise Pre-order', descriptionHint: 'Tell readers what makes this pre-order special', authorNoteHint: 'Optional message to readers', genresHint: 'e.g. Romance, Fantasy', deliveryHint: 'Delivery details for buyers', buyerHint: 'Instructions to buyers', signHint: 'Instructions for signed copies', emptyPreview: 'Your preview will appear here', jnt: 'J&T Express', vet: 'Vireak Buntham (VET)', selectedImage: 'Selected image', addImage: 'Add image', uploadInProgress: 'Uploading images...', backToList: 'Back to Pre-orders', cannotPublish: 'Publishing is unavailable until the Pre-order backend is connected.'
  },
  km: {
    pageTitle: 'ការបើកកក់', createTitle: 'បង្កើតការបើកកក់', editTitle: 'កែការបើកកក់', search: 'ស្វែងរកការកក់', create: 'បង្កើតការបើកកក់', saveDraft: 'រក្សាទុកព្រាង', publish: 'ផ្សាយការបើកកក់', saving: 'កំពុងរក្សាទុក...', loading: 'កំពុងផ្ទុក...', retry: 'សាកម្ដងទៀត', back: 'ត្រឡប់', all: 'ទាំងអស់', active: 'កំពុងបើក', scheduled: 'កំណត់ពេល', closed: 'បិទកក់', completed: 'បញ្ចប់', draft: 'ព្រាង', cancelled: 'បោះបង់', noCampaigns: 'មិនទាន់មានការបើកកក់', noCampaignsHint: 'បង្កើតការបើកកក់ដំបូងរបស់អ្នក។', noResults: 'រកមិនឃើញ', loadMore: 'បង្ហាញបន្ថែម', orders: 'ការកក់', book: 'សៀវភៅ', books: 'សៀវភៅ', standard: 'ឈុតធម្មតា', limited: 'ឈុត Limited', quota: 'កូតា', open: 'បើក', close: 'បិទ', shipping: 'រំពឹងដឹកជញ្ជូន', view: 'មើល', edit: 'កែ', accessDenied: 'មុខងារនេះសម្រាប់គណនីអ្នកនិពន្ធកម្ពុជាដែលបានផ្ទៀងផ្ទាត់ប៉ុណ្ណោះ។', verifyFailed: 'មិនអាចផ្ទៀងផ្ទាត់សិទ្ធិបានទេ។', loginRequired: 'សូមចូលគណនីសិន។', error: 'មិនអាចផ្ទុកការបើកកក់បានទេ។', information: 'ព័ត៌មានមូលដ្ឋាន', uploadCover: 'ដាក់រូបផ្សព្វផ្សាយ', uploadBookCover: 'ដាក់រូបសៀវភៅ', changeImage: 'ប្តូររូប', removeImage: 'ដករូប', uploadHint: 'អាចប្រើរូបគ្រប់ទម្រង់ ដោយមិនកាត់រូប។', bookTitle: 'ចំណងជើងសៀវភៅ', campaignTitle: 'ឈ្មោះការផ្សព្វផ្សាយ', shortDescription: 'ការពិពណ៌នាខ្លី', genre: 'ប្រភេទរឿង', authorNote: 'កំណត់ចំណាំអ្នកនិពន្ធ', optional: 'មិនបង្ខំ', schedule: 'កាលវិភាគបើកកក់', openDate: 'ថ្ងៃម៉ោងបើកកក់', closeDate: 'ថ្ងៃម៉ោងបិទកក់', releaseDate: 'ថ្ងៃរំពឹងដឹកជញ្ជូន', editions: 'ឈុត និងតម្លៃ', price: 'តម្លៃ (USD)', signature: 'ស៊ីញ៉េអ្នកនិពន្ធ', signedCopies: 'ផ្តល់ស៊ីញ៉េ', signatureFee: 'តម្លៃស៊ីញ៉េ (USD)', signatureNote: 'កំណត់ចំណាំស៊ីញ៉េ', delivery: 'ព័ត៌មានដឹកជញ្ជូន', deliveryCompany: 'ក្រុមហ៊ុនដឹកជញ្ជូន', deliveryNote: 'កំណត់ចំណាំដឹកជញ្ជូន', buyerNote: 'ការណែនាំអ្នកទិញ', preview: 'មើលគំរូ', addBook: 'បន្ថែមសៀវភៅ', removeBook: 'ដកសៀវភៅ', yes: 'បាទ/ចាស', no: 'ទេ', enabled: 'បើក', saveFailed: 'មិនអាចរក្សាទុកបានទេ។', publishFailed: 'មិនអាចផ្សាយបានទេ។ ព្រាងបានរក្សាទុក។', draftSaved: 'បានរក្សាទុកព្រាង។', published: 'បានផ្សាយការបើកកក់។', fillRequired: 'សូមបំពេញព័ត៌មានចាំបាច់។', datesInvalid: 'ថ្ងៃបើក បិទ និងដឹកជញ្ជូនត្រូវរៀបតាមលំដាប់។', validEdition: 'សៀវភៅនីមួយៗត្រូវមានឈុតមួយយ៉ាងតិច និងតម្លៃ/កូតាត្រឹមត្រូវ។', uploadFailed: 'បង្ហោះរូបបរាជ័យ។', noBackend: 'ប្រព័ន្ធបើកកក់មិនទាន់តភ្ជាប់ទេ។', chooseFile: 'ជ្រើសរូប', editBook: 'សៀវភៅ', remove: 'ដក', validation: 'សូមពិនិត្យព័ត៌មាន។', campaignTitleHint: 'ឧ. ការបើកកក់ Moonlight Promise', descriptionHint: 'សរសេរអំពីការបើកកក់នេះ', authorNoteHint: 'សារទៅអ្នកអាន', genresHint: 'ឧ. Romance, Fantasy', deliveryHint: 'ព័ត៌មានដឹកជញ្ជូន', buyerHint: 'ការណែនាំអ្នកទិញ', signHint: 'ព័ត៌មានអំពីស៊ីញ៉េ', emptyPreview: 'គំរូនឹងបង្ហាញនៅទីនេះ', jnt: 'J&T Express', vet: 'វីរៈប៊ុនថាំ (VET)', selectedImage: 'រូបដែលបានជ្រើស', addImage: 'បន្ថែមរូប', uploadInProgress: 'កំពុងបង្ហោះរូប...', backToList: 'ត្រឡប់ទៅការបើកកក់', cannotPublish: 'មិនទាន់អាចផ្សាយទេ រហូតដល់ភ្ជាប់ Backend។'
  },
  zh: { back: '返回', changeImage: '更换图片', removeImage: '移除图片', campaignTitleHint: '例如：月光之约预订', descriptionHint: '向读者介绍本次预订', genresHint: '例如：爱情、奇幻', authorNoteHint: '给读者的留言', signHint: '签名说明', deliveryHint: '配送详情', buyerHint: '给买家的说明', emptyPreview: '预览将在这里显示', pageTitle: '预订管理', createTitle: '创建预订', editTitle: '编辑预订', create: '创建预订', saveDraft: '保存草稿', publish: '发布预订', loading: '加载中...', retry: '重试', all: '全部', active: '进行中', scheduled: '已排期', closed: '已关闭', completed: '已完成', draft: '草稿', orders: '订单', book: '书籍', books: '书籍', standard: '普通版', limited: '限量版', quota: '配额', open: '开始', close: '结束', shipping: '预计发货', information: '基本信息', uploadCover: '上传宣传图片', uploadBookCover: '上传书籍封面', uploadHint: '支持所有图片比例，不会裁剪。', bookTitle: '书名', campaignTitle: '推广标题', shortDescription: '简介', genre: '类型', authorNote: '作者备注', schedule: '预订时间', openDate: '开始时间', closeDate: '结束时间', releaseDate: '预计发货时间', editions: '版本与价格', price: '价格 (USD)', signature: '签名选项', signedCopies: '提供签名', signatureFee: '签名费用 (USD)', signatureNote: '签名说明', delivery: '配送要求', deliveryCompany: '配送公司', deliveryNote: '配送说明', buyerNote: '买家说明', preview: '预览', addBook: '添加书籍', removeBook: '移除书籍', accessDenied: '仅限经过验证的柬埔寨作者账户。', verifyFailed: '无法验证访问权限。', error: '无法加载预订。', noCampaigns: '尚无预订', noCampaignsHint: '创建您的第一项预订。', noResults: '没有结果', loadMore: '加载更多', saveFailed: '保存失败。', publishFailed: '发布失败，草稿已保存。', draftSaved: '草稿已保存。', published: '预订已发布。', fillRequired: '请填写必填项。', datesInvalid: '日期顺序不正确。', validEdition: '每本书须至少有一种有效版本。', uploadFailed: '图片上传失败。', chooseFile: '选择图片', search: '搜索预订', optional: '可选', remove: '移除', edit: '编辑', cancelled: '已取消', enabled: '启用', saving: '保存中...', loginRequired: '请先登录。', noBackend: '预订服务尚未连接。', cannotPublish: '后端连接前无法发布。' },
  ja: { back: '戻る', changeImage: '画像を変更', removeImage: '画像を削除', campaignTitleHint: '例：月明かりの約束・予約販売', descriptionHint: '予約販売の特徴を紹介', genresHint: '例：恋愛、ファンタジー', authorNoteHint: '読者へのメッセージ', signHint: 'サイン本の案内', deliveryHint: '配送情報', buyerHint: '購入者への案内', emptyPreview: 'プレビューがここに表示されます', pageTitle: '予約販売', createTitle: '予約販売を作成', editTitle: '予約販売を編集', create: '新規予約販売', saveDraft: '下書きを保存', publish: '予約販売を公開', loading: '読み込み中...', retry: '再試行', all: 'すべて', active: '受付中', scheduled: '予定', closed: '終了', completed: '完了', draft: '下書き', orders: '注文', book: '書籍', books: '書籍', standard: '通常版', limited: '限定版', quota: '上限', open: '開始', close: '終了', shipping: '発送予定', information: '基本情報', uploadCover: '宣伝画像をアップロード', uploadBookCover: '書影をアップロード', uploadHint: '画像の縦横比は自由で、切り抜きません。', bookTitle: '書名', campaignTitle: 'キャンペーン名', shortDescription: '紹介文', genre: 'ジャンル', authorNote: '著者メモ', schedule: '予約販売期間', openDate: '開始日時', closeDate: '終了日時', releaseDate: '発送予定日時', editions: '種類と価格', price: '価格 (USD)', signature: 'サイン設定', signedCopies: 'サイン本を提供', signatureFee: 'サイン代 (USD)', signatureNote: 'サインの説明', delivery: '配送条件', deliveryCompany: '配送会社', deliveryNote: '配送メモ', buyerNote: '購入者への注意', preview: 'プレビュー', addBook: '書籍を追加', removeBook: '削除', accessDenied: '認証済みのカンボジア作家のみ利用可能です。', verifyFailed: '利用権限を確認できません。', error: '予約販売を読み込めません。', noCampaigns: '予約販売はまだありません', noCampaignsHint: '最初の予約販売を作成してください。', noResults: '該当なし', loadMore: 'さらに表示', saveFailed: '保存できませんでした。', publishFailed: '公開できませんでした。下書きは保存済みです。', draftSaved: '下書きを保存しました。', published: '公開しました。', fillRequired: '必須項目を入力してください。', datesInvalid: '日付の順序が正しくありません。', validEdition: '各書籍に有効な種類を設定してください。', uploadFailed: '画像のアップロードに失敗しました。', chooseFile: '画像を選択', search: '予約販売を検索', optional: '任意', remove: '削除', edit: '編集', cancelled: 'キャンセル', enabled: '有効', saving: '保存中...', loginRequired: 'ログインしてください。', noBackend: '予約販売サービスが未接続です。', cannotPublish: 'バックエンド接続後に公開できます。' },
  ko: { back: '뒤로', changeImage: '이미지 변경', removeImage: '이미지 삭제', campaignTitleHint: '예: 달빛 약속 예약 판매', descriptionHint: '예약 판매에 대한 설명', genresHint: '예: 로맨스, 판타지', authorNoteHint: '독자에게 전할 말', signHint: '사인본 안내', deliveryHint: '배송 정보', buyerHint: '구매자 안내', emptyPreview: '미리보기가 여기에 표시됩니다', pageTitle: '예약 판매', createTitle: '예약 판매 만들기', editTitle: '예약 판매 수정', create: '예약 판매 만들기', saveDraft: '초안 저장', publish: '예약 판매 게시', loading: '불러오는 중...', retry: '다시 시도', all: '전체', active: '진행 중', scheduled: '예정', closed: '마감', completed: '완료', draft: '초안', orders: '주문', book: '책', books: '책', standard: '일반판', limited: '한정판', quota: '한도', open: '시작', close: '종료', shipping: '배송 예정', information: '기본 정보', uploadCover: '홍보 이미지 업로드', uploadBookCover: '책 표지 업로드', uploadHint: '모든 이미지 비율을 지원하며 자르지 않습니다.', bookTitle: '책 제목', campaignTitle: '캠페인 제목', shortDescription: '간단 설명', genre: '장르', authorNote: '작가 메모', schedule: '예약 판매 일정', openDate: '시작 일시', closeDate: '종료 일시', releaseDate: '배송 예정 일시', editions: '에디션 및 가격', price: '가격 (USD)', signature: '사인 옵션', signedCopies: '사인본 제공', signatureFee: '사인 비용 (USD)', signatureNote: '사인 안내', delivery: '배송 조건', deliveryCompany: '배송사', deliveryNote: '배송 메모', buyerNote: '구매자 안내', preview: '미리보기', addBook: '책 추가', removeBook: '책 삭제', accessDenied: '인증된 캄보디아 작가만 이용할 수 있습니다.', verifyFailed: '접근 권한을 확인할 수 없습니다.', error: '예약 판매를 불러올 수 없습니다.', noCampaigns: '예약 판매가 없습니다', noCampaignsHint: '첫 예약 판매를 만들어 보세요.', noResults: '검색 결과 없음', loadMore: '더 보기', saveFailed: '저장하지 못했습니다.', publishFailed: '게시하지 못했습니다. 초안은 저장되었습니다.', draftSaved: '초안을 저장했습니다.', published: '예약 판매가 게시되었습니다.', fillRequired: '필수 항목을 입력하세요.', datesInvalid: '날짜 순서가 올바르지 않습니다.', validEdition: '각 책에 유효한 에디션이 하나 이상 필요합니다.', uploadFailed: '이미지 업로드 실패', chooseFile: '이미지 선택', search: '예약 판매 검색', optional: '선택', remove: '삭제', edit: '수정', cancelled: '취소', enabled: '활성화', saving: '저장 중...', loginRequired: '먼저 로그인하세요.', noBackend: '예약 판매 서비스가 아직 연결되지 않았습니다.', cannotPublish: '백엔드 연결 후 게시할 수 있습니다.' }
}

export function authorPreOrderText(language, key) {
  const lang = String(language || 'en').toLowerCase()
  return TEXT[lang]?.[key] || TEXT.en[key] || key
}

export function canAccessAuthorPreOrder(settings) {
  return settings?.countryVerified === true && settings?.countrySource === 'reader_classification' && settings?.region === 'kh' && String(settings?.country || '').toUpperCase() === 'KH'
}

export function emptyPreOrderBook() {
  return {
    client_id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: '',
    cover_url: '',
    editions: {
      standard: { enabled: true, price_usd: '', quota: '' },
      limited: { enabled: false, price_usd: '', quota: '' },
    },
  }
}

export function emptyPreOrderCampaign() {
  return {
    title: '', description: '', genre: '', author_note: '', banner_url: '',
    open_at: '', close_at: '', expected_ship_at: '',
    signature_enabled: false, signature_fee_usd: '0', signature_note: '',
    delivery_company_keys: ['jnt', 'vet'], delivery_note: '', buyer_note_instruction: '',
    books: [emptyPreOrderBook()], status: 'draft',
  }
}

export function khDateTimeToEpoch(value) {
  const text = String(value || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) return NaN
  const time = Date.parse(`${text}:00+07:00`)
  if (!Number.isFinite(time)) return NaN
  const expected = new Date(time + 7 * 60 * 60 * 1000).toISOString().slice(0, 16)
  return expected === text ? time : NaN
}

export function formatKhDateTimeInput(value) {
  if (!value) return ''
  const str = String(value)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)) return str
  const time = Date.parse(str)
  if (!Number.isFinite(time)) return ''
  return new Date(time + 7 * 60 * 60 * 1000).toISOString().slice(0, 16)
}

export function formatPreOrderDate(value, locale = 'en') {
  const time = Date.parse(String(value || ''))
  if (!Number.isFinite(time)) return '—'
  return new Intl.DateTimeFormat(locale === 'km' ? 'km-KH' : locale, { timeZone: AUTHOR_PRE_ORDER_CAMBODIA_TIME_ZONE, month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(time))
}

export function campaignStatus(campaign) {
  const status = String(campaign?.status || 'draft').toLowerCase()
  return ['draft', 'scheduled', 'active', 'closed', 'completed', 'cancelled'].includes(status) ? status : 'draft'
}

export function validatePreOrderCampaign(campaign) {
  if (!campaign || !String(campaign.title || '').trim() || !String(campaign.description || '').trim() || !String(campaign.genre || '').trim()) return 'fillRequired'
  const open = khDateTimeToEpoch(campaign.open_at)
  const close = khDateTimeToEpoch(campaign.close_at)
  const shipping = khDateTimeToEpoch(campaign.expected_ship_at)
  if (![open, close, shipping].every(Number.isFinite) || open >= close || shipping < close) return 'datesInvalid'
  if (!Array.isArray(campaign.books) || campaign.books.length < 1 || campaign.books.length > AUTHOR_PRE_ORDER_MAX_BOOKS) return 'fillRequired'
  for (const book of campaign.books) {
    if (!String(book.title || '').trim()) return 'fillRequired'
    const editions = [book.editions?.standard, book.editions?.limited].filter(edition => edition?.enabled)
    if (!editions.length) return 'validEdition'
    for (const edition of editions) {
      const price = Number(edition.price_usd)
      const quota = Number(edition.quota)
      if (!String(edition.price_usd ?? '').trim() || !Number.isFinite(price) || price <= 0 || !String(edition.quota ?? '').trim() || !Number.isSafeInteger(quota) || quota < 1) return 'validEdition'
    }
  }
  if (campaign.signature_enabled && (!Number.isFinite(Number(campaign.signature_fee_usd)) || Number(campaign.signature_fee_usd) < 0)) return 'fillRequired'
  if (!Array.isArray(campaign.delivery_company_keys) || !campaign.delivery_company_keys.length) return 'fillRequired'
  return ''
}

export function preOrderCampaignPayload(campaign) {
  const dateValue = value => { const epoch = khDateTimeToEpoch(value); return Number.isFinite(epoch) ? new Date(epoch).toISOString() : null }
  return {
    title: String(campaign.title || '').trim(),
    description: String(campaign.description || '').trim(),
    genre: String(campaign.genre || '').trim(),
    author_note: String(campaign.author_note || '').trim(),
    banner_url: String(campaign.banner_url || ''),
    open_at: campaign.open_at ? dateValue(campaign.open_at) : null,
    close_at: campaign.close_at ? dateValue(campaign.close_at) : null,
    expected_ship_at: campaign.expected_ship_at ? dateValue(campaign.expected_ship_at) : null,
    signature_enabled: Boolean(campaign.signature_enabled),
    signature_fee_usd: Number(campaign.signature_fee_usd || 0),
    signature_note: String(campaign.signature_note || '').trim(),
    delivery_company_keys: [...new Set(campaign.delivery_company_keys || [])].filter(item => ['jnt', 'vet'].includes(item)),
    delivery_note: String(campaign.delivery_note || '').trim(),
    buyer_note_instruction: String(campaign.buyer_note_instruction || '').trim(),
    books: (campaign.books || []).map(book => ({
      ...(book.id ? { id: book.id } : {}),
      title: String(book.title || '').trim(),
      cover_url: String(book.cover_url || ''),
      editions: {
        standard: { enabled: Boolean(book.editions?.standard?.enabled), price_usd: Number(book.editions?.standard?.price_usd || 0), quota: Number(book.editions?.standard?.quota || 0) },
        limited: { enabled: Boolean(book.editions?.limited?.enabled), price_usd: Number(book.editions?.limited?.price_usd || 0), quota: Number(book.editions?.limited?.quota || 0) },
      },
    })),
  }
}
