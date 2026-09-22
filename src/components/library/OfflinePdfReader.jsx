import { useEffect, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { loadOfflinePdf } from '../../utils/offlinePdfStorage'

registerTranslationNamespace('offlinePdfReader', {
  en: { loading: 'Opening saved PDF…', missing: 'This PDF is not saved on this device, or its reading access has expired.', error: 'Unable to open this offline PDF.', back: 'Back', unsupported: 'Your browser may not support displaying offline PDFs.' },
  km: { loading: 'កំពុងបើក PDF ដែលបានរក្សាទុក…', missing: 'PDF នេះមិនមានក្នុងឧបករណ៍ ឬសិទ្ធិអានបានផុតកំណត់។', error: 'មិនអាចបើក PDF Offline នេះបានទេ។', back: 'ត្រឡប់ក្រោយ', unsupported: 'Browser នេះប្រហែលជាមិនអាចបង្ហាញ PDF Offline បានទេ។' },
  zh: { loading: '正在打开离线 PDF…', missing: '此 PDF 未保存在设备上或阅读权限已过期。', error: '无法打开离线 PDF。', back: '返回', unsupported: '此浏览器可能不支持显示离线 PDF。' },
  ja: { loading: '保存済み PDF を開いています…', missing: 'この PDF は端末に保存されていないか、閲覧期限が切れています。', error: 'オフライン PDF を開けません。', back: '戻る', unsupported: 'このブラウザーではオフライン PDF を表示できない場合があります。' },
  ko: { loading: '저장된 PDF를 여는 중…', missing: '이 PDF가 기기에 없거나 열람 기간이 만료되었습니다.', error: '오프라인 PDF를 열 수 없습니다.', back: '뒤로', unsupported: '이 브라우저는 오프라인 PDF 표시를 지원하지 않을 수 있습니다.' },
})

export default function OfflinePdfReader({ pdfId, onBack }) {
  const { t } = useDisplayTranslation()
  const [view, setView] = useState({ status: 'loading', url: '', title: '' })

  useEffect(() => {
    let active = true
    let objectUrl = ''
    let expiresAt = null
    setView({ status: 'loading', url: '', title: '' })

    async function openPdf() {
      try {
        const record = pdfId ? await loadOfflinePdf(pdfId) : null
        if (!active) return
        if (!record || !(record.blob instanceof Blob) || !record.blob.size) {
          setView({ status: 'missing', url: '', title: '' })
          return
        }
        expiresAt = record.expiresAt
        if (expiresAt != null && Date.now() >= expiresAt) {
          setView({ status: 'missing', url: '', title: '' })
          return
        }
        objectUrl = URL.createObjectURL(record.blob)
        setView({ status: 'ready', url: objectUrl, title: record.title || 'PDF' })
      } catch {
        if (active) setView({ status: 'error', url: '', title: '' })
      }
    }

    openPdf()
    const interval = window.setInterval(() => {
      if (active && expiresAt != null && Date.now() >= expiresAt) {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        objectUrl = ''
        expiresAt = null
        setView({ status: 'missing', url: '', title: '' })
      }
    }, 1000)
    return () => {
      active = false
      window.clearInterval(interval)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [pdfId])

  return (
    <section className="space-y-3 text-[var(--shadow-text-primary)]">
      {onBack ? <button type="button" onClick={onBack} className="rounded-xl border border-[var(--shadow-border)] px-4 py-2 text-sm font-semibold">← {t('offlinePdfReader.back')}</button> : null}
      {view.status === 'ready' ? (
        <>
          <h2 className="truncate text-base font-bold">{view.title}</h2>
          <iframe key={view.url} src={view.url} title={view.title} className="h-[75vh] min-h-[420px] w-full rounded-xl border border-[var(--shadow-border)] bg-white" />
          <p className="text-xs text-[var(--shadow-text-secondary)]">{t('offlinePdfReader.unsupported')}</p>
        </>
      ) : <p role="status" className="rounded-xl border border-[var(--shadow-border)] p-4 text-sm">{t(`offlinePdfReader.${view.status}`)}</p>}
    </section>
  )
}
