import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('recommendationSection', {
  en: {
    author: 'Author',
    storyCover: 'Story cover',
    untitledStory: 'Untitled Story',
    story: 'Story',
    moreBy: 'More by {{author}}',
    loadingStories: 'Loading stories...',
    waitRecommendations: 'Please wait while recommendations are loading.',
    noOtherStories: 'No other stories yet',
    noOtherStoriesText: 'This author does not have more published stories yet.',
    youMightLike: 'You Might Like',
    loadingSimilar: 'Loading similar stories...',
    waitSimilar: 'Please wait while similar stories are loading.',
    noSimilarStories: 'No similar stories yet',
    noSimilarStoriesText: 'Similar stories will appear after more published stories are available.',
  },
  km: {
    author: 'អ្នកនិពន្ធ',
    storyCover: 'គម្របរឿង',
    untitledStory: 'រឿងគ្មានចំណងជើង',
    story: 'រឿង',
    moreBy: 'រឿងផ្សេងទៀតពី {{author}}',
    loadingStories: 'កំពុងផ្ទុករឿង...',
    waitRecommendations: 'សូមរង់ចាំ ខណៈកំពុងផ្ទុករឿងណែនាំ។',
    noOtherStories: 'មិនទាន់មានរឿងផ្សេងទៀត',
    noOtherStoriesText: 'អ្នកនិពន្ធនេះមិនទាន់មានរឿងផ្សេងដែលបានបោះពុម្ពទេ។',
    youMightLike: 'អ្នកប្រហែលជាចូលចិត្ត',
    loadingSimilar: 'កំពុងផ្ទុករឿងស្រដៀង...',
    waitSimilar: 'សូមរង់ចាំ ខណៈកំពុងផ្ទុករឿងស្រដៀង។',
    noSimilarStories: 'មិនទាន់មានរឿងស្រដៀង',
    noSimilarStoriesText: 'រឿងស្រដៀងនឹងបង្ហាញនៅពេលមានរឿងដែលបានបោះពុម្ពបន្ថែម។',
  },
  zh: {
    author: '作者',
    storyCover: '故事封面',
    untitledStory: '无标题故事',
    story: '故事',
    moreBy: '{{author}} 的更多作品',
    loadingStories: '正在加载故事...',
    waitRecommendations: '推荐内容正在加载，请稍候。',
    noOtherStories: '暂无其他故事',
    noOtherStoriesText: '该作者暂时没有更多已发布的故事。',
    youMightLike: '你可能喜欢',
    loadingSimilar: '正在加载相似故事...',
    waitSimilar: '相似故事正在加载，请稍候。',
    noSimilarStories: '暂无相似故事',
    noSimilarStoriesText: '有更多故事发布后，相似故事会显示在这里。',
  },
  ja: {
    author: '作者',
    storyCover: 'ストーリー表紙',
    untitledStory: '無題のストーリー',
    story: 'ストーリー',
    moreBy: '{{author}} の他の作品',
    loadingStories: 'ストーリーを読み込み中...',
    waitRecommendations: 'おすすめを読み込んでいます。しばらくお待ちください。',
    noOtherStories: '他のストーリーはまだありません',
    noOtherStoriesText: 'この作者には、まだ他の公開済みストーリーがありません。',
    youMightLike: 'あなたへのおすすめ',
    loadingSimilar: '似ているストーリーを読み込み中...',
    waitSimilar: '似ているストーリーを読み込んでいます。しばらくお待ちください。',
    noSimilarStories: '似ているストーリーはまだありません',
    noSimilarStoriesText: '公開済みストーリーが増えると、似ているストーリーが表示されます。',
  },
  ko: {
    author: '작가',
    storyCover: '스토리 표지',
    untitledStory: '제목 없는 스토리',
    story: '스토리',
    moreBy: '{{author}}의 다른 작품',
    loadingStories: '스토리 불러오는 중...',
    waitRecommendations: '추천 스토리를 불러오는 중입니다. 잠시 기다려 주세요.',
    noOtherStories: '다른 스토리가 아직 없습니다',
    noOtherStoriesText: '이 작가는 아직 다른 게시된 스토리가 없습니다.',
    youMightLike: '추천 스토리',
    loadingSimilar: '비슷한 스토리 불러오는 중...',
    waitSimilar: '비슷한 스토리를 불러오는 중입니다. 잠시 기다려 주세요.',
    noSimilarStories: '비슷한 스토리가 아직 없습니다',
    noSimilarStoriesText: '게시된 스토리가 더 많아지면 비슷한 스토리가 표시됩니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function EmptyCard({ title, text, icon }) {
  return (
    <div className="rounded-[22px] bg-[var(--shadow-bg-soft)] p-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-sm ring-1 ring-[var(--shadow-border)]">
        <i className={`${icon} text-[18px]`} />
      </div>
      <div className="mt-3 text-[14px] font-black text-[var(--shadow-text-primary)]">{title}</div>
      <div className="mt-1 text-[12px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">{text}</div>
    </div>
  )
}

function BookCard({ story, onClick }) {
  const { t } = useDisplayTranslation()

  return (
    <button type="button" onClick={onClick} className="min-w-0 text-left active:scale-[0.99]">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={story.title || t('recommendationSection.storyCover')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--shadow-text-secondary)]">
            <i className="fa-regular fa-bookmark text-[20px]" />
          </div>
        )}
      </div>

      <h3
         className="mt-2 h-8 max-w-full overflow-hidden text-[14px] font-bold leading-4 text-[var(--shadow-text-primary)]"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflowWrap: 'anywhere',
        }}
      >
        {story.title || t('recommendationSection.untitledStory')}
      </h3>

      <p className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
        {story.main_genre || t('recommendationSection.story')}
      </p>
    </button>
  )
}

