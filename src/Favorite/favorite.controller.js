import asyncHandler from 'express-async-handler'
import Favorites from '../Models/Favorites.js'



export const getFavorites = asyncHandler(async (req, res) => {
    const userId = req.userId

    const favorites = await Favorites.findOne({ owner: userId })
        .populate({ path: 'posts', select: 'images' }).select('count posts')
    if (!favorites) {
        res.status(404).json({ message: 'Favorites is not Found' })
    }

    res.status(200).json({ favorites })
})
