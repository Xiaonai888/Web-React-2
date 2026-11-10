import { ChevronLeft, Keyboard } from 'lucide-react'
import './ShadowDocsMobileHomeSheet.css'

export const SHADOW_DOCS_MOBILE_FONT_SIZES = Object.freeze([
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  16, 18, 20, 22, 24, 28, 32, 36, 48, 72,
])

export default function ShadowDocsMobileFontSizePage({
  open = false,
  value = 13,
  onSelect,
  onBack,
  onKeyboard,
  disabled = false,
}) {
  if (!open) return null

  const selectedSize = Number(value)

  return (
    <div className="sd-home-sheet-layer" role="presentation">
      <button
        type="button"
        className="sd-home-sheet-dismiss"
        aria-label="Back to Home"
        onClick={onBack}
      />
      <section
        className="sd-home-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Font Size"
      >
        <header className="sd-home-sheet-header">
          <div className="sd-home-subtitle">
            <button
              type="button"
              className="sd-home-icon-button"
              aria-label="Back to Home"
              onPointerDown={event => event.preventDefault()}
              onClick={onBack}
              style={{ flex: '0 0 40px' }}
            >
              <ChevronLeft size={24} />
            </button>
            <strong>Font Size</strong>
          </div>
          <div className="sd-home-head-actions">
            <button
              type="button"
              className="sd-home-icon-button"
              aria-label="Show keyboard"
              disabled={typeof onKeyboard !== 'function'}
              onPointerDown={event => event.preventDefault()}
              onClick={onKeyboard}
            >
              <Keyboard size={22} />
            </button>
          </div>
        </header>
        <div className="sd-home-scroll" role="listbox" aria-label="Font sizes">
          {SHADOW_DOCS_MOBILE_FONT_SIZES.map(size => (
            <button
              key={size}
              type="button"
              role="option"
              aria-selected={selectedSize === size}
              disabled={disabled || typeof onSelect !== 'function'}
              onPointerDown={event => event.preventDefault()}
              onClick={() => onSelect?.(size)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                minHeight: 68,
                padding: '0 24px',
                border: 0,
                borderBottom: '1px solid #383838',
                background: selectedSize === size ? '#343434' : 'transparent',
                color: '#f0f0f0',
                fontSize: 17,
                textAlign: 'left',
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
