import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../Models/User.js'
import History from '../Models/History.js'
import Archive from '../Models/Archive.js'



export const createHistory = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { name } = req.body
    const content = req.file ? req.file.path : ''

    try {
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const archive = await Archive.findOne({ owner: userId })
        if (!archive) {
            res.status(404).json({ message: 'Archive is not found' })
        }

        const history = new History({ name, content, owner: userId })
        user.isHistory = true
        user.histories.push(history.id)
        archive.histories.push(history.id)

        await archive.save()
        await history.save()
        await user.save()

        res.status(200).json({ message: 'History is created Successfully', history })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getInformation = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const history = await History.findById(id)
            .populate({ path: 'likes', select: 'username image isHistory' })
            .populate({ path: 'views', select: 'username image isHistory' })
        if (!history) {
            res.status(404).json({ message: 'History is not found' })
        }

        const isOwner = history.owner.toString() === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You have nor right for this' })
        }

        res.status(200).json({ history })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteHistory = asyncHandler(async (req, res) => {
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

        const isOwner = history.owner.toString() === userId
        if (!isOwner) {
            res.status(400).json({ message: 'You are have not right' })
        }

        const deleted = await History.findByIdAndDelete(id)
        const historyIndex = user.histories.indexOf(id)

        user.isHistory = false
        user.histories.splice(historyIndex, 1)

        await user.save()
        res.status(200).json({ message: 'History is delted' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

