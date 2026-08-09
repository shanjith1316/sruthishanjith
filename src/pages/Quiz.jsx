import { useMemo, useState } from 'react'
import { quizQuestions } from '../data/quizQuestions.js'
import Proposal from '../components/Proposal.jsx'

export default function Quiz() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [input, setInput] = useState('')
  const [done, setDone] = useState(false)

  const q = quizQuestions[idx]
  const total = quizQuestions.length
  const progress = useMemo(() => ((idx) / total) * 100, [idx, total])

  const submitAnswer = (value) => {
    setAnswers((a) => ({ ...a, [q.id]: value }))
    setInput('')
    if (idx + 1 >= total) {
      setDone(true)
    } else {
      setIdx(idx + 1)
    }
  }

  if (done) return <Proposal answers={answers} />

  return (
    <div className="max-w-2xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="font-script text-5xl text-rose-600">A little quiz</h1>
        <p className="text-rose-400 mt-1">Just for you, my love.</p>
      </header>

      {/* progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-rose-400 mb-1">
          <span>Question {idx + 1} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div
        key={q.id}
        className="bg-white/90 backdrop-blur-md border border-rose-100 rounded-3xl shadow-xl p-8 animate-[fadeIn_0.4s_ease-out]"
      >
        <p className="font-serif text-2xl text-rose-700 mb-6 text-center">{q.question}</p>

        {q.type === 'image' && (
          <img
            src={q.imageUrl}
            alt="clue"
            className="w-full h-56 object-cover rounded-2xl mb-6 border border-rose-100"
          />
        )}

        {(q.type === 'mcq' || q.type === 'image') && (
          <div className="grid sm:grid-cols-2 gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => submitAnswer(opt)}
                className="px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-400 text-rose-700 font-medium transition text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === 'fill' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!input.trim()) return
              submitAnswer(input.trim())
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer…"
              className="flex-1 px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold shadow-lg shadow-rose-200 transition"
            >
              Next
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-rose-400 mt-6 italic">
        Answer honestly ❤️ (I already know 😉)
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none;} }
      `}</style>
    </div>
  )
}
