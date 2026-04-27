import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPoem, getRandomPoem } from '../api'
import { useBookmarks } from '../hooks/useBookmarks'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'
import VerseDisplay from '../components/VerseDisplay'
import { Arabesque, CarpetBorder, GeometricTile } from '../components/PersianOrnament'
import PoemChat from '../components/PoemChat'

export default function PoemPage({ random }) {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toggle, isBookmarked } = useBookmarks()

  useEffect(() => {
    setLoading(true)
    const promise = random ? getRandomPoem() : getPoem(id)
    promise.then(d => {
      setData(d)
      if (random) {
        window.history.replaceState(null, '', `/poem/${d.poem.id}`)
      }
    }).finally(() => setLoading(false))
  }, [id, random])

  if (loading) return <Loading />
  if (!data) return <p className="text-center py-12 text-stone-400">شعر یافت نشد</p>

  const { poem, verses, poet, breadcrumb } = data
  const bookmarked = isBookmarked(poem.id)

  function handleBookmark() {
    toggle({
      id: poem.id,
      title: poem.title,
      poetName: poet.name,
      poetId: poet.id,
    })
  }

  function handleRandom() {
    setLoading(true)
    getRandomPoem().then(d => {
      setData(d)
      window.history.pushState(null, '', `/poem/${d.poem.id}`)
    }).finally(() => setLoading(false))
  }

  return (
    <div>
      <Breadcrumb items={breadcrumb} />

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {poem.title}
            </h1>
            <Link
              to={`/poet/${poet.id}`}
              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
            >
              {poet.name}
            </Link>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked
                  ? 'text-gold-500 hover:bg-gold-500/10'
                  : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={bookmarked ? 'حذف نشان' : 'نشان‌گذاری'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={handleRandom}
              className="p-2 rounded-lg text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="شعر تصادفی"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative bg-white dark:bg-stone-800/30 rounded-2xl border border-stone-200 dark:border-stone-700/50 overflow-hidden">
        <div className="absolute top-0 left-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none">
          <GeometricTile className="w-32 h-32 text-primary-700" />
        </div>
        <div className="absolute bottom-0 right-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none rotate-180">
          <GeometricTile className="w-32 h-32 text-primary-700" />
        </div>

        <div className="px-4 pt-4">
          <CarpetBorder className="w-full max-w-xs mx-auto text-gold-500/40 dark:text-gold-400/20" />
        </div>

        <div className="p-6 md:p-10 relative">
          <VerseDisplay verses={verses} />
        </div>

        <div className="px-4 pb-4">
          <Arabesque className="w-48 mx-auto text-gold-500/50 dark:text-gold-400/25" />
        </div>
      </div>

      <PoemChat key={poem.id} poemId={poem.id} />
    </div>
  )
}
