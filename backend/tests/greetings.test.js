import { randomUUID } from 'node:crypto'
import test from 'node:test'
import assert from 'node:assert/strict'
import argon2 from 'argon2'
import request from 'supertest'
import app from '../src/app.js'
import { database } from '../src/config/database.js'
import { env } from '../src/config/env.js'
import { deleteGreetingRecord } from '../src/models/greetingModel.js'

const testEmail = `greeting-test-${randomUUID()}@example.com`
const testPassword = `Test-${randomUUID()}-password`
let greetingId

const setOrigin = (testRequest) => {
  return testRequest.set('Origin', env.clientOrigin)
}

test.before(async () => {
  const passwordHash = await argon2.hash(testPassword, {
    type: argon2.argon2id
  })

  await database.execute(
    `INSERT INTO admins (email, password_hash, display_name, role)
     VALUES (?, ?, 'Greeting Test', 'owner')`,
    [testEmail, passwordHash]
  )
})

test.after(async () => {
  if (greetingId) {
    await deleteGreetingRecord(greetingId)
  }

  await database.execute('DELETE FROM admins WHERE email = ?', [testEmail])
  await database.end()
})

test('greeting management lifecycle', async () => {
  const unauthorizedResponse = await request(app).get('/api/admin/greetings')
  assert.equal(unauthorizedResponse.status, 401)

  const agent = request.agent(app)
  const loginResponse = await setOrigin(
    agent.post('/api/admin/auth/login')
  ).send({ email: testEmail, password: testPassword })

  assert.equal(loginResponse.status, 200)

  const invalidCreateResponse = await setOrigin(
    agent.post('/api/admin/greetings')
  ).send({ recipientName: '', message: '' })

  assert.equal(invalidCreateResponse.status, 400)

  const createResponse = await setOrigin(
    agent.post('/api/admin/greetings')
  ).send({
      recipientName: 'Sophia Test',
      senderName: 'James Test',
      message: 'Happy monthsary! This is an integration test greeting.',
      occasion: 'monthsary',
      theme: 'monthsary',
      status: 'draft',
      orderReference: 'TEST-ORDER-001'
    })

  assert.equal(createResponse.status, 201)
  assert.equal(createResponse.body.greeting.status, 'draft')
  assert.equal(createResponse.body.greeting.occasion, 'monthsary')
  assert.equal(createResponse.body.greeting.theme, 'monthsary')
  greetingId = createResponse.body.greeting.id

  const listResponse = await agent
    .get('/api/admin/greetings')
    .query({ search: 'Sophia Test', status: 'draft' })

  assert.equal(listResponse.status, 200)
  assert.equal(listResponse.body.pagination.total, 1)
  assert.equal(listResponse.body.greetings[0].id, greetingId)

  const detailResponse = await agent.get(`/api/admin/greetings/${greetingId}`)
  assert.equal(detailResponse.status, 200)
  assert.equal(detailResponse.body.greeting.orderReference, 'TEST-ORDER-001')

  const updateResponse = await setOrigin(
    agent.patch(`/api/admin/greetings/${greetingId}`)
  ).send({ status: 'archived', message: 'Updated test greeting message.' })

  assert.equal(updateResponse.status, 200)
  assert.equal(updateResponse.body.greeting.status, 'archived')
  assert.ok(updateResponse.body.greeting.archivedAt)
})
