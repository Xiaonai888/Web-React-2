import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PageEmptyState,
  PageHeader,
  PageShell,
  SurfaceCard,
} from '../../components/common/PagePrimitives'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('spinPage', {
  en: {
    title: 'Spin',
    back: 'Go back',
    normal: 'Normal Spin',
    shadow: 'Shadow Spin',
    demo: 'Demo entries',
    equalChance: 'Every entry has the same chance to win.',
    entries: 'Entries',
    spinNow: 'Spin now',
    spinning: 'Spinning...',
    noRepeat: 'No repeat',
    winner: 'Winner',
    keep: 'Keep',
    removeWinner: 'Remove winner',
    spinAgain: 'Spin again',
    shadowNote: 'Shadow Spin uses the same wheel. Prize setup will be connected later.',
    emptyTitle: 'No entries left',
    emptyBody: 'Reset the demo entries to continue testing the wheel.',
    resetDemo: 'Reset demo',
  },
  km: {
    title: 'បង្វិល',
    back: 'ត្រឡប់ក្រោយ',
    normal: 'បង្វិលធម្មតា',
    shadow: 'Shadow Spin',
    demo: 'ទិន្នន័យសាកល្បង',
    equalChance: 'អ្នកចូលរួមគ្រប់រូបមានឱកាសឈ្នះស្មើគ្នា។',
    entries: 'អ្នកចូលរួម',
    spinNow: 'បង្វិលឥឡូវ',
    spinning: 'កំពុងបង្វិល...',
    noRepeat: 'មិនឲ្យឈ្នះដដែល',
    winner: 'អ្នកឈ្នះ',
    keep: 'រក្សាទុក',
    removeWinner: 'ដកអ្នកឈ្នះចេញ',
    spinAgain: 'បង្វិលម្ដងទៀត',
    shadowNote: 'Shadow Spin ប្រើកង់ដូចគ្នា។ ការកំណត់រង្វាន់នឹងភ្ជាប់នៅជំហានបន្ទាប់។',
    emptyTitle: 'មិនមានអ្នកចូលរួមទៀតទេ',
    emptyBody: 'ស្ដារទិន្នន័យសាកល្បងដើម្បីបន្តសាកល្បងកង់។',
    resetDemo: 'ស្ដារទិន្នន័យសាកល្បង',
  },
  zh: {
    title: '转盘',
    back: '返回',
    normal: '普通转盘',
    shadow: 'Shadow Spin',
    demo: '演示名单',
    equalChance: '每个参与者的中奖概率相同。',
    entries: '参与者',
    spinNow: '开始转盘',
    spinning: '转动中...',
    noRepeat: '不重复中奖',
    winner: '获胜者',
    keep: '保留',
    removeWinner: '移除获胜者',
    spinAgain: '再转一次',
    shadowNote: 'Shadow Spin 使用相同的转盘。奖品设置将在下一步连接。',
    emptyTitle: '没有参与者了',
    emptyBody: '重置演示名单以继续测试转盘。',
    resetDemo: '重置演示名单',
  },
  ja: {
    title: 'スピン',
    back: '戻る',
    normal: 'ノーマルスピン',
    shadow: 'Shadow Spin',
    demo: 'デモ参加者',
    equalChance: 'すべての参加者の当選確率は同じです。',
    entries: '参加者',
    spinNow: 'スピンする',
    spinning: 'スピン中...',
    noRepeat: '重複当選なし',
    winner: '当選者',
    keep: '残す',
    removeWinner: '当選者を削除',
    spinAgain: 'もう一度スピン',
    shadowNote: 'Shadow Spin は同じホイールを使います。賞品設定は次の手順で接続します。',
    emptyTitle: '参加者がいません',
    emptyBody: 'デモ参加者をリセットしてテストを続けてください。',
    resetDemo: 'デモをリセット',
  },
  ko: {
    title: '스핀',
    back: '뒤로 가기',
    normal: '일반 스핀',
    shadow: 'Shadow Spin',
    demo: '데모 참가자',
    equalChance: '모든 참가자의 당첨 확률은 같습니다.',
    entries: '참가자',
    spinNow: '지금 돌리기',
    spinning: '돌리는 중...',
    noRepeat: '중복 당첨 없음',
    winner: '당첨자',
    keep: '유지',
    removeWinner: '당첨자 제거',
    spinAgain: '다시 돌리기',
    shadowNote: 'Shadow Spin은 같은 휠을 사용합니다. 상품 설정은 다음 단계에서 연결합니다.',
    emptyTitle: '참가자가 없습니다',
    emptyBody: '데모 참가자를 초기화해 휠 테스트를 계속하세요.',
    resetDemo: '데모 초기화',
  },
})

