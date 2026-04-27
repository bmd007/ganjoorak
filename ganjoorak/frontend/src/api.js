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

async function postJson(path, body, method = 'POST') {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function createPoet(name, description) {
  return postJson('/admin/poets', { name, description })
}

export function createPoem(poetId, categoryId, title, verses) {
  return postJson('/admin/poems', { poetId, categoryId, title, verses })
}

export function updatePoem(id, poetId, categoryId, title, verses) {
  return postJson(`/admin/poems/${id}`, { poetId, categoryId, title, verses }, 'PUT')
}

export async function deletePoem(id) {
  const res = await fetch(`${BASE}/admin/poems/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function chatWithPoem(poemId, message, history, onChunk) {
  const res = await fetch(`${BASE}/poems/${poemId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: history || [] }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop()
    for (const part of parts) {
      for (const line of part.split('\n')) {
        if (line.startsWith('data:')) {
          onChunk(line.slice(5))
        }
      }
    }
  }
  if (buffer.trim()) {
    for (const line of buffer.split('\n')) {
      if (line.startsWith('data:')) {
        onChunk(line.slice(5))
      }
    }
  }
}
