import express from 'express'
import { multerConfig } from '../utils/multer.js'
import { check } from 'express-validator'
import { authSecurity } from '../Middlewares/Auth.js'
import { createHistory, deleteHistory, getInformation } from './history.controller.js'


const router = express.Router()

router.route('/create').post(
    multerConfig.single('content'),
    [
        check('name', 'Name is required').notEmpty(),
    ],
    authSecurity, createHistory
)

router.route('/:id/info').get(authSecurity, getInformation)
router.route('/:id').delete(authSecurity, deleteHistory)


export default router
