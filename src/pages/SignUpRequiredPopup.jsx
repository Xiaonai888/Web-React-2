import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDisplayTranslation } from '../utils/displayLanguage'
import { registerTranslationNamespace } from '../i18n/registerTranslations'

registerTranslationNamespace('signUpRequiredPopup', {
  en: {
    titleFirst: 'Create an account to',
    titleAccent: 'read this story',
    description: 'Join Shadow to read stories, save your progress, and connect with your favorite authors.',
    read: 'Read full stories',
    save: 'Save to library',
    interact: 'Like & comment',
    follow: 'Follow authors',
    create: 'Create an Account',
    login: 'I Already Have an Account',
    later: 'Maybe Later',
    close: 'Close',
  },
  km: {
    titleFirst: 'បង្កើតគណនីដើម្បី',
    titleAccent: 'អានរឿងនេះ',
    description: 'ចូលរួមជាមួយ Shadow ដើម្បីអានរឿង រក្សាទុកវឌ្ឍនភាពអាន និងតាមដានអ្នកនិពន្ធដែលអ្នកចូលចិត្ត។',
    read: 'អានរឿងពេញលេញ',
    save: 'រក្សាទុកក្នុងបណ្ណាល័យ',
    interact: 'ចូលចិត្ត និងមតិ',
    follow: 'តាមដានអ្នកនិពន្ធ',
    create: 'បង្កើតគណនី',
    login: 'ខ្ញុំមានគណនីរួចហើយ',
    later: 'ពេលក្រោយ',
    close: 'បិទ',
  },
  zh: {
    titleFirst: '创建账号以',
    titleAccent: '阅读这个故事',
    description: '加入 Shadow，阅读故事、保存阅读进度，并关注喜爱的作者。',
    read: '阅读完整故事',
    save: '保存到书架',
    interact: '点赞与评论',
    follow: '关注作者',
    create: '创建账号',
    login: '我已有账号',
    later: '以后再说',
    close: '关闭',
  },
  ja: {
    titleFirst: 'アカウントを作成して',
    titleAccent: 'この作品を読む',
    description: 'Shadowに登録して作品を読み、読書の進捗を保存し、お気に入りの作者をフォローしましょう。',
    read: '作品を最後まで読む',
    save: '本棚に保存',
    interact: 'いいね・コメント',
    follow: '作者をフォロー',
    create: 'アカウントを作成',
    login: 'アカウントをお持ちの方',
    later: 'あとで',
    close: '閉じる',
  },
  ko: {
    titleFirst: '계정을 만들고',
    titleAccent: '이 이야기를 읽어보세요',
    description: 'Shadow에 가입해 이야기를 읽고, 독서 진행 상황을 저장하고, 좋아하는 작가를 팔로우하세요.',
    read: '전체 이야기 읽기',
    save: '서재에 저장',
    interact: '좋아요 및 댓글',
    follow: '작가 팔로우',
    create: '계정 만들기',
    login: '이미 계정이 있어요',
    later: '나중에',
    close: '닫기',
  },
})

const POPUP_LAYOUT = {
  maxWidth: 490,
  paddingTop: 20,
  paddingBottom: 24,
}

const IMAGE_LAYOUT = {
  width: 350,
  height: 205,
  scale: 1,
  moveX: 0,
  moveY: 0,
  frameHeight: 205,
}

const FEATURES = [
  ['fa-solid fa-book-open', 'read'],
  ['fa-solid fa-heart', 'save'],
  ['fa-solid fa-comment-dots', 'interact'],
  ['fa-solid fa-user', 'follow'],
]

