import test from 'node:test'
import assert from 'node:assert/strict'
import {
  smartAdCambodiaSlotAt,
  validateDiscoverSmartAdVersion,
  normalizeDiscoverSmartAd,
  filterDiscoverSmartAds,
} from '../services/smartAdDiscoverGuard.js'

const ID = '123e4567-e89b-42d3-a456-426614174000'
const EP = '123e4567-e89b-42d3-a456-426614174001'
const NOW = Date.parse('2026-11-10T10:00:00+07:00')

function story(overrides = {}) {
  return {
    story_id: ID, first_episode_id: EP, title: 'Example Story',
    story_kind: 'novel', story_status: 'ongoing', episode_count: 5,
    last_episode_published_at: '2026-11-01T12:00:00+07:00',
    eligibility_version: 4, preview_image_url: 'https://example.org/slide1.webp',
    cover_url: 'https://example.org/cover.webp',
    ...overrides,
  }
}

test('Cambodia slots align to 00, 06, 12, 18 even near midnight', () => {
  assert.equal(smartAdCambodiaSlotAt(Date.parse('2026-11-09T17:00:00Z')), '2026-11-10T00:00')
  assert.equal(smartAdCambodiaSlotAt(Date.parse('2026-11-10T08:00:00Z')), '2026-11-10T12:00')
  assert.equal(smartAdCambodiaSlotAt(Date.parse('2026-11-10T11:00:00Z')), '2026-11-10T18:00')
})

test('catalog version rejects older versions and mismatched slots', () => {
  const version = { slot_key: '2026-11-10T06:00', catalog_version: 4 }
  assert.equal(validateDiscoverSmartAdVersion(version, { expectedSlot: '2026-11-10T06:00', expectedVersion: 4 }), true)
  assert.equal(validateDiscoverSmartAdVersion(version, { expectedVersion: 3 }), false)
  assert.equal(validateDiscoverSmartAdVersion(version, { expectedSlot: '2026-11-10T12:00' }), false)
})

test('rejects unpublished or invalid first episode identity', () => {
  assert.equal(normalizeDiscoverSmartAd(story({ first_episode_id: null }), { catalogVersion: 4, now: NOW }), null)
  assert.equal(normalizeDiscoverSmartAd(story({ eligibility_version: 3 }), { catalogVersion: 4, now: NOW }), null)
})

test('ongoing stories require a recent published episode, completed ones do not', () => {
  const old = '2025-02-01T00:00:00Z'
  assert.equal(normalizeDiscoverSmartAd(story({ last_episode_published_at: old }), { catalogVersion: 4, now: NOW }), null)
  assert.ok(normalizeDiscoverSmartAd(story({ last_episode_published_at: old, story_status: 'completed' }), { catalogVersion: 4, now: NOW }))
})

test('completed short stories can have fewer episodes, incomplete cannot', () => {
  assert.ok(normalizeDiscoverSmartAd(story({ story_kind: 'short', story_status: 'completed', episode_count: 1 }), { catalogVersion: 4, now: NOW }))
  assert.equal(normalizeDiscoverSmartAd(story({ story_kind: 'short', episode_count: 1 }), { catalogVersion: 4, now: NOW }), null)
})

test('invalid preview falls back to the original cover', () => {
  const item = normalizeDiscoverSmartAd(story({ preview_image_url: 'javascript:alert(1)' }), { catalogVersion: 4, now: NOW })
  assert.equal(item.preview_image_url, 'https://example.org/cover.webp')
})

test('selection deduplicates story IDs and excludes specified stories', () => {
  assert.equal(filterDiscoverSmartAds([story(), story()], { catalogVersion: 4, now: NOW }).length, 1)
  assert.equal(filterDiscoverSmartAds([story()], { catalogVersion: 4, now: NOW, excludeStoryIds: [ID] }).length, 0)
})
