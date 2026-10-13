import { Clock3, LockKeyhole, MoreHorizontal } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('discoverSpecialPromotion', {
  en: {
    heading: 'Special Promotion',
    episodes: '{{count}} Locked Episodes',
    buy: 'Buy All Unlocked Episodes',
    readNow: 'Read Now',
    story: 'Story',
    cover: 'No Cover',
    more: 'More options',
    endsIn: 'Offer ends in',
    expired: 'Offer ended',
  },
  km: {
    heading: 'ការផ្ដល់ជូនពិសេស',
    episodes: '{{count}} ភាគចាក់សោ',
    buy: 'Buy All Unlocked Episodes',
    readNow: 'Read Now',
    story: 'រឿង',
    cover: 'គ្មានក្រប',
    more: 'ជម្រើសបន្ថែម',
    endsIn: 'ការផ្ដល់ជូនបញ្ចប់ក្នុង',
    expired: 'ការផ្ដល់ជូនបានបញ្ចប់',
  },
  zh: {
    heading: '特别优惠',
    episodes: '{{count}} 章已锁定',
    buy: 'Buy All Unlocked Episodes',
    readNow: 'Read Now',
    story: '故事',
    cover: '暂无封面',
    more: '更多选项',
    endsIn: '优惠倒计时',
    expired: '优惠已结束',
  },
  ja: {
    heading: '特別キャンペーン',
    episodes: 'ロック中のエピソード {{count}} 話',
    buy: 'Buy All Unlocked Episodes',
    readNow: 'Read Now',
    story: 'ストーリー',
    cover: '表紙なし',
    more: 'その他',
    endsIn: '終了まで',
    expired: 'キャンペーン終了',
  },
  ko: {
    heading: '특별 프로모션',
    episodes: '잠긴 에피소드 {{count}}개',
    buy: 'Buy All Unlocked Episodes',
    readNow: 'Read Now',
    story: '스토리',
    cover: '표지 없음',
    more: '더 보기',
    endsIn: '종료까지',
    expired: '프로모션 종료',
  },
})

const DIAMOND_ICON_URL = '/assets/Icons/Diamond.svg'

const motionStyles = `
  @keyframes dsp-gold-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes dsp-gold-pulse {
    0%, 100% { opacity: .52; }
    50% { opacity: 1; }
  }

  .dsp-gold-frame {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-radius: 18px;
    padding: 3px;
    background: linear-gradient(135deg, #b37b1d 0%, #f8e39c 40%, #d39f39 70%, #9d6716 100%);
    box-shadow: 0 0 0 1px rgba(196, 146, 33, 0.36), 0 5px 14px rgba(171, 119, 31, 0.13);
  }

  .dsp-gold-frame::before {
    content: '';
    position: absolute;
    inset: -80%;
    z-index: 0;
    border-radius: inherit;
    background: conic-gradient(
      from 0deg,
      rgba(166, 110, 33, 0.98) 0deg,
      rgba(255, 241, 179, 1) 48deg,
      rgba(255, 252, 227, 1) 74deg,
      rgba(224, 176, 66, 0.98) 104deg,
      rgba(157, 103, 22, 0.98) 170deg,
      rgba(247, 218, 126, 1) 236deg,
      rgba(255, 246, 209, 1) 286deg,
      rgba(166, 110, 33, 0.98) 360deg
    );
    animation: dsp-gold-rotate 6.8s linear infinite;
    pointer-events: none;
  }

  .dsp-gold-frame:focus-visible,
  .dsp-buy-button:focus-visible {
    outline: 2px solid #b7882d;
    outline-offset: 3px;
  }

  .dsp-gold-frame::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
    background: radial-gradient(circle at 15% 15%, rgba(255, 246, 210, 0.92), transparent 34%), radial-gradient(circle at 86% 18%, rgba(255, 235, 167, 0.72), transparent 25%), radial-gradient(circle at 30% 88%, rgba(255, 228, 142, 0.5), transparent 24%);
    animation: dsp-gold-pulse 2.8s ease-in-out infinite;
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .dsp-gold-frame__inside {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    overflow: hidden;
  }

  .dsp-avatar-ring {
    position: relative;
    isolation: isolate;
    padding: 2px;
    overflow: hidden;
    border-radius: 9999px;
    background: linear-gradient(135deg, #a56b15 0%, #f7dfa0 50%, #bf8630 100%);
    box-shadow: 0 0 0 1px rgba(202, 157, 64, 0.24);
  }

  .dsp-avatar-ring::before {
    content: '';
    position: absolute;
    inset: -80%;
    z-index: 0;
    border-radius: inherit;
    background: conic-gradient(from 0deg, rgba(171, 119, 30, 0.98) 0deg, rgba(255, 248, 214, 1) 70deg, rgba(226, 185, 90, 1) 140deg, rgba(157, 103, 22, 0.98) 220deg, rgba(255, 248, 214, 1) 300deg, rgba(171, 119, 30, 0.98) 360deg);
    animation: dsp-gold-rotate 9s linear infinite;
    pointer-events: none;
  }

  .dsp-avatar-ring__inside {
    position: relative;
    z-index: 1;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #ffffff;
  }

  .dsp-buy-shell {
    position: relative;
    isolation: isolate;
    display: block;
    width: 100%;
    border-radius: 9999px;
    padding: 2px;
    overflow: hidden;
    background: linear-gradient(135deg, #a56b15 0%, #fff2b9 46%, #cf9a34 74%, #8f5c12 100%);
    box-shadow: 0 10px 18px rgba(171, 119, 31, 0.12);
  }

  .dsp-buy-shell::before {
    content: '';
    position: absolute;
    inset: -110%;
    z-index: 0;
    border-radius: inherit;
    background: conic-gradient(from 0deg, rgba(166, 110, 33, 1) 0deg, rgba(255, 242, 185, 1) 52deg, rgba(255, 252, 232, 1) 84deg, rgba(214, 163, 67, 1) 122deg, rgba(143, 92, 18, 1) 180deg, rgba(255, 242, 185, 1) 256deg, rgba(255, 252, 232, 1) 312deg, rgba(166, 110, 33, 1) 360deg);
    animation: dsp-gold-rotate 6.8s linear infinite;
    pointer-events: none;
  }

  .dsp-buy-shell::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
    background: radial-gradient(circle at 18% 50%, rgba(255, 244, 196, 0.5), transparent 24%), radial-gradient(circle at 84% 50%, rgba(255, 230, 151, 0.35), transparent 22%);
    animation: dsp-gold-pulse 2.2s ease-in-out infinite;
    pointer-events: none;
  }

  .dsp-buy-button {
    position: relative;
    z-index: 2;
    width: 100%;
    border: 0;
    outline: none;
    border-radius: 9999px;
    background: #101010;
    color: #ffffff;
  }

  .dsp-buy-button:disabled {
    opacity: .72;
    cursor: not-allowed;
  }

  .dsp-diamond-icon {
    display: inline-block;
    object-fit: contain;
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .dsp-gold-frame::before,
    .dsp-gold-frame::after,
    .dsp-avatar-ring::before,
    .dsp-buy-shell::before,
    .dsp-buy-shell::after {
      animation: none;
    }
  }
`

