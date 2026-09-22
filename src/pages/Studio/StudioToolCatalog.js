export const STUDIO_TOOL_GROUPS = [
  { id: 'navigation', tools: [
    { id: 'move', icon: 'fa-arrows-up-down-left-right' },
    { id: 'transform', icon: 'fa-up-down-left-right' },
    { id: 'marquee', icon: 'fa-vector-square' },
    { id: 'wand', icon: 'fa-wand-magic-sparkles' },
    { id: 'lasso', icon: 'fa-draw-polygon' },
  ] },
  { id: 'drawing', tools: [
    { id: 'brush', icon: 'fa-paintbrush' },
    { id: 'pencil', icon: 'fa-pencil' },
    { id: 'eraser', icon: 'fa-eraser' },
    { id: 'smudge', icon: 'fa-hand-pointer' },
    { id: 'blur', icon: 'fa-droplet' },
    { id: 'fill', icon: 'fa-fill-drip' },
    { id: 'gradient', icon: 'fa-fill' },
    { id: 'eyedropper', icon: 'fa-eye-dropper' },
  ] },
  { id: 'design', tools: [
    { id: 'text', icon: 'fa-font' },
    { id: 'shape', icon: 'fa-shapes' },
    { id: 'frame', icon: 'fa-table-cells-large' },
    { id: 'crop', icon: 'fa-crop-simple' },
    { id: 'ruler', icon: 'fa-ruler' },
    { id: 'canvas', icon: 'fa-image' },
  ] },
  { id: 'other', tools: [
    { id: 'balloon', icon: 'fa-comment' },
    { id: 'perspective', icon: 'fa-border-all' },
  ] },
]

export const STUDIO_WORKING_TOOLS = new Set(['brush', 'pencil', 'eraser', 'text', 'eyedropper', 'shape'])
export const STUDIO_MANGA_DEFAULT_TOOLS = ['brush', 'pencil', 'eraser', 'text', 'eyedropper', 'shape']
export const STUDIO_TOOL_PREF_KEY = 'shadow-studio-pinned-tools-v1'
export const STUDIO_TOOLS_BY_ID = Object.fromEntries(STUDIO_TOOL_GROUPS.flatMap((group) => group.tools.map((item) => [item.id, item])))

export function normalizeStudioPinnedTools(candidate) {
  if (!Array.isArray(candidate)) return [...STUDIO_MANGA_DEFAULT_TOOLS]
  const unique = [...new Set(candidate.filter((id) => typeof id === 'string' && STUDIO_WORKING_TOOLS.has(id) && STUDIO_TOOLS_BY_ID[id]))]
  return unique.length ? unique : [...STUDIO_MANGA_DEFAULT_TOOLS]
}

export function loadStudioPinnedTools() {
  try {
    const raw = window.localStorage.getItem(STUDIO_TOOL_PREF_KEY)
    return raw === null ? [...STUDIO_MANGA_DEFAULT_TOOLS] : normalizeStudioPinnedTools(JSON.parse(raw))
  } catch {
    return [...STUDIO_MANGA_DEFAULT_TOOLS]
  }
}

export function saveStudioPinnedTools(candidate) {
  const normalized = normalizeStudioPinnedTools(candidate)
  window.localStorage.setItem(STUDIO_TOOL_PREF_KEY, JSON.stringify(normalized))
  return normalized
}
