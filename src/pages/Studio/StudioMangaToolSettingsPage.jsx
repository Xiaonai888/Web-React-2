import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { StudioUIButton, StudioUISection } from './StudioUIControls'
import StudioSpeechBubblePanel from './StudioSpeechBubblePanel'
import StudioMangaBalloonTool from './StudioMangaBalloonTool'
import StudioComicPanelsPanel from './StudioComicPanelsPanel'
import StudioScreentonePanel from './StudioScreentonePanel'
import StudioMangaEffectsPanel from './StudioMangaEffectsPanel'
import StudioGradientPanel from './StudioGradientPanel'

const TOOLS = [
  { id: 'bubble', icon: 'fa-comment', en: 'Speech balloons', km: 'ពពុះសន្ទនា', zh: '对话气泡', ja: '吹き出し', ko: '말풍선' },
  { id: 'balloon', icon: 'fa-comment-dots', en: 'Manga balloon · Preview', km: 'ពពុះ Manga · មើលជាមុន', zh: '漫画气泡 · 预览', ja: 'マンガ吹き出し · プレビュー', ko: '만화 말풍선 · 미리보기' },
  { id: 'panels', icon: 'fa-table-cells-large', en: 'Comic frames', km: 'ស៊ុម Manga', zh: '漫画分镜', ja: 'コマ割り', ko: '만화 컷' },
  { id: 'screentone', icon: 'fa-circle-half-stroke', en: 'Screentones', km: 'ស្គ្រីនតូន', zh: '网点', ja: 'スクリーントーン', ko: '스크린톤' },
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
    const keydown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onClose?.()
    }
    window.addEventListener('keydown', keydown, true)
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', keydown, true)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const available = !disabled && typeof onApply === 'function'
  const apply = available ? (options) => onApply(selected, options) : undefined
  const activeTool = TOOLS.find((item) => item.id === selected) || TOOLS[0]
  const activeLabel = activeTool[language] || activeTool.en

  return createPortal(
    <div className="ss-manga-ui-page" role="dialog" aria-modal="true" aria-label={t[0]}>
      <style>{`
        .ss-manga-ui-page{
          --ss-ui-bg:#20262d;
          --ss-ui-panel:#29313a;
          --ss-ui-panel-2:#313b46;
          --ss-ui-line:#4b5968;
          --ss-ui-line-soft:#3b4651;
          --ss-ui-text:#edf3fa;
          --ss-ui-muted:#aab8c6;
          --ss-ui-blue:#5faeff;
          --ss-ui-blue-soft:#355d84;
          position:fixed;inset:0;z-index:12010;display:flex;flex-direction:column;box-sizing:border-box;
          background:#20262d;color:#edf3fa;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }
        .ss-manga-ui-page *{box-sizing:border-box}
        .ss-manga-ui-header{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 12px 8px 16px;border-bottom:1px solid #4b5968;background:linear-gradient(180deg,#35414d,#29323c)}
        .ss-manga-ui-title{min-width:0;display:flex;align-items:center;gap:10px}
        .ss-manga-ui-title>i{width:28px;height:28px;display:grid;place-items:center;border:1px solid #53708b;border-radius:7px;background:#2c3e50;color:#8bc4ff;font-size:13px}
        .ss-manga-ui-title>span{min-width:0;display:flex;flex-direction:column;gap:2px}
        .ss-manga-ui-title strong{font-size:14px;font-weight:800}
        .ss-manga-ui-title small{color:#aab8c6;font-size:9px}
        .ss-manga-ui-layout{min-height:0;flex:1;display:grid;grid-template-columns:220px minmax(0,1fr);overflow:hidden}
        .ss-manga-ui-nav{min-height:0;overflow:auto;padding:8px;border-right:1px solid #3b4651;background:#242b33}
        .ss-manga-ui-nav-inner{display:grid;gap:4px}
        .ss-manga-ui-tab{width:100%;min-height:39px;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:6px;padding:0 8px;border:1px solid transparent;border-radius:6px;background:transparent;color:#dbe6f0;text-align:left;font:650 10px Inter,system-ui,sans-serif;cursor:pointer}
        .ss-manga-ui-tab i{width:24px;height:24px;display:grid;place-items:center;border-radius:5px;background:#303b46;color:#9bb7d0}
        .ss-manga-ui-tab:hover:not(:disabled){background:#303b46}
        .ss-manga-ui-tab[aria-selected=true]{border-color:#6fa6d5;background:#355d84;color:#fff}
        .ss-manga-ui-tab[aria-selected=true] i{background:#2d73aa;color:#fff}
        .ss-manga-ui-tab:focus-visible{outline:2px solid #5faeff;outline-offset:2px}
        .ss-manga-ui-main{min-width:0;min-height:0;overflow:auto;padding:14px 16px 34px}
        .ss-manga-ui-heading{width:min(100%,760px);margin-bottom:10px}
        .ss-manga-ui-heading h3{margin:0 0 4px;font-size:14px}
        .ss-manga-ui-heading p{margin:0;color:#aab8c6;font-size:9px;line-height:1.45}
        .ss-manga-ui-settings{width:min(100%,760px)}
        .ss-manga-ui-settings>.ss-ui-section>.ss-ui-section-body{padding:12px}
        .ss-manga-ui-settings .ss-comic-panels,.ss-manga-ui-settings .ss-speech-bubble-panel,.ss-manga-ui-settings .ss-screentone-panel{max-width:100%}
        @media(max-width:760px),(pointer:coarse){
          .ss-manga-ui-header{min-height:52px;padding:7px 9px}
          .ss-manga-ui-title small{display:none}
          .ss-manga-ui-layout{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}
          .ss-manga-ui-nav{overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid #3b4651;padding:6px}
          .ss-manga-ui-nav-inner{display:flex;gap:5px;width:max-content}
          .ss-manga-ui-tab{width:auto;min-width:44px;grid-template-columns:24px auto;min-height:36px;padding:0 8px;white-space:nowrap}
          .ss-manga-ui-main{padding:10px 10px 28px}
        }
        @media(max-width:430px){
          .ss-manga-ui-title strong{font-size:12px}
          .ss-manga-ui-tab span{display:none}
          .ss-manga-ui-tab{grid-template-columns:24px;min-width:38px;justify-content:center;padding:0 6px}
          .ss-manga-ui-tab i{background:transparent}
        }
      `}</style>

      <header className="ss-manga-ui-header">
        <div className="ss-manga-ui-title">
          <i className="fa-solid fa-pen-ruler" aria-hidden="true" />
          <span><strong>{t[0]}</strong><small>{t[1]}</small></span>
        </div>
        <StudioUIButton icon="fa-solid fa-arrow-left" onClick={onClose}>{t[2]}</StudioUIButton>
      </header>

      <div className="ss-manga-ui-layout">
        <nav className="ss-manga-ui-nav" role="tablist" aria-label={t[0]}>
          <div className="ss-manga-ui-nav-inner">
            {TOOLS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                className="ss-manga-ui-tab"
                aria-selected={selected === item.id}
                title={item[language] || item.en}
                onClick={() => setSelected(item.id)}
              >
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{item[language] || item.en}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="ss-manga-ui-main" role="tabpanel">
          <div className="ss-manga-ui-heading">
            <h3>{t[3]} · {activeLabel}</h3>
            <p>{available ? t[4] : t[5]}</p>
          </div>

          <div className="ss-manga-ui-settings">
            <StudioUISection title={activeLabel} icon={`fa-solid ${activeTool.icon}`}>
              {selected === 'bubble' ? <StudioSpeechBubblePanel onApply={apply} disabled={disabled} /> : null}
              {selected === 'balloon' ? <StudioMangaBalloonTool onApply={apply} disabled={disabled} color={color} /> : null}
              {selected === 'panels' ? <StudioComicPanelsPanel onApply={apply} disabled={disabled} /> : null}
              {selected === 'screentone' ? <StudioScreentonePanel onApply={apply} disabled={disabled} /> : null}
              {selected === 'effects' ? <StudioMangaEffectsPanel onApply={apply} disabled={disabled} /> : null}
              {selected === 'gradient' ? <StudioGradientPanel color={color} onApply={apply} disabled={disabled} /> : null}
            </StudioUISection>
          </div>
        </main>
      </div>
    </div>,
    document.body,
  )
}
