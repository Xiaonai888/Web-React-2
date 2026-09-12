import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
registerTranslationNamespace('authorCart', {
  en: {
    myCart: 'My Cart',
    selectedBooks: 'Selected Books',
    checkBeforeCheckout: 'Check your books and quantity before checkout.',
    orderHistory: 'Order History',
    orderHistoryHelp: 'View your previous author store orders.',
    book: 'Book',
    cartEmpty: 'Your cart is empty',
    cartEmptyHelp: 'Add books from an author store to see them here.',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery fee',
    calculateLater: 'Calculate later',
    total: 'Total',
    deliveryFeeHelp: 'Delivery fee will be added after address information.',
    checkout: 'Checkout',
    removeItem: 'Remove item',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    goBack: 'Go back',
  },
  km: {
    myCart: 'រទេះរបស់ខ្ញុំ',
    selectedBooks: 'សៀវភៅដែលបានជ្រើស',
    checkBeforeCheckout: 'ពិនិត្យសៀវភៅ និងចំនួនមុនពេលបន្តទៅការទូទាត់។',
    orderHistory: 'ប្រវត្តិការបញ្ជាទិញ',
    orderHistoryHelp: 'មើលការបញ្ជាទិញពីហាងអ្នកនិពន្ធរបស់អ្នកពីមុន។',
    book: 'សៀវភៅ',
    cartEmpty: 'រទេះរបស់អ្នកទទេ',
    cartEmptyHelp: 'បន្ថែមសៀវភៅពីហាងអ្នកនិពន្ធ ដើម្បីមើលវានៅទីនេះ។',
    orderSummary: 'សង្ខេបការបញ្ជាទិញ',
    subtotal: 'តម្លៃសរុបរង',
    deliveryFee: 'ថ្លៃដឹកជញ្ជូន',
    calculateLater: 'គណនាពេលក្រោយ',
    total: 'សរុប',
    deliveryFeeHelp: 'ថ្លៃដឹកជញ្ជូននឹងត្រូវបន្ថែមបន្ទាប់ពីបញ្ចូលព័ត៌មានអាសយដ្ឋាន។',
    checkout: 'បន្តទូទាត់',
    removeItem: 'លុបចេញពីរទេះ',
    decreaseQuantity: 'បន្ថយចំនួន',
    increaseQuantity: 'បង្កើនចំនួន',
    goBack: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    myCart: '我的购物车',
    selectedBooks: '已选书籍',
    checkBeforeCheckout: '结账前请确认书籍和数量。',
    orderHistory: '订单记录',
    orderHistoryHelp: '查看之前的作者商店订单。',
    book: '书籍',
    cartEmpty: '购物车为空',
    cartEmptyHelp: '从作者商店添加书籍后会显示在这里。',
    orderSummary: '订单摘要',
    subtotal: '小计',
    deliveryFee: '配送费',
    calculateLater: '稍后计算',
    total: '总计',
    deliveryFeeHelp: '填写地址信息后将加入配送费。',
    checkout: '结账',
    removeItem: '移除商品',
    decreaseQuantity: '减少数量',
    increaseQuantity: '增加数量',
    goBack: '返回',
  },
  ja: {
    myCart: 'マイカート',
    selectedBooks: '選択した本',
    checkBeforeCheckout: '購入手続きの前に本と数量を確認してください。',
    orderHistory: '注文履歴',
    orderHistoryHelp: '過去の著者ストア注文を確認します。',
    book: '本',
    cartEmpty: 'カートは空です',
    cartEmptyHelp: '著者ストアから本を追加するとここに表示されます。',
    orderSummary: '注文概要',
    subtotal: '小計',
    deliveryFee: '配送料',
    calculateLater: '後で計算',
    total: '合計',
    deliveryFeeHelp: '住所情報の入力後に配送料が追加されます。',
    checkout: '購入手続き',
    removeItem: '商品を削除',
    decreaseQuantity: '数量を減らす',
    increaseQuantity: '数量を増やす',
    goBack: '戻る',
  },
  ko: {
    myCart: '내 장바구니',
    selectedBooks: '선택한 책',
    checkBeforeCheckout: '결제 전에 책과 수량을 확인하세요.',
    orderHistory: '주문 내역',
    orderHistoryHelp: '이전 작가 스토어 주문을 확인하세요.',
    book: '책',
    cartEmpty: '장바구니가 비어 있습니다',
    cartEmptyHelp: '작가 스토어에서 책을 추가하면 여기에 표시됩니다.',
    orderSummary: '주문 요약',
    subtotal: '소계',
    deliveryFee: '배송비',
    calculateLater: '나중에 계산',
    total: '합계',
    deliveryFeeHelp: '주소 정보를 입력한 뒤 배송비가 추가됩니다.',
    checkout: '결제하기',
    removeItem: '상품 삭제',
    decreaseQuantity: '수량 줄이기',
    increaseQuantity: '수량 늘리기',
    goBack: '뒤로',
  },
})

