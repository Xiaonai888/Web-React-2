
import React from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('planSection', {
  "en": {
    "plans": "Plans",
    "intro": "Free, VIP, and Premium plan content will go here.",
    "placeholder": "Plan Section Placeholder",
    "ready": "Ready for Free / VIP / Premium UI"
  },
  "km": {
    "plans": "គម្រោង",
    "intro": "មាតិកាគម្រោង Free, VIP និង Premium នឹងបង្ហាញនៅទីនេះ។",
    "placeholder": "កន្លែងសម្រាប់ផ្នែកគម្រោង",
    "ready": "រួចរាល់សម្រាប់ UI Free / VIP / Premium"
  },
  "zh": {
    "plans": "方案",
    "intro": "Free、VIP 和 Premium 方案内容将显示在这里。",
    "placeholder": "方案区占位内容",
    "ready": "已准备好 Free / VIP / Premium 界面"
  },
  "ja": {
    "plans": "プラン",
    "intro": "Free、VIP、Premium プランの内容がここに表示されます。",
    "placeholder": "プランセクションのプレースホルダー",
    "ready": "Free / VIP / Premium UI の準備完了"
  },
  "ko": {
    "plans": "플랜",
    "intro": "Free, VIP, Premium 플랜 콘텐츠가 여기에 표시됩니다.",
    "placeholder": "플랜 섹션 자리 표시자",
    "ready": "Free / VIP / Premium UI 준비 완료"
  }
})


export default function PlanSection() {
  const { t } = useDisplayTranslation()
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-6 shadow-sm">
        <p className="text-[15px] font-semibold text-[var(--shadow-text-primary)]">{t('planSection.plans')}</p>
        <p className="mt-2 text-[13px] leading-6 text-[var(--shadow-text-secondary)]">
          {t('planSection.intro')}
        </p>
      </div>

      <div className="rounded-3xl border border-dashed border-[var(--shadow-border-strong)] bg-[var(--shadow-bg-soft)] p-8 text-center">
        <p className="text-[14px] font-semibold text-[var(--shadow-text-primary)]">{t('planSection.placeholder')}</p>
        <p className="mt-2 text-[13px] text-[var(--shadow-text-secondary)]">
          {t('planSection.ready')}
        </p>
      </div>
    </section>
  )
}
