const MAX_FILE_BYTES = 12 * 1024 * 1024
const MAX_SIDE = 4096
const MAX_PIXELS = 12_000_000

function imageType(file) {
  const supplied = String(file.type || '').toLowerCase()
  const extension = String(file.name || '').toLowerCase().match(/\.(png|jpe?g|webp)$/)?.[1]
  const inferred = extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : extension ? 'image/jpeg' : ''
  if (supplied && !['image/png', 'image/jpeg', 'image/webp'].includes(supplied)) return ''
  return supplied || inferred
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read this image file.'))
    reader.onabort = () => reject(new Error('Image import was interrupted.'))
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

function measureImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = () => reject(new Error('The selected file is not a readable PNG, JPEG, or WebP image.'))
    image.onload = () => {
      const width = image.naturalWidth
      const height = image.naturalHeight
      image.src = ''
      if (width < 64 || height < 64 || width > MAX_SIDE || height > MAX_SIDE || width * height > MAX_PIXELS) {
        reject(new Error('Image size must be 64–4096 px per side and no more than 12 million pixels.'))
        return
      }
      resolve({ width, height })
    }
    image.src = source
  })
}

export async function readStudioImage(file) {
  if (!file) throw new Error('Choose an image to import.')
  const type = imageType(file)
  if (!type) throw new Error('Choose a PNG, JPEG, or WebP image.')
  if (!file.size || file.size > MAX_FILE_BYTES) {
    throw new Error('Choose an image smaller than 12 MB to protect browser memory.')
  }
  const raw = await readDataUrl(file)
  if (typeof raw !== 'string' || !/^data:[^,]*;base64,/i.test(raw)) {
    throw new Error('Could not decode the image data.')
  }
  const image = `data:${type};base64,${raw.slice(raw.indexOf(',') + 1)}`
  const { width, height } = await measureImage(image)
  const name = String(file.name || 'Imported Image')
    .replace(/\.(?:png|jpe?g|webp)$/i, '')
    .trim()
    .slice(0, 80) || 'Imported Image'
  return { name, width, height, resolution: 144, background: '#FFFFFF', presetId: 'imported', image }
}
