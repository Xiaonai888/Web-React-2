import test from 'node:test'
import assert from 'node:assert/strict'
import { inspectShadowReadEventWeb } from './shadowReadEventPreflight.mjs'

const snippets = {
  'src/App.jsx': 'export default function App() {}',
  'src/pages/Event/ShadowReadEventPage.jsx': `
    import ReadEventMissionBoard from './ReadEventMissionBoard'
    import ReadEventLeaderboards from './ReadEventLeaderboards'
    km: { },
    en: { },
    zh: { },
    ko: { },
    ja: { },
    redemption_enabled: false
  `,
  'src/pages/Event/ShadowReadEventRewardsPage.jsx': `
    import ReadEventFeaturedCardWallet from './ReadEventFeaturedCardWallet'
    import ReadEventRewardHistory from './ReadEventRewardHistory'
    km: { },
    en: { },
    zh: { },
    ko: { },
    ja: { },
    redemption_enabled
  `,
  'src/components/events/shadowReadEvent/ReadEventMissionBoard.jsx': 'export default function ReadEventMissionBoard() {}',
  'src/components/events/shadowReadEvent/ReadEventLeaderboards.jsx': 'export default function ReadEventLeaderboards() {}',
  'src/components/events/shadowReadEvent/ReadEventFeaturedCardWallet.jsx': 'export default function ReadEventFeaturedCardWallet() {}',
  'src/components/events/shadowReadEvent/ReadEventRewardHistory.jsx': 'export default function ReadEventRewardHistory() {}',
  'src/services/shadowReadEventClient.js': "const API_PATH = '/api/read-event'",
  'src/services/shadowReadEventRewardsClient.js': "const API_PATH = '/api/read-event/rewards'",
}

const inspect = (overrides = {}) => inspectShadowReadEventWeb({
  root: '/fake',
  read: (_, path) => ({ ...snippets, ...overrides })[path] ?? null,
})

test('staged pages can pass checks while routes remain pending', () => {
  const result = inspect()
  assert.equal(result.ok, true)
  assert.equal(result.integration_complete, false)
  assert.deepEqual(result.pending, [
    'MAIN_READER_ROUTE_NOT_CONNECTED', 'READER_REWARDS_ROUTE_NOT_CONNECTED',
  ])
})

test('catches inverted mission and leaderboard components', () => {
  const result = inspect({
    'src/components/events/shadowReadEvent/ReadEventMissionBoard.jsx': 'export default function ReadEventLeaderboards() {}',
  })
  assert.equal(result.ok, false)
  assert.ok(result.blockers.includes('MISSION_COMPONENT_EXPORT'))
})

test('checks all five display languages', () => {
  const result = inspect({
    'src/pages/Event/ShadowReadEventRewardsPage.jsx': snippets['src/pages/Event/ShadowReadEventRewardsPage.jsx'].replace('ja: { },', ''),
  })
  assert.ok(result.blockers.includes('DISPLAY_LANGUAGE:rewardsPage:ja'))
})

test('detects accidental polling in main event page', () => {
  const result = inspect({
    'src/pages/Event/ShadowReadEventPage.jsx': snippets['src/pages/Event/ShadowReadEventPage.jsx'] + '\nsetInterval(fetchData, 1000)',
  })
  assert.ok(result.blockers.includes('UNNECESSARY_POLLING:page'))
})

test('marks routes connected only after App includes both page names', () => {
  const result = inspect({
    'src/App.jsx': 'ShadowReadEventPage; ShadowReadEventRewardsPage;',
  })
  assert.equal(result.ok, true)
  assert.equal(result.integration_complete, true)
})
