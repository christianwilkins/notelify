// File: pages/api/search.ts

import { NextApiRequest, NextApiResponse } from 'next'
import searchNotes from '@/API/SearchNotes'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query
  console.log(`QUERY IS ${query}`)

  try {
    const data = await searchNotes(query as string)
    console.log(`DATA IS ${data}`)
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while searching notes.' })
  }
}