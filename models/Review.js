import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop'
    },
    review: {
        type: String,
        required: [true, 'Review must inputed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


});

const ReviewsModel = mongoose.model('Review', ReviewsSchema);

export default ReviewsModel;