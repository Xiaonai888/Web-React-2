import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: 'fa-solid fa-house' },
  { key: 'reel', label: 'Reel', icon: 'fa-solid fa-clapperboard' },
  { key: 'chat', label: 'Chat', icon: 'fa-regular fa-comment-dots' },
  { key: 'library', label: 'Library', icon: 'fa-solid fa-book-open' },
  { key: 'me', label: 'Me', icon: 'fa-regular fa-user' },
]

export default function ReaderProfileFooter() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')

  const showMessage = (text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 1800)
  }

  const handleClick = (key) => {
    if (key === 'library') {
      navigate('/library')
      return
    }

    if (key === 'me') {
      navigate('/profile')
      return
    }

    if (key === 'chat') {
      showMessage('Chat is being built.')
      return
    }

    showMessage(`${key === 'home' ? 'Home' : 'Reel'} is coming soon.`)
  }

  return (
    <>
      {message ? (
        <div className="fixed bottom-[82px] left-1/2 z-[100001] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-2 text-[12px] font-semibold text-white shadow-lg">
          {message}
        </div>
      ) : null}

      <footer
        className="fixed bottom-0 left-0 right-0 z-[100000] border-t border-[#ececf1] bg-white/95 backdrop-blur-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav className="mx-auto flex h-[64px] w-full max-w-[560px] items-center justify-around px-3">
          {NAV_ITEMS.map((item) => {
            const active = item.key === 'me'

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleClick(item.key)}
                aria-label={item.label}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className="flex h-12 w-12 items-center justify-center rounded-full text-[#111827] transition active:scale-90"
              >
                <i
                  className={`${active ? 'fa-solid fa-user' : item.icon} text-[23px]`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </nav>
      </footer>
    </>
  )
}
