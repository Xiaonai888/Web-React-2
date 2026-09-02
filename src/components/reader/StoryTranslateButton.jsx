import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('storyTranslateButton', {
  km: {
    translate: 'បកប្រែសាច់រឿង',
    original: 'ភាសាដើម',
    english: 'អង់គ្លេស',
    chinese: 'ចិន',
    japanese: 'ជប៉ុន',
    korean: 'កូរ៉េ',
    translating: 'កំពុងបកប្រែ…',
    failed: 'មិនអាចបកប្រែបាននៅពេលនេះ។',
    timeout: 'ការបកប្រែចំណាយពេលយូរពេក។ សូមព្យាយាមម្តងទៀត។',
    network: 'មិនអាចភ្ជាប់ទៅសេវាបកប្រែបានទេ។',
    limited: 'សំណើបកប្រែច្រើនពេក។ សូមរង់ចាំបន្តិច។',
    notConfigured: 'សេវាបកប្រែមិនទាន់រួចរាល់ទេ។',
  },
  en: {
    translate: 'Translate story',
    original: 'Original',
    english: 'English',
    chinese: 'Chinese',
    japanese: 'Japanese',
    korean: 'Korean',
    translating: 'Translating…',
    failed: 'Translation is unavailable right now.',
    timeout: 'Translation took too long. Please try again.',
    network: 'Cannot connect to the translation service.',
    limited: 'Too many translation requests. Please wait a moment.',
    notConfigured: 'Translation service is not ready yet.',
  },
  zh: {
    translate: '翻译正文',
    original: '原文',
    english: '英语',
    chinese: '中文',
    japanese: '日语',
    korean: '韩语',
    translating: '翻译中…',
    failed: '暂时无法翻译。',
    timeout: '翻译超时，请重试。',
    network: '无法连接翻译服务。',
    limited: '翻译请求过多，请稍候。',
    notConfigured: '翻译服务尚未准备好。',
  },
  ja: {
    translate: '本文を翻訳',
    original: '原文',
    english: '英語',
    chinese: '中国語',
    japanese: '日本語',
    korean: '韓国語',
    translating: '翻訳中…',
    failed: '現在翻訳できません。',
    timeout: '翻訳に時間がかかりすぎました。もう一度お試しください。',
    network: '翻訳サービスに接続できません。',
    limited: '翻訳リクエストが多すぎます。少しお待ちください。',
    notConfigured: '翻訳サービスはまだ準備できていません。',
  },
  ko: {
    translate: '본문 번역',
    original: '원문',
    english: '영어',
    chinese: '중국어',
    japanese: '일본어',
    korean: '한국어',
    translating: '번역 중…',
    failed: '현재 번역할 수 없습니다.',
    timeout: '번역 시간이 너무 오래 걸렸습니다. 다시 시도해 주세요.',
    network: '번역 서비스에 연결할 수 없습니다.',
    limited: '번역 요청이 너무 많습니다. 잠시 기다려 주세요.',
    notConfigured: '번역 서비스가 아직 준비되지 않았습니다.',
  },
})

const LANGUAGE_OPTIONS = [
  { id: 'original', labelKey: 'original' },
  { id: 'en', labelKey: 'english' },
  { id: 'zh', labelKey: 'chinese' },
  { id: 'ja', labelKey: 'japanese' },
  { id: 'ko', labelKey: 'korean' },
]

function getErrorKey(errorCode) {
  if (!errorCode) return ''

  if (
    errorCode === 'TEMPORARY_COOLDOWN' ||
    errorCode === 'TEMPORARY_RESTRICTION' ||
    errorCode === 'HTTP_429'
  ) {
    return 'limited'
  }

  if (
    errorCode === 'TRANSLATION_TIMEOUT' ||
    errorCode === 'HTTP_504'
  ) {
    return 'timeout'
  }

  if (errorCode === 'TRANSLATION_NETWORK_ERROR') {
    return 'network'
  }

  if (
    errorCode === 'TRANSLATION_NOT_CONFIGURED' ||
    errorCode === 'HTTP_503'
  ) {
    return 'notConfigured'
  }

  return 'failed'
}

export default function StoryTranslateButton({
  activeLanguage = 'original',
  loading = false,
  errorCode = '',
  disabled = false,
  onSelectLanguage,
}) {
  const { t } = useDisplayTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      )
      document.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [open])

  const handleSelect = async (language) => {
    if (loading || disabled) return

    const success = await onSelectLanguage?.(language)

    if (success !== false) {
      setOpen(false)
    }
  }

  const errorKey = getErrorKey(errorCode)

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={disabled || loading}
        aria-label={t('storyTranslateButton.translate')}
        aria-expanded={open}
        className={`flex h-10 w-10 items-center justify-center bg-transparent transition active:scale-95 disabled:opacity-50 ${
          activeLanguage === 'original'
            ? 'text-[var(--shadow-text-primary)]'
            : 'text-[#0b5cff]'
        }`}
      >
        <i
          className={`${
            loading
              ? 'fa-solid fa-spinner fa-spin'
              : 'fa-solid fa-globe'
          } text-[15px]`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-[82] w-[190px] overflow-hidden rounded-[10px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-elevated)] py-1 shadow-[0_12px_30px_rgba(17,24,39,0.16)]">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              disabled={loading}
              className="flex h-10 w-full items-center justify-between gap-3 px-3 text-left text-[13px] font-semibold text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-hover)] disabled:opacity-60"
            >
              <span>
                {t(
                  `storyTranslateButton.${option.labelKey}`
                )}
              </span>

              {activeLanguage === option.id ? (
                <i className="fa-solid fa-check text-[11px] text-[#0b5cff]" />
              ) : null}
            </button>
          ))}

          {loading ? (
            <div className="border-t border-[var(--shadow-border)] px-3 py-2 text-[11px] font-medium text-[var(--shadow-text-secondary)]">
              {t('storyTranslateButton.translating')}
            </div>
          ) : null}

          {!loading && errorKey ? (
            <div className="border-t border-[var(--shadow-border)] px-3 py-2 text-[11px] font-medium leading-5 text-[#e5484d]">
              {t(`storyTranslateButton.${errorKey}`)}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
