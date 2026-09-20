import { useEffect, useMemo, useState } from 'react'
import { useDisplayTranslation } from '../../utils/displayLanguage'

const STUDIO_TEXT = {
  "km": {
    "Lossless · sharp lines and text": "គុណភាពដើម · បន្ទាត់ និងអក្សរច្បាស់",
    "Smaller photo-friendly files": "ឯកសារតូច សមស្របសម្រាប់រូបថត",
    "Modern, compact image format": "ទម្រង់រូបភាពទំនើប និងទំហំតូច",
    "Image encoding failed. Try a smaller size or PNG.": "បម្លែងរូបភាពមិនបាន។ សូមបន្ថយទំហំ ឬជ្រើស PNG។",
    "This format is not supported in this browser. Choose PNG instead.": "Browser នេះមិនគាំទ្រទម្រង់នេះទេ។ សូមជ្រើស PNG។",
    "is not supported in this browser. Choose PNG instead.": "មិនត្រូវបានគាំទ្រក្នុង Browser នេះទេ។ សូមជ្រើស PNG។",
    "The current paper is not ready. Close this window and try again.": "ក្រដាសបច្ចុប្បន្នមិនទាន់រួចរាល់ទេ។ សូមបិទផ្ទាំងនេះ ហើយសាកម្ដងទៀត។",
    "Could not prepare the export canvas.": "មិនអាចរៀបចំ Canvas សម្រាប់ Export បានទេ។",
    "Could not export this image.": "មិនអាច Export រូបភាពនេះបានទេ។",
    "download started": "បានចាប់ផ្ដើមទាញយក",
    "Export image": "Export រូបភាព",
    "Export Image": "Export រូបភាព",
    "Close export window": "បិទផ្ទាំង Export",
    "File name": "ឈ្មោះឯកសារ",
    "Image format": "ទម្រង់រូបភាព",
    "Output size": "ទំហំរូបភាពចេញ",
    "Custom": "កំណត់ផ្ទាល់ខ្លួន",
    "Width (px)": "ទទឹង (px)",
    "Height adjusts automatically · original aspect ratio": "កម្ពស់កែតាមស្វ័យប្រវត្តិ · រក្សាសមាមាត្រដើម",
    "Enter a supported output size": "សូមបញ្ចូលទំហំរូបភាពដែលគាំទ្រ",
    "Maximum 4096 px per side / 12 million pixels": "អតិបរមា 4096 px ក្នុងមួយជ្រុង / 12 លាន pixels",
    "Quality": "គុណភាព",
    "Only the drawing is exported. Canvas Grid and other on-screen guides are not included. Export does not modify your saved project.": "Export តែគំនូរប៉ុណ្ណោះ។ Grid និងបន្ទាត់ជំនួយមិនត្រូវបានបញ្ចូលទេ។ Export មិនកែប្រែគម្រោងដែលបានរក្សាទុកឡើយ។",
    "Enter a whole-pixel width that keeps both dimensions within 4096 px and the output within 12 million pixels.": "សូមបញ្ចូលទទឹងជាចំនួន pixels គត់ ដោយទទឹង និងកម្ពស់មិនលើស 4096 px និងសរុបមិនលើស 12 លាន pixels។",
    "Cancel": "បោះបង់",
    "Exporting…": "កំពុង Export…",
    "Export": "Export"
  },
  "zh": {
    "Lossless · sharp lines and text": "无损 · 线条与文字清晰",
    "Smaller photo-friendly files": "文件较小，适合照片",
    "Modern, compact image format": "现代化的小体积图像格式",
    "Image encoding failed. Try a smaller size or PNG.": "图像编码失败。请缩小尺寸或选择 PNG。",
    "This format is not supported in this browser. Choose PNG instead.": "浏览器不支持此格式，请改用 PNG。",
    "is not supported in this browser. Choose PNG instead.": "此浏览器不支持该格式。请改用 PNG。",
    "The current paper is not ready. Close this window and try again.": "当前画布尚未准备好，请关闭窗口后重试。",
    "Could not prepare the export canvas.": "无法准备导出画布。",
    "Could not export this image.": "无法导出此图像。",
    "download started": "已开始下载",
    "Export image": "导出图像",
    "Export Image": "导出图像",
    "Close export window": "关闭导出窗口",
    "File name": "文件名",
    "Image format": "图像格式",
    "Output size": "输出尺寸",
    "Custom": "自定义",
    "Width (px)": "宽度 (px)",
    "Height adjusts automatically · original aspect ratio": "高度自动调整 · 保持原始宽高比",
    "Enter a supported output size": "请输入受支持的输出尺寸",
    "Maximum 4096 px per side / 12 million pixels": "每边最多 4096 px / 1200 万像素",
    "Quality": "质量",
    "Only the drawing is exported. Canvas Grid and other on-screen guides are not included. Export does not modify your saved project.": "仅导出绘画内容，不包含网格等屏幕辅助线。导出不会修改已保存的项目。",
    "Enter a whole-pixel width that keeps both dimensions within 4096 px and the output within 12 million pixels.": "请输入整数像素宽度，确保宽高均不超过 4096 px，总像素不超过 1200 万。",
    "Cancel": "取消",
    "Exporting…": "正在导出…",
    "Export": "导出"
  },
  "ja": {
    "Lossless · sharp lines and text": "劣化なし · 線や文字が鮮明",
    "Smaller photo-friendly files": "写真向けの小さなファイル",
    "Modern, compact image format": "新しい軽量画像形式",
    "Image encoding failed. Try a smaller size or PNG.": "画像を変換できません。サイズを小さくするか PNG を選んでください。",
    "This format is not supported in this browser. Choose PNG instead.": "このブラウザーはこの形式に対応していません。PNG を選んでください。",
    "is not supported in this browser. Choose PNG instead.": "このブラウザーでは対応していません。PNG を選んでください。",
    "The current paper is not ready. Close this window and try again.": "現在のキャンバスは準備できていません。このウィンドウを閉じて再試行してください。",
    "Could not prepare the export canvas.": "書き出し用キャンバスを準備できません。",
    "Could not export this image.": "画像を書き出せません。",
    "download started": "ダウンロードを開始しました",
    "Export image": "画像を書き出す",
    "Export Image": "画像を書き出す",
    "Close export window": "書き出し画面を閉じる",
    "File name": "ファイル名",
    "Image format": "画像形式",
    "Output size": "出力サイズ",
    "Custom": "カスタム",
    "Width (px)": "幅 (px)",
    "Height adjusts automatically · original aspect ratio": "高さは自動調整 · 元の縦横比を維持",
    "Enter a supported output size": "対応する出力サイズを入力してください",
    "Maximum 4096 px per side / 12 million pixels": "各辺最大 4096 px / 1200 万ピクセル",
    "Quality": "画質",
    "Only the drawing is exported. Canvas Grid and other on-screen guides are not included. Export does not modify your saved project.": "画像のみを書き出します。グリッドやガイド線は含まれません。保存済みプロジェクトは変更されません。",
    "Enter a whole-pixel width that keeps both dimensions within 4096 px and the output within 12 million pixels.": "幅を整数ピクセルで入力し、幅と高さを各 4096 px 以下、合計 1200 万ピクセル以下にしてください。",
    "Cancel": "キャンセル",
    "Exporting…": "書き出し中…",
    "Export": "書き出す"
  },
  "ko": {
    "Lossless · sharp lines and text": "무손실 · 선과 글자가 선명함",
    "Smaller photo-friendly files": "용량이 작은 사진용 파일",
    "Modern, compact image format": "최신 고효율 이미지 형식",
    "Image encoding failed. Try a smaller size or PNG.": "이미지 인코딩에 실패했습니다. 크기를 줄이거나 PNG를 선택하세요.",
    "This format is not supported in this browser. Choose PNG instead.": "이 브라우저는 해당 형식을 지원하지 않습니다. PNG를 선택하세요.",
    "is not supported in this browser. Choose PNG instead.": "이 브라우저에서 지원하지 않습니다. PNG를 선택하세요.",
    "The current paper is not ready. Close this window and try again.": "현재 캔버스가 준비되지 않았습니다. 창을 닫고 다시 시도하세요.",
    "Could not prepare the export canvas.": "내보내기 캔버스를 준비할 수 없습니다.",
    "Could not export this image.": "이 이미지를 내보낼 수 없습니다.",
    "download started": "다운로드 시작됨",
    "Export image": "이미지 내보내기",
    "Export Image": "이미지 내보내기",
    "Close export window": "내보내기 창 닫기",
    "File name": "파일 이름",
    "Image format": "이미지 형식",
    "Output size": "출력 크기",
    "Custom": "사용자 지정",
    "Width (px)": "너비 (px)",
    "Height adjusts automatically · original aspect ratio": "높이 자동 조정 · 원본 가로세로 비율 유지",
    "Enter a supported output size": "지원되는 출력 크기를 입력하세요",
    "Maximum 4096 px per side / 12 million pixels": "한 변 최대 4096 px / 1,200만 픽셀",
    "Quality": "품질",
    "Only the drawing is exported. Canvas Grid and other on-screen guides are not included. Export does not modify your saved project.": "그림만 내보냅니다. 격자 및 화면 안내선은 포함되지 않으며 저장한 프로젝트는 변경되지 않습니다.",
    "Enter a whole-pixel width that keeps both dimensions within 4096 px and the output within 12 million pixels.": "너비를 정수 픽셀로 입력하고 두 변 모두 4096 px 이내, 총 1,200만 픽셀 이내로 설정하세요.",
    "Cancel": "취소",
    "Exporting…": "내보내는 중…",
    "Export": "내보내기"
  }
}

