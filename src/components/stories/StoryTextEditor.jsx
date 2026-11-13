import { useEffect, useMemo, useRef, useState } from 'react'
import { getDisplayText } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyTextEditor', {
  en: { done: 'Done', color: 'Background color', font: 'Text style', align: 'Text alignment', placeholder: 'Type something...', classic: 'Classic', modern: 'Modern', typewriter: 'Typewriter', edit: 'Edit text', poster: 'Poster', handwriting: 'Handwriting', rounded: 'Rounded', elegant: 'Elegant', minimal: 'Minimal', retro: 'Retro', neon: 'Neon', suggestedColor: 'Suggested color', moreColors: 'More colors', robotoBold: 'Roboto Bold', styleShape: 'Shape', styleInverse: 'Reverse', styleOutline: 'Outline', styleOutlineInverse: 'Reverse outline', stylePlain: 'Text only' },
  km: { done: 'រួចរាល់', color: 'ពណ៌ផ្ទៃអក្សរ', font: 'រចនាប័ទ្មអក្សរ', align: 'តម្រឹមអក្សរ', placeholder: 'សរសេរអ្វីមួយ...', classic: 'ធម្មតា', modern: 'ទំនើប', typewriter: 'ម៉ាស៊ីនអង្គុលីលេខ', edit: 'កែអក្សរ', poster: 'ផ្ទាំងប្រកាស', handwriting: 'សរសេរដៃ', rounded: 'មូល', elegant: 'ប្រណីត', minimal: 'សាមញ្ញ', retro: 'បុរាណ', neon: 'ពន្លឺ', suggestedColor: 'ពណ៌ណែនាំ', moreColors: 'ពណ៌ផ្សេងទៀត', robotoBold: 'Roboto Bold', styleShape: 'មានផ្ទៃពណ៌', styleInverse: 'បញ្ច្រាស់ពណ៌', styleOutline: 'អក្សរមានគែម', styleOutlineInverse: 'គែមបញ្ច្រាស់ពណ៌', stylePlain: 'តែអក្សរ' },
  zh: { done: '完成', color: '背景颜色', font: '文字样式', align: '文字对齐', placeholder: '输入文字...', classic: '经典', modern: '现代', typewriter: '打字机', edit: '编辑文字', poster: '海报', handwriting: '手写', rounded: '圆润', elegant: '优雅', minimal: '简约', retro: '复古', neon: '霓虹', suggestedColor: '推荐颜色', moreColors: '更多颜色', robotoBold: 'Roboto Bold', styleShape: '色块', styleInverse: '反转颜色', styleOutline: '描边', styleOutlineInverse: '反向描边', stylePlain: '纯文字' },
  ja: { done: '完了', color: '背景色', font: '文字スタイル', align: '文字揃え', placeholder: '文字を入力...', classic: 'クラシック', modern: 'モダン', typewriter: 'タイプライター', edit: 'テキストを編集', poster: 'ポスター', handwriting: '手書き', rounded: '丸ゴシック', elegant: 'エレガント', minimal: 'ミニマル', retro: 'レトロ', neon: 'ネオン', suggestedColor: 'おすすめの色', moreColors: '他の色', robotoBold: 'Roboto Bold', styleShape: '背景あり', styleInverse: '色を反転', styleOutline: '縁取り', styleOutlineInverse: '反転縁取り', stylePlain: '文字のみ' },
  ko: { done: '완료', color: '배경색', font: '글자 스타일', align: '文字揃え', placeholder: '텍스트 입력...', classic: '클래식', modern: '모던', typewriter: '타자기', edit: '텍스트 편집', poster: '포스터', handwriting: '손글씨', rounded: '둥근 글씨', elegant: '우아함', minimal: '미니멀', retro: '레트로', neon: '네온', suggestedColor: '추천 색상', moreColors: '다른 색상', robotoBold: 'Roboto Bold', styleShape: '배경', styleInverse: '색상 반전', styleOutline: '외곽선', styleOutlineInverse: '반전 외곽선', stylePlain: '글자만' },
})

