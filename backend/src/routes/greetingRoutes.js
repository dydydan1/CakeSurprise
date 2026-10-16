import { Router } from 'express'
import {
  createGreetingHandler,
  generateGreetingQrHandler,
  getGreetingHandler,
  listGreetingsHandler,
  updateGreetingHandler
} from '../controllers/greetingController.js'
import { requireAdminAuth } from '../middleware/authMiddleware.js'
import { verifyRequestOrigin } from '../middleware/originMiddleware.js'

const router = Router()

router.use(requireAdminAuth)

router.get('/', listGreetingsHandler)
router.get('/:id', getGreetingHandler)
router.post('/', verifyRequestOrigin, createGreetingHandler)
router.post('/:id/qr', verifyRequestOrigin, generateGreetingQrHandler)
router.patch('/:id', verifyRequestOrigin, updateGreetingHandler)

export default router
