import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FastForward } from 'lucide-react'
import { useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

const STORAGE_KEY = 'shadow_skip_animation'

registerTranslationNamespace('readerAccessibility', {
  en: {
    title: 'Accessibility',
    skipAnimation: 'Skip Animation',
    description: 'Reduce decorative animations across Shadow.',
    note: 'Animations are enabled by default. Reading and essential actions remain available.',
    back: 'Back to Settings',
  },
  km: {
    title: 'ភាពងាយស្រួលក្នុងការប្រើប្រាស់',
    skipAnimation: 'រំលង Animation',
    description: 'កាត់បន្ថយចលនាតុបតែងក្នុង Shadow។',
    note: 'តាមលំនាំដើម Animation នៅបើក។ ការអាន និងមុខងារសំខាន់ៗនៅដំណើរការដដែល។',
    back: 'ត្រឡប់ទៅ Settings',
  },
  zh: {
    title: '无障碍',
    skipAnimation: '跳过动画',
    description: '减少 Shadow 中的装饰性动画。',
    note: '动画默认开启。阅读和必要操作不受影响。',
    back: '返回设置',
  },
  ja: {
    title: 'アクセシビリティ',
    skipAnimation: 'アニメーションをスキップ',
    description: 'Shadow の装飾的なアニメーションを減らします。',
    note: 'アニメーションは初期状態で有効です。読書と重要な操作には影響しません。',
    back: '設定に戻る',
  },
  ko: {
    title: '접근성',
    skipAnimation: '애니메이션 건너뛰기',
    description: 'Shadow의 장식용 애니메이션을 줄입니다.',
    note: '애니메이션은 기본적으로 켜져 있습니다. 읽기와 필수 동작은 유지됩니다.',
    back: '설정으로 돌아가기',
  },
})

function getSavedPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function AnimationSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="shrink-0 rounded-full"
    >
      <span className={`relative block h-8 w-[54px] rounded-full p-1 transition-all duration-300 ${checked ? 'bg-[#111827]' : 'bg-[#D1D6DE]'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all duration-300 ${checked ? 'left-[26px]' : 'left-1'}`} />
      </span>
    </button>
  )
}

export default function ReaderAccessibilityPage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()
  const [skipAnimation, setSkipAnimation] = useState(getSavedPreference)
  const tr = (key) => t(`readerAccessibility.${key}`)

  useEffect(() => {
    document.documentElement.classList.toggle('shadow-skip-animations', skipAnimation)
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        const next = getSavedPreference()
        setSkipAnimation(next)
        document.documentElement.classList.toggle('shadow-skip-animations', next)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [skipAnimation])

  const toggleSkipAnimation = () => {
    const next = !skipAnimation
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      return
    }
    setSkipAnimation(next)
    document.documentElement.classList.toggle('shadow-skip-animations', next)
    window.dispatchEvent(new CustomEvent('shadow-skip-animation-change', { detail: { enabled: next } }))
  }

  return (
    <main className="app-page min-h-screen bg-[var(--shadow-bg-page)] pb-[calc(28px+env(safe-area-inset-bottom))] text-[var(--shadow-text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-nav-bg)] backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4">
          <button type="button" onClick={() => navigate('/profile/settings')} aria-label={tr('back')} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-[var(--shadow-bg-hover)]">
            <ArrowLeft size={20} strokeWidth={1.8} />
          </button>
          <h1 className="text-[18px] font-semibold">{tr('title')}</h1>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[560px] px-4 pt-5">
        <section className="flex items-center gap-3 rounded-[20px] border border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] px-4 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--shadow-bg-soft)] text-[var(--shadow-text-primary)]">
            <FastForward size={19} strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[13px] font-semibold">{tr('skipAnimation')}</h2>
            <p className="mt-1 text-[11px] leading-4 text-[var(--shadow-text-secondary)]">{tr('description')}</p>
          </div>
          <AnimationSwitch checked={skipAnimation} onChange={toggleSkipAnimation} label={tr('skipAnimation')} />
        </section>
        <p className="mt-4 px-1 text-[11px] leading-5 text-[var(--shadow-text-secondary)]">{tr('note')}</p>
      </div>
    </main>
  )
}
