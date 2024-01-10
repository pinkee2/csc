const mongoose = require('mongoose')
const documentSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }
}, { timestamps: true })
const documentModel = mongoose.model('document', documentSchema)
module.exports=documentModel