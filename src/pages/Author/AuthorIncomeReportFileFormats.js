const encoder = new TextEncoder()

const detailFields = [
  ['created_at', 'Date'],
  ['story_title', 'Story'],
  ['reader_name', 'Reader'],
  ['episode_number', 'Episode'],
  ['paid_diamonds', 'Paid Diamonds'],
  ['author_earned_diamonds', 'Author Diamonds'],
  ['author_share_percent', 'Author Share %'],
  ['author_net_payout_usd', 'Author Net USD'],
  ['earning_status', 'Status'],
]

const summaryFields = [
  ['period', 'Period'],
  ['story_title', 'Story'],
  ['transaction_count', 'Transactions'],
  ['paid_diamonds', 'Paid Diamonds'],
  ['author_earned_diamonds', 'Author Diamonds'],
  ['author_net_payout_usd', 'Author Net USD'],
]

const moneyFields = new Set(['author_net_payout_usd'])
const numericFields = new Set([
  'episode_number', 'paid_diamonds', 'author_earned_diamonds',
  'author_share_percent', 'author_net_payout_usd', 'transaction_count',
])

function escapeXml(value) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function localDate(value) {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\d$/.test(value)) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Phnom_Penh', day: '2-digit', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)
}

function cellValue(row, field) {
  const value = row?.[field] ?? ''
  if (field === 'created_at') return localDate(value)
  if (field === 'story_title' && !value) return row?.story_id ? 'Story' : 'All Stories'
  return value
}

function dataOf(report) {
  const fields = report.mode === 'detail' ? detailFields : summaryFields
  const rows = Array.isArray(report.rows) ? report.rows : []
  const values = rows.map(row => fields.map(([field]) => cellValue(row, field)))
  return { fields, values }
}

function metadata(report) {
  const totals = report.totals || {}
  const range = report.range || {}
  return [
    ['Author', report.author?.name || report.author?.username || ''],
    ['Username', report.author?.username ? `@${report.author.username}` : ''],
    ['Period', range.period || ''],
    ['From', range.from || 'All Time'],
    ['To', range.to || 'Present'],
    ['Mode', report.mode === 'detail' ? 'Detailed transactions' : 'Summary'],
    ['Grouping', report.granularity || ''],
    ['Transactions', totals.transaction_count ?? 0],
    ['Paid Diamonds', totals.paid_diamonds ?? 0],
    ['Author Diamonds', totals.author_earned_diamonds ?? 0],
    ['Author Net USD', totals.author_net_payout_usd ?? 0],
    ['Generated', localDate(report.generated_at || new Date().toISOString())],
  ]
}

function crc32(bytes) {
  let value = 0xFFFFFFFF
  for (const byte of bytes) {
    value ^= byte
    for (let i = 0; i < 8; i += 1) value = value & 1 ? (value >>> 1) ^ 0xEDB88320 : value >>> 1
  }
  return (value ^ 0xFFFFFFFF) >>> 0
}

function zipFiles(files) {
  const contents = []
  const directories = []
  let offset = 0
  for (const [name, content] of files) {
    const fileName = encoder.encode(name)
    const bytes = typeof content === 'string' ? encoder.encode(content) : content
    const checksum = crc32(bytes)
    const local = new Uint8Array(30)
    const a = new DataView(local.buffer)
    a.setUint32(0, 0x04034B50, true)
    a.setUint16(4, 20, true)
    a.setUint16(6, 0x0800, true)
    a.setUint32(14, checksum, true)
    a.setUint32(18, bytes.length, true)
    a.setUint32(22, bytes.length, true)
    a.setUint16(26, fileName.length, true)
    const central = new Uint8Array(46)
    const b = new DataView(central.buffer)
    b.setUint32(0, 0x02014B50, true)
    b.setUint16(4, 20, true)
    b.setUint16(6, 20, true)
    b.setUint16(8, 0x0800, true)
    b.setUint32(16, checksum, true)
    b.setUint32(20, bytes.length, true)
    b.setUint32(24, bytes.length, true)
    b.setUint16(28, fileName.length, true)
    b.setUint32(42, offset, true)
    contents.push(local, fileName, bytes)
    directories.push(central, fileName)
    offset += local.length + fileName.length + bytes.length
  }
  const size = directories.reduce((sum, item) => sum + item.length, 0)
  const ending = new Uint8Array(22)
  const view = new DataView(ending.buffer)
  view.setUint32(0, 0x06054B50, true)
  view.setUint16(8, files.length, true)
  view.setUint16(10, files.length, true)
  view.setUint32(12, size, true)
  view.setUint32(16, offset, true)
  return new Blob([...contents, ...directories, ending], { type: 'application/zip' })
}

function excelColumn(index) {
  let name = ''
  while (index > 0) {
    index -= 1
    name = String.fromCharCode(65 + index % 26) + name
    index = Math.floor(index / 26)
  }
  return name
}

