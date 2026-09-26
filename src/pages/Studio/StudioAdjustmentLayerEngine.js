const COLOR = /^#[0-9a-f]{6}$/i
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const byte = (value) => Math.round(clamp(value, 0, 255))
const percent = (value) => clamp(Number(value) || 0, -100, 100)
const unitPercent = (value) => clamp(Number(value) || 0, 0, 100)

const DEFINITIONS = Object.freeze({
  'color-vibrance': { vibrance: 0, saturation: 0 },
  'brightness-contrast': { brightness: 0, contrast: 0 },
  levels: { inputBlack: 0, gamma: 1, inputWhite: 255, outputBlack: 0, outputWhite: 255 },
  curves: { points: [[0, 0], [64, 64], [128, 128], [192, 192], [255, 255]] },
  exposure: { exposure: 0, offset: 0, gamma: 1 },
  vibrance: { vibrance: 0, saturation: 0 },
  'hue-saturation': { hue: 0, saturation: 0, lightness: 0 },
  'color-balance': {
    shadows: { r: 0, g: 0, b: 0 },
    midtones: { r: 0, g: 0, b: 0 },
    highlights: { r: 0, g: 0, b: 0 },
    preserveLuminosity: true,
  },
  'black-white': {
    red: 40, yellow: 60, green: 40, cyan: 60, blue: 20, magenta: 80,
    tint: false, tintColor: '#D8C7A6', tintStrength: 25,
  },
  'photo-filter': { color: '#EC8A35', density: 25, preserveLuminosity: true },
  'channel-mixer': {
    monochrome: false,
    red: { r: 100, g: 0, b: 0, constant: 0 },
    green: { r: 0, g: 100, b: 0, constant: 0 },
    blue: { r: 0, g: 0, b: 100, constant: 0 },
  },
  'color-lookup': { preset: 'neutral', intensity: 100 },
  'selective-color': { target: 'reds', cyan: 0, magenta: 0, yellow: 0, black: 0 },
  invert: {},
  posterize: { levels: 4 },
  threshold: { level: 128 },
  'gradient-map': { startColor: '#000000', endColor: '#FFFFFF', reverse: false },
  'solid-color': { color: '#FFFFFF' },
  gradient: { startColor: '#000000', endColor: '#FFFFFF', angle: 90 },
  pattern: { color: '#FFFFFF', secondColor: '#808080', size: 16, style: 'checker' },
})

const LABELS = Object.freeze({
  'color-vibrance': 'Color and vibrance',
  'brightness-contrast': 'Brightness/Contrast',
  levels: 'Levels',
  curves: 'Curves',
  exposure: 'Exposure',
  vibrance: 'Vibrance',
  'hue-saturation': 'Hue/Saturation',
  'color-balance': 'Color Balance',
  'black-white': 'Black & White',
  'photo-filter': 'Photo Filter',
  'channel-mixer': 'Channel Mixer',
  'color-lookup': 'Color Lookup',
  'selective-color': 'Selective Color',
  invert: 'Invert',
  posterize: 'Posterize',
  threshold: 'Threshold',
  'gradient-map': 'Gradient Map',
  'solid-color': 'Solid Color',
  gradient: 'Gradient',
  pattern: 'Pattern',
})

export const STUDIO_ADJUSTMENT_LAYER_TYPES = Object.freeze(Object.keys(DEFINITIONS))

function clone(value) {
  if (Array.isArray(value)) return value.map(clone)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]))
  return value
}

function validType(type) {
  if (!STUDIO_ADJUSTMENT_LAYER_TYPES.includes(type)) throw new Error('Unsupported adjustment layer type.')
  return type
}

function validColor(value, fallback) {
  return COLOR.test(String(value || '')) ? String(value).toUpperCase() : fallback
}

function numeric(value, fallback, min, max) {
  return Number.isFinite(Number(value)) ? clamp(Number(value), min, max) : fallback
}

function normalizeRgbTriplet(value, fallback) {
  return {
    r: numeric(value?.r, fallback.r, -100, 100),
    g: numeric(value?.g, fallback.g, -100, 100),
    b: numeric(value?.b, fallback.b, -100, 100),
  }
}

