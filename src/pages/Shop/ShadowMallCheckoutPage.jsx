import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallCheckoutPage', {
  en: { "closeBuyerProfile": "Close Buyer Profile", "buyerProfile": "Buyer Profile", "printedDeliveryRequired": "{t('shadowMallCheckoutPage.printedDeliveryRequired')}", "loadingBuyerProfile": "{t('shadowMallCheckoutPage.loadingBuyerProfile')}", "name": "Name", "nameHelp": "{t('shadowMallCheckoutPage.nameHelp')}", "phoneNumber": "Phone Number", "enterPhone": "Enter phone number", "pleaseLoginFirst": "Please login first", "deliveryAddress": "Delivery Address", "addressPlaceholder": "House number, street, village, commune, district, province/city...", "saving": "Saving...", "saveInformation": "Save Information", "failedLoadProfile": "Failed to load buyer profile", "loginBeforeSave": "Please login before saving buyer profile.", "profileRequired": "Phone number and delivery address are required.", "failedSaveProfile": "Failed to save buyer profile", "loginBeforeCheckout": "Please login before checkout.", "cartEmpty": "Your cart is empty.", "failedCreatePayment": "Failed to create Shadow Mall payment", "paymentNotCreated": "Payment order was not created", "failedContinuePayment": "Failed to continue payment", "goBack": "Go back", "checkout": "Checkout", "openBuyerProfile": "Open Buyer Profile", "deliveryCompany": "Delivery Company", "chooseDeliveryCompany": "{t('shadowMallCheckoutPage.chooseDeliveryCompany')}", "deliveryNote": "Delivery Note", "notePlaceholder": "Optional note for admin or delivery...", "orderItems": "Order Items", "booksInOrder": "{{count}} books in this order", "noBooksCart": "No books in cart", "backToShop": "Back to Shop", "paymentSummary": "Payment Summary", "subtotal": "Subtotal", "deliveryFee": "Delivery Fee", "total": "Total", "openingPayWay": "Opening PayWay...", "continuePayment": "Continue to Payment", "loginCheckout": "Login to Checkout", "untitledBook": "Untitled book", "unknownAuthor": "Unknown author", "each": "each", "removeItem": "Remove {{title}}", "telegramUsername": "Telegram Username", "facebookLink": "Facebook Link", "facebookPlaceholder": "Paste Facebook profile or Messenger link", "quantity": "Qty: {{count}}", "provinceCity": "Province / City", "addressPlaceholderShort": "House number, street, village, commune, district..." },
  km: { "closeBuyerProfile": "បិទព័ត៌មានអ្នកទិញ", "buyerProfile": "ព័ត៌មានអ្នកទិញ", "printedDeliveryRequired": "ត្រូវការសម្រាប់ការដឹកជញ្ជូនសៀវភៅបោះពុម្ព។", "loadingBuyerProfile": "កំពុងផ្ទុកព័ត៌មានអ្នកទិញ...", "name": "ឈ្មោះ", "nameHelp": "ឈ្មោះយកពីគណនីអ្នកអានរបស់អ្នក។ បើចង់ប្តូរ សូមកែ Profile មេ។", "phoneNumber": "លេខទូរស័ព្ទ", "enterPhone": "បញ្ចូលលេខទូរស័ព្ទ", "pleaseLoginFirst": "សូមចូលគណនីជាមុន", "deliveryAddress": "អាសយដ្ឋានដឹកជញ្ជូន", "addressPlaceholder": "លេខផ្ទះ ផ្លូវ ភូមិ ឃុំ/សង្កាត់ ស្រុក/ខណ្ឌ ខេត្ត/ក្រុង...", "saving": "កំពុងរក្សាទុក...", "saveInformation": "រក្សាទុកព័ត៌មាន", "failedLoadProfile": "មិនអាចផ្ទុកព័ត៌មានអ្នកទិញបានទេ", "loginBeforeSave": "សូមចូលគណនីមុនពេលរក្សាទុកព័ត៌មានអ្នកទិញ។", "profileRequired": "ត្រូវបញ្ចូលលេខទូរស័ព្ទ និងអាសយដ្ឋានដឹកជញ្ជូន។", "failedSaveProfile": "មិនអាចរក្សាទុកព័ត៌មានអ្នកទិញបានទេ", "loginBeforeCheckout": "សូមចូលគណនីមុនពេល Checkout។", "cartEmpty": "កន្ត្រករបស់អ្នកទទេ។", "failedCreatePayment": "មិនអាចបង្កើតការទូទាត់ Shadow Mall បានទេ", "paymentNotCreated": "មិនបានបង្កើតការបញ្ជាទិញសម្រាប់ទូទាត់ទេ", "failedContinuePayment": "មិនអាចបន្តការទូទាត់បានទេ", "goBack": "ត្រឡប់ក្រោយ", "checkout": "Checkout", "openBuyerProfile": "បើកព័ត៌មានអ្នកទិញ", "deliveryCompany": "ក្រុមហ៊ុនដឹកជញ្ជូន", "chooseDeliveryCompany": "ជ្រើសរើសក្រុមហ៊ុនសម្រាប់ដឹកជញ្ជូនសៀវភៅបោះពុម្ព។", "deliveryNote": "កំណត់ចំណាំដឹកជញ្ជូន", "notePlaceholder": "កំណត់ចំណាំជាជម្រើសសម្រាប់ Admin ឬអ្នកដឹកជញ្ជូន...", "orderItems": "ទំនិញក្នុងការបញ្ជាទិញ", "booksInOrder": "សៀវភៅ {{count}} ក្នុងការបញ្ជាទិញនេះ", "noBooksCart": "គ្មានសៀវភៅក្នុងកន្ត្រក", "backToShop": "ត្រឡប់ទៅហាង", "paymentSummary": "សង្ខេបការទូទាត់", "subtotal": "តម្លៃសរុបរង", "deliveryFee": "ថ្លៃដឹកជញ្ជូន", "total": "សរុប", "openingPayWay": "កំពុងបើក PayWay...", "continuePayment": "បន្តទៅការទូទាត់", "loginCheckout": "ចូលគណនីដើម្បី Checkout", "untitledBook": "សៀវភៅគ្មានចំណងជើង", "unknownAuthor": "មិនស្គាល់អ្នកនិពន្ធ", "each": "ក្នុងមួយ", "removeItem": "ដក {{title}} ចេញ", "telegramUsername": "ឈ្មោះ Telegram", "facebookLink": "តំណ Facebook", "facebookPlaceholder": "បិទភ្ជាប់តំណ Facebook Profile ឬ Messenger", "quantity": "ចំនួន៖ {{count}}", "provinceCity": "ខេត្ត / ក្រុង", "addressPlaceholderShort": "លេខផ្ទះ ផ្លូវ ភូមិ ឃុំ/សង្កាត់ ស្រុក/ខណ្ឌ..." },
  zh: { "closeBuyerProfile": "关闭买家资料", "buyerProfile": "买家资料", "printedDeliveryRequired": "印刷书配送需要这些信息。", "loadingBuyerProfile": "正在加载买家资料...", "name": "姓名", "nameHelp": "姓名来自你的读者账号。如需更改，请更新主个人资料。", "phoneNumber": "电话号码", "enterPhone": "输入电话号码", "pleaseLoginFirst": "请先登录", "deliveryAddress": "配送地址", "addressPlaceholder": "门牌号、街道、村、区、县、省/市...", "saving": "正在保存...", "saveInformation": "保存信息", "failedLoadProfile": "无法加载买家资料", "loginBeforeSave": "请先登录再保存买家资料。", "profileRequired": "电话号码和配送地址为必填项。", "failedSaveProfile": "无法保存买家资料", "loginBeforeCheckout": "请先登录再结账。", "cartEmpty": "购物车为空。", "failedCreatePayment": "无法创建 Shadow Mall 支付", "paymentNotCreated": "未创建支付订单", "failedContinuePayment": "无法继续支付", "goBack": "返回", "checkout": "结账", "openBuyerProfile": "打开买家资料", "deliveryCompany": "配送公司", "chooseDeliveryCompany": "选择印刷书配送公司。", "deliveryNote": "配送备注", "notePlaceholder": "给管理员或配送员的可选备注...", "orderItems": "订单商品", "booksInOrder": "本订单共 {{count}} 本书", "noBooksCart": "购物车中没有书", "backToShop": "返回商店", "paymentSummary": "支付摘要", "subtotal": "小计", "deliveryFee": "配送费", "total": "合计", "openingPayWay": "正在打开 PayWay...", "continuePayment": "继续支付", "loginCheckout": "登录后结账", "untitledBook": "无标题图书", "unknownAuthor": "未知作者", "each": "每件", "removeItem": "移除 {{title}}", "telegramUsername": "Telegram 用户名", "facebookLink": "Facebook 链接", "facebookPlaceholder": "粘贴 Facebook 个人资料或 Messenger 链接", "quantity": "数量：{{count}}", "provinceCity": "省 / 市", "addressPlaceholderShort": "门牌号、街道、村、区、县..." },
  ja: { "closeBuyerProfile": "購入者情報を閉じる", "buyerProfile": "購入者情報", "printedDeliveryRequired": "印刷本の配送に必要な情報です。", "loadingBuyerProfile": "購入者情報を読み込み中...", "name": "名前", "nameHelp": "名前は読者アカウントから取得されます。変更するにはメインプロフィールを更新してください。", "phoneNumber": "電話番号", "enterPhone": "電話番号を入力", "pleaseLoginFirst": "先にログインしてください", "deliveryAddress": "配送先住所", "addressPlaceholder": "番地、通り、村、コミューン、地区、州/市...", "saving": "保存中...", "saveInformation": "情報を保存", "failedLoadProfile": "購入者情報を読み込めませんでした", "loginBeforeSave": "購入者情報を保存する前にログインしてください。", "profileRequired": "電話番号と配送先住所が必要です。", "failedSaveProfile": "購入者情報を保存できませんでした", "loginBeforeCheckout": "チェックアウト前にログインしてください。", "cartEmpty": "カートは空です。", "failedCreatePayment": "Shadow Mall の支払いを作成できませんでした", "paymentNotCreated": "支払い注文が作成されませんでした", "failedContinuePayment": "支払いを続行できませんでした", "goBack": "戻る", "checkout": "チェックアウト", "openBuyerProfile": "購入者情報を開く", "deliveryCompany": "配送会社", "chooseDeliveryCompany": "印刷本の配送会社を選択してください。", "deliveryNote": "配送メモ", "notePlaceholder": "管理者または配送担当者への任意メモ...", "orderItems": "注文商品", "booksInOrder": "この注文には {{count}} 冊", "noBooksCart": "カートに本がありません", "backToShop": "ショップに戻る", "paymentSummary": "支払い概要", "subtotal": "小計", "deliveryFee": "配送料", "total": "合計", "openingPayWay": "PayWay を開いています...", "continuePayment": "支払いへ進む", "loginCheckout": "ログインしてチェックアウト", "untitledBook": "無題の本", "unknownAuthor": "不明な作者", "each": "1冊あたり", "removeItem": "{{title}}を削除", "telegramUsername": "Telegram ユーザー名", "facebookLink": "Facebook リンク", "facebookPlaceholder": "FacebookプロフィールまたはMessengerリンクを貼り付け", "quantity": "数量：{{count}}", "provinceCity": "州 / 市", "addressPlaceholderShort": "番地、通り、村、コミューン、地区..." },
  ko: { "closeBuyerProfile": "구매자 정보 닫기", "buyerProfile": "구매자 정보", "printedDeliveryRequired": "인쇄 도서 배송에 필요한 정보입니다.", "loadingBuyerProfile": "구매자 정보를 불러오는 중...", "name": "이름", "nameHelp": "이름은 독자 계정에서 가져옵니다. 변경하려면 기본 프로필을 수정하세요.", "phoneNumber": "전화번호", "enterPhone": "전화번호 입력", "pleaseLoginFirst": "먼저 로그인하세요", "deliveryAddress": "배송 주소", "addressPlaceholder": "집 번호, 도로, 마을, 코뮌, 구역, 주/도시...", "saving": "저장 중...", "saveInformation": "정보 저장", "failedLoadProfile": "구매자 정보를 불러오지 못했습니다", "loginBeforeSave": "구매자 정보를 저장하기 전에 로그인하세요.", "profileRequired": "전화번호와 배송 주소가 필요합니다.", "failedSaveProfile": "구매자 정보를 저장하지 못했습니다", "loginBeforeCheckout": "결제 전에 로그인하세요.", "cartEmpty": "장바구니가 비어 있습니다.", "failedCreatePayment": "Shadow Mall 결제를 만들지 못했습니다", "paymentNotCreated": "결제 주문이 생성되지 않았습니다", "failedContinuePayment": "결제를 계속할 수 없습니다", "goBack": "뒤로", "checkout": "결제", "openBuyerProfile": "구매자 정보 열기", "deliveryCompany": "배송 회사", "chooseDeliveryCompany": "인쇄 도서 배송 회사를 선택하세요.", "deliveryNote": "배송 메모", "notePlaceholder": "관리자 또는 배송 담당자에게 남길 선택 메모...", "orderItems": "주문 상품", "booksInOrder": "이 주문에 도서 {{count}}권", "noBooksCart": "장바구니에 도서가 없습니다", "backToShop": "스토어로 돌아가기", "paymentSummary": "결제 요약", "subtotal": "소계", "deliveryFee": "배송비", "total": "합계", "openingPayWay": "PayWay 여는 중...", "continuePayment": "결제 계속하기", "loginCheckout": "로그인 후 결제", "untitledBook": "제목 없는 도서", "unknownAuthor": "알 수 없는 작가", "each": "개당", "removeItem": "{{title}} 삭제", "telegramUsername": "Telegram 사용자명", "facebookLink": "Facebook 링크", "facebookPlaceholder": "Facebook 프로필 또는 Messenger 링크 붙여넣기", "quantity": "수량: {{count}}", "provinceCity": "주 / 도시", "addressPlaceholderShort": "집 번호, 도로, 마을, 코뮌, 구역..." },
})


