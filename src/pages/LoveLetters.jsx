import { useEffect, useState } from 'react'
import { supabase, LETTERS_TABLE } from '../lib/supabaseClient.js'

const HER = import.meta.env.VITE_HER_NAME || 'Sruthi'
const HIS = import.meta.env.VITE_HIS_NAME || 'Shanjith'
const NAMES = [HER, HIS]

const initialForm = { from_name: HER, to_name: HIS, title: '', body: '' }

export default function LoveLetters() {
  const [letters, setLetters] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(LETTERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setLetters(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const swapNames = (from) => ({
    from_name: from,
    to_name: NAMES.find((n) => n !== from) || HIS,
  })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.body.trim()) {
      setError('A letter needs at least a few words 💗')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: insErr } = await supabase.from(LETTERS_TABLE).insert({
        from_name: form.from_name,
        to_name: form.to_name,
        title: form.title.trim() || null,
        body: form.body.trim(),
      })
      if (insErr) throw insErr
      setForm({ ...initialForm, from_name: form.from_name, ...swapNames(form.from_name) })
      await load()
    } catch (err) {
      setError(err.message || 'Could not send this letter.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (letter) => {
    if (!confirm('Delete this letter forever?')) return
    const { error: delErr } = await supabase
      .from(LETTERS_TABLE)
      .delete()
      .eq('id', letter.id)
    if (delErr) return setError(delErr.message)
    await load()
  }

  const prettyDate = (d) => {
    try {
      return new Date(d).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return d
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="font-script text-4xl sm:text-5xl text-rose-600">Love Letters</h1>
        <p className="text-rose-400 mt-1 text-sm sm:text-base">
          Little notes just for us.
        </p>
      </header>

      <section className="bg-white/85 backdrop-blur-md border border-rose-100 rounded-3xl shadow-xl p-5 sm:p-8 mb-10">
        <h2 className="font-serif text-xl sm:text-2xl text-rose-600 mb-4">
          Write a letter
        </h2>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-rose-500 mb-1">From</label>
              <select
                value={form.from_name}
                onChange={(e) =>
                  setForm({ ...form, ...swapNames(e.target.value) })
                }
                className="w-full px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
              >
                {NAMES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-rose-500 mb-1">To</label>
              <input
                type="text"
                value={form.to_name}
                readOnly
                className="w-full px-4 py-2 rounded-xl border border-rose-200 bg-rose-100/60 text-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-rose-500 mb-1">Title (optional)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="A little something for you…"
              className="w-full px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-rose-500 mb-1">Letter</label>
            <textarea
              rows={6}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Pour your heart out here…"
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-rose-600 bg-rose-100 rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold shadow-lg shadow-rose-200 transition disabled:opacity-60"
            >
              {saving ? 'Sending…' : 'Seal & send 💌'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-xl sm:text-2xl text-rose-600 mb-4">
          Our letters
        </h2>

        {loading ? (
          <p className="text-rose-400">Opening the mailbox…</p>
        ) : letters.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-rose-200">
            <div className="text-4xl mb-2">💌</div>
            <p className="text-rose-500">No letters yet — write the first one above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {letters.map((l) => {
              const isOpen = expandedId === l.id
              return (
                <article
                  key={l.id}
                  className="bg-white/90 rounded-2xl border border-rose-100 shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : l.id)}
                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-rose-400">
                        From <span className="font-semibold text-rose-500">{l.from_name}</span> · to{' '}
                        <span className="font-semibold text-rose-500">{l.to_name}</span> · {prettyDate(l.created_at)}
                      </div>
                      {l.title && (
                        <h3 className="font-serif text-lg text-rose-600 mt-1 truncate">
                          {l.title}
                        </h3>
                      )}
                      {!isOpen && (
                        <p className="text-sm text-rose-800/70 mt-1 line-clamp-2">
                          {l.body}
                        </p>
                      )}
                    </div>
                    <span className="text-rose-400 text-xl">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="whitespace-pre-wrap leading-relaxed text-rose-900/85">
                        {l.body}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => remove(l)}
                          className="text-xs px-3 py-1.5 rounded-full bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
