import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const REPORT_CONFIG = {
  story: {
    title: 'Report this story',
    typeLabel: 'Story',
    subtitle: 'Choose the reason that best describes the problem with this story.',
    options: [
      {
        value: 'sexual_or_inappropriate',
        label: 'Sexual or inappropriate content',
        description: 'Explicit sexual content or mature content without a warning.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'violence_or_threat',
        label: 'Graphic violence or threats',
        description: 'Extreme violence, threats, self-harm, or dangerous content.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        value: 'hate_speech',
        label: 'Hate or abusive content',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'copyright_or_stolen_content',
        label: 'Copyright or stolen story',
        description: 'Copied story, translation, cover, or other protected work.',
        icon: 'fa-regular fa-copyright',
      },
      {
        value: 'spam_or_scam',
        label: 'Spam or scam',
        description: 'Misleading promotion, suspicious links, or fraudulent content.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'other',
        label: 'Something else',
        description: 'A different problem that is not listed above.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },

  comment: {
    title: 'Report this comment',
    typeLabel: 'Comment',
    subtitle: 'Tell us what is wrong with this comment.',
    options: [
      {
        value: 'harassment_or_bullying',
        label: 'Harassment or bullying',
        description: 'Targeted insults, humiliation, intimidation, or repeated abuse.',
        icon: 'fa-solid fa-user-shield',
      },
      {
        value: 'hate_speech',
        label: 'Hate speech or discrimination',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'violence_or_threat',
        label: 'Threats or encouraging harm',
        description: 'Threats, encouragement of violence, self-harm, or suicide.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        value: 'sexual_or_inappropriate',
        label: 'Sexual or inappropriate comment',
        description: 'Sexual harassment, explicit language, or inappropriate content.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'spam_or_scam',
        label: 'Spam, scam, or suspicious link',
        description: 'Repeated promotion, fraud, or a potentially unsafe link.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'false_information',
        label: 'False or dangerous information',
        description: 'Misleading claims that may confuse or harm other readers.',
        icon: 'fa-solid fa-circle-exclamation',
      },
      {
        value: 'other',
        label: 'Private information or something else',
        description: 'Personal information or another issue. Please explain below.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },

  author_page: {
    title: 'Report this Author Page',
    typeLabel: 'Author Page',
    subtitle: 'Choose the reason that best describes the problem with this page.',
    options: [
      {
        value: 'impersonation',
        label: 'Pretending to be someone else',
        description: 'Fake author identity, fake official page, or impersonation.',
        icon: 'fa-solid fa-user-secret',
      },
      {
        value: 'spam_or_scam',
        label: 'Scam or fraudulent page',
        description: 'Fraud, suspicious offers, unsafe links, or misleading promotions.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'sexual_or_inappropriate',
        label: 'Inappropriate profile or biography',
        description: 'Sexual, explicit, or otherwise inappropriate profile content.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'harassment_or_bullying',
        label: 'Harassment or bullying',
        description: 'This page targets, intimidates, or repeatedly attacks someone.',
        icon: 'fa-solid fa-user-shield',
      },
      {
        value: 'hate_speech',
        label: 'Hate speech or discrimination',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'copyright_or_stolen_content',
        label: 'Stolen name, logo, or profile image',
        description: 'Uses another person’s identity or protected work without permission.',
        icon: 'fa-regular fa-copyright',
      },
      {
        value: 'false_information',
        label: 'Misleading or false page',
        description: 'The page name, identity, description, or claims are misleading.',
        icon: 'fa-solid fa-circle-exclamation',
      },
      {
        value: 'other',
        label: 'Something else',
        description: 'A different problem that is not listed above.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },

  author_post: {
    title: 'Report this Author Post',
    typeLabel: 'Author Post',
    subtitle: 'Choose the reason that best describes the problem with this post.',
    options: [
      {
        value: 'spam_or_scam',
        label: 'Spam, scam, or suspicious link',
        description: 'Repeated promotion, fraud, or a potentially unsafe link.',
        icon: 'fa-solid fa-link',
      },
      {
        value: 'harassment_or_bullying',
        label: 'Harassment or bullying',
        description: 'Targeted insults, humiliation, intimidation, or repeated abuse.',
        icon: 'fa-solid fa-user-shield',
      },
      {
        value: 'hate_speech',
        label: 'Hate speech or discrimination',
        description: 'Attacks based on identity, religion, nationality, gender, or race.',
        icon: 'fa-solid fa-ban',
      },
      {
        value: 'sexual_or_inappropriate',
        label: 'Sexual or inappropriate content',
        description: 'Explicit text, images, sexual harassment, or inappropriate content.',
        icon: 'fa-solid fa-venus-mars',
      },
      {
        value: 'violence_or_threat',
        label: 'Violence, threats, or self-harm',
        description: 'Graphic violence, threats, dangerous acts, or encouragement of harm.',
        icon: 'fa-solid fa-triangle-exclamation',
      },
      {
        value: 'false_information',
        label: 'False or dangerous information',
        description: 'Misleading information that may confuse or harm other readers.',
        icon: 'fa-solid fa-circle-exclamation',
      },
      {
        value: 'copyright_or_stolen_content',
        label: 'Copyright or stolen content',
        description: 'Copied text, images, artwork, or other protected content.',
        icon: 'fa-regular fa-copyright',
      },
      {
        value: 'impersonation',
        label: 'Impersonation',
        description: 'The post falsely represents another person, author, or organization.',
        icon: 'fa-solid fa-user-secret',
      },
      {
        value: 'other',
        label: 'Private information or something else',
        description: 'Personal information or another issue. Please explain below.',
        icon: 'fa-solid fa-ellipsis',
      },
    ],
  },
}

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '').trim()
  )
}

export default function ReportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { reportType = '', targetId = '' } = useParams()

  const config = REPORT_CONFIG[reportType] || null
  const targetTitle = String(location.state?.targetTitle || '').trim()
  const sourceUrl = String(
    location.state?.sourceUrl ||
      document.referrer ||
      `${window.location.origin}/`
  ).trim()
  const returnTo = String(location.state?.returnTo || '').trim()

  const [reasonCode, setReasonCode] = useState(
    String(location.state?.draftReasonCode || '')
  )
  const [reasonText, setReasonText] = useState(
    String(location.state?.draftReasonText || '')
  )
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  

  const handleBack = () => {
    if (returnTo) {
      navigate(returnTo, { replace: true })
      return
    }

    navigate(-1)
  }

  const handleLogin = () => {
    navigate('/login', {
      state: {
        returnTo: `${location.pathname}${location.search}`,
        returnState: {
          ...location.state,
          draftReasonCode: reasonCode,
          draftReasonText: reasonText,
        },
      },
    })
  }

  const handleSubmit = async () => {
    if (!config || !isUuid(targetId) || submitting || success) return

    const token = getReaderToken()

    if (!token) {
      handleLogin()
      return
    }

    if (!reasonCode) {
      setMessage('Please select a report reason.')
      return
    }

    if (reasonCode === 'other' && reasonText.trim().length < 5) {
      setMessage('Please explain the problem in at least 5 characters.')
      return
    }

    if (reasonText.trim().length > 1000) {
      setMessage('Report details cannot exceed 1,000 characters.')
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
          target_url: sourceUrl,
          reason_code: reasonCode,
          reason_text: reasonText.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (
        response.status === 409 &&
        data.code === 'REPORT_ALREADY_OPEN'
      ) {
        setSuccess(true)
        setMessage(
          data.message ||
            'You already reported this content. Our team will review it.'
        )
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to submit report.')
      }

      setSuccess(true)
      setMessage(
        data.message ||
          'Report submitted. Thank you for helping keep Shadow safe.'
      )
    } catch (error) {
      setMessage(error.message || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!config || !isUuid(targetId)) {
    return (
      <main className="min-h-screen bg-[#f5f3fa] px-4 py-8">
        <section className="mx-auto max-w-[620px] rounded-[26px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#d9363e]">
            <i className="fa-solid fa-triangle-exclamation text-[20px]" />
          </div>
          <h1 className="mt-4 text-[20px] font-black text-[#111827]">
            Invalid report
          </h1>
          <p className="mt-2 text-[13px] font-medium leading-6 text-[#667085]">
            The report type or reported content ID is invalid.
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-5 h-11 rounded-full bg-[#111827] px-6 text-[13px] font-black text-white"
          >
            Go Back
          </button>
        </section>
      </main>
    )
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f5f3fa] px-4 py-8">
        <section className="mx-auto max-w-[620px] rounded-[28px] bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eafaf1] text-[#0f9f62]">
            <i className="fa-solid fa-check text-[24px]" />
          </div>

          <h1 className="mt-5 text-[22px] font-black text-[#111827]">
            Report received
          </h1>

          <p className="mx-auto mt-2 max-w-[430px] text-[13px] font-medium leading-6 text-[#667085]">
            {message}
          </p>

          <div className="mt-5 rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[12px] font-semibold leading-5 text-[#667085]">
            The author or commenter will not be told who submitted this report.
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="mt-6 h-12 w-full rounded-full bg-[#111827] text-[14px] font-black text-white active:scale-[0.99]"
          >
            Done
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] pb-6 text-[#171a21]">
      <header className="sticky top-0 z-30 border-b border-[#e8e7e3] bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-[58px] max-w-[680px] items-center justify-center px-14">
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-[#242830] transition active:bg-[#f1f1ef]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="truncate text-center text-[17px] font-black text-[#171a21]">
            {config.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[680px] px-4 pt-5">
        <section className="rounded-[18px] border border-[#e4e3df] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(24,28,36,0.045)]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#fff0ef] text-[#c95f5b]">
              <i className="fa-regular fa-flag text-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-black uppercase tracking-[0.65px] text-[#8a8f98]">
                {config.typeLabel}
              </div>

              <h2 className="mt-1 line-clamp-2 text-[15px] font-black leading-6 text-[#171a21]">
                {targetTitle || `Reported ${config.typeLabel}`}
              </h2>

              <p className="mt-1 text-[12px] font-medium leading-5 text-[#767c86]">
                {config.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-start gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff0ef] text-[11px] font-black text-[#c95f5b]">
              1
            </span>

            <div className="min-w-0">
              <h3 className="text-[15.5px] font-black leading-6 text-[#171a21]">
                Why are you reporting this?
              </h3>

              <p className="mt-0.5 text-[11.5px] font-medium leading-5 text-[#858a93]">
                Select one reason. Shadow will review the reported content.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e1e2e4] bg-white shadow-[0_8px_24px_rgba(24,28,36,0.035)]">
            {config.options.map((option, index) => {
              const selected = option.value === reasonCode
              const isLast = index === config.options.length - 1

              return (
                <div
                  key={option.value}
                  className={`px-2 py-1 ${
                    isLast ? '' : 'border-b border-[#ececea]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setReasonCode(option.value)
                      setMessage('')
                    }}
                    className={`group flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition ${
                      selected
                        ? 'bg-[#fff3f2] ring-1 ring-inset ring-[#e6aaa6]'
                        : 'bg-white hover:bg-[#fff9f8]'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                        selected
                          ? 'bg-[#fde8e6] text-[#c95f5b]'
                          : 'bg-[#f3f3f1] text-[#777c84] group-hover:bg-[#fff0ef] group-hover:text-[#c95f5b]'
                      }`}
                    >
                      <i className={`${option.icon} text-[14px]`} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-black leading-5 text-[#171a21]">
                        {option.label}
                      </span>

                      <span className="mt-0.5 block text-[11.5px] font-medium leading-[18px] text-[#7d838d]">
                        {option.description}
                      </span>
                    </span>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                        selected
                          ? 'border-[#c95f5b] bg-white'
                          : 'border-[#c7cbd0] bg-white group-hover:border-[#d8918d]'
                      }`}
                      aria-hidden="true"
                    >
                      {selected ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#c95f5b]" />
                      ) : null}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1f1ef] text-[11px] font-black text-[#5f646d]">
              2
            </span>

            <label
              htmlFor="shadow-report-details"
              className="text-[14.5px] font-black text-[#171a21]"
            >
              Tell us more
              <span className="ml-1 text-[12px] font-semibold text-[#92969d]">
                {reasonCode === 'other' ? '(required)' : '(optional)'}
              </span>
            </label>
          </div>

          <div className="mt-3 rounded-[18px] border border-[#e1e2e4] bg-white p-3 shadow-[0_8px_24px_rgba(24,28,36,0.03)]">
            <textarea
              id="shadow-report-details"
              value={reasonText}
              maxLength={1000}
              onChange={(event) => {
                setReasonText(event.target.value)
                setMessage('')
              }}
              placeholder={
                reasonCode === 'other'
                  ? 'Please explain what happened...'
                  : 'Add any details that may help us review this report...'
              }
              className="min-h-[112px] w-full resize-none rounded-[13px] border border-[#dfe1e4] bg-[#fbfbfa] px-3.5 py-3 text-[13px] font-medium leading-6 text-[#171a21] outline-none transition placeholder:text-[#a0a4ab] focus:border-[#d8918d] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,95,91,0.08)]"
            />

            <div className="mt-1 text-right text-[10.5px] font-semibold text-[#9b9fa6]">
              {reasonText.length}/1000
            </div>
          </div>
        </section>

        {message ? (
          <div className="mt-4 rounded-[14px] border border-[#f1c5c2] bg-[#fff1f0] px-4 py-3 text-[12px] font-bold leading-5 text-[#b84f4b]">
            {message}
          </div>
        ) : null}

        <div className="mt-4 flex items-start gap-3 rounded-[15px] border border-[#f0dfb8] bg-[#fff9e9] px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#fff1c9] text-[#b98225]">
            <i className="fa-solid fa-lock text-[12px]" />
          </span>

          <div className="min-w-0">
            <div className="text-[11.5px] font-black leading-5 text-[#4e4a42]">
              Your report is confidential.
            </div>

            <div className="text-[11px] font-medium leading-5 text-[#817969]">
              The reported person will not see your identity.
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 -mx-4 mt-4 border-t border-[#eceae6] bg-[#faf9f7]/95 px-4 pb-3 pt-3 backdrop-blur">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !reasonCode}
            className="h-12 w-full rounded-[14px] bg-[#c95f5b] text-[14px] font-black text-white shadow-[0_8px_18px_rgba(201,95,91,0.18)] transition hover:bg-[#bb5652] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#c9c9c6] disabled:text-white disabled:shadow-none"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </main>
  )
}

      <header className="sticky top-0 z-30 border-b border-[#eceef2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[58px] max-w-[680px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-[17px] font-black text-[#111827]">
            {config.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[680px] px-4 pt-5">
        <section className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f2edff] text-[#6f4ee8]">
              <i className="fa-regular fa-flag text-[17px]" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-[0.5px] text-[#8d94a1]">
                {config.typeLabel}
              </div>

              <h2 className="mt-1 line-clamp-2 text-[16px] font-black leading-6 text-[#111827]">
                {targetTitle || `Reported ${config.typeLabel}`}
              </h2>

              <p className="mt-1 text-[12.5px] font-medium leading-5 text-[#667085]">
                {config.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="px-1">
            <h3 className="text-[15px] font-black text-[#111827]">
              Why are you reporting this?
            </h3>
            <p className="mt-1 text-[12px] font-medium leading-5 text-[#8d94a1]">
              Select one reason. Shadow will review the reported content.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {config.options.map((option) => {
              const selected = option.value === reasonCode

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setReasonCode(option.value)
                    setMessage('')
                  }}
                  className={`flex w-full items-center gap-3 rounded-[18px] border px-3 py-3.5 text-left transition ${
                    selected
                      ? 'border-[#7c5cff] bg-[#f5f1ff]'
                      : 'border-[#e5e7eb] bg-white active:bg-[#f8fafc]'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      selected
                        ? 'bg-[#7c5cff] text-white'
                        : 'bg-[#f3f4f6] text-[#667085]'
                    }`}
                  >
                    <i className={`${option.icon} text-[14px]`} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[13.5px] font-black ${
                        selected ? 'text-[#5b3fd6]' : 'text-[#111827]'
                      }`}
                    >
                      {option.label}
                    </span>

                    <span className="mt-0.5 block text-[11.5px] font-medium leading-5 text-[#8d94a1]">
                      {option.description}
                    </span>
                  </span>

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? 'border-[#7c5cff] bg-[#7c5cff] text-white'
                        : 'border-[#cfd4dc] bg-white text-transparent'
                    }`}
                  >
                    <i className="fa-solid fa-check text-[9px]" />
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <label
            htmlFor="shadow-report-details"
            className="text-[14px] font-black text-[#111827]"
          >
            Tell us more
            <span className="ml-1 text-[12px] font-semibold text-[#8d94a1]">
              {reasonCode === 'other' ? '(required)' : '(optional)'}
            </span>
          </label>

          <textarea
            id="shadow-report-details"
            value={reasonText}
            maxLength={1000}
            onChange={(event) => {
              setReasonText(event.target.value)
              setMessage('')
            }}
            placeholder={
              reasonCode === 'other'
                ? 'Please explain what happened...'
                : 'Add any details that may help us review this report...'
            }
            className="mt-3 min-h-[120px] w-full resize-none rounded-[18px] border border-[#dfe3ea] bg-[#f8fafc] px-4 py-3 text-[13px] font-medium leading-6 text-[#111827] outline-none placeholder:text-[#98a2b3] focus:border-[#7c5cff] focus:bg-white"
          />

          <div className="mt-1 text-right text-[10.5px] font-semibold text-[#98a2b3]">
            {reasonText.length}/1000
          </div>

          {selectedReason ? (
            <div className="mt-3 rounded-[15px] bg-[#f8fafc] px-3 py-2 text-[11.5px] font-semibold leading-5 text-[#667085]">
              Selected: {selectedReason.label}
            </div>
          ) : null}
        </section>

        {message ? (
          <div className="mt-4 rounded-[16px] bg-[#fff1f1] px-4 py-3 text-[12px] font-bold leading-5 text-[#c9363e]">
            {message}
          </div>
        ) : null}

        <div className="mt-4 rounded-[18px] bg-white px-4 py-3 text-[11.5px] font-semibold leading-5 text-[#667085] ring-1 ring-black/5">
          <i className="fa-solid fa-lock mr-2 text-[#7c5cff]" />
          Your report is confidential. The reported person will not see your
          identity.
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !reasonCode}
          className="mt-5 h-12 w-full rounded-full bg-[#111827] text-[14px] font-black text-white shadow-sm active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </main>
  )
}
