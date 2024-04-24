import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "userid is needed"]
    },
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop',
        required: [true, "Shopid is needed"]

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