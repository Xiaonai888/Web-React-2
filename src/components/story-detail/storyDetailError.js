const routeCodes = new Set([
  'STORY_ROUTE_MISSING',
  'STORY_HANDLER_MISSING',
  'STORY_ROUTE_CHAIN_UNEXPECTED',
  'STORY_ROUTE_FALLTHROUGH',
  'STORY_ROUTE_DIAGNOSTIC_UNKNOWN',
])

const databaseCodes = new Set([
  'STORY_DATABASE_QUERY_CANCELLED',
  'STORY_DATABASE_CONNECTION_FAILED',
  'STORY_DATABASE_SCHEMA_UNAVAILABLE',
  'STORY_DATABASE_POOL_TIMEOUT',
  'STORY_DATABASE_PERMISSION_DENIED',
])

function safeCode(value) {
  return typeof value === 'string' && /^[A-Z][A-Z0-9_]{0,63}$/.test(value) ? value : ''
}

function safeReference(value) {
  return typeof value === 'string' && /^(?:[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}|[a-z0-9]{1,20}-[a-z0-9]{1,20})$/i.test(value) ? value : ''
}

export function createStoryDetailError({ status, data, network = false, invalidId = false, invalidResponse = false } = {}) {
  const httpStatus = Number.isInteger(status) && status >= 100 && status <= 599 ? status : null
  const apiCode = safeCode(data?.code)
  const diagnosticCode = safeCode(data?.diagnostic_code)
  let code = diagnosticCode || apiCode || (httpStatus ? `HTTP_${httpStatus}` : 'STORY_ERROR_UNKNOWN')
  let source = 'UNKNOWN'
  let responsible = 'ADMIN'
  let kind = 'unknown'

  if (invalidId || apiCode === 'INVALID_STORY_ID') {
    code = 'INVALID_STORY_ID'
    source = 'REQUEST'
    responsible = 'UNKNOWN'
    kind = 'invalidLink'
  } else if (network) {
    code = 'STORY_CONNECTION_UNAVAILABLE'
    responsible = 'UNKNOWN'
    kind = 'connection'
  } else if (invalidResponse) {
    code = 'STORY_RESPONSE_INVALID'
    kind = 'system'
  } else if (routeCodes.has(code) && httpStatus === 404) {
    source = 'BACKEND'
    kind = 'system'
  } else if (databaseCodes.has(code) && httpStatus >= 500) {
    source = 'DATABASE'
    kind = 'system'
  } else if (code === 'STORY_CONTROLLER_FAILED' && httpStatus >= 500) {
    source = 'BACKEND'
    kind = 'system'
  } else if (apiCode === 'ADULT_RESTRICTED' && httpStatus === 403) {
    code = apiCode
    source = 'ACCESS'
    responsible = 'READER'
    kind = 'restricted'
  } else if (apiCode === 'STORY_NOT_FOUND' && httpStatus === 404) {
    code = apiCode
    source = 'CONTENT'
    responsible = 'NONE'
    kind = 'notFound'
  } else if (httpStatus === 401) {
    source = 'ACCESS'
    responsible = 'READER'
    kind = 'login'
  } else if (httpStatus === 429) {
    responsible = 'UNKNOWN'
    kind = 'rateLimit'
  } else if (httpStatus === 404 && data?.message === 'Route not found') {
    code = 'STORY_ROUTE_NOT_FOUND_UNVERIFIED'
    kind = 'system'
  } else if (httpStatus >= 500) {
    kind = 'system'
  }

  return { code, apiCode, source, responsible, kind, status: httpStatus, referenceId: safeReference(data?.reference_id) }
}

export function storyDetailErrorReport(error) {
  if (!error) return ''
  return [
    'Feature: STORY_DETAIL',
    `Code: ${error.code}`,
    ...(error.apiCode && error.apiCode !== error.code ? [`API code: ${error.apiCode}`] : []),
    `Source: ${error.source}`,
    `Responsible: ${error.responsible}`,
    `HTTP: ${error.status ?? 'UNKNOWN'}`,
    `Reference: ${error.referenceId || 'UNAVAILABLE'}`,
    'Endpoint: GET /api/public/stories/:storyId',
  ].join('\n')
}
