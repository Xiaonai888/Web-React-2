import { ArrowLeft, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ImagePlaceholder({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden border border-white/70 bg-gradient-to-br from-white/70 via-[#eee8ff]/70 to-[#d8c9ff]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${className}`}
    >
      <span className="absolute left-[18%] top-[20%] h-12 w-12 rounded-full bg-white/30 blur-xl" />
      <span className="absolute bottom-[12%] right-[14%] h-16 w-16 rounded-full bg-[#bca8ff]/25 blur-2xl" />
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <span className="h-px w-10 bg-[#cfc2ff]" />
      <h2 className="text-center text-[20px] font-black tracking-[-0.02em] text-[#20203f]">
        {children}
      </h2>
      <span className="h-px w-10 bg-[#cfc2ff]" />
    </div>
  )
}

function FeatureItem({ tone, title, children }) {
  const toneClass = {
    purple: 'bg-[#f1edff] text-[#7458e8]',
    lilac: 'bg-[#eee9ff] text-[#765cf0]',
    yellow: 'bg-[#fff4d9] text-[#f0aa19]',
  }[tone]

  return (
    <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:flex-col sm:items-center sm:text-center">
      <div className={`h-12 w-12 shrink-0 rounded-full ${toneClass}`} />
      <div className="min-w-0">
        <h3 className="text-[15px] font-black text-[#6849df]">{title}</h3>
        <p className="mt-1 text-[12px] leading-5 text-[#37364b]">{children}</p>
      </div>
    </div>
  )
}

export default function AboutUsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white pb-10 text-[#17172e] dark:bg-[#0d0f16] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-[#eceaf3] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#171923]/95">
        <div className="relative mx-auto flex h-16 max-w-[760px] items-center justify-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-4 flex h-10 w-10 items-center justify-start text-[#111827] active:scale-95 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.9} />
          </button>

          <h1 className="text-[20px] font-black tracking-[-0.02em] text-[#111827] dark:text-white">
            About Us
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] overflow-hidden bg-white dark:bg-[#0d0f16]">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f3efff] via-[#eee8ff] to-[#ddd1ff] px-5 py-7 sm:px-8 sm:py-9">
          <span className="pointer-events-none absolute -left-16 bottom-[-70px] h-48 w-48 rounded-full bg-[#bca9ff]/35 blur-3xl" />
          <span className="pointer-events-none absolute right-[-55px] top-[-70px] h-52 w-52 rounded-full bg-white/55 blur-3xl" />

          <div className="relative grid grid-cols-[92px_1fr] items-center gap-4 sm:grid-cols-[150px_1fr_150px] sm:gap-6">
            <ImagePlaceholder className="h-[150px] rounded-[24px] sm:h-[190px]" />

            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2">
                <h2 className="text-[35px] font-black tracking-[-0.06em] text-[#1d173f] sm:text-[48px]">
                  SHADOW
                </h2>
                <Sparkles className="h-5 w-5 text-[#7458e8]" strokeWidth={1.8} />
              </div>

              <p className="mt-1 text-[17px] font-black text-[#7657e7] sm:text-[20px]">
                Where stories find readers.
              </p>

              <p className="mx-auto mt-3 max-w-[390px] text-[13px] leading-6 text-[#37364b] sm:mx-0 sm:text-[14px]">
                A home for stories, readers, and authors to connect, create, and grow together.
              </p>
            </div>

            <ImagePlaceholder className="hidden h-[190px] rounded-[28px] sm:block" />
          </div>
        </section>

        <div className="space-y-7 px-4 py-5 sm:px-6 sm:py-7">
          <section className="rounded-[24px] border border-[#e5def9] bg-white p-5 shadow-[0_12px_32px_rgba(83,61,144,0.07)] dark:border-white/10 dark:bg-[#171923]">
            <div className="grid gap-5 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#8064ef]" strokeWidth={1.8} />
                  <h2 className="text-[20px] font-black text-[#252143] dark:text-white">Our Story</h2>
                </div>

                <p className="mt-4 text-[13px] leading-6 text-[#37364b] dark:text-white/70">
                  Shadow was created as a place where stories can be shared, discovered, and supported.
                </p>

                <p className="mt-3 text-[13px] leading-6 text-[#37364b] dark:text-white/70">
                  We bring readers and authors together through reading, publishing, community, and book selling tools in one platform.
                </p>
              </div>

              <ImagePlaceholder className="h-[190px] rounded-[22px]" />
            </div>
          </section>

          <section>
            <SectionTitle>Built for You</SectionTitle>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <article className="grid grid-cols-[120px_1fr] items-center gap-4 rounded-[22px] border border-[#ddd4fb] bg-gradient-to-br from-[#f6f3ff] to-[#eee9ff] p-4 shadow-[0_10px_26px_rgba(109,74,255,0.06)] sm:grid-cols-[42%_1fr]">
                <ImagePlaceholder className="h-[150px] rounded-[22px]" />
                <div>
                  <h3 className="text-[18px] font-black text-[#6e50df]">For Readers</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#37364b]">
                    Discover stories that touch your heart. Save, follow, and support the work you love.
                  </p>
                </div>
              </article>

              <article className="grid grid-cols-[120px_1fr] items-center gap-4 rounded-[22px] border border-[#f1dfb7] bg-gradient-to-br from-[#fffaf0] to-[#fff3d7] p-4 shadow-[0_10px_26px_rgba(225,166,42,0.07)] sm:grid-cols-[42%_1fr]">
                <ImagePlaceholder className="h-[150px] rounded-[22px] !from-white/80 !via-[#fff1cf]/80 !to-[#f6d891]/70" />
                <div>
                  <h3 className="text-[18px] font-black text-[#c88a0c]">For Authors</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#37364b]">
                    Publish your stories, grow your audience, and sell books or PDF editions.
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section>
            <SectionTitle>What Makes Shadow Different</SectionTitle>

            <div className="mt-5 grid gap-5 sm:grid-cols-3 sm:gap-4">
              <FeatureItem tone="purple" title="Read">
                Discover amazing stories and authors that match you.
              </FeatureItem>

              <FeatureItem tone="lilac" title="Create">
                Share your stories and build your own audience.
              </FeatureItem>

              <FeatureItem tone="yellow" title="Support">
                Buy books and PDFs, support authors, and keep stories alive.
              </FeatureItem>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#2b2359] via-[#49348d] to-[#6041ae] p-5 text-white shadow-[0_18px_38px_rgba(56,37,116,0.22)] sm:p-7">
            <span className="pointer-events-none absolute left-[42%] top-[-60px] h-48 w-48 rounded-full bg-[#9a7cff]/20 blur-3xl" />

            <div className="relative grid gap-5 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
              <div>
                <div className="text-[42px] font-black leading-none text-[#ffe89b]">“</div>
                <h2 className="max-w-[390px] text-[24px] font-black leading-[1.2] tracking-[-0.025em]">
                  Stories belong to the people who create them.
                </h2>
                <p className="mt-4 max-w-[390px] text-[13px] leading-6 text-white/80">
                  Shadow is built to give authors more ways to share, grow, and earn while keeping control of their work.
                </p>
              </div>

              <ImagePlaceholder className="h-[180px] rounded-[22px] border-white/25 bg-white/10" />
            </div>
          </section>

          <footer className="pb-2 pt-1 text-center">
            <div className="text-[20px] font-black tracking-[0.02em] text-[#7458e8]">SHADOW</div>
            <div className="mt-1 text-[11px] text-[#8d94a1]">Version 1.0.0</div>
            <div className="mt-1 text-[10.5px] text-[#9aa1ad]">© 2026 Shadow. All rights reserved.</div>
          </footer>
        </div>
      </main>
    </div>
  )
}
