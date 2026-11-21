import { API_BASE_URL, getAuthToken } from '../config/api'
import {
  normalizeCustomDeliveryCompany,
  validateCustomDeliveryCompanyInput,
} from '../utils/customDeliveryCompany'

const ENDPOINT = `${API_BASE_URL}/api/author-store/me/delivery-settings/custom`

function requireToken() {
  const token = getAuthToken()
  if (!token) throw new Error('Please sign in before managing delivery companies.')
  return token
}

async function requestCustomCompany(method, { company, signal } = {}) {
  const token = requireToken()
  const response = await fetch(ENDPOINT, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method === 'PUT' ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(method === 'PUT' ? { body: JSON.stringify({ custom_company: company }) } : {}),
    signal,
    cache: 'no-store',
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok !== true) {
    const error = new Error(data.message || `Delivery company request failed (${response.status}).`)
    error.code = data.code || 'CUSTOM_DELIVERY_REQUEST_FAILED'
    error.status = response.status
    throw error
  }
  if (getAuthToken() !== token) throw new Error('Account changed while managing delivery companies.')
  return data
}

export async function fetchCustomDeliveryCompany({ signal } = {}) {
  const data = await requestCustomCompany('GET', { signal })
  return normalizeCustomDeliveryCompany(data.custom_company)
}

export async function saveCustomDeliveryCompany(company, { signal } = {}) {
  const name = String(company?.company_name ?? company?.name ?? '').trim()
  const feeUsd = company?.fee_usd ?? company?.feeUsd
  const logoUrl = String(company?.logo_url ?? company?.logoUrl ?? '').trim()
  const invalid = validateCustomDeliveryCompanyInput({ name, feeUsd, logoUrl })
  if (invalid) throw new Error(`Invalid custom delivery company: ${invalid}`)
  const expectedFee = Number(feeUsd)
  const data = await requestCustomCompany('PUT', {
    company: {
      company_key: 'custom',
      company_name: name,
      fee_usd: expectedFee,
      logo_url: logoUrl,
      is_active: true,
    },
    signal,
  })
  const saved = normalizeCustomDeliveryCompany(data.custom_company)
  if (!saved || saved.company_name !== name || saved.logo_url !== logoUrl ||
      Math.abs(saved.fee_usd - expectedFee) > 0.001) {
    throw new Error('Server did not confirm the delivery company update.')
  }
  return saved
}

export async function deleteCustomDeliveryCompany({ signal } = {}) {
  const data = await requestCustomCompany('DELETE', { signal })
  if (data.deleted !== true) throw new Error('Server did not confirm delivery company deletion.')
  return true
}
