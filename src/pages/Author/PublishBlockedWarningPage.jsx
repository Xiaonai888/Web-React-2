import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

const severityRank = {
  low: 1,
  medium: 2,
  high: 3,
}

function normalizeMatches(value) {
  if (!Array.isArray(value)) return []

  const grouped = new Map()

  value.forEach((item) => {
    const word = String(item?.word || '').trim()
    if (!word) return

    const key = word.toLowerCase()
    const count = Number(item?.count || item?.matched_count || 1)

    if (grouped.has(key)) {
      const oldItem = grouped.get(key)
      grouped.set(key, {
        ...oldItem,
        count: oldItem.count + count,
      })
      return
    }

    grouped.set(key, {
      id: item?.id || `${word}-${item?.category || 'custom'}`,
      word,
      category: String(item?.category || 'custom').trim().toLowerCase(),
      severity: String(item?.severity || 'medium').trim().toLowerCase(),
      count,
    })
  })

  return Array.from(grouped.values())
}

function getMainIssue(matches) {
  if (!matches.length) return { category: 'restricted content', severity: 'medium' }

  return [...matches].sort((a, b) => {
    const severityDiff = (severityRank[b.severity] || 2) - (severityRank[a.severity] || 2)
    if (severityDiff !== 0) return severityDiff
    return b.count - a.count
  })[0]
}

function IssueBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#fee2e2] px-3 py-1 text-[11px] font-black uppercase tracking-[0.35px] text-[#b91c1c]">
      {children}
    </span>
  )
}

export default function PublishBlockedWarningPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storyId } = useParams()
  const [copied, setCopied] = useState(false)

  const matches = useMemo(() => normalizeMatches(location.state?.blockedWords), [location.state])
  const episodeId = location.state?.episodeId || ''
  const editPath = episodeId
  ? `/author/story/${storyId}/episode/create?editEpisodeId=${episodeId}&fromPublishWarning=1`
  : `/author/story/${storyId}/episode/create?fromPublishWarning=1`

  const mainIssue = useMemo(() => getMainIssue(matches), [matches])
  const totalMatches = useMemo(() => matches.reduce((sum, item) => sum + item.count, 0), [matches])
  const allWordsText = useMemo(() => matches.map((item) => item.word).join('\n'), [matches])

  const copyAllWords = async () => {
    try {
      await navigator.clipboard.writeText(allWordsText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

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
              This episode contains restricted content. Please remove or rewrite the words below before publishing again.
            </p>
          </div>

          <div className="px-5 py-5 sm:px-7">
            <div className="rounded-[24px] border border-[#fecaca] bg-[#fffafa] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-[#b91c1c]">
                  <i className="fa-solid fa-ban text-[16px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-black text-[#111827]">Issue Summary</h2>
                  <p className="mt-1 text-[12.5px] font-semibold leading-5 text-[#667085]">
                    The strongest issue is shown here. The words are grouped below for faster editing.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#fee2e2]">
                  <div className="text-[11px] font-black uppercase tracking-[0.4px] text-[#98a2b3]">Main Issue</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <IssueBadge>{mainIssue.category}</IssueBadge>
                    <IssueBadge>{mainIssue.severity}</IssueBadge>
                  </div>
                </div>

                <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#fee2e2]">
                  <div className="text-[11px] font-black uppercase tracking-[0.4px] text-[#98a2b3]">Restricted Words</div>
                  <div className="mt-2 text-[24px] font-black leading-none text-[#111827]">{matches.length}</div>
                </div>

                <div className="rounded-[18px] bg-white p-4 ring-1 ring-[#fee2e2]">
                  <div className="text-[11px] font-black uppercase tracking-[0.4px] text-[#98a2b3]">Total Matches</div>
                  <div className="mt-2 text-[24px] font-black leading-none text-[#111827]">{totalMatches}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={copyAllWords}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111827] px-5 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.18)] active:scale-[0.99] sm:w-auto"
              >
                <i className="fa-regular fa-copy text-[13px]" />
                {copied ? 'Copied All Words' : 'Copy All Words'}
              </button>
            </div>

            <section className="mt-5 rounded-[24px] bg-white p-4 ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-black text-[#111827]">Restricted words</h2>
                  <p className="mt-1 text-[12px] font-semibold text-[#98a2b3]">
                    Each word is shown once with its match count.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {matches.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 rounded-full border border-[#fee2e2] bg-[#fffafa] px-3.5 py-2 text-[12.5px] font-extrabold text-[#111827]"
                  >
                    <span>{item.word}</span>
                    <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[10.5px] font-black text-[#b91c1c]">
                      ×{item.count}
                    </span>
                  </span>
                ))}
              </div>
            </section>

            <div className="mt-5 rounded-[20px] bg-[#f8fafc] px-4 py-3 text-[12.5px] font-semibold leading-5 text-[#667085]">
              Tip: Use Copy All Words, then paste the list somewhere safe. Search each word inside your episode editor and rewrite it.
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
  navigate('/author/dashboard', { replace: true })
  window.setTimeout(() => {
    navigate(editPath)
  }, 0)
}}
                className="rounded-full bg-[#111827] px-5 py-4 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:scale-[0.99]"
              >
                Back to Edit Episode
              </button>

              <button
                type="button"
                onClick={() => {
  navigate('/author/dashboard', { replace: true })
  window.setTimeout(() => {
    navigate(`/author/story/${storyId}/manage`)
  }, 0)
}}
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
