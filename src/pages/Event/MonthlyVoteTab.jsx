import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatNumber(value) {
  const number = Number(value || 0)
  if (!Number.isFinite(number)) return '0'
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1)}M`
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`
  return String(number)
}

function formatCountdown(targetMs, nowMs) {
  const seconds = Math.max(0, Math.floor((targetMs - nowMs) / 1000))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function getInitial(value) {
  return String(value || 'A').trim().slice(0, 1).toUpperCase()
}

function getCampaignMonthLabel(campaign, now = new Date()) {
  if (campaign?.month_key) {
    const date = new Date(`${campaign.month_key}T12:00:00.000Z`)
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Phnom_Penh',
        month: 'long',
        year: 'numeric',
      }).format(date)
    }
  }
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    month: 'long',
    year: 'numeric',
  }).format(now)
}

function getWinnerLabel(campaign) {
  if (!campaign?.ends_at) return '--'
  const date = new Date(campaign.ends_at)
  if (Number.isNaN(date.getTime())) return '--'
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function normalizeCandidate(candidate) {
  const subtitle = String(candidate?.display_subtitle || '').trim()
  const username = candidate?.candidate_type === 'author' && subtitle.startsWith('@') ? subtitle.slice(1) : ''
  return {
    id: candidate.id,
    entityId: candidate.entity_id,
    kind: candidate.candidate_type === 'author' ? 'author' : 'story',
    name: candidate.display_name || (candidate.candidate_type === 'author' ? 'Author' : 'Untitled Story'),
    subtitle: subtitle || (candidate.candidate_type === 'author' ? 'Author' : 'Story'),
    image: candidate.image_url || '',
    username,
    votes: Number(candidate.vote_count || 0),
  }
}

function CandidateImage({ candidate }) {
  if (candidate?.image) {
    return <img src={candidate.image} alt={candidate.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#fff2f6] text-[20px] font-black text-[#ff3f70]">
      {getInitial(candidate?.name)}
    </div>
  )
}

function PodiumCard({ candidate, rank, onOpen }) {
  if (!candidate) return <div className="min-w-0 flex-1" />
  const isFirst = rank === 1
  const tone = rank === 1
    ? ['text-[#f6b800]', 'border-[#f6c94f]', 'bg-[#f6b800] text-white', 'bg-[#fffaf0]']
    : rank === 2
      ? ['text-[#aab3c2]', 'border-[#d5dbe5]', 'bg-[#aab3c2] text-white', 'bg-[#fbfcff]']
      : ['text-[#d9823b]', 'border-[#edc19e]', 'bg-[#d9823b] text-white', 'bg-[#fffaf7]']

  return (
    <button type="button" onClick={() => onOpen(candidate)} className={`relative min-w-0 flex-1 rounded-[18px] border px-2 pb-3 pt-6 text-center shadow-[0_8px_22px_rgba(31,41,55,0.06)] active:scale-[0.98] ${tone[1]} ${tone[3]} ${isFirst ? '-mt-3' : 'mt-3'}`}>
      <i className={`fa-solid fa-crown absolute -top-4 left-1/2 -translate-x-1/2 text-[22px] ${tone[0]}`} />
      <div className={`relative mx-auto overflow-hidden rounded-[14px] bg-[#f3f4f6] ${isFirst ? 'h-[112px] w-[82px]' : 'h-[94px] w-[70px]'}`}>
        <CandidateImage candidate={candidate} />
        <span className={`absolute -bottom-2 left-1/2 flex h-7 min-w-7 -translate-x-1/2 items-center justify-center rounded-full px-2 text-[11px] font-black ring-2 ring-white ${tone[2]}`}>{rank}</span>
      </div>
      <div className="mt-4 line-clamp-1 text-[11px] font-black text-[#111827]">{candidate.name}</div>
      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-[#6b7280]">
        <i className="fa-solid fa-heart text-[#ff4f7a]" />
        <span>{formatNumber(candidate.votes)} Votes</span>
      </div>
    </button>
  )
}

function CandidateRow({ candidate, rank, onOpen, onVote, voting }) {
  const rankTone = rank === 1 ? 'text-[#f6b800]' : rank === 2 ? 'text-[#98a2b3]' : rank === 3 ? 'text-[#d9823b]' : 'text-[#667085]'
  return (
    <div className="flex items-center gap-3 border-b border-[#f2f3f5] px-3 py-3 last:border-b-0">
      <div className={`w-6 shrink-0 text-center text-[18px] font-black ${rankTone}`}>{rank}</div>
      <button type="button" onClick={() => onOpen(candidate)} className="h-[58px] w-[44px] shrink-0 overflow-hidden rounded-[9px] bg-[#f4f5f7] active:scale-95">
        <CandidateImage candidate={candidate} />
      </button>
      <button type="button" onClick={() => onOpen(candidate)} className="min-w-0 flex-1 text-left active:opacity-70">
        <div className="line-clamp-1 text-[12px] font-black text-[#111827]">{candidate.name}</div>
        <div className="mt-1 line-clamp-1 text-[10px] font-semibold text-[#8b93a1]">{candidate.subtitle}</div>
        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[#6b7280]">
          <i className="fa-solid fa-heart text-[#ff4f7a]" />
          <span>{formatNumber(candidate.votes)} Votes</span>
        </div>
      </button>
      <button type="button" disabled={voting} onClick={() => onVote(candidate)} className="flex h-9 min-w-[76px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff4f7a] to-[#f52f68] px-4 text-[11px] font-black text-white shadow-sm active:scale-95 disabled:opacity-60">
        <i className="fa-regular fa-heart text-[11px]" />
        {voting ? '...' : 'Vote'}
      </button>
    </div>
  )
}

function QuickLink({ icon, title, subtitle }) {
  return (
    <button type="button" className="min-w-0 rounded-[16px] border border-[#f0e8ed] bg-white p-3 text-left shadow-[0_6px_18px_rgba(31,41,55,0.04)] active:scale-[0.98]">
      <div className="flex items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70]">
          <i className={`fa-solid ${icon} text-[12px]`} />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-black text-[#111827]">{title}</span>
          <span className="mt-1 block text-[9px] font-semibold leading-4 text-[#8b93a1]">{subtitle}</span>
        </span>
      </div>
    </button>
  )
}

export default function MonthlyVoteTab() {
  const navigate = useNavigate()
  const candidatesRef = useRef(null)
  const [activeType, setActiveType] = useState('story')
  const [stories, setStories] = useState([])
  const [authors, setAuthors] = useState([])
  const [campaign, setCampaign] = useState(null)
  const [voteBalance, setVoteBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [votingId, setVotingId] = useState('')
  const [nowMs, setNowMs] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let ignore = false
    async function loadMonthlyVote() {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/monthly-vote/active`)
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load Monthly Vote')
        if (!ignore) {
          setCampaign(data.campaign || null)
          setStories((Array.isArray(data.candidates?.story) ? data.candidates.story : []).map(normalizeCandidate))
          setAuthors((Array.isArray(data.candidates?.author) ? data.candidates.author : []).map(normalizeCandidate))
        }
      } catch (error) {
        if (!ignore) {
          setCampaign(null)
          setStories([])
          setAuthors([])
          setNotice(error.message || 'Failed to load Monthly Vote')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadMonthlyVote()
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    async function loadVoteBalance() {
      const token = getReaderToken()
      if (!token) {
        setVoteBalance(0)
        return
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/monthly-vote/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json().catch(() => ({}))
        if (!ignore && response.ok && data.ok !== false) setVoteBalance(Number(data.vote_balance || 0))
      } catch {
        if (!ignore) setVoteBalance(0)
      }
    }
    loadVoteBalance()
    return () => {
      ignore = true
    }
  }, [])

  const candidates = useMemo(() => {
    const list = activeType === 'story' ? stories : authors
    return [...list].sort((first, second) => Number(second.votes || 0) - Number(first.votes || 0))
  }, [activeType, stories, authors])

  const topThree = candidates.slice(0, 3)
  const podiumOrder = [topThree[1], topThree[0], topThree[2]]
  const podiumRanks = [2, 1, 3]
  const monthLabel = getCampaignMonthLabel(campaign, new Date(nowMs))
  const winnerLabel = getWinnerLabel(campaign)
  const campaignEndsAt = campaign?.ends_at ? new Date(campaign.ends_at).getTime() : nowMs

  const handleOpen = (candidate) => {
    if (!candidate) return
    if (candidate.kind === 'author') {
      if (candidate.username) navigate(`/author/page/${candidate.username}`)
      return
    }
    if (candidate.entityId) navigate(`/story/${candidate.entityId}`)
  }

  const handleVote = async (candidate) => {
    const token = getReaderToken()
    if (!token) {
      navigate('/login')
      return
    }
    if (!campaign) {
      setNotice('Monthly Vote is not active.')
      return
    }
    if (voteBalance <= 0) {
      setNotice('Your Vote Balance is 0.')
      return
    }
    if (votingId) return

    try {
      setVotingId(candidate.id)
      setNotice('')
      const response = await fetch(`${API_BASE_URL}/api/monthly-vote/cast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ candidate_id: candidate.id, amount: 1 }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        navigate('/login')
        return
      }
      if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to cast Vote')

      const updateCandidate = (item) => item.id === candidate.id
        ? { ...item, votes: Number(data.candidate_vote_count ?? item.votes) }
        : item

      if (candidate.kind === 'author') setAuthors((current) => current.map(updateCandidate))
      else setStories((current) => current.map(updateCandidate))

      setVoteBalance(Number(data.vote_balance || 0))
      setNotice(`1 Vote sent to ${candidate.name}.`)
    } catch (error) {
      setNotice(error.message || 'Failed to cast Vote')
    } finally {
      setVotingId('')
    }
  }

  const scrollToCandidates = () => {
    candidatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="pb-4 pt-5">
      <div className="overflow-hidden rounded-[22px] border border-[#f6dce5] bg-gradient-to-br from-[#fff8fb] via-[#fff4f8] to-[#ffeef4] p-4 shadow-[0_10px_28px_rgba(255,63,112,0.10)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#ff3f70]">
              <i className="fa-solid fa-crown text-[14px]" />
              <span className="text-[10px] font-black uppercase tracking-[0.14em]">Monthly Vote</span>
            </div>
            <h2 className="mt-2 text-[24px] font-black leading-tight text-[#e91e58]">{campaign?.title || monthLabel}</h2>
            <p className="mt-1 text-[10px] font-bold text-[#9b6575]">{monthLabel}</p>
            <p className="mt-2 max-w-[360px] text-[12px] font-semibold leading-5 text-[#667085]">
              Vote for your favorite story or author and help crown this month&apos;s winner.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#ffc7d7] bg-white/80 px-3 py-2 text-[#e91e58] shadow-sm">
            <i className="fa-solid fa-ticket text-[11px]" />
            <div>
              <div className="text-[8px] font-bold leading-none text-[#9b6575]">Vote Balance</div>
              <div className="mt-1 text-[14px] font-black leading-none">{formatNumber(voteBalance)}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#667085]">
          <i className="fa-regular fa-clock text-[#111827]" />
          <span>
            {campaign ? (
              <>Ends in <span className="font-black text-[#ff3f70]">{formatCountdown(campaignEndsAt, nowMs)}</span></>
            ) : (
              <span className="font-black text-[#ff3f70]">No active Monthly Vote</span>
            )}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-full border border-[#f0e4e9] bg-white shadow-sm">
        <button type="button" onClick={() => setActiveType('story')} className={`flex h-11 items-center justify-center gap-2 text-[12px] font-black transition ${activeType === 'story' ? 'bg-gradient-to-r from-[#ff4f7a] to-[#f52f68] text-white' : 'text-[#475467]'}`}>
          <i className="fa-solid fa-book-open text-[11px]" /> Story
        </button>
        <button type="button" onClick={() => setActiveType('author')} className={`flex h-11 items-center justify-center gap-2 text-[12px] font-black transition ${activeType === 'author' ? 'bg-gradient-to-r from-[#ff4f7a] to-[#f52f68] text-white' : 'text-[#475467]'}`}>
          <i className="fa-solid fa-user text-[11px]" /> Author
        </button>
      </div>

      <section className="mt-4 rounded-[22px] border border-[#f4e5eb] bg-white p-3 shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-black text-[#111827]">Top 3 Right Now</h3>
          <button type="button" onClick={scrollToCandidates} className="text-[11px] font-black text-[#ff3f70] active:opacity-70">
            View All <i className="fa-solid fa-chevron-right ml-1 text-[9px]" />
          </button>
        </div>
        {loading ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[170px] animate-pulse rounded-[18px] bg-[#f7f7f8]" />)}
          </div>
        ) : topThree.length ? (
          <div className="mt-6 grid grid-cols-3 items-end gap-2">
            {podiumOrder.map((candidate, index) => (
              <PodiumCard key={candidate?.id || `podium-${index}`} candidate={candidate} rank={podiumRanks[index]} onOpen={handleOpen} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[16px] bg-[#f8f8fa] px-4 py-8 text-center text-[12px] font-bold text-[#8b93a1]">No candidates yet</div>
        )}
      </section>

      <section className="mt-4 rounded-[20px] border border-[#f4e5eb] bg-white p-4 shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
        <div className="text-[13px] font-black text-[#ff3f70]">My Vote Status</div>
        <div className="mt-3 grid grid-cols-3 divide-x divide-[#f1e7eb]">
          <div className="px-2 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70]"><i className="fa-solid fa-ticket text-[12px]" /></span>
            <div className="mt-2 text-[9px] font-semibold text-[#8b93a1]">Vote Balance</div>
            <div className="mt-1 text-[14px] font-black text-[#e91e58]">{formatNumber(voteBalance)}</div>
          </div>
          <div className="px-2 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70]"><i className="fa-solid fa-list text-[12px]" /></span>
            <div className="mt-2 text-[9px] font-semibold text-[#8b93a1]">Candidates</div>
            <div className="mt-1 text-[14px] font-black text-[#e91e58]">{candidates.length}</div>
          </div>
          <div className="px-2 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70]"><i className="fa-regular fa-calendar text-[12px]" /></span>
            <div className="mt-2 text-[9px] font-semibold text-[#8b93a1]">Winner</div>
            <div className="mt-1 text-[14px] font-black text-[#e91e58]">{winnerLabel}</div>
          </div>
        </div>
      </section>

      {notice ? <div className="mt-3 rounded-[14px] bg-[#fff0f4] px-4 py-3 text-[11px] font-bold text-[#d92d55]">{notice}</div> : null}

      <section ref={candidatesRef} className="mt-4 scroll-mt-24 overflow-hidden rounded-[20px] border border-[#f0e6ea] bg-white shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-[78px] animate-pulse rounded-[14px] bg-[#f7f7f8]" />)}
          </div>
        ) : candidates.length ? (
          candidates.slice(0, 8).map((candidate, index) => (
            <CandidateRow key={candidate.id} candidate={candidate} rank={index + 1} onOpen={handleOpen} onVote={handleVote} voting={votingId === candidate.id} />
          ))
        ) : (
          <div className="px-4 py-10 text-center text-[12px] font-bold text-[#8b93a1]">No candidates yet</div>
        )}
      </section>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <QuickLink icon="fa-shield" title="Rules" subtitle="Read the voting rules." />
        <QuickLink icon="fa-trophy" title="Past Winners" subtitle="See previous winners." />
        <QuickLink icon="fa-circle-question" title="How it works" subtitle="Learn about voting." />
      </div>

      <div className="sticky bottom-3 z-30 mt-4 rounded-[20px] border border-[#f2e2e8] bg-white/95 p-2 shadow-[0_14px_34px_rgba(31,41,55,0.16)] backdrop-blur">
        <div className="grid grid-cols-[1.35fr_1fr] gap-2">
          <button type="button" onClick={scrollToCandidates} className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff4f7a] to-[#f52f68] px-4 text-[13px] font-black text-white shadow-[0_10px_20px_rgba(245,47,104,0.24)] active:scale-[0.98]">
            <i className="fa-solid fa-heart" /> Vote Now
          </button>
          <button type="button" onClick={scrollToCandidates} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#ff4f7a] bg-white px-4 text-[12px] font-black text-[#ff3f70] active:scale-[0.98]">
            <i className="fa-regular fa-eye" /> View All
          </button>
        </div>
      </div>
    </section>
  )
}
