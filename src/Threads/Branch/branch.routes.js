import express from 'express'
import { check } from 'express-validator'
import { multerConfig } from '../../utils/multer.js'
import { authSecurity } from '../../Middlewares/Auth.js'
import { addComment, deleteBranch, deleteComment, getBranchById, getBranchs, getComments, getLikes, likeBranch, newBranch, unlikeBranch, updateBranch } from './branch.controller.js'
import { checkThread } from '../../Middlewares/Threads.js'


const router = express.Router()

router.route('/create').post(
    multerConfig.single('content'),
    [
        check('name', 'Name is Required').notEmpty(),
    ],
    authSecurity, checkThread, newBranch
)

router.route('/').get(authSecurity, checkThread, getBranchs)
router.route('/:id').get(authSecurity, checkThread, getBranchById)
router.route('/:id/comments').get(authSecurity, checkThread, getComments)
router.route('/:id/likes').get(authSecurity, checkThread, getLikes)
router.route('/:id/like').post(authSecurity, checkThread, likeBranch)
router.route('/:id/unlike').post(authSecurity, checkThread, unlikeBranch)

router.route('/:id/add-comment').post(
    [
        check('text', 'Text is Required').notEmpty(),
    ],
    authSecurity, checkThread, addComment
)

router.route('/:branchId/:commentId/delete').post(authSecurity, checkThread, deleteComment)

router.route('/:id').put(
    [
        check('name', 'Name is Required').optional().notEmpty(),
    ],
    authSecurity, checkThread, updateBranch
)

router.route('/:id').delete(authSecurity, checkThread, deleteBranch)


export default router