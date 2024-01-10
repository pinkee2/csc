const mongoose = require('mongoose')
const aadharAddressSchema = new mongoose.Schema({
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
    address_proof_img: {
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
const aadharAddressModel = mongoose.model('aadharaddresschange', aadharAddressSchema)
module.exports = aadharAddressModel