const DEMO_ENTRIES = [
  { id: 'demo-1', name: 'Sori' },
  { id: 'demo-2', name: 'Mina' },
  { id: 'demo-3', name: 'Dara' },
  { id: 'demo-4', name: 'Yuna' },
  { id: 'demo-5', name: 'Rin' },
  { id: 'demo-6', name: 'Lina' },
]

const WHEEL_COLORS = ['#7c3aed', '#a855f7', '#ec4899', '#f59e0b', '#14b8a6', '#3b82f6']
const SPIN_DURATION_MS = 5600

function getRandomIndex(length) {
  if (length <= 1) return 0

  if (globalThis.crypto?.getRandomValues) {
    const buffer = new Uint32Array(1)
    const range = 0x100000000
    const limit = Math.floor(range / length) * length
    let value = range

    while (value >= limit) {
      globalThis.crypto.getRandomValues(buffer)
      value = buffer[0]
    }

    return value % length
  }

  return Math.floor(Math.random() * length)
}

function buildWheelGradient(entries) {
  if (!entries.length) return 'conic-gradient(#7c3aed 0deg 360deg)'

  const segmentSize = 360 / entries.length
  const segments = entries.map((_, index) => {
    const start = index * segmentSize
    const end = start + segmentSize
    const color = WHEEL_COLORS[index % WHEEL_COLORS.length]
    return `${color} ${start}deg ${end}deg`
  })

  return `conic-gradient(${segments.join(', ')})`
}

function EntryPill({ entry, index }) {
  return (
    <div className="app-elevated flex items-center gap-2 rounded-full px-3 py-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-extrabold text-white">
        {String(index + 1).padStart(2, '0')}
      </div>
      <span className="app-title min-w-0 truncate text-[12px] font-semibold">
        {entry.name}
      </span>
    </div>
  )
}

