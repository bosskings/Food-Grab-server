import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const CuisinesSchema = new mongoose.Schema({

    shopId: {
        type: ObjectId
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    status: {
        type: String,
        enum: {
            values: ['AVAILABLE', 'UNAVAILABLE'],
            message: '{values} is not a valid'
        },
        default: 'UNAVAILABLE'
    },
    description: {
        type: String
    },
    thumbnail: {
        type: String
    }

});


const CuisineModel = mongoose.model("Cuisine", CuisinesSchema);

export default CuisineModel;