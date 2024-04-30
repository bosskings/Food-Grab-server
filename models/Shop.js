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
        required: [true, "merchant id is needed"]

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
        default: "https://food-grab-images.s3.amazonaws.com/shops/shop.jpg"
    },
    backdropPic: {
        type: String,
        default: ""
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance',
        default: ""
    },

    type: {
        type: String,   //either can be present or not
        enum: {
            values: ['RESTAURANT', 'CHEFF'],
            message: "invalid selection"
        },
        default: "RESTAUTANT"
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