import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({

    merchandId: {
        type: Number
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    address: {
        type: String
    },
    logo: {
        type: String
    },
    backdropPicture: {
        type: String
    },
    rating: {
        type: Number
    },  //out of 5 stars
    type: {
        type: String,   //either can be present or not
        enum: {
            values: ['Restaurant', 'Chef'],
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