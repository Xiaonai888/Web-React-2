import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyDescriptionGuide', {
  "en": {
    "goBack": "Go back",
    "title": "How to Write a Great Story Description",
    "heroTitle": "Give readers a reason to open your story.",
    "heroBody": "A strong description does not explain everything. It introduces the heart of the story, creates curiosity, and promises the kind of experience waiting inside.",
    "step1Title": "Begin with an Interesting Hook",
    "step1Body": "Start with a sentence that creates emotion, mystery, tension, or curiosity. Give readers an immediate reason to keep reading.",
    "step2Title": "Introduce the Main Character",
    "step2Body": "Show who the story follows, what they want, what they fear, and what is about to change their life. Keep the focus on the main character.",
    "step3Title": "Show the Main Conflict",
    "step3Body": "Explain the biggest problem standing between the character and their goal. Give enough information to understand the struggle without revealing the solution.",
    "step4Title": "Make the Stakes Clear",
    "step4Body": "Help readers understand what the character could lose. The stakes may involve love, family, freedom, identity, safety, reputation, or an important dream.",
    "step5Title": "Match the Story’s Mood",
    "step5Body": "Use words that feel like the story. Romance can sound emotional, thrillers can feel tense, fantasy can feel magical, and comedy can sound playful.",
    "step6Title": "End with Curiosity",
    "step6Body": "Finish with a difficult choice, hidden truth, uncertain future, or unanswered question that makes readers want to open the first episode.",
    "formulaTitle": "A Simple Description Formula",
    "formula": "Hook + Main character and goal + Central conflict + Stakes or an unanswered question",
    "exampleTitle": "Example",
    "exampleBody": "After losing everything in one night, Mira returns to the city she swore she would never see again. Her only goal is to uncover the truth behind her brother’s disappearance, but every clue leads back to Adrian—the man who once broke her heart. As old feelings return and dangerous secrets begin to surface, Mira must decide whether trusting him will bring her closer to the truth or destroy her all over again.",
    "mistakesTitle": "Avoid These Common Mistakes",
    "mistake1": "Listing every event in the story",
    "mistake2": "Introducing too many characters",
    "mistake3": "Revealing the ending or major twists",
    "mistake4": "Using only vague words such as interesting or exciting",
    "mistake5": "Writing so much that the main idea becomes unclear",
    "beforeSave": "Before You Save",
    "check1": "Does the first sentence create curiosity?",
    "check2": "Is the main character clear?",
    "check3": "Is the central conflict easy to understand?",
    "check4": "Are the stakes meaningful?",
    "check5": "Does the description match the story’s mood?",
    "check6": "Did you avoid important spoilers?",
    "finalTip": "Final Tip",
    "finalTipBody": "A good description is not a full summary. It is a promise of the emotion, conflict, and experience waiting inside the story."
  },
  "km": {
    "goBack": "ត្រឡប់ក្រោយ",
    "title": "របៀបសរសេរការពិពណ៌នារឿងឱ្យល្អ",
    "heroTitle": "ផ្តល់ហេតុផលឱ្យអ្នកអានចង់បើករឿងរបស់អ្នក។",
    "heroBody": "ការពិពណ៌នាល្អមិនចាំបាច់ពន្យល់គ្រប់យ៉ាងទេ។ វាគួរណែនាំបេះដូងនៃរឿង បង្កើតការចង់ដឹង និងបង្ហាញអារម្មណ៍ដែលអ្នកអាននឹងទទួលបាន។",
    "step1Title": "ចាប់ផ្តើមដោយ Hook ដែលគួរឱ្យចាប់អារម្មណ៍",
    "step1Body": "ចាប់ផ្តើមដោយប្រយោគដែលបង្កើតអារម្មណ៍ អាថ៌កំបាំង ភាពតានតឹង ឬការចង់ដឹង ដើម្បីឱ្យអ្នកអានចង់បន្តអានភ្លាមៗ។",
    "step2Title": "ណែនាំតួអង្គសំខាន់",
    "step2Body": "បង្ហាញថារឿងតាមដានអ្នកណា ពួកគេចង់បានអ្វី ខ្លាចអ្វី និងអ្វីកំពុងផ្លាស់ប្តូរជីវិតរបស់ពួកគេ។ រក្សាការផ្តោតលើតួអង្គសំខាន់។",
    "step3Title": "បង្ហាញជម្លោះសំខាន់",
    "step3Body": "ពន្យល់បញ្ហាធំបំផុតដែលរារាំងតួអង្គពីគោលដៅ។ ផ្តល់ព័ត៌មានគ្រប់គ្រាន់ឱ្យយល់ពីការតស៊ូ ដោយមិនបង្ហាញដំណោះស្រាយ។",
    "step4Title": "ធ្វើឱ្យផលប៉ះពាល់ច្បាស់",
    "step4Body": "ជួយអ្នកអានយល់ថាតួអង្គអាចបាត់បង់អ្វី ដូចជា ស្នេហា គ្រួសារ សេរីភាព អត្តសញ្ញាណ សុវត្ថិភាព កេរ្តិ៍ឈ្មោះ ឬក្តីសុបិនសំខាន់។",
    "step5Title": "ឱ្យសមនឹងអារម្មណ៍រឿង",
    "step5Body": "ប្រើពាក្យដែលមានអារម្មណ៍ដូចរឿង។ Romance អាចទន់ភ្លន់ Thriller អាចតានតឹង Fantasy អាចវេទមន្ត ហើយ Comedy អាចលេងសើច។",
    "step6Title": "បញ្ចប់ដោយការចង់ដឹង",
    "step6Body": "បញ្ចប់ដោយជម្រើសពិបាក ការពិតលាក់ អនាគតមិនច្បាស់ ឬសំណួរមិនទាន់មានចម្លើយ ដែលធ្វើឱ្យអ្នកអានចង់បើកភាគទី១។",
    "formulaTitle": "រូបមន្តសាមញ្ញសម្រាប់ការពិពណ៌នា",
    "formula": "Hook + តួអង្គសំខាន់ និងគោលដៅ + ជម្លោះសំខាន់ + ផលប៉ះពាល់ ឬសំណួរមិនទាន់មានចម្លើយ",
    "exampleTitle": "ឧទាហរណ៍",
    "exampleBody": "បន្ទាប់ពីបាត់បង់អ្វីៗទាំងអស់ក្នុងយប់តែមួយ Mira ត្រឡប់ទៅទីក្រុងដែលនាងធ្លាប់ស្បថថានឹងមិនត្រឡប់ទៅវិញ។ គោលដៅតែមួយរបស់នាងគឺស្វែងរកការពិតអំពីការបាត់ខ្លួនរបស់ប្អូនប្រុស ប៉ុន្តែតម្រុយគ្រប់យ៉ាងនាំទៅកាន់ Adrian—បុរសដែលធ្លាប់ធ្វើឱ្យបេះដូងនាងបែកបាក់។ ពេលអារម្មណ៍ចាស់ត្រឡប់មកវិញ និងអាថ៌កំបាំងគ្រោះថ្នាក់ចាប់ផ្តើមលេចឡើង Mira ត្រូវសម្រេចថាការជឿទុកចិត្តលើគេនឹងនាំនាងទៅជិតការពិត ឬបំផ្លាញនាងម្តងទៀត។",
    "mistakesTitle": "ជៀសវាងកំហុសទូទៅទាំងនេះ",
    "mistake1": "រាយព្រឹត្តិការណ៍គ្រប់យ៉ាងក្នុងរឿង",
    "mistake2": "ណែនាំតួអង្គច្រើនពេក",
    "mistake3": "បង្ហាញចុងបញ្ចប់ ឬ plot twist សំខាន់",
    "mistake4": "ប្រើតែពាក្យទូទៅដូចជា គួរឱ្យចាប់អារម្មណ៍ ឬរំភើប",
    "mistake5": "សរសេរច្រើនពេករហូតគំនិតសំខាន់មិនច្បាស់",
    "beforeSave": "មុនពេលរក្សាទុក",
    "check1": "តើប្រយោគដំបូងបង្កើតការចង់ដឹងទេ?",
    "check2": "តើតួអង្គសំខាន់ច្បាស់ទេ?",
    "check3": "តើជម្លោះកណ្តាលងាយយល់ទេ?",
    "check4": "តើផលប៉ះពាល់មានន័យទេ?",
    "check5": "តើការពិពណ៌នាសមនឹងអារម្មណ៍រឿងទេ?",
    "check6": "តើអ្នកបានជៀសវាង spoiler សំខាន់ៗទេ?",
    "finalTip": "គន្លឹះចុងក្រោយ",
    "finalTipBody": "ការពិពណ៌នាល្អមិនមែនជាសេចក្តីសង្ខេបពេញលេញទេ។ វាជាការសន្យាអំពីអារម្មណ៍ ជម្លោះ និងបទពិសោធន៍ដែលកំពុងរង់ចាំនៅក្នុងរឿង។"
  },
  "zh": {
    "goBack": "返回",
    "title": "如何写出优秀的故事简介",
    "heroTitle": "给读者一个打开故事的理由。",
    "heroBody": "好的简介不需要解释一切。它只需呈现故事核心、激发好奇心，并让读者感受到故事将带来的体验。",
    "step1Title": "用有吸引力的开头抓住读者",
    "step1Body": "用能带来情绪、悬念、紧张感或好奇心的句子开场，让读者立刻有继续阅读的理由。",
    "step2Title": "介绍主角",
    "step2Body": "说明故事围绕谁展开、他们想要什么、害怕什么，以及什么即将改变他们的生活。把重点放在主角身上。",
    "step3Title": "展示主要冲突",
    "step3Body": "说明阻碍主角实现目标的最大问题。提供足够信息让读者理解冲突，但不要透露解决方式。",
    "step4Title": "明确代价与风险",
    "step4Body": "让读者知道主角可能失去什么，例如爱情、家庭、自由、身份、安全、名誉或重要梦想。",
    "step5Title": "符合故事氛围",
    "step5Body": "使用与故事气质相符的词语。爱情可以温柔或感性，惊悚可以紧张，奇幻可以充满魔法，喜剧可以轻快。",
    "step6Title": "以好奇心收尾",
    "step6Body": "用艰难选择、隐藏真相、不确定的未来或未解问题结尾，让读者想打开第一章。",
    "formulaTitle": "简单的简介公式",
    "formula": "吸引人的开头 + 主角与目标 + 核心冲突 + 风险或未解问题",
    "exampleTitle": "示例",
    "exampleBody": "在一夜之间失去一切后，Mira 回到了她发誓再也不会踏足的城市。她唯一的目标是查明弟弟失踪的真相，但所有线索都指向 Adrian——那个曾让她心碎的男人。随着旧日情感重新涌现，危险的秘密逐渐浮出水面，Mira 必须决定：相信他会让她更接近真相，还是再次毁掉自己。",
    "mistakesTitle": "避免这些常见错误",
    "mistake1": "罗列故事中的每一个事件",
    "mistake2": "一次介绍太多角色",
    "mistake3": "提前透露结局或重大反转",
    "mistake4": "只使用“有趣”“刺激”等模糊词语",
    "mistake5": "写得太多导致核心内容不清晰",
    "beforeSave": "保存前检查",
    "check1": "第一句话是否能激发好奇心？",
    "check2": "主角是否清晰？",
    "check3": "核心冲突是否容易理解？",
    "check4": "风险是否有意义？",
    "check5": "简介是否符合故事氛围？",
    "check6": "是否避免了重要剧透？",
    "finalTip": "最后提示",
    "finalTipBody": "好的简介不是完整摘要，而是对故事中情绪、冲突与体验的一种承诺。"
  },
  "ja": {
    "goBack": "戻る",
    "title": "魅力的なストーリー紹介文の書き方",
    "heroTitle": "読者が作品を開きたくなる理由を作りましょう。",
    "heroBody": "良い紹介文はすべてを説明する必要はありません。物語の核を示し、好奇心を生み、作品の中で待つ体験を予感させます。",
    "step1Title": "興味を引くフックから始める",
    "step1Body": "感情、謎、緊張感、好奇心を生む一文から始め、続きを読みたくなる理由をすぐに与えます。",
    "step2Title": "主人公を紹介する",
    "step2Body": "誰の物語なのか、何を望み、何を恐れ、何が人生を変えようとしているのかを示します。主人公に焦点を保ちます。",
    "step3Title": "主な対立を示す",
    "step3Body": "主人公と目標の間にある最大の問題を説明します。解決策を明かさず、葛藤が理解できる情報を与えます。",
    "step4Title": "失うものを明確にする",
    "step4Body": "愛、家族、自由、アイデンティティ、安全、評判、大切な夢など、主人公が失う可能性のあるものを伝えます。",
    "step5Title": "物語の雰囲気に合わせる",
    "step5Body": "作品の雰囲気に合う言葉を使います。恋愛は感情的に、スリラーは緊張感を、ファンタジーは魔法らしさを、コメディは軽快さを出せます。",
    "step6Title": "好奇心を残して終える",
    "step6Body": "難しい選択、隠された真実、不確かな未来、未解決の問いで締めくくり、第1話を開きたくなるようにします。",
    "formulaTitle": "シンプルな紹介文の公式",
    "formula": "フック + 主人公と目標 + 中心となる対立 + リスクまたは未解決の問い",
    "exampleTitle": "例",
    "exampleBody": "一夜ですべてを失った Mira は、二度と戻らないと誓った街へ帰ってくる。目的は弟の失踪の真相を突き止めること。しかし手がかりはすべて、かつて彼女の心を壊した Adrian へとつながっていた。古い感情が戻り、危険な秘密が浮かび上がる中、Mira は彼を信じることが真実へ近づく道なのか、それとも再び自分を壊すのかを選ばなければならない。",
    "mistakesTitle": "よくある間違いを避ける",
    "mistake1": "物語の出来事をすべて並べる",
    "mistake2": "登場人物を多く紹介しすぎる",
    "mistake3": "結末や大きな展開を明かす",
    "mistake4": "「面白い」「刺激的」など曖昧な言葉だけを使う",
    "mistake5": "書きすぎて主題が分かりにくくなる",
    "beforeSave": "保存前の確認",
    "check1": "最初の一文で好奇心を生み出せていますか？",
    "check2": "主人公は明確ですか？",
    "check3": "中心となる対立は理解しやすいですか？",
    "check4": "失うものに意味がありますか？",
    "check5": "紹介文は物語の雰囲気に合っていますか？",
    "check6": "重要なネタバレを避けていますか？",
    "finalTip": "最後のヒント",
    "finalTipBody": "良い紹介文は完全なあらすじではありません。物語の中で待つ感情、対立、体験への約束です。"
  },
  "ko": {
    "goBack": "뒤로",
    "title": "좋은 스토리 소개글을 쓰는 방법",
    "heroTitle": "독자가 스토리를 열어볼 이유를 만들어 주세요.",
    "heroBody": "좋은 소개글은 모든 것을 설명할 필요가 없습니다. 이야기의 핵심을 보여 주고 호기심을 만들며 작품 안에서 기다리는 경험을 기대하게 합니다.",
    "step1Title": "흥미로운 훅으로 시작하기",
    "step1Body": "감정, 미스터리, 긴장감 또는 호기심을 만드는 문장으로 시작해 독자가 바로 계속 읽고 싶게 만드세요.",
    "step2Title": "주인공 소개하기",
    "step2Body": "누구의 이야기인지, 무엇을 원하고 무엇을 두려워하며 어떤 일이 삶을 바꾸려 하는지 보여 주세요. 주인공에 집중하세요.",
    "step3Title": "핵심 갈등 보여 주기",
    "step3Body": "주인공과 목표 사이를 가로막는 가장 큰 문제를 설명하세요. 해결책은 밝히지 말고 갈등을 이해할 만큼만 정보를 주세요.",
    "step4Title": "잃을 수 있는 것을 분명히 하기",
    "step4Body": "사랑, 가족, 자유, 정체성, 안전, 평판 또는 중요한 꿈처럼 주인공이 잃을 수 있는 것이 무엇인지 알려 주세요.",
    "step5Title": "스토리 분위기에 맞추기",
    "step5Body": "작품의 분위기에 어울리는 단어를 사용하세요. 로맨스는 감성적으로, 스릴러는 긴장감 있게, 판타지는 마법처럼, 코미디는 유쾌하게 표현할 수 있습니다.",
    "step6Title": "호기심을 남기며 끝내기",
    "step6Body": "어려운 선택, 숨겨진 진실, 불확실한 미래 또는 풀리지 않은 질문으로 끝내 첫 에피소드를 열고 싶게 만드세요.",
    "formulaTitle": "간단한 소개글 공식",
    "formula": "훅 + 주인공과 목표 + 핵심 갈등 + 위험 또는 풀리지 않은 질문",
    "exampleTitle": "예시",
    "exampleBody": "하룻밤 사이 모든 것을 잃은 Mira는 다시는 돌아오지 않겠다고 맹세했던 도시로 돌아간다. 그녀의 유일한 목표는 남동생의 실종에 대한 진실을 찾는 것이지만 모든 단서는 한때 그녀의 마음을 아프게 한 Adrian을 가리킨다. 옛 감정이 되살아나고 위험한 비밀이 드러나기 시작하면서 Mira는 그를 믿는 것이 진실에 가까워지는 길인지, 아니면 자신을 다시 무너뜨리는 길인지 선택해야 한다.",
    "mistakesTitle": "이런 흔한 실수를 피하세요",
    "mistake1": "스토리의 모든 사건을 나열하기",
    "mistake2": "등장인물을 너무 많이 소개하기",
    "mistake3": "결말이나 큰 반전을 미리 밝히기",
    "mistake4": "“재미있는”, “흥미진진한” 같은 모호한 말만 쓰기",
    "mistake5": "너무 많이 써서 핵심이 흐려지기",
    "beforeSave": "저장 전 확인",
    "check1": "첫 문장이 호기심을 만드나요?",
    "check2": "주인공이 분명한가요?",
    "check3": "핵심 갈등을 쉽게 이해할 수 있나요?",
    "check4": "잃을 수 있는 것이 의미 있나요?",
    "check5": "소개글이 스토리 분위기에 맞나요?",
    "check6": "중요한 스포일러를 피했나요?",
    "finalTip": "마지막 팁",
    "finalTipBody": "좋은 소개글은 전체 줄거리가 아닙니다. 작품 안에서 기다리는 감정, 갈등, 경험에 대한 약속입니다."
  }
})


