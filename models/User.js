import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname must be provided"]
    },
    email: {
        type: String
    },
    emailVerificationStatus: {
        type: String,
        default: "Not Verified"
    },
    phone: {
        type: String
    },
    walletBalance: {
        type: Number,
        default: 0.00,
    },
    financeActivities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    },
    defaultLocation: {
        type: String
    },
    currentLocation: {
        type: String
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const UserModel = mongoose.model('User', UserSchema);

export default UserModel;