
import React from 'react'

export default function PlanSection() {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-6 shadow-sm">
        <p className="text-[15px] font-semibold text-[var(--shadow-text-primary)]">Plans</p>
        <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
          Free, VIP, and Premium plan content will go here.
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-soft)] p-8 text-center">
        <p className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">Plan Section Placeholder</p>
        <p className="mt-2 text-[13px] text-[var(--shadow-text-secondary)]">
          Ready for Free / VIP / Premium UI
        </p>
      </div>
    </section>
  )
}
