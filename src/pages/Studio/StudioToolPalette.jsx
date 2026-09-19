const GROUPS = [
  { label: 'Navigation & selection', tools: [
    { id: 'move', label: 'Move', icon: 'fa-arrows-up-down-left-right' },
    { id: 'transform', label: 'Transform', icon: 'fa-up-down-left-right' },
    { id: 'marquee', label: 'Rectangle Select', icon: 'fa-vector-square' },
    { id: 'lasso', label: 'Lasso', icon: 'fa-draw-polygon' },
    { id: 'wand', label: 'Magic Wand', icon: 'fa-wand-magic-sparkles' },
    { id: 'crop', label: 'Crop', icon: 'fa-crop-simple' },
  ] },
  { label: 'Drawing & painting', tools: [
    { id: 'brush', label: 'Brush', icon: 'fa-paintbrush' },
    { id: 'pencil', label: 'Pencil', icon: 'fa-pencil' },
    { id: 'eraser', label: 'Eraser', icon: 'fa-eraser' },
    { id: 'fill', label: 'Paint Bucket', icon: 'fa-fill-drip' },
    { id: 'gradient', label: 'Gradient', icon: 'fa-palette' },
    { id: 'eyedropper', label: 'Eyedropper', icon: 'fa-eye-dropper' },
    { id: 'smudge', label: 'Smudge', icon: 'fa-hand-pointer' },
    { id: 'blur', label: 'Blur', icon: 'fa-droplet' },
  ] },
  { label: 'Comics & design', tools: [
    { id: 'text', label: 'Text', icon: 'fa-font' },
    { id: 'shape', label: 'Shapes', icon: 'fa-shapes' },
    { id: 'frame', label: 'Comic Frames', icon: 'fa-table-cells-large' },
    { id: 'balloon', label: 'Speech Balloons', icon: 'fa-comment' },
    { id: 'ruler', label: 'Ruler', icon: 'fa-ruler' },
    { id: 'perspective', label: 'Perspective', icon: 'fa-border-all' },
  ] },
]

const AVAILABLE = new Set(['brush', 'eraser', 'eyedropper'])

export default function StudioToolPalette({ tool, onToolChange, labels = {} }) {
  return (
    <aside className="ss-tools ss-tool-palette" aria-label="Drawing tools">
      <style>{`
        .shadow-studio .ss-tool-palette .ss-palette-group{display:flex;flex:0 0 auto;gap:4px;align-items:center}
        .shadow-studio .ss-tool-palette .ss-palette-group+.ss-palette-group{border-left:1px solid #495563;padding-left:6px}
        .shadow-studio .ss-tool-palette .ss-palette-tool{flex:0 0 40px;width:40px;min-width:40px;min-height:44px;height:44px;gap:3px;padding:3px;border-radius:5px}
        .shadow-studio .ss-tool-palette .ss-palette-tool i{font-size:15px}
        .shadow-studio .ss-tool-palette .ss-palette-tool span{display:none}
        .shadow-studio .ss-tool-palette .ss-palette-tool:disabled{cursor:not-allowed;opacity:.42;filter:grayscale(.8)}
        .shadow-studio .ss-tool-palette .ss-palette-tool:focus-visible{outline:2px solid #8bc4ff;outline-offset:-2px}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-left-workspace>.ss-tool-palette{padding:9px 4px 60px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-group{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;justify-items:center;padding:0 0 9px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-group+.ss-palette-group{padding-top:9px;border-left:0;border-top:1px solid #495563}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-tool{width:32px;min-width:0;height:37px;min-height:37px;margin:0;padding:4px 2px}
          .shadow-studio:has(.ss-layout) .ss-tool-palette .ss-palette-tool i{font-size:15px}
        }
      `}</style>
      {GROUPS.map((group) => (
        <div key={group.label} className="ss-palette-group" role="group" aria-label={group.label}>
          {group.tools.map((item) => {
            const enabled = AVAILABLE.has(item.id)
            const label = labels[item.id] || item.label
            return (
              <button
                key={item.id}
                type="button"
                className={`ss-tool ss-palette-tool ${tool === item.id ? 'active' : ''}`}
                aria-label={`${label}${enabled ? '' : ' (not available yet)'}`}
                aria-pressed={enabled ? tool === item.id : undefined}
                title={`${label}${enabled ? '' : ' — coming in a later stage'}`}
                disabled={!enabled}
                onClick={() => onToolChange(item.id)}
              >
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
