const mongoose = require('mongoose')
const insuranceSchema = new mongoose.Schema({
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
    category: {
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
    rc_img: {
        type: String,
        required: true
    },
    owner_id_img: {
        type: String,
        required: true
    },
    old_insurance_img: {
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
const insuranceModel = mongoose.model('insurance', insuranceSchema)
module.exports = insuranceModel