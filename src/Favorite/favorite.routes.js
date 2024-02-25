import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { getFavorites } from './favorite.controller.js'


const router = express.Router()

router.route('/').get(authSecurity, getFavorites)


export default router