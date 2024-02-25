import asyncHandler from 'express-async-handler'
import User from '../Models/User.js'
import Hashtag from '../Models/Hashtag.js'



export const searchUser = asyncHandler(async (req, res) => {
    const { username } = req.query

    try {
        const users = await User.find({ username: { $regex: new RegExp(username, 'i') } })
            .select('username image')

        res.status(200).json({ users })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})


export const seacrhHashtag = asyncHandler(async (req, res) => {
    const { hashtag } = req.query

    try {
        const findHashtag = await Hashtag.find({ title: new RegExp(hashtag, 'i') })
            .populate({ path: 'posts', select: 'images' })

        res.status(200).json({ findHashtag })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

