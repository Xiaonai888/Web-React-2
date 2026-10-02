import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'shadow-studio-mobile-palettes-v1'
const RECENTS_KEY = 'shadow-studio-color-recent-v1'
const PAGE_SIZE = 24
const PAGE_COUNT = 3
const TOTAL_SLOTS = PAGE_SIZE * PAGE_COUNT

const DEFAULT_COLORS = [
  '#FFFFFF', '#FF2D2D', '#FF7A1A', '#FFB83E', '#F1F43A', '#87F12A',
  '#00EE40', '#11D8B4', '#17D8EE', '#1496F2', '#1459F2', '#651FEF',
  '#DC13D9', '#EB168C', '#F06DA5', '#FFF6DE', '#F9E9BA', '#F7C99D',
  '#C88A64',
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0))

function normalizeHex(value) {
  const text = String(value || '').trim().toUpperCase()
  const source = text.startsWith('#') ? text : `#${text}`

  if (/^#[\dA-F]{6}$/.test(source)) return source

  if (/^#[\dA-F]{3}$/.test(source)) {
    return `#${source[1]}${source[1]}${source[2]}${source[2]}${source[3]}${source[3]}`
  }

  return null
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `palette-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function makeSlots(colors = []) {
  return Array.from({ length: TOTAL_SLOTS }, (_, index) => normalizeHex(colors[index]) || null)
}

function defaultPalette() {
  return {
    id: 'shadow-default-palette',
    name: 'My Palette 1',
    colors: makeSlots(DEFAULT_COLORS),
  }
}

function normalizePalette(item, index) {
  if (!item || typeof item !== 'object') return null

  return {
    id: String(item.id || makeId()),
    name: String(item.name || `My Palette ${index + 1}`).trim().slice(0, 40) || `My Palette ${index + 1}`,
    colors: makeSlots(Array.isArray(item.colors) ? item.colors : []),
  }
}

function readPalettes() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')

    if (!stored || !Array.isArray(stored.palettes) || !stored.palettes.length) {
      return {
        palettes: [defaultPalette()],
        activeId: 'shadow-default-palette',
      }
    }

    const palettes = stored.palettes
      .map(normalizePalette)
      .filter(Boolean)

    if (!palettes.length) {
      return {
        palettes: [defaultPalette()],
        activeId: 'shadow-default-palette',
      }
    }

    const activeId = palettes.some((item) => item.id === stored.activeId)
      ? stored.activeId
      : palettes[0].id

    return { palettes, activeId }
  } catch {
    return {
      palettes: [defaultPalette()],
      activeId: 'shadow-default-palette',
    }
  }
}

function readRecents() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENTS_KEY) || '[]')

    if (!Array.isArray(stored)) return []

    return [...new Set(stored.map(normalizeHex).filter(Boolean))].slice(0, 6)
  } catch {
    return []
  }
}

function safeFileName(value) {
  return String(value || 'palette')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 60) || 'palette'
}

export default function StudioMobileColorPalette({
  open = true,
  color = '#111111',
  opacity = 100,
  disabled = false,
  onChange,
  onOpacityChange,
  onModeChange,
}) {
  const initialStore = useMemo(() => readPalettes(), [])
  const [palettes, setPalettes] = useState(initialStore.palettes)
  const [activePaletteId, setActivePaletteId] = useState(initialStore.activeId)
  const [page, setPage] = useState(0)
  const [expanded, setExpanded] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [previousColor, setPreviousColor] = useState('#111111')
  const [recents, setRecents] = useState(() => readRecents())
  const importRef = useRef(null)

  const normalizedColor = normalizeHex(color) || '#111111'
  const safeOpacity = clamp(Math.round(opacity), 0, 100)
  const activePalette = palettes.find((item) => item.id === activePaletteId) || palettes[0]
  const pageStart = page * PAGE_SIZE
  const pageColors = activePalette.colors.slice(pageStart, pageStart + PAGE_SIZE)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        activeId: activePaletteId,
        palettes,
      }))
    } catch {
      return
    }
  }, [palettes, activePaletteId])

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENTS_KEY, JSON.stringify(recents))
    } catch {
      return
    }
  }, [recents])

  function rememberColor(nextColor) {
    const next = normalizeHex(nextColor)
    if (!next) return

    setRecents((current) => [
      next,
      ...current.filter((item) => item !== next),
    ].slice(0, 6))
  }

  function chooseColor(nextColor) {
    const next = normalizeHex(nextColor)
    if (!next || disabled) return

    if (next !== normalizedColor) {
      setPreviousColor(normalizedColor)
    }

    onChange?.(next)
    rememberColor(next)
  }

  function updateActivePalette(updater) {
    setPalettes((current) => current.map((palette) => {
      if (palette.id !== activePaletteId) return palette
      return updater(palette)
    }))
  }

  function saveCurrentColor(slotIndex) {
    if (disabled) return

    const absoluteIndex = pageStart + slotIndex

    updateActivePalette((palette) => {
      const colors = [...palette.colors]
      colors[absoluteIndex] = normalizedColor
      return { ...palette, colors }
    })

    rememberColor(normalizedColor)
  }

  function createPalette() {
    const proposed = window.prompt('Palette name', `My Palette ${palettes.length + 1}`)
    if (proposed === null) return

    const name = proposed.trim().slice(0, 40)
    if (!name) return

    const next = {
      id: makeId(),
      name,
      colors: makeSlots(),
    }

    setPalettes((current) => [...current, next])
    setActivePaletteId(next.id)
    setPage(0)
    setMenuOpen(false)
  }

  function renamePalette() {
    const proposed = window.prompt('Rename palette', activePalette.name)
    if (proposed === null) return

    const name = proposed.trim().slice(0, 40)
    if (!name) return

    updateActivePalette((palette) => ({ ...palette, name }))
    setMenuOpen(false)
  }

  function duplicatePalette() {
    const copy = {
      id: makeId(),
      name: `${activePalette.name} Copy`.slice(0, 40),
      colors: [...activePalette.colors],
    }

    setPalettes((current) => [...current, copy])
    setActivePaletteId(copy.id)
    setPage(0)
    setMenuOpen(false)
  }

  function removeEmptySlots() {
    updateActivePalette((palette) => {
      const compact = palette.colors.filter(Boolean)
      return {
        ...palette,
        colors: makeSlots(compact),
      }
    })

    setPage(0)
    setMenuOpen(false)
  }

  function deletePalette() {
    if (palettes.length <= 1) return

    const accepted = window.confirm(`Delete "${activePalette.name}"?`)
    if (!accepted) return

    const remaining = palettes.filter((item) => item.id !== activePaletteId)
    setPalettes(remaining)
    setActivePaletteId(remaining[0].id)
    setPage(0)
    setMenuOpen(false)
  }

  function exportPalette() {
    const payload = {
      type: 'shadow-studio-palette',
      version: 1,
      name: activePalette.name,
      colors: activePalette.colors,
    }

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: 'application/json' },
    )

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = `${safeFileName(activePalette.name)}.shadowpalette.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setMenuOpen(false)
  }

  async function importPalette(event) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    try {
      const raw = await file.text()
      const parsed = JSON.parse(raw)
      const source = Array.isArray(parsed)
        ? { name: file.name.replace(/\.[^.]+$/, ''), colors: parsed }
        : parsed

      if (!Array.isArray(source?.colors)) {
        throw new Error('Invalid palette')
      }

      const colors = source.colors
        .map(normalizeHex)
        .filter(Boolean)

      if (!colors.length) {
        throw new Error('Palette has no colors')
      }

      const imported = {
        id: makeId(),
        name: String(source.name || file.name.replace(/\.[^.]+$/, '') || 'Imported Palette')
          .trim()
          .slice(0, 40) || 'Imported Palette',
        colors: makeSlots(colors),
      }

      setPalettes((current) => [...current, imported])
      setActivePaletteId(imported.id)
      setPage(0)
      setMenuOpen(false)
    } catch {
      window.alert('This palette file cannot be imported.')
    }
  }

  function adjustOpacity(direction) {
    onOpacityChange?.(clamp(safeOpacity + direction, 0, 100))
  }

  if (!open || !activePalette) return null

  return (
    <section className="ss-mobile-palette" aria-label="Palette color picker">
      <style>{`
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette{
          position:fixed;
          z-index:88;
          left:8px;
          right:8px;
          bottom:calc(66px + env(safe-area-inset-bottom));
          max-height:calc(100dvh - 82px);
          overflow-y:auto;
          box-sizing:border-box;
          border:1px solid rgba(145,158,170,.68);
          border-radius:16px;
          background:rgba(28,34,40,.86);
          color:#f4f7fb;
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          overscroll-behavior:contain
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette *{
          box-sizing:border-box
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-header{
          min-height:48px;
          display:flex;
          align-items:center;
          gap:10px;
          padding:7px 12px;
          border-bottom:1px solid rgba(112,124,136,.28)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-header strong{
          flex:1;
          font-size:16px;
          font-weight:850
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-preview{
          width:96px;
          height:32px;
          display:grid;
          grid-template-columns:1fr 1fr;
          overflow:hidden;
          border-radius:7px;
          background:#111
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-preview span{
          display:block;
          width:100%;
          height:100%
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-bar{
          position:sticky;
          top:0;
          z-index:4;
          min-height:44px;
          display:grid;
          grid-template-columns:36px minmax(0,1fr) auto 38px;
          align-items:center;
          border-bottom:1px solid rgba(86,98,109,.28);
          background:rgba(10,14,18,.91)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-collapse,
        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu-button{
          width:36px;
          height:38px;
          display:grid;
          place-items:center;
          border:0;
          background:transparent;
          color:#fff;
          padding:0;
          font-size:17px;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-title{
          overflow:hidden;
          color:#f5f7fa;
          font-size:14px;
          font-weight:820;
          text-overflow:ellipsis;
          white-space:nowrap
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-select{
          max-width:130px;
          height:29px;
          border:0;
          border-radius:15px;
          outline:none;
          background:#20272e;
          color:#eef3f7;
          padding:0 28px 0 10px;
          font:750 10px Inter,system-ui,sans-serif;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu-wrap{
          position:relative
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu{
          position:absolute;
          z-index:9;
          top:40px;
          right:6px;
          width:min(78vw,260px);
          overflow:hidden;
          border:1px solid rgba(135,147,158,.66);
          border-radius:11px;
          background:rgba(32,38,44,.96)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu button{
          width:100%;
          min-height:39px;
          display:flex;
          align-items:center;
          gap:10px;
          border:0;
          border-bottom:1px solid rgba(111,122,133,.24);
          background:transparent;
          color:#f0f4f7;
          padding:0 12px;
          font:700 10px Inter,system-ui,sans-serif;
          text-align:left;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu button:last-child{
          border-bottom:0
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu button:disabled{
          opacity:.35
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-menu .danger{
          color:#ff8383
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-body{
          padding:10px 10px 0
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-grid{
          display:grid;
          grid-template-columns:repeat(6,minmax(0,1fr));
          gap:6px
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-slot{
          width:100%;
          aspect-ratio:1;
          display:grid;
          place-items:center;
          border:0;
          border-radius:6px;
          background:#151a1f;
          padding:0;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-slot.filled{
          background:var(--ss-mobile-palette-slot-color)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-slot.active{
          outline:2px solid #4ca8ff;
          outline-offset:2px
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-slot.empty{
          border:1px dashed #5a6874;
          background:rgba(17,22,27,.5);
          color:#c7d1d9;
          font-size:20px;
          font-weight:500
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-pages{
          min-height:28px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:12px
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-page{
          width:8px;
          height:8px;
          border:0;
          border-radius:50%;
          background:#59636d;
          padding:0;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-page.active{
          background:#1da2ff
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-section{
          padding:9px 0;
          border-top:1px solid rgba(105,117,128,.25)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-section-title{
          margin-bottom:7px;
          color:#e9eef2;
          font-size:10px;
          font-weight:800
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-recents{
          display:grid;
          grid-template-columns:repeat(6,minmax(0,1fr));
          gap:8px
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-recent{
          width:100%;
          aspect-ratio:1;
          border:0;
          border-radius:50%;
          background:var(--ss-mobile-palette-recent-color);
          padding:0;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-recent.empty{
          display:grid;
          place-items:center;
          border:1px dashed #60707d;
          background:transparent;
          color:#c6d0d8;
          font-size:18px
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-opacity{
          min-height:48px;
          display:grid;
          grid-template-columns:48px 34px minmax(0,1fr) 34px;
          gap:7px;
          align-items:center;
          padding:8px 10px;
          border-top:1px solid rgba(104,116,127,.28)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-opacity-value{
          color:#f2f5f7;
          font-size:12px;
          font-variant-numeric:tabular-nums
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-step{
          width:32px;
          height:32px;
          display:grid;
          place-items:center;
          border:0;
          border-radius:50%;
          background:#07090c;
          color:#fff;
          padding:0;
          font:850 21px/1 Inter,system-ui,sans-serif;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-step:disabled{
          opacity:.35
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-opacity-track{
          position:relative;
          min-width:0;
          height:30px;
          display:flex;
          align-items:center
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-checker{
          position:absolute;
          left:1px;
          right:1px;
          height:11px;
          border-radius:6px;
          background-color:#fff;
          background-image:
            linear-gradient(45deg,#c9c9c9 25%,transparent 25%),
            linear-gradient(-45deg,#c9c9c9 25%,transparent 25%),
            linear-gradient(45deg,transparent 75%,#c9c9c9 75%),
            linear-gradient(-45deg,transparent 75%,#c9c9c9 75%);
          background-size:10px 10px;
          background-position:0 0,0 5px,5px -5px,-5px 0;
          pointer-events:none
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-opacity-track input{
          position:relative;
          z-index:1;
          width:100%;
          min-width:0;
          margin:0;
          accent-color:#fff
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-tabs{
          min-height:54px;
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          overflow:hidden;
          border-top:1px solid rgba(91,103,114,.34);
          background:rgba(9,13,17,.86)
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-tabs button{
          min-width:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:3px;
          border:0;
          border-right:1px solid rgba(85,98,111,.32);
          background:transparent;
          color:#eef2f5;
          padding:5px 2px;
          font:750 9px Inter,system-ui,sans-serif;
          cursor:pointer
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-tabs button:last-child{
          border-right:0
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-tabs button.active{
          background:rgba(17,82,132,.82);
          color:#40b0ff
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-tabs i{
          font-size:17px
        }

        .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-import{
          display:none
        }

        @media(max-width:380px){
          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette{
            left:6px;
            right:6px;
            bottom:calc(64px + env(safe-area-inset-bottom))
          }

          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-grid{
            gap:5px
          }

          .shadow-studio.ss-mobile-workspace-mode .ss-mobile-palette-select{
            max-width:112px
          }
        }
      `}</style>

      <header className="ss-mobile-palette-header">
        <strong>Color</strong>

        <div className="ss-mobile-palette-preview" aria-label="Previous and current color">
          <span style={{ backgroundColor: previousColor }} />
          <span style={{ backgroundColor: normalizedColor }} />
        </div>
      </header>

      <div className="ss-mobile-palette-bar">
        <button
          type="button"
          className="ss-mobile-palette-collapse"
          aria-label={expanded ? 'Hide palette' : 'Show palette'}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <i
            className={`fa-solid ${expanded ? 'fa-chevron-down' : 'fa-chevron-right'}`}
            aria-hidden="true"
          />
        </button>

        <div className="ss-mobile-palette-title">Palette</div>

        <select
          className="ss-mobile-palette-select"
          value={activePaletteId}
          disabled={disabled}
          aria-label="Select palette"
          onChange={(event) => {
            setActivePaletteId(event.target.value)
            setPage(0)
            setMenuOpen(false)
          }}
        >
          {palettes.map((palette) => (
            <option value={palette.id} key={palette.id}>
              {palette.name}
            </option>
          ))}
        </select>

        <div className="ss-mobile-palette-menu-wrap">
          <button
            type="button"
            className="ss-mobile-palette-menu-button"
            aria-label="Palette menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div className="ss-mobile-palette-menu" role="menu">
              <button type="button" onClick={createPalette}>
                <i className="fa-solid fa-plus" aria-hidden="true" />
                New Palette
              </button>

              <button type="button" onClick={renamePalette}>
                <i className="fa-solid fa-pen" aria-hidden="true" />
                Rename Palette
              </button>

              <button type="button" onClick={duplicatePalette}>
                <i className="fa-regular fa-copy" aria-hidden="true" />
                Duplicate Palette
              </button>

              <button
                type="button"
                onClick={() => {
                  importRef.current?.click()
                }}
              >
                <i className="fa-solid fa-file-import" aria-hidden="true" />
                Import Palette
              </button>

              <button type="button" onClick={exportPalette}>
                <i className="fa-solid fa-file-export" aria-hidden="true" />
                Export Palette
              </button>

              <button type="button" onClick={removeEmptySlots}>
                <i className="fa-solid fa-compress" aria-hidden="true" />
                Remove Empty Slots
              </button>

              <button
                type="button"
                className="danger"
                disabled={palettes.length <= 1}
                onClick={deletePalette}
              >
                <i className="fa-regular fa-trash-can" aria-hidden="true" />
                Delete Palette
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <input
        ref={importRef}
        className="ss-mobile-palette-import"
        type="file"
        accept=".json,.shadowpalette,application/json"
        onChange={importPalette}
      />

      {expanded ? (
        <div className="ss-mobile-palette-body">
          <div className="ss-mobile-palette-grid">
            {pageColors.map((slotColor, index) => (
              slotColor ? (
                <button
                  type="button"
                  key={`${page}-${index}`}
                  className={`ss-mobile-palette-slot filled ${slotColor === normalizedColor ? 'active' : ''}`}
                  style={{ '--ss-mobile-palette-slot-color': slotColor }}
                  aria-label={`Use color ${slotColor}`}
                  disabled={disabled}
                  onClick={() => chooseColor(slotColor)}
                />
              ) : (
                <button
                  type="button"
                  key={`${page}-${index}`}
                  className="ss-mobile-palette-slot empty"
                  aria-label={`Save current color to slot ${pageStart + index + 1}`}
                  disabled={disabled}
                  onClick={() => saveCurrentColor(index)}
                >
                  +
                </button>
              )
            ))}
          </div>

          <div className="ss-mobile-palette-pages" aria-label="Palette pages">
            {Array.from({ length: PAGE_COUNT }, (_, index) => (
              <button
                type="button"
                key={index}
                className={`ss-mobile-palette-page ${page === index ? 'active' : ''}`}
                aria-label={`Palette page ${index + 1}`}
                aria-current={page === index ? 'page' : undefined}
                onClick={() => setPage(index)}
              />
            ))}
          </div>

          <div className="ss-mobile-palette-section">
            <div className="ss-mobile-palette-section-title">Recent Colors</div>

            <div className="ss-mobile-palette-recents">
              {Array.from({ length: 6 }, (_, index) => {
                const recent = recents[index]

                return recent ? (
                  <button
                    type="button"
                    key={`${recent}-${index}`}
                    className="ss-mobile-palette-recent"
                    style={{ '--ss-mobile-palette-recent-color': recent }}
                    aria-label={`Use recent color ${recent}`}
                    disabled={disabled}
                    onClick={() => chooseColor(recent)}
                  />
                ) : (
                  <span
                    key={`empty-${index}`}
                    className="ss-mobile-palette-recent empty"
                    aria-hidden="true"
                  >
                    {index === recents.length ? '+' : ''}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="ss-mobile-palette-opacity">
        <output className="ss-mobile-palette-opacity-value">{safeOpacity}%</output>

        <button
          type="button"
          className="ss-mobile-palette-step"
          disabled={disabled || safeOpacity <= 0}
          aria-label="Opacity decrease"
          onClick={() => adjustOpacity(-1)}
        >
          −
        </button>

        <div className="ss-mobile-palette-opacity-track">
          <span className="ss-mobile-palette-checker" aria-hidden="true" />

          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={safeOpacity}
            disabled={disabled}
            aria-label="Opacity"
            onChange={(event) => onOpacityChange?.(Number(event.target.value))}
          />
        </div>

        <button
          type="button"
          className="ss-mobile-palette-step"
          disabled={disabled || safeOpacity >= 100}
          aria-label="Opacity increase"
          onClick={() => adjustOpacity(1)}
        >
          +
        </button>
      </div>

      <nav className="ss-mobile-palette-tabs" aria-label="Color mode">
        <button
          type="button"
          className="active"
          aria-current="page"
          aria-label="Palette"
        >
          <i className="fa-solid fa-table-cells-large" aria-hidden="true" />
          <span>Palette</span>
        </button>

        <button
          type="button"
          aria-label="RGB"
          onClick={() => onModeChange?.('rgb')}
        >
          <i className="fa-solid fa-circle-nodes" aria-hidden="true" />
          <span>RGB</span>
        </button>

        <button
          type="button"
          aria-label="HSB"
          onClick={() => onModeChange?.('hsb')}
        >
          <i className="fa-solid fa-circle-notch" aria-hidden="true" />
          <span>HSB</span>
        </button>
      </nav>
    </section>
  )
}