function excelRow(values, fields, index, heading = false) {
  const cells = values.map((value, i) => {
    const address = `${excelColumn(i + 1)}${index}`
    const style = heading ? ' s="1"' : ''
    if (!heading && fields?.[i] && numericFields.has(fields[i][0]) && value !== '' && value !== null && Number.isFinite(Number(value))) {
      return `<c r="${address}"${style}><v>${Number(value)}</v></c>`
    }
    return `<c r="${address}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
  }).join('')
  return `<row r="${index}">${cells}</row>`
}

export function makeAuthorIncomeExcel(report) {
  const { fields, values } = dataOf(report)
  const meta = metadata(report)
  const table = [excelRow(['SHADOW AUTHOR INCOME REPORT'], null, 1, true)]
  meta.forEach((item, index) => table.push(excelRow(item, null, index + 2)))
  const headingRow = meta.length + 4
  table.push(excelRow(fields.map(item => item[1]), null, headingRow, true))
  values.forEach((row, index) => table.push(excelRow(row, fields, headingRow + index + 1)))
  const cols = fields.map((item, i) => `<col min="${i + 1}" max="${i + 1}" width="${item[0].includes('title') ? 42 : 22}" customWidth="1"/>`).join('')
  const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${cols}</cols><sheetData>${table.join('')}</sheetData><autoFilter ref="A${headingRow}:${excelColumn(fields.length)}${Math.max(headingRow, headingRow + values.length)}"/></worksheet>`
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Author Income" sheetId="1" r:id="rId1"/></sheets></workbook>`
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Aptos"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF334155"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`
  const blob = zipFiles([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', workbook],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/worksheets/sheet1.xml', worksheet],
    ['xl/styles.xml', styles],
  ])
  return new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

function wordText(value, strong = false) {
  return `<w:p><w:r><w:rPr><w:rFonts w:ascii="Noto Sans Khmer" w:hAnsi="Noto Sans Khmer" w:eastAsia="Noto Sans Khmer" w:cs="Noto Sans Khmer"/>${strong ? '<w:b/>' : ''}<w:sz w:val="17"/></w:rPr><w:t xml:space="preserve">${escapeXml(value)}</w:t></w:r></w:p>`
}

export function makeAuthorIncomeWord(report) {
  const { fields, values } = dataOf(report)
  const heading = fields.map(item => item[1])
  const tableRow = (cells, bold) => `<w:tr>${cells.map(cell => `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/><w:shd w:fill="${bold ? 'E2E8F0' : 'FFFFFF'}"/></w:tcPr>${wordText(cell, bold)}</w:tc>`).join('')}</w:tr>`
  const body = `${wordText('SHADOW AUTHOR INCOME REPORT', true)}${metadata(report).map(([key, value]) => wordText(`${key}: ${value}`)).join('')}<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:bottom w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="3"/></w:tblBorders></w:tblPr>${tableRow(heading, true)}${values.map(row => tableRow(row, false)).join('')}</w:tbl><w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="720" w:right="550" w:bottom="720" w:left="550"/></w:sectPr>`
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`
  const blob = zipFiles([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ['word/document.xml', documentXml],
  ])
  return new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}

function wrappedText(context, value, width) {
  const source = String(value ?? '')
  const chars = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('km', { granularity: 'grapheme' }).segment(source), item => item.segment)
    : Array.from(source)
  const lines = ['']
  for (const char of chars) {
    const index = lines.length - 1
    if (context.measureText(lines[index] + char).width <= width) {
      lines[index] += char
    } else if (lines.length < 2) {
      lines.push(char)
    } else {
      while (context.measureText(lines[index] + '…').width > width && lines[index]) lines[index] = lines[index].slice(0, -1)
      lines[index] += '…'
      break
    }
  }
  return lines
}

function pdfPageImage(context, report, start, end, index, count) {
  const canvas = context.canvas
  context.fillStyle = '#FFFFFF'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#0F172A'
  context.font = 'bold 20px "Noto Sans Khmer", Arial, sans-serif'
  context.fillText('SHADOW AUTHOR INCOME REPORT', 34, 42)
  const total = report.totals || {}
  context.font = '12px "Noto Sans Khmer", Arial, sans-serif'
  context.fillText(`Author: ${report.author?.name || report.author?.username || ''}`, 34, 66)
  context.fillText(`Period: ${report.range?.period || ''}  ${report.range?.from || 'All Time'} - ${report.range?.to || 'Present'}  Mode: ${report.mode}`, 34, 86)
  context.fillText(`Transactions: ${total.transaction_count ?? 0}  Paid: ${total.paid_diamonds ?? 0} D  Author Diamonds: ${total.author_earned_diamonds ?? 0} D`, 34, 108)
  context.font = 'bold 13px "Noto Sans Khmer", Arial, sans-serif'
  context.fillText(`AUTHOR NET USD: $${total.author_net_payout_usd ?? 0}`, 34, 130)
  const summary = report.mode !== 'detail'
  const widths = summary ? [145, 415, 94, 132, 136, 130] : [135, 245, 180, 65, 100, 110, 120, 97]
  const selectedFields = summary ? summaryFields : detailFields.filter(item => item[0] !== 'author_share_percent')
  const columns = selectedFields.map(item => item[1])
  context.fillStyle = '#334155'
  context.fillRect(35, 149, 1052, 36)
  let offset = 36
  context.fillStyle = '#FFFFFF'
  context.font = 'bold 11px "Noto Sans Khmer", Arial, sans-serif'
  for (let i = 0; i < columns.length; i += 1) {
    context.fillText(columns[i], offset + 4, 171)
    offset += widths[i]
  }
  for (let i = start; i < end; i += 1) {
    const y = 185 + (i - start) * 46
    context.fillStyle = (i - start) % 2 ? '#FFFFFF' : '#F1F5F9'
    context.fillRect(35, y, 1052, 46)
    context.fillStyle = '#0F172A'
    context.font = '11px "Noto Sans Khmer", Arial, sans-serif'
    let cursor = 36
    for (let j = 0; j < selectedFields.length; j += 1) {
      const field = selectedFields[j][0]
      const value = cellValue(report.rows[i], field)
      const width = widths[j] - 10
      if (numericFields.has(field) || moneyFields.has(field)) {
        const stringValue = String(value)
        context.save()
        const measured = context.measureText(stringValue).width
        if (measured > width) {
          context.translate(cursor + 4, y + 25)
          context.scale(width / measured, 1)
          context.fillText(stringValue, 0, 0)
        } else {
          context.fillText(stringValue, cursor + 4, y + 25)
        }
        context.restore()
      } else {
        wrappedText(context, value, width).forEach((line, lineIndex) => context.fillText(line, cursor + 4, y + 17 + lineIndex * 16))
      }
      cursor += widths[j]
    }
  }
  context.font = '11px Arial, sans-serif'
  context.fillStyle = '#64748B'
  context.fillText(`Page ${index + 1} / ${count}`, 990, 780)
  const raw = atob(canvas.toDataURL('image/jpeg', 0.82).split(',')[1])
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i)
  return bytes
}

