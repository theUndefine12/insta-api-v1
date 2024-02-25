import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../Models/User.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/token.js'
import Saves from '../Models/Saves.js'
import Favorites from '../Models/Favorites.js'
import Archive from '../Models/Archive.js'
import History from '../Models/History.js'
import Notification from '../Models/Notification.js'



export const authRegister = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { username, password, aboutMe, gender } = req.body
    const image = req.file ? req.file.path : ''

    try {
        const isHave = await User.findOne({ username })
        if (isHave) {
            res.status(400).json({ message: 'Username is Busy' })
        }
        const hash = bcrypt.hashSync(password, 7)
        const user = new User({ username, image, password: hash, aboutMe, gender })

        await user.save()
        const token = generateToken(user.id)

        const saves = new Saves({ owner: user.id })
        await saves.save()

        const favorites = new Favorites({ owner: user.id })
        await favorites.save()

        const archive = new Archive({ owner: user.id })
        await archive.save()

        const notification = new Notification({ owner: user.id })
        await notification.save()

        res.status(200).json({ message: 'User is Saved Successfully', token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const authLogin = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const truePassword = bcrypt.compareSync(password, user.password)
        if (!truePassword) {
            res.status(400).json({ message: 'Password is not Correct' })
        }

        const token = generateToken(user.id)
        res.status(200).json({ message: 'User is Signed', token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const updateUser = asyncHandler(async (req, res) => {
    const userId = req.userId

    const updateUser = await User.findByIdAndUpdate(userId, { $set: req.body || req.file }, { new: true })
    if (!updateUser) {
        res.status(400).json({ message: 'Please check your request' })
    }
    res.status(200).json({ updateUser })
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId

    const profile = await User.findById(userId)
        .select('-password -subscription -subscribers')
        .populate({ path: 'posts', select: 'images' })
    if (!profile) {
        res.status(404).json({ message: 'Progfile is not Found' })
    }

    res.status(200).json({ profile })
})


export const getUserById = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const isUser = await User.findById(id)
        if (!isUser) {
            res.status(404).json({ message: 'user is not found' })
        }

        const user = await User.findById(id)
            .select('-password -histories -subscription -subscribers')
            .populate({ path: 'posts', select: 'images' })

        const isClosed = await User.findById(id)
            .select('-password -histories -subscription -subscribers -posts')

        if (isUser.status === 'Public') {
            res.status(200).json({ user })
        }

        const isSubscribed = isUser.subscribers.includes(userId)
        if (isUser.status === 'Closed' && isSubscribed) {
            res.status(200).json({ user })
        }

        res.status(200).json({ isClosed, message: 'For view posts need be subscribe' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getSubscriptions = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(id)
        if (!user) {
            res.status(200).json({ message: 'User is not found' })
        }

        const subscribtion = await User.findById(id).populate({
            path: 'subscription',
            select: 'username image'
        }).select('subscription')
        if (!subscribtion) {
            res.status(404).json({ message: 'Subscriptions is not found' })
        }

        const isSubscribed = user.subscribers.includes(userId)
        if (user.status === 'Public') {
            res.status(200).json({ subscribtion })
        }

        if (user.status === 'Closed' && isSubscribed) {
            res.status(200).json({ subscribtion })
        }

        res.status(200).json({ message: 'Need be Subscribe' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getSubscribers = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(id)
        if (!user) {
            res.status(200).json({ message: 'User is not found' })
        }

        const followers = await User.findById(id).populate({
            path: 'subscribers',
            select: 'username image'
        }).select('subscribers')
        if (!followers) {
            res.status(404).json({ message: 'Followers is not found' })
        }

        const isSubscribed = user.subscribers.includes(userId)
        if (user.status === 'Public') {
            res.status(200).json({ followers })
        }

        if (user.status === 'Closed' && isSubscribed) {
            res.status(200).json({ followers })
        }

        res.status(200).json({ message: 'Need be Subscribe' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('username postsCount subscribersCount subscriptionCount')
    res.status(200).json({ users })
})


export const subscribe = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req.userId

    try {
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const notification = await Notification.findOne({ owner: id })
        if (!notification) {
            res.status(404).json({ message: 'Notification is not found' })
        }

        const follower = await User.findById(userId).populate('subscription')
        if (!follower) {
            res.status(404).json({ message: 'User is not found' })
        }

        if (!user.subscribers.includes(userId) && !follower.subscription.includes(id)) {
            user.subscribersCount += 1
            user.subscribers.push(userId)

            follower.subscriptionCount += 1
            follower.subscription.push(id)

            const newM = await User.findById(userId)
                .select('username image isHistory')

            notification.count += 1
            notification.notifications.push(newM, 'Is Subscribed')

            await notification.save()
            await user.save()
            await follower.save()

            const info = await User.findById(id)
                .select('-password -subscription -subscribers')
                .populate({ path: 'posts', select: 'images' })

            res.status(200).json({ info })
        }

        res.status(400).json({ message: 'User is Subscribed Already' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const unsubscribe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const user = await User.findById(id).populate('subscribers');
        const unfollower = await User.findById(userId).populate('subscription');

        if (!user || !unfollower) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isSubscribed = user.subscribers.some(subscriber => subscriber._id.toString() === userId)
        const isSubscriptionExists = unfollower.subscription.some(subscription => subscription._id.toString() === id)

        if (isSubscribed && isSubscriptionExists) {
            user.subscribersCount -= 1
            unfollower.subscriptionCount -= 1

            user.subscribers = user.subscribers.filter(subscriber => subscriber._id.toString() !== userId)
            unfollower.subscription = unfollower.subscription.filter(subscription => subscription._id.toString() !== id)

            await user.save()
            await unfollower.save()

            const info = await User.findById(id).select('-password -subscription -subscribers')

            return res.status(200).json({ info })
        }

        return res.status(400).json({ message: 'User is not subscribed' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Sorry, there was an error in the server' })
    }
})


export const changeStatus = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(id).populate('subscribers')
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        if (userId !== user.id) {
            res.status(400).json({ message: 'You are have not rights' })
        }

        if (user.status === 'Public') {
            user.status = 'Closed'
        } else if (user.status === 'Closed') {
            user.status = 'Public'
        } else {
            return res.status(400).json({ message: 'Please check a request' });
        }

        await user.save()
        res.status(200).json({ message: 'Status is changed' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const watchHistory = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const history = await History.findById(id)
        if (!history) {
            res.status(404).json({ message: 'History is not found' })
        }

        const isWatched = history.views.includes(userId)
        if (!isWatched) {
            history.viewsCount += 1
            history.views.push(userId)

            await history.save()
        }
        const viewed = await History.findById(id)
            .select('name content owner')

        res.status(200).json({ viewed })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const likeHistory = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }


        const history = await History.findById(id)
        if (!history) {
            res.status(404).json({ message: 'History is not found' })
        }

        const notification = await Notification.findOne({ owner: history.owner })
        if (!notification) {
            res.status(404).json({ message: 'Notification is not found' })
        }

        const isLiked = history.likes.includes(userId)
        if (!isLiked) {
            history.likesCount += 1
            history.likes.push(userId)

            await history.save()
        }

        const newM = await User.findById(userId)
            .select('username image isHistory')

        notification.count += 1
        notification.notifications.push(newM, 'Is Liked Your History')

        await notification.save()
        const viewed = await History.findById(id)
            .select('name content owner')

        res.status(200).json({ viewed })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const unLike = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const history = await History.findById(id)
        if (!history) {
            res.status(404).json({ message: 'History is not found' })
        }

        const isLiked = history.likes.indexOf(userId)
        if (isLiked !== -1) {
            history.likesCount -= 1
            history.likes.splice(isLiked, 1)

            await history.save()
        }

        const viewed = await History.findById(id)
            .select('name content owner')

        res.status(200).json({ viewed })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})
