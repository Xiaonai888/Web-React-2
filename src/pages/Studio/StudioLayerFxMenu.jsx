import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const STUDIO_LAYER_FX_MENU_ITEMS = Object.freeze([
  { id: 'blending', group: 'blend' },
  { id: 'bevelEmboss', group: 'effects' },
  { id: 'stroke', group: 'effects' },
  { id: 'innerShadow', group: 'effects' },
  { id: 'innerGlow', group: 'effects' },
  { id: 'satin', group: 'effects' },
  { id: 'colorOverlay', group: 'effects' },
  { id: 'gradientOverlay', group: 'effects' },
  { id: 'patternOverlay', group: 'effects' },
  { id: 'outerGlow', group: 'effects' },
  { id: 'dropShadow', group: 'effects' },
])

const LABELS = {
  en: {
    title: 'Layer effects',
    blending: 'Blending Options…',
    bevelEmboss: 'Bevel & Emboss…',
    stroke: 'Stroke…',
    innerShadow: 'Inner Shadow…',
    innerGlow: 'Inner Glow…',
    satin: 'Satin…',
    colorOverlay: 'Color Overlay…',
    gradientOverlay: 'Gradient Overlay…',
    patternOverlay: 'Pattern Overlay…',
    outerGlow: 'Outer Glow…',
    dropShadow: 'Drop Shadow…',
  },
  km: {
    title: 'FX របស់ Layer',
    blending: 'Blending Options…',
    bevelEmboss: 'Bevel & Emboss…',
    stroke: 'Stroke…',
    innerShadow: 'Inner Shadow…',
    innerGlow: 'Inner Glow…',
    satin: 'Satin…',
    colorOverlay: 'Color Overlay…',
    gradientOverlay: 'Gradient Overlay…',
    patternOverlay: 'Pattern Overlay…',
    outerGlow: 'Outer Glow…',
    dropShadow: 'Drop Shadow…',
  },
  zh: {
    title: '图层效果',
    blending: '混合选项…',
    bevelEmboss: '斜面和浮雕…',
    stroke: '描边…',
    innerShadow: '内阴影…',
    innerGlow: '内发光…',
    satin: '光泽…',
    colorOverlay: '颜色叠加…',
    gradientOverlay: '渐变叠加…',
    patternOverlay: '图案叠加…',
    outerGlow: '外发光…',
    dropShadow: '投影…',
  },
  ja: {
    title: 'レイヤー効果',
    blending: 'レイヤー効果…',
    bevelEmboss: 'ベベルとエンボス…',
    stroke: '境界線…',
    innerShadow: 'シャドウ（内側）…',
    innerGlow: '光彩（内側）…',
    satin: 'サテン…',
    colorOverlay: 'カラーオーバーレイ…',
    gradientOverlay: 'グラデーションオーバーレイ…',
    patternOverlay: 'パターンオーバーレイ…',
    outerGlow: '光彩（外側）…',
    dropShadow: 'ドロップシャドウ…',
  },
  ko: {
    title: '레이어 효과',
    blending: '혼합 옵션…',
    bevelEmboss: '경사와 엠보스…',
    stroke: '획…',
    innerShadow: '내부 그림자…',
    innerGlow: '내부 광선…',
    satin: '새틴…',
    colorOverlay: '색상 오버레이…',
    gradientOverlay: '그레이디언트 오버레이…',
    patternOverlay: '패턴 오버레이…',
    outerGlow: '외부 광선…',
    dropShadow: '그림자…',
  },
}

