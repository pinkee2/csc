const mongoose = require('mongoose')
const eshramcardSchema = new mongoose.Schema({
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
    mother_name: {
        type: String,
        required: true
    },
    aadhar_linked_phon_no: {
        type: String,
        required: true
    },
    work_profile: {
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
        default:0
    },

}, { timestamps: true })
const EshramCard_Model = mongoose.model('eshramcard', eshramcardSchema)
module.exports = EshramCard_Model
