import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, ClipboardCopy, Languages, LoaderCircle, ShieldCheck, SpellCheck2 } from 'lucide-react'
import { requestShadowDocsReviewAI } from './ShadowDocsReviewAIApi'
import { detectShadowDocsLanguage } from './ShadowDocsLanguageEngine'
import './ShadowDocsReviewAIPanel.css'

const LANGUAGES = [
  { id: 'km', name: 'ខ្មែរ / Khmer' },
  { id: 'en', name: 'English' },
  { id: 'zh', name: '中文 / Chinese' },
  { id: 'ko', name: '한국어 / Korean' },
  { id: 'ja', name: '日本語 / Japanese' },
]

const LABELS = {
  en: { translate: 'AI Translate', proofread: 'AI Spell Check', back: 'Back', source: 'Text to review', target: 'Translate into', runTranslate: 'Translate text', runProofread: 'Check text', results: 'Result', copy: 'Copy result', copied: 'Copied', busy: 'Processing…', empty: 'Enter text before continuing.', tooLong: 'Select or enter up to 5000 characters.', privacy: 'Text is sent to the AI service only when you select the action.', placeholder: 'Selected text or chapter text', none: 'No result yet.', error: 'AI Review is unavailable.' },
  km: { translate: 'AI បកប្រែ', proofread: 'AI ពិនិត្យអក្ខរាវិរុទ្ធ', back: 'ត្រឡប់', source: 'អត្ថបទត្រូវពិនិត្យ', target: 'បកប្រែជាភាសា', runTranslate: 'បកប្រែអត្ថបទ', runProofread: 'ពិនិត្យអត្ថបទ', results: 'លទ្ធផល', copy: 'ចម្លងលទ្ធផល', copied: 'បានចម្លង', busy: 'កំពុងដំណើរការ…', empty: 'សូមបញ្ចូលអត្ថបទជាមុន។', tooLong: 'សូមជ្រើសអត្ថបទមិនលើស ៥០០០ តួអក្សរ។', privacy: 'ផ្ញើអត្ថបទទៅ AI តែពេលអ្នកចុចបញ្ជាប៉ុណ្ណោះ។', placeholder: 'អត្ថបទដែលជ្រើស ឬអត្ថបទក្នុងភាគ', none: 'មិនទាន់មានលទ្ធផល។', error: 'មិនអាចប្រើ AI Review បាន។' },
  zh: { translate: 'AI 翻译', proofread: 'AI 拼写检查', back: '返回', source: '待处理文本', target: '目标语言', runTranslate: '翻译文本', runProofread: '检查文本', results: '结果', copy: '复制结果', copied: '已复制', busy: '处理中…', empty: '请输入文本。', tooLong: '请限制在5000字符以内。', privacy: '只有在您点击操作时才会将文本发送至AI。', placeholder: '选定文本或章节文本', none: '暂无结果。', error: 'AI 服务不可用。' },
  ko: { translate: 'AI 번역', proofread: 'AI 맞춤법 검사', back: '뒤로', source: '검토할 텍스트', target: '번역 언어', runTranslate: '텍스트 번역', runProofread: '텍스트 검사', results: '결과', copy: '결과 복사', copied: '복사됨', busy: '처리 중…', empty: '텍스트를 입력하세요.', tooLong: '5000자 이내로 입력하세요.', privacy: '작업 버튼을 누른 경우에만 AI에 텍스트를 전송합니다.', placeholder: '선택한 텍스트 또는 장의 텍스트', none: '결과가 없습니다.', error: 'AI 검토 서비스를 사용할 수 없습니다.' },
  ja: { translate: 'AI 翻訳', proofread: 'AI 校正', back: '戻る', source: '校正する文章', target: '翻訳先の言語', runTranslate: '翻訳する', runProofread: '文章をチェック', results: '結果', copy: '結果をコピー', copied: 'コピーしました', busy: '処理中…', empty: 'テキストを入力してください。', tooLong: '5000文字以内にしてください。', privacy: '操作ボタンを押したときだけAIへ文章を送信します。', placeholder: '選択した文章または章の本文', none: 'まだ結果がありません。', error: 'AI校正を利用できません。' },
}

function extractText(html) {
  if (typeof DOMParser === 'undefined') return String(html || '').replace(/<[^>]+>/g, ' ')
  return new DOMParser().parseFromString(String(html || ''), 'text/html').body.textContent || ''
}

function reviewSource(selectedText, editor, html) {
  return String(selectedText || '').trim() || String(editor?.textContent || '').trim() || extractText(html).trim()
}

function defaultTarget(source) {
  return detectShadowDocsLanguage(source).id === 'en' ? 'km' : 'en'
}