function normalizeMixer(value, fallback) {
  return {
    r: numeric(value?.r, fallback.r, -200, 200),
    g: numeric(value?.g, fallback.g, -200, 200),
    b: numeric(value?.b, fallback.b, -200, 200),
    constant: numeric(value?.constant, fallback.constant, -200, 200),
  }
}

function normalizePoints(points) {
  if (!Array.isArray(points) || points.length < 2 || points.length > 16) return clone(DEFINITIONS.curves.points)
  const normalized = points.map((point) => [
    numeric(point?.[0], 0, 0, 255),
    numeric(point?.[1], 0, 0, 255),
  ]).sort((a, b) => a[0] - b[0])
  const unique = []
  for (const point of normalized) {
    if (unique.length && unique[unique.length - 1][0] === point[0]) unique[unique.length - 1] = point
    else unique.push(point)
  }
  if (unique.length < 2) return clone(DEFINITIONS.curves.points)
  if (unique[0][0] !== 0) unique.unshift([0, unique[0][1]])
  if (unique[unique.length - 1][0] !== 255) unique.push([255, unique[unique.length - 1][1]])
  return unique
}

export function createStudioAdjustment(type) {
  const safeType = validType(type)
  return {
    type: safeType,
    enabled: true,
    settings: clone(DEFINITIONS[safeType]),
  }
}

export function normalizeStudioAdjustment(input) {
  const type = validType(input?.type)
  const defaults = DEFINITIONS[type]
  const source = input?.settings && typeof input.settings === 'object' ? input.settings : {}
  let settings

  if (type === 'color-vibrance' || type === 'vibrance') {
    settings = {
      vibrance: percent(source.vibrance),
      saturation: percent(source.saturation),
    }
  } else if (type === 'brightness-contrast') {
    settings = {
      brightness: percent(source.brightness),
      contrast: percent(source.contrast),
    }
  } else if (type === 'levels') {
    let inputBlack = numeric(source.inputBlack, defaults.inputBlack, 0, 254)
    let inputWhite = numeric(source.inputWhite, defaults.inputWhite, 1, 255)
    if (inputWhite <= inputBlack) inputWhite = Math.min(255, inputBlack + 1)
    settings = {
      inputBlack,
      gamma: numeric(source.gamma, defaults.gamma, 0.1, 9.99),
      inputWhite,
      outputBlack: numeric(source.outputBlack, defaults.outputBlack, 0, 255),
      outputWhite: numeric(source.outputWhite, defaults.outputWhite, 0, 255),
    }
  } else if (type === 'curves') {
    settings = { points: normalizePoints(source.points) }
  } else if (type === 'exposure') {
    settings = {
      exposure: numeric(source.exposure, defaults.exposure, -5, 5),
      offset: numeric(source.offset, defaults.offset, -0.5, 0.5),
      gamma: numeric(source.gamma, defaults.gamma, 0.1, 9.99),
    }
  } else if (type === 'hue-saturation') {
    settings = {
      hue: numeric(source.hue, defaults.hue, -180, 180),
      saturation: percent(source.saturation),
      lightness: percent(source.lightness),
    }
  } else if (type === 'color-balance') {
    settings = {
      shadows: normalizeRgbTriplet(source.shadows, defaults.shadows),
      midtones: normalizeRgbTriplet(source.midtones, defaults.midtones),
      highlights: normalizeRgbTriplet(source.highlights, defaults.highlights),
      preserveLuminosity: source.preserveLuminosity !== false,
    }
  } else if (type === 'black-white') {
    settings = {
      red: numeric(source.red, defaults.red, -200, 300),
      yellow: numeric(source.yellow, defaults.yellow, -200, 300),
      green: numeric(source.green, defaults.green, -200, 300),
      cyan: numeric(source.cyan, defaults.cyan, -200, 300),
      blue: numeric(source.blue, defaults.blue, -200, 300),
      magenta: numeric(source.magenta, defaults.magenta, -200, 300),
      tint: source.tint === true,
      tintColor: validColor(source.tintColor, defaults.tintColor),
      tintStrength: unitPercent(source.tintStrength ?? defaults.tintStrength),
    }
  } else if (type === 'photo-filter') {
    settings = {
      color: validColor(source.color, defaults.color),
      density: unitPercent(source.density ?? defaults.density),
      preserveLuminosity: source.preserveLuminosity !== false,
    }
  } else if (type === 'channel-mixer') {
    settings = {
      monochrome: source.monochrome === true,
      red: normalizeMixer(source.red, defaults.red),
      green: normalizeMixer(source.green, defaults.green),
      blue: normalizeMixer(source.blue, defaults.blue),
    }
  } else if (type === 'color-lookup') {
    const presets = ['neutral', 'warm', 'cool', 'cinematic', 'teal-orange', 'faded', 'high-contrast']
    settings = {
      preset: presets.includes(source.preset) ? source.preset : defaults.preset,
      intensity: unitPercent(source.intensity ?? defaults.intensity),
    }
  } else if (type === 'selective-color') {
    const targets = ['reds', 'yellows', 'greens', 'cyans', 'blues', 'magentas', 'whites', 'neutrals', 'blacks']
    settings = {
      target: targets.includes(source.target) ? source.target : defaults.target,
      cyan: percent(source.cyan),
      magenta: percent(source.magenta),
      yellow: percent(source.yellow),
      black: percent(source.black),
    }
  } else if (type === 'posterize') {
    settings = { levels: Math.round(numeric(source.levels, defaults.levels, 2, 255)) }
  } else if (type === 'threshold') {
    settings = { level: Math.round(numeric(source.level, defaults.level, 0, 255)) }
  } else if (type === 'gradient-map') {
    settings = {
      startColor: validColor(source.startColor, defaults.startColor),
      endColor: validColor(source.endColor, defaults.endColor),
      reverse: source.reverse === true,
    }
  } else if (type === 'solid-color') {
    settings = { color: validColor(source.color, defaults.color) }
  } else if (type === 'gradient') {
    settings = {
      startColor: validColor(source.startColor, defaults.startColor),
      endColor: validColor(source.endColor, defaults.endColor),
      angle: numeric(source.angle, defaults.angle, -180, 180),
    }
  } else if (type === 'pattern') {
    const styles = ['checker', 'dots', 'lines']
    settings = {
      color: validColor(source.color, defaults.color),
      secondColor: validColor(source.secondColor, defaults.secondColor),
      size: Math.round(numeric(source.size, defaults.size, 2, 128)),
      style: styles.includes(source.style) ? source.style : defaults.style,
    }
  } else {
    settings = {}
  }

  return {
    type,
    enabled: input?.enabled !== false,
    settings,
  }
}

