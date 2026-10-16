import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import greetingRoutes from './routes/greetingRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import publicGreetingRoutes from './routes/publicGreetingRoutes.js'

const app = express()

app.disable('x-powered-by')

if (env.isProduction) {
  app.set('trust proxy', 1)
}

app.use(helmet())
app.use(cors({
  origin: env.clientOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
}))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

const preventSensitiveCaching = (_request, response, next) => {
  response.set('Cache-Control', 'no-store')
  response.set('Pragma', 'no-cache')
  return next()
}

app.use('/api/health', healthRoutes)
app.use('/api/public/greetings', preventSensitiveCaching, publicGreetingRoutes)
app.use('/api/admin/auth', preventSensitiveCaching, authRoutes)
app.use('/api/admin/greetings', preventSensitiveCaching, greetingRoutes)

app.use((_request, response) => {
  return response.status(404).json({
    message: 'Route not found'
  })
})

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({
      message: 'Request body contains invalid JSON'
    })
  }

  if (error.type === 'entity.too.large') {
    return response.status(413).json({
      message: 'Request body is too large'
    })
  }

  console.error('Unhandled application error:', error.message)

  return response.status(500).json({
    message: 'An unexpected error occurred'
  })
})

export default app

