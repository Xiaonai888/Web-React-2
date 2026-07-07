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

  return (
    <div className="fixed inset-0 z-[999] bg-[#f7f5fb]">
      <header className="sticky top-0 z-40 border-b border-[#eeeaf5] bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0f8] text-[#111827] active:scale-95"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0">
            <h1 className="text-[18px] font-black leading-5 text-[#111827]">
              Sales Reports
            </h1>
            <p className="mt-0.5 text-[11px] font-semibold text-[#8b93a1]">
              Monthly Google Sheet sales reports.
            </p>
          </div>
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
