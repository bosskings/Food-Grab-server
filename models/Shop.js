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
        type: Number
    },  //out of 5 stars
    approvalStatus: {
        type: String,
        enum: {
            values: ['PENDING', 'APPROVED', 'DECLINED'],
            message: 'Invalid selection'
        }
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
            type: mongoose.Schema.Types.Mixed,     //can contain multiple types like [String] or [{type : String}]
            ref: 'Cuisine'
        }
    ],

    reviews: [
        {
            type: mongoose.Schema.Types.Mixed,
            ref: 'Review'
        }
    ],

});

const ShopModel = mongoose.model('Shop', ShopSchema);

export default ShopModel;