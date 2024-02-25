import express from 'express'
import { authSecurity } from '../../Middlewares/Auth.js'
import { checkThread } from '../../Middlewares/Threads.js'
import { clearNotices, getNotices } from './notice.controller.js'



const router = express.Router()

router.route('/').get(authSecurity, checkThread, getNotices)
router.route('/clear').post(authSecurity, checkThread, clearNotices)


export default router