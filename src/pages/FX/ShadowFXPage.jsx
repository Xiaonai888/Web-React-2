import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('shadowFx', {
  en: {
    title: 'Shadow FX',
    subtitle: 'Photo Editor',
    selectPhoto: 'Select Photo',
    camera: 'Camera',
    original: 'Original',
    natural: 'Natural',
    warm: 'Warm',
    cold: 'Cold',
    film: 'Film',
    vintage: 'Vintage',
    dark: 'Dark',
    soft: 'Soft',
    adjust: 'Adjust',
    filters: 'Filters',
    brightness: 'Brightness',
    contrast: 'Contrast',
    highlights: 'Highlights',
    shadows: 'Shadows',
    saturation: 'Saturation',
    temperature: 'Temperature',
    tint: 'Tint',
    fade: 'Fade',
    vignette: 'Vignette',
    sharpen: 'Sharpen',
    reset: 'Reset',
    compare: 'Compare',
    save: 'Save',
    saving: 'Saving…',
    replace: 'Replace',
    chooseFirst: 'Choose a photo first.',
    failed: 'Could not process this photo on your device.',
  },
  km: {
    title: 'Shadow FX',
    subtitle: 'កម្មវិធីកែរូបភាព',
    selectPhoto: 'ជ្រើសរូបភាព',
    camera: 'កាមេរ៉ា',
    original: 'ដើម',
    natural: 'ធម្មជាតិ',
    warm: 'ក្តៅ',
    cold: 'ត្រជាក់',
    film: 'ហ្វីល',
    vintage: 'វីនតេច',
    dark: 'ងងឹត',
    soft: 'ទន់',
    adjust: 'កែពន្លឺ',
    filters: 'ហ្វីលធ័រ',
    brightness: 'ពន្លឺ',
    contrast: 'កម្រិតផ្ទុយ',
    highlights: 'តំបន់ភ្លឺ',
    shadows: 'តំបន់ងងឹត',
    saturation: 'កម្លាំងពណ៌',
    temperature: 'សីតុណ្ហភាពពណ៌',
    tint: 'ពណ៌បន្ថែម',
    fade: 'ស្រអាប់',
    vignette: 'គែមងងឹត',
    sharpen: 'ភាពច្បាស់',
    reset: 'កំណត់ឡើងវិញ',
    compare: 'ប្រៀបធៀប',
    save: 'រក្សាទុក',
    saving: 'កំពុងរក្សាទុក…',
    replace: 'ប្តូររូប',
    chooseFirst: 'សូមជ្រើសរូបភាពជាមុន។',
    failed: 'មិនអាចកែរូបភាពនេះលើឧបករណ៍បានទេ។',
  },
  zh: {
    title: 'Shadow FX',
    subtitle: '照片编辑器',
    selectPhoto: '选择照片',
    camera: '相机',
    original: '原图',
    natural: '自然',
    warm: '暖色',
    cold: '冷色',
    film: '胶片',
    vintage: '复古',
    dark: '暗调',
    soft: '柔和',
    adjust: '调整',
    filters: '滤镜',
    brightness: '亮度',
    contrast: '对比度',
    highlights: '高光',
    shadows: '阴影',
    saturation: '饱和度',
    temperature: '色温',
    tint: '色调',
    fade: '褪色',
    vignette: '暗角',
    sharpen: '锐化',
    reset: '重置',
    compare: '对比',
    save: '保存',
    saving: '保存中…',
    replace: '更换',
    chooseFirst: '请先选择照片。',
    failed: '无法在此设备上处理这张照片。',
  },
  ja: {
    title: 'Shadow FX',
    subtitle: 'フォトエディター',
    selectPhoto: '写真を選択',
    camera: 'カメラ',
    original: 'オリジナル',
    natural: 'ナチュラル',
    warm: 'ウォーム',
    cold: 'クール',
    film: 'フィルム',
    vintage: 'ヴィンテージ',
    dark: 'ダーク',
    soft: 'ソフト',
    adjust: '調整',
    filters: 'フィルター',
    brightness: '明るさ',
    contrast: 'コントラスト',
    highlights: 'ハイライト',
    shadows: 'シャドウ',
    saturation: '彩度',
    temperature: '色温度',
    tint: '色合い',
    fade: 'フェード',
    vignette: 'ビネット',
    sharpen: 'シャープ',
    reset: 'リセット',
    compare: '比較',
    save: '保存',
    saving: '保存中…',
    replace: '変更',
    chooseFirst: '先に写真を選択してください。',
    failed: 'この端末では写真を処理できませんでした。',
  },
  ko: {
    title: 'Shadow FX',
    subtitle: '사진 편집기',
    selectPhoto: '사진 선택',
    camera: '카메라',
    original: '원본',
    natural: '내추럴',
    warm: '웜',
    cold: '콜드',
    film: '필름',
    vintage: '빈티지',
    dark: '다크',
    soft: '소프트',
    adjust: '조정',
    filters: '필터',
    brightness: '밝기',
    contrast: '대비',
    highlights: '하이라이트',
    shadows: '그림자',
    saturation: '채도',
    temperature: '색온도',
    tint: '틴트',
    fade: '페이드',
    vignette: '비네트',
    sharpen: '선명도',
    reset: '초기화',
    compare: '비교',
    save: '저장',
    saving: '저장 중…',
    replace: '바꾸기',
    chooseFirst: '먼저 사진을 선택하세요.',
    failed: '이 기기에서 사진을 처리할 수 없습니다.',
  },
})

