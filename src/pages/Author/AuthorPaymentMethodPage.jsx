import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPaymentMethod', {
  en: {
    back: 'Back',
    paymentMethod: 'Payment Method',
    autoPayoutSetup: 'Auto payout setup',
    bankQr: 'Bank QR',
    bankQrSubtitle: 'Recommended for Cambodia payouts',
    recommended: 'Recommended',
    paypal: 'PayPal',
    paypalSubtitle: 'PayPal transfer fees may apply',
    payFee: 'Pay fee',
    phoneNumber: 'Phone Number',
    phoneSubtitle: 'Wing or other phone payout providers',
    currentMethod: 'Current Method',
    paymentMissing: 'Payment method missing',
    paymentMissingBody: 'Add your payment details so admin can process your automatic monthly payout.',
    noAccountName: 'No account name',
    noExtraDetail: 'No extra detail',
    viewDetails: 'View Details',
    chooseImage: 'Please choose an image file.',
    uploadQrCode: 'Upload QR Code',
    uploadQrBody: 'Upload your bank QR image for payout verification.',
    bankQrPreview: 'Bank QR preview',
    changeQr: 'Change QR',
    uploadQrImage: 'Upload QR image',
    imageFormats: 'PNG, JPG, WEBP, or GIF · Max 2 MB',
    removeImage: 'Remove image',
    important: 'Important',
    importantBody: 'Make sure your name and payment account are correct. If payment information is missing or incorrect, your payout can be delayed or marked as failed by admin.',
    chooseMethod: 'Choose Method',
    fillDetails: 'Fill Details',
    saveDone: 'Save & Done',
    paymentDetails: 'Payment Details',
    loadFailed: 'Failed to load payment methods',
    saveFailed: 'Failed to save payment method',
    saved: 'Payment method saved successfully.',
    choosePayout: 'Choose payout method',
    choosePayoutBody: 'Choose one method first. Then fill in the required payout details.',
    accountHolderName: 'Account Holder Name',
    accountHolderExample: 'Example: KEO DARIYA',
    bankName: 'Bank Name',
    bankExample: 'Example: ABA, ACLEDA, Wing Bank',
    bankNote1: 'Account name must match your real bank account and the QR image should be clear and active.',
    bankNote2: 'Payments will be sent to this account automatically after admin payout processing.',
    paypalEmail: 'PayPal Email',
    emailPlaceholder: 'name@example.com',
    paypalAccountName: 'Your PayPal account name',
    importantNotes: 'Important Notes',
    paypalNote1: 'PayPal transfer fees may apply depending on country, currency, and transfer type.',
    paypalNote2: 'Make sure your PayPal email can receive payments before saving.',
    paypalNote3: 'Shadow author payouts are recorded in USD.',
    provider: 'Provider',
    providerPlaceholder: 'Wing, Other',
    phonePlaceholder: 'Example: 012 345 678',
    accountNamePlaceholder: 'Name on the account',
    phoneNote1: 'Phone number payouts may have handling fees depending on the provider.',
    phoneNote2: 'Bank QR is recommended when it is available for your account.',
    saving: 'Saving...',
    saveContinue: 'Save & Continue',
    backToMethods: 'Back to payout methods',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    paymentMethod: 'វិធីទទួលប្រាក់',
    autoPayoutSetup: 'ការកំណត់បង់ប្រាក់ស្វ័យប្រវត្តិ',
    bankQr: 'Bank QR',
    bankQrSubtitle: 'ណែនាំសម្រាប់ការទទួលប្រាក់នៅកម្ពុជា',
    recommended: 'បានណែនាំ',
    paypal: 'PayPal',
    paypalSubtitle: 'អាចមានថ្លៃសេវាផ្ទេរ PayPal',
    payFee: 'មានថ្លៃសេវា',
    phoneNumber: 'លេខទូរស័ព្ទ',
    phoneSubtitle: 'Wing ឬសេវាទទួលប្រាក់តាមទូរស័ព្ទផ្សេងទៀត',
    currentMethod: 'វិធីបច្ចុប្បន្ន',
    paymentMissing: 'មិនទាន់មានវិធីទទួលប្រាក់',
    paymentMissingBody: 'បន្ថែមព័ត៌មានទទួលប្រាក់ ដើម្បីឱ្យ Admin អាចដំណើរការការបង់ប្រាក់ប្រចាំខែដោយស្វ័យប្រវត្តិ។',
    noAccountName: 'មិនមានឈ្មោះគណនី',
    noExtraDetail: 'មិនមានព័ត៌មានបន្ថែម',
    viewDetails: 'មើលព័ត៌មានលម្អិត',
    chooseImage: 'សូមជ្រើសរូបភាព។',
    uploadQrCode: 'បញ្ចូល QR Code',
    uploadQrBody: 'បញ្ចូលរូប Bank QR របស់អ្នកសម្រាប់ផ្ទៀងផ្ទាត់ការទទួលប្រាក់។',
    bankQrPreview: 'មើល Bank QR ជាមុន',
    changeQr: 'ប្តូរ QR',
    uploadQrImage: 'បញ្ចូលរូប QR',
    imageFormats: 'PNG, JPG, WEBP ឬ GIF · អតិបរមា 2 MB',
    removeImage: 'លុបរូប',
    important: 'សំខាន់',
    importantBody: 'សូមប្រាកដថាឈ្មោះ និងគណនីទទួលប្រាក់របស់អ្នកត្រឹមត្រូវ។ បើព័ត៌មានខ្វះ ឬមិនត្រឹមត្រូវ ការបង់ប្រាក់អាចយឺត ឬត្រូវបាន Admin សម្គាល់ថាបរាជ័យ។',
    chooseMethod: 'ជ្រើសវិធី',
    fillDetails: 'បំពេញព័ត៌មាន',
    saveDone: 'រក្សាទុក និងរួចរាល់',
    paymentDetails: 'ព័ត៌មានទទួលប្រាក់',
    loadFailed: 'មិនអាចផ្ទុកវិធីទទួលប្រាក់បានទេ',
    saveFailed: 'មិនអាចរក្សាទុកវិធីទទួលប្រាក់បានទេ',
    saved: 'បានរក្សាទុកវិធីទទួលប្រាក់ដោយជោគជ័យ។',
    choosePayout: 'ជ្រើសវិធីទទួលប្រាក់',
    choosePayoutBody: 'ជ្រើសវិធីមួយជាមុន បន្ទាប់មកបំពេញព័ត៌មានដែលត្រូវការ។',
    accountHolderName: 'ឈ្មោះម្ចាស់គណនី',
    accountHolderExample: 'ឧទាហរណ៍៖ KEO DARIYA',
    bankName: 'ឈ្មោះធនាគារ',
    bankExample: 'ឧទាហរណ៍៖ ABA, ACLEDA, Wing Bank',
    bankNote1: 'ឈ្មោះគណនីត្រូវតែដូចនឹងគណនីធនាគារពិត ហើយរូប QR ត្រូវច្បាស់ និងអាចប្រើបាន។',
    bankNote2: 'ប្រាក់នឹងត្រូវផ្ញើទៅគណនីនេះដោយស្វ័យប្រវត្តិ បន្ទាប់ពី Admin ដំណើរការការបង់ប្រាក់។',
    paypalEmail: 'អ៊ីមែល PayPal',
    emailPlaceholder: 'name@example.com',
    paypalAccountName: 'ឈ្មោះគណនី PayPal របស់អ្នក',
    importantNotes: 'ចំណាំសំខាន់',
    paypalNote1: 'ថ្លៃសេវាផ្ទេរ PayPal អាចមាន អាស្រ័យលើប្រទេស រូបិយប័ណ្ណ និងប្រភេទផ្ទេរ។',
    paypalNote2: 'សូមប្រាកដថាអ៊ីមែល PayPal របស់អ្នកអាចទទួលប្រាក់បាន មុនរក្សាទុក។',
    paypalNote3: 'ការបង់ប្រាក់អ្នកនិពន្ធ Shadow ត្រូវបានកត់ត្រាជា USD។',
    provider: 'អ្នកផ្តល់សេវា',
    providerPlaceholder: 'Wing, ផ្សេងទៀត',
    phonePlaceholder: 'ឧទាហរណ៍៖ 012 345 678',
    accountNamePlaceholder: 'ឈ្មោះលើគណនី',
    phoneNote1: 'ការទទួលប្រាក់តាមលេខទូរស័ព្ទអាចមានថ្លៃសេវា អាស្រ័យលើអ្នកផ្តល់សេវា។',
    phoneNote2: 'Bank QR ត្រូវបានណែនាំ ប្រសិនបើគណនីរបស់អ្នកអាចប្រើបាន។',
    saving: 'កំពុងរក្សាទុក...',
    saveContinue: 'រក្សាទុក និងបន្ត',
    backToMethods: 'ត្រឡប់ទៅវិធីទទួលប្រាក់',
  },
  zh: {
    back: '返回',
    paymentMethod: '收款方式',
    autoPayoutSetup: '自动付款设置',
    bankQr: '银行二维码',
    bankQrSubtitle: '推荐用于柬埔寨收款',
    recommended: '推荐',
    paypal: 'PayPal',
    paypalSubtitle: '可能产生 PayPal 转账费用',
    payFee: '可能收费',
    phoneNumber: '手机号',
    phoneSubtitle: 'Wing 或其他手机号收款服务',
    currentMethod: '当前方式',
    paymentMissing: '尚未设置收款方式',
    paymentMissingBody: '添加收款信息，以便管理员处理每月自动付款。',
    noAccountName: '无账户名称',
    noExtraDetail: '无其他信息',
    viewDetails: '查看详情',
    chooseImage: '请选择图片文件。',
    uploadQrCode: '上传二维码',
    uploadQrBody: '上传银行二维码图片用于收款验证。',
    bankQrPreview: '银行二维码预览',
    changeQr: '更换二维码',
    uploadQrImage: '上传二维码图片',
    imageFormats: 'PNG、JPG、WEBP 或 GIF · 最大 2 MB',
    removeImage: '删除图片',
    important: '重要',
    importantBody: '请确保姓名和收款账户正确。若信息缺失或错误，付款可能延迟或被管理员标记为失败。',
    chooseMethod: '选择方式',
    fillDetails: '填写信息',
    saveDone: '保存并完成',
    paymentDetails: '收款信息',
    loadFailed: '无法加载收款方式',
    saveFailed: '无法保存收款方式',
    saved: '收款方式保存成功。',
    choosePayout: '选择收款方式',
    choosePayoutBody: '先选择一种方式，然后填写所需的收款信息。',
    accountHolderName: '账户持有人姓名',
    accountHolderExample: '示例：KEO DARIYA',
    bankName: '银行名称',
    bankExample: '示例：ABA、ACLEDA、Wing Bank',
    bankNote1: '账户姓名必须与真实银行账户一致，二维码图片应清晰且有效。',
    bankNote2: '管理员处理付款后，款项会自动发送到此账户。',
    paypalEmail: 'PayPal 邮箱',
    emailPlaceholder: 'name@example.com',
    paypalAccountName: '你的 PayPal 账户姓名',
    importantNotes: '重要说明',
    paypalNote1: 'PayPal 转账费用可能因国家、货币和转账类型而异。',
    paypalNote2: '保存前请确认你的 PayPal 邮箱可以接收付款。',
    paypalNote3: 'Shadow 作者付款以 USD 记录。',
    provider: '服务商',
    providerPlaceholder: 'Wing、其他',
    phonePlaceholder: '示例：012 345 678',
    accountNamePlaceholder: '账户上的姓名',
    phoneNote1: '手机号收款可能会根据服务商收取处理费。',
    phoneNote2: '如果你的账户支持，建议使用银行二维码。',
    saving: '保存中...',
    saveContinue: '保存并继续',
    backToMethods: '返回收款方式',
  },
  ja: {
    back: '戻る',
    paymentMethod: '受取方法',
    autoPayoutSetup: '自動支払い設定',
    bankQr: '銀行QR',
    bankQrSubtitle: 'カンボジアでの受取におすすめ',
    recommended: 'おすすめ',
    paypal: 'PayPal',
    paypalSubtitle: 'PayPal の送金手数料がかかる場合があります',
    payFee: '手数料あり',
    phoneNumber: '電話番号',
    phoneSubtitle: 'Wing などの電話番号受取サービス',
    currentMethod: '現在の方法',
    paymentMissing: '受取方法が未設定です',
    paymentMissingBody: '管理者が月次自動支払いを処理できるよう、受取情報を追加してください。',
    noAccountName: 'アカウント名なし',
    noExtraDetail: '追加情報なし',
    viewDetails: '詳細を見る',
    chooseImage: '画像ファイルを選択してください。',
    uploadQrCode: 'QRコードをアップロード',
    uploadQrBody: '受取確認用に銀行QR画像をアップロードしてください。',
    bankQrPreview: '銀行QRプレビュー',
    changeQr: 'QRを変更',
    uploadQrImage: 'QR画像をアップロード',
    imageFormats: 'PNG、JPG、WEBP、GIF · 最大2 MB',
    removeImage: '画像を削除',
    important: '重要',
    importantBody: '氏名と受取口座が正しいことを確認してください。情報が不足または誤っていると、支払いが遅れたり失敗として処理される場合があります。',
    chooseMethod: '方法を選択',
    fillDetails: '情報を入力',
    saveDone: '保存して完了',
    paymentDetails: '受取情報',
    loadFailed: '受取方法を読み込めませんでした',
    saveFailed: '受取方法を保存できませんでした',
    saved: '受取方法を保存しました。',
    choosePayout: '受取方法を選択',
    choosePayoutBody: 'まず1つの方法を選び、必要な受取情報を入力してください。',
    accountHolderName: '口座名義',
    accountHolderExample: '例：KEO DARIYA',
    bankName: '銀行名',
    bankExample: '例：ABA、ACLEDA、Wing Bank',
    bankNote1: '口座名義は実際の銀行口座と一致し、QR画像は鮮明で有効である必要があります。',
    bankNote2: '管理者の支払い処理後、この口座へ自動的に送金されます。',
    paypalEmail: 'PayPal メール',
    emailPlaceholder: 'name@example.com',
    paypalAccountName: 'PayPal アカウント名',
    importantNotes: '重要事項',
    paypalNote1: '国、通貨、送金方法によって PayPal の手数料がかかる場合があります。',
    paypalNote2: '保存前に PayPal メールで支払いを受け取れることを確認してください。',
    paypalNote3: 'Shadow の作者支払いは USD で記録されます。',
    provider: 'サービス提供者',
    providerPlaceholder: 'Wing、その他',
    phonePlaceholder: '例：012 345 678',
    accountNamePlaceholder: '口座上の名前',
    phoneNote1: '電話番号受取では、サービス提供者によって手数料がかかる場合があります。',
    phoneNote2: '利用可能な場合は銀行QRをおすすめします。',
    saving: '保存中...',
    saveContinue: '保存して続行',
    backToMethods: '受取方法へ戻る',
  },
  ko: {
    back: '뒤로',
    paymentMethod: '지급 방법',
    autoPayoutSetup: '자동 지급 설정',
    bankQr: '은행 QR',
    bankQrSubtitle: '캄보디아 지급에 권장',
    recommended: '권장',
    paypal: 'PayPal',
    paypalSubtitle: 'PayPal 송금 수수료가 발생할 수 있음',
    payFee: '수수료 있음',
    phoneNumber: '전화번호',
    phoneSubtitle: 'Wing 또는 기타 전화번호 지급 서비스',
    currentMethod: '현재 방법',
    paymentMissing: '지급 방법이 없습니다',
    paymentMissingBody: '관리자가 월 자동 지급을 처리할 수 있도록 지급 정보를 추가하세요.',
    noAccountName: '계정 이름 없음',
    noExtraDetail: '추가 정보 없음',
    viewDetails: '상세 보기',
    chooseImage: '이미지 파일을 선택하세요.',
    uploadQrCode: 'QR 코드 업로드',
    uploadQrBody: '지급 확인을 위해 은행 QR 이미지를 업로드하세요.',
    bankQrPreview: '은행 QR 미리보기',
    changeQr: 'QR 변경',
    uploadQrImage: 'QR 이미지 업로드',
    imageFormats: 'PNG, JPG, WEBP 또는 GIF · 최대 2 MB',
    removeImage: '이미지 삭제',
    important: '중요',
    importantBody: '이름과 지급 계정이 정확한지 확인하세요. 정보가 없거나 잘못되면 지급이 지연되거나 관리자가 실패로 처리할 수 있습니다.',
    chooseMethod: '방법 선택',
    fillDetails: '정보 입력',
    saveDone: '저장 및 완료',
    paymentDetails: '지급 정보',
    loadFailed: '지급 방법을 불러오지 못했습니다',
    saveFailed: '지급 방법을 저장하지 못했습니다',
    saved: '지급 방법을 저장했습니다.',
    choosePayout: '지급 방법 선택',
    choosePayoutBody: '먼저 한 가지 방법을 선택한 뒤 필요한 지급 정보를 입력하세요.',
    accountHolderName: '계정 소유자 이름',
    accountHolderExample: '예: KEO DARIYA',
    bankName: '은행 이름',
    bankExample: '예: ABA, ACLEDA, Wing Bank',
    bankNote1: '계정 이름은 실제 은행 계정과 일치해야 하며 QR 이미지는 선명하고 유효해야 합니다.',
    bankNote2: '관리자 지급 처리 후 이 계정으로 자동 송금됩니다.',
    paypalEmail: 'PayPal 이메일',
    emailPlaceholder: 'name@example.com',
    paypalAccountName: 'PayPal 계정 이름',
    importantNotes: '중요 안내',
    paypalNote1: '국가, 통화 및 송금 유형에 따라 PayPal 수수료가 발생할 수 있습니다.',
    paypalNote2: '저장하기 전에 PayPal 이메일로 지급을 받을 수 있는지 확인하세요.',
    paypalNote3: 'Shadow 작가 지급은 USD로 기록됩니다.',
    provider: '서비스 제공자',
    providerPlaceholder: 'Wing, 기타',
    phonePlaceholder: '예: 012 345 678',
    accountNamePlaceholder: '계정의 이름',
    phoneNote1: '전화번호 지급은 서비스 제공자에 따라 처리 수수료가 발생할 수 있습니다.',
    phoneNote2: '계정에서 사용할 수 있다면 은행 QR을 권장합니다.',
    saving: '저장 중...',
    saveContinue: '저장 후 계속',
    backToMethods: '지급 방법으로 돌아가기',
  },
})


