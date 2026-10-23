import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
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
    "pdfUnlockFailed": "PDF payment was received, but the file is not unlocked yet. Please contact support if this continues."
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
    "pdfUnlockFailed": "បានទទួលការទូទាត់ PDF ប៉ុន្តែឯកសារមិនទាន់ដោះសោទេ។ ប្រសិនបើបញ្ហានៅបន្ត សូមទាក់ទងផ្នែកជំនួយ។"
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
    "pdfUnlockFailed": "已收到 PDF 付款，但文件尚未解锁。如果问题持续，请联系客服。"
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
    "pdfUnlockFailed": "PDF のお支払いは確認されましたが、ファイルはまだ解放されていません。解決しない場合はサポートにお問い合わせください。"
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

const FALLBACK_PAYWAY_LINK = 'https://link.payway.com.kh/ABAPAYnw446278Y'
const PAYMENT_SUCCESS_SEEN_KEY = 'shadow_author_checkout_success_seen_v1'
const PAYMENT_CHECK_MIN_INTERVAL_MS = 15000
const PAYMENT_CHECK_MAX_AGE_MS = 24 * 60 * 60 * 1000

function currentPendingAuthorPayment() {
  try {
    const saved = JSON.parse(localStorage.getItem('shadow_author_current_order_payment') || 'null')
    const order = saved?.order
    const expiresAt = Date.parse(order?.expires_at || '')
    if (!order?.order_id || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null
    if (localStorage.getItem(PAYMENT_SUCCESS_SEEN_KEY) === String(order.order_id)) return null
    if (String(order.payment_status || '').toLowerCase() === 'paid') return null
    return order.qr_image || order.checkout_url || order.deeplink ? order : null
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

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

const DELIVERY_COMPANIES = [
  {
    id: 'jnt',
    name: 'J&T',
    label: 'J&T Express',
    fee: 2,
    logo: '/assets/Icons/J%26T.svg',
  },
  {
    id: 'vet',
    name: 'VET',
    label: 'Vireak Buntham Express',
    fee: 2,
    logo: '/assets/Icons/VET.svg',
  },
]

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

function getCartItems() {
  try {
    const raw = localStorage.getItem('shadow_author_cart_items') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item === 'object' && item.id !== null && item.id !== undefined && String(item.id).trim()).map((item) => ({
          ...item,
          quantity: validCheckoutQuantity(item.quantity),
        }))
      : []
  } catch {
    return []
  }
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
  const readerUser = getReaderUser()
   const [name, setName] = useState(profile.name || readerUser?.name || '')
  const [phone, setPhone] = useState(profile.phone_number || '')
  const [telegram, setTelegram] = useState(profile.telegram_username || '')
  const [facebook, setFacebook] = useState(profile.facebook_link || '')
 const [address, setAddress] = useState(profile.delivery_address || profile.address || '')
  const [error, setError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const saveProfileRef = useRef(false)

  useEffect(() => {
    if (!open) return
    setName(profile.name || readerUser?.name || '')
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
  const [items, setItems] = useState(getCartItems)
  const promotionExpired = useDiscoverPromotionExpiry(items)
  const [buyerProfile, setBuyerProfile] = useState(getBuyerProfile)
  const [buyerOpen, setBuyerOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(DELIVERY_COMPANIES[0].id)
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
    const controller = new AbortController()

    async function checkPayment(force = false) {
      const manual = force === true
      if (!active || requestPending || document.visibilityState === 'hidden') return
      if (Date.now() - lastCheckedAt < (manual ? 2500 : PAYMENT_CHECK_MIN_INTERVAL_MS)) return

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
        const order = data.order
        if (!active) return
        if (data.ok === false || String(order?.order_id || '') !== orderId) {
          if (manual) setPaymentMessage(t('authorCheckout.paymentUnavailable'))
          return
        }
        if (String(order.payment_status || '').toLowerCase() !== 'paid') {
          if (manual) setPaymentMessage(t('authorCheckout.paymentPending'))
          return
        }

        const orderItems = Array.isArray(order.items) && order.items.length
          ? order.items
          : Array.isArray(saved.order?.items) ? saved.order.items : []
        const hasBook = orderItems.some((item) => String(item.product_type || item.type || '').toLowerCase() === 'book')
        const pdfOnly = orderItems.length > 0 && orderItems.every((item) => String(item.product_type || item.type || '').toLowerCase() === 'pdf')
        const discoverPdfPurchase = saved.return_path === '/discover' && pdfOnly
        if (!hasBook && !discoverPdfPurchase) return

        let pdfItem = null
        let pdfProductId = ''
        if (discoverPdfPurchase) {
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
        if (discoverPdfPurchase) {
          setPaidPdfOrder({
            orderId,
            productId: pdfProductId,
            title: String(pdfItem.product_title || pdfItem.title || '').trim() || 'PDF',
          })
        } else {
          setPaidBookOrder({
            orderId,
            returnPath: saved.return_path === '/discover' ? '/discover' : '/store',
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
    window.addEventListener('focus', checkVisiblePayment)
    window.addEventListener('pageshow', checkVisiblePayment)
    window.addEventListener('shadow-author-payment-check', requestPaymentCheck)
    document.addEventListener('visibilitychange', checkVisiblePayment)
    return () => {
      active = false
      controller.abort()
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
    setPaidPdfOrder(null)
    if (readNow) {
      navigate(`/discover/pdf/${encodeURIComponent(productId)}`, { state: { title } })
    } else {
      navigate('/discover')
    }
  }

  const selectedCompany = DELIVERY_COMPANIES.find((company) => company.id === selectedCompanyId) || DELIVERY_COMPANIES[0]
  const subtotal = useMemo(() => items.reduce((sum, item) => {
    const price = Number(item.price_value)
    return sum + (Number.isFinite(price) && price >= 0 ? price : 0) * validCheckoutQuantity(item.quantity)
  }, 0), [items])
  const needsDelivery = items.some((item) => String(item.type || item.product_type || '').toLowerCase() === 'book')
  const deliveryFee = needsDelivery ? Number(selectedCompany.fee || 0) : 0
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
      String(item.id) === String(id) ? { ...item, quantity: validCheckoutQuantity(nextQuantity) } : item
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

  let navigationStarted = false
  try {
    paymentSubmissionRef.current = true
    setSaving(true)
    setMessage('')

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

    const orderResponse = await fetch(`${API_URL}/api/author-store/orders/create-payment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        delivery_company: needsDelivery
  ? {
      key: selectedCompany.id,
      name: selectedCompany.label,
      shortName: selectedCompany.name,
      fee: selectedCompany.fee,
    }
  : null,
      }),
    })

    const orderData = await orderResponse.json().catch(() => ({}))

    if (!orderResponse.ok || orderData.ok === false) {
      throw new Error(orderData.message || t('authorCheckout.failedCreatePayment'))
    }

    if (!orderData.order) {
      throw new Error(t('authorCheckout.paymentNotCreated'))
    }

    const nextOrder = orderData.order

    localStorage.setItem(
      'shadow_author_current_order_payment',
      JSON.stringify({
        order: nextOrder,
        created_at: new Date().toISOString(),
        return_path: items.some((item) => item.discover_promotion_rotation_key) ? '/discover' : '/store',
        checkout_items: items.map((item) => ({ id: item.id, quantity: item.quantity || 1 })),
      })
    )

    const paywayUrl = nextOrder.checkout_url || nextOrder.deeplink || FALLBACK_PAYWAY_LINK
    window.location.assign(paywayUrl)
    navigationStarted = true
  } catch (error) {
    setMessage(error.message || t('authorCheckout.failedContinuePayment'))
  } finally {
    if (!navigationStarted) {
      paymentSubmissionRef.current = false
      setSaving(false)
    }
  }
}

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
}} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
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
            <span className="rounded-full bg-[#fff4cc] px-3 py-1.5 text-[11px] font-black text-[#9a6a00]">{money(deliveryFee)}</span>
          </div>

          <div className="space-y-3">
            {DELIVERY_COMPANIES.map((company) => {
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
  <img src={company.logo} alt={company.name} className="h-9 w-9 object-contain" />
</span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-black text-[var(--shadow-text-primary)]">{company.name}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{company.label}</span>
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
                      <button type="button" aria-label={t('authorCheckout.decreaseQuantity')} onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                        <i className="fa-solid fa-minus text-[11px]" />
                      </button>
                      <span className="w-5 text-center text-[13px] font-black text-[var(--shadow-text-primary)]">{number(item.quantity || 1)}</span>
                      <button type="button" aria-label={t('authorCheckout.increaseQuantity')} onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]">
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
          <div className="mt-4 space-y-3 text-[13px] font-semibold">
            {needsDelivery ? (
  <>
    <div className="flex justify-between text-[var(--shadow-text-secondary)]">
      <span>{t('authorCheckout.deliveryFee')}</span>
      <span className="font-black text-[var(--shadow-text-primary)]">{money(deliveryFee)}</span>
    </div>
    <div className="flex justify-between text-[var(--shadow-text-secondary)]">
      <span>{t('authorCheckout.deliveryCompany')}</span>
      <span className="font-black text-[var(--shadow-text-primary)]">{selectedCompany.name}</span>
    </div>
  </>
) : null}
            <div className="border-t border-[var(--shadow-border)] pt-3">
              <div className="flex justify-between text-[14px] font-black text-[var(--shadow-text-primary)]">
                <span>{t('authorCheckout.total')}</span>
                <span className="text-[#e5484d]">{promotionExpired ? '—' : money(total)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[980px] items-center justify-between px-4">
          <div>
            <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.total')}</div>
            <div className="mt-1 text-[17px] font-black text-[#e5484d]">{promotionExpired ? '—' : money(total)}</div>
          </div>
          
        <button
  type="button"
  onClick={handleContinuePayment}
  disabled={saving || promotionExpired || !items.length}
  className="h-12 rounded-full bg-[var(--shadow-text-primary)] px-8 text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-xl active:scale-95 disabled:bg-[var(--shadow-text-disabled)]"
>
  {saving ? t('authorCheckout.creatingPayment') : t('authorCheckout.continuePayment')}
</button>
          
        </div>
      </footer>


      {paymentModal && !paidBookOrder && !paidPdfOrder ? (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/60 px-4" role="dialog" aria-modal="true" aria-labelledby="author-payment-qr-title">
          <div className="max-h-[92vh] w-full max-w-[410px] overflow-y-auto rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 pb-6 pt-5 text-center shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 id="author-payment-qr-title" className="text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorCheckout.paymentTitle')}</h2>
              <button type="button" onClick={() => setPaymentModal(null)} aria-label={t('authorCheckout.paymentClose')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
                <i className="fa-solid fa-xmark text-[14px]" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-left text-[12px] leading-relaxed text-[var(--shadow-text-secondary)]">{t('authorCheckout.paymentHelp')}</p>
            {getPaymentQrImage(paymentModal) ? (
              <div className="mx-auto mt-4 flex w-fit max-w-full justify-center rounded-2xl bg-white p-3">
                <img src={getPaymentQrImage(paymentModal)} alt={t('authorCheckout.paymentTitle')} className="max-h-[260px] max-w-[260px] object-contain" />
              </div>
            ) : null}
            <p className="mt-3 break-all text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
              {t('authorCheckout.paymentOrderId')}: {paymentModal.order_id}
            </p>
            {Number.isFinite(Date.parse(paymentModal.expires_at || '')) ? (
              <p className="mt-1 text-[12px] font-bold text-[var(--shadow-text-primary)]">
                {t('authorCheckout.paymentExpires')}: {Math.floor(Math.max(0, Math.ceil((Date.parse(paymentModal.expires_at) - paymentClock) / 1000)) / 60).toString().padStart(2, '0')}:{(Math.max(0, Math.ceil((Date.parse(paymentModal.expires_at) - paymentClock) / 1000)) % 60).toString().padStart(2, '0')}
              </p>
            ) : null}
            {Date.parse(paymentModal.expires_at || '') <= paymentClock ? (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-left text-[12px] text-amber-900">{t('authorCheckout.paymentExpired')}</p>
            ) : null}
            {paymentMessage ? <p role="status" className="mt-3 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2 text-left text-[12px] text-[var(--shadow-text-primary)]">{paymentMessage}</p> : null}
            <div className="mt-5 flex flex-col gap-2.5">
              {paymentModal.deeplink || /^https:\/\//i.test(String(paymentModal.checkout_url || '')) ? (
                <button
                  type="button"
                  disabled={Date.parse(paymentModal.expires_at || '') <= paymentClock}
                  onClick={() => {
                    const link = String(paymentModal.deeplink || paymentModal.checkout_url || '').trim()
                    if (/^https:\/\//i.test(link)) window.open(link, '_blank', 'noopener,noreferrer')
                    else if (/^abamobilebank:\/\//i.test(link)) window.location.assign(link)
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
                {t(paidBookOrder.returnPath === '/discover' ? 'authorCheckout.backToDiscover' : 'authorCheckout.backToStore')}
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f2] text-[#FE526E]">
              <i className="fa-solid fa-check text-[26px]" aria-hidden="true" />
            </div>
            <h2 id="author-pdf-purchase-success-title" className="mt-4 text-[20px] font-bold text-[var(--shadow-text-primary)]">
              {t('authorCheckout.pdfPurchaseSuccessful')}
            </h2>
            <p className="mt-3 text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
              {t('authorCheckout.pdfPurchaseSuccessMessage')}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => closePdfSuccess(true)}
                className="h-12 w-full rounded-full bg-[#FE526E] text-[14px] font-medium text-white transition active:scale-[0.98]"
              >
                {t('authorCheckout.readNow')}
              </button>
              <button
                type="button"
                onClick={() => closePdfSuccess(false)}
                className="h-12 w-full rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-medium text-[var(--shadow-text-primary)] transition active:scale-[0.98]"
              >
                {t('authorCheckout.backToDiscover')}
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
