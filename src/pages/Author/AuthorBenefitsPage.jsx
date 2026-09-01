import { useNavigate, useSearchParams } from 'react-router-dom'

const HERO_IMAGE = '/assets/Author Benefits/Author Benefits 1.png'
const MANGA_IMAGE = '/assets/Author Benefits/author-benefits-manga-girl.webp'

const BENEFITS = [
  {
    icon: 'fa-solid fa-gem',
    title: 'Diamond Income',
    text: 'Earn from paid unlocks',
    tone: 'purple',
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Quest Share',
    text: 'Grow your share level',
    tone: 'pink',
  },
  {
    icon: 'fa-solid fa-wallet',
    title: 'Auto Payout',
    text: 'Monthly admin payout',
    tone: 'gold',
  },
  {
    icon: 'fa-solid fa-crown',
    title: '100-Day Boost',
    text: 'One lifetime reward',
    tone: 'blue',
  },
]

const SHARE_STAGES = [
  ['10%', 'Stage 1'],
  ['20%', 'Stage 2'],
  ['30%', 'Stage 3'],
  ['40%', 'Stage 4'],
  ['50%', 'Stage 5'],
]

const PROGRAMS = [
  {
    icon: 'fa-solid fa-feather-pointed',
    title: 'Writing Events',
    text: 'Future creator events can reward authors who join challenges, contests, or seasonal programs.',
    badge: 'Later',
  },
  {
    icon: 'fa-solid fa-gift',
    title: 'Bonus Rewards',
    text: 'High-performing authors may receive extra rewards based on platform programs.',
    badge: 'Later',
  },
  {
    icon: 'fa-solid fa-book-open',
    title: 'Publishing Opportunities',
    text: 'Selected works may get special promotion or official publishing opportunities.',
    badge: 'Later',
  },
  {
    icon: 'fa-solid fa-heart',
    title: 'Reader Support',
    text: 'Build a loyal audience through comments, follows, unlocks, and future fan support tools.',
    badge: 'Growing',
  },
]

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadff4] bg-white text-[#6e4a95] shadow-[0_5px_16px_rgba(88,62,119,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding({ dark = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-[30px] border-r ${
        dark
          ? 'border-white/10 bg-white/[0.04]'
          : 'border-[#dfd0ef] bg-[linear-gradient(180deg,#eee5ff_0%,#fbf7ff_100%)]'
      }`}
    >
      {[28, 72, 116, 160, 204, 248, 292, 336].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span
            className={`block h-[12px] w-[12px] rounded-full border-2 ${
              dark
                ? 'border-[#d5b8ff] bg-[#34234d]'
                : 'border-[#9b72d5] bg-white'
            }`}
          />
          <span
            className={`absolute left-[7px] top-[4px] h-[3px] w-[12px] rounded-full ${
              dark ? 'bg-[#d9c2ff]' : 'bg-[#8c63c5]'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

function Tape({ className = '', blue = false }) {
  return (
    <div
      className={`pointer-events-none absolute h-6 w-[70px] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#b8d1ff]/75' : 'bg-[#f8bed8]/75'
      } ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.38)_0_5px,transparent_5px_10px)]" />
    </div>
  )
}

function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <i className="fa-solid fa-star text-[12px] text-[#efb83c]" />
      <i className="fa-solid fa-heart ml-3 text-[10px] text-[#ef8fb7]" />
      <i className="fa-solid fa-star ml-3 text-[8px] text-[#9d79d4]" />
    </div>
  )
}

function RibbonTitle({ children, tone = 'purple' }) {
  const tones = {
    purple: 'border-[#c7ace9] bg-[#ede3ff] text-[#644391]',
    pink: 'border-[#f0bfd3] bg-[#ffe5ef] text-[#c45683]',
    blue: 'border-[#bfd0ef] bg-[#e7efff] text-[#536db4]',
    gold: 'border-[#ecd38c] bg-[#fff3c9] text-[#a06b08]',
  }

  return (
    <div className="flex justify-center">
      <div
        className={`relative inline-flex min-h-9 items-center justify-center rounded-[12px] border px-5 py-2 text-center text-[14px] font-black tracking-[-0.02em] shadow-sm ${
          tones[tone] || tones.purple
        }`}
      >
        <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-current/20 bg-inherit" />
        <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-current/20 bg-inherit" />
        {children}
      </div>
    </div>
  )
}

function PaperSection({ title, subtitle, icon, children, tone = 'purple' }) {
  const styles = {
    purple: {
      border: 'border-[#ddd0ed]',
      icon: 'bg-[#eee5ff] text-[#7651b0]',
    },
    pink: {
      border: 'border-[#efcddd]',
      icon: 'bg-[#ffe5ef] text-[#d96896]',
    },
    blue: {
      border: 'border-[#cad9f3]',
      icon: 'bg-[#e8efff] text-[#5a75c3]',
    },
    gold: {
      border: 'border-[#ead8a4]',
      icon: 'bg-[#fff3d0] text-[#c69018]',
    },
  }

  const style = styles[tone] || styles.purple

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${style.border} bg-[linear-gradient(180deg,#fffdfb_0%,#fbf8ff_100%)] p-4 shadow-[0_12px_30px_rgba(86,61,118,0.07)]`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(115,89,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(115,89,145,0.035) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3 rotate-[7deg]" blue={tone === 'blue'} />

      <div className="mb-4 flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
          <i className={`${icon} text-[14px]`} />
        </span>

        <div className="min-w-0">
          <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#553c73]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[11.5px] font-semibold leading-5 text-[#8d7e98]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  )
}

function BenefitCard({ icon, title, text, tone }) {
  const tones = {
    purple: {
      outer: 'border-[#d8c7f0] bg-[#fbf8ff]',
      icon: 'bg-[#eee5ff] text-[#7b56b6]',
    },
    pink: {
      outer: 'border-[#f0cbdc] bg-[#fff8fb]',
      icon: 'bg-[#ffe2ed] text-[#df6797]',
    },
    gold: {
      outer: 'border-[#ead7a6] bg-[#fffaf0]',
      icon: 'bg-[#fff0c2] text-[#c48a12]',
    },
    blue: {
      outer: 'border-[#cbd8f2] bg-[#f8faff]',
      icon: 'bg-[#e8efff] text-[#5572bf]',
    },
  }

  const style = tones[tone] || tones.purple

  return (
    <div className={`relative rounded-[22px] border p-3.5 text-center shadow-[0_5px_16px_rgba(78,57,104,0.05)] ${style.outer}`}>
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-[18px] ${style.icon}`}>
        <i className={`${icon} text-[18px]`} />
      </div>
      <div className="mt-2.5 text-[12.5px] font-black text-[#49365e]">{title}</div>
      <p className="mt-1 text-[10px] font-semibold leading-4 text-[#8b7d94]">{text}</p>
    </div>
  )
}

function StoryStep({ number, title, text, icon, tone = 'purple' }) {
  const tones = {
    purple: 'bg-[#eee5ff] text-[#7652ae]',
    pink: 'bg-[#ffe5ef] text-[#d26491]',
    gold: 'bg-[#fff0c8] text-[#c88c15]',
  }

  return (
    <div className="relative rounded-[22px] border border-[#e7ddec] bg-white/85 p-3.5">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${tones[tone]}`}>
          <i className={`${icon} text-[15px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#f6f0fb] px-2 py-0.5 text-[8.5px] font-black text-[#81689b]">
              {number}
            </span>
            <h3 className="text-[12.5px] font-black leading-5 text-[#4d3a62]">{title}</h3>
          </div>
          <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[#7f7289]">{text}</p>
        </div>
      </div>
    </div>
  )
}

function IncomeRule({ positive = true, title, text, icon }) {
  return (
    <div
      className={`rounded-[20px] border p-3 ${
        positive
          ? 'border-[#cfe6d2] bg-[#f6fff8]'
          : 'border-[#f0ccd8] bg-[#fff7fa]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
            positive
              ? 'bg-[#e7f8ea] text-[#47a35f]'
              : 'bg-[#ffe6ee] text-[#de638c]'
          }`}
        >
          <i className={`${icon || (positive ? 'fa-solid fa-check' : 'fa-solid fa-xmark')} text-[12px]`} />
        </span>

        <div className="min-w-0">
          <div className={`text-[12px] font-black ${positive ? 'text-[#3e7f50]' : 'text-[#bd5277]'}`}>
            {positive ? 'YES · ' : 'NO · '}
            <span className="text-[#503d5f]">{title}</span>
          </div>
          <p className="mt-1 text-[10px] font-semibold leading-4 text-[#85778e]">{text}</p>
        </div>
      </div>
    </div>
  )
}

function ShareBadge({ share, stage, index }) {
  const colors = [
    'border-[#cab5ec] bg-[#f1e8ff] text-[#7046a6]',
    'border-[#efbed0] bg-[#ffe5ef] text-[#c64f7d]',
    'border-[#efd08b] bg-[#fff0c4] text-[#b6770a]',
    'border-[#c8d5f0] bg-[#eaf0ff] text-[#506db6]',
    'border-[#efb7c8] bg-[#ffe0e9] text-[#c84d75]',
  ]

  return (
    <div className={`rounded-[20px] border px-2 py-3 text-center ${colors[index]}`}>
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-white/60 text-[14px] font-black">
        {share}
      </div>
      <div className="mt-2 text-[8.5px] font-black">{stage}</div>
    </div>
  )
}

function PayoutStep({ icon, title, text, tone = 'purple' }) {
  const tones = {
    purple: 'bg-[#eee5ff] text-[#7350ac]',
    pink: 'bg-[#ffe5ef] text-[#d26390]',
    gold: 'bg-[#fff0c8] text-[#c58912]',
    blue: 'bg-[#e8efff] text-[#5773c0]',
  }

  return (
    <div className="rounded-[20px] border border-[#e6ddec] bg-white/85 p-3 text-center">
      <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}>
        <i className={`${icon} text-[14px]`} />
      </span>
      <div className="mt-2 text-[11px] font-black text-[#4f3b62]">{title}</div>
      <p className="mt-1 text-[9px] font-semibold leading-4 text-[#8a7c93]">{text}</p>
    </div>
  )
}

function ProgramCard({ icon, title, text, badge }) {
  const growing = badge === 'Growing'

  return (
    <div className="rounded-[22px] border border-[#e7ddec] bg-white/85 p-3.5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f0e8fb] text-[#7651ad]">
          <i className={`${icon} text-[14px]`} />
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.04em] ${
            growing
              ? 'bg-[#eaf8ed] text-[#4d985f]'
              : 'bg-[#fff0df] text-[#c26e2d]'
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-3 text-[12.5px] font-black text-[#4e3b61]">{title}</div>
      <p className="mt-1 text-[10px] font-semibold leading-5 text-[#82758c]">{text}</p>
    </div>
  )
}

export default function AuthorBenefitsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromPage = searchParams.get('from')

  return (
    <div
      className="min-h-screen pb-8"
      style={{
        backgroundColor: '#fbf8ff',
        backgroundImage:
          'radial-gradient(circle at 12% 7%, rgba(255,211,229,0.55), transparent 24%), radial-gradient(circle at 87% 8%, rgba(216,201,255,0.6), transparent 24%), linear-gradient(180deg,#fffdf9 0%,#f8f3ff 52%,#fff8fb 100%)',
      }}
    >
      <div className="sticky top-0 z-40 border-b border-[#eadff1] bg-[#fffdf9]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label="Back"
            onClick={() =>
              navigate(fromPage === 'quest' ? '/author/quest' : '/author/profile', {
                replace: true,
              })
            }
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-star text-[9px] text-[#eeb63d]" />
              <h1 className="text-[19px] font-black tracking-[-0.04em] text-[#583b7c]">
                Author Benefits
              </h1>
              <i className="fa-solid fa-heart text-[9px] text-[#ed8fb5]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-[#ab91c1]">
              Creator programs and rules
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff2c9] text-[#d69d1a]">
            <i className="fa-solid fa-book-open text-[12px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        <section
          className="relative overflow-hidden rounded-[30px] border border-[#cdb9ed] bg-[linear-gradient(135deg,#fffaf4_0%,#fff4fa_42%,#eee7ff_100%)] shadow-[0_16px_36px_rgba(94,58,142,0.13)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(113,84,148,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(113,84,148,0.04) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <SpiralBinding />
          <Sparkles className="absolute right-5 top-4" />
          <Tape className="right-4 top-[74px] rotate-[8deg]" />

          <div className="relative min-h-[300px] pl-[46px] pr-4 pt-5">
            <div className="absolute right-[-14px] top-[52px] h-[218px] w-[218px] sm:right-3 sm:top-[30px] sm:h-[255px] sm:w-[255px]">
              <img
                src={MANGA_IMAGE}
                alt="Author Benefits"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = HERO_IMAGE
                }}
                className="h-full w-full object-contain object-bottom drop-shadow-[0_14px_26px_rgba(76,49,110,0.18)]"
              />
            </div>

            <div className="relative z-10 max-w-[62%] sm:max-w-[56%]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f6b0cc] px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white">
                <i className="fa-solid fa-heart text-[7px]" />
                Creator Programs and Rules
              </div>

              <h2 className="mt-3 bg-[linear-gradient(180deg,#7b54a8_0%,#d45f91_100%)] bg-clip-text text-[34px] font-black leading-[0.95] tracking-[-0.05em] text-transparent sm:text-[44px]">
                Author
                <br />
                Benefits
              </h2>

              <p className="mt-3 text-[12px] font-black leading-5 text-[#59416d]">
                Write your stories.
                <br />
                Delight your readers.
                <br />
                <span className="text-[#d35c89]">Earn more with every milestone!</span>
              </p>

              <p className="mt-2 max-w-[255px] text-[10.5px] font-semibold leading-5 text-[#806f8b]">
                Earn from Diamond unlocks, grow through Quest, and receive automatic monthly payouts.
              </p>

              <button
                type="button"
                onClick={() => navigate('/author/quest')}
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8b63c8_0%,#b16ddd_100%)] px-6 text-[12px] font-black text-white shadow-[0_8px_18px_rgba(117,78,171,0.24)] transition active:scale-95"
              >
                View Quest
                <i className="fa-solid fa-star text-[9px] text-[#ffdf79]" />
              </button>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-[28px] border border-[#ddd0ed] bg-[linear-gradient(180deg,#fffdfb_0%,#fbf8ff_100%)] p-3.5 shadow-[0_10px_28px_rgba(86,61,118,0.07)]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(115,89,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(115,89,145,0.035) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {BENEFITS.map((item) => (
              <BenefitCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <PaperSection
          title="How You Earn"
          subtitle="Simple earning flow for authors."
          icon="fa-solid fa-wand-magic-sparkles"
          tone="purple"
        >
          <RibbonTitle tone="purple">How You Earn</RibbonTitle>

          <div className="mt-4 grid gap-2.5">
            <StoryStep
              number="Chapter 1"
              title="Readers unlock paid episodes"
              text="When a reader unlocks your locked episode with Diamonds, the system records paid support for your story."
              icon="fa-solid fa-book-open"
              tone="purple"
            />
            <StoryStep
              number="Chapter 2"
              title="Your Quest stage decides your share"
              text="Your author share starts at 10% and can grow through Quest milestones. Higher stages mean higher income share."
              icon="fa-solid fa-ranking-star"
              tone="pink"
            />
            <StoryStep
              number="Chapter 3"
              title="Payout is automatic"
              text="You do not need to request withdrawal. Admin reviews and processes author payouts every month."
              icon="fa-solid fa-piggy-bank"
              tone="gold"
            />
          </div>
        </PaperSection>

        <PaperSection
          title="What Counts as Paid Income"
          subtitle="Only paid Diamond unlocks count for author income in this stage."
          icon="fa-solid fa-gem"
          tone="pink"
        >
          <RibbonTitle tone="pink">What Counts as Paid Income?</RibbonTitle>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <IncomeRule
              positive
              icon="fa-solid fa-gem"
              title="Diamond unlocks"
              text="Paid episode unlocks with Diamonds are counted as author income."
            />
            <IncomeRule
              positive={false}
              icon="fa-solid fa-gift"
              title="Free first 5 episodes"
              text="Episodes 1–5 help readers discover your story, but they do not count as paid income."
            />
            <IncomeRule
              positive={false}
              icon="fa-solid fa-ticket"
              title="Gems, Vouchers, Story Cards, and Free Access"
              text="These methods are free or reward-based access for readers and do not count as paid income yet."
            />
            <IncomeRule
              positive={false}
              icon="fa-solid fa-comments"
              title="Views, comments, and likes"
              text="These help your Quest progress and ranking, but they are not direct paid income yet."
            />
          </div>
        </PaperSection>

        <PaperSection
          title="Grow Your Share"
          subtitle="Your share can grow as your author account reaches stronger milestones."
          icon="fa-solid fa-ranking-star"
          tone="blue"
        >
          <RibbonTitle tone="blue">Grow Your Share</RibbonTitle>

          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {SHARE_STAGES.map(([share, stage], index) => (
              <ShareBadge key={stage} share={share} stage={stage} index={index} />
            ))}
          </div>

          <div className="relative mt-3 overflow-hidden rounded-[22px] border border-[#e8cde0] bg-[linear-gradient(90deg,#fff0f6_0%,#f8efff_100%)] p-4">
            <div className="absolute -right-6 -top-7 h-24 w-24 rounded-full bg-[#d8c2ff]/30 blur-xl" />

            <div className="relative flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-[#ffe9aa] text-[#c5890a] shadow-sm">
                <i className="fa-solid fa-crown text-[16px]" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-black text-[#5a3f75]">100-Day Creator Boost</div>
                <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[#826f8f]">
                  Top milestone authors can unlock 100% revenue share for 100 days, one time only per author account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/author/quest')}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#7650ad] text-[11px] font-black text-white transition active:scale-[0.99]"
            >
              View Quest
              <i className="fa-solid fa-star text-[8px] text-[#ffdf74]" />
            </button>
          </div>
        </PaperSection>

        <PaperSection
          title="Automatic Monthly Payout"
          subtitle="No withdrawal request is needed."
          icon="fa-solid fa-calendar-check"
          tone="gold"
        >
          <RibbonTitle tone="gold">Automatic Monthly Payout</RibbonTitle>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <PayoutStep
              icon="fa-solid fa-calendar-days"
              title="Month Ends"
              text="We calculate your total earnings."
              tone="pink"
            />
            <PayoutStep
              icon="fa-solid fa-clipboard-check"
              title="Auto Processing"
              text="Earnings are reviewed and processed."
              tone="purple"
            />
            <PayoutStep
              icon="fa-solid fa-wallet"
              title="Payout to You"
              text="Funds are sent to your registered account."
              tone="blue"
            />
            <PayoutStep
              icon="fa-solid fa-envelope"
              title="You Get Notified"
              text="Check your email for payout details."
              tone="gold"
            />
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate('/author/income')}
              className="rounded-[22px] border border-[#dfd1eb] bg-white/85 p-3.5 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eee5ff] text-[#7650ad]">
                  <i className="fa-solid fa-chart-pie text-[14px]" />
                </span>
                <div>
                  <div className="text-[12px] font-black text-[#513d64]">View My Income</div>
                  <div className="mt-0.5 text-[9.5px] font-semibold text-[#8d8096]">
                    Review your earnings and payout history.
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/author/payment-method')}
              className="rounded-[22px] border border-[#efd3de] bg-[#fff9fb] p-3.5 text-left transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffe6ef] text-[#d36491]">
                  <i className="fa-solid fa-qrcode text-[14px]" />
                </span>
                <div>
                  <div className="text-[12px] font-black text-[#513d64]">Keep payment info ready</div>
                  <div className="mt-0.5 text-[9.5px] font-semibold text-[#8d8096]">
                    Update Bank QR, PayPal, or phone payout details.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </PaperSection>

        <PaperSection
          title="Special Programs"
          subtitle="More creator rewards can be added as the platform grows."
          icon="fa-solid fa-gift"
          tone="purple"
        >
          <RibbonTitle tone="purple">Special Programs</RibbonTitle>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {PROGRAMS.map((program) => (
              <ProgramCard key={program.title} {...program} />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-[22px] border border-[#e8d9ef] bg-[#fffafc] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe7ef] text-[#d56591]">
                <i className="fa-solid fa-heart text-[13px]" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-black text-[#5a416e]">
                  We are here to support your journey.
                </div>
                <div className="mt-0.5 text-[9.5px] font-semibold text-[#8d8097]">
                  Keep creating, keep growing, keep shining.
                </div>
              </div>
            </div>

            <i className="fa-solid fa-star shrink-0 text-[15px] text-[#efb63e]" />
          </div>
        </PaperSection>
      </main>
    </div>
  )
}
