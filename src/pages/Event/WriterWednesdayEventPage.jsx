import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PAGE_BG = '#ffffff'
const CARD_BG = '#ffffff'
const PRIMARY = '#7c3aed'
const PRIMARY_DARK = '#5b21b6'
const PRIMARY_SOFT = '#f3e8ff'
const TEXT = '#111827'
const MUTED = '#6b7280'
const BORDER = '#ede9fe'

function getCambodiaNow() {
  const now = new Date()
  const localTime = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(localTime + 7 * 60 * 60 * 1000)
}

function getNextWednesdayCambodia() {
  const now = getCambodiaNow()
  const next = new Date(now)
  const currentDay = now.getDay()
  const daysUntilWednesday = currentDay === 3 ? 7 : (3 - currentDay + 7) % 7
  next.setDate(now.getDate() + daysUntilWednesday)
  next.setHours(0, 0, 0, 0)
  return next
}

function getCountdownParts() {
  const now = getCambodiaNow().getTime()
  const target = getNextWednesdayCambodia().getTime()
  const diff = Math.max(0, target - now)
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return { days, hours, minutes }
}

function formatNextWednesdayLabel() {
  const next = getNextWednesdayCambodia()
  return next.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function StatItem({ icon, title, value, subValue }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        background: '#faf5ff',
        border: '1px solid #ede9fe',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: MUTED, fontSize: 13, fontWeight: 600 }}>{title}</div>
        <div style={{ color: TEXT, fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
        <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>{subValue}</div>
      </div>
    </div>
  )
}

function MiniCard({ icon, title, description }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: CARD_BG,
        border: '1px solid #ede9fe',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0 12px 30px rgba(124, 58, 237, 0.08)',
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 18,
          background: '#faf5ff',
          color: PRIMARY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          marginBottom: 14,
          border: '1px solid #ede9fe',
        }}
      >
        {icon}
      </div>
      <div style={{ color: TEXT, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{title}</div>
      <div style={{ color: MUTED, fontSize: 15, lineHeight: 1.6 }}>{description}</div>
    </div>
  )
}