export default function SignUpRequiredPopup({ open = false, onClose = () => {} }) {
  const { t } = useDisplayTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const closeRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const elements = [...dialogRef.current.querySelectorAll('button:not([disabled])')]
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#110f1d]/75 px-3 py-3 backdrop-blur-[5px] sm:px-6 sm:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-up-required-title"
        aria-describedby="sign-up-required-description"
        className="relative max-h-[calc(100dvh-24px)] w-full overflow-y-auto overscroll-contain rounded-[28px] border border-[#eae4fb] bg-[linear-gradient(145deg,#ffffff,#fcfaff)] px-5 text-center text-[#262334] shadow-[0_24px_80px_rgba(18,10,45,0.35)] dark:border-[#504366] dark:bg-none dark:bg-[#221b30] dark:text-[#f7f2ff] sm:max-h-[calc(100dvh-48px)] sm:px-8"
        style={{ maxWidth: POPUP_LAYOUT.maxWidth, paddingTop: POPUP_LAYOUT.paddingTop, paddingBottom: POPUP_LAYOUT.paddingBottom }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t('signUpRequiredPopup.close')}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#ede8f7] bg-white text-[#252334] shadow-sm transition hover:bg-[#f3effb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8254e9] dark:border-white/10 dark:bg-[#392e4a] dark:text-white dark:hover:bg-[#4b3a61]"
        >
          <i className="fa-solid fa-xmark text-[17px]" aria-hidden="true" />
        </button>

        <div className="relative mx-auto mt-3 w-full max-w-full" style={{ height: IMAGE_LAYOUT.frameHeight }}>
          <img
            src="/assets/Icons/Picture/No_Login.webp"
            alt=""
            className="absolute left-1/2 top-1/2 max-w-none object-contain"
            style={{
              width: IMAGE_LAYOUT.width,
              height: IMAGE_LAYOUT.height,
              transform: `translate(-50%, -50%) translate(${IMAGE_LAYOUT.moveX}px, ${IMAGE_LAYOUT.moveY}px) scale(${IMAGE_LAYOUT.scale})`,
            }}
          />
        </div>

        <h2 id="sign-up-required-title" className="mt-2 text-[22px] font-black leading-[1.22] tracking-tight sm:text-[29px]">
          {t('signUpRequiredPopup.titleFirst')}{' '}
          <span className="block text-[#7243d7] dark:text-[#b69aff]">{t('signUpRequiredPopup.titleAccent')}</span>
        </h2>
        <p id="sign-up-required-description" className="mx-auto mt-3 max-w-[390px] text-[12px] font-medium leading-[1.55] text-[#747188] dark:text-[#c7bdd7] sm:text-[14px]">
          {t('signUpRequiredPopup.description')}
        </p>

        <div className="mt-5 grid grid-cols-4 gap-1.5 sm:mt-6 sm:gap-3">
          {FEATURES.map(([icon, key]) => (
            <div key={key} className="flex min-w-0 flex-col items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2edff] text-[#7545da] dark:bg-[#3b2d55] dark:text-[#c4aaff] sm:h-12 sm:w-12">
                <i className={`${icon} text-[17px]`} aria-hidden="true" />
              </span>
              <span className="text-[10px] font-bold leading-[1.3] text-[#494459] dark:text-[#e0d9ea] sm:text-[11px]">{t(`signUpRequiredPopup.${key}`)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:mt-7">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9254ef] to-[#5936cf] px-5 py-3 text-[13px] font-extrabold text-white shadow-[0_8px_18px_rgba(105,65,201,0.22)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8254e9] sm:text-[15px]"
          >
            <i className="fa-solid fa-user-plus" aria-hidden="true" />
            <span>{t('signUpRequiredPopup.create')}</span>
            <i className="fa-solid fa-chevron-right ml-auto text-[11px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/login', { state: { returnTo: location.pathname } })}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-[#e3ddf0] bg-white px-5 py-3 text-[12px] font-extrabold text-[#3c3556] shadow-sm transition hover:bg-[#f7f3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8254e9] dark:border-[#5b4b70] dark:bg-[#332841] dark:text-[#f4effc] dark:hover:bg-[#453455] sm:text-[14px]"
          >
            <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
            <span>{t('signUpRequiredPopup.login')}</span>
            <i className="fa-solid fa-chevron-right ml-auto text-[11px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mx-auto mt-1 rounded-lg px-4 py-2 text-[12px] font-semibold text-[#77718b] underline underline-offset-4 transition hover:text-[#7344d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8254e9] dark:text-[#c1b7d2] dark:hover:text-white sm:text-[13px]"
          >
            {t('signUpRequiredPopup.later')}
          </button>
        </div>
      </section>
    </div>,
    document.body
  )
}
