// ============================================================
//  src/components/Footer.jsx
//  ✅ កែត្រង់ file នេះ — Footer ផ្លាស់ប្តូរគ្រប់ page ភ្លាម
// ============================================================
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',         icon: 'fa-heart',       label: 'For You'  },
  { to: '/fast',     icon: 'fa-circle-play', label: 'Fast'     },
  { to: '/discover', icon: 'fa-compass',     label: 'Discover' },
  { to: '/library',  icon: 'fa-book',        label: 'Library'  },
  { to: '/me',       icon: 'fa-face-smile',  label: 'Mine'     },
]

export default function Footer() {
  return (
    <footer style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.97)',
      borderTop: '1px solid #f1f5f9',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      zIndex: 99999,
      paddingTop: '10px',
      paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '32px', maxWidth: '480px', margin: '0 auto', padding: '0 8px',
      }}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              width: '52px', textDecoration: 'none', gap: '3px',
              color: isActive ? '#1d4ed8' : '#9ca3af',
            })}>
            <i className={`fa-solid ${item.icon}`} style={{ fontSize: '20px' }} />
            <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </footer>
  )
}
