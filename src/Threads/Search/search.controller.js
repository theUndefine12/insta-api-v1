import asyncHandler from 'express-async-handler'
import Account from '../../Models/Threads/User.js'


export const searchUser = asyncHandler(async (req, res) => {
    const { username } = req.query

    try {
        const users = await Account.find({ username: { $regex: new RegExp(username, 'i') } })
            .select('username image')

        res.status(200).json({ users })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
