import type { Repository } from '../components/RepositoryOption'

type APIResponse = { items?: Repository[] }

export async function queryRepository(query: string, signal: AbortSignal) {
  await new Promise((resolve, reject) => {
    signal.throwIfAborted()
    setTimeout(resolve, 500)
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
  })

  if (!query) {
    return []
  }
  
  const res = await fetch(`/api/search?${new URLSearchParams({
    q: query,
  })}`, { signal })

  if (res.ok) {
    const { items = [] } = await res.json() as APIResponse
    return items
  }

  throw new Error('Failed to fetch', { cause: res })
}