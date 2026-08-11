import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GamePage() {
  const navigate = useNavigate()
  const [comingSoonOpen, setComingSoonOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafafa] pb-10 dark:bg-[#0d0f16]">
      <header className="sticky top-0 z-20 border-b border-[#eeeeee] bg-white dark:border-white/10 dark:bg-[#171923]">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827] active:scale-95 dark:text-white"
            aria-label="Back"
          >
            <i className="fa-solid fa-chevron-left text-[14px]" />
          </button>
          <h1 className="ml-2 text-[18px] font-semibold text-[#111827] dark:text-white">
            Game
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          <button
            type="button"
            onClick={() => setComingSoonOpen(true)}
            className="aspect-square overflow-hidden rounded-[16px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.98] dark:bg-[#171923] dark:ring-white/10"
          >
            <div className="flex h-full flex-col items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3fa] text-[#111827] dark:bg-white/10 dark:text-white">
                <i className="fa-solid fa-dharmachakra text-[20px]" />
              </div>
              <div className="mt-3 text-center text-[14px] font-semibold text-[#111827] dark:text-white">
                Spin
              </div>
            </div>
          </button>
        </div>
      </main>

      {comingSoonOpen ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setComingSoonOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative z-10 w-full max-w-[320px] rounded-[20px] bg-white p-6 text-center shadow-xl dark:bg-[#171923]">
            <div className="text-[17px] font-semibold text-[#111827] dark:text-white">
              Coming soon
            </div>
            <button
              type="button"
              onClick={() => setComingSoonOpen(false)}
              className="mt-5 h-10 w-full rounded-full bg-[#111827] text-[13px] font-semibold text-white active:scale-[0.98] dark:bg-white dark:text-[#111827]"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