export default function StudioLayerFxMenu({
  open = false,
  anchorRect = null,
  language = 'en',
  disabled = false,
  onSelect,
  onClose,
}) {
  const menuRef = useRef(null)
  const itemRefs = useRef([])
  const [position, setPosition] = useState({ left: 12, top: 12 })
  const words = LABELS[language] || LABELS.en

  const groups = useMemo(() => [
    STUDIO_LAYER_FX_MENU_ITEMS.filter((item) => item.group === 'blend'),
    STUDIO_LAYER_FX_MENU_ITEMS.filter((item) => item.group === 'effects'),
  ], [])

  useLayoutEffect(() => {
    if (!open) return
    const update = () => {
      const menu = menuRef.current
      if (!menu) return
      const mobile = window.matchMedia('(max-width: 560px), (pointer: coarse)').matches
      if (mobile) {
        setPosition({ left: 8, top: Math.max(8, window.innerHeight - menu.offsetHeight - 8) })
        return
      }
      const rect = anchorRect || { left: 12, right: 12, top: 12, bottom: 12 }
      const gap = 6
      const width = menu.offsetWidth
      const height = menu.offsetHeight
      let left = rect.left
      let top = rect.top - height - gap
      if (top < 8) top = rect.bottom + gap
      if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8
      if (top + height > window.innerHeight - 8) top = Math.max(8, window.innerHeight - height - 8)
      setPosition({ left: Math.max(8, left), top: Math.max(8, top) })
    }
    const frame = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, anchorRect])

  useEffect(() => {
    if (!open) return
    const first = requestAnimationFrame(() => itemRefs.current[0]?.focus())
    const closeOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) onClose?.()
    }
    document.addEventListener('pointerdown', closeOutside, true)
    return () => {
      cancelAnimationFrame(first)
      document.removeEventListener('pointerdown', closeOutside, true)
    }
  }, [open, onClose])

  if (!open) return null

  function focusIndex(index) {
    const count = STUDIO_LAYER_FX_MENU_ITEMS.length
    const next = (index + count) % count
    itemRefs.current[next]?.focus()
  }

  function keyDown(event, index) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose?.()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusIndex(index + 1)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusIndex(index - 1)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      focusIndex(0)
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      focusIndex(STUDIO_LAYER_FX_MENU_ITEMS.length - 1)
    }
  }

  function choose(id) {
    if (disabled) return
    onSelect?.(id)
    onClose?.()
  }

  let index = -1

  return createPortal(
    <div
      ref={menuRef}
      className="ss-layer-fx-menu"
      role="menu"
      aria-label={words.title}
      style={{ left: position.left, top: position.top }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <style>{`
        .ss-layer-fx-menu{position:fixed;z-index:12370;width:220px;max-height:calc(100dvh - 16px);overflow:auto;padding:4px 0;border:1px solid #8d8d8d;background:#ededed;color:#111;box-shadow:0 5px 18px #0007;font:12px Arial,sans-serif;overscroll-behavior:contain}
        .ss-layer-fx-menu *{box-sizing:border-box}
        .ss-layer-fx-group+.ss-layer-fx-group{margin-top:3px;padding-top:3px;border-top:1px solid #b5b5b5}
        .ss-layer-fx-item{display:block;width:100%;min-height:24px;padding:4px 22px;border:0;background:transparent;color:inherit;text-align:left;font:inherit;white-space:nowrap;cursor:pointer}
        .ss-layer-fx-item:hover,.ss-layer-fx-item:focus-visible{outline:0;background:#2f73d9;color:#fff}
        .ss-layer-fx-item:disabled{opacity:.45;cursor:default;background:transparent;color:#666}
        @media(prefers-color-scheme:dark){.ss-layer-fx-menu{border-color:#747474;background:#393939;color:#f2f2f2}.ss-layer-fx-group+.ss-layer-fx-group{border-color:#5c5c5c}.ss-layer-fx-item:disabled{color:#aaa}}
        @media(max-width:560px),(pointer:coarse){.ss-layer-fx-menu{left:8px!important;right:8px;width:auto;max-height:min(72dvh,560px);border-radius:10px;padding:7px 0;font-size:14px}.ss-layer-fx-item{min-height:40px;padding:9px 18px}.ss-layer-fx-group+.ss-layer-fx-group{margin-top:5px;padding-top:5px}}
      `}</style>
      {groups.map((items, groupIndex) => (
        <div className="ss-layer-fx-group" role="group" key={groupIndex}>
          {items.map((item) => {
            index += 1
            const currentIndex = index
            return (
              <button
                key={item.id}
                ref={(node) => { itemRefs.current[currentIndex] = node }}
                type="button"
                className="ss-layer-fx-item"
                role="menuitem"
                disabled={disabled}
                onClick={() => choose(item.id)}
                onKeyDown={(event) => keyDown(event, currentIndex)}
              >
                {words[item.id] || LABELS.en[item.id]}
              </button>
            )
          })}
        </div>
      ))}
    </div>,
    document.body,
  )
}
