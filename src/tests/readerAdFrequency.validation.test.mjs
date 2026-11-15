import test from 'node:test'
import assert from 'node:assert/strict'
import {
  registerReaderEpisode,
  peekReaderEpisodeAd,
  finishReaderEpisodeAd,
  grantReaderAdEntryPass,
} from '../services/advertisements/readerAdFrequency.js'
import {
  observePromoRoute,
  markPromoAdDisplayed,
  canShowMeAd,
} from '../services/advertisements/placementAdSequence.js'

function createStorage() {
  const data = new Map()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    clear: () => data.clear(),
  }
}

const local = createStorage()
const session = createStorage()
globalThis.localStorage = local
globalThis.sessionStorage = session
globalThis.window = { location: { pathname: '/' } }

function useAccount(id) {
  const payload = btoa(JSON.stringify({ user_id: id, type: 'reader' }))
  local.setItem('shadow_reader_token', `test.${payload}.signed`)
}

function episode(number, overrides = {}) {
  return { storyId: 'story-a', episodeId: `episode-${number}`, eligible: true, ...overrides }
}

test('new eligible episodes alternate no ad, ad, no ad, ad', () => {
  useAccount('alternating')
  assert.equal(registerReaderEpisode(episode(1)).showAd, false)
  assert.equal(registerReaderEpisode(episode(2)).showAd, true)
  assert.equal(registerReaderEpisode(episode(3)).showAd, false)
  assert.equal(registerReaderEpisode(episode(4)).showAd, true)
})

test('refreshing an episode does not increment count or repeat a finished ad', () => {
  useAccount('refresh')
  registerReaderEpisode(episode(1))
  assert.equal(registerReaderEpisode(episode(2)).showAd, true)
  assert.equal(registerReaderEpisode(episode(2)).count, 2)
  finishReaderEpisodeAd(episode(2))
  assert.equal(registerReaderEpisode(episode(2)).showAd, false)
  assert.equal(registerReaderEpisode(episode(3)).showAd, false)
})

test('unfinished ad remains due when episode is revisited', () => {
  useAccount('unfinished')
  registerReaderEpisode(episode(1))
  registerReaderEpisode(episode(2))
  assert.equal(peekReaderEpisodeAd(episode(2)), true)
  assert.equal(registerReaderEpisode(episode(2)).showAd, true)
})

test('paid episodes do not increment the eligible counter', () => {
  useAccount('paid')
  assert.equal(registerReaderEpisode(episode(1, { eligible: false })).showAd, false)
  assert.equal(registerReaderEpisode(episode(2)).showAd, false)
  assert.equal(registerReaderEpisode(episode(3)).showAd, true)
})

test('voucher and story-card eligible episodes are counted like free episodes', () => {
  useAccount('vouchers')
  assert.equal(registerReaderEpisode({ storyId: 'story-v', episodeId: 'voucher', eligible: true }).showAd, false)
  assert.equal(registerReaderEpisode({ storyId: 'story-c', episodeId: 'story-card', eligible: true }).showAd, true)
})

test('promo click pass avoids immediate reader ad and is consumed once', () => {
  useAccount('promo')
  registerReaderEpisode(episode(1))
  assert.equal(grantReaderAdEntryPass(episode(2)), true)
  assert.equal(peekReaderEpisodeAd(episode(2)), false)
  assert.equal(registerReaderEpisode(episode(2)).showAd, false)
  assert.equal(registerReaderEpisode(episode(3)).showAd, false)
  assert.equal(registerReaderEpisode(episode(4)).showAd, true)
})

test('accounts do not share episode progress', () => {
  useAccount('account-1')
  registerReaderEpisode(episode(1))
  useAccount('account-2')
  assert.equal(registerReaderEpisode(episode(1)).showAd, false)
  assert.equal(registerReaderEpisode(episode(2)).showAd, true)
})

test('opening on me defers me ad until leaving and returning', () => {
  useAccount('direct-me')
  observePromoRoute('/me')
  markPromoAdDisplayed('opening', '/me')
  assert.equal(canShowMeAd('/me'), false)
  observePromoRoute('/manga')
  assert.equal(canShowMeAd('/me'), false)
  observePromoRoute('/me')
  assert.equal(canShowMeAd('/me'), true)
})

test('opening then immediate me visit defers me until another visit', () => {
  useAccount('home-to-me')
  observePromoRoute('/')
  markPromoAdDisplayed('opening', '/')
  observePromoRoute('/me')
  assert.equal(canShowMeAd('/me'), false)
  observePromoRoute('/manga')
  observePromoRoute('/me')
  assert.equal(canShowMeAd('/me'), true)
})
