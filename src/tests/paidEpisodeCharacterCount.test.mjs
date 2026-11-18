import assert from 'node:assert/strict'
import test from 'node:test'
import {
  countPaidNovelCharacters,
  PAID_NOVEL_MINIMUMS,
  FREE_PUBLISHED_EPISODE_LIMIT,
} from '../utils/paidEpisodeCharacterCount.js'

test('Khmer paid character count ignores whitespace but keeps combining marks', () => {
  assert.equal(countPaidNovelCharacters('ក ា ខ ្ ម ែ រ'), Array.from('កាខ្មែរ').length)
  assert.equal(countPaidNovelCharacters('ខ្មែរ\n សួស្តី'), Array.from('ខ្មែរសួស្តី').length)
})

test('HTML markup, paragraphs and images are not counted', () => {
  assert.equal(countPaidNovelCharacters('<p>សួស្តី&nbsp; បង</p><p><strong>ខ្មែរ</strong></p><img src="x">'),
    Array.from('សួស្តីបងខ្មែរ').length)
})

test('common HTML entities decode once like backend', () => {
  assert.equal(countPaidNovelCharacters('<p>&lt;&gt;&quot;&#039;&amp;</p>'), 5)
  assert.equal(countPaidNovelCharacters('❤️ 💙'), Array.from('❤️💙').length)
})

test('paid minimums and automatic free limit match server', () => {
  assert.deepEqual(PAID_NOVEL_MINIMUMS, { Khmer: 7000, English: 5000, Chinese: 3000, Japanese: 3000, Korean: 4000 })
  assert.equal(FREE_PUBLISHED_EPISODE_LIMIT, 5)
})
