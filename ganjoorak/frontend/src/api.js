const BASE = '/api'

async function fetchJson(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function getPoets() {
  return fetchJson('/poets')
}

export function getPoet(id) {
  return fetchJson(`/poets/${id}`)
}

export function getCategory(id) {
  return fetchJson(`/categories/${id}`)
}

export function getPoem(id) {
  return fetchJson(`/poems/${id}`)
}

export function getRandomPoem() {
  return fetchJson('/poems/random')
}

export function search(q, limit = 50) {
  return fetchJson(`/search?q=${encodeURIComponent(q)}&limit=${limit}`)
}
