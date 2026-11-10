import {
  deleteReelPlaylist,
  listMyReelPlaylists,
  renameReelPlaylist,
  updateReelStatus,
} from '../../../../services/reelPlaylistsApi'
import { getStudioVideoAnalytics } from '../../../../services/shadowStudioAnalyticsApi'

const API_BASE = import.meta.env.VITE_API_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:5000' : 'https://shadow-backend-kucw.onrender.com'
)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PAGE_LIMIT = 24
let summaryUnavailable = false

function requiredId(value) {
  const id = String(value || '')
  if (!UUID.test(id)) throw new Error('Invalid video ID.')
  return id
}

function token() {
  return localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token') || ''
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const bearer = token()
  if (!bearer) throw new Error('Sign in to manage Reels.')
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${bearer}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok !== true) {
    const error = new Error(data?.message || `Request failed (${response.status}).`)
    error.status = response.status
    throw error
  }
  return data
}

function safeLimit(value) {
  const number = Number(value)
  return Number.isSafeInteger(number) ? Math.min(PAGE_LIMIT, Math.max(1, number)) : 12
}

function safeOffset(value) {
  const number = Number(value)
  return Number.isSafeInteger(number) && number >= 0 ? Math.min(number, 5000) : 0
}

function normalizePage(result, field, limit, offset) {
  const items = Array.isArray(result?.[field]) ? result[field] : []
  const pagination = result?.pagination || {}
  const next = Number(pagination.next_offset)
  const nextOffset = Number.isSafeInteger(next) && next > offset
    ? next
    : offset + items.length
  return {
    items,
    nextOffset,
    hasMore: Boolean(pagination.has_more) && nextOffset > offset && nextOffset <= 5000,
  }
}

async function withPlaylistSummaries(page, signal) {
  if (summaryUnavailable || !page.items.length) return page
  const ids = page.items.map(item => item.id).filter(id => UUID.test(String(id || '')))
  if (!ids.length) return page
  try {
    const params = new URLSearchParams({ ids: ids.join(',') })
    const result = await request(`/api/shadow-studio/content/playlists/summaries?${params}`, { signal })
    const summaries = new Map((Array.isArray(result.summaries) ? result.summaries : [])
      .filter(row => UUID.test(String(row?.playlist_id || '')))
      .map(row => [row.playlist_id, row]))
    return {
      ...page,
      items: page.items.map(item => {
        const summary = summaries.get(item.id)
        if (!summary) return item
        const count = Number(summary.video_count)
        return {
          ...item,
          video_count: Number.isSafeInteger(count) && count >= 0 ? count : null,
          thumbnail_url: typeof summary.thumbnail_url === 'string' ? summary.thumbnail_url : null,
        }
      }),
    }
  } catch (error) {
    if (signal?.aborted) throw error
    if (error?.status === 503) summaryUnavailable = true
    return page
  }
}

export async function listStudioContentSection(section, { limit = 12, offset = 0, signal } = {}) {
  const pageLimit = safeLimit(limit)
  const pageOffset = safeOffset(offset)
  if (section === 'playlists') {
    const result = await listMyReelPlaylists({ limit: pageLimit, offset: pageOffset, signal })
    return withPlaylistSummaries(normalizePage(result, 'playlists', pageLimit, pageOffset), signal)
  }
  if (section !== 'videos' && section !== 'shorts') throw new Error('Invalid content section.')
  const params = new URLSearchParams({
    mode: 'manager',
    sort: 'latest',
    video_type: section === 'shorts' ? 'short' : 'long',
    limit: String(pageLimit),
    offset: String(pageOffset),
  })
  const result = await request(`/api/fast/videos/mine?${params.toString()}`, { signal })
  return normalizePage(result, 'videos', pageLimit, pageOffset)
}

export async function setStudioVideoPublishStatus(video) {
  const id = requiredId(video?.id)
  const status = video?.status === 'published' ? 'draft' : 'published'
  return updateReelStatus(id, status)
}

export async function setStudioVideoKind(videoId, nextKind, signal) {
  const id = requiredId(videoId)
  if (!['long', 'short'].includes(nextKind)) throw new Error('Invalid video type.')
  return request(`/api/shadow-studio/video-type/videos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { video_type: nextKind },
    signal,
  })
}

export async function removeStudioVideo(videoId, signal) {
  const id = requiredId(videoId)
  return request(`/api/fast/videos/${encodeURIComponent(id)}`, { method: 'DELETE', signal })
}

export async function renameStudioPlaylist(playlistId, name) {
  const id = requiredId(playlistId)
  const nextName = String(name || '').trim()
  if (!nextName || nextName.length > 80) throw new Error('Playlist name must contain 1–80 characters.')
  return renameReelPlaylist(id, nextName)
}

export async function removeStudioPlaylist(playlistId) {
  return deleteReelPlaylist(requiredId(playlistId))
}

export function fetchStudioVideoAnalytics(videoId, options = {}) {
  return getStudioVideoAnalytics(requiredId(videoId), options)
}
