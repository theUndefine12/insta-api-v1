import mongoose from 'mongoose'



const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    threads: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    password: { type: String, required: true },
    isHistory: { type: Boolean, default: false },
    histories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'History' }],
    status: { type: String, enum: ['Public', 'Closed'], default: 'Public' },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    postsCount: { type: Number, default: 0 },
    subscribersCount: { type: Number, default: 0 },
    subscriptionCount: { type: Number, default: 0 },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscription: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    aboutMe: { type: String, required: true },
})

export default mongoose.model('User', User)
