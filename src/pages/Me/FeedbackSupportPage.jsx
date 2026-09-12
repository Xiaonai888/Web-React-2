import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  CircleCheck,
  CircleUserRound,
  Clock3,
  FileText,
  ImagePlus,
  LoaderCircle,
  PenLine,
  ShoppingBag,
  WalletCards,
  Wrench,
  X,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('feedbackSupportPage', {
  en: { technicalTitle: 'Technical Problem', technicalDesc: 'App errors, slow loading, images, or notifications.', accountTitle: 'Account & Profile', accountDesc: 'Login, password, profile, or account access.', readingTitle: 'Reading & Library', readingDesc: 'Stories, episodes, saved posts, or your Library.', walletTitle: 'Wallet & Payments', walletDesc: 'Diamonds, purchases, payment, or transaction issues.', authorTitle: 'Authors & Publishing', authorDesc: 'Author Page, stories, publishing, or earnings.', mallTitle: 'Shadow Mall & Orders', mallDesc: 'Products, orders, sellers, or purchased files.', submitted: 'Submitted', inReview: 'In Review', resolved: 'Resolved', closed: 'Closed', topic: 'Topic', details: 'Details', review: 'Review', checkHelp: 'Check Help Center first', helpText: 'Find common answers and get help faster.', browseHelp: 'Browse Help', closeRequests: 'Close requests', backRequests: 'Back to requests', requestDetails: 'Request Details', myRequests: 'My Support Requests', trackUpdates: 'Track updates from Shadow support.', close: 'Close', submittedAt: 'Submitted {{date}}', subject: 'Subject', description: 'Description', screenshot: 'Screenshot', shadowSupport: 'Shadow Support', waitingReply: 'Your request is waiting for a reply from Shadow Support.', sendAnother: 'Send another request', noRequests: 'No support requests', noRequestsText: 'Your submitted requests will appear here.', sendRequest: 'Send a request', chooseImage: 'Please choose an image file.', screenshotSize: 'Screenshot must be 2 MB or smaller.', subjectRequired: 'Please enter a clear subject.', descriptionRequired: 'Please describe the problem in at least 10 characters.', submitFailed: 'Failed to submit support request.', loadRequestsFailed: 'Failed to load requests.', loadDetailFailed: 'Failed to load request details.', requestSubmitted: 'Request submitted', requestSubmittedText: 'Your support request was received. You can check its status from My Support Requests.', viewMyRequests: 'View My Requests', back: 'Back', contactSupport: 'Contact Support', chooseTopic: 'Choose a topic', routeText: 'We’ll help route your request.', tellMore: 'Tell us more', shortSummary: 'Short summary of the problem', describePlaceholder: 'Describe what happened and what you expected...', optional2MB: 'Optional · Max 2 MB', screenshotPreview: 'Screenshot preview', removeScreenshot: 'Remove screenshot', addScreenshot: 'Add Screenshot', continueReview: 'Continue to Review', reviewRequest: 'Review your request', reviewText: 'Check the details before submitting.', attachedScreenshot: 'Attached screenshot', privacyText: 'Your request and attachment are private and visible only to Shadow support administrators.', edit: 'Edit', submitting: 'Submitting...', submitRequest: 'Submit Request', viewSupportRequests: 'View my support requests' },
  km: { technicalTitle: 'បញ្ហាបច្ចេកទេស', technicalDesc: 'កំហុសកម្មវិធី ផ្ទុកយឺត រូបភាព ឬការជូនដំណឹង។', accountTitle: 'គណនី និង Profile', accountDesc: 'Login ពាក្យសម្ងាត់ Profile ឬការចូលប្រើគណនី។', readingTitle: 'ការអាន និង Library', readingDesc: 'រឿង ភាគ Saved posts ឬ Library របស់អ្នក។', walletTitle: 'Wallet និងការទូទាត់', walletDesc: 'Diamonds ការទិញ ការទូទាត់ ឬបញ្ហាប្រតិបត្តិការ។', authorTitle: 'អ្នកនិពន្ធ និងការបោះពុម្ព', authorDesc: 'Author Page រឿង ការបោះពុម្ព ឬចំណូល។', mallTitle: 'Shadow Mall និងការបញ្ជាទិញ', mallDesc: 'ផលិតផល ការបញ្ជាទិញ អ្នកលក់ ឬឯកសារដែលបានទិញ។', submitted: 'បានដាក់ស្នើ', inReview: 'កំពុងពិនិត្យ', resolved: 'បានដោះស្រាយ', closed: 'បានបិទ', topic: 'ប្រធានបទ', details: 'ព័ត៌មានលម្អិត', review: 'ពិនិត្យ', checkHelp: 'ពិនិត្យមជ្ឈមណ្ឌលជំនួយជាមុន', helpText: 'ស្វែងរកចម្លើយទូទៅ និងទទួលជំនួយបានលឿនជាងមុន។', browseHelp: 'មើលជំនួយ', closeRequests: 'បិទសំណើ', backRequests: 'ត្រឡប់ទៅសំណើ', requestDetails: 'ព័ត៌មានលម្អិតសំណើ', myRequests: 'សំណើជំនួយរបស់ខ្ញុំ', trackUpdates: 'តាមដាន Update ពីក្រុមជំនួយ Shadow។', close: 'បិទ', submittedAt: 'បានដាក់ស្នើ {{date}}', subject: 'ប្រធានបទខ្លី', description: 'ការពិពណ៌នា', screenshot: 'រូប Screenshot', shadowSupport: 'ក្រុមជំនួយ Shadow', waitingReply: 'សំណើរបស់អ្នកកំពុងរង់ចាំចម្លើយពីក្រុមជំនួយ Shadow។', sendAnother: 'ផ្ញើសំណើមួយទៀត', noRequests: 'មិនមានសំណើជំនួយ', noRequestsText: 'សំណើដែលអ្នកបានដាក់នឹងបង្ហាញនៅទីនេះ។', sendRequest: 'ផ្ញើសំណើ', chooseImage: 'សូមជ្រើសឯកសាររូបភាព។', screenshotSize: 'Screenshot ត្រូវមានទំហំ 2 MB ឬតិចជាងនេះ។', subjectRequired: 'សូមបញ្ចូលប្រធានបទឱ្យច្បាស់។', descriptionRequired: 'សូមពិពណ៌នាបញ្ហាយ៉ាងហោចណាស់ 10 តួអក្សរ។', submitFailed: 'មិនអាចផ្ញើសំណើជំនួយបានទេ។', loadRequestsFailed: 'មិនអាចផ្ទុកសំណើបានទេ។', loadDetailFailed: 'មិនអាចផ្ទុកព័ត៌មានសំណើបានទេ។', requestSubmitted: 'បានផ្ញើសំណើ', requestSubmittedText: 'យើងបានទទួលសំណើជំនួយរបស់អ្នក។ អ្នកអាចមើលស្ថានភាពនៅក្នុង សំណើជំនួយរបស់ខ្ញុំ។', viewMyRequests: 'មើលសំណើរបស់ខ្ញុំ', back: 'ត្រឡប់ក្រោយ', contactSupport: 'ទាក់ទងផ្នែកជំនួយ', chooseTopic: 'ជ្រើសប្រធានបទ', routeText: 'យើងនឹងបញ្ជូនសំណើរបស់អ្នកទៅកន្លែងត្រឹមត្រូវ។', tellMore: 'ប្រាប់យើងបន្ថែម', shortSummary: 'សង្ខេបបញ្ហាខ្លីៗ', describePlaceholder: 'ពិពណ៌នាអ្វីដែលបានកើតឡើង និងអ្វីដែលអ្នករំពឹង...', optional2MB: 'មិនចាំបាច់ · អតិបរមា 2 MB', screenshotPreview: 'មើល Screenshot ជាមុន', removeScreenshot: 'ដក Screenshot', addScreenshot: 'បន្ថែម Screenshot', continueReview: 'បន្តទៅពិនិត្យ', reviewRequest: 'ពិនិត្យសំណើរបស់អ្នក', reviewText: 'ពិនិត្យព័ត៌មានមុនពេលផ្ញើ។', attachedScreenshot: 'Screenshot ដែលភ្ជាប់', privacyText: 'សំណើ និងឯកសារភ្ជាប់របស់អ្នកជាឯកជន ហើយអាចមើលឃើញតែក្រុមគ្រប់គ្រងជំនួយ Shadow ប៉ុណ្ណោះ។', edit: 'កែ', submitting: 'កំពុងផ្ញើ...', submitRequest: 'ផ្ញើសំណើ', viewSupportRequests: 'មើលសំណើជំនួយរបស់ខ្ញុំ' },
  zh: { technicalTitle: '技术问题', technicalDesc: '应用错误、加载缓慢、图片或通知问题。', accountTitle: '账号与资料', accountDesc: '登录、密码、资料或账号访问。', readingTitle: '阅读与书库', readingDesc: '故事、章节、已保存帖子或你的书库。', walletTitle: '钱包与付款', walletDesc: 'Diamonds、购买、付款或交易问题。', authorTitle: '作者与发布', authorDesc: 'Author Page、故事、发布或收益。', mallTitle: 'Shadow Mall 与订单', mallDesc: '商品、订单、卖家或已购买文件。', submitted: '已提交', inReview: '审核中', resolved: '已解决', closed: '已关闭', topic: '主题', details: '详情', review: '检查', checkHelp: '先查看帮助中心', helpText: '查找常见答案，更快获得帮助。', browseHelp: '浏览帮助', closeRequests: '关闭请求', backRequests: '返回请求列表', requestDetails: '请求详情', myRequests: '我的支持请求', trackUpdates: '查看 Shadow 支持的更新。', close: '关闭', submittedAt: '提交于 {{date}}', subject: '主题', description: '描述', screenshot: '截图', shadowSupport: 'Shadow 支持', waitingReply: '你的请求正在等待 Shadow 支持回复。', sendAnother: '再发送一个请求', noRequests: '暂无支持请求', noRequestsText: '你提交的请求会显示在这里。', sendRequest: '发送请求', chooseImage: '请选择图片文件。', screenshotSize: '截图必须不超过 2 MB。', subjectRequired: '请输入清晰的主题。', descriptionRequired: '请至少用 10 个字符描述问题。', submitFailed: '无法提交支持请求。', loadRequestsFailed: '无法加载请求。', loadDetailFailed: '无法加载请求详情。', requestSubmitted: '请求已提交', requestSubmittedText: '我们已收到你的支持请求。你可以在“我的支持请求”中查看状态。', viewMyRequests: '查看我的请求', back: '返回', contactSupport: '联系支持', chooseTopic: '选择主题', routeText: '我们会将你的请求转到合适的支持类别。', tellMore: '告诉我们更多', shortSummary: '简要说明问题', describePlaceholder: '描述发生了什么以及你原本期待什么...', optional2MB: '可选 · 最大 2 MB', screenshotPreview: '截图预览', removeScreenshot: '移除截图', addScreenshot: '添加截图', continueReview: '继续检查', reviewRequest: '检查你的请求', reviewText: '提交前请检查详情。', attachedScreenshot: '已附截图', privacyText: '你的请求和附件是私密的，仅 Shadow 支持管理员可见。', edit: '编辑', submitting: '提交中...', submitRequest: '提交请求', viewSupportRequests: '查看我的支持请求' },
  ja: { technicalTitle: '技術的な問題', technicalDesc: 'アプリのエラー、読み込みの遅さ、画像、通知など。', accountTitle: 'アカウントとプロフィール', accountDesc: 'ログイン、パスワード、プロフィール、アカウントアクセス。', readingTitle: '読書とライブラリ', readingDesc: 'ストーリー、エピソード、保存済み投稿、ライブラリ。', walletTitle: 'ウォレットと支払い', walletDesc: 'Diamonds、購入、支払い、取引の問題。', authorTitle: '作者と出版', authorDesc: 'Author Page、ストーリー、出版、収益。', mallTitle: 'Shadow Mall と注文', mallDesc: '商品、注文、販売者、購入済みファイル。', submitted: '送信済み', inReview: '確認中', resolved: '解決済み', closed: '終了', topic: 'トピック', details: '詳細', review: '確認', checkHelp: 'まずヘルプセンターを確認', helpText: 'よくある回答を確認すると、より早く解決できます。', browseHelp: 'ヘルプを見る', closeRequests: 'リクエストを閉じる', backRequests: 'リクエスト一覧に戻る', requestDetails: 'リクエスト詳細', myRequests: 'サポートリクエスト', trackUpdates: 'Shadow サポートからの更新を確認できます。', close: '閉じる', submittedAt: '{{date}} に送信', subject: '件名', description: '説明', screenshot: 'スクリーンショット', shadowSupport: 'Shadow サポート', waitingReply: 'リクエストは Shadow サポートからの返信待ちです。', sendAnother: '別のリクエストを送信', noRequests: 'サポートリクエストはありません', noRequestsText: '送信したリクエストがここに表示されます。', sendRequest: 'リクエストを送信', chooseImage: '画像ファイルを選択してください。', screenshotSize: 'スクリーンショットは 2 MB 以下にしてください。', subjectRequired: 'わかりやすい件名を入力してください。', descriptionRequired: '問題を10文字以上で説明してください。', submitFailed: 'サポートリクエストを送信できませんでした。', loadRequestsFailed: 'リクエストを読み込めませんでした。', loadDetailFailed: 'リクエスト詳細を読み込めませんでした。', requestSubmitted: 'リクエストを送信しました', requestSubmittedText: 'サポートリクエストを受け付けました。「サポートリクエスト」から状態を確認できます。', viewMyRequests: 'リクエストを見る', back: '戻る', contactSupport: 'サポートに連絡', chooseTopic: 'トピックを選択', routeText: '適切なサポート先へリクエストを案内します。', tellMore: '詳しく教えてください', shortSummary: '問題を短くまとめてください', describePlaceholder: '何が起きたか、何を期待していたかを説明してください...', optional2MB: '任意 · 最大 2 MB', screenshotPreview: 'スクリーンショットのプレビュー', removeScreenshot: 'スクリーンショットを削除', addScreenshot: 'スクリーンショットを追加', continueReview: '確認へ進む', reviewRequest: 'リクエストを確認', reviewText: '送信前に内容を確認してください。', attachedScreenshot: '添付スクリーンショット', privacyText: 'リクエストと添付ファイルは非公開で、Shadow サポート管理者のみ閲覧できます。', edit: '編集', submitting: '送信中...', submitRequest: 'リクエストを送信', viewSupportRequests: 'サポートリクエストを見る' },
  ko: { technicalTitle: '기술 문제', technicalDesc: '앱 오류, 느린 로딩, 이미지 또는 알림 문제.', accountTitle: '계정 및 프로필', accountDesc: '로그인, 비밀번호, 프로필 또는 계정 접근.', readingTitle: '읽기 및 라이브러리', readingDesc: '스토리, 에피소드, 저장된 게시물 또는 라이브러리.', walletTitle: '지갑 및 결제', walletDesc: 'Diamonds, 구매, 결제 또는 거래 문제.', authorTitle: '작가 및 게시', authorDesc: 'Author Page, 스토리, 게시 또는 수익.', mallTitle: 'Shadow Mall 및 주문', mallDesc: '상품, 주문, 판매자 또는 구매한 파일.', submitted: '제출됨', inReview: '검토 중', resolved: '해결됨', closed: '종료됨', topic: '주제', details: '상세 정보', review: '검토', checkHelp: '먼저 도움말 센터 확인', helpText: '자주 묻는 답변을 확인하면 더 빠르게 도움을 받을 수 있습니다.', browseHelp: '도움말 보기', closeRequests: '요청 닫기', backRequests: '요청 목록으로', requestDetails: '요청 상세', myRequests: '내 지원 요청', trackUpdates: 'Shadow 지원팀의 업데이트를 확인하세요.', close: '닫기', submittedAt: '{{date}} 제출', subject: '제목', description: '설명', screenshot: '스크린샷', shadowSupport: 'Shadow 지원', waitingReply: '요청이 Shadow 지원팀의 답변을 기다리고 있습니다.', sendAnother: '다른 요청 보내기', noRequests: '지원 요청 없음', noRequestsText: '제출한 요청이 여기에 표시됩니다.', sendRequest: '요청 보내기', chooseImage: '이미지 파일을 선택해 주세요.', screenshotSize: '스크린샷은 2 MB 이하여야 합니다.', subjectRequired: '명확한 제목을 입력해 주세요.', descriptionRequired: '문제를 10자 이상 설명해 주세요.', submitFailed: '지원 요청을 제출하지 못했습니다.', loadRequestsFailed: '요청을 불러오지 못했습니다.', loadDetailFailed: '요청 상세를 불러오지 못했습니다.', requestSubmitted: '요청이 제출되었습니다', requestSubmittedText: '지원 요청이 접수되었습니다. 내 지원 요청에서 상태를 확인할 수 있습니다.', viewMyRequests: '내 요청 보기', back: '뒤로 가기', contactSupport: '지원팀 문의', chooseTopic: '주제 선택', routeText: '요청을 알맞은 지원 항목으로 안내합니다.', tellMore: '자세히 알려주세요', shortSummary: '문제를 짧게 요약해 주세요', describePlaceholder: '무슨 일이 있었고 무엇을 기대했는지 설명해 주세요...', optional2MB: '선택 사항 · 최대 2 MB', screenshotPreview: '스크린샷 미리보기', removeScreenshot: '스크린샷 제거', addScreenshot: '스크린샷 추가', continueReview: '검토로 계속', reviewRequest: '요청 검토', reviewText: '제출하기 전에 내용을 확인하세요.', attachedScreenshot: '첨부된 스크린샷', privacyText: '요청과 첨부 파일은 비공개이며 Shadow 지원 관리자만 볼 수 있습니다.', edit: '수정', submitting: '제출 중...', submitRequest: '요청 제출', viewSupportRequests: '내 지원 요청 보기' },
})

