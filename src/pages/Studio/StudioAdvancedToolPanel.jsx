import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const NAMES = {
  transform: ['Transform', 'បម្លែងរូបភាព'], perspective: ['Perspective', 'ទិដ្ឋភាពបីវិមាត្រ'], crop: ['Crop', 'កាត់ទំហំក្រដាស'],
  canvas: ['Canvas size', 'ទំហំផ្ទាំងគំនូរ'], ruler: ['Ruler guide', 'បន្ទាត់ណែនាំ'], balloon: ['Speech balloon', 'ពពុះសន្ទនា'],
  frame: ['Comic frame', 'ស៊ុម Manga'],
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
}
const SCHEMAS = {
  transform: ['translateX', 'translateY', 'scaleX', 'scaleY', 'rotate'],
  perspective: ['corner0x', 'corner0y', 'corner1x', 'corner1y', 'corner2x', 'corner2y', 'corner3x', 'corner3y'],
  crop: ['x', 'y', 'width', 'height'], canvas: ['width', 'height', 'offsetX', 'offsetY'],
  ruler: ['axis', 'position', 'angle'], frame: ['x', 'y', 'width', 'height', 'border', 'ink', 'fill'],
  balloon: ['text', 'shape', 'tail', 'width', 'height', 'fontSize', 'font', 'bold', 'italic', 'align', 'fill', 'ink', 'textColor', 'opacity'],
}
const CHOICES = {
  axis: [['vertical', 'Vertical', 'បញ្ឈរ'], ['horizontal', 'Horizontal', 'ផ្ដេក'], ['angled', 'Angled', 'មុំ']],
  shape: [['ellipse', 'Ellipse', 'ពងក្រពើ'], ['rounded', 'Rounded', 'ជ្រុងមូល'], ['thought', 'Thought', 'គំនិត'], ['shout', 'Shout', 'ស្រែក']],
  tail: [['none', 'None', 'គ្មាន'], ['bottom', 'Bottom', 'ក្រោម'], ['top', 'Top', 'លើ'], ['left', 'Left', 'ឆ្វេង'], ['right', 'Right', 'ស្ដាំ']],
  font: [['sans', 'Sans', 'ធម្មតា'], ['serif', 'Serif', 'ស៊េរីហ្វ'], ['mono', 'Mono', 'ម៉ូណូ']],
  align: [['left', 'Left', 'ឆ្វេង'], ['center', 'Center', 'កណ្ដាល'], ['right', 'Right', 'ស្ដាំ']],
  fill: [['transparent', 'Transparent', 'ថ្លា'], ['#FFFFFF', 'White', 'ស']],
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
  const update = (key, value) => { setValues((previous) => ({ ...previous, [key]: value })); setError('') }
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try { if (await onApply(editor, values) !== false) onClose?.() }
    catch (reason) { setError(reason?.message || (km ? 'មិនអាចអនុវត្តបាន។' : 'Could not apply this tool.')) }
    finally { setBusy(false) }
  }
  return createPortal(
    <div className="ss-advanced-tool-overlay" role="presentation">
      <style>{`
        .ss-advanced-tool-overlay{position:fixed;inset:0;z-index:12100;background:#0b1117cc;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;color:#edf4fc}
        .ss-advanced-tool-overlay *{box-sizing:border-box}
        .ss-advanced-tool-modal{width:min(100%,510px);max-height:min(90vh,780px);overflow:auto;border:1px solid #7388a3;border-radius:12px;background:#263646;padding:17px;box-shadow:0 20px 70px #0009}
        .ss-advanced-tool-modal h2{font-size:18px;margin:0 0 6px}
        .ss-advanced-tool-modal p{margin:0 0 13px;font-size:12px;color:#c2d4e7;line-height:1.5}
        .ss-advanced-tool-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;margin:12px 0 15px}
        .ss-advanced-tool-fields label{display:grid;gap:5px;min-width:0;font-size:12px;color:#e4f0fd}
        .ss-advanced-tool-fields label.wide{grid-column:1/-1}
        .ss-advanced-tool-fields input:not([type=checkbox]),.ss-advanced-tool-fields select,.ss-advanced-tool-fields textarea{width:100%;min-width:0;min-height:36px;border-radius:5px;border:1px solid #6d849d;background:#1a2937;color:#fff;padding:6px;font:inherit;font-size:14px}
        .ss-advanced-tool-fields input[type=color]{min-height:38px;padding:2px;cursor:pointer}
        .ss-advanced-tool-fields input[type=checkbox]{width:18px;height:18px;accent-color:#80baff}
        .ss-advanced-tool-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
        .ss-advanced-tool-actions button{min-height:40px;border:1px solid #7b94ae;border-radius:6px;background:#374f68;color:#fff;padding:7px 15px;font:inherit;cursor:pointer}
        .ss-advanced-tool-actions button[type=submit]{background:#2d72ac;border-color:#96cafa}
        .ss-advanced-tool-actions button:disabled{opacity:.5;cursor:not-allowed}
        .ss-advanced-tool-modal .ss-advanced-tool-error{color:#ffb4b4;font-size:12px;margin-bottom:10px}
        @media(max-width:390px){.ss-advanced-tool-fields{grid-template-columns:minmax(0,1fr)}.ss-advanced-tool-modal{padding:12px}}
      `}</style>
      <div className="ss-advanced-tool-modal" role="dialog" aria-modal="true" aria-label={title[km ? 1 : 0]}>
        <h2>{title[km ? 1 : 0]}</h2>
        <p>{km ? 'ពិនិត្យការកំណត់មុនអនុវត្ត។ អាចប្រើ Undo ដើម្បីត្រឡប់ការកែប្រែលើរូបភាព។' : 'Review the settings before applying. Image changes can be undone.'}</p>
        <form onSubmit={submit}>
          <div className="ss-advanced-tool-fields">
            {(SCHEMAS[editor.type] || []).map((key) => {
              const label = FIELD_NAMES[key]?.[km ? 1 : 0] || key
              const value = values[key]
              if (key === 'text') return <label className="wide" key={key}>{label}<textarea rows={3} maxLength={1200} value={value ?? ''} onChange={(event) => update(key, event.target.value)} /></label>
              if (typeof value === 'boolean') return <label key={key}>{label}<input type="checkbox" checked={value} onChange={(event) => update(key, event.target.checked)} /></label>
              if (CHOICES[key]) return <label key={key}>{label}<select value={value} onChange={(event) => update(key, event.target.value)}>{CHOICES[key].map(([id, en, kh]) => <option key={id} value={id}>{km ? kh : en}</option>)}</select></label>
              if (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) return <label key={key}>{label}<input type="color" value={value} onChange={(event) => update(key, event.target.value)} /></label>
              return <label key={key}>{label}<input type="number" step={['scaleX', 'scaleY'].includes(key) ? 0.05 : ['angle', 'rotate'].includes(key) ? 1 : 1} value={value ?? 0} onChange={(event) => update(key, Number(event.target.value))} /></label>
            })}
          </div>
          {error ? <p className="ss-advanced-tool-error" role="alert">{error}</p> : null}
          <div className="ss-advanced-tool-actions">
            {editor.type === 'ruler' && <button type="button" disabled={busy} onClick={() => { onClearGuides?.(); onClose?.() }}>{km ? 'លុបបន្ទាត់ណែនាំ' : 'Clear guides'}</button>}
            <button type="button" disabled={busy} onClick={() => onClose?.()}>{km ? 'បោះបង់' : 'Cancel'}</button>
            <button type="submit" disabled={busy}>{busy ? (km ? 'កំពុងអនុវត្ត...' : 'Applying...') : (km ? 'អនុវត្ត' : 'Apply')}</button>
          </div>
        </form>
      </div>
    </div>, document.body
  )
}
