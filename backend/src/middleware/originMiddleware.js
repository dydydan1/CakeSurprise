import { env } from '../config/env.js'

export const verifyRequestOrigin = (request, response, next) => {
  const requestOrigin = request.get('origin')

  if (!requestOrigin || requestOrigin !== env.clientOrigin) {
    return response.status(403).json({
      message: 'Request origin is not allowed'
    })
  }

  return next()
}
