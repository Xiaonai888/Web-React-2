import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { ArrowLeft, Camera, Copy, Download, ExternalLink, FileCode2, ImagePlus, Link2, Mail, Phone, QrCode, ScanLine, Share2, Square, Type, UserRound, Wifi } from 'lucide-react'
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
    barcodeValue: 'Barcode value',
    styleColor: 'Style & Color',
    size: 'Size',
    preview: 'Preview',
    generateQr: 'Generate QR',
    generateBarcode: 'Generate Barcode',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: 'Share',
    empty: 'Enter content to generate a QR code.',
    barcodeEmpty: 'Enter a value to generate a barcode.',
    barcodeInvalid: 'This value is not valid for the selected barcode type.',
    failed: 'Could not generate this QR code.',
    startCamera: 'Start Camera',
    stopCamera: 'Stop Camera',
    scanImage: 'Scan Image',
    scanHint: 'Point the camera at a QR code or supported barcode.',
    scanResult: 'Scan Result',
    copy: 'Copy',
    copied: 'Copied',
    openLink: 'Open Link',
    cameraFailed: 'Camera could not start. Check camera permission and try again.',
    imageScanFailed: 'No supported QR code or barcode was found in this image.',
    noResult: 'Scan a code to see the result here.',
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
    barcodeValue: 'លេខ ឬអក្សរ Barcode',
    styleColor: 'រចនាប័ទ្ម និងពណ៌',
    size: 'ទំហំ',
    preview: 'មើលជាមុន',
    generateQr: 'បង្កើត QR',
    generateBarcode: 'បង្កើត Barcode',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: 'ចែករំលែក',
    empty: 'សូមបញ្ចូលទិន្នន័យដើម្បីបង្កើត QR Code។',
    barcodeEmpty: 'សូមបញ្ចូលទិន្នន័យដើម្បីបង្កើត Barcode។',
    barcodeInvalid: 'ទិន្នន័យនេះមិនត្រឹមត្រូវសម្រាប់ប្រភេទ Barcode ដែលបានជ្រើសទេ។',
    failed: 'មិនអាចបង្កើត QR Code នេះបានទេ។',
    startCamera: 'បើកកាមេរ៉ា',
    stopCamera: 'បិទកាមេរ៉ា',
    scanImage: 'ស្កេនពីរូបភាព',
    scanHint: 'ដាក់ QR Code ឬ Barcode នៅមុខកាមេរ៉ាដើម្បីស្កេន។',
    scanResult: 'លទ្ធផលស្កេន',
    copy: 'ចម្លង',
    copied: 'បានចម្លង',
    openLink: 'បើកតំណ',
    cameraFailed: 'មិនអាចបើកកាមេរ៉ាបានទេ។ សូមពិនិត្យ Camera Permission ហើយសាកម្តងទៀត។',
    imageScanFailed: 'រកមិនឃើញ QR Code ឬ Barcode ដែលគាំទ្រនៅក្នុងរូបភាពនេះទេ។',
    noResult: 'ស្កេន Code ដើម្បីមើលលទ្ធផលនៅទីនេះ។',
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
    barcodeValue: '条码内容',
    styleColor: '样式与颜色',
    size: '尺寸',
    preview: '预览',
    generateQr: '生成二维码',
    generateBarcode: '生成条码',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: '分享',
    empty: '请输入内容以生成二维码。',
    barcodeEmpty: '请输入内容以生成条码。',
    barcodeInvalid: '该内容不适用于所选条码类型。',
    failed: '无法生成此二维码。',
    startCamera: '开启相机',
    stopCamera: '停止相机',
    scanImage: '扫描图片',
    scanHint: '将二维码或支持的条码对准相机。',
    scanResult: '扫描结果',
    copy: '复制',
    copied: '已复制',
    openLink: '打开链接',
    cameraFailed: '无法启动相机，请检查相机权限后重试。',
    imageScanFailed: '图片中未找到支持的二维码或条码。',
    noResult: '扫描代码后结果会显示在这里。',
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
    barcodeValue: 'バーコード値',
    styleColor: 'スタイルと色',
    size: 'サイズ',
    preview: 'プレビュー',
    generateQr: 'QRを作成',
    generateBarcode: 'バーコードを作成',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: '共有',
    empty: 'QRコードを作成する内容を入力してください。',
    barcodeEmpty: 'バーコードを作成する値を入力してください。',
    barcodeInvalid: '選択したバーコード形式では使用できない値です。',
    failed: 'QRコードを作成できませんでした。',
    startCamera: 'カメラ開始',
    stopCamera: 'カメラ停止',
    scanImage: '画像をスキャン',
    scanHint: 'QRコードまたは対応バーコードをカメラに向けてください。',
    scanResult: 'スキャン結果',
    copy: 'コピー',
    copied: 'コピー済み',
    openLink: 'リンクを開く',
    cameraFailed: 'カメラを起動できません。カメラ権限を確認して再試行してください。',
    imageScanFailed: '画像内に対応するQRコードまたはバーコードが見つかりませんでした。',
    noResult: 'コードをスキャンすると結果がここに表示されます。',
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
    barcodeValue: '바코드 값',
    styleColor: '스타일 및 색상',
    size: '크기',
    preview: '미리보기',
    generateQr: 'QR 생성',
    generateBarcode: '바코드 생성',
    downloadPng: 'PNG',
    downloadSvg: 'SVG',
    share: '공유',
    empty: 'QR 코드를 만들 내용을 입력하세요.',
    barcodeEmpty: '바코드를 만들 값을 입력하세요.',
    barcodeInvalid: '선택한 바코드 형식에 맞지 않는 값입니다.',
    failed: 'QR 코드를 생성할 수 없습니다.',
    startCamera: '카메라 시작',
    stopCamera: '카메라 중지',
    scanImage: '이미지 스캔',
    scanHint: 'QR 코드 또는 지원되는 바코드를 카메라에 맞춰 주세요.',
    scanResult: '스캔 결과',
    copy: '복사',
    copied: '복사됨',
    openLink: '링크 열기',
    cameraFailed: '카메라를 시작할 수 없습니다. 카메라 권한을 확인한 후 다시 시도하세요.',
    imageScanFailed: '이미지에서 지원되는 QR 코드 또는 바코드를 찾지 못했습니다.',
    noResult: '코드를 스캔하면 결과가 여기에 표시됩니다.',
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
const BARCODE_SAMPLES = {
  CODE128: 'SHADOW123',
  'EAN-13': '5901234123457',
  'UPC-A': '036000291452',
}
const SCANNER_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.UPC_A,
]

