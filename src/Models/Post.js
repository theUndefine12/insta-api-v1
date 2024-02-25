import mongoose from 'mongoose'


const comment = new mongoose.Schema({
    text: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: { createdAt: 'createdAt' } })

const Post = new mongoose.Schema({
    name: { type: String, required: true },
    images: { type: String, required: true },
    description: { type: String, required: true },
    hashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hashtag' }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [comment],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: { createdAt: true } })


export default mongoose.model('Post', Post)
