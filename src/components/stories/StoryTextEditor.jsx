import { useEffect, useMemo, useRef, useState } from 'react'
import { getDisplayText } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyTextEditor', {
  en: { done: 'Done', color: 'Background color', font: 'Text style', align: 'Text alignment', placeholder: 'Type something...', classic: 'Classic', modern: 'Modern', typewriter: 'Typewriter', edit: 'Edit text', poster: 'Poster', handwriting: 'Handwriting', rounded: 'Rounded', elegant: 'Elegant', minimal: 'Minimal', retro: 'Retro', neon: 'Neon', suggestedColor: 'Suggested color', moreColors: 'More colors' },
  km: { done: 'រួចរាល់', color: 'ពណ៌ផ្ទៃអក្សរ', font: 'រចនាប័ទ្មអក្សរ', align: 'តម្រឹមអក្សរ', placeholder: 'សរសេរអ្វីមួយ...', classic: 'ធម្មតា', modern: 'ទំនើប', typewriter: 'ម៉ាស៊ីនអង្គុលីលេខ', edit: 'កែអក្សរ', poster: 'ផ្ទាំងប្រកាស', handwriting: 'សរសេរដៃ', rounded: 'មូល', elegant: 'ប្រណីត', minimal: 'សាមញ្ញ', retro: 'បុរាណ', neon: 'ពន្លឺ', suggestedColor: 'ពណ៌ណែនាំ', moreColors: 'ពណ៌ផ្សេងទៀត' },
  zh: { done: '完成', color: '背景颜色', font: '文字样式', align: '文字对齐', placeholder: '输入文字...', classic: '经典', modern: '现代', typewriter: '打字机', edit: '编辑文字', poster: '海报', handwriting: '手写', rounded: '圆润', elegant: '优雅', minimal: '简约', retro: '复古', neon: '霓虹', suggestedColor: '推荐颜色', moreColors: '更多颜色' },
  ja: { done: '完了', color: '背景色', font: '文字スタイル', align: '文字揃え', placeholder: '文字を入力...', classic: 'クラシック', modern: 'モダン', typewriter: 'タイプライター', edit: 'テキストを編集', poster: 'ポスター', handwriting: '手書き', rounded: '丸ゴシック', elegant: 'エレガント', minimal: 'ミニマル', retro: 'レトロ', neon: 'ネオン', suggestedColor: 'おすすめの色', moreColors: '他の色' },
  ko: { done: '완료', color: '배경색', font: '글자 스타일', align: '文字揃え', placeholder: '텍스트 입력...', classic: '클래식', modern: '모던', typewriter: '타자기', edit: '텍스트 편집', poster: '포스터', handwriting: '손글씨', rounded: '둥근 글씨', elegant: '우아함', minimal: '미니멀', retro: '레트로', neon: '네온', suggestedColor: '추천 색상', moreColors: '다른 색상' },
})

export const STORY_TEXT_COLORS = [
  '#162453', '#000000', '#393944', '#FFFFFF', '#E74159', '#F15D22', '#F6C843', '#23965E', '#009CBE', '#335CF1', '#7E3EDD', '#D742AD', 'transparent',
  '#1F2937', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#F9FAFB', '#7F1D1D', '#991B1B', '#DC2626', '#F97316', '#FB923C', '#FDE68A', '#A16207', '#3F6212', '#166534', '#047857', '#0F766E', '#115E59', '#155E75', '#0C4A6E', '#1D4ED8', '#1E40AF', '#3730A3', '#5B21B6', '#6D28D9', '#9333EA', '#A21CAF', '#BE185D', '#DB2777', '#F472B6', '#FBCFE8', '#E0E7FF', '#BAE6FD', '#A7F3D0', '#FEF3C7', '#FEE2E2', '#78350F', '#44403C', '#57534E',
]
export const STORY_TEXT_FONTS = ['classic', 'modern', 'typewriter', 'poster', 'handwriting', 'rounded', 'elegant', 'minimal', 'retro', 'neon']
export const STORY_TEXT_ALIGNMENTS = ['left', 'center', 'right']
const DEFAULT_SUGGESTIONS = ['#162453', '#0F766E', '#7E3EDD', '#393944', '#F6C843']
const HEX_COLOR = /^#[0-9a-f]{6}$/i
const COLOR_ITEM_WIDTH = 54

