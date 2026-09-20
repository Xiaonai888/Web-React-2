import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const WORDS = {
  en: ['Layers', 'Channels', 'Paths', 'Canvas bitmap', 'Current paper · one flattened canvas', 'Blend mode', 'Normal', 'Opacity', 'Independent layers are not enabled yet.', 'Composite', 'Red', 'Green', 'Blue', 'Read-only channel previews of the current canvas.', 'No vector paths on this canvas.', 'Vector paths are not enabled yet.', 'Preview is unavailable.'],
  km: ['ស្រទាប់', 'ឆានែល', 'គន្លង', 'រូបភាព Canvas', 'ក្រដាសបច្ចុប្បន្ន · Canvas តែមួយ', 'របៀបលាយ', 'ធម្មតា', 'ភាពស្រអាប់', 'មិនទាន់មានស្រទាប់ដាច់ដោយឡែកទេ។', 'រូបភាពសរុប', 'ក្រហម', 'បៃតង', 'ខៀវ', 'មើលឆានែលពណ៌របស់ Canvas បច្ចុប្បន្ន (មិនអាចកែបាន)។', 'មិនមាន Vector Path លើក្រដាសនេះទេ។', 'មុខងារ Vector Path មិនទាន់មានទេ។', 'មិនអាចបង្ហាញរូបមើលជាមុនបាន។'],
  zh: ['图层', '通道', '路径', '画布图像', '当前画布 · 单一位图', '混合模式', '正常', '不透明度', '独立图层尚未启用。', '合成', '红色', '绿色', '蓝色', '当前画布通道的只读预览。', '此画布没有矢量路径。', '矢量路径尚未启用。', '预览不可用。'],
  ja: ['レイヤー', 'チャンネル', 'パス', 'キャンバス画像', '現在の用紙 · 単一キャンバス', '描画モード', '通常', '不透明度', '独立レイヤーは未対応です。', '合成', '赤', '緑', '青', '現在のキャンバスのチャンネルを読み取り専用で表示します。', 'このキャンバスにはベクターパスがありません。', 'ベクターパスは未対応です。', 'プレビューを表示できません。'],
  ko: ['레이어', '채널', '패스', '캔버스 이미지', '현재 캔버스 · 단일 이미지', '혼합 모드', '보통', '불투명도', '독립 레이어는 아직 지원되지 않습니다.', '합성', '빨강', '초록', '파랑', '현재 캔버스 채널의 읽기 전용 미리보기입니다.', '현재 캔버스에는 벡터 경로가 없습니다.', '벡터 경로는 아직 지원되지 않습니다.', '미리보기를 표시할 수 없습니다.'],
}

const ACTIONS = {
  en: ['Add layer', 'Select', 'Show layer', 'Hide layer', 'Lock layer', 'Unlock layer', 'Move up', 'Move down', 'Rename layer', 'Delete layer', 'Maximum 8 layers', 'Background cannot be deleted', 'Layer name', 'No layers available'],
  km: ['បន្ថែមស្រទាប់', 'ជ្រើស', 'បង្ហាញស្រទាប់', 'លាក់ស្រទាប់', 'ចាក់សោស្រទាប់', 'ដោះសោស្រទាប់', 'ឡើងលើ', 'ចុះក្រោម', 'ប្ដូរឈ្មោះស្រទាប់', 'លុបស្រទាប់', 'អតិបរមា ៨ ស្រទាប់', 'មិនអាចលុប Background បាន', 'ឈ្មោះស្រទាប់', 'មិនទាន់មានស្រទាប់'],
  zh: ['新建图层', '选择', '显示图层', '隐藏图层', '锁定图层', '解锁图层', '上移', '下移', '重命名图层', '删除图层', '最多 8 个图层', '背景不可删除', '图层名称', '暂无图层'],
  ja: ['レイヤーを追加', '選択', '表示', '非表示', 'ロック', 'ロック解除', '上へ', '下へ', '名前を変更', '削除', '最大 8 レイヤー', '背景は削除できません', 'レイヤー名', 'レイヤーなし'],
  ko: ['레이어 추가', '선택', '레이어 표시', '레이어 숨기기', '잠금', '잠금 해제', '위로', '아래로', '이름 바꾸기', '삭제', '최대 8개 레이어', '배경은 삭제할 수 없습니다', '레이어 이름', '레이어 없음'],
}

const CHANNELS = ['rgb', 'red', 'green', 'blue']

