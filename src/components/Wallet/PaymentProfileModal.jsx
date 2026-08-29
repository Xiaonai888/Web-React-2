import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('paymentProfileModal', {
  en: {
    title: 'Payment Profile',
    help: 'Use the same name as your payment account.',
    example: 'Example: KEO DARIYA / DARIYA KEO',
    accountName: 'Payment account name',
    saving: 'Saving...',
    save: 'Save',
    cancel: 'Cancel',
    required: 'Payment account name is required.',
    saveFailed: 'Failed to save payment profile.',
  },
  km: {
    title: 'ព័ត៌មានការទូទាត់',
    help: 'ប្រើឈ្មោះដូចគ្នានឹងគណនីទទួលការទូទាត់របស់អ្នក។',
    example: 'ឧទាហរណ៍៖ KEO DARIYA / DARIYA KEO',
    accountName: 'ឈ្មោះគណនីទទួលការទូទាត់',
    saving: 'កំពុងរក្សាទុក...',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    required: 'សូមបញ្ចូលឈ្មោះគណនីទទួលការទូទាត់។',
    saveFailed: 'មិនអាចរក្សាទុកព័ត៌មានការទូទាត់បានទេ។',
  },
  zh: {
    title: '付款资料',
    help: '请使用与你的付款账户相同的姓名。',
    example: '示例：KEO DARIYA / DARIYA KEO',
    accountName: '付款账户姓名',
    saving: '保存中...',
    save: '保存',
    cancel: '取消',
    required: '请输入付款账户姓名。',
    saveFailed: '无法保存付款资料。',
  },
  ja: {
    title: '支払いプロフィール',
    help: '支払い口座と同じ名前を使用してください。',
    example: '例：KEO DARIYA / DARIYA KEO',
    accountName: '支払い口座名',
    saving: '保存中...',
    save: '保存',
    cancel: 'キャンセル',
    required: '支払い口座名を入力してください。',
    saveFailed: '支払いプロフィールを保存できませんでした。',
  },
  ko: {
    title: '결제 프로필',
    help: '결제 계정과 동일한 이름을 사용하세요.',
    example: '예: KEO DARIYA / DARIYA KEO',
    accountName: '결제 계정 이름',
    saving: '저장 중...',
    save: '저장',
    cancel: '취소',
    required: '결제 계정 이름을 입력하세요.',
    saveFailed: '결제 프로필을 저장하지 못했습니다.',
  },
})

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://shadow-backend-kucw.onrender.com')

function getReaderToken() {
  return sessionStorage.getItem('shadow_reader_token') || localStorage.getItem('shadow_reader_token') || ''
}

function getHeaders() {
  const token = getReaderToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export default function PaymentProfileModal({ initialValue = '', onClose, onSaved }) {
  const { t } = useDisplayTranslation()
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setValue(initialValue)
    setMessage('')
  }, [initialValue])

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow
    const htmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = htmlOverflow
    }
  }, [])

  async function savePaymentProfile() {
    if (saving) return

    const normalizedName = String(value || '').trim().toUpperCase()

    if (normalizedName.length < 2) {
      setMessage(t('paymentProfileModal.required'))
      return
    }

    try {
      setSaving(true)
      setMessage('')

      const response = await fetch(`${API_BASE_URL}/api/users/payment-profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ payment_account_name: normalizedName }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('paymentProfileModal.saveFailed'))
      }

      const savedUser = {
        ...(data.user || {}),
        payment_account_name:
          data.user?.payment_account_name || normalizedName,
      }

      onSaved?.(savedUser)
    } catch (error) {
      setMessage(error.message || t('paymentProfileModal.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 sm:items-center sm:px-4">
      <div className="app-card w-full rounded-t-[28px] p-5 shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="app-title text-[20px] font-bold">
              {t('paymentProfileModal.title')}
            </h3>
            <p className="app-muted mt-1 text-[12px] font-semibold leading-5">
              {t('paymentProfileModal.help')}
            </p>
            <p className="app-tertiary mt-1 text-[11px] font-semibold">
              {t('paymentProfileModal.example')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="app-soft flex h-9 w-9 items-center justify-center rounded-full active:scale-95"
          >
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        <label className="app-muted text-[11px] font-normal uppercase tracking-[0.1em]">
          {t('paymentProfileModal.accountName')}
        </label>

        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="KEO DARIYA"
          className="app-input mt-2 h-12 w-full rounded-[16px] border px-4 text-[14px] font-normal uppercase outline-none focus:border-[var(--shadow-border-strong)]"
        />

        {message ? (
          <p className="app-title mt-3 text-center text-[12px] font-bold">
            {message}
          </p>
        ) : null}

        <button
          type="button"
          onClick={savePaymentProfile}
          disabled={saving}
          className="mt-4 h-12 w-full rounded-[18px] bg-[#111111] text-[14px] font-normal text-white active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-[#111111]"
        >
          {saving
            ? t('paymentProfileModal.saving')
            : t('paymentProfileModal.save')}
        </button>

        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="app-card mt-3 h-12 w-full rounded-[18px] border text-[14px] font-normal active:scale-[0.99] disabled:opacity-60"
        >
          {t('paymentProfileModal.cancel')}
        </button>
      </div>
    </div>,
    document.body
  )
}
