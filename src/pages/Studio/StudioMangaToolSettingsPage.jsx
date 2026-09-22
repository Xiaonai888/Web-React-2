import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import StudioSpeechBubblePanel from './StudioSpeechBubblePanel'
import StudioComicPanelsPanel from './StudioComicPanelsPanel'
import StudioScreentonePanel from './StudioScreentonePanel'
import StudioMangaEffectsPanel from './StudioMangaEffectsPanel'
import StudioGradientPanel from './StudioGradientPanel'

const TOOLS = [
  { id: 'bubble', icon: 'fa-comment', en: 'Speech balloons', km: 'ពពុះសន្ទនា', zh: '对话气泡', ja: '吹き出し', ko: '말풍선' },
  { id: 'panels', icon: 'fa-table-cells-large', en: 'Comic frames', km: 'ស៊ុម Manga', zh: '漫画分镜', ja: 'コマ割り', ko: '만화 컷' },
  { id: 'screentone', icon: 'fa-circle-half-stroke', en: 'Screentones', km: 'ស្គ្រីនតូន', zh: '网点', ja: 'スクリーントーン', ko: 'スクリーントーン' },
  { id: 'effects', icon: 'fa-bolt', en: 'Manga effects', km: 'បែបផែន Manga', zh: '漫画特效', ja: 'マンガ効果', ko: '만화 효과' },
  { id: 'gradient', icon: 'fa-fill', en: 'Gradient', km: 'ពណ៌ជម្រាល', zh: '渐变', ja: 'グラデーション', ko: '그라데이션' },
]

const WORDS = {
  en: ['Manga tools', 'Choose a tool and set up its options.', 'Back to studio', 'Preview and settings', 'Select a visible, unlocked layer after these tools are connected to the canvas.', 'This page is prepared separately. Its Apply buttons become available after canvas integration.'],
  km: ['ឧបករណ៍ Manga', 'ជ្រើស Tool ហើយកំណត់របៀបប្រើ។', 'ត្រឡប់ទៅ Studio', 'ការកំណត់ Tool', 'ពេលភ្ជាប់ទៅ Canvas សូមជ្រើស Layer ដែលបង្ហាញ និងមិនចាក់សោ។', 'Page នេះត្រូវបានរៀបចំដោយឡែក។ ប៊ូតុងដាក់លើ Canvas នឹងអាចប្រើបានក្រោយភ្ជាប់កូដ។'],
  zh: ['漫画工具', '选择工具并设置选项。', '返回工作室', '预览与设置', '连接画布后，请选择可见且未锁定的图层。', '此页面独立准备。连接画布后才能使用应用按钮。'],
  ja: ['マンガツール', 'ツールと設定を選びます。', 'スタジオに戻る', 'プレビューと設定', 'キャンバスへの接続後は、表示中でロックされていないレイヤーを選んでください。', 'このページは独立して準備中です。キャンバスに接続した後で適用できます。'],
  ko: ['만화 도구', '도구를 선택하고 옵션을 설정하세요.', '스튜디오로 돌아가기', '미리보기와 설정', '캔버스 연결 후 보이는 잠금 해제 레이어를 선택하세요.', '이 페이지는 별도로 준비되었습니다. 캔버스 연결 후 적용 버튼을 사용할 수 있습니다.'],
}

