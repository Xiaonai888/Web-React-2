import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const SETTINGS_PATH =
  '/api/authors/me/comment-protection/cleanup-settings'
const RUN_PATH =
  '/api/authors/me/comment-protection/cleanup/run'

const OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
]

function getToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatDate(value) {
  const date = new Date(value || '')
  if (Number.isNaN(date.getTime())) return 'Never'

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function AuthorAutoCleanupSettings({
  showToast,
}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [setting, setSetting] = useState({
    enabled: false,
    retention_days: 30,
    last_cleanup_at: null,
    last_cleanup_count: 0,
    last_cleanup_error: '',
  })

  const notify = useCallback(
    (message, type = 'success') => {
      if (typeof showToast === 'function') {
        showToast(message, type)
      }
    },
    [showToast]
  )

  const request = useCallback(
    async (path, options = {}) => {
      const token = getToken()

      if (!token) {
        navigate('/login', { replace: true })
        throw new Error('Please login again.')
      }

      const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
          },
        }
      )

      const data = await response
        .json()
        .catch(() => ({}))

      if (response.status === 401) {
        navigate('/login', { replace: true })
      }

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message || 'Request failed'
        )
      }

      return data
    },
    [navigate]
  )

  const loadSetting = useCallback(async () => {
    try {
      setLoading(true)
      const data = await request(SETTINGS_PATH)
      const next = data.setting || {}
      const days = Number(next.retention_days)

      setSetting({
        enabled: Boolean(next.enabled),
        retention_days:
          [7, 14, 30].includes(days)
            ? days
            : 30,
        last_cleanup_at:
          next.last_cleanup_at || null,
        last_cleanup_count:
          Math.max(
            0,
            Number(next.last_cleanup_count || 0)
          ),
        last_cleanup_error:
          next.last_cleanup_error || '',
      })
    } catch (error) {
      notify(
        error.message ||
          'Failed to load Auto Cleanup settings.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }, [notify, request])

  useEffect(() => {
    loadSetting()
  }, [loadSetting])

  const saveSetting = async (
    enabled,
    retentionDays
  ) => {
    if (saving) return

    try {
      setSaving(true)
      const data = await request(
        SETTINGS_PATH,
        {
          method: 'PUT',
          body: JSON.stringify({
            enabled,
            retention_days: retentionDays,
          }),
        }
      )
      const next = data.setting || {}

      setSetting((current) => ({
        ...current,
        enabled: Boolean(next.enabled),
        retention_days:
          Number(
            next.retention_days ||
              retentionDays
          ),
        last_cleanup_at:
          next.last_cleanup_at ||
          current.last_cleanup_at,
        last_cleanup_count:
          Number(
            next.last_cleanup_count ??
              current.last_cleanup_count
          ),
        last_cleanup_error:
          next.last_cleanup_error || '',
      }))

      notify(
        data.message ||
          'Auto Cleanup settings saved.'
      )
    } catch (error) {
      notify(
        error.message ||
          'Failed to save Auto Cleanup settings.',
        'error'
      )
    } finally {
      setSaving(false)
    }
  }

  const runNow = async () => {
    if (running) return

    try {
      setRunning(true)
      const data = await request(
        RUN_PATH,
        { method: 'POST' }
      )

      notify(
        data.message ||
          'Auto Cleanup completed.'
      )
      await loadSetting()
    } catch (error) {
      notify(
        error.message ||
          'Failed to run Auto Cleanup.',
        'error'
      )
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[20px] border border-[#e8e3f2] bg-[#fbfaff] p-4">
        <div className="h-20 animate-pulse rounded-[16px] bg-[#f0ecf8]" />
      </div>
    )
  }

  return (
    <div className="rounded-[20px] border border-[#e8e3f2] bg-[#fbfaff] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-[#f1ebff] text-[#7047f5]">
          <i className="fa-solid fa-broom text-[15px]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13.5px] font-black text-[#11152d]">
              Auto Cleanup
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-[8.5px] font-black uppercase tracking-[0.05em] ${
                setting.enabled
                  ? 'bg-[#e8f9ef] text-[#13824d]'
                  : 'bg-[#f0edf5] text-[#777d91]'
              }`}
            >
              {setting.enabled ? 'Active' : 'Off'}
            </span>
          </div>

          <p className="mt-1 text-[11.5px] font-medium leading-5 text-[#7b8194]">
            Move comments marked Keep Hidden to Trash after the selected period.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={setting.enabled}
          disabled={saving}
          onClick={() =>
            saveSetting(
              !setting.enabled,
              setting.retention_days
            )
          }
          className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
            setting.enabled
              ? 'bg-[#7555f6]'
              : 'bg-[#d9d5e1]'
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
              setting.enabled
                ? 'left-6'
                : 'left-1'
            }`}
          />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {OPTIONS.map((option) => {
          const active =
            setting.retention_days ===
            option.value

          return (
            <button
              key={option.value}
              type="button"
              disabled={saving}
              onClick={() =>
                saveSetting(
                  setting.enabled,
                  option.value
                )
              }
              className={`min-h-10 rounded-[13px] border px-2 text-[10.5px] font-extrabold transition active:scale-[0.98] disabled:opacity-50 ${
                active
                  ? 'border-[#7555f6] bg-[#7555f6] text-white'
                  : 'border-[#e6e1ed] bg-white text-[#6e7487]'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="mt-3 rounded-[15px] border border-[#ebe6f3] bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[9.5px] font-black uppercase tracking-[0.05em] text-[#969bad]">
              Last cleanup
            </div>
            <div className="mt-1 truncate text-[10.5px] font-bold text-[#4f556a]">
              {formatDate(
                setting.last_cleanup_at
              )}
            </div>
          </div>

          <div className="shrink-0 rounded-full bg-[#f1ebff] px-2.5 py-1.5 text-[9.5px] font-black text-[#7047f5]">
            {setting.last_cleanup_count} moved
          </div>
        </div>

        {setting.last_cleanup_error ? (
          <p className="mt-2 break-words text-[10px] font-semibold leading-4 text-[#d63e52]">
            {setting.last_cleanup_error}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={runNow}
        disabled={running || saving}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[14px] border border-[#ded5ff] bg-white text-[10.5px] font-extrabold text-[#7047f5] transition active:scale-[0.99] disabled:opacity-50"
      >
        <i
          className={`fa-solid ${
            running
              ? 'fa-spinner animate-spin'
              : 'fa-rotate'
          } text-[10px]`}
        />
        Run Cleanup Now
      </button>

      <p className="mt-3 text-[10.5px] font-medium leading-4 text-[#9499aa]">
        Only Keep Hidden comments are included. They are moved to Trash, not permanently deleted.
      </p>
    </div>
  )
}
