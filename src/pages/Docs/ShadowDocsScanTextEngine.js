const LANGUAGES = new Set(['eng', 'khm', 'eng+khm'])
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const OCR_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'

let libraryPromise = null

function loadOCRLibrary() {
  if (globalThis.Tesseract?.createWorker) return Promise.resolve(globalThis.Tesseract)
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('OCR requires a browser.'))
  }

  if (!libraryPromise) {
    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = OCR_SCRIPT_URL
      script.async = true
      script.onload = () => {
        if (globalThis.Tesseract?.createWorker) {
          resolve(globalThis.Tesseract)
        } else {
          script.remove()
          reject(new Error('OCR library did not initialize.'))
        }
      }
      script.onerror = () => {
        script.remove()
        reject(new Error('Could not load OCR. Check your internet connection.'))
      }
      document.head.appendChild(script)
    }).catch(error => {
      libraryPromise = null
      throw error
    })
  }

  return libraryPromise
}

export async function recognizeShadowDocsImage(file, language = 'eng+khm', onProgress) {
  if (!file || !IMAGE_TYPES.has(file.type) || !Number.isFinite(file.size) || file.size < 1 || file.size > 6_000_000) {
    throw new Error('Choose a PNG, JPG or WebP image under 6 MB.')
  }

  const selectedLanguage = LANGUAGES.has(language) ? language : 'eng+khm'
  const library = await loadOCRLibrary()
  let worker = null

  try {
    worker = await library.createWorker(selectedLanguage, 1, {
      logger: event => {
        const status = String(event?.status || '')
        const value = Number(event?.progress)
        const progress = Number.isFinite(value) ? Math.round(Math.max(0, Math.min(1, value)) * 100) : 0
        if (typeof onProgress === 'function') onProgress({ status, progress })
      },
    })

    const result = await worker.recognize(file)
    const text = String(result?.data?.text || '').replace(/\r\n?/g, '\n').trim().slice(0, 20000)

    if (!text) throw new Error('No readable text found. Try a clearer, well-lit image.')
    return text
  } finally {
    if (worker) await worker.terminate()
  }
}
