import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, AudioLines, Check, ChevronRight, Clock3, FileText,
  Languages, MessageSquare, MessageSquarePlus, PenLine, SpellCheck2,
  UserRound, VolumeX,
} from 'lucide-react'
import { getShadowDocsProofingStats } from './ShadowDocsProofingEngine'
import { getShadowDocsCommentMarks } from './ShadowDocsCommentEngine'
import { listShadowDocsChanges } from './ShadowDocsTrackChangesEngine'
import {
  applyShadowDocsReviewVisibility,
  readShadowDocsReviewPreferences,
  saveShadowDocsReviewPreferences,
} from './ShadowDocsReviewPreferences'
import { canShadowDocsReadAloud, startShadowDocsReadAloud, stopShadowDocsReadAloud } from './ShadowDocsReviewSpeech'
import { getShadowDocsReviewLanguage, getShadowDocsReviewSpeechLocale } from './ShadowDocsReviewLanguage'
import './ShadowDocsMobileReviewPanel.css'

function ReviewToggle({ label, icon: Icon, checked, onChange, disabled }) {
  return <div className="sd-review-item sd-review-item-toggle">
    <span className="sd-review-item-title"><Icon size={23} strokeWidth={1.7} aria-hidden="true" />{label}</span>
    <button
      type="button"
      className={`sd-review-toggle ${checked ? 'is-on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onPointerDown={event => event.preventDefault()}
      onClick={() => onChange(!checked)}
    ><span /></button>
  </div>
}

function ReviewAction({ label, icon: Icon, onClick, disabled, trailing = false }) {
  return <button type="button" className="sd-review-item sd-review-action" onPointerDown={event => event.preventDefault()} disabled={disabled} onClick={onClick}>
    <span className="sd-review-item-title"><Icon size={23} strokeWidth={1.7} aria-hidden="true" />{label}</span>
    {trailing ? <ChevronRight size={19} strokeWidth={1.7} aria-hidden="true" /> : null}
  </button>
}

function ReviewPageTitle({ label, back }) {
  return <div className="sd-review-page-title">
    <button type="button" onClick={back} aria-label="Back"><ArrowLeft size={21} /></button>
    <strong>{label}</strong>
  </div>
}

function ReviewMetric({ value, label }) {
  return <div className="sd-review-metric"><strong>{Number(value || 0).toLocaleString()}</strong><span>{label}</span></div>
}

export default function ShadowDocsMobileReviewPanel({
  editor = null,
  html = '',
  documentId = '',
  state = {},
  language = 'en',
  onCommand,
  onAITranslate,
  onAIReadAloud,
  onStopReadAloud,
  onUserNameChange,
  disabled = false,
}) {
  const labels = useMemo(() => getShadowDocsReviewLanguage(language), [language])
  const [preferences, setPreferences] = useState(() => readShadowDocsReviewPreferences(documentId))
  const [page, setPage] = useState('main')
  const [message, setMessage] = useState('')
  const [reading, setReading] = useState(false)
  const [userNameInput, setUserNameInput] = useState(preferences.userName)
  const [revisionList, setRevisionList] = useState([])
  const stats = getShadowDocsProofingStats(editor?.innerHTML ?? html)
  const markupVisible = typeof state.showMarkup === 'boolean' ? state.showMarkup : preferences.showMarkup

  useEffect(() => {
    const next = readShadowDocsReviewPreferences(documentId)
    setPreferences(next)
    setUserNameInput(next.userName)
    setMessage('')
    setPage('main')
  }, [documentId])

  useEffect(() => {
    applyShadowDocsReviewVisibility(editor, { ...preferences, showMarkup: markupVisible })
  }, [editor, preferences, markupVisible])

  useEffect(() => () => stopShadowDocsReadAloud(), [])

  function updatePreference(patch) {
    setPreferences(current => saveShadowDocsReviewPreferences(documentId, { ...current, ...patch }))
  }

  function command(name, value = true) {
    if (disabled || typeof onCommand !== 'function') return
    onCommand(name, value)
  }

  function selectedOrChapterText() {
    const selection = globalThis.getSelection?.()
    if (editor && selection?.rangeCount && editor.contains(selection.anchorNode) && editor.contains(selection.focusNode)) {
      const picked = selection.toString().trim()
      if (picked) return picked
    }
    if (editor) return editor.textContent || ''
    if (typeof DOMParser === 'undefined') return String(html).replace(/<[^>]+>/g, ' ')
    return new DOMParser().parseFromString(String(html), 'text/html').body.textContent || ''
  }

  function translate() {
    if (disabled) return
    if (typeof onAITranslate !== 'function') {
      setMessage(labels.notAvailable)
      return
    }
    const text = selectedOrChapterText().trim()
    if (!text) return setMessage(labels.noText)
    Promise.resolve().then(() => onAITranslate({ text, language })).catch(error => setMessage(error?.message || labels.notAvailable))
  }

  function readAloud() {
    if (disabled) return
    if (reading) {
      stopShadowDocsReadAloud()
      onStopReadAloud?.()
      setReading(false)
      return
    }
    const text = selectedOrChapterText().trim()
    if (!text) return setMessage(labels.noText)
    setMessage('')
    if (typeof onAIReadAloud === 'function') {
      Promise.resolve().then(() => onAIReadAloud({ text, language })).catch(error => setMessage(error?.message || labels.speechUnavailable))
      return
    }
    const started = startShadowDocsReadAloud(text, {
      language: getShadowDocsReviewSpeechLocale(language),
      onStateChange: setReading,
    })
    setMessage(started ? labels.localVoice : labels.speechUnavailable)
  }

  function openRevisions() {
    setRevisionList(listShadowDocsChanges(editor))
    setPage('revisions')
    setMessage('')
  }

  function saveUserName() {
    const next = saveShadowDocsReviewPreferences(documentId, { ...preferences, userName: userNameInput })
    setPreferences(next)
    setUserNameInput(next.userName)
    onUserNameChange?.(next.userName)
    setPage('main')
    setMessage(labels.added)
  }

  function toggleMarkup(next) {
    updatePreference({ showMarkup: next })
    if (typeof onCommand === 'function') command('showMarkup', next)
  }

  return <section className="sd-review-panel" aria-label={labels.review}>
    {page === 'main' ? <>
      <div className="sd-review-quick-grid">
        <button type="button" className="sd-review-quick" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={translate}>
          <Languages size={28} strokeWidth={1.6} /><span>{labels.translate}</span>
        </button>
        <button type="button" className="sd-review-quick" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={() => setPage('count')}>
          <FileText size={28} strokeWidth={1.6} /><span>{labels.wordCount}</span>
        </button>
        <button type="button" className="sd-review-quick" disabled={disabled} onPointerDown={event => event.preventDefault()} onClick={readAloud}>
          {reading ? <VolumeX size={28} strokeWidth={1.6} /> : <AudioLines size={28} strokeWidth={1.6} />}
          <span>{reading ? labels.stop : typeof onAIReadAloud === 'function' ? labels.aiReadAloud : labels.readAloud}</span>
        </button>
      </div>
      <div className="sd-review-card">
        <ReviewToggle label={labels.spellCheck} icon={SpellCheck2} checked={preferences.spellCheck} disabled={disabled || !editor} onChange={value => updatePreference({ spellCheck: value })} />
      </div>
      <div className="sd-review-card">
        <ReviewAction label={labels.insertComment} icon={MessageSquarePlus} disabled={disabled || typeof onCommand !== 'function'} onClick={() => command('newComment')} />
        <ReviewToggle label={labels.showComments} icon={MessageSquare} checked={preferences.showComments} disabled={disabled || !editor} onChange={value => updatePreference({ showComments: value })} />
      </div>
      <div className="sd-review-card">
        <ReviewToggle label={labels.trackChanges} icon={PenLine} checked={Boolean(state.trackChanges)} disabled={disabled || typeof onCommand !== 'function'} onChange={value => command('trackChanges', value)} />
        <ReviewAction label={labels.showRevisions} icon={Clock3} disabled={disabled || !editor} onClick={openRevisions} />
        <ReviewToggle label={labels.showMarkup} icon={FileText} checked={markupVisible} disabled={disabled || !editor} onChange={toggleMarkup} />
      </div>
      <div className="sd-review-card">
        <ReviewAction label={labels.changeUserName} icon={UserRound} disabled={disabled} onClick={() => { setUserNameInput(preferences.userName); setPage('name'); setMessage('') }} trailing />
      </div>
      {message ? <p className="sd-review-note" role="status">{message}</p> : null}
    </> : null}

    {page === 'count' ? <>
      <ReviewPageTitle label={labels.wordCount} back={() => setPage('main')} />
      <div className="sd-review-metrics">
        <ReviewMetric value={stats.words} label={labels.words} />
        <ReviewMetric value={stats.characters} label={labels.characters} />
        <ReviewMetric value={stats.paragraphs} label={labels.paragraphs} />
        <ReviewMetric value={stats.sentences} label={labels.sentences} />
      </div>
    </> : null}

    {page === 'revisions' ? <>
      <ReviewPageTitle label={labels.showRevisions} back={() => setPage('main')} />
      <div className="sd-review-card sd-review-revision-summary">
        <ReviewMetric value={revisionList.length} label={labels.changes} />
        <ReviewMetric value={getShadowDocsCommentMarks(editor).length} label={labels.commentMarks} />
      </div>
      {revisionList.length ? <div className="sd-review-card sd-review-revisions">
        {revisionList.map((item, index) => <div className="sd-review-revision" key={`${item.id}-${index}`}>
          <strong>{item.type === 'delete' ? labels.typeDelete : labels.typeInsert}</strong>
          <small>{item.author}{item.createdAt ? ` · ${new Date(item.createdAt).toLocaleString()}` : ''}</small>
          <p>{item.text}</p>
        </div>)}
      </div> : <p className="sd-review-note">{labels.noChanges}</p>}
      <div className="sd-review-revision-actions">
        <button type="button" disabled={disabled || !revisionList.length || !onCommand} onClick={() => command('previousChange')}>{labels.previous}</button>
        <button type="button" disabled={disabled || !revisionList.length || !onCommand} onClick={() => command('nextChange')}>{labels.next}</button>
      </div>
    </> : null}

    {page === 'name' ? <>
      <ReviewPageTitle label={labels.changeUserName} back={() => setPage('main')} />
      <div className="sd-review-card sd-review-name-form">
        <label htmlFor="sd-review-user-name">{labels.reviewName}</label>
        <input id="sd-review-user-name" value={userNameInput} maxLength={80} autoComplete="off" onChange={event => setUserNameInput(event.target.value)} />
        <button type="button" disabled={disabled || !userNameInput.trim()} onClick={saveUserName}><Check size={18} />{labels.save}</button>
      </div>
    </> : null}
  </section>
}