function formatCountdown(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = String(Math.floor(total / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const remainingSeconds = String(total % 60).padStart(2, '0')
  return `${hours}:${minutes}:${remainingSeconds}`
}

function priceValue(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

function DiamondPrice({ amount, old = false }) {
  if (amount === null || amount === undefined) return null

  return (
    <span className={`inline-flex items-center gap-1 ${old ? 'text-[#99919f] line-through dark:text-white/45' : 'text-[#23182d] dark:text-white'}`}>
      <img
        src={DIAMOND_ICON_URL}
        alt=""
        aria-hidden="true"
        className={`dsp-diamond-icon ${old ? 'h-3.5 w-3.5 opacity-70' : 'h-4 w-4'}`}
      />
      <span>{amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
    </span>
  )
}

export default function DiscoverSpecialPromotionCard({
  promotion,
  onBuy,
  onOpen,
  onRead,
  onMore,
  isPurchased = false,
  purchasing = false,
  remainingSeconds = null,
  slideCount = 0,
  activeSlide = 0,
  onSelectSlide,
}) {
  const { t } = useDisplayTranslation()

  if (!promotion) return null

  const lockedCount = Number(promotion.locked_episode_count || 0)
  if (!Number.isFinite(lockedCount) || lockedCount < 5) return null

  const title = promotion.story_title || promotion.title || t('discoverSpecialPromotion.story')
  const description = promotion.description || promotion.story_description || ''
  const coverUrl = promotion.cover_url || promotion.image || ''
  const avatarUrl = coverUrl || promotion.profile_image_url || ''
  const originalPrice = priceValue(
    promotion.original_price_diamonds ?? promotion.original_diamond_price
  )
  const discountedPrice = priceValue(
    promotion.discounted_price_diamonds ?? promotion.discount_diamond_price
  )
  const hasPrice = discountedPrice !== null && discountedPrice > 0
  const hasCountdown = Number.isFinite(Number(remainingSeconds)) && remainingSeconds !== null
  const offerExpired = hasCountdown && remainingSeconds <= 0

  return (
    <>
      <style>{motionStyles}</style>

      <article className="overflow-hidden border border-[#e5d9ee] bg-white dark:border-white/10 dark:bg-[var(--shadow-bg-surface)] sm:rounded-2xl">
        <div className="flex items-center gap-2 px-3 pb-6 pt-3 sm:px-4">
          <button
            type="button"
            onClick={() => onOpen?.(promotion)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            aria-label={t('discoverSpecialPromotion.heading')}
          >
            <div className="dsp-avatar-ring h-10 w-10 shrink-0">
              <div className="dsp-avatar-ring__inside">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[#8f6f2b] dark:text-[#efd78b]">
                    SP
                  </div>
                )}
              </div>
            </div>
            <h2 className="min-w-0 flex-1 truncate text-[13px] font-extrabold text-[#25142f] dark:text-white">
              {t('discoverSpecialPromotion.heading')}
            </h2>
          </button>

          {typeof onMore === 'function' ? (
            <button
              type="button"
              onClick={() => onMore(promotion)}
              aria-label={t('discoverSpecialPromotion.more')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8a8190] transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="px-2 pb-1.5 sm:px-3 sm:pb-2">
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={() => onOpen?.(promotion)}
              className="dsp-gold-frame h-[162px] w-[114px] shrink-0 text-left transition-transform active:scale-[0.99] min-[390px]:h-[170px] min-[390px]:w-[120px]"
            >
              <div className="dsp-gold-frame__inside bg-[#fff7e5] dark:bg-[#201522]">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-3 text-center text-[12px] font-medium text-[#846628] dark:text-[#efd78b]">
                    {t('discoverSpecialPromotion.cover')}
                  </div>
                )}
              </div>
            </button>

            <div className="flex h-[162px] min-w-0 flex-1 flex-col pt-0.5 min-[390px]:h-[170px]">
              <button
                type="button"
                onClick={() => onOpen?.(promotion)}
                className="block min-w-0 text-left"
              >
                <h3 className="line-clamp-2 text-[14px] font-extrabold leading-[1.3] text-[#25142f] dark:text-white">
                  {title}
                </h3>
              </button>

              {description ? (
                <p className="mt-1 line-clamp-2 text-[10px] leading-[1.35] text-[#7f7587] dark:text-white/60">
                  {description}
                </p>
              ) : null}

              <div className="mt-1.5 inline-flex max-w-full self-start items-center gap-1 rounded-full border border-[#c89430] bg-[#d8a536] px-2 py-0.5 text-[10px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,248,214,0.28)]">
                <LockKeyhole className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{t('discoverSpecialPromotion.episodes', { count: lockedCount })}</span>
              </div>

              {hasCountdown ? (
                <div className="mt-1 flex min-w-0 items-center gap-1 text-[10px] font-medium text-[#766978] dark:text-white/70" role="timer" aria-live="off">
                  <Clock3 className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 truncate">{t(offerExpired ? 'discoverSpecialPromotion.expired' : 'discoverSpecialPromotion.endsIn')}</span>
                  {!offerExpired ? (
                    <span className="shrink-0 font-bold tabular-nums text-[#322437] dark:text-white">
                      {formatCountdown(remainingSeconds)}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                {originalPrice !== null ? (
                  <DiamondPrice amount={originalPrice} old />
                ) : null}

                {discountedPrice !== null ? (
                  <DiamondPrice amount={discountedPrice} />
                ) : null}

                <span className="rounded-md bg-[#d71920] px-1.5 py-[2px] text-[10px] font-extrabold text-white">
                  -50%
                </span>
              </div>

              <div className="mt-auto pt-1.5">
                <div className="dsp-buy-shell">
                  <button
                    type="button"
                    disabled={isPurchased ? typeof onRead !== 'function' && typeof onOpen !== 'function' : !hasPrice || offerExpired || purchasing || typeof onBuy !== 'function'}
                    onClick={() => {
                      if (isPurchased) {
                        if (typeof onRead === 'function') onRead(promotion)
                        else onOpen?.(promotion)
                      } else {
                        onBuy?.(promotion)
                      }
                    }}
                    className="dsp-buy-button px-1.5 py-1.5 text-[9px] font-extrabold tracking-[-0.01em] min-[390px]:text-[10px]"
                  >
                    {t(isPurchased ? 'discoverSpecialPromotion.readNow' : 'discoverSpecialPromotion.buy')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {slideCount > 1 ? (
          <div className="flex items-center justify-center gap-1.5 pb-3 pt-4" role="group" aria-label={t('discoverSpecialPromotion.heading')}>
            {Array.from({ length: slideCount }, (_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => onSelectSlide?.(index)}
                aria-label={`${t('discoverSpecialPromotion.heading')} ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7882d] ${index === activeSlide ? 'w-5 bg-[#c99b3e]' : 'w-1.5 bg-gray-300 dark:bg-white/30'}`}
              />
            ))}
          </div>
        ) : null}
      </article>
    </>
  )
}
