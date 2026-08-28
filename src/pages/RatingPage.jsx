import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('ratingPage', {
  en: {
    justNow: 'Just now',
    noReviewsYet: 'No reviews yet',
    emptyBody: 'Be the first reader to rate this story. Your review helps other readers decide what to read next.',
    writeFirstReview: 'Write the first review',
    reader: 'Reader',
    review: 'Review',
    excellent: 'Excellent',
    good: 'Good',
    okay: 'Okay',
    needsWork: 'Needs work',
    authorReplied: 'Author replied',
    readMoreBeforeReviewing: 'Read more before reviewing',
    gateBody: 'Please read at least {{required}} episodes before leaving a review. You have read {{read}} so far. Read {{remaining}} more to unlock reviews.',
    notNow: 'Not now',
    startReading: 'Start reading',
    closeReviewSheet: 'Close review sheet',
    leaveReview: 'Leave a Review',
    close: 'Close',
    rateStar: 'Rate {{star}}',
    placeholder: 'What made this story stand out?',
    helper: 'Share what you liked, how the story made you feel, or what helped you keep reading.',
    submitReview: 'Submit Review',
    storyCover: 'Story cover',
    goBack: 'Go back',
    loadingStory: 'Loading story...',
    untitledStory: 'Untitled Story',
    reviewCount: '{{count}} reviews',
    reviewCenter: 'Review Center',
    hot: 'Hot',
    new: 'New',
  },
  km: {
    justNow: 'ទើបតែឥឡូវនេះ',
    noReviewsYet: 'មិនទាន់មាន Review ទេ',
    emptyBody: 'ក្លាយជាអ្នកអានដំបូងដែលដាក់ពិន្ទុរឿងនេះ។ Review របស់អ្នកអាចជួយអ្នកអានផ្សេងសម្រេចចិត្តថាត្រូវអានអ្វីបន្ទាប់។',
    writeFirstReview: 'សរសេរ Review ដំបូង',
    reader: 'អ្នកអាន',
    review: 'Review',
    excellent: 'ល្អឥតខ្ចោះ',
    good: 'ល្អ',
    okay: 'មធ្យម',
    needsWork: 'ត្រូវកែលម្អ',
    authorReplied: 'អ្នកនិពន្ធបានឆ្លើយតប',
    readMoreBeforeReviewing: 'អានបន្ថែមមុនសរសេរ Review',
    gateBody: 'សូមអានយ៉ាងហោចណាស់ {{required}} ភាគ មុនសរសេរ Review។ អ្នកបានអាន {{read}} ភាគហើយ។ អានបន្ថែម {{remaining}} ភាគ ដើម្បីបើក Review។',
    notNow: 'មិនមែនឥឡូវនេះ',
    startReading: 'ចាប់ផ្តើមអាន',
    closeReviewSheet: 'បិទផ្ទាំង Review',
    leaveReview: 'សរសេរ Review',
    close: 'បិទ',
    rateStar: 'ដាក់ពិន្ទុ {{star}} ផ្កាយ',
    placeholder: 'តើអ្វីធ្វើឱ្យរឿងនេះពិសេសសម្រាប់អ្នក?',
    helper: 'ចែករំលែកអ្វីដែលអ្នកចូលចិត្ត អារម្មណ៍ដែលរឿងនេះផ្តល់ឱ្យអ្នក ឬអ្វីដែលធ្វើឱ្យអ្នកបន្តអាន។',
    submitReview: 'បញ្ជូន Review',
    storyCover: 'គម្របរឿង',
    goBack: 'ត្រឡប់ក្រោយ',
    loadingStory: 'កំពុងផ្ទុករឿង...',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    reviewCount: '{{count}} Reviews',
    reviewCenter: 'មជ្ឈមណ្ឌល Review',
    hot: 'ពេញនិយម',
    new: 'ថ្មី',
  },
  zh: {
    justNow: '刚刚',
    noReviewsYet: '暂无评论',
    emptyBody: '成为第一个为这个故事评分的读者。你的评论可以帮助其他读者决定接下来读什么。',
    writeFirstReview: '写第一条评论',
    reader: '读者',
    review: '评论',
    excellent: '非常好',
    good: '好',
    okay: '一般',
    needsWork: '需要改进',
    authorReplied: '作者已回复',
    readMoreBeforeReviewing: '阅读更多后再评论',
    gateBody: '发表评论前请至少阅读 {{required}} 个章节。你目前已阅读 {{read}} 个，还需阅读 {{remaining}} 个才能解锁评论。',
    notNow: '暂时不要',
    startReading: '开始阅读',
    closeReviewSheet: '关闭评论面板',
    leaveReview: '发表评论',
    close: '关闭',
    rateStar: '评分 {{star}} 星',
    placeholder: '这个故事有什么特别之处？',
    helper: '分享你喜欢的内容、故事带给你的感受，或是什么让你继续读下去。',
    submitReview: '提交评论',
    storyCover: '故事封面',
    goBack: '返回',
    loadingStory: '正在加载故事...',
    untitledStory: '无标题故事',
    reviewCount: '{{count}} 条评论',
    reviewCenter: '评论中心',
    hot: '热门',
    new: '最新',
  },
  ja: {
    justNow: 'たった今',
    noReviewsYet: 'レビューはまだありません',
    emptyBody: '最初にこのストーリーを評価してみましょう。あなたのレビューは、他の読者が次に読む作品を選ぶ助けになります。',
    writeFirstReview: '最初のレビューを書く',
    reader: '読者',
    review: 'レビュー',
    excellent: '最高',
    good: '良い',
    okay: '普通',
    needsWork: '改善が必要',
    authorReplied: '作者からの返信',
    readMoreBeforeReviewing: 'レビュー前にもう少し読みましょう',
    gateBody: 'レビューを書く前に、少なくとも {{required}} 話を読んでください。現在 {{read}} 話まで読んでいます。あと {{remaining}} 話読むとレビューが解放されます。',
    notNow: '今はしない',
    startReading: '読み始める',
    closeReviewSheet: 'レビューパネルを閉じる',
    leaveReview: 'レビューを書く',
    close: '閉じる',
    rateStar: '{{star}}つ星で評価',
    placeholder: 'このストーリーのどこが印象に残りましたか？',
    helper: '気に入った点、ストーリーを読んで感じたこと、読み続けたくなった理由などを共有してください。',
    submitReview: 'レビューを送信',
    storyCover: 'ストーリーの表紙',
    goBack: '戻る',
    loadingStory: 'ストーリーを読み込み中...',
    untitledStory: '無題のストーリー',
    reviewCount: 'レビュー {{count}}件',
    reviewCenter: 'レビューセンター',
    hot: '人気',
    new: '新着',
  },
  ko: {
    justNow: '방금',
    noReviewsYet: '아직 리뷰가 없습니다',
    emptyBody: '이 스토리를 가장 먼저 평가해 보세요. 회원님의 리뷰는 다른 독자가 다음 작품을 선택하는 데 도움이 됩니다.',
    writeFirstReview: '첫 리뷰 작성',
    reader: '독자',
    review: '리뷰',
    excellent: '최고',
    good: '좋음',
    okay: '보통',
    needsWork: '개선 필요',
    authorReplied: '작가 답글',
    readMoreBeforeReviewing: '리뷰 전에 더 읽어 주세요',
    gateBody: '리뷰를 남기려면 최소 {{required}}화를 읽어 주세요. 현재 {{read}}화를 읽었습니다. {{remaining}}화 더 읽으면 리뷰가 열립니다.',
    notNow: '나중에',
    startReading: '읽기 시작',
    closeReviewSheet: '리뷰 패널 닫기',
    leaveReview: '리뷰 작성',
    close: '닫기',
    rateStar: '{{star}}점 평가',
    placeholder: '이 스토리에서 특별했던 점은 무엇인가요?',
    helper: '좋았던 점, 스토리를 읽으며 느낀 감정, 계속 읽게 만든 이유를 공유해 주세요.',
    submitReview: '리뷰 제출',
    storyCover: '스토리 표지',
    goBack: '뒤로 가기',
    loadingStory: '스토리를 불러오는 중...',
    untitledStory: '제목 없는 스토리',
    reviewCount: '리뷰 {{count}}개',
    reviewCenter: '리뷰 센터',
    hot: '인기',
    new: '최신',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const DISPLAY_LOCALES = {
  km: 'km-KH',
  en: 'en-GB',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
}

function formatShortNumber(value) {
  const number = Number(value || 0)
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`
  return number.toLocaleString()
}

function formatDate(value, language, t) {
  if (!value) return t('ratingPage.justNow')

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return t('ratingPage.justNow')
  }

  return date.toLocaleDateString(
    DISPLAY_LOCALES[language] || DISPLAY_LOCALES.en
  )
}

function getStoredReviews(storyId) {
  try {
    const raw = localStorage.getItem(`shadow_story_reviews_${storyId}`)
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const REVIEW_REQUIRED_READ_EPISODES = 3

function getReviewReadKey(storyId) {
  return `shadow_review_read_episodes_${storyId}`
}

function getReviewReadEpisodes(storyId) {
  if (!storyId) return []

  try {
    const parsed = JSON.parse(
      localStorage.getItem(getReviewReadKey(storyId)) || '[]'
    )
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function StarRow({ value, size = 'text-[18px]' }) {
  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`fa-solid fa-star ${
            Number(value || 0) >= star
              ? 'text-[#ff8a3d]'
              : 'text-[#d0d5dd] dark:text-white/20'
          }`}
        />
      ))}
    </div>
  )
}

function EmptyReviewState({ onWriteReview }) {
  const { t } = useDisplayTranslation()

  return (
    <div className="px-4 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)]">
        <i className="fa-regular fa-star text-[22px]" />
      </div>

      <h3 className="mt-4 text-[17px] font-extrabold text-[#111827] dark:text-[var(--shadow-text-primary)]">
        {t('ratingPage.noReviewsYet')}
      </h3>

      <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-semibold leading-6 text-[#667085] dark:text-[var(--shadow-text-secondary)]">
        {t('ratingPage.emptyBody')}
      </p>

      <button
        type="button"
        onClick={onWriteReview}
        className="mt-5 h-11 rounded-full bg-[#111827] px-5 text-[13px] font-normal text-white active:scale-95 dark:bg-[#7c3aed]"
      >
        {t('ratingPage.writeFirstReview')}
      </button>
    </div>
  )
}

function getReviewLabel(label, t) {
  const value = String(label || '').trim()

  if (value === 'Excellent') return t('ratingPage.excellent')
  if (value === 'Good') return t('ratingPage.good')
  if (value === 'Okay') return t('ratingPage.okay')
  if (value === 'Needs work') return t('ratingPage.needsWork')
  if (!value || value === 'Review') return t('ratingPage.review')

  return value
}

function ReviewCard({ review }) {
  const { language, t } = useDisplayTranslation()
  const name = review.name || t('ratingPage.reader')

  return (
    <article className="border-b border-[#eef1f5] px-4 py-5 last:border-b-0 dark:border-[var(--shadow-border)] sm:px-0">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[15px] font-black text-white dark:bg-[#7c3aed]">
          {(name || 'R').slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-[14px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
              {name}
            </h3>
            <StarRow value={review.rating} size="text-[13px]" />
            <span className="text-[12px] font-semibold text-[#667085] dark:text-[var(--shadow-text-secondary)]">
              {getReviewLabel(review.label, t)}
            </span>
          </div>

          {review.text ? (
            <p className="mt-3 line-clamp-4 text-[13.5px] font-medium leading-6 text-[#4b5563] dark:text-[var(--shadow-text-secondary)]">
              {review.text}
            </p>
          ) : null}

          <div className="mt-3 text-[12px] font-semibold text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]">
            {formatDate(review.created_at, language, t)}
          </div>

          {review.author_reply ? (
            <div className="mt-3 rounded-[18px] bg-[#f8fafc] px-4 py-3 dark:bg-[var(--shadow-bg-elevated)]">
              <div className="text-[12px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
                {t('ratingPage.authorReplied')}
              </div>
              <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#667085] dark:text-[var(--shadow-text-secondary)]">
                {review.author_reply}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ReviewGateModal({
  open,
  readCount,
  onClose,
  onStartReading,
}) {
  const { t } = useDisplayTranslation()

  if (!open) return null

  const remaining = Math.max(
    0,
    REVIEW_REQUIRED_READ_EPISODES - Number(readCount || 0)
  )

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/45 px-4">
      <section className="w-full max-w-[420px] rounded-[26px] bg-white p-6 text-center shadow-2xl dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7d6] text-[#f59e0b] dark:bg-amber-500/10 dark:text-amber-300">
          <i className="fa-solid fa-book-open-reader text-[25px]" />
        </div>

        <h2 className="mt-4 text-[20px] font-black text-[#111827] dark:text-[var(--shadow-text-primary)]">
          {t('ratingPage.readMoreBeforeReviewing')}
        </h2>

        <p className="mt-3 text-[13px] font-semibold leading-6 text-[#667085] dark:text-[var(--shadow-text-secondary)]">
          {t('ratingPage.gateBody', {
            required: REVIEW_REQUIRED_READ_EPISODES,
            read: Number(readCount || 0),
            remaining,
          })}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-black text-[#111827] active:scale-95 dark:border-[var(--shadow-border)] dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)]"
          >
            {t('ratingPage.notNow')}
          </button>

          <button
            type="button"
            onClick={onStartReading}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-black text-white active:scale-95 dark:bg-[#7c3aed]"
          >
            {t('ratingPage.startReading')}
          </button>
        </div>
      </section>
    </div>
  )
}

function ReviewBottomSheet({
  open,
  rating,
  reviewText,
  onClose,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}) {
  const { t } = useDisplayTranslation()
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startY: 0,
    lastY: 0,
    startTime: 0,
  })

  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!open) return

    dragRef.current = {
      active: false,
      pointerId: null,
      startY: 0,
      lastY: 0,
      startTime: 0,
    }

    setDragging(false)
    setDragOffset(0)
  }, [open])

  if (!open) return null

  const resetDrag = () => {
    dragRef.current.active = false
    dragRef.current.pointerId = null
    setDragging(false)
    setDragOffset(0)
  }

  const handleDragStart = (event) => {
    if (!event.isPrimary) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    if (
      event.target instanceof Element &&
      event.target.closest('button, input, textarea')
    ) {
      return
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      startTime: performance.now(),
    }

    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handleDragMove = (event) => {
    const drag = dragRef.current

    if (!drag.active || drag.pointerId !== event.pointerId) return

    drag.lastY = event.clientY

    const distance = Math.max(0, event.clientY - drag.startY)

    setDragOffset(
      Math.min(distance, window.innerHeight * 0.65)
    )

    if (event.cancelable) event.preventDefault()
  }

  const handleDragEnd = (event) => {
    const drag = dragRef.current

    if (!drag.active || drag.pointerId !== event.pointerId) return

    drag.lastY = event.clientY

    const distance = Math.max(0, drag.lastY - drag.startY)
    const elapsed = Math.max(
      1,
      performance.now() - drag.startTime
    )
    const velocity = distance / elapsed

    drag.active = false
    drag.pointerId = null
    setDragging(false)

    if (
      distance >= 70 ||
      (distance >= 24 && velocity >= 0.6)
    ) {
      setDragOffset(0)
      onClose()
      return
    }

    setDragOffset(0)
  }

  const handleDragCancel = (event) => {
    const drag = dragRef.current

    if (!drag.active) return
    if (drag.pointerId !== event.pointerId) return

    resetDrag()
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/40 px-0">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label={t('ratingPage.closeReviewSheet')}
      />

      <section
        className="relative w-full max-w-[520px] rounded-t-[28px] bg-white px-5 pb-6 pt-3 shadow-2xl dark:bg-[var(--shadow-bg-surface)] dark:shadow-[var(--shadow-shadow)]"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: dragging
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        <div
          role="presentation"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragCancel}
          onLostPointerCapture={handleDragCancel}
          className="flex min-h-12 cursor-grab touch-none items-center justify-between gap-3 active:cursor-grabbing"
        >
          <h2
            className="text-[18px] font-bold text-[#111827] dark:text-[var(--shadow-text-primary)]"
            style={{ fontWeight: 700 }}
          >
            {t('ratingPage.leaveReview')}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] active:scale-95 dark:bg-[var(--shadow-bg-elevated)] dark:text-[var(--shadow-text-primary)]"
            aria-label={t('ratingPage.close')}
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`text-[36px] active:scale-95 ${
                rating >= star
                  ? 'text-[#ff8a3d]'
                  : 'text-[#d9d9d9] dark:text-white/20'
              }`}
              aria-label={t('ratingPage.rateStar', { star })}
            >
              <i className="fa-solid fa-star" />
            </button>
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={(event) =>
            onReviewTextChange(event.target.value)
          }
          rows={5}
          placeholder={t('ratingPage.placeholder')}
          className="mt-5 w-full resize-none rounded-[20px] bg-[#f3f4f6] px-4 py-4 text-[14px] font-medium leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] focus:ring-2 focus:ring-[#111827]/15 dark:bg-[var(--shadow-input-bg)] dark:text-[var(--shadow-text-primary)] dark:placeholder:text-[var(--shadow-placeholder)] dark:focus:ring-[#a78bfa]/25"
        />

        <p className="mt-3 text-[12px] font-semibold leading-5 text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]">
          {t('ratingPage.helper')}
        </p>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!rating}
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-95 disabled:bg-[#d0d5dd] dark:bg-[#7c3aed] dark:disabled:bg-[var(--shadow-bg-elevated)] dark:disabled:text-[var(--shadow-text-disabled)]"
        >
          {t('ratingPage.submitReview')}
        </button>
      </section>
    </div>
  )
}

export default function RatingPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const { t } = useDisplayTranslation()
  const id = storyId

  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [storedReviews, setStoredReviews] = useState([])
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false)
  const [reviewGateOpen, setReviewGateOpen] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newReviewText, setNewReviewText] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadStory() {
      setLoading(true)

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/public/stories/${id}`
        )
        const data = await response.json().catch(() => ({}))

        if (!ignore) setStory(data.story || null)
      } catch {
        if (!ignore) setStory(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStory()
    setStoredReviews(getStoredReviews(id))

    return () => {
      ignore = true
    }
  }, [id])

  const reviews = useMemo(
    () => storedReviews,
    [storedReviews]
  )

  const sortedReviews = useMemo(() => {
    const list = [...reviews]

    if (sort === 'hot') {
      return list.sort((a, b) => {
        const aReplies = Array.isArray(a.replies)
          ? a.replies.length
          : Number(a.reply_count || 0)
        const bReplies = Array.isArray(b.replies)
          ? b.replies.length
          : Number(b.reply_count || 0)
        const aScore =
          Number(a.likes || a.like_count || 0) + aReplies
        const bScore =
          Number(b.likes || b.like_count || 0) + bReplies

        return (
          bScore - aScore ||
          new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
      })
    }

    return list.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
  }, [reviews, sort])

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0

    const total = reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    )

    return total / reviews.length
  }, [reviews])

  const ratingValue = Number(
    story?.rating_average ||
      story?.rating ||
      averageRating ||
      0
  )
  const reviewCount = Number(
    story?.rating_count ||
      story?.review_count ||
      reviews.length ||
      0
  )

  const handleOpenReviewSheet = () => {
    const readEpisodes = getReviewReadEpisodes(id)

    if (
      readEpisodes.length <
      REVIEW_REQUIRED_READ_EPISODES
    ) {
      setReviewGateOpen(true)
      return
    }

    setReviewSheetOpen(true)
  }

  const handleStartReadingFromGate = () => {
    setReviewGateOpen(false)
    navigate(`/story/${id}`)
  }

  const handleCloseReviewSheet = () => {
    setReviewSheetOpen(false)
  }

  const handleSubmitReview = () => {
    if (!newRating) return

    const review = {
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),
      name: 'Reader',
      rating: newRating,
      likes: 0,
      replies: [],
      label:
        newRating >= 5
          ? 'Excellent'
          : newRating >= 4
            ? 'Good'
            : newRating >= 3
              ? 'Okay'
              : 'Needs work',
      text: newReviewText.trim(),
      created_at: new Date().toISOString(),
    }

    const nextReviews = [review, ...storedReviews]

    localStorage.setItem(
      `shadow_story_reviews_${id}`,
      JSON.stringify(nextReviews)
    )

    setStoredReviews(nextReviews)
    setNewRating(0)
    setNewReviewText('')
    setReviewSheetOpen(false)
  }

  const storyTitle =
    story?.title || t('ratingPage.untitledStory')

  return (
    <main className="app-page min-h-screen pb-24 text-[#111827] dark:text-[var(--shadow-text-primary)]">
      <section className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-none bg-[#111827] text-white shadow-sm">
          <div className="relative min-h-[220px] px-5 pb-5 pt-16">
            {story?.cover_url ? (
              <img
                src={story.cover_url}
                alt={story?.title || t('ratingPage.storyCover')}
                className="absolute inset-0 h-full w-full object-cover opacity-65"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/70 via-[#111827]/45 to-[#ff8a3d]/25" />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />

            <div className="absolute inset-x-0 top-0 z-20 flex h-14 items-center px-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white active:scale-95"
                aria-label={t('ratingPage.goBack')}
              >
                <i className="fa-solid fa-chevron-left text-[18px]" />
              </button>

              <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[20px] font-bold text-white">
                {loading
                  ? t('ratingPage.loadingStory')
                  : storyTitle}
              </h1>

              <div className="h-10 w-10 shrink-0" />
            </div>

            <div className="relative z-10 flex min-h-[140px] items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[34px] font-extrabold leading-none">
                    {ratingValue.toFixed(1)}
                  </span>
                  <StarRow
                    value={Math.round(ratingValue)}
                    size="text-[16px]"
                  />
                </div>

                <div className="mt-2 text-[12px] font-semibold text-white/75">
                  {t('ratingPage.reviewCount', {
                    count: formatShortNumber(reviewCount),
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenReviewSheet}
                className="shrink-0 rounded-full bg-white px-4 py-2 text-[12px] font-extrabold text-[#111827] active:scale-95"
              >
                {t('ratingPage.leaveReview')}
                <i className="fa-solid fa-pen-to-square ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-2 max-w-3xl rounded-t-[14px] bg-white pt-5 dark:bg-[var(--shadow-bg-surface)]">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-[14px] font-semibold text-[#111827] dark:text-[var(--shadow-text-primary)]">
            {t('ratingPage.reviewCenter')}
          </h2>

          <div className="flex items-center text-[14px] font-medium">
            <button
              type="button"
              onClick={() => setSort('hot')}
              className={
                sort === 'hot'
                  ? 'text-[#e85d75]'
                  : 'text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]'
              }
            >
              {t('ratingPage.hot')}
            </button>

            <span className="mx-3 h-4 w-px bg-[#e4e7ec] dark:bg-[var(--shadow-border)]" />

            <button
              type="button"
              onClick={() => setSort('newest')}
              className={
                sort === 'newest'
                  ? 'text-[#e85d75]'
                  : 'text-[#98a2b3] dark:text-[var(--shadow-text-tertiary)]'
              }
            >
              {t('ratingPage.new')}
            </button>
          </div>
        </div>

        <div className="mt-2 bg-white dark:bg-[var(--shadow-bg-surface)]">
          {sortedReviews.length ? (
            sortedReviews.map((review) => (
              <ReviewCard
                key={
                  review.id ||
                  `${review.created_at}-${review.rating}`
                }
                review={review}
              />
            ))
          ) : (
            <EmptyReviewState
              onWriteReview={handleOpenReviewSheet}
            />
          )}
        </div>
      </section>

      <ReviewGateModal
        open={reviewGateOpen}
        readCount={getReviewReadEpisodes(id).length}
        onClose={() => setReviewGateOpen(false)}
        onStartReading={handleStartReadingFromGate}
      />

      <ReviewBottomSheet
        open={reviewSheetOpen}
        rating={newRating}
        reviewText={newReviewText}
        onClose={handleCloseReviewSheet}
        onRatingChange={setNewRating}
        onReviewTextChange={setNewReviewText}
        onSubmit={handleSubmitReview}
      />
    </main>
  )
}
