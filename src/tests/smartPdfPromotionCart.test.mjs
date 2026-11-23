import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSmartPdfCartItem, planSmartPdfCart } from '../services/smartPdfPromotionCart.js'

const start = Math.floor((Date.now() + 7 * 3600000) / (6 * 3600000)) * 6 * 3600000 - 7 * 3600000
const expiry = start + 6 * 3600000
const context = { rotationKey: String(Math.floor(start / 1000)), expiresAt: new Date(expiry).toISOString(), source: 'stories' }
const offer = {
  product_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  author_page_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  product_type: 'pdf',
  title: 'Test PDF', page_username: 'writer', story_language: 'km',
  original_price_usd: 12, author_price_usd: 8, promotion_price_usd: 8,
  expires_at: new Date(expiry).toISOString(),
  smart_pdf_offer_token: 'signed-test-token.payload-signature',
}

test('builds a signed checkout item with the original 6-hour slot', () => {
  const item = buildSmartPdfCartItem(offer, context)
  assert.equal(item.smart_pdf_offer_token, offer.smart_pdf_offer_token)
  assert.equal(item.discover_promotion_rotation_key, context.rotationKey)
  assert.equal(item.promotion_entry_source, 'stories')
  assert.equal(item.quantity, 1)
})

test('supports manga placement without changing a promotion slot', () => {
  const item = buildSmartPdfCartItem(offer, { ...context, source: 'manga' })
  assert.equal(item.discover_promotion_expires_at, context.expiresAt)
  assert.equal(item.promotion_entry_source, 'manga')
})

test('refuses unsigned offers', () => {
  assert.throws(() => buildSmartPdfCartItem({ ...offer, smart_pdf_offer_token: '' }, context))
})

test('refuses price fields that are not valid USD cents', () => {
  assert.throws(() => buildSmartPdfCartItem({ ...offer, promotion_price_usd: 2.001 }, context))
})

test('refuses manipulated rotation keys', () => {
  assert.throws(() => buildSmartPdfCartItem(offer, { ...context, rotationKey: String(Number(context.rotationKey) + 1) }))
})

test('refuses a mismatched offer expiry', () => {
  assert.throws(() => buildSmartPdfCartItem({ ...offer, expires_at: '2027-01-01T00:00:00.000Z' }, context))
})

test('keeps different-author cart products until the reader confirms replacement', () => {
  const item = buildSmartPdfCartItem(offer, context)
  const existing = [{ id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', author_page_id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd' }]
  const planned = planSmartPdfCart(existing, item)
  assert.equal(planned.conflict, true)
  assert.deepEqual(planned.items, existing)
  const replaced = planSmartPdfCart(existing, item, { replace: true })
  assert.equal(replaced.items.length, 1)
  assert.equal(replaced.items[0].id, item.id)
})

test('replaces an existing PDF without adding duplicates or increasing quantity', () => {
  const item = buildSmartPdfCartItem(offer, context)
  const result = planSmartPdfCart([{ ...item, quantity: 9 }], item)
  assert.equal(result.conflict, false)
  assert.equal(result.items.length, 1)
  assert.equal(result.items[0].quantity, 1)
})

test('preserves other products from the same author', () => {
  const item = buildSmartPdfCartItem(offer, context)
  const sameAuthor = [{ id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', author_page_id: item.author_page_id }]
  const result = planSmartPdfCart(sameAuthor, item)
  assert.equal(result.items.length, 2)
})

test('refuses missing or malformed products', () => {
  assert.throws(() => buildSmartPdfCartItem({ ...offer, author_page_id: '' }, context))
  assert.throws(() => planSmartPdfCart([], { id: 'not-a-pdf' }))
})
