import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SuccessModal } from './PublishEpisodePage'
import Cropper from 'react-easy-crop'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link,
  Search,
  WandSparkles,
} from 'lucide-react'
import RichFindReplacePanel from '../../components/Author/RichFindReplacePanel'
import SmartFindReplacePanel from '../../components/Author/SmartFindReplacePanel'
import YouTubeVideoSheet from '../../components/author/YouTubeVideoSheet'
import ImageDropZone from '../../components/common/ImageDropZone'
import ScheduleReleasePicker from '../../components/author/ScheduleReleasePicker'
import MangaUploadProgressModal from '../../components/author/MangaUploadProgressModal'
import {
  deleteEpisodeLocalDraft,
  getEpisodeLocalDraftKey,
  loadEpisodeLocalDraft,
  saveEpisodeLocalDraft,
} from '../../utils/episodeLocalDraft'
import {
  MANGA_MAX_FILES_PER_PICK,
  MANGA_MAX_PAGES,
  MANGA_MIN_PUBLISH_PAGES,
  formatFileSize,
  optimizeMangaImage,
  runWithConcurrency,
  uploadMangaPageFile,
  validateMangaFile,
} from '../../utils/mangaImageUtils'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const MIN_CHARACTERS = 1500
const MAX_CHARACTERS = 30000
const MAX_EDITOR_HISTORY = 100
const EDITOR_HISTORY_GROUP_MS = 1000
const LOCAL_AUTOSAVE_INTERVAL_SECONDS = 10
const SERVER_CHECKPOINT_MINUTES = 10
const STORY_LANGUAGES = ['Khmer', 'English', 'Chinese', 'Japanese', 'Korean']
const FALLBACK_GENRES = ['Romance', 'Fantasy', 'Action', 'Adventure', 'Comedy', 'Drama']
const STORY_TAG_GROUPS = [
  {
    name: 'Characters',
    tags: [
      'CEO',
      'Strong Female Lead',
      'Cold Male Lead',
      'Hidden Identity',
      'Royalty',
      'Villain',
      'Mafia',
      'Vampire',
    ],
  },
  {
    name: 'Relationship',
    tags: [
      'Slow Burn',
      'Enemies to Lovers',
      'Age Gap',
      'Childhood Sweetheart',
      'Second Chance',
      'Contract Marriage',
      'Love After Marriage',
      'Forbidden Love',
    ],
  },
  {
    name: 'Plot',
    tags: [
      'Revenge',
      'Time Travel',
      'Rebirth',
      'Mystery',
      'Adventure',
      'Action',
      'Tragic',
      'Fated',
    ],
  },
  {
    name: 'Setting & World',
    tags: [
      'School Life',
      'Historical',
      'Modern Fantasy',
      'Ancient Romance',
      'Supernatural',
      'Magic',
      'Sci-Fi',
      'Urban Romance',
    ],
  },
  {
    name: 'Mood & Theme',
    tags: [
      'Sweet',
      'Dark Romance',
      'Comedy',
      'Healing',
      'Emotional',
      'Suspense',
      'Family',
      'Friendship',
    ],
  },
  {
    name: 'LGBTQ+',
    tags: [
      'Boys’ Love',
      'Girls’ Love',
      'Omegaverse',
      'LGBTQ+',
    ],
  },
]

const STORY_TAG_OPTIONS = STORY_TAG_GROUPS.flatMap(
  (group) => group.tags
)

const UPDATE_DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    array[index] = binary.charCodeAt(index)
  }

  return new File([array], fileName, { type: mime })
}

async function uploadImageToStorage({ token, imageDataUrl, folder, fileName }) {
  if (!imageDataUrl) return null
  if (String(imageDataUrl).startsWith('http')) return imageDataUrl

  const file = dataUrlToFile(imageDataUrl, fileName)
  const formData = new FormData()

  formData.append('image', file)
  formData.append('folder', folder)

  const response = await fetch(`${API_BASE_URL}/api/story-media/upload-image`, {
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

  return data.image_url || data.imageUrl
}

function escapeEpisodeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function isSafeEpisodeImageUrl(value) {
  const source = String(value || '').trim()
  if (!source) return false

  try {
    const url = new URL(source, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function sanitizeEpisodeHtml(value) {
  const source = String(value || '')
  if (!source.trim()) return ''
  if (typeof DOMParser === 'undefined') return escapeEpisodeHtml(source)

  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  const inputRoot = parsed.body.firstElementChild
  const outputDocument = document.implementation.createHTMLDocument('')
  const outputRoot = outputDocument.createElement('div')

  const appendSafeNode = (inputNode, outputParent) => {
    if (inputNode.nodeType === Node.TEXT_NODE) {
      outputParent.appendChild(outputDocument.createTextNode(inputNode.textContent || ''))
      return
    }

    if (inputNode.nodeType !== Node.ELEMENT_NODE) return

    const tagName = inputNode.tagName.toLowerCase()

    if (tagName === 'br') {
      outputParent.appendChild(outputDocument.createElement('br'))
      return
    }

    if (tagName === 'img') {
      const sourceUrl = inputNode.getAttribute('src')
      if (!isSafeEpisodeImageUrl(sourceUrl)) return
      const image = outputDocument.createElement('img')
      image.setAttribute('src', new URL(sourceUrl, window.location.origin).href)
      image.setAttribute('alt', String(inputNode.getAttribute('alt') || 'Episode image').slice(0, 200))
      outputParent.appendChild(image)
      return
    }

    const safeTag =
      tagName === 'b' || tagName === 'strong'
        ? 'strong'
        : tagName === 'i' || tagName === 'em'
          ? 'em'
          : tagName === 'p' || tagName === 'div'
            ? 'p'
            : null

    if (!safeTag) {
      Array.from(inputNode.childNodes).forEach((child) => appendSafeNode(child, outputParent))
      return
    }

    const outputElement = outputDocument.createElement(safeTag)

    if (safeTag === 'p') {
      const alignment = String(inputNode.style?.textAlign || inputNode.getAttribute('align') || '').toLowerCase()
      if (['left', 'center', 'right'].includes(alignment)) {
        outputElement.style.textAlign = alignment
      }
    }

    Array.from(inputNode.childNodes).forEach((child) => appendSafeNode(child, outputElement))
    outputParent.appendChild(outputElement)
  }

  Array.from(inputRoot?.childNodes || []).forEach((child) => appendSafeNode(child, outputRoot))
  return outputRoot.innerHTML
}

function plainTextToEpisodeHtml(value) {
  const source = String(value || '').replace(/\r\n/g, '\n').trim()
  if (!source) return ''

  return source
    .split(/\n\s*\n+/)
    .map((paragraph) => `<p>${escapeEpisodeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function normalizeEpisodeHtml(value) {
  const source = String(value || '')
  if (!source.trim()) return ''
  return /<(?:p|div|br|strong|b|em|i|img)\b/i.test(source)
    ? sanitizeEpisodeHtml(source)
    : plainTextToEpisodeHtml(source)
}

function episodeHtmlToPlainText(value) {
  const source = String(value || '')
  if (!source.trim()) return ''
  if (typeof DOMParser === 'undefined') return source.replace(/<[^>]+>/g, ' ')

  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  const root = parsed.body.firstElementChild
  if (!root) return ''

  const parts = []
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (text.trim()) parts.push(text)
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE || node.tagName === 'IMG') return
    const text = node.textContent || ''
    if (text.trim()) parts.push(text)
  })

  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim()
}

function hasEpisodeContent(value) {
  const source = String(value || '')
  return Boolean(episodeHtmlToPlainText(source).trim() || /<img\b[^>]*src=/i.test(source))
}

function cleanEpisodeHtmlSpacing(value) {
  const safeHtml = sanitizeEpisodeHtml(value)
  if (!safeHtml) return ''

  const parsed = new DOMParser().parseFromString(`<div>${safeHtml}</div>`, 'text/html')
  const root = parsed.body.firstElementChild
  const blocks = []

  Array.from(root?.childNodes || []).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = String(node.textContent || '').trim()
      if (text) blocks.push({ html: escapeEpisodeHtml(text), text, alignment: 'left' })
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return

    if (node.tagName === 'IMG' || node.querySelector?.('img')) {
      blocks.push({ html: node.outerHTML, text: '', image: true, alignment: 'left' })
      return
    }

    const text = String(node.textContent || '').replace(/\s+/g, ' ').trim()
    const alignment = ['left', 'center', 'right'].includes(String(node.style?.textAlign || '').toLowerCase())
      ? String(node.style.textAlign).toLowerCase()
      : 'left'

    if (!text) {
      blocks.push({ empty: true })
      return
    }

    blocks.push({ html: node.innerHTML.trim(), text, alignment })
  })

  const output = []
  let buffer = null

  const flush = () => {
    if (!buffer) return
    const alignmentStyle = buffer.alignment === 'left' ? '' : ` style="text-align: ${buffer.alignment}"`
    output.push(`<p${alignmentStyle}>${buffer.html}</p>`)
    buffer = null
  }

  blocks.forEach((block) => {
    if (block.empty) {
      flush()
      return
    }

    if (block.image) {
      flush()
      output.push(block.html)
      return
    }

    if (!buffer) {
      buffer = { ...block }
      return
    }

    if (
      block.alignment !== buffer.alignment ||
      isDialogueOrSpecialLine(block.text) ||
      endsWithSentencePunctuation(buffer.text)
    ) {
      flush()
      buffer = { ...block }
      return
    }

    buffer.html = `${buffer.html} ${block.html}`
    buffer.text = `${buffer.text} ${block.text}`
  })

  flush()
  return sanitizeEpisodeHtml(output.join(''))
}

const NOVEL_IMAGE_INPUT_MAX_BYTES = 5 * 1024 * 1024
const NOVEL_IMAGE_TARGET_MAX_BYTES = 300 * 1024
const NOVEL_IMAGE_HARD_MAX_BYTES = 500 * 1024
const NOVEL_IMAGE_MAX_COUNT = 2
const NOVEL_IMAGE_WIDTHS = [1600, 1360, 1120, 960]
const NOVEL_IMAGE_QUALITIES = [0.86, 0.8, 0.74, 0.7]

function countEpisodeImages(value) {
  const source = String(value || '')
  if (!source.trim()) return 0
  if (typeof DOMParser === 'undefined') {
    return (source.match(/<img\b/gi) || []).length
  }

  const parsed = new DOMParser().parseFromString(`<div>${source}</div>`, 'text/html')
  return parsed.body.querySelectorAll('img').length
}

function isNovelImageFile(file) {
  const type = String(file?.type || '').toLowerCase()
  const name = String(file?.name || '').toLowerCase()
  return type.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif|hei[cf])$/i.test(name)
}

function isNovelHeicFile(file) {
  return /image\/hei[cf]/i.test(file?.type || '') || /\.hei[cf]$/i.test(file?.name || '')
}

async function convertNovelHeicForUpload(file) {
  try {
    const { heicTo } = await import('heic-to')
    const blob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.9,
    })

    if (!(blob instanceof Blob) || !blob.size) {
      throw new Error('HEIC conversion returned an empty image.')
    }

    const base = String(file.name || 'episode-image').replace(/\.[^.]+$/, '')
    const jpegFile = new File([blob], `${base}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })

    return await optimizeNovelEpisodeImage(jpegFile)
  } catch {
    throw new Error(
      'This HEIC/HEIF image could not be converted on this device. [convert: HEIC_CONVERSION_FAILED]'
    )
  }
}


function loadNovelImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => resolve({ image, url })
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read this image.'))
    }

    image.src = url
  })
}

function canvasToNovelWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('This browser could not compress the image.'))
          return
        }

        resolve(blob)
      },
      'image/webp',
      quality
    )
  })
}

function novelWebpName(name = 'episode-image') {
  const base = String(name)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'episode-image'}.webp`
}

function chooseBestNovelImage(candidates) {
  return [...candidates].sort(
    (first, second) =>
      second.quality * second.width - first.quality * first.width
  )[0] || null
}

async function optimizeNovelEpisodeImage(file) {
  if (!file) throw new Error('Choose an image first.')
  if (!isNovelImageFile(file)) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > NOVEL_IMAGE_INPUT_MAX_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  const loaded = await loadNovelImage(file)
  const targetCandidates = []
  const fallbackCandidates = []
  const usedWidths = new Set()

  try {
    for (const maxWidth of NOVEL_IMAGE_WIDTHS) {
      const width = Math.min(maxWidth, loaded.image.naturalWidth)
      if (!width || usedWidths.has(width)) continue
      usedWidths.add(width)

      const ratio = width / loaded.image.naturalWidth
      const height = Math.max(1, Math.round(loaded.image.naturalHeight * ratio))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Image processing is unavailable in this browser.')
      }

      canvas.width = width
      canvas.height = height
      context.drawImage(loaded.image, 0, 0, width, height)

      for (const quality of NOVEL_IMAGE_QUALITIES) {
        const blob = await canvasToNovelWebp(canvas, quality)
        const candidate = { blob, width, height, quality }

        if (blob.size <= NOVEL_IMAGE_HARD_MAX_BYTES) {
          fallbackCandidates.push(candidate)
        }
        if (blob.size <= NOVEL_IMAGE_TARGET_MAX_BYTES) {
          targetCandidates.push(candidate)
        }
      }

      canvas.width = 0
      canvas.height = 0
    }

    const selected =
      chooseBestNovelImage(targetCandidates) ||
      chooseBestNovelImage(fallbackCandidates)

    if (!selected) {
      throw new Error('This image could not be compressed below 500 KB.')
    }

    return new File([selected.blob], novelWebpName(file.name), {
      type: 'image/webp',
      lastModified: Date.now(),
    })
  } finally {
    URL.revokeObjectURL(loaded.url)
  }
}

async function uploadEpisodeInlineImage({ token, file }) {
  if (!file) throw new Error('Choose an image first.')
  if (!isNovelImageFile(file)) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > NOVEL_IMAGE_INPUT_MAX_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  let response
let bytes

try {
  bytes = await file.arrayBuffer()
} catch {
  throw new Error('This device could not read the selected image. [read: IMAGE_FILE_READ_FAILED]')
}

if (!bytes.byteLength) {
  throw new Error('The selected image contains 0 bytes. [read: IMAGE_FILE_EMPTY]')
}

try {
  response = await fetch(
      `${API_BASE_URL}/api/story-media/upload-novel-image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: bytes,
      }
    )
  } catch {
    throw new Error(
      'Network error: the image could not reach the server. Check your connection and try again. [network: IMAGE_REQUEST_FAILED]'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    const stage = String(data.stage || 'upload')
    const code = String(data.code || `HTTP_${response.status}`)
    const message = data.message || 'Novel image upload failed.'
    throw new Error(`${message} [${stage}: ${code}]`)
  }

  const imageUrl = data.image_url || data.imageUrl

  if (!imageUrl) {
    throw new Error(
      'The upload finished but the server did not return an image URL. [complete: IMAGE_URL_MISSING]'
    )
  }

  return imageUrl
}



