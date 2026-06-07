import { useMemo, useState } from 'react'

const STORE_TYPE_FILTERS = ['All', 'Books', 'PDF']

const STORE_SECTIONS = [
  {
    key: 'new-books',
    title: 'New Books',
    subtitle: 'Fresh copies and latest arrivals.',
    types: ['Books'],
    items: [],
  },
  {
    key: 'second-hand',
    title: 'Second Hand',
    subtitle: 'Checked condition, lower price, limited stock.',
    types: ['Books'],
    items: [],
  },
  {
    key: 'best-seller',
    title: 'Best Seller',
    subtitle: 'Books readers are choosing most.',
    types: ['Books'],
    items: [],
  },
  {
    key: 'pdf-books',
    title: 'PDF Books',
    subtitle: 'Digital books from this author.',
    types: ['PDF'],
    items: [],
  },
  {
    key: 'pre-order',
    title: 'Pre-order',
    subtitle: 'Reserve upcoming books before release.',
    types: ['Books'],
    items: [],
  },
]

function AuthorStoreProductCard({ item, onAddToCart }) {
  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative aspect-[3/4] bg-[#f3f4f6]">
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
            <i className="fa-regular fa-bookmark text-[26px]" />
          </div>
        )}

        {item.stock_label ? (
          <span className="absolute left-2 top-2 rounded-full bg-[#ecfdf3] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-[#027a48]">
            {item.stock_label}
          </span>
        ) : null}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-black leading-[18px] text-[#111827]">
          {item.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#8b93a1]">
          {item.type}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <div className="text-[13px] font-black text-[#e5484d]">
              {item.price || '$0.00'}
            </div>
            {item.old_price ? (
              <div className="text-[11px] font-semibold text-[#9ca3af] line-through">
                {item.old_price}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(item)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white active:scale-95"
            aria-label="Add to cart"
          >
            <i className="fa-solid fa-cart-shopping text-[13px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

function AuthorStoreShelf({ section, onMore, onAddToCart }) {
  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[17px] font-black leading-5 text-[#111827]">{section.title}</h2>
          <p className="mt-1 text-[11px] font-semibold leading-4 text-[#8b93a1]">
            {section.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onMore?.(section)}
          className="shrink-0 pt-0.5 text-[12px] font-black text-[#8b93a1] active:opacity-70"
        >
          More &gt;
        </button>
      </div>

      {section.items?.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {section.items.map((item) => (
            <AuthorStoreProductCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="rounded-[18px] bg-white px-4 py-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
            <i className="fa-regular fa-file-lines text-[16px]" />
          </div>
          <h3 className="text-[14px] font-black text-[#111827]">No items yet</h3>
          <p className="mx-auto mt-1.5 max-w-[260px] text-[12px] font-semibold leading-5 text-[#8b93a1]">
            Items in this section will appear here.
          </p>
        </div>
      )}
    </section>
  )
}

export default function AuthorStoreTab({ author, onMessage }) {
  const [activeType, setActiveType] = useState('All')

  const visibleSections = useMemo(() => {
    if (activeType === 'All') return STORE_SECTIONS
    return STORE_SECTIONS.filter((section) => section.types.includes(activeType))
  }, [activeType])

  const isOwner = Boolean(author?.is_owner)

  return (
    <div className="space-y-5">
      <section className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[18px] font-black text-[#111827]">Store</h2>
            <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8b93a1]">
              Books, PDFs, bundles, and pre-orders from this author.
            </p>
          </div>

          {isOwner ? (
            <button
              type="button"
              onClick={() => onMessage?.('Manage store is coming soon.')}
              className="shrink-0 rounded-full bg-[#f3f4f6] px-3 py-1.5 text-[11px] font-black text-[#111827] active:scale-95"
            >
              Manage
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {STORE_TYPE_FILTERS.map((type) => {
            const active = activeType === type

            return (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`h-8 shrink-0 rounded-full px-4 text-[12px] font-black transition active:scale-95 ${
                  active ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </section>

      {visibleSections.map((section) => (
        <AuthorStoreShelf
          key={section.key}
          section={section}
          onMore={() => onMessage?.(`${section.title} is coming soon.`)}
          onAddToCart={() => onMessage?.('Cart is coming soon.')}
        />
      ))}
    </div>
  )
}