export default function StudioMangaToolSettingsPage({ open = false, onClose, onApply, disabled = false, color = '#111111', initialTool = 'bubble' }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const [selected, setSelected] = useState(() => TOOLS.some((item) => item.id === initialTool) ? initialTool : 'bubble')

  useEffect(() => {
    if (open && TOOLS.some((item) => item.id === initialTool)) setSelected(initialTool)
  }, [open, initialTool])

  useEffect(() => {
    if (!open) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = oldOverflow }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const available = !disabled && typeof onApply === 'function'
  const apply = available ? (options) => onApply(selected, options) : undefined

  return createPortal(
    <div className="ss-manga-tool-page" role="dialog" aria-modal="true" aria-label={t[0]} onKeyDown={(event) => {
      event.stopPropagation()
      if (event.key === 'Escape') { event.preventDefault(); onClose?.() }
    }}>
      <style>{`
        .ss-manga-tool-page{position:fixed;inset:0;z-index:12010;display:flex;flex-direction:column;box-sizing:border-box;background:#202936;color:#edf4ff;font:inherit}
        .ss-manga-tool-page *{box-sizing:border-box}
        .ss-manga-tool-page-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid #4b627c;background:#283748}
        .ss-manga-tool-page-header h2{margin:0;font-size:17px}
        .ss-manga-tool-page-header p{margin:4px 0 0;font-size:11px;color:#c4d3e4}
        .ss-manga-tool-page-back{min-height:37px;padding:6px 12px;border:1px solid #6384a5;border-radius:6px;background:#37536e;color:white;font:inherit;cursor:pointer}
        .ss-manga-tool-page-layout{display:grid;grid-template-columns:minmax(185px,240px) minmax(0,1fr);flex:1;min-height:0;overflow:hidden}
        .ss-manga-tool-page-tabs{display:flex;flex-direction:column;gap:6px;overflow-y:auto;padding:12px;border-right:1px solid #485c73;background:#263442}
        .ss-manga-tool-page-tab{display:flex;align-items:center;gap:10px;min-height:43px;padding:9px;border:1px solid transparent;border-radius:6px;background:#32465a;color:#eaf3ff;font:inherit;font-size:12px;text-align:left;cursor:pointer}
        .ss-manga-tool-page-tab[aria-selected=true]{border-color:#9bcaff;background:#42678d;color:white;font-weight:700}
        .ss-manga-tool-page-tab:focus-visible,.ss-manga-tool-page-back:focus-visible{outline:2px solid #a8d4ff;outline-offset:2px}
        .ss-manga-tool-page-content{overflow-y:auto;overscroll-behavior:contain;padding:16px 20px 40px}
        .ss-manga-tool-page-content>h3{margin:0 0 9px;font-size:16px}
        .ss-manga-tool-page-content>p{margin:0 0 14px;font-size:11px;line-height:1.5;color:#c4d3e4}
        .ss-manga-tool-page-settings{width:min(100%,570px);padding:15px;border:1px solid #526980;border-radius:9px;background:#2b3c4d}
        .ss-manga-tool-page-settings .ss-comic-panels,.ss-manga-tool-page-settings .ss-speech-bubble-panel,.ss-manga-tool-page-settings .ss-screentone-panel{max-width:100%}
        @media(max-width:690px){.ss-manga-tool-page-header{padding:10px}.ss-manga-tool-page-header h2{font-size:15px}.ss-manga-tool-page-header p{display:none}.ss-manga-tool-page-back{padding:6px 9px;font-size:11px}.ss-manga-tool-page-layout{display:flex;flex-direction:column}.ss-manga-tool-page-tabs{flex:none;flex-direction:row;overflow-x:auto;overflow-y:hidden;min-height:56px;padding:7px;border-right:0;border-bottom:1px solid #485c73}.ss-manga-tool-page-tab{flex:0 0 auto;min-height:39px;white-space:nowrap;padding:7px;font-size:11px}.ss-manga-tool-page-content{padding:12px 12px 36px}.ss-manga-tool-page-settings{padding:10px}}
      `}</style>
      <header className="ss-manga-tool-page-header">
        <div><h2>{t[0]}</h2><p>{t[1]}</p></div>
        <button type="button" className="ss-manga-tool-page-back" onClick={() => onClose?.()}>{t[2]} ✕</button>
      </header>
      <div className="ss-manga-tool-page-layout">
        <nav className="ss-manga-tool-page-tabs" role="tablist" aria-label={t[0]}>
          {TOOLS.map((item) => <button key={item.id} type="button" role="tab" className="ss-manga-tool-page-tab" aria-selected={selected === item.id} onClick={() => setSelected(item.id)}>
            <i className={`fa-solid ${item.icon}`} aria-hidden="true" />{item[language] || item.en}
          </button>)}
        </nav>
        <main className="ss-manga-tool-page-content" role="tabpanel">
          <h3>{t[3]} · {TOOLS.find((item) => item.id === selected)?.[language] || TOOLS.find((item) => item.id === selected)?.en}</h3>
          <p>{available ? t[4] : t[5]}</p>
          <div className="ss-manga-tool-page-settings">
            {selected === 'bubble' ? <StudioSpeechBubblePanel onApply={apply} disabled={disabled} /> : null}
            {selected === 'panels' ? <StudioComicPanelsPanel onApply={apply} disabled={disabled} /> : null}
            {selected === 'screentone' ? <StudioScreentonePanel onApply={apply} disabled={disabled} /> : null}
            {selected === 'effects' ? <StudioMangaEffectsPanel onApply={apply} disabled={disabled} /> : null}
            {selected === 'gradient' ? <StudioGradientPanel color={color} onApply={apply} disabled={disabled} /> : null}
          </div>
        </main>
      </div>
    </div>, document.body
  )
}