function isDialogueOrSpecialLine(line) {
  const text = String(line || '').trim()
  if (!text) return false
  return /^[“"‘'«—–-]/.test(text) || /^(\d+[\.)]|[•*])\s+/.test(text)
}

function endsWithSentencePunctuation(line) {
  return /[។.!?…]"?$/.test(String(line || '').trim())
}

function cleanBrokenParagraphs(value) {
  const lines = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u00A0/g, ' ')
    .split('\n')

  const output = []
  let buffer = []

  const flushBuffer = () => {
    if (!buffer.length) return
    output.push(buffer.join(' ').replace(/\s+/g, ' ').trim())
    buffer = []
  }

  lines.forEach((line) => {
    const text = line.trim()

    if (!text) {
      flushBuffer()
      if (output[output.length - 1] !== '') output.push('')
      return
    }

    if (isDialogueOrSpecialLine(text)) {
      flushBuffer()
      output.push(text)
      return
    }

    if (buffer.length && endsWithSentencePunctuation(buffer[buffer.length - 1])) {
      flushBuffer()
    }

    buffer.push(text)
  })

  flushBuffer()
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function makeLocalId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function mangaPartsPatch(page) {
  return Object.prototype.hasOwnProperty.call(page || {}, 'parts')
    ? { parts: Array.isArray(page.parts) ? page.parts : [] }
    : {}
}

function getTemporaryMangaPartUrls(pages = []) {
  return [
    ...new Set(
      (Array.isArray(pages) ? pages : [])
        .flatMap((page) =>
          Array.isArray(page?.parts) ? page.parts : []
        )
        .map((part) =>
          String(part?.image_url || part?.imageUrl || '').trim()
        )
        .filter((url) => url && url.includes('/manga-v2/'))
    ),
  ]
}

async function cleanupTemporaryMangaPages(pages = []) {
  const token = getAuthToken()
  const urls = getTemporaryMangaPartUrls(pages)

  if (!token || !urls.length) return

  for (let index = 0; index < urls.length; index += 10) {
    const chunk = urls.slice(index, index + 10)

    try {
      await fetch(
        `${API_BASE_URL}/api/story-media/cleanup-manga-page-v2`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ urls: chunk }),
        }
      )
    } catch {
    }
  }
}

