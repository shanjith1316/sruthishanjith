import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'ss_auth_v1'

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(sessionStorage.getItem(STORAGE_KEY) === '1')
  }, [])

  const login = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setIsAuthed(true)
  }
  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setIsAuthed(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
