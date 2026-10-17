import { env } from '../config/env.js'
import {
  authenticateAdmin,
  revokeAdminSession,
  sessionCookieName
} from '../services/authService.js'
import { loginSchema } from '../validations/authValidation.js'

export const getSessionCookieOptions = (
  expiresAt,
  isProduction = env.isProduction
) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  expires: expiresAt,
  path: '/'
})

export const login = async (request, response, next) => {
  try {
    const validationResult = loginSchema.safeParse(request.body)

    if (!validationResult.success) {
      return response.status(400).json({
        message: 'Enter a valid email and password'
      })
    }

    const session = await authenticateAdmin(validationResult.data)

    if (!session) {
      return response.status(401).json({
        message: 'Invalid email or password'
      })
    }

    response.cookie(
      sessionCookieName,
      session.token,
      getSessionCookieOptions(session.expiresAt)
    )

    return response.status(200).json({
      admin: session.admin
    })
  } catch (error) {
    return next(error)
  }
}

export const logout = async (request, response, next) => {
  try {
    await revokeAdminSession(request.cookies[sessionCookieName])
    response.clearCookie(sessionCookieName, getSessionCookieOptions(new Date(0)))
    return response.status(204).send()
  } catch (error) {
    return next(error)
  }
}

export const getCurrentAdmin = (request, response) => {
  return response.status(200).json({
    admin: request.admin
  })
}
