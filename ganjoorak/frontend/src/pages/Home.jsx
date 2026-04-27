import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPoets } from '../api'
import Loading from '../components/Loading'
import { Arabesque, Medallion, CarpetBorder } from '../components/PersianOrnament'

export default function Home() {
  const [poets, setPoets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getPoets().then(setPoets).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const filtered = filter
    ? poets.filter(p => p.name.includes(filter))
    : poets

  return (
    <div>
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] dark:opacity-[0.04] pointer-events-none">
          <Medallion size={280} className="text-primary-700 dark:text-primary-300" />
        </div>

        <div className="relative">
          <CarpetBorder className="w-48 mx-auto text-gold-500/60 dark:text-gold-400/30 mb-4" />
          <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-300 mb-2">
            گنجورک
          </h1>
          <Arabesque className="w-64 mx-auto text-gold-500 dark:text-gold-400/60 my-3" />
          <p className="text-stone-500 dark:text-stone-400 text-lg">
            گنجینهٔ شعر پارسی — {poets.length} شاعر
          </p>
          <CarpetBorder className="w-48 mx-auto text-gold-500/60 dark:text-gold-400/30 mt-4 rotate-180" />
        </div>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="فیلتر شاعران..."
          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-stone-400"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map(poet => (
          <Link
            key={poet.id}
            to={`/poet/${poet.id}`}
            className="group relative p-4 rounded-xl bg-white dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/50 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-200 text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
              <Medallion size={120} className="text-primary-400/20 dark:text-primary-300/10" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg group-hover:scale-110 transition-transform">
                {poet.name.charAt(0)}
              </div>
              <h2 className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {poet.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-stone-400 dark:text-stone-500 py-12">
          شاعری با این نام یافت نشد
        </p>
      )}
    </div>
  )
}
