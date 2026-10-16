import app from './app.js'
import { database } from './config/database.js'
import { env } from './config/env.js'

const server = app.listen(env.port, () => {
  console.log(`Backend server is running on http://localhost:${env.port}`)
})

const shutdown = async () => {
  console.log('Shutting down backend server...')
  server.close(async () => {
    await database.end()
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

