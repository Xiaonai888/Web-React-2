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

    if (url.origin !== API_ORIGIN) {
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

    if (input instanceof Request) {
      return nativeFetch(
        new Request(input, {
          ...init,
          headers,
        })
      )
    }

    return nativeFetch(input, {
      ...init,
      headers,
    })
  }
}
