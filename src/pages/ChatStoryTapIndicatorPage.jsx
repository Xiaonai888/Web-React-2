import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, PageShell } from '../components/common/PagePrimitives'
import ChatStoryTapIndicator, {
  DEFAULT_TAP_INDICATOR,
  TAP_INDICATOR_STYLES,
  TAP_INDICATOR_ANIMATIONS,
  normalizeTapIndicatorSettings,
} from '../components/chat-story/ChatStoryTapIndicator'
import ChatStoryIndicatorColorsPage from './ChatStoryIndicatorColorsPage'
import ChatStoryIndicatorStylesPage from './ChatStoryIndicatorStylesPage'
import { useChatStoryTheme, chatThemeAccount, chatThemeToken } from '../services/chatStoryThemes'
import { useChatTapIndicator, saveChatTapIndicator } from '../services/chatStoryTapIndicator'
import {
  peekChatIndicatorImage,
  loadChatIndicatorImage,
  uploadChatIndicatorImage,
  deleteChatIndicatorImage,
} from '../services/chatStoryIndicatorImages'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('chatTapIndicatorPage', {
  en: {
    title: 'Tap Indicator', back: 'Back', preview: 'Live preview', tap: 'Tap to continue', apply: 'Apply', applied: 'Applied',
    styles: 'Shadow Styles', styleHint: 'Swipe to explore styles', colors: 'Color', chooseColors: 'Choose colors', originalColors: 'Your image uses its original colors.',
    myImage: 'My Image', upload: 'Drop or upload image', replace: 'Replace image', uploadHelp: 'One square image · Center crop · Up to 5 MB',
    signIn: 'Sign in to upload your image.', loading: 'Loading image…', preparing: 'Preparing image…', uploading: 'Uploading {{percent}}%',
    uploadReady: 'Image uploaded. Select Apply to use it.', unavailable: 'Your images are currently unavailable. Shadow styles still work.',
    retry: 'Retry', delete: 'Delete image', deleteTitle: 'Delete this image?', deleteBody: 'The selected image will be removed from your account.',
    cancel: 'Cancel', deleting: 'Deleting…', animation: 'Animation', bounce: 'Bounce', pulse: 'Pulse', still: 'Still',
    hand: 'Hand', sword: 'Sword', starfish: 'Starfish', moon: 'Moon',
    saveFailed: 'Could not save your indicator.', accountChanged: 'Your account changed. Please reopen this page.',
    invalidType: 'Choose a PNG, JPEG or WebP image.', tooLarge: 'Choose an image smaller than 5 MB.',
    invalidImage: 'Could not process this image.', uploadFailed: 'Upload failed. Your previous image was kept.',
    uploadBusy: 'An upload is already running.', uploadDisabled: 'Image upload is temporarily unavailable.',
    uploadExpired: 'The upload expired. Try again.', imageChanged: 'Your image changed. Reload and try again.',
    rateLimited: 'Too many requests. Try again later.', requestFailed: 'Could not complete the request.',
    deleteFailed: 'Could not delete the image.',
  },
  km: {
    title: 'សញ្ញាចុចបន្ត', back: 'ត្រឡប់ក្រោយ', preview: 'មើលគំរូផ្ទាល់', tap: 'ចុចដើម្បីបន្ត', apply: 'អនុវត្ត', applied: 'បានអនុវត្ត',
    styles: 'រចនាប័ទ្ម Shadow', styleHint: 'អូសដើម្បីមើលរចនាប័ទ្ម', colors: 'ពណ៌', chooseColors: 'ជ្រើសរើសពណ៌', originalColors: 'រូបរបស់អ្នករក្សាពណ៌ដើម។',
    myImage: 'រូបរបស់ខ្ញុំ', upload: 'ទម្លាក់ ឬ បង្ហោះរូប', replace: 'ប្តូររូបថ្មី', uploadHelp: '១ រូបការ៉េ · កាត់កណ្ដាលស្វ័យប្រវត្តិ · អតិបរមា 5 MB',
    signIn: 'ចូលគណនីដើម្បីបង្ហោះរូប។', loading: 'កំពុងទាញយករូប…', preparing: 'កំពុងរៀបចំរូប…', uploading: 'កំពុងបង្ហោះ {{percent}}%',
    uploadReady: 'បង្ហោះរូបរួច។ ចុច អនុវត្ត ដើម្បីប្រើ។', unavailable: 'មិនអាចទាញយករូបបានបច្ចុប្បន្ន។ នៅតែអាចប្រើរចនាប័ទ្ម Shadow។',
    retry: 'ព្យាយាមម្ដងទៀត', delete: 'លុបរូប', deleteTitle: 'លុបរូបនេះមែនទេ?', deleteBody: 'រូបដែលបានជ្រើសនឹងត្រូវលុបពីគណនី។',
    cancel: 'បោះបង់', deleting: 'កំពុងលុប…', animation: 'ចលនា', bounce: 'លោត', pulse: 'រីកបង្រួម', still: 'នៅស្ងៀម',
    hand: 'ដៃ', sword: 'ដាវ', starfish: 'ផ្កាយសមុទ្រ', moon: 'ព្រះចន្ទ',
    saveFailed: 'មិនអាចរក្សាសញ្ញាចុចបន្តបាន។', accountChanged: 'គណនីបានផ្លាស់ប្តូរ។ សូមបើកទំព័រនេះម្ដងទៀត។',
    invalidType: 'សូមជ្រើស PNG, JPEG ឬ WebP។', tooLarge: 'សូមជ្រើសរូបតូចជាង 5 MB។',
    invalidImage: 'មិនអាចកែច្នៃរូបនេះបាន។', uploadFailed: 'បង្ហោះមិនបានជោគជ័យ។ រូបចាស់នៅដដែល។',
    uploadBusy: 'កំពុងបង្ហោះរូបមួយរួចហើយ។', uploadDisabled: 'មុខងារបង្ហោះរូបមិនអាចប្រើបានបណ្ដោះអាសន្ន។',
    uploadExpired: 'ការបង្ហោះហួសពេល។ សូមព្យាយាមម្ដងទៀត។', imageChanged: 'រូបបានផ្លាស់ប្តូរ។ សូមផ្ទុកឡើងវិញ។',
    rateLimited: 'សំណើច្រើនពេក។ សូមព្យាយាមក្រោយ។', requestFailed: 'មិនអាចបញ្ចប់សំណើបាន។',
    deleteFailed: 'មិនអាចលុបរូបបាន។',
  },
  zh: {
    title: '点击指示图', back: '返回', preview: '实时预览', tap: '点击继续', apply: '应用', applied: '已应用',
    styles: 'Shadow 样式', styleHint: '滑动查看更多样式', colors: '颜色', chooseColors: '选择颜色', originalColors: '上传的图片保留原始颜色。',
    myImage: '我的图片', upload: '拖放或上传图片', replace: '替换图片', uploadHelp: '一张正方形图片 · 自动居中裁剪 · 最大 5 MB',
    signIn: '请登录后上传图片。', loading: '正在加载图片…', preparing: '正在处理图片…', uploading: '上传中 {{percent}}%',
    uploadReady: '图片已上传。点击应用以使用。', unavailable: '暂时无法读取图片，仍可使用 Shadow 样式。',
    retry: '重试', delete: '删除图片', deleteTitle: '删除此图片？', deleteBody: '所选图片将从你的账户中删除。',
    cancel: '取消', deleting: '正在删除…', animation: '动画', bounce: '弹跳', pulse: '脉冲', still: '静止',
    hand: '手', sword: '剑', starfish: '海星', moon: '月亮',
    saveFailed: '保存指示图失败。', accountChanged: '账户已更改，请重新打开此页面。',
    invalidType: '请选择 PNG、JPEG 或 WebP 图片。', tooLarge: '请选择小于 5 MB 的图片。',
    invalidImage: '无法处理此图片。', uploadFailed: '上传失败，原图片已保留。',
    uploadBusy: '已有图片正在上传。', uploadDisabled: '暂时无法上传图片。',
    uploadExpired: '上传已过期，请重试。', imageChanged: '图片已更改，请重新加载。',
    rateLimited: '请求过于频繁，请稍后再试。', requestFailed: '请求失败。', deleteFailed: '删除图片失败。',
  },
  ja: {
    title: 'タップインジケーター', back: '戻る', preview: 'ライブプレビュー', tap: 'タップして続ける', apply: '適用', applied: '適用済み',
    styles: 'Shadow スタイル', styleHint: 'スワイプしてスタイルを見る', colors: 'カラー', chooseColors: '色を選ぶ', originalColors: '画像は元の色のまま表示されます。',
    myImage: 'マイ画像', upload: 'ドロップまたはアップロード', replace: '画像を変更', uploadHelp: '正方形1枚 · 中央で自動トリミング · 最大5MB',
    signIn: '画像のアップロードにはログインしてください。', loading: '画像を読み込み中…', preparing: '画像を処理中…', uploading: 'アップロード中 {{percent}}%',
    uploadReady: 'アップロード完了。適用を押して使用します。', unavailable: '画像を読み込めません。Shadow スタイルは使用できます。',
    retry: '再試行', delete: '画像を削除', deleteTitle: 'この画像を削除しますか？', deleteBody: '選択した画像はアカウントから削除されます。',
    cancel: 'キャンセル', deleting: '削除中…', animation: 'アニメーション', bounce: 'バウンス', pulse: 'パルス', still: '静止',
    hand: '手', sword: '剣', starfish: 'ヒトデ', moon: '月',
    saveFailed: 'インジケーターを保存できません。', accountChanged: 'アカウントが変更されました。ページを開き直してください。',
    invalidType: 'PNG、JPEG、WebP画像を選んでください。', tooLarge: '5MB未満の画像を選んでください。',
    invalidImage: '画像を処理できません。', uploadFailed: 'アップロード失敗。前の画像は保持されています。',
    uploadBusy: 'アップロードが進行中です。', uploadDisabled: '現在アップロードできません。',
    uploadExpired: 'アップロード期限切れです。', imageChanged: '画像が変更されました。再読み込みしてください。',
    rateLimited: 'リクエストが多すぎます。', requestFailed: 'リクエストを完了できませんでした。', deleteFailed: '削除できませんでした。',
  },
  ko: {
    title: '탭 표시', back: '뒤로', preview: '실시간 미리보기', tap: '탭하여 계속', apply: '적용', applied: '적용됨',
    styles: 'Shadow 스타일', styleHint: '옆으로 밀어 스타일 보기', colors: '색상', chooseColors: '색상 선택', originalColors: '이미지는 원래 색상을 유지합니다.',
    myImage: '내 이미지', upload: '드롭하거나 이미지 업로드', replace: '이미지 교체', uploadHelp: '정사각형 1장 · 중앙 자동 자르기 · 최대 5MB',
    signIn: '이미지를 업로드하려면 로그인하세요.', loading: '이미지 불러오는 중…', preparing: '이미지 처리 중…', uploading: '업로드 중 {{percent}}%',
    uploadReady: '업로드 완료. 적용을 눌러 사용하세요.', unavailable: '이미지를 불러올 수 없습니다. Shadow 스타일은 사용 가능합니다.',
    retry: '다시 시도', delete: '이미지 삭제', deleteTitle: '이 이미지를 삭제할까요?', deleteBody: '선택한 이미지가 계정에서 삭제됩니다.',
    cancel: '취소', deleting: '삭제 중…', animation: '애니메이션', bounce: '바운스', pulse: '펄스', still: '정지',
    hand: '손', sword: '검', starfish: '불가사리', moon: '달',
    saveFailed: '표시 설정을 저장하지 못했습니다.', accountChanged: '계정이 변경되었습니다. 페이지를 다시 열어주세요.',
    invalidType: 'PNG, JPEG 또는 WebP를 선택하세요.', tooLarge: '5MB보다 작은 이미지를 선택하세요.',
    invalidImage: '이미지를 처리할 수 없습니다.', uploadFailed: '업로드 실패. 기존 이미지는 유지됩니다.',
    uploadBusy: '이미 업로드 중입니다.', uploadDisabled: '현재 이미지 업로드를 사용할 수 없습니다.',
    uploadExpired: '업로드가 만료되었습니다.', imageChanged: '이미지가 변경되었습니다. 새로고침하세요.',
    rateLimited: '요청이 너무 많습니다. 잠시 후 다시 시도하세요.', requestFailed: '요청 실패.', deleteFailed: '이미지를 삭제하지 못했습니다.',
  },
})

