const cloneState = value => JSON.parse(JSON.stringify(value))

export function createShadowDocsHistory(initialState, limit = 100) {
  const safeLimit = Math.max(10, Math.min(300, Number(limit) || 100))
  let past = []
  let present = cloneState(initialState)
  let future = []

  return {
    snapshot() {
      return cloneState(present)
    },
    push(nextState) {
      const next = cloneState(nextState)
      if (JSON.stringify(next) === JSON.stringify(present)) return false
      past.push(cloneState(present))
      if (past.length > safeLimit) past = past.slice(-safeLimit)
      present = next
      future = []
      return true
    },
    undo() {
      if (!past.length) return null
      future.unshift(cloneState(present))
      present = past.pop()
      return cloneState(present)
    },
    redo() {
      if (!future.length) return null
      past.push(cloneState(present))
      present = future.shift()
      return cloneState(present)
    },
    replace(state) {
      present = cloneState(state)
      past = []
      future = []
      return cloneState(present)
    },
    canUndo() {
      return past.length > 0
    },
    canRedo() {
      return future.length > 0
    },
    clear() {
      past = []
      future = []
    },
  }
}
