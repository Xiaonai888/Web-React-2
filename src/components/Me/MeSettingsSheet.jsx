import { useEffect, useState } from 'react'
import { setDisplayLanguageId, useDisplayTranslation } from '../../utils/displayLanguage'
import { getStoryLanguageId, saveStoryLanguagePreference, loadStoryLanguageFromAccount } from '../../utils/storyLanguage'
import { getStoredTheme, applyTheme } from '../../utils/meTheme'
import MenuRow from './MeMenuRow'
import LanguageSheet, { getLanguageLabel } from './MeLanguageSheet'

const STORY_LANGUAGE_STORAGE_KEY = 'shadow_story_language'

function getStoredStoryLanguage() {
  return localStorage.getItem(STORY_LANGUAGE_STORAGE_KEY) || 'km'
}

function ThemeSwitchRow({ darkMode, onChange, tx }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${darkMode ? 'bg-[#2b2f42] text-[#f6b800]' : 'bg-[#fff7d8] text-[#d99a00]'}`}>
          <i className={`${darkMode ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} text-[14px]`} />
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-normal text-[#111827] dark:text-white">
            {darkMode ? tx('darkMode') : tx('lightMode')}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1] dark:text-white/50">
            {tx('themeSub')}
          </div>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={darkMode}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${darkMode ? 'bg-[#f6b800]' : 'bg-[#d9dce4]'}`}
      >
        <span
          className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] shadow transition ${
            darkMode ? 'left-6 text-[#d99a00]' : 'left-1 text-[#9aa1ad]'
          }`}
        >
          <i className={`fa-solid ${darkMode ? 'fa-moon' : 'fa-sun'}`} />
        </span>
      </button>
    </div>
  )
}

function LanguageSummaryRow({ storyLanguage, displayLanguage, onClick, tx }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left active:scale-[0.99]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2563eb] dark:bg-[#22304d] dark:text-[#8bb6ff]">
          <i className="fa-solid fa-globe text-[14px]" />
        </div>
        <div className="min-w-0">
          <div className="line-clamp-1 text-[13.5px] font-extrabold text-[#111827] dark:text-white">{tx('language')}</div>
          <div className="mt-0.5 line-clamp-1 text-[11.5px] text-[#8d94a1] dark:text-white/50">
            {tx('storyLanguage')}: {getLanguageLabel(storyLanguage, tx)} • {tx('displayLanguage')}: {getLanguageLabel(displayLanguage, tx)}
          </div>
        </div>
      </div>
      <i className="fa-solid fa-chevron-right text-[11px] text-[#c6c9d1] dark:text-white/35" />
    </button>
  )
}

export default function SettingsSheet({ open, onClose, isLoggedIn }) {
  const [darkMode, setDarkMode] = useState(() => getStoredTheme() === 'dark')
  const [languageOpen, setLanguageOpen] = useState(
  () => new URLSearchParams(window.location.search).get('language') === 'story'
)
  const [storyLanguage, setStoryLanguage] = useState(() => getStoredStoryLanguage())
  const { t: tx, language: displayLanguage } = useDisplayTranslation()

  useEffect(() => {
    applyTheme(darkMode ? 'dark' : 'light')
  }, [darkMode])

    useEffect(() => {
    if (!open) return
    let active = true
    setStoryLanguage(getStoryLanguageId())
    if (isLoggedIn) {
      loadStoryLanguageFromAccount()
        .then(() => {
          if (active) setStoryLanguage(getStoryLanguageId())
        })
        .catch(error => console.warn('STORY_LANGUAGE_LOAD_FAILED', error))
    }
    return () => { active = false }
  }, [open, isLoggedIn])

  const handleStoryLanguageChange = (languageId) => {
    setStoryLanguage(languageId)
    saveStoryLanguagePreference(languageId)
      .catch(error => console.warn('STORY_LANGUAGE_SYNC_FAILED', error))
  }

  const handleDisplayLanguageChange = (languageId) => {
    setDisplayLanguageId(languageId)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" aria-label={tx('mePage.closeSettings')} onClick={onClose} className="absolute inset-0 bg-black/35" />

      <LanguageSheet
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
        storyLanguage={storyLanguage}
        displayLanguage={displayLanguage}
        onStoryLanguageChange={handleStoryLanguageChange}
        onDisplayLanguageChange={handleDisplayLanguageChange}
        tx={tx}
      />

      <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-hidden rounded-t-[26px] bg-white px-4 pb-5 pt-4 shadow-2xl md:bottom-auto md:left-auto md:right-6 md:top-16 md:w-[320px] md:rounded-[22px] md:pb-4 dark:bg-[#12141d]">
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[#e5e7eb] md:hidden dark:bg-white/15" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-[#111827] dark:text-white">{tx('settings')}</div>
            <div className="mt-0.5 text-[12px] text-[#8d94a1] dark:text-white/50">{tx('accountAndAppOptions')}</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] dark:bg-white/10">
            <i className="fa-solid fa-times text-[13px] text-[#555] dark:text-white/70" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto pb-2">
          <div className="overflow-hidden rounded-[20px] border border-[#eceaf2] bg-white dark:border-white/10 dark:bg-[#171923]">
            <div className="divide-y divide-[#f0eef6] dark:divide-white/10">
              <MenuRow to={isLoggedIn ? '/profile/edit?from=me-settings' : '/login'} icon="far fa-user" title={tx('editProfile')} subtitle={tx('editProfileSub')} />
              <MenuRow to={isLoggedIn ? '/profile/settings?from=me-settings' : '/login'} icon="fa-solid fa-shield-alt" title={tx('accountSettings')} subtitle={tx('accountSettingsSub')} />
              <ThemeSwitchRow darkMode={darkMode} onChange={() => setDarkMode((value) => !value)} tx={tx} />
              <LanguageSummaryRow
                storyLanguage={storyLanguage}
                displayLanguage={displayLanguage}
                onClick={() => setLanguageOpen(true)}
                tx={tx}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

