import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const HELP_GROUPS = [
  {
    id: 'self_harm',
    label: 'Suicide or self-injury',
    icon: 'fa-solid fa-heart-pulse',
    reasonCode: 'violence_or_threat',
    description: 'The Page may show signs of suicide, self-harm, or immediate danger.',
    details: [
      'Talking about suicide or wanting to die',
      'Showing or encouraging self-injury',
      'Immediate danger or serious threat',
    ],
  },
  {
    id: 'harassment',
    label: 'Harassment',
    icon: 'fa-solid fa-user-shield',
    reasonCode: 'harassment_or_bullying',
    description: 'The Page may be bullying, threatening, or repeatedly targeting someone.',
    details: [
      'Bullying or repeated harassment',
      'Threatening another person',
      'Sharing private information to harm someone',
    ],
  },
  {
    id: 'hacked',
    label: 'Hacked',
    icon: 'fa-solid fa-user-lock',
    reasonCode: 'other',
    description: 'The Page may have been taken over or changed without the owner’s permission.',
    details: [
      'The Page appears to be hacked',
      'The Page identity or information suddenly changed',
      'Someone may have taken control of the Page',
    ],
  },
  {
    id: 'impersonation',
    label: 'Pretending to be someone else',
    icon: 'fa-solid fa-user-secret',
    reasonCode: 'impersonation',
    description: 'The Page may be impersonating another person, author, or organization.',
    details: [
      'Pretending to be another author',
      'Using another person’s identity',
      'Pretending to be an official Page',
    ],
  },
  {
    id: 'scam',
    label: 'Scam or fraud',
    icon: 'fa-solid fa-link',
    reasonCode: 'spam_or_scam',
    description: 'The Page may be using misleading offers, suspicious links, or fraud.',
    details: [
      'Suspicious link or payment request',
      'Fake promotion, prize, or offer',
      'Fraud or misleading business activity',
    ],
  },
  {
    id: 'hate',
    label: 'Hate or abusive content',
    icon: 'fa-solid fa-ban',
    reasonCode: 'hate_speech',
    description: 'The Page may contain hateful or discriminatory attacks.',
    details: [
      'Hate speech or discrimination',
      'Abusive attacks based on identity',
      'Content encouraging hatred toward a group',
    ],
  },
]

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function PageHeader({ title, onBack }) {
  return (
    <header className="relative z-20 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex min-h-[66px] w-full max-w-[720px] items-center px-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[#111827] active:bg-[#f3f4f6]"
          aria-label="Back"
        >
          <i className="fa-solid fa-chevron-left text-[20px]" />
        </button>
        <div className="min-w-0 flex-1 px-1">
          <h1 className="truncate text-[17px] font-bold text-[#111827]">{title}</h1>
        </div>
      </div>
    </header>
  )
}

function SheetHeader({ title }) {
  return (
    <>
      <div className="mx-auto h-1.5 w-11 rounded-full bg-[#9ca3af]" />
      <div className="relative mt-1 flex h-12 items-center justify-center px-14">
        <h2 className="truncate text-[18px] font-bold text-[#111827]">{title}</h2>
      </div>
    </>
  )
}

