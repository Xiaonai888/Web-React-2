import { getSmartAdAuthToken } from '../smartAdClient'
import { getStoryBadge } from '../../utils/storyBadge'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function hash(value) {
  let result = 2166136261
  for (const character of String(value)) {
    result ^= character.charCodeAt(0)
    result = Math.imul(result, 16777619)
  }
  return (result >>> 0).toString(36)
}

function getDiscoverInterestKey() {
  const token = getSmartAdAuthToken()
  let identity = token
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      identity = String(payload.sub || payload.user_id || payload.id || token)
    } catch {
      identity = token
    }
  }
  const scope = identity ? `reader-${hash(identity)}` : 'anon'
  return `shadow_smart_auto_ads_v2:shadow_discover_ad_rotation_v1:${scope}:genres`
}

export function getSmartFreeUnlockInterests() {
  try {
    const saved = JSON.parse(localStorage.getItem(getDiscoverInterestKey()) || '{}')
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {}
    const result = {}
    for (const [rawGenre, rawWeight] of Object.entries(saved).slice(0, 24)) {
      const genre = String(rawGenre).trim().toLowerCase().slice(0, 60)
      const weight = Number(rawWeight)
      if (genre && Number.isFinite(weight)) result[genre] = Math.min(40, Math.max(0, weight))
    }
    return result
  } catch {
    return {}
  }
}

export function toSmartFreeUnlockAdvertisement(story, slotKey) {
  const storyId = String(story?.story_id || '').toLowerCase()
  const episodeId = String(story?.first_episode_id || '').toLowerCase()
  const imageUrl = String(story?.cover_url || '').trim()
  if (!UUID.test(storyId) || !UUID.test(episodeId) || !/^https?:\/\//i.test(imageUrl)) return null
  const badge = getStoryBadge({
    story_status: story.story_status,
    total_episodes: story.episode_count,
  })
  return {
    placement: 'freeUnlock',
    story_id: storyId,
    first_episode_id: episodeId,
    slot_key: String(slotKey || ''),
    image_url: imageUrl,
    link_url: `/story/${storyId}/episode/${episodeId}`,
    title: String(story.title || ''),
    badge: String(badge || '').toUpperCase(),
    duration_seconds: 5,
    close_after_seconds: 3,
    frequency: 'every_unlock',
    updated_at: String(slotKey || ''),
  }
}
