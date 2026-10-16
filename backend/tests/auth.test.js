import { randomUUID } from 'node:crypto'
import test from 'node:test'
import assert from 'node:assert/strict'
import argon2 from 'argon2'
import request from 'supertest'
import app from '../src/app.js'
import { database } from '../src/config/database.js'
import { env } from '../src/config/env.js'

const testEmail = `auth-test-${randomUUID()}@example.com`
const testPassword = `Test-${randomUUID()}-password`

const setOrigin = (testRequest) => {
  return testRequest.set('Origin', env.clientOrigin)
}

test.before(async () => {
  const passwordHash = await argon2.hash(testPassword, {
    type: argon2.argon2id
  })

  await database.execute(
    `INSERT INTO admins (email, password_hash, display_name, role)
     VALUES (?, ?, 'Authentication Test', 'owner')`,
    [testEmail, passwordHash]
  )
})

test.after(async () => {
  await database.execute('DELETE FROM admins WHERE email = ?', [testEmail])
  await database.end()
})

test('admin authentication lifecycle', async () => {
  const agent = request.agent(app)

  const rejectedLogin = await setOrigin(
    agent.post('/api/admin/auth/login')
  ).send({ email: testEmail, password: 'incorrect-password' })

  assert.equal(rejectedLogin.status, 401)

  const loginResponse = await setOrigin(
    agent.post('/api/admin/auth/login')
  ).send({ email: testEmail, password: testPassword })

  assert.equal(loginResponse.status, 200)
  assert.equal(loginResponse.body.admin.email, testEmail)
  assert.match(loginResponse.headers['set-cookie'][0], /HttpOnly/)

  const currentAdminResponse = await agent.get('/api/admin/auth/me')

  assert.equal(currentAdminResponse.status, 200)
  assert.equal(currentAdminResponse.body.admin.role, 'owner')

  const logoutResponse = await setOrigin(agent.post('/api/admin/auth/logout'))
  assert.equal(logoutResponse.status, 204)

  const signedOutResponse = await agent.get('/api/admin/auth/me')
  assert.equal(signedOutResponse.status, 401)
})
