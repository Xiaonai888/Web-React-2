import { ChevronLeft, Keyboard } from 'lucide-react'

const COLORS = ['#000000', '#04b8ee', '#ffff00']
const UNDERLINES = [
  { value: 'single', label: 'Single underline' },
  { value: 'dashed', label: 'Dashed underline' },
  { value: 'wavy', label: 'Wavy underline' },
]

function Action({ label, active = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      className={`sd-fs-action ${active ? 'is-selected' : ''}`}
      aria-label={label}
      aria-pressed={Boolean(active)}
      disabled={disabled}
      onPointerDown={event => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function UnderlineIcon({ type }) {
  return (
    <span className="sd-fs-underline-symbol" aria-hidden="true">
      <span>U</span>
      <svg viewBox="0 0 48 8" width="44" height="8" fill="none">
        {type === 'wavy' ? (
          <path
            d="M1 4 Q3 1.5 5 4 T9 4 T13 4 T17 4 T21 4 T25 4 T29 4 T33 4 T37 4 T41 4 T45 4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M2 4 H46"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeDasharray={type === 'dashed' ? '3 3' : undefined}
          />
        )}
      </svg>
    </span>
  )
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
  const activeUnderline = state.underlineStyle || (state.underline ? 'single' : '')
  const activeColor = String(state.underlineColor || '#000000').toLowerCase()

  const basic = (name, value) => {
    if (canBasic) onCommand(name, value)
  }
  const option = (name, value) => {
    if (canOption) onStyleOption(name, value)
  }

  return (
    <div className="sd-fs-embedded" role="group" aria-label="Font Style">
      <header className="sd-home-sheet-header">
        <div className="sd-home-subtitle">
          <button
            type="button"
            className="sd-home-icon-button"
            aria-label="Back to Home"
            style={{ flex: '0 0 40px' }}
            onPointerDown={event => event.preventDefault()}
            onClick={onBack}
          >
            <ChevronLeft size={24} />
          </button>
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
          >
            <Keyboard size={22} />
          </button>
        </div>
      </header>

      <div className="sd-home-scroll sd-fs-content">
        <div className="sd-fs-card">
          <div className="sd-fs-toolbar">
            <Action label="Bold" active={state.bold} disabled={!canBasic} onClick={() => basic('bold', !state.bold)}>
              <strong>B</strong>
            </Action>
            <Action label="Italic" active={state.italic} disabled={!canBasic} onClick={() => basic('italic', !state.italic)}>
              <em>I</em>
            </Action>
            <Action label="Strikethrough" active={state.strike} disabled={!canBasic} onClick={() => basic('strike', !state.strike)}>
              <s>ab</s>
            </Action>
            <Action label="Superscript" active={state.superscript} disabled={!canBasic} onClick={() => basic('superscript', !state.superscript)}>
              X<sup>2</sup>
            </Action>
            <Action label="Subscript" active={state.subscript} disabled={!canBasic} onClick={() => basic('subscript', !state.subscript)}>
              X<sub>2</sub>
            </Action>
          </div>
          <div className="sd-fs-caps">
            <Action label="All Caps" active={state.allCaps} disabled={!canOption} onClick={() => option('allCaps', !state.allCaps)}>
              All Caps
            </Action>
            <Action label="Small Caps" active={state.smallCaps} disabled={!canOption} onClick={() => option('smallCaps', !state.smallCaps)}>
              Small Caps
            </Action>
          </div>
        </div>

        <h3 className="sd-fs-label">Underline</h3>
        <div className="sd-fs-underline-grid">
          <div className="sd-fs-card sd-fs-trio">
            {UNDERLINES.map(({ value, label }) => (
              <Action
                key={value}
                label={label}
                active={Boolean(state.underline) && activeUnderline === value}
                disabled={!canOption}
                onClick={() => option('underlineStyle', value)}
              >
                <UnderlineIcon type={value} />
              </Action>
            ))}
          </div>
          <div className="sd-fs-card sd-fs-trio">
            {COLORS.map(color => (
              <Action
                key={color}
                label={`Underline color ${color}`}
                active={Boolean(state.underline) && activeColor === color}
                disabled={!canOption}
                onClick={() => option('underlineColor', color)}
              >
                <span className="sd-fs-dot" style={{ backgroundColor: color }} />
              </Action>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:700px) {
          .sd-home-sheet .sd-fs-embedded { display:flex; flex-direction:column; width:100%; height:100%; min-height:0; background:#191919; color:#efefef; }
          .sd-home-sheet .sd-fs-content { padding-top:12px; }
          .sd-home-sheet .sd-fs-card { background:#303030; border-radius:13px; overflow:hidden; }
          .sd-home-sheet .sd-fs-toolbar { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); min-height:79px; padding:6px; border-bottom:1px solid #414141; }
          .sd-home-sheet .sd-fs-action { display:inline-flex; align-items:center; justify-content:center; gap:1px; width:100%; min-width:0; min-height:62px; padding:5px; border:0; border-radius:10px; background:transparent; color:#e8e8e8; font-size:24px; font-weight:400; line-height:1; cursor:pointer; }
          .sd-home-sheet .sd-fs-action.is-selected { background:#424242; color:#fff; }
          .sd-home-sheet .sd-fs-action:disabled { opacity:.36; cursor:not-allowed; }
          .sd-home-sheet .sd-fs-action:focus-visible { outline:2px solid #7db7ff; outline-offset:-2px; }
          .sd-home-sheet .sd-fs-toolbar strong { font-weight:700; }
          .sd-home-sheet .sd-fs-toolbar em { font-family:Georgia,"Times New Roman",serif; font-weight:400; font-style:italic; }
          .sd-home-sheet .sd-fs-toolbar s { font-size:19px; font-weight:400; position:relative; top:3px; }
          .sd-home-sheet .sd-fs-toolbar sup, .sd-home-sheet .sd-fs-toolbar sub { font-size:13px; font-weight:400; line-height:0; position:relative; vertical-align:baseline; }
          .sd-home-sheet .sd-fs-toolbar sup { top:-.65em; }
          .sd-home-sheet .sd-fs-toolbar sub { top:.35em; }
          .sd-home-sheet .sd-fs-caps { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); min-height:73px; padding:4px; }
          .sd-home-sheet .sd-fs-caps .sd-fs-action { font-size:16px; font-weight:400; }
          .sd-home-sheet .sd-fs-label { margin:19px 0 11px 15px; color:#a7a7a7; font-size:15px; font-weight:500; }
          .sd-home-sheet .sd-fs-underline-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
          .sd-home-sheet .sd-fs-trio { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); padding:6px; }
          .sd-home-sheet .sd-fs-trio .sd-fs-action { min-height:64px; }
          .sd-home-sheet .sd-fs-underline-symbol { display:inline-flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; line-height:1; font-size:24px; font-weight:400; }
          .sd-home-sheet .sd-fs-underline-symbol svg { display:block; width:42px; height:7px; overflow:visible; }
          .sd-home-sheet .sd-fs-dot { display:block; width:27px; height:27px; border-radius:50%; box-shadow:0 0 0 1px #555; }
          .sd-home-sheet .sd-home-page-slide, .sd-home-sheet .sd-font-style-slide { position:absolute; inset:0; display:flex; flex-direction:column; min-height:0; width:100%; transition:transform 220ms cubic-bezier(.22,.61,.36,1); will-change:transform; }
          .sd-home-sheet .sd-home-page-slide { transform:translateX(0); pointer-events:auto; }
          .sd-home-sheet .sd-home-page-slide.is-away { transform:translateX(-100%); pointer-events:none; }
          .sd-home-sheet .sd-font-style-slide { transform:translateX(100%); pointer-events:none; }
          .sd-home-sheet .sd-font-style-slide.is-open { transform:translateX(0); pointer-events:auto; }
        }
        @media (max-width:700px) and (prefers-reduced-motion:reduce) {
          .sd-home-sheet .sd-home-page-slide, .sd-home-sheet .sd-font-style-slide { transition:none; }
        }
      `}</style>
    </div>
  )
}
