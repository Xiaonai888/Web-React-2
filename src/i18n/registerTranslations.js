import resources from './resources'

const SUPPORTED_LANGUAGES = ['km', 'en', 'zh', 'ja', 'ko']

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeDeep(target, source) {
  if (!isObject(source)) return target

  for (const [key, value] of Object.entries(source)) {
    if (isObject(value)) {
      if (!isObject(target[key])) {
        target[key] = {}
      }
      mergeDeep(target[key], value)
    } else {
      target[key] = value
    }
  }

  return target
}

export function registerTranslations(pack) {
  for (const language of SUPPORTED_LANGUAGES) {
    const translation = pack?.[language]

    if (!translation) continue

    if (!resources[language]) {
      resources[language] = { translation: {} }
    }

    if (!resources[language].translation) {
      resources[language].translation = {}
    }

    mergeDeep(resources[language].translation, translation)
  }
}

export function registerTranslationNamespace(namespace, pack) {
  if (!namespace) return

  const namespacedPack = {}

  for (const language of SUPPORTED_LANGUAGES) {
    if (!pack?.[language]) continue

    namespacedPack[language] = {
      [namespace]: pack[language],
    }
  }

  registerTranslations(namespacedPack)
}
