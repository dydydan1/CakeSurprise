import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { getCurrentAdmin, login, logout } from '../controllers/authController.js'
import { requireAdminAuth } from '../middleware/authMiddleware.js'
import { verifyRequestOrigin } from '../middleware/originMiddleware.js'

const router = Router()

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Try again later.'
  }
})

router.post('/login', verifyRequestOrigin, loginRateLimit, login)
router.post('/logout', verifyRequestOrigin, logout)
router.get('/me', requireAdminAuth, getCurrentAdmin)

export default router
