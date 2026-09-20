import { STUDIO_PRESETS } from './StudioNewFileDialog'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('studioHome', {
  "en": {
    "openProject": "Open Project",
    "importImage": "Import Image as Paper",
    "resume": "Continue Workspace",
    "checking": "Checking for locally autosaved work...",
    "localRecovery": "Local recovery",
    "recoverHeading": "Recover your last workspace",
    "recoveryDescription": "{{count}} paper(s) · Autosaved {{time}}. Restore them before creating or opening another project.",
    "restoring": "Restoring...",
    "restore": "Restore Workspace",
    "discard": "Discard Recovery",
    "projectFiles": "Project files",
    "projectInfo": "Save Project downloads a .shadowstudio file to your device. Open Project reopens it later. Local autosave is only a temporary browser recovery copy."
  },
  "km": {
    "openProject": "បើកគម្រោង",
    "importImage": "នាំចូលរូបភាពជាក្រដាស",
    "resume": "បន្តការងារ",
    "checking": "កំពុងពិនិត្យការងារដែលបានរក្សាទុកស្វ័យប្រវត្តិ...",
    "localRecovery": "ការស្ដារទិន្នន័យក្នុងឧបករណ៍",
    "recoverHeading": "ស្ដារការងារចុងក្រោយ",
    "recoveryDescription": "មានក្រដាស {{count}} · បានរក្សាទុកស្វ័យប្រវត្តិនៅ {{time}}។ សូមស្ដារវាមុនបង្កើត ឬបើកគម្រោងផ្សេង។",
    "restoring": "កំពុងស្ដារ...",
    "restore": "ស្ដារការងារ",
    "discard": "បោះបង់ទិន្នន័យស្ដារ",
    "projectFiles": "ឯកសារគម្រោង",
    "projectInfo": "Save Project ទាញយកឯកសារ .shadowstudio ទៅឧបករណ៍របស់អ្នក។ អាចប្រើ Open Project ដើម្បីបើកវាម្ដងទៀត។ ការរក្សាទុកស្វ័យប្រវត្តិក្នុង Browser គឺសម្រាប់ស្ដារជាបណ្ដោះអាសន្នប៉ុណ្ណោះ។"
  },
  "zh": {
    "openProject": "打开项目",
    "importImage": "将图像导入为画布",
    "resume": "继续编辑",
    "checking": "正在检查本地自动保存的作品...",
    "localRecovery": "本地恢复",
    "recoverHeading": "恢复上次的工作区",
    "recoveryDescription": "{{count}} 个画布 · 于 {{time}} 自动保存。请先恢复，再创建或打开其他项目。",
    "restoring": "正在恢复...",
    "restore": "恢复工作区",
    "discard": "丢弃恢复数据",
    "projectFiles": "项目文件",
    "projectInfo": "Save Project 会将 .shadowstudio 文件下载到设备。以后可用 Open Project 重新打开。本地自动保存仅用于浏览器中的临时恢复。"
  },
  "ja": {
    "openProject": "プロジェクトを開く",
    "importImage": "画像をキャンバスとして読み込む",
    "resume": "作業を続ける",
    "checking": "ローカルの自動保存データを確認中...",
    "localRecovery": "ローカル復元",
    "recoverHeading": "前回の作業を復元",
    "recoveryDescription": "キャンバス {{count}} 件 · {{time}} に自動保存。ほかのプロジェクトを作成または開く前に復元してください。",
    "restoring": "復元中...",
    "restore": "作業を復元",
    "discard": "復元データを破棄",
    "projectFiles": "プロジェクトファイル",
    "projectInfo": "Save Project で .shadowstudio ファイルをデバイスにダウンロードできます。あとで Open Project から開けます。ローカル自動保存はブラウザでの一時的な復元用です。"
  },
  "ko": {
    "openProject": "프로젝트 열기",
    "importImage": "이미지를 캔버스로 가져오기",
    "resume": "작업 계속하기",
    "checking": "로컬 자동 저장 작업 확인 중...",
    "localRecovery": "로컬 복구",
    "recoverHeading": "마지막 작업 공간 복구",
    "recoveryDescription": "캔버스 {{count}}개 · {{time}}에 자동 저장됨. 다른 프로젝트를 만들거나 열기 전에 복구하세요.",
    "restoring": "복구 중...",
    "restore": "작업 공간 복구",
    "discard": "복구 데이터 삭제",
    "projectFiles": "프로젝트 파일",
    "projectInfo": "Save Project는 .shadowstudio 파일을 기기에 다운로드합니다. 나중에 Open Project로 다시 열 수 있습니다. 로컬 자동 저장은 브라우저의 임시 복구용입니다."
  }
})