const CODE128_PATTERNS = [
  '212222','222122','222221','121223','121322','131222','122213','122312','132212','221213',
  '221312','231212','112232','122132','122231','113222','123122','123221','223211','221132',
  '221231','213212','223112','312131','311222','321122','321221','312212','322112','322211',
  '212123','212321','232121','111323','131123','131321','112313','132113','132311','211313',
  '231113','231311','112133','112331','132131','113123','113321','133121','313121','211331',
  '231131','213113','213311','213131','311123','311321','331121','312113','312311','332111',
  '314111','221411','431111','111224','111422','121124','121421','141122','141221','112214',
  '112412','122114','122411','142112','142211','241211','221114','413111','241112','134111',
  '111242','121142','121241','114212','124112','124211','411212','421112','421211','212141',
  '214121','412121','111143','111341','131141','114113','114311','411113','411311','113141',
  '114131','311141','411131','211412','211214','211232','2331112',
]

const EAN_L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011']
const EAN_G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111']
const EAN_R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100']
const EAN_PARITY = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL']

function buildPayload(type, value) {
  const clean = value.trim()
  if (!clean) return ''
  if (type === 'email') return `mailto:${clean}`
  if (type === 'phone') return `tel:${clean}`
  if (type === 'contact') return `MECARD:N:${clean};;`
  return clean
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
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

function barcodeCheckDigit(body, ean13) {
  let sum = 0
  for (let index = 0; index < body.length; index += 1) {
    const digit = Number(body[index])
    const position = index + 1
    sum += digit * (ean13 ? (position % 2 === 0 ? 3 : 1) : (position % 2 === 1 ? 3 : 1))
  }
  return String((10 - (sum % 10)) % 10)
}

function normalizeEan(value) {
  const digits = value.replace(/\s+/g, '')
  if (!/^\d{12,13}$/.test(digits)) throw new Error('invalid')
  if (digits.length === 12) return `${digits}${barcodeCheckDigit(digits, true)}`
  if (barcodeCheckDigit(digits.slice(0, 12), true) !== digits[12]) throw new Error('invalid')
  return digits
}

function normalizeUpc(value) {
  const digits = value.replace(/\s+/g, '')
  if (!/^\d{11,12}$/.test(digits)) throw new Error('invalid')
  if (digits.length === 11) return `${digits}${barcodeCheckDigit(digits, false)}`
  if (barcodeCheckDigit(digits.slice(0, 11), false) !== digits[11]) throw new Error('invalid')
  return digits
}

function bitsToSvg(bits, label, color, size) {
  const quiet = 10
  const moduleWidth = 2
  const barHeight = 92
  const width = (bits.length + quiet * 2) * moduleWidth
  const rects = []
  for (let index = 0; index < bits.length; index += 1) {
    if (bits[index] === '1') rects.push(`<rect x="${(index + quiet) * moduleWidth}" y="10" width="${moduleWidth}" height="${barHeight}" fill="${color}"/>`)
  }
  const height = 128
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.max(120, Math.round(size * 0.45))}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet"><rect width="100%" height="100%" fill="#ffffff"/>${rects.join('')}<text x="${width / 2}" y="120" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="2" fill="${color}">${escapeXml(label)}</text></svg>`
}

