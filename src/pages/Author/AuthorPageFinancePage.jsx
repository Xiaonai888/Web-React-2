import { useNavigate } from 'react-router-dom'

function MenuRow({ icon, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left active:bg-[#f3f4f6]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#111827]">
        <i className={`fa-solid ${icon} text-[17px]`} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-normal text-[#111827]">
          {title}
        </span>
        {text ? (
          <span className="mt-0.5 block text-[12px] font-normal leading-5 text-[#8b93a1]">
            {text}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default function AuthorPageFinancePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-10">
      <header className="sticky top-0 z-40 border-b border-[#eef0f4] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <button
            type="button"
            onClick={() => navigate('/author/page?openMenu=author')}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#111827] active:bg-[#f3f4f6]"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[15px]" />
          </button>

          <div className="text-[16px] font-normal text-[#111827]">
            Finance
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 py-4">
        <section className="rounded-[24px] bg-white p-3 shadow-sm ring-1 ring-black/5">
          <MenuRow
            icon="fa-chart-line"
            title="Income"
            text="View your Author Page income and balance."
            onClick={() => navigate('/author/page/finance/income')}
          />

          <div className="mx-3 border-t border-[#f0eef6]" />

          <MenuRow
            icon="fa-money-bill-transfer"
            title="Withdrawal"
            text="Request payout from your available balance."
            onClick={() => navigate('/author/page/finance/withdrawal')}
          />
        </section>
      </main>
    </div>
  )
}
