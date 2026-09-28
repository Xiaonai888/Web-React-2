import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const STUDIO_ADJUSTMENT_LAYER_ITEMS = Object.freeze([
  { id: 'color-vibrance', group: 'quick' },
  { id: 'brightness-contrast', group: 'light' },
  { id: 'levels', group: 'light' },
  { id: 'curves', group: 'light' },
  { id: 'exposure', group: 'light' },
  { id: 'vibrance', group: 'color' },
  { id: 'hue-saturation', group: 'color' },
  { id: 'color-balance', group: 'color' },
  { id: 'black-white', group: 'color' },
  { id: 'photo-filter', group: 'color' },
  { id: 'channel-mixer', group: 'color' },
  { id: 'color-lookup', group: 'color' },
  { id: 'selective-color', group: 'color' },
  { id: 'invert', group: 'tone' },
  { id: 'posterize', group: 'tone' },
  { id: 'threshold', group: 'tone' },
  { id: 'gradient-map', group: 'tone' },
  { id: 'solid-color', group: 'fill' },
  { id: 'gradient', group: 'fill' },
  { id: 'pattern', group: 'fill' },
])

const ADJUSTMENT_ICONS = Object.freeze({
  'color-vibrance': 'fa-wand-magic-sparkles',
  'brightness-contrast': 'fa-sun',
  levels: 'fa-chart-simple',
  curves: 'fa-chart-line',
  exposure: 'fa-circle-half-stroke',
  vibrance: 'fa-droplet',
  'hue-saturation': 'fa-palette',
  'color-balance': 'fa-scale-balanced',
  'black-white': 'fa-circle-half-stroke',
  'photo-filter': 'fa-filter',
  'channel-mixer': 'fa-sliders',
  'color-lookup': 'fa-table-cells',
  'selective-color': 'fa-eye-dropper',
  invert: 'fa-arrows-rotate',
  posterize: 'fa-layer-group',
  threshold: 'fa-circle',
  'gradient-map': 'fa-fill',
  'solid-color': 'fa-square',
  gradient: 'fa-fill-drip',
  pattern: 'fa-border-all',
})

const LABELS = {
  en: {
    title: 'Create new fill or adjustment layer',
    'color-vibrance': 'Color and vibrance…',
    'brightness-contrast': 'Brightness/Contrast…',
    levels: 'Levels…',
    curves: 'Curves…',
    exposure: 'Exposure…',
    vibrance: 'Vibrance…',
    'hue-saturation': 'Hue/Saturation…',
    'color-balance': 'Color Balance…',
    'black-white': 'Black & White…',
    'photo-filter': 'Photo Filter…',
    'channel-mixer': 'Channel Mixer…',
    'color-lookup': 'Color Lookup…',
    'selective-color': 'Selective Color…',
    invert: 'Invert',
    posterize: 'Posterize…',
    threshold: 'Threshold…',
    'gradient-map': 'Gradient Map…',
    'solid-color': 'Solid Color…',
    gradient: 'Gradient…',
    pattern: 'Pattern…',
  },
  km: {
    title: 'បង្កើត Fill ឬ Adjustment Layer ថ្មី',
    'color-vibrance': 'ពណ៌ និងភាពរស់រវើក…',
    'brightness-contrast': 'ពន្លឺ/កម្រិតផ្ទុយ…',
    levels: 'កម្រិតពន្លឺ…',
    curves: 'ខ្សែកោង…',
    exposure: 'Exposure…',
    vibrance: 'ភាពរស់រវើក…',
    'hue-saturation': 'ពណ៌/ភាពឆ្អែត…',
    'color-balance': 'តុល្យភាពពណ៌…',
    'black-white': 'ខ្មៅ និង ស…',
    'photo-filter': 'តម្រងរូបភាព…',
    'channel-mixer': 'លាយឆានែលពណ៌…',
    'color-lookup': 'Color Lookup…',
    'selective-color': 'ជ្រើសកែពណ៌…',
    invert: 'បញ្ច្រាសពណ៌',
    posterize: 'Posterize…',
    threshold: 'Threshold…',
    'gradient-map': 'ផែនទី Gradient…',
    'solid-color': 'ពណ៌តែមួយ…',
    gradient: 'Gradient…',
    pattern: 'លំនាំ…',
  },
  zh: {
    title: '新建填充或调整图层',
    'color-vibrance': '颜色与鲜艳度…',
    'brightness-contrast': '亮度/对比度…',
    levels: '色阶…',
    curves: '曲线…',
    exposure: '曝光度…',
    vibrance: '自然饱和度…',
    'hue-saturation': '色相/饱和度…',
    'color-balance': '色彩平衡…',
    'black-white': '黑白…',
    'photo-filter': '照片滤镜…',
    'channel-mixer': '通道混合器…',
    'color-lookup': '颜色查找…',
    'selective-color': '可选颜色…',
    invert: '反相',
    posterize: '色调分离…',
    threshold: '阈值…',
    'gradient-map': '渐变映射…',
    'solid-color': '纯色…',
    gradient: '渐变…',
    pattern: '图案…',
  },
  ja: {
    title: '塗りつぶしまたは調整レイヤーを新規作成',
    'color-vibrance': 'カラーと自然な彩度…',
    'brightness-contrast': '明るさ・コントラスト…',
    levels: 'レベル補正…',
    curves: 'トーンカーブ…',
    exposure: '露光量…',
    vibrance: '自然な彩度…',
    'hue-saturation': '色相・彩度…',
    'color-balance': 'カラーバランス…',
    'black-white': '白黒…',
    'photo-filter': 'レンズフィルター…',
    'channel-mixer': 'チャンネルミキサー…',
    'color-lookup': 'カラールックアップ…',
    'selective-color': '特定色域の選択…',
    invert: '階調の反転',
    posterize: 'ポスタリゼーション…',
    threshold: '2階調化…',
    'gradient-map': 'グラデーションマップ…',
    'solid-color': 'べた塗り…',
    gradient: 'グラデーション…',
    pattern: 'パターン…',
  },
  ko: {
    title: '새 칠 또는 조정 레이어 만들기',
    'color-vibrance': '색상 및 활기…',
    'brightness-contrast': '명도/대비…',
    levels: '레벨…',
    curves: '곡선…',
    exposure: '노출…',
    vibrance: '활기…',
    'hue-saturation': '색조/채도…',
    'color-balance': '색상 균형…',
    'black-white': '흑백…',
    'photo-filter': '포토 필터…',
    'channel-mixer': '채널 혼합…',
    'color-lookup': '색상 검색…',
    'selective-color': '선택 색상…',
    invert: '반전',
    posterize: '포스터화…',
    threshold: '한계값…',
    'gradient-map': '그레이디언트 맵…',
    'solid-color': '단색…',
    gradient: '그레이디언트…',
    pattern: '패턴…',
  },
}

