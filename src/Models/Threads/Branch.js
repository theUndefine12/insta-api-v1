import mongoose from 'mongoose'


const comment = new mongoose.Schema({
    text: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
})

const Branch = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    commentsCount: { type: Number, default: 0 },
    comments: [comment],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
})

export default mongoose.model('Branch', Branch)
