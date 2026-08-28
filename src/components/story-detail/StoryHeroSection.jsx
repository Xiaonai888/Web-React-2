import { useEffect, useMemo, useState } from 'react'
import ReportModal from '../ReportModal'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyHeroSection', {
  en: {
    goBack: 'Go back',
    addToLibrary: 'Add to library',
    more: 'More',
    report: 'Report',
    copyLink: 'Copy link',
    echo: 'Echo',
    story: 'Story',
    storySlide: 'Story slide',
    untitledStory: 'Untitled Story',
    novel: 'Novel',
    new: 'New',
    ongoing: 'Ongoing',
    completed: 'Completed',
    showSlide: 'Show slide {{count}}',
  },
  km: {
    goBack: 'ត្រឡប់ក្រោយ',
    addToLibrary: 'បន្ថែមទៅ Library',
    more: 'បន្ថែម',
    report: 'រាយការណ៍',
    copyLink: 'ចម្លងតំណ',
    echo: 'Echo',
    story: 'រឿង',
    storySlide: 'Slide រឿង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    novel: 'Novel',
    new: 'ថ្មី',
    ongoing: 'កំពុងបន្ត',
    completed: 'បានបញ្ចប់',
    showSlide: 'បង្ហាញ Slide {{count}}',
  },
  zh: {
    goBack: '返回',
    addToLibrary: '添加到 Library',
    more: '更多',
    report: '举报',
    copyLink: '复制链接',
    echo: 'Echo',
    story: '故事',
    storySlide: '故事轮播图',
    untitledStory: '无标题故事',
    novel: '小说',
    new: '新作',
    ongoing: '连载中',
    completed: '已完结',
    showSlide: '显示轮播图 {{count}}',
  },
  ja: {
    goBack: '戻る',
    addToLibrary: 'Library に追加',
    more: 'その他',
    report: '報告',
    copyLink: 'リンクをコピー',
    echo: 'Echo',
    story: 'ストーリー',
    storySlide: 'ストーリースライド',
    untitledStory: '無題のストーリー',
    novel: '小説',
    new: '新着',
    ongoing: '連載中',
    completed: '完結',
    showSlide: 'スライド {{count}} を表示',
  },
  ko: {
    goBack: '뒤로 가기',
    addToLibrary: 'Library에 추가',
    more: '더보기',
    report: '신고',
    copyLink: '링크 복사',
    echo: 'Echo',
    story: '스토리',
    storySlide: '스토리 슬라이드',
    untitledStory: '제목 없는 스토리',
    novel: '소설',
    new: '신규',
    ongoing: '연재 중',
    completed: '완결',
    showSlide: '슬라이드 {{count}} 보기',
  },
})

const STATUS_LABEL_KEYS = {
  New: 'new',
  Ongoing: 'ongoing',
  Completed: 'completed',
}

function normalizeSlides(story) {
  const slides = Array.isArray(story?.slides)
    ? story.slides
        .filter((slide) => slide?.image_url)
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
        .slice(0, 5)
    : []

  if (slides.length) return slides

  if (story?.cover_url) {
    return [{ id: 'cover-fallback', image_url: story.cover_url, sort_order: 0 }]
  }

  return []
}

function getStoryStatus(story) {
  return story?.story_status || story?.storyStatus || 'New'
}

function getDisplayStoryStatus(status, t) {
  const key = STATUS_LABEL_KEYS[status]
  return key ? t(`storyHeroSection.${key}`) : status
}

