import express from "express";
import ShopModel from "../../models/Shop.js";
import CuisineModel from "../../models/Cuisine.js";
import OrdersModel from "../../models/Order.js";

const shopsRouter = express.Router();
const cuisinesRouter = express.Router();
const ordersRouter = express.Router(); // to access the shopId through params


shopsRouter.get("/:name", async (req, res) => {
    const shops = await ShopModel.find().sort("name");
    if (!shops || shops.length === 0) {
        return res.status(404).send("No shops found.");
    }
    res.json(shops);
});

cuisinesRouter.get("/", async (req, res) => {
    const cuisines = await CuisineModel.find();
    res.json(cuisines);
});

ordersRouter.post("/", async (req, res) => {
    try {
        req.body.shop = req.params.shopId;
        const order = new OrdersModel(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});


export {
    shopsRouter,
    cuisinesRouter,
    ordersRouter
}