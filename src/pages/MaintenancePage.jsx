import { useEffect, useRef, useState } from 'react'

const DISPLAY_LANGUAGE_STORAGE_KEY = 'shadow_display_language'

const LANGUAGES = [
  { id: 'km', label: 'ខ្មែរ' },
  { id: 'en', label: 'English' },
  { id: 'zh', label: '中文' },
  { id: 'ja', label: '日本語' },
  { id: 'ko', label: '한국어' },
]

const TEXT = {
  km: {
    title: 'វេបសាយកំពុងស្ថិតក្នុងការថែទាំ',
    description:
      'យើងកំពុងពិនិត្យ និងកែលម្អប្រព័ន្ធ ដើម្បីឱ្យការប្រើប្រាស់កាន់តែប្រសើរ។ សូមអភ័យទោសចំពោះការរអាក់រអួល និងសូមព្យាយាមចូលម្តងទៀតនៅពេលបន្តិចទៀត។',
    status: 'ក្រុមការងារកំពុងដោះស្រាយ',
    help: 'បើត្រូវការជំនួយ សូមទាក់ទងមកកាន់',
    retry: 'ព្យាយាមចូលម្តងទៀត',
    footer: 'សូមអរគុណសម្រាប់ការអត់ធ្មត់ និងការគាំទ្រ',
  },
  en: {
    title: 'The website is under maintenance',
    description:
      'We are checking and improving the system to provide a better experience. We apologize for the inconvenience and ask you to try again shortly.',
    status: 'Our team is working on it',
    help: 'Need help? Contact us',
    retry: 'Try again',
    footer: 'Thank you for your patience and support',
  },
  zh: {
    title: '网站正在维护中',
    description:
      '我们正在检查并改进系统，以提供更好的使用体验。对于给您带来的不便，我们深表歉意，请稍后再试。',
    status: '我们的团队正在处理中',
    help: '如需帮助，请联系我们',
    retry: '重试',
    footer: '感谢您的耐心与支持',
  },
  ja: {
    title: 'ウェブサイトはメンテナンス中です',
    description:
      'より良いサービスを提供するため、システムの確認と改善を行っています。ご不便をおかけして申し訳ありません。しばらくしてからもう一度お試しください。',
    status: '現在対応中です',
    help: 'サポートが必要な場合はこちら',
    retry: 'もう一度試す',
    footer: 'ご理解とご支援ありがとうございます',
  },
  ko: {
    title: '웹사이트 점검 중입니다',
    description:
      '더 나은 이용 환경을 제공하기 위해 시스템을 점검하고 개선하고 있습니다. 불편을 드려 죄송하며 잠시 후 다시 시도해 주세요.',
    status: '현재 문제를 해결하고 있습니다',
    help: '도움이 필요하면 문의해 주세요',
    retry: '다시 시도',
    footer: '기다려 주시고 응원해 주셔서 감사합니다',
  },
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(DISPLAY_LANGUAGE_STORAGE_KEY)
    return LANGUAGES.some((item) => item.id === saved) ? saved : 'km'
  } catch {
    return 'km'
  }
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 12h18M12 3c2.3 2.45 3.5 5.45 3.5 9S14.3 18.55 12 21M12 3c-2.3 2.45-3.5 5.45-3.5 9S9.7 18.55 12 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m7 9.5 5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m9 18 6-6-6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ToolFixIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.7 6.3a4.5 4.5 0 0 0-5.83-5.6l2.7 2.7-2.17 2.17-2.7-2.7a4.5 4.5 0 0 0 5.6 5.83l7.02 7.02a2.25 2.25 0 1 1-3.18 3.18L9.12 11.9a4.5 4.5 0 0 0 5.58-5.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M13.72 22v-8.2h2.75l.41-3.2h-3.16V8.56c0-.93.26-1.56 1.59-1.56H17V4.15c-.29-.04-1.3-.12-2.47-.12-2.45 0-4.13 1.49-4.13 4.23v2.35H7.63v3.2h2.77V22h3.32Z"
      />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#229ED9"
        d="M21.72 3.33 18.6 18.96c-.24 1.1-.86 1.37-1.74.85l-4.75-3.5-2.29 2.21c-.25.25-.47.47-.96.47l.34-4.84 8.66-7.82c.38-.34-.08-.53-.58-.2L6.58 12.86l-4.6-1.44c-1-.31-1.02-1 .21-1.47L20.2 3c.84-.31 1.58.2 1.52.33Z"
      />
    </svg>
  )
}

