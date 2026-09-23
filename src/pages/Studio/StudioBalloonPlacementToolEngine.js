import { studioLayerContext } from './StudioLayerEngine'
import { studioLayerCanEdit } from './StudioLayerGroupEngine'
import { drawStudioMangaBalloon } from './StudioMangaBalloonRenderer'

export function placeStudioMangaBalloon(stack, anchor, options = {}) {
  if (!studioLayerCanEdit(stack)) throw new Error('Select a visible, unlocked layer before placing a Manga balloon.')
  const ctx = studioLayerContext(stack)
  if (ctx.canvas.width !== stack.width || ctx.canvas.height !== stack.height) throw new Error('Layer dimensions do not match the canvas.')
  if (![anchor?.x, anchor?.y].every(Number.isFinite)) throw new Error('Choose a position for the Manga balloon.')
  if (anchor.x < 0 || anchor.y < 0 || anchor.x > stack.width || anchor.y > stack.height) throw new Error('The balloon position is outside the paper.')
  return drawStudioMangaBalloon(ctx, anchor, options)
}
