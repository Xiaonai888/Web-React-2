import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, PageShell } from '../components/common/PagePrimitives'
import ChatStoryTapIndicator, {
  TAP_INDICATOR_ALL_STYLES,
  normalizeTapIndicatorSettings,
} from '../components/chat-story/ChatStoryTapIndicator'
import ChatStoryIndicatorColorsPage from './ChatStoryIndicatorColorsPage'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

const STYLES = TAP_INDICATOR_ALL_STYLES
const COLORS = Object.freeze([
  '#8b5cf6', '#237d94', '#bd513e', '#486b51', '#a8476e',
  '#8054aa', '#26745c', '#376cba', '#92631c', '#80583f',
  '#a94265', '#7e50a7', '#b14d47', '#246f75', '#426a94',
  '#7751b5', '#3f795e', '#98537f', '#337c9d', '#626a86',
])

registerTranslationNamespace('chatIndicatorStyles', {
  en: {
    title: 'Shadow Styles', back: 'Back', styles: 'All Styles', colors: 'Color', custom: 'Choose colors',
    hand: 'Hand', sword: 'Sword', starfish: 'Starfish', moon: 'Moon', heart: 'Heart', sparkles: 'Sparkles',
    bird: 'Bird', flower: 'Flower', cat: 'Cat', paw: 'Paw', leaf: 'Leaf', cloud: 'Cloud',
    diamond: 'Diamond', fire: 'Fire', snow: 'Snow', music: 'Music', crown: 'Crown',
    wing: 'Wing', ghost: 'Ghost', planet: 'Planet',
  },
  km: {
    title: 'រចនាប័ទ្ម Shadow', back: 'ត្រឡប់ក្រោយ', styles: 'រចនាប័ទ្មទាំងអស់', colors: 'ពណ៌', custom: 'ជ្រើសរើសពណ៌',
    hand: 'ដៃ', sword: 'ដាវ', starfish: 'ផ្កាយសមុទ្រ', moon: 'ព្រះចន្ទ', heart: 'បេះដូង', sparkles: 'ពន្លឺផ្កាយ',
    bird: 'បក្សី', flower: 'ផ្កា', cat: 'ឆ្មា', paw: 'បាតជើង', leaf: 'ស្លឹកឈើ', cloud: 'ពពក',
    diamond: 'ពេជ្រ', fire: 'ភ្លើង', snow: 'ព្រិល', music: 'តន្ត្រី', crown: 'មកុដ',
    wing: 'ស្លាប', ghost: 'ខ្មោច', planet: 'ភព',
  },
  zh: {
    title: 'Shadow 样式', back: '返回', styles: '全部样式', colors: '颜色', custom: '选择颜色',
    hand: '手', sword: '剑', starfish: '海星', moon: '月亮', heart: '爱心', sparkles: '闪光',
    bird: '鸟', flower: '花', cat: '猫', paw: '爪印', leaf: '叶子', cloud: '云',
    diamond: '钻石', fire: '火焰', snow: '雪花', music: '音乐', crown: '皇冠',
    wing: '翅膀', ghost: '幽灵', planet: '星球',
  },
  ja: {
    title: 'Shadow スタイル', back: '戻る', styles: 'すべてのスタイル', colors: 'カラー', custom: '色を選ぶ',
    hand: '手', sword: '剣', starfish: 'ヒトデ', moon: '月', heart: 'ハート', sparkles: 'きらめき',
    bird: '鳥', flower: '花', cat: '猫', paw: '足跡', leaf: '葉', cloud: '雲',
    diamond: 'ダイヤ', fire: '炎', snow: '雪', music: '音楽', crown: '王冠',
    wing: '翼', ghost: 'おばけ', planet: '惑星',
  },
  ko: {
    title: 'Shadow 스타일', back: '뒤로', styles: '전체 스타일', colors: '색상', custom: '색상 선택',
    hand: '손', sword: '검', starfish: '불가사리', moon: '달', heart: '하트', sparkles: '반짝임',
    bird: '새', flower: '꽃', cat: '고양이', paw: '발자국', leaf: '잎', cloud: '구름',
    diamond: '다이아', fire: '불꽃', snow: '눈', music: '음악', crown: '왕관',
    wing: '날개', ghost: '유령', planet: '행성',
  },
})

