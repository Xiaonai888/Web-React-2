import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Search, X } from 'lucide-react'
import { DEFAULT_CHAT_THEMES, normalizeChatTheme } from '../../services/chatStoryThemes'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

// Shared appearance UI for Chat Story, Reader Chat and Author Chat.
// This component is controlled: its parent owns loading/saving settings.
// Never write theme/font preferences here, so each chat context can stay isolated.
registerTranslationNamespace('sharedChatAppearance', {
  en: {
    theme: 'Chat Theme', fontStyle: 'Font Style', search: 'Search fonts',
    khmerFonts: 'Khmer Fonts', otherFonts: 'Other Fonts', noFonts: 'No fonts found',
    close: 'Close font list', selectFont: 'Choose font style', saveFailed: 'Could not save the theme.',
  },
  km: {
    theme: 'Theme ឆាត', fontStyle: 'រចនាប័ទ្ម Font', search: 'ស្វែងរក Font',
    khmerFonts: 'Font ខ្មែរ', otherFonts: 'Font ផ្សេងៗ', noFonts: 'រកមិនឃើញ Font',
    close: 'បិទបញ្ជី Font', selectFont: 'ជ្រើសរចនាប័ទ្ម Font', saveFailed: 'មិនអាចរក្សាទុក Theme បានទេ។',
  },
  zh: {
    theme: '聊天主题', fontStyle: '字体样式', search: '搜索字体',
    khmerFonts: '高棉文字体', otherFonts: '其他字体', noFonts: '未找到字体',
    close: '关闭字体列表', selectFont: '选择字体', saveFailed: '无法保存主题。',
  },
  ja: {
    theme: 'チャットテーマ', fontStyle: 'フォントスタイル', search: 'フォントを検索',
    khmerFonts: 'クメール語フォント', otherFonts: 'その他のフォント', noFonts: 'フォントが見つかりません',
    close: 'フォント一覧を閉じる', selectFont: 'フォントを選ぶ', saveFailed: 'テーマを保存できませんでした。',
  },
  ko: {
    theme: '채팅 테마', fontStyle: '글꼴 스타일', search: '글꼴 검색',
    khmerFonts: '크메르어 글꼴', otherFonts: '기타 글꼴', noFonts: '글꼴이 없습니다',
    close: '글꼴 목록 닫기', selectFont: '글꼴 선택', saveFailed: '테마를 저장할 수 없습니다.',
  },
})

