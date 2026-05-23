import { useNavigate } from 'react-router-dom'

const HERO_IMAGE = '/assets/Author Benefits/Author Benefits 1.png'

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )
}

function SectionCard({ title, subtitle, children }) {
  return (
    <section className="bg-white px-4 py-4 shadow-sm ring-1 ring-black/5 md:rounded-[26px]">
      <div className="mb-3">
        <h2 className="text-[17px] font-black tracking-[-0.03em] text-[#111827]">{title}</h2>
        {subtitle ? <p className="mt-1 text-[12px] font-medium leading-5 text-[#8d94a1]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

function BenefitItem({ icon, label, text }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[18px] bg-[#fafafa] px-3 py-3 ring-1 ring-black/5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111827] text-[#f7c948]">
        <i className={`${icon} text-[13px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 text-[12.5px] font-black text-[#111827]">{label}</div>
        <div className="mt-0.5 line-clamp-1 text-[10.5px] font-semibold text-[#98a2b3]">{text}</div>
      </div>
    </div>
  )
}

function BenefitSummary() {
  return (
    <section className="bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 md:rounded-[26px]">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <BenefitItem icon="fa-solid fa-gem" label="Diamond Income" text="Earn from paid unlocks" />
        <BenefitItem icon="fa-solid fa-chart-line" label="Quest Share" text="Grow your share level" />
        <BenefitItem icon="fa-solid fa-calendar-check" label="Auto Payout" text="Monthly admin payout" />
        <BenefitItem icon="fa-solid fa-crown" label="100-Day Boost" text="One lifetime reward" />
      </div>
    </section>
  )
}

function StepCard({ number, title, text, icon }) {
  return (
    <div className="rounded-[20px] border border-[#f0eef6] bg-white p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111827] text-white">
          <i className={`${icon} text-[13px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#f7f4ee] px-2 py-0.5 text-[9.5px] font-black text-[#c89b1e]">
              {number}
            </span>
            <h3 className="text-[13.5px] font-black leading-5 text-[#111827]">{title}</h3>
          </div>
          <p className="mt-1 text-[12px] font-medium leading-5 text-[#667085]">{text}</p>
        </div>
      </div>
    </div>
  )
}

function RuleRow({ positive = true, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] bg-[#fafafa] px-3 py-2.5">
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          positive ? 'bg-[#ecfdf3] text-[#16803c]' : 'bg-[#fff1f2] text-[#e11d48]'
        }`}
      >
        <i className={`fa-solid ${positive ? 'fa-check' : 'fa-xmark'} text-[11px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-black text-[#111827]">{title}</div>
        {text ? <div className="mt-0.5 text-[11.5px] font-medium leading-5 text-[#8d94a1]">{text}</div> : null}
      </div>
    </div>
  )
}

function ProgramCard({ icon, title, text, badge }) {
  return (
    <div className="rounded-[20px] border border-[#f0eef6] bg-[#fafafa] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
          <i className={`${icon} text-[14px]`} />
        </div>

        {badge ? (
          <span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.05em] text-[#c05621]">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-3 text-[13.5px] font-black text-[#111827]">{title}</div>
      <p className="mt-1 text-[12px] font-medium leading-5 text-[#667085]">{text}</p>
    </div>
  )
}

function ActionCard({ title, text, button, icon, onClick }) {
  return (
    <div className="rounded-[22px] border border-[#f0eef6] bg-[#fafafa] p-3">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f4ee] text-[#c89b1e]">
          <i className={`${icon} text-[14px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-black text-[#111827]">{title}</div>
          <p className="mt-1 text-[12px] font-medium leading-5 text-[#667085]">{text}</p>

          <button
            type="button"
            onClick={onClick}
            className="mt-3 inline-flex h-10 items-center rounded-full bg-[#111827] px-4 text-[12px] font-black text-white active:scale-95"
          >
            {button}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuthorBenefitsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-8">
      <div className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f5ef]/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton icon="fa-solid fa-chevron-left" label="Back" onClick={() => navigate('/author/dashboard', { replace: true })} />

          <div className="text-center">
            <h1 className="text-[16px] font-black text-[#111827]">Author Benefits</h1>
            <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">Creator programs and rules</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-2.5 pt-0 md:px-4 md:pt-4">
        <section className="overflow-hidden bg-[#111827] shadow-sm md:rounded-[30px] md:ring-1 md:ring-black/5">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#111827]">
            <img
              src={HERO_IMAGE}
              alt="Author Benefits"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/95 via-[#111827]/58 to-[#111827]/12" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 max-w-[420px]">
              <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#f7c948]">Creator Benefits</div>
              <h2 className="mt-1.5 max-w-[340px] text-[23px] font-black leading-[1.06] tracking-[-0.06em] text-white sm:max-w-[430px] sm:text-[30px]">
                Earn from stories. Grow with every milestone.
              </h2>
              <p className="mt-2 max-w-[430px] text-[11.5px] font-semibold leading-5 text-white/70 sm:text-[13px]">
                Earn from Diamond unlocks, grow through Quest, and receive automatic monthly payouts.
              </p>
            </div>
          </div>
        </section>

        <BenefitSummary />

        <SectionCard
          title="How You Earn"
          subtitle="Simple earning flow for authors."
        >
          <div className="grid gap-2.5">
            <StepCard
              number="01"
              icon="fa-solid fa-lock-open"
              title="Readers unlock paid episodes"
              text="When a reader unlocks your locked episode with Diamonds, the system records paid support for your story."
            />
            <StepCard
              number="02"
              icon="fa-solid fa-ranking-star"
              title="Your Quest stage decides your share"
              text="Your author share starts at 10% and can grow through Quest milestones. Higher stages mean higher income share."
            />
            <StepCard
              number="03"
              icon="fa-solid fa-money-bill-transfer"
              title="Payout is automatic"
              text="You do not need to request withdrawal. Admin reviews and processes author payouts every month."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="What Counts as Paid Income"
          subtitle="Only paid Diamond unlocks count for author income in this stage."
        >
          <div className="grid gap-2">
            <RuleRow
              positive
              title="Diamond unlocks"
              text="Paid episode unlocks with Diamonds are counted as author income."
            />
            <RuleRow
              positive={false}
              title="Free first episode"
              text="Free first episode access helps readers discover your story, but it does not count as paid income."
            />
            <RuleRow
              positive={false}
              title="Gems, Vouchers, Story Cards, and Free Access"
              text="These methods are free or reward-based access for readers and do not count as paid income yet."
            />
            <RuleRow
              positive={false}
              title="Views, comments, and likes"
              text="These help your Quest progress and ranking, but they are not direct paid income yet."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Grow Your Share"
          subtitle="Your share can grow as your author account reaches stronger milestones."
        >
          <div className="rounded-[22px] bg-[#fafafa] p-3">
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {[
                ['10%', 'Stage 1'],
                ['20%', 'Stage 2'],
                ['30%', 'Stage 3'],
                ['40%', 'Stage 4'],
                ['50%', 'Stage 5'],
              ].map(([share, stage]) => (
                <div key={stage} className="rounded-[16px] bg-white px-1.5 py-2.5 shadow-sm ring-1 ring-black/5">
                  <div className="text-[14px] font-black text-[#111827]">{share}</div>
                  <div className="mt-1 text-[8.5px] font-bold text-[#98a2b3]">{stage}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-[18px] border border-[#f3d88b] bg-[#fffaf0] p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#111827] text-[#f7c948]">
                  <i className="fa-solid fa-crown text-[14px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-black text-[#111827]">100-Day Creator Boost</div>
                  <p className="mt-1 text-[12px] font-medium leading-5 text-[#7a5b12]">
                    Top milestone authors can unlock 100% revenue share for 100 days, one time only per author account.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/author/quest')}
              className="mt-3 flex h-11 w-full items-center justify-center rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-[0.99]"
            >
              View Quest
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="Automatic Monthly Payout"
          subtitle="No withdrawal request is needed."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            <ActionCard
              icon="fa-solid fa-calendar-check"
              title="Paid every month"
              text="Author payouts are reviewed and processed automatically around the 15th of each month."
              button="View My Income"
              onClick={() => navigate('/author/income')}
            />

            <ActionCard
              icon="fa-solid fa-qrcode"
              title="Keep payment info ready"
              text="Add or update your Bank QR, PayPal, or phone payout details to avoid payout delays."
              button="Update Payment Method"
              onClick={() => navigate('/author/payment-method')}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Special Programs"
          subtitle="More creator rewards can be added as the platform grows."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            <ProgramCard
              icon="fa-solid fa-gift"
              title="Writing Events"
              text="Future creator events can reward authors who join challenges, contests, or seasonal programs."
              badge="Later"
            />
            <ProgramCard
              icon="fa-solid fa-star"
              title="Bonus Rewards"
              text="High-performing authors may receive extra rewards based on platform programs."
              badge="Later"
            />
            <ProgramCard
              icon="fa-solid fa-book-open"
              title="Publishing Opportunities"
              text="Selected works may get special promotion or official publishing opportunities."
              badge="Later"
            />
            <ProgramCard
              icon="fa-solid fa-heart"
              title="Reader Support"
              text="Build a loyal audience through comments, follows, unlocks, and future fan support tools."
              badge="Growing"
            />
          </div>
        </SectionCard>
      </main>
    </div>
  )
}
