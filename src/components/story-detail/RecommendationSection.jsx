import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  return (
    <button type="button" onClick={onClick} className="min-w-0 text-left active:scale-[0.99]">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-[8px] bg-[var(--shadow-bg-soft)]">
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={story.title || 'Story cover'}
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
        {story.title || 'Untitled Story'}
      </h3>

      <p className="mt-0.5 line-clamp-1 text-[12px] font-semibold text-[var(--shadow-text-secondary)]">
        {story.main_genre || 'Story'}
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
  const navigate = useNavigate()
  const [authorStories, setAuthorStories] = useState([])

  const [similarStories, setSimilarStories] = useState([])
  const [loading, setLoading] = useState(true)

  const authorName =
    story?.author_page?.page_name ||
    story?.authorPage?.page_name ||
    story?.author?.page_name ||
    story?.author_name ||
    'Author'

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
            <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">More by {authorName}</h2>
          </div>


          {loading ? (
            <EmptyCard
              icon="fa-solid fa-spinner fa-spin"
              title="Loading stories..."
              text="Please wait while recommendations are loading."
            />
          ) : (
            <StoryGrid
              stories={authorSectionStories}
              emptyIcon="fa-solid fa-pen-nib"
              emptyTitle="No other stories yet"
              emptyText="This author does not have more published stories yet."
              onOpenStory={handleOpenStory}
            />
          )}
        </div>
      ) : null}

      <div className="bg-[var(--shadow-bg-surface)] px-4 pb-4 pt-[5px] sm:rounded-[28px] sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[var(--shadow-border)]">
  <div className="mb-3">
    <h2 className="text-[16px] font-bold text-[var(--shadow-text-primary)]">You Might Like</h2>
  </div>

        {loading ? (
          <EmptyCard
            icon="fa-solid fa-spinner fa-spin"
            title="Loading similar stories..."
            text="Please wait while similar stories are loading."
          />
        ) : (
          <StoryGrid
            stories={similarStories}
            emptyIcon="fa-regular fa-compass"
            emptyTitle="No similar stories yet"
            emptyText="Similar stories will appear after more published stories are available."
            onOpenStory={handleOpenStory}
          />
        )}
      </div>
    </section>
  )
}