// The same font keys/families currently used by ReaderPage.jsx.
// In the later wiring stage, ReaderPage can import this list instead of its local copy.
export const CHAT_FONT_OPTIONS = Object.freeze([
  { key: 'noto-sans-khmer', label: 'Noto Sans Khmer', group: 'Khmer Fonts', family: '"Noto Sans Khmer", "Khmer OS Content", system-ui, sans-serif' },
  { key: 'khmer-os-fasthand', label: 'Khmer OS Fasthand', group: 'Khmer Fonts', family: '"Khmer OS Fasthand", "Noto Sans Khmer", serif' },
  { key: 'khmer-os-content', label: 'Khmer OS Content', group: 'Khmer Fonts', family: '"Khmer OS Content", "Noto Sans Khmer", system-ui, sans-serif' },
  { key: 'khmer-os-battambang', label: 'Khmer OS Battambang', group: 'Khmer Fonts', family: '"Khmer OS Battambang", "Battambang", "Noto Sans Khmer", serif' },
  { key: 'battambang', label: 'Battambang', group: 'Khmer Fonts', family: '"Battambang", "Khmer OS Battambang", "Noto Sans Khmer", serif' },
  { key: 'kantumruy-pro', label: 'Kantumruy Pro', group: 'Khmer Fonts', family: '"Kantumruy Pro", "Noto Sans Khmer", system-ui, sans-serif' },
  { key: 'siemreap', label: 'Siemreap', group: 'Khmer Fonts', family: '"Siemreap", "Noto Sans Khmer", system-ui, sans-serif' },
  { key: 'hanuman', label: 'Hanuman', group: 'Khmer Fonts', family: '"Hanuman", "Noto Sans Khmer", serif' },
  { key: 'preahvihear', label: 'Preahvihear', group: 'Khmer Fonts', family: '"Preahvihear", "Noto Sans Khmer", system-ui, sans-serif' },
  { key: 'content', label: 'Content', group: 'Khmer Fonts', family: '"Content", "Khmer OS Content", "Noto Sans Khmer", serif' },
  { key: 'metal', label: 'Metal', group: 'Khmer Fonts', family: '"Metal", "Noto Sans Khmer", serif' },
  { key: 'moulpali', label: 'Moulpali', group: 'Khmer Fonts', family: '"Moulpali", "Noto Sans Khmer", serif' },
  { key: 'dangrek', label: 'Dangrek', group: 'Khmer Fonts', family: '"Dangrek", "Noto Sans Khmer", system-ui, sans-serif' },
  { key: 'system', label: 'System', group: 'Other Fonts', family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { key: 'sans-serif', label: 'Sans Serif', group: 'Other Fonts', family: 'Arial, Helvetica, system-ui, sans-serif' },
  { key: 'serif', label: 'Serif', group: 'Other Fonts', family: 'Georgia, "Times New Roman", serif' },
  { key: 'inter', label: 'Inter', group: 'Other Fonts', family: '"Inter", system-ui, sans-serif' },
  { key: 'roboto', label: 'Roboto', group: 'Other Fonts', family: '"Roboto", Arial, sans-serif' },
  { key: 'merriweather', label: 'Merriweather', group: 'Other Fonts', family: '"Merriweather", Georgia, serif' },
  { key: 'lora', label: 'Lora', group: 'Other Fonts', family: '"Lora", Georgia, serif' },
  { key: 'georgia', label: 'Georgia', group: 'Other Fonts', family: 'Georgia, serif' },
])

export const DEFAULT_CHAT_FONT_KEY = 'noto-sans-khmer'

export function getChatFontOption(fontKey) {
  return CHAT_FONT_OPTIONS.find((font) => font.key === fontKey) || CHAT_FONT_OPTIONS[0]
}

function FontPicker({ selectedFontKey, onSelect, onClose, darkMode }) {
  const { t } = useDisplayTranslation()
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Restore the exact original values; don't clear another modal's scroll lock.
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    const onEscape = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [onClose])

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase()
    return CHAT_FONT_OPTIONS.reduce((result, font) => {
      if (term && !`${font.label} ${font.group}`.toLowerCase().includes(term)) return result
      if (!result[font.group]) result[font.group] = []
      result[font.group].push(font)
      return result
    }, {})
  }, [search])

  const panel = darkMode ? 'bg-[#171b25] text-white' : 'bg-white text-[#111827]'
  const soft = darkMode ? 'bg-[#272d3a]' : 'bg-[#f4f4f5]'
  const muted = darkMode ? 'text-[#b9c0cf]' : 'text-[#686c76]'

  return (
    <div className="fixed inset-0 z-[190]" role="presentation"
  onTouchStart={(e) => e.stopPropagation()}
  onTouchMove={(e) => e.stopPropagation()}
  onTouchEnd={(e) => e.stopPropagation()}
  onMouseDown={(e) => e.stopPropagation()}
  onMouseMove={(e) => e.stopPropagation()}
  onMouseUp={(e) => e.stopPropagation()}>
      <button type="button" className="absolute inset-0 w-full bg-black/40" onClick={onClose}
        aria-label={t('sharedChatAppearance.close')} />
      <section role="dialog" aria-modal="true" aria-label={t('sharedChatAppearance.selectFont')}
        className={`absolute bottom-0 left-0 right-0 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-[26px] shadow-2xl md:bottom-auto md:left-auto md:right-5 md:top-20 md:w-[420px] md:rounded-[24px] ${panel}`}>
        <div className="flex shrink-0 items-center gap-2 px-4 pb-3 pt-4">
          <label className={`flex min-w-0 flex-1 items-center gap-2 rounded-full px-4 py-3 ${soft}`}>
            <Search size={17} className={muted} aria-hidden="true" />
            <input autoFocus type="search" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t('sharedChatAppearance.search')}
              className="min-w-0 flex-1 bg-transparent text-sm text-inherit outline-none placeholder:opacity-60" />
          </label>
          <button type="button" onClick={onClose} aria-label={t('sharedChatAppearance.close')}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${soft}`}><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(16px+env(safe-area-inset-bottom,0px))]">
          {Object.keys(groups).length ? Object.entries(groups).map(([group, fonts]) => (
            <section key={group} className="mb-5 last:mb-0">
              <h3 className={`mb-2 text-xs font-bold ${muted}`}>
                {t(group === 'Khmer Fonts' ? 'sharedChatAppearance.khmerFonts' : 'sharedChatAppearance.otherFonts')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {fonts.map((font) => {
                  const active = font.key === selectedFontKey
                  return (
                    <button key={font.key} type="button" aria-pressed={active}
                      onClick={() => { onSelect(font.key); onClose() }}
                      className={`flex h-[76px] items-center justify-center rounded-xl px-2 text-center text-sm font-bold ${soft} ${active ? 'border-2 border-[#FE526E] text-[#FE526E]' : 'border-2 border-transparent'}`}>
                      <span className="line-clamp-2" style={{ fontFamily: font.family }}>{font.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )) : <p className={`py-12 text-center text-sm ${muted}`}>{t('sharedChatAppearance.noFonts')}</p>}
        </div>
      </section>
    </div>
  )
}

/**
 * Shared, controlled appearance selector (no storage and no network calls).
 *
 * <ChatAppearanceSettings
 *   themeSelection={selection}
 *   selectedFontKey={fontKey}
 *   onChangeTheme={(nextSelection) => saveThemeForThisContext(nextSelection)}
 *   onChangeFont={(nextFontKey) => saveFontForThisContext(nextFontKey)}
 *   onOpenThemePage={() => openExistingThemePage()}
 * />
 *
 * Theme-selection values use the existing chatStoryThemes.js schema.
 * Callers own account-scoped persistence; never share another user's settings.
 */
export default function ChatAppearanceSettings({
  themeSelection,
  selectedFontKey = DEFAULT_CHAT_FONT_KEY,
  onChangeTheme,
  onChangeFont,
  onOpenThemePage,
  darkMode = false,
  showTheme = true,
  showFont = true,
  className = '',
}) {
  const { t } = useDisplayTranslation()
  const [fontPickerOpen, setFontPickerOpen] = useState(false)
  const [themeError, setThemeError] = useState(false)
  const font = getChatFontOption(selectedFontKey)
  const selection = normalizeChatTheme(themeSelection)
  const soft = darkMode ? 'bg-[#252a36]' : 'bg-[#f4f4f5]'
  const text = darkMode ? 'text-white' : 'text-[#18181b]'
  const muted = darkMode ? 'text-[#aeb5c5]' : 'text-[#71717a]'

  const selectTheme = async (item) => {
    if (typeof onChangeTheme !== 'function') return
    setThemeError(false)
    try {
      await onChangeTheme({ source: 'preset', id: item.id, paletteId: item.id })
    } catch {
      setThemeError(true)
    }
  }

  return (
    <div className={`w-full ${text} ${className}`}>
      {showTheme && (
        <section className={`border-b pb-3 ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
          {typeof onOpenThemePage === 'function' ? (
            <button type="button" onClick={onOpenThemePage} className="mb-2 flex w-full items-center justify-between text-left text-[12px] font-bold">
              <span>{t('sharedChatAppearance.theme')}</span><ChevronRight size={15} aria-hidden="true" />
            </button>
          ) : <h3 className="mb-2 text-[12px] font-bold">{t('sharedChatAppearance.theme')}</h3>}
          <div className="grid grid-cols-4 gap-2">
            {DEFAULT_CHAT_THEMES.map((item) => {
              const active = selection.source === 'preset' && selection.id === item.id
              return (
                <button key={item.id} type="button" disabled={typeof onChangeTheme !== 'function'}
                  onClick={() => selectTheme(item)} aria-pressed={active} aria-label={item.id}
                  className="h-[30px] rounded-[11px] border-2 transition active:scale-[0.98] disabled:cursor-default"
                  style={{ backgroundColor: item.background, borderColor: active ? (darkMode ? '#f8fafc' : '#111827') : 'transparent' }} />
              )
            })}
          </div>
          {themeError && <p role="alert" className="mt-2 text-xs text-red-500">{t('sharedChatAppearance.saveFailed')}</p>}
        </section>
      )}
      {showFont && (
        <section className="pt-3">
          <h3 className="mb-2 text-[12px] font-bold">{t('sharedChatAppearance.fontStyle')}</h3>
          <button type="button" disabled={typeof onChangeFont !== 'function'} onClick={() => setFontPickerOpen(true)}
            className={`flex h-[44px] w-full items-center justify-between rounded-[16px] px-3 text-left disabled:cursor-default ${soft}`}>
            <span className="min-w-0 truncate text-[12px] font-bold" style={{ fontFamily: font.family }}>{font.label}</span>
            <ChevronRight size={15} className={muted} aria-hidden="true" />
          </button>
        </section>
      )}
      {fontPickerOpen && typeof onChangeFont === 'function' && (
        <FontPicker selectedFontKey={selectedFontKey} onSelect={onChangeFont} darkMode={darkMode}
          onClose={() => setFontPickerOpen(false)} />
      )}
    </div>
  )
}
