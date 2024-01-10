const mongoose = require('mongoose')
const pfNominationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    uan_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    withdraw_amount: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
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
    bank_passbook_or_cheque_img: {
        type: String,
        required: true
    },
    pancard_img: {
        type: String,
        required: true
    },
    nominee_aadhar_img: {
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
const pfNominationModel = mongoose.model('pfnomination', pfNominationSchema)
module.exports = pfNominationModel
