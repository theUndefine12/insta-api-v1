import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Account from '../../Models/Threads/User.js'
import Branch from '../../Models/Threads/Branch.js'
import Notice from '../../Models/Threads/Notice.js'


export const newBranch = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { name } = req.body
    const content = req.file ? req.file.path : ''

    try {
        const account = await Account.findById(userId)
        if (!account) {
            res.status(404).json({ message: 'Account is not Found' })
        }

        const branch = new Branch({ name, content, owner: userId })
        await branch.save()

        account.branchCount += 1
        account.branch.push(branch.id)

        await account.save()
        res.status(200).json({ message: 'Branch is saved', branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getBranchs = asyncHandler(async (req, res) => {
    const branchs = await Branch.find()
        .select('-comments -views -likes')

    res.status(200).json({ branchs })
})


export const getBranchById = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const isBranch = await Branch.findById(id)
        if (!isBranch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        if (isBranch.views.includes(userId)) {
            isBranch.viewsCount += 1
            isBranch.views.push(userId)

            await isBranch.save()
        }

        const branch = await Branch.findById(id)
            .select('-comments -views -likes')
        res.status(200).json({ branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const likeBranch = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const user = await Account.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User is not found' })
        }

        const isBranch = await Branch.findById(id)
        if (!isBranch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        const notice = await Notice.findOne({ owner: isBranch.owner })
        if (!notice) {
            res.status(404).json({ message: 'Notice is not found' })
        }

        if (!isBranch.likes.includes(userId)) {
            isBranch.likesCount += 1
            isBranch.likes.push(userId)

            await isBranch.save()
        }

        const newM = await Account.findById(userId)
            .select('username image')

        notice.count += 1
        notice.notices.push(newM, 'Is Liked Your Branch')

        await notice.save()

        const branch = await Branch.findById(id)
            .select('-comments -views -likes')
        res.status(200).json({ branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const unlikeBranch = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const isBranch = await Branch.findById(id)
        if (!isBranch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        const isLiked = isBranch.likes.indexOf(userId)
        if (isLiked !== -1) {
            isBranch.likesCount -= 1
            isBranch.likes.splice(isLiked, 1)

            await isBranch.save()

            const branch = await Branch.findById(id)
                .select('-comments -views -likes')
            res.status(200).json({ branch })
        }

        res.status(404).json({ message: 'Branch is not Liked' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const updateBranch = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { id } = req.params

    try {
        const branch = await Branch.findById(id)
            .select('-comments -views -likes')
        if (!branch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        if (branch.owner.toString() === userId) {
            await Branch.findByIdAndUpdate(id,
                { $set: req.body }, { new: true }
            )

            const updated = await Branch.findById(id).select('-comments -views -likes')
            res.status(200).json({ message: 'Branch is Updated', updated })
        }

        res.status(400).json({ message: 'You have not right for this' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }

})


export const deleteBranch = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const account = await Account.findById(userId)
        if (!account) {
            res.status(404).json({ message: 'Account is not Found' })
        }

        const branch = await Branch.findById(id)
            .select('-comments -views -likes')
        if (!branch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        if (branch.owner.toString() === userId) {
            const branchIndex = account.branch.indexOf(id)
            if (branchIndex !== -1) {
                account.branchCount -= 1
                account.branch.splice(branchIndex, 1)

                await account.save()
            }

            const deleted = await Branch.findByIdAndDelete(id)
            res.status(200).json({ message: 'Branch is Deleted' })
        }

        res.status(400).json({ message: 'You have not right for this' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const addComment = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Please check your request', errors })
    }
    const userId = req.userId
    const { id } = req.params
    const { text } = req.body

    try {

        const branch = await Branch.findById(id)
            .select('-views -likes')
            .populate('comments')
        if (!branch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        const newComment = {
            text: text,
            owner: userId
        }

        branch.commentsCount += 1
        branch.comments.push(newComment)

        await branch.save()
        res.status(200).json({ branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const deleteComment = asyncHandler(async (req, res) => {
    const userId = req.userId
    const { branchId, commentId } = req.params

    try {
        const branch = await Branch.findById(branchId)
            .select('-views -likes').populate('comments')
        if (!branch) {
            res.status(404).json({ message: 'Branch is not found' })
        }

        const comment = branch.comments.id(commentId)
        if (!comment) {
            res.status(404).json({ message: 'Sorry But Comment is not found' })
        }

        if (comment.owner.toString() !== userId) {
            res.status(400).json({ message: 'You have not rights for this' })
        }

        branch.commentsCount -= 1
        branch.comments.remove(commentId)

        await branch.save()
        res.status(200).json({ branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getComments = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const branch = await Branch.findById(id)
            .select('comments')
            .populate({ path: 'comments', select: '-likes' })
        if (!branch) {
            res.status(404).json({ message: 'Branch is nto found' })
        }

        res.status(200).json({ branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})


export const getLikes = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const branch = await Branch.findById(id)
            .select('likesCount likes')
            .populate({ path: 'likes', select: 'username image' })
        if (!branch) {
            res.status(404).json({ message: 'Branch is nto found' })
        }

        res.status(200).json({ branch })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Sorry Error in Server' })
    }
})

