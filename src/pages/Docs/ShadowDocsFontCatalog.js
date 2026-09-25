const GOOGLE_KHMER = [
  'Battambang', 'Bayon', 'Bokor', 'Chenla', 'Content', 'Dangrek', 'Freehand', 'Hanuman',
  'Kantumruy Pro', 'Khmer', 'Koulen', 'Metal', 'Moul', 'Moulpali', 'Noto Sans Khmer',
  'Noto Serif Khmer', 'Odor Mean Chey', 'Preahvihear', 'Siemreap', 'Suwannaphum',
]

const KHMER_OS = [
  ['Khmer OS', 'KhmerOS.ttf'],
  ['Khmer OS Battambang', 'KhmerOS_battambang.ttf'],
  ['Khmer OS Bokor', 'KhmerOS_bokor.ttf'],
  ['Khmer OS Content', 'KhmerOS_content.ttf'],
  ['Khmer OS Fasthand', 'KhmerOS_fasthand.ttf'],
  ['Khmer OS Freehand', 'KhmerOS_freehand.ttf'],
  ['Khmer OS Metal Chrieng', 'KhmerOS_metalchrieng.ttf'],
  ['Khmer OS Muol', 'KhmerOS_muol.ttf'],
  ['Khmer OS Muol Light', 'KhmerOS_muollight.ttf'],
  ['Khmer OS Muol Pali', 'KhmerOS_muolpali.ttf'],
  ['Khmer OS Siemreap', 'KhmerOS_siemreap.ttf'],
  ['Khmer OS System', 'KhmerOS_sys.ttf'],
]

const LATIN = [
  'Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Courier New', 'Helvetica',
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Inter', 'Nunito', 'Nunito Sans',
  'Raleway', 'Ubuntu', 'Oswald', 'Merriweather', 'Lora', 'Playfair Display', 'Source Sans 3',
  'PT Sans', 'PT Serif', 'Noto Sans', 'Noto Serif', 'Work Sans', 'DM Sans', 'DM Serif Display',
  'Libre Baskerville', 'Libre Franklin', 'Bitter', 'Cabin', 'Karla', 'Manrope', 'Quicksand',
  'Rubik', 'Mulish', 'Outfit', 'Figtree', 'Barlow', 'Barlow Condensed', 'IBM Plex Sans',
  'IBM Plex Serif', 'IBM Plex Mono', 'Inconsolata', 'Fira Sans', 'Fira Code', 'JetBrains Mono',
  'Roboto Slab', 'Roboto Mono', 'Roboto Condensed', 'Josefin Sans', 'Arimo', 'Tinos', 'Cousine',
  'Archivo', 'Archivo Narrow', 'Space Grotesk', 'Space Mono', 'Urbanist', 'Lexend',
  'Kanit', 'Prompt', 'Exo 2', 'Titillium Web', 'Dosis',
]

const SYSTEM_LATIN = new Set(['Arial', 'Georgia', 'Times New Roman', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Courier New', 'Helvetica'])
const OS_FILES = new Map(KHMER_OS)
const GOOGLE = new Set([...GOOGLE_KHMER, ...LATIN.filter(font => !SYSTEM_LATIN.has(font))])
const KHMER_OS_BASE = 'https://raw.githubusercontent.com/KhmerSoftwareInitiative/khmer-unicode-fonts/master/fonts/v5.0/'

export const SHADOW_DOCS_KHMER_FONTS = Object.freeze([...GOOGLE_KHMER, ...KHMER_OS.map(([name]) => name)])
export const SHADOW_DOCS_LATIN_FONTS = Object.freeze([...LATIN])
export const SHADOW_DOCS_FONT_OPTIONS = Object.freeze([...SHADOW_DOCS_KHMER_FONTS, ...SHADOW_DOCS_LATIN_FONTS])

export function isShadowDocsFont(font) {
  return SHADOW_DOCS_FONT_OPTIONS.includes(font)
}

export function shadowDocsFontFamily(font) {
  const selected = isShadowDocsFont(font) ? font : 'Noto Serif Khmer'
  return `"${selected.replaceAll('"', '')}", "Noto Serif Khmer", "Khmer OS", serif`
}

export function shadowDocsFontCSS(font) {
  if (!isShadowDocsFont(font)) return ''
  if (OS_FILES.has(font)) {
    const url = KHMER_OS_BASE + OS_FILES.get(font)
    return `@font-face{font-family:"${font}";src:url("${url}") format("truetype");font-display:swap;font-style:normal;font-weight:400}`
  }
  if (GOOGLE.has(font)) {
    const family = encodeURIComponent(font).replace(/%20/g, '+')
    return `@import url("https://fonts.googleapis.com/css2?family=${family}&display=swap");`
  }
  return ''
}

export function loadShadowDocsFont(font) {
  if (typeof document === 'undefined' || !isShadowDocsFont(font)) return
  const css = shadowDocsFontCSS(font)
  if (!css) return
  const id = `sd-font-${SHADOW_DOCS_FONT_OPTIONS.indexOf(font)}`
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}
