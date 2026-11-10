import { useEffect, useMemo, useState } from 'react'
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDownToLine,
  ChevronDown, ChevronRight, CircleOff, Columns3, Copy,
  Keyboard, List, ListOrdered, Minus, MoreHorizontal,
  Paintbrush, Plus, RotateCcw, Star, Type, X,
} from 'lucide-react'
import { SHADOW_DOCS_KHMER_FONTS, SHADOW_DOCS_LATIN_FONTS } from './ShadowDocsFontCatalog'
import { SHADOW_DOCS_STYLES } from './ShadowDocsStyleCatalog'
import './ShadowDocsMobileHomeSheet.css'

const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72]
const FONT_COLORS = [
  '#80b6ec', '#c897e9', '#b3edb7', '#e7b58c', '#f3d1d5', '#f5f5f5',
  '#368fe4', '#a24fd8', '#56dd78', '#f5c72e', '#c56970', '#bababa',
  '#1235ef', '#6214a5', '#8aa82a', '#f0a21a', '#b84c22', '#7f7f7f',
  '#080e94', '#321080', '#139a35', '#ff830f', '#ba101b', '#242139',
]
const STANDARD_COLORS = [
  '#b50000', '#eeb900', '#84b450', '#079ec3', '#8a4cb9', '#ffffff',
  '#ff2828', '#ffff00', '#24b755', '#258fce', '#153278', '#242139',
]
const HIGHLIGHT_COLORS = [
  'transparent', '#fff176', '#00e82e', '#078d1f', '#8d00b8', '#06d5e8',
  '#1235b8', '#08a69a', '#b50000', '#fa2828', '#e000d2', '#929714',
  '#f4f4f4', '#171717', '#183cff', '#bdbdbd',
]
const PASTEL_COLORS = ['#fff1ac', '#ffbed1', '#b9e8c5', '#bbdfff', '#dfc7fa', '#ffd9b0', '#ffe5ee', '#c6f2ed']
const STORAGE_PREFIX = 'shadow-docs:home-color:v1:'

function isHex(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || ''))
}

function readColors(key) {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_PREFIX + key) || '[]')
    return Array.isArray(value) ? [...new Set(value.filter(isHex).map(color => color.toLowerCase()))].slice(0, 12) : []
  } catch {
    return []
  }
}

function writeColors(key, colors) {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(colors)) } catch {}
}

function IconButton({ label, children, active = false, disabled = false, onClick, className = '' }) {
  return <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={active || undefined}
    disabled={disabled}
    className={`sd-home-icon-button ${active ? 'is-active' : ''} ${className}`}
    onPointerDown={event => event.preventDefault()}
    onClick={onClick}
  >{children}</button>
}

function Section({ label, children }) {
  return <section className="sd-home-section">
    <h3 className="sd-home-section-label">{label}</h3>
    <div className="sd-home-section-card">{children}</div>
  </section>
}

function Swatches({ colors, selected, kind, onSelect, disabled }) {
  return <div className="sd-home-color-grid">
    {colors.map((color, index) => <button
      type="button"
      key={`${color}-${index}`}
      aria-label={color === 'transparent' ? 'Remove highlight' : color}
      aria-pressed={selected === color}
      className={`sd-home-swatch ${selected === color ? 'is-selected' : ''}`}
      disabled={disabled}
      onPointerDown={event => event.preventDefault()}
      onClick={() => onSelect(color)}
    >{kind === 'highlight'
      ? <span className={`sd-home-swatch-dot ${color === 'transparent' ? 'is-none' : ''}`} style={color === 'transparent' ? undefined : { backgroundColor: color }}>{color === 'transparent' ? <CircleOff size={26} /> : null}</span>
      : <span className="sd-home-swatch-letter" style={{ color }}>A</span>}
    </button>)}
  </div>
}

