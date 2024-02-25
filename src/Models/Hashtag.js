import mongoose from 'mongoose'


const Hashtag = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    postCount: { type: Number, default: 0 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

export default mongoose.model('Hashtag', Hashtag)

