import { useNavigate } from 'react-router-dom'

export default function TermsPoliciesPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-white pb-10 text-[#141414]"
      style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
    >
      <header className="sticky top-0 z-50 bg-[#ff2b2b] px-4 py-3 text-white shadow-sm sm:py-4">
        <div className="relative mx-auto flex max-w-3xl items-center justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-95"
            aria-label="Go back"
          >
            <i className="fas fa-chevron-left text-[13px]" />
          </button>

          <h1 className="px-12 text-center text-[15px] font-[700] tracking-tight sm:text-[22px]">
            <span className="mr-2">📜</span>
            Terms and Policies
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-10">
        <article className="w-full max-w-full break-words text-[13px] leading-6 sm:text-[18px] sm:leading-8">
          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-5 sm:mb-5 sm:gap-x-5 sm:text-[18px] sm:leading-7">
            <span className="font-[700]">Effective Date:</span>
            <span className="font-[400]">21/12/2025</span>
          </div>

          <h2 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[20px]">
            Welcome to Shadowera
          </h2>

          <p className="mb-5 font-[400] sm:mb-7">
            By accessing or using our platform, you (&quot;User&quot;, &quot;Author&quot;, or
            &quot;Reader&quot;) agree to follow these Terms of Service. Please read them carefully.
          </p>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">1. User Accounts</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>You must register and create an account to publish or engage with content.</li>
              <li>You are responsible for keeping your account information secure.</li>
              <li>If you believe your account has been compromised, please contact us immediately.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">2. User Conduct</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>You agree to behave respectfully and responsibly. You must not:</li>
              <li>Post or create obscene, offensive, or violent content.</li>
              <li>Use rude, defamatory, or insulting language toward other users.</li>
              <li>Engage in harassment, threats, or hateful behavior.</li>
              <li>Violate any applicable laws.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">3. Content Ownership</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>You must only upload or publish original content that you created.</li>
              <li>Plagiarism, copying someone else&apos;s work without permission, is strictly prohibited.</li>
              <li>
                If plagiarism or copyright violation is found, we reserve the right to remove the content and
                suspend or permanently ban your account.
              </li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">4. Fraud and Misuse</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>
                Fraudulent activity, including but not limited to impersonating others, providing false
                information, or manipulating data, is forbidden.
              </li>
              <li>Any violation will result in immediate termination of your account.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">5. Intellectual Property</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>We reserve the right to remove or edit content that violates our policies without prior notice.</li>
              <li>Decisions made by our moderation team are final.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">6. Content Moderation</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>We reserve the right to remove or edit content that violates our policies without prior notice.</li>
              <li>Decisions made by our moderation team are final.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">7. Account Termination</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>We may suspend or terminate your account if you violate these Terms, without prior notice.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">8. Disclaimer</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>We are not responsible for any damages, losses, or misunderstandings caused by user content.</li>
              <li>Use our platform at your own risk.</li>
            </ul>
          </section>

          <section className="mb-6 sm:mb-7">
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">9. Changes to the Terms</h3>
            <ul className="list-disc space-y-2 pl-5 font-[400] sm:pl-7">
              <li>We may update these Terms from time to time.</li>
              <li>Continued use of the platform after changes means you accept the updated Terms.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-3 text-[16px] font-[700] sm:mb-4 sm:text-[24px]">10. Contact Us</h3>
            <p className="mb-2 font-[400]">
              If you have any questions or concerns about these Terms, please contact us at:
            </p>
            <ul className="list-disc space-y-1 pl-5 font-[400] sm:pl-7">
              <li>[alphacentauri12226@gmail.com]</li>
              <li>Facebook Page [ របស់អាល់ផាសេនតាវី ]</li>
              <li>Telegram [ @Hei_xxing ]</li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
}