function pdfFile(images, width, height) {
  const chunks = []
  const offsets = new Array(images.length * 3 + 3).fill(0)
  let cursor = 0
  const add = value => {
    const bytes = typeof value === 'string' ? encoder.encode(value) : value
    chunks.push(bytes)
    cursor += bytes.length
  }
  const start = number => { offsets[number] = cursor; add(`${number} 0 obj\n`) }
  add('%PDF-1.4\n')
  start(1)
  add('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  start(2)
  add(`<< /Type /Pages /Kids [${images.map((_, i) => `${3 + i * 3} 0 R`).join(' ')}] /Count ${images.length} >>\nendobj\n`)
  images.forEach((image, index) => {
    const page = 3 + index * 3
    const stream = page + 1
    const picture = page + 2
    start(page)
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Im0 ${picture} 0 R >> >> /Contents ${stream} 0 R >>\nendobj\n`)
    const draw = 'q 841.89 0 0 595.28 0 0 cm /Im0 Do Q\n'
    start(stream)
    add(`<< /Length ${encoder.encode(draw).length} >>\nstream\n${draw}endstream\nendobj\n`)
    start(picture)
    add(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`)
    add(image)
    add('\nendstream\nendobj\n')
  })
  const xref = cursor
  add(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`)
  for (let i = 1; i < offsets.length; i += 1) add(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`)
  add(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`)
  return new Blob(chunks, { type: 'application/pdf' })
}

export async function makeAuthorIncomePdf(report) {
  const canvas = document.createElement('canvas')
  canvas.width = 1122
  canvas.height = 794
  const context = canvas.getContext('2d')
  if (!context) throw new Error('PDF renderer is unavailable')
  if (document.fonts?.ready) await document.fonts.ready
  const perPage = 12
  const count = Math.max(1, Math.ceil(report.rows.length / perPage))
  const images = []
  for (let i = 0; i < count; i += 1) {
    images.push(pdfPageImage(context, report, i * perPage, Math.min(report.rows.length, (i + 1) * perPage), i, count))
    if (i % 3 === 2) await new Promise(resolve => setTimeout(resolve, 0))
  }
  const blob = pdfFile(images, canvas.width, canvas.height)
  canvas.width = 0
  canvas.height = 0
  return blob
}

export function saveAuthorIncomeReport(blob, report, extension) {
  const name = String(report.author?.username || report.author?.name || 'author').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40)
  const range = String(report.range?.period || 'report').replace(/[^a-z]/g, '')
  const date = new Date().toISOString().slice(0, 10)
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = `author-income-${name}-${range}-${date}.${extension}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
