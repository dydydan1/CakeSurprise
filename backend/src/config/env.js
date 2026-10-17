import 'dotenv/config'

const getRequiredEnvValue = (name) => {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

const getPort = (name, fallback) => {
  const value = Number(process.env[name] || fallback)

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`${name} must be a valid port number`)
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

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

const getClientOrigin = () => {
  const value = process.env.CLIENT_ORIGIN?.trim()

  if (!value && isProduction) {
    throw new Error('CLIENT_ORIGIN is required in production')
  }

  const originValue = value || 'http://localhost:5173'

  try {
    const url = new URL(originValue)

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error()
    }

    if (isProduction && url.protocol !== 'https:') {
      throw new Error('CLIENT_ORIGIN must use HTTPS in production')
    }

    return url.origin
  } catch (error) {
    if (error.message === 'CLIENT_ORIGIN must use HTTPS in production') {
      throw error
    }

    throw new Error('CLIENT_ORIGIN must be a valid HTTP or HTTPS URL')
  }
}

const getDatabasePassword = () => {
  if (isProduction) {
    return getRequiredEnvValue('DB_PASSWORD')
  }

  return process.env.DB_PASSWORD || ''
}

export const env = {
  nodeEnv,
  port: getPort('PORT', 5000),
  clientOrigin: getClientOrigin(),
  dbHost: getRequiredEnvValue('DB_HOST'),
  dbPort: getPort('DB_PORT', 3306),
  dbName: getRequiredEnvValue('DB_NAME'),
  dbUser: getRequiredEnvValue('DB_USER'),
  dbPassword: getDatabasePassword(),
  sessionHours: getPositiveInteger('SESSION_HOURS', 8),
  isProduction
}

