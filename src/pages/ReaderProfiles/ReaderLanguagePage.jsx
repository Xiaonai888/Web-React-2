import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Check, ChevronRight, Languages } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { getStoryLanguageId } from '../../utils/storyLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerLanguage', {
  en: {
    title: 'Language',
    app: 'App Language',
    story: 'Story Language',
    appDescription: 'Language for menus, buttons, and settings.',
    storyDescription: 'Preferred language for discovering stories.',
    appHelp: 'Choose the language used throughout the app.',
    storyHelp: 'Choose the language of stories you prefer to discover.',
    saved: 'Your selection is saved automatically.',
    selected: 'Selected',
    back: 'Back',
  },
  km: {
    title: 'ភាសា',
    app: 'ភាសាកម្មវិធី',
    story: 'ភាសារឿង',
    appDescription: 'ភាសាសម្រាប់ម៉ឺនុយ ប៊ូតុង និងការកំណត់។',
    storyDescription: 'ភាសារឿងដែលអ្នកចង់ស្វែងរក និងអាន។',
    appHelp: 'ជ្រើសភាសាដែលប្រើនៅក្នុងកម្មវិធី។',
    storyHelp: 'ជ្រើសភាសារឿងដែលអ្នកចូលចិត្តអាន។',
    saved: 'ការជ្រើសរើសរបស់អ្នកត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ។',
    selected: 'បានជ្រើសរើស',
    back: 'ត្រឡប់ក្រោយ',
  },
  zh: {
    title: '语言',
    app: '应用语言',
    story: '故事语言',
    appDescription: '菜单、按钮和设置所使用的语言。',
    storyDescription: '希望发现和阅读的故事语言。',
    appHelp: '选择应用界面使用的语言。',
    storyHelp: '选择您喜欢阅读的故事语言。',
    saved: '您的选择将自动保存。',
    selected: '已选择',
    back: '返回',
  },
  ja: {
    title: '言語',
    app: 'アプリの言語',
    story: 'ストーリーの言語',
    appDescription: 'メニュー、ボタン、設定の言語。',
    storyDescription: '読みたいストーリーの言語。',
    appHelp: 'アプリで使用する言語を選択してください。',
    storyHelp: '読みたいストーリーの言語を選択してください。',
    saved: '選択内容は自動的に保存されます。',
    selected: '選択中',
    back: '戻る',
  },
  ko: {
    title: '언어',
    app: '앱 언어',
    story: '스토리 언어',
    appDescription: '메뉴, 버튼, 설정에 사용되는 언어입니다.',
    storyDescription: '찾아보고 싶은 스토리의 언어입니다.',
    appHelp: '앱에서 사용할 언어를 선택하세요.',
    storyHelp: '읽고 싶은 스토리의 언어를 선택하세요.',
    saved: '선택한 언어는 자동으로 저장됩니다.',
    selected: '선택됨',
    back: '뒤로',
  },
})

const LANGUAGES = [
  { id: 'km', label: 'ភាសាខ្មែរ', subtitle: 'Khmer', code: 'KM' },
  { id: 'en', label: 'English', subtitle: 'English', code: 'EN' },
  { id: 'zh', label: '中文', subtitle: 'Chinese', code: 'ZH' },
  { id: 'ja', label: '日本語', subtitle: 'Japanese', code: 'JA' },
  { id: 'ko', label: '한국어', subtitle: 'Korean', code: 'KO' },
]

function LanguageRow({ icon: Icon, title, value, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left active:bg-[var(--shadow-bg-hover)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)]">
        <Icon size={19} strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">{title}</span>
        <span className="mt-0.5 block text-[12px] text-[var(--shadow-text-secondary)]">{value}</span>
        <span className="mt-1 block text-[11px] text-[var(--shadow-text-secondary)]">{description}</span>
      </span>
      <ChevronRight size={18} strokeWidth={1.7} className="shrink-0 text-[var(--shadow-text-secondary)]" />
    </button>
  )
}

export default function ReaderLanguagePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, language: displayLanguage, changeLanguage } = useDisplayTranslation()
  const [storyLanguage, setStoryLanguage] = useState(() => getStoryLanguageId())
  const section = searchParams.get('view')
  const selectedSection = section === 'app' || section === 'story' ? section : null
  const currentLanguage = selectedSection === 'app' ? displayLanguage : storyLanguage
  const languageName = (id) => LANGUAGES.find((item) => item.id === id)?.label || LANGUAGES[0].label
  const tr = (key) => t(`readerLanguage.${key}`)

  const handleBack = () => {
    if (selectedSection) {
      setSearchParams({}, { replace: true })
      return
    }
    navigate('/profile/settings')
  }

  const handleSelect = (id) => {
    if (selectedSection === 'app') {
      changeLanguage(id)
      return
    }
    if (selectedSection === 'story') {
      try {
        localStorage.setItem('shadow_story_language', id)
      } catch {
        return
      }
      setStoryLanguage(id)
    }
  }

  return (
    <main className="app-page min-h-screen pb-[calc(28px+env(safe-area-inset-bottom))] bg-[var(--shadow-bg-page)] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label={tr('back')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]"
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
          <h1 className="text-[18px] font-semibold">
            {selectedSection ? tr(selectedSection) : tr('title')}
          </h1>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[560px] px-4 pt-5">
        {!selectedSection ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
            <LanguageRow
              icon={Languages}
              title={tr('app')}
              value={languageName(displayLanguage)}
              description={tr('appDescription')}
              onClick={() => setSearchParams({ view: 'app' })}
            />
            <div className="mx-4 border-t border-[var(--shadow-border)]" />
            <LanguageRow
              icon={BookOpen}
              title={tr('story')}
              value={languageName(storyLanguage)}
              description={tr('storyDescription')}
              onClick={() => setSearchParams({ view: 'story' })}
            />
          </div>
        ) : (
          <>
            <p className="mb-4 px-1 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
              {tr(selectedSection === 'app' ? 'appHelp' : 'storyHelp')}
            </p>
            <div className="overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)]">
              {LANGUAGES.map((item, index) => {
                const selected = item.id === currentLanguage
                return (
                  <div key={item.id}>
                    {index > 0 && <div className="mx-4 border-t border-[var(--shadow-border)]" />}
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      aria-pressed={selected}
                      className={`flex min-h-[66px] w-full items-center gap-3 px-4 py-3 text-left active:bg-[var(--shadow-bg-hover)] ${selected ? 'bg-[var(--shadow-bg-soft)]' : ''}`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] text-[11px] font-semibold">
                        {item.code}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-medium">{item.label}</span>
                        <span className="block text-[11px] text-[var(--shadow-text-secondary)]">{selected ? tr('selected') : item.subtitle}</span>
                      </span>
                      {selected && <Check size={19} strokeWidth={2} className="shrink-0 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  </div>
                )
              })}
            </div>
            <p className="mt-5 px-1 text-center text-[11px] text-[var(--shadow-text-secondary)]">
              {tr('saved')}
            </p>
          </>
        )}
      </div>
    </main>
  )
}
