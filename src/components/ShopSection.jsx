import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ShopSection() {
  const navigate = useNavigate()

  return (
    <section className="px-4 sm:px-5 lg:px-6">
      <button
        type="button"
        onClick={() => navigate('/shop')}
        className="w-full text-left"
      >
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[22px]">🛍️</span>
                <h2 className="text-[18px] font-extrabold tracking-tight text-neutral-900">
                  Shop
                </h2>
              </div>

              <p className="mt-2 text-[13px] font-medium leading-6 text-gray-500">
                Explore Shop and Shadow Mall
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
              <i className="fas fa-chevron-right text-[14px]" />
            </div>
          </div>
        </div>
      </button>
    </section>
  )
}
