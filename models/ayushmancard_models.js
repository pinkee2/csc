const mongoose = require('mongoose')
const ayushmancardSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    aadhar_linked_phon_no: {
        type: String,
        required: true
    },
    category_detail: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    aadhar_img: {
        type: String,
        required: true
    },
    user_img: {
        type: String,
        required: true
    },
    other_file1: {
        type: String,
        required: false
    },
    other_file2: {
        type: String,
        required: false
    },
    other_file3: {
        type: String,
        required: false
    },
    other_details1: {
        type: String,
        required: false
    },
    other_details2: {
        type: String,
        required: false
    },
    other_details3: {
        type: String,
        required: false
    },
    approve_status: {
        type: String,
        required: false,
        default:0
    },
}, { timestamps: true })

const AyushmanCard_Model = mongoose.model('ayushmancard', ayushmancardSchema)
module.exports = AyushmanCard_Model