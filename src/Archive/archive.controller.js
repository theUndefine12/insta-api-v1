import asyncHandler from 'express-async-handler'
import Archive from '../Models/Archive.js'
import User from '../Models/User.js'


export const getArchive = asyncHandler(async (req, res) => {
    const userId = req.userId


    const user = await User.findById(userId)
    if (!user) {
        res.status(404).json({ message: 'User is not found' })
    }

    const archive = await Archive.findOne({ owner: userId })
        .populate({ path: 'histories', select: 'content' })
    if (!archive) {
        res.status(404).json({ message: 'Archive is not found' })
    }
    res.status(200).json({ archive })
})