const DEFAULTS = {
  brightness: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  fade: 0,
  vignette: 0,
  sharpen: 0,
}

const PRESETS = {
  original: { ...DEFAULTS },
  natural: { ...DEFAULTS, brightness: 5, contrast: 8, saturation: 8, sharpen: 10 },
  warm: { ...DEFAULTS, brightness: 4, contrast: 6, saturation: 12, temperature: 18, highlights: -5 },
  cold: { ...DEFAULTS, contrast: 7, saturation: -3, temperature: -18, shadows: 8 },
  film: { ...DEFAULTS, contrast: 12, saturation: -8, temperature: 7, fade: 9, vignette: 8 },
  vintage: { ...DEFAULTS, contrast: -4, saturation: -18, temperature: 20, fade: 18, vignette: 12 },
  dark: { ...DEFAULTS, brightness: -12, contrast: 20, shadows: -8, saturation: -5, vignette: 18 },
  soft: { ...DEFAULTS, brightness: 10, contrast: -12, highlights: -12, shadows: 18, saturation: -5, fade: 7 },
}

const SLIDERS = [
  ['brightness', -100, 100],
  ['contrast', -100, 100],
  ['highlights', -100, 100],
  ['shadows', -100, 100],
  ['saturation', -100, 100],
  ['temperature', -100, 100],
  ['tint', -100, 100],
  ['fade', 0, 100],
  ['vignette', 0, 100],
  ['sharpen', 0, 100],
]

function clamp(value) {
  return Math.max(0, Math.min(255, value))
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

function applyPixels(imageData, values, width, height) {
  const data = imageData.data
  const contrastFactor = (259 * (values.contrast + 255)) / (255 * (259 - values.contrast))
  const sat = 1 + values.saturation / 100
  const temp = values.temperature * 0.45
  const tint = values.tint * 0.3
  const fade = values.fade / 100
  const vignette = values.vignette / 100
  const cx = width / 2
  const cy = height / 2
  const maxDistance = Math.sqrt(cx * cx + cy * cy)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      const lum0 = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const shadowWeight = Math.max(0, 1 - lum0 / 150)
      const highlightWeight = Math.max(0, (lum0 - 105) / 150)
      const tonal = values.shadows * shadowWeight * 0.65 + values.highlights * highlightWeight * 0.65
      const bright = values.brightness * 1.15 + tonal

      r += bright + temp + Math.max(0, tint)
      g += bright - Math.abs(tint) * 0.45
      b += bright - temp + Math.max(0, tint)

      r = contrastFactor * (r - 128) + 128
      g = contrastFactor * (g - 128) + 128
      b = contrastFactor * (b - 128) + 128

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      r = lum + (r - lum) * sat
      g = lum + (g - lum) * sat
      b = lum + (b - lum) * sat

      if (fade > 0) {
        r = r * (1 - fade * 0.28) + 190 * fade * 0.28
        g = g * (1 - fade * 0.28) + 185 * fade * 0.28
        b = b * (1 - fade * 0.28) + 180 * fade * 0.28
      }

      if (vignette > 0) {
        const dx = x - cx
        const dy = y - cy
        const distance = Math.sqrt(dx * dx + dy * dy) / maxDistance
        const shade = 1 - Math.max(0, distance - 0.3) * vignette * 0.75
        r *= shade
        g *= shade
        b *= shade
      }

      data[i] = clamp(r)
      data[i + 1] = clamp(g)
      data[i + 2] = clamp(b)
    }
  }

  return imageData
}

