import { useId, useState } from 'react'
import {
  Heart, Sparkles, Bird, Flower2, Cat, PawPrint, Leaf, Cloud,
  Gem, Flame, Snowflake, Music2, Crown, Feather, Ghost, Orbit,
} from 'lucide-react'

export const TAP_INDICATOR_STYLES = Object.freeze([
  Object.freeze({ id: 'hand', labelKey: 'hand' }),
  Object.freeze({ id: 'sword', labelKey: 'sword' }),
  Object.freeze({ id: 'starfish', labelKey: 'starfish' }),
  Object.freeze({ id: 'moon', labelKey: 'moon' }),
])

export const TAP_INDICATOR_ALL_STYLES = Object.freeze([
  ...TAP_INDICATOR_STYLES,
  Object.freeze({ id: 'heart', labelKey: 'heart' }),
  Object.freeze({ id: 'sparkles', labelKey: 'sparkles' }),
  Object.freeze({ id: 'bird', labelKey: 'bird' }),
  Object.freeze({ id: 'flower', labelKey: 'flower' }),
  Object.freeze({ id: 'cat', labelKey: 'cat' }),
  Object.freeze({ id: 'paw', labelKey: 'paw' }),
  Object.freeze({ id: 'leaf', labelKey: 'leaf' }),
  Object.freeze({ id: 'cloud', labelKey: 'cloud' }),
  Object.freeze({ id: 'diamond', labelKey: 'diamond' }),
  Object.freeze({ id: 'fire', labelKey: 'fire' }),
  Object.freeze({ id: 'snow', labelKey: 'snow' }),
  Object.freeze({ id: 'music', labelKey: 'music' }),
  Object.freeze({ id: 'crown', labelKey: 'crown' }),
  Object.freeze({ id: 'wing', labelKey: 'wing' }),
  Object.freeze({ id: 'ghost', labelKey: 'ghost' }),
  Object.freeze({ id: 'planet', labelKey: 'planet' }),
])

export const TAP_INDICATOR_ANIMATIONS = Object.freeze(['bounce', 'pulse', 'still'])

export const DEFAULT_TAP_INDICATOR = Object.freeze({
  source: 'shadow',
  styleId: 'hand',
  imageUrl: '',
  colorMode: 'solid',
  colors: Object.freeze(['#a98bd7', '#c4b5fd']),
  gradientAngle: 135,
  animation: 'bounce',
})

const HAND_URL = '/assets/Icons/Hand.svg'
const HEX_COLOR = /^#[0-9a-f]{6}$/i
const STYLE_IDS = new Set(TAP_INDICATOR_ALL_STYLES.map((item) => item.id))
const EXTENDED_STYLE_ICONS = Object.freeze({
  heart: Heart,
  sparkles: Sparkles,
  bird: Bird,
  flower: Flower2,
  cat: Cat,
  paw: PawPrint,
  leaf: Leaf,
  cloud: Cloud,
  diamond: Gem,
  fire: Flame,
  snow: Snowflake,
  music: Music2,
  crown: Crown,
  wing: Feather,
  ghost: Ghost,
  planet: Orbit,
})

const INDICATOR_CSS = `
.cs-tap-indicator{display:inline-grid;place-items:center;flex-shrink:0;pointer-events:none;vertical-align:middle;isolation:isolate}
.cs-tap-indicator-art{display:grid;place-items:center;width:100%;height:100%;transform-origin:50% 65%;will-change:auto}
.cs-tap-indicator-art>svg,.cs-tap-indicator-art>img,.cs-tap-indicator-mask{display:block;width:100%;height:100%;object-fit:contain}
.cs-tap-indicator[data-animation="bounce"] .cs-tap-indicator-art{animation:cs-tap-indicator-bounce 1.5s ease-in-out infinite}
.cs-tap-indicator[data-animation="pulse"] .cs-tap-indicator-art{animation:cs-tap-indicator-pulse 1.8s ease-in-out infinite}
@keyframes cs-tap-indicator-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10%)}}
@keyframes cs-tap-indicator-pulse{0%,100%{transform:scale(.93)}50%{transform:scale(1)}}
@media(prefers-reduced-motion:reduce){.cs-tap-indicator .cs-tap-indicator-art{animation:none!important;transform:none!important}}
`

export function safeTapIndicatorImageUrl(value) {
  if (typeof value !== 'string' || !value || value.length > 4096) return ''
  if (value !== value.trim() || /[\u0000-\u0020\u007f\\]/.test(value)) return ''
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return ''
    return url.href
  } catch {
    return ''
  }
}

export function normalizeTapIndicatorSettings(value) {
  const input = value && typeof value === 'object' ? value : {}
  const imageUrl = safeTapIndicatorImageUrl(input.imageUrl)
  const colors = Array.isArray(input.colors)
    ? input.colors.filter((color) => typeof color === 'string' && HEX_COLOR.test(color)).slice(0, 3)
    : []
  const angle = Number(input.gradientAngle)
  return {
    source: input.source === 'custom' && imageUrl ? 'custom' : 'shadow',
    styleId: STYLE_IDS.has(input.styleId) ? input.styleId : 'hand',
    imageUrl,
    colorMode: input.colorMode === 'gradient' ? 'gradient' : 'solid',
    colors: colors.length ? colors : [...DEFAULT_TAP_INDICATOR.colors],
    gradientAngle: Number.isFinite(angle) ? Math.max(0, Math.min(360, angle)) : 135,
    animation: TAP_INDICATOR_ANIMATIONS.includes(input.animation) ? input.animation : 'bounce',
  }
}

