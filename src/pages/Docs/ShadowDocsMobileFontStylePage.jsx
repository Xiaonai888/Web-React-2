import { ChevronLeft, Keyboard } from 'lucide-react'
import './ShadowDocsMobileHomeSheet.css'

const COLORS = ['#000000', '#04b8ee', '#ffff00']
const LINES = [
  { value: 'single', label: 'Single underline' },
  { value: 'double', label: 'Double underline' },
  { value: 'wavy', label: 'Wavy underline' },
]

function Action({ label, active, disabled, onClick, children }) {
  return <button
    type="button"
    className={`sd-fs-action ${active ? 'is-selected' : ''}`}
    aria-label={label}
    aria-pressed={Boolean(active)}
    disabled={disabled}
    onPointerDown={event => event.preventDefault()}
    onClick={onClick}
  >{children}</button>
}

export default function ShadowDocsMobileFontStylePage({
  open = false,
  state = {},
  onCommand,
  onStyleOption,
  onBack,
  onKeyboard,
  disabled = false,
}) {
  if (!open) return null

  const canBasic = !disabled && typeof onCommand === 'function'
  const canOption = !disabled && typeof onStyleOption === 'function'
  const currentUnderline = state.underlineStyle || (state.underline ? 'single' : '')
  const currentColor = String(state.underlineColor || '#000000').toLowerCase()
  const basic = (name, value) => { if (canBasic) onCommand(name, value) }
  const option = (name, value) => { if (canOption) onStyleOption(name, value) }

  return <div className="sd-home-sheet-layer sd-fs-layer" role="presentation">
    <button
      type="button"
      className="sd-home-sheet-dismiss"
      aria-label="Back to Home"
      onPointerDown={event => event.preventDefault()}
      onClick={onBack}
    />
    <section className="sd-home-sheet sd-fs-sheet" role="dialog" aria-modal="true" aria-label="Font Style">
      <header className="sd-home-sheet-header">
        <div className="sd-home-subtitle">
          <button
            type="button"
            className="sd-home-icon-button"
            style={{ flex: '0 0 40px' }}
            aria-label="Back to Home"
            onPointerDown={event => event.preventDefault()}
            onClick={onBack}
          ><ChevronLeft size={24} /></button>
          <strong>Font Style</strong>
        </div>
        <div className="sd-home-head-actions">
          <button
            type="button"
            className="sd-home-icon-button"
            aria-label="Show keyboard"
            disabled={disabled || typeof onKeyboard !== 'function'}
            onPointerDown={event => event.preventDefault()}
            onClick={onKeyboard}
          ><Keyboard size={22} /></button>
        </div>
      </header>

      <div className="sd-home-scroll sd-fs-content">
        <div className="sd-fs-card">
          <div className="sd-fs-toolbar">
            <Action label="Bold" active={state.bold} disabled={!canBasic} onClick={() => basic('bold', !state.bold)}><strong>B</strong></Action>
            <Action label="Italic" active={state.italic} disabled={!canBasic} onClick={() => basic('italic', !state.italic)}><em>I</em></Action>
            <Action label="Strikethrough" active={state.strike} disabled={!canBasic} onClick={() => basic('strike', !state.strike)}><s>ab</s></Action>
            <Action label="Superscript" active={state.superscript} disabled={!canBasic} onClick={() => basic('superscript', !state.superscript)}>X<sup>2</sup></Action>
            <Action label="Subscript" active={state.subscript} disabled={!canBasic} onClick={() => basic('subscript', !state.subscript)}>X<sub>2</sub></Action>
          </div>
          <div className="sd-fs-caps">
            <Action label="All Caps" active={state.allCaps} disabled={!canOption} onClick={() => option('allCaps', !state.allCaps)}>All Caps</Action>
            <Action label="Small Caps" active={state.smallCaps} disabled={!canOption} onClick={() => option('smallCaps', !state.smallCaps)}>Small Caps</Action>
          </div>
        </div>

        <h3 className="sd-fs-label">Underline</h3>
        <div className="sd-fs-underline-grid">
          <div className="sd-fs-card sd-fs-trio">
            {LINES.map(({ value, label }) => <Action
              key={value}
              label={label}
              active={currentUnderline === value}
              disabled={value === 'single' ? !canBasic : !canOption}
              onClick={() => value === 'single'
                ? basic('underline', !state.underline)
                : option('underlineStyle', value)}
            ><span className={`sd-fs-line sd-fs-line-${value}`}>U</span></Action>)}
          </div>
          <div className="sd-fs-card sd-fs-trio">
            {COLORS.map(color => <Action
              key={color}
              label={`Underline color ${color}`}
              active={currentColor === color && Boolean(state.underline)}
              disabled={!canOption}
              onClick={() => option('underlineColor', color)}
            ><span className="sd-fs-dot" style={{ backgroundColor: color }} /></Action>)}
          </div>
        </div>
      </div>
    </section>

    <style>{`
      @keyframes sd-fs-slide-left { from { transform: translateX(-38%); opacity: .65; } to { transform: translateX(0); opacity: 1; } }
      @media (max-width: 700px) {
        .sd-fs-sheet { animation: sd-fs-slide-left .2s ease-out both; }
        .sd-fs-content { padding-top: 12px; }
        .sd-fs-card { background: #303030; border-radius: 13px; overflow: hidden; }
        .sd-fs-toolbar { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); min-height: 78px; padding: 6px; border-bottom: 1px solid #414141; }
        .sd-fs-action { display: inline-flex; align-items: center; justify-content: center; gap: 1px; width: 100%; min-width: 0; min-height: 62px; padding: 5px; border: 0; border-radius: 10px; background: transparent; color: #e8e8e8; font-size: 22px; cursor: pointer; }
        .sd-fs-action.is-selected { background: #424242; color: #fff; }
        .sd-fs-action:disabled { opacity: .36; cursor: not-allowed; }
        .sd-fs-action:focus-visible { outline: 2px solid #7db7ff; outline-offset: -2px; }
        .sd-fs-action sup, .sd-fs-action sub { font-size: 12px; line-height: 0; }
        .sd-fs-caps { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); min-height: 73px; }
        .sd-fs-caps .sd-fs-action { font-size: 16px; font-weight: 400; }
        .sd-fs-label { margin: 19px 0 11px 15px; color: #a7a7a7; font-size: 15px; font-weight: 500; }
        .sd-fs-underline-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
        .sd-fs-trio { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); padding: 6px; }
        .sd-fs-trio .sd-fs-action { min-height: 64px; }
        .sd-fs-line { font-size: 25px; text-decoration-line: underline; text-underline-offset: 5px; }
        .sd-fs-line-double { text-decoration-style: double; }
        .sd-fs-line-wavy { text-decoration-style: wavy; }
        .sd-fs-dot { display: block; width: 27px; height: 27px; border-radius: 50%; box-shadow: 0 0 0 1px #555; }
      }
      @media (max-width: 700px) and (prefers-reduced-motion: reduce) { .sd-fs-sheet { animation: none; } }
    `}</style>
  </div>
}