registerTranslationNamespace('storyTextColorNames', {
  en: { pink: 'Pink', white: 'White', black: 'Black', gray: 'Gray', red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green', teal: 'Teal', blue: 'Blue', purple: 'Purple', brown: 'Brown', transparent: 'Transparent' },
  km: { pink: 'ផ្កាឈូក', white: 'ស', black: 'ខ្មៅ', gray: 'ប្រផេះ', red: 'ក្រហម', orange: 'ទឹកក្រូច', yellow: 'លឿង', green: 'បៃតង', teal: 'បៃតងខៀវ', blue: 'ខៀវ', purple: 'ស្វាយ', brown: 'ត្នោត', transparent: 'គ្មានផ្ទៃពណ៌' },
  zh: { pink: '粉色', white: '白色', black: '黑色', gray: '灰色', red: '红色', orange: '橙色', yellow: '黄色', green: '绿色', teal: '青绿色', blue: '蓝色', purple: '紫色', brown: '棕色', transparent: '透明' },
  ja: { pink: 'ピンク', white: '白', black: '黒', gray: 'グレー', red: '赤', orange: 'オレンジ', yellow: '黄', green: '緑', teal: '青緑', blue: '青', purple: '紫', brown: '茶色', transparent: '透明' },
  ko: { pink: '분홍색', white: '흰색', black: '검은색', gray: '회색', red: '빨간색', orange: '주황색', yellow: '노란색', green: '초록색', teal: '청록색', blue: '파란색', purple: '보라색', brown: '갈색', transparent: '투명' },
})

export const STORY_TEXT_COLORS = [
  '#162453', '#000000', '#393944', '#FFFFFF', '#E74159', '#F15D22', '#F6C843', '#23965E', '#009CBE', '#335CF1', '#7E3EDD', '#D742AD', 'transparent',
  '#1F2937', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#F9FAFB', '#7F1D1D', '#991B1B', '#DC2626', '#F97316', '#FB923C', '#FDE68A', '#A16207', '#3F6212', '#166534', '#047857', '#0F766E', '#115E59', '#155E75', '#0C4A6E', '#1D4ED8', '#1E40AF', '#3730A3', '#5B21B6', '#6D28D9', '#9333EA', '#A21CAF', '#BE185D', '#DB2777', '#F472B6', '#FBCFE8', '#E0E7FF', '#BAE6FD', '#A7F3D0', '#FEF3C7', '#FEE2E2', '#78350F', '#44403C', '#57534E',
]
export const STORY_TEXT_FONTS = ['classic', 'robotoBold', 'modern', 'typewriter', 'poster', 'handwriting', 'rounded', 'elegant', 'minimal', 'retro', 'neon']
export const STORY_TEXT_ALIGNMENTS = ['left', 'center', 'right']
export const STORY_TEXT_STYLE_MODES = ['shape', 'inverse', 'outline', 'outlineInverse', 'plain']
const DEFAULT_COLOR = '#FFFFFF'
const DEFAULT_SUGGESTIONS = ['#162453', '#0F766E', '#7E3EDD', '#393944']
const HEX_COLOR = /^#[0-9a-f]{6}$/i
const COLOR_ITEM_WIDTH = 54

function normalizeBackground(value) {
  if (value === 'transparent') return value
  const color = String(value || '').toUpperCase()
  return HEX_COLOR.test(color) ? color : DEFAULT_COLOR
}

function getStoryColorName(color) {
  if (color === 'transparent') return getDisplayText('storyTextColorNames.transparent')
  const value = String(color || DEFAULT_COLOR).toUpperCase()
  if (!HEX_COLOR.test(value)) return getDisplayText('storyTextColorNames.blue')
  if (value === '#FFFFFF') return getDisplayText('storyTextColorNames.white')
  if (value === '#000000') return getDisplayText('storyTextColorNames.black')
  const rgb = [1, 3, 5].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255)
  const high = Math.max(...rgb)
  const low = Math.min(...rgb)
  const lightness = (high + low) / 2
  const delta = high - low
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  let key = 'gray'
  if (lightness >= 0.95 && saturation < 0.16) key = 'white'
  else if (lightness <= 0.13 && saturation < 0.20) key = 'black'
  else if (saturation >= 0.16 && delta > 0) {
    const [red, green, blue] = rgb
    const hue = (high === red ? ((green - blue) / delta) % 6 : high === green ? (blue - red) / delta + 2 : (red - green) / delta + 4) * 60
    const angle = (hue + 360) % 360
    if (angle < 13 || angle >= 348) key = 'red'
    else if (angle < 46) key = lightness < 0.38 ? 'brown' : 'orange'
    else if (angle < 72) key = 'yellow'
    else if (angle < 162) key = 'green'
    else if (angle < 196) key = 'teal'
    else if (angle < 255) key = 'blue'
    else if (angle < 294) key = 'purple'
    else key = 'pink'
  }
  return getDisplayText(`storyTextColorNames.${key}`)
}

