import { useEffect, useMemo, useState } from 'react'

function formatDateTime(value) {
  if (!value) return 'Not synced yet'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Not synced yet'

  return date.toLocaleString()
}

function getStatusStyle(status) {
  if (status === 'connected') {
    return 'bg-[#ecfdf5] text-[#047857] ring-[#a7f3d0]'
  }

  if (status === 'error') {
    return 'bg-[#fff1f2] text-[#be123c] ring-[#fecdd3]'
  }

  return 'bg-[#f3f4f6] text-[#6b7280] ring-[#e5e7eb]'
}

function SalesReportsStatus({ integration }) {
  const status = integration?.connection_status || 'not connected'
  const label = status.replaceAll('_', ' ')

  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-[10px] font-black uppercase tracking-[0.08em] ring-1 ${getStatusStyle(status)}`}
    >
      {label}
    </span>
  )
}

export function SalesReportsSettingsMenuItem({ onOpen }) {
  return (
    <>
      <div className="mx-4 h-px bg-[#eef0f4]" />

      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left active:bg-[#f8fafc]"
      >
        <span className="min-w-0">
          <span className="block text-[14px] font-black text-[#111827]">
            Sales Reports
          </span>
          <span className="mt-0.5 block text-[12px] font-semibold leading-5 text-[#8b93a1]">
            Sync monthly Book and PDF sales to Google Sheets.
          </span>
        </span>

        <i className="fa-solid fa-chevron-right shrink-0 text-[12px] text-[#9ca3af]" />
      </button>
    </>
  )
}


const SALES_REPORTS_HELP_STEPS = [
  {
    number: '1',
    title: 'Create a Google Sheet',
    content:
      'Create a new Google Sheet for receiving your sales reports from Shadow. You may use any spreadsheet name.',
  },
  {
    number: '2',
    title: 'Share the Sheet with Shadow',
    content:
      'Open Share in Google Sheets, enter the Shadow email shown on the Sales Reports page, and set the permission to Editor.',
  },
  {
    number: '3',
    title: 'Copy the Google Sheet Link',
    content:
      'Copy the Google Sheet link and paste it into the Google Sheet link field.',
  },
  {
    number: '4',
    title: 'Connect the Google Sheet',
    content:
      'Tap Connect Google Sheet. Shadow will verify that the link is valid and that it has permission to edit the Sheet.',
  },
  {
    number: '5',
    title: 'Sync Your Reports',
    content:
      'After the connection is successful, tap Sync Now to send your sales data to Google Sheets.',
  },
  {
    number: '6',
    title: 'What Shadow Creates',
    content:
      'Shadow creates one tab for each month, keeps Monthly Summary updated, and updates orders, cancellations, and refunds without duplicate rows.',
  },
  {
    number: '7',
    title: 'Disconnecting Google Sheet',
    content:
      'Disconnecting stops future report syncing. Existing data in your Google Sheet will not be deleted.',
  },
]

function SalesReportsHelpSection({ number, title, children }) {
  return (
    <section className="border-b border-[#eef1f5] px-4 py-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ecfdf3] text-[12px] font-bold text-[#16a34a]">
          {number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-[#111827]">{title}</h2>
          <div className="mt-2 text-[13px] font-normal leading-6 text-[#667085]">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

function SalesReportsHelpPage({ onBack }) {
  return (
    <main className="fixed inset-0 z-[1000] overflow-y-auto bg-[#f7f7f9]">
      <header className="sticky top-0 z-40 border-b border-[#eef1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:opacity-60"
            aria-label="Back to Sales Reports"
          >
            <i className="fa-solid fa-chevron-left text-[17px]" />
          </button>

          <h1 className="min-w-0 flex-1 truncate px-2 text-center text-[17px] font-bold text-[#111827]">
            How to Use Sales Reports
          </h1>

          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl pb-10">
        <section className="bg-white px-4 pb-5 pt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf3] text-[#16a34a]">
            <i className="fa-solid fa-file-excel text-[19px]" />
          </div>

          <h2 className="mt-3 text-[18px] font-bold text-[#111827]">
            Sales Reports Guide
          </h2>

          <p className="mx-auto mt-1 max-w-[420px] text-[13px] font-normal leading-5 text-[#98a2b3]">
            Learn how to connect Google Sheets and sync your monthly Book and PDF
            sales reports.
          </p>
        </section>

        <div className="mt-3 bg-white">
          {SALES_REPORTS_HELP_STEPS.map((step) => (
            <SalesReportsHelpSection
              key={step.number}
              number={step.number}
              title={step.title}
            >
              <p>{step.content}</p>

              {step.number === '2' ? (
                <p className="mt-2 font-medium text-[#475467]">
                  Editor access is required. Without it, Shadow cannot create or
                  update your reports.
                </p>
              ) : null}
            </SalesReportsHelpSection>
          ))}
        </div>

        <div className="mx-4 mt-4 rounded-[16px] bg-[#ecfdf3] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info mt-0.5 text-[14px] text-[#16a34a]" />

            <p className="text-[12px] font-normal leading-5 text-[#667085]">
              Having trouble connecting? Check the Google Sheet link, confirm
              that the Sheet is shared with the Shadow email, and make sure the
              permission is set to Editor.
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-[11px] font-normal text-[#b0b7c3]">
          All rights reserved by Shadow.
        </p>
      </div>
    </main>
  )
}

export function SalesReportsSettingsPage({
  open,
  onBack,
  fetchSettings,
  connectSheet,
  syncSheet,
  disconnectSheet,
}) {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('')
  const [integration, setIntegration] = useState(null)
  const [editorEmail, setEditorEmail] = useState('')
  const [configured, setConfigured] = useState(true)
  const [loading, setLoading] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [showHelp, setShowHelp] = useState(false)

  const connected = integration?.connection_status === 'connected'
  const googleSheetUrl =
    integration?.spreadsheet_url ||
    spreadsheetUrl.trim()

  const actionLocked =
    loading ||
    connecting ||
    syncing ||
    disconnecting

  const statusText = useMemo(() => {
    if (loading) return 'Loading connection...'
    if (connected) return 'Google Sheet is connected'
    if (integration?.connection_status === 'error') {
      return integration?.last_sync_error || 'Connection needs attention'
    }
    return 'No Google Sheet connected'
  }, [connected, integration, loading])

  const applySettings = (data) => {
    const nextIntegration = data?.sales_reports || null

    setConfigured(data?.configured !== false)
    setEditorEmail(data?.editor_email || '')
    setIntegration(nextIntegration)

    if (nextIntegration?.spreadsheet_url) {
      setSpreadsheetUrl(nextIntegration.spreadsheet_url)
    }

    return nextIntegration
  }

  const loadSettings = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true)

      const data = await fetchSettings()
      applySettings(data)
      return data
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return undefined

    let ignore = false

    async function run() {
      try {
        setLoading(true)
        setMessage('')

        const data = await fetchSettings()

        if (!ignore) {
          applySettings(data)
        }
      } catch (error) {
        if (!ignore) {
          setMessageType('error')
          setMessage(error.message || 'Failed to load Sales Reports settings.')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    run()

    return () => {
      ignore = true
    }
  }, [open, fetchSettings])

  const handleCopyEmail = async () => {
    if (!editorEmail) return

    try {
      await navigator.clipboard.writeText(editorEmail)
      setMessageType('success')
      setMessage('Shadow Google email copied.')
    } catch {
      setMessageType('error')
      setMessage('Copy failed. Please copy the email manually.')
    }
  }

  const handleConnect = async () => {
    const url = spreadsheetUrl.trim()

    if (!url) {
      setMessageType('error')
      setMessage('Please paste your Google Sheet link.')
      return
    }

    try {
      setConnecting(true)
      setMessage('')

      const data = await connectSheet(url)
      const nextIntegration = data?.sales_reports || null

      setIntegration(nextIntegration)

      if (nextIntegration?.spreadsheet_url) {
        setSpreadsheetUrl(nextIntegration.spreadsheet_url)
      }

      setMessageType('success')
      setMessage('Google Sheet connected. Tap Sync now to send this month’s sales.')
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Failed to connect Google Sheet.')
    } finally {
      setConnecting(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      setMessage('')

      const data = await syncSheet()
      const sync = data?.sync || {}

      await loadSettings({ silent: true })

      setMessageType('success')
      setMessage(
        `Sync complete: ${Number(sync.appended || 0)} new, ${Number(sync.updated || 0)} updated, ${Number(sync.moved || 0)} moved, ${Number(sync.removed || 0)} removed.`
      )
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Failed to sync Sales Reports.')
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true)
      setMessage('')

      const data = await disconnectSheet()

      setIntegration(data?.sales_reports || {
        ...integration,
        connection_status: 'disconnected',
      })

      setMessageType('success')
      setMessage('Google Sheet disconnected. Existing Sheet data was not deleted.')
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Failed to disconnect Google Sheet.')
    } finally {
      setDisconnecting(false)
    }
  }

  const handleOpenSheet = () => {
    if (!googleSheetUrl) return

    window.open(
      googleSheetUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  if (!open) return null

  if (showHelp) {
    return <SalesReportsHelpPage onBack={() => setShowHelp(false)} />
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#f7f5fb]">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-8 shrink-0 items-center justify-start text-[#111827] active:opacity-60"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-[18px] font-black leading-5 text-[#111827]">
              Sales Reports
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[#8b93a1]">
              Monthly Google Sheet sales reports.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center text-[#667085] active:opacity-60"
            aria-label="Open Sales Reports guide"
          >
            <i className="fa-regular fa-circle-question text-[17px]" />
          </button>
        </div>
      </header>

      <main className="h-[calc(100vh-56px)] overflow-y-auto px-4 pb-28 pt-4">
        <section className="overflow-hidden rounded-[26px] bg-white shadow-sm ring-1 ring-black/5">
          <div className="bg-gradient-to-br from-[#ede9fe] via-[#f5f3ff] to-white px-4 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#16a34a] shadow-sm ring-1 ring-black/5">
                <i className="fa-solid fa-file-excel text-[27px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[17px] font-black text-[#111827]">
                    Google Sheets
                  </h2>
                  <SalesReportsStatus integration={integration} />
                </div>

                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6b7280]">
                  {statusText}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {!configured ? (
              <div className="rounded-2xl bg-[#fff7ed] px-4 py-3 text-[12px] font-bold leading-5 text-[#9a3412] ring-1 ring-[#fed7aa]">
                Sales Reports is not configured on the server.
              </div>
            ) : null}

            {message ? (
              <button
                type="button"
                onClick={() => setMessage('')}
                className={`w-full rounded-2xl px-4 py-3 text-left text-[12px] font-bold leading-5 ring-1 ${
                  messageType === 'error'
                    ? 'bg-[#fff1f2] text-[#be123c] ring-[#fecdd3]'
                    : 'bg-[#ecfdf5] text-[#047857] ring-[#a7f3d0]'
                }`}
              >
                {message}
              </button>
            ) : null}

            <div className="rounded-[22px] bg-[#f8fafc] p-4 ring-1 ring-black/5">
              <div className="text-[12px] font-black text-[#111827]">
                Step 1 — Share your Sheet
              </div>

              <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6b7280]">
                Create one Google Spreadsheet and share it with this Shadow account as Editor.
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-[#e5e7eb]">
                <div className="min-w-0 flex-1 break-all text-[12px] font-black text-[#374151]">
                  {editorEmail || 'Loading Shadow Google email...'}
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  disabled={!editorEmail}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f3f0f8] text-[#6f4cff] active:scale-95 disabled:opacity-40"
                >
                  <i className="fa-regular fa-copy text-[13px]" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[12px] font-black text-[#111827]">
                Step 2 — Paste Google Sheet link
              </label>

              <input
                type="url"
                value={spreadsheetUrl}
                onChange={(event) => setSpreadsheetUrl(event.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                disabled={actionLocked}
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e1ec] bg-white px-4 text-[12px] font-bold text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/10 disabled:bg-[#f3f4f6]"
              />
            </div>

            <button
              type="button"
              onClick={handleConnect}
              disabled={actionLocked || !configured || !spreadsheetUrl.trim()}
              className="h-12 w-full rounded-full bg-[#111827] text-[13px] font-black text-white shadow-sm active:scale-[0.98] disabled:bg-[#aeb6c4]"
            >
              {connecting ? 'Connecting...' : connected ? 'Reconnect & Test' : 'Connect & Test'}
            </button>

            {integration ? (
              <div className="rounded-[22px] bg-white p-4 ring-1 ring-black/5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">
                      Sheet
                    </div>
                    <div className="mt-1 truncate text-[12px] font-black text-[#111827]">
                      {integration.sheet_name || 'Monthly Summary'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.08em] text-[#9ca3af]">
                      Last Sync
                    </div>
                    <div className="mt-1 text-[12px] font-black text-[#111827]">
                      {formatDateTime(integration.last_synced_at)}
                    </div>
                  </div>
                </div>

                {integration.last_sync_error ? (
                  <div className="mt-3 rounded-2xl bg-[#fff1f2] px-3 py-2 text-[11px] font-bold leading-5 text-[#be123c]">
                    {integration.last_sync_error}
                  </div>
                ) : null}
              </div>
            ) : null}

            {connected ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={actionLocked}
                  className="h-12 rounded-full bg-[#7c5cff] text-[12px] font-black text-white active:scale-[0.98] disabled:opacity-50"
                >
                  {syncing ? 'Syncing...' : 'Sync now'}
                </button>

                <button
                  type="button"
                  onClick={handleOpenSheet}
                  disabled={!googleSheetUrl || actionLocked}
                  className="h-12 rounded-full bg-[#ecfdf5] text-[12px] font-black text-[#047857] ring-1 ring-[#a7f3d0] active:scale-[0.98] disabled:opacity-50"
                >
                  Open Sheet
                </button>
              </div>
            ) : null}

            {integration && integration.connection_status !== 'disconnected' ? (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={actionLocked}
                className="h-11 w-full rounded-full bg-[#fff1f2] text-[12px] font-black text-[#be123c] ring-1 ring-[#fecdd3] active:scale-[0.98] disabled:opacity-50"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect Google Sheet'}
              </button>
            ) : null}

            <div className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[11px] font-semibold leading-5 text-[#6b7280]">
              Shadow creates one tab for each paid month and keeps Monthly Summary updated. Disconnecting does not delete existing Google Sheet data.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
