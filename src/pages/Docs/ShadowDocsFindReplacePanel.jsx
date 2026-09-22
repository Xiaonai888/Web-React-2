import { useMemo, useState } from 'react'
import { Replace, Search } from 'lucide-react'
import { inspectShadowDocsFind, replaceShadowDocsText } from './ShadowDocsFindReplace'

export default function ShadowDocsFindReplacePanel({ book, activeChapterId, onApply }) {
  const [query, setQuery] = useState('')
  const [replacement, setReplacement] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [scope, setScope] = useState('all')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const matches = useMemo(() => {
    try { return inspectShadowDocsFind(book, query, matchCase) } catch { return [] }
  }, [book, query, matchCase])
  const chapterMatches = scope === 'chapter' ? matches.filter(item => item.id === activeChapterId) : matches
  const total = chapterMatches.reduce((sum, item) => sum + item.count, 0)
  const canApply = Boolean(book && query.trim() && total && typeof onApply === 'function')

  function apply(event) {
    event.preventDefault()
    if (!canApply || !window.confirm(`Replace ${total} match${total === 1 ? '' : 'es'} in ${chapterMatches.length} chapter${chapterMatches.length === 1 ? '' : 's'}? Download a backup first if you may want to undo this change.`)) return
    try {
      const result = replaceShadowDocsText(book, query, replacement, { matchCase, chapterId: scope === 'chapter' ? activeChapterId : '' })
      onApply(result.chapters, result.replacements)
      setError('')
      setMessage(`Replaced ${result.replacements} match${result.replacements === 1 ? '' : 'es'} in ${result.affectedChapters} chapter${result.affectedChapters === 1 ? '' : 's'}.`)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not replace text.')
    }
  }

  return <section aria-label="Find and replace manuscript text" className="sd-card">
    <h2 className="flex items-center gap-2"><Search size={19} /> Find & replace</h2>
    <p className="mt-2 text-xs leading-6 text-[#77758b] dark:text-white/65">Find words in chapter text, then replace them while keeping paragraph and heading markup. Download a backup before bulk changes.</p>
    <form onSubmit={apply} className="mt-4 grid gap-3">
      <label className="text-xs font-semibold">Find<input className="sd-field mt-2 w-full" maxLength={100} required value={query} onChange={event => { setQuery(event.target.value); setMessage('') }} placeholder="Text to find" disabled={!book}/></label>
      <label className="text-xs font-semibold">Replace with<input className="sd-field mt-2 w-full" maxLength={200} value={replacement} onChange={event => { setReplacement(event.target.value); setMessage('') }} placeholder="Leave blank to remove matching text" disabled={!book}/></label>
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={matchCase} onChange={event => setMatchCase(event.target.checked)} disabled={!book}/> Match case</label>
      <label className="text-xs font-semibold">Search area<select className="sd-field mt-2 w-full" value={scope} onChange={event => setScope(event.target.value)} disabled={!book}><option value="all">All chapters</option><option value="chapter" disabled={!activeChapterId}>Current chapter only</option></select></label>
      <p className="text-xs text-[#77758b] dark:text-white/65" role="status">{query.trim() ? `${total.toLocaleString()} match${total === 1 ? '' : 'es'} in ${chapterMatches.length} chapter${chapterMatches.length === 1 ? '' : 's'}` : 'Enter text to see match counts.'}</p>
      {chapterMatches.length > 0 && <div className="max-h-36 overflow-auto rounded-lg bg-[#f8f5fe] p-3 text-[11px] dark:bg-white/5">{chapterMatches.slice(0, 20).map(item => <p key={item.id} className="mb-1 break-words">{item.title}: {item.count}</p>)}{chapterMatches.length > 20 && <p>…and {chapterMatches.length - 20} more chapters</p>}</div>}
      {error && <p className="text-xs text-red-700" role="alert">{error}</p>}
      {message && <p className="text-xs text-green-700 dark:text-green-300" role="status">{message}</p>}
      <button type="submit" disabled={!canApply} className="sd-button sd-button-primary"><Replace size={16}/> Replace matching text</button>
    </form>
  </section>
}