export function normalizeStoryTextSticker(value) {
  const input = value && typeof value === 'object' ? value : { text: value || '' }
  const number = (key, fallback) => Number.isFinite(Number(input[key])) ? Number(input[key]) : fallback
  return {
    text: String(input.text || '').slice(0, 200),
    background: normalizeBackground(input.background),
    font: STORY_TEXT_FONTS.includes(input.font) ? input.font : 'classic',
    styleMode: STORY_TEXT_STYLE_MODES.includes(input.styleMode) ? input.styleMode : 'shape',
    align: STORY_TEXT_ALIGNMENTS.includes(input.align) ? input.align : 'center',
    x: Math.min(95, Math.max(5, number('x', 50))),
    y: Math.min(92, Math.max(8, number('y', 50))),
    scale: Math.min(3, Math.max(0.45, number('scale', 1))),
    rotation: number('rotation', 0),
  }
}

export function getStoryStickerTextColor(background) {
  if (background === 'transparent') return '#FFFFFF'
  if (!HEX_COLOR.test(background || '')) return '#FFFFFF'
  const value = background.slice(1)
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255)
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722 > 0.43 ? '#10131B' : '#FFFFFF'
}

export function getStoryStickerFont(font) {
  if (font === 'robotoBold') return '"Roboto", Arial, sans-serif'
  if (font === 'typewriter') return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  if (font === 'modern') return 'Georgia, Times New Roman, serif'
  if (font === 'poster') return '"Dangrek", Impact, sans-serif'
  if (font === 'handwriting') return '"Khmer OS Fasthand", "Segoe Print", cursive'
  if (font === 'rounded') return '"Kantumruy Pro", "Arial Rounded MT Bold", sans-serif'
  if (font === 'elegant') return '"Moulpali", "Lora", Georgia, serif'
  if (font === 'minimal') return '"Siemreap", "Roboto", sans-serif'
  if (font === 'retro') return '"Metal", "Courier New", monospace'
  if (font === 'neon') return '"Preahvihear", "Arial Black", sans-serif'
  return 'inherit'
}

export function getStoryStickerTypography(font) {
  const base = { fontFamily: getStoryStickerFont(font), fontWeight: 400, fontStyle: 'normal', letterSpacing: 'normal', textShadow: 'none' }
  if (font === 'robotoBold') return { ...base, fontWeight: 700 }
  if (font === 'handwriting') return { ...base, fontWeight: 400, fontStyle: 'italic' }
  if (font === 'poster') return { ...base, fontWeight: 700 }
  if (font === 'rounded') return { ...base, fontWeight: 600 }
  if (font === 'elegant') return { ...base, fontWeight: 500 }
  if (font === 'minimal') return { ...base, fontWeight: 400 }
  if (font === 'retro') return { ...base, fontWeight: 500 }
  if (font === 'neon') return { ...base, fontWeight: 600 }
  return base
}

