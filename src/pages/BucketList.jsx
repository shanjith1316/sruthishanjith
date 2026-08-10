import { useEffect, useMemo, useState } from 'react'
import { supabase, BUCKET_TABLE } from '../lib/supabaseClient.js'

export default function BucketList() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all | todo | done

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(BUCKET_TABLE)
      .select('*')
      .order('done', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Give it a title 💗')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: insErr } = await supabase.from(BUCKET_TABLE).insert({
        title: form.title.trim(),
        notes: form.notes.trim() || null,
      })
      if (insErr) throw insErr
      setForm({ title: '', notes: '' })
      await load()
    } catch (err) {
      setError(err.message || 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (item) => {
    const patch = item.done
      ? { done: false, done_at: null }
      : { done: true, done_at: new Date().toISOString() }
    // optimistic
    setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, ...patch } : x)))
    const { error: upErr } = await supabase
      .from(BUCKET_TABLE)
      .update(patch)
      .eq('id', item.id)
    if (upErr) {
      setError(upErr.message)
      await load()
    }
  }

  const remove = async (item) => {
    if (!confirm(`Remove "${item.title}" from the list?`)) return
    const { error: delErr } = await supabase
      .from(BUCKET_TABLE)
      .delete()
      .eq('id', item.id)
    if (delErr) return setError(delErr.message)
    await load()
  }

  const { visible, doneCount } = useMemo(() => {
    const doneCount = items.filter((i) => i.done).length
    const visible =
      filter === 'todo'
        ? items.filter((i) => !i.done)
        : filter === 'done'
        ? items.filter((i) => i.done)
        : items
    return { visible, doneCount }
  }, [items, filter])

  const total = items.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="font-script text-4xl sm:text-5xl text-rose-600">Our Bucket List</h1>
        <p className="text-rose-400 mt-1 text-sm sm:text-base">
          Places to go, things to do — together.
        </p>
      </header>

      {/* progress */}
      {total > 0 && (
        <div className="mb-6 bg-white/85 rounded-2xl p-4 border border-rose-100 shadow-md">
          <div className="flex justify-between text-sm text-rose-500 mb-2">
            <span>{doneCount} of {total} done</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* add form */}
      <form
        onSubmit={add}
        className="bg-white/85 backdrop-blur-md border border-rose-100 rounded-3xl shadow-xl p-5 sm:p-6 mb-6 grid gap-3"
      >
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Watch the sunset in Kanyakumari"
            className="sm:col-span-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold shadow-lg shadow-rose-200 transition disabled:opacity-60"
          >
            {saving ? 'Adding…' : 'Add ✨'}
          </button>
        </div>
        <input
          type="text"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Notes (optional)"
          className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
        />
        {error && (
          <div className="text-sm text-rose-600 bg-rose-100 rounded-lg py-2 px-3">
            {error}
          </div>
        )}
      </form>

      {/* filter */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          { k: 'all', label: 'All' },
          { k: 'todo', label: 'To do' },
          { k: 'done', label: 'Done' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              filter === t.k
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-white border border-rose-200 text-rose-500 hover:bg-rose-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* list */}
      {loading ? (
        <p className="text-rose-400 text-center">Loading our dreams…</p>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-rose-200">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-rose-500">Nothing here yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li
              key={item.id}
              className={`bg-white/90 rounded-2xl border shadow-md p-4 flex items-start gap-3 transition ${
                item.done ? 'border-rose-200 opacity-70' : 'border-rose-100 hover:shadow-lg'
              }`}
            >
              <button
                onClick={() => toggle(item)}
                aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                  item.done
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'border-rose-300 hover:border-rose-500'
                }`}
              >
                {item.done && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium ${
                    item.done ? 'line-through text-rose-400' : 'text-rose-700'
                  }`}
                >
                  {item.title}
                </div>
                {item.notes && (
                  <div className="text-sm text-rose-500 mt-0.5">{item.notes}</div>
                )}
                {item.done && item.done_at && (
                  <div className="text-xs text-rose-400 mt-1">
                    ✓ Done {new Date(item.done_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              <button
                onClick={() => remove(item)}
                className="text-rose-400 hover:text-rose-600 text-sm px-2"
                aria-label="Delete"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
