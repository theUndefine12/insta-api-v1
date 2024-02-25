import mongoose from 'mongoose'



const Admin = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: true },
})

export default mongoose.model('Admin', Admin)

