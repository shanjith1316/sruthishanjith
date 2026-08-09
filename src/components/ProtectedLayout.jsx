import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'

export default function ProtectedLayout() {
  const { isAuthed } = useAuth()
  const [open, setOpen] = useState(false)

  if (!isAuthed) return <Navigate to="/" replace />

  const close = () => setOpen(false)

  return (
    <div className="hearts-bg min-h-screen md:flex">
      {/* mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white/85 backdrop-blur-md border-b border-rose-100 px-4 py-3">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulseHeart">💗</span>
          <span className="font-script text-xl text-rose-600">Sruthi &amp; Shanjith</span>
        </div>
        <div className="w-10" />
      </header>

      {/* desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white/80 backdrop-blur-md border-r border-rose-100 min-h-screen">
        <Sidebar />
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-rose-900/30 backdrop-blur-sm"
            onClick={close}
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-2xl border-r border-rose-100 animate-[slideIn_0.25s_ease-out]">
            <button
              onClick={close}
              className="absolute top-3 right-3 p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <Sidebar onNavigate={close} />
          </aside>
        </div>
      )}

      <main className="flex-1 relative z-10 p-4 sm:p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>

      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%);} to { transform: none;} }
      `}</style>
    </div>
  )
}
