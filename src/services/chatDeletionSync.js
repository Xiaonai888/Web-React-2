const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const LIMIT = 40
const idOf = value => typeof value === 'string' && UUID.test(value) ? value.toLowerCase() : ''
const deleted = row => Boolean(row?.deleted_at || row?.is_deleted || row?.deleted)

export function collectDeletionSyncIds(messages, referenceIds = []) {
  const rows = Array.isArray(messages) ? messages : []
  const knownDeleted = new Set(rows.filter(deleted).map(row => idOf(row.id)))
  const ids = new Set()
  const add = value => { const id = idOf(value); if (id && !knownDeleted.has(id)) ids.add(id) }
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i]
    if (!row || deleted(row)) continue
    add(row.id)
    if (!deleted(row.reply_to)) add(row.reply_to_message_id || row.replyTo || row.reply_to?.id)
  }
  if (Array.isArray(referenceIds)) referenceIds.forEach(add)
  return [...ids]
}

export function createChatDeletionSync() {
  let scope = ''
  let generation = 0
  let queue = []
  let completed = new Set()
  const reset = nextScope => {
    scope = nextScope || ''
    generation++
    queue = []
    completed = new Set()
  }
  return {
    reset,
    next(nextScope, messages, referenceIds = []) {
      if (scope !== nextScope) reset(nextScope)
      const ids = scope ? collectDeletionSyncIds(messages, referenceIds) : []
      const active = new Set(ids)
      queue = queue.filter(id => active.has(id))
      completed = new Set([...completed].filter(id => active.has(id)))
      const waiting = new Set(queue)
      for (const id of ids) if (!completed.has(id) && !waiting.has(id)) queue.push(id)
      if (!queue.length && ids.length) {
        completed.clear()
        queue = ids.slice()
      }
      const batch = queue.slice(0, LIMIT)
      return { scope, generation, ids: batch, checkIds: batch.join(',') }
    },
    accept(batch, result) {
      const empty = new Map()
      if (!batch || batch.scope !== scope || batch.generation !== generation || !batch.ids.length) return empty
      if (!Array.isArray(result?.checked_ids) || result.checked_ids.length !== batch.ids.length || !Array.isArray(result.removed) || result.removed.length > batch.ids.length) return empty
      if (!batch.ids.every((id, i) => result.checked_ids[i] === id)) return empty
      const wanted = new Set(batch.ids)
      const changes = new Map()
      for (const row of result.removed) {
        if (!wanted.has(row?.id) || changes.has(row.id) || (row.deleted_at !== null && (typeof row.deleted_at !== 'string' || !Number.isFinite(Date.parse(row.deleted_at))))) return empty
        changes.set(row.id, row.deleted_at)
      }
      for (const id of batch.ids) completed.add(id)
      queue = queue.filter(id => !wanted.has(id))
      return changes
    },
  }
}

export function applyChatDeletedRows(rows, changes) {
  if (!changes?.size) return rows
  let changed = false
  const result = rows.map(row => {
    const id = idOf(row.id)
    if (changes.has(id)) {
      changed = true
      return { ...row, body: '', message_text: null, attachments: [], attachment_url: null, attachment_name: null, attachment_mime: null, attachment_size: null, attachment_kind: null, is_deleted: true, deleted_at: changes.get(id) || row.deleted_at || null, reply_to: null, reply_to_message_id: null, forwarded_from: null, forwarded_from_user_id: null, forwarded_from_message_id: null, is_forwarded: false, edited_at: null }
    }
    const replyId = idOf(row.reply_to_message_id || row.reply_to?.id)
    if (!changes.has(replyId) || !row.reply_to || deleted(row.reply_to)) return row
    changed = true
    return { ...row, reply_to: { id: replyId, body: '', is_deleted: true, is_unavailable: true, sender: null } }
  })
  return changed ? result : rows
}

export function applySupportDeletedRows(rows, changes, normalized = false) {
  if (!changes?.size) return rows
  let changed = false
  const result = rows.flatMap(row => {
    const id = idOf(row.id)
    if (!changes.has(id)) return [row]
    changed = true
    const deletedAt = changes.get(id)
    if (deletedAt === null) return []
    const safe = { ...row, deleted_at: deletedAt, message_text: null, attachments: [], reply_to_message_id: null, edited_at: null }
    return [normalized ? { ...safe, deleted: true, text: '', replyTo: null, edited: false } : safe]
  })
  return changed ? result : rows
}
