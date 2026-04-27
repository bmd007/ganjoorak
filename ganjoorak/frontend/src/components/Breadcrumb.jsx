import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mb-6 flex-wrap">
      <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        خانه
      </Link>
      {items.map((item, i) => (
        <span key={item.id} className="flex items-center gap-2">
          <span className="text-stone-300 dark:text-stone-600">/</span>
          {i < items.length - 1 ? (
            <Link
              to={`/category/${item.id}`}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {item.text}
            </Link>
          ) : (
            <span className="text-stone-700 dark:text-stone-300">{item.text}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
