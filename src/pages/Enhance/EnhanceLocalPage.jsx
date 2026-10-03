import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('enhanceLocal', {
  en: {
    title: 'Enhance Local',
    subtitle: 'Free local AI image enhancer',
    back: 'Back',
    before: 'Before',
    after: 'After',
    upload: 'Upload Image',
    drop: 'Drop image here or tap to choose',
    uploadHint: 'Image stays on your device • No server upload',
    upscale: 'AI Upscale',
    denoise: 'Denoise',
    sharpen: 'Sharpen',
    intensity: 'Intensity',
    loadingAi: 'Loading AI model',
    processing: 'AI processing locally',
    privateLine: 'Private • Local AI • No image upload',
    preview: 'Preview',
    enhance: 'Enhance',
    download: 'Download Result',
    footer: 'Best for manga, cover art, and story images',
    chooseFirst: 'Choose an image first.',
    failed: 'Could not enhance this image on your device.',
    aiUnavailable: 'Could not load the local AI model. Check your connection and try again.',
    tooLarge: 'This image is too large for the selected AI upscale size on this device.',
    ready: 'Ready',
    original: 'Original',
    output: 'Output',
  },
  km: {
    title: 'Enhance Local',
    subtitle: 'កម្មវិធី AI កែលម្អរូបភាពដោយប្រើឧបករណ៍របស់អ្នក',
    back: 'ត្រឡប់ក្រោយ',
    before: 'មុន',
    after: 'ក្រោយ',
    upload: 'បញ្ចូលរូបភាព',
    drop: 'ទម្លាក់រូបភាពទីនេះ ឬចុចដើម្បីជ្រើស',
    uploadHint: 'រូបភាពនៅលើឧបករណ៍របស់អ្នក • មិន Upload ទៅ Server',
    upscale: 'AI ពង្រីក',
    denoise: 'កាត់បន្ថយ Noise',
    sharpen: 'ធ្វើឱ្យច្បាស់',
    intensity: 'កម្លាំង',
    loadingAi: 'កំពុងផ្ទុក AI Model',
    processing: 'AI កំពុងដំណើរការក្នុងឧបករណ៍',
    privateLine: 'ឯកជន • Local AI • មិន Upload រូបភាព',
    preview: 'មើលមុន',
    enhance: 'កែលម្អ',
    download: 'ទាញយកលទ្ធផល',
    footer: 'សមសម្រាប់ Manga, Cover Art និងរូបភាពរឿង',
    chooseFirst: 'សូមជ្រើសរូបភាពជាមុន។',
    failed: 'មិនអាចកែលម្អរូបភាពនេះលើឧបករណ៍បានទេ។',
    aiUnavailable: 'មិនអាចផ្ទុក AI Model បានទេ។ សូមពិនិត្យអ៊ីនធឺណិត ហើយព្យាយាមម្ដងទៀត។',
    tooLarge: 'រូបភាពនេះធំពេកសម្រាប់ទំហំ AI ពង្រីកដែលបានជ្រើសលើឧបករណ៍នេះ។',
    ready: 'រួចរាល់',
    original: 'រូបដើម',
    output: 'លទ្ធផល',
  },
  zh: {
    title: 'Enhance Local',
    subtitle: '免费的本地 AI 图片增强器',
    back: '返回',
    before: '之前',
    after: '之后',
    upload: '上传图片',
    drop: '拖放图片到这里或点击选择',
    uploadHint: '图片保留在设备上 • 不上传服务器',
    upscale: 'AI 放大',
    denoise: '降噪',
    sharpen: '锐化',
    intensity: '强度',
    loadingAi: '正在加载 AI 模型',
    processing: 'AI 正在本地处理',
    privateLine: '私密 • 本地 AI • 不上传图片',
    preview: '预览',
    enhance: '增强',
    download: '下载结果',
    footer: '适合漫画、封面和故事图片',
    chooseFirst: '请先选择图片。',
    failed: '无法在此设备上增强这张图片。',
    aiUnavailable: '无法加载本地 AI 模型。请检查网络后重试。',
    tooLarge: '这张图片对于当前设备所选的 AI 放大尺寸来说太大。',
    ready: '就绪',
    original: '原图',
    output: '输出',
  },
  ja: {
    title: 'Enhance Local',
    subtitle: '無料のローカル AI 画像補正',
    back: '戻る',
    before: '補正前',
    after: '補正後',
    upload: '画像を選択',
    drop: '画像をドロップまたはタップして選択',
    uploadHint: '画像は端末内に保持 • サーバーへ送信しません',
    upscale: 'AI 拡大',
    denoise: 'ノイズ除去',
    sharpen: 'シャープ',
    intensity: '強度',
    loadingAi: 'AI モデルを読み込み中',
    processing: 'AI を端末内で処理中',
    privateLine: 'プライベート • ローカル AI • 画像送信なし',
    preview: 'プレビュー',
    enhance: '補正',
    download: '結果をダウンロード',
    footer: '漫画・カバーアート・ストーリー画像に最適',
    chooseFirst: '先に画像を選択してください。',
    failed: 'この端末では画像を補正できませんでした。',
    aiUnavailable: 'ローカル AI モデルを読み込めませんでした。接続を確認して再試行してください。',
    tooLarge: '選択した AI 拡大率では、この端末で処理するには画像が大きすぎます。',
    ready: '準備完了',
    original: '元画像',
    output: '出力',
  },
  ko: {
    title: 'Enhance Local',
    subtitle: '무료 로컬 AI 이미지 향상 도구',
    back: '뒤로',
    before: '전',
    after: '후',
    upload: '이미지 업로드',
    drop: '이미지를 놓거나 눌러서 선택하세요',
    uploadHint: '이미지는 기기에 유지 • 서버 업로드 없음',
    upscale: 'AI 업스케일',
    denoise: '노이즈 제거',
    sharpen: '선명하게',
    intensity: '강도',
    loadingAi: 'AI 모델 불러오는 중',
    processing: 'AI를 기기에서 처리 중',
    privateLine: '비공개 • 로컬 AI • 이미지 업로드 없음',
    preview: '미리보기',
    enhance: '향상',
    download: '결과 다운로드',
    footer: '만화, 커버 아트, 스토리 이미지에 적합',
    chooseFirst: '먼저 이미지를 선택하세요.',
    failed: '이 기기에서 이미지를 향상할 수 없습니다.',
    aiUnavailable: '로컬 AI 모델을 불러올 수 없습니다. 연결을 확인하고 다시 시도하세요.',
    tooLarge: '선택한 AI 업스케일 크기로 처리하기에는 이미지가 너무 큽니다.',
    ready: '준비됨',
    original: '원본',
    output: '결과',
  },
})

