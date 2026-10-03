import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { ArrowLeft, Download, FileCode2, Link2, Mail, Phone, QrCode, ScanLine, Share2, Type, UserRound, Wifi } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('qrBarcode', {
  en: {
    title: 'QR & Barcode',
    subtitle: 'Create, Scan, Download',
    generate: 'Generate',
    scan: 'Scan',
    qrType: 'QR Code Type',
    website: 'Website Link',
    text: 'Text',
    wifi: 'Wi-Fi',
    contact: 'Contact',
    email: 'Email',
    phone: 'Phone',
    barcodeType: 'Barcode Type',
    websiteUrl: 'Website URL',
    enterValue: 'Enter value',
    styleColor: 'Style & Color',
    size: 'Size',
    preview: 'Preview',
    generateQr: 'Generate QR',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: 'Share',
    empty: 'Enter content to generate a QR code.',
    failed: 'Could not generate this QR code.',
    scanSoon: 'Scanner will be added in the next stage.',
  },
  km: {
    title: 'QR & Barcode',
    subtitle: 'បង្កើត ស្កេន និងទាញយក',
    generate: 'បង្កើត',
    scan: 'ស្កេន',
    qrType: 'ប្រភេទ QR Code',
    website: 'តំណ Website',
    text: 'អត្ថបទ',
    wifi: 'Wi-Fi',
    contact: 'ទំនាក់ទំនង',
    email: 'Email',
    phone: 'ទូរសព្ទ',
    barcodeType: 'ប្រភេទ Barcode',
    websiteUrl: 'Website URL',
    enterValue: 'បញ្ចូលទិន្នន័យ',
    styleColor: 'រចនាប័ទ្ម និងពណ៌',
    size: 'ទំហំ',
    preview: 'មើលជាមុន',
    generateQr: 'បង្កើត QR',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: 'ចែករំលែក',
    empty: 'សូមបញ្ចូលទិន្នន័យដើម្បីបង្កើត QR Code។',
    failed: 'មិនអាចបង្កើត QR Code នេះបានទេ។',
    scanSoon: 'Scanner នឹងបន្ថែមនៅដំណាក់កាលបន្ទាប់។',
  },
  zh: {
    title: 'QR & Barcode',
    subtitle: '创建、扫描、下载',
    generate: '生成',
    scan: '扫描',
    qrType: '二维码类型',
    website: '网站链接',
    text: '文本',
    wifi: 'Wi-Fi',
    contact: '联系人',
    email: '邮箱',
    phone: '电话',
    barcodeType: '条码类型',
    websiteUrl: '网站地址',
    enterValue: '输入内容',
    styleColor: '样式与颜色',
    size: '尺寸',
    preview: '预览',
    generateQr: '生成二维码',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: '分享',
    empty: '请输入内容以生成二维码。',
    failed: '无法生成此二维码。',
    scanSoon: '扫描器将在下一阶段加入。',
  },
  ja: {
    title: 'QR & Barcode',
    subtitle: '作成・スキャン・保存',
    generate: '作成',
    scan: 'スキャン',
    qrType: 'QRコード種類',
    website: 'Webリンク',
    text: 'テキスト',
    wifi: 'Wi-Fi',
    contact: '連絡先',
    email: 'メール',
    phone: '電話',
    barcodeType: 'バーコード種類',
    websiteUrl: 'Web URL',
    enterValue: '内容を入力',
    styleColor: 'スタイルと色',
    size: 'サイズ',
    preview: 'プレビュー',
    generateQr: 'QRを作成',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: '共有',
    empty: 'QRコードを作成する内容を入力してください。',
    failed: 'QRコードを作成できませんでした。',
    scanSoon: 'スキャナーは次の段階で追加します。',
  },
  ko: {
    title: 'QR & Barcode',
    subtitle: '생성, 스캔, 다운로드',
    generate: '생성',
    scan: '스캔',
    qrType: 'QR 코드 유형',
    website: '웹 링크',
    text: '텍스트',
    wifi: 'Wi-Fi',
    contact: '연락처',
    email: '이메일',
    phone: '전화',
    barcodeType: '바코드 유형',
    websiteUrl: '웹사이트 URL',
    enterValue: '내용 입력',
    styleColor: '스타일 및 색상',
    size: '크기',
    preview: '미리보기',
    generateQr: 'QR 생성',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: '공유',
    empty: 'QR 코드를 만들 내용을 입력하세요.',
    failed: 'QR 코드를 생성할 수 없습니다.',
    scanSoon: '스캐너는 다음 단계에서 추가됩니다.',
  },
})

