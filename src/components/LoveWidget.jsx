import { useEffect, useMemo, useState } from 'react'

const TOGETHER_SINCE = import.meta.env.VITE_TOGETHER_SINCE || '2024-05-16'
const ANNIVERSARY = import.meta.env.VITE_ANNIVERSARY || '05-16' // MM-DD

function daysBetween(a, b) {
  const MS = 24 * 60 * 60 * 1000
  return Math.floor((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / MS)
}

function nextAnniversary(today) {
  const [m, d] = ANNIVERSARY.split('-').map(Number)
  const thisYear = new Date(today.getFullYear(), m - 1, d)
  if (thisYear >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    return thisYear
  }
  return new Date(today.getFullYear() + 1, m - 1, d)
}

export default function LoveWidget() {
  const [now, setNow] = useState(new Date())

  // refresh at midnight so the counter stays accurate
  useEffect(() => {
    const t = setTimeout(() => setNow(new Date()), 60 * 1000)
    return () => clearTimeout(t)
  }, [now])

  const { days, anniv, untilAnniv, isToday } = useMemo(() => {
    const start = new Date(TOGETHER_SINCE)
    const today = new Date()
    const days = Math.max(0, daysBetween(new Date(start), new Date(today)))
    const anniv = nextAnniversary(new Date(today))
    const untilAnniv = daysBetween(new Date(today), new Date(anniv))
    const isToday = untilAnniv === 0
    return { days, anniv, untilAnniv, isToday }
  }, [now])

  const anniveryLabel = anniv.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mb-8 grid sm:grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-rose-400 to-rose-500 text-white rounded-3xl shadow-xl shadow-rose-200 p-6 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-8xl opacity-20">💗</div>
        <p className="uppercase tracking-widest text-xs text-rose-100">Together for</p>
        <p className="mt-2 font-serif text-4xl sm:text-5xl font-bold">
          {days.toLocaleString()} <span className="text-2xl font-normal">days</span>
        </p>
        <p className="mt-1 text-sm text-rose-100">
          Since{' '}
          {new Date(TOGETHER_SINCE).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div
        className={`rounded-3xl shadow-xl p-6 relative overflow-hidden border ${
          isToday
            ? 'bg-white border-rose-300 ring-2 ring-rose-300 animate-pulseHeart'
            : 'bg-white/90 border-rose-100'
        }`}
      >
        <div className="absolute -right-6 -top-6 text-8xl opacity-10">🎉</div>
        <p className="uppercase tracking-widest text-xs text-rose-400">
          {isToday ? 'Today is our day!' : 'Next anniversary'}
        </p>
        {isToday ? (
          <>
            <p className="mt-2 font-script text-4xl sm:text-5xl text-rose-600">
              Happy Anniversary! 💗
            </p>
            <p className="mt-1 text-sm text-rose-500">{anniveryLabel}</p>
          </>
        ) : (
          <>
            <p className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-rose-600">
              {untilAnniv} <span className="text-2xl font-normal">days</span>
            </p>
            <p className="mt-1 text-sm text-rose-500">
              until {anniveryLabel}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
