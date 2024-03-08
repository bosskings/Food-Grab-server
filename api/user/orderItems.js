import ShopModel from "../../models/Shop.js";
import CuisineModel from "../../models/Cuisine.js";
import OrdersModel from "../../models/Order.js";


const getShops = async (req, res) => {

    try {
        //find out the amount of shops need from query param
        const { amount, search } = req.query;
        if (!amount || isNaN(Number(amount)) || amount < 1) {

            const shops = await ShopModel.find({}, "__v").sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        } else if (search) {

            const shops = await ShopModel.find({}, "__v").sort(search);
            return res.status(200).json({
                status: "SUCCESS",
                data: shops
            });

        } else {

            const shops = await ShopModel.find({}, "__v").limit(Number(amount)).sort({ createdAt: -1 });
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

const getCuisines = async (req, res) => {

    try {
        //find out the name or amount of cuisines needed from query param
        const { amount, search } = req.query;
        if (!amount || isNaN(Number(amount)) || amount < 1) {

            const cuisines = await CuisineModel.find({}, "__v").sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS",
                data: cuisines
            });

        } else if (search) {

            const cusiines = await CuisineModel.find({}, "__v").sort(search);
            return res.status(200).json({
                status: "SUCCESS",
                data: cusiines
            });

        } else {

            const cusiines = await ShopModel.find({}, "__v").limit(Number(amount)).sort({ createdAt: -1 });
            return res.status(200).json({
                status: "SUCCESS",
                data: cusiines
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
        const { price, item, amount, shopId } = req.body;
        const order = new OrdersModel({
            userId: req.user._id, //get the _id from the current logged in user
            dishId: item,
            shopId: shopId,
            amount,
            totalPrice: price * amount
        })
        order = await order.save();

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
};


export {
    getShops,
    getCuisines,
    getSignleCousine,
    placeOrders
}