const mongoose = require('mongoose')
const answerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true })
const answerModel = mongoose.model('answer', answerSchema)
module.exports = answerModel