import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const CORRECT_PIN = import.meta.env.VITE_APP_PIN || '1316'

export default function Login() {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const inputsRef = useRef([])
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (i, v) => {
    const val = v.replace(/\D/g, '').slice(0, 1)
    const next = [...digits]
    next[i] = val
    setDigits(next)
    setError('')
    if (val && i < 3) inputsRef.current[i + 1]?.focus()
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
    if (e.key === 'Enter') submit()
  }

  const submit = (e) => {
    e?.preventDefault?.()
    const pin = digits.join('')
    if (pin.length < 4) {
      setError('Please enter all 4 digits, my love.')
      return
    }
    if (pin === CORRECT_PIN) {
      login()
      navigate('/events')
    } else {
      setError('Hmm, that\'s not it. Try again ❤️')
      setDigits(['', '', '', ''])
      inputsRef.current[0]?.focus()
    }
  }

  return (
    <div className="hearts-bg min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-300/40 rounded-full blur-3xl" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-rose-100 p-10 text-center"
      >
        <div className="text-5xl mb-2 animate-pulseHeart">💗</div>
        <h1 className="font-script text-4xl md:text-5xl text-rose-600 leading-tight">
          Welcome Sruthi <span className="mx-1">❤️</span> Shanjith
        </h1>
        <p className="mt-3 text-rose-400 text-sm">Enter our little secret to come inside.</p>

        <div className="mt-8 flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="w-14 h-16 text-center text-2xl font-semibold rounded-xl border-2 border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
              aria-label={`PIN digit ${i + 1}`}
            />
          ))}
        </div>

        <p className="mt-3 text-xs text-rose-400 italic">Hint: You Know the pin.</p>

        {error && (
          <p className="mt-4 text-sm text-rose-600 bg-rose-100 rounded-lg py-2 px-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-8 w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold shadow-lg shadow-rose-200 transition transform hover:-translate-y-0.5"
        >
          Login
        </button>
      </form>
    </div>
  )
}
