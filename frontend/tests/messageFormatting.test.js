import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseInlineFormatting,
  parseMessageBlocks,
  toPlainMessagePreview
} from '../src/features/greetings/messageFormatting.js'

test('message blocks preserve headings, paragraphs, and intentional line breaks', () => {
  const blocks = parseMessageBlocks(
    '# A Special Day\n\nFirst line\nSecond line\n\nWith love'
  )

  assert.deepEqual(blocks, [
    { type: 'heading', level: 1, value: 'A Special Day' },
    { type: 'paragraph', lines: ['First line', 'Second line'] },
    { type: 'paragraph', lines: ['With love'] }
  ])
})

test('inline formatting recognizes bold and italic text', () => {
  const tokens = parseInlineFormatting(
    'You are **deeply loved** and *always appreciated*.'
  )

  assert.deepEqual(tokens, [
    { type: 'text', value: 'You are ' },
    { type: 'strong', value: 'deeply loved' },
    { type: 'text', value: ' and ' },
    { type: 'emphasis', value: 'always appreciated' },
    { type: 'text', value: '.' }
  ])
})

test('dashboard preview removes formatting markers and extra whitespace', () => {
  const preview = toPlainMessagePreview(
    '# Happy Birthday\n\n**You are amazing.**\n*Enjoy your day!*'
  )

  assert.equal(preview, 'Happy Birthday You are amazing. Enjoy your day!')
})

test('HTML-looking content remains ordinary text', () => {
  const tokens = parseInlineFormatting('<script>alert("hello")</script>')

  assert.deepEqual(tokens, [
    { type: 'text', value: '<script>alert("hello")</script>' }
  ])
})
