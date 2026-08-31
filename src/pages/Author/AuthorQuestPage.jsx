import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

const QUEST_MASCOT_URL = '/assets/Author/quest-manga-girl.webp'

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

  return Math.max(
    0,
    Math.min(100, Math.round((numberValue(current) / target) * 100))
  )
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadcf6] bg-white text-[#62458e] shadow-[0_5px_16px_rgba(93,64,136,0.09)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function NotebookBinding() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 w-[30px] border-r border-[#d9c9ee] bg-[linear-gradient(180deg,#f2e9ff_0%,#fbf7ff_100%)]">
      {[36, 82, 128, 174, 220, 266].map((top) => (
        <span
          key={top}
          className="absolute left-[9px] h-3 w-3 rounded-full border-2 border-[#9b72d8] bg-white"
          style={{ top }}
        />
      ))}
    </div>
  )
}

function Tape({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute h-5 w-16 rotate-[-7deg] rounded-sm border border-white/70 bg-[#f7c4d8]/70 shadow-sm ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.45)_0_4px,transparent_4px_8px)]" />
    </div>
  )
}

function QuestMascot({ compact = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full border border-[#d8c5f2] bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#f8e9ff_48%,#ddc7ff_100%)] text-[#8b61cf] shadow-[0_10px_30px_rgba(105,72,157,0.15)] ${
          compact ? 'h-20 w-20' : 'h-[142px] w-[142px]'
        }`}
      >
        <div className="text-center">
          <i
            className={`fa-solid fa-wand-magic-sparkles ${
              compact ? 'text-[24px]' : 'text-[38px]'
            }`}
          />
          {!compact ? (
            <div className="mt-2 text-[9px] font-black uppercase tracking-[0.08em]">
              Creator
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <img
      src={QUEST_MASCOT_URL}
      alt=""
      onError={() => setFailed(true)}
      className={
        compact
          ? 'h-20 w-20 object-contain drop-shadow-[0_8px_14px_rgba(84,53,126,0.18)]'
          : 'h-[170px] w-[170px] object-contain drop-shadow-[0_12px_24px_rgba(84,53,126,0.18)]'
      }
    />
  )
}

function ProgressBar({
  current,
  required,
  done = false,
  dark = false,
  pink = false,
}) {
  const percent = progressPercent(current, required)

  const trackClass = dark ? 'bg-white/10' : 'bg-[#efe9f5]'

  const fillClass = done
    ? 'bg-[linear-gradient(90deg,#e8ad2a_0%,#f8cf56_100%)]'
    : pink
      ? 'bg-[linear-gradient(90deg,#f58ab4_0%,#c67ae9_100%)]'
      : 'bg-[linear-gradient(90deg,#e8ad2a_0%,#f6c83e_55%,#a975df_100%)]'

  return (
    <div className={`h-2 overflow-hidden rounded-full ${trackClass}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${fillClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  icon,
  pink = false,
  children,
  action,
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border p-4 shadow-[0_12px_28px_rgba(98,68,138,0.08)] ${
        pink
          ? 'border-[#f2cadc] bg-[linear-gradient(180deg,#fffafc_0%,#fff5f8_100%)]'
          : 'border-[#ded1ef] bg-[linear-gradient(180deg,#fffefb_0%,#fbf8ff_100%)]'
      }`}
    >
      <Tape className="-right-3 top-3" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
              pink
                ? 'bg-[#ffe4ee] text-[#e56c9c]'
                : 'bg-[#eee5ff] text-[#7650b5]'
            }`}
          >
            <i className={`${icon || 'fa-solid fa-star'} text-[13px]`} />
          </span>

          <div className="min-w-0">
            <h2
              className={`text-[18px] font-black tracking-[-0.03em] ${
                pink ? 'text-[#c95383]' : 'text-[#4f347d]'
              }`}
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-[12px] font-medium leading-5 text-[#817494]">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {action}
      </div>

      {children}
    </section>
  )
}

function RequirementRow({ icon, label, current, required }) {
  const done = numberValue(current) >= numberValue(required)

  return (
    <div
      className={`rounded-[20px] border p-3 shadow-[0_5px_15px_rgba(110,79,150,0.05)] ${
        done
          ? 'border-[#ecc25b] bg-[#fffaf0]'
          : 'border-[#eadff2] bg-white/80'
      }`}
    >
      <div className="mb-2 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            done
              ? 'bg-[#fff1c7] text-[#d69c15]'
              : 'bg-[#f2eaff] text-[#845bc8]'
          }`}
        >
          <i
            className={`${done ? 'fa-solid fa-check' : icon} text-[13px]`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-black text-[#3f315c]">{label}</div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#8a7d9a]">
            {compactNumber(current)} / {compactNumber(required)}
          </div>
        </div>

        <div
          className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
            done
              ? 'bg-[#f58bb4] text-white'
              : 'bg-[#f1eafa] text-[#7455a5]'
          }`}
        >
          {done ? 'Done' : `${progressPercent(current, required)}%`}
        </div>
      </div>

      <ProgressBar
        current={current}
        required={required}
        done={done}
        pink={!done}
      />
    </div>
  )
}

