import { createPortal } from 'react-dom'
import './StudioUIControls.css'

const classNames = (...values) => values.filter(Boolean).join(' ')

export function StudioUIField({ label, hint = '', className = '', children }) {
  return (
    <label className={classNames('ss-ui-field', className)}>
      <span className="ss-ui-field-copy">
        <strong>{label}</strong>
        {hint ? <small>{hint}</small> : null}
      </span>
      <span className="ss-ui-field-control">{children}</span>
    </label>
  )
}

export function StudioUISlider({
  label,
  hint = '',
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
  disabled = false,
  onChange,
  className = '',
  ariaLabel,
}) {
  const update = (next) => {
    const number = Number(next)
    if (!Number.isFinite(number)) return
    onChange?.(Math.max(min, Math.min(max, number)))
  }

  return (
    <StudioUIField label={label} hint={hint} className={classNames('ss-ui-slider-field', className)}>
      <span className="ss-ui-slider">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel || label}
          onChange={(event) => update(event.target.value)}
        />
        <span className="ss-ui-number-wrap">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            aria-label={`${ariaLabel || label} value`}
            onChange={(event) => update(event.target.value)}
          />
          {suffix ? <span className="ss-ui-number-suffix">{suffix}</span> : null}
        </span>
      </span>
    </StudioUIField>
  )
}

export function StudioUINumber({
  label,
  hint = '',
  value,
  min,
  max,
  step = 1,
  suffix = '',
  disabled = false,
  onChange,
  className = '',
}) {
  const update = (next) => {
    let number = Number(next)
    if (!Number.isFinite(number)) return
    if (Number.isFinite(min)) number = Math.max(min, number)
    if (Number.isFinite(max)) number = Math.min(max, number)
    onChange?.(number)
  }

  return (
    <StudioUIField label={label} hint={hint} className={className}>
      <span className="ss-ui-number-wrap ss-ui-number-wide">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(event) => update(event.target.value)}
        />
        {suffix ? <span className="ss-ui-number-suffix">{suffix}</span> : null}
      </span>
    </StudioUIField>
  )
}

export function StudioUISelect({
  label,
  hint = '',
  value,
  options = [],
  disabled = false,
  onChange,
  className = '',
}) {
  return (
    <StudioUIField label={label} hint={hint} className={className}>
      <span className="ss-ui-select-wrap">
        <select value={value} disabled={disabled} onChange={(event) => onChange?.(event.target.value)}>
          {options.map((option) => {
            const item = typeof option === 'object' ? option : { value: option, label: option }
            return <option key={String(item.value)} value={item.value}>{item.label}</option>
          })}
        </select>
        <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      </span>
    </StudioUIField>
  )
}

export function StudioUIColor({
  label,
  hint = '',
  value = '#000000',
  disabled = false,
  onChange,
  className = '',
}) {
  return (
    <StudioUIField label={label} hint={hint} className={className}>
      <span className="ss-ui-color-control">
        <input
          type="color"
          value={value}
          disabled={disabled}
          aria-label={label}
          onChange={(event) => onChange?.(event.target.value)}
        />
        <span className="ss-ui-color-chip" style={{ background: value }} aria-hidden="true" />
        <input
          className="ss-ui-color-text"
          type="text"
          value={value}
          maxLength={7}
          disabled={disabled}
          aria-label={`${label} hex`}
          onChange={(event) => onChange?.(event.target.value)}
        />
      </span>
    </StudioUIField>
  )
}

export function StudioUIToggle({
  label,
  hint = '',
  checked = false,
  disabled = false,
  onChange,
  className = '',
}) {
  return (
    <label className={classNames('ss-ui-toggle-row', className)}>
      <span className="ss-ui-field-copy">
        <strong>{label}</strong>
        {hint ? <small>{hint}</small> : null}
      </span>
      <span className="ss-ui-switch">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <span aria-hidden="true" />
      </span>
    </label>
  )
}

