import { useRef } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const WORDS = {
  en: ['Project', 'Open papers', 'Undo', 'Redo', 'Unsaved changes', 'No pending changes', 'Export', 'Save', 'Publish', 'More actions', 'Place Image', 'New paper', 'Fit paper', 'Toggle grid', 'Studio home', 'Publish is not available yet'],
  km: ['គម្រោង', 'ក្រដាសដែលបានបើក', 'មិនធ្វើវិញ', 'ធ្វើឡើងវិញ', 'មានការកែមិនទាន់រក្សាទុក', 'គ្មានការកែរង់ចាំ', 'នាំចេញ', 'រក្សាទុក', 'បោះពុម្ពផ្សាយ', 'សកម្មភាពបន្ថែម', 'ដាក់រូបភាព', 'ក្រដាសថ្មី', 'បង្ហាញសមក្រដាស', 'បើក/បិទក្រឡា', 'ទំព័រដើម Studio', 'មុខងារបោះពុម្ពផ្សាយមិនទាន់មាន'],
  zh: ['项目', '已打开的画布', '撤销', '重做', '有未保存的更改', '没有待保存的更改', '导出', '保存', '发布', '更多操作', '放入图片', '新建画布', '适合画布', '切换网格', 'Studio 首页', '发布功能尚未开放'],
  ja: ['プロジェクト', '開いているキャンバス', '元に戻す', 'やり直す', '未保存の変更があります', '保留中の変更はありません', '書き出し', '保存', '公開', 'その他の操作', '画像を配置', '新規キャンバス', 'キャンバス全体を表示', 'グリッド切替', 'Studio ホーム', '公開機能はまだ利用できません'],
  ko: ['프로젝트', '열린 캔버스', '실행 취소', '다시 실행', '저장되지 않은 변경 사항', '보류 중인 변경 사항 없음', '내보내기', '저장', '게시', '추가 작업', '이미지 배치', '새 캔버스', '화면에 맞추기', '격자 전환', 'Studio 홈', '게시 기능은 아직 사용할 수 없습니다'],
}

