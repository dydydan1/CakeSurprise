import { getAdminFromSession, sessionCookieName } from '../services/authService.js'

export const requireAdminAuth = async (request, response, next) => {
  try {
    const admin = await getAdminFromSession(request.cookies[sessionCookieName])

    if (!admin) {
      return response.status(401).json({
        message: 'Authentication required'
      })
    }

    request.admin = admin
    return next()
  } catch (error) {
    return next(error)
  }
}
