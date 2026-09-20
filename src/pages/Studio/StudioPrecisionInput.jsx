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
      style={{ boxSizing: 'border-box', flex: `0 0 ${width}px`, width, minWidth: width, height: 28, padding: '0 3px', border: '1px solid #61758a', borderRadius: 4, background: '#253342', color: '#f1f7ff', font: 'inherit', fontSize: 11, fontVariantNumeric: 'tabular-nums', textAlign: 'center' }}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur() }
        if (event.key === 'Escape') { setDraft(String(value)); event.currentTarget.blur() }
      }}
    />
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