function applySharpen(context, width, height, amount) {
  if (!amount) return
  const source = context.getImageData(0, 0, width, height)
  const output = context.createImageData(width, height)
  const src = source.data
  const dst = output.data
  const strength = Math.min(1, amount / 100) * 0.7

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        dst[i] = src[i]
        dst[i + 1] = src[i + 1]
        dst[i + 2] = src[i + 2]
        dst[i + 3] = src[i + 3]
        continue
      }
      const left = i - 4
      const right = i + 4
      const up = i - width * 4
      const down = i + width * 4
      for (let c = 0; c < 3; c += 1) {
        const sharpened = src[i + c] * 5 - src[left + c] - src[right + c] - src[up + c] - src[down + c]
        dst[i + c] = clamp(src[i + c] * (1 - strength) + sharpened * strength)
      }
      dst[i + 3] = src[i + 3]
    }
  }

  context.putImageData(output, 0, 0)
}

function Slider({ label, value, min, max, onChange }) {
  return (
    <div className="grid grid-cols-[110px_1fr_42px] items-center gap-3 py-2">
      <span className="truncate text-[12px] font-semibold text-white/88">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#7C4DFF]"
      />
      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-center text-[11px] font-bold text-white/75">
        {value}
      </span>
    </div>
  )
}

export default function ShadowFXPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const objectUrlRef = useRef('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [values, setValues] = useState(DEFAULTS)
  const [preset, setPreset] = useState('original')
  const [panel, setPanel] = useState('filters')
  const [compare, setCompare] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const previewFilter = useMemo(() => {
    const brightness = Math.max(0.2, 1 + values.brightness / 100)
    const contrast = Math.max(0.2, 1 + values.contrast / 100)
    const saturation = Math.max(0, 1 + values.saturation / 100)
    const sepia = Math.max(0, Math.min(0.35, values.temperature / 280))
    const hue = values.tint * 0.12 - Math.min(0, values.temperature) * 0.08
    return `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia}) hue-rotate(${hue}deg)`
  }, [values])

  function chooseImage(file) {
    if (!file || !String(file.type || '').startsWith('image/')) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setSourceUrl(url)
    setValues(DEFAULTS)
    setPreset('original')
    setPanel('filters')
    setCompare(false)
    setError('')
  }

  function applyPreset(key) {
    setPreset(key)
    setValues(PRESETS[key])
  }

  function updateValue(key, value) {
    setPreset('')
    setValues(current => ({ ...current, [key]: value }))
  }

  function resetAll() {
    setValues(DEFAULTS)
    setPreset('original')
    setError('')
  }

  async function saveImage() {
    if (!sourceUrl || saving) {
      if (!sourceUrl) setError(t('shadowFx.chooseFirst'))
      return
    }

    setSaving(true)
    setError('')

    try {
      const image = await loadImage(sourceUrl)
      const maxPixels = 20_000_000
      const sourcePixels = image.naturalWidth * image.naturalHeight
      const scale = sourcePixels > maxPixels ? Math.sqrt(maxPixels / sourcePixels) : 1
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true })

      if (!context) throw new Error('CANVAS_UNAVAILABLE')

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, width, height)

      const imageData = context.getImageData(0, 0, width, height)
      context.putImageData(applyPixels(imageData, values, width, height), 0, 0)
      applySharpen(context, width, height, values.sharpen)

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(result => result ? resolve(result) : reject(new Error('EXPORT_FAILED')), 'image/jpeg', 0.94)
      })

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `shadow-fx-${Date.now()}.jpg`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setError(t('shadowFx.failed'))
    } finally {
      setSaving(false)
    }
  }

  const presetKeys = Object.keys(PRESETS)

  if (!sourceUrl) {
    return (
      <div className="min-h-screen bg-[#070A12] text-white">
        <header className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <button type="button" onClick={() => navigate(-1)} className="grid h-11 w-11 place-items-center rounded-full active:bg-white/5">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <div className="ml-2">
            <div className="text-[22px] font-black tracking-[-0.03em]">
              Shadow <span className="text-[#8B5CF6]">FX</span>
            </div>
            <div className="text-[10px] font-semibold text-white/45">{t('shadowFx.subtitle')}</div>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-lg flex-col justify-center px-5 pb-20">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-[30px] border border-violet-400/20 bg-violet-500/10 text-[38px] text-[#9B7CFF] shadow-[0_0_60px_rgba(124,77,255,.16)]">
            <i className="fa-solid fa-wand-magic-sparkles" />
          </div>

          <h1 className="mt-6 text-center text-[30px] font-black tracking-[-0.04em]">
            Shadow <span className="text-[#8B5CF6]">FX</span>
          </h1>
          <p className="mt-2 text-center text-[13px] font-medium text-white/48">{t('shadowFx.subtitle')}</p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-9 h-14 rounded-[18px] bg-gradient-to-r from-[#7047EB] to-[#8B5CF6] text-[15px] font-black shadow-[0_16px_42px_rgba(124,77,255,.26)] active:scale-[0.99]"
          >
            <i className="fa-regular fa-image mr-2" />
            {t('shadowFx.selectPhoto')}
          </button>

          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="mt-3 h-14 rounded-[18px] border border-white/10 bg-white/[0.045] text-[14px] font-bold text-white/88 active:scale-[0.99]"
          >
            <i className="fa-solid fa-camera mr-2" />
            {t('shadowFx.camera')}
          </button>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => { chooseImage(event.target.files?.[0]); event.target.value = '' }} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={event => { chooseImage(event.target.files?.[0]); event.target.value = '' }} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070A12]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3">
          <button type="button" onClick={() => navigate(-1)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-white/5">
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-black">
              Shadow <span className="text-[#8B5CF6]">FX</span>
            </div>
          </div>

          <button
            type="button"
            onPointerDown={() => setCompare(true)}
            onPointerUp={() => setCompare(false)}
            onPointerCancel={() => setCompare(false)}
            onPointerLeave={() => setCompare(false)}
            className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-[12px] font-bold text-white/75 sm:flex"
          >
            <i className="fa-regular fa-eye" />
            {t('shadowFx.compare')}
          </button>

          <button type="button" onClick={resetAll} className="h-10 rounded-xl border border-white/10 px-3 text-[12px] font-bold text-white/75">
            <i className="fa-solid fa-rotate-left sm:mr-2" />
            <span className="hidden sm:inline">{t('shadowFx.reset')}</span>
          </button>

          <button
            type="button"
            onClick={saveImage}
            disabled={saving}
            className="h-10 rounded-xl bg-[#7C4DFF] px-4 text-[12px] font-black shadow-[0_8px_24px_rgba(124,77,255,.22)] disabled:opacity-50"
          >
            <i className={`fa-solid ${saving ? 'fa-spinner animate-spin' : 'fa-download'} mr-2`} />
            {saving ? t('shadowFx.saving') : t('shadowFx.save')}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-3 pb-28 pt-3 lg:grid-cols-[1fr_340px] lg:pb-6">
        <div className="min-w-0">
          <section className="relative flex min-h-[46vh] items-center justify-center overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#0D111C] lg:min-h-[72vh]">
            <img
              src={sourceUrl}
              alt=""
              className="max-h-[72vh] max-w-full select-none object-contain"
              draggable="false"
              style={compare ? undefined : { filter: previewFilter }}
            />

            {!compare && values.fade > 0 ? (
              <div className="pointer-events-none absolute inset-0 bg-[#D9CFC6]" style={{ opacity: values.fade / 500 }} />
            ) : null}

            {!compare && values.vignette > 0 ? (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, transparent 35%, rgba(0,0,0,${Math.min(0.75, values.vignette / 120)}) 100%)`,
                }}
              />
            ) : null}

            <button
              type="button"
              onPointerDown={() => setCompare(true)}
              onPointerUp={() => setCompare(false)}
              onPointerCancel={() => setCompare(false)}
              onPointerLeave={() => setCompare(false)}
              className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur sm:hidden"
              aria-label={t('shadowFx.compare')}
            >
              <i className="fa-solid fa-code-compare" />
            </button>
          </section>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {presetKeys.map(key => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`shrink-0 rounded-[15px] border px-4 py-3 text-[11px] font-bold transition ${
                  preset === key
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]'
                    : 'border-white/[0.08] bg-white/[0.035] text-white/65'
                }`}
              >
                {t(`shadowFx.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-[22px] border border-white/[0.06] bg-[#0D111C] p-3 lg:self-start">
          <div className="mb-3 grid grid-cols-2 gap-2 rounded-[14px] bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setPanel('filters')}
              className={`h-10 rounded-[11px] text-[12px] font-bold ${panel === 'filters' ? 'bg-[#7C4DFF] text-white' : 'text-white/55'}`}
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2" />
              {t('shadowFx.filters')}
            </button>
            <button
              type="button"
              onClick={() => setPanel('adjust')}
              className={`h-10 rounded-[11px] text-[12px] font-bold ${panel === 'adjust' ? 'bg-[#7C4DFF] text-white' : 'text-white/55'}`}
            >
              <i className="fa-solid fa-sliders mr-2" />
              {t('shadowFx.adjust')}
            </button>
          </div>

          {panel === 'filters' ? (
            <div className="grid grid-cols-2 gap-2">
              {presetKeys.map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className={`rounded-[14px] border px-3 py-4 text-[12px] font-bold ${
                    preset === key
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]'
                      : 'border-white/[0.07] bg-white/[0.03] text-white/65'
                  }`}
                >
                  {t(`shadowFx.${key}`)}
                </button>
              ))}
            </div>
          ) : (
            <div className="max-h-[58vh] overflow-y-auto pr-1 lg:max-h-[70vh]">
              {SLIDERS.map(([key, min, max]) => (
                <Slider
                  key={key}
                  label={t(`shadowFx.${key}`)}
                  value={values[key]}
                  min={min}
                  max={max}
                  onChange={value => updateValue(key, value)}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-3 h-11 w-full rounded-[13px] border border-white/10 bg-white/[0.04] text-[12px] font-bold text-white/70"
          >
            <i className="fa-regular fa-image mr-2" />
            {t('shadowFx.replace')}
          </button>

          {error ? <div className="mt-3 rounded-[12px] border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-200">{error}</div> : null}

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => { chooseImage(event.target.files?.[0]); event.target.value = '' }} />
        </aside>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#090D16]/96 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPanel('filters')}
            className={`h-12 rounded-[15px] text-[12px] font-bold ${panel === 'filters' ? 'bg-[#7C4DFF]/18 text-[#B7A2FF]' : 'text-white/55'}`}
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-2" />
            {t('shadowFx.filters')}
          </button>
          <button
            type="button"
            onClick={() => setPanel('adjust')}
            className={`h-12 rounded-[15px] text-[12px] font-bold ${panel === 'adjust' ? 'bg-[#7C4DFF]/18 text-[#B7A2FF]' : 'text-white/55'}`}
          >
            <i className="fa-solid fa-sliders mr-2" />
            {t('shadowFx.adjust')}
          </button>
        </div>
      </nav>
    </div>
  )
}
