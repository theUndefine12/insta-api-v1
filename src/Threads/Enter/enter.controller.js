import asyncHandler from 'express-async-handler'
import Account from '../../Models/Threads/User.js'
import User from '../../Models/User.js'
import { generateToken } from '../../utils/token.js'
import { validationResult } from 'express-validator'
import Notice from '../../Models/Threads/Notice.js'



export const enterThreads = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const isHave = await Account.findOne({ username: user.username })
        if (isHave) {
            res.status(400).json({ message: 'Account is exist' })
        }

        const account = new Account({
            username: user.username,
            image: user.image,
            bio: user.aboutMe,
            status: user.status,
        })

        user.threads = account.id
        account.instagram = user.id

        const notice = new Notice({ owner: account.id })
        await notice.save()

        await user.save()
        await account.save()

        const token = generateToken(account.id)
        res.status(200).json({ message: 'Account is Saved', token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const signToThreads = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }
        const isUsername = user.username

        const account = await Account.findOne({ username: isUsername })
        if (!account) {
            res.status(400).json({ message: 'Account is exite' })
        }

        const token = generateToken(account.id)
        res.status(200).json({ message: 'Account is Entered', token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const user = await Account.findById(userId)
            .populate('branch')
            .select('-subscription -subscribers')
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const getUsers = asyncHandler(async (req, res) => {
    const users = await Account.find()
    res.status(200).json({ users })
})


export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const user = await Account.findById(id)
            .populate('branch').select('-subscription -subscribers')
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const getSubscribers = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const subscribers = await Account.findById(id)
            .populate('subscribers').select('subscribersCount subscribers')
        if (!subscribers) {
            res.status(404).json({ message: 'User is not found' })
        }

        res.status(200).json({ subscribers })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const getSubscriptions = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const subscriptions = await Account.findById(id)
            .populate('subscribers').select('subscriptionsCount subscriptions')
        if (!subscriptions) {
            res.status(404).json({ message: 'User is not found' })
        }

        res.status(200).json({ subscriptions })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const subscribe = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await Account.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const follow = await Account.findById(id)
        if (!follow) {
            res.status(404).json({ message: 'Follow is not found' })
        }

        const notice = await Notice.findOne({ owner: id })
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found' })
        }

        const isSubscribe = follow.subscribers.includes(userId)
        if (!isSubscribe) {

            follow.subscribersCount += 1
            follow.subscribers.push(userId)

            user.subscriptionCount += 1
            user.subscription.push(id)

            const newM = await Account.findById(userId)
                .select('username image')

            notice.count += 1
            notice.notices.push(newM, 'Is Subscribed')

            await notice.save()
            await follow.save()
            await user.save()

            res.status(200).json({ follow })
        }

        res.status(400).json({ message: 'User is already subscribe' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const unSubscribe = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await Account.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const unFollow = await Account.findById(id)
        if (!unFollow) {
            res.status(404).json({ message: 'unFollow is not found' })
        }

        const isSubscribe = unFollow.subscribers.indexOf(userId)
        const isSubscription = user.subscription.indexOf(id)

        if (isSubscribe !== -1 && isSubscription !== -1) {
            unFollow.subscribersCount -= 1
            unFollow.subscribers.splice(isSubscribe, 1)

            user.subscriptionCount -= 1
            user.subscription.splice(isSubscription, 1)

            await unFollow.save()
            await user.save()

            res.status(200).json({ unFollow })
        }

        res.status(400).json({ message: 'User is not subscribe' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const update = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await Account.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        if (userId !== user.id) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        const updated = await Account.findByIdAndUpdate(id,
            { $set: req.body },
            { new: true }
        ).select('-subscribers -subscriptions').populate('branch')

        res.status(200).json({ updated })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const addLinks = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { id } = req.params
    const { links } = req.body

    try {
        const user = await Account.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        if (userId !== user.id) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        user.links.push(links)
        await user.save()

        res.status(200).json({ message: 'Link is Added', links })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})


export const changeStatus = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await Account.findById(id)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        if (userId !== user.id) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        if (user.status === 'Public') {
            user.status = 'Closed'
        } else if (user.status === 'Closed') {
            user.status = 'Public'
        } else {
            res.status(400).json({ message: 'Please check your request' })
        }

        await user.save()
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server ' })
    }
})

