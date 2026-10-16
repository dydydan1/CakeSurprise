import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { getPublicGreetingHandler } from '../controllers/greetingController.js'

const router = Router()

const publicGreetingRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many greeting requests. Try again shortly.'
  }
})

router.use(publicGreetingRateLimit)
router.get('/:token', getPublicGreetingHandler)

export default router
