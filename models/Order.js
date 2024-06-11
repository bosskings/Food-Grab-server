import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    cuisineId: { type: mongoose.Types.ObjectId, ref: 'cuisine', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    cuisineImage: { type: String },
    quantity: { type: Number, default: 0 }
})

const OrdersSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: [true, "User id must be provided"]
    },

    items: {
        type: [itemsSchema],
        required: true
    },

    shopId: {
        type: ObjectId,
        ref: 'Shop',
        required: [true, "Shop sid must be provided"]

    },

    courier: {
        type: ObjectId,
        ref: 'Courier'
    },

    requestStatus: {
        type: String,
        enum: {
            values: ['DELIVERED', 'PENDING', 'DECLINED', 'PROCESSING', 'IN-TRANSIT'],
            message: "invalid selection"
        },
        default: "PENDING"
    },

    deliveryStatus: {
        type: String,
        enum: {
            values: ['ON_ROUTE', 'ARRIVED', 'DELIVERD', 'STATIC'],
            message: "invalid selection"
        },
        default: "STATIC"
    },

    totalPrice: {
        type: Number,
        default: 0
    },

    requestNote: {
        type: String,
        default: ""
    },

    paymentStatus: {
        type: String,
        enum: {
            values: ["PAID", "UNPAID", "PROCESSING"],
            message: "Invalid Payment Status!"
        },
        default: "UNPAID"
    },

    paymentMethod: {
        type: String,
        enum: {
            values: ["GRAB_WALLET", "BANK", "CREDIT_CARD"]
        },
        default: "GRAB_WALLET",
    },

    deliveryAddress: {
        type: String,
        requried: [true, "address is needed"]
    },

    date: {
        type: Date,
        default: Date.now
    }


});


const OrdersModel = mongoose.model("Orders", OrdersSchema);
export default OrdersModel;


