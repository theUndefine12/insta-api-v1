import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { seacrhHashtag, searchUser } from './search.controller.js'


const router = express.Router()

router.route('/user').get(authSecurity, searchUser)
router.route('/hashtag').get(authSecurity, seacrhHashtag)


export default router