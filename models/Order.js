import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    cuisineId: { type: mongoose.Types.ObjectId, ref: 'cuisine', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number }
})

const OrdersSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },

    items: {
        type: [itemsSchema],
        required: true
    },

    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'shops',
    },
    cuisineId: {
        type: mongoose.Types.ObjectId,
        ref: 'cuisines'
    },

    courier: {
        type: mongoose.Types.ObjectId,
        ref: 'courier'
    },

    requestTime: {
        type: Date,
        default: Date.now
    },

    deliveryTime: {
        type: Date,
    },

    requestStatus: {
        type: String,
        enum: {
            values: ['DELIVERED', 'PENDING', 'DECLINED'],
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
        type: Number
    },

    requestNote: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }


});


const OrdersModel = mongoose.model("Orders", OrdersSchema);
export default OrdersModel;



// export const getAllProducts = async () => {
//     try {
//         const products = await ProductsModel.find();
//         return products;
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const addProduct = async (product) => {
//     const newProduct = new ProductsModel(product);
//     const res = await newProduct.save();
//     return res;
// };

// export const updateProduct = async (id, product) => {
//     const updatedProduct = await ProductsModel.updateOne({ _id: id }, { ...product, dateModified: Date.now() });
//     const updatedProduct = await ProductsModel.updateOne({ _id: id }, { ...product, dateModified: Date.now() });
//     const updatedProduct = await Products