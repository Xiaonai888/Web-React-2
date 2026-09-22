import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
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
    <div className="ss-tool-editor" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <style>{`
        .ss-tool-editor{position:fixed;inset:0;z-index:12050;display:flex;flex-direction:column;box-sizing:border-box;min-width:0;overflow:hidden;background:#202936;color:#edf4ff;font:inherit}
        .ss-tool-editor *{box-sizing:border-box}
        .ss-tool-editor button,.ss-tool-editor input{font:inherit}
        .ss-tool-editor button{cursor:pointer}
        .ss-tool-editor button:disabled{cursor:not-allowed;opacity:.4}
        .ss-tool-editor :focus-visible{outline:2px solid #94c6ff;outline-offset:2px}
        .ss-tool-editor-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px max(16px,env(safe-area-inset-right));border-bottom:1px solid #52657b;background:#283748}
        .ss-tool-editor-header h2{margin:0;font-size:18px}
        .ss-tool-editor-header p{margin:5px 0 0;font-size:12px;color:#c7d4e3}
        .ss-tool-editor-close{flex:none;width:38px;height:38px;border:1px solid #687f97;border-radius:7px;background:#34485d;color:#fff}
        .ss-tool-editor-main{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:16px max(16px,calc((100vw - 1040px)/2));scrollbar-width:thin}
        .ss-tool-editor-search{display:block;width:100%;height:42px;margin-bottom:14px;padding:8px 12px;border:1px solid #6a84a0;border-radius:7px;background:#1b2734;color:#fff}
        .ss-tool-editor-section{margin-bottom:14px;padding:14px;border:1px solid #4b6077;border-radius:9px;background:#29394b}
        .ss-tool-editor-section h3{margin:0 0 11px;font-size:14px}
        .ss-tool-editor-selected{display:grid;gap:6px}
        .ss-tool-editor-selected-row{display:flex;align-items:center;gap:9px;min-height:41px;padding:5px 8px;border:1px solid #4c6581;border-radius:6px;background:#30465c}
        .ss-tool-editor-selected-row span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
        .ss-tool-editor-icon{flex:none;width:20px;text-align:center;color:#b5d9ff}
        .ss-tool-editor-mini{min-width:34px;height:31px;padding:4px 7px;border:1px solid #6684a2;border-radius:5px;background:#3b526b;color:#f1f7ff}
        .ss-tool-editor-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:7px}
        .ss-tool-editor-choice{display:flex;align-items:center;gap:9px;min-height:43px;padding:7px;border:1px solid #506781;border-radius:6px;background:#34485e;font-size:12px;cursor:pointer}
        .ss-tool-editor-choice[data-disabled=true]{opacity:.6;cursor:not-allowed}
        .ss-tool-editor-choice input{flex:none;accent-color:#7ab8ff}
        .ss-tool-editor-choice span{flex:1;min-width:0}
        .ss-tool-editor-choice small{color:#b9c8d9;font-size:10px}
        .ss-tool-editor-footer{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:8px;padding:12px max(16px,env(safe-area-inset-right));border-top:1px solid #52657b;background:#283748}
        .ss-tool-editor-footer p{flex:1 1 100%;margin:0;color:#ffcbcc;font-size:12px}
        .ss-tool-editor-footer button{min-height:37px;padding:7px 12px;border:1px solid #6683a0;border-radius:6px;background:#354e67;color:#fff}
        .ss-tool-editor-footer .ss-tool-editor-save{background:#3479bb;border-color:#94c6ff}
        .ss-tool-editor-hint{margin:9px 0 0;font-size:11px;color:#bbcadc}
        .ss-tool-editor-empty{margin:0;color:#bbcadc;font-size:12px}
        @media(max-width:600px){.ss-tool-editor-header{padding:12px}.ss-tool-editor-header h2{font-size:16px}.ss-tool-editor-main{padding:10px}.ss-tool-editor-section{padding:10px}.ss-tool-editor-grid{grid-template-columns:minmax(0,1fr)}.ss-tool-editor-footer{padding:10px}}
      `}</style>
      <header className="ss-tool-editor-header">
        <div><h2 id={titleId}>{t[0]}</h2><p>{t[1]}</p></div>
        <button ref={closeRef} className="ss-tool-editor-close" type="button" onClick={() => onClose?.()} aria-label={t[15]}>✕</button>
      </header>
      <main className="ss-tool-editor-main">
        <section className="ss-tool-editor-section" aria-label={t[3]}>
          <h3>{t[3]} · {draft.length}</h3>
          <div className="ss-tool-editor-selected">
            {draft.map((id, index) => {
              const item = STUDIO_TOOLS_BY_ID[id]
              if (!item) return null
              return <div className="ss-tool-editor-selected-row" key={id}>
                <i className={`ss-tool-editor-icon fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{name(id)}</span>
                <button className="ss-tool-editor-mini" type="button" disabled={index === 0} onClick={() => move(id, -1)} aria-label={`${t[11]}: ${name(id)}`}>↑</button>
                <button className="ss-tool-editor-mini" type="button" disabled={index === draft.length - 1} onClick={() => move(id, 1)} aria-label={`${t[12]}: ${name(id)}`}>↓</button>
                <button className="ss-tool-editor-mini" type="button" onClick={() => toggle(id)} aria-label={`${t[10]}: ${name(id)}`}>×</button>
              </div>
            })}
          </div>
          <p className="ss-tool-editor-hint">{t[17]}</p>
        </section>
        <input className="ss-tool-editor-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t[2]} aria-label={t[2]} />
        {filtered.length ? filtered.map((group) => <section className="ss-tool-editor-section" key={group.id}>
          <h3>{groups[group.id] || group.id}</h3>
          <div className="ss-tool-editor-grid">
            {group.tools.map((item) => {
              const enabled = STUDIO_WORKING_TOOLS.has(item.id)
              return <label className="ss-tool-editor-choice" data-disabled={!enabled} key={item.id}>
                <input type="checkbox" checked={enabled && draft.includes(item.id)} disabled={!enabled} onChange={() => toggle(item.id)} />
                <i className={`ss-tool-editor-icon fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{name(item.id)}</span>
                {!enabled ? <small>{t[6]}</small> : null}
              </label>
            })}
          </div>
        </section>) : <p className="ss-tool-editor-empty">{t[16]}</p>}
      </main>
      <footer className="ss-tool-editor-footer">
        {error ? <p role="alert">{error}</p> : null}
        <button type="button" onClick={() => { setDraft([...STUDIO_MANGA_DEFAULT_TOOLS]); setError('') }}>{t[7]}</button>
        <button type="button" onClick={() => onClose?.()}>{t[8]}</button>
        <button type="button" className="ss-tool-editor-save" disabled={!draft.length} onClick={save}>{t[9]}</button>
      </footer>
    </div>,
    document.body
  )
}
