import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  StudioUIButton,
  StudioUIButtonRow,
  StudioUIIconButton,
  StudioUISection,
} from './StudioUIControls'
import {
  STUDIO_TOOL_GROUPS,
  STUDIO_TOOLS_BY_ID,
  STUDIO_WORKING_TOOLS,
  STUDIO_MANGA_DEFAULT_TOOLS,
  loadStudioPinnedTools,
  saveStudioPinnedTools,
} from './StudioToolCatalog'

const WORDS = {
  en: ['Edit tools', 'Choose and arrange the tools on your left toolbar.', 'Search tools', 'Pinned tools', 'All tools', 'Available', 'Coming soon', 'Manga default', 'Cancel', 'Save changes', 'Remove', 'Move up', 'Move down', 'Choose at least one available tool.', 'Could not save tool preferences on this device.', 'Close tool page', 'No tools match your search.', 'Tool preferences are saved on this device.', 'Tools selected', 'Changes not saved'],
  km: ['កែ Tool', 'ជ្រើស និងរៀបលំដាប់ Tool នៅផ្ទាំងខាងឆ្វេង។', 'ស្វែងរក Tool', 'Tool ដែលបានជ្រើស', 'Tool ទាំងអស់', 'អាចប្រើបាន', 'មិនទាន់មាន', 'Manga ដើម', 'បោះបង់', 'រក្សាទុកការកែ', 'ដកចេញ', 'ឡើងលើ', 'ចុះក្រោម', 'សូមជ្រើស Tool ដែលអាចប្រើបានយ៉ាងតិចមួយ។', 'មិនអាចរក្សាទុក Tool លើឧបករណ៍នេះបានទេ។', 'បិទទំព័រ Tool', 'រកមិនឃើញ Tool ទេ។', 'ការរៀបចំ Tool រក្សាទុកលើឧបករណ៍នេះ។', 'Tool ដែលបានជ្រើស', 'មិនទាន់រក្សាទុក'],
  zh: ['编辑工具', '选择并排列左侧工具栏的工具。', '搜索工具', '已选工具', '全部工具', '可使用', '即将推出', '漫画默认', '取消', '保存更改', '移除', '上移', '下移', '请至少选择一个可用工具。', '无法在此设备保存工具设置。', '关闭工具页面', '没有匹配的工具。', '工具设置保存在此设备。', '已选工具', '更改未保存'],
  ja: ['ツールを編集', '左側のツールを選択し並べ替えます。', 'ツールを検索', '選択中のツール', 'すべてのツール', '使用可能', '近日公開', 'マンガの初期設定', 'キャンセル', '変更を保存', '削除', '上へ', '下へ', '使用可能なツールを1つ以上選択してください。', 'この端末に設定を保存できません。', 'ツールページを閉じる', '一致するツールがありません。', '設定はこの端末に保存されます。', '選択中のツール', '変更は未保存'],
  ko: ['도구 편집', '왼쪽 도구 모음의 도구를 선택하고 정렬하세요.', '도구 검색', '선택된 도구', '모든 도구', '사용 가능', '출시 예정', '만화 기본값', '취소', '변경 저장', '제거', '위로', '아래로', '사용 가능한 도구를 하나 이상 선택하세요.', '이 기기에 도구 설정을 저장할 수 없습니다.', '도구 페이지 닫기', '일치하는 도구가 없습니다.', '도구 설정은 이 기기에 저장됩니다.', '선택된 도구', '저장되지 않은 변경 사항'],
}

const GROUP_NAMES = {
  en: { navigation: 'Navigation & selection', drawing: 'Drawing & painting', design: 'Comics & design', other: 'More tools' },
  km: { navigation: 'ផ្លាស់ទី និងជ្រើសរើស', drawing: 'គូរ និងផាត់ពណ៌', design: 'Manga និងរចនា', other: 'ឧបករណ៍ផ្សេងទៀត' },
  zh: { navigation: '导航与选择', drawing: '绘画与上色', design: '漫画与设计', other: '更多工具' },
  ja: { navigation: '移動と選択', drawing: '描画とペイント', design: 'マンガとデザイン', other: 'その他のツール' },
  ko: { navigation: '이동 및 선택', drawing: '그리기 및 채색', design: '만화 및 디자인', other: '기타 도구' },
}

const EN_NAMES = {
  move: 'Move', transform: 'Transform', marquee: 'Rectangle Select', wand: 'Magic Wand', lasso: 'Lasso', brush: 'Brush', pencil: 'Pencil', eraser: 'Eraser', smudge: 'Smudge', blur: 'Blur', fill: 'Paint Bucket', gradient: 'Gradient', eyedropper: 'Eyedropper', text: 'Text', shape: 'Shapes', frame: 'Comic Frames', crop: 'Crop', ruler: 'Ruler', canvas: 'Canvas', balloon: 'Speech Balloons', perspective: 'Perspective',
}

