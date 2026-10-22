import { useEffect, useState } from 'react'
import { getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPdfUploadProgress', {
  en: {
    pdfFile: 'PDF file',
    uploading: 'Uploading',
    processing: 'Processing',
    saving: 'Saving',
    verifying: 'Verifying',
    hideDetails: 'Hide upload details',
  },
  km: {
    pdfFile: 'ឯកសារ PDF',
    uploading: 'កំពុងបង្ហោះ',
    processing: 'កំពុងដំណើរការ',
    saving: 'កំពុងរក្សាទុក',
    verifying: 'កំពុងផ្ទៀងផ្ទាត់',
    hideDetails: 'លាក់ព័ត៌មានការបង្ហោះ',
  },
  zh: {
    pdfFile: 'PDF 文件',
    uploading: '上传中',
    processing: '处理中',
    saving: '保存中',
    verifying: '验证中',
    hideDetails: '隐藏上传详情',
  },
  ja: {
    pdfFile: 'PDF ファイル',
    uploading: 'アップロード中',
    processing: '処理中',
    saving: '保存中',
    verifying: '確認中',
    hideDetails: 'アップロードの詳細を隠す',
  },
  ko: {
    pdfFile: 'PDF 파일',
    uploading: '업로드 중',
    processing: '처리 중',
    saving: '저장 중',
    verifying: '확인 중',
    hideDetails: '업로드 세부 정보 숨기기',
  },
})

function translate(key) {
  return getDisplayText(`authorPdfUploadProgress.${key}`)
}

export default function AuthorPdfUploadProgress({
  label,
  fileName = '',
  stage = 'idle',
  percent = 0,
  uploadId = 0,
}) {
  useDisplayTranslation()
  const [detailsHidden, setDetailsHidden] = useState(false)

  useEffect(() => {
    setDetailsHidden(false)
  }, [uploadId])

  const active = ['uploading', 'processing', 'saving', 'verifying'].includes(stage)
  const numericPercent = Number(percent)
  const uploadPercent = Number.isFinite(numericPercent)
    ? Math.max(0, Math.min(100, Math.round(numericPercent)))
    : 0
  const stageText = active ? translate(stage) : ''

  return (
    <div className="mb-2 min-w-0">
      <div className="flex min-h-5 items-center justify-between gap-2">
        <span className="text-[12px] font-bold text-[var(--shadow-text-secondary)]">
          {label || translate('pdfFile')}
        </span>
        {active ? (
          <span className="text-[11px] font-bold text-[#2563eb]" role="status" aria-live="polite">
            {stage === 'uploading' ? `${uploadPercent}%` : stageText}
          </span>
        ) : null}
      </div>

      {active && !detailsHidden ? (
        <div className="mt-2 rounded-xl bg-[var(--shadow-bg-soft)] px-3 py-2.5 ring-1 ring-[var(--shadow-border)]">
          <div className="mb-2 flex items-center gap-2">
            <i className="fa-regular fa-file-pdf text-[13px] text-[#2563eb]" />
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-[var(--shadow-text-secondary)]">
              {fileName || stageText}
            </span>
            <button
              type="button"
              onClick={() => setDetailsHidden(true)}
              aria-label={translate('hideDetails')}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--shadow-text-secondary)] hover:bg-[var(--shadow-bg-surface)]"
            >
              <i className="fa-solid fa-xmark text-[11px]" />
            </button>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-[var(--shadow-border)]"
            role="progressbar"
            aria-label={stageText}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={stage === 'uploading' ? uploadPercent : undefined}
            aria-valuetext={stage === 'uploading' ? `${uploadPercent}%` : stageText}
          >
            <div
              className={`h-full rounded-full bg-[#2563eb] transition-[width] duration-150 ${stage !== 'uploading' ? 'animate-pulse' : ''}`}
              style={{ width: `${stage === 'uploading' ? uploadPercent : 100}%` }}
            />
          </div>
          <div className="mt-1.5 text-[10px] font-medium text-[var(--shadow-text-tertiary)]">
            {stageText}
          </div>
        </div>
      ) : null}
    </div>
  )
}
