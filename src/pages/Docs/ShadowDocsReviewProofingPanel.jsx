import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle2, SpellCheck2 } from 'lucide-react'
import { getShadowDocsProofingStats, inspectShadowDocsProofing } from './ShadowDocsProofingEngine'
import './ShadowDocsReviewDetails.css'

const LABELS = {
  en: { title: 'Spell Check', enabled: 'Device spell check', issues: 'Local writing checks', none: 'No repeated words or unusually long paragraphs detected.', empty: 'No text to inspect in this chapter.', notice: 'These checks run locally. Browser spelling suggestions depend on available dictionaries. AI Spell Check is a separate feature.', words: 'Words', paragraphs: 'Paragraphs', sentences: 'Sentences', back: 'Back', long: (p, n) => `Paragraph ${p} has ${n} words.`, repeat: w => `Repeated word: ${w}` },
  km: { title: 'ពិនិត្យអក្ខរាវិរុទ្ធ', enabled: 'ពិនិត្យតាមឧបករណ៍', issues: 'ការពិនិត្យអត្ថបទក្នុងឧបករណ៍', none: 'មិនមានពាក្យស្ទួន ឬកថាខណ្ឌវែងខុសធម្មតាទេ។', empty: 'មិនមានអត្ថបទសម្រាប់ពិនិត្យក្នុងភាគនេះទេ។', notice: 'ការពិនិត្យនេះដំណើរការក្នុងឧបករណ៍។ ការណែនាំអក្ខរាវិរុទ្ធអាស្រ័យលើ Browser និងវចនានុក្រម។ AI Spell Check ជាមុខងារដាច់ដោយឡែក។', words: 'ពាក្យ', paragraphs: 'កថាខណ្ឌ', sentences: 'ប្រយោគ', back: 'ត្រឡប់', long: (p, n) => `កថាខណ្ឌទី ${p} មាន ${n} ពាក្យ។`, repeat: w => `ពាក្យស្ទួន៖ ${w}` },
  zh: { title: '拼写检查', enabled: '设备拼写检查', issues: '本地写作检查', none: '未检测到重复用词或过长段落。', empty: '本章没有可检查的文本。', notice: '本地检查无需上传文本。浏览器拼写建议取决于词典；AI 校对是独立功能。', words: '词数', paragraphs: '段落', sentences: '句子', back: '返回', long: (p, n) => `第 ${p} 段有 ${n} 个词。`, repeat: w => `重复用词：${w}` },
  ko: { title: '맞춤법 검사', enabled: '기기 맞춤법 검사', issues: '로컬 글쓰기 검사', none: '반복 단어나 지나치게 긴 문단이 없습니다.', empty: '이 장에는 검사할 텍스트가 없습니다.', notice: '이 검사는 기기에서 실행됩니다. 브라우저 맞춤법 제안은 사전에 따라 다르며 AI 검사는 별도 기능입니다.', words: '단어', paragraphs: '문단', sentences: '문장', back: '뒤로', long: (p, n) => `${p}번 문단에 ${n}개 단어가 있습니다.`, repeat: w => `반복 단어: ${w}` },
  ja: { title: 'スペルチェック', enabled: '端末のスペルチェック', issues: 'ローカル文章チェック', none: '重複語や極端に長い段落は見つかりませんでした。', empty: 'この章に確認するテキストはありません。', notice: 'この確認は端末内で実行されます。ブラウザの修正候補は辞書に依存し、AI 校正は別機能です。', words: '単語', paragraphs: '段落', sentences: '文', back: '戻る', long: (p, n) => `段落 ${p} は ${n} 語です。`, repeat: w => `重複語：${w}` },
}

export default function ShadowDocsReviewProofingPanel({ editor = null, html = '', language = 'en', enabled = true, onToggle, onBack, disabled = false }) {
  const labels = LABELS[String(language).slice(0, 2).toLowerCase()] || LABELS.en
  const [source, setSource] = useState(() => editor?.innerHTML ?? html)
  const stats = useMemo(() => getShadowDocsProofingStats(source), [source])
  const issues = useMemo(() => inspectShadowDocsProofing(source), [source])

  useEffect(() => {
    const update = () => {
      const value = editor?.innerHTML ?? html
      setSource(previous => previous === value ? previous : value)
    }
    update()
    if (!editor) return undefined
    editor.addEventListener('input', update)
    const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(update)
    observer?.observe(editor, { childList: true, characterData: true, subtree: true })
    return () => {
      editor.removeEventListener('input', update)
      observer?.disconnect()
    }
  }, [editor, html])

  function toggle() {
    if (disabled || typeof onToggle !== 'function') return
    onToggle(!enabled)
    if (editor) editor.spellcheck = !enabled
  }

  function describeIssue(issue) {
    if (issue.type === 'long-paragraph') return labels.long(issue.paragraph, issue.words)
    if (issue.type === 'repeated-word') return labels.repeat(issue.word)
    return issue.message
  }

  return <section className="sd-review-detail-panel" aria-label={labels.title}>
    <header className="sd-review-detail-header"><button type="button" aria-label={labels.back} onClick={onBack}><ArrowLeft size={21} /></button><strong>{labels.title}</strong><span>{issues.length}</span></header>
    <div className="sd-review-detail-stats"><span>{stats.words.toLocaleString()} {labels.words}</span><span>{stats.paragraphs.toLocaleString()} {labels.paragraphs}</span><span>{stats.sentences.toLocaleString()} {labels.sentences}</span></div>
    <div className="sd-review-detail-setting"><div><SpellCheck2 size={23} /><strong>{labels.enabled}</strong></div><button type="button" role="switch" aria-checked={enabled} disabled={disabled || typeof onToggle !== 'function'} onClick={toggle} className={`sd-review-detail-switch ${enabled ? 'is-on' : ''}`}><span /></button></div>
    <h3 className="sd-review-detail-heading">{labels.issues}</h3>
    <div className="sd-review-detail-list">
      {issues.length ? issues.map((issue, index) => <div key={`${issue.type}-${issue.paragraph || issue.index || index}-${index}`} className="sd-review-detail-issue"><AlertCircle size={19} /><span>{describeIssue(issue)}</span></div>) : <p className="sd-review-detail-empty"><CheckCircle2 size={19} />{stats.characters ? labels.none : labels.empty}</p>}
    </div>
    <p className="sd-review-detail-status">{labels.notice}</p>
  </section>
}
