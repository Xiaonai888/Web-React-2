import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const LANGUAGES = [
  { id: 'km', label: 'Khmer', flagCode: 'kh' },
  { id: 'en', label: 'English', flagCode: 'us' },
  { id: 'zh', label: 'Chinese', flagCode: 'cn' },
  { id: 'ja', label: 'Japanese', flagCode: 'jp' },
  { id: 'ko', label: 'Korean', flagCode: 'kr' },
]

const LANGUAGE_LABEL_KEYS = {
  km: 'khmerLanguage',
  en: 'englishLanguage',
  zh: 'chineseLanguage',
  ja: 'japaneseLanguage',
  ko: 'koreanLanguage',
}

export function getLanguageLabel(languageId, tx) {
  const language = LANGUAGES.find((item) => item.id === languageId)
  const key = LANGUAGE_LABEL_KEYS[language?.id]

  if (key) {
    return tx(`mePage.${key}`)
  }

  return language?.label || tx('mePage.khmerLanguage')
}

const LANGUAGE_BOOK_SYMBOLS = {
  km: 'ក',
  en: 'A',
  zh: '文',
  ja: 'あ',
  ko: '가',
}

function LanguageBookIcon({ languageId }) {
  const symbol = LANGUAGE_BOOK_SYMBOLS[languageId] || 'A'

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="block shrink-0"
    >
      <path d="M4 13L24 16L44 13V37L24 40L4 37V13Z" fill="#E2E3E7" />
      <path d="M24 12C18 8 10 8 4 11V34C11 32 18 33 24 37V12Z" fill="white" stroke="#C8CBD0" strokeWidth="1.3" />
      <path d="M24 12C30 8 38 8 44 11V34C37 32 30 33 24 37V12Z" fill="white" stroke="#C8CBD0" strokeWidth="1.3" />
      <path d="M24 12V37" stroke="#E5E5E5" strokeWidth="1" />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="19"
        fontWeight="700"
        fontFamily="'Noto Sans Khmer', 'Khmer OS', 'Noto Sans JP', Arial, sans-serif"
        fill="#232323"
        stroke="white"
        strokeWidth="2"
        paintOrder="stroke"
      >
        {symbol}
      </text>
    </svg>
  )
}

function LanguageOption({
  language,
  selected,
  onClick,
  isDisplayLanguage = false,
  selectedLabel = 'Selected',
  selectedClassName = 'bg-[#fff7d8] ring-1 ring-[#f6b800]/45 dark:bg-[#2a2414] dark:ring-[#f6b800]/35',
  selectedTextClassName = 'text-[#d99a00]',
  selectedIconClassName = 'text-[#d99a00]',
}) {
  const { t: tx } = useDisplayTranslation()
  const countryCode = language.flagCode?.toUpperCase() || ''
  const displayLabel = getLanguageLabel(language.id, tx)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition active:scale-[0.99] ${
        selected
          ? selectedClassName
          : 'bg-[#f8f8fb] ring-1 ring-transparent dark:bg-white/5'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {isDisplayLanguage ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[13px] font-bold text-[#111827] shadow-sm ring-1 ring-black/5 dark:bg-white dark:text-[#111827]">
            <img
              src={`https://flagcdn.com/w40/${language.flagCode}.png`}
              alt={tx('mePage.languageFlag', { language: displayLabel })}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
                event.currentTarget.nextElementSibling.style.display = 'inline'
              }}
            />
            <span className="hidden">{countryCode}</span>
          </span>
        ) : (
          <LanguageBookIcon languageId={language.id} />
        )}
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">{displayLabel}</div>
          {selected ? (
            <div className={`mt-0.5 text-[11px] font-semibold ${selectedTextClassName}`}>{selectedLabel}</div>
          ) : null}
        </div>
      </div>
      {selected ? <i className={`fa-solid fa-check text-[13px] ${selectedIconClassName}`} /> : null}
    </button>
  )
}

export default function LanguageSheet({
  open,
  onClose,
  storyLanguage,
  displayLanguage,
  onStoryLanguageChange,
  onDisplayLanguageChange,
  tx,
}) {
  const [activeTab, setActiveTab] = useState('story')

  if (!open) return null

  const isStoryTab = activeTab === 'story'
  const selectedLanguage = isStoryTab ? storyLanguage : displayLanguage
 const description = isStoryTab
  ? tx('storyLanguageHelp')
  : tx('displayLanguageHelp')

  return (
    <div className="fixed inset-0 z-[140]">
      <button type="button" aria-label={tx('mePage.closeLanguage')} onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-hidden rounded-t-[26px] bg-white px-4 pb-5 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[340px] md:rounded-[22px] md:pb-4 dark:bg-[#12141d]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827] dark:text-white">{tx('language')}</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">{tx('languageSub')}</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-white/10">
            <i className="fa-solid fa-times text-[13px] text-[#555] dark:text-white/70" />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-2 rounded-2xl bg-[#f4f5f7] p-1 dark:bg-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={`rounded-xl px-3 py-2 text-[12px] font-extrabold transition ${
              isStoryTab ? 'bg-white text-[#111827] shadow-sm dark:bg-[#f6b800] dark:text-[#111827]' : 'text-[#8d94a1] dark:text-white/55'
            }`}
          >
            {tx('storyLanguage')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('display')}
            className={`rounded-xl px-3 py-2 text-[12px] font-extrabold transition ${
              !isStoryTab ? 'bg-white text-[#111827] shadow-sm dark:bg-[#f6b800] dark:text-[#111827]' : 'text-[#8d94a1] dark:text-white/55'
            }`}
          >
            {tx('displayLanguage')}
          </button>
        </div>

        <div className="mb-3 rounded-[18px] bg-[#f8f8fb] px-3.5 py-3 text-[12px] leading-5 text-[#6b7280] dark:bg-white/5 dark:text-white/60">
          {description}
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pb-1">
          {LANGUAGES.map((language) => (
            <LanguageOption
  key={language.id}
  language={language}
  selected={selectedLanguage === language.id}
  isDisplayLanguage={!isStoryTab}
  selectedLabel={tx('selected')}

  onClick={() => {
    if (isStoryTab) {
      onStoryLanguageChange(language.id)
    } else {
      onDisplayLanguageChange(language.id)
    }
  }}
  {...(!isStoryTab
    ? {
        selectedClassName: 'bg-[#eef4ff] ring-1 ring-[#2563eb]/35 dark:bg-[#17233d] dark:ring-[#8bb6ff]/35',
        selectedTextClassName: 'text-[#2563eb]',
        selectedIconClassName: 'text-[#2563eb]',
      }
    : {})}
/>
          ))}
        </div>
      </div>
    </div>
  )
}

