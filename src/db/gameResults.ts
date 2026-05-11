import { getDb } from './database'

export interface GameResult {
  id: number
  players: string[]
  scores: Record<string, number>
  winner: string
  played_at: string
}

export interface NewGameResult {
  players: string[]
  scores: Record<string, number>
  winner: string
}

export async function saveGameResult(result: NewGameResult): Promise<void> {
  const db = await getDb()
  await db.query(
    'INSERT INTO game_results (players, scores, winner) VALUES ($1, $2, $3)',
    [result.players, result.scores, result.winner],
  )
}

export async function getGameHistory(): Promise<GameResult[]> {
  const db = await getDb()
  const { rows } = await db.query<GameResult>(
    'SELECT id, players, scores, winner, played_at FROM game_results ORDER BY played_at DESC',
  )
  return rows
}
