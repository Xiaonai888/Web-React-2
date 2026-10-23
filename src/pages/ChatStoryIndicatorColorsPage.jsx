import { useState } from 'react'
import { PageShell, PageHeader } from '../components/common/PagePrimitives'
import ChatStoryTapIndicator, { normalizeTapIndicatorSettings } from '../components/chat-story/ChatStoryTapIndicator'
import ChatStoryIndicatorColorPicker from '../components/chat-story/ChatStoryIndicatorColorPicker'
import { useChatStoryTheme } from '../services/chatStoryThemes'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('chatIndicatorColors', {
  en: { title: 'Choose colors', done: 'Done', back: 'Back', solid: 'Solid', gradient: 'Gradient', custom: 'Custom color {{number}}', add: 'Add color', remove: 'Remove color', angle: 'Angle', tap: 'Tap to continue', hex: 'Hex code', original: 'Your image keeps its original colors.' },
  km: { title: 'ជ្រើសរើសពណ៌', done: 'រួចរាល់', back: 'ត្រឡប់ក្រោយ', solid: 'ពណ៌តែមួយ', gradient: 'ពណ៌លាយ', custom: 'ពណ៌ផ្ទាល់ខ្លួន {{number}}', add: 'បន្ថែមពណ៌', remove: 'ដកពណ៌ចេញ', angle: 'មុំ', tap: 'ចុចដើម្បីបន្ត', hex: 'កូដពណ៌', original: 'រូបរបស់អ្នករក្សាពណ៌ដើម។' },
  zh: { title: '选择颜色', done: '完成', back: '返回', solid: '纯色', gradient: '渐变', custom: '自定义颜色 {{number}}', add: '添加颜色', remove: '移除颜色', angle: '角度', tap: '点击继续', hex: '十六进制颜色', original: '你的图片保留原始颜色。' },
  ja: { title: '色を選択', done: '完了', back: '戻る', solid: '単色', gradient: 'グラデーション', custom: 'カスタムカラー {{number}}', add: '色を追加', remove: '色を削除', angle: '角度', tap: 'タップして続ける', hex: 'カラーコード', original: '画像は元の色で表示されます。' },
  ko: { title: '색상 선택', done: '완료', back: '뒤로', solid: '단색', gradient: '그라데이션', custom: '사용자 색상 {{number}}', add: '색상 추가', remove: '색상 삭제', angle: '각도', tap: '탭하여 계속', hex: '색상 코드', original: '업로드한 이미지는 원래 색상을 유지합니다.' },
})

const PAGE_CSS = `
.cs-indicator-colors{position:fixed;inset:0;z-index:149;display:flex;flex-direction:column;height:100vh;height:100dvh;min-height:0;overflow:hidden;background:var(--shadow-bg-surface);color:var(--shadow-text-primary)}
.cs-indicator-colors>header{flex:none;padding-top:env(safe-area-inset-top,0px)}
.cs-indicator-colors .cs-indicator-done{border:0;background:#111827;color:#fff;font-size:13px;font-weight:400;line-height:20px;padding:6px 12px;border-radius:8px;cursor:pointer}
.cs-indicator-colors-main{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px 14px calc(24px + env(safe-area-inset-bottom,0px))}
.cs-indicator-colors-inner{max-width:680px;margin:auto}
.cs-indicator-colors-preview{box-sizing:border-box;min-height:180px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;overflow:hidden;border-radius:18px;padding:24px 16px}
.cs-indicator-colors-preview p{margin:0;font-size:13px;font-weight:400;color:var(--cs-muted)}
.cs-indicator-color-modes{display:flex;gap:8px;margin:18px 0 24px}
.cs-indicator-color-modes button{border:1px solid var(--shadow-border);border-radius:999px;padding:8px 15px;font-size:13px;line-height:20px;background:var(--shadow-bg-surface);color:var(--shadow-text-secondary);cursor:pointer}
.cs-indicator-color-modes button[aria-pressed=true]{background:#111827;color:#fff;border-color:#111827}
.cs-indicator-color-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0;font-size:13px;min-width:0}
.cs-indicator-color-value{display:flex;align-items:center;gap:10px;flex-shrink:0}
.cs-indicator-color-value button{width:44px;height:36px;padding:3px;border:1px solid var(--shadow-border);border-radius:8px;background:var(--shadow-bg-surface);cursor:pointer}
.cs-indicator-color-value button>span{display:block;width:100%;height:100%;border-radius:4px}
.cs-indicator-color-value code{font-size:12px;color:var(--shadow-text-primary)}
.cs-indicator-color-action{border:1px solid var(--shadow-border);background:var(--shadow-bg-surface);color:var(--shadow-text-primary);border-radius:8px;padding:7px 12px;font-size:12px;cursor:pointer}
.cs-indicator-color-actions{display:flex;gap:10px;margin:14px 0}
.cs-indicator-angle{display:flex;align-items:center;gap:12px;margin-top:22px;font-size:13px}
.cs-indicator-angle input{flex:1;min-width:0;accent-color:#111827}
.cs-indicator-angle output{min-width:35px;text-align:right;font-variant-numeric:tabular-nums}
.cs-indicator-original{font-size:13px;color:var(--shadow-text-secondary);line-height:1.7;margin-top:20px}
`

