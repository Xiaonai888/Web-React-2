export const MAX_STUDIO_GROUPS = 8

function groupId() {
  return globalThis.crypto?.randomUUID?.() || `group-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function requireStack(stack) {
  if (!stack || !Array.isArray(stack.layers) || !stack.layers.length) throw new Error('No layer stack is available.')
  if (stack.groups !== undefined && !Array.isArray(stack.groups)) throw new Error('Invalid layer groups.')
  return stack.groups || []
}

function requireGroup(stack, id) {
  const group = requireStack(stack).find((item) => item.id === id)
  if (!group) throw new Error('Layer group not found.')
  return group
}

export function validateStudioGroupLayout(stack) {
  const groups = requireStack(stack)
  if (groups.length > MAX_STUDIO_GROUPS) throw new Error('Too many layer groups.')
  const ids = new Set()
  for (const group of groups) {
    if (!group || typeof group.id !== 'string' || !group.id || ids.has(group.id)) throw new Error('Invalid layer group ID.')
    ids.add(group.id)
  }
  const closed = new Set()
  let previous = null
  for (let index = 0; index < stack.layers.length; index += 1) {
    const id = stack.layers[index]?.groupId || null
    if (index === 0 && id && stack.layers[0].isBackground !== false) throw new Error('Background cannot belong to a group.')
    if (id && !ids.has(id)) throw new Error('A layer references a missing group.')
    if (id !== previous) {
      if (previous) closed.add(previous)
      if (id && closed.has(id)) throw new Error('Grouped layers must remain adjacent.')
      previous = id
    }
  }
  return groups
}

export function createStudioLayerGroup(stack, layerIds = [stack?.activeLayerId], name = '') {
  const groups = validateStudioGroupLayout(stack)
  if (groups.length >= MAX_STUDIO_GROUPS) throw new Error('The group limit has been reached.')
  if (!Array.isArray(layerIds) || !layerIds.length || new Set(layerIds).size !== layerIds.length) throw new Error('Select distinct layers to group.')
  const positions = layerIds.map((id) => stack.layers.findIndex((layer) => layer.id === id)).sort((a, b) => a - b)
  if (positions[0] < 0 || (positions[0] === 0 && stack.layers[0].isBackground !== false) || positions.some((position, index) => position !== positions[0] + index)) throw new Error('Select adjacent editable layers.')
  if (positions.some((position) => stack.layers[position].groupId)) throw new Error('Ungroup existing layers before making a new group.')
  const title = String(name || `Group ${groups.length + 1}`).trim().slice(0, 80)
  if (!title) throw new Error('A group name is required.')
  const group = { id: groupId(), name: title, visible: true, locked: false, collapsed: false, opacity: 100, blendMode: 'normal' }
  stack.groups = [...groups, group]
  for (const position of positions) stack.layers[position].groupId = group.id
  return group
}

export function updateStudioLayerGroup(stack, id, patch = {}) {
  const group = requireGroup(stack, id)
  if (Object.hasOwn(patch, 'name')) {
    const name = String(patch.name || '').trim().slice(0, 80)
    if (!name) throw new Error('A group name is required.')
    group.name = name
  }
  if (Object.hasOwn(patch, 'visible')) group.visible = Boolean(patch.visible)
  if (Object.hasOwn(patch, 'locked')) group.locked = Boolean(patch.locked)
  if (Object.hasOwn(patch, 'collapsed')) group.collapsed = Boolean(patch.collapsed)
  if (Object.hasOwn(patch, 'opacity')) {
    const opacity = Number(patch.opacity)
    if (!Number.isFinite(opacity) || opacity < 0 || opacity > 100) throw new Error('Group opacity must be between 0 and 100.')
    group.opacity = opacity
  }
  return group
}

export function removeStudioLayerGroup(stack, id) {
  const group = requireGroup(stack, id)
  for (const layer of stack.layers) if (layer.groupId === group.id) delete layer.groupId
  stack.groups = stack.groups.filter((item) => item.id !== id)
  return group
}

export function studioLayerCanEdit(stack, layerId = stack?.activeLayerId) {
  const layer = stack?.layers?.find((item) => item.id === layerId)
  if (!layer || layer.locked || !layer.visible) return false
  if (!layer.groupId) return true
  const group = stack.groups?.find((item) => item.id === layer.groupId)
  return Boolean(group && group.visible && !group.locked)
}
