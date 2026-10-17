import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const loadEnvironment = (overrides = {}) => {
  return spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      "import('./src/config/env.js').then(({ env }) => console.log(JSON.stringify(env)))"
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '5000',
        CLIENT_ORIGIN: 'https://frosted-whispers.vercel.app',
        DB_HOST: 'mysql.railway.internal',
        DB_PORT: '3306',
        DB_NAME: 'railway',
        DB_USER: 'root',
        DB_PASSWORD: 'strong-production-password',
        SESSION_HOURS: '8',
        ...overrides
      }
    }
  )
}

test('accepts and normalizes a valid production environment', () => {
  const result = loadEnvironment({
    CLIENT_ORIGIN: 'https://frosted-whispers.vercel.app/'
  })

  assert.equal(result.status, 0)

  const loadedEnvironment = JSON.parse(result.stdout.trim())

  assert.equal(loadedEnvironment.clientOrigin, 'https://frosted-whispers.vercel.app')
  assert.equal(loadedEnvironment.dbPort, 3306)
  assert.equal(loadedEnvironment.isProduction, true)
})

test('requires an explicit client origin in production', () => {
  const result = loadEnvironment({ CLIENT_ORIGIN: '' })

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /CLIENT_ORIGIN is required in production/)
})

test('requires HTTPS for the production client origin', () => {
  const result = loadEnvironment({
    CLIENT_ORIGIN: 'http://frosted-whispers.example.com'
  })

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /CLIENT_ORIGIN must use HTTPS in production/)
})

test('rejects an invalid database port', () => {
  const result = loadEnvironment({ DB_PORT: 'not-a-port' })

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /DB_PORT must be a valid port number/)
})

test('requires a database password in production', () => {
  const result = loadEnvironment({ DB_PASSWORD: '' })

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /DB_PASSWORD is required/)
})

test('rejects an invalid session duration', () => {
  const result = loadEnvironment({ SESSION_HOURS: '0' })

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /SESSION_HOURS must be a positive integer/)
})
