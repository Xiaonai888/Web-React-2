import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const file = name => resolve(root, name)
const read = name => readFileSync(file(name), 'utf8')
const ensure = (condition, message) => { if (!condition) throw new Error(message) }

ensure(existsSync(file('scripts/applyChatStoryStickerStage2.mjs')), 'Stage 2 Web patch script is missing')
ensure(existsSync(file('src/components/chat-story/ChatStoryStickerPicker.jsx')), 'Sticker Picker component is missing')
ensure(existsSync(file('src/services/chatStoryStickerLibrary.js')), 'Sticker service is missing')

execFileSync(process.execPath, [file('scripts/applyChatStoryStickerStage2.mjs')], { cwd: root, stdio: 'inherit' })

const editor = read('src/pages/Author/ChatStoryEditorPage.jsx')
const picker = read('src/components/chat-story/ChatStoryStickerPicker.jsx')
const service = read('src/services/chatStoryStickerLibrary.js')
ensure(editor.includes('import ChatStoryStickerPicker'), 'Sticker Picker is not imported in Editor')
ensure(editor.includes("type: message.stickerImage ? 'sticker' : message.type"), 'Sticker save mapping is missing')
ensure(editor.includes("message.type === 'sticker'"), 'Sticker restore mapping is missing')
ensure(editor.includes("['image', 'sticker'].includes(message.type)"), 'Sticker editor render is missing')
ensure(editor.includes('onChooseSticker={chooseStickerMessage}'), 'Sticker Picker is not connected')
ensure(editor.includes('onCreateSticker={file => handleImageChange'), 'Custom sticker upload is not connected')
ensure(picker.includes('onReturnKeyboard'), 'Keyboard switch control is missing')
ensure(service.includes('/api/chat-story/stickers'), 'Sticker API endpoint is missing')

if (existsSync(file('node_modules/.bin/vite'))) {
  execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })
} else {
  process.stdout.write('Build skipped: run npm ci and npm run build before deploying.\n')
}

process.stdout.write('PASS: Web Sticker integration checks. Commit and deploy only after Backend integration and SQL verification.\n')