export function studioAdjustmentLabel(type) {
  return LABELS[validType(type)]
}

export function isStudioAdjustmentLayer(layer) {
  if (!layer?.adjustment || typeof layer.adjustment !== 'object') return false
  try {
    normalizeStudioAdjustment(layer.adjustment)
    return true
  } catch {
    return false
  }
}

function hexRgb(hex) {
  const value = validColor(hex, '#000000').slice(1)
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ]
}

function mix(a, b, amount) {
  return a + (b - a) * clamp(amount, 0, 1)
}

function luminance(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  const delta = max - min
  if (delta) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s, l]
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360
  s = clamp(s, 0, 1)
  l = clamp(l, 0, 1)
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g] = [c, x]
  else if (h < 120) [r, g] = [x, c]
  else if (h < 180) [g, b] = [c, x]
  else if (h < 240) [g, b] = [x, c]
  else if (h < 300) [r, b] = [x, c]
  else [r, b] = [c, x]
  return [byte((r + m) * 255), byte((g + m) * 255), byte((b + m) * 255)]
}

function curveLut(points) {
  const lut = new Uint8ClampedArray(256)
  let segment = 0
  for (let x = 0; x < 256; x += 1) {
    while (segment < points.length - 2 && x > points[segment + 1][0]) segment += 1
    const [x1, y1] = points[segment]
    const [x2, y2] = points[Math.min(segment + 1, points.length - 1)]
    const span = Math.max(1, x2 - x1)
    lut[x] = byte(mix(y1, y2, (x - x1) / span))
  }
  return lut
}

function hueFamily(h) {
  if (h < 15 || h >= 345) return 'reds'
  if (h < 75) return 'yellows'
  if (h < 165) return 'greens'
  if (h < 195) return 'cyans'
  if (h < 285) return 'blues'
  return 'magentas'
}

