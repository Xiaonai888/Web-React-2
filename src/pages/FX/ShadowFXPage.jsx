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
    effects: 'Effects',
    export: 'Export',
    crop: 'Crop',
    free: 'Free',
    ratio: 'Aspect Ratio',
    rotateLeft: 'Rotate Left',
    rotateRight: 'Rotate Right',
    flipHorizontal: 'Flip Horizontal',
    flipVertical: 'Flip Vertical',
    resetCrop: 'Reset Crop',
    blur: 'Blur',
    grain: 'Grain',
    glow: 'Glow',
    bw: 'B&W',
    pink: 'Pink',
    teal: 'Teal',
    retro: 'Retro',
    bloom: 'Bloom',
    lightLeak: 'Light Leak',
    undo: 'Undo',
    redo: 'Redo',
    format: 'Format',
    quality: 'Quality',
    jpg: 'JPG',
    png: 'PNG',
    webp: 'WebP',
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
    saved: 'Saved to your device.',
    invalidFile: 'Choose a supported image file.',
    fileTooLarge: 'This photo is too large. Maximum file size is 40 MB.',
    dropPhoto: 'Drop photo here',
    shortcuts: 'Shortcuts',
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
    effects: 'បែបផែន',
    export: 'រក្សាទុក',
    crop: 'កាត់រូប',
    free: 'សេរី',
    ratio: 'សមាមាត្រ',
    rotateLeft: 'បង្វិលឆ្វេង',
    rotateRight: 'បង្វិលស្តាំ',
    flipHorizontal: 'ត្រឡប់ផ្ដេក',
    flipVertical: 'ត្រឡប់បញ្ឈរ',
    resetCrop: 'កំណត់ Crop ឡើងវិញ',
    blur: 'ព្រិល',
    grain: 'គ្រាប់ហ្វីល',
    glow: 'ពន្លឺរលោង',
    bw: 'ខ្មៅស',
    pink: 'ផ្កាឈូក',
    teal: 'Teal',
    retro: 'Retro',
    bloom: 'Bloom',
    lightLeak: 'ពន្លឺជ្រៀត',
    undo: 'ថយក្រោយ',
    redo: 'ធ្វើឡើងវិញ',
    format: 'ប្រភេទឯកសារ',
    quality: 'គុណភាព',
    jpg: 'JPG',
    png: 'PNG',
    webp: 'WebP',
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
    saved: 'បានរក្សាទុកទៅឧបករណ៍របស់អ្នក។',
    invalidFile: 'សូមជ្រើសឯកសាររូបភាពដែលគាំទ្រ។',
    fileTooLarge: 'រូបនេះធំពេក។ ទំហំអតិបរមា 40 MB។',
    dropPhoto: 'ទម្លាក់រូបនៅទីនេះ',
    shortcuts: 'គ្រាប់ចុចរហ័ស',
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
    effects: '效果',
    export: '导出',
    crop: '裁剪',
    free: '自由',
    ratio: '宽高比',
    rotateLeft: '向左旋转',
    rotateRight: '向右旋转',
    flipHorizontal: '水平翻转',
    flipVertical: '垂直翻转',
    resetCrop: '重置裁剪',
    blur: '模糊',
    grain: '颗粒',
    glow: '光晕',
    bw: '黑白',
    pink: '粉色',
    teal: '青色',
    retro: '复古',
    bloom: '柔光',
    lightLeak: '漏光',
    undo: '撤销',
    redo: '重做',
    format: '格式',
    quality: '质量',
    jpg: 'JPG',
    png: 'PNG',
    webp: 'WebP',
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
    saved: '已保存到设备。',
    invalidFile: '请选择支持的图片文件。',
    fileTooLarge: '图片过大，最大支持 40 MB。',
    dropPhoto: '将照片拖到这里',
    shortcuts: '快捷键',
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
    effects: 'エフェクト',
    export: '書き出し',
    crop: '切り抜き',
    free: '自由',
    ratio: 'アスペクト比',
    rotateLeft: '左回転',
    rotateRight: '右回転',
    flipHorizontal: '水平反転',
    flipVertical: '垂直反転',
    resetCrop: '切り抜きをリセット',
    blur: 'ぼかし',
    grain: '粒子',
    glow: 'グロー',
    bw: '白黒',
    pink: 'ピンク',
    teal: 'ティール',
    retro: 'レトロ',
    bloom: 'ブルーム',
    lightLeak: 'ライトリーク',
    undo: '元に戻す',
    redo: 'やり直す',
    format: '形式',
    quality: '品質',
    jpg: 'JPG',
    png: 'PNG',
    webp: 'WebP',
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
    saved: '端末に保存しました。',
    invalidFile: '対応している画像ファイルを選択してください。',
    fileTooLarge: '画像が大きすぎます。最大 40 MB です。',
    dropPhoto: 'ここに写真をドロップ',
    shortcuts: 'ショートカット',
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
    effects: '효과',
    export: '내보내기',
    crop: '자르기',
    free: '자유',
    ratio: '화면 비율',
    rotateLeft: '왼쪽 회전',
    rotateRight: '오른쪽 회전',
    flipHorizontal: '좌우 반전',
    flipVertical: '상하 반전',
    resetCrop: '자르기 초기화',
    blur: '블러',
    grain: '그레인',
    glow: '글로우',
    bw: '흑백',
    pink: '핑크',
    teal: '틸',
    retro: '레트로',
    bloom: '블룸',
    lightLeak: '라이트 리크',
    undo: '실행 취소',
    redo: '다시 실행',
    format: '형식',
    quality: '품질',
    jpg: 'JPG',
    png: 'PNG',
    webp: 'WebP',
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
    saved: '기기에 저장했습니다.',
    invalidFile: '지원되는 이미지 파일을 선택하세요.',
    fileTooLarge: '사진이 너무 큽니다. 최대 40 MB입니다.',
    dropPhoto: '여기에 사진 놓기',
    shortcuts: '단축키',
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
  blur: 0,
  grain: 0,
  glow: 0,
  lightLeak: 0,
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

