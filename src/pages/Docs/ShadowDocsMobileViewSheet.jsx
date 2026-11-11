import { useEffect, useRef, useState } from 'react'
import {
  AlignCenter, AlignJustify, AlignLeft, Bookmark, BookmarkCheck,
  ChevronDown, ChevronRight, Eye, LockKeyhole, MoonStar,
  MoreHorizontal, Search, ShieldCheck, X,
} from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import {
  SHADOW_DOCS_READING_BACKGROUNDS,
  readShadowDocsReadingBookmarks,
  readShadowDocsReadingPreferences,
  removeShadowDocsReadingBookmark,
  saveShadowDocsReadingBookmark,
  saveShadowDocsReadingPreferences,
} from './ShadowDocsReadingPreferences'
import './ShadowDocsMobileViewTranslations'
import './ShadowDocsMobileViewSheet.css'

const NAV_TABS = ['home', 'insert', 'view', 'review']
const SPACINGS = [1.4, 1.65, 2]

function ViewSection({ label, children }) {
  return <section className="sd-view-section">
    <h3 className="sd-view-section-label">{label}</h3>
    {children}
  </section>
}

function ViewSwitch({ checked, label, onChange }) {
  return <button
    type="button"
    role="switch"
    aria-label={label}
    aria-checked={checked}
    className={`sd-view-switch ${checked ? 'is-on' : ''}`}
    onClick={() => onChange(!checked)}
  ><span /></button>
}

