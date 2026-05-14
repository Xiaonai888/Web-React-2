import { useNavigate } from 'react-router-dom'

function SectionBlock({ icon, title, children }) {
  return (
    <section className="mt-7">
      <h2 className="flex items-center gap-2 text-[20px] font-extrabold text-[#111827]">
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      <div className="mt-4 text-[16px] leading-7 text-[#111827]">
        {children}
      </div>
    </section>
  )
}

function BulletList({ items }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default function ShadowAuthorAgreementPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#eeeeee] pb-12">
      <header className="sticky top-0 z-50 bg-[#ff2b2b] px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="text-center text-[20px] font-semibold text-white">
            ✍️ Shadow Author Agreement
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-8">
        <article className="rounded-[26px] bg-white px-6 py-7 shadow-sm md:px-9 md:py-9">
          <p className="text-[17px] leading-7 text-[#111827]">
            By publishing your work on Shadow, you agree to the following terms:
          </p>

          <SectionBlock icon="✅" title="Author Responsibilities">
            <BulletList
              items={[
                'All authors must agree to this policy before publishing.',
                'Only original content is allowed. Any story found copied or plagiarized will be removed immediately.',
                'Repeated violations or continued plagiarism will result in permanent account suspension.',
                'Authors are responsible for the content they upload. You may edit or delete your work at any time, but Shadow is not responsible for lost or deleted stories.',
              ]}
            />
          </SectionBlock>

          <SectionBlock icon="🛡️" title="Protection of Your Work">
            <BulletList
              items={[
                'Your stories are protected on Shadow. You retain full rights and ownership.',
                'You have the right to edit, update, or remove your work at any time.',
                'We do not claim ownership of your content, but by publishing here, you grant us permission to display and distribute it on the platform.',
              ]}
            />
          </SectionBlock>

          <SectionBlock icon="💰" title="Fair Profit Sharing">
            <BulletList
              items={[
                'All earnings are shared fairly as described in our Author Income.',
                'We are committed to transparency and supporting authors with monetization opportunities.',
                'Full details are available in the income dashboard and benefits section.',
              ]}
            />
          </SectionBlock>

          <SectionBlock icon="⚠️" title="Policy Violations">
            <BulletList
              items={[
                'Any violation of these rules may result in your story or account being blocked or deleted without prior notice.',
                'This includes, but is not limited to: plagiarism, unmarked adult content, abuse, hate speech, or any content that violates local laws or community standards.',
                'We review reported content carefully and may suspend or restrict access while the issue is being resolved.',
              ]}
            />
          </SectionBlock>

          <SectionBlock icon="📝" title="Author Notice (Before Publishing)">
            <div className="space-y-5">
              <p>
                Please note that the <span className="font-semibold text-[#0b5cff]">first episode is always free</span> for all readers and <span className="font-semibold text-[#0b5cff]">does not generate any income.</span>
              </p>

              <p>
                In addition, episodes unlocked using <span className="font-semibold text-[#0b5cff]">free gems, story cards, or vouchers</span> will also <span className="font-semibold text-[#0b5cff]">not earn revenue</span>, as these are free access methods and do not result in actual payments.
              </p>

              <p>
                This policy is already explained in the <span className="font-semibold text-[#0b5cff]">Author Income</span> section. Make sure to review it carefully before publishing your story.
              </p>
            </div>
          </SectionBlock>

          <SectionBlock icon="🔞" title="Content Guidelines">
            <BulletList
              items={[
                "18+ content is allowed, including mature, violent, or romantic themes — as long as it's part of the story.",
                'We do not allow pornographic or sex-focused content. Shadow is a platform for storytelling, not explicit sexual material.',
                'Avoid vulgar or graphic sexual language. You are encouraged to write mature scenes with creativity and taste.',
                'If your story contains mature scenes, please mark the episodes as 18+ so readers can decide whether to continue.',
                'Stories with unmarked adult content that receive complaints may be temporarily blocked until corrected.',
                'You may also enable the 18+ Story setting to hide the full story from underage readers if the entire work is mature.',
              ]}
            />
          </SectionBlock>
        </article>
      </main>
    </div>
  )
}
