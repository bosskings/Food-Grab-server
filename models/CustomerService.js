import mongoose from "mongoose";


const CustomerService = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    fullname: {
        type: String,
        required: true
    },

    userType: {
        type: String,
        enum: {
            values: ['MERCHANT', 'USER'],
            message: "invalid selection for user type"
        }
    },

    phone: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        required: true,
    }

});



const CustomerServiceModel = mongoose.model('CustomerService', CustomerService);

export default CustomerServiceModel;