const GROUPS = ['quick', 'light', 'color', 'tone', 'fill']

export default function StudioAdjustmentLayerMenu({
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

  const grouped = useMemo(() => GROUPS.map((group) => ({
    group,
    items: STUDIO_ADJUSTMENT_LAYER_ITEMS.filter((item) => item.group === group),
  })), [])

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

  const flatItems = STUDIO_ADJUSTMENT_LAYER_ITEMS

  function focusIndex(index) {
    const next = (index + flatItems.length) % flatItems.length
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
      focusIndex(flatItems.length - 1)
    }
  }

  function choose(item) {
    if (disabled) return
    onSelect?.(item.id)
  }

  let itemIndex = -1

  return createPortal(
    <div
      ref={menuRef}
      className="ss-adjustment-menu"
      role="menu"
      aria-label={words.title}
      style={{ left: position.left, top: position.top }}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <style>{`
        .ss-adjustment-menu{position:fixed;z-index:12350;width:252px;max-height:calc(100dvh - 16px);overflow:auto;padding:6px;border:1px solid #657484;border-radius:8px;background:#252d35;color:#edf3fa;box-shadow:0 12px 32px #0009;font:10px Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overscroll-behavior:contain}
        .ss-adjustment-menu *{box-sizing:border-box}
        .ss-adjustment-menu-title{display:flex;align-items:center;gap:7px;min-height:32px;padding:0 7px 5px;color:#aab8c6;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
        .ss-adjustment-menu-title i{color:#8bc4ff}
        .ss-adjustment-menu-group+.ss-adjustment-menu-group{border-top:1px solid #3b4651;margin-top:5px;padding-top:5px}
        .ss-adjustment-menu-item{display:grid;width:100%;min-height:31px;grid-template-columns:26px minmax(0,1fr) 12px;align-items:center;gap:4px;padding:0 6px;border:1px solid transparent;border-radius:5px;background:transparent;color:#e2ebf4;text-align:left;font:600 10px Inter,ui-sans-serif,system-ui,sans-serif;white-space:nowrap;cursor:pointer}
        .ss-adjustment-menu-item>i:first-child{width:22px;height:22px;display:grid;place-items:center;border-radius:5px;background:#303b46;color:#9fc9ed;font-size:9px}
        .ss-adjustment-menu-item>span{min-width:0;overflow:hidden;text-overflow:ellipsis}
        .ss-adjustment-menu-item>i:last-child{color:#768697;font-size:7px}
        .ss-adjustment-menu-item:hover,.ss-adjustment-menu-item:focus-visible{outline:0;border-color:#6da4d4;background:#355d84;color:#fff}
        .ss-adjustment-menu-item:hover>i:first-child,.ss-adjustment-menu-item:focus-visible>i:first-child{background:#2e77ae;color:#fff}
        .ss-adjustment-menu-item:disabled{opacity:.4;cursor:default;background:transparent}
        @media(max-width:560px),(pointer:coarse){.ss-adjustment-menu{left:8px!important;right:8px;width:auto;max-height:min(72dvh,620px);border-radius:12px;padding:8px}.ss-adjustment-menu-item{min-height:42px;font-size:12px}.ss-adjustment-menu-item>i:first-child{width:28px;height:28px;font-size:11px}.ss-adjustment-menu-group+.ss-adjustment-menu-group{margin-top:5px;padding-top:5px}}
      `}</style>
      <div className="ss-adjustment-menu-title">
        <i className="fa-solid fa-circle-half-stroke" aria-hidden="true" />
        <span>{words.title}</span>
      </div>
      {grouped.map(({ group, items }) => (
        <div className="ss-adjustment-menu-group" role="group" key={group}>
          {items.map((item) => {
            itemIndex += 1
            const currentIndex = itemIndex
            return (
              <button
                key={item.id}
                ref={(node) => { itemRefs.current[currentIndex] = node }}
                type="button"
                className="ss-adjustment-menu-item"
                role="menuitem"
                disabled={disabled}
                onClick={() => choose(item)}
                onKeyDown={(event) => keyDown(event, currentIndex)}
              >
                <i className={`fa-solid ${ADJUSTMENT_ICONS[item.id] || 'fa-circle'}`} aria-hidden="true" />
                <span>{words[item.id] || LABELS.en[item.id]}</span>
                <i className="fa-solid fa-chevron-right" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      ))}
    </div>,
    document.body,
  )
}