export default function AuthorPageHelpPage() {
  const navigate = useNavigate()
  const { pageUsername } = useParams()
  const [dragY, setDragY] = useState(0)
  const dragStartYRef = useRef(null)
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [step, setStep] = useState('reason')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedDetail, setSelectedDetail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [blocked, setBlocked] = useState(false)
  const [blocking, setBlocking] = useState(false)

  const pageName = page?.page_name || page?.name || 'Author Page'
  const pageId = page?.id || ''
  const selectedGroup = useMemo(
    () => HELP_GROUPS.find((item) => item.id === selectedGroupId) || null,
    [selectedGroupId]
  )

  useEffect(() => {
    if (!pageUsername) {
      setError('Author Page not found')
      setLoading(false)
      return undefined
    }

    let ignore = false
    const controller = new AbortController()

    async function loadPage() {
      try {
        setLoading(true)
        setError('')
        const token = getAuthToken()
        const response = await fetch(
          `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          }
        )
        const data = await response.json().catch(() => ({}))

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || 'Author Page not found')
        }

        if (!ignore) {
          setPage(data.author_page || data.author || data.page || null)
        }
      } catch (loadError) {
        if (!ignore && loadError?.name !== 'AbortError') {
          setError(loadError.message || 'Failed to load Author Page')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadPage()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [pageUsername])

  function chooseGroup(groupId) {
    setSelectedGroupId(groupId)
    setSelectedDetail('')
    setStep('detail')
  }

  function chooseDetail(detail) {
    setSelectedDetail(detail)
    setStep('review')
  }

  function goBack() {
    if (step === 'detail') {
      setStep('reason')
      setSelectedGroupId('')
      return
    }

    if (step === 'review') {
      setStep('detail')
      setSelectedDetail('')
      return
    }

    navigate(-1)
  }

  async function submitReport() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', {
        state: { returnTo: `/author/page/${pageUsername}/help` },
      })
      return
    }

    if (!pageId || !selectedGroup || !selectedDetail || submitting) return

    try {
      setSubmitting(true)
      setSubmitMessage('')

      const reasonText = `${selectedGroup.label}: ${selectedDetail}`
      const response = await fetch(`${API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_type: 'author_page',
          target_id: pageId,
          target_url: `${window.location.origin}/author/page/${pageUsername}`,
          reason_code: selectedGroup.reasonCode,
          reason_text: reasonText,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 409 && data.code === 'REPORT_ALREADY_OPEN') {
        setSubmitMessage(data.message || 'You already submitted a report for this Page.')
        setStep('success')
        return
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to submit report')
      }

      setSubmitMessage(data.message || 'Your report was submitted to Shadow for review.')
      setStep('success')
    } catch (submitError) {
      setSubmitMessage(submitError.message || 'Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  async function blockPage() {
    const token = getAuthToken()

    if (!token) {
      navigate('/login', {
        state: { returnTo: `/author/page/${pageUsername}/help` },
      })
      return
    }

    if (blocking || blocked) return

    try {
      setBlocking(true)
      const response = await fetch(
        `${API_BASE_URL}/api/authors/page/${encodeURIComponent(pageUsername)}/block`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to block Author Page')
      }

      setBlocked(true)
    } catch (blockError) {
      setSubmitMessage(blockError.message || 'Failed to block Author Page')
    } finally {
      setBlocking(false)
    }
  }

  function closeHelpSheet() {
  navigate(-1)
}

function handleDragStart(event) {
  dragStartYRef.current = event.clientY
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function handleDragMove(event) {
  if (dragStartYRef.current === null) return
  setDragY(Math.max(0, event.clientY - dragStartYRef.current))
}

function handleDragEnd(event) {
  if (dragStartYRef.current === null) return

  const distance = Math.max(0, event.clientY - dragStartYRef.current)
  dragStartYRef.current = null

  if (distance >= 70) {
    closeHelpSheet()
    return
  }

  setDragY(0)
}

  const headerTitle = step === 'review' ? 'Review report' : 'Help Page'
  const headerBack =
    step === 'success'
      ? () => navigate(`/author/page/${pageUsername}`)
      : goBack

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={loading ? 'Loading...' : pageName} onBack={headerBack} />

      <div
  className="fixed inset-0 z-30 bg-black/40"
  onClick={closeHelpSheet}
>
  <section
    className="absolute bottom-0 left-0 right-0 top-[66px] mx-auto w-full max-w-[720px] overflow-y-auto rounded-t-[20px] bg-[#f0f2f5] px-4 pb-6"
    style={{
      transform: `translateY(${dragY}px)`,
      transition: dragStartYRef.current === null ? 'transform 180ms ease-out' : 'none',
    }}
    onClick={(event) => event.stopPropagation()}
  >
    <div
      className="touch-none select-none pt-3"
      style={{ touchAction: 'none' }}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
    >
      <SheetHeader title={headerTitle} />
    </div>

    <main>
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#111827]" />
          </div>
        ) : error ? (
          <div className="px-4 py-16 text-center">
            <i className="fa-solid fa-circle-exclamation text-[30px] text-[#9ca3af]" />
            <p className="mt-3 text-[14px] font-normal text-[#4b5563]">{error}</p>
          </div>
        ) : step === 'reason' ? (
          <div className="pt-5">
            <h2 className="text-[22px] font-bold leading-7 text-[#111827]">
              Why do you think {pageName} needs support?
            </h2>
            <p className="mt-2 text-[14px] font-normal leading-5 text-[#6b7280]">
              {pageName} won&apos;t be notified about this. Choose the option that best describes what is happening.
            </p>

            <div className="mt-5 overflow-hidden rounded-[14px] bg-white">
              {HELP_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => chooseGroup(group.id)}
                  className="flex min-h-[64px] w-full items-center gap-3 px-4 text-left active:bg-[#f3f4f6]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
                    <i className={`${group.icon} text-[18px]`} />
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-normal text-[#111827]">
                    {group.label}
                  </span>
                  <i className="fa-solid fa-chevron-right text-[15px] text-[#6b7280]" />
                </button>
              ))}
            </div>
          </div>
        ) : step === 'detail' ? (
          <div className="pt-5">
            <h2 className="text-[22px] font-bold leading-7 text-[#111827]">
              {selectedGroup?.label}
            </h2>
            <p className="mt-2 text-[14px] font-normal leading-5 text-[#6b7280]">
              {selectedGroup?.description}
            </p>

            <div className="mt-5 overflow-hidden rounded-[14px] bg-white">
              {(selectedGroup?.details || []).map((detail) => (
                <button
                  key={detail}
                  type="button"
                  onClick={() => chooseDetail(detail)}
                  className="flex min-h-[66px] w-full items-center gap-3 px-4 text-left active:bg-[#f3f4f6]"
                >
                  <span className="min-w-0 flex-1 text-[15px] font-normal leading-5 text-[#111827]">
                    {detail}
                  </span>
                  <i className="fa-solid fa-chevron-right text-[15px] text-[#6b7280]" />
                </button>
              ))}
            </div>
          </div>
        ) : step === 'review' ? (
          <div className="pt-5">
            <div className="rounded-[16px] bg-white px-4 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef0f3] text-[#111827]">
                  <i className={`${selectedGroup?.icon || 'fa-regular fa-flag'} text-[18px]`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[16px] font-bold text-[#111827]">{pageName}</div>
                  <div className="mt-0.5 text-[12px] font-normal text-[#6b7280]">Author Page</div>
                </div>
              </div>

              <div className="mt-5 rounded-[12px] bg-[#f5f6f8] px-4 py-4">
                <div className="text-[13px] font-bold text-[#111827]">{selectedGroup?.label}</div>
                <div className="mt-1 text-[13px] font-normal leading-5 text-[#6b7280]">
                  {selectedDetail}
                </div>
              </div>
            </div>

            {submitMessage ? (
              <div className="mt-4 rounded-[12px] bg-[#fff7d6] px-4 py-3 text-[13px] font-normal leading-5 text-[#111827]">
                {submitMessage}
              </div>
            ) : null}

            <p className="mt-4 text-[12px] font-normal leading-5 text-[#6b7280]">
              Your report will be sent to Shadow Admin for review. The Author Page won&apos;t be told who submitted it.
            </p>

            <button
              type="button"
              onClick={submitReport}
              disabled={submitting}
              className="mt-5 h-12 w-full rounded-[12px] bg-[#111827] text-[15px] font-bold text-white disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit report'}
            </button>
          </div>
        ) : (
          <div className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2e9d4d] text-white">
                <i className="fa-solid fa-check text-[24px]" />
              </div>
              <h2 className="mt-5 text-[22px] font-bold text-[#111827]">Thanks for letting us know</h2>
              <p className="mx-auto mt-2 max-w-[430px] text-[14px] font-normal leading-6 text-[#6b7280]">
                {submitMessage || 'Your report was submitted to Shadow for review.'}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-[18px] font-bold text-[#111827]">Other steps you can take</h3>

              <button
                type="button"
                onClick={blockPage}
                disabled={blocking || blocked}
                className="mt-3 flex min-h-[66px] w-full items-center gap-3 rounded-[12px] bg-white px-4 text-left disabled:opacity-60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
                  <i className="fa-solid fa-user-slash text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[#111827]">
                    {blocked ? `${pageName} blocked` : `Block ${pageName}`}
                  </span>
                  <span className="mt-0.5 block text-[12px] font-normal text-[#6b7280]">
                    You won&apos;t be able to see or contact each other.
                  </span>
                </span>
              </button>

              <div className="mt-2 flex min-h-[66px] items-center gap-3 rounded-[12px] bg-white px-4 opacity-60">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
                  <i className="fa-solid fa-check text-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-[#111827]">
                    Submitted to Shadow for Review
                  </span>
                  <span className="mt-0.5 block text-[12px] font-normal text-[#6b7280]">
                    Your report has been sent to Admin.
                  </span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/author/page/${pageUsername}`)}
              className="mt-8 h-12 w-full rounded-[12px] bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#a855f7] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(139,92,246,0.28)]"
            >
              Done
            </button>
          </div>
        )}
      </main>
    </section>
  </div>
</div>
  )
}