const MAX_OUTPUT_PIXELS = 12_000_000
const TF_URLS = [
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js',
  'https://unpkg.com/@tensorflow/tfjs@4.22.0/dist/tf.min.js',
]
const MODEL_URLS = [
  'https://cdn.jsdelivr.net/npm/@upscalerjs/default-model@1.0.0/dist/umd/index.min.js',
  'https://unpkg.com/@upscalerjs/default-model@1.0.0/dist/umd/index.min.js',
]
const UPSCALER_URLS = [
  'https://cdn.jsdelivr.net/npm/upscaler@1.0.0/dist/browser/umd/upscaler.min.js',
  'https://unpkg.com/upscaler@1.0.0/dist/browser/umd/upscaler.min.js',
]

let runtimePromise = null

function loadScript(id, urls, ready) {
  if (ready()) return Promise.resolve()

  const loadFrom = (index) => {
    if (ready()) return Promise.resolve()
    if (index >= urls.length) return Promise.reject(new Error('AI_RUNTIME_UNAVAILABLE'))

    const previous = document.getElementById(id)
    if (previous) previous.remove()

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const timer = window.setTimeout(() => {
        script.remove()
        reject(new Error('SCRIPT_TIMEOUT'))
      }, 20_000)

      script.id = id
      script.src = urls[index]
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        window.clearTimeout(timer)
        ready() ? resolve() : reject(new Error('SCRIPT_GLOBAL_MISSING'))
      }
      script.onerror = () => {
        window.clearTimeout(timer)
        script.remove()
        reject(new Error('SCRIPT_LOAD_FAILED'))
      }
      document.head.appendChild(script)
    }).catch(() => loadFrom(index + 1))
  }

  return loadFrom(0)
}

