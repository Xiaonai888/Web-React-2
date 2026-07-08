import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REPORT_REASONS = [
  { value: 'spam_or_scam', label: 'Spam or scam' },
  { value: 'harassment_or_bullying', label: 'Harassment or bullying' },
  { value: 'hate_speech', label: 'Hate speech' },
  { value: 'violence_or_threat', label: 'Violence or threats' },
  { value: 'sexual_or_inappropriate', label: 'Sexual or inappropriate content' },
  { value: 'copyright_or_stolen_content', label: 'Copyright or stolen content' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'false_information', label: 'False information' },
  { value: 'other', label: 'Other' },
]

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

export default function ReportModal({
  open,
  reportType,
  targetId,
  targetTitle = '',
  onClose,
  onSubmitted,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [reasonCode, setReasonCode] = useState('')
  const [reasonText, setReasonText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    setReasonCode('')
    setReasonText('')
    setSubmitting(false)
    setMessage('')
    setSuccess(false)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async () => {
    if (submitting || success) return

    const token = getReaderToken()

    if (!token) {
      navigate('/login', {
        state: {
          returnTo: `${location.pathname}${location.search}`,
        },
      })
      return
    }

    if (!reasonCode) {
      setMessage('Please select a report reason.')
      return
    }

    if (reasonCode === 'other' && reasonText.trim().length < 5) {
      setMessage('Please explain the report reason.')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_type: reportType,
          target_id: targetId,
          target_url: window.location.href,
          reason_code: reasonCode,
          reason_text: reasonText.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to submit report.')
      }

      setSuccess(true)
      setMessage(data.message || 'Report submitted successfully.')
      onSubmitted?.(data.report)
    } catch (error) {
      setMessage(error.message || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/45 px-0 sm:items-center sm:px-4">
      <button
        type="button"
        aria-label="Close report"
        onClick={submitting ? undefined : onClose}
        className="absolute inset-0"
      />

      <section className="relative w-full max-w-[500px] overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]">
        <div className="flex items-start justify-between gap-4 border-b border-[#eef1f5] px-5 pb-4 pt-5">
          <div className="min-w-0">
            <h2 className="text-[19px] font-extrabold text-[#111827]">Report content</h2>
            <p className="mt-1 line-clamp-1 text-[12px] font-medium text-[#98a2b3]">
              {targetTitle || 'Help us review this content'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#667085] active:scale-95 disabled:opacity-50"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        {success ? (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eafaf1] text-[#0f9f62]">
              <i className="fa-solid fa-check text-[24px]" />
            </div>

            <h3 className="mt-4 text-[18px] font-extrabold text-[#111827]">Report received</h3>
            <p className="mx-auto mt-2 max-w-[360px] text-[13px] font-medium leading-6 text-[#667085]">
              {message}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-12 w-full rounded-full bg-[#111827] text-[14px] font-extrabold text-white active:scale-[0.99]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="max-h-[62vh] overflow-y-auto px-5 py-5">
              <p className="text-[13px] font-bold text-[#344054]">Why are you reporting this?</p>

              <div className="mt-3 space-y-2">
                {REPORT_REASONS.map((reason) => {
                  const selected = reasonCode === reason.value

                  return (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => {
                        setReasonCode(reason.value)
                        setMessage('')
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left transition ${
                        selected
                          ? 'border-[#7c5cff] bg-[#f5f1ff]'
                          : 'border-[#e4e7ec] bg-white active:bg-[#f8fafc]'
                      }`}
                    >
                      <span className={`text-[13px] font-bold ${selected ? 'text-[#5b3fd6]' : 'text-[#344054]'}`}>
                        {reason.label}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-[#7c5cff] bg-[#7c5cff] text-white'
                            : 'border-[#d0d5dd] text-transparent'
                        }`}
                      >
                        <i className="fa-solid fa-check text-[9px]" />
                      </span>
                    </button>
                  )
                })}
              </div>

              {reasonCode === 'other' ? (
                <div className="mt-4">
                  <label className="text-[12px] font-bold text-[#344054]">Report details</label>
                  <textarea
                    value={reasonText}
                    onChange={(event) => {
                      setReasonText(event.target.value.slice(0, 1000))
                      setMessage('')
                    }}
                    placeholder="Tell us what happened..."
                    className="mt-2 min-h-[110px] w-full resize-none rounded-[16px] border border-[#dfe3ea] bg-[#f8fafc] px-4 py-3 text-[13px] font-medium leading-6 text-[#111827] outline-none focus:border-[#7c5cff] focus:bg-white"
                  />
                  <div className="mt-1 text-right text-[10px] font-semibold text-[#98a2b3]">
                    {reasonText.length}/1000
                  </div>
                </div>
              ) : null}

              {message ? (
                <div className="mt-4 rounded-[14px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#c9363e]">
                  {message}
                </div>
              ) : null}
            </div>

            <div className="border-t border-[#eef1f5] px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !reasonCode || !targetId}
                className="h-12 w-full rounded-full bg-[#111827] text-[14px] font-extrabold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
