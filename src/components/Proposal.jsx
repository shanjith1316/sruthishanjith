import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

export default function Proposal() {
  const [saidYes, setSaidYes] = useState(false)
  const [noPos, setNoPos] = useState(null) // {top, left} in px, viewport
  const [dodgeCount, setDodgeCount] = useState(0)
  const noBtnRef = useRef(null)

  // messages that get sassier as she keeps hovering "No"
  const noMessages = [
    'No',
    'Really?',
    'Think again 💕',
    'Are you sure?',
    'Try again 😉',
    'Impossible.',
    'Not a chance ❤️',
  ]

  const moveNo = () => {
    const btn = noBtnRef.current
    const w = btn?.offsetWidth || 90
    const h = btn?.offsetHeight || 44
    const pad = 16
    const maxLeft = Math.max(pad, window.innerWidth - w - pad)
    const maxTop = Math.max(pad + 60, window.innerHeight - h - pad)
    const left = Math.floor(Math.random() * (maxLeft - pad)) + pad
    const top = Math.floor(Math.random() * (maxTop - (pad + 60))) + (pad + 60)
    setNoPos({ top, left })
    setDodgeCount((c) => c + 1)
  }

  const handleYes = () => {
    setSaidYes(true)
    const burst = () => {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff4785', '#ffa0c1', '#ffe4ec', '#ffffff'],
      })
    }
    burst()
    setTimeout(burst, 400)
    setTimeout(burst, 900)
    setTimeout(() => {
      confetti({
        particleCount: 200,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4785', '#ffa0c1'],
      })
      confetti({
        particleCount: 200,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4785', '#ffa0c1'],
      })
    }, 1200)
  }

  // if window resizes, keep the No button in view
  useEffect(() => {
    const onResize = () => noPos && moveNo()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noPos])

  if (saidYes) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <div className="text-7xl animate-pulseHeart mb-4">💍</div>
        <h1 className="font-script text-6xl md:text-7xl text-rose-600 leading-tight">
          She said <span className="italic">yes!</span>
        </h1>
        <p className="mt-4 text-rose-500 max-w-lg text-lg">
          Forever starts today, Sruthi. I love you more than every star, every song, every silly little moment we&apos;ve ever shared. 💗
        </p>
        <div className="mt-8 flex gap-2 text-3xl animate-floaty">
          <span>💕</span><span>💗</span><span>💖</span><span>💘</span><span>💝</span>
        </div>
      </div>
    )
  }

  const noLabel = noMessages[Math.min(dodgeCount, noMessages.length - 1)]

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative">
      <div className="text-7xl animate-pulseHeart mb-4">💗</div>
      <h1 className="font-script text-6xl md:text-7xl text-rose-600 leading-tight">
        Will you marry me?
      </h1>
      <p className="mt-4 text-rose-500 max-w-md">
        Take your time&hellip; but please pick the right one. 😉
      </p>

      <div className="mt-10 flex items-center gap-6 relative">
        <button
          onClick={handleYes}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-lg font-bold shadow-xl shadow-rose-300 transition transform hover:-translate-y-1 hover:scale-105"
        >
          Yes 💗
        </button>

        <button
          ref={noBtnRef}
          onMouseEnter={moveNo}
          onFocus={moveNo}
          onTouchStart={(e) => { e.preventDefault(); moveNo() }}
          style={
            noPos
              ? { position: 'fixed', top: noPos.top, left: noPos.left, zIndex: 40 }
              : undefined
          }
          className="px-6 py-3 rounded-full bg-white border-2 border-rose-300 text-rose-500 font-semibold transition"
        >
          {noLabel}
        </button>
      </div>

      {dodgeCount > 2 && (
        <p className="mt-8 text-sm text-rose-400 italic">
          (There&apos;s really only one right answer&hellip;)
        </p>
      )}
    </div>
  )
}
