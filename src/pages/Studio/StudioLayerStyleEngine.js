const EFFECTS = [
  ['bevelEmboss', 'Bevel & Emboss'],
  ['contour', 'Contour'],
  ['texture', 'Texture'],
  ['stroke', 'Stroke'],
  ['innerShadow', 'Inner Shadow'],
  ['innerGlow', 'Inner Glow'],
  ['satin', 'Satin'],
  ['colorOverlay', 'Color Overlay'],
  ['gradientOverlay', 'Gradient Overlay'],
  ['patternOverlay', 'Pattern Overlay'],
  ['outerGlow', 'Outer Glow'],
  ['dropShadow', 'Drop Shadow'],
]

export const STUDIO_LAYER_STYLE_EFFECTS = Object.freeze(EFFECTS.map(([id, label]) => ({ id, label })))

const DEFAULT_EFFECTS = {
  bevelEmboss: { enabled: false, size: 5, depth: 60, angle: 120, opacity: 75, color: '#FFFFFF', shadowColor: '#303030' },
  contour: { enabled: false, amount: 65 },
  texture: { enabled: false, size: 14, amount: 35 },
  stroke: { enabled: false, size: 4, position: 'outside', color: '#111111', opacity: 100 },
  innerShadow: { enabled: false, size: 9, distance: 5, angle: 120, color: '#111111', opacity: 55 },
  innerGlow: { enabled: false, size: 12, color: '#FFFFFF', opacity: 60 },
  satin: { enabled: false, size: 9, distance: 5, angle: 45, color: '#171717', opacity: 35 },
  colorOverlay: { enabled: false, color: '#6C9BFF', opacity: 100 },
  gradientOverlay: { enabled: false, color: '#FFFFFF', secondColor: '#4676BE', angle: 90, opacity: 100 },
  patternOverlay: { enabled: false, color: '#FFFFFF', secondColor: '#808080', size: 12, opacity: 70 },
  outerGlow: { enabled: false, size: 12, color: '#FFF3AC', opacity: 70 },
  dropShadow: { enabled: false, size: 12, distance: 8, angle: 120, color: '#111111', opacity: 60 },
}

const MODES = new Set(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'soft-light', 'hard-light', 'color-dodge', 'color-burn', 'difference', 'exclusion'])
const COLOR = /^#[0-9a-f]{6}$/i
const clip = (number, min, max) => Math.max(min, Math.min(max, number))

export function createStudioLayerStyle() {
  return {
    blendMode: 'normal',
    opacity: 100,
    fillOpacity: 100,
    channels: { r: true, g: true, b: true },
    effects: Object.fromEntries(Object.entries(DEFAULT_EFFECTS).map(([name, settings]) => [name, { ...settings }])),
  }
}

export function normalizeStudioLayerStyle(input = {}) {
  const style = createStudioLayerStyle()
  if (!input || typeof input !== 'object') return style
  style.blendMode = MODES.has(input.blendMode) ? input.blendMode : style.blendMode
  for (const key of ['opacity', 'fillOpacity']) {
    if (Number.isFinite(input[key])) style[key] = clip(input[key], 0, 100)
  }
  for (const key of ['r', 'g', 'b']) {
    if (typeof input.channels?.[key] === 'boolean') style.channels[key] = input.channels[key]
  }
  for (const [name, defaults] of Object.entries(DEFAULT_EFFECTS)) {
    const settings = input.effects?.[name]
    if (!settings || typeof settings !== 'object') continue
    for (const [key, initial] of Object.entries(defaults)) {
      const value = settings[key]
      if (key === 'enabled') style.effects[name].enabled = value === true
      else if (key === 'position') style.effects[name].position = ['outside', 'inside', 'center'].includes(value) ? value : initial
      else if (key.toLowerCase().includes('color')) style.effects[name][key] = COLOR.test(value) ? value : initial
      else if (typeof initial === 'number' && Number.isFinite(value)) {
        const range = key === 'angle' ? [-180, 180] : key === 'size' ? [1, 128] : key === 'distance' ? [0, 128] : [0, 100]
        style.effects[name][key] = clip(value, ...range)
      }
    }
  }
  return style
}

function newCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable.')
  return { canvas, context }
}

