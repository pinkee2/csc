const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    sub_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subadmin',
        required: true
    },
    message: {
        type: String,
        required: true
    },
}, { timestamps: true })

const chatModel = mongoose.model('chat', chatSchema)
module.exports = chatModel