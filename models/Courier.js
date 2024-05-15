import mongoose from "mongoose";

const ContactAddress = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        default: ""
    },
    state: {
        type: String,
        required: false,
        default: ""
    },
    street: {
        type: String,
        required: true,
        default: ""
    },
    number: {
        type: Number,
        required: true,
        default: ""
    }
})


const AccountInformation = new mongoose.Schema({
    accountName: {
        type: String,
        required: true,
        default: ""
    },
    bank: {
        type: String,
        required: true,
        default: ""
    },
    accountNumber: {
        type: String,
        required: true,
        default: ""
    },

})


const CourierSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        default: ""
    },

    lastName: {
        type: String,
        required: true,
        default: ""
    },

    DOB: {
        type: Date,
        required: true,
        default: ""
    },

    NIN: {
        type: String,
        unique: true,
        required: true,
        default: ""
    },

    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        default: ""
    },

    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        default: ""
    },

    password: {
        type: String,
        require: [true, "Password is required"],
        default: ""
    },

    vehicleType: {
        type: String,
        enum: ['CAR', 'MOTORCYCLE', 'BICYCLE'],
        default: ""
    },

    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },

    passportPhoto: {
        type: String,
        required: true
    },

    address: {
        type: ContactAddress
    },

    walletBalance: {
        type: String,
        default: 0.00,
    },

    rides: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        default: ""
    },

    accountInfo: {
        type: AccountInformation
    },

    status: {
        type: String,
        enum: ['ONLINE', 'OFFLINE', 'BUSY'],
        default: "OFFLINE"
    },

    verificationStatus: {
        type: String,
        enum: ['VERIFIED', 'DECLINED', 'PROCESSING'],
        default: "PROCESSING"
    },

    orders: {
        type: mongoose.Schema.Types.ObjectId,  //this will be the id of Order model
        ref: 'Order',                     //the name of our model
        default: ""
    },

    isSuspended: {
        type: String,
        enum: {
            values: [true, false],
            message: "invalid selection"
        },
        default: false
    },

    financeActivities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    },

    regDate: {
        type: Date,
        default: Date.now
    }


})

const CourierModel = mongoose.model('Courier', CourierSchema);
export default CourierModel;  
