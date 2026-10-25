import { useCallback, useEffect, useRef, useState } from 'react'
import { getBookChatNotices, markBookChatNoticeRead } from '../services/bookOrderChatNoticesApi'

function initial(id) {
  return { conversationId: id, notices: [], loaded: false, loading: false, hasMore: false, nextPage: 1, role: 'reader', savingId: '', error: '' }
}

export default function useBookOrderChatNotices(conversationId) {
  const id = String(conversationId || '').trim()
  const [state, setState] = useState(() => initial(id))
  const active = useRef(null)

  useEffect(() => {
    active.current?.abort()
    setState(initial(id))
    return () => active.current?.abort()
  }, [id])

  const loadPage = useCallback(async (reset = false) => {
    if (!id || state.loading || (!reset && (!state.loaded || !state.hasMore))) return
    const page = reset ? 1 : state.nextPage
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setState((previous) => ({ ...previous, loading: true, error: '' }))
    try {
      const data = await getBookChatNotices(id, page, { signal: controller.signal })
      if (controller.signal.aborted) return
      setState((previous) => {
        if (previous.conversationId !== id) return previous
        const byId = new Map((reset ? [] : previous.notices).map((notice) => [notice.id, notice]))
        for (const notice of Array.isArray(data.notices) ? data.notices : []) {
          if (notice?.id) byId.set(notice.id, notice)
        }
        return {
          ...previous,
          notices: [...byId.values()],
          loaded: true,
          loading: false,
          hasMore: data.has_next === true,
          nextPage: page + 1,
          role: data.role === 'author' ? 'author' : 'reader',
          error: '',
        }
      })
    } catch (error) {
      if (controller.signal.aborted) return
      setState((previous) => previous.conversationId !== id ? previous : ({ ...previous, loading: false, error: error?.message || 'Could not load book notifications' }))
    } finally {
      if (active.current === controller) active.current = null
    }
  }, [id, state.hasMore, state.loaded, state.loading, state.nextPage])

  const markRead = useCallback(async (noticeId) => {
    if (!id || state.savingId) return false
    setState((previous) => ({ ...previous, savingId: noticeId, error: '' }))
    try {
      const result = await markBookChatNoticeRead(id, noticeId)
      setState((previous) => previous.conversationId !== id ? previous : ({
        ...previous,
        savingId: '',
        notices: previous.notices.map((notice) => notice.id === noticeId ? { ...notice, seen_at: result.notice?.seen_at || notice.seen_at } : notice),
      }))
      return true
    } catch (error) {
      setState((previous) => previous.conversationId !== id ? previous : ({ ...previous, savingId: '', error: error?.message || 'Could not mark notification as read' }))
      return false
    }
  }, [id, state.savingId])

  const visible = state.conversationId === id
  const notices = visible ? state.notices : []
  const unreadCount = notices.filter((notice) => !notice.seen_at).length
  return {
    notices,
    unreadCount,
    loaded: visible && state.loaded,
    loading: visible && state.loading,
    hasMore: visible && state.hasMore,
    savingId: visible ? state.savingId : '',
    error: visible ? state.error : '',
    loadFirst: () => loadPage(true),
    loadMore: () => loadPage(false),
    markRead,
  }
}
