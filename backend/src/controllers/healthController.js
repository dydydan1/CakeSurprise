import { database } from '../config/database.js'

export const getHealthStatus = async (_request, response) => {
  try {
    await database.query('SELECT 1')

    return response.status(200).json({
      status: 'ok',
      database: 'connected'
    })
  } catch (error) {
    console.error('Database health check failed:', error.message)

    return response.status(503).json({
      status: 'unavailable',
      database: 'disconnected'
    })
  }
}

