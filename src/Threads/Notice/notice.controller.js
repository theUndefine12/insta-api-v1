import asyncHandler from 'express-async-handler'
import Notice from '../../Models/Threads/Notice.js'



export const getNotices = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const notice = await Notice.findOne({ owner: userId })
            .select('count notices')
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found' })
        }

        res.status(200).json({ notice })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

export const clearNotices = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const notice = await Notice.findOne({ owner: userId })
        if (!notice) {
            res.status(404).json({ message: 'notice is not found' })
        }

        notice.notices = []
        notice.count = 0
        await notice.save()

        res.status(200).json({ message: 'notice is clered' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})



