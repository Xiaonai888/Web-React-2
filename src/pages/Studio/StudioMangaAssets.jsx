import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const WORDS = {
  en: ['Bubbles', 'Panels', 'Screentones', 'Effects', 'Add to paper', 'Adding...', 'Could not add this asset.', 'This asset is painted onto the current canvas. Undo can remove it.'],
  km: ['ពពុះសន្ទនា', 'ស៊ុមរឿង', 'ស្គ្រីនតូន', 'បែបផែន', 'ដាក់លើក្រដាស', 'កំពុងដាក់...', 'មិនអាចដាក់ធនធាននេះបានទេ។', 'ធនធាននេះនឹងត្រូវគូរចូល Canvas បច្ចុប្បន្ន។ អាចប្រើ Undo ដើម្បីដកចេញ។'],
  zh: ['对话气泡', '分镜框', '网点', '效果', '放到画布', '添加中...', '无法添加素材。', '素材将绘制到当前画布，可使用撤销移除。'],
  ja: ['吹き出し', 'コマ枠', 'スクリーントーン', '効果', 'キャンバスに追加', '追加中...', '素材を追加できませんでした。', '素材は現在のキャンバスに描画されます。元に戻すで取り消せます。'],
  ko: ['말풍선', '컷 테두리', '스크린톤', '효과', '캔버스에 추가', '추가 중...', '소재를 추가할 수 없습니다.', '소재는 현재 캔버스에 그려집니다. 실행 취소로 제거할 수 있습니다.'],
}

const ASSETS = [
  { id: 'ellipse', group: 0, name: 'Ellipse', body: '<ellipse cx="256" cy="238" rx="205" ry="152" fill="white" stroke="black" stroke-width="9"/><path d="M187 367 135 440 269 383" fill="white" stroke="black" stroke-width="9" stroke-linejoin="round"/><path d="M187 367 269 383" fill="none" stroke="white" stroke-width="14"/>' },
  { id: 'thought', group: 0, name: 'Thought', body: '<path d="M112 358C22 327 53 255 79 229 40 164 103 106 168 114c28-64 111-72 157-21 74-26 151 45 123 108 59 49 24 135-46 144-17 70-111 95-161 47-45 41-110 33-129-34Z" fill="white" stroke="black" stroke-width="9"/><circle cx="123" cy="414" r="19" fill="white" stroke="black" stroke-width="7"/><circle cx="91" cy="460" r="10" fill="white" stroke="black" stroke-width="5"/>' },
  { id: 'shout', group: 0, name: 'Shout', body: '<path d="M255 43 290 105 370 51 365 134 459 117 411 190 480 246 407 281 459 369 375 354 354 462 286 398 239 476 207 389 114 450 131 352 43 359 104 284 28 227 113 191 68 103 170 125 177 40 232 115Z" fill="white" stroke="black" stroke-width="9" stroke-linejoin="round"/>' },
  { id: 'single-panel', group: 1, name: 'Panel frame', body: '<rect x="35" y="35" width="442" height="442" fill="none" stroke="black" stroke-width="15"/>' },
  { id: 'split-panel', group: 1, name: 'Split panels', body: '<rect x="35" y="35" width="442" height="442" fill="none" stroke="black" stroke-width="15"/><path d="M256 35V477" stroke="black" stroke-width="15"/>' },
  { id: 'triple-panel', group: 1, name: 'Three panels', body: '<rect x="35" y="35" width="442" height="442" fill="none" stroke="black" stroke-width="15"/><path d="M35 256H477M256 256V477" stroke="black" stroke-width="15"/>' },
  { id: 'dots', group: 2, name: 'Dot tone', body: '<defs><pattern id="tone" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="4" fill="black"/></pattern></defs><rect width="512" height="512" fill="url(#tone)"/>' },
  { id: 'diagonal', group: 2, name: 'Line tone', body: '<defs><pattern id="tone" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V22" stroke="black" stroke-width="3"/></pattern></defs><rect width="512" height="512" fill="url(#tone)"/>' },
  { id: 'crosshatch', group: 2, name: 'Crosshatch', body: '<defs><pattern id="tone" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 0 24 24M24 0 0 24" stroke="black" stroke-width="2"/></pattern></defs><rect width="512" height="512" fill="url(#tone)"/>' },
  { id: 'speed', group: 3, name: 'Speed lines', body: Array.from({ length: 27 }, (_, i) => `<path d="M${i * 21 - 20} 0 ${256 + (i - 13) * 5} 460" stroke="black" stroke-width="${i % 4 === 0 ? 5 : 2}"/>`).join('') },
  { id: 'impact', group: 3, name: 'Impact burst', body: Array.from({ length: 36 }, (_, i) => { const a = i * Math.PI / 18; return `<path d="M${256 + Math.cos(a) * 75} ${256 + Math.sin(a) * 75} ${256 + Math.cos(a) * 340} ${256 + Math.sin(a) * 340}" stroke="black" stroke-width="${i % 4 === 0 ? 8 : 3}"/>` }).join('') },
  { id: 'sparkle', group: 3, name: 'Sparkle', body: '<path d="M256 25 282 230 487 256 282 282 256 487 230 282 25 256 230 230Z" fill="white" stroke="black" stroke-width="7"/><path d="M90 70 101 111 142 122 101 133 90 174 79 133 38 122 79 111ZM411 360 423 398 461 410 423 422 411 460 399 422 361 410 399 398Z" fill="white" stroke="black" stroke-width="5"/>' },
]

