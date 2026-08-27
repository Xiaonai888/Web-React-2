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
    rank: Number(candidate.rank || candidate.final_rank || 0),
  }
}


function getDefaultDesign() {
  return {
    badge_text: 'MONTHLY VOTE',
    hero_title: '',
    hero_description: 'Vote for your favorite story or author and help crown this month\'s winner.',
    hero_image_url: '',
    background_type: 'gradient',
    background_value: 'linear-gradient(135deg,#fff8fb,#fff4f8,#ffeef4)',
    text_color: '#111827',
    accent_color: '#ff3f70',
    cta_text: '',
    cta_url: '',
    show_hero_image: true,
    show_countdown: true,
    show_vote_balance: true,
    show_top_three: true,
    show_candidate_list: true,
  }
}

function getHeroBackground(design) {
  if (design?.background_type === 'image' && design?.background_value) {
    return {
      backgroundImage: `linear-gradient(rgba(255,255,255,.08),rgba(255,255,255,.08)), url("${design.background_value}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }
  }

  if (design?.background_type === 'solid') {
    return { background: design.background_value || '#fff4f8' }
  }

  return {
    background: design?.background_value || 'linear-gradient(135deg,#fff8fb,#fff4f8,#ffeef4)',
  }
}

function AnnouncementCard({ item, onOpen }) {
  return (
    <section
      className="mt-4 overflow-hidden rounded-[20px] border border-black/5 p-4 shadow-[0_8px_24px_rgba(31,41,55,0.06)]"
      style={{ background: item.background_color || '#ffffff', color: item.text_color || '#111827' }}
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title || 'Event announcement'}
          className="mb-3 max-h-[260px] w-full rounded-[16px] object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      {item.badge_text ? (
        <div
          className="text-[9px] font-black uppercase tracking-[0.14em]"
          style={{ color: item.accent_color || '#ff3f70' }}
        >
          {item.badge_text}
        </div>
      ) : null}

      {item.title ? <h3 className="mt-1 text-[17px] font-black leading-snug">{item.title}</h3> : null}
      {item.description ? <p className="mt-2 text-[11px] font-semibold leading-5 opacity-75">{item.description}</p> : null}

      {item.button_text && item.button_url ? (
        <button
          type="button"
          onClick={() => onOpen(item.button_url)}
          className="mt-3 min-h-9 rounded-full px-4 text-[11px] font-black text-white active:scale-[0.98]"
          style={{ background: item.accent_color || '#ff3f70' }}
        >
          {item.button_text}
        </button>
      ) : null}
    </section>
  )
}

function CandidateImage({ candidate }) {
  if (candidate?.image) {
    return <img src={candidate.image} alt={candidate.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#fff2f6] text-[20px] font-black text-[#ff3f70] dark:bg-rose-500/10 dark:text-rose-300">
      {getInitial(candidate?.name)}
    </div>
  )
}

function PodiumCard({ candidate, rank, onOpen }) {
  if (!candidate) return <div className="min-w-0 flex-1" />
  const isFirst = rank === 1
  const tone = rank === 1
    ? ['text-[#f6b800]', 'border-[#f6c94f] dark:border-amber-400/30', 'bg-[#f6b800] text-white', 'bg-[#fffaf0] dark:bg-amber-500/10']
    : rank === 2
      ? ['text-[#aab3c2]', 'border-[#d5dbe5] dark:border-slate-400/30', 'bg-[#aab3c2] text-white', 'bg-[#fbfcff] dark:bg-slate-500/10']
      : ['text-[#d9823b]', 'border-[#edc19e] dark:border-orange-400/30', 'bg-[#d9823b] text-white', 'bg-[#fffaf7] dark:bg-orange-500/10']

  return (
    <button type="button" onClick={() => onOpen(candidate)} className={`relative min-w-0 flex-1 rounded-[18px] border px-2 pb-3 pt-6 text-center shadow-[0_8px_22px_rgba(31,41,55,0.06)] active:scale-[0.98] ${tone[1]} ${tone[3]} ${isFirst ? '-mt-3' : 'mt-3'}`}>
      <i className={`fa-solid fa-crown absolute -top-4 left-1/2 -translate-x-1/2 text-[22px] ${tone[0]}`} />
      <div className={`relative mx-auto overflow-hidden rounded-[14px] bg-[var(--shadow-bg-soft)] ${isFirst ? 'h-[112px] w-[82px]' : 'h-[94px] w-[70px]'}`}>
        <CandidateImage candidate={candidate} />
        <span className={`absolute -bottom-2 left-1/2 flex h-7 min-w-7 -translate-x-1/2 items-center justify-center rounded-full px-2 text-[11px] font-black ring-2 ring-white dark:ring-[var(--shadow-bg-surface)] ${tone[2]}`}>{rank}</span>
      </div>
      <div className="mt-4 line-clamp-1 text-[11px] font-black text-[var(--shadow-text-primary)]">{candidate.name}</div>
      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-[var(--shadow-text-secondary)]">
        <i className="fa-solid fa-heart text-[#ff4f7a]" />
        <span>{formatNumber(candidate.votes)} Votes</span>
      </div>
    </button>
  )
}

function CandidateRow({ candidate, rank, onOpen, onVote, voting }) {
  const rankTone = rank === 1 ? 'text-[#f6b800]' : rank === 2 ? 'text-[var(--shadow-text-tertiary)] dark:text-slate-300' : rank === 3 ? 'text-[#d9823b]' : 'text-[var(--shadow-text-secondary)]'
  return (
    <div className="flex items-center gap-3 border-b border-[var(--shadow-border)] px-3 py-3 last:border-b-0">
      <div className={`w-6 shrink-0 text-center text-[18px] font-black ${rankTone}`}>{rank}</div>
      <button type="button" onClick={() => onOpen(candidate)} className="h-[58px] w-[44px] shrink-0 overflow-hidden rounded-[9px] bg-[var(--shadow-bg-soft)] active:scale-95">
        <CandidateImage candidate={candidate} />
      </button>
      <button type="button" onClick={() => onOpen(candidate)} className="min-w-0 flex-1 text-left active:opacity-70">
        <div className="line-clamp-1 text-[12px] font-black text-[var(--shadow-text-primary)]">{candidate.name}</div>
        <div className="mt-1 line-clamp-1 text-[10px] font-semibold text-[var(--shadow-text-secondary)]">{candidate.subtitle}</div>
        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-[var(--shadow-text-secondary)]">
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

function QuickLink({ icon, title, subtitle, onClick }) {
  return (
    <button type="button" onClick={onClick} className="min-w-0 rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 text-left shadow-[0_6px_18px_rgba(31,41,55,0.04)] active:scale-[0.98]">
      <div className="flex items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70] dark:bg-rose-500/10 dark:text-rose-300">
          <i className={`fa-solid ${icon} text-[12px]`} />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-black text-[var(--shadow-text-primary)]">{title}</span>
          <span className="mt-1 block text-[9px] font-semibold leading-4 text-[var(--shadow-text-secondary)]">{subtitle}</span>
        </span>
      </div>
    </button>
  )
}

function WinnerItem({ winner, onOpen }) {
  const candidate = normalizeCandidate(winner)
  const rankTone =
    candidate.rank === 1
      ? 'bg-[#fff8dc] text-[#c58b00]'
      : candidate.rank === 2
        ? 'bg-[#f3f5f8] text-[#7c8798]'
        : 'bg-[#fff2e8] text-[#b96b2e]'

  return (
    <button type="button" onClick={() => onOpen(candidate)} className="flex w-full items-center gap-3 rounded-[14px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-2.5 text-left active:scale-[0.99]">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-black ${rankTone}`}>
        {candidate.rank}
      </span>
      <span className={`shrink-0 overflow-hidden bg-[var(--shadow-bg-soft)] ${candidate.kind === 'author' ? 'h-11 w-11 rounded-full' : 'h-12 w-9 rounded-[8px]'}`}>
        <CandidateImage candidate={candidate} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block line-clamp-1 text-[11px] font-black text-[var(--shadow-text-primary)]">{candidate.name}</span>
        <span className="mt-1 block line-clamp-1 text-[9px] font-semibold text-[var(--shadow-text-secondary)]">{candidate.subtitle}</span>
      </span>
      <span className="shrink-0 text-[10px] font-black text-[#ff3f70]">{formatNumber(candidate.votes)}</span>
    </button>
  )
}