export function getStoryStickerAppearance(value) {
  const sticker = normalizeStoryTextSticker(value)
  const transparent = sticker.background === 'transparent'
  const color = transparent ? DEFAULT_COLOR : sticker.background
  const opposite = getStoryStickerTextColor(color)
  const mode = sticker.styleMode
  let backgroundColor = transparent ? 'transparent' : color
  let textColor = transparent ? '#FFFFFF' : opposite
  let outlineColor = ''
  if (mode === 'inverse') {
    backgroundColor = opposite
    textColor = color
  } else if (mode === 'outline') {
    backgroundColor = 'transparent'
    textColor = color
    outlineColor = opposite
  } else if (mode === 'outlineInverse') {
    backgroundColor = 'transparent'
    textColor = opposite
    outlineColor = color
  } else if (mode === 'plain') {
    backgroundColor = 'transparent'
    textColor = color
  }
  return {
    backgroundColor,
    color: textColor,
    WebkitTextStroke: outlineColor ? `1.3px ${outlineColor}` : '0 transparent',
    paintOrder: 'stroke fill',
    textShadow: 'none',
  }
}

function extractImageSuggestions(imageUrl, onReady) {
  const image = new Image()
  image.decoding = 'async'
  let active = true
  image.onload = () => {
    if (!active) return
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 56
      canvas.height = 56
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      const source = Math.min(image.naturalWidth, image.naturalHeight)
      ctx.drawImage(image, (image.naturalWidth - source) / 2, (image.naturalHeight - source) / 2, source, source, 0, 0, 56, 56)
      const pixels = ctx.getImageData(0, 0, 56, 56).data
      const buckets = new Map()
      for (let pixel = 0; pixel < pixels.length; pixel += 16) {
        if (pixels[pixel + 3] < 220) continue
        const red = pixels[pixel]
        const green = pixels[pixel + 1]
        const blue = pixels[pixel + 2]
        const brightness = (Math.max(red, green, blue) + Math.min(red, green, blue)) / 2
        if (brightness < 28 || brightness > 224 || Math.max(red, green, blue) - Math.min(red, green, blue) < 25) continue
        const quantized = [red, green, blue].map((channel) => Math.min(255, Math.round(channel / 24) * 24))
        const key = quantized.map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()
        buckets.set(key, (buckets.get(key) || 0) + 1)
      }
      const candidates = [...buckets.entries()].sort((a, b) => b[1] - a[1]).map(([hex]) => `#${hex}`)
      const choices = []
      for (const color of candidates) {
        const rgb = [1, 3, 5].map((index) => parseInt(color.slice(index, index + 2), 16))
        if (choices.some((existing) => {
          const other = [1, 3, 5].map((index) => parseInt(existing.slice(index, index + 2), 16))
          return Math.hypot(rgb[0] - other[0], rgb[1] - other[1], rgb[2] - other[2]) < 70
        })) continue
        choices.push(color)
        if (choices.length === 4) break
      }
      if (active && choices.length) onReady(choices)
    } catch {
      return
    }
  }
  image.onerror = () => {}
  image.src = imageUrl
  return () => {
    active = false
    image.onload = null
    image.onerror = null
    image.src = ''
  }
}

