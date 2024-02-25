import mongoose from 'mongoose'


const Favorite = new mongoose.Schema({
    count: { type: Number, default: 0 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model('Favorite', Favorite)
