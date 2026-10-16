import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import greetingRoutes from './routes/greetingRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import publicGreetingRoutes from './routes/publicGreetingRoutes.js'

const app = express()

app.use(cors({
  origin: env.clientOrigin,
  credentials: true
}))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/public/greetings', publicGreetingRoutes)
app.use('/api/admin/auth', authRoutes)
app.use('/api/admin/greetings', greetingRoutes)

app.use((_request, response) => {
  return response.status(404).json({
    message: 'Route not found'
  })
})

app.use((error, _request, response, _next) => {
  console.error('Unhandled application error:', error.message)

  return response.status(500).json({
    message: 'An unexpected error occurred'
  })
})

export default app