function getAuthorCartItems() {
  try {
    const items = JSON.parse(localStorage.getItem('shadow_author_cart_items') || '[]')
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

function saveAuthorCartItems(items) {
  localStorage.setItem('shadow_author_cart_items', JSON.stringify(items))
  window.dispatchEvent(new Event('shadow-author-cart-updated'))
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

function getItemPrice(item) {
  return Number(item.price_value || 0)
}

function getItemCover(item) {
  return item.cover_url || ''
}

function getItemType(item, t) {
  return item.type === 'Book' ? t('authorCart.book') : item.type || t('authorCart.book')
}

export default function AuthorCartPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useDisplayTranslation()
  const [authorItems, setAuthorItems] = useState(getAuthorCartItems)
  const items = authorItems
  const totalCartCount = items.length

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + getItemPrice(item) * Math.max(1, Number(item.quantity || 1)),
        0
      ),
    [items]
  )

  function updateQuantity(id, nextQuantity) {
    const quantity = Math.max(1, Math.min(99, Number(nextQuantity || 1)))
    const nextItems = authorItems.map((item) =>
      String(item.id) === String(id) ? { ...item, quantity } : item
    )

    setAuthorItems(nextItems)
    saveAuthorCartItems(nextItems)
  }

  function removeItem(id) {
    const nextItems = authorItems.filter((item) => String(item.id) !== String(id))
    setAuthorItems(nextItems)
    saveAuthorCartItems(nextItems)
  }

  function openOrderHistory() {
  navigate('/author/orders', {
    state: { from: location.pathname + location.search + location.hash },
  })
}

  function openCheckout() {
  if (!items.length) return

  navigate('/author/checkout', {
    state: { from: location.pathname + location.search + location.hash },
  })
}

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[92px]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-4">
          <button type="button" aria-label={t('authorCart.goBack')} onClick={() => {
  if (location.state?.from) {
    navigate(-1)
    return
  }

  navigate('/store', { replace: true })
}} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)] active:scale-95">
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>
          <div className="min-w-0 flex-1 px-3 text-[18px] font-black text-[var(--shadow-text-primary)]">{t('authorCart.myCart')}</div>
          <div className="relative flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)]">
            <i className="fa-solid fa-cart-shopping text-[17px]" />
            {totalCartCount ? (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f6c400] px-1 text-[10px] font-black text-[#111827]">
                {totalCartCount > 99 ? '99+' : number(totalCartCount)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-4">
        

        <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] px-4 py-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <h1 className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorCart.selectedBooks')}</h1>
          <p className="mt-1 text-[12px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCart.checkBeforeCheckout')}</p>
        </section>

        <button type="button" onClick={openOrderHistory} className="mt-3 flex w-full items-center justify-between rounded-[24px] bg-[var(--shadow-bg-surface)] px-4 py-4 text-left shadow-sm ring-1 ring-[var(--shadow-border)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4cc] text-[#9a6a00]">
              <i className="fa-solid fa-clock-rotate-left text-[15px]" />
            </span>
            <span>
              <span className="block text-[14px] font-black text-[var(--shadow-text-primary)]">{t('authorCart.orderHistory')}</span>
              <span className="mt-0.5 block text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCart.orderHistoryHelp')}</span>
            </span>
          </div>
          <i className="fa-solid fa-chevron-right text-[12px] text-[var(--shadow-text-disabled)]" />
        </button>

        <section className="mt-3 space-y-3">
          {items.length ? items.map((item) => {
            const cover = getItemCover(item)
            const itemType = getItemType(item, t)
            const itemTotal = getItemPrice(item) * Math.max(1, Number(item.quantity || 1))

            return (
              <article key={item.id} className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
                <div className="flex gap-3">
                  <div className="h-[96px] w-[70px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--shadow-bg-soft)] ring-1 ring-[var(--shadow-border)]">
                    {cover ? (
                      <img src={cover} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
                        <i className="fa-regular fa-image text-[18px]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="line-clamp-1 text-[14px] font-black text-[var(--shadow-text-primary)]">{item.title}</h2>
                        <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{itemType}</p>
                      </div>
                      <button type="button" aria-label={t('authorCart.removeItem')} onClick={() => removeItem(item.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#e5484d] active:scale-95">
                        <i className="fa-solid fa-trash text-[11px]" />
                      </button>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div className="text-[14px] font-black text-[#e5484d]">{money(itemTotal)}</div>
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label={t('authorCart.decreaseQuantity')} onClick={() => updateQuantity(item.id, Number(item.quantity || 1) - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                          <i className="fa-solid fa-minus text-[11px]" />
                        </button>
                        <span className="w-5 text-center text-[13px] font-black text-[var(--shadow-text-primary)]">{number(item.quantity || 1)}</span>
                        <button type="button" aria-label={t('authorCart.increaseQuantity')} onClick={() => updateQuantity(item.id, Number(item.quantity || 1) + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--shadow-text-primary)] text-[var(--shadow-bg-surface)]">
                          <i className="fa-solid fa-plus text-[11px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          }) : (
            <div className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-8 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
                <i className="fa-solid fa-cart-shopping text-[20px]" />
              </div>
              <h2 className="text-[16px] font-black text-[var(--shadow-text-primary)]">{t('authorCart.cartEmpty')}</h2>
              <p className="mx-auto mt-2 max-w-[260px] text-[12px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">{t('authorCart.cartEmptyHelp')}</p>
            </div>
          )}
        </section>

        <section className="mt-3 rounded-[24px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <h2 className="text-[15px] font-black text-[var(--shadow-text-primary)]">{t('authorCart.orderSummary')}</h2>
          <div className="mt-4 space-y-3 text-[12px] font-semibold">
            <div className="flex justify-between text-[var(--shadow-text-secondary)]">
              <span>{t('authorCart.subtotal')}</span>
              <span className="font-black text-[var(--shadow-text-primary)]">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[var(--shadow-text-secondary)]">
              <span>{t('authorCart.deliveryFee')}</span>
              <span className="font-black text-[var(--shadow-text-primary)]">{t('authorCart.calculateLater')}</span>
            </div>
            <div className="border-t border-[var(--shadow-border)] pt-3">
              <div className="flex justify-between text-[14px] font-black text-[var(--shadow-text-primary)]">
                <span>{t('authorCart.total')}</span>
                <span className="text-[#e5484d]">{money(subtotal)}</span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCart.deliveryFeeHelp')}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-[82px] max-w-[980px] items-center justify-between px-4">
          <div>
            <div className="text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('authorCart.total')}</div>
            <div className="mt-1 text-[17px] font-black text-[#e5484d]">{money(subtotal)}</div>
          </div>
          <button type="button" disabled={!items.length} onClick={openCheckout} className="h-12 rounded-full bg-[var(--shadow-text-primary)] px-10 text-[13px] font-black text-[var(--shadow-bg-surface)] shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-45">
            {t('authorCart.checkout')}
          </button>
        </div>
      </footer>
    </div>
  )
}
