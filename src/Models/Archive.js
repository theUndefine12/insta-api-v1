import mongoose from 'mongoose'


const Archive = new mongoose.Schema({
    histories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'History' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.model('Archive', Archive)
