import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ShopSection() {
  const navigate = useNavigate()

  return (
    <div
      className="group cursor-pointer text-center"
      onClick={() => navigate('/shop')}
    >
      <div className="w-12 h-12 bg-gray-50 rounded-full mb-1 mx-auto flex items-center justify-center group-hover:bg-blue-50 transition-all">
        <i className="fas fa-shopping-bag text-gray-500 group-hover:text-blue-600" />
      </div>
      <span className="text-[10px] text-gray-500 font-semibold">Shop</span>
    </div>
  )
}
