import express from 'express'
import { check } from 'express-validator'
import { getMyself, signIn, signUp } from './admin.controller.js'
import { checkAdmin } from '../Middlewares/Admin.js'
import { authSecurity } from '../Middlewares/Auth.js'



const router = express.Router()

router.route('/signup').post(
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password need 8-12 words').isLength({ min: 8, max: 12 })
    ],
    signUp
)

router.route('/signin').post(
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password need 8-12 words').isLength({ min: 8, max: 12 })
    ],
    signIn
)
router.route('/profile').get(authSecurity, checkAdmin, getMyself)


export default router
