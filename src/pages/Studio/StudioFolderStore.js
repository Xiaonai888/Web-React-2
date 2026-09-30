const STORAGE_KEY = 'shadow-studio-folders-v1'
const VERSION = 1
const MAX_FOLDERS = 200

function emptyState() {
  return { folders: [], assignments: {} }
}

function safeTime(value) {
  const date = new Date(value || 0)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function normalizeFolder(folder) {
  if (!folder || typeof folder.id !== 'string' || !folder.id) return null
  const name = String(folder.name || '').trim().slice(0, 80)
  if (!name) return null
  return {
    id: folder.id.slice(0, 120),
    name,
    createdAt: safeTime(folder.createdAt),
    updatedAt: safeTime(folder.updatedAt || folder.createdAt),
  }
}

function normalizeState(value) {
  if (!value || value.version !== VERSION || !Array.isArray(value.folders)) return emptyState()
  const folders = value.folders.map(normalizeFolder).filter(Boolean).slice(0, MAX_FOLDERS)
  const folderIds = new Set(folders.map((folder) => folder.id))
  const assignments = {}
  if (value.assignments && typeof value.assignments === 'object') {
    Object.entries(value.assignments).forEach(([documentId, folderId]) => {
      if (typeof documentId === 'string' && documentId && typeof folderId === 'string' && folderIds.has(folderId)) {
        assignments[documentId] = folderId
      }
    })
  }
  return { folders, assignments }
}

export function readStudioFolderState() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    return normalizeState(JSON.parse(raw))
  } catch {
    return emptyState()
  }
}

export function saveStudioFolderState(state) {
  const normalized = normalizeState({ version: VERSION, ...state })
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, ...normalized }))
    return true
  } catch {
    return false
  }
}

export function createStudioFolderRecord(name) {
  const now = new Date().toISOString()
  return {
    id: globalThis.crypto?.randomUUID?.() || `studio-folder-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: String(name || '').trim().slice(0, 80),
    createdAt: now,
    updatedAt: now,
  }
}
