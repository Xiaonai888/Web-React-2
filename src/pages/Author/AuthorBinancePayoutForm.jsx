import { useEffect, useRef, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { getDisplayLanguageId } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { optimizeImageForUpload } from '../../utils/imageUploadOptimizer'

registerTranslationNamespace('authorBinancePayout', {
  en: {
    title: 'Binance Payout', description: 'Receive author payouts through your Binance account.', accountName: 'Account holder name', bankName: 'Bank name', uid: 'Binance UID', payId: 'Binance Pay ID', optional: 'At least one ID is required', upload: 'Upload receiving QR', change: 'Change QR', remove: 'Remove QR', formats: 'PNG, JPG, WEBP or GIF · Maximum 2 MB', notice: 'Use your own Binance account. Saving a QR or ID does not verify account ownership.', required: 'Enter your name, at least one Binance ID, and upload your receiving QR.', invalidId: 'Binance UID and Pay ID must be 4–64 letters, numbers, underscores or hyphens.', invalidImage: 'Choose a valid QR image of 2 MB or less.', loadError: 'Could not load your Binance payout details.', saveError: 'Could not save your Binance payout details.', saved: 'Binance payout details saved.', save: 'Save & Continue', saving: 'Saving...', cancel: 'Back to methods', loading: 'Loading Binance details...'
  },
  km: {
    title: 'ទទួលប្រាក់តាម Binance', description: 'ទទួលប្រាក់អ្នកនិពន្ធតាមគណនី Binance របស់អ្នក។', accountName: 'ឈ្មោះម្ចាស់គណនី', bankName: 'ឈ្មោះធនាគារ', uid: 'Binance UID', payId: 'Binance Pay ID', optional: 'ត្រូវបញ្ចូល ID យ៉ាងហោចណាស់មួយ', upload: 'បញ្ចូល QR ទទួលប្រាក់', change: 'ប្ដូរ QR', remove: 'លុប QR', formats: 'PNG, JPG, WEBP ឬ GIF · អតិបរមា 2 MB', notice: 'ប្រើគណនី Binance ផ្ទាល់ខ្លួន។ ការរក្សាទុក QR ឬ ID មិនមានន័យថាបានផ្ទៀងផ្ទាត់ម្ចាស់គណនីទេ។', required: 'សូមបញ្ចូលឈ្មោះ ID យ៉ាងហោចណាស់មួយ និង QR ទទួលប្រាក់។', invalidId: 'Binance UID និង Pay ID ត្រូវមាន ៤–៦៤ តួអក្សរ (អក្សរ លេខ _ ឬ -)។', invalidImage: 'សូមជ្រើស QR ត្រឹមត្រូវដែលមានទំហំមិនលើស 2 MB។', loadError: 'មិនអាចទាញព័ត៌មាន Binance បានទេ។', saveError: 'មិនអាចរក្សាទុកព័ត៌មាន Binance បានទេ។', saved: 'បានរក្សាទុកព័ត៌មាន Binance រួចរាល់។', save: 'រក្សាទុក និងបន្ត', saving: 'កំពុងរក្សាទុក...', cancel: 'ត្រឡប់ទៅវិធីទទួលប្រាក់', loading: 'កំពុងផ្ទុកព័ត៌មាន Binance...'
  },
  zh: {
    title: 'Binance 收款', description: '通过 Binance 账户收取作者款项。', accountName: '账户持有人姓名', bankName: '银行名称', uid: 'Binance UID', payId: 'Binance Pay ID', optional: '至少填写一种 ID', upload: '上传收款二维码', change: '更换二维码', remove: '删除二维码', formats: 'PNG、JPG、WEBP 或 GIF · 最大 2 MB', notice: '请使用您自己的 Binance 账户。保存二维码或 ID 并不代表验证了所有权。', required: '请填写姓名、至少一个 Binance ID 和收款二维码。', invalidId: 'UID 和 Pay ID 需为 4–64 位字母、数字、下划线或连字符。', invalidImage: '请选择有效且不超过 2 MB 的二维码图片。', loadError: '无法加载 Binance 收款资料。', saveError: '无法保存 Binance 收款资料。', saved: 'Binance 收款资料已保存。', save: '保存并继续', saving: '保存中...', cancel: '返回收款方式', loading: '正在加载 Binance 信息...'
  },
  ja: {
    title: 'Binance 受取', description: 'Binance アカウントで作者収益を受け取ります。', accountName: '口座名義', bankName: '銀行名', uid: 'Binance UID', payId: 'Binance Pay ID', optional: '少なくとも一方の ID が必要です', upload: '受取 QR をアップロード', change: 'QR を変更', remove: 'QR を削除', formats: 'PNG、JPG、WEBP または GIF · 最大 2 MB', notice: '本人の Binance アカウントをご利用ください。QR と ID の保存は所有権の確認ではありません。', required: '氏名、少なくとも一つの ID と受取 QR を入力してください。', invalidId: 'UID と Pay ID は英数字、_、- の 4～64 文字で入力してください。', invalidImage: '2 MB 以下の有効な QR 画像を選択してください。', loadError: 'Binance 受取情報を読み込めません。', saveError: 'Binance 受取情報を保存できません。', saved: 'Binance 受取情報を保存しました。', save: '保存して続行', saving: '保存中...', cancel: '受取方法へ戻る', loading: 'Binance 情報を読み込み中...'
  },
  ko: {
    title: 'Binance 지급', description: 'Binance 계정으로 작가 수익을 받습니다.', accountName: '계정 소유자 이름', bankName: '은행 이름', uid: 'Binance UID', payId: 'Binance Pay ID', optional: 'ID 중 하나 이상 필수', upload: '수령 QR 업로드', change: 'QR 변경', remove: 'QR 삭제', formats: 'PNG, JPG, WEBP 또는 GIF · 최대 2 MB', notice: '본인의 Binance 계정을 사용하세요. QR 또는 ID 저장은 소유권 확인이 아닙니다.', required: '이름, Binance ID 하나 이상 및 수령 QR을 입력하세요.', invalidId: 'UID와 Pay ID는 영문, 숫자, _ 또는 - 로 4~64자여야 합니다.', invalidImage: '2 MB 이하의 올바른 QR 이미지를 선택하세요.', loadError: 'Binance 지급 정보를 불러올 수 없습니다.', saveError: 'Binance 지급 정보를 저장할 수 없습니다.', saved: 'Binance 지급 정보를 저장했습니다.', save: '저장하고 계속', saving: '저장 중...', cancel: '지급 방법으로 돌아가기', loading: 'Binance 정보를 불러오는 중...'
  }
})

const API_URL = import.meta.env.VITE_API_URL || 'https://shadow-backend-kucw.onrender.com'
const IDENTIFIER = /^[A-Za-z0-9_-]{4,64}$/
const BINANCE_ONE_ACCOUNT = {
  en: 'One Binance UID or Pay ID can be linked to only one author payout account.',
  km: 'Binance UID ឬ Pay ID មួយអាចភ្ជាប់បានតែគណនីទទួលប្រាក់អ្នកនិពន្ធមួយប៉ុណ្ណោះ។',
  zh: '一个 Binance UID 或 Pay ID 只能绑定一个作者收款账户。',
  ja: 'Binance UID または Pay ID は、作者の受取口座1つにのみ紐付けできます。',
  ko: 'Binance UID 또는 Pay ID 하나는 작가 수령 계정 하나에만 연결할 수 있습니다.',
}
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const token = () => localStorage.getItem('shadow_reader_token') || sessionStorage.getItem('shadow_reader_token')

function FormField({ label, value, onChange, placeholder, readOnly = false }) {
  return (
    <label className="block space-y-2">
      <span className="block text-[11.5px] font-black text-[var(--shadow-text-primary)]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={readOnly ? undefined : (event) => onChange(event.target.value)}
        readOnly={readOnly}
        aria-readonly={readOnly}
        placeholder={placeholder}
        className="h-[54px] w-full rounded-[17px] border border-[var(--shadow-border)] bg-[var(--shadow-input-bg)] px-4 text-[13.5px] font-semibold text-[var(--shadow-text-primary)] outline-none focus:border-[#956dca] read-only:opacity-75"
      />
    </label>
  )
}

export default function AuthorBinancePayoutForm({ onSaved, onCancel }) {
  const { t } = useDisplayTranslation()
  const [accountName, setAccountName] = useState('')
  const [uid, setUid] = useState('')
  const [payId, setPayId] = useState('')
  const [qr, setQr] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const lock = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    let alive = true
    async function load() {
      try {
        const auth = token()
        if (!auth) throw new Error(t('authorBinancePayout.loadError'))
        const response = await fetch(`${API_URL}/api/authors/me/binance-payout`, {
          headers: { Authorization: `Bearer ${auth}` }, signal: controller.signal, cache: 'no-store'
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data.ok === false) throw new Error(data.message || t('authorBinancePayout.loadError'))
        if (!alive) return
        const item = data.payment_method || {}
        setAccountName(item.account_name || '')
        setUid(item.binance_uid || '')
        setPayId(item.binance_pay_id || '')
        setQr(item.qr_image_url || '')
      } catch (caught) {
        if (alive && caught?.name !== 'AbortError') setError(caught.message || t('authorBinancePayout.loadError'))
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false; controller.abort() }
  }, [t])

  async function onPickImage(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || processing || saving) return
    setProcessing(true)
    setError('')
    try {
      if (!IMAGE_TYPES.includes(file.type)) throw new Error(t('authorBinancePayout.invalidImage'))
      const optimized = await optimizeImageForUpload(file, { preset: 'default', force: true })
      const image = optimized?.file
      if (!image || image.size > 2 * 1024 * 1024 || !IMAGE_TYPES.includes(image.type)) throw new Error(t('authorBinancePayout.invalidImage'))
      const preview = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ''))
        reader.onerror = () => reject(new Error(t('authorBinancePayout.invalidImage')))
        reader.readAsDataURL(image)
      })
      if (!/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(preview)) throw new Error(t('authorBinancePayout.invalidImage'))
      setQr(preview)
      setSuccess('')
    } catch (caught) {
      setError(caught.message || t('authorBinancePayout.invalidImage'))
    } finally {
      setProcessing(false)
    }
  }

  async function submit(event) {
    event.preventDefault()
    if (lock.current || processing || loading) return
    const name = accountName.trim()
    const binanceUid = uid.trim()
    const binancePayId = payId.trim()
    if (name.length < 2 || name.length > 160 || (!binanceUid && !binancePayId) || !qr) {
      setError(t('authorBinancePayout.required'))
      return
    }
    if ((binanceUid && !IDENTIFIER.test(binanceUid)) || (binancePayId && !IDENTIFIER.test(binancePayId))) {
      setError(t('authorBinancePayout.invalidId'))
      return
    }
    const auth = token()
    if (!auth) {
      setError(t('authorBinancePayout.saveError'))
      return
    }
    lock.current = true
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const response = await fetch(`${API_URL}/api/authors/me/binance-payout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_name: name, binance_uid: binanceUid || null, binance_pay_id: binancePayId || null, qr_image_url: qr })
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 409) {
  throw new Error(BINANCE_ONE_ACCOUNT[getDisplayLanguageId()] || BINANCE_ONE_ACCOUNT.en)
}
      if (!response.ok || data.ok === false || !data.payment_method) throw new Error(data.message || t('authorBinancePayout.saveError'))
      setQr(data.payment_method.qr_image_url || qr)
      setSuccess(t('authorBinancePayout.saved'))
      onSaved?.(data.payment_method)
    } catch (caught) {
      setError(caught.message || t('authorBinancePayout.saveError'))
    } finally {
      lock.current = false
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[29px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] p-4 shadow-[0_12px_30px_rgba(86,61,118,0.08)]">
      <div className="rounded-[20px] border border-[#d2bee9] bg-[var(--shadow-bg-surface)] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#fff3d6] text-[#bd8518]"><i className="fa-solid fa-wallet text-[20px]" /></span>
          <div>
            <h2 className="text-[17px] font-black text-[var(--shadow-text-primary)]">{t('authorBinancePayout.title')}</h2>
            <p className="mt-1 text-[11px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorBinancePayout.description')}</p>
          </div>
        </div>
      </div>
      {loading ? <p className="text-[12px] text-[var(--shadow-text-secondary)]">{t('authorBinancePayout.loading')}</p> : null}
      {error ? <p role="alert" className="rounded-[15px] border border-[#efc7d5] bg-[#fff3f7] p-3 text-[11px] font-semibold text-[#ad3a65]">{error}</p> : null}
      {success ? <p role="status" className="rounded-[15px] border border-[#b9dec6] bg-[#effbf3] p-3 text-[11px] font-semibold text-[#36794b]">{success}</p> : null}
      <FormField label={t('authorBinancePayout.accountName')} value={accountName} onChange={setAccountName} placeholder="Account holder name" />
      <FormField label={t('authorBinancePayout.bankName')} value="Binance Auto" readOnly />
      <FormField label={t('authorBinancePayout.uid')} value={uid} onChange={setUid} placeholder="Binance UID" />
      <FormField label={t('authorBinancePayout.payId')} value={payId} onChange={setPayId} placeholder="Binance Pay ID" />
      <p className="text-[10.5px] font-semibold text-[var(--shadow-text-secondary)]">{t('authorBinancePayout.optional')}</p>
      <div>
        <p className="mb-2 text-[11.5px] font-black text-[var(--shadow-text-primary)]">{t('authorBinancePayout.upload')}</p>
        <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[#bfa8dd] bg-[var(--shadow-bg-surface)] p-4 text-center">
          {qr ? <img src={qr} alt="Binance receiving QR" className="max-h-[240px] max-w-full rounded-[14px] object-contain" /> : <i className="fa-solid fa-qrcode text-[38px] text-[#8b68ba]" />}
          <span className="mt-3 text-[12px] font-black text-[var(--shadow-text-primary)]">{qr ? t('authorBinancePayout.change') : t('authorBinancePayout.upload')}</span>
          <span className="mt-1 text-[10px] text-[var(--shadow-text-secondary)]">{t('authorBinancePayout.formats')}</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onPickImage} disabled={processing || saving || loading} className="hidden" />
        </label>
        {qr ? <button type="button" onClick={() => { setQr(''); setSuccess('') }} disabled={saving || processing} className="mt-2 text-[11px] font-bold text-[#cd557b]">{t('authorBinancePayout.remove')}</button> : null}
      </div>
      <div className="rounded-[17px] border border-[#ead5a2] bg-[#fff9e9] p-3 text-[11px] font-semibold leading-5 text-[#926d23]">{t('authorBinancePayout.notice')}</div>
      <p className="text-[11px] font-semibold leading-5 text-[var(--shadow-text-secondary)]">
  {BINANCE_ONE_ACCOUNT[getDisplayLanguageId()] || BINANCE_ONE_ACCOUNT.en}
</p>
      <button type="submit" disabled={loading || saving || processing} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8058b8_0%,#a568d0_100%)] text-[13px] font-black text-white disabled:opacity-60">
        {saving || processing ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-check" />}
        {saving ? t('authorBinancePayout.saving') : t('authorBinancePayout.save')}
      </button>
      {onCancel ? <button type="button" onClick={onCancel} disabled={saving || processing} className="h-10 w-full text-[11px] font-bold text-[#8263a0]">{t('authorBinancePayout.cancel')}</button> : null}
    </form>
  )
}
