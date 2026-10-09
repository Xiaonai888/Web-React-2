import { Gem, LockKeyhole, MoreHorizontal } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('discoverSpecialPromotion', {
  en: {
    heading: 'Special Promotion',
    episodes: '{{count}} Locked Episodes',
    buy: 'Buy All Unlocked Episodes',
    story: 'Story',
    cover: 'No Cover',
    more: 'More options',
  },
  km: {
    heading: 'ការផ្ដល់ជូនពិសេស',
    episodes: '{{count}} ភាគចាក់សោ',
    buy: 'Buy All Unlocked Episodes',
    story: 'រឿង',
    cover: 'គ្មានក្រប',
    more: 'ជម្រើសបន្ថែម',
  },
  zh: {
    heading: '特别优惠',
    episodes: '{{count}} 章已锁定',
    buy: 'Buy All Unlocked Episodes',
    story: '故事',
    cover: '暂无封面',
    more: '更多选项',
  },
  ja: {
    heading: '特別キャンペーン',
    episodes: 'ロック中のエピソード {{count}} 話',
    buy: 'Buy All Unlocked Episodes',
    story: 'ストーリー',
    cover: '表紙なし',
    more: 'その他',
  },
  ko: {
    heading: '특별 프로모션',
    episodes: '잠긴 에피소드 {{count}}개',
    buy: 'Buy All Unlocked Episodes',
    story: '스토리',
    cover: '표지 없음',
    more: '더 보기',
  },
})

const motionStyles = `
  @keyframes dsp-gold-flow {
    to { transform: rotate(360deg); }
  }

  .dsp-gold-frame {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: 2.5px;
    background: #d1a447;
  }

  .dsp-gold-frame::before {
    content: '';
    position: absolute;
    inset: -90%;
    z-index: 0;
    background: conic-gradient(
      #ab771f 0deg,
      #d9ac4a 80deg,
      #fff2ad 118deg,
      #f3cf73 136deg,
      #a66e21 180deg,
      #dbb756 260deg,
      #fbe4a0 310deg,
      #ab771f 360deg
    );
    animation: dsp-gold-flow 14s linear infinite;
    pointer-events: none;
  }

  .dsp-gold-frame__inside {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 13px;
    overflow: hidden;
  }

  .dsp-avatar-ring {
    position: relative;
    isolation: isolate;
    padding: 2px;
    overflow: hidden;
    background: #c8a04b;
  }

  .dsp-avatar-ring::before {
    content: '';
    position: absolute;
    inset: -80%;
    z-index: 0;
    background: conic-gradient(#ac771e, #e9cf92, #fff6d6, #bd8731, #ac771e);
    animation: dsp-gold-flow 18s linear infinite;
    pointer-events: none;
  }

  .dsp-avatar-ring__inside {
    position: relative;
    z-index: 1;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2b2034;
  }

  @media (prefers-reduced-motion: reduce) {
    .dsp-gold-frame::before,
    .dsp-avatar-ring::before {
      animation: none;
    }
  }
`