export default function StoryHeroSection({ story, onBack, bookmarked, onToggleBookmark, onEcho }) {
  const { t } = useDisplayTranslation()
  const slides = useMemo(() => normalizeSlides(story), [story])
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [showTitleBar, setShowTitleBar] = useState(false)
  const activeSlide = slides[activeIndex] || slides[0] || null
  const storyStatus = getStoryStatus(story)
  const displayGenre = story?.main_genre || t('storyHeroSection.novel')
  const displayStatus = getDisplayStoryStatus(storyStatus, t)
  const infoLine = `${displayGenre} / ${displayStatus}`
  const titleBarTitle = story?.title || t('storyHeroSection.story')
  const heroTitle = story?.title || t('storyHeroSection.untitledStory')

  useEffect(() => {
    setActiveIndex(0)
  }, [story?.id])

  useEffect(() => {
    if (slides.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    const handleScroll = () => {
      setShowTitleBar(window.scrollY > 260)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
  `${window.location.origin}/story/${story.id}`
)
      setMenuOpen(false)
    } catch {
      setMenuOpen(false)
    }
  }

  const handleEcho = () => {
    setMenuOpen(false)
    onEcho?.()
  }

  return (
    <section className="relative bg-[var(--shadow-bg-page)]">
      <div
  className={`fixed left-0 right-0 top-0 z-50 px-4 py-3 transition-all duration-300 ${
    showTitleBar ? 'bg-[var(--shadow-nav-bg)] shadow-sm backdrop-blur' : 'bg-transparent'
  }`}
>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`flex h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
  showTitleBar
    ? 'bg-transparent text-[var(--shadow-text-primary)]'
    : 'bg-transparent text-white'
}`}
            aria-label={t('storyHeroSection.goBack')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1
  className={`min-w-0 flex-1 truncate text-left text-[18px] font-extrabold transition-opacity duration-300 ${
    showTitleBar ? 'text-[var(--shadow-text-primary)] opacity-100' : 'text-white opacity-0'
  }`}
>
            {titleBarTitle}
          </h1>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`flex h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
  showTitleBar
    ? 'bg-transparent text-[var(--shadow-text-primary)]'
    : 'bg-transparent text-white'
}`}
              aria-label={t('storyHeroSection.addToLibrary')}
            >
              <i className={`${bookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-[15px]`} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
               className={`flex h-10 w-10 items-center justify-center rounded-full active:scale-95 ${
  showTitleBar
    ? 'bg-transparent text-[var(--shadow-text-primary)]'
    : 'bg-transparent text-white'
}`}
                aria-label={t('storyHeroSection.more')}
              >
                <i className="fa-solid fa-ellipsis text-[16px]" />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-12 z-[80] w-44 overflow-hidden rounded-[18px] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-primary)] shadow-[0_18px_46px_rgba(17,24,39,0.22)] ring-1 ring-[var(--shadow-border)]">
                  <button
  type="button"
  onClick={() => {
    setMenuOpen(false)
    setReportOpen(true)
  }}
  className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-normal hover:bg-[var(--shadow-bg-hover)]"
>
  <i className="fa-regular fa-flag w-4 text-[var(--shadow-text-primary)]" />
  {t('storyHeroSection.report')}
</button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-normal hover:bg-[var(--shadow-bg-hover)]"
                  >
                    <i className="fa-solid fa-link w-4 text-[var(--shadow-text-primary)]" />
                    {t('storyHeroSection.copyLink')}
                  </button>

                  <button
                    type="button"
                    onClick={handleEcho}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-normal hover:bg-[var(--shadow-bg-hover)]"
                  >
                    <img
  src="/assets/Icons/echo.svg"
  alt={t('storyHeroSection.echo')}
    className="h-4 w-4 brightness-0 dark:invert"
 />
                    {t('storyHeroSection.echo')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[56.25vw] min-h-[200px] max-h-[520px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {activeSlide?.image_url ? (
            <img
              key={activeSlide.image_url}
              src={activeSlide.image_url}
              alt={story?.title || t('storyHeroSection.storySlide')}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#312e81]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/18 to-black/25" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--shadow-bg-page)] to-transparent" />
        </div>

        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-14 sm:pb-14">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1 text-left">
              <h2 className="whitespace-normal break-words [overflow-wrap:anywhere] text-[22px] font-bold leading-[32px] text-white drop-shadow sm:text-[32px] sm:leading-[42px]">
                {heroTitle}
              </h2>

              <div className="mt-2 text-[13px] font-extrabold text-white/90 drop-shadow sm:text-[15px]">
                {infoLine}
              </div>
            </div>

            {slides.length > 1 ? (
  <div className="mb-1 flex shrink-0 items-center justify-end gap-1">
    {slides.map((slide, index) => (
      <button
        key={slide.id || slide.image_url || index}
        type="button"
        onClick={() => setActiveIndex(index)}
        className={`h-1.5 rounded-full transition-all ${
          activeIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/55'
        }`}
        aria-label={t('storyHeroSection.showSlide', { count: index + 1 })}
      />
    ))}
  </div>
) : null}
          </div>
        </div>
       </div>

      <ReportModal
        open={reportOpen}
        reportType="story"
        targetId={story?.id}
        targetTitle={story?.title}
        onClose={() => setReportOpen(false)}
      />
    </section>
  )
}
