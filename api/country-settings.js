const BACKEND_URL = 'https://shadow-backend-kucw.onrender.com/api/public/country-settings'
const INVALID_COUNTRIES = new Set(['XX', 'ZZ', 'T1'])

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Vary', 'Authorization')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const secret = process.env.SHADOW_GEO_PROXY_SECRET
  if (!secret || secret.length < 32) {
    return res.status(503).json({ ok: false, message: 'Country settings proxy is not configured' })
  }

  const headerCountry = req.headers['x-vercel-ip-country']
  const country = typeof headerCountry === 'string' ? headerCountry.trim().toUpperCase() : ''
  const verifiedCountry = /^[A-Z]{2}$/.test(country) && !INVALID_COUNTRIES.has(country)
  const upstreamHeaders = { 'x-shadow-geo-secret': secret }

  if (verifiedCountry) upstreamHeaders['x-shadow-geo-country'] = country

  const auth = req.headers.authorization
  if (typeof auth === 'string' && /^Bearer [^\s]{1,8192}$/.test(auth)) {
    upstreamHeaders.Authorization = auth
  }

  try {
    const upstream = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: upstreamHeaders,
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })

    if (upstream.status < 200 || upstream.status >= 500) {
      return res.status(503).json({ ok: false, message: 'Country settings temporarily unavailable' })
    }

    const payload = await upstream.json().catch(() => null)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return res.status(502).json({ ok: false, message: 'Invalid country settings response' })
    }

    return res.status(upstream.status).json(payload)
  } catch {
    return res.status(503).json({ ok: false, message: 'Country settings temporarily unavailable' })
  }
}