const EFFECT_PRESETS = {
  bw: { ...DEFAULTS, contrast: 14, saturation: -100, highlights: -8, shadows: 8, grain: 12 },
  pink: { ...DEFAULTS, brightness: 7, contrast: -4, saturation: 10, tint: 30, temperature: 5, glow: 18 },
  teal: { ...DEFAULTS, contrast: 8, saturation: 4, temperature: -24, tint: -18, shadows: 10 },
  retro: { ...DEFAULTS, contrast: 9, saturation: -18, temperature: 18, fade: 16, grain: 22, vignette: 10 },
  bloom: { ...DEFAULTS, brightness: 8, contrast: -8, highlights: -12, saturation: 5, glow: 48, blur: 3 },
  lightLeak: { ...DEFAULTS, brightness: 5, contrast: 5, saturation: 9, temperature: 12, lightLeak: 62 },
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

const EFFECT_SLIDERS = [
  ['blur', 0, 20],
  ['grain', 0, 100],
  ['glow', 0, 100],
  ['lightLeak', 0, 100],
]

const EXPORT_FORMATS = [
  { key: 'jpg', mime: 'image/jpeg', extension: 'jpg' },
  { key: 'png', mime: 'image/png', extension: 'png' },
  { key: 'webp', mime: 'image/webp', extension: 'webp' },
]

const DEFAULT_TRANSFORM = {
  rotation: 0,
  flipX: false,
  flipY: false,
  ratio: 'free',
}

const CROP_RATIOS = [
  { key: 'free', value: null },
  { key: '1:1', value: 1 },
  { key: '3:4', value: 3 / 4 },
  { key: '4:3', value: 4 / 3 },
  { key: '9:16', value: 9 / 16 },
  { key: '16:9', value: 16 / 9 },
]

const MAX_FILE_BYTES = 40 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

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

function applyGrain(context, width, height, amount) {
  if (!amount) return
  const imageData = context.getImageData(0, 0, width, height)
  const data = imageData.data
  let seed = 1337
  const strength = amount * 0.55

  for (let index = 0; index < data.length; index += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const noise = ((seed / 4294967295) - 0.5) * strength
    data[index] = clamp(data[index] + noise)
    data[index + 1] = clamp(data[index + 1] + noise)
    data[index + 2] = clamp(data[index + 2] + noise)
  }

  context.putImageData(imageData, 0, 0)
}

function applyLightLeak(context, width, height, amount) {
  if (!amount) return
  const strength = Math.max(0, Math.min(1, amount / 100))
  const gradient = context.createRadialGradient(
    width * 0.12,
    height * 0.28,
    0,
    width * 0.12,
    height * 0.28,
    Math.max(width, height) * 0.85
  )

  gradient.addColorStop(0, `rgba(255,94,94,${0.46 * strength})`)
  gradient.addColorStop(0.28, `rgba(255,169,77,${0.32 * strength})`)
  gradient.addColorStop(0.58, `rgba(255,90,175,${0.18 * strength})`)
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  context.save()
  context.globalCompositeOperation = 'screen'
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)
  context.restore()
}

