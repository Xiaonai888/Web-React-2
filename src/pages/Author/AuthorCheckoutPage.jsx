import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { getCountryFeature, getPaymentCountryTicket, loadCountrySettings } from '../../utils/countrySettings'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import PaymentProfileModal from '../../components/Wallet/PaymentProfileModal'
import DiscoverPromotionExpiryNotice, { discoverPromotionExpiryMessage, hasExpiredDiscoverPromotion, isExpiredDiscoverPromotion, useDiscoverPromotionExpiry } from '../../components/discover/DiscoverPromotionExpiryNotice'

registerTranslationNamespace('authorCheckout', {
  "en": {
    "buyerProfile": "Buyer Profile",
    "buyerProfileHelp": "Required for printed book delivery.",
    "name": "Name",
    "nameHelp": "Name comes from your reader account. To change it, update your main profile.",
    "phoneNumber": "Phone Number",
    "telegramUsername": "Telegram Username",
    "facebookLink": "Facebook Link",
    "deliveryAddress": "Delivery Address",
    "saveInformation": "Save Information",
    "requiredFields": "Name, phone number, and delivery address are required.",
    "checkout": "Checkout",
    "pleaseLogin": "Please login before checkout.",
    "cartEmpty": "Your cart is empty.",
    "failedSaveProfile": "Failed to save buyer profile",
    "failedCreatePayment": "Failed to create Author Store payment",
    "paymentNotCreated": "Payment order was not created",
    "failedContinuePayment": "Failed to continue payment",
    "deliveryCompany": "Delivery Company",
    "deliveryCompanyHelp": "Choose the company for printed book delivery.",
    "deliveryNote": "Delivery Note",
    "deliveryNotePlaceholder": "Optional note for admin or delivery...",
    "orderItems": "Order Items",
    "itemsInOrder": "{{count}} items in this order",
    "book": "Book",
    "noItems": "No items in cart.",
    "paymentSummary": "Payment Summary",
    "deliveryFee": "Delivery Fee",
    "total": "Total",
    "creatingPayment": "Creating payment...",
    "continuePayment": "Continue to Payment",
    "close": "Close",
    "removeItem": "Remove item",
    "decreaseQuantity": "Decrease quantity",
    "increaseQuantity": "Increase quantity",
    "openBuyerProfile": "Open buyer profile",
    "goBack": "Go back",
    "orderSuccessful": "Order Successful!",
    "orderSuccessMessage": "Your book order has been placed successfully. Please wait while we prepare and ship your order.",
    "viewOrder": "View Order",
    "backToDiscover": "Back to Discover",
    "backToStore": "Back to Store",
    "backToStories": "Back to Stories",
    "backToManga": "Back to Manga",
    "pdfPurchaseSuccessful": "Purchase Successful!",
    "pdfPurchaseSuccessMessage": "Your PDF is unlocked and ready to read.",
    "readNow": "Read Now",
    "paymentTitle": "Pay with ABA PayWay",
    "paymentHelp": "Scan the QR code with your bank app, or open ABA on your phone. After paying, return here and check your payment status.",
    "openABA": "Open ABA Pay",
    "checkPayment": "I Paid · Check Payment",
    "checkingPayment": "Checking payment...",
    "paymentPending": "Payment has not been confirmed yet. Please try again after paying.",
    "paymentUnavailable": "ABA payment is not available for this order. Please try again later.",
    "paymentExpired": "The payment QR has expired. Check your payment first, then close this window to create a new order.",
    "paymentClose": "Close payment window",
    "paymentExpires": "Payment time left",
    "paymentOrderId": "Order ID",
    "pdfUnlockFailed": "PDF payment was received, but the file is not unlocked yet. Please contact support if this continues.",
    "pdf_method": "Payment method",
    "pdf_aba": "ABA / PayWay",
    "pdf_binance": "Binance Pay",
    "pdf_binancePrice": "Binance total (includes 1 USDT fee)",
    "pdf_binanceBonus": "+100 Vouchers after verified payment",
    "pdf_binanceReceiver": "Pay only to the verified Binance recipient",
    "pdf_binanceUnavailable": "Binance PDF payment is not allowed for your country or is not ready.",
    "pdf_binanceProfile": "Save your Binance account name and UID first.",
    "pdf_binanceWait": "If you already transferred USDT, do not send again. Check the status after verification."
  },
  "km": {
    "buyerProfile": "ព័ត៌មានអ្នកទិញ",
    "buyerProfileHelp": "ត្រូវការសម្រាប់ការដឹកជញ្ជូនសៀវភៅបោះពុម្ព។",
    "name": "ឈ្មោះ",
    "nameHelp": "ឈ្មោះយកពីគណនីអ្នកអាន។ បើចង់កែ សូមកែ Profile មេរបស់អ្នក។",
    "phoneNumber": "លេខទូរស័ព្ទ",
    "telegramUsername": "ឈ្មោះ Telegram",
    "facebookLink": "តំណ Facebook",
    "deliveryAddress": "អាសយដ្ឋានដឹកជញ្ជូន",
    "saveInformation": "រក្សាទុកព័ត៌មាន",
    "requiredFields": "ត្រូវបំពេញឈ្មោះ លេខទូរស័ព្ទ និងអាសយដ្ឋានដឹកជញ្ជូន។",
    "checkout": "ទូទាត់",
    "pleaseLogin": "សូមចូលគណនីមុនពេលទូទាត់។",
    "cartEmpty": "រទេះរបស់អ្នកទទេ។",
    "failedSaveProfile": "មិនអាចរក្សាទុកព័ត៌មានអ្នកទិញបានទេ",
    "failedCreatePayment": "មិនអាចបង្កើតការទូទាត់ Author Store បានទេ",
    "paymentNotCreated": "មិនបានបង្កើតការបញ្ជាទិញសម្រាប់ទូទាត់ទេ",
    "failedContinuePayment": "មិនអាចបន្តការទូទាត់បានទេ",
    "deliveryCompany": "ក្រុមហ៊ុនដឹកជញ្ជូន",
    "deliveryCompanyHelp": "ជ្រើសក្រុមហ៊ុនសម្រាប់ដឹកសៀវភៅបោះពុម្ព។",
    "deliveryNote": "កំណត់ចំណាំដឹកជញ្ជូន",
    "deliveryNotePlaceholder": "កំណត់ចំណាំជាជម្រើសសម្រាប់ Admin ឬអ្នកដឹកជញ្ជូន...",
    "orderItems": "ទំនិញក្នុងការបញ្ជាទិញ",
    "itemsInOrder": "{{count}} ទំនិញក្នុងការបញ្ជាទិញនេះ",
    "book": "សៀវភៅ",
    "noItems": "មិនមានទំនិញក្នុងរទេះទេ។",
    "paymentSummary": "សង្ខេបការទូទាត់",
    "deliveryFee": "ថ្លៃដឹកជញ្ជូន",
    "total": "សរុប",
    "creatingPayment": "កំពុងបង្កើតការទូទាត់...",
    "continuePayment": "បន្តទៅការទូទាត់",
    "close": "បិទ",
    "removeItem": "លុបចេញ",
    "decreaseQuantity": "បន្ថយចំនួន",
    "increaseQuantity": "បង្កើនចំនួន",
    "openBuyerProfile": "បើកព័ត៌មានអ្នកទិញ",
    "goBack": "ត្រឡប់ក្រោយ",
    "orderSuccessful": "ការបញ្ជាទិញបានជោគជ័យ!",
    "orderSuccessMessage": "អ្នកបានបញ្ជាទិញសៀវភៅដោយជោគជ័យ។ សូមរង់ចាំយើងរៀបចំ និងដឹកជញ្ជូនការបញ្ជាទិញរបស់អ្នក។",
    "viewOrder": "មើលការបញ្ជាទិញ",
    "backToDiscover": "ត្រឡប់ទៅ Discover",
    "backToStore": "ត្រឡប់ទៅហាង",
    "backToStories": "ត្រឡប់ទៅ Stories",
    "backToManga": "ត្រឡប់ទៅ Manga",
    "pdfPurchaseSuccessful": "ការទិញបានជោគជ័យ!",
    "pdfPurchaseSuccessMessage": "PDF របស់អ្នកបានដោះសោ និងអាចអានបានហើយ។",
    "readNow": "អានឥឡូវនេះ",
    "paymentTitle": "ទូទាត់តាម ABA PayWay",
    "paymentHelp": "ស្កេន QR ដោយកម្មវិធីធនាគារ ឬបើក ABA លើទូរស័ព្ទ។ បន្ទាប់ពីទូទាត់ សូមត្រឡប់មកពិនិត្យស្ថានភាព។",
    "openABA": "បើក ABA Pay",
    "checkPayment": "បានបង់ហើយ · ពិនិត្យការទូទាត់",
    "checkingPayment": "កំពុងផ្ទៀងផ្ទាត់...",
    "paymentPending": "មិនទាន់មានការបញ្ជាក់ការទូទាត់ទេ។ សូមពិនិត្យម្ដងទៀតក្រោយបង់ប្រាក់។",
    "paymentUnavailable": "មិនអាចបើកការទូទាត់ ABA បានទេ។ សូមសាកល្បងពេលក្រោយ។",
    "paymentExpired": "QR ទូទាត់ផុតកំណត់។ សូមពិនិត្យការទូទាត់សិន រួចបិទផ្ទាំងនេះដើម្បីបង្កើត Order ថ្មី។",
    "paymentClose": "បិទផ្ទាំងទូទាត់",
    "paymentExpires": "ពេលនៅសល់",
    "paymentOrderId": "លេខបញ្ជាទិញ",
    "pdfUnlockFailed": "បានទទួលការទូទាត់ PDF ប៉ុន្តែឯកសារមិនទាន់ដោះសោទេ។ ប្រសិនបើបញ្ហានៅបន្ត សូមទាក់ទងផ្នែកជំនួយ។",
    "pdf_method": "មធ្យោបាយទូទាត់",
    "pdf_aba": "ABA / PayWay",
    "pdf_binance": "Binance Pay",
    "pdf_binancePrice": "សរុប Binance (បូកថ្លៃ 1 USDT)",
    "pdf_binanceBonus": "+100 Vouchers ក្រោយបញ្ជាក់ការបង់ប្រាក់",
    "pdf_binanceReceiver": "សូមផ្ទេរតែទៅគណនី Binance ដែលបានផ្ទៀងផ្ទាត់",
    "pdf_binanceUnavailable": "Binance PDF មិនអនុញ្ញាតសម្រាប់គណនីនេះ ឬមិនទាន់រួចរាល់។",
    "pdf_binanceProfile": "សូមរក្សាទុក Binance Name និង UID ជាមុន។",
    "pdf_binanceWait": "បើបានផ្ទេរ USDT រួច កុំផ្ទេរស្ទួន។ សូមពិនិត្យស្ថានភាពក្រោយផ្ទៀងផ្ទាត់។"
  },
  "zh": {
    "buyerProfile": "买家资料",
    "buyerProfileHelp": "配送纸质书时需要填写。",
    "name": "姓名",
    "nameHelp": "姓名来自读者账户，如需更改请更新主个人资料。",
    "phoneNumber": "电话号码",
    "telegramUsername": "Telegram 用户名",
    "facebookLink": "Facebook 链接",
    "deliveryAddress": "配送地址",
    "saveInformation": "保存信息",
    "requiredFields": "姓名、电话号码和配送地址为必填项。",
    "checkout": "结账",
    "pleaseLogin": "请先登录再结账。",
    "cartEmpty": "购物车为空。",
    "failedSaveProfile": "无法保存买家资料",
    "failedCreatePayment": "无法创建作者商店付款",
    "paymentNotCreated": "未创建付款订单",
    "failedContinuePayment": "无法继续付款",
    "deliveryCompany": "配送公司",
    "deliveryCompanyHelp": "选择纸质书的配送公司。",
    "deliveryNote": "配送备注",
    "deliveryNotePlaceholder": "给管理员或配送员的可选备注...",
    "orderItems": "订单商品",
    "itemsInOrder": "此订单共 {{count}} 件商品",
    "book": "书籍",
    "noItems": "购物车中没有商品。",
    "paymentSummary": "付款摘要",
    "deliveryFee": "配送费",
    "total": "总计",
    "creatingPayment": "正在创建付款...",
    "continuePayment": "继续付款",
    "close": "关闭",
    "removeItem": "移除商品",
    "decreaseQuantity": "减少数量",
    "increaseQuantity": "增加数量",
    "openBuyerProfile": "打开买家资料",
    "goBack": "返回",
    "orderSuccessful": "订单成功！",
    "orderSuccessMessage": "您的图书订单已成功提交。请等待我们安排备货和配送。",
    "viewOrder": "查看订单",
    "backToDiscover": "返回 Discover",
    "backToStore": "返回商店",
    "backToStories": "返回 Stories",
    "backToManga": "返回 Manga",
    "pdfPurchaseSuccessful": "购买成功！",
    "pdfPurchaseSuccessMessage": "您的 PDF 已解锁，可以立即阅读。",
    "readNow": "立即阅读",
    "paymentTitle": "使用 ABA PayWay 付款",
    "paymentHelp": "使用银行应用扫描二维码，或在手机上打开 ABA。付款后返回此页面检查付款状态。",
    "openABA": "打开 ABA Pay",
    "checkPayment": "已付款 · 检查状态",
    "checkingPayment": "正在检查付款...",
    "paymentPending": "尚未确认付款，请在付款后重试。",
    "paymentUnavailable": "当前订单无法使用 ABA 付款，请稍后重试。",
    "paymentExpired": "付款二维码已过期。请先检查付款，再关闭此窗口创建新订单。",
    "paymentClose": "关闭付款窗口",
    "paymentExpires": "剩余付款时间",
    "paymentOrderId": "订单号",
    "pdfUnlockFailed": "已收到 PDF 付款，但文件尚未解锁。如果问题持续，请联系客服。",
    "pdf_method": "付款方式",
    "pdf_aba": "ABA / PayWay",
    "pdf_binance": "Binance Pay",
    "pdf_binancePrice": "Binance 应付总额（含1 USDT手续费）",
    "pdf_binanceBonus": "验证成功后赠送100 Vouchers",
    "pdf_binanceReceiver": "仅向已验证的Binance收款方转账",
    "pdf_binanceUnavailable": "该账户无法使用Binance PDF付款。",
    "pdf_binanceProfile": "请先保存Binance姓名和UID。",
    "pdf_binanceWait": "已转账请勿再次付款，等待核实后检查状态。"
  },
  "ja": {
    "buyerProfile": "購入者情報",
    "buyerProfileHelp": "紙の本の配送に必要です。",
    "name": "名前",
    "nameHelp": "名前は読者アカウントから取得されます。変更するにはメインプロフィールを更新してください。",
    "phoneNumber": "電話番号",
    "telegramUsername": "Telegram ユーザー名",
    "facebookLink": "Facebook リンク",
    "deliveryAddress": "配送先住所",
    "saveInformation": "情報を保存",
    "requiredFields": "名前、電話番号、配送先住所は必須です。",
    "checkout": "購入手続き",
    "pleaseLogin": "購入手続きの前にログインしてください。",
    "cartEmpty": "カートは空です。",
    "failedSaveProfile": "購入者情報を保存できませんでした",
    "failedCreatePayment": "著者ストアの支払いを作成できませんでした",
    "paymentNotCreated": "支払い注文が作成されませんでした",
    "failedContinuePayment": "支払いを続行できませんでした",
    "deliveryCompany": "配送会社",
    "deliveryCompanyHelp": "紙の本を配送する会社を選択してください。",
    "deliveryNote": "配送メモ",
    "deliveryNotePlaceholder": "管理者または配送向けの任意メモ...",
    "orderItems": "注文商品",
    "itemsInOrder": "この注文には {{count}} 点の商品があります",
    "book": "本",
    "noItems": "カートに商品がありません。",
    "paymentSummary": "支払い概要",
    "deliveryFee": "配送料",
    "total": "合計",
    "creatingPayment": "支払いを作成中...",
    "continuePayment": "支払いへ進む",
    "close": "閉じる",
    "removeItem": "商品を削除",
    "decreaseQuantity": "数量を減らす",
    "increaseQuantity": "数量を増やす",
    "openBuyerProfile": "購入者情報を開く",
    "goBack": "戻る",
    "orderSuccessful": "ご注文が完了しました！",
    "orderSuccessMessage": "書籍のご注文が正常に受け付けられました。発送の準備が整うまでお待ちください。",
    "viewOrder": "注文を見る",
    "backToDiscover": "Discover に戻る",
    "backToStore": "ストアに戻る",
    "backToStories": "Stories に戻る",
    "backToManga": "Manga に戻る",
    "pdfPurchaseSuccessful": "購入が完了しました！",
    "pdfPurchaseSuccessMessage": "PDF のロックが解除され、すぐに読めます。",
    "readNow": "今すぐ読む",
    "paymentTitle": "ABA PayWay で支払う",
    "paymentHelp": "銀行アプリで QR コードを読み取るか、スマートフォンで ABA を開きます。支払い後、この画面に戻り状況をご確認ください。",
    "openABA": "ABA Pay を開く",
    "checkPayment": "支払済み · 状況確認",
    "checkingPayment": "支払いを確認中...",
    "paymentPending": "まだ支払いを確認できません。お支払い後にもう一度お試しください。",
    "paymentUnavailable": "この注文では ABA 決済を利用できません。後ほどお試しください。",
    "paymentExpired": "決済 QR の有効期限が切れました。支払いを確認し、この画面を閉じて新しい注文を作成してください。",
    "paymentClose": "支払い画面を閉じる",
    "paymentExpires": "残り時間",
    "paymentOrderId": "注文番号",
    "pdfUnlockFailed": "PDF のお支払いは確認されましたが、ファイルはまだ解放されていません。解決しない場合はサポートにお問い合わせください。",
    "pdf_method": "支払い方法",
    "pdf_aba": "ABA / PayWay",
    "pdf_binance": "Binance Pay",
    "pdf_binancePrice": "Binance 合計（手数料1 USDTを含む）",
    "pdf_binanceBonus": "確認後に100 Vouchersを付与",
    "pdf_binanceReceiver": "確認済みBinance受取先のみに送金",
    "pdf_binanceUnavailable": "Binance PDF支払いを利用できません。",
    "pdf_binanceProfile": "Binance名とUIDを先に保存してください。",
    "pdf_binanceWait": "送金済みの場合は二重送金しないでください。確認をお待ちください。"
  },
  "ko": {
    "buyerProfile": "구매자 정보",
    "buyerProfileHelp": "인쇄 도서 배송에 필요합니다.",
    "name": "이름",
    "nameHelp": "이름은 독자 계정에서 가져옵니다. 변경하려면 기본 프로필을 수정하세요.",
    "phoneNumber": "전화번호",
    "telegramUsername": "Telegram 사용자 이름",
    "facebookLink": "Facebook 링크",
    "deliveryAddress": "배송 주소",
    "saveInformation": "정보 저장",
    "requiredFields": "이름, 전화번호, 배송 주소는 필수입니다.",
    "checkout": "결제",
    "pleaseLogin": "결제 전에 로그인해 주세요.",
    "cartEmpty": "장바구니가 비어 있습니다.",
    "failedSaveProfile": "구매자 정보를 저장하지 못했습니다",
    "failedCreatePayment": "작가 스토어 결제를 생성하지 못했습니다",
    "paymentNotCreated": "결제 주문이 생성되지 않았습니다",
    "failedContinuePayment": "결제를 계속하지 못했습니다",
    "deliveryCompany": "배송 회사",
    "deliveryCompanyHelp": "인쇄 도서를 배송할 회사를 선택하세요.",
    "deliveryNote": "배송 메모",
    "deliveryNotePlaceholder": "관리자 또는 배송을 위한 선택 메모...",
    "orderItems": "주문 상품",
    "itemsInOrder": "이 주문에 {{count}}개 상품",
    "book": "책",
    "noItems": "장바구니에 상품이 없습니다.",
    "paymentSummary": "결제 요약",
    "deliveryFee": "배송비",
    "total": "합계",
    "creatingPayment": "결제 생성 중...",
    "continuePayment": "결제로 계속",
    "close": "닫기",
    "removeItem": "상품 삭제",
    "decreaseQuantity": "수량 줄이기",
    "increaseQuantity": "수량 늘리기",
    "openBuyerProfile": "구매자 정보 열기",
    "goBack": "뒤로",
    "orderSuccessful": "주문이 완료되었습니다!",
    "orderSuccessMessage": "도서 주문이 성공적으로 접수되었습니다. 준비 및 배송까지 잠시 기다려 주세요.",
    "viewOrder": "주문 보기",
    "backToDiscover": "Discover로 돌아가기",
    "backToStore": "스토어로 돌아가기",
    "backToStories": "Stories로 돌아가기",
    "backToManga": "Manga로 돌아가기",
    "pdfPurchaseSuccessful": "구매가 완료되었습니다!",
    "pdfPurchaseSuccessMessage": "PDF 잠금이 해제되어 바로 읽을 수 있습니다.",
    "readNow": "지금 읽기",
    "paymentTitle": "ABA PayWay 결제",
    "paymentHelp": "은행 앱으로 QR 코드를 스캔하거나 휴대폰에서 ABA를 실행하세요. 결제 후 돌아와 결제 상태를 확인하세요.",
    "openABA": "ABA Pay 열기",
    "checkPayment": "결제 완료 · 상태 확인",
    "checkingPayment": "결제 확인 중...",
    "paymentPending": "아직 결제가 확인되지 않았습니다. 결제 후 다시 시도하세요.",
    "paymentUnavailable": "이 주문은 현재 ABA 결제를 사용할 수 없습니다. 나중에 다시 시도하세요.",
    "paymentExpired": "결제 QR이 만료되었습니다. 결제 상태를 확인하고 창을 닫아 새 주문을 만드세요.",
    "paymentClose": "결제 창 닫기",
    "paymentExpires": "남은 결제 시간",
    "paymentOrderId": "주문 번호",
    "pdfUnlockFailed": "PDF 결제는 확인되었지만 아직 파일이 잠금 해제되지 않았습니다. 문제가 계속되면 고객 지원에 문의하세요."
  }
})


