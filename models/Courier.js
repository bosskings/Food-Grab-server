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
    houseNumber: {
        type: String,
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
        required: true
    },

    lastName: {
        type: String,
        required: true,
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
        required: [true, 'Please provide an email address']
    },

    password: {
        type: String,
        require: [true, "Password is required"]
    },

    vehicleType: {
        type: String,
        enum: ['CAR', 'MOTORCYCLE', 'BICYCLE'],
        default: ""
    },

    gender: {
        type: String,
        enum: ['MALE', 'FEMALE'],
        required: true
    },

    passportPhoto: {
        type: String,
        // required: true
        default: ""
    },

    driversLicensePhoto: {
        type: String,
        // required: [true, 'Drivers license must be provded']
        default: ""
    },

    vehicleParticularsPhoto: {
        type: String,
        // required: [true, 'A picture of your vehicl particulars are needed']
        default: ""
    },

    address: {
        type: ContactAddress
    },

    walletBalance: {
        type: String,
        default: 0.00,
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
        type: mongoose.Schema.Types.Mixed,  //this will be the id of Order model
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