function normalizeBackground(value) {
  if (value === 'transparent') return value
  const color = String(value || '').toUpperCase()
  return HEX_COLOR.test(color) ? color : '#162453'
}

export function normalizeStoryTextSticker(value) {
  const input = value && typeof value === 'object' ? value : { text: value || '' }
  const number = (key, fallback) => Number.isFinite(Number(input[key])) ? Number(input[key]) : fallback
  return {
    text: String(input.text || '').slice(0, 200),
    background: normalizeBackground(input.background),
    font: STORY_TEXT_FONTS.includes(input.font) ? input.font : 'classic',
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
  const base = { fontFamily: getStoryStickerFont(font), fontWeight: 700, fontStyle: 'normal', letterSpacing: 'normal', textShadow: 'none' }
  if (font === 'handwriting') return { ...base, fontWeight: 500, fontStyle: 'italic' }
  if (font === 'poster') return { ...base, fontWeight: 900, letterSpacing: '0.02em' }
  if (font === 'rounded') return { ...base, fontWeight: 800 }
  if (font === 'elegant') return { ...base, fontWeight: 600, letterSpacing: '0.015em' }
  if (font === 'minimal') return { ...base, fontWeight: 400, letterSpacing: '0.02em' }
  if (font === 'retro') return { ...base, fontWeight: 800, letterSpacing: '0.04em', textShadow: '1px 1px 0 rgba(0,0,0,0.35)' }
  if (font === 'neon') return { ...base, fontWeight: 700, letterSpacing: '0.03em', textShadow: '0 0 5px currentColor, 0 0 15px currentColor' }
  return base
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
        if (choices.length === 5) break
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
  const [mode, setMode] = useState('font')
  const [imageSuggestions, setImageSuggestions] = useState([])
  const textRef = useRef(null)
  const carouselRef = useRef(null)
  const centeredColorRef = useRef(draft.background)
  const translate = (key) => getDisplayText(`storyTextEditor.${key}`)
  const suggested = imageSuggestions.length ? imageSuggestions : DEFAULT_SUGGESTIONS
  const originalBackground = useRef(normalizeStoryTextSticker(value).background).current
  const palette = useMemo(() => Array.from(new Set([...suggested, originalBackground, ...STORY_TEXT_COLORS])), [imageSuggestions, originalBackground])

  useEffect(() => {
    if (!imageUrl) return undefined
    setImageSuggestions([])
    return extractImageSuggestions(imageUrl, setImageSuggestions)
  }, [imageUrl])

  useEffect(() => {
    const node = textRef.current
    if (!node) return
    const typography = getStoryStickerTypography(draft.font)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    let width = 174
    if (context) {
      context.font = `${typography.fontStyle} ${typography.fontWeight} 29px ${typography.fontFamily}`
      const lines = (draft.text || translate('placeholder')).split('\n')
      width = Math.max(110, ...lines.map((line) => context.measureText(line || ' ').width + 8))
    }
    const maxWidth = Math.max(128, Math.min(420, window.innerWidth * 0.78))
    node.style.width = `${Math.min(maxWidth, Math.max(112, Math.ceil(width)))}px`
    node.style.height = '40px'
    node.style.height = `${Math.max(40, Math.min(node.scrollHeight, window.innerHeight * 0.38))}px`
  }, [draft.text, draft.font])

  useEffect(() => {
    if (mode !== 'color') return undefined
    const node = carouselRef.current
    if (!node) return undefined
    const target = palette.indexOf(draft.background)
    if (target < 0) return undefined
    const frame = requestAnimationFrame(() => {
      const item = node.children[target]
      if (item) node.scrollLeft = item.offsetLeft - (node.clientWidth - item.clientWidth) / 2
    })
    return () => cancelAnimationFrame(frame)
  }, [mode, palette])

  const update = (changes) => setDraft((current) => ({ ...current, ...changes }))
  const changeAlignment = () => {
    const index = STORY_TEXT_ALIGNMENTS.indexOf(draft.align)
    update({ align: STORY_TEXT_ALIGNMENTS[(index + 1) % STORY_TEXT_ALIGNMENTS.length] })
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

  return (
    <div className="fixed inset-0 z-[180] flex flex-col overflow-hidden bg-black/65 text-white" role="dialog" aria-modal="true" aria-label={translate('edit')}>
      <header className="relative z-10 mx-auto flex w-full max-w-[680px] items-center gap-3 px-4 pb-2 pt-[max(12px,env(safe-area-inset-top))]">
        <button type="button" onClick={() => setMode('color')} aria-label={translate('color')} aria-pressed={mode === 'color'} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/45">
          <span className={`h-7 w-7 rounded-full shadow ${mode === 'color' ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50' : 'border border-white/80'}`} style={{ background: 'conic-gradient(#e9435f, #e8b72a, #35ae74, #4384ea, #b154c3, #e9435f)' }} />
        </button>
        <button type="button" onClick={() => setMode('font')} aria-label={translate('font')} aria-pressed={mode === 'font'} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[18px] font-extrabold ${mode === 'font' ? 'bg-white text-black' : 'bg-black/45 text-white'}`}>Aa</button>
        <button type="button" onClick={changeAlignment} aria-label={translate('align')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/45"><i className={`fa-solid fa-align-${draft.align} text-[19px]`} /></button>
        <div className="flex-1" />
        <button type="button" onClick={() => onSave?.({ ...draft, text: draft.text.trim() })} className="rounded-[12px] bg-[#303035] px-5 py-2.5 text-[15px] font-semibold text-white">{translate('done')}</button>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center px-4 py-3">
        <div className="inline-flex min-h-[64px] max-w-[88vw] items-center justify-center rounded-[12px] px-4 py-3 shadow-lg" style={{ backgroundColor: draft.background, color: getStoryStickerTextColor(draft.background) }}>
          <textarea ref={textRef} autoFocus rows={1} maxLength={200} value={draft.text} onChange={(event) => update({ text: event.target.value })} placeholder={translate('placeholder')} aria-label={translate('edit')} className="block min-h-[40px] max-w-full resize-none overflow-y-auto border-0 bg-transparent p-0 text-[29px] leading-[1.35] outline-none placeholder:text-current placeholder:opacity-60" style={{ color: 'inherit', textAlign: draft.align, ...getStoryStickerTypography(draft.font), caretColor: 'currentColor' }} />
        </div>
      </main>

      <div className="relative z-10 mx-auto flex min-h-[104px] w-full max-w-[680px] flex-col items-center justify-end pb-3">
        {mode === 'color' ? (
          <>
            <span className="mb-2 rounded-full bg-black/65 px-3 py-1 text-[12px] font-semibold text-white">{suggested.includes(draft.background) ? translate('suggestedColor') : translate('moreColors')}</span>
            <div className="relative w-[min(84vw,310px)] overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
              <div ref={carouselRef} onScroll={handleColorScroll} className="flex h-[64px] w-full items-center overflow-x-auto overscroll-x-contain snap-x snap-mandatory" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingInline: 'calc(50% - 27px)' }} aria-label={translate('color')}>
                {palette.map((color, index) => (
                  <button key={color} type="button" aria-label={color === 'transparent' ? 'Transparent' : color} aria-pressed={draft.background === color} onClick={() => selectColor(color, index)} className="flex h-[58px] w-[54px] shrink-0 snap-center items-center justify-center border-0 bg-transparent p-0" style={{ touchAction: 'pan-x' }}>
                    <span className={`block rounded-full border-2 shadow-md transition-all duration-150 ${draft.background === color ? 'h-[46px] w-[46px] border-white ring-2 ring-white/70' : 'h-[36px] w-[36px] border-white/45'}`} style={{ background: color === 'transparent' ? 'linear-gradient(135deg, #FFFFFF 44%, #e74159 44%, #e74159 56%, #FFFFFF 56%)' : color }} />
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full items-center gap-2 overflow-x-auto px-4 py-3 text-[12px] font-semibold text-white" style={{ scrollbarWidth: 'none' }}>
            {STORY_TEXT_FONTS.map((font) => (
              <button key={font} type="button" onClick={() => update({ font })} aria-pressed={draft.font === font} className={`shrink-0 rounded-full px-4 py-2.5 ${draft.font === font ? 'bg-white text-black' : 'bg-black/55 text-white'}`} style={getStoryStickerTypography(font)}>{translate(font)}</button>
            ))}
          </div>
        )}
      </div>
      <footer className="relative z-10 mx-auto flex w-full max-w-[680px] items-center justify-between px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-1 text-[12px] text-white/75">
        <span>{draft.text.length}/200</span>
        <button type="button" onClick={onClose} className="rounded-full bg-black/50 px-4 py-2 text-white">{getDisplayText('storyComposer.close')}</button>
      </footer>
    </div>
  )
}
