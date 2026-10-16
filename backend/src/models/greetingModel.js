import { database } from '../config/database.js'

const greetingColumns = `
  id,
  recipient_name,
  sender_name,
  message,
  occasion,
  theme,
  status,
  order_reference,
  public_token,
  qr_generated_at,
  created_by_admin_id,
  activated_at,
  archived_at,
  created_at,
  updated_at
`

export const createGreetingRecord = async (greeting) => {
  const [result] = await database.execute(
    `INSERT INTO greetings (
       recipient_name,
       sender_name,
       message,
       occasion,
       theme,
       status,
       order_reference,
       created_by_admin_id,
       activated_at,
       archived_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      greeting.recipientName,
      greeting.senderName,
      greeting.message,
      greeting.occasion,
      greeting.theme,
      greeting.status,
      greeting.orderReference,
      greeting.createdByAdminId,
      greeting.activatedAt,
      greeting.archivedAt
    ]
  )

  return result.insertId
}

export const findGreetingById = async (id) => {
  const [rows] = await database.execute(
    `SELECT ${greetingColumns}
     FROM greetings
     WHERE id = ?
     LIMIT 1`,
    [id]
  )

  return rows[0] || null
}

export const findActiveGreetingByPublicToken = async (publicToken) => {
  const [rows] = await database.execute(
    `SELECT ${greetingColumns}
     FROM greetings
     WHERE public_token = ? AND status = 'active'
     LIMIT 1`,
    [publicToken]
  )

  return rows[0] || null
}

const buildGreetingFilters = ({ search, status, occasion }) => {
  const conditions = []
  const parameters = []

  if (search) {
    conditions.push(`(
      recipient_name LIKE ? OR
      sender_name LIKE ? OR
      order_reference LIKE ?
    )`)
    const searchValue = `%${search}%`
    parameters.push(searchValue, searchValue, searchValue)
  }

  if (status) {
    conditions.push('status = ?')
    parameters.push(status)
  }

  if (occasion) {
    conditions.push('occasion = ?')
    parameters.push(occasion)
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    parameters
  }
}

export const listGreetingRecords = async (filters) => {
  const { whereClause, parameters } = buildGreetingFilters(filters)
  const offset = (filters.page - 1) * filters.limit

  const [rows] = await database.execute(
    `SELECT ${greetingColumns}
     FROM greetings
     ${whereClause}
     ORDER BY created_at DESC, id DESC
     LIMIT ? OFFSET ?`,
    [...parameters, filters.limit, offset]
  )

  const [countRows] = await database.execute(
    `SELECT COUNT(*) AS total
     FROM greetings
     ${whereClause}`,
    parameters
  )

  return {
    rows,
    total: Number(countRows[0].total)
  }
}

const updateColumnMap = {
  recipientName: 'recipient_name',
  senderName: 'sender_name',
  message: 'message',
  occasion: 'occasion',
  theme: 'theme',
  status: 'status',
  orderReference: 'order_reference',
  publicToken: 'public_token',
  qrGeneratedAt: 'qr_generated_at',
  activatedAt: 'activated_at',
  archivedAt: 'archived_at'
}

export const updateGreetingRecord = async (id, updates) => {
  const entries = Object.entries(updates)
    .filter(([key]) => updateColumnMap[key])

  if (entries.length === 0) {
    return
  }

  const assignments = entries.map(([key]) => `${updateColumnMap[key]} = ?`)
  const values = entries.map(([, value]) => value)

  await database.execute(
    `UPDATE greetings
     SET ${assignments.join(', ')}
     WHERE id = ?`,
    [...values, id]
  )
}

export const deleteGreetingRecord = async (id) => {
  await database.execute('DELETE FROM greetings WHERE id = ?', [id])
}
