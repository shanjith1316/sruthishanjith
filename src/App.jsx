import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Events from './pages/Events.jsx'
import Quiz from './pages/Quiz.jsx'
import LoveLetters from './pages/LoveLetters.jsx'
import BucketList from './pages/BucketList.jsx'
import ProtectedLayout from './components/ProtectedLayout.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/events" element={<Events />} />
          <Route path="/letters" element={<LoveLetters />} />
          <Route path="/bucket" element={<BucketList />} />
          <Route path="/quiz" element={<Quiz />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
