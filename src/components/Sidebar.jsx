import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const linkBase =
  'flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium'
const linkIdle = 'text-rose-500 hover:bg-rose-100'
const linkActive = 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-md shadow-rose-200'

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 bg-white/80 backdrop-blur-md border-r border-rose-100 min-h-screen p-6 flex flex-col">
      <div className="text-center mb-8">
        <div className="text-3xl animate-pulseHeart">💗</div>
        <h2 className="font-script text-2xl text-rose-600 mt-1">
          Sruthi &amp; Shanjith
        </h2>
        <p className="text-xs text-rose-400">forever &amp; always</p>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink
          to="/events"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          <span className="text-lg">📸</span>
          Our Events
        </NavLink>
        <NavLink
          to="/quiz"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          <span className="text-lg">💝</span>
          Quiz
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 text-sm text-rose-400 hover:text-rose-600 transition"
      >
        Log out
      </button>
    </aside>
  )
}
