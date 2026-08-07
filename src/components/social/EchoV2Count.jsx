import { useEffect, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://shadow-backend-kucw.onrender.com'

function getReaderToken() {
  return (
    sessionStorage.getItem('shadow_reader_token') ||
    localStorage.getItem('shadow_reader_token') ||
    ''
  )
}

function formatCompactNumber(value) {
  const number = Math.max(0, Number(value || 0))

  if (number >= 1000000) {
    return `${(number / 1000000)
      .toFixed(number >= 10000000 ? 0 : 1)
      .replace(/\.0$/, '')}m`
  }

  if (number >= 1000) {
    return `${(number / 1000)
      .toFixed(number >= 10000 ? 0 : 1)
      .replace(/\.0$/, '')}k`
  }

  return String(number)
}

export default function EchoV2Count({
  sourceType,
  sourceId,
  fallback = 0,
}) {
  const [count, setCount] = useState(
    Math.max(0, Number(fallback || 0))
  )

  useEffect(() => {
    setCount(
      Math.max(0, Number(fallback || 0))
    )
  }, [fallback, sourceId, sourceType])

  useEffect(() => {
    const type = String(sourceType || '')
      .trim()
      .toLowerCase()
    const id = String(sourceId || '').trim()

    if (!type || !id) return undefined

    let ignore = false

    async function loadCount() {
      try {
        const token = getReaderToken()
        const response = await fetch(
          `${API_BASE_URL}/api/echo-v2/source/${encodeURIComponent(
            type
          )}/${encodeURIComponent(id)}?limit=1`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
            cache: 'no-store',
          }
        )

        const data = await response
          .json()
          .catch(() => ({}))

        if (
          ignore ||
          !response.ok ||
          data.ok === false
        ) {
          return
        }

        setCount(
          Math.max(
            0,
            Number(data.echo_count || 0)
          )
        )
      } catch {
      }
    }

    const handleUpdated = (event) => {
      const detail = event?.detail || {}

      if (
        String(detail.sourceType || '') === type &&
        String(detail.sourceId || '') === id
      ) {
        setCount(
          Math.max(
            0,
            Number(detail.echoCount || 0)
          )
        )
      }
    }

    window.addEventListener(
      'shadow:echo-v2-updated',
      handleUpdated
    )

    loadCount()

    return () => {
      ignore = true
      window.removeEventListener(
        'shadow:echo-v2-updated',
        handleUpdated
      )
    }
  }, [sourceId, sourceType])

  return <>{formatCompactNumber(count)}</>
}
