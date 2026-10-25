import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('paymentProfileModal', {
  en: {
    title: 'Payment Profile',
    help: 'Use the name and UID shown in your payment accounts.',
    bankSection: 'Bank',
    binanceSection: 'Binance Pay',
    accountName: 'Payment account name',
    bankExample: 'Example: KEO DARIYA / DARIYA KEO',
    binanceName: 'Binance Name',
    binanceUid: 'Binance UID',
    binanceHint: 'Enter the name and numeric UID from your own Binance account.',
    saving: 'Saving...',
    loading: 'Loading account details...',
    save: 'Save',
    cancel: 'Cancel',
    required: 'Enter a Bank account name or your Binance Name and UID.',
    binanceBoth: 'Enter both Binance Name and Binance UID.',
    invalidUid: 'Enter a valid numeric Binance UID (5–20 digits).',
    invalidName: 'Account names must contain 2–80 characters.',
    binanceNotSaved: 'Binance details could not be saved yet. Please try again after the payment-profile service is updated.',
    loadFailed: 'Could not load your Binance details. Please reopen this form.',
    saveFailed: 'Failed to save payment profile.',
  },
  km: {
    title: 'ព័ត៌មានការទូទាត់',
    help: 'ប្រើឈ្មោះ និង UID ដូចដែលបង្ហាញក្នុងគណនីទូទាត់របស់អ្នក។',
    bankSection: 'ធនាគារ',
    binanceSection: 'Binance Pay',
    accountName: 'ឈ្មោះគណនីទទួលការទូទាត់',
    bankExample: 'ឧទាហរណ៍៖ KEO DARIYA / DARIYA KEO',
    binanceName: 'ឈ្មោះ Binance',
    binanceUid: 'Binance UID',
    binanceHint: 'បញ្ចូលឈ្មោះ និងលេខ UID ពិតពីគណនី Binance របស់អ្នក។',
    saving: 'កំពុងរក្សាទុក...',
    loading: 'កំពុងទាញព័ត៌មានគណនី...',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    required: 'សូមបញ្ចូលឈ្មោះគណនីធនាគារ ឬឈ្មោះ Binance និង UID។',
    binanceBoth: 'សូមបញ្ចូលទាំងឈ្មោះ Binance និង Binance UID។',
    invalidUid: 'សូមបញ្ចូល Binance UID ជាលេខត្រឹមត្រូវ (៥–២០ ខ្ទង់)។',
    invalidName: 'ឈ្មោះគណនីត្រូវមានពី ២ ដល់ ៨០ តួអក្សរ។',
    binanceNotSaved: 'ព័ត៌មាន Binance មិនទាន់អាចរក្សាទុកបានទេ។ សូមសាកល្បងម្ដងទៀតក្រោយ Update ប្រព័ន្ធ Payment Profile។',
    loadFailed: 'មិនអាចទាញព័ត៌មាន Binance បានទេ។ សូមបើកផ្ទាំងនេះម្ដងទៀត។',
    saveFailed: 'មិនអាចរក្សាទុកព័ត៌មានការទូទាត់បានទេ។',
  },
  zh: {
    title: '付款资料',
    help: '请填写付款账户中显示的姓名和 UID。',
    bankSection: '银行',
    binanceSection: 'Binance Pay',
    accountName: '付款账户姓名',
    bankExample: '示例：KEO DARIYA / DARIYA KEO',
    binanceName: 'Binance 姓名',
    binanceUid: 'Binance UID',
    binanceHint: '请输入您本人 Binance 账户的姓名和数字 UID。',
    saving: '保存中...',
    loading: '正在加载账户信息...',
    save: '保存',
    cancel: '取消',
    required: '请输入银行账户姓名，或 Binance 姓名和 UID。',
    binanceBoth: '请同时输入 Binance 姓名和 UID。',
    invalidUid: '请输入有效的数字 Binance UID（5–20 位）。',
    invalidName: '账户姓名长度必须为 2–80 个字符。',
    binanceNotSaved: '尚无法保存 Binance 资料。请等待付款资料服务更新后重试。',
    loadFailed: '无法加载 Binance 资料。请重新打开此表单。',
    saveFailed: '保存付款资料失败。',
  },
  ja: {
    title: '支払いプロフィール',
    help: '支払いアカウントに表示される名前と UID を入力してください。',
    bankSection: '銀行',
    binanceSection: 'Binance Pay',
    accountName: '支払い口座名',
    bankExample: '例：KEO DARIYA / DARIYA KEO',
    binanceName: 'Binance 名義',
    binanceUid: 'Binance UID',
    binanceHint: 'ご自身の Binance アカウントの名前と数字の UID を入力してください。',
    saving: '保存中...',
    loading: 'アカウント情報を読み込み中...',
    save: '保存',
    cancel: 'キャンセル',
    required: '銀行口座名、または Binance 名義と UID を入力してください。',
    binanceBoth: 'Binance 名義と UID の両方を入力してください。',
    invalidUid: '有効な数字の Binance UID（5～20 桁）を入力してください。',
    invalidName: 'アカウント名は 2～80 文字で入力してください。',
    binanceNotSaved: 'Binance 情報をまだ保存できません。プロフィールサービスの更新後にお試しください。',
    loadFailed: 'Binance 情報を読み込めません。画面を開き直してください。',
    saveFailed: '支払いプロフィールを保存できませんでした。',
  },
  ko: {
    title: '결제 프로필',
    help: '결제 계정에 표시된 이름과 UID를 입력하세요.',
    bankSection: '은행',
    binanceSection: 'Binance Pay',
    accountName: '결제 계정 이름',
    bankExample: '예: KEO DARIYA / DARIYA KEO',
    binanceName: 'Binance 이름',
    binanceUid: 'Binance UID',
    binanceHint: '본인 Binance 계정의 이름과 숫자 UID를 입력하세요.',
    saving: '저장 중...',
    loading: '계정 정보를 불러오는 중...',
    save: '저장',
    cancel: '취소',
    required: '은행 계정 이름 또는 Binance 이름과 UID를 입력하세요.',
    binanceBoth: 'Binance 이름과 UID를 모두 입력하세요.',
    invalidUid: '올바른 숫자 Binance UID(5~20자리)를 입력하세요.',
    invalidName: '계정 이름은 2~80자여야 합니다.',
    binanceNotSaved: '아직 Binance 정보를 저장할 수 없습니다. 결제 프로필 서비스 업데이트 후 다시 시도하세요.',
    loadFailed: 'Binance 정보를 불러오지 못했습니다. 이 화면을 다시 여세요.',
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

export default function PaymentProfileModal({ initialValue = '', showBank = true, showBinance = true, onClose, onSaved }) {
  const { t } = useDisplayTranslation()
  const [bankName, setBankName] = useState(initialValue)
  const [binanceName, setBinanceName] = useState('')
  const [binanceUid, setBinanceUid] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: 'GET',
          headers: getHeaders(),
          cache: 'no-store',
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || !data.ok || !data.user) throw new Error('Unable to load payment profile')
        if (!active) return
        setBankName(String(data.user.payment_account_name || initialValue))
        setBinanceName(String(data.user.binance_name || ''))
        setBinanceUid(String(data.user.binance_uid || ''))
        setLoadError(false)
      } catch {
        if (active) setLoadError(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProfile()
    return () => { active = false }
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
    if (saving || loading || loadError) return

    const normalizedBank = String(bankName || '').trim().toUpperCase()
    const normalizedBinanceName = String(binanceName || '').trim()
    const normalizedBinanceUid = String(binanceUid || '').trim()
    const hasBinance = Boolean(normalizedBinanceName || normalizedBinanceUid)

    if (!normalizedBank && !hasBinance) {
      setMessage(t('paymentProfileModal.required'))
      return
    }
    if ((normalizedBank && (normalizedBank.length < 2 || normalizedBank.length > 80)) ||
      (normalizedBinanceName && (normalizedBinanceName.length < 2 || normalizedBinanceName.length > 80))) {
      setMessage(t('paymentProfileModal.invalidName'))
      return
    }
    if (hasBinance && (!normalizedBinanceName || !normalizedBinanceUid)) {
      setMessage(t('paymentProfileModal.binanceBoth'))
      return
    }
    if (hasBinance && !/^\d{5,20}$/.test(normalizedBinanceUid)) {
      setMessage(t('paymentProfileModal.invalidUid'))
      return
    }

    try {
      setSaving(true)
      setMessage('')
      const response = await fetch(`${API_BASE_URL}/api/users/payment-profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          payment_account_name: normalizedBank,
          binance_name: normalizedBinanceName,
          binance_uid: normalizedBinanceUid,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.ok) {
        throw new Error(data.message || t('paymentProfileModal.saveFailed'))
      }
      if (hasBinance && (
        String(data.user?.binance_name || '').trim() !== normalizedBinanceName ||
        String(data.user?.binance_uid || '').trim() !== normalizedBinanceUid
      )) {
        throw new Error(t('paymentProfileModal.binanceNotSaved'))
      }
      onSaved?.({
        ...(data.user || {}),
        payment_account_name: data.user?.payment_account_name || normalizedBank,
        binance_name: data.user?.binance_name || '',
        binance_uid: data.user?.binance_uid || '',
      })
    } catch (error) {
      setMessage(error.message || t('paymentProfileModal.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 sm:items-center sm:px-4">
      <div className="app-card max-h-[calc(100dvh-12px)] w-full overflow-y-auto overscroll-contain rounded-t-[28px] p-5 shadow-2xl sm:max-w-[430px] sm:rounded-[28px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="app-title text-[20px] font-bold">{t('paymentProfileModal.title')}</h3>
            <p className="app-muted mt-1 text-[12px] font-semibold leading-5">{t('paymentProfileModal.help')}</p>
          </div>
          <button type="button" onClick={onClose} className="app-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:scale-95" aria-label={t('paymentProfileModal.cancel')}>
            <i className="fas fa-times text-[14px]" />
          </button>
        </div>

        {loading ? <p className="app-muted mb-3 text-[12px]">{t('paymentProfileModal.loading')}</p> : null}

        {showBank ? (
          <section>
            <h4 className="app-title mb-2 text-[13px] font-bold">{t('paymentProfileModal.bankSection')}</h4>
            <label htmlFor="shadow-payment-bank-name" className="app-muted text-[11px] font-normal uppercase tracking-[0.1em]">
              {t('paymentProfileModal.accountName')}
            </label>
            <input id="shadow-payment-bank-name" value={bankName} onChange={(event) => setBankName(event.target.value)} disabled={loading || saving || loadError} placeholder="KEO DARIYA" maxLength={80} autoComplete="name" className="app-input mt-2 h-12 w-full rounded-[16px] border px-4 text-[14px] font-normal uppercase outline-none focus:border-[var(--shadow-border-strong)] disabled:opacity-60" />
            <p className="app-tertiary mt-2 text-[11px] font-semibold">{t('paymentProfileModal.bankExample')}</p>
          </section>
        ) : null}

        {showBinance ? (
          <section className={showBank ? 'mt-5 border-t border-[var(--shadow-border)] pt-5' : ''}>
            <h4 className="app-title mb-2 text-[13px] font-bold">{t('paymentProfileModal.binanceSection')}</h4>
            <p className="app-tertiary mb-3 text-[11px] leading-5">{t('paymentProfileModal.binanceHint')}</p>
            <label htmlFor="shadow-payment-binance-name" className="app-muted text-[11px] font-normal uppercase tracking-[0.1em]">
              {t('paymentProfileModal.binanceName')}
            </label>
            <input id="shadow-payment-binance-name" value={binanceName} onChange={(event) => setBinanceName(event.target.value)} disabled={loading || saving || loadError} placeholder={t('paymentProfileModal.binanceName')} maxLength={80} autoComplete="off" className="app-input mt-2 h-12 w-full rounded-[16px] border px-4 text-[14px] font-normal outline-none focus:border-[var(--shadow-border-strong)] disabled:opacity-60" />
            <label htmlFor="shadow-payment-binance-uid" className="app-muted mt-4 block text-[11px] font-normal uppercase tracking-[0.1em]">
              {t('paymentProfileModal.binanceUid')}
            </label>
            <input id="shadow-payment-binance-uid" value={binanceUid} onChange={(event) => setBinanceUid(event.target.value.replace(/[^0-9]/g, ''))} disabled={loading || saving || loadError} placeholder="123456789" maxLength={20} inputMode="numeric" pattern="[0-9]*" autoComplete="off" className="app-input mt-2 h-12 w-full rounded-[16px] border px-4 text-[14px] font-normal outline-none focus:border-[var(--shadow-border-strong)] disabled:opacity-60" />
          </section>
        ) : null}

        {loadError ? <p role="alert" className="app-title mt-3 text-center text-[12px] font-bold">{t('paymentProfileModal.loadFailed')}</p> : null}
        {message ? <p role="alert" className="app-title mt-3 text-center text-[12px] font-bold">{message}</p> : null}

        <button type="button" onClick={savePaymentProfile} disabled={saving || loading || loadError} className="mt-5 h-12 w-full rounded-[18px] bg-[#111111] text-[14px] font-normal text-white active:scale-[0.99] disabled:opacity-60 dark:bg-white dark:text-[#111111]">
          {saving ? t('paymentProfileModal.saving') : t('paymentProfileModal.save')}
        </button>
        <button type="button" onClick={onClose} disabled={saving} className="app-card mt-3 h-12 w-full rounded-[18px] border text-[14px] font-normal active:scale-[0.99] disabled:opacity-60">
          {t('paymentProfileModal.cancel')}
        </button>
      </div>
    </div>,
    document.body
  )
}
