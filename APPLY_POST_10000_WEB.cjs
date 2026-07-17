const fs = require('fs')
const path = require('path')

const root = process.cwd()

const files = {
  readerCreate: path.join(root, 'src', 'pages', 'ReaderPosts', 'ReaderPostCreatePage.jsx'),
  readerCard: path.join(root, 'src', 'components', 'reader-posts', 'ReaderPostCard.jsx'),
  authorComposer: path.join(root, 'src', 'components', 'AuthorPostComposerSheet.jsx'),
  authorPosts: path.join(root, 'src', 'components', 'AuthorPostsSection.jsx'),
}

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exit(1)
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing file: ${filePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function replaceRequired(source, oldText, newText, label) {
  if (source.includes(newText)) return source
  if (!source.includes(oldText)) fail(`Marker not found: ${label}`)
  return source.replace(oldText, newText)
}

function saveFile(filePath, original, updated) {
  if (updated === original) {
    console.log(`Already updated: ${filePath}`)
    return
  }

  const backupPath = `${filePath}.before-10000-post-limit.bak`
  if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, original, 'utf8')
  fs.writeFileSync(filePath, updated, 'utf8')
  console.log(`Updated: ${filePath}`)
}

function updateReaderCreatePage() {
  const filePath = files.readerCreate
  const original = readFile(filePath)
  let source = original

  source = replaceRequired(
    source,
    `} from '../../features/reader-posts/readerPostDraft'\n\nfunction getStoredUser()`,
    `} from '../../features/reader-posts/readerPostDraft'\n\nconst MAX_POST_LENGTH = 10000\n\nfunction getStoredUser()`,
    'Reader Post limit constant'
  )

  source = replaceRequired(
    source,
    `event.target.value.slice(\n                  0,\n                  1000\n                )`,
    `event.target.value.slice(\n                  0,\n                  MAX_POST_LENGTH\n                )`,
    'Reader Post input limit'
  )

  source = replaceRequired(
    source,
    'maxLength={1000}',
    'maxLength={MAX_POST_LENGTH}',
    'Reader Post textarea maxLength'
  )

  const oldCounter = `          <div className="mt-2 text-right text-[11px] font-normal text-[#9ca3af]">\n            {content.length}/1000\n          </div>\n`
  if (source.includes(oldCounter)) source = source.replace(oldCounter, '')

  source = replaceRequired(
    source,
    `        <div className="relative border-t border-[#eef0f4] bg-white px-4 py-4">\n          <button`,
    `        <div className="relative border-t border-[#eef0f4] bg-white px-4 py-4">\n          <div\n            className={\`mb-3 text-right text-[11px] font-normal \${\n              content.length >= MAX_POST_LENGTH\n                ? 'text-[#dc2626]'\n                : content.length >= MAX_POST_LENGTH - 500\n                  ? 'text-[#d97706]'\n                  : 'text-[#9ca3af]'\n            }\`}\n          >\n            {content.length.toLocaleString()} / {MAX_POST_LENGTH.toLocaleString()}\n          </div>\n\n          <button`,
    'Reader Post bottom counter'
  )

  saveFile(filePath, original, source)
}

function updateReaderPostCard() {
  const filePath = files.readerCard
  const original = readFile(filePath)
  let source = original

  source = replaceRequired(
    source,
    `const API_BASE_URL =\n  'https://shadow-backend-kucw.onrender.com'\n\nfunction getAuthToken()`,
    `const API_BASE_URL =\n  'https://shadow-backend-kucw.onrender.com'\n\nconst MAX_POST_LENGTH = 10000\n\nfunction getAuthToken()`,
    'Reader Card limit constant'
  )

  source = replaceRequired(
    source,
    `  const [message, setMessage] =\n    useState('')\n\n  const user = post?.user || {}`,
    `  const [message, setMessage] =\n    useState('')\n  const [expanded, setExpanded] =\n    useState(false)\n\n  const user = post?.user || {}`,
    'Reader Card expanded state'
  )

  source = replaceRequired(
    source,
    `  const isOwner =\n    Boolean(post?.is_owner) ||\n    String(storedUser?.id || '') ===\n      String(post?.user_id || '')\n\n  async function updatePost()`,
    `  const isOwner =\n    Boolean(post?.is_owner) ||\n    String(storedUser?.id || '') ===\n      String(post?.user_id || '')\n\n  const postText = String(\n    post?.content || ''\n  )\n  const canCollapse =\n    postText.length > 520 ||\n    postText.split('\\n').length > 8\n\n  async function updatePost()`,
    'Reader Card collapse calculation'
  )

  source = replaceRequired(
    source,
    `        <p className="whitespace-pre-wrap break-words px-4 pb-4 text-[14px] font-normal leading-6 text-[#111827]">\n          {post.content}\n        </p>`,
    `        <div className="px-4 pb-4">\n          <p\n            className="whitespace-pre-wrap break-words text-[14px] font-normal leading-6 text-[#111827]"\n            style={\n              !expanded && canCollapse\n                ? {\n                    display: '-webkit-box',\n                    WebkitLineClamp: 8,\n                    WebkitBoxOrient: 'vertical',\n                    overflow: 'hidden',\n                  }\n                : undefined\n            }\n          >\n            {post.content}\n          </p>\n\n          {canCollapse ? (\n            <button\n              type="button"\n              onClick={() =>\n                setExpanded(\n                  (current) => !current\n                )\n              }\n              className="mt-1 text-[13px] font-semibold text-[#475569] active:opacity-70"\n            >\n              {expanded\n                ? 'See less'\n                : 'See more'}\n            </button>\n          ) : null}\n        </div>`,
    'Reader Card See more block'
  )

  source = replaceRequired(
    source,
    `event.target.value.slice(\n                    0,\n                    1000\n                  )`,
    `event.target.value.slice(\n                    0,\n                    MAX_POST_LENGTH\n                  )`,
    'Reader Edit input limit'
  )

  source = replaceRequired(
    source,
    `              value={content}\n              onChange={(event) =>`,
    `              value={content}\n              maxLength={MAX_POST_LENGTH}\n              onChange={(event) =>`,
    'Reader Edit textarea maxLength'
  )

  source = replaceRequired(
    source,
    `              {content.length}/1000`,
    `              {content.length.toLocaleString()} / {MAX_POST_LENGTH.toLocaleString()}`,
    'Reader Edit counter'
  )

  saveFile(filePath, original, source)
}

