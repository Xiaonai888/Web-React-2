import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  CircleCheck,
  CircleUserRound,
  Clock3,
  FileText,
  ImagePlus,
  LoaderCircle,
  PenLine,
  ShoppingBag,
  WalletCards,
  Wrench,
  X,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const topics = [
  {
    id: 'technical_problem',
    title: 'Technical Problem',
    description: 'App errors, slow loading, images, or notifications.',
    icon: Wrench,
    tone: 'bg-[#f0eaff] text-[#7458e8]',
  },
  {
    id: 'account_profile',
    title: 'Account & Profile',
    description: 'Login, password, profile, or account access.',
    icon: CircleUserRound,
    tone: 'bg-[#e6f8f4] text-[#20a58f]',
  },
  {
    id: 'reading_library',
    title: 'Reading & Library',
    description: 'Stories, episodes, saved posts, or your Library.',
    icon: BookOpen,
    tone: 'bg-[#eaf4ff] text-[#2f86cb]',
  },
  {
    id: 'wallet_payments',
    title: 'Wallet & Payments',
    description: 'Diamonds, purchases, payment, or transaction issues.',
    icon: WalletCards,
    tone: 'bg-[#fff4df] text-[#e29416]',
  },
  {
    id: 'authors_publishing',
    title: 'Authors & Publishing',
    description: 'Author Page, stories, publishing, or earnings.',
    icon: PenLine,
    tone: 'bg-[#fdebf4] text-[#d95c9a]',
  },
  {
    id: 'mall_orders',
    title: 'Shadow Mall & Orders',
    description: 'Products, orders, sellers, or purchased files.',
    icon: ShoppingBag,
    tone: 'bg-[#f1ebff] text-[#7458e8]',
  },
]

const statusStyles = {
  submitted: 'bg-[#f0eaff] text-[#7458e8]',
  in_review: 'bg-[#fff4d9] text-[#b7791f]',
  resolved: 'bg-[#e8f8ef] text-[#178a55]',
  closed: 'bg-[#f1f2f4] text-[#69707d]',
}

const statusLabels = {
  submitted: 'Submitted',
  in_review: 'In Review',
  resolved: 'Resolved',
  closed: 'Closed',
}

