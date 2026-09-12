import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowMallCartPage', {
  en: {
    untitledBook: "Untitled book",
    unknownAuthor: "Unknown author",
    remove: "Remove {{title}}",
    decrease: "Decrease {{title}}",
    increase: "Increase {{title}}",
    goBack: "Go back",
    myCart: "My Cart",
    cartItems: "Cart items",
    selectedBooks: "Selected Books",
    selectedHelp: "Check your books and quantity before checkout.",
    orderHistory: "Order History",
    orderHistoryHelp: "View your previous Shadow Mall orders.",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    deliveryFee: "Delivery fee",
    calculateLater: "Calculate later",
    total: "Total",
    deliveryLater: "Delivery fee will be added after address information.",
    emptyTitle: "Your cart is empty",
    emptyBody: "Add real books from Shadow Mall before checkout.",
    backShop: "Back to Shop",
    checkout: "Checkout",
  },
  km: {
    untitledBook: "សៀវភៅគ្មានចំណងជើង",
    unknownAuthor: "មិនស្គាល់អ្នកនិពន្ធ",
    remove: "លុប {{title}}",
    decrease: "បន្ថយ {{title}}",
    increase: "បន្ថែម {{title}}",
    goBack: "ត្រឡប់ក្រោយ",
    myCart: "កន្ត្រករបស់ខ្ញុំ",
    cartItems: "ទំនិញក្នុងកន្ត្រក",
    selectedBooks: "សៀវភៅដែលបានជ្រើស",
    selectedHelp: "ពិនិត្យសៀវភៅ និងចំនួនមុន Checkout។",
    orderHistory: "ប្រវត្តិការបញ្ជាទិញ",
    orderHistoryHelp: "មើលការបញ្ជាទិញ Shadow Mall មុនៗរបស់អ្នក។",
    orderSummary: "សង្ខេបការបញ្ជាទិញ",
    subtotal: "តម្លៃសរុបរង",
    deliveryFee: "ថ្លៃដឹកជញ្ជូន",
    calculateLater: "គណនាពេលក្រោយ",
    total: "សរុប",
    deliveryLater: "ថ្លៃដឹកជញ្ជូននឹងបន្ថែមបន្ទាប់ពីបំពេញអាសយដ្ឋាន។",
    emptyTitle: "កន្ត្រករបស់អ្នកទទេ",
    emptyBody: "បន្ថែមសៀវភៅពិតពី Shadow Mall មុន Checkout។",
    backShop: "ត្រឡប់ទៅហាង",
    checkout: "Checkout",
  },
  zh: {
    untitledBook: "无标题图书",
    unknownAuthor: "未知作者",
    remove: "移除 {{title}}",
    decrease: "减少 {{title}}",
    increase: "增加 {{title}}",
    goBack: "返回",
    myCart: "我的购物车",
    cartItems: "购物车商品",
    selectedBooks: "已选图书",
    selectedHelp: "结账前请检查图书和数量。",
    orderHistory: "订单历史",
    orderHistoryHelp: "查看你之前的 Shadow Mall 订单。",
    orderSummary: "订单摘要",
    subtotal: "小计",
    deliveryFee: "配送费",
    calculateLater: "稍后计算",
    total: "总计",
    deliveryLater: "填写地址后将加入配送费。",
    emptyTitle: "购物车为空",
    emptyBody: "结账前请先从 Shadow Mall 添加实体书。",
    backShop: "返回商店",
    checkout: "结账",
  },
  ja: {
    untitledBook: "無題の本",
    unknownAuthor: "不明な作者",
    remove: "{{title}}を削除",
    decrease: "{{title}}を減らす",
    increase: "{{title}}を増やす",
    goBack: "戻る",
    myCart: "カート",
    cartItems: "カートの商品",
    selectedBooks: "選択した本",
    selectedHelp: "購入前に本と数量を確認してください。",
    orderHistory: "注文履歴",
    orderHistoryHelp: "以前の Shadow Mall 注文を確認します。",
    orderSummary: "注文概要",
    subtotal: "小計",
    deliveryFee: "配送料",
    calculateLater: "後で計算",
    total: "合計",
    deliveryLater: "住所情報の入力後に配送料が追加されます。",
    emptyTitle: "カートは空です",
    emptyBody: "購入前に Shadow Mall から本を追加してください。",
    backShop: "ショップに戻る",
    checkout: "購入手続き",
  },
  ko: {
    untitledBook: "제목 없는 도서",
    unknownAuthor: "알 수 없는 작가",
    remove: "{{title}} 삭제",
    decrease: "{{title}} 수량 줄이기",
    increase: "{{title}} 수량 늘리기",
    goBack: "뒤로",
    myCart: "내 장바구니",
    cartItems: "장바구니 상품",
    selectedBooks: "선택한 도서",
    selectedHelp: "결제 전에 도서와 수량을 확인하세요.",
    orderHistory: "주문 내역",
    orderHistoryHelp: "이전 Shadow Mall 주문을 확인하세요.",
    orderSummary: "주문 요약",
    subtotal: "소계",
    deliveryFee: "배송비",
    calculateLater: "나중에 계산",
    total: "합계",
    deliveryLater: "주소 입력 후 배송비가 추가됩니다.",
    emptyTitle: "장바구니가 비어 있습니다",
    emptyBody: "결제 전에 Shadow Mall에서 실제 도서를 추가하세요.",
    backShop: "상점으로 돌아가기",
    checkout: "결제하기",
  },
})