function selectiveMatch(target, r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b)
  if (target === 'whites') return l > 0.78 ? clamp((l - 0.78) / 0.22, 0, 1) : 0
  if (target === 'blacks') return l < 0.22 ? clamp((0.22 - l) / 0.22, 0, 1) : 0
  if (target === 'neutrals') return 1 - clamp(Math.abs(l - 0.5) * 3.4 + s * 0.35, 0, 1)
  return hueFamily(h) === target ? clamp(s * 1.3, 0, 1) : 0
}

function blackWhiteWeight(r, g, b, settings) {
  const [h] = rgbToHsl(r, g, b)
  const family = hueFamily(h)
  const weight = {
    reds: settings.red,
    yellows: settings.yellow,
    greens: settings.green,
    cyans: settings.cyan,
    blues: settings.blue,
    magentas: settings.magenta,
  }[family] ?? 100
  return byte(luminance(r, g, b) * weight / 100)
}

function applyLookup(r, g, b, preset, intensity) {
  let target = [r, g, b]
  if (preset === 'warm') target = [r * 1.08 + 8, g * 1.02 + 2, b * 0.9]
  else if (preset === 'cool') target = [r * 0.93, g * 1.01 + 2, b * 1.1 + 5]
  else if (preset === 'cinematic') target = [r * 1.04 + 4, g * 0.98, b * 1.05 + 2]
  else if (preset === 'teal-orange') {
    const l = luminance(r, g, b) / 255
    target = l > 0.5 ? [r * 1.12 + 8, g * 1.02, b * 0.88] : [r * 0.88, g * 1.08 + 4, b * 1.12 + 8]
  } else if (preset === 'faded') {
    target = [r * 0.82 + 24, g * 0.82 + 24, b * 0.82 + 26]
  } else if (preset === 'high-contrast') {
    const factor = 1.28
    target = [(r - 128) * factor + 128, (g - 128) * factor + 128, (b - 128) * factor + 128]
  }
  const t = intensity / 100
  return [byte(mix(r, target[0], t)), byte(mix(g, target[1], t)), byte(mix(b, target[2], t))]
}