const writingSteps = [
  {
    titleKey: 'step1Title',
    bodyKey: 'step1Body',
  },
  {
    titleKey: 'step2Title',
    bodyKey: 'step2Body',
  },
  {
    titleKey: 'step3Title',
    bodyKey: 'step3Body',
  },
  {
    titleKey: 'step4Title',
    bodyKey: 'step4Body',
  },
  {
    titleKey: 'step5Title',
    bodyKey: 'step5Body',
  },
  {
    titleKey: 'step6Title',
    bodyKey: 'step6Body',
  },
]

const commonMistakes = [
  'mistake1',
  'mistake2',
  'mistake3',
  'mistake4',
  'mistake5',
]

const finalChecks = [
  'check1',
  'check2',
  'check3',
  'check4',
  'check5',
  'check6',
]

export default function StoryDescriptionGuidePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-12">
      <header className="sticky top-0 z-20 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('storyDescriptionGuide.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-bold text-[var(--shadow-text-primary)]">
            {t('storyDescriptionGuide.title')}
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <section className="rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[18px] font-bold leading-7 text-[var(--shadow-text-primary)]">
            {t('storyDescriptionGuide.heroTitle')}
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
            {t('storyDescriptionGuide.heroBody')}
          </p>
        </section>

        <section className="mt-4 space-y-3">
          {writingSteps.map((step, index) => (
            <article key={t(`storyDescriptionGuide.${step.titleKey}`)} className="rounded-[12px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2eeff] text-[12px] font-bold text-[#6f5bc7]">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t(`storyDescriptionGuide.${step.titleKey}`)}</h2>
                  <p className="mt-1 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{t(`storyDescriptionGuide.${step.bodyKey}`)}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyDescriptionGuide.formulaTitle')}</h2>
          <div className="mt-3 rounded-[10px] bg-[var(--shadow-bg-soft)] px-4 py-4 text-[13px] font-medium leading-6 text-[var(--shadow-text-secondary)]">
            {t('storyDescriptionGuide.formula')}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyDescriptionGuide.exampleTitle')}</h2>
          <p className="mt-3 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
            {t('storyDescriptionGuide.exampleBody')}
          </p>
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyDescriptionGuide.mistakesTitle')}</h2>
          <div className="mt-3 space-y-2">
            {commonMistakes.map((item) => (
              <div key={item} className="flex items-start gap-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
                <i className="fa-solid fa-xmark mt-[6px] text-[10px] text-[#e5484d]" />
                <span>{t(`storyDescriptionGuide.${item}`)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyDescriptionGuide.beforeSave')}</h2>
          <div className="mt-3 space-y-2">
            {finalChecks.map((item) => (
              <div key={item} className="flex items-start gap-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
                <i className="fa-solid fa-check mt-[6px] text-[10px] text-[#16803c]" />
                <span>{t(`storyDescriptionGuide.${item}`)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyDescriptionGuide.finalTip')}</h2>
          <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
            {t('storyDescriptionGuide.finalTipBody')}
          </p>
        </section>
      </main>
    </div>
  )
}
