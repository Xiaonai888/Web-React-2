import { ArrowLeft, BookOpen, Feather, Heart, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ImagePlaceholder({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-gradient-to-br from-white/70 via-[#eee8ff]/70 to-[#d8c9ff]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ${className}`}
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
      <h2 className="text-center text-[20px] font-bold tracking-[-0.02em] text-[#20203f]">
  {children}
</h2>
      <span className="h-px w-10 bg-[#cfc2ff]" />
    </div>
  )
}

function FeatureItem({ tone, title, children }) {
  const toneMap = {
  purple: {
    wrap: 'bg-[#f8f4ff]',
    icon: 'text-[#8a63f6]',
    title: 'text-[#6f4de2]',
    Icon: BookOpen,
  },
  orange: {
    wrap: 'bg-[#fff7ea]',
    icon: 'text-[#f39a2f]',
    title: 'text-[#d67c12]',
    Icon: Feather,
  },
  red: {
    wrap: 'bg-[#fff1f3]',
    icon: 'text-[#ef5b74]',
    title: 'text-[#e34b65]',
    Icon: Heart,
  },
}[tone]

  const Icon = toneMap.Icon

  return (
    <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:flex-col sm:items-center sm:text-center">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneMap.wrap}`}
      >
        <Icon className={`h-5 w-5 ${toneMap.icon}`} strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <h3 className={`text-[15px] font-bold ${toneMap.title}`}>{title}</h3>
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
        <div className="relative mx-auto flex h-12 max-w-[760px] items-center justify-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-4 flex h-10 w-10 items-center justify-start text-[#111827] active:scale-95 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.9} />
          </button>

          <h1 className="text-[16px] font-bold tracking-[-0.02em] text-[#111827] dark:text-white">
            About Us
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] overflow-hidden bg-white dark:bg-[#0d0f16]">
        <section className="relative overflow-hidden bg-[#eee9ff]">
          <img
            src="/assets/Icons/About%20US/Shadow%201.webp"
            alt=""
            aria-hidden="true"
            className="block h-auto w-full"
          />

          <div className="pointer-events-none absolute inset-x-[25%] inset-y-[8%] rounded-full bg-white/35 blur-2xl" />

{/* Mobile gradient */}
<div
  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[220px] sm:hidden"
  style={{
    background:
      'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,1) 100%)',
  }}
/>

{/* Computer gradient */}
<div
  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[320px] sm:block"
  style={{
    background:
      'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 28%, rgba(255,255,255,0.62) 68%, rgba(255,255,255,1) 100%)',
  }}
/>
<div className="absolute inset-0 z-10">
  {/* Mobile hero content */}
  <div className="absolute left-[25%] right-[20%] top-[30%] -translate-y-1/2 text-center sm:hidden">
    <img
      src="/assets/Icons/About%20US/Shadow%200.svg"
      alt="Shadow"
      className="mx-auto w-[145px] -translate-x-[2px] -translate-y-[4px] object-contain"
    />

    <p className="mt-1 whitespace-nowrap text-[11px] font-black text-[#7657e7]">
  Where stories find readers.
</p>

    <p className="mx-auto mt-2 max-w-[250px] text-[8.5px] leading-4 text-[#302e46]">
      A home for stories, readers, and authors to connect, create, and grow together.
    </p>
  </div>

  {/* Computer hero content */}
  <div className="absolute left-[25%] right-[20%] top-[33%] hidden -translate-y-1/2 text-center sm:block">
    <img
      src="/assets/Icons/About%20US/Shadow%200.svg"
      alt="Shadow"
      className="mx-auto w-[260px] translate-x-0 -translate-y-[6px] object-contain"
    />

    <p className="mt-1 whitespace-nowrap text-[18px] font-black text-[#7657e7]">
  Where stories find readers.
</p>

    <p className="mx-auto mt-2 max-w-[330px] text-[12.5px] leading-5 text-[#302e46]">
      A home for stories, readers, and authors to connect, create, and grow together.
    </p>
  </div>
</div>
        </section>

        <div className="relative z-10 -mt-[115px] space-y-7 px-4 pb-5 sm:-mt-[200px] sm:px-6 sm:pb-7">
          <section className="relative overflow-hidden rounded-[16px] bg-white p-4 shadow-[0_12px_32px_rgba(83,61,144,0.09)] dark:bg-[#171923] sm:min-h-[205px] sm:p-5">
  <div className="flex items-center gap-2">
    <Sparkles className="h-4 w-4 text-[#8064ef]" strokeWidth={1.8} />

    <h2 className="text-[18px] font-bold text-[#252143] dark:text-white sm:text-[20px]">
  Our Story
</h2>
  </div>

  <div className="mt-2 pr-[108px] sm:mt-4 sm:max-w-[58%] sm:pr-0">
    <p className="text-[11px] leading-[19px] text-[#37364b] dark:text-white/70 sm:text-[13px] sm:leading-6">
      Shadow was created as a place where stories can be shared, discovered, and supported.
    </p>

    <p className="mt-2 text-[11px] leading-[19px] text-[#37364b] dark:text-white/70 sm:mt-3 sm:text-[13px] sm:leading-6">
      We bring readers and authors together through reading, publishing, community, and book selling tools in one platform.
    </p>
  </div>

  <img
    src="/assets/Icons/About%20US/Shadow%202.svg"
    alt="Shadow story mascot"
    className="absolute right-[8px] top-[60px] w-[117px] object-contain sm:hidden"
  />

  <img
    src="/assets/Icons/About%20US/Shadow%202.svg"
    alt=""
    aria-hidden="true"
    className="absolute bottom-[8px] right-[30px] hidden w-[230px] object-contain sm:block"
  />
</section>
          <section>
  <div className="-mt-2 mb-5">
    <SectionTitle>Built for You</SectionTitle>
  </div>

  <div className="grid gap-3 sm:grid-cols-2">
    <article className="relative min-h-[128px] overflow-hidden rounded-[14px] bg-gradient-to-br from-[#f6f3ff] to-[#eee9ff] px-4 py-3 shadow-[0_10px_26px_rgba(109,74,255,0.06)] sm:min-h-[145px]">
      <div className="ml-[112px] flex min-h-[104px] flex-col justify-center sm:ml-[138px] sm:min-h-[121px]">
        <h3 className="text-[17px] font-bold text-[#6e50df] sm:text-[18px]">
          For Readers
        </h3>

        <p className="mt-2 text-[11.5px] leading-5 text-[#37364b] sm:text-[12.5px] sm:leading-[21px]">
          Discover stories that touch your heart. Save, follow, and support the work you love.
        </p>
      </div>

      <img
        src="/assets/Icons/About%20US/Shadow%203.svg"
        alt="Shadow reader mascot"
        className="pointer-events-none absolute bottom-[7px] left-[9px] w-[104px] object-contain sm:hidden"
      />

      <img
        src="/assets/Icons/About%20US/Shadow%203.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[5px] left-[10px] hidden w-[132px] object-contain sm:block"
      />
    </article>

   <article className="relative min-h-[128px] overflow-visible sm:min-h-[145px]">
  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-[#fffaf0] to-[#fff3d7] shadow-[0_10px_26px_rgba(225,166,42,0.07)]" />

  <div className="relative z-10 ml-[125px] flex min-h-[128px] flex-col justify-center px-4 py-3 sm:ml-[150px] sm:min-h-[145px]">
    <h3 className="text-[17px] font-bold text-[#c88a0c] sm:text-[18px]">
      For Authors
    </h3>

    <p className="mt-2 text-[11.5px] leading-5 text-[#37364b] sm:text-[12.5px] sm:leading-[21px]">
      Publish your stories, grow your audience, and sell books or PDF editions.
    </p>
  </div>

  <div className="pointer-events-none absolute bottom-[3px] left-[4px] z-20 h-[106px] w-[120px] sm:hidden">
  <img
    src="/assets/Icons/About%20US/Shadow%204.svg"
    alt="Shadow author mascot"
    className="h-full w-full origin-bottom-left scale-[1.08] object-contain object-bottom-left"
  />
</div>

  <div className="pointer-events-none absolute bottom-0 left-0 z-20 hidden h-[95px] w-[120px] sm:block">
    <img
      src="/assets/Icons/About%20US/Shadow%204.svg"
      alt=""
      aria-hidden="true"
      className="h-full w-full origin-bottom-left scale-[1.35] object-contain object-bottom-left"
    />
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

<FeatureItem tone="orange" title="Create">
  Share your stories and build your own audience.
</FeatureItem>

<FeatureItem tone="red" title="Support">
  Buy books and PDFs, support authors, and keep stories alive.
</FeatureItem>
            </div>
          </section>

          {/* Mobile quote card */}
          <section className="relative h-[163px] sm:hidden">
  <div className="absolute inset-0 overflow-hidden rounded-[16px] bg-gradient-to-t from-[#2b2359] via-[#49348d] to-[#6041ae] text-white shadow-[0_18px_38px_rgba(56,37,116,0.22)]">
              <span className="pointer-events-none absolute left-[42%] top-[-60px] h-48 w-48 rounded-full bg-[#9a7cff]/20 blur-3xl" />

              <div className="absolute left-4 top-[7px] z-10 max-w-[57%]">
                <div className="text-[26px] font-black leading-none text-[#ffe89b]">
                  “
                </div>

                <h2 className="text-[15px] font-bold leading-[1.18] tracking-[-0.015em]">
                  Stories belong to the people who create them.
                </h2>

                <p className="mt-2 text-[9.5px] leading-[15px] text-white/85">
                  Shadow is built to give authors more ways to share, grow, and earn while keeping control of their work.
                </p>
              </div>

              <img
                src="/assets/Icons/About%20US/Shadow%205.svg"
                alt="Shadow creator mascot"
                className="pointer-events-none absolute bottom-[-2px] right-[-26px] z-0 h-auto w-[110%] max-w-none origin-bottom-right object-contain object-bottom-right"
              />
            </div>
          </section>

          {/* Computer quote card */}
          <section className="relative isolate hidden min-h-[170px] overflow-visible rounded-[16px] bg-gradient-to-t from-[#2b2359] via-[#49348d] to-[#6041ae] px-6 py-5 text-white shadow-[0_18px_38px_rgba(56,37,116,0.22)] sm:block">
            <span className="pointer-events-none absolute left-[42%] top-[-60px] h-48 w-48 rounded-full bg-[#9a7cff]/20 blur-3xl" />

            <span className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%] rounded-l-[16px] bg-gradient-to-r from-[#2b2359] via-[#392978]/95 to-transparent" />

            <div className="relative z-10 max-w-[51%]">
              <div className="text-[27px] font-black leading-none text-[#ffe89b]">
                “
              </div>

              <h2 className="max-w-[310px] text-[18px] font-bold leading-[1.18] tracking-[-0.015em]">
                Stories belong to the people who create them.
              </h2>

              <p className="mt-2 max-w-[315px] text-[11px] leading-[18px] text-white/85">
                Shadow is built to give authors more ways to share, grow, and earn while keeping control of their work.
              </p>
            </div>

            <img
              src="/assets/Icons/About%20US/Shadow%205.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -top-[12px] right-[-10px] z-0 h-auto w-[84%] max-w-none origin-bottom-right object-contain"
            />
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

