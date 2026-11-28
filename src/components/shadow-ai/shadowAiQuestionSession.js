const questions = new Set(['books','price','stock','delivery','signature','schedule','requirements'])
const replyKinds = new Set(['clarify','out_of_scope','missing','review','unavailable','stock_issue','signature_issue',...questions])
const validRevision = value => value === null || Number.isSafeInteger(value) && value >= 0
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value)

export function shadowAiReplyLanguage(locale) {
  const key = typeof locale === 'string' ? locale.trim().toLowerCase().split(/[-_]/u)[0] : ''
  return key === 'kh' ? 'km' : ['km','en','zh','ko','ja'].includes(key) ? key : 'en'
}

export function readShadowAiTurnReply(data, locale) {
  const reply = data?.reply
  if (!record(reply) || reply.version !== 'shadow-local-reply-v1' || reply.language !== shadowAiReplyLanguage(locale) || !replyKinds.has(reply.kind) || typeof reply.text !== 'string' || !reply.text.trim() || reply.text.length > 1000) return null
  if (data.intent === 'question') {
    if (!questions.has(data.question) || reply.kind !== data.question || reply.question !== data.question) return null
  } else if (reply.question !== null || questions.has(reply.kind)) return null
  return reply.text
}

function inlineSession(data, previousSession, campaignId) {
  const context = data.context
  if (!record(context) || context.campaign_id !== campaignId || data.campaign_id !== campaignId || context.author_page_id !== previousSession?.context?.author_page_id || data.author_page_id !== context.author_page_id || context.can_book !== true || context.stock_verified !== true || !Array.isArray(context.books) || context.books.length < 1 || context.books.length > 10 || !context.books.every(book => record(book) && typeof book.id === 'string' && typeof book.title === 'string' && Array.isArray(book.editions) && book.editions.length <= 2 && book.editions.every(e => record(e) && ['standard','limited'].includes(e.edition) && Number.isFinite(e.price_usd) && e.price_usd >= 0 && Number.isSafeInteger(e.available) && e.available >= 0)) || !Array.isArray(context.delivery_companies) || !Array.isArray(data.rules) || data.rules.length > 35 || !data.rules.every(rule => record(rule) && typeof rule.field === 'string' && typeof rule.condition === 'string') || !record(data.draft) || !record(data.validation) || !validRevision(data.revision) || data.revision !== previousSession.revision || !(data.expires_at === null || typeof data.expires_at === 'string')) return null
  return { ...previousSession, context, rules: data.rules, draft: data.draft, revision: data.revision, expires_at: data.expires_at, validation: data.validation }
}

export async function resolveShadowAiQuestionSession({ data, previousSession, campaignId, loadSession, signal }) {
  if (data?.intent !== 'question' || !questions.has(data.question)) return null
  if (signal?.aborted) return null
  const inline = inlineSession(data, previousSession, campaignId)
  if (inline) return inline
  if (typeof loadSession !== 'function') throw new TypeError('Session loader required')
  const fresh = await loadSession()
  return signal?.aborted ? null : fresh
}
