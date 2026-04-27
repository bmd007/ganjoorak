import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { search } from '../api'
import Loading from '../components/Loading'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    search(q).then(setData).finally(() => setLoading(false))
  }, [q])

  if (!q) {
    return (
      <div className="text-center py-20 text-stone-400 dark:text-stone-500">
        عبارتی برای جستجو وارد کنید
      </div>
    )
  }

  if (loading) return <Loading />

  const poems = data?.poems || []
  const verses = data?.verses || []
  const hasResults = poems.length > 0 || verses.length > 0

  return (
    <div>
      <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6">
        نتایج جستجو برای «{q}»
      </h1>

      {!hasResults && (
        <p className="text-center text-stone-400 dark:text-stone-500 py-12">
          نتیجه‌ای یافت نشد
        </p>
      )}

      {poems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">
            عناوین ({poems.length})
          </h2>
          <div className="space-y-1">
            {poems.map(p => (
              <Link
                key={p.id}
                to={`/poem/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white dark:hover:bg-stone-800/40 transition-colors group"
              >
                <span className="text-stone-700 dark:text-stone-300 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {p.title}
                </span>
                <span className="text-xs text-stone-400 dark:text-stone-500 shrink-0">
                  {p.poetName}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {verses.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">
            ابیات ({verses.length})
          </h2>
          <div className="space-y-2">
            {verses.map((v, i) => (
              <Link
                key={`${v.poemId}-${i}`}
                to={`/poem/${v.poemId}`}
                className="block p-4 rounded-xl bg-white dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/50 hover:border-primary-400 dark:hover:border-primary-500 transition-all group"
              >
                <p className="text-stone-800 dark:text-stone-200 verse-text text-base leading-8 mb-2">
                  {v.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-400 dark:text-stone-500">
                  <span>{v.poetName}</span>
                  <span>—</span>
                  <span>{v.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