function tinted(source, color) {
  const { canvas, context } = newCanvas(source.width, source.height)
  context.drawImage(source, 0, 0)
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

function composite(target, layer, opacity = 100) {
  if (!layer || opacity <= 0) return
  target.save()
  target.globalAlpha = clip(opacity, 0, 100) / 100
  target.drawImage(layer, 0, 0)
  target.restore()
}

function shadow(source, color, size, distance, angle, scale) {
  const { canvas, context } = newCanvas(source.width, source.height)
  const radians = angle * Math.PI / 180
  const offset = distance * scale
  context.shadowColor = color
  context.shadowBlur = size * scale
  context.shadowOffsetX = Math.cos(radians) * offset
  context.shadowOffsetY = Math.sin(radians) * offset
  context.drawImage(source, 0, 0)
  context.shadowColor = 'transparent'
  context.shadowBlur = 0
  context.shadowOffsetX = 0
  context.shadowOffsetY = 0
  context.globalCompositeOperation = 'destination-out'
  context.drawImage(source, 0, 0)
  return canvas
}

function insideShadow(source, color, size, distance, angle, scale) {
  const { canvas: inverse, context: inverseContext } = newCanvas(source.width, source.height)
  inverseContext.fillStyle = '#FFFFFF'
  inverseContext.fillRect(0, 0, inverse.width, inverse.height)
  inverseContext.globalCompositeOperation = 'destination-out'
  inverseContext.drawImage(source, 0, 0)
  const { canvas, context } = newCanvas(source.width, source.height)
  const radians = angle * Math.PI / 180
  context.shadowColor = color
  context.shadowBlur = size * scale
  context.shadowOffsetX = Math.cos(radians) * distance * scale
  context.shadowOffsetY = Math.sin(radians) * distance * scale
  context.drawImage(inverse, 0, 0)
  context.shadowColor = 'transparent'
  context.shadowBlur = 0
  context.shadowOffsetX = 0
  context.shadowOffsetY = 0
  context.globalCompositeOperation = 'destination-in'
  context.drawImage(source, 0, 0)
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = color
  context.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

function stroke(source, settings, scale) {
  const radius = Math.max(0.5, settings.size * scale * (settings.position === 'center' ? 0.5 : 1))
  const { canvas, context } = newCanvas(source.width, source.height)
  const steps = Math.max(16, Math.min(64, Math.ceil(radius * 4)))
  if (settings.position === 'inside') {
    const { canvas: interior, context: interiorContext } = newCanvas(source.width, source.height)
    interiorContext.drawImage(source, 0, 0)
    interiorContext.globalCompositeOperation = 'destination-in'
    for (let step = 0; step < steps; step += 1) {
      const angle = step * Math.PI * 2 / steps
      interiorContext.drawImage(source, Math.cos(angle) * radius, Math.sin(angle) * radius)
    }
    context.drawImage(source, 0, 0)
    context.globalCompositeOperation = 'destination-out'
    context.drawImage(interior, 0, 0)
  } else {
    for (let step = 0; step < steps; step += 1) {
      const angle = step * Math.PI * 2 / steps
      context.drawImage(source, Math.cos(angle) * radius, Math.sin(angle) * radius)
    }
    context.globalCompositeOperation = 'destination-out'
    context.drawImage(source, 0, 0)
  }
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = settings.color
  context.fillRect(0, 0, canvas.width, canvas.height)
  if (settings.position === 'center') {
    context.globalCompositeOperation = 'source-over'
    context.drawImage(stroke(source, { ...settings, position: 'inside', size: settings.size / 2 }, scale), 0, 0)
  }
  return canvas
}

function gradient(source, settings) {
  const { canvas, context } = newCanvas(source.width, source.height)
  const radians = settings.angle * Math.PI / 180
  const span = (Math.abs(Math.cos(radians)) * canvas.width + Math.abs(Math.sin(radians)) * canvas.height) / 2
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const fill = context.createLinearGradient(cx - span * Math.cos(radians), cy - span * Math.sin(radians), cx + span * Math.cos(radians), cy + span * Math.sin(radians))
  fill.addColorStop(0, settings.color)
  fill.addColorStop(1, settings.secondColor)
  context.drawImage(source, 0, 0)
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = fill
  context.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

function pattern(source, settings, scale) {
  const period = Math.max(2, Math.round(settings.size * scale))
  const { canvas: tile, context: tileContext } = newCanvas(period, period)
  tileContext.fillStyle = settings.color
  tileContext.fillRect(0, 0, period, period)
  tileContext.fillStyle = settings.secondColor
  tileContext.fillRect(0, 0, Math.max(1, period / 4), Math.max(1, period / 4))
  tileContext.fillRect(period / 2, period / 2, Math.max(1, period / 4), Math.max(1, period / 4))
  const { canvas, context } = newCanvas(source.width, source.height)
  context.drawImage(source, 0, 0)
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = context.createPattern(tile, 'repeat')
  context.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

function texture(source, settings, scale) {
  const period = Math.max(2, Math.round(settings.size * scale))
  const { canvas, context } = newCanvas(source.width, source.height)
  context.drawImage(source, 0, 0)
  context.globalCompositeOperation = 'source-in'
  const { canvas: tile, context: tileContext } = newCanvas(period, period)
  tileContext.fillStyle = '#FFFFFF'
  tileContext.fillRect(0, 0, period, period)
  tileContext.fillStyle = '#666666'
  tileContext.fillRect(0, 0, Math.max(1, period / 3), Math.max(1, period / 3))
  tileContext.fillRect(period / 2, period / 2, Math.max(1, period / 3), Math.max(1, period / 3))
  context.fillStyle = context.createPattern(tile, 'repeat')
  context.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

function sourceWithChannels(source, channels) {
  if (channels.r && channels.g && channels.b) return source
  const { canvas, context } = newCanvas(source.width, source.height)
  context.drawImage(source, 0, 0)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  for (let index = 0; index < pixels.data.length; index += 4) {
    if (!channels.r) pixels.data[index] = 0
    if (!channels.g) pixels.data[index + 1] = 0
    if (!channels.b) pixels.data[index + 2] = 0
  }
  context.putImageData(pixels, 0, 0)
  return canvas
}

export function renderStudioStyledLayer(sourceCanvas, rawStyle, options = {}) {
  if (!sourceCanvas || !Number.isInteger(sourceCanvas.width) || !Number.isInteger(sourceCanvas.height) || sourceCanvas.width < 1 || sourceCanvas.height < 1) throw new Error('A valid source layer is required.')
  const style = normalizeStudioLayerStyle(rawStyle)
  const maximum = Number.isFinite(options.maxDimension) ? clip(Math.floor(options.maxDimension), 16, 4096) : Math.max(sourceCanvas.width, sourceCanvas.height)
  const scale = Math.min(1, maximum / Math.max(sourceCanvas.width, sourceCanvas.height))
  const width = Math.max(1, Math.round(sourceCanvas.width * scale))
  const height = Math.max(1, Math.round(sourceCanvas.height * scale))
  const { canvas: source, context: sourceContext } = newCanvas(width, height)
  sourceContext.drawImage(sourceCanvas, 0, 0, width, height)
  const { canvas: content, context: contentContext } = newCanvas(width, height)
  const { canvas: output, context } = newCanvas(width, height)
  const e = style.effects
  composite(context, shadow(source, e.dropShadow.color, e.dropShadow.size, e.dropShadow.distance, e.dropShadow.angle, scale), e.dropShadow.enabled ? e.dropShadow.opacity : 0)
  composite(context, shadow(source, e.outerGlow.color, e.outerGlow.size, 0, 0, scale), e.outerGlow.enabled ? e.outerGlow.opacity : 0)
  if (e.stroke.enabled && e.stroke.position !== 'inside') composite(context, stroke(source, e.stroke, scale), e.stroke.opacity)
  composite(contentContext, sourceWithChannels(source, style.channels), style.fillOpacity)
  if (e.colorOverlay.enabled) composite(contentContext, tinted(source, e.colorOverlay.color), e.colorOverlay.opacity)
  if (e.gradientOverlay.enabled) composite(contentContext, gradient(source, e.gradientOverlay), e.gradientOverlay.opacity)
  if (e.patternOverlay.enabled) composite(contentContext, pattern(source, e.patternOverlay, scale), e.patternOverlay.opacity)
  if (e.texture.enabled && e.bevelEmboss.enabled) composite(contentContext, texture(source, e.texture, scale), e.texture.amount)
  if (e.innerShadow.enabled) composite(contentContext, insideShadow(source, e.innerShadow.color, e.innerShadow.size, e.innerShadow.distance, e.innerShadow.angle, scale), e.innerShadow.opacity)
  if (e.innerGlow.enabled) composite(contentContext, insideShadow(source, e.innerGlow.color, e.innerGlow.size, 0, 0, scale), e.innerGlow.opacity)
  if (e.satin.enabled) composite(contentContext, insideShadow(source, e.satin.color, e.satin.size, e.satin.distance, e.satin.angle, scale), e.satin.opacity)
  if (e.bevelEmboss.enabled) {
    const bevel = e.bevelEmboss
    const size = bevel.size * (e.contour.enabled ? 1 + e.contour.amount / 100 : 1)
    const strength = bevel.opacity * bevel.depth / 100
    composite(contentContext, insideShadow(source, bevel.color, size, size / 2, bevel.angle, scale), strength)
    composite(contentContext, insideShadow(source, bevel.shadowColor, size, size / 2, bevel.angle + 180, scale), strength)
  }
  if (e.stroke.enabled && e.stroke.position !== 'outside') composite(contentContext, stroke(source, e.stroke, scale), e.stroke.opacity)
  composite(context, content, 100)
  if (style.opacity !== 100) {
    const { canvas: faded, context: fadedContext } = newCanvas(width, height)
    composite(fadedContext, output, style.opacity)
    return faded
  }
  return output
}
