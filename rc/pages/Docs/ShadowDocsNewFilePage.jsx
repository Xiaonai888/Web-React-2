import { ArrowLeft, FilePlus2, Plus } from 'lucide-react'
import { SHADOW_DOCS_PAPER_GROUPS, getShadowDocsPaperSize } from './ShadowDocsPaperCatalog'

function PaperCard({ size, onCreate, ready }) {
  const [width, height] = getShadowDocsPaperSize(size)
  return (
    <button
      type="button"
      className="sd-new-paper-card"
      disabled={!ready || typeof onCreate !== 'function'}
      onClick={() => onCreate?.(size)}
    >
      <span className="sd-new-paper-preview" style={{ aspectRatio: `${width}/${height}` }}>
        <span>{size}</span>
      </span>
      <strong>{size}</strong>
      <small>{width} × {height} mm</small>
    </button>
  )
}

export default function ShadowDocsNewFilePage({ ready = true, onBack, onCreate }) {
  return (
    <section className="sd-new-file-page" aria-label="New file">
      <div className="sd-new-file-header">
        <button type="button" className="sd-new-back" onClick={onBack} aria-label="Back">
          <ArrowLeft size={21} />
        </button>
        <div>
          <h1>New File</h1>
          <p>Choose a blank page size and start writing immediately.</p>
        </div>
      </div>

      <section className="sd-new-section">
        <h2>Most Used</h2>
        <div className="sd-new-most-used">
          <button
            type="button"
            className="sd-new-blank-card"
            disabled={!ready || typeof onCreate !== 'function'}
            onClick={() => onCreate?.('A4')}
          >
            <span><Plus size={34} strokeWidth={1.8} /></span>
            <strong>Blank</strong>
            <small>A4 · 210 × 297 mm</small>
          </button>
        </div>
      </section>

      {SHADOW_DOCS_PAPER_GROUPS.map(group => (
        <section key={group.id} className="sd-new-section">
          <div className="sd-new-section-title">
            <div>
              <h2>{group.name}</h2>
              <p>Common {group.id}-series paper sizes</p>
            </div>
          </div>
          <div className="sd-new-paper-grid">
            {group.items.map(size => <PaperCard key={size} size={size} ready={ready} onCreate={onCreate} />)}
          </div>
        </section>
      ))}

      <div className="sd-new-file-note">
        <FilePlus2 size={17} />
        <span>The file opens immediately. You can name it when you save or leave the editor.</span>
      </div>
    </section>
  )
}
