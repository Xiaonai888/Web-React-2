const MAX_RECIPIENTS = 5000
const MAX_FIELDS = 80

const clean = (value, max = 500) => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').slice(0, max)

function parseCSVRow(line) {
  const cells = []
  let value = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"'
        index += 1
      } else quoted = !quoted
    } else if (char === ',' && !quoted) {
      cells.push(value)
      value = ''
    } else value += char
  }
  cells.push(value)
  return cells
}

export function parseShadowDocsRecipientsCSV(source) {
  const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n').filter(line => line.trim()).slice(0, MAX_RECIPIENTS + 1)
  if (lines.length < 2) return []
  const headers = parseCSVRow(lines[0]).slice(0, MAX_FIELDS).map((value, index) => clean(value, 80).trim() || `Field${index + 1}`)
  return lines.slice(1, MAX_RECIPIENTS + 1).map((line, rowIndex) => {
    const values = parseCSVRow(line)
    const record = { __shadowDocsRow: rowIndex + 1 }
    headers.forEach((header, index) => { record[header] = clean(values[index], 1000) })
    return record
  })
}

export function getShadowDocsMergeFields(recipients = []) {
  const first = recipients.find(item => item && typeof item === 'object')
  return first ? Object.keys(first).filter(key => key !== '__shadowDocsRow').slice(0, MAX_FIELDS) : []
}

export function mergeShadowDocsTemplate(template, recipient = {}) {
  return String(template || '').replace(/«([^»]{1,80})»/g, (match, field) => {
    const key = String(field || '').trim()
    return Object.prototype.hasOwnProperty.call(recipient, key) ? clean(recipient[key], 5000) : match
  })
}

export function buildShadowDocsMergedDocuments(template, recipients = []) {
  return recipients.slice(0, MAX_RECIPIENTS).map((recipient, index) => ({ index, recipient, content: mergeShadowDocsTemplate(template, recipient) }))
}

export function insertShadowDocsMergeField(field) {
  const name = clean(field, 80).trim()
  return name ? `«${name}»` : ''
}

export function createShadowDocsAddressBlock(recipient = {}) {
  const parts = [
    recipient.FullName || recipient.Name,
    recipient.Company,
    recipient.Address1 || recipient.Address,
    recipient.Address2,
    [recipient.City, recipient.State, recipient.PostalCode || recipient.Zip].filter(Boolean).join(' '),
    recipient.Country,
  ].map(value => clean(value, 300).trim()).filter(Boolean)
  return parts.join('\n')
}

export function createShadowDocsGreetingLine(recipient = {}, fallback = 'Dear Reader,') {
  const name = clean(recipient.FirstName || recipient.Name || recipient.FullName, 160).trim()
  return name ? `Dear ${name},` : clean(fallback, 200)
}