function Step({ number, title, active }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
          active ? 'bg-[#111827] text-white' : 'bg-[#f2f4f7] text-[#667085]'
        }`}
      >
        {number}
      </div>
      <div className={`line-clamp-1 text-[12px] font-extrabold ${active ? 'text-[#111827]' : 'text-[#98a2b3]'}`}>
        {title}
      </div>
    </div>
  )
}

function ToolButton({ Icon, label, onClick, active = false, disabled = false }) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className="flex h-10 w-10 shrink-0 items-center justify-center active:scale-95 disabled:opacity-40"
      aria-label={label}
      title={label}
    >
      <Icon
        size={19}
        strokeWidth={1.7}
        className={active ? 'text-[#FE526E]' : 'text-[#111827]'}
      />
    </button>
  )
}

function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/10 px-6"
    >
      <div className="max-w-[360px] rounded-[18px] bg-white px-5 py-4 text-center text-[14px] font-bold leading-6 text-[#111827] shadow-2xl">
        {message}
      </div>
    </button>
  )
}

function UnsavedChangesModal({ open, onKeepEditing, onDiscard, onSaveDraft }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-5 text-center shadow-2xl">
        <h2 className="text-[18px] font-bold text-[#111827]">
  Unsaved Changes
</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#555b66]">
          This episode has unsaved edits. Save your draft or discard your changes.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onKeepEditing}
            className="rounded-full border border-[#e4e7ec] bg-white px-3 py-2.5 text-[12px] font-normal text-[#111827] active:scale-95"
          >
            Keep Editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-full border border-[#f0b8b8] bg-white px-3 py-2.5 text-[12px] font-normal text-[#c04444] active:scale-95"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="rounded-full bg-[#111827] px-3 py-2.5 text-[12px] font-normal text-white active:scale-95"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  )
}

function LocalDraftRecoveryModal({
  open,
  busy,
  onDiscard,
  onRestore,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
          <i className="fa-solid fa-clock-rotate-left text-[21px]" />
        </div>

        <h2 className="mt-4 text-[18px] font-bold text-[#111827]">
          Local Draft Found
        </h2>

        <p className="mt-3 text-[13px] leading-6 text-[#555b66]">
          This device has newer unsaved work for this episode. Restore it before continuing or discard the local copy.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onDiscard}
            disabled={busy}
            className="h-11 rounded-full border border-[#e4e7ec] bg-white px-3 text-[12px] font-normal text-[#555b66] active:scale-95 disabled:opacity-50"
          >
            Discard Local
          </button>

          <button
            type="button"
            onClick={onRestore}
            disabled={busy}
            className="h-11 rounded-full bg-[#111827] px-3 text-[12px] font-bold text-white active:scale-95 disabled:opacity-50"
          >
            {busy ? 'Please wait...' : 'Restore Draft'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CleanParagraphsModal({ open, onCancel, onClean }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[155] flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]">
          <i className="fa-solid fa-wand-magic-sparkles text-[22px]" />
        </div>
        <h2 className="mt-4 text-[18px] font-extrabold text-[#111827]">Clean paragraph spacing?</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#555b66]">
          This will fix broken pasted lines while keeping dialogue, special lines, and paragraph breaks.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClean}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
          >
            Clean
          </button>
        </div>
      </div>
    </div>
  )
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedImage(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return imageSrc

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return canvas.toDataURL('image/jpeg', 0.9)
}

function CropCoverModal({
  open,
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onClose,
  onSave,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center overflow-hidden bg-black/50 px-4">
      <div className="w-full max-w-[560px] rounded-[26px] bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#111827]">Crop Episode Cover</h2>
            <p className="mt-1 text-[11px] leading-4 text-[#8d94a1]">
              Drag the image inside the frame. Pinch or use zoom to adjust.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827]"
            aria-label="Close crop editor"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="relative h-[240px] touch-none overflow-hidden rounded-[20px] bg-[#111827] sm:h-[310px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
            restrictPosition={false}
            objectFit="horizontal-cover"
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-[#555b66]">
            <span>Zoom</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-full accent-[#111827]"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[#e4e7ec] bg-white text-[13px] font-extrabold text-[#111827] active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-12 rounded-full bg-[#111827] text-[13px] font-extrabold text-white active:scale-95"
          >
            Save Crop
          </button>
        </div>
      </div>
    </div>
  )
}


function EpisodeDetailsSheet({
  open,
  title,
  cover,
  onTitleChange,
  onCoverChange,
  onRemoveCover,
  onClose,
  onSave,
}) {
  useEffect(() => {
    if (!open) return undefined

    const scrollY = window.scrollY
    const body = document.body
    const html = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousBodyPosition = body.style.position
    const previousBodyTop = body.style.top
    const previousBodyWidth = body.style.width
    const previousHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    html.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previousBodyOverflow
      body.style.position = previousBodyPosition
      body.style.top = previousBodyTop
      body.style.width = previousBodyWidth
      html.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open) return null

  const canSave = Boolean(title.trim())


  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-black/35 sm:px-4"
      onClick={onClose}
    >
      <div className="w-full sm:max-w-5xl">
        <div
          className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] bg-white px-4 pb-[max(24px,env(safe-area-inset-bottom))] pt-4 shadow-2xl sm:max-h-[82dvh] sm:rounded-[12px] sm:px-5 sm:pb-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="w-full">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
                aria-label="Close episode details"
              >
                <i className="fa-solid fa-xmark text-[14px]" />
              </button>

              <h2 className="min-w-0 flex-1 truncate text-center text-[14px] font-bold text-[#111827]">
                Episode Details
              </h2>

              <button
                type="button"
                onClick={onSave}
                disabled={!canSave}
                className="h-8 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:bg-[#d0d5dd]"
              >
                Save
              </button>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[13px] font-semibold text-[#111827]">
                Episode Title <span className="text-[#e5484d]">*</span>
              </label>

              <input
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                maxLength={200}
                autoFocus
                placeholder="Enter episode title"
                className="h-12 w-full rounded-[10px] bg-[#f7f7fa] px-3 text-[14px] font-semibold text-[#111827] outline-none placeholder:font-semibold placeholder:text-[#a5aab4]"
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[13px] font-bold text-[#111827]">
                  Episode Cover
                </div>

                <div className="text-[11px] text-[#8d94a1]">
                  Optional
                </div>
              </div>

              <p className="mt-1 text-[11px] leading-5 text-[#8d94a1]">
                If empty, the story cover will be used. Recommended 16:9.
              </p>

              {cover ? (
                <div className="mt-3 overflow-hidden rounded-[12px] bg-[#f7f7fa]">
                  <div className="aspect-video w-full overflow-hidden sm:h-[340px] sm:aspect-auto">
                    <img
                      src={cover}
                      alt="Episode Cover"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3">
                    <label className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#111827] text-[12px] font-bold text-white active:scale-95">
                      Replace

                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        className="hidden"
                        onChange={(event) => {
                          onCoverChange(event.target.files?.[0] || null)
                          event.target.value = ''
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={onRemoveCover}
                      className="flex h-10 flex-1 items-center justify-center rounded-full bg-[#f2f4f7] text-[12px] font-bold text-[#555b66] active:scale-95"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="mt-3 flex aspect-video cursor-pointer flex-col items-center justify-center rounded-[12px] bg-[#f7f7fa] text-center active:scale-[0.99] sm:h-[340px] sm:aspect-auto">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm">
                    <i className="fa-regular fa-image text-[14px]" />
                  </div>

                  <div className="mt-3 text-[13px] font-bold text-[#111827]">
                    Add Episode Cover
                  </div>

                  <div className="mt-1 text-[11px] text-[#8d94a1]">
                    16:9 crop
                  </div>

                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="hidden"
                    onChange={(event) => {
                      onCoverChange(event.target.files?.[0] || null)
                      event.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SettingsToggle({
  checked,
  onClick,
  label,
  activeColor = '#FE526E',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        backgroundColor: checked
          ? activeColor
          : '#d0d5dd',
      }}
      className="relative h-7 w-12 shrink-0 rounded-full transition-all duration-200 active:scale-95"
      aria-label={label}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}


export function GenreSheet({
  open,
  value,
  options = FALLBACK_GENRES,
  loading = false,
  onClose,
  onSave,
}) {
  const [selected, setSelected] = useState(value || 'Romance')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!open) return
    setSelected(value || 'Romance')
    setSearch('')
  }, [open, value])

  if (!open) return null

  const visibleGenres = options.filter((genre) =>
    genre.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-[190] overflow-y-auto bg-[#f7f7f7]">
      <header className="sticky top-0 z-10 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Back to publish"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="text-[17px] font-bold text-[#111827]">
            Add Genre
          </h2>

          <button
            type="button"
            onClick={() => onSave(selected)}
            className="text-[14px] font-bold text-[#0b5cff]"
          >
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="mb-5 flex h-12 items-center rounded-full bg-white px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#98a2b3]" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Genre"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
          />
        </div>

        <div className="mb-5">
          <div className="text-[14px] font-bold text-[#111827]">
            Please select the genre that best represents your story.
          </div>

          <div className="mt-2 text-[12px] text-[#667085]">
            Only one genre can be selected.
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[13px] text-[#8d94a1]">
            Loading genres...
          </div>
        ) : null}

        {!loading && visibleGenres.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[#8d94a1]">
            No genres found.
          </div>
        ) : null}

        {!loading ? (
          <div className="grid grid-cols-2 gap-3">
            {visibleGenres.map((genre) => {
              const active = selected === genre

              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelected(genre)}
                  className={`flex h-[76px] items-center justify-center rounded-[12px] px-3 text-center text-[14px] font-bold transition active:scale-[0.98] ${
                    active
                      ? 'border-2 border-[#FE526E] bg-white text-[#FE526E]'
                      : 'border border-transparent bg-white text-[#111827]'
                  }`}
                >
                  {genre}
                </button>
              )
            })}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export function TagSheet({ open, value, onClose, onSave }) {
  const [selected, setSelected] = useState(value || [])
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState('All')
  const [customOpen, setCustomOpen] = useState(false)
  const [customTag, setCustomTag] = useState('')

  useEffect(() => {
    if (!open) return

    setSelected(value || [])
    setSearch('')
    setActiveGroup('All')
    setCustomOpen(false)
    setCustomTag('')
  }, [open, value])

  if (!open) return null

  const toggleTag = (tag) => {
    setSelected((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag)
      }

      if (current.length >= 6) return current

      return [...current, tag]
    })
  }

  const addCustom = () => {
    const tag = customTag.trim()
    const exists = selected.some(
      (item) => item.toLowerCase() === tag.toLowerCase()
    )

    if (!tag || exists || selected.length >= 6) return

    setSelected((current) => [...current, tag])
    setCustomTag('')
    setCustomOpen(false)
  }

  const query = search.trim().toLowerCase()

  const visibleGroups = STORY_TAG_GROUPS
    .filter(
      (group) =>
        activeGroup === 'All' || group.name === activeGroup
    )
    .map((group) => ({
      ...group,
      tags: group.tags.filter((tag) =>
        tag.toLowerCase().includes(query)
      ),
    }))
    .filter((group) => group.tags.length > 0)

  return (
    <div className="fixed inset-0 z-[190] overflow-y-auto bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Back to publish"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="text-[17px] font-bold text-[#111827]">
            Add Tags
          </h2>

          <button
            type="button"
            onClick={() => onSave(selected)}
            className="text-[14px] font-normal text-[#0b5cff]"
          >
            Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="flex h-12 items-center rounded-full bg-[#f5f5f7] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[#a5aab4]" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search & Custom Tags"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[#111827] outline-none placeholder:font-normal placeholder:text-[#a5aab4]"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['All', ...STORY_TAG_GROUPS.map((group) => group.name)].map(
            (group) => (
              <button
                key={group}
                type="button"
                onClick={() => setActiveGroup(group)}
                className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-normal ${
                  activeGroup === group
                    ? 'bg-[#e9ecef] text-[#111827]'
                    : 'bg-[#f7f7f7] text-[#98a2b3]'
                }`}
              >
                {group}
              </button>
            )
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[14px] font-normal text-[#111827]">
              Selected ({selected.length}/6)
            </div>

            <button
              type="button"
              onClick={() => setCustomOpen((current) => !current)}
              disabled={selected.length >= 6}
              className="rounded-full bg-[#111827] px-4 py-2 text-[12px] font-normal text-white disabled:bg-[#d0d5dd]"
            >
              + Custom
            </button>
          </div>

          {customOpen ? (
            <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-[#f5f5f7] p-2">
              <input
                value={customTag}
                onChange={(event) =>
                  setCustomTag(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addCustom()
                  }
                }}
                placeholder="Write your custom tag"
                autoFocus
                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-[13px] font-normal text-[#111827] outline-none"
              />

              <button
                type="button"
                onClick={addCustom}
                disabled={
                  !customTag.trim() || selected.length >= 6
                }
                className="h-10 rounded-full bg-[#111827] px-4 text-[12px] font-normal text-white disabled:bg-[#d0d5dd]"
              >
                Add
              </button>
            </div>
          ) : null}

          {selected.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="rounded-full bg-[#FFF1F3] px-4 py-2 text-[12px] font-normal text-[#FE526E]"
                >
                  {tag}
                  <span className="ml-2 text-[#FE526E]">×</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-7 space-y-7">
          {visibleGroups.map((group) => (
            <section key={group.name}>
              <h3 className="text-[15px] font-bold text-[#111827]">
                {group.name}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {group.tags.map((tag) => {
                  const active = selected.includes(tag)

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={!active && selected.length >= 6}
                      className={`rounded-full px-4 py-2 text-[12px] font-normal ${
                        active
  ? 'bg-[#FFF1F3] text-[#FE526E]'
  : 'bg-[#f7f7f7] text-[#98a2b3]'
                      } disabled:opacity-40`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}

          {!visibleGroups.length ? (
            <div className="py-10 text-center text-[13px] font-normal text-[#98a2b3]">
              No tags found.
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export function LanguageWheelPicker({
  open,
  value,
  title = 'Story Language',
  onClose,
  onSave,
}) {
  const listRef = useRef(null)
  const itemHeight = 48
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!open) return undefined

    const index = Math.max(
      0,
      STORY_LANGUAGES.indexOf(value)
    )

    setSelectedIndex(index)

    const frame = window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: 'auto',
      })
    })

    return () =>
      window.cancelAnimationFrame(frame)
  }, [open, value])

  if (!open) return null

  const selectedLanguage =
    STORY_LANGUAGES[selectedIndex] ||
    STORY_LANGUAGES[0]

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/35 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[320px] rounded-[18px] bg-white p-4 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-2 text-[13px] text-[#667085]"
          >
            Cancel
          </button>

<h3 className="text-[12px] font-semibold text-[#111827]">
  {title}
</h3>
          <button
            type="button"
            onClick={() =>
              onSave(selectedLanguage)
            }
            className="h-9 px-2 text-[13px] font-semibold text-[#111827]"
          >
            Done
          </button>
        </div>

        <div className="relative mt-3 h-[192px] overflow-hidden">
          <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 h-12 -translate-y-1/2 rounded-[10px] bg-[#f2f4f7]" />

          <div
            ref={listRef}
            onScroll={(event) => {
              const index = Math.round(
                event.currentTarget.scrollTop /
                  itemHeight
              )

              setSelectedIndex(
                Math.max(
                  0,
                  Math.min(
                    STORY_LANGUAGES.length - 1,
                    index
                  )
                )
              )
            }}
            className="relative z-20 h-full snap-y snap-mandatory overflow-y-auto py-[72px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {STORY_LANGUAGES.map(
              (language, index) => {
                const active =
                  selectedIndex === index

                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(index)
                      listRef.current?.scrollTo({
                        top:
                          index * itemHeight,
                        behavior: 'smooth',
                      })
                    }}
                    className={`flex h-12 w-full snap-center items-center justify-center text-[15px] transition ${
                      active
                        ? 'font-semibold text-[#111827]'
                        : 'font-normal text-[#98a2b3] opacity-40'
                    }`}
                  >
                    {language}
                  </button>
                )
              }
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(to_bottom,#ffffff_0%,rgba(255,255,255,0.82)_20%,transparent_42%,transparent_58%,rgba(255,255,255,0.82)_80%,#ffffff_100%)]" />
        </div>
      </div>
    </div>
  )
}

export function AdultHintPopup({
  open,
  title,
  description,
  onClose,
}) {
  if (!open) return null

  return (
    <button
      type="button"
      onClick={onClose}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/35 px-6"
      aria-label="Close information"
    >
      <div className="pointer-events-none w-full max-w-[320px] rounded-[16px] bg-white px-5 py-5 text-center shadow-2xl">
        <div className="text-[15px] font-bold text-[#111827]">
          {title}
        </div>

        <div className="mt-3 text-[12px] font-normal leading-6 text-[#667085]">
          {description}
        </div>
      </div>
    </button>
  )
}

const RELEASE_OPTION_ITEMS = [
  {
    value: 'publish',
    title: 'Publish Now',
    subtitle: 'Make this episode public immediately.',
  },
  {
    value: 'schedule',
    title: 'Schedule',
    subtitle: 'Choose a future date and time.',
  },
  {
    value: 'draft',
    title: 'Save as Draft',
    subtitle: 'Keep this episode private and finish it later.',
  },
]

const RELEASE_OPTION_LABELS = {
  publish: 'Publish Now',
  schedule: 'Schedule',
  draft: 'Save as Draft',
}

function padScheduleNumber(value) {
  return String(value).padStart(2, '0')
}

function getScheduleDays(year, month) {
  return new Date(year, month, 0).getDate()
}

function formatScheduleLabel(date, time) {
  if (!date || !time) return 'Choose date & time'

  const value = new Date(`${date}T${time}:00`)

  if (Number.isNaN(value.getTime())) {
    return 'Choose date & time'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function ReleaseOptionSheet({
  open,
  value,
  onClose,
  onSelect,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[230] flex items-end bg-black/35 sm:items-center sm:justify-center sm:px-4"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[18px] bg-white px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-4 sm:max-w-[420px] sm:rounded-[18px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-[#111827]">
            Release Option
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-[#111827]"
            aria-label="Close release options"
          >
            <i className="fa-solid fa-xmark text-[14px]" />
          </button>
        </div>

        <div className="mt-3 space-y-1">
          {RELEASE_OPTION_ITEMS.map((option) => {
            const active = value === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className="flex w-full items-center gap-3 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[13px] ${
                      active
                        ? 'font-semibold text-[#111827]'
                        : 'font-normal text-[#344054]'
                    }`}
                  >
                    {option.title}
                  </div>

                  <div className="mt-1 text-[11px] font-normal text-[#98a2b3]">
                    {option.subtitle}
                  </div>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    active
                      ? 'border-[#FE526E] bg-[#FE526E] text-white'
                      : 'border-[#d0d5dd] bg-white'
                  }`}
                >
                  {active ? (
                    <i className="fa-solid fa-check text-[9px]" />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ScheduleWheelColumn({
  items,
  value,
  onChange,
  className = 'w-[52px]',
}) {
  const listRef = useRef(null)
  const itemHeight = 44

  useEffect(() => {
    const index = Math.max(
      0,
      items.findIndex(
        (item) => String(item.value) === String(value)
      )
    )

    const frame = window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: 'auto',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [items.length, value])

  return (
    <div className={`relative h-[132px] overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-11 -translate-y-1/2 rounded-[8px] bg-[#f2f4f7]" />

      <div
        ref={listRef}
        onScroll={(event) => {
          const index = Math.round(
            event.currentTarget.scrollTop / itemHeight
          )

          const safeIndex = Math.max(
            0,
            Math.min(items.length - 1, index)
          )

          onChange(items[safeIndex].value)
        }}
        className="relative z-20 h-full snap-y snap-mandatory overflow-y-auto py-11 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = String(item.value) === String(value)

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                onChange(item.value)

                const index = items.findIndex(
                  (entry) =>
                    String(entry.value) === String(item.value)
                )

                listRef.current?.scrollTo({
                  top: index * itemHeight,
                  behavior: 'smooth',
                })
              }}
              className={`flex h-11 w-full snap-center items-center justify-center text-[14px] transition ${
                active
                  ? 'font-semibold text-[#111827]'
                  : 'font-normal text-[#98a2b3] opacity-40'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(to_bottom,#ffffff_0%,rgba(255,255,255,0.88)_18%,transparent_40%,transparent_60%,rgba(255,255,255,0.88)_82%,#ffffff_100%)]" />
    </div>
  )
}

function ScheduleWheelPicker({
  open,
  date,
  time,
  onClose,
  onSave,
}) {
  const now = new Date()
  const defaultTime = new Date(Date.now() + 60 * 60 * 1000)

  const [year, setYear] = useState(defaultTime.getFullYear())
  const [month, setMonth] = useState(defaultTime.getMonth() + 1)
  const [day, setDay] = useState(defaultTime.getDate())
  const [hour, setHour] = useState(defaultTime.getHours())
  const [minute, setMinute] = useState(defaultTime.getMinutes())

  useEffect(() => {
    if (!open) return

    let initial =
      date && time
        ? new Date(`${date}T${time}:00`)
        : new Date(Date.now() + 60 * 60 * 1000)

    if (
      Number.isNaN(initial.getTime()) ||
      initial.getTime() <= Date.now()
    ) {
      initial = new Date(Date.now() + 60 * 60 * 1000)
    }

    initial.setSeconds(0, 0)

    setYear(initial.getFullYear())
    setMonth(initial.getMonth() + 1)
    setDay(initial.getDate())
    setHour(initial.getHours())
    setMinute(initial.getMinutes())
  }, [open, date, time])

  useEffect(() => {
    const maximumDay = getScheduleDays(year, month)

    if (day > maximumDay) {
      setDay(maximumDay)
    }
  }, [year, month, day])

  const years = useMemo(() => {
    const firstYear = now.getFullYear()
    const lastYear = Math.max(firstYear + 5, year)

    return Array.from(
      { length: lastYear - firstYear + 1 },
      (_, index) => {
        const value = firstYear + index
        return { value, label: String(value) }
      }
    )
  }, [year])

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index + 1,
        label: padScheduleNumber(index + 1),
      })),
    []
  )

  const days = useMemo(
    () =>
      Array.from(
        { length: getScheduleDays(year, month) },
        (_, index) => ({
          value: index + 1,
          label: padScheduleNumber(index + 1),
        })
      ),
    [year, month]
  )

  const hours = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        value: index,
        label: padScheduleNumber(index),
      })),
    []
  )

  const minutes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        value: index,
        label: padScheduleNumber(index),
      })),
    []
  )

  if (!open) return null

  const selectedDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0
  )

  const isPast = selectedDate.getTime() <= Date.now()

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-[18px] bg-white px-4 pb-4 pt-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-2 text-[13px] font-normal text-[#667085]"
          >
            Cancel
          </button>

          <h3 className="text-[14px] font-bold text-[#111827]">
            Schedule Release
          </h3>

          <button
            type="button"
            disabled={isPast}
            onClick={() =>
              onSave(
                `${year}-${padScheduleNumber(month)}-${padScheduleNumber(day)}`,
                `${padScheduleNumber(hour)}:${padScheduleNumber(minute)}`
              )
            }
            className="h-9 px-2 text-[13px] font-semibold text-[#FE526E] disabled:text-[#d0d5dd]"
          >
            OK
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <ScheduleWheelColumn
            items={years}
            value={year}
            onChange={setYear}
            className="w-[68px]"
          />

          <ScheduleWheelColumn
            items={months}
            value={month}
            onChange={setMonth}
          />

          <ScheduleWheelColumn
            items={days}
            value={day}
            onChange={setDay}
          />

          <ScheduleWheelColumn
            items={hours}
            value={hour}
            onChange={setHour}
          />

          <span className="text-[16px] font-semibold text-[#111827]">
            :
          </span>

          <ScheduleWheelColumn
            items={minutes}
            value={minute}
            onChange={setMinute}
          />
        </div>

        <div className="mt-2 grid grid-cols-5 text-center text-[10px] font-normal text-[#98a2b3]">
          <span>Year</span>
          <span>Month</span>
          <span>Day</span>
          <span>Hour</span>
          <span>Minute</span>
        </div>

        {isPast ? (
          <div className="mt-3 text-center text-[11px] font-normal text-[#D92D20]">
            Please choose a future date and time.
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function PublishSettingsSheet({
  open,
  episodeTitle,
  showStorySettings,
  genreOptions,
  genresLoading = false,
  storyLanguage,
  onStoryLanguageChange,
  mainGenre,
  onMainGenreChange,
  storyTags,
  onStoryTagsChange,
  updateDays,
  onToggleUpdateDay,
  storyStatus,
  onStoryStatusChange,
  storyAdult,
  onStoryAdultChange,
  episodeAdult,
  onEpisodeAdultChange,
  episodeFree,
  onEpisodeFreeChange,
  releaseOption,
  onReleaseOptionChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
  saving,
  onClose,
  onSave,
  isChatStory = false,

}) {
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [genreOpen, setGenreOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const dragStartY = useRef(0)
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false)
  const [activeHint, setActiveHint] = useState('')
  const [releasePickerOpen, setReleasePickerOpen] = useState(false)
  const [schedulePickerOpen, setSchedulePickerOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [open])

  useEffect(() => {
    if (open) return
    setDragY(0)
    setDragging(false)
    setGenreOpen(false)
    setTagOpen(false)
    setLanguagePickerOpen(false)
    setActiveHint('')
    setReleasePickerOpen(false)
    setSchedulePickerOpen(false)
  }, [open])

  const handleDragStart = (event) => {
    dragStartY.current = event.touches[0].clientY
    setDragging(true)
  }

  const handleDragMove = (event) => {
    const distance = event.touches[0].clientY - dragStartY.current
    setDragY(Math.max(0, distance))
  }

  const handleDragEnd = () => {
    if (dragY >= 90) {
      onClose()
    }

    setDragY(0)
    setDragging(false)
  }

  if (!open) return null

  if (genreOpen) {
    return (
      <GenreSheet
        open
        value={mainGenre}
        options={genreOptions}
        loading={genresLoading}
        onClose={() => setGenreOpen(false)}
        onSave={(genre) => {
          onMainGenreChange(genre)
          setGenreOpen(false)
        }}
      />
    )
  }

  if (tagOpen) {
    return (
      <TagSheet
        open
        value={storyTags}
        onClose={() => setTagOpen(false)}
        onSave={(tags) => {
          onStoryTagsChange(tags)
          setTagOpen(false)
        }}
      />
    )
  }

  const storyDetailsValid =
  !showStorySettings ||
  Boolean(
    storyLanguage?.trim() &&
    mainGenre?.trim() &&
    Array.isArray(storyTags) &&
    storyTags.length > 0
  )

const releaseOptionValid =
  releaseOption !== 'schedule' ||
  Boolean(scheduleDate && scheduleTime)

const canSave =
  storyDetailsValid &&
  releaseOptionValid &&
  !saving

  const tagSummary = storyTags.length
    ? storyTags.join(', ')
    : 'Choose up to 6 tags'

  return (
    <>
      <AdultHintPopup
  open={activeHint === 'story-adult'}
  title="18+ Story"
  description="Turn this on when the whole story contains mature or adult content. Readers will see a warning before opening the story."
  onClose={() => setActiveHint('')}
/>

<AdultHintPopup
  open={activeHint === 'episode-adult'}
  title="18+ Episode"
  description="Turn this on when this episode contains mature or adult content. Readers will see a warning before opening the episode."
  onClose={() => setActiveHint('')}
/>

      <AdultHintPopup
  open={activeHint === 'episode-free'}
  title="Free Episode"
  description="Turn this on to make this episode completely free for readers. Readers will not need to use Coins, Diamonds, Vouchers, or any other unlock method for this episode."
  onClose={() => setActiveHint('')}
/>

      <ReleaseOptionSheet
  open={releasePickerOpen}
  value={releaseOption}
  onClose={() => setReleasePickerOpen(false)}
  onSelect={(option) => {
    setReleasePickerOpen(false)

    if (option === 'schedule') {
      setSchedulePickerOpen(true)
      return
    }

    onReleaseOptionChange(option)
  }}
/>

<ScheduleReleasePicker
  open={schedulePickerOpen}
  hideTrigger
  date={scheduleDate}
  time={scheduleTime}
  onDateChange={onScheduleDateChange}
  onTimeChange={onScheduleTimeChange}
  onClose={() => setSchedulePickerOpen(false)}
  onSave={(nextDate, nextTime) => {
    onScheduleDateChange(nextDate)
    onScheduleTimeChange(nextTime)
    onReleaseOptionChange('schedule')
    setSchedulePickerOpen(false)
  }}
/>

      
      <LanguageWheelPicker
        open={languagePickerOpen}
        value={storyLanguage}
        onClose={() => setLanguagePickerOpen(false)}
        onSave={(language) => {
          onStoryLanguageChange(language)
          setLanguagePickerOpen(false)
        }}
      />

      <div
        className="fixed inset-0 z-[175] flex items-end bg-black/35 sm:items-center sm:justify-center sm:px-4"
        onClick={onClose}
      >
        <div
          className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[18px] bg-white sm:max-w-[680px] sm:rounded-[18px] ${
            dragging ? '' : 'transition-transform duration-200'
          }`}
          style={{
            transform: `translateY(${dragY}px)`,
            willChange: 'transform',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div
  className="flex touch-none items-center justify-center bg-white px-4 py-3"
  onTouchStart={handleDragStart}
  onTouchMove={handleDragMove}
  onTouchEnd={handleDragEnd}
  onTouchCancel={handleDragEnd}
>
  <h2 className="text-center text-[15px] font-bold text-[#111827]">
    Publish
  </h2>
</div>

          <div className="flex-1 overflow-y-auto bg-white px-4 py-4">
  <div
    className="mb-4 w-full min-w-0 truncate text-[14px] font-semibold text-[#111827]"
    title={episodeTitle || ''}
  >
    {episodeTitle?.trim() || 'Untitled Episode'}
  </div>

  {showStorySettings ? (
    <section>
      <div>
                  <span className="mb-2 block text-[12px] font-semibold text-[#111827]">
                    <span className="mr-1 text-[#e5484d]">*</span>Story Language
                  </span>
                  <button
                    type="button"
                    onClick={() => setLanguagePickerOpen(true)}
                    className="flex h-11 w-full items-center rounded-[10px] bg-[#f7f7fa] pl-3 pr-2 text-left active:bg-[#f2f4f7]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[#111827]">
                      {storyLanguage || 'Choose language'}
                    </span>
                    <i className="fa-solid fa-chevron-right mr-1 shrink-0 text-[10px] text-[#98a2b3]" />
                  </button>
                </div>

                <div className="mt-4">
                  <span className="mb-2 block text-[12px] font-semibold text-[#111827]">
                    <span className="mr-1 text-[#e5484d]">*</span>Main Genre
                  </span>
                  <button
                    type="button"
                    onClick={() => setGenreOpen(true)}
                    className="flex h-11 w-full items-center rounded-[10px] bg-[#f7f7fa] px-3 text-left active:bg-[#f2f4f7]"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-[#111827]">
                      {mainGenre || 'Choose a genre'}
                    </span>
                    <i className="fa-solid fa-chevron-right mr-1 shrink-0 text-[10px] text-[#98a2b3]" />
                  </button>
                </div>

                <div className="mt-4">
                  <span className="mb-2 block text-[12px] font-semibold text-[#111827]">
                    <span className="mr-1 text-[#e5484d]">*</span>Tags
                  </span>
                  <button
                    type="button"
                    onClick={() => setTagOpen(true)}
                    className="flex min-h-11 w-full items-center rounded-[10px] bg-[#f7f7fa] px-3 py-2.5 text-left active:bg-[#f2f4f7]"
                  >
                    <span
                      className={`min-w-0 flex-1 truncate text-[12px] ${
                        storyTags.length ? 'text-[#111827]' : 'text-[#8d94a1]'
                      }`}
                    >
                      {tagSummary}
                    </span>
                    <span className="ml-3 shrink-0 text-[10.5px] text-[#8d94a1]">
                      {storyTags.length}/6
                    </span>
                    <i className="fa-solid fa-chevron-right ml-2 mr-1 shrink-0 text-[10px] text-[#98a2b3]" />
                  </button>
                </div>

                <div className="hidden mt-5">
  <div className="text-[12px] font-semibold text-[#111827]">
    Update Days
  </div>
                  <div className="mt-3 grid grid-cols-7 gap-1.5">
                    {UPDATE_DAY_OPTIONS.map((day) => {
                      const active = updateDays.includes(day)

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => onToggleUpdateDay(day)}
                          className={`h-9 rounded-[9px] text-[10.5px] ${
                            active
                              ? 'bg-[#111827] text-white'
                              : 'bg-[#f2f4f7] text-[#555b66]'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="hidden mt-5">
  <div className="text-[12px] font-semibold text-[#111827]">
    Story Status
  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-[12px] font-normal text-[#111827]">
                      Completed
                    </span>

                    <SettingsToggle
                      checked={storyStatus === 'Completed'}
                      onClick={() =>
                        onStoryStatusChange(
                          storyStatus === 'Completed' ? 'Ongoing' : 'Completed'
                        )
                      }
                      label="Toggle completed story"
                    />
                  </div>
                </div>

                <div className="hidden mt-5 items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-normal text-[#111827]">
                      18+ Story
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveHint('story-adult')}
                      className="flex h-5 w-5 items-center justify-center text-[#98a2b3]"
                      aria-label="About 18+ story"
                    >
                      <i className="fa-regular fa-circle-question text-[13px]" />
                    </button>
                  </div>

                  <SettingsToggle
                    checked={storyAdult}
                    onClick={() => onStoryAdultChange(!storyAdult)}
                    label="Toggle 18+ story"
                  />
                </div>
              </section>
            ) : null}

            <section className={showStorySettings ? 'mt-7' : ''}>
             <h3 className="text-[12px] font-semibold text-[#111827]">
  Episode Settings
</h3>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-normal text-[#111827]">
                    18+ Episode
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveHint('episode-adult')}
                    className="flex h-5 w-5 items-center justify-center text-[#98a2b3]"
                    aria-label="About 18+ episode"
                  >
                    <i className="fa-regular fa-circle-question text-[13px]" />
                  </button>
                </div>

                <SettingsToggle
                  checked={episodeAdult}
                  onClick={() => onEpisodeAdultChange(!episodeAdult)}
                  label="Toggle 18+ episode"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
  <div className="flex items-center gap-2">
    <span className="text-[12px] font-normal text-[#111827]">
      Free Episode
    </span>

    <button
      type="button"
      onClick={() => setActiveHint('episode-free')}
      className="flex h-5 w-5 items-center justify-center text-[#98a2b3]"
      aria-label="About free episode"
    >
      <i className="fa-regular fa-circle-question text-[13px]" />
    </button>
  </div>

  <SettingsToggle
    checked={episodeFree}
    onClick={() => onEpisodeFreeChange(!episodeFree)}
    label="Toggle free episode"
  />
</div>

              <div className="mt-5 space-y-1">
  <button
    type="button"
    onClick={() => setReleasePickerOpen(true)}
    className="flex w-full items-center justify-between gap-4 py-3 text-left"
  >
    <span className="text-[12px] font-normal text-[#111827]">
      Release Option
    </span>

    <span className="flex min-w-0 items-center gap-3">
      <span className="truncate text-[12px] font-normal text-[#555b66]">
        {RELEASE_OPTION_LABELS[releaseOption] || 'Publish Now'}
      </span>

      <i className="fa-solid fa-chevron-right text-[10px] text-[#98a2b3]" />
    </span>
  </button>

  {releaseOption === 'schedule' ? (
    <button
      type="button"
      onClick={() => setSchedulePickerOpen(true)}
      className="flex w-full items-center justify-between gap-4 py-3 text-left"
    >
      <span className="text-[12px] font-normal text-[#111827]">
        Release Time
      </span>

      <span className="flex min-w-0 items-center gap-3">
        <span className="truncate text-[12px] font-normal text-[#555b66]">
          {formatScheduleLabel(scheduleDate, scheduleTime)}
        </span>

        <i className="fa-solid fa-chevron-right text-[10px] text-[#98a2b3]" />
      </span>
    </button>
  ) : null}
</div>
            </section>
          </div>

          <div className="shrink-0 bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={onSave}
              disabled={!canSave}
              className={`h-12 w-full rounded-full text-[13px] font-semibold text-white active:scale-[0.99] disabled:bg-none disabled:bg-[#9ca3af] ${
  isChatStory ? 'bg-gradient-to-r from-[#9362ef] to-[#6d42db]' : 'bg-[#111827]'
}`}
            >
              {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function MangaPageCard({ page, index, total, onMove, onDelete, onReplace, onRetry, disabled }) {
  const busy = ['queued', 'processing', 'uploading'].includes(page.status)
  const statusLabel =
    page.status === 'processing'
  ? page.serverProcessing
    ? 'Processing'
    : 'Compressing'
      : page.status === 'uploading'
        ? 'Uploading'
        : page.status === 'error'
          ? 'Upload failed'
          : 'Ready'

  return (
    <ImageDropZone
      onFiles={(files) => onReplace(page.id, files[0] || null)}
      disabled={busy || disabled}
      className="rounded-[20px]"
      label="Drop replacement page here"
    >
      <div className="overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-white shadow-sm">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#f2f4f7]">
        <img src={page.previewUrl || page.imageUrl} alt={`Manga page ${index + 1}`} className="h-full w-full object-contain" />
        <div className="absolute left-2 top-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-black/75 px-2 text-[11px] font-black text-white">
          {index + 1}
        </div>
        {page.status === 'error' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 px-4 text-center text-[12px] font-bold leading-5 text-white">
            {page.error || 'Upload failed'}
          </div>
        ) : null}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className={`text-[11px] font-extrabold ${page.status === 'error' ? 'text-[#d92d20]' : 'text-[#344054]'}`}>
            {statusLabel}
          </div>
          <div className="text-[10px] font-bold text-[#98a2b3]">
            {page.fileSize ? formatFileSize(page.fileSize) : ''}
          </div>
        </div>

        {busy ? (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eaecf0]">
            <div className="h-full rounded-full bg-[#7c4dea] transition-all" style={{ width: `${page.progress || 5}%` }} />
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0 || disabled}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#f5f3fa] text-[#111827] disabled:opacity-35"
            aria-label="Move page up"
          >
            <i className="fa-solid fa-arrow-up text-[11px]" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1 || disabled}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#f5f3fa] text-[#111827] disabled:opacity-35"
            aria-label="Move page down"
          >
            <i className="fa-solid fa-arrow-down text-[11px]" />
          </button>
          <label className={`flex h-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-[#175cd3] ${disabled ? 'pointer-events-none opacity-35' : 'cursor-pointer'}`}>
            <i className="fa-solid fa-rotate text-[11px]" />
            <input
              type="file"
              accept="image/*,.heic,.heif"
              className="hidden"
              disabled={busy || disabled}
              onChange={(event) => {
                onReplace(page.id, event.target.files?.[0] || null)
                event.target.value = ''
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => onDelete(page.id)}
            disabled={busy}
            className="flex h-9 items-center justify-center rounded-[12px] bg-[#fff1f1] text-[#d92d20] disabled:opacity-35"
            aria-label="Delete page"
          >
            <i className="fa-solid fa-trash text-[11px]" />
          </button>
        </div>

        {page.status === 'error' ? (
          <button
            type="button"
            onClick={() => onRetry(page.id)}
            disabled={!page.sourceFile || disabled}
            className="mt-2 h-9 w-full rounded-[12px] bg-[#111827] text-[11px] font-extrabold text-white disabled:bg-[#98a2b3]"
          >
            Retry Upload
          </button>
        ) : null}
      </div>
    </div>
    </ImageDropZone>
  )
}

export default function EpisodeEditorPage() {
  const navigate = useNavigate()
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || `/author/story/${storyId}/manage`
  const requestedType = searchParams.get('type') === 'manga' ? 'manga' : 'novel'
  const editEpisodeId = searchParams.get('editEpisodeId')
  const isEditMode = Boolean(editEpisodeId)
  const isFirstEpisode = searchParams.get('first') !== '0' && !isEditMode

  const [storyType, setStoryType] = useState(requestedType)
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [episodeCover, setEpisodeCover] = useState('')
  const [originalCover, setOriginalCover] = useState('')
  const [coverChanged, setCoverChanged] = useState(false)
  const [tempCover, setTempCover] = useState('')
  const [cropOpen, setCropOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [content, setContent] = useState('')
  const [mangaPages, setMangaPages] = useState([])
  const [mangaUploadBatchIds, setMangaUploadBatchIds] = useState([])
  const mangaUploadAbortRef = useRef(null)
  const editorRef = useRef(null)
  const imageInputRef = useRef(null)
  const savedSelectionRef = useRef(null)
  const undoHistoryRef = useRef([])
  const redoHistoryRef = useRef([])
  const lastHistoryInputRef = useRef({ type: '', at: 0 })
  const applyingHistoryRef = useRef(false)
  const [findReplaceOpen, setFindReplaceOpen] = useState(false)
  const [smartFindReplaceOpen, setSmartFindReplaceOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState('Saved')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [localSaveSeconds, setLocalSaveSeconds] = useState(
    LOCAL_AUTOSAVE_INTERVAL_SECONDS
  )
  const localDraftKeyRef = useRef(
    getEpisodeLocalDraftKey(storyId, editEpisodeId || '')
  )

  const localDraftRevisionRef = useRef(0)
  const localSavedRevisionRef = useRef(0)
  const localSaveInFlightRef = useRef(false)
  const localSavePromiseRef = useRef(null)
  const localDraftSnapshotRef = useRef(null)
  const [serverCheckpointMinutes, setServerCheckpointMinutes] = useState(
    SERVER_CHECKPOINT_MINUTES
  )
  const [serverCheckpointSaving, setServerCheckpointSaving] = useState(false)
  const localRecoveryCheckedRef = useRef('')
  const [localRecoveryDraft, setLocalRecoveryDraft] = useState(null)
  const [localRecoveryOpen, setLocalRecoveryOpen] = useState(false)
  const [localRecoveryBusy, setLocalRecoveryBusy] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [cleanModalOpen, setCleanModalOpen] = useState(false)
  const [youtubeSheetOpen, setYoutubeSheetOpen] = useState(false)
  const [youtubeVideo, setYoutubeVideo] = useState({ title: '', url: '' })
  const [youtubeDraft, setYoutubeDraft] = useState({ title: '', url: '' })
  const [editorFocused, setEditorFocused] = useState(false)
  const [alignmentMode, setAlignmentMode] = useState('left')
  const [boldActive, setBoldActive] = useState(false)
  const [italicActive, setItalicActive] = useState(false)
  const [inlineImageUploading, setInlineImageUploading] = useState(false)
  const [toast, setToast] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [oldEpisodeStatus, setOldEpisodeStatus] = useState('draft')
  const [currentEpisodeId, setCurrentEpisodeId] = useState(editEpisodeId || '')
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(isFirstEpisode ? 1 : null)
  const [storyRecord, setStoryRecord] = useState(null)
  const [genreOptions, setGenreOptions] = useState(FALLBACK_GENRES)
  const [publishSettingsOpen, setPublishSettingsOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [storyLanguage, setStoryLanguage] = useState('Khmer')
  const [mainGenre, setMainGenre] = useState('Romance')
  const [storyTags, setStoryTags] = useState([])
  const [tagDraft, setTagDraft] = useState('')
  const [storyUpdateDays, setStoryUpdateDays] = useState([])
  const [storyStatus, setStoryStatus] = useState('New')
  const [storyAdult, setStoryAdult] = useState(false)
  const [episodeAdult, setEpisodeAdult] = useState(false)
  const [episodeFree, setEpisodeFree] = useState(false)
  const [releaseOption, setReleaseOption] = useState('publish')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [episodeDetailsOpen, setEpisodeDetailsOpen] = useState(false)
  const [draftEpisodeTitle, setDraftEpisodeTitle] = useState('')
  const [draftEpisodeCover, setDraftEpisodeCover] = useState('')
  const [draftCoverChanged, setDraftCoverChanged] = useState(false)

  const isManga = storyType === 'manga'
  const hasServerEpisode = Boolean(currentEpisodeId || editEpisodeId)
  const plainContent = useMemo(() => episodeHtmlToPlainText(content), [content])
  const characterCount = plainContent.length
  const completedMangaPages = mangaPages.filter((page) => page.status === 'done')
  const mangaErrorCount = mangaPages.filter((page) => page.status === 'error').length
  const mangaUploadPending = mangaPages.some((page) => ['queued', 'processing', 'uploading'].includes(page.status))
  const pageTitle = isEditMode ? 'Edit Episode' : isFirstEpisode ? 'First Episode' : 'Episode'
  const stepTitle = isFirstEpisode ? 'First Episode' : 'Episode'

  localDraftSnapshotRef.current = {
    storyId,
    episodeId: currentEpisodeId || editEpisodeId || '',
    storyType,
    title: episodeTitle,
    episodeCover,
    content,
    youtubeVideo,
    episodeAdult,
    episodeFree,
    mangaPages,
  }

  const warningText = useMemo(() => {
    if (isManga) {
      if (mangaErrorCount) return `${mangaErrorCount} page upload${mangaErrorCount > 1 ? 's' : ''} failed. Retry or remove them.`
      if (mangaUploadPending) return 'Pages are still being compressed and uploaded.'
      if (completedMangaPages.length < MANGA_MIN_PUBLISH_PAGES) {
        return `${completedMangaPages.length} / ${MANGA_MIN_PUBLISH_PAGES} pages required to continue`
      }
      return ''
    }

    if (characterCount === 0) return ''
    if (characterCount < MIN_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MIN_CHARACTERS.toLocaleString()} characters required to publish`
    }
    if (characterCount > MAX_CHARACTERS) {
      return `${characterCount.toLocaleString()} / ${MAX_CHARACTERS.toLocaleString()} characters. Please shorten this episode.`
    }
    return ''
  }, [characterCount, completedMangaPages.length, isManga, mangaErrorCount, mangaUploadPending])

  const isValidForNext =
    Boolean(episodeTitle.trim()) &&
    !loading &&
    !pageLoading &&
    (isManga
      ? completedMangaPages.length >= MANGA_MIN_PUBLISH_PAGES &&
        completedMangaPages.length <= MANGA_MAX_PAGES &&
        !mangaUploadPending &&
        mangaErrorCount === 0
      : characterCount >= MIN_CHARACTERS && characterCount <= MAX_CHARACTERS)

  const showToast = (text, duration = 2800) => {
    setToast(text)
    window.setTimeout(() => setToast(''), duration)
  }

  const markUnsaved = () => {
  const wasLocallySaved =
    localDraftRevisionRef.current === localSavedRevisionRef.current

  localDraftRevisionRef.current += 1

  if (wasLocallySaved) {
    setLocalSaveSeconds(LOCAL_AUTOSAVE_INTERVAL_SECONDS)
  }

  setSaveStatus('Unsaved')
  setHasUnsavedChanges((current) => {
    if (!current) {
      setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
    }
    return true
  })
}

  useEffect(() => {
    localDraftKeyRef.current = getEpisodeLocalDraftKey(
      storyId,
      editEpisodeId || ''
    )
    localDraftRevisionRef.current = 0
    localSavedRevisionRef.current = 0
  }, [storyId, editEpisodeId])

  const saveCurrentLocalDraft = useCallback(async () => {
    if (
      localSaveInFlightRef.current ||
      localDraftRevisionRef.current === localSavedRevisionRef.current
    ) {
      return false
    }

    const draft = localDraftSnapshotRef.current
    if (!draft) return false

    const revision = localDraftRevisionRef.current
    const localMangaPages =
      draft.storyType === 'manga'
        ? draft.mangaPages
            .filter((page) => page.status === 'done' && page.imageUrl)
            .map((page) => ({
              id: page.id,
              imageUrl: page.imageUrl,
              storagePath: page.storagePath || null,
              width: page.width || null,
              height: page.height || null,
              fileSize: page.fileSize || null,
              mimeType: page.mimeType || 'image/webp',
              ...mangaPartsPatch(page),
            }))
        : []

    localSaveInFlightRef.current = true
    setSaveStatus('Saving locally...')

    const savePromise = saveEpisodeLocalDraft(localDraftKeyRef.current, {
      storyId: draft.storyId,
      episodeId: draft.episodeId,
      storyType: draft.storyType,
      title: draft.title,
      episodeCover: draft.episodeCover,
      content:
        draft.storyType === 'manga'
          ? ''
          : sanitizeEpisodeHtml(editorRef.current?.innerHTML || draft.content),
      youtubeVideo:
        draft.storyType === 'manga'
          ? { title: '', url: '' }
          : {
              title: String(draft.youtubeVideo?.title || ''),
              url: String(draft.youtubeVideo?.url || ''),
            },
      episodeAdult: draft.episodeAdult,
      episodeFree: draft.episodeFree,
      mangaPages: localMangaPages,
    })

    localSavePromiseRef.current = savePromise

    try {
      await savePromise
      localSavedRevisionRef.current = Math.max(
  localSavedRevisionRef.current,
  revision
)

setSaveStatus(
  localDraftRevisionRef.current === localSavedRevisionRef.current
    ? 'Saved locally'
    : 'Unsaved'
)

return true
    } catch {
      setSaveStatus('Local save failed')
      return false
    } finally {
      localSaveInFlightRef.current = false
      if (localSavePromiseRef.current === savePromise) {
        localSavePromiseRef.current = null
      }
    }
  }, [])

  const updateMangaPage = (pageId, patch) => {
    setMangaPages((current) =>
      current.map((page) => (page.id === pageId ? { ...page, ...patch } : page))
    )
  }

  const processMangaPages = async (entries) => {
  const token = getAuthToken()

  if (!token) {
    navigate('/login')
    return
  }

  mangaUploadAbortRef.current?.abort()
  const controller = new AbortController()
  mangaUploadAbortRef.current = controller
  setMangaUploadBatchIds(entries.map((entry) => entry.id))

  await runWithConcurrency(entries, 1, async (entry) => {
    try {
      if (controller.signal.aborted) throw new Error('Upload canceled.')

      updateMangaPage(entry.id, {
        status: 'processing',
        progress: 15,
        uploadedBytes: 0,
        uploadSpeed: 0,
        error: '',
      })

      const optimized = await optimizeMangaImage(entry.sourceFile)

      if (controller.signal.aborted) throw new Error('Upload canceled.')

      updateMangaPage(entry.id, {
        status: 'uploading',
        progress: 0,
        width: optimized.width,
        height: optimized.height,
        fileSize: optimized.fileSize,
        mimeType: optimized.mimeType,
        uploadedBytes: 0,
        uploadTotalBytes: optimized.fileSize,
        uploadSpeed: 0,
      })

      const uploaded = await uploadMangaPageFile({
  token,
  file: optimized.file,
  storyId,
  pageId: entry.id,
  signal: controller.signal,
  useV2: true,
        onProgress: ({
  loaded,
  total,
  percent,
  speedBytesPerSecond,
  processing = false,
}) => {
  updateMangaPage(entry.id, {
    status: processing ? 'processing' : 'uploading',
    serverProcessing: Boolean(processing),
    progress: processing ? 100 : percent,
    uploadedBytes: processing ? total : loaded,
    uploadTotalBytes: total,
    uploadSpeed: processing ? 0 : speedBytesPerSecond,
  })
},
      })

      updateMangaPage(entry.id, {
  status: 'done',
  progress: 100,
  imageUrl: uploaded.imageUrl,
  storagePath: uploaded.storagePath,
  width: uploaded.width || optimized.width,
  height: uploaded.height || optimized.height,
  fileSize: uploaded.fileSize || optimized.fileSize,
  mimeType: uploaded.mimeType || optimized.mimeType,
  parts: Array.isArray(uploaded.parts) ? uploaded.parts : [],
  uploadedBytes: optimized.fileSize,
  uploadTotalBytes: optimized.fileSize,
  uploadSpeed: 0,
  error: '',
})
    } catch (error) {
      updateMangaPage(entry.id, {
        status: 'error',
        progress: 0,
        uploadedBytes: 0,
        uploadSpeed: 0,
        error: error.message || 'Upload failed',
      })
    }
  })

  if (mangaUploadAbortRef.current === controller) {
    mangaUploadAbortRef.current = null
  }
}

    useEffect(() => {
    let cancelled = false

    async function loadPageData() {
      const token = getAuthToken()

      if (!token) {
        navigate('/login')
        return
      }

      try {
        setPageLoading(true)
        setMessage('')

        const storyResponse = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const storyData = await storyResponse.json().catch(() => ({}))

        if (!storyResponse.ok || storyData.ok === false) {
          throw new Error(storyData.message || 'Failed to load story')
        }

        const loadedStory = storyData.story || {}
        const resolvedType = loadedStory.story_type || 'novel'

        if (!cancelled) {
          setStoryRecord(loadedStory)
          setStoryType(resolvedType)
          setStoryLanguage(loadedStory.story_language || 'Khmer')
          setMainGenre(loadedStory.main_genre || 'Romance')
          setStoryTags(Array.isArray(loadedStory.tags) ? loadedStory.tags.slice(0, 6) : [])
          setStoryUpdateDays(Array.isArray(loadedStory.update_days) ? loadedStory.update_days : [])
          setStoryStatus(loadedStory.story_status || 'New')
          setStoryAdult(Boolean(loadedStory.is_adult))
        }

        if (!isEditMode) return

        const episodeResponse = await fetch(
          `${API_BASE_URL}/api/stories/${storyId}/episodes/${editEpisodeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const episodeData = await episodeResponse.json().catch(() => ({}))

        if (!episodeResponse.ok || episodeData.ok === false) {
          throw new Error(episodeData.message || 'Failed to load episode')
        }

        if (cancelled) return

        const episode = episodeData.episode || {}

        setEpisodeTitle(episode.title || '')
        setEpisodeCover(episode.cover_url || '')
        setOriginalCover(episode.cover_url || '')
        setContent(normalizeEpisodeHtml(episode.content || ''))
        setOldEpisodeStatus(episode.status || 'draft')
        setEpisodeAdult(Boolean(episode.is_adult))
        setEpisodeFree(Boolean(episode.is_author_free ?? episode.is_free_published))
        setCurrentEpisodeNumber(Number(episode.episode_number || 1))
        setCoverChanged(false)

        setMangaPages(
          (episode.pages || []).map((page, index) => ({
            id: page.id || `existing-${index}`,
            previewUrl: page.image_url,
            imageUrl: page.image_url,
            storagePath: page.storage_path || null,
            width: page.width || null,
            height: page.height || null,
            fileSize: page.file_size || null,
            mimeType: page.mime_type || 'image/webp',
            ...mangaPartsPatch(page),
            sourceFile: null,
            status: 'done',
            progress: 100,
            error: '',
          }))
        )

        setSaveStatus('Saved')
        setHasUnsavedChanges(false)
      } catch (error) {
        if (!cancelled) setMessage(error.message || 'Failed to load episode')
      } finally {
        if (!cancelled) setPageLoading(false)
      }
    }

    loadPageData()

    return () => {
      cancelled = true
    }
  }, [editEpisodeId, isEditMode, navigate, storyId])

    useEffect(() => {
    if (pageLoading) return undefined

    const key = getEpisodeLocalDraftKey(storyId, editEpisodeId || '')

    if (localRecoveryCheckedRef.current === key) return undefined

    localRecoveryCheckedRef.current = key
    let cancelled = false

    const checkLocalDraft = async () => {
      try {
        const draft = await loadEpisodeLocalDraft(key)
        if (cancelled || !draft) return

        const draftType = draft.storyType === 'manga' ? 'manga' : 'novel'
        const currentType = storyType === 'manga' ? 'manga' : 'novel'
        const draftYoutube = draft.youtubeVideo || {}

        const currentPageData =
          currentType === 'manga'
            ? mangaPages
                .filter((page) => page.status === 'done' && page.imageUrl)
                .map((page) => ({
                  imageUrl: page.imageUrl,
                  storagePath: page.storagePath || null,
                  width: page.width || null,
                  height: page.height || null,
                  fileSize: page.fileSize || null,
                  mimeType: page.mimeType || 'image/webp',
                  ...mangaPartsPatch(page),
                }))
            : []

        const draftPageData =
          draftType === 'manga'
            ? (draft.mangaPages || []).map((page) => ({
                imageUrl: page.imageUrl,
                storagePath: page.storagePath || null,
                width: page.width || null,
                height: page.height || null,
                fileSize: page.fileSize || null,
                mimeType: page.mimeType || 'image/webp',
              ...mangaPartsPatch(page),
              }))
            : []

        const hasDifference =
          draftType !== currentType ||
          String(draft.title || '') !== String(episodeTitle || '') ||
          String(draft.episodeCover || '') !== String(episodeCover || '') ||
          (draftType === 'novel' &&
            sanitizeEpisodeHtml(draft.content || '') !== sanitizeEpisodeHtml(content || '')) ||
          String(draftYoutube.title || '') !== String(youtubeVideo.title || '') ||
          String(draftYoutube.url || '') !== String(youtubeVideo.url || '') ||
          Boolean(draft.episodeAdult) !== Boolean(episodeAdult) ||
          Boolean(draft.episodeFree) !== Boolean(episodeFree) ||
          JSON.stringify(draftPageData) !== JSON.stringify(currentPageData)

        if (!hasDifference) {
          await deleteEpisodeLocalDraft(key)
          return
        }

        if (cancelled) return
        setLocalRecoveryDraft(draft)
        setLocalRecoveryOpen(true)
      } catch {
      }
    }

    checkLocalDraft()

    return () => {
      cancelled = true
    }
  }, [pageLoading, storyId, editEpisodeId])

  const handleRestoreLocalDraft = () => {
    const draft = localRecoveryDraft
    if (!draft || localRecoveryBusy) return

    setLocalRecoveryBusy(true)

    const restoredType = draft.storyType === 'manga' ? 'manga' : 'novel'
    const restoredYoutube = draft.youtubeVideo || {}

    setStoryType(restoredType)
    setEpisodeTitle(String(draft.title || ''))
    setEpisodeCover(String(draft.episodeCover || ''))
    setContent(restoredType === 'manga' ? '' : normalizeEpisodeHtml(draft.content || ''))
    setYoutubeVideo(
      restoredType === 'manga'
        ? { title: '', url: '' }
        : {
            title: String(restoredYoutube.title || ''),
            url: String(restoredYoutube.url || ''),
          }
    )
    setEpisodeAdult(Boolean(draft.episodeAdult))
    setEpisodeFree(Boolean(draft.episodeFree))

    if (draft.episodeId) setCurrentEpisodeId(String(draft.episodeId))

    if (restoredType === 'manga') {
      setMangaPages(
        (draft.mangaPages || [])
          .filter((page) => page.imageUrl)
          .map((page, index) => ({
            id: page.id || `local-${index}`,
            previewUrl: page.imageUrl,
            imageUrl: page.imageUrl,
            storagePath: page.storagePath || null,
            width: page.width || null,
            height: page.height || null,
            fileSize: page.fileSize || null,
            mimeType: page.mimeType || 'image/webp',
            ...mangaPartsPatch(page),
            sourceFile: null,
            status: 'done',
            progress: 100,
            error: '',
          }))
      )
    } else {
      setMangaPages([])
    }

    undoHistoryRef.current = []
    redoHistoryRef.current = []
    lastHistoryInputRef.current = { type: '', at: 0 }
    setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
    setHasUnsavedChanges(true)
    setSaveStatus('Saved locally')
    setLocalRecoveryOpen(false)
    setLocalRecoveryDraft(null)
    setLocalRecoveryBusy(false)
    showToast('Local draft restored.')
  }

  const handleDiscardLocalDraft = async () => {
    const draft = localRecoveryDraft
    if (!draft || localRecoveryBusy) return

    try {
      setLocalRecoveryBusy(true)
      if (localSavePromiseRef.current) {
        await localSavePromiseRef.current.catch(() => {})
      }
      localSavedRevisionRef.current = localDraftRevisionRef.current
      await cleanupTemporaryMangaPages(
        draft.storyType === 'manga'
          ? draft.mangaPages || []
          : []
      )
      await deleteEpisodeLocalDraft(localDraftKeyRef.current)
      setLocalRecoveryOpen(false)
      setLocalRecoveryDraft(null)

      if (!editEpisodeId && draft.episodeId) {
        const nextParams = new URLSearchParams(searchParams)
        nextParams.set('editEpisodeId', String(draft.episodeId))
        nextParams.set('first', '0')
        nextParams.set('type', draft.storyType === 'manga' ? 'manga' : 'novel')
        navigate(`${window.location.pathname}?${nextParams.toString()}`, { replace: true })
      }
    } finally {
      setLocalRecoveryBusy(false)
    }
  }

  const trimEditorHistory = (stack) => {
    if (stack.length > MAX_EDITOR_HISTORY) {
      stack.splice(0, stack.length - MAX_EDITOR_HISTORY)
    }
  }

  const resetEditorHistoryGrouping = () => {
    lastHistoryInputRef.current = { type: '', at: 0 }
  }

  const recordEditorSnapshot = (html = editorRef.current?.innerHTML || content) => {
    if (applyingHistoryRef.current) return

    const safeHtml = sanitizeEpisodeHtml(html)
    const stack = undoHistoryRef.current

    if (stack[stack.length - 1] !== safeHtml) {
      stack.push(safeHtml)
      trimEditorHistory(stack)
    }

    redoHistoryRef.current = []
  }

  const applyEditorHistory = (html) => {
    const safeHtml = sanitizeEpisodeHtml(html)
    applyingHistoryRef.current = true

    if (editorRef.current) {
      editorRef.current.innerHTML = safeHtml
      editorRef.current.focus()

      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      savedSelectionRef.current = range.cloneRange()
    }

    setContent(safeHtml)
    markUnsaved()
    applyingHistoryRef.current = false
  }

  useEffect(() => {
    undoHistoryRef.current = []
    redoHistoryRef.current = []
    resetEditorHistoryGrouping()
  }, [storyId, editEpisodeId])

  const syncEditorContent = (nextHtml, markChanged = true) => {
    const safeHtml = sanitizeEpisodeHtml(nextHtml)

    if (markChanged) {
      recordEditorSnapshot(editorRef.current?.innerHTML || content)
      resetEditorHistoryGrouping()
    }

    setContent(safeHtml)

    if (editorRef.current && editorRef.current.innerHTML !== safeHtml) {
      editorRef.current.innerHTML = safeHtml
    }

    if (markChanged) markUnsaved()
  }

  useEffect(() => {
    if (!editorRef.current) return
    const safeHtml = normalizeEpisodeHtml(content)
    if (editorRef.current.innerHTML !== safeHtml) {
      editorRef.current.innerHTML = safeHtml
    }
  }, [content, pageLoading])

  const updateFormattingState = useCallback(() => {
    if (!editorRef.current || !editorRef.current.contains(document.activeElement)) return

    setBoldActive(Boolean(document.queryCommandState('bold')))
    setItalicActive(Boolean(document.queryCommandState('italic')))

    if (document.queryCommandState('justifyCenter')) {
      setAlignmentMode('center')
    } else if (document.queryCommandState('justifyRight')) {
      setAlignmentMode('right')
    } else {
      setAlignmentMode('left')
    }
  }, [])

  const saveEditorSelection = useCallback(() => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection?.rangeCount) return

    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return
    savedSelectionRef.current = range.cloneRange()
    updateFormattingState()
  }, [updateFormattingState])

  const restoreEditorSelection = useCallback(() => {
    const editor = editorRef.current
    const range = savedSelectionRef.current
    if (!editor) return

    editor.focus()
    if (!range) return

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }, [])

  const handleEditorBeforeInput = (event) => {
    if (applyingHistoryRef.current) return

    const inputType = event.nativeEvent?.inputType || ''
    const now = Date.now()
    const groupable = [
      'insertText',
      'insertCompositionText',
      'deleteContentBackward',
      'deleteContentForward',
    ].includes(inputType)

    const last = lastHistoryInputRef.current
    const sameGroup = groupable && last.type === inputType && now - last.at <= EDITOR_HISTORY_GROUP_MS

    if (!sameGroup) recordEditorSnapshot(event.currentTarget.innerHTML)
    lastHistoryInputRef.current = { type: inputType, at: now }
  }

  const handleEditorPaste = (event) => {
    recordEditorSnapshot(event.currentTarget.innerHTML)
    lastHistoryInputRef.current = { type: 'insertFromPaste', at: Date.now() }
  }

  const handleEditorInput = (event) => {
    setContent(event.currentTarget.innerHTML)
    markUnsaved()
    saveEditorSelection()
  }

  const runEditorCommand = (command, value = null) => {
    recordEditorSnapshot()
    resetEditorHistoryGrouping()
    restoreEditorSelection()
    document.execCommand(command, false, value)
    setContent(editorRef.current?.innerHTML || '')
    markUnsaved()
    saveEditorSelection()
  }

  const handleAlignmentChange = () => {
    const nextAlignment = alignmentMode === 'left' ? 'center' : alignmentMode === 'center' ? 'right' : 'left'
    const command = nextAlignment === 'center' ? 'justifyCenter' : nextAlignment === 'right' ? 'justifyRight' : 'justifyLeft'

    runEditorCommand(command)
    setAlignmentMode(nextAlignment)
  }

  const insertHtmlAtSelection = (html) => {
    recordEditorSnapshot()
    resetEditorHistoryGrouping()
    restoreEditorSelection()

    if (document.queryCommandSupported?.('insertHTML')) {
      document.execCommand('insertHTML', false, html)
    } else {
      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      if (!range) return
      const fragment = range.createContextualFragment(html)
      range.deleteContents()
      range.insertNode(fragment)
    }

    setContent(editorRef.current?.innerHTML || '')
    markUnsaved()
    saveEditorSelection()
  }

  const handleInlineImagePick = async (file) => {
    if (!file) return

    try {
      const currentHtml = editorRef.current?.innerHTML || content

      if (countEpisodeImages(currentHtml) >= NOVEL_IMAGE_MAX_COUNT) {
        throw new Error('Only 2 images are allowed in one episode.')
      }

      const token = getAuthToken()
      if (!token) {
        navigate('/login')
        return
      }

      setInlineImageUploading(true)
      const uploadFile = isNovelHeicFile(file)
        ? await convertNovelHeicForUpload(file)
        : file

      const imageUrl = await uploadEpisodeInlineImage({ token, file: uploadFile })
      if (!imageUrl) throw new Error('Image URL was missing.')

      insertHtmlAtSelection(
        `<p><img src="${escapeEpisodeHtml(imageUrl)}" alt="Episode image"></p><p><br></p>`
      )
      showToast('Image added.')
    } catch (error) {
      showToast(error.message || 'Could not add image.')
    } finally {
      setInlineImageUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  const handleConfirmCleanParagraphs = () => {
    const cleanedContent = cleanEpisodeHtmlSpacing(content)
    setCleanModalOpen(false)

    if (cleanedContent === sanitizeEpisodeHtml(content)) {
      showToast('No broken paragraph spacing found.')
      return
    }

    syncEditorContent(cleanedContent)
    showToast('Paragraphs cleaned. Please review before saving.')
  }

  const openYouTubeSheet = () => {
    setYoutubeDraft(youtubeVideo)
    setYoutubeSheetOpen(true)
  }

  const saveYouTubeVideo = () => {
    const nextVideo = {
      title: String(youtubeDraft.title || '').trim(),
      url: String(youtubeDraft.url || '').trim(),
    }

    if (nextVideo.title !== youtubeVideo.title || nextVideo.url !== youtubeVideo.url) {
      setYoutubeVideo(nextVideo)
      markUnsaved()
    }

    setYoutubeSheetOpen(false)
  }

  const removeYouTubeVideo = () => {
    if (youtubeVideo.title || youtubeVideo.url) markUnsaved()

    setYoutubeVideo({ title: '', url: '' })
    setYoutubeDraft({ title: '', url: '' })
    setYoutubeSheetOpen(false)
  }

  const openEpisodeDetails = () => {
    setDraftEpisodeTitle(episodeTitle)
    setDraftEpisodeCover(episodeCover)
    setDraftCoverChanged(coverChanged)
    setEpisodeDetailsOpen(true)
  }

  const closeEpisodeDetails = () => {
    setDraftEpisodeTitle(episodeTitle)
    setDraftEpisodeCover(episodeCover)
    setDraftCoverChanged(coverChanged)
    setEpisodeDetailsOpen(false)
  }

  const saveEpisodeDetails = () => {
    const nextTitle = draftEpisodeTitle.trim()
    if (!nextTitle) return

    const detailsChanged =
      nextTitle !== episodeTitle ||
      draftEpisodeCover !== episodeCover ||
      draftCoverChanged !== coverChanged

    setEpisodeTitle(nextTitle)
    setEpisodeCover(draftEpisodeCover)
    setCoverChanged(draftCoverChanged)
    setEpisodeDetailsOpen(false)

    if (detailsChanged) markUnsaved()
  }

  const handleUndo = () => {
    resetEditorHistoryGrouping()

    const previousHtml = undoHistoryRef.current.pop()
    if (previousHtml === undefined) return

    const currentHtml = sanitizeEpisodeHtml(editorRef.current?.innerHTML || content)

    if (redoHistoryRef.current[redoHistoryRef.current.length - 1] !== currentHtml) {
      redoHistoryRef.current.push(currentHtml)
      trimEditorHistory(redoHistoryRef.current)
    }

    applyEditorHistory(previousHtml)
  }

  const handleRedo = () => {
    resetEditorHistoryGrouping()

    const nextHtml = redoHistoryRef.current.pop()
    if (nextHtml === undefined) return

    const currentHtml = sanitizeEpisodeHtml(editorRef.current?.innerHTML || content)

    if (undoHistoryRef.current[undoHistoryRef.current.length - 1] !== currentHtml) {
      undoHistoryRef.current.push(currentHtml)
      trimEditorHistory(undoHistoryRef.current)
    }

    applyEditorHistory(nextHtml)
  }

  const handleEditorKeyDown = (event) => {
    if (event.isComposing) return

    const key = event.key.toLowerCase()
    const isDesktopKeyboard = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true

    if (key === 'enter' && isDesktopKeyboard && !event.altKey) {
      event.preventDefault()

      if (event.ctrlKey || event.metaKey) {
        if (isValidForNext) handleNext()
        return
      }

      const selection = window.getSelection()
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null
      if (!range || !event.currentTarget.contains(range.commonAncestorContainer)) return

      recordEditorSnapshot(event.currentTarget.innerHTML)
      resetEditorHistoryGrouping()

      const breakNode = document.createElement('br')
      range.deleteContents()
      range.insertNode(breakNode)
      range.setStartAfter(breakNode)
      range.collapse(true)

      selection.removeAllRanges()
      selection.addRange(range)
      savedSelectionRef.current = range.cloneRange()

      setContent(event.currentTarget.innerHTML)
      markUnsaved()
      return
    }

    if (!(event.ctrlKey || event.metaKey) || event.altKey) return

    if (key === 'z') {
      event.preventDefault()
      if (event.shiftKey) handleRedo()
      else handleUndo()
      return
    }

    if (key === 'y') {
      event.preventDefault()
      handleRedo()
    }
  }

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCoverChange = (file) => {
    if (!file) return
    const imageUrl = URL.createObjectURL(file)
    setOriginalCover(imageUrl)
    setTempCover(imageUrl)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setDraftCoverChanged(true)
    setCropOpen(true)
  }

  const handleSaveCoverCrop = async () => {
    if (!tempCover || !croppedAreaPixels) {
      showToast('Please adjust the cover first.')
      return
    }

    try {
      const croppedImage = await getCroppedImage(tempCover, croppedAreaPixels)
      setDraftEpisodeCover(croppedImage)
      setDraftCoverChanged(true)
      setCropOpen(false)
    } catch {
      showToast('Could not save crop. Please try another image.')
    }
  }


  const handlePickMangaPages = async (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return

    if (files.length > MANGA_MAX_FILES_PER_PICK) {
      showToast(`Choose no more than ${MANGA_MAX_FILES_PER_PICK} images each time.`)
      return
    }

    if (mangaPages.length + files.length > MANGA_MAX_PAGES) {
      showToast(`Manga episode can contain no more than ${MANGA_MAX_PAGES} pages.`)
      return
    }

    const errors = files.map(validateMangaFile).filter(Boolean)
    if (errors.length) {
      showToast(errors[0])
      return
    }

    const entries = files.map((file) => ({
      id: makeLocalId(),
      previewUrl: URL.createObjectURL(file),
      imageUrl: '',
      storagePath: null,
      width: null,
      height: null,
      fileSize: file.size,
      mimeType: file.type,
      sourceFile: file,
      status: 'queued',
      progress: 5,
      error: '',
    }))

    setMangaPages((current) => [...current, ...entries])
    markUnsaved()
    await processMangaPages(entries)
  }

  const handleReplaceMangaPage = async (pageId, file) => {
    if (!file) return
    const validationError = validateMangaFile(file)

    if (validationError) {
      showToast(validationError)
      return
    }

    const previousPage = mangaPages.find(
  (page) => page.id === pageId
)

await cleanupTemporaryMangaPages(
  previousPage ? [previousPage] : []
)

    const entry = {
      id: pageId,
      previewUrl: URL.createObjectURL(file),
      sourceFile: file,
    }

    setMangaPages((current) =>
      current.map((page) => {
        if (page.id !== pageId) return page
        if (String(page.previewUrl || '').startsWith('blob:')) URL.revokeObjectURL(page.previewUrl)
        return {
          ...page,
          ...entry,
          imageUrl: '',
          storagePath: null,
          parts: [],
          fileSize: file.size,
          mimeType: file.type,
          status: 'queued',
          progress: 5,
          error: '',
        }
      })
    )

    markUnsaved()
    await processMangaPages([{ ...entry, status: 'queued' }])
  }

  const handleRetryMangaPage = async (pageId) => {
    const page = mangaPages.find((item) => item.id === pageId)
    if (!page?.sourceFile) {
      showToast('Choose a replacement image for this page.')
      return
    }

    updateMangaPage(pageId, { status: 'queued', progress: 5, error: '' })
    await processMangaPages([page])
  }

  const handleDeleteMangaPage = async (pageId) => {
  const page = mangaPages.find((item) => item.id === pageId)

  setMangaPages((current) => {
    if (String(page?.previewUrl || '').startsWith('blob:')) {
      URL.revokeObjectURL(page.previewUrl)
    }

    return current.filter((item) => item.id !== pageId)
  })

  markUnsaved()
  await cleanupTemporaryMangaPages(page ? [page] : [])
}

  const handleMoveMangaPage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= mangaPages.length || fromIndex === toIndex) return

    setMangaPages((current) => {
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    markUnsaved()
  }

  const handleSaveEpisode = async ({
  goToPublish = false,
  forceDraft = false,
  stayOnPage = false,
} = {}) => {
    setMessage('')

    if (localSavePromiseRef.current) {
      await localSavePromiseRef.current.catch(() => {})
    }

    if (!episodeTitle.trim()) {
      setMessage('Please enter an episode title.')
      return null
    }

    if (isManga) {
      if (mangaUploadPending) {
        setMessage('Please wait until all manga pages finish uploading.')
        return null
      }

      if (mangaErrorCount) {
        setMessage('Retry or remove failed manga pages before saving.')
        return null
      }

      if (goToPublish && completedMangaPages.length < MANGA_MIN_PUBLISH_PAGES) {
        setMessage(`Manga episodes need at least ${MANGA_MIN_PUBLISH_PAGES} pages.`)
        return null
      }
    } else {
      if (goToPublish && !hasEpisodeContent(content)) {
        setMessage('Please write some episode content.')
        return null
      }

      if (goToPublish && characterCount < MIN_CHARACTERS) {
        setMessage('Almost there! Episodes need at least 1,500 characters.')
        return null
      }

      if (characterCount > MAX_CHARACTERS) {
        setMessage('This episode is too long. Maximum is 30,000 characters.')
        return null
      }
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      throw new Error('Please login first.')
    }

    const episodeCoverUrl = episodeCover
      ? await uploadImageToStorage({
          token,
          imageDataUrl: episodeCover,
          folder: 'episode_cover',
          fileName: `episode-cover-${storyId}-${Date.now()}.jpg`,
        })
      : null

    if (episodeCoverUrl && episodeCoverUrl !== episodeCover) {
      setEpisodeCover(episodeCoverUrl)
      setOriginalCover(episodeCoverUrl)
      setCoverChanged(false)
    }

    const pagesPayload = completedMangaPages.map((page) => ({
      image_url: page.imageUrl,
      storage_path: page.storagePath,
      width: page.width,
      height: page.height,
      file_size: page.fileSize,
      mime_type: page.mimeType || 'image/webp',
      ...mangaPartsPatch(page),
    }))

    const targetEpisodeId = currentEpisodeId || editEpisodeId || ''

    const response = await fetch(
      targetEpisodeId
        ? `${API_BASE_URL}/api/stories/${storyId}/episodes/${targetEpisodeId}`
        : `${API_BASE_URL}/api/stories/${storyId}/episodes/create`,
      {
        method: targetEpisodeId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: episodeTitle.trim(),
          cover_url: episodeCoverUrl,
          content: isManga ? '' : sanitizeEpisodeHtml(content),
          youtube_url: isManga ? '' : youtubeVideo.url,
          youtube_title: isManga ? '' : youtubeVideo.title,
          pages: isManga ? pagesPayload : undefined,
          is_adult: episodeAdult,
          is_free_published: episodeFree,
          status: forceDraft ? 'draft' : targetEpisodeId ? oldEpisodeStatus : 'draft',
        }),
      }
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(data.error || data.message || (targetEpisodeId ? 'Failed to update episode' : 'Failed to create episode'))
    }

    const episodeId = data.episode?.id || targetEpisodeId

    if (!episodeId) {
      throw new Error(targetEpisodeId ? 'Episode updated but episode id was missing' : 'Episode created but episode id was missing')
    }

    setCurrentEpisodeId(episodeId)
    setCurrentEpisodeNumber(Number(data.episode?.episode_number || currentEpisodeNumber || 1))
    setSaveStatus('Saved')
    setHasUnsavedChanges(false)
    localSavedRevisionRef.current = localDraftRevisionRef.current
    await deleteEpisodeLocalDraft(localDraftKeyRef.current)

    if (!goToPublish && !stayOnPage) {
  navigate(`/author/story/${storyId}/manage`)
}

    return {
      episodeId,
      episodeNumber: data.episode?.episode_number || 1,
    }
  }

  useEffect(() => {
    if (
      !hasUnsavedChanges ||
      pageLoading ||
      localSaveInFlightRef.current ||
      localDraftRevisionRef.current === localSavedRevisionRef.current ||
      localSaveSeconds <= 0
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setLocalSaveSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [hasUnsavedChanges, localSaveSeconds, pageLoading, saveStatus])

  useEffect(() => {
    if (
      !hasUnsavedChanges ||
      pageLoading ||
      localSaveSeconds !== 0 ||
      localSaveInFlightRef.current ||
      localDraftRevisionRef.current === localSavedRevisionRef.current
    ) {
      return
    }

    saveCurrentLocalDraft().finally(() => {
      setLocalSaveSeconds(LOCAL_AUTOSAVE_INTERVAL_SECONDS)
    })
  }, [
    hasUnsavedChanges,
    localSaveSeconds,
    pageLoading,
    saveCurrentLocalDraft,
  ])

  const handleServerCheckpoint = async () => {
    const targetEpisodeId = currentEpisodeId || editEpisodeId

    if (
      !targetEpisodeId ||
      !hasUnsavedChanges ||
      serverCheckpointSaving ||
      loading ||
      pageLoading ||
      !episodeTitle.trim() ||
      mangaUploadPending
    ) {
      setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
      return
    }

    try {
      setServerCheckpointSaving(true)
      setSaveStatus('Backing up to server...')

      await handleSaveEpisode({
        forceDraft: false,
        stayOnPage: true,
      })

      setSaveStatus('Saved')
    } catch {
      setSaveStatus('Saved locally')
    } finally {
      setServerCheckpointSaving(false)
      setServerCheckpointMinutes(SERVER_CHECKPOINT_MINUTES)
    }
  }

  useEffect(() => {
    if (
      !hasServerEpisode ||
      !hasUnsavedChanges ||
      serverCheckpointSaving ||
      loading ||
      pageLoading
    ) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setServerCheckpointMinutes((current) => Math.max(0, current - 1))
    }, 60 * 1000)

    return () => window.clearInterval(timer)
  }, [
    hasServerEpisode,
    hasUnsavedChanges,
    loading,
    pageLoading,
    serverCheckpointSaving,
  ])

  useEffect(() => {
    if (
      !hasServerEpisode ||
      serverCheckpointMinutes !== 0 ||
      !hasUnsavedChanges ||
      serverCheckpointSaving ||
      loading ||
      pageLoading
    ) {
      return
    }

    handleServerCheckpoint()
  }, [
    hasServerEpisode,
    serverCheckpointMinutes,
    hasUnsavedChanges,
    serverCheckpointSaving,
    loading,
    pageLoading,
  ])
  
  const handleSaveDraft = async () => {
    try {
      setLoading(true)
      await handleSaveEpisode({ forceDraft: true })
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed or running.'
          : error.message || (isEditMode ? 'Failed to update episode' : 'Failed to save draft')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitModal(true)
      return
    }

    if (searchParams.get('fromPublishSuccess') === '1' || searchParams.get('fromPublishWarning') === '1') {
      navigate('/author/dashboard', { replace: true })
      return
    }

    navigate(returnTo, { replace: true })
  }

  const handleDiscard = async () => {
    setShowExitModal(false)

    if (localSavePromiseRef.current) {
      await localSavePromiseRef.current.catch(() => {})
    }

    localSavedRevisionRef.current = localDraftRevisionRef.current
    await cleanupTemporaryMangaPages(mangaPages)
    await deleteEpisodeLocalDraft(localDraftKeyRef.current)

    if (searchParams.get('fromPublishSuccess') === '1' || searchParams.get('fromPublishWarning') === '1') {
      navigate('/author/dashboard', { replace: true })
      return
    }

    navigate(returnTo, { replace: true })
  }

  const handleSaveDraftAndLeave = async () => {
    setShowExitModal(false)
    await handleSaveDraft()
  }

  const addStoryTag = (value = tagDraft) => {
    const tag = String(value || '').trim()
    if (!tag || storyTags.length >= 6) return
    if (storyTags.some((item) => item.toLowerCase() === tag.toLowerCase())) return

    setStoryTags((current) => [...current, tag])
    setTagDraft('')
  }

  const removeStoryTag = (tag) => {
    setStoryTags((current) => current.filter((item) => item !== tag))
  }

  const toggleStoryUpdateDay = (day) => {
    setStoryUpdateDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day]
    )
  }

  const saveStorySettings = async (token) => {
    if (!storyRecord) throw new Error('Story information is still loading.')

    const slides = (storyRecord.slides || []).map((slide, index) => ({
      image_url: slide.image_url,
      sort_order: Number(slide.sort_order ?? index),
      is_active: slide.is_active !== false,
    }))

    const response = await fetch(`${API_BASE_URL}/api/stories/${storyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: storyRecord.title,
        story_type: storyRecord.story_type || storyType,
        story_language: storyLanguage,
        main_genre: mainGenre,
        story_status: storyStatus,
        tags: storyTags,
        update_days: storyUpdateDays,
        description: storyRecord.description || null,
        is_adult: storyAdult,
        cover_url: storyRecord.cover_url || null,
        landscape_thumbnail_url: storyRecord.landscape_thumbnail_url || null,
        slides,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data.ok === false) {
      throw new Error(
  data.error || data.message || 'Failed to update story information.'
)
    }

    setStoryRecord(data.story || storyRecord)
  }

  const handleSavePublishSettings = async () => {
    if (settingsSaving) return

    if (!currentEpisodeId) {
      setMessage('Missing episode id. Close this popup and click Next again.')
      return
    }

    if (releaseOption === 'schedule' && (!scheduleDate || !scheduleTime)) {
      setMessage('Please choose schedule date and time.')
      return
    }

    const token = getAuthToken()

    if (!token) {
      navigate('/login')
      return
    }

    try {
      setSettingsSaving(true)
      setMessage('')

      if (isFirstEpisode) {
  await saveStorySettings(token)
}

      const status =
        releaseOption === 'schedule'
          ? 'scheduled'
          : releaseOption === 'draft'
            ? 'draft'
            : 'published'

      const scheduledAt =
        releaseOption === 'schedule'
          ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
          : null

      const response = await fetch(
        `${API_BASE_URL}/api/stories/${storyId}/episodes/${currentEpisodeId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
  status,
  scheduled_at: scheduledAt,
  is_adult: episodeAdult,
  is_free_published: episodeFree,
}),
        }
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data.ok === false) {
        const blockedWords =
          data.blocked_words_found || data.blockedWordsFound || []

        if (data.code === 'BLOCKED_WORDS_FOUND' || blockedWords.length) {
          navigate(`/author/story/${storyId}/episode/publish-warning`, {
            replace: true,
            state: {
              episodeId: currentEpisodeId,
              blockedWords,
            },
          })
          return
        }

        throw new Error(data.message || 'Failed to save publish settings.')
      }

      setPublishSettingsOpen(false)
setOldEpisodeStatus(status)
setHasUnsavedChanges(false)
setSaveStatus('Saved')
setSuccessOpen(true)
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed or running.'
          : error.message || 'Failed to save publish settings.'
      )
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleNext = async () => {
    try {
      setLoading(true)
      const saved = await handleSaveEpisode({ goToPublish: true })
      if (!saved) return

      setCurrentEpisodeId(saved.episodeId)
      setCurrentEpisodeNumber(Number(saved.episodeNumber || currentEpisodeNumber || 1))
      setPublishSettingsOpen(true)
    } catch (error) {
      setMessage(
        error.message === 'Failed to fetch'
          ? 'Cannot connect to backend. Make sure backend is deployed or running.'
          : error.message || (isEditMode ? 'Failed to update episode' : 'Failed to create episode')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
  <div
    className={`min-h-screen bg-white pb-0 sm:bg-[#fafafa] ${
      isManga ? 'manga-red-theme' : ''
    }`}
  >
    {isManga && mangaUploadPending ? (
  <MangaUploadProgressModal
    pages={mangaPages.filter((page) => mangaUploadBatchIds.includes(page.id))}
    onCancel={() => mangaUploadAbortRef.current?.abort()}
  />
) : null}
    
    <style>{`
  .rich-episode-editor:empty::before {
    content: attr(data-placeholder);
    color: #a5aab4;
    pointer-events: none;
  }

  .rich-episode-editor p,
  .rich-episode-editor div {
    min-height: 1.5em;
    margin: 0 0 1em;
  }

  .rich-episode-editor img {
    display: block;
    width: 100%;
    max-height: 70vh;
    margin: 1rem 0;
    border-radius: 12px;
    object-fit: contain;
  }

  .manga-red-theme button:not(:disabled)[class*="bg-[#111827]"],
  .manga-red-theme button:not(:disabled)[class*="bg-[#e5484d]"],
  .manga-red-theme label[class*="bg-[#111827]"] {
    background-color: #FE526E !important;
  }

  .manga-red-theme button[class*="text-[#0b5cff]"] {
    color: #FE526E !important;
  }

  .manga-red-theme input[type="range"] {
    accent-color: #FE526E;
  }

  .manga-red-theme
    button:not(:disabled)[class*="shadow-[0_14px_30px_rgba(17,24,39,0.25)]"] {
    box-shadow: 0 14px 30px rgba(254, 82, 110, 0.28) !important;
  }
`}</style>

    <Toast message={toast} onClose={() => setToast('')} />

    <SuccessModal
  open={successOpen}
  isManga={isManga}
  isFirstEpisode={Number(currentEpisodeNumber || 1) === 1}
  releaseOption={releaseOption}
  episodeNumber={Number(currentEpisodeNumber || 1)}
  episodeTitle={episodeTitle}
  onStoryManager={() => {
    setSuccessOpen(false)
    navigate('/author/dashboard', { replace: true })

    window.setTimeout(() => {
      navigate(`/author/story/${storyId}/manage`)
    }, 0)
  }}
  onAddEpisode={() => {
    const path =
      `/author/story/${storyId}/episode/create` +
      `?first=0&fromPublishSuccess=1&type=${isManga ? 'manga' : 'novel'}`

    setSuccessOpen(false)
    navigate('/author/dashboard', { replace: true })

    window.setTimeout(() => {
      navigate(path)
    }, 0)
  }}
/>

      <PublishSettingsSheet
        open={publishSettingsOpen}
        episodeTitle={episodeTitle}
        showStorySettings={isFirstEpisode}
        genreOptions={genreOptions}
        storyLanguage={storyLanguage}
        onStoryLanguageChange={setStoryLanguage}
        mainGenre={mainGenre}
        onMainGenreChange={setMainGenre}
        storyTags={storyTags}
        onStoryTagsChange={setStoryTags}
        updateDays={storyUpdateDays}
        onToggleUpdateDay={toggleStoryUpdateDay}
        storyStatus={storyStatus}
        onStoryStatusChange={setStoryStatus}
        storyAdult={storyAdult}
        onStoryAdultChange={setStoryAdult}
       episodeAdult={episodeAdult}
onEpisodeAdultChange={setEpisodeAdult}
episodeFree={episodeFree}
onEpisodeFreeChange={setEpisodeFree}
releaseOption={releaseOption}
        onReleaseOptionChange={setReleaseOption}
        scheduleDate={scheduleDate}
        onScheduleDateChange={setScheduleDate}
        scheduleTime={scheduleTime}
        onScheduleTimeChange={setScheduleTime}
        saving={settingsSaving}
        onClose={() => setPublishSettingsOpen(false)}
        onSave={handleSavePublishSettings}
      />

      <EpisodeDetailsSheet
        open={episodeDetailsOpen}
        title={draftEpisodeTitle}
        cover={draftEpisodeCover}
        onTitleChange={setDraftEpisodeTitle}
        onCoverChange={handleCoverChange}
        onRemoveCover={() => {
          setDraftEpisodeCover('')
          setDraftCoverChanged(true)
        }}
        onClose={closeEpisodeDetails}
        onSave={saveEpisodeDetails}
      />

      <CropCoverModal
        open={cropOpen}
        image={tempCover}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        onClose={() => setCropOpen(false)}
        onSave={handleSaveCoverCrop}
      />

      <UnsavedChangesModal
        open={showExitModal}
        onKeepEditing={() => setShowExitModal(false)}
        onDiscard={handleDiscard}
        onSaveDraft={handleSaveDraftAndLeave}
      />

      <LocalDraftRecoveryModal
        open={localRecoveryOpen}
        busy={localRecoveryBusy}
        onDiscard={handleDiscardLocalDraft}
        onRestore={handleRestoreLocalDraft}
      />

      {!isManga ? (
        <>

          <YouTubeVideoSheet
  open={youtubeSheetOpen}
  value={youtubeDraft}
  onChange={setYoutubeDraft}
  onClose={() => setYoutubeSheetOpen(false)}
  onSave={saveYouTubeVideo}
  onRemove={removeYouTubeVideo}
  hasVideo={Boolean(youtubeVideo.url)}
/>
          
          <CleanParagraphsModal
            open={cleanModalOpen}
            onCancel={() => setCleanModalOpen(false)}
            onClean={handleConfirmCleanParagraphs}
          />
          <RichFindReplacePanel
  open={findReplaceOpen}
  editorRef={editorRef}
  onClose={() => {
    setFindReplaceOpen(false)
    window.setTimeout(() => editorRef.current?.focus(), 60)
  }}
  onChange={(nextHtml) => syncEditorContent(nextHtml)}
  onMoreOptions={() => {
    setFindReplaceOpen(false)
    setSmartFindReplaceOpen(true)
  }}
/>

<SmartFindReplacePanel
  open={smartFindReplaceOpen}
  editorRef={editorRef}
  onClose={() => {
    setSmartFindReplaceOpen(false)
    window.setTimeout(() => editorRef.current?.focus(), 60)
  }}
  onChange={(nextHtml) => syncEditorContent(nextHtml)}
/>
        </>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-[#f0f1f3] bg-white px-3 py-2.5">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
            aria-label="Go back"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-bold text-[#555b66]">
              {isManga
                ? `${completedMangaPages.length} pages`
                : `${characterCount.toLocaleString()} / ${MIN_CHARACTERS.toLocaleString()} characters`}
            </div>
            <div className="mt-0.5 text-[10px] text-[#8d94a1]">
              {hasUnsavedChanges &&
              localDraftRevisionRef.current !== localSavedRevisionRef.current
                ? `Save ${localSaveSeconds}s`
                : 'Saved'}
            </div>
          </div>

          {!isManga ? (
            <>
              <button
                type="button"
                onClick={handleUndo}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827] active:scale-95"
                aria-label="Undo"
              >
                <i className="fa-solid fa-rotate-left text-[17px]" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[#98a2b3] active:scale-95"
                aria-label="Redo"
              >
                <i className="fa-solid fa-rotate-right text-[17px]" />
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isValidForNext}
            className="ml-1 h-9 shrink-0 rounded-full bg-[#111827] px-4 text-[12px] font-bold text-white active:scale-95 disabled:opacity-40"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-0 pt-0 sm:px-4 sm:pt-4">
        {isFirstEpisode ? (
  <section className="hidden rounded-[22px] bg-white p-3 shadow-sm ring-1 ring-black/5 sm:block">
    <div className="grid grid-cols-3 gap-2">
      <Step number="1" title={isManga ? 'Manga Info' : 'Story Info'} />
      <Step number="2" title={stepTitle} active />
      <Step number="3" title="Publish" />
    </div>
  </section>
) : null}

        {pageLoading ? (
          <section className="mx-4 mt-4 rounded-[12px] bg-white p-6 text-center shadow-sm sm:mx-0">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#111827]" />
            <div className="text-[13px] font-bold text-[#667085]">Loading episode data...</div>
          </section>
        ) : null}

        {message ? (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="mx-4 mt-4 w-[calc(100%-2rem)] rounded-[12px] bg-[#fff1f1] px-4 py-3 text-left text-[12px] font-bold leading-5 text-[#e5484d] sm:mx-0 sm:w-full"
          >
            {message}
          </button>
        ) : null}

        {!pageLoading ? (
  <>
    <div className="overflow-hidden bg-white sm:mt-4 sm:rounded-[12px] sm:shadow-sm md:contents">
      <section className="bg-white px-4 py-3 md:mt-4 md:rounded-[12px] md:shadow-sm">
        <button
          type="button"
          onClick={openEpisodeDetails}
          className="flex min-h-[54px] w-full items-center gap-3 border-b border-[#f0f1f3] text-left active:bg-[#fafafa]"
        >
          <div
            className={`min-w-0 flex-1 truncate text-[14px] font-semibold ${
              episodeTitle ? 'text-[#111827]' : 'text-[#a5aab4]'
            }`}
          >
            {episodeTitle || 'Enter episode title'}
          </div>

          {episodeCover ? (
            <img
              src={episodeCover}
              alt=""
              className="h-9 w-16 shrink-0 rounded-[8px] object-cover"
            />
          ) : null}

          <i className="fa-solid fa-chevron-right shrink-0 text-[11px] text-[#c4c8d1]" />
        </button>
      </section>

            {isManga ? (
              <section className="bg-white p-4 md:mt-4 md:rounded-[12px] md:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-extrabold text-[#111827]">Manga Pages</h2>
                    <p className="mt-1 text-[11px] leading-5 text-[#8d94a1]">
                      Choose up to 30 images each time. Maximum 2 MB per image and 100 pages per episode.
                    </p>
                  </div>
                  <div className="shrink-0 rounded-full bg-[#fff1f1] px-3 py-1.5 text-[11px] font-extrabold text-[#e5484d]">
                    {completedMangaPages.length}/{MANGA_MAX_PAGES}
                  </div>
                </div>

                <ImageDropZone
                  onFiles={handlePickMangaPages}
                  multiple
                  disabled={mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES}
                  className="mt-4 rounded-[20px]"
                  label="Drop manga pages here"
                >
                  <label
                    className={`flex min-h-[120px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#cfd4df] bg-[#fafafe] text-center ${
                      mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES
                        ? 'pointer-events-none opacity-55'
                        : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111827] shadow-sm ring-1 ring-black/5">
                      <i className="fa-solid fa-images text-[17px]" />
                    </div>
                    <div className="mt-3 text-[13px] font-extrabold text-[#111827]">
                      {mangaUploadPending ? 'Uploading pages...' : 'Drop or Add Manga Pages'}
                    </div>
                    <div className="mt-1 text-[11px] text-[#8d94a1]">JPG, PNG, WebP, HEIC or HEIF · Up to 30 each time</div>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      className="hidden"
                      disabled={mangaUploadPending || mangaPages.length >= MANGA_MAX_PAGES}
                      onChange={(event) => {
                        handlePickMangaPages(event.target.files)
                        event.target.value = ''
                      }}
                    />
                  </label>
                </ImageDropZone>

                {mangaPages.length ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {mangaPages.map((page, index) => (
                      <MangaPageCard
                        key={page.id}
                        page={page}
                        index={index}
                        total={mangaPages.length}
                        onMove={handleMoveMangaPage}
                        onDelete={handleDeleteMangaPage}
                        onReplace={handleReplaceMangaPage}
                        onRetry={handleRetryMangaPage}
                        disabled={mangaUploadPending}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[18px] bg-[#fff7df] px-4 py-3 text-[12px] font-bold leading-5 text-[#a56a00]">
                    Drafts may be saved without pages. Add at least {MANGA_MIN_PUBLISH_PAGES} pages before continuing to Publish.
                  </div>
                )}

                {warningText ? (
                  <div className="mt-4 rounded-[16px] bg-[#f3f4f6] px-4 py-3 text-[12px] font-bold leading-5 text-[#667085]">
  {warningText}
</div>
                ) : (
                  <div className="mt-4 rounded-[16px] bg-[#ecfdf3] px-4 py-3 text-[12px] font-bold leading-5 text-[#16803c]">
                    Manga pages are ready. Use the arrows to confirm their reading order.
                  </div>
                )}
              </section>
            ) : (
              <section className="bg-white px-4 pb-4 pt-0 md:mt-4 md:rounded-[12px] md:p-4 md:shadow-sm">
                <div className="hidden items-center gap-2 border-b border-[#f0f1f3] bg-white py-2 md:sticky md:top-[57px] md:z-40 md:-mx-4 md:flex md:px-4">
  <ToolButton
    Icon={Bold}
    label="Bold"
    active={boldActive}
    onClick={() => runEditorCommand('bold')}
  />

  <ToolButton
    Icon={Italic}
    label="Italic"
    active={italicActive}
    onClick={() => runEditorCommand('italic')}
  />

  <ToolButton
    Icon={
      alignmentMode === 'center'
        ? AlignCenter
        : alignmentMode === 'right'
          ? AlignRight
          : AlignLeft
    }
    label={`Align ${alignmentMode}`}
    onClick={handleAlignmentChange}
  />

  <ToolButton
    Icon={ImageIcon}
    label="Insert image"
    disabled={inlineImageUploading}
    onClick={() => {
      saveEditorSelection()
      imageInputRef.current?.click()
    }}
  />

  <ToolButton
  Icon={WandSparkles}
  label="AI Space"
  onClick={() => setCleanModalOpen(true)}
/>

<ToolButton
  Icon={Link}
  label="YouTube video"
  onClick={openYouTubeSheet}
/>

<ToolButton
  Icon={Search}
    label="Find and Replace"
    onClick={() => setFindReplaceOpen(true)}
  />
</div>
                <div
                  ref={editorRef}
                  contentEditable
                  spellCheck={storyLanguage === 'English'}
                  autoCorrect={storyLanguage === 'English' ? 'on' : 'off'}
                  lang={storyLanguage === 'English' ? 'en' : undefined}
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  data-placeholder="Start writing your episode..."
                  onInput={handleEditorInput}
                  onBeforeInput={handleEditorBeforeInput}
                  onPaste={handleEditorPaste}
                  onKeyDown={handleEditorKeyDown}
                  onFocus={() => {
                    setEditorFocused(true)
                    saveEditorSelection()
                  }}
                  onBlur={() => {
                    window.setTimeout(() => {
                      if (
  findReplaceOpen ||
  cleanModalOpen ||
  youtubeSheetOpen ||
  inlineImageUploading
) {
  return
}
                      setEditorFocused(false)
                      setSaveStatus('Saved')
                    }, 220)
                  }}
                  onKeyUp={saveEditorSelection}
                  onMouseUp={saveEditorSelection}
                  onTouchEnd={saveEditorSelection}
                  className="rich-episode-editor min-h-[calc(100dvh-120px)] w-full bg-white px-0 pb-24 pt-3 text-[15px] leading-8 text-[#111827] outline-none md:min-h-[calc(100dvh-170px)] md:rounded-[10px] md:px-4"
                />

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  onChange={(event) => handleInlineImagePick(event.target.files?.[0] || null)}
                />

                {editorFocused ? (
                  <div className="fixed inset-x-0 bottom-0 z-[90] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
                    <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto bg-white px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <ToolButton
  Icon={Bold}
  label="Bold"
  active={boldActive}
  onClick={() => runEditorCommand('bold')}
/>

<ToolButton
  Icon={Italic}
  label="Italic"
  active={italicActive}
  onClick={() => runEditorCommand('italic')}
/>

<ToolButton
  Icon={
    alignmentMode === 'center'
      ? AlignCenter
      : alignmentMode === 'right'
        ? AlignRight
        : AlignLeft
  }
  label={`Align ${alignmentMode}`}
  onClick={handleAlignmentChange}
/>

<ToolButton
  Icon={ImageIcon}
  label="Insert image"
  disabled={inlineImageUploading}
  onClick={() => {
    saveEditorSelection()
    imageInputRef.current?.click()
  }}
/>

<ToolButton
  Icon={WandSparkles}
  label="AI Space"
  onClick={() => setCleanModalOpen(true)}
/>

<ToolButton
  Icon={Link}
  label="YouTube video"
  onClick={openYouTubeSheet}
/>

<ToolButton
  Icon={Search}
  label="Find and Replace"
  onClick={() => setFindReplaceOpen(true)}
/>
                    </div>
                  </div>
                ) : null}
              </section>
            )}
            </div>

          </>
        ) : null}
      </main>
    </div>
  )
}