export default function StudioToolPage({ open = false, onClose, onSaved, activeTool, onToolChange }) {
  const { language, t: translate } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const groups = GROUP_NAMES[language] || GROUP_NAMES.en
  const [draft, setDraft] = useState(loadStudioPinnedTools)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const closeRef = useRef(null)
  const titleId = 'ss-tool-editor-title'
  const name = (id) => {
    const translated = translate(`studioTools.tools.${id}`)
    return translated && translated !== `studioTools.tools.${id}` ? translated : EN_NAMES[id] || id
  }

  useEffect(() => {
    if (!open) return
    setDraft(loadStudioPinnedTools())
    setSearch('')
    setError('')
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    return () => previousFocus?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose?.()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [open, onClose])

  function toggle(id) {
    if (!STUDIO_WORKING_TOOLS.has(id)) return
    setError('')
    setDraft((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function move(id, offset) {
    setDraft((current) => {
      const index = current.indexOf(id)
      const nextIndex = index + offset
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  function save() {
    if (!draft.length) {
      setError(t[13])
      return
    }
    try {
      const pinned = saveStudioPinnedTools(draft)
      onSaved?.(pinned)
      if (activeTool && !pinned.includes(activeTool)) onToolChange?.(pinned[0])
      onClose?.()
    } catch {
      setError(t[14])
    }
  }

  if (!open) return null

  const filtered = STUDIO_TOOL_GROUPS.map((group) => ({
    ...group,
    tools: group.tools.filter((item) => `${name(item.id)} ${EN_NAMES[item.id] || ''} ${item.id}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
  })).filter((group) => group.tools.length)

  return createPortal(
    <div className="ss-tool-ui-page" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <style>{`
        .ss-tool-ui-page{
          --ss-ui-bg:#20262d;--ss-ui-panel:#29313a;--ss-ui-panel-2:#313b46;--ss-ui-line:#4b5968;
          --ss-ui-line-soft:#3b4651;--ss-ui-text:#edf3fa;--ss-ui-muted:#aab8c6;--ss-ui-blue:#5faeff;--ss-ui-blue-soft:#355d84;
          position:fixed;inset:0;z-index:12050;display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;
          background:#20262d;color:#edf3fa;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
        }
        .ss-tool-ui-page *{box-sizing:border-box}
        .ss-tool-ui-head{min-height:58px;display:flex;align-items:center;gap:10px;padding:8px 12px 8px 16px;border-bottom:1px solid #4b5968;background:linear-gradient(180deg,#35414d,#29323c)}
        .ss-tool-ui-title{min-width:0;flex:1;display:flex;align-items:center;gap:10px}
        .ss-tool-ui-title>i{width:30px;height:30px;display:grid;place-items:center;border:1px solid #53708b;border-radius:7px;background:#2c3e50;color:#8bc4ff}
        .ss-tool-ui-title>span{min-width:0;display:flex;flex-direction:column;gap:2px}
        .ss-tool-ui-title strong{font-size:14px;font-weight:800}
        .ss-tool-ui-title small{color:#aab8c6;font-size:9px}
        .ss-tool-ui-body{min-height:0;flex:1;overflow:auto;overscroll-behavior:contain;padding:14px max(14px,calc((100vw - 1060px)/2))}
        .ss-tool-ui-search-wrap{position:relative;margin-bottom:11px}
        .ss-tool-ui-search-wrap i{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#8395a7;font-size:11px}
        .ss-tool-ui-search{width:100%;height:36px;padding:0 10px 0 32px;border:1px solid #4b5968;border-radius:7px;outline:none;background:#202832;color:#edf3fa;font:11px Inter,system-ui,sans-serif}
        .ss-tool-ui-search:focus{border-color:#5faeff;box-shadow:0 0 0 2px #5faeff26}
        .ss-tool-ui-selected{display:grid;gap:5px}
        .ss-tool-ui-row{min-height:37px;display:grid;grid-template-columns:28px minmax(0,1fr) auto;align-items:center;gap:7px;padding:4px 5px 4px 8px;border:1px solid #3f4d5a;border-radius:6px;background:#202832}
        .ss-tool-ui-row>i{width:24px;height:24px;display:grid;place-items:center;border-radius:5px;background:#303b46;color:#9ccaff}
        .ss-tool-ui-row>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-weight:650}
        .ss-tool-ui-row-actions{display:flex;gap:3px}
        .ss-tool-ui-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:6px}
        .ss-tool-ui-choice{min-height:40px;display:grid;grid-template-columns:18px 26px minmax(0,1fr) auto;align-items:center;gap:6px;padding:5px 7px;border:1px solid #3f4d5a;border-radius:6px;background:#202832;color:#edf3fa;font-size:10px;cursor:pointer}
        .ss-tool-ui-choice:hover{border-color:#63798d;background:#2b3641}
        .ss-tool-ui-choice[data-disabled=true]{opacity:.48;cursor:not-allowed}
        .ss-tool-ui-choice input{width:15px;height:15px;accent-color:#5faeff}
        .ss-tool-ui-choice>i{width:23px;height:23px;display:grid;place-items:center;border-radius:5px;background:#303b46;color:#a7c7e4}
        .ss-tool-ui-choice span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ss-tool-ui-choice small{color:#95a5b5;font-size:8px}
        .ss-tool-ui-hint,.ss-tool-ui-empty{margin:8px 0 0;color:#9fb0c0;font-size:9px;line-height:1.45}
        .ss-tool-ui-error{margin:0;padding:7px 9px;border:1px solid #8e4750;border-radius:6px;background:#4b2b31;color:#ffd5d8;font-size:9px;line-height:1.45}
        .ss-tool-ui-foot{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;border-top:1px solid #4b5968;background:#252d35}
        .ss-tool-ui-foot-status{min-width:0;flex:1;color:#aab8c6;font-size:9px}
        @media(max-width:650px),(pointer:coarse){
          .ss-tool-ui-head{min-height:52px;padding:7px 9px}
          .ss-tool-ui-title small{display:none}
          .ss-tool-ui-body{padding:9px}
          .ss-tool-ui-grid{grid-template-columns:1fr}
          .ss-tool-ui-foot{align-items:stretch;flex-direction:column}
          .ss-tool-ui-foot .ss-ui-button-row{width:100%}
          .ss-tool-ui-foot .ss-ui-button{flex:1}
        }
      `}</style>

      <header className="ss-tool-ui-head">
        <div className="ss-tool-ui-title">
          <i className="fa-solid fa-screwdriver-wrench" aria-hidden="true" />
          <span><strong id={titleId}>{t[0]}</strong><small>{t[1]}</small></span>
        </div>
        <span ref={closeRef}>
          <StudioUIIconButton icon="fa-solid fa-xmark" label={t[15]} onClick={() => onClose?.()} />
        </span>
      </header>

      <main className="ss-tool-ui-body">
        <StudioUISection title={`${t[3]} · ${draft.length}`} subtitle={t[17]} icon="fa-solid fa-thumbtack">
          <div className="ss-tool-ui-selected">
            {draft.map((id, index) => {
              const item = STUDIO_TOOLS_BY_ID[id]
              if (!item) return null
              return (
                <div className="ss-tool-ui-row" key={id}>
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                  <span>{name(id)}</span>
                  <div className="ss-tool-ui-row-actions">
                    <StudioUIIconButton icon="fa-solid fa-arrow-up" label={`${t[11]}: ${name(id)}`} disabled={index === 0} onClick={() => move(id, -1)} />
                    <StudioUIIconButton icon="fa-solid fa-arrow-down" label={`${t[12]}: ${name(id)}`} disabled={index === draft.length - 1} onClick={() => move(id, 1)} />
                    <StudioUIIconButton icon="fa-solid fa-xmark" label={`${t[10]}: ${name(id)}`} onClick={() => toggle(id)} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="ss-tool-ui-hint">{t[17]}</p>
        </StudioUISection>

        <div className="ss-tool-ui-search-wrap">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          <input className="ss-tool-ui-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t[2]} aria-label={t[2]} />
        </div>

        {filtered.length ? filtered.map((group) => (
          <StudioUISection key={group.id} title={groups[group.id] || group.id} icon="fa-solid fa-toolbox">
            <div className="ss-tool-ui-grid">
              {group.tools.map((item) => {
                const enabled = STUDIO_WORKING_TOOLS.has(item.id)
                return (
                  <label className="ss-tool-ui-choice" data-disabled={!enabled} key={item.id}>
                    <input type="checkbox" checked={enabled && draft.includes(item.id)} disabled={!enabled} onChange={() => toggle(item.id)} />
                    <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                    <span>{name(item.id)}</span>
                    {!enabled ? <small>{t[6]}</small> : null}
                  </label>
                )
              })}
            </div>
          </StudioUISection>
        )) : <p className="ss-tool-ui-empty">{t[16]}</p>}
      </main>

      <footer className="ss-tool-ui-foot">
        <div className="ss-tool-ui-foot-status">{error ? <p className="ss-tool-ui-error" role="alert">{error}</p> : `${draft.length} ${t[18]}`}</div>
        <StudioUIButtonRow>
          <StudioUIButton variant="ghost" onClick={() => { setDraft([...STUDIO_MANGA_DEFAULT_TOOLS]); setError('') }}>{t[7]}</StudioUIButton>
          <StudioUIButton onClick={() => onClose?.()}>{t[8]}</StudioUIButton>
          <StudioUIButton variant="primary" icon="fa-solid fa-check" disabled={!draft.length} onClick={save}>{t[9]}</StudioUIButton>
        </StudioUIButtonRow>
      </footer>
    </div>,
    document.body,
  )
}
