import { useEffect, useRef, useState } from 'react'
import { getDisplayText } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyTextEditor', {
  en: { done: 'Done', color: 'Background color', font: 'Text style', align: 'Text alignment', placeholder: 'Type something...', classic: 'Classic', modern: 'Modern', typewriter: 'Typewriter', edit: 'Edit text', poster: 'Poster', handwriting: 'Handwriting', rounded: 'Rounded', elegant: 'Elegant', minimal: 'Minimal', retro: 'Retro', neon: 'Neon' },
  km: { done: 'រួចរាល់', color: 'ពណ៌ផ្ទៃអក្សរ', font: 'រចនាប័ទ្មអក្សរ', align: 'តម្រឹមអក្សរ', placeholder: 'សរសេរអ្វីមួយ...', classic: 'ធម្មតា', modern: 'ទំនើប', typewriter: 'ម៉ាស៊ីនអង្គុលីលេខ', edit: 'កែអក្សរ', poster: 'ផ្ទាំងប្រកាស', handwriting: 'សរសេរដៃ', rounded: 'មូល', elegant: 'ប្រណីត', minimal: 'សាមញ្ញ', retro: 'បុរាណ', neon: 'ពន្លឺ' },
  zh: { done: '完成', color: '背景颜色', font: '文字样式', align: '文字对齐', placeholder: '输入文字...', classic: '经典', modern: '现代', typewriter: '打字机', edit: '编辑文字', poster: '海报', handwriting: '手写', rounded: '圆润', elegant: '优雅', minimal: '简约', retro: '复古', neon: '霓虹' },
  ja: { done: '完了', color: '背景色', font: '文字スタイル', align: '文字揃え', placeholder: '文字を入力...', classic: 'クラシック', modern: 'モダン', typewriter: 'タイプライター', edit: 'テキストを編集', poster: 'ポスター', handwriting: '手書き', rounded: '丸ゴシック', elegant: 'エレガント', minimal: 'ミニマル', retro: 'レトロ', neon: 'ネオン' },
  ko: { done: '완료', color: '배경색', font: '글자 스타일', align: '글자 정렬', placeholder: '텍스트 입력...', classic: '클래식', modern: '모던', typewriter: '타자기', edit: '텍스트 편집', poster: '포스터', handwriting: '손글씨', rounded: '둥근 글씨', elegant: '우아함', minimal: '미니멀', retro: '레트로', neon: '네온' },
})

export const STORY_TEXT_COLORS = ['#162453', '#000000', '#393944', '#FFFFFF', '#E74159', '#F15D22', '#F6C843', '#23965E', '#009CBE', '#335CF1', '#7E3EDD', '#D742AD', 'transparent']
export const STORY_TEXT_FONTS = ['classic', 'modern', 'typewriter', 'poster', 'handwriting', 'rounded', 'elegant', 'minimal', 'retro', 'neon']
export const STORY_TEXT_ALIGNMENTS = ['left', 'center', 'right']

export function normalizeStoryTextSticker(value) {
  const input = value && typeof value === 'object' ? value : { text: value || '' }
  const number = (key, fallback) => Number.isFinite(Number(input[key])) ? Number(input[key]) : fallback
  return {
    text: String(input.text || '').slice(0, 200),
    background: STORY_TEXT_COLORS.includes(input.background) ? input.background : '#162453',
    font: STORY_TEXT_FONTS.includes(input.font) ? input.font : 'classic',
    align: STORY_TEXT_ALIGNMENTS.includes(input.align) ? input.align : 'center',
    x: Math.min(95, Math.max(5, number('x', 50))),
    y: Math.min(92, Math.max(8, number('y', 50))),
    scale: Math.min(3, Math.max(0.45, number('scale', 1))),
    rotation: number('rotation', 0),
  }
}

