import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { savePurchasedPdfOffline } from '../../utils/savePurchasedPdfOffline'

registerTranslationNamespace('offlinePdfSave', {
  en: { action: 'Save offline', checking: 'Checking access…', downloading: 'Saving PDF…', saving: 'Finishing…', saved: 'Saved offline', open: 'Open offline downloads' },
  km: { action: 'រក្សាទុកសម្រាប់អាន Offline', checking: 'កំពុងពិនិត្យសិទ្ធិ…', downloading: 'កំពុងរក្សាទុក PDF…', saving: 'កំពុងបញ្ចប់…', saved: 'បានរក្សាទុក Offline', open: 'បើកការទាញយក Offline' },
  zh: { action: '保存以供离线阅读', checking: '正在验证权限…', downloading: '正在保存 PDF…', saving: '即将完成…', saved: '已离线保存', open: '打开离线下载' },
  ja: { action: 'オフラインに保存', checking: '閲覧権限を確認中…', downloading: 'PDF を保存中…', saving: '完了しています…', saved: 'オフラインに保存済み', open: 'オフラインダウンロードを開く' },
  ko: { action: '오프라인으로 저장', checking: '접근 권한 확인 중…', downloading: 'PDF 저장 중…', saving: '마무리 중…', saved: '오프라인 저장 완료', open: '오프라인 다운로드 열기' },
})

export default function OfflinePdfSaveButton({ pdfId }) {
  const { t } = useDisplayTranslation()
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const requestRef = useRef(null)

  useEffect(() => {
    setStatus('idle')
    setError('')
    return () => requestRef.current?.abort()
  }, [pdfId])

  async function save() {
    if (!pdfId || requestRef.current) return
    const controller = new AbortController()
    requestRef.current = controller
    setStatus('checking')
    setError('')
    try {
      await savePurchasedPdfOffline({
        pdfId,
        signal: controller.signal,
        onProgress: (stage) => {
          if (!controller.signal.aborted) setStatus(stage)
        },
      })
      if (!controller.signal.aborted) setStatus('saved')
    } catch (reason) {
      if (!controller.signal.aborted) {
        setStatus('idle')
        setError(reason?.message || 'Unable to save this PDF offline')
      }
    } finally {
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  const busy = ['checking', 'downloading', 'saving'].includes(status)
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <button
        type="button"
        onClick={save}
        disabled={!pdfId || busy || status === 'saved'}
        className="rounded-xl border border-[var(--shadow-border)] bg-[var(--shadow-bg-soft)] px-3 py-2 text-[10px] font-extrabold text-[var(--shadow-text-primary)] disabled:opacity-60"
      >
        {t(`offlinePdfSave.${busy || status === 'saved' ? status : 'action'}`)}
      </button>
      {status === 'saved' ? <Link to="/library/manage/offline-downloads" className="text-[10px] font-bold text-[var(--shadow-text-secondary)] underline">{t('offlinePdfSave.open')}</Link> : null}
      {error ? <p role="alert" className="max-w-[220px] break-words text-[10px] text-red-600">{error}</p> : null}
    </div>
  )
}