function PastWinnersModal({ campaigns, loading, error, onClose, onOpen }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div className="max-h-[82vh] w-full max-w-[520px] overflow-hidden rounded-t-[24px] bg-[var(--shadow-bg-elevated)] shadow-2xl sm:rounded-[24px]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#ff3f70]">Monthly Vote</div>
            <h3 className="mt-1 text-[18px] font-black text-[var(--shadow-text-primary)]">Past Winners</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-secondary)] active:scale-95">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="max-h-[calc(82vh-76px)] overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-[190px] animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[16px] bg-[#fff0f4] px-4 py-8 text-center text-[11px] font-bold text-[#d92d55] dark:bg-rose-500/10 dark:text-rose-300">{error}</div>
          ) : campaigns.length ? (
            <div className="space-y-4">
              {campaigns.map((item) => (
                <section key={item.id} className="rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-[0_6px_18px_rgba(31,41,55,0.04)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-black text-[var(--shadow-text-primary)]">{item.title}</div>
                      <div className="mt-1 text-[9px] font-bold text-[#9b6575]">{getCampaignMonthLabel(item)}</div>
                    </div>
                    <span className="rounded-full bg-[#fff0f5] px-2.5 py-1 text-[9px] font-black text-[#ff3f70] dark:bg-rose-500/10 dark:text-rose-300">Ended</span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-black text-[var(--shadow-text-secondary)]">
                        <i className="fa-solid fa-book-open text-[#ff3f70]" /> Story
                      </div>
                      <div className="space-y-2">
                        {(item.winners?.story || []).length ? (
                          item.winners.story.map((winner) => (
                            <WinnerItem key={winner.id} winner={winner} onOpen={onOpen} />
                          ))
                        ) : (
                          <div className="rounded-[12px] bg-[var(--shadow-bg-soft)] px-3 py-5 text-center text-[9px] font-bold text-[var(--shadow-text-tertiary)]">No Story winner</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-black text-[var(--shadow-text-secondary)]">
                        <i className="fa-solid fa-user text-[#ff3f70]" /> Author
                      </div>
                      <div className="space-y-2">
                        {(item.winners?.author || []).length ? (
                          item.winners.author.map((winner) => (
                            <WinnerItem key={winner.id} winner={winner} onOpen={onOpen} />
                          ))
                        ) : (
                          <div className="rounded-[12px] bg-[var(--shadow-bg-soft)] px-3 py-5 text-center text-[9px] font-bold text-[var(--shadow-text-tertiary)]">No Author winner</div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-10 text-center text-[11px] font-bold text-[var(--shadow-text-secondary)]">No previous winners yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MonthlyVoteTab() {
  const navigate = useNavigate()
  const candidatesRef = useRef(null)
  const [activeType, setActiveType] = useState('story')
  const [stories, setStories] = useState([])
  const [authors, setAuthors] = useState([])
  const [campaign, setCampaign] = useState(null)
  const [design, setDesign] = useState(getDefaultDesign())
  const [announcements, setAnnouncements] = useState([])
  const [voteBalance, setVoteBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')
  const [votingId, setVotingId] = useState('')
  const [nowMs, setNowMs] = useState(Date.now())
  const [showPastWinners, setShowPastWinners] = useState(false)
  const [pastWinners, setPastWinners] = useState([])
  const [pastWinnersLoading, setPastWinnersLoading] = useState(false)
  const [pastWinnersError, setPastWinnersError] = useState('')

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
          setDesign({ ...getDefaultDesign(), ...(data.design || {}) })
          setAnnouncements(Array.isArray(data.announcements) ? data.announcements : [])
          setStories((Array.isArray(data.candidates?.story) ? data.candidates.story : []).map(normalizeCandidate))
          setAuthors((Array.isArray(data.candidates?.author) ? data.candidates.author : []).map(normalizeCandidate))
        }
      } catch (error) {
        if (!ignore) {
          setCampaign(null)
          setDesign(getDefaultDesign())
          setAnnouncements([])
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
  const heroTitle = design.hero_title || campaign?.title || monthLabel
  const heroDescription = design.hero_description || getDefaultDesign().hero_description
  const heroStyle = {
    ...getHeroBackground(design),
    color: design.text_color || '#111827',
  }


  const handleActionLink = (url) => {
    const target = String(url || '').trim()
    if (!target) return

    if (target.startsWith('/') && !target.startsWith('//')) {
      navigate(target)
      return
    }

    if (/^https?:\/\//i.test(target)) {
      window.location.assign(target)
    }
  }

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

  const openPastWinners = async () => {
    setShowPastWinners(true)

    if (pastWinners.length || pastWinnersLoading) return

    try {
      setPastWinnersLoading(true)
      setPastWinnersError('')

      const response = await fetch(`${API_BASE_URL}/api/monthly-vote/previous-winners?limit=6`)
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to load previous winners')
      }

      setPastWinners(Array.isArray(data.campaigns) ? data.campaigns : [])
    } catch (error) {
      setPastWinners([])
      setPastWinnersError(error.message || 'Failed to load previous winners')
    } finally {
      setPastWinnersLoading(false)
    }
  }

  const scrollToCandidates = () => {
    candidatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="pb-4 pt-5">
      <div
        className="overflow-hidden rounded-[22px] border border-black/5 p-4 shadow-[0_10px_28px_rgba(31,41,55,0.10)]"
        style={heroStyle}
      >
        {design.show_hero_image && design.hero_image_url ? (
          <img
            src={design.hero_image_url}
            alt={heroTitle}
            className="mb-4 max-h-[300px] w-full rounded-[18px] object-cover"
            loading="eager"
            decoding="async"
          />
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2" style={{ color: design.accent_color || '#ff3f70' }}>
              <i className="fa-solid fa-crown text-[14px]" />
              <span className="text-[10px] font-black uppercase tracking-[0.14em]">
                {design.badge_text || 'MONTHLY VOTE'}
              </span>
            </div>

            <h2 className="mt-2 text-[24px] font-black leading-tight" style={{ color: design.accent_color || '#e91e58' }}>
              {heroTitle}
            </h2>

            <p className="mt-1 text-[10px] font-bold opacity-60">{monthLabel}</p>

            {heroDescription ? (
              <p className="mt-2 max-w-[390px] text-[12px] font-semibold leading-5 opacity-75">
                {heroDescription}
              </p>
            ) : null}

            {design.cta_text && design.cta_url ? (
              <button
                type="button"
                onClick={() => handleActionLink(design.cta_url)}
                className="mt-3 min-h-10 rounded-full px-5 text-[11px] font-black text-white shadow-sm active:scale-[0.98]"
                style={{ background: design.accent_color || '#ff3f70' }}
              >
                {design.cta_text}
              </button>
            ) : null}
          </div>

          {design.show_vote_balance ? (
            <div
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-black/45"
              style={{ color: design.accent_color || '#e91e58' }}
            >
              <i className="fa-solid fa-ticket text-[11px]" />
              <div>
                <div className="text-[8px] font-bold leading-none opacity-60">Vote Balance</div>
                <div className="mt-1 text-[14px] font-black leading-none">{formatNumber(voteBalance)}</div>
              </div>
            </div>
          ) : null}
        </div>

        {design.show_countdown ? (
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold opacity-75">
            <i className="fa-regular fa-clock" />
            <span>
              {campaign ? (
                <>Ends in <span className="font-black" style={{ color: design.accent_color || '#ff3f70' }}>{formatCountdown(campaignEndsAt, nowMs)}</span></>
              ) : (
                <span className="font-black" style={{ color: design.accent_color || '#ff3f70' }}>No active Monthly Vote</span>
              )}
            </span>
          </div>
        ) : null}
      </div>

      {announcements.map((item) => (
        <AnnouncementCard key={item.id} item={item} onOpen={handleActionLink} />
      ))}

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-sm">
        <button type="button" onClick={() => setActiveType('story')} className={`flex h-11 items-center justify-center gap-2 text-[12px] font-black transition ${activeType === 'story' ? 'text-white' : 'text-[var(--shadow-text-secondary)]'}`} style={activeType === 'story' ? { background: design.accent_color || '#ff3f70' } : undefined}>
          <i className="fa-solid fa-book-open text-[11px]" /> Story
        </button>
        <button type="button" onClick={() => setActiveType('author')} className={`flex h-11 items-center justify-center gap-2 text-[12px] font-black transition ${activeType === 'author' ? 'text-white' : 'text-[var(--shadow-text-secondary)]'}`} style={activeType === 'author' ? { background: design.accent_color || '#ff3f70' } : undefined}>
          <i className="fa-solid fa-user text-[11px]" /> Author
        </button>
      </div>

      {design.show_top_three ? (
      <section className="mt-4 rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-3 shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-black text-[var(--shadow-text-primary)]">Top 3 Right Now</h3>
          <button type="button" onClick={scrollToCandidates} className="text-[11px] font-black text-[#ff3f70] active:opacity-70">
            View All <i className="fa-solid fa-chevron-right ml-1 text-[9px]" />
          </button>
        </div>
        {loading ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[170px] animate-pulse rounded-[18px] bg-[var(--shadow-bg-soft)]" />)}
          </div>
        ) : topThree.length ? (
          <div className="mt-6 grid grid-cols-3 items-end gap-2">
            {podiumOrder.map((candidate, index) => (
              <PodiumCard key={candidate?.id || `podium-${index}`} candidate={candidate} rank={podiumRanks[index]} onOpen={handleOpen} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[16px] bg-[var(--shadow-bg-soft)] px-4 py-8 text-center text-[12px] font-bold text-[var(--shadow-text-secondary)]">No candidates yet</div>
        )}
      </section>
      ) : null}

      <section className="mt-4 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
        <div className="text-[13px] font-black text-[#ff3f70]">My Vote Status</div>
        <div className="mt-3 grid divide-x divide-[var(--shadow-border)]" style={{ gridTemplateColumns: `repeat(${design.show_vote_balance ? 3 : 2}, minmax(0, 1fr))` }}>
          {design.show_vote_balance ? (
          <div className="px-2 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70] dark:bg-rose-500/10 dark:text-rose-300"><i className="fa-solid fa-ticket text-[12px]" /></span>
            <div className="mt-2 text-[9px] font-semibold text-[var(--shadow-text-secondary)]">Vote Balance</div>
            <div className="mt-1 text-[14px] font-black text-[#e91e58]">{formatNumber(voteBalance)}</div>
          </div>
          ) : null}
          <div className="px-2 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70] dark:bg-rose-500/10 dark:text-rose-300"><i className="fa-solid fa-list text-[12px]" /></span>
            <div className="mt-2 text-[9px] font-semibold text-[var(--shadow-text-secondary)]">Candidates</div>
            <div className="mt-1 text-[14px] font-black text-[#e91e58]">{candidates.length}</div>
          </div>
          <div className="px-2 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0f5] text-[#ff3f70] dark:bg-rose-500/10 dark:text-rose-300"><i className="fa-regular fa-calendar text-[12px]" /></span>
            <div className="mt-2 text-[9px] font-semibold text-[var(--shadow-text-secondary)]">Winner</div>
            <div className="mt-1 text-[14px] font-black text-[#e91e58]">{winnerLabel}</div>
          </div>
        </div>
      </section>

      {notice ? <div className="mt-3 rounded-[14px] bg-[#fff0f4] px-4 py-3 text-[11px] font-bold text-[#d92d55] dark:bg-rose-500/10 dark:text-rose-300">{notice}</div> : null}

      {design.show_candidate_list ? (
      <section ref={candidatesRef} className="mt-4 scroll-mt-24 overflow-hidden rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] shadow-[0_8px_24px_rgba(31,41,55,0.05)]">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-[78px] animate-pulse rounded-[14px] bg-[var(--shadow-bg-soft)]" />)}
          </div>
        ) : candidates.length ? (
          candidates.slice(0, 8).map((candidate, index) => (
            <CandidateRow key={candidate.id} candidate={candidate} rank={index + 1} onOpen={handleOpen} onVote={handleVote} voting={votingId === candidate.id} />
          ))
        ) : (
          <div className="px-4 py-10 text-center text-[12px] font-bold text-[var(--shadow-text-secondary)]">No candidates yet</div>
        )}
      </section>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <QuickLink icon="fa-shield" title="Rules" subtitle="Read the voting rules." />
        <QuickLink icon="fa-trophy" title="Past Winners" subtitle="See previous winners." onClick={openPastWinners} />
        <QuickLink icon="fa-circle-question" title="How it works" subtitle="Learn about voting." />
      </div>

      {design.show_candidate_list ? (
      <div className="sticky bottom-3 z-30 mt-4 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] p-2 shadow-[0_14px_34px_rgba(31,41,55,0.16)] backdrop-blur">
        <div className="grid grid-cols-[1.35fr_1fr] gap-2">
          <button type="button" onClick={scrollToCandidates} className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff4f7a] to-[#f52f68] px-4 text-[13px] font-black text-white shadow-[0_10px_20px_rgba(245,47,104,0.24)] active:scale-[0.98]">
            <i className="fa-solid fa-heart" /> Vote Now
          </button>
          <button type="button" onClick={scrollToCandidates} className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#ff4f7a] bg-[var(--shadow-bg-surface)] px-4 text-[12px] font-black text-[#ff3f70] active:scale-[0.98] dark:text-rose-300">
            <i className="fa-regular fa-eye" /> View All
          </button>
        </div>
      </div>
      ) : null}

      {showPastWinners ? (
        <PastWinnersModal
          campaigns={pastWinners}
          loading={pastWinnersLoading}
          error={pastWinnersError}
          onClose={() => setShowPastWinners(false)}
          onOpen={(candidate) => {
            setShowPastWinners(false)
            handleOpen(candidate)
          }}
        />
      ) : null}
    </section>
  )
}
