import { useEffect, useState } from 'react'
import { BookOpen, Check, X } from 'lucide-react'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { getStoryLanguageId } from '../utils/storyLanguage'

const STORY_LANGUAGE_KEY = 'shadow_story_language'

const LANGUAGES = [
  { id: 'km', name: 'Khmer', flag: 'kh' },
  { id: 'en', name: 'English', flag: 'us' },
  { id: 'zh', name: 'Chinese', flag: 'cn' },
  { id: 'ja', name: 'Japanese', flag: 'jp' },
  { id: 'ko', name: 'Korean', flag: 'kr' },
]

const COPY = {
  en: {
    title: 'Choose Story Language',
    description: 'Select the language of stories you want to read on Shadow.',
    continue: 'Continue',
    hint: 'You can change this later in',
    settings: 'Mine → Settings → Story Language',
    close: 'Skip story language selection',
    chosen: 'Selected',
  },
  km: {
    title: 'ជ្រើសរើសភាសារឿង',
    description: 'ជ្រើសរើសភាសារឿងដែលអ្នកចង់អាននៅលើ Shadow។',
    continue: 'បន្ត',
    hint: 'អ្នកអាចប្ដូរវាពេលក្រោយនៅ',
    settings: 'Mine → Settings → Story Language',
    close: 'រំលងការជ្រើសរើសភាសារឿង',
    chosen: 'បានជ្រើសរើស',
  },
  zh: {
    title: '选择故事语言',
    description: '选择您希望在 Shadow 阅读的故事语言。',
    continue: '继续',
    hint: '之后可以在这里更改：',
    settings: 'Mine → Settings → Story Language',
    close: '跳过故事语言选择',
    chosen: '已选择',
  },
  ja: {
    title: 'ストーリーの言語を選択',
    description: 'Shadow で読みたいストーリーの言語を選んでください。',
    continue: '続ける',
    hint: 'あとから変更できます：',
    settings: 'Mine → Settings → Story Language',
    close: '言語選択をスキップ',
    chosen: '選択中',
  },
  ko: {
    title: '스토리 언어 선택',
    description: 'Shadow에서 읽고 싶은 스토리의 언어를 선택하세요.',
    continue: '계속',
    hint: '나중에 이 메뉴에서 변경할 수 있습니다:',
    settings: 'Mine → Settings → Story Language',
    close: '스토리 언어 선택 건너뛰기',
    chosen: '선택됨',
  },
}

// Show only on Mine when a newly registered reader has pending onboarding.
export default function StoryLanguageOnboardingModal({
  open = false,
  onFinish,
}) {
  const { language: displayLanguage } = useDisplayTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState(() => getStoryLanguageId())
  const copy = COPY[displayLanguage] || COPY.en

  useEffect(() => {
    if (!open) return undefined
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [open])

  if (!open) return null

  const complete = () => {
  try {
    localStorage.setItem(STORY_LANGUAGE_KEY, selectedLanguage)
    window.dispatchEvent(
      new CustomEvent('shadow:story-language-initialized', {
        detail: { language: selectedLanguage },
      })
    )
  } catch {}

  onFinish?.()
}

const skip = () => {
  onFinish?.()
}

const openSettings = () => {
  onFinish?.()
  window.location.assign('/me?settings=1&language=story')
}

  return (
    <div
      className="fixed inset-0 z-[190] flex flex-col items-center justify-center gap-3 bg-black/60 px-5 py-5"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-onboarding-title"
        className="max-h-[calc(100dvh-100px)] w-full max-w-[380px] overflow-y-auto rounded-[26px] bg-white px-5 pb-5 pt-6 text-[#111827] shadow-2xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff5db] text-[#e9a000]">
          <BookOpen size={28} strokeWidth={1.8} />
        </div>
        <h2 id="story-onboarding-title" className="mt-3 text-center text-[20px] font-extrabold leading-6">
          {copy.title}
        </h2>
        <p className="mt-2 text-center text-[12px] leading-5 text-[#707786]">
          {copy.description}
        </p>

        <div className="mt-5 space-y-2">
          {LANGUAGES.map((item) => {
            const selected = selectedLanguage === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedLanguage(item.id)}
                className={`flex min-h-[54px] w-full items-center gap-3 rounded-[17px] px-3 py-2.5 text-left transition active:scale-[0.99] ${
                  selected
                    ? 'bg-[#fff6d9] ring-1 ring-[#f6b800]'
                    : 'bg-[#f6f6f9] hover:bg-[#eeeeF3]'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/10">
                  <img
                    src={`https://flagcdn.com/w40/${item.flag}.png`}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <span className="min-w-0 flex-1 text-[14px] font-bold">{item.name}</span>
                {selected ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f6b800] text-white" aria-label={copy.chosen}>
                    <Check size={15} strokeWidth={2.7} />
                  </span>
                ) : (
                  <span className="h-5 w-5 shrink-0 rounded-full border-[1.5px] border-[#b9bdc8]" />
                )}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={complete}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#f6b800] text-[15px] font-bold text-[#111827] transition active:scale-[0.98]"
        >
          {copy.continue}
        </button>
        <div className="mt-3 text-center text-[11px] leading-5 text-[#707786]">
          <span>{copy.hint} </span>
          <button
            type="button"
            onClick={openSettings}
            className="font-semibold text-[#111827] underline underline-offset-2"
          >
            {copy.settings}
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={skip}
        aria-label={copy.close}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-[#303137]/80 text-white shadow-lg transition active:scale-95"
      >
        <X size={23} strokeWidth={2.3} />
      </button>
    </div>
  )
}
