import mongoose from "mongoose";


const contactAdressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    houseNumber: String

})

const MerchantSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname must be provided']
    },
    lastname: {
        type: String,
        required: [true, 'lastname must be provided']
    },
    email: {
        type: String,
        required: [true, 'Email must be provided'],
        unique: true
    },
    emailVerificationStatus: {
        type: String,
        default: "Not Verified"
    },
    password: {
        type: String,
        required: [true, 'password is needed']
    },
    phone: {
        type: String,
        required: [true, 'phone must be provided'],
        unique: true
    },
    contactAdress: {
        type: contactAdressSchema,
    },
    NIN: {
        type: String,
        required: true,
        unique: [true, 'a user with This NIN already exists']
    },
    walletBalance: {
        type: Number,
        default: 0.00,
    },
    financeActivities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    },

    pictureAddress: {
        type: String,
        default: "https://food-grab-images.s3.amazonaws.com/email/top-view-table.jpg"
    },

    shops: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'

    },
    regDate: {
        type: Date
    }


});

const MerchantModel = mongoose.model('Merchant', MerchantSchema);

export default MerchantModel;