function applyPixelAdjustment(data, adjustment) {
  const { type, settings } = adjustment
  const curve = type === 'curves' ? curveLut(settings.points) : null
  const filterRgb = type === 'photo-filter' ? hexRgb(settings.color) : null
  const tintRgb = type === 'black-white' ? hexRgb(settings.tintColor) : null
  const gradientStart = type === 'gradient-map' ? hexRgb(settings.startColor) : null
  const gradientEnd = type === 'gradient-map' ? hexRgb(settings.endColor) : null

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    let r = data[i]
    let g = data[i + 1]
    let b = data[i + 2]

    if (type === 'brightness-contrast') {
      const bright = settings.brightness * 2.55
      const factor = (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast))
      r = factor * (r - 128) + 128 + bright
      g = factor * (g - 128) + 128 + bright
      b = factor * (b - 128) + 128 + bright
    } else if (type === 'levels') {
      const span = Math.max(1, settings.inputWhite - settings.inputBlack)
      const convert = (value) => {
        const normalized = clamp((value - settings.inputBlack) / span, 0, 1)
        const gamma = Math.pow(normalized, 1 / settings.gamma)
        return mix(settings.outputBlack, settings.outputWhite, gamma)
      }
      r = convert(r)
      g = convert(g)
      b = convert(b)
    } else if (type === 'curves') {
      r = curve[byte(r)]
      g = curve[byte(g)]
      b = curve[byte(b)]
    } else if (type === 'exposure') {
      const multiplier = 2 ** settings.exposure
      const convert = (value) => 255 * Math.pow(clamp(value / 255 * multiplier + settings.offset, 0, 1), 1 / settings.gamma)
      r = convert(r)
      g = convert(g)
      b = convert(b)
    } else if (type === 'hue-saturation') {
      let [h, s, l] = rgbToHsl(r, g, b)
      h += settings.hue
      s = clamp(s * (1 + settings.saturation / 100), 0, 1)
      l = clamp(l + settings.lightness / 100, 0, 1)
      ;[r, g, b] = hslToRgb(h, s, l)
    } else if (type === 'vibrance' || type === 'color-vibrance') {
      let [h, s, l] = rgbToHsl(r, g, b)
      const vibranceBoost = settings.vibrance >= 0
        ? (settings.vibrance / 100) * (1 - s) * 0.85
        : (settings.vibrance / 100) * s
      s = clamp(s + vibranceBoost + settings.saturation / 100 * s, 0, 1)
      ;[r, g, b] = hslToRgb(h, s, l)
    } else if (type === 'color-balance') {
      const originalLum = luminance(r, g, b)
      const l = originalLum / 255
      const shadow = clamp((0.55 - l) / 0.55, 0, 1)
      const highlight = clamp((l - 0.45) / 0.55, 0, 1)
      const mid = clamp(1 - Math.abs(l - 0.5) * 2, 0, 1)
      r += (settings.shadows.r * shadow + settings.midtones.r * mid + settings.highlights.r * highlight) * 1.2
      g += (settings.shadows.g * shadow + settings.midtones.g * mid + settings.highlights.g * highlight) * 1.2
      b += (settings.shadows.b * shadow + settings.midtones.b * mid + settings.highlights.b * highlight) * 1.2
      if (settings.preserveLuminosity) {
        const nextLum = Math.max(1, luminance(r, g, b))
        const ratio = originalLum / nextLum
        r *= ratio
        g *= ratio
        b *= ratio
      }
    } else if (type === 'black-white') {
      const gray = blackWhiteWeight(r, g, b, settings)
      r = gray
      g = gray
      b = gray
      if (settings.tint) {
        const strength = settings.tintStrength / 100
        r = mix(r, tintRgb[0], strength)
        g = mix(g, tintRgb[1], strength)
        b = mix(b, tintRgb[2], strength)
      }
    } else if (type === 'photo-filter') {
      const before = luminance(r, g, b)
      const t = settings.density / 100
      r = mix(r, filterRgb[0], t)
      g = mix(g, filterRgb[1], t)
      b = mix(b, filterRgb[2], t)
      if (settings.preserveLuminosity) {
        const after = Math.max(1, luminance(r, g, b))
        const ratio = before / after
        r *= ratio
        g *= ratio
        b *= ratio
      }
    } else if (type === 'channel-mixer') {
      const sourceR = r
      const sourceG = g
      const sourceB = b
      const channel = (mixSettings) => sourceR * mixSettings.r / 100 + sourceG * mixSettings.g / 100 + sourceB * mixSettings.b / 100 + 255 * mixSettings.constant / 100
      if (settings.monochrome) {
        const gray = channel(settings.red)
        r = gray
        g = gray
        b = gray
      } else {
        r = channel(settings.red)
        g = channel(settings.green)
        b = channel(settings.blue)
      }
    } else if (type === 'color-lookup') {
      ;[r, g, b] = applyLookup(r, g, b, settings.preset, settings.intensity)
    } else if (type === 'selective-color') {
      const match = selectiveMatch(settings.target, r, g, b)
      if (match > 0) {
        const cyan = settings.cyan / 100 * 255 * match
        const magenta = settings.magenta / 100 * 255 * match
        const yellow = settings.yellow / 100 * 255 * match
        const black = settings.black / 100 * 255 * match
        r -= cyan + black
        g -= magenta + black
        b -= yellow + black
      }
    } else if (type === 'invert') {
      r = 255 - r
      g = 255 - g
      b = 255 - b
    } else if (type === 'posterize') {
      const step = 255 / Math.max(1, settings.levels - 1)
      r = Math.round(r / step) * step
      g = Math.round(g / step) * step
      b = Math.round(b / step) * step
    } else if (type === 'threshold') {
      const value = luminance(r, g, b) >= settings.level ? 255 : 0
      r = value
      g = value
      b = value
    } else if (type === 'gradient-map') {
      let value = luminance(r, g, b) / 255
      if (settings.reverse) value = 1 - value
      r = mix(gradientStart[0], gradientEnd[0], value)
      g = mix(gradientStart[1], gradientEnd[1], value)
      b = mix(gradientStart[2], gradientEnd[2], value)
    }

    data[i] = byte(r)
    data[i + 1] = byte(g)
    data[i + 2] = byte(b)
  }
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Could not create adjustment layer canvas.')
  return { canvas, context }
}

