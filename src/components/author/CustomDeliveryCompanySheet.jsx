import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import useOverlayScrollLock from '../../hooks/useOverlayScrollLock'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { normalizeCustomDeliveryCompany, validateCustomDeliveryCompanyInput } from '../../utils/customDeliveryCompany'
import {
  prepareDeliveryCompanyLogoImage,
  uploadCustomDeliveryCompanyLogo,
} from '../../services/customDeliveryCompanyLogoUpload'
import {
  saveCustomDeliveryCompany,
  deleteCustomDeliveryCompany,
} from '../../services/customDeliveryCompanyApi'

registerTranslationNamespace('customDeliveryCompanySheet', {
  en: {
    add: 'Add Delivery Company', edit: 'Edit Delivery Company', close: 'Close', logo: 'Company Logo', uploadLogo: 'Choose Logo', changeLogo: 'Change Logo', logoHelp: 'Square logo · Maximum original size 10 MB', name: 'Company name', namePlaceholder: 'Enter delivery company name', fee: 'Delivery fee (USD)', save: 'Save Company', saving: 'Saving...', processing: 'Preparing logo...', uploading: 'Uploading logo', deleting: 'Deleting...', delete: 'Delete company', confirmDelete: 'Confirm delete', cancelDelete: 'Cancel', invalidName: 'Enter a company name (up to 80 characters).', invalidFee: 'Enter a delivery fee from $0 to $9,999.99, with up to 2 decimal places.', invalidLogo: 'Please choose a company logo.', saved: 'Company saved.', failed: 'Could not save the company.', deleted: 'Company deleted.', confirmDeleteHelp: 'Delete your custom company? Existing order history will remain unchanged.',
  },
  km: {
    add: 'បន្ថែមក្រុមហ៊ុនដឹកជញ្ជូន', edit: 'កែក្រុមហ៊ុនដឹកជញ្ជូន', close: 'បិទ', logo: 'ឡូហ្គោក្រុមហ៊ុន', uploadLogo: 'ជ្រើសរូប Logo', changeLogo: 'ប្ដូរ Logo', logoHelp: 'រូបការ៉េ · រូបដើមមិនលើស 10 MB', name: 'ឈ្មោះក្រុមហ៊ុន', namePlaceholder: 'បញ្ចូលឈ្មោះក្រុមហ៊ុន', fee: 'ថ្លៃដឹកជញ្ជូន (USD)', save: 'រក្សាទុកក្រុមហ៊ុន', saving: 'កំពុងរក្សាទុក...', processing: 'កំពុងរៀបចំរូប...', uploading: 'កំពុងបង្ហោះ Logo', deleting: 'កំពុងលុប...', delete: 'លុបក្រុមហ៊ុន', confirmDelete: 'បញ្ជាក់ការលុប', cancelDelete: 'បោះបង់', invalidName: 'សូមបញ្ចូលឈ្មោះក្រុមហ៊ុន មិនលើស 80 តួអក្សរ។', invalidFee: 'សូមបញ្ចូលថ្លៃចាប់ពី $0 ដល់ $9,999.99 ដោយមានទសភាគអតិបរមា 2 ខ្ទង់។', invalidLogo: 'សូមជ្រើសរូប Logo ក្រុមហ៊ុន។', saved: 'បានរក្សាទុកក្រុមហ៊ុន។', failed: 'មិនអាចរក្សាទុកក្រុមហ៊ុនបានទេ។', deleted: 'បានលុបក្រុមហ៊ុន។', confirmDeleteHelp: 'លុបក្រុមហ៊ុនផ្ទាល់ខ្លួន? ប្រវត្តិកម្មង់ចាស់នឹងរក្សាទុកដដែល។',
  },
  zh: {
    add: '添加配送公司', edit: '编辑配送公司', close: '关闭', logo: '公司标志', uploadLogo: '选择标志', changeLogo: '更换标志', logoHelp: '方形标志 · 原图最大 10 MB', name: '公司名称', namePlaceholder: '输入配送公司名称', fee: '配送费（美元）', save: '保存公司', saving: '保存中...', processing: '正在处理标志...', uploading: '正在上传标志', deleting: '删除中...', delete: '删除公司', confirmDelete: '确认删除', cancelDelete: '取消', invalidName: '请输入公司名称（最多 80 个字符）。', invalidFee: '请输入 $0 至 $9,999.99 的配送费，最多两位小数。', invalidLogo: '请选择公司标志。', saved: '公司已保存。', failed: '无法保存公司。', deleted: '公司已删除。', confirmDeleteHelp: '删除自定义公司？既有订单历史不会改变。',
  },
  ja: {
    add: '配送会社を追加', edit: '配送会社を編集', close: '閉じる', logo: '会社ロゴ', uploadLogo: 'ロゴを選択', changeLogo: 'ロゴを変更', logoHelp: '正方形ロゴ · 元画像は最大 10 MB', name: '会社名', namePlaceholder: '配送会社名を入力', fee: '配送料（USD）', save: '会社を保存', saving: '保存中...', processing: 'ロゴを準備中...', uploading: 'ロゴをアップロード中', deleting: '削除中...', delete: '会社を削除', confirmDelete: '削除を確認', cancelDelete: 'キャンセル', invalidName: '会社名は80文字以内で入力してください。', invalidFee: '配送料は $0～$9,999.99、少数は2桁まで入力してください。', invalidLogo: '会社ロゴを選択してください。', saved: '会社を保存しました。', failed: '会社を保存できませんでした。', deleted: '会社を削除しました。', confirmDeleteHelp: 'カスタム会社を削除しますか？過去の注文履歴は変わりません。',
  },
  ko: {
    add: '배송사 추가', edit: '배송사 편집', close: '닫기', logo: '회사 로고', uploadLogo: '로고 선택', changeLogo: '로고 변경', logoHelp: '정사각형 로고 · 원본 최대 10 MB', name: '회사 이름', namePlaceholder: '배송사 이름 입력', fee: '배송비 (USD)', save: '회사 저장', saving: '저장 중...', processing: '로고 준비 중...', uploading: '로고 업로드 중', deleting: '삭제 중...', delete: '회사 삭제', confirmDelete: '삭제 확인', cancelDelete: '취소', invalidName: '회사 이름은 80자 이내로 입력하세요.', invalidFee: '배송비는 $0~$9,999.99, 소수 둘째 자리까지 입력하세요.', invalidLogo: '회사 로고를 선택하세요.', saved: '회사가 저장되었습니다.', failed: '회사를 저장할 수 없습니다.', deleted: '회사가 삭제되었습니다.', confirmDeleteHelp: '사용자 지정 배송사를 삭제할까요? 기존 주문 내역은 유지됩니다.',
  },
})

