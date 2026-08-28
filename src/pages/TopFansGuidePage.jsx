import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('topFansGuidePage', {
  en: {
    back: 'Go back',
    title: 'How Top Fans Works',
    guideTitle: 'Top Fans Guide',
    guideIntro: 'Learn how gifts and support points work for {{story}}.',
    thisStory: 'this story',
    section1Title: 'What are Top Fans?',
    section1Body: 'Top Fans is a ranking of readers who send gifts and give the most support to this story. Every gift adds Support Points to your ranking total.',
    section2Title: 'Support belongs to this story only',
    section2Body: 'Gifts and Support Points shown on this page count only for this story. They are not transferred to another story or to the author’s overall page.',
    section3Title: 'Weekly Ranking',
    section3Body1: 'Weekly Ranking counts Support Points earned during the current week. A new weekly ranking starts every Monday.',
    section3Body2: 'Your gift history remains saved even when the weekly ranking starts again.',
    section4Title: 'Overall Ranking',
    section4Body: 'Overall Ranking combines every Support Point a reader has earned for this story. It does not reset each week.',
    section5Title: 'Gift Points',
    section6Title: 'How points are calculated',
    formula: 'Support Points = Gift Points × Quantity',
    exampleCandy: 'Candy × 5 = 5 Support Points',
    exampleMagicPen: 'Magic Pen × 3 = 30 Support Points',
    exampleRocket: 'Rocket × 1 = 100 Support Points',
    section7Title: 'When two readers have the same score',
    section7Body: 'If two readers have the same number of Support Points, the reader who reached that score first will appear higher in the ranking.',
    note: 'Support Points are used for ranking only. They are not Coins or Diamonds and cannot be spent or exchanged.',
    rights: 'All rights reserved by Shadow.',
    point: '{{count}} point',
    points: '{{count}} points',
    candy: 'Candy',
    flower: 'Flower',
    coffee: 'Coffee',
    magicPen: 'Magic Pen',
    goldBook: 'Gold Book',
    shadowStar: 'Shadow Star',
    authorCrown: 'Author Crown',
    rocket: 'Rocket',
  },
  km: {
    back: 'ត្រឡប់ក្រោយ',
    title: 'របៀបដំណើរការ Top Fans',
    guideTitle: 'ការណែនាំ Top Fans',
    guideIntro: 'ស្វែងយល់ពីរបៀបដែល Gift និង Support Points ដំណើរការសម្រាប់ {{story}}។',
    thisStory: 'រឿងនេះ',
    section1Title: 'Top Fans គឺជាអ្វី?',
    section1Body: 'Top Fans គឺជាចំណាត់ថ្នាក់អ្នកអានដែលផ្ញើ Gift និងគាំទ្ររឿងនេះច្រើនជាងគេ។ Gift នីមួយៗនឹងបន្ថែម Support Points ទៅក្នុងពិន្ទុចំណាត់ថ្នាក់របស់អ្នក។',
    section2Title: 'ការគាំទ្រគិតសម្រាប់រឿងនេះតែប៉ុណ្ណោះ',
    section2Body: 'Gift និង Support Points ដែលបង្ហាញនៅទំព័រនេះ គិតសម្រាប់រឿងនេះតែប៉ុណ្ណោះ។ វាមិនត្រូវបានផ្ទេរទៅរឿងផ្សេង ឬទៅទំព័ររួមរបស់អ្នកនិពន្ធទេ។',
    section3Title: 'ចំណាត់ថ្នាក់ប្រចាំសប្តាហ៍',
    section3Body1: 'Weekly Ranking គិត Support Points ដែលទទួលបានក្នុងសប្តាហ៍បច្ចុប្បន្ន។ ចំណាត់ថ្នាក់ប្រចាំសប្តាហ៍ថ្មីចាប់ផ្តើមរៀងរាល់ថ្ងៃចន្ទ។',
    section3Body2: 'ប្រវត្តិ Gift របស់អ្នកនៅតែរក្សាទុក ទោះបីចំណាត់ថ្នាក់ប្រចាំសប្តាហ៍ចាប់ផ្តើមឡើងវិញក៏ដោយ។',
    section4Title: 'ចំណាត់ថ្នាក់សរុប',
    section4Body: 'Overall Ranking បូក Support Points ទាំងអស់ដែលអ្នកអានទទួលបានសម្រាប់រឿងនេះ។ វាមិន Reset រៀងរាល់សប្តាហ៍ទេ។',
    section5Title: 'ពិន្ទុ Gift',
    section6Title: 'របៀបគណនាពិន្ទុ',
    formula: 'Support Points = Gift Points × ចំនួន',
    exampleCandy: 'Candy × 5 = 5 Support Points',
    exampleMagicPen: 'Magic Pen × 3 = 30 Support Points',
    exampleRocket: 'Rocket × 1 = 100 Support Points',
    section7Title: 'ពេលអ្នកអានពីរនាក់មានពិន្ទុស្មើគ្នា',
    section7Body: 'បើអ្នកអានពីរនាក់មាន Support Points ស្មើគ្នា អ្នកដែលឈានដល់ពិន្ទុនោះមុន នឹងបង្ហាញនៅលំដាប់ខ្ពស់ជាង។',
    note: 'Support Points ប្រើសម្រាប់ចំណាត់ថ្នាក់តែប៉ុណ្ណោះ។ វាមិនមែនជា Coins ឬ Diamonds ហើយមិនអាចចំណាយ ឬប្តូរបានទេ។',
    rights: 'រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ Shadow។',
    point: '{{count}} ពិន្ទុ',
    points: '{{count}} ពិន្ទុ',
    candy: 'ស្ករគ្រាប់',
    flower: 'ផ្កា',
    coffee: 'កាហ្វេ',
    magicPen: 'ប៊ិចវេទមន្ត',
    goldBook: 'សៀវភៅមាស',
    shadowStar: 'ផ្កាយ Shadow',
    authorCrown: 'មកុដអ្នកនិពន្ធ',
    rocket: 'រ៉ុក្កែត',
  },
  zh: {
    back: '返回',
    title: 'Top Fans 如何运作',
    guideTitle: 'Top Fans 指南',
    guideIntro: '了解 Gifts 和 Support Points 如何用于 {{story}}。',
    thisStory: '这个故事',
    section1Title: '什么是 Top Fans？',
    section1Body: 'Top Fans 是向这个故事赠送 Gifts 并提供最多支持的读者排名。每份 Gift 都会增加你的 Support Points 排名总分。',
    section2Title: '支持仅属于这个故事',
    section2Body: '本页显示的 Gifts 和 Support Points 只计算在这个故事中，不会转移到其他故事或作者的总主页。',
    section3Title: '每周排名',
    section3Body1: 'Weekly Ranking 统计本周获得的 Support Points。新的每周排名会在每周一开始。',
    section3Body2: '即使每周排名重新开始，你的 Gift 历史仍会保留。',
    section4Title: '总排名',
    section4Body: 'Overall Ranking 汇总读者为这个故事获得的所有 Support Points，不会每周重置。',
    section5Title: 'Gift 积分',
    section6Title: '积分如何计算',
    formula: 'Support Points = Gift Points × 数量',
    exampleCandy: 'Candy × 5 = 5 Support Points',
    exampleMagicPen: 'Magic Pen × 3 = 30 Support Points',
    exampleRocket: 'Rocket × 1 = 100 Support Points',
    section7Title: '当两位读者分数相同',
    section7Body: '如果两位读者的 Support Points 相同，先达到该分数的读者会排在更高位置。',
    note: 'Support Points 仅用于排名。它们不是 Coins 或 Diamonds，不能消费或兑换。',
    rights: 'Shadow 保留所有权利。',
    point: '{{count}} 分',
    points: '{{count}} 分',
    candy: '糖果',
    flower: '鲜花',
    coffee: '咖啡',
    magicPen: '魔法笔',
    goldBook: '黄金书',
    shadowStar: 'Shadow 之星',
    authorCrown: '作者皇冠',
    rocket: '火箭',
  },
  ja: {
    back: '戻る',
    title: 'Top Fans の仕組み',
    guideTitle: 'Top Fans ガイド',
    guideIntro: '{{story}}における Gifts と Support Points の仕組みを確認できます。',
    thisStory: 'このストーリー',
    section1Title: 'Top Fans とは？',
    section1Body: 'Top Fans は、このストーリーに Gifts を送り、最も多く応援している読者のランキングです。Gift を送るたびに Support Points がランキング合計に加算されます。',
    section2Title: '応援はこのストーリー専用です',
    section2Body: 'このページに表示される Gifts と Support Points は、このストーリーだけにカウントされます。他のストーリーや作者の総合ページには移行されません。',
    section3Title: '週間ランキング',
    section3Body1: 'Weekly Ranking は今週獲得した Support Points を集計します。新しい週間ランキングは毎週月曜日に始まります。',
    section3Body2: '週間ランキングが再スタートしても、Gift の履歴は保存されたままです。',
    section4Title: '総合ランキング',
    section4Body: 'Overall Ranking は、このストーリーで読者が獲得したすべての Support Points を合計します。毎週リセットされません。',
    section5Title: 'Gift ポイント',
    section6Title: 'ポイントの計算方法',
    formula: 'Support Points = Gift Points × 数量',
    exampleCandy: 'Candy × 5 = 5 Support Points',
    exampleMagicPen: 'Magic Pen × 3 = 30 Support Points',
    exampleRocket: 'Rocket × 1 = 100 Support Points',
    section7Title: '同じスコアの読者がいる場合',
    section7Body: '2人の読者の Support Points が同じ場合、そのスコアに先に到達した読者が上位に表示されます。',
    note: 'Support Points はランキング専用です。Coins や Diamonds ではなく、使用したり交換したりできません。',
    rights: 'すべての権利は Shadow が保有します。',
    point: '{{count}}ポイント',
    points: '{{count}}ポイント',
    candy: 'キャンディ',
    flower: 'フラワー',
    coffee: 'コーヒー',
    magicPen: 'マジックペン',
    goldBook: 'ゴールドブック',
    shadowStar: 'Shadow スター',
    authorCrown: '作者クラウン',
    rocket: 'ロケット',
  },
  ko: {
    back: '뒤로 가기',
    title: 'Top Fans 작동 방식',
    guideTitle: 'Top Fans 가이드',
    guideIntro: '{{story}}의 Gifts 및 Support Points 작동 방식을 알아보세요.',
    thisStory: '이 스토리',
    section1Title: 'Top Fans란 무엇인가요?',
    section1Body: 'Top Fans는 이 스토리에 Gifts를 보내고 가장 많이 응원한 독자 순위입니다. Gift를 보낼 때마다 Support Points가 순위 총점에 추가됩니다.',
    section2Title: '응원은 이 스토리에만 적용됩니다',
    section2Body: '이 페이지의 Gifts와 Support Points는 이 스토리에만 계산됩니다. 다른 스토리나 작가의 전체 페이지로 이전되지 않습니다.',
    section3Title: '주간 랭킹',
    section3Body1: 'Weekly Ranking은 현재 주에 획득한 Support Points를 집계합니다. 새로운 주간 랭킹은 매주 월요일 시작됩니다.',
    section3Body2: '주간 랭킹이 다시 시작되어도 Gift 기록은 계속 저장됩니다.',
    section4Title: '전체 랭킹',
    section4Body: 'Overall Ranking은 이 스토리에서 독자가 획득한 모든 Support Points를 합산합니다. 매주 초기화되지 않습니다.',
    section5Title: 'Gift 포인트',
    section6Title: '포인트 계산 방법',
    formula: 'Support Points = Gift Points × 수량',
    exampleCandy: 'Candy × 5 = 5 Support Points',
    exampleMagicPen: 'Magic Pen × 3 = 30 Support Points',
    exampleRocket: 'Rocket × 1 = 100 Support Points',
    section7Title: '두 독자의 점수가 같은 경우',
    section7Body: '두 독자의 Support Points가 같으면 해당 점수에 먼저 도달한 독자가 더 높은 순위에 표시됩니다.',
    note: 'Support Points는 랭킹에만 사용됩니다. Coins 또는 Diamonds가 아니며 사용하거나 교환할 수 없습니다.',
    rights: '모든 권리는 Shadow에 있습니다.',
    point: '{{count}}포인트',
    points: '{{count}}포인트',
    candy: '캔디',
    flower: '꽃',
    coffee: '커피',
    magicPen: '매직 펜',
    goldBook: '골드 북',
    shadowStar: 'Shadow 스타',
    authorCrown: '작가 크라운',
    rocket: '로켓',
  },
})

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const GIFT_POINTS = [
  {
    key: 'candy',
    nameKey: 'candy',
    points: 1,
    image: '/assets/Gift/Candy.png',
  },
  {
    key: 'flower',
    nameKey: 'flower',
    points: 3,
    image: '/assets/Gift/Flower.png',
  },
  {
    key: 'coffee',
    nameKey: 'coffee',
    points: 5,
    image: '/assets/Gift/Coffee.png',
  },
  {
    key: 'magic_pen',
    nameKey: 'magicPen',
    points: 10,
    image: '/assets/Gift/Magic Pen.png',
  },
  {
    key: 'gold_book',
    nameKey: 'goldBook',
    points: 20,
    image: '/assets/Gift/Gold Book.png',
  },
  {
    key: 'star',
    nameKey: 'shadowStar',
    points: 35,
    image: '/assets/Gift/Star.png',
  },
  {
    key: 'crown',
    nameKey: 'authorCrown',
    points: 60,
    image: '/assets/Gift/Crown.png',
  },
  {
    key: 'rocket',
    nameKey: 'rocket',
    points: 100,
    image: '/assets/Gift/Rocket.png',
  },
]

