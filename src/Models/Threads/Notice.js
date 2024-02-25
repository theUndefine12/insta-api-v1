import mongoose from 'mongoose'


const Notice = new mongoose.Schema({
    count: { type: Number, default: 0 },
    notices: [{ type: Array, default: [] }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: { createdAt: true } })

export default mongoose.model('Notice', Notice)

