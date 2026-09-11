import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

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
    "goBack": "Go back"
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
    "goBack": "ត្រឡប់ក្រោយ"
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
    "goBack": "返回"
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
    "goBack": "戻る"
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
    "goBack": "뒤로"
  }
})


const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const FALLBACK_PAYWAY_LINK = 'https://link.payway.com.kh/ABAPAYnw446278Y'

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

function getCartItems() {
  try {
    const raw = localStorage.getItem('shadow_author_cart_items') || '[]'
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartItems(items) {
  localStorage.setItem('shadow_author_cart_items', JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
}

function getBuyerProfile() {
  try {
    const raw = localStorage.getItem('shadow_mall_buyer_profile') || '{}'
    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') return {}

    return {
      name: parsed.name || '',
      phone_number: parsed.phone_number || parsed.phone || '',
      telegram_username: parsed.telegram_username || parsed.telegram || '',
      facebook_link: parsed.facebook_link || parsed.facebook || '',
      delivery_address: parsed.delivery_address || parsed.address || '',
      delivery_note: parsed.delivery_note || '',
      province_city: parsed.province_city || 'Phnom Penh',
    }
  } catch {
    return {}
  }
}

function saveBuyerProfile(profile) {
  localStorage.setItem('shadow_mall_buyer_profile', JSON.stringify(profile))
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

  if (!open) return null

  function handleSave() {
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

    saveBuyerProfile(nextProfile)
    onSave(nextProfile)
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

          <button type="button" onClick={handleSave} className="h-12 w-full rounded-full bg-[var(--shadow-text-primary)] text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-xl active:scale-[0.98]">
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
  const [buyerProfile, setBuyerProfile] = useState(getBuyerProfile)
  const [buyerOpen, setBuyerOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(DELIVERY_COMPANIES[0].id)
  const [deliveryNote, setDeliveryNote] = useState(() => getBuyerProfile().delivery_note || '')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedCompany = DELIVERY_COMPANIES.find((company) => company.id === selectedCompanyId) || DELIVERY_COMPANIES[0]
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.price_value || 0) * Number(item.quantity || 1), 0), [items])
  const needsDelivery = items.some((item) => String(item.type || item.product_type || '').toLowerCase() === 'book')
  const deliveryFee = needsDelivery ? Number(selectedCompany.fee || 0) : 0
  const total = subtotal + deliveryFee
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  const hasBuyerProfile = Boolean(
  (buyerProfile.name || '').trim() &&
  (buyerProfile.phone_number || buyerProfile.phone || '').trim() &&
  (buyerProfile.delivery_address || buyerProfile.address || '').trim()
)

  function updateQuantity(id, nextQuantity) {
    const nextItems = items.map((item) => (
      item.id === id ? { ...item, quantity: Math.max(1, nextQuantity) } : item
    ))
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  function removeItem(id) {
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    saveCartItems(nextItems)
  }

 async function handleContinuePayment() {
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

  try {
    setSaving(true)
    setMessage('')

    if (needsDelivery) {
  const profileResponse = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  })

  const profileData = await profileResponse.json().catch(() => ({}))

  if (!profileResponse.ok || profileData.ok === false) {
    throw new Error(profileData.message || t('authorCheckout.failedSaveProfile'))
  }

  const savedProfile = {
    ...buyerProfile,
    ...profile,
    ...(profileData.profile || {}),
  }

  saveBuyerProfile(savedProfile)
  setBuyerProfile(savedProfile)
}

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

    localStorage.setItem(
      'shadow_author_current_order_payment',
      JSON.stringify({
        order: orderData.order,
        created_at: new Date().toISOString(),
      })
    )

    const paywayUrl =
      orderData.order.checkout_url ||
      orderData.order.deeplink ||
      FALLBACK_PAYWAY_LINK

    window.location.replace(paywayUrl)
  } catch (error) {
    setMessage(error.message || t('authorCheckout.failedContinuePayment'))
  } finally {
    setSaving(false)
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
                  {item.cover_url ? (
                    <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
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
                    <div className="text-[14px] font-black text-[#e5484d]">{money(Number(item.price_value || 0) * Number(item.quantity || 1))}</div>
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
                <span className="text-[#e5484d]">{money(total)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[980px] items-center justify-between px-4">
          <div>
            <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCheckout.total')}</div>
            <div className="mt-1 text-[17px] font-black text-[#e5484d]">{money(total)}</div>
          </div>
          
        <button
  type="button"
  onClick={handleContinuePayment}
  disabled={saving}
  className="h-12 rounded-full bg-[var(--shadow-text-primary)] px-8 text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-xl active:scale-95 disabled:bg-[var(--shadow-text-disabled)]"
>
  {saving ? t('authorCheckout.creatingPayment') : t('authorCheckout.continuePayment')}
</button>
          
        </div>
      </footer>

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
