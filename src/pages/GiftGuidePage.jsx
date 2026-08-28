import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('giftGuidePage', {
  en: {
    back: 'Back',
    title: 'How to send gifts',
    section1Title: '1. 100% of Diamond Gifts Go to Authors',
    section1Body1: 'When you send a Gift using Diamonds, 100% of the Gift value goes to the author.',
    section1Body2: 'Shadow does not take any share from Diamond Gifts.',
    section1Body3: 'Gifts sent with Coins are for support and ranking only and do not generate earnings for the author.',
    section2Title: '2. What is a Gift?',
    section2Body1: 'A Gift is a way for readers to show support and encouragement to the authors they love.',
    section2Body2: 'If you enjoy a story or an episode, you can send a Gift to let the author know that their work means something to you.',
    section3Title: '3. What can I use to send Gifts?',
    section3Body1: 'On Shadow, Gifts can be sent using Coins or Diamonds.',
    section3Body2: 'Coins are for simple and small support gifts. Diamonds are for special gifts or stronger support.',
    section3Body3: 'Each Gift has a different value, so you can choose the Gift you like based on the Coins or Diamonds you have.',
    section4Title: '4. How do Gifts help?',
    section4Body1: 'Gifts help encourage authors to keep writing, create new episodes, and continue improving their stories.',
    section4Body2: 'A Gift is not just a reward icon. It is a small message of support from the reader to the author.',
    section5Title: '5. How do I send a Gift?',
    section5Body1: 'You can send a Gift from the reading page or at the end of an episode.',
    section5Body2: 'Choose a Gift, choose the quantity, then tap Gift.',
    section6Title: '6. Gift Ranking / Top Fans',
    section6Body1: 'Gifts may help show which stories or episodes receive strong support from readers.',
    section6Body2: 'Readers who send Gifts may also appear in Top Fans, showing their support for the stories and authors they love.',
    section7Title: '7. Important Note',
    section7Body1: 'Please send Gifts only when you truly want to support an author.',
    section7Body2: 'Reading, liking, and writing comments are also meaningful ways to support authors.',
    section8Title: '8. All rights reserved by Shadow.',
    section8Body1: 'All gift rules and gift features are managed by Shadow.',
    section8Body2: 'Shadow reserves the right to update or adjust gift features when necessary.',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    title: 'របៀបផ្ញើ Gift',
    section1Title: '1. 100% នៃ Diamond Gift ទៅកាន់អ្នកនិពន្ធ',
    section1Body1: 'នៅពេលអ្នកផ្ញើ Gift ដោយប្រើ Diamonds តម្លៃ 100% នៃ Gift នោះនឹងទៅកាន់អ្នកនិពន្ធ។',
    section1Body2: 'Shadow មិនកាត់យកចំណែកណាមួយពី Diamond Gift ទេ។',
    section1Body3: 'Gift ដែលផ្ញើដោយ Coins គឺសម្រាប់គាំទ្រ និងចំណាត់ថ្នាក់ប៉ុណ្ណោះ ហើយមិនបង្កើតចំណូលឱ្យអ្នកនិពន្ធទេ។',
    section2Title: '2. Gift គឺជាអ្វី?',
    section2Body1: 'Gift គឺជាវិធីមួយសម្រាប់អ្នកអានបង្ហាញការគាំទ្រ និងលើកទឹកចិត្តដល់អ្នកនិពន្ធដែលពួកគេស្រឡាញ់។',
    section2Body2: 'បើអ្នកចូលចិត្តរឿង ឬភាគណាមួយ អ្នកអាចផ្ញើ Gift ដើម្បីឱ្យអ្នកនិពន្ធដឹងថាស្នាដៃរបស់ពួកគេមានន័យសម្រាប់អ្នក។',
    section3Title: '3. តើខ្ញុំអាចប្រើអ្វីដើម្បីផ្ញើ Gift?',
    section3Body1: 'នៅលើ Shadow អ្នកអាចផ្ញើ Gift ដោយប្រើ Coins ឬ Diamonds។',
    section3Body2: 'Coins សម្រាប់ Gift គាំទ្រសាមញ្ញ និងតូចៗ។ Diamonds សម្រាប់ Gift ពិសេស ឬការគាំទ្រខ្លាំងជាង។',
    section3Body3: 'Gift នីមួយៗមានតម្លៃខុសគ្នា ដូច្នេះអ្នកអាចជ្រើស Gift ដែលអ្នកចូលចិត្តតាមចំនួន Coins ឬ Diamonds ដែលអ្នកមាន។',
    section4Title: '4. Gift ជួយអ្វីខ្លះ?',
    section4Body1: 'Gift ជួយលើកទឹកចិត្តអ្នកនិពន្ធឱ្យបន្តសរសេរ បង្កើតភាគថ្មី និងបន្តអភិវឌ្ឍរឿងរបស់ពួកគេ។',
    section4Body2: 'Gift មិនមែនគ្រាន់តែជារូបសញ្ញារង្វាន់ទេ។ វាជាសារគាំទ្រតូចមួយពីអ្នកអានទៅកាន់អ្នកនិពន្ធ។',
    section5Title: '5. តើខ្ញុំផ្ញើ Gift ដោយរបៀបណា?',
    section5Body1: 'អ្នកអាចផ្ញើ Gift ពីទំព័រអាន ឬនៅចុងភាគ។',
    section5Body2: 'ជ្រើស Gift ជ្រើសចំនួន បន្ទាប់មកចុច Gift។',
    section6Title: '6. ចំណាត់ថ្នាក់ Gift / Top Fans',
    section6Body1: 'Gift អាចជួយបង្ហាញថារឿង ឬភាគណាខ្លះទទួលបានការគាំទ្រខ្លាំងពីអ្នកអាន។',
    section6Body2: 'អ្នកអានដែលផ្ញើ Gift ក៏អាចបង្ហាញនៅក្នុង Top Fans ដើម្បីបង្ហាញការគាំទ្ររបស់ពួកគេចំពោះរឿង និងអ្នកនិពន្ធដែលពួកគេស្រឡាញ់។',
    section7Title: '7. ចំណាំសំខាន់',
    section7Body1: 'សូមផ្ញើ Gift តែនៅពេលអ្នកពិតជាចង់គាំទ្រអ្នកនិពន្ធ។',
    section7Body2: 'ការអាន ការចុចចូលចិត្ត និងការសរសេរមតិ ក៏ជាវិធីគាំទ្រអ្នកនិពន្ធដែលមានន័យផងដែរ។',
    section8Title: '8. រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ Shadow។',
    section8Body1: 'ច្បាប់ និងមុខងារ Gift ទាំងអស់ត្រូវបានគ្រប់គ្រងដោយ Shadow។',
    section8Body2: 'Shadow រក្សាសិទ្ធិក្នុងការធ្វើបច្ចុប្បន្នភាព ឬកែសម្រួលមុខងារ Gift នៅពេលចាំបាច់។',
  },
  zh: {
    back: '返回',
    title: '如何赠送礼物',
    section1Title: '1. Diamond 礼物的 100% 价值归作者',
    section1Body1: '当你使用 Diamonds 赠送 Gift 时，Gift 价值的 100% 都会归作者所有。',
    section1Body2: 'Shadow 不会从 Diamond Gifts 中抽取任何份额。',
    section1Body3: '使用 Coins 赠送的 Gifts 仅用于支持和排名，不会为作者产生收入。',
    section2Title: '2. 什么是 Gift？',
    section2Body1: 'Gift 是读者向自己喜爱的作者表达支持和鼓励的一种方式。',
    section2Body2: '如果你喜欢某个故事或章节，可以赠送 Gift，让作者知道他们的作品对你有意义。',
    section3Title: '3. 我可以用什么赠送 Gifts？',
    section3Body1: '在 Shadow 上，可以使用 Coins 或 Diamonds 赠送 Gifts。',
    section3Body2: 'Coins 适合简单的小额支持礼物。Diamonds 适合特别礼物或更强的支持。',
    section3Body3: '每种 Gift 的价值不同，你可以根据自己拥有的 Coins 或 Diamonds 选择喜欢的 Gift。',
    section4Title: '4. Gifts 有什么帮助？',
    section4Body1: 'Gifts 可以鼓励作者继续写作、创作新章节，并持续改进他们的故事。',
    section4Body2: 'Gift 不只是一个奖励图标，它也是读者送给作者的一条小小支持信息。',
    section5Title: '5. 如何赠送 Gift？',
    section5Body1: '你可以在阅读页面或章节末尾赠送 Gift。',
    section5Body2: '选择一个 Gift，选择数量，然后点击 Gift。',
    section6Title: '6. Gift 排名 / Top Fans',
    section6Body1: 'Gifts 可以帮助展示哪些故事或章节获得了读者的强力支持。',
    section6Body2: '赠送 Gifts 的读者也可能出现在 Top Fans 中，展示他们对喜爱的故事和作者的支持。',
    section7Title: '7. 重要提示',
    section7Body1: '请仅在你真心想支持作者时赠送 Gifts。',
    section7Body2: '阅读、点赞和发表评论也是支持作者的重要方式。',
    section8Title: '8. Shadow 保留所有权利。',
    section8Body1: '所有 Gift 规则和 Gift 功能均由 Shadow 管理。',
    section8Body2: 'Shadow 保留在必要时更新或调整 Gift 功能的权利。',
  },
  ja: {
    back: '戻る',
    title: 'Gift の送り方',
    section1Title: '1. Diamond Gift の100%が作者に届きます',
    section1Body1: 'Diamonds を使って Gift を送ると、Gift の価値の100%が作者に渡ります。',
    section1Body2: 'Shadow は Diamond Gifts から一切取り分を受け取りません。',
    section1Body3: 'Coins で送られた Gifts は応援とランキングのためだけに使われ、作者の収益にはなりません。',
    section2Title: '2. Gift とは？',
    section2Body1: 'Gift は、読者が好きな作者へ応援や励ましを伝える方法です。',
    section2Body2: 'ストーリーやエピソードを楽しんだら Gift を送り、その作品が自分にとって大切だと作者に伝えられます。',
    section3Title: '3. Gifts には何を使えますか？',
    section3Body1: 'Shadow では、Coins または Diamonds を使って Gifts を送れます。',
    section3Body2: 'Coins は気軽な小さな応援 Gift に、Diamonds は特別な Gift やより強い応援に使います。',
    section3Body3: 'Gift ごとに価値が異なるため、持っている Coins や Diamonds に合わせて好きな Gift を選べます。',
    section4Title: '4. Gifts はどのように役立ちますか？',
    section4Body1: 'Gifts は、作者が執筆を続け、新しいエピソードを作り、ストーリーをさらに良くしていく励みになります。',
    section4Body2: 'Gift は単なる報酬アイコンではありません。読者から作者へ送る小さな応援メッセージです。',
    section5Title: '5. Gift はどう送りますか？',
    section5Body1: '読書ページまたはエピソードの最後から Gift を送れます。',
    section5Body2: 'Gift を選び、数量を選んでから Gift をタップします。',
    section6Title: '6. Gift ランキング / Top Fans',
    section6Body1: 'Gifts により、どのストーリーやエピソードが読者から強く支持されているかを示せます。',
    section6Body2: 'Gifts を送った読者は Top Fans に表示され、好きなストーリーや作者への応援を示すことがあります。',
    section7Title: '7. 重要なお知らせ',
    section7Body1: '本当に作者を応援したいときだけ Gifts を送ってください。',
    section7Body2: '読むこと、いいねすること、コメントを書くことも、作者を支える大切な方法です。',
    section8Title: '8. すべての権利は Shadow が保有します。',
    section8Body1: 'すべての Gift ルールと Gift 機能は Shadow が管理します。',
    section8Body2: 'Shadow は必要に応じて Gift 機能を更新または調整する権利を有します。',
  },
  ko: {
    back: '뒤로',
    title: 'Gift 보내는 방법',
    section1Title: '1. Diamond Gift의 100%가 작가에게 전달됩니다',
    section1Body1: 'Diamonds로 Gift를 보내면 Gift 가치의 100%가 작가에게 전달됩니다.',
    section1Body2: 'Shadow는 Diamond Gifts에서 어떠한 몫도 가져가지 않습니다.',
    section1Body3: 'Coins로 보낸 Gifts는 응원과 랭킹용이며 작가의 수익으로 이어지지 않습니다.',
    section2Title: '2. Gift란 무엇인가요?',
    section2Body1: 'Gift는 독자가 좋아하는 작가에게 응원과 격려를 표현하는 방법입니다.',
    section2Body2: '스토리나 에피소드가 마음에 들었다면 Gift를 보내 작품이 자신에게 의미 있다는 것을 작가에게 전할 수 있습니다.',
    section3Title: '3. Gifts를 보낼 때 무엇을 사용할 수 있나요?',
    section3Body1: 'Shadow에서는 Coins 또는 Diamonds를 사용해 Gifts를 보낼 수 있습니다.',
    section3Body2: 'Coins는 간단하고 작은 응원 Gift에 사용합니다. Diamonds는 특별한 Gift나 더 큰 응원에 사용합니다.',
    section3Body3: '각 Gift의 가치가 다르므로 보유한 Coins 또는 Diamonds에 맞춰 원하는 Gift를 선택할 수 있습니다.',
    section4Title: '4. Gifts는 어떤 도움이 되나요?',
    section4Body1: 'Gifts는 작가가 계속 글을 쓰고 새 에피소드를 만들며 스토리를 더 발전시키도록 격려합니다.',
    section4Body2: 'Gift는 단순한 보상 아이콘이 아닙니다. 독자가 작가에게 보내는 작은 응원 메시지입니다.',
    section5Title: '5. Gift는 어떻게 보내나요?',
    section5Body1: '읽기 페이지 또는 에피소드 마지막에서 Gift를 보낼 수 있습니다.',
    section5Body2: 'Gift를 선택하고 수량을 고른 다음 Gift를 누르세요.',
    section6Title: '6. Gift 랭킹 / Top Fans',
    section6Body1: 'Gifts는 어떤 스토리나 에피소드가 독자에게 큰 지지를 받고 있는지 보여주는 데 도움이 됩니다.',
    section6Body2: 'Gifts를 보낸 독자는 Top Fans에 표시되어 좋아하는 스토리와 작가에 대한 응원을 보여줄 수도 있습니다.',
    section7Title: '7. 중요 안내',
    section7Body1: '정말로 작가를 응원하고 싶을 때만 Gifts를 보내 주세요.',
    section7Body2: '읽기, 좋아요, 댓글 작성 역시 작가를 응원하는 의미 있는 방법입니다.',
    section8Title: '8. 모든 권리는 Shadow에 있습니다.',
    section8Body1: '모든 Gift 규칙과 Gift 기능은 Shadow에서 관리합니다.',
    section8Body2: 'Shadow는 필요한 경우 Gift 기능을 업데이트하거나 조정할 권리를 보유합니다.',
  },
})

