const mongoose = require('mongoose')
const pancardSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required:true,
    },
    name: {
        type: String,
        required: true, 
    },
    father_name: {
        type: String,
        required: true, 
    },
    phone_no: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true, 
    },
    message: {
        type: String,
        required: false, 
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
    aadhar_img_name: {
        type: String
    },
    user_img_name: {
        type: String
    },
    aadhar_img: {
        type: String,
        required: true, 
    },
    user_img: {
        type: String,
        required: true, 
    },
    signature_img: {
        type: String,
        require: true
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
const PanCard_Model = mongoose.model('pancard', pancardSchema)
module.exports = PanCard_Model
