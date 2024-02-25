import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { addMessage, clearHistory, createChat, deleteMessage, getChatById, getChats, deleteChat } from './chat.controller.js'
import { check } from 'express-validator'
import { multerConfig } from '../utils/multer.js'


const router = express.Router()

router.route('/:id/create').post(
    multerConfig.single('file'),
    [
        check('text', 'Text is required').optional().notEmpty()
    ],
    authSecurity, createChat
)

router.route('/:id/add-message').post(
    [
        check('text', 'Text is required').notEmpty()
    ],
    authSecurity, addMessage
)

router.route('/').get(authSecurity, getChats)
router.route('/:id').get(authSecurity, getChatById)


router.route('/:id/:messageId/delete-message').post(authSecurity, deleteMessage)
router.route('/:id/clear-history').post(authSecurity, clearHistory)
router.route('/:id').delete(authSecurity, deleteChat)

export default router