export default function ShadowDocsMobileHomeSheet({
  open = false,
  state = {},
  onClose,
  onCommand,
  onAdvancedCommand,
  onKeyboard,
  onTabChange,
  disabled = false,
}) {
  const [page, setPage] = useState('home')
  const [fontMode, setFontMode] = useState('solid')
  const [moreOpen, setMoreOpen] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)
  const [recent, setRecent] = useState(() => readColors('recent'))
  const [favorites, setFavorites] = useState(() => readColors('favorites'))
  const [customColor, setCustomColor] = useState('#6c4dba')
  const [gradientColors, setGradientColors] = useState(['#2563eb', '#9333ea', '#ec4899'])
  const [gradientStops, setGradientStops] = useState(2)
  const [gradientDirection, setGradientDirection] = useState(90)
  const [advancedParagraph, setAdvancedParagraph] = useState(false)
  const [advancedNumbering, setAdvancedNumbering] = useState(false)
  const [paragraphSpacing, setParagraphSpacing] = useState(1.15)
  const canBasic = !disabled && typeof onCommand === 'function'
  const canAdvanced = !disabled && typeof onAdvancedCommand === 'function'
  const selectedColor = isHex(state.color) ? state.color.toLowerCase() : '#242139'
  const selectedHighlight = state.backgroundColor || 'transparent'
  const gradientCSS = useMemo(() => `linear-gradient(${gradientDirection}deg, ${gradientColors.slice(0, gradientStops).join(', ')})`, [gradientDirection, gradientColors, gradientStops])

  useEffect(() => {
    if (!open) {
      setPage('home')
      setMoreOpen(false)
      setStyleOpen(false)
      setAdvancedParagraph(false)
      setAdvancedNumbering(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = event => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      if (page !== 'home') setPage('home')
      else onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, page, onClose])

  function command(name, value = true) {
    if (canBasic) onCommand(name, value)
  }

  function advanced(name, value) {
    if (canAdvanced) onAdvancedCommand(name, value)
  }

  function rememberColor(color) {
    if (!isHex(color)) return
    const next = [color.toLowerCase(), ...recent.filter(value => value !== color.toLowerCase())].slice(0, 6)
    setRecent(next)
    writeColors('recent', next)
  }

  function pickColor(color, kind) {
    if (!canBasic) return
    command(kind === 'highlight' ? 'highlight' : 'color', color)
    rememberColor(color)
  }

  function toggleFavorite(color) {
    if (!isHex(color)) return
    const next = favorites.includes(color.toLowerCase())
      ? favorites.filter(item => item !== color.toLowerCase())
      : [...favorites, color.toLowerCase()].slice(-12)
    setFavorites(next)
    writeColors('favorites', next)
  }

  function changeGradient(index, color) {
    if (!isHex(color)) return
    setGradientColors(current => current.map((entry, i) => i === index ? color : entry))
  }

  if (!open) return null

  const colorPanel = page === 'color' || page === 'highlight'
  const isHighlight = page === 'highlight'

  return <div className="sd-home-sheet-layer" role="presentation">
    <button type="button" className="sd-home-sheet-dismiss" aria-label="Close tools" onClick={onClose} />
    <section className="sd-home-sheet" role="dialog" aria-modal="true" aria-label={page === 'home' ? 'Home tools' : page === 'color' ? 'Font Color' : 'Highlight'}>
      <header className="sd-home-sheet-header">
        {page === 'home' ? <div className="sd-home-tabs" role="tablist" aria-label="Document tools">
          {['Home', 'Insert', 'View', 'Review'].map(tab => <button
            type="button"
            key={tab}
            role="tab"
            aria-selected={tab === 'Home'}
            className={tab === 'Home' ? 'is-active' : ''}
            disabled={tab !== 'Home' && typeof onTabChange !== 'function'}
            onPointerDown={event => event.preventDefault()}
            onClick={() => tab !== 'Home' && onTabChange?.(tab.toLowerCase())}
          >{tab}</button>)}
        </div> : <div className="sd-home-subtitle">
          <IconButton label="Back to Home" onClick={() => setPage('home')}><ChevronDown size={23} /></IconButton>
          <strong>{isHighlight ? 'Highlight' : 'Font Color'}</strong>
        </div>}
        <div className="sd-home-head-actions">
          <IconButton label="Show keyboard" disabled={typeof onKeyboard !== 'function'} onClick={onKeyboard}><Keyboard size={22} /></IconButton>
          {page === 'home' ? <IconButton label="Close tools" onClick={onClose}><X size={22} /></IconButton> : null}
        </div>
      </header>

      <div className="sd-home-scroll" key={page}>
        {page === 'home' ? <>
          <Section label="Font Format">
            <div className="sd-home-toolbar-row sd-home-font-actions">
              <IconButton label="Bold" active={state.bold} disabled={!canBasic} onClick={() => command('bold', !state.bold)}><strong>B</strong></IconButton>
              <IconButton label="Italic" active={state.italic} disabled={!canBasic} onClick={() => command('italic', !state.italic)}><em>I</em></IconButton>
              <IconButton label="Underline" active={state.underline} disabled={!canBasic} onClick={() => command('underline', !state.underline)}><u>U</u></IconButton>
              <IconButton label="Strikethrough" active={state.strike} disabled={!canBasic} onClick={() => command('strike', !state.strike)}><s>ab</s></IconButton>
              <IconButton label="Superscript" active={state.superscript} disabled={!canBasic} onClick={() => command('superscript', !state.superscript)}>x²</IconButton>
              <IconButton label="More font options" onClick={() => setMoreOpen(value => !value)}><MoreHorizontal size={22} /></IconButton>
            </div>
            {moreOpen ? <div className="sd-home-options-row">
              <button type="button" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => command('subscript', !state.subscript)}>Subscript x₂</button>
              <button type="button" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => command('clearFormatting')}>Clear formatting</button>
            </div> : null}
            <div className="sd-home-toolbar-row sd-home-styles">
              {['heading1', 'heading2', 'heading3', 'normal'].map(id => <button
                type="button" key={id}
                className={state.styleId === id ? 'is-selected' : ''}
                disabled={!canBasic}
                onPointerDown={event => event.preventDefault()}
                onClick={() => command('style', id)}
              >{id === 'normal' ? 'Normal' : `Heading ${id.slice(-1)}`}</button>)}
              <IconButton label="More paragraph styles" onClick={() => setStyleOpen(value => !value)}><MoreHorizontal size={20} /></IconButton>
            </div>
            {styleOpen ? <div className="sd-home-options-row">
              {SHADOW_DOCS_STYLES.filter(style => !['heading1', 'heading2', 'heading3', 'normal'].includes(style.id)).map(style => <button
                type="button" key={style.id} disabled={!canBasic}
                onPointerDown={event => event.preventDefault()}
                onClick={() => command('style', style.id)}
              >{style.label}</button>)}
            </div> : null}
            <label className="sd-home-setting-row"><span><Type size={22} /> Font</span>
              <select aria-label="Font family" disabled={!canBasic} value={state.fontFamily || 'Noto Serif Khmer'} onChange={event => command('fontFamily', event.target.value)}>
                <optgroup label="Khmer fonts">{SHADOW_DOCS_KHMER_FONTS.map(font => <option key={font} value={font}>{font}</option>)}</optgroup>
                <optgroup label="Other fonts">{SHADOW_DOCS_LATIN_FONTS.map(font => <option key={font} value={font}>{font}</option>)}</optgroup>
              </select>
            </label>
            <div className="sd-home-setting-row"><span><Type size={21} /> Font Size</span>
              <div className="sd-home-stepper">
                <IconButton label="Decrease font size" disabled={!canBasic} onClick={() => command('shrinkFont')}><Minus size={19} /></IconButton>
                <select aria-label="Font size" disabled={!canBasic} value={FONT_SIZES.includes(Number(state.fontSize)) ? Number(state.fontSize) : 13} onChange={event => command('fontSize', Number(event.target.value))}>{FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}</select>
                <IconButton label="Increase font size" disabled={!canBasic} onClick={() => command('growFont')}><Plus size={19} /></IconButton>
              </div>
            </div>
            <div className="sd-home-toolbar-row sd-home-color-preview">
              {['#111827', '#b91c1c', '#f59e0b', '#16a34a', '#0284c7'].map(color => <IconButton
                key={color} label={`Font color ${color}`} disabled={!canBasic} active={selectedColor === color}
                onClick={() => pickColor(color, 'color')}
              ><span style={{ color }}>A</span></IconButton>)}
              <IconButton label="More font colors" onClick={() => { setPage('color'); setFontMode('solid') }}><MoreHorizontal size={22} /></IconButton>
            </div>
          </Section>

          <Section label="Format Painter">
            <div className="sd-home-two-buttons">
              <button type="button" disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('formatPainterCopy')}><Copy size={17} /> Copy Formats</button>
              <button type="button" disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('formatPainterPaste')}><Paintbrush size={17} /> Paste Formats</button>
            </div>
          </Section>

          <Section label="Highlight">
            <div className="sd-home-toolbar-row sd-home-highlight-preview">
              {['transparent', '#fff176', '#00e82e', '#06d5e8', '#e000d2'].map(color => <IconButton
                key={color} label={color === 'transparent' ? 'Remove highlight' : `Highlight ${color}`}
                disabled={!canBasic} active={selectedHighlight.toLowerCase() === color}
                onClick={() => pickColor(color, 'highlight')}
              >{color === 'transparent' ? <CircleOff size={25} /> : <span className="sd-home-highlight-dot" style={{ backgroundColor: color }} />}</IconButton>)}
              <IconButton label="More highlight colors" onClick={() => setPage('highlight')}><MoreHorizontal size={22} /></IconButton>
            </div>
          </Section>

          <Section label="Paragraph">
            <div className="sd-home-toolbar-row sd-home-alignment-row">
              {[[AlignLeft, 'alignLeft', 'left'], [AlignCenter, 'alignCenter', 'center'], [AlignRight, 'alignRight', 'right'], [AlignJustify, 'justify', 'justify']].map(([Icon, id, alignment]) => <IconButton
                key={id} label={`Align ${alignment}`} active={state.alignment === alignment} disabled={!canBasic}
                onClick={() => command(id)}
              ><Icon size={22} /></IconButton>)}
              <IconButton label="Paragraph formatting" onClick={() => setAdvancedParagraph(value => !value)}><MoreHorizontal size={22} /></IconButton>
            </div>
            <button type="button" className="sd-home-menu-row" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => command('lineSpacing')}>
              <span><ArrowDownToLine size={20} /> Line Spacing</span><span>{Number(state.lineHeight || paragraphSpacing).toFixed(2)} <ChevronRight size={18} /></span>
            </button>
            <div className="sd-home-menu-row"><span>Paragraph Layout</span><button type="button" role="switch" aria-checked={Boolean(state.paragraphLayout)} className={`sd-home-switch ${state.paragraphLayout ? 'is-on' : ''}`} disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('paragraphLayout', !state.paragraphLayout)} /></div>
            <button type="button" className="sd-home-menu-row" onPointerDown={event => event.preventDefault()} onClick={() => setAdvancedParagraph(value => !value)}><span>Paragraph Formatting</span><ChevronRight size={19} /></button>
            {advancedParagraph ? <div className="sd-home-advanced-panel">
              {[["Left indent", 'indentLeft'], ["Right indent", 'indentRight'], ["Space before", 'spaceBefore'], ["Space after", 'spaceAfter']].map(([label, id]) => <label key={id} className="sd-home-advanced-input">{label}
                <input type="number" step="1" min={id.startsWith('indent') ? '-72' : '0'} max="144" value={Number(state[id] || 0)} disabled={!canBasic} onChange={event => command(id, Number(event.target.value))} />
              </label>)}
              <label className="sd-home-advanced-input">Exact line spacing
                <select value={paragraphSpacing} disabled={!canAdvanced} onChange={event => { const value = Number(event.target.value); setParagraphSpacing(value); advanced('lineSpacingExact', value) }}>
                  {[1, 1.15, 1.5, 1.65, 2].map(value => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
            </div> : null}
          </Section>

          <Section label="Numbering">
            <div className="sd-home-toolbar-row sd-home-numbering-row">
              <IconButton label="No list" disabled={!canAdvanced} onClick={() => advanced('listNone')}><CircleOff size={22} /></IconButton>
              <IconButton label="Bulleted list" disabled={!canBasic} onClick={() => command('bullets')}><List size={23} /></IconButton>
              <IconButton label="Multilevel list" disabled={!canAdvanced} onClick={() => advanced('multilevelList')}><List size={21} /></IconButton>
              <IconButton label="Numbered list" disabled={!canBasic} onClick={() => command('numbering')}><ListOrdered size={22} /></IconButton>
              <IconButton label="More numbering options" onClick={() => setAdvancedNumbering(value => !value)}><MoreHorizontal size={22} /></IconButton>
            </div>
            <div className="sd-home-two-buttons sd-home-numbering-actions">
              <button type="button" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => command('increaseIndent')}>Increase</button>
              <button type="button" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => command('decreaseIndent')}>Decrease</button>
              <button type="button" disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('renumber')}>Renumber</button>
              <button type="button" disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('continueNumbering')}>Continue</button>
            </div>
            <div className="sd-home-menu-row"><span><ListOrdered size={19} /> Auto Numbering</span><button type="button" role="switch" aria-checked={Boolean(state.autoNumbering)} className={`sd-home-switch ${state.autoNumbering ? 'is-on' : ''}`} disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('autoNumbering', !state.autoNumbering)} /></div>
            {advancedNumbering ? <div className="sd-home-advanced-panel">
              <button type="button" disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('numberingOptions')}>Numbering options <ChevronRight size={16} /></button>
            </div> : null}
          </Section>

          <Section label="Columns">
  <div className="sd-home-column-grid">
    {[[1, 'One'], [2, 'Two'], [3, 'Three'], ['left', 'Left'], ['right', 'Right']].map(([value, label]) => {
      const layout = typeof value === 'number'
        ? ['', 'one', 'two', 'three'][value]
        : value

      const current = state.columnLayout ||
        ['', 'one', 'two', 'three'][Number(state.columns) || 1]

      const selected = current === layout
      const unavailable = value === 'left' || value === 'right'

      return (
        <button
          type="button"
          key={label}
          disabled={!canAdvanced || unavailable}
          title={unavailable ? 'Unequal columns are not available yet' : label}
          className={selected ? 'is-selected' : ''}
          aria-pressed={selected}
          onPointerDown={event => event.preventDefault()}
          onClick={() => advanced('columnsLayout', value)}
        >
          <Columns3 size={21} strokeWidth={1.4} />
          <span>{label}</span>
        </button>
      )
    })}
  </div>
