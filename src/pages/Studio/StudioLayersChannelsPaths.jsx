import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { STUDIO_BLEND_MODES } from './StudioLayerBlendEngine'

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
  const editingRef = useRef(null)
  const inputRef = useRef(null)
  const pendingGroupIds = useRef(null)
  const editTextLabel = ({ en: 'Edit text', km: 'កែអក្សរ', zh: '编辑文字', ja: 'テキストを編集', ko: '텍스트 수정' })[language] || 'Edit text'
  const duplicateLabel = ({ en: 'Duplicate layer', km: 'ចម្លងស្រទាប់', zh: '复制图层', ja: 'レイヤーを複製', ko: '레이어 복제' })[language] || 'Duplicate layer' 
  const convertLabel = ({ en: 'Convert Background to normal layer', km: 'ប្ដូរ Background ទៅជា Layer ធម្មតា', zh: '将背景转换为普通图层', ja: '背景を通常レイヤーに変換', ko: '배경을 일반 레이어로 변환' })[language] || 'Convert Background to normal layer'
  const mergeLabel = ({ en: 'Merge layer down', km: 'បញ្ចូលស្រទាប់ចុះក្រោម', zh: '向下合并图层', ja: '下のレイヤーと結合', ko: '아래 레이어와 병합' })[language] || 'Merge layer down'
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
    (selected.groupId || null) === (lower.groupId || null) &&
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
      (layerKind === 'pixel' && !layer.isBackground && !layer.textData)
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
        .shadow-studio .ss-lcp-pick{display:flex;align-items:center;gap:5px;min-width:0;flex:0 0 35px;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}
        .shadow-studio .ss-lcp-item-name{min-width:0;flex:1;display:grid;gap:3px}
        .shadow-studio .ss-lcp-name-trigger{display:block;width:100%;min-width:0;padding:1px 0;border:0;background:transparent;color:inherit;text-align:left;font:inherit;cursor:text}
        .shadow-studio .ss-lcp-rename-input{box-sizing:border-box;display:block;width:100%;min-width:0;height:29px;padding:3px 5px;border:1px solid #9dc9fa;border-radius:4px;background:#152638;color:#fff;font:inherit;font-size:12px;outline:2px solid #5ca9f4;outline-offset:0}
        .shadow-studio .ss-lcp-group-name.ss-lcp-name-trigger{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;font-weight:700}
        .shadow-studio .ss-lcp-group-head>.ss-lcp-rename-input{flex:1}
        .shadow-studio .ss-lcp-group-add-label{display:none}
        @media(pointer:coarse){.shadow-studio .ss-lcp-action{min-height:34px;min-width:30px}.shadow-studio .ss-lcp-name-trigger{min-height:34px;display:flex;align-items:center}.shadow-studio .ss-lcp-group-add-label{display:inline}.shadow-studio .ss-lcp-group-add{display:flex;align-items:center;gap:5px;padding:0 7px}.shadow-studio .ss-lcp-list{max-height:min(55vh,440px)}}
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
        .shadow-studio .ss-lcp-list{display:grid;gap:4px;max-height:300px;overflow-y:auto;overscroll-behavior:contain}
        .shadow-studio .ss-lcp-group{display:grid;gap:5px;margin:5px 0 3px;padding:6px;border:1px solid #607b94;border-radius:5px;background:#283c50}
        .shadow-studio .ss-lcp-group-head{display:flex;align-items:center;gap:5px}
        .shadow-studio .ss-lcp-group-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
        .shadow-studio .ss-lcp-group-settings{display:flex;flex-wrap:wrap;align-items:center;gap:5px}
        .shadow-studio .ss-lcp-group-settings select,.shadow-studio .ss-lcp-group-settings button,.shadow-studio .ss-lcp-blend select{min-width:0;max-width:100%;height:27px;border:1px solid #637f97;border-radius:4px;background:#31495f;color:#eef6ff;font:inherit;font-size:10px}
        .shadow-studio .ss-lcp-group-settings select{max-width:103px}
        .shadow-studio .ss-lcp-group-settings button{padding:0 6px}
        .shadow-studio .ss-lcp-blend{display:flex;align-items:center;gap:5px;font-size:10px;color:#ccdce9}
        .shadow-studio .ss-lcp-blend select{max-width:107px}
        .shadow-studio .ss-lcp-layer[data-grouped=true]{margin-left:12px;border-left:3px solid #86b4dc} 

        .shadow-studio .ss-lcp{--ss-layer-bg:#454545;--ss-layer-border:#626262;--ss-layer-fg:#e9e9e9;color:var(--ss-layer-fg);background:var(--ss-layer-bg)}
        .shadow-studio .ss-lcp-tabs{grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin:0;padding:0 3px;border-color:var(--ss-layer-border);background:#3b3b3b}
        .shadow-studio .ss-lcp-tab{height:27px;border-radius:0;color:#c9c9c9;font-size:11px}
        .shadow-studio .ss-lcp-tab[aria-selected=true]{border-bottom:1px solid #979797;background:#4c4c4c;color:#fff}
        .shadow-studio .ss-lcp-layers-layout{display:flex;flex-direction:column;min-width:0;min-height:230px;height:min(58vh,510px);max-height:calc(100dvh - 160px);background:var(--ss-layer-bg)}
        .shadow-studio .ss-lcp-filter-bar{display:flex;align-items:center;gap:5px;min-width:0;padding:7px 6px 4px;border-bottom:1px solid #585858}
        .shadow-studio .ss-lcp-search{display:flex;align-items:center;gap:5px;flex:1;min-width:0;height:27px;padding:0 7px;border:1px solid #686868;background:#414141;color:#c7c7c7;font-size:10px}
        .shadow-studio .ss-lcp-search input{flex:1;min-width:0;width:100%;height:100%;padding:0;border:0;outline:0;background:transparent;color:#f5f5f5;font:inherit;font-size:11px}
        .shadow-studio .ss-lcp-search input::placeholder{color:#aaa}
        .shadow-studio .ss-lcp-kind{flex:0 1 98px;min-width:62px;max-width:98px;height:27px;padding:0 2px;border:1px solid #686868;background:#414141;color:#e7e7e7;font:inherit;font-size:10px}
        .shadow-studio .ss-lcp-settings{display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:wrap;padding:5px 6px 7px;border-bottom:1px solid var(--ss-layer-border)}
        .shadow-studio .ss-lcp-settings .ss-lcp-blend{flex:1;min-width:105px}
        .shadow-studio .ss-lcp-settings .ss-lcp-blend select{flex:1;max-width:none;min-width:0}
        .shadow-studio .ss-lcp-settings .ss-lcp-opacity{flex:0 0 auto}
        .shadow-studio .ss-lcp-settings .ss-lcp-opacity select{width:60px}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-list{flex:1;min-height:95px;max-height:none;gap:0;grid-auto-rows:min-content;align-content:start;overflow:auto;background:var(--ss-layer-bg)}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-layer{gap:6px;min-height:37px;padding:3px 6px;border:0;border-bottom:1px solid #575757;border-radius:0;background:transparent;color:var(--ss-layer-fg)}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-layer[data-selected=true]{border-color:#666;background:#686868}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-thumb{background:#fff;border:1px solid #202020}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-pick{flex-basis:35px}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-item-name strong{font-size:11px;font-weight:500}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-layer[data-selected=true] .ss-lcp-item-name strong{font-weight:650}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-item-name small{font-size:9px;color:#bcbcbc}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-action{height:26px;min-width:25px;padding:0 4px;border:1px solid transparent;border-radius:2px;background:transparent;color:#dedede;font-size:11px}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-action:hover:not(:disabled){border-color:#898989;background:#646464}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-action:disabled{opacity:.35}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-blend select,.shadow-studio .ss-lcp-layers-layout .ss-lcp-opacity select,.shadow-studio .ss-lcp-layers-layout .ss-lcp-group-settings select,.shadow-studio .ss-lcp-layers-layout .ss-lcp-group-settings button{border-color:#696969;background:#414141;color:#e7e7e7}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-group{margin:1px 0;padding:4px;border:0;border-bottom:1px solid #666;border-radius:0;background:#505050}
        .shadow-studio .ss-lcp-layers-layout .ss-lcp-layer[data-grouped=true]{margin-left:10px;border-left:2px solid #989898}
        .shadow-studio .ss-lcp-more{flex:none;border-top:1px solid #5d5d5d;background:#404040}
        .shadow-studio .ss-lcp-more summary{padding:5px 9px;cursor:pointer;font-size:10px;color:#d7d7d7}
        .shadow-studio .ss-lcp-more .ss-lcp-tools{max-height:114px;overflow-y:auto;flex-wrap:wrap;margin:0;padding:5px 6px;border-top:1px solid #5b5b5b}
        .shadow-studio .ss-lcp-footer{display:flex;align-items:center;justify-content:space-around;gap:5px;flex:none;min-height:33px;padding:3px 6px;border-top:1px solid #777;background:#404040}
        .shadow-studio .ss-lcp-footer .ss-lcp-action{flex:1;max-width:55px;min-height:27px}
        .shadow-studio .ss-lcp-hint{padding:4px 8px}
        @media(pointer:coarse){.shadow-studio .ss-lcp-layers-layout{height:min(56dvh,510px);max-height:calc(100dvh - 120px)}.shadow-studio .ss-lcp-footer .ss-lcp-action{min-height:36px}.shadow-studio .ss-lcp-more summary{padding:9px}.shadow-studio .ss-lcp-layers-layout .ss-lcp-list{max-height:none}}
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
              <button className="ss-lcp-pick" type="button" disabled={blocked} onDoubleClick={layer.textData ? () => onLayerAction('edit-text', layer.id) : undefined} onClick={() => onLayerAction('select', layer.id)} aria-label={`${a[1]} ${layer.name}`} title={layer.textData ? editTextLabel : a[1]}>
                <canvas className="ss-lcp-thumb" ref={(node) => { layerRefs.current[layer.id] = node }} aria-hidden="true" />
              </button>
              <span className="ss-lcp-item-name">
                {editing?.kind === 'layer' && editing.id === layer.id ? renameInput('layer', layer) : <button className="ss-lcp-name-trigger" type="button" disabled={blocked} title={`${a[8]}: ${layer.name}`} aria-label={`${a[8]}: ${layer.name}`} onClick={() => layer.id === activeLayerId ? beginRename('layer', layer) : onLayerAction('select', layer.id)}><strong>{layer.textData ? 'T · ' : ''}{layer.name}</strong></button>}
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
          <button className="ss-lcp-action" type="button" title={duplicateLabel} aria-label={duplicateLabel} disabled={blocked || !selected || selected.isBackground || layers.length >= 8} onClick={() => onLayerAction('duplicate', activeLayerId)}><i className="fa-regular fa-copy" aria-hidden="true" /></button>
          <button className="ss-lcp-action ss-lcp-group-add" type="button" title={groupControl[0]} aria-label={groupControl[0]} disabled={blocked || !selected || selected.isBackground || Boolean(selectedGroup) || groups.length >= 8} onClick={() => { pendingGroupIds.current = new Set(groups.map((item) => item.id)); onLayerAction('group-add', activeLayerId) }}><i className="fa-solid fa-folder-plus" aria-hidden="true" /><span className="ss-lcp-group-add-label">{groupControl[0]}</span></button>
          <button className="ss-lcp-action" type="button" title={`${a[9]} · Delete / Backspace`} aria-label={a[9]} disabled={blocked || !selected || selected.locked || Boolean(selectedGroup?.locked)} onClick={() => onLayerAction('remove', activeLayerId)}><i className="fa-solid fa-trash" aria-hidden="true" /></button>
        </div>
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
