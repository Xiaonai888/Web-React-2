import { API_BASE_URL, getAuthToken } from '../config/api'
import {
  findCustomDeliveryCompany,
  mergeCustomDeliveryCompanySettings,
  removeCustomDeliveryCompanyFromSettings,
} from '../utils/customDeliveryCompany'

const ENDPOINT = `${API_BASE_URL}/api/author-store/me/delivery-settings`

function requireToken() {
  const token = getAuthToken()
  if (!token) throw new Error('Please sign in before managing delivery companies.')
  return token
}

async function requestSettings(method, token, settings, signal) {
  const response = await fetch(ENDPOINT, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(method === 'PUT' ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(method === 'PUT' ? { body: JSON.stringify({ delivery_settings: settings }) } : {}),
    signal,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || `Delivery settings request failed (${response.status}).`)
  }
  if (!Array.isArray(data.delivery_settings)) {
    throw new Error('Delivery settings response is incomplete.')
  }
  if (getAuthToken() !== token) {
    throw new Error('Account changed while managing delivery settings.')
  }
  return data.delivery_settings
}

export async function fetchCustomDeliveryCompany({ signal } = {}) {
  const token = requireToken()
  const rows = await requestSettings('GET', token, null, signal)
  return findCustomDeliveryCompany(rows)
}

export async function saveCustomDeliveryCompany(company, { signal } = {}) {
  const token = requireToken()
  const rows = await requestSettings('GET', token, null, signal)
  const merged = mergeCustomDeliveryCompanySettings(rows, company)
  const saved = await requestSettings('PUT', token, merged, signal)
  const result = findCustomDeliveryCompany(saved)
  if (!result || result.company_name !== String(company.company_name ?? company.name).trim() ||
    result.logo_url !== String(company.logo_url ?? company.logoUrl).trim() ||
    Math.abs(result.fee_usd - Number(company.fee_usd ?? company.feeUsd)) > 0.001) {
    throw new Error('Custom delivery company was not saved. Server support is required.')
  }
  return result
}

export async function deleteCustomDeliveryCompany({ signal } = {}) {
  const token = requireToken()
  const rows = await requestSettings('GET', token, null, signal)
  if (!findCustomDeliveryCompany(rows)) return true
  const updated = await requestSettings('PUT', token, removeCustomDeliveryCompanyFromSettings(rows), signal)
  if (findCustomDeliveryCompany(updated)) {
    throw new Error('Custom delivery company was not deleted. Server support is required.')
  }
  return true
}
