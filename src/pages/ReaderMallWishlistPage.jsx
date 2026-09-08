import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'
import {
  getReaderMallWishlist,
  removeReaderMallWishlist,
} from '../utils/readerMallWishlist'

registerTranslationNamespace('readerMallWishlist', {
  en: {
    title: 'Waitlist',
    back: 'Back to Store',
    empty: 'Your waitlist is empty.',
    emptySubtitle: 'Tap the heart on a book or PDF to save it here.',
    shadowMall: 'Shadow Mall',
    authorStore: 'Author Store',
    pdf: 'PDF',
    book: 'Book',
    remove: 'Remove from waitlist',
  },
  km: {
    title: 'Waitlist',
    back: 'ត្រឡប់ទៅហាង',
    empty: 'Waitlist របស់អ្នកនៅទទេ។',
    emptySubtitle: 'ចុចរូបបេះដូងលើសៀវភៅ ឬ PDF ដើម្បីរក្សាទុកនៅទីនេះ។',
    shadowMall: 'Shadow Mall',
    authorStore: 'ហាងអ្នកនិពន្ធ',
    pdf: 'PDF',
    book: 'សៀវភៅ',
    remove: 'ដកចេញពី Waitlist',
  },
  zh: {
    title: '心愿单',
    back: '返回商店',
    empty: '你的心愿单是空的。',
    emptySubtitle: '点击书籍或 PDF 上的爱心即可保存到这里。',
    shadowMall: 'Shadow Mall',
    authorStore: '作者商店',
    pdf: 'PDF',
    book: '书籍',
    remove: '从心愿单移除',
  },
  ja: {
    title: 'ウェイトリスト',
    back: 'ストアに戻る',
    empty: 'ウェイトリストは空です。',
    emptySubtitle: '本または PDF のハートを押すとここに保存されます。',
    shadowMall: 'Shadow Mall',
    authorStore: '作家ストア',
    pdf: 'PDF',
    book: '本',
    remove: 'ウェイトリストから削除',
  },
  ko: {
    title: '위시리스트',
    back: '스토어로 돌아가기',
    empty: '위시리스트가 비어 있습니다.',
    emptySubtitle: '도서 또는 PDF의 하트를 눌러 여기에 저장하세요.',
    shadowMall: 'Shadow Mall',
    authorStore: '작가 스토어',
    pdf: 'PDF',
    book: '도서',
    remove: '위시리스트에서 삭제',
  },
})

function displayPrice(value) {
  const text = String(value ?? '').trim()
  if (!text) return '$0.00'
  if (text.startsWith('$')) return text
  const number = Number(text)
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : text
}

function WaitlistImage({ src, alt }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-tertiary)]">
        <i className="fa-regular fa-image text-[22px]" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export default function ReaderMallWishlistPage({ onBack }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [items, setItems] = useState(() => getReaderMallWishlist())

  useEffect(() => {
    const refresh = () => setItems(getReaderMallWishlist())

    window.addEventListener('reader-mall-wishlist-change', refresh)
    window.addEventListener('shadow-mall-wishlist-change', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)

    return () => {
      window.removeEventListener('reader-mall-wishlist-change', refresh)
      window.removeEventListener('shadow-mall-wishlist-change', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => String(b.savedAt || '').localeCompare(String(a.savedAt || ''))),
    [items]
  )

  const openItem = (item) => {
    if (item.source === 'shadow') {
      navigate(`/shop/mall/product/${encodeURIComponent(item.productId)}`)
      return
    }

    if (!item.pageUsername) return

    navigate(
      `/author/page/${encodeURIComponent(item.pageUsername)}/store/product/${encodeURIComponent(item.productId)}`
    )
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-[40px] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-[560px] items-center gap-2 px-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={t('readerMallWishlist.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>
          <h1 className="text-[19px] font-extrabold tracking-tight">
            {t('readerMallWishlist.title')}
          </h1>
          <span className="ml-auto rounded-full bg-[var(--shadow-bg-soft)] px-2.5 py-1 text-[11px] font-extrabold text-[var(--shadow-text-secondary)]">
            {sortedItems.length}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 pt-4">
        {sortedItems.length ? (
          <div className="space-y-3">
            {sortedItems.map((item) => {
              const sourceLabel =
                item.source === 'shadow'
                  ? t('readerMallWishlist.shadowMall')
                  : t('readerMallWishlist.authorStore')
              const typeLabel =
                item.type === 'pdf'
                  ? t('readerMallWishlist.pdf')
                  : t('readerMallWishlist.book')

              return (
                <article
                  key={`${item.source}-${item.sellerId}-${item.productId}`}
                  className="flex gap-3 rounded-[14px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]"
                >
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className="h-[112px] w-[82px] shrink-0 overflow-hidden rounded-[10px] bg-[var(--shadow-bg-soft)]"
                  >
                    <WaitlistImage src={item.cover} alt={item.title} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openItem(item)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-[#ede9fe] px-2 py-1 text-[8.5px] font-extrabold text-[#6d28d9]">
                            {sourceLabel}
                          </span>
                          <span className="rounded-full bg-[var(--shadow-bg-soft)] px-2 py-1 text-[8.5px] font-extrabold text-[var(--shadow-text-secondary)]">
                            {typeLabel}
                          </span>
                        </div>
                        <h2 className="mt-2 line-clamp-2 text-[13px] font-extrabold leading-5">
                          {item.title}
                        </h2>
                        <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
                          {item.author}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeReaderMallWishlist(item)}
                        aria-label={t('readerMallWishlist.remove')}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[#e5484d] active:scale-95"
                      >
                        <i className="fa-solid fa-heart text-[13px]" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openItem(item)}
                      className="mt-3 text-left text-[13px] font-extrabold text-[#7c3aed]"
                    >
                      {displayPrice(item.price)}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[18px] bg-[var(--shadow-bg-surface)] px-5 py-12 text-center shadow-sm ring-1 ring-[var(--shadow-border)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)]">
              <i className="fa-regular fa-heart text-[21px]" />
            </div>
            <h2 className="mt-4 text-[15px] font-extrabold">
              {t('readerMallWishlist.empty')}
            </h2>
            <p className="mx-auto mt-1 max-w-[300px] text-[11.5px] font-semibold leading-5 text-[var(--shadow-text-tertiary)]">
              {t('readerMallWishlist.emptySubtitle')}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
