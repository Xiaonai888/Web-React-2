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

const MILESTONE_STYLES = {
  Episodes: {
    iconBg: 'bg-[#fff0c9]',
    iconText: 'text-[#d89b18]',
    bar: 'from-[#f4b62f] to-[#ffd460]',
  },
  Words: {
    iconBg: 'bg-[#eee6ff]',
    iconText: 'text-[#7b55c7]',
    bar: 'from-[#9b72ec] to-[#c89cf4]',
  },
  Likes: {
    iconBg: 'bg-[#ffe3ef]',
    iconText: 'text-[#ea6e9f]',
    bar: 'from-[#f27da9] to-[#f7a9c8]',
  },
  Followers: {
    iconBg: 'bg-[#e8f0ff]',
    iconText: 'text-[#5f82d9]',
    bar: 'from-[#6f7eea] to-[#9c87ed]',
  },
}

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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadff5] bg-white text-[#5e477e] shadow-[0_5px_18px_rgba(70,49,99,0.08)] transition active:scale-95"
    >
      <i className={`${icon} text-[14px]`} />
    </button>
  )
}

function SpiralBinding({ dark = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-y-0 left-0 w-[32px] border-r ${
        dark
          ? 'border-white/10 bg-white/[0.04]'
          : 'border-[#dfd0ee] bg-[linear-gradient(180deg,#efe7ff_0%,#faf5ff_100%)]'
      }`}
    >
      {[32, 78, 124, 170, 216, 262, 308, 354].map((top) => (
        <div key={top} className="absolute left-[7px]" style={{ top }}>
          <span
            className={`block h-[13px] w-[13px] rounded-full border-2 ${
              dark
                ? 'border-[#caa8ff] bg-[#2f2345]'
                : 'border-[#9a70d2] bg-white'
            }`}
          />
          <span
            className={`absolute left-[7px] top-[5px] h-[3px] w-[13px] rounded-full ${
              dark ? 'bg-[#d8bdff]' : 'bg-[#8d63c9]'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

function Tape({ className = '', blue = false }) {
  return (
    <div
      className={`pointer-events-none absolute h-6 w-[72px] rotate-[-8deg] overflow-hidden rounded-[3px] border border-white/70 shadow-sm ${
        blue ? 'bg-[#a9c9ff]/75' : 'bg-[#f8bdd6]/75'
      } ${className}`}
    >
      <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.38)_0_5px,transparent_5px_10px)]" />
    </div>
  )
}

function Sparkles({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <i className="fa-solid fa-star text-[13px] text-[#f2bd45]" />
      <i className="fa-solid fa-heart ml-3 text-[10px] text-[#f295bb]" />
      <i className="fa-solid fa-star ml-3 text-[8px] text-[#9e7bd5]" />
    </div>
  )
}

