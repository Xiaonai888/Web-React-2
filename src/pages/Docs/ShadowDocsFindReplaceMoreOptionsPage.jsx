import SmartFindReplacePanel from '../../components/Author/SmartFindReplacePanel'

const LIGHT_THEME = {
  '--shadow-bg-page': '#ffffff',
  '--shadow-bg-surface': '#ffffff',
  '--shadow-bg-elevated': '#ffffff',
  '--shadow-bg-soft': '#f8f9fb',
  '--shadow-input-bg': '#ffffff',
  '--shadow-text-primary': '#111827',
  '--shadow-text-secondary': '#667085',
  '--shadow-text-tertiary': '#98a2b3',
  '--shadow-border': '#e7eaf0',
  '--shadow-border-strong': '#d0d5dd',
}

export default function ShadowDocsFindReplaceMoreOptionsPage({
  open = false,
  editorRef,
  onBack,
  onChange,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[20000] bg-white" style={LIGHT_THEME}>
      <SmartFindReplacePanel
        open={open}
        editorRef={editorRef}
        onClose={onBack}
        onChange={onChange}
      />
    </div>
  )
}
