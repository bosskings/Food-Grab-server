import ShopModel from "../../models/Shop.js";
import CuisineModel from "../../models/Cuisine.js";
import OrdersModel from "../../models/Order.js";

// display all shops
const getShops = async (req, res) => {

    try {
        //find out the amount of shops need from query param
        const { amount, search } = req.query;
        if (amount || Number(amount) || amount > 0) {

            const shops = await ShopModel.find({}, "-__v").limit(Number(amount)).sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        } else if (search) {

            const shops = await ShopModel.find({}, "-__v").sort(search);
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        } else {
            const shops = await ShopModel.find({}, "-__v").sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });


        }

    } catch (error) {
        return res.status(404).json({
            status: "FAILED",
            data: "shops could not be fetched"
        });
    }

};

// get a single shop
const getSingleShop = async (req, res) => {

    try {
        const { id } = req.params;

        const shop = await ShopModel.findById(id);
        return res.status(200).json({
            status: 'SUCCESS',
            data: shop
        });

    } catch (error) {
        return res.status(404).json({
            status: 'FAILED',
            mssg: error
        })
    }

};

const getCuisines = async (req, res) => {

    try {
        //find out the name or amount of cuisines needed from query param
        const { amount, search } = req.query;
        if (amount && Number(amount) && amount > 0) {

            const cuisines = await CuisineModel.find({}, "-__v").limit(Number(amount)).sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS.",
                data: cuisines
            });

        } else if (search) {

            const cuisines = await CuisineModel.find({}, "-__v").sort(search);
            return res.status(200).json({
                status: "SUCCESS..",
                data: cuisines
            });

        } else {

            const cuisines = await CuisineModel.find({}, "-__v").sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS...",
                data: cuisines
            });

        }

    } catch (error) {
        return res.status(404).json({
            status: "FAILED",
            data: "Dish could not be fetched"
        });
    }
};



// get a single cuisine
const getSignleCousine = async (req, res) => {
    // fetch a single item based on id

    try {
        const { _id } = req.params;
        const cousine = await CuisineModel.findById({ _id });
        if (!cousine) {
            return res.status(404).json({
                status: 'FAILED',
                message: `No cuisine with the id of ${_id}`
            });

        } else {
            return res.status(200).json({
                status: 'SUCCESS',
                data: cousine
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: 'FAILED',
            message: `Network Error Please try again`
        });
    }

};

const placeOrders = async (req, res) => {
    try {
        const { shopId, requestNote, items } = req.body

        let totalPrice = 0;

        items.map((item) => {
            totalPrice += item.price * item.amount;
        })

        let orderItem = new OrdersModel({

            userId: req.user._id,
            shopId, // Assuming shopId is defined somewhere in your code
            totalPrice,
            requestNote, // Assuming requestNote is defined somewhere in your code
            items
        });

        let result = await orderItem.save();

        if (result) {
            return res.status(201).json({
                status: "SUCCESS",
                mssg: `${items.length} number of Orders Placed Successfully!`,
                data: result
            });

        } else {
            return res.status(400).json({
                status: "FAILED",
                message: "No orders were placed, Please try again."
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'FAILED',
            message: `Unexpected Server Error. Please try again. ${err}`
        });
    }
};


export {
    getShops,
    getSingleShop,
    getCuisines,
    getSignleCousine,
    placeOrders
}