import { useEffect, useRef, useState } from 'react'

function pickerHsv(hex) {
  const rgb = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const max = Math.max(...rgb), min = Math.min(...rgb), delta = max - min;
  let h = 0;
  if (delta) {
    if (max === rgb[0]) h = ((rgb[1] - rgb[2]) / delta) % 6;
    else if (max === rgb[1]) h = (rgb[2] - rgb[0]) / delta + 2;
    else h = (rgb[0] - rgb[1]) / delta + 4;
  }
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max };
}

function pickerRgb(h, s, v) {
  const chroma = v * s, x = chroma * (1 - Math.abs((h / 60) % 2 - 1)), m = v - chroma;
  const sectors = [[chroma, x, 0], [x, chroma, 0], [0, chroma, x], [0, x, chroma], [x, 0, chroma], [chroma, 0, x]];
  return sectors[Math.floor(h / 60) % 6].map((value) => Math.round((value + m) * 255));
}

function pickerHex(hsv) {
  return '#' + pickerRgb(hsv.h, hsv.s, hsv.v).map((value) => value.toString(16).padStart(2, '0')).join('');
}

export default function ChatStoryIndicatorColorPicker({ value = '#a98bd7', title, hexLabel, onChange, onClose }) {
  value = typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '#a98bd7';
  const dialogRef = useRef(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [hsv, setHsv] = useState(() => pickerHsv(value));
  const [hexText, setHexText] = useState(value.toUpperCase());
  const selected = pickerHex(hsv);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    if (!dialog.open) dialog.showModal();
    return () => {
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const pixels = context.createImageData(240, 240);
    for (let y = 0; y < 240; y += 1) {
      for (let x = 0; x < 240; x += 1) {
        const dx = x - 120, dy = y - 120, distance = Math.hypot(dx, dy);
        let rgb = null;
        if (94 <= distance && distance <= 116) {
          rgb = pickerRgb((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, 1, 1);
        } else if (Math.abs(dx) + Math.abs(dy) <= 81) {
          rgb = pickerRgb(hsv.h, (dx + dy) / 162 + 0.5, 1 - ((dy - dx) / 162 + 0.5));
        }
        if (rgb) {
          const offset = (y * 240 + x) * 4;
          pixels.data.set([...rgb, 255], offset);
        }
      }
    }
    context.putImageData(pixels, 0, 0);
    const marker = (x, y, color) => {
      context.beginPath();
      context.arc(x, y, 7, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = '#fff';
      context.stroke();
      context.lineWidth = 1;
      context.strokeStyle = '#344054';
      context.stroke();
    };
    marker(120 + Math.cos(hsv.h * Math.PI / 180) * 105, 120 + Math.sin(hsv.h * Math.PI / 180) * 105, pickerHex({ h: hsv.h, s: 1, v: 1 }));
    const u = hsv.s - 0.5, w = 0.5 - hsv.v;
    marker(120 + 81 * (u - w), 120 + 81 * (u + w), selected);
  }, [hsv, selected]);

  const update = (next) => {
    const normalized = { h: (next.h + 360) % 360, s: Math.min(1, Math.max(0, next.s)), v: Math.min(1, Math.max(0, next.v)) };
    setHsv(normalized);
    const hex = pickerHex(normalized);
    setHexText(hex.toUpperCase());
    onChange(hex);
  };

  const pick = (event, start) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - bounds.left) * 240 / bounds.width - 120;
    const dy = (event.clientY - bounds.top) * 240 / bounds.height - 120;
    if (start) {
      const distance = Math.hypot(dx, dy);
      dragRef.current = 88 <= distance && distance <= 120 ? 'hue' : Math.abs(dx) + Math.abs(dy) <= 86 ? 'diamond' : null;
      if (dragRef.current) event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (dragRef.current === 'hue') update({ ...hsv, h: (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360 });
    if (dragRef.current === 'diamond') update({ ...hsv, s: (dx + dy) / 162 + 0.5, v: 1 - ((dy - dx) / 162 + 0.5) });
  };

  return (
    <dialog ref={dialogRef} className="cs-indicator-picker-modal theme-preserve" aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || bounds.right < event.clientX || event.clientY < bounds.top || bounds.bottom < event.clientY) onClose();
      }}>
      <style>{PICKER_CSS}</style>
      <h2>{title}</h2>
      <canvas ref={canvasRef} width="240" height="240" className="cs-indicator-picker-wheel" aria-label={title}
        onPointerDown={(event) => pick(event, true)} onPointerMove={(event) => { if (dragRef.current) pick(event, false); }}
        onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }} />
      <div className="cs-indicator-picker-hex"><span style={{ background: selected }} />
        <input aria-label={hexLabel} value={hexText} maxLength={7} spellCheck={false} autoComplete="off"
          onChange={(event) => {
            const text = event.target.value;
            setHexText(text);
            if (/^#[0-9a-f]{6}$/i.test(text)) {
              const next = pickerHsv(text);
              if (!next.s) next.h = hsv.h;
              setHsv(next);
              onChange(text.toLowerCase());
            }
          }} onBlur={() => setHexText(selected.toUpperCase())} />
      </div>
      {[['H', 'h', 359], ['S', 's', 100], ['B', 'v', 100]].map(([label, key, max]) => {
        const amount = Math.round(key === 'h' ? hsv.h : hsv[key] * 100);
        return <label className="cs-indicator-picker-row" key={key}><span>{label}</span>
          <input type="range" aria-label={label} min="0" max={max} value={amount}
            style={{ background: key === 'h' ? 'linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' : key === 's' ? 'linear-gradient(90deg,' + pickerHex({ ...hsv, s: 0 }) + ',' + pickerHex({ ...hsv, s: 1 }) + ')' : 'linear-gradient(90deg,#000,' + pickerHex({ ...hsv, v: 1 }) + ')' }}
            onChange={(event) => update({ ...hsv, [key]: Number(event.target.value) / (key === 'h' ? 1 : 100) })} />
          <output>{amount}{key === 'h' ? '°' : '%'}</output>
        </label>;
      })}
    </dialog>
  );
}


