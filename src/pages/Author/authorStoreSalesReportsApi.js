import { API_BASE_URL, getAuthToken } from '../../config/api'

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
