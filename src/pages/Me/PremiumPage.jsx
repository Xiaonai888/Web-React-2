import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const PLANS = [
  { id: '1', label: '1 Month', price: '$5', coins: '180 Coins' },
  { id: '3', label: '3 Months', price: '$18', coins: '540 Coins', badge: 'POPULAR' },
  { id: '12', label: '12 Months', price: '$70', coins: '2,200 Coins' },
]

function getStoredReader() {
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

function CoinMark({ className = '' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd62e] to-[#ff9f0a] font-black text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.65)] ${className}`}
    >
      C
    </span>
  )
}

export default function PremiumPage() {
  const reader = useMemo(getStoredReader, [])
  const [selectedPlan, setSelectedPlan] = useState('3')
  const [detailsOpen, setDetailsOpen] = useState(false)

  const displayName =
    reader?.name ||
    reader?.display_name ||
    reader?.username ||
    reader?.email?.split('@')[0] ||
    'Shadow Reader'

  const avatar =
    reader?.avatar_url ||
    reader?.profile_image ||
    reader?.photo_url ||
    ''

  return (
    <main className="min-h-screen bg-[#ededed] text-[#202124]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#ededed] shadow-[0_0_30px_rgba(17,24,39,0.08)]">
        <header className="sticky top-0 z-50 bg-white">
          <div className="grid h-16 grid-cols-[44px_1fr_44px] items-center px-4">
            <Link
              to="/me"
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#202124] active:bg-black/5"
            >
              <i className="fa-solid fa-arrow-left text-[20px]" />
            </Link>

            <h1 className="text-center text-[22px] font-medium tracking-[0.01em]">
              Get Premium
            </h1>

            <button
              type="button"
              aria-label="Premium help"
              onClick={() => setDetailsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#202124] active:bg-black/5"
            >
              <i className="fa-regular fa-circle-question text-[19px]" />
            </button>
          </div>
        </header>

        <section className="bg-white px-6 pb-5 pt-2">
          <div className="flex items-center gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ef5b16] to-[#bd2f00] text-[26px] font-medium text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-[19px] font-semibold">{displayName}</div>
              <div className="mt-1 text-[13px] text-[#70757a]">
                Go Premium to enjoy 6 privileges.
              </div>
            </div>
          </div>
        </section>

        <div className="relative h-[82px] overflow-hidden bg-white text-white">
          <div
            className="absolute left-1/2 top-0 h-full w-[124%] -translate-x-1/2 overflow-hidden bg-gradient-to-r from-[#454851] via-[#24262c] to-[#101115]"
            style={{
              borderBottomLeftRadius: '50% 26px',
              borderBottomRightRadius: '50% 26px',
            }}
          >
            <div className="absolute inset-0 opacity-20 [background:linear-gradient(135deg,transparent_0%,transparent_28%,white_28.5%,transparent_29%,transparent_58%,white_58.5%,transparent_59%)]" />

            <div className="relative mx-auto flex h-full w-[80.5%] items-start justify-between px-5 pt-5">
              <div className="flex items-center gap-2">
                <span className="text-[25px] font-black italic tracking-wide">Premium</span>
                <i className="fa-solid fa-crown text-[12px] text-[#ffd100]" />
              </div>

              <span className="pt-1 text-[14px] font-black tracking-tight text-white/15">
                SHADOW
              </span>
            </div>
          </div>
        </div>

        <section className="rounded-b-[26px] bg-white px-5 pb-6 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[21px] font-bold">Privileges</h2>
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="flex items-center gap-1 text-[14px] text-[#a5a5a5]"
            >
              More
              <i className="fa-solid fa-chevron-right text-[10px]" />
            </button>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-4">
            <div className="min-h-[92px] rounded-[12px] bg-gradient-to-r from-[#f4f9ff] to-[#f9fbff] px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[17px] font-bold">180 Coins</div>
                  <div className="mt-1 text-[13px] text-[#9aa0a6]">+90 Coins</div>
                </div>
                <CoinMark className="h-11 w-11 text-[18px]" />
              </div>

              <span className="absolute left-[39%] top-[-7px] rounded-b-[8px] rounded-t-[4px] bg-[#ff9212] px-2 py-1 text-[10px] font-bold text-white">
                50% More
              </span>
            </div>

            <div className="min-h-[92px] rounded-[12px] bg-gradient-to-r from-[#f4f9ff] to-[#f9fbff] px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[17px] font-bold">Check-in Reward</div>
                  <div className="mt-1 text-[13px] text-[#9aa0a6]">Get 5 Coins/Week</div>
                </div>
                <CoinMark className="h-11 w-11 text-[18px]" />
              </div>
            </div>

            <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[22px] font-bold text-[#c5c8cc]">
              +
            </span>
          </div>

          <div className="mt-5 divide-y divide-[#ececec]">
            <div className="flex min-h-[58px] items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff8e2] text-[#f5a400]">
                <i className="fa-solid fa-clock text-[16px]" />
              </span>
              <span className="text-[16px]">Early access to 300+ stories</span>
            </div>

            <div className="flex min-h-[58px] items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[#f5a400]">
                <i className="fa-solid fa-lock-open text-[15px]" />
              </span>
              <span className="text-[16px]">Free access to 500+ episodes</span>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-t-[26px] bg-white px-5 pb-7 pt-7">
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map((plan) => {
              const selected = selectedPlan === plan.id

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative min-h-[192px] rounded-[12px] px-2 py-6 text-center transition active:scale-[0.98] ${
                    selected
                      ? 'bg-white ring-2 ring-[#202124]'
                      : 'bg-[#f7f7f7] ring-1 ring-transparent'
                  }`}
                >
                  {plan.badge ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-t-[7px] bg-[#202124] px-2.5 py-1 text-[9px] font-black text-[#ffd100]">
                      {plan.badge}
                    </span>
                  ) : null}

                  <div className="text-[18px] font-medium">{plan.label}</div>
                  <div className="mt-5 text-[27px] font-semibold">{plan.price}</div>

                  <div className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[#777]">
                    <CoinMark className="h-5 w-5 text-[9px]" />
                    <span>{plan.coins}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffad0a] text-[20px] font-semibold text-[#282828] shadow-[0_7px_18px_rgba(255,180,0,0.18)] active:scale-[0.99]"
          >
            Subscribe
          </button>

          <p className="mt-4 text-center text-[12px] leading-5 text-[#a0a0a0]">
            Extra Coins for new Premium members (limited time)
            <br />
            Auto-renewal, cancelled anytime
          </p>

          <div className="mt-5 border-t border-[#e5e5e5] pt-5">
            <button
              type="button"
              onClick={() => setDetailsOpen((value) => !value)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[14px] font-semibold text-[#9a9a9a]">
                Details about Premium
              </span>

              <i
                className={`fa-solid fa-chevron-down text-[11px] text-[#a8a8a8] transition ${
                  detailsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {detailsOpen ? (
              <div className="mt-4 space-y-4 text-[12px] leading-5 text-[#8f8f8f]">
                <div>
                  <div className="font-semibold text-[#777]">1. Premium Gift Pack</div>
                  <p className="mt-1">
                    After subscribing, Premium rewards can be claimed from the Premium Center.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-[#777]">2. Subscription</div>
                  <p className="mt-1">
                    The selected plan renews automatically unless cancelled before the next billing date.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-[#777]">3. Benefits</div>
                  <p className="mt-1">
                    Premium privileges remain active until the subscription period ends.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
