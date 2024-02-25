import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../Models/User.js'
import Post from '../Models/Post.js'
import Saves from '../Models/Saves.js'
import Favorites from '../Models/Favorites.js'
import Hashtag from '../Models/Hashtag.js'
import Notification from '../Models/Notification.js'


export const createPost = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { name, description, hashtags } = req.body
    const images = req.file ? req.file.path : ''

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User is not found' })
        }

        const hashtagArray = hashtags.split(',')
        const postHashtags = []
        let post

        for (const hashtagTitle of hashtagArray) {
            let isHashtag = await Hashtag.findOne({ title: hashtagTitle })

            if (!isHashtag) {
                isHashtag = new Hashtag({ title: hashtagTitle })
            }
            await isHashtag.save()
            postHashtags.push(isHashtag.id)
        }

        post = new Post({
            name,
            images,
            description,
            owner: userId,
            hashtags: postHashtags,
        })

        for (const hashtagId of postHashtags) {
            let isHashtag = await Hashtag.findById(hashtagId)
            if (isHashtag) {
                isHashtag.postCount += 1
                isHashtag.posts.push(post.id)

                await isHashtag.save()
            }
        }

        user.postsCount += 1
        user.posts.push(post.id)

        await user.save()
        await post.save()

        res.status(200).json({ message: 'Post is created Successfully', post })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Sorry, Error in Server' })
    }
})


export const updatePost = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({ message: 'Post is not found' })
        }

        if (post.owner == userId) {
            const updated = await Post
                .findByIdAndUpdate(id, { $set: req.body }, { new: true })

            res.status(200).json({ message: 'Post is Updated', updated })
        }

        res.status(400).json({ message: 'You have not rights for update' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().select('images')
    res.status(200).json({ posts })
})


export const getPostById = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const isPost = await Post.findById(id)
        if (!isPost) {
            res.status(404).json({ message: 'Post is not found' })
        }

        if (!isPost.viewsBy.includes(userId)) {
            isPost.views += 1
            isPost.viewsBy.push(userId)

            await isPost.save()
        }

        const post = await Post.findById(id)
            .populate({
                path: 'comments',
                select: 'text owner',
                populate: { path: 'owner', select: 'username' }
            })
            .select('-viewsBy -likesBy')

        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const likePost = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const favorites = await Favorites.findOne({ owner: userId })
        if (!favorites) {
            res.status(404).json({ message: 'Favorites is not found' })
        }

        const isPost = await Post.findById(id)
        if (!isPost) {
            res.status(404).json({ message: 'Post is not found' })
        }

        const notification = await Notification.findOne({ owner: isPost.owner })
        if (!notification) {
            res.status(404).json({ message: 'Notification is not found' })
        }

        if (!isPost.likesBy.includes(userId)) {
            isPost.likes += 1
            isPost.likesBy.push(userId)

            favorites.count += 1
            favorites.posts.push(id)

            const newM = await User.findById(userId)
                .select('username image isHistory')

            notification.count += 1
            notification.notifications.push(newM, 'Is Liked Your Post')

            await notification.save()
            await isPost.save()
            await favorites.save()
        }

        const post = await Post.findById(id)
            .select('-viewsBy -likesBy').populate('comments')

        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Eror in Server' })
    }
})


export const unLikePost = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const isPost = await Post.findById(id)
        if (!isPost) {
            res.status(404).json({ message: 'Post is not found' })
        }

        const favorites = await Favorites.findOne({ owner: userId })
        if (!favorites) {
            res.status(404).json({ message: 'Favorites is not found' })
        }

        const indexOfFavorite = favorites.posts.indexOf(id)
        const indexOfLike = isPost.likesBy.indexOf(userId)

        if (indexOfLike !== -1 && indexOfFavorite !== -1) {
            isPost.likes -= 1
            isPost.likesBy.splice(indexOfLike, 1)

            favorites.count -= 1
            favorites.posts.splice(indexOfFavorite, 1)

            await favorites.save()
            await isPost.save()
        }

        const post = await Post.findById(id)
            .select('-viewsBy -likesBy').populate('comments')

        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Eror in Server' })
    }
})


