import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { database } from '../src/config/database.js'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const migrationsDirectory = join(currentDirectory, '..', 'migrations')

const runMigrations = async () => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `)

  const migrationFiles = (await readdir(migrationsDirectory))
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort()

  for (const fileName of migrationFiles) {
    const [existingMigrations] = await database.execute(
      'SELECT name FROM schema_migrations WHERE name = ?',
      [fileName]
    )

    if (existingMigrations.length > 0) {
      console.log(`Skipped ${fileName}`)
      continue
    }

    const migrationSql = await readFile(join(migrationsDirectory, fileName), 'utf8')
    const statements = migrationSql
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean)

    for (const statement of statements) {
      await database.query(statement)
    }

    await database.execute(
      'INSERT INTO schema_migrations (name) VALUES (?)',
      [fileName]
    )

    console.log(`Applied ${fileName}`)
  }
}

try {
  await runMigrations()
  console.log('Database migrations are complete.')
} catch (error) {
  console.error('Migration failed:', error.message)
  process.exitCode = 1
} finally {
  await database.end()
}
