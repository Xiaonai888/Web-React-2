import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Clock3, SpellCheck2, Sparkles } from 'lucide-react'
import { captureShadowDocsSelection } from './ShadowDocsSelectionEngine'
import ShadowDocsMobileReviewPanel from './ShadowDocsMobileReviewPanel'
import ShadowDocsReviewCommentsPanel from './ShadowDocsReviewCommentsPanel'
import ShadowDocsReviewRevisionsPanel from './ShadowDocsReviewRevisionsPanel'
import ShadowDocsReviewProofingPanel from './ShadowDocsReviewProofingPanel'
import ShadowDocsReviewAIPanel from './ShadowDocsReviewAIPanel'
import { readShadowDocsReviewPreferences, saveShadowDocsReviewPreferences } from './ShadowDocsReviewPreferences'
import './ShadowDocsReviewDetails.css'
import './ShadowDocsMobileReviewWorkspace.css'

const LABELS = {
  km: ['មតិយោបល់', 'ការកែប្រែ', 'ពិនិត្យអត្ថបទ', 'AI ពិនិត្យអក្ខរាវិរុទ្ធ'],
  en: ['Comments', 'Revisions', 'Local Proofing', 'AI Spell Check'],
  zh: ['批注', '修订', '本地校对', 'AI 拼写检查'],
  ko: ['댓글', '수정 내역', '로컬 교정', 'AI 맞춤법 검사'],
  ja: ['コメント', '変更履歴', 'ローカル校正', 'AI 校正'],
}

export default function ShadowDocsMobileReviewWorkspace({ state = {}, onCommand, disabled = false }) {
  const editor = typeof document === 'undefined' ? null : document.querySelector('.sd-writing-area[data-chapter-id]')
  const chapterId = editor?.dataset.chapterId || ''
  const documentId = chapterId
  const language = String(state.documentLanguage || 'km').slice(0, 2).toLowerCase()
  const labels = LABELS[language] || LABELS.en
  const [screen, setScreen] = useState('main')
  const [selectedText, setSelectedText] = useState('')
  const [preferences, setPreferences] = useState(() => readShadowDocsReviewPreferences(documentId))
  const selectionRef = useRef(null)

  useEffect(() => {
    setScreen('main')
    setSelectedText('')
    setPreferences(readShadowDocsReviewPreferences(documentId))
  }, [documentId])

  function notifyContentChange() {
    editor?.dispatchEvent(new Event('input', { bubbles: true }))
  }

  function navigate(to) {
    selectionRef.current = captureShadowDocsSelection(editor)
    setPreferences(readShadowDocsReviewPreferences(documentId))
    setSelectedText(selectionRef.current?.text || '')
    setScreen(to)
  }

  function runCommand(id, value = true) {
    if (disabled) return
    if (id === 'newComment') return navigate('comments')
    onCommand?.(id, value)
  }

  function changeSpellCheck(value) {
    const next = saveShadowDocsReviewPreferences(documentId, { ...preferences, spellCheck: value })
    setPreferences(next)
    if (editor) editor.spellcheck = next.spellCheck
  }

  const back = () => setScreen('main')
  const items = [
    ['comments', MessageSquare, labels[0]],
    ['revisions', Clock3, labels[1]],
    ['proofing', SpellCheck2, labels[2]],
    ['proofread', Sparkles, labels[3]],
  ]

  return <div className="sd-review-workspace" aria-label="Shadow Docs review workspace">
    {screen === 'main' ? <>
      <ShadowDocsMobileReviewPanel
        key={documentId}
        editor={editor}
        html={editor?.innerHTML || ''}
        documentId={documentId}
        language={language}
        state={state}
        onCommand={runCommand}
        onAITranslate={({ text }) => {
          setSelectedText(text)
          setScreen('translate')
        }}
        disabled={disabled}
      />
      <div className="sd-review-workspace-links">
        {items.map(([id, Icon, label]) => <button type="button" key={id} onPointerDown={event => event.preventDefault()} onClick={() => navigate(id)} disabled={!editor || (disabled && id !== 'proofing')}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></button>)}
      </div>
    </> : null}
    {screen === 'comments' ? <ShadowDocsReviewCommentsPanel
      documentId={documentId}
      chapterId={chapterId}
      editor={editor}
      selectionSnapshot={selectionRef.current}
      userName={readShadowDocsReviewPreferences(documentId).userName}
      language={language}
      onContentChange={notifyContentChange}
      onBack={back}
      disabled={disabled}
    /> : null}
    {screen === 'revisions' ? <ShadowDocsReviewRevisionsPanel
      editor={editor}
      chapterId={chapterId}
      language={language}
      onContentChange={notifyContentChange}
      onBack={back}
      disabled={disabled}
    /> : null}
    {screen === 'proofing' ? <ShadowDocsReviewProofingPanel
      editor={editor}
      language={language}
      enabled={preferences.spellCheck}
      onToggle={changeSpellCheck}
      onBack={back}
      disabled={disabled}
    /> : null}
    {screen === 'translate' || screen === 'proofread' ? <ShadowDocsReviewAIPanel
      key={screen}
      mode={screen}
      editor={editor}
      selectedText={selectedText}
      language={language}
      onBack={back}
      disabled={disabled}
    /> : null}
  </div>
}
