const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

const API_ORIGIN = new URL(
  API_BASE_URL,
  window.location.origin
).origin

function handleReaderSessionResponse(fetchPromise, requestToken) {
  return fetchPromise.then((response) => {
    const renewedToken =
      response.headers.get('X-Reader-Token')

    const currentToken =
      sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') ||
      ''

    if (renewedToken && requestToken && currentToken === requestToken) {
      if (sessionStorage.getItem('shadow_reader_token') === requestToken) {
        sessionStorage.setItem('shadow_reader_token', renewedToken)
      }

      if (localStorage.getItem('shadow_reader_token') === requestToken) {
        localStorage.setItem('shadow_reader_token', renewedToken)
      }
    }

    return response
  })
}

export function installApiAuthFetch() {
  if (window.__shadowApiAuthFetchInstalled) return

  window.__shadowApiAuthFetchInstalled = true

  const nativeFetch = window.fetch.bind(window)

  window.fetch = (input, init = {}) => {
    const requestUrl =
      input instanceof Request
        ? input.url
        : String(input)

    const url = new URL(
      requestUrl,
      window.location.origin
    )

    const method = String(init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
    if (
      url.origin !== API_ORIGIN ||
      (method === 'GET' && ['/health/maintenance', '/api/advertisements/public', '/api/public/content-versions', '/api/events'].includes(url.pathname))
    ) {
      return nativeFetch(input, init)
    }

    const token =
      sessionStorage.getItem('shadow_reader_token') ||
      localStorage.getItem('shadow_reader_token') ||
      ''

    if (!token) {
      return nativeFetch(input, init)
    }

    const headers = new Headers(
      input instanceof Request
        ? input.headers
        : undefined
    )

    new Headers(init.headers || {}).forEach(
      (value, key) => {
        headers.set(key, value)
      }
    )

    if (!headers.has('Authorization')) {
      headers.set(
        'Authorization',
        `Bearer ${token}`
      )
    }

    const authorization = headers.get('Authorization') || ''
    const requestToken = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : ''

    if (input instanceof Request) {
      return handleReaderSessionResponse(
        nativeFetch(
          new Request(input, {
            ...init,
            headers,
          })
        ),
        requestToken
      )
    }

    return handleReaderSessionResponse(
      nativeFetch(input, {
        ...init,
        headers,
      }),
      requestToken
    )
  }
}
