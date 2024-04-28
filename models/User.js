import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname must be provided"]
    },
    email: {
        type: String,
        required: [true, "Email must be provided"]

    },
    emailVerificationStatus: {
        type: String,
        default: "Not Verified"
    },
    phone: {
        type: String,
        default: ""
    },
    walletBalance: {
        type: Number,
        default: 0.00,
    },
    financeActivities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    },

    isSuspended: {
        type: String,
        enum: {
            values: [true, false],
            message: "invalid selection"
        },
        default: false
    },

    defaultLocation: {
        type: String,
        default: ""
    },
    currentLocation: {
        type: String,
        default: ""

    },
    password: {
        type: String,
        required: [true, "password is needed"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const UserModel = mongoose.model('User', UserSchema);

export default UserModel;