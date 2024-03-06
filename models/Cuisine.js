import mongoose from "mongoose";


const CuisinesSchema = new mongoose.Schema({

    shopId: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String
    },
    status: {
        type: Boolean, default: false //
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