const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PAYMENT_SUCCESS_SEEN_KEY = 'shadow_author_checkout_success_seen_v1'
const PAYMENT_CHECK_MIN_INTERVAL_MS = 30000
const PAYMENT_MANUAL_CHECK_MIN_INTERVAL_MS = 8000
const PAYMENT_RECHECK_MIN_INTERVAL_MS = 15000
const PAYMENT_CHECK_MAX_AGE_MS = 24 * 60 * 60 * 1000

const PDF_CHECKOUT_COPY = Object.freeze({
  en: {
    maybeLater: 'Maybe Later',
    saved: 'Your PDF is ready and saved in your Library. Read it anytime.',
    ownedTitle: 'PDF Already Purchased',
    ownedBody: 'You already own this PDF. It is available in your Library.',
    checking: 'Checking your existing PDF payment. Do not pay again.',
    expired: 'This payment QR has expired. Check the previous payment before attempting anything else. Do not pay again.',
    blocked: 'This PDF has an existing payment. Please check the previous order.',
    unavailable: 'A secure payment link is unavailable. Do not use an unrelated payment link.',
  },
  km: {
    maybeLater: 'ពេលក្រោយ',
    saved: 'PDF របស់អ្នកមានក្នុងបណ្ណាល័យរួចហើយ។ អ្នកអាចអានពេលណាក៏បាន។',
    ownedTitle: 'អ្នកបានទិញ PDF នេះរួចហើយ',
    ownedBody: 'PDF នេះមានក្នុងបណ្ណាល័យរបស់អ្នក។ មិនចាំបាច់ទិញម្ដងទៀតទេ។',
    checking: 'កំពុងពិនិត្យការទូទាត់ចាស់។ សូមកុំទូទាត់ម្ដងទៀត។',
    expired: 'QR ផុតកំណត់ហើយ។ សូមពិនិត្យការទូទាត់ចាស់ជាមុន កុំទិញម្ដងទៀត។',
    blocked: 'PDF នេះមាន Order ចាស់រួចហើយ។ សូមពិនិត្យការទូទាត់មុន។',
    unavailable: 'មិនមានតំណទូទាត់ដែលភ្ជាប់នឹង Order នេះទេ។ សូមកុំប្រើតំណផ្សេង។',
  },
  zh: {
    maybeLater: '稍后再说',
    saved: 'PDF 已保存到您的书库，随时可以阅读。',
    ownedTitle: '您已购买此 PDF',
    ownedBody: '此 PDF 已在您的书库，无需再次购买。',
    checking: '正在核实之前的付款，请勿重复支付。',
    expired: '付款二维码已过期，请先核实原付款，不要重复支付。',
    blocked: '此 PDF 已有待核实的订单，请先查看原订单。',
    unavailable: '无法提供与此订单对应的安全付款链接。',
  },
  ja: {
    maybeLater: 'あとで',
    saved: 'PDF はライブラリに保存されています。いつでも読めます。',
    ownedTitle: 'この PDF は購入済みです',
    ownedBody: 'ライブラリからいつでも読めます。再購入は不要です。',
    checking: '以前のお支払いを確認中です。再度支払わないでください。',
    expired: '決済 QR の期限が切れました。以前のお支払いを確認してください。',
    blocked: 'この PDF には確認待ちの注文があります。',
    unavailable: 'この注文に対応する安全な決済リンクがありません。',
  },
  ko: {
    maybeLater: '나중에',
    saved: 'PDF가 라이브러리에 저장되었습니다. 언제든 읽을 수 있습니다.',
    ownedTitle: '이미 구매한 PDF입니다',
    ownedBody: '라이브러리에서 읽을 수 있습니다. 다시 구매하지 마세요.',
    checking: '기존 결제를 확인 중입니다. 다시 결제하지 마세요.',
    expired: '결제 QR이 만료되었습니다. 기존 결제를 먼저 확인하세요.',
    blocked: '이 PDF에 기존 주문이 있습니다. 결제 상태를 먼저 확인하세요.',
    unavailable: '이 주문에 연결된 안전한 결제 링크가 없습니다.',
  },
})
const CHECKOUT_FIX_COPY = {
  en: {
    methods: 'PDF payment methods could not be confirmed for your account. Please retry.',
    cart: 'Please check out products from different authors, or printed books and PDFs, separately.',
    physical: 'Paper book payment is available in Cambodia or with an eligible country exception only.',
  },
  km: {
    methods: 'មិនអាចផ្ទៀងផ្ទាត់វិធីបង់ប្រាក់ PDF សម្រាប់គណនីនេះបានទេ។ សូមព្យាយាមម្ដងទៀត។',
    cart: 'សូមបង់ប្រាក់ដាច់ដោយឡែក សម្រាប់អ្នកនិពន្ធផ្សេងគ្នា ឬសៀវភៅក្រដាស និង PDF។',
    physical: 'ការទូទាត់សៀវភៅក្រដាសអាចធ្វើបានតែនៅកម្ពុជា ឬគណនីដែលមានសិទ្ធិពិសេសប៉ុណ្ណោះ។',
  },
  zh: {
    methods: '无法确认此账户可用的 PDF 付款方式，请重试。',
    cart: '不同作者的商品以及纸质书和 PDF 请分别结账。',
    physical: '纸质书仅限柬埔寨或获得特别授权的账户购买。',
  },
  ja: {
    methods: 'PDF の支払い方法を確認できません。再試行してください。',
    cart: '異なる作者の商品、紙の本と PDF は別々に決済してください。',
    physical: '紙の本はカンボジアまたは特別に許可されたアカウントのみ購入できます。',
  },
  ko: {
    methods: 'PDF 결제 수단을 확인할 수 없습니다. 다시 시도해 주세요.',
    cart: '다른 작가의 상품 및 종이책과 PDF는 별도로 결제해 주세요.',
    physical: '종이책은 캄보디아 또는 특별 허용된 계정에서만 구매할 수 있습니다.',
  },
}

