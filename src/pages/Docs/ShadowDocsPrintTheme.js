import { getBookTemplate, getCoverPreset } from './ShadowDocsTemplateCatalog'

const safeCoverImage = value => typeof value === 'string' && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) && value.length < 2_500_000

export function getShadowDocsPrintTheme(book) {
  const template = getBookTemplate(book?.template)
  const preset = getCoverPreset(template.cover)
  const image = safeCoverImage(book?.image) ? book.image : ''
  return {
    templateId: template.id,
    background: preset.background,
    foreground: image ? '#ffffff' : preset.foreground,
    accent: image ? '#ffffff' : preset.accent,
    image,
  }
}

export function getShadowDocsPrintCoverStyle(book) {
  const theme = getShadowDocsPrintTheme(book)
  const background = theme.image
    ? `linear-gradient(180deg,rgba(16,13,31,.28),rgba(16,13,31,.72)),url("${theme.image}")`
    : theme.background
  return `background:${background};background-size:cover;background-position:center;color:${theme.foreground};`
}
