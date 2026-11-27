import { API_BASE_URL, getAuthToken } from '../config/api'

const ROOT = `${API_BASE_URL}/api/shadow-ai/preorder`
const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const err = (code, status = 0) => Object.assign(new Error(code), { code, status })
function id(value) {
  if (typeof value !== 'string' || !UUID.test(value)) throw err('SHADOW_AI_INVALID_REQUEST', 400)
  return value.toLowerCase()
}
async function request(path, { method = 'GET', body, signal } = {}) {
  const token = getAuthToken()
  if (!token) throw err('SHADOW_AI_SESSION_DENIED', 401)
  const response = await fetch(`${ROOT}${path}`, { method, headers: { Accept: 'application/json', Authorization: `Bearer ${token}`, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}), signal, cache: 'no-store' })
  if (getAuthToken() !== token) throw err('SHADOW_AI_SESSION_DENIED', 401)
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok !== true) throw err(/^(SHADOW_AI|PRE_ORDER)_[A-Z0-9_]{1,100}$/.test(data?.code || '') ? data.code : 'SHADOW_AI_UNAVAILABLE', response.status)
  return data
}
const campaign = (conversationId, campaignId) => `/conversations/${id(conversationId)}/campaigns/${id(campaignId)}`
const requirements = campaignId => `/author/campaigns/${id(campaignId)}/requirements`
export const getShadowAiCampaigns = (conversationId, { offset = 0, signal } = {}) => request(`/conversations/${id(conversationId)}/campaigns?offset=${encodeURIComponent(offset)}`, { signal })
export const openShadowAiSession = (conversationId, campaignId, signal) => request(`${campaign(conversationId, campaignId)}/session`, { signal })
export const sendShadowAiMessage = (conversationId, campaignId, message, revision, signal) => request(`${campaign(conversationId, campaignId)}/message`, { method: 'POST', body: { message, revision }, signal })
export const reviewShadowAiBooking = (conversationId, campaignId, revision, signal) => request(`${campaign(conversationId, campaignId)}/review`, { method: 'POST', body: { revision }, signal })
export const getShadowAiRequirements = (campaignId, signal) => request(requirements(campaignId), { signal })
export const previewShadowAiRequirements = (campaignId, templateRules, signal) => request(`${requirements(campaignId)}/preview`, { method: 'POST', body: { template_rules: templateRules }, signal })
export const confirmShadowAiRequirements = (campaignId, { rules, source_instruction }, signal) => request(requirements(campaignId), { method: 'PUT', body: { rules, source_instruction, confirmed: true }, signal })
