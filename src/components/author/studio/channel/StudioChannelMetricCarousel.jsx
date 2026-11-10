import { useRef, useState } from 'react'
import { StudioCard, formatStudioCount } from '../ShadowStudioAnalyticsShared'

function metricNumber(metric) {
  if (metric?.available !== true || metric?.value === null || metric?.value === undefined) return '—'
  const value = Number(metric.value)
  return Number.isFinite(value) && value >= 0 ? formatStudioCount(value) : '—'
}

function MetricChart({ points, fallback }) {
  const rows = Array.isArray(points) ? points.filter(item => Number.isFinite(Number(item?.value)) && Number(item.value) >= 0) : []
  if (rows.length < 2) {
    return <div className="flex h-36 items-center justify-center rounded-xl bg-[var(--shadow-bg-soft)] px-4 text-center text-xs text-[var(--shadow-text-secondary)]">{fallback}</div>
  }

  const highest = Math.max(1, ...rows.map(item => Number(item.value)))
  const positions = rows.map((row, index) => [8 + index * 304 / (rows.length - 1), 114 - Number(row.value) / highest * 100])
  const stroke = positions.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')

  return <svg className="h-36 w-full text-[var(--shadow-accent)]" viewBox="0 0 320 130" role="img" aria-label="Analytics trend chart">
    {[14, 64, 114].map(y => <line key={y} x1="8" x2="312" y1={y} y2={y} stroke="var(--shadow-border)" strokeWidth="1" />)}
    <path d={stroke} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
}

export default function StudioChannelMetricCarousel({ slides = [], unavailableLabel = 'Not measured yet', timelineLabel = 'No measured timeline for this period', label = 'Analytics' }) {
  const [selected, setSelected] = useState(0)
  const scrollRef = useRef(null)
  const items = Array.isArray(slides) ? slides : []

  function onScroll() {
    const element = scrollRef.current
    if (!element?.children?.length) return
    const offset = element.children[0].offsetLeft
    let closest = 0
    let distance = Infinity
    for (let i = 0; i < element.children.length; i += 1) {
      const next = Math.abs(element.children[i].offsetLeft - offset - element.scrollLeft)
      if (next < distance) {
        closest = i
        distance = next
      }
    }
    setSelected(closest)
  }

  function goTo(index) {
    const element = scrollRef.current
    if (!element?.children?.[index]) return
    element.scrollTo({ left: element.children[index].offsetLeft - element.children[0].offsetLeft, behavior: 'smooth' })
    setSelected(index)
  }

  if (!items.length) return null

  return <section aria-label={label} className="min-w-0 space-y-3">
    <div ref={scrollRef} onScroll={onScroll} className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
      {items.map((slide, index) => <div key={slide.key || index} className="w-[90%] shrink-0 snap-start sm:w-[65%]">
        <StudioCard className="h-full min-h-[285px] space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-[var(--shadow-text-secondary)]">{slide.label}</p>
            <p className="text-3xl font-bold tabular-nums">{metricNumber(slide.metric)}</p>
            <p className="text-xs text-[var(--shadow-text-secondary)]">{slide.subtitle || (slide.metric?.available === true ? '' : unavailableLabel)}</p>
          </div>
          <MetricChart points={slide.points} fallback={timelineLabel} />
        </StudioCard>
      </div>)}
    </div>
    {items.length > 1 ? <div className="flex items-center justify-center gap-2" aria-label={label}>
      {items.map((slide, index) => <button type="button" key={slide.key || index}
        onClick={() => goTo(index)} aria-label={`${slide.label}: ${index + 1} of ${items.length}`} aria-current={selected === index ? 'true' : undefined}
        className={`h-2.5 w-2.5 rounded-full ${selected === index ? 'bg-[var(--shadow-text-primary)]' : 'bg-[var(--shadow-border)]'}`} />)}
    </div> : null}
  </section>
}