const ERROR_KEYS = new Set([
  'signIn', 'unavailable', 'invalidType', 'tooLarge', 'invalidImage', 'uploadFailed', 'uploadBusy',
  'uploadDisabled', 'uploadExpired', 'imageChanged', 'rateLimited', 'requestFailed',
  'accountChanged', 'saveFailed', 'deleteFailed',
])

const INDICATOR_PALETTE_COLORS = Object.freeze([
  '#8b5cf6', '#237d94', '#bd513e', '#486b51', '#a8476e',
  '#8054aa', '#26745c', '#376cba', '#92631c', '#80583f',
  '#a94265', '#7e50a7', '#b14d47', '#246f75', '#426a94',
  '#7751b5', '#3f795e', '#98537f', '#337c9d', '#626a86',
])

const PAGE_CSS = `
.chat-indicator-page{position:fixed;inset:0;z-index:148;display:flex;flex-direction:column;min-height:0;height:100vh;height:100dvh;overflow:hidden;background:var(--shadow-bg-surface);color:var(--shadow-text-primary)}
.chat-indicator-page>header{flex:none;padding-top:env(safe-area-inset-top,0px)}
.cip-main{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}
.cip-inner{width:100%;max-width:760px;margin:auto;padding:18px 16px 28px;box-sizing:border-box}
.cip-section{margin:24px 0 0}
.cip-label{color:var(--shadow-text-primary);font-size:14px;font-weight:700;margin:0 0 8px}
.cip-hint{font-size:12px;color:var(--shadow-text-secondary);line-height:1.65;margin:0 0 12px}
.cip-preview{min-height:185px;border-radius:20px;padding:18px;box-sizing:border-box;display:flex;flex-direction:column;gap:11px;align-items:center;justify-content:center;overflow:hidden}
.cip-preview-caption{margin:0;font-size:12px;color:var(--cs-muted,var(--shadow-text-secondary))}
.cip-swiper{display:flex;gap:12px;overflow-x:auto;padding:3px 2px 12px;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
.cip-style-card{flex:0 0 104px;display:flex;align-items:center;flex-direction:column;gap:9px;min-width:0;scroll-snap-align:start;padding:11px 7px 9px;border:2px solid transparent;border-radius:17px;background:transparent;color:var(--shadow-text-primary);font-size:12px;cursor:pointer}
.cip-style-card[aria-pressed=true]{border-color:#f6c343;background:transparent}
.cip-style-art{width:76px;height:76px;display:grid;place-items:center}
.cip-style-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.cip-row{display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%}
.cip-color-button{display:flex;align-items:center;gap:9px;border:1px solid var(--shadow-border);border-radius:14px;padding:10px 12px;background:var(--shadow-bg-surface);color:var(--shadow-text-primary);font-size:12px;cursor:pointer}
.cip-color-dot{width:24px;height:24px;flex:none;border-radius:50%;border:1px solid #00000018}
.cip-chevron{font-size:21px;line-height:1;color:var(--shadow-text-secondary)}
.cip-drop{min-height:127px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:15px;border:1.5px dashed var(--shadow-border);border-radius:18px;background:var(--shadow-bg-surface);text-align:center;outline-offset:3px}
.cip-drop[data-dragging=true]{border-color:var(--shadow-text-primary);background:var(--shadow-bg-elevated,var(--shadow-bg-soft))}
.cip-drop-label{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 15px;background:var(--shadow-text-primary);color:var(--shadow-bg-surface);font-size:12px;border-radius:12px;cursor:pointer;font-weight:600}
.cip-drop-label[aria-disabled=true]{opacity:.5;cursor:not-allowed}
.cip-drop input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.cip-custom-photo{width:86px;height:86px;object-fit:contain;border:1px solid var(--shadow-border);border-radius:12px;background:repeating-conic-gradient(#dedee3 0 25%,#fff 0 50%) 50% / 18px 18px}
.cip-upload-progress{width:min(280px,100%);height:6px;overflow:hidden;background:var(--shadow-border);border-radius:6px}
.cip-upload-progress span{display:block;height:100%;background:var(--shadow-text-primary);transition:width .15s}
.cip-image-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center}
.cip-quiet{border:0;background:none;color:var(--shadow-text-secondary);font-size:12px;text-decoration:underline;cursor:pointer;padding:6px}
.cip-options{display:flex;flex-wrap:wrap;gap:9px}
.cip-option{padding:9px 15px;background:var(--shadow-bg-surface);color:var(--shadow-text-primary);border:2px solid transparent;border-radius:999px;font-size:12px;cursor:pointer}
.cip-option[aria-pressed=true]{background:var(--shadow-bg-surface);border-color:#f6c343;color:var(--shadow-text-primary)}
.cip-apply{border:0;background:#111827;color:#fff;border-radius:9px;padding:8px 15px;font-size:13px;cursor:pointer}
.cip-apply:disabled{opacity:.45;cursor:default}
.cip-styles-heading{display:flex;width:100%;align-items:center;justify-content:space-between;gap:12px;border:0;background:transparent;padding:0;margin:0;color:var(--shadow-text-primary);font-size:14px;font-weight:700;text-align:left;cursor:pointer}
.cip-styles-heading:disabled{opacity:.45;cursor:default}
.cip-styles-heading .cip-chevron{font-size:20px}
.cip-footer{flex:none;border-top:1px solid var(--shadow-border);padding:10px 0 calc(12px + env(safe-area-inset-bottom,0px));background:var(--shadow-bg-surface)}
.cip-footer-title{max-width:760px;margin:0 auto;padding:0 16px 5px;font-size:12px;color:var(--shadow-text-secondary)}
.cip-footer-inner{max-width:760px;margin:auto;display:flex;align-items:center;gap:12px;padding:0 16px}
.cip-color-scroll{display:flex;min-width:0;flex:1;align-items:center;gap:11px;overflow-x:auto;padding:4px 2px;scrollbar-width:none;overscroll-behavior-x:contain}
.cip-color-scroll::-webkit-scrollbar{display:none}
.cip-color-swatch{flex:none;width:34px;height:34px;padding:3px;border:2px solid transparent;border-radius:50%;background:transparent;cursor:pointer}
.cip-color-swatch[aria-pressed=true]{border-color:#f6c343}
.cip-color-swatch span{display:block;width:100%;height:100%;border-radius:50%}
.cip-gradient-picker{flex:none;width:46px;height:42px;display:grid;place-items:center;padding:4px 0 4px 12px;border:0;border-left:1px solid var(--shadow-border);background:transparent;cursor:pointer}
.cip-gradient-picker span{display:block;width:32px;height:32px;border-radius:50%;background:conic-gradient(#ff4b70,#ffd438,#42df85,#27bcec,#8f5bff,#ff4b70)}
.cip-gradient-picker[aria-pressed=true] span{outline:2px solid #f6c343;outline-offset:3px}
.cip-color-swatch:focus-visible,.cip-gradient-picker:focus-visible,.cip-styles-heading:focus-visible{outline:2px solid #f6c343;outline-offset:3px}
.cip-footer-original{max-width:760px;margin:auto;padding:4px 16px 2px;color:var(--shadow-text-secondary);font-size:12px}
.cip-error{font-size:12px;line-height:1.65;color:var(--shadow-danger,#cf3341);margin:10px 0 0}
.cip-success{font-size:12px;line-height:1.65;color:var(--shadow-text-secondary);margin:10px 0 0}
.cip-confirm{margin-top:11px;padding:14px;border:1px solid var(--shadow-border);border-radius:15px;background:var(--shadow-bg-soft)}
.cip-confirm strong{font-size:13px}
.cip-confirm p{color:var(--shadow-text-secondary);font-size:12px;line-height:1.6;margin:6px 0 10px}
.cip-confirm-actions{display:flex;gap:9px;justify-content:flex-end}
.chat-indicator-page button:focus-visible,.chat-indicator-page label:focus-within{outline:2px solid var(--shadow-text-primary);outline-offset:3px}
`

