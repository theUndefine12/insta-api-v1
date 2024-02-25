import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { clearNotifications, getNotifications } from './not.controller.js'



const router = express.Router()

router.route('/').get(authSecurity, getNotifications)
router.route('/clear').post(authSecurity, clearNotifications)


export default router