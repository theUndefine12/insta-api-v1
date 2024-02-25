import express from 'express'
import { authSecurity } from '../../Middlewares/Auth.js'
import { searchUser } from './search.controller.js'
import { checkThread } from '../../Middlewares/Threads.js'


const router = express.Router()

router.route('/').get(authSecurity, checkThread, searchUser)


export default router