export function StudioUITabs({ items = [], value, onChange, ariaLabel = 'Tabs', className = '' }) {
  return (
    <div className={classNames('ss-ui-tabs', className)} role="tablist" aria-label={ariaLabel}>
      {items.map((item) => {
        const tab = typeof item === 'object' ? item : { value: item, label: item }
        const active = value === tab.value
        return (
          <button
            key={String(tab.value)}
            type="button"
            role="tab"
            aria-selected={active}
            className={active ? 'active' : ''}
            disabled={tab.disabled}
            onClick={() => onChange?.(tab.value)}
          >
            {tab.icon ? <i className={tab.icon} aria-hidden="true" /> : null}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function StudioUISection({
  title,
  subtitle = '',
  icon = '',
  open = true,
  collapsible = false,
  onToggle,
  actions = null,
  children,
  className = '',
}) {
  return (
    <section className={classNames('ss-ui-section', className)} data-open={open}>
      <header className="ss-ui-section-head">
        <button
          type="button"
          className="ss-ui-section-title"
          disabled={!collapsible}
          onClick={() => collapsible && onToggle?.(!open)}
          aria-expanded={open}
        >
          {icon ? <i className={icon} aria-hidden="true" /> : null}
          <span>
            <strong>{title}</strong>
            {subtitle ? <small>{subtitle}</small> : null}
          </span>
          {collapsible ? <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`} aria-hidden="true" /> : null}
        </button>
        {actions ? <div className="ss-ui-section-actions">{actions}</div> : null}
      </header>
      {open ? <div className="ss-ui-section-body">{children}</div> : null}
    </section>
  )
}

export function StudioUIButton({
  children,
  icon = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  title,
}) {
  return (
    <button
      type={type}
      className={classNames('ss-ui-button', `ss-ui-button-${variant}`, `ss-ui-button-${size}`, className)}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {icon ? <i className={icon} aria-hidden="true" /> : null}
      {children ? <span>{children}</span> : null}
    </button>
  )
}

export function StudioUIIconButton({
  icon,
  label,
  active = false,
  disabled = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      className={classNames('ss-ui-icon-button', active && 'active', className)}
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      <i className={icon} aria-hidden="true" />
    </button>
  )
}

export function StudioUISeparator({ className = '' }) {
  return <div className={classNames('ss-ui-separator', className)} aria-hidden="true" />
}

export function StudioUIPreview({ label = 'Preview', children, className = '' }) {
  return (
    <div className={classNames('ss-ui-preview', className)}>
      <div className="ss-ui-preview-label">{label}</div>
      <div className="ss-ui-preview-stage">{children}</div>
    </div>
  )
}

export function StudioUIDialog({
  open = false,
  title,
  subtitle = '',
  icon = '',
  width = 760,
  busy = false,
  onClose,
  children,
  footer = null,
  aside = null,
  className = '',
}) {
  if (!open) return null

  return createPortal(
    <div className="ss-ui-dialog-backdrop" role="presentation">
      <section
        className={classNames('ss-ui-dialog', className)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ '--ss-ui-dialog-width': `${width}px` }}
      >
        <header className="ss-ui-dialog-head">
          <div className="ss-ui-dialog-title">
            {icon ? <i className={icon} aria-hidden="true" /> : null}
            <span>
              <strong>{title}</strong>
              {subtitle ? <small>{subtitle}</small> : null}
            </span>
          </div>
          <StudioUIIconButton icon="fa-solid fa-xmark" label="Close" disabled={busy} onClick={onClose} />
        </header>
        <div className={classNames('ss-ui-dialog-layout', aside && 'has-aside')}>
          {aside ? <aside className="ss-ui-dialog-aside">{aside}</aside> : null}
          <div className="ss-ui-dialog-content">{children}</div>
        </div>
        {footer ? <footer className="ss-ui-dialog-footer">{footer}</footer> : null}
      </section>
    </div>,
    document.body,
  )
}

export function StudioUIButtonRow({ children, align = 'end', className = '' }) {
  return <div className={classNames('ss-ui-button-row', `ss-ui-align-${align}`, className)}>{children}</div>
}