function StoryGrid({ stories, emptyTitle, emptyText, emptyIcon, onOpenStory }) {
  if (!stories.length) {
    return <EmptyCard icon={emptyIcon} title={emptyTitle} text={emptyText} />
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {stories.slice(0, 3).map((item) => (
        <BookCard key={item.id} story={item} onClick={() => onOpenStory(item.id)} />
      ))}
    </div>
  )
}

export default function RecommendationSection({ story }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const [authorStories, setAuthorStories] = useState([])

  const [similarStories, setSimilarStories] = useState([])
  const [loading, setLoading] = useState(true)

  const authorName =
    story?.author_page?.page_name ||
    story?.authorPage?.page_name ||
    story?.author?.page_name ||
    story?.author_name ||
    t('recommendationSection.author')

  useEffect(() => {
  let ignore = false

  async function loadRecommendations() {
    if (!story?.id) return

    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (story.author_id) {
        params.set(
          'authorId',
          story.author_id
        )
      }

      if (story.main_genre) {
        params.set(
          'genre',
          story.main_genre
        )
      }

      const response = await fetch(
        `${API_BASE_URL}/api/public/stories/${encodeURIComponent(
          story.id
        )}/recommendations?${params.toString()}`
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (
        !response.ok ||
        data.ok === false
      ) {
        throw new Error(
          data.message ||
            'Failed to load recommendations'
        )
      }

      if (ignore) return

      setAuthorStories(
        Array.isArray(data.author_stories)
          ? data.author_stories
          : []
      )

      setSimilarStories(
        Array.isArray(data.similar_stories)
          ? data.similar_stories
          : []
      )
    } catch {
      if (ignore) return

      setAuthorStories([])
      setSimilarStories([])
    } finally {
      if (!ignore) {
        setLoading(false)
      }
    }
  }

  loadRecommendations()

  return () => {
    ignore = true
  }
}, [
  story?.author_id,
  story?.id,
  story?.main_genre,
])

  const authorSectionStories = useMemo(() => {
    return authorStories
  }, [authorStories])

  const handleOpenStory = (storyId) => {
    if (!storyId) return
    navigate(`/story/${storyId}`, {
      state: { returnTo: `/story/${story.id}` },
    })
  }

  return (
    <section className="mt-2 space-y-0 sm:mt-4 sm:space-y-4">
      {loading || authorSectionStories.length ? (
       <div className="bg-[var(--shadow-bg-surface)] px-4 pb-1 pt-3 sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
  <div className="mb-3">
            <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
              {t('recommendationSection.moreBy', {
                author: authorName,
              })}
            </h2>
          </div>

          {loading ? (
            <EmptyCard
              icon="fa-solid fa-spinner fa-spin"
              title={t('recommendationSection.loadingStories')}
              text={t('recommendationSection.waitRecommendations')}
            />
          ) : (
            <StoryGrid
              stories={authorSectionStories}
              emptyIcon="fa-solid fa-pen-nib"
              emptyTitle={t('recommendationSection.noOtherStories')}
              emptyText={t('recommendationSection.noOtherStoriesText')}
              onOpenStory={handleOpenStory}
            />
          )}
        </div>
      ) : null}

      <div className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-[5px] sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
  <div className="mb-3">
    <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">
      {t('recommendationSection.youMightLike')}
    </h2>
  </div>

        {loading ? (
          <EmptyCard
            icon="fa-solid fa-spinner fa-spin"
            title={t('recommendationSection.loadingSimilar')}
            text={t('recommendationSection.waitSimilar')}
          />
        ) : (
          <StoryGrid
            stories={similarStories}
            emptyIcon="fa-regular fa-compass"
            emptyTitle={t('recommendationSection.noSimilarStories')}
            emptyText={t('recommendationSection.noSimilarStoriesText')}
            onOpenStory={handleOpenStory}
          />
        )}
      </div>
    </section>
  )
}
