import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIButtonRow,
  StudioUIColor,
  StudioUIDialog,
  StudioUINumber,
  StudioUISection,
  StudioUISelect,
  StudioUISlider,
  StudioUIToggle,
} from './StudioUIControls'
import StudioUIAngleDial from './StudioUIAngleDial'

const NAMES = {
  transform: ['Transform', 'បម្លែងរូបភាព'], perspective: ['Perspective', 'ទិដ្ឋភាពបីវិមាត្រ'], crop: ['Crop', 'កាត់ទំហំក្រដាស'],
  canvas: ['Canvas size', 'ទំហំផ្ទាំងគំនូរ'], ruler: ['Ruler guide', 'បន្ទាត់ណែនាំ'], balloon: ['Speech balloon', 'ពពុះសន្ទនា'],
  frame: ['Comic frame', 'ស៊ុម Manga'], filter: ['Filter / FX', 'តម្រងរូបភាព'], special: ['Special Brush', 'ជក់ពិសេស'], divider: ['Frame Divider', 'បែងចែកស៊ុម Manga'],
}

const FIELD_NAMES = {
  x: ['Left', 'ខាងឆ្វេង'], y: ['Top', 'ខាងលើ'], width: ['Width', 'ទទឹង'], height: ['Height', 'កម្ពស់'],
  offsetX: ['Horizontal offset', 'រំកិលផ្ដេក'], offsetY: ['Vertical offset', 'រំកិលបញ្ឈរ'],
  translateX: ['Move X', 'ផ្លាស់ទី X'], translateY: ['Move Y', 'ផ្លាស់ទី Y'],
  scaleX: ['Scale X', 'ពង្រីក X'], scaleY: ['Scale Y', 'ពង្រីក Y'], rotate: ['Rotation (°)', 'មុំបង្វិល (°)'],
  angle: ['Angle (°)', 'មុំ (°)'], axis: ['Direction', 'ទិសដៅ'], position: ['Position', 'ទីតាំង'],
  border: ['Border (px)', 'កម្រាស់ស៊ុម'], ink: ['Line color', 'ពណ៌បន្ទាត់'], fill: ['Fill', 'ពណ៌ផ្ទៃ'],
  shape: ['Shape', 'រូបរាង'], tail: ['Tail', 'កន្ទុយ'], text: ['Dialogue', 'អត្ថបទសន្ទនា'],
  fontSize: ['Text size', 'ទំហំអក្សរ'], textColor: ['Text color', 'ពណ៌អក្សរ'],
  font: ['Font', 'ពុម្ពអក្សរ'], bold: ['Bold', 'អក្សរដិត'], italic: ['Italic', 'អក្សរទ្រេត'],
  align: ['Text alignment', 'តម្រឹមអក្សរ'], opacity: ['Opacity (%)', 'ភាពស្រអាប់ (%)'],
  corner0x: ['Top-left X', 'ជ្រុងឆ្វេងលើ X'], corner0y: ['Top-left Y', 'ជ្រុងឆ្វេងលើ Y'],
  corner1x: ['Top-right X', 'ជ្រុងស្ដាំលើ X'], corner1y: ['Top-right Y', 'ជ្រុងស្ដាំលើ Y'],
  corner2x: ['Bottom-right X', 'ជ្រុងស្ដាំក្រោម X'], corner2y: ['Bottom-right Y', 'ជ្រុងស្ដាំក្រោម Y'],
  corner3x: ['Bottom-left X', 'ជ្រុងឆ្វេងក្រោម X'], corner3y: ['Bottom-left Y', 'ជ្រុងឆ្វេងក្រោម Y'],
  type: ['Filter type', 'ប្រភេទតម្រង'], amount: ['Amount (%)', 'កម្រិត (%)'], adjustment: ['Adjustment (-100 to 100)', 'កែតម្រូវ (-100 ដល់ 100)'],
  mode: ['Special brush type', 'ប្រភេទជក់ពិសេស'], orientation: ['Divider direction', 'ទិសដៅបែងចែក'], gutter: ['Gap (px)', 'ចន្លោះ (px)'], background: ['Gap color', 'ពណ៌ចន្លោះ'],
}

const SCHEMAS = {
  transform: ['translateX', 'translateY', 'scaleX', 'scaleY', 'rotate'],
  perspective: ['corner0x', 'corner0y', 'corner1x', 'corner1y', 'corner2x', 'corner2y', 'corner3x', 'corner3y'],
  crop: ['x', 'y', 'width', 'height'],
  canvas: ['width', 'height', 'offsetX', 'offsetY'],
  ruler: ['axis', 'position', 'angle'],
  frame: ['x', 'y', 'width', 'height', 'border', 'ink', 'fill'],
  balloon: ['text', 'shape', 'tail', 'width', 'height', 'fontSize', 'font', 'bold', 'italic', 'align', 'fill', 'ink', 'textColor', 'opacity'],
  filter: ['type', 'amount', 'adjustment'],
  special: ['mode'],
  divider: ['orientation', 'position', 'gutter', 'border', 'ink', 'background', 'opacity'],
}