export default function WriterWednesdayEventPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(getCountdownParts())

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownParts())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const nextWednesdayLabel = useMemo(() => formatNextWednesdayLabel(), [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: PAGE_BG,
        paddingBottom: 32,
      }}
    >
      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '20px 16px 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              border: 'none',
              background: 'transparent',
              color: TEXT,
              fontSize: 28,
              cursor: 'pointer',
              padding: 0,
              width: 32,
            }}
          >
            ←
          </button>
          <div style={{ color: TEXT, fontSize: 32, fontWeight: 800 }}>Event</div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 28,
            borderBottom: '1px solid #e5e7eb',
            marginBottom: 22,
          }}
        >
          <button
            onClick={() => navigate('/event')}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#9ca3af',
              fontWeight: 700,
              fontSize: 18,
              padding: '0 0 14px',
              cursor: 'pointer',
            }}
          >
            Author
          </button>
          <button
            style={{
              border: 'none',
              background: 'transparent',
              color: TEXT,
              fontWeight: 800,
              fontSize: 18,
              padding: '0 0 14px',
              borderBottom: `3px solid ${PRIMARY}`,
              cursor: 'pointer',
            }}
          >
            Event
          </button>
        </div>

        <div
          style={{
            background: 'linear-gradient(180deg, #fcfaff 0%, #ffffff 100%)',
            border: '1px solid #ede9fe',
            borderRadius: 30,
            padding: 22,
            boxShadow: '0 18px 44px rgba(124, 58, 237, 0.08)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#f5f3ff',
              color: PRIMARY,
              border: '1px solid #e9d5ff',
              borderRadius: 999,
              padding: '8px 14px',
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <span>📅</span>
            <span>Weekly Event</span>
          </div>

          <div
            style={{
              borderRadius: 26,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              padding: 18,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                height: 230,
                borderRadius: 22,
                border: '2px dashed rgba(255,255,255,0.55)',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 0.2,
                textAlign: 'center',
                padding: 20,
              }}
            >
              Add your image / shape later
            </div>
          </div>

          <div style={{ color: TEXT, fontSize: 50, fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>
            Writer
          </div>
          <div style={{ color: PRIMARY, fontSize: 50, fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>
            Wednesday
          </div>
          <div style={{ color: MUTED, fontSize: 18, lineHeight: 1.7, marginBottom: 20 }}>
            Create more. Earn more. You write, we reward.
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
            <StatItem icon="✍️" title="Authors get" value="70%" subValue="of episode unlocks" />
            <StatItem icon="🗓️" title="Happens" value="1 day" subValue="every week" />
            <StatItem icon="🕒" title="Time" value="All day" subValue="Cambodia Time" />
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #ede9fe',
            borderRadius: 28,
            padding: 22,
            boxShadow: '0 14px 34px rgba(124, 58, 237, 0.06)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ color: PRIMARY, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>NEXT WRITER WEDNESDAY</div>
              <div style={{ color: TEXT, fontSize: 34, fontWeight: 900, marginBottom: 12 }}>{nextWednesdayLabel}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <div style={{ background: PRIMARY_SOFT, color: PRIMARY_DARK, borderRadius: 16, padding: '10px 14px', fontWeight: 800 }}>{countdown.days} D</div>
                <div style={{ background: PRIMARY_SOFT, color: PRIMARY_DARK, borderRadius: 16, padding: '10px 14px', fontWeight: 800 }}>{countdown.hours} H</div>
                <div style={{ background: PRIMARY_SOFT, color: PRIMARY_DARK, borderRadius: 16, padding: '10px 14px', fontWeight: 800 }}>{countdown.minutes} M</div>
              </div>
              <div style={{ color: PRIMARY, fontSize: 16, fontWeight: 700 }}>
                Starts in {countdown.days}d {countdown.hours}h {countdown.minutes}m
              </div>
            </div>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 24,
                background: '#faf5ff',
                border: '1px dashed #c4b5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PRIMARY,
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'center',
                padding: 16,
              }}
            >
              Shape placeholder
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
            border: '1px solid #ede9fe',
            borderRadius: 28,
            padding: 22,
            marginBottom: 20,
          }}
        >
          <div style={{ color: TEXT, fontSize: 28, fontWeight: 900, marginBottom: 12 }}>About Writer Wednesday</div>
          <div style={{ color: MUTED, fontSize: 17, lineHeight: 1.8, marginBottom: 18 }}>
            One day a week, the spotlight is on you. Every Diamond episode unlock on Wednesday gives authors 70% revenue automatically.
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            <div style={{ background: '#ffffff', borderRadius: 20, padding: 18, border: '1px solid #ede9fe' }}>
              <div style={{ color: PRIMARY, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>70%</div>
              <div style={{ color: MUTED, fontSize: 15, lineHeight: 1.6 }}>Authors keep 70% from eligible Diamond episode unlocks.</div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: 20, padding: 18, border: '1px solid #ede9fe' }}>
              <div style={{ color: PRIMARY, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>1 day</div>
              <div style={{ color: MUTED, fontSize: 15, lineHeight: 1.6 }}>Runs every Wednesday from 12:00 AM to 11:59 PM Cambodia time.</div>
            </div>
            <div style={{ background: '#ffffff', borderRadius: 20, padding: 18, border: '1px solid #ede9fe' }}>
              <div style={{ color: PRIMARY, fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Auto apply</div>
              <div style={{ color: MUTED, fontSize: 15, lineHeight: 1.6 }}>No code needed. The reward applies automatically to eligible unlocks.</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <MiniCard icon="💎" title="Earn Bigger" description="Keep 70% from eligible Diamond episode unlocks every Wednesday." />
          <MiniCard icon="📆" title="Just 1 Day" description="A simple weekly event that is easy for authors to remember and plan for." />
          <MiniCard icon="🪄" title="Write More" description="Push your stories, release new episodes, and get more value from your work." />
        </div>

        <button
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 999,
            padding: '18px 22px',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 18px 34px rgba(124, 58, 237, 0.28)',
            marginBottom: 14,
          }}
        >
          JOIN WRITER WEDNESDAY
        </button>

        <div
          style={{
            color: MUTED,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Automatically applied to eligible Diamond episode unlocks.
        </div>
      </div>
    </div>
  )
}
