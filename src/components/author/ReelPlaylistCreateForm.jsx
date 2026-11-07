import { useState } from 'react'
import { X } from 'lucide-react'

/** UI-only composer. onCreate(name) may later be backed by an owned API. */
export default function ReelPlaylistCreateForm({
  existingNames = [],
  onCreate,
  onCancel,
  t,
  disabled = false,
}) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const cleanName = name.trim()
  const duplicate = existingNames.some(
    item => String(item).trim().toLocaleLowerCase() === cleanName.toLocaleLowerCase()
  )
  const canCreate = !disabled && !saving && Boolean(cleanName) && !duplicate && typeof onCreate === 'function'

  const submit = async event => {
    event.preventDefault()
    if (!canCreate) return
    setSaving(true)
    setError('')
    try {
      // No network calls here: parent decides whether to create a local preview or persist.
      await onCreate(cleanName)
      setName('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2 border-t border-[var(--shadow-border)] p-3">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="shadow-reel-new-playlist" className="text-xs font-semibold text-[var(--shadow-text-primary)]">
          {t('authorReelAdd.playlistName')}
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          aria-label={t('authorReelAdd.done')}
          className="rounded-full p-1 text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-hover)] disabled:opacity-50"
        >
          <X size={17} aria-hidden="true" />
        </button>
      </div>
      <input
        id="shadow-reel-new-playlist"
        autoFocus
        maxLength={80}
        value={name}
        onChange={event => setName(event.target.value)}
        placeholder={t('authorReelAdd.playlistName')}
        disabled={disabled || saving}
        className="app-input w-full rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-3 py-2.5 text-[13px] text-[var(--shadow-text-primary)] outline-none focus:border-[var(--shadow-border-strong)] disabled:opacity-50"
      />
      {error ? <p role="alert" className="text-xs text-[var(--shadow-danger)]">{error}</p> : null}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canCreate}
          className="rounded-full bg-[var(--shadow-bg-soft)] px-4 py-2 text-xs font-semibold text-[var(--shadow-text-primary)] disabled:opacity-40"
        >
          {t('authorReelAdd.create')}
        </button>
      </div>
    </form>
  )
}
