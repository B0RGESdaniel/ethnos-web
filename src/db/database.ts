import { PGlite } from '@electric-sql/pglite'

let _dbPromise: Promise<PGlite> | null = null

async function initDb(): Promise<PGlite> {
  const db = new PGlite('idb://ethnos-web')
  await db.exec(`
    CREATE TABLE IF NOT EXISTS game_results (
      id        SERIAL PRIMARY KEY,
      players   JSONB        NOT NULL,
      scores    JSONB        NOT NULL,
      winner    TEXT         NOT NULL,
      played_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `)
  return db
}

export function getDb(): Promise<PGlite> {
  if (!_dbPromise) _dbPromise = initDb()
  return _dbPromise
}
