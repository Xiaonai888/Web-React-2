import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { STUDIO_BLEND_MODES } from './StudioLayerBlendEngine'
import StudioAdjustmentLayerMenu from './StudioAdjustmentLayerMenu'
import StudioLayerFxMenu from './StudioLayerFxMenu'

const WORDS = {
  en: ['Layers', 'Channels', 'Paths', 'Canvas bitmap', 'Current paper · one flattened canvas', 'Blend mode', 'Normal', 'Opacity', 'Independent layers are not enabled yet.', 'Composite', 'Red', 'Green', 'Blue', 'Read-only channel previews of the current canvas.', 'No vector paths on this canvas.', 'Vector paths are not enabled yet.', 'Preview is unavailable.'],
  km: ['ស្រទាប់', 'ឆានែល', 'គន្លង', 'រូបភាព Canvas', 'ក្រដាសបច្ចុប្បន្ន · Canvas តែមួយ', 'របៀបលាយ', 'ធម្មតា', 'ភាពស្រអាប់', 'មិនទាន់មានស្រទាប់ដាច់ដោយឡែកទេ។', 'រូបភាពសរុប', 'ក្រហម', 'បៃតង', 'ខៀវ', 'មើលឆានែលពណ៌របស់ Canvas បច្ចុប្បន្ន (មិនអាចកែបាន)។', 'មិនមាន Vector Path លើក្រដាសនេះទេ។', 'មុខងារ Vector Path មិនទាន់មានទេ។', 'មិនអាចបង្ហាញរូបមើលជាមុនបាន។'],
  zh: ['图层', '通道', '路径', '画布图像', '当前画布 · 单一位图', '混合模式', '正常', '不透明度', '独立图层尚未启用。', '合成', '红色', '绿色', '蓝色', '当前画布通道的只读预览。', '此画布没有矢量路径。', '矢量路径尚未启用。', '预览不可用。'],
  ja: ['レイヤー', 'チャンネル', 'パス', 'キャンバス画像', '現在の用紙 · 単一キャンバス', '描画モード', '通常', '不透明度', '独立レイヤーは未対応です。', '合成', '赤', '緑', '青', '現在のキャンバスのチャンネルを読み取り専用で表示します。', 'このキャンバスにはベクターパスがありません。', 'ベクターパスは未対応です。', 'プレビューを表示できません。'],
  ko: ['레이어', '채널', '패스', '캔버스 이미지', '현재 캔버스 · 단일 이미지', '혼합 모드', '보통', '불투명도', '독립 레이어는 아직 지원되지 않습니다.', '합성', '빨강', '초록', '파랑', '현재 캔버스 채널의 읽기 전용 미리보기입니다.', '현재 캔버스에는 벡터 경로가 없습니다.', '벡터 경로는 아직 지원되지 않습니다.', '미리보기를 표시할 수 없습니다.'],
}

const ACTIONS = {
  en: ['Add layer', 'Select', 'Show layer', 'Hide layer', 'Lock layer', 'Unlock layer', 'Move up', 'Move down', 'Rename layer', 'Delete layer', 'Maximum 8 layers', 'Unlock a layer before deleting it', 'Layer name', 'No layers available'],
  km: ['បន្ថែមស្រទាប់', 'ជ្រើស', 'បង្ហាញស្រទាប់', 'លាក់ស្រទាប់', 'ចាក់សោស្រទាប់', 'ដោះសោស្រទាប់', 'ឡើងលើ', 'ចុះក្រោម', 'ប្ដូរឈ្មោះស្រទាប់', 'លុបស្រទាប់', 'អតិបរមា ៨ ស្រទាប់', 'ដោះសោ Layer មុនពេលលុប', 'ឈ្មោះស្រទាប់', 'មិនទាន់មានស្រទាប់'],
  zh: ['新建图层', '选择', '显示图层', '隐藏图层', '锁定图层', '解锁图层', '上移', '下移', '重命名图层', '删除图层', '最多 8 个图层', '解锁图层后可删除', '图层名称', '暂无图层'],
  ja: ['レイヤーを追加', '選択', '表示', '非表示', 'ロック', 'ロック解除', '上へ', '下へ', '名前を変更', '削除', '最大 8 レイヤー', 'ロックを解除すると削除できます', 'レイヤー名', 'レイヤーなし'],
  ko: ['레이어 추가', '선택', '레이어 표시', '레이어 숨기기', '잠금', '잠금 해제', '위로', '아래로', '이름 바꾸기', '삭제', '최대 8개 레이어', '잠금 해제 후 삭제할 수 있습니다', '레이어 이름', '레이어 없음'],
}

const CHANNELS = ['rgb', 'red', 'green', 'blue']

