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
