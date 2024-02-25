import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Chat from '../Models/Chat.js'
import User from '../Models/User.js'



export const createChat = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { id } = req.params
    const { text } = req.body

    try {

        const first = await User.findById(userId)
        if (!first) {
            res.status(404).json({ message: 'User is not found' })
        }

        const second = await User.findById(id)
        if (!second) {
            res.status(404).json({ message: 'User is not found' })
        }

        const isHave = await Chat.findOne({ first })
        if (isHave) {
            res.status(400).json({ message: 'Chat is Already Created' })
        }

        const chat = new Chat({ first: userId, second: id })
        const message = {
            text: text,
            owner: userId
        }

        chat.messages.push(message)
        await chat.save()

        res.status(200).json({ message: 'Chat is created Successfully', chat })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getChats = asyncHandler(async (req, res) => {
    const userId = req.userId

    const chats = await Chat.find({
        $or: [
            { first: userId },
            { second: userId }
        ]
    }).select('-messages')
    res.status(200).json({ chats })
})


export const getChatById = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const chat = await Chat.findById(id).populate('messages')
        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        let isUserFirst = false
        let isUserSecond = false

        if (chat.first.equals(userId)) {
            isUserFirst = true
        } else if (chat.second.equals(userId)) {
            isUserSecond = true
        }

        if (isUserFirst || isUserSecond) {
            if (isUserFirst) {
                chat.messages.forEach(message => {
                    if (message.owner.equals(chat.second) && !message.viewed) {
                        message.viewed = true
                    }
                })
            } else if (isUserSecond) {
                chat.messages.forEach(message => {
                    if (message.owner.equals(chat.first) && !message.viewed) {
                        message.viewed = true
                    }
                })
            }
        }
        await chat.save()
        res.status(200).json({ chat })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const addMessage = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { id } = req.params
    const { text } = req.body
    const file = req.file ? req.file.path : ''

    try {
        const chat = await Chat.findOne({
            _id: id,
            $or: [
                { first: userId },
                { second: userId }
            ]
        }).populate('messages')

        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        const newMessage = {
            text: text,
            file: file,
            owner: userId
        }

        chat.messages.push(newMessage)
        await chat.save()

        res.status(200).json({ chat })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteMessage = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id, messageId } = req.params

    try {
        const chat = await Chat.findOne({
            _id: id,
            $or: [
                { first: userId },
                { second: userId }
            ]
        }).populate('messages')

        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        const isMessage = chat.messages.findIndex(msg => msg._id.toString() === messageId)
        if (isMessage == -1) {
            res.status(404).json({ message: 'Message is not found' })
        }

        const message = chat.messages[isMessage]

        if (message.owner.toString() == userId) {
            chat.messages.splice(isMessage, 1)
            await chat.save()

            res.status(200).json({ chat })
        }

        res.status(400).json({ message: 'You are have not rights for this' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const clearHistory = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const chat = await Chat.findOne({
            _id: id,
            $or: [
                { first: userId },
                { second: userId }
            ]
        }).populate('messages')

        if (!chat) {
            res.status(404).json({ message: 'Chat is not found' })
        }

        chat.messages = []
        await chat.save()

        res.status(200).json({ chat })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteChat = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const chat = await Chat.findOne({
            _id: id,
            $or: [
                { first: userId },
                { second: userId }
            ]
        })

        const deleteChat = await Chat.findByIdAndDelete(id)
        res.status(200).json({ message: 'Chat is Deleted' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


