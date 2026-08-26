import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function formatDate(dateString) {
  if (!dateString) return 'Not set'

  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function calculateAge(dateString) {
  if (!dateString) return null

  const birthDate = new Date(`${dateString}T00:00:00`)
  const today = new Date()

  if (Number.isNaN(birthDate.getTime())) return null

  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1
  }

  return age
}

function getCooldownInfo(updatedAt) {
  if (!updatedAt) {
    return {
      locked: false,
      text: 'You can change your date of birth now.',
    }
  }

  const changedAt = new Date(updatedAt).getTime()
  const nextChangeAt = changedAt + 7 * 24 * 60 * 60 * 1000
  const remaining = nextChangeAt - Date.now()

  if (!Number.isFinite(changedAt) || remaining <= 0) {
    return {
      locked: false,
      text: 'You can change your date of birth now.',
    }
  }

  const days = Math.ceil(remaining / (24 * 60 * 60 * 1000))

  return {
    locked: true,
    text: `You can change it again in ${days} day${days === 1 ? '' : 's'}.`,
  }
}

export default function ReaderAccountSecurityPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [editingBirthDate, setEditingBirthDate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const cooldown = useMemo(
    () => getCooldownInfo(user?.date_of_birth_updated_at),
    [user?.date_of_birth_updated_at]
  )

  const age = useMemo(
    () => calculateAge(user?.date_of_birth),
    [user?.date_of_birth]
  )

  useEffect(() => {
    let ignore = false

    async function loadUser() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        setLoading(true)

        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Failed to load account')
        }

        if (!ignore) {
          setUser(data.user || null)
          setDateOfBirth(data.user?.date_of_birth || '')
          saveStoredUser(data.user)
        }
      } catch (error) {
        if (!ignore) {
          setMessage(error.message || 'Failed to load account')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUser()

    return () => {
      ignore = true
    }
  }, [navigate])

  async function handleSaveBirthDate() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    if (!dateOfBirth) {
      setMessage('Please select your date of birth.')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/date-of-birth`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date_of_birth: dateOfBirth,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to update date of birth')
      }

      setUser(data.user || user)
      saveStoredUser(data.user)
      setEditingBirthDate(false)
      setMessage('Date of birth updated.')
    } catch (error) {
      setMessage(error.message || 'Failed to update date of birth')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f9] pb-10 text-[#111827]">
      <header className="sticky top-0 z-40 border-b border-[#eceef2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => navigate('/profile/settings')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[#f3f4f6]"
            aria-label="Back to settings"
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div>
            <h1 className="text-[18px] font-extrabold">Account & security</h1>
            <p className="text-[11px] text-[#8d94a1]">Personal information and account protection</p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 py-5">
        {message ? (
          <div className="mb-4 rounded-[14px] border border-[#eceef2] bg-white px-4 py-3 text-[12px] font-medium text-[#555d6b]">
            {message}
          </div>
        ) : null}

        <section>
          <h2 className="mb-2 px-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[#8d94a1]">
            Personal information
          </h2>

          <div className="overflow-hidden rounded-[18px] border border-[#eceef2] bg-white">
            {loading ? (
              <div className="px-4 py-6 text-[13px] text-[#8d94a1]">Loading...</div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!cooldown.locked) {
                      setEditingBirthDate((current) => !current)
                      setMessage('')
                    }
                  }}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left active:bg-[#f7f7f9]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#5f4b8b]">
                    <i className="fa-regular fa-calendar text-[17px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">Date of birth</span>
                    <span className="mt-1 block text-[12px] text-[#8d94a1]">
                      {formatDate(user?.date_of_birth)}
                      {age !== null ? ` · Age ${age}` : ''}
                    </span>
                  </span>

                  <i
                    className={`fa-solid ${
                      cooldown.locked ? 'fa-lock' : 'fa-chevron-right'
                    } text-[12px] text-[#a6abb4]`}
                  />
                </button>

                <div className="border-t border-[#f0f1f3] px-4 py-3">
                  <p className="text-[11px] leading-5 text-[#8d94a1]">
                    Your birthday is private and is used to determine access to age-restricted content.
                  </p>
                  <p className={`mt-1 text-[11px] font-semibold ${
                    cooldown.locked ? 'text-[#b26a28]' : 'text-[#5b8a61]'
                  }`}>
                    {cooldown.text}
                  </p>
                </div>

                {editingBirthDate && !cooldown.locked ? (
                  <div className="border-t border-[#f0f1f3] px-4 py-4">
                    <label className="mb-2 block text-[12px] font-bold text-[#555d6b]">
                      Select date of birth
                    </label>

                    <input
                      type="date"
                      value={dateOfBirth}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(event) => setDateOfBirth(event.target.value)}
                      className="h-12 w-full rounded-[12px] border border-[#dfe2e7] bg-white px-3 text-[14px] outline-none focus:border-[#8a70b5]"
                    />

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBirthDate(false)
                          setDateOfBirth(user?.date_of_birth || '')
                          setMessage('')
                        }}
                        className="h-11 flex-1 rounded-[12px] border border-[#dfe2e7] bg-white text-[13px] font-bold"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveBirthDate}
                        disabled={saving}
                        className="h-11 flex-1 rounded-[12px] bg-[#111827] text-[13px] font-bold text-white disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 px-1 text-[12px] font-bold uppercase tracking-[0.08em] text-[#8d94a1]">
            Security
          </h2>

          <div className="overflow-hidden rounded-[18px] border border-[#eceef2] bg-white">
            <button
  type="button"
  onClick={() => navigate('/profile/settings/account-security/change-password')}
  className="flex w-full items-center gap-4 px-4 py-4 text-left active:bg-[#f7f7f9]"
>
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#5f4b8b]">
    <i className="fa-solid fa-key text-[16px]" />
  </span>

  <span className="min-w-0 flex-1">
    <span className="block text-[15px] font-semibold">Change password</span>
    <span className="mt-1 block text-[12px] text-[#8d94a1]">
      Current password required
    </span>
  </span>

  <i className="fa-solid fa-chevron-right text-[12px] text-[#a6abb4]" />
</button>

<button
  type="button"
  onClick={() => navigate('/profile/settings/account-security/change-email')}
  className="flex w-full items-center gap-4 border-t border-[#f0f1f3] px-4 py-4 text-left active:bg-[#f7f7f9]"
>
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#5f4b8b]">
    <i className="fa-solid fa-envelope text-[16px]" />
  </span>

  <span className="min-w-0 flex-1">
    <span className="block text-[15px] font-semibold">Email</span>
    <span className="mt-1 block truncate text-[12px] text-[#8d94a1]">
      {user?.email || 'Manage login email'}
    </span>
  </span>

  <i className="fa-solid fa-chevron-right text-[12px] text-[#a6abb4]" />
</button>
          </div>
        </section>
      </div>
    </main>
  )
}
