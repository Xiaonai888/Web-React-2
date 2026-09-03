import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyTitleGuide', {
  en: {
    goBack: 'Go back', pageTitle: 'How to Choose a Great Story Title', introTitle: 'A strong title makes the right reader curious.', introBody: 'Your title does not need to explain everything. It only needs to capture the story’s feeling and invite readers to open it.', tip1Title: 'Make It Easy to Remember', tip1Body: 'Choose a title that is short, clear, and easy to say. Readers should remember it after seeing it once.', tip2Title: 'Reflect the Heart of Your Story', tip2Body: 'Think about the main emotion, conflict, relationship, mystery, or journey. Let the title hint at what makes the story special.', tip3Title: 'Create Curiosity', tip3Body: 'Use an interesting phrase, secret, promise, question, or contrast. Give readers a reason to wonder without revealing the whole story.', tip4Title: 'Match the Story’s Mood', tip4Body: 'Romance can sound soft or emotional. Thrillers can feel tense or mysterious. Fantasy titles can feel magical, ancient, or adventurous.', tip5Title: 'Use a Meaningful Detail', tip5Body: 'Build the title around an important object, place, memory, nickname, promise, season, or sentence from the story.', tip6Title: 'Keep It Focused', tip6Body: 'Two to seven words is often enough. Longer titles can work, but they should still be easy to read and recognize.', formulasTitle: 'Title Idea Formulas', formula1: 'Emotion + Object: The Last Letter', formula2: 'Place + Secret: Secrets of the Moonlit House', formula3: 'Character + Conflict: The Queen Who Refused the Crown', formula4: 'Promise + Consequence: Before We Say Goodbye', formula5: 'Time + Memory: The Summer We Forgot', beforeDecide: 'Before You Decide', check1: 'Does the title fit the story?', check2: 'Is it easy to understand and remember?', check3: 'Does it create curiosity?', check4: 'Does it sound different from common titles?'
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ', pageTitle: 'របៀបជ្រើសរើសចំណងជើងរឿងឱ្យល្អ', introTitle: 'ចំណងជើងល្អធ្វើឱ្យអ្នកអានត្រឹមត្រូវចង់ដឹង។', introBody: 'ចំណងជើងមិនចាំបាច់ពន្យល់គ្រប់យ៉ាងទេ។ វាគ្រាន់តែត្រូវបង្ហាញអារម្មណ៍រឿង និងអញ្ជើញអ្នកអានឱ្យបើកអាន។', tip1Title: 'ធ្វើឱ្យងាយចងចាំ', tip1Body: 'ជ្រើសរើសចំណងជើងខ្លី ច្បាស់ និងងាយនិយាយ។ អ្នកអានគួរចងចាំវាបានបន្ទាប់ពីឃើញម្តង។', tip2Title: 'បង្ហាញបេះដូងនៃរឿង', tip2Body: 'គិតពីអារម្មណ៍សំខាន់ ជម្លោះ ទំនាក់ទំនង អាថ៌កំបាំង ឬដំណើរ។ ឱ្យចំណងជើងបង្ហាញបន្តិចពីអ្វីដែលធ្វើឱ្យរឿងពិសេស។', tip3Title: 'បង្កើតការចង់ដឹង', tip3Body: 'ប្រើឃ្លាគួរឱ្យចាប់អារម្មណ៍ អាថ៌កំបាំង សន្យា សំណួរ ឬភាពផ្ទុយគ្នា។ ធ្វើឱ្យអ្នកអានចង់ដឹង ដោយមិនបង្ហាញរឿងទាំងមូល។', tip4Title: 'ឱ្យសមនឹងអារម្មណ៍រឿង', tip4Body: 'រឿងស្នេហាអាចទន់ភ្លន់ ឬមានអារម្មណ៍។ Thriller អាចតានតឹង ឬអាថ៌កំបាំង។ Fantasy អាចមានអារម្មណ៍វេទមន្ត បុរាណ ឬផ្សងព្រេង។', tip5Title: 'ប្រើព័ត៌មានលម្អិតដែលមានន័យ', tip5Body: 'បង្កើតចំណងជើងពីវត្ថុ ទីកន្លែង អនុស្សាវរីយ៍ ឈ្មោះហៅក្រៅ សន្យា រដូវ ឬប្រយោគសំខាន់ក្នុងរឿង។', tip6Title: 'រក្សាឱ្យចំចំណុច', tip6Body: 'ពីរ ដល់ប្រាំពីរពាក្យជាញឹកញាប់គ្រប់គ្រាន់។ ចំណងជើងវែងក៏អាចប្រើបាន ប៉ុន្តែត្រូវងាយអាន និងស្គាល់។', formulasTitle: 'រូបមន្តគំនិតចំណងជើង', formula1: 'អារម្មណ៍ + វត្ថុ៖ សំបុត្រចុងក្រោយ', formula2: 'ទីកន្លែង + អាថ៌កំបាំង៖ អាថ៌កំបាំងនៃផ្ទះក្រោមពន្លឺព្រះចន្ទ', formula3: 'តួអង្គ + ជម្លោះ៖ មហាក្សត្រីដែលបដិសេធមកុដ', formula4: 'សន្យា + ផលវិបាក៖ មុនពេលយើងនិយាយលា', formula5: 'ពេលវេលា + អនុស្សាវរីយ៍៖ រដូវក្តៅដែលយើងភ្លេច', beforeDecide: 'មុនពេលសម្រេចចិត្ត', check1: 'តើចំណងជើងសមនឹងរឿងទេ?', check2: 'តើវាងាយយល់ និងងាយចងចាំទេ?', check3: 'តើវាបង្កើតការចង់ដឹងទេ?', check4: 'តើវាស្តាប់ទៅខុសពីចំណងជើងទូទៅទេ?'
  },
  zh: {
    goBack: '返回', pageTitle: '如何选择一个好故事标题', introTitle: '好标题会让合适的读者产生好奇。', introBody: '标题不需要解释一切，只需传达故事的感觉，并邀请读者点开阅读。', tip1Title: '容易记住', tip1Body: '选择简短、清楚、好读的标题。读者看过一次后就应该能记住。', tip2Title: '体现故事核心', tip2Body: '思考主要情感、冲突、关系、谜团或旅程，让标题暗示故事最特别的地方。', tip3Title: '制造好奇', tip3Body: '使用有趣的短语、秘密、承诺、问题或反差，让读者想知道更多，同时不要剧透全部内容。', tip4Title: '符合故事氛围', tip4Body: '爱情故事可以柔和或感性，惊悚故事可以紧张或神秘，奇幻标题可以魔幻、古老或充满冒险感。', tip5Title: '使用有意义的细节', tip5Body: '围绕重要物件、地点、回忆、昵称、承诺、季节或故事中的一句话来构思标题。', tip6Title: '保持聚焦', tip6Body: '两到七个词通常已经足够。更长的标题也可以，但仍应容易阅读和辨认。', formulasTitle: '标题创意公式', formula1: '情感 + 物件：最后一封信', formula2: '地点 + 秘密：月光之屋的秘密', formula3: '角色 + 冲突：拒绝王冠的女王', formula4: '承诺 + 后果：在我们说再见之前', formula5: '时间 + 回忆：被我们遗忘的夏天', beforeDecide: '决定之前', check1: '标题符合故事吗？', check2: '容易理解和记住吗？', check3: '能制造好奇吗？', check4: '听起来与常见标题不同吗？'
  },
  ja: {
    goBack: '戻る', pageTitle: '魅力的な作品タイトルの決め方', introTitle: '強いタイトルは、合う読者の好奇心を引き出します。', introBody: 'タイトルですべてを説明する必要はありません。作品の雰囲気を伝え、読者が開きたくなるようにすれば十分です。', tip1Title: '覚えやすくする', tip1Body: '短く、明確で、言いやすいタイトルを選びましょう。一度見ただけで覚えられるのが理想です。', tip2Title: '物語の核心を映す', tip2Body: '中心となる感情、対立、関係、謎、旅を考え、作品の特別な部分をタイトルで少し示しましょう。', tip3Title: '好奇心を生む', tip3Body: '面白いフレーズ、秘密、約束、質問、対比を使い、すべてを明かさずに続きを知りたくさせましょう。', tip4Title: '作品の雰囲気に合わせる', tip4Body: '恋愛なら柔らかく感情的に、スリラーなら緊張感や謎を、ファンタジーなら魔法的・古代的・冒険的な響きを持たせられます。', tip5Title: '意味のある細部を使う', tip5Body: '重要な物、場所、記憶、愛称、約束、季節、作品中の一文を中心にタイトルを作りましょう。', tip6Title: '焦点を絞る', tip6Body: '2〜7語で十分なことが多いです。長いタイトルでも、読みやすく認識しやすいものにしましょう。', formulasTitle: 'タイトル案の公式', formula1: '感情 + 物：最後の手紙', formula2: '場所 + 秘密：月明かりの家の秘密', formula3: '人物 + 対立：王冠を拒んだ女王', formula4: '約束 + 結末：さよならを言う前に', formula5: '時間 + 記憶：忘れた夏', beforeDecide: '決める前に', check1: 'タイトルは物語に合っていますか？', check2: '理解しやすく覚えやすいですか？', check3: '好奇心を生みますか？', check4: 'よくあるタイトルと違って聞こえますか？'
  },
  ko: {
    goBack: '뒤로', pageTitle: '좋은 작품 제목을 고르는 방법', introTitle: '좋은 제목은 알맞은 독자의 호기심을 끕니다.', introBody: '제목이 모든 것을 설명할 필요는 없습니다. 작품의 느낌을 담고 독자가 열어 보고 싶게 만들면 됩니다.', tip1Title: '기억하기 쉽게', tip1Body: '짧고 명확하며 말하기 쉬운 제목을 고르세요. 독자가 한 번 보고도 기억할 수 있어야 합니다.', tip2Title: '이야기의 핵심 담기', tip2Body: '주요 감정, 갈등, 관계, 미스터리, 여정을 생각하고 작품의 특별함을 제목에 살짝 담아 보세요.', tip3Title: '호기심 만들기', tip3Body: '흥미로운 문구, 비밀, 약속, 질문, 대비를 사용해 전체 내용을 밝히지 않으면서 궁금증을 유도하세요.', tip4Title: '작품 분위기에 맞추기', tip4Body: '로맨스는 부드럽거나 감성적으로, 스릴러는 긴장감이나 미스터리하게, 판타지는 마법적·고대적·모험적인 느낌을 줄 수 있습니다.', tip5Title: '의미 있는 디테일 사용', tip5Body: '중요한 물건, 장소, 기억, 별명, 약속, 계절, 작품 속 문장을 중심으로 제목을 만들어 보세요.', tip6Title: '핵심에 집중하기', tip6Body: '두 단어에서 일곱 단어 정도면 충분한 경우가 많습니다. 긴 제목도 가능하지만 읽고 알아보기 쉬워야 합니다.', formulasTitle: '제목 아이디어 공식', formula1: '감정 + 사물: 마지막 편지', formula2: '장소 + 비밀: 달빛 집의 비밀', formula3: '인물 + 갈등: 왕관을 거부한 여왕', formula4: '약속 + 결과: 우리가 작별하기 전에', formula5: '시간 + 기억: 우리가 잊은 여름', beforeDecide: '결정하기 전에', check1: '제목이 작품과 잘 맞나요?', check2: '이해하고 기억하기 쉬운가요?', check3: '호기심을 만드나요?', check4: '흔한 제목과 다르게 들리나요?'
  },
})

