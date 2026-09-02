import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('chatStoryEditorGuide', {
  en: {
    quickGuide: 'Quick Guide',
    skip: 'Skip',
    back: 'Back',
    startCreating: 'Start Creating',
    next: 'Next',
  },
  km: {
    quickGuide: 'ការណែនាំរហ័ស',
    skip: 'រំលង',
    back: 'ត្រឡប់ក្រោយ',
    startCreating: 'ចាប់ផ្តើមបង្កើត',
    next: 'បន្ទាប់',
  },
  zh: {
    quickGuide: '快速指南',
    skip: '跳过',
    back: '返回',
    startCreating: '开始创作',
    next: '下一步',
  },
  ja: {
    quickGuide: 'クイックガイド',
    skip: 'スキップ',
    back: '戻る',
    startCreating: '作成を開始',
    next: '次へ',
  },
  ko: {
    quickGuide: '빠른 가이드',
    skip: '건너뛰기',
    back: '뒤로',
    startCreating: '만들기 시작',
    next: '다음',
  },
})

const DEFAULT_STORAGE_KEY = 'shadow_chat_editor_guide_v1'

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function readTargetRect(selector, padding) {
  if (!selector) return null

  const element = document.querySelector(selector)
  if (!element) return null

  const rect = element.getBoundingClientRect()

  return {
    top: Math.max(8, rect.top - padding),
    left: Math.max(8, rect.left - padding),
    width: Math.min(window.innerWidth - 16, rect.width + padding * 2),
    height: Math.min(window.innerHeight - 16, rect.height + padding * 2),
    element,
  }
}

export default function ChatStoryEditorGuide({
  open,
  steps = [],
  storageKey = DEFAULT_STORAGE_KEY,
  onClose,
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const { t } = useDisplayTranslation()

  const currentStep = steps[stepIndex] || null
  const isLastStep = stepIndex === steps.length - 1

  useEffect(() => {
    if (!open) return
    setStepIndex(0)
  }, [open])

  useEffect(() => {
    if (!open || !currentStep) return undefined

    let timeoutId = 0
    let frameId = 0

    const updatePosition = () => {
      frameId = window.requestAnimationFrame(() => {
        const nextRect = readTargetRect(
          currentStep.selector,
          Number(currentStep.padding ?? 8)
        )

        setTargetRect(nextRect)

        if (
          nextRect?.element &&
          (nextRect.top < 70 ||
            nextRect.top + nextRect.height > window.innerHeight - 220)
        ) {
          nextRect.element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          })

          timeoutId = window.setTimeout(() => {
            setTargetRect(
              readTargetRect(
                currentStep.selector,
                Number(currentStep.padding ?? 8)
              )
            )
          }, 360)
        }
      })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [currentStep, open])

  const tooltipStyle = useMemo(() => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const tooltipWidth = Math.min(360, viewportWidth - 24)
    const estimatedHeight = 230

    if (!targetRect) {
      return {
        width: tooltipWidth,
        left: (viewportWidth - tooltipWidth) / 2,
        top: Math.max(20, (viewportHeight - estimatedHeight) / 2),
      }
    }

    const preferredPlacement =
      currentStep?.placement === 'top' || currentStep?.placement === 'bottom'
        ? currentStep.placement
        : targetRect.top > estimatedHeight + 28
          ? 'top'
          : 'bottom'

    const left = clamp(
      targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
      12,
      viewportWidth - tooltipWidth - 12
    )

    const top =
      preferredPlacement === 'top'
        ? Math.max(12, targetRect.top - estimatedHeight - 14)
        : Math.min(
            viewportHeight - estimatedHeight - 12,
            targetRect.top + targetRect.height + 14
          )

    return {
      width: tooltipWidth,
      left,
      top,
    }
  }, [currentStep, targetRect])

  if (!open || !currentStep || !steps.length) return null

  const closeGuide = () => {
    localStorage.setItem(storageKey, 'completed')
    onClose?.()
  }

  const goNext = () => {
    if (isLastStep) {
      closeGuide()
      return
    }

    setStepIndex((current) => current + 1)
  }

  return (
    <div
      className="fixed inset-0 z-[500]"
      role="dialog"
      aria-modal="true"
      aria-label="Chat Story Editor guide"
    >
      {!targetRect ? (
        <div className="absolute inset-0 bg-[#111827]/75" />
      ) : (
        <div
          className="pointer-events-none fixed rounded-[16px] ring-2 ring-[#a78bfa]"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(17, 24, 39, 0.76)',
          }}
        />
      )}

      <div className="absolute inset-0" />

      <section
        className="absolute rounded-[22px] bg-[var(--shadow-bg-elevated)] p-5 shadow-2xl ring-1 ring-[var(--shadow-border)]"
        style={tooltipStyle}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#f1ebff] px-3 py-1 text-[10px] font-semibold text-[#7c3aed] dark:bg-[#7c3aed]/15 dark:text-[#c4b5fd]">
            {t('chatStoryEditorGuide.quickGuide')}
          </span>

          <span className="text-[11px] font-medium text-[var(--shadow-text-tertiary)]">
            {stepIndex + 1}/{steps.length}
          </span>
        </div>

        <h2 className="mt-4 text-[18px] font-bold leading-6 text-[var(--shadow-text-primary)]">
          {currentStep.title}
        </h2>

        <p className="mt-2 text-[12px] leading-5 text-[var(--shadow-text-secondary)]">
          {currentStep.description}
        </p>

        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((step, index) => (
            <span
              key={step.id || `${step.title}-${index}`}
              className={`h-1.5 rounded-full transition-all ${
                index === stepIndex
                  ? 'w-7 bg-[#7c3aed]'
                  : index < stepIndex
                    ? 'w-3 bg-[#c4b5fd]'
                    : 'w-3 bg-[var(--shadow-border)]'
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeGuide}
            className="h-10 px-2 text-[12px] font-medium text-[var(--shadow-text-secondary)]"
          >
            {t('chatStoryEditorGuide.skip')}
          </button>

          <div className="flex items-center gap-2">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStepIndex((current) => current - 1)}
                className="h-10 rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[12px] font-medium text-[var(--shadow-text-primary)]"
              >
                {t('chatStoryEditorGuide.back')}
              </button>
            ) : null}

            <button
              type="button"
              onClick={goNext}
              className="h-10 rounded-full bg-gradient-to-r from-[#9362ef] to-[#6d42db] px-5 text-[12px] font-semibold text-white active:scale-[0.98]"
            >
              {isLastStep ? t('chatStoryEditorGuide.startCreating') : t('chatStoryEditorGuide.next')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
