import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, PageShell, SurfaceCard } from '../../components/common/PagePrimitives'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { convertPicToArt } from './picToArtEngine'
import { clearPicToArtCreations, savePicToArtCreation } from './picToArtStore'

registerTranslationNamespace('picToArt', {
  en: { title: 'Pic to Art', subtitle: 'Convert your photo into manga or art', back: 'Back', settings: 'Settings', creations: 'Creations', uploadTitle: 'Add a photo', uploadBody: 'Choose a clear photo from your device.', choosePhoto: 'Choose Photo', changePhoto: 'Change Photo', removePhoto: 'Remove Photo', chooseStyle: 'Choose Style', manga: 'Manga', anime: 'Anime', sketch: 'Sketch', comic: 'Comic', watercolor: 'Watercolor', bwManga: 'B&W Manga', controls: 'Style & Edit', strength: 'Strength', detail: 'Detail', contrast: 'Contrast', lineArt: 'Line Art', reset: 'Reset', generate: 'Generate Art', generating: 'Creating artwork…', noPhoto: 'Choose a photo first.', invalidPhoto: 'Choose a valid image file.', failed: 'Could not create the artwork on this device.', privacy: 'Processed locally on this device. Your photo is not uploaded.', result: 'Your Artwork', original: 'Original', artwork: 'Artwork', download: 'Download PNG', generateAgain: 'Generate Again', output: 'Output', ready: 'Artwork is ready.', settingsTitle: 'Pic to Art Settings', autoSave: 'Auto-save creations', autoSaveBody: 'Save generated artwork to Creations on this device.', rememberControls: 'Remember controls', rememberControlsBody: 'Remember the last style and slider values.', defaultStyle: 'Default style', clearCreations: 'Clear Creations', clearCreationsBody: 'Delete all locally saved Pic to Art creations.', clearConfirm: 'Delete all saved Pic to Art creations from this device?', cleared: 'Creations cleared.', close: 'Close', quality: 'Output quality', standard: 'Standard', hd: 'HD', share: 'Share', shareUnavailable: 'Sharing is not supported on this device.' },
  km: { title: 'Pic to Art', subtitle: 'បម្លែងរូបថតរបស់អ្នកទៅជា Manga ឬ Art', back: 'ត្រឡប់ក្រោយ', settings: 'ការកំណត់', creations: 'Creations', uploadTitle: 'បន្ថែមរូបថត', uploadBody: 'ជ្រើសរូបថតដែលច្បាស់ពីឧបករណ៍របស់អ្នក។', choosePhoto: 'ជ្រើសរូបថត', changePhoto: 'ប្តូររូបថត', removePhoto: 'លុបរូបថត', chooseStyle: 'ជ្រើស Style', manga: 'Manga', anime: 'Anime', sketch: 'Sketch', comic: 'Comic', watercolor: 'Watercolor', bwManga: 'B&W Manga', controls: 'Style & Edit', strength: 'Strength', detail: 'Detail', contrast: 'Contrast', lineArt: 'Line Art', reset: 'កំណត់ឡើងវិញ', generate: 'បង្កើត Art', generating: 'កំពុងបង្កើត Artwork…', noPhoto: 'សូមជ្រើសរូបថតជាមុន។', invalidPhoto: 'សូមជ្រើសឯកសាររូបភាពដែលត្រឹមត្រូវ។', failed: 'ឧបករណ៍នេះមិនអាចបង្កើត Artwork បានទេ។', privacy: 'ដំណើរការ Local លើឧបករណ៍នេះ។ រូបរបស់អ្នកមិនត្រូវបាន Upload ទេ។', result: 'Artwork របស់អ្នក', original: 'រូបដើម', artwork: 'Artwork', download: 'ទាញយក PNG', generateAgain: 'បង្កើតម្តងទៀត', output: 'លទ្ធផល', ready: 'Artwork រួចរាល់។', settingsTitle: 'ការកំណត់ Pic to Art', autoSave: 'រក្សាទុក Creation ស្វ័យប្រវត្តិ', autoSaveBody: 'រក្សាទុក Artwork ដែលបានបង្កើតទៅ Creations លើឧបករណ៍នេះ។', rememberControls: 'ចងចាំការកំណត់', rememberControlsBody: 'ចងចាំ Style និងតម្លៃ Slider ចុងក្រោយ។', defaultStyle: 'Style លំនាំដើម', clearCreations: 'លុប Creations ទាំងអស់', clearCreationsBody: 'លុប Pic to Art Creations ដែលរក្សាទុក Local ទាំងអស់។', clearConfirm: 'លុប Pic to Art Creations ទាំងអស់ពីឧបករណ៍នេះមែនទេ?', cleared: 'បានលុប Creations រួចរាល់។', close: 'បិទ', quality: 'គុណភាព Output', standard: 'Standard', hd: 'HD', share: 'Share', shareUnavailable: 'ឧបករណ៍នេះមិនគាំទ្រ Share រូបនេះទេ។' },
  zh: { title: 'Pic to Art', subtitle: '将照片转换成漫画或艺术风格', back: '返回', settings: '设置', creations: '作品', uploadTitle: '添加照片', uploadBody: '从设备中选择一张清晰的照片。', choosePhoto: '选择照片', changePhoto: '更换照片', removePhoto: '移除照片', chooseStyle: '选择风格', manga: '漫画', anime: '动漫', sketch: '素描', comic: '美漫', watercolor: '水彩', bwManga: '黑白漫画', controls: '风格与编辑', strength: '强度', detail: '细节', contrast: '对比度', lineArt: '线稿', reset: '重置', generate: '生成艺术图', generating: '正在生成作品…', noPhoto: '请先选择照片。', invalidPhoto: '请选择有效的图片文件。', failed: '此设备无法生成作品。', privacy: '图片只在本机处理，不会上传。', result: '你的作品', original: '原图', artwork: '作品', download: '下载 PNG', generateAgain: '再次生成', output: '输出', ready: '作品已完成。', settingsTitle: 'Pic to Art 设置', autoSave: '自动保存作品', autoSaveBody: '将生成的作品保存在此设备的作品库中。', rememberControls: '记住控制设置', rememberControlsBody: '记住上次的风格和滑块值。', defaultStyle: '默认风格', clearCreations: '清除作品', clearCreationsBody: '删除本机保存的所有 Pic to Art 作品。', clearConfirm: '删除此设备上的所有 Pic to Art 作品吗？', cleared: '作品已清除。', close: '关闭', quality: '输出质量', standard: '标准', hd: '高清', share: '分享', shareUnavailable: '此设备不支持分享此图片。' },
  ja: { title: 'Pic to Art', subtitle: '写真をマンガやアートに変換', back: '戻る', settings: '設定', creations: '作品', uploadTitle: '写真を追加', uploadBody: '端末から鮮明な写真を選択してください。', choosePhoto: '写真を選択', changePhoto: '写真を変更', removePhoto: '写真を削除', chooseStyle: 'スタイルを選択', manga: 'マンガ', anime: 'アニメ', sketch: 'スケッチ', comic: 'コミック', watercolor: '水彩', bwManga: '白黒マンガ', controls: 'スタイルと編集', strength: '強度', detail: 'ディテール', contrast: 'コントラスト', lineArt: '線画', reset: 'リセット', generate: 'アートを生成', generating: 'アートを生成中…', noPhoto: '先に写真を選択してください。', invalidPhoto: '有効な画像ファイルを選択してください。', failed: 'この端末ではアートを生成できませんでした。', privacy: '端末内で処理され、写真はアップロードされません。', result: 'あなたのアート', original: '元画像', artwork: 'アート', download: 'PNGをダウンロード', generateAgain: 'もう一度生成', output: '出力', ready: 'アートが完成しました。', settingsTitle: 'Pic to Art 設定', autoSave: '作品を自動保存', autoSaveBody: '生成した作品をこの端末の作品一覧に保存します。', rememberControls: '設定を記憶', rememberControlsBody: '最後に使ったスタイルとスライダー値を記憶します。', defaultStyle: 'デフォルトスタイル', clearCreations: '作品をすべて削除', clearCreationsBody: 'この端末に保存された Pic to Art の作品をすべて削除します。', clearConfirm: 'この端末の Pic to Art 作品をすべて削除しますか？', cleared: '作品を削除しました。', close: '閉じる', quality: '出力品質', standard: '標準', hd: 'HD', share: '共有', shareUnavailable: 'この端末では画像共有に対応していません。' },
  ko: { title: 'Pic to Art', subtitle: '사진을 만화 또는 아트로 변환', back: '뒤로', settings: '설정', creations: '작품', uploadTitle: '사진 추가', uploadBody: '기기에서 선명한 사진을 선택하세요.', choosePhoto: '사진 선택', changePhoto: '사진 변경', removePhoto: '사진 삭제', chooseStyle: '스타일 선택', manga: '만화', anime: '애니메이션', sketch: '스케치', comic: '코믹', watercolor: '수채화', bwManga: '흑백 만화', controls: '스타일 및 편집', strength: '강도', detail: '디테일', contrast: '대비', lineArt: '라인 아트', reset: '초기화', generate: '아트 생성', generating: '아트 생성 중…', noPhoto: '먼저 사진을 선택하세요.', invalidPhoto: '올바른 이미지 파일을 선택하세요.', failed: '이 기기에서 아트를 생성할 수 없습니다.', privacy: '기기에서 로컬로 처리되며 사진은 업로드되지 않습니다.', result: '나의 아트', original: '원본', artwork: '아트', download: 'PNG 다운로드', generateAgain: '다시 생성', output: '출력', ready: '아트가 완성되었습니다.', settingsTitle: 'Pic to Art 설정', autoSave: '작품 자동 저장', autoSaveBody: '생성된 작품을 이 기기의 Creations에 저장합니다.', rememberControls: '설정 기억', rememberControlsBody: '마지막 스타일과 슬라이더 값을 기억합니다.', defaultStyle: '기본 스타일', clearCreations: 'Creations 전체 삭제', clearCreationsBody: '이 기기에 저장된 Pic to Art 작품을 모두 삭제합니다.', clearConfirm: '이 기기의 Pic to Art 작품을 모두 삭제할까요?', cleared: 'Creations를 삭제했습니다.', close: '닫기', quality: '출력 품질', standard: '표준', hd: 'HD', share: '공유', shareUnavailable: '이 기기는 이미지 공유를 지원하지 않습니다.' },
})

