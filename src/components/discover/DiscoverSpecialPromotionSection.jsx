import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DiscoverSpecialPromotionCard from './DiscoverSpecialPromotionCard'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

const CACHE_DURATION_MS = 5 * 60 * 1000

let cachedPromotion = null
let lastRequestAt = 0
let pendingRequest = null

async function loadActivePromotion() {
  if (Date.now() - lastRequestAt < CACHE_DURATION_MS) {
    return cachedPromotion
  }

  if (pendingRequest) {
    return pendingRequest
  }

  pendingRequest = (async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/public/discover-special-promotion/active`,
        { headers: { Accept: 'application/json' } }
      )

      if (!response.ok) {
        throw new Error('Promotion unavailable')
      }

      const payload = await response.json()

      cachedPromotion =
        payload?.ok !== false &&
        payload?.promotion &&
        typeof payload.promotion === 'object'
          ? payload.promotion
          : null

      lastRequestAt = Date.now()
      return cachedPromotion
    } catch {
      lastRequestAt = Date.now()
      return cachedPromotion
    } finally {
      pendingRequest = null
    }
  })()

  return pendingRequest
}

export default function DiscoverSpecialPromotionSection() {
  const navigate = useNavigate()
  const [promotion, setPromotion] = useState(
    () =>
      Date.now() - lastRequestAt < CACHE_DURATION_MS
        ? cachedPromotion
        : null
  )

  useEffect(() => {
    let mounted = true

    loadActivePromotion().then((result) => {
      if (mounted) setPromotion(result)
    })

    return () => {
      mounted = false
    }
  }, [])

  if (!promotion) return null

  const storyId = promotion.story_id || promotion.story?.id

  return (
    <DiscoverSpecialPromotionCard
      promotion={promotion}
      onOpen={
        storyId
          ? () => navigate(`/story/${encodeURIComponent(storyId)}`)
          : undefined
      }
    />
  )
}
