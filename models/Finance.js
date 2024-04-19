import mongoose from "mongoose";

const FinanceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    userType: {
        type: String,
        enum: ['USER', 'MERCHANT', 'RIDER']
    },

    activityType: {
        type: String,
        enum: ['DEPOSIT', 'WITHDRAWAL']
    },

    amount: {
        type: Number,
        default: 0.00
    },

    balance: {
        type: Number,
        default: 0.00
    },

    date: {
        type: Date
    }

})


const FinanceModel = mongoose.model('Finance', FinanceSchema)

export default FinanceModel