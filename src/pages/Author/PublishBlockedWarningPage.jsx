import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

function normalizeMatches(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => ({
      id: item?.id || `${item?.word || 'word'}-${item?.category || 'custom'}`,
      word: String(item?.word || '').trim(),
      category: String(item?.category || 'custom').trim(),
      severity: String(item?.severity || 'medium').trim(),
    }))
    .filter((item) => item.word)
}

function Pill({ children, type }) {
  const className =
    type === 'high'
      ? 'bg-[#fee2e2] text-[#b91c1c]'
      : type === 'medium'
        ? 'bg-[#fef3c7] text-[#b45309]'
        : 'bg-[#e0f2fe] text-[#0369a1]'

  return (
    <span className={`inline-flex h-7 items-center rounded-full px-3 text-[11px] font-extrabold uppercase tracking-[0.3px] ${className}`}>
      {children}
    </span>
  )
}

export default function PublishBlockedWarningPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()

  const matches = useMemo(() => normalizeMatches(location.state?.blockedWords), [location.state])
  const episodeId = location.state?.episodeId || ''
  const editPath = episodeId
    ? `/author/story/${storyId}/episode/create?episodeId=${episodeId}`
    : `/author/story/${storyId}/episode/create`

  if (!matches.length) {
    return <Navigate to={`/author/story/${storyId}/manage`} replace />
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6">
      <main className="mx-auto max-w-[760px]">
        <section className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="border-b border-[#fee2e2] bg-[#fff7f7] px-5 py-6 sm:px-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fee2e2] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.5px] text-[#b91c1c]">
              <i className="fa-solid fa-triangle-exclamation text-[12px]" />
              Publishing Blocked
            </div>

            <h1 className="mt-4 text-[26px] font-black leading-tight tracking-[-0.04em] text-[#111827] sm:text-[32px]">
              Your episode can’t be published yet
            </h1>

            <p className="mt-3 text-[14px] font-semibold leading-6 text-[#667085]">
              Your content contains restricted words that may be related to adult, violent, or unsafe content. Please remove or edit these words before publishing again.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-7">
            <div className="rounded-[22px] border border-[#fecaca] bg-[#fffafa] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-[#b91c1c]">
                  <i className="fa-solid fa-ban text-[15px]" />
                </div>

                <div>
                  <h2 className="text-[16px] font-black text-[#111827]">Restricted words found</h2>
                  <p className="mt-1 text-[12.5px] font-semibold leading-5 text-[#667085]">
                    Review the words below, then go back to your episode editor and remove or rewrite them.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {matches.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-[#fee2e2] bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[15px] font-black text-[#111827]">{item.word}</div>
                        <div className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.35px] text-[#98a2b3]">
                          Category: {item.category}
                        </div>
                      </div>

                      <Pill type={item.severity}>{item.severity}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[20px] bg-[#f8fafc] px-4 py-3 text-[12.5px] font-semibold leading-5 text-[#667085]">
              Tip: Copy each restricted word and search inside your editor to find it faster.
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate(editPath, { replace: true })}
                className="rounded-full bg-[#111827] px-5 py-4 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99]"
              >
                Back to Edit Episode
              </button>

              <button
                type="button"
                onClick={() => navigate(`/author/story/${storyId}/manage`, { replace: true })}
                className="rounded-full border border-[#e4e7ec] bg-white px-5 py-4 text-[14px] font-extrabold text-[#111827] active:scale-[0.99]"
              >
                Story Manager
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
