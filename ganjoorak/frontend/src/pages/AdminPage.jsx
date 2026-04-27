import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPoets, getPoem, createPoet, createPoem, updatePoem } from '../api'
import { useToast } from '../components/Toast'

export default function AdminPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const [poets, setPoets] = useState([])
  const [tab, setTab] = useState('poem')
  const preselectedPoetId = searchParams.get('poetId') || ''
  const editPoemId = searchParams.get('edit') || ''

  useEffect(() => {
    getPoets().then(setPoets)
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
        {editPoemId ? 'ویرایش شعر' : 'مدیریت'}
      </h1>

      {!editPoemId && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('poem')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'poem'
                ? 'bg-primary-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            افزودن شعر
          </button>
          <button
            onClick={() => setTab('poet')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'poet'
                ? 'bg-primary-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            افزودن شاعر
          </button>
        </div>
      )}

      {!editPoemId && tab === 'poet' && (
        <PoetForm onCreated={poet => {
          setPoets(prev => [...prev, poet])
          toast('شاعر با موفقیت ذخیره شد')
          setTab('poem')
        }} onError={msg => toast(msg, 'error')} />
      )}
      {(editPoemId || tab === 'poem') && (
        <PoemForm
          poets={poets}
          defaultPoetId={preselectedPoetId}
          editPoemId={editPoemId}
          onCreated={id => {
            toast(editPoemId ? 'شعر با موفقیت بروزرسانی شد' : 'شعر با موفقیت ذخیره شد')
            navigate(`/poem/${id}`)
          }}
          onError={msg => toast(msg, 'error')}
        />
      )}
    </div>
  )
}

function PoetForm({ onCreated, onError }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      const result = await createPoet(name.trim(), description.trim())
      onCreated({ id: result.id, name: name.trim(), catId: result.catId })
      setName('')
      setDescription('')
    } catch {
      onError('خطا در ذخیره شاعر')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-stone-800/30 rounded-2xl border border-stone-200 dark:border-stone-700/50 p-6">
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">نام شاعر</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">توضیحات</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={saving || !name.trim()}
        className="px-6 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'در حال ذخیره...' : 'ذخیره شاعر'}
      </button>
    </form>
  )
}

function parseCouplets(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const couplets = []
  for (let i = 0; i < lines.length; i += 2) {
    couplets.push({
      first: lines[i],
      second: i + 1 < lines.length ? lines[i + 1] : '',
    })
  }
  return couplets
}

function versesToText(verses) {
  const lines = []
  const sorted = [...verses].sort((a, b) => a.vorder - b.vorder || a.position - b.position)
  for (const v of sorted) {
    lines.push(v.text)
  }
  return lines.join('\n')
}

function PoemForm({ poets, defaultPoetId, editPoemId, onCreated, onError }) {
  const [poetId, setPoetId] = useState(defaultPoetId)
  const [title, setTitle] = useState('')
  const [versesText, setVersesText] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(!!editPoemId)

  useEffect(() => {
    if (!editPoemId) return
    getPoem(editPoemId).then(data => {
      setTitle(data.poem.title)
      setPoetId(String(data.poet.id))
      setVersesText(versesToText(data.verses))
      setLoadingEdit(false)
    })
  }, [editPoemId])

  const couplets = parseCouplets(versesText)
  const lineCount = versesText.split('\n').filter(l => l.trim()).length
  const isValid = poetId && title.trim() && lineCount >= 2 && lineCount % 2 === 0

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    setSaving(true)
    try {
      if (editPoemId) {
        await updatePoem(Number(editPoemId), Number(poetId), title.trim(), couplets)
        onCreated(Number(editPoemId))
      } else {
        const result = await createPoem(Number(poetId), title.trim(), couplets)
        onCreated(result.id)
      }
    } catch {
      onError('خطا در ذخیره شعر')
    } finally {
      setSaving(false)
    }
  }

  if (loadingEdit) {
    return <p className="text-center text-stone-400 py-8">در حال بارگذاری...</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-stone-800/30 rounded-2xl border border-stone-200 dark:border-stone-700/50 p-6">
      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">شاعر</label>
        <select
          value={poetId}
          onChange={e => setPoetId(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
          disabled={!!editPoemId}
        >
          <option value="">انتخاب کنید...</option>
          {poets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">عنوان شعر</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">مصرع‌ها</label>
          <span className="text-xs text-stone-400">
            {lineCount > 0 && `${lineCount} مصرع (${Math.floor(lineCount / 2)} بیت)`}
            {lineCount > 0 && lineCount % 2 !== 0 && ' — تعداد مصرع‌ها باید زوج باشد'}
          </span>
        </div>
        <textarea
          value={versesText}
          onChange={e => setVersesText(e.target.value)}
          rows={12}
          placeholder={'مصرع اول\nمصرع دوم\nمصرع سوم\nمصرع چهارم\n...'}
          className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm leading-8 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving || !isValid}
        className="px-6 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'در حال ذخیره...' : editPoemId ? 'بروزرسانی شعر' : 'ذخیره شعر'}
      </button>
    </form>
  )
}
