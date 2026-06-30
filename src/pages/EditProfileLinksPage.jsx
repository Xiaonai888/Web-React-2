import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const PROFILE_LINK_OPTIONS = [
  { type: 'website', label: 'Website', icon: 'fas fa-globe' },
  { type: 'facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
  { type: 'instagram', label: 'Instagram', icon: 'fab fa-instagram' },
  { type: 'telegram', label: 'Telegram', icon: 'fab fa-telegram-plane' },
  { type: 'tiktok', label: 'TikTok', icon: 'fab fa-tiktok' },
  { type: 'youtube', label: 'YouTube', icon: 'fab fa-youtube' },
  { type: 'x', label: 'X', icon: 'fab fa-twitter' },
  { type: 'link', label: 'Other Link', icon: 'fas fa-link' },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function saveStoredUser(user) {
  if (!user) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_user', JSON.stringify(user))
    return
  }

  sessionStorage.setItem('shadow_reader_user', JSON.stringify(user))
}

function saveAuthToken(token) {
  if (!token) return

  if (localStorage.getItem('shadow_reader_token')) {
    localStorage.setItem('shadow_reader_token', token)
    return
  }

  sessionStorage.setItem('shadow_reader_token', token)
}

function getProfileLinkOption(type) {
  return PROFILE_LINK_OPTIONS.find((item) => item.type === type) || PROFILE_LINK_OPTIONS[0]
}

function normalizeProfileLinkUrl(url) {
  const trimmed = String(url || '').trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function normalizeSocialLinks(value) {
  return (Array.isArray(value) ? value : [])
    .map((item) => ({
      type: String(item?.type || 'website').trim().toLowerCase(),
      url: String(item?.url || '').trim(),
    }))
    .slice(0, 5)
}

function emptyForm(user) {
  return {
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    work: user?.work || '',
    location: user?.location || '',
    social_links: normalizeSocialLinks(user?.social_links),
  }
}

async function fetchCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Failed to load profile links')
  }

  return data.user || null
}

export default function EditProfileLinksPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(() => emptyForm(getStoredUser()))
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setLoading(true)
        const freshUser = await fetchCurrentUser(token)

        if (!ignore && freshUser) {
          saveStoredUser(freshUser)
          setForm(emptyForm(freshUser))
        }
      } catch (error) {
        if (!ignore) setMessage(error.message || 'Failed to load profile links')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      ignore = true
    }
  }, [navigate])

  const updateLink = (index, payload) => {
    setForm((current) => ({
      ...current,
      social_links: current.social_links.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...payload } : item
      ),
    }))
  }

  const addLink = () => {
    setForm((current) => {
      if (current.social_links.length >= 5) return current

      return {
        ...current,
        social_links: [...current.social_links, { type: 'website', url: '' }],
      }
    })
  }

  const removeLink = (index) => {
    setForm((current) => ({
      ...current,
      social_links: current.social_links.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleSave = async () => {
    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    if (!form.name.trim()) {
      setMessage('Display name is required')
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          bio: form.bio,
          work: form.work,
          location: form.location,
          social_links: form.social_links
            .map((item) => ({ type: item.type, url: normalizeProfileLinkUrl(item.url) }))
            .filter((item) => item.url)
            .slice(0, 5),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to save profile links')
      }

      saveStoredUser(data.user)
      if (data.token) saveAuthToken(data.token)
      navigate('/profile/edit')
    } catch (error) {
      setMessage(error.message || 'Failed to save profile links')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#f5f3fa] md:px-4 md:py-6">
      <main className="mx-auto min-h-screen w-full bg-white md:min-h-0 md:max-w-[560px] md:overflow-hidden md:rounded-[26px] md:border md:border-[#eceaf2] md:shadow-sm">
        <header className="sticky top-0 z-20 border-b border-[#f0eef6] bg-white/95 px-4 py-3 backdrop-blur md:rounded-t-[26px]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile/edit')}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:scale-95"
              aria-label="Back to edit profile"
            >
              <i className="fa-solid fa-chevron-left text-[15px]" />
            </button>

            <div className="min-w-0 flex-1 text-center text-[16px] font-extrabold text-[#111827]">Profile Links</div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-extrabold text-white disabled:bg-[#9ca3af]"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </header>

        <section className="px-4 pb-8 pt-5">
          {message ? (
            <div className="mb-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold text-[#e5484d]">
              {message}
            </div>
          ) : null}

          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-extrabold text-[#111827]">Add link</h1>
              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#8d94a1]">Choose an icon and add a link to show on your timeline profile.</p>
            </div>
            <div className="shrink-0 text-[12px] font-extrabold text-[#98a2b3]">{form.social_links.length}/5</div>
          </div>

          <div className="space-y-3">
            {form.social_links.map((link, index) => {
              const option = getProfileLinkOption(link.type)

              return (
                <div key={index} className="rounded-[20px] border border-[#e5e7eb] bg-[#fafafe] p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[16px] text-[#111827] ring-1 ring-[#e5e7eb]">
                      <i className={option.icon} />
                    </div>

                    <select
                      value={link.type}
                      onChange={(event) => updateLink(index, { type: event.target.value })}
                      className="h-11 min-w-0 flex-1 rounded-[14px] border border-[#e5e7eb] bg-white px-3 text-[13px] font-extrabold text-[#111827] outline-none focus:border-[#111827]"
                    >
                      {PROFILE_LINK_OPTIONS.map((item) => (
                        <option key={item.type} value={item.type}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#e5484d] ring-1 ring-[#e5e7eb] active:scale-95"
                      aria-label="Remove link"
                    >
                      <i className="fa-solid fa-trash text-[12px]" />
                    </button>
                  </div>

                  <input
                    value={link.url}
                    onChange={(event) => updateLink(index, { url: event.target.value })}
                    className="mt-2 h-11 w-full rounded-[14px] border border-[#e5e7eb] bg-white px-4 text-[13px] text-[#111827] outline-none focus:border-[#111827]"
                    placeholder="https://example.com"
                  />
                </div>
              )
            })}
          </div>

          {form.social_links.length < 5 ? (
            <button
              type="button"
              onClick={addLink}
              className="mt-4 h-12 w-full rounded-[16px] border border-dashed border-[#cfd3dc] bg-white text-[13px] font-extrabold text-[#111827] active:scale-[0.99]"
            >
              <i className="fa-solid fa-plus mr-2 text-[12px]" />
              Add link
            </button>
          ) : null}
        </section>
      </main>
    </div>
  )
}