export default function ShadowDocsReviewAIPanel({ mode = 'translate', editor = null, html = '', selectedText = '', language = 'km', onBack, disabled = false }) {
  const code = String(language || 'km').toLowerCase().split('-')[0]
  const labels = LABELS[code] || LABELS.en
  const task = mode === 'proofread' ? 'proofread' : 'translate'
  const [source, setSource] = useState(() => reviewSource(selectedText, editor, html))
  const [draft, setDraft] = useState(source)
  const [target, setTarget] = useState(() => defaultTarget(source))
  const [result, setResult] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const abortRef = useRef(null)

  useEffect(() => {
    setSource(reviewSource(selectedText, editor, html))
  }, [selectedText, editor, html])

  useEffect(() => {
    if (!editor || String(selectedText || '').trim()) return undefined
    const syncSource = () => setSource(reviewSource(selectedText, editor, html))
    editor.addEventListener('input', syncSource)
    return () => editor.removeEventListener('input', syncSource)
  }, [selectedText, editor, html])

  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setLoading(false)
    setDraft(source)
    setTarget(defaultTarget(source))
    setResult('')
    setMessage('')
  }, [source, task])

  useEffect(() => {
    if (!disabled) return
    abortRef.current?.abort()
    abortRef.current = null
    setLoading(false)
  }, [disabled])

  useEffect(() => () => abortRef.current?.abort(), [])

  function editDraft(next) {
    abortRef.current?.abort()
    abortRef.current = null
    setLoading(false)
    setDraft(next)
    setResult('')
    setMessage('')
  }

  function editTarget(next) {
    abortRef.current?.abort()
    abortRef.current = null
    setLoading(false)
    setTarget(next)
    setResult('')
    setMessage('')
  }

  async function run() {
    if (loading || disabled) return
    if (!draft.trim()) return setMessage(labels.empty)
    if (draft.length > 5000) return setMessage(labels.tooLong)
    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller
    setMessage('')
    setResult('')
    setLoading(true)
    try {
      const text = await requestShadowDocsReviewAI({ mode: task, text: draft, targetLanguage: target, sourceLanguage: 'auto', signal: controller.signal })
      if (abortRef.current === controller && !controller.signal.aborted) setResult(text)
    } catch (error) {
      if (abortRef.current === controller && !controller.signal.aborted) setMessage(error?.message || labels.error)
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        setLoading(false)
      }
    }
  }

  async function copyResult() {
    if (!result || !globalThis.navigator?.clipboard?.writeText) return
    try {
      await globalThis.navigator.clipboard.writeText(result)
      setMessage(labels.copied)
    } catch {
      setMessage(labels.error)
    }
  }

  function goBack() {
    abortRef.current?.abort()
    abortRef.current = null
    onBack?.()
  }

  return <section className="sd-review-ai-panel" aria-label={task === 'translate' ? labels.translate : labels.proofread}>
    <header className="sd-review-ai-header">
      <button type="button" aria-label={labels.back} onClick={goBack}><ArrowLeft size={21} /></button>
      {task === 'translate' ? <Languages size={22} /> : <SpellCheck2 size={22} />}
      <strong>{task === 'translate' ? labels.translate : labels.proofread}</strong>
    </header>
    <label className="sd-review-ai-label" htmlFor="sd-review-ai-source">{labels.source}</label>
    <textarea id="sd-review-ai-source" value={draft} onChange={event => editDraft(event.target.value)} placeholder={labels.placeholder} disabled={loading || disabled} rows={5} />
    <div className="sd-review-ai-count">{draft.length.toLocaleString()} / 5,000</div>
    {task === 'translate' ? <label className="sd-review-ai-target">{labels.target}
      <select value={target} disabled={loading || disabled} onChange={event => editTarget(event.target.value)}>{LANGUAGES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
    </label> : null}
    <button className="sd-review-ai-run" type="button" disabled={loading || disabled || !draft.trim() || draft.length > 5000} onClick={run}>
      {loading ? <LoaderCircle className="sd-review-ai-spin" size={18} /> : <Check size={18} />}
      {loading ? labels.busy : task === 'translate' ? labels.runTranslate : labels.runProofread}
    </button>
    <div className="sd-review-ai-disclosure"><ShieldCheck size={16} />{labels.privacy}</div>
    <div className="sd-review-ai-result-head"><strong>{labels.results}</strong>{result ? <button type="button" onClick={copyResult}><ClipboardCopy size={16} />{labels.copy}</button> : null}</div>
    <div className="sd-review-ai-result" aria-live="polite">{result || labels.none}</div>
    {message ? <p className="sd-review-ai-status" role="status">{message}</p> : null}
  </section>
}
