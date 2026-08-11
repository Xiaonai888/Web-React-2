let audioContext = null

const TONE_PATTERNS = {
  default: [
    [740, 0, 0.08, 0.045],
    [980, 0.1, 0.1, 0.04],
  ],
  chime: [
    [660, 0, 0.12, 0.04],
    [880, 0.11, 0.16, 0.035],
    [1320, 0.23, 0.18, 0.03],
  ],
  pop: [
    [520, 0, 0.07, 0.055],
    [780, 0.06, 0.08, 0.04],
  ],
  bell: [
    [880, 0, 0.2, 0.035],
    [1760, 0.02, 0.28, 0.02],
  ],
}

function getAudioContext() {
  if (typeof window === 'undefined') return null

  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext

  if (!AudioContextClass) return null

  if (!audioContext) {
    audioContext = new AudioContextClass()
  }

  return audioContext
}

export async function primeChatNotificationSound() {
  const context = getAudioContext()

  if (!context) return false

  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return false
    }
  }

  return context.state === 'running'
}

export async function playChatNotificationTone(
  tone = 'default'
) {
  const context = getAudioContext()

  if (!context) return false

  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return false
    }
  }

  if (context.state !== 'running') {
    return false
  }

  const pattern =
    TONE_PATTERNS[tone] ||
    TONE_PATTERNS.default
  const startTime = context.currentTime

  pattern.forEach(
    ([frequency, delay, duration, volume]) => {
      const oscillator =
        context.createOscillator()
      const gain = context.createGain()
      const startsAt = startTime + delay
      const endsAt = startsAt + duration

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(
        frequency,
        startsAt
      )

      gain.gain.setValueAtTime(0, startsAt)
      gain.gain.linearRampToValueAtTime(
        volume,
        startsAt + 0.015
      )
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        endsAt
      )

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start(startsAt)
      oscillator.stop(endsAt + 0.02)
    }
  )

  return true
}
