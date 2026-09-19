import { useEffect, useMemo, useState } from 'react'

export const STUDIO_PRESETS = [
  { id: 'basic', label: 'Basic Drawing', width: 1200, height: 800, resolution: 144 },
  { id: 'manga', label: 'Manga Page', width: 1600, height: 2263, resolution: 300 },
  { id: 'webtoon', label: 'Webtoon', width: 1080, height: 1920, resolution: 144 },
  { id: 'cover', label: 'Book Cover', width: 1600, height: 2560, resolution: 300 },
  { id: 'square', label: 'Square', width: 1080, height: 1080, resolution: 144 },
  { id: 'video', label: '16:9', width: 1920, height: 1080, resolution: 144 },
  { id: 'custom', label: 'Custom', width: 1200, height: 800, resolution: 144 },
]

const MAX_SIDE = 4096
const MAX_AREA = 12000000

export default function StudioNewFileDialog({
  open,
  defaultName,
  initialPreset = 'basic',
  onClose,
  onCreate,
}) {
  const preset =
    STUDIO_PRESETS.find((item) => item.id === initialPreset) ||
    STUDIO_PRESETS[0]

  const [name, setName] = useState(defaultName || 'Untitled-1')
  const [presetId, setPresetId] = useState(preset.id)
  const [width, setWidth] = useState(preset.width)
  const [height, setHeight] = useState(preset.height)
  const [resolution, setResolution] = useState(preset.resolution)
  const [backgroundType, setBackgroundType] = useState('white')
  const [customBackground, setCustomBackground] = useState('#FFFFFF')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    const nextPreset =
      STUDIO_PRESETS.find((item) => item.id === initialPreset) ||
      STUDIO_PRESETS[0]

    setName(defaultName || 'Untitled-1')
    setPresetId(nextPreset.id)
    setWidth(nextPreset.width)
    setHeight(nextPreset.height)
    setResolution(nextPreset.resolution)
    setBackgroundType('white')
    setCustomBackground('#FFFFFF')
    setError('')
  }, [open, defaultName, initialPreset])

  const background = useMemo(() => {
    if (backgroundType === 'black') return '#000000'
    if (backgroundType === 'gray') return '#E5E7EB'
    if (backgroundType === 'custom') return customBackground
    return '#FFFFFF'
  }, [backgroundType, customBackground])

  const estimatedMb = useMemo(() => {
    const pixels = Number(width || 0) * Number(height || 0)
    return Math.max(0, (pixels * 4) / 1024 / 1024).toFixed(1)
  }, [width, height])

  if (!open) return null

  function applyPreset(nextPresetId) {
    const nextPreset = STUDIO_PRESETS.find(
      (item) => item.id === nextPresetId
    )

    setPresetId(nextPresetId)

    if (!nextPreset || nextPresetId === 'custom') return

    setWidth(nextPreset.width)
    setHeight(nextPreset.height)
    setResolution(nextPreset.resolution)
  }

  function submit(event) {
    event.preventDefault()

    const cleanName = String(name || '').trim()
    const numericWidth = Math.round(Number(width))
    const numericHeight = Math.round(Number(height))
    const numericResolution = Math.round(Number(resolution))

    if (!cleanName) {
      setError('Name is required.')
      return
    }

    if (
      numericWidth < 64 ||
      numericHeight < 64 ||
      numericWidth > MAX_SIDE ||
      numericHeight > MAX_SIDE
    ) {
      setError('Width and height must be between 64 and 4096 pixels.')
      return
    }

    if (numericWidth * numericHeight > MAX_AREA) {
      setError('This canvas is too large. Keep it under 12 million pixels.')
      return
    }

    if (numericResolution < 72 || numericResolution > 600) {
      setError('Resolution must be between 72 and 600 PPI.')
      return
    }

    onCreate({
      name: cleanName.slice(0, 80),
      width: numericWidth,
      height: numericHeight,
      resolution: numericResolution,
      background,
      presetId,
    })
  }

  return (
    <div className="ss-dialog-backdrop">
      <form className="ss-new-dialog" onSubmit={submit}>
        <div className="ss-dialog-head">
          <div>
            <h2>New File</h2>
            <p>Create a new paper without closing your current work.</p>
          </div>

          <button
            type="button"
            className="ss-dialog-x"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="ss-dialog-body">
          <label className="ss-field ss-field-wide">
            <span>Name</span>
            <input
              value={name}
              maxLength={80}
              autoFocus
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="ss-field ss-field-wide">
            <span>Preset</span>
            <select
              value={presetId}
              onChange={(event) => applyPreset(event.target.value)}
            >
              {STUDIO_PRESETS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="ss-field">
            <span>Width</span>
            <div className="ss-input-unit">
              <input
                type="number"
                min="64"
                max="4096"
                value={width}
                onChange={(event) => {
                  setWidth(event.target.value)
                  setPresetId('custom')
                }}
              />
              <b>px</b>
            </div>
          </label>

          <label className="ss-field">
            <span>Height</span>
            <div className="ss-input-unit">
              <input
                type="number"
                min="64"
                max="4096"
                value={height}
                onChange={(event) => {
                  setHeight(event.target.value)
                  setPresetId('custom')
                }}
              />
              <b>px</b>
            </div>
          </label>

          <label className="ss-field">
            <span>Resolution</span>
            <div className="ss-input-unit">
              <input
                type="number"
                min="72"
                max="600"
                value={resolution}
                onChange={(event) =>
                  setResolution(event.target.value)
                }
              />
              <b>PPI</b>
            </div>
          </label>

          <label className="ss-field">
            <span>Color Mode</span>
            <input value="RGB Color · 8 bit" disabled />
          </label>

          <label className="ss-field ss-field-wide">
            <span>Background</span>
            <div className="ss-background-row">
              <select
                value={backgroundType}
                onChange={(event) =>
                  setBackgroundType(event.target.value)
                }
              >
                <option value="white">White</option>
                <option value="gray">Light Gray</option>
                <option value="black">Black</option>
                <option value="custom">Custom Color</option>
              </select>

              <input
                type="color"
                value={customBackground}
                disabled={backgroundType !== 'custom'}
                onChange={(event) =>
                  setCustomBackground(event.target.value)
                }
              />

              <span
                className="ss-background-preview"
                style={{ background }}
              />
            </div>
          </label>

          <div className="ss-dialog-info ss-field-wide">
            <span>
              {Number(width || 0).toLocaleString()} ×{' '}
              {Number(height || 0).toLocaleString()} px
            </span>
            <span>{resolution} PPI</span>
            <span>≈ {estimatedMb} MB raw canvas</span>
          </div>

          {error ? (
            <div className="ss-dialog-error ss-field-wide">
              {error}
            </div>
          ) : null}
        </div>

        <div className="ss-dialog-actions">
          <button
            type="button"
            className="ss-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="ss-btn primary"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
