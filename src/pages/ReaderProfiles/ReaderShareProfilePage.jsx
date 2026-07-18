import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import ReaderQrScannerSheet from '../../components/reader-profile/ReaderQrScannerSheet'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MODES = ['emoji', 'image', 'color']

const EMOJI_BACKGROUNDS = [
  { key: 'sunflower', label: 'Sunflower', src: '/assets/Share%20Profile/Sunflower.webp', qrColors: ['#8a4b00', '#c27803'] },
  { key: 'starfish', label: 'Starfish', src: '/assets/Share%20Profile/Starfish.webp', qrColors: ['#92400e', '#c2410c'] },
  { key: 'heart', label: 'Heart', src: '/assets/Share%20Profile/Heart.webp', qrColors: ['#be123c', '#db2777'] },
  { key: 'butterfly', label: 'Butterfly', src: '/assets/Share%20Profile/Butterfly.webp', qrColors: ['#5b21b6', '#7c3aed'] },
  { key: 'moon', label: 'Moon', src: '/assets/Share%20Profile/Moon.webp', qrColors: ['#854d0e', '#a16207'] },
  { key: 'flower', label: 'Flower', src: '/assets/Share%20Profile/Flower.webp', qrColors: ['#9d174d', '#c026d3'] },
  { key: 'book', label: 'Book', src: '/assets/Share%20Profile/Book.webp', qrColors: ['#5b21b6', '#9333ea'] },
  { key: 'manga', label: 'Manga', src: '/assets/Share%20Profile/Manga.webp', qrColors: ['#be123c', '#7e22ce'] },
  { key: 'mapleleaf', label: 'Maple leaf', src: '/assets/Share%20Profile/Mapleleaf.webp', qrColors: ['#7c2d12', '#c2410c'] },
  { key: 'snowman', label: 'Snowman', src: '/assets/Share%20Profile/Snowman.webp', qrColors: ['#1e40af', '#475569'] },
]

const COLOR_BACKGROUNDS = [
  { key: 'sunset', label: 'Sunset', colors: ['#ffbf00', '#ff7a18', '#ff006e'], qrColors: ['#9a4300', '#be123c'] },
  { key: 'violet', label: 'Violet', colors: ['#6d28d9', '#8b5cf6', '#c084fc'], qrColors: ['#4c1d95', '#7e22ce'] },
  { key: 'sky', label: 'Sky', colors: ['#0ea5e9', '#6366f1', '#a855f7'], qrColors: ['#075985', '#4338ca'] },
  { key: 'rose', label: 'Rose', colors: ['#fb7185', '#f472b6', '#c084fc'], qrColors: ['#9f1239', '#a21caf'] },
  { key: 'mint', label: 'Mint', colors: ['#34d399', '#22d3ee', '#60a5fa'], qrColors: ['#047857', '#0369a1'] },
  { key: 'peach', label: 'Peach', colors: ['#fed7aa', '#fb7185', '#f43f5e'], qrColors: ['#9a3412', '#be123c'] },
  { key: 'night', label: 'Night', colors: ['#111827', '#312e81', '#7c3aed'], qrColors: ['#312e81', '#6d28d9'] },
]

const IMAGE_QR_COLORS = ['#374151', '#111827']

const CUSTOM_IMAGE_STORAGE_PREFIX = 'shadow-share-profile-custom:'
const SHARE_SETTINGS_STORAGE_PREFIX = 'shadow-share-profile-settings:'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem('shadow_reader_user') ||
        sessionStorage.getItem('shadow_reader_user') ||
        'null'
    )
  } catch {
    return null
  }
}

function getStorageKey(prefix, user) {
  return `${prefix}${user?.id || user?.username || 'reader'}`
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || '') || fallback
  } catch {
    return fallback
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2)

  ctx.beginPath()
  ctx.moveTo(x + safeRadius, y)
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius)
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius)
  ctx.arcTo(x, y + height, x, y, safeRadius)
  ctx.arcTo(x, y, x + width, y, safeRadius)
  ctx.closePath()
}

function drawCoverImage(ctx, image, width, height) {
  const scale = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const x = (width - drawWidth) / 2
  const y = (height - drawHeight) / 2

  ctx.drawImage(image, x, y, drawWidth, drawHeight)
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create image'))
    }, 'image/png')
  })
}

function drawThemedQr(ctx, qrImage, x, y, size, colors) {
  const qrCanvas = document.createElement('canvas')
  qrCanvas.width = size
  qrCanvas.height = size

  const qrCtx = qrCanvas.getContext('2d')

  if (!qrCtx) {
    ctx.drawImage(qrImage, x, y, size, size)
    return
  }

  qrCtx.drawImage(qrImage, 0, 0, size, size)
  qrCtx.globalCompositeOperation = 'source-in'

  const gradient = qrCtx.createLinearGradient(0, 0, size, size)
  const lastIndex = colors.length - 1

  colors.forEach((color, index) => {
    gradient.addColorStop(lastIndex ? index / lastIndex : 0, color)
  })

  qrCtx.fillStyle = gradient
  qrCtx.fillRect(0, 0, size, size)
  qrCtx.globalCompositeOperation = 'source-over'

  ctx.drawImage(qrCanvas, x, y, size, size)
}

