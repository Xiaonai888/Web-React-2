import { useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const DISPLAY_LANGUAGES = [
  { id: 'km', label: 'ខ្មែរ', flagCode: 'kh' },
  { id: 'en', label: 'English', flagCode: 'us' },
  { id: 'zh', label: '中文', flagCode: 'cn' },
  { id: 'ja', label: '日本語', flagCode: 'jp' },
  { id: 'ko', label: '한국어', flagCode: 'kr' },
]

export default function DisplayLanguageMenu() {
  const [open, setOpen] = useState(false)
  const { language, changeLanguage } = useDisplayTranslation()
  const current =
    DISPLAY_LANGUAGES.find((item) => item.id === language) ||
    DISPLAY_LANGUAGES[1]

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close language"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[150]"
        />
      ) : null}

      <div className="relative z-[160]">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 min-w-[88px] items-center justify-center gap-2 rounded-full bg-white px-3 text-[#111827] shadow-sm ring-1 ring-black/5 transition active:scale-95 dark:bg-[var(--shadow-bg-surface)] dark:text-[var(--shadow-text-primary)] dark:ring-white/10"
          aria-label="Change language"
          aria-expanded={open}
        >
          <i className="fa-solid fa-globe text-[17px]" />
          <span className="text-[13px] font-extrabold">
            {current.id.toUpperCase()}
          </span>
          <i
            className={`fa-solid fa-chevron-down text-[10px] transition ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open ? (
          <div className="absolute right-0 top-[50px] w-[205px] overflow-hidden rounded-[20px] bg-white p-2 shadow-[0_18px_50px_rgba(17,24,39,0.16)] ring-1 ring-black/5 dark:bg-[#12141d] dark:ring-white/10">
            {DISPLAY_LANGUAGES.map((item) => {
              const selected = language === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    changeLanguage(item.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-left transition active:scale-[0.99] ${
                    selected
                      ? 'bg-[#eef4ff] text-[#111827] dark:bg-[#17233d] dark:text-white'
                      : 'text-[#111827] hover:bg-[#f8f8fb] dark:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/5">
                      <img
                        src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="truncate text-[13px] font-semibold">
                      {item.label}
                    </span>
                  </span>

                  {selected ? (
                    <i className="fa-solid fa-check text-[12px] text-[#2563eb]" />
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </>
  )
}
