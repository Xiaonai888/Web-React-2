import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('leaveReviewPage', {
  en: {
    goBack: 'Go back',
    title: 'Leave a Review',
    reviewingStory: 'Reviewing: {{title}}',
    reviewThisStory: 'Review this story',
    submit: 'Submit',
    score: 'Score',
    rateStar: 'Rate {{star}}',
    yourReview: 'Your review',
    reviewPlaceholder: 'What made this story stand out?',
    helper: 'Share what you liked, how the story made you feel, or what helped you keep reading.',
    characters: 'Characters you liked',
    favoriteMoment: 'Favorite moment',
    feeling: 'How the story made you feel',
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ',
    title: 'សរសេរ Review',
    reviewingStory: 'កំពុង Review៖ {{title}}',
    reviewThisStory: 'Review រឿងនេះ',
    submit: 'បញ្ជូន',
    score: 'ពិន្ទុ',
    rateStar: 'ដាក់ពិន្ទុ {{star}} ផ្កាយ',
    yourReview: 'Review របស់អ្នក',
    reviewPlaceholder: 'តើអ្វីធ្វើឱ្យរឿងនេះពិសេសសម្រាប់អ្នក?',
    helper: 'ចែករំលែកអ្វីដែលអ្នកចូលចិត្ត អារម្មណ៍ដែលរឿងនេះផ្តល់ឱ្យអ្នក ឬអ្វីដែលធ្វើឱ្យអ្នកបន្តអាន។',
    characters: 'តួអង្គដែលអ្នកចូលចិត្ត',
    favoriteMoment: 'ឈុតដែលអ្នកចូលចិត្តបំផុត',
    feeling: 'អារម្មណ៍ដែលរឿងនេះផ្តល់ឱ្យអ្នក',
  },
  zh: {
    goBack: '返回',
    title: '发表评论',
    reviewingStory: '正在评论：{{title}}',
    reviewThisStory: '评论这个故事',
    submit: '提交',
    score: '评分',
    rateStar: '评分 {{star}} 星',
    yourReview: '你的评论',
    reviewPlaceholder: '这个故事有什么特别之处？',
    helper: '分享你喜欢的内容、故事带给你的感受，或是什么让你继续读下去。',
    characters: '你喜欢的角色',
    favoriteMoment: '最喜欢的时刻',
    feeling: '故事带给你的感受',
  },
  ja: {
    goBack: '戻る',
    title: 'レビューを書く',
    reviewingStory: 'レビュー中：{{title}}',
    reviewThisStory: 'このストーリーをレビュー',
    submit: '送信',
    score: '評価',
    rateStar: '{{star}}つ星で評価',
    yourReview: 'あなたのレビュー',
    reviewPlaceholder: 'このストーリーのどこが印象に残りましたか？',
    helper: '気に入った点、ストーリーを読んで感じたこと、読み続けたくなった理由などを共有してください。',
    characters: '気に入ったキャラクター',
    favoriteMoment: 'お気に入りの場面',
    feeling: 'ストーリーを読んで感じたこと',
  },
  ko: {
    goBack: '뒤로 가기',
    title: '리뷰 작성',
    reviewingStory: '리뷰 중: {{title}}',
    reviewThisStory: '이 스토리 리뷰하기',
    submit: '제출',
    score: '평점',
    rateStar: '{{star}}점 평가',
    yourReview: '내 리뷰',
    reviewPlaceholder: '이 스토리에서 특별했던 점은 무엇인가요?',
    helper: '좋았던 점, 스토리를 읽으며 느낀 감정, 계속 읽게 만든 이유를 공유해 주세요.',
    characters: '좋아한 캐릭터',
    favoriteMoment: '가장 좋아한 순간',
    feeling: '스토리를 읽으며 느낀 감정',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getStoredReviews(storyId) {
  try {
    const raw = localStorage.getItem(`shadow_story_reviews_${storyId}`)
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveReview(storyId, review) {
  const reviews = getStoredReviews(storyId)
  localStorage.setItem(`shadow_story_reviews_${storyId}`, JSON.stringify([review, ...reviews]))
}

export default function LeaveReviewPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useDisplayTranslation()

  const [story, setStory] = useState(null)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/stories/${id}`)
        const data = await response.json().catch(() => ({}))
        if (!ignore) setStory(data.story || null)
      } catch {
        if (!ignore) setStory(null)
      }
    }

    loadStory()

    return () => {
      ignore = true
    }
  }, [id])

  const canSubmit = rating > 0

  const handleSubmit = () => {
    if (!canSubmit) return

    saveReview(id, {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: 'Reader',
      rating,
      label: rating >= 5 ? 'Excellent' : rating >= 4 ? 'Good' : rating >= 3 ? 'Okay' : 'Needs work',
      text: text.trim(),
      likes: 0,
      created_at: new Date().toISOString(),
    })

    navigate(`/story/${id}/rating`)
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eef1f5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-[44px_1fr_92px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label={t('leaveReviewPage.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-[18px] font-black">
              {t('leaveReviewPage.title')}
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#98a2b3]">
              {story?.title
                ? t('leaveReviewPage.reviewingStory', { title: story.title })
                : t('leaveReviewPage.reviewThisStory')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-10 rounded-full bg-[#111827] px-4 text-[13px] font-black text-white active:scale-95 disabled:bg-[#d0d5dd]"
          >
            {t('leaveReviewPage.submit')}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 pt-8">
        <div className="text-center">
          <h2 className="text-[22px] font-black">
            {t('leaveReviewPage.score')}
          </h2>

          <div className="mt-7 flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-[42px] active:scale-95 ${
                  rating >= star ? 'text-[#ff8a3d]' : 'text-[#d9d9d9]'
                }`}
                aria-label={t('leaveReviewPage.rateStar', { star })}
              >
                <i className="fa-solid fa-star" />
              </button>
            ))}
          </div>
        </div>

        <label className="mt-8 block">
          <div className="mb-2 text-[13px] font-black text-[#111827]">
            {t('leaveReviewPage.yourReview')}
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            placeholder={t('leaveReviewPage.reviewPlaceholder')}
            className="w-full resize-none rounded-[22px] bg-[#f3f4f6] px-4 py-4 text-[14px] font-medium leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] focus:ring-2 focus:ring-[#111827]/15"
          />
        </label>

        <div className="mt-6 rounded-[22px] bg-[#f8fafc] px-4 py-4">
          <p className="text-[14px] font-semibold leading-6 text-[#4b5563]">
            {t('leaveReviewPage.helper')}
          </p>

          <ul className="mt-4 space-y-2 text-[13px] font-semibold leading-6 text-[#667085]">
            <li>• {t('leaveReviewPage.characters')}</li>
            <li>• {t('leaveReviewPage.favoriteMoment')}</li>
            <li>• {t('leaveReviewPage.feeling')}</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
