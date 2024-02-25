import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { getSaves } from './saves.controller.js'

const router = express.Router()

router.route('/').get(authSecurity, getSaves)


export default router