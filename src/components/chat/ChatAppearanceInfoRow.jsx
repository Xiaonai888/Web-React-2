import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react'
import ChatAppearanceSettings, {
  DEFAULT_CHAT_FONT_KEY,
  getChatFontOption,
} from './ChatAppearanceSettings'
import {
  CHAT_STORY_THEMES,
  CHAT_THEME_STYLES,
  chatThemeAccount,
  chatThemeStyle,
  normalizeChatTheme,
  resolveChatTheme,
} from '../../services/chatStoryThemes'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

// Independent per-account, per-conversation preferences. No API/Supabase traffic.
const EVENT = 'shadow:conversation-chat-appearance-changed'
const PREFIX = 'shadow:conversation-chat-appearance:v1'

registerTranslationNamespace('conversationAppearance', {
  en: {
    title: 'Chat Appearance', subtitle: 'Chat Theme · Font Style', themes: 'Chat Themes',
    colors: 'Colors', styles: 'Styles', back: 'Back', close: 'Done',
    selected: 'Selected', saveError: 'Could not save appearance settings.',
  },
  km: {
    title: 'រចនាប័ទ្មឆាត', subtitle: 'Theme ឆាត · រចនាប័ទ្ម Font', themes: 'Theme ឆាត',
    colors: 'ពណ៌', styles: 'រចនាប័ទ្ម', back: 'ត្រឡប់ក្រោយ', close: 'រួចរាល់',
    selected: 'បានជ្រើស', saveError: 'មិនអាចរក្សាទុកការកំណត់ឆាតបានទេ។',
  },
  zh: {
    title: '聊天外观', subtitle: '聊天主题 · 字体样式', themes: '聊天主题',
    colors: '颜色', styles: '样式', back: '返回', close: '完成',
    selected: '已选择', saveError: '无法保存聊天外观设置。',
  },
  ja: {
    title: 'チャットの外観', subtitle: 'チャットテーマ · フォント', themes: 'チャットテーマ',
    colors: 'カラー', styles: 'スタイル', back: '戻る', close: '完了',
    selected: '選択中', saveError: 'チャットの外観を保存できません。',
  },
  ko: {
    title: '채팅 모양', subtitle: '채팅 테마 · 글꼴 스타일', themes: '채팅 테마',
    colors: '색상', styles: '스타일', back: '뒤로', close: '완료',
    selected: '선택됨', saveError: '채팅 모양을 저장할 수 없습니다.',
  },
})

function preferenceKey(conversationId, scope, account) {
  const id = String(conversationId || '').slice(0, 128)
  if (!id || !account || account === 'guest') return ''
  const type = scope === 'author' ? 'author' : 'reader'
  return `${PREFIX}:${type}:${account}:${id}`
}

function normalizePreferences(value) {
  return {
    themeSelection: normalizeChatTheme(value?.themeSelection),
    fontKey: getChatFontOption(value?.fontKey).key,
  }
}

function readSnapshot(key) {
  if (!key || typeof window === 'undefined') return ''
  try { return window.localStorage.getItem(key) || '' } catch { return '' }
}

export function readConversationAppearance(conversationId, scope = 'reader', account = chatThemeAccount()) {
  const key = preferenceKey(conversationId, scope, account)
  try { return normalizePreferences(JSON.parse(readSnapshot(key) || 'null')) }
  catch { return normalizePreferences(null) }
}

export function saveConversationAppearance(conversationId, changes, scope = 'reader', account = chatThemeAccount()) {
  const key = preferenceKey(conversationId, scope, account)
  if (!key || (scope === 'reader' && chatThemeAccount() !== account)) {
    throw new Error('Chat account has changed. Sign in again.')
  }
  const current = readConversationAppearance(conversationId, scope, account)
  const next = normalizePreferences({ ...current, ...changes })
  window.localStorage.setItem(key, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }))
  return next
}

export function useConversationAppearance(conversationId, scope = 'reader', accountId) {
  const account = accountId || chatThemeAccount()
  const key = preferenceKey(conversationId, scope, account)
  const subscribe = useCallback((listener) => {
    const onStorage = (event) => { if (!event.key || event.key === key) listener() }
    const onChanged = (event) => { if (event.detail?.key === key) listener() }
    window.addEventListener('storage', onStorage)
    window.addEventListener(EVENT, onChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(EVENT, onChanged)
    }
  }, [key])
  const getSnapshot = useCallback(() => readSnapshot(key), [key])
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '')
  const preferences = useMemo(() => {
    try { return normalizePreferences(JSON.parse(snapshot || 'null')) }
    catch { return normalizePreferences(null) }
  }, [snapshot])
  const save = useCallback((changes) =>
    saveConversationAppearance(conversationId, changes, scope, account),
    [conversationId, scope, account])
  return {
    ...preferences,
    theme: resolveChatTheme(preferences.themeSelection),
    themeStyle: chatThemeStyle(preferences.themeSelection),
    font: getChatFontOption(preferences.fontKey),
    save,
  }
}

