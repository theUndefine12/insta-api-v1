import asyncHandler from 'express-async-handler'
import Saves from '../Models/Saves.js'



export const getSaves = asyncHandler(async (req, res) => {
    const userId = req.userId

    const saves = await Saves.findOne({ owner: userId })
        .populate({ path: 'posts', select: 'images' }).select('count posts')
    if (!saves) {
        res.status(404).json({ message: 'Saves is not Found' })
    }

    res.status(200).json({ saves })
})

