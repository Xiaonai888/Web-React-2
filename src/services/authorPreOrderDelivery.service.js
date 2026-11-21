import { API_BASE_URL, getAuthToken } from '../config/api'
import { fetchCustomDeliveryCompany } from './customDeliveryCompanyApi'

const SETTINGS_URL = `${API_BASE_URL}/api/author-store/me/delivery-settings`
const VALID_KEY = /^[a-z0-9][a-z0-9_-]{0,63}$/

function normalizeDeliveryCompany(value) {
  const key = String(value?.company_key || '').trim().toLowerCase()
  if (!VALID_KEY.test(key)) return null
  const name = String(value?.company_name || value?.name || '').trim()
  const fee = Number(value?.fee_usd)
  const active = value?.is_active !== false && value?.enabled !== false
  if (!name || name.length > 80 || !Number.isFinite(fee) || fee < 0 || fee > 9999.99) return null
  const logoUrl = String(value?.logo_url || '').trim()
  return {
    company_key: key,
    company_name: name,
    short_name: String(value?.short_name || name).trim(),
    fee_usd: fee,
    is_active: active,
    logo_url: /^https:\/\/[^\s]+$/i.test(logoUrl) ? logoUrl : '',
    sort_order: Number.isFinite(Number(value?.sort_order)) ? Number(value.sort_order) : 999,
  }
}

export async function fetchAuthorPreOrderDeliveryCompanies({ signal } = {}) {
  const token = getAuthToken()
  if (!token) throw new Error('Please sign in to view delivery settings.')
  const [settings, custom] = await Promise.all([
    fetch(SETTINGS_URL, { headers: { Authorization: `Bearer ${token}` }, signal, cache: 'no-store' }).then(async response => {
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok !== true || !Array.isArray(data.delivery_settings)) throw new Error(String(data.message || 'Could not load delivery settings.'))
      return data.delivery_settings
    }),
    fetchCustomDeliveryCompany({ signal }),
  ])
  if (getAuthToken() !== token) throw new Error('Account changed while loading delivery settings.')
  const byKey = new Map()
  for (const raw of settings) {
    const company = normalizeDeliveryCompany(raw)
    if (company) byKey.set(company.company_key, company)
  }
  if (custom) {
    const company = normalizeDeliveryCompany({ ...custom, is_active: custom.enabled !== false, sort_order: 2 })
    if (company) byKey.set(company.company_key, company)
  }
  const result = [...byKey.values()].filter(company => company.is_active).sort((a, b) => a.sort_order - b.sort_order)
  if (!result.length) throw new Error('No delivery companies are active. Update your Delivery Company settings.')
  return result
}

export function findUnavailablePreOrderDeliveryKeys(selectedKeys, companies) {
  const available = new Set((companies || []).map(company => company.company_key))
  return [...new Set(Array.isArray(selectedKeys) ? selectedKeys : [])].filter(key => !available.has(key))
}
