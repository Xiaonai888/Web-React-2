import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const path = resolve(root, 'src/pages/Author/EpisodeEditorPage.jsx')
let source = readFileSync(path, 'utf8')

function replaceOnce(oldText, newText) {
  if (source.includes(newText)) return
  const start = source.indexOf(oldText)
  if (start < 0 || source.indexOf(oldText, start + 1) >= 0) {
    throw new Error(`EpisodeEditorPage.jsx changed; patch anchor mismatch: ${oldText.slice(0, 100)}`)
  }
  source = source.slice(0, start) + newText + source.slice(start + oldText.length)
}

replaceOnce(
  "} from '../../utils/novelInlineUploadQueue'\n",
  "} from '../../utils/novelInlineUploadQueue'\nimport { countPaidNovelCharacters, PAID_NOVEL_MINIMUMS, FREE_PUBLISHED_EPISODE_LIMIT } from '../../utils/paidEpisodeCharacterCount'\n"
)

replaceOnce(
  "  const plainContent = useMemo(() => episodeHtmlToPlainText(content), [content])\n  const characterCount = plainContent.length\n",
  "  const plainContent = useMemo(() => episodeHtmlToPlainText(content), [content])\n  const characterCount = plainContent.length\n  const paidCharacterCount = useMemo(\n    () => countPaidNovelCharacters(sanitizeEpisodeHtml(content)),\n    [content]\n  )\n  const episodeNumberForDisplay = Number(currentEpisodeNumber) > 0\n    ? Number(currentEpisodeNumber)\n    : isFirstEpisode\n      ? 1\n      : Number(storyRecord?.total_episodes || 0) + 1\n  const paidMinimumCharacters = PAID_NOVEL_MINIMUMS[storyLanguage] || PAID_NOVEL_MINIMUMS.English\n  const isPaidNovelEpisode = !isManga && !episodeFree && episodeNumberForDisplay > FREE_PUBLISHED_EPISODE_LIMIT\n  const displayedCharacterCount = isPaidNovelEpisode ? paidCharacterCount : characterCount\n  const displayedMinimumCharacters = isPaidNovelEpisode ? paidMinimumCharacters : MIN_CHARACTERS\n"
)

replaceOnce(
  "getDisplayText('episodeEditor.characterCount', { count: characterCount.toLocaleString(getDisplayLanguageId()), minimum: MIN_CHARACTERS.toLocaleString(getDisplayLanguageId()) })",
  "getDisplayText('episodeEditor.characterCount', { count: displayedCharacterCount.toLocaleString(getDisplayLanguageId()), minimum: displayedMinimumCharacters.toLocaleString(getDisplayLanguageId()) })"
)

writeFileSync(path, source)
process.stdout.write(`${path}\n`)
