import mongoose from 'mongoose'


const History = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 }
}, { timestamps: true })

export default mongoose.model('History', History)