const equalSettings = (a, b) => JSON.stringify(normalizeTapIndicatorSettings(a)) === JSON.stringify(normalizeTapIndicatorSettings(b))

export default function ChatStoryTapIndicatorPage({ onBack, onApply, skipAnimation = false }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const { style: themeStyle } = useChatStoryTheme()
  const saved = useChatTapIndicator()
  const account = saved.account
  const accountRef = useRef(account)
  const operationRef = useRef(null)
  const readRef = useRef(null)
  const inputRef = useRef(null)
  const dragDepthRef = useRef(0)
  const aliveRef = useRef(true)
  const [draft, setDraft] = useState(() => normalizeTapIndicatorSettings(saved.settings))
  const [image, setImage] = useState(() => peekChatIndicatorImage(account).item)
  const [loading, setLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [showStyles, setShowStyles] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [retry, setRetry] = useState(0)
  const busy = uploading || deleting
  const signedIn = account !== 'guest' && Boolean(chatThemeToken())
  const dirty = !equalSettings(draft, saved.settings)
  const isCustom = draft.source === 'custom'
  const label = useCallback((key, vars) => t(`chatTapIndicatorPage.${key}`, vars), [t])
  const currentSettings = useMemo(() => normalizeTapIndicatorSettings(draft), [draft])
  const colorSwatch = currentSettings.colorMode === 'gradient'
    ? `linear-gradient(${currentSettings.gradientAngle}deg,${currentSettings.colors.join(',')})`
    : currentSettings.colors[0]

  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
      readRef.current?.abort()
      operationRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (accountRef.current === account) return
    accountRef.current = account
    readRef.current?.abort()
    operationRef.current?.abort()
    operationRef.current = null
    setDraft(normalizeTapIndicatorSettings(saved.settings))
    setImage(peekChatIndicatorImage(account).item)
    setShowColors(false)
    setShowStyles(false)
    setConfirmDelete(false)
    setUploading(false)
    setDeleting(false)
    setDragging(false)
    setError('accountChanged')
    setNotice('')
    setRetry((old) => old + 1)
  }, [account, saved.settings])

  useEffect(() => {
    if (!signedIn) {
      setLoading(false)
      setLoadFailed(false)
      return undefined
    }
    const cached = peekChatIndicatorImage(account)
    if (cached.loaded && retry === 0) {
      setImage(cached.item)
      setLoading(false)
      setLoadFailed(false)
      return undefined
    }
    const controller = new AbortController()
    readRef.current = controller
    setLoading(true)
    setLoadFailed(false)
    loadChatIndicatorImage({ force: retry > 0, signal: controller.signal })
      .then((item) => {
        if (controller.signal.aborted || !aliveRef.current || accountRef.current !== account) return
        setImage(item)
        setLoadFailed(false)
      })
      .catch((readError) => {
        if (controller.signal.aborted || !aliveRef.current || accountRef.current !== account) return
        if (readError.code === 'imageChanged') return
        setLoadFailed(true)
      })
      .finally(() => {
        if (readRef.current === controller) readRef.current = null
        if (!controller.signal.aborted && aliveRef.current && accountRef.current === account) setLoading(false)
      })
    return () => controller.abort()
  }, [account, retry, signedIn])

  const selectStyle = (id) => {
    if (busy) return
    setDraft((old) => normalizeTapIndicatorSettings({ ...old, source: 'shadow', imageUrl: '', styleId: id }))
    setNotice('')
    setError('')
    setConfirmDelete(false)
  }

  const selectImage = () => {
    if (!image || busy) return
    setDraft((old) => normalizeTapIndicatorSettings({ ...old, source: 'custom', imageUrl: image.image_url }))
    setNotice('')
    setError('')
  }

  const handleUpload = async (file) => {
    if (!file || operationRef.current) return
    if (!signedIn) { setError('signIn'); return }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setError('invalidType'); return }
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) { setError('tooLarge'); return }
    const controller = new AbortController()
    operationRef.current = controller
    setUploading(true)
    setProgress(0)
    setError('')
    setNotice('')
    setConfirmDelete(false)
    try {
      const result = await uploadChatIndicatorImage(file, {
        signal: controller.signal,
        onProgress: (value) => {
          if (!controller.signal.aborted && aliveRef.current) setProgress(Math.max(0, Math.min(100, value)))
        },
      })
      if (controller.signal.aborted || !aliveRef.current || chatThemeAccount() !== accountRef.current) return
      setImage(result)
      setLoadFailed(false)
      setDraft((old) => normalizeTapIndicatorSettings({ ...old, source: 'custom', imageUrl: result.image_url }))
      if (saved.settings.source === 'custom') {
        try {
          saveChatTapIndicator({ ...saved.settings, imageUrl: result.image_url, source: 'custom' }, accountRef.current)
        } catch (saveError) {
          setError(saveError.code || 'saveFailed')
        }
      }
      setNotice('uploadReady')
    } catch (uploadError) {
      if (!controller.signal.aborted && aliveRef.current) setError(uploadError.code || 'uploadFailed')
    } finally {
      if (operationRef.current === controller) operationRef.current = null
      if (aliveRef.current) setUploading(false)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) void handleUpload(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current = 0
    setDragging(false)
    if (busy) return
    const file = Array.from(event.dataTransfer?.files || []).find((item) => item.type.startsWith('image/'))
    if (file) void handleUpload(file)
    else setError('invalidType')
  }

  const handleBack = () => {
    if (showColors) { setShowColors(false); return }
    if (showStyles) { setShowStyles(false); return }
    if (confirmDelete) { setConfirmDelete(false); return }
    readRef.current?.abort()
    operationRef.current?.abort()
    if (onBack) onBack()
    else navigate(-1)
  }

  const apply = () => {
    if (busy) return
    try {
      if (chatThemeAccount() !== accountRef.current) throw Object.assign(new Error('accountChanged'), { code: 'accountChanged' })
      const result = saveChatTapIndicator(currentSettings, accountRef.current)
      setNotice('')
      setError('')
      onApply?.(result)
    } catch (saveError) {
      setError(saveError.code || 'saveFailed')
    }
  }

  const handleDelete = async () => {
    if (!image || operationRef.current || !signedIn) return
    const controller = new AbortController()
    operationRef.current = controller
    setDeleting(true)
    setError('')
    try {
      await deleteChatIndicatorImage(image.id, { signal: controller.signal })
      if (controller.signal.aborted || !aliveRef.current || chatThemeAccount() !== accountRef.current) return
      setImage(null)
      setConfirmDelete(false)
      setNotice('')
      if (draft.source === 'custom') setDraft((old) => normalizeTapIndicatorSettings({ ...old, source: 'shadow', imageUrl: '', styleId: 'hand' }))
      if (saved.settings.source === 'custom') saveChatTapIndicator({ ...DEFAULT_TAP_INDICATOR, animation: saved.settings.animation }, accountRef.current)
    } catch (deleteError) {
      if (!controller.signal.aborted && aliveRef.current) setError(deleteError.code || 'deleteFailed')
    } finally {
      if (operationRef.current === controller) operationRef.current = null
      if (aliveRef.current) setDeleting(false)
    }
  }

  const choosePaletteColor = (color) => {
    if (busy || isCustom) return
    setDraft((old) => normalizeTapIndicatorSettings({
      ...old, colorMode: 'solid', colors: [color, ...old.colors.slice(1)],
    }))
    setNotice('')
    setError('')
  }

  if (showStyles) {
    return <ChatStoryIndicatorStylesPage
      settings={currentSettings}
      onBack={() => setShowStyles(false)}
      onChange={(settings) => {
        if (busy) return
        setDraft(normalizeTapIndicatorSettings(settings))
        setNotice('')
        setError('')
      }}
      skipAnimation={skipAnimation}
    />
  }

  if (showColors) {
    return <ChatStoryIndicatorColorsPage
      settings={currentSettings}
      skipAnimation={skipAnimation}
      onBack={() => setShowColors(false)}
      onDone={(settings) => { setDraft(normalizeTapIndicatorSettings(settings)); setShowColors(false); setNotice(''); setError('') }}
    />
  }

  return (
    <PageShell className="chat-indicator-page">
      <style>{PAGE_CSS}</style>
      <PageHeader
        title={<span style={{ fontWeight: 700 }}>{label('title')}</span>}
        onBack={handleBack}
        backLabel={label('back')}
        right={<button type="button" className="cip-apply" disabled={busy || !dirty} onClick={apply}>{dirty ? label('apply') : label('applied')}</button>}
      />
      <main className="cip-main">
        <div className="cip-inner">
          <section aria-label={label('preview')}>
            <h2 className="cip-label">{label('preview')}</h2>
            <div className="cip-preview theme-preserve" style={themeStyle}>
              <ChatStoryTapIndicator settings={currentSettings} size={100} skipAnimation={skipAnimation} />
              <p className="cip-preview-caption">{label('tap')}</p>
            </div>
          </section>
          <section className="cip-section" aria-label={label('styles')}>
            <h2 className="cip-label">
              <button type="button" className="cip-styles-heading" disabled={busy} onClick={() => setShowStyles(true)}>
                <span>{label('styles')}</span>
                <span className="cip-chevron" aria-hidden="true">›</span>
              </button>
            </h2>
            <div className="cip-swiper">
              {TAP_INDICATOR_STYLES.map((style) => {
                const chosen = !isCustom && currentSettings.styleId === style.id
                return <button
                  key={style.id}
                  type="button"
                  className="cip-style-card"
                  aria-pressed={chosen}
                  aria-label={label(style.labelKey)}
                  onClick={() => selectStyle(style.id)}
                >
                  <span className="cip-style-art"><ChatStoryTapIndicator settings={{ ...currentSettings, source: 'shadow', imageUrl: '', styleId: style.id }} animate={false} size={67} /></span>
                  <span className="cip-style-name">{label(style.labelKey)}</span>
                </button>
              })}
            </div>
          </section>
          {!isCustom ? <section className="cip-section" aria-label={label('colors')}>
            <h2 className="cip-label">{label('colors')}</h2>
            <button type="button" className="cip-color-button cip-row" onClick={() => setShowColors(true)}>
              <span className="cip-row" style={{ justifyContent: 'flex-start' }}><span className="cip-color-dot" style={{ background: colorSwatch }} /><span>{label('chooseColors')}</span></span>
              <span className="cip-chevron" aria-hidden="true">›</span>
            </button>
          </section> : <p className="cip-hint cip-section">{label('originalColors')}</p>}
          <section className="cip-section" aria-label={label('myImage')}>
            <h2 className="cip-label">{label('myImage')}</h2>
            <p className="cip-hint">{label('uploadHelp')}</p>
            <div
              className="cip-drop"
              data-dragging={dragging}
              onDragEnter={(event) => { event.preventDefault(); dragDepthRef.current += 1; setDragging(true) }}
              onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = busy ? 'none' : 'copy' }}
              onDragLeave={(event) => { event.preventDefault(); dragDepthRef.current -= 1; if (dragDepthRef.current <= 0) { dragDepthRef.current = 0; setDragging(false) } }}
              onDrop={handleDrop}
            >
              {image ? <button type="button" onClick={selectImage} disabled={busy} aria-pressed={isCustom && currentSettings.imageUrl === image.image_url} aria-label={label('myImage')} style={{ border: isCustom ? '2px solid var(--shadow-text-primary)' : '2px solid transparent', padding: 3, borderRadius: 14, background: 'transparent', cursor: 'pointer' }}><img className="cip-custom-photo" src={image.image_url} alt="" loading="lazy" draggable={false} /></button> : null}
              {loading && !image ? <span className="cip-hint" role="status">{label('loading')}</span> : null}
              <div className="cip-image-actions">
                <label className="cip-drop-label" aria-disabled={busy || !signedIn}>
                  <span>{image ? label('replace') : label('upload')}</span>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={busy || !signedIn}
                    aria-label={image ? label('replace') : label('upload')}
                    onChange={handleFileChange}
                  />
                </label>
                {image && signedIn ? <button type="button" className="cip-quiet" disabled={busy} onClick={() => setConfirmDelete((old) => !old)}>{label('delete')}</button> : null}
              </div>
              {!signedIn ? <p className="cip-hint">{label('signIn')}</p> : null}
              {uploading ? <div className="cip-upload-progress" role="progressbar" aria-label={label('upload')} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div> : null}
              {uploading ? <span role="status" className="cip-hint">{progress ? label('uploading', { percent: progress }) : label('preparing')}</span> : null}
              {deleting ? <span role="status" className="cip-hint">{label('deleting')}</span> : null}
            </div>
            {loadFailed && !loading ? <div><p className="cip-error">{label('unavailable')}</p><button className="cip-quiet" type="button" onClick={() => setRetry((old) => old + 1)}>{label('retry')}</button></div> : null}
            {confirmDelete && image ? <div className="cip-confirm" role="group" aria-label={label('deleteTitle')}>
              <strong>{label('deleteTitle')}</strong>
              <p>{label('deleteBody')}</p>
              <div className="cip-confirm-actions">
                <button className="cip-option" type="button" onClick={() => setConfirmDelete(false)}>{label('cancel')}</button>
                <button className="cip-option" type="button" disabled={busy} onClick={handleDelete}>{label('delete')}</button>
              </div>
            </div> : null}
            {notice ? <p className="cip-success" role="status">{label(notice)}</p> : null}
            {error ? <p className="cip-error" role="alert">{label(ERROR_KEYS.has(error) ? error : 'requestFailed')}</p> : null}
          </section>
          <section className="cip-section" aria-label={label('animation')}>
            <h2 className="cip-label">{label('animation')}</h2>
            <div className="cip-options">
              {TAP_INDICATOR_ANIMATIONS.map((animation) => <button
                key={animation}
                type="button"
                className="cip-option"
                aria-pressed={currentSettings.animation === animation}
                onClick={() => { if (!busy) { setDraft((old) => ({ ...old, animation })); setNotice(''); setError('') } }}
              >{label(animation)}</button>)}
            </div>
          </section>
        </div>
      </main>
      <footer className="cip-footer">
        <div className="cip-footer-title">{label('colors')}</div>
        {isCustom ? (
          <p className="cip-footer-original">{label('originalColors')}</p>
        ) : (
          <div className="cip-footer-inner">
            <div className="cip-color-scroll" role="group" aria-label={label('colors')}>
              {INDICATOR_PALETTE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="cip-color-swatch"
                  aria-label={color}
                  aria-pressed={currentSettings.colorMode === 'solid' && currentSettings.colors[0].toLowerCase() === color}
                  disabled={busy}
                  onClick={() => choosePaletteColor(color)}
                >
                  <span style={{ background: color }} />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="cip-gradient-picker"
              aria-label={label('chooseColors')}
              aria-pressed={currentSettings.colorMode === 'gradient'}
              disabled={busy}
              onClick={() => setShowColors(true)}
            >
              <span />
            </button>
          </div>
        )}
      </footer>
    </PageShell>
  )
}
