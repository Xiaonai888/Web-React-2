import { useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import StudioMangaAssets from './StudioMangaAssets'

const LABELS = {
  en: ['Assets', 'Brushes', 'Search assets…', 'Bubbles · Panels · Screentones · Effects', 'Backgrounds', 'Poses', 'Textures', 'Brush stamps', 'No matching assets.', 'Adding…', 'Could not add this asset.', 'Select an unlocked visible layer first.'],
  km: ['ធនធាន', 'ជក់', 'ស្វែងរកធនធាន…', 'ពពុះ · ស៊ុម · ស្គ្រីនតូន · បែបផែន', 'ផ្ទៃខាងក្រោយ', 'កាយវិការ', 'វាយនភាព', 'ត្រាជក់', 'រកមិនឃើញធនធាន។', 'កំពុងដាក់…', 'មិនអាចដាក់ធនធានបានទេ។', 'សូមជ្រើស Layer ដែលមិនលាក់ និងមិនចាក់សោ។'],
  zh: ['素材', '画笔', '搜索素材…', '气泡 · 分镜 · 网点 · 特效', '背景', '姿势', '纹理', '笔刷印章', '没有匹配的素材。', '添加中…', '无法添加素材。', '先选择可见且未锁定的图层。'],
  ja: ['素材', 'ブラシ', '素材を検索…', '吹き出し · コマ割り · トーン · 効果', '背景', 'ポーズ', 'テクスチャ', 'ブラシスタンプ', '一致する素材がありません。', '追加中…', '素材を追加できません。', '表示されロックされていないレイヤーを選択してください。'],
  ko: ['에셋', '브러시', '에셋 검색…', '말풍선 · 컷 · 톤 · 효과', '배경', '포즈', '텍스처', '브러시 스탬프', '일치하는 에셋이 없습니다.', '에셋 추가 중…', '에셋을 추가할 수 없습니다.', '표시되고 잠금 해제된 레이어를 먼저 선택하세요.'],
}

const DEFINITIONS = [
  { id: 'sky-clouds', category: 'backgrounds', name: 'Cloudy sky', body: '<rect width="512" height="512" fill="#f3f6fa"/><path d="M0 360 80 325 136 337 205 303 305 332 385 298 512 334V512H0Z" fill="#d8e1e9"/><g fill="white" stroke="#303c46" stroke-width="5"><path d="M65 145c-25-50 30-90 72-59 25-60 108-35 107 15 50-3 60 60 12 76H98c-22 0-34-15-33-32Z"/><path d="M278 237c-16-39 26-65 58-43 25-51 85-23 84 19 37-2 45 42 8 56H313c-23 0-35-12-35-32Z"/></g>' },
  { id: 'city-street', category: 'backgrounds', name: 'City street', body: '<rect width="512" height="512" fill="white"/><g fill="none" stroke="#27343e" stroke-width="6"><path d="M0 450 256 305 512 450M0 492 256 329 512 492M256 305V512"/><path d="M0 338V93h132v238M132 130h125v176M257 46h190v306M447 157h65v198"/><path d="M21 120h33v45H21zm61 0h33v45H82zM21 211h33v45H21zm61 0h33v45H82zM156 158h31v42h-31zm49 0h31v42h-31zM280 78h39v55h-39zm59 0h39v55h-39zm61 0h30v55h-30zM280 166h39v55h-39zm59 0h39v55h-39zm61 0h30v55h-30z"/></g>' },
  { id: 'room-interior', category: 'backgrounds', name: 'Room interior', body: '<rect width="512" height="512" fill="white"/><g stroke="#26323d" stroke-width="6" fill="none"><path d="M0 333h512M256 185V512M0 0l256 185L512 0"/><path d="M35 63h148v185H35zM51 82h116v146H51zM109 82v146M51 155h116"/><path d="M310 291h171v110H310zM290 402h210M324 402v80M466 402v80M300 274h190M334 313h118v64H334z"/></g>' },
  { id: 'pose-standing', category: 'poses', name: 'Standing guide', body: '<g fill="none" stroke="#333f4a" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><circle cx="256" cy="74" r="45"/><path d="M256 120v163m-87-120 87-22 87 22m-174 0-35 117m209-117 35 117m-112 3-71 166m71-166 71 166"/></g><g fill="#9db5c8" stroke="white" stroke-width="5"><circle cx="256" cy="141" r="9"/><circle cx="169" cy="163" r="9"/><circle cx="343" cy="163" r="9"/><circle cx="256" cy="283" r="9"/><circle cx="185" cy="449" r="9"/><circle cx="327" cy="449" r="9"/></g>' },
  { id: 'pose-running', category: 'poses', name: 'Running guide', body: '<g fill="none" stroke="#333f4a" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><circle cx="289" cy="86" r="42"/><path d="M277 132 230 272 154 180 86 216m144 56 122 28 63-89m-185 61-104 93-78 6m182-99 56 129 104 45"/></g><g fill="#9db5c8" stroke="white" stroke-width="5"><circle cx="230" cy="272" r="9"/><circle cx="154" cy="180" r="9"/><circle cx="352" cy="300" r="9"/><circle cx="126" cy="365" r="9"/><circle cx="286" cy="401" r="9"/></g>' },
  { id: 'pose-sitting', category: 'poses', name: 'Sitting guide', body: '<g fill="none" stroke="#333f4a" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"><circle cx="267" cy="80" r="42"/><path d="M267 123 243 268l123 36 64 82M243 268l-106 52 9 114M251 163l-97 77 51 70m67-153 76 80-27 85M93 440h362M165 314h218m-20 0v124"/></g>' },
  { id: 'texture-dots', category: 'textures', name: 'Fine dots', body: '<defs><pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2.7" fill="#26323d"/></pattern></defs><rect width="512" height="512" fill="url(#p)"/>' },
  { id: 'texture-hatch', category: 'textures', name: 'Crosshatch', body: '<defs><pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 0 28 28M28 0 0 28" stroke="#26323d" stroke-width="2"/></pattern></defs><rect width="512" height="512" fill="url(#p)"/>' },
  { id: 'texture-grid', category: 'textures', name: 'Grid', body: '<defs><pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#6f7a83" stroke-width="2"/></pattern></defs><rect width="512" height="512" fill="url(#p)"/>' },
  { id: 'stamp-stars', category: 'stamps', name: 'Star stamps', body: '<g fill="#17212b"><path d="m256 30 34 150 150 34-150 34-34 150-34-150-150-34 150-34Z"/><path d="m92 330 17 64 64 17-64 17-17 64-17-64-64-17 64-17Z"/><path d="m410 320 14 50 50 14-50 14-14 50-14-50-50-14 50-14Z"/></g>' },
  { id: 'stamp-leaves', category: 'stamps', name: 'Leaf stamps', body: '<g stroke="#17212b" stroke-width="7" fill="none"><path d="M256 475V105M256 267C129 210 90 128 120 33c124 17 178 88 136 234ZM257 340C382 286 430 190 394 105c-121 19-177 99-137 235Z"/><path d="M153 110 256 267m129-83L257 340"/></g>' },
  { id: 'stamp-speed', category: 'stamps', name: 'Speed marks', body: '<g fill="none" stroke="#17212b" stroke-linecap="round"><path d="M24 105h464M30 175h305M159 250h327M26 326h452M82 401h406" stroke-width="12"/><path d="M300 147h182M30 285h90M33 437h302" stroke-width="5"/></g>' },
]

const svgFor = (asset) => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${asset.body}</svg>`

function toPng(asset) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svgFor(asset)], { type: 'image/svg+xml' }))
    const image = new Image()
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read the asset.')) }
    image.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 512
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas is unavailable.')); return }
      ctx.drawImage(image, 0, 0)
      canvas.toBlob((blob) => blob ? resolve(new File([blob], `${asset.id}.png`, { type: 'image/png' })) : reject(new Error('Could not create the image.')), 'image/png')
    }
    image.src = url
  })
}

export default function StudioAssetLibraryPanel({ onInsert, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = LABELS[language] || LABELS.en
  const [section, setSection] = useState('assets')
  const [category, setCategory] = useState('classic')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const catalog = useMemo(() => DEFINITIONS.filter((asset) => asset.category === (section === 'brushes' ? 'stamps' : category) && asset.name.toLowerCase().includes(query.toLowerCase().trim())), [section, category, query])
  const categories = [{ id: 'classic', label: t[3] }, { id: 'backgrounds', label: t[4] }, { id: 'poses', label: t[5] }, { id: 'textures', label: t[6] }]

  async function insert(asset) {
    if (busy || disabled || typeof onInsert !== 'function') return
    setBusy(true)
    setError('')
    try { await onInsert(await toPng(asset)) }
    catch (reason) { setError(reason?.message || t[10]) }
    finally { setBusy(false) }
  }

  return (
    <section className="ss-asset-library" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-asset-library{display:grid;gap:9px;min-width:0;color:#e9f1f9;font-size:11px}
        .shadow-studio .ss-asset-library-tabs,.shadow-studio .ss-asset-library-categories{display:flex;flex-wrap:wrap;gap:4px}
        .shadow-studio .ss-asset-library button{font:inherit;cursor:pointer}
        .shadow-studio .ss-asset-library-tabs button,.shadow-studio .ss-asset-library-categories button{flex:1 1 auto;min-width:0;padding:6px 5px;border:1px solid #566a7b;border-radius:5px;background:#2c3a48;color:#d7e4f0;font-size:10px}
        .shadow-studio .ss-asset-library button[aria-pressed=true]{border-color:#9bc9f5;background:#4d7296;color:white}
        .shadow-studio .ss-asset-library input{box-sizing:border-box;width:100%;min-width:0;padding:7px 8px;border:1px solid #5a7083;border-radius:4px;background:#202e3b;color:#f2f7ff;font:inherit}
        .shadow-studio .ss-asset-library-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
        .shadow-studio .ss-asset-library-grid button{display:grid;justify-items:center;gap:5px;min-width:0;padding:5px 3px;border:1px solid #5b7082;border-radius:5px;background:#354554;color:#eff5fa;font-size:9px}
        .shadow-studio .ss-asset-library-grid img{width:100%;max-width:74px;aspect-ratio:1;object-fit:contain;background:white;border-radius:3px}
        .shadow-studio .ss-asset-library-grid span{text-align:center;overflow-wrap:anywhere}
        .shadow-studio .ss-asset-library button:disabled{opacity:.48;cursor:not-allowed}
        .shadow-studio .ss-asset-library [role=status]{min-height:13px;color:#c2d1df;font-size:10px}
      `}</style>
      <div className="ss-asset-library-tabs" role="group" aria-label={t[0]}>
        <button type="button" aria-pressed={section === 'assets'} onClick={() => { setSection('assets'); setQuery('') }}>{t[0]}</button>
        <button type="button" aria-pressed={section === 'brushes'} onClick={() => { setSection('brushes'); setQuery('') }}>{t[1]}</button>
      </div>
      {section === 'assets' ? <div className="ss-asset-library-categories" role="group" aria-label={t[0]}>{categories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setQuery('') }}>{item.label}</button>)}</div> : null}
      {section === 'assets' && category === 'classic'
        ? <StudioMangaAssets onInsert={onInsert} disabled={disabled || busy} />
        : <>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t[2]} aria-label={t[2]} />
          <div className="ss-asset-library-grid">{catalog.map((asset) => <button key={asset.id} type="button" disabled={disabled || busy || !onInsert} onClick={() => insert(asset)} title={asset.name}><img alt="" src={`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgFor(asset))}`} /><span>{asset.name}</span></button>)}</div>
          {!catalog.length ? <p>{t[8]}</p> : null}
        </>}
      <div role="status">{error || (busy ? t[9] : disabled || !onInsert ? t[11] : '')}</div>
    </section>
  )
}
