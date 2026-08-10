import { useEffect, useRef, useState } from 'react'
import { supabase, EVENTS_TABLE, EVENTS_BUCKET } from '../lib/supabaseClient.js'
import LoveWidget from '../components/LoveWidget.jsx'

const initialForm = { title: '', event_date: '', description: '', file: null }

export default function Events() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null) // null = create mode
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  const isEditing = editingId !== null

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const uploadImage = async (file) => {
    if (!file) return null
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    console.log('[Events] uploading to bucket', EVENTS_BUCKET, 'path', path, 'size', file.size)
    const { data: upData, error: upErr } = await supabase.storage
      .from(EVENTS_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })
    if (upErr) {
      console.error('[Events] upload failed', upErr)
      throw new Error(`Upload failed: ${upErr.message}`)
    }
    console.log('[Events] upload ok', upData)
    const { data } = supabase.storage.from(EVENTS_BUCKET).getPublicUrl(path)
    console.log('[Events] public url', data?.publicUrl)
    return data.publicUrl
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const startEdit = (ev) => {
    setEditingId(ev.id)
    setForm({
      title: ev.title || '',
      event_date: ev.event_date || '',
      description: ev.description || '',
      file: null, // only set if she picks a new one
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
    setError('')
    // scroll form into view so she sees what she's editing
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Give this memory a title ❤️')
      return
    }
    setSaving(true)
    setError('')
    try {
      let image_url // undefined = "don't touch"
      if (form.file) image_url = await uploadImage(form.file)

      if (isEditing) {
        const patch = {
          title: form.title.trim(),
          event_date: form.event_date || null,
          description: form.description.trim() || null,
        }
        if (image_url !== undefined) patch.image_url = image_url
        console.log('[Events] updating row', editingId, patch)
        const { data: upRows, error: upErr } = await supabase
          .from(EVENTS_TABLE)
          .update(patch)
          .eq('id', editingId)
          .select()
        if (upErr) throw upErr
        console.log('[Events] update returned rows:', upRows)
        if (!upRows || upRows.length === 0) {
          throw new Error(
            'Update returned 0 rows. Your RLS update policy is missing. Run the "events update all" SQL policy in Supabase.'
          )
        }
      } else {
        const insertRow = {
          title: form.title.trim(),
          event_date: form.event_date || null,
          description: form.description.trim() || null,
          image_url: image_url ?? null,
        }
        console.log('[Events] inserting row', insertRow)
        const { data: insRows, error: insErr } = await supabase
          .from(EVENTS_TABLE)
          .insert(insertRow)
          .select()
        if (insErr) throw insErr
        console.log('[Events] insert returned rows:', insRows)
      }

      resetForm()
      await load()
    } catch (err) {
      setError(err.message || 'Could not save the memory.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (ev) => {
    if (!confirm(`Delete "${ev.title}"? This can't be undone.`)) return
    const { error: delErr } = await supabase
      .from(EVENTS_TABLE)
      .delete()
      .eq('id', ev.id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    if (editingId === ev.id) resetForm()
    await load()
  }

  const prettyDate = (d) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return d
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-6 sm:mb-8">
        <h1 className="font-script text-4xl sm:text-5xl text-rose-600">Our Events</h1>
        <p className="text-rose-400 mt-1 text-sm sm:text-base">Every little moment, kept forever.</p>
      </header>

      <LoveWidget />

      <section
        ref={formRef}
        className="bg-white/85 backdrop-blur-md border border-rose-100 rounded-3xl shadow-xl p-6 md:p-8 mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-rose-600">
            {isEditing ? 'Edit memory' : 'Add a memory'}
          </h2>
          {isEditing && (
            <span className="text-xs px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-medium">
              Editing
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm text-rose-500 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Our first coffee together"
              className="w-full px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm text-rose-500 mb-1">Date</label>
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-rose-500 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What made this moment special?"
              className="w-full px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none resize-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-rose-500 mb-1">
              Photo {isEditing && <span className="text-xs text-rose-400">(leave empty to keep the current one)</span>}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
              className="block w-full text-sm text-rose-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-600 hover:file:bg-rose-200"
            />
            {form.file && (
              <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-rose-50 border border-rose-200">
                <img
                  src={URL.createObjectURL(form.file)}
                  alt="preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="text-sm text-rose-600">
                  <div className="font-medium truncate max-w-[240px]">{form.file.name}</div>
                  <div className="text-xs text-rose-400">
                    {Math.round(form.file.size / 1024)} KB — ready to upload
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="md:col-span-2 text-sm text-rose-600 bg-rose-100 rounded-lg py-2 px-3">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-full bg-white border-2 border-rose-300 text-rose-500 font-semibold hover:bg-rose-50 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold shadow-lg shadow-rose-200 transition disabled:opacity-60"
            >
              {saving
                ? 'Saving…'
                : isEditing
                ? 'Update memory 💗'
                : 'Save memory 💗'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-rose-600 mb-4">Our memories</h2>

        {loading ? (
          <p className="text-rose-400">Loading our story…</p>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-rose-200">
            <div className="text-4xl mb-2">🌸</div>
            <p className="text-rose-500">No memories yet — add your first one above.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <article
                key={ev.id}
                className={`bg-white/90 rounded-2xl overflow-hidden shadow-lg border transition hover:-translate-y-1 hover:shadow-xl ${
                  editingId === ev.id ? 'border-rose-400 ring-2 ring-rose-200' : 'border-rose-100'
                }`}
              >
                {ev.image_url ? (
                  <img
                    src={ev.image_url}
                    alt={ev.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-5xl">
                    💗
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-serif text-xl text-rose-600">{ev.title}</h3>
                  {ev.event_date && (
                    <p className="text-xs text-rose-400 mt-1">
                      {prettyDate(ev.event_date)}
                    </p>
                  )}
                  {ev.description && (
                    <p className="text-sm text-rose-800/80 mt-3 leading-relaxed">
                      {ev.description}
                    </p>
                  )}

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(ev)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-rose-100 text-rose-600 hover:bg-rose-200 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ev)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
