import Account from '../Models/Threads/User.js'



export const checkThread = async (req, res, next) => {
    const userId = req.userId

    const isAccount = await Account.findById(userId)
    if (!isAccount) {
        res.status(400).json({ message: 'Please Put Threads Token' })
    }

    next()
}