const PAGE_CSS = `
.cs-styles-page{position:fixed;inset:0;z-index:150;display:flex;flex-direction:column;height:100vh;height:100dvh;min-height:0;overflow:hidden;background:var(--shadow-bg-surface);color:var(--shadow-text-primary)}
.cs-styles-page>header{flex:none;padding-top:env(safe-area-inset-top,0px)}
.cs-styles-main{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain}
.cs-styles-inner{max-width:760px;margin:0 auto;padding:20px 14px 28px}
.cs-styles-heading{margin:0 0 16px;font-size:14px;font-weight:700}
.cs-styles-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px 10px}
.cs-styles-item{min-width:0;min-height:108px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:2px solid transparent;border-radius:15px;padding:10px 3px 8px;background:var(--shadow-bg-surface);color:var(--shadow-text-primary);cursor:pointer;transition:border-color .15s}
.cs-styles-item[aria-pressed=true]{border:2px solid #f6c343}
.cs-styles-item:focus-visible,.cs-styles-swatch:focus-visible,.cs-styles-custom:focus-visible{outline:2px solid #f6c343;outline-offset:3px}
.cs-styles-icon{height:57px;display:flex;align-items:center;justify-content:center}
.cs-styles-name{max-width:100%;font-size:11px;line-height:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cs-styles-footer{flex:none;border-top:1px solid var(--shadow-border);padding:10px 0 calc(12px + env(safe-area-inset-bottom,0px));background:var(--shadow-bg-surface)}
.cs-styles-color-title{max-width:760px;margin:0 auto;padding:0 16px 5px;font-size:12px;color:var(--shadow-text-secondary)}
.cs-styles-color-dock{max-width:760px;margin:auto;padding:0 16px;display:flex;align-items:center;gap:10px}
.cs-styles-swatches{min-width:0;flex:1;display:flex;align-items:center;gap:11px;overflow-x:auto;scrollbar-width:none;padding:4px 2px;overscroll-behavior-x:contain}
.cs-styles-swatches::-webkit-scrollbar{display:none}
.cs-styles-swatch{width:34px;height:34px;flex:none;border:2px solid transparent;border-radius:50%;padding:3px;background:transparent;cursor:pointer}
.cs-styles-swatch[aria-pressed=true]{border-color:#f6c343}
.cs-styles-swatch>span{display:block;width:100%;height:100%;border-radius:50%}
.cs-styles-custom{width:46px;height:42px;flex:none;display:grid;place-items:center;padding:0 0 0 10px;border:0;border-left:1px solid var(--shadow-border);background:transparent;cursor:pointer}
.cs-styles-custom>span{display:block;width:31px;height:31px;border-radius:50%;background:conic-gradient(#ff4b70,#ffd438,#42df85,#27bcec,#8f5bff,#ff4b70)}
@media(max-width:360px){.cs-styles-grid{gap:9px 6px}.cs-styles-item{min-height:92px}.cs-styles-icon{height:49px}.cs-styles-name{font-size:10px}}
`

function StyleIcon({ style, settings }) {
  return <ChatStoryTapIndicator
    settings={{ ...settings, source: 'shadow', imageUrl: '', styleId: style.id }}
    animate={false}
    size={52}
  />
}

export default function ChatStoryIndicatorStylesPage({ settings, onChange, onBack, skipAnimation = false }) {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [draft, setDraft] = useState(() => settings || {})
  const [showColors, setShowColors] = useState(false)
  const current = useMemo(() => normalizeTapIndicatorSettings(draft), [draft])

  useEffect(() => {
    if (settings) setDraft(settings)
  }, [settings])

  const text = (key) => t(`chatIndicatorStyles.${key}`)
  const back = () => onBack ? onBack() : navigate(-1)
  const change = (next) => {
    setDraft(next)
    onChange?.(next)
  }
  const select = (id) => change({ ...current, source: 'shadow', styleId: id, imageUrl: '' })
  const chooseColor = (color) => change({ ...current, colorMode: 'solid', colors: [color, ...current.colors.slice(1)] })

  if (showColors) {
    return <ChatStoryIndicatorColorsPage
      settings={current}
      skipAnimation={skipAnimation}
      onBack={() => setShowColors(false)}
      onDone={(next) => { change({ ...next, styleId: current.styleId }); setShowColors(false) }}
    />
  }

  return (
    <PageShell className="cs-styles-page">
      <style>{PAGE_CSS}</style>
      <PageHeader title={text('title')} onBack={back} backLabel={text('back')} />
      <main className="cs-styles-main">
        <div className="cs-styles-inner">
          <h2 className="cs-styles-heading">{text('styles')}</h2>
          <div className="cs-styles-grid">
            {STYLES.map((style) => {
              const selected = current.source === 'shadow' && current.styleId === style.id
              return <button
                key={style.id}
                type="button"
                className="cs-styles-item"
                aria-label={text(style.labelKey)}
                aria-pressed={selected}
                onClick={() => select(style.id)}
              >
                <span className="cs-styles-icon"><StyleIcon style={style} settings={current} /></span>
                <span className="cs-styles-name">{text(style.labelKey)}</span>
              </button>
            })}
          </div>
        </div>
      </main>
      <footer className="cs-styles-footer">
        <div className="cs-styles-color-title">{text('colors')}</div>
        <div className="cs-styles-color-dock">
          <div className="cs-styles-swatches" role="group" aria-label={text('colors')}>
            {COLORS.map((color) => <button
              key={color}
              type="button"
              className="cs-styles-swatch"
              aria-label={color}
              aria-pressed={current.colorMode === 'solid' && current.colors[0].toLowerCase() === color}
              onClick={() => chooseColor(color)}
            ><span style={{ background: color }} /></button>)}
          </div>
          <button type="button" className="cs-styles-custom" aria-label={text('custom')} onClick={() => setShowColors(true)}>
            <span />
          </button>
        </div>
      </footer>
    </PageShell>
  )
}
