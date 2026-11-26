import test from 'node:test'
import assert from 'node:assert/strict'
import { inspectPopupSurface } from '../src/utils/popupUiDiagnostics.js'

const normal = {
  kind: 'episode-list',
  visible: true,
  themeTokenValue: '#fafafe',
  backgroundColor: 'rgb(250, 250, 254)',
  backgroundImage: 'none',
}

test('normal light and dark surfaces produce no error', () => {
  assert.deepEqual(inspectPopupSurface(normal), [])
  assert.deepEqual(inspectPopupSurface({ ...normal, themeTokenValue: '#202331', backgroundColor: 'rgb(32, 35, 49)' }), [])
})

test('transparent surface without a background image is detected', () => {
  for (const backgroundColor of ['transparent', 'rgba(0, 0, 0, 0)', 'rgb(0 0 0 / 0%)', 'color(srgb 0 0 0 / 0)', '#0000', '#00000000']) {
    assert.deepEqual(inspectPopupSurface({ ...normal, backgroundColor }), ['UI_BACKGROUND_MISSING'])
  }
})

test('partial opacity and background images are not reported as missing', () => {
  assert.deepEqual(inspectPopupSurface({ ...normal, backgroundColor: 'rgba(0, 0, 0, 0.98)' }), [])
  assert.deepEqual(inspectPopupSurface({ ...normal, backgroundColor: 'transparent', backgroundImage: 'present' }), [])
})

test('missing theme token is distinct from a missing background', () => {
  assert.deepEqual(inspectPopupSurface({ ...normal, themeTokenValue: '' }), ['UI_THEME_TOKEN_MISSING'])
  assert.deepEqual(inspectPopupSurface({ ...normal, themeTokenValue: '', backgroundColor: 'transparent' }), ['UI_THEME_TOKEN_MISSING', 'UI_BACKGROUND_MISSING'])
})

test('unrecognized, hidden and absent panels are ignored', () => {
  assert.deepEqual(inspectPopupSurface(null), [])
  assert.deepEqual(inspectPopupSurface({ ...normal, visible: false, backgroundColor: 'transparent' }), [])
  assert.deepEqual(inspectPopupSurface({ ...normal, kind: 'other', backgroundColor: 'transparent' }), [])
})

test('all three intended popup kinds are supported', () => {
  for (const kind of ['episode-list', 'story-comments', 'post-comments']) {
    assert.deepEqual(inspectPopupSurface({ ...normal, kind, backgroundColor: 'transparent' }), ['UI_BACKGROUND_MISSING'])
  }
})
