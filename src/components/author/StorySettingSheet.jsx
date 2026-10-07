import { useEffect, useMemo, useState } from 'react'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

const STORY_SETTING_OPTIONS = [
  'Khmer',
  'Chinese',
  'Korean',
  'Japanese',
  'Western',
  'Other',
]

registerTranslationNamespace('storySettingSheet', {
  en: {
    title: 'Story Setting',
    back: 'Back',
    save: 'Save',
    search: 'Search & Custom Story Setting',
    selected: 'Selected ({{count}}/6)',
    custom: 'Custom',
    customPlaceholder: 'Write your custom story setting',
    add: 'Add',
    choose: 'Choose Story Setting',
    chooseHelp: 'Choose at least 1 and up to 6 story settings.',
    none: 'No Story Setting found.',
    required: 'Choose at least 1 Story Setting.',
  },
  km: {
    title: 'បរិបទសាច់រឿង',
    back: 'ត្រឡប់ក្រោយ',
    save: 'រក្សាទុក',
    search: 'ស្វែងរក និងបង្កើតបរិបទសាច់រឿង',
    selected: 'បានជ្រើស ({{count}}/6)',
    custom: 'ផ្ទាល់ខ្លួន',
    customPlaceholder: 'សរសេរបរិបទសាច់រឿងផ្ទាល់ខ្លួន',
    add: 'បន្ថែម',
    choose: 'ជ្រើសបរិបទសាច់រឿង',
    chooseHelp: 'ត្រូវជ្រើសយ៉ាងតិច 1 និងអាចជ្រើសបានដល់ 6។',
    none: 'រកមិនឃើញបរិបទសាច់រឿង។',
    required: 'ត្រូវជ្រើសបរិបទសាច់រឿងយ៉ាងតិច 1។',
  },
  zh: {
    title: '故事背景',
    back: '返回',
    save: '保存',
    search: '搜索并自定义故事背景',
    selected: '已选择 ({{count}}/6)',
    custom: '自定义',
    customPlaceholder: '输入自定义故事背景',
    add: '添加',
    choose: '选择故事背景',
    chooseHelp: '至少选择 1 个，最多选择 6 个故事背景。',
    none: '未找到故事背景。',
    required: '请至少选择 1 个故事背景。',
  },
  ja: {
    title: 'ストーリー設定',
    back: '戻る',
    save: '保存',
    search: '検索・カスタム設定',
    selected: '選択済み ({{count}}/6)',
    custom: 'カスタム',
    customPlaceholder: 'カスタム設定を入力',
    add: '追加',
    choose: 'ストーリー設定を選択',
    chooseHelp: '1つ以上、最大6つまで選択してください。',
    none: '設定が見つかりません。',
    required: '少なくとも1つ選択してください。',
  },
  ko: {
    title: '스토리 설정',
    back: '뒤로',
    save: '저장',
    search: '스토리 설정 검색 및 직접 입력',
    selected: '선택됨 ({{count}}/6)',
    custom: '직접 입력',
    customPlaceholder: '직접 스토리 설정 입력',
    add: '추가',
    choose: '스토리 설정 선택',
    chooseHelp: '최소 1개, 최대 6개까지 선택하세요.',
    none: '스토리 설정을 찾을 수 없습니다.',
    required: '스토리 설정을 최소 1개 선택하세요.',
  },
})

function normalizeValues(value) {
  if (!Array.isArray(value)) return []

  const next = []

  for (const item of value) {
    const text = String(item || '').trim()
    if (!text) continue

    const exists = next.some(
      (current) => current.toLowerCase() === text.toLowerCase()
    )

    if (!exists) next.push(text)
    if (next.length >= 6) break
  }

  return next
}

