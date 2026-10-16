import { database } from '../config/database.js'

export const createAdminSession = async ({ adminId, tokenHash, expiresAt }) => {
  await database.execute(
    `INSERT INTO admin_sessions (admin_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [adminId, tokenHash, expiresAt]
  )
}

export const findAdminBySessionToken = async (tokenHash) => {
  const [rows] = await database.execute(
    `SELECT
       admins.id,
       admins.email,
       admins.display_name,
       admins.role
     FROM admin_sessions
     INNER JOIN admins ON admins.id = admin_sessions.admin_id
     WHERE admin_sessions.token_hash = ?
       AND admin_sessions.expires_at > UTC_TIMESTAMP()
       AND admins.is_active = TRUE
     LIMIT 1`,
    [tokenHash]
  )

  return rows[0] || null
}

export const deleteAdminSession = async (tokenHash) => {
  await database.execute(
    'DELETE FROM admin_sessions WHERE token_hash = ?',
    [tokenHash]
  )
}

export const deleteExpiredAdminSessions = async () => {
  await database.execute(
    'DELETE FROM admin_sessions WHERE expires_at <= UTC_TIMESTAMP()'
  )
}