function applyBlurAndGlow(context, canvas, values) {
  const blurPixels = Math.max(0, Number(values.blur || 0)) * 0.08
  const glow = Math.max(0, Number(values.glow || 0)) / 100
  if (!blurPixels && !glow) return

  const snapshot = document.createElement('canvas')
  snapshot.width = canvas.width
  snapshot.height = canvas.height
  const snapshotContext = snapshot.getContext('2d', { alpha: false })
  if (!snapshotContext) return
  snapshotContext.drawImage(canvas, 0, 0)

  if (blurPixels) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.filter = `blur(${blurPixels}px)`
    context.drawImage(snapshot, 0, 0)
    context.filter = 'none'
  }

  if (glow) {
    const glowSource = document.createElement('canvas')
    glowSource.width = canvas.width
    glowSource.height = canvas.height
    const glowContext = glowSource.getContext('2d', { alpha: false })
    if (!glowContext) return
    glowContext.drawImage(canvas, 0, 0)

    context.save()
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = glow * 0.42
    context.filter = `blur(${2 + glow * 12}px) brightness(1.08)`
    context.drawImage(glowSource, 0, 0)
    context.restore()
  }
}

function Slider({ label, value, min, max, onChange, onStart, onFinish }) {
  return (
    <div className="grid grid-cols-[110px_1fr_42px] items-center gap-3 py-2">
      <span className="truncate text-[12px] font-semibold text-white/88">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onPointerDown={onStart}
        onPointerUp={onFinish}
        onPointerCancel={onFinish}
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
  const adjustmentStartRef = useRef(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [values, setValues] = useState(DEFAULTS)
  const [preset, setPreset] = useState('original')
  const [panel, setPanel] = useState('filters')
  const [compare, setCompare] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dragging, setDragging] = useState(false)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [exportFormat, setExportFormat] = useState('jpg')
  const [exportQuality, setExportQuality] = useState(94)
  const [transform, setTransform] = useState(DEFAULT_TRANSFORM)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target
      const editable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable

      if (editable) return

      const modifier = event.ctrlKey || event.metaKey
      const key = String(event.key || '').toLowerCase()

      if (modifier && key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undoEdit()
        return
      }

      if ((modifier && key === 'y') || (modifier && event.shiftKey && key === 'z')) {
        event.preventDefault()
        redoEdit()
        return
      }

      if (modifier && key === 's') {
        event.preventDefault()
        saveImage()
        return
      }

      if (key === 'r') {
        event.preventDefault()
        resetAll()
        return
      }

      if (key === 'c') {
        setCompare(true)
      }
    }

    function handleKeyUp(event) {
      if (String(event.key || '').toLowerCase() === 'c') {
        setCompare(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  })

  const previewFilter = useMemo(() => {
    const brightness = Math.max(0.2, 1 + values.brightness / 100)
    const contrast = Math.max(0.2, 1 + values.contrast / 100)
    const saturation = Math.max(0, 1 + values.saturation / 100)
    const sepia = Math.max(0, Math.min(0.35, values.temperature / 280))
    const hue = values.tint * 0.12 - Math.min(0, values.temperature) * 0.08
    const blur = Math.max(0, values.blur) * 0.08
    return `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia}) hue-rotate(${hue}deg) blur(${blur}px)`
  }, [values])

  const cropRatio = useMemo(
    () => CROP_RATIOS.find(item => item.key === transform.ratio)?.value || null,
    [transform.ratio]
  )

  const previewTransform = `rotate(${transform.rotation}deg) scaleX(${transform.flipX ? -1 : 1}) scaleY(${transform.flipY ? -1 : 1})`

  function chooseImage(file) {
    if (!file) return
    if (!SUPPORTED_IMAGE_TYPES.has(String(file.type || ''))) {
      setError(t('shadowFx.invalidFile'))
      setNotice('')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t('shadowFx.fileTooLarge'))
      setNotice('')
      return
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setSourceUrl(url)
    setValues(DEFAULTS)
    setPreset('original')
    setPanel('filters')
    setCompare(false)
    setUndoStack([])
    setRedoStack([])
    setTransform({ ...DEFAULT_TRANSFORM })
    adjustmentStartRef.current = null
    setError('')
    setNotice('')
  }

  function snapshot() {
    return {
      values: { ...values },
      transform: { ...transform },
    }
  }

  function rememberCurrent() {
    setUndoStack(stack => [...stack.slice(-29), snapshot()])
    setRedoStack([])
  }

  function applyPreset(key) {
    rememberCurrent()
    setPreset(key)
    setValues({ ...PRESETS[key] })
  }

  function applyEffectPreset(key) {
    const effect = EFFECT_PRESETS[key]
    if (!effect) return
    rememberCurrent()
    setPreset(`effect:${key}`)
    setValues({ ...effect })
  }

  function beginAdjustment() {
    if (!adjustmentStartRef.current) adjustmentStartRef.current = snapshot()
  }

  function finishAdjustment() {
    const start = adjustmentStartRef.current
    adjustmentStartRef.current = null
    if (!start || JSON.stringify(start) === JSON.stringify(snapshot())) return
    setUndoStack(stack => [...stack.slice(-29), start])
    setRedoStack([])
  }

  function updateValue(key, value) {
    setPreset('')
    setValues(current => ({ ...current, [key]: value }))
  }

  function updateTransform(next) {
    rememberCurrent()
    setTransform(current => ({
      ...current,
      ...(typeof next === 'function' ? next(current) : next),
    }))
    setPreset('')
  }

  function undoEdit() {
    if (!undoStack.length) return
    const previous = undoStack[undoStack.length - 1]
    setUndoStack(stack => stack.slice(0, -1))
    setRedoStack(stack => [snapshot(), ...stack.slice(0, 29)])
    setValues({ ...previous.values })
    setTransform({ ...previous.transform })
    setPreset('')
  }

  function redoEdit() {
    if (!redoStack.length) return
    const next = redoStack[0]
    setRedoStack(stack => stack.slice(1))
    setUndoStack(stack => [...stack.slice(-29), snapshot()])
    setValues({ ...next.values })
    setTransform({ ...next.transform })
    setPreset('')
  }

  function resetAll() {
    const clean = {
      values: DEFAULTS,
      transform: DEFAULT_TRANSFORM,
    }
    if (JSON.stringify(snapshot()) !== JSON.stringify(clean)) rememberCurrent()
    setValues({ ...DEFAULTS })
    setTransform({ ...DEFAULT_TRANSFORM })
    setPreset('original')
    setError('')
    setNotice('')
  }

  function resetCrop() {
    if (JSON.stringify(transform) === JSON.stringify(DEFAULT_TRANSFORM)) return
    updateTransform({ ...DEFAULT_TRANSFORM })
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
      const rotation = ((transform.rotation % 360) + 360) % 360
      const quarterTurn = rotation === 90 || rotation === 270
      const desiredRatio = CROP_RATIOS.find(item => item.key === transform.ratio)?.value || null
      const sourceRatio = desiredRatio ? (quarterTurn ? 1 / desiredRatio : desiredRatio) : null

      let cropWidth = image.naturalWidth
      let cropHeight = image.naturalHeight
      let sourceX = 0
      let sourceY = 0

      if (sourceRatio) {
        if (cropWidth / cropHeight > sourceRatio) {
          cropWidth = cropHeight * sourceRatio
          sourceX = (image.naturalWidth - cropWidth) / 2
        } else {
          cropHeight = cropWidth / sourceRatio
          sourceY = (image.naturalHeight - cropHeight) / 2
        }
      }

      const sourcePixels = cropWidth * cropHeight
      const scale = sourcePixels > maxPixels ? Math.sqrt(maxPixels / sourcePixels) : 1
      const width = Math.max(1, Math.round(cropWidth * scale))
      const height = Math.max(1, Math.round(cropHeight * scale))
      const workCanvas = document.createElement('canvas')
      workCanvas.width = width
      workCanvas.height = height
      const workContext = workCanvas.getContext('2d', { alpha: false, willReadFrequently: true })

      if (!workContext) throw new Error('CANVAS_UNAVAILABLE')

      workContext.imageSmoothingEnabled = true
      workContext.imageSmoothingQuality = 'high'
      workContext.drawImage(
        image,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        0,
        0,
        width,
        height
      )

      const imageData = workContext.getImageData(0, 0, width, height)
      workContext.putImageData(applyPixels(imageData, values, width, height), 0, 0)
      applySharpen(workContext, width, height, values.sharpen)
      applyBlurAndGlow(workContext, workCanvas, values)
      applyGrain(workContext, width, height, values.grain)
      applyLightLeak(workContext, width, height, values.lightLeak)

      const canvas = document.createElement('canvas')
      canvas.width = quarterTurn ? height : width
      canvas.height = quarterTurn ? width : height
      const context = canvas.getContext('2d', { alpha: false })

      if (!context) throw new Error('CANVAS_UNAVAILABLE')

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate((rotation * Math.PI) / 180)
      context.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1)
      context.drawImage(workCanvas, -width / 2, -height / 2)

      const format = EXPORT_FORMATS.find(item => item.key === exportFormat) || EXPORT_FORMATS[0]
      const quality = Math.max(0.4, Math.min(1, exportQuality / 100))
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(result => result ? resolve(result) : reject(new Error('EXPORT_FAILED')), format.mime, format.mime === 'image/png' ? undefined : quality)
      })

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `shadow-fx-${Date.now()}.${format.extension}`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setNotice(t('shadowFx.saved'))
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

        <main
          className={`mx-auto flex min-h-[calc(100vh-64px)] max-w-lg flex-col justify-center px-5 pb-20 transition ${dragging ? 'scale-[0.995]' : ''}`}
          onDragEnter={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            chooseImage(event.dataTransfer.files?.[0])
          }}
        >
          <div className={`mx-auto grid h-24 w-24 place-items-center rounded-[30px] border bg-violet-500/10 text-[38px] text-[#9B7CFF] shadow-[0_0_60px_rgba(124,77,255,.16)] ${dragging ? 'border-[#8B5CF6] bg-violet-500/20' : 'border-violet-400/20'}`}>
            <i className="fa-solid fa-wand-magic-sparkles" />
          </div>

          <h1 className="mt-6 text-center text-[30px] font-black tracking-[-0.04em]">
            Shadow <span className="text-[#8B5CF6]">FX</span>
          </h1>
          <p className="mt-2 text-center text-[13px] font-medium text-white/48">{t('shadowFx.subtitle')}</p>
          {dragging ? (
            <div className="mt-5 rounded-[18px] border border-[#8B5CF6]/50 bg-[#8B5CF6]/10 px-4 py-4 text-center text-[13px] font-black text-[#B7A2FF]">
              <i className="fa-solid fa-cloud-arrow-down mr-2" />
              {t('shadowFx.dropPhoto')}
            </div>
          ) : null}

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

          <button
            type="button"
            onClick={undoEdit}
            disabled={!undoStack.length}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/75 disabled:opacity-30"
            aria-label={t('shadowFx.undo')}
          >
            <i className="fa-solid fa-rotate-left text-[12px]" />
          </button>

          <button
            type="button"
            onClick={redoEdit}
            disabled={!redoStack.length}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/75 disabled:opacity-30"
            aria-label={t('shadowFx.redo')}
          >
            <i className="fa-solid fa-rotate-right text-[12px]" />
          </button>

          <button type="button" onClick={resetAll} className="hidden h-10 rounded-xl border border-white/10 px-3 text-[12px] font-bold text-white/75 sm:block">
            {t('shadowFx.reset')}
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
          <section
            className={`relative flex min-h-[46vh] items-center justify-center overflow-hidden rounded-[22px] border bg-[#0D111C] p-2 lg:min-h-[72vh] ${dragging ? 'border-[#8B5CF6]/70' : 'border-white/[0.06]'}`}
            onDragEnter={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false)
            }}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              chooseImage(event.dataTransfer.files?.[0])
            }}
          >
            <div
              className={`relative flex items-center justify-center overflow-hidden ${cropRatio ? 'w-full' : 'max-h-[72vh] max-w-full'}`}
              style={cropRatio ? {
                aspectRatio: String(cropRatio),
                width: `min(100%, calc(72vh * ${cropRatio}))`,
              } : undefined}
            >
              <img
                src={sourceUrl}
                alt=""
                className={cropRatio ? 'h-full w-full select-none object-cover' : 'max-h-[72vh] max-w-full select-none object-contain'}
                draggable="false"
                style={{
                  filter: compare ? undefined : previewFilter,
                  transform: previewTransform,
                }}
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

              {!compare && values.glow > 0 ? (
                <img
                  src={sourceUrl}
                  alt=""
                  className={cropRatio ? 'pointer-events-none absolute inset-0 h-full w-full object-cover' : 'pointer-events-none absolute inset-0 h-full w-full object-contain'}
                  style={{
                    filter: `${previewFilter} blur(${2 + values.glow * 0.1}px) brightness(1.08)`,
                    transform: previewTransform,
                    mixBlendMode: 'screen',
                    opacity: Math.min(0.42, values.glow / 240),
                  }}
                />
              ) : null}

              {!compare && values.grain > 0 ? (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage: 'repeating-radial-gradient(circle at 0 0, rgba(255,255,255,.35) 0 1px, rgba(0,0,0,.35) 1px 2px, transparent 2px 4px)',
                    mixBlendMode: 'overlay',
                    opacity: Math.min(0.32, values.grain / 320),
                  }}
                />
              ) : null}

              {!compare && values.lightLeak > 0 ? (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'radial-gradient(circle at 12% 28%, rgba(255,94,94,.72) 0%, rgba(255,169,77,.48) 24%, rgba(255,90,175,.28) 48%, transparent 78%)',
                    mixBlendMode: 'screen',
                    opacity: Math.min(0.7, values.lightLeak / 125),
                  }}
                />
              ) : null}
            </div>

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
          <div className="mb-3 grid grid-cols-5 gap-1 rounded-[14px] bg-black/20 p-1">
            {[
              ['filters', 'fa-wand-magic-sparkles'],
              ['adjust', 'fa-sliders'],
              ['effects', 'fa-sparkles'],
              ['crop', 'fa-crop-simple'],
              ['export', 'fa-file-export'],
            ].map(([key, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPanel(key)}
                className={`h-10 rounded-[11px] px-1 text-[10px] font-bold sm:text-[11px] ${panel === key ? 'bg-[#7C4DFF] text-white' : 'text-white/55'}`}
              >
                <i className={`fa-solid ${icon} mr-1`} />
                {t(`shadowFx.${key}`)}
              </button>
            ))}
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
          ) : panel === 'adjust' ? (
            <div className="max-h-[58vh] overflow-y-auto pr-1 lg:max-h-[70vh]">
              {SLIDERS.map(([key, min, max]) => (
                <Slider
                  key={key}
                  label={t(`shadowFx.${key}`)}
                  value={values[key]}
                  min={min}
                  max={max}
                  onStart={beginAdjustment}
                  onFinish={finishAdjustment}
                  onChange={value => updateValue(key, value)}
                />
              ))}
            </div>
          ) : panel === 'effects' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(EFFECT_PRESETS).map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyEffectPreset(key)}
                    className={`h-12 rounded-[13px] border text-[10px] font-black ${
                      preset === `effect:${key}`
                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]'
                        : 'border-white/[0.08] bg-white/[0.03] text-white/65'
                    }`}
                  >
                    {t(`shadowFx.${key}`)}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/[0.07] pt-2">
                {EFFECT_SLIDERS.map(([key, min, max]) => (
                  <Slider
                    key={key}
                    label={t(`shadowFx.${key}`)}
                    value={values[key]}
                    min={min}
                    max={max}
                    onStart={beginAdjustment}
                    onFinish={finishAdjustment}
                    onChange={value => updateValue(key, value)}
                  />
                ))}
              </div>
            </div>
          ) : panel === 'crop' ? (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[11px] font-bold text-white/55">{t('shadowFx.ratio')}</div>
                <div className="grid grid-cols-3 gap-2">
                  {CROP_RATIOS.map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => updateTransform({ ratio: item.key })}
                      className={`h-11 rounded-[12px] border text-[11px] font-black ${
                        transform.ratio === item.key
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]'
                          : 'border-white/[0.08] bg-white/[0.03] text-white/60'
                      }`}
                    >
                      {item.key === 'free' ? t('shadowFx.free') : item.key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => updateTransform(current => ({ rotation: (current.rotation - 90 + 360) % 360 }))} className="h-12 rounded-[13px] border border-white/[0.08] bg-white/[0.03] text-[11px] font-bold text-white/70">
                  <i className="fa-solid fa-rotate-left mr-2" />
                  {t('shadowFx.rotateLeft')}
                </button>
                <button type="button" onClick={() => updateTransform(current => ({ rotation: (current.rotation + 90) % 360 }))} className="h-12 rounded-[13px] border border-white/[0.08] bg-white/[0.03] text-[11px] font-bold text-white/70">
                  <i className="fa-solid fa-rotate-right mr-2" />
                  {t('shadowFx.rotateRight')}
                </button>
                <button type="button" onClick={() => updateTransform(current => ({ flipX: !current.flipX }))} className={`h-12 rounded-[13px] border text-[11px] font-bold ${transform.flipX ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]' : 'border-white/[0.08] bg-white/[0.03] text-white/70'}`}>
                  <i className="fa-solid fa-left-right mr-2" />
                  {t('shadowFx.flipHorizontal')}
                </button>
                <button type="button" onClick={() => updateTransform(current => ({ flipY: !current.flipY }))} className={`h-12 rounded-[13px] border text-[11px] font-bold ${transform.flipY ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]' : 'border-white/[0.08] bg-white/[0.03] text-white/70'}`}>
                  <i className="fa-solid fa-up-down mr-2" />
                  {t('shadowFx.flipVertical')}
                </button>
              </div>

              <button
                type="button"
                onClick={resetCrop}
                className="h-11 w-full rounded-[13px] border border-white/10 bg-white/[0.04] text-[11px] font-bold text-white/70"
              >
                <i className="fa-solid fa-crop-simple mr-2" />
                {t('shadowFx.resetCrop')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[11px] font-bold text-white/55">{t('shadowFx.format')}</div>
                <div className="grid grid-cols-3 gap-2">
                  {EXPORT_FORMATS.map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setExportFormat(item.key)}
                      className={`h-11 rounded-[12px] border text-[11px] font-black ${
                        exportFormat === item.key
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#B7A2FF]'
                          : 'border-white/[0.08] bg-white/[0.03] text-white/60'
                      }`}
                    >
                      {t(`shadowFx.${item.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              {exportFormat !== 'png' ? (
                <Slider
                  label={t('shadowFx.quality')}
                  value={exportQuality}
                  min={40}
                  max={100}
                  onChange={setExportQuality}
                />
              ) : null}

              <button
                type="button"
                onClick={saveImage}
                disabled={saving}
                className="h-12 w-full rounded-[14px] bg-[#7C4DFF] text-[12px] font-black disabled:opacity-50"
              >
                <i className={`fa-solid ${saving ? 'fa-spinner animate-spin' : 'fa-download'} mr-2`} />
                {saving ? t('shadowFx.saving') : t('shadowFx.save')}
              </button>
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
          {notice ? <div className="mt-3 rounded-[12px] border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-200">{notice}</div> : null}

          <div className="mt-3 hidden rounded-[12px] border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[10px] font-medium text-white/35 lg:block">
            {t('shadowFx.shortcuts')}: Ctrl/⌘+Z · Ctrl/⌘+Y · Ctrl/⌘+S · R · C
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => { chooseImage(event.target.files?.[0]); event.target.value = '' }} />
        </aside>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#090D16]/96 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {[
            ['filters', 'fa-wand-magic-sparkles'],
            ['adjust', 'fa-sliders'],
            ['effects', 'fa-sparkles'],
            ['crop', 'fa-crop-simple'],
            ['export', 'fa-file-export'],
          ].map(([key, icon]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPanel(key)}
              className={`h-12 rounded-[13px] text-[9px] font-bold ${panel === key ? 'bg-[#7C4DFF]/18 text-[#B7A2FF]' : 'text-white/55'}`}
            >
              <i className={`fa-solid ${icon} mb-1 block text-[13px]`} />
              {t(`shadowFx.${key}`)}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
