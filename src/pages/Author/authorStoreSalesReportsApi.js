const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com'

function getAuthToken() {
  return (
    localStorage.getItem('shadow_reader_token') ||
    sessionStorage.getItem('shadow_reader_token') ||
    ''
  )
}

async function requestSalesReports(path, options = {}) {
  const token = getAuthToken()

  if (!token) throw new Error('Please login first')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || 'Sales Reports request failed')
  }

  return data
}

export function fetchSalesReportsSettings() {
  return requestSalesReports('/api/author-store/me/sales-reports')
}

export function connectSalesReports(spreadsheetUrl) {
  return requestSalesReports('/api/author-store/me/sales-reports/connect', {
    method: 'POST',
    body: JSON.stringify({
      spreadsheet_url: spreadsheetUrl,
    }),
  })
}

export function syncSalesReports() {
  return requestSalesReports('/api/author-store/me/sales-reports/sync', {
    method: 'POST',
  })
}

export function disconnectSalesReports() {
  return requestSalesReports('/api/author-store/me/sales-reports/disconnect', {
    method: 'DELETE',
  })
}