export default function ShadowDocsMobileViewSheet({
  open = false,
  bookId = '',
  chapterId = '',
  progress = 0,
  onClose,
  onTabChange,
  onFindReplace,
  onOutline,
  onPreferencesChange,
  onSeek,
  onLockChange,
  onReadModeChange,
  onBookmarkChange,
}) {
  const { t } = useDisplayTranslation()
  const [preferences, setPreferences] = useState(() => readShadowDocsReadingPreferences(bookId))
  const [isLocked, setIsLocked] = useState(false)
  const [expandedMode, setExpandedMode] = useState(false)
  const [position, setPosition] = useState(progress)
  const [bookmark, setBookmark] = useState(null)
  const colorRef = useRef(null)
  const changeHandler = useRef(onPreferencesChange)
  changeHandler.current = onPreferencesChange
  const text = key => t(`shadowDocsView.${key}`)

  useEffect(() => {
    const saved = readShadowDocsReadingPreferences(bookId)
    setPreferences(saved)
    if (open) changeHandler.current?.(saved)
  }, [bookId, open])

  useEffect(() => {
    setBookmark(readShadowDocsReadingBookmarks(bookId).find(item => item.chapterId === chapterId) || null)
  }, [bookId, chapterId, open])

  useEffect(() => { setPosition(Math.max(0, Math.min(100, Number(progress) || 0))) }, [progress])

  useEffect(() => {
    if (!open) return undefined
    const escape = event => { if (event.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open, onClose])

  if (!open) return null

  function update(patch) {
    const next = saveShadowDocsReadingPreferences(bookId, { ...preferences, ...patch })
    setPreferences(next)
    onPreferencesChange?.(next)
    if (Object.hasOwn(patch, 'readingMode')) onReadModeChange?.(next.readingMode)
  }

  function switchLock(next) {
    setIsLocked(next)
    onLockChange?.(next)
  }

  function activateBookmark() {
    if (!bookId || !chapterId) return
    if (bookmark) {
      const savedProgress = Math.max(0, Math.min(100, Number(bookmark.progress) || 0))
      setPosition(savedProgress)
      onSeek?.(savedProgress)
      onClose?.()
      return
    }
    const entry = saveShadowDocsReadingBookmark(bookId, chapterId, position)
    setBookmark(entry)
    onBookmarkChange?.(entry)
  }

  function deleteBookmark() {
    if (!bookId || !chapterId || !bookmark) return
    removeShadowDocsReadingBookmark(bookId, chapterId)
    setBookmark(null)
    onBookmarkChange?.(null)
  }

  return <div className="sd-view-layer">
    <button type="button" className="sd-view-dismiss" aria-label={text('close')} onClick={onClose} />
    <section className="sd-view-sheet" role="dialog" aria-modal="true" aria-label={text('view')}>
      <header className="sd-view-header">
        <nav className="sd-view-tabs" role="tablist" aria-label={text('view')}>
          {NAV_TABS.map(tab => <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === 'view'}
            className={tab === 'view' ? 'is-active' : ''}
            disabled={tab !== 'view' && typeof onTabChange !== 'function'}
            onClick={() => { if (tab !== 'view') onTabChange?.(tab) }}
          >{text(tab)}</button>)}
        </nav>
        <button type="button" className="sd-view-close" aria-label={text('close')} onClick={onClose}><X size={24} /></button>
      </header>

      <div className="sd-view-scroll">
        <div className="sd-view-tools">
          <button type="button" disabled={!onFindReplace} onClick={() => { onClose?.(); onFindReplace?.() }}>
            <Search size={28} /><span>{text('findReplace')}</span>
          </button>
          <button type="button" className={preferences.theme === 'night' ? 'is-active' : ''} aria-pressed={preferences.theme === 'night'} onClick={() => update({ theme: preferences.theme === 'night' ? 'normal' : 'night' })}>
            <MoonStar size={28} /><span>{text('night')}</span>
          </button>
          <button type="button" className={preferences.theme === 'eye' ? 'is-active' : ''} aria-pressed={preferences.theme === 'eye'} onClick={() => update({ theme: preferences.theme === 'eye' ? 'normal' : 'eye' })}>
            <Eye size={28} /><span>{text('eye')}</span>
          </button>
          <button type="button" className={isLocked ? 'is-active' : ''} aria-pressed={isLocked} onClick={() => switchLock(!isLocked)}>
            <LockKeyhole size={28} /><span>{text('lock')}</span>
          </button>
        </div>
        {isLocked && <p className="sd-view-note">{text('lockNote')}</p>}

        <ViewSection label={text('readingProgress')}>
          <div className="sd-view-progress">
            <input type="range" min="0" max="100" step="1" value={position} aria-label={text('seek')}
              onChange={event => { const next = Number(event.target.value); setPosition(next); onSeek?.(next) }}
              style={{ '--sd-range-progress': `${position}%` }} />
            <output>{Math.round(position)}%</output>
          </div>
        </ViewSection>

        <ViewSection label={text('background')}>
          <div className="sd-view-colors">
            {SHADOW_DOCS_READING_BACKGROUNDS.map((color, index) => <button
              key={color}
              type="button"
              title={index === 0 ? text('original') : color}
              aria-label={index === 0 ? text('original') : color}
              aria-pressed={preferences.background === color && preferences.theme === 'normal'}
              className={preferences.background === color && preferences.theme === 'normal' ? 'is-selected' : ''}
              onClick={() => update({ background: color, theme: 'normal' })}
            ><span className="sd-view-color" style={{ backgroundColor: color }}>{index === 0 ? '∅' : ''}</span></button>)}
            <button type="button" title={text('custom')} aria-label={text('custom')} onClick={() => colorRef.current?.click()}><MoreHorizontal size={24} /></button>
            <input ref={colorRef} type="color" aria-label={text('custom')} className="sd-view-color-input" value={preferences.background} onChange={event => update({ background: event.target.value, theme: 'normal' })} />
          </div>
        </ViewSection>

        <ViewSection label={text('fontSize')}>
          <div className="sd-view-font-size">
            <span>A<sup>−</sup></span>
            <input type="range" min="10" max="32" step="1" value={preferences.fontSize}
              aria-label={text('fontSize')} onChange={event => update({ fontSize: Number(event.target.value) })}
              style={{ '--sd-range-progress': `${(preferences.fontSize - 10) / 22 * 100}%` }} />
            <span>A<sup>+</sup></span>
          </div>
        </ViewSection>

        <ViewSection label={text('lineSpacing')}>
          <div className="sd-view-spacing" role="group" aria-label={text('lineSpacing')}>
            {SPACINGS.map((spacing, index) => {
              const Icon = [AlignLeft, AlignCenter, AlignJustify][index]
              return <button key={spacing} type="button" aria-label={`${text('lineSpacing')} ${spacing}`}
                aria-pressed={preferences.lineSpacing === spacing}
                className={preferences.lineSpacing === spacing ? 'is-active' : ''}
                onClick={() => update({ lineSpacing: spacing })}><Icon size={25} /></button>
            })}
          </div>
        </ViewSection>

        <ViewSection label={text('readingSettings')}>
          <div className="sd-view-list">
            <div className="sd-view-list-row">
              <span><ShieldCheck size={22} />{text('volumeButtons')}</span>
              <ViewSwitch checked={preferences.volumeButtons} label={text('volumeButtons')} onChange={volumeButtons => update({ volumeButtons })} />
            </div>
            {preferences.volumeButtons && <p className="sd-view-note sd-view-list-note">{text('volumeNote')}</p>}
            <button type="button" className="sd-view-list-row" aria-expanded={expandedMode} onClick={() => setExpandedMode(value => !value)}>
              <span><ChevronDown size={22} />{text('readingMode')}</span>
              <span className="sd-view-row-value">{text(preferences.readingMode)} <ChevronRight size={18} /></span>
            </button>
            {expandedMode && <div className="sd-view-mode-choices">
              {['vertical', 'paged'].map(mode => <button key={mode} type="button" className={preferences.readingMode === mode ? 'is-selected' : ''} aria-pressed={preferences.readingMode === mode} onClick={() => { update({ readingMode: mode }); setExpandedMode(false) }}>{text(mode)}</button>)}
            </div>}
          </div>
        </ViewSection>

        <ViewSection label={text('navigation')}>
          <div className="sd-view-list">
            <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #393939' }}>
              <button type="button" className="sd-view-list-row" disabled={!bookId || !chapterId} onClick={activateBookmark} style={{ flex: '1 1 auto', minWidth: 0, borderBottom: 0 }}>
                <span>{bookmark ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}{bookmark ? `${text('saved')} · ${Math.round(bookmark.progress)}%` : text('bookmark')}</span>
                <ChevronRight size={18} />
              </button>
              {bookmark && <button type="button" aria-label={text('removeBookmark')} title={text('removeBookmark')} onClick={deleteBookmark} style={{ display: 'grid', placeItems: 'center', flex: '0 0 48px', border: 0, background: 'transparent', color: '#bdbdbd' }}><X size={19} /></button>}
            </div>
            <button type="button" className="sd-view-list-row" disabled={!onOutline} onClick={() => { onClose?.(); onOutline?.() }}>
              <span><AlignLeft size={22} />{text('outline')}</span><ChevronRight size={18} />
            </button>
          </div>
        </ViewSection>
      </div>
    </section>
  </div>
}