export default function StorySettingSheet({
  open,
  value,
  onClose,
  onSave,
}) {
  useDisplayTranslation()
  const [selected, setSelected] = useState(() => normalizeValues(value))
  const [search, setSearch] = useState('')
  const [customOpen, setCustomOpen] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [requiredMessage, setRequiredMessage] = useState('')

  useEffect(() => {
    if (!open) return

    setSelected(normalizeValues(value))
    setSearch('')
    setCustomOpen(false)
    setCustomValue('')
    setRequiredMessage('')
  }, [open, value])

  const visibleOptions = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return STORY_SETTING_OPTIONS

    return STORY_SETTING_OPTIONS.filter((item) =>
      item.toLowerCase().includes(query)
    )
  }, [search])

  if (!open) return null

  const toggleSetting = (setting) => {
    setRequiredMessage('')

    setSelected((current) => {
      const exists = current.some(
        (item) => item.toLowerCase() === setting.toLowerCase()
      )

      if (exists) {
        return current.filter(
          (item) => item.toLowerCase() !== setting.toLowerCase()
        )
      }

      if (current.length >= 6) return current

      return [...current, setting]
    })
  }

  const addCustom = () => {
    const setting = customValue.trim()

    if (!setting || selected.length >= 6) return

    const exists = selected.some(
      (item) => item.toLowerCase() === setting.toLowerCase()
    )

    if (exists) {
      setCustomValue('')
      setCustomOpen(false)
      return
    }

    setSelected((current) => [...current, setting])
    setCustomValue('')
    setCustomOpen(false)
    setRequiredMessage('')
  }

  const handleSave = () => {
    if (!selected.length) {
      setRequiredMessage(getDisplayText('storySettingSheet.required'))
      return
    }

    onSave(selected)
  }

  return (
    <div className="fixed inset-0 z-[220] overflow-y-auto bg-[var(--shadow-bg-surface)]">
      <header className="sticky top-0 z-20 bg-[var(--shadow-bg-surface)] px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[var(--shadow-text-primary)] active:scale-95"
            aria-label={getDisplayText('storySettingSheet.back')}
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>

          <h2 className="text-[17px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('storySettingSheet.title')}
          </h2>

          <button
            type="button"
            onClick={handleSave}
            className={`text-[14px] font-normal ${
              selected.length
                ? 'text-[#0b5cff]'
                : 'text-[var(--shadow-text-tertiary)]'
            }`}
          >
            {getDisplayText('storySettingSheet.save')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">
        <div className="flex h-12 items-center rounded-full bg-[var(--shadow-bg-soft)] px-4">
          <i className="fa-solid fa-magnifying-glass mr-3 text-[var(--shadow-placeholder)]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={getDisplayText('storySettingSheet.search')}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[14px] font-normal text-[var(--shadow-text-primary)]">
              {getDisplayText('storySettingSheet.selected', {
                count: selected.length,
              })}
            </div>

            <button
              type="button"
              onClick={() => setCustomOpen((current) => !current)}
              disabled={selected.length >= 6}
              className="rounded-full bg-[var(--shadow-text-primary)] px-4 py-2 text-[12px] font-normal text-[var(--shadow-bg-surface)] disabled:bg-[var(--shadow-bg-soft)] disabled:text-[var(--shadow-text-tertiary)]"
            >
              + {getDisplayText('storySettingSheet.custom')}
            </button>
          </div>

          {customOpen ? (
            <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-[var(--shadow-bg-soft)] p-2">
              <input
                value={customValue}
                onChange={(event) => setCustomValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addCustom()
                  }
                }}
                placeholder={getDisplayText('storySettingSheet.customPlaceholder')}
                autoFocus
                className="h-10 min-w-0 flex-1 bg-transparent px-3 text-[13px] font-normal text-[var(--shadow-text-primary)] outline-none placeholder:text-[var(--shadow-placeholder)]"
              />

              <button
                type="button"
                onClick={addCustom}
                disabled={!customValue.trim() || selected.length >= 6}
                className="h-10 rounded-full bg-[var(--shadow-text-primary)] px-4 text-[12px] font-normal text-[var(--shadow-bg-surface)] disabled:bg-[var(--shadow-bg-page)] disabled:text-[var(--shadow-text-tertiary)]"
              >
                {getDisplayText('storySettingSheet.add')}
              </button>
            </div>
          ) : null}

          {selected.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((setting) => (
                <button
                  key={setting}
                  type="button"
                  onClick={() => toggleSetting(setting)}
                  className="rounded-full bg-[#FFF1F3] px-4 py-2 text-[12px] font-normal text-[#FE526E]"
                >
                  {setting}
                  <span className="ml-2 text-[#FE526E]">×</span>
                </button>
              ))}
            </div>
          ) : null}

          {requiredMessage ? (
            <div className="mt-3 text-[12px] text-[#D92D20]">
              {requiredMessage}
            </div>
          ) : null}
        </div>

        <section className="mt-7">
          <h3 className="text-[15px] font-bold text-[var(--shadow-text-primary)]">
            {getDisplayText('storySettingSheet.choose')}
          </h3>
          <p className="mt-1 text-[11.5px] leading-5 text-[var(--shadow-text-tertiary)]">
            {getDisplayText('storySettingSheet.chooseHelp')}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleOptions.map((setting) => {
              const active = selected.some(
                (item) => item.toLowerCase() === setting.toLowerCase()
              )

              return (
                <button
                  key={setting}
                  type="button"
                  onClick={() => toggleSetting(setting)}
                  disabled={!active && selected.length >= 6}
                  className={`rounded-full px-4 py-2 text-[12px] font-normal ${
                    active
                      ? 'bg-[#FFF1F3] text-[#FE526E]'
                      : 'bg-[var(--shadow-bg-page)] text-[var(--shadow-text-tertiary)]'
                  } disabled:opacity-40`}
                >
                  {setting}
                </button>
              )
            })}
          </div>

          {!visibleOptions.length ? (
            <div className="py-10 text-center text-[13px] text-[var(--shadow-text-tertiary)]">
              {getDisplayText('storySettingSheet.none')}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  )
}
