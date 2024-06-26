import mongoose from "mongoose";


const contactAdressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    houseNumber: {
        type: String,
        required: true
    }

})

const MerchantSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'firstname must be provided'],
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

    verificationStatus: {
        type: String,
        enum: {
            values: [true, false],
            message: "invalid selection"
        },
        default: false
    },

    isSuspended: {
        type: String,
        enum: {
            values: [true, false],
            message: "invalid selection"
        },
        default: false
    },

    pictureAddress: {
        type: String,
        default: "https://food-grab-images.s3.amazonaws.com/merchants/avatar.gif"
    },

    recoveryToken: {
        type: String,
        default: "NULL"
    },

    shopId: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Shop',
        default: ""

    },
    regDate: {
        type: Date,
        default: Date.now
    }


});

const MerchantModel = mongoose.model('Merchant', MerchantSchema);

export default MerchantModel;