function humanize(id) {
  return String(id || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function ChatAppearanceInfoRow({ conversationId, scope = 'reader', accountId }) {
  const { t } = useDisplayTranslation()
  const appearance = useConversationAppearance(conversationId, scope, accountId)
  const [open, setOpen] = useState(false)
  const [gallery, setGallery] = useState(false)
  const [tab, setTab] = useState('colors')
  const [limit, setLimit] = useState(12)
  const [error, setError] = useState('')
  const darkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const title = t('conversationAppearance.title')

  useEffect(() => {
    if (!open) return undefined
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = oldOverflow }
  }, [open])

  const save = (changes) => {
    try { appearance.save(changes); setError('') }
    catch { setError(t('conversationAppearance.saveError')) }
  }

  const setTheme = (selection) => save({ themeSelection: selection })
  const setFont = (fontKey) => save({ fontKey })
  const selected = appearance.themeSelection
  const showGallery = open && gallery
  const choices = tab === 'colors' ? CHAT_STORY_THEMES : CHAT_THEME_STYLES

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setGallery(false); setError('') }}
        className="flex min-h-[58px] w-full items-center gap-4 px-1 text-left active:bg-[#f7f7f9]"
        aria-label={title}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary,#111827)]">
          <Palette size={22} strokeWidth={1.9} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-normal text-[var(--shadow-text-primary,#111827)]">{title}</span>
          <span className="mt-0.5 block text-[11px] font-normal text-[var(--shadow-text-tertiary,#8a8a95)]">
            {t('conversationAppearance.subtitle')}
          </span>
        </span>
        <ChevronRight size={17} className="mr-2 text-[var(--shadow-text-tertiary,#888)]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[175] flex flex-col bg-[var(--shadow-bg-page,#fff)] text-[var(--shadow-text-primary,#111827)]"
          role="dialog" aria-modal="true" aria-label={title}>
          <header className="flex shrink-0 items-center gap-3 border-b border-[var(--shadow-border,#e5e7eb)] bg-[var(--shadow-bg-surface,#fff)] px-3 pb-3 pt-[calc(12px+env(safe-area-inset-top,0px))]">
            <button type="button" onClick={() => showGallery ? setGallery(false) : setOpen(false)}
              aria-label={t('conversationAppearance.back')} className="flex h-9 w-9 items-center justify-center rounded-full">
              <ChevronLeft size={23} />
            </button>
            <h2 className="min-w-0 flex-1 truncate text-[16px] font-bold">
              {showGallery ? t('conversationAppearance.themes') : title}
            </h2>
            <button type="button" className="rounded-full px-3 py-2 text-[12px] font-semibold"
              onClick={() => { setOpen(false); setGallery(false) }}>{t('conversationAppearance.close')}</button>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
            {showGallery ? (
              <>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {['colors', 'styles'].map((key) => (
                    <button key={key} type="button" onClick={() => { setTab(key); setLimit(12) }}
                      className={`rounded-xl px-3 py-2 text-[12px] font-semibold ${tab === key ? 'bg-[#111827] text-white' : 'bg-[var(--shadow-bg-soft,#f4f4f5)]'}`}>
                      {t(`conversationAppearance.${key}`)}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {choices.slice(0, limit).map((item) => {
                    const option = tab === 'colors'
                      ? { source: 'preset', id: item.id, paletteId: item.id, styleId: selected.styleId }
                      : { ...selected, styleId: item.id }
                    const theme = resolveChatTheme(option)
                    const active = tab === 'colors' ? selected.paletteId === item.id : (selected.styleId || 'classic') === item.id
                    return (
                      <button key={item.id} type="button" onClick={() => setTheme(option)}
                        aria-pressed={active} className={`overflow-hidden rounded-2xl border-2 text-left ${active ? 'border-[#7c3aed]' : 'border-[var(--shadow-border,#ddd)]'}`}>
                        <span className="block h-24 p-2" style={chatThemeStyle(option)}>
                          <span className="mb-2 block w-[65%] rounded-xl px-2 py-1 text-[10px]" style={{ background: theme.incoming, color: theme.text }}>Hi!</span>
                          <span className="ml-auto block w-[65%] rounded-xl px-2 py-1 text-[10px]" style={{ background: theme.outgoing, color: theme.outgoingText }}>Hello!</span>
                        </span>
                        <span className="block truncate px-2 py-2 text-[11px] font-semibold">{humanize(item.id)}{active ? ' ✓' : ''}</span>
                      </button>
                    )
                  })}
                </div>
                {limit < choices.length && (
                  <button type="button" className="mt-4 w-full rounded-xl bg-[var(--shadow-bg-soft,#f4f4f5)] px-3 py-3 text-[12px] font-semibold"
                    onClick={() => setLimit((current) => Math.min(current + 12, choices.length))}>+12</button>
                )}
              </>
            ) : (
              <ChatAppearanceSettings
                themeSelection={selected}
                selectedFontKey={appearance.fontKey}
                onChangeTheme={setTheme}
                onChangeFont={setFont}
                onOpenThemePage={() => setGallery(true)}
                darkMode={darkMode}
              />
            )}
            {error && <p role="alert" className="mt-3 text-[12px] text-red-500">{error}</p>}
          </main>
        </div>
      )}
    </>
  )
}
