import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Copy, FileText, Mail, MessageCircle, Send, Share2, X } from 'lucide-react'

const SOCIALS = [
  { id: 'mail', label: 'Mail', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'messenger', label: 'Messenger', icon: MessageCircle },
  { id: 'telegram', label: 'Telegram', icon: Send },
  { id: 'facebook', label: 'Facebook', icon: Share2 },
  { id: 'x', label: 'X', icon: Share2 },
]

const EXPIRATIONS = [
  { id: 'custom', label: 'Customized' },
  { id: 'permanent', label: 'Permanent' },
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
]

export default function ShadowDocsShareSheet({
  open = false,
  documentName = 'Docs.doc',
  wordCount = 0,
  onClose,
  onCopyLink,
  onShareFile,
  onSocialShare,
  onSettingsChange,
}) {
  const [screen, setScreen] = useState('share')
  const [permission, setPermission] = useState('view')
  const [expiration, setExpiration] = useState('30')
  const [customDate, setCustomDate] = useState('')

  useEffect(() => {
    if (!open) setScreen('share')
  }, [open])

  const validityText = useMemo(() => {
    if (expiration === 'permanent') return 'Permanent'
    if (expiration === 'custom' && customDate) return `Valid until ${customDate}`
    if (expiration === '7') return 'Valid for 7 days'
    return 'Valid for 30 days'
  }, [expiration, customDate])

  const permissionText = permission === 'edit' ? 'Anyone Can Edit' : 'Anyone Can View'

  function settingsPayload() {
    return { permission, expiration, customDate: expiration === 'custom' ? customDate : '' }
  }

  function finishSettings() {
    onSettingsChange?.(settingsPayload())
    setScreen('share')
  }

  if (!open) return null

  return <div className="sd-share-root">
    <style>{`
      .sd-share-root{
        position:fixed;
        inset:0;
        z-index:18000;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background:rgba(0,0,0,.18);
        color:#f2f2f3;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-share-root *{box-sizing:border-box}
      .sd-share-sheet{
        width:min(100%,620px);
        max-height:86dvh;
        overflow:hidden;
        border:1px solid #2c2d33;
        border-bottom:0;
        border-radius:20px 20px 0 0;
        background:#161719
      }
      .sd-share-handle{
        width:44px;
        height:4px;
        margin:8px auto 4px;
        border-radius:99px;
        background:#303136
      }
      .sd-share-head{
        min-height:58px;
        display:grid;
        grid-template-columns:42px 1fr 42px;
        align-items:center;
        padding:0 14px
      }
      .sd-share-head strong{
        text-align:center;
        font-size:18px;
        font-weight:750
      }
      .sd-share-icon-button{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#ededee
      }
      .sd-share-validity{
        width:100%;
        min-height:54px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        border:0;
        border-top:1px solid #222329;
        border-bottom:1px solid #222329;
        background:transparent;
        color:#ededee;
        padding:0 22px;
        text-align:left
      }
      .sd-share-validity span:first-child{font-size:14px}
      .sd-share-validity span:last-child{
        display:flex;
        align-items:center;
        gap:5px;
        color:#85868d;
        font-size:12px
      }
      .sd-share-socials{
        display:flex;
        gap:20px;
        overflow-x:auto;
        padding:18px 20px 20px;
        scrollbar-width:none;
        overscroll-behavior-x:contain
      }
      .sd-share-socials::-webkit-scrollbar{display:none}
      .sd-share-social{
        width:68px;
        flex:0 0 68px;
        border:0;
        background:transparent;
        color:#d9d9dd;
        text-align:center
      }
      .sd-share-social-circle{
        width:48px;
        height:48px;
        margin:0 auto 8px;
        display:grid;
        place-items:center;
        border-radius:50%;
        background:#2b2c31;
        color:#fff
      }
      .sd-share-social-circle svg{
        width:22px;
        height:22px
      }
      .sd-share-social span:last-child{
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:11px
      }
      .sd-share-actions{
        margin:0 16px calc(18px + env(safe-area-inset-bottom));
        overflow:hidden;
        border-radius:14px;
        background:#202126
      }
      .sd-share-action{
        width:100%;
        min-height:66px;
        display:flex;
        align-items:center;
        gap:14px;
        border:0;
        border-bottom:1px solid #303137;
        background:transparent;
        color:#eeeeef;
        padding:0 20px;
        text-align:left
      }
      .sd-share-action:last-child{border-bottom:0}
      .sd-share-action svg{
        width:24px;
        height:24px;
        color:#d7d7da
      }
      .sd-share-action span{font-size:16px}
      .sd-share-settings{
        position:fixed;
        inset:0;
        z-index:18100;
        overflow-y:auto;
        background:#161719;
        color:#f2f2f3
      }
      .sd-share-settings-head{
        height:66px;
        display:grid;
        grid-template-columns:42px 1fr 42px;
        align-items:center;
        padding:env(safe-area-inset-top) 16px 0
      }
      .sd-share-settings-head strong{
        text-align:center;
        font-size:18px;
        font-weight:750
      }
      .sd-share-document{
        margin:14px 18px 28px;
        display:grid;
        grid-template-columns:44px minmax(0,1fr);
        gap:12px;
        align-items:center;
        border-radius:14px;
        background:#252628;
        padding:14px
      }
      .sd-share-document-logo{
        width:44px;
        height:44px;
        display:grid;
        place-items:center;
        border-radius:8px;
        background:#2875ee;
        color:#fff;
        font-size:24px;
        font-weight:900
      }
      .sd-share-document strong{
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:16px;
        font-weight:500
      }
      .sd-share-document small{
        display:block;
        margin-top:3px;
        color:#8d8e94;
        font-size:11px
      }
      .sd-share-settings-body{
        width:min(100%,620px);
        margin:0 auto;
        padding:0 18px calc(92px + env(safe-area-inset-bottom))
      }
      .sd-share-section-title{
        margin:22px 4px 12px;
        font-size:16px;
        font-weight:500
      }
      .sd-share-choice-card{
        overflow:hidden;
        border-radius:14px;
        background:#202126
      }
      .sd-share-choice{
        width:100%;
        min-height:72px;
        display:grid;
        grid-template-columns:28px minmax(0,1fr);
        gap:12px;
        align-items:flex-start;
        border:0;
        border-bottom:1px solid #303137;
        background:transparent;
        color:#eeeeef;
        padding:15px 18px;
        text-align:left
      }
      .sd-share-choice:last-child{border-bottom:0}
      .sd-share-radio{
        width:22px;
        height:22px;
        display:grid;
        place-items:center;
        border:2px solid #575960;
        border-radius:50%
      }
      .sd-share-radio::after{
        content:'';
        width:10px;
        height:10px;
        border-radius:50%;
        background:transparent
      }
      .sd-share-choice.is-selected .sd-share-radio,
      .sd-share-expiration-row.is-selected .sd-share-radio{
        border-color:#25a884
      }
      .sd-share-choice.is-selected .sd-share-radio::after,
      .sd-share-expiration-row.is-selected .sd-share-radio::after{
        background:#25a884
      }
      .sd-share-choice strong{
        display:block;
        font-size:15px;
        font-weight:500
      }
      .sd-share-choice small{
        display:block;
        margin-top:5px;
        color:#878990;
        font-size:11px;
        line-height:1.4
      }
      .sd-share-expiration-row{
        width:100%;
        min-height:62px;
        display:grid;
        grid-template-columns:28px minmax(0,1fr) auto;
        gap:12px;
        align-items:center;
        border:0;
        border-bottom:1px solid #303137;
        background:transparent;
        color:#eeeeef;
        padding:0 18px;
        text-align:left
      }
      .sd-share-expiration-row:last-child{border-bottom:0}
      .sd-share-expiration-row strong{
        font-size:15px;
        font-weight:500
      }
      .sd-share-expiration-row input{
        width:132px;
        height:36px;
        border:1px solid #3a3b41;
        border-radius:8px;
        outline:0;
        background:#18191d;
        color:#eee;
        padding:0 8px
      }
      .sd-share-done{
        position:fixed;
        left:18px;
        right:18px;
        bottom:max(18px,env(safe-area-inset-bottom));
        height:54px;
        border:0;
        border-radius:9px;
        background:#25a884;
        color:#fff;
        font-size:17px;
        font-weight:700
      }
    `}</style>

    {screen === 'share' ? <section className="sd-share-sheet" role="dialog" aria-modal="true" aria-label="Share and Send">
      <div className="sd-share-handle" aria-hidden="true" />
      <header className="sd-share-head">
        <span />
        <strong>Share & Send</strong>
        <button type="button" className="sd-share-icon-button" aria-label="Close share" onClick={onClose}><X /></button>
      </header>

      <button type="button" className="sd-share-validity" onClick={() => setScreen('settings')}>
        <span>Share via Link</span>
        <span>{validityText}<ChevronRight size={17} /></span>
      </button>

      <div className="sd-share-socials" aria-label="Share apps">
        {SOCIALS.map(item => {
          const Icon = item.icon
          return <button type="button" key={item.id} className="sd-share-social" onClick={() => onSocialShare?.(item.id, settingsPayload())}>
            <span className="sd-share-social-circle"><Icon /></span>
            <span>{item.label}</span>
          </button>
        })}
      </div>

      <div className="sd-share-actions">
        <button type="button" className="sd-share-action" onClick={() => onCopyLink?.(settingsPayload())}>
          <Copy />
          <span>Copy Link</span>
        </button>
        <button type="button" className="sd-share-action" onClick={() => onShareFile?.(settingsPayload())}>
          <FileText />
          <span>Share as File</span>
        </button>
      </div>
    </section> : <section className="sd-share-settings" role="dialog" aria-modal="true" aria-label="Sharing Settings">
      <header className="sd-share-settings-head">
        <button type="button" className="sd-share-icon-button" aria-label="Back to share" onClick={() => setScreen('share')}><ChevronLeft /></button>
        <strong>Sharing Settings</strong>
        <span />
      </header>

      <div className="sd-share-document">
        <div className="sd-share-document-logo" aria-hidden="true">W</div>
        <div>
          <strong>{documentName || 'Docs.doc'}</strong>
          <small>{Number(wordCount || 0).toLocaleString()} words · {permissionText}</small>
        </div>
      </div>

      <div className="sd-share-settings-body">
        <h3 className="sd-share-section-title">Collaboration Permission</h3>
        <div className="sd-share-choice-card">
          <button type="button" className={`sd-share-choice ${permission === 'view' ? 'is-selected' : ''}`} onClick={() => setPermission('view')}>
            <span className="sd-share-radio" />
            <span><strong>Can View</strong><small>Anyone with the link can view. Editing is disabled.</small></span>
          </button>
          <button type="button" className={`sd-share-choice ${permission === 'edit' ? 'is-selected' : ''}`} onClick={() => setPermission('edit')}>
            <span className="sd-share-radio" />
            <span><strong>Can Edit</strong><small>People with the link can edit when collaboration support is connected.</small></span>
          </button>
        </div>

        <h3 className="sd-share-section-title">Link Expiration</h3>
        <div className="sd-share-choice-card">
          {EXPIRATIONS.map(item => <button
            type="button"
            key={item.id}
            className={`sd-share-expiration-row ${expiration === item.id ? 'is-selected' : ''}`}
            onClick={() => setExpiration(item.id)}
          >
            <span className="sd-share-radio" />
            <strong>{item.label}</strong>
            {item.id === 'custom' && expiration === 'custom'
              ? <input type="date" value={customDate} onClick={event => event.stopPropagation()} onChange={event => setCustomDate(event.target.value)} />
              : <span />}
          </button>)}
        </div>
      </div>

      <button type="button" className="sd-share-done" onClick={finishSettings}>Done</button>
    </section>}
  </div>
}