export function getStoryStickerTextColor(background) {
  if (background === '#FFFFFF' || background === '#F6C843') return '#10131B'
  return '#FFFFFF'
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

export default function StoryTextEditor({ value, onSave, onClose }) {
  const [draft, setDraft] = useState(() => normalizeStoryTextSticker(value))
  const [showColors, setShowColors] = useState(false)
  const textRef = useRef(null)
  const translate = (key) => getDisplayText(`storyTextEditor.${key}`)

  useEffect(() => {
    const node = textRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.max(40, node.scrollHeight)}px`
  }, [draft.text, draft.font])

  const update = (changes) => setDraft((current) => ({ ...current, ...changes }))
  const changeFont = () => {
    const index = STORY_TEXT_FONTS.indexOf(draft.font)
    update({ font: STORY_TEXT_FONTS[(index + 1) % STORY_TEXT_FONTS.length] })
  }
  const changeAlignment = () => {
    const index = STORY_TEXT_ALIGNMENTS.indexOf(draft.align)
    update({ align: STORY_TEXT_ALIGNMENTS[(index + 1) % STORY_TEXT_ALIGNMENTS.length] })
  }

  return (
    <div className="fixed inset-0 z-[180] flex flex-col bg-black/75 text-white" role="dialog" aria-modal="true" aria-label={translate('edit')}>
      <div className="relative z-10 mx-auto flex w-full max-w-[680px] items-center justify-between gap-2 px-3 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
        <button type="button" onClick={() => setShowColors((current) => !current)} aria-label={translate('color')} aria-expanded={showColors} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/50">
          <span className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: 'conic-gradient(#e9435f, #e8b72a, #35ae74, #4384ea, #b154c3, #e9435f)' }} />
        </button>
        <button type="button" onClick={changeFont} aria-label={translate('font')} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/50 text-[19px] font-bold">Aa</button>
        <button type="button" onClick={changeAlignment} aria-label={translate('align')} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/50">
          <i className={`fa-solid fa-align-${draft.align} text-[20px]`} />
        </button>
        <div className="flex-1" />
        <button type="button" onClick={() => onSave?.({ ...draft, text: draft.text.trim() })} className="rounded-[12px] bg-[#303035] px-5 py-2.5 text-[15px] font-semibold text-white">{translate('done')}</button>
      </div>

      {showColors ? (
        <div className="relative z-20 mx-auto flex w-full max-w-[680px] flex-wrap justify-center gap-2 px-4 py-2" aria-label={translate('color')}>
          {STORY_TEXT_COLORS.map((color) => (
            <button key={color} type="button" aria-label={color === 'transparent' ? 'Transparent' : color} aria-pressed={draft.background === color} onClick={() => { update({ background: color }); setShowColors(false) }} className={`h-9 w-9 rounded-full border-2 ${draft.background === color ? 'border-white ring-2 ring-white/40' : 'border-white/35'}`} style={{ background: color === 'transparent' ? 'linear-gradient(135deg, #ffffff 45%, #eb425b 45%, #eb425b 55%, #ffffff 55%)' : color }} />
          ))}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-5 py-8">
        <div className="w-full max-w-[500px] text-center">
          <div className="inline-flex min-h-[70px] max-w-full items-center justify-center rounded-[12px] px-4 py-2.5 shadow-lg" style={{ backgroundColor: draft.background, color: getStoryStickerTextColor(draft.background) }}>
            <textarea ref={textRef} autoFocus rows={1} maxLength={200} value={draft.text} onChange={(event) => update({ text: event.target.value })} placeholder={translate('placeholder')} aria-label={translate('edit')} className="block max-h-[42vh] min-h-[40px] w-[min(77vw,420px)] resize-none overflow-y-auto border-0 bg-transparent p-0 text-[29px] font-bold leading-tight outline-none placeholder:text-current placeholder:opacity-60" style={{ color: 'inherit', textAlign: draft.align, ...getStoryStickerTypography(draft.font), caretColor: 'currentColor' }} />
          </div>
          <div className="mx-auto mt-4 flex max-w-full items-center gap-2 overflow-x-auto px-2 pb-2 text-[12px] font-semibold text-white/85">
            {STORY_TEXT_FONTS.map((font) => (
              <button key={font} type="button" onClick={() => update({ font })} aria-pressed={draft.font === font} className={`shrink-0 rounded-full px-4 py-2 ${draft.font === font ? 'bg-white text-black' : 'bg-black/50 text-white'}`} style={getStoryStickerTypography(font)}>{translate(font)}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 text-[12px] text-white/70">
        <span>{draft.text.length}/200</span>
        <button type="button" onClick={onClose} className="rounded-full bg-white/15 px-4 py-2 text-white">{getDisplayText('storyComposer.close')}</button>
      </div>
    </div>
  )
}