function updateAuthorComposer() {
  const filePath = files.authorComposer
  const original = readFile(filePath)
  let source = original

  source = replaceRequired(
    source,
    `const MAX_POST_PHOTOS = 5\nconst MAX_POST_IMAGE_BYTES`,
    `const MAX_POST_PHOTOS = 5\nconst MAX_POST_LENGTH = 10000\nconst MAX_POST_IMAGE_BYTES`,
    'Author Post limit constant'
  )

  source = replaceRequired(
    source,
    `                  onChange={(event) => setDraft(event.target.value)}\n                  placeholder="Share an update..."\n                  maxLength={5000}`,
    `                  onChange={(event) =>\n                    setDraft(\n                      event.target.value.slice(\n                        0,\n                        MAX_POST_LENGTH\n                      )\n                    )\n                  }\n                  placeholder="Share an update..."\n                  maxLength={MAX_POST_LENGTH}`,
    'Author Post textarea limit'
  )

  source = replaceRequired(
    source,
    `              <div className="border-t border-[#eef0f4] bg-white px-4 py-4">\n  <button`,
    `              <div className="border-t border-[#eef0f4] bg-white px-4 py-4">\n  <div\n    className={\`mb-3 text-right text-[11px] font-normal \${\n      draft.length >= MAX_POST_LENGTH\n        ? 'text-[#dc2626]'\n        : draft.length >= MAX_POST_LENGTH - 500\n          ? 'text-[#d97706]'\n          : 'text-[#9ca3af]'\n    }\`}\n  >\n    {draft.length.toLocaleString()} / {MAX_POST_LENGTH.toLocaleString()}\n  </div>\n\n  <button`,
    'Author Post bottom counter'
  )

  saveFile(filePath, original, source)
}

function updateAuthorPostsSection() {
  const filePath = files.authorPosts
  const original = readFile(filePath)
  let source = original

  source = replaceRequired(
    source,
    `  const reactionBusy = reactionBusyId === post.id\n\n  const [reactionPickerOpen, setReactionPickerOpen] = useState(false)`,
    `  const reactionBusy = reactionBusyId === post.id\n  const postText = String(\n    post?.content || ''\n  )\n  const canCollapse =\n    postText.length > 520 ||\n    postText.split('\\n').length > 8\n\n  const [expanded, setExpanded] = useState(false)\n  const [reactionPickerOpen, setReactionPickerOpen] = useState(false)`,
    'Author Post expanded state'
  )

  source = replaceRequired(
    source,
    `      {post.content ? (\n        <p className="mt-2 whitespace-pre-wrap px-4 text-[16px] font-normal leading-7 text-[#111827]">\n          {post.content}\n        </p>\n      ) : null}`,
    `      {post.content ? (\n        <div className="mt-2 px-4">\n          <p\n            className="whitespace-pre-wrap text-[16px] font-normal leading-7 text-[#111827]"\n            style={\n              !expanded && canCollapse\n                ? {\n                    display: '-webkit-box',\n                    WebkitLineClamp: 8,\n                    WebkitBoxOrient: 'vertical',\n                    overflow: 'hidden',\n                  }\n                : undefined\n            }\n          >\n            {post.content}\n          </p>\n\n          {canCollapse ? (\n            <button\n              type="button"\n              onClick={() =>\n                setExpanded(\n                  (current) => !current\n                )\n              }\n              className="mt-1 text-[13px] font-semibold text-[#475569] active:opacity-70"\n            >\n              {expanded\n                ? 'See less'\n                : 'See more'}\n            </button>\n          ) : null}\n        </div>\n      ) : null}`,
    'Author Post See more block'
  )

  saveFile(filePath, original, source)
}

updateReaderCreatePage()
updateReaderPostCard()
updateAuthorComposer()
updateAuthorPostsSection()

console.log('')
console.log('Web post limits updated to 10,000 characters.')
console.log('Long Reader and Author posts now collapse after 8 lines.')