export default function StudioHeaderWorkspace({
  documents = [], activeDocumentId, canUndo, canRedo, busy,
  onSwitchPaper, onUndo, onRedo, onSave, onExport,
  onPlaceImage, onNewPaper, onFit, onToggleGrid, onHome,
}) {
  const moreRef = useRef(null)
  const { language } = useDisplayTranslation()
  const t = WORDS[language] || WORDS.en
  const projectName = documents[0]?.name || 'Untitled'
  const hasChanges = documents.some((paper) => paper.dirty)
  const runMore = (action) => {
    moreRef.current?.removeAttribute('open')
    action?.()
  }

  return (
    <>
      <style>{`
        .shadow-studio:has(.ss-layout) > .ss-chrome{
          --ss-head-bg:#29313a;
          --ss-head-bg-2:#202832;
          --ss-head-bg-3:#313b46;
          --ss-head-line:#4b5968;
          --ss-head-line-soft:#3b4651;
          --ss-head-text:#edf3fa;
          --ss-head-muted:#aab8c6;
          --ss-head-blue:#5faeff;
          --ss-head-blue-soft:#355d84;
          position:relative;
          min-width:0;
          height:54px;
          min-height:54px;
          flex:0 0 54px;
          padding:0 9px;
          border-bottom:1px solid var(--ss-head-line);
          background:linear-gradient(180deg,#35414d,#29323c);
          color:var(--ss-head-text);
          overflow:visible;
          box-shadow:inset 0 -1px 0 #0004
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-logo-btn{
          flex:0 0 36px!important;
          min-width:36px!important;
          width:36px!important;
          height:36px!important;
          margin:0!important;
          padding:0!important;
          justify-content:center!important;
          border:1px solid transparent!important;
          border-radius:7px!important;
          background:transparent!important
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-logo-btn:hover{
          border-color:#516274!important;
          background:#313e4b!important
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-logo-btn::after{
          content:none!important;
          display:none!important
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-logo{
          width:22px;
          height:22px;
          object-fit:contain
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus{
          display:flex;
          align-items:center;
          gap:2px;
          min-width:0;
          max-width:100%;
          white-space:nowrap
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus>.ss-menu-btn{
          flex:0 0 auto;
          min-width:0;
          height:34px;
          padding:0 8px;
          border:1px solid transparent;
          border-radius:6px;
          background:transparent;
          color:#dce7f1;
          font-size:11px;
          font-weight:650
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus>.ss-menu-btn:hover:not(:disabled){
          border-color:#536678;
          background:#344250;
          color:#fff
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus>.ss-menu-btn:disabled{
          opacity:.65;
          color:#b8c4cf
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-center{
          display:flex;
          align-items:center;
          justify-content:center;
          width:100%;
          min-width:0;
          max-width:none;
          height:100%;
          z-index:4
        }
        .shadow-studio .ss-header-project{
          position:relative;
          max-width:100%;
          min-width:0;
          color:#dce7f2;
          font-size:10px
        }
        .shadow-studio .ss-header-project>summary{
          display:flex;
          align-items:center;
          gap:7px;
          min-height:32px;
          max-width:100%;
          min-width:0;
          overflow:hidden;
          padding:0 8px;
          border:1px solid transparent;
          border-radius:6px;
          cursor:pointer;
          list-style:none;
          white-space:nowrap;
          transition:border-color 120ms ease,background 120ms ease
        }
        .shadow-studio .ss-header-project>summary::-webkit-details-marker{display:none}
        .shadow-studio .ss-header-project>summary:hover,
        .shadow-studio .ss-header-project[open]>summary{
          border-color:#536678;
          background:#344250
        }
        .shadow-studio .ss-header-project>summary>span{
          flex:none;
          color:#9fb0c0;
          font-weight:650
        }
        .shadow-studio .ss-header-project>summary>b{
          color:#6f7f8e;
          font-weight:400
        }
        .shadow-studio .ss-header-project>summary>strong{
          min-width:0;
          max-width:155px;
          overflow:hidden;
          text-overflow:ellipsis;
          color:#eff5fb;
          font-weight:750
        }
        .shadow-studio .ss-header-project>summary>i{
          flex:none;
          color:#8fa4b7;
          font-size:8px
        }
        .shadow-studio .ss-header-project-menu{
          position:absolute;
          top:38px;
          left:0;
          z-index:1200;
          min-width:210px;
          max-width:300px;
          max-height:50vh;
          overflow-y:auto;
          padding:6px;
          border:1px solid #607183;
          border-radius:8px;
          background:#252d35;
          box-shadow:0 14px 32px #000a
        }
        .shadow-studio .ss-header-project-menu>span{
          display:block;
          padding:5px 7px 7px;
          border-bottom:1px solid var(--ss-head-line-soft);
          color:#9fb0c0;
          font-size:9px;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.04em
        }
        .shadow-studio .ss-header-project-menu>button{
          display:block;
          width:100%;
          min-height:32px;
          margin-top:3px;
          padding:5px 8px;
          overflow:hidden;
          border:1px solid transparent;
          border-radius:5px;
          background:transparent;
          color:#e7eef6;
          text-align:left;
          text-overflow:ellipsis;
          white-space:nowrap;
          font:650 10px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer
        }
        .shadow-studio .ss-header-project-menu>button[aria-current=page]{
          border-color:#6e9ac1;
          background:var(--ss-head-blue-soft);
          color:#fff
        }
        .shadow-studio .ss-header-project-menu>button:hover:not(:disabled){
          border-color:#566b7e;
          background:#354555
        }
        .shadow-studio .ss-header-project-menu>button:disabled{
          opacity:.7;
          cursor:default
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:5px;
          flex:none;
          min-width:0;
          height:100%;
          margin-left:0;
          white-space:nowrap;
          z-index:5
        }
        .shadow-studio .ss-header-actions button{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:6px;
          height:32px;
          border:1px solid var(--ss-head-line);
          border-radius:6px;
          background:var(--ss-head-bg-3);
          color:#e8f0f8;
          padding:0 10px;
          font:750 10px Inter,ui-sans-serif,system-ui,sans-serif;
          cursor:pointer;
          box-shadow:inset 0 0 0 1px #ffffff05;
          transition:border-color 120ms ease,background 120ms ease,color 120ms ease
        }
        .shadow-studio .ss-header-actions button:hover:not(:disabled){
          border-color:#748da3;
          background:#435466;
          color:#fff
        }
        .shadow-studio .ss-header-actions button:disabled{
          opacity:.42;
          cursor:not-allowed
        }
        .shadow-studio .ss-header-actions button:focus-visible,
        .shadow-studio .ss-header-project>summary:focus-visible{
          outline:2px solid var(--ss-head-blue);
          outline-offset:2px
        }
        .shadow-studio .ss-header-actions .ss-header-icon{
          flex-direction:column;
          gap:0;
          width:34px;
          height:40px;
          min-width:34px;
          padding:2px 1px;
          border:0;
          background:transparent;
          color:#d5e0ec;
          font-size:8px;
          font-weight:500;
          box-shadow:none
        }
        .shadow-studio .ss-header-actions .ss-header-icon:hover:not(:disabled){
          background:#344250
        }
        .shadow-studio .ss-header-actions .ss-header-icon i{
          color:#b8d4eb;
          font-size:15px
        }
        .shadow-studio .ss-header-actions .ss-header-state{
          max-width:136px;
          min-width:0;
          display:flex;
          align-items:center;
          gap:6px;
          padding:0 8px;
          border-left:1px solid var(--ss-head-line-soft);
          color:#9fb0c0;
          font-size:9px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap
        }
        .shadow-studio .ss-header-actions .ss-header-state i{
          flex:none;
          color:#8fb1d1;
          font-size:12px
        }
        .shadow-studio .ss-header-actions .ss-header-state span{
          overflow:hidden;
          text-overflow:ellipsis
        }
        .shadow-studio .ss-header-actions .ss-header-save{
          min-width:62px;
          border-color:#79b8ed;
          background:#4f9ddd;
          color:#0f2537
        }
        .shadow-studio .ss-header-actions .ss-header-save:hover:not(:disabled){
          border-color:#b5dcff;
          background:#8bc7f6;
          color:#10263a
        }
        .shadow-studio .ss-header-more{
          position:relative;
          flex:none
        }
        .shadow-studio .ss-header-more>summary{
          display:grid;
          place-items:center;
          width:32px;
          height:32px;
          border:1px solid transparent;
          border-radius:6px;
          color:#e2eaf2;
          cursor:pointer;
          list-style:none
        }
        .shadow-studio .ss-header-more>summary:hover,
        .shadow-studio .ss-header-more[open]>summary{
          border-color:#536678;
          background:#344250
        }
        .shadow-studio .ss-header-more>summary::-webkit-details-marker{display:none}
        .shadow-studio .ss-header-more-menu{
          position:absolute;
          top:38px;
          right:0;
          z-index:1200;
          width:190px;
          padding:6px;
          border:1px solid #607183;
          border-radius:8px;
          background:#252d35;
          box-shadow:0 14px 32px #000a
        }
        .shadow-studio .ss-header-more-menu button{
          display:flex;
          justify-content:flex-start;
          width:100%;
          min-height:32px;
          height:auto;
          padding:0 9px;
          border:1px solid transparent;
          background:transparent;
          color:#e7eef6;
          text-align:left
        }
        .shadow-studio .ss-header-more-menu button:hover:not(:disabled){
          border-color:#566b7e;
          background:#354555
        }
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) > .ss-options-bar{display:none!important}
          .shadow-studio:has(.ss-layout) > .ss-project-message{
            position:absolute!important;
            top:58px;
            right:12px;
            left:auto;
            z-index:100;
            max-width:min(390px,70vw);
            width:max-content;
            min-height:0;
            max-height:none;
            margin:0;
            padding:9px 13px;
            border:1px solid #536778;
            border-radius:7px;
            background:#263545;
            box-shadow:0 8px 20px #0007;
            white-space:normal;
            line-height:1.45;
            pointer-events:none;
            animation:ss-header-notice 7s forwards
          }
          .shadow-studio:has(.ss-layout) > .ss-project-message + .ss-project-message{top:100px}
          .shadow-studio:has(.ss-layout) > .ss-tabs{
            top:auto;
            z-index:3;
            margin:0;
            min-height:36px;
            height:36px;
            flex:0 0 36px;
            background:#242c36
          }
          .shadow-studio:has(.ss-layout) > .ss-tabs .ss-tab{height:35px}
          .shadow-studio:has(.ss-layout) > .ss-tabs .ss-tab-count{display:none}
        }
        @keyframes ss-header-notice{
          0%,83%{opacity:1}
          100%{opacity:0;visibility:hidden}
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome{
          display:grid!important;
          grid-template-columns:38px max-content minmax(90px,1fr) max-content;
          align-items:center;
          column-gap:5px
        }
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-logo-btn{grid-column:1}
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus{grid-column:2}
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-center{grid-column:3}
        .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions{grid-column:4}
        @media(max-width:1460px) and (min-width:1101px){
          .shadow-studio:has(.ss-layout) > .ss-chrome{
            grid-template-columns:36px max-content minmax(60px,1fr) max-content;
            column-gap:2px;
            padding:0 7px
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus>.ss-menu-btn{
            padding:0 6px;
            font-size:10px
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions{gap:3px}
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions .ss-header-state{
            max-width:95px;
            padding:0 4px
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions button{padding:0 8px}
        }
        @media(max-width:1250px) and (min-width:1101px){
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions .ss-header-state{display:none}
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-project>summary>span{display:none}
        }
        @media(max-width:1100px){
          .shadow-studio:has(.ss-layout) > .ss-chrome{
            display:flex!important;
            gap:2px;
            overflow-x:auto;
            overflow-y:hidden
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-menus{
            flex:none;
            width:max-content;
            max-width:none;
            gap:0
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-center{
            position:relative;
            left:auto;
            top:auto;
            transform:none;
            flex:none;
            min-width:100px;
            max-width:170px;
            width:auto
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-actions{
            flex:none;
            margin-left:auto
          }
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-state{display:none}
        }
        @media(max-width:650px){
          .shadow-studio:has(.ss-layout) > .ss-chrome .ss-header-center{display:none}
          .shadow-studio .ss-header-actions .ss-header-icon{
            height:33px;
            font-size:0
          }
          .shadow-studio .ss-header-actions .ss-header-icon i{font-size:14px}
        }
      `}</style>
      <div className="ss-header-center">
        <details className="ss-header-project">
          <summary><span>{t[0]}</span><b>/</b><strong title={projectName}>{projectName}</strong><i className="fa-solid fa-chevron-down" aria-hidden="true" /></summary>
          <div className="ss-header-project-menu" role="group" aria-label={t[1]}>
            <span>{t[1]}</span>
            {documents.map((paper) => (
              <button key={paper.id} type="button" aria-current={paper.id === activeDocumentId ? 'page' : undefined} disabled={busy || paper.id === activeDocumentId} onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onSwitchPaper(paper.id) }}>{paper.name}</button>
            ))}
          </div>
        </details>
      </div>
      <div className="ss-header-actions">
        <button className="ss-header-icon" type="button" onClick={onUndo} disabled={busy || !canUndo} title={t[2]} aria-label={t[2]}><i className="fa-solid fa-rotate-left" aria-hidden="true" /><span>{t[2]}</span></button>
        <button className="ss-header-icon" type="button" onClick={onRedo} disabled={busy || !canRedo} title={t[3]} aria-label={t[3]}><i className="fa-solid fa-rotate-right" aria-hidden="true" /><span>{t[3]}</span></button>
        <span className="ss-header-state" title={hasChanges ? t[4] : t[5]}><i className="fa-solid fa-floppy-disk" aria-hidden="true" /><span>{hasChanges ? t[4] : t[5]}</span></span>
        <button type="button" onClick={onExport} disabled={busy}>{t[6]}</button>
        <button type="button" className="ss-header-save" onClick={onSave} disabled={busy}>{t[7]}</button>
        <button type="button" disabled title={t[15]}>{t[8]}</button>
        <details className="ss-header-more" ref={moreRef}>
          <summary title={t[9]} aria-label={t[9]}><i className="fa-solid fa-ellipsis" aria-hidden="true" /></summary>
          <div className="ss-header-more-menu">
            <button type="button" onClick={() => runMore(onPlaceImage)} disabled={busy}>{t[10]}</button>
            <button type="button" onClick={() => runMore(onNewPaper)} disabled={busy}>{t[11]}</button>
            <button type="button" onClick={() => runMore(onFit)} disabled={busy}>{t[12]}</button>
            <button type="button" onClick={() => runMore(onToggleGrid)} disabled={busy}>{t[13]}</button>
            <button type="button" disabled={busy} onClick={() => runMore(onHome)}>{t[14]}</button>
          </div>
        </details>
      </div>
    </>
  )
}
