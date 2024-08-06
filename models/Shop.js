import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// const contactAdressSchema = new mongoose.Schema({
//     street: String,
//     city: String,
//     state: String,
//     houseNumber: String

// })

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
    shopAddress: {
        type: String,
        default: "Mile 3 A231, Diobu, Port Harcourt",
    },
    shopCoordinate: {
        lat: {
            type: String,
            required: [true, "Latitude is required"],
            default: "4.801833109864084"
        },
        long: {
            type: String,
            required: [true, "Longitude is required"],
            default: "6.990486258631807"
        }

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
        default: "RESTAURANT"
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