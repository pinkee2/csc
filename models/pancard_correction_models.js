const mongoose = require('mongoose')
const pancardCorrectionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    father_name: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    email: {
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
    aadhar_img: {
        type: String,
        required: true
    },
    user_img: {
        type: String,
        required: true
    },
    signature_img: {
        type: String,
        require: true
    },
    correction_proof_img: {
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

    approve_status: {
        type: String,
        required: false,
        default: 0
    }
}, { timestamps: true })
const pancardCorrectionModel = mongoose.model('pancardcorrection', pancardCorrectionSchema)
module.exports = pancardCorrectionModel