const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const PAYMENT_MASCOT_IMAGES = [
  '/assets/Author Payment/author-payment-manga-girl.webp',
  '/assets/Author Income/author-income-manga-girl.webp',
  '/assets/Author Benefits/author-benefits-manga-girl.webp',
  '/assets/Author/quest-manga-girl.webp',
]

const METHOD_OPTIONS = [
  {
    key: 'bank_qr',
    title: 'Bank QR',
    titleKey: 'bankQr',
    subtitleKey: 'bankQrSubtitle',
    icon: 'fa-solid fa-qrcode',
    badgeKey: 'recommended',
    tone: 'purple',
  },
  {
    key: 'paypal',
    title: 'PayPal',
    titleKey: 'paypal',
    subtitleKey: 'paypalSubtitle',
    icon: 'fa-brands fa-paypal',
    badgeKey: 'payFee',
    tone: 'blue',
  },
  {
    key: 'phone',
    title: 'Phone Number',
    titleKey: 'phoneNumber',
    subtitleKey: 'phoneSubtitle',
    icon: 'fa-solid fa-mobile-screen',
    badgeKey: 'payFee',
    tone: 'pink',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadcf2] bg-[var(--shadow-bg-surface)] text-[#68498d] shadow-[0_5px_16px_rgba(85,59,117,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 w-[31px] border-r border-[#decfed] bg-[linear-gradient(180deg,#eee4ff_0%,#fbf7ff_100%)]">
      {[28, 72, 116, 160, 204, 248, 292, 336].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span className="block h-[12px] w-[12px] rounded-full border-2 border-[#9c72d4] bg-[var(--shadow-bg-surface)]" />
          <span className="absolute left-[7px] top-[4px] h-[3px] w-[12px] rounded-full bg-[#8e64c7]" />
        </div>
      ))}
    </div>
  )
}

