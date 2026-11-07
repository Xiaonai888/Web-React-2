import { useState } from 'react'
import { Copy, X } from 'lucide-react'

// Match CURRENT /api/fast/videos limits. UI may be expanded only after backend review.
const MAX_TAGS = 10
const MAX_PER_TAG = 24
const MAX_CHARACTERS = 500

/** Controlled field: parent owns both committed tags and the uncommitted draft. */
export default function ReelTagsField({
  tags = [],
  draft = '',
  onTagsChange,
  onDraftChange,
  disabled = false,
  t,
}) {
  const chips = Array.isArray(tags) ? tags : []
  const totalChars = chips.join(', ').length + (draft ? draft.length + (chips.length ? 2 : 0) : 0)
  const emitTags = next => { if (typeof onTagsChange === 'function') onTagsChange(next) }
  const emitDraft = next => { if (typeof onDraftChange === 'function') onDraftChange(next) }
  const [warning, setWarning] = useState('')
  const messages = {
    tooLong: t('authorReelAdd.tagsLength'),
    tooMany: t('authorReelAdd.tagsMaximum'),
    total: t('authorReelAdd.tagsChars'),
  }

  const addTokens = raw => {
    const next = [...chips]
    let warning = ''
    for (const token of String(raw || '').split(',')) {
      const tag = token.trim()
      if (!tag) continue
      if (next.some(item => item.toLocaleLowerCase() === tag.toLocaleLowerCase())) continue
      if (tag.length > MAX_PER_TAG) { warning = messages.tooLong; break }
      if (next.length >= MAX_TAGS) { warning = messages.tooMany; break }
      if ([...next, tag].join(', ').length > MAX_CHARACTERS) { warning = messages.total; break }
      next.push(tag)
    }
    if (next.length !== chips.length) emitTags(next)
    return warning
  }


  const onInput = value => {
    if (!value.includes(',')) {
      emitDraft(value.slice(0, Math.max(0, MAX_CHARACTERS - chips.join(', ').length - (chips.length ? 2 : 0))))
      if (warning) setWarning('')
      return
    }
    const parts = value.split(',')
    const problem = addTokens(parts.slice(0, -1).join(','))
    setWarning(problem)
    emitDraft(problem ? parts.slice(0, -1).join(',') + ',' + parts.at(-1) : parts.at(-1))
  }

  const commit = () => {
    if (!draft.trim()) return
    const problem = addTokens(draft)
    setWarning(problem)
    if (!problem) emitDraft('')
  }

  const iconStyle = 'rounded-md p-1.5 text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-hover)] disabled:opacity-50'

  return (
    <section className="space-y-2">
      <label htmlFor="shadow-reel-tags" className="block text-[13px] font-semibold text-[var(--shadow-text-primary)]">
        {t('authorReelAdd.tags')}
      </label>
      <p className="text-xs leading-5 text-[var(--shadow-text-secondary)]">{t('authorReelAdd.tagsHelp')}</p>
      <div className="flex min-h-[120px] flex-wrap content-start items-start gap-1.5 rounded-lg border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] p-2.5 focus-within:border-[var(--shadow-border-strong)]">
        {chips.map((tag, index) => (
          <span key={`${tag}-${index}`} className="inline-flex max-w-full items-center gap-1 rounded-md bg-[var(--shadow-bg-soft)] px-2 py-1 text-[11px] leading-4 text-[var(--shadow-text-primary)]">
            <span className="truncate">{tag}</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => emitTags(chips.filter((_, i) => i !== index))}
              aria-label={t('authorReelAdd.removeTag', { tag })}
              className="rounded-full hover:opacity-60 disabled:opacity-50"
            ><X size={13} aria-hidden="true" /></button>
          </span>
        ))}
        <input
          id="shadow-reel-tags"
          value={draft}
          disabled={disabled}
          maxLength={MAX_CHARACTERS}
          onChange={event => onInput(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              commit()
            } else if (event.key === 'Backspace' && !draft && chips.length) {
              emitTags(chips.slice(0, -1))
            }
          }}
          placeholder={!chips.length ? t('authorReelAdd.tagsPlaceholder') : ''}
          className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-xs text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
        />
        <button
          type="button"
          disabled={disabled || !chips.length}
          title={t('authorReelAdd.copyTags')}
          aria-label={t('authorReelAdd.copyTags')}
          onClick={() => { if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(chips.join(', ')).catch(() => {}) }}
          className={iconStyle}
        ><Copy size={17} aria-hidden="true" /></button>
        <button
          type="button"
          disabled={disabled || (!chips.length && !draft)}
          title={t('authorReelAdd.clearTags')}
          aria-label={t('authorReelAdd.clearTags')}
          onClick={() => { emitTags([]); emitDraft(''); setWarning('') }}
          className={iconStyle}
        ><X size={18} aria-hidden="true" /></button>
      </div>
      <div className="flex justify-between gap-3 text-[11px] text-[var(--shadow-text-tertiary)]">
        <span>{t('authorReelAdd.tagsPlaceholder')}</span>
        <span className="shrink-0 tabular-nums">{totalChars}/{MAX_CHARACTERS}</span>
      </div>
      <p className="text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{t('authorReelAdd.tagLimit')}</p>
      {warning ? <p role="alert" className="text-xs text-[var(--shadow-danger)]">{warning}</p> : null}
    </section>
  )
}
