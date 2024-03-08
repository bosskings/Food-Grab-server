import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number }
})

const OrdersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    items: {
        type: [itemsSchema],
        required: true
    },

    shop: {
        type: mongoose.Types.ObjectId,
        ref: 'Shop',
    },

    courier: {
        type: mongoose.Types.ObjectId,
        ref: 'courier'
    },

    requestTime: {
        type: Date,
    },

    deliveryTime: {
        type: Date,
    },

    requestStatus: {
        type: String,
        enum: {
            values: ['DELIVERED', 'PENDING', 'DECLINED'],
            message: "invalid selection"
        }
    },

    deliveryStatus: {
        type: String,
        enum: {
            values: ['ON_ROUTE', 'ARRIVED', 'DELIVERD'],
            message: "invalid selection"
        }
    },

    totalPrice: {
        type: Number
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