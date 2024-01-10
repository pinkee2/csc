const mongoose = require('mongoose')
const lostReportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
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
    father_name: {
        type: String,
        required: true
    },
    email: {
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
    fir_content_img: {
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
const lostReportModel = mongoose.model('lostreport', lostReportSchema)
module.exports = lostReportModel
