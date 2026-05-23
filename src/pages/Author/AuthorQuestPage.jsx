import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const BOOST_REQUIRED_MILESTONES = [
  {
    key: 'episodes',
    label: 'Published Episodes',
    shortLabel: 'Episodes',
    icon: 'fa-solid fa-book-open',
    required: 100,
    text: '100 published episodes',
  },
  {
    key: 'words',
    label: 'Published Words',
    shortLabel: 'Words',
    icon: 'fa-solid fa-pen-nib',
    required: 100000,
    text: '100,000 total published words',
  },
  {
    key: 'paid_fans',
    label: 'Paid Fans',
    shortLabel: 'Paid Fans',
    icon: 'fa-solid fa-users',
    required: 1000,
    text: 'Readers who unlocked 10+ paid episodes with Diamonds',
  },
  {
    key: 'paid_earnings',
    label: 'Paid Earnings',
    shortLabel: 'Earnings',
    icon: 'fa-solid fa-gem',
    required: 100,
    text: '$100 net paid author earnings from Diamond unlocks',
    prefix: '$',
  },
  {
    key: 'policy',
    label: 'Account Status',
    shortLabel: 'Policy',
    icon: 'fa-solid fa-shield-heart',
    required: 1,
    text: 'No serious policy violations',
  },
]

const BOOST_GROWTH_MILESTONES = [
  {
    key: 'views',
    label: 'Qualified Views',
    shortLabel: 'Views',
    icon: 'fa-solid fa-eye',
    required: 1000000,
    text: '1,000,000 qualified views',
  },
  {
    key: 'read_hours',
    label: 'Read Hours',
    shortLabel: 'Read Hours',
    icon: 'fa-solid fa-clock',
    required: 1000,
    text: '1,000 qualified read hours',
  },
  {
    key: 'likes',
    label: 'Unique Likes',
    shortLabel: 'Likes',
    icon: 'fa-solid fa-heart',
    required: 1000000,
    text: '1,000,000 unique likes',
  },
  {
    key: 'ratings',
    label: 'Unique Ratings',
    shortLabel: 'Ratings',
    icon: 'fa-solid fa-star',
    required: 1000,
    text: '1,000 unique ratings',
  },
  {
    key: 'followers',
    label: 'Followers',
    shortLabel: 'Followers',
    icon: 'fa-solid fa-user-plus',
    required: 1000,
    text: '1,000 followers',
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function numberValue(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) return 0

  return number
}

function compactNumber(value, prefix = '') {
  const number = numberValue(value)

  if (prefix) {
    return `${prefix}${number.toFixed(number % 1 === 0 ? 0 : 2)}`
  }

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(number % 1000000 === 0 ? 0 : 1)}M`
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(number % 1000 === 0 ? 0 : 1)}K`
  }

  return String(Math.floor(number))
}