const CART_KEY = 'shadow_mall_cart'

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-mall-cart-updated'))
  window.dispatchEvent(new Event('shadow-mall-cart-change'))
}

function formatUsd(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '$0.00'
  return new Intl.NumberFormat(getDisplayLanguageId(), { style: 'currency', currency: 'USD' }).format(number)
}

function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title || getDisplayText('shadowMallCartPage.untitledBook'),
    author: item.author || item.author_name || getDisplayText('shadowMallCartPage.unknownAuthor'),
    cover: item.cover || item.cover_url || '',
    price: Number(item.price || item.price_usd || 0),
    oldPrice: item.oldPrice || item.old_price_usd ? Number(item.oldPrice || item.old_price_usd || 0) : 0,
    quantity: Math.max(Number(item.quantity || 1), 1),
  }
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { t } = useDisplayTranslation()
  return (
    <article className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
      <div className="flex gap-3">
        <div className="h-[116px] w-[78px] shrink-0 overflow-hidden rounded-[16px] bg-[var(--shadow-bg-soft)]">
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
              <i className="fa-solid fa-book-open text-[18px]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-extrabold leading-5 text-[var(--shadow-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-[11.5px] font-semibold text-[var(--shadow-text-secondary)]">
                {item.author}
              </p>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95 dark:bg-red-500/10 dark:text-red-300"
              aria-label={t('shadowMallCartPage.remove', { title: item.title })}
            >
              <i className="fa-solid fa-trash text-[11px]" />
            </button>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <div className="text-[14px] font-extrabold text-[#e5484d]">{formatUsd(item.price)}</div>
              {item.oldPrice ? (
                <div className="mt-0.5 text-[10.5px] font-semibold text-[var(--shadow-text-tertiary)] line-through">
                  {formatUsd(item.oldPrice)}
                </div>
              ) : null}
            </div>

            <div className="flex items-center rounded-full bg-[var(--shadow-bg-soft)] p-1">
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] active:scale-95"
                aria-label={t('shadowMallCartPage.decrease', { title: item.title })}
              >
                <i className="fa-solid fa-minus text-[10px]" />
              </button>
              <div className="w-9 text-center text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{Number(item.quantity).toLocaleString(getDisplayLanguageId())}</div>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95 dark:bg-white dark:text-[#111827]"
                aria-label={t('shadowMallCartPage.increase', { title: item.title })}
              >
                <i className="fa-solid fa-plus text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ShadowMallCartPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(readCart().map(normalizeItem))
  }, [])

  function updateItems(nextItems) {
    setItems(nextItems)
    saveCart(nextItems)
  }

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const increaseItem = (id) => {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    )
  }

  const decreaseItem = (id) => {
    updateItems(
      items.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    )
  }

  const removeItem = (id) => {
    updateItems(items.filter((item) => String(item.id) !== String(id)))
  }

  return (
    <div className="app-page min-h-screen pb-[120px]">
      <header className="sticky top-0 z-50 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            type="button"
            onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/shop', { replace: true })
}}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallCartPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 text-left text-[18px] font-extrabold text-[var(--shadow-text-primary)]">
            {t('shadowMallCartPage.myCart')}
          </h1>

          <button
            type="button"
            onClick={() =>
  navigate('/shop/mall/cart', {
    replace: true,
    state: location.state,
  })
}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('shadowMallCartPage.cartItems')}
          >
            <i className="fa-solid fa-cart-shopping text-[20px]" />
            {itemCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f6b800] px-1 text-[10px] font-extrabold text-[#111827]">
                {Number(itemCount).toLocaleString(getDisplayLanguageId())}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-4">
        {items.length ? (
          <>
            <section className="rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.selectedBooks')}</div>
              <div className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                {t('shadowMallCartPage.selectedHelp')}
              </div>
            </section>

            <button
              type="button"
              onClick={() =>
  navigate('/shop/mall/orders', {
    state: { from: location.pathname + location.search + location.hash },
  })
}
              className="mt-3 flex w-full items-center gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
                <i className="fa-solid fa-clock-rotate-left text-[15px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.orderHistory')}</div>
                <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  {t('shadowMallCartPage.orderHistoryHelp')}
                </div>
              </div>

              <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-tertiary)]" />
            </button>

            <section className="mt-3 space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={() => increaseItem(item.id)}
                  onDecrease={() => decreaseItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </section>

            <section className="mt-4 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="text-[15px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.orderSummary')}</div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
                  <span>{t('shadowMallCartPage.subtotal')}</span>
                  <span className="font-extrabold text-[var(--shadow-text-primary)]">{formatUsd(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--shadow-text-secondary)]">
                  <span>{t('shadowMallCartPage.deliveryFee')}</span>
                  <span className="font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.calculateLater')}</span>
                </div>

                <div className="border-t border-[var(--shadow-border)] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.total')}</span>
                    <span className="text-[18px] font-extrabold text-[#e5484d]">{formatUsd(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[var(--shadow-text-secondary)]">
                    {t('shadowMallCartPage.deliveryLater')}
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
  navigate('/shop/mall/orders', {
    state: { from: location.pathname + location.search + location.hash },
  })
}
              className="mb-4 flex w-full items-center gap-3 rounded-[22px] bg-[var(--shadow-bg-surface)] px-4 py-3 text-left shadow-sm ring-1 ring-[var(--shadow-border)] active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7d8] text-[#7a5600] dark:bg-amber-500/15 dark:text-amber-300">
                <i className="fa-solid fa-clock-rotate-left text-[15px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.orderHistory')}</div>
                <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
                  {t('shadowMallCartPage.orderHistoryHelp')}
                </div>
              </div>

              <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[var(--shadow-text-tertiary)]" />
            </button>

            <section className="rounded-[26px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-tertiary)]">
                <i className="fa-solid fa-cart-shopping text-[22px]" />
              </div>
              <h2 className="mt-4 text-[18px] font-extrabold text-[var(--shadow-text-primary)]">{t('shadowMallCartPage.emptyTitle')}</h2>
              <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
                {t('shadowMallCartPage.emptyBody')}
              </p>
              <button
                type="button"
                onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/shop', { replace: true })
}}
                className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-[13px] font-extrabold text-white active:scale-95 dark:bg-white dark:text-[#111827]"
              >
                {t('shadowMallCartPage.backShop')}
              </button>
            </section>
          </>
        )}
      </main>

      {items.length ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{t('shadowMallCartPage.total')}</div>
              <div className="line-clamp-1 text-[18px] font-extrabold text-[#e5484d]">{formatUsd(subtotal)}</div>
            </div>

            <button
              type="button"
              onClick={() =>
  navigate('/shop/mall/checkout', {
    state: { from: location.pathname + location.search + location.hash },
  })
}
              className="flex h-[52px] min-w-[160px] items-center justify-center rounded-full bg-[#111827] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_28px_rgba(17,24,39,0.24)] active:scale-[0.99] dark:bg-white dark:text-[#111827]"
            >
              {t('shadowMallCartPage.checkout')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
