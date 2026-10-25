import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { dismissBookOrderPopup, getConversationBookOrders } from '../services/bookOrderChatApi'

export default function useBookOrderChat(conversationId) {
  const [state, setState] = useState({ conversationId: '', role: 'reader', orders: [], loading: false, error: '' })
  const requestSequence = useRef(0)

  const refresh = useCallback(async (signal) => {
    const id = String(conversationId || '').trim()
    const sequence = ++requestSequence.current
    if (!id) {
      setState({ conversationId: '', role: 'reader', orders: [], loading: false, error: '' })
      return
    }
    setState((previous) => ({ ...previous, conversationId: id, orders: previous.conversationId === id ? previous.orders : [], loading: true, error: '' }))
    try {
      const data = await getConversationBookOrders(id, { signal })
      if (signal?.aborted || sequence !== requestSequence.current) return
      const role = data.role === 'author' ? 'author' : 'reader'
      setState({ conversationId: id, role, orders: Array.isArray(data.orders) ? data.orders : [], loading: false, error: '' })
    } catch (error) {
      if (signal?.aborted || sequence !== requestSequence.current) return
      setState({ conversationId: id, role: 'reader', orders: [], loading: false, error: String(error?.message || 'Unable to load book orders') })
    }
  }, [conversationId])

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    return () => {
      controller.abort()
      requestSequence.current += 1
    }
  }, [refresh])

  const markPopupSeen = useCallback(async (orderId) => {
    await dismissBookOrderPopup(conversationId, orderId)
    setState((previous) => previous.conversationId !== conversationId ? previous : ({
      ...previous,
      orders: previous.orders.map((order) => order.id === orderId ? { ...order, popupSeen: true } : order),
    }))
  }, [conversationId])

  const visible = state.conversationId === conversationId
  const orders = visible ? state.orders : []
  const popupOrder = useMemo(() => orders.find((order) => order.paymentVerified === true && order.isPhysicalBook === true && !order.popupSeen && !['released', 'refunded'].includes(order.holdStatus)) || null, [orders])

  return { orders, popupOrder, role: state.role, loading: state.loading, error: visible ? state.error : '', refresh, markPopupSeen }
}
