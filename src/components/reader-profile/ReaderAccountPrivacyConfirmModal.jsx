import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('readerAccountPrivacyConfirm', {
  en: {
    enableTitle: 'Make your account private?',
    enableDescription: 'Only you and readers who follow you will be able to view your Reader Posts. Do you want to continue?',
    disableTitle: 'Make your account public?',
    disableDescription: 'Your Reader Posts will follow their individual visibility settings again. Do you want to continue?',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  km: {
    enableTitle: 'បើកគណនីឯកជន?',
    enableDescription: 'មានតែអ្នក និងអ្នកអានដែលបាន Follow អ្នកប៉ុណ្ណោះអាចមើល Reader Posts របស់អ្នក។ តើអ្នកចង់បន្តឬទេ?',
    disableTitle: 'បិទគណនីឯកជន?',
    disableDescription: 'Reader Posts របស់អ្នកនឹងត្រឡប់ទៅអនុវត្តតាមការកំណត់ Visibility របស់ Post នីមួយៗវិញ។ តើអ្នកចង់បន្តឬទេ?',
    confirm: 'បញ្ជាក់',
    cancel: 'បោះបង់',
  },
  zh: {
    enableTitle: '将账户设为私人账户？',
    enableDescription: '只有你和关注你的读者可以查看你的读者帖子。确定要继续吗？',
    disableTitle: '将账户恢复为公开账户？',
    disableDescription: '你的读者帖子将重新按照各自的可见性设置显示。确定要继续吗？',
    confirm: '确认',
    cancel: '取消',
  },
  ja: {
    enableTitle: 'アカウントを非公開にしますか？',
    enableDescription: 'あなたとフォロワーだけが読者投稿を閲覧できるようになります。続行しますか？',
    disableTitle: 'アカウントを公開に戻しますか？',
    disableDescription: '読者投稿はそれぞれの公開範囲設定に従って表示されます。続行しますか？',
    confirm: '確認',
    cancel: 'キャンセル',
  },
  ko: {
    enableTitle: '계정을 비공개로 전환할까요?',
    enableDescription: '본인과 팔로워만 독자 게시물을 볼 수 있게 됩니다. 계속할까요?',
    disableTitle: '계정을 공개로 전환할까요?',
    disableDescription: '독자 게시물이 각 게시물의 공개 범위 설정을 다시 따릅니다. 계속할까요?',
    confirm: '확인',
    cancel: '취소',
  },
})

export default function ReaderAccountPrivacyConfirmModal({ open, enablePrivate, onConfirm, onCancel, busy = false, error = '', t }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[360] flex items-center justify-center bg-black/60 px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-privacy-confirm-title"
      aria-describedby="reader-privacy-confirm-description"
    >
      <div className="w-full max-w-[380px] rounded-[26px] bg-[var(--shadow-bg-surface)] px-6 pb-6 pt-7 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f2] text-[#FE526E]">
          <i className="fa-solid fa-triangle-exclamation text-[26px]" aria-hidden="true" />
        </div>

        <h2 id="reader-privacy-confirm-title" className="mt-4 text-[20px] font-bold text-[var(--shadow-text-primary)]">
          {t(`readerAccountPrivacyConfirm.${enablePrivate ? 'enableTitle' : 'disableTitle'}`)}
        </h2>

        <p id="reader-privacy-confirm-description" className="mt-3 text-[13px] font-normal leading-6 text-[var(--shadow-text-secondary)]">
          {t(`readerAccountPrivacyConfirm.${enablePrivate ? 'enableDescription' : 'disableDescription'}`)}
        </p>

        {error ? <p role="alert" className="mt-3 text-[12px] text-[#FE526E]">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="h-12 w-full rounded-full bg-[#FE526E] text-[14px] font-medium text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {t('readerAccountPrivacyConfirm.confirm')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-12 w-full rounded-full border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] text-[14px] font-medium text-[var(--shadow-text-primary)] transition active:scale-[0.98] disabled:opacity-60"
          >
            {t('readerAccountPrivacyConfirm.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
