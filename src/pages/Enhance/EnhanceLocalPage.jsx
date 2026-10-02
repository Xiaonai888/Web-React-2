import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('enhanceLocal', {
  en: {
    title: 'Enhance Local',
    subtitle: 'Free local image enhancer',
    back: 'Back',
    before: 'Before',
    after: 'After',
    upload: 'Upload Image',
    uploadHint: 'Runs on your device • No server upload',
    upscale: 'Upscale',
    denoise: 'Denoise',
    sharpen: 'Sharpen',
    intensity: 'Intensity',
    processing: 'Processing locally',
    privateLine: 'Private • Fast • No cloud cost',
    preview: 'Preview',
    enhance: 'Enhance',
    download: 'Download Result',
    footer: 'Best for manga, cover art, and story images',
    chooseFirst: 'Choose an image first.',
    failed: 'Could not enhance this image on your device.',
    tooLarge: 'This image is too large for the selected upscale size on this device.',
    ready: 'Ready',
  },
  km: {
    title: 'Enhance Local',
    subtitle: 'កម្មវិធីកែលម្អរូបភាពដោយប្រើឧបករណ៍របស់អ្នក',
    back: 'ត្រឡប់ក្រោយ',
    before: 'មុន',
    after: 'ក្រោយ',
    upload: 'បញ្ចូលរូបភាព',
    uploadHint: 'ដំណើរការលើឧបករណ៍របស់អ្នក • មិន Upload ទៅ Server',
    upscale: 'ពង្រីក',
    denoise: 'កាត់បន្ថយ Noise',
    sharpen: 'ធ្វើឱ្យច្បាស់',
    intensity: 'កម្លាំង',
    processing: 'កំពុងដំណើរការក្នុងឧបករណ៍',
    privateLine: 'ឯកជន • លឿន • មិនចំណាយ Cloud',
    preview: 'មើលមុន',
    enhance: 'កែលម្អ',
    download: 'ទាញយកលទ្ធផល',
    footer: 'សមសម្រាប់ Manga, Cover Art និងរូបភាពរឿង',
    chooseFirst: 'សូមជ្រើសរូបភាពជាមុន។',
    failed: 'មិនអាចកែលម្អរូបភាពនេះលើឧបករណ៍បានទេ។',
    tooLarge: 'រូបភាពនេះធំពេកសម្រាប់ទំហំពង្រីកដែលបានជ្រើសលើឧបករណ៍នេះ។',
    ready: 'រួចរាល់',
  },
  zh: {
    title: 'Enhance Local',
    subtitle: '免费的本地图片增强器',
    back: '返回',
    before: '之前',
    after: '之后',
    upload: '上传图片',
    uploadHint: '在你的设备上运行 • 不上传服务器',
    upscale: '放大',
    denoise: '降噪',
    sharpen: '锐化',
    intensity: '强度',
    processing: '正在本地处理',
    privateLine: '私密 • 快速 • 无云端成本',
    preview: '预览',
    enhance: '增强',
    download: '下载结果',
    footer: '适合漫画、封面和故事图片',
    chooseFirst: '请先选择图片。',
    failed: '无法在此设备上增强这张图片。',
    tooLarge: '这张图片对于当前设备所选的放大尺寸来说太大。',
    ready: '就绪',
  },
  ja: {
    title: 'Enhance Local',
    subtitle: '無料のローカル画像補正',
    back: '戻る',
    before: '補正前',
    after: '補正後',
    upload: '画像を選択',
    uploadHint: '端末内で処理 • サーバーへ送信しません',
    upscale: '拡大',
    denoise: 'ノイズ除去',
    sharpen: 'シャープ',
    intensity: '強度',
    processing: '端末内で処理中',
    privateLine: 'プライベート • 高速 • クラウド費用なし',
    preview: 'プレビュー',
    enhance: '補正',
    download: '結果をダウンロード',
    footer: '漫画・カバーアート・ストーリー画像に最適',
    chooseFirst: '先に画像を選択してください。',
    failed: 'この端末では画像を補正できませんでした。',
    tooLarge: '選択した拡大率では、この端末で処理するには画像が大きすぎます。',
    ready: '準備完了',
  },
  ko: {
    title: 'Enhance Local',
    subtitle: '무료 로컬 이미지 향상 도구',
    back: '뒤로',
    before: '전',
    after: '후',
    upload: '이미지 업로드',
    uploadHint: '기기에서 처리 • 서버 업로드 없음',
    upscale: '업스케일',
    denoise: '노이즈 제거',
    sharpen: '선명하게',
    intensity: '강도',
    processing: '기기에서 처리 중',
    privateLine: '비공개 • 빠름 • 클라우드 비용 없음',
    preview: '미리보기',
    enhance: '향상',
    download: '결과 다운로드',
    footer: '만화, 커버 아트, 스토리 이미지에 적합',
    chooseFirst: '먼저 이미지를 선택하세요.',
    failed: '이 기기에서 이미지를 향상할 수 없습니다.',
    tooLarge: '선택한 업스케일 크기로 처리하기에는 이미지가 너무 큽니다.',
    ready: '준비됨',
  },
})

