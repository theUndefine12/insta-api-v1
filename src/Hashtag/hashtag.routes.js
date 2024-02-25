import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { checkAdmin } from '../Middlewares/Admin.js'
import { createHashtag, deleteHashtag, getAll, getOne } from './hashtag.controller.js'
import { check } from 'express-validator'



const router = express.Router()

router.route('/create').post(
    [
        check('title', 'Title is required').notEmpty()
    ],
    authSecurity, checkAdmin, createHashtag
)

router.route('/').get(authSecurity, getAll)
router.route('/:id').get(authSecurity, getOne)
router.route('/:id').delete(authSecurity, checkAdmin, deleteHashtag)


export default router