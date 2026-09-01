import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('shopSection', {
  en: {
    shop: 'Shop',
  },
  km: {
    shop: 'ហាង',
  },
  zh: {
    shop: '商店',
  },
  ja: {
    shop: 'ショップ',
  },
  ko: {
    shop: '상점',
  },
})

export default function ShopSection() {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="group cursor-pointer text-center"
      onClick={() => navigate('/shop')}
    >
      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] transition-all group-hover:bg-[var(--shadow-bg-hover)]">
        <i className="fas fa-shopping-bag text-[var(--shadow-text-secondary)] group-hover:text-blue-600" />
      </div>
      <span className="text-[10px] font-semibold text-[var(--shadow-text-secondary)]">
        {t('shopSection.shop')}
      </span>
    </div>
  )
}
