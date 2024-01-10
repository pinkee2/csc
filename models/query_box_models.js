const mongoose = require('mongoose')
const querySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    phone_no: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    concern: {
        type: String,
        required: false
    }
}, { timestamps: true })

const queryBoxModel = mongoose.model('querybox', querySchema)
module.exports = queryBoxModel