export default function SpinPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const timeoutRef = useRef(null)
  const [mode, setMode] = useState('normal')
  const [entries, setEntries] = useState(DEMO_ENTRIES)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [noRepeat, setNoRepeat] = useState(false)
  const [blockedIds, setBlockedIds] = useState([])

  const gradient = useMemo(() => buildWheelGradient(entries), [entries])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const spin = () => {
    if (isSpinning || !entries.length) return

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    let candidates = noRepeat
      ? entries.filter((entry) => !blockedIds.includes(entry.id))
      : entries

    if (!candidates.length) {
      candidates = entries
      setBlockedIds([])
    }

    const selected = candidates[getRandomIndex(candidates.length)]
    const winnerIndex = entries.findIndex((entry) => entry.id === selected.id)
    const segmentSize = 360 / entries.length
    const selectedCenter = winnerIndex * segmentSize + segmentSize / 2

    setWinner(null)
    setIsSpinning(true)
    setRotation((current) => {
      const currentNormalized = ((current % 360) + 360) % 360
      const targetNormalized = (360 - selectedCenter + 360) % 360
      const correction = (targetNormalized - currentNormalized + 360) % 360
      return current + 6 * 360 + correction
    })

    timeoutRef.current = window.setTimeout(() => {
      setWinner(selected)
      setIsSpinning(false)

      if (noRepeat) {
        setBlockedIds((current) =>
          current.includes(selected.id) ? current : [...current, selected.id]
        )
      }
    }, SPIN_DURATION_MS)
  }

  const removeWinner = () => {
    if (!winner) return
    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== winner.id))
    setBlockedIds((current) => current.filter((id) => id !== winner.id))
    setWinner(null)
  }

  const resetDemo = () => {
    setEntries(DEMO_ENTRIES)
    setWinner(null)
    setBlockedIds([])
    setRotation(0)
  }

  return (
    <PageShell className="pb-10">
      <PageHeader
        title={t('spinPage.title')}
        onBack={() => navigate(-1)}
        backLabel={t('spinPage.back')}
      />

      <main className="mx-auto w-full max-w-[960px] px-4 py-5">
        <div className="app-card mb-5 grid grid-cols-2 rounded-[16px] border p-1.5">
          <button
            type="button"
            onClick={() => setMode('normal')}
            className={`rounded-[12px] px-3 py-2.5 text-[12px] font-extrabold transition ${
              mode === 'normal'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'app-muted hover:bg-[var(--shadow-bg-hover)]'
            }`}
          >
            {t('spinPage.normal')}
          </button>

          <button
            type="button"
            onClick={() => setMode('shadow')}
            className={`rounded-[12px] px-3 py-2.5 text-[12px] font-extrabold transition ${
              mode === 'shadow'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'app-muted hover:bg-[var(--shadow-bg-hover)]'
            }`}
          >
            {t('spinPage.shadow')}
          </button>
        </div>

        {mode === 'shadow' ? (
          <SurfaceCard className="mb-5 border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-violet-600 text-white">
                <i className="fa-solid fa-gift text-[16px]" />
              </div>
              <p className="app-muted text-[12px] leading-5">
                {t('spinPage.shadowNote')}
              </p>
            </div>
          </SurfaceCard>
        ) : null}

        {!entries.length ? (
          <PageEmptyState
            title={t('spinPage.emptyTitle')}
            body={t('spinPage.emptyBody')}
            actionLabel={t('spinPage.resetDemo')}
            onAction={resetDemo}
            icon={<i className="fa-solid fa-dharmachakra text-[20px]" />}
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
            <SurfaceCard className="overflow-hidden p-4 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="app-title text-[16px] font-extrabold">
                    {t('spinPage.demo')}
                  </div>
                  <div className="app-muted mt-1 text-[11px] leading-5">
                    {t('spinPage.equalChance')}
                  </div>
                </div>

                <label className="app-muted flex shrink-0 cursor-pointer items-center gap-2 text-[11px] font-semibold">
                  <input
                    type="checkbox"
                    checked={noRepeat}
                    onChange={(event) => setNoRepeat(event.target.checked)}
                    disabled={isSpinning}
                    className="h-4 w-4 rounded border-[var(--shadow-border)]"
                  />
                  {t('spinPage.noRepeat')}
                </label>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[390px] p-5 sm:p-7">
                <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
                  <div className="h-0 w-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-violet-700 drop-shadow-md" />
                </div>

                <div
                  className="relative h-full w-full rounded-full border-[10px] border-[var(--shadow-bg-surface)] shadow-[0_18px_45px_rgba(76,29,149,0.24)] ring-1 ring-[var(--shadow-border)]"
                  style={{
                    background: gradient,
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.72, 0.05, 1)`
                      : 'none',
                  }}
                >
                  <div className="absolute inset-[34%] rounded-full bg-[var(--shadow-bg-surface)] shadow-lg ring-1 ring-[var(--shadow-border)]" />
                </div>

                <button
                  type="button"
                  onClick={spin}
                  disabled={isSpinning}
                  className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-violet-700 px-3 text-center text-[12px] font-black text-white shadow-xl ring-8 ring-white/25 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isSpinning ? t('spinPage.spinning') : t('spinPage.spinNow')}
                </button>
              </div>
            </SurfaceCard>

            <div className="space-y-5">
              <SurfaceCard className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="app-title text-[14px] font-extrabold">
                    {t('spinPage.entries')}
                  </h2>
                  <span className="app-muted text-[11px] font-semibold">
                    {entries.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                  {entries.map((entry, index) => (
                    <EntryPill key={entry.id} entry={entry} index={index} />
                  ))}
                </div>
              </SurfaceCard>

              {winner ? (
                <SurfaceCard className="border-violet-500/30 p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white">
                    <i className="fa-solid fa-trophy text-[18px]" />
                  </div>
                  <div className="app-muted mt-3 text-[11px] font-bold uppercase tracking-[0.14em]">
                    {t('spinPage.winner')}
                  </div>
                  <div className="app-title mt-1 text-[24px] font-black">
                    {winner.name}
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                    <button
                      type="button"
                      onClick={() => setWinner(null)}
                      className="rounded-[12px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-3 text-[12px] font-extrabold text-[var(--shadow-text-primary)] active:scale-[0.98]"
                    >
                      {t('spinPage.keep')}
                    </button>
                    <button
                      type="button"
                      onClick={removeWinner}
                      className="rounded-[12px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] font-extrabold text-red-500 active:scale-[0.98]"
                    >
                      {t('spinPage.removeWinner')}
                    </button>
                    <button
                      type="button"
                      onClick={spin}
                      disabled={isSpinning}
                      className="rounded-[12px] bg-violet-600 px-4 py-3 text-[12px] font-extrabold text-white active:scale-[0.98] disabled:opacity-70"
                    >
                      {t('spinPage.spinAgain')}
                    </button>
                  </div>
                </SurfaceCard>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </PageShell>
  )
}
