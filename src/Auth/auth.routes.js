import express from 'express'
import { check } from 'express-validator'
import {
    authLogin, authRegister, getProfile, getSubscribers, getUserById
    , subscribe, unsubscribe, updateUser, getUsers, getSubscriptions, changeStatus, watchHistory, likeHistory, unLike
} from './auth.controller.js'
import { authSecurity } from '../Middlewares/Auth.js'
import { multerConfig } from '../utils/multer.js'


const router = express.Router()

router.route('/signup').post(
    multerConfig.single('image'),
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password is need be min 8').isLength({ min: 8 }),
        check('aboutMe', 'AboutMe is required').notEmpty(),
        check('gender', 'Male or Female').notEmpty(),
    ],
    authRegister
)
router.route('/signin').post(
    [
        check('username', 'Username is required').notEmpty(),
        check('password', 'Password is required').isLength({ min: 8 }),
    ],
    authLogin
)
router.route('/:id').put(
    multerConfig.single('image'),
    [
        check('username', 'Username is required').optional().notEmpty(),
        check('password', 'Password is need be min 8').optional().isLength({ min: 8 }),
        check('aboutMe', 'AboutMe is required').optional().notEmpty(),
        check('gender', 'Gender is required').optional().notEmpty()
    ],
    authSecurity, updateUser
)


router.route('/profile').get(authSecurity, getProfile)
router.route('/').get(getUsers)
router.route('/:id/histories/:id').get(authSecurity, watchHistory)

router.route('/:id/histories/:id/like').post(authSecurity, likeHistory)
router.route('/:id/histories/:id/unlike').post(authSecurity, unLike)

router.route('/:id/subscribers').get(authSecurity, getSubscribers)
router.route('/:id/subscriptions').get(authSecurity, getSubscriptions)

router.route('/:id').get(authSecurity, getUserById)
router.route('/id').get()
router.route('/:id/subscribe').post(authSecurity, subscribe)
router.route('/:id/unsubscribe').post(authSecurity, unsubscribe)

router.route('/:id/change-status').post(authSecurity, changeStatus)



export default router