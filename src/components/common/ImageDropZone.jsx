import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('imageDropZone', {
  en: { dropImageHere: 'Drop image here' },
  km: { dropImageHere: 'ទម្លាក់រូបភាពនៅទីនេះ' },
  zh: { dropImageHere: '将图片拖放到这里' },
  ja: { dropImageHere: 'ここに画像をドロップ' },
  ko: { dropImageHere: '여기에 이미지를 놓으세요' },
})

let mountedDropZones = 0

function hasFilePayload(event) {
  return Array.from(event.dataTransfer?.types || []).includes('Files')
}

function preventBrowserFileOpen(event) {
  if (hasFilePayload(event)) event.preventDefault()
}

function installGlobalFileDropGuard() {
  if (typeof window === 'undefined') return

  mountedDropZones += 1

  if (mountedDropZones === 1) {
    window.addEventListener('dragover', preventBrowserFileOpen)
    window.addEventListener('drop', preventBrowserFileOpen)
  }
}

function removeGlobalFileDropGuard() {
  if (typeof window === 'undefined') return

  mountedDropZones = Math.max(0, mountedDropZones - 1)

  if (mountedDropZones === 0) {
    window.removeEventListener('dragover', preventBrowserFileOpen)
    window.removeEventListener('drop', preventBrowserFileOpen)
  }
}

function normalizeAccept(accept) {
  const values = Array.isArray(accept)
    ? accept
    : String(accept || 'image/*').split(',')

  return values
    .map((value) => String(value).trim().toLowerCase())
    .filter(Boolean)
}

function fileMatchesAccept(file, acceptRules) {
  const fileType = String(file?.type || '').toLowerCase()
  const fileName = String(file?.name || '').toLowerCase()

  return acceptRules.some((rule) => {
    if (rule === '*/*') return true
    if (rule.startsWith('.')) return fileName.endsWith(rule)
    if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1))
    return fileType === rule
  })
}

export default function ImageDropZone({
  children,
  onFiles,
  onRejectedFiles,
  disabled = false,
  multiple = false,
  maxFiles = null,
  accept = 'image/*',
  className = '',
  label = '',
}) {
  const { t } = useDisplayTranslation()
  const [dragging, setDragging] = useState(false)
  const displayLabel = label || t('imageDropZone.dropImageHere')
  const dragDepth = useRef(0)

  useEffect(() => {
    installGlobalFileDropGuard()
    return removeGlobalFileDropGuard
  }, [])

  const stopEvent = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter = (event) => {
    if (!hasFilePayload(event)) return

    stopEvent(event)

    if (disabled) return

    dragDepth.current += 1
    setDragging(true)
  }

  const handleDragOver = (event) => {
    if (!hasFilePayload(event)) return

    stopEvent(event)
    event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'
  }

  const handleDragLeave = (event) => {
    if (!dragging && !hasFilePayload(event)) return

    stopEvent(event)

    if (disabled) return

    dragDepth.current = Math.max(0, dragDepth.current - 1)

    if (dragDepth.current === 0) {
      setDragging(false)
    }
  }

  const handleDrop = (event) => {
    if (!hasFilePayload(event)) return

    stopEvent(event)

    dragDepth.current = 0
    setDragging(false)

    if (disabled) return

    const allFiles = Array.from(event.dataTransfer.files || [])
    const acceptRules = normalizeAccept(accept)
    const acceptedFiles = []
    const rejectedFiles = []

    allFiles.forEach((file) => {
      if (fileMatchesAccept(file, acceptRules)) {
        acceptedFiles.push(file)
      } else {
        rejectedFiles.push(file)
      }
    })

    const numericMaxFiles = Number(maxFiles)
    const allowedCount = multiple
      ? Number.isFinite(numericMaxFiles) && numericMaxFiles > 0
        ? Math.floor(numericMaxFiles)
        : acceptedFiles.length
      : 1

    const selectedFiles = acceptedFiles.slice(0, allowedCount)
    rejectedFiles.push(...acceptedFiles.slice(allowedCount))

    if (rejectedFiles.length) {
      onRejectedFiles?.(rejectedFiles)
    }

    if (selectedFiles.length) {
      onFiles?.(selectedFiles)
    }
  }

  return (
    <div
      className={`relative transition ${className} ${
        dragging ? 'ring-2 ring-[var(--shadow-text-primary)] ring-offset-2 ring-offset-[var(--shadow-bg-surface)]' : ''
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}

      {dragging ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-[#111827]/82 px-4 text-center text-[13px] font-extrabold text-white backdrop-blur-sm">
          {displayLabel}
        </div>
      ) : null}
    </div>
  )
}