function InfoSection({ number, title, children }) {
  return (
    <section className="border-b border-[#eef1f5] px-4 py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1f5] text-[12px] font-bold text-[#ff3b5f]">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-[#111827]">{title}</h2>
          <div className="mt-2 text-[13px] font-normal leading-6 text-[#667085]">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function TopFansGuidePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()
  const { t } = useDisplayTranslation()

  const [story, setStory] = useState(location.state?.storyPreview || null)

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      if (!storyId) return

      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${storyId}`)
        const data = await response.json().catch(() => ({}))

        if (!ignore && response.ok && data.story) {
          setStory(data.story)
        }
      } catch {
      }
    }

    if (!story?.id) loadStory()

    return () => {
      ignore = true
    }
  }, [storyId, story?.id])

  const storyTitle = story?.title || t('topFansGuidePage.thisStory')

  return (
    <main className="app-page min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#eef1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label={t('topFansGuidePage.back')}
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[17px] font-bold text-[#111827]">
            {t('topFansGuidePage.title')}
          </h1>

          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl pb-10">
        <section className="bg-white px-4 pb-5 pt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f5] text-[#ff3b5f]">
            <i className="fa-solid fa-ranking-star text-[19px]" />
          </div>

          <h2 className="mt-3 text-[18px] font-bold text-[#111827]">
            {t('topFansGuidePage.guideTitle')}
          </h2>

          <p className="mx-auto mt-1 max-w-[420px] text-[13px] font-normal leading-5 text-[#98a2b3]">
            {t('topFansGuidePage.guideIntro', { story: storyTitle })}
          </p>
        </section>

        <div className="mt-3 bg-white">
          <InfoSection
            number="1"
            title={t('topFansGuidePage.section1Title')}
          >
            <p>{t('topFansGuidePage.section1Body')}</p>
          </InfoSection>

          <InfoSection
            number="2"
            title={t('topFansGuidePage.section2Title')}
          >
            <p>{t('topFansGuidePage.section2Body')}</p>
          </InfoSection>

          <InfoSection
            number="3"
            title={t('topFansGuidePage.section3Title')}
          >
            <p>{t('topFansGuidePage.section3Body1')}</p>
            <p className="mt-2">{t('topFansGuidePage.section3Body2')}</p>
          </InfoSection>

          <InfoSection
            number="4"
            title={t('topFansGuidePage.section4Title')}
          >
            <p>{t('topFansGuidePage.section4Body')}</p>
          </InfoSection>

          <InfoSection
            number="5"
            title={t('topFansGuidePage.section5Title')}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GIFT_POINTS.map((gift) => (
                <div
                  key={gift.key}
                  className="flex items-center gap-2 rounded-[14px] border border-[#eef1f5] bg-[#fafafa] px-2.5 py-2.5"
                >
                  <img
                    src={gift.image}
                    alt=""
                    className="h-9 w-9 shrink-0 object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-medium text-[#111827]">
                      {t(`topFansGuidePage.${gift.nameKey}`)}
                    </div>

                    <div className="mt-0.5 text-[12px] font-bold text-[#ff3b5f]">
                      {t(
                        gift.points === 1
                          ? 'topFansGuidePage.point'
                          : 'topFansGuidePage.points',
                        { count: gift.points }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoSection>

          <InfoSection
            number="6"
            title={t('topFansGuidePage.section6Title')}
          >
            <div className="rounded-[14px] bg-[#f5f3fa] px-3 py-3 text-center text-[13px] font-bold text-[#111827]">
              {t('topFansGuidePage.formula')}
            </div>

            <div className="mt-3 space-y-1.5">
              <p>{t('topFansGuidePage.exampleCandy')}</p>
              <p>{t('topFansGuidePage.exampleMagicPen')}</p>
              <p>{t('topFansGuidePage.exampleRocket')}</p>
            </div>
          </InfoSection>

          <InfoSection
            number="7"
            title={t('topFansGuidePage.section7Title')}
          >
            <p>{t('topFansGuidePage.section7Body')}</p>
          </InfoSection>
        </div>

        <div className="mx-4 mt-4 rounded-[16px] bg-[#fff1f5] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info mt-0.5 text-[14px] text-[#ff3b5f]" />

            <p className="text-[12px] font-normal leading-5 text-[#667085]">
              {t('topFansGuidePage.note')}
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[11px] font-normal text-[#b0b7c3]">
          {t('topFansGuidePage.rights')}
        </p>
      </div>
    </main>
  )
}
