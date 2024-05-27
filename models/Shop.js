import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const contactAdressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    houseNumber: String

})

const ShopSchema = new mongoose.Schema({

    merchantId: {
        type: ObjectId,
        required: [true, "merchant id is needed"]
    },
    shopName: {
        type: String,
        required: [true, "shop name is needed"]

    },
    description: {
        type: String,
        required: [true, "Description is needed"]
    },
    address: {
        type: contactAdressSchema
    },
    logo: {
        type: String,
        required: [true, 'shop logo is needed']
    },
    backdropPic: {
        type: String,
        required: [true, 'shop cover image is needed']

    },
    rating: {
        type: Number,
        default: 0
    },  //out of 5 stars

    walletBalance: {
        type: Number,
        default: 0.00,
    },
    financeActivities: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Finance',
        default: ""
    },

    type: {
        type: String,   //either can be present or not
        enum: {
            values: ['RESTAURANT', 'CHEF'],
            message: "invalid selection for merchant type"
        },
        default: "RESTAUTANT"
    },

    status: {
        type: String,
        enum: {
            values: ['ACTIVE', 'INACTIVE'],
            message: "Your selection for status is wrong."
        },
        default: "INACTIVE"
    },

    cuisines: [
        {
            type: mongoose.Schema.Types.ObjectId,     //can contain multiple types like [String] or [{type : String}]
            ref: 'Cuisine'
        }
    ],

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

});

const ShopModel = mongoose.model('Shop', ShopSchema);

export default ShopModel;