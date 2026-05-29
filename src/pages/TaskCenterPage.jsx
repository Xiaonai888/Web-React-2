import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const dailyRewards = [
  { day: 1, gems: 50, status: 'claimed' },
  { day: 2, gems: 100, status: 'ready' },
  { day: 3, gems: 150, status: 'locked' },
  { day: 4, gems: 200, status: 'locked' },
  { day: 5, gems: 250, status: 'locked' },
  { day: 6, gems: 300, status: 'locked' },
  { day: 7, gems: 500, storyCard: 1, status: 'locked' },
]

const dailyMissions = [
  {
    id: 'read-10-min',
    title: 'Read 10 minutes',
    reward: 50,
    progress: 0,
    target: 10,
    status: 'start',
    icon: 'fa-book-open',
  },
  {
    id: 'read-3-episodes',
    title: 'Read 3 episodes',
    reward: 100,
    progress: 1,
    target: 3,
    status: 'start',
    icon: 'fa-list-check',
  },
  {
    id: 'add-library',
    title: 'Add 1 story to Library',
    reward: 80,
    progress: 0,
    target: 1,
    status: 'start',
    icon: 'fa-bookmark',
  },
  {
    id: 'follow-author',
    title: 'Follow 1 author',
    reward: 80,
    progress: 1,
    target: 1,
    status: 'claim',
    icon: 'fa-user-plus',
  },
]

const weeklyMissions = [
  {
    id: 'read-3-days',
    title: 'Read 3 different days this week',
    reward: 200,
    progress: 1,
    target: 3,
    status: 'start',
    icon: 'fa-calendar-check',
  },
  {
    id: 'finish-10-episodes',
    title: 'Finish 10 episodes this week',
    reward: 250,
    progress: 4,
    target: 10,
    status: 'start',
    icon: 'fa-layer-group',
  },
  {
    id: 'share-story',
    title: 'Share 1 story',
    reward: 120,
    progress: 0,
    target: 1,
    status: 'start',
    icon: 'fa-share-nodes',
  },
  {
    id: 'unlock-paid',
    title: 'Unlock 1 paid episode',
    reward: 300,
    progress: 1,
    target: 1,
    status: 'claimed',
    icon: 'fa-lock-open',
  },
]

