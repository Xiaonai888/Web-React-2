export const CUSTOM_DELIVERY_COMPANY_KEY = 'custom'
export const CUSTOM_DELIVERY_COMPANY_NAME_MAX_LENGTH = 80
export const CUSTOM_DELIVERY_COMPANY_MAX_FEE = 9999.99

export function isSafeCompanyLogoUrl(value) {
  try {
    const url = new URL(String(value || '').trim())
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

export function normalizeCustomDeliveryCompany(value) {
  if (!value || typeof value !== 'object' || String(value.company_key || '') !== CUSTOM_DELIVERY_COMPANY_KEY) {
    return null
  }

  const name = String(value.company_name ?? value.name ?? '').trim()
  const logoUrl = String(value.logo_url ?? value.logoUrl ?? '').trim()
  const fee = Number(value.fee_usd)

  return {
    company_key: CUSTOM_DELIVERY_COMPANY_KEY,
    company_name: name,
    fee_usd: Number.isFinite(fee) && fee >= 0 ? fee : 0,
    logo_url: isSafeCompanyLogoUrl(logoUrl) ? logoUrl : '',
    enabled: value.enabled !== false,
  }
}

export function findCustomDeliveryCompany(deliverySettings) {
  if (!Array.isArray(deliverySettings)) return null
  const row = deliverySettings.find((entry) => entry?.company_key === CUSTOM_DELIVERY_COMPANY_KEY)
  return normalizeCustomDeliveryCompany(row)
}

export function validateCustomDeliveryCompanyInput({ name, feeUsd, logoUrl }, { requireLogo = true } = {}) {
  const companyName = String(name ?? '').trim()
  const feeText = String(feeUsd ?? '').trim()

  if (!companyName || companyName.length > CUSTOM_DELIVERY_COMPANY_NAME_MAX_LENGTH) {
    return 'INVALID_NAME'
  }
  if (!/^(?:\d+)(?:\.\d{1,2})?$/.test(feeText)) {
    return 'INVALID_FEE'
  }
  const fee = Number(feeText)
  if (!Number.isFinite(fee) || fee < 0 || fee > CUSTOM_DELIVERY_COMPANY_MAX_FEE) {
    return 'INVALID_FEE'
  }
  if (requireLogo && !isSafeCompanyLogoUrl(logoUrl)) {
    return 'INVALID_LOGO'
  }

  return ''
}

export function mergeCustomDeliveryCompanySettings(existing, company) {
  if (!Array.isArray(existing)) throw new Error('Delivery settings are unavailable.')

  const validation = validateCustomDeliveryCompanyInput({
    name: company?.company_name ?? company?.name,
    feeUsd: company?.fee_usd ?? company?.feeUsd,
    logoUrl: company?.logo_url ?? company?.logoUrl,
  })
  if (validation) throw new Error(`Invalid custom delivery company: ${validation}`)

  const name = String(company.company_name ?? company.name).trim()
  const feeUsd = Number(company.fee_usd ?? company.feeUsd)
  const logoUrl = String(company.logo_url ?? company.logoUrl).trim()

  return [
    ...existing.filter((entry) => entry?.company_key !== CUSTOM_DELIVERY_COMPANY_KEY),
    {
      company_key: CUSTOM_DELIVERY_COMPANY_KEY,
      company_name: name,
      fee_usd: feeUsd,
      logo_url: logoUrl,
      enabled: true,
    },
  ]
}

export function removeCustomDeliveryCompanyFromSettings(existing) {
  if (!Array.isArray(existing)) throw new Error('Delivery settings are unavailable.')
  return existing.filter((entry) => entry?.company_key !== CUSTOM_DELIVERY_COMPANY_KEY)
}