const titleTips = [
  ['tip1Title', 'tip1Body'],
  ['tip2Title', 'tip2Body'],
  ['tip3Title', 'tip3Body'],
  ['tip4Title', 'tip4Body'],
  ['tip5Title', 'tip5Body'],
  ['tip6Title', 'tip6Body'],
]

const titleFormulas = ['formula1', 'formula2', 'formula3', 'formula4', 'formula5']

export default function StoryTitleGuidePage() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-12">
      <header className="sticky top-0 z-20 bg-[var(--shadow-bg-surface)] px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('storyTitleGuide.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-bold text-[var(--shadow-text-primary)]">
            {t('storyTitleGuide.pageTitle')}
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <section className="rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <div className="text-[18px] font-bold leading-7 text-[var(--shadow-text-primary)]">
            {t('storyTitleGuide.introTitle')}
          </div>
          <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
            {t('storyTitleGuide.introBody')}
          </p>
        </section>

        <section className="mt-4 space-y-3">
          {titleTips.map(([titleKey, bodyKey], index) => (
            <article key={titleKey} className="rounded-[12px] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2eeff] text-[12px] font-bold text-[#6f5bc7]">
                  {index + 1}
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t(`storyTitleGuide.${titleKey}`)}</h2>
                  <p className="mt-1 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">{t(`storyTitleGuide.${bodyKey}`)}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyTitleGuide.formulasTitle')}</h2>
          <div className="mt-3 space-y-2">
            {titleFormulas.map((formulaKey) => (
              <div key={formulaKey} className="rounded-[10px] bg-[var(--shadow-bg-soft)] px-3 py-3 text-[13px] leading-5 text-[var(--shadow-text-secondary)]">
                {t(`storyTitleGuide.${formulaKey}`)}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-[12px] bg-[var(--shadow-bg-surface)] p-5 shadow-sm">
          <h2 className="text-[14px] font-bold text-[var(--shadow-text-primary)]">{t('storyTitleGuide.beforeDecide')}</h2>
          <div className="mt-3 space-y-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
            <p>{t('storyTitleGuide.check1')}</p>
            <p>{t('storyTitleGuide.check2')}</p>
            <p>{t('storyTitleGuide.check3')}</p>
            <p>{t('storyTitleGuide.check4')}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