const MAX_OUTPUT_PIXELS = 12_000_000

function waitForFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve))
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
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas export failed'))),
      'image/webp',
      0.95
    )
  })
}

function Toggle({ active, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className="flex min-h-[52px] items-center justify-between rounded-[16px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] px-4 text-left"
      aria-pressed={active}
    >
      <span className="text-[13px] font-extrabold text-[var(--shadow-text-primary)]">{label}</span>
      <span className={`relative h-7 w-12 rounded-full transition ${active ? 'bg-[#E11D48]' : 'bg-[var(--shadow-border-strong)]'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${active ? 'left-6' : 'left-1'}`} />
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
  const [sourceUrl, setSourceUrl] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultBlob, setResultBlob] = useState(null)
  const [scale, setScale] = useState(2)
  const [denoise, setDenoise] = useState(true)
  const [sharpen, setSharpen] = useState(true)
  const [intensity, setIntensity] = useState(70)
  const [compare, setCompare] = useState(50)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (sourceRef.current) URL.revokeObjectURL(sourceRef.current)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    }
  }, [])

  function resetResult() {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    resultRef.current = ''
    setResultUrl('')
    setResultBlob(null)
    setProgress(0)
  }

  function selectImage(file) {
    if (!file || !String(file.type || '').startsWith('image/')) return
    if (sourceRef.current) URL.revokeObjectURL(sourceRef.current)
    resetResult()
    const url = URL.createObjectURL(file)
    sourceRef.current = url
    setSourceUrl(url)
    setCompare(50)
    setError('')
  }

  async function enhanceImage() {
    if (!sourceUrl || processing) {
      if (!sourceUrl) setError(t('enhanceLocal.chooseFirst'))
      return
    }

    setProcessing(true)
    setError('')
    resetResult()
    setProgress(8)

    try {
      await waitForFrame()
      const image = await loadImage(sourceUrl)
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))

      if (width * height > MAX_OUTPUT_PIXELS) {
        throw new Error('OUTPUT_TOO_LARGE')
      }

      setProgress(32)
      await waitForFrame()

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d', { alpha: false })

      if (!context) throw new Error('CANVAS_UNAVAILABLE')

      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'

      const strength = intensity / 100
      const filters = []

      if (denoise) filters.push(`blur(${Math.max(0.08, 0.28 - strength * 0.12)}px)`)
      if (sharpen) filters.push(`contrast(${1 + strength * 0.18})`)
      filters.push(`saturate(${1 + strength * 0.035})`)

      context.filter = filters.join(' ')
      context.drawImage(image, 0, 0, width, height)
      context.filter = 'none'

      setProgress(76)
      await waitForFrame()

      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)
      resultRef.current = url
      setResultBlob(blob)
      setResultUrl(url)
      setCompare(50)
      setProgress(100)
    } catch (enhanceError) {
      setProgress(0)
      setError(
        enhanceError?.message === 'OUTPUT_TOO_LARGE'
          ? t('enhanceLocal.tooLarge')
          : t('enhanceLocal.failed')
      )
    } finally {
      setProcessing(false)
    }
  }

  function downloadResult() {
    if (!resultBlob || !resultUrl) return
    const anchor = document.createElement('a')
    anchor.href = resultUrl
    anchor.download = `enhance-local-${Date.now()}.webp`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

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
            <h1 className="truncate text-[22px] font-black tracking-[-0.02em]">{t('enhanceLocal.title')}</h1>
            <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('enhanceLocal.subtitle')}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] space-y-4 px-4 pb-10 pt-4">
        <section className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-[var(--shadow-border)] bg-[#15171D] shadow-sm">
          {sourceUrl ? (
            <>
              <img src={sourceUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
                />
              ) : null}
              <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                {t('enhanceLocal.before')}
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
                {t('enhanceLocal.after')}
              </div>
              {resultUrl ? (
                <>
                  <div className="absolute bottom-0 top-0 w-[2px] bg-white/90 shadow" style={{ left: `${compare}%` }} />
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
                <p className="mt-3 text-[12px] font-bold text-white/55">{t('enhanceLocal.upload')}</p>
              </div>
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-[22px] border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-surface)] px-5 py-7 text-center active:scale-[0.99]"
        >
          <span className="grid h-14 w-14 place-items-center rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[22px] text-[#E11D48]">
            <i className="fa-regular fa-image" />
          </span>
          <span className="mt-3 text-[16px] font-black">{t('enhanceLocal.upload')}</span>
          <span className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('enhanceLocal.uploadHint')}</span>
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
            <i className="fa-solid fa-up-right-and-down-left-from-center text-[#E11D48]" />
            {t('enhanceLocal.upscale')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[2, 4].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setScale(value)
                  resetResult()
                }}
                className={`h-12 rounded-full border text-[15px] font-black transition ${
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
            <Toggle active={denoise} onChange={(value) => { setDenoise(value); resetResult() }} label={t('enhanceLocal.denoise')} />
            <Toggle active={sharpen} onChange={(value) => { setSharpen(value); resetResult() }} label={t('enhanceLocal.sharpen')} />
          </div>

          <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <span className="text-[12px] font-black">{t('enhanceLocal.intensity')}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(event) => {
                setIntensity(Number(event.target.value))
                resetResult()
              }}
              className="accent-[#E11D48]"
            />
            <span className="w-10 text-right text-[12px] font-bold text-[var(--shadow-text-tertiary)]">{intensity}%</span>
          </div>
        </section>

        <section className="rounded-[22px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#E11D48]/10 text-[20px] text-[#E11D48]">
              <i className="fa-solid fa-microchip" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-black">{processing ? t('enhanceLocal.processing') : t('enhanceLocal.ready')}</div>
              <div className="mt-0.5 truncate text-[11px] font-semibold text-[var(--shadow-text-tertiary)]">{t('enhanceLocal.privateLine')}</div>
            </div>
            <div className="text-[17px] font-black text-[#E11D48]">{progress}%</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#FB7185] to-[#E11D48] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </section>

        {error ? (
          <div role="alert" className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={!sourceUrl}
            onClick={() => setCompare(50)}
            className="h-14 rounded-[18px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] text-[14px] font-black disabled:opacity-40"
          >
            <i className="fa-regular fa-eye mr-2" />
            {t('enhanceLocal.preview')}
          </button>
          <button
            type="button"
            disabled={!sourceUrl || processing}
            onClick={enhanceImage}
            className="h-14 rounded-[18px] bg-gradient-to-r from-[#FB7185] to-[#E11D48] text-[14px] font-black text-white shadow-[0_10px_28px_rgba(225,29,72,.24)] active:scale-[0.98] disabled:opacity-40"
          >
            <i className={`fa-solid ${processing ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'} mr-2`} />
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
