import mongoose from "mongoose";

const ContactAddress = new mongoose.Schema({

    city: { type: String, required: true },
    state: { type: String, required: false },
    street: { type: String, required: true },
    number: { type: Number, required: true }

})


const AccountInformation = new mongoose.Schema({
    accountName: { type: String, required: true },
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },

})


const CourierSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    DOB: {
        type: Date,
        required: true
    },

    NIN: {
        type: String,
        unique: true,
        required: true
    },

    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],

    },

    email: {
        type: String,
        required: [true, 'Please provide an email address'],
    },

    password: {
        type: String,
        require: [true, "Password is required"]
    },

    vehicleType: {
        type: String,
        enum: ['CAR', 'MOTORCYCLE', 'BICYCLE']
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
        ref: 'orders'
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
        ref: 'Order'                          //the name of our model
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

const CuisineModel = mongoose.model('Courier', CourierSchema);
export default CuisineModel;  
