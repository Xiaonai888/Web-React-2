import React from 'react'

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.09 0 2.23.2 2.23.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56v1.9h2.77l-.44 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z"
      />
    </svg>
  )
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.73 3.27a1.58 1.58 0 0 0-1.64-.25L3.18 9.53c-1.17.45-1.16 1.1-.21 1.39l4.34 1.35 10.05-6.34c.48-.29.91-.13.55.19l-8.14 7.35-.31 4.3c.45 0 .65-.2.9-.44l2.08-2.02 4.32 3.19c.8.44 1.37.21 1.57-.74l2.84-13.39c.25-1.14-.43-1.1-.43-1.1Z"
      />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 18 6-6-6-6"
      />
    </svg>
  )
}

export default function MaintenancePage() {
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
          font-family: Inter, "Noto Sans Khmer", "Khmer OS Battambang", Arial, sans-serif;
        }

        .maintenance-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(124, 58, 237, 0.18), transparent 34%),
            radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.14), transparent 32%),
            linear-gradient(145deg, #f7f4ff 0%, #ffffff 52%, #fff5fb 100%);
          color: #201536;
        }

        .maintenance-card {
          width: min(100%, 620px);
          padding: 44px;
          border: 1px solid rgba(110, 72, 170, 0.14);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 24px 70px rgba(70, 40, 110, 0.16);
          text-align: center;
          backdrop-filter: blur(16px);
        }

        .brand-mark {
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          margin: 0 auto 18px;
          border-radius: 24px;
          background: linear-gradient(145deg, #7c3aed, #a855f7);
          color: #ffffff;
          font-size: 34px;
          font-weight: 800;
          box-shadow: 0 15px 32px rgba(124, 58, 237, 0.3);
        }

        .brand-name {
          margin: 0 0 22px;
          color: #7c3aed;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .maintenance-title {
          margin: 0;
          font-size: clamp(27px, 5vw, 40px);
          line-height: 1.35;
          letter-spacing: -0.4px;
        }

        .maintenance-description {
          max-width: 490px;
          margin: 16px auto 0;
          color: #756a84;
          font-size: 16px;
          line-height: 1.9;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-top: 22px;
          padding: 9px 15px;
          border-radius: 999px;
          background: #f2eaff;
          color: #7131c8;
          font-size: 13px;
          font-weight: 700;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #8b5cf6;
          box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.12);
        }

        .contact-box {
          margin-top: 30px;
          padding: 22px;
          border: 1px solid #eee7f7;
          border-radius: 22px;
          background: #fcfaff;
          text-align: left;
        }

        .contact-label {
          margin: 0 0 14px;
          color: #5f536e;
          font-size: 14px;
          line-height: 1.6;
          text-align: center;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 13px;
          width: 100%;
          padding: 13px 14px;
          border-radius: 15px;
          color: #2b2138;
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .contact-link + .contact-link {
          margin-top: 9px;
        }

        .contact-link:hover {
          transform: translateY(-2px);
          background: #ffffff;
          box-shadow: 0 9px 24px rgba(73, 46, 108, 0.1);
        }

        .contact-logo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 13px;
          color: #ffffff;
        }

        .contact-logo svg {
          width: 24px;
          height: 24px;
        }

        .facebook-logo {
          background: #1877f2;
        }

        .telegram-logo {
          background: #229ed9;
        }

        .contact-name {
          flex: 1;
          font-size: 15px;
          font-weight: 750;
        }

        .contact-arrow {
          width: 20px;
          height: 20px;
          color: #a097aa;
        }

        .retry-button {
          width: 100%;
          margin-top: 22px;
          padding: 14px 20px;
          border: 0;
          border-radius: 15px;
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          color: #ffffff;
          font: inherit;
          font-size: 15px;
          font-weight: 750;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(124, 58, 237, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 30px rgba(124, 58, 237, 0.32);
        }

        .maintenance-footer {
          margin: 18px 0 0;
          color: #aaa0b4;
          font-size: 12px;
        }

        @media (max-width: 560px) {
          .maintenance-page {
            padding: 14px;
          }

          .maintenance-card {
            padding: 32px 18px;
            border-radius: 24px;
          }

          .brand-mark {
            width: 66px;
            height: 66px;
            border-radius: 20px;
            font-size: 30px;
          }

          .maintenance-description {
            font-size: 14px;
          }

          .contact-box {
            padding: 14px;
          }
        }
      `}</style>

      <section className="maintenance-card">
        <div className="brand-mark">S</div>
        <p className="brand-name">SHADOW</p>

        <h1 className="maintenance-title">វេបសាយកំពុងស្ថិតក្រោមការថែទាំ</h1>

        <p className="maintenance-description">
          យើងកំពុងពិនិត្យ និងកែលម្អប្រព័ន្ធ ដើម្បីឱ្យការប្រើប្រាស់កាន់តែប្រសើរ។
          សូមអភ័យទោសចំពោះការរអាក់រអួល និងសូមព្យាយាមចូលម្តងទៀតនៅពេលបន្តិចទៀត។
        </p>

        <div className="status-pill">
          <span className="status-dot" />
          ក្រុមការងារកំពុងដោះស្រាយ
        </div>

        <div className="contact-box">
          <p className="contact-label">បើត្រូវការជំនួយ សូមទាក់ទងមកកាន់</p>

          <a
            className="contact-link"
            href="https://web.facebook.com/AlphaCentauri12226/"
            target="_blank"
            rel="noreferrer"
            aria-label="ទាក់ទងតាម Facebook ប្រលោមលោកស្នេហា"
          >
            <span className="contact-logo facebook-logo">
              <FacebookLogo />
            </span>
            <span className="contact-name">ប្រលោមលោកស្នេហា</span>
            <span className="contact-arrow">
              <ArrowIcon />
            </span>
          </a>

          <a
            className="contact-link"
            href="https://t.me/Hei_xxing"
            target="_blank"
            rel="noreferrer"
            aria-label="ទាក់ទងតាម Telegram បុត្រីពៅយមទូត"
          >
            <span className="contact-logo telegram-logo">
              <TelegramLogo />
            </span>
            <span className="contact-name">បុត្រីពៅយមទូត</span>
            <span className="contact-arrow">
              <ArrowIcon />
            </span>
          </a>
        </div>

        <button
          className="retry-button"
          type="button"
          onClick={() => window.location.reload()}
        >
          ព្យាយាមចូលម្តងទៀត
        </button>

        <p className="maintenance-footer">សូមអរគុណសម្រាប់ការអត់ធ្មត់ និងការគាំទ្រ</p>
      </section>
    </main>
  )
}