const GUIDE_SECTIONS = [
  {
    titleKey: 'section1Title',
    bodyKeys: ['section1Body1', 'section1Body2', 'section1Body3'],
  },
  {
    titleKey: 'section2Title',
    bodyKeys: ['section2Body1', 'section2Body2'],
  },
  {
    titleKey: 'section3Title',
    bodyKeys: ['section3Body1', 'section3Body2', 'section3Body3'],
  },
  {
    titleKey: 'section4Title',
    bodyKeys: ['section4Body1', 'section4Body2'],
  },
  {
    titleKey: 'section5Title',
    bodyKeys: ['section5Body1', 'section5Body2'],
  },
  {
    titleKey: 'section6Title',
    bodyKeys: ['section6Body1', 'section6Body2'],
  },
  {
    titleKey: 'section7Title',
    bodyKeys: ['section7Body1', 'section7Body2'],
  },
  {
    titleKey: 'section8Title',
    bodyKeys: ['section8Body1', 'section8Body2'],
  },
]

export default function GiftGuidePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <main className="min-h-screen bg-white pb-8 text-[#111827]">
      <header className="sticky top-0 z-20 border-b border-[#eef1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[620px] items-center px-4">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label={t('giftGuidePage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <h1 className="min-w-0 flex-1 pr-10 text-center text-[18px] font-bold text-[#111827]">
            {t('giftGuidePage.title')}
          </h1>
        </div>
      </header>

      <section className="mx-auto max-w-[620px] px-5 py-5">
        <div className="space-y-7">
          {GUIDE_SECTIONS.map((section) => (
            <article key={section.titleKey}>
              <h2 className="text-[16px] font-bold leading-6 text-[#111827]">
                {t(`giftGuidePage.${section.titleKey}`)}
              </h2>

              <div className="mt-2 space-y-2 text-[15px] font-normal leading-7 text-[#111827]">
                {section.bodyKeys.map((bodyKey) => (
                  <p key={bodyKey}>
                    {t(`giftGuidePage.${bodyKey}`)}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
