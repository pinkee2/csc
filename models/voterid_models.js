const mongoose = require('mongoose')
const voteridSchema = new mongoose.Schema({
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
    mother_name: {
        type: String,
        required: true, 
    },
    aadhar_linked_phon_no: {
        type: String,
        required: true, 
    },
    message: {
        type: String,
        required: true, 
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
        required: true, 
    },
    aadhar_img: {
        type: String,
        required: true, 
    },
    family_voterid_img: {
        type: String,
        required: true,
    },
    signature_img: {
        type: String,
        required: true, 
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
const VoterID_Model = mongoose.model('voterId', voteridSchema)
module.exports = VoterID_Model
