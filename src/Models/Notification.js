import mongoose from 'mongoose'


const Notification = new mongoose.Schema({
    count: { type: Number, default: 0 },
    notifications: [{ type: Array, default: [] }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: { createdAt: true } })

export default mongoose.model('Notification', Notification)

