const mongoose = require('mongoose')
const questionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: false
    }
}, { timestamps: true })

const questionModel = mongoose.model('question', questionSchema)
module.exports = questionModel