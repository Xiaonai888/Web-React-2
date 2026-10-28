import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import StoryLanguageOnboardingModal from './StoryLanguageOnboardingModal'

const PENDING = 'shadow_story_onboarding_pending_v1:'
const DONE = 'shadow_story_onboarding_done_v1:'

function readerId() {
  try {
    const raw = localStorage.getItem('shadow_reader_user') ||
      sessionStorage.getItem('shadow_reader_user') || 'null'
    return String(JSON.parse(raw)?.id || '')
  } catch {
    return ''
  }
}

export function hasPendingStoryLanguageOnboarding() {
  try {
    const token = sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token')
    const id = readerId()
    return Boolean(token && id &&
      localStorage.getItem(PENDING + id) === '1' &&
      localStorage.getItem(DONE + id) !== '1')
  } catch {
    return false
  }
}

export default function StoryLanguageOnboardingGate() {
  const location = useLocation()
  const [dismissedId, setDismissedId] = useState('')
  const firstLocationKey = useRef(null)
  const id = readerId()
  const open = Boolean(
    id && dismissedId !== id &&
    location.pathname !== '/login' &&
    location.pathname !== '/register' &&
    hasPendingStoryLanguageOnboarding()
  )

  useEffect(() => {
    if (!open) {
      firstLocationKey.current = null
      return
    }
    if (firstLocationKey.current === null) {
      firstLocationKey.current = location.key
      return
    }
    if (firstLocationKey.current === location.key) return

    try {
      localStorage.setItem(DONE + id, '1')
      localStorage.removeItem(PENDING + id)
    } catch {}
    setDismissedId(id)

    // The existing Mine Settings sheet reads URL parameters on mount.
    // Reload only for this settings deep link to open Story Language directly.
    if (location.pathname === '/me' &&
        new URLSearchParams(location.search).get('language') === 'story') {
      window.location.reload()
    }
  }, [open, id, location.key, location.pathname, location.search])

  return <StoryLanguageOnboardingModal open={open} />
}
