const inlineFormattingPattern = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g

export const parseInlineFormatting = (value) => {
  const tokens = []
  let lastIndex = 0

  for (const match of value.matchAll(inlineFormattingPattern)) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        value: value.slice(lastIndex, match.index)
      })
    }

    const formattedValue = match[0]
    const isStrong = formattedValue.startsWith('**')

    tokens.push({
      type: isStrong ? 'strong' : 'emphasis',
      value: isStrong
        ? formattedValue.slice(2, -2)
        : formattedValue.slice(1, -1)
    })

    lastIndex = match.index + formattedValue.length
  }

  if (lastIndex < value.length) {
    tokens.push({
      type: 'text',
      value: value.slice(lastIndex)
    })
  }

  return tokens
}

export const parseMessageBlocks = (message) => {
  const normalizedMessage = String(message || '')
    .replace(/\r\n?/g, '\n')
    .trim()

  if (!normalizedMessage) {
    return []
  }

  const blocks = []
  let paragraphLines = []

  const addParagraph = () => {
    if (paragraphLines.length === 0) {
      return
    }

    blocks.push({
      type: 'paragraph',
      lines: paragraphLines
    })
    paragraphLines = []
  }

  normalizedMessage.split('\n').forEach((line) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)

    if (headingMatch) {
      addParagraph()
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        value: headingMatch[2].trim()
      })
      return
    }

    if (!line.trim()) {
      addParagraph()
      return
    }

    paragraphLines.push(line)
  })

  addParagraph()
  return blocks
}

export const toPlainMessagePreview = (message) => {
  return String(message || '')
    .replace(/^#{1,3}\s+/gm, '')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}