function IndicatorShape({ id, fill }) {
  if (id === 'sword') {
    return <g fill={fill}><path d="M69 9 87 7 85 25 45 65 31 51Z"/><path d="m24 47 29 29-7 7-29-29Z"/><path d="m28 68 7 7-16 16-7-7Z"/><circle cx="13" cy="90" r="6"/></g>
  }
  if (id === 'starfish') {
    return <g><path fill={fill} d="M49 8c5 0 9 23 15 27s28 0 29 6-20 16-22 23 8 26 3 30-21-13-28-13-25 15-30 11 6-25 4-32S1 42 3 37s26 1 32-3S44 8 49 8Z"/><g fill="white" opacity=".45"><circle cx="47" cy="45" r="3"/><circle cx="58" cy="57" r="2.5"/><circle cx="36" cy="58" r="2"/><circle cx="48" cy="68" r="2.5"/><circle cx="50" cy="30" r="2"/></g></g>
  }
  return <path fill={fill} d="M72 9A43 43 0 1 0 88 78 36 36 0 0 1 72 9Z"/>
}

function IndicatorVector({ id, colors, gradient, dx, dy }) {
  const gradientId = `cs-tap-${useId().replace(/[^a-z0-9_-]/gi, '')}`
  return <>
    {gradient ? <defs><linearGradient id={gradientId} x1={`${50 - dx}%`} y1={`${50 - dy}%`} x2={`${50 + dx}%`} y2={`${50 + dy}%`}>{colors.map((color, index) => <stop key={index} offset={`${index * 100 / (colors.length - 1)}%`} stopColor={color} />)}</linearGradient></defs> : null}
    <IndicatorShape id={id} fill={gradient ? `url(#${gradientId})` : colors[0]} />
  </>
}

function ExtendedIndicatorVector({ id, colors, gradient, dx, dy }) {
  const gradientId = `cs-tap-icon-${useId().replace(/[^a-z0-9_-]/gi, '')}`
  const Icon = EXTENDED_STYLE_ICONS[id]
  if (!Icon) return null
  return <Icon
    size="100%"
    strokeWidth={2.3}
    stroke={gradient ? `url(#${gradientId})` : colors[0]}
    fill="none"
    aria-hidden="true"
  >
    {gradient ? <defs><linearGradient id={gradientId} x1={`${50 - dx}%`} y1={`${50 - dy}%`} x2={`${50 + dx}%`} y2={`${50 + dy}%`}>{colors.map((color, index) => <stop key={index} offset={`${index * 100 / (colors.length - 1)}%`} stopColor={color} />)}</linearGradient></defs> : null}
  </Icon>
}

export default function ChatStoryTapIndicator({
  settings = DEFAULT_TAP_INDICATOR,
  size = 108,
  animate = true,
  skipAnimation = false,
  className = '',
}) {
  const selected = normalizeTapIndicatorSettings(settings)
  const [failedUrl, setFailedUrl] = useState('')
  const custom = selected.source === 'custom' && selected.imageUrl !== failedUrl
  const dimension = Number.isFinite(Number(size)) ? Math.max(24, Math.min(240, Number(size))) : 108
  const animation = animate && !skipAnimation ? selected.animation : 'still'
  const colors = selected.colors
  const gradient = selected.colorMode === 'gradient' && colors.length > 1
  const angle = selected.gradientAngle
  const background = gradient ? `linear-gradient(${angle}deg, ${colors.join(', ')})` : colors[0]
  const radians = angle * Math.PI / 180
  const dx = Math.sin(radians) * 50
  const dy = -Math.cos(radians) * 50

  return (
    <span
      className={`cs-tap-indicator ${className}`}
      data-animation={animation}
      data-source={custom ? 'custom' : 'shadow'}
      aria-hidden="true"
      style={{ width: dimension, height: dimension }}
    >
      <style>{INDICATOR_CSS}</style>
      <span className="cs-tap-indicator-art">
        {custom ? (
          <img src={selected.imageUrl} alt="" draggable={false} decoding="async" onError={() => setFailedUrl(selected.imageUrl)} />
        ) : selected.styleId === 'hand' ? (
          <span className="cs-tap-indicator-mask" style={{
            background,
            maskImage: `url("${HAND_URL}")`,
            WebkitMaskImage: `url("${HAND_URL}")`,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }} />
        ) : EXTENDED_STYLE_ICONS[selected.styleId] ? (
          <ExtendedIndicatorVector id={selected.styleId} colors={colors} gradient={gradient} dx={dx} dy={dy} />
        ) : (
          <svg viewBox="0 0 100 100" focusable="false">
            <IndicatorVector id={selected.styleId} colors={colors} gradient={gradient} dx={dx} dy={dy} />
          </svg>
        )}
      </span>
    </span>
  )
}