function StageCard({ stage, currentStageNumber, index, total }) {
  const stageNumber = numberValue(stage.stage_number)
  const current = stageNumber === numberValue(currentStageNumber)
  const completed = stageNumber < numberValue(currentStageNumber)
  const locked = stageNumber > numberValue(currentStageNumber)

  return (
    <div className="relative pl-11">
      {index < total - 1 ? (
        <div className="absolute bottom-[-13px] left-[18px] top-8 w-px bg-[#d9c7ed]" />
      ) : null}

      <div
        className={`absolute left-0 top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 text-[11px] font-black shadow-sm ${
          current
            ? 'border-[#e8b63e] bg-[#fff1bc] text-[#b47b00]'
            : completed
              ? 'border-[#b79ae0] bg-[#eee5ff] text-[#6f4ca5]'
              : 'border-[#ded6ea] bg-[#f6f3f8] text-[#a69daf]'
        }`}
      >
        {current ? (
          <i className="fa-solid fa-star text-[12px]" />
        ) : completed ? (
          <i className="fa-solid fa-check text-[11px]" />
        ) : (
          <i className="fa-solid fa-lock text-[9px]" />
        )}
      </div>

      <div
        className={`rounded-[20px] border p-3.5 ${
          current
            ? 'border-[#e7bc53] bg-[linear-gradient(90deg,#fff8e4_0%,#fffdf8_100%)] shadow-[0_7px_20px_rgba(205,158,37,0.09)]'
            : 'border-[#e9e1ef] bg-white/80'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[12px] font-black text-[#44335f]">
              Stage {stage.stage_number}
            </div>
            <div className="mt-1 text-[24px] font-black tracking-[-0.05em] text-[#34254e]">
              {percentText(stage.share_percent)}
            </div>
            <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#9c82bd]">
              Author share
            </div>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
              completed
                ? 'bg-[#eee5ff] text-[#6f4ca5]'
                : current
                  ? 'bg-[#e8b235] text-white'
                  : 'bg-[#f0edf3] text-[#9990a3]'
            }`}
          >
            {completed ? 'Completed' : current ? 'Current' : locked ? 'Locked' : 'Stage'}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10.5px] font-semibold text-[#756982]">
          <div>
            Episodes:{' '}
            <span className="font-black text-[#524264]">
              {compactNumber(stage.requirements?.episodes?.required)}
            </span>
          </div>
          <div>
            Words:{' '}
            <span className="font-black text-[#524264]">
              {compactNumber(stage.requirements?.words?.required)}
            </span>
          </div>
          <div>
            Likes:{' '}
            <span className="font-black text-[#524264]">
              {compactNumber(stage.requirements?.likes?.required)}
            </span>
          </div>
          <div>
            Followers:{' '}
            <span className="font-black text-[#524264]">
              {compactNumber(stage.requirements?.followers?.required)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BoostRequirement({ item }) {
  const done = numberValue(item.current) >= numberValue(item.required)

  return (
    <div
      className={`rounded-[18px] border px-3 py-3 ${
        done
          ? 'border-[#e6bb50] bg-[#fff8e6]'
          : 'border-white/10 bg-white/8'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${
              done
                ? 'bg-[#ffe8a8] text-[#bb7f00]'
                : 'bg-white/10 text-[#f2c95d]'
            }`}
          >
            <i
              className={`${done ? 'fa-solid fa-check' : item.icon} text-[10px]`}
            />
          </span>

          <span
            className={`line-clamp-1 text-[11px] font-black ${
              done ? 'text-[#514027]' : 'text-white'
            }`}
          >
            {item.shortLabel}
          </span>
        </div>

        <span
          className={`rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase ${
            done
              ? 'bg-[#f4b944] text-[#4b3510]'
              : 'bg-white/10 text-white/65'
          }`}
        >
          {done ? 'Done' : `${progressPercent(item.current, item.required)}%`}
        </span>
      </div>

      <div
        className={`text-[10px] font-semibold ${
          done ? 'text-[#8a6822]' : 'text-white/55'
        }`}
      >
        {compactNumber(item.current, item.prefix)} /{' '}
        {compactNumber(item.required, item.prefix)}
      </div>

      <div className="mt-2">
        <ProgressBar
          current={item.current}
          required={item.required}
          done={done}
          dark={!done}
        />
      </div>
    </div>
  )
}

function RulesNote({ onLearnMore }) {
  return (
    <button
      type="button"
      onClick={onLearnMore}
      className="relative w-full overflow-hidden rounded-[26px] border border-[#eed9e5] bg-[linear-gradient(180deg,#fffafd_0%,#fff7f3_100%)] p-4 text-left shadow-[0_10px_24px_rgba(101,73,137,0.07)] transition active:scale-[0.99]"
    >
      <Tape className="-right-4 top-4 rotate-[8deg]" />

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ffe7f0] text-[#dc6a97]">
              <i className="fa-solid fa-book-open text-[12px]" />
            </span>
            <span className="text-[15px] font-black text-[#5b3b75]">
              Quest Rules
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-[11.5px] font-medium leading-5 text-[#7d6f87]">
            <p>
              Quest progress is calculated from published stories and verified
              reader activity.
            </p>
            <p>Paid income comes from Diamond unlocks only.</p>
            <p>
              100-Day Creator Boost requires all required milestones plus any 3
              growth milestones.
            </p>
            <p>
              The 100-Day Creator Boost can be used only once per author
              account.
            </p>
          </div>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4eaff] text-[#8c64c4]">
          <i className="fa-solid fa-chevron-right text-[11px]" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-14 text-[#f3a7c3]/60">
        <i className="fa-solid fa-heart text-[18px]" />
      </div>
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[235px] animate-pulse rounded-[30px] bg-white" />
      <div className="h-[285px] animate-pulse rounded-[28px] bg-white" />
      <div className="h-[360px] animate-pulse rounded-[28px] bg-white" />
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
    ...requirements.map((item) =>
      progressPercent(item?.current, item?.required)
    )
  )
}

export default function AuthorQuestPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromPage = searchParams.get('from')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [activatingBoost, setActivatingBoost] = useState(false)
  const [boostNotice, setBoostNotice] = useState(null)

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
      if (item.key === 'paid_fans') current = totals.total_paid_fans ?? 0
      if (item.key === 'paid_earnings') {
        current = totals.total_net_paid_earnings_usd || 0
      }
      if (item.key === 'policy') {
        current = totals.has_serious_policy_violation ? 0 : 1
      }

      return {
        ...item,
        current,
      }
    })
  }, [totals])

  const growthMilestones = useMemo(() => {
    return BOOST_GROWTH_MILESTONES.map((item) => {
      let current = 0

      if (item.key === 'views') {
        current = totals.total_qualified_views || totals.total_views || 0
      }
      if (item.key === 'read_hours') {
        current = Math.floor(numberValue(totals.total_read_seconds) / 3600)
      }
      if (item.key === 'likes') {
        current = totals.total_unique_likes || totals.total_likes || 0
      }
      if (item.key === 'ratings') {
        current = totals.total_unique_ratings || totals.total_ratings || 0
      }
      if (item.key === 'followers') current = totals.total_followers || 0

      return {
        ...item,
        current,
      }
    })
  }, [totals])

  const requiredDoneCount = requiredMilestones.filter(
    (item) => numberValue(item.current) >= numberValue(item.required)
  ).length

  const growthDoneCount = growthMilestones.filter(
    (item) => numberValue(item.current) >= numberValue(item.required)
  ).length

  async function activateBoost() {
    if (activatingBoost || lifetimeBoost?.status !== 'eligible') {
      return
    }

    const confirmed = window.confirm(
      'Activate the 100-Day Creator Boost now? It starts immediately, cannot be paused, and can be used only once.'
    )

    if (!confirmed) return

    try {
      setActivatingBoost(true)
      setBoostNotice(null)

      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/api/authors/me/quest/boost/activate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.ok === false) {
        throw new Error(
          result.message || 'Failed to activate 100-Day Creator Boost'
        )
      }

      const refreshResponse = await fetch(
        `${API_BASE_URL}/api/authors/me/quest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const refreshResult = await refreshResponse.json().catch(() => ({}))

      if (!refreshResponse.ok || refreshResult.ok === false) {
        throw new Error(
          refreshResult.message ||
            'Boost activated, but the page could not refresh'
        )
      }

      setData(refreshResult)
      setBoostNotice({
        type: 'success',
        text:
          result.message ||
          '100-Day Creator Boost activated successfully',
      })
    } catch (err) {
      setBoostNotice({
        type: 'error',
        text:
          err.message ||
          'Failed to activate 100-Day Creator Boost',
      })
    } finally {
      setActivatingBoost(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f8f3ff_52%,#fff8fb_100%)] pb-10">
      <div className="sticky top-0 z-40 border-b border-[#eadff1] bg-[#fffdf8]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[62px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label="Back"
            onClick={() =>
              navigate(
                fromPage === 'income' ? '/author/income' : '/author/profile',
                { replace: true }
              )
            }
          />

          <div className="text-center">
            <h1 className="text-[20px] font-black tracking-[-0.04em] text-[#573781]">
              Quest
            </h1>
            <p className="mt-0.5 text-[9.5px] font-black uppercase tracking-[0.1em] text-[#aa8fc5]">
              Stage and creator rewards
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center text-[#efb53e]">
            <i className="fa-solid fa-star text-[16px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[26px] border border-[#f4d3df] bg-white p-5 text-center shadow-[0_12px_28px_rgba(93,64,136,0.08)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f5] text-[#e45f8d]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[#503765]">
              {error}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#7550b3] px-6 text-[13px] font-black text-white shadow-sm transition active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section className="relative overflow-hidden rounded-[30px] border border-[#d8c7ff] bg-[linear-gradient(135deg,#fffaf4_0%,#fff7fb_38%,#f3edff_100%)] p-5 shadow-[0_14px_34px_rgba(117,76,180,0.12)]">
              <NotebookBinding />

              <div className="pointer-events-none absolute right-5 top-4 text-[#f2b84b]/70">
                <i className="fa-solid fa-star text-[18px]" />
              </div>
              <div className="pointer-events-none absolute right-16 top-12 text-[#f6a6c9]/70">
                <i className="fa-solid fa-heart text-[14px]" />
              </div>
              <div className="pointer-events-none absolute bottom-4 right-8 text-[#a986e8]/60">
                <i className="fa-solid fa-wand-magic-sparkles text-[16px]" />
              </div>

              <div className="relative pl-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f7a9c7] px-3 py-1 text-[9.5px] font-black uppercase tracking-[0.08em] text-white shadow-sm">
                      <i className="fa-solid fa-star text-[7px]" />
                      Current Share
                      <i className="fa-solid fa-star text-[7px]" />
                    </div>

                    <div className="mt-3 bg-[linear-gradient(180deg,#ff7fac_0%,#c26ce8_100%)] bg-clip-text text-[54px] font-black leading-none tracking-[-0.08em] text-transparent drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
                      {percentText(
                        activeShare.share_percent || currentStage.share_percent
                      )}
                    </div>

                    <p className="mt-3 max-w-[255px] text-[12.5px] font-semibold leading-5 text-[#594a6f]">
                      {activeShare.source === 'lifetime_boost'
                        ? `100-Day Creator Boost active until ${dateText(
                            activeShare.boost_ends_at
                          )}.`
                        : `You are on Stage ${
                            currentStage.stage_number || 1
                          }. Keep growing to unlock higher share levels.`}
                    </p>
                  </div>

                  <div className="relative hidden shrink-0 sm:block">
                    <QuestMascot />
                    <div className="absolute right-0 top-0 rounded-2xl border border-[#f0c65c] bg-[#fff7d9] px-3 py-2 shadow-[0_5px_14px_rgba(218,168,43,0.16)]">
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-crown text-[9px] text-[#d49f22]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.04em] text-[#4c3c63]">
                          Stage {currentStage.stage_number || 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 sm:hidden">
                    <div className="rounded-2xl border border-[#f0c65c] bg-[#fff7d9] px-3 py-2 shadow-[0_5px_14px_rgba(218,168,43,0.16)]">
                      <div className="flex items-center gap-1.5">
                        <i className="fa-solid fa-crown text-[9px] text-[#d49f22]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.04em] text-[#4c3c63]">
                          Stage {currentStage.stage_number || 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[22px] border border-[#d9c9f5] bg-white/80 p-3.5 shadow-[0_8px_20px_rgba(102,75,150,0.08)] backdrop-blur">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="text-[11.5px] font-black text-[#4f347d]">
                      {nextStage
                        ? `Next Milestone: Stage ${nextStage.stage_number}`
                        : 'Maximum normal stage reached'}
                    </div>
                    <div className="text-[10px] font-bold text-[#8e70bb]">
                      {nextStage
                        ? `Unlock ${percentText(nextStage.share_percent)} Share`
                        : 'Great work'}
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#eee7f7]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#f3b832_0%,#f6cf58_35%,#a876e7_100%)] transition-all duration-500"
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-[#b592df]">
                      <i className="fa-regular fa-star text-[7px]" />
                      Keep going
                    </div>
                    <div className="text-[10px] font-black text-[#6e4ca3]">
                      {stageProgress}% complete
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {nextStage ? (
              <SectionCard
                title={`To Reach Stage ${nextStage.stage_number}`}
                subtitle={`Complete these milestones to grow your share to ${percentText(
                  nextStage.share_percent
                )}.`}
                icon="fa-solid fa-bullseye"
                pink
              >
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {nextRequirements.map(([label, item, icon]) => (
                    <RequirementRow
                      key={label}
                      icon={icon}
                      label={label}
                      current={item?.current}
                      required={item?.required}
                    />
                  ))}
                </div>
              </SectionCard>
            ) : (
              <SectionCard
                title="Normal Stages Completed"
                subtitle="You have reached the highest normal Quest share stage."
                icon="fa-solid fa-trophy"
              >
                <div className="rounded-[20px] border border-[#cfead7] bg-[#f2fff6] p-4 text-[12.5px] font-bold leading-6 text-[#3b8452]">
                  You can now focus on the 100-Day Creator Boost milestones.
                </div>
              </SectionCard>
            )}

            <SectionCard
              title="Stage Roadmap"
              subtitle="Your author share grows as you complete each stage."
              icon="fa-solid fa-map"
            >
              <div className="space-y-2.5">
                {(data.stage_rules || []).map((stage, index, array) => (
                  <StageCard
                    key={stage.stage_number}
                    stage={stage}
                    currentStageNumber={currentStage.stage_number}
                    index={index}
                    total={array.length}
                  />
                ))}
              </div>
            </SectionCard>

            <section className="relative overflow-hidden rounded-[30px] border border-[#564379] bg-[linear-gradient(160deg,#2c2145_0%,#372553_48%,#221d39_100%)] p-4 text-white shadow-[0_16px_35px_rgba(55,37,83,0.18)] sm:p-5">
              <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#a268e5]/20 blur-2xl" />
              <div className="pointer-events-none absolute bottom-6 left-6 text-[#f3c64e]/25">
                <i className="fa-solid fa-star text-[34px]" />
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[9.5px] font-black uppercase tracking-[0.12em] text-[#f8cc56]">
                    Lifetime Reward
                  </div>
                  <h2 className="mt-2 text-[24px] font-black leading-[1.05] tracking-[-0.05em] text-white">
                    100-Day Creator Boost
                  </h2>
                  <p className="mt-2 max-w-[430px] text-[12px] font-semibold leading-5 text-white/65">
                    Earn 100% revenue share for 100 days. One time only per
                    author account.
                  </p>
                </div>

                <div className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase text-[#f7c948]">
                  {String(lifetimeBoost?.status || 'locked').replaceAll('_', ' ')}
                </div>
              </div>

              <div className="relative mt-4 flex items-end justify-between gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-black text-[#f9d66f]">
                    Creator Treasure
                  </div>
                  <p className="mt-1 text-[10.5px] font-semibold leading-5 text-white/50">
                    Complete the required and growth milestones to unlock your
                    one-time reward.
                  </p>
                </div>
                <div className="hidden sm:block">
                  <QuestMascot compact />
                </div>
              </div>

              {lifetimeBoost?.status === 'active' ? (
                <div className="mt-4 rounded-[20px] border border-[#a8dfb5] bg-[#effff3] p-4 text-[12.5px] font-black text-[#34814b]">
                  Boost active until {dateText(lifetimeBoost.ended_at)}.
                </div>
              ) : null}

              {lifetimeBoost?.status === 'eligible' ? (
                <div className="mt-4 rounded-[22px] border border-[#e7be55] bg-[#fff8e6] p-4 text-[#4d3c1d]">
                  <div className="text-[13.5px] font-black">
                    Your 100-Day Creator Boost is ready.
                  </div>
                  <p className="mt-1 text-[11px] font-semibold leading-5 text-[#8a6a25]">
                    It starts immediately, cannot be paused, and can be
                    activated only once.
                  </p>
                  <button
                    type="button"
                    onClick={activateBoost}
                    disabled={activatingBoost}
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#46315f] px-5 text-[12px] font-black text-[#ffd96b] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i
                      className={
                        activatingBoost
                          ? 'fa-solid fa-spinner fa-spin'
                          : 'fa-solid fa-bolt'
                      }
                    />
                    {activatingBoost
                      ? 'Activating...'
                      : 'Activate 100-Day Boost'}
                  </button>
                </div>
              ) : null}

              {lifetimeBoost?.status === 'expired' ? (
                <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.06] p-4 text-[12px] font-bold leading-5 text-white/60">
                  This one-time 100-Day Creator Boost has ended.
                </div>
              ) : null}

              {boostNotice ? (
                <div
                  className={`mt-4 rounded-[20px] p-4 text-[12px] font-bold leading-5 ${
                    boostNotice.type === 'success'
                      ? 'bg-[#effff3] text-[#34814b]'
                      : 'bg-[#fff1f4] text-[#bf426b]'
                  }`}
                >
                  {boostNotice.text}
                </div>
              ) : null}

              <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.07] p-3.5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-black text-white">
                      Required Milestones
                    </h3>
                    <p className="mt-1 text-[10.5px] font-semibold text-white/50">
                      Complete all required milestones.
                    </p>
                  </div>

                  <div className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black text-[#f7c948]">
                    {requiredDoneCount}/{requiredMilestones.length}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {requiredMilestones.map((item) => (
                    <BoostRequirement key={item.key} item={item} />
                  ))}
                </div>
              </div>

              <div className="mt-3 rounded-[24px] border border-white/10 bg-white/[0.07] p-3.5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[14px] font-black text-white">
                      Growth Milestones
                    </h3>
                    <p className="mt-1 text-[10.5px] font-semibold text-white/50">
                      Complete any 3 of 5.
                    </p>
                  </div>

                  <div className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black text-[#f7c948]">
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

            <RulesNote
              onLearnMore={() => navigate('/author/benefits?from=quest')}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
