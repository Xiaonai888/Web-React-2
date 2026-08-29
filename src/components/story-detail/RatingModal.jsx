import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('ratingModal', {
  en: {
    close: 'Close',
    rateThisStory: 'Rate this story',
    thisStory: 'this story',
    canRateNow: 'You can rate {{story}} now.',
    finishThreeEpisodes: 'Please finish at least 3 episodes before rating this story. One episode is not enough to judge the full story.',
    rateStar: 'Rate {{count}}',
    finishedEpisodes: 'Finished episodes: {{count}}/3',
    saveDemoRating: 'Save demo rating',
    gotIt: 'Got it',
  },
  km: {
    close: 'បិទ',
    rateThisStory: 'វាយតម្លៃរឿងនេះ',
    thisStory: 'រឿងនេះ',
    canRateNow: 'ឥឡូវនេះអ្នកអាចវាយតម្លៃ {{story}} បាន។',
    finishThreeEpisodes: 'សូមអានឱ្យចប់យ៉ាងហោចណាស់ 3 ភាគ មុនវាយតម្លៃរឿងនេះ។ អានតែ 1 ភាគមិនទាន់គ្រប់គ្រាន់សម្រាប់វាយតម្លៃរឿងទាំងមូលទេ។',
    rateStar: 'វាយតម្លៃ {{count}} ផ្កាយ',
    finishedEpisodes: 'ភាគដែលបានអានចប់៖ {{count}}/3',
    saveDemoRating: 'រក្សាទុកពិន្ទុ Demo',
    gotIt: 'យល់ហើយ',
  },
  zh: {
    close: '关闭',
    rateThisStory: '评价这个故事',
    thisStory: '这个故事',
    canRateNow: '你现在可以评价《{{story}}》。',
    finishThreeEpisodes: '请至少读完 3 章后再评价这个故事。只读 1 章不足以判断整个故事。',
    rateStar: '评分 {{count}} 星',
    finishedEpisodes: '已读完章节：{{count}}/3',
    saveDemoRating: '保存示例评分',
    gotIt: '知道了',
  },
  ja: {
    close: '閉じる',
    rateThisStory: 'このストーリーを評価',
    thisStory: 'このストーリー',
    canRateNow: '今すぐ「{{story}}」を評価できます。',
    finishThreeEpisodes: 'このストーリーを評価する前に、少なくとも3エピソードを読み終えてください。1エピソードだけではストーリー全体を判断するには不十分です。',
    rateStar: '{{count}}つ星で評価',
    finishedEpisodes: '読了エピソード：{{count}}/3',
    saveDemoRating: 'デモ評価を保存',
    gotIt: 'わかりました',
  },
  ko: {
    close: '닫기',
    rateThisStory: '이 스토리 평가',
    thisStory: '이 스토리',
    canRateNow: '지금 {{story}}을(를) 평가할 수 있습니다.',
    finishThreeEpisodes: '이 스토리를 평가하기 전에 최소 3개의 에피소드를 끝까지 읽어 주세요. 1개 에피소드만으로는 전체 스토리를 판단하기에 충분하지 않습니다.',
    rateStar: '{{count}}점 평가',
    finishedEpisodes: '완독 에피소드: {{count}}/3',
    saveDemoRating: '데모 평점 저장',
    gotIt: '확인',
  },
})

export default function RatingModal({ open, story, finishedEpisodeCount, onClose }) {
  const { t } = useDisplayTranslation()
  const [rating, setRating] = useState(0)
  if (!open) return null

  const allowRatingWithoutEpisodeLimit = true
const allowed = allowRatingWithoutEpisodeLimit || finishedEpisodeCount >= 3
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/45 px-4 pb-4 sm:items-center sm:pb-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label={t('ratingModal.close')}
      />

      <section className="relative w-full max-w-[460px] rounded-[30px] bg-white p-5 text-center shadow-2xl">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          allowed ? 'bg-[#fff7ed] text-[#f59e0b]' : 'bg-[#fff1f1] text-[#e5484d]'
        }`}>
          <i className={`${allowed ? 'fa-solid fa-star' : 'fa-solid fa-circle-info'} text-[26px]`} />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827]">
          {t('ratingModal.rateThisStory')}
        </h2>
        <p className="mt-2 text-[13px] font-semibold leading-6 text-[#667085]">
          {allowed
            ? t('ratingModal.canRateNow', {
                story: story?.title || t('ratingModal.thisStory'),
              })
            : t('ratingModal.finishThreeEpisodes')}
        </p>

        {allowed ? (
          <div className="mt-5 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-[30px] ${rating >= star ? 'text-[#f59e0b]' : 'text-[#d0d5dd]'}`}
                aria-label={t('ratingModal.rateStar', { count: star })}
              >
                <i className="fa-solid fa-star" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[20px] bg-[#f8fafc] px-4 py-4 text-[13px] font-black text-[#111827]">
            {t('ratingModal.finishedEpisodes', {
              count: finishedEpisodeCount,
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
        >
          {allowed ? t('ratingModal.saveDemoRating') : t('ratingModal.gotIt')}
        </button>
      </section>
    </div>
  )
}