export default function MaintenancePage() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef(null)

  const tx = TEXT[language] || TEXT.km
  const currentLanguage = LANGUAGES.find((item) => item.id === language) || LANGUAGES[0]

  useEffect(() => {
    const closeLanguageMenu = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeLanguageMenu)
    return () => document.removeEventListener('pointerdown', closeLanguageMenu)
  }, [])

  const changeLanguage = (languageId) => {
    setLanguage(languageId)
    setLanguageOpen(false)

    try {
      localStorage.setItem(DISPLAY_LANGUAGE_STORAGE_KEY, languageId)
      window.dispatchEvent(new Event('shadow-display-language-change'))
    } catch {}
  }

  return (
    <main className="maintenance-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          min-height: 100%;
          margin: 0;
        }

        body {
          margin: 0;
          color: #111827;
          font-family: Inter, "Noto Sans Khmer", "Khmer OS Battambang", Arial, sans-serif;
        }

        button,
        a {
          font: inherit;
        }

        .maintenance-page {
          min-height: 100vh;
          padding: 18px 15px 28px;
          background-color: #FAFAFA;
          background-image:
            linear-gradient(180deg, rgba(250,250,250,0) 0%, rgba(250,250,250,0.18) 38%, rgba(250,250,250,0.72) 76%, #FAFAFA 100%),
            linear-gradient(90deg, #F2EEFF 0%, #FFF8E8 100%);
          background-repeat: no-repeat;
          background-size: 100% 270px, 100% 270px;
        }

        .maintenance-shell {
          width: min(100%, 700px);
          margin: 0 auto;
        }

        .maintenance-topbar {
          min-height: 46px;
          display: flex;
          justify-content: flex-end;
        }

        .language-wrap {
          position: relative;
          z-index: 30;
        }

        .language-button {
          height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          color: #111827;
          cursor: pointer;
        }

        .language-button svg:first-child {
          width: 18px;
          height: 18px;
        }

        .language-button svg:last-child {
          width: 15px;
          height: 15px;
        }

        .language-label {
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .language-menu {
          position: absolute;
          top: calc(100% + 7px);
          right: 0;
          width: 174px;
          padding: 6px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
        }

        .language-option {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #111827;
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
        }

        .language-option:hover,
        .language-option.active {
          background: #f7f7f8;
        }

        .maintenance-content {
          padding-top: 25px;
          text-align: center;
        }

        .brand-logo {
          display: block;
          width: 98px;
          height: 98px;
          margin: 0 auto;
          object-fit: contain;
        }

        .maintenance-title {
          max-width: 650px;
          margin: 29px auto 0;
          color: #111827;
          font-weight: 700;
          letter-spacing: 0;
        }

        .maintenance-title.khmer {
          font-family: "Noto Sans Khmer", "Khmer OS Battambang", Inter, Arial, sans-serif;
          font-size: clamp(29px, 5.2vw, 38px);
          line-height: 1.55;
        }

        .maintenance-title.english {
          font-family: Inter, Arial, sans-serif;
          font-size: clamp(36px, 6vw, 48px);
          line-height: 1.16;
          letter-spacing: -1px;
        }

        .maintenance-title.other {
          font-size: clamp(31px, 5.5vw, 42px);
          line-height: 1.3;
        }

        .maintenance-description {
          max-width: 585px;
          margin: 20px auto 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.9;
        }

        .status-box {
          width: fit-content;
          max-width: 100%;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 20px;
          padding: 9px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          color: #111827;
          font-size: 13px;
          font-weight: 600;
        }

        .status-icon {
          width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          color: #7C3AED;
        }

        .status-icon svg {
          width: 18px;
          height: 18px;
        }

        .contact-section {
          margin-top: 27px;
        }

        .contact-title {
          margin: 0 0 11px;
          color: #667085;
          font-size: 12px;
          font-weight: 500;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .contact-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          color: #111827;
          text-align: left;
          text-decoration: none;
        }

        .contact-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: transparent;
        }

        .contact-icon svg {
          width: 32px;
          height: 32px;
        }

        .contact-copy {
          min-width: 0;
          flex: 1;
        }

        .contact-name {
          display: block;
          overflow: hidden;
          color: #111827;
          font-size: 13px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .contact-type {
          display: block;
          margin-top: 3px;
          color: #98a2b3;
          font-size: 11px;
          font-weight: 400;
        }

        .contact-arrow {
          width: 17px;
          height: 17px;
          flex: 0 0 auto;
          color: #98a2b3;
        }

        .retry-button {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 15px;
          padding: 13px 18px;
          border: 0;
          border-radius: 12px;
          background: #111827;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .retry-button:active {
          transform: scale(0.99);
        }

        .maintenance-footer {
          margin: 16px 0 0;
          color: #98a2b3;
          font-size: 11px;
          line-height: 1.7;
          text-align: center;
        }

        @media (max-width: 620px) {
          .maintenance-content {
            padding-top: 22px;
          }

          .brand-logo {
            width: 88px;
            height: 88px;
          }

          .maintenance-title {
            margin-top: 25px;
          }

          .maintenance-title.khmer {
            font-size: clamp(27px, 8.3vw, 34px);
            line-height: 1.55;
          }

          .maintenance-title.english {
            max-width: 340px;
            font-size: clamp(34px, 9vw, 42px);
            line-height: 1.14;
          }

          .maintenance-title.other {
            font-size: clamp(29px, 8vw, 36px);
          }

          .maintenance-description {
            font-size: 12px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 380px) {
          .maintenance-page {
            padding-left: 12px;
            padding-right: 12px;
          }

          .maintenance-content {
            padding-top: 18px;
          }

          .brand-logo {
            width: 82px;
            height: 82px;
          }

          .maintenance-title.khmer {
            font-size: 27px;
          }

          .maintenance-title.english {
            font-size: 34px;
          }
        }
      `}</style>

      <div className="maintenance-shell">
        <div className="maintenance-topbar">
          <div className="language-wrap" ref={languageRef}>
            <button
              type="button"
              className="language-button"
              onClick={() => setLanguageOpen((value) => !value)}
              aria-expanded={languageOpen}
              aria-label="Language"
            >
              <GlobeIcon />
              <span className="language-label">{currentLanguage.label}</span>
              <ChevronDownIcon />
            </button>

            {languageOpen ? (
              <div className="language-menu">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`language-option ${item.id === language ? 'active' : ''}`}
                    onClick={() => changeLanguage(item.id)}
                  >
                    <span>{item.label}</span>
                    {item.id === language ? <span>✓</span> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section className="maintenance-content">
          <img
            className="brand-logo"
            src="/assets/Icons/Shadow%20Logo.svg"
            alt="Shadow"
          />

          <h1
            className={`maintenance-title ${
              language === 'km' ? 'khmer' : language === 'en' ? 'english' : 'other'
            }`}
          >
            {tx.title}
          </h1>

          <p className="maintenance-description">{tx.description}</p>

          <div className="status-box">
            <span className="status-icon">
              <ToolFixIcon />
            </span>
            <span>{tx.status}</span>
          </div>

          <div className="contact-section">
            <p className="contact-title">{tx.help}</p>

            <div className="contact-grid">
              <a
                className="contact-card"
                href="https://web.facebook.com/AlphaCentauri12226/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-icon">
                  <FacebookIcon />
                </span>
                <span className="contact-copy">
                  <span className="contact-name">ប្រលោមលោកស្នេហា</span>
                  <span className="contact-type">Facebook</span>
                </span>
                <span className="contact-arrow">
                  <ChevronRightIcon />
                </span>
              </a>

              <a
                className="contact-card"
                href="https://t.me/Hei_xxing"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-icon">
                  <TelegramIcon />
                </span>
                <span className="contact-copy">
                  <span className="contact-name">បុត្រីពៅយមទូត</span>
                  <span className="contact-type">Telegram</span>
                </span>
                <span className="contact-arrow">
                  <ChevronRightIcon />
                </span>
              </a>
            </div>
          </div>

          <button
            className="retry-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            {tx.retry}
          </button>

          <p className="maintenance-footer">{tx.footer}</p>
        </section>
      </div>
    </main>
  )
}
