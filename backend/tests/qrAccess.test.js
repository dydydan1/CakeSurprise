import { randomUUID } from 'node:crypto'
import test from 'node:test'
import assert from 'node:assert/strict'
import argon2 from 'argon2'
import request from 'supertest'
import app from '../src/app.js'
import { database } from '../src/config/database.js'
import { deleteGreetingRecord } from '../src/models/greetingModel.js'

const testEmail = `qr-test-${randomUUID()}@example.com`
const testPassword = `Test-${randomUUID()}-password`
let greetingId

test.before(async () => {
  const passwordHash = await argon2.hash(testPassword, {
    type: argon2.argon2id
  })

  await database.execute(
    `INSERT INTO admins (email, password_hash, display_name, role)
     VALUES (?, ?, 'QR Test', 'owner')`,
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

test('QR access lifecycle', async () => {
  const unauthorizedResponse = await request(app)
    .post('/api/admin/greetings/1/qr')

  assert.equal(unauthorizedResponse.status, 401)

  const agent = request.agent(app)
  await agent
    .post('/api/admin/auth/login')
    .send({ email: testEmail, password: testPassword })

  const createResponse = await agent
    .post('/api/admin/greetings')
    .send({
      recipientName: 'QR Recipient',
      senderName: 'QR Sender',
      message: 'Scan complete. Your cake surprise is here!',
      occasion: 'birthday',
      theme: 'birthday',
      status: 'draft',
      orderReference: 'QR-TEST-001'
    })

  assert.equal(createResponse.status, 201)
  greetingId = createResponse.body.greeting.id

  const inactiveQrResponse = await agent
    .post(`/api/admin/greetings/${greetingId}/qr`)

  assert.equal(inactiveQrResponse.status, 409)

  await agent
    .patch(`/api/admin/greetings/${greetingId}`)
    .send({ status: 'active' })

  const qrResponse = await agent
    .post(`/api/admin/greetings/${greetingId}/qr`)

  assert.equal(qrResponse.status, 200)
  assert.match(qrResponse.body.greeting.publicToken, /^[A-Za-z0-9_-]{43}$/)
  assert.ok(qrResponse.body.greeting.qrGeneratedAt)

  const repeatedQrResponse = await agent
    .post(`/api/admin/greetings/${greetingId}/qr`)

  assert.equal(
    repeatedQrResponse.body.greeting.publicToken,
    qrResponse.body.greeting.publicToken
  )

  const publicResponse = await request(app)
    .get(`/api/public/greetings/${qrResponse.body.greeting.publicToken}`)

  assert.equal(publicResponse.status, 200)
  assert.equal(publicResponse.body.greeting.recipientName, 'QR Recipient')
  assert.equal(publicResponse.body.greeting.message, 'Scan complete. Your cake surprise is here!')
  assert.equal(publicResponse.body.greeting.orderReference, undefined)
  assert.equal(publicResponse.body.greeting.publicToken, undefined)

  await agent
    .patch(`/api/admin/greetings/${greetingId}`)
    .send({ status: 'disabled' })

  const disabledPublicResponse = await request(app)
    .get(`/api/public/greetings/${qrResponse.body.greeting.publicToken}`)

  assert.equal(disabledPublicResponse.status, 404)
})