function drawGradient(context, width, height, settings) {
  const radians = settings.angle * Math.PI / 180
  const cx = width / 2
  const cy = height / 2
  const length = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians))
  const dx = Math.cos(radians) * length / 2
  const dy = Math.sin(radians) * length / 2
  const gradient = context.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
  gradient.addColorStop(0, settings.startColor)
  gradient.addColorStop(1, settings.endColor)
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)
}

function drawPattern(context, width, height, settings) {
  const size = settings.size
  const tile = document.createElement('canvas')
  tile.width = size
  tile.height = size
  const tileContext = tile.getContext('2d')
  if (!tileContext) throw new Error('Could not create pattern.')
  tileContext.fillStyle = settings.color
  tileContext.fillRect(0, 0, size, size)
  tileContext.fillStyle = settings.secondColor

  if (settings.style === 'dots') {
    tileContext.beginPath()
    tileContext.arc(size / 2, size / 2, Math.max(1, size * 0.22), 0, Math.PI * 2)
    tileContext.fill()
  } else if (settings.style === 'lines') {
    tileContext.fillRect(0, 0, Math.max(1, Math.round(size * 0.25)), size)
  } else {
    const half = Math.max(1, Math.ceil(size / 2))
    tileContext.fillRect(0, 0, half, half)
    tileContext.fillRect(half, half, size - half, size - half)
  }

  const pattern = context.createPattern(tile, 'repeat')
  if (!pattern) throw new Error('Could not create pattern.')
  context.fillStyle = pattern
  context.fillRect(0, 0, width, height)
}

export function renderStudioAdjustmentCanvas(sourceCanvas, rawAdjustment, options = {}) {
  if (!sourceCanvas || !Number.isInteger(sourceCanvas.width) || !Number.isInteger(sourceCanvas.height) || sourceCanvas.width < 1 || sourceCanvas.height < 1) {
    throw new Error('A valid source canvas is required.')
  }

  const adjustment = normalizeStudioAdjustment(rawAdjustment)
  const maximum = Number.isFinite(options.maxDimension)
    ? clamp(Math.floor(options.maxDimension), 16, 4096)
    : Math.max(sourceCanvas.width, sourceCanvas.height)
  const scale = Math.min(1, maximum / Math.max(sourceCanvas.width, sourceCanvas.height))
  const width = Math.max(1, Math.round(sourceCanvas.width * scale))
  const height = Math.max(1, Math.round(sourceCanvas.height * scale))
  const { canvas, context } = createCanvas(width, height)

  if (!adjustment.enabled) {
    context.drawImage(sourceCanvas, 0, 0, width, height)
    return canvas
  }

  if (adjustment.type === 'solid-color') {
    context.fillStyle = adjustment.settings.color
    context.fillRect(0, 0, width, height)
    return canvas
  }

  if (adjustment.type === 'gradient') {
    drawGradient(context, width, height, adjustment.settings)
    return canvas
  }

  if (adjustment.type === 'pattern') {
    drawPattern(context, width, height, adjustment.settings)
    return canvas
  }

  context.drawImage(sourceCanvas, 0, 0, width, height)
  const imageData = context.getImageData(0, 0, width, height)
  applyPixelAdjustment(imageData.data, adjustment)
  context.putImageData(imageData, 0, 0)
  return canvas
}

export function applyStudioAdjustmentToCanvas(sourceCanvas, targetCanvas, rawAdjustment) {
  if (!targetCanvas || targetCanvas.width !== sourceCanvas?.width || targetCanvas.height !== sourceCanvas?.height) {
    throw new Error('Adjustment source and target canvas sizes must match.')
  }
  const rendered = renderStudioAdjustmentCanvas(sourceCanvas, rawAdjustment)
  const context = targetCanvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Adjustment target canvas is unavailable.')
  context.save()
  try {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'
    context.clearRect(0, 0, targetCanvas.width, targetCanvas.height)
    context.drawImage(rendered, 0, 0, targetCanvas.width, targetCanvas.height)
  } finally {
    context.restore()
  }
  return targetCanvas
}
