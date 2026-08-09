import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'

export default function ProtectedLayout() {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/" replace />

  return (
    <div className="hearts-bg min-h-screen flex">
      <Sidebar />
      <main className="flex-1 relative z-10 p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
