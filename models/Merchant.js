import mongoose from "mongoose";


const contactAdressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    houseNumber: String

})

const RidersSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'fullname must be provided']
    },
    email: {
        type: String,
        required: [true, 'Email must be procided']
    },
    password: {
        type: String,
        required: [true, 'password is needed']
    },
    phone: {
        type: String,
    },
    contactAdress: {
        type: contactAdressSchema,
    },
    NIN: {
        type: Number,
        unique: [true, 'a user with This NIN already exists']
    },
    shops: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop'
        }
    ]


});

const MerchantModel = mongoose.model('Merchant', RidersSchema);

export default MerchantModel;