import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const CuisinesSchema = new mongoose.Schema({

    shopId: {
        type: ObjectId,
        requried: [true, "Shop id is requried"]
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: {
            values: ['AVAILABLE', 'UNAVAILABLE'],
            message: '{values} is not a valid'
        },
        default: 'AVAILABLE'
    },

    description: {
        type: String,
        default: ""
    },

    // ignore property below because of Brigt
    quantity: {
        type: Number,
        default: 1
    },

    thumbnail: {
        type: String,
        requried: [true, "Cuisine thumbnail is needed"]
    }

});


const CuisineModel = mongoose.model("Cuisine", CuisinesSchema);

export default CuisineModel;