export default function StudioLayersChannelsPaths({ canvasRef, paperId, revision = 0, paper, layers = [], activeLayerId = '', onLayerAction, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const a = ACTIONS[language] || ACTIONS.en
  const [active, setActive] = useState('layers')
  const [error, setError] = useState(false)
  const previewRefs = useRef({})
  const layerRefs = useRef({})
  const selected = layers.find((layer) => layer.id === activeLayerId)
  const blocked = disabled || !onLayerAction || !paperId || !layers.length

  useEffect(() => {
    if (active !== 'layers') return
    for (const layer of layers) {
      const target = layerRefs.current[layer.id]
      if (!target || !layer.canvas) continue
      const width = Math.max(1, Math.round(layer.canvas.width * Math.min(70 / layer.canvas.width, 54 / layer.canvas.height)))
      target.width = width
      target.height = Math.max(1, Math.round(layer.canvas.height * width / layer.canvas.width))
      const context = target.getContext('2d')
      context?.clearRect(0, 0, target.width, target.height)
      context?.drawImage(layer.canvas, 0, 0, target.width, target.height)
    }
  }, [active, layers, paperId, revision])

  useEffect(() => {
    if (active !== 'channels') return
    const source = canvasRef?.current
    if (!source || !source.width || !source.height) return
    const width = Math.max(1, Math.min(140, Math.round(source.width * Math.min(140 / source.width, 96 / source.height))))
    const height = Math.max(1, Math.round(source.height * width / source.width))
    try {
      for (const key of CHANNELS) {
        const target = previewRefs.current[key]
        if (!target) continue
        target.width = width
        target.height = height
        const context = target.getContext('2d', { willReadFrequently: true })
        if (!context) continue
        context.clearRect(0, 0, width, height)
        context.drawImage(source, 0, 0, width, height)
        if (key !== 'rgb') {
          const image = context.getImageData(0, 0, width, height)
          const channelIndex = { red: 0, green: 1, blue: 2 }[key]
          for (let index = 0; index < image.data.length; index += 4) {
            const level = image.data[index + channelIndex]
            image.data[index] = level
            image.data[index + 1] = level
            image.data[index + 2] = level
          }
          context.putImageData(image, 0, 0)
        }
      }
      setError(false)
    } catch {
      setError(true)
    }
  }, [active, canvasRef, paperId, revision])

  function rename(layer) {
    if (blocked) return
    const name = window.prompt(a[12], layer.name)
    if (name !== null && name.trim() && name.trim() !== layer.name) onLayerAction('rename', layer.id, name.trim())
  }

  return (
    <section className="ss-lcp" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-lcp{min-width:0;color:#e5edf6}
        .shadow-studio .ss-lcp-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px;margin:-10px -9px 10px;padding:5px 5px 0;border-bottom:1px solid #516071;background:#252f39}
        .shadow-studio .ss-lcp-tab{min-width:0;height:31px;border:0;border-bottom:2px solid transparent;border-radius:4px 4px 0 0;background:transparent;color:#acbbca;font:inherit;font-size:11px;cursor:pointer}
        .shadow-studio .ss-lcp-tab[aria-selected=true]{border-bottom-color:#82baff;background:#3b4c5e;color:white;font-weight:700}
        .shadow-studio .ss-lcp-tab:focus-visible{outline:2px solid #8ac4ff;outline-offset:-2px}
        .shadow-studio .ss-lcp-layer,.shadow-studio .ss-lcp-channel{display:flex;align-items:center;gap:5px;min-width:0;padding:6px 3px;border:1px solid #4d5e70;background:#303e4c;color:#eaf1f9}
        .shadow-studio .ss-lcp-layer[data-selected=true]{border-color:#8bbef4;background:#3b536d}
        .shadow-studio .ss-lcp-channel+.ss-lcp-channel{border-top:0}
        .shadow-studio .ss-lcp-thumb{display:block;flex:0 0 41px;width:41px;max-height:42px;object-fit:contain;border:1px solid #7b8996;background:#fff}
        .shadow-studio .ss-lcp-layer .ss-lcp-thumb{flex:0 0 auto;max-width:35px;max-height:37px}
        .shadow-studio .ss-lcp-pick{display:flex;align-items:center;gap:5px;min-width:0;flex:1;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}
        .shadow-studio .ss-lcp-item-name{min-width:0;display:grid;gap:3px}
        .shadow-studio .ss-lcp-item-name strong{font-size:10px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .shadow-studio .ss-lcp-item-name small{font-size:9px;color:#b3c5d7;line-height:1.4}
        .shadow-studio .ss-lcp-tools{display:flex;align-items:center;gap:3px;flex-wrap:wrap;margin:7px 0}
        .shadow-studio .ss-lcp-action{display:grid;place-items:center;flex:none;min-width:22px;height:25px;padding:0 3px;border:1px solid #5b6e80;border-radius:4px;background:#344658;color:#eaf1f9;font:inherit;font-size:10px;cursor:pointer}
        .shadow-studio .ss-lcp-action:hover:not(:disabled){background:#4b6580}
        .shadow-studio .ss-lcp-action:disabled,.shadow-studio .ss-lcp-pick:disabled{opacity:.45;cursor:not-allowed}
        .shadow-studio .ss-lcp-opacity{display:flex;align-items:center;gap:5px;font-size:10px;color:#c8d4e0}
        .shadow-studio .ss-lcp-opacity select{min-width:0;width:65px;height:27px;border:1px solid #5b6e80;border-radius:4px;background:#25313d;color:white;font:inherit;font-size:10px}
        .shadow-studio .ss-lcp-hint{margin:10px 0 0;font-size:10px;line-height:1.5;color:#b2c3d2}
        .shadow-studio .ss-lcp-paths{padding:24px 7px;text-align:center;border:1px dashed #5c6a77;border-radius:5px;color:#bccbd8}
        .shadow-studio .ss-lcp-paths i{display:block;margin-bottom:10px;font-size:22px}
        .shadow-studio .ss-lcp-list{display:grid;gap:4px;max-height:270px;overflow-y:auto;overscroll-behavior:contain}
      `}</style>
      <div className="ss-lcp-tabs" role="tablist" aria-label={t[0]}>
        {['layers', 'channels', 'paths'].map((tab, index) => (
          <button key={tab} type="button" role="tab" className="ss-lcp-tab" aria-selected={active === tab} onClick={() => setActive(tab)}>{t[index]}</button>
        ))}
      </div>
      {active === 'layers' ? <>
        <div className="ss-lcp-tools">
          <button className="ss-lcp-action" type="button" title={a[0]} aria-label={a[0]} disabled={blocked || layers.length >= 8} onClick={() => onLayerAction('add')}><i className="fa-solid fa-plus" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={a[6]} aria-label={a[6]} disabled={blocked || !selected || layers.indexOf(selected) === layers.length - 1} onClick={() => onLayerAction('move', activeLayerId, 1)}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={a[7]} aria-label={a[7]} disabled={blocked || !selected || layers.indexOf(selected) <= 1} onClick={() => onLayerAction('move', activeLayerId, -1)}><i className="fa-solid fa-arrow-down" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={a[8]} aria-label={a[8]} disabled={blocked || !selected} onClick={() => selected && rename(selected)}><i className="fa-solid fa-pen" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={a[9]} aria-label={a[9]} disabled={blocked || !selected || layers.indexOf(selected) === 0} onClick={() => onLayerAction('remove', activeLayerId)}><i className="fa-solid fa-trash" aria-hidden="true" /></button>
          <label className="ss-lcp-opacity">{t[7]}
            <select aria-label={t[7]} disabled={blocked || !selected} value={selected?.opacity ?? 100} onChange={(event) => onLayerAction('opacity', activeLayerId, Number(event.target.value))}>
              {[...new Set([0,10,20,30,40,50,60,70,80,90,100, selected?.opacity].filter((value) => value !== undefined))].sort((x,y) => x-y).map((value) => <option key={value} value={value}>{value}%</option>)}
            </select>
          </label>
        </div>
        <div className="ss-lcp-list">
          {[...layers].reverse().map((layer) => (
            <div className="ss-lcp-layer" data-selected={layer.id === activeLayerId} key={layer.id}>
              <button className="ss-lcp-action" type="button" aria-label={layer.visible ? a[3] : a[2]} title={layer.visible ? a[3] : a[2]} disabled={blocked} onClick={() => onLayerAction('visibility', layer.id)}><i className={`fa-regular ${layer.visible ? 'fa-eye' : 'fa-eye-slash'}`} aria-hidden="true" /></button>
              <button className="ss-lcp-pick" type="button" disabled={blocked} onClick={() => onLayerAction('select', layer.id)} aria-label={`${a[1]} ${layer.name}`}>
                <canvas className="ss-lcp-thumb" ref={(node) => { layerRefs.current[layer.id] = node }} aria-hidden="true" />
                <span className="ss-lcp-item-name"><strong>{layer.name}</strong><small>{layer.id === activeLayerId ? '● ' : ''}{layer.opacity}%</small></span>
              </button>
              <button className="ss-lcp-action" type="button" aria-label={layer.locked ? a[5] : a[4]} title={layer.locked ? a[5] : a[4]} disabled={blocked} onClick={() => onLayerAction('lock', layer.id)}><i className={`fa-solid ${layer.locked ? 'fa-lock' : 'fa-lock-open'}`} aria-hidden="true" /></button>
            </div>
          ))}
        </div>
        {!layers.length ? <p className="ss-lcp-hint">{a[13]}</p> : null}
      </> : null}
      {active === 'channels' ? <>
        {CHANNELS.map((channel, index) => (
          <div className="ss-lcp-channel" key={channel}>
            <i className="fa-regular fa-eye" aria-hidden="true" />
            <canvas className="ss-lcp-thumb" ref={(node) => { previewRefs.current[channel] = node }} aria-label={index === 0 ? 'RGB' : t[9 + index]} />
            <div className="ss-lcp-item-name"><strong>{index === 0 ? 'RGB' : t[9 + index]}</strong></div>
          </div>
        ))}
        <p className="ss-lcp-hint">{error ? t[16] : t[13]}</p>
      </> : null}
      {active === 'paths' ? <div className="ss-lcp-paths"><i className="fa-solid fa-bezier-curve" aria-hidden="true" /><strong>{t[14]}</strong><p className="ss-lcp-hint">{t[15]}</p></div> : null}
    </section>
  )
}
