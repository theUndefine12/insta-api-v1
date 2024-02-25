import express from 'express'
import { authSecurity } from '../../Middlewares/Auth.js'
import { addLinks, changeStatus, enterThreads, getProfile, getSubscribers, getSubscriptions, getUserById, getUsers, signToThreads, subscribe, unSubscribe, update } from './enter.controller.js'
import { checkThread } from '../../Middlewares/Threads.js'
import { check } from 'express-validator'



const router = express.Router()

router.route('/signup').post(authSecurity, enterThreads)
router.route('/signin').post(authSecurity, signToThreads)

router.route('/profile').get(authSecurity, checkThread, getProfile)
router.route('/').get(getUsers)
router.route('/:id').get(authSecurity, checkThread, getUserById)

router.route('/:id/add-links').post(
    [
        check('links', 'Please add a link').notEmpty().isURL()
    ],
    authSecurity, checkThread, addLinks
)

router.route('/:id/subscribers').get(authSecurity, checkThread, getSubscribers)
router.route('/:id/subscriptions').get(authSecurity, checkThread, getSubscriptions)

router.route('/:id/subscribe').post(authSecurity, checkThread, subscribe)
router.route('/:id/unsubscribe').post(authSecurity, checkThread, unSubscribe)

router.route('/:id').put(authSecurity, checkThread, update)
router.route('/:id/change-status').post(authSecurity, checkThread, changeStatus)


export default router