const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const CART_KEY = 'shadow_mall_cart'
const BUYER_PROFILE_KEY = 'shadow_mall_buyer_profile'
const DELIVERY_FEE = 2
const FALLBACK_PAYWAY_LINK = 'https://link.payway.com.kh/ABAPAYnw446278Y'
const DEFAULT_PROVINCE_CITY = 'Phnom Penh'

const deliveryCompanies = [
  {
    key: 'jnt',
    name: 'J&T Express',
    shortName: 'J&T',
    logo: '/assets/Icons/J&T.svg',
  },
  {
    key: 'vireak_buntham',
    name: 'Vireak Buntham Express',
    shortName: 'VET',
    logo: '/assets/Icons/VET.svg',
  },
]

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || 'null')
    return value || fallback
  } catch {
    return fallback
  }
}

function readCart() {
  const value = readJson(CART_KEY, [])
  return Array.isArray(value) ? value : []
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-mall-cart-updated'))
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function saveBuyerProfileLocal(profile) {
  localStorage.setItem(BUYER_PROFILE_KEY, JSON.stringify(profile))
}

function readBuyerProfileLocal() {
  return readJson(BUYER_PROFILE_KEY, {
    phone_number: '',
    province_city: DEFAULT_PROVINCE_CITY,
    delivery_address: '',
    delivery_note: '',
    telegram_username: '',
    facebook_link: '',
  })
}

function readReaderUser() {
  return readJson('shadow_reader_user', null)
}

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function getReaderName(user) {
  if (!user) return ''

  return (
    user.name ||
    user.full_name ||
    user.display_name ||
    user.email ||
    ''
  )
}

function normalizePrice(value) {
  return Number(String(value || '').replace('$', '')) || 0
}

function normalizeCartItem(item) {
  return {
    id: item.id,
    title: item.title || getDisplayText('shadowMallCheckoutPage.untitledBook'),
    author: item.author || item.author_name || getDisplayText('shadowMallCheckoutPage.unknownAuthor'),
    cover: item.cover || item.cover_url || '',
    price: normalizePrice(item.price || item.price_usd),
    oldPrice: normalizePrice(item.oldPrice || item.old_price_usd),
    quantity: Math.max(Number(item.quantity || 1), 1),
  }
}

function normalizeProfile(profile) {
  return {
    phone_number: profile?.phone_number || '',
    province_city: profile?.province_city || DEFAULT_PROVINCE_CITY,
    delivery_address: profile?.delivery_address || '',
    delivery_note: profile?.delivery_note || '',
    telegram_username: profile?.telegram_username || '',
    facebook_link: profile?.facebook_link || '',
  }
}

function formatUsd(value) {
  const number = Number(value || 0)
  return new Intl.NumberFormat(getDisplayLanguageId(), {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(number) ? number : 0)
}

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
      {children}
      {required ? <span className="ml-1 text-[#e5484d]">*</span> : null}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="app-input h-12 w-full rounded-[16px] border px-4 text-[14px] font-semibold outline-none transition focus:border-[#8a70b5] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)]"
    />
  )
}

