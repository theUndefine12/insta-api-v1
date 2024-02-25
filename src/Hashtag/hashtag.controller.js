import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Hashtag from '../Models/Hashtag.js'



export const createHashtag = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const { title } = req.body

    try {
        const isHave = await Hashtag.findOne({ title })
        if (isHave) {
            res.status(400).json({ message: 'Hashtag is already created' })
        }

        const hashtag = new Hashtag({ title })
        await hashtag.save()

        res.status(200).json({ message: 'Hashtag is created Successfully', hashtag })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Sorry in Server' })
    }
})


export const getAll = asyncHandler(async (req, res) => {
    const hashtags = await Hashtag.find().select('-posts')
    res.status(200).json({ hashtags })
})


export const getOne = asyncHandler(async (req, res) => {
    const { id } = req.params

    const hashtag = await Hashtag.findById(id).populate({ path: 'posts', select: 'images' })
    if (!hashtag) {
        res.status(400).json({ message: 'Hashtag is not found' })
    }
    res.status(200).json({ hashtag })
})


export const deleteHashtag = asyncHandler(async (req, res) => {
    const { id } = req.params

    const hashtag = await Hashtag.findById(id)
    if (!hashtag) {
        res.status(400).json({ message: 'Hashtag is not found' })
    }

    const deleted = await Hashtag.findByIdAndDelete(id)
    res.status(200).json({ message: 'Hashtag is deleted' })
})
