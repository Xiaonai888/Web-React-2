const STORY_SETTING_FILTER_STORAGE_KEY = 'shadow_story_setting_filter'
const STORY_SETTING_FILTER_ENABLED_KEY = 'shadow_story_setting_filter_enabled_v1'

const STORY_SETTING_VALUES = [
  'all',
  'Khmer',
  'Chinese',
  'Korean',
  'Japanese',
  'Western',
  'Other',
]

export function getStorySettingFilter() {
  try {
    const enabled =
      localStorage.getItem(
        STORY_SETTING_FILTER_ENABLED_KEY
      ) === '1'

    if (!enabled) return 'all'

    const value =
      localStorage.getItem(
        STORY_SETTING_FILTER_STORAGE_KEY
      ) || 'all'

    return STORY_SETTING_VALUES.includes(value)
      ? value
      : 'all'
  } catch {
    return 'all'
  }
}

export function setStorySettingFilter(value) {
  const nextValue =
    STORY_SETTING_VALUES.includes(value)
      ? value
      : 'all'

  try {
    localStorage.setItem(
      STORY_SETTING_FILTER_STORAGE_KEY,
      nextValue
    )

    localStorage.setItem(
      STORY_SETTING_FILTER_ENABLED_KEY,
      '1'
    )

    window.dispatchEvent(
      new CustomEvent(
        'shadow-story-setting-filter-change',
        {
          detail: { value: nextValue },
        }
      )
    )
  } catch {}

  return nextValue
}

export function getStorySettingFilterValue() {
  const value = getStorySettingFilter()

  return value === 'all' ? '' : value
}

export function addStorySettingParam(url) {
  const value = getStorySettingFilterValue()

  if (!value) return url

  const separator =
    url.includes('?') ? '&' : '?'

  return `${url}${separator}story_setting=${encodeURIComponent(value)}`
}

export {
  STORY_SETTING_FILTER_STORAGE_KEY,
  STORY_SETTING_FILTER_ENABLED_KEY,
  STORY_SETTING_VALUES,
}