export default function StudioHome({
  documents,
  documentLimit,
  recoveryBooting,
  recoveryEntry,
  recoveryBusy,
  projectBusy,
  paperLoading,
  newFileOpen,
  exportOpen,
  projectNotice,
  recoveryStatus,
  onNewFile,
  onOpenProject,
  onImportImage,
  onResume,
  onExit,
  onRecover,
  onDiscardRecovery,
  labels,
}) {
  const { t: tx } = useDisplayTranslation()
  const recoveryPending = recoveryBooting || Boolean(recoveryEntry) || recoveryBusy
  const busy = projectBusy || paperLoading || newFileOpen || exportOpen
  const canOpen = !recoveryPending && !busy
  const canNew = canOpen && documents.length < documentLimit
  const canImport = canNew
  const canResume = canOpen && documents.length > 0

  return (
    <>
      <style>{`
        .ss-recovery-card{border:1px solid #80a9cf;border-radius:12px;background:#2c3843;padding:18px;margin:20px 0;color:#e9f3ff}
        .ss-recovery-card h2{margin:0 0 7px;font-size:16px;font-weight:800}
        .ss-recovery-card p{margin:0 0 12px;font-size:11px;line-height:1.5;color:#c2d1df}
        .ss-recovery-actions{display:flex;flex-wrap:wrap;gap:8px}
        .ss-home-link:disabled{opacity:.45;cursor:default}
        .ss-home{min-height:calc(100vh - 34px);display:grid;grid-template-columns:180px minmax(0,1fr);background:#1e2023}
        .ss-home-side{border-right:1px solid #35393e;background:#25272a;padding:22px 18px}
        .ss-home-primary{width:100%;height:38px;border:0;border-radius:8px;background:#2d8cff;color:#fff;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .ss-home-link{width:100%;height:38px;margin-top:8px;border:1px solid #42474d;border-radius:8px;background:transparent;color:#eef0f3;font:inherit;font-size:12px;font-weight:700;cursor:pointer}
        .ss-home-main{padding:42px clamp(24px,5vw,72px)}
        .ss-home-main h1{margin:0;font-size:29px;font-weight:700}
        .ss-home-main>p{margin:7px 0 0;color:#aab0b7;font-size:13px}
        .ss-preset-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:28px}
        .ss-preset-card{min-height:112px;border:1px solid #3b4046;border-radius:10px;background:#292c30;color:#fff;padding:16px;text-align:left;cursor:pointer}
        .ss-preset-card:hover:not(:disabled){border-color:#5a93d6;background:#30343a}
        .ss-home-primary:disabled,.ss-preset-card:disabled{opacity:.45;cursor:default}
        .ss-preset-card strong{display:block;font-size:13px}
        .ss-preset-card span{display:block;margin-top:8px;color:#9fa6ae;font-size:10px;line-height:1.5}
        .ss-recent{margin-top:36px}
        .ss-recent h2{margin:0 0 12px;font-size:15px}
        .ss-empty{border:1px dashed #41464c;border-radius:12px;background:#24272a;padding:22px;color:#8f969e;font-size:12px}
      `}</style>
      <main className="ss-home">
        <aside className="ss-home-side">
          <button type="button" className="ss-home-primary" disabled={!canNew} onClick={() => onNewFile('basic')}>
            + {labels.newPaper}
          </button>
          <button type="button" className="ss-home-link" disabled={!canOpen} onClick={onOpenProject}>{tx('studioHome.openProject')}</button>
          <button type="button" className="ss-home-link" disabled={!canImport} onClick={onImportImage}>{tx('studioHome.importImage')}</button>
          {documents.length > 0 ? (
            <button type="button" className="ss-home-link" disabled={!canResume} onClick={onResume}>{tx('studioHome.resume')}</button>
          ) : null}
          <button type="button" className="ss-home-link" onClick={onExit}>
            {labels.back}
          </button>
        </aside>
        <section className="ss-home-main">
          <h1>{labels.welcomeTitle}</h1>
          <p>{labels.welcomeText}</p>
          <div className="ss-preset-grid">
            {STUDIO_PRESETS.filter((preset) => preset.id !== 'custom').map((preset) => (
              <button
                type="button"
                key={preset.id}
                className="ss-preset-card"
                disabled={!canNew}
                onClick={() => onNewFile(preset.id)}
              >
                <strong>{preset.label}</strong>
                <span>{preset.width} × {preset.height} px<br />{preset.resolution} PPI</span>
              </button>
            ))}
          </div>
          {recoveryBooting ? (
            <div className="ss-project-message" role="status">{tx('studioHome.checking')}</div>
          ) : null}
          {recoveryEntry ? (
            <section className="ss-recovery-card" aria-label={tx('studioHome.localRecovery')}>
              <h2>{tx('studioHome.recoverHeading')}</h2>
              <p>
                {tx('studioHome.recoveryDescription', { count: recoveryEntry.documents.length, time: new Date(recoveryEntry.savedAt).toLocaleString() })}
              </p>
              <div className="ss-recovery-actions">
                <button type="button" className="ss-btn primary" disabled={recoveryBusy} onClick={onRecover}>
                  {recoveryBusy ? tx('studioHome.restoring') : tx('studioHome.restore')}
                </button>
                <button type="button" className="ss-btn" disabled={recoveryBusy} onClick={onDiscardRecovery}>{tx('studioHome.discard')}</button>
              </div>
            </section>
          ) : null}
          <section className="ss-recent">
            <h2>{tx('studioHome.projectFiles')}</h2>
            <div className="ss-empty">{tx('studioHome.projectInfo')}</div>
            {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}
            {recoveryStatus ? <div className="ss-project-message" role="status">{recoveryStatus}</div> : null}
          </section>
        </section>
      </main>
    </>
  )
}