const STYLE_ITEMS = [
  { key: 'manga', icon: 'fa-book-open' },
  { key: 'anime', icon: 'fa-wand-magic-sparkles' },
  { key: 'sketch', icon: 'fa-pencil' },
  { key: 'comic', icon: 'fa-bolt' },
  { key: 'watercolor', icon: 'fa-palette' },
  { key: 'bwManga', icon: 'fa-circle-half-stroke' },
]

const INITIAL_CONTROLS = { strength: 70, detail: 60, contrast: 50, lineArt: 80 }
const SETTINGS_KEY = 'pic-to-art-settings-v1'
const STYLE_KEYS = new Set(STYLE_ITEMS.map(item => item.key))

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null')
    const defaultStyle = STYLE_KEYS.has(stored?.defaultStyle) ? stored.defaultStyle : 'manga'
    const lastStyle = STYLE_KEYS.has(stored?.lastStyle) ? stored.lastStyle : defaultStyle
    const savedControls = stored?.controls && typeof stored.controls === 'object'
      ? {
          strength: Number(stored.controls.strength ?? INITIAL_CONTROLS.strength),
          detail: Number(stored.controls.detail ?? INITIAL_CONTROLS.detail),
          contrast: Number(stored.controls.contrast ?? INITIAL_CONTROLS.contrast),
          lineArt: Number(stored.controls.lineArt ?? INITIAL_CONTROLS.lineArt),
        }
      : INITIAL_CONTROLS

    return {
      autoSave: stored?.autoSave !== false,
      rememberControls: stored?.rememberControls !== false,
      defaultStyle,
      quality: stored?.quality === 'standard' ? 'standard' : 'hd',
      lastStyle,
      controls: savedControls,
    }
  } catch {
    return {
      autoSave: true,
      rememberControls: true,
      defaultStyle: 'manga',
      quality: 'hd',
      lastStyle: 'manga',
      controls: INITIAL_CONTROLS,
    }
  }
}

