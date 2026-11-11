import { useMemo } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle2, SpellCheck2 } from 'lucide-react'
import { getShadowDocsProofingStats, inspectShadowDocsProofing } from './ShadowDocsProofingEngine'
import './ShadowDocsReviewDetails.css'

const LABELS = {
  en: { title: 'Spell Check', enabled: 'Device spell check', on: 'Enabled', off: 'Disabled', issues: 'Local writing checks', none: 'No repeated words or unusually long paragraphs detected.', notice: 'Spelling suggestions depend on your browser and installed language dictionaries. AI checking is not connected.', words: 'Words', sentences: 'Sentences', back: 'Back' },
  km: { title: 'ពិនិត្យអក្ខរាវិរុទ្ធ', enabled: 'ពិនិត្យតាមឧបករណ៍', on: 'បើក', off: 'បិទ', issues: 'ការពិនិត្យអត្ថបទក្នុងឧបករណ៍', none: 'មិនមានពាក្យស្ទួន ឬកថាខណ្ឌវែងខុសធម្មតាទេ។', notice: 'ការណែនាំអក្ខរាវិរុទ្ធអាស្រ័យលើ Browser និងវចនានុក្រម។ មិនទាន់ភ្ជាប់ AI ទេ។', words: 'ពាក្យ', sentences: 'ប្រយោគ', back: 'ត្រឡប់' },
  zh: { title: '拼写检查', enabled: '设备拼写检查', on: '已开启', off: '已关闭', issues: '本地写作检查', none: '未检测到重复用词或过长段落。', notice: '建议取决于浏览器和安装的词典，AI 检查尚未接入。', words: '词数', sentences: '句数', back: '返回' },
  ko: { title: '맞춤법 검사', enabled: '기기 맞춤법 검사', on: '켜짐', off: '꺼짐', issues: '로컬 글쓰기 검사', none: '반복 단어나 지나치게 긴 문단이 없습니다.', notice: '맞춤법 제안은 브라우저와 사전에 따라 달라집니다. AI 검사는 아직 연결되지 않았습니다.', words: '단어', sentences: '문장', back: '뒤로' },
  ja: { title: 'スペルチェック', enabled: '端末のスペルチェック', on: 'オン', off: 'オフ', issues: 'ローカル文章チェック', none: '重複語や極端に長い段落は見つかりませんでした。', notice: '修正候補はブラウザと辞書に依存します。AI 校正は未接続です。', words: '単語', sentences: '文', back: '戻る' },
}

export default function ShadowDocsReviewProofingPanel({ editor = null, html = '', language = 'en', enabled = true, onToggle, onBack, disabled = false }) {
  const labels = LABELS[String(language).slice(0, 2).toLowerCase()] || LABELS.en
  const source = editor?.innerHTML ?? html
  const stats = useMemo(() => getShadowDocsProofingStats(source), [source])
  const issues = useMemo(() => inspectShadowDocsProofing(source), [source])

  function toggle() {
    if (disabled) return
    onToggle?.(!enabled)
    if (editor) editor.spellcheck = !enabled
  }

  return <section className="sd-review-detail-panel" aria-label={labels.title}>
    <header className="sd-review-detail-header"><button type="button" aria-label={labels.back} onClick={onBack}><ArrowLeft size={21} /></button><strong>{labels.title}</strong><span>{issues.length}</span></header>
    <div className="sd-review-detail-stats"><span>{stats.words.toLocaleString()} {labels.words}</span><span>{stats.sentences.toLocaleString()} {labels.sentences}</span></div>
    <div className="sd-review-detail-setting"><div><SpellCheck2 size={23} /><strong>{labels.enabled}</strong></div><button type="button" role="switch" aria-checked={enabled} disabled={disabled || typeof onToggle !== 'function'} onClick={toggle} className={`sd-review-detail-switch ${enabled ? 'is-on' : ''}`}><span /></button></div>
    <h3 className="sd-review-detail-heading">{labels.issues}</h3>
    <div className="sd-review-detail-list">
      {issues.length ? issues.map((issue, index) => <div key={`${issue.type}-${index}`} className="sd-review-detail-issue"><AlertCircle size={19} /><span>{issue.message}</span></div>) : <p className="sd-review-detail-empty"><CheckCircle2 size={19} />{labels.none}</p>}
    </div>
    <p className="sd-review-detail-status">{labels.notice}</p>
  </section>
}