export default function StudioLayersChannelsPaths({ canvasRef, paperId, revision = 0, paper, layers = [], activeLayerId = '', groups = [], onLayerAction, disabled = false }) {
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const a = ACTIONS[language] || ACTIONS.en
  const [active, setActive] = useState('layers')
  const [layerSearch, setLayerSearch] = useState('')
  const [layerKind, setLayerKind] = useState('all')
  const [editing, setEditing] = useState(null)
  const [adjustmentMenu, setAdjustmentMenu] = useState(null)
  const [fxMenu, setFxMenu] = useState(null)
  const editingRef = useRef(null)
  const inputRef = useRef(null)
  const pendingGroupIds = useRef(null)
  const styleHoldRef = useRef(null)
  const suppressStyleClickRef = useRef(null)
  const editTextLabel = ({ en: 'Edit text', km: 'កែអក្សរ', zh: '编辑文字', ja: 'テキストを編集', ko: '텍스트 수정' })[language] || 'Edit text'
  const duplicateLabel = ({ en: 'Duplicate layer', km: 'ចម្លងស្រទាប់', zh: '复制图层', ja: 'レイヤーを複製', ko: '레이어 복제' })[language] || 'Duplicate layer' 
  const convertLabel = ({ en: 'Convert Background to normal layer', km: 'ប្ដូរ Background ទៅជា Layer ធម្មតា', zh: '将背景转换为普通图层', ja: '背景を通常レイヤーに変換', ko: '배경을 일반 레이어로 변환' })[language] || 'Convert Background to normal layer'
  const mergeLabel = ({ en: 'Merge layer down', km: 'បញ្ចូលស្រទាប់ចុះក្រោម', zh: '向下合并图层', ja: '下のレイヤーと結合', ko: '아래 레이어와 병합' })[language] || 'Merge layer down'
  const adjustmentLabel = ({ en: 'Create fill or adjustment layer', km: 'បង្កើត Fill ឬ Adjustment Layer', zh: '新建填充或调整图层', ja: '塗りつぶしまたは調整レイヤーを作成', ko: '칠 또는 조정 레이어 만들기' })[language] || 'Create fill or adjustment layer'
  const fxLabel = ({ en: 'Add layer style', km: 'បន្ថែម FX ទៅ Layer', zh: '添加图层样式', ja: 'レイヤースタイルを追加', ko: '레이어 스타일 추가' })[language] || 'Add layer style'
  const [error, setError] = useState(false)
  const previewRefs = useRef({})
  const layerRefs = useRef({})
  const selected = layers.find((layer) => layer.id === activeLayerId)
  const blocked = disabled || !onLayerAction || !paperId || !layers.length
  const selectedGroup = groups.find((group) => group.id === selected?.groupId)
  const selectedIndex = layers.indexOf(selected)
  const lower = selectedIndex > 0 ? layers[selectedIndex - 1] : null
  const canMerge = Boolean(selected && lower && selectedIndex > 0 &&
    selected.visible && lower.visible && !selected.locked && !lower.locked &&
    selected.opacity === 100 && lower.opacity === 100 &&
    (selected.blendMode || 'normal') === 'normal' && (lower.blendMode || 'normal') === 'normal' &&
    (selected.groupId || null) === (lower.groupId || null) && !selected.adjustment && !lower.adjustment &&
    ![selected, lower].some((layer) => layer.layerStyle && (layer.layerStyle.fillOpacity !== 100 ||
      ['r', 'g', 'b'].some((channel) => layer.layerStyle.channels?.[channel] === false) ||
      Object.values(layer.layerStyle.effects || {}).some((effect) => effect.enabled))) &&
    (!selected.groupId || groups.some((group) => group.id === selected.groupId && group.visible && !group.locked)))
  const adjacentGroups = selected && !selected.isBackground && !selected.groupId && selectedIndex >= 0
    ? groups.filter((group) => layers[selectedIndex - 1]?.groupId === group.id || layers[selectedIndex + 1]?.groupId === group.id)
    : []
  const reverseLayers = [...layers].reverse()
  const filteredLayers = reverseLayers.filter((layer) => {
    const query = layerSearch.trim().toLocaleLowerCase()
    const groupName = groups.find((group) => group.id === layer.groupId)?.name || ''
    const matchesName = !query || layer.name.toLocaleLowerCase().includes(query) || groupName.toLocaleLowerCase().includes(query)
    const matchesKind = layerKind === 'all' ||
      (layerKind === 'text' && Boolean(layer.textData)) ||
      (layerKind === 'background' && layer.isBackground) ||
      (layerKind === 'pixel' && !layer.isBackground && !layer.textData && !layer.adjustment)
    return matchesName && matchesKind
  })
  const layerFilterWords = ({
    en: ['Search layers', 'Kind', 'All layers', 'Pixel layers', 'Text layers', 'Background', 'More layer actions', 'No matching layers'],
    km: ['ស្វែងរក Layer', 'ប្រភេទ', 'Layer ទាំងអស់', 'Layer រូបភាព', 'Layer អក្សរ', 'Background', 'មុខងារ Layer បន្ថែម', 'រកមិនឃើញ Layer'],
    zh: ['搜索图层', '类型', '全部图层', '像素图层', '文字图层', '背景', '更多图层操作', '没有匹配的图层'],
    ja: ['レイヤーを検索', '種類', 'すべて', '画像レイヤー', 'テキストレイヤー', '背景', 'レイヤーの追加操作', '一致するレイヤーなし'],
    ko: ['레이어 검색', '유형', '모든 레이어', '픽셀 레이어', '텍스트 레이어', '배경', '추가 레이어 작업', '일치하는 레이어 없음'],
  })[language] || ['Search layers', 'Kind', 'All layers', 'Pixel layers', 'Text layers', 'Background', 'More layer actions', 'No matching layers']
  const groupTitle = ({ en: 'Group', km: 'ក្រុមស្រទាប់', zh: '图层组', ja: 'レイヤーグループ', ko: '레이어 그룹' })[language] || 'Group'
  const blendTitle = ({ en: 'Blend mode', km: 'របៀបលាយពណ៌', zh: '混合模式', ja: '描画モード', ko: '혼합 모드' })[language] || 'Blend mode'
  const groupControl = ({ en: ['New group', 'Join group', 'Ungroup', 'Rename group', 'Collapse', 'Expand'], km: ['បង្កើតក្រុម', 'ចូលក្រុម', 'ដោះក្រុម', 'ប្ដូរឈ្មោះក្រុម', 'បង្រួម', 'ពង្រីក'], zh: ['新建组', '加入组', '取消编组', '重命名组', '收起', '展开'], ja: ['グループ作成', 'グループに追加', 'グループ解除', 'グループ名変更', '折りたたむ', '展開'], ko: ['그룹 만들기', '그룹에 추가', '그룹 해제', '그룹 이름 변경', '접기', '펼치기'] })[language] || ['New group', 'Join group', 'Ungroup', 'Rename group', 'Collapse', 'Expand']

  function openLayerStyle(layer) {
    if (blocked || !layer) return
    editingRef.current = null
    setEditing(null)
    onLayerAction(layer.adjustment ? 'adjustment-open' : 'style-open', layer.id)
  }

  function cancelStyleHold(event) {
    const hold = styleHoldRef.current
    if (!hold || (event?.pointerId !== undefined && hold.pointerId !== event.pointerId)) return
    window.clearTimeout(hold.timer)
    styleHoldRef.current = null
  }

  function startStyleHold(event, layer) {
    if (event.pointerType !== 'touch' || blocked || !layer) return
    cancelStyleHold()
    const hold = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, timer: null }
    hold.timer = window.setTimeout(() => {
      if (styleHoldRef.current !== hold) return
      styleHoldRef.current = null
      suppressStyleClickRef.current = { id: layer.id, until: Date.now() + 1200 }
      openLayerStyle(layer)
    }, 550)
    styleHoldRef.current = hold
  }

  function moveStyleHold(event) {
    const hold = styleHoldRef.current
    if (!hold || hold.pointerId !== event.pointerId) return
    if (Math.hypot(event.clientX - hold.x, event.clientY - hold.y) > 12) cancelStyleHold(event)
  }

  function selectStyleLayer(event, layer) {
    const suppressed = suppressStyleClickRef.current
    suppressStyleClickRef.current = null
    if (suppressed?.id === layer.id && Date.now() < suppressed.until) {
      event.preventDefault()
      return
    }
    onLayerAction('select', layer.id)
  }

  useEffect(() => () => cancelStyleHold(), [])

  function beginRename(kind, item) {
    if (blocked || !item) return
    const next = { kind, id: item.id, name: item.name }
    editingRef.current = next
    setEditing(next)
  }

  function finishRename(save) {
    const current = editingRef.current
    if (!current) return
    editingRef.current = null
    setEditing(null)
    const value = current.name.trim().slice(0, 80)
    const item = current.kind === 'group' ? groups.find((group) => group.id === current.id) : layers.find((layer) => layer.id === current.id)
    if (save && !blocked && value && item && value !== item.name) {
      onLayerAction(current.kind === 'group' ? 'group-rename' : 'rename', current.id, value)
    }
  }

  function changeRename(value) {
    if (!editingRef.current) return
    const next = { ...editingRef.current, name: value }
    editingRef.current = next
    setEditing(next)
  }

  function renameInput(kind, item) {
    if (editing?.kind !== kind || editing.id !== item.id) return null
    return <input
      ref={inputRef}
      className="ss-lcp-rename-input"
      type="text"
      value={editing.name}
      maxLength={80}
      aria-label={kind === 'group' ? groupControl[3] : a[8]}
      onChange={(event) => changeRename(event.target.value)}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation()
        if (event.key === 'Enter') { event.preventDefault(); finishRename(true) }
        else if (event.key === 'Escape') { event.preventDefault(); finishRename(false) }
      }}
      onBlur={() => finishRename(true)}
    />
  }

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing?.id, editing?.kind])

  useEffect(() => {
    editingRef.current = null
    setEditing(null)
    pendingGroupIds.current = null
    setAdjustmentMenu(null)
    setFxMenu(null)
  }, [paperId])

  useEffect(() => {
    const previous = pendingGroupIds.current
    if (!previous) return
    pendingGroupIds.current = null
    const created = groups.find((group) => !previous.has(group.id))
    if (created) beginRename('group', created)
  }, [groups])

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

  return (
    <section className="ss-lcp" aria-label={t[0]}>
      <style>{`
        .shadow-studio .ss-lcp{
          --ss-lcp-bg:#29313a;
          --ss-lcp-bg-2:#202832;
          --ss-lcp-bg-3:#313b46;
          --ss-lcp-line:#4b5968;
          --ss-lcp-line-soft:#3b4651;
          --ss-lcp-text:#edf3fa;
          --ss-lcp-muted:#aab8c6;
          --ss-lcp-blue:#5faeff;
          --ss-lcp-blue-soft:#355d84;
          min-width:0;
          color:var(--ss-lcp-text);
          background:var(--ss-lcp-bg);
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }
        .shadow-studio .ss-lcp-tabs{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:3px;
          margin:0;
          padding:6px 6px 0;
          border-bottom:1px solid var(--ss-lcp-line-soft);
          background:linear-gradient(180deg,#27313b,#202832)
        }
        .shadow-studio .ss-lcp-tab{
          min-width:0;
          height:34px;
          border:1px solid transparent;
          border-bottom:2px solid transparent;
          border-radius:6px 6px 0 0;
          background:transparent;
          color:#aebdca;
          font:750 9px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer;
          transition:border-color 120ms ease,background 120ms ease,color 120ms ease
        }
        .shadow-studio .ss-lcp-tab:hover{
          border-color:#506171;
          background:#33414f;
          color:#fff
        }
        .shadow-studio .ss-lcp-tab[aria-selected=true]{
          border-color:#506171;
          border-bottom-color:#75baff;
          background:#34495d;
          color:#fff;
          box-shadow:inset 0 -1px 0 #5faeff
        }
        .shadow-studio .ss-lcp-tab:focus-visible{
          outline:2px solid var(--ss-lcp-blue);
          outline-offset:-2px
        }
        .shadow-studio .ss-lcp-layers-layout{
          display:flex;
          flex-direction:column;
          min-width:0;
          min-height:230px;
          height:min(58vh,510px);
          max-height:calc(100dvh - 160px);
          background:var(--ss-lcp-bg)
        }
        .shadow-studio .ss-lcp-filter-bar{
          display:flex;
          align-items:center;
          gap:6px;
          min-width:0;
          padding:7px 7px 6px;
          border-bottom:1px solid var(--ss-lcp-line-soft);
          background:#27313a
        }
        .shadow-studio .ss-lcp-search{
          display:flex;
          align-items:center;
          gap:6px;
          flex:1;
          min-width:0;
          height:30px;
          padding:0 8px;
          border:1px solid var(--ss-lcp-line);
          border-radius:6px;
          background:var(--ss-lcp-bg-2);
          color:#91a4b6;
          font-size:9px;
          transition:border-color 120ms ease,box-shadow 120ms ease
        }
        .shadow-studio .ss-lcp-search:focus-within{
          border-color:var(--ss-lcp-blue);
          box-shadow:0 0 0 2px #5faeff24
        }
        .shadow-studio .ss-lcp-search input{
          flex:1;
          min-width:0;
          width:100%;
          height:100%;
          padding:0;
          border:0;
          outline:0;
          background:transparent;
          color:#f1f6fb;
          font:650 10px Inter,ui-sans-serif,system-ui,sans-serif
        }
        .shadow-studio .ss-lcp-search input::placeholder{color:#7f91a2}
        .shadow-studio .ss-lcp-kind{
          flex:0 1 105px;
          min-width:68px;
          max-width:105px;
          height:30px;
          padding:0 7px;
          border:1px solid var(--ss-lcp-line);
          border-radius:6px;
          outline:none;
          background:var(--ss-lcp-bg-2);
          color:#e6eef6;
          font:700 9px Inter,ui-sans-serif,system-ui,sans-serif
        }
        .shadow-studio .ss-lcp-kind:focus{
          border-color:var(--ss-lcp-blue);
          box-shadow:0 0 0 2px #5faeff24
        }
        .shadow-studio .ss-lcp-settings{
          display:flex;
          align-items:center;
          gap:8px;
          min-width:0;
          flex-wrap:wrap;
          padding:7px;
          border-bottom:1px solid var(--ss-lcp-line-soft);
          background:#2a333d
        }
        .shadow-studio .ss-lcp-blend,
        .shadow-studio .ss-lcp-opacity{
          display:flex;
          align-items:center;
          gap:5px;
          color:#bcc9d5;
          font-size:9px;
          font-weight:700
        }
        .shadow-studio .ss-lcp-settings .ss-lcp-blend{flex:1;min-width:110px}
        .shadow-studio .ss-lcp-settings .ss-lcp-blend select{flex:1;max-width:none;min-width:0}
        .shadow-studio .ss-lcp-settings .ss-lcp-opacity{flex:0 0 auto}
        .shadow-studio .ss-lcp-settings .ss-lcp-opacity select{width:64px}
        .shadow-studio .ss-lcp-blend select,
        .shadow-studio .ss-lcp-opacity select,
        .shadow-studio .ss-lcp-group-settings select,
        .shadow-studio .ss-lcp-group-settings button{
          min-width:0;
          height:28px;
          border:1px solid var(--ss-lcp-line);
          border-radius:5px;
          outline:none;
          background:var(--ss-lcp-bg-2);
          color:#e8f0f7;
          font:700 9px Inter,ui-sans-serif,system-ui,sans-serif
        }
        .shadow-studio .ss-lcp-blend select:focus,
        .shadow-studio .ss-lcp-opacity select:focus,
        .shadow-studio .ss-lcp-group-settings select:focus{
          border-color:var(--ss-lcp-blue);
          box-shadow:0 0 0 2px #5faeff24
        }
        .shadow-studio .ss-lcp-list{
          display:grid;
          flex:1;
          min-height:95px;
          max-height:none;
          gap:0;
          grid-auto-rows:min-content;
          align-content:start;
          overflow:auto;
          background:var(--ss-lcp-bg);
          overscroll-behavior:contain;
          scrollbar-width:thin;
          scrollbar-color:#586b7e #252d35
        }
        .shadow-studio .ss-lcp-layer,
        .shadow-studio .ss-lcp-channel{
          display:flex;
          align-items:center;
          gap:6px;
          min-width:0;
          min-height:42px;
          padding:4px 7px;
          border:0;
          border-bottom:1px solid var(--ss-lcp-line-soft);
          background:transparent;
          color:#eaf1f8;
          transition:background 120ms ease,border-color 120ms ease
        }
        .shadow-studio .ss-lcp-layer:hover{background:#303b46}
        .shadow-studio .ss-lcp-layer[data-selected=true]{
          border-bottom-color:#557b9d;
          background:#344d63;
          box-shadow:inset 3px 0 0 var(--ss-lcp-blue)
        }
        .shadow-studio .ss-lcp-channel+.ss-lcp-channel{border-top:0}
        .shadow-studio .ss-lcp-thumb{
          display:block;
          flex:0 0 41px;
          width:41px;
          max-height:42px;
          object-fit:contain;
          border:1px solid #607080;
          border-radius:4px;
          background:#fff;
          box-shadow:0 1px 4px #0005
        }
        .shadow-studio .ss-lcp-layer .ss-lcp-thumb{
          flex:0 0 auto;
          max-width:35px;
          max-height:37px
        }
        .shadow-studio .ss-lcp-adjustment-thumb{
          width:29px;
          height:29px;
          display:grid;
          place-items:center;
          border:1px solid #111820;
          border-radius:50%;
          background:linear-gradient(90deg,#12171d 0 50%,#f4f6f8 50%);
          color:transparent;
          box-shadow:inset 0 0 0 1px #7a8794,0 1px 4px #0005
        }
        .shadow-studio .ss-lcp-pick{
          display:flex;
          align-items:center;
          gap:5px;
          min-width:0;
          flex:0 0 35px;
          padding:0;
          border:0;
          background:transparent;
          color:inherit;
          text-align:left;
          cursor:pointer
        }
        .shadow-studio .ss-lcp-pick:disabled{opacity:.45;cursor:not-allowed}
        .shadow-studio .ss-lcp-item-name{
          min-width:0;
          flex:1;
          display:grid;
          gap:2px
        }
        .shadow-studio .ss-lcp-item-name strong{
          overflow:hidden;
          color:#edf3f9;
          font-size:10px;
          font-weight:650;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .shadow-studio .ss-lcp-layer[data-selected=true] .ss-lcp-item-name strong{font-weight:800}
        .shadow-studio .ss-lcp-item-name small{
          color:#9fb0c0;
          font-size:8px;
          line-height:1.35
        }
        .shadow-studio .ss-lcp-name-trigger{
          display:block;
          width:100%;
          min-width:0;
          padding:1px 0;
          border:0;
          background:transparent;
          color:inherit;
          text-align:left;
          font:inherit;
          cursor:text
        }
        .shadow-studio .ss-lcp-rename-input{
          box-sizing:border-box;
          display:block;
          width:100%;
          min-width:0;
          height:29px;
          padding:3px 6px;
          border:1px solid var(--ss-lcp-blue);
          border-radius:5px;
          background:#152638;
          color:#fff;
          font:650 10px Inter,ui-sans-serif,system-ui,sans-serif;
          outline:2px solid #5ca9f426;
          outline-offset:0
        }
        .shadow-studio .ss-lcp-action{
          display:grid;
          place-items:center;
          flex:none;
          min-width:27px;
          height:28px;
          padding:0 4px;
          border:1px solid transparent;
          border-radius:5px;
          background:transparent;
          color:#cbd7e2;
          font:inherit;
          font-size:10px;
          cursor:pointer;
          transition:border-color 120ms ease,background 120ms ease,color 120ms ease
        }
        .shadow-studio .ss-lcp-action:hover:not(:disabled){
          border-color:#60758a;
          background:#3b4b5a;
          color:#fff
        }
        .shadow-studio .ss-lcp-action:focus-visible{
          outline:2px solid var(--ss-lcp-blue);
          outline-offset:1px
        }
        .shadow-studio .ss-lcp-action:disabled{opacity:.35;cursor:not-allowed}
        .shadow-studio .ss-lcp-group{
          display:grid;
          gap:5px;
          margin:1px 0;
          padding:5px 6px;
          border:0;
          border-bottom:1px solid var(--ss-lcp-line);
          border-radius:0;
          background:#303b46
        }
        .shadow-studio .ss-lcp-group-head{
          display:flex;
          align-items:center;
          gap:4px
        }
        .shadow-studio .ss-lcp-group-name.ss-lcp-name-trigger{
          flex:1;
          overflow:hidden;
          color:#e6eef6;
          font-size:10px;
          font-weight:800;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .shadow-studio .ss-lcp-group-head>.ss-lcp-rename-input{flex:1}
        .shadow-studio .ss-lcp-group-settings{
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          gap:5px;
          padding-left:31px
        }
        .shadow-studio .ss-lcp-group-settings select{max-width:105px}
        .shadow-studio .ss-lcp-group-settings button{padding:0 7px;cursor:pointer}
        .shadow-studio .ss-lcp-group-settings button:hover:not(:disabled){background:#3c4c5c}
        .shadow-studio .ss-lcp-layer[data-grouped=true]{
          margin-left:10px;
          border-left:2px solid #6e93b4
        }
        .shadow-studio .ss-lcp-tools{
          display:flex;
          align-items:center;
          gap:4px;
          flex-wrap:wrap;
          margin:0;
          padding:6px 7px
        }
        .shadow-studio .ss-lcp-more{
          flex:none;
          border-top:1px solid var(--ss-lcp-line-soft);
          background:#27313a
        }
        .shadow-studio .ss-lcp-more summary{
          padding:7px 9px;
          color:#b8c7d5;
          font-size:9px;
          font-weight:750;
          cursor:pointer
        }
        .shadow-studio .ss-lcp-more[open] summary{color:#e5eef7}
        .shadow-studio .ss-lcp-more .ss-lcp-tools{
          max-height:120px;
          overflow-y:auto;
          border-top:1px solid var(--ss-lcp-line-soft)
        }
        .shadow-studio .ss-lcp-footer{
          display:flex;
          align-items:center;
          justify-content:space-around;
          gap:5px;
          flex:none;
          min-height:38px;
          padding:4px 6px;
          border-top:1px solid var(--ss-lcp-line);
          background:linear-gradient(180deg,#2f3944,#27313a)
        }
        .shadow-studio .ss-lcp-footer .ss-lcp-action{
          flex:1;
          max-width:55px;
          min-height:29px;
          border-color:#445363;
          background:#2d3843
        }
        .shadow-studio .ss-lcp-footer .ss-lcp-action:hover:not(:disabled){
          border-color:#6e879d;
          background:#3d5062
        }
        .shadow-studio .ss-lcp-group-add-label{display:none}
        .shadow-studio .ss-lcp-hint{
          margin:0;
          padding:7px 8px;
          color:#a8b8c6;
          font-size:9px;
          line-height:1.5
        }
        .shadow-studio .ss-lcp-channel{
          min-height:52px;
          padding:6px 8px;
          background:#29313a
        }
        .shadow-studio .ss-lcp-channel:hover{background:#303b46}
        .shadow-studio .ss-lcp-paths{
          margin:10px;
          padding:26px 10px;
          border:1px dashed #586a7b;
          border-radius:8px;
          background:#222b33;
          color:#aebfce;
          text-align:center
        }
        .shadow-studio .ss-lcp-paths i{
          display:block;
          margin-bottom:10px;
          color:#89a8c2;
          font-size:24px
        }
        .shadow-studio .ss-lcp-paths strong{
          color:#dde7f0;
          font-size:10px
        }
        @media(pointer:coarse){
          .shadow-studio .ss-lcp-action{min-height:36px;min-width:32px}
          .shadow-studio .ss-lcp-name-trigger{min-height:36px;display:flex;align-items:center}
          .shadow-studio .ss-lcp-group-add-label{display:inline}
          .shadow-studio .ss-lcp-group-add{display:flex;align-items:center;gap:5px;padding:0 7px}
          .shadow-studio .ss-lcp-layers-layout{height:min(56dvh,510px);max-height:calc(100dvh - 120px)}
          .shadow-studio .ss-lcp-footer .ss-lcp-action{min-height:36px}
          .shadow-studio .ss-lcp-more summary{padding:9px}
          .shadow-studio .ss-lcp-list{max-height:none}
        }
      `}</style>
      <div className="ss-lcp-tabs" role="tablist" aria-label={t[0]}>
        {['layers', 'channels', 'paths'].map((tab, index) => (
          <button key={tab} type="button" role="tab" className="ss-lcp-tab" aria-selected={active === tab} onClick={() => setActive(tab)}>{t[index]}</button>
        ))}
      </div>
      {active === 'layers' ? <>
        <div className="ss-lcp-layers-layout">
        <div className="ss-lcp-filter-bar">
          <label className="ss-lcp-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input type="search" value={layerSearch} onChange={(event) => setLayerSearch(event.target.value)} placeholder={layerFilterWords[0]} aria-label={layerFilterWords[0]} />
          </label>
          <select className="ss-lcp-kind" aria-label={layerFilterWords[1]} value={layerKind} onChange={(event) => setLayerKind(event.target.value)}>
            <option value="all">{layerFilterWords[2]}</option>
            <option value="pixel">{layerFilterWords[3]}</option>
            <option value="text">{layerFilterWords[4]}</option>
            <option value="background">{layerFilterWords[5]}</option>
          </select>
        </div>
        <div className="ss-lcp-settings">
          <label className="ss-lcp-blend">{blendTitle}
            <select aria-label={blendTitle} disabled={blocked || !selected || selected.isBackground} value={selected?.blendMode || 'normal'} onChange={(event) => onLayerAction('blend', activeLayerId, event.target.value)}>
              {STUDIO_BLEND_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </label>
          <label className="ss-lcp-opacity">{t[7]}
            <select aria-label={t[7]} disabled={blocked || !selected} value={selected?.opacity ?? 100} onChange={(event) => onLayerAction('opacity', activeLayerId, Number(event.target.value))}>
              {[...new Set([0,10,20,30,40,50,60,70,80,90,100, selected?.opacity].filter((value) => value !== undefined))].sort((x,y) => x-y).map((value) => <option key={value} value={value}>{value}%</option>)}
            </select>
          </label>
        </div>
        <div className="ss-lcp-list">
          {filteredLayers.map((layer, index) => {
            const group = groups.find((item) => item.id === layer.groupId)
            const firstOfGroup = group && (index === 0 || filteredLayers[index - 1].groupId !== group.id)
            return <div key={layer.id}>
              {firstOfGroup ? <div className="ss-lcp-group" aria-label={`${groupTitle}: ${group.name}`}>
                <div className="ss-lcp-group-head">
                  <button className="ss-lcp-action" type="button" title={group.collapsed ? groupControl[5] : groupControl[4]} disabled={blocked} onClick={() => onLayerAction('group-collapse', group.id)}>{group.collapsed ? '▸' : '▾'}</button>
                  <button className="ss-lcp-action" type="button" title={group.visible ? a[3] : a[2]} disabled={blocked} onClick={() => onLayerAction('group-visibility', group.id)}><i className={`fa-regular ${group.visible ? 'fa-eye' : 'fa-eye-slash'}`} aria-hidden="true" /></button>
                  {editing?.kind === 'group' && editing.id === group.id ? renameInput('group', group) : <button className="ss-lcp-group-name ss-lcp-name-trigger" type="button" disabled={blocked} title={`${groupControl[3]}: ${group.name}`} aria-label={`${groupControl[3]}: ${group.name}`} onClick={() => beginRename('group', group)}>{group.name}</button>}
                  <button className="ss-lcp-action" type="button" title={groupControl[3]} disabled={blocked} onClick={() => beginRename('group', group)}><i className="fa-solid fa-pen" aria-hidden="true" /></button>
                  <button className="ss-lcp-action" type="button" title={group.locked ? a[5] : a[4]} disabled={blocked} onClick={() => onLayerAction('group-lock', group.id)}><i className={`fa-solid ${group.locked ? 'fa-lock' : 'fa-lock-open'}`} aria-hidden="true" /></button>
                </div>
                <div className="ss-lcp-group-settings">
                  <label className="ss-lcp-blend">{blendTitle}<select aria-label={`${group.name}: ${blendTitle}`} disabled={blocked} value={group.blendMode || 'normal'} onChange={(event) => onLayerAction('group-blend', group.id, event.target.value)}>{STUDIO_BLEND_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}</select></label>
                  <label className="ss-lcp-blend">{t[7]}<select aria-label={`${group.name}: ${t[7]}`} disabled={blocked} value={group.opacity ?? 100} onChange={(event) => onLayerAction('group-opacity', group.id, Number(event.target.value))}>{[...new Set([0,10,20,30,40,50,60,70,80,90,100,group.opacity].filter((value) => value !== undefined))].sort((x,y) => x-y).map((value) => <option key={value} value={value}>{value}%</option>)}</select></label>
                  <button type="button" title={groupControl[2]} disabled={blocked} onClick={() => onLayerAction('group-remove', group.id)}>{groupControl[2]}</button>
                </div>
              </div> : null}
              {!group?.collapsed ? <div className="ss-lcp-layer" data-ss-layer-id={layer.id} data-grouped={Boolean(group)} data-selected={layer.id === activeLayerId}>
              <button className="ss-lcp-action" type="button" aria-label={layer.visible ? a[3] : a[2]} title={layer.visible ? a[3] : a[2]} disabled={blocked} onClick={() => onLayerAction('visibility', layer.id)}><i className={`fa-regular ${layer.visible ? 'fa-eye' : 'fa-eye-slash'}`} aria-hidden="true" /></button>
              <button className="ss-lcp-pick" type="button" disabled={blocked} onDoubleClick={(event) => { event.preventDefault(); openLayerStyle(layer) }} onClick={(event) => selectStyleLayer(event, layer)} onPointerDown={(event) => startStyleHold(event, layer)} onPointerMove={moveStyleHold} onPointerUp={cancelStyleHold} onPointerCancel={cancelStyleHold} onPointerLeave={cancelStyleHold} onContextMenu={(event) => { if (event.currentTarget.matches(':active')) event.preventDefault() }} aria-label={`${a[1]} ${layer.name}`} title={layer.textData ? editTextLabel : a[1]}>
                {layer.adjustment ? <span className="ss-lcp-adjustment-thumb" aria-hidden="true" /> : <canvas className="ss-lcp-thumb" ref={(node) => { layerRefs.current[layer.id] = node }} aria-hidden="true" />}
              </button>
              <span className="ss-lcp-item-name">
                {editing?.kind === 'layer' && editing.id === layer.id ? renameInput('layer', layer) : <button className="ss-lcp-name-trigger" type="button" disabled={blocked} title={`${layer.name} · ${layer.adjustment ? 'Adjustment Layer' : 'Layer Style'}: double-click or long-press`} aria-label={`${a[1]} ${layer.name}`} onClick={(event) => selectStyleLayer(event, layer)} onDoubleClick={(event) => { event.preventDefault(); openLayerStyle(layer) }} onPointerDown={(event) => startStyleHold(event, layer)} onPointerMove={moveStyleHold} onPointerUp={cancelStyleHold} onPointerCancel={cancelStyleHold} onPointerLeave={cancelStyleHold} onContextMenu={(event) => { if (event.currentTarget.matches(':active')) event.preventDefault() }}><strong>{layer.adjustment ? '◐ · ' : layer.textData ? 'T · ' : ''}{layer.name}</strong></button>}
                <small>{layer.id === activeLayerId ? '● ' : ''}{layer.opacity}%</small>
              </span>
              <button className="ss-lcp-action" type="button" aria-label={layer.locked ? a[5] : a[4]} title={layer.locked ? a[5] : a[4]} disabled={blocked} onClick={() => onLayerAction('lock', layer.id)}><i className={`fa-solid ${layer.locked ? 'fa-lock' : 'fa-lock-open'}`} aria-hidden="true" /></button>
              </div> : null}
            </div>
          })}
        </div>
        {!layers.length ? <p className="ss-lcp-hint">{a[13]}</p> : null}
        {layers.length > 0 && !filteredLayers.length ? <p className="ss-lcp-hint">{layerFilterWords[7]}</p> : null}
        <details className="ss-lcp-more">
          <summary>{layerFilterWords[6]}</summary>
          <div className="ss-lcp-tools">
          <button className="ss-lcp-action" type="button" title={a[6]} aria-label={a[6]} disabled={blocked || !selected || selected.isBackground || layers.indexOf(selected) === layers.length - 1} onClick={() => onLayerAction('move', activeLayerId, 1)}><i className="fa-solid fa-arrow-up" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={a[7]} aria-label={a[7]} disabled={blocked || !selected || selected.isBackground || layers.indexOf(selected) <= 0 || lower?.isBackground} onClick={() => onLayerAction('move', activeLayerId, -1)}><i className="fa-solid fa-arrow-down" aria-hidden="true" /></button>
          {selected?.textData ? <button className="ss-lcp-action" type="button" title={editTextLabel} aria-label={editTextLabel} disabled={blocked || selected.locked || !selected.visible || Boolean(selectedGroup && (!selectedGroup.visible || selectedGroup.locked))} onClick={() => onLayerAction('edit-text', activeLayerId)}><i className="fa-solid fa-font" aria-hidden="true" /></button> : null}
          <button className="ss-lcp-action" type="button" title={a[8]} aria-label={a[8]} disabled={blocked || !selected} onClick={() => beginRename('layer', selected)}><i className="fa-solid fa-pen" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={mergeLabel} aria-label={mergeLabel} disabled={blocked || !canMerge} onClick={() => onLayerAction('merge-down', activeLayerId)}><i className="fa-solid fa-layer-group" aria-hidden="true" /></button>
          {selected?.isBackground ? <button className="ss-lcp-action" type="button" title={convertLabel} aria-label={convertLabel} disabled={blocked} onClick={() => onLayerAction('convert-background', activeLayerId)}><i className="fa-solid fa-unlock-keyhole" aria-hidden="true" /></button> : null}
          {adjacentGroups.length ? <label className="ss-lcp-blend">{groupControl[1]}
            <select aria-label={groupControl[1]} disabled={blocked} value="" onChange={(event) => event.target.value && onLayerAction('group-join', activeLayerId, event.target.value)}>
              <option value="">—</option>
              {adjacentGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
          </label> : null}
          </div>
        </details>
        <div className="ss-lcp-footer">
          <button className="ss-lcp-action" type="button" title={a[0]} aria-label={a[0]} disabled={blocked || layers.length >= 8} onClick={() => onLayerAction('add')}><i className="fa-solid fa-plus" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={adjustmentLabel} aria-label={adjustmentLabel} disabled={blocked || layers.length >= 8} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setFxMenu(null); setAdjustmentMenu((current) => current ? null : { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }) }}><i className="fa-solid fa-circle-half-stroke" aria-hidden="true" /></button>
          <button className="ss-lcp-action" type="button" title={fxLabel} aria-label={fxLabel} disabled={blocked || !selected || Boolean(selected.adjustment)} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setAdjustmentMenu(null); setFxMenu((current) => current ? null : { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }) }}><span aria-hidden="true" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 12 }}>fx</span></button>
          <button className="ss-lcp-action" type="button" title={duplicateLabel} aria-label={duplicateLabel} disabled={blocked || !selected || selected.isBackground || layers.length >= 8} onClick={() => onLayerAction('duplicate', activeLayerId)}><i className="fa-regular fa-copy" aria-hidden="true" /></button>
          <button className="ss-lcp-action ss-lcp-group-add" type="button" title={groupControl[0]} aria-label={groupControl[0]} disabled={blocked || !selected || selected.isBackground || Boolean(selected?.adjustment) || Boolean(selectedGroup) || groups.length >= 8} onClick={() => { pendingGroupIds.current = new Set(groups.map((item) => item.id)); onLayerAction('group-add', activeLayerId) }}><i className="fa-solid fa-folder-plus" aria-hidden="true" /><span className="ss-lcp-group-add-label">{groupControl[0]}</span></button>
          <button className="ss-lcp-action" type="button" title={`${a[9]} · Delete / Backspace`} aria-label={a[9]} disabled={blocked || !selected || selected.locked || Boolean(selectedGroup?.locked)} onClick={() => onLayerAction('remove', activeLayerId)}><i className="fa-solid fa-trash" aria-hidden="true" /></button>
        </div>
        <StudioAdjustmentLayerMenu
          open={Boolean(adjustmentMenu)}
          anchorRect={adjustmentMenu}
          language={language}
          disabled={blocked || layers.length >= 8}
          onClose={() => setAdjustmentMenu(null)}
          onSelect={(type) => { setAdjustmentMenu(null); onLayerAction('adjustment-create', activeLayerId, type) }}
        />
        <StudioLayerFxMenu
          open={Boolean(fxMenu)}
          anchorRect={fxMenu}
          language={language}
          disabled={blocked || !selected || Boolean(selected?.adjustment)}
          onClose={() => setFxMenu(null)}
          onSelect={(effect) => { setFxMenu(null); onLayerAction('style-open', activeLayerId, effect) }}
        />
        </div>
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
