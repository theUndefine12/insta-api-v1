import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Admin from '../Models/Admin.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/token.js'



export const signUp = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { username, password } = req.body

    try {
        const isHave = await Admin.findOne({ username })
        if (isHave) {
            res.status(400).json({ message: 'Admin is already exist' })
        }

        const hash = bcrypt.hashSync(password, 7)
        const admin = new Admin({ username, password: hash })

        const token = generateToken(admin.id)

        await admin.save()
        res.status(200).json({ message: 'Admin is created Successfully', token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const signIn = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { username, password } = req.body

    try {
        const admin = await Admin.findOne({ username })
        if (!admin) {
            res.status(404).json({ message: 'Admin is not found' })
        }

        const isPassword = bcrypt.compareSync(password, admin.password)
        if (!isPassword) {
            res.status(400).json({ message: 'Password is not found' })
        }

        const token = generateToken(admin.id)
        res.status(200).json({ message: 'Welcome Admin', token })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getMyself = asyncHandler(async (req, res) => {
    const userId = req.userId

    try {
        const me = await Admin.findById(userId).select('-password')
        if (!me) {
            res.status(404).json({ message: 'Admin is not found' })
        }

        res.status(200).json({ me })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

