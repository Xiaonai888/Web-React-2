import test from 'node:test'
import assert from 'node:assert/strict'
import { supportMuteKey, supportMuteUntil, isSupportMuted, readSupportMute, saveSupportMute, searchSupportHistory, supportMediaEntries } from '../src/components/chat/supportChatProfileModel.js'

const items = [
  { id: 'a', message_text: 'Hello world', attachments: [{ type: 'image', storage_key: 'support-chat-media/a.webp' }] },
  { id: 'b', message_text: 'World HELLO', attachments: [{ type: 'image', url: 'https://example.com/image.png' }] },
  { id: 'c', deleted_at: '2026-11-26', message_text: 'hello world', attachments: [{ type: 'image', url: 'https://example.com/deleted.png' }] },
  { id: 'd', message_text: 'Other', attachments: [{ type: 'video', url: 'https://example.com/video' }, 'javascript:alert(1)', 'https://user:password@example.com/image'] },
]

test('search is case insensitive, matches all terms, newest first and excludes deleted', () => {
  assert.deepEqual(searchSupportHistory(items, 'WORLD hello').map(x => x.id), ['b', 'a'])
  assert.deepEqual(searchSupportHistory(items, ' '), [])
  assert.deepEqual(searchSupportHistory(items, 'missing'), [])
})
test('private attachments expose only their message ID; unsafe and deleted attachments excluded', () => {
  const media = supportMediaEntries(items)
  assert.deepEqual(media.map(x => x.messageId), ['b', 'a'])
  assert.equal(media[1].private, true)
  assert.equal(media[1].storage_key, undefined)
  assert.equal(media[1].url, undefined)
})
test('mute keys are scoped to account and conversation', () => {
  assert.notEqual(supportMuteKey('readerA', 'chat'), supportMuteKey('readerB', 'chat'))
  assert.notEqual(supportMuteKey('readerA', 'chat'), supportMuteKey('readerA', 'another'))
  assert.equal(supportMuteKey('guest', 'chat'), '')
  assert.equal(supportMuteKey('readerA', 'chat:bad'), '')
})
test('mute expiry and forever', () => {
  assert.equal(supportMuteUntil('1h', 100), 3600100)
  assert.equal(isSupportMuted(3600100, 3600100), false)
  assert.equal(isSupportMuted(-1), true)
  assert.equal(isSupportMuted(0), false)
  assert.throws(() => supportMuteUntil('invalid'))
})
test('device preference can be saved and removed without affecting another account', () => {
  const map = new Map()
  const storage = { getItem: k => map.get(k), setItem: (k,v) => map.set(k,v), removeItem: k => map.delete(k) }
  saveSupportMute('readerA', 'chat', 'forever', storage)
  assert.equal(readSupportMute('readerA', 'chat', storage), -1)
  assert.equal(readSupportMute('readerB', 'chat', storage), 0)
  saveSupportMute('readerA', 'chat', 'off', storage)
  assert.equal(readSupportMute('readerA', 'chat', storage), 0)
})
