import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname must be provided"]
    },
    email: {
        type: String
    },
    phone: {
        type: String
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