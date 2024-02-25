import mongoose from 'mongoose'



const Account = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    instagram: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Public', 'Closed'], default: 'Public' },
    branchCount: { type: Number, default: 0 },
    subscribersCount: { type: Number, default: 0 },
    subscriptionCount: { type: Number, default: 0 },
    branch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    subscription: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
    bio: { type: String, required: true },
    links: [{ type: String, default: 0 }]
})

export default mongoose.model('Account', Account)
