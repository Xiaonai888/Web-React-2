import { useNavigate } from 'react-router-dom'
import { getDisplayLanguageId, getDisplayText, useDisplayTranslation } from '../../utils/displayLanguage'
import { registerTranslationNamespace } from '../../i18n/registerTranslations'

registerTranslationNamespace('authorPageFinance', {
  "en": {
    "back": "Back",
    "finance": "Finance",
    "income": "Income",
    "incomeHelp": "View your Author Page income and balance.",
    "withdrawal": "Withdrawal",
    "withdrawalHelp": "Request payout from your available balance."
  },
  "km": {
    "back": "ត្រឡប់ក្រោយ",
    "finance": "ហិរញ្ញវត្ថុ",
    "income": "ចំណូល",
    "incomeHelp": "មើលចំណូល និងសមតុល្យរបស់ទំព័រអ្នកនិពន្ធ។",
    "withdrawal": "ការដកប្រាក់",
    "withdrawalHelp": "ស្នើសុំដកប្រាក់ពីសមតុល្យដែលអាចប្រើបាន។"
  },
  "zh": {
    "back": "返回",
    "finance": "财务",
    "income": "收入",
    "incomeHelp": "查看作者主页的收入和余额。",
    "withdrawal": "提现",
    "withdrawalHelp": "从可用余额申请提现。"
  },
  "ja": {
    "back": "戻る",
    "finance": "収益管理",
    "income": "収入",
    "incomeHelp": "著者ページの収入と残高を確認します。",
    "withdrawal": "出金",
    "withdrawalHelp": "利用可能残高から出金を申請します。"
  },
  "ko": {
    "back": "뒤로",
    "finance": "재정",
    "income": "수입",
    "incomeHelp": "작가 페이지 수입과 잔액을 확인하세요.",
    "withdrawal": "출금",
    "withdrawalHelp": "사용 가능한 잔액에서 출금을 요청하세요."
  }
})


function MenuRow({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left active:bg-[var(--shadow-bg-soft)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--shadow-text-primary)]">
        <i className={`fa-solid ${icon} text-[17px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[var(--shadow-text-primary)]">
          {title}
        </span>
        {text ? (
          <span className="mt-0.5 block text-[12px] font-normal leading-5 text-[var(--shadow-text-tertiary)]">
            {text}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function AuthorPageFinancePage() {
  const navigate = useNavigate()
  const { t } = useDisplayTranslation()

  return (
    <div className="min-h-screen bg-[var(--shadow-bg-page)] pb-10">
      <header className="sticky top-0 z-40 border-b border-[var(--shadow-border)] bg-[var(--shadow-bg-surface)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => {
  sessionStorage.setItem('shadow_open_author_menu', '1')
  navigate('/author/page')
}}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--shadow-text-primary)] active:bg-[var(--shadow-bg-soft)]"
            aria-label={t('authorPageFinance.back')}
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-normal text-[var(--shadow-text-primary)]">
            {t('authorPageFinance.finance')}
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 py-4">
        <section className="rounded-[24px] bg-[var(--shadow-bg-surface)] p-3 shadow-sm ring-1 ring-[var(--shadow-border)]">
          <MenuRow
            icon="fa-chart-line"
            title={t('authorPageFinance.income')}
            text={t('authorPageFinance.incomeHelp')}
            onClick={() => navigate('/author/page/finance/income')}
          />

          <div className="mx-3 border-t border-[var(--shadow-border)]" />

          <MenuRow
            icon="fa-money-bill-transfer"
            title={t('authorPageFinance.withdrawal')}
            text={t('authorPageFinance.withdrawalHelp')}
            onClick={() => navigate('/author/page/finance/withdrawal')}
          />
        </section>
      </main>
    </div>
  )
}
