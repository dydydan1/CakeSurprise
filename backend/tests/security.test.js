import { randomUUID } from 'node:crypto'
import test from 'node:test'
import assert from 'node:assert/strict'
import argon2 from 'argon2'
import request from 'supertest'
import app from '../src/app.js'
import { database } from '../src/config/database.js'
import { env } from '../src/config/env.js'

const testEmail = `security-test-${randomUUID()}@example.com`
const testPassword = `Test-${randomUUID()}-password`

test.before(async () => {
  const passwordHash = await argon2.hash(testPassword, {
    type: argon2.argon2id
  })

  await database.execute(
    `INSERT INTO admins (email, password_hash, display_name, role)
     VALUES (?, ?, 'Security Test', 'owner')`,
    [testEmail, passwordHash]
  )
})

test.after(async () => {
  await database.execute('DELETE FROM admins WHERE email = ?', [testEmail])
  await database.end()
})

test('security controls reject unsafe requests and protect responses', async () => {
  const healthResponse = await request(app).get('/api/health')

  assert.equal(healthResponse.status, 200)
  assert.equal(healthResponse.headers['x-content-type-options'], 'nosniff')
  assert.equal(healthResponse.headers['x-frame-options'], 'SAMEORIGIN')
  assert.equal(healthResponse.headers['x-powered-by'], undefined)

  const missingOriginResponse = await request(app)
    .post('/api/admin/auth/login')
    .send({ email: testEmail, password: testPassword })

  assert.equal(missingOriginResponse.status, 403)

  const maliciousOriginResponse = await request(app)
    .post('/api/admin/auth/login')
    .set('Origin', 'https://malicious.example')
    .send({ email: testEmail, password: testPassword })

  assert.equal(maliciousOriginResponse.status, 403)

  const invalidJsonResponse = await request(app)
    .post('/api/admin/auth/login')
    .set('Origin', env.clientOrigin)
    .set('Content-Type', 'application/json')
    .send('{"email":')

  assert.equal(invalidJsonResponse.status, 400)
  assert.equal(invalidJsonResponse.body.message, 'Request body contains invalid JSON')

  const oversizedBodyResponse = await request(app)
    .post('/api/admin/auth/login')
    .set('Origin', env.clientOrigin)
    .send({
      email: testEmail,
      password: 'x'.repeat(101 * 1024)
    })

  assert.equal(oversizedBodyResponse.status, 413)
  assert.equal(oversizedBodyResponse.body.message, 'Request body is too large')

  const agent = request.agent(app)
  const loginResponse = await agent
    .post('/api/admin/auth/login')
    .set('Origin', env.clientOrigin)
    .send({ email: testEmail, password: testPassword })

  assert.equal(loginResponse.status, 200)
  assert.match(loginResponse.headers['cache-control'], /no-store/)

  const missingMutationOriginResponse = await agent
    .post('/api/admin/greetings')
    .send({
      recipientName: 'Blocked Request',
      message: 'This request must not be accepted.',
      occasion: 'other',
      theme: 'elegant',
      status: 'draft'
    })

  assert.equal(missingMutationOriginResponse.status, 403)

  const publicResponse = await request(app)
    .get('/api/public/greetings/invalid-token')

  assert.equal(publicResponse.status, 404)
  assert.match(publicResponse.headers['cache-control'], /no-store/)
  assert.ok(publicResponse.headers.ratelimit)
})
