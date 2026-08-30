const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

export async function recordAuthorPostClick(
  postId,
  targetUrl
) {
  if (!postId || !targetUrl) return

  const token = getAuthToken()

  try {
    await fetch(
      `${API_BASE_URL}/api/authors/page/posts/${encodeURIComponent(
        postId
      )}/clicks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          target_url: targetUrl,
        }),
        keepalive: true,
      }
    )
  } catch {
    return
  }
}