export default function ReaderShareProfilePage() {
  const navigate = useNavigate()
  const uploadInputRef = useRef(null)
  const user = useMemo(() => getStoredUser(), [])
  const settingsKey = useMemo(
    () => getStorageKey(SHARE_SETTINGS_STORAGE_PREFIX, user),
    [user]
  )
  const customImageKey = useMemo(
    () => getStorageKey(CUSTOM_IMAGE_STORAGE_PREFIX, user),
    [user]
  )
  const savedSettings = useMemo(
    () => readJsonStorage(settingsKey, {}),
    [settingsKey]
  )
  const savedCustomImage = useMemo(
    () => readJsonStorage(customImageKey, null),
    [customImageKey]
  )

  const [mode, setMode] = useState(
    MODES.includes(savedSettings.mode) ? savedSettings.mode : 'emoji'
  )
  const [emojiKey, setEmojiKey] = useState(savedSettings.emojiKey || 'sunflower')
  const [colorKey, setColorKey] = useState(savedSettings.colorKey || 'sunset')
  const [customImage, setCustomImage] = useState(() => {
    if (!savedCustomImage?.imageUrl || !savedCustomImage?.expiresAt) return null
    if (new Date(savedCustomImage.expiresAt).getTime() <= Date.now()) return null
    return savedCustomImage
  })
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [scannerOpen, setScannerOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const username = String(user?.username || 'reader').replace(/^@+/, '')
  const profileUrl = `${window.location.origin}/profile?username=${encodeURIComponent(username)}`
  const selectedEmoji =
    EMOJI_BACKGROUNDS.find((item) => item.key === emojiKey) || EMOJI_BACKGROUNDS[0]
  const selectedColor =
  COLOR_BACKGROUNDS.find((item) => item.key === colorKey) || COLOR_BACKGROUNDS[0]

const qrColors =
  mode === 'color'
    ? selectedColor.qrColors
    : mode === 'emoji'
      ? selectedEmoji.qrColors
      : IMAGE_QR_COLORS

const qrGradient = `linear-gradient(135deg, ${qrColors.join(', ')})`

const backgroundStyle = useMemo(() => {
    if (mode === 'image' && customImage?.imageUrl) {
      return {
        backgroundImage: `url("${customImage.imageUrl}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }
    }

    if (mode === 'color') {
      return {
        backgroundImage: `linear-gradient(155deg, ${selectedColor.colors.join(', ')})`,
      }
    }

    return {
      backgroundColor: '#ffffff',
      backgroundImage: `url("${selectedEmoji.src}")`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }
  }, [customImage, mode, selectedColor, selectedEmoji])

  useEffect(() => {
    if (!getAuthToken() || !user?.username) {
      navigate('/login', { replace: true })
    }
  }, [navigate, user?.username])

  useEffect(() => {
    let cancelled = false

    QRCode.toDataURL(profileUrl, {
  width: 900,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: {
    dark: '#000000ff',
    light: '#00000000',
  },
})
      .then((value) => {
        if (!cancelled) setQrDataUrl(value)
      })
      .catch(() => {
        if (!cancelled) setMessage('Failed to create QR code.')
      })

    return () => {
      cancelled = true
    }
  }, [profileUrl])

  useEffect(() => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({ mode, emojiKey, colorKey })
    )
  }, [colorKey, emojiKey, mode, settingsKey])

  useEffect(() => {
    if (!savedCustomImage?.expiresAt) return

    if (new Date(savedCustomImage.expiresAt).getTime() > Date.now()) return

    localStorage.removeItem(customImageKey)

    const token = getAuthToken()
    if (!token) return

    fetch(`${API_BASE_URL}/api/share-profile/custom-image`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {})
  }, [customImageKey, savedCustomImage?.expiresAt])

  function showMessage(text) {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2200)
  }

  function cycleMode() {
    const currentIndex = MODES.indexOf(mode)
    setMode(MODES[(currentIndex + 1) % MODES.length])
  }

  async function handleCustomImage(file) {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showMessage('Please choose an image file.')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      showMessage('Image must be 8 MB or smaller.')
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setUploading(true)
      setMessage('')

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_BASE_URL}/api/share-profile/custom-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || 'Failed to upload image')
      }

      const nextImage = {
        imageUrl: data.image_url,
        expiresAt: data.expires_at,
      }

      localStorage.setItem(customImageKey, JSON.stringify(nextImage))
      setCustomImage(nextImage)
      setMode('image')
      showMessage('Custom image is ready for 24 hours.')
    } catch (error) {
      showMessage(error.message || 'Failed to upload image.')
    } finally {
      setUploading(false)
    }
  }

  const createShareArtwork = useCallback(async () => {
    if (!qrDataUrl) throw new Error('QR code is not ready')

    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Canvas is unavailable')

    if (mode === 'color') {
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920)
      const lastIndex = selectedColor.colors.length - 1
      selectedColor.colors.forEach((color, index) => {
        gradient.addColorStop(lastIndex ? index / lastIndex : 0, color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1080, 1920)
    } else {
      const source =
        mode === 'image' && customImage?.imageUrl
          ? customImage.imageUrl
          : selectedEmoji.src
      const backgroundImage = await loadImage(source)
      drawCoverImage(ctx, backgroundImage, 1080, 1920)
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
    ctx.fillRect(0, 0, 1080, 1920)

    ctx.save()
    ctx.shadowColor = 'rgba(17, 24, 39, 0.18)'
    ctx.shadowBlur = 34
    ctx.shadowOffsetY = 14
    drawRoundedRect(ctx, 110, 350, 860, 1040, 48)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.restore()

    const qrImage = await loadImage(qrDataUrl)
drawThemedQr(ctx, qrImage, 210, 455, 660, qrColors)

    ctx.fillStyle = '#111827'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '700 62px Arial, sans-serif'
    ctx.fillText(`@${username}`, 540, 1245)

    ctx.fillStyle = '#6b7280'
    ctx.font = '500 30px Arial, sans-serif'
    ctx.fillText('Shadow Reader Profile', 540, 1310)

    return canvasToBlob(canvas)
  }, [customImage?.imageUrl, mode, qrColors, qrDataUrl, selectedColor, selectedEmoji.src, username])

  async function handleDownload() {
    try {
      showMessage('Preparing image...')
      const blob = await createShareArtwork()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `shadow-${username}-profile.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      showMessage('Profile image downloaded.')
    } catch (error) {
      showMessage(error.message || 'Failed to download image.')
    }
  }

  async function handleShare() {
    try {
      const blob = await createShareArtwork()
      const file = new File([blob], `shadow-${username}-profile.png`, {
        type: 'image/png',
      })

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `@${username} on Shadow`,
          text: `View @${username} on Shadow.`,
          url: profileUrl,
          files: [file],
        })
        return
      }

      if (navigator.share) {
        await navigator.share({
          title: `@${username} on Shadow`,
          text: `View @${username} on Shadow.`,
          url: profileUrl,
        })
        return
      }

      await navigator.clipboard.writeText(profileUrl)
      showMessage('Profile link copied.')
    } catch (error) {
      if (error?.name !== 'AbortError') {
        showMessage(error.message || 'Failed to share profile.')
      }
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl)
      showMessage('Profile link copied.')
    } catch {
      showMessage('Failed to copy profile link.')
    }
  }

  function handleScannedResult(decodedText) {
    try {
      const decodedUrl = new URL(decodedText, window.location.origin)
      const allowedHosts = new Set([
        window.location.host,
        'shadowerabook.site',
        'www.shadowerabook.site',
      ])
      const scannedUsername = String(decodedUrl.searchParams.get('username') || '')
        .trim()
        .replace(/^@+/, '')

      if (
        !allowedHosts.has(decodedUrl.host) ||
        decodedUrl.pathname !== '/profile' ||
        !scannedUsername
      ) {
        throw new Error('This is not a valid Shadow profile QR code.')
      }

      setScannerOpen(false)
      navigate(`/profile?username=${encodeURIComponent(scannedUsername)}`)
    } catch (error) {
      setScannerOpen(false)
      showMessage(error.message || 'Invalid QR code.')
    }
  }

  if (!user?.username) return null

  return (
    <div className="min-h-[100dvh] bg-[#0b0f14] md:p-4">
      <ReaderQrScannerSheet
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onResult={handleScannedResult}
      />

      <main
        className="relative mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col overflow-hidden bg-white md:min-h-[calc(100dvh-2rem)] md:rounded-[28px]"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-black/5" />

        <header className="relative z-20 flex h-[62px] items-center justify-between px-4 text-[#111827]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur active:scale-95"
            aria-label="Close share profile"
          >
            <i className="fa-solid fa-xmark text-[21px]" />
          </button>

          <button
            type="button"
            onClick={cycleMode}
            className="h-10 min-w-[98px] rounded-full border border-[#111827]/20 bg-white/90 px-5 text-[13px] font-semibold uppercase tracking-[0.16em] shadow-sm backdrop-blur active:scale-[0.98]"
          >
            {mode}
          </button>

          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur active:scale-95"
            aria-label="Scan profile QR"
          >
            <i className="fa-solid fa-qrcode text-[20px]" />
          </button>
        </header>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 pb-5 pt-3">
          <section className="mx-auto w-full max-w-[456px] rounded-[28px] bg-white px-5 pb-7 pt-6 shadow-[0_18px_50px_rgba(17,24,39,0.18)]">
            <div className="mx-auto aspect-square w-full max-w-[330px] overflow-hidden rounded-[18px] bg-white">
              {qrDataUrl ? (
  <div
    role="img"
    aria-label={`QR code for @${username}`}
    className="h-full w-full"
    style={{
      backgroundImage: qrGradient,
      WebkitMaskImage: `url("${qrDataUrl}")`,
      maskImage: `url("${qrDataUrl}")`,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
    }}
  />
) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#7c3aed]" />
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-[24px] font-semibold tracking-tight text-[#111827]">
              @{username}
            </div>
          </section>

          <section className="mx-auto mt-4 grid w-full max-w-[456px] grid-cols-3 rounded-[24px] bg-white px-3 py-4 shadow-[0_14px_40px_rgba(17,24,39,0.16)]">
            <button
              type="button"
              onClick={handleShare}
              className="flex min-w-0 flex-col items-center gap-2 rounded-[18px] px-1 py-2 active:bg-[#f7f7fb]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e7eb] text-[#111827]">
                <i className="fa-solid fa-share-nodes text-[18px]" />
              </span>
              <span className="line-clamp-1 text-[12px] font-normal text-[#111827]">Share profile</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex min-w-0 flex-col items-center gap-2 rounded-[18px] px-1 py-2 active:bg-[#f7f7fb]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e7eb] text-[#111827]">
                <i className="fa-solid fa-link text-[18px]" />
              </span>
              <span className="line-clamp-1 text-[12px] font-normal text-[#111827]">Copy link</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex min-w-0 flex-col items-center gap-2 rounded-[18px] px-1 py-2 active:bg-[#f7f7fb]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e5e7eb] text-[#111827]">
                <i className="fa-solid fa-download text-[18px]" />
              </span>
              <span className="line-clamp-1 text-[12px] font-normal text-[#111827]">Download</span>
            </button>
          </section>

          <section className="mx-auto mt-4 w-full max-w-[456px] rounded-[22px] bg-white/92 p-3 shadow-[0_12px_34px_rgba(17,24,39,0.14)] backdrop-blur">
            {mode === 'emoji' ? (
              <div className="share-profile-scroll flex snap-x gap-2 overflow-x-auto pb-1">
                {EMOJI_BACKGROUNDS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setEmojiKey(item.key)}
                    className={`relative h-[78px] w-[52px] shrink-0 snap-start overflow-hidden rounded-[12px] bg-white transition active:scale-95 ${
                      emojiKey === item.key
                        ? 'ring-2 ring-[#7c3aed] ring-offset-2'
                        : 'ring-1 ring-black/10'
                    }`}
                    aria-label={item.label}
                  >
                    <img src={item.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            {mode === 'image' ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  disabled={uploading}
                  className="flex h-12 flex-1 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] px-4 text-[13px] font-semibold text-white active:scale-[0.99] disabled:opacity-60"
                >
                  <i className="fa-regular fa-image mr-2 text-[16px]" />
                  {uploading ? 'Uploading...' : customImage ? 'Change image' : 'Choose image'}
                </button>

                {customImage ? (
                  <div className="h-12 w-12 overflow-hidden rounded-[12px] ring-1 ring-black/10">
                    <img
                      src={customImage.imageUrl}
                      alt="Custom background"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <input
                  ref={uploadInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    handleCustomImage(event.target.files?.[0] || null)
                    event.target.value = ''
                  }}
                />
              </div>
            ) : null}

            {mode === 'color' ? (
              <div className="share-profile-scroll flex snap-x gap-3 overflow-x-auto px-1 py-1">
                {COLOR_BACKGROUNDS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setColorKey(item.key)}
                    className={`h-12 w-12 shrink-0 snap-start rounded-full transition active:scale-95 ${
                      colorKey === item.key
                        ? 'ring-2 ring-[#111827] ring-offset-2'
                        : 'ring-1 ring-black/10'
                    }`}
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${item.colors.join(', ')})`,
                    }}
                    aria-label={item.label}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </div>

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="absolute bottom-5 left-1/2 z-40 max-w-[calc(100%_-_2rem)] -translate-x-1/2 rounded-full bg-[#111827] px-4 py-2.5 text-center text-[12px] font-normal text-white shadow-xl"
          >
            {message}
          </button>
        ) : null}

        <style>{`.share-profile-scroll::-webkit-scrollbar{display:none}.share-profile-scroll{-ms-overflow-style:none;scrollbar-width:none}`}</style>
      </main>
    </div>
  )
}