function studioTranslate(language, text) {
  return STUDIO_TEXT[language]?.[text] || text
}

const FORMATS = [
  { id: 'png', label: 'PNG', mime: 'image/png', description: 'Lossless · sharp lines and text' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', description: 'Smaller photo-friendly files' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', description: 'Modern, compact image format' },
]
const SCALES = [25, 50, 75, 100, 150, 200]
const MAX_SIDE = 4096
const MAX_AREA = 12000000

const cleanName = (name) => String(name || 'Paper')
  .trim()
  .replace(/\.(?:png|jpe?g|webp)$/i, '')
  .replace(/[\\/:*?"<>|\x00-\x1f]/g, '-')
  .replace(/^\.+/, '')
  .slice(0, 60).trim() || 'Paper'

function generateBlob(canvas, mime, quality, tr) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error(tr('Image encoding failed. Try a smaller size or PNG.')))
          return
        }
        if (blob.type !== mime) {
          reject(new Error(`${mime === 'image/webp' ? 'WebP' : tr('This format is not supported in this browser. Choose PNG instead.')} ${mime === 'image/webp' ? tr('is not supported in this browser. Choose PNG instead.') : ''}`.trim()))
          return
        }
        resolve(blob)
      }, mime, quality)
    } catch (error) {
      reject(error)
    }
  })
}

