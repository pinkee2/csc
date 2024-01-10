const mongoose = require('mongoose')
const upRationCardSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    father_name: {
        type: String,
        required: true
    },
    mother_name: {
        type: String,
        required: true
    },
    husband_name: {
        type: String,
        required: true
    },
    rashan_cotedar_name: {
        type: String,
        required: true
    },
    bijli_bil_no: {
        type: String,
        required: false
    },
    gas_connection_no: {
        type: String,
        required: false
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
    bank_passbook_img: {
        type: String,
        required: true
    },

    family_aadhar_img: {
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
const upRationCardModel = mongoose.model('uprationcard', upRationCardSchema)
module.exports = upRationCardModel
