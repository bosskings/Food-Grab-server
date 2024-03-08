import ShopModel from "../../models/Shop.js";
import CuisineModel from "../../models/Cuisine.js";
import OrdersModel from "../../models/Order.js";


const getShops = async (req, res) => {
    const shops = await ShopModel.find().sort("name");
    if (!shops || shops.length === 0) {
        return res.status(404).send("No shops found.");
    }
    res.json(shops);
};

const getCuisines = async (req, res) => {
    const cuisines = await CuisineModel.find();
    res.json(cuisines);
};

const placeOrders = async (req, res) => {
    try {
        req.body.shop = req.params.shopId;
        const order = new OrdersModel(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
};


export {
    getShops,
    getCuisines,
    placeOrders
}