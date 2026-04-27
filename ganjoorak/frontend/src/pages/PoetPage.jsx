import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPoet } from '../api'
import Loading from '../components/Loading'

export default function PoetPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFullBio, setShowFullBio] = useState(false)

  useEffect(() => {
    setLoading(true)
    getPoet(id).then(setData).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (!data) return <p className="text-center py-12 text-stone-400">شاعر یافت نشد</p>

  const { poet, categories, slug } = data
  const descriptionShort = poet.description?.length > 300
    ? poet.description.slice(0, 300) + '...'
    : poet.description

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {poet.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {poet.name}
            </h1>
            {slug && (
              <a
                href={`/api/booklets/${slug}`}
                className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                دانلود کتاب (EPUB)
              </a>
            )}
          </div>
        </div>

        {poet.description && (
          <div className="bg-white dark:bg-stone-800/40 rounded-xl p-5 border border-stone-200 dark:border-stone-700/50">
            <p className="text-stone-600 dark:text-stone-300 leading-8 text-sm">
              {showFullBio ? poet.description : descriptionShort}
            </p>
            {poet.description.length > 300 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-primary-600 dark:text-primary-400 text-sm mt-2 hover:underline"
              >
                {showFullBio ? 'کمتر' : 'بیشتر...'}
              </button>
            )}
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4">
        آثار
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="p-4 rounded-xl bg-white dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/50 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
              {cat.text}
            </h3>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-center text-stone-400 py-8">آثاری یافت نشد</p>
      )}
    </div>
  )
}