function getReaderToken() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatFileSize(value) {
  const bytes = Number(value)
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Stepper({ step }) {
  const steps = [
    { number: 1, label: 'Topic' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Review' },
  ]

  return (
    <div className="px-5 pb-6 pt-6 sm:px-8">
      <div className="relative mx-auto flex max-w-[610px] justify-between">
        <div className="absolute left-[8%] right-[8%] top-[13px] h-[2px] rounded-full bg-[#e8e3f8] dark:bg-white/10" />
        <div
          className="absolute left-[8%] top-[13px] h-[2px] bg-[#7458e8] transition-all duration-300"
          style={{ width: `${Math.max(0, step - 1) * 42}%` }}
        />
        {steps.map((item) => {
          const active = item.number <= step
          const current = item.number === step

          return (
            <div key={item.number} className="relative z-10 flex w-[72px] flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black transition ${
                  active
                    ? 'bg-[#7458e8] text-white shadow-[0_5px_14px_rgba(116,88,232,0.28)]'
                    : 'bg-white text-[#918b9e] shadow-[0_3px_12px_rgba(45,35,82,0.10)] dark:bg-[#1b1d28]'
                }`}
              >
                {item.number < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : item.number}
              </div>
              <span className={`mt-2 text-[11.5px] font-bold ${current ? 'text-[#7458e8]' : 'text-[#777782] dark:text-white/50'}`}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HelpCenterCard({ navigate }) {
  return (
    <section className="mt-4 flex items-center gap-3 rounded-[18px] bg-white p-3.5 dark:bg-[#7458e8]/10 sm:p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eee8ff] text-[#7458e8] dark:bg-white/10 dark:text-[#b9aaf7]">
        <BookOpen className="h-5 w-5" strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-normal text-[#242334] dark:text-white">Check Help Center first</div>
        <p className="mt-0.5 text-[11px] leading-[17px] text-[#7e7a89] dark:text-white/50">
          Find common answers and get help faster.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/help')}
        className="shrink-0 rounded-full bg-[#7458e8] px-3.5 py-2.5 text-[11px] font-normal text-white active:scale-[0.98] sm:px-4"
      >
        Browse Help
      </button>
    </section>
  )
}

function RequestsModal({
  open,
  requests,
  loading,
  error,
  selectedRequest,
  detailLoading,
  detailError,
  onClose,
  onOpenRequest,
  onBackToList,
  onNewRequest,
}) {
  if (!open) return null

  const selectedTopic = selectedRequest
    ? topics.find((item) => item.id === selectedRequest.topic)
    : null
  const SelectedIcon = selectedTopic?.icon || FileText
  const selectedStatus = selectedRequest?.status || 'submitted'

  return (
    <div className="fixed inset-0 z-[100]">
      <button type="button" aria-label="Close requests" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <section className="absolute bottom-0 left-0 right-0 flex h-[88vh] flex-col overflow-hidden rounded-t-[24px] bg-[#f7f7f8] shadow-[0_-12px_40px_rgba(24,20,38,0.16)] dark:bg-[#0d0f16] sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:h-[620px] sm:max-h-[88vh] sm:w-[560px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[22px]">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#d4d2d8] sm:hidden" />
        <header className="flex min-h-[64px] items-center gap-3 bg-white px-4 py-3 dark:bg-[#171923]">
          {selectedRequest ? (
            <button type="button" onClick={onBackToList} aria-label="Back to requests" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f2f5] active:scale-95 dark:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-bold text-[#242330] dark:text-white">
              {selectedRequest ? 'Request Details' : 'My Support Requests'}
            </h2>
            <p className="mt-0.5 text-[10.5px] text-[#918d98] dark:text-white/45">
              {selectedRequest ? selectedRequest.ticket_code : 'Track updates from Shadow support.'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f0f4] active:scale-95 dark:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {selectedRequest ? (
            <div>
              {detailLoading ? (
                <div className="flex min-h-48 items-center justify-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-[#7458e8]" />
                </div>
              ) : (
                <>
                  {detailError ? (
                    <div className="mb-3 rounded-[14px] bg-[#fff1f2] px-4 py-3 text-[11.5px] text-[#b84d52]">{detailError}</div>
                  ) : null}

                  <article className="overflow-hidden rounded-[18px] bg-white dark:bg-[#171923]">
                    <div className="flex items-start gap-3 p-4">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${selectedTopic?.tone || 'bg-[#f0eaff] text-[#7458e8]'}`}>
                        <SelectedIcon className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[13px] font-bold text-[#272635] dark:text-white">{selectedRequest.ticket_code}</div>
                            <div className="mt-0.5 text-[10.5px] text-[#95919d]">Submitted {formatDate(selectedRequest.created_at)}</div>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9.5px] font-semibold ${statusStyles[selectedStatus] || statusStyles.submitted}`}>
                            {statusLabels[selectedStatus] || selectedStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mx-4 h-px bg-[#efedf2] dark:bg-white/10" />

                    <dl className="px-4 py-1">
                      <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                        <dt className="text-[#96929d]">Topic</dt>
                        <dd className="font-medium text-[#34323e] dark:text-white/80">{selectedTopic?.title || selectedRequest.topic}</dd>
                      </div>
                      <div className="h-px bg-[#efedf2] dark:bg-white/10" />
                      <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                        <dt className="text-[#96929d]">Subject</dt>
                        <dd className="font-medium leading-5 text-[#34323e] dark:text-white/80">{selectedRequest.subject}</dd>
                      </div>
                      <div className="h-px bg-[#efedf2] dark:bg-white/10" />
                      <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                        <dt className="text-[#96929d]">Description</dt>
                        <dd className="whitespace-pre-line leading-5 text-[#5f5b69] dark:text-white/60">{selectedRequest.description}</dd>
                      </div>
                      {selectedRequest.screenshot_name ? (
                        <>
                          <div className="h-px bg-[#efedf2] dark:bg-white/10" />
                          <div className="grid grid-cols-[82px_1fr] gap-3 py-3 text-[12px]">
                            <dt className="text-[#96929d]">Screenshot</dt>
                            <dd className="min-w-0">
                              {selectedRequest.screenshot_url ? (
                                <a href={selectedRequest.screenshot_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[12px] bg-[#f4f3f6] dark:bg-white/5">
                                  <img src={selectedRequest.screenshot_url} alt={selectedRequest.screenshot_name} className="max-h-52 w-full object-contain" />
                                </a>
                              ) : null}
                              <div className="mt-1.5 truncate text-[10.5px] text-[#77727f] dark:text-white/45">
                                {selectedRequest.screenshot_name}
                                {selectedRequest.screenshot_size ? ` · ${formatFileSize(selectedRequest.screenshot_size)}` : ''}
                              </div>
                            </dd>
                          </div>
                        </>
                      ) : null}
                    </dl>
                  </article>

                  <section className="mt-3 rounded-[18px] bg-white p-4 dark:bg-[#171923]">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[13px] font-bold text-[#292735] dark:text-white">Shadow Support</h3>
                      {selectedRequest.reviewed_at ? (
                        <span className="text-[9.5px] text-[#9a96a1]">{formatDate(selectedRequest.reviewed_at)}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 whitespace-pre-line text-[12px] leading-5 text-[#686371] dark:text-white/60">
                      {selectedRequest.admin_reply || 'Your request is waiting for a reply from Shadow Support.'}
                    </p>
                  </section>
                </>
              )}
            </div>
          ) : loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <LoaderCircle className="h-6 w-6 animate-spin text-[#7458e8]" />
            </div>
          ) : error ? (
            <div className="rounded-[15px] bg-[#fff1f2] px-4 py-5 text-center text-[12px] text-[#b84d52]">{error}</div>
          ) : requests.length ? (
            <div>
              <div className="space-y-2.5">
                {requests.map((request) => {
                  const topic = topics.find((item) => item.id === request.topic)
                  const Icon = topic?.icon || FileText
                  const status = request.status || 'submitted'

                  return (
                    <button key={request.id} type="button" onClick={() => onOpenRequest(request)} className="flex w-full items-start gap-3 rounded-[16px] bg-white p-4 text-left transition active:scale-[0.995] dark:bg-[#171923]">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${topic?.tone || 'bg-[#f0eaff] text-[#7458e8]'}`}>
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="min-w-0">
                            <span className="block text-[12px] font-bold text-[#292735] dark:text-white">{request.ticket_code}</span>
                            <span className="mt-0.5 block line-clamp-2 text-[12px] leading-5 text-[#4f4b58] dark:text-white/65">{request.subject}</span>
                          </span>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusStyles[status] || statusStyles.submitted}`}>
                            {statusLabels[status] || status}
                          </span>
                        </span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#9995a0] dark:text-white/40">
                          <Clock3 className="h-3 w-3" />
                          {formatDate(request.created_at)}
                        </span>
                      </span>
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[#a09ca6]" strokeWidth={1.8} />
                    </button>
                  )
                })}
              </div>

              <button type="button" onClick={onNewRequest} className="mt-4 h-12 w-full rounded-full bg-[#7458e8] text-[12.5px] font-normal text-white active:scale-[0.99]">
                Send another request
              </button>
            </div>
          ) : (
            <div className="rounded-[16px] bg-white px-5 py-10 text-center dark:bg-[#171923]">
              <FileText className="mx-auto h-7 w-7 text-[#aaa6b0]" />
              <h3 className="mt-3 text-[14px] font-bold">No support requests</h3>
              <p className="mt-1 text-[11.5px] text-[#918d98] dark:text-white/45">Your submitted requests will appear here.</p>
              <button type="button" onClick={onNewRequest} className="mt-5 h-11 rounded-full bg-[#7458e8] px-5 text-[12px] font-normal text-white">
                Send a request
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function FeedbackSupportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileRef = useRef(null)
  const [step, setStep] = useState(1)
  const [topicId, setTopicId] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requestsOpen, setRequestsOpen] = useState(false)
  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestsError, setRequestsError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestDetailLoading, setRequestDetailLoading] = useState(false)
  const [requestDetailError, setRequestDetailError] = useState('')

  const selectedTopic = useMemo(() => topics.find((topic) => topic.id === topicId) || null, [topicId])

  useEffect(() => {
    return () => {
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview)
    }
  }, [screenshotPreview])

  function goBack() {
    if (success) {
      setSuccess(false)
      setStep(1)
      return
    }
    if (step > 1) {
      setStep((current) => current - 1)
      setMessage('')
      return
    }
    navigate(-1)
  }

  function selectTopic(id) {
    setTopicId(id)
    setMessage('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleFile(event) {
    const file = event.target.files?.[0] || null
    setMessage('')

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Screenshot must be 2 MB or smaller.')
      return
    }

    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview)
    setScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  function removeScreenshot() {
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview)
    setScreenshot(null)
    setScreenshotPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function openReview() {
    if (subject.trim().length < 3) {
      setMessage('Please enter a clear subject.')
      return
    }
    if (description.trim().length < 10) {
      setMessage('Please describe the problem in at least 10 characters.')
      return
    }
    setMessage('')
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submitRequest() {
    if (submitting || !selectedTopic) return
    const token = getReaderToken()

    if (!token) {
      navigate('/login', {
        state: {
          returnTo: location.pathname,
        },
      })
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('topic', topicId)
      formData.append('subject', subject.trim())
      formData.append('description', description.trim())
      formData.append('source_url', window.location.href)
      if (screenshot) formData.append('screenshot', screenshot)

      const response = await fetch(`${API_BASE_URL}/api/support/requests`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to submit support request.')
      }

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setMessage(error.message || 'Failed to submit support request.')
    } finally {
      setSubmitting(false)
    }
  }

  async function loadRequests() {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { state: { returnTo: location.pathname } })
      return
    }

    setRequestsOpen(true)
    setSelectedRequest(null)
    setRequestDetailError('')
    setRequestsLoading(true)
    setRequestsError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/support/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load requests.')
      setRequests(Array.isArray(data.requests) ? data.requests : [])
    } catch (error) {
      setRequestsError(error.message || 'Failed to load requests.')
      setRequests([])
    } finally {
      setRequestsLoading(false)
    }
  }

  async function openRequestDetails(request) {
    const token = getReaderToken()
    if (!token) {
      navigate('/login', { state: { returnTo: location.pathname } })
      return
    }

    setSelectedRequest(request)
    setRequestDetailLoading(true)
    setRequestDetailError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/support/requests/${request.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) throw new Error(data.message || 'Failed to load request details.')
      setSelectedRequest(data.request || request)
    } catch (error) {
      setRequestDetailError(error.message || 'Failed to load request details.')
    } finally {
      setRequestDetailLoading(false)
    }
  }

  function closeRequests() {
    setRequestsOpen(false)
    setSelectedRequest(null)
    setRequestDetailError('')
  }

  function backToRequestList() {
    setSelectedRequest(null)
    setRequestDetailError('')
  }

  function resetForm() {
    removeScreenshot()
    setTopicId('')
    setSubject('')
    setDescription('')
    setMessage('')
    setSuccess(false)
    setStep(1)
    closeRequests()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f8f7fb] px-4 py-8 dark:bg-[#0d0f16]">
        <section className="mx-auto max-w-[520px] rounded-[22px] bg-white p-6 text-center shadow-[0_14px_38px_rgba(40,28,78,0.10)] dark:bg-[#171923]">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f8ef] text-[#178a55]">
            <CircleCheck className="h-8 w-8" strokeWidth={1.9} />
          </span>
          <h1 className="mt-5 text-[22px] font-black text-[#20202e] dark:text-white">Request submitted</h1>
          <p className="mx-auto mt-2 max-w-[390px] text-[13px] leading-6 text-[#797684] dark:text-white/55">
            Your support request was received. You can check its status from My Support Requests.
          </p>
          <button
            type="button"
            onClick={loadRequests}
            className="mt-6 h-12 w-full rounded-full bg-[#7458e8] text-[13px] font-normal text-white active:scale-[0.99]"
          >
            View My Requests
          </button>
          <button type="button" onClick={resetForm} className="mt-3 h-11 text-[12.5px] font-normal text-[#7458e8]">
            Send another request
          </button>
        </section>

        <RequestsModal
          open={requestsOpen}
          requests={requests}
          loading={requestsLoading}
          error={requestsError}
          selectedRequest={selectedRequest}
          detailLoading={requestDetailLoading}
          detailError={requestDetailError}
          onClose={closeRequests}
          onOpenRequest={openRequestDetails}
          onBackToList={backToRequestList}
          onNewRequest={resetForm}
        />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-8 text-[#20202e] dark:bg-[#0d0f16] dark:text-white">
      <header className="sticky top-0 z-40 bg-white/95 shadow-[0_3px_16px_rgba(40,31,70,0.06)] backdrop-blur dark:bg-[#171923]/95">
        <div className="relative mx-auto flex h-12 max-w-[760px] items-center justify-center px-4">
          <button type="button" onClick={goBack} aria-label="Back" className="absolute left-4 flex h-10 w-10 items-center justify-start active:scale-95">
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <h1 className="text-[16px] font-bold tracking-[-0.02em]">Contact Support</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[760px]">
        <Stepper step={step} />

        <div className="px-4 sm:px-5">
          {step === 1 ? (
            <section className="rounded-[20px] bg-transparent p-4 dark:bg-transparent sm:p-6">
              <h2 className="text-[17px] font-bold tracking-[-0.02em] sm:text-[18px]">Choose a topic</h2>
              <p className="mt-1 text-[12.5px] text-[#85818d] dark:text-white/50">We’ll help route your request.</p>

              <div className="mt-5 overflow-hidden rounded-[15px] bg-white dark:bg-[#171923]">
                {topics.map((topic, index) => {
                  const Icon = topic.icon
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => selectTopic(topic.id)}
                      className="group relative flex w-full items-center gap-3 bg-white px-3 py-3 text-left transition-colors active:bg-[#f7f7f8] dark:bg-[#171923] dark:active:bg-white/5 sm:px-4"
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${topic.tone}`}>
                        <Icon className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-normal text-[#272635] dark:text-white">{topic.title}</span>
                        <span className="mt-0.5 hidden text-[11px] leading-4 text-[#8d8995] dark:text-white/45 sm:block">{topic.description}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#99969f] transition group-hover:translate-x-0.5 group-hover:text-[#7458e8]" strokeWidth={1.8} />
                      {index < topics.length - 1 ? (
                        <span className="pointer-events-none absolute bottom-0 left-4 right-4 h-px bg-[#f1f1f1] dark:bg-white/10" />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="rounded-[20px] bg-transparent p-4 dark:bg-transparent sm:p-6">
              <div className="flex items-center gap-3">
                {selectedTopic ? (
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] ${selectedTopic.tone}`}>
                    <selectedTopic.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                ) : null}
                <div>
                  <h2 className="text-[17px] font-bold tracking-[-0.02em]">Tell us more</h2>
                  <p className="mt-0.5 text-[11.5px] text-[#85818d] dark:text-white/50">{selectedTopic?.title}</p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-[12px] font-black text-[#3b3948] dark:text-white/75">Subject</span>
                  <input
                    value={subject}
                    maxLength={140}
                    onChange={(event) => {
                      setSubject(event.target.value)
                      setMessage('')
                    }}
                    placeholder="Short summary of the problem"
                    className="mt-2 h-12 w-full rounded-[14px] bg-[#f8f7fb] px-3.5 text-[13px] font-medium shadow-[inset_0_0_0_1px_rgba(116,88,232,0.08)] outline-none transition placeholder:text-[#aaa7b0] focus:bg-white focus:ring-4 focus:ring-[#7458e8]/10 dark:bg-white/5"
                  />
                </label>

                <label className="block">
                  <span className="text-[12px] font-black text-[#3b3948] dark:text-white/75">Description</span>
                  <textarea
                    value={description}
                    maxLength={3000}
                    onChange={(event) => {
                      setDescription(event.target.value)
                      setMessage('')
                    }}
                    placeholder="Describe what happened and what you expected..."
                    className="mt-2 min-h-[150px] w-full resize-none rounded-[14px] bg-[#f8f7fb] px-3.5 py-3 text-[13px] font-medium leading-6 shadow-[inset_0_0_0_1px_rgba(116,88,232,0.08)] outline-none transition placeholder:text-[#aaa7b0] focus:bg-white focus:ring-4 focus:ring-[#7458e8]/10 dark:bg-white/5"
                  />
                  <span className="mt-1 block text-right text-[10px] font-semibold text-[#9d99a3]">{description.length}/3000</span>
                </label>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-[#3b3948] dark:text-white/75">Screenshot</span>
                    <span className="text-[10.5px] font-semibold text-[#9a97a1]">Optional · Max 2 MB</span>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  {screenshotPreview ? (
                    <div className="relative mt-2 overflow-hidden rounded-[14px] bg-[#f7f5fb] p-2 shadow-[0_5px_16px_rgba(56,42,98,0.08)] dark:bg-white/5">
                      <img src={screenshotPreview} alt="Screenshot preview" className="max-h-52 w-full rounded-[10px] object-contain" />
                      <button type="button" onClick={removeScreenshot} aria-label="Remove screenshot" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white active:scale-95">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 flex h-24 w-full items-center justify-center gap-2 rounded-[14px] bg-[#f7f3ff] text-[12px] font-normal text-[#7458e8] shadow-[inset_0_0_0_1px_rgba(116,88,232,0.10)] active:scale-[0.995] dark:bg-[#7458e8]/10">
                      <ImagePlus className="h-5 w-5" strokeWidth={1.9} />
                      Add Screenshot
                    </button>
                  )}
                </div>
              </div>

              {message ? <div className="mt-4 rounded-[13px] bg-[#fff1f2] px-3.5 py-3 text-[11.5px] font-bold text-[#bb4d52] shadow-[0_5px_15px_rgba(187,77,82,0.08)]">{message}</div> : null}

              <button type="button" onClick={openReview} className="mt-5 h-12 w-full rounded-[14px] bg-[#7458e8] text-[13px] font-normal text-white active:scale-[0.99]">
                Continue to Review
              </button>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="rounded-[20px] bg-white p-4 shadow-[0_12px_32px_rgba(48,35,90,0.085)] dark:bg-[#171923] sm:p-6">
              <h2 className="text-[18px] font-bold tracking-[-0.02em]">Review your request</h2>
              <p className="mt-1 text-[12px] text-[#85818d] dark:text-white/50">Check the details before submitting.</p>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-3 rounded-[14px] bg-[#faf9fd] px-4 py-3.5 dark:bg-white/5">
                  {selectedTopic ? (
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${selectedTopic.tone}`}>
                      <selectedTopic.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                    </span>
                  ) : null}
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.06em] text-[#9a96a1]">Topic</div>
                    <div className="mt-0.5 text-[13px] font-bold">{selectedTopic?.title}</div>
                  </div>
                </div>
                <div className="rounded-[14px] bg-[#faf9fd] px-4 py-3.5 dark:bg-white/5">
                  <div className="text-[10px] font-black uppercase tracking-[0.06em] text-[#9a96a1]">Subject</div>
                  <div className="mt-1 text-[13px] font-bold leading-5">{subject.trim()}</div>
                </div>
                <div className="rounded-[14px] bg-[#faf9fd] px-4 py-3.5 dark:bg-white/5">
                  <div className="text-[10px] font-black uppercase tracking-[0.06em] text-[#9a96a1]">Description</div>
                  <p className="mt-1 whitespace-pre-line text-[12.5px] leading-6 text-[#5f5b69] dark:text-white/65">{description.trim()}</p>
                  {screenshotPreview ? <img src={screenshotPreview} alt="Attached screenshot" className="mt-3 max-h-56 w-full rounded-[12px] object-contain shadow-[0_5px_16px_rgba(56,42,98,0.08)]" /> : null}
                </div>
              </div>

              <div className="mt-4 rounded-[14px] bg-[#f7f5fc] px-4 py-3 text-[11px] leading-5 text-[#706b7c] dark:bg-white/5 dark:text-white/50">
                Your request and attachment are private and visible only to Shadow support administrators.
              </div>

              {message ? <div className="mt-4 rounded-[13px] bg-[#fff1f2] px-3.5 py-3 text-[11.5px] font-bold text-[#bb4d52] shadow-[0_5px_15px_rgba(187,77,82,0.08)]">{message}</div> : null}

              <div className="mt-5 grid grid-cols-[0.8fr_1.2fr] gap-2.5">
                <button type="button" onClick={() => setStep(2)} className="h-12 rounded-[14px] bg-[#f2eff8] text-[12.5px] font-normal text-[#5c5865] active:scale-[0.99] dark:bg-white/5 dark:text-white/70">
                  Edit
                </button>
                <button type="button" onClick={submitRequest} disabled={submitting} className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#7458e8] text-[12.5px] font-normal text-white active:scale-[0.99] disabled:opacity-60">
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </section>
          ) : null}

          <HelpCenterCard navigate={navigate} />

          <button type="button" onClick={loadRequests} className="mx-auto mt-4 flex h-11 items-center justify-center gap-2 rounded-[14px] px-4 text-[12.5px] font-normal text-[#7458e8] active:bg-[#f2edff] dark:active:bg-white/5">
            View my support requests
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <RequestsModal
        open={requestsOpen}
        requests={requests}
        loading={requestsLoading}
        error={requestsError}
        selectedRequest={selectedRequest}
        detailLoading={requestDetailLoading}
        detailError={requestDetailError}
        onClose={closeRequests}
        onOpenRequest={openRequestDetails}
        onBackToList={backToRequestList}
        onNewRequest={resetForm}
      />
    </main>
  )
}
