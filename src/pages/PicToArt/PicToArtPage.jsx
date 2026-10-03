import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, PageShell, SurfaceCard } from '../../components/common/PagePrimitives'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'
import { useDisplayTranslation } from '../../utils/displayLanguage'

registerTranslationNamespace('picToArt', {
  en: { title: 'Pic to Art', subtitle: 'Convert your photo into manga or art', back: 'Back', settings: 'Settings', uploadTitle: 'Add a photo', uploadBody: 'Choose a clear photo from your device.', choosePhoto: 'Choose Photo', changePhoto: 'Change Photo', removePhoto: 'Remove Photo', chooseStyle: 'Choose Style', manga: 'Manga', anime: 'Anime', sketch: 'Sketch', comic: 'Comic', watercolor: 'Watercolor', bwManga: 'B&W Manga', controls: 'Style & Edit', strength: 'Strength', detail: 'Detail', contrast: 'Contrast', lineArt: 'Line Art', reset: 'Reset', generate: 'Generate Art', generateHint: 'The conversion engine will be connected in the next stage.', noPhoto: 'Choose a photo first.', privacy: 'Your photo stays on this device during this UI stage.' },
  km: { title: 'Pic to Art', subtitle: 'បម្លែងរូបថតរបស់អ្នកទៅជា Manga ឬ Art', back: 'ត្រឡប់ក្រោយ', settings: 'ការកំណត់', uploadTitle: 'បន្ថែមរូបថត', uploadBody: 'ជ្រើសរូបថតដែលច្បាស់ពីឧបករណ៍របស់អ្នក។', choosePhoto: 'ជ្រើសរូបថត', changePhoto: 'ប្តូររូបថត', removePhoto: 'លុបរូបថត', chooseStyle: 'ជ្រើស Style', manga: 'Manga', anime: 'Anime', sketch: 'Sketch', comic: 'Comic', watercolor: 'Watercolor', bwManga: 'B&W Manga', controls: 'Style & Edit', strength: 'Strength', detail: 'Detail', contrast: 'Contrast', lineArt: 'Line Art', reset: 'កំណត់ឡើងវិញ', generate: 'បង្កើត Art', generateHint: 'Engine សម្រាប់ Convert នឹងភ្ជាប់នៅដំណាក់កាលបន្ទាប់។', noPhoto: 'សូមជ្រើសរូបថតជាមុន។', privacy: 'នៅដំណាក់កាល UI នេះ រូបរបស់អ្នកនៅតែលើឧបករណ៍នេះ។' },
  zh: { title: 'Pic to Art', subtitle: '将照片转换成漫画或艺术风格', back: '返回', settings: '设置', uploadTitle: '添加照片', uploadBody: '从设备中选择一张清晰的照片。', choosePhoto: '选择照片', changePhoto: '更换照片', removePhoto: '移除照片', chooseStyle: '选择风格', manga: '漫画', anime: '动漫', sketch: '素描', comic: '美漫', watercolor: '水彩', bwManga: '黑白漫画', controls: '风格与编辑', strength: '强度', detail: '细节', contrast: '对比度', lineArt: '线稿', reset: '重置', generate: '生成艺术图', generateHint: '转换引擎将在下一阶段接入。', noPhoto: '请先选择照片。', privacy: '当前 UI 阶段中，照片只保留在此设备上。' },
  ja: { title: 'Pic to Art', subtitle: '写真をマンガやアートに変換', back: '戻る', settings: '設定', uploadTitle: '写真を追加', uploadBody: '端末から鮮明な写真を選択してください。', choosePhoto: '写真を選択', changePhoto: '写真を変更', removePhoto: '写真を削除', chooseStyle: 'スタイルを選択', manga: 'マンガ', anime: 'アニメ', sketch: 'スケッチ', comic: 'コミック', watercolor: '水彩', bwManga: '白黒マンガ', controls: 'スタイルと編集', strength: '強度', detail: 'ディテール', contrast: 'コントラスト', lineArt: '線画', reset: 'リセット', generate: 'アートを生成', generateHint: '変換エンジンは次の段階で接続します。', noPhoto: '先に写真を選択してください。', privacy: 'この UI 段階では写真は端末内にのみ保持されます。' },
  ko: { title: 'Pic to Art', subtitle: '사진을 만화 또는 아트로 변환', back: '뒤로', settings: '설정', uploadTitle: '사진 추가', uploadBody: '기기에서 선명한 사진을 선택하세요.', choosePhoto: '사진 선택', changePhoto: '사진 변경', removePhoto: '사진 삭제', chooseStyle: '스타일 선택', manga: '만화', anime: '애니메이션', sketch: '스케치', comic: '코믹', watercolor: '수채화', bwManga: '흑백 만화', controls: '스타일 및 편집', strength: '강도', detail: '디테일', contrast: '대비', lineArt: '라인 아트', reset: '초기화', generate: '아트 생성', generateHint: '변환 엔진은 다음 단계에서 연결됩니다.', noPhoto: '먼저 사진을 선택하세요.', privacy: '현재 UI 단계에서는 사진이 이 기기에만 유지됩니다.' },
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

export default function PicToArtPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const inputRef = useRef(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('manga')
  const [controls, setControls] = useState(INITIAL_CONTROLS)
  const [message, setMessage] = useState('')

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl) }, [photoUrl])

  const styleName = useMemo(() => t(`picToArt.${selectedStyle}`), [selectedStyle, t])
  const openPicker = () => inputRef.current?.click()

  const handlePhoto = event => {
    const file = event.target.files?.[0]
    if (!file) return
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(URL.createObjectURL(file))
    setMessage('')
    event.target.value = ''
  }

  const removePhoto = () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl('')
    setMessage('')
  }

  const updateControl = (key, value) => setControls(current => ({ ...current, [key]: Number(value) }))
  const resetControls = () => { setSelectedStyle('manga'); setControls(INITIAL_CONTROLS); setMessage('') }
  const handleGenerate = () => setMessage(t(photoUrl ? 'picToArt.generateHint' : 'picToArt.noPhoto'))

  return (
    <PageShell className="pb-24">
      <PageHeader
        title={t('picToArt.title')}
        subtitle={t('picToArt.subtitle')}
        onBack={() => navigate(-1)}
        backLabel={t('picToArt.back')}
        right={
          <button type="button" className="app-icon-box flex h-9 w-9 items-center justify-center rounded-full" aria-label={t('picToArt.settings')}>
            <i className="fa-solid fa-gear text-[14px]" />
          </button>
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
                <button key={item.key} type="button" onClick={() => setSelectedStyle(item.key)} className={`relative rounded-[18px] border p-3 text-center transition active:scale-95 ${active ? 'border-[#8b5cf6] bg-[#f5f0ff] ring-2 ring-[#8b5cf6]/15 dark:bg-[#2b203b]' : 'app-card'}`}>
                  {active ? <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#7c3aed] text-white"><i className="fa-solid fa-check text-[9px]" /></span> : null}
                  <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-[#e9ddff] text-[#7040d8] dark:bg-[#3a2a50] dark:text-[#d5beff]' : 'app-icon-box'}`}><i className={`fa-solid ${item.icon} text-[17px]`} /></div>
                  <div className="app-title mt-2 truncate text-[10px] font-bold">{t(`picToArt.${item.key}`)}</div>
                </button>
              )
            })}
          </div>
        </section>

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
                <input type="range" min="0" max="100" value={value} onChange={event => updateControl(key, event.target.value)} className="w-full cursor-pointer accent-[#7c3aed]" />
              </label>
            ))}
          </div>
        </SurfaceCard>

        <p className="app-muted mt-4 text-center text-[10px] leading-4"><i className="fa-solid fa-shield-halved mr-1.5 text-[#7c3aed]" />{t('picToArt.privacy')}</p>

        {message ? <div className="mt-3 rounded-2xl border border-[#ddcffb] bg-[#f8f4ff] px-4 py-3 text-center text-[11px] font-semibold text-[#6840b7] dark:border-[#4f3c68] dark:bg-[#21192c] dark:text-[#d8c1ff]">{message}</div> : null}

        <button type="button" onClick={handleGenerate} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#9b5cff] via-[#7c3aed] to-[#6530dc] px-5 py-4 text-[14px] font-extrabold text-white shadow-xl shadow-purple-500/20 active:scale-[0.99]">
          <i className="fa-solid fa-wand-magic-sparkles" />{t('picToArt.generate')}<i className="fa-solid fa-chevron-right ml-1 text-[11px]" />
        </button>
      </main>
    </PageShell>
  )
}
