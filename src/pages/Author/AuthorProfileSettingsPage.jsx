import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import {
  AUTHOR_THEME_PRESETS,
  applyAuthorTheme,
  getAuthorTheme,
  saveAuthorTheme,
} from '../../utils/authorTheme'

registerTranslationNamespace('authorThemeSettings', {
  en: {
    title: 'Theme',
    description: 'Choose your favorite color for the Author interface.',
    preview: 'Live preview',
    example: 'Continue Writing',
    button: 'Continue',
    custom: 'Custom color',
    saved: 'Saved automatically on this device',
    colors: 'Theme colors',
  },
  km: {
    title: 'រចនាប័ទ្មពណ៌',
    description: 'ជ្រើសរើសពណ៌ដែលអ្នកចូលចិត្តសម្រាប់ផ្ទាំងអ្នកនិពន្ធ។',
    preview: 'បង្ហាញសាកល្បង',
    example: 'បន្តសរសេរ',
    button: 'បន្ត',
    custom: 'ពណ៌ផ្ទាល់ខ្លួន',
    saved: 'រក្សាទុកស្វ័យប្រវត្តិនៅលើឧបករណ៍នេះ',
    colors: 'ពណ៌ Theme',
  },
  zh: {
    title: '主题颜色',
    description: '为作者界面选择您喜欢的颜色。',
    preview: '实时预览',
    example: '继续写作',
    button: '继续',
    custom: '自定义颜色',
    saved: '已自动保存在此设备上',
    colors: '主题颜色',
  },
  ja: {
    title: 'テーマカラー',
    description: '作者画面のお好きな色を選んでください。',
    preview: 'プレビュー',
    example: '執筆を続ける',
    button: '続ける',
    custom: 'カスタムカラー',
    saved: 'この端末に自動保存されます',
    colors: 'テーマカラー',
  },
  ko: {
    title: '테마 색상',
    description: '작가 화면에 사용할 색상을 선택하세요.',
    preview: '미리보기',
    example: '계속 쓰기',
    button: '계속',
    custom: '사용자 지정 색상',
    saved: '이 기기에 자동 저장됩니다',
    colors: '테마 색상',
  },
})

export default function AuthorProfileSettingsPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [theme, setTheme] = useState(getAuthorTheme)

  useEffect(() => {
    applyAuthorTheme(theme)
    const syncTheme = () => {
      const stored = getAuthorTheme()
      setTheme(stored)
      applyAuthorTheme(stored)
    }
    window.addEventListener('storage', syncTheme)
    return () => window.removeEventListener('storage', syncTheme)
  }, [theme])

  const chooseTheme = (color) => {
    const updated = saveAuthorTheme(color)
    setTheme(updated)
  }

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/profile')}
            aria-label={t('authorPushSettings.back')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)]"
          >
            <i className="fa-solid fa-chevron-left text-[16px]" aria-hidden="true" />
          </button>
          <h1 className="text-[16px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPushSettings.settings')}</h1>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] space-y-4 px-4 pt-4">
        <section className="rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
              style={{ backgroundColor: 'var(--author-theme-soft)', color: 'var(--author-theme-primary)' }}
            >
              <i className="fa-solid fa-palette text-[18px]" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">{t('authorThemeSettings.title')}</h2>
              <p className="mt-0.5 text-[11px] text-[var(--shadow-text-tertiary)]">{t('authorThemeSettings.description')}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-4" aria-label={t('authorThemeSettings.colors')}>
            {AUTHOR_THEME_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseTheme(item.color)}
                aria-label={item.id}
                aria-pressed={theme === item.color}
                className="flex min-w-0 flex-col items-center gap-2"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border-[3px] transition-transform active:scale-95"
                  style={{ backgroundColor: item.color, borderColor: theme === item.color ? 'var(--shadow-text-primary)' : 'transparent' }}
                >
                  {theme === item.color ? <i className="fa-solid fa-check text-[17px]" style={{ color: 'var(--author-theme-foreground)' }} aria-hidden="true" /> : null}
                </span>
                <span className="truncate text-[11px] font-medium capitalize text-[var(--shadow-text-primary)]">{item.id}</span>
              </button>
            ))}
          </div>

          <label className="mt-5 flex items-center justify-between rounded-xl border border-[var(--shadow-border)] p-3">
            <span className="text-[12px] font-medium text-[var(--shadow-text-primary)]">{t('authorThemeSettings.custom')}</span>
            <input
              type="color"
              value={theme}
              onChange={(event) => chooseTheme(event.target.value)}
              aria-label={t('authorThemeSettings.custom')}
              className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
            />
          </label>

          <div className="mt-4 rounded-2xl bg-[var(--shadow-bg-page)] p-3">
            <p className="text-[11px] text-[var(--shadow-text-tertiary)]">{t('authorThemeSettings.preview')}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[12px] font-semibold text-[var(--shadow-text-primary)]">{t('authorThemeSettings.example')}</span>
              <span
                className="flex items-center gap-1 rounded-full px-4 py-2 text-[12px] font-bold"
                style={{ backgroundColor: 'var(--author-theme-primary)', color: 'var(--author-theme-foreground)' }}
              >
                {t('authorThemeSettings.button')}
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </span>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-[var(--shadow-text-tertiary)]">{t('authorThemeSettings.saved')}</p>
        </section>

        <button
          type="button"
          onClick={() => navigate('/author/profile-settings/notifications')}
          className="flex w-full items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--author-theme-soft)] text-[var(--author-theme-primary)]">
            <i className="fa-regular fa-bell text-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-[var(--shadow-text-primary)]">{t('authorPushSettings.notification')}</span>
            <span className="mt-1 block text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{t('authorPushSettings.notificationHelp')}</span>
          </span>
        </button>
      </main>
    </div>
  )
}
