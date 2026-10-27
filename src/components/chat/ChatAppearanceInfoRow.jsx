import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react'
import ChatAppearanceSettings, {
  DEFAULT_CHAT_FONT_KEY,
  getChatFontOption,
} from './ChatAppearanceSettings'
import {
  chatThemeAccount,
  chatThemeStyle,
  normalizeChatTheme,
  resolveChatTheme,
} from '../../services/chatStoryThemes'
import SharedChatThemePage from '../../pages/SharedChatThemePage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

// Independent per-account, per-conversation preferences. No API/Supabase traffic.
const EVENT = 'shadow:conversation-chat-appearance-changed'
const PREFIX = 'shadow:conversation-chat-appearance:v1'

registerTranslationNamespace('conversationAppearance', {
  en: {
    title: 'Chat Appearance', subtitle: 'Chat Theme · Font Style', themes: 'Chat Themes',
    colors: 'Colors', styles: 'Styles', back: 'Back', close: 'Done',
    selected: 'Selected', saveError: 'Could not save appearance settings.', photoDeleteBlocked: 'Photo deletion is disabled here to protect Chat Story photos.',
  },
  km: {
    title: 'រចនាប័ទ្មឆាត', subtitle: 'Theme ឆាត · រចនាប័ទ្ម Font', themes: 'Theme ឆាត',
    colors: 'ពណ៌', styles: 'រចនាប័ទ្ម', back: 'ត្រឡប់ក្រោយ', close: 'រួចរាល់',
    selected: 'បានជ្រើស', saveError: 'មិនអាចរក្សាទុកការកំណត់ឆាតបានទេ។', photoDeleteBlocked: 'ការលុបរូបនៅទីនេះត្រូវបានបិទ ដើម្បីការពាររូប Chat Story។',
  },
  zh: {
    title: '聊天外观', subtitle: '聊天主题 · 字体样式', themes: '聊天主题',
    colors: '颜色', styles: '样式', back: '返回', close: '完成',
    selected: '已选择', saveError: '无法保存聊天外观设置。', photoDeleteBlocked: '这里暂不支持删除照片，以保护 Chat Story 的照片。',
  },
  ja: {
    title: 'チャットの外観', subtitle: 'チャットテーマ · フォント', themes: 'チャットテーマ',
    colors: 'カラー', styles: 'スタイル', back: '戻る', close: '完了',
    selected: '選択中', saveError: 'チャットの外観を保存できません。', photoDeleteBlocked: 'Chat Storyの写真を保護するため、ここでの写真削除は無効です。',
  },
  ko: {
    title: '채팅 모양', subtitle: '채팅 테마 · 글꼴 스타일', themes: '채팅 테마',
    colors: '색상', styles: '스타일', back: '뒤로', close: '완료',
    selected: '선택됨', saveError: '채팅 모양을 저장할 수 없습니다.', photoDeleteBlocked: 'Chat Story 사진 보호를 위해 여기에서 사진 삭제를 비활성화했습니다.',
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
  if (!key || chatThemeAccount() !== account) {
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

// The theme UI below is NOT a reimplementation.
// Reader Chat and Author Chat both use the exact cloned Chat Story Theme page.
// Never call saveChatTheme(): each conversation has its own preference key.
export default function ChatAppearanceInfoRow({ conversationId, scope = 'reader', accountId }) {
  const { t } = useDisplayTranslation()
  const appearance = useConversationAppearance(conversationId, scope, accountId)
  const [open, setOpen] = useState(false)
  const [themePageOpen, setThemePageOpen] = useState(false)
  const [error, setError] = useState('')
  const [photoDeleteBlocked, setPhotoDeleteBlocked] = useState(false)
  const darkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const title = t('conversationAppearance.title')

  useEffect(() => {
    if (!open) return undefined
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  const saveTheme = (selection) => {
    try {
      const next = appearance.save({ themeSelection: selection })
      setError('')
      return next
    } catch (cause) {
      setError(t('conversationAppearance.saveError'))
      throw cause // SharedChatThemePage will keep its Apply error visible.
    }
  }

  const saveFont = (fontKey) => {
    try {
      appearance.save({ fontKey })
      setError('')
    } catch {
      setError(t('conversationAppearance.saveError'))
    }
  }

  const close = () => {
    setThemePageOpen(false)
    setPhotoDeleteBlocked(false)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setThemePageOpen(false); setPhotoDeleteBlocked(false); setError('') }}
        className="flex min-h-[58px] w-full items-center gap-4 px-1 text-left active:bg-[#f7f7f9]"
        aria-label={title}
      >
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

      {open && !themePageOpen && (
        <div
          className="fixed inset-0 z-[175] flex flex-col bg-[var(--shadow-bg-page,#fff)] text-[var(--shadow-text-primary,#111827)]"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <header className="flex shrink-0 items-center gap-3 border-b border-[var(--shadow-border,#e5e7eb)] bg-[var(--shadow-bg-surface,#fff)] px-3 pb-3 pt-[calc(12px+env(safe-area-inset-top,0px))]">
            <button
              type="button"
              onClick={close}
              aria-label={t('conversationAppearance.back')}
              className="flex h-9 w-9 items-center justify-center rounded-full"
            >
              <ChevronLeft size={23} />
            </button>
            <h2 className="min-w-0 flex-1 truncate text-[16px] font-bold">{title}</h2>
            <button
              type="button"
              className="rounded-full px-3 py-2 text-[12px] font-semibold"
              onClick={close}
            >
              {t('conversationAppearance.close')}
            </button>
          </header>
          <main className="min-h-0 flex-1 overflow-y-auto p-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
            <ChatAppearanceSettings
              themeSelection={appearance.themeSelection}
              selectedFontKey={appearance.fontKey}
              onChangeTheme={saveTheme}
              onChangeFont={saveFont}
              onOpenThemePage={() => { setPhotoDeleteBlocked(false); setThemePageOpen(true) }}
              darkMode={darkMode}
            />
            {error && <p role="alert" className="mt-3 text-[12px] text-red-500">{error}</p>}
          </main>
        </div>
      )}

      {open && themePageOpen && (
        <div
          className="fixed inset-0 z-[175]"
          role="dialog"
          aria-modal="true"
          aria-label={t('conversationAppearance.themes')}
          onClickCapture={(event) => {
            // Uploaded photos are still shared with the original Chat Story library.
            // Do not allow deleting a photo from Reader/Author to delete a Chat Story asset.
            if (event.target.closest?.('button.ct-delete')) {
              event.preventDefault()
              event.stopPropagation()
              setPhotoDeleteBlocked(true)
            }
          }}
        >
          <SharedChatThemePage
            themeSelection={appearance.themeSelection}
            onSaveTheme={saveTheme}
            onApply={() => { setThemePageOpen(false); setPhotoDeleteBlocked(false) }}
            onBack={() => { setThemePageOpen(false); setPhotoDeleteBlocked(false) }}
          />
          {photoDeleteBlocked && (
            <p role="alert" className="fixed bottom-20 left-1/2 z-[210] w-[min(92%,420px)] -translate-x-1/2 rounded-xl bg-[#111827] px-4 py-3 text-center text-[12px] font-semibold text-white shadow-xl">
              {t('conversationAppearance.photoDeleteBlocked')}
            </p>
          )}
        </div>
      )}
    </>
  )
}
