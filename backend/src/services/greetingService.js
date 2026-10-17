import { randomBytes } from 'node:crypto'
import {
  createGreetingRecord,
  findActiveGreetingByPublicToken,
  findGreetingById,
  listGreetingRecords,
  setGreetingQrAccessIfMissing,
  updateGreetingRecord
} from '../models/greetingModel.js'

const emptyToNull = (value) => {
  return value === '' || value === undefined ? null : value
}

const formatGreeting = (greeting) => ({
  id: greeting.id,
  recipientName: greeting.recipient_name,
  senderName: greeting.sender_name,
  message: greeting.message,
  occasion: greeting.occasion,
  theme: greeting.theme,
  status: greeting.status,
  orderReference: greeting.order_reference,
  publicToken: greeting.public_token,
  qrGeneratedAt: greeting.qr_generated_at,
  createdByAdminId: greeting.created_by_admin_id,
  activatedAt: greeting.activated_at,
  archivedAt: greeting.archived_at,
  createdAt: greeting.created_at,
  updatedAt: greeting.updated_at
})

const formatPublicGreeting = (greeting) => ({
  recipientName: greeting.recipient_name,
  senderName: greeting.sender_name,
  message: greeting.message,
  occasion: greeting.occasion,
  theme: greeting.theme,
  activatedAt: greeting.activated_at
})

const getStatusDates = (status, existingGreeting = null) => {
  if (status === 'active') {
    return {
      activatedAt: existingGreeting?.activated_at || new Date(),
      archivedAt: null
    }
  }

  if (status === 'archived') {
    return {
      activatedAt: existingGreeting?.activated_at || null,
      archivedAt: new Date()
    }
  }

  return {
    activatedAt: existingGreeting?.activated_at || null,
    archivedAt: null
  }
}

export const createGreeting = async (data, adminId) => {
  const statusDates = getStatusDates(data.status)
  const greetingId = await createGreetingRecord({
    ...data,
    senderName: emptyToNull(data.senderName),
    orderReference: emptyToNull(data.orderReference),
    createdByAdminId: adminId,
    ...statusDates
  })

  const greeting = await findGreetingById(greetingId)
  return formatGreeting(greeting)
}

export const getGreeting = async (id) => {
  const greeting = await findGreetingById(id)
  return greeting ? formatGreeting(greeting) : null
}

export const listGreetings = async (filters) => {
  const result = await listGreetingRecords(filters)

  return {
    greetings: result.rows.map(formatGreeting),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / filters.limit)
    }
  }
}

export const updateGreeting = async (id, data) => {
  const existingGreeting = await findGreetingById(id)

  if (!existingGreeting) {
    return null
  }

  const updates = { ...data }

  if ('senderName' in updates) {
    updates.senderName = emptyToNull(updates.senderName)
  }

  if ('orderReference' in updates) {
    updates.orderReference = emptyToNull(updates.orderReference)
  }

  if (updates.status) {
    Object.assign(updates, getStatusDates(updates.status, existingGreeting))
  }

  await updateGreetingRecord(id, updates)
  const updatedGreeting = await findGreetingById(id)
  return formatGreeting(updatedGreeting)
}

export const generateGreetingQrAccess = async (id) => {
  const greeting = await findGreetingById(id)

  if (!greeting) {
    return { greeting: null, reason: 'not_found' }
  }

  if (greeting.status !== 'active') {
    return { greeting: formatGreeting(greeting), reason: 'not_active' }
  }

  if (!greeting.public_token) {
    await setGreetingQrAccessIfMissing(
      id,
      randomBytes(32).toString('base64url'),
      new Date()
    )
  }

  const updatedGreeting = await findGreetingById(id)

  if (!updatedGreeting) {
    return { greeting: null, reason: 'not_found' }
  }

  if (updatedGreeting.status !== 'active') {
    return {
      greeting: formatGreeting(updatedGreeting),
      reason: 'not_active'
    }
  }

  return {
    greeting: formatGreeting(updatedGreeting),
    reason: null
  }
}

export const getPublicGreeting = async (publicToken) => {
  const greeting = await findActiveGreetingByPublicToken(publicToken)
  return greeting ? formatPublicGreeting(greeting) : null
}