function currentPendingAuthorPayment() {
  try {
    const saved = JSON.parse(localStorage.getItem('shadow_author_current_order_payment') || 'null')
    const order = saved?.order
    const createdAt = Date.parse(saved?.created_at || '')
    if (!order?.order_id || !Number.isFinite(createdAt)) return null
if (Date.now() - createdAt > PAYMENT_CHECK_MAX_AGE_MS) return null
if (localStorage.getItem(PAYMENT_SUCCESS_SEEN_KEY) === String(order.order_id)) return null

const expiresAt = Date.parse(order.expires_at || '')

if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
  return null
}

return order
  } catch {
    return null
  }
}

function getPaymentQrImage(order) {
  const raw = String(order?.qr_image || '').trim()
  if (!raw) return ''
  if (/^data:image\/png;base64,/i.test(raw) || /^https:\/\//i.test(raw)) return raw
  if (/^[A-Za-z0-9+/=\s]+$/.test(raw)) return `data:image/png;base64,${raw.replace(/\s/g, '')}`
  return ''
}
function getPaywayOpenUrl(order) {
  const deeplink = String(order?.deeplink || '').trim()
  const checkoutUrl = String(order?.checkout_url || '').trim()

  if (/^abamobilebank:\/\//i.test(deeplink)) return deeplink
  if (/^https:\/\//i.test(deeplink)) return deeplink
  if (/^https:\/\//i.test(checkoutUrl)) return checkoutUrl

  return ''
}

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

const DELIVERY_COMPANIES = [
  {
    id: 'jnt',
    name: 'J&T',
    label: 'J&T Express',
    fee: 2,
    logo: '/assets/Icons/J&T.svg',
  },
  {
    id: 'vet',
    name: 'VET',
    label: 'Vireak Buntham Express',
    fee: 2,
    logo: '/assets/Icons/VET.svg',
  },
]

const DELIVERY_CHECKOUT_LABELS = Object.freeze({
  en: {
    loading: 'Loading delivery companies...',
    error: 'Could not load delivery companies. Please retry.',
    retry: 'Retry',
    changed: 'Delivery company details or fees changed. Please review before paying.',
    missing: 'The cart does not identify this author store. Please add this book to the cart again.',
  },
  km: {
    loading: 'កំពុងផ្ទុកក្រុមហ៊ុនដឹកជញ្ជូន...',
    error: 'មិនអាចផ្ទុកក្រុមហ៊ុនដឹកជញ្ជូនបានទេ។ សូមព្យាយាមម្ដងទៀត។',
    retry: 'ព្យាយាមម្ដងទៀត',
    changed: 'ព័ត៌មាន ឬថ្លៃដឹកជញ្ជូនបានផ្លាស់ប្ដូរ។ សូមពិនិត្យមុនទូទាត់។',
    missing: 'មិនអាចកំណត់ហាងអ្នកនិពន្ធពីកន្ត្រកបានទេ។ សូមដាក់សៀវភៅចូលកន្ត្រកម្ដងទៀត។',
  },
  zh: {
    loading: '正在加载配送公司...', error: '无法加载配送公司，请重试。', retry: '重试',
    changed: '配送公司信息或费用已变更，请付款前重新确认。', missing: '购物车中缺少作者商店信息。请重新加入该书。',
  },
  ja: {
    loading: '配送会社を読み込み中...', error: '配送会社を読み込めません。再試行してください。', retry: '再試行',
    changed: '配送会社の情報または料金が変更されました。支払い前に確認してください。', missing: 'カートに作者ストア情報がありません。再度追加してください。',
  },
  ko: {
    loading: '배송사를 불러오는 중...', error: '배송사를 불러오지 못했습니다. 다시 시도하세요.', retry: '다시 시도',
    changed: '배송사 정보 또는 요금이 변경되었습니다. 결제 전에 확인하세요.', missing: '장바구니에 작가 상점 정보가 없습니다. 책을 다시 추가해 주세요.',
  },
})

async function fetchCheckoutDeliveryCompanies({ pageUsername, productId, authorPageId, signal }) {
  if (!pageUsername || !productId) {
    const error = new Error('Missing author store information in the cart.')
    error.code = 'DELIVERY_STORE_MISSING'
    throw error
  }

  const url = `${API_URL}/api/author-store/page/${encodeURIComponent(pageUsername)}/products?product_id=${encodeURIComponent(productId)}&include_delivery_settings=1`
  const response = await fetch(url, { cache: 'no-store', signal })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok !== true) {
    throw new Error(data.message || 'Could not load delivery settings.')
  }
  if (!Array.isArray(data.products) || data.products.length !== 1 ||
      String(data.products[0]?.id) !== String(productId) ||
      (authorPageId && String(data.author_page_id) !== authorPageId) ||
      !Array.isArray(data.delivery_settings)) {
    throw new Error('Invalid author store delivery response.')
  }

  const companies = []
  for (const setting of data.delivery_settings) {
    if (setting?.is_active !== true) continue
    const id = String(setting.company_key || '').trim().toLowerCase()
    const known = DELIVERY_COMPANIES.find((item) => item.id === id)
    if (id !== 'custom' && !known) continue

    const label = String(setting.company_name || '').trim()
    const fee = Number(setting.fee_usd)
    const logo = id === 'custom' ? String(setting.logo_url || '').trim() : known.logo
    if (!label || !Number.isFinite(fee) || fee < 0 || fee > 9999.99 ||
        Math.abs(fee * 100 - Math.round(fee * 100)) > 1e-6) {
      throw new Error('Invalid delivery company information.')
    }
    if (id === 'custom') {
      try {
        const imageUrl = new URL(logo)
        if (imageUrl.protocol !== 'https:' || imageUrl.username || imageUrl.password) throw new Error()
      } catch {
        throw new Error('Invalid company logo URL.')
      }
    }
    if (companies.some((item) => item.id === id)) throw new Error('Duplicate delivery company.')
    companies.push({
      id,
      name: id === 'custom' ? label : known.name,
      label,
      fee,
      logo,
    })
  }

  if (!companies.length) throw new Error('No delivery companies are available for this author store.')
  return companies
}

function safeCheckoutCoverUrl(value) {
  const source = String(value || '').trim()
  if (!source) return ''

  if (/^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(source)) {
    return source
  }

  try {
    const url = new URL(source, window.location.origin)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href
    if (url.protocol === 'blob:' && url.origin === window.location.origin) return url.href
  } catch {
    return ''
  }

  return ''
}

function validCheckoutQuantity(value) {
  const quantity = Number(value)
  return Number.isFinite(quantity) ? Math.max(1, Math.min(99, Math.trunc(quantity))) : 1
}

function isPdfCheckoutItem(item) {
  return String(item?.type || item?.product_type || '').toLowerCase() === 'pdf' || Boolean(item?.smart_pdf_offer_token)
}

function getCartItems() {
  try {
    const raw = localStorage.getItem('shadow_author_cart_items') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item === 'object' && item.id !== null && item.id !== undefined && String(item.id).trim()).map((item) => ({
          ...item,
          quantity: isPdfCheckoutItem(item) ? 1 : validCheckoutQuantity(item.quantity),
        }))
      : []
  } catch {
    return []
  }
}

function getCheckoutReturnPath(items) {
  const sources = new Set((items || []).map((item) =>
    item.promotion_entry_source === 'manga' ? '/manga'
      : item.promotion_entry_source === 'stories' ? '/'
      : item.discover_promotion_rotation_key ? '/discover' : '/store'
  ))
  return sources.size === 1 ? [...sources][0] : '/store'
}

function safeCheckoutReturnPath(path) {
  return ['/', '/manga', '/discover', '/store'].includes(path) ? path : '/store'
}

function checkoutReturnLabel(path) {
  return {
    '/': 'backToStories',
    '/manga': 'backToManga',
    '/discover': 'backToDiscover',
    '/store': 'backToStore',
  }[path] || 'backToStore'
}

function saveCartItems(items) {
  localStorage.setItem('shadow_author_cart_items', JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

function getBuyerProfile() {
  let legacy = {}

  try {
    const saved = JSON.parse(localStorage.getItem('shadow_mall_buyer_profile') || 'null')
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) legacy = saved
  } catch {}

  const reader = getReaderUser()

  return {
    name: legacy.name || reader?.name || reader?.full_name || reader?.display_name || '',
    phone_number: legacy.phone_number || legacy.phone || '',
    telegram_username: legacy.telegram_username || legacy.telegram || '',
    facebook_link: legacy.facebook_link || legacy.facebook || '',
    delivery_address: legacy.delivery_address || legacy.address || '',
    delivery_note: legacy.delivery_note || '',
    province_city: legacy.province_city || 'Phnom Penh',
  }
}

async function saveBuyerProfile(profile) {
  const token = getReaderToken()
  if (!token) throw new Error('Reader login is required')

  const response = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to save buyer profile')
  }

  try {
    localStorage.removeItem('shadow_mall_buyer_profile')
  } catch {}

  return { ...profile, ...(data.profile || {}) }
}
function getReaderUser() {
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

function money(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function number(value) {
  return Number(value || 0).toLocaleString(getDisplayLanguageId())
}

function createOrderId() {
  return `AOH${Date.now().toString(36).toUpperCase()}`
}

function saveAuthorOrder({ items, subtotal, deliveryFee, deliveryCompany, deliveryNote, buyerProfile }) {
  const firstItem = Array.isArray(items) ? items[0] || {} : {}
  const rawOrders = localStorage.getItem('shadow_author_order_history') || '[]'
  const orders = JSON.parse(rawOrders)
  const safeOrders = Array.isArray(orders) ? orders : []

  const nextOrder = {
    order_id: createOrderId(),
    transaction_id: '',
    status: 'waiting',
    created_at: new Date().toISOString(),
    source: 'author_store',
    author_page_id: firstItem.author_page_id || '',
    author_page_name: firstItem.author_page_name || '',
    author_page_username: firstItem.author_page_username || '',
    items,
    subtotal,
    delivery_fee: deliveryFee,
    total: Number(subtotal || 0) + Number(deliveryFee || 0),
    delivery: deliveryCompany?.name || '',
    delivery_company: deliveryCompany || null,
    delivery_note: deliveryNote || '',
    buyer_profile: buyerProfile || {},
  }

  localStorage.setItem('shadow_author_order_history', JSON.stringify([nextOrder, ...safeOrders]))
  return nextOrder
}

function BuyerProfileSheet({ open, profile, onClose, onSave }) {
  const { t } = useDisplayTranslation()
  const [name, setName] = useState(profile.name || getReaderUser()?.name || '')
  const [phone, setPhone] = useState(profile.phone_number || '')
  const [telegram, setTelegram] = useState(profile.telegram_username || '')
  const [facebook, setFacebook] = useState(profile.facebook_link || '')
 const [address, setAddress] = useState(profile.delivery_address || profile.address || '')
  const [error, setError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const saveProfileRef = useRef(false)

  useEffect(() => {
    if (!open) return
    setName(profile.name || getReaderUser()?.name || '')
    setPhone(profile.phone_number || '')
    setTelegram(profile.telegram_username || '')
    setFacebook(profile.facebook_link || '')
    setAddress(profile.delivery_address || profile.address || '')
  }, [open, profile])

  if (!open) return null

  async function handleSave() {
    if (saveProfileRef.current) return
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError(t('authorCheckout.requiredFields'))
      return
    }

    const nextProfile = {
  name: name.trim(),
  phone_number: phone.trim(),
  telegram_username: telegram.trim(),
  facebook_link: facebook.trim(),
  delivery_address: address.trim(),
  delivery_note: profile.delivery_note || '',
  province_city: profile.province_city || 'Phnom Penh',
}

    try {
      saveProfileRef.current = true
      setError('')
      setSavingProfile(true)
      const savedProfile = await saveBuyerProfile(nextProfile)
      onSave(savedProfile)
    } catch (error) {
      setError(error.message || t('authorCheckout.failedSaveProfile'))
    } finally {
      saveProfileRef.current = false
      setSavingProfile(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/35">
      <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-[var(--shadow-bg-surface)] shadow-2xl sm:left-1/2 sm:max-w-[430px] sm:-translate-x-1/2">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-5 py-4">
          <div>
            <h2 className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.buyerProfile')}</h2>
            <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.buyerProfileHelp')}</p>
          </div>
          <button type="button" aria-label={t('authorCheckout.close')} onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] active:scale-95">
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="space-y-4 px-5 pb-5 pt-4">
          {error ? (
            <button type="button" onClick={() => setError('')} className="w-full rounded-2xl bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
              {error}
            </button>
          ) : null}

          <div>
            <label className="mb-2 block text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.name')} <span className="text-[#e5484d]">*</span></label>
            <input value={name} onChange={(event) => setName(event.target.value)} className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[13px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]" />
            <p className="mt-2 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.nameHelp')}</p>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.phoneNumber')} <span className="text-[#e5484d]">*</span></label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[13px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]" />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.telegramUsername')}</label>
            <input value={telegram} onChange={(event) => setTelegram(event.target.value)} placeholder="@username" className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[13px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]" />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.facebookLink')}</label>
            <input value={facebook} onChange={(event) => setFacebook(event.target.value)} placeholder="https://facebook.com/..." className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[13px] font-bold text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]" />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.deliveryAddress')} <span className="text-[#e5484d]">*</span></label>
            <textarea value={address} onChange={(event) => setAddress(event.target.value)} className="min-h-[96px] w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[13px] font-bold leading-6 text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]" />
          </div>

          <button type="button" onClick={handleSave} disabled={savingProfile} className="h-12 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-xl active:scale-[0.98] disabled:opacity-50">
            {t('authorCheckout.saveInformation')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorCheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const pdfCopy = PDF_CHECKOUT_COPY[getDisplayLanguageId()] || PDF_CHECKOUT_COPY.en
  const checkoutFixCopy = CHECKOUT_FIX_COPY[getDisplayLanguageId()] || CHECKOUT_FIX_COPY.en
  const [items, setItems] = useState(getCartItems)
  const promotionExpired = useDiscoverPromotionExpiry(items)
  const [buyerProfile, setBuyerProfile] = useState(getBuyerProfile)
  const [buyerOpen, setBuyerOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(DELIVERY_COMPANIES[0].id)
  const [deliveryCompanies, setDeliveryCompanies] = useState([])
  const [deliveryStatus, setDeliveryStatus] = useState('loading')
  const [deliveryLoadError, setDeliveryLoadError] = useState('')
  const [deliveryReloadKey, setDeliveryReloadKey] = useState(0)
  const deliveryCopy = DELIVERY_CHECKOUT_LABELS[getDisplayLanguageId()] || DELIVERY_CHECKOUT_LABELS.en
  const deliveryCartBook = items.find((item) =>
    String(item.type || item.product_type || '').toLowerCase() === 'book'
  )
  const deliveryProductId = String(deliveryCartBook?.id || deliveryCartBook?.product_id || '').trim()
  const deliveryAuthorPageId = String(deliveryCartBook?.author_page_id || '').trim()
  const deliveryPageUsername = String(
    deliveryCartBook?.author_page_username ||
    items.find((item) => String(item.author_page_id || '') === deliveryAuthorPageId && item.author_page_username)?.author_page_username ||
    ''
  ).trim()
  const [deliveryNote, setDeliveryNote] = useState(() => getBuyerProfile().delivery_note || '')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const paymentSubmissionRef = useRef(false)
  const [paidBookOrder, setPaidBookOrder] = useState(null)
  const [paidPdfOrder, setPaidPdfOrder] = useState(null)
  const [paymentModal, setPaymentModal] = useState(currentPendingAuthorPayment)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [paymentClock, setPaymentClock] = useState(Date.now())
  const [paymentMethod, setPaymentMethod] = useState('aba')
  const [methodAvailability, setMethodAvailability] = useState({
  aba: false,
  binance: false,
  ready: false,
})
const [binanceProfileOpen, setBinanceProfileOpen] = useState(false)
const methodRequestRef = useRef(0)

async function refreshPdfMethods() {
  const requestId = ++methodRequestRef.current

  setMethodAvailability({
    aba: false,
    binance: false,
    ready: false,
  })

  const settings = await loadCountrySettings({ force: true }).catch(() => null)

  if (requestId !== methodRequestRef.current) return

  const verified = settings?.countryVerified === true
  const aba = verified &&
    getCountryFeature(settings, 'pdfPayway', false) === true
  const binance = verified &&
    getCountryFeature(settings, 'pdfBinancePay', false) === true

  setMethodAvailability({
    aba,
    binance,
    ready: true,
  })

  setPaymentMethod((current) => {
    if (current === 'aba' && aba) return 'aba'
    if (current === 'binance' && binance) return 'binance'
    if (aba) return 'aba'
    if (binance) return 'binance'
    return 'aba'
  })
}

useEffect(() => {
  void refreshPdfMethods()
  return () => {
    methodRequestRef.current += 1
  }
}, [])

  useEffect(() => {
    const syncCart = () => {
      const latest = getCartItems()
      setItems((current) => JSON.stringify(current) === JSON.stringify(latest) ? current : latest)
    }
    const onStorage = (event) => {
      if (event.key === 'shadow_author_cart_items' || event.key === null) syncCart()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') syncCart()
    }
    window.addEventListener('shadow-author-cart-updated', syncCart)
    window.addEventListener('storage', onStorage)
    window.addEventListener('pageshow', syncCart)
    window.addEventListener('focus', syncCart)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('shadow-author-cart-updated', syncCart)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('pageshow', syncCart)
      window.removeEventListener('focus', syncCart)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  useEffect(() => {
    if (!deliveryCartBook) {
      setDeliveryCompanies([])
      setDeliveryStatus('idle')
      setDeliveryLoadError('')
      return undefined
    }

    const controller = new AbortController()
    setDeliveryStatus('loading')
    setDeliveryCompanies([])
    setDeliveryLoadError('')

    void fetchCheckoutDeliveryCompanies({
      pageUsername: deliveryPageUsername,
      productId: deliveryProductId,
      authorPageId: deliveryAuthorPageId,
      signal: controller.signal,
    }).then((companies) => {
      if (controller.signal.aborted) return
      setDeliveryCompanies(companies)
      setSelectedCompanyId((current) => companies.some((company) => company.id === current) ? current : companies[0].id)
      setDeliveryStatus('ready')
    }).catch((error) => {
      if (controller.signal.aborted) return
      setDeliveryLoadError(error.code === 'DELIVERY_STORE_MISSING' ? deliveryCopy.missing : error.message || deliveryCopy.error)
      setDeliveryStatus('error')
    })

    return () => controller.abort()
  }, [deliveryProductId, deliveryAuthorPageId, deliveryPageUsername, deliveryReloadKey])

  useEffect(() => {
    try {
      localStorage.removeItem('shadow_mall_buyer_profile')
    } catch {}

    const token = getReaderToken()
    if (!token) return undefined

    const controller = new AbortController()

    async function loadBuyerProfile() {
      try {
        const response = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })

        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false || !data.profile || controller.signal.aborted) return

        setBuyerProfile(current => ({ ...current, ...data.profile }))
        setDeliveryNote(data.profile.delivery_note || '')
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load buyer profile:', error)
        }
      }
    }

    void loadBuyerProfile()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!paymentModal) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setInterval(() => setPaymentClock(Date.now()), 1000)
    return () => {
      window.clearInterval(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [paymentModal?.order_id])

  useEffect(() => {
    let active = true
    let lastCheckedAt = 0
    let requestPending = false
    let verifiedOrderId = ''
    let nextPaymentRecheckAt = 0
    const controller = new AbortController()

    async function checkPayment(force = false) {
      const manual = force === true
      if (!active || requestPending || document.visibilityState === 'hidden') return
      if (Date.now() - lastCheckedAt < (manual ? PAYMENT_MANUAL_CHECK_MIN_INTERVAL_MS : PAYMENT_CHECK_MIN_INTERVAL_MS)) return

      let saved
      try {
        saved = JSON.parse(localStorage.getItem('shadow_author_current_order_payment') || 'null')
      } catch {
        return
      }

      const orderId = String(saved?.order?.order_id || '').trim()
      if (verifiedOrderId === orderId) return
      const createdAt = Date.parse(saved?.created_at || '')
      const token = getReaderToken()
      if (!orderId || !token || !Number.isFinite(createdAt) || Date.now() - createdAt > PAYMENT_CHECK_MAX_AGE_MS) return
      if (localStorage.getItem(PAYMENT_SUCCESS_SEEN_KEY) === orderId) return

      lastCheckedAt = Date.now()
      requestPending = true
      if (manual) {
        setCheckingPayment(true)
        setPaymentMessage('')
      }

      try {
        const response = await fetch(`${API_URL}/api/author-store/orders/status/${encodeURIComponent(orderId)}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        if (!response.ok) {
          if (manual) setPaymentMessage(t('authorCheckout.paymentUnavailable'))
          return
        }

        const data = await response.json().catch(() => ({}))
        let order = data.order
        if (!active) return
        if (data.ok === false || String(order?.order_id || '') !== orderId) {
          if (manual) setPaymentMessage(t('authorCheckout.paymentUnavailable'))
          return
        }
        
        const orderItems = Array.isArray(order.items) && order.items.length
          ? order.items
          : Array.isArray(saved.order?.items) ? saved.order.items : []
        const hasBook = orderItems.some((item) => String(item.product_type || item.type || '').toLowerCase() === 'book')
        const pdfOnly = orderItems.length > 0 && orderItems.every((item) => String(item.product_type || item.type || '').toLowerCase() === 'pdf')
        const confirmedPdfPurchase = pdfOnly
        if (!hasBook && !confirmedPdfPurchase) return

        if (
          confirmedPdfPurchase &&
          (
            String(order.payment_status || '').toLowerCase() !== 'paid' ||
            String(order.pdf_unlock_status || '').toLowerCase() !== 'unlocked'
          )
        ) {
          const recheckKey = `shadow_author_pdf_recheck_after_v1:${orderId}`
          const now = Date.now()
          let savedNextRecheckAt = 0
          try {
            savedNextRecheckAt = Number(localStorage.getItem(recheckKey) || 0)
          } catch {
            savedNextRecheckAt = 0
          }

          const validSavedRecheckAt = Number.isFinite(savedNextRecheckAt)
            && savedNextRecheckAt > now
            && savedNextRecheckAt <= now + 120000
            ? savedNextRecheckAt
            : 0

          if (now < Math.max(nextPaymentRecheckAt, validSavedRecheckAt)) {
            if (manual) setPaymentMessage(pdfCopy.checking)
            return
          }

          const reserveRecheckUntil = (delayMs) => {
            const until = Date.now() + Math.max(PAYMENT_RECHECK_MIN_INTERVAL_MS, delayMs)
            nextPaymentRecheckAt = Math.max(nextPaymentRecheckAt, until)
            try {
              const previous = Number(localStorage.getItem(recheckKey) || 0)
              const validPrevious = Number.isFinite(previous)
                && previous > Date.now()
                && previous <= Date.now() + 120000
                ? previous
                : 0
              localStorage.setItem(recheckKey, String(Math.max(nextPaymentRecheckAt, validPrevious)))
            } catch {
              nextPaymentRecheckAt = Math.max(nextPaymentRecheckAt, until)
            }
          }

          reserveRecheckUntil(PAYMENT_RECHECK_MIN_INTERVAL_MS)

          const recoveryResponse = await fetch(
            `${API_URL}/api/author-store/orders/${encodeURIComponent(orderId)}/recheck-pdf-payment`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          )

          const recovery = await recoveryResponse.json().catch(() => ({}))

          if (recoveryResponse.status === 429) {
            const retryAfter = Number(recoveryResponse.headers.get('Retry-After'))
            reserveRecheckUntil(Number.isFinite(retryAfter) && retryAfter > 0
              ? Math.min(120000, retryAfter * 1000)
              : 60000)
          } else if (recovery.state === 'verification_unavailable') {
            const retryAfter = Number(recovery.retry_after_seconds)
            reserveRecheckUntil(Number.isFinite(retryAfter) && retryAfter > 0
              ? Math.min(120000, retryAfter * 1000)
              : 30000)
          } else if (recovery.state === 'payment_recheck_required') {
            reserveRecheckUntil(60000)
          }

          if (!recoveryResponse.ok || recovery.state !== 'purchased') {
            if (manual) setPaymentMessage(pdfCopy.checking)
            return
          }

          try {
            localStorage.removeItem(recheckKey)
          } catch {
          }
          nextPaymentRecheckAt = 0

          const refreshed = await fetch(
            `${API_URL}/api/author-store/orders/status/${encodeURIComponent(orderId)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          )

          const refreshedData = await refreshed.json().catch(() => ({}))

          if (!refreshed.ok || !refreshedData.order || !active) {
            if (manual) setPaymentMessage(pdfCopy.checking)
            return
          }

          order = refreshedData.order
        }

        if (String(order.payment_status || '').toLowerCase() !== 'paid') {
          if (manual) setPaymentMessage(pdfCopy.checking)
          return
        }

        let pdfItem = null
        let pdfProductId = ''
        if (confirmedPdfPurchase) {
          if (String(order.pdf_unlock_status || '').toLowerCase() !== 'unlocked') {
            if (manual) setPaymentMessage(t(String(order.pdf_unlock_status || '').toLowerCase() === 'failed' ? 'authorCheckout.pdfUnlockFailed' : 'authorCheckout.paymentPending'))
            return
          }
          pdfItem = orderItems[0]
          pdfProductId = String(pdfItem.product_id || '').trim()
          if (!pdfProductId) return
        }

        const purchasedItems = Array.isArray(saved.checkout_items) ? saved.checkout_items : []
        if (purchasedItems.length) {
          const currentItems = getCartItems()
          const remainingItems = currentItems.filter((item) => !purchasedItems.some((purchased) =>
            String(purchased.id) === String(item.id) && Number(purchased.quantity) === Number(item.quantity)
          ))
          if (remainingItems.length !== currentItems.length) saveCartItems(remainingItems)
        }

        verifiedOrderId = orderId
        setPaymentModal(null)
        setPaymentMessage('')
        if (confirmedPdfPurchase) {
          setPaidPdfOrder({
            orderId,
            productId: pdfProductId,
            title: String(pdfItem.product_title || pdfItem.title || '').trim() || 'PDF',
            returnPath: safeCheckoutReturnPath(saved.return_path),
          })
        } else {
          setPaidBookOrder({
            orderId,
            returnPath: safeCheckoutReturnPath(saved.return_path),
          })
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        if (manual) setPaymentMessage(t('authorCheckout.paymentUnavailable'))
      } finally {
        requestPending = false
        if (manual) setCheckingPayment(false)
      }
    }

    function requestPaymentCheck() {
      void checkPayment(true)
    }

    function checkVisiblePayment() {
      if (document.visibilityState === 'visible') void checkPayment()
    }

    void checkPayment()
    const paymentPollTimer = window.setInterval(checkVisiblePayment, PAYMENT_CHECK_MIN_INTERVAL_MS)
    window.addEventListener('focus', checkVisiblePayment)
    window.addEventListener('pageshow', checkVisiblePayment)
    window.addEventListener('shadow-author-payment-check', requestPaymentCheck)
    document.addEventListener('visibilitychange', checkVisiblePayment)
    return () => {
      active = false
      controller.abort()
      window.clearInterval(paymentPollTimer)
      window.removeEventListener('focus', checkVisiblePayment)
      window.removeEventListener('pageshow', checkVisiblePayment)
      window.removeEventListener('shadow-author-payment-check', requestPaymentCheck)
      document.removeEventListener('visibilitychange', checkVisiblePayment)
    }
  }, [])

  function closeOrderSuccess(path) {
    if (!paidBookOrder) return
    localStorage.setItem(PAYMENT_SUCCESS_SEEN_KEY, paidBookOrder.orderId)
    setPaidBookOrder(null)
    navigate(path)
  }

  function closePdfSuccess(readNow) {
    if (!paidPdfOrder) return
    localStorage.setItem(PAYMENT_SUCCESS_SEEN_KEY, paidPdfOrder.orderId)
    const productId = paidPdfOrder.productId
    const title = paidPdfOrder.title
    const returnPath = safeCheckoutReturnPath(paidPdfOrder.returnPath)
    setPaidPdfOrder(null)
    if (readNow) {
      navigate(`/discover/pdf/${encodeURIComponent(productId)}`, { state: { title } })
    } else {
      navigate(returnPath)
    }
  }

  const selectedCompany = deliveryCompanies.find((company) => company.id === selectedCompanyId) || null
  const subtotal = useMemo(() => items.reduce((sum, item) => {
    const price = Number(item.price_value)
    return sum + (Number.isFinite(price) && price >= 0 ? price : 0) * validCheckoutQuantity(item.quantity)
  }, 0), [items])
  const needsDelivery = Boolean(deliveryCartBook)
  const deliveryReady = !needsDelivery || (deliveryStatus === 'ready' && Boolean(selectedCompany))
  const deliveryFee = needsDelivery && selectedCompany ? selectedCompany.fee : 0
  const total = subtotal + deliveryFee
  const itemCount = items.reduce((sum, item) => sum + validCheckoutQuantity(item.quantity), 0)
  const hasBuyerProfile = Boolean(
  (buyerProfile.name || '').trim() &&
  (buyerProfile.phone_number || buyerProfile.phone || '').trim() &&
  (buyerProfile.delivery_address || buyerProfile.address || '').trim()
)

  function updateQuantity(id, nextQuantity) {
    if (paymentSubmissionRef.current) return
    const nextItems = getCartItems().map((item) => (
      String(item.id) === String(id) ? { ...item, quantity: isPdfCheckoutItem(item) ? 1 : validCheckoutQuantity(nextQuantity) } : item
    ))
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  function removeItem(id) {
    if (paymentSubmissionRef.current) return
    const nextItems = getCartItems().filter((item) => String(item.id) !== String(id))
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  function handleExistingPdfCheckoutResult(result, selectedItems) {
    const restrictions = Array.isArray(result?.products)
      ? result.products.filter((row) => row.product_type === 'pdf' && row.state !== 'available')
      : []

    if (!restrictions.length) return false

    if (
      selectedItems.length !== 1 ||
      String(selectedItems[0].type || selectedItems[0].product_type || '').toLowerCase() === 'book'
    ) {
      setMessage(result.message || pdfCopy.blocked)
      return true
    }

    const selected = selectedItems[0]
    const productId = String(selected.id || selected.product_id || '')
    const restriction = restrictions.find((row) => String(row.product_id) === productId)

    if (!restriction) {
      setMessage(result.message || pdfCopy.blocked)
      return true
    }

    if (restriction.state === 'purchased') {
      saveCartItems(
        getCartItems().filter(
          (item) => String(item.id || item.product_id) !== productId
        )
      )

      setPaymentModal(null)

      setPaidPdfOrder({
        orderId: restriction.order_id || '',
        productId,
        title: selected.title || 'PDF',
        returnPath: getCheckoutReturnPath(selectedItems),
        alreadyOwned: true,
      })

      return true
    }

    if (restriction.order_id) {
      const previous = {
        order_id: restriction.order_id,
        payment_method:
          restriction.payment_method === 'binance'
            ? 'binance_personal_pay'
            : 'aba_payway',
        payment_status: restriction.payment_status || 'pending',
        pdf_unlock_status: restriction.pdf_unlock_status || 'pending',
        expires_at: restriction.expires_at || '',
        items: [
          {
            product_id: productId,
            product_type: 'pdf',
            quantity: 1,
            product_title: selected.title || 'PDF',
          },
        ],
      }

      localStorage.setItem(
        'shadow_author_current_order_payment',
        JSON.stringify({
          order: previous,
          created_at: new Date().toISOString(),
          return_path: getCheckoutReturnPath(selectedItems),
          checkout_items: [{ id: productId, quantity: 1 }],
        })
      )

      setPaymentModal(previous)
      setPaymentMessage(pdfCopy.checking)
      window.dispatchEvent(new Event('shadow-author-payment-check'))

      return true
    }

    setMessage(result.message || pdfCopy.blocked)
    return true
  }

  async function handleContinuePayment() {
  if (paymentSubmissionRef.current) return
  const latestItems = getCartItems()
  if (JSON.stringify(latestItems) !== JSON.stringify(items)) {
    setItems(latestItems)
    return
  }
  if (hasExpiredDiscoverPromotion(latestItems)) {
    setMessage(discoverPromotionExpiryMessage())
    return
  }
  const token = getReaderToken()

  if (!token) {
  setMessage(t('authorCheckout.pleaseLogin'))
  navigate('/login')
  return
}

  if (!items.length) {
  setMessage(t('authorCheckout.cartEmpty'))
  return
}

const firstAuthor = latestItems[0]
const firstAuthorId = String(firstAuthor.author_page_id || '').trim()
const firstUsername = String(firstAuthor.author_page_username || '').trim().toLowerCase()

const differentAuthors = latestItems.some((item) => {
  const authorId = String(item.author_page_id || '').trim()
  const username = String(item.author_page_username || '').trim().toLowerCase()

  if (firstAuthorId && authorId) {
    return firstAuthorId !== authorId
  }

  return username !== firstUsername
})

const mixedProductTypes =
  latestItems.some(isPdfCheckoutItem) &&
  latestItems.some((item) => !isPdfCheckoutItem(item))

if (differentAuthors || mixedProductTypes) {
  setMessage(checkoutFixCopy.cart)
  return
}

if (needsDelivery && !deliveryReady) {
    setMessage(deliveryLoadError || deliveryCopy.error)
    return
  }

  if (needsDelivery && !hasBuyerProfile) {
  setBuyerOpen(true)
  return
}

  const profile = {
    phone_number: buyerProfile.phone_number || '',
    province_city: buyerProfile.province_city || 'Phnom Penh',
    delivery_address: buyerProfile.delivery_address || '',
    delivery_note: deliveryNote || buyerProfile.delivery_note || '',
    telegram_username: buyerProfile.telegram_username || '',
    facebook_link: buyerProfile.facebook_link || '',
  }

  try {
    paymentSubmissionRef.current = true
        setSaving(true)
    setMessage('')

        let countryTicket = null

    if (needsDelivery) {
  const settings = await loadCountrySettings({ force: true })

  if (settings?.countryVerified !== true) {
    throw new Error(checkoutFixCopy.physical)
  }

  const physicalAllowed =
    settings.country === 'KH' ||
    (
      settings.countryPolicyEnabled === true &&
      settings.hasException === true &&
      getCountryFeature(settings, 'physicalBooks', false) === true
    )

  if (!physicalAllowed) {
    throw new Error(checkoutFixCopy.physical)
  }

  if (settings.countryPolicyEnabled === true) {
    if (
      getCountryFeature(settings, 'physicalBooks', false) !== true ||
      getCountryFeature(settings, 'payway', false) !== true
    ) {
      throw new Error(checkoutFixCopy.physical)
    }

    countryTicket = await getPaymentCountryTicket()
    if (!countryTicket) {
      throw new Error(t('authorCheckout.failedContinuePayment'))
    }
  }
}

if (!needsDelivery) {
  const rules = await loadCountrySettings({ force: true })

  const feature = paymentMethod === 'binance'
    ? 'pdfBinancePay'
    : 'pdfPayway'

  if (
    rules?.countryVerified !== true ||
    getCountryFeature(rules, feature, false) !== true
  ) {
    throw new Error(checkoutFixCopy.methods)
  }

  if (rules.countryPolicyEnabled === true) {
    countryTicket = await getPaymentCountryTicket()

    if (!countryTicket) {
      throw new Error(t('authorCheckout.failedContinuePayment'))
    }
  }
}
    if (needsDelivery) {
      const savedProfile = await saveBuyerProfile(profile)
      setBuyerProfile(current => ({ ...current, ...savedProfile }))
    }

    const verifiedItems = getCartItems()
    if (JSON.stringify(verifiedItems) !== JSON.stringify(latestItems)) {
      setItems(verifiedItems)
      return
    }
    if (hasExpiredDiscoverPromotion(verifiedItems)) throw new Error(discoverPromotionExpiryMessage())

    if (!needsDelivery) {
      const pdfIds = [
        ...new Set(
          verifiedItems.map((item) =>
            String(item.id || item.product_id || '').trim()
          )
        ),
      ]

      const ownershipResponse = await fetch(
        `${API_URL}/api/author-store/orders/pdf-ownership?product_ids=${encodeURIComponent(pdfIds.join(','))}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const ownershipData = await ownershipResponse.json().catch(() => ({}))

      if (!ownershipResponse.ok || ownershipData.ok !== true) {
        throw new Error(ownershipData.message || pdfCopy.blocked)
      }

      if (handleExistingPdfCheckoutResult(ownershipData, verifiedItems)) {
        return
      }
    }

    let verifiedDeliveryCompany = null
    if (needsDelivery) {
      const latestCompanies = await fetchCheckoutDeliveryCompanies({
        pageUsername: deliveryPageUsername,
        productId: deliveryProductId,
        authorPageId: deliveryAuthorPageId,
      })
      verifiedDeliveryCompany = latestCompanies.find((company) => company.id === selectedCompany.id)
      if (!verifiedDeliveryCompany ||
          verifiedDeliveryCompany.fee !== selectedCompany.fee ||
          verifiedDeliveryCompany.label !== selectedCompany.label ||
          verifiedDeliveryCompany.logo !== selectedCompany.logo) {
        setDeliveryCompanies(latestCompanies)
        setSelectedCompanyId(verifiedDeliveryCompany?.id || latestCompanies[0].id)
        setDeliveryStatus('ready')
        throw new Error(deliveryCopy.changed)
      }
    }

    const useBinance = !needsDelivery && paymentMethod === 'binance'
    const orderResponse = await fetch(`${API_URL}/api/author-store/orders/${useBinance ? 'binance-pdf/checkout' : 'create-payment'}`, {
      method: 'POST',
            headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(countryTicket ? { 'X-Shadow-Country-Ticket': countryTicket } : {}),
      },
      body: JSON.stringify({
        items: verifiedItems,
        delivery_company: verifiedDeliveryCompany
          ? {
              key: verifiedDeliveryCompany.id,
              name: verifiedDeliveryCompany.label,
              shortName: verifiedDeliveryCompany.name,
              fee: verifiedDeliveryCompany.fee,
              logo: verifiedDeliveryCompany.logo,
            }
          : null,
      }),
    })

    const orderData = await orderResponse.json().catch(() => ({}))

    if (!orderResponse.ok || orderData.ok === false) {
      if (
        !needsDelivery &&
        orderResponse.status === 409 &&
        handleExistingPdfCheckoutResult(orderData, verifiedItems)
      ) {
        return
      }

      if (useBinance && orderData.code === 'BINANCE_PROFILE_REQUIRED') {
        setBinanceProfileOpen(true)
      }

      throw new Error(
        orderData.message || t('authorCheckout.failedCreatePayment')
      )
    }

    if (!orderData.order) {
      throw new Error(t('authorCheckout.paymentNotCreated'))
    }

    const nextOrder = useBinance ? {
      ...orderData.order,
      payment_method: 'binance_personal_pay',
      payment_status: 'pending',
      items: verifiedItems.map((item) => ({
        product_id: item.id || item.product_id,
        product_type: 'pdf',
        product_title: item.title || 'PDF',
        quantity: 1,
      })),
      qr_image: orderData.order.checkout_ready === true &&
        orderData.order.qr_path === '/api/purchase/binance/receiver/qr'
        ? `${API_URL}${orderData.order.qr_path}` : '',
    } : orderData.order
    if (useBinance && (!orderData.order.checkout_ready || !nextOrder.qr_image)) {
      throw new Error(t('authorCheckout.pdf_binanceUnavailable'))
    }

    localStorage.setItem(
      'shadow_author_current_order_payment',
      JSON.stringify({
        order: nextOrder,
        created_at: new Date().toISOString(),
        return_path: getCheckoutReturnPath(items),
        checkout_items: items.map((item) => ({ id: item.id, quantity: item.quantity || 1 })),
      })
    )

    setPaymentClock(Date.now())
setPaymentModal(nextOrder)

if (useBinance) {
  setPaymentMessage('')
} else {
  const hasPaymentOption = Boolean(
    getPaymentQrImage(nextOrder) ||
    getPaywayOpenUrl(nextOrder)
  )

  setPaymentMessage(
    hasPaymentOption ? '' : pdfCopy.unavailable
  )
}
  } catch (error) {
    setMessage(error.message || t('authorCheckout.failedContinuePayment'))
  } finally {
    paymentSubmissionRef.current = false
    setSaving(false)
  }
}

  const modalExpiresAt = Date.parse(paymentModal?.expires_at || '')
  const paymentWindowActive = Number.isFinite(modalExpiresAt) && modalExpiresAt > paymentClock

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" aria-label={t('authorCheckout.goBack')} onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/author/cart', { replace: true })
}} className="flex h-10 w-10 items-center justify-center bg-transparent text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <div className="min-w-0 flex-1 px-3 text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.checkout')}</div>
          <button type="button" aria-label={t('authorCheckout.openBuyerProfile')} onClick={() => setBuyerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fa-solid fa-user text-[14px]" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        <DiscoverPromotionExpiryNotice expired={promotionExpired} />
        {message ? (
          <button type="button" onClick={() => setMessage('')} className="mb-3 w-full rounded-[18px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold text-[#e5484d]">
            {message}
          </button>
        ) : null}

        {needsDelivery ? (
        <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.deliveryCompany')}</h2>
              <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.deliveryCompanyHelp')}</p>
            </div>
            <span className="rounded-full bg-[#fff4cc] px-3 py-1.5 text-[11px] font-black text-[#9a6a00]">{deliveryReady ? money(deliveryFee) : '—'}</span>
          </div>

          {deliveryStatus !== 'ready' ? (
            <div role={deliveryStatus === 'error' ? 'alert' : 'status'} className="rounded-2xl bg-[var(--shadow-bg-soft)] px-4 py-4 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
              <p>{deliveryStatus === 'loading' ? deliveryCopy.loading : deliveryLoadError || deliveryCopy.error}</p>
              {deliveryStatus === 'error' ? (
                <button type="button" onClick={() => setDeliveryReloadKey((value) => value + 1)} className="mt-3 rounded-xl border border-[var(--shadow-border)] px-4 py-2 font-bold text-[var(--shadow-text-primary)]">
                  {deliveryCopy.retry}
                </button>
              ) : null}
            </div>
          ) : (
          <div className="space-y-3">
            {deliveryCompanies.map((company) => {
              const active = selectedCompanyId === company.id

              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`flex w-full items-center justify-between rounded-[18px] border px-3 py-3 text-left transition active:scale-[0.99] ${
                    active ? 'border-[#d6a800] bg-[#fffaf0]' : 'border-[var(--shadow-border)] bg-[var(--shadow-input-bg)]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                   <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[var(--shadow-bg-surface)] ring-1 ring-[var(--shadow-border)]">
  <img src={company.logo} alt={company.label} className={company.id === 'custom' ? 'h-full w-full object-cover' : 'h-9 w-9 object-contain'} />
</span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-black text-[var(--shadow-text-primary)]">{company.name}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{company.label}</span>
                      <span className="mt-1 block text-[11px] font-bold text-[var(--shadow-text-secondary)]">{money(company.fee)}</span>
                    </span>
                  </span>
                  {active ? (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d6a800] text-white">
                      <i className="fa-solid fa-check text-[12px]" />
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
          )}

          <div className="mt-4">
            <label className="mb-2 block text-[12px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.deliveryNote')}</label>
            <textarea
              value={deliveryNote}
              onChange={(event) => setDeliveryNote(event.target.value)}
              placeholder={t('authorCheckout.deliveryNotePlaceholder')}
              className="min-h-[96px] w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 py-3 text-[13px] font-bold leading-6 text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)]"
            />
          </div>
        </section>
        ) : null}

        <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.orderItems')}</h2>
              <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.itemsInOrder', { count: number(itemCount) })}</p>
            </div>
            <i className="fa-solid fa-chevron-up text-[12px] text-[var(--shadow-text-tertiary)]" />
          </div>

          <div className="space-y-3">
            {items.length ? items.map((item) => (
              <article key={item.id} className="flex gap-3 rounded-[18px] bg-[var(--shadow-bg-surface)] py-2">
                <div className="h-[92px] w-[68px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
                  {safeCheckoutCoverUrl(item.cover_url) ? (
                    <img src={safeCheckoutCoverUrl(item.cover_url)} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
                      <i className="fa-regular fa-image text-[18px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-[13px] font-black text-[var(--shadow-text-primary)]">{item.title}</h3>
                      <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{item.type === 'Book' ? t('authorCheckout.book') : item.type || t('authorCheckout.book')}</p>
                    </div>
                    <button type="button" aria-label={t('authorCheckout.removeItem')} onClick={() => removeItem(item.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95">
                      <i className="fa-solid fa-trash text-[11px]" />
                    </button>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="text-[14px] font-black text-[#e5484d]">{isExpiredDiscoverPromotion(item) ? '—' : money(Number(item.price_value || 0) * Number(item.quantity || 1))}</div>
                    <div className="flex items-center gap-2">
                      <button
  type="button"
  aria-label={t('authorCheckout.decreaseQuantity')}
  onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)}
  disabled={isPdfCheckoutItem(item) || Number(item.quantity || 1) <= 1}
  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] disabled:opacity-40"
>
  <i className="fa-solid fa-minus text-[11px]" />
</button>
                      <span className="w-5 text-center text-[13px] font-black text-[var(--shadow-text-primary)]">{number(item.quantity || 1)}</span>
                      <button
  type="button"
  aria-label={t('authorCheckout.increaseQuantity')}
  onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)}
  disabled={isPdfCheckoutItem(item) || Number(item.quantity || 1) >= 99}
  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)] disabled:opacity-40"
>
  <i className="fa-solid fa-plus text-[11px]" />
</button>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-[18px] bg-[var(--shadow-input-bg)] p-6 text-center text-[12px] font-bold text-[var(--shadow-text-tertiary)]">
                {t('authorCheckout.noItems')}
              </div>
            )}
          </div>
        </section>
      

        <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <h2 className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.paymentSummary')}</h2>
          {!needsDelivery && items.length > 0 ? (
            <div className="mt-3 space-y-2">
              <div className="text-[12px] font-bold text-[var(--shadow-text-primary)]">{t('authorCheckout.pdf_method')}</div>
              <div className="flex flex-col gap-2">
                {methodAvailability.aba ? (
                  <button
                    type="button"
                    aria-pressed={paymentMethod === 'aba'}
                    onClick={() => setPaymentMethod('aba')}
                    className={`flex min-h-[62px] w-full items-center gap-3 rounded-[16px] border bg-[var(--shadow-bg-surface)] px-3 py-2.5 text-left transition active:scale-[0.99] ${paymentMethod === 'aba' ? 'border-[var(--shadow-border-strong)]' : 'border-[var(--shadow-border)]'}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ED1C2E] text-[10px] font-black tracking-[-0.3px] text-white">
                      KHQR
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] font-black text-[var(--shadow-text-primary)]">
                      ABA / PayWay
                    </span>
                    <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-primary)]" aria-hidden="true" />
                  </button>
                ) : null}
                {methodAvailability.binance ? <button type="button" aria-pressed={paymentMethod === 'binance'}
                  onClick={() => setPaymentMethod('binance')}
                  className={`min-h-11 rounded-xl border px-3 text-[12px] font-bold ${paymentMethod === 'binance' ? 'border-yellow-500 bg-yellow-50 text-black' : 'border-[var(--shadow-border)]'}`}>
                  {t('authorCheckout.pdf_binance')}
                </button> : null}
              </div>

              {!methodAvailability.ready ? (
  <p role="status" className="text-[12px] text-[var(--shadow-text-secondary)]">
    {t('authorCheckout.checkingPayment')}
  </p>
) : null}

{methodAvailability.ready &&
 !methodAvailability.aba &&
 !methodAvailability.binance ? (
  <div role="alert" className="space-y-2">
    <p className="text-[12px] text-red-600 dark:text-red-300">
      {checkoutFixCopy.methods}
    </p>

    <button
      type="button"
      onClick={() => { void refreshPdfMethods() }}
      className="rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-[12px] font-medium text-[var(--shadow-text-primary)]"
    >
      {deliveryCopy.retry}
    </button>
  </div>
) : null}
              {paymentMethod === 'binance' && methodAvailability.binance ? <div className="text-[12px] font-bold text-emerald-700">
                {t('authorCheckout.pdf_binanceBonus')}<div className="text-[#9a7000]">{t('authorCheckout.pdf_binancePrice')}: {(total + 1).toFixed(2)} USDT</div>
              </div> : null}
            </div>
          ) : null}
          <div className="mt-4 space-y-3 text-[13px] font-semibold">
            {needsDelivery ? (
  <>
    <div className="flex justify-between text-[var(--shadow-text-secondary)]">
      <span>{t('authorCheckout.deliveryFee')}</span>
      <span className="font-black text-[var(--shadow-text-primary)]">{deliveryReady ? money(deliveryFee) : '—'}</span>
    </div>
    <div className="flex justify-between text-[var(--shadow-text-secondary)]">
      <span>{t('authorCheckout.deliveryCompany')}</span>
      <span className="font-black text-[var(--shadow-text-primary)]">{selectedCompany?.name || '—'}</span>
    </div>
  </>
) : null}
            <div className="border-t border-[var(--shadow-border)] pt-3">
              <div className="flex justify-between text-[14px] font-black text-[var(--shadow-text-primary)]">
                <span>{t('authorCheckout.total')}</span>
                <span className="text-[#e5484d]">{promotionExpired || !deliveryReady ? '—' : money(total)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[980px] items-center justify-between px-4">
          <div>
            <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.total')}</div>
            <div className="mt-1 text-[17px] font-black text-[#e5484d]">{promotionExpired || !deliveryReady ? '—' : money(total)}</div>
          </div>
          
        <button
  type="button"
  onClick={handleContinuePayment}
  disabled={saving || promotionExpired || !items.length || !deliveryReady || (!needsDelivery &&
    (!methodAvailability.ready || (paymentMethod === 'aba' ? !methodAvailability.aba : !methodAvailability.binance)))}
  className="h-12 rounded-full bg-[var(--shadow-text-primary)] px-8 text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-xl active:scale-95 disabled:bg-[var(--shadow-text-disabled)]"
>
  {saving ? t('authorCheckout.creatingPayment') : t('authorCheckout.continuePayment')}
</button>
          
        </div>
      </footer>


      {binanceProfileOpen ? <PaymentProfileModal showBank={false} showBinance
        onClose={() => setBinanceProfileOpen(false)}
        onSaved={(user) => {
          if (!/^\d{5,20}$/.test(String(user?.binance_uid || ''))) {
            setMessage(t('authorCheckout.pdf_binanceProfile'))
            return
          }
          setBinanceProfileOpen(false)
          void handleContinuePayment()
        }} /> : null}
      {paymentModal && !paidBookOrder && !paidPdfOrder ? (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true" aria-labelledby="author-payment-qr-title">
          <div className="max-h-[92vh] w-full max-w-[410px] overflow-y-auto rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 pb-6 pt-5 text-center shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 id="author-payment-qr-title" className="text-[18px] font-black text-[var(--shadow-text-primary)]">
                {paymentModal.payment_method === 'binance_personal_pay' ? t('authorCheckout.pdf_binance') : t('authorCheckout.paymentTitle')}
              </h2>
              <button type="button" onClick={() => setPaymentModal(null)} aria-label={t('authorCheckout.paymentClose')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
                <i className="fa-solid fa-xmark text-[14px]" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-left text-[12px] leading-relaxed text-[var(--shadow-text-secondary)]">
              {paymentModal.payment_method === 'binance_personal_pay' ? t('authorCheckout.pdf_binanceReceiver') : t('authorCheckout.paymentHelp')}
            </p>
            {paymentModal.payment_method === 'binance_personal_pay' ? (
              <div className="mt-3 rounded-xl bg-[#fff9e5] p-3 text-[13px] font-bold text-[#9a7000]">
                <div>{paymentModal.amount_usdt} USDT · {t('authorCheckout.pdf_binancePrice')}</div>
                <div>{t('authorCheckout.pdf_binanceBonus')}</div>
                {paymentModal.receiver?.uid ? <div>Binance UID: {paymentModal.receiver.uid} ({paymentModal.receiver.name})</div> : null}
              </div>
            ) : null}
            {paymentWindowActive && getPaymentQrImage(paymentModal) ? (
              <div className="mx-auto mt-4 flex w-fit max-w-full justify-center rounded-2xl bg-white p-3">
                <img src={getPaymentQrImage(paymentModal)} alt={t('authorCheckout.paymentTitle')} className="max-h-[260px] max-w-[260px] object-contain" />
              </div>
            ) : null}
            <p className="mt-3 break-all text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
              {t('authorCheckout.paymentOrderId')}: {paymentModal.order_id}
            </p>
            {Number.isFinite(modalExpiresAt) ? (
              <p className="mt-1 text-[12px] font-bold text-[var(--shadow-text-primary)]">
                {t('authorCheckout.paymentExpires')}: {Math.floor(Math.max(0, Math.ceil((modalExpiresAt - paymentClock) / 1000)) / 60).toString().padStart(2, '0')}:{(Math.max(0, Math.ceil((modalExpiresAt - paymentClock) / 1000)) % 60).toString().padStart(2, '0')}
              </p>
            ) : null}
            {!paymentWindowActive ? (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-left text-[12px] text-amber-900">
                {paymentModal.payment_method === 'binance_personal_pay' ? t('authorCheckout.pdf_binanceWait') : pdfCopy.expired}
              </p>
            ) : null}
            {paymentMessage ? <p role="status" className="mt-3 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-left text-[12px] text-[var(--shadow-text-primary)]">{paymentMessage}</p> : null}
            <div className="mt-5 flex flex-col gap-2.5">
              {paymentModal.payment_method !== 'binance_personal_pay' &&
                getPaywayOpenUrl(paymentModal) ? (
                <button
                  type="button"
                  disabled={!paymentWindowActive}
                  onClick={() => {
                    if (!paymentWindowActive) return
                    const link = getPaywayOpenUrl(paymentModal)
                    if (/^https:\/\//i.test(link)) {
                      window.open(link, '_blank', 'noopener,noreferrer')
                    } else if (/^abamobilebank:\/\//i.test(link)) {
                      window.location.assign(link)
                    }
                  }}
                  className="h-12 w-full rounded-full bg-[#FE526E] text-[13px] font-black text-white disabled:opacity-40"
                >
                  {t('authorCheckout.openABA')}
                </button>
              ) : null}
              <button
                type="button"
                disabled={checkingPayment}
                onClick={() => window.dispatchEvent(new Event('shadow-author-payment-check'))}
                className="h-12 w-full rounded-full border border-[#FE526E] bg-[var(--shadow-bg-surface)] text-[13px] font-black text-[#FE526E] disabled:opacity-50"
              >
                {t(checkingPayment ? 'authorCheckout.checkingPayment' : 'authorCheckout.checkPayment')}
              </button>
              <button type="button" onClick={() => setPaymentModal(null)} className="h-11 w-full rounded-full border border-[var(--shadow-border)] text-[12px] font-bold text-[var(--shadow-text-secondary)]">
                {t('authorCheckout.paymentClose')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {paidBookOrder ? (
        <div
          className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/60 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="author-order-success-title"
        >
          <div className="w-full max-w-[380px] rounded-[26px] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f2] text-[#FE526E]">
              <i className="fa-solid fa-check text-[26px]" aria-hidden="true" />
            </div>
            <h2 id="author-order-success-title" className="mt-4 text-[20px] font-bold text-[var(--shadow-text-primary)]">
              {t('authorCheckout.orderSuccessful')}
            </h2>
            <p className="mt-3 text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
              {t('authorCheckout.orderSuccessMessage')}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => closeOrderSuccess('/author/orders')}
                className="h-12 w-full rounded-full bg-[#FE526E] text-[14px] font-medium text-white transition active:scale-[0.98]"
              >
                {t('authorCheckout.viewOrder')}
              </button>
              <button
                type="button"
                onClick={() => closeOrderSuccess(paidBookOrder.returnPath)}
                className="h-12 w-full rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-medium text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
              >
                {t(`authorCheckout.${checkoutReturnLabel(paidBookOrder.returnPath)}`)}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {paidPdfOrder ? (
        <div
          className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/60 px-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="author-pdf-purchase-success-title"
        >
          <div className="w-full max-w-[380px] rounded-[26px] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff5ca] text-[#b18a00]">
              <i className="fa-solid fa-book-open text-[26px]" aria-hidden="true" />
            </div>
            <h2 id="author-pdf-purchase-success-title" className="mt-4 text-[20px] font-bold text-[var(--shadow-text-primary)]">
              {paidPdfOrder.alreadyOwned
                ? pdfCopy.ownedTitle
                : t('authorCheckout.pdfPurchaseSuccessful')}
            </h2>
            <p className="mt-3 text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
              {paidPdfOrder.alreadyOwned
                ? pdfCopy.ownedBody
                : pdfCopy.saved}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => closePdfSuccess(true)}
                className="h-12 w-full rounded-full bg-gradient-to-r from-[#FFD13B] to-[#FFDD3F] text-[14px] font-semibold text-[#171717] transition active:scale-[0.98]"
              >
                {t('authorCheckout.readNow')}
              </button>
              <button
                type="button"
                onClick={() => closePdfSuccess(false)}
                className="h-12 w-full rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-medium text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
              >
                {pdfCopy.maybeLater}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <BuyerProfileSheet
        open={buyerOpen}
        profile={buyerProfile}
        onClose={() => setBuyerOpen(false)}
        onSave={(nextProfile) => {
          setBuyerProfile(nextProfile)
          setBuyerOpen(false)
        }}
      />
    </div>
  )
}
