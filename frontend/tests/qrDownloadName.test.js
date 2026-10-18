import test from 'node:test'
import assert from 'node:assert/strict'
import { getQrDownloadName } from '../src/features/greetings/qrDownloadName.js'

test('QR download names normalize accents and special characters', () => {
  const filename = getQrDownloadName({
    id: 42,
    occasion: 'Birthday',
    recipientName: 'Mía 💖 / Santos?'
  }, 'print-card')

  assert.equal(
    filename,
    'crumbcoded-birthday-mia-santos-42-print-card.png'
  )
})

test('QR download names stay short for very long recipient names', () => {
  const filename = getQrDownloadName({
    id: 987654321,
    occasion: 'anniversary',
    recipientName: 'A very long recipient name '.repeat(10)
  }, 'print-card')

  assert.ok(filename.length <= 100)
  assert.match(filename, /^crumbcoded-anniversary-[a-z0-9-]+-987654321-print-card\.png$/)
})

test('QR download names have a readable fallback for emoji-only names', () => {
  const filename = getQrDownloadName({
    id: 7,
    occasion: 'romantic',
    recipientName: '💖🎂✨'
  }, 'qr-only')

  assert.equal(
    filename,
    'crumbcoded-romantic-greeting-7-qr-only.png'
  )
})
