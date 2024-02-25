import mongoose from 'mongoose'


const mesage = new mongoose.Schema({
    text: { type: String },
    file: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewed: { type: Boolean, default: false }
})

const Chat = new mongoose.Schema({
    first: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    second: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [mesage]
})


export default mongoose.model('Chat', Chat)