function DeliveryLogo({ company }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-white shadow-sm ring-1 ring-black/5">
      <img
        src={company.logo}
        alt={company.name}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
          event.currentTarget.nextElementSibling.style.display = 'flex'
        }}
      />
      <span className="hidden h-full w-full items-center justify-center bg-[var(--shadow-bg-soft)] text-[11px] font-extrabold text-[var(--shadow-text-primary)]">
        {company.shortName}
      </span>
    </div>
  )
}

function BuyerProfileSheet({
  open,
  onClose,
  readerName,
  profileLoading,
  phone,
  setPhone,
  address,
  setAddress,
  telegramUsername,
  setTelegramUsername,
  facebookLink,
  setFacebookLink,
  saving,
  onSave,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label={t('shadowMallCheckoutPage.closeBuyerProfile')}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-2xl md:bottom-auto md:left-1/2 md:top-1/2 md:w-[520px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[26px]">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[var(--shadow-border-strong)] md:hidden" />

        <div className="flex items-center justify-between gap-3 border-b border-[var(--shadow-border)] px-5 pb-4 pt-5">
          <div>
            <div className="text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCheckoutPage.buyerProfile')}</div>
            <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
              {t('shadowMallCheckoutPage.printedDeliveryRequired')}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] transition active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-xmark text-[13px]" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 pb-5 pt-4">
          {profileLoading ? (
            <div className="mb-4 rounded-[16px] bg-[#eef2ff] px-4 py-3 text-[12px] font-extrabold text-[#4f46e5] dark:bg-indigo-500/15 dark:text-indigo-300">
              {t('shadowMallCheckoutPage.loadingBuyerProfile')}
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <FieldLabel required>{t('shadowMallCheckoutPage.name')}</FieldLabel>
              <TextInput
                value={readerName || t('shadowMallCheckoutPage.pleaseLoginFirst')}
                disabled
                readOnly
              />
              <p className="mt-2 text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('shadowMallCheckoutPage.nameHelp')}
              </p>
            </div>

            <div>
              <FieldLabel required>{t('shadowMallCheckoutPage.phoneNumber')}</FieldLabel>
              <TextInput
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={t('shadowMallCheckoutPage.enterPhone')}
                inputMode="tel"
              />
            </div>

            <div>
              <FieldLabel>{t('shadowMallCheckoutPage.telegramUsername')}</FieldLabel>
              <TextInput
                value={telegramUsername}
                onChange={(event) => setTelegramUsername(event.target.value)}
                placeholder="@yourname"
              />
            </div>

            <div>
              <FieldLabel>{t('shadowMallCheckoutPage.facebookLink')}</FieldLabel>
              <TextInput
                value={facebookLink}
                onChange={(event) => setFacebookLink(event.target.value)}
                placeholder={t('shadowMallCheckoutPage.facebookPlaceholder')}
              />
            </div>

            <div>
              <FieldLabel required>{t('shadowMallCheckoutPage.deliveryAddress')}</FieldLabel>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder={t('shadowMallCheckoutPage.addressPlaceholder')}
                className="app-input min-h-[120px] w-full resize-none rounded-[16px] border px-4 py-3 text-[14px] font-semibold leading-6 outline-none transition focus:border-[#8a70b5]"
              />
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={onSave}
              className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-[0.99] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] dark:bg-white dark:text-[#111827]"
            >
              {saving ? t('shadowMallCheckoutPage.saving') : t('shadowMallCheckoutPage.saveInformation')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutItem({ item, onIncrease, onDecrease, onRemove }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="flex gap-3 border-b border-[var(--shadow-border)] py-3 last:border-b-0">
      <div className="h-[86px] w-[58px] shrink-0 overflow-hidden rounded-[12px] bg-[var(--shadow-bg-soft)]">
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
            <i className="fa-solid fa-book-open text-[15px]" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[var(--shadow-text-primary)]">{item.title}</div>
            <div className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{item.author}</div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95 dark:bg-red-500/10 dark:text-red-300"
            aria-label={t('shadowMallCheckoutPage.removeItem', { title: item.title })}
          >
            <i className="fa-solid fa-trash text-[11px]" />
          </button>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[13px] font-extrabold text-[#e5484d]">
              {formatUsd(item.price * item.quantity)}
            </div>
            {item.quantity > 1 ? (
              <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)]">
                {formatUsd(item.price)} {t('shadowMallCheckoutPage.each')}
              </div>
            ) : null}
          </div>

          <div className="flex items-center rounded-full bg-[var(--shadow-bg-soft)] p-1">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] active:scale-95"
              aria-label={`Decrease ${item.title}`}
            >
              <i className="fa-solid fa-minus text-[10px]" />
            </button>
            <div className="w-9 text-center text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{item.quantity}</div>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]"
              aria-label={`Increase ${item.title}`}
            >
              <i className="fa-solid fa-plus text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShadowMallCheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])
  const [readerUser, setReaderUser] = useState(null)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [telegramUsername, setTelegramUsername] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [note, setNote] = useState('')
  const [deliveryCompany, setDeliveryCompany] = useState('jnt')
  const [message, setMessage] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showOrderItems, setShowOrderItems] = useState(true)
  const [buyerProfileOpen, setBuyerProfileOpen] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadCheckout() {
      const localProfile = readBuyerProfileLocal()
      const token = getReaderToken()

      setItems(readCart().map(normalizeCartItem))
      setReaderUser(readReaderUser())
      setPhone(localProfile.phone_number || '')
      setAddress(localProfile.delivery_address || '')
      setTelegramUsername(localProfile.telegram_username || '')
      setFacebookLink(localProfile.facebook_link || '')
      setNote(localProfile.delivery_note || '')

      if (!token) {
        setProfileLoading(false)
        setBuyerProfileOpen(true)
        return
      }

      try {
        setProfileLoading(true)

        const response = await fetch(`${API_URL}/api/shadow-mall/buyer-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || t('shadowMallCheckoutPage.failedLoadProfile'))
        }

        if (!ignore && data.profile) {
          const serverProfile = normalizeProfile(data.profile)

          setPhone(serverProfile.phone_number)
          setAddress(serverProfile.delivery_address)
          setNote(serverProfile.delivery_note)
          setTelegramUsername(serverProfile.telegram_username)
          setFacebookLink(serverProfile.facebook_link)
          saveBuyerProfileLocal(serverProfile)
        }

        if (!ignore && (!data.profile?.phone_number || !data.profile?.delivery_address)) {
          setBuyerProfileOpen(true)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error.message || t('shadowMallCheckoutPage.failedLoadProfile'))
        }
      } finally {
        if (!ignore) setProfileLoading(false)
      }
    }

    loadCheckout()

    return () => {
      ignore = true
    }
  }, [])

  const readerName = useMemo(() => getReaderName(readerUser), [readerUser])

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const selectedDeliveryCompany = useMemo(
    () => deliveryCompanies.find((company) => company.key === deliveryCompany) || deliveryCompanies[0],
    [deliveryCompany]
  )

  const total = subtotal + DELIVERY_FEE

  const profileComplete =
    Boolean(readerName.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(address.trim())

  const canContinue =
    profileComplete &&
    items.length > 0 &&
    !saving

  function updateItems(nextItems) {
    const normalizedItems = nextItems.map(normalizeCartItem)
    setItems(normalizedItems)
    saveCart(normalizedItems)
  }

  function increaseItem(id) {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    )
  }

  function decreaseItem(id) {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    )
  }

  function removeItem(id) {
    updateItems(items.filter((item) => String(item.id) !== String(id)))
  }

  async function saveBuyerProfileOnly() {
    const token = getReaderToken()

    if (!readerName.trim() || !token) {
      setMessage(t('shadowMallCheckoutPage.loginBeforeSave'))
      return false
    }

    if (!phone.trim() || !address.trim()) {
      setMessage(t('shadowMallCheckoutPage.profileRequired'))
      return false
    }

    const profile = {
      phone_number: phone.trim(),
      province_city: DEFAULT_PROVINCE_CITY,
      delivery_address: address.trim(),
      delivery_note: note.trim(),
      telegram_username: telegramUsername.trim(),
      facebook_link: facebookLink.trim(),
    }

    try {
      setSaving(true)
      setMessage('')

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
        throw new Error(data.message || t('shadowMallCheckoutPage.failedSaveProfile'))
      }

      const savedProfile = normalizeProfile(data.profile || profile)

      saveBuyerProfileLocal(savedProfile)
      setPhone(savedProfile.phone_number)
      setAddress(savedProfile.delivery_address)
      setNote(savedProfile.delivery_note)
      setTelegramUsername(savedProfile.telegram_username)
      setFacebookLink(savedProfile.facebook_link)
      setBuyerProfileOpen(false)

      return true
    } catch (error) {
      setMessage(error.message || t('shadowMallCheckoutPage.failedSaveProfile'))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleContinue() {
    const token = getReaderToken()

    if (!readerName.trim() || !token) {
      setMessage(t('shadowMallCheckoutPage.loginBeforeCheckout'))
      setBuyerProfileOpen(true)
      return
    }

    if (!items.length) {
      setMessage(t('shadowMallCheckoutPage.cartEmpty'))
      return
    }

    if (!phone.trim() || !address.trim()) {
      setMessage(t('shadowMallCheckoutPage.profileRequired'))
      setBuyerProfileOpen(true)
      return
    }

    const profile = {
      phone_number: phone.trim(),
      province_city: DEFAULT_PROVINCE_CITY,
      delivery_address: address.trim(),
      delivery_note: note.trim(),
      telegram_username: telegramUsername.trim(),
      facebook_link: facebookLink.trim(),
    }

    try {
      setSaving(true)
      setMessage('')

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
        throw new Error(data.message || t('shadowMallCheckoutPage.failedSaveProfile'))
      }

      const savedProfile = normalizeProfile(data.profile || profile)
      saveBuyerProfileLocal(savedProfile)

      const orderResponse = await fetch(`${API_URL}/api/shadow-mall/orders/create-payment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          delivery_company: selectedDeliveryCompany,
        }),
      })

      const orderData = await orderResponse.json().catch(() => ({}))

      if (!orderResponse.ok || orderData.ok === false) {
        throw new Error(orderData.message || t('shadowMallCheckoutPage.failedCreatePayment'))
      }

      if (!orderData.order) {
        throw new Error(t('shadowMallCheckoutPage.paymentNotCreated'))
      }

      localStorage.setItem(
        'shadow_mall_current_order_payment',
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
      setMessage(error.message || t('shadowMallCheckoutPage.failedContinuePayment'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-page min-h-screen pb-[120px]">
      <BuyerProfileSheet
        open={buyerProfileOpen}
        onClose={() => setBuyerProfileOpen(false)}
        readerName={readerName}
        profileLoading={profileLoading}
        phone={phone}
        setPhone={setPhone}
        address={address}
        setAddress={setAddress}
        telegramUsername={telegramUsername}
        setTelegramUsername={setTelegramUsername}
        facebookLink={facebookLink}
        setFacebookLink={setFacebookLink}
        saving={saving}
        onSave={saveBuyerProfileOnly}
      />

      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/shop/mall/cart', { replace: true })
}}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallCheckoutPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-left text-[18px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('shadowMallCheckoutPage.checkout')}
          </h1>

          <button
            type="button"
            onClick={() => setBuyerProfileOpen(true)}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallCheckoutPage.openBuyerProfile')}
          >
            <i className="fa-solid fa-user text-[14px]" />
            {!profileComplete ? (
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#e5484d] ring-2 ring-[var(--shadow-nav-bg)]" />
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {message ? (
          <div className="mb-4 rounded-[18px] bg-[#fff1f1] px-4 py-3 text-[12px] font-extrabold text-[#e5484d] dark:bg-red-500/10 dark:text-red-300">
            {message}
          </div>
        ) : null}

        <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCheckoutPage.deliveryCompany')}</div>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
                {t('shadowMallCheckoutPage.chooseDeliveryCompany')}
              </p>
            </div>

            <div className="rounded-full bg-[#fff7d8] px-3 py-1 text-[11px] font-extrabold text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
              {formatUsd(DELIVERY_FEE)}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {deliveryCompanies.map((company) => {
              const selected = deliveryCompany === company.key

              return (
                <button
                  key={company.key}
                  type="button"
                  onClick={() => setDeliveryCompany(company.key)}
                  className={`flex items-center gap-3 rounded-[18px] border-2 p-3 text-left transition active:scale-[0.99] ${
                    selected
                      ? 'border-[#d4af37] bg-[#fffaf0] shadow-[0_10px_24px_rgba(212,175,55,0.18)] dark:bg-amber-500/10'
                      : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)]'
                  }`}
                >
                  <DeliveryLogo company={company} />

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{company.shortName}</div>
                    <div className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
                      {company.name}
                    </div>
                  </div>

                  {selected ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-white">
                      <i className="fa-solid fa-check text-[11px]" />
                    </div>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <FieldLabel>{t('shadowMallCheckoutPage.deliveryNote')}</FieldLabel>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t('shadowMallCheckoutPage.notePlaceholder')}
              className="app-input min-h-[90px] w-full resize-none rounded-[16px] border px-4 py-3 text-[14px] font-semibold leading-6 outline-none transition focus:border-[#8a70b5]"
            />
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] bg-[var(--shadow-bg-surface)] shadow-sm ring-1 ring-[var(--shadow-border)]">
          <button
            type="button"
            onClick={() => setShowOrderItems((value) => !value)}
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
          >
            <div>
              <div className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCheckoutPage.orderItems')}</div>
              <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('shadowMallCheckoutPage.booksInOrder', { count: Number(itemCount).toLocaleString(getDisplayLanguageId()) })}
              </div>
            </div>
            <i className={`fa-solid fa-chevron-down text-[12px] text-[var(--shadow-text-tertiary)] transition ${showOrderItems ? 'rotate-180' : ''}`} />
          </button>

          {showOrderItems ? (
            <div className="px-4 pb-3">
              {items.length ? (
                items.map((item) => (
                  <CheckoutItem
                    key={item.id}
                    item={item}
                    onIncrease={() => increaseItem(item.id)}
                    onDecrease={() => decreaseItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
                    <i className="fa-solid fa-cart-shopping text-[18px]" />
                  </div>
                  <div className="mt-3 text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCheckoutPage.noBooksCart')}</div>
                  <button
                    type="button"
                    onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/shop/mall/cart', { replace: true })
}}
                    className="mt-4 rounded-full bg-[#111827] px-5 py-3 text-[12px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
                  >
                    {t('shadowMallCheckoutPage.backToShop')}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="text-[16px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCheckoutPage.paymentSummary')}</div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
              <span>{t('shadowMallCheckoutPage.subtotal')}</span>
              <span className="font-extrabold text-[var(--shadow-text-primary)]">{formatUsd(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
              <span>{t('shadowMallCheckoutPage.deliveryFee')}</span>
              <span className="font-extrabold text-[var(--shadow-text-primary)]">{formatUsd(DELIVERY_FEE)}</span>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
              <span>{t('shadowMallCheckoutPage.deliveryCompany')}</span>
              <span className="font-extrabold text-[var(--shadow-text-primary)]">{selectedDeliveryCompany.shortName}</span>
            </div>

            <div className="border-t border-[var(--shadow-border)] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCheckoutPage.total')}</span>
                <span className="text-[20px] font-extrabold text-[#e5484d]">{formatUsd(total)}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{t('shadowMallCheckoutPage.total')}</div>
            <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatUsd(total)}</div>
          </div>

          {readerName ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinue}
              className="flex h-[52px] min-w-[180px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-disabled)] disabled:shadow-none dark:bg-white dark:text-[#111827]"
            >
              {saving ? t('shadowMallCheckoutPage.openingPayWay') : t('shadowMallCheckoutPage.continuePayment')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex h-[52px] min-w-[180px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallCheckoutPage.loginCheckout')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