export default function ChatStoryIndicatorColorsPage({ settings, onBack, onDone, skipAnimation = false }) {
  const { t } = useDisplayTranslation()
  const { style: themeStyle } = useChatStoryTheme()
  const [draft, setDraft] = useState(() => normalizeTapIndicatorSettings(settings))
  const [editing, setEditing] = useState(null)
  const custom = draft.source === 'custom'
  const gradient = draft.colorMode === 'gradient'
  const visibleColors = gradient ? draft.colors : draft.colors.slice(0, 1)
  const text = (key, values) => t(`chatIndicatorColors.${key}`, values)

  const chooseMode = (mode) => {
    setEditing(null)
    setDraft((current) => ({
      ...current,
      colorMode: mode,
      colors: mode === 'gradient' && current.colors.length < 2 ? [current.colors[0], '#c4b5fd'] : current.colors,
    }))
  }

  const updateColor = (color) => {
    if (editing === null || !/^#[0-9a-f]{6}$/i.test(color)) return
    setDraft((current) => ({ ...current, colors: current.colors.map((item, index) => index === editing ? color : item) }))
  }

  return (
    <PageShell className="cs-indicator-colors" >
      <style>{PAGE_CSS}</style>
      <PageHeader
        title={<span style={{ fontWeight: 700 }}>{text('title')}</span>}
        onBack={onBack}
        backLabel={text('back')}
        right={<button type="button" className="cs-indicator-done" onClick={() => onDone?.(normalizeTapIndicatorSettings(draft))}>{text('done')}</button>}
      />
      <main className="cs-indicator-colors-main">
        <div className="cs-indicator-colors-inner">
          <div className="cs-indicator-colors-preview theme-preserve" style={themeStyle}>
            <ChatStoryTapIndicator settings={draft} size={96} skipAnimation={skipAnimation} />
            <p>{text('tap')}</p>
          </div>
          {custom ? <p className="cs-indicator-original">{text('original')}</p> : <>
            <div className="cs-indicator-color-modes">
              <button type="button" aria-pressed={!gradient} onClick={() => chooseMode('solid')}>{text('solid')}</button>
              <button type="button" aria-pressed={gradient} onClick={() => chooseMode('gradient')}>{text('gradient')}</button>
            </div>
            {visibleColors.map((color, index) => <div className="cs-indicator-color-row" key={index}>
              <span>{text('custom', { number: index + 1 })}</span>
              <div className="cs-indicator-color-value">
                <button type="button" aria-label={text('custom', { number: index + 1 })} onClick={() => setEditing(index)}><span style={{ background: color }} /></button>
                <code>{color.toUpperCase()}</code>
              </div>
            </div>)}
            {gradient ? <>
              <div className="cs-indicator-color-actions">
                {draft.colors.length < 3 ? <button type="button" className="cs-indicator-color-action" onClick={() => setDraft((current) => ({ ...current, colors: [...current.colors, '#f9a8d4'] }))}>{text('add')}</button> : null}
                {draft.colors.length > 2 ? <button type="button" className="cs-indicator-color-action" onClick={() => { setEditing(null); setDraft((current) => ({ ...current, colors: current.colors.slice(0, -1) })) }}>{text('remove')}</button> : null}
              </div>
              <label className="cs-indicator-angle"><span>{text('angle')}</span><input type="range" min="0" max="360" value={draft.gradientAngle} aria-label={text('angle')} onChange={(event) => setDraft((current) => ({ ...current, gradientAngle: Number(event.target.value) }))} /><output>{draft.gradientAngle}°</output></label>
            </> : null}
          </>}
        </div>
      </main>
      {!custom && editing !== null ? <ChatStoryIndicatorColorPicker key={editing} value={draft.colors[editing]} title={text('custom', { number: editing + 1 })} hexLabel={text('hex')} onChange={updateColor} onClose={() => setEditing(null)} /> : null}
    </PageShell>
  )
}
