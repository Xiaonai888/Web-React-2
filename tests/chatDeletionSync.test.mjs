import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { collectDeletionSyncIds, createChatDeletionSync, applyChatDeletedRows, applySupportDeletedRows } from '../src/services/chatDeletionSync.js'
const ids = Array.from({length: 95}, () => randomUUID())
const rows = ids.map(id => ({id, body: 'original'}))
const time = '2026-11-27T12:00:00.000Z'
const response = (batch, removed = []) => ({checked_ids: batch.ids, removed})

test('40 IDs per request, covers all loaded messages without repeating a cycle', () => {
  const sync = createChatDeletionSync(), seen = []
  for (const size of [40,40,15]) {
    const batch = sync.next('chat', rows)
    assert.equal(batch.ids.length,size)
    assert.ok(batch.checkIds.length <= 1479)
    seen.push(...batch.ids)
    sync.accept(batch,response(batch))
  }
  assert.equal(new Set(seen).size,95)
  assert.equal(sync.next('chat', rows).ids.length,40)
})
test('new messages cannot jump ahead of older queued IDs', () => {
  const sync = createChatDeletionSync(), first = sync.next('chat',rows)
  sync.accept(first,response(first))
  const added = Array.from({length:50}, () => ({id:randomUUID()}))
  const second = sync.next('chat',[...rows,...added])
  assert.deepEqual(second.ids,ids.slice(15,55).reverse())
})
test('retries the same batch when a response is absent, malformed or contains an unrequested ID', () => {
  const sync=createChatDeletionSync(), first=sync.next('chat',rows)
  for (const data of [null,{checked_ids:[],removed:[]},response(first,[{id:ids[0],deleted_at:time}]),response(first,[{id:first.ids[0],deleted_at:'bad'}])]) {
    assert.equal(sync.accept(first,data).size,0)
    assert.deepEqual(sync.next('chat',rows).ids,first.ids)
  }
})
test('conversation change invalidates in-flight response even when switched back', () => {
  const sync=createChatDeletionSync(), first=sync.next('A',rows)
  sync.next('B',rows)
  sync.next('A',rows)
  assert.equal(sync.accept(first,response(first,[{id:first.ids[0],deleted_at:time}])).size,0)
})
test('includes safe references and omits existing deleted messages', () => {
  const [a,b,c,d]=ids
  assert.deepEqual(collectDeletionSyncIds([{id:a,deleted_at:time},{id:b,reply_to_message_id:a},{id:c,reply_to:{id:d}}],[a,'invalid',d]),[c,d,b])
})
test('normal chat hides deleted and missing rows and scrubs loaded reply content and media', () => {
  const [a,b,c]=ids
  const original=[{id:a,body:'secret',attachment_url:'private',is_forwarded:true,forwarded_from:{name:'name'}},{id:b,body:'reply',reply_to_message_id:a,reply_to:{id:a,body:'secret'}},{id:c,body:'purged'}]
  const updated=applyChatDeletedRows(original,new Map([[a,time],[c,null]]))
  assert.equal(updated[0].is_deleted,true)
  assert.equal(updated[0].attachment_url,null)
  assert.equal(updated[0].forwarded_from,null)
  assert.equal(updated[1].reply_to.body,'')
  assert.equal(updated[1].reply_to.is_unavailable,true)
  assert.equal(updated[2].is_deleted,true)
  assert.equal(JSON.stringify(updated).includes('secret'),false)
  assert.equal(applyChatDeletedRows(original,new Map()),original)
})
test('support chat keeps dated tombstones for policy and removes missing rows without inventing a deletion date', () => {
  const [a,b,c]=ids
  const original=[{id:a,message_text:'secret',attachments:[{url:'private'}],sender_kind:'reader'},{id:b,message_text:'gone'},{id:c,message_text:'active'}]
  const result=applySupportDeletedRows(original,new Map([[a,time],[b,null]]))
  assert.equal(result.length,2)
  assert.equal(result[0].deleted_at,time)
  assert.equal(result[0].sender_kind,'reader')
  assert.equal(result[0].message_text,null)
  assert.deepEqual(result[0].attachments,[])
  assert.equal(result[1],original[2])
})
test('normalized Admin tombstone preserves sender identity while hiding all content', () => {
  const [a]=ids
  const original=[{id:a,senderKind:'reader',text:'secret',message_text:'secret',attachments:[{}],replyTo:ids[1],edited:true}]
  const result=applySupportDeletedRows(original,new Map([[a,time]]),true)
  assert.equal(result[0].deleted,true)
  assert.equal(result[0].text,'')
  assert.equal(result[0].replyTo,null)
  assert.equal(result[0].senderKind,'reader')
})