export const getLikes = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const post = await Post.findById(id)
            .populate({ path: 'likesBy', select: 'username image' })
            .select('likesBy')
        if (!post) {
            res.status(404).json({ message: 'Post is not found' })
        }

        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Eror in Server' })
    }
})


export const addtoSaves = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const saves = await Saves.findOne({ owner: userId })
        if (!saves) {
            res.status(404).json({ message: 'Saves is not found' })
        }

        const isPost = await Post.findById(id)
        if (!isPost) {
            res.status(404).json({ message: 'Post is not found' })
        }

        if (!saves.posts.includes(id)) {
            saves.count += 1
            saves.posts.push(id)

            await saves.save()
        }

        const post = await Post.findById(id)
            .select('-viewsBy -likesBy').populate('comments')

        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Eror in Server' })
    }
})


export const deleteFromSaves = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const saves = await Saves.findOne({ owner: userId })
        if (!saves) {
            res.status(404).json({ message: 'Saves is not found' })
        }

        const isPost = await Post.findById(id)
        if (!isPost) {
            res.status(404).json({ message: 'Post is not found' })
        }

        const indexOfPost = saves.posts.indexOf(id)
        if (indexOfPost !== -1) {
            saves.count -= 1
            saves.posts.splice(indexOfPost, 1)

            await saves.save()

            const post = await Post.findById(id)
                .select('-viewsBy -likesBy').populate('comments')

            res.status(200).json({ post })
        }

        res.status(400).json({ message: 'Post is already deleted from Saves' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Eror in Server' })
    }
})


export const addComment = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { id } = req.params
    const { text } = req.body

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const post = await Post.findById(id).select('-viewsBy -likesBy').populate('comments')
        if (!post) {
            res.status(404).json({ message: 'Post is not found' })
        }

        const newComment = {
            text: text,
            owner: userId
        }
        post.commentsCount += 1
        post.comments.push(newComment)

        await post.save()
        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Eror in Server' })
    }
})


export const deleteComent = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { postId, commentId } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const post = await Post.findById(postId)
            .select('-viewsBy -likesBy').populate('comments')
        if (!post) {
            res.status(404).json({ message: 'Post not found' })
        }

        const comment = post.comments.id(commentId)
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' })
        }

        if (comment.owner.toString() !== userId) {
            res.status(400).json({ message: 'You have not rights for delete this comment' })
        }

        comment.remove()
        post.commentsCount -= 1

        await post.save()
        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Errorin Server' })
    }
})


export const likeComment = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { postId, commentId } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const post = await Post.findById(postId)
            .select('-viewsBy -likesBy').populate('comments')
        if (!post) {
            res.status(404).json({ message: 'Post not found' })
        }

        const comment = post.comments.id(commentId)
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' })
        }

        if (!comment.likesBy.includes(userId)) {
            comment.likes += 1
            comment.likesBy.push(userId)

            await post.save()
        }

        res.status(200).json({ post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Errorin Server' });
    }
})


export const unlikeComment = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { postId, commentId } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const post = await Post.findById(postId).select('-viewsBy -likesBy').populate('comments')
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const indexOfLike = comment.likesBy.indexOf(userId)
        if (indexOfLike !== -1) {
            comment.likes -= 1
            comment.likesBy.splice(indexOfLike, 1)

            await post.save()
            res.status(200).json({ post })
        }

        res.status(400).json({ message: 'Comment is not liked' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Errorin Server' });
    }
})


export const deletePost = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const post = await Post.findById(id)
        if (!post) {
            res.status(404).json({ message: 'Post is not found' })
        }

        const isOwner = post.owner.toString() === userId
        const postIndex = user.posts.indexOf(id)

        if (isOwner) {
            for (const hashtagId of post.hashtags) {
                const hashtag = await Hashtag.findById(hashtagId)
                if (hashtag) {
                    hashtag.postCount -= 1
                    hashtag.posts.pull(id)

                    await hashtag.save()
                }
            }
            user.postsCount -= 1
            user.posts.splice(postIndex, 1)

            await user.save()
            const deleted = await Post.findByIdAndDelete(id)
            res.status(200).json({ message: 'Post is Deleted Successfully :' })
        }

        res.status(400).json({ message: 'You are have not right for this' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})
