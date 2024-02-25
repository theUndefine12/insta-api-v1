import express from 'express'
import { authSecurity } from '../Middlewares/Auth.js'
import { addComment, addtoSaves, createPost, deleteComent, deleteFromSaves, deletePost, getLikes, getPostById, getPosts, likeComment, likePost, unLikePost, unlikeComment, updatePost } from './post.controller.js'
import { check } from 'express-validator'
import { multerConfig } from '../utils/multer.js'


const router = express.Router()

router.route('/create').post(
    multerConfig.single('images'),
    [
        check('hashtags', 'Hashtags is required').notEmpty(),
        check('name', 'Name is required').notEmpty(),
        check('description', 'Description is required').notEmpty()
    ],
    authSecurity, createPost
)

router.route('/:id').put(
    [
        check('name', 'Name is required').optional().notEmpty(),
        check('image', 'Image need be Url').optional().isURL(),
        check('description', 'Description is required').optional().notEmpty(),
    ],
    authSecurity, updatePost
)

router.route('/').get(authSecurity, getPosts)
router.route('/:id').get(authSecurity, getPostById)
router.route('/:id/likes').get(authSecurity, getLikes)
router.route('/:id').delete(authSecurity, deletePost)
router.route('/:id/like').post(authSecurity, likePost)
router.route('/:id/unlike').post(authSecurity, unLikePost)
router.route('/:id/save').post(authSecurity, addtoSaves)
router.route('/:id/unsave').post(authSecurity, deleteFromSaves)
router.route('/:id/comment').post(
    [
        check('text', 'Text is required').notEmpty()
    ]
    , authSecurity, addComment
)

router.route('/:postId/:commentId/delete-comment').post(authSecurity, deleteComent)
router.route('/:postId/:commentId/like').post(authSecurity, likeComment)
router.route('/:postId/:commentId/unlike').post(authSecurity, unlikeComment)


export default router