export default function CustomDeliveryCompanySheet({ open, company = null, onClose, onSaved, onDeleted }) {
  const { t } = useDisplayTranslation()
  const normalized = normalizeCustomDeliveryCompany(company)
  const [companyName, setCompanyName] = useState('')
  const [fee, setFee] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [preparedLogo, setPreparedLogo] = useState(null)
  const [preview, setPreview] = useState('')
  const [preparing, setPreparing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [percent, setPercent] = useState(null)
  const [busyText, setBusyText] = useState('')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const panelRef = useRef(null)
  const inputRef = useRef(null)
  const previewObjectUrlRef = useRef('')
  const selectionRef = useRef(0)
  const busyRef = useRef(false)
  const workingRef = useRef(false)
  workingRef.current = preparing || busy
  useOverlayScrollLock(open)

  useEffect(() => {
    selectionRef.current += 1
    if (previewObjectUrlRef.current) URL.revokeObjectURL(previewObjectUrlRef.current)
    previewObjectUrlRef.current = ''
    if (!open) return
    const current = normalizeCustomDeliveryCompany(company)
    setCompanyName(current?.company_name || '')
    setFee(current ? String(current.fee_usd) : '')
    setLogoUrl(current?.logo_url || '')
    setPreview(current?.logo_url || '')
    setPreparedLogo(null)
    setError('')
    setBusyText('')
    setPercent(null)
    setPreparing(false)
    setConfirmDelete(false)
  }, [open, company?.company_name, company?.fee_usd, company?.logo_url])

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    panelRef.current?.focus({ preventScroll: true })
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (!busyRef.current && !workingRef.current) onClose?.()
      }
      if (event.key === 'Tab') {
        const controls = [...(panelRef.current?.querySelectorAll('button:not([disabled]),input:not([disabled]):not([type=\"file\"])') || [])]
          .filter((element) => element.getClientRects().length > 0)
        if (!controls.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  useEffect(() => () => {
    selectionRef.current += 1
    if (previewObjectUrlRef.current) URL.revokeObjectURL(previewObjectUrlRef.current)
  }, [])

  const working = preparing || busy

  async function chooseLogo(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || working) return
    const selection = ++selectionRef.current
    setPreparing(true)
    setError('')
    try {
      const result = await prepareDeliveryCompanyLogoImage(file)
      if (selection !== selectionRef.current) return
      const url = URL.createObjectURL(result)
      if (previewObjectUrlRef.current) URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = url
      setPreparedLogo(result)
      setPreview(url)
    } catch (cause) {
      if (selection === selectionRef.current) setError(cause.message || t('customDeliveryCompanySheet.invalidLogo'))
    } finally {
      if (selection === selectionRef.current) setPreparing(false)
    }
  }

  async function save(event) {
    event.preventDefault()
    if (working || busyRef.current) return
    const errorCode = validateCustomDeliveryCompanyInput({
      name: companyName,
      feeUsd: fee,
      logoUrl,
    }, { requireLogo: !preparedLogo })
    if (errorCode) {
      const messageKey = errorCode === 'INVALID_NAME' ? 'invalidName' : errorCode === 'INVALID_FEE' ? 'invalidFee' : 'invalidLogo'
      setError(t(`customDeliveryCompanySheet.${messageKey}`))
      return
    }

    busyRef.current = true
    setBusy(true)
    setError('')
    setPercent(null)
    try {
      let finalLogoUrl = logoUrl
      if (preparedLogo) {
        setBusyText(t('customDeliveryCompanySheet.uploading'))
        finalLogoUrl = await uploadCustomDeliveryCompanyLogo(preparedLogo, {
          onProgress: (value) => setPercent(Math.min(100, Math.max(0, Math.round(Number(value) || 0)))),
        })
      }
      setBusyText(t('customDeliveryCompanySheet.saving'))
      const saved = await saveCustomDeliveryCompany({ name: companyName, feeUsd: fee, logoUrl: finalLogoUrl })
      onSaved?.(saved)
      onClose?.()
    } catch (cause) {
      setError(cause.message || t('customDeliveryCompanySheet.failed'))
    } finally {
      busyRef.current = false
      setBusy(false)
      setBusyText('')
      setPercent(null)
    }
  }

  async function remove() {
    if (working || busyRef.current || !normalized) return
    busyRef.current = true
    setBusy(true)
    setError('')
    setBusyText(t('customDeliveryCompanySheet.deleting'))
    try {
      await deleteCustomDeliveryCompany()
      onDeleted?.()
      onClose?.()
    } catch (cause) {
      setError(cause.message || t('customDeliveryCompanySheet.failed'))
    } finally {
      busyRef.current = false
      setBusy(false)
      setBusyText('')
      setConfirmDelete(false)
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[6000] flex items-end justify-center overscroll-none">
      <button type="button" tabIndex={-1} aria-label={t('customDeliveryCompanySheet.close')} onClick={() => { if (!working) onClose?.() }} className="absolute inset-0 bg-black/55" />
      <section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="custom-delivery-sheet-title" tabIndex={-1} className="relative flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[28px] bg-[var(--shadow-bg-surface)] text-[var(--shadow-text-primary)] shadow-2xl outline-none">
        <div className="flex justify-center py-3"><span className="h-1.5 w-10 rounded-full bg-[var(--shadow-border-strong)]" /></div>
        <div className="flex items-center justify-between border-b border-[var(--shadow-border)] px-5 pb-3">
          <h2 id="custom-delivery-sheet-title" className="text-[17px] font-black">{t(normalized ? 'customDeliveryCompanySheet.edit' : 'customDeliveryCompanySheet.add')}</h2>
          <button type="button" aria-label={t('customDeliveryCompanySheet.close')} disabled={working} onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--shadow-bg-soft)] disabled:opacity-40"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        <form onSubmit={save} className="min-h-0 overflow-y-auto overscroll-contain px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5">
          <div className="mb-5 flex flex-col items-center gap-2">
            <label className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)]">
              {preview ? <img src={preview} alt={t('customDeliveryCompanySheet.logo')} className="h-full w-full object-cover" /> : <i className="fa-solid fa-camera text-[25px] text-[var(--shadow-text-secondary)]" aria-hidden="true" />}
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.heic,.heif" className="sr-only" disabled={working} onChange={chooseLogo} aria-label={t('customDeliveryCompanySheet.uploadLogo')} />
            </label>
            <button type="button" disabled={working} onClick={() => inputRef.current?.click()} className="text-[12px] font-bold text-[var(--shadow-text-primary)] underline underline-offset-4 disabled:opacity-50">{t(preview ? 'customDeliveryCompanySheet.changeLogo' : 'customDeliveryCompanySheet.uploadLogo')}</button>
            <p className="text-center text-[11px] text-[var(--shadow-text-secondary)]">{t('customDeliveryCompanySheet.logoHelp')}</p>
          </div>
          <label className="mb-1.5 block text-[12px] font-bold" htmlFor="custom-delivery-name">{t('customDeliveryCompanySheet.name')} *</label>
          <input id="custom-delivery-name" value={companyName} disabled={working} maxLength={80} onChange={(event) => setCompanyName(event.target.value)} placeholder={t('customDeliveryCompanySheet.namePlaceholder')} className="mb-5 h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[14px] font-semibold outline-none focus:border-[var(--shadow-text-primary)] disabled:opacity-60" />
          <label className="mb-1.5 block text-[12px] font-bold" htmlFor="custom-delivery-fee">{t('customDeliveryCompanySheet.fee')} *</label>
          <input id="custom-delivery-fee" type="number" inputMode="decimal" step="0.01" min="0" max="9999.99" value={fee} disabled={working} onChange={(event) => setFee(event.target.value)} placeholder="0.00" className="h-12 w-full rounded-2xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 text-[14px] font-semibold outline-none focus:border-[var(--shadow-text-primary)] disabled:opacity-60" />
          {preparing ? <p role="status" className="mt-3 text-[12px] font-semibold">{t('customDeliveryCompanySheet.processing')}</p> : null}
          {busyText ? <p role="status" className="mt-3 text-[12px] font-semibold">{busyText}{percent !== null ? ` ${percent}%` : ''}</p> : null}
          {error ? <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700">{error}</p> : null}
          <button type="submit" disabled={working} className="mt-5 h-12 w-full rounded-2xl bg-[var(--shadow-text-primary)] text-[13px] font-black text-[var(--shadow-bg-surface)] disabled:opacity-50">{t(busy ? 'customDeliveryCompanySheet.saving' : 'customDeliveryCompanySheet.save')}</button>
          {normalized && !confirmDelete ? <button type="button" disabled={working} onClick={() => setConfirmDelete(true)} className="mt-3 w-full py-3 text-[12px] font-bold text-red-600 disabled:opacity-50">{t('customDeliveryCompanySheet.delete')}</button> : null}
          {normalized && confirmDelete ? <div className="mt-4 rounded-2xl border border-red-200 p-3"><p className="mb-3 text-[12px] text-[var(--shadow-text-secondary)]">{t('customDeliveryCompanySheet.confirmDeleteHelp')}</p><div className="flex gap-2"><button type="button" disabled={working} onClick={() => setConfirmDelete(false)} className="h-10 flex-1 rounded-xl bg-[var(--shadow-bg-soft)] text-[12px] font-bold">{t('customDeliveryCompanySheet.cancelDelete')}</button><button type="button" disabled={working} onClick={remove} className="h-10 flex-1 rounded-xl bg-red-600 text-[12px] font-bold text-white">{t('customDeliveryCompanySheet.confirmDelete')}</button></div></div> : null}
        </form>
      </section>
    </div>,
    document.body
  )
}
