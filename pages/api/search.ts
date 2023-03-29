import type { NextApiRequest, NextApiResponse } from 'next'

const searchRelayUrl = 'https://api.github.com/search/repositories'

type Data = {
  items?: any[]
  error?: string
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { q } = req.query as { q?: string }
  if (!q) {
    res.status(400).json({ error: 'Query required' })
    return
  }

  const params = new URLSearchParams({
    q,
    per_page: '20',
  }).toString()
  
  try {
    const apiResponse = await fetch(`${searchRelayUrl}?${params}`)
    if (!apiResponse.ok) {
      res.status(apiResponse.status).json({ error: apiResponse.statusText })
    }
    const { items }: Data = await apiResponse.json()
    res.status(200).json({ items })
  } catch(e: any) {
    res.status(500).json({ error: String(e?.message || 'Something went wrong') })
  }
}
