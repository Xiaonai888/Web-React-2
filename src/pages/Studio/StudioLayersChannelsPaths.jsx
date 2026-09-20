import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const WORDS = {
  en: ['Layers', 'Channels', 'Paths', 'Canvas bitmap', 'Current paper · one flattened canvas', 'Blend mode', 'Normal', 'Opacity', 'Independent layers are not enabled yet.', 'Composite', 'Red', 'Green', 'Blue', 'Read-only channel previews of the current canvas.', 'No vector paths on this canvas.', 'Vector paths are not enabled yet.', 'Preview is unavailable.'],
  km: ['ស្រទាប់', 'ឆានែល', 'គន្លង', 'រូបភាព Canvas', 'ក្រដាសបច្ចុប្បន្ន · Canvas តែមួយ', 'របៀបលាយ', 'ធម្មតា', 'ភាពស្រអាប់', 'មិនទាន់មានស្រទាប់ដាច់ដោយឡែកទេ។', 'រូបភាពសរុប', 'ក្រហម', 'បៃតង', 'ខៀវ', 'មើលឆានែលពណ៌របស់ Canvas បច្ចុប្បន្ន (មិនអាចកែបាន)។', 'មិនមាន Vector Path លើក្រដាសនេះទេ។', 'មុខងារ Vector Path មិនទាន់មានទេ។', 'មិនអាចបង្ហាញរូបមើលជាមុនបាន។'],
  zh: ['图层', '通道', '路径', '画布图像', '当前画布 · 单一位图', '混合模式', '正常', '不透明度', '独立图层尚未启用。', '合成', '红色', '绿色', '蓝色', '当前画布通道的只读预览。', '当前画布没有矢量路径。', '矢量路径尚未启用。', '无法显示预览。'],
  ja: ['レイヤー', 'チャンネル', 'パス', 'キャンバス画像', '現在の用紙 · 単一キャンバス', '描画モード', '通常', '不透明度', '独立レイヤーは未対応です。', '合成', '赤', '緑', '青', '現在のキャンバスのチャンネルを読み取り専用で表示します。', 'このキャンバスにはベクターパスがありません。', 'ベクターパスは未対応です。', 'プレビューを表示できません。'],
  ko: ['레이어', '채널', '패스', '캔버스 이미지', '현재 캔버스 · 단일 이미지', '혼합 모드', '보통', '불투명도', '독립 레이어는 아직 지원되지 않습니다.', '합성', '빨강', '초록', '파랑', '현재 캔버스 채널의 읽기 전용 미리보기입니다.', '이 캔버스에는 벡터 패스가 없습니다.', '벡터 패스는 아직 지원되지 않습니다.', '미리보기를 표시할 수 없습니다.'],
}

const CHANNELS = ['rgb', 'red', 'green', 'blue']

export default function StudioLayersChannelsPaths({ canvasRef, paperId, revision = 0, paper }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const [active, setActive] = useState('layers')
  const [error, setError] = useState(false)
  const previewRefs = useRef({})

  useEffect(() => {
    if (active === 'paths') return
    const source = canvasRef?.current
    if (!source || !source.width || !source.height) return
    const width = Math.max(1, Math.min(140, Math.round(source.width * Math.min(140 / source.width, 96 / source.height))))
    const height = Math.max(1, Math.round(source.height * width / source.width))
    const keys = active === 'layers' ? ['layer'] : CHANNELS
    try {
      for (const key of keys) {
        const target = previewRefs.current[key]
        if (!target) continue
        target.width = width
        target.height = height
        const context = target.getContext('2d', { willReadFrequently: true })
        if (!context) continue
        context.clearRect(0, 0, width, height)
        context.drawImage(source, 0, 0, width, height)
        if (key !== 'layer' && key !== 'rgb') {
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

  return (
    <section className="ss-lcp" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-lcp{min-width:0;color:#e5edf6}
        .shadow-studio .ss-lcp-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px;margin:-10px -9px 10px;padding:5px 5px 0;border-bottom:1px solid #516071;background:#252f39}
        .shadow-studio .ss-lcp-tab{min-width:0;height:31px;border:0;border-bottom:2px solid transparent;border-radius:4px 4px 0 0;background:transparent;color:#acbbca;font:inherit;font-size:11px;cursor:pointer}
        .shadow-studio .ss-lcp-tab[aria-selected=true]{border-bottom-color:#82baff;background:#3b4c5e;color:white;font-weight:700}
        .shadow-studio .ss-lcp-tab:focus-visible{outline:2px solid #8ac4ff;outline-offset:-2px}
        .shadow-studio .ss-lcp-options{display:flex;align-items:center;gap:5px;min-width:0;margin:0 0 10px;font-size:10px;color:#c8d4e0}
        .shadow-studio .ss-lcp-options span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
        .shadow-studio .ss-lcp-options b{font-weight:500;margin-left:auto;white-space:nowrap}
        .shadow-studio .ss-lcp-layer,.shadow-studio .ss-lcp-channel{display:flex;align-items:center;gap:8px;min-width:0;padding:7px;border:1px solid #4d5e70;background:#303e4c;color:#eaf1f9}
        .shadow-studio .ss-lcp-layer{border-color:#6f9ccc;background:#3b536d}
        .shadow-studio .ss-lcp-channel+.ss-lcp-channel{border-top:0}
        .shadow-studio .ss-lcp-thumb{display:block;flex:0 0 41px;width:41px;max-height:42px;object-fit:contain;border:1px solid #7b8996;background:#fff}
        .shadow-studio .ss-lcp-item-name{min-width:0;display:grid;gap:4px}
        .shadow-studio .ss-lcp-item-name strong{font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .shadow-studio .ss-lcp-item-name small{font-size:9px;color:#b3c5d7;line-height:1.4}
        .shadow-studio .ss-lcp-hint{margin:10px 0 0;font-size:10px;line-height:1.5;color:#b2c3d2}
        .shadow-studio .ss-lcp-paths{padding:24px 7px;text-align:center;border:1px dashed #5c6a77;border-radius:5px;color:#bccbd8}
        .shadow-studio .ss-lcp-paths i{display:block;margin-bottom:10px;font-size:22px}
      `}</style>
      <div className="ss-lcp-tabs" role="tablist" aria-label={t[0]}>
        {['layers', 'channels', 'paths'].map((tab, index) => (
          <button key={tab} type="button" role="tab" className="ss-lcp-tab" aria-selected={active === tab} onClick={() => setActive(tab)}>{t[index]}</button>
        ))}
      </div>
      {active === 'layers' ? <>
        <div className="ss-lcp-options"><span>{t[5]}: {t[6]}</span><b>{t[7]} 100%</b></div>
        <div className="ss-lcp-layer">
          <i className="fa-regular fa-eye" aria-hidden="true" />
          <canvas className="ss-lcp-thumb" ref={(node) => { previewRefs.current.layer = node }} aria-label={t[3]} />
          <div className="ss-lcp-item-name"><strong>{t[3]}</strong><small>{paper?.name || t[4]}</small></div>
        </div>
        <p className="ss-lcp-hint">{t[8]}</p>
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
