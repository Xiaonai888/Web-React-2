let activeTask = null

const STYLE_ID = 'shadow-docs-pdf-export-task-style'

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .sd-pdf-task-layer{position:fixed;inset:0;z-index:30000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.52);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .sd-pdf-task-card{position:relative;width:min(100%,360px);padding:26px 24px 24px;border:1px solid #e6e8ec;border-radius:20px;background:#fff;color:#131722;box-shadow:0 22px 70px rgba(0,0,0,.28);text-align:center}
    .sd-pdf-task-close{position:absolute;top:12px;right:12px;width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:50%;background:#f1f3f6;color:#48505e;font:inherit;font-size:22px;line-height:1}
    .sd-pdf-task-icon{width:54px;height:54px;display:grid;place-items:center;margin:0 auto 13px;border-radius:15px;background:#fff0f3;color:#e8294f;font-size:16px;font-weight:900;box-shadow:inset 0 0 0 1px #ffdce4}
    .sd-pdf-task-title{margin:0;font-size:21px;font-weight:800;letter-spacing:-.02em}
    .sd-pdf-task-file{max-width:100%;margin:6px auto 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#747b88;font-size:12px}
    .sd-pdf-task-percent{margin-top:22px;color:#2f7df6;font-size:38px;font-weight:850;line-height:1}
    .sd-pdf-task-track{height:8px;margin-top:15px;overflow:hidden;border-radius:999px;background:#e7eaf0}
    .sd-pdf-task-fill{width:0;height:100%;border-radius:999px;background:#2f7df6;transition:width .12s linear}
    .sd-pdf-task-status{min-height:18px;margin:12px 0 0;color:#646b78;font-size:12px;font-weight:600}
    .sd-pdf-ready-toast{position:fixed;z-index:31000;left:50%;bottom:calc(22px + env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;align-items:center;gap:10px;min-width:220px;max-width:calc(100vw - 32px);padding:12px 14px;border:1px solid #35383e;border-radius:12px;background:#202124;color:#fff;box-shadow:0 12px 34px rgba(0,0,0,.34);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .sd-pdf-ready-dot{width:26px;height:26px;display:grid;place-items:center;flex:none;border-radius:50%;background:#25a884;color:#fff;font-size:14px;font-weight:900}
    .sd-pdf-ready-copy{min-width:0}
    .sd-pdf-ready-copy strong{display:block;font-size:12px}
    .sd-pdf-ready-copy small{display:block;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#a6a8ae;font-size:9px}
    @media(max-width:480px){.sd-pdf-task-card{width:min(100%,320px);padding:24px 20px 22px}.sd-pdf-task-percent{font-size:34px}}
  `
  document.head.appendChild(style)
}

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

function showReadyToast(fileName, failed = false) {
  ensureStyles()
  document.querySelectorAll('.sd-pdf-ready-toast').forEach(node => node.remove())
  const toast = document.createElement('div')
  toast.className = 'sd-pdf-ready-toast'
  toast.innerHTML = `
    <span class="sd-pdf-ready-dot">${failed ? '!' : '✓'}</span>
    <span class="sd-pdf-ready-copy">
      <strong>${failed ? 'PDF export failed' : 'PDF ready'}</strong>
      <small></small>
    </span>
  `
  if (failed) toast.querySelector('.sd-pdf-ready-dot').style.background = '#d84b55'
  toast.querySelector('small').textContent = failed ? 'Try Export as PDF again.' : `${fileName} is ready to save.`
  document.body.appendChild(toast)
  const timer = window.setTimeout(() => toast.remove(), failed ? 5000 : 4200)
  toast.addEventListener('click', () => {
    window.clearTimeout(timer)
    toast.remove()
  }, { once: true })
}

function createTaskUI(fileName) {
  ensureStyles()
  const layer = document.createElement('div')
  layer.className = 'sd-pdf-task-layer'
  layer.setAttribute('role', 'status')
  layer.setAttribute('aria-live', 'polite')
  layer.innerHTML = `
    <div class="sd-pdf-task-card">
      <button type="button" class="sd-pdf-task-close" aria-label="Hide export progress">×</button>
      <div class="sd-pdf-task-icon">PDF</div>
      <h2 class="sd-pdf-task-title">Export to PDF</h2>
      <div class="sd-pdf-task-file"></div>
      <div class="sd-pdf-task-percent">0%</div>
      <div class="sd-pdf-task-track"><div class="sd-pdf-task-fill"></div></div>
      <p class="sd-pdf-task-status">Preparing document…</p>
    </div>
  `
  layer.querySelector('.sd-pdf-task-file').textContent = fileName
  document.body.appendChild(layer)

  const percent = layer.querySelector('.sd-pdf-task-percent')
  const fill = layer.querySelector('.sd-pdf-task-fill')
  const status = layer.querySelector('.sd-pdf-task-status')

  return {
    layer,
    update(value, label) {
      const progress = Math.max(0, Math.min(100, Math.round(value)))
      percent.textContent = `${progress}%`
      fill.style.width = `${progress}%`
      status.textContent = label
    },
    hide() {
      layer.style.display = 'none'
    },
    show() {
      layer.style.display = 'grid'
    },
    remove() {
      layer.remove()
    },
  }
}

async function animateStage(ui, from, to, duration, label) {
  ui.update(from, label)
  const started = performance.now()
  while (true) {
    const elapsed = performance.now() - started
    const ratio = Math.min(1, elapsed / duration)
    const value = from + (to - from) * ratio
    ui.update(value, label)
    if (ratio >= 1) break
    await wait(40)
  }
}

export function startShadowDocsPDFExportTask({
  fileName = 'Shadow Docs.pdf',
  onReady,
} = {}) {
  if (activeTask) {
    activeTask.ui.show()
    return activeTask.promise
  }

  const ui = createTaskUI(fileName)
  ui.layer.querySelector('.sd-pdf-task-close').addEventListener('click', () => ui.hide())

  const task = {
    ui,
    promise: null,
  }

  task.promise = (async () => {
    try {
      await animateStage(ui, 2, 22, 300, 'Preparing document…')
      await animateStage(ui, 22, 58, 520, 'Rendering pages…')
      await animateStage(ui, 58, 88, 480, 'Creating PDF file…')
      await animateStage(ui, 88, 97, 260, 'Finalizing…')
      await Promise.resolve(onReady?.())
      ui.update(100, 'Done')
      await wait(320)
      ui.remove()
      showReadyToast(fileName)
      return true
    } catch (error) {
      ui.remove()
      showReadyToast(fileName, true)
      throw error
    } finally {
      activeTask = null
    }
  })()

  activeTask = task
  return task.promise
}