function percentText(value) {
  const number = numberValue(value)

  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`
}

function progressPercent(current, required) {
  const target = numberValue(required)

  if (target <= 0) return 100

  return Math.max(0, Math.min(100, Math.round((numberValue(current) / target) * 100)))
}

function dateText(value) {
  if (!value) return 'Not active'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not active'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function HeaderButton({ icon, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5 active:scale-95"
    >
      <i className={`${icon} text-[15px]`} />
    </button>
  )
}

function SectionCard({ title, subtitle, action, children }) {
  return (
    <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[18px] font-black tracking-[-0.03em] text-[#111827]">{title}</h2>
          {subtitle ? <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#8d94a1]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function ProgressBar({ current, required, done = false, dark = false }) {
  const percent = progressPercent(current, required)
  const barColor = 'bg-[#d4a72c]'
  const bgColor = dark ? 'bg-white/10' : 'bg-[#eef0f4]'

  return (
    <div className={`h-2 overflow-hidden rounded-full ${bgColor}`}>
      <div
        className={`h-full rounded-full transition-all ${barColor}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function RequirementRow({ icon, label, current, required }) {
  const done = numberValue(current) >= numberValue(required)

  return (
    <div
      className={`rounded-[20px] border p-3 ${
        done
  ? 'border-[#d4a72c] bg-[#fff8e6]'
  : 'border-[#f0eef6] bg-white'
      }`}
    >
      <div className="mb-2 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
            done ? 'bg-[#111827] text-[#f7c948]' : 'bg-[#f7f4ee] text-[#c89b1e]'
          }`}
        >
          <i className={`${done ? 'fa-solid fa-check' : icon} text-[13px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-black text-[#111827]">{label}</div>
          <div className="mt-0.5 text-[11.5px] font-semibold text-[#667085]">
            {compactNumber(current)} / {compactNumber(required)}
          </div>
        </div>

        <div
          className={`rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase ${
            done ? 'bg-[#111827] text-[#f7c948]' : 'bg-[#f2f4f7] text-[#667085]'
          }`}
        >
          {done ? 'Done' : `${progressPercent(current, required)}%`}
        </div>
      </div>

      <ProgressBar current={current} required={required} done={done} />
    </div>
  )
}

function StageCard({ stage, currentStageNumber }) {
  const stageNumber = numberValue(stage.stage_number)
  const current = stageNumber === numberValue(currentStageNumber)
  const completed = stageNumber < numberValue(currentStageNumber)
  const locked = stageNumber > numberValue(currentStageNumber)

  const statusClass = completed
    ? 'bg-[#ecfdf3] text-[#16803c]'
    : current
      ? 'bg-[#111827] text-white'
      : 'bg-[#f2f4f7] text-[#667085]'

  return (
    <div className={`rounded-[22px] border p-3 ${current ? 'border-[#d4a72c] bg-[#fffaf0]' : 'border-[#f0eef6] bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-black text-[#111827]">Stage {stage.stage_number}</div>
          <div className="mt-1 text-[22px] font-black tracking-[-0.04em] text-[#111827]">{percentText(stage.share_percent)}</div>
          <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.05em] text-[#98a2b3]">Author share</div>
        </div>

        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusClass}`}>
          {completed ? 'Completed' : current ? 'Current' : locked ? 'Locked' : 'Stage'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px] font-semibold text-[#667085]">
        <div>Episodes: {compactNumber(stage.requirements?.episodes?.required)}</div>
        <div>Words: {compactNumber(stage.requirements?.words?.required)}</div>
        <div>Likes: {compactNumber(stage.requirements?.likes?.required)}</div>
        <div>Followers: {compactNumber(stage.requirements?.followers?.required)}</div>
      </div>
    </div>
  )
}

function BoostRequirement({ item }) {
  const done = numberValue(item.current) >= numberValue(item.required)

  return (
    <div
      className={`rounded-[18px] px-3 py-3 ring-1 ${
        done
  ? 'bg-[#fff8e6] text-[#9a6a00] ring-[#d4a72c]'
  : 'bg-white/10 text-white ring-white/10'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <i className={`${done ? 'fa-solid fa-check' : item.icon} text-[12px] ${done ? 'text-[#d4a72c]' : 'text-[#f7c948]'}`} />
          <span className={`line-clamp-1 text-[11px] font-black ${done ? 'text-[#16803c]' : 'text-white'}`}>{item.shortLabel}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${done ? 'bg-[#111827] text-[#f7c948]' : 'bg-white/10 text-white/55'}`}>
          {done ? 'Done' : `${progressPercent(item.current, item.required)}%`}
        </span>
      </div>

      <div className={`text-[10.5px] font-semibold ${done ? 'text-[#16803c]/75' : 'text-white/55'}`}>
        {compactNumber(item.current, item.prefix)} / {compactNumber(item.required, item.prefix)}
      </div>

      <div className="mt-2">
        <ProgressBar current={item.current} required={item.required} done={done} dark={!done} />
      </div>
    </div>
  )
}

function RulesNote({ onLearnMore }) {
  return (
    <section className="rounded-[26px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7f4ee] text-[#c89b1e]">
          <i className="fa-solid fa-circle-info text-[15px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-black text-[#111827]">Quest Rules</div>
          <div className="mt-2 space-y-1.5 text-[12.5px] font-medium leading-5 text-[#667085]">
            <p>Quest progress is calculated from published stories and verified reader activity.</p>
            <p>Paid income comes from Diamond unlocks only.</p>
            <p>100-Day Creator Boost requires all required milestones plus any 3 growth milestones.</p>
            <p>The 100-Day Creator Boost can be used only once per author account.</p>
          </div>

          <button
            type="button"
            onClick={onLearnMore}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-[#111827] px-4 text-[12px] font-black text-white active:scale-95"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[190px] animate-pulse rounded-[30px] bg-white" />
      <div className="h-[260px] animate-pulse rounded-[26px] bg-white" />
      <div className="h-[340px] animate-pulse rounded-[26px] bg-white" />
    </div>
  )
}

function getStageProgress(nextStage) {
  if (!nextStage) return 100

  const requirements = [
    nextStage.requirements?.episodes,
    nextStage.requirements?.words,
    nextStage.requirements?.likes,
    nextStage.requirements?.followers,
  ]

  return Math.min(
    ...requirements.map((item) => progressPercent(item?.current, item?.required)),
  )
}

export default function AuthorQuestPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadQuest() {
      try {
        setLoading(true)
        setError('')

        const token = getAuthToken()

        if (!token) {
          navigate('/login', { replace: true })
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/authors/me/quest`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.ok === false) {
          throw new Error(result.message || 'Failed to load author quest')
        }

        if (!ignore) {
          setData(result)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load author quest')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadQuest()

    return () => {
      ignore = true
    }
  }, [navigate])

  const currentStage = data?.current_stage || {}
  const activeShare = data?.active_share || {}
  const nextStage = data?.next_stage || null
  const lifetimeBoost = data?.lifetime_boost || null
  const totals = data?.totals || {}
  const stageProgress = getStageProgress(nextStage)

  const nextRequirements = useMemo(() => {
    if (!nextStage?.requirements) return []

    return [
      ['Episodes', nextStage.requirements.episodes, 'fa-solid fa-book-open'],
      ['Words', nextStage.requirements.words, 'fa-solid fa-pen-nib'],
      ['Likes', nextStage.requirements.likes, 'fa-solid fa-heart'],
      ['Followers', nextStage.requirements.followers, 'fa-solid fa-user-plus'],
    ]
  }, [nextStage])

  const requiredMilestones = useMemo(() => {
    return BOOST_REQUIRED_MILESTONES.map((item) => {
      let current = 0

      if (item.key === 'episodes') current = totals.total_published_episodes
      if (item.key === 'words') current = totals.total_words
      if (item.key === 'paid_fans') current = totals.total_paid_fans || totals.total_fans || 0
      if (item.key === 'paid_earnings') current = totals.total_net_paid_earnings_usd || 0
      if (item.key === 'policy') current = totals.has_serious_policy_violation ? 0 : 1

      return {
        ...item,
        current,
      }
    })
  }, [totals])

  const growthMilestones = useMemo(() => {
    return BOOST_GROWTH_MILESTONES.map((item) => {
      let current = 0

      if (item.key === 'views') current = totals.total_qualified_views || totals.total_views || 0
      if (item.key === 'read_hours') current = Math.floor(numberValue(totals.total_read_seconds) / 3600)
      if (item.key === 'likes') current = totals.total_unique_likes || totals.total_likes || 0
      if (item.key === 'ratings') current = totals.total_unique_ratings || totals.total_ratings || 0
      if (item.key === 'followers') current = totals.total_followers || 0

      return {
        ...item,
        current,
      }
    })
  }, [totals])

  const requiredDoneCount = requiredMilestones.filter((item) => numberValue(item.current) >= numberValue(item.required)).length
  const growthDoneCount = growthMilestones.filter((item) => numberValue(item.current) >= numberValue(item.required)).length

  return (
    <div className="min-h-screen bg-[#f5f3fa] pb-10">
      <div className="sticky top-0 z-40 border-b border-black/5 bg-[#f8f5ef]/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton icon="fa-solid fa-chevron-left" label="Back" onClick={() => navigate('/author/dashboard', { replace: true })} />

          <div className="text-center">
            <h1 className="text-[16px] font-black text-[#111827]">Quest</h1>
            <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">Stage and creator rewards</p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-4 pt-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[24px] bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#e11d48]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[#111827]">{error}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#111827] px-6 text-[13px] font-black text-white active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section className="overflow-hidden rounded-[30px] bg-[#111827] p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.1em] text-[#f7c948]">Current Share</div>
                  <div className="mt-2 text-[48px] font-black leading-none tracking-[-0.08em]">{percentText(activeShare.share_percent || currentStage.share_percent)}</div>
                  <p className="mt-3 text-[13px] font-semibold leading-6 text-white/65">
                    {activeShare.source === 'lifetime_boost'
                      ? `100-Day Creator Boost active until ${dateText(activeShare.boost_ends_at)}.`
                      : `You are on Stage ${currentStage.stage_number || 1}. Keep growing to unlock higher share levels.`}
                  </p>
                </div>

                <div className="shrink-0 rounded-[20px] bg-white/10 px-4 py-3 text-center ring-1 ring-white/10">
                  <div className="text-[9.5px] font-black uppercase tracking-[0.08em] text-white/45">
                    Current
                  </div>
                  <div className="mt-1 text-[15px] font-black text-[#f7c948]">
                    Stage {currentStage.stage_number || 1}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-bold text-white/45">
                    {percentText(currentStage.share_percent || activeShare.share_percent)} Share
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] bg-white/10 p-3 ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-[12px] font-black text-white">
                    {nextStage ? `Next Milestone: Stage ${nextStage.stage_number}` : 'Maximum normal stage reached'}
                  </div>
                  <div className="text-[11px] font-bold text-white/55">
                    {nextStage ? `Unlock ${percentText(nextStage.share_percent)} Share` : 'Great work'}
                  </div>
                </div>

                <ProgressBar current={stageProgress} required={100} dark />

                <div className="mt-2 text-right text-[10.5px] font-black text-white/55">
                  {stageProgress}% complete
                </div>
              </div>
            </section>

            {nextStage ? (
              <SectionCard
                title={`To Reach Stage ${nextStage.stage_number}`}
                subtitle={`Complete these milestones to grow your share to ${percentText(nextStage.share_percent)}.`}
              >
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {nextRequirements.map(([label, item, icon]) => (
                    <RequirementRow key={label} icon={icon} label={label} current={item?.current} required={item?.required} />
                  ))}
                </div>
              </SectionCard>
            ) : (
              <SectionCard
                title="Normal Stages Completed"
                subtitle="You have reached the highest normal Quest share stage."
              >
                <div className="rounded-[22px] bg-[#ecfdf3] p-4 text-[13px] font-bold leading-6 text-[#16803c]">
                  You can now focus on the 100-Day Creator Boost milestones.
                </div>
              </SectionCard>
            )}

            <SectionCard
              title="Stage Roadmap"
              subtitle="Your author share grows as you complete each stage."
            >
              <div className="grid gap-2.5 sm:grid-cols-2">
                {(data.stage_rules || []).map((stage) => (
                  <StageCard key={stage.stage_number} stage={stage} currentStageNumber={currentStage.stage_number} />
                ))}
              </div>
            </SectionCard>

            <section className="overflow-hidden rounded-[30px] bg-[#111827] p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.1em] text-[#f7c948]">Lifetime Reward</div>
                  <h2 className="mt-2 text-[24px] font-black leading-[1.05] tracking-[-0.05em]">100-Day Creator Boost</h2>
                  <p className="mt-2 text-[13px] font-semibold leading-6 text-white/60">
                    Earn 100% revenue share for 100 days. One time only per author account.
                  </p>
                </div>

                <div className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase text-[#f7c948] ring-1 ring-white/10">
                  {String(lifetimeBoost?.status || 'locked').replaceAll('_', ' ')}
                </div>
              </div>

              {lifetimeBoost?.status === 'active' ? (
                <div className="mt-4 rounded-[22px] bg-[#ecfdf3] p-4 text-[13px] font-black text-[#16803c]">
                  Boost active until {dateText(lifetimeBoost.ended_at)}.
                </div>
              ) : null}

              <div className="mt-5 rounded-[24px] bg-white/10 p-4 ring-1 ring-white/10">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-black text-white">Required Milestones</h3>
                    <p className="mt-1 text-[11.5px] font-semibold text-white/55">Complete all required milestones.</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-[#f7c948]">
                    {requiredDoneCount}/{requiredMilestones.length}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {requiredMilestones.map((item) => (
                    <BoostRequirement key={item.key} item={item} />
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-[24px] bg-white/10 p-4 ring-1 ring-white/10">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-black text-white">Growth Milestones</h3>
                    <p className="mt-1 text-[11.5px] font-semibold text-white/55">Complete any 3 of 5.</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-[#f7c948]">
                    {Math.min(growthDoneCount, 3)}/3
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {growthMilestones.map((item) => (
                    <BoostRequirement key={item.key} item={item} />
                  ))}
                </div>
              </div>
            </section>

            <RulesNote onLearnMore={() => navigate('/author/benefits')} />
          </>
        ) : null}
      </main>
    </div>
  )
}
