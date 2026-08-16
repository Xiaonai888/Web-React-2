export const DEFAULT_REACTION_TYPE = 'love'
export const REACTION_LONG_PRESS_MS = 420

export const REACTIONS = Object.freeze([
  {
    type: 'love',
    label: 'Love',
    src: '/assets/React/Love.svg',
    text: '#ff2f5f',
    bg: '#fff0f4',
  },
  {
    type: 'haha',
    label: 'Haha',
    src: '/assets/React/Haha.svg',
    text: '#f59e0b',
    bg: '#fff7d8',
  },
  {
    type: 'wow',
    label: 'Wow',
    src: '/assets/React/Wow.svg',
    text: '#f59e0b',
    bg: '#fff7d8',
  },
  {
    type: 'sad',
    label: 'Sad',
    src: '/assets/React/Sad.svg',
    text: '#3b82f6',
    bg: '#eaf4ff',
  },
  {
    type: 'angry',
    label: 'Angry',
    src: '/assets/React/Angry.svg',
    text: '#ef4444',
    bg: '#fff1e8',
  },
  {
    type: 'support',
    label: 'Support',
    src: '/assets/React/Support.svg',
    text: '#16a34a',
    bg: '#edfdf3',
  },
  {
    type: 'touched',
    label: 'Touched',
    src: '/assets/React/Touched.svg',
    text: '#8b5cf6',
    bg: '#f5f0ff',
  },
])

export function getReactionMeta(type) {
  const safeType = String(type || '')
    .trim()
    .toLowerCase()

  return (
    REACTIONS.find(
      (reaction) =>
        reaction.type === safeType
    ) || null
  )
}

export function isReactionType(type) {
  return Boolean(getReactionMeta(type))
}

export function formatReactionCount(value) {
  const number = Number(value || 0)

  if (!Number.isFinite(number)) {
    return '0'
  }

  if (number >= 1000000) {
    return `${(
      number / 1000000
    ).toFixed(
      number >= 10000000 ? 0 : 1
    )}M`
  }

  if (number >= 1000) {
    return `${(
      number / 1000
    ).toFixed(
      number >= 10000 ? 0 : 1
    )}k`
  }

  return String(number)
}
