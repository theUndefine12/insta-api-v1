import asyncHandler from 'express-async-handler'
import Notification from '../Models/Notification.js'



export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {

        const notification = await Notification.findOne({ owner: userId })
            .populate('notifications').select('count notifications')
        if (!notification) {
            res.status(404).json({ message: 'Notification is  not found' })
        }

        res.status(200).json({ notification })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const clearNotifications = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const notification = await Notification.findOne({ owner: userId })
        if (!notification) {
            res.status(404).json({ message: 'Notification is not found' })
        }

        notification.notifications = []
        notification.count = 0
        await notification.save()

        res.status(200).json({ message: 'Notifications is clered' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

