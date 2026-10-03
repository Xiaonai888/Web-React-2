import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, FileKey2, LockKeyhole, X } from 'lucide-react'

const ITERATIONS = 200000

function bytesToBase64(bytes) {
  let binary = ''
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, Math.min(index + chunk, bytes.length)))
  }
  return btoa(binary)
}

function safeName(value) {
  return String(value || 'Shadow Docs')
    .replace(/\.(?:doc|docx)$/i, '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
    .trim()
    .slice(0, 80) || 'Shadow Docs'
}

async function encryptBook(book, password) {
  if (!globalThis.crypto?.subtle) throw new Error('Encryption is unavailable in this browser.')
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const sourceKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    sourceKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt']
  )
  const plaintext = encoder.encode(JSON.stringify({
    format: 'shadow-docs',
    version: 1,
    book,
  }))
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    plaintext
  )
  return JSON.stringify({
    format: 'shadow-docs-encrypted',
    version: 1,
    algorithm: 'AES-GCM-256',
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encrypted)),
  })
}

export default function ShadowDocsEncryptSheet({
  open = false,
  book,
  documentName = 'Docs.doc',
  onClose,
  onEncrypted,
}) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setBusy(false)
      setError('')
    }
  }, [open])

  const strength = useMemo(() => {
    if (!password) return 0
    let score = password.length >= 8 ? 1 : 0
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return Math.min(4, score)
  }, [password])

  if (!open || !book) return null

  async function createEncryptedCopy() {
    setError('')
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      const encrypted = await encryptBook(book, password)
      const url = URL.createObjectURL(new Blob([encrypted], { type: 'application/octet-stream' }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${safeName(documentName)}.shadowdocs.enc`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 10000)
      onEncrypted?.()
      onClose?.()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not encrypt this document.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="sd-encrypt-backdrop">
    <style>{`
      .sd-encrypt-backdrop{
        position:fixed;
        inset:0;
        z-index:19500;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        background:rgba(0,0,0,.18)
      }
      .sd-encrypt-sheet{
        width:min(100%,560px);
        max-height:90dvh;
        overflow-y:auto;
        border:1px solid #303136;
        border-bottom:0;
        border-radius:20px 20px 0 0;
        background:#171719;
        color:#f3f3f4;
        font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
      }
      .sd-encrypt-sheet *{box-sizing:border-box}
      .sd-encrypt-handle{
        width:42px;
        height:4px;
        margin:8px auto 2px;
        border-radius:999px;
        background:#38393e
      }
      .sd-encrypt-head{
        min-height:58px;
        display:grid;
        grid-template-columns:42px minmax(0,1fr) 42px;
        align-items:center;
        padding:0 14px
      }
      .sd-encrypt-head strong{
        text-align:center;
        font-size:18px;
        font-weight:750
      }
      .sd-encrypt-close{
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:50%;
        background:transparent;
        color:#f0f0f1
      }
      .sd-encrypt-file{
        display:grid;
        grid-template-columns:44px minmax(0,1fr);
        align-items:center;
        gap:12px;
        margin:0 16px 14px;
        padding:12px;
        border-radius:12px;
        background:#232427
      }
      .sd-encrypt-file-icon{
        width:44px;
        height:44px;
        display:grid;
        place-items:center;
        border-radius:9px;
        background:#2c2d31;
        color:#65d7b7
      }
      .sd-encrypt-file strong{
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:14px
      }
      .sd-encrypt-file small{
        display:block;
        margin-top:4px;
        color:#85868d;
        font-size:10px
      }
      .sd-encrypt-card{
        margin:0 16px 14px;
        padding:14px;
        border:1px solid #303136;
        border-radius:13px;
        background:#232427
      }
      .sd-encrypt-label{
        display:block;
        margin-bottom:7px;
        color:#9a9ba1;
        font-size:11px;
        font-weight:650
      }
      .sd-encrypt-field{
        position:relative;
        margin-bottom:12px
      }
      .sd-encrypt-field:last-child{
        margin-bottom:0
      }
      .sd-encrypt-input{
        width:100%;
        height:46px;
        border:1px solid #3b3c42;
        border-radius:9px;
        outline:0;
        background:#1c1d20;
        color:#f3f3f4;
        padding:0 44px 0 12px;
        font:inherit;
        font-size:14px
      }
      .sd-encrypt-input:focus{
        border-color:#25a884
      }
      .sd-encrypt-eye{
        position:absolute;
        right:6px;
        bottom:4px;
        width:38px;
        height:38px;
        display:grid;
        place-items:center;
        border:0;
        border-radius:8px;
        background:transparent;
        color:#999aa0
      }
      .sd-encrypt-strength{
        display:flex;
        gap:5px;
        margin-top:8px
      }
      .sd-encrypt-strength span{
        height:3px;
        flex:1;
        border-radius:999px;
        background:#3d3e43
      }
      .sd-encrypt-strength span.is-active{
        background:#25a884
      }
      .sd-encrypt-note{
        margin:0 18px 13px;
        color:#85868d;
        font-size:10px;
        line-height:1.55
      }
      .sd-encrypt-error{
        margin:0 18px 10px;
        color:#ff9191;
        font-size:11px
      }
      .sd-encrypt-actions{
        padding:0 16px calc(14px + env(safe-area-inset-bottom))
      }
      .sd-encrypt-submit{
        width:100%;
        height:52px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        border:0;
        border-radius:10px;
        background:#25a884;
        color:#fff;
        font:inherit;
        font-size:15px;
        font-weight:750
      }
      .sd-encrypt-submit:disabled{
        opacity:.62
      }
    `}</style>

    <section className="sd-encrypt-sheet" role="dialog" aria-modal="true" aria-label="Encrypt Document">
      <div className="sd-encrypt-handle" aria-hidden="true" />
      <header className="sd-encrypt-head">
        <span />
        <strong>Encrypt Document</strong>
        <button type="button" className="sd-encrypt-close" aria-label="Close" onClick={onClose}>
          <X size={21} />
        </button>
      </header>

      <div className="sd-encrypt-file">
        <div className="sd-encrypt-file-icon"><FileKey2 size={22} /></div>
        <div>
          <strong>{documentName}</strong>
          <small>AES-256 encrypted copy</small>
        </div>
      </div>

      <div className="sd-encrypt-card">
        <div className="sd-encrypt-field">
          <label className="sd-encrypt-label" htmlFor="sd-encrypt-password">Password</label>
          <input
            id="sd-encrypt-password"
            className="sd-encrypt-input"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={event => {
              setPassword(event.target.value)
              setError('')
            }}
            placeholder="Enter password"
          />
          <button type="button" className="sd-encrypt-eye" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <div className="sd-encrypt-strength" aria-label={`Password strength ${strength} of 4`}>
            {[1, 2, 3, 4].map(item => <span key={item} className={strength >= item ? 'is-active' : ''} />)}
          </div>
        </div>

        <div className="sd-encrypt-field">
          <label className="sd-encrypt-label" htmlFor="sd-encrypt-confirm">Confirm Password</label>
          <input
            id="sd-encrypt-confirm"
            className="sd-encrypt-input"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={event => {
              setConfirmPassword(event.target.value)
              setError('')
            }}
            placeholder="Enter password again"
          />
        </div>
      </div>

      <p className="sd-encrypt-note">
        This creates a password-protected encrypted copy on your device. The current local document stays unchanged. Keep the password safe because it cannot be recovered.
      </p>

      {error ? <p className="sd-encrypt-error" role="alert">{error}</p> : null}

      <div className="sd-encrypt-actions">
        <button type="button" className="sd-encrypt-submit" disabled={busy} onClick={() => void createEncryptedCopy()}>
          <LockKeyhole size={18} />
          {busy ? 'Encrypting…' : 'Create Encrypted Copy'}
        </button>
      </div>
    </section>
  </div>
}
