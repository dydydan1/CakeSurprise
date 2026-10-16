import { Router } from 'express'
import { getPublicGreetingHandler } from '../controllers/greetingController.js'

const router = Router()

router.get('/:token', getPublicGreetingHandler)

export default router
