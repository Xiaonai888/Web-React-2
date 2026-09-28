import { useEffect, useState } from 'react'

export default function StudioPrecisionInput({ value, onCommit, min, max, step = 1, label, width = 68 }) {
  const [draft, setDraft] = useState(String(value))
  useEffect(() => { setDraft(String(value)) }, [value])

  function commit() {
    const next = Number(draft)
    if (!draft.trim() || !Number.isFinite(next) || next < min || next > max) {
      setDraft(String(value))
      return
    }
    const rounded = Math.round(next * 10) / 10
    if (onCommit(rounded) === false) {
      setDraft(String(value))
      return
    }
    setDraft(String(rounded))
  }

  return (
    <>
      <input
        className="ss-precision-input"
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft}
        aria-label={label}
        title={`${min}–${max}`}
        style={{ '--ss-precision-width': `${width}px`, flex: `0 0 ${width}px`, width, minWidth: width }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur() }
          if (event.key === 'Escape') { setDraft(String(value)); event.currentTarget.blur() }
        }}
      />
      <style>{`
        .shadow-studio .ss-precision-input{
          box-sizing:border-box;
          height:30px;
          padding:0 6px;
          border:1px solid #4b5968;
          border-radius:6px;
          outline:none;
          background:#202832;
          color:#edf3fa;
          font:650 11px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          font-variant-numeric:tabular-nums;
          text-align:center;
          box-shadow:inset 0 0 0 1px #ffffff05;
          transition:border-color 120ms ease,box-shadow 120ms ease,background 120ms ease
        }
        .shadow-studio .ss-precision-input:hover{
          border-color:#66798b;
          background:#25313c
        }
        .shadow-studio .ss-precision-input:focus{
          border-color:#5faeff;
          background:#1f2d3a;
          box-shadow:0 0 0 2px #5faeff26,inset 0 0 0 1px #ffffff08
        }
        .shadow-studio .ss-precision-input:disabled{
          opacity:.45;
          cursor:default
        }
        .shadow-studio .ss-precision-input::-webkit-inner-spin-button,
        .shadow-studio .ss-precision-input::-webkit-outer-spin-button{
          opacity:.7
        }
        @media(max-width:900px),(pointer:coarse){
          .shadow-studio .ss-precision-input{
            height:34px;
            min-width:max(var(--ss-precision-width),64px);
            font-size:12px
          }
        }
      `}</style>
    </>
  )
}

export function confirmLargeBrush(next, previous, language) {
  if (next <= 512 || previous > 512) return true
  const messages = {
    km: 'ជក់ធំពេកអាចធ្វើឱ្យកម្មវិធីដើរយឺត ឬគាំង។ តើអ្នកចង់បន្តឬទេ?',
    en: 'A very large brush may slow down or freeze the app. Continue?',
    zh: '超大画笔可能导致应用变慢或卡死。继续吗？',
    ja: '非常に大きいブラシはアプリの動作を遅くしたり、停止させる可能性があります。続けますか？',
    ko: '매우 큰 브러시는 앱을 느리게 하거나 멈추게 할 수 있습니다. 계속할까요?',
  }
  return window.confirm(`${messages[language] || messages.en}\n${next}px`)
}
