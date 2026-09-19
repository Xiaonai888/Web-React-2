import { useState } from 'react'

const TABS = [
  { id: 'layers', label: 'Layers', icon: 'fa-layer-group' },
  { id: 'color', label: 'Color', icon: 'fa-palette' },
  { id: 'assets', label: 'Assets', icon: 'fa-shapes' },
  { id: 'view', label: 'View', icon: 'fa-magnifying-glass' },
]

export default function StudioRightPanels() {
  const [active, setActive] = useState('layers')

  return (
    <section className="ss-right-switcher" data-active={active} aria-label="Workspace panels">
      <style>{`
        .shadow-studio .ss-right-switcher{display:none}
        @media(min-width:1101px) and (min-height:651px){
          .shadow-studio:has(.ss-layout) .ss-side>.ss-right-switcher{display:block;order:-1;flex:0 0 auto;width:100%;min-width:0;border-bottom:1px solid #48535f}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-color-panel{order:0}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-section[aria-label='Canvas view']{order:1}
          .shadow-studio:has(.ss-layout) .ss-side>.ss-section:last-child{order:2}
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='color']))>.ss-color-panel{display:none}
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='view']))>.ss-section[aria-label='Canvas view'],
          .shadow-studio:has(.ss-layout) .ss-side:has(>.ss-right-switcher:not([data-active='view']))>.ss-section:last-child{display:none}
          .shadow-studio .ss-right-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2px;background:#212932;padding:5px 5px 0}
          .shadow-studio .ss-right-tab{display:flex;min-width:0;min-height:36px;align-items:center;justify-content:center;gap:5px;padding:5px 2px;border:1px solid transparent;border-bottom:2px solid transparent;border-radius:5px 5px 0 0;background:transparent;color:#aebac8;font:inherit;font-size:10px;font-weight:700;cursor:pointer}
          .shadow-studio .ss-right-tab i{font-size:12px}
          .shadow-studio .ss-right-tab:hover,.shadow-studio .ss-right-tab:focus-visible{color:#fff;background:#364657;outline:none}
          .shadow-studio .ss-right-tab[aria-pressed='true']{border-color:#4c5b6a;border-bottom-color:#80baff;background:#303e4b;color:#fff}
          .shadow-studio .ss-right-panel{padding:11px 10px 14px;color:#e5edf6;background:#29333d}
          .shadow-studio .ss-right-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:11px}
          .shadow-studio .ss-right-panel-head strong{font-size:11px;font-weight:800}
          .shadow-studio .ss-right-panel-head span{font-size:10px;color:#a6b7c8}
          .shadow-studio .ss-layer-options{display:grid;grid-template-columns:1fr 76px;gap:7px;margin-bottom:9px}
          .shadow-studio .ss-layer-options label{display:grid;gap:4px;color:#bac8d7;font-size:10px}
          .shadow-studio .ss-layer-options select,.shadow-studio .ss-layer-options input{width:100%;height:29px;border:1px solid #516171;border-radius:4px;background:#222c36;color:#e3eaf2;padding:0 7px;font:inherit;font-size:11px}
          .shadow-studio .ss-layer-options :disabled{opacity:.65;cursor:not-allowed}
          .shadow-studio .ss-layer-row{display:flex;align-items:center;gap:9px;min-height:55px;padding:6px;border:1px solid #5684b4;border-radius:5px;background:#344d65}
          .shadow-studio .ss-layer-thumb{display:grid;place-items:center;width:40px;height:38px;flex:none;border:1px solid #a5b3c1;border-radius:3px;background:linear-gradient(45deg,#cbd3da 25%,transparent 25%,transparent 75%,#cbd3da 75%),linear-gradient(45deg,#cbd3da 25%,#fff 25%,#fff 75%,#cbd3da 75%);background-size:12px 12px;background-position:0 0,6px 6px;color:#425367;font-size:15px}
          .shadow-studio .ss-layer-name{min-width:0;flex:1;display:grid;gap:3px}
          .shadow-studio .ss-layer-name strong{font-size:11px;font-weight:700}
          .shadow-studio .ss-layer-name small{font-size:9px;color:#b9ccdc}
          .shadow-studio .ss-panel-actions{display:flex;justify-content:flex-end;gap:5px;margin-top:10px;border-top:1px solid #455463;padding-top:9px}
          .shadow-studio .ss-panel-actions button{width:28px;height:27px;border:1px solid #4c5d6f;border-radius:4px;background:#344351;color:#9daebe;cursor:not-allowed}
          .shadow-studio .ss-panel-hint{margin:10px 0 0;color:#b2c0ce;font-size:10px;line-height:1.5}
          .shadow-studio .ss-asset-placeholder{display:grid;justify-items:center;gap:9px;padding:26px 9px;border:1px dashed #566779;border-radius:6px;color:#aabccd;text-align:center}
          .shadow-studio .ss-asset-placeholder i{font-size:24px;color:#8ca7c2}
          .shadow-studio .ss-asset-placeholder strong{font-size:11px;color:#dce6f0}
          .shadow-studio .ss-asset-placeholder p{margin:0;font-size:10px;line-height:1.6}
          .shadow-studio .ss-right-switcher+.ss-color-panel{min-width:0}
        }
      `}</style>
      <div className="ss-right-tabs" role="group" aria-label="Right panel tabs">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" className="ss-right-tab" aria-pressed={active === tab.id} onClick={() => setActive(tab.id)}>
            <i className={`fa-solid ${tab.icon}`} aria-hidden="true" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      {active === 'layers' ? (
        <div className="ss-right-panel" aria-label="Layers overview">
          <div className="ss-right-panel-head"><strong>Layers</strong><span>Canvas mode</span></div>
          <div className="ss-layer-options">
            <label>Blend mode<select disabled aria-label="Layer blend mode"><option>Normal</option></select></label>
            <label>Opacity<input disabled aria-label="Layer opacity" value="100%" readOnly /></label>
          </div>
          <div className="ss-layer-row">
            <div className="ss-layer-thumb"><i className="fa-regular fa-image" aria-hidden="true" /></div>
            <div className="ss-layer-name"><strong>Canvas bitmap</strong><small>Current paper · single canvas</small></div>
          </div>
          <div className="ss-panel-actions" aria-label="Future layer controls">
            <button type="button" disabled title="Add layer is available after the layer engine" aria-label="Add layer (not available yet)"><i className="fa-solid fa-plus" /></button>
            <button type="button" disabled title="Layer groups are not available yet" aria-label="Add layer group (not available yet)"><i className="fa-regular fa-folder" /></button>
            <button type="button" disabled title="Masks are not available yet" aria-label="Add mask (not available yet)"><i className="fa-regular fa-square" /></button>
            <button type="button" disabled title="Deleting layers requires the layer engine" aria-label="Delete layer (not available yet)"><i className="fa-regular fa-trash-can" /></button>
          </div>
          <p className="ss-panel-hint">The drawing is currently one canvas. Independent layers, masks and blend modes will be enabled with the layer engine.</p>
        </div>
      ) : null}
      {active === 'assets' ? (
        <div className="ss-right-panel" aria-label="Assets overview">
          <div className="ss-right-panel-head"><strong>Assets</strong><span>Library</span></div>
          <div className="ss-asset-placeholder"><i className="fa-solid fa-shapes" aria-hidden="true" /><strong>No assets in this workspace</strong><p>Asset importing and reusable manga resources will be added with the asset library.</p></div>
          <p className="ss-panel-hint">To import an image as a separate paper now, use File → Import Image as Paper.</p>
        </div>
      ) : null}
    </section>
  )
}
