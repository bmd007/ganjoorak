import { useState, useCallback } from 'react'

function load() {
  try {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]')
  } catch {
    return []
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load)

  const toggle = useCallback((poem) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === poem.id)
      const next = exists ? prev.filter(b => b.id !== poem.id) : [...prev, poem]
      localStorage.setItem('bookmarks', JSON.stringify(next))
      return next
    })
  }, [])

  const isBookmarked = useCallback((id) => {
    return bookmarks.some(b => b.id === id)
  }, [bookmarks])

  return { bookmarks, toggle, isBookmarked }
}
