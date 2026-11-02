import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const files = {
  app: 'src/App.jsx',
  page: 'src/pages/Event/ShadowReadEventPage.jsx',
  rewardsPage: 'src/pages/Event/ShadowReadEventRewardsPage.jsx',
  missions: 'src/components/events/shadowReadEvent/ReadEventMissionBoard.jsx',
  leaderboards: 'src/components/events/shadowReadEvent/ReadEventLeaderboards.jsx',
  wallet: 'src/components/events/shadowReadEvent/ReadEventFeaturedCardWallet.jsx',
  history: 'src/components/events/shadowReadEvent/ReadEventRewardHistory.jsx',
  eventClient: 'src/services/shadowReadEventClient.js',
  rewardsClient: 'src/services/shadowReadEventRewardsClient.js',
}

function source(root, filename) {
  try { return readFileSync(join(root, filename), 'utf8') } catch { return null }
}

export function inspectShadowReadEventWeb({ root = ROOT, read = source } = {}) {
  const items = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, read(root, path)]))
  const blockers = []
  const pending = []
  const verified = []
  const requireMatch = (key, re, code) => {
    if (typeof items[key] !== 'string' || !re.test(items[key])) blockers.push(code)
    else verified.push(code)
  }

  for (const [key, filename] of Object.entries(files)) {
    if (items[key] === null) blockers.push(`FILE_MISSING:${filename}`)
  }

  requireMatch('missions', /export default function ReadEventMissionBoard\s*\(/, 'MISSION_COMPONENT_EXPORT')
  requireMatch('leaderboards', /export default function ReadEventLeaderboards\s*\(/, 'LEADERBOARD_COMPONENT_EXPORT')
  requireMatch('wallet', /export default function ReadEventFeaturedCardWallet\s*\(/, 'WALLET_COMPONENT_EXPORT')
  requireMatch('history', /export default function ReadEventRewardHistory\s*\(/, 'REWARD_HISTORY_COMPONENT_EXPORT')
  requireMatch('page', /import ReadEventMissionBoard from .*ReadEventMissionBoard/, 'MISSION_PAGE_IMPORT')
  requireMatch('page', /import ReadEventLeaderboards from .*ReadEventLeaderboards/, 'LEADERBOARD_PAGE_IMPORT')
  requireMatch('rewardsPage', /import ReadEventFeaturedCardWallet from .*ReadEventFeaturedCardWallet/, 'WALLET_PAGE_IMPORT')
  requireMatch('rewardsPage', /import ReadEventRewardHistory from .*ReadEventRewardHistory/, 'HISTORY_PAGE_IMPORT')
  requireMatch('eventClient', /const API_PATH\s*=\s*['"]\/api\/read-event['"]/, 'EVENT_API_PATH')
  requireMatch('rewardsClient', /const API_PATH\s*=\s*['"]\/api\/read-event\/rewards['"]/, 'REWARDS_API_PATH')
  requireMatch('rewardsPage', /redemption_enabled/, 'REDEMPTION_KILL_SWITCH_DISPLAY')

  for (const key of ['page', 'rewardsPage']) {
    for (const language of ['km', 'en', 'zh', 'ko', 'ja']) {
      requireMatch(key, new RegExp(`(?:^|\\n)\\s*${language}:\\s*\\{`),
        `DISPLAY_LANGUAGE:${key}:${language}`)
    }
  }

  for (const key of ['page', 'rewardsPage']) {
    if (typeof items[key] === 'string' && /\bsetInterval\s*\(/.test(items[key])) {
      blockers.push(`UNNECESSARY_POLLING:${key}`)
    }
  }

  if (typeof items.app === 'string' && !items.app.includes('ShadowReadEventPage')) {
    pending.push('MAIN_READER_ROUTE_NOT_CONNECTED')
  }
  if (typeof items.app === 'string' && !items.app.includes('ShadowReadEventRewardsPage')) {
    pending.push('READER_REWARDS_ROUTE_NOT_CONNECTED')
  }

  return {
    ok: blockers.length === 0,
    read_only: true,
    integration_complete: blockers.length === 0 && pending.length === 0,
    blockers: [...new Set(blockers)],
    pending,
    verified,
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = inspectShadowReadEventWeb()
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  if (!report.ok) process.exitCode = 1
}
