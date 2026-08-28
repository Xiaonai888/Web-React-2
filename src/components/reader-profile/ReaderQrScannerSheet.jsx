import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerQrScannerSheet', {
  en: {
    pointCamera: 'Point your camera at a Shadow profile QR code.',
    cameraUnavailable: 'Camera is unavailable. You can choose a QR image instead.',
    readingImage: 'Reading QR image...',
    noQrFound: 'No QR code was found in this image.',
    closeScanner: 'Close scanner',
    scanProfileQr: 'Scan profile QR',
    chooseQrImage: 'Choose QR image',
    tryCameraAgain: 'Try camera again',
  },
  km: {
    pointCamera: 'តម្រង់កាមេរ៉ាទៅកាន់ QR Code របស់ Shadow Profile។',
    cameraUnavailable: 'មិនអាចប្រើកាមេរ៉ាបានទេ។ អ្នកអាចជ្រើសរើសរូបភាព QR ជំនួសបាន។',
    readingImage: 'កំពុងអានរូបភាព QR...',
    noQrFound: 'រកមិនឃើញ QR Code ក្នុងរូបភាពនេះទេ។',
    closeScanner: 'បិទ Scanner',
    scanProfileQr: 'ស្កេន QR របស់ Profile',
    chooseQrImage: 'ជ្រើសរើសរូបភាព QR',
    tryCameraAgain: 'សាកកាមេរ៉ាម្តងទៀត',
  },
  zh: {
    pointCamera: '将摄像头对准 Shadow 个人资料二维码。',
    cameraUnavailable: '摄像头不可用。你可以改为选择二维码图片。',
    readingImage: '正在读取二维码图片...',
    noQrFound: '此图片中未找到二维码。',
    closeScanner: '关闭扫描器',
    scanProfileQr: '扫描个人资料二维码',
    chooseQrImage: '选择二维码图片',
    tryCameraAgain: '再次尝试摄像头',
  },
  ja: {
    pointCamera: 'Shadow プロフィールのQRコードにカメラを向けてください。',
    cameraUnavailable: 'カメラを利用できません。代わりにQR画像を選択できます。',
    readingImage: 'QR画像を読み取り中...',
    noQrFound: 'この画像にQRコードが見つかりませんでした。',
    closeScanner: 'スキャナーを閉じる',
    scanProfileQr: 'プロフィールQRをスキャン',
    chooseQrImage: 'QR画像を選択',
    tryCameraAgain: 'カメラを再試行',
  },
  ko: {
    pointCamera: '카메라를 Shadow 프로필 QR 코드에 맞춰 주세요.',
    cameraUnavailable: '카메라를 사용할 수 없습니다. 대신 QR 이미지를 선택할 수 있습니다.',
    readingImage: 'QR 이미지를 읽는 중...',
    noQrFound: '이 이미지에서 QR 코드를 찾을 수 없습니다.',
    closeScanner: '스캐너 닫기',
    scanProfileQr: '프로필 QR 스캔',
    chooseQrImage: 'QR 이미지 선택',
    tryCameraAgain: '카메라 다시 시도',
  },
})

const SCANNER_ELEMENT_ID = 'shadow-reader-qr-scanner'

export default function ReaderQrScannerSheet({ open, onClose, onResult }) {
  const { t } = useDisplayTranslation()
  const scannerRef = useRef(null)
  const handledRef = useRef(false)
  const [message, setMessage] = useState(() => t('readerQrScannerSheet.pointCamera'))
  const [starting, setStarting] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

  async function stopScanner() {
    const scanner = scannerRef.current

    if (!scanner) return

    try {
      if (scanner.isScanning) {
        await scanner.stop()
      }
    } catch {
      return
    } finally {
      try {
        await scanner.clear()
      } catch {
        return
      }
    }
  }

  async function finishScan(decodedText) {
    if (handledRef.current) return

    handledRef.current = true
    await stopScanner()
    onResult(decodedText)
  }

  useEffect(() => {
    if (!open) return undefined

    let cancelled = false
    handledRef.current = false
    setMessage(t('readerQrScannerSheet.pointCamera'))
    setStarting(true)
    setCameraActive(false)

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        },
        (decodedText) => {
          if (!cancelled) finishScan(decodedText)
        },
        () => {}
      )
      .then(() => {
        if (!cancelled) {
          setCameraActive(true)
          setStarting(false)
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStarting(false)
          setCameraActive(false)
          setMessage(error?.message || t('readerQrScannerSheet.cameraUnavailable'))
        }
      })

    return () => {
      cancelled = true
      stopScanner()
      scannerRef.current = null
    }
  }, [open])

  async function handleImageFile(file) {
    if (!file) return

    try {
      setMessage(t('readerQrScannerSheet.readingImage'))
      await stopScanner()

      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
      scannerRef.current = scanner
      const decodedText = await scanner.scanFile(file, true)
      await finishScan(decodedText)
    } catch (error) {
      handledRef.current = false
      setMessage(error?.message || t('readerQrScannerSheet.noQrFound'))
    }
  }

  async function handleClose() {
    await stopScanner()
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[260] bg-[#0b0f14] text-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col bg-[#0b0f14]">
        <header className="flex h-[58px] items-center justify-between px-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
            aria-label={t('readerQrScannerSheet.closeScanner')}
          >
            <i className="fa-solid fa-xmark text-[22px]" />
          </button>

          <h1 className="text-[17px] font-semibold">
            {t('readerQrScannerSheet.scanProfileQr')}
          </h1>

          <div className="h-10 w-10" />
        </header>

        <main className="flex flex-1 flex-col px-4 pb-8 pt-4">
          <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[28px] bg-black ring-1 ring-white/10">
            <div id={SCANNER_ELEMENT_ID} className="h-full w-full overflow-hidden" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[250px] w-[250px] rounded-[28px] border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.34)]" />
            </div>

            {starting ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/30 border-t-white" />
              </div>
            ) : null}
          </div>

          <p className="mx-auto mt-5 max-w-[360px] text-center text-[13px] font-normal leading-5 text-white/70">
            {message}
          </p>

          <label className="mx-auto mt-6 flex h-12 w-full max-w-[360px] cursor-pointer items-center justify-center rounded-[14px] bg-white text-[14px] font-semibold text-[#111827] active:scale-[0.99]">
            <i className="fa-regular fa-image mr-2 text-[16px]" />
            {t('readerQrScannerSheet.chooseQrImage')}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                handleImageFile(event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>

          {!cameraActive && !starting ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mx-auto mt-3 h-11 w-full max-w-[360px] rounded-[14px] border border-white/20 text-[13px] font-semibold text-white active:bg-white/10"
            >
              {t('readerQrScannerSheet.tryCameraAgain')}
            </button>
          ) : null}
        </main>
      </div>
    </div>
  )
}
