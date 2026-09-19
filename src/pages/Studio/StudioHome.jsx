import { STUDIO_PRESETS } from './StudioNewFileDialog'

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
          <button type="button" className="ss-home-link" disabled={!canOpen} onClick={onOpenProject}>
            Open Project
          </button>
          <button type="button" className="ss-home-link" disabled={!canImport} onClick={onImportImage}>
            Import Image as Paper
          </button>
          {documents.length > 0 ? (
            <button type="button" className="ss-home-link" disabled={!canResume} onClick={onResume}>
              Continue Workspace
            </button>
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
            <div className="ss-project-message" role="status">Checking for locally autosaved work...</div>
          ) : null}
          {recoveryEntry ? (
            <section className="ss-recovery-card" aria-label="Local recovery">
              <h2>Recover your last workspace</h2>
              <p>
                {recoveryEntry.documents.length} paper(s) · Autosaved{' '}
                {new Date(recoveryEntry.savedAt).toLocaleString()}. Restore them before creating or opening another project.
              </p>
              <div className="ss-recovery-actions">
                <button type="button" className="ss-btn primary" disabled={recoveryBusy} onClick={onRecover}>
                  {recoveryBusy ? 'Restoring...' : 'Restore Workspace'}
                </button>
                <button type="button" className="ss-btn" disabled={recoveryBusy} onClick={onDiscardRecovery}>
                  Discard Recovery
                </button>
              </div>
            </section>
          ) : null}
          <section className="ss-recent">
            <h2>Project files</h2>
            <div className="ss-empty">
              Save Project downloads a .shadowstudio file to your device. Open Project reopens it later. Local autosave is only a temporary browser recovery copy.
            </div>
            {projectNotice ? <div className="ss-project-message" role="status">{projectNotice}</div> : null}
            {recoveryStatus ? <div className="ss-project-message" role="status">{recoveryStatus}</div> : null}
          </section>
        </section>
      </main>
    </>
  )
}
