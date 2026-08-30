const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export async function fetchAuthorHashtagSuggestions(
  prefix = '',
  { limit = 8, signal } = {}
) {
  const token = getReaderToken()

  if (!token) {
    return []
  }

  const params = new URLSearchParams({
    q: String(prefix || '')
      .replace(/^#+/, '')
      .trim(),
    limit: String(
      Math.min(10, Math.max(1, Number(limit) || 8))
    ),
  })

  const response = await fetch(
    `${API_BASE_URL}/api/authors/hashtags/suggest?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal,
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(
      data.message || 'Failed to load hashtag suggestions'
    )
  }

  return Array.isArray(data.suggestions)
    ? data.suggestions
    : []
}

export async function recordAuthorHashtagInterest(
  tag,
  signal = 'hashtag_click'
) {
  const token = getReaderToken()

  if (!token) {
    return false
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/authors/hashtags/interest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tag: String(tag || '').trim(),
          signal,
        }),
        keepalive: true,
      }
    )

    if (!response.ok) {
      return false
    }

    const data = await response.json().catch(() => ({}))
    return data.ok !== false
  } catch {
    return false
  }
}