export default function PicToArtPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const inputRef = useRef(null)
  const resultRef = useRef('')
  const [appSettings, setAppSettings] = useState(readSettings)
  const [photoUrl, setPhotoUrl] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(() => {
    const settings = readSettings()
    return settings.rememberControls ? settings.lastStyle : settings.defaultStyle
  })
  const [controls, setControls] = useState(() => {
    const settings = readSettings()
    return settings.rememberControls ? settings.controls : INITIAL_CONTROLS
  })
  const [showSettings, setShowSettings] = useState(false)
  const [settingsNotice, setSettingsNotice] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultBlob, setResultBlob] = useState(null)
  const [resultSize, setResultSize] = useState({ width: 0, height: 0 })
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
  }, [photoUrl])

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings))
    } catch {}
  }, [appSettings])

  useEffect(() => {
    if (!showSettings) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [showSettings])

  const styleName = useMemo(() => t(`picToArt.${selectedStyle}`), [selectedStyle, t])
  const openPicker = () => inputRef.current?.click()

  const clearResult = () => {
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    resultRef.current = ''
    setResultUrl('')
    setResultBlob(null)
    setResultSize({ width: 0, height: 0 })
    setProgress(0)
    setShowOriginal(false)
  }

  const selectPhoto = file => {
    if (!file || !String(file.type || '').startsWith('image/')) {
      setError(t('picToArt.invalidPhoto'))
      return
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    clearResult()
    setPhotoUrl(URL.createObjectURL(file))
    setError('')
  }

  const handlePhoto = event => {
    selectPhoto(event.target.files?.[0])
    event.target.value = ''
  }

  const removePhoto = () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl('')
    clearResult()
    setError('')
  }

  const updateControl = (key, value) => {
    setControls(current => {
      const next = { ...current, [key]: Number(value) }
      if (appSettings.rememberControls) {
        setAppSettings(settings => ({ ...settings, controls: next }))
      }
      return next
    })
    clearResult()
  }

  const resetControls = () => {
    const style = appSettings.defaultStyle
    setSelectedStyle(style)
    setControls(INITIAL_CONTROLS)
    if (appSettings.rememberControls) {
      setAppSettings(settings => ({
        ...settings,
        lastStyle: style,
        controls: INITIAL_CONTROLS,
      }))
    }
    clearResult()
    setError('')
  }

  const chooseStyle = key => {
    setSelectedStyle(key)
    if (appSettings.rememberControls) {
      setAppSettings(settings => ({ ...settings, lastStyle: key }))
    }
    clearResult()
  }

  const updateSetting = (key, value) => {
    setAppSettings(settings => ({ ...settings, [key]: value }))
    setSettingsNotice('')
  }

  const clearSavedCreations = async () => {
    if (!window.confirm(t('picToArt.clearConfirm'))) return
    try {
      await clearPicToArtCreations()
      setSettingsNotice(t('picToArt.cleared'))
    } catch {
      setSettingsNotice(t('picToArt.failed'))
    }
  }

  const handleGenerate = async () => {
    if (!photoUrl || processing) {
      if (!photoUrl) setError(t('picToArt.noPhoto'))
      return
    }
    setProcessing(true)
    setError('')
    clearResult()
    try {
      const result = await convertPicToArt({
        sourceUrl: photoUrl,
        style: selectedStyle,
        controls,
        quality: appSettings.quality,
        onProgress: setProgress,
      })
      resultRef.current = result.url
      setResultUrl(result.url)
      setResultBlob(result.blob)
      setResultSize({ width: result.width, height: result.height })
      if (appSettings.autoSave) {
        savePicToArtCreation({
          blob: result.blob,
          width: result.width,
          height: result.height,
          style: selectedStyle,
          controls,
        }).catch(() => {})
      }
    } catch {
      setProgress(0)
      setError(t('picToArt.failed'))
    } finally {
      setProcessing(false)
    }
  }

  const downloadResult = () => {
    if (!resultUrl) return
    const anchor = document.createElement('a')
    anchor.href = resultUrl
    anchor.download = `pic-to-art-${selectedStyle}-${Date.now()}.png`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  const shareResult = async () => {
    if (!resultBlob) return

    const file = new File(
      [resultBlob],
      `pic-to-art-${selectedStyle}-${Date.now()}.png`,
      { type: 'image/png' },
    )

    if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
      setError(t('picToArt.shareUnavailable'))
      return
    }

    try {
      await navigator.share({
        title: t('picToArt.title'),
        files: [file],
      })
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') {
        setError(t('picToArt.shareUnavailable'))
      }
    }
  }

  return (
    <PageShell className="pb-24">
      <PageHeader
        title={t('picToArt.title')}
        subtitle={t('picToArt.subtitle')}
        onBack={() => navigate(-1)}
        backLabel={t('picToArt.back')}
        right={
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/apps/pic-to-art/creations')} className="app-icon-box flex h-9 w-9 items-center justify-center rounded-full" aria-label={t('picToArt.creations')}>
              <i className="fa-regular fa-images text-[14px]" />
            </button>
            <button type="button" onClick={() => setShowSettings(true)} className="app-icon-box flex h-9 w-9 items-center justify-center rounded-full" aria-label={t('picToArt.settings')}>
              <i className="fa-solid fa-gear text-[14px]" />
            </button>
          </div>
        }
      />

      <main className="mx-auto w-full max-w-[760px] px-4 py-5">
        <section className="rounded-[28px] bg-gradient-to-br from-[#f7f2ff] via-[#eee5ff] to-[#faf8ff] p-5 dark:from-[#21172f] dark:via-[#281c3d] dark:to-[#17131f]">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9c63ff] to-[#6f38e8] text-white shadow-lg shadow-purple-500/20">
              <i className="fa-solid fa-wand-magic-sparkles text-[20px]" />
            </div>
            <div className="min-w-0">
              <h2 className="app-title text-[22px] font-black tracking-tight">{t('picToArt.title')}</h2>
              <p className="app-muted mt-1 text-[12px] leading-5">{t('picToArt.subtitle')}</p>
            </div>
          </div>
        </section>

        <SurfaceCard className="mt-4 overflow-hidden p-3">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          {photoUrl ? (
            <div className="relative overflow-hidden rounded-[22px] bg-[var(--shadow-bg-soft)]">
              <img src={photoUrl} alt="" className="max-h-[480px] w-full object-contain" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/65 to-transparent p-3 pt-12">
                <button type="button" onClick={removePhoto} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur" aria-label={t('picToArt.removePhoto')}>
                  <i className="fa-solid fa-trash text-[13px]" />
                </button>
                <button type="button" onClick={openPicker} className="rounded-full bg-[#7c3aed] px-4 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-purple-900/20 active:scale-95">
                  <i className="fa-regular fa-image mr-2" />{t('picToArt.changePhoto')}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={openPicker} className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#cbb6ff] bg-[#faf7ff] px-6 text-center transition active:scale-[0.99] dark:border-[#6d4bb9] dark:bg-[#1e1729]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#efe7ff] text-[#7c3aed] dark:bg-[#33254a] dark:text-[#c8a7ff]"><i className="fa-regular fa-image text-[25px]" /></div>
              <div className="app-title mt-4 text-[16px] font-extrabold">{t('picToArt.uploadTitle')}</div>
              <div className="app-muted mt-1 max-w-[300px] text-[12px] leading-5">{t('picToArt.uploadBody')}</div>
              <span className="mt-5 rounded-full bg-[#7c3aed] px-5 py-3 text-[12px] font-extrabold text-white shadow-lg shadow-purple-500/20">{t('picToArt.choosePhoto')}</span>
            </button>
          )}
        </SurfaceCard>

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="app-title text-[16px] font-extrabold">{t('picToArt.chooseStyle')}</h3>
            <span className="rounded-full bg-[#efe7ff] px-3 py-1 text-[10px] font-bold text-[#7040d8] dark:bg-[#302442] dark:text-[#cfb6ff]">{styleName}</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {STYLE_ITEMS.map(item => {
              const active = selectedStyle === item.key
              return (
                <button key={item.key} type="button" onClick={() => chooseStyle(item.key)} className={`relative rounded-[18px] border p-3 text-center transition active:scale-95 ${active ? 'border-[#8b5cf6] bg-[#f5f0ff] ring-2 ring-[#8b5cf6]/15 dark:bg-[#2b203b]' : 'app-card'}`}>
                  {active ? <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#7c3aed] text-white"><i className="fa-solid fa-check text-[9px]" /></span> : null}
                  <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-[#e9ddff] text-[#7040d8] dark:bg-[#3a2a50] dark:text-[#d5beff]' : 'app-icon-box'}`}><i className={`fa-solid ${item.icon} text-[17px]`} /></div>
                  <div className="app-title mt-2 truncate text-[10px] font-bold">{t(`picToArt.${item.key}`)}</div>
                </button>
              )
            })}
          </div>
        </section>

        <div className="scroll-mt-20">
          <SurfaceCard className="mt-5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="app-title text-[16px] font-extrabold">{t('picToArt.controls')}</h3>
              <button type="button" onClick={resetControls} className="text-[11px] font-bold text-[#7c3aed] dark:text-[#c9aaff]"><i className="fa-solid fa-rotate-left mr-1.5" />{t('picToArt.reset')}</button>
            </div>
            <div className="space-y-4">
              {Object.entries(controls).map(([key, value]) => (
                <label key={key} className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="app-title text-[12px] font-bold">{t(`picToArt.${key}`)}</span>
                    <span className="min-w-[34px] text-right text-[11px] font-extrabold text-[#7c3aed] dark:text-[#c9aaff]">{value}</span>
                  </div>
                  <input type="range" min="0" max="100" value={value} disabled={processing} onChange={event => updateControl(key, event.target.value)} className="w-full cursor-pointer accent-[#7c3aed]" />
                </label>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <p className="app-muted mt-4 text-center text-[10px] leading-4"><i className="fa-solid fa-shield-halved mr-1.5 text-[#7c3aed]" />{t('picToArt.privacy')}</p>

        {error ? <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[11px] font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}

        {processing ? (
          <SurfaceCard className="mt-4 p-4">
            <div className="flex items-center justify-between gap-3 text-[11px] font-bold">
              <span className="app-title">{t('picToArt.generating')}</span>
              <span className="text-[#7c3aed] dark:text-[#c9aaff]">{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--shadow-bg-elevated)]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#9b5cff] to-[#6530dc] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </SurfaceCard>
        ) : null}

        {resultUrl ? (
          <SurfaceCard className="mt-5 overflow-hidden p-3">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div>
                <h3 className="app-title text-[16px] font-extrabold">{t('picToArt.result')}</h3>
                <p className="app-muted mt-0.5 text-[10px]">{t('picToArt.output')}: {resultSize.width} × {resultSize.height}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{t('picToArt.ready')}</span>
            </div>

            <div className="overflow-hidden rounded-[20px] bg-[var(--shadow-bg-soft)]">
              <img src={showOriginal ? photoUrl : resultUrl} alt="" className="max-h-[620px] w-full object-contain" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowOriginal(true)} className={`rounded-xl border px-3 py-2.5 text-[11px] font-bold ${showOriginal ? 'border-[#7c3aed] bg-[#f3edff] text-[#7040d8] dark:bg-[#302442] dark:text-[#cfb6ff]' : 'app-card'}`}>{t('picToArt.original')}</button>
              <button type="button" onClick={() => setShowOriginal(false)} className={`rounded-xl border px-3 py-2.5 text-[11px] font-bold ${!showOriginal ? 'border-[#7c3aed] bg-[#f3edff] text-[#7040d8] dark:bg-[#302442] dark:text-[#cfb6ff]' : 'app-card'}`}>{t('picToArt.artwork')}</button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <button type="button" onClick={downloadResult} className="rounded-[16px] bg-[#7c3aed] px-4 py-3 text-[12px] font-extrabold text-white active:scale-[0.99]"><i className="fa-solid fa-download mr-2" />{t('picToArt.download')}</button>
              <button type="button" onClick={shareResult} className="rounded-[16px] border border-[#bba3ee] px-4 py-3 text-[12px] font-extrabold text-[#7040d8] active:scale-[0.99] dark:border-[#5c4776] dark:text-[#cfb6ff]"><i className="fa-solid fa-share-nodes mr-2" />{t('picToArt.share')}</button>
              <button type="button" onClick={handleGenerate} className="rounded-[16px] border border-[#bba3ee] px-4 py-3 text-[12px] font-extrabold text-[#7040d8] active:scale-[0.99] dark:border-[#5c4776] dark:text-[#cfb6ff]"><i className="fa-solid fa-rotate mr-2" />{t('picToArt.generateAgain')}</button>
            </div>
          </SurfaceCard>
        ) : null}

        <button type="button" onClick={handleGenerate} disabled={processing} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#9b5cff] via-[#7c3aed] to-[#6530dc] px-5 py-4 text-[14px] font-extrabold text-white shadow-xl shadow-purple-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
          <i className="fa-solid fa-wand-magic-sparkles" />{processing ? t('picToArt.generating') : t('picToArt.generate')}<i className="fa-solid fa-chevron-right ml-1 text-[11px]" />
        </button>
      </main>

      {showSettings ? (
        <div
          className="app-overlay fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={t('picToArt.settingsTitle')}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="app-card max-h-[88dvh] w-full max-w-[560px] overflow-auto rounded-t-[28px] border p-5 sm:rounded-[28px]"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="app-title text-[18px] font-extrabold">
                  {t('picToArt.settingsTitle')}
                </h2>
                <p className="app-muted mt-1 text-[10px]">
                  {t('picToArt.privacy')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="app-icon-box flex h-10 w-10 items-center justify-center rounded-full"
                aria-label={t('picToArt.close')}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <SurfaceCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="app-title text-[13px] font-extrabold">
                      {t('picToArt.autoSave')}
                    </div>
                    <div className="app-muted mt-1 text-[10px] leading-4">
                      {t('picToArt.autoSaveBody')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('autoSave', !appSettings.autoSave)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${appSettings.autoSave ? 'bg-[#7c3aed]' : 'bg-[var(--shadow-border-strong)]'}`}
                    aria-pressed={appSettings.autoSave}
                    aria-label={t('picToArt.autoSave')}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${appSettings.autoSave ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </SurfaceCard>

              <SurfaceCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="app-title text-[13px] font-extrabold">
                      {t('picToArt.rememberControls')}
                    </div>
                    <div className="app-muted mt-1 text-[10px] leading-4">
                      {t('picToArt.rememberControlsBody')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('rememberControls', !appSettings.rememberControls)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${appSettings.rememberControls ? 'bg-[#7c3aed]' : 'bg-[var(--shadow-border-strong)]'}`}
                    aria-pressed={appSettings.rememberControls}
                    aria-label={t('picToArt.rememberControls')}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${appSettings.rememberControls ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </SurfaceCard>

              <SurfaceCard className="p-4">
                <label className="block">
                  <span className="app-title text-[13px] font-extrabold">
                    {t('picToArt.quality')}
                  </span>
                  <select
                    value={appSettings.quality}
                    onChange={event => updateSetting('quality', event.target.value)}
                    className="app-input mt-3 h-11 w-full rounded-xl border px-3 text-[12px] font-bold outline-none"
                  >
                    <option value="standard">{t('picToArt.standard')}</option>
                    <option value="hd">{t('picToArt.hd')}</option>
                  </select>
                </label>
              </SurfaceCard>

              <SurfaceCard className="p-4">
                <label className="block">
                  <span className="app-title text-[13px] font-extrabold">
                    {t('picToArt.defaultStyle')}
                  </span>
                  <select
                    value={appSettings.defaultStyle}
                    onChange={event => updateSetting('defaultStyle', event.target.value)}
                    className="app-input mt-3 h-11 w-full rounded-xl border px-3 text-[12px] font-bold outline-none"
                  >
                    {STYLE_ITEMS.map(item => (
                      <option key={item.key} value={item.key}>
                        {t(`picToArt.${item.key}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </SurfaceCard>

              <SurfaceCard className="p-4">
                <div className="app-title text-[13px] font-extrabold text-red-500 dark:text-red-300">
                  {t('picToArt.clearCreations')}
                </div>
                <div className="app-muted mt-1 text-[10px] leading-4">
                  {t('picToArt.clearCreationsBody')}
                </div>
                <button
                  type="button"
                  onClick={clearSavedCreations}
                  className="mt-3 rounded-xl border border-red-200 px-4 py-2.5 text-[11px] font-extrabold text-red-500 active:scale-95 dark:border-red-500/30 dark:text-red-300"
                >
                  <i className="fa-solid fa-trash mr-2" />
                  {t('picToArt.clearCreations')}
                </button>
              </SurfaceCard>

              {settingsNotice ? (
                <div className="rounded-xl bg-[#f3edff] px-4 py-3 text-[11px] font-semibold text-[#6840b7] dark:bg-[#261c35] dark:text-[#d6c0ff]">
                  {settingsNotice}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  )
}
