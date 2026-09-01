import { formatFileSize } from '../../utils/mangaImageUtils'

export default function MangaUploadProgressModal({ pages, onCancel }) {
  const items = Array.isArray(pages) ? pages : []
  if (!items.length) return null

  const totalBytes = items.reduce(
    (sum, page) => sum + Number(page.uploadTotalBytes || page.fileSize || page.sourceFile?.size || 0),
    0
  )

  const uploadedBytes = items.reduce((sum, page) => {
    const total = Number(page.uploadTotalBytes || page.fileSize || page.sourceFile?.size || 0)
    if (page.status === 'done') return sum + total
    return sum + Math.min(Number(page.uploadedBytes || 0), total)
  }, 0)

  const overallPercent = totalBytes > 0
    ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))
    : 0

  const completedCount = items.filter((page) => page.status === 'done').length
  const current =
    items.find((page) => page.status === 'uploading') ||
    items.find((page) => page.status === 'processing') ||
    items.find((page) => page.status === 'queued') ||
    items[items.length - 1]
  const serverProcessing = items.some(
  (page) =>
    page.status === 'processing' &&
    page.serverProcessing
)
const canCancel = !serverProcessing

  const currentTotal = Number(
    current?.uploadTotalBytes || current?.fileSize || current?.sourceFile?.size || 0
  )
  const currentLoaded = current?.status === 'done'
    ? currentTotal
    : Math.min(Number(current?.uploadedBytes || 0), currentTotal)
  const currentPercent = currentTotal > 0
    ? Math.min(100, Math.round((currentLoaded / currentTotal) * 100))
    : 0
  const speed = items.reduce((sum, page) => sum + Number(page.uploadSpeed || 0), 0)
  const currentName = current?.sourceFile?.name || 'Manga page'
  const currentLabel = current?.serverProcessing
  ? 'Processing'
  : current?.status === 'processing'
    ? 'Preparing'
    : 'Uploading'
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (overallPercent / 100) * circumference

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[360px] rounded-[26px] bg-white p-5 shadow-[0_24px_70px_rgba(17,24,39,0.24)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#0b5cff]">
              <i className="fa-solid fa-cloud-arrow-up text-[16px]" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-extrabold text-[#111827]">
                Uploading Manga Pages
              </h2>
              <p className="mt-1 text-[11px] font-medium text-[#8d94a1]">
                Uploading {Math.min(completedCount + 1, items.length)} of {items.length} images
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="{canCancel ? 'Cancel Upload' : 'Processing on server...'}"
          >
            <i className="fa-solid fa-xmark text-[15px]" />
          </button>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="relative h-[142px] w-[142px]">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#e7eeff"
                strokeWidth="9"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#0b5cff"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-200"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-[30px] font-black leading-none text-[#0b5cff]">
                {overallPercent}%
              </div>
              <div className="mt-2 text-[11px] font-bold text-[#555b66]">
                {formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)}
              </div>
              <div className="mt-1 text-[10px] font-medium text-[#8d94a1]">
                {speed > 0 ? `Speed: ${formatFileSize(speed)}/s` : 'Preparing upload...'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] bg-[#f5f8ff] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#0b5cff] shadow-sm ring-1 ring-[#dfe8ff]">
              <i className="fa-regular fa-image text-[15px]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 truncate text-[11.5px] font-extrabold text-[#111827]">
                  {currentLabel}: {currentName}
                </div>
                <div className="shrink-0 text-[11px] font-extrabold text-[#0b5cff]">
                  {currentPercent}%
                </div>
              </div>

              <div className="mt-1 text-[10.5px] font-medium text-[#667085]">
                {formatFileSize(currentLoaded)} / {formatFileSize(currentTotal)}
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#dfe8ff]">
                <div
                  className="h-full rounded-full bg-[#0b5cff] transition-all duration-200"
                  style={{ width: `${currentPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-5 h-12 w-full rounded-[14px] bg-[#FE526E] text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(254,82,110,0.24)] active:scale-[0.99]"
        >
          {canCancel ? 'Cancel Upload' : 'Processing on server...'}
        </button>
      </div>
    </div>
  )
}
