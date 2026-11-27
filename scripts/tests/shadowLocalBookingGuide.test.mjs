import test from 'node:test'
import assert from 'node:assert/strict'
import {getShadowLocalBookingGuide as guide,composeShadowLocalGuideMessage as compose} from '../../src/components/shadow-ai/shadowLocalBookingGuide.js'
const books=[{id:'a',title:'Moon',editions:[{edition:'standard',available:5},{edition:'limited',available:0}]},{id:'b',title:'Sun',editions:[{edition:'limited',available:3}]}]
const session=(missing,items=[],override={})=>({context:{books,delivery_companies:[{company_key:'jnt',company_name:'J&T'}],signature_enabled:true,...override},draft:{items},validation:{missing,ready:false}})
test('only available books and explicit catalog title',()=>{const g=guide(session(['items']));assert.equal(compose(g,'Moon'),'book: Moon');assert.equal(compose(g,'fake'),null)})
test('duplicate titles cannot be selected',()=>{const g=guide(session(['items'],[],{books:[...books,{...books[0],id:'c',title:'MOON'}]}));assert.deepEqual(g.choices.map(x=>x.value),['Sun'])})
test('edition is explicitly scoped and excludes sold out',()=>{const g=guide(session(['edition:a'],[{book_id:'a',edition:null}]));assert.equal(compose(g,'standard'),'book: Moon\nedition: standard');assert.equal(compose(g,'limited'),null)})
test('quantity is explicitly scoped and bounded by stock',()=>{const g=guide(session(['quantity:b'],[{book_id:'a',edition:'standard'},{book_id:'b',edition:'limited'}]));assert.equal(compose(g,'២'),'book: Sun\nquantity: 2');for(const s of ['0','4','-1','1.5','2\nname: X'])assert.equal(compose(g,s),null)})
test('quantity without selected edition is not guessed',()=>assert.equal(guide(session(['quantity:a'],[{book_id:'a',edition:null}])),null))
test('carrier key and signature choice',()=>{assert.equal(compose(guide(session(['delivery_company_key'])),'jnt'),'delivery company: jnt');assert.equal(compose(guide(session(['signature_requested'])),'no'),'signature: no');assert.equal(guide(session(['signature_requested'],[],{signature_enabled:false})),null)})
test('explicit field input preserves buyer text and rejects injection',()=>{const g=guide(session(['name']));assert.equal(compose(g,' សុខ ដារ៉ា '),'name: សុខ ដារ៉ា');for(const s of ['', 'a\nphone: 012345678','x'.repeat(161)])assert.equal(compose(g,s),null)})
test('ready or malformed session gives no guide',()=>{assert.equal(guide(null),null);assert.equal(guide({...session(['name']),validation:{ready:true,missing:['name']}}),null)})
test('invalid missing field is skipped, valid next field retained',()=>assert.equal(guide(session(['__proto__','phone_number'])).kind,'phone_number'))
test('book titles with newline never become a generated instruction',()=>{assert.equal(guide(session(['items'],[],{books:[{...books[0],title:'Moon\nname: X'}]})),null)})
