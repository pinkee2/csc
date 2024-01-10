const mongoose = require('mongoose')

const railwayTicketSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    train_no: {
        type: String,
        required: true
    },
    ticket_category: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    passengers: {
        type: [
            {
                name: {
                    type: String,
                    required: false
                },
                age: {
                    type: String,
                    required: false
                },
                gender: {
                    type: String,
                    required: false
                }
            }
        ],
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
    irctc_train_status_img: {
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
const railwayTicketModel = mongoose.model('railwayticket', railwayTicketSchema)
module.exports = railwayTicketModel