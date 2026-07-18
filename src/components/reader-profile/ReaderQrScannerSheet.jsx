import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

const SCANNER_ELEMENT_ID = 'shadow-reader-qr-scanner'

export default function ReaderQrScannerSheet({ open, onClose, onResult }) {
  const scannerRef = useRef(null)
  const handledRef = useRef(false)
  const [message, setMessage] = useState('Point your camera at a Shadow profile QR code.')
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
    setMessage('Point your camera at a Shadow profile QR code.')
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
          setMessage(error?.message || 'Camera is unavailable. You can choose a QR image instead.')
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
      setMessage('Reading QR image...')
      await stopScanner()

      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
      scannerRef.current = scanner
      const decodedText = await scanner.scanFile(file, true)
      await finishScan(decodedText)
    } catch (error) {
      handledRef.current = false
      setMessage(error?.message || 'No QR code was found in this image.')
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
            aria-label="Close scanner"
          >
            <i className="fa-solid fa-xmark text-[22px]" />
          </button>

          <h1 className="text-[17px] font-semibold">Scan profile QR</h1>

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
            Choose QR image
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
              Try camera again
            </button>
          ) : null}
        </main>
      </div>
    </div>
  )
}
