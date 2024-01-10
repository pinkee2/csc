const mongoose = require('mongoose')
const allServiceSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    }
}, { timestamps: true })
const serviceModel = mongoose.model('service', allServiceSchema)
module.exports = serviceModel