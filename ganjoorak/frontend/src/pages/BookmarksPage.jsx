import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks'

export default function BookmarksPage() {
  const { bookmarks, toggle } = useBookmarks()

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
        نشان‌شده‌ها
      </h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-stone-300 dark:text-stone-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-stone-400 dark:text-stone-500">
            هنوز شعری نشان‌گذاری نکرده‌اید
          </p>
          <Link to="/" className="text-primary-600 dark:text-primary-400 text-sm hover:underline mt-2 inline-block">
            بازگشت به خانه
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map(b => (
            <div
              key={b.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/50"
            >
              <Link
                to={`/poem/${b.id}`}
                className="flex-1 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
              >
                <p className="font-medium text-stone-800 dark:text-stone-200">{b.title}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{b.poetName}</p>
              </Link>
              <button
                onClick={() => toggle(b)}
                className="p-2 text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors shrink-0"
                title="حذف نشان"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
