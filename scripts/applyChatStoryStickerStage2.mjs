import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const path = resolve(process.cwd(), 'src/pages/Author/ChatStoryEditorPage.jsx')
let content = readFileSync(path, 'utf8')

const changes = [
  [
    "import ChatStoryEditorGuide from '../../components/chat-story/ChatStoryEditorGuide'",
    "import ChatStoryEditorGuide from '../../components/chat-story/ChatStoryEditorGuide'\nimport ChatStoryStickerPicker from '../../components/chat-story/ChatStoryStickerPicker'",
  ],
  [
    "  const [symbolPanelOpen, setSymbolPanelOpen] = useState(false)",
    "  const [symbolPanelOpen, setSymbolPanelOpen] = useState(false)\n  const [stickerOpen, setStickerOpen] = useState(false)\n  const [stickerHeight, setStickerHeight] = useState(320)",
  ],
  [
    'const openMessageToolbar = (messageId) => {',
    `const openStickerPicker = () => {
  if (messageEditMode?.type === 'modify') {
    showToast(getDisplayText('chatStoryEditor.finishCurrentEdit'))
    return
  }
  const viewport = window.visualViewport
  const detected = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0
  const fallback = Math.round(window.innerHeight * 0.39)
  setStickerHeight(Math.max(260, Math.min(380, Math.round(detected || fallback))))
  composerRef.current?.blur()
  setComposerFocused(false)
  setSymbolPanelOpen(false)
  setStickerOpen(true)
}

const chooseStickerMessage = (item) => {
  if (!item?.imageUrl || !/^https:\\/\\//i.test(item.imageUrl)) return
  if (messageEditMode?.type === 'modify') return
  const nextMessage = {
    id: makeId(),
    type: 'sticker',
    characterId: selectedCharacter?.id || null,
    text: '',
    imageUrl: item.imageUrl,
    stickerImage: true,
    createdAt: new Date().toISOString(),
  }
  const inserting = ['insert_above', 'insert_below'].includes(messageEditMode?.type)
  shouldScrollToEndRef.current = !inserting
  commitMessages(current => {
    const note = current.find(message => message.type === 'author_note')
    const story = current.filter(message => message.type !== 'author_note')
    if (inserting) {
      const index = story.findIndex(message => message.id === messageEditMode.targetId)
      const at = index < 0 ? story.length : messageEditMode.type === 'insert_above' ? index : index + 1
      story.splice(at, 0, nextMessage)
    } else {
      story.push(nextMessage)
    }
    return note ? [...story, note] : story
  })
  setMessageEditMode(null)
  setActiveMessageId('')
  if (draftSnapshotRef.current) {
    draftSnapshotRef.current = {
      ...draftSnapshotRef.current,
      messages: messagesRef.current,
      updatedAt: new Date().toISOString(),
    }
    flushLocalDraft()
  }
}

const openMessageToolbar = (messageId) => {`,
  ],
  [
    "type: message.type,\n              character_id: message.characterId || null,",
    "type: message.stickerImage ? 'sticker' : message.type,\n              character_id: message.characterId || null,",
  ],
  [
    "image_url: ['image', 'notification'].includes(message.type) ? message.imageUrl || message.image_url || null : null,",
    "image_url: ['image', 'sticker', 'notification'].includes(message.stickerImage ? 'sticker' : message.type) ? message.imageUrl || message.image_url || null : null,",
  ],
  [
    ": message.type === 'image'\n                      ? 'image'",
    ": message.type === 'image'\n                      ? 'image'\n                      : message.type === 'sticker'\n                        ? 'sticker'",
  ],
  [
    "                message.imageUrl ||\n                '',\n              notification: message.type === 'notification' ? {",
    "                message.imageUrl ||\n                '',\n              stickerImage: message.type === 'sticker',\n              notification: message.type === 'notification' ? {",
  ],
  [
    '  const handleImageChange = async (event) => {',
    '  const handleImageChange = async (event, asSticker = false) => {',
  ],
  [
    "      type: 'image',\n      characterId:",
    "      type: 'image',\n      stickerImage: Boolean(asSticker),\n      characterId:",
  ],
  [
    "  ) : message.type === 'image' ? (",
    "  ) : ['image', 'sticker'].includes(message.type) ? (",
  ],
  [
    "const imageContent = (\n    <div\n      className={`max-w-[76%] overflow-hidden rounded-[18px] bg-[var(--shadow-bg-soft)] ${",
    "const imageContent = (\n    <div\n      className={`${message.type === 'sticker' || message.stickerImage ? 'max-w-[160px] bg-transparent' : 'max-w-[76%] bg-[var(--shadow-bg-soft)]'} overflow-hidden rounded-[18px] ${",
  ],
  [
    'className="block max-h-[360px] w-full object-contain"',
    'className={`block w-full object-contain ${message.type === \'sticker\' || message.stickerImage ? \'max-h-[180px]\' : \'max-h-[360px]\'}`}',
  ],
  [
    '<main className="mx-auto max-w-5xl px-4 pt-4">',
    '<main className="mx-auto max-w-5xl px-4 pt-4" style={stickerOpen && window.matchMedia(\'(max-width: 767px)\').matches ? { paddingBottom: `${stickerHeight + 150}px` } : undefined}>',
  ],
  [
    '<div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pb-[calc(8px+env(safe-area-inset-bottom))]">',
    '<div className="fixed inset-x-0 bottom-0 z-[100] border-t border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] pb-[calc(8px+env(safe-area-inset-bottom))]" style={stickerOpen && window.matchMedia(\'(max-width: 767px)\').matches ? { bottom: `${stickerHeight}px` } : undefined}>',
  ],
  [
    'onFocus={() => setComposerFocused(true)}',
    'onFocus={() => { setComposerFocused(true); setStickerOpen(false) }}',
  ],
  [
    "onClick={() => window.alert(getDisplayText('chatStoryEditor.comingSoon'))}",
    'onClick={() => stickerOpen ? (setStickerOpen(false), composerRef.current?.focus()) : openStickerPicker()}',
  ],
  [
    "aria-label={getDisplayText('chatStoryEditor.emojiComingSoon')}",
    'aria-label="Stickers and Emoji"',
  ],
  [
    "        </div>\n      </div>\n    </div>\n  )\n}",
    `        </div>
      </div>
      <ChatStoryStickerPicker
        open={stickerOpen}
        height={stickerHeight}
        onClose={() => setStickerOpen(false)}
        onReturnKeyboard={() => {
          setStickerOpen(false)
          window.setTimeout(() => composerRef.current?.focus(), 40)
        }}
        onChooseSticker={chooseStickerMessage}
        onChooseEmoji={emoji => {
          setStickerOpen(false)
          insertMessageSymbol(emoji)
        }}
        onCreateSticker={file => handleImageChange({ target: { files: [file], value: '' } }, true)}
      />
    </div>
  )
}`,
  ],
]

let changed = 0
for (const [before, after] of changes) {
  if (content.includes(after)) continue
  const at = content.indexOf(before)
  if (at < 0 || content.indexOf(before, at + before.length) !== -1) {
    throw new Error(`Cannot safely update ChatStoryEditorPage.jsx at change ${changed + 1}`)
  }
  content = content.slice(0, at) + after + content.slice(at + before.length)
  changed++
}
if (changed) writeFileSync(path, content)
process.stdout.write(`Applied ${changed} Chat Story Editor changes.\n`)
