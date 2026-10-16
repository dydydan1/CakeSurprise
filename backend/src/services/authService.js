import { createHash, randomBytes } from 'node:crypto'
import argon2 from 'argon2'
import { env } from '../config/env.js'
import { findAdminByEmail } from '../models/adminModel.js'
import {
  createAdminSession,
  deleteAdminSession,
  deleteExpiredAdminSessions,
  findAdminBySessionToken
} from '../models/adminSessionModel.js'

export const sessionCookieName = 'cake_admin_session'

export const hashSessionToken = (token) => {
  return createHash('sha256').update(token).digest('hex')
}

const sanitizeAdmin = (admin) => ({
  id: admin.id,
  email: admin.email,
  displayName: admin.display_name,
  role: admin.role
})

export const authenticateAdmin = async ({ email, password }) => {
  const admin = await findAdminByEmail(email)

  if (!admin || !admin.is_active) {
    return null
  }

  const passwordMatches = await argon2.verify(admin.password_hash, password)

  if (!passwordMatches) {
    return null
  }

  await deleteExpiredAdminSessions()

  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + env.sessionHours * 60 * 60 * 1000)

  await createAdminSession({
    adminId: admin.id,
    tokenHash: hashSessionToken(token),
    expiresAt
  })

  return {
    admin: sanitizeAdmin(admin),
    token,
    expiresAt
  }
}

export const getAdminFromSession = async (token) => {
  if (!token) {
    return null
  }

  const admin = await findAdminBySessionToken(hashSessionToken(token))
  return admin ? sanitizeAdmin(admin) : null
}

export const revokeAdminSession = async (token) => {
  if (!token) {
    return
  }

  await deleteAdminSession(hashSessionToken(token))
}