const DISPLAY_LOCALES = { en: 'en-US', km: 'km-KH', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR' }

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const topics = [
  {
    id: 'technical_problem',
    titleKey: 'technicalTitle',
    descriptionKey: 'technicalDesc',
    icon: Wrench,
    tone: 'bg-[#f0eaff] text-[#7458e8] dark:bg-[#7458e8]/15 dark:text-[#b8a2ff]',
  },
  {
    id: 'account_profile',
    titleKey: 'accountTitle',
    descriptionKey: 'accountDesc',
    icon: CircleUserRound,
    tone: 'bg-[#e6f8f4] text-[#20a58f] dark:bg-[#20a58f]/15 dark:text-[#65d7c4]',
  },
  {
    id: 'reading_library',
    titleKey: 'readingTitle',
    descriptionKey: 'readingDesc',
    icon: BookOpen,
    tone: 'bg-[#eaf4ff] text-[#2f86cb] dark:bg-[#2f86cb]/15 dark:text-[#82bff0]',
  },
  {
    id: 'wallet_payments',
    titleKey: 'walletTitle',
    descriptionKey: 'walletDesc',
    icon: WalletCards,
    tone: 'bg-[#fff4df] text-[#e29416] dark:bg-[#e29416]/15 dark:text-[#f3b54b]',
  },
  {
    id: 'authors_publishing',
    titleKey: 'authorTitle',
    descriptionKey: 'authorDesc',
    icon: PenLine,
    tone: 'bg-[#fdebf4] text-[#d95c9a] dark:bg-[#d95c9a]/15 dark:text-[#f38db0]',
  },
  {
    id: 'mall_orders',
    titleKey: 'mallTitle',
    descriptionKey: 'mallDesc',
    icon: ShoppingBag,
    tone: 'bg-[#f1ebff] text-[#7458e8] dark:bg-[#7458e8]/15 dark:text-[#b8a2ff]',
  },
]

const statusStyles = {
  submitted: 'bg-[#f0eaff] text-[#7458e8] dark:bg-[#7458e8]/15 dark:text-[#b8a2ff]',
  in_review: 'bg-[#fff4d9] text-[#b7791f] dark:bg-amber-500/15 dark:text-amber-300',
  resolved: 'bg-[#e8f8ef] text-[#178a55] dark:bg-emerald-500/15 dark:text-emerald-300',
  closed: 'bg-[#f1f2f4] text-[#69707d] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-secondary)]',
}

const statusLabelKeys = { submitted: 'submitted', in_review: 'inReview', resolved: 'resolved', closed: 'closed' }

function topicTitle(topic) {
  return topic?.titleKey ? getDisplayText(`feedbackSupportPage.${topic.titleKey}`) : ''
}

function topicDescription(topic) {
  return topic?.descriptionKey ? getDisplayText(`feedbackSupportPage.${topic.descriptionKey}`) : ''
}

function statusLabel(status) {
  const key = statusLabelKeys[status]
  return key ? getDisplayText(`feedbackSupportPage.${key}`) : status
}

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatDate(value) {
  if (!value) return ''
  const locale = DISPLAY_LOCALES[getDisplayLanguageId()] || DISPLAY_LOCALES.en
  return new Date(value).toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatFileSize(value) {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Stepper({ step }) {
  const steps = [
    { number: 1, label: getDisplayText('feedbackSupportPage.topic') },
    { number: 2, label: getDisplayText('feedbackSupportPage.details') },
    { number: 3, label: getDisplayText('feedbackSupportPage.review') },
  ]

  return (
    <div className="px-4 pb-6 pt-6 sm:px-5">
      <div className="relative mx-auto flex w-full justify-between">
        <div className="absolute left-[8%] right-[8%] top-[13px] h-[2px] rounded-full bg-[#e8e3f8] dark:bg-white/10" />
        <div
          className="absolute left-[8%] top-[13px] h-[2px] bg-[#7458e8] transition-all duration-300"
          style={{ width: `${Math.max(0, step - 1) * 42}%` }}
        />
        {steps.map((item) => {
          const active = item.number <= step
          const current = item.number === step

          return (
            <div key={item.number} className="relative z-10 flex w-[72px] flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black transition ${
                  active
                    ? 'bg-[#7458e8] text-white shadow-[0_5px_14px_rgba(116,88,232,0.28)]'
                    : 'bg-white text-[#918b9e] shadow-[0_3px_12px_rgba(45,35,82,0.10)] dark:bg-[#1b1d28]'
                }`}
              >
                {item.number < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : item.number}
              </div>
              <span className={`mt-2 text-[11.5px] font-bold ${current ? 'text-[#7458e8]' : 'text-[#777782] dark:text-white/50'}`}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HelpCenterCard({ navigate }) {
  return (
    <section className="mt-4 flex items-center gap-3 rounded-[18px] bg-white p-3.5 dark:bg-[#7458e8]/10 sm:p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eee8ff] text-[#7458e8] dark:bg-white/10 dark:text-[#b9aaf7]">
        <BookOpen className="h-5 w-5" strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-normal text-[#242334] dark:text-white">{getDisplayText('feedbackSupportPage.checkHelp')}</div>
        <p className="mt-0.5 text-[11px] leading-[17px] text-[#7e7a89] dark:text-white/50">
          {getDisplayText('feedbackSupportPage.helpText')}
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/help')}
        className="shrink-0 rounded-full bg-[#7458e8] px-3.5 py-2.5 text-[11px] font-normal text-white active:scale-[0.98] sm:px-4"
      >
        {getDisplayText('feedbackSupportPage.browseHelp')}
      </button>
    </section>
  )
}

function RequestsModal({
  open,
  requests,
  loading,
  error,
  selectedRequest,
  detailLoading,
  detailError,
  onClose,
  onOpenRequest,
  onBackToList,
  onNewRequest,
}) {
  if (!open) return null

  const selectedTopic = selectedRequest
    ? topics.find((item) => item.id === selectedRequest.topic)
    : null
  const SelectedIcon = selectedTopic?.icon || FileText
  const selectedStatus = selectedRequest?.status || 'submitted'

  return (
    <div className="fixed inset-0 z-[100]">
      <button type="button" aria-label={getDisplayText('feedbackSupportPage.closeRequests')} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <section className="absolute bottom-0 left-0 right-0 flex h-[88vh] flex-col overflow-hidden rounded-t-[24px] bg-[#f7f7f8] shadow-[0_-12px_40px_rgba(24,20,38,0.16)] dark:bg-[#0d0f16] sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:h-[620px] sm:max-h-[88vh] sm:w-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[22px]">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#d4d2d8] sm:hidden" />
        <header className="flex min-h-[64px] items-center gap-3 bg-white px-4 py-3 dark:bg-[#171923]">
          {selectedRequest ? (
            <button type="button" onClick={onBackToList} aria-label={getDisplayText('feedbackSupportPage.backRequests')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-transparent text-black active:scale-95 active:bg-transparent dark:text-[var(--shadow-text-primary)]">
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-bold text-[#242330] dark:text-white">
              {selectedRequest ? getDisplayText('feedbackSupportPage.requestDetails') : getDisplayText('feedbackSupportPage.myRequests')}
            </h2>
            <p className="mt-0.5 text-[10.5px] text-[#918d98] dark:text-white/45">
              {selectedRequest ? selectedRequest.ticket_code : getDisplayText('feedbackSupportPage.trackUpdates')}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={getDisplayText('feedbackSupportPage.close')} className="-mt-1.5 flex h-9 w-9 shrink-0 self-start items-center justify-center rounded-none bg-transparent text-black active:scale-95 active:bg-transparent dark:text-[var(--shadow-text-primary)]">
  <X className="h-4 w-4" />
</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {selectedRequest ? (
            <div>
              {detailLoading ? (
                <div className="flex min-h-48 items-center justify-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-[#7458e8]" />
                </div>
              ) : (
                <>
                  {detailError ? (
                    <div className="mb-3 rounded-[14px] bg-[#fff1f2] px-4 py-3 text-[11.5px] text-[#b84d52]">{detailError}</div>
                  ) : null}

                  <article className="overflow-hidden rounded-[18px] bg-white dark:bg-[#171923]">
                    <div className="flex items-start gap-3 p-4">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${selectedTopic?.tone || 'bg-[#f0eaff] text-[#7458e8]'}`}>
                        <SelectedIcon className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[13px] font-bold text-[#272635] dark:text-white">{selectedRequest.ticket_code}</div>
                            <div className="mt-0.5 text-[10.5px] text-[#95919d]">{getDisplayText('feedbackSupportPage.submittedAt', { date: formatDate(selectedRequest.created_at) })}</div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9.5px] font-semibold ${statusStyles[selectedStatus] || statusStyles.submitted}`}>
                            {statusLabel(selectedStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mx-4 h-px bg-[#efedf2] dark:bg-white/10" />

                    <dl className="px-4 py-1">
                      <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                        <dt className="text-[#96929d]">{getDisplayText('feedbackSupportPage.topic')}</dt>
                        <dd className="font-medium text-[#34323e] dark:text-white/80">{selectedTopic ? topicTitle(selectedTopic) : selectedRequest.topic}</dd>
                      </div>
                      <div className="h-px bg-[#efedf2] dark:bg-white/10" />
                      <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                        <dt className="text-[#96929d]">{getDisplayText('feedbackSupportPage.subject')}</dt>
                        <dd className="font-medium leading-5 text-[#34323e] dark:text-white/80">{selectedRequest.subject}</dd>
                      </div>
                      <div className="h-px bg-[#efedf2] dark:bg-white/10" />
                      <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                        <dt className="text-[#96929d]">{getDisplayText('feedbackSupportPage.description')}</dt>
                        <dd className="whitespace-pre-line leading-5 text-[#5f5b69] dark:text-white/60">{selectedRequest.description}</dd>
                      </div>
                      {selectedRequest.screenshot_name ? (
                        <>
                          <div className="h-px bg-[#efedf2] dark:bg-white/10" />
                          <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                            <dt className="text-[#96929d]">{getDisplayText('feedbackSupportPage.screenshot')}</dt>
                            <dd className="min-w-0">
                              {selectedRequest.screenshot_url ? (
                                <a href={selectedRequest.screenshot_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[12px] bg-[#f4f3f6] dark:bg-white/5">
                                  <img src={selectedRequest.screenshot_url} alt={selectedRequest.screenshot_name} className="max-h-52 w-full object-contain" />
                                </a>
                              ) : null}
                              <div className="mt-1.5 truncate text-[10.5px] text-[#77727f] dark:text-white/45">
                                {selectedRequest.screenshot_name}
                                {selectedRequest.screenshot_size ? ` · ${formatFileSize(selectedRequest.screenshot_size)}` : ''}
                              </div>
                            </dd>
                          </div>
                        </>
                      ) : null}
                    </dl>
                  </article>

                  <section className="mt-3 rounded-[18px] bg-white p-4 dark:bg-[#171923]">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[13px] font-bold text-[#292735] dark:text-white">{getDisplayText('feedbackSupportPage.shadowSupport')}</h3>
                      {selectedRequest.reviewed_at ? (
                        <span className="text-[9.5px] text-[#9a96a1]">{formatDate(selectedRequest.reviewed_at)}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 whitespace-pre-line text-[12px] leading-5 text-[#686371] dark:text-white/60">
                      {selectedRequest.admin_reply || getDisplayText('feedbackSupportPage.waitingReply')}
                    </p>
                  </section>
                </>
              )}
            </div>
          ) : loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <LoaderCircle className="h-6 w-6 animate-spin text-[#7458e8]" />
            </div>
          ) : error ? (
            <div className="rounded-[15px] bg-[#fff1f2] px-4 py-5 text-center text-[12px] text-[#b84d52]">{error}</div>
          ) : requests.length ? (
            <div>
              <div className="space-y-2.5">
                {requests.map((request) => {
                  const topic = topics.find((item) => item.id === request.topic)
                  const Icon = topic?.icon || FileText
                  const status = request.status || 'submitted'

                  return (
                    <button key={request.id} type="button" onClick={() => onOpenRequest(request)} className="flex w-full items-start gap-3 rounded-[16px] bg-white p-4 text-left transition active:scale-[0.995] dark:bg-[#171923]">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${topic?.tone || 'bg-[#f0eaff] text-[#7458e8]'}`}>
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="min-w-0">
                            <span className="block text-[12px] font-bold text-[#292735] dark:text-white">{request.ticket_code}</span>
                            <span className="mt-0.5 block line-clamp-2 text-[12px] leading-5 text-[#4f4b58] dark:text-white/65">{request.subject}</span>
                          </span>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusStyles[status] || statusStyles.submitted}`}>
                            {statusLabel(status)}
                          </span>
                        </span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#9995a0] dark:text-white/40">
                          <Clock3 className="h-3 w-3" />
                          {formatDate(request.created_at)}
                        </span>
                      </span>
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[#a09ca6]" strokeWidth={1.8} />
                    </button>
                  )
                })}
              </div>

              <button type="button" onClick={onNewRequest} className="mt-4 h-12 w-full rounded-full bg-[#7458e8] text-[12.5px] font-normal text-white active:scale-[0.99]">
                {getDisplayText('feedbackSupportPage.sendAnother')}
              </button>
            </div>
          ) : (
            <div className="rounded-[16px] bg-white px-5 py-10 text-center dark:bg-[#171923]">
              <FileText className="mx-auto h-7 w-7 text-[#aaa6b0]" />
              <h3 className="mt-3 text-[14px] font-bold">{getDisplayText('feedbackSupportPage.noRequests')}</h3>
              <p className="mt-1 text-[11.5px] text-[#918d98] dark:text-white/45">{getDisplayText('feedbackSupportPage.noRequestsText')}</p>
              <button type="button" onClick={onNewRequest} className="mt-5 h-11 rounded-full bg-[#7458e8] px-5 text-[12px] font-normal text-white">
                {getDisplayText('feedbackSupportPage.sendRequest')}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function FeedbackSupportPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const location = useLocation()
  const fileRef = useRef(null)
  const [step, setStep] = useState(1)
  const [topicId, setTopicId] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requestsOpen, setRequestsOpen] = useState(false)
  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestsError, setRequestsError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestDetailLoading, setRequestDetailLoading] = useState(false)
  const [requestDetailError, setRequestDetailError] = useState('')

  const selectedTopic = useMemo(() => topics.find((topic) => topic.id === topicId) || null, [topicId])

  useEffect(() => {
    return () => {
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview)
    }
  }, [screenshotPreview])

  function goBack() {
    if (success) {
      setSuccess(false)
      setStep(1)
      return
    }
    if (step > 1) {
      setStep((current) => current - 1)
      setMessage('')
      return
    }
    navigate(-1)
  }

  function selectTopic(id) {
    setTopicId(id)
    setMessage('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFile(event) {
    const file = event.target.files?.[0] || null
    setMessage('')

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage(getDisplayText('feedbackSupportPage.chooseImage'))
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage(getDisplayText('feedbackSupportPage.screenshotSize'))
      return
    }

    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview)
    setScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  function removeScreenshot() {
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview)
    setScreenshot(null)
    setScreenshotPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function openReview() {
    if (subject.trim().length < 3) {
      setMessage(getDisplayText('feedbackSupportPage.subjectRequired'))
      return
    }
    if (description.trim().length < 10) {
      setMessage(getDisplayText('feedbackSupportPage.descriptionRequired'))
      return
    }
    setMessage('')
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submitRequest() {
    if (submitting || !selectedTopic) return
    const token = getReaderToken()

    if (!token) {
      navigate('/login', {
        state: {
          returnTo: location.pathname,
        },
      })
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('topic', topicId)
      formData.append('subject', subject.trim())
      formData.append('description', description.trim())
      formData.append('source_url', window.location.href)
      if (screenshot) formData.append('screenshot', screenshot)

      const response = await fetch(`${API_BASE_URL}/api/support/requests`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || getDisplayText('feedbackSupportPage.submitFailed'))
      }

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setMessage(error.message || getDisplayText('feedbackSupportPage.submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  async function loadRequests() {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { state: { returnTo: location.pathname } })
      return
    }

    setRequestsOpen(true)
    setSelectedRequest(null)
    setRequestDetailError('')
    setRequestsLoading(true)
    setRequestsError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/support/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || getDisplayText('feedbackSupportPage.loadRequestsFailed'))
      setRequests(Array.isArray(data.requests) ? data.requests : [])
    } catch (error) {
      setRequestsError(error.message || getDisplayText('feedbackSupportPage.loadRequestsFailed'))
      setRequests([])
    } finally {
      setRequestsLoading(false)
    }
  }

  async function openRequestDetails(request) {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { state: { returnTo: location.pathname } })
      return
    }

    setSelectedRequest(request)
    setRequestDetailLoading(true)
    setRequestDetailError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/support/requests/${request.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || getDisplayText('feedbackSupportPage.loadDetailFailed'))
      setSelectedRequest(data.request || request)
    } catch (error) {
      setRequestDetailError(error.message || getDisplayText('feedbackSupportPage.loadDetailFailed'))
    } finally {
      setRequestDetailLoading(false)
    }
  }

  function closeRequests() {
    setRequestsOpen(false)
    setSelectedRequest(null)
    setRequestDetailError('')
  }

  function backToRequestList() {
    setSelectedRequest(null)
    setRequestDetailError('')
  }

  function resetForm() {
    removeScreenshot()
    setTopicId('')
    setSubject('')
    setDescription('')
    setMessage('')
    setSuccess(false)
    setStep(1)
    closeRequests()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (success) {
    return (
      <main className="app-page min-h-screen px-4 py-8">
        <section className="mx-auto max-w-[520px] rounded-[22px] bg-white p-6 text-center shadow-[0_14px_38px_rgba(40,28,78,0.10)] dark:bg-[#171923]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f8ef] text-[#178a55]">
            <CircleCheck className="h-8 w-8" strokeWidth={1.9} />
          </span>
          <h1 className="mt-5 text-[22px] font-black text-[#20202e] dark:text-white">{t('feedbackSupportPage.requestSubmitted')}</h1>
          <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-6 text-[#797684] dark:text-white/55">
            {t('feedbackSupportPage.requestSubmittedText')}
          </p>
          <button
            type="button"
            onClick={loadRequests}
            className="mt-6 h-12 w-full rounded-full bg-[#7458e8] text-[13px] font-normal text-white active:scale-[0.99]"
          >
            {t('feedbackSupportPage.viewMyRequests')}
          </button>
          <button type="button" onClick={resetForm} className="mt-3 h-11 text-[12.5px] font-normal text-[#7458e8]">
            {t('feedbackSupportPage.sendAnother')}
          </button>
        </section>

        <RequestsModal
          open={requestsOpen}
          requests={requests}
          loading={requestsLoading}
          error={requestsError}
          selectedRequest={selectedRequest}
          detailLoading={requestDetailLoading}
          detailError={requestDetailError}
          onClose={closeRequests}
          onOpenRequest={openRequestDetails}
          onBackToList={backToRequestList}
          onNewRequest={resetForm}
        />
      </main>
    )
  }

  return (
    <main className="app-page min-h-screen pb-8 text-[#20202e] dark:text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 bg-white/95 shadow-[0_3px_16px_rgba(40,31,70,0.06)] backdrop-blur dark:bg-[#171923]/95">
        <div className="relative mx-auto flex h-12 max-w-[760px] items-center justify-center px-4">
          <button type="button" onClick={goBack} aria-label={t('feedbackSupportPage.back')} className="absolute left-4 flex h-10 w-10 items-center justify-start active:scale-95">
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <h1 className="text-[16px] font-bold tracking-[-0.02em]">{t('feedbackSupportPage.contactSupport')}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[760px]">
        <Stepper step={step} />

        <div className="px-4 sm:px-5">
          {step === 1 ? (
            <section className="rounded-[20px] bg-transparent py-4 dark:bg-transparent sm:py-6">
              <h2 className="text-[17px] font-bold tracking-[-0.02em] sm:text-[18px]">{t('feedbackSupportPage.chooseTopic')}</h2>
              <p className="mt-1 text-[12.5px] text-[#85818d] dark:text-white/50">{t('feedbackSupportPage.routeText')}</p>

              <div className="mt-5 overflow-hidden rounded-[15px] bg-white dark:bg-[#171923]">
                {topics.map((topic, index) => {
                  const Icon = topic.icon
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => selectTopic(topic.id)}
                      className="group relative flex w-full items-center gap-3 bg-white px-3 py-3 text-left transition-colors active:bg-[#f7f7f8] dark:bg-[#171923] dark:active:bg-white/5 sm:px-4"
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${topic.tone}`}>
                        <Icon className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-normal text-[#272635] dark:text-white">{topicTitle(topic)}</span>
                        <span className="mt-0.5 hidden text-[11px] leading-4 text-[#8d8995] dark:text-white/45 sm:block">{topicDescription(topic)}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#99969f] transition group-hover:translate-x-0.5 group-hover:text-[#7458e8]" strokeWidth={1.8} />
                      {index < topics.length - 1 ? (
                        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[#f1f1f1] dark:bg-white/10" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="rounded-[20px] bg-transparent py-4 dark:bg-transparent sm:py-6">
              <div className="flex items-center gap-3">
                {selectedTopic ? (
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${selectedTopic.tone}`}>
                    <selectedTopic.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                ) : null}
                <div>
                  <h2 className="text-[17px] font-bold tracking-[-0.02em]">{t('feedbackSupportPage.tellMore')}</h2>
                  <p className="mt-0.5 text-[11.5px] text-[#85818d] dark:text-white/50">{selectedTopic ? topicTitle(selectedTopic) : null}</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-[12px] font-black text-[#3b3948] dark:text-white/75">{t('feedbackSupportPage.subject')}</span>
                  <input
                    value={subject}
                    maxLength={140}
                    onChange={(event) => {
                      setSubject(event.target.value)
                      setMessage('')
                    }}
                    placeholder={t('feedbackSupportPage.shortSummary')}
                    className="mt-2 h-12 w-full rounded-[14px] bg-[#f8f7fb] px-3.5 text-[13px] font-medium shadow-[inset_0_0_0_1px_rgba(116,88,232,0.08)] outline-none transition placeholder:text-[#aaa7b0] focus:bg-white focus:ring-4 focus:ring-[#7458e8]/10 dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:bg-[var(--shadow-input-bg)]"
                  />
                </label>

                <label className="block">
                  <span className="text-[12px] font-black text-[#3b3948] dark:text-white/75">{t('feedbackSupportPage.description')}</span>
                  <textarea
                    value={description}
                    maxLength={3000}
                    onChange={(event) => {
                      setDescription(event.target.value)
                      setMessage('')
                    }}
                    placeholder={t('feedbackSupportPage.describePlaceholder')}
                    className="mt-2 min-h-[150px] w-full resize-none rounded-[14px] bg-[#f8f7fb] px-3.5 py-3 text-[13px] font-medium leading-6 shadow-[inset_0_0_0_1px_rgba(116,88,232,0.08)] outline-none transition placeholder:text-[#aaa7b0] focus:bg-white focus:ring-4 focus:ring-[#7458e8]/10 dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:bg-[var(--shadow-input-bg)]"
                  />
                  <span className="mt-1 block text-right text-[10px] font-semibold text-[#9d99a3]">{description.length}/3000</span>
                </label>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-[#3b3948] dark:text-white/75">{t('feedbackSupportPage.screenshot')}</span>
                    <span className="text-[10.5px] font-semibold text-[#9a97a1]">{t('feedbackSupportPage.optional2MB')}</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  {screenshotPreview ? (
                    <div className="relative mt-2 overflow-hidden rounded-[14px] bg-[#f7f5fb] p-2 shadow-[0_5px_16px_rgba(56,42,98,0.08)] dark:bg-white/5">
                      <img src={screenshotPreview} alt={t('feedbackSupportPage.screenshotPreview')} className="max-h-52 w-full rounded-[10px] object-contain" />
                      <button type="button" onClick={removeScreenshot} aria-label={t('feedbackSupportPage.removeScreenshot')} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white active:scale-95">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 flex h-24 w-full items-center justify-center gap-2 rounded-[14px] bg-[#f7f3ff] text-[12px] font-normal text-[#7458e8] shadow-[inset_0_0_0_1px_rgba(116,88,232,0.10)] active:scale-[0.995] dark:bg-[#7458e8]/10">
                      <ImagePlus className="h-5 w-5" strokeWidth={1.9} />
                      {t('feedbackSupportPage.addScreenshot')}
                    </button>
                  )}
                </div>
              </div>

              {message ? <div className="mt-4 rounded-[13px] bg-[#fff1f2] px-3.5 py-3 text-[11.5px] font-bold text-[#bb4d52] shadow-[0_5px_15px_rgba(187,77,82,0.08)] dark:bg-red-500/10 dark:text-red-300">{message}</div> : null}

              <button type="button" onClick={openReview} className="mt-5 h-12 w-full rounded-[14px] bg-[#7458e8] text-[13px] font-normal text-white active:scale-[0.99]">
                {t('feedbackSupportPage.continueReview')}
              </button>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="rounded-[20px] bg-white p-4 shadow-[0_12px_32px_rgba(48,35,90,0.085)] dark:bg-[#171923] sm:p-6">
              <h2 className="text-[18px] font-bold tracking-[-0.02em]">{t('feedbackSupportPage.reviewRequest')}</h2>
              <p className="mt-1 text-[12px] text-[#85818d] dark:text-white/50">{t('feedbackSupportPage.reviewText')}</p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 rounded-[14px] bg-[#faf9fd] px-4 py-3.5 dark:bg-white/5">
                  {selectedTopic ? (
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${selectedTopic.tone}`}>
                      <selectedTopic.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    </span>
                  ) : null}
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.06em] text-[#9a96a1]">{t('feedbackSupportPage.topic')}</div>
                    <div className="mt-0.5 text-[13px] font-bold">{selectedTopic ? topicTitle(selectedTopic) : null}</div>
                  </div>
                </div>
                <div className="rounded-[14px] bg-[#faf9fd] px-4 py-3.5 dark:bg-white/5">
                  <div className="text-[10px] font-black uppercase tracking-[0.06em] text-[#9a96a1]">{t('feedbackSupportPage.subject')}</div>
                  <div className="mt-1 text-[13px] font-bold leading-5">{subject.trim()}</div>
                </div>
                <div className="rounded-[14px] bg-[#faf9fd] px-4 py-3.5 dark:bg-white/5">
                  <div className="text-[10px] font-black uppercase tracking-[0.06em] text-[#9a96a1]">{t('feedbackSupportPage.description')}</div>
                  <p className="mt-1 whitespace-pre-line text-[12.5px] leading-6 text-[#5f5b69] dark:text-white/65">{description.trim()}</p>
                  {screenshotPreview ? <img src={screenshotPreview} alt={t('feedbackSupportPage.attachedScreenshot')} className="mt-3 max-h-56 w-full rounded-[12px] object-contain shadow-[0_5px_16px_rgba(56,42,98,0.08)]" /> : null}
                </div>
              </div>

              <div className="mt-4 rounded-[14px] bg-[#f7f5fc] px-4 py-3 text-[11px] leading-5 text-[#706b7c] dark:bg-white/5 dark:text-white/50">
                {t('feedbackSupportPage.privacyText')}
              </div>

              {message ? <div className="mt-4 rounded-[13px] bg-[#fff1f2] px-3.5 py-3 text-[11.5px] font-bold text-[#bb4d52] shadow-[0_5px_15px_rgba(187,77,82,0.08)] dark:bg-red-500/10 dark:text-red-300">{message}</div> : null}

              <div className="mt-5 grid grid-cols-[0.8fr_1.2fr] gap-2.5">
                <button type="button" onClick={() => setStep(2)} className="h-12 rounded-[14px] bg-[#f2eff8] text-[12.5px] font-normal text-[#5c5865] active:scale-[0.99] dark:bg-white/5 dark:text-white/70">
                  {t('feedbackSupportPage.edit')}
                </button>
                <button type="button" onClick={submitRequest} disabled={submitting} className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#7458e8] text-[12.5px] font-normal text-white active:scale-[0.99] disabled:opacity-60">
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? t('feedbackSupportPage.submitting') : t('feedbackSupportPage.submitRequest')}
                </button>
              </div>
            </section>
          ) : null}

          <HelpCenterCard navigate={navigate} />

          <button type="button" onClick={loadRequests} className="mx-auto mt-4 flex h-11 items-center justify-center gap-2 rounded-[14px] px-4 text-[12.5px] font-normal text-[#7458e8] active:bg-[#f2edff] dark:active:bg-white/5">
            {t('feedbackSupportPage.viewSupportRequests')}
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <RequestsModal
        open={requestsOpen}
        requests={requests}
        loading={requestsLoading}
        error={requestsError}
        selectedRequest={selectedRequest}
        detailLoading={requestDetailLoading}
        detailError={requestDetailError}
        onClose={closeRequests}
        onOpenRequest={openRequestDetails}
        onBackToList={backToRequestList}
        onNewRequest={resetForm}
      />
    </main>
  )
}