export default function StudioExportDialog({ open, paper, canvasRef, onClose, onExported }) {
  const [format, setFormat] = useState('png')
  const { language } = useDisplayTranslation()
  const tr = (text) => studioTranslate(language, text)
  const [scale, setScale] = useState(100)
  const [customWidth, setCustomWidth] = useState('')
  const [quality, setQuality] = useState(90)
  const [filename, setFilename] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setFormat('png')
    setScale(100)
    setCustomWidth(String(paper?.width || ''))
    setQuality(90)
    setFilename(paper?.name || 'Paper')
    setBusy(false)
    setError('')
  }, [open, paper?.id])

  const dimensions = useMemo(() => {
    const sourceWidth = paper?.width || 1
    const sourceHeight = paper?.height || 1
    const width = scale === 'custom' ? Number(customWidth) : Math.round(sourceWidth * scale / 100)
    const height = Math.round(sourceHeight * width / sourceWidth)
    const valid = Number.isInteger(width) && Number.isInteger(height) && width >= 1 && height >= 1 && width <= MAX_SIDE && height <= MAX_SIDE && width * height <= MAX_AREA
    return { width, height, valid }
  }, [paper?.width, paper?.height, scale, customWidth])

  if (!open || !paper) return null

  async function exportImage(event) {
    event.preventDefault()
    if (busy || !dimensions.valid || !filename.trim()) return
    const canvas = canvasRef.current
    if (!canvas || canvas.width !== paper.width || canvas.height !== paper.height) {
      setError(tr('The current paper is not ready. Close this window and try again.'))
      return
    }
    const chosen = FORMATS.find((item) => item.id === format)
    setBusy(true)
    setError('')
    try {
      const output = document.createElement('canvas')
      output.width = dimensions.width
      output.height = dimensions.height
      const ctx = output.getContext('2d')
      if (!ctx) throw new Error(tr('Could not prepare the export canvas.'))
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      if (format === 'jpeg') {
        ctx.fillStyle = paper.background || '#FFFFFF'
        ctx.fillRect(0, 0, output.width, output.height)
      }
      ctx.drawImage(canvas, 0, 0, output.width, output.height)
      const blob = await generateBlob(output, chosen.mime, format === 'png' ? undefined : quality / 100, tr)
      const url = URL.createObjectURL(blob)
      try {
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `${cleanName(filename)}.${format === 'jpeg' ? 'jpg' : format}`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 30000)
      }
      onExported?.(`${chosen.label} ${tr('download started')} · ${dimensions.width} × ${dimensions.height}px`)
    } catch (failure) {
      setError(failure?.message || tr('Could not export this image.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ss-export-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget && !busy) onClose() }}>
      <style>{`
        .ss-export-backdrop{position:fixed;inset:0;z-index:100100;display:grid;place-items:center;background:rgba(0,0,0,.75);padding:12px}
        .ss-export-dialog{box-sizing:border-box;width:min(480px,100%);max-height:calc(100dvh - 24px);overflow-y:auto;border:1px solid #626d79;border-radius:12px;background:#30353c;color:#f1f5f9;box-shadow:0 22px 60px rgba(0,0,0,.6);font-family:inherit}
        .ss-export-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:17px 18px;border-bottom:1px solid #49535d}
        .ss-export-head h2{margin:0;font-size:17px}
        .ss-export-close{height:30px;width:30px;border:0;border-radius:6px;background:#404852;color:#fff;font:inherit;cursor:pointer}
        .ss-export-body{display:grid;gap:15px;padding:17px 18px}
        .ss-export-field{display:grid;gap:7px;font-size:12px;font-weight:700}
        .ss-export-field input,.ss-export-field select{box-sizing:border-box;width:100%;min-width:0;min-height:37px;border:1px solid #606c79;border-radius:6px;background:#252c34;color:#fff;padding:5px 9px;font:inherit;font-size:13px}
        .ss-export-field input[type=range]{height:30px;padding:0;accent-color:#68affb}
        .ss-export-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
        .ss-export-format{display:flex;min-width:0;min-height:62px;flex-direction:column;justify-content:center;gap:3px;border:1px solid #566474;border-radius:7px;background:#343d48;color:#fff;padding:7px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}
        .ss-export-format small{font-size:9px;font-weight:400;line-height:1.4;color:#c0cad5}
        .ss-export-format[aria-pressed=true]{border-color:#88c2fa;background:#345676}
        .ss-export-scales{display:flex;flex-wrap:wrap;gap:6px}
        .ss-export-scales button{min-height:32px;border:1px solid #5e6c7a;border-radius:6px;background:#35404a;color:#f1f5f9;padding:0 10px;font:inherit;font-size:11px;cursor:pointer}
        .ss-export-scales button[aria-pressed=true]{border-color:#89c6ff;background:#365c80}
        .ss-export-scales button:disabled{opacity:.3;cursor:default}
        .ss-export-custom{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .ss-export-custom input{box-sizing:border-box;width:125px;max-width:100%;height:36px;border:1px solid #606c79;border-radius:6px;background:#252c34;color:#fff;padding:5px 9px;font:inherit;font-size:13px}
        .ss-export-custom input:focus-visible{outline:2px solid #7cbcff;outline-offset:1px}
        .ss-export-custom span{font-size:11px;font-weight:400;color:#aebdcd}
        .ss-export-note{margin:0;color:#aebdcd;font-size:11px;line-height:1.5}
        .ss-export-error{margin:0;border-radius:6px;background:#63363b;color:#ffe0e0;padding:9px;font-size:11px}
        .ss-export-actions{display:flex;justify-content:flex-end;gap:8px;padding:13px 18px;border-top:1px solid #49535d}
        .ss-export-actions button{min-height:36px;border:1px solid #667483;border-radius:6px;background:#414a55;color:#fff;padding:0 15px;font:inherit;font-size:12px;cursor:pointer}
        .ss-export-actions button:last-child{border-color:#6db5ff;background:#3679bb;font-weight:800}
        .ss-export-actions button:disabled,.ss-export-format:disabled,.ss-export-close:disabled{opacity:.5;cursor:default}
        @media(max-width:550px){.ss-export-backdrop{align-items:end;padding:0}.ss-export-dialog{width:100%;max-height:90dvh;border-radius:14px 14px 0 0}.ss-export-head,.ss-export-body{padding:13px}.ss-export-actions{padding:12px}}
      `}</style>
      <form className="ss-export-dialog" role="dialog" aria-modal="true" aria-label={tr('Export image')} onSubmit={exportImage} onKeyDown={(event) => { if (event.key === 'Escape' && !busy) { event.stopPropagation(); onClose() } }}>
        <div className="ss-export-head"><h2>{tr('Export Image')}</h2><button type="button" className="ss-export-close" aria-label={tr('Close export window')} disabled={busy} onClick={onClose}>×</button></div>
        <div className="ss-export-body">
          <label className="ss-export-field">{tr('File name')}<input type="text" maxLength={80} required value={filename} disabled={busy} onChange={(event) => setFilename(event.target.value)} /></label>
          <div className="ss-export-field"><span>{tr('Image format')}</span><div className="ss-export-options">{FORMATS.map((item) => <button key={item.id} type="button" className="ss-export-format" aria-pressed={format === item.id} disabled={busy} onClick={() => setFormat(item.id)}>{item.label}<small>{tr(item.description)}</small></button>)}</div></div>
          <div className="ss-export-field">
            <span>{tr('Output size')}</span>
            <div className="ss-export-scales">{SCALES.map((percent) => { const w = Math.round(paper.width * percent / 100); const h = Math.round(paper.height * percent / 100); return <button type="button" key={percent} disabled={busy || w > MAX_SIDE || h > MAX_SIDE || w * h > MAX_AREA} aria-pressed={scale === percent} onClick={() => setScale(percent)}>{percent}%</button> })}<button type="button" disabled={busy} aria-pressed={scale === 'custom'} onClick={() => setScale('custom')}>{tr('Custom')}</button></div>
            {scale === 'custom' ? <label className="ss-export-custom">{tr('Width (px)')}<input type="number" min="1" max={MAX_SIDE} step="1" inputMode="numeric" value={customWidth} disabled={busy} onChange={(event) => setCustomWidth(event.target.value)} /><span>{tr('Height adjusts automatically · original aspect ratio')}</span></label> : null}
            <p className="ss-export-note">{dimensions.valid ? `${dimensions.width.toLocaleString()} × ${dimensions.height.toLocaleString()} px` : tr('Enter a supported output size')} · {tr('Maximum 4096 px per side / 12 million pixels')}</p>
          </div>
          {format !== 'png' ? <label className="ss-export-field">{tr('Quality')} · {quality}%<input type="range" min="50" max="100" step="1" value={quality} disabled={busy} onChange={(event) => setQuality(Number(event.target.value))} /></label> : null}
          <p className="ss-export-note">{tr('Only the drawing is exported. Canvas Grid and other on-screen guides are not included. Export does not modify your saved project.')}</p>
          {!dimensions.valid ? <p className="ss-export-error" role="alert">{tr('Enter a whole-pixel width that keeps both dimensions within 4096 px and the output within 12 million pixels.')}</p> : null}
          {error ? <p className="ss-export-error" role="alert">{error}</p> : null}
        </div>
        <div className="ss-export-actions"><button type="button" disabled={busy} onClick={onClose}>{tr('Cancel')}</button><button type="submit" disabled={busy || !dimensions.valid || !filename.trim()}>{busy ? tr('Exporting…') : `${tr('Export')} ${format.toUpperCase()}`}</button></div>
      </form>
    </div>
  )
}