function Tape({ className = '', blue = false }) {
  return (
    <div
      className={`pointer-events-none absolute h-6 w-[70px] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#b8d1ff]/75' : 'bg-[#f8bdd6]/75'
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

function MascotFallback({ small = false }) {
  return (
    <div
      className={`relative flex items-center justify-center ${
        small ? 'h-[82px] w-[82px]' : 'h-[172px] w-[172px]'
      }`}
    >
      <div
        className={`absolute rounded-full bg-[linear-gradient(145deg,#f7ddeb_0%,#e1d1ff_100%)] ${
          small ? 'h-[66px] w-[66px]' : 'h-[132px] w-[132px]'
        }`}
      />
      <div
        className={`relative flex items-center justify-center rounded-[30px] border-4 border-white bg-[#fff9fc] text-[#7853ad] shadow-[0_12px_25px_rgba(79,52,117,0.15)] ${
          small ? 'h-[56px] w-[56px]' : 'h-[105px] w-[105px]'
        }`}
      >
        <i className={`fa-solid fa-heart ${small ? 'text-[20px]' : 'text-[36px]'}`} />
        <span
          className={`absolute -top-3 left-[17%] rotate-[-18deg] rounded-full bg-[#fff9fc] ${
            small ? 'h-6 w-3' : 'h-10 w-5'
          }`}
        />
        <span
          className={`absolute -top-3 right-[17%] rotate-[18deg] rounded-full bg-[#fff9fc] ${
            small ? 'h-6 w-3' : 'h-10 w-5'
          }`}
        />
        <i className="fa-solid fa-star absolute -right-2 top-1 text-[13px] text-[#efb63d]" />
      </div>
    </div>
  )
}

function PaymentMascot({ small = false }) {
  const [index, setIndex] = useState(0)

  if (index >= PAYMENT_MASCOT_IMAGES.length) {
    return <MascotFallback small={small} />
  }

  return (
    <img
      src={PAYMENT_MASCOT_IMAGES[index]}
      alt=""
      onError={() => setIndex((current) => current + 1)}
      className={
        small
          ? 'h-[90px] w-[90px] object-contain drop-shadow-[0_9px_16px_rgba(79,52,117,0.16)]'
          : 'h-[188px] w-[188px] object-contain object-bottom drop-shadow-[0_14px_25px_rgba(79,52,117,0.19)] sm:h-[220px] sm:w-[220px]'
      }
    />
  )
}

function RibbonTitle({ children, tone = 'purple' }) {
  const tones = {
    purple: 'border-[#c5abe7] bg-[#e9ddff] text-[#684493]',
    pink: 'border-[#edbfd1] bg-[#ffe3ee] text-[#c45583]',
    blue: 'border-[#bfd0ef] bg-[#e5edff] text-[#526db4]',
    gold: 'border-[#ead28c] bg-[#fff1c3] text-[#a8730c]',
  }

  return (
    <div className="flex justify-center">
      <div
        className={`relative inline-flex min-h-9 items-center justify-center rounded-[11px] border px-5 py-2 text-center text-[14px] font-black shadow-sm ${
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon = 'fa-regular fa-user',
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[11.5px] font-black text-[var(--shadow-text-primary)]">{label}</div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[#9870c3]">
          <i className={`${icon} text-[13px]`} />
        </span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-[54px] w-full rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] pl-12 pr-4 text-[13.5px] font-semibold text-[var(--shadow-text-primary)] outline-none transition placeholder:text-[var(--shadow-placeholder)] focus:border-[#956dca] focus:shadow-[0_0_0_3px_rgba(149,109,202,0.09)]"
        />
      </div>
    </label>
  )
}

function MethodButton({ option, onClick }) {
  const { t } = useDisplayTranslation()
  const tones = {
    purple: {
      border: 'border-[#d2bee9]',
      box: 'bg-[#eee2ff] text-[#7450ad]',
      badge: 'bg-[#ffe3ed] text-[#c8517c]',
    },
    blue: {
      border: 'border-[#c8d6f1]',
      box: 'bg-[#e4edff] text-[#536fbd]',
      badge: 'bg-[#e9efff] text-[#526bb0]',
    },
    pink: {
      border: 'border-[#edc5d5]',
      box: 'bg-[#ffe1ec] text-[#d45e8d]',
      badge: 'bg-[#eee8ff] text-[#7558a7]',
    },
  }

  const style = tones[option.tone] || tones.purple

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[88px] w-full min-w-0 items-center gap-3 rounded-[22px] border ${style.border} bg-[var(--shadow-bg-surface)] p-3 text-left shadow-[0_5px_16px_rgba(77,54,102,0.05)] transition active:scale-[0.99]`}
    >
      <div
        className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[19px] border border-white/80 ${style.box}`}
      >
        <i className={`${option.icon} text-[22px]`} />
      </div>

      <div className="min-w-0 flex-1 pr-[62px]">
        <div className="line-clamp-1 text-[13.5px] font-black text-[var(--shadow-text-primary)]">
          {t(`authorPaymentMethod.${option.titleKey}`)}
        </div>
        <div className="mt-1 line-clamp-2 text-[10.5px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">
          {t(`authorPaymentMethod.${option.subtitleKey}`)}
        </div>
      </div>

      <span
        className={`absolute right-8 top-3 rounded-full px-2 py-1 text-[7.5px] font-black uppercase tracking-[0.03em] ${style.badge}`}
      >
        {t(`authorPaymentMethod.${option.badgeKey}`)}
      </span>

      <i className="fa-solid fa-chevron-right shrink-0 text-[10px] text-[#8c69b2]" />
    </button>
  )
}

function CurrentMethodCard({ method, onView }) {
  const { t } = useDisplayTranslation()

  if (!method) {
    return (
      <section
        className="relative overflow-hidden rounded-[29px] border border-[#cfbae9] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_13px_30px_rgba(87,61,118,0.09)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(113,85,146,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.035) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <SpiralBinding />
        <Sparkles className="absolute right-5 top-4" />

        <div className="relative pl-[34px]">
          <div className="inline-flex rounded-full bg-[#eadcff] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.09em] text-[#7551a8]">
            {t('authorPaymentMethod.currentMethod')}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#fff0c8] text-[#bd8514]">
              <i className="fa-solid fa-circle-exclamation text-[16px]" />
            </div>
            <div>
              <div className="text-[17px] font-black text-[var(--shadow-text-primary)]">
                {t('authorPaymentMethod.paymentMissing')}
              </div>
              <p className="mt-1 max-w-[410px] text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('authorPaymentMethod.paymentMissingBody')}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const label =
    method.method_type === 'bank_qr'
      ? t('authorPaymentMethod.bankQr')
      : method.method_type === 'paypal'
        ? t('authorPaymentMethod.paypal')
        : t('authorPaymentMethod.phoneNumber')

  const main =
    method.method_type === 'bank_qr'
      ? method.account_name
      : method.method_type === 'paypal'
        ? method.paypal_email
        : method.phone_number

  const sub =
    method.method_type === 'bank_qr'
      ? method.bank_name
      : method.method_type === 'paypal'
        ? method.paypal_name
        : method.phone_provider

  const methodIcon =
    method.method_type === 'bank_qr'
      ? 'fa-solid fa-qrcode'
      : method.method_type === 'paypal'
        ? 'fa-brands fa-paypal'
        : 'fa-solid fa-mobile-screen'

  return (
    <section
      className="relative overflow-hidden rounded-[29px] border border-[#cdb7ea] bg-[var(--shadow-bg-surface)] shadow-[0_14px_32px_rgba(87,61,118,0.1)]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(113,85,146,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.035) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <SpiralBinding />
      <Sparkles className="absolute right-5 top-4" />
      <Tape className="right-3 top-[82px] rotate-[7deg]" />

      <div className="relative min-h-[220px] pl-[46px] pr-3 pt-5">
        <div className="absolute bottom-0 right-[-14px] sm:right-5">
          <PaymentMascot />
        </div>

        <div className="relative z-10 max-w-[62%] sm:max-w-[55%]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#9c76cf] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.09em] text-white">
            <i className="fa-solid fa-star text-[7px] text-[#ffe181]" />
            {t('authorPaymentMethod.currentMethod')}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-[var(--shadow-bg-surface)] text-[#7651ad] shadow-sm">
              <i className={`${methodIcon} text-[15px]`} />
            </span>
            <div className="text-[23px] font-black tracking-[-0.04em] text-[var(--shadow-text-primary)]">
              {label}
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7bc989] text-white">
              <i className="fa-solid fa-check text-[8px]" />
            </span>
          </div>

          <div className="mt-3 line-clamp-1 text-[12px] font-black text-[var(--shadow-text-secondary)]">
            {main || t('authorPaymentMethod.noAccountName')}
          </div>
          <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
            {sub || t('authorPaymentMethod.noExtraDetail')}
          </div>

          <button
            type="button"
            onClick={onView}
            className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8259ba_0%,#a56ad0_100%)] px-4 text-[10px] font-black text-white shadow-[0_7px_15px_rgba(115,76,166,0.2)] active:scale-95"
          >
            {t('authorPaymentMethod.viewDetails')}
            <i className="fa-solid fa-star text-[7px] text-[#ffdf78]" />
          </button>
        </div>
      </div>
    </section>
  )
}

function ImageUpload({ value, onChange }) {
  const { t } = useDisplayTranslation()

  async function handleFile(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(t('authorPaymentMethod.chooseImage'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      onChange(String(reader.result || ''))
    }

    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="mb-2 text-[11.5px] font-black text-[var(--shadow-text-primary)]">
        {t('authorPaymentMethod.uploadQrCode')}
      </div>
      <p className="mb-3 text-[10.5px] font-semibold leading-5 text-[#8c7d96]">
        {t('authorPaymentMethod.uploadQrBody')}
      </p>

      <label className="relative flex min-h-[215px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-[#bfa8dd] bg-[var(--shadow-bg-surface)] px-4 py-5 text-center transition active:scale-[0.99]">
        <Tape className="-left-3 top-3 rotate-[-10deg]" />
        <Tape className="-right-3 bottom-4 rotate-[8deg]" blue />

        {value ? (
          <>
            <div className="rounded-[20px] border-4 border-[#eadcff] bg-[var(--shadow-bg-surface)] p-3 shadow-[0_8px_20px_rgba(93,62,131,0.1)]">
              <img
                src={value}
                alt={t('authorPaymentMethod.bankQrPreview')}
                className="max-h-[260px] max-w-full rounded-[12px] object-contain"
              />
            </div>
            <div className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-[#d2bee8] bg-[var(--shadow-bg-surface)] px-4 text-[10px] font-black text-[#72509f]">
              <i className="fa-solid fa-arrow-up-from-bracket text-[10px]" />
              {t('authorPaymentMethod.changeQr')}
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[25px] border border-[#d0b8e9] bg-[#eee2ff] text-[#7451ad] shadow-sm">
              <i className="fa-solid fa-qrcode text-[30px]" />
            </div>
            <div className="mt-3 text-[13px] font-black text-[var(--shadow-text-primary)]">
              {t('authorPaymentMethod.uploadQrImage')}
            </div>
            <div className="mt-1 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
              {t('authorPaymentMethod.imageFormats')}
            </div>
          </>
        )}

        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-black text-[#d25882]"
        >
          <i className="fa-solid fa-trash-can text-[9px]" />
          {t('authorPaymentMethod.removeImage')}
        </button>
      ) : null}
    </div>
  )
}

function ImportantCard() {
  const { t } = useDisplayTranslation()

  return (
    <section
      className="relative overflow-hidden rounded-[27px] border border-[#ead1ad] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_10px_26px_rgba(91,67,111,0.06)]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(189,137,68,0.035) 1px, transparent 1px)',
        backgroundSize: '100% 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[8deg]" />

      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-[#fff0c9] text-[#bb8212]">
          <i className="fa-solid fa-circle-info text-[15px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorPaymentMethod.important')}</div>
            <i className="fa-solid fa-star text-[8px] text-[#efb63d]" />
          </div>

          <p className="mt-2 text-[11px] font-semibold leading-5 text-[#81728a]">
            {t('authorPaymentMethod.importantBody')}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-4 right-1 opacity-90">
        <MascotFallback small />
      </div>
    </section>
  )
}

function FormStepHeader({ selectedMethod }) {
  const { t } = useDisplayTranslation()
  const option = METHOD_OPTIONS.find((item) => item.key === selectedMethod)

  return (
    <div className="mb-5">
      <div className="grid grid-cols-3 gap-2 rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-sm">
        {[
          [t('authorPaymentMethod.chooseMethod'), 'fa-solid fa-list-check'],
          [t('authorPaymentMethod.fillDetails'), 'fa-solid fa-pen-to-square'],
          [t('authorPaymentMethod.saveDone'), 'fa-solid fa-heart'],
        ].map(([label, icon], index) => (
          <div key={label} className="relative text-center">
            {index < 2 ? (
              <span className="absolute left-[58%] top-[18px] h-px w-[84%] bg-[#e4d5eb]" />
            ) : null}
            <div
              className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${
                index === 1
                  ? 'border-[#9065c4] bg-[#8a62bf] text-white'
                  : index === 0
                    ? 'border-[#b8d8bf] bg-[#edf9f0] text-[#57a36a]'
                    : 'border-[#e6d8ec] bg-[#faf6fc] text-[#b19cbc]'
              }`}
            >
              {index === 0 ? (
                <i className="fa-solid fa-check text-[10px]" />
              ) : (
                <i className={`${icon} text-[10px]`} />
              )}
            </div>
            <div
              className={`mt-2 text-[8.5px] font-black ${
                index === 1 ? 'text-[#67458e]' : 'text-[#a18da9]'
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <RibbonTitle
          tone={
            selectedMethod === 'paypal'
              ? 'blue'
              : selectedMethod === 'phone'
                ? 'pink'
                : 'purple'
          }
        >
          {option?.titleKey ? t(`authorPaymentMethod.${option.titleKey}`) : t('authorPaymentMethod.paymentDetails')}
        </RibbonTitle>
      </div>
    </div>
  )
}

function NoteCard({ children, tone = 'gold' }) {
  const tones = {
    gold: 'border-[#ead5a2] bg-[#fff9e9] text-[#9b711c]',
    pink: 'border-[#efcbd9] bg-[#fff6fa] text-[#b9587b]',
    blue: 'border-[#cbd8f0] bg-[#f5f8ff] text-[#5970ab]',
    purple: 'border-[#dac8e8] bg-[#faf6ff] text-[#76569a]',
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border p-3.5 text-[10.5px] font-semibold leading-5 ${
        tones[tone] || tones.gold
      }`}
    >
      <i className="fa-solid fa-heart mr-2 text-[9px] opacity-75" />
      {children}
      <i className="fa-solid fa-star absolute right-3 top-3 text-[8px] text-[#efb63d]" />
    </div>
  )
}

function LoadingPage() {
  return (
    <div className="space-y-4">
      <div className="h-[220px] animate-pulse rounded-[29px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[390px] animate-pulse rounded-[29px] bg-[var(--shadow-bg-surface)]" />
      <div className="h-[160px] animate-pulse rounded-[27px] bg-[var(--shadow-bg-surface)]" />
    </div>
  )
}

export default function AuthorPaymentMethodPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [searchParams] = useSearchParams()
  const backPath = searchParams.get('back') || '/author/income'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [methods, setMethods] = useState([])
  const [viewMode, setViewMode] = useState('list')
  const [selectedMethod, setSelectedMethod] = useState('')

  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [paypalName, setPaypalName] = useState('')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [phoneProvider, setPhoneProvider] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const primaryMethod = useMemo(() => {
    return (
      methods.find((method) => method.is_primary && method.status === 'active') ||
      methods[0] ||
      null
    )
  }, [methods])

  const selectedOption = METHOD_OPTIONS.find(
    (option) => option.key === selectedMethod
  )

  useEffect(() => {
    let ignore = false

    async function loadMethods() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(
          `${API_BASE_URL}/api/authors/me/payment-methods`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || t('authorPaymentMethod.loadFailed'))
        }

        if (!ignore) {
          const list = result.payment_methods || []
          setMethods(list)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || t('authorPaymentMethod.loadFailed'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadMethods()

    return () => {
      ignore = true
    }
  }, [navigate, t])

  function openMethod(methodType) {
    const old = methods.find(
      (method) =>
        method.method_type === methodType && method.status === 'active'
    )

    setSelectedMethod(methodType)
    setViewMode('form')
    setError('')
    setSuccess('')

    if (!old) {
      setBankName('')
      setAccountName('')
      setQrImageUrl('')
      setPaypalName('')
      setPaypalEmail('')
      setPhoneProvider('')
      setPhoneNumber('')
      return
    }

    setBankName(old.bank_name || '')
    setAccountName(old.account_name || '')
    setQrImageUrl(old.qr_image_url || '')
    setPaypalName(old.paypal_name || '')
    setPaypalEmail(old.paypal_email || '')
    setPhoneProvider(old.phone_provider || 'Wing')
    setPhoneNumber(old.phone_number || '')
  }

  function backToMethods() {
    setViewMode('list')
    setSelectedMethod('')
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      const body = {
        method_type: selectedMethod,
        display_name: selectedOption?.title || 'Payment Method',
        account_name: accountName,
        bank_name: bankName,
        qr_image_url: qrImageUrl,
        paypal_name: paypalName,
        paypal_email: paypalEmail,
        phone_provider: phoneProvider,
        phone_number: phoneNumber,
      }

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/payment-methods`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.ok === false) {
        throw new Error(result.message || t('authorPaymentMethod.saveFailed'))
      }

      setMethods((old) => [
        result.payment_method,
        ...old.map((method) => ({
          ...method,
          is_primary: false,
        })),
      ])
      setSuccess(t('authorPaymentMethod.saved'))
      setViewMode('list')
      setSelectedMethod('')
    } catch (err) {
      setError(err.message || t('authorPaymentMethod.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <div className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label={t('authorPaymentMethod.back')}
            onClick={() => {
              if (viewMode === 'form') {
                backToMethods()
                return
              }

              navigate(backPath, { replace: true })
            }}
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-[9px] text-[#efb73e]" />
              <h1 className="text-[18px] font-black tracking-[-0.035em] text-[var(--shadow-text-primary)]">
                {t('authorPaymentMethod.paymentMethod')}
              </h1>
              <i className="fa-solid fa-heart text-[9px] text-[#ed8fb5]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--shadow-text-tertiary)]">
              {t('authorPaymentMethod.autoPayoutSetup')}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e8fa] text-[#7452a2]">
            <i className="fa-solid fa-circle-info text-[12px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingPage /> : null}

        {!loading && viewMode === 'list' ? (
          <>
            <CurrentMethodCard
              method={primaryMethod}
              onView={() => {
                if (primaryMethod?.method_type) {
                  openMethod(primaryMethod.method_type)
                }
              }}
            />

            <section
              className="relative overflow-hidden rounded-[29px] border border-[#ddcfeb] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_11px_28px_rgba(86,61,118,0.07)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(113,85,146,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.03) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <Tape className="-right-4 top-3 rotate-[7deg]" />
              <Sparkles className="absolute left-4 top-4 opacity-70" />

              <div className="pt-1">
                <RibbonTitle tone="purple">{t('authorPaymentMethod.choosePayout')}</RibbonTitle>

                <p className="mx-auto mt-4 max-w-[500px] text-center text-[10.5px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                  {t('authorPaymentMethod.choosePayoutBody')}
                </p>
              </div>

              {success ? (
                <div className="mt-4 rounded-[19px] border border-[#c7e5ce] bg-[#f1fbf3] px-4 py-3 text-[11px] font-bold leading-5 text-[#458b58]">
                  <i className="fa-solid fa-circle-check mr-2 text-[10px]" />
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-[19px] border border-[#efcad7] bg-[#fff3f7] px-4 py-3 text-[11px] font-bold leading-5 text-[#c9577c]">
                  <i className="fa-solid fa-circle-exclamation mr-2 text-[10px]" />
                  {error}
                </div>
              ) : null}

              <div className="mt-4 grid gap-2.5">
                {METHOD_OPTIONS.map((option) => (
                  <MethodButton
                    key={option.key}
                    option={option}
                    onClick={() => openMethod(option.key)}
                  />
                ))}
              </div>
            </section>

            <ImportantCard />
          </>
        ) : null}

        {!loading && viewMode === 'form' ? (
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[29px] border border-[#d8c6e8] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_12px_30px_rgba(86,61,118,0.08)]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(113,85,146,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(113,85,146,0.03) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <Tape className="-right-4 top-3 rotate-[7deg]" />
            <Sparkles className="absolute left-4 top-4 opacity-70" />

            <FormStepHeader selectedMethod={selectedMethod} />

            <div className="space-y-4">
              {selectedMethod === 'bank_qr' ? (
                <>
                  <Field
                    label={t('authorPaymentMethod.accountHolderName')}
                    value={accountName}
                    onChange={setAccountName}
                    placeholder={t('authorPaymentMethod.accountHolderExample')}
                    icon="fa-regular fa-user"
                  />
                  <Field
                    label={t('authorPaymentMethod.bankName')}
                    value={bankName}
                    onChange={setBankName}
                    placeholder={t('authorPaymentMethod.bankExample')}
                    icon="fa-solid fa-building-columns"
                  />
                  <ImageUpload value={qrImageUrl} onChange={setQrImageUrl} />

                  <NoteCard tone="pink">
                    {t('authorPaymentMethod.bankNote1')}
                  </NoteCard>
                  <NoteCard tone="purple">
                    {t('authorPaymentMethod.bankNote2')}
                  </NoteCard>
                </>
              ) : null}

              {selectedMethod === 'paypal' ? (
                <>
                  <Field
                    label={t('authorPaymentMethod.paypalEmail')}
                    type="email"
                    value={paypalEmail}
                    onChange={setPaypalEmail}
                    placeholder={t('authorPaymentMethod.emailPlaceholder')}
                    icon="fa-regular fa-envelope"
                  />
                  <Field
                    label={t('authorPaymentMethod.accountHolderName')}
                    value={paypalName}
                    onChange={setPaypalName}
                    placeholder={t('authorPaymentMethod.paypalAccountName')}
                    icon="fa-regular fa-user"
                  />

                  <div className="mt-1">
                    <RibbonTitle tone="pink">{t('authorPaymentMethod.importantNotes')}</RibbonTitle>
                  </div>

                  <div className="space-y-2">
                    <NoteCard tone="pink">
                      {t('authorPaymentMethod.paypalNote1')}
                    </NoteCard>
                    <NoteCard tone="blue">
                      {t('authorPaymentMethod.paypalNote2')}
                    </NoteCard>
                    <NoteCard tone="purple">
                      {t('authorPaymentMethod.paypalNote3')}
                    </NoteCard>
                  </div>

                  <div className="flex justify-end">
                    <PaymentMascot small />
                  </div>
                </>
              ) : null}

              {selectedMethod === 'phone' ? (
                <>
                  <Field
                    label={t('authorPaymentMethod.provider')}
                    value={phoneProvider}
                    onChange={setPhoneProvider}
                    placeholder={t('authorPaymentMethod.providerPlaceholder')}
                    icon="fa-solid fa-building"
                  />
                  <Field
                    label={t('authorPaymentMethod.phoneNumber')}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder={t('authorPaymentMethod.phonePlaceholder')}
                    icon="fa-solid fa-mobile-screen"
                  />
                  <Field
                    label={t('authorPaymentMethod.accountHolderName')}
                    value={accountName}
                    onChange={setAccountName}
                    placeholder={t('authorPaymentMethod.accountNamePlaceholder')}
                    icon="fa-regular fa-user"
                  />

                  <div className="mt-1">
                    <RibbonTitle tone="pink">{t('authorPaymentMethod.importantNotes')}</RibbonTitle>
                  </div>

                  <NoteCard tone="pink">
                    {t('authorPaymentMethod.phoneNote1')}
                  </NoteCard>
                  <NoteCard tone="gold">
                    {t('authorPaymentMethod.phoneNote2')}
                  </NoteCard>
                </>
              ) : null}

              {error ? (
                <div className="rounded-[19px] border border-[#efcad7] bg-[#fff3f7] px-4 py-3 text-[11px] font-bold leading-5 text-[#c9577c]">
                  <i className="fa-solid fa-circle-exclamation mr-2 text-[10px]" />
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[#7f55b4] bg-[linear-gradient(90deg,#8058b8_0%,#a568d0_100%)] text-[13px] font-black text-white shadow-[0_9px_20px_rgba(109,72,155,0.22)] transition active:scale-[0.99] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-[11px]" />
                    {t('authorPaymentMethod.saving')}
                  </>
                ) : (
                  <>
                    {t('authorPaymentMethod.saveContinue')}
                    <i className="fa-solid fa-star text-[9px] text-[#ffdf79]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={backToMethods}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-[10.5px] font-black text-[#8263a0] active:scale-[0.99]"
              >
                <i className="fa-solid fa-chevron-left text-[8px]" />
                {t('authorPaymentMethod.backToMethods')}
              </button>
            </div>
          </form>
        ) : null}
      </main>
    </div>
  )
}
