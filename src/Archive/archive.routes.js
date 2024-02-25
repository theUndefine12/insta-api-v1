import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { getArchive } from './archive.controller.js'



const router = express.Router()

router.route('/').get(authSecurity, getArchive)


export default router
