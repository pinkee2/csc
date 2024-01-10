const mongoose = require('mongoose')
const otherFormSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
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
    user_img: {
        type: String,
        required: true
    },
    aadhar_img: {
        type: String,
        required: true
    },
    signature_img: {
        type: String,
        required: true
    },
    tenth_result_img: {
        type: String,
        required: true
    },
    add_document: {
        type: String,
        required: false
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
    approve_status: {
        type: String,
        required: false,
        default: 0
    }
}, { timestamps: true })
const otherFormModel = mongoose.model('otherform', otherFormSchema)
module.exports = otherFormModel