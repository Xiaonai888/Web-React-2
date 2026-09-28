import StudioUIAngleDial from './StudioUIAngleDial'
import './StudioUIControls.css'

const normalizeHex = (value, fallback) => /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value).toUpperCase() : fallback

export default function StudioUIGradientEditor({
  startColor = '#000000',
  endColor = '#FFFFFF',
  angle = 0,
  reverse = false,
  showAngle = true,
  disabled = false,
  label = 'Gradient',
  onChange,
  className = '',
}) {
  const start = normalizeHex(startColor, '#000000')
  const end = normalizeHex(endColor, '#FFFFFF')
  const first = reverse ? end : start
  const second = reverse ? start : end

  function emit(patch) {
    if (disabled) return
    onChange?.({ startColor: start, endColor: end, angle, reverse, ...patch })
  }

  return (
    <div className={`ss-ui-gradient-editor ${className}`.trim()}>
      <div className="ss-ui-gradient-head">
        <strong>{label}</strong>
        <button type="button" disabled={disabled} onClick={() => emit({ reverse: !reverse })}>
          <i className="fa-solid fa-right-left" aria-hidden="true" />
          <span>Reverse</span>
        </button>
      </div>
      <div className="ss-ui-gradient-preview" style={{ background: `linear-gradient(${angle + 90}deg, ${first}, ${second})` }} />
      <div className="ss-ui-gradient-stops">
        <label>
          <span>Start</span>
          <span className="ss-ui-gradient-color">
            <input type="color" value={start} disabled={disabled} onChange={(event) => emit({ startColor: event.target.value.toUpperCase() })} />
            <input value={start} disabled={disabled} onChange={(event) => {
              if (/^#[0-9a-f]{6}$/i.test(event.target.value)) emit({ startColor: event.target.value.toUpperCase() })
            }} />
          </span>
        </label>
        <button type="button" className="ss-ui-gradient-swap" disabled={disabled} aria-label="Swap gradient colors" title="Swap colors" onClick={() => emit({ startColor: end, endColor: start })}>
          <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden="true" />
        </button>
        <label>
          <span>End</span>
          <span className="ss-ui-gradient-color">
            <input type="color" value={end} disabled={disabled} onChange={(event) => emit({ endColor: event.target.value.toUpperCase() })} />
            <input value={end} disabled={disabled} onChange={(event) => {
              if (/^#[0-9a-f]{6}$/i.test(event.target.value)) emit({ endColor: event.target.value.toUpperCase() })
            }} />
          </span>
        </label>
      </div>
      {showAngle ? <div className="ss-ui-gradient-angle"><StudioUIAngleDial value={angle} disabled={disabled} onChange={(value) => emit({ angle: value })} size={76} /></div> : null}
      <style>{`
        .ss-ui-gradient-editor{overflow:hidden;border:1px solid #3b4651;border-radius:8px;background:#20262d;color:#edf3fa;font-family:Inter,system-ui,sans-serif}
        .ss-ui-gradient-head{height:36px;display:flex;align-items:center;justify-content:space-between;padding:0 9px;border-bottom:1px solid #3b4651;background:#2c3640}
        .ss-ui-gradient-head strong{font-size:11px}.ss-ui-gradient-head button{height:27px;display:inline-flex;align-items:center;gap:6px;padding:0 8px;border:1px solid #4b5968;border-radius:5px;background:#35424f;color:#dce9f5;font:700 9px Inter,system-ui,sans-serif;cursor:pointer}
        .ss-ui-gradient-head button:hover:not(:disabled){border-color:#74a8d6;background:#42566a}
        .ss-ui-gradient-preview{height:54px;margin:10px;border:1px solid #687686;border-radius:6px;box-shadow:inset 0 0 0 1px #0005}
        .ss-ui-gradient-stops{display:grid;grid-template-columns:minmax(0,1fr) 31px minmax(0,1fr);align-items:end;gap:7px;padding:0 10px 10px}
        .ss-ui-gradient-stops>label{display:flex;flex-direction:column;gap:4px;color:#93a3b2;font-size:8px;font-weight:800;text-transform:uppercase}
        .ss-ui-gradient-color{display:grid;grid-template-columns:34px minmax(0,1fr);gap:5px}
        .ss-ui-gradient-color input[type=color]{width:34px;height:30px;padding:2px;border:1px solid #4b5968;border-radius:5px;background:#202832}
        .ss-ui-gradient-color input:not([type=color]){min-width:0;width:100%;height:30px;padding:0 6px;border:1px solid #4b5968;border-radius:5px;outline:none;background:#171e25;color:#edf3fa;font:600 9px Inter,system-ui,sans-serif}
        .ss-ui-gradient-swap{width:31px;height:30px;display:grid;place-items:center;border:1px solid #4b5968;border-radius:5px;background:#35424f;color:#dce9f5;cursor:pointer}
        .ss-ui-gradient-angle{padding:9px 10px;border-top:1px solid #3b4651;background:#242c34}
        .ss-ui-gradient-editor button:disabled,.ss-ui-gradient-editor input:disabled{opacity:.45;cursor:default}
      `}</style>
    </div>
  )
}