const QR_TYPES = [
  ['website', Link2],
  ['text', Type],
  ['wifi', Wifi],
  ['contact', UserRound],
  ['email', Mail],
  ['phone', Phone],
]

const BARCODE_TYPES = ['CODE128', 'EAN-13', 'UPC-A']
const COLORS = ['#111111', '#ffffff', '#ff6a00', '#ff8a1f']

function buildPayload(type, value) {
  const clean = value.trim()
  if (!clean) return ''
  if (type === 'email') return `mailto:${clean}`
  if (type === 'phone') return `tel:${clean}`
  if (type === 'contact') return `MECARD:N:${clean};;`
  return clean
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function QRBarcodePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [tab, setTab] = useState('generate')
  const [type, setType] = useState('website')
  const [value, setValue] = useState('https://example.com')
  const [size, setSize] = useState(300)
  const [foreground, setForeground] = useState('#111111')
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  const payload = useMemo(() => buildPayload(type, value), [type, value])

  useEffect(() => {
    let active = true
    if (!payload) {
      setPreview('')
      setError('')
      return
    }
    QRCode.toDataURL(payload, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: foreground, light: '#ffffff' },
    })
      .then(url => {
        if (!active) return
        setPreview(url)
        setError('')
      })
      .catch(() => {
        if (!active) return
        setPreview('')
        setError(t('qrBarcode.failed'))
      })
    return () => { active = false }
  }, [payload, size, foreground, t])

  const downloadPng = () => {
    if (!preview) return
    const link = document.createElement('a')
    link.href = preview
    link.download = 'shadow-qr.png'
    link.click()
  }

  const downloadSvg = async () => {
    if (!payload) return
    try {
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        width: size,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: foreground, light: '#ffffff' },
      })
      downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'shadow-qr.svg')
    } catch {
      setError(t('qrBarcode.failed'))
    }
  }

  const shareQr = async () => {
    if (!preview || !navigator.share) return
    try {
      const blob = await (await fetch(preview)).blob()
      const file = new File([blob], 'shadow-qr.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: t('qrBarcode.title') })
      else await navigator.share({ title: t('qrBarcode.title'), text: payload })
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#171717] dark:bg-[#080808] dark:text-white">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0b0b0b]/95">
        <div className="mx-auto grid h-14 max-w-3xl grid-cols-[44px_1fr_44px] items-center px-2">
          <button type="button" onClick={() => navigate(-1)} className="grid h-11 w-11 place-items-center rounded-full active:bg-black/5 dark:active:bg-white/10">
            <ArrowLeft size={21} />
          </button>
          <div className="min-w-0 text-center">
            <h1 className="truncate text-[17px] font-bold">{t('qrBarcode.title')}</h1>
            <p className="truncate text-[10px] text-black/45 dark:text-white/45">{t('qrBarcode.subtitle')}</p>
          </div>
          <div />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-10 pt-5">
        <div className="grid grid-cols-2 rounded-2xl border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-[#151515]">
          <button type="button" onClick={() => setTab('generate')} className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${tab === 'generate' ? 'bg-[#ff6a00] text-white shadow-[0_8px_24px_rgba(255,106,0,.28)]' : 'text-black/55 dark:text-white/55'}`}>
            <QrCode size={18} />
            {t('qrBarcode.generate')}
          </button>
          <button type="button" onClick={() => setTab('scan')} className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold transition ${tab === 'scan' ? 'bg-[#ff6a00] text-white shadow-[0_8px_24px_rgba(255,106,0,.28)]' : 'text-black/55 dark:text-white/55'}`}>
            <ScanLine size={18} />
            {t('qrBarcode.scan')}
          </button>
        </div>

        {tab === 'scan' ? (
          <div className="mt-5 rounded-3xl border border-black/10 bg-white px-5 py-16 text-center dark:border-white/10 dark:bg-[#121212]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff1e7] text-[#ff6a00] dark:bg-[#2a1608]">
              <ScanLine size={30} />
            </div>
            <p className="mt-4 text-sm text-black/55 dark:text-white/55">{t('qrBarcode.scanSoon')}</p>
          </div>
        ) : (
          <>
            <section className="mt-6">
              <h2 className="mb-3 text-[15px] font-bold">{t('qrBarcode.qrType')}</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {QR_TYPES.map(([key, Icon]) => (
                  <button type="button" key={key} onClick={() => setType(key)} className={`flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 text-center text-[12px] font-semibold transition ${type === key ? 'border-[#ff6a00] bg-[#fff3ea] text-[#e85f00] shadow-[0_8px_22px_rgba(255,106,0,.12)] dark:bg-[#27150a] dark:text-[#ff8a3d]' : 'border-black/10 bg-white text-black/70 dark:border-white/10 dark:bg-[#151515] dark:text-white/70'}`}>
                    <Icon size={21} />
                    <span>{t(`qrBarcode.${key}`)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="mb-3 text-[15px] font-bold">{t('qrBarcode.barcodeType')}</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {BARCODE_TYPES.map(item => (
                  <button type="button" key={item} disabled className="flex h-[72px] flex-col items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white text-[11px] font-semibold text-black/35 dark:border-white/10 dark:bg-[#151515] dark:text-white/35">
                    <span className="text-[22px] tracking-[-3px]">|||||||</span>
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <label className="mb-2 block text-[12px] font-semibold text-black/55 dark:text-white/55">
                {type === 'website' ? t('qrBarcode.websiteUrl') : t('qrBarcode.enterValue')}
              </label>
              <div className="flex h-13 items-center gap-3 rounded-2xl border border-black/10 bg-[#fafafa] px-4 dark:border-white/10 dark:bg-[#090909]">
                <Link2 size={19} className="shrink-0 text-[#ff6a00]" />
                <input value={value} onChange={event => setValue(event.target.value)} className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/30 dark:placeholder:text-white/30" placeholder={type === 'website' ? 'https://example.com' : t('qrBarcode.enterValue')} />
                {value ? <button type="button" onClick={() => setValue('')} className="text-lg text-black/35 dark:text-white/35">×</button> : null}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="mb-3 text-[12px] font-semibold text-black/55 dark:text-white/55">{t('qrBarcode.styleColor')}</div>
                  <div className="flex items-center gap-3">
                    {COLORS.map(color => (
                      <button type="button" key={color} onClick={() => setForeground(color)} aria-label={color} className={`h-9 w-9 rounded-full border-2 ${foreground === color ? 'border-[#ff6a00] ring-2 ring-[#ff6a00]/20' : 'border-black/10 dark:border-white/15'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-black/55 dark:text-white/55">
                    <span>{t('qrBarcode.size')}</span>
                    <span>{size} × {size}px</span>
                  </div>
                  <input type="range" min="180" max="600" step="20" value={size} onChange={event => setSize(Number(event.target.value))} className="h-2 w-full accent-[#ff6a00]" />
                </div>
              </div>
            </section>

            <section className="mt-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-bold">{t('qrBarcode.preview')}</h2>
                <span className="text-[11px] text-black/40 dark:text-white/40">{size} × {size}px</span>
              </div>
              <div className="mt-4 flex min-h-[280px] items-center justify-center rounded-2xl bg-[#f5f5f5] p-5 dark:bg-[#090909]">
                {preview ? <img src={preview} alt="QR preview" className="max-h-[260px] max-w-full rounded-xl bg-white p-2 shadow-lg" /> : <p className="px-6 text-center text-sm text-black/40 dark:text-white/40">{error || t('qrBarcode.empty')}</p>}
              </div>
              {error ? <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p> : null}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                <button type="button" disabled={!preview} onClick={downloadPng} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <Download size={17} />
                  {t('qrBarcode.downloadPng')}
                </button>
                <button type="button" disabled={!preview} onClick={downloadSvg} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <FileCode2 size={17} />
                  {t('qrBarcode.downloadSvg')}
                </button>
                <button type="button" disabled={!preview || !navigator.share} onClick={shareQr} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <Share2 size={17} />
                  {t('qrBarcode.share')}
                </button>
              </div>
            </section>

            <button type="button" disabled={!payload} className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#ff6a00] text-[15px] font-extrabold text-white shadow-[0_12px_30px_rgba(255,106,0,.28)] active:scale-[0.99] disabled:opacity-40">
              <QrCode size={20} />
              {t('qrBarcode.generateQr')}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
