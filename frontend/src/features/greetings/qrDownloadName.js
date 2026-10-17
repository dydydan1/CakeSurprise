const createSafeSlug = (value, fallback, maxLength) => {
  const slug = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')

  return slug || fallback
}

export const getQrDownloadName = (greeting, type) => {
  const occasion = createSafeSlug(greeting.occasion, 'occasion', 16)
  const recipient = createSafeSlug(greeting.recipientName, 'greeting', 32)
  const downloadType = createSafeSlug(type, 'qr', 12)
  const greetingId = String(greeting.id || '')
    .replace(/[^0-9]/g, '')
    .slice(0, 12)
  const idSuffix = greetingId ? `-${greetingId}` : ''

  return `frosted-whispers-${occasion}-${recipient}${idSuffix}-${downloadType}.png`
}