function buildEan13Svg(value, color, size) {
  const digits = normalizeEan(value)
  const parity = EAN_PARITY[Number(digits[0])]
  let bits = '101'
  for (let index = 1; index <= 6; index += 1) {
    const digit = Number(digits[index])
    bits += parity[index - 1] === 'L' ? EAN_L[digit] : EAN_G[digit]
  }
  bits += '01010'
  for (let index = 7; index <= 12; index += 1) bits += EAN_R[Number(digits[index])]
  bits += '101'
  return { svg: bitsToSvg(bits, digits, color, size), value: digits }
}

function buildUpcSvg(value, color, size) {
  const digits = normalizeUpc(value)
  let bits = '101'
  for (let index = 0; index < 6; index += 1) bits += EAN_L[Number(digits[index])]
  bits += '01010'
  for (let index = 6; index < 12; index += 1) bits += EAN_R[Number(digits[index])]
  bits += '101'
  return { svg: bitsToSvg(bits, digits, color, size), value: digits }
}

function buildCode128Svg(value, color, size) {
  const clean = value.trim()
  if (!clean || clean.length > 80 || [...clean].some(character => {
    const code = character.charCodeAt(0)
    return code < 32 || code > 126
  })) throw new Error('invalid')

  const values = [...clean].map(character => character.charCodeAt(0) - 32)
  let checksum = 104
  values.forEach((item, index) => { checksum += item * (index + 1) })
  const symbols = [104, ...values, checksum % 103, 106]
  const quiet = 10
  const unit = 2
  let x = quiet * unit
  const rects = []

  symbols.forEach(symbol => {
    const widths = CODE128_PATTERNS[symbol]
    let bar = true
    for (const widthCharacter of widths) {
      const width = Number(widthCharacter) * unit
      if (bar) rects.push(`<rect x="${x}" y="10" width="${width}" height="92" fill="${color}"/>`)
      x += width
      bar = !bar
    }
  })

  const totalWidth = x + quiet * unit
  const height = 128
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.max(120, Math.round(size * 0.45))}" viewBox="0 0 ${totalWidth} ${height}" preserveAspectRatio="xMidYMid meet"><rect width="100%" height="100%" fill="#ffffff"/>${rects.join('')}<text x="${totalWidth / 2}" y="120" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="13" letter-spacing="1.5" fill="${color}">${escapeXml(clean)}</text></svg>`
  return { svg, value: clean }
}

function buildBarcodeSvg(type, value, color, size) {
  if (type === 'EAN-13') return buildEan13Svg(value, color, size)
  if (type === 'UPC-A') return buildUpcSvg(value, color, size)
  return buildCode128Svg(value, color, size)
}