function QuestMascot({ small = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[radial-gradient(circle_at_35%_28%,#fff_0%,#fce5f2_40%,#dac5ff_100%)] shadow-[0_12px_28px_rgba(85,55,125,0.18)] ${
          small ? 'h-[86px] w-[86px]' : 'h-[155px] w-[155px]'
        }`}
      >
        <i
          className={`fa-solid fa-face-smile-beam text-[#8d67c5] ${
            small ? 'text-[34px]' : 'text-[52px]'
          }`}
        />
        <span className="absolute bottom-3 rounded-full bg-white/80 px-2 py-0.5 text-[8px] font-black text-[#7955ad]">
          SHADOW
        </span>
      </div>
    )
  }

  return (
    <img
      src={QUEST_MASCOT_URL}
      alt=""
      onError={() => setFailed(true)}
      className={
        small
          ? 'h-[92px] w-[92px] object-contain drop-shadow-[0_10px_18px_rgba(79,52,117,0.18)]'
          : 'h-[178px] w-[178px] object-contain drop-shadow-[0_14px_26px_rgba(79,52,117,0.2)]'
      }
    />
  )
}

function ProgressBar({
  current,
  required,
  done = false,
  dark = false,
  gradientClass = 'from-[#f1b532] via-[#f6ca4f] to-[#a477e3]',
}) {
  const percent = progressPercent(current, required)

  return (
    <div className={`h-2.5 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-[#eee8f4]'}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
          done ? 'from-[#e8a823] to-[#ffd15a]' : gradientClass
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function PaperSection({ title, subtitle, icon, children, accent = 'purple', className = '' }) {
  const accents = {
    purple: {
      title: 'text-[#5b3d83]',
      icon: 'bg-[#eee5ff] text-[#7752b6]',
      border: 'border-[#ddd0ed]',
      bg: 'bg-[linear-gradient(180deg,#fffdfb_0%,#fbf8ff_100%)]',
    },
    pink: {
      title: 'text-[#cc5a87]',
      icon: 'bg-[#ffe4ef] text-[#de6b9a]',
      border: 'border-[#f0cedd]',
      bg: 'bg-[linear-gradient(180deg,#fffdfd_0%,#fff7fa_100%)]',
    },
    blue: {
      title: 'text-[#536ab3]',
      icon: 'bg-[#e8efff] text-[#5a75c4]',
      border: 'border-[#cfdbf4]',
      bg: 'bg-[linear-gradient(180deg,#fffefe_0%,#f8faff_100%)]',
    },
  }

  const style = accents[accent] || accents.purple

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border ${style.border} ${style.bg} p-4 shadow-[0_12px_30px_rgba(86,61,118,0.07)] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(117,93,145,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(117,93,145,0.035) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <Tape className="-right-4 top-3" blue={accent === 'blue'} />

      <div className="mb-4 flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
          <i className={`${icon} text-[14px]`} />
        </span>

        <div className="min-w-0">
          <h2 className={`text-[18px] font-black tracking-[-0.035em] ${style.title}`}>
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[11.5px] font-semibold leading-5 text-[#8a7c96]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  )
}

function MilestoneCard({ icon, label, current, required }) {
  const done = numberValue(current) >= numberValue(required)
  const style = MILESTONE_STYLES[label] || MILESTONE_STYLES.Episodes

  return (
    <div
      className={`rounded-[22px] border p-3.5 shadow-[0_6px_18px_rgba(80,58,110,0.055)] ${
        done ? 'border-[#edc65c] bg-[#fffaf0]' : 'border-[#e8def0] bg-white/85'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] ${style.iconBg} ${style.iconText}`}>
          <i className={`${done ? 'fa-solid fa-check' : icon} text-[15px]`} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[13px] font-black text-[#423356]">{label}</div>
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${
                done ? 'bg-[#f5bf3f] text-[#533c08]' : 'bg-[#f0eaf7] text-[#72569a]'
              }`}
            >
              {done ? 'Done' : `${progressPercent(current, required)}%`}
            </span>
          </div>

          <div className="mt-0.5 text-[10.5px] font-semibold text-[#8a7c95]">
            {compactNumber(current)} / {compactNumber(required)}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar
          current={current}
          required={required}
          done={done}
          gradientClass={style.bar}
        />
      </div>
    </div>
  )
}

function StageRoadmapItem({ stage, currentStageNumber, index, total }) {
  const stageNumber = numberValue(stage.stage_number)
  const current = stageNumber === numberValue(currentStageNumber)
  const completed = stageNumber < numberValue(currentStageNumber)
  const locked = stageNumber > numberValue(currentStageNumber)

  return (
    <div className="relative pl-[46px]">
      {index < total - 1 ? (
        <div className="absolute bottom-[-11px] left-[18px] top-[31px] w-[2px] rounded-full bg-[#dcccee]" />
      ) : null}

      <div
        className={`absolute left-0 top-2 flex h-[38px] w-[38px] items-center justify-center rounded-full border-[3px] shadow-sm ${
          current
            ? 'border-[#f1bf46] bg-[#fff0b9] text-[#b47a00]'
            : completed
              ? 'border-[#b699db] bg-[#eee5ff] text-[#704da5]'
              : 'border-[#ddd4e5] bg-[#f8f5fa] text-[#a59bab]'
        }`}
      >
        {current ? (
          <i className="fa-solid fa-crown text-[13px]" />
        ) : completed ? (
          <i className="fa-solid fa-check text-[11px]" />
        ) : (
          <i className="fa-solid fa-lock text-[9px]" />
        )}
      </div>

      <div
        className={`rounded-[20px] border p-3.5 ${
          current
            ? 'border-[#e9bd4e] bg-[linear-gradient(90deg,#fff8df_0%,#fffdf8_100%)] shadow-[0_7px_20px_rgba(205,158,37,0.1)]'
            : 'border-[#e8e0ee] bg-white/80'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.04em] text-[#79648f]">
              Stage {stage.stage_number}
            </div>
            <div className="mt-1 text-[27px] font-black leading-none tracking-[-0.05em] text-[#37254e]">
              {percentText(stage.share_percent)}
            </div>
            <div className="mt-1 text-[8.5px] font-black uppercase tracking-[0.1em] text-[#a489bf]">
              Author share
            </div>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[8.5px] font-black uppercase ${
              current
                ? 'bg-[#f0b632] text-white'
                : completed
                  ? 'bg-[#eee4ff] text-[#7654a8]'
                  : 'bg-[#f0edf3] text-[#9a91a3]'
            }`}
          >
            {completed ? 'Completed' : current ? 'Current' : locked ? 'Locked' : 'Stage'}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-semibold text-[#75677f]">
          <div>
            Episodes:{' '}
            <span className="font-black text-[#51415f]">
              {compactNumber(stage.requirements?.episodes?.required)}
            </span>
          </div>
          <div>
            Words:{' '}
            <span className="font-black text-[#51415f]">
              {compactNumber(stage.requirements?.words?.required)}
            </span>
          </div>
          <div>
            Likes:{' '}
            <span className="font-black text-[#51415f]">
              {compactNumber(stage.requirements?.likes?.required)}
            </span>
          </div>
          <div>
            Followers:{' '}
            <span className="font-black text-[#51415f]">
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
          ? 'border-[#ebc14e] bg-[#fff8e6]'
          : 'border-[#ebe2f2] bg-white/85'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[13px] ${
            done ? 'bg-[#ffeab2] text-[#b97b00]' : 'bg-[#efe7fa] text-[#7654a8]'
          }`}
        >
          <i className={`${done ? 'fa-solid fa-check' : item.icon} text-[11px]`} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 text-[10.5px] font-black text-[#4d3b61]">
              {item.shortLabel}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                done ? 'bg-[#f0b72f] text-[#4c3606]' : 'bg-[#f0ebf5] text-[#806a92]'
              }`}
            >
              {done ? 'Done' : `${progressPercent(item.current, item.required)}%`}
            </span>
          </div>

          <div className="mt-0.5 text-[9.5px] font-semibold text-[#91829d]">
            {compactNumber(item.current, item.prefix)} / {compactNumber(item.required, item.prefix)}
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <ProgressBar
          current={item.current}
          required={item.required}
          done={done}
          gradientClass="from-[#8d65d2] to-[#d18be4]"
        />
      </div>
    </div>
  )
}

function BoostGroup({ title, subtitle, count, children, pink = false }) {
  return (
    <div
      className={`rounded-[24px] border p-3.5 ${
        pink
          ? 'border-[#f0cbdc] bg-[#fff8fb]'
          : 'border-[#ded0ec] bg-[#faf7ff]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-[14px] font-black ${pink ? 'text-[#bd5c83]' : 'text-[#5a3e7d]'}`}>
            {title}
          </h3>
          <p className="mt-1 text-[10px] font-semibold text-[#93869e]">{subtitle}</p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-black ${
            pink ? 'bg-[#ffe5f0] text-[#c35e87]' : 'bg-[#eee5ff] text-[#7652ad]'
          }`}
        >
          {count}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function RulesNote({ onLearnMore }) {
  return (
    <button
      type="button"
      onClick={onLearnMore}
      className="relative w-full overflow-hidden rounded-[28px] border border-[#ecd7df] bg-[linear-gradient(180deg,#fffdf9_0%,#fff7f7_100%)] p-4 text-left shadow-[0_10px_26px_rgba(89,63,119,0.07)] transition active:scale-[0.99]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(224,122,159,0.04) 1px, transparent 1px)',
        backgroundSize: '100% 23px',
      }}
    >
      <Tape className="-right-5 top-5 rotate-[7deg]" />

      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ffe5ef] text-[#dc6b98]">
          <i className="fa-solid fa-book-open text-[14px]" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-black text-[#5c3d73]">Quest Rules</div>
          <div className="mt-3 space-y-2 text-[11px] font-semibold leading-5 text-[#786b82]">
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>Quest progress is calculated from published stories and verified reader activity.</span>
            </p>
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>Paid income comes from Diamond unlocks only.</span>
            </p>
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>100-Day Creator Boost requires all required milestones plus any 3 growth milestones.</span>
            </p>
            <p className="flex gap-2">
              <i className="fa-solid fa-star mt-1 text-[8px] text-[#f0b63e]" />
              <span>The 100-Day Creator Boost can be used only once per author account.</span>
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1e8fb] text-[#8b65bd]">
          <i className="fa-solid fa-chevron-right text-[10px]" />
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-14 rotate-[-4deg] rounded-[8px] border border-[#eed2dc] bg-[#fff9de] px-3 py-2 text-center text-[9px] font-black leading-4 text-[#70537f] shadow-sm">
        Write · Create · Grow
      </div>
    </button>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[265px] animate-pulse rounded-[30px] bg-white" />
      <div className="h-[300px] animate-pulse rounded-[28px] bg-white" />
      <div className="h-[410px] animate-pulse rounded-[28px] bg-white" />
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
    ...requirements.map((item) => progressPercent(item?.current, item?.required))
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
        throw new Error(result.message || 'Failed to activate 100-Day Creator Boost')
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
          refreshResult.message || 'Boost activated, but the page could not refresh'
        )
      }

      setData(refreshResult)
      setBoostNotice({
        type: 'success',
        text: result.message || '100-Day Creator Boost activated successfully',
      })
    } catch (err) {
      setBoostNotice({
        type: 'error',
        text: err.message || 'Failed to activate 100-Day Creator Boost',
      })
    } finally {
      setActivatingBoost(false)
    }
  }

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        backgroundColor: '#fbf8ff',
        backgroundImage:
          'radial-gradient(circle at 18% 10%, rgba(255,211,228,0.45), transparent 27%), radial-gradient(circle at 85% 12%, rgba(216,201,255,0.5), transparent 26%), linear-gradient(180deg,#fffdf9 0%,#f8f3ff 52%,#fff8fb 100%)',
      }}
    >
      <div className="sticky top-0 z-40 border-b border-[#eadff1] bg-[#fffdf9]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-[760px] items-center justify-between px-4">
          <HeaderButton
            icon="fa-solid fa-chevron-left"
            label="Back"
            onClick={() =>
              navigate(fromPage === 'income' ? '/author/income' : '/author/profile', {
                replace: true,
              })
            }
          />

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-crown text-[12px] text-[#edb233]" />
              <h1 className="text-[21px] font-black tracking-[-0.04em] text-[#4f3479]">
                Quest
              </h1>
              <i className="fa-solid fa-star text-[10px] text-[#f4c24d]" />
            </div>
            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.11em] text-[#a88fc0]">
              Stage and creator rewards
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff6cf] text-[#dca623]">
            <i className="fa-solid fa-star text-[13px]" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[760px] space-y-4 px-3 pt-4 sm:px-4">
        {loading ? <LoadingSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-[26px] border border-[#f1d2df] bg-white p-5 text-center shadow-[0_12px_28px_rgba(93,64,136,0.08)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f5] text-[#e45f8d]">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="mt-3 text-[15px] font-black text-[#503765]">{error}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 h-11 rounded-full bg-[#7452ae] px-6 text-[13px] font-black text-white transition active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section
              className="relative overflow-hidden rounded-[30px] border border-[#cdb8f2] bg-[linear-gradient(135deg,#fff9f2_0%,#fff5fb_40%,#eee7ff_100%)] shadow-[0_16px_36px_rgba(94,58,142,0.14)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(115,83,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(115,83,150,0.04) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <SpiralBinding />
              <Sparkles className="absolute right-5 top-4" />
              <Tape className="right-3 top-[88px] rotate-[8deg]" />

              <div className="relative min-h-[245px] pl-[46px] pr-3 pt-5">
                <div className="absolute right-[-12px] top-[58px] z-0 sm:right-5 sm:top-5">
                  <QuestMascot />
                </div>

                <div className="relative z-10 max-w-[67%] sm:max-w-[58%]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ef82af] px-3 py-1.5 text-[9.5px] font-black uppercase tracking-[0.08em] text-white shadow-sm">
                    <i className="fa-solid fa-crown text-[8px]" />
                    Current Share
                  </div>

                  <div className="mt-2.5 bg-[linear-gradient(180deg,#ff75a7_0%,#d76ce7_100%)] bg-clip-text text-[58px] font-black leading-none tracking-[-0.08em] text-transparent drop-shadow-[0_2px_0_rgba(255,255,255,0.9)]">
                    {percentText(activeShare.share_percent || currentStage.share_percent)}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[13px] font-black text-[#4b3b62]">You are on</span>
                    <span className="rounded-full bg-[#f7a5c7] px-3 py-1 text-[10px] font-black text-white">
                      Stage {currentStage.stage_number || 1}
                    </span>
                  </div>

                  <p className="mt-2 max-w-[245px] text-[11px] font-semibold leading-5 text-[#78668a]">
                    {activeShare.source === 'lifetime_boost'
                      ? `100-Day Creator Boost active until ${dateText(activeShare.boost_ends_at)}.`
                      : 'Keep growing to unlock higher share levels.'}
                  </p>
                </div>

                <div className="absolute right-4 top-4 z-20 rounded-2xl border border-[#e8bb46] bg-[#fff7d8] px-3 py-2 shadow-[0_6px_16px_rgba(201,152,24,0.16)]">
                  <div className="flex items-center gap-1.5">
                    <i className="fa-solid fa-crown text-[9px] text-[#d99e18]" />
                    <span className="text-[9.5px] font-black uppercase tracking-[0.04em] text-[#5a426d]">
                      Stage {currentStage.stage_number || 1}
                    </span>
                  </div>
                </div>

                <div className="relative z-20 mb-4 mt-5 rounded-[20px] border border-[#d9c9ef] bg-white/90 p-3.5 shadow-[0_8px_18px_rgba(85,58,119,0.08)] backdrop-blur">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-black text-[#4e3571]">
                      {nextStage
                        ? `Next Milestone: Stage ${nextStage.stage_number}`
                        : 'Maximum normal stage reached'}
                    </div>
                    <div className="text-[9.5px] font-bold text-[#8e71ae]">
                      {nextStage
                        ? `Unlock ${percentText(nextStage.share_percent)} Share`
                        : 'Great work'}
                    </div>
                  </div>

                  <ProgressBar current={stageProgress} required={100} />

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[8.5px] font-bold text-[#b295c6]">
                      <i className="fa-solid fa-star mr-1 text-[7px] text-[#f0b640]" />
                      Keep going
                    </span>
                    <span className="text-[9.5px] font-black text-[#72519d]">
                      {stageProgress}% complete
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {nextStage ? (
              <PaperSection
                title={`To Reach Stage ${nextStage.stage_number}`}
                subtitle={`Complete these milestones to grow your share to ${percentText(nextStage.share_percent)}.`}
                icon="fa-solid fa-bullseye"
                accent="pink"
              >
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {nextRequirements.map(([label, item, icon]) => (
                    <MilestoneCard
                      key={label}
                      icon={icon}
                      label={label}
                      current={item?.current}
                      required={item?.required}
                    />
                  ))}
                </div>
              </PaperSection>
            ) : (
              <PaperSection
                title="Normal Stages Completed"
                subtitle="You have reached the highest normal Quest share stage."
                icon="fa-solid fa-trophy"
                accent="pink"
              >
                <div className="rounded-[20px] border border-[#cae8d2] bg-[#f2fff6] p-4 text-[12px] font-bold leading-6 text-[#3f8453]">
                  You can now focus on the 100-Day Creator Boost milestones.
                </div>
              </PaperSection>
            )}

            <PaperSection
              title="Stage Roadmap"
              subtitle="Your author share grows as you complete each stage."
              icon="fa-solid fa-map"
              accent="blue"
            >
              <div className="space-y-2.5">
                {(data.stage_rules || []).map((stage, index, array) => (
                  <StageRoadmapItem
                    key={stage.stage_number}
                    stage={stage}
                    currentStageNumber={currentStage.stage_number}
                    index={index}
                    total={array.length}
                  />
                ))}
              </div>
            </PaperSection>

            <section className="relative overflow-hidden rounded-[30px] border border-[#6c4c95] bg-[linear-gradient(145deg,#2d2044_0%,#40265b_52%,#2b2243_100%)] p-4 shadow-[0_18px_40px_rgba(52,34,76,0.2)] sm:p-5">
              <SpiralBinding dark />
              <Sparkles className="absolute right-5 top-4" />

              <div className="relative pl-[34px]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[9px] font-black uppercase tracking-[0.12em] text-[#f6c94f]">
                      Lifetime Reward
                    </div>
                    <h2 className="mt-1.5 text-[23px] font-black leading-tight tracking-[-0.045em] text-white">
                      100-Day Creator Boost
                    </h2>
                    <p className="mt-1.5 max-w-[430px] text-[10.5px] font-semibold leading-5 text-white/60">
                      Earn 100% revenue share for 100 days. One time only per author account.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[8.5px] font-black uppercase text-[#f7ca4d]">
                    {String(lifetimeBoost?.status || 'locked').replaceAll('_', ' ')}
                  </span>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.07] p-3.5">
                  <div className="absolute -right-2 -top-1 opacity-90">
                    <QuestMascot small />
                  </div>

                  <div className="relative z-10 max-w-[68%]">
                    <div className="text-[12px] font-black text-[#ffdc73]">Creator Treasure</div>
                    <p className="mt-1 text-[9.5px] font-semibold leading-4 text-white/55">
                      Complete your milestones and unlock the one-time 100-day reward.
                    </p>
                  </div>
                </div>

                {lifetimeBoost?.status === 'active' ? (
                  <div className="mt-4 rounded-[20px] border border-[#a8dfb5] bg-[#effff3] p-4 text-[12px] font-black text-[#34814b]">
                    Boost active until {dateText(lifetimeBoost.ended_at)}.
                  </div>
                ) : null}

                {lifetimeBoost?.status === 'eligible' ? (
                  <div className="mt-4 rounded-[22px] border border-[#e7be55] bg-[#fff8e6] p-4 text-[#4d3c1d]">
                    <div className="text-[13px] font-black">
                      Your 100-Day Creator Boost is ready.
                    </div>
                    <p className="mt-1 text-[10.5px] font-semibold leading-5 text-[#8a6a25]">
                      It starts immediately, cannot be paused, and can be activated only once.
                    </p>
                    <button
                      type="button"
                      onClick={activateBoost}
                      disabled={activatingBoost}
                      className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#4c3268] px-5 text-[12px] font-black text-[#ffdc6c] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <i
                        className={
                          activatingBoost
                            ? 'fa-solid fa-spinner fa-spin'
                            : 'fa-solid fa-bolt'
                        }
                      />
                      {activatingBoost ? 'Activating...' : 'Activate 100-Day Boost'}
                    </button>
                  </div>
                ) : null}

                {lifetimeBoost?.status === 'expired' ? (
                  <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.07] p-4 text-[11px] font-bold leading-5 text-white/60">
                    This one-time 100-Day Creator Boost has ended.
                  </div>
                ) : null}

                {boostNotice ? (
                  <div
                    className={`mt-4 rounded-[20px] p-4 text-[11px] font-bold leading-5 ${
                      boostNotice.type === 'success'
                        ? 'bg-[#effff3] text-[#34814b]'
                        : 'bg-[#fff1f4] text-[#bf426b]'
                    }`}
                  >
                    {boostNotice.text}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <BoostGroup
                    title="Required Milestones"
                    subtitle="Complete all required milestones."
                    count={`${requiredDoneCount}/${requiredMilestones.length}`}
                  >
                    {requiredMilestones.map((item) => (
                      <BoostRequirement key={item.key} item={item} />
                    ))}
                  </BoostGroup>

                  <BoostGroup
                    title="Growth Milestones"
                    subtitle="Complete any 3 of 5."
                    count={`${Math.min(growthDoneCount, 3)}/3`}
                    pink
                  >
                    {growthMilestones.map((item) => (
                      <BoostRequirement key={item.key} item={item} />
                    ))}
                  </BoostGroup>
                </div>
              </div>
            </section>

            <RulesNote onLearnMore={() => navigate('/author/benefits?from=quest')} />
          </>
        ) : null}
      </main>
    </div>
  )
}
