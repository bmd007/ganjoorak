import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCategory } from '../api'
import Loading from '../components/Loading'
import Breadcrumb from '../components/Breadcrumb'

export default function CategoryPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCategory(id).then(setData).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (!data) return <p className="text-center py-12 text-stone-400">دسته‌بندی یافت نشد</p>

  const { category, subcategories, poems, breadcrumb } = data

  return (
    <div>
      <Breadcrumb items={breadcrumb} />

      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
        {category.text}
      </h1>

      {subcategories.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {subcategories.map(sub => (
              <Link
                key={sub.id}
                to={`/category/${sub.id}`}
                className="p-4 rounded-xl bg-white dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/50 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {sub.text}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {poems.length > 0 && (
        <div>
          {subcategories.length > 0 && (
            <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-4 mt-2">
              اشعار
            </h2>
          )}
          <div className="space-y-1">
            {poems.map((poem, idx) => (
              <Link
                key={poem.id}
                to={`/poem/${poem.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-stone-800/40 transition-colors group"
              >
                <span className="text-xs text-stone-400 dark:text-stone-500 w-8 text-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-stone-700 dark:text-stone-300 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {poem.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {subcategories.length === 0 && poems.length === 0 && (
        <p className="text-center text-stone-400 py-12">محتوایی یافت نشد</p>
      )}
    </div>
  )
}