function loadAiRuntime() {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      await loadScript('enhance-local-tf', TF_URLS, () => Boolean(window.tf))
      await loadScript(
        'enhance-local-model',
        MODEL_URLS,
        () => Boolean(window.DefaultUpscalerJSModel)
      )
      await loadScript(
        'enhance-local-upscaler',
        UPSCALER_URLS,
        () => Boolean(window.Upscaler)
      )

      if (!window.tf || !window.DefaultUpscalerJSModel || !window.Upscaler) {
        throw new Error('AI_RUNTIME_UNAVAILABLE')
      }

      await window.tf.ready()
    })().catch(() => {
      runtimePromise = null
      throw new Error('AI_RUNTIME_UNAVAILABLE')
    })
  }

  return runtimePromise
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('EXPORT_FAILED'))),
      'image/webp',
      0.96
    )
  })
}

function sharpenCanvas(canvas, amount) {
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return

  const width = canvas.width
  const height = canvas.height
  const imageData = context.getImageData(0, 0, width, height)
  const input = imageData.data
  const output = new Uint8ClampedArray(input)
  const strength = Math.max(0, Math.min(0.22, amount))
  const center = 1 + strength * 4
  const side = -strength

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = (y * width + x) * 4
      const left = index - 4
      const right = index + 4
      const up = index - width * 4
      const down = index + width * 4

      for (let channel = 0; channel < 3; channel += 1) {
        output[index + channel] =
          input[index + channel] * center +
          input[left + channel] * side +
          input[right + channel] * side +
          input[up + channel] * side +
          input[down + channel] * side
      }
    }
  }

  context.putImageData(new ImageData(output, width, height), 0, 0)
}

async function prepareSource(url, denoise, sharpen, intensity) {
  const image = await loadImage(url)

  if (!denoise && !sharpen) return url

  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext('2d', {
    alpha: false,
    willReadFrequently: sharpen,
  })

  if (!context) throw new Error('CANVAS_UNAVAILABLE')

  const strength = intensity / 100
  const filters = []

  if (denoise) filters.push(`blur(${0.08 + strength * 0.14}px)`)
  filters.push(`contrast(${1 + strength * 0.035})`)

  context.filter = filters.join(' ')
  context.drawImage(image, 0, 0)
  context.filter = 'none'

  if (sharpen) sharpenCanvas(canvas, 0.05 + strength * 0.09)

  return canvas
}

function normalizeProgress(value) {
  const number = Number(value) || 0
  return Math.max(0, Math.min(100, number <= 1 ? number * 100 : number))
}

function formatSize(width, height) {
  if (!width || !height) return '—'
  return `${width} × ${height}`
}

function Toggle({ active, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className="flex min-h-[52px] items-center justify-between rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-4 text-left"
      aria-pressed={active}
    >
      <span className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">
        {label}
      </span>
      <span
        className={`relative h-7 w-12 rounded-full transition ${
          active ? 'bg-[#E11D48]' : 'bg-[var(--shadow-border-strong)]'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            active ? 'left-6' : 'left-1'
          }`}
        />
      </span>
    </button>
  )
}

