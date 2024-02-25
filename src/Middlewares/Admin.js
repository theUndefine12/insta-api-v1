import Admin from '../Models/Admin.js'

export const checkAdmin = async (req, res, next) => {
    const userId = req.userId
    try {
        const isA = await Admin.findById(userId)

        if (!isA || !isA.admin) {
            return res.status(400).json({ message: 'You are not an Admin' })
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry, there was an error in the middleware' })
    }
}
