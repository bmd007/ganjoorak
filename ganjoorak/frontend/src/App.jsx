import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDarkMode } from './hooks/useDarkMode'
import { CarpetBorder } from './components/PersianOrnament'
import Home from './pages/Home'
import PoetPage from './pages/PoetPage'
import CategoryPage from './pages/CategoryPage'
import PoemPage from './pages/PoemPage'
import SearchPage from './pages/SearchPage'
import BookmarksPage from './pages/BookmarksPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const [dark, toggleDark] = useDarkMode()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1729]/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
              گنجورک
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="جستجو در اشعار..."
              className="w-full px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-stone-400"
            />
          </form>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/bookmarks"
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              title="نشان‌شده‌ها"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>
            <button
              onClick={() => navigate('/poems/random')}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              title="شعر تصادفی"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              title={dark ? 'حالت روشن' : 'حالت تاریک'}
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poet/:id" element={<PoetPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/poem/:id" element={<PoemPage />} />
          <Route path="/poems/random" element={<PoemPage random />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="flex justify-center pt-4">
          <CarpetBorder className="w-64 text-gold-500/30 dark:text-gold-400/15" />
        </div>
        <p className="py-4 text-center text-sm text-stone-400 dark:text-stone-600">
          گنجورک — گنجینهٔ شعر پارسی
        </p>
      </footer>
    </div>
  )
}