</Section>
        </> : colorPanel ? <>
          {!isHighlight ? <div className="sd-home-color-tabs" role="tablist" aria-label="Font color mode">
            {['solid', 'gradient', 'custom'].map(mode => <button type="button" role="tab" key={mode} aria-selected={fontMode === mode} className={fontMode === mode ? 'is-active' : ''} onClick={() => setFontMode(mode)}>{mode[0].toUpperCase() + mode.slice(1)}</button>)}
          </div> : null}

          {isHighlight || fontMode === 'solid' ? <>
            <h3 className="sd-home-section-label">{isHighlight ? 'Highlight Colors' : 'Solid Colors'}</h3>
            <Swatches colors={isHighlight ? HIGHLIGHT_COLORS : FONT_COLORS} selected={isHighlight ? selectedHighlight : selectedColor} kind={isHighlight ? 'highlight' : 'font'} disabled={!canBasic} onSelect={color => pickColor(color, isHighlight ? 'highlight' : 'color')} />
            {isHighlight ? <><h3 className="sd-home-section-label">Pastel Colors</h3><Swatches colors={PASTEL_COLORS} selected={selectedHighlight} kind="highlight" disabled={!canBasic} onSelect={color => pickColor(color, 'highlight')} /></> : <><h3 className="sd-home-section-label">Standard Colors</h3><Swatches colors={STANDARD_COLORS} selected={selectedColor} kind="font" disabled={!canBasic} onSelect={color => pickColor(color, 'color')} /></>}
            {recent.length > 0 ? <><h3 className="sd-home-section-label">Recent Colors</h3><Swatches colors={recent} selected={isHighlight ? selectedHighlight : selectedColor} kind={isHighlight ? 'highlight' : 'font'} disabled={!canBasic} onSelect={color => pickColor(color, isHighlight ? 'highlight' : 'color')} /></> : null}
            {favorites.length > 0 ? <><h3 className="sd-home-section-label">Favorite Colors</h3><Swatches colors={favorites} selected={isHighlight ? selectedHighlight : selectedColor} kind={isHighlight ? 'highlight' : 'font'} disabled={!canBasic} onSelect={color => pickColor(color, isHighlight ? 'highlight' : 'color')} /></> : null}
            <div className="sd-home-palette-actions">
              <button type="button" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => pickColor(
  isHighlight ? 'transparent' : (isHex(state.textColor) ? state.textColor : '#242139'),
  isHighlight ? 'highlight' : 'color'
)}><RotateCcw size={16} /> {isHighlight ? 'Clear Highlight' : 'Reset Color'}</button>
              <button type="button" disabled={isHighlight && !isHex(selectedHighlight)} onPointerDown={event => event.preventDefault()} onClick={() => toggleFavorite(isHighlight ? selectedHighlight : selectedColor)}><Star size={16} /> {favorites.includes((isHighlight ? selectedHighlight : selectedColor).toLowerCase()) ? 'Unfavorite' : 'Favorite'}</button>
            </div>
          </> : null}

          {!isHighlight && fontMode === 'custom' ? <div className="sd-home-gradient-panel">
            <label className="sd-home-custom-picker">Custom Color <input type="color" value={customColor} onChange={event => setCustomColor(event.target.value)} /></label>
            <div className="sd-home-preview-text" style={{ color: customColor }}>Aa សាកល្បងពណ៌</div>
            <button type="button" className="sd-home-apply" disabled={!canBasic} onPointerDown={event => event.preventDefault()} onClick={() => pickColor(customColor, 'color')}>Apply Custom Color</button>
            <button type="button" className="sd-home-favorite-action" onClick={() => toggleFavorite(customColor)}><Star size={16} /> {favorites.includes(customColor) ? 'Remove Favorite' : 'Save to Favorites'}</button>
          </div> : null}

          {!isHighlight && fontMode === 'gradient' ? <div className="sd-home-gradient-panel">
            <div className="sd-home-preview-text sd-home-gradient-preview" style={{ backgroundImage: gradientCSS }}>Aa សាកល្បងពណ៌</div>
            <div className="sd-home-options-row">{[2, 3].map(count => <button type="button" key={count} className={gradientStops === count ? 'is-selected' : ''} onClick={() => setGradientStops(count)}>{count} Colors</button>)}</div>
            {gradientColors.slice(0, gradientStops).map((color, index) => <label className="sd-home-gradient-color" key={index}>Color {index + 1}<input type="color" value={color} onChange={event => changeGradient(index, event.target.value)} /><span>{color.toUpperCase()}</span></label>)}
            <label className="sd-home-gradient-color">Direction
              <select value={gradientDirection} onChange={event => setGradientDirection(Number(event.target.value))}>{[0, 45, 90, 135, 180, 225, 270, 315].map(angle => <option value={angle} key={angle}>{angle}°</option>)}</select>
            </label>
            <button type="button" className="sd-home-apply" disabled={!canAdvanced} onPointerDown={event => event.preventDefault()} onClick={() => advanced('fontGradient', { colors: gradientColors.slice(0, gradientStops), direction: gradientDirection })}>Apply Gradient</button>
          <button
  type="button"
  className="sd-home-favorite-action"
  disabled={!canAdvanced}
  onPointerDown={event => event.preventDefault()}
  onClick={() => advanced('fontGradientReset')}
>
  <RotateCcw size={16} />
  Remove Gradient
</button>
          </div> : null}
        </> : null}
      </div>
    </section>
  </div>
}