const CHOICES = {
  axis: [['vertical', 'Vertical', 'បញ្ឈរ'], ['horizontal', 'Horizontal', 'ផ្ដេក'], ['angled', 'Angled', 'មុំ']],
  shape: [['ellipse', 'Ellipse', 'ពងក្រពើ'], ['rounded', 'Rounded', 'ជ្រុងមូល'], ['thought', 'Thought', 'គំនិត'], ['shout', 'Shout', 'ស្រែក']],
  tail: [['none', 'None', 'គ្មាន'], ['bottom', 'Bottom', 'ក្រោម'], ['top', 'Top', 'លើ'], ['left', 'Left', 'ឆ្វេង'], ['right', 'Right', 'ស្ដាំ']],
  font: [['sans', 'Sans', 'ធម្មតា'], ['serif', 'Serif', 'ស៊េរីហ្វ'], ['mono', 'Mono', 'ម៉ូណូ']],
  align: [['left', 'Left', 'ឆ្វេង'], ['center', 'Center', 'កណ្ដាល'], ['right', 'Right', 'ស្ដាំ']],
  fill: [['transparent', 'Transparent', 'ថ្លា'], ['#FFFFFF', 'White', 'ស']],
  type: [['grayscale', 'Grayscale', 'ខ្មៅស'], ['sepia', 'Sepia', 'សេពីយ៉ា'], ['invert', 'Invert', 'បញ្ច្រាសពណ៌'], ['brightness', 'Brightness', 'ពន្លឺ'], ['contrast', 'Contrast', 'កម្រិតខុសគ្នា'], ['threshold', 'Threshold', 'ខ្មៅសខ្លាំង']],
  mode: [['sparkle', 'Sparkle', 'ចាំងផ្កាយ'], ['star', 'Star', 'ផ្កាយ'], ['glow', 'Glow', 'ពន្លឺទន់']],
  orientation: [['vertical', 'Vertical', 'បញ្ឈរ'], ['horizontal', 'Horizontal', 'ផ្ដេក']],
  background: [['transparent', 'Transparent', 'ថ្លា'], ['#FFFFFF', 'White', 'ស'], ['#000000', 'Black', 'ខ្មៅ']],
}

const SLIDERS = {
  amount: [0, 100, 1, '%'],
  adjustment: [-100, 100, 1, ''],
  opacity: [0, 100, 1, '%'],
}

