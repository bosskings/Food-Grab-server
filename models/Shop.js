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
        type: ObjectId
    },
    shopName: {
        type: String
    },
    description: {
        type: String
    },
    address: {
        type: contactAdressSchema
    },
    logo: {
        type: String
    },
    backdropPic: {
        type: String
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
        ref: 'Finance'
    },

    type: {
        type: String,   //either can be present or not
        enum: {
            values: ['RESTAURANT', 'CHEFF'],
            message: "invalid selection"
        }
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