import { ArrowLeft, BookOpen, Feather, Heart, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('aboutUsPage', {
  en: { back: 'Back', aboutUs: 'About Us', tagline: 'Where stories find readers.', intro: 'A home for stories, readers, and authors to connect, create, and grow together.', ourStory: 'Our Story', story1: 'Shadow was created as a place where stories can be shared, discovered, and supported.', story2: 'We bring readers and authors together through reading, publishing, community, and book selling tools in one platform.', builtForYou: 'Built for You', forReaders: 'For Readers', readersText: 'Discover stories that touch your heart. Save, follow, and support the work you love.', forAuthors: 'For Authors', authorsText: 'Publish your stories, grow your audience, and sell books or PDF editions.', different: 'What Makes Shadow Different', read: 'Read', readText: 'Discover amazing stories and authors that match you.', create: 'Create', createText: 'Share your stories and build your own audience.', support: 'Support', supportText: 'Buy books and PDFs, support authors, and keep stories alive.', quote: 'Stories belong to the people who create them.', quoteText: 'Shadow is built to give authors more ways to share, grow, and earn while keeping control of their work.', version: 'Version 1.0.0', rights: '© 2026 Shadow. All rights reserved.' },
  km: { back: 'ត្រឡប់ក្រោយ', aboutUs: 'អំពីយើង', tagline: 'ទីកន្លែងដែលរឿងបានជួបអ្នកអាន។', intro: 'ផ្ទះមួយសម្រាប់រឿង អ្នកអាន និងអ្នកនិពន្ធ ដើម្បីភ្ជាប់គ្នា បង្កើត និងរីកចម្រើនជាមួយគ្នា។', ourStory: 'រឿងរ៉ាវរបស់យើង', story1: 'Shadow ត្រូវបានបង្កើតឡើងជាកន្លែងសម្រាប់ចែករំលែក ស្វែងរក និងគាំទ្ររឿង។', story2: 'យើងភ្ជាប់អ្នកអាន និងអ្នកនិពន្ធតាមរយៈការអាន ការបោះពុម្ព សហគមន៍ និងឧបករណ៍លក់សៀវភៅក្នុង Platform តែមួយ។', builtForYou: 'បង្កើតឡើងសម្រាប់អ្នក', forReaders: 'សម្រាប់អ្នកអាន', readersText: 'ស្វែងរករឿងដែលប៉ះបេះដូងអ្នក។ រក្សាទុក តាមដាន និងគាំទ្រស្នាដៃដែលអ្នកស្រឡាញ់។', forAuthors: 'សម្រាប់អ្នកនិពន្ធ', authorsText: 'បោះពុម្ពរឿង បង្កើនអ្នកអាន និងលក់សៀវភៅ ឬ PDF របស់អ្នក។', different: 'អ្វីដែលធ្វើឱ្យ Shadow ខុសប្លែក', read: 'អាន', readText: 'ស្វែងរករឿង និងអ្នកនិពន្ធដែលសមនឹងអ្នក។', create: 'បង្កើត', createText: 'ចែករំលែករឿង និងកសាងអ្នកអានផ្ទាល់ខ្លួន។', support: 'គាំទ្រ', supportText: 'ទិញសៀវភៅ និង PDF គាំទ្រអ្នកនិពន្ធ និងរក្សារឿងឱ្យបន្តរស់នៅ។', quote: 'រឿងជាកម្មសិទ្ធិរបស់មនុស្សដែលបង្កើតវា។', quoteText: 'Shadow ត្រូវបានបង្កើតដើម្បីផ្តល់ឱ្យអ្នកនិពន្ធនូវវិធីកាន់តែច្រើនក្នុងការចែករំលែក រីកចម្រើន និងរកចំណូល ខណៈនៅតែគ្រប់គ្រងស្នាដៃរបស់ខ្លួន។', version: 'កំណែ 1.0.0', rights: '© 2026 Shadow. រក្សាសិទ្ធិគ្រប់យ៉ាង។' },
  zh: { back: '返回', aboutUs: '关于我们', tagline: '让故事遇见读者。', intro: '一个让故事、读者和作者相遇、创作并共同成长的家。', ourStory: '我们的故事', story1: 'Shadow 为分享、发现和支持故事而创建。', story2: '我们把阅读、发布、社区和图书销售工具整合在一个平台，让读者与作者连接。', builtForYou: '为你而建', forReaders: '为读者', readersText: '发现触动你的故事。收藏、关注并支持你喜爱的作品。', forAuthors: '为作者', authorsText: '发布故事、扩大读者群，并销售图书或 PDF 版本。', different: 'Shadow 的不同之处', read: '阅读', readText: '发现适合你的精彩故事和作者。', create: '创作', createText: '分享你的故事并建立自己的读者群。', support: '支持', supportText: '购买图书和 PDF，支持作者，让故事继续流传。', quote: '故事属于创造它们的人。', quoteText: 'Shadow 为作者提供更多分享、成长和创收方式，同时让作者继续掌控自己的作品。', version: '版本 1.0.0', rights: '© 2026 Shadow. 保留所有权利。' },
  ja: { back: '戻る', aboutUs: 'Shadowについて', tagline: '物語と読者が出会う場所。', intro: '物語、読者、作者がつながり、創作し、一緒に成長できる場所です。', ourStory: '私たちのストーリー', story1: 'Shadow は、物語を共有し、見つけ、応援できる場所として生まれました。', story2: '読書、出版、コミュニティ、書籍販売のツールを一つのプラットフォームにまとめ、読者と作者をつなぎます。', builtForYou: 'あなたのために', forReaders: '読者のために', readersText: '心に響く物語を見つけ、保存・フォローして好きな作品を応援できます。', forAuthors: '作者のために', authorsText: '物語を公開し、読者を増やし、本や PDF 版を販売できます。', different: 'Shadow が違う理由', read: '読む', readText: 'あなたに合う素敵な物語と作者を見つけましょう。', create: '創作', createText: '物語を共有し、自分の読者を育てましょう。', support: '応援', supportText: '本や PDF を購入して作者を支え、物語を未来へつなげます。', quote: '物語は、それを生み出した人のものです。', quoteText: 'Shadow は、作者が作品を自分で管理しながら、共有・成長・収益化できる選択肢を増やすために作られています。', version: 'バージョン 1.0.0', rights: '© 2026 Shadow. All rights reserved.' },
  ko: { back: '뒤로 가기', aboutUs: 'Shadow 소개', tagline: '이야기와 독자가 만나는 곳.', intro: '이야기, 독자, 작가가 연결되고 창작하며 함께 성장하는 공간입니다.', ourStory: '우리의 이야기', story1: 'Shadow는 이야기를 공유하고 발견하며 응원할 수 있는 공간으로 만들어졌습니다.', story2: '읽기, 출판, 커뮤니티, 도서 판매 도구를 하나의 플랫폼에 모아 독자와 작가를 연결합니다.', builtForYou: '당신을 위해', forReaders: '독자를 위해', readersText: '마음을 움직이는 이야기를 발견하고 저장, 팔로우하며 좋아하는 작품을 응원하세요.', forAuthors: '작가를 위해', authorsText: '이야기를 게시하고 독자를 늘리며 책이나 PDF 버전을 판매하세요.', different: 'Shadow가 특별한 이유', read: '읽기', readText: '나에게 맞는 멋진 이야기와 작가를 발견하세요.', create: '창작', createText: '이야기를 공유하고 나만의 독자층을 만들어 보세요.', support: '응원', supportText: '책과 PDF를 구매해 작가를 응원하고 이야기가 계속 이어지게 하세요.', quote: '이야기는 그것을 만든 사람의 것입니다.', quoteText: 'Shadow는 작가가 자신의 작품을 계속 관리하면서 더 많이 공유하고 성장하며 수익을 얻을 수 있도록 만들어졌습니다.', version: '버전 1.0.0', rights: '© 2026 Shadow. All rights reserved.' },
})

function ImagePlaceholder({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-gradient-to-br from-white/70 via-[#eee8ff]/70 to-[#d8c9ff]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:from-[#202331] dark:via-[#28243b] dark:to-[#30284f] ${className}`}
    >
      <span className="absolute left-[18%] top-[20%] h-12 w-12 rounded-full bg-white/30 blur-xl dark:bg-white/10" />
      <span className="absolute bottom-[12%] right-[14%] h-16 w-16 rounded-full bg-[#bca8ff]/25 blur-2xl" />
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <span className="h-px w-10 bg-[#cfc2ff] dark:bg-[#8064ef]/45" />
      <h2 className="text-center text-[20px] font-bold tracking-[-0.02em] text-[#20203f] dark:text-[var(--shadow-text-primary)]">
        {children}
      </h2>
      <span className="h-px w-10 bg-[#cfc2ff] dark:bg-[#8064ef]/45" />
    </div>
  )
}

function FeatureItem({ tone, title, children }) {
  const toneMap = {
    purple: {
      wrap: 'bg-[#f8f4ff] dark:bg-[#8a63f6]/12',
      icon: 'text-[#8a63f6] dark:text-[#b8a2ff]',
      title: 'text-[#6f4de2] dark:text-[#b8a2ff]',
      Icon: BookOpen,
    },
    orange: {
      wrap: 'bg-[#fff7ea] dark:bg-[#f39a2f]/12',
      icon: 'text-[#f39a2f] dark:text-[#ffb85c]',
      title: 'text-[#d67c12] dark:text-[#ffb85c]',
      Icon: Feather,
    },
    red: {
      wrap: 'bg-[#fff1f3] dark:bg-[#ef5b74]/12',
      icon: 'text-[#ef5b74] dark:text-[#ff8fa2]',
      title: 'text-[#e34b65] dark:text-[#ff8fa2]',
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
        <p className="mt-1 text-[12px] leading-5 text-[#37364b] dark:text-[var(--shadow-text-secondary)]">
          {children}
        </p>
      </div>
    </div>
  )
}

export default function AboutUsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <div className="app-page about-us-page min-h-screen pb-10 text-[#17172e]">
      <style>{`
        .about-us-page {
          --about-hero-fade-mid: rgba(255, 255, 255, 0.55);
          --about-hero-fade-end: rgba(255, 255, 255, 1);
        }

        html.dark .about-us-page {
          --about-hero-fade-mid: rgba(13, 15, 22, 0.68);
          --about-hero-fade-end: rgba(13, 15, 22, 1);
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-[#eceaf3] bg-white/95 backdrop-blur dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-nav-bg)]">
        <div className="relative mx-auto flex h-12 max-w-[760px] items-center justify-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('aboutUsPage.back')}
            className="absolute left-4 flex h-10 w-10 items-center justify-start text-[#111827] active:scale-95 dark:text-[var(--shadow-text-primary)]"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.9} />
          </button>

          <h1 className="text-[16px] font-bold tracking-[-0.02em] text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {t('aboutUsPage.aboutUs')}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] overflow-hidden bg-white dark:bg-[var(--shadow-bg-page)]">
        <section className="relative overflow-hidden bg-[#eee9ff] dark:bg-[#181625]">
          <img
            src="/assets/Icons/About%20US/Shadow%201.webp"
            alt=""
            aria-hidden="true"
            className="block h-auto w-full"
          />

          <div className="pointer-events-none absolute inset-x-[25%] inset-y-[8%] rounded-full bg-white/35 blur-2xl dark:bg-white/10" />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[220px] sm:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 30%, var(--about-hero-fade-mid) 70%, var(--about-hero-fade-end) 100%)',
            }}
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[320px] sm:block"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 28%, var(--about-hero-fade-mid) 68%, var(--about-hero-fade-end) 100%)',
            }}
          />

          <div className="absolute inset-0 z-10">
            <div className="absolute left-[25%] right-[20%] top-[30%] -translate-y-1/2 text-center sm:hidden">
              <img
                src="/assets/Icons/About%20US/Shadow%200.svg"
                alt="Shadow"
                className="mx-auto w-[145px] -translate-x-[2px] -translate-y-[4px] object-contain"
              />

              <p className="mt-1 whitespace-nowrap text-[11px] font-black text-[#7657e7]">
                {t('aboutUsPage.tagline')}
              </p>

              <p className="mx-auto mt-2 max-w-[250px] text-[8.5px] leading-4 text-[#302e46]">
                {t('aboutUsPage.intro')}
              </p>
            </div>

            <div className="absolute left-[25%] right-[20%] top-[33%] hidden -translate-y-1/2 text-center sm:block">
              <img
                src="/assets/Icons/About%20US/Shadow%200.svg"
                alt="Shadow"
                className="mx-auto w-[260px] translate-x-0 -translate-y-[6px] object-contain"
              />

              <p className="mt-1 whitespace-nowrap text-[18px] font-black text-[#7657e7]">
                {t('aboutUsPage.tagline')}
              </p>

              <p className="mx-auto mt-2 max-w-[330px] text-[12.5px] leading-5 text-[#302e46]">
                {t('aboutUsPage.intro')}
              </p>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-[115px] space-y-7 px-4 pb-5 sm:-mt-[200px] sm:px-6 sm:pb-7">
          <section className="relative overflow-hidden rounded-[16px] bg-white p-4 shadow-[0_12px_32px_rgba(83,61,144,0.09)] dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)] sm:min-h-[205px] sm:p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#8064ef]" strokeWidth={1.8} />

              <h2 className="text-[18px] font-bold text-[#252143] dark:text-[var(--shadow-text-primary)] sm:text-[20px]">
                {t('aboutUsPage.ourStory')}
              </h2>
            </div>

            <div className="mt-2 pr-[108px] sm:mt-4 sm:max-w-[58%] sm:pr-0">
              <p className="text-[11px] leading-[19px] text-[#37364b] dark:text-[var(--shadow-text-secondary)] sm:text-[13px] sm:leading-6">
                {t('aboutUsPage.story1')}
              </p>

              <p className="mt-2 text-[11px] leading-[19px] text-[#37364b] dark:text-[var(--shadow-text-secondary)] sm:mt-3 sm:text-[13px] sm:leading-6">
                {t('aboutUsPage.story2')}
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
              <SectionTitle>{t('aboutUsPage.builtForYou')}</SectionTitle>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="relative min-h-[128px] overflow-hidden rounded-[14px] bg-gradient-to-br from-[#f6f3ff] to-[#eee9ff] px-4 py-3 shadow-[0_10px_26px_rgba(109,74,255,0.06)] dark:from-[#211d31] dark:to-[#29213d] dark:shadow-none sm:min-h-[145px]">
                <div className="ml-[112px] flex min-h-[104px] flex-col justify-center sm:ml-[138px] sm:min-h-[121px]">
                  <h3 className="text-[17px] font-bold text-[#6e50df] dark:text-[#b8a2ff] sm:text-[18px]">
                    {t('aboutUsPage.forReaders')}
                  </h3>

                  <p className="mt-2 text-[11.5px] leading-5 text-[#37364b] dark:text-[var(--shadow-text-secondary)] sm:text-[12.5px] sm:leading-[21px]">
                    {t('aboutUsPage.readersText')}
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
                <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-[#fffaf0] to-[#fff3d7] shadow-[0_10px_26px_rgba(225,166,42,0.07)] dark:from-[#292318] dark:to-[#332918] dark:shadow-none" />

                <div className="relative z-10 ml-[125px] flex min-h-[128px] flex-col justify-center px-4 py-3 sm:ml-[150px] sm:min-h-[145px]">
                  <h3 className="text-[17px] font-bold text-[#c88a0c] dark:text-[#f3b54b] sm:text-[18px]">
                    {t('aboutUsPage.forAuthors')}
                  </h3>

                  <p className="mt-2 text-[11.5px] leading-5 text-[#37364b] dark:text-[var(--shadow-text-secondary)] sm:text-[12.5px] sm:leading-[21px]">
                    {t('aboutUsPage.authorsText')}
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
            <SectionTitle>{t('aboutUsPage.different')}</SectionTitle>

            <div className="mt-5 grid gap-5 sm:grid-cols-3 sm:gap-4">
              <FeatureItem tone="purple" title={t('aboutUsPage.read')}>
                {t('aboutUsPage.readText')}
              </FeatureItem>

              <FeatureItem tone="orange" title={t('aboutUsPage.create')}>
                {t('aboutUsPage.createText')}
              </FeatureItem>

              <FeatureItem tone="red" title={t('aboutUsPage.support')}>
                {t('aboutUsPage.supportText')}
              </FeatureItem>
            </div>
          </section>

          <section className="relative h-[163px] sm:hidden">
            <div className="absolute inset-0 overflow-hidden rounded-[16px] bg-gradient-to-t from-[#2b2359] via-[#49348d] to-[#6041ae] text-white shadow-[0_18px_38px_rgba(56,37,116,0.22)]">
              <span className="pointer-events-none absolute left-[42%] top-[-60px] h-48 w-48 rounded-full bg-[#9a7cff]/20 blur-3xl" />

              <div className="absolute left-4 top-[7px] z-10 max-w-[57%]">
                <div className="text-[26px] font-black leading-none text-[#ffe89b]">
                  “
                </div>

                <h2 className="text-[15px] font-bold leading-[1.18] tracking-[-0.015em]">
                  {t('aboutUsPage.quote')}
                </h2>

                <p className="mt-2 text-[9.5px] leading-[15px] text-white/85">
                  {t('aboutUsPage.quoteText')}
                </p>
              </div>

              <img
                src="/assets/Icons/About%20US/Shadow%205.svg"
                alt="Shadow creator mascot"
                className="pointer-events-none absolute bottom-[-2px] right-[-26px] z-0 h-auto w-[110%] max-w-none origin-bottom-right object-contain object-bottom-right"
              />
            </div>
          </section>

          <section className="relative isolate hidden min-h-[170px] overflow-visible rounded-[16px] bg-gradient-to-t from-[#2b2359] via-[#49348d] to-[#6041ae] px-6 py-5 text-white shadow-[0_18px_38px_rgba(56,37,116,0.22)] sm:block">
            <span className="pointer-events-none absolute left-[42%] top-[-60px] h-48 w-48 rounded-full bg-[#9a7cff]/20 blur-3xl" />

            <span className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%] rounded-l-[16px] bg-gradient-to-r from-[#2b2359] via-[#392978]/95 to-transparent" />

            <div className="relative z-10 max-w-[51%]">
              <div className="text-[27px] font-black leading-none text-[#ffe89b]">
                “
              </div>

              <h2 className="max-w-[310px] text-[18px] font-bold leading-[1.18] tracking-[-0.015em]">
                {t('aboutUsPage.quote')}
              </h2>

              <p className="mt-2 max-w-[315px] text-[11px] leading-[18px] text-white/85">
                {t('aboutUsPage.quoteText')}
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
            <div className="text-[20px] font-black tracking-[0.02em] text-[#7458e8] dark:text-[#a78bfa]">
              SHADOW
            </div>
            <div className="mt-1 text-[11px] text-[#8d94a1] dark:text-[var(--shadow-text-secondary)]">
              {t('aboutUsPage.version')}
            </div>
            <div className="mt-1 text-[10.5px] text-[#9aa1ad] dark:text-[var(--shadow-text-tertiary)]">
              {t('aboutUsPage.rights')}
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