export default function StudioAdvancedToolPanel({ editor, onClose, onApply, onClearGuides }) {
  const { language } = useDisplayTranslation()
  const km = language === 'km'
  const [values, setValues] = useState(() => ({ ...editor?.values }))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editor) return
    setValues({ ...editor.values })
    setError('')
    setBusy(false)
  }, [editor])

  useEffect(() => {
    if (!editor) return undefined
    const keydown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      if (!busy) onClose?.()
    }
    window.addEventListener('keydown', keydown, true)
    return () => window.removeEventListener('keydown', keydown, true)
  }, [editor, busy, onClose])

  if (!editor) return null

  const title = NAMES[editor.type] || [editor.type, editor.type]
  const update = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }))
    setError('')
  }

  function labelFor(key) {
    if (editor.type === 'divider' && key === 'position') return km ? 'ទីតាំងបែងចែក (0–1)' : 'Divider position (0–1)'
    return FIELD_NAMES[key]?.[km ? 1 : 0] || key
  }

  function field(key) {
    const label = labelFor(key)
    const value = values[key]

    if (key === 'text') {
      return <label className="ss-advanced-ui-text" key={key}><span>{label}</span><textarea rows={4} maxLength={1200} value={value ?? ''} disabled={busy} onChange={(event) => update(key, event.target.value)} /></label>
    }

    if (typeof value === 'boolean') {
      return <StudioUIToggle key={key} label={label} checked={value} disabled={busy} onChange={(next) => update(key, next)} />
    }

    if (CHOICES[key]) {
      return <StudioUISelect
        key={key}
        label={label}
        value={value}
        disabled={busy}
        options={CHOICES[key].map(([id, en, kh]) => ({ value: id, label: km ? kh : en }))}
        onChange={(next) => update(key, next)}
      />
    }

    if (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) {
      return <StudioUIColor key={key} label={label} value={value} disabled={busy} onChange={(next) => {
        if (/^#[0-9a-f]{6}$/i.test(next)) update(key, next)
      }} />
    }

    if (key === 'rotate' || key === 'angle') {
      return <div className="ss-advanced-ui-angle" key={key}><StudioUIAngleDial label={label} value={Number(value) || 0} disabled={busy} onChange={(next) => update(key, next)} /></div>
    }

    if (SLIDERS[key]) {
      const [min, max, step, suffix] = SLIDERS[key]
      return <StudioUISlider key={key} label={label} value={Number(value) || 0} min={min} max={max} step={step} suffix={suffix} disabled={busy} onChange={(next) => update(key, next)} />
    }

    const fractional = ['scaleX', 'scaleY'].includes(key) || (editor.type === 'divider' && key === 'position')
    return <StudioUINumber key={key} label={label} value={value ?? 0} step={fractional ? 0.05 : 1} disabled={busy} onChange={(next) => update(key, next)} />
  }

  async function submit() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      if (await onApply(editor, values) !== false) onClose?.()
    } catch (reason) {
      setError(reason?.message || (km ? 'មិនអាចអនុវត្តបាន។' : 'Could not apply this tool.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <style>{`
        .ss-advanced-ui-dialog .ss-ui-dialog-content{padding:13px}
        .ss-advanced-ui-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .ss-advanced-ui-fields>.ss-ui-section{grid-column:1/-1}
        .ss-advanced-ui-fields .ss-ui-field,.ss-advanced-ui-fields .ss-ui-toggle-row{grid-template-columns:minmax(105px,.9fr) minmax(120px,1.1fr)}
        .ss-advanced-ui-text{grid-column:1/-1;display:grid;gap:6px;color:#edf3fa;font-size:10px;font-weight:700}
        .ss-advanced-ui-text textarea{width:100%;min-height:90px;padding:9px;border:1px solid #4b5968;border-radius:6px;outline:none;resize:vertical;background:#202832;color:#edf3fa;font:11px Inter,system-ui,sans-serif;line-height:1.45}
        .ss-advanced-ui-text textarea:focus{border-color:#5faeff;box-shadow:0 0 0 2px #5faeff26}
        .ss-advanced-ui-angle{display:flex;align-items:center;min-height:100px;padding:8px;border:1px solid #3b4651;border-radius:8px;background:#242c34}
        .ss-advanced-ui-note{margin:0 0 11px;padding:8px 10px;border:1px solid #3b4651;border-radius:6px;background:#242c34;color:#aab8c6;font-size:10px;line-height:1.45}
        .ss-advanced-ui-error{margin:10px 0 0;padding:8px 10px;border:1px solid #8e4750;border-radius:6px;background:#4b2b31;color:#ffd5d8;font-size:10px}
        @media(max-width:560px){.ss-advanced-ui-fields{grid-template-columns:1fr}.ss-advanced-ui-fields .ss-ui-field,.ss-advanced-ui-fields .ss-ui-toggle-row{grid-template-columns:1fr;gap:6px}}
      `}</style>
      <StudioUIDialog
        open={Boolean(editor)}
        title={title[km ? 1 : 0]}
        subtitle={km ? 'កំណត់ Tool មុនអនុវត្ត' : 'Review tool settings before applying'}
        icon="fa-solid fa-sliders"
        width={620}
        busy={busy}
        onClose={onClose}
        className="ss-advanced-ui-dialog"
        footer={
          <StudioUIButtonRow align={editor.type === 'ruler' ? 'between' : 'end'}>
            {editor.type === 'ruler' ? <StudioUIButton variant="ghost" disabled={busy} onClick={() => { onClearGuides?.(); onClose?.() }}>{km ? 'លុបបន្ទាត់ណែនាំ' : 'Clear guides'}</StudioUIButton> : null}
            <span className="ss-advanced-ui-footer-actions">
              <StudioUIButton disabled={busy} onClick={onClose}>{km ? 'បោះបង់' : 'Cancel'}</StudioUIButton>
              <StudioUIButton variant="primary" disabled={busy} onClick={submit}>{busy ? (km ? 'កំពុងអនុវត្ត...' : 'Applying...') : (km ? 'អនុវត្ត' : 'Apply')}</StudioUIButton>
            </span>
          </StudioUIButtonRow>
        }
      >
        <p className="ss-advanced-ui-note">{km ? 'ពិនិត្យការកំណត់មុនអនុវត្ត។ អាចប្រើ Undo ដើម្បីត្រឡប់ការកែប្រែលើរូបភាព។' : 'Review the settings before applying. Image changes can be undone.'}</p>
        <StudioUISection title={title[km ? 1 : 0]} subtitle={editor.type}>
          <div className="ss-advanced-ui-fields">{(SCHEMAS[editor.type] || []).map(field)}</div>
        </StudioUISection>
        {error ? <p className="ss-advanced-ui-error" role="alert">{error}</p> : null}
      </StudioUIDialog>
    </>
  )
}