function svgToPngBlob(svg) {
  return new Promise((resolve, reject) => {
    const source = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(source)
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(600, image.naturalWidth || 600)
      canvas.height = Math.max(260, image.naturalHeight || 260)
      const context = canvas.getContext('2d')
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        if (blob) resolve(blob)
        else reject(new Error('png'))
      }, 'image/png')
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('png'))
    }
    image.src = url
  })
}

async function releaseScanner(scanner) {
  if (!scanner) return
  try {
    await scanner.stop()
  } catch {}
  try {
    scanner.clear()
  } catch {}
}

function copyFallback(text) {
  const area = document.createElement('textarea')
  area.value = text
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  area.remove()
}

export default function QRBarcodePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const scannerRef = useRef(null)
  const imageInputRef = useRef(null)
  const [tab, setTab] = useState('generate')
  const [generatorKind, setGeneratorKind] = useState('qr')
  const [type, setType] = useState('website')
  const [barcodeType, setBarcodeType] = useState('CODE128')
  const [value, setValue] = useState('https://example.com')
  const [size, setSize] = useState(300)
  const [foreground, setForeground] = useState('#111111')
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState('')
  const [scanError, setScanError] = useState('')
  const [copied, setCopied] = useState(false)

  const payload = useMemo(() => buildPayload(type, value), [type, value])

  const barcodeResult = useMemo(() => {
    if (generatorKind !== 'barcode' || !value.trim()) return { svg: '', value: '', error: '' }
    try {
      const result = buildBarcodeSvg(barcodeType, value, foreground, size)
      return { ...result, error: '' }
    } catch {
      return { svg: '', value: '', error: t('qrBarcode.barcodeInvalid') }
    }
  }, [barcodeType, foreground, generatorKind, size, t, value])

  useEffect(() => {
    let active = true
    if (generatorKind !== 'qr' || !payload) {
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
  }, [foreground, generatorKind, payload, size, t])

  useEffect(() => {
    if (tab === 'scan') return
    const scanner = scannerRef.current
    scannerRef.current = null
    setScanning(false)
    if (scanner) releaseScanner(scanner)
  }, [tab])

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current
      scannerRef.current = null
      if (scanner) releaseScanner(scanner)
    }
  }, [])

  const chooseQrType = key => {
    if (generatorKind !== 'qr') setValue(key === 'website' ? 'https://example.com' : '')
    setGeneratorKind('qr')
    setType(key)
  }

  const chooseBarcodeType = nextType => {
    setGeneratorKind('barcode')
    setBarcodeType(nextType)
    setValue(BARCODE_SAMPLES[nextType])
    setError('')
  }

  const stopScanner = async () => {
    const scanner = scannerRef.current
    scannerRef.current = null
    setScanning(false)
    if (scanner) await releaseScanner(scanner)
  }

  const acceptScan = decodedText => {
    setScanResult(decodedText)
    setScanError('')
    setCopied(false)
    const scanner = scannerRef.current
    scannerRef.current = null
    setScanning(false)
    if (scanner) releaseScanner(scanner)
  }

  const startScanner = async () => {
    await stopScanner()
    setScanResult('')
    setScanError('')
    setCopied(false)

    const scanner = new Html5Qrcode('qr-barcode-reader', {
      formatsToSupport: SCANNER_FORMATS,
      verbose: false,
    })
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: (width, height) => {
            const edge = Math.max(180, Math.floor(Math.min(width, height) * 0.72))
            return { width: edge, height: edge }
          },
        },
        acceptScan,
        () => {}
      )
      setScanning(true)
    } catch {
      if (scannerRef.current === scanner) scannerRef.current = null
      await releaseScanner(scanner)
      setScanning(false)
      setScanError(t('qrBarcode.cameraFailed'))
    }
  }

  const scanImage = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    await stopScanner()
    setScanResult('')
    setScanError('')
    setCopied(false)

    const scanner = new Html5Qrcode('qr-barcode-reader', {
      formatsToSupport: SCANNER_FORMATS,
      verbose: false,
    })
    scannerRef.current = scanner

    try {
      const result = await scanner.scanFile(file, true)
      setScanResult(result)
      setScanError('')
    } catch {
      setScanError(t('qrBarcode.imageScanFailed'))
    } finally {
      if (scannerRef.current === scanner) scannerRef.current = null
      try {
        scanner.clear()
      } catch {}
    }
  }

  const copyResult = async () => {
    if (!scanResult) return
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(scanResult)
      else copyFallback(scanResult)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  const activeSvg = generatorKind === 'barcode' ? barcodeResult.svg : ''
  const hasPreview = generatorKind === 'barcode' ? Boolean(activeSvg) : Boolean(preview)
  const isWebLink = /^https?:\/\//i.test(scanResult)

  const downloadPng = async () => {
    if (!hasPreview) return
    if (generatorKind === 'qr') {
      const link = document.createElement('a')
      link.href = preview
      link.download = 'shadow-qr.png'
      link.click()
      return
    }
    try {
      const blob = await svgToPngBlob(activeSvg)
      downloadBlob(blob, `shadow-${barcodeType.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}.png`)
    } catch {}
  }

  const downloadSvg = async () => {
    if (!hasPreview) return
    if (generatorKind === 'barcode') {
      downloadBlob(new Blob([activeSvg], { type: 'image/svg+xml' }), `shadow-${barcodeType.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}.svg`)
      return
    }
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

  const shareCode = async () => {
    if (!hasPreview || !navigator.share) return
    try {
      let blob
      let fileName
      if (generatorKind === 'barcode') {
        blob = await svgToPngBlob(activeSvg)
        fileName = 'shadow-barcode.png'
      } else {
        blob = await (await fetch(preview)).blob()
        fileName = 'shadow-qr.png'
      }
      const file = new File([blob], fileName, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: t('qrBarcode.title') })
      else await navigator.share({ title: t('qrBarcode.title'), text: generatorKind === 'barcode' ? barcodeResult.value : payload })
    } catch {}
  }

  const currentError = generatorKind === 'barcode' ? barcodeResult.error : error
  const currentEmpty = generatorKind === 'barcode' ? t('qrBarcode.barcodeEmpty') : t('qrBarcode.empty')

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
          <section className="mt-5 space-y-4">
            <div className="overflow-hidden rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <div id="qr-barcode-reader" className="min-h-[260px] overflow-hidden rounded-2xl bg-[#080808] [&_video]:rounded-2xl" />
              <p className="mt-3 text-center text-xs leading-5 text-black/50 dark:text-white/50">{t('qrBarcode.scanHint')}</p>
              {scanError ? <p className="mt-3 text-center text-xs font-medium text-red-500">{scanError}</p> : null}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button type="button" onClick={scanning ? stopScanner : startScanner} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff6a00] text-xs font-bold text-white shadow-[0_8px_22px_rgba(255,106,0,.22)]">
                  {scanning ? <Square size={16} /> : <Camera size={17} />}
                  {t(scanning ? 'qrBarcode.stopCamera' : 'qrBarcode.startCamera')}
                </button>
                <button type="button" onClick={() => imageInputRef.current?.click()} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-bold dark:border-white/10">
                  <ImagePlus size={17} />
                  {t('qrBarcode.scanImage')}
                </button>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={scanImage} className="hidden" />
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <h2 className="text-[13px] font-bold">{t('qrBarcode.scanResult')}</h2>
              <div className="mt-3 min-h-[88px] break-all rounded-2xl bg-[#f5f5f5] p-4 text-sm leading-6 text-black/70 dark:bg-[#090909] dark:text-white/75">
                {scanResult || t('qrBarcode.noResult')}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button type="button" disabled={!scanResult} onClick={copyResult} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <Copy size={16} />
                  {t(copied ? 'qrBarcode.copied' : 'qrBarcode.copy')}
                </button>
                <button type="button" disabled={!isWebLink} onClick={() => window.open(scanResult, '_blank', 'noopener,noreferrer')} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <ExternalLink size={16} />
                  {t('qrBarcode.openLink')}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-6">
              <h2 className="mb-3 text-[15px] font-bold">{t('qrBarcode.qrType')}</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {QR_TYPES.map(([key, Icon]) => (
                  <button type="button" key={key} onClick={() => chooseQrType(key)} className={`flex min-h-[78px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 text-center text-[12px] font-semibold transition ${generatorKind === 'qr' && type === key ? 'border-[#ff6a00] bg-[#fff3ea] text-[#e85f00] shadow-[0_8px_22px_rgba(255,106,0,.12)] dark:bg-[#27150a] dark:text-[#ff8a3d]' : 'border-black/10 bg-white text-black/70 dark:border-white/10 dark:bg-[#151515] dark:text-white/70'}`}>
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
                  <button type="button" key={item} onClick={() => chooseBarcodeType(item)} className={`flex h-[72px] flex-col items-center justify-center gap-2 rounded-2xl border text-[11px] font-semibold transition ${generatorKind === 'barcode' && barcodeType === item ? 'border-[#ff6a00] bg-[#fff3ea] text-[#e85f00] shadow-[0_8px_22px_rgba(255,106,0,.12)] dark:bg-[#27150a] dark:text-[#ff8a3d]' : 'border-black/10 bg-white text-black/70 dark:border-white/10 dark:bg-[#151515] dark:text-white/70'}`}>
                    <span className="text-[22px] tracking-[-3px]">|||||||</span>
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <label className="mb-2 block text-[12px] font-semibold text-black/55 dark:text-white/55">
                {generatorKind === 'barcode' ? t('qrBarcode.barcodeValue') : type === 'website' ? t('qrBarcode.websiteUrl') : t('qrBarcode.enterValue')}
              </label>
              <div className="flex h-13 items-center gap-3 rounded-2xl border border-black/10 bg-[#fafafa] px-4 dark:border-white/10 dark:bg-[#090909]">
                {generatorKind === 'barcode' ? <QrCode size={19} className="shrink-0 text-[#ff6a00]" /> : <Link2 size={19} className="shrink-0 text-[#ff6a00]" />}
                <input value={value} onChange={event => setValue(event.target.value)} inputMode={generatorKind === 'barcode' && barcodeType !== 'CODE128' ? 'numeric' : 'text'} className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/30 dark:placeholder:text-white/30" placeholder={generatorKind === 'barcode' ? BARCODE_SAMPLES[barcodeType] : type === 'website' ? 'https://example.com' : t('qrBarcode.enterValue')} />
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
                    <span>{size}px</span>
                  </div>
                  <input type="range" min="180" max="600" step="20" value={size} onChange={event => setSize(Number(event.target.value))} className="h-2 w-full accent-[#ff6a00]" />
                </div>
              </div>
            </section>

            <section className="mt-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212]">
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-bold">{t('qrBarcode.preview')}</h2>
                <span className="text-[11px] text-black/40 dark:text-white/40">{generatorKind === 'barcode' ? barcodeType : `${size} × ${size}px`}</span>
              </div>
              <div className="mt-4 flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-[#f5f5f5] p-5 dark:bg-[#090909]">
                {generatorKind === 'barcode' && activeSvg ? <div className="w-full max-w-full overflow-hidden rounded-xl bg-white p-3 shadow-lg [&>svg]:h-auto [&>svg]:max-h-[260px] [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: activeSvg }} /> : null}
                {generatorKind === 'qr' && preview ? <img src={preview} alt="QR preview" className="max-h-[260px] max-w-full rounded-xl bg-white p-2 shadow-lg" /> : null}
                {!hasPreview ? <p className="px-6 text-center text-sm text-black/40 dark:text-white/40">{currentError || currentEmpty}</p> : null}
              </div>
              {currentError ? <p className="mt-3 text-center text-xs font-medium text-red-500">{currentError}</p> : null}
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                <button type="button" disabled={!hasPreview} onClick={downloadPng} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <Download size={17} />
                  {t('qrBarcode.downloadPng')}
                </button>
                <button type="button" disabled={!hasPreview} onClick={downloadSvg} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <FileCode2 size={17} />
                  {t('qrBarcode.downloadSvg')}
                </button>
                <button type="button" disabled={!hasPreview || !navigator.share} onClick={shareCode} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-xs font-semibold disabled:opacity-35 dark:border-white/10">
                  <Share2 size={17} />
                  {t('qrBarcode.share')}
                </button>
              </div>
            </section>

            <button type="button" disabled={!hasPreview} className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#ff6a00] text-[15px] font-extrabold text-white shadow-[0_12px_30px_rgba(255,106,0,.28)] active:scale-[0.99] disabled:opacity-40">
              <QrCode size={20} />
              {t(generatorKind === 'barcode' ? 'qrBarcode.generateBarcode' : 'qrBarcode.generateQr')}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
