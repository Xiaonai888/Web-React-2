// Author-owned Reel playlists: stored in Shadow (metadata only, not video files).

import { API_BASE_URL, getAuthToken as readToken } from '../config/api'

const BASE_URL = API_BASE_URL


async function request(path, { method = 'GET', body, signal } = {}) {
  const token = readToken()
  if (!token) throw new Error('Sign in to manage Reels.')
  const response = await fetch(`${BASE_URL}/api/fast${path}`, {
    method,
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok !== true) {
    throw new Error(data?.message || `Request failed (${response.status})`)
  }
  return data
}

export function listMyReelPlaylists({ limit = 30, offset = 0, search = '', signal } = {}) {
  const params = new URLSearchParams({
    limit: String(Math.max(1, Math.min(50, Number(limit) || 30))),
    offset: String(Math.max(0, Number(offset) || 0)),
  })
  if (search.trim()) params.set('search', search.trim())
  return request(`/playlists/mine?${params.toString()}`, { signal })
}

export function createReelPlaylist(name, isPublic = true) {
  return request('/playlists', { method: 'POST', body: { name, is_public: isPublic } })
}

export function renameReelPlaylist(playlistId, name) {
  return request(`/playlists/${encodeURIComponent(playlistId)}`, {
    method: 'PATCH', body: { name },
  })
}

export function deleteReelPlaylist(playlistId) {
  return request(`/playlists/${encodeURIComponent(playlistId)}`, { method: 'DELETE' })
}

export function getReelPlaylistAssignments(videoId) {
  return request(`/videos/${encodeURIComponent(videoId)}/playlists`)
}

// One HTTP call for multiple selected playlists, applied atomically by backend SQL RPC.
export function setReelPlaylistAssignments(videoId, playlistIds) {
  return request(`/videos/${encodeURIComponent(videoId)}/playlists`, {
    method: 'PUT', body: { playlist_ids: playlistIds },
  })
}

export function updateReelStatus(videoId, status) {
  return request(`/videos/${encodeURIComponent(videoId)}`, {
    method: 'PATCH', body: { status },
  })
}

export function createReelVideo(fields) {
  return request('/videos', { method: 'POST', body: fields })
}