export default function EnhanceLocalPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const inputRef = useRef(null)
  const sourceRef = useRef('')
  const resultRef = useRef('')
  const upscalerRef = useRef(null)
  const abortRef = useRef(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultBlob, setResultBlob] = useState(null)
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 })
  const [resultSize, setResultSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(2)
  const [denoise, setDenoise] = useState(true)
  const [sharpen, setSharpen] = useState(true)
  const [intensity, setIntensity] = useState(70)
  const [compare, setCompare] = useState(50)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [loadingAi, setLoadingAi] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      upscalerRef.current?.abort?.()
      upscalerRef.current?.dispose?.()
      if (sourceRef.current) URL.revokeObjectURL(sourceRef.current)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    }
  }, [])

  function resetResult() {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    resultRef.current = ''
    setResultUrl('')
    setResultBlob(null)
    setResultSize({ width: 0, height: 0 })
    setProgress(0)
  }

  async function selectImage(file) {
    if (!file || !String(file.type || '').startsWith('image/')) return

    abortRef.current?.abort()

    if (sourceRef.current) URL.revokeObjectURL(sourceRef.current)
    resetResult()

    const url = URL.createObjectURL(file)
    sourceRef.current = url
    setSourceUrl(url)
    setCompare(50)
    setError('')

    try {
      const image = await loadImage(url)
      setSourceSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    } catch {
      setSourceSize({ width: 0, height: 0 })
    }
  }

  async function getUpscaler() {
    if (upscalerRef.current) return upscalerRef.current

    setLoadingAi(true)

    try {
      await loadAiRuntime()
      const upscaler = new window.Upscaler({
        model: window.DefaultUpscalerJSModel,
      })
      upscalerRef.current = upscaler
      return upscaler
    } finally {
      setLoadingAi(false)
    }
  }

  async function runAiPass(upscaler, input, signal, start, span) {
    return upscaler.upscale(input, {
      output: 'base64',
      patchSize: 64,
      padding: 4,
      awaitNextFrame: true,
      signal,
      progress: (value) => {
        const percent = normalizeProgress(value)
        setProgress(Math.round(start + (percent / 100) * span))
      },
    })
  }

  async function enhanceImage() {
    if (!sourceUrl || processing || loadingAi) {
      if (!sourceUrl) setError(t('enhanceLocal.chooseFirst'))
      return
    }

    const expectedWidth = sourceSize.width * scale
    const expectedHeight = sourceSize.height * scale

    if (expectedWidth * expectedHeight > MAX_OUTPUT_PIXELS) {
      setError(t('enhanceLocal.tooLarge'))
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setProcessing(true)
    setError('')
    resetResult()
    setProgress(2)

    try {
      const upscaler = await getUpscaler()

      if (controller.signal.aborted) return

      setProgress(5)

      const preparedSource = await prepareSource(
        sourceUrl,
        denoise,
        sharpen,
        intensity
      )

      let enhanced

      if (scale === 2) {
        enhanced = await runAiPass(
          upscaler,
          preparedSource,
          controller.signal,
          8,
          86
        )
      } else {
        const firstPass = await runAiPass(
          upscaler,
          preparedSource,
          controller.signal,
          8,
          42
        )

        enhanced = await runAiPass(
          upscaler,
          firstPass,
          controller.signal,
          50,
          44
        )
      }

      if (controller.signal.aborted) return

      setProgress(96)

      const enhancedImage = await loadImage(enhanced)
      const canvas = document.createElement('canvas')
      canvas.width = enhancedImage.naturalWidth
      canvas.height = enhancedImage.naturalHeight

      const context = canvas.getContext('2d', { alpha: false })
      if (!context) throw new Error('CANVAS_UNAVAILABLE')

      context.drawImage(enhancedImage, 0, 0)

      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)

      resultRef.current = url
      setResultBlob(blob)
      setResultUrl(url)
      setResultSize({
        width: canvas.width,
        height: canvas.height,
      })
      setCompare(50)
      setProgress(100)
    } catch (enhanceError) {
      if (enhanceError?.name !== 'AbortError') {
        setProgress(0)
        setError(
          enhanceError?.message === 'AI_RUNTIME_UNAVAILABLE'
            ? t('enhanceLocal.aiUnavailable')
            : t('enhanceLocal.failed')
        )
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null
      setProcessing(false)
    }
  }

  function downloadResult() {
    if (!resultBlob || !resultUrl) return

    const anchor = document.createElement('a')
    anchor.href = resultUrl
    anchor.download = `enhance-local-ai-${Date.now()}.webp`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  function onDrop(event) {
    event.preventDefault()
    setDragging(false)
    selectImage(event.dataTransfer.files?.[0])
  }

  const statusText = loadingAi
    ? t('enhanceLocal.loadingAi')
    : processing
      ? t('enhanceLocal.processing')
      : t('enhanceLocal.ready')

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[var(--shadow-text-primary)] dark:bg-[#08090C]">
      <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-[#F7F7F9]/95 backdrop-blur dark:border-white/[0.06] dark:bg-[#08090C]/95">
        <div className="relative mx-auto flex min-h-[72px] max-w-[760px] items-center justify-center px-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={t('enhanceLocal.back')}
          >
            <i className="fa-solid fa-chevron-left text-[18px]" />
          </button>

          <div className="min-w-0 text-center">
            <h1 className="truncate text-[22px] font-black tracking-[-0.02em]">
              {t('enhanceLocal.title')}
            </h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
              {t('enhanceLocal.subtitle')}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] space-y-4 px-4 pb-10 pt-4">
        <section className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-[var(--shadow-border)] bg-[#111319] shadow-sm">
          {sourceUrl ? (
            <>
              <img
                src={sourceUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
              />

              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
                />
              ) : null}

              <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                {t('enhanceLocal.before')}
              </div>

              <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                {t('enhanceLocal.after')}
              </div>

              {resultUrl ? (
                <>
                  <div
                    className="absolute bottom-0 top-0 w-[2px] bg-white/90 shadow"
                    style={{ left: `${compare}%` }}
                  />

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={compare}
                    onChange={(event) => setCompare(Number(event.target.value))}
                    className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                    aria-label={`${t('enhanceLocal.before')} / ${t('enhanceLocal.after')}`}
                  />

                  <div
                    className="pointer-events-none absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#191B20] text-white shadow-xl"
                    style={{ left: `${compare}%` }}
                  >
                    <i className="fa-solid fa-left-right text-[13px]" />
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#17191F] to-[#0D0E12] text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-[20px] border border-white/10 bg-white/[0.04] text-2xl text-white/80">
                  <i className="fa-regular fa-image" />
                </div>
                <p className="mt-3 text-[12px] font-bold text-white/55">
                  {t('enhanceLocal.upload')}
                </p>
              </div>
            </div>
          )}
        </section>

        {sourceUrl ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
              <div className="text-[10px] font-extrabold text-[var(--shadow-text-tertiary)]">
                {t('enhanceLocal.original')}
              </div>
              <div className="mt-1 text-[12px] font-black">
                {formatSize(sourceSize.width, sourceSize.height)}
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3">
              <div className="text-[10px] font-extrabold text-[var(--shadow-text-tertiary)]">
                {t('enhanceLocal.output')}
              </div>
              <div className="mt-1 text-[12px] font-black">
                {resultUrl
                  ? formatSize(resultSize.width, resultSize.height)
                  : formatSize(sourceSize.width * scale, sourceSize.height * scale)}
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex w-full flex-col items-center justify-center rounded-[22px] border border-dashed px-5 py-7 text-center transition active:scale-[0.99] ${
            dragging
              ? 'border-[#E11D48] bg-[#E11D48]/10'
              : 'border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)]'
          }`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[22px] text-[#E11D48]">
            <i className="fa-regular fa-image" />
          </span>

          <span className="mt-3 text-[16px] font-black">
            {t('enhanceLocal.upload')}
          </span>

          <span className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">
            {t('enhanceLocal.drop')}
          </span>

          <span className="mt-1 text-[10px] font-semibold text-[var(--shadow-text-tertiary)]">
            {t('enhanceLocal.uploadHint')}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            selectImage(event.target.files?.[0])
            event.target.value = ''
          }}
        />

        <section className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-black">
            <i className="fa-solid fa-microchip text-[#E11D48]" />
            {t('enhanceLocal.upscale')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[2, 4].map((value) => (
              <button
                key={value}
                type="button"
                disabled={processing || loadingAi}
                onClick={() => {
                  setScale(value)
                  resetResult()
                }}
                className={`h-12 rounded-full border text-[15px] font-black transition disabled:opacity-50 ${
                  scale === value
                    ? 'border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48] shadow-[0_0_0_1px_rgba(225,29,72,.2)]'
                    : 'border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[var(--shadow-text-secondary)]'
                }`}
              >
                {value}x
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Toggle
              active={denoise}
              onChange={(value) => {
                if (processing || loadingAi) return
                setDenoise(value)
                resetResult()
              }}
              label={t('enhanceLocal.denoise')}
            />

            <Toggle
              active={sharpen}
              onChange={(value) => {
                if (processing || loadingAi) return
                setSharpen(value)
                resetResult()
              }}
              label={t('enhanceLocal.sharpen')}
            />
          </div>

          <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <span className="text-[12px] font-black">
              {t('enhanceLocal.intensity')}
            </span>

            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              disabled={processing || loadingAi}
              onChange={(event) => {
                setIntensity(Number(event.target.value))
                resetResult()
              }}
              className="accent-[#E11D48] disabled:opacity-50"
            />

            <span className="w-10 text-right text-[12px] font-bold text-[var(--shadow-text-tertiary)]">
              {intensity}%
            </span>
          </div>
        </section>

        <section className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#E11D48]/10 text-[20px] text-[#E11D48]">
              <i
                className={`fa-solid ${
                  loadingAi || processing ? 'fa-spinner animate-spin' : 'fa-microchip'
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-black">
                {statusText}
              </div>

              <div className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
                {t('enhanceLocal.privateLine')}
              </div>
            </div>

            <div className="text-[17px] font-black text-[#E11D48]">
              {progress}%
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FB7185] to-[#E11D48] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {error ? (
          <div
            role="alert"
            className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!resultUrl}
            onClick={() => setCompare(50)}
            className="h-14 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[14px] font-black disabled:opacity-40"
          >
            <i className="fa-regular fa-eye mr-2" />
            {t('enhanceLocal.preview')}
          </button>

          <button
            type="button"
            disabled={!sourceUrl || processing || loadingAi}
            onClick={enhanceImage}
            className="h-14 rounded-[18px] bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-[14px] font-black text-white shadow-[0_10px_28px_rgba(225,29,72,.24)] active:scale-[0.98] disabled:opacity-40"
          >
            <i
              className={`fa-solid ${
                processing || loadingAi
                  ? 'fa-spinner animate-spin'
                  : 'fa-wand-magic-sparkles'
              } mr-2`}
            />
            {t('enhanceLocal.enhance')}
          </button>
        </div>

        <button
          type="button"
          disabled={!resultUrl}
          onClick={downloadResult}
          className="h-14 w-full rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[14px] font-black disabled:opacity-40"
        >
          <i className="fa-solid fa-download mr-2" />
          {t('enhanceLocal.download')}
        </button>

        <div className="pb-2 text-center text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">
          <i className="fa-solid fa-book-open mr-2" />
          {t('enhanceLocal.footer')}
        </div>
      </main>
    </div>
  )
}