function priceValue(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

function DiamondPrice({ amount, old = false }) {
  return (
    <span className={`inline-flex items-center gap-1 ${old ? 'text-[#99919f] line-through dark:text-white/45' : 'text-[#23182d] dark:text-white'}`}>
      <Gem aria-hidden="true" className={old ? 'h-3 w-3' : 'h-4 w-4 text-[#38aadb]'} />
      <span>{amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
    </span>
  )
}

export default function DiscoverSpecialPromotionCard({
  promotion,
  onBuy,
  onOpen,
  onMore,
  purchasing = false,
}) {
  const { t } = useDisplayTranslation()

  if (!promotion) return null

  const lockedCount = Number(promotion.locked_episode_count || 0)
  if (!Number.isFinite(lockedCount) || lockedCount < 5) return null

  const title = promotion.story_title || promotion.title || t('discoverSpecialPromotion.story')
  const description = promotion.description || promotion.story_description || ''
  const coverUrl = promotion.cover_url || promotion.image || ''
  const avatarUrl = promotion.profile_image_url || coverUrl
  const originalPrice = priceValue(
    promotion.original_price_diamonds ?? promotion.original_diamond_price
  )
  const discountedPrice = priceValue(
    promotion.discounted_price_diamonds ?? promotion.discount_diamond_price
  )
  const hasPrice = originalPrice !== null && discountedPrice !== null

  return (
    <article className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 dark:bg-[var(--shadow-bg-surface)] dark:ring-[var(--shadow-border)] sm:rounded-[22px]">
      <style>{motionStyles}</style>

      <div className="flex items-center gap-2.5 px-3.5 pb-2.5 pt-3.5">
        <div className="dsp-avatar-ring h-10 w-10 shrink-0 rounded-full">
          <div className="dsp-avatar-ring__inside flex items-center justify-center">
            {avatarUrl ? (
              <img className="h-full w-full object-cover" src={avatarUrl} alt="" loading="lazy" />
            ) : (
              <Gem aria-hidden="true" className="h-4 w-4 text-[#f7dc9a]" />
            )}
          </div>
        </div>

        <h2 className="min-w-0 flex-1 text-[13px] font-extrabold leading-snug text-[#25142f] dark:text-white sm:text-[14px]">
          {t('discoverSpecialPromotion.heading')}
        </h2>

        {typeof onMore === 'function' && (
          <button
            type="button"
            onClick={() => onMore(promotion)}
            aria-label={t('discoverSpecialPromotion.more')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex min-w-0 items-stretch gap-3 px-3.5 pb-3.5">
        <button
          type="button"
          onClick={() => onOpen?.(promotion)}
          disabled={typeof onOpen !== 'function'}
          aria-label={title}
          className="dsp-gold-frame aspect-[2/3] w-[35%] min-w-[108px] max-w-[145px] shrink-0 rounded-2xl border border-yellow-400/70 bg-[#f7f2fb] shadow-[0_0_10px_rgba(250,204,21,0.16)] dark:bg-[#2a2036] dark:shadow-[0_0_10px_rgba(250,204,21,0.22)]"
        >
          <span className="dsp-gold-frame__inside flex items-center justify-center bg-[#f7f2fb] dark:bg-[#2a2036]">
            {coverUrl ? (
              <img src={coverUrl} alt={title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2 text-center text-[11px] text-[#8c739f] dark:text-white/50">
                {t('discoverSpecialPromotion.cover')}
              </span>
            )}
          </span>
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
          <h3 className="line-clamp-2 w-full text-[13px] font-extrabold leading-snug text-[#25142f] dark:text-white sm:text-[15px]">
            {title}
          </h3>

          {description && (
            <p className="line-clamp-2 w-full text-[10.5px] leading-[1.65] text-[#77717f] dark:text-white/60 sm:text-xs">
              {description}
            </p>
          )}

          <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-gradient-to-b from-[#e5b85b] to-[#b98627] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-[0_1px_3px_rgba(145,96,24,0.18)] sm:text-xs">
            <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t('discoverSpecialPromotion.episodes', { count: lockedCount })}</span>
          </div>

          {hasPrice && (
            <div className="mt-auto flex w-full flex-wrap items-center gap-x-2 gap-y-1 pt-1.5">
              <span className="text-[11px] font-medium"><DiamondPrice amount={originalPrice} old /></span>
              <span className="text-[17px] font-black leading-none sm:text-[20px]">
                <DiamondPrice amount={discountedPrice} />
              </span>
              <span className="rounded-lg bg-[#e32233] px-1.5 py-1 text-[10px] font-extrabold leading-none text-white sm:text-[11px]">
                -50%
              </span>
            </div>
          )}

          <button
            type="button"
            disabled={!hasPrice || purchasing || typeof onBuy !== 'function'}
            onClick={() => onBuy(promotion)}
            className="mt-auto w-full rounded-full border-[1.5px] border-[#d6a343] bg-[#101010] px-2 py-2.5 text-center text-[10px] font-extrabold leading-snug text-white transition-colors hover:bg-[#252525] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[11px]"
          >
            {t('discoverSpecialPromotion.buy')}
          </button>
        </div>
      </div>
    </article>
  )
}
