import { database } from '../config/database.js'

export const findAdminByEmail = async (email) => {
  const [rows] = await database.execute(
    `SELECT id, email, password_hash, display_name, role, is_active
     FROM admins
     WHERE email = ?
     LIMIT 1`,
    [email]
  )

  return rows[0] || null
}