function RewardGem({ className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center text-[#6d28d9] ${className}`}>
      💎
    </span>
  )
}

function ProgressBar({ progress, target }) {
  const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[11px] font-bold text-[#8b93a1]">
        <span>{progress}/{target}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eef0f4]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff7a00] to-[#f6b800]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function MissionButton({ status }) {
  if (status === 'claimed') {
    return (
      <button
        type="button"
        disabled
        className="h-9 rounded-full bg-[#d1d5db] px-4 text-[12px] font-black text-white"
      >
        Claimed
      </button>
    )
  }

  if (status === 'claim') {
    return (
      <button
        type="button"
        className="h-9 rounded-full bg-[#111827] px-5 text-[12px] font-black text-white active:scale-[0.98]"
      >
        Claim
      </button>
    )
  }

  return (
    <button
      type="button"
      className="h-9 rounded-full border border-[#ff7a00] bg-white px-5 text-[12px] font-black text-[#ff7a00] active:scale-[0.98]"
    >
      Start
    </button>
  )
}

function MissionCard({ mission }) {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4e5] text-[#ff7a00]">
          <i className={`fa-solid ${mission.icon} text-[18px]`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-black leading-5 text-[#111827]">
                {mission.title}
              </h3>

              <div className="mt-1 flex items-center gap-1 text-[13px] font-black text-[#4c1d95]">
                <RewardGem />
                <span>+{mission.reward}</span>
              </div>
            </div>

            <MissionButton status={mission.status} />
          </div>

          <ProgressBar progress={mission.progress} target={mission.target} />
        </div>
      </div>
    </div>
  )
}

function CheckInCard({ reward }) {
  const isClaimed = reward.status === 'claimed'
  const isReady = reward.status === 'ready'
  const isLocked = reward.status === 'locked'

  return (
    <button
      type="button"
      disabled={!isReady}
      className={`relative min-h-[118px] rounded-[18px] border p-3 text-center transition active:scale-[0.98] ${
        isClaimed
          ? 'border-[#d1d5db] bg-[#f3f4f6] opacity-70'
          : isReady
            ? 'border-[#ff7a00] bg-white shadow-[0_8px_24px_rgba(255,122,0,0.15)]'
            : 'border-[#e5e7eb] bg-white'
      }`}
    >
      <div
        className={`absolute left-0 right-0 top-0 rounded-t-[17px] py-1 text-[11px] font-black text-white ${
          isClaimed ? 'bg-[#9ca3af]' : isReady ? 'bg-[#ff7a00]' : 'bg-[#7c3aed]'
        }`}
      >
        {isClaimed ? 'Claimed' : `Day ${reward.day}`}
      </div>

      <div className="pt-8">
        {reward.storyCard ? (
          <div className="text-[28px] leading-none">🎁</div>
        ) : (
          <RewardGem className="text-[26px]" />
        )}

        <div className="mt-1 text-[20px] font-black text-[#111827]">{reward.gems}</div>

        {reward.storyCard ? (
          <div className="mt-0.5 text-[10px] font-black text-[#ff7a00]">
            + {reward.storyCard} Story Card
          </div>
        ) : null}

        {isReady ? (
          <div className="mt-2 rounded-full bg-[#111827] px-3 py-1 text-[10px] font-black text-white">
            Ready
          </div>
        ) : null}

        {isLocked ? (
          <div className="mt-2 text-[10px] font-black text-[#9ca3af]">Locked</div>
        ) : null}
      </div>
    </button>
  )
}

export default function TaskCenterPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('daily')
  const [autoUnlock, setAutoUnlock] = useState(false)

  const userStatus = useMemo(() => {
    const storedUser = JSON.parse(localStorage.getItem('shadow_reader_user') || 'null')
    const tier = String(storedUser?.reader_tier || storedUser?.subscription_tier || storedUser?.role || 'free').toLowerCase()
    const premium = tier === 'premium' || tier === 'vip'

    return {
      isLoggedIn: Boolean(storedUser),
      isPremium: premium,
      gems: Number(storedUser?.gems || storedUser?.gem_balance || 0),
    }
  }, [])

  const gemsBalance = userStatus.gems || 932

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffdf5a] via-[#ffb24d] to-[#ff8746] pb-[110px]">
      <header className="sticky top-0 z-40 bg-white/10 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[760px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-center">
            <h1 className="text-[22px] font-black text-white">Task Center</h1>
            <p className="text-[11px] font-bold text-white/80">Earn rewards by reading every day</p>
          </div>

          <button
            type="button"
            onClick={() => {}}
            className="rounded-full bg-white/20 px-4 py-2 text-[12px] font-black text-white active:scale-95"
          >
            History
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-4 pt-4">
        <section className="rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[12px] font-bold text-[#8b93a1]">My Gems</p>
              <div className="mt-1 flex items-center gap-2 text-[30px] font-black text-[#ef0000]">
                <RewardGem className="text-[26px]" />
                <span>{gemsBalance.toLocaleString()}</span>
              </div>
            </div>

            <div className="rounded-[22px] bg-[#f8fafc] p-4">
              <p className="text-[12px] font-black text-[#111827]">
                {userStatus.isPremium ? 'Premium Auto-Claim' : 'Free Reader'}
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-[#8b93a1]">
                {userStatus.isPremium
                  ? 'Daily gems are claimed when you open the app.'
                  : 'Log in daily. Missing a day resets your streak.'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-[22px] bg-[#fff7ed] p-4">
            <div className="min-w-0">
              <p className="text-[13px] font-black text-[#111827]">Auto Unlock Episodes</p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-[#8b93a1]">
                Use Gems to auto-unlock paid episodes while reading.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAutoUnlock((current) => !current)}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                autoUnlock ? 'bg-[#111827]' : 'bg-[#d1d5db]'
              }`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                  autoUnlock ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('daily')}
              className={`h-12 rounded-[22px] text-[14px] font-black transition ${
                activeTab === 'daily'
                  ? 'bg-[#111827] text-white'
                  : 'bg-transparent text-[#9ca3af]'
              }`}
            >
              Daily Check-in
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('missions')}
              className={`h-12 rounded-[22px] text-[14px] font-black transition ${
                activeTab === 'missions'
                  ? 'bg-[#111827] text-white'
                  : 'bg-transparent text-[#9ca3af]'
              }`}
            >
              Missions
            </button>
          </div>
        </section>

        {activeTab === 'daily' ? (
          <>
            <section className="mt-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-black text-[#111827]">Daily Check-in</h2>
                  <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">
                    Streak: Day 2 · Next claim in 23h 12m
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
                >
                  <i className="fa-solid fa-question text-[12px]" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-7">
                {dailyRewards.map((reward) => (
                  <CheckInCard key={reward.day} reward={reward} />
                ))}
              </div>

              <div className="mt-5 rounded-[20px] bg-[#f8fafc] p-4 text-[12px] font-semibold leading-6 text-[#6b7280]">
                Free readers must log in daily to keep the streak. Premium readers auto-claim daily gems when they open the app.
              </div>
            </section>

            <section className="mt-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="text-[20px] font-black text-[#111827]">Today’s Quick Rewards</h2>
              <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">Small tasks you can finish today.</p>

              <div className="mt-4 space-y-3">
                {dailyMissions.slice(0, 3).map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>
          </>
        ) : null}

        {activeTab === 'missions' ? (
          <>
            <section className="mt-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-black text-[#111827]">Daily Missions</h2>
                  <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">Finish your task, grab your gems.</p>
                </div>

                <span className="rounded-full bg-[#fff4e5] px-3 py-1 text-[11px] font-black text-[#ff7a00]">
                  4 tasks
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {dailyMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-[30px] bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-black text-[#111827]">Weekly Missions</h2>
                  <p className="mt-1 text-[12px] font-bold text-[#8b93a1]">Bigger rewards for weekly reading goals.</p>
                </div>

                <span className="rounded-full bg-[#f5f3fa] px-3 py-1 text-[11px] font-black text-[#6d28d9]">
                  Weekly
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {weeklyMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  )
}
