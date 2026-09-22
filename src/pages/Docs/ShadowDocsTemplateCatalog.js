export const BOOK_TEMPLATE_CATEGORIES = Object.freeze(['All', 'Fiction', 'Nonfiction', 'Education', 'Poetry', 'Children'])

export const BOOK_TEMPLATES = Object.freeze([
  { id: 'classic', name: 'Classic', category: 'Fiction', subtitle: 'Timeless and literary', symbol: '✦', cover: 'violet-dusk', layout: 'classic' },
  { id: 'minimal', name: 'Minimal', category: 'Nonfiction', subtitle: 'Clean and understated', symbol: '◦', cover: 'paper', layout: 'minimal' },
  { id: 'modern', name: 'Modern', category: 'Fiction', subtitle: 'Fresh and contemporary', symbol: '◇', cover: 'blue-hour', layout: 'modern' },
  { id: 'elegant', name: 'Elegant', category: 'Fiction', subtitle: 'Soft and refined', symbol: '❀', cover: 'rose-gold', layout: 'classic' },
  { id: 'academic', name: 'Academic', category: 'Education', subtitle: 'Clear and structured', symbol: '◎', cover: 'scholar', layout: 'academic' },
  { id: 'midnight', name: 'Midnight', category: 'Fiction', subtitle: 'Bold and cinematic', symbol: '☾', cover: 'nightfall', layout: 'modern' },
  { id: 'nature', name: 'Nature', category: 'Nonfiction', subtitle: 'Calm and organic', symbol: '❧', cover: 'forest', layout: 'classic' },
  { id: 'editorial', name: 'Editorial', category: 'Education', subtitle: 'Modern publishing', symbol: '▤', cover: 'terracotta', layout: 'academic' },
  { id: 'romance', name: 'Romance', category: 'Fiction', subtitle: 'Warm and heartfelt', symbol: '♡', cover: 'blush', layout: 'classic' },
  { id: 'mystery', name: 'Mystery', category: 'Fiction', subtitle: 'Dark and suspenseful', symbol: '✧', cover: 'ink', layout: 'modern' },
  { id: 'memoir', name: 'Memoir', category: 'Nonfiction', subtitle: 'Personal and intimate', symbol: '✎', cover: 'linen', layout: 'minimal' },
  { id: 'travel', name: 'Travel', category: 'Nonfiction', subtitle: 'Open roads and horizons', symbol: '⌁', cover: 'sunrise', layout: 'modern' },
  { id: 'storybook', name: 'Storybook', category: 'Children', subtitle: 'Playful and bright', symbol: '★', cover: 'sunny', layout: 'storybook' },
  { id: 'poetry', name: 'Poetry', category: 'Poetry', subtitle: 'Quiet and expressive', symbol: '❋', cover: 'lavender', layout: 'poetry' },
  { id: 'business', name: 'Business', category: 'Nonfiction', subtitle: 'Confident and practical', symbol: '▥', cover: 'graphite', layout: 'academic' },
  { id: 'folklore', name: 'Folklore', category: 'Fiction', subtitle: 'Myths and tradition', symbol: '❂', cover: 'temple', layout: 'classic' },
])

