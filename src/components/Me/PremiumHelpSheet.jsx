const HELP_SECTIONS = [
  {
    title: '1. Membership Period',
    items: [
      'Your Premium membership begins immediately after payment is completed successfully.',
      'The membership duration depends on the plan you select.',
      'Your benefits remain active until the end of the current subscription period.',
      'Premium membership applies only to the account used to complete the purchase.',
      'Membership time cannot be transferred to another account.',
    ],
  },
  {
    title: '2. Premium Benefits',
    items: [
      'Premium benefits may include ad-free reading, early access, profile badges, Diamond rewards, Premium-only content, selected discounts, and special promotions.',
      'Some benefits may vary depending on the selected plan, region, promotion, or availability.',
      'Not every benefit applies to every story, episode, product, or event.',
    ],
  },
  {
    title: '3. Payment Confirmation',
    items: [
      'The amount shown on the selected plan will be charged after you confirm the purchase.',
      'Your membership activates only after payment is completed successfully.',
      'A payment record may appear in your Wallet or purchase history.',
      'Failed, cancelled, or incomplete payments will not activate Premium.',
      'Additional confirmation may be required depending on the payment method.',
    ],
  },
  {
    title: '4. Automatic Renewal',
    items: [
      'Your subscription may renew automatically at the end of each billing period.',
      'The renewal payment will use your available Wallet balance or selected payment method.',
      'You must have enough balance available before the renewal date.',
      'If the renewal payment fails, Premium benefits may expire at the end of the current period.',
      'Renewal settings can be managed from your subscription or account settings.',
    ],
  },
  {
    title: '5. How to Cancel',
    items: [
      'You can turn off automatic renewal at any time before the next billing date.',
      'Turning off automatic renewal does not immediately remove your Premium benefits.',
      'Your membership remains active until the current subscription period ends.',
      'After the current period expires, your account returns to the Free Reader plan.',
      'No additional renewal payment will be charged after automatic renewal is disabled successfully.',
    ],
  },
  {
    title: '6. Diamonds and Rewards',
    items: [
      'Premium Diamond rewards must be claimed according to the displayed reward rules.',
      'Unclaimed rewards may expire after the stated claim period.',
      'Bonus Diamonds cannot be exchanged for cash.',
      'Bonus Diamonds may have different usage rules from purchased Diamonds.',
      'Promotional Diamond amounts may change during special campaigns.',
      'Claimed rewards remain subject to Shadow Wallet and Diamond policies.',
    ],
  },
  {
    title: '7. Benefit Availability',
    items: [
      'Premium benefits may not apply to every story, episode, product, or event.',
      'Early-access periods may differ between stories.',
      'Discounts may apply only to eligible purchases.',
      'Premium-only content may become unavailable after your membership expires.',
      'New benefits may be added, adjusted, or removed when necessary.',
    ],
  },
  {
    title: '8. Important Notes',
    items: [
      'Premium starts immediately after successful payment unless otherwise stated.',
      'There is no free trial unless a trial is clearly shown before purchase.',
      'Premium membership cannot be transferred, shared, or resold.',
      'Users must follow Shadow Terms of Service while using Premium features.',
      'Misuse, fraud, or payment disputes may result in membership suspension.',
      'Refund eligibility is determined by the applicable refund policy and payment provider rules.',
      'Prices and plan details are always shown before purchase confirmation.',
    ],
  },
]

export default function PremiumHelpSheet({ open, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-help-title"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-18px_50px_rgba(17,24,39,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-[#eeeeee] bg-white px-5 pb-4 pt-3">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d6d6d6]" />

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="premium-help-title" className="text-[20px] font-bold text-[#202124]">
                About Premium
              </h2>
              <p className="mt-1 text-[12px] leading-5 text-[#8a8a8a]">
                Important information about membership, payments, renewal, benefits, and rewards.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Premium information"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4] text-[#555] active:scale-95"
            >
              <i className="fa-solid fa-xmark text-[15px]" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <div className="divide-y divide-[#eeeeee]">
            {HELP_SECTIONS.map((section) => (
              <section key={section.title} className="py-5">
                <h3 className="text-[15px] font-bold text-[#202124]">{section.title}</h3>

                <ul className="mt-3 space-y-2.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-[#6f6f6f]">
                      <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffb000]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffd500] to-[#ffad0a] text-[15px] font-bold text-[#282828] active:scale-[0.99]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