const svgFor = (asset) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${asset.body}</svg>`

function toPng(asset) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(new Blob([svgFor(asset)], { type: 'image/svg+xml' }))
    const image = new Image()
    image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('image')) }
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 512
        const context = canvas.getContext('2d')
        if (!context) throw new Error('canvas')
        context.drawImage(image, 0, 0)
        canvas.toBlob((blob) => blob ? resolve(new File([blob], `${asset.id}.png`, { type: 'image/png' })) : reject(new Error('png')), 'image/png')
      } catch (error) { reject(error) }
    }
    image.src = objectUrl
  })
}

export default function StudioMangaAssets({ onInsert, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const [group, setGroup] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function insert(asset) {
    if (busy || disabled || !onInsert) return
    setBusy(true)
    setError('')
    try { await onInsert(await toPng(asset)) } catch { setError(t[6]) } finally { setBusy(false) }
  }

  return (
    <div className="ss-manga-assets">
      <style>{`
        .shadow-studio .ss-manga-assets .ss-asset-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin:8px 0}
        .shadow-studio .ss-manga-assets .ss-asset-groups button{padding:7px 2px;border:1px solid #566878;border-radius:5px;background:#26333f;color:#d5e1ed;font:inherit;font-size:10px;cursor:pointer}
        .shadow-studio .ss-manga-assets .ss-asset-groups button[aria-pressed=true]{background:#43688a;border-color:#9acbff;color:white}
        .shadow-studio .ss-manga-assets .ss-asset-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
        .shadow-studio .ss-manga-assets .ss-asset-grid button{min-width:0;display:grid;gap:4px;justify-items:center;padding:6px 3px;border:1px solid #536575;border-radius:5px;background:#354251;color:#e1eaf2;font:inherit;font-size:9px;cursor:pointer}
        .shadow-studio .ss-manga-assets .ss-asset-grid button:hover:not(:disabled){border-color:#a2cdf5;background:#465b6f}
        .shadow-studio .ss-manga-assets .ss-asset-grid button:disabled{opacity:.55;cursor:wait}
        .shadow-studio .ss-manga-assets .ss-asset-grid img{width:100%;max-width:75px;aspect-ratio:1;object-fit:contain;background:#f4f5f6;border-radius:3px}
        .shadow-studio .ss-manga-assets p{margin:8px 0 0;color:#b2c3d2;font-size:10px;line-height:1.5}
      `}</style>
      <div className="ss-asset-groups" role="group" aria-label="Manga asset categories">
        {t.slice(0, 4).map((label, index) => <button key={index} type="button" aria-pressed={group === index} onClick={() => setGroup(index)}>{label}</button>)}
      </div>
      <div className="ss-asset-grid">
        {ASSETS.filter((asset) => asset.group === group).map((asset) => <button key={asset.id} type="button" disabled={busy || disabled} title={`${t[4]}: ${asset.name}`} onClick={() => insert(asset)}><img alt="" src={`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgFor(asset))}`} /><span>{asset.name}</span></button>)}
      </div>
      <p role="status">{error || (busy ? t[5] : t[7])}</p>
    </div>
  )
}