export default function StoryTextEditor({ value, imageUrl = '', onSave, onClose }) {
  const [draft, setDraft] = useState(() => normalizeStoryTextSticker(value))
  const [mode, setMode] = useState('color')
  const [imageSuggestions, setImageSuggestions] = useState([])
  const [viewport, setViewport] = useState(() => ({
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }))
  const textRef = useRef(null)
  const carouselRef = useRef(null)
  const fontCarouselRef = useRef(null)
  const centeredFontRef = useRef(draft.font)
  const centeredColorRef = useRef(draft.background)
  const translate = (key) => getDisplayText(`storyTextEditor.${key}`)
  const suggested = useMemo(() => Array.from(new Set([...imageSuggestions, ...DEFAULT_SUGGESTIONS].filter((color) => color && color !== '#FFFFFF'))).slice(0, 4), [imageSuggestions])
  const originalBackground = useRef(normalizeStoryTextSticker(value).background).current
  const palette = useMemo(() => Array.from(new Set([...suggested, '#FFFFFF', originalBackground, ...STORY_TEXT_COLORS])), [suggested, originalBackground])
  const appearance = getStoryStickerAppearance(draft)

  useEffect(() => {
    const visual = window.visualViewport
    let frame = 0
    const updateViewport = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const current = window.visualViewport
        const next = {
          top: Math.max(0, Math.round(current?.offsetTop || 0)),
          left: Math.max(0, Math.round(current?.offsetLeft || 0)),
          width: Math.max(240, Math.round(current?.width || window.innerWidth)),
          height: Math.max(120, Math.round(current?.height || window.innerHeight)),
        }
        setViewport((previous) =>
          previous.top === next.top && previous.left === next.left &&
          previous.width === next.width && previous.height === next.height ? previous : next
        )
      })
    }
    updateViewport()
    visual?.addEventListener('resize', updateViewport)
    visual?.addEventListener('scroll', updateViewport)
    window.addEventListener('resize', updateViewport)
    return () => {
      window.cancelAnimationFrame(frame)
      visual?.removeEventListener('resize', updateViewport)
      visual?.removeEventListener('scroll', updateViewport)
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => textRef.current?.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!imageUrl) return undefined
    setImageSuggestions([])
    return extractImageSuggestions(imageUrl, setImageSuggestions)
  }, [imageUrl])

  useEffect(() => {
    const node = textRef.current
    if (!node) return
    const typography = draft.text ? getStoryStickerTypography(draft.font) : { fontFamily: 'system-ui, sans-serif', fontStyle: 'normal', fontWeight: 700 }
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    let width = 174
    if (context) {
      context.font = `${typography.fontStyle} ${typography.fontWeight} 27px ${typography.fontFamily}`
      const lines = (draft.text || 'Type or @Tag').split('\n')
      width = Math.max(draft.text ? 100 : 230, ...lines.map((line) => context.measureText(line || ' ').width + 12))
    }
    const maxWidth = Math.max(140, Math.min(420, viewport.width * 0.86))
    node.style.width = `${Math.min(maxWidth, Math.max(104, Math.ceil(width)))}px`
    node.style.height = '36px'
    node.style.height = `${Math.max(36, Math.min(node.scrollHeight, Math.max(58, Math.min(100, viewport.height * 0.27))))}px`
  }, [draft.text, draft.font, viewport.width, viewport.height])

  useEffect(() => {
    if (mode !== 'color') return undefined
    const node = carouselRef.current
    if (!node) return undefined
    const target = palette.indexOf(draft.background)
    if (target < 0) return undefined
    const frame = window.requestAnimationFrame(() => {
      const item = node.children[target]
      if (item) node.scrollLeft = item.offsetLeft - (node.clientWidth - item.clientWidth) / 2
    })
    return () => window.cancelAnimationFrame(frame)
  }, [mode, palette])

  useEffect(() => {
    if (mode !== 'font') return undefined
    const frame = window.requestAnimationFrame(() => {
      const node = fontCarouselRef.current
      const index = STORY_TEXT_FONTS.indexOf(draft.font)
      const item = node?.children[index]
      if (node && item) node.scrollLeft = item.offsetLeft - (node.clientWidth - item.clientWidth) / 2
    })
    return () => window.cancelAnimationFrame(frame)
  }, [mode])

  const update = (changes) => setDraft((current) => ({ ...current, ...changes }))
  const changeAlignment = () => {
    setDraft((current) => {
      const index = STORY_TEXT_ALIGNMENTS.indexOf(current.align)
      const align = STORY_TEXT_ALIGNMENTS[(index + 1) % STORY_TEXT_ALIGNMENTS.length]
      return { ...current, align, x: align === 'left' ? 20 : align === 'right' ? 80 : 50 }
    })
  }

  const cycleStyle = () => {
    setDraft((current) => {
      const index = STORY_TEXT_STYLE_MODES.indexOf(current.styleMode)
      return { ...current, styleMode: STORY_TEXT_STYLE_MODES[(index + 1) % STORY_TEXT_STYLE_MODES.length] }
    })
  }

  const selectColor = (color, index) => {
    centeredColorRef.current = color
    update({ background: color })
    const node = carouselRef.current
    const item = node?.children[index]
    if (node && item) node.scrollTo({ left: item.offsetLeft - (node.clientWidth - item.clientWidth) / 2, behavior: 'smooth' })
  }

  const handleColorScroll = () => {
    const node = carouselRef.current
    if (!node) return
    const center = node.scrollLeft + node.clientWidth / 2
    const nearest = palette.reduce((result, color, index) => {
      const child = node.children[index]
      if (!child) return result
      const distance = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center)
      return distance < result.distance ? { distance, color } : result
    }, { distance: Infinity, color: '' })
    if (nearest.color && centeredColorRef.current !== nearest.color) {
        centeredColorRef.current = nearest.color
      update({ background: nearest.color })
    }
  }

  const selectFont = (font, index) => {
    centeredFontRef.current = font
    update({ font })
    const node = fontCarouselRef.current
    const item = node?.children[index]
    if (node && item) node.scrollTo({ left: item.offsetLeft - (node.clientWidth - item.clientWidth) / 2, behavior: 'smooth' })
  }

  const handleFontScroll = () => {
    const node = fontCarouselRef.current
    if (!node) return
    const center = node.scrollLeft + node.clientWidth / 2
    const nearest = STORY_TEXT_FONTS.reduce((result, font, index) => {
      const item = node.children[index]
      if (!item) return result
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center)
      return distance < result.distance ? { distance, font } : result
    }, { distance: Infinity, font: '' })
    if (nearest.font && centeredFontRef.current !== nearest.font) {
      centeredFontRef.current = nearest.font
      update({ font: nearest.font })
    }
  }

  const maintainTextFocus = (event) => event.preventDefault()

  return (
    <div
      className="fixed z-[200] flex flex-col overflow-hidden bg-black/60 text-white"
      style={{ top: viewport.top, left: viewport.left, width: viewport.width, height: viewport.height }}
      role="dialog"
      aria-modal="true"
      aria-label={translate('edit')}
    >
      <header className="relative z-10 mx-auto flex w-full max-w-[680px] shrink-0 items-center justify-center gap-1.5 px-3 pb-1 pt-[max(12px,env(safe-area-inset-top))]">
        <button type="button" onPointerDown={maintainTextFocus} onClick={() => setMode((current) => current === 'color' ? null : 'color')} aria-label={translate('color')} aria-pressed={mode === 'color'} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-transparent">
          <span className={`h-[23px] w-[23px] rounded-full border border-white/65 ${mode === 'color' ? 'ring-1 ring-white/80 ring-offset-1 ring-offset-transparent' : ''}`} style={{ background: 'conic-gradient(#e9435f, #e8b72a, #35ae74, #4384ea, #b154c3, #e9435f)' }} />
        </button>
        <button type="button" onPointerDown={maintainTextFocus} onClick={() => setMode((current) => current === 'font' ? null : 'font')} aria-label={translate('font')} aria-pressed={mode === 'font'} className="flex h-9 w-9 shrink-0 items-center justify-center bg-transparent">
          <span className={`flex h-[23px] w-[23px] items-center justify-center rounded-[5px] text-[13px] font-normal ${mode === 'font' ? 'border border-white bg-white text-[#101014]' : 'border border-white/70 bg-transparent text-white'}`}>Aa</span>
        </button>
        <button type="button" onPointerDown={maintainTextFocus} onClick={changeAlignment} aria-label={translate('align')} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-transparent text-white">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" aria-hidden="true">
            <path d={draft.align === 'left' ? 'M4 5h16M4 10h11M4 15h16M4 20h11' : draft.align === 'right' ? 'M4 5h16M9 10h11M4 15h16M9 20h11' : 'M4 5h16M7 10h10M4 15h16M7 20h10'} />
          </svg>
        </button>
        <button type="button" onClick={() => onSave?.({ ...draft, text: draft.text.trim() })} className="absolute right-3 top-[max(12px,env(safe-area-inset-top))] h-9 rounded-lg bg-[#303035] px-4 text-[13px] font-normal text-white">
          {translate('done')}
        </button>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden px-3 py-3">
        <div className="absolute left-1/2 top-[42%] flex w-max max-w-[92%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div
            className="inline-flex max-w-[92%] min-w-[112px] items-center justify-center rounded-[10px] px-3 py-2"
            style={{ backgroundColor: draft.text.trim() ? appearance.backgroundColor : 'transparent', color: draft.text.trim() ? appearance.color : '#FFFFFF' }}
          >
            <textarea
              ref={textRef}
              autoFocus
              rows={1}
              wrap={draft.text ? 'soft' : 'off'}
              maxLength={200}
              value={draft.text}
              onChange={(event) => update({ text: event.target.value })}
              onClick={() => setMode('font')}
              placeholder="Type or @Tag"
              aria-label={translate('edit')}
              className="block min-h-[36px] max-w-full resize-none overflow-y-auto border-0 bg-transparent p-0 text-[27px] leading-[1.35] outline-none placeholder:font-bold placeholder:text-white placeholder:opacity-100"
              style={{ color: 'inherit', textAlign: 'center', ...(draft.text ? getStoryStickerTypography(draft.font) : { fontFamily: 'system-ui, sans-serif', fontWeight: 700, textShadow: 'none' }), WebkitTextStroke: draft.text ? appearance.WebkitTextStroke : '0 transparent', paintOrder: 'stroke fill', caretColor: 'currentColor' }}
            />
          </div>
        </div>

        <div className="absolute inset-x-3 flex flex-col items-center" style={{ top: 'min(calc(42% + 65px), calc(100% - 90px))' }}>
          {mode === 'color' ? (
            <div className="flex w-full flex-col items-center gap-1.5">
              <span className="rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-semibold text-white/90">
                {getStoryColorName(draft.background)}
              </span>
              <div className="relative w-[min(92vw,360px)] max-w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)' }}>
                <div
                  ref={carouselRef}
                  onScroll={handleColorScroll}
                  className="flex h-[48px] w-full items-center overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingInline: 'calc(50% - 22px)' }}
                  aria-label={translate('color')}
                >
                  {palette.map((color, index) => (
                    <button
                      key={color}
                      type="button"
                      onPointerDown={maintainTextFocus}
                      onClick={() => selectColor(color, index)}
                      aria-label={getStoryColorName(color)}
                      aria-pressed={draft.background === color}
                      className="flex h-[46px] w-[44px] shrink-0 snap-center items-center justify-center bg-transparent p-0"
                      style={{ touchAction: 'pan-x' }}
                    >
                      <span
                        className={`block rounded-full border-2 transition-all ${draft.background === color ? 'h-[38px] w-[38px] border-white ring-1 ring-white/75' : 'h-[29px] w-[29px] border-white/55'}`}
                        style={{ background: color === 'transparent' ? 'linear-gradient(135deg, #fff 45%, #e74159 45%, #e74159 55%, #fff 55%)' : color }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : mode === 'font' ? (
            <div className="flex w-full flex-col items-center gap-1.5">
              <button type="button" onPointerDown={maintainTextFocus} onClick={cycleStyle} aria-label={translate(`style${draft.styleMode.charAt(0).toUpperCase()}${draft.styleMode.slice(1)}`)} className="flex h-[24px] min-w-[95px] items-center justify-center rounded-full border border-white/45 bg-black/55 px-3 text-[11px] font-medium text-white">{translate(`style${draft.styleMode.charAt(0).toUpperCase()}${draft.styleMode.slice(1)}`)}</button>
              <div className="relative w-[min(92vw,360px)] max-w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)' }}>
                <div ref={fontCarouselRef} onScroll={handleFontScroll} className="flex h-[48px] w-full items-center overflow-x-auto overscroll-x-contain snap-x snap-mandatory" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingInline: '50%' }} aria-label={translate('font')}>
                  {STORY_TEXT_FONTS.map((font, index) => (
                    <button key={font} type="button" onPointerDown={maintainTextFocus} onClick={() => selectFont(font, index)} aria-pressed={draft.font === font} className={`flex h-9 shrink-0 snap-center items-center justify-center rounded-full px-4 text-[12px] ${draft.font === font ? 'bg-white text-[#101014]' : 'bg-black/45 text-white'}`} style={getStoryStickerTypography(font)}>
                      {translate(font)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
