const mongoose = require('mongoose')
const ayushmanAddressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    aadhar_number: {
        type: String,
        required: true
    },
    aadhar_linked_phone_no: {
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
const ayushmanAddressModel = mongoose.model('ayushmanaddresschange', ayushmanAddressSchema)
module.exports = ayushmanAddressModel