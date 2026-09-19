import { useEffect } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('giftConfirm', {
  en: { title: 'Confirm Gift', message: 'Are you sure you want to send this gift?', gift: 'Gift', total: 'Total Cost', balance: 'Your Balance', confirm: 'Confirm Gift', cancel: 'Cancel', insufficient: 'Not enough Diamonds' },
  km: { title: 'បញ្ជាក់ការផ្ញើអំណោយ', message: 'តើអ្នកប្រាកដថាចង់ផ្ញើអំណោយនេះមែនទេ?', gift: 'អំណោយ', total: 'ពេជ្រត្រូវចំណាយ', balance: 'ពេជ្រដែលមាន', confirm: 'បញ្ជាក់ការផ្ញើ', cancel: 'បោះបង់', insufficient: 'ពេជ្រមិនគ្រប់គ្រាន់' },
  zh: { title: '确认赠送', message: '确定要发送这份礼物吗？', gift: '礼物', total: '总花费', balance: '钻石余额', confirm: '确认赠送', cancel: '取消', insufficient: '钻石不足' },
  ja: { title: 'ギフト送信の確認', message: 'このギフトを送信しますか？', gift: 'ギフト', total: '合計費用', balance: 'ダイヤ残高', confirm: '送信を確定', cancel: 'キャンセル', insufficient: 'ダイヤが足りません' },
  ko: { title: '선물 보내기 확인', message: '이 선물을 보내시겠습니까?', gift: '선물', total: '총 비용', balance: '다이아 잔액', confirm: '선물 보내기 확인', cancel: '취소', insufficient: '다이아가 부족합니다' },
})

export default function GiftConfirmPopup({ open, gift, name, quantity, balance, sending, onCancel, onConfirm }) {
  const { t } = useDisplayTranslation()
  const cost = Number(gift?.price || 0) * Number(quantity || 1)
  const insufficient = Number(balance || 0) < cost

  useEffect(() => {
    if (!open || sending) return undefined
    const onEscape = (event) => {
      if (event.key === 'Escape') onCancel?.()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [open, sending, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 px-4 py-6">
      <button type="button" aria-label={t('giftConfirm.cancel')} disabled={sending} onClick={onCancel} className="absolute inset-0" />
      <section role="dialog" aria-modal="true" aria-labelledby="gift-confirm-heading" className="relative max-h-[calc(100dvh-32px)] w-full max-w-[340px] overflow-y-auto rounded-[22px] bg-[var(--shadow-bg-surface)] p-5 shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ff3b5f]/10 text-2xl">🎁</div>
        <h3 id="gift-confirm-heading" className="mt-3 text-center text-[17px] font-bold text-[var(--shadow-text-primary)]">{t('giftConfirm.title')}</h3>
        <p className="mt-1 text-center text-[12px] text-[var(--shadow-text-secondary)]">{t('giftConfirm.message')}</p>
        <div className="mt-4 space-y-3 rounded-[14px] bg-[var(--shadow-bg-soft)] p-3 text-[13px]">
          <div className="flex items-center justify-between gap-2 text-[var(--shadow-text-primary)]">
            <span className="text-[var(--shadow-text-secondary)]">{t('giftConfirm.gift')}</span>
            <span className="flex items-center gap-1.5 font-semibold"><img src={gift.image} alt="" className="h-7 w-7 object-contain" />{name} × {quantity}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-[var(--shadow-text-primary)]">
            <span className="text-[var(--shadow-text-secondary)]">{t('giftConfirm.total')}</span>
            <span className="flex items-center gap-1 font-bold"><img src="/assets/Icons/Diamond.svg" alt="" className="h-4 w-4" />{cost.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-[var(--shadow-text-primary)]">
            <span className="text-[var(--shadow-text-secondary)]">{t('giftConfirm.balance')}</span>
            <span className="flex items-center gap-1 font-semibold"><img src="/assets/Icons/Diamond.svg" alt="" className="h-4 w-4" />{Number(balance || 0).toLocaleString()}</span>
          </div>
        </div>
        {insufficient && <p className="mt-3 text-center text-[12px] font-semibold text-[#ff3b5f]">{t('giftConfirm.insufficient')}</p>}
        <button type="button" onClick={onConfirm} disabled={sending || insufficient} className="mt-4 w-full rounded-full bg-[#ff3b5f] px-4 py-3 text-[13px] font-bold text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
          {sending ? t('giftPopup.sending') : t('giftConfirm.confirm')}
        </button>
        <button type="button" onClick={onCancel} disabled={sending} className="mt-2 w-full rounded-full border border-[var(--shadow-border)] px-4 py-3 text-[13px] font-semibold text-[var(--shadow-text-primary)] disabled:opacity-50">{t('giftConfirm.cancel')}</button>
      </section>
    </div>
  )
}
