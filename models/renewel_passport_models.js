const mongoose = require('mongoose')
const renewelPassportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
    mother_name: {
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
    aadhar_img: {
        type: String,
        required: true
    },
    pancard_img: {
        type: String,
        required: false
    },
    tenth_marksheet_img: {
        type: String,
        required: false
    },
    old_passport_or_fir_img: {
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
    input1: {
        type: String,
        required: false
    },
    input2: {
        type: String,
        required: false
    },
    document1: {
        type: String,
        required: false
    },
    document2: {
        type: String,
        required: false
    },
    approve_status: {
        type: String,
        required: false,
        default: 0
    },
}, { timestamps: true })
const renewelPassportModel = mongoose.model('renewelpassport', renewelPassportSchema)
module.exports = renewelPassportModel