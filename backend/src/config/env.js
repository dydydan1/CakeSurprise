import 'dotenv/config'

const getRequiredEnvValue = (name) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

const getPort = () => {
  const value = Number(process.env.PORT || 5000)

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error('PORT must be a valid port number')
  }

  return value
}

const getPositiveInteger = (name, fallback) => {
  const value = Number(process.env[name] || fallback)

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`)
  }

  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: getPort(),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  dbHost: getRequiredEnvValue('DB_HOST'),
  dbPort: Number(process.env.DB_PORT || 3306),
  dbName: getRequiredEnvValue('DB_NAME'),
  dbUser: getRequiredEnvValue('DB_USER'),
  dbPassword: process.env.DB_PASSWORD || '',
  sessionHours: getPositiveInteger('SESSION_HOURS', 8),
  isProduction: process.env.NODE_ENV === 'production'
}

