import { useState } from 'react'
import { addNote, updateNote, deleteNote } from '../api'
import { useToast } from './Toast'

export default function PoemNotes({ poemId, initialNotes }) {
  const [notes, setNotes] = useState(initialNotes || [])
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const toast = useToast()

  async function handleAdd(e) {
    e.preventDefault()
    if (!input.trim() || saving) return
    setSaving(true)
    try {
      const result = await addNote(poemId, input.trim())
      setNotes(prev => [{ id: result.id, poemId, text: input.trim(), createdAt: new Date().toISOString() }, ...prev])
      setInput('')
      toast('یادداشت ذخیره شد')
    } catch {
      toast('خطا در ذخیره یادداشت', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(noteId) {
    if (!editText.trim()) return
    try {
      await updateNote(poemId, noteId, editText.trim())
      setNotes(prev => prev.map(n => n.id === noteId ? { ...n, text: editText.trim() } : n))
      setEditingId(null)
      toast('یادداشت بروزرسانی شد')
    } catch {
      toast('خطا در بروزرسانی یادداشت', 'error')
    }
  }

  async function handleDelete(noteId) {
    try {
      await deleteNote(poemId, noteId)
      setNotes(prev => prev.filter(n => n.id !== noteId))
      toast('یادداشت حذف شد')
    } catch {
      toast('خطا در حذف یادداشت', 'error')
    }
  }

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-stone-700 dark:text-stone-300 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        یادداشت‌ها
      </h3>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="یادداشت جدید..."
          disabled={saving}
          className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200
                     dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500
                     placeholder:text-stone-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={saving || !input.trim()}
          className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium
                     hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          افزودن
        </button>
      </form>

      {notes.length > 0 && (
        <div className="space-y-2">
          {notes.map(note => (
            <div key={note.id} className="group flex items-start gap-2 p-3 rounded-xl bg-white dark:bg-stone-800/30 border border-stone-200 dark:border-stone-700/50">
              {editingId === note.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleUpdate(note.id); if (e.key === 'Escape') setEditingId(null) }}
                    autoFocus
                    className="flex-1 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200
                               dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button onClick={() => handleUpdate(note.id)} className="text-primary-600 dark:text-primary-400 text-xs font-medium">ذخیره</button>
                  <button onClick={() => setEditingId(null)} className="text-stone-400 text-xs">انصراف</button>
                </div>
              ) : (
                <>
                  <p className="flex-1 text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => { setEditingId(note.id); setEditText(note.text) }}
                      className="p-1 rounded text-stone-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      title="ویرایش"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 rounded text-stone-400 hover:text-red-500 transition-colors"
                      title="حذف"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