const PICKER_CSS = `
.cs-indicator-picker-modal { box-sizing:border-box;width:min(320px,calc(100vw - 64px));max-width:calc(100vw - 64px);max-height:calc(100vh - 80px);max-height:calc(100dvh - 80px);margin:auto;padding:18px;border:1px solid rgba(255,255,255,.65);border-radius:20px;background:rgba(245,246,248,.97);color:#111827;box-shadow:0 16px 60px rgba(17,24,39,.16);overflow-y:auto;overscroll-behavior:contain; }
.cs-indicator-picker-modal::backdrop { background:rgba(107,114,128,.24); }
.cs-indicator-picker-modal h2 { font-size:16px;font-weight:700;margin:0 0 12px; }
.cs-indicator-picker-wheel { display:block;width:min(240px,100%,42dvh);height:auto;aspect-ratio:1;margin:0 auto 12px;touch-action:none; }
.cs-indicator-picker-hex { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
.cs-indicator-picker-hex > span { width:40px;height:34px;flex:none;border:1px solid #d0d5dd;border-radius:8px; }
.cs-indicator-picker-hex input { box-sizing:border-box;min-width:0;width:100%;height:34px;padding:6px 10px;border:1px solid #d0d5dd;border-radius:8px;background:#fff;color:#111827;font-size:13px; }
.cs-indicator-picker-row { display:flex;align-items:center;gap:10px;margin-top:14px;font-size:12px; }
.cs-indicator-picker-row > span { width:12px;font-weight:700; }
.cs-indicator-picker-row output { width:34px;flex:none;text-align:right;font-variant-numeric:tabular-nums; }
.cs-indicator-picker-row input { appearance:none;-webkit-appearance:none;flex:1;min-width:0;height:12px;margin:0;border-radius:20px;cursor:pointer; }
.cs-indicator-picker-row input::-webkit-slider-thumb { appearance:none;-webkit-appearance:none;width:20px;height:20px;border:3px solid #fff;border-radius:50%;background:#111827;box-shadow:0 0 0 1px #98a2b3; }
.cs-indicator-picker-row input::-moz-range-thumb { width:14px;height:14px;border:3px solid #fff;border-radius:50%;background:#111827;box-shadow:0 0 0 1px #98a2b3; }
`;

