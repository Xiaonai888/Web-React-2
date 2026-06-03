import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
}

function formatNotificationDate(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString('en-GB')
}

export default function NotificationDetailPage() {
  const navigate = useNavigate()
  const { notificationId } = useParams()
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const createdAt = useMemo(() => formatNotificationDate(notification?.created_at), [notification])

  async function loadNotification() {
    const token = getReaderToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: getHeaders(),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 401 || response.status === 403) {
        navigate('/login')
        return
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to load notification')
      }

      const found = (data.notifications || []).find((item) => item.id === notificationId)

      if (!found || found.type !== 'announcements') {
        setNotification(null)
        setMessage('Notification not found')
        return
      }

      setNotification(found)

      if (!found.is_read) {
        await fetch(`${API_BASE_URL}/api/notifications/${found.id}/read`, {
          method: 'PATCH',
          headers: getHeaders(),
        }).catch(() => {})
      }
    } catch (error) {
      setNotification(null)
      setMessage(error.message || 'Failed to load notification')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotification()
  }, [notificationId])

  return (
    <div className="min-h-screen bg-[#F6F7FB] pb-10">
      <div className="sticky top-0 z-20 border-b border-[#E5E7EB] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[560px] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#111111] active:scale-95"
            aria-label="Back"
          >
            <i className="fas fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[20px] font-black text-[#111111]">Announcement</h1>
            <p className="mt-0.5 text-[12px] font-bold text-[#8A8F98]">Official message</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[560px] px-4 pt-4">
        {loading ? (
          <div className="mt-16 rounded-[26px] border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#111111]" />
            <p className="text-[13px] font-bold text-[#7B8190]">Loading announcement...</p>
          </div>
        ) : null}

        {!loading && message ? (
          <div className="rounded-[22px] border border-[#FECACA] bg-[#FFF1F1] p-4 text-[13px] font-bold text-[#E5484D]">
            {message}
          </div>
        ) : null}

        {!loading && !message && notification ? (
          <article className="rounded-[28px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF7D6] text-[#B77900]">
                <i className="fas fa-bullhorn text-[16px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black uppercase tracking-wide text-[#9CA3AF]">
                  {createdAt}
                </div>
                <h2 className="mt-2 text-[22px] font-black leading-7 text-[#111111]">{notification.title || 'Announcement'}</h2>
              </div>
            </div>

            <p className="mt-5 whitespace-pre-wrap text-[15px] font-semibold leading-8 text-[#4B5563]">
              {notification.message || ''}
            </p>

            {notification.link ? (
              <button
                type="button"
                onClick={() => navigate(notification.link)}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-[13px] font-black text-white active:scale-95"
              >
                Open link
              </button>
            ) : null}
          </article>
        ) : null}
      </main>
    </div>
  )
}