export const COVER_PRESETS = Object.freeze([
  { id: 'violet-dusk', name: 'Violet Dusk', background: 'linear-gradient(150deg,#e2c9cd 0%,#8b78b0 49%,#2c2855 100%)', foreground: '#fffaf7', accent: '#e7c6a4' },
  { id: 'paper', name: 'Warm Paper', background: 'linear-gradient(150deg,#faf4e7,#d3d0c9)', foreground: '#43384f', accent: '#827286' },
  { id: 'blue-hour', name: 'Blue Hour', background: 'linear-gradient(160deg,#c5dfd7,#668fb9 52%,#253956)', foreground: '#ffffff', accent: '#d3ebe7' },
  { id: 'rose-gold', name: 'Rose Gold', background: 'linear-gradient(155deg,#f0e4e5,#c78caa 54%,#6c3c66)', foreground: '#ffffff', accent: '#f9ddba' },
  { id: 'scholar', name: 'Scholar Blue', background: 'linear-gradient(145deg,#a8c3d0,#53738e 52%,#22324f)', foreground: '#ffffff', accent: '#e0caa3' },
  { id: 'nightfall', name: 'Nightfall', background: 'radial-gradient(ellipse at 75% 20%,#9f80ba,#292344 43%,#0b1429 95%)', foreground: '#ffffff', accent: '#cdbaf2' },
  { id: 'forest', name: 'Forest', background: 'linear-gradient(155deg,#d9dcc5,#85a28d 45%,#385b51)', foreground: '#ffffff', accent: '#eadab6' },
  { id: 'terracotta', name: 'Terracotta', background: 'linear-gradient(135deg,#f2dcc1,#ba7063 52%,#6c394c)', foreground: '#ffffff', accent: '#ffe5b4' },
  { id: 'blush', name: 'Blush', background: 'linear-gradient(150deg,#ffefea,#ebabb9 48%,#ad597a)', foreground: '#592c4b', accent: '#fff3e8' },
  { id: 'ink', name: 'Ink', background: 'linear-gradient(150deg,#626b82,#242941 52%,#10101c)', foreground: '#ffffff', accent: '#c3bcda' },
  { id: 'linen', name: 'Linen', background: 'linear-gradient(140deg,#f7f0dc,#e2d3bd,#b4a38c)', foreground: '#514435', accent: '#7f694e' },
  { id: 'sunrise', name: 'Sunrise', background: 'linear-gradient(165deg,#ffe8cf,#eeb68e 48%,#b46c8c)', foreground: '#542f54', accent: '#fff0d6' },
  { id: 'sunny', name: 'Sunny', background: 'linear-gradient(160deg,#fff6c2,#f9c67a 55%,#f28a87)', foreground: '#6a3750', accent: '#fffaf0' },
  { id: 'lavender', name: 'Lavender', background: 'linear-gradient(145deg,#f7f0ff,#c6b4ea 57%,#8b72b8)', foreground: '#46376c', accent: '#ffffff' },
  { id: 'graphite', name: 'Graphite', background: 'linear-gradient(140deg,#8c909b,#424754 51%,#1e2330)', foreground: '#ffffff', accent: '#d4dde9' },
  { id: 'temple', name: 'Temple', background: 'linear-gradient(160deg,#e5cc97,#b58067 49%,#604e63)', foreground: '#fffaf0', accent: '#eedaa6' },
])

export const PAGE_LAYOUT_PRESETS = Object.freeze([
  { id: 'classic', name: 'Classic Novel', size: 'A5', margin: 18, font: 'Noto Serif Khmer', fontSize: 13, lineSpacing: 1.65, alignment: 'justify', numbers: true, chapterStyle: 'classic' },
  { id: 'minimal', name: 'Minimal Essay', size: 'A5', margin: 20, font: 'Noto Sans Khmer', fontSize: 12, lineSpacing: 1.7, alignment: 'left', numbers: true, chapterStyle: 'minimal' },
  { id: 'modern', name: 'Modern Fiction', size: 'B5', margin: 18, font: 'Noto Serif Khmer', fontSize: 13, lineSpacing: 1.6, alignment: 'left', numbers: true, chapterStyle: 'modern' },
  { id: 'academic', name: 'Academic', size: 'A4', margin: 22, font: 'Noto Sans Khmer', fontSize: 12, lineSpacing: 1.5, alignment: 'justify', numbers: true, chapterStyle: 'modern' },
  { id: 'storybook', name: 'Storybook', size: 'A5', margin: 16, font: 'Noto Sans Khmer', fontSize: 16, lineSpacing: 1.8, alignment: 'left', numbers: true, chapterStyle: 'modern' },
  { id: 'poetry', name: 'Poetry', size: 'A5', margin: 24, font: 'Noto Serif Khmer', fontSize: 13, lineSpacing: 2, alignment: 'left', numbers: false, chapterStyle: 'minimal' },
])

export function getBookTemplate(id) {
  return BOOK_TEMPLATES.find(template => template.id === id) || BOOK_TEMPLATES[0]
}

export function getCoverPreset(id) {
  return COVER_PRESETS.find(preset => preset.id === id) || COVER_PRESETS[0]
}

export function getPageLayoutPreset(id) {
  return PAGE_LAYOUT_PRESETS.find(preset => preset.id === id) || PAGE_LAYOUT_PRESETS[0]
}
