import { BookOpen, Clock3, Gem, LockKeyhole, ShoppingBag, Tag } from 'lucide-react'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('promotionBookShelf', {
  en: {
    storyTitle: 'Special Promotion', storeTitle: 'Book & PDF Promotion', ends: 'Ends in',
    episodes: '{{count}} locked episodes', book: 'Book', pdf: 'PDF', read: 'Read',
    buy: 'Buy now',
  },
  km: {
    storyTitle: 'ប្រូម៉ូសិនពិសេស', storeTitle: 'ប្រូម៉ូសិនសៀវភៅ និង PDF', ends: 'នៅសល់',
    episodes: '{{count}} ភាគចាក់សោ', book: 'សៀវភៅ', pdf: 'PDF', read: 'អាន',
    buy: 'ទិញឥឡូវនេះ',
  },
  zh: {
    storyTitle: '特别优惠', storeTitle: '图书与 PDF 优惠', ends: '剩余时间',
    episodes: '{{count}} 章待解锁', book: '图书', pdf: 'PDF', read: '阅读',
    buy: '立即购买',
  },
  ja: {
    storyTitle: '特別セール', storeTitle: '書籍・PDF セール', ends: '残り時間',
    episodes: 'ロック中の{{count}}話', book: '書籍', pdf: 'PDF', read: '読む',
    buy: '今すぐ購入',
  },
  ko: {
    storyTitle: '특별 프로모션', storeTitle: '도서 및 PDF 프로모션', ends: '남은 시간',
    episodes: '잠긴 에피소드 {{count}}개', book: '도서', pdf: 'PDF', read: '읽기',
    buy: '지금 구매',
  },
})

function formatRemaining(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const remaining = value % 60
  return [hours, minutes, remaining].map((part) => String(part).padStart(2, '0')).join(':')
}

function getPrice(offer, isStory) {
  const discounted = Number(isStory ? offer.discounted_price_diamonds : offer.promotion_price_usd)
  const original = Number(isStory ? offer.original_price_diamonds : offer.original_price_usd)
  return { discounted, original }
}

export default function PromotionBookShelf({
  kind = 'story',
  offers = [],
  remainingSeconds = 0,
  onBuy,
  onRead,
  isPurchased,
}) {
  const { t } = useDisplayTranslation()
  const isStory = kind === 'story'
  const items = (Array.isArray(offers) ? offers : []).filter((offer) => {
    if (!offer || !String((isStory ? offer.story_id : offer.product_id) || '').trim()) return false
    const { discounted } = getPrice(offer, isStory)
    return Number.isFinite(discounted) && discounted > 0
  }).slice(0, 3)

  if (!items.length || remainingSeconds <= 0) return null

  return (
    <section className="px-3 pb-2 pt-0 md:px-4" aria-label={t(isStory ? 'promotionBookShelf.storyTitle' : 'promotionBookShelf.storeTitle')}>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <div className="flex min-w-0 items-center gap-2">
          {isStory ? <Tag className="h-5 w-5 shrink-0 text-[#e39c21]" aria-hidden="true" /> : <ShoppingBag className="h-5 w-5 shrink-0 text-[#e39c21]" aria-hidden="true" />}
          <h2 className="text-[18px] font-extrabold tracking-tight text-[var(--shadow-text-primary)] lg:text-[19px]">
            {t(isStory ? 'promotionBookShelf.storyTitle' : 'promotionBookShelf.storeTitle')}
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]" role="timer" aria-live="off">
          <Clock3 className="h-3 w-3" aria-hidden="true" />
          <span>{t('promotionBookShelf.ends')}</span>
          <span className="font-bold tabular-nums text-[var(--shadow-text-primary)]">{formatRemaining(remainingSeconds)}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-4 md:gap-3">
        {items.map((offer) => {
          const id = String(isStory ? offer.story_id : offer.product_id)
          const title = String(isStory ? offer.story_title || offer.title || '' : offer.title || '')
          const cover = String(offer.cover_url || '')
          const { discounted, original } = getPrice(offer, isStory)
          const discount = Math.max(0, Math.min(99, Number(offer.discount_percent) || 0))
          const purchased = isStory && typeof isPurchased === 'function' && isPurchased(offer)
          const canClick = purchased ? typeof onRead === 'function' : typeof onBuy === 'function'
          const typeLabel = isStory
            ? t('promotionBookShelf.episodes', { count: Number(offer.locked_episode_count || 0) })
            : t(offer.product_type === 'pdf' ? 'promotionBookShelf.pdf' : 'promotionBookShelf.book')
          const formatPrice = (value) => isStory
            ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })
            : `$${Number(value).toFixed(2)}`

          return (
            <button
              type="button"
              key={`${kind}-${id}`}
              disabled={!canClick}
              onClick={() => purchased ? onRead(offer) : onBuy(offer)}
              aria-label={`${purchased ? t('promotionBookShelf.read') : t('promotionBookShelf.buy')}: ${title}`}
              className="group block min-w-0 border-0 bg-transparent p-0 text-left disabled:cursor-default"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)] shadow-sm">
                {cover ? (
                  <img src={cover} alt={title} loading="lazy" decoding="async" draggable="false" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full items-center justify-center"><BookOpen className="h-8 w-8 text-[var(--shadow-text-secondary)]" aria-hidden="true" /></div>
                )}
                {discount > 0 ? <span className="absolute left-1 top-1 rounded bg-[#d82035] px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{discount}%</span> : null}
              </div>
              <h3 className="mt-2 line-clamp-2 min-h-[35px] text-[12px] font-bold leading-[17px] text-[var(--shadow-text-primary)]">{title}</h3>
              <div className="mt-1 flex min-w-0 items-center gap-1 text-[10px] text-[var(--shadow-text-secondary)]">
                {isStory ? <LockKeyhole className="h-3 w-3 shrink-0" aria-hidden="true" /> : <BookOpen className="h-3 w-3 shrink-0" aria-hidden="true" />}
                <span className="truncate">{typeLabel}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                {purchased ? (
                  <span className="text-[12px] font-bold text-[#a57817] dark:text-[#f0c86e]">{t('promotionBookShelf.read')}</span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-0.5 text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
                      {isStory ? <Gem className="h-3.5 w-3.5 text-[#1baff0]" aria-hidden="true" /> : null}
                      {formatPrice(discounted)}
                    </span>
                    {original > discounted ? <span className="text-[10px] text-[var(--shadow-text-secondary)] line-through">{formatPrice(original)}</span> : null}
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
