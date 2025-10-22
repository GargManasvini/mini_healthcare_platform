import {Router} from 'express'
import { getHealthHistory, submitHealth } from '../controller/health.controller.js'
import {protect} from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', protect, submitHealth)
router.get('/history', protect, getHealthHistory)

export default router