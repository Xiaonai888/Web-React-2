import { useNavigate, useParams } from 'react-router-dom'
import CommentSection from '../components/comments/CommentSection'

export default function StoryCommentsPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eef1f5] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-center text-[18px] font-black">Comments</h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      <CommentSection targetType="story" targetId={id} />
    </main>
  )
}
